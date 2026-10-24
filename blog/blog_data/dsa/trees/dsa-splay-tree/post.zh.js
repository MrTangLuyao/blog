/* Post body — dsa-splay-tree / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-splay-tree:zh'] = `
<p class="lead">伸展树（splay tree）是一种自调整（self-adjusting）的二叉搜索树（BST）：每访问一个结点，就用一串旋转（rotation）把它搬到根。它不维持平衡，单次操作最坏 O(n)，但任意一串操作平摊下来每次 O(log n)。</p>

<h2>为什么把访问过的结点搬到根</h2>
<p>课上的例子：全体学生按名字（first name）建成 BST 供查找。常见的名字被查得多，罕见的名字很少被查。AVL 这类平衡树对所有键一视同仁，每次查找都走约 log₂ n 层；若常查的名字离根近，最常查的那个就在根上，O(1) 就能找到。</p>
<p>伸展树不统计频率，只守一条规则：<strong>每访问一个结点（查找、插入），就把它旋转到根</strong>，这个过程叫伸展（splay）。常被访问的键不断被拉回根附近，久不访问的键逐渐沉到下面。树的形状由访问历史决定；结点不存高度或平衡因子，也没有平衡条件。</p>

<h2>三种伸展步骤</h2>
<p>记被访问的结点为 x，父结点（parent）p，祖父（grandparent）g。“把 x 转上去”就是在 p 处做一次旋转（见 3.6 AVL 旋转）：x 是左孩子就右旋，是右孩子就左旋。每一步按 x <strong>当前</strong>的 p、g 从下表选一种，重复到 x 成为根。</p>

<table>
<thead><tr><th>情况</th><th>条件</th><th>怎么转</th></tr></thead>
<tbody>
<tr><td>zig（一步）</td><td>p 是根</td><td>在 p 处转一次</td></tr>
<tr><td>zig-zig（两步，外侧）</td><td>x、p 同侧：都是左孩子（LL）或都是右孩子（RR）</td><td><strong>先在 g 处转（p 上来），再在 p 处转（x 上来）</strong></td></tr>
<tr><td>zig-zag（两步，内侧）</td><td>x、p 异侧（LR 或 RL）</td><td><strong>x 连升两次：先在 p 处转，再在 g 处转</strong></td></tr>
</tbody>
</table>

<p>课上把它们叫一步情况和两步情况，两步情况按 g → p → x 的方向分外侧 LL、RR 和内侧 LR、RL（与 AVL 的命名相同）。下图是课上的三个例子，另一侧是镜像：</p>

<figure class="fig">
<svg viewBox="0 0 580 466" width="580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="伸展的三种基本步骤：zig、zig-zig、zig-zag，每一步旋转后的形状"><g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="8" y1="150" x2="572" y2="150"/><line x1="8" y1="310" x2="572" y2="310"/></g><text x="12" y="14" fill="#e8e8e8" font-size="14" font-weight="700">zig（一步）：父结点是根</text><line x1="69" y1="53" x2="81" y2="69" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="60" cy="41" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="90" cy="81" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="60" y="46" fill="#e8e8e8">1</text><text x="90" y="86" fill="#ffffff">2</text></g><line x1="143" y1="71" x2="217" y2="71" stroke="#a1a1a0" stroke-width="2"/><polygon points="227,71 216,65 216,77" fill="#a1a1a0"/><text x="185" y="61" fill="#a1a1a0" font-size="12" text-anchor="middle">在 1 处左旋</text><line x1="301" y1="53" x2="289" y2="69" stroke="#4ade80" stroke-width="2.5"/><g><circle cx="280" cy="81" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="310" cy="41" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="280" y="86" fill="#e8e8e8">1</text><text x="310" y="46" fill="#ffffff">2</text></g><text x="12" y="174" fill="#e8e8e8" font-size="14" font-weight="700">zig-zig（两步·外侧，RR）：先转祖父，再转父亲</text><line x1="54" y1="213" x2="66" y2="229" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="84" y1="253" x2="96" y2="269" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="45" cy="201" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="75" cy="241" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="105" cy="281" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="45" y="206" fill="#e8e8e8">1</text><text x="75" y="246" fill="#e8e8e8">2</text><text x="105" y="286" fill="#ffffff">3</text></g><line x1="143" y1="231" x2="217" y2="231" stroke="#a1a1a0" stroke-width="2"/><polygon points="227,231 216,225 216,237" fill="#a1a1a0"/><text x="185" y="221" fill="#a1a1a0" font-size="12" text-anchor="middle">在 1 处左旋</text><line x1="286" y1="213" x2="274" y2="229" stroke="#4ade80" stroke-width="2.5"/><line x1="304" y1="213" x2="316" y2="229" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="265" cy="241" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="295" cy="201" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="325" cy="241" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="265" y="246" fill="#e8e8e8">1</text><text x="295" y="206" fill="#e8e8e8">2</text><text x="325" y="246" fill="#ffffff">3</text></g><line x1="363" y1="231" x2="437" y2="231" stroke="#a1a1a0" stroke-width="2"/><polygon points="447,231 436,225 436,237" fill="#a1a1a0"/><text x="405" y="221" fill="#a1a1a0" font-size="12" text-anchor="middle">在 2 处左旋</text><line x1="506" y1="253" x2="494" y2="269" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="536" y1="213" x2="524" y2="229" stroke="#4ade80" stroke-width="2.5"/><g><circle cx="485" cy="281" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="515" cy="241" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="545" cy="201" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="485" y="286" fill="#e8e8e8">1</text><text x="515" y="246" fill="#e8e8e8">2</text><text x="545" y="206" fill="#ffffff">3</text></g><text x="12" y="334" fill="#e8e8e8" font-size="14" font-weight="700">zig-zag（两步·内侧，RL）：x 连升两次</text><line x1="57.5" y1="369.3" x2="92.5" y2="392.7" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="96" y1="413" x2="84" y2="429" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="45" cy="361" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="75" cy="441" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="105" cy="401" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="45" y="366" fill="#e8e8e8">1</text><text x="75" y="446" fill="#ffffff">2</text><text x="105" y="406" fill="#e8e8e8">3</text></g><line x1="143" y1="391" x2="217" y2="391" stroke="#a1a1a0" stroke-width="2"/><polygon points="227,391 216,385 216,397" fill="#a1a1a0"/><text x="185" y="381" fill="#a1a1a0" font-size="12" text-anchor="middle">在 3 处右旋</text><line x1="274" y1="373" x2="286" y2="389" stroke="#4ade80" stroke-width="2.5"/><line x1="304" y1="413" x2="316" y2="429" stroke="#4ade80" stroke-width="2.5"/><g><circle cx="265" cy="361" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="295" cy="401" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="325" cy="441" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="265" y="366" fill="#e8e8e8">1</text><text x="295" y="406" fill="#ffffff">2</text><text x="325" y="446" fill="#e8e8e8">3</text></g><line x1="363" y1="391" x2="437" y2="391" stroke="#a1a1a0" stroke-width="2"/><polygon points="447,391 436,385 436,397" fill="#a1a1a0"/><text x="405" y="381" fill="#a1a1a0" font-size="12" text-anchor="middle">在 1 处左旋</text><line x1="506" y1="373" x2="494" y2="389" stroke="#4ade80" stroke-width="2.5"/><line x1="524" y1="373" x2="536" y2="389" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="485" cy="401" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="515" cy="361" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="545" cy="401" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="485" y="406" fill="#e8e8e8">1</text><text x="515" y="366" fill="#ffffff">2</text><text x="545" y="406" fill="#e8e8e8">3</text></g></svg>
<figcaption>课上的三个基本情况。橙色是被访问的 x，黄圈是它开始时的 p、g，绿线是这次旋转新接上的指针。</figcaption>
</figure>

<p>两种两步情况的结果：<strong>zig-zig 把链 1-2-3 翻转成 3-2-1</strong>；<strong>zig-zag 让 x 当根、p 和 g 分列两边</strong>，和 AVL 的 RL 双旋转一样。</p>

<div class="callout warn" data-label="易错">
<p><strong>zig-zig 的顺序不能反。</strong>若把 3 连转两次（先在 2 处、再在 1 处），得到 3 的左孩子 1、1 的右孩子 2，不是 3-2-1。这种只把 x 往上转的做法（move-to-root）在链上会让其余结点各深一层，没有 O(log n) 保证：在 1000 个结点的左链上依次访问 1…1000 两轮，伸展树共走 8748 条边，move-to-root 要走 1000998 条。</p>
</div>

<div class="callout key" data-label="考点">
<ul>
<li>每一步按 x <strong>当前</strong>的 p、g 重新判断，不看原来的树。</li>
<li>从 x 往上两层两层地做，<strong>只有 p 是根时才做 zig</strong>：zig 最多一次，一定是最后一步，x 的深度为奇数时才出现。深度为 d 的结点共转 d 次。</li>
<li>旋转不改变中序（in-order）序列，画完用中序检查。</li>
</ul>
</div>

<h2>例题：把深度 5 的结点伸展到根</h2>
<p>依次插入 50, 10, 60, 40, 20, 45, 25, 22, 30, 28, 35，得到图 ① 的普通 BST。访问 30：路径 50 → 10 → 40 → 20 → 25 → 30，深度 5 = 2 + 2 + 1，要做两个两步、一个一步。</p>

<figure class="fig">
<svg viewBox="0 0 580 544" width="580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="例题：访问 30，经过 zig-zig、zig-zag、zig 三步到达根"><g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="290" y1="4" x2="290" y2="540"/><line x1="4" y1="268" x2="576" y2="268"/></g><text x="10" y="14" fill="#e8e8e8" font-size="13" font-weight="700">① 访问 30：深度 5</text><line x1="37.7" y1="75.6" x2="180.3" y2="104.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="59.6" y1="148.5" x2="86.4" y2="167.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="89.5" y1="185.6" x2="80.5" y2="198.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="107.6" y1="182.5" x2="134.4" y2="201.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="137.5" y1="219.6" x2="128.5" y2="232.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="152.5" y1="219.6" x2="161.5" y2="232.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="180.3" y1="110" x2="61.7" y2="138" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="200.5" y1="117.6" x2="209.5" y2="130.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="228.2" y1="41" x2="37.8" y2="71" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="248.5" y1="49.6" x2="257.5" y2="62.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="25" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="49" cy="141" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="73" cy="209" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="97" cy="175" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="121" cy="243" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="145" cy="209" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="169" cy="243" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="193" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="217" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="241" cy="39" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="265" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="25" y="77.7" fill="#e8e8e8">10</text><text x="49" y="145.7" fill="#e8e8e8">20</text><text x="73" y="213.7" fill="#e8e8e8">22</text><text x="97" y="179.7" fill="#e8e8e8">25</text><text x="121" y="247.7" fill="#e8e8e8">28</text><text x="145" y="213.7" fill="#ffffff">30</text><text x="169" y="247.7" fill="#e8e8e8">35</text><text x="193" y="111.7" fill="#e8e8e8">40</text><text x="217" y="145.7" fill="#e8e8e8">45</text><text x="241" y="43.7" fill="#e8e8e8">50</text><text x="265" y="77.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="33" y="130" text-anchor="end" fill="#fbbf24">g</text><text x="113" y="164" text-anchor="start" fill="#fbbf24">p</text><text x="161" y="198" text-anchor="start" fill="#d97757">x</text></g><text x="300" y="14" fill="#e8e8e8" font-size="13" font-weight="700">② zig-zig 之后</text><line x1="327.7" y1="75.6" x2="470.3" y2="104.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="346.5" y1="219.6" x2="355.5" y2="232.4" stroke="#4ade80" stroke-width="2.5"/><line x1="376.4" y1="182.5" x2="349.6" y2="201.5" stroke="#4ade80" stroke-width="2.5"/><line x1="394.5" y1="185.6" x2="403.5" y2="198.4" stroke="#4ade80" stroke-width="2.5"/><line x1="424.4" y1="148.5" x2="397.6" y2="167.5" stroke="#4ade80" stroke-width="2.5"/><line x1="442.5" y1="151.6" x2="451.5" y2="164.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="472.4" y1="114.5" x2="445.6" y2="133.5" stroke="#4ade80" stroke-width="2.5"/><line x1="490.5" y1="117.6" x2="499.5" y2="130.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="518.2" y1="41" x2="327.8" y2="71" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="538.5" y1="49.6" x2="547.5" y2="62.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="315" cy="73" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="339" cy="209" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="363" cy="243" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="387" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="411" cy="209" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="435" cy="141" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="459" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="483" cy="107" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="507" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="531" cy="39" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="555" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="315" y="77.7" fill="#e8e8e8">10</text><text x="339" y="213.7" fill="#e8e8e8">20</text><text x="363" y="247.7" fill="#e8e8e8">22</text><text x="387" y="179.7" fill="#e8e8e8">25</text><text x="411" y="213.7" fill="#e8e8e8">28</text><text x="435" y="145.7" fill="#ffffff">30</text><text x="459" y="179.7" fill="#e8e8e8">35</text><text x="483" y="111.7" fill="#e8e8e8">40</text><text x="507" y="145.7" fill="#e8e8e8">45</text><text x="531" y="43.7" fill="#e8e8e8">50</text><text x="555" y="77.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="299" y="62" text-anchor="end" fill="#fbbf24">g</text><text x="419" y="130" text-anchor="end" fill="#d97757">x</text><text x="499" y="96" text-anchor="start" fill="#fbbf24">p</text></g><text x="10" y="294" fill="#e8e8e8" font-size="13" font-weight="700">③ zig-zag 之后</text><line x1="36.8" y1="392.6" x2="85.2" y2="415.4" stroke="#4ade80" stroke-width="2.5"/><line x1="56.5" y1="465.6" x2="65.5" y2="478.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="86.4" y1="428.5" x2="59.6" y2="447.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="104.5" y1="431.6" x2="113.5" y2="444.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="132.5" y1="356.5" x2="37.5" y2="383.5" stroke="#4ade80" stroke-width="2.5"/><line x1="155.6" y1="360.5" x2="182.4" y2="379.5" stroke="#4ade80" stroke-width="2.5"/><line x1="185.5" y1="397.6" x2="176.5" y2="410.4" stroke="#4ade80" stroke-width="2.5"/><line x1="200.5" y1="397.6" x2="209.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="228.7" y1="323.3" x2="157.3" y2="348.7" stroke="#4ade80" stroke-width="2.5"/><line x1="248.5" y1="329.6" x2="257.5" y2="342.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="25" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="49" cy="455" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="73" cy="489" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="97" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="121" cy="455" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="145" cy="353" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="169" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="193" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="217" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="241" cy="319" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="265" cy="353" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="25" y="391.7" fill="#e8e8e8">10</text><text x="49" y="459.7" fill="#e8e8e8">20</text><text x="73" y="493.7" fill="#e8e8e8">22</text><text x="97" y="425.7" fill="#e8e8e8">25</text><text x="121" y="459.7" fill="#e8e8e8">28</text><text x="145" y="357.7" fill="#ffffff">30</text><text x="169" y="425.7" fill="#e8e8e8">35</text><text x="193" y="391.7" fill="#e8e8e8">40</text><text x="217" y="425.7" fill="#e8e8e8">45</text><text x="241" y="323.7" fill="#e8e8e8">50</text><text x="265" y="357.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="129" y="342" text-anchor="end" fill="#d97757">x</text><text x="257" y="308" text-anchor="start" fill="#fbbf24">p</text></g><text x="300" y="294" fill="#e8e8e8" font-size="13" font-weight="700">④ zig 之后：30 是根</text><line x1="326.8" y1="358.6" x2="375.2" y2="381.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="346.5" y1="431.6" x2="355.5" y2="444.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="376.4" y1="394.5" x2="349.6" y2="413.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="394.5" y1="397.6" x2="403.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="422.5" y1="322.5" x2="327.5" y2="349.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="447.3" y1="323.3" x2="518.7" y2="348.7" stroke="#4ade80" stroke-width="2.5"/><line x1="475.5" y1="397.6" x2="466.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="490.5" y1="397.6" x2="499.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="520.4" y1="360.5" x2="493.6" y2="379.5" stroke="#4ade80" stroke-width="2.5"/><line x1="538.5" y1="363.6" x2="547.5" y2="376.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="315" cy="353" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="339" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="363" cy="455" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="387" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="411" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="435" cy="319" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="459" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="483" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="507" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="531" cy="353" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="555" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="315" y="357.7" fill="#e8e8e8">10</text><text x="339" y="425.7" fill="#e8e8e8">20</text><text x="363" y="459.7" fill="#e8e8e8">22</text><text x="387" y="391.7" fill="#e8e8e8">25</text><text x="411" y="425.7" fill="#e8e8e8">28</text><text x="435" y="323.7" fill="#ffffff">30</text><text x="459" y="425.7" fill="#e8e8e8">35</text><text x="483" y="391.7" fill="#e8e8e8">40</text><text x="507" y="425.7" fill="#e8e8e8">45</text><text x="531" y="357.7" fill="#e8e8e8">50</text><text x="555" y="391.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="451" y="308" text-anchor="start" fill="#d97757">x</text></g></svg>
<figcaption>黄圈和 p、g 标出下一步要用的父结点和祖父，绿线是上一步新接的指针。</figcaption>
</figure>

<ol>
<li><strong>zig-zig（RR）</strong>：p = 25，g = 20，30 是 25 的右孩子，25 是 20 的右孩子。先在 20 处左旋：25 上来，20 成为 25 的左孩子，25 原来的左孩子 22 改挂为 20 的右孩子。再在 25 处左旋：30 上来，25 成为 30 的左孩子，30 原来的左孩子 28 改挂为 25 的右孩子。以 30 为根的新子树接回 20 原来的位置，即 40 的左边。</li>
<li><strong>zig-zag（RL）</strong>：p = 40，g = 10，30 是 40 的左孩子，40 是 10 的右孩子。先在 40 处右旋：30 上来，40 成为 30 的右孩子，30 原来的右孩子 35 改挂为 40 的左孩子。再在 10 处左旋：30 上来，10 成为 30 的左孩子，30 原来的左子树（以 25 为根）改挂为 10 的右子树。30 接到 50 的左边。</li>
<li><strong>zig</strong>：p = 50 是根。在 50 处右旋：30 成为根，50 成为它的右孩子，30 原来的右子树（以 40 为根）改挂为 50 的左子树。</li>
</ol>
<p>共 5 次旋转，中序序列始终是 10, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60。树高从 7 降到 5（本课程叶子高度为 1），但结果并不平衡：10 的左子树高 0、右子树高 3。<strong>伸展树不是平衡树</strong>，它只保证刚访问的键在根上。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-splay-tree/anims/splay.html" loading="lazy" style="height: 540px;" title="伸展树：把访问的结点转到根"></iframe>
<p class="anim-caption">按钮切换例题和“链”；点树上任意结点，就从当前这棵树出发把它伸展到根，每一步标出情况名称，红色虚线是将被改掉的指针。</p>

<h2>C 代码：带父指针的伸展</h2>
<p>伸展从 x 开始往上做，要能找到 p 和 g，所以结点多存一个 <code>parent</code> 指针。<code>rotate_up(x)</code> 把 x 转到父结点的位置；两种两步情况只差第一次转谁：zig-zig 先转 p，zig-zag 先转 x。</p>
<pre><code>#include &lt;stdlib.h&gt;

typedef struct node node_t;
struct node {
    int key;
    node_t *left, *right;
    node_t *parent;                     /* 根的 parent 是 NULL */
};

/* 把 x 转到父结点 p 的位置：x 是左孩子就在 p 处右旋，否则左旋 */
void rotate_up(node_t *x) {
    node_t *p = x-&gt;parent, *g = p-&gt;parent;
    if (x == p-&gt;left) {                 /* 右旋：x 的右子树交给 p */
        p-&gt;left = x-&gt;right;
        if (x-&gt;right != NULL) x-&gt;right-&gt;parent = p;
        x-&gt;right = p;
    } else {                            /* 左旋：x 的左子树交给 p */
        p-&gt;right = x-&gt;left;
        if (x-&gt;left != NULL) x-&gt;left-&gt;parent = p;
        x-&gt;left = p;
    }
    p-&gt;parent = x;
    x-&gt;parent = g;                      /* x 接到 p 原来的位置 */
    if (g != NULL) {
        if (g-&gt;left == p) g-&gt;left = x;
        else g-&gt;right = x;
    }
}

/* 把 x 伸展到根，返回新根（就是 x） */
node_t *splay(node_t *x) {
    while (x-&gt;parent != NULL) {
        node_t *p = x-&gt;parent, *g = p-&gt;parent;
        if (g == NULL) {                                /* zig：p 是根 */
            rotate_up(x);
        } else if ((x == p-&gt;left) == (p == g-&gt;left)) {  /* zig-zig：同侧 */
            rotate_up(p);               /* 先在 g 处转，p 上来 */
            rotate_up(x);               /* 再在 p 处转，x 上来 */
        } else {                                        /* zig-zag：异侧 */
            rotate_up(x);               /* 在 p 处转 */
            rotate_up(x);               /* 在 g 处转 */
        }
    }
    return x;
}

/* 查找 key：找到的结点（找不到就取最后访问的结点）伸展到根，返回新根 */
node_t *splay_find(node_t *root, int key) {
    node_t *t = root, *last = NULL;
    while (t != NULL &amp;&amp; t-&gt;key != key) {
        last = t;
        t = (key &lt; t-&gt;key) ? t-&gt;left : t-&gt;right;
    }
    if (t == NULL) t = last;            /* 没找到 */
    return (t == NULL) ? NULL : splay(t);
}</code></pre>
<ul>
<li>调用：<code>root = splay_find(root, key);</code>，再用 <code>root != NULL &amp;&amp; root-&gt;key == key</code> 判断是否找到。根几乎每次都变，必须接住返回值。</li>
<li><strong>查找失败也要伸展</strong>最后访问的结点。否则沿同一条长路径反复做失败查找，每次 O(n)，树却从不变矮。</li>
<li>插入：按 BST 规则挂上新叶子并设好 <code>parent</code>，再 <code>root = splay(新结点);</code>。</li>
<li>每次旋转 O(1)；伸展深度为 d 的结点转 d 次，O(d)。</li>
</ul>

<h2>复杂度：单次 O(n)，摊还 O(log n)</h2>
<p>伸展树没有平衡条件，高度可以达到 n。从空树依次插入 1, 2, …, 7 会得到左链 7 → 6 → … → 1（过程见练习 4），这时访问 1 要走 6 条边：<strong>单次操作最坏 O(n)</strong>。</p>
<p>但这次昂贵的访问做了三次 zig-zig，树高从 7 降到 5；链越长越明显，1000 个结点的链伸展最底下的结点后，高度从 1000 降到 502。贵的操作把树变矮，后面的操作就便宜。可以证明：<strong>从空树开始的任意 m 次操作总共 O(m log n)，平均每次 O(log n)</strong>，这叫摊还（amortised）复杂度。课上称为“平均”，但它不是对随机输入取平均，而是对任何操作序列都成立；它也不保证每一次都快。</p>

<table>
<thead><tr><th></th><th>AVL 树</th><th>伸展树</th></tr></thead>
<tbody>
<tr><td>结点额外信息</td><td>高度（或 BF）</td><td>无（parent 只为写起来方便）</td></tr>
<tr><td>何时旋转</td><td>插入、删除后出现失衡</td><td>每次访问，包括查找</td></tr>
<tr><td>单次操作最坏</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>m 次操作总计</td><td>O(m log n)</td><td>O(m log n)（摊还）</td></tr>
<tr><td>适合</td><td>每次都必须快</td><td>访问频率不均，常用的键反复被访问</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
<li><strong>画图题</strong>：给一棵 BST 和要访问的键，画出每一步后的树，写明情况名称（zig / zig-zig / zig-zag，或课上的一步、两步外侧、两步内侧）和旋转位置。</li>
<li><strong>判断情况</strong>：给出 x、p、g 的左右关系，问属于哪种情况、按什么顺序在哪里旋转。</li>
<li><strong>概念选择题</strong>：伸展树是否平衡；单次最坏与摊还复杂度；与 AVL 的区别；适合什么访问模式。2015、2016 年期末的旋转题题干也提到了伸展树。</li>
<li><strong>必须背</strong>：三种情况的条件和旋转顺序；单次 O(n)、摊还 O(log n)。公式表上没有这些内容。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>zig-zig 先转 x，形状就错了。</li>
<li>从根往下两两配对：深度为奇数时先在底部做 zig、再两步两步往上，结果不同。例题这样做，最后 10 的右孩子是 20 而不是 25。zig 只能留到最后、在根上做。</li>
<li>转完一步忘了把新子树接回原来 g 的父结点。</li>
<li>把“摊还 O(log n)”说成“最坏 O(log n)”，或以为伸展后树一定变矮。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 依次插入 40, 20, 60, 10, 30, 50, 70, 5, 15 得到一棵普通 BST。在这棵树上访问 5（把 5 伸展到根），写出每一步的情况和旋转，画出最终的树。</summary>
<div class="qa__body">
<figure class="fig">
<svg viewBox="0 0 678 194" width="678" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="练习 1：访问 5，先 zig-zig 再 zig"><g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="226" y1="4" x2="226" y2="190"/><line x1="452" y1="4" x2="452" y2="190"/></g><text x="8" y="14" fill="#e8e8e8" font-size="13" font-weight="700">开始：5 的深度 3</text><line x1="39.9" y1="117.9" x2="32.1" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="54.1" y1="117.9" x2="61.9" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="80.7" y1="80.9" x2="57.3" y2="99.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="98.1" y1="83.9" x2="105.9" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="124.7" y1="46.9" x2="101.3" y2="65.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="145.3" y1="46.9" x2="168.7" y2="65.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="171.9" y1="83.9" x2="164.1" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="186.1" y1="83.9" x2="193.9" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="25" cy="141" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="47" cy="107" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="69" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="91" cy="73" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="113" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="135" cy="39" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="157" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="179" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="201" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="25" y="145.7" fill="#ffffff">5</text><text x="47" y="111.7" fill="#e8e8e8">10</text><text x="69" y="145.7" fill="#e8e8e8">15</text><text x="91" y="77.7" fill="#e8e8e8">20</text><text x="113" y="111.7" fill="#e8e8e8">30</text><text x="135" y="43.7" fill="#e8e8e8">40</text><text x="157" y="111.7" fill="#e8e8e8">50</text><text x="179" y="77.7" fill="#e8e8e8">60</text><text x="201" y="111.7" fill="#e8e8e8">70</text></g><g font-size="12" font-weight="700"><text x="9" y="130" text-anchor="end" fill="#d97757">x</text><text x="31" y="96" text-anchor="end" fill="#fbbf24">p</text><text x="75" y="62" text-anchor="end" fill="#fbbf24">g</text></g><text x="234" y="14" fill="#e8e8e8" font-size="13" font-weight="700">① zig-zig 之后</text><line x1="258.1" y1="83.9" x2="265.9" y2="96.1" stroke="#4ade80" stroke-width="2.5"/><line x1="283.3" y1="114.9" x2="306.7" y2="133.1" stroke="#4ade80" stroke-width="2.5"/><line x1="309.9" y1="151.9" x2="302.1" y2="164.1" stroke="#4ade80" stroke-width="2.5"/><line x1="324.1" y1="151.9" x2="331.9" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="348.6" y1="42.8" x2="263.4" y2="69.2" stroke="#4ade80" stroke-width="2.5"/><line x1="371.3" y1="46.9" x2="394.7" y2="65.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="397.9" y1="83.9" x2="390.1" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="412.1" y1="83.9" x2="419.9" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="251" cy="73" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="273" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="295" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="317" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="339" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="361" cy="39" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="383" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="405" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="427" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="251" y="77.7" fill="#ffffff">5</text><text x="273" y="111.7" fill="#e8e8e8">10</text><text x="295" y="179.7" fill="#e8e8e8">15</text><text x="317" y="145.7" fill="#e8e8e8">20</text><text x="339" y="179.7" fill="#e8e8e8">30</text><text x="361" y="43.7" fill="#e8e8e8">40</text><text x="383" y="111.7" fill="#e8e8e8">50</text><text x="405" y="77.7" fill="#e8e8e8">60</text><text x="427" y="111.7" fill="#e8e8e8">70</text></g><g font-size="12" font-weight="700"><text x="235" y="62" text-anchor="end" fill="#d97757">x</text><text x="377" y="28" text-anchor="start" fill="#fbbf24">p</text></g><text x="460" y="14" fill="#e8e8e8" font-size="13" font-weight="700">② zig 之后</text><line x1="489.4" y1="42.8" x2="574.6" y2="69.2" stroke="#4ade80" stroke-width="2.5"/><line x1="509.3" y1="114.9" x2="532.7" y2="133.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="535.9" y1="151.9" x2="528.1" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="550.1" y1="151.9" x2="557.9" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="574.9" y1="77.7" x2="511.1" y2="102.3" stroke="#4ade80" stroke-width="2.5"/><line x1="597.3" y1="80.9" x2="620.7" y2="99.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="623.9" y1="117.9" x2="616.1" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="638.1" y1="117.9" x2="645.9" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="477" cy="39" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="499" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="521" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="543" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="565" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="587" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="609" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="631" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="653" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="477" y="43.7" fill="#ffffff">5</text><text x="499" y="111.7" fill="#e8e8e8">10</text><text x="521" y="179.7" fill="#e8e8e8">15</text><text x="543" y="145.7" fill="#e8e8e8">20</text><text x="565" y="179.7" fill="#e8e8e8">30</text><text x="587" y="77.7" fill="#e8e8e8">40</text><text x="609" y="145.7" fill="#e8e8e8">50</text><text x="631" y="111.7" fill="#e8e8e8">60</text><text x="653" y="145.7" fill="#e8e8e8">70</text></g><g font-size="12" font-weight="700"><text x="493" y="28" text-anchor="start" fill="#d97757">x</text></g></svg>
<figcaption>绿线是每一步新接的指针。</figcaption>
</figure>
<p>5 的深度 3 = 2 + 1：先一个两步，最后一个一步。</p>
<ol>
<li>x = 5，p = 10，g = 20。5 是 10 的左孩子，10 是 20 的左孩子：<strong>zig-zig（LL）</strong>。先在 20 处右旋：10 上来，20 成为 10 的右孩子，10 原来的右孩子 15 改挂为 20 的左孩子。再在 10 处右旋：5 上来，10 成为 5 的右孩子（5 没有右子树，10 的左边变空）。5 接到 40 的左边。</li>
<li>p = 40 是根：<strong>zig</strong>。在 40 处右旋：5 成为根，5 原来的右子树（以 10 为根）改挂为 40 的左子树。</li>
</ol>
<p>最终的树见图 ②，中序仍是 5, 10, 15, 20, 30, 40, 50, 60, 70。树高从 4 变成 5：伸展不保证树变矮。</p>
<p>若先在底部做 zig（5 绕 10 转）、再对 5、20、40 做 zig-zig，会得到根 5、右孩子 20 的另一棵树，是错的。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 对下面三种位置关系，各属于哪种情况？依次在哪里做什么旋转？(a) x 是 p 的右孩子，p 是 g 的左孩子；(b) x 是 p 的左孩子，p 是 g 的左孩子；(c) x 是 p 的左孩子，p 是根。</summary>
<div class="qa__body">
<p>(a) 异侧，<strong>zig-zag（LR）</strong>：x 连升两次。先在 p 处<strong>左旋</strong>（x 是右孩子），x 变成 g 的左孩子；再在 g 处<strong>右旋</strong>。结果 x 当根，p 是它的左孩子，g 是它的右孩子。</p>
<p>(b) 同侧，<strong>zig-zig（LL）</strong>：先在 g 处<strong>右旋</strong>（p 上来），再在 p 处<strong>右旋</strong>（x 上来）。结果是链 x → p → g，全是右孩子。</p>
<p>(c) <strong>zig</strong>：在 p 处右旋一次，x 成为根。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 多选：关于伸展树，下列哪些正确？A. 每个结点要存高度或平衡因子　B. 刚访问过的键在根上，紧接着再访问它只要 O(1)　C. 单次查找最坏 O(n)　D. 从空树开始任意 m 次操作总共 O(m log n)　E. 伸展之后树高不会增加　F. 伸展树始终满足 AVL 条件</summary>
<div class="qa__body">
<p>选 <strong>B、C、D</strong>。</p>
<ul>
<li>A 错：伸展树没有平衡条件，不需要高度信息。</li>
<li>B 对：访问后它就是根，下次比较一次就找到。</li>
<li>C 对：树可以是一条链，例如依次插入 1…7 后访问 1 要走 6 条边。</li>
<li>D 对：这就是摊还 O(log n)。</li>
<li>E 错：树 2（孩子 1、3）高 2，访问 1 后变成 1 → 2 → 3 的右链，高 3；练习 1 也从 4 变成 5。</li>
<li>F 错：例题伸展后 10 的左子树高 0、右子树高 3。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 从空伸展树开始依次插入 1, 2, 3, 4, 5, 6, 7（每次插入后伸展新结点），得到什么树？接着访问 1：要做哪些步骤、几次旋转、结果是什么？这和“每次 O(log n)”矛盾吗？</summary>
<div class="qa__body">
<figure class="fig">
<svg viewBox="0 0 440 262" width="440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="练习 4：插入 1 到 7 得到左链，访问 1 后树高降到 5"><g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="220" y1="4" x2="220" y2="258"/></g><text x="8" y="14" fill="#e8e8e8" font-size="13" font-weight="700">插入 1…7 之后</text><line x1="58.9" y1="219.9" x2="51.1" y2="232.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="80.9" y1="185.9" x2="73.1" y2="198.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="102.9" y1="151.9" x2="95.1" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="124.9" y1="117.9" x2="117.1" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="146.9" y1="83.9" x2="139.1" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="168.9" y1="49.9" x2="161.1" y2="62.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="44" cy="243" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="66" cy="209" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="88" cy="175" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="110" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="132" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="154" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="176" cy="39" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="44" y="247.7" fill="#ffffff">1</text><text x="66" y="213.7" fill="#e8e8e8">2</text><text x="88" y="179.7" fill="#e8e8e8">3</text><text x="110" y="145.7" fill="#e8e8e8">4</text><text x="132" y="111.7" fill="#e8e8e8">5</text><text x="154" y="77.7" fill="#e8e8e8">6</text><text x="176" y="43.7" fill="#e8e8e8">7</text></g><g font-size="12" font-weight="700"><text x="28" y="232" text-anchor="end" fill="#d97757">x</text><text x="50" y="198" text-anchor="end" fill="#fbbf24">p</text><text x="72" y="164" text-anchor="end" fill="#fbbf24">g</text></g><text x="228" y="14" fill="#e8e8e8" font-size="13" font-weight="700">访问 1 之后</text><line x1="276.4" y1="42.8" x2="361.6" y2="69.2" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="293.1" y1="151.9" x2="300.9" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="319.7" y1="114.9" x2="296.3" y2="133.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="337.1" y1="117.9" x2="344.9" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="363.7" y1="80.9" x2="340.3" y2="99.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="381.1" y1="83.9" x2="388.9" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="264" cy="39" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="286" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="308" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="330" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="352" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="374" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="396" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="264" y="43.7" fill="#ffffff">1</text><text x="286" y="145.7" fill="#e8e8e8">2</text><text x="308" y="179.7" fill="#e8e8e8">3</text><text x="330" y="111.7" fill="#e8e8e8">4</text><text x="352" y="145.7" fill="#e8e8e8">5</text><text x="374" y="77.7" fill="#e8e8e8">6</text><text x="396" y="111.7" fill="#e8e8e8">7</text></g><g font-size="12" font-weight="700"><text x="280" y="28" text-anchor="start" fill="#d97757">x</text></g></svg>
<figcaption>左：插入完成后的左链；右：访问 1 之后。</figcaption>
</figure>
<p>插入 k 时根是 k − 1，k 挂在它的右边，一次 zig（在 k − 1 处左旋）就成为根，原来的树成为 k 的左子树。所以插完是左链 7 → 6 → 5 → 4 → 3 → 2 → 1，高 7。</p>
<p>访问 1，深度 6 = 2 + 2 + 2，三次 <strong>zig-zig（LL）</strong>，每次先在 g 处右旋、再在 p 处右旋：</p>
<ol>
<li>x = 1，p = 2，g = 3：得到 1 → 右 2 → 右 3 这一段，挂在 4 的左边。</li>
<li>x = 1，p = 4，g = 5：先在 5 处右旋（4 上来，5 成为 4 的右孩子），再在 4 处右旋（1 上来，1 原来的右子树 2 → 3 改挂为 4 的左子树），1 接到 6 的左边。</li>
<li>x = 1，p = 6，g = 7：先在 7 处右旋，再在 6 处右旋，1 原来的右子树（以 4 为根）改挂为 6 的左子树。</li>
</ol>
<p>共 6 次旋转，结果见右图，树高 7 → 5。</p>
<p>不矛盾。O(log n) 是摊还的：7 次插入每次最多比较一次、转一次，很便宜；昂贵的那次访问把树压矮，之后的访问变快。8 次操作合起来仍在 O(m log n) 之内，只是不保证每一次都是 O(log n)。</p>
</div>
</details>
`;
