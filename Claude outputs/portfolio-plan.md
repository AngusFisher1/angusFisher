# Angus Fisher portfolio: redesign and content plan

A recruiter-and-designer read of the current site (`index.html`, `css/design-system.css`, `css/site.css`), plus a concrete plan for the theme, the interactions, and the content that would actually make you stand out for AI PM roles.

---

## 1. What you have right now

You built a real thing, not a template. The "blueprint" system is coherent: warm light-grey ground (`#f2f2f3`), a single slate-blue accent (`#5980a6`), Barlow Condensed uppercase for headings, Barlow for body, hairline borders, square corners, and the registration-mark crop corners on every card. Two dark navy bands (spec sheet and footer) bracket the light middle. The duotone photo treatment that clears to full color on hover is a genuinely nice detail and it's on-theme: an engineering drawing that resolves into a real person.

The writing is the strongest asset on the site. The case copy is specific, honest, and PM-literate. Case 02 admitting "I don't have shareable numbers" and then describing what was actually built and measured is exactly the move a good hiring manager rewards. Don't lose any of that voice in a redesign.

So this is not a rescue job. It's a polish-and-sharpen job with a few real bugs underneath it.

---

## 2. Interaction inventory (what actually happens on the page)

The live page is almost entirely static. `support.js` is only loaded by `Portfolio.dc.html` (the Claude Design canvas file), not by `index.html`, so the shipped site runs zero JavaScript. The interactions that exist are all CSS:

- Sticky header with a translucent background and `backdrop-filter: blur(6px)`.
- Smooth scroll to the anchor sections via `scroll-behavior: smooth`.
- Duotone hover on the two photos (the blue overlay fades out on hover).
- Button, link, and table-row hover states.
- `:focus-visible` outlines for keyboard users (good, keep it).

What's missing interaction-wise: no active-section highlight in the nav (the CSS styles `[aria-current='page']` but nothing ever sets it), no scroll reveals, no mobile nav, no dark-mode toggle, and no live/interactive proof beyond the one Beacon link.

---

## 3. Fix these first, before any redesign (they're bugs, not taste)

These undercut a recruiter-facing site regardless of how it looks.

**The resume link is broken.** Both the hero and footer point to `/resume.pdf`. On a GitHub Pages project site the root is `angusfisher1.github.io`, so that URL 404s. Your file lives at `assets/resume.pdf`. A recruiter who clicks "Resume (PDF)" gets nothing. Change both links to `assets/resume.pdf` (relative). This is the single highest-value fix on the page.

**The images are enormous.** `coaching.JPG` is 15 MB and `headshot.jpg` is 4.7 MB. That's roughly 20 MB of images on a one-page site. On anything but fast wifi it will paint slowly and janky, and it's the first physical impression the site makes. Resize both to display size (headshot around 720px wide, coaching around 1200px wide), export as compressed JPG or WebP, target under ~200 KB each. Add explicit `width`/`height` attributes to stop layout shift, and `loading="lazy"` on the coaching photo since it's below the fold.

**The Open Graph image is the 4.7 MB headshot.** Link previews in Slack, LinkedIn, and iMessage will be slow or fail. Make a proper 1200x630 share card (headshot plus your name and "Product Manager, AI products end to end") and point `og:image` and `twitter:image` at it.

**"Book a call" goes nowhere.** The footer link is `href="#"`. Either wire it to a real scheduler (Cal.com or Calendly) or remove it. A dead "book a call" on a hiring page reads as unfinished.

**No favicon.** You get the default globe in the tab and in bookmarks. Add a simple monogram favicon (AF, or a single crop-mark glyph that matches the blueprint theme).

**`og:url` also points at the bare Pages URL** while your links are relative; make sure the canonical URL is right once you pick the final domain (see section 9).

---

## 4. The 10-second recruiter read: does it pass?

When I skim a PM portfolio I'm answering four questions in the first ten seconds: who is this, what level, what do they want, and can they prove it. Your hero answers three of them well. "Product manager. I prototype the idea before I lock the spec." is a strong, differentiated one-liner. The lede and the "looking for" note are clear.

Where the 10-second read leaks:

- **No proof band up top.** Your best numbers (92% fewer incidents, 32% input efficiency) are buried in Case 01, three scrolls down. A skimmer never reaches them. Pull a small metrics strip up near the hero.
- **The spec sheet is a tools list, not an outcomes list.** Right after the hero you show Copilot Studio / Python / React / Figma. Useful, but it's the least differentiating thing about you. Tools don't make a PM stand out; shipped outcomes do.
- **No social proof.** There's not a single quote from a manager, engineer, or customer. For a career-changer story (support to PM, coach to product) one credible sentence from someone who worked with you does more than a paragraph you wrote about yourself.
- **Everything is a wall of text.** Three cases, all prose, all the same rhythm. A recruiter skims, and there's nothing visual to catch a skim except two photos. The one thing your whole pitch is built on ("I prototype, I build working things") is barely shown, it's mostly told.

---

## 5. Theme direction

My recommendation: **keep the blueprint concept and sharpen it, don't reinvent it.** It's distinctive, it's yours, and "engineering drawing that resolves into the real thing" is a strong metaphor for a PM who ships working prototypes. A generic minimal-SaaS redesign would be a downgrade in personality. What the theme needs is contrast, a second color, and a few moments of intentional richness so it doesn't read as flat and monochromatic.

### 5a. Palette: add one warm signal color

Right now everything is one blue on grey. That's calm but it gives you no way to make anything pop, and "calm and flat" is a real risk for a page that needs to grab a busy recruiter. Introduce a single warm accent used sparingly, only for the things you want eyes on: the primary CTA, the metric numbers, and the active nav item.

Suggested addition (blueprint annotation red/orange, the color of markup on a technical drawing):

```
--color-signal: #d1552b;   /* warm annotation orange, use for CTA + metrics only */
--color-signal-ink: #a23d1c;
```

Rule: the signal color appears no more than a handful of times per viewport. Everything else stays in the blue/neutral system. That discipline is what makes the pops actually pop.

Also worth doing: darken the body link color slightly for contrast. `--color-accent` (`#5980a6`) on the light ground is borderline for WCAG AA on small text; you already use `--color-accent-700` for links in `site.css`, which is safer. Standardize on the 700 step everywhere and verify 4.5:1.

### 5b. Add a dark mode

Your `design-system.css` readme already talks about deriving a dark theme, and AI-native companies skew heavily toward dark UIs. A dark variant of the blueprint (navy-black ground, cyan-ish accent, the crop marks glowing) would look genuinely sharp and signals that you sweat the details. Implement it theme-aware: default light, respect `prefers-color-scheme: dark`, and add a small toggle in the nav. This is optional and lower priority than content, but it's a high-impact "this person cares about craft" moment.

### 5c. Typography and rhythm tuning

The type system is good; a few specific fixes:

- **Kill the runaway line lengths.** `case__title` has `max-width: 236ch` and `case__intro` has `max-width: 160ch`, which on your 1500px container means no real constraint. Long measure hurts readability. Cap body measure around 65 to 72ch and let titles run wide only where you want a poster effect.
- **The `specsheet__value` has a hard `width: 400px`** that will overflow narrow columns. Remove the fixed width, let it flow.
- **Consider dropping the container from 1500px to ~1200px** for the reading sections. 1500px of full-width Barlow is a lot of eye travel. Wide is fine for the hero and the dark bands; narrower is better for the case prose.
- Tighten the vertical rhythm between sections. Several sections use `padding: 24px 0` which is tight for section breaks on a page this long; a bit more air between cases would help the skim.

### 5d. Make the "blueprint" concept do more work

Right now the blueprint idea lives only in the corner crop marks. A few cheap ways to extend it so the theme feels intentional rather than decorative:

- A faint grid or graph-paper texture behind the hero or the dark bands (very low opacity, CSS gradient, no image weight).
- Dimension-line styling on the metrics (little tick-and-arrow marks around the numbers, like a measured drawing).
- Treat each case as a numbered "plate" (Plate 01, 02, 03) with a small revision-block in the corner (date, status: Shipped / Prototype / Internal). That directly maps the drafting metaphor onto your work and it doubles as recruiter-useful metadata.

---

## 6. Content plan, section by section (the recruiter part)

This is where you actually stand out. The design makes you look competent; the content makes someone want to book the call. Reordered for a skimmer's path.

### Hero (keep, tighten)
Keep the one-liner. Add one line of "currently" context. Right now the site never says where you work now or most recently. You don't have to name the employer if you'd rather not, but "Currently PM on a construction-contract SaaS platform" gives a recruiter an anchor for level and domain. Add availability if it's true ("open to conversations now"). Fix the resume link here.

### New: a "by the numbers" / proof strip (add, high priority)
Immediately after the hero, before or replacing the tools spec sheet, put 3 to 4 outcome tiles:
- 92% fewer customer incidents (pay-app rebuild)
- 32% faster input
- 40 recurring questions mapped to named sources of truth (Case 02)
- 3 working prototypes shipped (or however many you count)

Style them in the blueprint dimension-line treatment with the signal color on the numbers. This is the single biggest "stand out in 10 seconds" addition.

### Tools spec sheet (keep, demote)
Keep it, but move it below the proof strip and make it visually quieter. Tools are table stakes, not the headline. Consider reframing the label from "AI tooling / Builds with" to "How I build" so it reads as capability, not a resume skills list.

### Case studies (keep the writing, add proof and scannability)
The prose is excellent. Three upgrades:

1. **Add a visual to each case.** Case 01 and 02 are internal and confidential, so no live demo, but you can still show a sanitized artifact: the intent-taxonomy table you already have (great, keep it), a redacted before/after of the pay-app calc, a small architecture or flow diagram of the feedback loop. One image per case breaks the text wall and shows rather than tells.
2. **Add a consistent case header block:** status (Shipped / Internal / Prototype), your role in one word (Owner / Lead), timeframe, and the stack. Recruiters scan for exactly this. It's the drafting "revision block" from 5d, doing double duty.
3. **Lead every case with the outcome, not the setup.** Case 01's scan line already does this well. Make sure all three open with the result in the first sentence.

### Beacon / prototypes (expand, this is your core pitch)
Your entire positioning is "I prototype before I lock the spec," and you have exactly one prototype linked. Lean in hard here:
- Embed a short (60 to 90s) screen recording or a looping GIF of Beacon in action, so the interaction is visible without leaving the page. A closed feedback loop is a thing you should *show* moving.
- If you have other prototypes (the memory of your work suggests PaySimple, the spelling-bee tracker, the meet-management exploration), add them as a small gallery of "things I built to think." Even rough ones prove the habit. Quantity of shipped artifacts is itself the signal for an AI-builder role.
- For each, one line on what question the prototype was answering. That's the PM move: prototype as an argument, not a demo.

### New: "How I write specs a model can read" (add, differentiator)
You claim this in the Approach section but never show it. Show one. A short, sanitized example spec (explicit scope, explicit refusals, explicit success signal) as an expandable block or a linked one-pager is *the* proof that separates an "AI PM" who uses ChatGPT from one who actually engineers agent behavior. This is the most underused asset in your story. It's also very cheap to add.

### Approach / "How I work" (keep, tie to proof)
Good section. Link each principle to the evidence: "Prototype in the discovery week" links to Beacon, "Build the internal tool myself" links to Case 02, "Instrument before launch" links to Case 01's metrics. Turns claims into a connected argument.

### New: social proof (add if you can get it)
One to three short quotes from a manager, an engineer you worked with, or an SME from the chatbot project. Even one sentence ("Angus is the rare PM who'll just build the thing") massively de-risks the career-change narrative. If you can't get quotes, a single line of endorsement with a LinkedIn link works.

### Background / coaching (keep, it's a strength)
The Olympic-throws-coach-to-PM arc is memorable and you write it well. Keep it near the bottom as the "and here's the interesting human" payoff. The "developing athletes over multi-year arcs, then calling corrections in real time when the result is public" framing is a strong analogy for product judgment; maybe sharpen that one sentence even further.

### Footer CTA (fix and strengthen)
"Hiring for a product role? Let's talk specifics." is a good line. Fix "Book a call," add a real scheduler, and add a last-updated date so the site reads as maintained. Consider a one-line filter of what you're looking for and not looking for; it saves everyone time and reads as senior.

---

## 7. Interactions worth adding (and what to skip)

Add, in priority order:

1. **Mobile nav.** The current header is a flex row of six items with no collapse. On a phone it will crowd or wrap badly, and recruiters open links on phones constantly. Add a hamburger or, simpler, a compact scrollable/stacked nav under a breakpoint. This is a real gap, treat it as near-P0.
2. **Active-section highlight.** You already have the CSS for `[aria-current='page']`; add a tiny IntersectionObserver to set it as the user scrolls. Cheap, and it makes the page feel alive and oriented.
3. **Scroll reveals, subtle.** A light fade-and-rise on sections as they enter (respecting `prefers-reduced-motion`). Keep it fast and small; the blueprint aesthetic wants precision, not bounce.
4. **Beacon inline demo** (the GIF/video from section 6). Highest content value of anything here.

Skip or defer: heavy page transitions, cursor effects, parallax, anything that fights the clean drafting feel or adds a build step. Your no-JS-framework, single-file discipline is itself a selling point for a builder; don't trade it away for flourish.

---

## 8. Accessibility and polish pass

- Verify all text/background pairs hit WCAG AA, especially accent-on-light and the muted `color-mix` greys at small sizes.
- Add `alt` text that's actually descriptive (the coaching photo alt is decent; make sure the share card and any new images get real alt).
- Respect `prefers-reduced-motion` for any new animation.
- Add `width`/`height` on images (ties to the perf fix).
- Remove `support.js` and the `Portfolio.dc.html` canvas file from what ships if they're not part of the live site, so the repo reads clean to anyone who looks (and engineers at AI companies will look at your repo).

---

## 9. Domain and distribution

`angusfisher1.github.io/angusFisher/` works but reads as a hobby project. A custom domain (`angusfisher.com` or `.dev`) is ~$12/year and makes every link you paste into an application look more serious. GitHub Pages supports custom domains directly. Once you set it, fix `og:url`/canonical to match. Small money, real signal.

---

## 10. Suggested build order

**P0, do this week (bugs and load):**
Fix both resume links to `assets/resume.pdf`. Compress and resize both images and add dimensions. Make a real 1200x630 og image. Fix or remove "Book a call." Add a favicon. Add the mobile nav.

**P1, the stand-out layer:**
Add the "by the numbers" proof strip. Add the signal color and apply it only to CTA and metrics. Add a visual/artifact to each case. Embed the Beacon demo. Add the "spec a model can read" example. Add case status/role/stack header blocks.

**P2, craft and depth:**
Dark mode with a nav toggle. Active-section nav highlight and subtle scroll reveals. Social proof quotes. Custom domain. Tighten measure and vertical rhythm per section 5c.

---

### The one-sentence version
Fix the broken resume link and the 20 MB of images today, then spend your real effort turning a text-heavy page into a *shown* one: a proof strip up top, a visible working prototype, and one real example of a spec you wrote for a model, all in a sharpened version of the blueprint theme you already own.
