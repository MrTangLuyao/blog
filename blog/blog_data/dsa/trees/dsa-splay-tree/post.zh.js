/* Post body — dsa-splay-tree / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-splay-tree:zh'] = `
<p class="lead">伸展树（splay tree）就是一棵普通的二叉搜索树（BST），外加一条规矩：<strong>每访问一个结点，就用旋转把它搬到根</strong>。搬的时候只有三种走法：zig、zig-zig、zig-zag。</p>

<h2>从一个场景说起</h2>
<p>想想书桌上的一摞文件。每次用完一份，你不放回原处，而是随手搁在最上面。</p>
<p>过一阵子，常用的几份都在上面，一伸手就拿到；很久没碰的沉到了底下。你从没统计过哪份常用，这摞文件却自己适应了你的习惯。</p>
<p>课上的例子是查学生名字。把全体学生按名字（first name）建成一棵 BST：常见的名字被查得多，罕见的很少有人查。AVL 树（见 3.5）对所有名字一视同仁，每次都走大约 log₂ n 层。要是最常查的名字就在根上，比较一次就找到了。</p>
<p>伸展树就是“用完放最上面”。</p>

<h2>它是什么</h2>
<p>简单说，伸展树 = 普通 BST + 一条规则：<strong>每访问一个结点（查找、插入），就把它旋转到根</strong>。这个动作叫伸展（splay）。树的形状随访问自己变，所以它是一种自调整（self-adjusting）树。</p>
<p>和 AVL 树最大的不同：<strong>伸展树不管平衡</strong>。结点不存高度，树长什么样，全看最近访问过谁。</p>

<h3>三个角色，三种步骤</h3>
<p>记被访问的结点为 x，它的父结点（parent）为 p，祖父（grandparent）为 g。</p>
<p>把 x 往上提一层，就是在 p 处做一次旋转（rotation，见 3.6）：x 是左孩子就右旋，是右孩子就左旋。伸展的每一步，按 x <strong>现在</strong>的 p 和 g 从三种情况里选一种：</p>

<table>
<thead><tr><th>情况</th><th>什么时候</th><th>怎么转</th></tr></thead>
<tbody>
<tr><td>zig（一步）</td><td>p 就是根</td><td>在 p 处转一次</td></tr>
<tr><td>zig-zig（两步，外侧）</td><td>x、p 同侧：都是左孩子（LL）或都是右孩子（RR）</td><td><strong>先在 g 处转（p 上来），再在 p 处转（x 上来）</strong></td></tr>
<tr><td>zig-zag（两步，内侧）</td><td>x、p 异侧（LR 或 RL）</td><td><strong>x 连升两次：先在 p 处转，再在 g 处转</strong></td></tr>
</tbody>
</table>

<p>课上叫一步情况和两步情况（外侧 LL、RR，内侧 LR、RL，和 AVL 的叫法一样）。下图是课上的三个例子，另一侧是镜像：</p>

<figure class="fig">
<svg viewBox="0 0 580 466" width="580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="伸展的三种基本步骤：zig、zig-zig、zig-zag，每一步旋转后的形状"><g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="8" y1="150" x2="572" y2="150"/><line x1="8" y1="310" x2="572" y2="310"/></g><text x="12" y="14" fill="#e8e8e8" font-size="14" font-weight="700">zig（一步）：父结点是根</text><line x1="69" y1="53" x2="81" y2="69" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="60" cy="41" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="90" cy="81" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="60" y="46" fill="#e8e8e8">1</text><text x="90" y="86" fill="#ffffff">2</text></g><line x1="143" y1="71" x2="217" y2="71" stroke="#a1a1a0" stroke-width="2"/><polygon points="227,71 216,65 216,77" fill="#a1a1a0"/><text x="185" y="61" fill="#a1a1a0" font-size="12" text-anchor="middle">在 1 处左旋</text><line x1="301" y1="53" x2="289" y2="69" stroke="#4ade80" stroke-width="2.5"/><g><circle cx="280" cy="81" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="310" cy="41" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="280" y="86" fill="#e8e8e8">1</text><text x="310" y="46" fill="#ffffff">2</text></g><text x="12" y="174" fill="#e8e8e8" font-size="14" font-weight="700">zig-zig（两步·外侧，RR）：先转祖父，再转父亲</text><line x1="54" y1="213" x2="66" y2="229" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="84" y1="253" x2="96" y2="269" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="45" cy="201" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="75" cy="241" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="105" cy="281" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="45" y="206" fill="#e8e8e8">1</text><text x="75" y="246" fill="#e8e8e8">2</text><text x="105" y="286" fill="#ffffff">3</text></g><line x1="143" y1="231" x2="217" y2="231" stroke="#a1a1a0" stroke-width="2"/><polygon points="227,231 216,225 216,237" fill="#a1a1a0"/><text x="185" y="221" fill="#a1a1a0" font-size="12" text-anchor="middle">在 1 处左旋</text><line x1="286" y1="213" x2="274" y2="229" stroke="#4ade80" stroke-width="2.5"/><line x1="304" y1="213" x2="316" y2="229" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="265" cy="241" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="295" cy="201" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="325" cy="241" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="265" y="246" fill="#e8e8e8">1</text><text x="295" y="206" fill="#e8e8e8">2</text><text x="325" y="246" fill="#ffffff">3</text></g><line x1="363" y1="231" x2="437" y2="231" stroke="#a1a1a0" stroke-width="2"/><polygon points="447,231 436,225 436,237" fill="#a1a1a0"/><text x="405" y="221" fill="#a1a1a0" font-size="12" text-anchor="middle">在 2 处左旋</text><line x1="506" y1="253" x2="494" y2="269" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="536" y1="213" x2="524" y2="229" stroke="#4ade80" stroke-width="2.5"/><g><circle cx="485" cy="281" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="515" cy="241" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="545" cy="201" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="485" y="286" fill="#e8e8e8">1</text><text x="515" y="246" fill="#e8e8e8">2</text><text x="545" y="206" fill="#ffffff">3</text></g><text x="12" y="334" fill="#e8e8e8" font-size="14" font-weight="700">zig-zag（两步·内侧，RL）：x 连升两次</text><line x1="57.5" y1="369.3" x2="92.5" y2="392.7" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="96" y1="413" x2="84" y2="429" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="45" cy="361" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="75" cy="441" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="105" cy="401" r="15" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="45" y="366" fill="#e8e8e8">1</text><text x="75" y="446" fill="#ffffff">2</text><text x="105" y="406" fill="#e8e8e8">3</text></g><line x1="143" y1="391" x2="217" y2="391" stroke="#a1a1a0" stroke-width="2"/><polygon points="227,391 216,385 216,397" fill="#a1a1a0"/><text x="185" y="381" fill="#a1a1a0" font-size="12" text-anchor="middle">在 3 处右旋</text><line x1="274" y1="373" x2="286" y2="389" stroke="#4ade80" stroke-width="2.5"/><line x1="304" y1="413" x2="316" y2="429" stroke="#4ade80" stroke-width="2.5"/><g><circle cx="265" cy="361" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="295" cy="401" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="325" cy="441" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="265" y="366" fill="#e8e8e8">1</text><text x="295" y="406" fill="#ffffff">2</text><text x="325" y="446" fill="#e8e8e8">3</text></g><line x1="363" y1="391" x2="437" y2="391" stroke="#a1a1a0" stroke-width="2"/><polygon points="447,391 436,385 436,397" fill="#a1a1a0"/><text x="405" y="381" fill="#a1a1a0" font-size="12" text-anchor="middle">在 1 处左旋</text><line x1="506" y1="373" x2="494" y2="389" stroke="#4ade80" stroke-width="2.5"/><line x1="524" y1="373" x2="536" y2="389" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="485" cy="401" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="515" cy="361" r="15" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="545" cy="401" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="14" font-weight="700" text-anchor="middle"><text x="485" y="406" fill="#e8e8e8">1</text><text x="515" y="366" fill="#ffffff">2</text><text x="545" y="406" fill="#e8e8e8">3</text></g></svg>
<figcaption>橙色是 x，黄圈是开始时的 p、g，绿线是这次旋转新接上的指针。</figcaption>
</figure>

<p>两步情况的结果很好记：<strong>zig-zig 把链 1-2-3 翻成 3-2-1</strong>；<strong>zig-zag 让 x 当根，p 和 g 分列两边</strong>，和 AVL 的双旋转一样。</p>

<div class="callout key" data-label="考点">
<ul>
<li>重复这些步骤直到 x 成为根，每一步都按 x <strong>当前</strong>的 p、g 重新判断。</li>
<li>从 x <strong>往上</strong>两层两层地做，<strong>只有 p 是根时才做 zig</strong>：zig 最多一次，一定是最后一步，x 的深度为奇数时才出现。深度为 d 的结点共转 d 次。</li>
<li>旋转不改变中序（in-order）序列，画完用中序检查。</li>
</ul>
</div>

<h2>看个例子</h2>
<p>依次插入 50, 10, 60, 40, 20, 45, 25, 22, 30, 28, 35，得到图 ① 这棵普通 BST。现在访问 30。</p>
<p>先数深度：路径 50 → 10 → 40 → 20 → 25 → 30，深度 5 = 2 + 2 + 1，所以是两个两步情况，最后一个一步情况。</p>

<figure class="fig">
<svg viewBox="0 0 580 544" width="580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="例题：访问 30，经过 zig-zig、zig-zag、zig 三步到达根"><g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="290" y1="4" x2="290" y2="540"/><line x1="4" y1="268" x2="576" y2="268"/></g><text x="10" y="14" fill="#e8e8e8" font-size="13" font-weight="700">① 访问 30：深度 5</text><line x1="37.7" y1="75.6" x2="180.3" y2="104.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="59.6" y1="148.5" x2="86.4" y2="167.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="89.5" y1="185.6" x2="80.5" y2="198.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="107.6" y1="182.5" x2="134.4" y2="201.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="137.5" y1="219.6" x2="128.5" y2="232.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="152.5" y1="219.6" x2="161.5" y2="232.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="180.3" y1="110" x2="61.7" y2="138" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="200.5" y1="117.6" x2="209.5" y2="130.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="228.2" y1="41" x2="37.8" y2="71" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="248.5" y1="49.6" x2="257.5" y2="62.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="25" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="49" cy="141" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="73" cy="209" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="97" cy="175" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="121" cy="243" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="145" cy="209" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="169" cy="243" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="193" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="217" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="241" cy="39" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="265" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="25" y="77.7" fill="#e8e8e8">10</text><text x="49" y="145.7" fill="#e8e8e8">20</text><text x="73" y="213.7" fill="#e8e8e8">22</text><text x="97" y="179.7" fill="#e8e8e8">25</text><text x="121" y="247.7" fill="#e8e8e8">28</text><text x="145" y="213.7" fill="#ffffff">30</text><text x="169" y="247.7" fill="#e8e8e8">35</text><text x="193" y="111.7" fill="#e8e8e8">40</text><text x="217" y="145.7" fill="#e8e8e8">45</text><text x="241" y="43.7" fill="#e8e8e8">50</text><text x="265" y="77.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="33" y="130" text-anchor="end" fill="#fbbf24">g</text><text x="113" y="164" text-anchor="start" fill="#fbbf24">p</text><text x="161" y="198" text-anchor="start" fill="#d97757">x</text></g><text x="300" y="14" fill="#e8e8e8" font-size="13" font-weight="700">② zig-zig 之后</text><line x1="327.7" y1="75.6" x2="470.3" y2="104.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="346.5" y1="219.6" x2="355.5" y2="232.4" stroke="#4ade80" stroke-width="2.5"/><line x1="376.4" y1="182.5" x2="349.6" y2="201.5" stroke="#4ade80" stroke-width="2.5"/><line x1="394.5" y1="185.6" x2="403.5" y2="198.4" stroke="#4ade80" stroke-width="2.5"/><line x1="424.4" y1="148.5" x2="397.6" y2="167.5" stroke="#4ade80" stroke-width="2.5"/><line x1="442.5" y1="151.6" x2="451.5" y2="164.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="472.4" y1="114.5" x2="445.6" y2="133.5" stroke="#4ade80" stroke-width="2.5"/><line x1="490.5" y1="117.6" x2="499.5" y2="130.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="518.2" y1="41" x2="327.8" y2="71" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="538.5" y1="49.6" x2="547.5" y2="62.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="315" cy="73" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="339" cy="209" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="363" cy="243" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="387" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="411" cy="209" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="435" cy="141" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="459" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="483" cy="107" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="507" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="531" cy="39" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="555" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="315" y="77.7" fill="#e8e8e8">10</text><text x="339" y="213.7" fill="#e8e8e8">20</text><text x="363" y="247.7" fill="#e8e8e8">22</text><text x="387" y="179.7" fill="#e8e8e8">25</text><text x="411" y="213.7" fill="#e8e8e8">28</text><text x="435" y="145.7" fill="#ffffff">30</text><text x="459" y="179.7" fill="#e8e8e8">35</text><text x="483" y="111.7" fill="#e8e8e8">40</text><text x="507" y="145.7" fill="#e8e8e8">45</text><text x="531" y="43.7" fill="#e8e8e8">50</text><text x="555" y="77.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="299" y="62" text-anchor="end" fill="#fbbf24">g</text><text x="419" y="130" text-anchor="end" fill="#d97757">x</text><text x="499" y="96" text-anchor="start" fill="#fbbf24">p</text></g><text x="10" y="294" fill="#e8e8e8" font-size="13" font-weight="700">③ zig-zag 之后</text><line x1="36.8" y1="392.6" x2="85.2" y2="415.4" stroke="#4ade80" stroke-width="2.5"/><line x1="56.5" y1="465.6" x2="65.5" y2="478.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="86.4" y1="428.5" x2="59.6" y2="447.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="104.5" y1="431.6" x2="113.5" y2="444.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="132.5" y1="356.5" x2="37.5" y2="383.5" stroke="#4ade80" stroke-width="2.5"/><line x1="155.6" y1="360.5" x2="182.4" y2="379.5" stroke="#4ade80" stroke-width="2.5"/><line x1="185.5" y1="397.6" x2="176.5" y2="410.4" stroke="#4ade80" stroke-width="2.5"/><line x1="200.5" y1="397.6" x2="209.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="228.7" y1="323.3" x2="157.3" y2="348.7" stroke="#4ade80" stroke-width="2.5"/><line x1="248.5" y1="329.6" x2="257.5" y2="342.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="25" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="49" cy="455" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="73" cy="489" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="97" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="121" cy="455" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="145" cy="353" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="169" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="193" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="217" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="241" cy="319" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="265" cy="353" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="25" y="391.7" fill="#e8e8e8">10</text><text x="49" y="459.7" fill="#e8e8e8">20</text><text x="73" y="493.7" fill="#e8e8e8">22</text><text x="97" y="425.7" fill="#e8e8e8">25</text><text x="121" y="459.7" fill="#e8e8e8">28</text><text x="145" y="357.7" fill="#ffffff">30</text><text x="169" y="425.7" fill="#e8e8e8">35</text><text x="193" y="391.7" fill="#e8e8e8">40</text><text x="217" y="425.7" fill="#e8e8e8">45</text><text x="241" y="323.7" fill="#e8e8e8">50</text><text x="265" y="357.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="129" y="342" text-anchor="end" fill="#d97757">x</text><text x="257" y="308" text-anchor="start" fill="#fbbf24">p</text></g><text x="300" y="294" fill="#e8e8e8" font-size="13" font-weight="700">④ zig 之后：30 是根</text><line x1="326.8" y1="358.6" x2="375.2" y2="381.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="346.5" y1="431.6" x2="355.5" y2="444.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="376.4" y1="394.5" x2="349.6" y2="413.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="394.5" y1="397.6" x2="403.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="422.5" y1="322.5" x2="327.5" y2="349.5" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="447.3" y1="323.3" x2="518.7" y2="348.7" stroke="#4ade80" stroke-width="2.5"/><line x1="475.5" y1="397.6" x2="466.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="490.5" y1="397.6" x2="499.5" y2="410.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="520.4" y1="360.5" x2="493.6" y2="379.5" stroke="#4ade80" stroke-width="2.5"/><line x1="538.5" y1="363.6" x2="547.5" y2="376.4" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="315" cy="353" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="339" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="363" cy="455" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="387" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="411" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="435" cy="319" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="459" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="483" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="507" cy="421" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="531" cy="353" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="555" cy="387" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="315" y="357.7" fill="#e8e8e8">10</text><text x="339" y="425.7" fill="#e8e8e8">20</text><text x="363" y="459.7" fill="#e8e8e8">22</text><text x="387" y="391.7" fill="#e8e8e8">25</text><text x="411" y="425.7" fill="#e8e8e8">28</text><text x="435" y="323.7" fill="#ffffff">30</text><text x="459" y="425.7" fill="#e8e8e8">35</text><text x="483" y="391.7" fill="#e8e8e8">40</text><text x="507" y="425.7" fill="#e8e8e8">45</text><text x="531" y="357.7" fill="#e8e8e8">50</text><text x="555" y="391.7" fill="#e8e8e8">60</text></g><g font-size="12" font-weight="700"><text x="451" y="308" text-anchor="start" fill="#d97757">x</text></g></svg>
<figcaption>① 是开始的树，②③④ 是每一步之后。黄圈是下一步的 p、g，绿线是上一步新接的指针。</figcaption>
</figure>

<p><strong>第 1 步：zig-zig（RR）。</strong>p = 25，g = 20，30 和 25 都是右孩子，同侧。先转祖父：</p>
<ul>
<li>在 20 处左旋：25 上来，20 成为 25 的左孩子；25 原来的左孩子 22 改挂到 20 的右边。</li>
<li>再在 25 处左旋：30 上来，25 成为 30 的左孩子；30 原来的左孩子 28 改挂到 25 的右边。</li>
</ul>
<p>以 30 为根的新子树接回 20 原来的位置：40 的左边（图 ②）。</p>
<p><strong>第 2 步：zig-zag（RL）。</strong>现在 p = 40，g = 10，30 是左孩子、40 是右孩子，异侧。x 连升两次：</p>
<ul>
<li>在 40 处右旋：30 上来，40 成为 30 的右孩子；30 原来的右孩子 35 改挂到 40 的左边。</li>
<li>在 10 处左旋：30 再上来，10 成为 30 的左孩子；30 原来的左子树（以 25 为根）改挂到 10 的右边。</li>
</ul>
<p>30 接到 50 的左边（图 ③）。</p>
<p><strong>第 3 步：zig。</strong>p = 50 已经是根。在 50 处右旋：30 成为根，50 成为它的右孩子；30 原来的右子树（以 40 为根）改挂到 50 的左边（图 ④）。</p>
<p>一共 5 次旋转，中序序列始终是 10, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60。树高从 7 降到 5（本课约定叶子高度为 1），但<strong>并不平衡</strong>：10 的左子树高 0，右子树高 3。伸展树只保证刚访问的键在根上。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-splay-tree/anims/splay.html" loading="lazy" style="height: 540px;" title="伸展树：把访问的结点转到根"></iframe>
<p class="anim-caption">逐步播放看访问 30 的过程，点“链：访问 1”换成复杂度一节的链；点任意结点，会从当前的树出发把它伸展到根。红色虚线是马上要改掉的指针。</p>

<h2>补充：伸展的代码</h2>
<p>伸展要从 x 往上找 p 和 g，所以结点多存一个 <code>parent</code> 指针（根的 parent 是 NULL）。再写一个 <code>rotate_up(x)</code>：在 x 的父结点处做一次 3.6 的旋转，把 x 提上一层，顺便改好 parent 指针。伸展本身只有这几行：</p>
<pre><code>node_t *splay(node_t *x) {
    while (x-&gt;parent != NULL) {
        node_t *p = x-&gt;parent, *g = p-&gt;parent;
        if (g == NULL) {                                /* zig */
            rotate_up(x);
        } else if ((x == p-&gt;left) == (p == g-&gt;left)) {  /* zig-zig */
            rotate_up(p);
            rotate_up(x);
        } else {                                        /* zig-zag */
            rotate_up(x);
            rotate_up(x);
        }
    }
    return x;
}</code></pre>
<ul>
<li><strong>第 2 行</strong>：x 还有父结点，就还没到根。</li>
<li><strong>第 3 行</strong>：每一圈都重新取当前的 p 和 g。</li>
<li><strong>第 4–5 行</strong>：没有祖父，p 就是根：zig。</li>
<li><strong>第 6 行</strong>：“x 是左孩子吗”和“p 是左孩子吗”答案相同，就是同侧：zig-zig。</li>
<li><strong>第 7–8 行</strong>：先转 p（在 g 处旋转），再转 x。</li>
<li><strong>第 10–11 行</strong>：zig-zag，x 连转两次。</li>
</ul>
<p>两种两步情况只差第一次转谁。调用时写 <code>root = splay(x);</code>；插入就是先挂上新叶子，再伸展它。<strong>查找失败也要伸展</strong>最后访问到的结点，否则反复查同一条长路径上不存在的键，每次都 O(n)，树却从不变矮。</p>

<h2>复杂度：单次可能慢，平均下来快</h2>
<p>伸展树不管平衡，树高可以到 n。从空树依次插入 1, 2, …, 7（每次都伸展新结点）：插入 k 时根是 k − 1，k 挂在它右边，一次 zig 就到根。插完是一条左链 7 → 6 → … → 1，访问 1 要走 6 条边，所以<strong>单次操作最坏 O(n)</strong>。</p>
<p>但这次访问做了三次 zig-zig，树高从 7 降到 5；1000 个结点的链会从 1000 降到 502。贵的操作顺手把树压矮了，后面就便宜。</p>
<p>这和 2.6 动态数组翻倍扩容一个道理：偶尔一次很贵，摊到每次头上并不多。可以证明：<strong>从空树开始，任意 m 次操作总共 O(m log n)，平均每次 O(log n)</strong>，这叫均摊（amortised）复杂度。课上叫它“平均”，但它对任何操作序列都成立，不是对随机输入取平均，也不保证每一次都快。</p>

<table>
<thead><tr><th></th><th>AVL 树</th><th>伸展树</th></tr></thead>
<tbody>
<tr><td>结点额外信息</td><td>高度（或平衡因子）</td><td>无（parent 只为写代码方便）</td></tr>
<tr><td>什么时候旋转</td><td>插入、删除后出现失衡</td><td>每次访问，包括查找</td></tr>
<tr><td>单次最坏</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>m 次操作总计</td><td>O(m log n)</td><td>O(m log n)（均摊）</td></tr>
</tbody>
</table>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/So8szqIvIFs" title="Splay Trees - Data Structures in 5 Minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Dickson Tsai《Splay Trees - Data Structures in 5 Minutes》（英文，约 7 分钟），黑板讲解伸展的旋转和插入，内容比本课略多，以本课的三种情况为准。</p>

<h2>考试怎么考</h2>
<p>常见三种题型：</p>
<ul>
<li><strong>手算伸展</strong>：给一棵 BST 和要访问的键，画出每一步之后的树，写明情况名称和在哪里旋转。</li>
<li><strong>判断情况</strong>：给出 x、p、g 的左右关系，问属于哪种情况、先在哪里转。</li>
<li><strong>概念选择题</strong>：是否平衡、单次最坏和均摊复杂度、和 AVL 的区别、适合什么访问模式。</li>
</ul>
<p>三种情况的条件、旋转顺序和“单次 O(n)、均摊 O(log n)”都要背，公式表上没有。</p>

<h3>例题 1：手算伸展</h3>
<p>依次插入 40, 20, 60, 10, 30, 50, 70, 5, 15 得到一棵普通 BST。访问 5，写出每一步，画出最后的树。</p>
<figure class="fig">
<svg viewBox="0 0 678 194" width="678" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="例题 1：访问 5，先 zig-zig 再 zig"><g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="226" y1="4" x2="226" y2="190"/><line x1="452" y1="4" x2="452" y2="190"/></g><text x="8" y="14" fill="#e8e8e8" font-size="13" font-weight="700">开始：5 的深度 3</text><line x1="39.9" y1="117.9" x2="32.1" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="54.1" y1="117.9" x2="61.9" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="80.7" y1="80.9" x2="57.3" y2="99.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="98.1" y1="83.9" x2="105.9" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="124.7" y1="46.9" x2="101.3" y2="65.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="145.3" y1="46.9" x2="168.7" y2="65.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="171.9" y1="83.9" x2="164.1" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="186.1" y1="83.9" x2="193.9" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="25" cy="141" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="47" cy="107" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="69" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="91" cy="73" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="113" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="135" cy="39" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="157" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="179" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="201" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="25" y="145.7" fill="#ffffff">5</text><text x="47" y="111.7" fill="#e8e8e8">10</text><text x="69" y="145.7" fill="#e8e8e8">15</text><text x="91" y="77.7" fill="#e8e8e8">20</text><text x="113" y="111.7" fill="#e8e8e8">30</text><text x="135" y="43.7" fill="#e8e8e8">40</text><text x="157" y="111.7" fill="#e8e8e8">50</text><text x="179" y="77.7" fill="#e8e8e8">60</text><text x="201" y="111.7" fill="#e8e8e8">70</text></g><g font-size="12" font-weight="700"><text x="9" y="130" text-anchor="end" fill="#d97757">x</text><text x="31" y="96" text-anchor="end" fill="#fbbf24">p</text><text x="75" y="62" text-anchor="end" fill="#fbbf24">g</text></g><text x="234" y="14" fill="#e8e8e8" font-size="13" font-weight="700">① zig-zig 之后</text><line x1="258.1" y1="83.9" x2="265.9" y2="96.1" stroke="#4ade80" stroke-width="2.5"/><line x1="283.3" y1="114.9" x2="306.7" y2="133.1" stroke="#4ade80" stroke-width="2.5"/><line x1="309.9" y1="151.9" x2="302.1" y2="164.1" stroke="#4ade80" stroke-width="2.5"/><line x1="324.1" y1="151.9" x2="331.9" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="348.6" y1="42.8" x2="263.4" y2="69.2" stroke="#4ade80" stroke-width="2.5"/><line x1="371.3" y1="46.9" x2="394.7" y2="65.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="397.9" y1="83.9" x2="390.1" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="412.1" y1="83.9" x2="419.9" y2="96.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="251" cy="73" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="273" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="295" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="317" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="339" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="361" cy="39" r="13" fill="#343433" stroke="#fbbf24" stroke-width="2.5"/><circle cx="383" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="405" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="427" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="251" y="77.7" fill="#ffffff">5</text><text x="273" y="111.7" fill="#e8e8e8">10</text><text x="295" y="179.7" fill="#e8e8e8">15</text><text x="317" y="145.7" fill="#e8e8e8">20</text><text x="339" y="179.7" fill="#e8e8e8">30</text><text x="361" y="43.7" fill="#e8e8e8">40</text><text x="383" y="111.7" fill="#e8e8e8">50</text><text x="405" y="77.7" fill="#e8e8e8">60</text><text x="427" y="111.7" fill="#e8e8e8">70</text></g><g font-size="12" font-weight="700"><text x="235" y="62" text-anchor="end" fill="#d97757">x</text><text x="377" y="28" text-anchor="start" fill="#fbbf24">p</text></g><text x="460" y="14" fill="#e8e8e8" font-size="13" font-weight="700">② zig 之后</text><line x1="489.4" y1="42.8" x2="574.6" y2="69.2" stroke="#4ade80" stroke-width="2.5"/><line x1="509.3" y1="114.9" x2="532.7" y2="133.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="535.9" y1="151.9" x2="528.1" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="550.1" y1="151.9" x2="557.9" y2="164.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="574.9" y1="77.7" x2="511.1" y2="102.3" stroke="#4ade80" stroke-width="2.5"/><line x1="597.3" y1="80.9" x2="620.7" y2="99.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="623.9" y1="117.9" x2="616.1" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><line x1="638.1" y1="117.9" x2="645.9" y2="130.1" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><g><circle cx="477" cy="39" r="13" fill="#d97757" stroke="#d97757" stroke-width="2"/><circle cx="499" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="521" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="543" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="565" cy="175" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="587" cy="73" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="609" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="631" cy="107" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="653" cy="141" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/></g><g font-size="13" font-weight="700" text-anchor="middle"><text x="477" y="43.7" fill="#ffffff">5</text><text x="499" y="111.7" fill="#e8e8e8">10</text><text x="521" y="179.7" fill="#e8e8e8">15</text><text x="543" y="145.7" fill="#e8e8e8">20</text><text x="565" y="179.7" fill="#e8e8e8">30</text><text x="587" y="77.7" fill="#e8e8e8">40</text><text x="609" y="145.7" fill="#e8e8e8">50</text><text x="631" y="111.7" fill="#e8e8e8">60</text><text x="653" y="145.7" fill="#e8e8e8">70</text></g><g font-size="12" font-weight="700"><text x="493" y="28" text-anchor="start" fill="#d97757">x</text></g></svg>
<figcaption>绿线是每一步新接的指针。</figcaption>
</figure>
<p>5 的路径是 40 → 20 → 10 → 5，深度 3 = 2 + 1：先一个两步情况，最后一个一步情况。</p>
<ol>
<li>x = 5，p = 10，g = 20，5 和 10 都是左孩子：<strong>zig-zig（LL）</strong>。先在 20 处右旋：10 上来，20 成为 10 的右孩子，10 原来的右孩子 15 改挂到 20 的左边。再在 10 处右旋：5 上来，10 成为 5 的右孩子（5 没有右子树，10 的左边变空）。5 接到 40 的左边（图 ①）。</li>
<li>p = 40 是根：<strong>zig</strong>。在 40 处右旋：5 成为根，5 原来的右子树（以 10 为根）改挂到 40 的左边（图 ②）。</li>
</ol>
<p>检查中序：5, 10, 15, 20, 30, 40, 50, 60, 70，没变。树高从 4 变成 5：伸展不保证树变矮。</p>
<p>最常见的错法：先在底部做 zig（5 绕 10 转），再对 5、20、40 做 zig-zig，得到根 5、右孩子 20 的另一棵树，是错的。</p>

<h3>例题 2：概念多选</h3>
<p>关于伸展树，下列哪些正确？</p>
<ul>
<li>A. 每个结点要存高度或平衡因子</li>
<li>B. 刚访问过的键在根上，紧接着再访问它只要 O(1)</li>
<li>C. 单次查找最坏 O(n)</li>
<li>D. 从空树开始任意 m 次操作总共 O(m log n)</li>
<li>E. 伸展之后树高不会增加</li>
</ul>
<p>答案是 <strong>B、C、D</strong>。A 错，没有平衡条件，用不着高度。B 对，它就是根。C 对，上面的链访问 1 要走 6 条边。D 对，这就是均摊 O(log n)。E 错，例题 1 的树高就从 4 变成了 5。</p>

<div class="callout warn" data-label="易错">
<ul>
<li><strong>zig-zig 先转了 x</strong>：右链 1 → 2 → 3 访问 3，先在 2 处、再在 1 处转，得到的是 3 的左孩子 1、1 的右孩子 2，不是 3-2-1。一直只转 x（move-to-root）没有 O(log n) 保证。</li>
<li><strong>先在底部做 zig</strong>（例题 1 那种错法）。zig 只能留到最后、在根上做。</li>
<li>忘了把转好的子树接回 g 原来的父结点。</li>
<li>把“均摊 O(log n)”说成“最坏 O(log n)”，或以为伸展后树一定变矮。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>伸展树 = 普通 BST + 每次访问（查找、插入，查找失败也算）都把结点伸展到根；不存高度，不管平衡。</li>
<li>三种步骤：p 是根 → zig，转一次；同侧 → zig-zig，<strong>先转 g 再转 p</strong>；异侧 → zig-zag，x 连升两次。</li>
<li>从 x 往上两层两层地做，每步看当前的 p、g；zig 只能是最后一步。</li>
<li>单次最坏 O(n)，任意 m 次操作总共 O(m log n)，<strong>均摊每次 O(log n)</strong>。</li>
<li>适合访问频率不均、常用的键反复被访问的场合。</li>
</ul>
`;
