/* Interactive trainers — the engine.
 *
 * The split that matters: THIS FILE IS PUBLIC and carries no course content. It
 * knows how to draw a projectile, a free-body diagram on an incline, a field
 * from point charges — the mechanics of a scene, nothing about what a student is
 * meant to notice. Every word a buyer pays for (the setup, the prompts, the
 * "what to watch", the challenges and their explanations, the section to
 * re-read) lives in chNN-sims.json, which ships inside the Worker for every paid
 * module and is served under the same token as the notes.
 *
 * So a leaked copy of this file gives you a physics toy with no teaching in it,
 * which is the same bargain the rest of the course makes: the machinery is
 * visible, the product is not.
 *
 * No dependencies, no build step, and no eval: a scene's `type` selects a
 * function from SCENES below. A config can parameterise a scene but can never
 * introduce code — a sims file is data, and data from the network stays data.
 */
const SIMS = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  /* Quotes included: these values land inside HTML attributes, and a config
     arrives over the network. Author-controlled today, but the file claims a
     config can never introduce code, and that claim has to be true rather than
     nearly true. */
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  /* The sentences a trainer teaches with — its intro, what to watch for, the
     challenges — go through the course's markdown renderer, so a maths course
     can write "$f(x)=\dfrac{x^2-4}{x-2}$" where it would otherwise have to
     write "(x squared minus 4) over (x minus 2)". Trainers were the one surface
     in the calculus course where the maths was spelled out in words.

     This does not weaken the claim at the top of the file. MD.inline escapes
     the HTML before it applies any markdown rule, and KaTeX runs with its
     default trust setting, which refuses \href, \url and raw-HTML macros — so
     a config still cannot introduce markup or code, only formatting. Labels
     that land inside HTML attributes (titles, control labels) keep esc(): an
     attribute has nowhere to put a rendered formula.

     Falls back to escaping when md.js is absent, so sims.js keeps working as a
     standalone file. */
  const prose = s => (typeof MD !== "undefined" && MD.inline ? MD.inline(String(s)) : esc(s));
  /* Numeric attributes go through Number(): a slider bound is a number or the
     control is broken, so there is nothing to escape and nothing to inject. */
  const numAttr = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  /* Anything that rounds to zero at the printed precision IS zero here: cos 90°
     comes back as 6.1e-17, and "Aₓ = 3.06e-16" teaches a student that a component
     which should vanish merely gets small. Exponential form is kept for values
     that are genuinely tiny but non-zero at this precision (fields, charges). */
  const fmt = (v, dp = 2) => {
    if (Math.abs(v) < 0.5 * Math.pow(10, -dp)) return (0).toFixed(dp);
    return (Math.abs(v) >= 1e4 || Math.abs(v) < 1e-2) ? v.toExponential(2) : v.toFixed(dp);
  };

  /* ---------- canvas helpers ---------------------------------------------
     Every scene draws in "world" units and lets the view do the mapping, so a
     scene never has to know the pixel size — which is what makes the same scene
     legible on a 375px phone and on a desktop. */
  function view(ctx, { xmin, xmax, ymin, ymax, pad = 28, box }) {
    /* `box` maps this view into a rectangle of the canvas instead of the whole
       of it, which is what lets one scene draw two pictures of the same system
       side by side (row picture and column picture). Omitted, the box is the
       canvas and every existing scene behaves exactly as before. */
    const bx = box ? box.x : 0, by = box ? box.y : 0;
    const w = box ? box.w : ctx.canvas.clientWidth;
    const h = box ? box.h : ctx.canvas.clientHeight;
    const sx = (w - 2 * pad) / (xmax - xmin), sy = (h - 2 * pad) / (ymax - ymin);
    const s = Math.min(sx, sy);
    // One scale for both axes keeps angles honest — a 45° vector must look like
    // 45°. The leftover space is then split evenly instead of piling up on one
    // side, which had the vector scene hugging the left edge of a phone.
    const ox = (w - (xmax - xmin) * s) / 2, oy = (h - (ymax - ymin) * s) / 2;
    return {
      w, h, s,
      X: x => bx + ox + (x - xmin) * s,
      Y: y => by + h - oy - (y - ymin) * s,
    };
  }

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
  }

  function line(ctx, x1, y1, x2, y2, colour, width = 2, dash) {
    ctx.save();
    ctx.strokeStyle = colour; ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }

  function arrow(ctx, x1, y1, x2, y2, colour, width = 2.5) {
    const a = Math.atan2(y2 - y1, x2 - x1), head = Math.min(11, Math.hypot(x2 - x1, y2 - y1) * 0.35);
    line(ctx, x1, y1, x2, y2, colour, width);
    ctx.save();
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - 0.4), y2 - head * Math.sin(a - 0.4));
    ctx.lineTo(x2 - head * Math.cos(a + 0.4), y2 - head * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function label(ctx, text, x, y, colour, align = "left", size = 12) {
    ctx.save();
    ctx.fillStyle = colour;
    ctx.font = `${size}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function axes(ctx, v, xlab, ylab) {
    const ink = css("--ink-faint"), lineC = css("--line");
    line(ctx, v.X(0), v.h - 28, v.w - 10, v.h - 28, lineC, 1);
    line(ctx, v.X(0), v.h - 28, v.X(0), 10, lineC, 1);
    if (xlab) label(ctx, xlab, v.w - 12, v.h - 14, ink, "right", 11);
    if (ylab) label(ctx, ylab, v.X(0) + 6, 14, ink, "left", 11);
  }

  /* Axes through the origin, for the graph scenes: a calculus picture is read
     against y = 0 and x = 0, not against the bottom-left corner of the box the
     physics scenes use. */
  function grid(ctx, v, xmin, xmax, ymin, ymax) {
    const lineC = css("--line"), ink = css("--ink-faint");
    for (let g = Math.ceil(xmin); g <= xmax; g++) {
      line(ctx, v.X(g), v.Y(ymin), v.X(g), v.Y(ymax), lineC, g === 0 ? 1.6 : 0.5);
    }
    for (let g = Math.ceil(ymin); g <= ymax; g++) {
      line(ctx, v.X(xmin), v.Y(g), v.X(xmax), v.Y(g), lineC, g === 0 ? 1.6 : 0.5);
    }
    label(ctx, "x", v.X(xmax) - 6, v.Y(0) - 10, ink, "right", 11);
    label(ctx, "y", v.X(0) + 8, v.Y(ymax) + 12, ink, "left", 11);
  }

  /* Plot y = f(x) across the window. `f` may return null to break the curve,
     which is what draws a hole rather than a line through one. */
  function plot(ctx, v, f, xmin, xmax, colour, width = 2.4) {
    ctx.save();
    ctx.strokeStyle = colour; ctx.lineWidth = width;
    ctx.beginPath();
    let drawing = false;
    const steps = 240;
    for (let i = 0; i <= steps; i++) {
      const x = xmin + (xmax - xmin) * i / steps;
      const y = f(x);
      if (y === null || !isFinite(y)) { drawing = false; continue; }
      if (drawing) ctx.lineTo(v.X(x), v.Y(y));
      else { ctx.moveTo(v.X(x), v.Y(y)); drawing = true; }
    }
    ctx.stroke();
    ctx.restore();
  }

  function dot(ctx, v, x, y, colour, filled = true, r = 4.5) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(v.X(x), v.Y(y), r, 0, Math.PI * 2);
    if (filled) { ctx.fillStyle = colour; ctx.fill(); }
    else {
      // An open circle is the standard notation for "the curve approaches this
      // point but does not include it" — the whole subject of the limit scene.
      ctx.fillStyle = css("--panel"); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = colour; ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- scenes -------------------------------------------------------
     Each takes the current parameter values and returns the readouts to print
     under the canvas. Pure functions of `p` plus a canvas: no scene keeps state,
     so re-rendering after a slider move is always correct. */
  const SCENES = {
    /* ---- precalculus ----------------------------------------------------
       These three draw a number line rather than a plane, because the answer a
       precalculus paper wants is a *set*, and a set of real numbers is a picture
       of exactly one dimension. Each returns the same answer in the three
       notations the exam asks for, so the student can see that they are one
       object with three spellings rather than three things to memorise. */

    /* An interval, in all three notations at once (§1.7, reused for sign charts
       in §3.6). The endpoints and their open/closed state are the sliders. */
    numberLine(ctx, p) {
      const lo = Math.min(p.lo, p.hi), hi = Math.max(p.lo, p.hi);
      const loIn = p.loClosed >= 0.5, hiIn = p.hiClosed >= 0.5;
      const outside = p.outside >= 0.5;
      const xmin = -10, xmax = 10;
      const v = view(ctx, { xmin, xmax, ymin: -1, ymax: 1, pad: 26 });
      const y0 = v.Y(0);
      line(ctx, v.X(xmin), y0, v.X(xmax), y0, css("--ink-faint"), 1.5);
      for (let t = xmin; t <= xmax; t += 1) {
        const big = t % 5 === 0;
        line(ctx, v.X(t), y0 - (big ? 6 : 3), v.X(t), y0 + (big ? 6 : 3), css("--ink-faint"), 1);
        if (big) label(ctx, String(t), v.X(t), y0 + 20, css("--ink-faint"), "center", 10);
      }
      const shade = (from, to) =>
        line(ctx, v.X(from), y0, v.X(to), y0, css("--accent"), 5);
      if (outside) { shade(xmin, lo); shade(hi, xmax); }
      else { shade(lo, hi); }
      // Open below the line, closed filled: the same convention the paper marks.
      dot(ctx, v, lo, 0, css("--accent"), outside ? !loIn : loIn, 5.5);
      dot(ctx, v, hi, 0, css("--accent"), outside ? !hiIn : hiIn, 5.5);

      const L = (n, closed) => (closed ? "[" : "(") + n;
      const R = (n, closed) => n + (closed ? "]" : ")");
      let interval, builder;
      if (outside) {
        // Outside an interval the endpoints swap their roles: the ray keeps the
        // endpoint exactly when the middle does not.
        interval = "(-∞, " + R(fmt(lo, 2), !loIn) + " ∪ " + L(fmt(hi, 2), !hiIn) + ", ∞)";
        builder = "{x | x " + (loIn ? "<" : "≤") + " " + fmt(lo, 2)
          + " or x " + (hiIn ? ">" : "≥") + " " + fmt(hi, 2) + "}";
      } else if (lo === hi && !(loIn && hiIn)) {
        interval = "∅";
        builder = "{ }";
      } else {
        interval = L(fmt(lo, 2), loIn) + ", " + R(fmt(hi, 2), hiIn);
        builder = "{x | " + fmt(lo, 2) + " " + (loIn ? "≤" : "<")
          + " x " + (hiIn ? "≤" : "<") + " " + fmt(hi, 2) + "}";
      }
      const width = outside ? Infinity : hi - lo;
      return [
        ["shape", outside ? "two rays (an 'or')" : "one interval (an 'and')"],
        ["interval notation", interval],
        ["set-builder notation", builder],
        ["left endpoint", (outside ? !loIn : loIn) ? "included" : "excluded"],
        ["right endpoint", (outside ? !hiIn : hiIn) ? "included" : "excluded"],
        ["length", width === Infinity ? "infinite" : fmt(width, 2)],
      ];
    },

    /* |x - a| against k, drawn as a wedge cut by a horizontal line (§1.6-1.7).
       The whole and/or split is visible: below the line is one piece, above it
       is two, and a negative k has the line under the vertex where the wedge
       never reaches. */
    absValueWedge(ctx, p) {
      const a = p.a, k = p.k, greater = p.greater >= 0.5;
      const xmin = -10, xmax = 10, ymin = -4, ymax = 10;
      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 24 });
      // grid() already labels both axes and draws the heavy zero lines; calling
      // axes() as well printed a second "x" and "y" and a second pair of axis
      // lines at fixed pixel offsets, cutting across the picture.
      grid(ctx, v, xmin, xmax, ymin, ymax);
      plot(ctx, v, x => Math.abs(x - a), xmin, xmax, css("--ink"));
      line(ctx, v.X(xmin), v.Y(k), v.X(xmax), v.Y(k), css("--green"), 1.6, [6, 4]);
      label(ctx, "y = " + fmt(k, 2), v.X(xmax) - 6, v.Y(k) - 10, css("--green"), "right", 11);

      const y0 = v.Y(0);
      const shade = (from, to) => line(ctx, v.X(from), y0, v.X(to), y0, css("--accent"), 5);
      let solution, split, count;
      if (k < 0) {
        // The two cases the lecture slides never state, and both are on papers.
        solution = greater ? "(-∞, ∞)" : "∅";
        split = greater ? "always true: a distance is never negative"
                        : "impossible: a distance is never negative";
        count = greater ? "every real number" : "no solution";
        if (greater) shade(xmin, xmax);
      } else if (greater) {
        solution = "(-∞, " + fmt(a - k, 2) + ") ∪ (" + fmt(a + k, 2) + ", ∞)";
        split = "x - " + fmt(a, 2) + " > " + fmt(k, 2) + "  or  x - " + fmt(a, 2) + " < -" + fmt(k, 2);
        count = "two rays (an 'or')";
        shade(xmin, a - k); shade(a + k, xmax);
      } else {
        solution = "(" + fmt(a - k, 2) + ", " + fmt(a + k, 2) + ")";
        split = "-" + fmt(k, 2) + " < x - " + fmt(a, 2) + " < " + fmt(k, 2);
        count = "one interval (an 'and')";
        shade(a - k, a + k);
      }
      dot(ctx, v, a, 0, css("--ink-faint"), true, 4);
      return [
        ["inequality", "|x - " + fmt(a, 2) + "| " + (greater ? ">" : "<") + " " + fmt(k, 2)],
        ["splits into", split],
        ["answer shape", count],
        ["solution", solution],
        ["distance from", fmt(a, 2)],
      ];
    },

    /* Why a checked root is a step and not a ritual (§1.1, §1.6). Both sides of
       sqrt(x + 6) = x + c are drawn; the roots of the SQUARED equation are marked,
       and a root is kept only where the two curves actually meet — which is
       precisely where the right-hand side is not negative. */
    extraneousRoot(ctx, p) {
      const c = p.c;
      const xmin = -7, xmax = 10, ymin = -5, ymax = 8;
      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 24 });
      // grid() already labels both axes and draws the heavy zero lines; calling
      // axes() as well printed a second "x" and "y" and a second pair of axis
      // lines at fixed pixel offsets, cutting across the picture.
      grid(ctx, v, xmin, xmax, ymin, ymax);
      plot(ctx, v, x => (x >= -6 ? Math.sqrt(x + 6) : null), -6, xmax, css("--ink"));
      plot(ctx, v, x => x + c, xmin, xmax, css("--green"));

      // Squaring gives x^2 + (2c - 1)x + (c^2 - 6) = 0.
      const A = 1, B = 2 * c - 1, C = c * c - 6;
      const disc = B * B - 4 * A * C;
      const kept = [], rejected = [];
      if (disc >= 0) {
        const r = disc === 0 ? [-B / 2] : [(-B - Math.sqrt(disc)) / 2, (-B + Math.sqrt(disc)) / 2];
        for (const x of r) {
          const rhs = x + c;
          // Genuine only where the radicand is defined AND the right side is not
          // negative — a principal square root never is.
          const good = x >= -6 - 1e-9 && rhs >= -1e-9;
          (good ? kept : rejected).push(x);
          dot(ctx, v, x, rhs, good ? css("--accent") : css("--ink-faint"), good, 5);
        }
      }
      const show = a => (a.length ? a.map(x => fmt(x, 2)).join(", ") : "none");
      return [
        ["equation", "√(x + 6) = x + " + fmt(c, 2)],
        ["after squaring", "x² + " + fmt(B, 2) + "x + " + fmt(C, 2) + " = 0"],
        ["discriminant", fmt(disc, 2)],
        ["candidates", disc < 0 ? "none (no real candidates)" : show(kept.concat(rejected).sort((m, n) => m - n))],
        ["survive the check", show(kept.sort((m, n) => m - n))],
        ["extraneous", show(rejected.sort((m, n) => m - n))],
      ];
    },

    /* Order of transformations (§2.6). The image of a parent function under
       y = a·f(b(x − h)) + k, drawn against the graph a student gets by shifting
       before the b is factored out of the argument. The two coincide exactly
       when b = 1 or h = 0 — and the paper's own question has neither, which is
       what this scene exists to make visible. */
    transformOrder(ctx, p) {
      const PARENTS = [
        { name: "√x", tex: s => "√(" + s + ")", f: x => (x >= 0 ? Math.sqrt(x) : null),
          halfDomain: true, floor: true, anchors: [[0, 0], [1, 1], [4, 2], [9, 3]] },
        { name: "|x|", tex: s => "|" + s + "|", f: x => Math.abs(x),
          halfDomain: false, floor: true, anchors: [[-2, 2], [-1, 1], [0, 0], [1, 1], [2, 2]] },
        { name: "x²", tex: s => "(" + s + ")²", f: x => x * x,
          halfDomain: false, floor: true, anchors: [[-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4]] },
        { name: "∛x", tex: s => "∛(" + s + ")", f: x => Math.cbrt(x),
          halfDomain: false, floor: false, anchors: [[-8, -2], [-1, -1], [0, 0], [1, 1], [8, 2]] },
      ];
      const par = PARENTS[clamp(Math.round(p.parent || 0), 0, 3)];
      /* A zero factor collapses the image to a line or a point, which teaches
         nothing; the brief is to clamp to the next step rather than draw it. */
      const a = p.a === 0 ? 0.5 : p.a;
      const b = p.b === 0 ? 0.5 : p.b;
      const h = p.h, k = p.k;
      const shiftFirst = p.order >= 0.5;

      const xmin = -10, xmax = 10, ymin = -8, ymax = 8;
      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 24 });
      grid(ctx, v, xmin, xmax, ymin, ymax);

      const parentAt = x => par.f(x);
      /* Factored, and therefore right: every point moves by x → x/b + h. */
      const rightAt = x => { const u = par.f(b * (x - h)); return u === null ? null : a * u + k; };
      /* Shift first, then squeeze: y = a·f(bx − h) + k. Not a slower route to
         the same curve — a different curve. */
      const wrongAt = x => { const u = par.f(b * x - h); return u === null ? null : a * u + k; };

      plot(ctx, v, parentAt, xmin, xmax, css("--ink-faint"), 1.6);
      if (shiftFirst) {
        ctx.save(); ctx.setLineDash([6, 4]);
        plot(ctx, v, wrongAt, xmin, xmax, css("--red"), 2.2);
        ctx.restore();
      }
      plot(ctx, v, rightAt, xmin, xmax, css("--accent"), 2.6);

      for (const [x0, y0] of par.anchors) {
        if (x0 < xmin || x0 > xmax || y0 < ymin || y0 > ymax) continue;
        const ix = x0 / b + h, iy = a * y0 + k;
        dot(ctx, v, x0, y0, css("--ink-faint"), false, 4);
        if (ix >= xmin && ix <= xmax && iy >= ymin && iy <= ymax) {
          line(ctx, v.X(x0), v.Y(y0), v.X(ix), v.Y(iy), css("--line"), 1, [3, 3]);
          dot(ctx, v, ix, iy, css("--accent"), true, 4.5);
        }
      }

      const nf = n => String(Math.round(n * 100) / 100);
      const signed = n => (n < 0 ? " - " + nf(-n) : " + " + nf(n));
      const coef = n => (n === 1 ? "" : n === -1 ? "-" : nf(n) + "·");
      const inner = (b === 1 ? "x" + (h === 0 ? "" : signed(-h))
        : nf(b) + "(x" + (h === 0 ? "" : signed(-h)) + ")");
      const C = -b * h;
      const expanded = nf(b) + "x" + (C === 0 ? "" : signed(C));
      const factored = "y = " + coef(a) + par.tex(inner) + (k === 0 ? "" : signed(k));
      const asPrinted = "y = " + coef(a) + par.tex(expanded) + (k === 0 ? "" : signed(k));
      label(ctx, factored, 12, 18, css("--ink"), "left", 13);
      label(ctx, "as a paper prints it:  " + asPrinted, 12, 38, css("--ink-faint"), "left", 12);

      const agree = b === 1 || h === 0;
      let domain;
      if (!par.halfDomain) domain = "all real x";
      else domain = b > 0 ? "x >= " + nf(h) : "x <= " + nf(h);
      const range = !par.floor ? "all real y"
        : a > 0 ? "[" + nf(k) + ", inf)" : "(-inf, " + nf(k) + "]";
      return [
        ["image of the anchor (0, 0)", "(" + nf(h) + ", " + nf(k) + ")"],
        ["domain", domain],
        ["range", range],
        ["shift read from the raw argument",
          b === 1 ? "nothing to misread — b = 1" : nf(b * h) + ", but the shift is " + nf(h)],
        ["the two graphs agree", agree ? "yes — order cannot matter here" : "no — shifting first lands elsewhere"],
      ];
    },

    /* The unit circle walked one twelfth of π at a time (§5.3 and §5.4). Every
       thing the final asks about an angle moves together: the terminal point in
       surd form, the quadrant, the reference angle measured to the *horizontal*
       axis, and all six functions with their signs. The two sections are one
       object seen twice, and this is the object. */
    unitCircleWalker(ctx, p) {
      const t = Math.round(p.t);
      const tt = ((t % 24) + 24) % 24;            // coterminal, in twelfths of π
      const ang = t * Math.PI / 12, red = tt * Math.PI / 12;
      const quadrantal = tt % 6 === 0;
      const quad = quadrantal ? 0 : Math.floor(tt / 6) + 1;
      const refTw = quadrantal ? 0
        : quad === 1 ? tt : quad === 2 ? 12 - tt : quad === 3 ? tt - 12 : 24 - tt;
      /* Multiples of π/6 and π/4 have surd values; π/12 and its odd relatives
         do not, and printing a made-up surd for them would be worse than a
         decimal. */
      const exact = tt % 2 === 0 || tt % 3 === 0;

      const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
      const piFrac = tw => {
        if (tw === 0) return "0";
        const s = tw < 0 ? "-" : "";
        const g = gcd(Math.abs(tw), 12), num = Math.abs(tw) / g, den = 12 / g;
        const top = num === 1 ? "pi" : num + "pi";
        return s + (den === 1 ? top : top + "/" + den);
      };

      const cosv = Math.cos(red), sinv = Math.sin(red);
      const xmin = -1.45, xmax = 1.45;
      const v = view(ctx, { xmin, xmax, ymin: -1.45, ymax: 1.45, pad: 22 });
      const ink = css("--ink-faint"), acc = css("--accent");
      line(ctx, v.X(xmin), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 1.4);
      line(ctx, v.X(0), v.Y(xmin), v.X(0), v.Y(xmax), css("--line"), 1.4);
      ctx.save();
      ctx.strokeStyle = ink; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(v.X(0), v.Y(0), Math.max(0, v.s), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      const qlab = [["I", 0.72, 0.72], ["II", -0.72, 0.72], ["III", -0.72, -0.72], ["IV", 0.72, -0.72]];
      for (const [nm, qx, qy] of qlab) label(ctx, nm, v.X(qx), v.Y(qy), css("--ink-faint"), "center", 12);

      /* The rotation is drawn as a spiral so that "one and a half turns" is a
         picture rather than a claim: the radius creeps outward with the angle,
         so a second lap does not overdraw the first. */
      ctx.save();
      ctx.strokeStyle = acc; ctx.lineWidth = 1.6;
      ctx.beginPath();
      const steps = Math.max(2, Math.abs(t) * 6);
      for (let i = 0; i <= steps; i++) {
        const th = ang * i / steps;
        const r = 0.26 + 0.055 * Math.abs(th) / (2 * Math.PI);
        const X = v.X(r * Math.cos(th)), Y = v.Y(r * Math.sin(th));
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.stroke();
      ctx.restore();

      if (t !== tt) {
        line(ctx, v.X(0), v.Y(0), v.X(1.12 * Math.cos(red)), v.Y(1.12 * Math.sin(red)), css("--line"), 1.2, [4, 4]);
      }
      line(ctx, v.X(0), v.Y(0), v.X(cosv), v.Y(sinv), acc, 2.4);

      if (p.showTriangle >= 0.5 && !quadrantal) {
        // Dropped to the x-axis, always: that is the whole argument for what a
        // reference angle is, and dropping it to the y-axis is the misconception.
        line(ctx, v.X(cosv), v.Y(sinv), v.X(cosv), v.Y(0), css("--green"), 1.8);
        line(ctx, v.X(0), v.Y(0), v.X(cosv), v.Y(0), css("--green"), 1.8);
        const mid = 0.22 * (cosv >= 0 ? 1 : -1);
        label(ctx, "θ'", v.X(mid), v.Y(0.055 * (sinv >= 0 ? 1 : -1)), css("--green"), "center", 12);
      }
      dot(ctx, v, cosv, sinv, acc, true, 5.5);

      const SURD = {
        2: ["√3/2", "1/2", "√3/3", "√3", "2√3/3", "2"],
        3: ["√2/2", "√2/2", "1", "1", "√2", "√2"],
        4: ["1/2", "√3/2", "√3", "√3/3", "2", "2√3/3"],
      };
      const AXIS = {
        0: ["1", "0", "0", "undefined", "1", "undefined"],
        6: ["0", "1", "undefined", "0", "undefined", "1"],
        12: ["-1", "0", "0", "undefined", "-1", "undefined"],
        18: ["0", "-1", "undefined", "0", "undefined", "-1"],
      };
      const sgn = (s, val) => (s === "undefined" || s === "0" || val >= 0 ? s : "-" + s);
      let cS, sS, tS, cotS, secS, cscS;
      if (quadrantal) [cS, sS, tS, cotS, secS, cscS] = AXIS[tt];
      else if (exact) {
        const row = SURD[refTw];
        const tanv = sinv / cosv;
        cS = sgn(row[0], cosv); sS = sgn(row[1], sinv); tS = sgn(row[2], tanv);
        cotS = sgn(row[3], tanv); secS = sgn(row[4], cosv); cscS = sgn(row[5], sinv);
      } else {
        cS = fmt(cosv, 3); sS = fmt(sinv, 3); tS = fmt(sinv / cosv, 3);
        cotS = fmt(cosv / sinv, 3); secS = fmt(1 / cosv, 3); cscS = fmt(1 / sinv, 3);
      }
      /* Kept inside the box: at 7π/12 the point sits just left of the y-axis and
         a right-aligned label ran off the edge of the canvas. */
      const lx = clamp(v.X(cosv) + (cosv >= 0 ? 8 : -8), 64, v.w - 64);
      label(ctx, "(" + cS + ", " + sS + ")", lx, clamp(v.Y(sinv) - 12, 12, v.h - 12),
        css("--ink"), cosv >= 0 ? "left" : "right", 11);

      const pos = [];
      if (sinv > 1e-9) pos.push("sine", "cosecant");
      if (cosv > 1e-9) pos.push("cosine", "secant");
      if (Math.abs(cosv) > 1e-9 && Math.abs(sinv) > 1e-9 && sinv / cosv > 0) pos.push("tangent", "cotangent");

      return [
        ["angle", piFrac(t) + "  (" + fmt(ang, 3) + " rad)"],
        ["in degrees", fmt(t * 15, 1) + "°"],
        ["coterminal in [0, 2pi)", piFrac(tt)],
        ["quadrant", quadrantal ? "quadrantal — on an axis" : ["I", "II", "III", "IV"][quad - 1]],
        ["reference angle", quadrantal ? "none — the angle is quadrantal" : piFrac(refTw)],
        ["terminal point (cos, sin)", "(" + cS + ", " + sS + ")"],
        ["sin, cos, tan", sS + ",  " + cS + ",  " + tS],
        ["csc, sec, cot", cscS + ",  " + secS + ",  " + cotS],
        ["positive here", pos.length ? pos.join(", ") : "none of the six"],
      ];
    },

    /* cos(bx) = c, and the two answers one question wants (§6.5). The general
       solution and the solutions on [0, 2π) are not two ways of saying the same
       thing: one is a family, the other is what survives inside a window, and a
       paper that asks for both marks them separately. Both are printed at all
       times, side by side, so the pair becomes a habit. */
    bothAnswersDial(ctx, p) {
      const b = Math.abs(p.b) < 0.25 ? 0.5 : p.b;
      /* Snap to the values a paper actually uses, so the readouts can be exact.
         Half a slider step is the tolerance the brief asks for. */
      const SNAP = [
        [-1, 12], [-Math.sqrt(3) / 2, 10], [-Math.sqrt(2) / 2, 9], [-0.5, 8],
        [0, 6], [0.5, 4], [Math.sqrt(2) / 2, 3], [Math.sqrt(3) / 2, 2], [1, 0],
      ];
      let c = clamp(p.c, -1, 1), alphaTw = null;
      for (const [val, tw] of SNAP) {
        if (Math.abs(c - val) <= 0.03) { c = val; alphaTw = tw; break; }
      }
      const alpha = Math.acos(c);                    // in [0, π]
      const n = Math.round(p.n || 0);

      const gcd = (m, q) => (q ? gcd(q, m % q) : Math.abs(m));
      const piFrac = (num, den) => {                 // (num/den)·π, already integers
        if (num === 0) return "0";
        const s = num < 0 ? "-" : "";
        const g = gcd(Math.abs(num), den) || 1;
        const N = Math.abs(num) / g, D = den / g;
        const top = N === 1 ? "pi" : N + "pi";
        return s + (D === 1 ? top : top + "/" + D);
      };
      /* b comes in halves, α in twelfths of π, so every solution is an exact
         rational multiple of π: x = (±A + 24n)/(6B) · π with b = B/2. */
      const B2 = Math.round(b * 2);
      const exact = alphaTw !== null && Math.abs(b * 2 - B2) < 1e-9;
      const xExact = (sign, m) => piFrac(sign * alphaTw + 24 * m, 6 * B2);
      const xVal = (sign, m) => (sign * alpha + 2 * Math.PI * m) / b;

      const inWindow = [];
      for (let m = -2; m <= 2 * Math.ceil(b) + 2; m++) {
        for (const sign of [1, -1]) {
          const x = xVal(sign, m);
          if (x < -1e-9 || x >= 2 * Math.PI - 1e-9) continue;
          if (inWindow.some(e => Math.abs(e.x - x) < 1e-9)) continue;   // the families merge at c = ±1
          inWindow.push({ x, sign, m });
        }
      }
      inWindow.sort((u, w) => u.x - w.x);

      const xmin = -2 * Math.PI, xmax = 4 * Math.PI;
      const v = view(ctx, { xmin, xmax, ymin: -1.6, ymax: 1.6, pad: 22, box: { x: 0, y: 0, w: ctx.canvas.clientWidth, h: ctx.canvas.clientHeight * 0.66 } });
      const acc = css("--accent"), ink = css("--ink-faint");
      // The window every "on the interval" answer is cut from.
      ctx.save();
      ctx.fillStyle = css("--line"); ctx.globalAlpha = 0.35;
      ctx.fillRect(v.X(0), v.Y(1.6), v.X(2 * Math.PI) - v.X(0), v.Y(-1.6) - v.Y(1.6));
      ctx.restore();
      line(ctx, v.X(xmin), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 1.2);
      plot(ctx, v, x => Math.cos(b * x), xmin, xmax, ink, 1.4);
      plot(ctx, v, x => Math.cos(b * x), 0, 2 * Math.PI, css("--ink"), 2.4);
      line(ctx, v.X(xmin), v.Y(c), v.X(xmax), v.Y(c), css("--green"), 1.8, [5, 4]);
      for (const e of inWindow) dot(ctx, v, e.x, c, acc, true, 4.5);
      // A root landing exactly on 2π is a real solution the half-open interval
      // throws away — one hollow dot instead of a paragraph about brackets.
      for (const sign of [1, -1]) {
        for (let m = -3; m <= 8; m++) {
          const x = xVal(sign, m);
          if (Math.abs(x - 2 * Math.PI) < 1e-9) dot(ctx, v, x, c, acc, false, 4.5);
        }
      }
      const hx = xVal(1, n);
      if (hx >= xmin && hx <= xmax) {
        dot(ctx, v, hx, c, css("--red"), true, 6.5);
        label(ctx, (exact ? xExact(1, n) : fmt(hx, 2)) + (hx >= 0 && hx < 2 * Math.PI ? "" : "  (outside)"),
          v.X(hx), v.Y(c) - 16, css("--red"), "center", 11);
      }

      /* The argument on its own axis: two turns of bx are two turns, drawn.
         view() holds one scale for both axes so that an angle looks like the
         angle it is — right for the unit circle, wrong here, where a strip
         2πb wide and 3 tall would be squeezed into a sixth of the width and the
         two turns this panel exists to show would be unreadable. So this one
         strip gets its own stretched mapping. */
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const box = { x: 14, y: H * 0.70, w: W - 28, h: H * 0.26 };
      const ax = 2 * Math.PI * b;
      const v2 = {
        w: box.w, h: box.h,
        X: u => box.x + (u / ax) * box.w,
        Y: y => box.y + box.h / 2 - (y / 1.9) * (box.h / 2),
      };
      line(ctx, v2.X(0), v2.Y(0), v2.X(ax), v2.Y(0), css("--line"), 1.2);
      plot(ctx, v2, u => Math.cos(u), 0, ax, css("--ink"), 1.8);
      line(ctx, v2.X(0), v2.Y(c), v2.X(ax), v2.Y(c), css("--green"), 1.4, [5, 4]);
      // Every turn of the argument is one lap of the circle, and each lap is
      // where a pair of solutions comes from — so the laps are marked.
      for (let turn = 1; turn * 2 * Math.PI < ax - 1e-9; turn++) {
        line(ctx, v2.X(turn * 2 * Math.PI), v2.Y(-1.9), v2.X(turn * 2 * Math.PI), v2.Y(1.9), css("--line"), 1, [3, 3]);
      }
      label(ctx, "the argument bx runs over 0 … " + fmt(2 * b, 2) + "pi  ("
        + (Math.round(b * 100) / 100) + " turn" + (b === 1 ? "" : "s") + ")",
        box.x, box.y - 6, ink, "left", 11);

      const fam = sign => (exact
        ? (alphaTw === 0 || alphaTw === 12 ? xExact(sign, 0) + " + " + piFrac(24, 6 * B2) + "·n"
          : (sign > 0 ? "" : "-") + piFrac(alphaTw, 6 * B2) + " + " + piFrac(24, 6 * B2) + "·n")
        : fmt(sign * alpha / b, 3) + " + " + fmt(2 * Math.PI / b, 3) + "·n");
      const merged = Math.abs(c) === 1;
      const predicted = merged ? Math.round(b) : Math.round(2 * b);
      const listed = inWindow.map(e => (exact ? xExact(e.sign, e.m) : fmt(e.x, 3))).join(",  ");

      return [
        ["the equation", "cos(" + (b === 1 ? "" : Math.round(b * 100) / 100) + "x) = " + (exact ? ["1", "", "√3/2", "√2/2", "1/2", "", "0", "", "-1/2", "-√2/2", "-√3/2", "", "-1"][alphaTw] : fmt(c, 3))],
        ["reference angle", exact ? piFrac(Math.min(alphaTw, 12 - alphaTw), 12) : fmt(Math.acos(Math.abs(c)), 3)],
        ["quadrants", c > 0 ? "I and IV (cosine positive)" : c < 0 ? "II and III (cosine negative)" : "II and IV boundary — cosine is zero"],
        ["general solution for the argument", exact
          ? "bx = ±" + piFrac(alphaTw, 12) + " + 2pi·n"
          : "bx = ±" + fmt(alpha, 3) + " + 2pi·n"],
        ["general solution for x", merged
          ? "x = " + fam(1) + "   (one family — at c = ±1 the two coincide)"
          : "x = " + fam(1) + "   and   x = " + fam(-1)],
        ["spacing between consecutive members", exact ? piFrac(24, 6 * B2) : fmt(2 * Math.PI / b, 3)],
        ["solutions on [0, 2pi)", listed || "none"],
        ["how many", inWindow.length + (merged
          ? " — the families merge at c = ±1, so the count is b, not 2b"
          : inWindow.length === predicted ? " — and 2b predicts " + predicted
            : " — but 2b predicts " + predicted)],
        ["highlighted member (n = " + n + ")", (exact ? xExact(1, n) : fmt(hx, 3))
          + (hx >= 0 && hx < 2 * Math.PI ? "" : "  — outside [0, 2pi)")],
      ];
    },

    /* The sign chart, built the way §3.6 asks for it to be written (ch03). The
       answer to a polynomial or rational inequality is a *set*, and the marks
       are in the table that produces it: boundary points, the sign of each
       factor on each interval, and then a separate decision about the boundary
       points themselves. So the table is the picture. */
    signChart(ctx, p) {
      const q = Math.round(p.q);
      const mult = p.mult >= 1.5 ? 2 : 1;
      const rational = p.rational >= 0.5;
      const r = Math.round(p.r);
      /* 0 = > 0, 1 = >= 0, 2 = < 0, 3 = <= 0 */
      const sym = clamp(Math.round(p.symbol), 0, 3);
      const wantPositive = sym < 2, allowEqual = sym === 1 || sym === 3;
      const symText = ["> 0", ">= 0", "< 0", "<= 0"][sym];
      let pRoot = Math.round(p.p);
      // Two boundary points that coincide are one boundary point with a bigger
      // exponent, which is a different question; nudge rather than pretend.
      if (pRoot === q) pRoot = q - 1;

      const factors = [
        { label: mult === 2 ? "(x " + (pRoot <= 0 ? "+ " + -pRoot : "- " + pRoot) + ")²" : "(x " + (pRoot <= 0 ? "+ " + -pRoot : "- " + pRoot) + ")", root: pRoot, mult, below: false },
        { label: "(x " + (q <= 0 ? "+ " + -q : "- " + q) + ")", root: q, mult: 1, below: false },
      ];
      if (rational) factors.push({ label: "(x " + (r <= 0 ? "+ " + -r : "- " + r) + ")", root: r, mult: 1, below: true });

      const zeros = [pRoot, q];
      const poles = rational ? [r] : [];
      const bounds = [...new Set([...zeros, ...poles])].sort((m, n) => m - n);
      const signAt = x => {
        let s = 1;
        for (const f of factors) {
          const d = x - f.root;
          if (Math.abs(d) < 1e-9) return 0;
          if (f.mult % 2 === 1 && d < 0) s = -s;         // even powers never flip
        }
        return s;
      };
      const cuts = [-Infinity, ...bounds, Infinity];
      const intervals = [];
      for (let i = 0; i < cuts.length - 1; i++) {
        const lo = cuts[i], hi = cuts[i + 1];
        const test = lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2;
        intervals.push({ lo, hi, sign: signAt(test), test });
      }

      /* ---- the picture: one row per factor, then the product row, then the
         number line the answer is read off. */
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const left = 92, right = W - 18;
      const xmin = -8, xmax = 8;
      const X = x => left + ((clamp(x, xmin, xmax) - xmin) / (xmax - xmin)) * (right - left);
      const ink = css("--ink-faint"), acc = css("--accent");
      /* The table and the number line are one object — the rows produce the
         line — so they are laid out together and centred, rather than pinned to
         opposite edges of the canvas with a hole between them. */
      const rowH = clamp((H - 96) / (factors.length + 1), 24, 46);
      const blockH = rowH * (factors.length + 1) + 62;
      const topY = Math.max(26, (H - blockH) / 2 + 12);

      label(ctx, "sign of each factor on each interval", left, 14, ink, "left", 11);
      for (const b of bounds) {
        line(ctx, X(b), topY - 8, X(b), topY + rowH * (factors.length + 1) + 4, css("--line"), 1, [3, 3]);
      }
      factors.forEach((f, i) => {
        const y = topY + rowH * i + rowH / 2;
        label(ctx, f.label + (f.below ? "  ÷" : ""), left - 10, y, css("--ink"), "right", 11);
        for (const iv of intervals) {
          const mid = iv.lo === -Infinity ? Math.max(xmin + 0.6, iv.hi - 1.4)
            : iv.hi === Infinity ? Math.min(xmax - 0.6, iv.lo + 1.4) : (iv.lo + iv.hi) / 2;
          const d = mid - f.root;
          const s = f.mult % 2 === 0 ? "+" : d > 0 ? "+" : "-";
          label(ctx, s, X(mid), y, f.mult % 2 === 0 ? css("--green") : ink, "center", 13);
        }
      });
      const py = topY + rowH * factors.length + rowH / 2;
      label(ctx, rational ? "quotient" : "product", left - 10, py, css("--ink"), "right", 11);
      for (const iv of intervals) {
        const mid = iv.lo === -Infinity ? Math.max(xmin + 0.6, iv.hi - 1.4)
          : iv.hi === Infinity ? Math.min(xmax - 0.6, iv.lo + 1.4) : (iv.lo + iv.hi) / 2;
        const keep = (iv.sign > 0) === wantPositive;
        label(ctx, iv.sign > 0 ? "+" : "-", X(mid), py, keep ? acc : ink, "center", 15);
      }

      const ly = Math.min(H - 26, topY + rowH * (factors.length + 1) + 46);
      line(ctx, X(xmin), ly, X(xmax), ly, css("--ink-faint"), 1.4);
      for (let t = xmin; t <= xmax; t++) {
        const big = t % 2 === 0;
        line(ctx, X(t), ly - (big ? 5 : 3), X(t), ly + (big ? 5 : 3), css("--line"), 1);
        if (big) label(ctx, String(t), X(t), ly + 16, css("--line"), "center", 10);
      }
      for (const iv of intervals) {
        if ((iv.sign > 0) !== wantPositive) continue;
        line(ctx, X(iv.lo === -Infinity ? xmin : iv.lo), ly, X(iv.hi === Infinity ? xmax : iv.hi), ly, acc, 5);
      }
      for (const b of bounds) {
        const isPole = poles.includes(b);
        const included = !isPole && allowEqual;
        dot(ctx, { X, Y: () => ly, s: 1 }, b, 0, isPole ? css("--red") : acc, included, 5.5);
      }

      /* ---- the answer. The line reads as a strip of atoms — interval, point,
         interval, … — each either in the solution or not; a maximal run of
         atoms that are in *is* one piece of the answer. Written any other way
         this needs a special case for a point that joins two intervals and
         another for a point that stands alone, and both were wrong first time. */
      const atoms = [];
      intervals.forEach((iv, i) => {
        atoms.push({ kind: "iv", lo: iv.lo, hi: iv.hi, in: (iv.sign > 0) === wantPositive });
        const b = bounds[i];
        if (b !== undefined) atoms.push({ kind: "pt", at: b, in: !poles.includes(b) && allowEqual });
      });
      const pieces = [];
      for (let i = 0; i < atoms.length;) {
        if (!atoms[i].in) { i++; continue; }
        let j = i;
        while (j + 1 < atoms.length && atoms[j + 1].in) j++;
        pieces.push(atoms.slice(i, j + 1));
        i = j + 1;
      }
      const text = pieces.map(run => {
        const first = run[0], last = run[run.length - 1];
        if (run.length === 1 && first.kind === "pt") return "{" + first.at + "}";
        const L = first.kind === "pt" ? "[" + first.at
          : first.lo === -Infinity ? "(-∞" : "(" + first.lo;
        const R = last.kind === "pt" ? last.at + "]"
          : last.hi === Infinity ? "∞)" : last.hi + ")";
        return L + ", " + R;
      }).join(" ∪ ");

      const numer = factors.filter(f => !f.below).map(f => f.label).join("");
      const expr = rational ? numer + " / " + factors[2].label : numer;
      const f0 = (() => {
        let val = 1;
        for (const f of factors) {
          const d = 0 - f.root;
          val = f.below ? val / d : val * Math.pow(d, f.mult);
        }
        return val;
      })();
      const holes = zeros.filter(z => poles.includes(z));
      const zeroText = zeros.filter(z => !holes.includes(z)).map(z => z + " (zero)").join(", ");
      const poleText = poles.filter(z => !holes.includes(z)).map(z => z + " (undefined)").join(", ");
      const holeText = holes.map(z => z + " (a cancelled factor — a hole, and still excluded)").join(", ");
      return [
        ["the inequality", expr + " " + symText],
        ["boundary points", [zeroText, poleText, holeText].filter(Boolean).join(", ")],
        ["sign pattern, left to right", intervals.map(iv => (iv.sign > 0 ? "+" : "-")).join("  ")],
        ["boundary points included", allowEqual
          ? (poles.length ? "the zeros, yes — but never " + poles.join(", ") + ", where it is undefined" : "yes — the symbol allows equality")
          : "none — a strict symbol excludes every boundary point"],
        ["solution", text || "∅"],
        ["test at x = 0", "value " + fmt(f0, 2) + ", which is " + ((f0 > 0) === wantPositive && Math.abs(f0) > 1e-9 ? "in" : "out")],
      ];
    },

    /* y = A·sin(Bx − C) + D, the slide the 5.5 deck never gave (ch05). The point
       of the scene is that the phase shift is C/B and not C: the arrow along the
       midline contracts when B alone is moved, while C has not been touched. The
       three key points at height D sit on the midline, which is what stops them
       being called x-intercepts. */
    sineWaveShaper(ctx, p) {
      const A = p.A === 0 ? 0.5 : p.A;
      const B = Math.abs(p.B) < 0.25 ? 0.5 : Math.abs(p.B);
      const c12 = Math.round(p.C);                    // C in twelfths of π
      const C = c12 * Math.PI / 12;
      const D = p.D;
      const B2 = Math.round(B * 2);                   // B comes in halves

      const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
      const piFrac = (num, den) => {
        if (num === 0) return "0";
        const s = num < 0 ? "-" : "";
        const g = gcd(Math.abs(num), den) || 1;
        const N = Math.abs(num) / g, Dn = den / g;
        const top = N === 1 ? "pi" : N + "pi";
        return s + (Dn === 1 ? top : top + "/" + Dn);
      };
      const shift = C / B, period = 2 * Math.PI / B, quarter = period / 4;
      const shiftTxt = piFrac(c12, 6 * B2);           // (c12/12)/(B2/2) = c12/(6·B2)
      const periodTxt = piFrac(4, B2);                // 2π/B = (4/B2)·π
      const quarterTxt = piFrac(1, B2);
      const keyX = j => piFrac(c12 + 6 * j, 6 * B2);  // shift + j·quarter

      const ymin = Math.min(-1.6, D - Math.abs(A) - 1.1), ymax = Math.max(1.6, D + Math.abs(A) + 1.1);
      const xmin = -2 * Math.PI, xmax = 2 * Math.PI;
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      /* Its own mapping rather than view(): a wave is read against its axes, not
         against a circle, and equal scaling would leave an amplitude of 5 taller
         than the canvas or a period of 4π off the side of it. */
      const pad = 30;
      const v = {
        w: W, h: H,
        X: x => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad),
        Y: y => H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad),
      };
      const ink = css("--ink-faint"), acc = css("--accent");

      // The range, as a band: every value the function takes, and none outside.
      ctx.save();
      ctx.fillStyle = css("--line"); ctx.globalAlpha = 0.3;
      ctx.fillRect(v.X(xmin), v.Y(D + Math.abs(A)), v.X(xmax) - v.X(xmin), v.Y(D - Math.abs(A)) - v.Y(D + Math.abs(A)));
      ctx.restore();

      line(ctx, v.X(xmin), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 1.2);
      line(ctx, v.X(0), v.Y(ymin), v.X(0), v.Y(ymax), css("--line"), 1.2);
      // Ticks in quarters of π, labelled in π: a wave axis in decimals is a wave
      // axis nobody can read an exact answer off.
      for (let t = -8; t <= 8; t++) {
        const x = t * Math.PI / 4;
        const big = t % 2 === 0;
        line(ctx, v.X(x), v.Y(0) - (big ? 5 : 3), v.X(x), v.Y(0) + (big ? 5 : 3), css("--line"), 1);
        if (t % 2 === 0 && t !== 0) label(ctx, piFrac(t, 4), v.X(x), v.Y(0) + 16, css("--line"), "center", 10);
      }

      plot(ctx, v, x => Math.sin(x), xmin, xmax, css("--green"), 1.2);      // the parent, fixed
      line(ctx, v.X(xmin), v.Y(D), v.X(xmax), v.Y(D), css("--ink-faint"), 1.4, [5, 4]);
      label(ctx, "y = " + (Math.round(D * 100) / 100), v.X(xmax) - 4, v.Y(D) - 10, ink, "right", 10);

      const f = x => A * Math.sin(B * x - C) + D;
      plot(ctx, v, f, xmin, xmax, ink, 1.4);
      plot(ctx, v, f, Math.max(xmin, shift), Math.min(xmax, shift + period), acc, 2.6);

      // The five key points of the period that starts at the phase shift.
      const heights = [D, D + A, D, D - A, D];
      for (let j = 0; j < 5; j++) {
        const x = shift + j * quarter;
        if (x < xmin || x > xmax) continue;
        dot(ctx, v, x, heights[j], acc, true, 4.5);
      }

      // The shift itself, drawn along the midline where it happens.
      if (Math.abs(shift) > 1e-9) {
        arrow(ctx, v.X(0), v.Y(D), v.X(clamp(shift, xmin, xmax)), v.Y(D), css("--red"), 2);
        label(ctx, shiftTxt + (shift > 0 ? " right" : " left"),
          v.X(clamp(shift / 2, xmin + 1, xmax - 1)), v.Y(D) - 12, css("--red"), "center", 11);
      }
      /* Bx − C with a negative C is a plus sign on the screen, and that is
         exactly the case a student misreads, so it must be printed the way the
         paper prints it rather than as "- -pi/3". */
      const inside = (Math.round(B * 100) / 100) + "x " + (c12 >= 0 ? "- " : "+ ") + piFrac(Math.abs(c12), 12);
      label(ctx, "y = " + (Math.round(A * 100) / 100) + "·sin(" + inside + ")"
        + (D === 0 ? "" : (D > 0 ? " + " : " - ") + Math.abs(Math.round(D * 100) / 100)),
        12, 16, css("--ink"), "left", 12);

      return [
        ["amplitude", fmt(Math.abs(A), 2) + (A < 0 ? "  (reflected)" : "")],
        ["period = 2pi/B", periodTxt],
        ["phase shift = C/B", shiftTxt + (shift > 0 ? "  (right)" : shift < 0 ? "  (left)" : "")],
        ["C, then B, then the quotient", "C = " + piFrac(c12, 12) + " ,  B = " + (Math.round(B * 100) / 100)
          + " ,  C/B = " + shiftTxt],
        ["one period runs from … to …", keyX(0) + "  to  " + keyX(4)],
        ["quarter of the period", quarterTxt],
        ["five key points", [0, 1, 2, 3, 4].map(j => "(" + keyX(j) + ", " + fmt(heights[j], 2) + ")").join("  ")],
        ["midline and range", "y = " + fmt(D, 2) + " ,  ["
          + fmt(D - Math.abs(A), 2) + ", " + fmt(D + Math.abs(A), 2) + "]"],
      ];
    },

    /* A hole against a vertical asymptote (§3.5, ch03). One numerator root slides
       through a denominator root; the domain never changes, and at the instant
       the two coincide the asymptote is replaced by a single missing point. The
       slides state the asymptote rule only for a fraction with no common factor
       and never say what happens when there is one, so this is that slide. */
    holeOrAsymptote(ctx, p) {
      const r = p.r;
      const POLES = [2, -4], ZERO2 = -3;
      const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
      const frac = (num, den) => {
        const g = gcd(Math.abs(num), Math.abs(den)) || 1;
        let N = num / g, D = den / g;
        if (D < 0) { N = -N; D = -D; }
        return D === 1 ? String(N) : N + "/" + D;
      };
      // A common factor exists only when r lands exactly on a pole; the slider
      // steps in quarters, so this is an exact comparison, not a near one.
      const cancels = POLES.find(v => Math.abs(r - v) < 1e-9);
      const cancelled = cancels !== undefined;
      const keptPole = cancelled ? POLES.find(v => v !== cancels) : null;

      const f = x => ((x - r) * (x + 3)) / ((x - 2) * (x + 4));
      // The reduced form is what the curve actually looks like once the common
      // factor is gone — including at the hole, where the original is 0/0.
      const reduced = x => (cancelled ? (x + 3) / (x - keptPole) : f(x));
      const holeY = cancelled ? (cancels + 3) / (cancels - keptPole) : null;
      const holeTxt = cancelled ? frac(cancels + 3, cancels - keptPole) : null;

      const xmin = -7, xmax = 7, ymin = -6, ymax = 6;
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 24 });
      grid(ctx, v, xmin, xmax, ymin, ymax);
      const acc = css("--accent"), ink = css("--ink-faint");

      // y = 1 always: same degree top and bottom, leading coefficients 1 and 1.
      line(ctx, v.X(xmin), v.Y(1), v.X(xmax), v.Y(1), css("--green"), 1.4, [5, 4]);
      label(ctx, "y = 1", v.X(xmax) - 6, v.Y(1) - 10, css("--green"), "right", 10);
      for (const pole of POLES) {
        // A cancelled factor leaves no asymptote at all. Drawing a faint one
        // "where it used to be" invites exactly the reading the scene exists to
        // correct — the line is gone, and only the excluded point remains.
        if (cancelled && pole !== keptPole) continue;
        line(ctx, v.X(pole), v.Y(ymin), v.X(pole), v.Y(ymax), css("--red"), 1.6, [5, 4]);
        label(ctx, "x = " + pole, v.X(pole) + 5, v.Y(ymax) + 12, css("--red"), "left", 10);
      }
      /* Plotted piecewise between the poles so that no segment is drawn across
         one: a single sweep joins +∞ to −∞ with a vertical line and teaches the
         asymptote as part of the graph. */
      const breaks = [xmin, ...POLES.slice().sort((a, b) => a - b), xmax];
      for (let i = 0; i < breaks.length - 1; i++) {
        const lo = breaks[i] + (i ? 0.001 : 0), hi = breaks[i + 1] - (i + 1 < breaks.length - 1 ? 0.001 : 0);
        plot(ctx, v, x => {
          const y = reduced(x);
          return (y === null || !isFinite(y) || y < ymin - 2 || y > ymax + 2) ? null : y;
        }, lo, hi, acc, 2.4);
      }
      // The excluded values are marked on the axis in one colour throughout,
      // because the domain is the one thing the slider never changes.
      for (const pole of POLES) dot(ctx, v, pole, 0, css("--red"), false, 4);
      if (cancelled) dot(ctx, v, cancels, holeY, acc, false, 5.5);

      const zeros = [r, -3].filter(z => !cancelled || Math.abs(z - cancels) > 1e-9);
      const nf = n => String(Math.round(n * 100) / 100);
      const factor = (root) => "(x " + (root < 0 ? "+ " + nf(-root) : "- " + nf(root)) + ")";
      const shown = cancelled
        ? factor(r) + "(x + 3) / " + factor(2) + factor(-4) + "   →   (x + 3) / " + factor(keptPole)
        : factor(r) + "(x + 3) / " + factor(2) + factor(-4);
      label(ctx, shown, 12, 16, css("--ink"), "left", 11);

      return [
        ["the function", shown],
        ["domain", "(-∞, -4) ∪ (-4, 2) ∪ (2, ∞)"],
        ["vertical asymptotes", cancelled ? "x = " + keptPole : "x = 2 and x = -4"],
        ["hole", cancelled ? "(" + cancels + ", " + holeTxt + ")" : "none"],
        ["x-intercepts", zeros.length ? zeros.map(z => nf(z)).join(", ") : "none"],
        ["horizontal asymptote", "y = 1"],
        ["what changed", cancelled
          ? "the factor cancels: x = " + cancels + " is still excluded, but the graph now has a point missing rather than a wall"
          : "nothing cancels — both excluded values are asymptotes"],
      ];
    },

    /* Why a logarithmic equation throws a root away (§4.5, ch04). Condensing two
       logarithms into one *enlarges the domain*, and the rejected candidate
       lives in the enlargement — so it is not an arithmetic accident and no sign
       was lost. The pale band under the plot is the enlargement, drawn. */
    rejectedRootLab(ctx, p) {
      const b = clamp(Math.round(p.b), 2, 6);
      const P = Math.round(p.p), Q = Math.round(p.q), k = Math.round(p.k);
      const diff = p.mode >= 0.5;
      const RHS = Math.pow(b, k);

      /* Both arguments must be positive however the equation is written, so the
         original domain is one intersection; the condensed form asks only that
         the product (or quotient) be positive, which is a strictly larger set. */
      const floor = Math.max(-P, Q);
      const lower = Math.min(-P, Q);
      const argA = x => x + P, argB = x => x - Q;

      let candidates = [];
      if (!diff) {
        // (x + P)(x - Q) = b^k  →  x² + (P - Q)x - PQ - b^k = 0
        const A = 1, B = P - Q, C = -P * Q - RHS;
        const disc = B * B - 4 * A * C;
        if (disc >= 0) {
          const s = Math.sqrt(disc);
          candidates = disc === 0 ? [-B / 2] : [(-B - s) / 2, (-B + s) / 2];
        }
      } else if (Math.abs(RHS - 1) > 1e-12) {
        candidates = [(RHS * Q + P) / (RHS - 1)];
      }
      const termA = "x " + (P < 0 ? "- " + -P : "+ " + P);
      const termB = "x " + (Q < 0 ? "+ " + -Q : "- " + Q);
      const verdict = x => {
        const a = argA(x), c = argB(x);
        if (a > 1e-9 && c > 1e-9) return { ok: true };
        const bad = a <= 1e-9 ? { which: termA, val: a } : { which: termB, val: c };
        return { ok: false, bad };
      };
      const kept = candidates.filter(x => verdict(x).ok);

      const xmin = Math.min(lower - 5, -8), xmax = Math.max(floor + 7, ...candidates.map(c => c + 2), 8);
      const ymin = -3, ymax = Math.max(k + 3, 6);
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const pad = 26, stripH = 52;
      const plotH = H - stripH - 8;
      const v = {
        w: W, h: plotH,
        X: x => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad),
        Y: y => plotH - pad - ((y - ymin) / (ymax - ymin)) * (plotH - 2 * pad),
      };
      const acc = css("--accent"), ink = css("--ink-faint");
      line(ctx, v.X(xmin), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 1.2);
      line(ctx, v.X(xmin), v.Y(k), v.X(xmax), v.Y(k), css("--green"), 1.6, [5, 4]);
      label(ctx, "y = " + k, v.X(xmax) - 4, v.Y(k) - 10, css("--green"), "right", 10);

      const logb = u => Math.log(u) / Math.log(b);
      const twoLogs = x => (argA(x) > 0 && argB(x) > 0
        ? (diff ? logb(argA(x)) - logb(argB(x)) : logb(argA(x)) + logb(argB(x))) : null);
      const oneLog = x => {
        const u = diff ? argA(x) / argB(x) : argA(x) * argB(x);
        return u > 0 ? logb(u) : null;
      };
      // Dashed: the condensed form, which exists on the larger set. Solid: the
      // equation as it was handed to you. They agree everywhere both exist.
      ctx.save(); ctx.setLineDash([5, 4]);
      plot(ctx, v, x => { const y = oneLog(x); return y === null || y < ymin || y > ymax ? null : y; }, xmin, xmax, css("--red"), 1.8);
      ctx.restore();
      plot(ctx, v, x => { const y = twoLogs(x); return y === null || y < ymin || y > ymax ? null : y; }, xmin, xmax, acc, 2.6);

      /* The strip: pale is where the condensed form lives, strong is where the
         original does, and the pale-only stretch is the whole lesson. */
      const sy = H - stripH + 10, sh = 16;
      ctx.save();
      ctx.fillStyle = css("--line"); ctx.globalAlpha = 0.55;
      ctx.fillRect(v.X(xmin), sy, v.X(lower) - v.X(xmin), sh);
      ctx.fillRect(v.X(floor), sy, v.X(xmax) - v.X(floor), sh);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = acc; ctx.globalAlpha = 0.75;
      ctx.fillRect(v.X(floor), sy, v.X(xmax) - v.X(floor), sh);
      ctx.restore();
      label(ctx, "condensing added this", (v.X(xmin) + v.X(lower)) / 2, sy + sh + 12, css("--red"), "center", 10);
      label(ctx, "the original domain", (v.X(floor) + v.X(xmax)) / 2, sy + sh + 12, acc, "center", 10);
      label(ctx, "x = " + fmt(lower, 2), v.X(lower), sy - 6, ink, "center", 10);
      label(ctx, "x = " + fmt(floor, 2), v.X(floor), sy - 6, ink, "center", 10);

      for (const c of candidates) {
        if (c < xmin || c > xmax) continue;
        const good = verdict(c).ok;
        line(ctx, v.X(c), v.Y(k), v.X(c), sy + sh, good ? acc : css("--red"), 1.4, [3, 3]);
        dot(ctx, v, c, k, good ? acc : css("--red"), good, 5);
        // Beside the dot rather than under the strip: at the foot of the canvas
        // the value was clipped by the card's own edge.
        label(ctx, fmt(c, 2), v.X(c), v.Y(k) - 14, good ? acc : css("--red"), "center", 11);
      }

      const inter = (lo, hi) => (hi === Infinity ? "(" + fmt(lo, 2) + ", ∞)" : "(" + fmt(lo, 2) + ", " + fmt(hi, 2) + ")");
      const condensed = "(-∞, " + fmt(lower, 2) + ") ∪ " + inter(floor, Infinity);
      const eqn = diff ? "(" + termA + ") / (" + termB + ") = " + RHS
        : "(" + termA + ")(" + termB + ") = " + RHS;
      const line1 = candidates.length > 0 ? candidates[0] : null;
      const line2 = candidates.length > 1 ? candidates[1] : null;
      const describe = x => {
        if (x === null) return "none";
        const w = verdict(x);
        if (w.ok) return fmt(x, 2) + " — accepted";
        return fmt(x, 2) + " — rejected: " + w.bad.which + " = " + fmt(w.bad.val, 2) + ", and a logarithm has no negative argument";
      };
      return [
        ["the equation", "log_" + b + "(" + termA + ") " + (diff ? "-" : "+")
          + " log_" + b + "(" + termB + ") = " + k],
        ["original domain", inter(floor, Infinity)],
        ["condensed domain", condensed],
        /* Always a whole ray, never nothing: (x + P)(x - Q) > 0 holds to the
           left of the smaller root as well as to the right of the larger, and
           when the two roots coincide the left branch is still there. An
           earlier version reported "the two agree" whenever -P equalled Q,
           which is the one setting where the added region is easiest to miss. */
        ["what condensing added", "(-∞, " + fmt(lower, 2) + ")"],
        ["equation after condensing", eqn],
        ["candidate 1", describe(line1)],
        ["candidate 2", describe(line2)],
        ["solution set", kept.length ? "{" + kept.map(x => fmt(x, 2)).join(", ") + "}" : "∅"],
      ];
    },

    /* Cross against touch, and end behaviour, as two consequences of one list of
       exponents (§3.2, ch03). f(x) = s·(x+2)^m1·x^m2·(x−3)^m3, with a
       multiplicity of 0 meaning the factor is absent — so a quadratic and a
       quintic are the same scene. The verdict colour is driven by m % 2 and
       never by a table of cases: a student who sets m = 3 must see exactly what
       m = 1 gives. */
    multiplicityWorkbench(ctx, p) {
      const m1 = clamp(Math.round(p.m1), 0, 3), m2 = clamp(Math.round(p.m2), 0, 3), m3 = clamp(Math.round(p.m3), 0, 3);
      const s = p.s === 0 ? 1 : p.s;
      const ROOTS = [[-2, m1], [0, m2], [3, m3]];
      const n = m1 + m2 + m3;
      const f = x => s * Math.pow(x + 2, m1) * Math.pow(x, m2) * Math.pow(x - 3, m3);

      const xmin = -4, xmax = 5, ymin = -6, ymax = 6;
      /* Its own mapping. view() holds one scale on both axes, which is right
         where a shape has to stay honest — a circle, a reflection — and wrong
         here: the y-values are already scaled to fit (see below), so insisting
         on square units only squeezes the picture into the middle third of the
         canvas and wastes the width the zeros need. */
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight, pad = 26;
      const v = {
        w: W, h: H,
        X: x => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad),
        Y: y => H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad),
      };
      grid(ctx, v, xmin, xmax, ymin, ymax);
      const acc = css("--accent"), ink = css("--ink-faint");

      /* A multiplicity-3 factor leaves the window by a factor of thousands, so
         the curve is scaled to fit — and the axis says so, rather than printing
         y-values that are not the function's.

         Scaled by the peak *between the outermost zeros*, not over the whole
         window: measured over the window, one tail of a quartic sets the scale
         and flattens the middle into a straight line, hiding the touch at the
         origin that the scene exists to show. The tails then leave the top of
         the frame, which is what the end-behaviour arrows are for. */
      const zeroXs = ROOTS.filter(([, m]) => m > 0).map(([root]) => root);
      const lo = zeroXs.length ? Math.min(...zeroXs) - 0.7 : xmin;
      const hi = zeroXs.length ? Math.max(...zeroXs) + 0.7 : xmax;
      let peak = 0;
      for (let i = 0; i <= 400; i++) {
        const x = lo + (hi - lo) * i / 400;
        peak = Math.max(peak, Math.abs(f(x)));
      }
      const k = (n === 0 || peak < 1e-9) ? 1 : 4 / peak;
      plot(ctx, v, x => { const y = k * f(x); return Math.abs(y) > ymax + 2 ? null : y; }, xmin, xmax, acc, 2.6);
      if (Math.abs(k - 1) > 1e-9) label(ctx, "vertical scale adjusted (×" + fmt(k, 3) + ") — shape, not values", 12, 32, ink, "left", 10);

      // End behaviour from the leading term alone, so the arrows are right even
      // when the visible part of the curve has not turned yet.
      const leftUp = n % 2 === 0 ? s > 0 : s < 0, rightUp = s > 0;
      const endTxt = n === 0 ? "flat — this is a constant"
        : (leftUp ? "up left" : "down left") + ", " + (rightUp ? "up right" : "down right");
      if (n > 0) {
        const ax = 0.55;
        arrow(ctx, v.X(xmin + ax), v.Y(leftUp ? 3.4 : -3.4), v.X(xmin + 0.1), v.Y(leftUp ? 5.2 : -5.2), css("--green"), 2);
        arrow(ctx, v.X(xmax - ax), v.Y(rightUp ? 3.4 : -3.4), v.X(xmax - 0.1), v.Y(rightUp ? 5.2 : -5.2), css("--green"), 2);
      }

      const verdict = m => (m === 0 ? "not a zero" : m % 2 === 1 ? "crosses (odd)" : "touches (even)");
      for (const [root, m] of ROOTS) {
        if (m === 0) continue;
        dot(ctx, v, root, 0, m % 2 === 1 ? css("--red") : css("--green"), true, 5.5);
        label(ctx, m % 2 === 1 ? "cross" : "touch", v.X(root), v.Y(0) + 18,
          m % 2 === 1 ? css("--red") : css("--green"), "center", 10);
      }

      // Turning points actually on screen, counted from where the curve changes
      // direction — next to the ceiling the degree allows.
      let turns = 0, prev = null;
      for (let i = 1; i <= 600; i++) {
        const x0 = xmin + (xmax - xmin) * (i - 1) / 600, x1 = xmin + (xmax - xmin) * i / 600;
        const d = Math.sign(f(x1) - f(x0));
        if (d !== 0 && prev !== null && d !== prev) turns++;
        if (d !== 0) prev = d;
      }

      const terms = ROOTS.filter(([, m]) => m > 0)
        .map(([root, m]) => (root === 0 ? "x" : "(x " + (root < 0 ? "+ " + -root : "- " + root) + ")") + (m > 1 ? "^" + m : ""));
      return [
        ["the function", (s === 1 ? "" : s === -1 ? "-" : s + "·") + (terms.join("") || "1")],
        ["degree", n === 0 ? "0" : m1 + " + " + m2 + " + " + m3 + " = " + n],
        ["leading coefficient", String(s)],
        ["end behaviour", endTxt],
        ["at x = -2", verdict(m1)],
        ["at x = 0", verdict(m2)],
        ["at x = 3", verdict(m3)],
        ["turning points", "at most n - 1 = " + Math.max(0, n - 1) + ", visible here " + turns],
      ];
    },

    /* The logarithm as the exponential read backwards (§4.1, again in §4.3, ch04).
       A tracer walks y = b^x and its mirror walks y = log_b x; the segment
       joining them is perpendicular to y = x and bisected by it, because the
       mirror is computed by swapping the coordinates rather than asserted. */
    mirrorAcrossIdentity(ctx, p) {
      // b = 1 is not an exponential function at all; step over it rather than
      // drawing the horizontal line y = 1 and calling it one.
      let b = clamp(p.b, 0.2, 5);
      if (Math.abs(b - 1) < 0.05) b = p.b >= 1 ? 1.1 : 0.9;
      const t = clamp(p.t, -3, 3);
      const bt = Math.pow(b, t);
      const logb = u => Math.log(u) / Math.log(b);

      const lim = 5;
      // view() holds one scale on both axes, which is the whole scene: a
      // stretched aspect makes a true reflection look like a false one.
      const v = view(ctx, { xmin: -lim, xmax: lim, ymin: -lim, ymax: lim, pad: 22 });
      grid(ctx, v, -lim, lim, -lim, lim);
      const expC = css("--accent"), logC = css("--green"), ink = css("--ink-faint");

      line(ctx, v.X(-lim), v.Y(-lim), v.X(lim), v.Y(lim), css("--line"), 1.4, [5, 4]);
      label(ctx, "y = x", v.X(lim) - 26, v.Y(lim) - 14, css("--line"), "right", 10);
      // Neither asymptote ever moves, whatever the base does — which is the
      // claim, so both are drawn at all times.
      line(ctx, v.X(-lim), v.Y(0), v.X(lim), v.Y(0), expC, 1.2, [4, 4]);
      line(ctx, v.X(0), v.Y(-lim), v.X(0), v.Y(lim), logC, 1.2, [4, 4]);

      plot(ctx, v, x => { const y = Math.pow(b, x); return y > lim + 1 ? null : y; }, -lim, lim, expC, 2.4);
      plot(ctx, v, x => (x <= 0 ? null : (Math.abs(logb(x)) > lim + 1 ? null : logb(x))), -lim, lim, logC, 2.4);

      if (Math.abs(bt) <= lim + 0.5) {
        line(ctx, v.X(t), v.Y(bt), v.X(bt), v.Y(t), css("--ink-faint"), 1.2, [3, 3]);
        dot(ctx, v, t, bt, expC, true, 5.5);
        dot(ctx, v, bt, t, logC, false, 5.5);
        label(ctx, "(" + fmt(t, 2) + ", " + fmt(bt, 2) + ")", v.X(t) - 8, v.Y(bt) - 12, expC, "right", 10);
        label(ctx, "(" + fmt(bt, 2) + ", " + fmt(t, 2) + ")", v.X(bt) + 8, v.Y(t) + 14, logC, "left", 10);
      }
      label(ctx, "y = " + fmt(b, 2) + "^x", 12, 16, expC, "left", 11);
      label(ctx, "y = log_" + fmt(b, 2) + " x", 12, 32, logC, "left", 11);

      const dir = b > 1 ? "increasing" : "decreasing";
      return [
        ["point on the exponential", "(" + fmt(t, 3) + ", " + fmt(bt, 3) + ")"],
        ["its mirror on the logarithm", "(" + fmt(bt, 3) + ", " + fmt(t, 3) + ")"],
        ["b to the power t", fmt(bt, 3)],
        ["log base b of that", fmt(logb(bt), 3)],
        ["exponential: domain, range", "(-∞, ∞)   and   (0, ∞)"],
        ["logarithm:   domain, range", "(0, ∞)   and   (-∞, ∞)"],
        ["both are", dir],
        ["the segment joining them", "perpendicular to y = x, and its midpoint ("
          + fmt((t + bt) / 2, 2) + ", " + fmt((t + bt) / 2, 2) + ") lies on it"],
      ];
    },

    /* The restriction that cancels out of the formula (§2.8, ch02). Both
       conditions on one number line: the outer one, which is visible in the
       simplified composite, and the inner one, which is not — and which is the
       mark almost everybody loses. */
    compositionDomain(ctx, p) {
      const P = clamp(Math.round(p.p), 1, 12);
      // q = 0 turns f into the constant 1 and there is nothing left to teach.
      const Q = Math.round(p.q) === 0 ? 1 : Math.round(p.q);
      const outer = P / Q;

      const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
      const frac = (a, b) => {
        const g = gcd(Math.abs(a), Math.abs(b)) || 1;
        let N = a / g, D = b / g;
        if (D < 0) { N = -N; D = -D; }
        return D === 1 ? String(N) : N + "/" + D;
      };
      const outerTxt = frac(P, Q);

      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const xmin = -10, xmax = 10, pad = 30;
      const X = x => pad + ((clamp(x, xmin, xmax) - xmin) / (xmax - xmin)) * (W - 2 * pad);
      const acc = css("--accent"), red = css("--red"), ink = css("--ink-faint");
      const ly = H - 52;

      // The three expressions, stacked in the order the work is done.
      label(ctx, "inner:      g(x) = " + P + " / x", 14, 20, ink, "left", 12);
      label(ctx, "outer:      f(u) = u / (u " + (Q < 0 ? "+ " + -Q : "- " + Q) + ")", 14, 40, ink, "left", 12);
      const boxTxt = "f(g(x)) = " + P + " / (" + P + (Q < 0 ? " + " + -Q : " - " + Q) + "x)";
      const bx = 14, by = 58, bw = Math.min(W - 28, 8 * boxTxt.length + 20), bh = 30;
      ctx.save();
      ctx.strokeStyle = acc; ctx.lineWidth = 1.4;
      ctx.strokeRect(bx, by, bw, bh);
      ctx.restore();
      label(ctx, boxTxt, bx + 10, by + bh / 2, css("--ink"), "left", 13);

      line(ctx, X(xmin), ly, X(xmax), ly, ink, 1.4);
      for (let t = xmin; t <= xmax; t++) {
        const big = t % 5 === 0;
        line(ctx, X(t), ly - (big ? 6 : 3), X(t), ly + (big ? 6 : 3), css("--line"), 1);
        if (big) label(ctx, String(t), X(t), ly + 20, css("--line"), "center", 10);
      }
      const cuts = [0, outer].sort((a, b) => a - b);
      const seg = (a, b) => line(ctx, X(a), ly, X(b), ly, acc, 5);
      seg(xmin, cuts[0]); seg(cuts[0], cuts[1]); seg(cuts[1], xmax);
      const dotAt = (x, colour) => dot(ctx, { X, Y: () => ly, s: 1 }, x, 0, colour, false, 5.5);
      dotAt(outer, red);
      dotAt(0, css("--green"));
      label(ctx, "x = " + outerTxt + "  (from the outer function)", X(outer), ly - 14, red, "center", 10);
      label(ctx, "x = 0  (from the inner function)", X(0), ly + 36, css("--green"), "center", 10);
      /* The leader line is the scene in one glance: the condition that is not in
         the box is pointed straight at the box. */
      line(ctx, X(0), ly - 8, bx + bw / 2, by + bh + 6, css("--green"), 1, [3, 3]);
      label(ctx, "not visible here", bx + bw / 2, by + bh + 18, css("--green"), "center", 10);

      const parts = ["(-∞, " + fmt(cuts[0], 2) + ")",
        "(" + fmt(cuts[0], 2) + ", " + fmt(cuts[1], 2) + ")",
        "(" + fmt(cuts[1], 2) + ", ∞)"];
      const same = Math.abs(cuts[0] - cuts[1]) < 1e-9;
      return [
        ["inner restriction", "x ≠ 0 — always, whatever the sliders say"],
        ["outer restriction", "x ≠ " + outerTxt + ", from solving " + P + "/x = " + Q],
        ["the simplified composite", boxTxt],
        ["domain", same ? parts[0] + " ∪ " + parts[2] : parts.join(" ∪ ")],
        ["pieces", same ? "2 — the two conditions coincided" : "3"],
        ["read off the box alone", "you would get x ≠ " + outerTxt + " and stop, which is one mark of two"],
      ];
    },

    /* Which of infinitely many angles is *the* answer (§5.7, ch05). The curve is
       drawn over two turns with the principal branch picked out; the horizontal
       line at the input meets it in many places, and exactly one of those meetings
       lies in the range of the inverse. Everything else on screen is a candidate
       the question did not ask for. */
    inverseTrigRange(ctx, p) {
      const which = clamp(Math.round(p.fn), 0, 2);       // 0 sin, 1 cos, 2 tan
      const NAME = ["sin", "cos", "tan"][which];
      const INV = ["sin⁻¹", "cos⁻¹", "tan⁻¹"][which];
      const PI = Math.PI;
      // Snap to the values a paper asks for, so the answer can be exact.
      const SNAP = [0, 0.5, -0.5, Math.SQRT2 / 2, -Math.SQRT2 / 2, Math.sqrt(3) / 2, -Math.sqrt(3) / 2,
        1, -1, Math.sqrt(3), -Math.sqrt(3), Math.sqrt(3) / 3, -Math.sqrt(3) / 3];
      const SNAP_TXT = ["0", "1/2", "-1/2", "√2/2", "-√2/2", "√3/2", "-√3/2",
        "1", "-1", "√3", "-√3", "√3/3", "-√3/3"];
      let x = clamp(p.x, -3, 3), xTxt = null;
      for (let i = 0; i < SNAP.length; i++) {
        if (Math.abs(x - SNAP[i]) <= 0.03) { x = SNAP[i]; xTxt = SNAP_TXT[i]; break; }
      }
      const xLabel = xTxt || fmt(x, 2);

      const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
      const piFrac = tw => {
        if (tw === 0) return "0";
        const s = tw < 0 ? "-" : "";
        const g = gcd(Math.abs(tw), 12) || 1, N = Math.abs(tw) / g, D = 12 / g;
        return s + (N === 1 ? "pi" : N + "pi") + (D === 1 ? "" : "/" + D);
      };
      const asPi = a => {
        const tw = a / (PI / 12);
        return Math.abs(tw - Math.round(tw)) < 1e-6 ? piFrac(Math.round(tw)) : fmt(a, 3);
      };

      const f = [Math.sin, Math.cos, Math.tan][which];
      const rangeTxt = ["[-pi/2, pi/2]", "[0, pi]", "(-pi/2, pi/2)"][which];
      const inRange = a => (which === 0 ? a >= -PI / 2 - 1e-9 && a <= PI / 2 + 1e-9
        : which === 1 ? a >= -1e-9 && a <= PI + 1e-9
          : a > -PI / 2 + 1e-9 && a < PI / 2 - 1e-9);
      const defined = which === 2 ? true : Math.abs(x) <= 1 + 1e-9;
      const answer = !defined ? null : which === 0 ? Math.asin(x) : which === 1 ? Math.acos(x) : Math.atan(x);

      // Every angle on two turns with the right value, so "infinitely many" is
      // something you can count rather than a claim.
      const candidates = [];
      if (defined) {
        const base = answer;
        for (let n = -2; n <= 2; n++) {
          if (which === 0) { candidates.push(base + 2 * PI * n, PI - base + 2 * PI * n); }
          else if (which === 1) { candidates.push(base + 2 * PI * n, -base + 2 * PI * n); }
          else candidates.push(base + PI * n);
        }
      }
      const seenKeys = new Set(), shown = [];
      for (const a of candidates.sort((m, n) => m - n)) {
        if (a < -2 * PI - 1e-9 || a > 2 * PI + 1e-9) continue;
        const key = Math.round(a * 1e6);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        shown.push(a);                    // full precision, so asPi still recognises it
      }

      const xmin = -2 * PI, xmax = 2 * PI;
      /* Sine and cosine live in [-1, 1]; drawing them on a tangent-sized window
         puts the input line a few pixels from the axis and hides the very
         crossing the student is being asked to find. */
      const ymax = which === 2 ? 3 : 1.7, ymin = -ymax;
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight, pad = 28;
      const v = {
        w: W, h: H,
        X: a => pad + ((a - xmin) / (xmax - xmin)) * (W - 2 * pad),
        Y: y => H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad),
      };
      const acc = css("--accent"), ink = css("--ink-faint"), green = css("--green"), red = css("--red");
      line(ctx, v.X(xmin), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 1.2);
      for (let t = -4; t <= 4; t++) {
        const a = t * PI / 2;
        line(ctx, v.X(a), v.Y(0) - 4, v.X(a), v.Y(0) + 4, css("--line"), 1);
        if (t !== 0) label(ctx, piFrac(t * 6), v.X(a), v.Y(0) + 16, css("--line"), "center", 10);
      }
      // The principal branch, shaded on the angle axis: the range of this inverse.
      const lo = which === 1 ? 0 : -PI / 2, hi = which === 1 ? PI : PI / 2;
      ctx.save();
      ctx.fillStyle = green; ctx.globalAlpha = 0.16;
      ctx.fillRect(v.X(lo), v.Y(ymax), v.X(hi) - v.X(lo), v.Y(ymin) - v.Y(ymax));
      ctx.restore();
      label(ctx, "range of " + INV + ": " + rangeTxt, (v.X(lo) + v.X(hi)) / 2, v.Y(ymax) + 12, green, "center", 11);

      const clip = y => (y === null || !isFinite(y) || Math.abs(y) > ymax ? null : y);
      plot(ctx, v, a => clip(f(a)), xmin, xmax, ink, 1.4);
      plot(ctx, v, a => (a < lo || a > hi ? null : clip(f(a))), lo, hi, green, 2.8);
      line(ctx, v.X(xmin), v.Y(x), v.X(xmax), v.Y(x), acc, 1.6, [5, 4]);
      label(ctx, "y = " + xLabel, v.X(xmax) - 4, v.Y(x) - 10, acc, "right", 10);

      for (const a of shown) {
        const good = inRange(a);
        dot(ctx, v, a, x, good ? green : red, good, good ? 6 : 4);
      }
      if (!defined) {
        label(ctx, INV + "(" + xLabel + ") is undefined — the line never meets the curve",
          W / 2, v.Y(ymax) + 30, red, "center", 12);
      }

      const rejected = shown.filter(a => !inRange(a)).slice(0, 3).map(a => asPi(a));
      return [
        ["the question", INV + "(" + xLabel + ")"],
        ["range of this inverse", rangeTxt],
        ["angles on two turns with this value", defined ? shown.map(a => asPi(a)).join(",  ") : "none — no angle has this " + NAME],
        ["the one in range", defined ? asPi(answer) : "undefined"],
        ["in degrees", defined ? fmt(answer * 180 / PI, 1) + "°" : "—"],
        ["why not the others", defined && rejected.length
          ? rejected.join(", ") + " all have the same " + NAME + ", and all lie outside " + rangeTxt
          : defined ? "there is no other candidate on screen" : (which === 2 ? "" : "the input is outside [-1, 1], which is the domain of " + INV)],
      ];
    },

    /* "I checked it at π/4, so it is an identity" (§6.1, ch06). Six candidate
       equations, three of them genuine and three engineered to be true at the
       angle a student would test. Both sides are drawn, and the two verdicts —
       agrees here, agrees everywhere — sit next to each other so the first can
       say yes while the second says no. */
    identityOrNot(ctx, p) {
      const PI = Math.PI;
      const which = clamp(Math.round(p.candidate), 1, 6);
      const tw = clamp(Math.round(p.x), 0, 24);        // the test angle, in twelfths of π
      const t = tw * PI / 12;

      const sec = a => 1 / Math.cos(a), cot = a => Math.cos(a) / Math.sin(a);
      const CANDIDATES = [
        { L: "sin(-x)·cot(-x)", R: "cos x",
          l: a => Math.sin(-a) * cot(-a), r: a => Math.cos(a) },
        { L: "sec x - cos x", R: "tan x·sin x",
          l: a => sec(a) - Math.cos(a), r: a => Math.tan(a) * Math.sin(a) },
        { L: "cos⁴x - sin⁴x", R: "1 - 2sin²x",
          l: a => Math.pow(Math.cos(a), 4) - Math.pow(Math.sin(a), 4), r: a => 1 - 2 * Math.pow(Math.sin(a), 2) },
        { L: "sin x + cos x", R: "√2·tan x",
          l: a => Math.sin(a) + Math.cos(a), r: a => Math.SQRT2 * Math.tan(a) },
        { L: "tan x", R: "sin x + (1 - √2/2)",
          l: a => Math.tan(a), r: a => Math.sin(a) + (1 - Math.SQRT2 / 2) },
        { L: "sin 2x", R: "2sin x",
          l: a => Math.sin(2 * a), r: a => 2 * Math.sin(a) },
      ];
      const C = CANDIDATES[which - 1];
      const val = f => { const y = f(t); return isFinite(y) && Math.abs(y) < 1e12 ? y : null; };

      const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
      const piFrac = k => {
        if (k === 0) return "0";
        const g = gcd(Math.abs(k), 12) || 1, N = Math.abs(k) / g, D = 12 / g;
        return (k < 0 ? "-" : "") + (N === 1 ? "pi" : N + "pi") + (D === 1 ? "" : "/" + D);
      };
      /* Values are recognised against a table rather than derived: the sides of
         these equations combine surds in ways no general simplifier here would
         get right, and a wrong "exact" value is worse than an honest decimal. */
      const R2 = Math.SQRT2, R3 = Math.sqrt(3);
      const EXACT = [[0, "0"], [1, "1"], [-1, "-1"], [0.5, "1/2"], [-0.5, "-1/2"],
        [R2 / 2, "√2/2"], [-R2 / 2, "-√2/2"], [R3 / 2, "√3/2"], [-R3 / 2, "-√3/2"],
        [R3, "√3"], [-R3, "-√3"], [R3 / 3, "√3/3"], [-R3 / 3, "-√3/3"],
        [2, "2"], [-2, "-2"], [R2, "√2"], [-R2, "-√2"], [2 * R3 / 3, "2√3/3"], [-2 * R3 / 3, "-2√3/3"],
        [1 - R2 / 2, "1 - √2/2"]];
      const show = y => {
        if (y === null) return "undefined";
        for (const [v, txt] of EXACT) if (Math.abs(y - v) < 1e-9) return txt;
        return fmt(y, 3);
      };

      /* Sampled rather than proved: where both sides are defined and finite, the
         largest gap decides. An identity has a gap at the level of floating-point
         noise; an impostor parts company by a visible amount somewhere. */
      let worst = 0, worstAt = null, firstAt = null;
      for (let i = 0; i <= 800; i++) {
        const a = 2 * PI * i / 800;
        const L = C.l(a), Rv = C.r(a);
        /* Samples near an asymptote are skipped. Left in, the widest gap is
           whatever the sampling grid happened to catch beside a pole — a number
           that changes with the grid, is far outside the drawn window, and says
           nothing about where the two curves actually part. */
        if (!isFinite(L) || !isFinite(Rv) || Math.abs(L) > 8 || Math.abs(Rv) > 8) continue;
        const gap = Math.abs(L - Rv);
        if (gap > worst) { worst = gap; worstAt = a; }
        if (gap > 1e-6 && firstAt === null) firstAt = a;
      }
      /* Also the first *special* angle where they part — that is the angle a
         student would have tested, and "they differ at pi/12" is a usable fact
         where "they differ at 0.016" is sampling noise wearing a number. */
      let firstSpecial = null;
      for (let k = 0; k <= 24 && firstSpecial === null; k++) {
        const a = k * PI / 12;
        const L = C.l(a), Rv = C.r(a);
        if (!isFinite(L) || !isFinite(Rv) || Math.abs(L) > 50 || Math.abs(Rv) > 50) continue;
        if (Math.abs(L - Rv) > 1e-6) firstSpecial = a;
      }
      const identity = worst < 1e-6;
      const asAngle = a => {
        if (a === null) return "—";
        const k = a / (PI / 12);
        return Math.abs(k - Math.round(k)) < 1e-6 ? piFrac(Math.round(k)) : fmt(a, 3);
      };

      const xmin = 0, xmax = 2 * PI, ymin = -4, ymax = 4;
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight, pad = 28;
      const v = {
        w: W, h: H,
        X: a => pad + ((a - xmin) / (xmax - xmin)) * (W - 2 * pad),
        Y: y => H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad),
      };
      const acc = css("--accent"), green = css("--green"), ink = css("--ink-faint"), red = css("--red");
      line(ctx, v.X(xmin), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 1.2);
      for (let k = 0; k <= 8; k++) {
        const a = k * PI / 4;
        line(ctx, v.X(a), v.Y(0) - 4, v.X(a), v.Y(0) + 4, css("--line"), 1);
        if (k % 2 === 0 && k) label(ctx, piFrac(k * 3), v.X(a), v.Y(0) + 16, css("--line"), "center", 10);
      }
      // A break, never a vertical stroke joining +∞ to −∞: the asymptote is not
      // part of the graph, and drawing it as one is how a student learns it is.
      const clip = f => a => { const y = f(a); return !isFinite(y) || Math.abs(y) > ymax ? null : y; };
      plot(ctx, v, clip(C.r), xmin, xmax, green, 5);        // thick, underneath
      plot(ctx, v, clip(C.l), xmin, xmax, acc, 1.8);        // thin, on top
      label(ctx, "left side:  " + C.L, 12, 16, acc, "left", 12);
      label(ctx, "right side: " + C.R, 12, 34, green, "left", 12);

      line(ctx, v.X(t), v.Y(ymin), v.X(t), v.Y(ymax), ink, 1.2, [4, 4]);
      const lv = val(C.l), rv = val(C.r);
      if (lv !== null && Math.abs(lv) <= ymax) dot(ctx, v, t, lv, acc, false, 5.5);
      if (rv !== null && Math.abs(rv) <= ymax) dot(ctx, v, t, rv, green, false, 5.5);
      if (!identity && worstAt !== null) {
        line(ctx, v.X(worstAt), v.Y(ymin), v.X(worstAt), v.Y(ymax), red, 1, [2, 3]);
        label(ctx, "widest gap", v.X(worstAt), v.Y(ymax) + 12, red, "center", 10);
      }

      const agreeHere = lv === null || rv === null ? "one side is undefined here"
        : Math.abs(lv - rv) < 1e-9 ? "yes" : "no";
      return [
        ["the candidate", C.L + "  =  " + C.R],
        ["test angle", piFrac(tw) + "   (" + fmt(t, 3) + ")"],
        ["left side here", show(lv)],
        ["right side here", show(rv)],
        ["agree here?", agreeHere],
        ["agree everywhere?", identity ? "yes — an identity" : "no — they part company"],
        ["widest gap found", identity ? "0 (to sampling precision)" : fmt(worst, 3) + " at x = " + asAngle(worstAt)],
        ["the first special angle where they differ", identity ? "none — they never differ"
          : firstSpecial !== null ? asAngle(firstSpecial) + "  (test that one instead)"
            : "none of the special angles — but they still differ, at " + asAngle(firstAt)],
      ];
    },

    /* The eight-part question, made continuous (§3.1, ch03). The final's Q1 is
       one parabola looked at eight ways; here the three numbers of the vertex
       form are on sliders and all eight answers move together — so "the maximum
       value" and "where it happens" are visibly two different readouts. */
    vertexFormSlider(ctx, p) {
      // A straight line is not a case of this scene; step over a = 0.
      const a = Math.abs(p.a) < 0.125 ? 0.25 : p.a;
      const h = p.h, k = p.k;
      const f = x => a * (x - h) * (x - h) + k;

      const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
      /* a comes in quarters and k is an integer, so -k/a is exactly rational and
         the intercepts can be printed as radicals rather than decimals — which
         is the form the paper marks. */
      const sqrtFrac = (num, den) => {
        if (den < 0) { num = -num; den = -den; }
        const g0 = gcd(Math.abs(num), den) || 1;
        num /= g0; den /= g0;
        // √(n/d) = √(n·d)/d
        let inside = num * den, outside = 1;
        for (let s = Math.floor(Math.sqrt(inside)); s >= 2; s--) {
          if (inside % (s * s) === 0) { outside = s; inside /= s * s; break; }
        }
        const g1 = gcd(outside, den) || 1;
        const top = (outside / g1 === 1 ? "" : outside / g1) + (inside === 1 ? "" : "√" + inside);
        const bot = den / g1;
        const topTxt = top === "" ? "1" : top;
        return bot === 1 ? topTxt : topTxt + "/" + bot;
      };
      const nf = n => String(Math.round(n * 1000) / 1000);

      // -k/a as a fraction: a = A/4 with A an integer, so -k/a = -4k/A.
      const A4 = Math.round(a * 4);
      const rNum = -4 * k, rDen = A4;
      const disc = -k / a;                       // (x - h)² = -k/a at an intercept
      let interceptTxt, roots = [];
      if (Math.abs(k) < 1e-9) { interceptTxt = "one repeated intercept at x = " + nf(h); roots = [h]; }
      else if (disc < 0) { interceptTxt = "none — the parabola never reaches the axis"; }
      else {
        const rad = sqrtFrac(rNum, rDen);
        roots = [h - Math.sqrt(disc), h + Math.sqrt(disc)];
        interceptTxt = "x = " + nf(h) + " ± " + rad + "   (" + nf(roots[0]) + ", " + nf(roots[1]) + ")";
      }

      const xmin = -8, xmax = 8;
      // The vertex must never leave the frame, and y = 0 must stay visible or the
      // intercepts have nothing to sit on.
      let ylo = a > 0 ? k - 4 : k - 20, yhi = a > 0 ? k + 20 : k + 4;
      ylo = Math.min(ylo, -3); yhi = Math.max(yhi, 3);
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight, pad = 28;
      const v = {
        w: W, h: H,
        X: x => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad),
        Y: y => H - pad - ((y - ylo) / (yhi - ylo)) * (H - 2 * pad),
      };
      const acc = css("--accent"), green = css("--green"), ink = css("--ink-faint"), red = css("--red");

      // The range, as a band up the y-axis from k.
      ctx.save();
      ctx.fillStyle = green; ctx.globalAlpha = 0.16;
      const bandTop = a > 0 ? v.Y(yhi) : v.Y(k), bandBot = a > 0 ? v.Y(k) : v.Y(ylo);
      ctx.fillRect(v.X(xmin), bandTop, 26, bandBot - bandTop);
      ctx.restore();
      // An unlabelled coloured strip is decoration; this one is the range.
      label(ctx, "range", v.X(xmin) + 13, a > 0 ? bandBot + 12 : bandTop - 10, green, "center", 10);

      for (let g = Math.ceil(xmin); g <= xmax; g++) line(ctx, v.X(g), v.Y(ylo), v.X(g), v.Y(yhi), css("--line"), g === 0 ? 1.4 : 0.4);
      line(ctx, v.X(xmin), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 1.4);
      line(ctx, v.X(h), v.Y(ylo), v.X(h), v.Y(yhi), ink, 1.4, [5, 4]);
      // The label is the equation of a line, never a bare number — that is the
      // distinction the mark scheme makes.
      label(ctx, "x = " + nf(h), v.X(h) + 6, v.Y(yhi) + 14, ink, "left", 11);

      plot(ctx, v, x => { const y = f(x); return y < ylo - 2 || y > yhi + 2 ? null : y; }, xmin, xmax, acc, 2.6);
      for (const r of roots) dot(ctx, v, r, 0, red, false, 5);
      dot(ctx, v, h, k, acc, true, 6);

      // The y-intercept and its mirror, joined: the fourth point you get free
      // from the axis of symmetry, which is why anyone bothers finding it.
      const c = a * h * h + k;
      if (c >= ylo && c <= yhi) {
        dot(ctx, v, 0, c, green, false, 5);
        if (Math.abs(h) > 1e-9 && Math.abs(2 * h) <= xmax) {
          dot(ctx, v, 2 * h, c, green, false, 5);
          line(ctx, v.X(0), v.Y(c), v.X(2 * h), v.Y(c), green, 1, [3, 3]);
        }
      }

      const b = -2 * a * h;
      const term = (coef, txt) => (coef === 0 ? "" : (coef > 0 ? " + " : " - ") + (Math.abs(coef) === 1 && txt ? "" : nf(Math.abs(coef))) + txt);
      const standard = (a === 1 ? "" : a === -1 ? "-" : nf(a)) + "x²" + term(b, "x") + term(c, "");
      label(ctx, "y = " + (a === 1 ? "" : a === -1 ? "-" : nf(a)) + "(x " + (h < 0 ? "+ " + nf(-h) : "- " + nf(h)) + ")²"
        + (k === 0 ? "" : (k > 0 ? " + " : " - ") + nf(Math.abs(k))), 12, 16, css("--ink"), "left", 12);
      label(ctx, "y = " + standard, 12, 34, ink, "left", 11);

      return [
        ["vertex", "(" + nf(h) + ", " + nf(k) + ")"],
        ["axis of symmetry", "x = " + nf(h)],
        ["opens", a > 0 ? "upward" : "downward"],
        [a > 0 ? "minimum value" : "maximum value", nf(k)],
        ["occurs at x =", nf(h)],
        ["standard form", "y = " + standard],
        ["x-intercepts", interceptTxt],
        ["y-intercept", "(0, " + nf(c) + ")" + (Math.abs(h) > 1e-9 ? ",  mirrored at (" + nf(2 * h) + ", " + nf(c) + ")" : "")],
        ["range", a > 0 ? "[" + nf(k) + ", ∞)" : "(-∞, " + nf(k) + "]"],
      ];
    },

    /* Vector components and the resultant — the ch01 trainer. */
    vectors(ctx, p) {
      const A = p.A, tA = p.thetaA * Math.PI / 180, B = p.B, tB = p.thetaB * Math.PI / 180;
      const ax = A * Math.cos(tA), ay = A * Math.sin(tA);
      const bx = B * Math.cos(tB), by = B * Math.sin(tB);
      const rx = ax + bx, ry = ay + by;
      // Fit the window to what is actually drawn rather than to a symmetric box:
      // two vectors in the upper half left the bottom half of a phone screen empty.
      const xs = [0, ax, rx, bx], ys = [0, ay, ry, by];
      const m = 0.18 * Math.max(2, Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      const v = view(ctx, {
        xmin: Math.min(...xs) - m, xmax: Math.max(...xs) + m,
        ymin: Math.min(...ys) - m, ymax: Math.max(...ys) + m,
      });
      const span = Math.max(...xs.map(Math.abs), ...ys.map(Math.abs)) + m;
      const lineC = css("--line"), ink = css("--ink-faint");
      line(ctx, v.X(-span), v.Y(0), v.X(span), v.Y(0), lineC, 1);
      line(ctx, v.X(0), v.Y(-span), v.X(0), v.Y(span), lineC, 1);
      label(ctx, "x", v.X(span) - 8, v.Y(0) - 10, ink, "right", 11);
      label(ctx, "y", v.X(0) + 10, v.Y(span) + 10, ink, "left", 11);
      // components of A, drawn dashed so "a component is a number, not the vector"
      line(ctx, v.X(0), v.Y(0), v.X(ax), v.Y(0), css("--accent"), 1.5, [4, 4]);
      line(ctx, v.X(ax), v.Y(0), v.X(ax), v.Y(ay), css("--accent"), 1.5, [4, 4]);
      arrow(ctx, v.X(0), v.Y(0), v.X(ax), v.Y(ay), css("--accent"));
      label(ctx, "A", v.X(ax) + 8, v.Y(ay), css("--accent"), "left", 13);
      arrow(ctx, v.X(ax), v.Y(ay), v.X(rx), v.Y(ry), css("--green"));
      label(ctx, "B", v.X((ax + rx) / 2) + 8, v.Y((ay + ry) / 2), css("--green"), "left", 13);
      arrow(ctx, v.X(0), v.Y(0), v.X(rx), v.Y(ry), css("--red"), 3);
      label(ctx, "R = A + B", v.X(rx) + 8, v.Y(ry) - 12, css("--red"), "left", 13);
      const dir = (Math.atan2(ry, rx) * 180 / Math.PI + 360) % 360;
      return [
        ["Aₓ", `${fmt(ax)}`], ["Aᵧ", `${fmt(ay)}`],
        ["Rₓ", `${fmt(rx)}`], ["Rᵧ", `${fmt(ry)}`],
        ["|R|", `${fmt(Math.hypot(rx, ry))}`], ["direction", `${fmt(dir, 1)}°`],
      ];
    },

    /* Block on an incline: the free-body diagram, and the sin/cos decision that
       decides most of Chapter 5's marks — ch05. */
    incline(ctx, p) {
      const g = 9.8, m = p.m, th = p.theta * Math.PI / 180, mus = p.mu;
      const w = m * g, along = w * Math.sin(th), perp = w * Math.cos(th);
      const fmax = mus * perp, slides = along > fmax + 1e-9;
      const a = slides ? (along - fmax) / m : 0;
      const v = view(ctx, { xmin: -1.1, xmax: 1.1, ymin: -0.75, ymax: 0.75, pad: 22 });
      const ink = css("--ink-faint");
      // the slope itself
      const x0 = -1.0, y0 = -0.55, len = 1.9;
      const sx = x0 + len * Math.cos(th), sy = y0 + len * Math.sin(th);
      line(ctx, v.X(x0), v.Y(y0), v.X(sx), v.Y(sy), css("--line"), 3);
      line(ctx, v.X(x0), v.Y(y0), v.X(sx), v.Y(y0), css("--line"), 1, [4, 4]);
      label(ctx, `${p.theta}°`, v.X(x0) + 26, v.Y(y0) - 10, ink, "left", 12);
      // the block, drawn on the slope at its midpoint
      const bx = x0 + 0.95 * Math.cos(th), by = y0 + 0.95 * Math.sin(th);
      ctx.save();
      ctx.translate(v.X(bx), v.Y(by)); ctx.rotate(-th);
      ctx.fillStyle = css("--accent-soft"); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2;
      ctx.fillRect(-17, -30, 34, 26); ctx.strokeRect(-17, -30, 34, 26);
      ctx.restore();
      // forces, scaled so the longest is a fixed length on screen
      const big = Math.max(w, perp, fmax, 1e-6), sc = 70 / big;
      const cx = v.X(bx), cy = v.Y(by) - 16;
      arrow(ctx, cx, cy, cx, cy + w * sc, css("--red"));
      label(ctx, "w = mg", cx + 6, cy + w * sc + 10, css("--red"), "left", 11);
      // The normal is perpendicular to the SLOPE, not to the ground, so it leans
      // off vertical by θ towards the UPHILL side: world (−sin θ, cos θ), which
      // is (−sin θ, −cos θ) in pixels because Y runs downwards. Leaning it the
      // other way draws the one picture this trainer exists to correct.
      const nx = cx - perp * sc * Math.sin(th), ny = cy - perp * sc * Math.cos(th);
      arrow(ctx, cx, cy, nx, ny, css("--green"));
      label(ctx, "n", nx - 6, ny - 4, css("--green"), "right", 11);
      // Friction opposes the block's tendency to slide, and here that tendency is
      // down the slope in both cases — static and holding, or kinetic and merely
      // slowing the slide. So the arrow points UP the slope either way:
      // world (cos θ, sin θ) → pixels (cos θ, −sin θ).
      const fmag = slides ? fmax : along;
      const fx = cx + fmag * sc * Math.cos(th), fy = cy - fmag * sc * Math.sin(th);
      arrow(ctx, cx, cy, fx, fy, css("--accent"));
      label(ctx, slides ? "fₖ (sliding)" : "fₛ (holding)", fx + 6, fy - 10, css("--accent"), "left", 11);
      return [
        ["w = mg", `${fmt(w, 1)} N`],
        ["along slope", `${fmt(along, 1)} N`],
        ["perpendicular", `${fmt(perp, 1)} N`],
        ["max static f", `${fmt(fmax, 1)} N`],
        ["verdict", slides ? "slides" : "stays put"],
        ["acceleration", `${fmt(a, 2)} m/s²`],
      ];
    },

    /* Work as the area under a force-displacement graph — ch06. A constant force
       for part of the trip, then a spring: the two shapes the exam uses. */
    workArea(ctx, p) {
      const F = p.F, d = p.d, k = p.k, x = p.x;
      const wConst = F * d, wSpring = -0.5 * k * x * x;
      const xmax = d + x + 0.5, ymax = Math.max(F, k * x, 1) * 1.25;
      const v = view(ctx, { xmin: 0, xmax, ymin: -ymax * 0.15, ymax });
      axes(ctx, v, "x (m)", "F (N)");
      // constant-force block
      ctx.save();
      ctx.fillStyle = css("--accent-soft"); ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2;
      ctx.fillRect(v.X(0), v.Y(F), v.X(d) - v.X(0), v.Y(0) - v.Y(F));
      ctx.strokeRect(v.X(0), v.Y(F), v.X(d) - v.X(0), v.Y(0) - v.Y(F));
      ctx.restore();
      label(ctx, `${fmt(wConst, 0)} J`, (v.X(0) + v.X(d)) / 2, v.Y(F / 2), css("--accent"), "center", 12);
      // spring triangle, below the axis because the force opposes the motion
      if (x > 0) {
        ctx.save();
        ctx.fillStyle = css("--red-soft"); ctx.strokeStyle = css("--red"); ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(v.X(d), v.Y(0)); ctx.lineTo(v.X(d + x), v.Y(0));
        ctx.lineTo(v.X(d + x), v.Y(-k * x * 0.999 * 0.15)); ctx.closePath();
        ctx.fill(); ctx.stroke(); ctx.restore();
        line(ctx, v.X(d), v.Y(0), v.X(d + x), v.Y(-ymax * 0.15 * Math.min(1, k * x / (ymax))),
             css("--red"), 2);
        label(ctx, `${fmt(wSpring, 0)} J`, v.X(d + x / 2), v.Y(0) + 16, css("--red"), "center", 12);
      }
      return [
        ["W by the push", `${fmt(wConst, 1)} J`],
        ["W by the spring", `${fmt(wSpring, 1)} J`],
        ["net work", `${fmt(wConst + wSpring, 1)} J`],
        ["spring force at x", `${fmt(k * x, 1)} N`],
      ];
    },

    /* Two point charges: the field on the axis between and beyond them — ch11. */
    charges(ctx, p) {
      const k = 8.99e9, q1 = p.q1 * 1e-9, q2 = p.q2 * 1e-9, d = p.d, xp = p.x;
      const r1 = Math.abs(xp), r2 = Math.abs(d - xp);
      const e1 = r1 > 0.02 ? k * q1 / (r1 * r1) * Math.sign(xp || 1) : NaN;
      const e2 = r2 > 0.02 ? -k * q2 / (r2 * r2) * Math.sign(d - xp || 1) : NaN;
      const net = e1 + e2;
      const v = view(ctx, { xmin: -0.6, xmax: d + 0.6, ymin: -0.5, ymax: 0.5, pad: 24 });
      line(ctx, v.X(-0.6), v.Y(0), v.X(d + 0.6), v.Y(0), css("--line"), 1);
      const draw = (x, q, name) => {
        ctx.save();
        ctx.fillStyle = q >= 0 ? css("--red") : css("--accent");
        ctx.beginPath(); ctx.arc(v.X(x), v.Y(0), 11, 0, 7); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 13px system-ui"; ctx.textAlign = "center";
        ctx.textBaseline = "middle"; ctx.fillText(q >= 0 ? "+" : "−", v.X(x), v.Y(0));
        ctx.restore();
        label(ctx, name, v.X(x), v.Y(0) - 22, css("--ink-faint"), "center", 11);
      };
      draw(0, q1, `${p.q1} nC`); draw(d, q2, `${p.q2} nC`);
      // the test point and the net field there
      line(ctx, v.X(xp), v.Y(0.28), v.X(xp), v.Y(-0.28), css("--ink-faint"), 1, [3, 3]);
      if (isFinite(net)) {
        const L = Math.min(90, Math.max(12, Math.log10(Math.abs(net) + 1) * 26));
        arrow(ctx, v.X(xp), v.Y(0.14), v.X(xp) + Math.sign(net) * L, v.Y(0.14), css("--green"), 3);
      }
      return [
        ["distance to q₁", `${fmt(r1)} m`],
        ["distance to q₂", `${fmt(r2)} m`],
        ["E from q₁", isFinite(e1) ? `${fmt(e1, 0)} N/C` : "—"],
        ["E from q₂", isFinite(e2) ? `${fmt(e2, 0)} N/C` : "—"],
        ["net E", isFinite(net) ? `${fmt(net, 0)} N/C` : "—"],
        // A zero field has no direction, and printing one where the two
        // contributions cancel is exactly the misconception this trainer exists
        // to kill.
        ["points", !isFinite(net) ? "—"
          : Math.abs(net) < 0.5 ? "nowhere — it cancels"
          : net > 0 ? "towards +x" : "towards −x"],
      ];
    },

    /* Charging and discharging a capacitor through a resistor — ch16. */
    rc(ctx, p) {
      const R = p.R, C = p.C * 1e-6, emf = p.emf, tau = R * C;
      const tmax = Math.max(5 * tau, 1e-3);
      const v = view(ctx, { xmin: 0, xmax: tmax, ymin: 0, ymax: emf * 1.15 });
      axes(ctx, v, "t (s)", "V (V)");
      const curve = (f, colour) => {
        ctx.save(); ctx.strokeStyle = colour; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let i = 0; i <= 140; i++) {
          const t = tmax * i / 140;
          i ? ctx.lineTo(v.X(t), v.Y(f(t))) : ctx.moveTo(v.X(t), v.Y(f(t)));
        }
        ctx.stroke(); ctx.restore();
      };
      curve(t => emf * (1 - Math.exp(-t / tau)), css("--accent"));
      curve(t => emf * Math.exp(-t / tau), css("--red"));
      line(ctx, v.X(tau), v.Y(0), v.X(tau), v.Y(emf * 1.1), css("--ink-faint"), 1, [4, 4]);
      label(ctx, "τ", v.X(tau) + 5, v.Y(emf * 1.05), css("--ink-faint"), "left", 12);
      label(ctx, "charging", v.X(tmax * 0.55), v.Y(emf * 0.93), css("--accent"), "left", 11);
      label(ctx, "discharging", v.X(tmax * 0.35), v.Y(emf * 0.18), css("--red"), "left", 11);
      return [
        ["time constant τ", `${fmt(tau, 3)} s`],
        ["V after one τ", `${fmt(emf * (1 - Math.exp(-1)), 2)} V`],
        ["V after 5τ", `${fmt(emf * (1 - Math.exp(-5)), 2)} V`],
        ["initial current", `${fmt(emf / R * 1000, 2)} mA`],
        ["final charge", `${fmt(C * emf * 1e6, 1)} μC`],
      ];
    },

    /* ---- calculus ---------------------------------------------------------
       The four scenes below are the four ideas the whole of a first calculus
       course is built from. Each one exists because the idea is a *motion* —
       a point sliding in, rectangles getting thinner — and a still picture of
       it in a textbook is the reason students learn the formula instead. */

    /* A limit at a point the function never reaches: f(x) = (x²−4)/(x−2),
       which is x+2 everywhere except at x = 2, where it is 0/0. Drag x and the
       value closes in on 4 from either side while f(2) stays undefined. */
    limitHole(ctx, p) {
      const xmin = -1, xmax = 5, ymin = -1, ymax = 7.5;
      const hole = 2, limit = 4;
      const f = x => x + 2;
      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 24 });
      grid(ctx, v, xmin, xmax, ymin, ymax);
      // Two pieces, so the gap at x = 2 is visible as a gap.
      plot(ctx, v, x => (x < hole ? f(x) : null), xmin, hole, css("--ink-faint"));
      plot(ctx, v, x => (x > hole ? f(x) : null), hole, xmax, css("--ink-faint"));
      dot(ctx, v, hole, limit, css("--ink-faint"), false);

      const x = p.x;
      // "At the hole" is a band, not a point: a slider step can never land
      // exactly on 2, and a scene that only ever says "approaching" would never
      // show the student the case the whole idea turns on.
      const atHole = Math.abs(x - hole) < 0.006;
      if (!atHole) {
        const y = f(x);
        line(ctx, v.X(x), v.Y(0), v.X(x), v.Y(y), css("--accent"), 1, [3, 3]);
        line(ctx, v.X(xmin), v.Y(y), v.X(x), v.Y(y), css("--accent"), 1, [3, 3]);
        dot(ctx, v, x, y, css("--accent"));
      }
      line(ctx, v.X(xmin), v.Y(limit), v.X(xmax), v.Y(limit), css("--green"), 1.5, [6, 4]);
      label(ctx, "y → 4", v.X(xmax) - 8, v.Y(limit) - 12, css("--green"), "right", 11);
      return [
        ["x", fmt(x)],
        ["f(x)", atHole ? "undefined (hole)" : fmt(f(x))],
        ["distance from 2", fmt(Math.abs(x - hole), 3)],
        ["f(2) itself", "undefined"],
        ["limit as x → 2", fmt(limit)],
      ];
    },

    /* The derivative as the slope a secant line settles on. f(x) = x² at
       P = (1,1); the secant through P and (1+h, f(1+h)) has slope exactly
       2+h, so shrinking h walks the number to 2 without ever dividing by 0. */
    secantTangent(ctx, p) {
      const xmin = -0.6, xmax = 3.2, ymin = -1, ymax = 8;
      const f = x => x * x, a = 1, deriv = 2;
      /* h = 0 is the one value the difference quotient does not have, so the
         slider stops just short of it on whichever side it came from. Snapping
         to zero would print a slope computed as 0/0. */
      let h = p.h;
      if (Math.abs(h) < 0.02) h = h < 0 ? -0.02 : 0.02;
      const q = a + h, slope = (f(q) - f(a)) / h;

      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 24 });
      grid(ctx, v, xmin, xmax, ymin, ymax);
      // The true tangent, faint and always there: the line the secant is
      // converging to, so convergence is something you watch rather than infer.
      const tan = x => f(a) + deriv * (x - a);
      plot(ctx, v, tan, xmin, xmax, css("--green"), 1.5);
      plot(ctx, v, f, xmin, xmax, css("--ink-faint"), 2.6);
      const sec = x => f(a) + slope * (x - a);
      plot(ctx, v, sec, xmin, xmax, css("--accent"), 2.2);
      dot(ctx, v, a, f(a), css("--ink-faint"));
      label(ctx, "P (1, 1)", v.X(a) - 10, v.Y(f(a)) + 16, css("--ink-faint"), "right", 11);
      dot(ctx, v, q, f(q), css("--accent"));
      label(ctx, "Q", v.X(q) + 8, v.Y(f(q)) - 8, css("--accent"), "left", 12);
      return [
        ["h", fmt(h)],
        ["Q", `(${fmt(q)}, ${fmt(f(q))})`],
        ["rise / run", `${fmt(f(q) - f(a))} / ${fmt(h)}`],
        ["secant slope", fmt(slope)],
        ["slope − 2", fmt(slope - deriv, 3)],
        ["f′(1)", fmt(deriv)],
      ];
    },

    /* A Riemann sum converging on a definite integral. f(x) = −0.5x² + 4x on
       [0,6], whose exact area is 36. Left, right and midpoint rules are the
       three the exam asks for, and the point is that they disagree at small n
       and stop disagreeing as n grows. */
    riemannSum(ctx, p) {
      const a = 0, b = 6, exact = 36;
      const f = x => -0.5 * x * x + 4 * x;
      const n = Math.max(1, Math.round(p.n));
      // 0 / 1 / 2 rather than "left" / "right": a config carries numbers, and
      // the challenge checker compares numbers.
      const mode = Math.round(p.mode ?? 0);
      const dx = (b - a) / n;
      const sampleOf = i => (mode === 0 ? a + i * dx
        : mode === 1 ? a + (i + 1) * dx
          : a + (i + 0.5) * dx);
      let sum = 0;
      for (let i = 0; i < n; i++) sum += f(sampleOf(i)) * dx;

      const xmin = -0.5, xmax = 6.5, ymin = -0.5, ymax = 9.5;
      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 22 });
      ctx.save();
      ctx.fillStyle = css("--accent-soft");
      ctx.strokeStyle = css("--accent");
      ctx.lineWidth = n > 30 ? 0.4 : 1;
      for (let i = 0; i < n; i++) {
        const xL = a + i * dx, h = f(sampleOf(i));
        const top = v.Y(h), base = v.Y(0);
        ctx.fillRect(v.X(xL), Math.min(top, base), v.X(xL + dx) - v.X(xL), Math.abs(base - top));
        ctx.strokeRect(v.X(xL), Math.min(top, base), v.X(xL + dx) - v.X(xL), Math.abs(base - top));
      }
      ctx.restore();
      grid(ctx, v, xmin, xmax, ymin, ymax);
      plot(ctx, v, x => (x >= a && x <= b ? f(x) : null), xmin, xmax, css("--ink-faint"), 2.6);
      return [
        ["rule", mode === 0 ? "left edge" : mode === 1 ? "right edge" : "midpoint"],
        ["rectangles n", `${n}`],
        ["width Δx", fmt(dx, 3)],
        ["estimate", fmt(sum, 3)],
        ["exact area", fmt(exact, 3)],
        ["error", fmt(Math.abs(exact - sum), 3)],
      ];
    },

    /* The Fundamental Theorem, watched rather than proved: A(x) is the area
       under f from 0 to x, and the slope of A at x is the height of f at x —
       at every x, which is what makes it a theorem and not a coincidence. */
    ftcArea(ctx, p) {
      const f = t => 0.5 * t + 1;          // the integrand
      const A = x => 0.25 * x * x + x;      // its antiderivative with A(0) = 0
      const x = p.x;
      const xmin = -0.4, xmax = 6.4, ymin = -0.6, ymax = 16;
      const v = view(ctx, { xmin, xmax, ymin, ymax, pad: 20 });

      // the accumulated area, shaded
      ctx.save();
      ctx.fillStyle = css("--green-soft");
      ctx.beginPath();
      ctx.moveTo(v.X(0), v.Y(0));
      const steps = 80;
      for (let i = 0; i <= steps; i++) {
        const t = x * i / steps;
        ctx.lineTo(v.X(t), v.Y(f(t)));
      }
      ctx.lineTo(v.X(x), v.Y(0));
      ctx.closePath(); ctx.fill();
      ctx.restore();

      grid(ctx, v, xmin, xmax, ymin, ymax);
      plot(ctx, v, f, 0, xmax, css("--green"), 2.4);
      plot(ctx, v, A, 0, xmax, css("--accent"), 2.2);
      // A short tangent to A at x, whose slope is claimed to be f(x). Drawn, not
      // asserted: the student can see it lie along A.
      const m = f(x), half = 0.8;
      line(ctx, v.X(x - half), v.Y(A(x) - m * half), v.X(x + half), v.Y(A(x) + m * half),
           css("--ink-faint"), 2);
      dot(ctx, v, x, f(x), css("--green"));
      label(ctx, "f", v.X(x) + 8, v.Y(f(x)) - 8, css("--green"), "left", 12);
      dot(ctx, v, x, A(x), css("--accent"));
      label(ctx, "A", v.X(x) + 8, v.Y(A(x)) - 8, css("--accent"), "left", 12);
      return [
        ["x", fmt(x)],
        ["f(x) — height of the curve", fmt(f(x))],
        ["A(x) — area so far", fmt(A(x))],
        ["slope of A at x", fmt(m)],
        ["difference", fmt(Math.abs(m - f(x)), 3)],
      ];
    },

    /* Projectile launched from a height — ch03. */
    projectile(ctx, p) {
      const g = 9.8, v0 = p.v0, th = p.angle * Math.PI / 180, h0 = p.h0;
      const vx = v0 * Math.cos(th), vy0 = v0 * Math.sin(th);
      const tHit = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g;
      const range = vx * tHit;
      const hMax = h0 + vy0 * vy0 / (2 * g);
      const vImpact = Math.hypot(vx, vy0 - g * tHit);
      const xmax = Math.max(range * 1.1, 5), ymax = Math.max(hMax * 1.25, 5);
      const v = view(ctx, { xmin: 0, xmax, ymin: 0, ymax });
      axes(ctx, v, "x (m)", "y (m)");
      // the ground, then the path
      line(ctx, v.X(0), v.Y(0), v.X(xmax), v.Y(0), css("--line"), 2);
      ctx.save();
      ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const t = tHit * i / 120, x = vx * t, y = h0 + vy0 * t - 0.5 * g * t * t;
        i ? ctx.lineTo(v.X(x), v.Y(y)) : ctx.moveTo(v.X(x), v.Y(y));
      }
      ctx.stroke(); ctx.restore();
      // apex marker and the launch velocity split into its components
      const tApex = vy0 / g, xApex = vx * tApex;
      if (tApex > 0 && tApex < tHit) {
        line(ctx, v.X(xApex), v.Y(0), v.X(xApex), v.Y(hMax), css("--ink-faint"), 1, [3, 3]);
        label(ctx, `h = ${fmt(hMax, 1)} m`, v.X(xApex) + 6, v.Y(hMax) - 10, css("--ink-faint"), "left", 11);
      }
      const sc = Math.min(60, v.s * v0 * 0.35) / Math.max(v0, 1e-6);
      arrow(ctx, v.X(0), v.Y(h0), v.X(0) + vx * sc, v.Y(h0), css("--green"), 2);
      arrow(ctx, v.X(0), v.Y(h0), v.X(0), v.Y(h0) - vy0 * sc, css("--red"), 2);
      label(ctx, "vₓ constant", v.X(0) + vx * sc + 6, v.Y(h0) + 2, css("--green"), "left", 11);
      return [
        ["vₓ", `${fmt(vx)} m/s`], ["v₀ᵧ", `${fmt(vy0)} m/s`],
        ["time of flight", `${fmt(tHit)} s`], ["range", `${fmt(range)} m`],
        ["max height", `${fmt(hMax)} m`], ["impact speed", `${fmt(vImpact)} m/s`],
      ];
    },

    /* Refraction at a boundary, and the moment it stops happening. Total internal
       reflection is not a separate rule to memorise: it is Snell's law running out
       of room, because sin θ₂ = (n₁/n₂)sin θ₁ cannot exceed one. The scene makes
       that arithmetic visible — the refracted ray flattens onto the boundary and
       then is simply not there. */
    refraction(ctx, p) {
      const t1 = p.theta * Math.PI / 180;
      const s2 = (p.n1 / p.n2) * Math.sin(t1);
      const tir = s2 > 1;
      const t2 = tir ? NaN : Math.asin(s2);
      const crit = p.n1 > p.n2 ? Math.asin(p.n2 / p.n1) : NaN;

      const v = view(ctx, { xmin: -1, xmax: 1, ymin: -1, ymax: 1, pad: 22 });
      // The denser side is tinted, so "which way does it bend" has an answer on
      // screen before any number is read.
      ctx.save();
      ctx.globalAlpha = Math.min(0.3, Math.max(0.05, (p.n2 - 1) * 0.22));
      ctx.fillStyle = css("--accent");
      ctx.fillRect(v.X(-1), v.Y(0), v.X(1) - v.X(-1), v.Y(-1) - v.Y(0));
      ctx.restore();

      line(ctx, v.X(-1), v.Y(0), v.X(1), v.Y(0), css("--accent"), 2);
      line(ctx, v.X(0), v.Y(0.95), v.X(0), v.Y(-0.95), css("--ink-faint"), 1, [4, 4]);
      label(ctx, "normal", v.X(0) + 6, v.Y(0.95) + 4, css("--ink-faint"), "left", 11);

      // One colour per ray — incident amber, reflected red, refracted green. They
      // were all one colour first, which read as a single bent line and left the
      // scene test unable to tell which stroke was which.
      const L = 0.9;
      arrow(ctx, v.X(-L * Math.sin(t1)), v.Y(L * Math.cos(t1)), v.X(0), v.Y(0), css("--amber"), 2.5);
      // The reflected ray is always there, and carries everything once TIR sets in.
      arrow(ctx, v.X(0), v.Y(0), v.X(L * Math.sin(t1)), v.Y(L * Math.cos(t1)),
            css("--red"), tir ? 2.8 : 1.4);
      if (!tir) {
        arrow(ctx, v.X(0), v.Y(0), v.X(L * Math.sin(t2)), v.Y(-L * Math.cos(t2)),
              css("--green"), 2.5);
      }

      label(ctx, `θ₁ ${p.theta}°`, v.X(-0.32 * Math.sin(t1)) - 6, v.Y(0.42 * Math.cos(t1)),
            css("--ink"), "right", 11);
      label(ctx, `n₁ ${fmt(p.n1)}`, v.X(-0.97), v.Y(0) - 8, css("--ink-faint"), "left", 11);
      label(ctx, `n₂ ${fmt(p.n2)}`, v.X(-0.97), v.Y(0) + 16, css("--ink-faint"), "left", 11);
      if (tir) {
        // Centred and terse: left-aligned from the normal, the full sentence ran
        // off the right edge of a 303px canvas on a phone. The readout below
        // carries the detail.
        label(ctx, "no refracted ray — TIR",
              v.X(0), v.Y(-0.62), css("--red"), "center", 12);
      } else {
        label(ctx, `θ₂ ${fmt(t2 * 180 / Math.PI, 1)}°`, v.X(0.34 * Math.sin(t2)) + 8,
              v.Y(-0.44 * Math.cos(t2)), css("--ink"), "left", 11);
      }

      return [
        ["refraction angle θ₂", tir ? "none" : `${fmt(t2 * 180 / Math.PI, 1)}°`],
        ["sin θ₂ would need to be", fmt(s2, 3)],
        ["critical angle", isFinite(crit) ? `${fmt(crit * 180 / Math.PI, 1)}°`
                                         : "none (n₁ < n₂)"],
        ["speed below", `${fmt(2.998e8 / p.n2)} m/s`],
      ];
    },

    /* Three ideal polarisers. Two things a reader gets wrong and a slider does
       not: unpolarised light loses exactly half at the first sheet whatever its
       angle, and a third sheet between two crossed ones lets light through again.
       The middle sheet has no on/off control because it needs none — sheet A is
       vertical, so setting B to 0° is physically the same as removing it. */
    polarisers(ctx, p) {
      const rad = Math.PI / 180;
      const a = 0, b = p.angleB, c = p.angleC;
      const iA = 0.5;
      const iB = iA * Math.pow(Math.cos((b - a) * rad), 2);
      const iC = iB * Math.pow(Math.cos((c - b) * rad), 2);

      const v = view(ctx, { xmin: -1.15, xmax: 1.15, ymin: -0.62, ymax: 0.62, pad: 20 });
      const sheets = [[-0.55, a, "A", iA], [0, b, "B", iB], [0.55, c, "C", iC]];

      // The beam, dimming at each sheet. Thickness carries the intensity too, so
      // the reading does not rest on colour alone.
      let prev = 1, x0 = -1.1;
      for (const [x, , , after] of sheets) {
        const w = Math.max(1, 13 * Math.sqrt(prev));
        line(ctx, v.X(x0), v.Y(0), v.X(x - 0.1), v.Y(0), css("--amber"), w);
        prev = after; x0 = x + 0.1;
      }
      line(ctx, v.X(x0), v.Y(0), v.X(1.1), v.Y(0), css("--amber"), Math.max(1, 13 * Math.sqrt(prev)));

      for (const [x, ang, name, after] of sheets) {
        const rx = 15, ry = 46;
        ctx.save();
        ctx.translate(v.X(x), v.Y(0));
        ctx.strokeStyle = css("--accent");
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
        // The transmission axis, clipped to the rim of the sheet it belongs to.
        const t = ang * rad;
        const reach = 0.92 / Math.hypot(Math.sin(t) / rx, Math.cos(t) / ry);
        ctx.rotate(t);
        ctx.strokeStyle = css("--green");
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(0, -reach); ctx.lineTo(0, reach); ctx.stroke();
        ctx.restore();
        label(ctx, name, v.X(x), v.Y(0) - ry - 10, css("--ink"), "center", 12);
        label(ctx, `${ang}°`, v.X(x), v.Y(0) + ry + 16, css("--ink-faint"), "center", 11);
        label(ctx, `${fmt(after * 100, 1)}%`, v.X(x), v.Y(0) + ry + 31, css("--ink-faint"), "center", 11);
      }
      label(ctx, "unpolarised", v.X(-1.1), v.Y(0) - 22, css("--ink-faint"), "left", 11);
      if (iC < 0.001) {
        label(ctx, "extinguished", v.X(1.1), v.Y(0) - 22, css("--red"), "right", 11);
      }

      return [
        ["after sheet A", `${fmt(iA * 100, 1)}% of I₀`],
        ["after sheet B", `${fmt(iB * 100, 1)}% of I₀`],
        ["after sheet C", `${fmt(iC * 100, 1)}% of I₀`],
        ["angle B to C", `${fmt(Math.abs(c - b), 0)}°`],
      ];
    },

    /* ---------- linear algebra ---------------------------------------------
       All three of these draw in the plane, because the plane is where a
       student can still see what the arithmetic did. Everything they show
       generalises to ℝⁿ, and the readouts are written so the numbers, not the
       picture, carry the lesson. */

    /* What c·v + d·w can reach — the span question, before it has that name.
       The whole point is the degenerate case: when w is a multiple of v every
       combination collapses onto one line, and no choice of c and d escapes it.
       The cross term v₁w₂ − v₂w₁ is what decides, and it is worth meeting here
       (as "are these parallel?") long before it is called a determinant. */
    linComb(ctx, p) {
      const v = [p.v1, p.v2], w = [p.w1, p.w2], c = p.c, d = p.d;
      const cv = [c * v[0], c * v[1]], dw = [d * w[0], d * w[1]];
      const sum = [cv[0] + dw[0], cv[1] + dw[1]];
      const cross = v[0] * w[1] - v[1] * w[0];      // zero ⟺ v ∥ w
      const parallel = Math.abs(cross) < 1e-9;
      const xs = [0, v[0], w[0], cv[0], dw[0], sum[0]];
      const ys = [0, v[1], w[1], cv[1], dw[1], sum[1]];
      const span = Math.max(3, ...xs.map(Math.abs), ...ys.map(Math.abs)) * 1.15;
      const vw = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span });
      grid(ctx, vw, -span, span, -span, span);
      const X = vw.X, Y = vw.Y;
      /* The reachable set, drawn first so the arrows sit on top of it: a line
         when the two directions secretly agree, otherwise the whole plane
         (shown as the two directions' own lines, which is as much of "every
         point" as a picture can honestly claim). */
      const far = span * 3;
      const ray = (u, colour) => {
        const n = Math.hypot(u[0], u[1]) || 1;
        line(ctx, X(-far * u[0] / n), Y(-far * u[1] / n),
                  X(far * u[0] / n), Y(far * u[1] / n), colour, 1, [3, 4]);
      };
      if (parallel) ray(Math.hypot(v[0], v[1]) ? v : w, css("--red"));
      else { ray(v, css("--line")); ray(w, css("--line")); }
      // c·v and d·w drawn tip-to-tail, so the sum is visibly "do this, then that"
      line(ctx, X(0), Y(0), X(cv[0]), Y(cv[1]), css("--accent"), 1.5, [4, 4]);
      line(ctx, X(cv[0]), Y(cv[1]), X(sum[0]), Y(sum[1]), css("--green"), 1.5, [4, 4]);
      /* Labels sit beside the middle of their own arrow, not at its tip: with
         short vectors every tip crowds the origin, and "v" and "w" landed on
         top of each other on a 375px screen. */
      const tag = (u, text, colour) => {
        const n = Math.hypot(u[0], u[1]) || 1;
        label(ctx, text, X(u[0] * 0.55) - 9 * u[1] / n, Y(u[1] * 0.55) - 9 * u[0] / n,
              colour, "center", 12);
      };
      arrow(ctx, X(0), Y(0), X(v[0]), Y(v[1]), css("--accent"));
      tag(v, "v", css("--accent"));
      arrow(ctx, X(0), Y(0), X(w[0]), Y(w[1]), css("--green"));
      tag(w, "w", css("--green"));
      arrow(ctx, X(0), Y(0), X(sum[0]), Y(sum[1]), css("--red"), 3);
      dot(ctx, vw, sum[0], sum[1], css("--red"));
      label(ctx, "cv + dw", X(sum[0]) + 8, Y(sum[1]) + 14, css("--red"), "left", 12);
      return [
        ["c·v", `(${fmt(cv[0], 0)}, ${fmt(cv[1], 0)})`],
        ["d·w", `(${fmt(dw[0], 0)}, ${fmt(dw[1], 0)})`],
        ["cv + dw", `(${fmt(sum[0], 0)}, ${fmt(sum[1], 0)})`],
        ["v₁w₂ − v₂w₁", `${fmt(cross, 0)}`],
        ["what they reach", parallel ? "one line only" : "the whole plane"],
      ];
    },

    /* The dot product as one number carrying both length and angle. The
       readouts are laid out in the order the exam works in: components →
       dot product → lengths → cos θ → θ, with the perpendicular verdict last,
       so a student can see which step went wrong rather than only that the
       angle is off. */
    dotAngle(ctx, p) {
      const v = [p.v1, p.v2], w = [p.w1, p.w2];
      const dotP = v[0] * w[0] + v[1] * w[1];
      const nv = Math.hypot(v[0], v[1]), nw = Math.hypot(w[0], w[1]);
      const cos = nv && nw ? dotP / (nv * nw) : NaN;
      /* clamp: (v·w)/(‖v‖‖w‖) can land at 1.0000000000000002 in floating point,
         and acos of that is NaN — a readout of "NaN°" for two identical vectors
         is the first thing a student would meet. */
      const theta = Number.isFinite(cos)
        ? Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI : NaN;
      const perp = nv > 0 && nw > 0 && Math.abs(dotP) < 1e-9;
      const span = Math.max(2, nv, nw) * 1.3;
      const vw = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span });
      grid(ctx, vw, -span, span, -span, span);
      const X = vw.X, Y = vw.Y;
      arrow(ctx, X(0), Y(0), X(v[0]), Y(v[1]), css("--accent"));
      label(ctx, "v", X(v[0]) + 7, Y(v[1]) - 4, css("--accent"), "left", 12);
      arrow(ctx, X(0), Y(0), X(w[0]), Y(w[1]), css("--green"));
      label(ctx, "w", X(w[0]) + 7, Y(w[1]) - 4, css("--green"), "left", 12);
      // the angle itself, drawn as an arc between the two arrows
      if (nv > 0 && nw > 0) {
        const a1 = Math.atan2(v[1], v[0]), a2 = Math.atan2(w[1], w[0]);
        let delta = a2 - a1;
        while (delta > Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;
        ctx.save();
        ctx.strokeStyle = perp ? css("--red") : css("--ink-faint");
        ctx.lineWidth = perp ? 2 : 1.4;
        ctx.beginPath();
        ctx.arc(X(0), Y(0), 30, -a1, -(a1 + delta), delta > 0);
        ctx.stroke();
        ctx.restore();
        label(ctx, perp ? "90°" : `${fmt(theta, 0)}°`,
          X(0) + 40 * Math.cos(a1 + delta / 2), Y(0) - 40 * Math.sin(a1 + delta / 2),
          perp ? css("--red") : css("--ink-faint"), "center", 11);
      }
      return [
        ["v · w", `${fmt(dotP, 0)}`],
        ["‖v‖", `${fmt(nv)}`],
        ["‖w‖", `${fmt(nw)}`],
        ["cos θ", Number.isFinite(cos) ? `${fmt(cos, 3)}` : "undefined"],
        ["θ", Number.isFinite(theta) ? `${fmt(theta, 1)}°` : "undefined"],
        /* The zero vector has no direction, so it is neither perpendicular nor
           at any angle at all — v · w = 0 there for the trivial reason, not the
           geometric one. Reporting "angle over 90°" would teach exactly the
           confusion the perpendicularity questions exist to catch. */
        ["verdict", nv === 0 || nw === 0
          ? "undefined — the zero vector has no direction"
          : perp ? "perpendicular (v · w = 0)"
          : dotP > 0 ? "angle under 90°" : "angle over 90°"],
      ];
    },

    /* Ax computed both ways at once: the columns of A scaled by x's entries and
       added (the definition), and each row of A dotted against x (the way it is
       actually computed by hand). The two readouts must always agree — that
       agreement is the theorem, and seeing it hold while the sliders move is
       worth more than reading that it does. */
    matVec(ctx, p) {
      const a1 = [p.a11, p.a21], a2 = [p.a12, p.a22], x = [p.x1, p.x2];
      const s1 = [x[0] * a1[0], x[0] * a1[1]], s2 = [x[1] * a2[0], x[1] * a2[1]];
      const out = [s1[0] + s2[0], s1[1] + s2[1]];
      const row1 = p.a11 * x[0] + p.a12 * x[1];
      const row2 = p.a21 * x[0] + p.a22 * x[1];
      const xs = [0, a1[0], a2[0], s1[0], out[0]], ys = [0, a1[1], a2[1], s1[1], out[1]];
      const span = Math.max(3, ...xs.map(Math.abs), ...ys.map(Math.abs)) * 1.15;
      const vw = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span });
      grid(ctx, vw, -span, span, -span, span);
      const X = vw.X, Y = vw.Y;
      // the columns themselves, thin: they are the fixed directions being mixed
      arrow(ctx, X(0), Y(0), X(a1[0]), Y(a1[1]), css("--accent"), 1.8);
      label(ctx, "a₁", X(a1[0]) + 7, Y(a1[1]) - 4, css("--accent"), "left", 11);
      arrow(ctx, X(0), Y(0), X(a2[0]), Y(a2[1]), css("--green"), 1.8);
      label(ctx, "a₂", X(a2[0]) + 7, Y(a2[1]) - 4, css("--green"), "left", 11);
      // x₁a₁ then x₂a₂, tip to tail
      line(ctx, X(0), Y(0), X(s1[0]), Y(s1[1]), css("--accent"), 2.2, [5, 4]);
      line(ctx, X(s1[0]), Y(s1[1]), X(out[0]), Y(out[1]), css("--green"), 2.2, [5, 4]);
      arrow(ctx, X(0), Y(0), X(out[0]), Y(out[1]), css("--red"), 3);
      dot(ctx, vw, out[0], out[1], css("--red"));
      label(ctx, "Ax", X(out[0]) + 8, Y(out[1]) + 14, css("--red"), "left", 12);
      return [
        ["x₁a₁", `(${fmt(s1[0], 0)}, ${fmt(s1[1], 0)})`],
        ["x₂a₂", `(${fmt(s2[0], 0)}, ${fmt(s2[1], 0)})`],
        ["Ax by columns", `(${fmt(out[0], 0)}, ${fmt(out[1], 0)})`],
        ["row 1 · x", `${fmt(row1, 0)}`],
        ["row 2 · x", `${fmt(row2, 0)}`],
        /* Compared with a tolerance, not with ===: the two routes multiply the
           same numbers in a different order, and a slider with a fractional
           step would make them differ in the last bit — printing "—" under a
           readout whose whole job is to say they never disagree. */
        ["the two agree",
          (Math.abs(row1 - out[0]) < 1e-9 && Math.abs(row2 - out[1]) < 1e-9)
            ? "yes, always" : "—"],
      ];
    },

    /* The two pictures of Ax = b, drawn at the same time on one canvas: two
       lines looking for a meeting point (left) and two columns being mixed to
       reach b (right). The point of showing them together is that they agree
       about how many solutions there are and disagree about nothing — including
       in the degenerate cases, where the left picture goes parallel at the same
       moment the right one collapses onto a line. */
    rowColPicture(ctx, p) {
      const A = [[p.a11, p.a12], [p.a21, p.a22]], b = [p.b1, p.b2];
      const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      const singular = Math.abs(det) < 1e-9;
      // Cramer, only when it is legal; otherwise the system has no unique answer.
      const x = singular ? null
        : [(b[0] * A[1][1] - A[0][1] * b[1]) / det, (A[0][0] * b[1] - b[0] * A[1][0]) / det];
      /* "Consistent but not unique" is a real third case and it is the one a
         student mis-reads: parallel lines that are the SAME line. b must then be
         a multiple of the columns' shared direction. */
      const consistent = !singular ||
        Math.abs(A[0][0] * b[1] - A[1][0] * b[0]) < 1e-9 &&
        Math.abs(A[0][1] * b[1] - A[1][1] * b[0]) < 1e-9;
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const half = W / 2;
      const span = Math.max(3, ...A.flat().map(Math.abs), ...b.map(Math.abs)) * 1.2;
      const lineC = css("--line"), faint = css("--ink-faint");

      // ---- left: the row picture -------------------------------------------
      const L = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span,
                            pad: 18, box: { x: 0, y: 0, w: half, h: H } });
      grid(ctx, L, -span, span, -span, span);
      // a row a x + b y = c, drawn by walking it to the edges of the window
      const drawRow = (r, c, colour) => {
        const [ax, ay] = r;
        if (Math.abs(ax) < 1e-12 && Math.abs(ay) < 1e-12) return;   // 0 = c: no line
        const pts = [];
        if (Math.abs(ay) > 1e-12) {
          pts.push([-span, (c - ax * -span) / ay], [span, (c - ax * span) / ay]);
        } else {
          pts.push([c / ax, -span], [c / ax, span]);
        }
        line(ctx, L.X(pts[0][0]), L.Y(pts[0][1]), L.X(pts[1][0]), L.Y(pts[1][1]), colour, 2);
      };
      drawRow(A[0], b[0], css("--accent"));
      drawRow(A[1], b[1], css("--green"));
      if (x) dot(ctx, L, x[0], x[1], css("--red"), true, 5);
      label(ctx, "row picture", L.X(0), 14, faint, "center", 11);

      // ---- right: the column picture ---------------------------------------
      const R = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span,
                            pad: 18, box: { x: half, y: 0, w: half, h: H } });
      grid(ctx, R, -span, span, -span, span);
      const c1 = [A[0][0], A[1][0]], c2 = [A[0][1], A[1][1]];
      arrow(ctx, R.X(0), R.Y(0), R.X(c1[0]), R.Y(c1[1]), css("--accent"), 1.8);
      arrow(ctx, R.X(0), R.Y(0), R.X(c2[0]), R.Y(c2[1]), css("--green"), 1.8);
      if (x) {   // the actual mixture that reaches b, drawn tip-to-tail
        const s1 = [x[0] * c1[0], x[0] * c1[1]];
        line(ctx, R.X(0), R.Y(0), R.X(s1[0]), R.Y(s1[1]), css("--accent"), 2, [5, 4]);
        line(ctx, R.X(s1[0]), R.Y(s1[1]), R.X(b[0]), R.Y(b[1]), css("--green"), 2, [5, 4]);
      }
      arrow(ctx, R.X(0), R.Y(0), R.X(b[0]), R.Y(b[1]), css("--red"), 3);
      label(ctx, "b", R.X(b[0]) + 8, R.Y(b[1]) - 4, css("--red"), "left", 12);
      label(ctx, "column picture", R.X(0), 14, faint, "center", 11);
      line(ctx, half, 8, half, H - 8, lineC, 1, [3, 5]);

      return [
        ["det A", `${fmt(det, 0)}`],
        ["rows", singular ? "parallel lines" : "two lines crossing"],
        ["columns", singular ? "both on one line" : "two directions"],
        ["solutions", singular ? (consistent ? "infinitely many" : "none") : "exactly one"],
        ["x", x ? `(${fmt(x[0])}, ${fmt(x[1])})` : "—"],
      ];
    },

    /* Forward elimination, one step at a time. The slider is the step number, so
       a reader can stop between two steps and read off the multiplier that is
       about to be used — which is the number this course's own mistake list says
       students lose marks on, and the number that later becomes an entry of L. */
    elimSteps(ctx, p) {
      const M = [[p.a11, p.a12, p.a13], [p.a21, p.a22, p.a23], [p.a31, p.a32, p.a33]]
        .map(r => r.slice());
      const step = Math.round(p.step);
      // The three clearing steps, in the order elimination performs them.
      const order = [[1, 0], [2, 0], [2, 1]];
      const L = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      let done = 0, current = null, zeroPivot = false;
      for (let k = 0; k < order.length && done < step; k++) {
        const [i, j] = order[k];
        const pivot = M[j][j];
        if (Math.abs(pivot) < 1e-12) { zeroPivot = true; break; }
        const mult = M[i][j] / pivot;
        L[i][j] = mult;
        for (let c = 0; c < 3; c++) M[i][c] -= mult * M[j][c];
        done++;
        current = { i, j, mult, pivot };
      }
      // The next step's multiplier, so the reader can predict it before moving on
      let next = null;
      if (done < order.length) {
        const [i, j] = order[done];
        const pivot = M[j][j];
        next = Math.abs(pivot) < 1e-12 ? null : { i, j, pivot, mult: M[i][j] / pivot };
      }
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const cw = Math.min(46, (W - 60) / 4), rh = Math.min(30, (H - 70) / 4);
      const x0 = W / 2 - 1.6 * cw, y0 = 46;
      label(ctx, done === 0 ? "A (no steps taken yet)"
        : done === order.length ? "U — forward elimination complete"
        : `after ${done} step${done > 1 ? "s" : ""}`, W / 2, 22, css("--ink"), "center", 12);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const isPivot = current && r === current.j && c === current.j;
          const justCleared = current && r === current.i && c === current.j;
          const colour = isPivot ? css("--accent") : justCleared ? css("--red") : css("--ink");
          label(ctx, fmt(M[r][c], Number.isInteger(M[r][c]) ? 0 : 2),
                x0 + c * cw + cw / 2, y0 + r * rh + 14, colour, "center", 13);
        }
      }
      // bracket edges, so the block of numbers reads as a matrix
      const bx0 = x0 - 8, bx1 = x0 + 3 * cw + 8, by0 = y0 - 4, by1 = y0 + 3 * rh + 4;
      const brk = css("--ink-faint");
      line(ctx, bx0, by0, bx0, by1, brk, 1.5); line(ctx, bx0, by0, bx0 + 7, by0, brk, 1.5);
      line(ctx, bx0, by1, bx0 + 7, by1, brk, 1.5);
      line(ctx, bx1, by0, bx1, by1, brk, 1.5); line(ctx, bx1, by0, bx1 - 7, by0, brk, 1.5);
      line(ctx, bx1, by1, bx1 - 7, by1, brk, 1.5);
      if (current) {
        label(ctx, `row ${current.i + 1} ← row ${current.i + 1} − (${fmt(current.mult)})·row ${current.j + 1}`,
              W / 2, by1 + 22, css("--ink-soft"), "center", 11);
      }
      if (zeroPivot) {
        label(ctx, "zero pivot — this column needs a row exchange",
              W / 2, by1 + 40, css("--red"), "center", 11);
      }
      const lStr = `[1 0 0; ${fmt(L[1][0])} 1 0; ${fmt(L[2][0])} ${fmt(L[2][1])} 1]`;
      return [
        ["steps taken", `${done} of 3`],
        ["pivot in use", current ? `${fmt(current.pivot)} (row ${current.j + 1})` : "—"],
        ["multiplier used", current ? `${fmt(current.mult)}` : "—"],
        ["next multiplier", next ? `${fmt(next.mult)}` : (zeroPivot ? "blocked: zero pivot" : "—")],
        ["L so far", lStr],
        ["pivots on the diagonal", `${fmt(M[0][0])}, ${fmt(M[1][1])}, ${fmt(M[2][2])}`],
      ];
    },

    /* AB against BA on the same unit square. Order is the thing this course's
       mistake list puts third, and a picture makes the asymmetry impossible to
       argue with — while the determinants stay equal, which is the part students
       do not expect. */
    abVsBa(ctx, p) {
      const A = [[p.a11, p.a12], [p.a21, p.a22]], B = [[p.b11, p.b12], [p.b21, p.b22]];
      const mul = (X, Y) => [
        [X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]],
        [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]],
      ];
      const det = X => X[0][0] * X[1][1] - X[0][1] * X[1][0];
      const AB = mul(A, B), BA = mul(B, A);
      const same = [0, 1].every(i => [0, 1].every(j => Math.abs(AB[i][j] - BA[i][j]) < 1e-9));
      const W = ctx.canvas.clientWidth, H = ctx.canvas.clientHeight;
      const span = Math.max(2, ...AB.flat().map(Math.abs), ...BA.flat().map(Math.abs)) * 1.25;
      const shape = (M, v, colour, name, box) => {
        grid(ctx, v, -span, span, -span, span);
        const c1 = [M[0][0], M[1][0]], c2 = [M[0][1], M[1][1]];
        const pts = [[0, 0], c1, [c1[0] + c2[0], c1[1] + c2[1]], c2];
        ctx.save();
        ctx.beginPath();
        pts.forEach((q, i) => i ? ctx.lineTo(v.X(q[0]), v.Y(q[1])) : ctx.moveTo(v.X(q[0]), v.Y(q[1])));
        ctx.closePath();
        ctx.fillStyle = colour; ctx.globalAlpha = 0.18; ctx.fill();
        ctx.globalAlpha = 1; ctx.strokeStyle = colour; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();
        arrow(ctx, v.X(0), v.Y(0), v.X(c1[0]), v.Y(c1[1]), colour, 1.8);
        arrow(ctx, v.X(0), v.Y(0), v.X(c2[0]), v.Y(c2[1]), colour, 1.8);
        label(ctx, name, box.x + box.w / 2, 14, colour, "center", 12);
      };
      const boxL = { x: 0, y: 0, w: W / 2, h: H }, boxR = { x: W / 2, y: 0, w: W / 2, h: H };
      shape(AB, view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span, pad: 18, box: boxL }),
            css("--accent"), "AB (unit square)", boxL);
      shape(BA, view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span, pad: 18, box: boxR }),
            css("--green"), "BA (unit square)", boxR);
      line(ctx, W / 2, 8, W / 2, H - 8, css("--line"), 1, [3, 5]);
      /* Trace as well as determinant, because for a 2×2 the pair (trace,
         determinant) IS the characteristic polynomial: showing both equal for AB
         and BA is Theorem 47 — same eigenvalues, different matrices — visible in
         the readouts rather than asserted in the text. */
      const tr = X => X[0][0] + X[1][1];
      /* det(AB) and det(BA) stay on their own rows: a module's `watch` text
         quotes readout labels by name, so merging two rows into one silently
         breaks sentences that are already written against them. */
      return [
        ["AB", `[${fmt(AB[0][0], 0)} ${fmt(AB[0][1], 0)}; ${fmt(AB[1][0], 0)} ${fmt(AB[1][1], 0)}]`],
        ["BA", `[${fmt(BA[0][0], 0)} ${fmt(BA[0][1], 0)}; ${fmt(BA[1][0], 0)} ${fmt(BA[1][1], 0)}]`],
        ["AB = BA?", same ? "equal here" : "different"],
        ["det A · det B", `${fmt(det(A) * det(B), 0)}`],
        ["det(AB)", `${fmt(det(AB), 0)}`],
        ["det(BA)", `${fmt(det(BA), 0)}`],
        // trace and determinant together ARE the characteristic polynomial of a
        // 2×2, so equal pairs here mean equal eigenvalues — Theorem 47, visible.
        ["trace(AB)", `${fmt(tr(AB), 0)}`],
        ["trace(BA)", `${fmt(tr(BA), 0)}`],
      ];
    },

    /* The determinant as signed area, and what one row operation does to it.
       `op` picks the operation, `amount` its size: this is the properties list of
       Lesson 3.1 turned into something a reader can watch, including the sign
       flip on a swap, which is the second entry on the course's mistake list. */
    detArea(ctx, p) {
      const A = [[p.a11, p.a12], [p.a21, p.a22]];
      const op = Math.round(p.op), amt = p.amount;
      const det = X => X[0][0] * X[1][1] - X[0][1] * X[1][0];
      const before = det(A);
      let after = A.map(r => r.slice()), name = "no operation";
      if (op === 1) { after = [A[1].slice(), A[0].slice()]; name = "swap the two rows"; }
      else if (op === 2) { after = [A[0].map(v => v * amt), A[1].slice()];
                           name = `multiply row 1 by ${fmt(amt)}`; }
      else if (op === 3) { after = [A[0].map((v, i) => v + amt * A[1][i]), A[1].slice()];
                           name = `add ${fmt(amt)} × row 2 to row 1`; }
      const d2 = det(after);
      const span = Math.max(2, ...A.flat().map(Math.abs), ...after.flat().map(Math.abs)) * 1.25;
      const v = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span });
      grid(ctx, v, -span, span, -span, span);
      /* Rows, not columns: every row operation acts on rows, and det is the area
         of the parallelogram they span (the same number either way, which is
         Theorem 24 — worth knowing but not worth confusing the picture over). */
      const para = (M, colour, dash) => {
        const r1 = M[0], r2 = M[1];
        const pts = [[0, 0], r1, [r1[0] + r2[0], r1[1] + r2[1]], r2];
        ctx.save();
        ctx.beginPath();
        pts.forEach((q, i) => i ? ctx.lineTo(v.X(q[0]), v.Y(q[1])) : ctx.moveTo(v.X(q[0]), v.Y(q[1])));
        ctx.closePath();
        if (!dash) { ctx.fillStyle = colour; ctx.globalAlpha = 0.16; ctx.fill(); ctx.globalAlpha = 1; }
        ctx.strokeStyle = colour; ctx.lineWidth = 2;
        if (dash) ctx.setLineDash([5, 4]);
        ctx.stroke();
        ctx.restore();
      };
      para(A, css("--ink-faint"), true);
      para(after, d2 < 0 ? css("--red") : css("--accent"), false);
      arrow(ctx, v.X(0), v.Y(0), v.X(after[0][0]), v.Y(after[0][1]),
            d2 < 0 ? css("--red") : css("--accent"), 2);
      arrow(ctx, v.X(0), v.Y(0), v.X(after[1][0]), v.Y(after[1][1]), css("--green"), 2);
      label(ctx, name, ctx.canvas.clientWidth / 2, 16, css("--ink-soft"), "center", 11);
      const ratio = Math.abs(before) < 1e-12 ? null : d2 / before;
      return [
        ["det before", `${fmt(before, 0)}`],
        ["det after", `${fmt(d2, 0)}`],
        ["what changed", ratio === null ? "—" : `× ${fmt(ratio)}`],
        ["area (|det|)", `${fmt(Math.abs(d2))}`],
        ["orientation", Math.abs(d2) < 1e-9 ? "flattened: det = 0"
          : d2 > 0 ? "kept" : "reversed (sign flipped)"],
        ["invertible?", Math.abs(d2) < 1e-9 ? "no — singular" : "yes"],
      ];
    },

    /* Three vectors in the plane. Two of them can already reach everything, so
       the third is always dependent — and the readout gives the actual dependence
       relation, which is what "find a maximal independent subset" (Model Test,
       problem 4) is asking you to produce. */
    rankSpan(ctx, p) {
      const v = [p.v1, p.v2], w = [p.w1, p.w2], u = [p.u1, p.u2];
      const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
      const zero = a => Math.hypot(a[0], a[1]) < 1e-12;
      const pair = Math.abs(cross(v, w)) > 1e-9;
      const rank = pair ? 2
        : (zero(v) && zero(w) && zero(u)) ? 0
        : (Math.abs(cross(v, u)) > 1e-9 || Math.abs(cross(w, u)) > 1e-9) ? 2 : 1;
      /* u = αv + βw whenever v and w are independent — solved by Cramer, which is
         exactly how a special solution is read off in Lesson 4.4a. */
      const D = cross(v, w);
      const alpha = pair ? cross(u, w) / D : null;
      const beta = pair ? cross(v, u) / D : null;
      /* When v and w are collinear and both nonzero, w = k·v — that is the
         dependence the panel should name, and it is the only one available. */
      const wOverV = !pair && !zero(v)
        ? (w[0] * v[0] + w[1] * v[1]) / (v[0] * v[0] + v[1] * v[1]) : null;
      const span = Math.max(2, ...[v, w, u].flat().map(Math.abs)) * 1.3;
      const vw = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span });
      grid(ctx, vw, -span, span, -span, span);
      const far = span * 3;
      if (!pair && !zero(v)) {         // everything is trapped on one line
        const n = Math.hypot(v[0], v[1]);
        line(ctx, vw.X(-far * v[0] / n), vw.Y(-far * v[1] / n),
                  vw.X(far * v[0] / n), vw.Y(far * v[1] / n), css("--red"), 1, [3, 4]);
      }
      arrow(ctx, vw.X(0), vw.Y(0), vw.X(v[0]), vw.Y(v[1]), css("--accent"));
      label(ctx, "v", vw.X(v[0]) + 7, vw.Y(v[1]) - 4, css("--accent"), "left", 12);
      arrow(ctx, vw.X(0), vw.Y(0), vw.X(w[0]), vw.Y(w[1]), css("--green"));
      label(ctx, "w", vw.X(w[0]) + 7, vw.Y(w[1]) - 4, css("--green"), "left", 12);
      arrow(ctx, vw.X(0), vw.Y(0), vw.X(u[0]), vw.Y(u[1]), css("--red"), 3);
      label(ctx, "u", vw.X(u[0]) + 7, vw.Y(u[1]) - 4, css("--red"), "left", 12);
      if (pair) {                       // u drawn as its own combination of v and w
        const av = [alpha * v[0], alpha * v[1]];
        line(ctx, vw.X(0), vw.Y(0), vw.X(av[0]), vw.Y(av[1]), css("--accent"), 1.5, [4, 4]);
        line(ctx, vw.X(av[0]), vw.Y(av[1]), vw.X(u[0]), vw.Y(u[1]), css("--green"), 1.5, [4, 4]);
      }
      return [
        ["rank of [v w u]", `${rank}`],
        ["v, w independent?", pair ? "yes" : "no — same line"],
        ["u as a combination", pair ? `${fmt(alpha)}·v + ${fmt(beta)}·w` : "—"],
        /* Three vectors in the plane are always dependent, so this row always has
           something true to say — but only the v,w-independent case was ever
           computed. When v and w are collinear the row printed "every pair is
           dependent" beside a rank of 2, which is false and reachable from the
           trainer's own second challenge (v=(1,2), w=(2,4), u=(5,5)). The
           relation is now read off whichever pair is actually dependent. */
        ["dependence relation", pair
          ? `${fmt(alpha)}·v + ${fmt(beta)}·w − u = 0`
          : rank === 0 ? "all three are 0, so any coefficients at all"
          : !zero(v) && !zero(w) ? `${fmt(wOverV)}·v − w = 0`
          : zero(v) ? "1·v = 0 — v is the zero vector"
          : "1·w = 0 — w is the zero vector"],
        ["maximal independent subset", rank === 2 ? "any 2 that are not parallel"
          : rank === 1 ? "any single nonzero vector" : "empty"],
        ["free variables in Ax = 0", `${3 - rank}`],
      ];
    },

    /* The solution set of Ax = b drawn in the plane of the UNKNOWNS, which is
       the picture the complete-solution method is about and the one no other
       scene shows: a point when A is invertible, a whole line x_p + t·s when it
       is singular and b is consistent, and nothing at all when it is not. The
       three cases are one slider apart, which is what makes "how many solutions"
       stop being a memorised table. */
    solutionSet(ctx, p) {
      const A = [[p.a11, p.a12], [p.a21, p.a22]], b = [p.b1, p.b2];
      const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      const singular = Math.abs(det) < 1e-9;
      const rank = singular
        ? (A.flat().every(v => Math.abs(v) < 1e-12) ? 0 : 1)
        : 2;
      const free = 2 - rank;
      let particular = null, nullDir = null, verdict;
      if (!singular) {
        particular = [(b[0] * A[1][1] - A[0][1] * b[1]) / det,
                      (A[0][0] * b[1] - b[0] * A[1][0]) / det];
        verdict = "exactly one";
      } else if (rank === 1) {
        // one independent row; take it, and read the nullspace direction off it
        const r = Math.hypot(A[0][0], A[0][1]) > 1e-12 ? A[0] : A[1];
        const rhs = Math.hypot(A[0][0], A[0][1]) > 1e-12 ? b[0] : b[1];
        const other = r === A[0] ? A[1] : A[0], orhs = r === A[0] ? b[1] : b[0];
        /* Consistency: the dependent row must carry the same multiple of the
           right-hand side that it carries of the row. This is the check Final
           2024 III.1 turns into "find the c that makes it consistent". */
        const k = Math.abs(r[0]) > 1e-12 ? other[0] / r[0]
                : Math.abs(r[1]) > 1e-12 ? other[1] / r[1] : 0;
        const consistent = Math.abs(orhs - k * rhs) < 1e-9;
        nullDir = [-r[1], r[0]];                       // r · nullDir = 0
        if (consistent) {
          const n2 = r[0] * r[0] + r[1] * r[1];
          particular = [r[0] * rhs / n2, r[1] * rhs / n2];   // the shortest one
          verdict = "a whole line";
        } else {
          verdict = "none";
        }
      } else {
        /* A = 0. Its nullspace is the whole plane, not a line and certainly not
           {0}: with b = 0 every x solves it, with b ≠ 0 none does. Both used to
           be described by rows written for the rank-1 case — a single nullspace
           "direction" of (1,0) beside "free variables 2", and "only 0" beside
           the same 2. The readouts below special-case it instead. */
        verdict = b.every(v => Math.abs(v) < 1e-9) ? "every x in the plane" : "none";
        if (verdict !== "none") particular = [0, 0];
      }
      const span = Math.max(3, ...(particular || [0, 0]).map(Math.abs), ...b.map(Math.abs)) * 1.3;
      const v = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span });
      grid(ctx, v, -span, span, -span, span);
      label(ctx, "the plane of (x₁, x₂)", ctx.canvas.clientWidth / 2, 14,
            css("--ink-faint"), "center", 11);
      if (particular && nullDir) {
        const n = Math.hypot(nullDir[0], nullDir[1]) || 1;
        const far = span * 3;
        line(ctx, v.X(particular[0] - far * nullDir[0] / n), v.Y(particular[1] - far * nullDir[1] / n),
                  v.X(particular[0] + far * nullDir[0] / n), v.Y(particular[1] + far * nullDir[1] / n),
                  css("--green"), 2.4);
        // the nullspace itself, through the origin — the line the solutions are a shift of
        line(ctx, v.X(-far * nullDir[0] / n), v.Y(-far * nullDir[1] / n),
                  v.X(far * nullDir[0] / n), v.Y(far * nullDir[1] / n), css("--line"), 1.4, [4, 4]);
        arrow(ctx, v.X(0), v.Y(0), v.X(particular[0]), v.Y(particular[1]), css("--accent"), 2.4);
        /* The two labels sit on the same point unless they are pushed apart: xₚ
           goes on the far side of its own arrow, the set's name goes well along
           the line. They overlapped exactly at the default parameters. */
        const away = Math.hypot(particular[0], particular[1]) || 1;
        label(ctx, "xₚ", v.X(particular[0]) - 14 * particular[0] / away,
              v.Y(particular[1]) - 14 * particular[1] / away + 4, css("--accent"), "center", 12);
        const along = span * 0.55;
        label(ctx, "xₚ + N(A)", v.X(particular[0] + along * nullDir[0] / n),
              v.Y(particular[1] + along * nullDir[1] / n) - 8, css("--green"), "center", 11);
      } else if (particular) {
        dot(ctx, v, particular[0], particular[1], css("--red"), true, 5.5);
        label(ctx, "the only solution", v.X(particular[0]) + 10, v.Y(particular[1]) - 6,
              css("--red"), "left", 12);
      } else {
        label(ctx, "no x satisfies both rows", ctx.canvas.clientWidth / 2,
              ctx.canvas.clientHeight / 2, css("--red"), "center", 13);
      }
      return [
        ["rank r", `${rank}`],
        ["free variables (n − r)", `${free}`],
        ["solutions", verdict],
        ["particular xₚ", particular ? `(${fmt(particular[0])}, ${fmt(particular[1])})` : "—"],
        ["nullspace direction", rank === 0 ? "every direction — N(A) is the whole plane"
          : nullDir ? `(${fmt(nullDir[0], 0)}, ${fmt(nullDir[1], 0)})` : "only 0"],
        ["complete solution", rank === 0
            ? (particular ? "every x — two free parameters" : "the set is empty")
          : particular && nullDir ? "xₚ + t·s, one free t"
          : particular ? "xₚ alone" : "the set is empty"],
      ];
    },

    /* Turn v around the circle and watch Av follow. At an eigenvector the two
       arrows line up, and the readout names λ — which is the definition doing its
       own work, before the characteristic polynomial appears. */
    eigenVectors(ctx, p) {
      const A = [[p.a11, p.a12], [p.a21, p.a22]];
      const t = p.theta * Math.PI / 180;
      const v = [Math.cos(t), Math.sin(t)];
      const Av = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
      const crossVal = v[0] * Av[1] - v[1] * Av[0];
      /* Av = 0 is the eigenvector equation with λ = 0, not a degenerate case to
         exclude: v spans the nullspace of a singular A. Guarding it away made
         the readout answer "no" on a direction the scene was simultaneously
         drawing as an eigendirection. */
      const parallel = Math.abs(crossVal) < 5e-3;
      const lambda = parallel ? (v[0] * Av[0] + v[1] * Av[1]) : null;   // v is a unit vector
      const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      const disc = tr * tr - 4 * det;
      const roots = disc >= 0
        ? [(tr + Math.sqrt(disc)) / 2, (tr - Math.sqrt(disc)) / 2] : null;
      const span = Math.max(1.6, Math.hypot(...Av)) * 1.3;
      const vw = view(ctx, { xmin: -span, xmax: span, ymin: -span, ymax: span });
      grid(ctx, vw, -span, span, -span, span);
      // the unit circle v runs around
      ctx.save();
      ctx.strokeStyle = css("--line"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(vw.X(0), vw.Y(0), vw.s, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      /* The eigenvector directions themselves, when they are real: drawing them
         turns "hunt for the angle" into "check the two lines the algebra
         predicted", which is the same move the lesson makes. */
      if (roots) {
        for (const lam of roots) {
          // (A − λI)x = 0 → a direction; take whichever row is nonzero
          const r1 = [A[0][0] - lam, A[0][1]], r2 = [A[1][0], A[1][1] - lam];
          const d = Math.hypot(r1[0], r1[1]) > 1e-9 ? [-r1[1], r1[0]]
                  : Math.hypot(r2[0], r2[1]) > 1e-9 ? [-r2[1], r2[0]] : null;
          if (!d) continue;
          const n = Math.hypot(d[0], d[1]);
          line(ctx, vw.X(-span * d[0] / n), vw.Y(-span * d[1] / n),
                    vw.X(span * d[0] / n), vw.Y(span * d[1] / n), css("--amber"), 1, [4, 4]);
        }
      }
      arrow(ctx, vw.X(0), vw.Y(0), vw.X(v[0]), vw.Y(v[1]), css("--accent"));
      label(ctx, "v", vw.X(v[0]) + 8, vw.Y(v[1]) - 4, css("--accent"), "left", 12);
      arrow(ctx, vw.X(0), vw.Y(0), vw.X(Av[0]), vw.Y(Av[1]),
            parallel ? css("--red") : css("--green"), 3);
      label(ctx, "Av", vw.X(Av[0]) + 8, vw.Y(Av[1]) - 4,
            parallel ? css("--red") : css("--green"), "left", 12);
      if (parallel) {
        label(ctx, `eigenvector · λ = ${fmt(lambda)}`, ctx.canvas.clientWidth / 2, 16,
              css("--red"), "center", 12);
      }
      return [
        ["v", `(${fmt(v[0])}, ${fmt(v[1])})`],
        ["Av", `(${fmt(Av[0])}, ${fmt(Av[1])})`],
        ["Av parallel to v?", parallel ? "yes — this is an eigenvector" : "no"],
        ["λ here", parallel ? `${fmt(lambda)}` : "—"],
        ["trace, det", `${fmt(tr, 0)}, ${fmt(det, 0)}`],
        ["eigenvalues of A", roots ? `${fmt(roots[0])}, ${fmt(roots[1])}` : "complex pair"],
      ];
    },
  };

  /* ---------- rendering ---------------------------------------------------- */
  function paint(canvas, sim, values) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    /* A canvas can be measured before layout has given it a size, and a view
       built on a zero width has a negative scale — which reaches ctx.arc as a
       negative radius and throws. The throw used to happen inside render(),
       before the ResizeObserver below was attached, so the card never repainted
       and the trainer stayed blank for good. Nothing can usefully be drawn in
       zero pixels, so wait for the observer to call again. */
    if (!(w > 0 && h > 0)) return [];
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const scene = SCENES[sim.type];
    if (!scene) { label(ctx, `unknown scene "${sim.type}"`, 12, 20, css("--red")); return []; }
    return scene(ctx, values) || [];
  }

  /* Two kinds of control. A slider is for a quantity being pushed towards a
     limit — h → 0, n → ∞ — which is most of what a trainer does. A `choice` is
     for a parameter with no in-between: the left, right and midpoint rules are
     three rules, not three points on a scale, and a slider reading "1" where
     the student has to read "right edge" mislabels the very thing being taught.
     Values stay numeric so a challenge can check one the same way it checks a
     slider. */
  function controls(sim, values) {
    return sim.params.map(prm => {
      if (prm.type === "choice") {
        const opts = Array.isArray(prm.options) ? prm.options : [];
        return `
      <div class="sim-ctl sim-ctl-choice" role="group" aria-label="${esc(prm.label)}">
        <span class="sim-ctl-label">${esc(prm.label)}</span>
        <div class="sim-choice" id="sim-${esc(sim.id)}-${esc(prm.key)}">
          ${opts.map(o => `<button type="button" data-value="${numAttr(o.value)}"
                  class="${Number(o.value) === Number(values[prm.key]) ? "active" : ""}"
                  aria-pressed="${Number(o.value) === Number(values[prm.key])}"
            >${esc(o.label)}</button>`).join("")}
        </div>
      </div>`;
      }
      return `
      <label class="sim-ctl">
        <span class="sim-ctl-label">${esc(prm.label)}</span>
        <output id="out-${esc(sim.id)}-${esc(prm.key)}">${values[prm.key]}${esc(prm.unit || "")}</output>
        <input type="range" id="sim-${esc(sim.id)}-${esc(prm.key)}"
               min="${numAttr(prm.min)}" max="${numAttr(prm.max, 1)}"
               step="${numAttr(prm.step ?? 1, 1)}"
               value="${numAttr(values[prm.key])}" aria-label="${esc(prm.label)}">
      </label>`;
    }).join("");
  }

  /* A challenge is the only part of a trainer that can be got wrong, which is
     why it is also the part that is paid for: "set the angle that maximises the
     range" is a question; a slider is not. */
  /* `check` is one {param, target, tol}, or an array of them when the prompt
     asks for several sliders at once. A prompt that sets four sliders and is
     graded on one is worse than no grading: the tick appears, the explanation
     opens, and it describes a screen the student is not looking at. Every
     clause has to hold. */
  function challengeState(sim, values) {
    const holds = c => Math.abs(values[c.param] - c.target) <= (c.tol ?? 1);
    return (sim.challenges || []).map(c =>
      Array.isArray(c.check) ? c.check.every(holds) : holds(c.check));
  }

  function render(host, sim) {
    const values = {};
    for (const prm of sim.params) {
      values[prm.key] = prm.type === "choice"
        ? Number(prm.value ?? (prm.options || [{}])[0].value ?? 0)
        : prm.value ?? prm.min;
    }

    host.innerHTML = `
      <section class="sim-card" id="sim-card-${esc(sim.id)}">
        <h3 class="sim-title">${esc(sim.title)}</h3>
        ${sim.intro ? `<p class="sim-intro">${prose(sim.intro)}</p>` : ""}
        <div class="sim-stage"><canvas class="sim-canvas" aria-label="${esc(sim.title)} diagram"></canvas></div>
        <div class="sim-controls">${controls(sim, values)}</div>
        <dl class="sim-readouts"></dl>
        ${(sim.watch || []).length ? `<ul class="sim-watch">${sim.watch.map(w => `<li>${prose(w)}</li>`).join("")}</ul>` : ""}
        ${(sim.challenges || []).length ? `<div class="sim-challenges">${
          sim.challenges.map((c, i) => `<div class="sim-challenge" data-i="${i}">
            <span class="sim-chal-mark" aria-hidden="true">○</span>
            <div><p class="sim-chal-prompt">${prose(c.prompt)}</p>
            <p class="sim-chal-explain" hidden>${prose(c.explain || "")}</p></div>
          </div>`).join("")}</div>` : ""}
        ${sim.review ? `<p class="sim-review">Re-read <a href="#/${esc(sim.module)}/learn" data-review="${esc(sim.review)}">§${esc(sim.review)}</a></p>` : ""}
      </section>`;

    const canvas = $(".sim-canvas", host);
    const dl = $(".sim-readouts", host);

    function refresh() {
      const readouts = paint(canvas, sim, values);
      dl.innerHTML = readouts.map(([k, v]) =>
        `<div class="sim-ro"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
      const done = challengeState(sim, values);
      host.querySelectorAll(".sim-challenge").forEach((el, i) => {
        el.classList.toggle("done", !!done[i]);
        const mark = $(".sim-chal-mark", el), exp = $(".sim-chal-explain", el);
        if (mark) mark.textContent = done[i] ? "✓" : "○";
        if (exp) exp.hidden = !done[i];
      });
    }

    for (const prm of sim.params) {
      const el = $(`#sim-${CSS.escape(sim.id)}-${CSS.escape(prm.key)}`, host);
      if (!el) continue;
      if (prm.type === "choice") {
        el.addEventListener("click", ev => {
          const btn = ev.target.closest("button[data-value]");
          if (!btn) return;
          values[prm.key] = Number(btn.dataset.value);
          el.querySelectorAll("button").forEach(b => {
            const on = b === btn;
            b.classList.toggle("active", on);
            b.setAttribute("aria-pressed", String(on));
          });
          refresh();
        });
        continue;
      }
      const out = $(`#out-${CSS.escape(sim.id)}-${CSS.escape(prm.key)}`, host);
      el.addEventListener("input", () => {
        values[prm.key] = clamp(parseFloat(el.value), prm.min, prm.max);
        if (out) out.textContent = `${values[prm.key]}${prm.unit || ""}`;
        refresh();
      });
    }

    // A canvas sized by CSS has no intrinsic pixels until layout has happened,
    // and it has to be repainted whenever the box changes — rotating a phone is
    // the ordinary case, and the first paint of a hidden tab is the sneaky one.
    const ro = new ResizeObserver(() => refresh());
    ro.observe(canvas);
    refresh();
    return () => ro.disconnect();
  }

  /* `scenes` is exported so the numbers a scene reports can be tested without a
     browser — tools/sims-scenes.test.mjs runs every one of them against a stub
     canvas. A trainer that prints a wrong readout teaches a wrong fact with more
     authority than prose does, and no gate reads these numbers. */
  /* challengeState is exported for the gate, not for the page: grading is the
     one part of a trainer a student can be told they got right, so it needs a
     test that runs on every commit like the scenes have. */
  return { render, types: () => Object.keys(SCENES), scenes: SCENES, challengeState };
})();
