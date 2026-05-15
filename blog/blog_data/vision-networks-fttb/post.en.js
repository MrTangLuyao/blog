/* Post body — vision-networks-fttb / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['vision-networks-fttb:en'] = `
<p class="lead">If you're an apartment-dwelling international student in Australia like me, you've probably gone to sign up for internet only to find out that NBN at your address uses the telephone line — i.e., FTTB — caps out at 100 Mbps, and is wildly expensive. So you grumble about Australia's awful internet and resign yourself to that speed for years. Right? Here's the most thorough English-language guide to Vision Networks ever written.</p>

<h2>Part 1 — Introduction</h2>
<p>A few information gaps you might not be aware of:</p>

<p>1 — NBN isn't the only way to get online in Australia<br>
2 — Your apartment may have multiple technologies running at the same time<br>
3 — FTTB can actually exceed gigabit speeds</p>

<p>The story starts with a group called TPG — its members include TPG, iinet, and Vodafone. The group built a Vision network to compete with NBN, with sensible pricing and fast speeds. The key thing is they support Gfast technology, which lets the phone-line port reach gigabit. Possibly because it wasn't profitable, in 2025 Australia's fourth-largest ISP Vocus bought Vision. Even though the broadband was built by TPG, it's been sold off — but TPG is still the best at supporting Vision. Of course, we can also wait and see whether Dodo and iPrimus end up offering cheaper Vision plans in the future.</p>

<p>Right now the TPG group typically offers 500 Mbps plans with about a 3-month free trial plus around AUD 70–80/month — a very fair price.<br>
Take iinet's Ultra Broadband plan as an example. As of March 2026, the policy is: free router (return it if you don't keep service), three months free (cancel any time during the trial), AUD 79/month after that (real-world speeds around 850 Mbps in my testing — gigabit-class for Australia). Network quality is average for Australia; access to Chinese networks is poor — more on that later.</p>

<h2>Part 2 — Drawbacks</h2>
<p>Some major pitfalls, ranked from biggest to smallest ⚠️</p>

<p>1 — Going back from Vision to NBN requires a certified technician to do an MDF jumper-cabling job (see Part 4). Many companies used to support Vision but have all dropped support for various reasons — Superloop being the most famous example.</p>

<p>2 — TPG's reputation for service is just so-so, even pretty bad — from the web portal to customer support, it's all middling. Remember to give TPG 30 days' notice to cancel to avoid penalties; iinet/Vodafone are the better picks.</p>

<p>3 — Latency to Chinese networks is high (excluding sites with Australian CDNs like Bilibili and Douyin). In Victoria, the official modem caps speed at 500 Mbps; replacing the router can break that software limit and reach gigabit. If you want to play games on Chinese servers, you'll need an accelerator. On the technical side: first thing after getting the router, turn off IPv6. TPG's IPv6 support is genuinely terrible, and IPv4 — this plan does come with a public IPv4 — I really can't think of any scenario where IPv6 is essential. Disabling it actually speeds up Bilibili and Xiaohongshu access. As for Chinese-server games — take Delta Force (三角洲行动) on the CN server as an example: without an accelerator, latency is around 350 ms, the route clearly goes through the US, and packet loss is severe enough to make it unplayable. Valorant CN: 350 ms latency, you can't even ADS. With an accelerator, latency drops to around 145 ms — from Sydney to mainland China, that's excellent and counts as user-side optimization. Compared to NBN providers like Superloop and Neptune that are well-optimized for China and let you play CN games directly, TPG still covers this gap with an accelerator.</p>

<h2>Part 3 — Installation process</h2>
<p>1 — Apply online, fill in your address and router shipping address (which can differ from the install address)<br>
2 — Router gets delivered<br>
3 — After the router arrives, someone from the TPG group will call you to schedule the line install. Note: the website says they'll email you, but my repeated experience says they'll always call. You need to be present at the install. You can book far in advance, though I don't recommend it — I once booked 30 days ahead and yes, it did go through.<br>
4 — On install day, the technician enters the building's MDF to do the jumper cabling. In short, they check whether your phone line is on the Vision network — if it's on NBN, the technician will migrate it for you, and they'll bring a Gfast modem to install in your unit. You connect the unit's phone outlet to the Gfast modem with the phone cord, then connect the Gfast modem to the router. Newer routers auto-configure. If yours doesn't, definitely call to confirm — don't just sit and wait — because iinet uses PPPoE and needs login credentials. If you're using a third-party router, use the official one first; once it auto-configures, copy the username and password to your new router. From memory, TPG's account is a TPG email with password "no_password"; iinet's account is an iinet email with password "tpg_acs". You'll have to fill these in based on your own situation — they may differ by region. In Melbourne the password is essentially a formality at this point; PPPoE is still in use for legacy reasons.</p>

<h2>Part 4 — How to switch back to NBN</h2>
<p>If your unit supports NBN but you've already switched to Vision and you're unhappy with the latency, routing, stability, or just don't like TPG as a company — there's a way back. First, sign up for an NBN plan with any provider. If you're transferring, I strongly recommend using Neptune Internet as the bridge, because we'll most likely need to use their support, and their reps are all engineers — they're proactive about getting NBN faults fixed. Plus they offer a free 5-day trial, which we can use to complete the NBN switchover. Once you've applied, you might be online in about 5 minutes, prompted to plug in a VDSL modem. But — most likely you can't, because in most apartments Vision and NBN share the same copper line. At that point, report the situation honestly to Neptune and request an NBN technician callout. From my own experience, this doesn't cost extra. The technician will come out, inspect, and fix the connection. Note: NBN repairs are weekdays only, so plan accordingly. If you're unhappy with Neptune, switching out within the trial period costs nothing.</p>

<h2>Conclusion</h2>
<p>If your apartment is on FTTB and you want faster speeds, try non-NBN broadband like Vision — top speed can hit 1000 Mbps, and it's both cheaper and faster. I strongly advise against TPG itself because their service is too poor and they enforce 30-day cancellation notice. iinet and Vodafone should be your best FTTB Vision providers in 2026 — better still if Capti is available in your area. Three pitfalls to watch: (1) going back from Vision to NBN may require re-cabling at your own cost, (2) accessing purely-Chinese sites is slow, and (3) check the contract for any 30-day cancellation notice clauses.</p>
`;
