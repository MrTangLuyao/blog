/* Post body — dsa-master-theorem / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-master-theorem:zh'] = `
<p class="lead">分治算法的递推式大多长成 T(n) = aT(n/b) + f(n)。<strong>主定理（Master Theorem）</strong>不用展开就能给出它的 Θ：读出 a、b、d，比较 a 和 b<sup>d</sup>，三种情况选一种。定理印在 equation sheet 上，考点在于把 a、b、d 读对，以及认出它不适用的递推式。</p>

<h2>分治的通用递推式</h2>
<p>课上把分治（divide and conquer）写成：把规模为 n 的问题分成 <strong>b</strong> 个实例，每个规模约 n/b；（通常是递归地）求解其中 <strong>a</strong> 个；再用 <strong>f(n)</strong> 次操作拼出原问题的解。<strong>f(n) 是递归调用之外的全部代价：划分（split）加合并（join）。</strong></p>
<pre><code class="lang-text">T(n) = a·T(n/b) + f(n),    T(1) = c</code></pre>
<p>a 不一定等于 b：二分查找把数组分成两半却只进其中一半，a = 1、b = 2；a 也可以比 b 大。课上的三个例子：</p>
<table>
<thead><tr><th>算法</th><th>b</th><th>a</th><th>f(n)</th><th>递推式描述的是</th></tr></thead>
<tbody>
<tr><td>归并排序</td><td>2</td><td>2</td><td>n（merge）</td><td>所有情况</td></tr>
<tr><td>快速排序</td><td>2</td><td>2</td><td>n（partition；join 为 0）</td><td><strong>只是最好情况</strong>：pivot 每次正好对半分</td></tr>
<tr><td>二分查找</td><td>2</td><td>1</td><td>1（一次比较决定进哪半）</td><td><strong>最坏情况</strong>：中途找到会提前停</td></tr>
</tbody>
</table>
<p>前两个都是 T(n) = 2T(n/2) + n，二分查找是 T(n) = T(n/2) + 1。</p>

<h2>每层花多少：a 和 b<sup>d</sup> 的较量</h2>
<p>固定 b = 2、f(n) = n，只改 a，比较 T(n) = aT(n/2) + n 的递归树。第 i 层有 a<sup>i</sup> 个子问题，每个规模 n/2<sup>i</sup>，非递归代价也是 n/2<sup>i</sup>。取 n = 16，叶子规模 1、代价按 T(1) = 1 算，每格是“个数 × 每个代价 = 本层代价”：</p>
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
<p>三列只差在<strong>相邻两层代价之比</strong>：子问题个数每层乘 a，每个子问题的代价每层除以 2。a = 1 时逐层减半，合计 31 &lt; 2n，量级由第 0 层决定，Θ(n)；a = 2 时每层都是 n，共 log₂ n + 1 层，合计 n(log₂ n + 1) = 80，Θ(n log n)；a = 4 时逐层翻倍，光最底层就有 4<sup>log₂ n</sup> = n² = 256 个叶子，Θ(n²)。</p>
<p>一般情形：规模除以 b 时，n<sup>d</sup> 除以 b<sup>d</sup>，所以</p>
<pre><code class="lang-text">第 i 层代价 = a^i · (n/b^i)^d = n^d · (a/b^d)^i        i = 0, 1, …, log_b n</code></pre>
<p>合计是首项 n<sup>d</sup>、公比 r = a/b<sup>d</sup> 的等比数列（equation sheet 上的 finite geometric sum）：</p>
<ul>
<li><strong>a &lt; b<sup>d</sup></strong>（r &lt; 1）：逐层变小，合计不超过 n<sup>d</sup>/(1 − r)，<strong>根</strong>上的 f(n) 决定量级 → Θ(n<sup>d</sup>)。</li>
<li><strong>a = b<sup>d</sup></strong>（r = 1）：每层都是 n<sup>d</sup>，乘上 log<sub>b</sub> n + 1 层 → Θ(n<sup>d</sup> log n)。</li>
<li><strong>a &gt; b<sup>d</sup></strong>（r &gt; 1）：逐层变大，<strong>叶子</strong>那一层占大头。叶子有 a<sup>log<sub>b</sub> n</sup> = n<sup>log<sub>b</sub> a</sup> 个（两边取 log<sub>b</sub> 都等于 log<sub>b</sub> a · log<sub>b</sub> n）→ Θ(n<sup>log<sub>b</sub> a</sup>)。</li>
</ul>
<p>这三条就是主定理。a 是每往下一层子问题变多的倍数，b<sup>d</sup> 是每个子问题代价变小的倍数，谁大谁决定总量。</p>

<h2>定理：equation sheet 上的版本</h2>
<p>若 <strong>a ≥ 1、b &gt; 1 为常数，f(n) ∈ Θ(n<sup>d</sup>)，d ≥ 0</strong>，且 T(n) = aT(n/b) + f(n)，T(1) = c，则</p>
<table>
<thead><tr><th>情况</th><th>条件</th><th>T(n) ∈</th></tr></thead>
<tbody>
<tr><td>1</td><td>a &lt; b<sup>d</sup></td><td>Θ(n<sup>d</sup>)</td></tr>
<tr><td>2</td><td>a = b<sup>d</sup></td><td>Θ(n<sup>d</sup> log n)</td></tr>
<tr><td>3</td><td>a &gt; b<sup>d</sup></td><td>Θ(n<sup>log<sub>b</sub> a</sup>)</td></tr>
</tbody>
</table>
<ul>
<li>sheet 上写的是整数常数；课上补充 a、b 不是整数（如 b = 1.5）也成立。</li>
<li>d 可以是 0 或分数：f(n) = 1 时 d = 0，f(n) = √n 时 d = 1/2。</li>
<li>log 的底不影响 Θ（见 1.6）；T(1) 等于哪个常数也不影响结论。</li>
<li>有些教材（如 CLRS）把条件写成 f(n) 与 n<sup>log<sub>b</sub> a</sup> 的比较；本课程用上表这一版，比较 a 与 b<sup>d</sup>。</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/dsa-master-theorem/anims/master-calc.html" loading="lazy" style="height: 560px;" title="主定理计算器"></iframe>
<p class="anim-caption">输入 a、b、d 或点预设，顶部立即给出 b<sup>d</sup>、所属情况和结论；按“下一步”逐层展开 n = b<sup>5</sup> 的递归树，每行是该层的子问题个数 × 规模和本层代价。橙色是当前层，最后一帧用绿色标出决定量级的层。</p>

<h2>三步套用</h2>
<ol>
<li><strong>核对形式</strong>：a 个子问题、每个规模都是 n/b，a、b 是常数，f(n) 是 Θ(n<sup>d</sup>)。</li>
<li><strong>读出 a、b、d</strong>：a 是 T 前面的系数，b 是 n 被除的数，d 是 f(n) 的指数。</li>
<li><strong>算 b<sup>d</sup> 和 a 比较</strong>，选情况写 Θ；log<sub>b</sub> a 是整数就化简。</li>
</ol>
<table>
<thead><tr><th>递推式</th><th>a, b, d</th><th>a 对 b<sup>d</sup></th><th>结论</th></tr></thead>
<tbody>
<tr><td>2T(n/2) + n（归并；快排最好）</td><td>2, 2, 1</td><td>2 = 2，情况 2</td><td>Θ(n log n)</td></tr>
<tr><td>T(n/2) + 1（二分查找最坏）</td><td>1, 2, 0</td><td>1 = 1，情况 2</td><td>Θ(log n)</td></tr>
<tr><td>9T(n/3) + n（课上的“神秘算法”）</td><td>9, 3, 1</td><td>9 &gt; 3，情况 3</td><td>Θ(n<sup>log₃ 9</sup>) = Θ(n²)</td></tr>
<tr><td>2T(n/2) + 1（递归求最大值）</td><td>2, 2, 0</td><td>2 &gt; 1，情况 3</td><td>Θ(n<sup>log₂ 2</sup>) = Θ(n)</td></tr>
<tr><td>8T(n/2) + n²</td><td>8, 2, 2</td><td>8 &gt; 4，情况 3</td><td>Θ(n<sup>log₂ 8</sup>) = Θ(n³)</td></tr>
<tr><td>4T(n/2) + n²</td><td>4, 2, 2</td><td>4 = 4，情况 2</td><td>Θ(n² log n)</td></tr>
<tr><td>3T(n/4) + n</td><td>3, 4, 1</td><td>3 &lt; 4，情况 1</td><td>Θ(n)</td></tr>
<tr><td>T(n/2) + n</td><td>1, 2, 1</td><td>1 &lt; 2，情况 1</td><td>Θ(n)</td></tr>
</tbody>
</table>
<div class="callout key" data-label="考点">
<p><strong>f(n) 是常数时 d = 0</strong>，因为 1 = n⁰。二分查找若把 d 读成 1，会得到 1 &lt; 2 → Θ(n)，错。课上说这大概是主定理里唯一容易错的地方。</p>
<p>2T(n/2) + n 本身就是快排的最好情况，所以可以直接写<strong>快排最好情况 Θ(n log n)</strong>，不必退到 O。</p>
</div>

<h2>从代码读出 a、b、d</h2>
<p>a 数的是<strong>一次调用里发出几次递归调用</strong>，b 看每次递归的规模缩成几分之一，d 看<strong>递归调用以外</strong>的工作量。</p>
<pre><code>/* 返回 A[lo..hi-1] 中的最大值，n = hi - lo，要求 n &gt;= 1 */
int rmax(const int A[], int lo, int hi) {
    if (hi - lo == 1) return A[lo];          /* 基本情况：T(1) = c */
    int mid = lo + (hi - lo) / 2;
    int l = rmax(A, lo, mid);                /* T(n/2) */
    int r = rmax(A, mid, hi);                /* T(n/2) */
    return l &gt; r ? l : r;                    /* 1 次比较：f(n) = c */
}</code></pre>
<p>两次递归、各处理一半、另加一次比较：T(n) = 2T(n/2) + c，a = 2、b = 2、d = 0。2 &gt; 2⁰ = 1，情况 3，Θ(n<sup>log₂ 2</sup>) = <strong>Θ(n)</strong>。实际比较次数恰好是 n − 1（n = 8 时 7 次），和从头扫一遍一样，分治并没有更快。若每次调用还要循环扫一遍自己的区间，f(n) 变成 n，d = 1，就成了情况 2 的 Θ(n log n)。</p>

<h2>不能直接套用的递推式</h2>
<p>主定理只认 a·T(n/b) + Θ(n<sup>d</sup>) 这一种形状，而且 a ≥ 1、b &gt; 1 都得是常数。课上列了三类典型情况：</p>
<table>
<thead><tr><th>类型</th><th>例子</th><th>说明</th></tr></thead>
<tbody>
<tr><td>子问题大小不等</td><td>T(n) = T(n/3) + T(2n/3) + n</td><td>没有统一的 n/b。一般情况下的快排就是这样，只有最好情况才是两个 n/2</td></tr>
<tr><td>按常数减小</td><td>T(n) = T(n − 1) + n</td><td>规模是 n − 1 而不是 n/b。选择排序、插入排序、快排最坏情况都属此类，用展开法得 Θ(n²)（见 1.8）</td></tr>
<tr><td>f(n) 不是多项式</td><td>T(n) = 2T(n/2) + log n</td><td>log n 不属于任何 Θ(n<sup>d</sup>)；n log n、2<sup>n</sup> 同理</td></tr>
</tbody>
</table>
<p><strong>Big-O 版本</strong>：把条件和结论里的 Θ 都换成 O，定理照样成立：f(n) ∈ O(n<sup>d</sup>) 时，三种情况分别给出 T(n) ∈ O(n<sup>d</sup>)、O(n<sup>d</sup> log n)、O(n<sup>log<sub>b</sub> a</sup>)。它能部分处理第三类：log n ∈ O(n)，取 d = 1，a = 2 = 2¹，得 T(n) ∈ O(n log n)。这是对的<strong>上界，但不一定紧</strong>，好比说二分查找最坏情况是 O(n²)。这个例子的真实量级是 Θ(n)：改用 log n ∈ O(n<sup>0.5</sup>)，2 &gt; 2<sup>0.5</sup>，得到 O(n)；而叶子就有 n 个，所以也是 Ω(n)。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>给递推式求 Θ</strong>（选择、填空）。课上说期末几乎肯定有一道主定理题。</li>
<li><strong>先写递推式再套定理</strong>：给出算法描述或 C 代码，要求写出 T(n) 并求复杂度。归并排序、快排最好情况、二分查找、最近点对的分治（见 1.11）都要能当场写出。</li>
<li><strong>能不能用、为什么</strong>：对照上面三类回答；用 Big-O 版本时要说明得到的只是上界。</li>
<li><strong>情况限定</strong>：快排的 2T(n/2) + n 只描述最好情况，二分查找的 T(n/2) + 1 是最坏情况，结论要带上限定词。</li>
</ul>
<p>sheet 上有：条件 a ≥ 1、b &gt; 1、f(n) ∈ Θ(n<sup>d</sup>) 和三种情况。sheet 上没有、要自己掌握：a、b、f(n) 的含义（f(n) = 划分 + 合并），三类不适用的递推式，Big-O 版本，以及上面几个算法的递推式。</p>
<div class="callout warn" data-label="易错">
<p>① 常数 f(n) 的 d 是 0，不是 1。② 比的是 a 和 <strong>b<sup>d</sup></strong>，不是 a 和 b。③ 情况 3 的指数是 log<sub>b</sub> a（底是 b），不是 log<sub>a</sub> b。④ a 是实际发出的递归调用次数，把一次调用的结果乘 3 不算 3 次。⑤ log n、n log n 都不是 n<sup>d</sup>，d 不能硬读成 0 或 1。⑥ 情况 2 里 d = 0 得 Θ(log n)，d = 1 得 Θ(n log n)。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 写出 a、b、d、所属情况和 Θ：(1) T(n) = 2T(n/4) + √n；(2) T(n) = 7T(n/2) + n²；(3) T(n) = 16T(n/4) + n²；(4) T(n) = T(n/3) + 1；(5) T(n) = 2T(n/2) + n³。</summary>
  <div class="qa__body">
    <p>(1) a = 2，b = 4，√n = n<sup>1/2</sup>，d = 1/2。b<sup>d</sup> = 4<sup>1/2</sup> = 2 = a，情况 2：<strong>Θ(√n log n)</strong>。</p>
    <p>(2) a = 7，b = 2，d = 2。b<sup>d</sup> = 4 &lt; 7，情况 3：<strong>Θ(n<sup>log₂ 7</sup>)</strong>，约 Θ(n<sup>2.81</sup>)。log₂ 7 不是整数，保留这个写法。</p>
    <p>(3) a = 16，b = 4，d = 2。b<sup>d</sup> = 16 = a，情况 2：<strong>Θ(n² log n)</strong>。</p>
    <p>(4) a = 1，b = 3，d = 0。b<sup>d</sup> = 3⁰ = 1 = a，情况 2：<strong>Θ(log n)</strong>，和二分查找同一量级。</p>
    <p>(5) a = 2，b = 2，d = 3。b<sup>d</sup> = 8 &gt; 2，情况 1：<strong>Θ(n³)</strong>，根上的 f(n) 已占大头。</p>
  </div>
</details>
<pre><code>long g(int n) {
    if (n &lt;= 1) return 1;
    long s = 0;
    for (int i = 0; i &lt; n; i++)
        s += i % 3;
    return s + g(n / 2) + g(n / 2) + g(n / 2);
}</code></pre>
<details class="qa">
  <summary class="ripple-surface">2. 写出上面函数 g 的递推式并求时间复杂度。若把最后一行改成 <code>return s + 3 * g(n / 2);</code>（返回值不变），复杂度变成多少？</summary>
  <div class="qa__body">
    <p>for 循环执行 n 次，f(n) = n，d = 1；发出三次规模 n/2 的调用，a = 3，b = 2。T(n) = 3T(n/2) + n，b<sup>d</sup> = 2 &lt; 3，情况 3：<strong>Θ(n<sup>log₂ 3</sup>)</strong>，约 Θ(n<sup>1.585</sup>)。实测 n = 1024 时循环体执行 116050 次 = 2(3¹⁰ − 2¹⁰)，约为 n<sup>log₂ 3</sup> = 3¹⁰ = 59049 的 2 倍。</p>
    <p>改写后只有<strong>一次</strong>递归调用，结果乘 3 只是常数时间：T(n) = T(n/2) + n，a = 1 &lt; 2 = b<sup>d</sup>，情况 1：<strong>Θ(n)</strong>。n = 1024 时循环体执行 2046 次 = 2n − 2。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. （多选）哪些递推式能直接用主定理（Θ 版本）求解？A. T(n) = T(n/3) + T(2n/3) + n；B. T(n) = T(n − 1) + 1；C. T(n) = 3T(n/3) + n；D. T(n) = 2T(n/2) + n log n；E. T(n) = 4T(n/2) + 1。</summary>
  <div class="qa__body">
    <p><strong>C 和 E。</strong>C：a = 3，b = 3，d = 1，3 = 3¹，情况 2，Θ(n log n)。E：a = 4，b = 2，d = 0，4 &gt; 2⁰ = 1，情况 3，Θ(n<sup>log₂ 4</sup>) = Θ(n²)。</p>
    <p>A 子问题大小不等；B 按常数减小（展开得 Θ(n)）；D 的 n log n 不是 n<sup>d</sup>。D 可以用 Big-O 版本求上界：n log n ∈ O(n²)，d = 2，2 &lt; 4，情况 1，T(n) ∈ O(n²)，正确但不紧。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 判断并说明理由：“由主定理，快速排序的时间复杂度是 Θ(n log n)。”</summary>
  <div class="qa__body">
    <p><strong>不对。</strong>2T(n/2) + n 只在 pivot 每次正好对半分时成立，描述的是<strong>最好情况</strong>，只能得出“快排最好情况 Θ(n log n)”。一般情况下两边大小不等，形如 T(k) + T(n − 1 − k) + n，不是 aT(n/b) 的形状；最坏情况 T(n) = T(n − 1) + n 按常数减小，同样不能用主定理，展开得 Θ(n²)（见 1.8）。</p>
    <p>归并排序不同：任何输入都从中点对半分，2T(n/2) + n 对所有输入成立，所以“归并排序 Θ(n log n)”是对的。</p>
  </div>
</details>
`;
