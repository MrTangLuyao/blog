/* Post body — dsa-best-worst-average / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-best-worst-average:zh'] = `
<p class="lead">同一个算法、同样 n 个数据，有的输入快，有的输入慢。最好、最坏、平均情况回答“挑哪一种输入”，O、Ω、Θ 回答“给这个次数什么界”，这是两个互不相干的问题。</p>

<h2>从一个场景说起</h2>
<p>你在一叠没排过序的 15 份作业里找自己的那份，从上往下一份份翻。</p>
<p>运气好，最上面就是你的，翻 1 次。运气差，你的压在最底下或者根本没交上去，要翻满 15 次。同样 15 份，次数取决于你的那份放在哪。</p>
<p>再看通勤。“最堵的那天”是从所有日子里挑出一天；“那天最多 1 小时”是对那天时长的描述。<strong>挑哪一天</strong>和<strong>怎么描述那天</strong>，是两件事。</p>

<h2>它是什么</h2>
<p>简单说：输入的规模一样，内容不同，花的时间也可能不同。于是分三种情况：</p>
<ul>
<li><strong>最好情况（best case）</strong>：所有规模为 n 的输入里，操作次数最少的那个，好比作业在最上面。</li>
<li><strong>最坏情况（worst case）</strong>：次数最多的那个，好比作业在最底下或不在。</li>
<li><strong>平均情况（average case）</strong>：课上的求法是列出所有可能的情况，把次数加起来，再除以情况数。</li>
</ul>
<p>每种情况都得到一个 n 的函数：T_best(n)、T_worst(n)、T_avg(n)，总有 <strong>T_best(n) ≤ T_avg(n) ≤ T_worst(n)</strong>。</p>
<p>O、Ω、Θ 是另一回事：它们给<strong>一个函数</strong>定上界、下界、紧确界（见 1.4、1.5）。所以完整的结论分两步：<strong>先选情况</strong>，得到一个函数（挑出最堵的那天）；<strong>再给界</strong>，用 O、Ω 或 Θ 描述它（那天最多 1 小时）。</p>
<div class="callout warn" data-label="易错">
<p><strong>n 是固定的。</strong>最好情况比的是“同样 n 个元素，哪种摆法最省”。“n = 1 时最快”不是最好情况。</p>
</div>

<h2>看个例子：15 个数里查找</h2>
<p>数组 A 里有 15 个数 2, 4, 6, …, 30，已经排好序。分别用两种方法找同一个目标，只数比较次数。</p>

<h3>顺序查找</h3>
<p><strong>顺序查找（sequential / linear search）</strong>就是翻作业：从 A[0] 开始逐个比，相等就停。</p>
<ul>
<li>目标是 A[0]：1 次。这是最好情况。</li>
<li>目标是 A[14]，或者根本不在数组里：15 次。这是最坏情况，一般地是 n 次。</li>
<li>目标是 A[k−1]：k 次。</li>
</ul>
<p>平均情况先要一个假设：目标一定在数组里，落在每个位置的可能性一样。那 15 种情况的次数就是 1, 2, …, 15，加起来除以 15：</p>
<pre><code class="lang-text">T_avg(15) = (1 + 2 + … + 15) / 15 = 120 / 15 = 8</code></pre>
<p>换成一般的 n，用公式表上的等差数列求和：</p>
<pre><code class="lang-text">T_avg(n) = (1 + 2 + … + n) / n = [n(n+1)/2] / n = (n+1)/2</code></pre>
<p>平均值依赖这个假设。题目没有特别说明，就按“目标存在、各位置等可能”算。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/lj3E24nnPjI" title="1.11 Best Worst and Average Case Analysis" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《1.11 Best Worst and Average Case Analysis》（英文）。先用顺序查找讲三种情况，平均同样得到 (n+1)/2，再用二叉搜索树举一例（见 3.3）。</p>

<h3>二分查找</h3>
<p><strong>二分查找（binary search）</strong>只能用在有序数组上：先看中间的元素，相等就停；目标更小就去左半边，更大就去右半边，每次丢掉一半。</p>
<p>课上的约定：<strong>每看一个 A[mid] 算 1 次比较</strong>；剩偶数个元素时取靠右的中间。n = 15 时每一段都是奇数个，取整方向不影响。</p>
<p>一步步走：第 1 次看 A[7] = 16，目标是 16 就结束。不是就剩 7 个，第 2 次看 A[3] 或 A[11]；还不是就剩 3 个，第 3 次看中间那个；最后剩 1 个，第 4 次看它。每个下标要比几次，和顺序查找对照：</p>
<pre><code class="lang-text">下标  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14
二分  4  3  4  2  4  3  4  1  4  3  4  2  4  3  4
顺序  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15</code></pre>
<ul>
<li><strong>最好</strong>：1 次，目标是 A[7]。</li>
<li><strong>最坏</strong>：4 次，等于 <strong>⌊log₂ n⌋ + 1</strong>。每次砍掉一半，n 个元素最多砍 ⌊log₂ n⌋ 次就只剩 1 个，再看它 1 次。目标不在数组里时，n = 15 也是 4 次。</li>
<li><strong>平均</strong>：1 个位置要 1 次，2 个要 2 次，4 个要 3 次，8 个要 4 次，(1 + 4 + 12 + 32) / 15 = 49/15 ≈ 3.27 次。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-best-worst-average/anims/search-race.html" loading="lazy" style="height: 460px;" title="顺序查找 vs 二分查找"></iframe>
<p class="anim-caption">拖动滑块选目标，或切到“不在数组里”，再按播放：两行同时走，每帧各比较一次，看计数器谁先停。试试 A[0]、A[7]、A[14]。</p>

<h2>情况和界是两回事</h2>
<p>选定一种情况，得到的就是一个普通的函数，照常给它 O、Ω、Θ。把上面的结果填成表，每一格都是“某一种情况 + 它的紧确界”：</p>
<table>
<thead><tr><th></th><th>最好情况</th><th>平均情况（目标存在）</th><th>最坏情况</th></tr></thead>
<tbody>
<tr><td>顺序查找</td><td>1 → Θ(1)</td><td>(n+1)/2 → Θ(n)</td><td>n → Θ(n)</td></tr>
<tr><td>二分查找</td><td>1 → Θ(1)</td><td>约 log₂ n − 1 → Θ(log n)</td><td>⌊log₂ n⌋ + 1 → Θ(log n)</td></tr>
</tbody>
</table>
<p>所以 <strong>Big-O 不等于最坏情况，Ω 不等于最好情况，Θ 也不等于平均情况</strong>。“顺序查找的最好情况是 O(n)”是对的（1 ≤ n，只是很松）；“顺序查找的最坏情况是 Ω(n)”也对（最坏的输入至少比较约 n 次）。</p>

<h3>题目没说是哪种情况</h3>
<p>如果只说“运行时间是 …”，不说哪种情况，这句话就得对<strong>每一个</strong>输入都成立：</p>
<ul>
<li>说 O(g)：所有输入都不超过它，等于说<strong>最坏情况</strong> ∈ O(g)。</li>
<li>说 Ω(g)：所有输入都不低于它，等于说<strong>最好情况</strong> ∈ Ω(g)。</li>
<li>说 Θ(g)：两条都要成立，即<strong>最好和最坏情况都是 Θ(g)</strong>。</li>
</ul>
<p>二分查找最好 Θ(1)、最坏 Θ(log n)。于是 O(log n) 对，O(n) 也对（松），Ω(1) 对，<strong>Θ(log n) 错</strong>：运气好 1 次就结束，下界到不了 log n。想说 Θ(log n)，就得带上情况：“二分查找的<strong>最坏情况</strong>是 Θ(log n)”。同理，顺序查找是 O(n)、Ω(1)，但不是 Θ(n)。</p>
<div class="callout key" data-label="考点">
<p>课上小测出过、期末复习又重放的题：n 个元素的有序数组上做二分查找，关于运行时间哪一项<strong>不正确</strong>？答案是 <strong>Θ(log n)</strong>。O(n)、Ω(1) 看着别扭，但都对。</p>
</div>
<p>平均情况一般和最坏情况同属一类（如上表），不单独提；不同类时才单独给，例如快速排序平均 Θ(n log n)、最坏 Θ(n²)（见 5.6）。</p>

<h2>两步操作的最好情况：在 X 后面插入</h2>
<p>有序数组和有序链表各存 n 个不同的元素，要在一个已经存在的元素 X <strong>紧后面</strong>插入新元素，数组末尾有空位。</p>
<ul>
<li><strong>数组</strong>分两步：先二分查找找到 X，再把 X 后面的元素都右移一格，空出位置。</li>
<li><strong>链表</strong>分两步：从头往后找 X，再改两根指针接上新结点。</li>
</ul>
<p>数组的最好情况是多少？容易这样想：查找最好 1 次（X 在正中间），移动最好 0 个（X 是最后一个），加起来 Θ(1)。</p>
<p><strong>这是错的。</strong>两个“最好”要的不是同一个 X：X 在正中间时要挪一半元素；X 在末尾时不用挪，但二分查找要比满 ⌊log₂ n⌋ + 1 次才到得了末尾。</p>
<p>正确做法：<strong>对同一个 X 把两步代价相加，再在所有 X 里取最小。</strong>用上面 15 个数实算，挑 4 个 X：</p>
<table>
<thead><tr><th>X</th><th>下标</th><th>二分比较</th><th>右移元素</th><th>合计</th></tr></thead>
<tbody>
<tr><td>16</td><td>7</td><td>1</td><td>7</td><td>8</td></tr>
<tr><td>2</td><td>0</td><td>4</td><td>14</td><td>18</td></tr>
<tr><td>28</td><td>13</td><td>3</td><td>1</td><td>4</td></tr>
<tr><td>30</td><td>14</td><td>4</td><td>0</td><td>4</td></tr>
</tbody>
</table>
<p>15 个 X 全算一遍，合计最小是 4（X = 28 或 30），最大是 18（X = 2）。最省的是 X 在末尾：代价大的移动（可达 Θ(n)）取到 0，代价小的查找付全价。所以<strong>有序数组的最好情况是 Θ(log n)</strong>。</p>
<p>链表没有这个矛盾：X 是头结点时比较 1 次就找到，改两根指针，<strong>最好情况 Θ(1)</strong>。</p>
<table>
<thead><tr><th></th><th>最好情况</th><th>最坏情况</th></tr></thead>
<tbody>
<tr><td>有序数组</td><td>X 是最后一个：Θ(log n)</td><td>X 是第一个：Θ(n)（右移 n−1 个）</td></tr>
<tr><td>有序链表</td><td>X 是头结点：Θ(1)</td><td>X 是尾结点：Θ(n)（走 n 个结点）</td></tr>
</tbody>
</table>
<p>两者最坏情况都是 O(n)。</p>
<div class="callout warn" data-label="易错">
<p>多步操作的最好情况，不能把各步的最好情况直接相加，那样只会<strong>低估</strong>，必须找同一个输入。各步的最坏情况直接相加只会高估，拿来写 O 上界不会错。</p>
</div>

<h2>考试怎么考</h2>
<p>以选择、多选、判断为主（课上小测和最后的复习课都出过）。往年卷的短答题常要“用 big-O 给最紧上界”：先找最坏输入，再写它所在的类，例如往 n 个元素的有序链表插入一个元素，答 O(n)。</p>
<p>要背：顺序查找 1 / (n+1)/2 / n；二分查找最好 1、最坏 ⌊log₂ n⌋ + 1。等差数列求和在公式表上。</p>

<h3>例题 1：多选</h3>
<p>在 n 个元素的未排序数组上顺序查找，目标可能不在。哪些说法正确？(A) 运行时间是 O(n)；(B) 运行时间是 Θ(n)；(C) 最坏情况是 Θ(n)；(D) 最好情况是 O(n)；(E) 运行时间是 Ω(n)。</p>
<p><strong>答案：A、C、D。</strong></p>
<ul>
<li>A 对：不带情况的 O，看最坏情况。最坏比较 n 次，属于 O(n)。</li>
<li>C 对：最坏情况恰好 n 次，Θ(n)。</li>
<li>D 对：最好情况 1 次，1 ≤ n，成立，只是很松，紧确的写法是 Θ(1)。</li>
<li>B、E 错：不带情况的 Θ(n) 或 Ω(n)，要求每个输入都至少比较约 n 次，可目标是 A[0] 时 1 次就结束。</li>
</ul>

<h3>例题 2：判断</h3>
<p>有序数组用二分查找，未排序数组（同样 n 个元素，n 很大）用顺序查找。“二分查找的比较次数总是更少”，对不对？</p>
<ul>
<li><strong>目标在数组里：错。</strong>目标恰好是未排序数组的第一个元素时，顺序查找只要 1 次；二分查找除非目标正是中间元素，否则至少 2 次。看上面的对照表，下标 0、1、2 处顺序查找都更少（1 比 4、2 比 3、3 比 4）。</li>
<li><strong>目标不在数组里：对。</strong>顺序查找必须比完 n 个；二分查找至多 ⌊log₂ n⌋ + 1 次就能断定不在，n ≥ 3 时比 n 小。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>最常见的坑：把 O 当最坏、Ω 当最好、Θ 当平均；没看清选项写的是 O 还是 Ω；题目说“任意一棵 BST”而没说平衡，查找最坏要答 O(n)（见 3.3）。</p>
</div>

<h2>小结</h2>
<ul>
<li>最好、最坏、平均情况：同样规模 n 的输入里挑哪一种。n 固定，不是“n 越小越好”。</li>
<li>O、Ω、Θ：给一个函数什么界。每种情况都是一个函数，各有自己的 Θ。</li>
<li>不说情况时：O 看最坏，Ω 看最好，Θ 要求两者同属一类。所以二分查找是 O(log n)、Ω(1)，但不是 Θ(log n)。</li>
<li>顺序查找 1 / (n+1)/2 / n；二分查找最好 1、最坏 ⌊log₂ n⌋ + 1。</li>
<li>多步操作的最好情况要对同一个输入算：在 X 后插入，有序数组最好 Θ(log n)，有序链表最好 Θ(1)，最坏都是 O(n)。</li>
</ul>
`;
