/* Post body — welcome / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['welcome:en'] = `
<p class="lead">Hi! I'm Louie, an international student from China, currently studying in Melbourne, Australia. Welcome to my blog, a quiet corner where I'll occasionally write about tech, life, and the occasional random thought.</p>

<h2>About this site</h2>
<p>The whole site is hand-written, line by line. Purely static, no database, no backend, deployed on Cloudflare Pages. The frontend is HTML, a sprinkle of Tailwind, and plain JavaScript.</p>

<h2>On the design language</h2>
<p>The visual style here borrows heavily from Google's <strong>Material Design</strong>, but doesn't actually use it.</p>
<p>Material Design ships a full component library: buttons, cards, navigation bars, the whole thing. Pulling it in would mean bundling an entire UI framework and ending up with something that looks like another Google app. I wanted this place to have its own personality, not feel like a polished Google Docs template.</p>
<p>So instead of the components, I took the <strong>thinking behind them</strong>:</p>
<ul>
  <li><strong>Typography</strong>: English uses JetBrains Mono and Chinese uses Huawei's Harmony OS Sans, merged into a single font. To keep load times fast, the combined font is sliced into 20 shards that load on demand, avoiding a multi-megabyte upfront download while keeping Chinese and English text visually consistent.</li>
  <li><strong>Color roles</strong>: Material Design has a system where every color has a job, backgrounds, containers, accents, and they don't just get thrown around arbitrarily. I built a dark theme following that logic, anchored around a warm orange, with everything else growing out from it.</li>
  <li><strong>Depth through tone</strong>: Different shades of grey give the page a sense of layers. Cards sit slightly above the background, hover states lift a little more. Your eye knows where to land without anything explicitly pointing at it.</li>
  <li><strong>Motion</strong>: Buttons ripple when you click them, a classic Material Design touch, but hand-rolled with adjusted colors and timing so it doesn't read as "off-the-shelf Google." Transitions between articles and panels fade in rather than snapping, which keeps things from feeling abrupt.</li>
  <li><strong>Radius and space</strong>: Consistently generous corner rounding, with breathing room between elements. The goal was calm, not cramped.</li>
</ul>
<p>Put together, it's roughly "inspired by Material Design, but grown into something of its own."</p>

<h2>About AI</h2>
<p>One thing I can't leave out: from the little 95.exe gimmick to this blog itself, <strong>a lot of the code, design ideas, docs, and even the draft of this post lean heavily on AI</strong> </p>
<p>I treat AI as an extremely patient pair-programming partner. It writes a draft, I read, edit, delete, redirect, then iterate until it feels like "this is what I actually wanted." It turns vague ideas into something concrete I can poke holes in; the poking, judgment, and final decisions still sit with me.</p>
<p>I genuinely enjoy working this way. So if you find something on this site that reads particularly well, that's probably AI and me grinding it out together; if something reads weirdly, that's probably me not grinding it enough.</p>

<h2>That's it</h2>
<p>Feel free to poke around. Updates will come slowly.</p>
<p style="color: var(--muted); font-size: 14px; margin-top: 32px;">— Louie, written in Melbourne</p>
`;
