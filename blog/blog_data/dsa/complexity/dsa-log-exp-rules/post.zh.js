/* Post body — dsa-log-exp-rules / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-log-exp-rules:zh'] = `
<p class="lead">log₂ n 和 log₁₀ n 只差一个常数倍，属于同一个复杂度类；2ⁿ 和 3ⁿ 的比值随 n 无限增大，是两个不同的类。读代码算复杂度时，先后执行的部分相加，循环套循环的部分相乘，内层次数随外层变化时要逐轮求和。</p>

<h2>对数：换底只差一个常数倍</h2>
<p>先看两种底数的对数（logarithm）在几个 n 上的值：</p>
<table>
<thead><tr><th>n</th><th>log₂ n</th><th>log₁₀ n</th><th>log₂ n ÷ log₁₀ n</th></tr></thead>
<tbody>
<tr><td>8</td><td>3</td><td>0.90</td><td>3.32</td></tr>
<tr><td>1024</td><td>10</td><td>3.01</td><td>3.32</td></tr>
<tr><td>10⁶</td><td>19.93</td><td>6</td><td>3.32</td></tr>
<tr><td>10⁹</td><td>29.90</td><td>9</td><td>3.32</td></tr>
</tbody>
</table>
<p>比值始终是 3.32，和 n 无关。原因是<strong>换底公式（change of base）</strong>，推导只有两步：设 x = log<sub>a</sub> n，则 a<sup>x</sup> = n；两边取 log<sub>b</sub>，得 x · log<sub>b</sub> a = log<sub>b</sub> n。所以</p>
<p><strong>log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a</strong>（公式表上有）</p>
<p>取 a = 10、b = 2：log₁₀ n = log₂ n / log₂ 10 = log₁₀ 2 · log₂ n ≈ <strong>0.301 · log₂ n</strong>。0.301 是常数，按大 O 的定义（见 1.4）两个方向都成立：</p>
<ul>
<li>log₁₀ n ≤ 1 · log₂ n 对 n ≥ 1 成立，取 c₀ = 1、n₀ = 1，得 log₁₀ n ∈ O(log₂ n)；</li>
<li>log₂ n ≈ 3.32 · log₁₀ n ≤ 4 · log₁₀ n 对 n ≥ 1 成立，取 c₀ = 4、n₀ = 1，得 log₂ n ∈ O(log₁₀ n)。</li>
</ul>
<p>两者互为上界，属于同一个 Θ 类。任何大于 1 的底数都是这样，所以复杂度里<strong>对数不写底数，统一写 O(log n)</strong>。这说的是类相同；数值上 n &gt; 1 时 log₂ n 确实约是 log₁₀ n 的 3.32 倍，两句话不矛盾。</p>
<p>公式表上另外两条对数恒等式也常用来化简：log(xy) = log x + log y，log(x<sup>r</sup>) = r · log x。于是 log₂(n³) = 3 log₂ n、log₂(2n) = 1 + log₂ n，都还是 Θ(log n)。</p>

<h2>指数：底数不同，类就不同</h2>
<p>两个指数函数（exponential）的比值 3ⁿ ÷ 2ⁿ = 1.5ⁿ：n = 10 时约 57.7，n = 20 时约 3325，n = 50 时约 6.4 × 10⁸。比值不是常数，而是无限增大。</p>
<p><strong>证明 3ⁿ ∉ O(2ⁿ)</strong>（反证）：假设有 c₀ &gt; 0 和 n₀，使所有 n &gt; n₀ 都满足 3ⁿ ≤ c₀ · 2ⁿ。两边除以 2ⁿ 得 1.5ⁿ ≤ c₀，即 n ≤ log<sub>1.5</sub> c₀。取一个同时大于 n₀ 和 log<sub>1.5</sub> c₀ 的 n，不等式就不成立，矛盾。例如 c₀ = 1000：log<sub>1.5</sub> 1000 ≈ 17.04，1.5¹⁷ ≈ 985 还没超过，1.5¹⁸ ≈ 1478 就超过了。c₀ 再大，也只是把失败点往后推。</p>
<p>反方向成立：2ⁿ ≤ 1 · 3ⁿ 对所有 n ≥ 0 成立，所以 2ⁿ ∈ O(3ⁿ)。在类的阶梯里 <strong>O(2ⁿ) ⊂ O(3ⁿ) ⊂ O(n!)</strong>，2ⁿ 和 3ⁿ 是两个不同的类。</p>
<p>两种写法最容易看错：</p>
<ul>
<li><strong>2³ⁿ</strong> 像是在 n 前面乘了常数 3，其实 2³ⁿ = (2³)ⁿ = <strong>8ⁿ</strong>，换了底。8ⁿ ÷ 2ⁿ = 4ⁿ 无界，所以 2³ⁿ ∉ O(2ⁿ)。同理 4ⁿ = 2²ⁿ 也不在 O(2ⁿ) 里。</li>
<li><strong>2ⁿ⁺ᵏ</strong>（k 是常数）= 2ᵏ · 2ⁿ，只多了常数因子 2ᵏ。取 c₀ = 2ᵏ（取 2ᵏ⁺¹ 也行）、n₀ = 0，所以 2ⁿ⁺ᵏ ∈ Θ(2ⁿ)。例如 2ⁿ⁺¹⁰ = 1024 · 2ⁿ。</li>
</ul>
<table>
<thead><tr><th>式子</th><th>改写</th><th>结论</th></tr></thead>
<tbody>
<tr><td>log₃ n</td><td>0.63 · log₂ n</td><td>Θ(log n)</td></tr>
<tr><td>log₂(n³)</td><td>3 · log₂ n</td><td>Θ(log n)</td></tr>
<tr><td>(log₂ n)²</td><td>log₂ n · log₂ n</td><td>不在 O(log n) 里</td></tr>
<tr><td>2ⁿ⁺³</td><td>8 · 2ⁿ</td><td>Θ(2ⁿ)</td></tr>
<tr><td>2³ⁿ</td><td>8ⁿ</td><td>不在 O(2ⁿ) 里</td></tr>
<tr><td>3ⁿ</td><td>1.5ⁿ · 2ⁿ</td><td>不在 O(2ⁿ) 里</td></tr>
<tr><td>2<sup>n/2</sup></td><td>(√2)ⁿ ≈ 1.41ⁿ</td><td>在 O(2ⁿ) 里，但不是 Θ(2ⁿ)</td></tr>
</tbody>
</table>
<div class="callout key" data-label="考点">
<p><strong>对数换底 = 乘一个常数 → 同一类；指数换底 = 乘 (b/a)ⁿ → 不同类。</strong>改写后看多出来的因子：是常数就同类，随 n 增长就不同类。指数上<strong>加</strong>常数只多出常数因子；指数上<strong>乘</strong>常数等于换底。</p>
</div>

<h2>复杂度的加法和乘法</h2>
<p>上界可以像数一样相加、相乘。设 n 足够大时 f₁ ≤ c₁ · f、g₁ ≤ c₂ · g，则：</p>
<ul>
<li><strong>常数倍</strong>：k · f₁ ≤ (k c₁) · f，所以 k · O(f) = O(f)。</li>
<li><strong>相加</strong>：f₁ + g₁ ≤ (c₁ + c₂) · max(f, g)，所以 O(f) + O(g) = O(max(f, g))，只留增长最快的一项（主项，dominant term）。例如 O(n²) + O(n) + O(1) = O(n²)。</li>
<li><strong>相乘</strong>：f₁ · g₁ ≤ (c₁ c₂) · f · g，所以 O(f) · O(g) = O(f · g)。例如 n · O(n) = O(n²)：乘常数可以丢掉，乘 n 就换了类。</li>
</ul>
<p>对应到代码结构：</p>
<table>
<thead><tr><th>代码结构</th><th>规则</th><th>例子</th></tr></thead>
<tbody>
<tr><td>两段代码先后执行（sequential）</td><td>相加，留较大的一项</td><td>O(n log n) 排序后再 O(n) 扫一遍 → O(n log n)</td></tr>
<tr><td>循环体执行 k 次</td><td>k × 循环体的代价</td><td>n 次 O(log n) 的二分查找 → O(n log n)</td></tr>
<tr><td>嵌套循环（nested loop），内层次数固定</td><td>各层次数相乘</td><td>n × n → O(n²)</td></tr>
<tr><td>嵌套循环，内层次数随外层变</td><td>把每轮的内层次数加起来</td><td>0 + 1 + … + (n−1) → O(n²)</td></tr>
<tr><td>if / else</td><td>最坏情况按较贵的分支算</td><td>一支 O(1)、一支 O(n) → O(n)</td></tr>
<tr><td>函数调用</td><td>调用本身算 1 次，函数体另算</td><td>循环条件里的 <code>strlen</code>（片段 5）</td></tr>
</tbody>
</table>

<h3>两个输入：m 和 n</h3>
<pre><code>for (int i = 0; i &lt; m; i++)      /* 第 1 段：m 次 */
    sum += a[i];
for (int j = 0; j &lt; n; j++)      /* 第 2 段：n 次 */
    sum += b[j];</code></pre>
<p>a 有 m 个元素，b 有 n 个，两段先后执行，共 m + n 次，复杂度 <strong>O(m + n)</strong>。不能写成 O(n)：m 和 n 是两个独立的输入，某次输入可能 m = n²，那时 m 才是主项。只有已知 m 不超过 n 的常数倍（比如 m ≪ n）时，才能化简成 O(n)。改成两层嵌套（对 a 的每个元素扫一遍 b），就是 <strong>O(mn)</strong>，见下面的片段 4。</p>
<div class="callout warn" data-label="易错">
<p>乘积比和更难化简。O(m + n) 在 m ≪ n 时可以写成 O(n)；<strong>O(mn) 只有在 m 有常数上界时才等于 O(n)</strong>。只知道 m ≪ n 不够：m = √n 远小于 n，但 n · √n = n<sup>1.5</sup> 不在 O(n) 里。</p>
</div>

<h2>读代码：六个片段</h2>
<p>每个函数都用全局计数器 <code>ops</code> 数最内层语句执行了几次，各片段的结果列在代码后的表里。</p>
<pre><code>#include &lt;stddef.h&gt;
#include &lt;ctype.h&gt;

static long ops = 0;             /* 最内层语句一共执行了几次 */

/* 1. 单循环，步长 2 */
void step2(int n) {
    for (int i = 0; i &lt; n; i += 2)
        ops++;
}

/* 2. 内层从 i+1 开始：每一对 (i, j) 只数一次 */
void pairs(int n) {
    for (int i = 0; i &lt; n; i++)
        for (int j = i + 1; j &lt; n; j++)
            ops++;
}

/* 3. 每轮减半 */
void halve(int n) {
    while (n &gt; 1) {
        n /= 2;
        ops++;
    }
}

/* 4. 两个数组：a 有 m 个元素，b 有 n 个，数相同元素的对数 */
int common(const int a[], int m, const int b[], int n) {
    int c = 0;
    for (int i = 0; i &lt; m; i++)
        for (int j = 0; j &lt; n; j++) {
            ops++;
            if (a[i] == b[j]) c++;
        }
    return c;
}

/* 5. 循环条件里调用函数：每轮都重新数一遍长度 */
size_t my_strlen(const char *s) {
    size_t k = 0;
    while (s[k] != '\\0') { k++; ops++; }
    return k;
}
void upper(char s[]) {
    for (size_t i = 0; i &lt; my_strlen(s); i++)
        s[i] = (char)toupper((unsigned char)s[i]);
}

/* 6. 外层翻倍，内层跑到 i */
void doubling(int n) {
    for (int i = 1; i &lt; n; i *= 2)
        for (int j = 0; j &lt; i; j++)
            ops++;
}</code></pre>
<table>
<thead><tr><th>片段</th><th>ops 精确值</th><th>n = 16</th><th>n = 1024</th><th>复杂度</th></tr></thead>
<tbody>
<tr><td>1 step2</td><td>⌈n/2⌉</td><td>8</td><td>512</td><td>Θ(n)</td></tr>
<tr><td>2 pairs</td><td>n(n−1)/2</td><td>120</td><td>523776</td><td>Θ(n²)</td></tr>
<tr><td>3 halve</td><td>⌊log₂ n⌋</td><td>4</td><td>10</td><td>Θ(log n)</td></tr>
<tr><td>4 common（m = n 时）</td><td>m · n</td><td>256</td><td>1048576</td><td>Θ(mn)</td></tr>
<tr><td>5 upper（串长 n）</td><td>n(n+1)</td><td>272</td><td>1049600</td><td>Θ(n²)</td></tr>
<tr><td>6 doubling</td><td>2<sup>⌈log₂ n⌉</sup> − 1</td><td>15</td><td>1023</td><td>Θ(n)</td></tr>
</tbody>
</table>
<p><strong>片段 1</strong>：步长 2 只让次数减半，n/2 仍是 Θ(n)。i += 2 是每轮加常数，和 i *= 2 不是一回事。</p>
<p><strong>片段 2</strong>：内层次数依次是 n−1, n−2, …, 1, 0，用公式表上的等差求和得 n(n−1)/2 ≈ n²/2，Θ(n²)。n 个人循环赛的场数就是这个式子（见 1.3）。</p>
<p><strong>片段 3</strong>：k 轮后大约还剩 n/2ᵏ，降到 1 就停，所以约 log₂ n 轮（整数除法向下取整，精确值是 ⌊log₂ n⌋）。n = 16 时依次是 16 → 8 → 4 → 2 → 1，共 4 轮。<strong>每轮把规模除以一个常数的循环是 Θ(log n)</strong>，二分查找就是这样（见 2.3）。</p>
<p><strong>片段 4</strong>：内层固定 n 次，外层 m 次，相乘得 mn。两个数组长度不同时要写 Θ(mn)，不能写成 n²。</p>
<p><strong>片段 5</strong>：循环只有 n 轮，但每次判断 <code>i &lt; my_strlen(s)</code> 都要把整个串数一遍（n 次），条件共判断 n + 1 次，合计 n(n+1)，Θ(n²)。标准库的 <code>strlen</code> 同样逐个字符数到 <code>'\\0'</code>，也是 O(n)。修法是先把长度存下来，整个函数就变成 Θ(n)：</p>
<pre><code>size_t len = strlen(s);          /* 只数一次 */
for (size_t i = 0; i &lt; len; i++)
    s[i] = (char)toupper((unsigned char)s[i]);</code></pre>
<p><strong>片段 6</strong>：两层循环，但外层只有 ⌈log₂ n⌉ 轮，内层次数 1, 2, 4, … 逐轮翻倍。用公式表上的等比求和，1 + 2 + … + 2ᵏ⁻¹ = 2ᵏ − 1；最后一轮的 i 小于 n，所以总数小于 2n，Θ(n)。</p>
<div class="callout key" data-label="考点">
<p><strong>嵌套循环不是一律相乘。</strong>内层次数固定时相乘；内层次数随外层变化时，把每一轮的次数加起来（片段 2、6）。“外层轮数 × 内层最多次数”只给出一个上界，可能偏松：片段 6 这样算得 n log n，实际是 Θ(n)。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-log-exp-rules/anims/loop-grid.html" loading="lazy" style="height: 520px;" title="嵌套循环的执行次数"></iframe>
<p class="anim-caption">按钮切换四种嵌套循环和 n = 8 / 16。每行是外层的一轮，橙色格子是这一轮内层执行的 (i, j)，ops 随之累加。看正方形、三角形、每行 log n 格和阶梯四种形状，以及 n 翻倍时最后一步给出的次数比。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择题：给一段程序问复杂度。</strong>先找最内层语句，再判断内层次数是否随外层变化，决定相乘还是求和。重点看 i *= 2、i /= 2（log n）、循环条件里的函数调用和不回退的指针（练习 3）。</li>
<li><strong>对数底数</strong>：例如“有人说 log₂ n 比 log₁₀ n 大，哪个说法对”。要点：数值上约 3.32 倍，但属于同一个类 Θ(log n)。</li>
<li><strong>指数底数</strong>：3ⁿ ∈ O(2ⁿ)？2³ⁿ 和 2ⁿ 同类吗？都不是；2ⁿ⁺ᵏ 是。按增长率排序时 2ⁿ 在 3ⁿ 前面。</li>
<li><strong>用两个变量写最紧上界（closest upper bound）</strong>：往年题要求用表长 m 和元素数 n、或顶点数 V 和边数 E 作答。两个独立变量都要保留，除非题目给出它们之间的关系。</li>
<li><strong>公式表上有</strong>：换底公式、log(xy)、log(x<sup>r</sup>)、等差求和、等比求和。<strong>要自己记</strong>：对数底数不影响类、指数底数影响；相加留最大项、相乘就相乘；嵌套循环什么时候乘、什么时候加。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>把 2³ⁿ 当成 3 · 2ⁿ。</li>
<li>把 (log n)² 当成 log(n²)：后者等于 2 log n，前者不在 O(log n) 里。</li>
<li>两个输入的题写成 O(n²)，或者擅自丢掉 m。</li>
<li>看到两层循环就写 O(n²)：片段 6 和练习 3 都是 Θ(n)。</li>
<li>把 i += 2 当成 log n：加常数仍是线性，乘或除常数才是 log n。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 多选：下列哪些正确？(A) log₂ n ∈ O(log₁₀ n)　(B) n &gt; 1 时 log₂ n &gt; log₁₀ n　(C) 3ⁿ ∈ O(2ⁿ)　(D) 2ⁿ⁺¹⁰ ∈ Θ(2ⁿ)　(E) 2²ⁿ ∈ O(2ⁿ)　(F) log₂(n³) ∈ Θ(log n)　(G) (log₂ n)² ∈ O(log n)</summary>
<div class="qa__body">
<p>正确的是 <strong>A、B、D、F</strong>。</p>
<ul>
<li>A 对：log₂ n ≈ 3.32 · log₁₀ n ≤ 4 · log₁₀ n，取 c₀ = 4、n₀ = 1。</li>
<li>B 对：这是比数值。log₂ n ≈ 3.32 · log₁₀ n，而 n &gt; 1 时 log₁₀ n &gt; 0。它和 A 不矛盾，A 比的是类。</li>
<li>C 错：3ⁿ ÷ 2ⁿ = 1.5ⁿ 无界，任何 c₀ 在 n &gt; log<sub>1.5</sub> c₀ 之后都失效。</li>
<li>D 对：2ⁿ⁺¹⁰ = 1024 · 2ⁿ，取 c₁ = c₂ = 1024、n₀ = 0。</li>
<li>E 错：2²ⁿ = 4ⁿ，4ⁿ ÷ 2ⁿ = 2ⁿ 无界。</li>
<li>F 对：log₂(n³) = 3 log₂ n，取 c₁ = c₂ = 3、n₀ = 1。</li>
<li>G 错：若 (log₂ n)² ≤ c₀ · log₂ n，两边除以 log₂ n（n &gt; 1 时为正）得 log₂ n ≤ c₀，即 n ≤ 2<sup>c₀</sup>，n 更大时就不成立。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. n 和 m 是两个独立的输入规模。下面代码里 sum++ 执行几次？整段代码的最紧上界是什么？</summary>
<div class="qa__body">
<pre><code>for (int i = 0; i &lt; n; i++)
    for (int j = n; j &gt; 0; j /= 2)
        sum++;
for (int k = 0; k &lt; m; k++)
    sum += k;</code></pre>
<p>内层 j 依次取 n, n/2, n/4, …, 1，共 ⌊log₂ n⌋ + 1 次；n = 16 时是 16, 8, 4, 2, 1，5 次。内层次数和 i 无关，所以相乘：sum++ 执行 <strong>n(⌊log₂ n⌋ + 1)</strong> 次，n = 16 时 80 次。</p>
<p>第二段循环 m 次，和第一段先后执行，相加。总共 n(⌊log₂ n⌋ + 1) + m，复杂度 <strong>O(n log n + m)</strong>。m 和 n 没有已知关系，哪一项都不能丢。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. a、b 都是长度为 n 的升序数组，下面代码为每个 a[i] 找出 b 中第一个 ≥ a[i] 的位置。有人说“两层循环，所以是 n²”。这个推理对吗？最紧上界是什么？</summary>
<div class="qa__body">
<pre><code>int j = 0;
for (int i = 0; i &lt; n; i++) {
    while (j &lt; n &amp;&amp; b[j] &lt; a[i])
        j++;
    pos[i] = j;          /* b 中第一个 &gt;= a[i] 的位置 */
}</code></pre>
<p>推理不对。O(n²) 作为上界成立（大 O 只是上界），但不是最紧的；最紧的是 <strong>Θ(n)</strong>。关键在 <code>j</code> 定义在外层循环外面，<strong>从不回退</strong>：j 从 0 出发，最多走到 n，所以整个程序里 j++ <strong>合计</strong>最多 n 次，而不是每一轮 n 次。</p>
<p>逐轮求和：第 i 轮 while 条件判断“本轮 j++ 次数 + 1”次，n 轮合计 ≤ n + n = 2n。外层本身就有 n 轮，所以总代价是 Θ(n)。n × n 只是一个偏松的上界。如果把 <code>int j = 0;</code> 挪进外层循环（每轮从 0 重新开始），最坏情况（每个 a[i] 都比 b 的所有元素大）才是 Θ(n²)。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 一棵完美平衡的三叉树（每个内部结点恰有 3 个孩子，叶子都在同一层）有 n 个结点。查找时每层只访问一个结点，每个结点做常数次比较。查找的复杂度是多少？比完美平衡二叉树的复杂度类更好吗？</summary>
<div class="qa__body">
<p>h 层的完美三叉树有 1 + 3 + 9 + … + 3<sup>h−1</sup> 个结点，用公式表上的等比求和（r = 3）得 (3<sup>h</sup> − 1)/2 = n，所以 h = log₃(2n + 1)。查找最多访问 h 个结点，每个常数代价，复杂度 O(log₃ n)。</p>
<p>换底：log₃ n = log₂ n / log₂ 3 ≈ 0.63 · log₂ n，只差常数，所以写成 <strong>O(log n)</strong>，和二叉树<strong>同一个类</strong>，不是更好的类。例如 n = 121 时三叉树正好 5 层，二叉树至少要 7 层（2⁷ − 1 = 127 ≥ 121），层数少了，类没变。</p>
</div>
</details>
`;
