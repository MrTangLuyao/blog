/* Post body — dsa-array-dictionary / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-array-dictionary:zh'] = `
<p class="lead">字典存进数组有两种放法：随手放，查找只能从头一个个比（线性查找，O(n)）；按键排好序，每比一次就丢掉一半（二分查找，O(log n)），代价是插入要挪动元素。</p>

<h2>从一个场景说起</h2>
<p>老师收上来一摞试卷，要找 Chen 的那份。</p>
<p>试卷要是随手叠的，只能一张张翻。运气差的话，翻到最后一张才找到，或者翻完才知道 Chen 没交。</p>
<p>要是按姓名字母排好了，就抽出正中间那张：写着 Li，Chen 在 Li 前面，后半摞不用看了。再从前半摞的中间抽一张……每看一张，剩下的少一半。</p>
<p>排好序也有代价：迟到的同学交来 Ma 的试卷，你得找到它的位置，把后面的试卷都往后挪，才塞得进去。</p>

<h2>它是什么：数组的两种放法</h2>
<p>字典按键（key）存取记录，核心操作是 find、insert、delete（见 2.1）。用数组存有两种放法：</p>
<ul>
<li><strong>无序数组（unsorted array）</strong>：按到达顺序放。查找用<strong>线性查找（linear search）</strong>：从下标 0 开始逐个比，直到找到或比完。</li>
<li><strong>有序数组（sorted array）</strong>：始终按键从小到大排好。查找用<strong>二分查找（binary search）</strong>。</li>
</ul>
<p>简单说，二分查找就是“每次看中间那个，丢掉一半”。它有三个部分：</p>
<ul>
<li><strong>候选范围</strong>：目标可能在的那一段，两端下标叫 lo、hi。一开始是整个数组，就是整摞试卷。</li>
<li><strong>中间元素 A[mid]</strong>：抽出的正中间那张。</li>
<li><strong>比较</strong>：相等就找到；目标更小只留左半，更大只留右半；范围变空，说明不在。</li>
</ul>
<p>它有两个前提：</p>
<ul>
<li><strong>数组有序</strong>：比一次才知道目标在哪一半。</li>
<li><strong>O(1) 随机访问（random access）</strong>：给出下标就能直接取到 A[mid]（见 2.2）。链表要从头走才到得了中间，所以<strong>有序链表也不能二分</strong>（见 2.5）。</li>
</ul>

<h2>看个例子：9 个单词</h2>
<p>课上的例子：每个键是一个单词，代表背后一整条记录。</p>

<h3>无序数组：线性查找</h3>
<pre><code class="lang-text">下标  0     1     2    3    4    5    6    7    8
A     goat  boat  dog  fly  cat  hat  ant  pig  lamp</code></pre>
<p>查 dog：goat、boat 都不是，第 3 次比到 dog。查 cow：9 个全比完都不等，才能确定不在。</p>
<p>所以线性查找<strong>最好 1 次</strong>（目标在第一个），<strong>最坏 n 次</strong>（目标在最后或不在），平均约 n/2 次（见 1.7）。<strong>find 是 O(n)</strong>。</p>
<p>插入和删除看位置（假设容量够用，不够见 2.6）：</p>
<ul>
<li><strong>插在末尾 O(1)</strong>：<code>A[n] = key; n++;</code>（不检查重复键）。</li>
<li><strong>插在开头 O(n)</strong>：A[0] 前面没有空位，n 个元素都要后移一格。</li>
<li><strong>删除 A[0] 是 O(n)</strong>：后面 n − 1 个都要前移补位。删最后一个只要 <code>n--</code>。</li>
</ul>

<h3>有序数组：二分查找</h3>
<pre><code class="lang-text">下标  0    1     2    3    4    5     6    7     8
A     ant  boat  cat  dog  fly  goat  hat  lamp  pig</code></pre>
<p>查 dog，每次看候选范围正中间的元素：</p>
<table>
<thead><tr><th>步</th><th>范围</th><th>个数</th><th>mid</th><th>A[mid]</th><th>比较</th><th>结果</th></tr></thead>
<tbody>
<tr><td>1</td><td>[0, 8]</td><td>9</td><td>4</td><td>fly</td><td>dog &lt; fly</td><td>只留 [0, 3]</td></tr>
<tr><td>2</td><td>[0, 3]</td><td>4</td><td>2</td><td>cat</td><td>dog &gt; cat</td><td>只留 [3, 3]</td></tr>
<tr><td>3</td><td>[3, 3]</td><td>1</td><td>3</td><td>dog</td><td>相等</td><td>找到，共 3 次</td></tr>
</tbody>
</table>
<ul>
<li>第 2 步剩 4 个，没有正中间。<strong>课上的规则是偶数个时取靠右的（向上取整）</strong>，所以取 cat（下标 2），不是 boat（下标 1）。</li>
<li>第 3 步只剩一个，<strong>也要再比一次</strong>，因为目标可能不在。查 cow 前两步一样，第 3 步 cow &lt; dog，范围变空，比 3 次后确定不在。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-array-dictionary/anims/binary-search.html" loading="lazy" style="height: 450px;" title="二分查找步进"></iframe>
<p class="anim-caption">下拉框选目标（下面一组不在数组里），可切换偶数个时的取整方向，再按播放或下一步：看 lo、hi 怎样收拢，比较次数怎样累加。</p>

<h2>为什么是 O(log n)</h2>
<p>每比一次没找到，范围至少减半：9 个之后最多剩 4、2、1 个。反过来，比 k 次能对付约 2<sup>k</sup> 个元素，令 2<sup>k</sup> = n，得 k = log₂ n。准确地说，<strong>最坏比较 ⌊log₂ n⌋ + 1 次</strong>：n = 10⁶ 时只要 20 次，线性查找最坏要 10⁶ 次。递推式 T(n) = T(n/2) + c 的解法见 1.8。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/fDKIpRe8GW4" title="Binary search in 4 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Binary search in 4 minutes》（英文，约 4 分钟），用动画演示二分查找。视频取中间的规则可能和课上不同，考试按题目给的规则，没给就按课上的“偶数个取靠右”。</p>

<h2>C 代码：迭代版二分查找</h2>
<pre><code>/* find key in sorted A[0..n-1]; return its index, or -1 */
int binary_search(const int A[], int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo &lt;= hi) {
        int mid = lo + (hi - lo + 1) / 2;   /* even count: right middle */
        if (key == A[mid]) {
            return mid;
        } else if (key &lt; A[mid]) {
            hi = mid - 1;                   /* drop A[mid..hi] */
        } else {
            lo = mid + 1;                   /* drop A[lo..mid] */
        }
    }
    return -1;                              /* range is empty: absent */
}</code></pre>
<ul>
<li><strong>第 3 行</strong>：候选范围一开始是整个数组。</li>
<li><strong>第 4 行</strong>：<code>lo &lt;= hi</code> 表示范围里至少还有一个元素。写成 <code>lo &lt; hi</code> 会漏掉只剩一个时的那次比较。</li>
<li><strong>第 5 行</strong>：向上取整，和课上一致。多数教材写 <code>lo + (hi - lo) / 2</code>（向下取整），也对、复杂度一样，但比较顺序不同：查 dog 会依次比 fly、boat、cat、dog，要 4 次。不写 <code>(lo + hi) / 2</code>，是怕 lo + hi 超出 int 范围。</li>
<li><strong>第 6–12 行</strong>：三种结果。±1 不能省，A[mid] 已经比过，要一起丢掉。写成 <code>hi = mid</code> 会死循环：范围 [0, 1] 时 mid = 1，若 key &lt; A[1]，hi 还是 1。</li>
<li><strong>第 14 行</strong>：范围空了，返回 −1。键是字符串时，改用 <code>strcmp(key, A[mid])</code> 的结果和 0 比。</li>
</ul>
<p>为什么范围空了就能断定不在？靠一条<strong>循环不变式（loop invariant）</strong>：<strong>如果 key 在数组里，它一定在 A[lo..hi] 中</strong>。开始时成立；key &lt; A[mid] 时 A[mid..hi] 全比 key 大，丢掉它们不会丢掉 key，另一边同理。所以范围变空，key 就不在。</p>
<p>顺带一个结果：<strong>查不到时循环停在 lo = hi + 1，lo 正好是该插入的位置</strong>。查 cow 结束时 lo = 3，正是 cat 和 dog 之间。</p>

<h2>往有序数组插入：挪位置才是大头</h2>
<p>把 cow 插进有序数组，分三步：</p>
<ol>
<li><strong>二分找位置</strong>：比 fly、cat、dog 共 3 次，结束时 lo = 3。</li>
<li><strong>移位（shift）</strong>：A[3..8] 共 6 个元素各后移一格。</li>
<li><strong>写入</strong>：A[3] = cow，n 加 1。</li>
</ol>
<p>找位置 O(log n)，<strong>移位最坏 O(n)</strong>，一次插入就是 <strong>O(n)</strong>。删除同理，二分找到后把后面的前移，也是 O(n)。移位那几行：</p>
<pre><code>/* lo = slot from binary search; capacity &gt; n */
for (int i = n; i &gt; lo; i--) {   /* back to front */
    A[i] = A[i - 1];
}
A[lo] = key;
n++;</code></pre>
<p>i 从 n 往下数：先把 A[n − 1] 搬到 A[n]，再搬 A[n − 2]……最后把 A[lo] 搬到 A[lo + 1]，A[lo] 空出来，写入新键，个数加 1。</p>
<div class="callout warn" data-label="易错">
<p>后移必须<strong>从后往前</strong>。从前往后写 <code>A[i + 1] = A[i]</code>，A[lo] 会被一路复制：在 {1, 2, 3} 的下标 0 处腾位，得到 {1, 1, 1, 1}。删除时前移，反过来要从前往后。</p>
</div>

<h3>逐个插入建立：O(n²)</h3>
<p>build 就是从空数组开始做 n 次 insert。最坏是<strong>键从大到小到达</strong>：每个新键都最小，已有的全部后移，总移位 0 + 1 + … + (n − 1) = n(n − 1)/2。</p>
<p>所以<strong>逐个插入建立有序数组最坏 O(n²)，不是 O(n log n)</strong>。O(n log n) 只算了 n 次二分，漏了移位。键从小到大到达时不用挪，是 Θ(n log n)。</p>
<table>
<thead><tr><th>操作</th><th>无序数组</th><th>有序数组</th></tr></thead>
<tbody>
<tr><td>find</td><td>最好 Θ(1)，最坏 Θ(n)</td><td>最好 Θ(1)，最坏 Θ(log n)</td></tr>
<tr><td>insert</td><td>Θ(1)（追加到末尾）</td><td>最好 Θ(log n)，最坏 Θ(n)</td></tr>
<tr><td>delete（按键）</td><td>Θ(n)（先 find 再移位）</td><td>最好 Θ(log n)，最坏 Θ(n)</td></tr>
<tr><td>build（n 次 insert）</td><td>Θ(n)</td><td>最好 Θ(n log n)，最坏 Θ(n²)</td></tr>
</tbody>
</table>

<h2>要不要排序：n 次插入 + m 次查找</h2>
<p>课上的问题：先插入 n 个键，再查 m 次，用哪种数组？两段相加：</p>
<table>
<thead><tr><th></th><th>建立</th><th>m 次查找</th><th>合计</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>O(n)</td><td>m × O(n)</td><td><strong>O(mn)</strong></td></tr>
<tr><td>有序数组</td><td>O(n²)</td><td>m × O(log n)</td><td><strong>O(n² + m log n)</strong></td></tr>
</tbody>
</table>
<p>n 和 m 都是输入，哪个都不能丢。取 n = 1000（log₂ n ≈ 10）粗算：m = 10 时，无序约 10⁴，有序约 10⁶，<strong>不排序</strong>；m = 10⁵ 时，无序约 10⁸，有序约 2 × 10⁶，<strong>排序划算</strong>。令两式相等，得分界点 m = n²/(n − log n) ≈ 1010，也就是 m ≈ n。结论：<strong>m 明显大于 n 才值得排序</strong>。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>：写出二分查找每步的 lo、hi、mid 或被比较的元素，数比较次数。目标常故意不在，或出现偶数个。</li>
<li><strong>写 C</strong>：二分查找、有序数组插入或删除。自查 <code>lo &lt;= hi</code>、<code>mid ± 1</code>、移位方向、n 的更新。</li>
<li><strong>复杂度</strong>：上面两张表。</li>
</ul>
<p>⌊log₂ n⌋ + 1、两个前提、build 的 O(n²) 都要自己记，公式表上只有等差数列求和。</p>

<h3>例题 1：手算二分查找</h3>
<p>有序数组 A[0..11] = 4, 9, 13, 18, 22, 27, 31, 36, 40, 45, 51, 58，按课上的规则二分查找。(a) 查 40 依次比较哪些元素？(b) 查 20 呢？结束时 lo、hi 各是多少？</p>
<pre><code class="lang-text">(a) [0,11] 12 个  mid=6  A[6]=31  40 &gt; 31  lo=7
    [7,11]  5 个  mid=9  A[9]=45  40 &lt; 45  hi=8
    [7,8]   2 个  mid=8  A[8]=40  找到
(b) [0,11] 12 个  mid=6  A[6]=31  20 &lt; 31  hi=5
    [0,5]   6 个  mid=3  A[3]=18  20 &gt; 18  lo=4
    [4,5]   2 个  mid=5  A[5]=27  20 &lt; 27  hi=4
    [4,4]   1 个  mid=4  A[4]=22  20 &lt; 22  hi=3   lo=4 &gt; hi=3，不在</code></pre>
<p>每步 mid = lo + (hi − lo + 1)/2。(a) 比较 31、45、40，共 3 次；第一步 12 个是偶数，取靠右的下标 6，不是下标 5。(b) 比较 31、18、27、22，共 4 次，正是 n = 12 的最坏值 ⌊log₂ 12⌋ + 1 = 4。结束时 <strong>lo = 4、hi = 3</strong>，lo = 4 就是 20 的插入位置。</p>

<h3>例题 2：要不要排序</h3>
<p>先逐个插入 n = 10⁴ 条记录，之后 (a) 只查 100 次；(b) 查 10⁶ 次。各用哪种数组？有人说“有序数组每次插入只要二分 O(log n)，所以建立是 O(n log n)”，错在哪？</p>
<p>log₂ 10⁴ ≈ 13.3。(a) 无序 mn = 10⁶；有序 ≈ 10⁸ + 1330 ≈ 10⁸，<strong>用无序数组</strong>。(b) 无序 mn = 10¹⁰；有序 ≈ 10⁸ + 1.33 × 10⁷ ≈ 1.1 × 10⁸，<strong>用有序数组</strong>，约快 90 倍。</p>
<p>那句话漏了移位：二分只找到位置，后面的元素还要全部后移，最坏 O(n)。降序到达时总移位 n(n − 1)/2，建立是 O(n²)。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>build 答成 O(n log n)。</li>
<li>以为有序链表也能二分。</li>
<li>说“二分查找是 Θ(log n)”：最好情况是 Θ(1)，要说<strong>最坏</strong> Θ(log n)。</li>
<li>循环条件写成 <code>lo &lt; hi</code>：在 {10, 20, …, 70} 里查 10、30、50、70 都返回 −1，它们都要到只剩一个时才比中。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>无序数组：线性查找 O(n)；末尾插入 O(1)，开头插入、删除要移位，O(n)。</li>
<li>有序数组：二分查找最坏比较 ⌊log₂ n⌋ + 1 次，O(log n)；前提是有序 + 随机访问。</li>
<li>课上规则：偶数个取靠右的中间；只剩一个也要再比一次。</li>
<li>有序数组 insert、delete 是 O(n)，慢在移位；逐个插入建立最坏 O(n²)。</li>
<li>n 次插入 + m 次查找：O(mn) 对 O(n² + m log n)，m 明显大于 n 才排序。</li>
</ul>
`;
