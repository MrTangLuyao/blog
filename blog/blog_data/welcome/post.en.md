Hi! I'm Louie, an international student from China, currently studying in Melbourne, Australia. Welcome to my blog, a quiet corner where I'll occasionally write about tech, life, and the occasional random thought.

## About this site

The whole site is hand-written, line by line. Purely static, no database, no backend, deployed on Cloudflare Pages. The frontend is HTML, a sprinkle of Tailwind, and plain JavaScript.

## On the design language

The visual style here borrows heavily from Google's **Material Design**, but doesn't actually use it.

Material Design ships a full component library: buttons, cards, navigation bars, the whole thing. Pulling it in would mean bundling an entire UI framework and ending up with something that looks like another Google app. I wanted this place to have its own personality, not feel like a polished Google Docs template.

So instead of the components, I took the **thinking behind them**:

- **Typography**: English uses JetBrains Mono and Chinese uses Huawei's Harmony OS Sans, merged into a single font. To keep load times fast, the combined font is sliced into 20 shards that load on demand, avoiding a multi-megabyte upfront download while keeping Chinese and English text visually consistent.
- **Color roles**: Material Design has a system where every color has a job, backgrounds, containers, accents, and they don't just get thrown around arbitrarily. I built a dark theme following that logic, anchored around a warm orange, with everything else growing out from it.
- **Depth through tone**: Different shades of grey give the page a sense of layers. Cards sit slightly above the background, hover states lift a little more. Your eye knows where to land without anything explicitly pointing at it.
- **Motion**: Buttons ripple when you click them, a classic Material Design touch, but hand-rolled with adjusted colors and timing so it doesn't read as "off-the-shelf Google." Transitions between articles and panels fade in rather than snapping, which keeps things from feeling abrupt.
- **Radius and space**: Consistently generous corner rounding, with breathing room between elements. The goal was calm, not cramped.

Put together, it's roughly "inspired by Material Design, but grown into something of its own."

## About AI

One thing I can't leave out: from the little 95.exe gimmick to this blog itself, **a lot of the code, design ideas, docs, and even the draft of this post lean heavily on AI**

I treat AI as an extremely patient pair-programming partner. It writes a draft, I read, edit, delete, redirect, then iterate until it feels like "this is what I actually wanted." It turns vague ideas into something concrete I can poke holes in; the poking, judgment, and final decisions still sit with me.

I genuinely enjoy working this way. So if you find something on this site that reads particularly well, that's probably AI and me grinding it out together; if something reads weirdly, that's probably me not grinding it enough.

## That's it

Feel free to poke around. Updates will come slowly.

<p style="color: var(--muted); font-size: 14px; margin-top: 32px;">— Louie, written in Melbourne</p>
