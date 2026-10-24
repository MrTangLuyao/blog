/* Post body — dsa-spatial-trees / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-spatial-trees:zh'] = `
<p class="lead">四叉树（quadtree）和 k-d 树（k-d tree）把平面切成小块，用来存二维的点和图片：前者每次切成四块，后者每次只切一刀，竖切横切轮流来。</p>

<h2>从一个场景说起：地图上找餐厅</h2>
<p>地图 app 的屏幕是一个矩形，app 要把框里的餐厅都标出来。全城几万家餐厅，一家家检查太慢。</p>
<p>用 BST 按 x（东西方向）排序？能很快跳过 x 不在框里的店，但 y 根本没参与比较：一家店 x 刚好在范围里、却在城市另一头，照样是候选。课上的说法是：只看 x，一个点会因为 x 接近而显得很近，其实 y 差得很远。</p>
<p>想想在纸质地图上怎么找：先竖着对折，看在左半还是右半；再横着对折，看在上半还是下半。每折一次，就有一半不用再看。</p>
<p>把“切地图”做成一棵树，有两种切法：</p>
<ul>
<li>每次横竖各切一刀，一块变四块：<strong>四叉树</strong>。</li>
<li>每次只切一刀，竖切和横切轮流来：<strong>k-d 树</strong>。</li>
</ul>

<h2>它们是什么</h2>
<h3>四叉树：不一致就切成四块</h3>
<p>简单说，四叉树就是把一块区域不停地切成四块，直到每一块都“够简单”。它由三部分组成：</p>
<ul>
<li><strong>根</strong>：整块区域，比如一整张图片。</li>
<li><strong>叶子</strong>：一块“一致”的区域，只存一个值。课上用图片举例：区域里像素颜色全相同，就存成一个叶子，记下这个颜色。</li>
<li><strong>内部结点</strong>：区域不一致，就在正中横竖各切一刀，分成 NW（左上）、NE（右上）、SW（左下）、SE（右下）四个象限（课上编号 1 到 4），各成一个孩子，再递归。所以<strong>每个内部结点恰好有 4 个孩子</strong>。</li>
</ul>
<p>存点时，“一致”换成“格子里最多一个点”。</p>

<h3>k-d 树：每层换一个坐标的 BST</h3>
<p>简单说，k-d 树就是一棵每层换一个坐标来比较的 BST。k 是维数，平面上 k = 2，也叫 2-d 树。</p>
<ul>
<li><strong>结点</strong>：存一个点 (x, y) 和 <code>left</code>、<code>right</code> 两个指针。</li>
<li><strong>比哪个坐标</strong>：<strong>根（深度 0）比 x，深度 1 比 y，深度 2 又比 x</strong>，偶数层 x，奇数层 y。课上说的是第一层看 x、第二层看 y。</li>
<li><strong>往哪边走</strong>：本层坐标小于结点的往左，大于等于往右（相等往哪边是约定，题目会说明）。</li>
</ul>
<p>每个结点也是一条分割线：比 x 的画竖线，比 y 的画横线，把它管的区域一分为二，左右子树各管一半。</p>

<h2>看个例子</h2>
<h3>四叉树压缩一张 8×8 图片</h3>
<p>下图左边是一张 8×8 的黑白图片，一步一步切：</p>
<ol>
<li>整张图黑白混杂，不一致，在正中切成四块。</li>
<li>NW 全白、SW 全黑，各自一致，直接成为叶子。</li>
<li>SE 不一致，再切成四个 2×2：黑、白、黑、黑，都是纯色，成为 4 个叶子。</li>
<li>NE 不一致，再切成四个 2×2：前三块白、黑、白是纯色；右下那块还是混杂的，只好切到单个像素：白、黑、黑、黑。</li>
</ol>

<figure class="fig">
<svg viewBox="0 0 652 256" width="652" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="8×8 黑白图像和它的四叉树"><g><rect x="20" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="34" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="34" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="34" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="56" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="56" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="56" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="78" width="22" height="22" fill="#e8e8e8"/><rect x="174" y="78" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="42" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="64" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="86" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="108" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="130" y="100" width="22" height="22" fill="#e8e8e8"/><rect x="152" y="100" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="100" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="122" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="122" width="22" height="22" fill="#e8e8e8"/><rect x="174" y="122" width="22" height="22" fill="#e8e8e8"/><rect x="20" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="144" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="144" width="22" height="22" fill="#e8e8e8"/><rect x="174" y="144" width="22" height="22" fill="#e8e8e8"/><rect x="20" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="166" width="22" height="22" fill="#1b1b1a"/><rect x="20" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="42" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="64" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="86" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="108" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="130" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="152" y="188" width="22" height="22" fill="#1b1b1a"/><rect x="174" y="188" width="22" height="22" fill="#1b1b1a"/></g><g stroke="#5a5a59" stroke-width="0.6"><line x1="20" y1="34" x2="20" y2="210"/><line x1="20" y1="34" x2="196" y2="34"/><line x1="42" y1="34" x2="42" y2="210"/><line x1="20" y1="56" x2="196" y2="56"/><line x1="64" y1="34" x2="64" y2="210"/><line x1="20" y1="78" x2="196" y2="78"/><line x1="86" y1="34" x2="86" y2="210"/><line x1="20" y1="100" x2="196" y2="100"/><line x1="108" y1="34" x2="108" y2="210"/><line x1="20" y1="122" x2="196" y2="122"/><line x1="130" y1="34" x2="130" y2="210"/><line x1="20" y1="144" x2="196" y2="144"/><line x1="152" y1="34" x2="152" y2="210"/><line x1="20" y1="166" x2="196" y2="166"/><line x1="174" y1="34" x2="174" y2="210"/><line x1="20" y1="188" x2="196" y2="188"/><line x1="196" y1="34" x2="196" y2="210"/><line x1="20" y1="210" x2="196" y2="210"/></g><g stroke="#d97757" stroke-width="2.5"><line x1="108" y1="34" x2="108" y2="210"/><line x1="20" y1="122" x2="196" y2="122"/><line x1="152" y1="34" x2="152" y2="122"/><line x1="108" y1="78" x2="196" y2="78"/><line x1="174" y1="78" x2="174" y2="122"/><line x1="152" y1="100" x2="196" y2="100"/><line x1="152" y1="122" x2="152" y2="210"/><line x1="108" y1="166" x2="196" y2="166"/></g><rect x="20" y="34" width="176" height="176" fill="none" stroke="#d97757" stroke-width="2.5"/><g fill="#a1a1a0" font-size="12" text-anchor="middle"><text x="64" y="24">NW</text><text x="152" y="24">NE</text><text x="64" y="228">SW</text><text x="152" y="228">SE</text></g><g stroke="rgba(255,255,255,0.35)" stroke-width="1.5"><line x1="424" y1="171" x2="376" y2="218"/><line x1="424" y1="171" x2="408" y2="218"/><line x1="424" y1="171" x2="440" y2="218"/><line x1="424" y1="171" x2="472" y2="218"/><line x1="352" y1="107" x2="280" y2="154"/><line x1="352" y1="107" x2="312" y2="154"/><line x1="352" y1="107" x2="344" y2="154"/><line x1="352" y1="107" x2="424" y2="153"/><line x1="584" y1="107" x2="536" y2="154"/><line x1="584" y1="107" x2="568" y2="154"/><line x1="584" y1="107" x2="600" y2="154"/><line x1="584" y1="107" x2="632" y2="154"/><line x1="416" y1="43" x2="248" y2="90"/><line x1="416" y1="43" x2="352" y2="89"/><line x1="416" y1="43" x2="504" y2="90"/><line x1="416" y1="43" x2="584" y2="89"/></g><rect x="240" y="90" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="272" y="154" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="304" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="336" y="154" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="368" y="218" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="400" y="218" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="432" y="218" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="464" y="218" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><circle cx="424" cy="162" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="352" cy="98" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><rect x="496" y="90" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="528" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="560" y="154" width="16" height="16" rx="2" fill="#e8e8e8" stroke="#5a5a59" stroke-width="1.5"/><rect x="592" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><rect x="624" y="154" width="16" height="16" rx="2" fill="#1b1b1a" stroke="#5a5a59" stroke-width="1.5"/><circle cx="584" cy="98" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="416" cy="34" r="9" fill="#343433" stroke="#d97757" stroke-width="2"/><g fill="#a1a1a0" font-size="12" text-anchor="middle"><text x="318" y="66">NW</text><text x="370" y="66">NE</text><text x="474" y="66">SW</text><text x="514" y="66">SE</text></g></svg>
<figcaption>左：图片和切分线（橙色）。右：四叉树，圆圈是内部结点，方块是叶子（颜色即该区域的颜色），孩子从左到右为 NW、NE、SW、SE。</figcaption>
</figure>

<p>数一下：17 个结点，其中 13 个叶子，代替了原来的 64 个像素。大片同色的区域只占一个叶子，所以四叉树能用来压缩图片。</p>

<h3>k-d 树：依次插入 9 个点</h3>
<p>按根比 x、相等往右，依次插入 A(8,5)、B(2,6)、C(9,3)、D(5,2)、E(6,9)、F(3,4)、G(7,1)、H(3,8)、I(7,7)。</p>
<p>每个点都从根往下走，每层只看一个坐标。比如 D(5,2)：在 A 比 x，5 &lt; 8 往左；到 B 改比 y，2 &lt; 6 往左，挂在 B 左边。D 在深度 2，又比 x，画竖线 x = 5：</p>

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

<p>分割线<strong>只画在自己的格子里</strong>：根的竖线 x = 8 贯穿全图；B 只管 x &lt; 8 那块，横线 y = 6 只画到 x = 8；F 的横线 y = 4 只画到 x = 5。</p>

<h3>写成代码：插入</h3>
<pre><code>typedef struct { int x, y; } point_t;
typedef struct kdnode {
    point_t p;
    struct kdnode *left, *right;
} kdnode_t;

kdnode_t *kd_insert(kdnode_t *t, point_t p, int depth) {
    if (t == NULL) {
        kdnode_t *n = malloc(sizeof(*n));
        assert(n != NULL);
        n-&gt;p = p;
        n-&gt;left = n-&gt;right = NULL;
        return n;
    }
    int a = (depth % 2 == 0) ? p.x : p.y;        /* 新点在本层的坐标 */
    int b = (depth % 2 == 0) ? t-&gt;p.x : t-&gt;p.y;  /* 当前结点在本层的坐标 */
    if (a &lt; b)
        t-&gt;left = kd_insert(t-&gt;left, p, depth + 1);
    else
        t-&gt;right = kd_insert(t-&gt;right, p, depth + 1);
    return t;
}</code></pre>
<ul>
<li>前 5 行：点存 x、y；结点存一个点和左右指针。</li>
<li><code>if (t == NULL)</code>：走到空位，新建结点返回给上一层挂上，和 BST 插入一样。</li>
<li><code>a</code>、<code>b</code> 两行：<code>depth</code> 偶数取 x，奇数取 y。<strong>这是和 BST 唯一不同的地方。</strong></li>
<li><code>if (a &lt; b)</code>：小于往左，否则往右；递归传 <code>depth + 1</code>，下一层自动换坐标。</li>
<li><code>return t</code>：交回当前结点，父结点的指针才接得住新结点。</li>
</ul>
<p>从根调用写 <code>root = kd_insert(root, p, 0);</code>，深度从 0 开始，根才比 x。</p>

<h3>范围查找：碰不到的那一边直接剪掉</h3>
<p>范围查找（range search）就是开头的问题：找出矩形框里的所有点。查询 Q1：x ∈ [1, 4]、y ∈ [3, 7]，含边界（上图黄框）。</p>
<p>每到一个结点做两件事：点本身在框里就报告；再拿框在本层坐标上的范围 [lo, hi] 和分割值 v 比，决定往哪边走。</p>
<ol>
<li>A(8,5)：不在框里。比 x：hi = 4 &lt; 8，框整个在竖线左边，<strong>只走左边，剪掉右子树 C</strong>。</li>
<li>B(2,6)：在框里，报告。比 y：lo = 3 &lt; 6 ≤ hi = 7，框跨过了横线，<strong>两边都要查</strong>。</li>
<li>D(5,2)：不在框里。比 x：hi = 4 &lt; 5，只走左边，剪掉 G。</li>
<li>F(3,4)：在框里，报告。叶子，回到 B 查右边。</li>
<li>E(6,9)：不在框里。比 x：hi = 4 &lt; 6，只走左边，剪掉 I。</li>
<li>H(3,8)：不在框里（8 &gt; 7）。叶子，结束。</li>
</ol>
<p>结果是 B 和 F。整个过程访问了 6 个结点，C、G、I 连看都没看。D、E、H 被访问了却不在框里：<strong>访问过不等于要报告</strong>。</p>

<div class="callout key" data-label="考点">
<p>框在本层坐标上的范围是 [lo, hi]，分割值是 v：<strong>lo &lt; v 就查左子树，hi ≥ v 就查右子树</strong>，只成立一个就剪掉另一边整棵子树。剪枝只看本层坐标；报告要两个坐标都在框里。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-spatial-trees/anims/kd-tree.html" loading="lazy" style="height: 520px;" title="k-d 树的建树与范围查找"></iframe>
<p class="anim-caption">先点“建树”看分割线一条条出现；再点“查询 Q1”逐个结点走，红色区域是剪掉的子树，绿色是报告的点。</p>

<h2>补充：为什么一定要轮换坐标</h2>
<p>动画里的“横条”查询：y ∈ [3, 4]，x 不限。每层都比 x 的话，树只是按 x 排序的 BST，框在 x 上全盖住，9 个点全要看。k-d 树在 B 处比 y，横条整个在 y = 6 下方，直接剪掉 E、H、I，只访问 6 个结点。</p>

<h2>补充：复杂度和用途</h2>
<ul>
<li><strong>插入、精确查找</strong>：走一条从根往下的路，O(树高)。和 BST 一样看插入顺序：<strong>平衡时 O(log n)，最坏退化成链，O(n)</strong>。例如依次插入 (1,1)、(2,2)、…、(5,5)，每个新点两个坐标都更大，一路往右，成了高度 5 的链。点事先都知道时，每次取中位数当根来建树，树高约 log₂ n。</li>
<li><strong>范围查找</strong>：最坏 O(n)（框盖住所有点，或树已退化），一般能剪掉大部分子树。</li>
<li><strong>最近邻（nearest neighbour）</strong>：先走到查询点所在的格子，路上最近的点当作答案，距离记为 d。往回走时，查询点到某条分割线的距离小于 d，线的另一边才需要看。</li>
<li><strong>四叉树</strong>：2<sup>k</sup>×2<sup>k</sup> 的图片每层边长减半，<strong>深度最多是 k</strong>。<strong>最坏情况是棋盘格</strong>：要一直切到单个像素，8×8 时有 1 + 4 + 16 + 64 = 85 个结点，比 64 个像素还多。</li>
</ul>

<table>
<thead><tr><th></th><th>四叉树</th><th>k-d 树</th></tr></thead>
<tbody>
<tr><td>孩子数</td><td>4</td><td>2</td></tr>
<tr><td>怎么切</td><td>区域正中，x、y 同时切</td><td>在一个点处，只按一个坐标，逐层轮换</td></tr>
<tr><td>用途</td><td>图像压缩、地图分块、碰撞检测</td><td>范围查找、最近邻、多属性查询</td></tr>
</tbody>
</table>
<p>三维时 k-d 树按 x、y、z 轮换，四叉树变成八叉树（octree）。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/BK5x7IUTIyU" title="K-d Trees - Computerphile" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Computerphile《K-d Trees》（英文，约 13 分钟），讲 k-d 树怎么一层层切开平面，再用它找最近的点。选哪个点来切、相等往哪边等细节可能和课上不同，做题按本课约定。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算建树</strong>：按顺序插入一串点，画出 k-d 树，有时还要画分割线。</li>
<li><strong>手算范围查找</strong>：访问了哪些结点、剪掉哪些子树、报告哪些点。</li>
<li><strong>四叉树</strong>：给 4×4 或 8×8 的小图画树、数结点；问最坏情况。</li>
<li><strong>选择、填空</strong>：为什么轮换坐标、四叉树几个孩子、复杂度。公式表上没有，要自己记。</li>
</ul>

<h3>例题 1：建树</h3>
<p>依次把 (6,4)、(3,7)、(8,2)、(2,3)、(5,9)、(9,6)、(4,1) 插入空的 k-d 树（根比 x，相等往右），画出树。再插入 (7,5)，它挂在哪里？</p>
<ul>
<li>(6,4) 当根。(3,7)：比 x，3 &lt; 6 左。(8,2)：8 ≥ 6 右。</li>
<li>(2,3)：2 &lt; 6 左；到 (3,7) 比 y，3 &lt; 7 左。(5,9)：5 &lt; 6 左；9 ≥ 7 右。</li>
<li>(9,6)：9 ≥ 6 右；到 (8,2) 比 y，6 ≥ 2 右。</li>
<li>(4,1)：4 &lt; 6 左；1 &lt; 7 左；到 (2,3) 又比 x，4 ≥ 2 右。</li>
<li>(7,5)：7 ≥ 6 右；到 (8,2) 比 y，5 ≥ 2 右；到 (9,6) 比 x，7 &lt; 9 左 → <strong>(9,6) 的左孩子</strong>。</li>
</ul>
<pre><code class="lang-text">            (6,4)            比 x
           /     \\
       (3,7)      (8,2)      比 y
       /    \\         \\
   (2,3)   (5,9)     (9,6)   比 x
       \\             /
      (4,1)      (7,5)       比 y</code></pre>
<p>树高 4（本课叶子高度为 1）。最常见的错是到了第二层还在比 x。</p>

<h3>例题 2：范围查找</h3>
<p>在正文那棵 9 个点的树上查询 Q2：x ∈ [6, 10]，y ∈ [0, 4]。按顺序列出访问的结点，指出剪掉了哪些子树、报告了哪些点。</p>
<ol>
<li>A(8,5)：不在框里（5 &gt; 4）。比 x：lo = 6 &lt; 8 ≤ hi = 10，两边都查，先左后右。</li>
<li>B(2,6)：不在框里。比 y：hi = 4 &lt; 6，只走左边，<strong>剪掉 {E, H, I}</strong>。</li>
<li>D(5,2)：不在框里（5 &lt; 6）。比 x：lo = 6 ≥ 5，只走右边，<strong>剪掉 {F}</strong>。</li>
<li>G(7,1)：在框里，报告。叶子。</li>
<li>回到 A 的右子树，C(9,3)：在框里，报告。叶子。</li>
</ol>
<p>访问 A、B、D、G、C 共 5 个结点，报告 G 和 C。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>根比成 y，整棵树全错；每个结点只比本层一个坐标。</li>
<li>相等往右，所以查右子树的条件是 hi ≥ v，不是 hi &gt; v。</li>
<li>把分割线画穿整个平面；把访问过的点都当成答案。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>四叉树：不一致就在正中切成 NW、NE、SW、SE 四块，内部结点恰好 4 个孩子；最坏是棋盘格。</li>
<li>k-d 树：存点的 BST，根比 x，下一层比 y，轮流；小于往左，大于等于往右。</li>
<li>每个结点是一条分割线，只画在自己的格子里。</li>
<li>范围查找：lo &lt; v 查左，hi ≥ v 查右；报告前两个坐标都要检查。</li>
<li>插入、查找 O(树高)：平衡 O(log n)，最坏退化成链 O(n)。</li>
</ul>
`;
