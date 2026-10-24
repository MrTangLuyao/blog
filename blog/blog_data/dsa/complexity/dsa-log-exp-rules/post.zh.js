/* Post body — dsa-log-exp-rules / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-log-exp-rules:zh'] = `
<p class="lead">化简复杂度的三条规则：对数的底数不影响复杂度类，指数的底数会影响；读代码时，先后执行的部分相加，循环套循环的部分相乘。</p>

<h2>从一个场景说起</h2>
<p>一本 100 万页的电话簿，要找一个名字。</p>
<p>翻法一：每次翻到剩下部分的正中间，看名字在前半还是后半，扔掉另一半。翻 20 次就只剩 1 页，因为 2²⁰ ≈ 100 万。</p>
<p>翻法二：每次把剩下的分成 10 叠，看名字落在哪一叠。只要 6 次，因为 10⁶ = 100 万。</p>
<p>换成 10 亿页：翻法一 30 次，翻法二 9 次。页数怎么变，两者都差 3.3 倍左右，<strong>只差一个固定的倍数</strong>。</p>
<p>再看传话：每个听到的人再告诉 2 个新的人，第 n 轮新听到的有 2ⁿ 人；每人告诉 3 个，就是 3ⁿ 人。第 10 轮两者差约 58 倍，第 20 轮差约 3325 倍，<strong>差距越拉越大</strong>。</p>
<p>电话簿的次数是对数，传话的人数是指数。前者换个底只差常数倍，后者换个底就是另一个量级。</p>

<h2>它是什么：三条规则</h2>

<h3>规则 1：对数的底数无所谓</h3>
<p>对数（logarithm）用大白话说：log₂ n 是“n 对半分几次才剩 1”，log₁₀ n 是“n 除以 10 几次才剩 1”。底数就是“每次除以几”。</p>
<table>
<thead><tr><th>n</th><th>log₂ n</th><th>log₁₀ n</th><th>log₂ n ÷ log₁₀ n</th></tr></thead>
<tbody>
<tr><td>1024</td><td>10</td><td>3.01</td><td>3.32</td></tr>
<tr><td>10⁶</td><td>19.93</td><td>6</td><td>3.32</td></tr>
<tr><td>10⁹</td><td>29.90</td><td>9</td><td>3.32</td></tr>
</tbody>
</table>
<p>比值永远是 3.32，和 n 无关。原因是公式表上的<strong>换底公式（change of base）</strong>：</p>
<p><strong>log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a</strong></p>
<p>取 a = 10、b = 2：log₁₀ n = log₂ n / log₂ 10 ≈ <strong>0.301 · log₂ n</strong>。换底，就是乘一个常数。</p>
<p>而大 O 不管常数倍（见 1.4）：n ≥ 1 时 log₁₀ n ≤ 1 · log₂ n，log₂ n ≤ 4 · log₁₀ n，两者互为上界，属于同一个类。所以复杂度里<strong>对数不写底数，统一写 O(log n)</strong>。</p>
<p>分清“值”和“类”：数值上 log₂ n 确实是 log₁₀ n 的 3.32 倍，但两者属于同一个类。</p>
<p>公式表上还有两条对数恒等式：log(xy) = log x + log y，log(x<sup>r</sup>) = r · log x。所以 log₂(n³) = 3 log₂ n，还是 Θ(log n)。但 (log₂ n)² 是 log₂ n 自己乘自己，多出来的因子随 n 增长，不在 O(log n) 里。</p>

<h3>规则 2：指数的底数很要紧</h3>
<p>指数函数（exponential）指 2ⁿ、3ⁿ 这种 n 在指数上的函数。把传话的两种人数相除：3ⁿ ÷ 2ⁿ = 1.5ⁿ，n = 10 时约 58，n = 50 时约 6.4 × 10⁸，一直往上涨。</p>
<p>所以 <strong>3ⁿ ∉ O(2ⁿ)</strong>。要是有常数 c₀ 让 3ⁿ ≤ c₀ · 2ⁿ 一直成立，两边除以 2ⁿ 就是 1.5ⁿ ≤ c₀。可 1.5ⁿ 迟早超过任何固定的数：c₀ = 1000 时，1.5¹⁸ ≈ 1478 就超了。c₀ 再大也只是把超过的时刻往后推。</p>
<p>反过来 2ⁿ ≤ 3ⁿ 一直成立，所以 2ⁿ ∈ O(3ⁿ)。从慢到快是 <strong>O(2ⁿ) ⊂ O(3ⁿ) ⊂ O(n!)</strong>，两个不同的类。</p>
<p>两种写法最容易看错：</p>
<ul>
<li><strong>2³ⁿ</strong>：像是乘了 3，其实 2³ⁿ = (2³)ⁿ = <strong>8ⁿ</strong>，底数变了。8ⁿ ÷ 2ⁿ = 4ⁿ 无限增大，所以 2³ⁿ ∉ O(2ⁿ)。同理 2²ⁿ = 4ⁿ 也不在。</li>
<li><strong>2ⁿ⁺ᵏ</strong>（k 是常数）：2ⁿ⁺ᵏ = 2ᵏ · 2ⁿ，只多了常数 2ᵏ，所以 2ⁿ⁺ᵏ ∈ Θ(2ⁿ)。比如 2ⁿ⁺¹⁰ = 1024 · 2ⁿ。</li>
</ul>
<p>判断方法：<strong>改写成“某个因子 × 标准形式”，看多出来的因子是不是常数。</strong></p>
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
<p><strong>对数换底 = 乘常数 → 同一类；指数换底 = 乘 (b/a)ⁿ → 不同类。</strong>指数上<strong>加</strong>常数只多一个常数因子；指数上<strong>乘</strong>常数等于换底。</p>
</div>

<h3>规则 3：先后相加，嵌套相乘</h3>
<p>班上 n 个同学。老师先点名，n 次；再让每两人握一次手，n(n−1)/2 次（1.3 里循环赛的场数）。两件事<strong>一件接一件</strong>，次数相加：n = 100 时是 100 + 4950，点名那点几乎可以不计。</p>
<p>如果每个同学给全班每人（包括自己）各发一张贺卡，就是一件事<strong>套着</strong>另一件事：n 个人，每人 n 张，共 n × n 张。</p>
<ul>
<li><strong>相加</strong>：先后执行（sequential）的代码，O(f) + O(g) = O(max(f, g))，只留增长最快的那一项，叫主项（dominant term）。例如 O(n²) + O(n) + O(1) = O(n²)。</li>
<li><strong>相乘</strong>：循环体执行 k 次，总代价是 k × 循环体的代价，O(f) · O(g) = O(f · g)。乘常数可以丢掉（握两遍手还是 O(n²)），乘 n 就换了类。</li>
</ul>
<table>
<thead><tr><th>代码结构</th><th>怎么算</th><th>例子</th></tr></thead>
<tbody>
<tr><td>两段代码先后执行</td><td>相加，留较大的一项</td><td>O(n log n) 排序后再 O(n) 扫一遍 → O(n log n)</td></tr>
<tr><td>嵌套循环（nested loop），内层次数固定</td><td>各层次数相乘</td><td>n × n → O(n²)</td></tr>
<tr><td>嵌套循环，内层次数随外层变</td><td>把每轮的内层次数加起来</td><td>0 + 1 + … + (n−1) → O(n²)</td></tr>
<tr><td>if / else</td><td>最坏情况按较贵的分支算</td><td>一支 O(1)、一支 O(n) → O(n)</td></tr>
<tr><td>函数调用</td><td>把函数体的代价算进去</td><td>循环条件里的 <code>strlen</code>（例 4）</td></tr>
</tbody>
</table>

<h2>看个例子：读代码</h2>
<p>考试最常见的问法是给一段代码问复杂度。做法：找到最内层语句（下面用 <code>ops++</code> 代表），数它一共执行几次。</p>

<h3>例 1：每轮减半</h3>
<pre><code>while (n &gt; 1) {
    n /= 2;
    ops++;
}</code></pre>
<p>n = 16 时，n 依次变成 8、4、2、1，4 轮就停。k 轮后还剩约 n/2ᵏ，降到 1 要 log₂ n 轮（整数除法向下取整，精确值是 ⌊log₂ n⌋）。这就是电话簿的翻法一，也是二分查找（见 2.3）。</p>
<p><strong>每轮把规模除以（或把 i 乘以）一个常数的循环是 Θ(log n)。</strong>对比 <code>i += 2</code>：每轮只加常数，要跑 n/2 轮，还是 Θ(n)。</p>

<h3>例 2：内层从 i+1 开始</h3>
<pre><code>for (int i = 0; i &lt; n; i++)
    for (int j = i + 1; j &lt; n; j++)
        ops++;</code></pre>
<p>这就是“每两人握一次手”，每一对 (i, j) 只数一次。i = 0 时 j 从 1 跑到 n−1，内层 n−1 次；i = 1 时 n−2 次；……最后 i = n−1 时 j 从 n 开始，一次也不跑。</p>
<p>内层次数随 i 变，不能直接乘，要逐轮加：(n−1) + (n−2) + … + 1 + 0 = n(n−1)/2，用的是公式表上的等差求和（arithmetic series）。n = 16 时是 120。约 n²/2，<strong>Θ(n²)</strong>。</p>

<h3>例 3：外层翻倍，内层跑到 i</h3>
<pre><code>for (int i = 1; i &lt; n; i *= 2)
    for (int j = 0; j &lt; i; j++)
        ops++;</code></pre>
<p>外层 i = 1, 2, 4, 8, …，只有约 log₂ n 轮。内层跑 i 次，所以每轮的次数也是 1, 2, 4, 8, …。n = 16 时外层 4 轮，共 1 + 2 + 4 + 8 = 15 次。</p>
<p>一般地用公式表上的等比求和（geometric series）：1 + 2 + … + 2ᵏ⁻¹ = 2ᵏ − 1。最后一轮的 i 小于 n，所以总数小于 2n，<strong>Θ(n)</strong>。</p>
<p>按“log₂ n 轮 × 每轮最多 n 次”相乘得 n log n，上界没错，但偏松。两层循环不一定是 n²。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-log-exp-rules/anims/loop-grid.html" loading="lazy" style="height: 520px;" title="嵌套循环的执行次数"></iframe>
<p class="anim-caption">四个按钮是四种嵌套循环：j &lt; n（正方形）、j = i+1（例 2 的三角形）、j *= 2（每行 log n 格）、i *= 2, j &lt; i（例 3 的阶梯）。每行是外层的一轮，橙色格子是这一轮内层执行的 (i, j)，ops 跟着累加。切换 n = 8 / 16，最后一步给出 n 翻倍时次数变成几倍。</p>

<h3>例 4：循环条件里调用 strlen</h3>
<pre><code>int spaces = 0;
for (size_t i = 0; i &lt; strlen(s); i++)
    if (s[i] == ' ')
        spaces++;</code></pre>
<p>数长度为 n 的串 s 里有几个空格，看着只有一层循环。逐行看：</p>
<ul>
<li>第 2 行的条件 <code>i &lt; strlen(s)</code> 每轮都要判断，一共判断 n + 1 次（最后一次不成立，退出）；</li>
<li><code>strlen</code> 每被调用一次，都要从头逐个字符数到 <code>'\\0'</code>，走 n 步；</li>
<li>第 3、4 行每轮只是常数代价。</li>
</ul>
<p>合计约 (n + 1) × n 步，<strong>Θ(n²)</strong>。修法：循环前先写 <code>size_t len = strlen(s);</code>，条件改成 <code>i &lt; len</code>。长度只数一次，整段变成 Θ(n)。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/9TlHvipP5yA" title="1.5.1 Time Complexity #1" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《1.5.1 Time Complexity #1》（英文）。逐个分析常见的 for 循环：步长 +2、两层嵌套、内层跟着外层变、i *= 2 和 i /= 2，和上面的例子对应。</p>

<h2>补充：两个输入 m 和 n</h2>
<pre><code>for (int i = 0; i &lt; m; i++)      /* a 有 m 个元素 */
    sum += a[i];
for (int j = 0; j &lt; n; j++)      /* b 有 n 个元素 */
    sum += b[j];</code></pre>
<p>两段先后执行，共 m + n 次，复杂度 <strong>O(m + n)</strong>。不能写成 O(n)：两个输入互相独立，可能 m = n²，那时 m 才是主项。只有已知 m 不超过 n 的常数倍时，才能化简成 O(n)。</p>
<p>改成两层嵌套（a 的每个元素都和 b 的每个元素比一次），就是 <strong>O(mn)</strong>，不能写成 n²。</p>
<div class="callout warn" data-label="易错">
<p><strong>O(mn) 只有在 m 有常数上界时才等于 O(n)</strong>。只知道 m 比 n 小很多不够：m = √n 时 n · √n = n<sup>1.5</sup>，不在 O(n) 里。</p>
</div>

<h2>考试怎么考</h2>
<p>期末主要出在选择题和多选题里，长题写复杂度时也要用。常见问法：</p>
<ul>
<li><strong>给代码问复杂度</strong>：找最内层语句 → 看内层次数是否随外层变 → 相乘还是逐轮相加。留意 <code>i *= 2</code>、<code>i /= 2</code> 和循环条件里的函数调用。</li>
<li><strong>判断对数、指数的说法</strong>：log₂ n 和 log₁₀ n 的值与类、3ⁿ 是否在 O(2ⁿ) 里、2³ⁿ 和 2ⁿ⁺ᵏ 各属于哪类（见例题 1）。</li>
<li><strong>用两个变量写最紧上界（closest upper bound）</strong>：往年题要求用表长 m 和元素数 n、或顶点数 V 和边数 E 作答，两个变量都要保留。</li>
</ul>
<p><strong>公式表上有</strong>换底公式、两条对数恒等式、等差和等比求和。<strong>要自己记</strong>的是三条规则本身，以及嵌套循环什么时候乘、什么时候逐轮加。</p>

<h3>例题 1：多选</h3>
<p>下列哪些正确？(A) log₂ n ∈ O(log₁₀ n)　(B) n &gt; 1 时 log₂ n &gt; log₁₀ n　(C) 3ⁿ ∈ O(2ⁿ)　(D) 2ⁿ⁺¹⁰ ∈ Θ(2ⁿ)　(E) 2²ⁿ ∈ O(2ⁿ)　(F) log₂(n³) ∈ Θ(log n)　(G) (log₂ n)² ∈ O(log n)</p>
<p>答案：<strong>A、B、D、F</strong>。逐项看：</p>
<ul>
<li>A 对：log₂ n ≈ 3.32 · log₁₀ n ≤ 4 · log₁₀ n，取 c₀ = 4、n₀ = 1。</li>
<li>B 对：比的是数值，log₂ n ≈ 3.32 · log₁₀ n，且 n &gt; 1 时 log₁₀ n &gt; 0。和 A 不矛盾，A 比的是类。</li>
<li>C 错：3ⁿ ÷ 2ⁿ = 1.5ⁿ 无限增大，任何 c₀ 都压不住。</li>
<li>D 对：2ⁿ⁺¹⁰ = 1024 · 2ⁿ，只差常数。</li>
<li>E 错：2²ⁿ = 4ⁿ，4ⁿ ÷ 2ⁿ = 2ⁿ 无限增大。</li>
<li>F 对：log₂(n³) = 3 log₂ n，只差常数 3。</li>
<li>G 错：(log₂ n)² ÷ log₂ n = log₂ n，随 n 无限增大，不是常数。</li>
</ul>

<h3>例题 2：两段代码、两个变量</h3>
<p>n 和 m 是两个独立的输入规模。下面 <code>sum++</code> 执行几次？整段的最紧上界是什么？</p>
<pre><code>for (int i = 0; i &lt; n; i++)
    for (int j = n; j &gt; 0; j /= 2)
        sum++;
for (int k = 0; k &lt; m; k++)
    sum += k;</code></pre>
<p>先看第一段的内层：j 依次取 n, n/2, n/4, …, 1，共 ⌊log₂ n⌋ + 1 次；n = 16 时是 16, 8, 4, 2, 1，5 次。这个次数和 i 无关，所以直接相乘：<code>sum++</code> 执行 <strong>n(⌊log₂ n⌋ + 1)</strong> 次，n = 16 时 80 次。</p>
<p>第二段循环 m 次，和第一段先后执行，相加。总共 n(⌊log₂ n⌋ + 1) + m 次，复杂度 <strong>O(n log n + m)</strong>。m 和 n 没有已知关系，哪一项都不能丢。</p>
<div class="callout warn" data-label="易错">
<ul>
<li>把 2³ⁿ 当成 3 · 2ⁿ；把 (log n)² 当成 log(n²) = 2 log n。</li>
<li>看到两层循环就写 O(n²)：例 3 是 Θ(n)。</li>
<li>把 i += 2 当成 log n：加常数仍是线性，乘或除常数才是 log n。</li>
<li>两个输入的题擅自丢掉 m，或写成 O(n²)。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>对数换底只差常数倍（log₁₀ n ≈ 0.301 · log₂ n），统一写 O(log n)；数值不同，类相同。</li>
<li>指数换底差 (b/a)ⁿ，不是常数：3ⁿ ∉ O(2ⁿ)，2³ⁿ = 8ⁿ 是另一个类；2ⁿ⁺ᵏ = 2ᵏ · 2ⁿ 还是 Θ(2ⁿ)。</li>
<li>先后执行相加，只留主项；循环体执行 k 次就乘 k；常数倍直接丢。</li>
<li>嵌套循环：内层次数固定就相乘，随外层变就逐轮加起来（例 2 是 Θ(n²)，例 3 是 Θ(n)）。</li>
<li>每轮乘或除以常数的循环是 Θ(log n)；循环条件里的 <code>strlen</code> 每轮都走 n 步。</li>
<li>两个独立输入都要保留：O(m + n)、O(mn)。</li>
</ul>
`;
