/* Data access layer.
 *
 * PROTOTYPE mode ("local"): everything, answer key included, comes from ./data/.
 * Fine for development; anyone can read the key straight out of the bundle.
 *
 * PRODUCTION mode ("remote"): the static site ships the free module in full and
 * nothing else of the course. Everything else lives behind the Worker in
 * ../worker/ — the answer key, the diagnostics, the model answers and the mark
 * schemes, and the notes, question stems and summaries of the paid modules. The
 * last of those is not belt-and-braces: a file under data/ is a file in the public
 * Pages repo, so a module can only really need a key if its text is not published
 * at all.
 *
 * The one rule that shapes this file: **the key is never fetched in bulk.** A
 * signed-in student pulls the handful of questions they are actually looking at,
 * plus a few ahead in the background so the click still feels instant. That way a
 * shared login does not hand over the course in twelve requests — it hands over a
 * session that has to grind through hundreds of them, against an hourly budget the
 * Worker is watching. Losing that property is how you lose the product.
 *
 * Worker contract (see ../worker/README.md):
 *   POST /auth/claim   {key, deviceId, label}       -> {token, …}
 *   POST /auth/logout                       Bearer  -> {ok}
 *   POST /keys    {ids:["ch02:A1", …]}        Bearer  -> {keys, notice?, token?}
 *   POST /written {module, itemId, kind}      Bearer  -> {key, notice?, token?}
 *   POST /content {module, parts}             Bearer  -> {notes?, questions?, summary?, …}
 */

/* Storage keys are namespaced by course id, and the id is generated from the
   course file. Two courses published under one GitHub Pages account share an
   origin, so they share localStorage: unprefixed keys meant the second course's
   token overwrote the first's and signed a paying student out of the course they
   had actually bought. For the course this kit came from the id is "lhs", so the
   keys are byte-identical to the ones already in students' browsers. */
const COURSE_ID = "precalc";

const Api = {
  courseId: COURSE_ID,
  mode: "remote", // "local" reads ./data/ including the key — development only
  base: "https://precalc-api.danypak.workers.dev",
                  // deployed 2026-08-11 from ../worker.
                  // (locally: "http://127.0.0.1:8788" against `wrangler dev`,
                  //  which is the `lhs-worker` entry in .claude/launch.json)

  tokenKey: `${COURSE_ID}-token`,
  deviceKey: `${COURSE_ID}-device`,
  accountKey: `${COURSE_ID}-account`,

  /* Whatever the server last wanted the student to know — currently only the
     "this account is being used from a lot of places" nudge. */
  notice: null,

  hadKeyKey: `${COURSE_ID}-had-key`,

  get token() { return localStorage.getItem(this.tokenKey) || null; },
  set token(v) {
    if (v) {
      localStorage.setItem(this.tokenKey, v);
      localStorage.setItem(this.hadKeyKey, "1");
    } else localStorage.removeItem(this.tokenKey);
  },

  /* Has this browser ever held a licence? Set when a token is granted and never
     cleared, because its only job is to keep the lock card from selling the
     course to somebody who has already bought it. The Worker answers an evicted
     device and a stranger identically on purpose — a 401 that distinguished them
     would tell anyone holding a key whether it was still live — so this is the
     only place the difference can be known, and it is the client's own history
     rather than anything the server said. */
  get everSignedIn() { return localStorage.getItem(this.hadKeyKey) === "1"; },

  /* The client half of the device limit: the Worker counts slots, this supplies a
     stable id for this browser. Clearing site data gets you a new id and so costs
     the account a slot — the right trade, because the alternative is a
     fingerprint that would follow the student between accounts. */
  get deviceId() {
    let id = localStorage.getItem(this.deviceKey);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID()
        : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
      localStorage.setItem(this.deviceKey, id);
    }
    return id;
  },

  /* So "it signed me out on my phone" names a device the student recognises
     rather than a UUID. */
  get deviceLabel() {
    const ua = navigator.userAgent;
    const device = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad"
      : /Android/.test(ua) ? "Android phone" : /Macintosh/.test(ua) ? "Mac"
      : /Windows/.test(ua) ? "Windows PC" : "Computer";
    const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome"
      : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "browser";
    return `${device} · ${browser}`;
  },

  /* {email, name} of whoever is signed in. The answer cards print it: a student
     who can see their own address on every explanation thinks twice before
     pasting one into the year group chat. */
  get account() {
    try { return JSON.parse(localStorage.getItem(this.accountKey) || "null"); }
    catch { return null; }
  },
  set account(v) {
    if (v) localStorage.setItem(this.accountKey, JSON.stringify(v));
    else localStorage.removeItem(this.accountKey);
  },

  /* True when the key is server-held and we have no token yet. Always false in
     local mode, so the prototype behaves exactly as it always did. */
  get locked() { return this.mode === "remote" && !this.token; },

  _cache: {},

  async _json(path) {
    if (this._cache[path]) return this._cache[path];
    const r = await fetch(path);
    if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`);
    const data = await r.json();
    this._cache[path] = data;
    return data;
  },

  async _text(path) {
    if (this._cache[path]) return this._cache[path];
    const r = await fetch(path);
    if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`);
    const data = await r.text();
    this._cache[path] = data;
    return data;
  },

  /* Errors carrying code "auth" are the ones the UI turns into an unlock card
     rather than a "something went wrong" message. "rate" gets its own wording:
     being throttled is not being signed out, and saying so saves the student a
     pointless round of sign-in attempts. */
  _err(message, code) {
    const e = new Error(message);
    if (code) e.code = code;
    return e;
  },

  async _post(path, body, { auth = true } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
      // Reached for locked notes and questions as well as for answers now, so it
      // cannot promise anything narrower than "this part".
      if (!this.token) throw this._err("Sign in with your key to open this.", "auth");
      headers.Authorization = `Bearer ${this.token}`;
    }

    let r;
    try {
      r = await fetch(`${this.base}${path}`, {
        method: "POST", headers, body: JSON.stringify(body),
      });
    } catch {
      throw this._err("No connection to the answer service. Check your network and try again.", "net");
    }

    const data = await r.json().catch(() => ({}));

    if (r.status === 401 || r.status === 403) {
      // Either the token expired, or a third device took this one's slot.
      this.token = null;
      Keys.clear();
      this._content = {};
      this._stems = {};
      this._written = {};
      throw this._err(data.error || "Your session has ended. Sign in again.", "auth");
    }
    if (r.status === 429) throw this._err(data.error || "Too many answers too quickly.", "rate");
    if (!r.ok) throw this._err(data.error || `Request failed (${r.status})`);

    // The Worker re-issues a token quietly as the old one nears its expiry.
    if (data.token) this.token = data.token;
    if (data.notice) this.notice = data.notice;
    return data;
  },

  /* ---------- sign-in ----------
   *
   * The credential is the key sent when the licence was issued, and it is the
   * only credential there is — no mailbox anywhere, so a student who has just
   * paid is studying seconds later. There were two email paths until 2026-08-12
   * (a code confirming a new device on a flagged licence, and key recovery); both
   * were removed with the Worker's mail path, because no buyer address is ever
   * collected. A lost key is replaced by hand on Telegram. */

  _grant(data) {
    if (!data.token) throw this._err("The server did not return a token.", "auth");
    this.token = data.token;
    this.account = { email: data.email, name: data.name || null };
    Keys.clear();
    this._content = {};
    this._stems = {};
    this._written = {};
    // How many devices were signed out to make room, so the UI can say it plainly
    // instead of leaving the other device to find out on its own.
    return { evicted: data.evicted || 0, devices: data.devices || 2 };
  },

  /* The whole of signing in: one key, one request, one token. */
  async claim(key) {
    if (this.mode === "local") throw new Error("Sign-in is not used in local mode");
    return this._grant(await this._post("/auth/claim", {
      key, deviceId: this.deviceId, deviceLabel: this.deviceLabel,
    }, { auth: false }));
  },

  async logout() {
    if (this.token) await this._post("/auth/logout", {}).catch(() => {});
    this.token = null;
    // Signing out on purpose is the one case where this browser really has no
    // licence any more, so the "you've been signed out" card would be wrong for
    // it. Everything else keeps the flag, which is what stops the lock card
    // selling the course to somebody who already owns it.
    localStorage.removeItem(this.hadKeyKey);
    this.account = null;
    this.notice = null;
    Keys.clear();
    this._content = {};
    this._stems = {};
    this._written = {};
  },

  /* ---------- content ----------
   *
   * Where the paid line falls:
   *
   *   free module   notes, summary, questions, answers — all static files
   *   paid modules  notes, summary and questions all from the Worker
   *
   * The summaries used to ship in the public tree as the shop window for a locked
   * module. They no longer do: a high-yield summary is the chapter distilled, so
   * eleven of them free is most of the revision value given away. What a locked
   * module shows instead is a *description* — see MODULES in app.js — which is
   * about the chapter rather than part of it.
   *
   * FREE_MODULES is named in three places and they must agree: here,
   * worker/build-content.mjs (FREE) and _internal/publish-site.py (FREE_MODULE).
   * The publish script reads the other two and refuses to build on a mismatch,
   * so drift fails a deploy instead of quietly locking or unlocking a module. */

  FREE_MODULES: ["ch01"],

  isFree(moduleId) { return this.mode === "local" || this.FREE_MODULES.includes(moduleId); },

  /* Paid content, cached for the session in memory only. Not localStorage: the
     notes are the bulk of the product, and a copy sitting in storage is a
     one-click export of the course. A key is a word; a module is the book. */
  _content: {},

  /* Stems only, cached separately from the full module. */
  _stems: {},

  /* Notes, stems and the summary arrive together in one request, so opening Learn,
     then Practice, then Summary costs one module against the budget, not three. The
     promise itself is cached, which also collapses two screens asking at once into
     one call.

     But that bundling used to apply to *every* caller, and the exam and the
     mistakes pass need nothing but the stems — of every module. One click on
     "Mock exam" therefore fetched all eleven paid modules whole and handed the
     entire written course to the browser, which is precisely what the metered
     budget exists to prevent: the promise is that a shared login has to grind
     through hundreds of requests, and this was one click. (Measured against a
     local Worker: 11 content units, every module's notes and summary delivered.)
     So a stems-only request is now a first-class case. A full fetch still costs
     one unit and satisfies later stem reads; a stems fetch does not pre-empt a
     later full one. */
  async _fetchContent(moduleId, part) {
    if (part === "questions" && this._stems[moduleId] && !this._content[moduleId]) {
      return (await this._stems[moduleId]).questions;
    }
    let held = this._content[moduleId];
    if (!held) {
      held = this._content[moduleId] =
        this._post("/content", { module: moduleId, parts: ["notes", "questions", "summary"] });
      // A failed fetch must not become a cached failure: the lock card offers
      // "Try again", and that has to be able to actually try again.
      held.catch(() => { delete this._content[moduleId]; });
    }
    return (await held)[part];
  },

  /* The cross-module screens' entry point: stems, and nothing else. */
  async _fetchStems(moduleId) {
    if (this._content[moduleId]) return (await this._content[moduleId]).questions;
    let held = this._stems[moduleId];
    if (!held) {
      held = this._stems[moduleId] =
        this._post("/content", { module: moduleId, parts: ["questions"] });
      held.catch(() => { delete this._stems[moduleId]; });
    }
    return (await held).questions;
  },

  /* `whole` is for the module screen, which is about to show the notes anyway;
     the exam and the mistakes pass leave it off and get stems alone. */
  getQuestions(moduleId, { whole = false } = {}) {
    if (this.isFree(moduleId)) return this._json(`data/${moduleId}-questions.json`);
    return whole ? this._fetchContent(moduleId, "questions") : this._fetchStems(moduleId);
  },
  getNotes(moduleId) {
    return this.isFree(moduleId)
      ? this._text(`data/${moduleId}-notes.md`)
      : this._fetchContent(moduleId, "notes");
  },
  getSummary(moduleId) {
    return this.isFree(moduleId)
      ? this._text(`data/${moduleId}-summary.md`)
      : this._fetchContent(moduleId, "summary");
  },

  /* Course-wide markdown that belongs to no single module (currently the
     graded-questions page). Teaching content, so it sits with the notes on the
     open side of the split, not behind the Worker. */
  getDoc(name) { return this._text(`data/${name}.md`); },

  /* A course reference document — a cheat sheet, a diagnostic. Free ones are
     files in the public tree; paid ones come from the Worker, course-scoped
     rather than module-scoped, so a sheet that spans four chapters is not
     gated behind one of them.

     `free` comes from the generated catalogue in app.js rather than being
     guessed here: it is the same fact the publisher uses to decide which files
     ship, so a disagreement would show up as a 404 on a page the buyer paid
     for. Cached per session, and a failed fetch is evicted so a dropped
     connection does not pin the error for the rest of the session. */
  _docs: {},
  getCourseDoc(id, free) {
    if (free || this.mode === "local") return this._text(`data/doc-${id}.md`);
    let held = this._docs[id];
    if (!held) {
      held = this._docs[id] = this._post("/doc", { id }).then(d => d.doc);
      held.catch(() => { delete this._docs[id]; });
    }
    return held;
  },

  /* The trainer catalogue: id, module and title for every trainer in the course,
     generated at publish time. Public on purpose — a visitor should be able to
     see what they would be buying — while what each trainer teaches comes from
     the module's own config, which is paid. */
  getSimsIndex() { return this._json("data/sims-index.json"); },

  /* A module's trainer configs. Free module: straight off disk, like its notes.
     Paid: through the Worker under the same token, and cached for the session
     for the same reason the notes are — a student flips between trainers. */
  getSims(moduleId) {
    if (this.isFree(moduleId)) return this._json(`data/${moduleId}-sims.json`);
    return this._fetchSims(moduleId);
  },

  /* Its own cache and its own request rather than riding on _fetchContent: that
     one asks for notes+questions+summary together because the module screen
     needs all three, and a student who only opens a trainer should not pay for
     the chapter's prose to be sent as well. One budget unit, cached per session
     like everything else the buyer already fetched. */
  _sims: {},
  _fetchSims(moduleId) {
    let held = this._sims[moduleId];
    if (!held) {
      held = this._sims[moduleId] = this._post("/content", { module: moduleId, parts: ["sims"] })
        .then(d => d.sims);
      held.catch(() => { delete this._sims[moduleId]; });
    }
    return held;
  },

  /* A module's problem set — the exercises each section sets, with their worked
     solutions. Same split as the trainers: free module off disk, paid module
     through the Worker, and its own request rather than riding on _fetchContent.
     It is the largest thing a module holds (module 01 is 80 KB against 24 KB of
     notes), so bundling it into the module screen's fetch would make opening a
     chapter to read cost four times what reading needs. */
  getProblems(moduleId) {
    if (this.isFree(moduleId)) return this._json(`data/${moduleId}-problems.json`);
    return this._fetchProblems(moduleId);
  },

  _problems: {},
  _fetchProblems(moduleId) {
    let held = this._problems[moduleId];
    if (!held) {
      held = this._problems[moduleId] =
        this._post("/content", { module: moduleId, parts: ["problems"] }).then(d => d.problems);
      held.catch(() => { delete this._problems[moduleId]; });
    }
    return held;
  },

  /* The whole module key straight off disk. Shipped only for the free module (and
     for every module in local development), which is why isFree gates it. */
  _localAnswers(moduleId) { return this._json(`data/${moduleId}-answers.json`); },

  async fetchKeys(qids) {
    const data = await this._post("/keys", { ids: qids });
    return data.keys || {};
  },

  /* Model answers and mark schemes, cached for the session like the module text.
     Without this, collapsing a written item and opening it again re-fetched it —
     two budget units per re-open, no click that looks like a purchase, and no
     indication to the student that anything was spent. Re-reading your own mark
     scheme is the most ordinary thing a student does with this screen. In memory
     only, for the same reason as `_content`: what is cached here is the part of
     the product a leaked copy would consist of. */
  _written: {},

  async getWritten(moduleId, itemId, kind) {
    if (this.isFree(moduleId)) {
      const answers = await this._localAnswers(moduleId);
      return answers[kind][itemId];
    }
    const cacheId = `${moduleId}:${kind}:${itemId}`;
    let held = this._written[cacheId];
    if (!held) {
      held = this._written[cacheId] = this._post("/written", { module: moduleId, itemId, kind })
        .then(data => data.key);
      held.catch(() => { delete this._written[cacheId]; });
    }
    return held;
  },
};

/* ---------- the MCQ key store ----------
 *
 * Keyed by *qualified* id ("ch03:A1"), because a bare "A1" only identifies a
 * question inside its own module and the exam mixes twelve of them.
 *
 * `ensure` is the only thing here that touches the network; everything that draws
 * a screen uses the synchronous `get`. That split is what keeps the quiz feeling
 * instant while the key arrives one small batch at a time. */
const Keys = {
  _by: {},
  _inflight: {},

  MAX_PER_REQUEST: 64,   // the Worker rejects more than 64 *distinct* ids
                         // (it de-duplicates first); one exam paper is 48

  /* Namespaced like every other key here. This one was missed when the rest
     were: two courses on one GitHub Pages account share an origin, every course
     has a ch05, and the cache is keyed by question id — so a buyer of both was
     served the other course's answer for "ch05:A1" and never re-fetched it,
     because ensure() skips ids the cache already has. For the course this kit
     came from the id is "lhs", so the key is unchanged. */
  storeKey: `${COURSE_ID}-keys`,
  MAX_STORED: 400,       // ~216 MCQ plus room for a couple of exam papers

  has(qid) { return Object.prototype.hasOwnProperty.call(this._by, qid); },
  get(qid) { return this._by[qid]; },
  clear() {
    this._by = {};
    this._inflight = {};
    try { localStorage.removeItem(this.storeKey); } catch {}
  },

  /* The cache outlives the page. Held only in memory, a reload re-spent budget on
     questions the student had already been served — three passes through a module
     is 54 keys against an hourly 250, and being throttled for pressing refresh is
     a bill the honest buyer pays for a defence aimed at someone else. Nothing new
     is exposed: these are the keys this account already fetched, watermarked to it,
     and `clear()` (logout, or a lost device slot) drops them. Scoped to the signed-in
     address so a shared computer never serves one account the other's answers. */
  _persist() {
    if (Api.mode === "local") return;
    const account = Api.account;
    if (!account || !account.email) return;
    try {
      const entries = Object.entries(this._by).slice(-this.MAX_STORED);
      localStorage.setItem(this.storeKey, JSON.stringify({
        email: account.email, keys: Object.fromEntries(entries),
      }));
    } catch {
      // Quota, or storage disabled. The cache is an optimisation, never state —
      // losing it costs a request, not an answer.
    }
  },

  restore() {
    if (Api.mode === "local") return;
    const account = Api.account;
    try {
      const saved = JSON.parse(localStorage.getItem(this.storeKey) || "null");
      if (saved && account && saved.email === account.email) this._by = saved.keys || {};
      else localStorage.removeItem(this.storeKey);
    } catch {
      try { localStorage.removeItem(this.storeKey); } catch {}
    }
  },

  async ensure(qids) {
    const missing = [...new Set(qids)].filter(id => !this.has(id));
    if (!missing.length) return;

    /* The free module's key ships with the site, so it is read off disk and
       costs no budget and no token — that is what makes the free module work for
       someone who has never signed in. In local development every module takes
       this path. The exam mixes both, hence the split rather than a branch on
       the whole request. */
    const free = missing.filter(id => Api.isFree(id.split(":")[0]));
    if (free.length) {
      const byModule = {};
      free.forEach(qid => {
        const [modId, localId] = qid.split(":");
        (byModule[modId] = byModule[modId] || []).push(localId);
      });
      await Promise.all(Object.entries(byModule).map(async ([modId, ids]) => {
        const answers = await Api._localAnswers(modId);
        ids.forEach(localId => { this._by[`${modId}:${localId}`] = answers.mcq[localId]; });
      }));
    }

    const paid = missing.filter(id => !Api.isFree(id.split(":")[0]));
    if (!paid.length) return;
    return this._fetchPaid(paid);
  },

  async _fetchPaid(missing) {
    // Two screens can want overlapping questions at once — a prefetch racing the
    // click that needed the key. Sharing the in-flight promise keeps that to one
    // request, which matters when every id costs budget.
    const waiting = [...new Set(missing.filter(id => this._inflight[id]).map(id => this._inflight[id]))];
    const fresh = missing.filter(id => !this._inflight[id]);

    const batches = [];
    for (let i = 0; i < fresh.length; i += this.MAX_PER_REQUEST) {
      const slice = fresh.slice(i, i + this.MAX_PER_REQUEST);
      const p = Api.fetchKeys(slice)
        .then(keys => { Object.assign(this._by, keys); this._persist(); })
        .finally(() => slice.forEach(id => delete this._inflight[id]));
      slice.forEach(id => { this._inflight[id] = p; });
      batches.push(p);
    }
    await Promise.all([...batches, ...waiting]);
  },

  /* Fire-and-forget warm-up for the questions just ahead. A failure here is not
     the student's problem — whatever they actually open asks again and surfaces
     the error properly then. */
  prefetch(qids) {
    if (qids.length) this.ensure(qids).catch(() => {});
  },
};

/* Before the first screen asks for anything. Api.account comes out of
   localStorage, so the owner of the cache is known this early. */
Keys.restore();
