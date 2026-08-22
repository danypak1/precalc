# Module 01 — one-page summary

Everything examinable from Equations and Inequalities. The midterm draws Q3
(eighteen equations), Q4 (complex numbers) and Q5 (five inequalities) from this
chapter alone; the model final draws nothing from it.

## Which machine is this?

| It looks like | It is | The step you cannot skip |
|---|---|---|
| $ax+b=cx+d$ | linear (§1.1) | — |
| variable in a denominator | rational (§1.1, §1.6) | write restrictions, then check |
| $x^{2}$ present, nothing higher | quadratic (§1.4) | set equal to zero first |
| degree 3 or more | polynomial (§1.6) | factor by grouping; never divide by the variable |
| bars around an expression | absolute value (§1.6) | isolate the bars, then split into two cases |
| variable under a radical or with a fractional exponent | radical (§1.6) | check every candidate in the original |
| one exponent is twice another | quadratic form (§1.6) | substitute back at the end |
| $<,\ >,\ \leq,\ \geq$ | inequality (§1.7) | flip on a negative multiplier |

## §1.1 Linear and rational

- **Conditional** — some values work. **Identity** — the variable vanishes,
  leaving a true statement; all reals. **Contradiction** — vanishes leaving a
  false statement; no solution.
- Clear fractions by multiplying **every** term by the LCD.
- Rational: factor all denominators → LCD → restrictions → solve → check.
  Multiplying by an expression that can be zero is what creates **extraneous
  solutions**.
- Literal equations: gather the wanted letter, **factor it out**, divide once.

## §1.3 Complex numbers

| Fact | Form |
|---|---|
| the unit | $i=\sqrt{-1}$, $i^{2}=-1$ |
| negative radicand | $\sqrt{-b}=i\sqrt b$ for $b>0$ |
| powers | cycle of 4: $i,-1,-i,1$ — divide the exponent by 4, keep the remainder |
| standard form | $a+bi$; both parts simplified, nothing left under a radical |
| conjugate | $\overline{a+bi}=a-bi$, and $(a+bi)(a-bi)=a^{2}+b^{2}$ (real) |
| division | multiply top and bottom by the conjugate of the bottom |

**The trap:** $\sqrt{-4}\cdot\sqrt{-9}=(2i)(3i)=-6$, not $\sqrt{36}=6$. The rule
$\sqrt a\sqrt b=\sqrt{ab}$ needs $a,b\geq0$.

## §1.4 Quadratics — four methods and a decision

| Method | Use when | Key line |
|---|---|---|
| zero product | it factors on sight | $mn=0\Rightarrow m=0$ or $n=0$ — **set to zero first** |
| square root property | no linear term, or one side is a square | $x^{2}=k\Rightarrow x=\pm\sqrt k$ ($k<0$ is allowed and gives imaginary roots) |
| completing the square | asked for it, or vertex form is wanted later | halve the $x$-coefficient, square it, add to both sides |
| quadratic formula | anything else | $x=\dfrac{-b\pm\sqrt{b^{2}-4ac}}{2a}$ |

**Discriminant** $\Delta=b^{2}-4ac$:

| $\Delta<0$ | $\Delta=0$ | $\Delta>0$ |
|---|---|---|
| 2 nonreal solutions | 2 repeated solutions | 2 distinct real solutions |

A perfect-square $\Delta$ (integer coefficients) means the roots are rational and
the quadratic factors.

## §1.5 Applications

1. Define the variable **with its unit**. 2. Label the figure. 3. Build the
equation. 4. Solve. 5. **Reject the impossible root** — and check whether it
really is impossible: a projectile passes a given height twice.

Vertical motion: $s=-\tfrac12gt^{2}+v_{0}t+s_{0}$, $g=9.8\ \text{m/s}^{2}$.

## §1.6 Absolute value, radical, quadratic form

| Equation | Splits into |
|---|---|
| $\lvert u\rvert=k$, $k>0$ | $u=k$ or $u=-k$ |
| $\lvert u\rvert=0$ | $u=0$ |
| $\lvert u\rvert=-k$, $k>0$ | no solution |
| $\lvert u\rvert=\lvert w\rvert$ | $u=w$ or $u=-w$ — negate the **whole** expression |

Radicals: isolate one radical, raise, repeat if needed, **check**. Rational
exponents: raise to the reciprocal power; an even numerator brings a $\pm$
($(x+1)^{2/3}=9\Rightarrow x+1=\pm27$).

Quadratic form: substitute $u$, solve, **substitute back**. Reject any $u$ the
substitution forbids (e.g. $u=\sqrt t\geq0$).

## §1.7 Inequalities

- Only a **negative multiplier or divisor** flips the symbol.
- Answer in three forms: graph, $\{x\mid\ldots\}$, and interval.
- Square bracket includes, round excludes, **$\infty$ is always round**.
- **and** = intersection = overlap. **or** = union = both pieces, joined by $\cup$.
- Three-part inequalities: do everything to all three parts; flipping flips both
  symbols.

| Inequality ($k>0$) | Equivalent to | Answer shape |
|---|---|---|
| $\lvert u\rvert<k$ | $-k<u<k$ | one interval, between |
| $\lvert u\rvert>k$ | $u<-k$ or $u>k$ | two intervals, outside |
| $\lvert u\rvert<-k$ | — | $\varnothing$ |
| $\lvert u\rvert>-k$ | — | $(-\infty,\infty)$ |

Tolerance problems are always
$\lvert\text{actual}-\text{target}\rvert\leq\text{tolerance}$.

## The eight sentences most likely to appear on the exam

1. Solve the equation — a linear one with fractions, cleared by the LCD.
2. Solve the equation — a rational one whose only candidate is excluded, so the
   answer is "no solution".
3. Perform the indicated operation and write the expression in standard form —
   including $\sqrt{-a}\cdot\sqrt{-b}$, a power of $i$, and a quotient needing a
   conjugate.
4. Solve the equation — a quadratic, by whichever of the four methods is
   cheapest, with exact (not decimal) roots.
5. Solve the equation — an absolute value one, including a case with **no
   solution** and a case of the form $\lvert u\rvert=\lvert w\rvert$.
6. Solve the equation — a radical one where one candidate is extraneous.
7. Solve the equation — one in quadratic form, needing a substitution and a
   substitution back.
8. Solve the inequality. Graph the solution set and write it in set-builder
   notation and in interval notation.

---

> *Independent study guide for a first course in College Algebra and Trigonometry. Every explanation, worked example, practice question and problem is written for this course. Section numbering follows Miller & Gerken, College Algebra and Trigonometry, the textbook the lecture course is taught from; where a question from a past model paper is discussed, it is named where it appears, and no worked example from that textbook is reproduced. Not affiliated with or endorsed by any university, instructor or publisher.*
