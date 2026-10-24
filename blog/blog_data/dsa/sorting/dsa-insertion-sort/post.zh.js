/* Post body — dsa-insertion-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-insertion-sort:zh'] = `
<p class="lead">插入排序（insertion sort）就是整理手牌的办法：左边一段始终排好，每次拿起下一个元素，把比它大的往右挪，再把它放进空出来的位置。</p>

<h2>从一个场景说起</h2>
<p>打扑克时，牌是一张一张摸进手里的。假设手里已经排好 2、5、9，现在摸到一张 7。</p>
<p>你不会把整手牌打散重排，而是从右往左看：9 比 7 大，往右挪一格；再看 5，不比 7 大，停。7 插进空出来的位置，手里变成 2、5、7、9。</p>
<p>每摸一张，都是往一手排好的牌里插一张。最后一张插完，整手牌就排好了。</p>

<h2>它是什么</h2>
<p>简单说，插入排序从左到右把元素一个个“摸进手里”，每摸一个，就把它插进前面已排好的那段里。数组始终分成两段：</p>
<ul>
<li><strong>有序前缀（sorted prefix）</strong>：最左边已排好的一段，就是手里的牌。一开始只有 A[0]，一个元素自然有序。</li>
<li><strong>未排序部分</strong>：右边还没摸的牌。</li>
</ul>
<p>第 i 轮（i = 1, 2, …, n − 1）分三步：</p>
<ol>
<li><strong>取出</strong>：把 A[i] 存进临时变量 <code>val</code>，下标 i 空出来。这就是新摸的牌。</li>
<li><strong>右移（shift）</strong>：从空位左边开始往左看，只要 <strong>A[j] &gt; val</strong>，就把 A[j] 右移一格，空位跟着左移一格。</li>
<li><strong>放入</strong>：遇到 A[j] ≤ val，或者已经到了最前面，就停下，把 val 放进空位。</li>
</ol>
<p>每轮有序前缀长一格，n − 1 轮后整个数组有序。</p>
<p>课上口头说的是“和前面的元素交换，直到前面的不比它大”。结果和比较次数都一样，但代码里用 val 加右移更省：右移一格 1 次赋值，交换要 3 次。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/JU767SDMDvA" title="Insertion sort in 2 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Insertion sort in 2 minutes》（英文），两分钟演示一遍插入排序的过程，可以和下面的动画对照着看。</p>

<h2>看个例子：[2, 0, 9, 7, 1, 5, 2]</h2>
<p>这是课上的数组。里面有两个 2，记作 2₁、2₂，最后好看它们谁在前。竖线 <code>|</code> 左边是有序前缀。</p>
<ul>
<li><strong>第 1 轮</strong>，val = 0。左边的 2₁ 比 0 大，右移；已经到最前面了，0 放进 A[0]，得到 0 2₁ | 9 7 1 5 2₂。</li>
<li><strong>第 2 轮</strong>，val = 9。左边的 2₁ 不比 9 大，第一次比较就停，9 原地不动。</li>
<li><strong>第 3 轮</strong>，val = 7。9 比 7 大，右移；2₁ 不大，停，7 落在 2₁ 后面：0 2₁ 7 9 | 1 5 2₂。</li>
</ul>
<p>后面几轮同理。六轮全部列在下表，“比较对象”是按顺序和 val 比过的元素：</p>
<table>
<thead><tr><th>轮 i</th><th>val</th><th>比较对象</th><th>比较</th><th>移位</th><th>本轮结束后</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>2₁（右移），到最前面</td><td>1</td><td>1</td><td>0 2₁ | 9 7 1 5 2₂</td></tr>
<tr><td>2</td><td>9</td><td>2₁（停）</td><td>1</td><td>0</td><td>0 2₁ 9 | 7 1 5 2₂</td></tr>
<tr><td>3</td><td>7</td><td>9（右移）、2₁（停）</td><td>2</td><td>1</td><td>0 2₁ 7 9 | 1 5 2₂</td></tr>
<tr><td>4</td><td>1</td><td>9、7、2₁（右移）、0（停）</td><td>4</td><td>3</td><td>0 1 2₁ 7 9 | 5 2₂</td></tr>
<tr><td>5</td><td>5</td><td>9、7（右移）、2₁（停）</td><td>3</td><td>2</td><td>0 1 2₁ 5 7 9 | 2₂</td></tr>
<tr><td>6</td><td>2₂</td><td>9、7、5（右移）、2₁（相等，停）</td><td>4</td><td>3</td><td>0 1 2₁ 2₂ 5 7 9</td></tr>
</tbody>
</table>
<p>最后一轮 2₂ 往左走，碰到相等的 2₁ 就停了，所以 2₂ 仍在 2₁ 后面。合计比较 15 次、移位 10 次。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-insertion-sort/anims/insertion.html" loading="lazy" style="height: 440px;" title="插入排序步进"></iframe>
<p class="anim-caption">选一组输入，按播放或下一步：val 浮在空位上方，比它大的元素一格格右移，空位移到停止处 val 再落下。切换“已排序”“逆序”“几乎有序”，对比比较和移位计数差多少。</p>

<p>表里有两条规律，手算时用得上：</p>
<ul>
<li><strong>每轮比较次数 = 移位次数 + 1。</strong>多出的那次是让循环停下的比较。val 一路移到最前面的那轮（第 1 轮）例外：循环因走到头而停，比较 = 移位。</li>
<li><strong>有序前缀只是“彼此有序”，不是最终位置。</strong>第 3 轮后前缀是 0 2₁ 7 9，之后 2₁、7、9 还要往右挪。选择排序（见 5.2）每轮定下的才是最终位置，判断题爱考这点。</li>
</ul>

<h2>代码</h2>
<p>考试可能要你写出来。核心只有几行：</p>
<pre><code>/* sort A[0..n-1] into non-decreasing order */
void insertion_sort(int A[], int n) {
    int i, j, val;
    for (i = 1; i &lt; n; i++) {
        val = A[i];                        /* lift out the next element */
        for (j = i - 1; j &gt;= 0 &amp;&amp; A[j] &gt; val; j--) {
            A[j + 1] = A[j];               /* shift a larger key right */
        }
        A[j + 1] = val;                    /* drop it into the gap */
    }
}</code></pre>
<p>逐行看：</p>
<ul>
<li><code>for (i = 1; …)</code>：从 1 开始，因为 A[0] 自己就是有序前缀。</li>
<li><code>val = A[i]</code>：先存起来，等会儿右移会把 A[i] 盖掉。</li>
<li>内层 <code>for</code> 的条件：<strong><code>j &gt;= 0</code> 必须写在 <code>&amp;&amp;</code> 左边</strong>。<code>&amp;&amp;</code> 左边为假就不再算右边（短路求值），所以 j = −1 时不会去读 A[−1]。</li>
<li><code>A[j + 1] = A[j]</code>：把比 val 大的元素右移一格，空位从 j + 1 移到 j。</li>
<li>内层循环结束时，j 停在第一个不大于 val 的元素上（或者 −1），<strong>空位是 j + 1</strong>，不是 j，所以最后写 <code>A[j + 1] = val</code>。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>比较要用严格的 <code>&gt;</code>。写成 <code>&gt;=</code> 结果仍然有序，但 val 会越过相等的元素：上例第 6 轮 2₂ 会跑到 2₁ 前面，<strong>排序变得不稳定</strong>。输入是 n 个相等元素时，比较次数还会从 n − 1 次变成 n(n − 1)/2 次。</p>
</div>

<h2>复杂度</h2>
<h3>插入一个元素要多久</h3>
<p>课上的例子：有序前缀是 0 2 7 9，后面来了一个未知的 ?。前缀长度记为 i（这里 i = 4）。</p>
<ul>
<li><strong>最好</strong>：? 比 9 大（10、20、100 都行），比较 1 次就停，不用移。</li>
<li><strong>最坏</strong>：? 比所有元素都小，前缀里 i 个元素全部右移，比较 i 次。</li>
<li><strong>平均</strong>：? 落在 i + 1 个位置中的哪个都同样可能，平均要挪约 i/2 个。</li>
</ul>
<h3>整个排序</h3>
<p>把每轮加起来。输入已排序，每轮都是最好情况；输入严格逆序，每轮都是最坏情况：</p>
<table>
<thead><tr><th>情况</th><th>输入</th><th>比较总数</th><th>移位总数</th><th>时间</th></tr></thead>
<tbody>
<tr><td>最好</td><td>已排序</td><td>n − 1</td><td>0</td><td><strong>Θ(n)</strong></td></tr>
<tr><td>最坏</td><td>严格逆序</td><td>1 + 2 + … + (n − 1) = n(n − 1)/2</td><td>n(n − 1)/2</td><td><strong>Θ(n²)</strong></td></tr>
<tr><td>平均</td><td>随机顺序</td><td>约 n²/4</td><td>约 n²/4</td><td><strong>Θ(n²)</strong></td></tr>
</tbody>
</table>
<p>例如 n = 7：已排序的 [1, 2, …, 7] 比较 6 次、移位 0 次；逆序的 [7, 6, …, 1] 比较、移位各 21 次。平均约是最坏的一半，仍是 Θ(n²)。</p>
<p>写成递推式：最坏 T(n) = T(n − 1) + cn，得 Θ(n²)；最好 T(n) = T(n − 1) + c，得 Θ(n)（见 1.8）。所以“插入排序是 O(n²)”对，不分情况说“插入排序是 Θ(n²)”错（见 1.7）。额外空间只有 i、j、val，<strong>O(1)</strong>。</p>

<h2>二分查找救不了它</h2>
<p>前缀是有序的，那找插入位置时用二分查找（binary search）不就快了？</p>
<p>还是课上的例子，把 1 插进 0 2 7 9。二分查找两三次比较就知道 1 该放在下标 1，可 2、7、9 <strong>还是得各右移一格</strong>。找位置变快了，挪位置一点没少。</p>
<ul>
<li>比较次数降到每轮 O(log i)，总共 O(n log n)；</li>
<li><strong>移位次数不变，最坏仍是 n(n − 1)/2，时间仍是 Θ(n²)</strong>；</li>
<li>已排序输入反而更慢：原版每轮比 1 次就停，二分版每轮都要比约 log₂ i 次，最好情况从 Θ(n) 变成 Θ(n log n)。</li>
</ul>

<h2>三个性质</h2>
<ul>
<li><strong>稳定（stable）</strong>：val 只越过严格比它大的键，碰到相等的就停，相等键的先后顺序不变（上例 2₂ 停在 2₁ 后面）。</li>
<li><strong>原地（in-place）</strong>：额外空间 O(1)。</li>
<li><strong>自适应（adaptive）</strong>：同样 n 个元素，越接近有序越快。量化一下：前面的数比后面的大，这样一对叫一个逆序（inversion），每次右移恰好消掉一个，所以<strong>移位总数 = 逆序数</strong>。课上数组有 10 个逆序，正好移位 10 次。</li>
</ul>
<p>所以插入排序适合<strong>规模小</strong>或<strong>几乎有序</strong>的输入：常数开销小，没有递归。快速排序、归并排序把子数组切到阈值以下（常取 10～30）时改用插入排序收尾，这叫混合排序（hybrid sort），见 5.9。随机顺序的大数组上 Θ(n²) 就太慢了。</p>

<h2>考试怎么考</h2>
<p>常见题型有三种：</p>
<ul>
<li><strong>手算</strong>：给一个数组，写出每轮之后的数组，或者数比较、移位次数。用“比较 = 移位 + 1（移到最前面的那轮除外）”自查。</li>
<li><strong>选择 / 判断</strong>：最好、最坏是什么输入；稳定、原地、自适应是不是；二分查找能不能改善。等差数列求和在公式表上，但“已排序 → n − 1 次比较，逆序 → n(n − 1)/2 次”要自己记。</li>
<li><strong>写 C</strong>：val 加右移的版本，检查三处：<code>j &gt;= 0</code> 在前、比较用 <code>&gt;</code>、循环结束后写 <code>A[j + 1] = val</code>。</li>
</ul>

<h3>例题 1：手算</h3>
<p>用上面的代码对 [6, 3₁, 8, 3₂, 1, 7] 排序，写出每轮结束后的数组和比较、移位次数。最后 3₁、3₂ 谁在前？</p>
<table>
<thead><tr><th>轮 i</th><th>val</th><th>比较对象</th><th>比较</th><th>移位</th><th>本轮结束后</th></tr></thead>
<tbody>
<tr><td>1</td><td>3₁</td><td>6（右移），到最前面</td><td>1</td><td>1</td><td>3₁ 6 | 8 3₂ 1 7</td></tr>
<tr><td>2</td><td>8</td><td>6（停）</td><td>1</td><td>0</td><td>3₁ 6 8 | 3₂ 1 7</td></tr>
<tr><td>3</td><td>3₂</td><td>8、6（右移）、3₁（相等，停）</td><td>3</td><td>2</td><td>3₁ 3₂ 6 8 | 1 7</td></tr>
<tr><td>4</td><td>1</td><td>8、6、3₂、3₁（右移），到最前面</td><td>4</td><td>4</td><td>1 3₁ 3₂ 6 8 | 7</td></tr>
<tr><td>5</td><td>7</td><td>8（右移）、6（停）</td><td>2</td><td>1</td><td>1 3₁ 3₂ 6 7 8</td></tr>
</tbody>
</table>
<p>合计比较 11 次、移位 8 次。自查：第 1、4 轮移到最前面，比较 = 移位；其余三轮比较 = 移位 + 1，所以 11 = 8 + 3。</p>
<p><strong>3₁ 在前</strong>：第 3 轮 3₂ 碰到相等的 3₁ 就停了；第 4 轮 1 越过它们时，两者一起右移，相对顺序不变。</p>

<h3>例题 2：多选</h3>
<p>在有序前缀上用二分查找确定插入位置，然后照常右移、放入。哪些正确？(A) 最坏情况下比较总次数为 O(n log n)；(B) 最坏情况时间变为 Θ(n log n)；(C) 最坏情况时间仍为 Θ(n²)；(D) 已排序输入仍是 Θ(n)；(E) 仍是原地排序。</p>
<p><strong>答案：A、C、E。</strong></p>
<ul>
<li>A 对：第 i 轮二分查找约 log₂ i 次比较，每轮不超过 ⌈log₂ n⌉ 次，合计 O(n log n)。</li>
<li>B 错、C 对：逆序输入每轮仍要把整个前缀右移，移位总数 n(n − 1)/2，Θ(n²)。</li>
<li>D 错：虽然不用移位，但每轮都要做一次完整的二分查找，合计约 log₂ 1 + log₂ 2 + … + log₂(n − 1)，是 Θ(n log n)。</li>
<li>E 对：只多了 lo、hi、mid 几个变量，还是 O(1)。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>最常见的坑：以为第 k 轮后前 k + 1 个元素已在最终位置（那是选择排序）；<code>&gt;</code> 写成 <code>&gt;=</code>；不分情况说“插入排序是 Θ(n²)”；以为二分查找能把时间降到 O(n log n)。</p>
</div>

<h2>小结</h2>
<ul>
<li>做法：A[i] 存进 val，前缀里比它大的逐个右移，遇到 ≤ val 或到头就停，val 放进 A[j + 1]。</li>
<li>最好：已排序，n − 1 次比较，Θ(n)。最坏：严格逆序，比较、移位各 n(n − 1)/2 次，Θ(n²)。平均 Θ(n²)。</li>
<li>每轮比较 = 移位 + 1（移到最前面的那轮两者相等）；有序前缀不是最终位置。</li>
<li>二分查找只省比较、不省移位，时间仍是 Θ(n²)。</li>
<li>稳定（比较用 <code>&gt;</code>）、原地 O(1)、自适应；适合小规模或几乎有序的输入，混合排序拿它收尾。</li>
</ul>
`;
