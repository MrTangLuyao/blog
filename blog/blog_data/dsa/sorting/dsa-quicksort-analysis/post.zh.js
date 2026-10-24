/* Post body — dsa-quicksort-analysis / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-quicksort-analysis:zh'] = `
<p class="lead">快速排序的总时间 = 每层分区 O(n) × 层数：pivot 分得均匀是 Θ(n log n)，每次都在一端是 Θ(n²)。pivot 的选法决定哪些输入最坏；快速排序不稳定，额外空间来自递归栈。</p>

<h2>从一个场景说起</h2>
<p>手上有 64 份试卷，要按分数排好。办法是：抽一张当标准，比如 70 分，比它低的放左边一摞，不低于它的放右边一摞。两摞再各自这样分，直到每摞一张。</p>
<p>每一轮都要把所有试卷过一遍，真正决定快慢的是要分几轮。运气好，每次抽到中间分数，每摞减半，大约 6 轮分完（2⁶ = 64）。运气差，试卷本来就从低到高叠好，你每次抽最上面那张，总是最低分，每轮只分出一张，要 63 轮。</p>
<p>这张“标准”就是 pivot（枢轴）。快速排序快不快，全看 pivot 选得好不好。</p>

<h2>它是什么：递归树</h2>
<p>简单说，把每次分区（partition）画成树的一个结点，就得到递归树（recursion tree）：结点是 pivot，左边的子数组是左子树，右边的是右子树。分析时只看两样东西：</p>
<ul>
<li><strong>每层的代价</strong>：同一层的子数组是原数组里互不重叠的几段，分区代价和段长成正比（见 5.5），所以<strong>每层合计不超过 cn，即 O(n)</strong>，对应“每轮把所有试卷过一遍”。</li>
<li><strong>层数</strong>：取决于 pivot 分得是否均匀，对应“要分几轮”。</li>
</ul>
<pre><code class="lang-text">总代价 ≈ O(n) × 层数</code></pre>
<p>这棵树和 BST 一样（见 3.3）：平衡时高度约 log₂ n，退化成一条链时高度接近 n。</p>

<h2>看个例子</h2>
<h3>课上的例子：一层一层数</h3>
<p>沿用 5.5 的 [5, 8, 7, 1, 3, 4, 0, 6, 9, 2]，pivot 取首元素，用课上的分区。第 1 次分区处理全部 10 个，得到 [4, 2, 0, 1, 3 | 5 | 7, 6, 9, 8]，下一层两边各分一次。同一深度的分区放一行（子数组按分区前的样子列出）：</p>
<table>
<thead><tr><th>层</th><th>这一层分区的子数组</th><th>元素数</th></tr></thead>
<tbody>
<tr><td>1</td><td>[5, 8, 7, 1, 3, 4, 0, 6, 9, 2]</td><td>10</td></tr>
<tr><td>2</td><td>[4, 2, 0, 1, 3]　[7, 6, 9, 8]</td><td>9</td></tr>
<tr><td>3</td><td>[3, 2, 0, 1]　[9, 8]</td><td>6</td></tr>
<tr><td>4</td><td>[1, 2, 0]</td><td>3</td></tr>
</tbody>
</table>
<p>只剩 0 或 1 个元素的子数组（如 [6]）不用再分。4 层，每层都不超过 10 个。</p>

<h3>最好情况：pivot 每次都是中位数</h3>
<p>n = 15，每个 pivot 都是所在子数组的中位数：第 1 层处理 15 个，分成 7 + 7；第 2 层处理 14 个，分成四段各 3 个；第 3 层处理 12 个，之后只剩单个元素。每过一层段长减半，<strong>约 log₂ n 层</strong>，合计 <strong>Θ(n log n)</strong>。</p>
<p>递推式（recurrence）是 <strong>T(n) = 2T(n/2) + cn</strong>：两个一半大小的子问题，加上这一层分区的 cn。用主定理（Master Theorem，见 1.9：a = 2，b = 2，d = 1，a = b<sup>d</sup>）或展开法（见 1.8）都得 Θ(n log n)。</p>

<h3>最坏情况：pivot 每次都在一端</h3>
<p>输入已排好：[1, 2, 3, 4, 5, 6, 7]，pivot 取首元素 1。i 从下标 1 找 ≥ 1 的元素，马上停在 2；j 从末尾往回找 &lt; 1 的，一个也没有，一路退回 pivot 的位置；最后 pivot 和自己交换。</p>
<p>左边 0 个、右边 6 个，右边 [2, …, 7] 仍然有序，下一层的 pivot 2 又是最小值。每层只少一个：</p>
<pre><code class="lang-text">第 1 层  [1 2 3 4 5 6 7]   7 个
第 2 层    [2 3 4 5 6 7]   6 个
  …
第 6 层            [6 7]   2 个      共 n − 1 = 6 层</code></pre>
<p>递推式 <strong>T(n) = T(n−1) + cn</strong>，和选择排序、插入排序一样（见 1.8），展开得 c(n+2)(n−1)/2，是 <strong>Θ(n²)</strong>。</p>
<p>条件是“每个 pivot 都是所在子数组的最小值或最大值”，所以不只是已排序：<strong>逆序</strong>（最大、最小交替出现，见例题 2）和<strong>全部相等</strong>（课上把等于 pivot 的放右边，每次只放好一个）也都是 n − 1 层。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-quicksort-analysis/anims/recursion-tree.html" loading="lazy" style="height: 600px;" title="快速排序的递归树"></iframe>
<p class="anim-caption">每一行是递归树的一层，右边是这一层的元素总数。先点“随机输入”数层数，再点“已排序”看 n − 1 层的阶梯，最后点“已排序 · 三数取中”：同一个输入只分 3 层。</p>

<h3>平均情况：Θ(n log n)</h3>
<p>课上不证明，直观原因是不必每次正好对半。假设每次都分成 1 : 9，大的一边每层缩到 9/10，层数 log<sub>10/9</sub> n ≈ 6.6 log₂ n，仍是 O(log n)。n = 100 万时约 131 层，而最坏是 999 999 层。<strong>只要按固定比例分（哪怕 1 : 99），都是 Θ(n log n)</strong>。</p>
<p>随机排列里 pivot 落在最小或最大 10% 的概率只有 20%，每次都抽中端点几乎不可能。实测 n = 10000 的随机排列约 30 层。所以<strong>平均 Θ(n log n)</strong>，而且<strong>任何基于比较的排序，平均都不可能好于 n log n</strong>（计数排序不比较键，不受此限）。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/-qOVVRIZzao" title="2.8.2 QuickSort Analysis" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《2.8.2 QuickSort Analysis》（英文），讲最好情况的 log n 层、已排序输入的最坏情况，以及中间、随机 pivot。分区细节和课上略有不同，分析方法一样。</p>

<h2>pivot 怎么选</h2>
<p>课上的分区只认 A[lo] 作 pivot，所以每种策略都是先挑一个元素换到 A[lo]，再照常分区。</p>
<table>
<thead><tr><th>策略</th><th>已排序 / 逆序输入</th><th>说明</th></tr></thead>
<tbody>
<tr><td>首元素 / 末元素</td><td>最坏，n − 1 层</td><td>课上默认用首元素</td></tr>
<tr><td>中间元素</td><td>接近对半</td><td>其他输入仍可能退化</td></tr>
<tr><td>随机元素</td><td>期望 O(log n) 层</td><td>键互不相同时，任何输入期望都是 Θ(n log n)</td></tr>
<tr><td>三数取中（median-of-3）</td><td>对半分</td><td>首、中、末三个的中位数；课上推荐</td></tr>
</tbody>
</table>
<p>三数取中在 [1, 2, …, 7] 上看到 1、4、7，选中 4，正是中位数，分成 [1, 2, 3] 和 [5, 6, 7]；两边再选到 2 和 6，2 层结束。逆序输入也是 2 层。代码只在分区前多一行：</p>
<pre><code>void median_of_3(int A[], int lo, int hi) {
    int mid = lo + (hi - lo) / 2;
    if (A[mid] &lt; A[lo])  swap(&amp;A[mid], &amp;A[lo]);
    if (A[hi]  &lt; A[lo])  swap(&amp;A[hi],  &amp;A[lo]);
    if (A[hi]  &lt; A[mid]) swap(&amp;A[hi],  &amp;A[mid]);
    swap(&amp;A[lo], &amp;A[mid]);
}

void quicksort(int A[], int lo, int hi) {
    if (lo &lt; hi) {
        median_of_3(A, lo, hi);    /* delete this line: first-element pivot */
        int p = partition(A, lo, hi);
        quicksort(A, lo, p - 1);
        quicksort(A, p + 1, hi);
    }
}</code></pre>
<ul>
<li><code>mid</code> 是中间下标，等于 (lo + hi) / 2，这样写不会溢出。</li>
<li>三个 <code>if</code> 把三个位置排成 A[lo] ≤ A[mid] ≤ A[hi]：前两句把最小的放到 lo，第三句排好 mid 和 hi，中位数就在 mid。</li>
<li>最后一句把中位数换到 A[lo]。</li>
<li><code>quicksort</code> 比 5.5 只多一行 <code>median_of_3</code>，<code>partition</code> 不用改。</li>
</ul>
<p>随机 pivot 把那一行换成下面一句（需要 <code>#include &lt;stdlib.h&gt;</code>），<code>lo + rand() % (hi - lo + 1)</code> 是 [lo, hi] 里的随机下标：</p>
<pre><code>swap(&amp;A[lo], &amp;A[lo + rand() % (hi - lo + 1)]);</code></pre>
<div class="callout warn" data-label="易错">
<p>换策略只是换了“哪些输入最坏”，<strong>最坏仍是 Θ(n²)</strong>。键全部相等时选哪个都一样，每次只放好一个；三数取中也有专门构造的输入能让它退化。</p>
</div>

<h2>快速排序的几个性质</h2>
<h3>不稳定</h3>
<p>稳定（stable）指相等的键排完后保持原来的先后顺序（见 5.1）。分区会远距离交换，可能越过相等的元素，所以<strong>快速排序不稳定（unstable）</strong>。</p>
<p>反例 [3, 2₁, 2₂]：i 越过 2₁、2₂（都小于 3），j 停在 2₂；pivot 3 和 2₂ 交换，得到 [2₂, 2₁, 3]。下一层 [2₂, 2₁] 的 pivot 2₂ 原地不动。最后 2₂ 在 2₁ 前面，顺序反了。</p>

<h3>额外空间：递归栈</h3>
<p>快速排序不开新数组，额外空间来自递归。调用栈（call stack）像一摞书：每调用一次 <code>quicksort</code> 就放上一本（lo、hi、p 和返回地址，O(1)），返回时拿走。书最多叠几本就是递归深度，约等于层数。</p>
<ul>
<li>最好 / 平均：深度 O(log n)，<strong>额外空间 O(log n)</strong>。这是课上投票题的答案，2016 年期末也考过。</li>
<li>最坏：已排序输入、首元素 pivot，嵌套 n − 1 层，<strong>O(n)</strong>。</li>
</ul>
<p><strong>是否原地（in-place）</strong>：按“额外空间严格 O(1)”（见 5.1）不是；不算栈就是。课上两种都接受，要写明按哪个定义。</p>

<h3>对输入敏感，实践中通常最快</h3>
<p>运行时间取决于输入的排列，所以<strong>对输入敏感（adaptive / input-sensitive）</strong>。方向和插入排序相反：已排序输入让插入排序最快，却让首元素 pivot 的快速排序最慢。</p>
<p>归并排序最坏也是 Θ(n log n)，实际却通常更慢：归并要复制进新数组再合并回来，分区只在原数组里顺序扫描、交换，常数小、对缓存友好。C 的 <code>qsort</code> 名字来自 quicksort，但标准不规定算法，也不保证稳定。</p>

<h2>考试怎么考</h2>
<p>常见形式：多选判断复杂度和性质；填时间和额外空间；写递推式（主定理在公式表上，只能解最好情况，最坏要展开）；给一个输入手算每层的 pivot 和层数。</p>

<h3>例题 1（多选）</h3>
<p>哪些正确？(A) 最坏情况只在输入已排好时出现。(B) 用三数取中后，最坏情况是 Θ(n log n)。(C) 平均需要 O(log n) 的额外空间。(D) 问“时间复杂度的最接近上界”，应答 O(n²)。(E) 快速排序是稳定的。(F) 最好和最坏情况的复杂度不同，所以它对输入敏感。</p>
<p>答案 <strong>C、D、F</strong>。A 错：逆序、全部相等也是 n − 1 层。B 错：键全部相等时仍是 Θ(n²)。C 对：栈深度平均 O(log n)。D 对：没说哪种情况就按最坏答，问平均才答 O(n log n)。E 错：反例 [3, 2₁, 2₂]。F 对。</p>

<h3>例题 2（手算）</h3>
<p>输入 [7, 6, 5, 4, 3, 2, 1]，pivot 取首元素，按课上的分区，写出每层的 pivot 和结果。</p>
<table>
<thead><tr><th>层</th><th>子数组</th><th>pivot</th><th>分区后</th></tr></thead>
<tbody>
<tr><td>1</td><td>[7, 6, 5, 4, 3, 2, 1]</td><td>7（最大）</td><td>[1, 6, 5, 4, 3, 2] | 7</td></tr>
<tr><td>2</td><td>[1, 6, 5, 4, 3, 2]</td><td>1（最小）</td><td>1 | [6, 5, 4, 3, 2]</td></tr>
<tr><td>3</td><td>[6, 5, 4, 3, 2]</td><td>6（最大）</td><td>[2, 5, 4, 3] | 6</td></tr>
<tr><td>4</td><td>[2, 5, 4, 3]</td><td>2（最小）</td><td>2 | [5, 4, 3]</td></tr>
<tr><td>5</td><td>[5, 4, 3]</td><td>5（最大）</td><td>[3, 4] | 5</td></tr>
<tr><td>6</td><td>[3, 4]</td><td>3（最小）</td><td>3 | [4]</td></tr>
</tbody>
</table>
<p>第 1 层 pivot 7 最大，i 越过其余元素和 j 交叉，pivot 和末尾的 1 交换。换到最前的 1 正好是剩下的最小值，第 2 层 pivot 原地不动。之后最大、最小交替，每层只少一个，共 <strong>6 = n − 1 层</strong>，T(n) = T(n−1) + cn，<strong>Θ(n²)</strong>。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>“最坏 Θ(n²)，所以比归并排序慢”：错，平均和实践中快速排序更快。</li>
<li>额外空间：课上答 O(log n)（递归栈）；旧参考答案有的不算栈写 O(1)，作答时附一句理由。</li>
<li>构造“每层都选中中位数”的输入时照 BST 前序写成 [4, 2, 1, 3, 6, 5, 7]：分区后左边变成 [3, 2, 1]，pivot 3 是最大值。正确的是 [4, 1, 3, 2, 6, 5, 7]，2 层。</li>
<li>T(n) = T(n/4) + T(3n/4) + cn 不能直接用主定理，但仍是 Θ(n log n)。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>总代价 = 每层 O(n) × 层数，层数由 pivot 决定。</li>
<li>最好（pivot 是中位数）T(n) = 2T(n/2) + cn，<strong>Θ(n log n)</strong>；平均也是 Θ(n log n)。</li>
<li>最坏（pivot 每次在一端：首元素 pivot 遇上已排序、逆序、全部相等）T(n) = T(n−1) + cn，<strong>Θ(n²)</strong>。</li>
<li>三数取中把有序输入对半分，但最坏仍是 Θ(n²)。</li>
<li>不稳定；额外空间平均 <strong>O(log n)</strong>、最坏 O(n)；原地看定义；对输入敏感；实践中通常最快。</li>
</ul>
`;
