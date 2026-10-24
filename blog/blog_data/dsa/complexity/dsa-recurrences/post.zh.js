/* Post body — dsa-recurrences / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-recurrences:zh'] = `
<p class="lead">递归函数的运行时间没法直接数循环，要先写成<strong>递推式（recurrence relation）</strong>：T(n) = 更小规模的 T + 这一层自己的工作；再用<strong>展开法（telescoping）</strong>一层层代入，算出闭式，读出 Θ。</p>

<h2>从一个场景说起</h2>
<p>体育课上，老师要把 n 个同学按身高从矮到高排好。他的办法是：把所有人扫一遍，挑出最矮的，让他站到最前面；剩下的 n−1 个人，用同样的办法再排一次。</p>
<p>排 n 个人要多久？一下子说不出来。但有一句话肯定对：</p>
<p><strong>排 n 个人的时间 = 扫一遍 n 个人的时间 + 排 n−1 个人的时间。</strong></p>
<p>这句话没直接给答案，它用“小一号的同一个问题”来描述大问题。这就是递推式。</p>
<p>为什么需要它？两层循环可以直接数出 n²，递归函数却看不出一共调用多少次。递推式先把“这一层”和“剩下的”分开写，再一层层展开，把总数算出来。</p>

<h2>它是什么</h2>
<p>简单说，<strong>递推式就是用“更小规模的自己”来表示 T(n) 的等式</strong>。T(n) 是输入规模为 n 时执行的基本操作数，一次比较、一次赋值、一次算术都算一次。</p>
<p>一个递推式由三部分组成，正好对上排队：</p>
<ul>
<li><strong>递归部分</strong>：调用自己几次、每次规模多大。排队里是“排剩下的 n−1 人”，写成 T(n−1)。</li>
<li><strong>本层工作</strong>：除了递归调用，这一层自己要做的事。扫一遍 n 个人，写成 <strong>cn</strong>（c 是某个正常数）；常数次操作写成 c。不写 O(n)，它是一类函数，没法拿来加减。</li>
<li><strong>基本情况（base case）</strong>：最简单、不用再递归的情况。只剩 1 个人就不用排了，T(1) 是常数。课上 T(1) = 0 和 T(1) = 1 都接受，公式表写作 T(1) = c。</li>
</ul>
<p>合起来就是 <strong>T(n) = T(n−1) + cn</strong>。把排队写成代码，就是递归版的选择排序（selection sort）：</p>
<pre><code>void sel_sort_rec(int A[], int n) {
    if (n &lt;= 1) return;                     /* 基本情况 */
    int min = 0;
    for (int j = 1; j &lt; n; j++) {           /* 本层工作：约 cn */
        if (A[j] &lt; A[min]) min = j;
    }
    int tmp = A[0]; A[0] = A[min]; A[min] = tmp;
    sel_sort_rec(A + 1, n - 1);             /* 递归 1 次，规模 n-1 */
}</code></pre>
<ul>
<li>第 2 行：只剩 0 或 1 个元素，直接返回。这是基本情况，T(1) 是常数。</li>
<li>第 3–6 行：在 A[0..n−1] 里找最小值的下标，循环 n−1 次，算作 cn。</li>
<li>第 7 行：把最小值换到 A[0]，常数次操作，并进 cn。</li>
<li>第 8 行：<code>A + 1</code> 是从 A[1] 开始、长度 n−1 的那段数组。递归排它，就是 T(n−1)。</li>
</ul>
<p>有了递推式，怎么算出 T(n) 到底是多少？用<strong>展开法</strong>：把 T(n−1) 用递推式换掉，再把 T(n−2) 换掉……一直换到基本情况，最后得到一个不含 T 的式子，叫<strong>闭式（closed form）</strong>。telescoping 原意是望远镜：一节套一节，最后收拢成一小段，中间的项全消掉了。</p>

<h2>看个例子</h2>
<p>课上最常见的递推式有三个，各有一种标准展开写法。</p>

<h3>例 1：减一 T(n) = T(n−1) + cn</h3>
<p>先代数字找感觉。取 c = 1、T(1) = 0：T(2) = 0 + 2 = 2，T(3) = 2 + 3 = 5，T(4) = 5 + 4 = 9。也就是说 T(4) = 4 + 3 + 2，每一层贡献一个数，最后是一串数相加。</p>
<p>一般情况：把递推式对 n, n−1, …, 2 各写一行，每行只是把原式里的 n 换掉：</p>
<pre><code class="lang-text">T(n)   = T(n-1) + c·n
T(n-1) = T(n-2) + c·(n-1)
  ...
T(3)   = T(2)   + c·3
T(2)   = T(1)   + c·2
T(1)   = 0</code></pre>
<p>把所有行的左边加起来、右边加起来。T(n−1)、T(n−2)、…、T(1) 在左右两边各出现一次，全部消掉，只剩：</p>
<pre><code class="lang-text">T(n) = c·(n + (n-1) + ... + 3 + 2)
     = c·(n(n+1)/2 - 1)
     = c·(n+2)(n-1)/2   ∈ Θ(n²)</code></pre>
<p>第 2 行用的是公式表上的等差求和 1 + 2 + … + n = n(n+1)/2。这里的和从 2 开始，所以减去缺的那个 1。代回 n = 4、c = 1：6 × 3 / 2 = 9，和刚才一致。</p>
<p>最高次项是 (c/2)·n²，所以是 Θ(n²)。T(1) 取 1 只会多出常数 1：<strong>基本情况的取值不改变复杂度</strong>。</p>

<h3>例 2：减半 T(n) = T(n/2) + c</h3>
<p>这是二分查找（binary search）的最坏情况：和中间元素比较一次（常数 c），然后<strong>只进左半或者只进右半</strong>，规模变成 n/2。两个递归分支只会走一个，所以只有 1 个 T(n/2)。</p>
<p>先代数字：n = 16 时，搜索范围依次是 16、8、4、2、1，减半 4 次，每次花 c，所以 T(16) = T(1) + 4c，而 4 = log₂ 16。</p>
<p>一般情况用<strong>反复代入（substitution）</strong>：把 n 换成 n/2，得到 T(n/2) = T(n/4) + c，代回第一行；再换成 n/4，依此类推：</p>
<pre><code class="lang-text">T(n) = T(n/2) + c
     = [T(n/4) + c] + c    = T(n/4) + 2c
     = [T(n/8) + c] + 2c   = T(n/8) + 3c
     ...
     = T(n/2^i) + i·c              （第 i 步的通式）
令 2^i = n，即 i = log₂ n：
T(n) = T(1) + c·log₂ n  ∈ Θ(log n)</code></pre>
<p>“令 2<sup>i</sup> = n”就是一直代到子问题只剩 1 个元素、碰到基本情况为止，所有减半类题目都这样收尾。这里默认 n 是 2 的幂，每次都能整除；真实情况剩 ⌊n/2⌋ 个，结论不变。</p>

<h3>例 3：一分为二 T(n) = 2T(n/2) + cn</h3>
<p>归并排序（merge sort）把数组分成两半，两半<strong>都要</strong>递归排序（2T(n/2)），再用线性时间合并（cn）。和例 2 比，前面多了个 2。</p>
<p>展开时最容易错的一点：每一步都要<strong>把括号外的系数乘进去</strong>。</p>
<pre><code class="lang-text">T(n) = 2T(n/2) + cn
     = 2[2T(n/4) + c·n/2] + cn    = 4T(n/4) + 2cn
     = 4[2T(n/8) + c·n/4] + 2cn   = 8T(n/8) + 3cn
     ...
     = 2^i·T(n/2^i) + i·cn
令 2^i = n，即 i = log₂ n：
T(n) = n·T(1) + cn·log₂ n = n + cn·log₂ n    （T(1) = 1）
     ∈ Θ(n log n)</code></pre>
<p>逐行看：第 2 行把 T(n/2) 换成 2T(n/4) + c·n/2，外面的 2 乘进去得 4T(n/4) + cn，加上原来的 cn 就是 2cn。每展开一次多一个 cn，所以第 i 步是 i·cn。令 2<sup>i</sup> = n 后，2<sup>i</sup>·T(1) 就是 n·T(1)。</p>
<p>检验 n = 8、c = 1、T(1) = 1：T(2) = 2 × 1 + 2 = 4，T(4) = 2 × 4 + 4 = 12，T(8) = 2 × 12 + 8 = 32；闭式 8 + 8 × 3 = 32。</p>

<h3>换个角度：递归树</h3>
<p>把每次调用画成一个结点，标上它的本层工作，就得到<strong>递归树（recursion tree）</strong>。总代价是所有结点之和，按层加最方便：<strong>每层代价 × 层数</strong>。</p>
<ul>
<li>减一：每层 1 个结点，工作 cn、c(n−1)……共约 n 层，等差和，n² 级。</li>
<li>减半：每层 1 个结点，工作都是 c，共 log₂ n 层。</li>
<li>一分为二：第 k 层有 2<sup>k</sup> 个结点，每个 c·n/2<sup>k</sup>，<strong>每层合计正好 cn</strong>，共 log₂ n 层，再加底下 n 个叶子。</li>
</ul>
<iframe class="anim-frame" src="blog/blog_data/dsa-recurrences/anims/recursion-tree.html" loading="lazy" style="height: 520px;" title="递归树逐层求和"></iframe>
<p class="anim-caption">上方按钮切换三个递推式，按“下一步”逐层点亮：橙色是当前层，绿色是已计入总和的层，蓝色是叶子（基本情况）。右侧是每层合计；最后一帧用 c = 1 把逐层之和和直接按递推式算出的值对照。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/IawM82BQ4II" title="2.1.2 Recurrence Relation (T(n)= T(n-1) + n) #2" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《2.1.2 Recurrence Relation (T(n)= T(n-1) + n) #2》（英文）。从“循环 n 次再递归 n−1”的代码写出 T(n) = T(n−1) + n，先画递归树，再反复代入（back substitution）到基本情况，得到等差和，和例 1 是同一件事。视频里基本情况的取法和课上略有不同，只差常数。</p>

<h2>补充：算法和递推式对照</h2>
<table>
<thead><tr><th>算法</th><th>递推式</th><th>哪种情况</th><th>解</th></tr></thead>
<tbody>
<tr><td>选择排序</td><td>T(n−1) + cn</td><td>所有输入</td><td>Θ(n²)</td></tr>
<tr><td>插入排序</td><td>T(n−1) + cn</td><td>最坏、平均</td><td>Θ(n²)</td></tr>
<tr><td>二分查找</td><td>T(n/2) + c</td><td>最坏</td><td>Θ(log n)</td></tr>
<tr><td>归并排序</td><td>2T(n/2) + cn</td><td>所有输入</td><td>Θ(n log n)</td></tr>
<tr><td>快速排序</td><td>2T(n/2) + cn</td><td>最好</td><td>Θ(n log n)</td></tr>
<tr><td>快速排序</td><td>T(n−1) + cn</td><td>最坏</td><td>Θ(n²)</td></tr>
</tbody>
</table>
<p>快速排序（quicksort）用一次线性扫描的分区（partition）把数组按 pivot 分成两段，再递归排两段（详见第 5 部分）。两段多大由输入决定，所以一个式子只能描述一种情况：</p>
<ul>
<li>pivot 每次正好是中位数，两段各一半：2T(n/2) + cn，和归并排序一样，Θ(n log n)。</li>
<li>输入已经有序、总取第一个元素作 pivot：左边空、右边 n−1 个，T(n−1) + cn，和例 1 一样，Θ(n²)。</li>
</ul>
<p>归并排序的两半永远等长，所以三种情况都是同一个式子。</p>
<div class="callout warn" data-label="易错">
<p>本层工作是常数时，<strong>T(n) = T(n−1) + c 只有 Θ(n)</strong>：n−1 个 c 相加。插入排序的最好情况（输入已有序，每个新元素只比较 1 次）就是它。决定 n² 的不是“减一”，而是“每层约 cn，共 n 层”。</p>
</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>读代码写递推式</strong>：按三步读：递归几次、每次规模多大、本层多少工作，再写基本情况。</li>
<li><strong>展开求解</strong>：长题要写过程：代入两三行 → 第 i 步的通式 → 令 2<sup>i</sup> = n（减一类则写到 T(1) 再相加）→ 闭式 → Θ。</li>
<li><strong>选择 / 匹配</strong>：算法、递推式、复杂度对应，就是上面那张表。快速排序要分清最好、最坏。</li>
<li><strong>和主定理的分工</strong>：aT(n/b) + f(n) 可以直接套主定理（Master Theorem，见 1.9）得出 Θ，但得不到闭式；T(n−1) + cn 这类减常数的式子只能展开。题目要求展开时，主定理只能拿来核对。</li>
</ul>
<p>公式表上有等差、等比求和、对数恒等式和主定理；各算法的递推式和展开格式要自己记。</p>

<h3>例题 1：读代码，写递推式并展开（设 n 是 2 的幂）</h3>
<pre><code>int f(const int A[], int n) {
    if (n &lt;= 1) return A[0];
    int s = 0;
    for (int i = 0; i &lt; n; i++) {
        s += A[i];
    }
    return s + f(A, n / 2);
}</code></pre>
<p>按三步读：第 2 行是基本情况，n = 1 时直接返回，T(1) 是常数；第 4–6 行循环 n 次，本层工作 cn；第 7 行递归 1 次，规模 n/2。所以 <strong>T(n) = T(n/2) + cn</strong>。展开：</p>
<pre><code class="lang-text">T(n) = T(n/2) + cn
     = T(n/4) + cn/2 + cn
     = T(n/8) + cn/4 + cn/2 + cn
     ...
     = T(n/2^i) + cn·(1 + 1/2 + 1/4 + ... + 1/2^(i-1))
括号是公比 1/2 的等比求和：= 2(1 - 1/2^i)
令 2^i = n：T(n) = T(1) + 2cn·(1 - 1/n) = T(1) + 2c(n - 1)  ∈ Θ(n)</code></pre>
<p>检验 n = 16：循环共执行 16 + 8 + 4 + 2 = 30 = 2 × (16 − 1) 次。</p>
<p>答案是 <strong>Θ(n)，不是 Θ(n log n)</strong>：每层工作 cn、cn/2、cn/4……越来越小，总和不超过 2cn。归并排序递归 2 次，每层都是满的 cn，才是 n log n。</p>

<h3>例题 2：多选，哪些是 Θ(n²)？</h3>
<p>(A) T(n) = T(n−1) + c　(B) T(n) = T(n−1) + cn　(C) T(n) = 2T(n/2) + cn　(D) 已排序输入、总取首元素作 pivot 的快速排序　(E) 已排序输入上的插入排序</p>
<p><strong>答案：B 和 D。</strong></p>
<ul>
<li>A：n−1 个 c 相加，Θ(n)。</li>
<li>B：例 1，c(n+2)(n−1)/2，Θ(n²)。</li>
<li>C：例 3，n·T(1) + cn·log₂ n，Θ(n log n)。</li>
<li>D：每次 pivot 都是最小值，左边空、右边 n−1 个，T(n) = T(n−1) + cn，Θ(n²)。</li>
<li>E：每个新元素只比较 1 次，T(n) = T(n−1) + c，Θ(n)。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>2T(n/2) + cn 代入时漏乘 2，写成 4T(n/4) + cn/2 + cn。第 i 步的非递归部分必须是 i·cn。</li>
<li>二分查找写成 2T(n/2) + c。两个递归分支只执行一个；归并排序、快速排序两半都要排，才是 2T(n/2)。</li>
<li>减一展开是从 2 加到 n，套 n(n+1)/2 要减 1。只差常数，但闭式要写对。</li>
<li>规模减 2（T(n−2) + cn）仍是 Θ(n²)：层数变成 n/2，每层平均约 cn/2，还是 n² 级。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>递推式 = 递归部分 + 本层工作 + 基本情况。本层工作写 cn 或 c，不写 O(n)。</li>
<li>减一 T(n−1) + cn → c(n+2)(n−1)/2，<strong>Θ(n²)</strong>：选择排序、插入排序最坏、快速排序最坏。</li>
<li>减半 T(n/2) + c → T(1) + c·log₂ n，<strong>Θ(log n)</strong>：二分查找。</li>
<li>一分为二 2T(n/2) + cn → n·T(1) + cn·log₂ n，<strong>Θ(n log n)</strong>：归并排序、快速排序最好。</li>
<li>展开格式：代入几行 → 第 i 步通式 → 令 2<sup>i</sup> = n → 闭式 → Θ。系数要乘进去。</li>
<li>递归树：每层代价 × 层数。T(n/2) + cn 每层减半，总和不超过 2cn，是 Θ(n)。</li>
</ul>
`;
