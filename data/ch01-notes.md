# Module 01 — Equations and Inequalities

Everything in this chapter ends with the word **solve**. That sounds like one
skill, and the midterm treats it as one question: its Q3 runs from (a) to (r),
eighteen equations under a single number. But those eighteen are not eighteen
repetitions — they are six different machines, and the mark you lose is almost
never the algebra. It is reaching for the wrong machine, or forgetting the step
that a particular machine *requires*: the check that a radical equation cannot
do without, the restriction a rational equation cannot do without, the second
case an absolute value cannot do without.

So read this chapter as a set of decisions. By the end you should be able to
look at an equation for two seconds and know which of the six it is.

> **A note on where this chapter starts.** The lecture course runs 1.1 → 1.3 →
> 1.4 → 1.5 → 1.6 → 1.7. Section 1.2 of the textbook (applications and modelling
> with linear equations) is not lectured, is set in no homework, and is asked on
> neither model paper — so it has no section here either. The skill it carries,
> turning a sentence into an equation, is set up in §1.5 and drilled in the
> problems tab, which is where the exam actually tests it.

**By the end of this module you should be able to:**

- solve a linear equation, and say whether an equation is conditional, an
  identity or a contradiction;
- solve a rational equation, stating its restrictions *before* you start and
  checking every candidate against them;
- write any expression involving $\sqrt{-b}$ in the form $a+bi$, and know why
  $\sqrt{-4}\cdot\sqrt{-9}$ is **not** $\sqrt{36}$;
- solve a quadratic by all four methods, and choose the cheapest one on sight;
- read the discriminant and say how many solutions there are and of what kind;
- solve polynomial, absolute value, radical and rational-exponent equations,
  and equations in quadratic form;
- solve linear, compound and absolute value inequalities, and write the answer
  three ways: as a graph, in set-builder notation and in interval notation.

---

## 1.1 Linear Equations and Rational Equations

### What "solve" means

To **solve** an equation is to find every value of the variable that makes the
two sides equal. Those values are the **solutions**, or **roots**. Two equations
with exactly the same solutions are **equivalent equations** — and solving is
nothing but walking from the equation you were given to an equivalent one whose
answer is obvious.

Three things can happen.

| Kind | What it means | Example | Solution set |
|---|---|---|---|
| **Conditional** | true for some values, false for others | $3x-1=5$ | $\{2\}$ |
| **Identity** | true for *every* value | $3(2x-5)=6x-15$ | all real numbers |
| **Contradiction** | true for *no* value | $3(2x-5)=6x-10$ | $\{\ \}$, the empty set |

You do not decide which one you have in advance. You solve, and the algebra
tells you: if the variable disappears and leaves something true ($-15=-15$), it
is an identity; if it leaves something false ($-15=-10$), it is a contradiction.

> **Write the answer as a set.** The mark scheme in this course accepts
> $\{2\}$, "the solution set is $\{2\}$", or $x=2$. It does not accept a bare
> number floating at the bottom of the page with no statement of what it is.

### A linear equation in one variable

$$ax+b=0,\qquad a\neq0$$

What makes it linear is that $x$ appears to the **first power** only — no $x^2$,
no $x$ under a radical, no $x$ in a denominator. It is also called a
**first-degree** equation. Note the last of those three: $\dfrac{2}{x}-5=0$ is
*not* linear, and that is exactly the distinction §1.1 spends its second half on.

**The method.** Three steps, in this order:

1. Simplify each side on its own — distribute, collect like terms.
2. Gather the variable terms on one side and the constants on the other.
3. Isolate the variable.

**Worked example 1.** Solve $5(x-3)+4=2x-(x-7)$.

| Step | Why |
|---|---|
| $5x-15+4=2x-x+7$ | Distribute on both sides. The minus sign in front of $(x-7)$ multiplies **both** terms. |
| $5x-11=x+7$ | Collect like terms on each side. |
| $4x=18$ | Subtract $x$, add $11$. |
| $x=\dfrac{9}{2}$ | Divide by 4. |

Check: left side $5\left(\tfrac92-3\right)+4=5\cdot\tfrac32+4=\tfrac{23}{2}$;
right side $\tfrac92+7=\tfrac{23}{2}$. ✓ The solution set is $\left\{\tfrac92\right\}$.

**Worked example 2 — clearing fractions.** Solve
$\dfrac{x+2}{4}-\dfrac{x-1}{3}=\dfrac16$.

Multiply *every term on both sides* by the LCD, 12:

$$3(x+2)-4(x-1)=2$$
$$3x+6-4x+4=2\quad\Longrightarrow\quad -x+10=2\quad\Longrightarrow\quad x=8$$

Check: $\tfrac{10}{4}-\tfrac{7}{3}=\tfrac{30-28}{12}=\tfrac{2}{12}=\tfrac16$. ✓

> The single most common slip here is multiplying only the terms that *look*
> like fractions. The $\tfrac16$ on the right is a term too, and so is a lonely
> $2$ if there is one. Multiply the whole equation or nothing.

### Rational equations

A **rational equation** contains one or more rational expressions — ratios of
polynomials — with the variable in a denominator. The method is the same
(multiply by the LCD) with one addition that is not optional.

**Before you multiply, write down the restrictions.** A denominator may not be
zero, so any value that makes one zero is excluded from the start. Multiplying
by the LCD is multiplying by an expression that *could* be zero, and that is
precisely the step that can invent solutions the original equation never had.
Those are **extraneous solutions**: they solve the equation you produced, not
the one you were given.

**Worked example 3 — an extraneous solution.** Solve
$\dfrac{x}{x-2}=\dfrac{2}{x-2}+3$.

Restriction: $x\neq2$. Multiply by $(x-2)$:

$$x=2+3(x-2)\quad\Longrightarrow\quad x=3x-4\quad\Longrightarrow\quad -2x=-4\quad\Longrightarrow\quad x=2$$

The only candidate is the one value that was excluded before we started. The
solution set is $\{\ \}$ — the equation has **no solution**.

Notice what would have happened without the restriction line: you would have
written $x=2$ and lost the mark. This is why "check the solution" is a *step* in
this course and not a piece of advice.

**Worked example 4 — factor first, then find the LCD.** Solve
$\dfrac{3}{y+2}+\dfrac{1}{y-2}=\dfrac{12}{y^{2}-4}$.

$y^{2}-4=(y+2)(y-2)$, so the LCD is $(y+2)(y-2)$ and the restrictions are
$y\neq2$, $y\neq-2$.

$$3(y-2)+1(y+2)=12\quad\Longrightarrow\quad 4y-4=12\quad\Longrightarrow\quad y=4$$

$4$ breaks no restriction. Check: $\tfrac36+\tfrac12=1$ and
$\tfrac{12}{16-4}=1$. ✓ The solution set is $\{4\}$.

> **Always factor every denominator first.** The LCD is invisible until you do,
> and half the "hard" rational equations on a paper are easy ones wearing an
> unfactored denominator.

### Solving for a specified variable

A **literal equation** has several letters and you are told which one to isolate.
The steps are the same; treat every other letter as a number.

**Worked example 5.** Solve $S=2\pi r^{2}+2\pi rh$ for $h$.

$$2\pi rh=S-2\pi r^{2}\quad\Longrightarrow\quad h=\frac{S-2\pi r^{2}}{2\pi r}$$

**Worked example 6 — the variable on both sides.** Solve $ax+b=cx+d$ for $x$.

$$ax-cx=d-b\quad\Longrightarrow\quad x(a-c)=d-b\quad\Longrightarrow\quad x=\frac{d-b}{a-c},\quad a\neq c$$

The factoring step is the whole exercise: you cannot divide by $a$ and by $c$
separately, because $x$ is stuck to both. Gather, factor, divide once.

### An application that is really a rational equation

A car accelerating from rest has speed $v$ (in m/s) after $t$ seconds given by

$$v=\frac{240t}{t+30}.$$

When does it reach 80 m/s? Set $v=80$ and clear the denominator ($t\neq-30$,
which no time can be anyway):

$$80(t+30)=240t\quad\Longrightarrow\quad 80t+2400=240t\quad\Longrightarrow\quad 2400=160t\quad\Longrightarrow\quad t=15$$

The car reaches 80 m/s after **15 seconds**. Notice the answer carries a unit;
a modelling answer without one is an incomplete answer.

---

## 1.3 Complex Numbers

### The number $i$

Some equations have no real solution — $x^{2}=-9$ is the smallest example. The
imaginary unit closes that gap:

$$i=\sqrt{-1},\qquad i^{2}=-1$$

and for any positive real $b$,

$$\sqrt{-b}=i\sqrt{b}.$$

So $\sqrt{-49}=7i$ and $\sqrt{-\tfrac{16}{25}}=\tfrac45 i$.

> **The one trap in this section, and it is on the paper.** The rule
> $\sqrt{a}\cdot\sqrt{b}=\sqrt{ab}$ is only valid when $a$ and $b$ are
> **non-negative**. So
> $$\sqrt{-4}\cdot\sqrt{-9}=(2i)(3i)=6i^{2}=-6,$$
> and **not** $\sqrt{36}=6$. Convert each radical to $i$ form *first*, every
> single time, and the trap cannot spring. The model midterm asks this three
> ways in one question.

Division is safer but deserves the same habit:
$\dfrac{\sqrt{-50}}{\sqrt{-2}}=\dfrac{5i\sqrt{2}}{i\sqrt{2}}=5$.

### Standard form $a+bi$

A **complex number** is written $a+bi$, where $a$ is the **real part** and $b$
the **imaginary part**. Two special cases: if $a=0$ it is **pure imaginary**;
if $b=0$ it is an ordinary real number. Every real number is a complex number.

"Write in standard form" means: one real part, one imaginary part, nothing left
under a radical, no fraction left uncancelled.

**Worked example 7.** Write $\dfrac{-8+\sqrt{-12}}{2}$ in standard form.

$$\frac{-8+2i\sqrt3}{2}=\frac{-8}{2}+\frac{2i\sqrt3}{2}=-4+i\sqrt3$$

Divide **both** terms by 2. Cancelling the 2 into only one of them is the usual
error here.

### Powers of $i$

The powers cycle with period four:

$$i^{1}=i,\quad i^{2}=-1,\quad i^{3}=-i,\quad i^{4}=1,\quad i^{5}=i,\ \dots$$

To simplify $i^{n}$, divide $n$ by 4 and keep the remainder.

- $i^{38}$: $38=4\cdot9+2$, so $i^{38}=i^{2}=-1$.
- $i^{-15}$: first $i^{15}=i^{12}\cdot i^{3}=-i$, so
  $i^{-15}=\dfrac{1}{-i}=\dfrac{1}{-i}\cdot\dfrac{i}{i}=\dfrac{i}{-i^{2}}=i$.

Negative powers are the ones people lose marks on. Take the positive power
first, then reciprocate and rationalise.

### Arithmetic

**Add and subtract** — collect real with real, imaginary with imaginary:

$$(4-7i)+(-2+3i)=2-4i$$
$$\left(\tfrac34+\tfrac12 i\right)-\left(\tfrac13+\tfrac23 i\right)=\tfrac{5}{12}-\tfrac16 i$$

**Multiply** — expand as usual, then replace $i^{2}$ by $-1$:

$$(2+5i)(3-i)=6-2i+15i-5i^{2}=6+13i+5=11+13i$$

**Conjugates.** The conjugate of $a+bi$ is $a-bi$, and their product is real:

$$(a+bi)(a-bi)=a^{2}-b^{2}i^{2}=a^{2}+b^{2}$$

$(4+3i)(4-3i)=16+9=25$. That identity is the whole reason division works.

**Divide** — multiply top and bottom by the conjugate of the bottom:

$$\frac{3+2i}{1-4i}=\frac{(3+2i)(1+4i)}{(1-4i)(1+4i)}=\frac{3+14i+8i^{2}}{1+16}=\frac{-5+14i}{17}=-\frac{5}{17}+\frac{14}{17}i$$

A reciprocal is the same move: $(2-i\sqrt5)^{-1}=\dfrac{2+i\sqrt5}{4+5}=\dfrac{2+i\sqrt5}{9}$.

> **Standard form is the destination.** $\dfrac{-5+14i}{17}$ is correct but not
> finished; $-\tfrac{5}{17}+\tfrac{14}{17}i$ is finished. On a paper that says
> "write each expression in standard form", the split is worth a mark.

---

## 1.4 Quadratic Equations

$$ax^{2}+bx+c=0,\qquad a\neq0$$

Four methods. They all work; they do not all cost the same.

### Method 1 — the zero product property

**If $mn=0$, then $m=0$ or $n=0$.** This is a fact about *zero* and nothing
else, so the equation must be set equal to zero before you factor.

**Worked example 8.** Solve $x(2x+3)=9$.

You may not conclude $x=9$ or $2x+3=9$. Rearrange first:

$$2x^{2}+3x-9=0\quad\Longrightarrow\quad(2x-3)(x+3)=0\quad\Longrightarrow\quad x=\tfrac32\ \text{ or }\ x=-3$$

### Method 2 — the square root property

**If $x^{2}=k$, then $x=\sqrt{k}$ or $x=-\sqrt{k}$**, usually written
$x=\pm\sqrt{k}$.

- $(w+4)^{2}=20\Rightarrow w+4=\pm2\sqrt5\Rightarrow w=-4\pm2\sqrt5$.
- $4y^{2}+9=0\Rightarrow y^{2}=-\tfrac94\Rightarrow y=\pm\tfrac32 i$.

The second one matters: $k$ is allowed to be negative, and the answer is then a
pair of pure imaginary numbers. "No solution" is the wrong answer — there is no
*real* solution, which is a different sentence.

> **Losing the $\pm$ is the most expensive one-character mistake in the
> chapter.** A square root property with one sign throws away half the answer.

### Method 3 — completing the square

Use it when the equation will not factor and you want an exact answer — and
learn it properly, because chapter 3 rebuilds the whole vertex-form question on it.

**Worked example 9.** Solve $2x^{2}+5x-4=0$ by completing the square.

| Step | Why |
|---|---|
| $x^{2}+\tfrac52x=2$ | Divide through by the leading coefficient and move the constant across. |
| $x^{2}+\tfrac52x+\tfrac{25}{16}=2+\tfrac{25}{16}$ | Half of $\tfrac52$ is $\tfrac54$; its square is $\tfrac{25}{16}$. Add it to **both** sides. |
| $\left(x+\tfrac54\right)^{2}=\tfrac{57}{16}$ | The left side is now a perfect square by construction. |
| $x+\tfrac54=\pm\tfrac{\sqrt{57}}{4}$ | Square root property. |
| $x=\dfrac{-5\pm\sqrt{57}}{4}$ | Isolate. |

### Method 4 — the quadratic formula

Completing the square on the general equation gives the formula once and for all:

$$x=\frac{-b\pm\sqrt{b^{2}-4ac}}{2a}$$

- $x(x-4)=6\Rightarrow x^{2}-4x-6=0\Rightarrow x=\dfrac{4\pm\sqrt{40}}{2}=2\pm\sqrt{10}$.
- $\tfrac16x^{2}-\tfrac12x-\tfrac13=0$: multiply by 6 first, giving
  $x^{2}-3x-2=0$, then $x=\dfrac{3\pm\sqrt{17}}{2}$.

Clear the fractions before you identify $a$, $b$ and $c$. Substituting
$a=\tfrac16$ into the formula is legal and horrible.

### The discriminant

The radicand $\Delta=b^{2}-4ac$ decides the outcome before you compute it:

| $\Delta$ | Number and type of solutions | Example |
|---|---|---|
| $\Delta<0$ | 2 nonreal solutions (a conjugate pair) | $2x^{2}-3x+5=0$, $\Delta=-31$ |
| $\Delta=0$ | 2 repeated solutions (one distinct value) | $x^{2}-6x+9=0$, $\Delta=0$ |
| $\Delta>0$ | 2 distinct real solutions | $3x^{2}+5x-2=0$, $\Delta=49$ |

Two extras worth knowing. If $\Delta$ is a **perfect square** (and $a$, $b$, $c$
are integers), the solutions are rational and the quadratic factors — so a quick
discriminant tells you whether hunting for factors is worth the time. And the
course's phrasing for $\Delta=0$ is "**2 repeated solutions**": the equation
still has two roots, they have just landed on the same number.

### Solving a quadratic for a specified variable

If the letter you want appears squared *and* to the first power, it is a
quadratic in that letter — so use the formula on it.

**Worked example 10.** Solve $mt^{2}+nt=z$ for $t$.

$$mt^{2}+nt-z=0\quad\Longrightarrow\quad t=\frac{-n\pm\sqrt{n^{2}+4mz}}{2m}$$

with $a=m$, $b=n$, $c=-z$, so $-4ac=+4mz$. Watch that sign.

### Which method, on sight

1. Is it already a product equal to zero, or does it factor in one glance?
   → **zero product property**.
2. Is there no $x$ term at all, or is one side already a perfect square?
   → **square root property**.
3. Does it factor with a little work? → **factor**.
4. Otherwise → **quadratic formula**. Completing the square is for when you are
   *asked* for it, or when you want vertex form later.

---

## 1.5 Applications of Quadratic Equations

The algebra is done. What this section tests is the translation, and there is a
routine for it:

1. Say what the variable **is**, in words and units — "let $w$ be the width in
   metres". Half the marks in an applied question hang off this line.
2. Draw the figure if there is one, and label it with expressions in $w$.
3. Write the equation from the sentence that has "is", "equals", "total" or a
   formula in it.
4. Solve.
5. **Reject the impossible root and answer the question that was asked.**

Step 5 is where quadratics differ from linear applications: you will usually get
two roots and one of them will be a negative length or a negative time.

**Worked example 11 — geometry.** A rectangular plot is 3 m longer than twice
its width, and its area is $65\ \text{m}^{2}$. Find its dimensions.

Let $w$ be the width in metres; the length is $2w+3$.

$$w(2w+3)=65\quad\Longrightarrow\quad 2w^{2}+3w-65=0$$

$\Delta=9+520=529=23^{2}$, so $w=\dfrac{-3\pm23}{4}$, giving $w=5$ or
$w=-6.5$. A width cannot be negative, so the plot is **5 m by 13 m**.

**Worked example 12 — Pythagoras.** In a right triangle the two legs are 7 cm
and 14 cm shorter than the hypotenuse. Find all three sides.

Let $x$ be the hypotenuse in centimetres; the legs are $x-7$ and $x-14$.

$$(x-7)^{2}+(x-14)^{2}=x^{2}$$
$$x^{2}-14x+49+x^{2}-28x+196=x^{2}\quad\Longrightarrow\quad x^{2}-42x+245=0$$

$\Delta=1764-980=784=28^{2}$, so $x=\dfrac{42\pm28}{2}$, giving $x=35$ or
$x=7$. If $x=7$ the legs are $0$ and $-7$ — impossible. So the sides are
**21 cm, 28 cm and 35 cm**, and $21^{2}+28^{2}=1225=35^{2}$. ✓

**Worked example 13 — the projectile model.** An object moving vertically under
gravity has height

$$s=-\tfrac12gt^{2}+v_{0}t+s_{0}$$

where $g$ is the gravitational acceleration ($9.8\ \text{m/s}^{2}$), $v_{0}$ the
initial velocity and $s_{0}$ the initial height. Some questions hand you the
model with the number already in it — chapter 3's projectile problems are
written $h(t)=-5t^{2}+\dots$, which is $g\approx10$. **A model printed in the
question is a given:** solve the one you are handed, and never substitute your
own $g$ into it. A rocket is launched from a pad
$3$ m above the ground at $24.5$ m/s. When is it $20$ m up?

$$-4.9t^{2}+24.5t+3=20\quad\Longrightarrow\quad 4.9t^{2}-24.5t+17=0$$

$\Delta=600.25-333.2=267.05$, $\sqrt{\Delta}\approx16.34$, so

$$t=\frac{24.5\pm16.34}{9.8}\approx0.83\ \text{s}\quad\text{or}\quad t\approx4.17\ \text{s}.$$

**Both** are answers this time: the rocket passes 20 m on the way up and again
on the way down. Rejecting a root is a decision you make from the situation, not
a reflex.

**Worked example 14 — a formula in disguise.** The sum of the first $n$ natural
numbers is $S=\tfrac12 n(n+1)$. For which $n$ is the sum 171?

$$\tfrac12n(n+1)=171\quad\Longrightarrow\quad n^{2}+n-342=0$$

$\Delta=1+1368=1369=37^{2}$, so $n=\dfrac{-1\pm37}{2}$, giving $n=18$ or
$n=-19$. A count of terms cannot be negative: $n=18$.

---

## 1.6 More Equations and Applications

Five machines, one section. Each has a signature you can spot from across the
room, and each has one step you cannot skip.

### 1. Polynomial equations — set to zero and factor

**Worked example 15 — factoring by grouping.** Solve
$2x^{3}+5x^{2}-8x-20=0$.

$$x^{2}(2x+5)-4(2x+5)=0\quad\Longrightarrow\quad(2x+5)(x^{2}-4)=0\quad\Longrightarrow\quad(2x+5)(x-2)(x+2)=0$$

so $x=-\tfrac52,\ 2,\ -2$. Group in pairs, pull the common factor out of each
pair, and if the brackets that appear are identical you are on the right track.
Then keep factoring — $(x^{2}-4)$ is not finished.

**Worked example 16 — a common factor first.** Solve $y^{4}=8y$.

$$y^{4}-8y=0\quad\Longrightarrow\quad y(y^{3}-8)=0\quad\Longrightarrow\quad y(y-2)(y^{2}+2y+4)=0$$

The first two factors give $y=0$ and $y=2$; the quadratic gives
$y=\dfrac{-2\pm\sqrt{-12}}{2}=-1\pm i\sqrt3$. Four solutions for a fourth-degree
equation, two of them nonreal.

> **Never divide both sides by $y$.** It looks tempting in $y^{4}=8y$ and it
> silently deletes the solution $y=0$. Move everything to one side and factor.

### 2. Rational equations — restrictions, LCD, check

Same as §1.1, one step harder.

**Worked example 17.** Solve $\dfrac{12}{m^{2}-4m}+2=\dfrac{6}{m-4}$.

$m^{2}-4m=m(m-4)$, so the LCD is $m(m-4)$ and $m\neq0$, $m\neq4$.

$$12+2m(m-4)=6m\quad\Longrightarrow\quad 2m^{2}-14m+12=0\quad\Longrightarrow\quad m^{2}-7m+6=0$$
$$(m-1)(m-6)=0\quad\Longrightarrow\quad m=1\ \text{ or }\ m=6$$

Neither is excluded, so the solution set is $\{1,6\}$.

### 3. Absolute value equations — four rules

Let $k$ be a positive real number.

| Equation | Equivalent to |
|---|---|
| $\lvert u\rvert=k$ | $u=k$ **or** $u=-k$ |
| $\lvert u\rvert=0$ | $u=0$ |
| $\lvert u\rvert=-k$ | no solution |
| $\lvert u\rvert=\lvert w\rvert$ | $u=w$ **or** $u=-w$ |

**Isolate the absolute value before you split.** In $3\lvert2t-5\rvert=21$,
divide by 3 first to get $\lvert2t-5\rvert=7$, then

$$2t-5=7\ \Rightarrow\ t=6\qquad\text{or}\qquad 2t-5=-7\ \Rightarrow\ t=-1.$$

The third rule is a real question, not a trick: $4=\lvert5w+2\rvert+9$ becomes
$\lvert5w+2\rvert=-5$, and a distance is never negative, so there is **no
solution**. Write that; do not leave it blank.

The fourth rule needs the whole of the second bracket negated:

$$\lvert3x-1\rvert=\lvert x+5\rvert\ \Longrightarrow\ 3x-1=x+5\ \text{ or }\ 3x-1=-(x+5)$$

giving $x=3$ or $x=-1$. Writing $3x-1=-x+5$ — negating only the first term — is
the standard way to lose this one.

### 4. Radical and rational-exponent equations — raise, then check

Isolate one radical, raise both sides to the matching power, and repeat if a
radical survives. Squaring is **not** a reversible step, so every candidate must
be checked in the *original* equation.

**Worked example 18.** Solve $\sqrt{2x+7}=x+2$.

$$2x+7=x^{2}+4x+4\quad\Longrightarrow\quad x^{2}+2x-3=0\quad\Longrightarrow\quad(x+3)(x-1)=0$$

Candidates $x=-3$ and $x=1$. Check $x=-3$: the left side is $\sqrt{1}=1$, the
right side is $-1$. A principal square root is never negative, so $-3$ is
extraneous. Check $x=1$: $\sqrt9=3$ and $1+2=3$. ✓ The solution set is $\{1\}$.

**Worked example 19 — two radicals.** Solve $\sqrt{x+6}-\sqrt{x-2}=2$.

Isolate one radical *before* squaring, or the cross term will eat you:

$$\sqrt{x+6}=2+\sqrt{x-2}$$
$$x+6=4+4\sqrt{x-2}+x-2\quad\Longrightarrow\quad 4=4\sqrt{x-2}\quad\Longrightarrow\quad\sqrt{x-2}=1$$

so $x=3$. Check: $\sqrt9-\sqrt1=3-1=2$. ✓

**Rational exponents.** Raise both sides to the *reciprocal* power:
$3(z-2)^{3/4}=24\Rightarrow(z-2)^{3/4}=8\Rightarrow z-2=8^{4/3}=16\Rightarrow z=18$.

> **When the exponent has an even numerator, a $\pm$ appears.** For
> $(x+1)^{2/3}=9$, cube both sides to get $(x+1)^{2}=729$, so $x+1=\pm27$ and
> $x=26$ or $x=-28$. Both check, because $(-27)^{2/3}=9$. Dropping the $\pm$
> here throws away a whole solution.

### 5. Equations in quadratic form — substitute

If an equation is quadratic in *something*, name that something $u$.

| Original | Substitution | New equation |
|---|---|---|
| $(x^{2}-2)^{2}-11(x^{2}-2)+24=0$ | $u=x^{2}-2$ | $u^{2}-11u+24=0$ |
| $3w^{2/3}-5w^{1/3}-2=0$ | $u=w^{1/3}$ | $3u^{2}-5u-2=0$ |
| $t+5\sqrt{t}=24$ | $u=\sqrt{t}$ | $u^{2}+5u-24=0$ |

The pattern to look for: one exponent is exactly **twice** the other.

**Worked example 20.** Solve $(x^{2}-2)^{2}-11(x^{2}-2)+24=0$.

With $u=x^{2}-2$: $u^{2}-11u+24=(u-3)(u-8)=0$, so $u=3$ or $u=8$. Now go back —
this is the step people forget:

$$x^{2}-2=3\Rightarrow x=\pm\sqrt5,\qquad x^{2}-2=8\Rightarrow x=\pm\sqrt{10}$$

Four solutions. An answer that stops at $u=3,8$ has solved the wrong equation.

**Worked example 21 — a rejected substitution.** Solve $t+5\sqrt{t}=24$.

With $u=\sqrt t$: $u^{2}+5u-24=(u+8)(u-3)=0$, so $u=-8$ or $u=3$. But
$u=\sqrt t\geq0$, so $u=-8$ is impossible; only $u=3$ survives, giving $t=9$.
Check: $9+5\cdot3=24$. ✓

---

## 1.7 Linear, Compound, and Absolute Value Inequalities

### The one property that is different

Everything you do to an equation you may do to an inequality, with one exception:

> **Multiplying or dividing both sides by a negative number reverses the
> inequality symbol.**

$-5y+4\geq19\Rightarrow-5y\geq15\Rightarrow y\leq-3$. Adding and subtracting
never flip anything; only a negative multiplier does. And notice it is the
*multiplier's* sign that matters, not the sign of anything else in sight.

### Writing the answer three ways

The exam asks for the solution set **graphed, in set-builder notation and in
interval notation**. All three, for the same answer.

| Inequality | Graph | Set-builder | Interval |
|---|---|---|---|
| $x<a$ | open circle at $a$, shade left | $\{x\mid x<a\}$ | $(-\infty,a)$ |
| $x\leq a$ | closed circle at $a$, shade left | $\{x\mid x\leq a\}$ | $(-\infty,a]$ |
| $x>a$ | open circle at $a$, shade right | $\{x\mid x>a\}$ | $(a,\infty)$ |
| $x\geq a$ | closed circle at $a$, shade right | $\{x\mid x\geq a\}$ | $[a,\infty)$ |
| $a<x\leq b$ | open at $a$, closed at $b$ | $\{x\mid a<x\leq b\}$ | $(a,b]$ |
| no solution | nothing shaded | $\{\ \}$ | $\varnothing$ |
| all reals | whole line shaded | $\mathbb{R}$ | $(-\infty,\infty)$ |

Two rules that carry marks on their own: a **square bracket includes** the
endpoint and a **round bracket excludes** it; and $\infty$ is not a number, so
it **always** takes a round bracket. $[3,\infty]$ is not a typo, it is wrong.

**Worked example 22.** Solve $\dfrac{x+2}{4}-\dfrac{3x-1}{6}<\dfrac{x}{3}$.

Multiply by 12 — positive, so nothing flips:

$$3(x+2)-2(3x-1)<4x\quad\Longrightarrow\quad -3x+8<4x\quad\Longrightarrow\quad 8<7x\quad\Longrightarrow\quad x>\tfrac87$$

Solution set: $\left\{x\mid x>\tfrac87\right\}=\left(\tfrac87,\infty\right)$.

### Compound inequalities: *and* means overlap, *or* means everything

- **and** → **intersection** → the values in **both** sets → often one interval,
  sometimes empty.
- **or** → **union** → the values in **either** set → often two pieces joined
  by $\cup$.

**Worked example 23 (and).** $x+3\leq8$ **and** $2x-1>3$.
Separately: $x\leq5$ and $x>2$. Overlap: $(2,5]$.

**Worked example 24 (or).** $x-4\leq-6$ **or** $\tfrac13x\geq2$.
Separately: $x\leq-2$ or $x\geq6$. Union: $(-\infty,-2]\cup[6,\infty)$.

**Three-part inequalities** are an *and* written compactly. Do the same thing to
all three parts:

$$-7\leq3-2x<5$$
$$-10\leq-2x<2\qquad\text{(subtract 3 everywhere)}$$
$$5\geq x>-1\qquad\text{(divide by }-2\text{: both symbols flip)}$$

which reads $-1<x\leq5$, or $(-1,5]$. Rewrite it with the small number on the
left before you state it; a mark scheme wants it read left to right along the
number line.

### Absolute value inequalities

Let $k>0$.

| Inequality | Equivalent to | Shape of the answer |
|---|---|---|
| $\lvert u\rvert<k$ | $-k<u<k$ | **one** interval, between |
| $\lvert u\rvert>k$ | $u<-k$ **or** $u>k$ | **two** intervals, outside |

The same holds for $\leq$ and $\geq$. The way to remember it without memorising:
$\lvert u\rvert$ is the distance from $u$ to 0. "Less than $k$" means *close* to
zero — one stretch either side. "Greater than $k$" means *far* from zero — and
far in two directions.

**Isolate the absolute value first**, exactly as with equations.

**Worked example 25 (less than).** $3\lvert x+2\rvert-4\leq8$.

$$\lvert x+2\rvert\leq4\quad\Longrightarrow\quad -4\leq x+2\leq4\quad\Longrightarrow\quad -6\leq x\leq2$$

Graph: closed circles at $-6$ and $2$, shaded between. Set-builder:
$\{x\mid-6\leq x\leq2\}$. Interval: $[-6,2]$.

**Worked example 26 (greater than).** $\lvert3x-6\rvert>9$.

$$3x-6>9\ \text{ or }\ 3x-6<-9\quad\Longrightarrow\quad x>5\ \text{ or }\ x<-1$$

Interval: $(-\infty,-1)\cup(5,\infty)$. Writing $-9<3x-6<9$ here — treating a
greater-than like a less-than — is the single most common error in the chapter,
and it produces exactly the *complement* of the right answer.

**Worked example 27 (a negative multiplier).** $-3\lvert x+1\rvert\geq-12$.

Divide by $-3$ and flip: $\lvert x+1\rvert\leq4$, so $-4\leq x+1\leq4$ and the
answer is $[-5,3]$. The flip happens **before** the absolute value is split.

**The edge cases, where $k$ is not positive.** The table above requires $k>0$,
and the lecture slides state it that way and stop. The paper does not always
oblige, so know both:

- $\lvert u\rvert<-3$ — a distance can never be negative: **no solution**,
  $\varnothing$.
- $\lvert u\rvert>-3$ — every distance beats a negative number: **all real
  numbers**, $(-\infty,\infty)$.
- $\lvert u\rvert\leq0$ — only $u=0$ works, so solve $u=0$.

**Compound absolute value.** $4<\lvert2x+1\rvert\leq10$ is an *and* of the two
rules. From $\lvert2x+1\rvert>4$: $2x+1>4$ or $2x+1<-4$. From
$\lvert2x+1\rvert\leq10$: $-10\leq2x+1\leq10$. Combining each side separately:

$$4<2x+1\leq10\ \Rightarrow\ \tfrac32<x\leq\tfrac92,\qquad
-10\leq2x+1<-4\ \Rightarrow\ -\tfrac{11}{2}\leq x<-\tfrac52$$

so the solution is $\left[-\tfrac{11}{2},-\tfrac52\right)\cup\left(\tfrac32,\tfrac92\right]$.
Note how the strict and non-strict symbols travel with their own ends.

### Applications

**An average.** Four test scores are 78, 85, 91 and 84, and the final counts as
two test grades. What must the final be for an average of at least 85?

$$\frac{78+85+91+84+2x}{6}\geq85\quad\Longrightarrow\quad338+2x\geq510\quad\Longrightarrow\quad x\geq86$$

She needs **at least 86**. Answer the question in words as well as in interval
notation — "$[86,\infty)$" alone does not say what 86 is.

**A tolerance.** A machine fills bottles with 750 ml, with an error of no more
than 4 ml. Let $x$ be the actual amount. "Error of no more than 4" is a distance
statement:

$$\lvert x-750\rvert\leq4\quad\Longrightarrow\quad746\leq x\leq754$$

Every tolerance problem has this shape: $\lvert\text{actual}-\text{target}\rvert\leq\text{tolerance}$.

---

## Common mistakes

1. **Multiplying only some terms by the LCD.** Every term on both sides, or
   nothing.
2. **Solving a rational equation without writing the restrictions first.** The
   whole point of §1.1's extraneous example is that the answer *is* the excluded
   value, and nothing in the algebra warns you.
3. **$\sqrt{-4}\cdot\sqrt{-9}=\sqrt{36}$.** It is $-6$. Convert to $i$ form
   first, always.
4. **Losing the $\pm$** in the square root property, or in
   $(x+1)^{2/3}=9$.
5. **Answering $x=9$ to $x(2x+3)=9$.** The zero product property needs a *zero*.
6. **Dividing both sides by the variable**, which deletes the root $x=0$.
7. **Negating only the first term** in $\lvert u\rvert=\lvert w\rvert$: it is
   $u=-(w)$, brackets and all.
8. **Not checking a radical equation.** Squaring creates solutions; only the
   check removes them.
9. **Stopping at $u$** in a quadratic-form equation instead of substituting back.
10. **Forgetting to flip** when multiplying or dividing an inequality by a
    negative — including the flip hidden inside $-3\lvert x+1\rvert\geq-12$.
11. **Treating $\lvert u\rvert>k$ as $-k<u<k$.** That is the complement of the
    right answer, which is worse than a blank.
12. **A square bracket on infinity.** $\infty$ is never included.
13. **Giving one of the three required forms.** The paper asks for the graph,
    the set-builder form *and* the interval form.

## Check yourself

1. Solve $4(x-2)+7=2x-(x-9)$.
2. Is $5(2x-3)=10x-15$ conditional, an identity, or a contradiction?
3. Solve $\dfrac{x}{x-5}=\dfrac{5}{x-5}+2$.
4. Write $\sqrt{-9}\cdot\sqrt{-16}$ in standard form.
5. Simplify $i^{27}$.
6. Write $\dfrac{2-3i}{4+i}$ in standard form.
7. Solve $3x^{2}+5=0$.
8. Solve $x(x+5)=14$.
9. How many solutions does $4x^{2}-12x+9=0$ have, and of what kind?
10. Solve $\lvert4-3y\rvert=\lvert y+8\rvert$.
11. Solve $\sqrt{3x+10}=x+2$.
12. Solve $2p^{2/3}-7p^{1/3}+3=0$.
13. Solve $-2<5-x\leq7$ and give the answer in interval notation.
14. Solve $\lvert2x-7\rvert\geq3$ and give the answer in interval notation.
15. Solve $5-2\lvert x+4\rvert>-1$ and give the answer in interval notation.

---

### Answers to "Check yourself"

1. $4x-8+7=2x-x+9\Rightarrow4x-1=x+9\Rightarrow3x=10\Rightarrow x=\tfrac{10}{3}$.
2. $10x-15=10x-15$: the variable vanishes leaving a true statement, so it is an
   **identity** — every real number is a solution.
3. Restriction $x\neq5$. Multiplying gives $x=5+2(x-5)\Rightarrow x=2x-5\Rightarrow x=5$,
   which is excluded. **No solution**, $\{\ \}$.
4. $(3i)(4i)=12i^{2}=-12$, i.e. $-12+0i$. (Not $\sqrt{144}=12$.)
5. $27=4\cdot6+3$, so $i^{27}=i^{3}=-i$.
6. $\dfrac{(2-3i)(4-i)}{(4+i)(4-i)}=\dfrac{8-2i-12i+3i^{2}}{17}=\dfrac{5-14i}{17}=\dfrac{5}{17}-\dfrac{14}{17}i$.
7. $x^{2}=-\tfrac53\Rightarrow x=\pm i\sqrt{\tfrac53}=\pm\dfrac{i\sqrt{15}}{3}$.
8. $x^{2}+5x-14=0\Rightarrow(x+7)(x-2)=0\Rightarrow x=-7$ or $x=2$.
9. $\Delta=144-144=0$: **2 repeated solutions**, the single value $x=\tfrac32$.
10. $4-3y=y+8\Rightarrow y=-1$; or $4-3y=-(y+8)\Rightarrow4-3y=-y-8\Rightarrow-2y=-12\Rightarrow y=6$.
    Solutions $\{-1,6\}$.
11. $3x+10=x^{2}+4x+4\Rightarrow x^{2}+x-6=0\Rightarrow(x+3)(x-2)=0$. Check:
    $x=-3$ gives $\sqrt1=1\neq-1$, extraneous; $x=2$ gives $\sqrt{16}=4=2+2$ ✓.
    Solution set $\{2\}$.
12. $u=p^{1/3}$: $2u^{2}-7u+3=(2u-1)(u-3)=0$, so $u=\tfrac12$ or $u=3$, giving
    $p=\tfrac18$ or $p=27$.
13. $-7<-x\leq2\Rightarrow7>x\geq-2$, i.e. $[-2,7)$.
14. $2x-7\geq3$ or $2x-7\leq-3$, so $x\geq5$ or $x\leq2$: $(-\infty,2]\cup[5,\infty)$.
15. $-2\lvert x+4\rvert>-6\Rightarrow\lvert x+4\rvert<3$ (divide by $-2$, flip)
    $\Rightarrow-3<x+4<3\Rightarrow-7<x<-1$: $(-7,-1)$.

---

> *Independent study guide for a first course in College Algebra and Trigonometry. Every explanation, worked example, practice question and problem is written for this course. Section numbering follows Miller & Gerken, College Algebra and Trigonometry, the textbook the lecture course is taught from; where a question from a past model paper is discussed, it is named where it appears, and no worked example from that textbook is reproduced. Not affiliated with or endorsed by any university, instructor or publisher.*
