/* Post body — dsa-spatial-trees / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-spatial-trees:zh'] = `
<p class="lead">BST 只按一个键排序，而平面上的点有 x、y 两个坐标。要回答“这个矩形里有哪些点”“离某处最近的点是哪个”，就得把平面本身切开：四叉树（quadtree）每次把一块区域等分成四块，k-d 树（k-d tree）每层只按一个坐标切一刀，x 和 y 轮流。</p>

<h2>四叉树：不一致就切成四块</h2>
<p>课上用一张图片演示：一块区域里所有像素颜色相同（课上叫“一致”），就整块存成一个叶子；否则在正中横竖各切一刀，分成四个象限 NW、NE、SW、SE（课上编号 1 到 4），每块成为一个孩子，递归处理。下图 8×8 图像整体混杂，切成四块：NW 全白、SW 全黑，成为叶子；SE 再切一次，四块都纯色；NE 再切一次，右下那块 2×2 仍混杂，切到单个像素。</p>

<figure class="fig">
<svg viewBox="0 0 652 256" width="652" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="8×8 黑白图像和它的四叉树"><g><rect x="20" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="34" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="34" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="56" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="56" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="174" y="78" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="100" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="100" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="122" width="22" height="22" fill="#e8e8e8"/><rect x="174" y="122" width="22" height="22" fill="#e8e8e8"/><rect x="20" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="144" width="22" height="22" fill="#e8e8e8"/><rect x="174" y="144" width="22" height="22" fill="#e8e8e8"/><rect x="20" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="188" width="22" height="22" fill="#1b1b1a"/></g><g stroke="#5a5a59" stroke-width="0.6"><line x1="20" y1="34" x2="20" y2="210"/><line x1="20" y1="34" x2="196" y2="34"/><line x1="42" y1="34" x2="42" y2="210"/><line x1="20" y1="56" x2="196" y2="56"/><line x1="64" y1="34" x2="64" y2="210"/><line x1="20" y1="78" x2="196" y2="78"/><line x1="86" y1="34" x2="86" y2="210"/><line x1="20" y1="100" x2="196" y2="100"/><line x1="108" y1="34" x2="108" y2="210"/><line x1="20" y1="122" x2="196" y2="122"/><line x1="130" y1="34" x2="130" y2="210"/><line x1="20" y1="144" x2="196" y2="144"/><line x1="152" y1="34" x2="152" y2="210"/><line x1="20" y1="166" x2="196" y2="166"/><line x1="174" y1="34" x2="174" y2="210"/><line x1="20" y1="188" x2="196" y2="188"/><line x1="196" y1="34" x2="196" y2="210"/><line x1="20" y1="210" x2="196" y2="210"/></g><g stroke="#d97757" stroke-width="2.5"><line x1="108" y1="34" x2="108" y2="210"/><line x1="20" y1="122" x2="196" y2="122"/><line x1="152" y1="34" x2="152" y2="122"/><line x1="108" y1="78" x2="196" y2="78"/><line x1="174" y1="78" x2="174" y2="122"/><line x1="152" y1="100" x2="196" y2="100"/><line x1="152" y1="122" x2="152" y2="210"/><line x1="108" y1="166" x2="196" y2="166"/></g><rect x="20" y="34" width="176" height="176" fill="none" stroke="#d97757" stroke-width="2.5"/><g fill="#a1a1a0" font-size="12" text-anchor="middle"><text x="64" y="24">NW</text><text x="152" y="24">NE</text><text x="64" y="228">SW</text><text x="152" y="228">SE</text></g><g stroke="rgba(255,255,255,0.35)" stroke-width="1.5"><line x1="424" y1="171" x2="376" y2="218"/><line x1="424" y1="171" x2="408" y2="218"/><line x1="424" y1="171" x2="440" y2="218"/><line x1="424" y1="171" x2="472" y2="218"/><line x1="352" y1="107" x2="280" y2="154"/><line x1="352" y1="107" x2="312" y2="154"/><line x1="352" y1="107" x2="344" y2="154"/><line x1="352" y1="107" x2="424" y2="153"/><line x1="584" y1="107" x2="536" y2="154"/><line x1="584" y1="107" x2="568" y2="154"/><line x1="584" y1="107" x2="600" y2="154"/><line x1="584" y1="107" x2="632" y2="154"/><line x1="416" y1="43" x2="248" y2="90"/><line x1="416" y1="43" x2="352" y2="89"/><line x1="416" y1="43" x2="504" y2="90"/><line x1="416" y1="43" x2="584" y2="89"/></g><rect x="240" y="90" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="272" y="154" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="304" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="336" y="154" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="368" y="218" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="400" y="218" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="432" y="218" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="464" y="218" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><circle cx="424" cy="162" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="352" cy="98" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><rect x="496" y="90" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="528" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="560" y="154" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="592" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="624" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><circle cx="584" cy="98" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="416" cy="34" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><g fill="#a1a1a0" font-size="12" text-anchor="middle"><text x="318" y="66">NW</text><text x="370" y="66">NE</text><text x="474" y="66">SW</text><text x="514" y="66">SE</text></g></svg>
<figcaption>左：图像和切分线（橙色）。右：四叉树，圆圈是内部结点，方块是叶子（颜色即该区域的颜色），孩子从左到右为 NW、NE、SW、SE。</figcaption>
</figure>

<p>结果是 17 个结点、13 个叶子，代替 64 个像素：大片同色区域只占一个叶子，所以四叉树可用来压缩图像。</p>

<div class="callout key" data-label="考点">
<ul>
<li>四叉树的<strong>每个内部结点恰好有 4 个孩子</strong>，叶子是一块颜色一致的区域。</li>
<li>2<sup>k</sup>×2<sup>k</sup> 的图像每往下一层边长减半，所以<strong>深度最多是 k</strong>。</li>
<li><strong>最坏情况是棋盘格</strong>：要一直切到单个像素，8×8 时有 1 + 4 + 16 + 64 = 85 个结点，比 64 个像素还多。</li>
</ul>
</div>
<p>存点时把规则换成：格子里多于一个点就切成四块，直到每个叶子最多一个点。</p>

<h2>k-d 树：每层换一个坐标的 BST</h2>
<p>k-d 树每个结点存一个点，形状和 BST 一样，只是比较的坐标随深度轮换：<strong>深度为偶数（根是深度 0）比 x，奇数比 y</strong>，课上的说法是第一层看 x、第二层看 y、第三层再看 x。小于往左，大于等于往右（相等往哪边是约定，题目会说明）。这里维数 k = 2，也叫 2-d 树。依次插入 A(8,5)、B(2,6)、C(9,3)、D(5,2)、E(6,9)、F(3,4)、G(7,1)、H(3,8)、I(7,7)：</p>

<table>
<thead><tr><th>插入</th><th>比较过程</th><th>位置</th><th>分割线</th></tr></thead>
<tbody>
<tr><td>A(8,5)</td><td>空树</td><td>根</td><td>竖线 x = 8</td></tr>
<tr><td>B(2,6)</td><td>A 比 x：2 &lt; 8 左</td><td>A 的左孩子</td><td>横线 y = 6</td></tr>
<tr><td>C(9,3)</td><td>A：9 ≥ 8 右</td><td>A 的右孩子</td><td>横线 y = 3</td></tr>
<tr><td>D(5,2)</td><td>A：5 &lt; 8 左；B 比 y：2 &lt; 6 左</td><td>B 的左孩子</td><td>竖线 x = 5</td></tr>
<tr><td>E(6,9)</td><td>A：6 &lt; 8 左；B：9 ≥ 6 右</td><td>B 的右孩子</td><td>竖线 x = 6</td></tr>
<tr><td>F(3,4)</td><td>A：3 &lt; 8 左；B：4 &lt; 6 左；D 比 x：3 &lt; 5 左</td><td>D 的左孩子</td><td>横线 y = 4</td></tr>
<tr><td>G(7,1)</td><td>A：7 &lt; 8 左；B：1 &lt; 6 左；D：7 ≥ 5 右</td><td>D 的右孩子</td><td>横线 y = 1</td></tr>
<tr><td>H(3,8)</td><td>A：3 &lt; 8 左；B：8 ≥ 6 右；E：3 &lt; 6 左</td><td>E 的左孩子</td><td>横线 y = 8</td></tr>
<tr><td>I(7,7)</td><td>A：7 &lt; 8 左；B：7 ≥ 6 右；E：7 ≥ 6 右</td><td>E 的右孩子</td><td>横线 y = 7</td></tr>
</tbody>
</table>

<figure class="fig">
<svg viewBox="0 0 680 300" width="680" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="9 个点的 k-d 树划分和对应的树"><g stroke="rgba(255,255,255,0.07)" stroke-width="1"><line x1="34" y1="276" x2="34" y2="16"/><line x1="34" y1="276" x2="294" y2="276"/><line x1="60" y1="276" x2="60" y2="16"/><line x1="34" y1="250" x2="294" y2="250"/><line x1="86" y1="276" x2="86" y2="16"/><line x1="34" y1="224" x2="294" y2="224"/><line x1="112" y1="276" x2="112" y2="16"/><line x1="34" y1="198" x2="294" y2="198"/><line x1="138" y1="276" x2="138" y2="16"/><line x1="34" y1="172" x2="294" y2="172"/><line x1="164" y1="276" x2="164" y2="16"/><line x1="34" y1="146" x2="294" y2="146"/><line x1="190" y1="276" x2="190" y2="16"/><line x1="34" y1="120" x2="294" y2="120"/><line x1="216" y1="276" x2="216" y2="16"/><line x1="34" y1="94" x2="294" y2="94"/><line x1="242" y1="276" x2="242" y2="16"/><line x1="34" y1="68" x2="294" y2="68"/><line x1="268" y1="276" x2="268" y2="16"/><line x1="34" y1="42" x2="294" y2="42"/><line x1="294" y1="276" x2="294" y2="16"/><line x1="34" y1="16" x2="294" y2="16"/></g><rect x="60" y="94" width="78" height="104" fill="rgba(251,191,36,0.10)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 4"/><g stroke="#38bdf8" stroke-width="2"><line x1="242" y1="276" x2="242" y2="16"/><line x1="164" y1="276" x2="164" y2="120"/><line x1="190" y1="120" x2="190" y2="16"/></g><g stroke="#4ade80" stroke-width="2"><line x1="34" y1="120" x2="242" y2="120"/><line x1="34" y1="172" x2="164" y2="172"/><line x1="164" y1="250" x2="242" y2="250"/><line x1="34" y1="68" x2="190" y2="68"/><line x1="190" y1="94" x2="242" y2="94"/><line x1="242" y1="198" x2="294" y2="198"/></g><rect x="34" y="16" width="260" height="260" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/><g fill="#a1a1a0" font-size="12"><text x="34" y="292" text-anchor="middle">0</text><text x="26" y="280" text-anchor="end">0</text><text x="86" y="292" text-anchor="middle">2</text><text x="26" y="228" text-anchor="end">2</text><text x="138" y="292" text-anchor="middle">4</text><text x="26" y="176" text-anchor="end">4</text><text x="190" y="292" text-anchor="middle">6</text><text x="26" y="124" text-anchor="end">6</text><text x="242" y="292" text-anchor="middle">8</text><text x="26" y="72" text-anchor="end">8</text><text x="294" y="292" text-anchor="middle">10</text><text x="26" y="20" text-anchor="end">10</text></g><g fill="#e8e8e8"><circle cx="242" cy="146" r="4.5"/><circle cx="86" cy="120" r="4.5"/><circle cx="268" cy="198" r="4.5"/><circle cx="164" cy="224" r="4.5"/><circle cx="190" cy="42" r="4.5"/><circle cx="112" cy="172" r="4.5"/><circle cx="216" cy="250" r="4.5"/><circle cx="112" cy="68" r="4.5"/><circle cx="216" cy="94" r="4.5"/></g><g fill="#e8e8e8" font-size="13" font-weight="700"><text x="249" y="140">A</text><text x="93" y="114">B</text><text x="275" y="192">C</text><text x="171" y="218">D</text><text x="197" y="36">E</text><text x="119" y="166">F</text><text x="223" y="244">G</text><text x="119" y="62">H</text><text x="223" y="88">I</text></g><text x="64" y="192" fill="#fbbf24" font-size="12">Q1</text><g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="542" y1="56" x2="454" y2="100"/><line x1="542" y1="56" x2="630" y2="100"/><line x1="454" y1="124" x2="390" y2="168"/><line x1="454" y1="124" x2="518" y2="168"/><line x1="390" y1="192" x2="360" y2="236"/><line x1="390" y1="192" x2="420" y2="236"/><line x1="518" y1="192" x2="488" y2="236"/><line x1="518" y1="192" x2="548" y2="236"/></g><g fill="#343433" stroke-width="2"><rect x="516" y="32" width="52" height="24" rx="6" stroke="#38bdf8"/><rect x="428" y="100" width="52" height="24" rx="6" stroke="#4ade80"/><rect x="364" y="168" width="52" height="24" rx="6" stroke="#38bdf8"/><rect x="334" y="236" width="52" height="24" rx="6" stroke="#4ade80"/><rect x="394" y="236" width="52" height="24" rx="6" stroke="#4ade80"/><rect x="492" y="168" width="52" height="24" rx="6" stroke="#38bdf8"/><rect x="462" y="236" width="52" height="24" rx="6" stroke="#4ade80"/><rect x="522" y="236" width="52" height="24" rx="6" stroke="#4ade80"/><rect x="604" y="100" width="52" height="24" rx="6" stroke="#4ade80"/></g><g fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle"><text x="542" y="48.5">A(8,5)</text><text x="454" y="116.5">B(2,6)</text><text x="390" y="184.5">D(5,2)</text><text x="360" y="252.5">F(3,4)</text><text x="420" y="252.5">G(7,1)</text><text x="518" y="184.5">E(6,9)</text><text x="488" y="252.5">H(3,8)</text><text x="548" y="252.5">I(7,7)</text><text x="630" y="116.5">C(9,3)</text></g></svg>
<figcaption>左：蓝色竖线比 x，绿色横线比 y；黄色虚线框是下面的查询 Q1。右：对应的 k-d 树，边框颜色同样表示比 x（蓝）或比 y（绿）。</figcaption>
</figure>

<p>每个结点管一个矩形格子：根管整个平面，竖线 x = 8 把它切成左右两块，分别交给左右子树；B 的横线再把左边那块切成上下两块，依此类推。所以分割线<strong>只画在自己的格子里</strong>，例如 F 的横线 y = 4 只从 x = 0 画到 x = 5。</p>

<h3>为什么要轮换坐标</h3>
<p>每层都比 x 的话，这就是一棵按 x 排序的 BST，y 永远不参与排除：课上指出，x 很接近而 y 很远的点也会被当成候选。极端例子是横条查询 y ∈ [3, 4]、x 不限：只按 x 切的树一棵子树也剪不掉，9 个点全要看；k-d 树在 B（y = 6）处发现横条完全在下方，直接剪掉 E、H、I。</p>

<h2>范围查找：碰不到的半边直接剪掉</h2>
<p>范围查找（range search）找出矩形查询框内的所有点。Q1：x ∈ [1, 4]，y ∈ [3, 7]（含边界）。每到一个结点，先检查这个点本身在不在框内，再拿框在本层坐标上的范围 [lo, hi] 和分割值 v 比较，决定往哪边走：</p>
<ol>
<li>A(8,5)：不在框内。比 x：hi = 4 &lt; 8，框整个在竖线左边，<strong>只走左边，剪掉右子树 C</strong>。</li>
<li>B(2,6)：在框内，报告。比 y：lo = 3 &lt; 6 ≤ hi = 7，框跨过横线，<strong>两边都查</strong>。</li>
<li>D(5,2)：不在框内。比 x：hi = 4 &lt; 5，只走左边，剪掉 G。</li>
<li>F(3,4)：在框内，报告。叶子。</li>
<li>E(6,9)：不在框内。比 x：hi = 4 &lt; 6，只走左边，剪掉 I。</li>
<li>H(3,8)：不在框内（8 &gt; 7）。叶子。</li>
</ol>
<p>结果 B、F；访问 6 个结点，C、G、I 从未被看过。D、E、H 被访问却不在框内：<strong>访问过不等于要报告</strong>。</p>

<div class="callout key" data-label="考点">
<p>结点比坐标 c、分割值 v，框在 c 上的范围是 [lo, hi]：<strong>lo &lt; v 就查左子树，hi ≥ v 就查右子树</strong>。两个都成立就两边都查，只成立一个就剪掉另一边整棵子树。剪枝只看本层这一个坐标；结点本身在不在框内，要用两个坐标另外检查。</p>
</div>

<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

typedef struct { int x, y; } point_t;

typedef struct kdnode kdnode_t;
struct kdnode {
    point_t p;
    kdnode_t *left, *right;
};

/* 深度为偶数比 x，奇数比 y */
static int coord(point_t p, int depth) {
    return depth % 2 == 0 ? p.x : p.y;
}

/* 和 BST 插入一样往下走，只是每层换一个坐标；相等往右 */
kdnode_t *kd_insert(kdnode_t *t, point_t p, int depth) {
    if (t == NULL) {
        kdnode_t *n = malloc(sizeof(*n));
        assert(n != NULL);
        n-&gt;p = p;
        n-&gt;left = n-&gt;right = NULL;
        return n;
    }
    if (coord(p, depth) &lt; coord(t-&gt;p, depth))
        t-&gt;left = kd_insert(t-&gt;left, p, depth + 1);
    else
        t-&gt;right = kd_insert(t-&gt;right, p, depth + 1);
    return t;
}

typedef struct { int xlo, xhi, ylo, yhi; } box_t;   /* 闭区间 */

/* 打印框内的点，返回个数 */
int kd_range(const kdnode_t *t, box_t b, int depth) {
    if (t == NULL) return 0;
    int found = 0;
    if (b.xlo &lt;= t-&gt;p.x &amp;&amp; t-&gt;p.x &lt;= b.xhi &amp;&amp;
        b.ylo &lt;= t-&gt;p.y &amp;&amp; t-&gt;p.y &lt;= b.yhi) {
        printf("(%d, %d)\\n", t-&gt;p.x, t-&gt;p.y);
        found++;
    }
    int v  = coord(t-&gt;p, depth);
    int lo = depth % 2 == 0 ? b.xlo : b.ylo;
    int hi = depth % 2 == 0 ? b.xhi : b.yhi;
    if (lo &lt; v)  found += kd_range(t-&gt;left, b, depth + 1);   /* 框伸进 &lt; v 一侧 */
    if (hi &gt;= v) found += kd_range(t-&gt;right, b, depth + 1);  /* 框伸进 &gt;= v 一侧 */
    return found;
}

void kd_free(kdnode_t *t) {
    if (t == NULL) return;
    kd_free(t-&gt;left);
    kd_free(t-&gt;right);
    free(t);
}</code></pre>
<p>从根调用，<code>depth</code> 传 0。插入上面 9 个点后执行 <code>kd_range(root, (box_t){1, 4, 3, 7}, 0)</code>，打印 (2, 6) 和 (3, 4)，返回 2。与 BST 的代码相比只多了 <code>depth</code> 参数。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-spatial-trees/anims/kd-tree.html" loading="lazy" style="height: 520px;" title="k-d 树的建树与范围查找"></iframe>
<p class="anim-caption">“建树”逐点插入，分割线只画在各自的格子里；三个查询逐个结点演示，红色区域是剪掉的子树，绿色是报告的点。</p>

<h2>复杂度与用途</h2>
<ul>
<li><strong>插入、精确查找</strong>：走一条路径，O(树高)。和 BST 一样取决于插入顺序：<strong>平衡时 O(log n)，最坏退化成链 O(n)</strong>（见练习 4）。点事先已知时，每次取当前坐标的中位数做根、递归建树，树高约 log₂ n。</li>
<li><strong>范围查找</strong>：最坏 O(n)（框盖住所有点，或树退化），通常大部分子树会被剪掉。平衡的 2-d 树上最坏是 O(√n + k)，k 为报告的点数，课上没有推导。</li>
<li><strong>最近邻（nearest neighbour）</strong>：先走到查询点所在的格子，路上最近的点作为当前答案，距离为 d；回溯时，只有查询点到分割线的距离小于 d，线的另一侧才需要看。找离 (4,5) 最近的点：经过 A、B、D、F，当前答案 F，d = √2；D 的线 x = 5、B 的线 y = 6 都只差 1 &lt; √2，要看 G 和 E 一侧（G、E、H 都不比 F 近）；E 的线 x = 6 差 2 &gt; √2，剪掉 I；A 的线 x = 8 差 4，剪掉 C。答案是 F。</li>
</ul>

<table>
<thead><tr><th></th><th>四叉树</th><th>k-d 树</th></tr></thead>
<tbody>
<tr><td>孩子数</td><td>4</td><td>2</td></tr>
<tr><td>怎么切</td><td>区域正中，x、y 同时切</td><td>在一个点处，只按一个坐标，逐层轮换</td></tr>
<tr><td>结点存</td><td>区域（叶子存颜色或点）</td><td>一个点</td></tr>
<tr><td>用途</td><td>图像压缩、地图分块、碰撞检测</td><td>范围查找、最近邻、多属性查询</td></tr>
</tbody>
</table>
<p>三维时 k-d 树按 x、y、z 轮换；四叉树对应八叉树（octree），每次切成 8 块。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>建树</strong>：按顺序插入一串点，画出树（有时还要画平面划分），写清每一步在哪个结点比哪个坐标。</li>
<li><strong>范围查找</strong>：问访问了哪些结点、剪掉哪些子树、报告哪些点。</li>
<li><strong>四叉树</strong>：给 4×4 或 8×8 的小图画树、数结点；问最坏情况。</li>
<li><strong>概念</strong>：为什么轮换坐标；四叉树每个内部结点几个孩子；复杂度（平衡 O(log n)，最坏 O(n)）。这些都不在公式表上。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>根比 x，深度从 0 数；根比成 y，整棵树全错。</li>
<li>每个结点只比本层的一个坐标。</li>
<li>相等往右，所以查右子树的条件是 hi ≥ v，不是 hi &gt; v。</li>
<li>分割线只画在自己的格子里，不贯穿整个平面。</li>
<li>经过的结点不一定在框内，报告前两个坐标都要检查。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 依次把 (6,4)、(3,7)、(8,2)、(2,3)、(5,9)、(9,6)、(4,1) 插入空的 k-d 树（根比 x，相等往右），画出树。再插入 (7,5)，它挂在哪里？</summary>
<div class="qa__body">
<ul>
<li>(6,4)：根。</li>
<li>(3,7)：比 x，3 &lt; 6 左 → 根的左孩子。</li>
<li>(8,2)：8 ≥ 6 右 → 根的右孩子。</li>
<li>(2,3)：2 &lt; 6 左；在 (3,7) 比 y，3 &lt; 7 左 → (3,7) 的左孩子。</li>
<li>(5,9)：5 &lt; 6 左；9 ≥ 7 右 → (3,7) 的右孩子。</li>
<li>(9,6)：9 ≥ 6 右；在 (8,2) 比 y，6 ≥ 2 右 → (8,2) 的右孩子。</li>
<li>(4,1)：4 &lt; 6 左；1 &lt; 7 左；在 (2,3) 比 x，4 ≥ 2 右 → (2,3) 的右孩子。</li>
<li>(7,5)：7 ≥ 6 右；在 (8,2) 比 y，5 ≥ 2 右；在 (9,6) 比 x，7 &lt; 9 左 → (9,6) 的左孩子。</li>
</ul>
<pre><code class="lang-text">            (6,4)            比 x
           /     \\
       (3,7)      (8,2)      比 y
       /    \\         \\
   (2,3)   (5,9)     (9,6)   比 x
       \\             /
      (4,1)      (7,5)       比 y</code></pre>
<p>树高 4。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 在正文那棵树上查询 Q2：x ∈ [6, 10]，y ∈ [0, 4]。按访问顺序列出访问的结点，并指出剪掉了哪些子树、报告了哪些点。</summary>
<div class="qa__body">
<ol>
<li>A(8,5)：不在框内（5 &gt; 4）。比 x：lo = 6 &lt; 8 ≤ hi = 10，两边都查，先左后右。</li>
<li>B(2,6)：不在框内。比 y：hi = 4 &lt; 6，只走左边，<strong>剪掉 {E, H, I}</strong>。</li>
<li>D(5,2)：不在框内（5 &lt; 6）。比 x：lo = 6 ≥ 5，只走右边，<strong>剪掉 {F}</strong>。</li>
<li>G(7,1)：在框内，报告。叶子。</li>
<li>回到 A 的右子树，C(9,3)：在框内，报告。叶子。</li>
</ol>
<p>访问 A、B、D、G、C 共 5 个结点，报告 G、C。逐个检查 9 个点，框内也只有这两个。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 一张 4×4 黑白图像从上到下四行是 <code>..##</code>、<code>..##</code>、<code>.###</code>、<code>####</code>（. 为白，# 为黑）。画出它的四叉树（孩子顺序 NW、NE、SW、SE），共有几个结点？什么样的 4×4 图像结点最多，最多几个？</summary>
<div class="qa__body">
<pre><code class="lang-text">. . | # #
. . | # #
----+----
. # | # #
# # | # #</code></pre>
<p>整图不一致，切成四块：NW 全白、NE 全黑、SE 全黑，都是叶子；SW 不一致，再切成 4 个像素：白、黑、黑、黑。</p>
<pre><code class="lang-text">          (*)
     /   /   \\   \\
    W   B    (*)  B
            / | | \\
           W  B B  B</code></pre>
<p>（* 是内部结点，W 白、B 黑。）共 1 + 4 + 4 = <strong>9 个结点</strong>（7 个叶子）。四个 2×2 象限都不一致时（例如棋盘格）结点最多：每个象限都切到单个像素，1 + 4 + 16 = <strong>21 个结点</strong>，比 16 个像素还多。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 依次插入 (1,1)、(2,2)、(3,3)、(4,4)、(5,5)。(a) 树是什么形状？树高多少？查找 (5,5) 要访问几个结点？(b) 给出这 5 个点的一个插入顺序，使树高为 3。</summary>
<div class="qa__body">
<p>(a) 新点的 x、y 都大于已有的点，不论比 x 还是比 y 都“大于等于”，一路往右，成为一条链，<strong>树高 5</strong>（本课叶子高度为 1）。查找 (5,5) 访问全部 5 个结点，O(n)：k-d 树和 BST 一样会因插入顺序退化。</p>
<p>(b) 先插中位数，例如 (3,3)、(2,2)、(5,5)、(1,1)、(4,4)：(3,3) 为根；(2,2) 比 x，2 &lt; 3 左；(5,5) 比 x，5 ≥ 3 右；(1,1)：1 &lt; 3 左，在 (2,2) 比 y，1 &lt; 2 左；(4,4)：4 ≥ 3 右，在 (5,5) 比 y，4 &lt; 5 左。</p>
<pre><code class="lang-text">        (3,3)        比 x
        /    \\
    (2,2)    (5,5)   比 y
     /        /
  (1,1)    (4,4)     比 x</code></pre>
<p>树高 3。</p>
</div>
</details>
`;
