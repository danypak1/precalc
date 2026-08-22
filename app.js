/* LHS Study Guide — SPA. Hash routing:
 *   #/                     home
 *   #/ch02/learn           notes
 *   #/ch02/practice        quiz hub
 *   #/ch02/summary         one-page summary
 */

/* `blurb`, `topics` and `sections` exist for one screen only: the page a visitor
   without a key sees instead of a locked module. They are a *description* of the
   chapter — what it covers and how big it is — not any of its teaching content.
   The summaries used to do this job, but a summary is the chapter distilled, and
   giving eleven of those away is giving away most of what the key is for. */
const MODULES = [
  { id: "ch00", num: "00", title: "Algebra Review", ready: true, sections: 4,
    blurb: `The four skills every later chapter silently assumes: rational exponents and radicals, polynomial arithmetic, factoring, and rational expressions. The midterm opens with two whole questions on factoring and on simplifying rational expressions, and the algebra here is what a lost mark in chapter 3 or 6 usually turns out to be.`,
    topics: ["rational exponents", "simplifying radicals", "polynomial arithmetic", "special products", "factoring patterns", "rational expressions and LCDs"] },
  { id: "ch01", num: "01", title: "Equations and Inequalities", ready: true, sections: 6,
    blurb: `Everything that ends in 'solve': linear and rational equations, complex numbers and i, quadratics by four different methods and which one to reach for, equations in quadratic form, radical and absolute-value equations — and the inequalities whose answers are written in interval and set-builder notation.`,
    topics: ["linear and rational equations", "complex numbers", "quadratic equations", "applications", "radical and absolute-value equations", "interval notation"] },
  { id: "ch02", num: "02", title: "Graphs and Functions", ready: true, sections: 8,
    blurb: `The chapter the rest of the course is written in. The plane, distance and midpoint, circles by completing the square, what makes a relation a function and where its domain stops, lines in all their forms, the six transformations of a graph, reading a graph for maxima and intervals, and the algebra and composition of functions.`,
    topics: ["distance and midpoint", "circles", "functions and domain", "lines", "transformations", "piecewise functions", "difference quotient", "composition"] },
  { id: "ch03", num: "03", title: "Polynomial and Rational Functions", ready: true, sections: 6,
    blurb: `The heaviest chapter of the final. Quadratics in vertex form and the eight-part question built on one, end behaviour and multiplicity, long and synthetic division with the remainder and factor theorems, the zeros of a polynomial including the complex ones, rational functions and their asymptotes, and sign charts for inequalities.`,
    topics: ["vertex form", "end behaviour and multiplicity", "polynomial division", "remainder and factor theorems", "zeros and conjugate pairs", "asymptotes", "sign charts"] },
  { id: "ch04", num: "04", title: "Exponential and Logarithmic Functions", ready: true, sections: 5,
    blurb: `One idea told twice: inverse functions first, then the exponential and the logarithm as each other's reflection across y = x. The properties that expand and contract a logarithm, and the two families of equation — same base, or take a logarithm of both sides — with the domain check that decides which answers survive.`,
    topics: ["inverse functions", "exponential functions", "logarithmic functions", "properties of logarithms", "exponential equations", "logarithmic equations"] },
  { id: "ch05", num: "05", title: "Trigonometric Functions", ready: true, sections: 7,
    blurb: `Trigonometry built in the order the exam uses it: angles and radian measure, the right triangle, then any angle through a point on its terminal side and the reference angle that reduces every evaluation to a special angle. Then the unit circle, the graphs of sine and cosine with amplitude, period and phase shift, the other four graphs, and the inverse functions with their restricted ranges.`,
    topics: ["radian measure", "right-triangle ratios", "any angle and reference angles", "the unit circle", "amplitude period and phase shift", "graphs of tan sec csc cot", "inverse trigonometric functions"] },
  { id: "ch06", num: "06", title: "Identities and Trigonometric Equations", ready: true, sections: 5,
    blurb: `The one chapter where memorising is unavoidable, and the one where a marker wants to see a chain of equalities rather than an answer. The fundamental identities and how a verification is written, sum and difference formulas, double-angle, power-reducing and half-angle, product-to-sum, and equations solved both over one turn of the circle and over all real numbers.`,
    topics: ["fundamental identities", "verifying an identity", "sum and difference formulas", "double-angle and half-angle", "power-reducing", "product to sum", "general solutions"] },
];

/* ---- generated from <id>.course.json by tools/apply-config.py — do not edit ----
   Every fact below has exactly one home, the course file. Hand-editing one here
   is the failure this pair of scripts exists to prevent: course #2 was scaffolded
   from this file and inherited course #1's question counts, exam length, price
   and title, all of which the gates then passed without a word.

   PER_MODULE  — every module carries the same question set, and the locked-module
                 page says so rather than counting something it may not fetch.
   PRICE/CONTACT — where the paid line falls, for the copy that has to say so.
                 Api.FREE_MODULES is the machine-readable half and is what the
                 code branches on.
   HAS_SIGNALS — whether this course has a "questions the lectures already graded"
                 document. Not every course does; the tile is hidden when it does
                 not, rather than offering a page that cannot load.
   HAS_PROBLEMS — whether modules ship a problem set (exercises with worked
                 solutions) as their own tab. A course whose problems live inside
                 its notes has none, and the tab is not offered.
   HAS_SIMS    — whether any switched-on module ships a trainer.
   HAS_EXAM    — whether the mock exam has questions to draw a paper from, which
                 is to say whether this course ships the `questions` surface.
                 Both hide their surface entirely when false; see below.
   COURSE_DOCS — the catalogue of course-wide reference pages (cheat sheets, a
                 diagnostic): id, title and whether each is free. Titles only —
                 what a paid one contains comes from the Worker. Empty list means
                 the whole #/docs surface is hidden. */
const COURSE_TITLE = "Precalculus";
const COURSE_SUBTITLE = "College algebra and trigonometry, from R.3 to 6.5";
const KEY_PREFIX = "PREC";
const PER_MODULE = { mcq: 12, short: 10, extended: 0 };
const EXAM_PER_MODULE = 4;
const EXAM_MINUTES = 60;
const HAS_SIGNALS = false;
const HAS_PROBLEMS = true;
const HAS_SIMS = true;
const HAS_EXAM = true;
const SURFACES = ["notes", "questions", "answers", "summary", "problems"];
const PRICE = "$25";
const CONTACT = "https://t.me/danypak";
const DEVICES_PHRASE = "two devices";
const DEVICES_EXAMPLE = "your laptop and your phone";
const ONE_TOO_MANY = "a third";
const COURSE_DOCS = [{"id": "exam-map", "title": "Exam map — what the midterm and the final actually ask", "free": false}, {"id": "sheet-ch00", "title": "Cheat sheet — algebra review", "free": false}, {"id": "sheet-ch01", "title": "Cheat sheet — equations and inequalities", "free": false}, {"id": "sheet-ch02", "title": "Cheat sheet — graphs and functions", "free": false}, {"id": "sheet-ch03", "title": "Cheat sheet — polynomial and rational functions", "free": false}, {"id": "sheet-ch04", "title": "Cheat sheet — exponential and logarithmic functions", "free": false}, {"id": "sheet-ch05", "title": "Cheat sheet — trigonometric functions", "free": false}, {"id": "sheet-ch06", "title": "Cheat sheet — identities and trigonometric equations", "free": false}];
/* ---- end generated ---- */

/* A course tree whose app.js was generated before `surfaces` existed has no such
   constant. Normalised once, here — above every use, because `const` in a
   temporal dead zone throws rather than reading as undefined: declaring this next
   to the tab list instead left the sales copy below referring to it 470 lines
   early, and the whole app died on load with every gate still green. Nothing in
   the toolchain runs the application. */
const COURSE_SURFACES = typeof SURFACES === "undefined"
  ? ["notes", "questions", "answers", "summary"]
  : SURFACES;

/* Two whole surfaces the shell used to offer to everyone, which is only right
   for a course built around a question paper. A problems-first course has no MCQ
   bank and may have no trainers, and both links then answered a buyer with
   "Could not load that — data/chNN-questions.json: 404", from the sidebar and
   from a card on the home screen that had just sold them the thing. Reproduced
   on stats on 2026-08-20; phys1b has the same shape and the same broken exam.

   Read through the same `typeof` guard COURSE_SURFACES uses, so a course tree
   whose app.js predates these constants keeps the behaviour it has today rather
   than losing two working pages to an undefined. */
const HAS_TRAINERS = typeof HAS_SIMS === "undefined" ? true : HAS_SIMS;
const HAS_MOCK_EXAM = typeof HAS_EXAM === "undefined"
  ? COURSE_SURFACES.includes("questions")
  : HAS_EXAM;

/* Sales copy lives here rather than being retyped at each call site: the lock
   card, the locked-module page and the sign-in screen all have to promise the
   same thing, and three near-identical strings is how they stop doing that. */
const buyButton = (cls = "btn") => `<a class="${cls}" href="${CONTACT}" target="_blank"
  rel="noopener">Get a key — ${PRICE}</a>`;

/* Built from what the course actually ships, not typed out once and inherited.
   The literal this replaced promised "notes, questions, … the one-page summaries,
   the model answers and the mark schemes … plus the mock exam", and said "Module
   01 stays free" — three courses got away with that because ch01 happened to be
   their free module and they happened to ship all four surfaces. The optics
   course ships none of them and its free module is ch33, so the lock card was
   selling a buyer four things that do not exist and naming the wrong sample.
   Sales copy is not exempt from the one-fact-one-place rule; check-config.py says
   in as many words that prose is the part no script checks. */
const FREE_MODULE_NUM = (MODULES.find(m => Api.isFree(m.id)) || MODULES[0] || {}).num || "01";
const KEY_BUYS_PARTS = [
  COURSE_SURFACES.includes("notes") && "the notes",
  COURSE_SURFACES.includes("questions")
    && "every question with its answer and the explanation of <em>why</em> each wrong option is wrong",
  COURSE_SURFACES.includes("summary") && "the one-page summaries",
  // No comma inside an item: the list is joined on commas, and one here turned
  // "its worked solution, hints and all" into "…solution and hints and all".
  HAS_PROBLEMS && "every problem with its worked solution and its hints",
].filter(Boolean);
const WHAT_A_KEY_BUYS = `A key unlocks the other ${MODULES.length - 1} modules in full — ${
  KEY_BUYS_PARTS.join(", ").replace(/, ([^,]*)$/, " and $1")}${
  COURSE_SURFACES.includes("questions") ? ", plus the mock exam and the pass over your mistakes" : ""
}. Module ${FREE_MODULE_NUM} stays free, whole.`;

/* What one module holds, for the locked-module teaser and the free-module card.
   Both used to list notes, 18 MCQ, 12 written questions with mark schemes and a
   summary as fixed text; a course shipping none of them told a buyer it did. */
const written = PER_MODULE.short + PER_MODULE.extended;
const moduleContents = m => [
  COURSE_SURFACES.includes("notes") && m && `${m.sections} sections of notes`,
  COURSE_SURFACES.includes("questions") && PER_MODULE.mcq
    && `${PER_MODULE.mcq} multiple-choice questions, each with the misunderstanding its wrong options reveal`,
  COURSE_SURFACES.includes("questions") && written
    && `${written} written questions with model answers and mark schemes`,
  COURSE_SURFACES.includes("summary") && "a one-page summary of the whole chapter",
  HAS_PROBLEMS && "a graded problem set — every part marked as you type, with hints and a worked solution",
].filter(Boolean).join(" · ");

/* Shown as a padlock in the navigation and as "Needs a key" on the cards. Signed
   in, nothing wears a lock: the point is to tell a visitor what they would be
   buying, not to remind a buyer of what they already own. */
const needsKey = modId => !Api.isFree(modId) && !Api.token;

/* The same question for a course document. Not needsKey(): a document has no
   module, so "is it free" is a property of the document itself. Local mode
   reads everything off disk, hence the Api.isFree check rather than a bare
   `!d.free`. */
const docNeedsKey = d => !d.free && !Api.isFree(null) && !Api.token;

/* Anything interpolated into an HTML attribute goes through this. The one place
   it matters is the unlock link: `#/unlock/<key>` arrives as whatever is in the
   address bar, and it used to land in `value="…"` raw. Chrome percent-encodes
   `"` `<` `>` in location.hash and so happened to be safe; Firefox and Safari do
   not, and Safari is what a key pasted into a Telegram chat gets opened in. */
const escapeAttr = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
  .replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- progress store (localStorage) ---------- */

/* One JSON blob under one key, read once and written whole. That shape is fine
 * for one tab and quietly destructive with two: a student who opens the notes in
 * a second tab — the obvious thing to do while sitting the exam in the first —
 * had every write from one tab overwrite everything the other had done since it
 * loaded. Scrolling the notes is enough to trigger it, because the contents
 * handler saves the reading position on every section.
 *
 * The fix keeps the shape (nothing has to migrate) and makes each write a
 * three-way merge instead of a blind overwrite: `_seen` is a snapshot of the
 * state as of our last read or write, so for every top-level key we can tell
 * whether *we* changed it, whether *they* did, or neither. Ours wins a genuine
 * collision, which is right — we are writing because the student just acted in
 * this tab. */
const Store = {
  key: `${Api.courseId}-progress-v1`,
  data: null,
  _seen: {},

  _snapshot() {
    try { this._seen = JSON.parse(JSON.stringify(this.data)); }
    catch { this._seen = {}; }
  },

  _stored() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
    catch { return {}; }   // corrupt or half-written: treat as absent, never throw
  },

  /* theirs ∪ ours, deciding each top-level key by who moved it since `_seen`. */
  _merge(theirs) {
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const merged = { ...theirs };
    for (const k of new Set([...Object.keys(theirs), ...Object.keys(this.data || {})])) {
      const base = this._seen[k], mine = (this.data || {})[k], their = theirs[k];
      if (!same(mine, base)) merged[k] = mine;          // we changed it
      else if (!same(their, base)) merged[k] = their;   // they changed it
      else merged[k] = mine === undefined ? their : mine;
      if (merged[k] === undefined) delete merged[k];
    }
    return merged;
  },

  load() {
    this.data = this._stored();
    this._snapshot();
  },

  save() {
    this.data = this._merge(this._stored());
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); }
    catch (e) {
      // A full origin (github.io is shared with every other Pages site) turns
      // every answer into a silent no-op. Say so once rather than never.
      if (!this._warned) {
        this._warned = true;
        console.warn("Could not save progress — this browser's storage for the site is full.", e);
      }
    }
    this._snapshot();
  },

  module(id) {
    if (!this.data[id]) this.data[id] = { mcq: {}, mcqOrder: null, mcqIndex: 0, written: {} };
    return this.data[id];
  },
};
Store.load();

/* Another tab wrote. Take what it did for anything we have not touched, so the
   two views converge instead of racing. */
addEventListener("storage", e => {
  if (e.key !== Store.key) return;
  Store.data = Store._merge(Store._stored());
  Store._snapshot();
});

const $ = (sel, el = document) => el.querySelector(sel);
const main = $("#main");

/* Inline icons. Emoji were rendering as a different picture on every OS — and at
   different widths, so the tab bar jumped between platforms. */
const ICON = {
  learn: "M4 5.5A2.5 2.5 0 0 1 6.5 3H11v15H6.5A2.5 2.5 0 0 0 4 20.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v15h4.5a2.5 2.5 0 0 1 2.5 2.5z",
  practice: "M4 20h4l10-10a2.83 2.83 0 0 0-4-4L4 16zM13.5 6.5l4 4",
  problems: "M4 6h4M4 12h4M4 18h4M11 6h9M11 12h9M11 18h9",
  summary: "M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z",
  flag: "M5 21V4M5 4h11l-2 3.5L16 11H5",
};
const icon = name => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[name]}"/></svg>`;

/* Plain text, safe to drop into an attribute. Option buttons put their text in
   nested spans, which left them with an empty accessible name in the a11y tree. */
// Strips exactly what md.js treats as markup — which does NOT include "_".
// Stripping underscores deleted every subscript from the labels of a maths
// course ("\lim_{x\to 5}" was announced as "\lim{x\to 5}"), silently, because
// the label is not on screen where a mangled formula would have been noticed.
const stripMd = s => s.replace(/[*`]/g, "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/* ---------- router ---------- */

/* Every screen change replaces the contents of #main, which destroys whatever
   held focus. Without the wrapper below, focus fell back to the document and a
   keyboard or screen-reader student restarted from stop 1 of the ~16 that come
   before the content — 18 times in a module quiz, 48 in the exam — with nothing
   announcing that a new screen existed. route() awaits the render (several are
   async) and then puts focus on the screen itself. */
let routedOnce = false;
async function route() {
  /* Read before rendering: the deep-link handler consumes this key while the
     new screen is being built, so asking afterwards always says "no anchor". */
  const deepLink = !!sessionStorage.getItem(`${Api.courseId}-scroll`);
  const rendered = routeTo();
  const first = !routedOnce;
  routedOnce = true;
  try { await rendered; } catch { /* the screen reports its own failure */ }
  if (first) return;                 // page load: leave focus where it started
  /* A hash change swaps the article but not the scroll offset, so leaving a
     9,000-word chapter 6,000px down and tapping Summary opened the summary
     6,000px down — usually past its end, on a phone always. focus() cannot fix
     it: every focus call here passes preventScroll, deliberately. A deep link
     is the one navigation that must keep its own scroll. */
  if (!deepLink) window.scrollTo(0, 0);
  const main = $("#main");
  if (main && !main.contains(document.activeElement)) main.focus({ preventScroll: true });
}

function routeTo() {
  Drawer.close(false);
  /* Every navigation invalidates whatever was still rendering and takes down
     whatever was still listening. The keyboard half is not housekeeping: the
     quiz's keydown handler lives on `document`, so before this line, leaving a
     quiz by any hash change left it installed. Pressing "2" on the notes or the
     home page then recorded an answer the student never gave — into practice
     scores, into the mistakes list, and in the exam over a live paper, since
     deferred mode deliberately allows changing an answer. Reproduced on
     2026-08-12: a cleared store went to `ch01:A1 picked b, correct false` from
     one keystroke pressed on the home screen. */
  beginRender();
  QuizKeys.clear();
  const hash = location.hash.replace(/^#\/?/, "");
  const [mod, tab] = hash.split("/");
  renderNav(mod);
  // #/unlock/LHS-XXXXX-… — the link sent with the key, so the first sign-in
  // is a click rather than twenty characters typed on a phone. Decoded because
  // Chrome percent-encodes parts of location.hash and Firefox does not: without
  // this the same link sends a different string to the Worker in each.
  if (mod === "unlock") {
    const raw = hash.slice("unlock/".length);
    let key;
    try { key = decodeURIComponent(raw); } catch { key = raw; }
    return renderLogin(key);
  }
  if (mod === "login") return renderLogin();
  if (mod === "review") return renderReview();
  if (mod === "exam") return HAS_MOCK_EXAM ? renderExam() : renderHome();
  if (mod === "signals") return HAS_SIGNALS ? renderSignals() : renderHome();
  if (mod === "sims") return HAS_TRAINERS ? renderSims(tab) : renderHome();
  if (mod === "docs") return renderDocs(tab);
  if (!mod) return renderHome();
  const m = MODULES.find(x => x.id === mod);
  if (!m || !m.ready) return renderHome();
  Store.data.last = { mod: m.id, tab: tab || "learn" };
  Store.save();
  renderModule(m, tab || "learn");
}
window.addEventListener("hashchange", route);

/* The skip link is a button, not an <a href="#main">: this app routes on the
   hash, so an anchor jump would set location.hash to "#main" and the router
   would read it as a module name and bounce the student to the home screen. */
document.getElementById("skip-link")?.addEventListener("click", () => {
  const main = document.getElementById("main");
  if (main) { main.focus(); main.scrollIntoView({ block: "start" }); }
});

/* ---------- mobile drawer ---------- */

const Drawer = {
  get isOpen() { return document.body.classList.contains("nav-open"); },
  open() {
    document.body.classList.add("nav-open");
    $("#scrim").hidden = false;
    $("#nav-toggle").setAttribute("aria-expanded", "true");
    const first = $("#module-nav a");
    if (first) first.focus();
  },
  close(refocus) {
    if (!this.isOpen) return;
    document.body.classList.remove("nav-open");
    $("#scrim").hidden = true;
    $("#nav-toggle").setAttribute("aria-expanded", "false");
    if (refocus) $("#nav-toggle").focus();
  },
  toggle() { this.isOpen ? this.close(true) : this.open(); },
};

/* ---------- theme ----------
 * Three states, not two: "system" has to stay reachable, otherwise a student who
 * tries the toggle once can never get back to following their phone's setting. */
const Theme = {
  key: `${Api.courseId}-theme`,
  order: ["system", "light", "dark"],
  label: { system: "System theme", light: "Light theme", dark: "Dark theme" },
  icon: { system: "◐", light: "☀", dark: "☾" },
  get current() { return localStorage.getItem(this.key) || "system"; },
  apply(mode) {
    if (mode === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(this.key, mode);
    const btn = $("#theme-toggle");
    $("#theme-label").textContent = this.label[mode];
    $("#theme-ico").textContent = this.icon[mode];
    btn.setAttribute("aria-label", `${this.label[mode]}. Click to change.`);
  },
  cycle() {
    const next = this.order[(this.order.indexOf(this.current) + 1) % this.order.length];
    this.apply(next);
  },
};
Theme.apply(Theme.current);
$("#theme-toggle").addEventListener("click", () => Theme.cycle());

$("#nav-toggle").addEventListener("click", () => Drawer.toggle());
$("#scrim").addEventListener("click", () => Drawer.close(true));
document.addEventListener("keydown", e => { if (e.key === "Escape") Drawer.close(true); });

/* Navigate, and re-render even when the hash is already the target.
 * The quiz player and the results screen both live *inside* #/chNN/practice
 * without changing the hash, so a plain href back to that same hash fires no
 * hashchange and the student is left stranded on the results screen. */
function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

/* ---------- sidebar ---------- */

function renderNav(activeId) {
  $("#module-nav").innerHTML = MODULES.map(m => {
    const cls = ["nav-item", m.ready ? "enabled" : "locked", m.id === activeId ? "active" : ""].join(" ");
    const s = mcqScore(m.id);
    // Started modules show progress, finished ones show the score. Before this
    // the marker only appeared at 100%, so a half-done module looked untouched.
    const stat = s
      ? `<span class="nav-stat ${s.answered === s.total ? "done" : ""}">${
          s.answered === s.total ? `${s.correct}/${s.total}` : `${s.answered}/${s.total}`}</span>`
      : "";
    const href = m.ready ? `href="#/${m.id}/learn"` : "";
    const current = m.id === activeId ? ` aria-current="page"` : "";
    const shut = needsKey(m.id);
    const label = `Module ${m.num}: ${m.title}${m.ready ? "" : " (coming soon)"}${
      shut ? " (needs a key)" : ""}${s ? `, ${s.correct} of ${s.total} correct` : ""}`;
    // Locked modules stay in the list and stay clickable: they lead to the
    // module's description and the offer. A hidden list looks like a course with
    // three chapters; a list with padlocks looks like a catalogue.
    const mark = shut ? `<span class="nav-lock" aria-hidden="true">🔒</span>` : stat;
    return `<a class="${cls}" ${href}${current} aria-label="${label}"><span class="num">${m.num}</span><span class="nav-label">${m.title}</span>${mark}</a>`;
  }).join("");

  renderCourseProgress();
  renderToolNav(activeId);
  const m = MODULES.find(x => x.id === activeId);
  $("#topbar-title").textContent = m ? `${m.num} · ${m.title}` : COURSE_TITLE;
}

/* Everything that works across the whole course rather than inside one module.
 * The home screen shows the same set as cards and this renders it as sidebar
 * rows; both read this one list, so the two can never drift apart. The keys match
 * the first hash segment, which is what `routeTo` already hands to renderNav. */
function toolLinks() {
  const n = mistakeIds().length;
  return [
    ...(HAS_TRAINERS ? [{ key: "sims", href: "#/sims", icon: "◎", label: "Trainers" }] : []),
    ...(HAS_MOCK_EXAM ? [{ key: "exam", href: "#/exam", icon: "▤", label: "Mock exam" }] : []),
    ...(n ? [{ key: "review", href: "#/review", icon: "↺", label: "Your mistakes", stat: n }] : []),
    ...(HAS_SIGNALS ? [{ key: "signals", href: "#/signals", icon: "✦", label: "Graded questions" }] : []),
    ...(COURSE_DOCS.length ? [{ key: "docs", href: "#/docs", icon: "▦", label: "Cheat sheets" }] : []),
  ];
}

function renderToolNav(activeId) {
  const nav = $("#tool-nav");
  if (!nav) return;
  nav.innerHTML = toolLinks().map(t => {
    const active = t.key === activeId;
    return `<a class="tool-link${active ? " active" : ""}" href="${t.href}"${
      active ? ` aria-current="page"` : ""}>
      <span class="tool-ico" aria-hidden="true">${t.icon}</span>
      <span class="tool-link-label">${t.label}</span>
      ${t.stat ? `<span class="nav-stat">${t.stat}</span>` : ""}
    </a>`;
  }).join("");
}

/* The trainers index is a small public file that three screens now want, so it is
 * fetched once per page load instead of once per visit. A failure is not cached:
 * a student who was offline for one navigation would otherwise see no trainers
 * for the rest of the session. */
let simsIndexOnce = null;
function simsIndex() {
  if (!simsIndexOnce) {
    simsIndexOnce = Api.getSimsIndex().catch(e => { simsIndexOnce = null; throw e; });
  }
  return simsIndexOnce;
}

const MCQ_PER_MODULE = PER_MODULE.mcq; // the validator enforces this many per module

function mcqScore(modId) {
  const p = Store.data[modId];
  if (!p || !p.mcq) return null;
  const entries = Object.values(p.mcq);
  if (!entries.length) return null;
  return {
    answered: entries.length,
    correct: entries.filter(e => e.correct).length,
    total: p.mcqTotal || MCQ_PER_MODULE,
  };
}

function courseProgress() {
  let answered = 0, correct = 0, total = 0;
  MODULES.forEach(m => {
    if (!m.ready) return;
    const p = Store.data[m.id];
    total += (p && p.mcqTotal) || MCQ_PER_MODULE;
    const s = mcqScore(m.id);
    if (!s) return;
    answered += s.answered;
    correct += s.correct;
  });
  return { answered, correct, total, pct: total ? Math.round(100 * answered / total) : 0 };
}

function renderCourseProgress() {
  const c = courseProgress();
  $("#course-progress").innerHTML = `
    <div class="cp-head"><span>Course progress</span><span class="cp-pct">${c.pct}%</span></div>
    <div class="progress-track"><div class="progress-fill" style="width:${c.pct}%"></div></div>
    <p class="cp-sub">${c.answered} of ${c.total} questions answered${
      c.answered ? ` · ${c.correct} correct` : ""}</p>`;

  const ring = $("#topbar-ring");
  ring.style.setProperty("--p", c.pct);
  ring.setAttribute("aria-label", `Course progress: ${c.pct}%`);
}

/* ---------- home ---------- */

function renderHome() {
  document.title = `${COURSE_TITLE} — Interactive`;
  main.innerHTML = `
    <div class="page">
      <h1 class="page-title">${COURSE_SUBTITLE}</h1>
      <p class="page-sub">${COURSE_SURFACES.includes("questions")
        ? `The full course, taught from zero. Read the notes, then test yourself — every wrong
           answer tells you exactly which misunderstanding it reveals and what to re-read.`
        /* A course with no multiple choice has no distractor to diagnose, and this
           was the first sentence its buyer read. */
        : `The full course, taught from zero. Read the notes, then work the problems — every
           part is marked against the answer the exam would accept, with a hint before it.`}</p>
      ${freeModuleCard()}
      ${resumeCard()}
      ${courseTools()}
      <div class="module-grid">
        ${MODULES.map(m => {
          const s = mcqScore(m.id);
          const status = !m.ready ? `<span class="mod-status">Coming soon</span>`
            : needsKey(m.id) ? `<span class="mod-status">🔒 Needs a key</span>`
            : !s ? `<span class="mod-status">Not started</span>`
            : s.answered === s.total
              ? `<span class="mod-status done">Done — ${s.correct}/${s.total} correct</span>`
              : `<span class="mod-status doing">In progress — ${s.answered}/${s.total} answered</span>`;
          const tag = m.ready ? `a href="#/${m.id}/learn"` : "div";
          const closeTag = m.ready ? "a" : "div";
          return `<${tag} class="module-card ${m.ready ? "enabled" : "locked"}">
            <span class="mod-num">MODULE ${m.num}</span>
            <span class="mod-title">${m.title}</span>
            ${status}
          </${closeTag}>`;
        }).join("")}
      </div>
    </div>`;
}

/* Shown to a visitor without a key, once, at the top of the course. It says what
   is free before it says what costs money — someone who has not read a word yet
   has no reason to trust a price, and Module 01 is the argument. */
function freeModuleCard() {
  if (Api.token || Api.mode === "local") return "";
  const free = Api.FREE_MODULES[0];
  const m = MODULES.find(x => x.id === free);
  return `
    <div class="card offer-card">
      <div class="card-head">
        <h3>Module ${m ? m.num : "01"} is free, in full</h3>
        <span class="pill">${PRICE} for the rest</span>
      </div>
      <p class="muted">${moduleContents(m)} — no key, no sign-up.
        It is a whole module, built exactly like the other ${MODULES.length - 1}, so you can see
        what you would be buying before you decide.</p>
      <div class="row-gap">
        <a class="btn" href="#/${free}/${MODULE_TABS[0]}">Start Module ${m ? m.num : FREE_MODULE_NUM}</a>
        ${buyButton("btn secondary")}
      </div>
    </div>`;
}

/* The two things that work across the whole course rather than inside one
 * module. The mistakes pass only appears once there is something in it —
 * an empty "0 to review" tile is noise on a first visit. */
function courseTools() {
  const n = mistakeIds().length;
  const ex = Store.data.exam;
  const examSub =
    ex && !ex.submitted
      ? `In progress — ${Object.keys(ex.answers).length} of ${EXAM_SIZE} answered,
         ${clock(examRemaining(ex))} left on the clock.`
      : ex && ex.submitted
        ? `Last attempt: ${Object.values(ex.answers).filter(e => e.correct).length} / ${EXAM_SIZE}.
           A new attempt draws a different paper.`
        : `${EXAM_SIZE} questions across all ${MODULES.filter(m => m.ready).length} modules, ${EXAM_MINUTES} minutes,
           no feedback until you submit.${Api.token || Api.mode === "local" ? "" : " Needs a key."}`;
  return `
    <div class="tool-grid">
      ${HAS_MOCK_EXAM ? `<a class="tool-card" href="#/exam">
        <span class="tool-title">Mock exam</span>
        <span class="tool-sub">${examSub}</span>
      </a>` : ""}
      ${n ? `<a class="tool-card" href="#/review">
        <span class="tool-title">Work on your mistakes</span>
        <span class="tool-sub">${n} question${n > 1 ? "s" : ""} you missed or flagged,
          gathered from every module.</span>
      </a>` : ""}
      ${HAS_TRAINERS ? `<a class="tool-card" href="#/sims">
        <span class="tool-title">Interactive trainers</span>
        <span class="tool-sub">Move a slider and watch the formula do it —
          the ideas that are easier to feel than to read.</span>
      </a>` : ""}
      ${HAS_SIGNALS ? `<a class="tool-card" href="#/signals">
        <span class="tool-title">Questions the course has already graded</span>
        <span class="tool-sub">The items the lectures put on screen with marks
          attached, answered and mapped to the notes.</span>
      </a>` : ""}
      ${COURSE_DOCS.length ? `<a class="tool-card" href="#/docs">
        <span class="tool-title">Cheat sheets and the diagnostic</span>
        <span class="tool-sub">${COURSE_DOCS.length} reference page${
          COURSE_DOCS.length > 1 ? "s" : ""} that belong to the whole course:
          which technique to reach for, and every formula in one place.</span>
      </a>` : ""}
    </div>`;
}

const TAB_LABEL = { learn: "Learn", practice: "Practice", problems: "Problems", summary: "Summary" };
/* Problems sits between Practice and Summary because that is the order the work
   happens in: read it, be tested on it, drill it, revise it. A course without a
   problems file never shows the tab, and a hand-typed #/ch01/problems on such a
   course falls back to Learn rather than rendering an empty page. */
/* Tabs follow the surfaces the course actually ships. A course that carries
   notes, a question paper and a summary gets the three it always got, plus
   Problems when it has them — the list below is that same list for every course
   that predates `surfaces`. A problems-first course (a bank of worked problems
   with no lecture notes behind it) gets Problems alone rather than three empty
   tabs and a fourth that works. */
const SURFACE_TABS = [["notes", "learn"], ["questions", "practice"],
                      ["problems", "problems"], ["summary", "summary"]];
const MODULE_TABS = SURFACE_TABS
  .filter(([surface]) => surface === "problems"
    ? HAS_PROBLEMS
    : COURSE_SURFACES.includes(surface))
  .map(([, tab]) => tab);

function resumeCard() {
  const last = Store.data.last;
  if (!last) return "";
  const m = MODULES.find(x => x.id === last.mod);
  if (!m || !m.ready) return "";
  return `<a class="resume-card" href="#/${m.id}/${last.tab}">
    <span class="r-icon">↩︎</span>
    <span>
      <span class="r-label">Pick up where you left off</span>
      <span class="r-what">Module ${m.num} · ${m.title} — ${TAB_LABEL[last.tab] || "Learn"}</span>
    </span>
    <span class="r-go">→</span>
  </a>`;
}

/* ---------- module shell ---------- */

/* Renders are async (the notes are a 60–90 KB fetch), so two of them can be in
 * flight at once — an initial route plus a hashchange, or a fast Learn →
 * Practice → Learn tap. Without this guard the slower one finishes last and
 * wires its listeners to nodes that have already been thrown away, which
 * silently kills the reading progress and the contents highlight. */
let renderEpoch = 0;

/* Starts a new render: everything already in flight is now stale. */
function beginRender() {
  const epoch = ++renderEpoch;
  return () => epoch === renderEpoch;
}

/* Reads the current render without starting one — for code that runs *inside* a
   render and must not invalidate its own parent. */
function currentRender() {
  const epoch = renderEpoch;
  return () => epoch === renderEpoch;
}

async function renderModule(m, tab) {
  const alive = beginRender();
  /* A tab this course does not ship used to fall through the dispatch below into
     Practice, which on a problems-first course means a 404 for a question paper
     that does not exist — and the tabbar highlighted nothing, so the student
     could not see where they were. #/ch03/notes does it: "notes" is the
     surface's own name and an entirely plausible thing to type or bookmark. The
     comment above SURFACE_TABS already promised the opposite behaviour. */
  if (!MODULE_TABS.includes(tab)) tab = MODULE_TABS[0] || "learn";
  document.title = `${m.title} — ${COURSE_TITLE}`;
  PageScroll.clear();
  main.innerHTML = `
    <div class="page${tab === "learn" ? " wide" : ""}">
      <div class="crumbs"><a href="#/">Modules</a> / Module ${m.num}</div>
      <h1 class="page-title">${m.title}</h1>
      <p class="page-sub module-sub">Learn → practise → review. Your progress is saved on this device.</p>
      <div class="tabbar">
        <div class="tabs${MODULE_TABS.length > 3 ? " tabs-4" : ""}" role="tablist">
          ${MODULE_TABS.map(t =>
            `<button class="tab ${t === tab ? "active" : ""}" data-tab="${t}"
                     role="tab" aria-selected="${t === tab}" aria-label="${TAB_LABEL[t]}">
              ${icon(t)}<span>${TAB_LABEL[t]}</span>
            </button>`).join("")}
        </div>
        <div class="read-progress"><span id="read-fill"></span></div>
      </div>
      <div id="module-trainers" class="trainer-row"></div>
      <div id="tab-body"></div>
    </div>`;

  main.querySelectorAll(".tab").forEach(b =>
    b.addEventListener("click", () => go(`#/${m.id}/${b.dataset.tab}`)));
  syncStickyOffsets();

  /* A module that owns a trainer says so beside its own tabs. The catalogue is a
     detour for the student who needs it: the one who wants the incline trainer is
     the one currently reading the incline section. Fire-and-forget — a trainer is
     an extra, and no failure here may take the notes down with it. */
  simsIndex().then(index => {
    if (!alive()) return;
    const rows = (index || []).filter(r => r.module === m.id);
    const slot = $("#module-trainers");
    if (!slot || !rows.length) return;
    slot.innerHTML = rows.map(r =>
      `<a class="trainer-chip" href="#/sims/${encodeURIComponent(r.id)}">
        <span aria-hidden="true">◎</span>
        <span>Trainer — ${escapeAttr(r.title)}</span>
      </a>`).join("");
  }).catch(() => {});

  const body = $("#tab-body");
  try {
    if (tab === "learn") await renderLearn(m, body, alive);
    else if (tab === "summary") await renderSummary(m, body, alive);
    else if (tab === "problems" && HAS_PROBLEMS) await renderProblems(m, body, alive);
    else await renderPractice(m, body, alive);
  } catch (e) {
    if (!alive()) return;
    const retry = () => renderModule(m, tab);
    /* A locked module now fails at the *content* fetch, not just at the answers,
       so this catch is where a visitor without a key arrives. On Learn and
       Summary — the two tabs a visitor lands on while deciding — that is a buying
       decision and gets the description and the offer; on Practice the lock card
       already says the right thing. Anything else — throttled, offline — is not a
       product state and must not be dressed up as one. */
    if (e.code === "auth") {
      return tab === "practice" ? renderLock(body, e.message, retry)
        : renderModuleTeaser(m, body, retry);
    }
    if (e.code) return renderBlocked(body, e, retry);
    body.innerHTML = `
      <div class="card">
        <h3>Could not load content</h3>
        <p class="muted">${e.message}</p>
        <div class="row-gap"><button class="btn" id="retry-load">Try again</button></div>
      </div>`;
    $("#retry-load", body).addEventListener("click", retry);
  }
}

/* One scroll listener at a time. Tabs swap the whole body, so whatever the
   previous tab registered has to go with it. */
const PageScroll = {
  fn: null,
  set(fn) {
    this.clear();
    this.fn = () => requestAnimationFrame(fn);
    window.addEventListener("scroll", this.fn, { passive: true });
    fn();
  },
  clear() {
    if (this.fn) window.removeEventListener("scroll", this.fn);
    this.fn = null;
  },
};

function skeleton() {
  return `<div class="skeleton" aria-hidden="true">
    ${`<span class="sk-line"></span>`.repeat(3)}
    <span class="sk-line short"></span>
    ${`<span class="sk-line"></span>`.repeat(5)}
  </div>`;
}

async function renderLearn(m, body, alive = () => true) {
  body.innerHTML = skeleton();
  const md = await Api.getNotes(m.id);
  if (!alive()) return;
  body.innerHTML = `
    <div class="learn-layout">
      <article class="md" id="notes">${MD.render(md)}</article>
      <div class="toc" id="toc"></div>
    </div>`;
  buildToc(m, $("#notes", body), $("#toc", body));
  scrollToPending(body);
}

async function renderSummary(m, body, alive = () => true) {
  body.innerHTML = skeleton();
  const md = await Api.getSummary(m.id);
  if (!alive()) return;
  body.innerHTML = `<article class="md">${MD.render(md)}</article>`;
}

/* ---------- the problem set ----------
 * Drill, as opposed to Practice, which is assessment. These are the exercises
 * the source course sets for each section, in four difficulty tiers, each with
 * the worked solution folded away underneath it.
 *
 * The solution is a <details>, not a second page and not a modal: the whole
 * value of a worked solution is comparing it against the attempt you just made,
 * which means it has to open where you are, with your own work still on screen.
 * It stays closed on load — an answer you can see is not a problem you solved.
 */
const TIER_LABEL = {
  warmup: "Warm-up", standard: "Standard", challenge: "Challenge", applied: "Applied",
};
// The order they are shown in, which is the order of difficulty — not whatever
// order the items happen to appear in the file.
const MODULE_TIERS = ["warmup", "standard", "challenge", "applied"];

async function renderProblems(m, body, alive = () => true) {
  body.innerHTML = skeleton();
  const data = await Api.getProblems(m.id);
  if (!alive()) return;

  const sections = data?.sections || [];
  if (!sections.length) {
    body.innerHTML = `<div class="card"><p class="muted">This module has no problem set.</p></div>`;
    return;
  }

  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const graded = !!data.graded;
  /* What this module actually carries, counted rather than promised. The line
     used to say "Three hints per part, then the worked solution" to every course
     that marks answers. stats ships one hint on all 83 of its parts and no
     working at all — an answer and a pointer at the notes — so the sentence
     above the problem set was false for the buyer reading it, in the same way
     LHS's landing page promised cross-device sync that was never written. */
  const parts = sections.flatMap(s => s.items.flatMap(i => i.parts || []));
  const maxHints = parts.reduce((n, p) => Math.max(n, (p.hints || []).length), 0);
  /* "Worked" means a step that is neither the answer itself nor a pointer back at
     the notes. Counting solution steps instead called stats's 72 Answer+Review
     pairs worked solutions, which is the claim this line exists to stop making. */
  const working = parts.filter(p => (p.solution || []).some(
    st => !/^(answer|review)$/i.test(st.step || ""))).length;
  const hintPhrase = maxHints === 0 ? ""
    : maxHints === 1 ? " One hint per part."
    : ` Up to ${maxHints} hints per part.`;
  const solutionPhrase = working === 0 ? " Each part gives the answer to check yours against."
    : working === parts.length ? " Every part is worked through, step by step."
    : ` ${working} of the ${parts.length} parts are worked through beyond the answer.`;
  body.innerHTML = `
    <p class="page-sub">${total} problems across ${sections.length} sections, hardest last
      within each. ${graded
        ? `Type an answer and it is marked as you go; a wrong one names the slip when
           it recognises it.${hintPhrase}${solutionPhrase}`
        : `Every one has its worked solution — try it first, then open it and
           compare line by line.`}</p>
    ${sections.map(s => {
      const byTier = MODULE_TIERS.map(t => [t, s.items.filter(i => i.tier === t)])
                                 .filter(([, items]) => items.length);
      return `<section class="card prob-section">
        <div class="card-head">
          <h3>§${escapeAttr(s.ref)} · ${escapeAttr(s.title || "")}</h3>
          ${COURSE_SURFACES.includes("notes")
            ? `<a class="prob-read" href="#/${m.id}/learn#sec-${s.ref.replace(".", "-")}">Read §${escapeAttr(s.ref)}</a>`
            : ""}
        </div>
        ${s.note ? `<div class="md prob-note">${MD.render(s.note)}</div>` : ""}
        ${byTier.map(([tier, items]) => `
          <div class="prob-tier">
            <h4 class="tier-head tier-${tier}">${TIER_LABEL[tier]} <span>${items.length}</span></h4>
            ${items.map(it => `
              <article class="prob" id="p-${escapeAttr(it.id)}">
                <div class="prob-n">${escapeAttr(String(it.n))}</div>
                <div class="prob-body">
                  ${it.title ? `<h5 class="prob-title">${escapeAttr(it.title)}</h5>` : ""}
                  <div class="md">${MD.render(it.prompt)}</div>
                  ${problemExtras(it)}
                  ${it.parts ? it.parts.map(pt => partHtml(it, pt)).join("")
                             : `<details class="prob-sol">
                                  <summary>Worked solution</summary>
                                  <div class="md">${MD.render(it.solution)}</div>
                                </details>`}
                </div>
              </article>`).join("")}
          </div>`).join("")}
      </section>`;
    }).join("")}`;
  if (graded) wireGrading(body, sections);
  scrollToPending(body);
}

/* ---------- graded problem sets ----------
 * A problems file may be a reading exercise (prompt + worked solution, which is
 * what a ported markdown course produces) or a graded bank: every part carries
 * the shape of its answer, the value, a tolerance, three hints and the solution
 * as steps. Both live in `chNN-problems.json`; an item with `parts` is graded.
 *
 * Marking happens in the browser, and that is not a compromise. The paid line in
 * this kit is the module: once a buyer unlocks one, the client legitimately holds
 * its key, exactly as it holds the MCQ key after `POST /keys`. Asking the Worker
 * per attempt would spend a request on every keystroke against a budget sized for
 * whole-module fetches.
 */

/* The figure travels inside the problems file rather than beside it: a paid
   module's diagram is as paid as its solutions, and a file under site/data/ is a
   file in the public repo whatever the interface does. Markup from the same
   source as the notes, injected the same way. */
function problemExtras(it) {
  const fig = it.figure ? `<figure class="prob-fig">${it.figure}</figure>` : "";
  const formulas = it.formulas?.length
    ? `<div class="prob-formulas">${it.formulas.map(f => MD.render("$$" + f + "$$")).join("")}</div>`
    : "";
  return fig + formulas;
}

function partHtml(it, pt) {
  const id = `${it.id}:${pt.label}`;
  const type = pt.expect?.type;
  const unit = pt.expect?.unit ? `<span class="p-unit">${escapeAttr(pt.expect.unit)}</span>` : "";
  const isText = type === "explain";
  const isExact = type === "exact";
  const input = type === "choice"
    ? `<select class="p-input" data-part="${escapeAttr(id)}">
         ${(pt.expect.options || []).map((o, i) =>
            `<option value="${i}">${escapeAttr(o)}</option>`).join("")}
       </select>`
    : isText
      ? `<textarea class="p-input p-text" data-part="${escapeAttr(id)}" rows="3"
            placeholder="Write your reasoning, then open the model answer."></textarea>`
      /* `inputmode="decimal"` raises a number pad, which is right for a physics
         answer and useless for "(-∞,-1)∪(5,∞)" — so the keyboard follows the
         shape of the answer. An exact answer also turns off the phone's
         autocorrect and autocapitalise, both of which rewrite algebra. */
      : `<input class="p-input" type="text" inputmode="${isExact ? "text" : "decimal"}"
            data-part="${escapeAttr(id)}"${isExact
              ? ` spellcheck="false" autocapitalize="off" autocorrect="off"` : ""}
            placeholder="${escapeAttr(isExact ? (pt.expect.placeholder || "your answer")
              : type === "numeric-list" ? "e.g. 410, 550" : "your answer")}"
            aria-label="Answer to part ${escapeAttr(pt.label)}">`;
  return `<div class="prob-part" data-part-wrap="${escapeAttr(id)}">
    <p class="p-prompt"><span class="p-label">(${escapeAttr(pt.label)})</span> ${MD.inline(pt.prompt)}</p>
    <div class="p-row">
      ${isText ? input + unit
        /* The unit belongs to the box, not to the buttons: on a phone the row
           wraps, and a bare "nm" stranded at the head of the button line reads
           as a label for Check. */
        : `<span class="p-field">${input}${unit}</span>`}
      ${isText ? "" : `<button class="btn p-check" data-act="check" data-part="${escapeAttr(id)}">Check</button>`}
      ${isText ? "" : `<button class="btn ghost p-hint" data-act="hint" data-part="${escapeAttr(id)}">Hint</button>`}
      <button class="btn ghost p-sol" data-act="solution" data-part="${escapeAttr(id)}">${
        isText ? "Model answer" : "Worked solution"}</button>
    </div>
    <div class="p-feedback" data-fb="${escapeAttr(id)}"></div>
    <div class="p-hints" data-hints="${escapeAttr(id)}"></div>
    <div class="p-solution" data-sol="${escapeAttr(id)}"></div>
  </div>`;
}

/* A number the student typed: accept 4.60, 4,60, 5.31e-7 and 5.31×10^-7. */
function parseAnswerNumber(raw) {
  const cleaned = String(raw).trim().replace(/,/g, ".")
    .replace(/\s|×10\^?|·10\^?/g, "");
  const n = Number(cleaned.replace(/(\d)[eE]([+-]?\d+)/, "$1e$2"));
  return Number.isFinite(n) ? n : null;
}

/* A wrong answer should say how it is wrong. These four cover most of what goes
   wrong in an optics bank: a lost power of ten, a half-width taken for a full
   one, a stray π, and degrees where radians were wanted. */
function nudgeFor(given, expected) {
  if (given === null) return "That is not a number I can read — try 4.60 or 5.31e-7.";
  /* Right size, wrong sign. In geometric optics that is not a slip but the whole
     lesson — s′ < 0 is what "virtual" means — so it gets its own sentence rather
     than the generic one. Checked before the ratio tests, which take |given|. */
  if (expected !== 0 && Math.abs(given + expected) <= Math.abs(expected) * 0.02) {
    return "Right size, wrong sign — and the sign is the answer here. Which side of the element does the convention call positive?";
  }
  const ratio = Math.abs(given / expected);
  const decades = Math.log10(ratio);
  if (Math.abs(decades - Math.round(decades)) < 0.06 && Math.round(decades) !== 0)
    return `Right digits, wrong power of ten — out by 10^${Math.round(decades)}. Check the unit conversions.`;
  if (Math.abs(ratio - 2) < 0.06) return "A factor of 2 high — did you double something already whole?";
  if (Math.abs(ratio - 0.5) < 0.03) return "A factor of 2 low — is the question asking for a half-width or the full one?";
  if (Math.abs(ratio - Math.PI) < 0.06) return "A stray π has crept in.";
  if (Math.abs(ratio - 180 / Math.PI) < 1) return "Radians and degrees have got mixed up.";
  return "Not quite — try again, or take a hint.";
}

/* ---- exact-answer grading — extracted by tools/grade-exact.test.mjs ----------
 * `expect.type: "exact"` is for the answers a precalculus paper actually wants:
 * an interval, a factored form, a solution set, an exact radical. None of them
 * is a number, so `numeric` cannot mark them; marking them `explain` makes the
 * whole tab self-graded, which is most of what a graded tab is for.
 *
 * The comparison is against the author's `accept` list, both sides normalised.
 * What is normalised is *notation*, never mathematics: −5 and −5 are the same
 * keystroke rendered by different keyboards, and (−∞,−1)∪(5,∞) is the same answer as
 * (-\infty,-1)\cup(5,\infty) typed by someone without a maths keyboard. What is
 * NOT normalised is anything a marker would care about — brackets stay square or
 * round, 2/4 is not 1/2, x+1 is not 1+x. Where two genuinely different forms are
 * both acceptable ("x = 5 or x = -1" and "{5, -1}"), the author lists both; the
 * model final states the accepted form for every one of its questions, so that
 * is a decision with a source rather than a matter of taste.
 */
const EXACT_SUBS = [
  [/\$/g, ""],                                  // pasted straight from the prompt
  [/\\left|\\right|\\!|\\,|\\;|\\:|\\quad|\\qquad/g, ""],   // LaTeX spacing
  [/\\[dt]frac/g, "\\frac"],
  [/[−–—‐‑]/g, "-"],   // minus sign, en/em dash, hyphens
  [/[×⋅·]/g, "*"],
  [/≤/g, "\\le"], [/≥/g, "\\ge"], [/<=/g, "\\le"], [/>=/g, "\\ge"],
  [/≠/g, "\\ne"],
  [/∞/g, "\\infty"],
  [/∪/g, "\\cup"],
  [/√/g, "\\sqrt"],
  [/π/g, "\\pi"],
  [/\s+/g, ""],                                 // after the words below are gone
];

function normaliseExact(raw) {
  let s = String(raw ?? "").toLowerCase();
  // Words before symbols: "inf", "infinity" and "union" are what a student types
  // when the keyboard has no ∞ and the notes have no \cup.
  s = s.replace(/\binfinity\b|\binf\b/g, "∞").replace(/\bunion\b/g, "∪");
  for (const [re, to] of EXACT_SUBS) s = s.replace(re, to);
  // A lone "u" wedged between a closing and an opening bracket is the union sign
  // typed on a laptop. Nowhere else is `u` rewritten, so a variable named u is
  // safe: `(0,u)` and `u(x)` both come through untouched.
  s = s.replace(/([)\]])u([([])/g, "$1\\cup$2");
  // x^{2} and x^2 are one keystroke apart and identical to a marker.
  s = s.replace(/([\^_])\{([^{}])\}/g, "$1$2");
  return s.replace(/[.]+$/, "");
}

/* A wrong exact answer should say which *kind* of wrong it is. These three are
   the precalculus mistakes: the right set written with the wrong brackets, the
   right pieces in the wrong order, and the right numbers in the wrong notation
   entirely. None of them leaks the answer. */
function exactNudge(pt, raw) {
  const want = (pt.accept || []).map(normaliseExact);
  const got = normaliseExact(raw);
  const brackets = s => s.replace(/[[\]()]/g, "#");
  if (want.some(w => brackets(w) === brackets(got)))
    return "Right numbers, wrong brackets — square keeps the endpoint, round leaves it out, and an infinite end is always round.";
  const pieces = s => s.split(/\\cup|,/).filter(Boolean).sort().join("|");
  if (want.some(w => pieces(w) === pieces(got) && w !== got))
    return "Right pieces, wrong order — write them left to right along the number line.";
  /* Same numbers, different notation: "x<-1" for "(-\\infty,-1)", "-7\\le x" for
     "[-7,\\infty)". Compared as a multiset of the number literals, because the
     symbols around them are exactly what is wrong. Needs at least one number, or
     every unparseable answer would match every other one. */
  const nums = s => (s.match(/-?\d+(?:\.\d+)?/g) || []).sort().join("|");
  if (nums(got) && want.some(w => nums(w) === nums(got)))
    return "The numbers are right and the notation is not. Read the question again for the form it asks for.";
  const form = pt.expect && pt.expect.form;
  return form ? `Not quite. The answer is wanted ${form}.`
              : "Not quite — try again, or take a hint.";
}

function gradeExact(pt, raw) {
  const got = normaliseExact(raw);
  if (!got) return { correct: false, nudge: "Nothing to mark yet." };
  const correct = (pt.accept || []).some(a => normaliseExact(a) === got);
  return correct ? { correct } : { correct, nudge: exactNudge(pt, raw) };
}
/* ---- end exact-answer grading ---------------------------------------------- */

function gradePart(pt, raw) {
  const tol = pt.tol ?? 0.02;
  if (pt.correct !== undefined) return { correct: Number(raw) === pt.correct };
  /* Any part with an `accept` list is marked as an exact answer, whether or not
     it declares `expect.type: "exact"` — the list is the declaration. This used
     to strip whitespace, lowercase, compare, and return `{correct:false}` with
     no nudge, so every wrong answer rendered "✗" followed by nothing. */
  if (Array.isArray(pt.accept)) return gradeExact(pt, raw);
  if (Array.isArray(pt.value)) {
    const given = String(raw).split(/[,;]/).map(parseAnswerNumber);
    if (given.some(g => g === null) || given.length !== pt.value.length)
      return { correct: false, nudge: `Give ${pt.value.length} numbers, separated by commas.` };
    const pool = [...pt.value];
    for (const g of given) {
      const i = pool.findIndex(v => Math.abs(g - v) <= Math.abs(v) * tol);
      if (i === -1) return { correct: false, nudge: "At least one of those is off." };
      pool.splice(i, 1);
    }
    return { correct: true };
  }
  const given = parseAnswerNumber(raw);
  if (given === null) return { correct: false, nudge: nudgeFor(null, pt.value) };
  const correct = Math.abs(given - pt.value) <= Math.abs(pt.value) * tol;
  return correct ? { correct } : { correct, nudge: nudgeFor(given, pt.value) };
}

function solutionHtml(pt) {
  if (pt.rubric) {
    return `<div class="feedback good"><p class="verdict">What earns the marks</p>
      <ul>${pt.rubric.map(r => `<li>${MD.inline(r)}</li>`).join("")}</ul>${licensedNote()}</div>`;
  }
  return `<div class="sol-steps">${(pt.solution || []).map(s => `
    <div class="sol-step">
      <span class="sol-step-name">${escapeAttr(s.step)}</span>
      ${s.text ? `<p>${MD.inline(s.text)}</p>` : ""}
      ${s.math ? `<div class="md">${MD.render("$$" + s.math + "$$")}</div>` : ""}
    </div>`).join("")}${licensedNote()}</div>`;
}

function wireGrading(body, sections) {
  const parts = new Map();
  for (const s of sections)
    for (const it of s.items)
      for (const pt of it.parts || []) parts.set(`${it.id}:${pt.label}`, pt);

  const shown = new Map();   // how many hints this part has given up

  body.addEventListener("click", e => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = btn.dataset.part;
    const pt = parts.get(id);
    if (!pt) return;
    const wrap = body.querySelector(`[data-part-wrap="${CSS.escape(id)}"]`);
    const input = wrap.querySelector(".p-input");

    if (btn.dataset.act === "check") {
      const raw = input.value;
      if (!String(raw).trim()) return;
      const { correct, nudge } = gradePart(pt, raw);
      wrap.querySelector("[data-fb]").innerHTML = correct
        ? `<div class="feedback good"><p class="verdict">✓ Correct</p></div>`
        : `<div class="feedback bad"><p class="verdict">✗ ${escapeAttr(nudge)}</p></div>`;
      if (correct) wrap.querySelector(".p-sol").textContent = "Show the worked solution";
      return;
    }

    if (btn.dataset.act === "hint") {
      const i = shown.get(id) || 0;
      const hints = pt.hints || [];
      if (i >= hints.length) { btn.disabled = true; return; }
      wrap.querySelector("[data-hints]").insertAdjacentHTML("beforeend",
        `<p class="p-hintline">${MD.inline(hints[i])}</p>`);
      shown.set(id, i + 1);
      if (i + 1 >= hints.length) btn.disabled = true;
      return;
    }

    if (btn.dataset.act === "solution") {
      wrap.querySelector("[data-sol]").innerHTML = solutionHtml(pt);
      btn.disabled = true;
    }
  });
}

/* ---------- notes navigation ----------
 * The chapters run 8–13k words across 16–21 `## N.M` sections. md.js already
 * gives every heading an id (`sec-6-4`), so the contents list is built straight
 * from the rendered DOM — no second parse of the markdown.
 */

function buildToc(m, notes, tocEl) {
  const heads = [...notes.querySelectorAll("h2")];
  if (heads.length < 3) return;

  tocEl.innerHTML = `
    <button class="toc-toggle" aria-expanded="false" aria-controls="toc-list">
      <span>Contents · ${heads.length} sections</span><span class="toc-caret">▾</span>
    </button>
    <nav class="toc-list" id="toc-list" aria-label="Sections of this chapter">
      ${heads.map(h => `<a href="#${h.id}" data-id="${h.id}">${h.textContent}</a>`).join("")}
    </nav>`;

  const toggle = $(".toc-toggle", tocEl);
  toggle.addEventListener("click", () => {
    const open = tocEl.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const links = [...tocEl.querySelectorAll(".toc-list a")];
  links.forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById(a.dataset.id).scrollIntoView({ behavior: "smooth", block: "start" });
    tocEl.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  const p = Store.module(m.id);
  const fill = $("#read-fill");
  let activeId = null;

  PageScroll.set(() => {
    if (!notes.isConnected) return PageScroll.clear();
    // Reading progress across the article, not the whole document.
    const box = notes.getBoundingClientRect();
    const read = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - innerHeight)));
    if (fill) fill.style.width = `${read * 100}%`;

    // Current section = the last heading whose top has passed the sticky bar.
    let current = heads[0];
    for (const h of heads) {
      if (h.getBoundingClientRect().top <= 130) current = h;
      else break;
    }
    if (current.id === activeId) return;
    activeId = current.id;
    links.forEach(a => a.classList.toggle("active", a.dataset.id === activeId));
    const hit = links.find(a => a.dataset.id === activeId);
    if (hit) hit.scrollIntoView({ block: "nearest" });
    // Never record the first heading: the page opens at the top, so doing so
    // would wipe the saved position on every visit before the student reads a word.
    if (current === heads[0]) return;
    p.lastSection = { id: activeId, label: current.textContent };
    Store.save();
  });

  // Offer to jump back only if the student got somewhere last time.
  const last = p.lastSection;
  if (last && heads.findIndex(h => h.id === last.id) > 0) {
    const chip = document.createElement("button");
    chip.className = "resume-section";
    chip.innerHTML = `<span class="r-label">Continue reading</span><span>${last.label}</span>`;
    // Above the two-column grid, not inside it — otherwise it becomes a grid item.
    const layout = notes.parentElement;
    layout.parentElement.insertBefore(chip, layout);
    chip.addEventListener("click", () => {
      const el = document.getElementById(last.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      chip.remove();
    });
  }
}

/* Deep-link from quiz feedback: "review §2.4" sets sessionStorage then routes to learn */
function scrollToPending(body) {
  const target = sessionStorage.getItem(`${Api.courseId}-scroll`);
  if (!target) return;
  sessionStorage.removeItem(`${Api.courseId}-scroll`);
  const el = body.querySelector(`#${target}`);
  if (el) {
    /* Instant, not smooth. A smooth scrollIntoView is a request the engine may
       decline, and when it declines it does so silently: measured in the
       shipped tree, `behavior:"smooth"` left the page at scrollY 0 while the
       target sat 13,700px down, and `behavior:"auto"` on the same element in
       the same session scrolled to 13,526. Every "re-read §5.11" pointer, and
       all 48 links out of the free readiness page, depend on this landing. */
    el.scrollIntoView({ behavior: "auto", block: "start" });
    el.classList.add("flash");
    /* Scrolling is the sighted half of "re-read section 5.11". Without the focus
       move a screen-reader student lands at the top of a 9,000-word chapter, and
       under prefers-reduced-motion the .flash highlight is suppressed too — so
       that student got no confirmation at all that anything had happened. */
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

/* ---------- locked state & sign-in ----------
 * Module 01 ships in full as static files. Everything else — the notes, question
 * stems and summaries of modules 02–12, and the answer key, diagnostics, model
 * answers and rubrics throughout — comes from the Worker, because a file in the
 * published tree is a file anyone can open directly. */

/* Two different people see this card, and they must not be told the same thing.
   Someone who has never bought is deciding whether to; someone whose session
   just ended has already paid, and showing them a padlock, the sales pitch and a
   $25 button reads as "pay again" — the likeliest support message this product
   can generate. The server cannot tell them apart (it returns the same 401 for an
   evicted slot as for no key at all, deliberately, so a stranger learns nothing),
   but the browser can: only a device that had a token can have lost one. */
function renderLock(el, message, retry) {
  const hadKey = Api.everSignedIn;
  el.innerHTML = hadKey ? `
    <div class="card lock-card">
      <div class="lock-icon" aria-hidden="true">🔑</div>
      <h3>You've been signed out on this device</h3>
      <p class="muted">${message}</p>
      <p class="muted lock-what">Your licence covers ${DEVICES_PHRASE} at a time. Unlocking it
        somewhere else signs out whichever device you used least recently — so if you have just
        opened the course on ${ONE_TOO_MANY}, this one is the one that gave up its place. Sign in again
        with the same key to take it back.</p>
      <div class="row-gap">
        <a class="btn" href="#/login">Sign in again</a>
        <button class="btn secondary" id="lock-retry">Try again</button>
        <a class="btn secondary" href="${CONTACT}" target="_blank" rel="noopener">Get help</a>
      </div>
    </div>` : `
    <div class="card lock-card">
      <div class="lock-icon" aria-hidden="true">🔒</div>
      <h3>This part needs a key</h3>
      <p class="muted">${message}</p>
      <p class="muted lock-what">${WHAT_A_KEY_BUYS}</p>
      <div class="row-gap">
        ${buyButton()}
        <a class="btn secondary" href="#/login">I have a key</a>
        <button class="btn secondary" id="lock-retry">Try again</button>
      </div>
    </div>`;
  const again = $("#lock-retry", el);
  if (again) again.addEventListener("click", () => retry());
}

/* A locked module's Learn and Summary tabs. Not the lock card: this is the one
   screen where a visitor is deciding whether to buy, so it says what the chapter
   covers and how much of it there is — the description in MODULES, which is
   written for exactly this page.

   What it deliberately does not show is the module's own text. It used to print
   the whole one-page summary, and a high-yield summary is the chapter distilled:
   eleven of those is most of the revision value given away for nothing. A
   description tells a visitor what they would be buying; a summary is the thing
   itself. */
function renderModuleTeaser(m, body, retry) {
  /* The same distinction renderLock makes, and it has to be made here too: a
     rejected token is cleared, which drops the reader back to "signed out", and
     this is the screen they land on for a module tab. Found by walking the path
     for real — the first version of the fix only covered renderLock, so a buyer
     whose slot had just been taken still met "Module 07 needs a key" and a $25
     button on the chapter they had opened. */
  const hadKey = Api.everSignedIn;
  body.innerHTML = `
    <div class="card lock-card">
      <div class="lock-icon" aria-hidden="true">${hadKey ? "🔑" : "🔒"}</div>
      ${hadKey ? `
      <h3>You've been signed out on this device</h3>
      <p class="muted lock-what">Your licence covers ${DEVICES_PHRASE} at a time, and unlocking it
        somewhere else signs out whichever device you used least recently. Sign in again with the
        same key to take this one back — nothing you have answered here is lost.</p>
      <div class="row-gap">
        <a class="btn" href="#/login">Sign in again</a>
        <button class="btn secondary" id="teaser-retry">Try again</button>
        <a class="btn secondary" href="${CONTACT}" target="_blank" rel="noopener">Get help</a>
      </div>` : `
      <h3>Module ${m.num} needs a key</h3>
      <p class="muted lock-what">${WHAT_A_KEY_BUYS}</p>
      <div class="row-gap">
        ${buyButton()}
        <a class="btn secondary" href="#/login">I have a key</a>
        <button class="btn secondary" id="teaser-retry">Try again</button>
      </div>`}
    </div>
    <div class="card teaser-about">
      <div class="card-head"><h3>What Module ${m.num} covers</h3><span class="pill">Preview</span></div>
      <p class="teaser-blurb">${m.blurb}</p>
      <ul class="topic-list">${m.topics.map(t => `<li>${t}</li>`).join("")}</ul>
      <p class="muted teaser-stats">${moduleContents(m)}</p>
      <div class="row-gap">
        <a class="btn secondary" href="#/${Api.FREE_MODULES[0]}/${MODULE_TABS[0]}">See all of this in Module ${FREE_MODULE_NUM}, free</a>
      </div>
    </div>`;
  $("#teaser-retry", body).addEventListener("click", () => retry());
}

/* Everything that needs an answer key has the same three failure modes, and only
 * one of them is a product state. Being throttled or offline must not send the
 * student to a sign-in form they do not need — they are already signed in. */
function renderBlocked(el, err, retry) {
  if (err.code === "auth") return renderLock(el, err.message, retry);
  const title = err.code === "rate" ? "That's a lot of answers at once"
    : err.code === "net" ? "No connection to the answer service"
      : "Could not load that";
  el.innerHTML = `
    <div class="card lock-card">
      <div class="lock-icon" aria-hidden="true">${err.code === "rate" ? "⏳" : "⚠️"}</div>
      <h3>${title}</h3>
      <p class="muted">${err.message}</p>
      <div class="row-gap"><button class="btn" id="blocked-retry">Try again</button></div>
    </div>`;
  $("#blocked-retry", el).addEventListener("click", () => retry());
}

/* Printed under every explanation and model answer in production. The invisible
 * watermark the Worker adds is what traces a leak; this line is what stops one,
 * by reminding the student that the text they are about to forward has their own
 * name on it. */
function licensedNote() {
  const who = Api.account && Api.account.email;
  return who ? `<p class="licensed-note">Licensed to ${who}</p>` : "";
}

/* The server's own message to a flagged account, shown once. */
function noticeBar() {
  if (!Api.notice) return "";
  const text = Api.notice;
  Api.notice = null;
  return `<div class="card notice">${text}</div>`;
}

/* One field: the key sent when the licence was issued. No mailbox in the way, because the
 * two things that actually cost a sharer something — the device cap and the
 * metered key budget — do not care what the credential is, and taxing every
 * honest buyer with a code round trip buys almost nothing against the common
 * case of lending it to one friend.
 *
 * A licence the server has flagged is the exception: it comes back asking for a
 * code sent to the buyer's own address, which is the one thing a key posted in a
 * public channel cannot get past.
 *
 * Both house rules are stated here rather than buried in terms nobody reads: a
 * rule students do not know about deters nobody, and only feels like a bug the
 * first time it fires. */
function renderLogin(presetKey) {
  document.title = `Unlock the course — ${COURSE_TITLE}`;
  const back = Store.data.last ? `#/${Store.data.last.mod}/${Store.data.last.tab}` : "#/";
  const signedIn = Api.account && Api.token;

  main.innerHTML = `
    <div class="page">
      <div class="crumbs"><a href="#/">Modules</a> / ${signedIn ? "Your account" : "Unlock"}</div>
      <h1 class="page-title">${signedIn ? "Your account" : "Unlock the course"}</h1>
      ${signedIn ? `
        <p class="page-sub">Unlocked as <strong>${Api.account.email}</strong> on this device
          (${Api.deviceLabel}).</p>
        <div class="card">
          <p class="muted">Your licence covers ${DEVICES_PHRASE} at a time. Unlocking somewhere else
            signs out whichever device you used least recently.</p>
          <div class="row-gap">
            <a class="btn" href="${back}">Back to the course</a>
            <button class="btn secondary" id="logout">Sign out of this device</button>
          </div>
        </div>
        ${presetKey ? `
        <div class="card">
          <h3>This link carries an access key</h3>
          <p class="muted">This device is already unlocked, so opening the link did not sign it in
            again. If the key in it replaces the one you had — a lost key reissued, or a key that had
            got out and was stopped — use it here: this device signs in on that key, and the session
            above ends.</p>
          <p class="login-msg" id="preset-msg" role="status" aria-live="polite"></p>
          <div class="row-gap">
            <button class="btn" id="preset-use">Use this key on this device</button>
          </div>
        </div>` : ""}` : `
        <p class="page-sub">Paste the access key you were sent. There is no password
          and no account to create.</p>
        <form class="card login-card" id="login-form" novalidate>
          <label class="field">
            <span>Access key</span>
            <input type="text" id="login-key" autocomplete="off" spellcheck="false" required
                   placeholder="${KEY_PREFIX}-XXXXX-XXXXX-XXXXX-XXXXX" value="${escapeAttr(presetKey)}">
          </label>
          <p class="login-msg" id="login-msg" role="status" aria-live="polite"></p>
          <div class="row-gap">
            <button class="btn" type="submit" id="login-submit">Unlock</button>
            <a class="btn secondary" href="${back}">Back to the course</a>
          </div>
        </form>
        <details class="card lost-key">
          <summary>I've lost my key</summary>
          <p class="muted">Message me and I'll issue a new one. The old key stops working —
            which is also how you kill a key that has got out.</p>
          <div class="row-gap">
            <a class="btn secondary" href="${CONTACT}" target="_blank" rel="noopener">Message me on Telegram</a>
          </div>
        </details>
        <ul class="muted login-terms">
          <li>${DEVICES_PHRASE.charAt(0).toUpperCase() + DEVICES_PHRASE.slice(1)} at a time — ${DEVICES_EXAMPLE}. Unlocking ${ONE_TOO_MANY} signs out
            the one you used least recently.</li>
          <li>Every explanation you are shown is tagged with your licence, so a copy that
            ends up in a group chat can be traced back to it.</li>
        </ul>`}
      <p class="muted login-foot">
        ${Api.mode === "local"
          ? "This build runs in local mode — everything is already unlocked, so there is nothing to enter yet."
          : `Trouble unlocking? <a href="${CONTACT}" target="_blank" rel="noopener">Message me on Telegram</a> and I'll sort it out.`}
      </p>
    </div>`;

  /* An unlock link that arrives at a device which is already signed in. The
     reissue path — a lost key, or one that had got out and was stopped — sends
     the buyer exactly this link, and its whole instruction is "open this link
     and it unlocks itself". `attempt()` below runs only when signed out, so on
     that device the link used to do nothing whatsoever: the page said "Unlocked
     as @them" over a session the server had already killed, and the new key was
     never sent anywhere. Offered rather than claimed on arrival, because taking
     a device slot is not something a link should do to a session behind the
     reader's back. */
  const preset = $("#preset-use");
  if (preset) {
    const pmsg = $("#preset-msg");
    preset.addEventListener("click", async () => {
      preset.disabled = true;
      pmsg.className = "login-msg";
      pmsg.textContent = "Checking…";
      try {
        const { evicted } = await Api.claim(presetKey);
        pmsg.className = "login-msg good";
        pmsg.textContent = evicted
          ? "Unlocked. Your least recently used device has been signed out."
          : "Unlocked. Taking you to the course…";
        setTimeout(() => go(back), evicted ? 1800 : 700);
      } catch (err) {
        pmsg.className = "login-msg bad";
        pmsg.textContent = err.message;
        preset.disabled = false;
      }
    });
  }

  const out = $("#logout");
  if (out) return out.addEventListener("click", async () => {
    await Api.logout();
    renderLogin();
  });

  const form = $("#login-form");
  const msg = $("#login-msg");
  const submit = $("#login-submit");

  const say = (text, cls = "") => { msg.textContent = text; msg.className = `login-msg ${cls}`; };

  const done = evicted => {
    say(evicted
      ? "Unlocked. Your least recently used device has been signed out."
      : "Unlocked. Taking you to the course…", "good");
    setTimeout(() => go(back), evicted ? 1800 : 700);
  };

  async function attempt() {
    const key = $("#login-key").value.trim();
    if (!key) return say("Paste the key you were sent.", "bad");

    submit.disabled = true;
    say("Checking…");
    try {
      done((await Api.claim(key)).evicted);
    } catch (err) {
      say(err.message, "bad");
    }
    submit.disabled = false;
  }

  form.addEventListener("submit", e => { e.preventDefault(); attempt(); });

  // Arriving from the unlock link: try it straight away, so the first unlock is
  // a click rather than twenty characters typed on a phone.
  if (presetKey && !signedIn && Api.mode !== "local") attempt();
}

/* ---------- cross-module question sets ---------- */

/* Every module numbers its questions A1…A18, so an id only identifies a question
 * *inside* its module — ch03's A1 and ch07's A1 are different questions. Any set
 * that mixes modules (the exam, the mistakes pass) therefore works in qualified
 * ids, "ch03:A1", with `modId` and `localId` carried on the item. Progress is
 * still stored per module under the local id, so nothing in the saved shape
 * changes. */
const qualify = (modId, localId) => `${modId}:${localId}`;
const modOfQid = qid => qid.split(":")[0];

/* Question stems only. The answer key is no longer part of loading a screen: it
 * arrives per question from `Keys`, a few at a time, once the student is actually
 * looking at them. See api.js for why that matters. */
async function loadItems(modIds) {
  const parts = await Promise.all(modIds.map(async id => ({
    id,
    q: await Api.getQuestions(id),
  })));
  const items = [];
  parts.forEach(({ id, q }) => {
    q.mcq.forEach(it => items.push({ ...it, id: qualify(id, it.id), localId: it.id, modId: id }));
  });
  return items;
}

/* Progress accessors that take a qualified id and land in the right module. */
const modProgress = {
  read: qid => (Store.data[modOfQid(qid)] || { mcq: {} }).mcq[qid.split(":")[1]],
  write(qid, entry) {
    const [modId, localId] = qid.split(":");
    const p = Store.module(modId);
    p.mcq[localId] = entry;
    // A question answered correctly on a second pass has served its purpose as a
    // flag; leaving it set would drag it back into the next mistakes list.
    if (entry.correct && p.flagged) delete p.flagged[localId];
    Store.save();
    renderNav();
  },
  isFlagged: qid => {
    const [modId, localId] = qid.split(":");
    return !!((Store.data[modId] || {}).flagged || {})[localId];
  },
  toggleFlag(qid) {
    const [modId, localId] = qid.split(":");
    const p = Store.module(modId);
    if (!p.flagged) p.flagged = {};
    p.flagged[localId] = !p.flagged[localId];
    Store.save();
    return !!p.flagged[localId];
  },
};

/* Everything answered wrong or flagged, course-wide. Derived from the progress
 * store on demand, so there is no second list to keep in sync. */
function mistakeIds() {
  const out = [];
  MODULES.forEach(m => {
    if (!m.ready) return;
    const p = Store.data[m.id];
    if (!p) return;
    const ids = new Set();
    Object.entries(p.mcq || {}).forEach(([id, e]) => { if (!e.correct) ids.add(id); });
    Object.entries(p.flagged || {}).forEach(([id, on]) => { if (on) ids.add(id); });
    [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .forEach(id => out.push(qualify(m.id, id)));
  });
  return out;
}

/* ---------- fix pass ----------
 * An instant-feedback run over an arbitrary set of qualified questions, writing
 * every answer through to the module it came from. Both #/review and the
 * "go through what you missed" step after the exam are this. */
function fixPass({ items, body, onFinish, alive }) {
  const session = {};
  playMcq({
    items,
    feedback: "instant",
    alive,
    // The store already holds an answer for every question that lands here —
    // that is how it got here — so the pass keeps its own session record.
    // Without it the player would see a finished set and jump to the results.
    read: qid => session[qid],
    write: (qid, entry) => { session[qid] = entry; modProgress.write(qid, entry); },
    isFlagged: modProgress.isFlagged,
    toggleFlag: modProgress.toggleFlag,
    badge: it => `Module ${(MODULES.find(m => m.id === it.modId) || {}).num} · ${it.topic}`,
    learnHref: it => `#/${it.modId}/learn`,
    onFinish: () => onFinish(session),
  }, body);
}

/* The screen every fix pass ends on. `back` is the caller's own escape hatch. */
function fixResults({ items, session, body, again, back }) {
  QuizKeys.clear();
  quizMode(false);
  const done = items.filter(it => session[it.id]);
  const fixed = done.filter(it => session[it.id].correct).length;
  const stillWrong = done.filter(it => !session[it.id].correct).map(it => it.id);
  const verdict = !stillWrong.length
    ? "All of them fixed. They are out of your mistakes list."
    : fixed >= stillWrong.length
      ? "Good progress — the ones below are still open."
      : "These are the ideas to go back to the notes for.";

  body.innerHTML = `
    <div class="card">
      <div class="score-hero">
        <div><span class="big">${fixed}</span><span class="of"> / ${done.length} fixed</span></div>
        <p>${verdict}</p>
      </div>
    </div>
    ${weakSections(stillWrong, 6)}
    <div class="quiz-nav">
      ${stillWrong.length ? `<button class="btn" id="again">Another pass at the ${stillWrong.length} still wrong</button>` : ""}
      ${back}
    </div>`;

  body.querySelectorAll("[data-review]").forEach(a =>
    a.addEventListener("click", () =>
      sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + a.dataset.review.replace(".", "-"))));

  const btn = $("#again", body);
  if (btn) btn.addEventListener("click", () => again(stillWrong));
}

/* ---------- mistakes pass (#/review) ---------- */

async function renderReview() {
  // Captured before the awaits below: navigating away while the questions load
  // must stop the player from landing on — and wiring a keyboard handler to — a
  // page the student has already left. Reading the epoch inside playMcq instead
  // could never fire, because a player that starts late starts on the current one.
  const alive = currentRender();
  document.title = `Work on your mistakes — ${COURSE_TITLE}`;
  PageScroll.clear();
  main.innerHTML = `
    <div class="page">
      <div class="crumbs"><a href="#/">Modules</a> / Work on your mistakes</div>
      <h1 class="page-title">Work on your mistakes</h1>
      <p class="page-sub">Every question you answered wrong or flagged, from all
        ${MODULES.filter(m => m.ready).length} modules, in one pass. Get it right here and it
        leaves the list.</p>
      <div id="tab-body"></div>
    </div>`;
  const body = $("#tab-body");

  const ids = mistakeIds();
  if (!ids.length) {
    body.innerHTML = `
      <div class="card empty-card">
        <h3>Nothing to re-do</h3>
        <p class="muted">No wrong answers and no flagged questions. Either you have not
          started yet, or you have cleared everything you missed.</p>
        <div class="row-gap">
          <a class="btn" href="#/exam">Sit the mock exam</a>
          <a class="btn secondary" href="#/">Back to modules</a>
        </div>
      </div>`;
    return;
  }

  body.innerHTML = `<div class="card"><p class="muted">Loading ${ids.length} questions…</p></div>`;

  const modIds = [...new Set(ids.map(modOfQid))];
  let all;
  try {
    all = await loadItems(modIds);
  } catch (e) {
    if (e.code === "auth") return renderLock(body, e.message, () => renderReview());
    body.innerHTML = `<div class="card"><h3>Could not load these questions</h3>
      <p class="muted">${e.message}</p></div>`;
    return;
  }

  const wanted = new Set(ids);
  const items = all.filter(it => wanted.has(it.id));

  fixPass({
    items,
    body,
    alive,
    onFinish: session => fixResults({
      items, session, body,
      // The store is the source of truth for what is still wrong, so re-entering
      // the route rebuilds exactly the remaining set.
      again: () => go("#/review"),
      back: `<a class="btn secondary" href="#/">Back to modules</a>`,
    }),
  });
}

/* ---------- interactive trainers (#/sims and #/sims/<id>) ----------
 *
 * The catalogue is public: a visitor sees every trainer's name and which chapter
 * it belongs to, because that is the shop window. Opening one needs the module
 * it belongs to — free module free, everything else behind the key, exactly like
 * the notes. The engine lives in sims.js and holds no course content.
 */
let simTeardown = null;

async function renderSims(simId) {
  document.title = `Trainers — ${COURSE_TITLE}`;
  PageScroll.clear();
  // A trainer owns a ResizeObserver; leaving it attached after the route changes
  // is how a single-page app quietly accumulates work per navigation.
  if (simTeardown) { simTeardown(); simTeardown = null; }

  main.innerHTML = `
    <div class="page">
      <div class="crumbs"><a href="#/">Modules</a> / Trainers${
        simId ? ` / <a href="#/sims">catalogue</a>` : ""}</div>
      <h1 class="page-title">Interactive trainers</h1>
      <p class="page-sub">Every idea in this course that is easier to feel than to read:
        move a slider, watch what the formula does. Each trainer opens with the chapter
        it belongs to.</p>
      <div id="tab-body"></div>
    </div>`;
  const body = $("#tab-body");
  body.innerHTML = `<div class="card"><p class="muted">Loading…</p></div>`;

  let index;
  try {
    index = await simsIndex();
  } catch (e) {
    body.innerHTML = `<div class="card"><h3>Could not load the trainers</h3>
      <p class="muted">${e.message}</p></div>`;
    return;
  }

  if (!simId) return renderSimCatalogue(body, index);

  const row = index.find(r => r.id === simId);
  if (!row) { body.innerHTML = `<div class="card"><h3>No such trainer</h3></div>`; return; }
  if (needsKey(row.module)) {
    /* renderLock, not a card of our own: it is the one place that tells a buyer
       who has merely lost a device slot from a visitor who never had a key. Two
       surfaces used to hand-roll this and so sold the course back to people who
       had already bought it. */
    renderLock(body, `This trainer belongs to Module ${
      MODULES.find(m => m.id === row.module)?.num || row.module}.`,
      () => renderSims(simId));
    return;
  }

  body.innerHTML = `<div class="card"><p class="muted">Loading the trainer…</p></div>`;
  let pack;
  try {
    pack = await Api.getSims(row.module);
  } catch (e) {
    renderBlocked(body, e, () => renderSims(simId));
    return;
  }
  const sim = (pack?.sims || []).find(s => s.id === simId);
  if (!sim) {
    body.innerHTML = `<div class="card"><h3>That trainer is not in this module yet</h3></div>`;
    return;
  }
  body.innerHTML = `<div id="sim-host"></div>
    <div class="row-gap"><a class="btn secondary" href="#/sims">All trainers</a></div>`;
  simTeardown = SIMS.render($("#sim-host", body), sim);
  // "Re-read §3.6" has to land on the section, the same deep link the quiz uses.
  main.querySelectorAll("#sim-host a[data-review]").forEach(a => a.addEventListener("click", () =>
    sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + a.dataset.review.replace(".", "-"))));
}

function renderSimCatalogue(body, index) {
  const byModule = MODULES.filter(m => index.some(r => r.module === m.id));
  body.innerHTML = byModule.map(m => {
    const rows = index.filter(r => r.module === m.id);
    return `<div class="card sim-group">
      <div class="card-head">
        <h3>Module ${m.num} · ${escapeAttr(m.title)}</h3>
        ${needsKey(m.id) ? `<span class="pill">needs a key</span>`
                         : `<span class="pill done">open</span>`}
      </div>
      <ul class="sim-list">${rows.map(r => `<li>
        <a href="#/sims/${encodeURIComponent(r.id)}">${escapeAttr(r.title)}</a>
        ${needsKey(m.id) ? `<span class="nav-lock" aria-hidden="true">🔒</span>` : ""}
      </li>`).join("")}</ul>
    </div>`;
  }).join("") || `<div class="card"><p class="muted">No trainers yet.</p></div>`;
}

/* ---------- course reference documents (#/docs) ----------
   Cheat sheets and a diagnostic: pages that belong to the course rather than to
   any one module, which is why they are neither a module tab nor a part of
   /content. The catalogue is generated into COURSE_DOCS from the course file,
   so a course that lists none never shows this surface at all. */

async function renderDocs(docId) {
  const row = docId ? COURSE_DOCS.find(d => d.id === docId) : null;
  document.title = `${row ? row.title : "Cheat sheets"} — ${COURSE_TITLE}`;
  PageScroll.clear();

  main.innerHTML = `
    <div class="page wide">
      <div class="crumbs"><a href="#/">Modules</a> / ${
        docId ? `<a href="#/docs">Cheat sheets</a> / ${escapeAttr(row ? row.title : docId)}`
              : "Cheat sheets"}</div>
      ${docId ? "" : `<h1 class="page-title">Cheat sheets and the diagnostic</h1>
      <p class="page-sub">Reference pages for the whole course rather than for one chapter:
        which technique a problem is asking for, and every formula in one place.</p>`}
      <div id="tab-body"></div>
    </div>`;
  const body = $("#tab-body");

  if (!docId) {
    body.innerHTML = `<div class="card"><ul class="sim-list">${COURSE_DOCS.map(d => `<li>
      <a href="#/docs/${encodeURIComponent(d.id)}">${escapeAttr(d.title)}</a>
      ${d.free ? `<span class="pill done">free</span>`
               : docNeedsKey(d) ? `<span class="nav-lock" aria-hidden="true">🔒</span>` : ""}
    </li>`).join("")}</ul></div>`;
    return;
  }

  if (!row) { body.innerHTML = `<div class="card"><h3>No such page</h3></div>`; return; }

  if (docNeedsKey(row)) {
    renderLock(body, `${escapeAttr(row.title)} is one of the reference pages a key opens.`,
      () => renderDocs(docId));
    return;
  }

  body.innerHTML = `<div class="card"><p class="muted">Loading…</p></div>`;
  const epoch = renderEpoch;
  let md;
  try {
    md = await Api.getCourseDoc(row.id, row.free);
  } catch (e) {
    if (epoch !== renderEpoch) return;
    // renderBlocked, not a bare message: it distinguishes throttled from offline
    // from signed-out, and every one of its cards carries a way back. A card
    // that says "try again" with nothing to press is a dead end.
    renderBlocked(body, e, () => renderDocs(docId));
    return;
  }
  if (epoch !== renderEpoch) return;
  body.innerHTML = `<article class="md">${MD.render(md)}</article>
    <div class="row-gap"><a class="btn secondary" href="#/docs">All cheat sheets</a></div>`;

  /* "§2.7" in a sheet means a section of the notes. Same deep link the quiz and
     the trainers use, and the same reason: a reader who has just been told which
     rule applies wants the worked version, not the search box. */
  body.querySelectorAll('a[href^="#/"]').forEach(a => {
    const ref = a.textContent.match(/§\s*(\d+\.\d+)/);
    if (!ref) return;
    a.addEventListener("click", () =>
      sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + ref[1].replace(".", "-")));
  });
}

/* ---------- graded lecture questions (#/signals) ---------- */

async function renderSignals() {
  document.title = `Graded questions — ${COURSE_TITLE}`;
  PageScroll.clear();
  main.innerHTML = `
    <div class="page wide">
      <div class="crumbs"><a href="#/">Modules</a> / Graded questions</div>
      <div id="tab-body"></div>
    </div>`;
  const body = $("#tab-body");
  body.innerHTML = `<div class="card"><p class="muted">Loading…</p></div>`;

  let md;
  try {
    md = await Api.getDoc("exam-signals");
  } catch (e) {
    renderBlocked(body, e, () => renderSignals());
    return;
  }
  body.innerHTML = `<article class="md">${MD.render(md)}</article>`;

  // Links are written as "[Module 01 §1.3](#/ch01/learn)", so the section to
  // scroll to is in the link *text*. Pulling it out here keeps the markdown
  // plain and needs no extra syntax in the renderer.
  body.querySelectorAll('a[href^="#/"]').forEach(a => {
    const ref = a.textContent.match(/§\s*(\d+\.\d+)/);
    if (!ref) return;
    a.addEventListener("click", () =>
      sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + ref[1].replace(".", "-")));
  });
}

/* ---------- mock exam (#/exam) ---------- */

const EXAM_SIZE = EXAM_PER_MODULE * MODULES.filter(m => m.ready).length;

/* mulberry32. The attempt stores its seed, not its question list: the same seed
 * rebuilds the same paper after a reload, and a new attempt gets a new seed and
 * therefore a different four questions per module out of the eighteen. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Course order, `EXAM_PER_MODULE` from each module. Grouping by module rather
 * than interleaving keeps the paper reading like the course does, and makes the
 * per-module breakdown on the results screen mean something. */
function examPaper(items, seed) {
  const rand = rng(seed);
  const out = [];
  MODULES.forEach(m => {
    if (!m.ready) return;
    const pool = items.filter(it => it.modId === m.id);
    for (let i = pool.length - 1; i > 0; i--) {           // Fisher–Yates
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    out.push(...pool.slice(0, EXAM_PER_MODULE));
  });
  return out;
}

function examState() {
  return Store.data.exam || null;
}

function startExam() {
  Store.data.exam = {
    seed: (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0,
    started: Date.now(),
    answers: {},
    flagged: {},
    submitted: false,
  };
  Store.save();
  return Store.data.exam;
}

const examRemaining = ex =>
  Math.max(0, EXAM_MINUTES * 60000 - (Date.now() - ex.started));

const clock = ms => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

async function renderExam() {
  const alive = currentRender();   // see renderReview
  document.title = `Mock exam — ${COURSE_TITLE}`;
  PageScroll.clear();
  main.innerHTML = `
    <div class="page">
      <div class="crumbs"><a href="#/">Modules</a> / Mock exam</div>
      <h1 class="page-title">Mock exam</h1>
      <p class="page-sub">${EXAM_SIZE} multiple-choice questions, ${EXAM_PER_MODULE} from every
        module, under exam conditions: no verdict and no explanation until you submit.</p>
      <div id="tab-body"></div>
    </div>`;
  const body = $("#tab-body");
  body.innerHTML = `<div class="card"><p class="muted">Loading the paper…</p></div>`;

  const modIds = MODULES.filter(m => m.ready).map(m => m.id);
  let pool;
  try {
    pool = await loadItems(modIds);
  } catch (e) {
    renderBlocked(body, e, () => renderExam());
    return;
  }

  const ex = examState();
  if (!ex) return intro();
  if (ex.submitted) return results(ex);
  if (!examRemaining(ex)) { ex.submitted = true; Store.save(); return results(ex); }
  return sit(ex);

  /* Marks the paper in one call, at the end. Nothing before this point has put an
     answer in the browser — sitting the exam leaks nothing, and what it does
     fetch afterwards is exactly the questions the student sat.
     The attempt is passed in, never read from the enclosing scope: on a first
     sitting `renderExam`'s own `ex` is still null when this runs. */
  async function mark(ex, items) {
    await Keys.ensure(items.map(it => it.id));
    const unkeyed = [];
    items.forEach(it => {
      const entry = ex.answers[it.id];
      if (!entry) return;
      /* A missing key is not a wrong answer. `(Keys.get(id) || {}).answer` is
         undefined when the server has no key for that question — a Worker
         carrying an older content bundle than the site answers 200 with an
         empty set — and comparing a real choice against undefined marked every
         one of those questions wrong and saved the score. The student sees a
         failed paper and no reason for it. Leave them unmarked and say so. */
      const key = Keys.get(it.id);
      if (!key || key.answer === undefined) { unkeyed.push(it.id); delete entry.correct; return; }
      entry.correct = entry.picked === key.answer;
    });
    ex.unkeyed = unkeyed.length ? unkeyed : undefined;
    Store.save();
  }

  function intro(previous) {
    const done = Object.keys((previous || {}).answers || {}).length;
    body.innerHTML = `
      <div class="card">
        <h3>Before you start</h3>
        <ul class="exam-rules">
          <li><strong>${EXAM_SIZE} questions</strong> — ${EXAM_PER_MODULE} drawn at random from each
            of the ${modIds.length} modules, so no two attempts are the same paper.</li>
          <li><strong>${EXAM_MINUTES} minutes.</strong> The clock keeps running if you close the
            tab, exactly as it would in the hall.</li>
          <li><strong>No feedback until you submit.</strong> You can move back and forth, change
            an answer and flag anything you want to come back to.</li>
          <li>Your module practice scores are <strong>not</strong> touched by an attempt.</li>
        </ul>
        <div class="row-gap">
          <button class="btn" id="exam-start">Start the exam</button>
          <a class="btn secondary" href="#/">Not yet</a>
        </div>
        ${previous ? `<p class="muted stack-top">Your last attempt: ${previous.score} / ${previous.total}
          (${done} answered).</p>` : ""}
      </div>`;
    $("#exam-start", body).addEventListener("click", () => sit(startExam()));
  }

  function sit(ex) {
    const items = examPaper(pool, ex.seed);

    playMcq({
      items,
      feedback: "deferred",
      alive,
      read: qid => ex.answers[qid],
      write: (qid, entry) => { ex.answers[qid] = entry; Store.save(); },
      isFlagged: qid => !!ex.flagged[qid],
      toggleFlag: qid => { ex.flagged[qid] = !ex.flagged[qid]; Store.save(); return !!ex.flagged[qid]; },
      badge: it => `Module ${(MODULES.find(m => m.id === it.modId) || {}).num}`,
      learnHref: it => `#/${it.modId}/learn`,
      aside: () => `<span class="exam-clock" id="exam-clock"
                          aria-label="Time remaining">${clock(examRemaining(ex))}</span>`,
      onFinish: submit,
    }, body);

    // One interval for the whole sitting. It removes itself as soon as the clock
    // it writes to is gone from the document, which covers every way of leaving
    // this screen — submitting, navigating away, a hashchange re-render.
    const tick = setInterval(() => {
      const el = $("#exam-clock");
      if (!el || !el.isConnected) return clearInterval(tick);
      const left = examRemaining(ex);
      el.textContent = clock(left);
      el.classList.toggle("low", left < 5 * 60000);
      if (!left) { clearInterval(tick); submit(true); }
    }, 1000);

    function submit(ranOut) {
      const answered = Object.keys(ex.answers).length;
      if (!ranOut && answered < items.length &&
          !confirm(`${items.length - answered} question${items.length - answered > 1 ? "s are" : " is"} still unanswered. Submit anyway?`)) return;
      clearInterval(tick);
      ex.submitted = true;
      ex.finishedAt = Date.now();
      Store.save();
      results(ex, ranOut);
    }
  }

  async function results(ex, ranOut) {
    QuizKeys.clear();
    quizMode(false);
    const items = examPaper(pool, ex.seed);

    // Marking is the first moment this attempt needs the answer key. Re-entering
    // the screen later costs nothing: the keys are already in the store.
    body.innerHTML = `<div class="card"><p class="muted">Marking your paper…</p></div>`;
    try { await mark(ex, items); }
    catch (e) { return renderBlocked(body, e, () => results(ex, ranOut)); }

    /* Score out of what could be marked, not out of what was set: a question the
       server had no key for is not one the student got wrong, and dividing by it
       turns a server problem into a failed paper. */
    const unkeyedIds = new Set(ex.unkeyed || []);
    const marked = items.filter(it => !unkeyedIds.has(it.id));
    const total = marked.length;
    const correct = marked.filter(it => (ex.answers[it.id] || {}).correct).length;
    const missed = marked.filter(it => !(ex.answers[it.id] || {}).correct).map(it => it.id);
    // Same proportions the module quiz uses, so a mark means the same thing
    // wherever the student sees it.
    const pass = Math.ceil(0.72 * total);
    const verdict =
      correct >= Math.ceil(0.88 * total) ? "Exam-ready across the course." :
      correct >= pass ? "A pass — the weak modules below are where the marks are." :
      `Below ${pass} — work through the modules below before sitting the real thing.`;

    const byModule = MODULES.filter(m => m.ready).map(m => {
      const mine = marked.filter(it => it.modId === m.id);
      const got = mine.filter(it => (ex.answers[it.id] || {}).correct).length;
      return { m, got, n: mine.length };
    // n can be 0 when every question drawn from a module was unmarkable; sorting
    // on 0/0 puts NaN in the comparator.
    }).sort((a, b) => (a.n ? a.got / a.n : 1) - (b.n ? b.got / b.n : 1));

    /* Marked out of what could be marked. Silence here would hand the student a
       low score with no cause: the questions the server had no key for are not
       questions they got wrong. */
    const unkeyed = (ex.unkeyed || []).length;
    body.innerHTML = `
      ${ranOut ? `<div class="card notice">Time is up — the paper was submitted as it stood.</div>` : ""}
      ${unkeyed ? `<div class="card notice"><strong>${unkeyed} question${unkeyed > 1 ? "s" : ""} could not be marked.</strong>
        The answer key for ${unkeyed > 1 ? "them" : "it"} was not available, so ${unkeyed > 1 ? "they are" : "it is"}
        left out of the score below rather than counted against you. Nothing you did caused this —
        try again in a few minutes, and tell me if it keeps happening.</div>` : ""}
      <div class="card">
        <div class="score-hero">
          <div><span class="big">${correct}</span><span class="of"> / ${total}</span></div>
          <p>${verdict}</p>
        </div>
      </div>
      <div class="card">
        <h3>By module</h3>
        <p class="muted">Weakest first — ${EXAM_PER_MODULE} questions each${unkeyed ? ", less any that could not be marked" : ""}.</p>
        <div id="exam-modules" class="stack-top"></div>
      </div>
      ${weakSections(missed, 6)}
      <div class="quiz-nav">
        ${missed.length ? `<button class="btn" id="exam-fix">Go through the ${missed.length} you missed</button>` : ""}
        <button class="btn secondary" id="exam-again">New attempt</button>
        <a class="btn secondary" href="#/">Back to modules</a>
      </div>`;

    $("#exam-modules", body).innerHTML = byModule.map(({ m, got, n }) => {
      const pct = Math.round(100 * got / n);
      const color = pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)";
      return `<a class="topic-row exam-row" href="#/${m.id}/learn">
        <span class="t-name">Module ${m.num} · ${m.title}</span>
        <span class="t-track"><span class="t-fill" style="width:${pct}%;background:${color}"></span></span>
        <span class="t-pct">${got}/${n}</span>
      </a>`;
    }).join("");

    body.querySelectorAll("[data-review]").forEach(a =>
      a.addEventListener("click", () =>
        sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + a.dataset.review.replace(".", "-"))));

    $("#exam-again", body).addEventListener("click", () => {
      Store.data.exam = null; Store.save();
      intro({ answers: ex.answers, score: correct, total });
    });

    const fix = $("#exam-fix", body);
    // The pass over the missed questions *does* write through to module
    // progress: it is deliberate practice with the answer in front of you,
    // unlike the exam itself.
    if (fix) fix.addEventListener("click", () => runFix(missed));

    function runFix(ids) {
      const wanted = new Set(ids);
      const list = items.filter(it => wanted.has(it.id));
      fixPass({
        items: list,
        body,
        alive,
        onFinish: session => {
          fixResults({
            items: list, session, body,
            again: stillWrong => runFix(stillWrong),
            back: `<button class="btn secondary" id="fix-back">Back to the results</button>`,
          });
          // Wired here, not after fixPass(): fixPass opens on a question, and
          // this button only exists once the pass has rendered its results.
          $("#fix-back", body).addEventListener("click", () => results(ex, ranOut));
        },
      });
    }
  }
}

/* ---------- practice hub ---------- */

async function renderPractice(m, body, alive = () => true) {
  const q = await Api.getQuestions(m.id);
  if (!alive()) return;
  const p = Store.module(m.id);
  p.mcqTotal = q.mcq.length;
  Store.save();

  const answered = Object.keys(p.mcq).length;
  const correct = Object.values(p.mcq).filter(e => e.correct).length;
  const finished = answered === q.mcq.length;

  const doneCount = kind => q[kind].filter(it => (p.written[it.id] || {}).revealed).length;

  body.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h3>Part A — Multiple choice</h3>
        ${answered ? `<span class="pill ${finished ? "done" : ""}">${answered}/${q.mcq.length}</span>` : ""}
      </div>
      <p class="muted">${q.mcq.length} questions · instant feedback on every pick ·
        ${answered ? `${correct}/${answered} correct so far` : "not started"}</p>
      <div class="row-gap">
        <button class="btn" id="start-mcq">
          ${finished ? "See results" : answered ? "Continue" : "Start quiz"}</button>
        ${answered ? `<button class="btn secondary" id="reset-mcq">Start over</button>` : ""}
      </div>
      <div id="topic-summary" class="stack-top"></div>
    </div>
    <div class="card">
      <div class="card-head">
        <h3>Part B — Short answer</h3>
        <span class="pill ${doneCount("short") === q.short.length ? "done" : ""}">${doneCount("short")}/${q.short.length}</span>
      </div>
      <p class="muted">Write your answer, then mark yourself against the examiner's checklist</p>
      <div id="short-list" class="stack-top"></div>
    </div>
    <div class="card">
      <div class="card-head">
        <h3>Part C — Extended questions</h3>
        <span class="pill ${doneCount("extended") === q.extended.length ? "done" : ""}">${doneCount("extended")}/${q.extended.length}</span>
      </div>
      <p class="muted">Exam-style scenarios, marked part by part</p>
      <div id="ext-list" class="stack-top"></div>
    </div>`;

  renderTopicSummary(m, q, $("#topic-summary"), "Your topics so far");

  $("#start-mcq").addEventListener("click", () => runMcq(m, q, body, alive));
  const reset = $("#reset-mcq");
  if (reset) reset.addEventListener("click", () => {
    p.mcq = {}; p.mcqIndex = 0; p.mcqOrder = null; p.flagged = {}; Store.save();
    renderPractice(m, body, alive); renderNav(m.id);
  });

  renderWritten(m, q, "short");
  renderWritten(m, q, "extended");
}

function renderTopicSummary(m, q, el, label = "") {
  const p = Store.module(m.id);
  const byTopic = {};
  q.mcq.forEach(item => {
    const e = p.mcq[item.id];
    if (!e) return;
    byTopic[item.topic] = byTopic[item.topic] || { c: 0, n: 0 };
    byTopic[item.topic].n++;
    if (e.correct) byTopic[item.topic].c++;
  });
  const topics = Object.entries(byTopic);
  if (!topics.length) { el.innerHTML = ""; return; }
  el.innerHTML = (label ? `<p class="muted topic-label"><strong>${label}</strong></p>` : "") +
    topics.map(([name, t]) => {
      const pct = Math.round(100 * t.c / t.n);
      const color = pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--red)";
      return `<div class="topic-row">
        <span class="t-name">${name}</span>
        <span class="t-track"><span class="t-fill" style="width:${pct}%;background:${color}"></span></span>
        <span class="t-pct">${t.c}/${t.n}</span>
      </div>`;
    }).join("");
}

/* ---------- MCQ player ---------- */

/* One keydown handler at a time, cleared whenever the quiz screen changes. */
const QuizKeys = {
  fn: null,
  set(fn) { this.clear(); this.fn = fn; document.addEventListener("keydown", fn); },
  clear() { if (this.fn) document.removeEventListener("keydown", this.fn); this.fn = null; },
};

function quizMode(on) {
  const page = document.querySelector(".page");
  if (page) page.classList.toggle("quiz-mode", on);
  if (!on) QuizKeys.clear();
  syncStickyOffsets();
}

/* The quiz bar parks directly under the tab bar. Its offset used to be two
 * hard-coded numbers — one for desktop, one for phones — and every change to the
 * tab bar's padding left the two bands overlapping on one of them. Measure it
 * instead; `--quiz-top` also drives scroll-padding, so deep links from quiz
 * feedback land clear of both bands. */
function syncStickyOffsets() {
  const bar = document.querySelector(".tabbar");
  if (!bar) return;
  const top = parseFloat(getComputedStyle(bar).top) || 0;
  document.documentElement.style.setProperty("--quiz-top", `${Math.round(top + bar.offsetHeight)}px`);
}
addEventListener("resize", syncStickyOffsets);

/* The question loop. Three screens use it — the module quiz, the mock exam and
 * the mistakes-review pass — so everything mode-specific arrives through `ctx`
 * instead of being read off a module object:
 *
 *   items[]              questions in play; each carries `modId`
 *   feedback             "instant"  — verdict on every pick (module, review)
 *                        "deferred" — exam conditions: nothing until submit
 *   read(qid)            -> {picked, correct} | undefined
 *   write(qid, entry)    persist one answer
 *   isFlagged/toggleFlag(qid)
 *   learnHref(item)      where "re-read section N.M" points
 *   onFinish()           the caller renders its own results screen
 *   badge(item)          chip text, defaults to the question's topic
 *   aside()              extra HTML in the quiz bar (the exam timer)
 *
 * Answer keys are not passed in. Instant mode fetches the key for the question on
 * screen (and quietly warms the next few) through `Keys`; deferred mode fetches
 * none at all, because an exam shows no verdict until it is submitted — the whole
 * sitting happens without a single answer reaching the browser.
 */
function playMcq(ctx, body) {
  const { items } = ctx;
  const deferred = ctx.feedback === "deferred";
  /* Liveness comes from the caller, which captured it *before* its own awaits.
     Reading the epoch here instead was the first attempt and it is true by
     construction: a player that starts late starts on the current epoch, so the
     guard could never fire for the case it was written for — a screen that spent
     its load time being navigated away from. `route()` clearing the keyboard
     handler is not enough on its own either, because showQuestion reinstalls one
     after its await. Callers that cannot supply an `alive` get the old
     behaviour rather than none. */
  const alive = ctx.alive || currentRender();
  const total = items.length;
  const order = items.map(x => x.id);
  const answeredCount = () => order.filter(id => ctx.read(id)).length;

  const firstOpen = order.findIndex(id => !ctx.read(id));
  // Instant mode walks the unanswered questions and stops when there are none
  // left. Deferred mode is free navigation, so it just opens where the student
  // stopped — submitting is an explicit act there, never an automatic one.
  if (!deferred && firstOpen === -1) return ctx.onFinish();

  quizMode(true);
  showQuestion(order[firstOpen === -1 ? 0 : firstOpen]);

  async function showQuestion(qid) {
    const item = items.find(x => x.id === qid);
    const pos = order.indexOf(qid);

    // The one place a key is waited for. It is already in the store whenever the
    // student moved through the quiz in order — the previous screen warmed it —
    // so this branch is the first question and nothing else.
    if (!deferred && !Keys.has(qid)) {
      body.innerHTML = `<div class="card"><p class="muted">Loading question ${pos + 1}…</p></div>`;
      try { await Keys.ensure([qid]); }
      catch (e) {
        if (!alive()) return;
        return renderBlocked(body, e, () => showQuestion(qid));
      }
      // The student navigated away while the key was in the air. Everything below
      // writes to the DOM and installs a keydown handler; none of it belongs to
      // the page that is on screen now.
      if (!alive()) return;
    }

    const key = Keys.get(qid);
    /* A key that never arrived is not an answered question. `Keys.ensure`
       resolves whether or not the id came back, so without this the click
       handler throws out of a listener (the question simply freezes with no
       message) and the exam marks a right answer wrong. */
    if (!deferred && !key) {
      return renderBlocked(body,
        new Error("That question's answer key did not arrive. Check your connection and try again."),
        () => showQuestion(qid));
    }
    const letters = Object.keys(item.options);
    const prior = ctx.read(qid);

    body.innerHTML = `
      <div class="quiz-bar">
        <div class="quiz-top">
          <span class="chip">${ctx.badge ? ctx.badge(item) : item.topic}</span>
          <span class="q-count">Question ${pos + 1} of ${total}</span>
          ${ctx.aside ? ctx.aside() : ""}
          <button class="flag-btn ${ctx.isFlagged(qid) ? "on" : ""}" id="flag-q"
                  aria-pressed="${ctx.isFlagged(qid)}" aria-label="Flag this question for another pass"
                  title="Flag for another pass">${icon("flag")}</button>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${100 * answeredCount() / total}%"></div></div>
      </div>
      <div class="card">
        <p class="q-stem">${MD.inline(item.stem)}</p>
        <div class="options">
          ${Object.entries(item.options).map(([letter, text], i) =>
            // No aria-label here on purpose: it would override the rendered
            // content, and the rendered content is what carries the MathML
            // KaTeX emits. A label reads "x squared over two" only if we let
            // the maths speak for itself. The keyboard hint is decorative.
            `<button class="option" data-letter="${letter}">
              <span class="letter">${letter}</span><span>${MD.inline(text)}</span>
              <span class="key-hint" aria-hidden="true">${i + 1}</span>
            </button>`).join("")}
        </div>
        <div id="feedback" role="status" aria-live="polite" tabindex="-1"></div>
        <div class="quiz-nav" id="quiz-nav"></div>
      </div>`;

    body.querySelectorAll(".option").forEach(btn =>
      btn.addEventListener("click", () => pick(btn.dataset.letter)));

    const flagBtn = $("#flag-q", body);
    flagBtn.addEventListener("click", () => {
      const on = ctx.toggleFlag(qid);
      flagBtn.classList.toggle("on", on);
      flagBtn.setAttribute("aria-pressed", String(on));
    });

    // 1–4 or A–D answers, Enter moves on. Repeat practice is the whole point of
    // the quiz, and reaching for the mouse 18 times per module is the friction.
    QuizKeys.set(e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      const next = $("#next-q", body);
      if (e.key === "Enter" && next) { e.preventDefault(); next.click(); return; }
      // Instant mode locks the options once answered; in an exam the student is
      // allowed to come back and change their mind.
      if (ctx.read(qid) && !deferred) return;
      const byNumber = letters[Number(e.key) - 1];
      const byLetter = letters.find(l => l.toLowerCase() === e.key.toLowerCase());
      const letter = byNumber || byLetter;
      if (letter) { e.preventDefault(); pick(letter); }
    });

    if (prior) paint(prior.picked, false);
    navButtons();

    // Warm the next few so the click that moves on has its key already. Three is
    // enough to hide the round trip without pulling questions the student may
    // never reach — every id fetched is a id spent against the hourly budget.
    if (!deferred) Keys.prefetch(order.slice(pos + 1, pos + 4));

    /* `announce` is false when we are only restoring a screen the student has
       already seen — re-firing the aria-live region on every back-navigation
       would read the whole explanation out again. */
    function paint(letter, announce) {
      if (deferred) {
        /* Exam conditions: show what was picked, never whether it was right.
           `picked` used to be the *only* record of the choice — a tint measured
           at 1.04:1 against the panel and no state in the accessibility tree at
           all. A student reviewing a 48-question paper by screen reader, or
           anyone who cannot separate that tint from the background, had no way
           to tell which option they had chosen. `aria-pressed` puts it in the
           tree; `.option.picked::after` puts a mark on the screen that is not a
           colour. */
        body.querySelectorAll(".option").forEach(btn => {
          const on = btn.dataset.letter === letter;
          btn.classList.toggle("picked", on);
          btn.setAttribute("aria-pressed", String(on));
        });
        return;
      }
      body.querySelectorAll(".option").forEach(btn => {
        btn.disabled = true;
        const l = btn.dataset.letter;
        if (l === key.answer) btn.classList.add("correct");
        else if (l === letter) btn.classList.add("wrong");
        else btn.classList.add("dim");
      });

      const fb = $("#feedback", body);
      if (letter === key.answer) {
        fb.innerHTML = `<div class="feedback good">
          <p class="verdict">✓ Correct</p>
          <p>${MD.inline(key.explanation)}</p>
          ${licensedNote()}
        </div>`;
      } else {
        const diag = key.diagnostics[letter] || "";
        fb.innerHTML = `<div class="feedback bad">
          <p class="verdict">✗ Not quite — the answer is (${key.answer})</p>
          <p class="diag">What this mistake means: ${MD.inline(diag)}</p>
          <p>${MD.inline(key.explanation)}</p>
          <a class="review-link" href="${ctx.learnHref(item)}" data-review="${key.review}">
            → Re-read section ${key.review} in the notes</a>
          ${licensedNote()}
        </div>`;
        const link = fb.querySelector("[data-review]");
        link.addEventListener("click", () => {
          sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + key.review.replace(".", "-"));
        });
      }
      if (announce) fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function navButtons() {
      const nav = $("#quiz-nav", body);
      const answered = !!ctx.read(qid);

      if (!deferred) {
        // Nothing to press until the student has committed to an answer.
        if (!answered) { nav.innerHTML = ""; return; }
        const next = order.find(id => !ctx.read(id));
        nav.innerHTML = `<button class="btn" id="next-q">${
          next ? "Next question →" : "See results →"}</button>`;
        $("#next-q", nav).addEventListener("click", () => next ? showQuestion(next) : ctx.onFinish());
        return;
      }

      const last = pos === total - 1;
      nav.innerHTML = `
        ${pos > 0 ? `<button class="btn secondary" id="prev-q">← Previous</button>` : ""}
        <button class="btn" id="next-q">${last ? "Finish and submit →" : "Next question →"}</button>
        ${last ? "" : `<button class="btn secondary" id="submit-now">Submit</button>`}`;
      const prev = $("#prev-q", nav);
      if (prev) prev.addEventListener("click", () => showQuestion(order[pos - 1]));
      $("#next-q", nav).addEventListener("click", () =>
        last ? ctx.onFinish() : showQuestion(order[pos + 1]));
      const now = $("#submit-now", nav);
      if (now) now.addEventListener("click", () => ctx.onFinish());
    }

    function pick(letter) {
      const first = !ctx.read(qid);
      // Under exam conditions the browser does not know the answer yet, so it
      // records the pick alone; the whole paper is marked in one call on submit.
      ctx.write(qid, deferred ? { picked: letter } : { picked: letter, correct: letter === key.answer });
      paint(letter, true);
      navButtons();

      // In an exam a fresh answer moves on by itself — 48 questions is a lot of
      // clicking otherwise. Changing an existing answer stays put, because the
      // student navigated back here on purpose.
      if (deferred && first && pos < total - 1) return showQuestion(order[pos + 1]);

      /* Focus the verdict, not the button. A focus change interrupts VoiceOver
         and re-queues NVDA, so focusing "Next question →" here spoke the button's
         own name over the polite region and the student never heard whether they
         were right. The feedback box is focusable only as a target (tabindex -1),
         so Tab from it still lands on Next.
         preventScroll: a plain focus() yanked the page down ~280px on every
         answer, throwing the feedback the student is reading off screen. */
      const fb = $("#feedback", body);
      if (fb && fb.textContent.trim()) fb.focus({ preventScroll: true });
      else { const next = $("#next-q", body); if (next) next.focus({ preventScroll: true }); }
    }
  }
}

/* The module quiz. It speaks qualified ids like every other screen — the key
 * store is course-wide — while progress stays keyed by the local id, so nothing
 * already saved in localStorage changes shape. */
async function runMcq(m, q, body, alive) {
  const p = Store.module(m.id);
  const total = q.mcq.length;
  if (!p.flagged) p.flagged = {};
  const local = qid => qid.split(":")[1];
  const order = q.mcq.map(x => qualify(m.id, x.id));

  playMcq({
    items: q.mcq.map(x => ({ ...x, id: qualify(m.id, x.id), localId: x.id, modId: m.id })),
    feedback: "instant",
    alive,
    read: qid => p.mcq[local(qid)],
    write: (qid, entry) => { p.mcq[local(qid)] = entry; Store.save(); renderNav(m.id); },
    isFlagged: qid => !!p.flagged[local(qid)],
    toggleFlag: qid => {
      const id = local(qid);
      p.flagged[id] = !p.flagged[id];
      Store.save();
      return !!p.flagged[id];
    },
    learnHref: () => `#/${m.id}/learn`,
    onFinish: showResults,
  }, body);

  function showResults() {
    QuizKeys.clear();
    const entries = order.map(id => ({ id, ...p.mcq[local(id)] }));
    const correct = entries.filter(e => e.correct).length;
    const missed = entries.filter(e => !e.correct).map(e => e.id);
    const flagged = order.filter(id => p.flagged[local(id)]);
    // Proportional, so the thresholds still make sense if a module ever ships
    // a quiz that is not 18 questions long. At 18 these are 16 and 13.
    const pass = Math.ceil(0.72 * total);
    const verdict =
      correct >= Math.ceil(0.88 * total) ? "Solid — you're ready to move on." :
      correct >= pass ? "Good, but review your weak topics below." :
      `Below ${pass} — re-read the notes before moving to the next module.`;

    body.innerHTML = `
      ${noticeBar()}
      <div class="card">
        <div class="score-hero">
          <div><span class="big">${correct}</span><span class="of"> / ${total}</span></div>
          <p>${verdict}</p>
        </div>
      </div>
      <div class="card">
        <h3>By topic</h3>
        <div id="topic-summary"></div>
      </div>
      ${weakSections(missed)}
      <div class="quiz-nav">
        ${missed.length ? `<button class="btn" id="retry-missed">Retry the ${missed.length} you missed</button>` : ""}
        ${flagged.length ? `<button class="btn secondary" id="retry-flagged">Retry ${flagged.length} flagged</button>` : ""}
        <button class="btn secondary" id="retry-all">Start over</button>
        <button class="btn secondary" id="back-to-practice">Back to practice</button>
      </div>`;

    renderTopicSummary(m, q, $("#topic-summary", body));
    body.querySelectorAll("[data-review]").forEach(a =>
      a.addEventListener("click", () =>
        sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + a.dataset.review.replace(".", "-"))));

    const rm = $("#retry-missed", body);
    if (rm) rm.addEventListener("click", () => {
      missed.forEach(id => delete p.mcq[local(id)]);
      Store.save();
      runMcq(m, q, body, alive);
    });
    const rf = $("#retry-flagged", body);
    if (rf) rf.addEventListener("click", () => {
      flagged.forEach(id => delete p.mcq[local(id)]);
      Store.save();
      runMcq(m, q, body, alive);
    });
    $("#retry-all", body).addEventListener("click", () => {
      p.mcq = {}; Store.save(); renderNav(m.id);
      runMcq(m, q, body, alive);
    });
    $("#back-to-practice", body).addEventListener("click", () => {
      quizMode(false);
      go(`#/${m.id}/practice`);
    });
  }
}

/* The answer key already names the notes section behind every question
 * (`review`), so the sections a student actually lost marks on fall out of the
 * missed list — a concrete reading assignment instead of "review your weak topics".
 *
 * `missed` is a list of qualified ids, so the exam and the review pass can list
 * sections from twelve modules in one block. */
function weakSections(missed, limit = 4) {
  if (!missed.length) return "";
  const count = {};
  missed.forEach(id => {
    // Only questions the student has actually answered reach this screen, so
    // their keys are in the store; anything else is simply left out.
    const ref = (Keys.get(id) || {}).review;
    if (!ref) return;
    const k = `${modOfQid(id)}|${ref}`;
    count[k] = (count[k] || 0) + 1;
  });
  const top = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, limit);
  if (!top.length) return "";
  const many = new Set(top.map(([k]) => k.split("|")[0])).size > 1;
  return `
    <div class="card">
      <h3>Re-read these first</h3>
      <p class="muted">The sections behind the questions you missed.</p>
      <div class="weak-list">
        ${top.map(([k, n]) => {
          const [modId, ref] = k.split("|");
          const mod = MODULES.find(x => x.id === modId);
          return `
          <a class="weak-row" href="#/${modId}/learn" data-review="${ref}">
            <span class="weak-sec">${many && mod ? `Module ${mod.num} · ` : ""}Section ${ref}</span>
            <span class="weak-n">${n} question${n > 1 ? "s" : ""} missed</span>
            <span class="weak-go">→</span>
          </a>`;
        }).join("")}
      </div>
    </div>`;
}

/* ---------- written questions (Parts B & C) ---------- */

/* Twelve written items rendered open at once made the practice tab thousands of
 * pixels tall and impossible to scan. They now collapse to one row each; the
 * editor is built the first time a row is opened. */
function renderWritten(m, q, kind) {
  const holder = kind === "short" ? $("#short-list") : $("#ext-list");
  const items = kind === "short" ? q.short : q.extended;
  const p = Store.module(m.id);

  holder.innerHTML = items.map(item => {
    const st = p.written[item.id] || {};
    const started = st.text || (st.parts && Object.values(st.parts).some(Boolean));
    const state = st.revealed ? "checked" : started ? "draft" : "";
    return `<div class="written-card ${state}" id="wc-${item.id}">
      <button class="w-head" aria-expanded="false" aria-controls="wbody-${item.id}"
              aria-label="${item.id}: ${stripMd(item.title || item.intro || item.prompt).slice(0, 90)}">
        <span class="w-id">${item.id}</span>
        <span class="w-prompt">${item.title ? `<em>${item.title}.</em> ` : ""}${MD.inline(item.intro || item.prompt)}</span>
        <span class="w-state">${st.revealed ? "✓ checked" : started ? "draft" : ""}</span>
        <span class="w-caret">▾</span>
      </button>
      <div class="w-body" id="wbody-${item.id}" hidden></div>
    </div>`;
  }).join("");

  items.forEach(item => {
    const card = $(`#wc-${item.id}`, holder);
    const head = $(".w-head", card);
    const bodyEl = $(`#wbody-${item.id}`, card);
    let built = false;
    head.addEventListener("click", () => {
      const open = card.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
      bodyEl.hidden = !open;
      if (open && !built) { built = true; renderWrittenBody(m, item, kind); }
    });
  });
}

function renderWrittenBody(m, item, kind) {
  const p = Store.module(m.id);
  const st = p.written[item.id] || (p.written[item.id] = {});
  const el = $(`#wbody-${item.id}`);

  if (kind === "short") {
    el.innerHTML = `
      <textarea aria-label="Your answer to ${stripMd(item.id)}"
                placeholder="Write your answer in full sentences…">${st.text || ""}</textarea>
      <div class="row-gap">
        <button class="btn secondary" id="reveal-${item.id}">
          ${st.revealed ? "Marking checklist below" : "Mark my answer"}</button>
      </div>
      <div id="model-${item.id}"></div>`;
  } else {
    el.innerHTML = item.parts.map(part => `
      <div class="part-block">
        <div class="p-prompt">${part.id}) ${MD.inline(part.prompt)}</div>
        <textarea aria-label="Your answer to part ${part.id}"
                  placeholder="Your answer…" data-part="${part.id}">${(st.parts && st.parts[part.id]) || ""}</textarea>
      </div>`).join("") + `
      <div class="row-gap">
        <button class="btn secondary" id="reveal-${item.id}">
          ${st.revealed ? "Marking checklist below" : "Mark my answers"}</button>
      </div>
      <div id="model-${item.id}"></div>`;
  }

  const card = $(`#wc-${item.id}`);
  const markCardState = () => {
    const started = st.text || (st.parts && Object.values(st.parts).some(Boolean));
    card.classList.toggle("checked", !!st.revealed);
    card.classList.toggle("draft", !st.revealed && !!started);
    $(".w-state", card).textContent = st.revealed ? "✓ checked" : started ? "draft" : "";
  };

  el.querySelectorAll("textarea").forEach(ta =>
    ta.addEventListener("input", () => {
      if (kind === "short") st.text = ta.value;
      else { st.parts = st.parts || {}; st.parts[ta.dataset.part] = ta.value; }
      Store.save();
      markCardState();
    }));

  $(`#reveal-${item.id}`).addEventListener("click", async () => {
    /* `showModel` marks the item checked, and only once the mark scheme is
       actually on screen. This used to be set — and saved — here, before the
       fetch, so a request that failed left the item counted as "✓ checked" for
       good, with nothing that ever set it back: the Part B/C progress pills then
       claimed work the student had never seen. */
    if (!await showModel(m, item, kind, st)) return;
    markCardState();
    $(`#reveal-${item.id}`).textContent = "Marking checklist below";
  });

  if (st.revealed) showModel(m, item, kind, st);
}

/* One written item's mark scheme and model answer — never the module's. Marking
 * yourself against B3 must not also hand over B1, B2 and every extended question
 * the student has not looked at yet. */
/* Returns true once the mark scheme is on screen, false if it could not be
   fetched — the caller uses that to decide whether the item counts as checked. */
async function showModel(m, item, kind, st) {
  const box = $(`#model-${item.id}`);
  box.innerHTML = `<p class="muted">Loading the mark scheme…</p>`;
  let key;
  try {
    key = await Api.getWritten(m.id, item.id, kind);
  } catch (e) {
    renderBlocked(box, e, () => showModel(m, item, kind, st));
    return false;
  }
  st.checks = st.checks || {};

  /* Marking checklist first, model answer second. Reading a polished model
     before self-marking makes everyone believe they wrote it; ticking the
     criteria off your own words first is what actually finds the gaps. */
  if (kind === "short") {
    box.innerHTML = `
      <div class="model-box">
        <div class="m-label">Mark yourself — did you state:</div>
        <div class="marks-list">
          ${key.marks.map((mark, i) => `
            <label><input type="checkbox" data-i="${i}" ${st.checks[i] ? "checked" : ""}> <span class="mark-text">${MD.inline(mark)}</span></label>`).join("")}
        </div>
        <div class="self-score" id="ss-${item.id}"></div>
        <div class="row-gap">
          <button class="btn secondary" id="model-toggle-${item.id}">
            ${st.modelShown ? "Hide model answer" : "Show model answer"}</button>
        </div>
        <div class="model-text" id="model-text-${item.id}" ${st.modelShown ? "" : "hidden"}>
          <div class="m-label">Model answer</div>
          ${MD.render(key.model)}
        </div>
        <a class="review-link" href="#/${m.id}/learn" data-review="${key.review}">→ Related notes: section ${key.review}</a>
        ${licensedNote()}
      </div>`;
    wireChecks(box, st, key.marks.length, item.id, key.review);
  } else {
    const allMarks = [];
    box.innerHTML = `
      <div class="model-box">
        ${item.parts.map(part => {
          const pk = key.parts[part.id];
          const start = allMarks.length;
          pk.marks.forEach(mk => allMarks.push(mk));
          return `
            <div class="m-label${part.id === "a" ? "" : " stack-top"}">Part ${part.id}) — did you state:</div>
            <div class="marks-list">
              ${pk.marks.map((mark, j) => `
                <label><input type="checkbox" data-i="${start + j}" ${st.checks[start + j] ? "checked" : ""}> <span class="mark-text">${MD.inline(mark)}</span></label>`).join("")}
            </div>`;
        }).join("")}
        <div class="self-score" id="ss-${item.id}"></div>
        <div class="row-gap">
          <button class="btn secondary" id="model-toggle-${item.id}">
            ${st.modelShown ? "Hide model answers" : "Show model answers"}</button>
        </div>
        <div class="model-text" id="model-text-${item.id}" ${st.modelShown ? "" : "hidden"}>
          ${item.parts.map(part => `
            <div class="m-label${part.id === "a" ? "" : " stack-top"}">Part ${part.id}) — model answer</div>
            ${MD.render(key.parts[part.id].model)}`).join("")}
        </div>
        <a class="review-link" href="#/${m.id}/learn" data-review="${key.review}">→ Related notes: section ${key.review}</a>
        ${licensedNote()}
      </div>`;
    wireChecks(box, st, allMarks.length, item.id, key.review);
  }

  const toggle = $(`#model-toggle-${item.id}`, box);
  const text = $(`#model-text-${item.id}`, box);
  toggle.addEventListener("click", () => {
    st.modelShown = !st.modelShown;
    Store.save();
    text.hidden = !st.modelShown;
    const plural = kind === "short" ? "answer" : "answers";
    toggle.textContent = st.modelShown ? `Hide model ${plural}` : `Show model ${plural}`;
  });

  // The item is checked now, and only now — including when this call is the
  // retry from a failed one.
  st.revealed = true;
  Store.save();
  return true;
}

function wireChecks(box, st, totalMarks, itemId, review) {
  const scoreEl = $(`#ss-${itemId}`, box);
  const update = () => {
    const got = Object.values(st.checks).filter(Boolean).length;
    scoreEl.textContent = `Self-score: ${got} / ${totalMarks} marking points`;
  };
  box.querySelectorAll("input[type=checkbox]").forEach(cb =>
    cb.addEventListener("change", () => {
      st.checks[cb.dataset.i] = cb.checked;
      Store.save();
      update();
    }));
  update();
  const link = box.querySelector("[data-review]");
  if (link) link.addEventListener("click", () => {
    sessionStorage.setItem(`${Api.courseId}-scroll`, "sec-" + review.replace(".", "-"));
  });
}

route();
