/* Post body — dsa-heap-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-heap-basics:zh'] = `
<p class="lead">堆（heap）是一棵最大值永远在根上的完全二叉树。它不用指针，按层存进数组就行：本课约定从下标 1 开始，下标 i 的孩子在 2i 和 2i+1，父结点在 ⌊i/2⌋。</p>

<h2>从一个场景说起</h2>
<p>想象医院急诊室。病人不停地进来，每人有一个紧急程度；医生每空下来一次，就要叫当前最急的那一位。</p>
<p>名单怎么记？最直接的两种记法都不好：</p>
<ul>
<li><strong>一直按紧急程度排好序</strong>：叫人很快，拿第一个；可每来一个新病人，都要找到位置插进去，后面的人全往后挪，O(n)。</li>
<li><strong>来一个记一个，不排序</strong>：来人很快，写在末尾；可每次叫人都得从头看到尾找最急的，又是 O(n)。</li>
</ul>
<p>堆是折中：<strong>不把所有人排好序，只保证最急的一定在最上面</strong>。看最急的是谁 O(1)，来人、叫人都是 O(log n)（见 6.2）。这种“随时取最大”的需求叫优先队列（priority queue），堆是它的标准实现（见 6.5）。</p>

<h2>它是什么</h2>
<p>简单说，堆就是一棵<strong>排得整整齐齐、而且每个父结点都不比孩子小</strong>的二叉树。</p>
<p>像公司的组织架构图：每个经理的工资都不低于他直接管的人，那最顶上的老板一定工资最高；至于不同部门的两个员工谁高，这张图不管。</p>
<p>堆由两个条件组成，<strong>缺一不可</strong>：</p>
<ol>
<li><strong>形状：完全二叉树（complete binary tree）</strong>。除了最后一层，每层都填满；最后一层从左往右连续排，中间不留空位。就像电影院入座：坐满一排才去下一排，每排从左往右坐，不跳座位。</li>
<li><strong>堆条件（heap condition）</strong>。<strong>最大堆（max-heap）</strong>：每个父结点 ≥ 它的孩子；<strong>最小堆（min-heap）</strong>：每个父结点 ≤ 它的孩子。<strong>本课默认最大堆</strong>。</li>
</ol>
<p>课上整章（插入、删除、堆排序）都用这个例子：</p>
<pre><code class="lang-text">            27
         /      \\
       24        26
      /  \\      /  \\
     7    12   6    19
    / \\   /
   2   7 7</code></pre>
<p>先看形状：前三层都满，最后一层 2、7、7 从左往右挨着排，是完全二叉树。再看堆条件：有孩子的只有 27、24、26、7、12。27 ≥ 24、26；24 ≥ 7、12；26 ≥ 6、19；7 ≥ 2、7；12 ≥ 7，全部成立。所以它是最大堆。</p>
<p>几个常考结论：</p>
<ul>
<li><strong>根就是最大值</strong>。从任何结点往上走，值只增不减，所以找最大值（find max）只要读根，<strong>O(1)</strong>。</li>
<li><strong>只比父子，不比兄弟</strong>。第三层的 7、12、6、19 之间没有顺序，左边的 12 比右边的 6 大也没关系。所以堆不是二叉搜索树（BST），想找任意一个键只能挨个看，O(n)。</li>
<li>条件是 ≥，<strong>允许重复</strong>：7 下面挂一个 7 没问题。只有一个结点的树既是最大堆也是最小堆。</li>
</ul>
<div class="callout note" data-label="注意">
<p>这里的“堆”和 C 里 <code>malloc</code> 分配内存的“堆区”只是同名，没有关系。</p>
</div>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/0wPlzMU-k00" title="Heaps in 3 minutes — Intro" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Heaps in 3 minutes — Intro》（英文，约 3 分钟），讲堆的基本概念；约定不同时以本课为准（最大堆，下标从 1 开始）。</p>

<h3>判断是不是堆</h3>
<p>先查形状完不完全，再查父子大小。下面三棵树都<strong>不是</strong>最大堆：</p>
<figure class="fig">
<svg viewBox="0 0 640 215" width="640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="三棵都不是最大堆的树：(a) 18 没有孩子而右边的 16 有孩子；(b) 17 只有左孩子而右边的 20 有孩子；(c) 形状完全但 4 小于孩子 11 和 6，11 小于孩子 15 和 20">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="106" y1="30" x2="56" y2="85"/><line x1="106" y1="30" x2="156" y2="85"/><line x1="156" y1="85" x2="131" y2="140"/><line x1="156" y1="85" x2="181" y2="140"/><line x1="319" y1="30" x2="269" y2="85"/><line x1="319" y1="30" x2="369" y2="85"/><line x1="269" y1="85" x2="244" y2="140"/><line x1="369" y1="85" x2="344" y2="140"/><line x1="369" y1="85" x2="394" y2="140"/></g>
<g stroke="#f87171" stroke-width="2.5"><line x1="532" y1="30" x2="482" y2="85"/><line x1="532" y1="30" x2="582" y2="85"/><line x1="482" y1="85" x2="457" y2="140"/><line x1="482" y1="85" x2="507" y2="140"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="106" cy="30" r="14"/><circle cx="56" cy="85" r="14"/><circle cx="156" cy="85" r="14"/><circle cx="131" cy="140" r="14"/><circle cx="181" cy="140" r="14"/><circle cx="319" cy="30" r="14"/><circle cx="269" cy="85" r="14"/><circle cx="369" cy="85" r="14"/><circle cx="244" cy="140" r="14"/><circle cx="344" cy="140" r="14"/><circle cx="394" cy="140" r="14"/><circle cx="582" cy="85" r="14"/><circle cx="457" cy="140" r="14"/><circle cx="507" cy="140" r="14"/></g>
<g fill="#343433" stroke="#f87171" stroke-width="2"><circle cx="532" cy="30" r="14"/><circle cx="482" cy="85" r="14"/></g>
<g fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="4 3"><circle cx="31" cy="140" r="14"/><circle cx="81" cy="140" r="14"/><circle cx="294" cy="140" r="14"/></g>
<g fill="#e8e8e8" font-size="13" font-weight="700" text-anchor="middle"><text x="106" y="35">30</text><text x="56" y="90">18</text><text x="156" y="90">16</text><text x="131" y="145">9</text><text x="181" y="145">12</text><text x="319" y="35">30</text><text x="269" y="90">17</text><text x="369" y="90">20</text><text x="244" y="145">10</text><text x="344" y="145">8</text><text x="394" y="145">5</text><text x="532" y="35">4</text><text x="482" y="90">11</text><text x="582" y="90">6</text><text x="457" y="145">15</text><text x="507" y="145">20</text></g>
<g text-anchor="middle"><text x="106" y="182" font-size="14" font-weight="700" fill="#f87171">(a) ✗ 不完全</text><text x="106" y="202" font-size="12" fill="#a1a1a0">18 没有孩子，16 却有</text><text x="319" y="182" font-size="14" font-weight="700" fill="#f87171">(b) ✗ 不完全</text><text x="319" y="202" font-size="12" fill="#a1a1a0">17 缺右孩子，后面还有结点</text><text x="532" y="182" font-size="14" font-weight="700" fill="#f87171">(c) ✗ 违反堆条件</text><text x="532" y="202" font-size="12" fill="#a1a1a0">4 &lt; 11、11 &lt; 15 …</text></g>
</svg>
<figcaption>图 1　三棵都不是最大堆。红色虚线圈是按层排列时空出来的位置；红线连着违反最大堆条件的父子。</figcaption>
</figure>
<ul>
<li>(a) 最后一层左边空了两格，<strong>不完全</strong>。值全都满足父 ≥ 子也不是堆。</li>
<li>(b) 10 和 8 之间空了一格，<strong>不完全</strong>。</li>
<li>(c) 形状完全，但 4 &lt; 11、11 &lt; 15，<strong>违反最大堆条件</strong>。反过来看，每个父结点都 ≤ 孩子，它是一个<strong>合法的最小堆</strong>。</li>
</ul>
<p><strong>只有左孩子本身不违规</strong>：例子里的 12 也只有左孩子，但它后面没有结点了，树仍然完全。违规的是“空位后面还有结点”。</p>

<h2>看个例子：把课上的堆存进数组</h2>
<p>完全二叉树没有空位，可以按层挨个放进数组，不需要 <code>left</code>/<code>right</code> 指针。</p>
<p><strong>第 1 步，按层编号。</strong>从根开始，一层一层、每层从左往右编号。<strong>本课约定根是 1</strong>：27 是 1；24、26 是 2、3；7、12、6、19 是 4 到 7；最底层 2、7、7 是 8 到 10。</p>
<p><strong>第 2 步，编号就是数组下标。</strong>把每个值放进对应的格子，<strong>下标 0 空着不用</strong>：</p>
<pre><code class="lang-text">i      0   1  2  3  4  5  6  7  8  9 10
H[i]   -  27 24 26  7 12  6 19  2  7  7</code></pre>
<p><strong>第 3 步，找孩子。</strong>根（下标 1）的孩子 24、26 在下标 2、3；接着下标 2 的 24，孩子 7、12 在 4、5；下标 3 的 26，孩子 6、19 在 6、7。每个父结点按顺序占两格，所以<strong>下标 i 的孩子在 2i 和 2i+1</strong>。</p>
<p><strong>第 4 步，反过来找父结点。</strong>除以 2 再向下取整：下标 9 的 7，父结点在 ⌊9/2⌋ = 4，就是另一个 7。下标 8 和 9 是兄弟，⌊8/2⌋ = ⌊9/2⌋ = 4。C 的整数除法 <code>i / 2</code> 正好就是 ⌊i/2⌋。</p>
<div class="callout key" data-label="考点">
<p>下标从 1 开始：<strong>左孩子 2i，右孩子 2i+1，父结点 ⌊i/2⌋</strong>。公式表上没有，必须背。</p>
</div>
<p><strong>第 5 步，分出父结点和叶子。</strong>最后一个结点在下标 n，它的父结点 ⌊n/2⌋ 就是最后一个有孩子的结点。所以<strong>下标 1 到 ⌊n/2⌋ 是父结点，⌊n/2⌋+1 到 n 全是叶子</strong>。这里 n = 10：下标 1 到 5（27、24、26、7、12）是父结点，6 到 10 是叶子。</p>
<p>细节：12 在下标 5，右孩子本应在 11，可 11 &gt; n。所以<strong>最后一个父结点可能只有左孩子</strong>，写代码要先判断 2i+1 ≤ n。</p>
<p>高度：n 个元素的堆有 ⌊log₂ n⌋ + 1 层（10 个元素 4 层），6.2 的插入、删除最多走这么多层，所以是 O(log n)。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-heap-basics/anims/heap-index.html" loading="lazy" style="height: 560px;" title="堆的数组下标：结点与数组格子对应"></iframe>
<p class="anim-caption">点树上的结点或下面的格子（或按“下一步”逐个看），它的父结点和孩子会在树和数组里同时亮起，下方给出下标算式；上方可以切换下标从 1 或 0 开始、二叉到四叉。</p>

<h2>补充：用 C 判断数组是不是最大堆</h2>
<p>数组里连续存的 n 个元素，按层排出来<strong>一定是完全二叉树</strong>，所以只需查堆条件，而且只查前 ⌊n/2⌋ 个父结点：</p>
<pre><code>/* 最大堆存在 H[1..n]，H[0] 不用 */
int is_max_heap(const int H[], int n) {
    for (int i = 1; i &lt;= n / 2; i++) {
        if (H[2 * i] &gt; H[i]) return 0;
        if (2 * i + 1 &lt;= n &amp;&amp; H[2 * i + 1] &gt; H[i]) return 0;
    }
    return 1;
}</code></pre>
<ul>
<li>第 3 行：i 只走到 n/2，后面全是叶子，没有孩子可比。</li>
<li>第 4 行：左孩子 2i 一定存在（i ≤ n/2 保证 2i ≤ n），它比父结点大就不是堆。</li>
<li>第 5 行：右孩子可能不存在，先判断 2i+1 ≤ n 再比较。<code>&amp;&amp;</code> 左边为假时右边不会执行，不会越界。</li>
<li>第 7 行：所有父结点都通过，才返回 1。</li>
</ul>
<p>每个父结点最多比两次，总共 <strong>O(n)</strong>。</p>

<h2>补充：下标从 0 开始，以及 d 叉堆</h2>
<p>往年考题里的堆常从下标 0 开始存。同一个结点，0 起的下标比 1 起的小 1，代进公式就得到：<strong>孩子 2i+1、2i+2，父结点 ⌊(i−1)/2⌋，最后一个父结点 ⌊n/2⌋−1</strong>。</p>
<p><strong>d 叉堆（d-ary heap）</strong>就是每个父结点最多 d 个孩子，形状同样要完全。道理和二叉一样，每个父结点按顺序占 d 格：根在下标 0 时，根的孩子占 1 到 d，下标 1 的孩子占 d+1 到 2d……所以<strong>下标 i 的孩子在 d·i+1 到 d·i+d，父结点在 ⌊(i−1)/d⌋</strong>。</p>
<table>
<thead><tr><th></th><th>根在下标 0</th><th>根在下标 1</th></tr></thead>
<tbody>
<tr><td>二叉：孩子；父结点</td><td>2i+1、2i+2；⌊(i−1)/2⌋</td><td>2i、2i+1；⌊i/2⌋</td></tr>
<tr><td>三叉：孩子</td><td>3i+1 … 3i+3</td><td>3i−1 … 3i+1</td></tr>
<tr><td>四叉：孩子</td><td>4i+1 … 4i+4</td><td>4i−2 … 4i+1</td></tr>
<tr><td>d 叉：孩子；父结点</td><td>d·i+1 … d·i+d；⌊(i−1)/d⌋</td><td>d·i−d+2 … d·i+1；⌊(i+d−2)/d⌋</td></tr>
</tbody>
</table>
<div class="callout warn" data-label="易错">
<p>答题先写明假设：根在下标 0 还是 1，两种答案差 1，往年题明确要求写出。另外 0 起时根没有父结点，但 C 里 <code>(0 - 1) / 2</code> 向零截断得 0，根要单独处理。</p>
</div>

<h2>考试怎么考</h2>
<p>常见三种题：<strong>判断是不是堆</strong>（也可能问最小堆）；<strong>算父结点和孩子的下标</strong>，包括三叉、四叉堆（2016、2015 年各考过）；“最大、最小值可能在哪”的选择题。</p>

<h3>例题 1：数组是不是最大堆</h3>
<p>H[1..10] = 50 45 40 30 46 35 10 25 28 44（H[0] 不用）。它是最大堆吗？如果不是，交换哪两个元素能修好？</p>
<p>数组的形状一定完全，只查堆条件。父结点是下标 1 到 ⌊10/2⌋ = 5，逐个和孩子 2i、2i+1 比：</p>
<ul>
<li>i = 1：50 ≥ 45、40 ✓</li>
<li>i = 2：45 ≥ 30，但 45 &lt; 46（下标 5）✗</li>
<li>i = 3：40 ≥ 35、10 ✓</li>
<li>i = 4：30 ≥ 25、28 ✓</li>
<li>i = 5：只有左孩子 44（下标 10），46 ≥ 44 ✓</li>
</ul>
<p>所以<strong>不是最大堆</strong>，唯一的问题是下标 2 的 45 小于它的右孩子 46。交换 H[2] 和 H[5]，得到 50 46 40 30 45 35 10 25 28 44：50 ≥ 46；46 ≥ 30、45；45 ≥ 44，其余不变，全部成立。</p>

<h3>例题 2：四叉堆的下标</h3>
<p>四叉堆存在数组里，根在下标 0，共 20 个元素。下标 3 的孩子在哪？下标 17 的父结点在哪？最后一个父结点是谁，有几个孩子？</p>
<p>先写假设：根在下标 0。</p>
<ul>
<li>孩子：4·3+1 到 4·3+4，即 <strong>13、14、15、16</strong>（下标 0、1、2 的孩子已占掉 1 到 12）。</li>
<li>父结点：⌊(17−1)/4⌋ = <strong>4</strong>。反查：下标 4 的孩子是 17 到 20，确实包含 17。</li>
<li>最后一个元素在下标 19，父结点 ⌊(19−1)/4⌋ = <strong>4</strong>。下标 4 的孩子本应是 17 到 20，但 20 不存在，所以<strong>只有 3 个孩子</strong>。完全的 d 叉树里，只有最后一个父结点可以不满。</li>
</ul>

<h3>选择题里的位置推理</h3>
<ul>
<li>键互不相同时，<strong>第二大一定是根的孩子</strong>（下标 2 或 3）：它的父结点必须比它大，只有最大值满足。</li>
<li>键互不相同时，<strong>最小值一定在叶子</strong>（下标 ⌊n/2⌋+1 到 n）：它要是有孩子，孩子会比它更小。</li>
<li><strong>降序排好的数组一定是最大堆</strong>（父结点下标 ⌊i/2⌋ 总在 i 前面），<strong>反过来不成立</strong>：课上的例子是最大堆，但 24 &lt; 26，不是降序。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>拿兄弟互相比较；以为“只有左孩子”就不完全；0 起和 1 起的公式混用；以为堆的数组是有序的。</p>
</div>

<h2>小结</h2>
<ul>
<li>堆 = <strong>完全二叉树 + 堆条件</strong>。本课默认最大堆（父 ≥ 子），根是最大值，读根 O(1)。</li>
<li>只比父子、不比兄弟，所以堆不是 BST，查任意键 O(n)。</li>
<li>本课数组从下标 1 开始：<strong>孩子 2i、2i+1，父结点 ⌊i/2⌋</strong>；下标 1 到 ⌊n/2⌋ 是父结点，其余是叶子。</li>
<li>0 起：孩子 2i+1、2i+2，父结点 ⌊(i−1)/2⌋；d 叉（0 起）：孩子 d·i+1 到 d·i+d。答题先写明根在下标 0 还是 1。</li>
</ul>
`;
