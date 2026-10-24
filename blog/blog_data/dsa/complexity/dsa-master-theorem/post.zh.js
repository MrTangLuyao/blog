/* Post body — dsa-master-theorem / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-master-theorem:zh'] = `
<p class="lead">主定理（Master Theorem）是分治递推式 T(n) = aT(n/b) + f(n) 的“查表法”：读出 a、b、d 三个数，比较 a 和 b<sup>d</sup>，直接写出 Θ，不用一行行展开。</p>

<h2>从一个场景说起</h2>
<p>一家公司接了一个规模为 n 的大活。老板不亲自干：他把活切成几块，分给手下几个经理；每个经理拿到的活小一些，又切开分给自己的手下……一直分到最小的活，由最底层的员工直接干完。</p>
<p>每个人除了往下派活，自己也要干点事：把活切开，再把下面交上来的结果拼起来。手里的活越大，这部分越费工夫。</p>
<p>全公司一共干了多少活？把公司画成一座金字塔：越往下人越多，但每人手里的活越小。总量是顶上的老板说了算，还是底下一大片员工说了算，就看<strong>人数涨得快，还是活缩得快</strong>。</p>
<p>分治算法（divide and conquer）就是这家公司。1.8 用展开法（telescoping）解它的递推式（recurrence），每道题都要推好几行。主定理把这件事变成了查表：读三个数，比一次大小，答案就出来了。</p>

<h2>它是什么</h2>
<p>课上这样描述分治：把规模为 n 的问题分成 <strong>b</strong> 份，每份规模约 n/b；递归地求解其中 <strong>a</strong> 份；再花 <strong>f(n)</strong> 的工夫拼出原问题的解。写成递推式：</p>
<pre><code class="lang-text">T(n) = a·T(n/b) + f(n),    T(1) = c（某个常数）</code></pre>
<p>三个字母对回公司：</p>
<ul>
<li><strong>a：一次调用发出几次递归调用</strong>，也就是老板手下有几个经理。</li>
<li><strong>b：规模缩成几分之一</strong>，每个经理拿到 n/b 的活。</li>
<li><strong>f(n)：递归调用之外的全部代价</strong>，也就是老板自己干的那份：划分（split）加合并（join）。定理要求 f(n) ∈ Θ(n<sup>d</sup>)，<strong>d 就是 f(n) 的指数</strong>。</li>
</ul>
<p>a 不一定等于 b。二分查找把数组分成两半，却只进其中一半，所以 a = 1、b = 2。</p>
<p>定理印在 equation sheet 上。条件是 <strong>a ≥ 1、b &gt; 1 为常数，f(n) ∈ Θ(n<sup>d</sup>)，d ≥ 0</strong>，结论分三种情况：</p>
<table>
<thead><tr><th>情况</th><th>条件</th><th>T(n) ∈</th><th>谁说了算</th></tr></thead>
<tbody>
<tr><td>1</td><td>a &lt; b<sup>d</sup></td><td>Θ(n<sup>d</sup>)</td><td>根（老板）</td></tr>
<tr><td>2</td><td>a = b<sup>d</sup></td><td>Θ(n<sup>d</sup> log n)</td><td>每层一样多</td></tr>
<tr><td>3</td><td>a &gt; b<sup>d</sup></td><td>Θ(n<sup>log<sub>b</sub> a</sup>)</td><td>叶子（底层员工）</td></tr>
</tbody>
</table>
<p>怎么记？<strong>a 是每往下一层，子问题个数乘几；b<sup>d</sup> 是每往下一层，每个子问题的代价缩小几倍。</strong>人数涨得慢，顶上的根说了算；一样快，每层都一样多，乘上层数就多出一个 log n；人数涨得快，最底下的叶子说了算。</p>

<h3>补充：几个细节</h3>
<ul>
<li>d 可以是 0 或分数：f(n) = 1 时 d = 0，f(n) = √n 时 d = 1/2。</li>
<li>sheet 上写的是整数常数；课上补充 a、b 不是整数（比如 b = 1.5）也成立。</li>
<li>log 的底不影响 Θ（见 1.6）；T(1) 等于哪个常数也不影响结论。</li>
<li>CLRS 等教材把条件写成 f(n) 和 n<sup>log<sub>b</sub> a</sup> 比较。本课用上表这一版，比较 a 和 b<sup>d</sup>。</li>
</ul>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/03FZos3Dtc4" title="Using the Master Theorem" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：John Bowers《Using the Master Theorem》（英文，约 15 分钟），讲怎么用主定理求分治递推式的量级。各家写条件的方式不同：比较 d 和 log<sub>b</sub> a，与本课比较 a 和 b<sup>d</sup> 是一回事（两边取 log<sub>b</sub>）；拿 f(n) 和 n<sup>log<sub>b</sub> a</sup> 比的是 CLRS 写法。考试按本课的版本答。</p>

<h2>看个例子</h2>
<p>套用只要三步：<strong>核对形式</strong>（a 个子问题、规模都是 n/b、f(n) 是 n<sup>d</sup>）→ <strong>读出 a、b、d</strong> → <strong>算 b<sup>d</sup>，和 a 比</strong>。</p>

<h3>例 1：归并排序 T(n) = 2T(n/2) + n</h3>
<p>归并排序从中间劈开，两半都要排：a = 2、b = 2。merge 两半要 n 次操作：f(n) = n = n¹，d = 1。</p>
<p>b<sup>d</sup> = 2¹ = 2，正好等于 a，情况 2：<strong>Θ(n¹ log n) = Θ(n log n)</strong>。</p>
<p>快速排序在 pivot 每次正好对半分时也是这个式子：partition 花 n，拼回去不花工夫。所以<strong>快排最好情况 Θ(n log n)</strong>。</p>

<h3>例 2：二分查找 T(n) = T(n/2) + 1</h3>
<p>一次比较决定进哪一半，只进一半：a = 1、b = 2、f(n) = 1。</p>
<p>关键一步：<strong>f(n) 是常数时 d = 0</strong>，因为 1 = n⁰。b<sup>d</sup> = 2⁰ = 1 = a，情况 2：<strong>Θ(n⁰ log n) = Θ(log n)</strong>。</p>
<p>把 d 读成 1 会得到 1 &lt; 2 → Θ(n)，错。课上说这大概是主定理里唯一容易错的地方。另外，这个式子描述的是<strong>最坏情况</strong>：中途找到会提前停。</p>

<h3>例 3：课上的“神秘算法” T(n) = 9T(n/3) + n</h3>
<p>a = 9、b = 3、d = 1。b<sup>d</sup> = 3 &lt; 9，人数涨得比活缩得快，情况 3：Θ(n<sup>log₃ 9</sup>)。log₃ 9 = 2，化简成 <strong>Θ(n²)</strong>。</p>

<h3>为什么是这三种情况</h3>
<p>把递归树（recursion tree）一层层摊开。固定 b = 2、f(n) = n，只改 a。取 n = 16，叶子按 T(1) = 1 算，每格是“子问题个数 × 每个的代价 = 本层代价”：</p>
<table>
<thead><tr><th>层 i</th><th>每个规模</th><th>a = 1</th><th>a = 2</th><th>a = 4</th></tr></thead>
<tbody>
<tr><td>0</td><td>16</td><td>1×16 = 16</td><td>1×16 = 16</td><td>1×16 = 16</td></tr>
<tr><td>1</td><td>8</td><td>1×8 = 8</td><td>2×8 = 16</td><td>4×8 = 32</td></tr>
<tr><td>2</td><td>4</td><td>1×4 = 4</td><td>4×4 = 16</td><td>16×4 = 64</td></tr>
<tr><td>3</td><td>2</td><td>1×2 = 2</td><td>8×2 = 16</td><td>64×2 = 128</td></tr>
<tr><td>4</td><td>1</td><td>1×1 = 1</td><td>16×1 = 16</td><td>256×1 = 256</td></tr>
<tr><td>合计</td><td></td><td>31</td><td>80</td><td>496</td></tr>
</tbody>
</table>
<p>a = 1 时每层减半，合计 31，不到 2n，根说了算：Θ(n)。a = 2 时每层都是 n，共 log₂ n + 1 层，合计 n(log₂ n + 1) = 80：Θ(n log n)。a = 4 时每层翻倍，光叶子就有 4<sup>log₂ n</sup> = n² = 256 个：Θ(n²)。</p>
<p>一般地，第 i 层代价是 a<sup>i</sup> · (n/b<sup>i</sup>)<sup>d</sup> = n<sup>d</sup> · (a/b<sup>d</sup>)<sup>i</sup>，是一个公比为 a/b<sup>d</sup> 的等比数列（geometric series）。公比小于 1、等于 1、大于 1，正好对应三种情况。情况 3 的叶子有 a<sup>log<sub>b</sub> n</sup> = n<sup>log<sub>b</sub> a</sup> 个，那个指数就是这么来的。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-master-theorem/anims/master-calc.html" loading="lazy" style="height: 560px;" title="主定理计算器"></iframe>
<p class="anim-caption">输入 a、b、d 或点预设，顶部立刻给出 b<sup>d</sup>、属于哪种情况和结论。按“下一步”逐层展开 n = b<sup>5</sup> 的递归树，每行是该层的子问题个数 × 规模和本层代价；橙色是当前层，最后一帧用绿色标出决定量级的层。</p>

<h3>再看几个</h3>
<table>
<thead><tr><th>递推式</th><th>a, b, d</th><th>a 对 b<sup>d</sup></th><th>结论</th></tr></thead>
<tbody>
<tr><td>2T(n/2) + 1</td><td>2, 2, 0</td><td>2 &gt; 1，情况 3</td><td>Θ(n<sup>log₂ 2</sup>) = Θ(n)</td></tr>
<tr><td>8T(n/2) + n²</td><td>8, 2, 2</td><td>8 &gt; 4，情况 3</td><td>Θ(n<sup>log₂ 8</sup>) = Θ(n³)</td></tr>
<tr><td>4T(n/2) + n²</td><td>4, 2, 2</td><td>4 = 4，情况 2</td><td>Θ(n² log n)</td></tr>
<tr><td>3T(n/4) + n</td><td>3, 4, 1</td><td>3 &lt; 4，情况 1</td><td>Θ(n)</td></tr>
<tr><td>T(n/2) + n</td><td>1, 2, 1</td><td>1 &lt; 2，情况 1</td><td>Θ(n)</td></tr>
</tbody>
</table>

<h2>从代码读出 a、b、d</h2>
<p>考试常给一段 C 代码，要你先写递推式再求复杂度。盯住三件事：<strong>一次调用里发出几次递归调用</strong>（a），<strong>每次递归规模缩成几分之一</strong>（b），<strong>递归调用以外干了多少活</strong>（d）。</p>
<pre><code>/* 返回 A[lo..hi-1] 中的最大值，n = hi - lo，要求 n &gt;= 1 */
int rmax(const int A[], int lo, int hi) {
    if (hi - lo == 1) return A[lo];          /* 基本情况：T(1) = c */
    int mid = lo + (hi - lo) / 2;
    int l = rmax(A, lo, mid);                /* T(n/2) */
    int r = rmax(A, mid, hi);                /* T(n/2) */
    return l &gt; r ? l : r;                    /* 1 次比较：f(n) = c */
}</code></pre>
<ul>
<li>第 3 行：只剩 1 个元素就直接返回，这是基本情况（base case），T(1) = c。</li>
<li>第 4 行：算中点，常数时间。</li>
<li>第 5、6 行：两次递归调用，各处理一半，贡献 2T(n/2)，所以 a = 2、b = 2。</li>
<li>第 7 行：一次比较，常数时间。</li>
</ul>
<p>递归之外只有常数工作，f(n) = c，d = 0。递推式是 T(n) = 2T(n/2) + c。2 &gt; 2⁰ = 1，情况 3：Θ(n<sup>log₂ 2</sup>) = <strong>Θ(n)</strong>。</p>
<p>实际比较次数正好是 n − 1（n = 8 时 7 次），和从头扫一遍一样，分治在这里并没有更快。如果每次调用还要用循环扫一遍自己的区间，f(n) 就变成 n，d = 1，结果变成情况 2 的 Θ(n log n)。</p>

<h2>不能直接套用的情况</h2>
<p>主定理只认 a·T(n/b) + Θ(n<sup>d</sup>) 这一种形状，a、b 还得是常数。课上列了三类套不上的：</p>
<table>
<thead><tr><th>类型</th><th>例子</th><th>为什么不行</th></tr></thead>
<tbody>
<tr><td>子问题大小不等</td><td>T(n/3) + T(2n/3) + n</td><td>没有统一的 n/b。一般情况下的快排就是这样</td></tr>
<tr><td>按常数减小</td><td>T(n − 1) + n</td><td>规模是 n − 1，不是 n/b。选择排序、插入排序、快排最坏情况都属此类，用展开法得 Θ(n²)（见 1.8）</td></tr>
<tr><td>f(n) 不是多项式</td><td>2T(n/2) + log n</td><td>log n 不属于任何 Θ(n<sup>d</sup>)；n log n、2<sup>n</sup> 也一样</td></tr>
</tbody>
</table>
<h3>补充：Big-O 版本</h3>
<p>把条件和结论里的 Θ 都换成 O，定理照样成立。它能救一部分第三类：log n ∈ O(n)，取 d = 1，a = 2 = 2¹，得 T(n) ∈ O(n log n)。这个上界（upper bound）是对的，<strong>但不一定紧</strong>。</p>
<p>这个例子的真实量级是 Θ(n)：改用 log n ∈ O(n<sup>0.5</sup>)，2 &gt; 2<sup>0.5</sup>，得 O(n)；而光叶子就有 n 个，所以也是 Ω(n)。考试里用 Big-O 版本，要写明得到的只是上界。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>给递推式求 Θ</strong>（选择、填空）。课上说期末几乎肯定有一道主定理题。</li>
<li><strong>先写递推式再套定理</strong>：给算法描述或 C 代码。归并排序、快排最好情况、二分查找、最近点对的分治（见 1.11）都要能当场写出递推式。</li>
<li><strong>判断能不能用</strong>：对照上面三类说理由。</li>
<li><strong>带上情况限定</strong>：快排的 2T(n/2) + n 只是最好情况，二分查找的 T(n/2) + 1 是最坏情况。</li>
</ul>
<p>sheet 上有定理的条件和三种情况。sheet 上没有、要自己会的：a、b、f(n) 各是什么（f(n) = 划分 + 合并），三类套不上的递推式，Big-O 版本，以及上面几个算法的递推式。</p>

<h3>例题 1：读代码写递推式</h3>
<pre><code>long g(int n) {
    if (n &lt;= 1) return 1;
    long s = 0;
    for (int i = 0; i &lt; n; i++)
        s += i % 3;
    return s + g(n / 2) + g(n / 2) + g(n / 2);
}</code></pre>
<p>求 g 的时间复杂度。如果把最后一行改成 <code>return s + 3 * g(n / 2);</code>（返回值不变），复杂度变成多少？</p>
<p><strong>原版</strong>：for 循环跑 n 次，f(n) = n，d = 1。最后一行发出<strong>三次</strong>规模 n/2 的调用，a = 3，b = 2。T(n) = 3T(n/2) + n。b<sup>d</sup> = 2 &lt; 3，情况 3：<strong>Θ(n<sup>log₂ 3</sup>)</strong>，约 Θ(n<sup>1.585</sup>)。log₂ 3 不是整数，就保留这个写法。</p>
<p><strong>改写后</strong>：只有<strong>一次</strong>递归调用，乘 3 只是一次乘法。T(n) = T(n/2) + n，a = 1 &lt; 2 = b<sup>d</sup>，情况 1：<strong>Θ(n)</strong>。</p>
<p>拿 n = 1024 实测循环体的执行次数：原版 116050 次，约是 n<sup>log₂ 3</sup> = 3¹⁰ = 59049 的 2 倍；改写后 2046 次，等于 2n − 2。返回值一样，代价差了 50 多倍。</p>

<h3>例题 2：哪些能直接用主定理（多选）</h3>
<p>A. T(n) = T(n/3) + T(2n/3) + n；B. T(n) = T(n − 1) + 1；C. T(n) = 3T(n/3) + n；D. T(n) = 2T(n/2) + n log n；E. T(n) = 4T(n/2) + 1。</p>
<p><strong>答案：C 和 E。</strong></p>
<ul>
<li>C：a = 3，b = 3，d = 1，3 = 3¹，情况 2，Θ(n log n)。</li>
<li>E：a = 4，b = 2，d = 0，4 &gt; 2⁰ = 1，情况 3，Θ(n<sup>log₂ 4</sup>) = Θ(n²)。</li>
<li>A 两个子问题大小不等；B 按常数减小（展开得 Θ(n)）；D 的 n log n 不是 n<sup>d</sup>。</li>
</ul>
<p>D 可以退一步用 Big-O 版本：n log n ∈ O(n²)，取 d = 2，2 &lt; 4，情况 1，T(n) ∈ O(n²)。对，但不紧。</p>

<div class="callout warn" data-label="易错">
<p>① 常数 f(n) 的 d 是 0，不是 1。② 比的是 a 和 <strong>b<sup>d</sup></strong>，不是 a 和 b。③ 情况 3 的指数是 log<sub>b</sub> a（底是 b），不是 log<sub>a</sub> b。④ a 数的是实际发出的递归调用，把一次调用的结果乘 3 不算 3 次。⑤ log n、n log n 不是 n<sup>d</sup>，不能硬读成 d = 0 或 1。</p>
<p>⑥ “由主定理，快排是 Θ(n log n)”是<strong>错</strong>的：2T(n/2) + n 只描述最好情况；最坏情况 T(n − 1) + n 套不上主定理，展开得 Θ(n²)（见 1.8）。归并排序任何输入都从中点对半分，所以“归并排序 Θ(n log n)”是对的。</p>
</div>

<h2>小结</h2>
<ul>
<li>T(n) = aT(n/b) + f(n)：a 是递归调用次数，b 是规模缩小的倍数，f(n) = 划分 + 合并，d 是 f(n) 的指数。</li>
<li>比较 a 和 b<sup>d</sup>：a &lt; b<sup>d</sup> → Θ(n<sup>d</sup>)；a = b<sup>d</sup> → Θ(n<sup>d</sup> log n)；a &gt; b<sup>d</sup> → Θ(n<sup>log<sub>b</sub> a</sup>)。定理在 sheet 上，把 a、b、d 读对才是考点。</li>
<li>f(n) 是常数时 d = 0：二分查找最坏情况 Θ(log n)。</li>
<li>归并排序、快排最好情况都是 2T(n/2) + n → Θ(n log n)；9T(n/3) + n → Θ(n²)。</li>
<li>子问题大小不等、按常数减小、f(n) 不是多项式，都不能直接套；Big-O 版本只给上界。</li>
</ul>
`;
