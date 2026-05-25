The aesthetics of restraint is a design — and life — philosophy that believes "less is more," prizing moderation, balance, and a sense of proportion. It works by subtraction: stripping away redundant ornament so that strength can concentrate in precise proportions, natural texture, and a deeper mood — arriving at an elegance that is understated, refined, and quietly tense. This blog update is a milestone one, because it adds support for Markdown posts, letting an extremely simple format produce a polished result.

## Preface: why I took this path

I care more about two things: **content** and **longevity**. Content is the lead. I want what you remember on the way out to be a project or a sentence, not "that background effect was cool." The quiet shell exists so the things inside can be heard. As for longevity — neon gradients and flashy particles are the trend of the last couple of years, but trends expire, and they'll mostly look awkward in three years; a field of warm grey and a sand-colored orange is the kind of pairing you can come back to in ten years without wincing. I'd rather have a site that holds up on the second and third look than one that only wins the first.

That's the aesthetics of restraint: cut everything you can, so the parts that deserve care get it without compromise. It's why I so admire the designs that genuinely age well — Material Design, for one. Even though Google itself has moved on from it, I still think it's the most disciplined, most rigorous take on minimalist aesthetics we have today.

## The main feature: what this update changed

### The blog as it was

This blog system was born for an extreme degree of customization in the first place. You can see it in the C-language tutorials: they're threaded through with a lot of external **HTML** to produce those nice animations. I know it looks cool, but it was a huge challenge — for me and for the AI alike — because the blog already uses a fairly elaborate pipeline to load, and on top of that the posts themselves leaned on heaps of **HTML**. It was tedious. And most posts don't need features that advanced anyway.

### A new era arrives

So, **Markdown** showed up. Technically it went from *cramming a whole post, HTML tags and all, into a JavaScript template string and then injecting it into the page as a `<script>`* to *a standalone, pure `.md` file that the browser fetches on the front end and hands to an interpreter to translate into HTML on the fly*. Under the hood it looks more complex — there's now an interpreter, a parsing library, and I even gave up double-click-to-preview-locally for it — but the authoring end got far simpler. I can spin up a post with a tiny Python tool and write it in a WYSIWYG editor like **Typora**, instead of opening the cumbersome **Visual Studio Code**. And to keep the advanced features available, I still kept the **HTML** path — an escape hatch ready for the next complex post.

## Closing

Writing this, I realized the update itself is an exercise in the aesthetics of restraint.

Markdown's syntax is a textbook case of "less is more": a handful of symbols — `#`, `*`, `-` — are enough to express headings, emphasis, and lists, with not one redundant tag. I deleted that tedious wrapper layer and poured the saved effort back into what actually matters: the words themselves. And the **HTML** path I deliberately kept means that when I really need to, I can still cut loose and build something elaborate — restraint was never about being unable to, it's about not doing it by default and only reaching for it when it's needed.

<p style="color: var(--muted); font-size: 14px; margin-top: 32px;">— Louie, written in Melbourne</p>
