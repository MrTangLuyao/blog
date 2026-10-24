/* Post body — dsa-omega-theta / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-omega-theta:zh'] = `
<p class="lead">大 O 只限制函数最多长多快。<strong>大 Ω（Big-Omega）</strong>给出下界（lower bound），说明函数至少长多快；<strong>大 Θ（Big-Theta）</strong>同时给出上界（upper bound）和下界，把函数夹在同一个 g(n) 的两个常数倍之间，叫紧确界（tight bound）。</p>

<h2>Ω：把不等号反过来</h2>
<p>顺序扫描找最大值：第一个数当作当前最大值，后面 n − 1 个数各比较一次，比较次数 T(n) = n − 1。要说明它“至少是线性的”，就要找 n 的一个常数倍垫在它下面。取 1·n 不行，n − 1 ≥ n 对任何 n 都不成立。取一半：n − 1 ≥ n/2 等价于 n ≥ 2。所以取 c₀ = 1/2、n₀ = 2，对所有 n &gt; n₀ 都有 n − 1 ≥ ½·n，即 n − 1 ∈ Ω(n)。</p>

<div class="callout key" data-label="考点">
<p><strong>f(n) ∈ Ω(g(n))</strong> 当且仅当存在常数 c₀ &gt; 0 和 n₀，使得对所有 n &gt; n₀，<strong>f(n) ≥ c₀·g(n)</strong>。</p>
<p>和大 O 的定义（见 1.4 大 O）只差不等号的方向。c₀ 必须大于 0，但可以小于 1。</p>
</div>

<p>课上的例子 n² ∈ Ω(n) 更直接：取 c₀ = 1、n₀ = 1，n &gt; 1 时 n² = n·n ≥ n。</p>
<p>下界也有松紧之分。n² 同时属于 Ω(n²)、Ω(n)、Ω(log n)、Ω(1)，这些都是真命题。<strong>惯例是报告最大的下界</strong>，这里是 Ω(n²)，正如大 O 报告最近的上界。Ω(1) 对任何至少做一次操作的算法都成立，不提供信息。</p>

<h3>对偶：f ∈ Ω(g) ⇔ g ∈ O(f)</h3>
<p>Ω 和 O 互为对偶（duality）。把 f(n) ≥ c₀·g(n) 两边除以 c₀，得到 g(n) ≤ (1/c₀)·f(n)，n₀ 不变，这正是 g ∈ O(f) 的定义；反过来也一样。所以 “n² ∈ Ω(n)” 和 “n ∈ O(n²)” 说的是同一件事。上面的 n − 1 ∈ Ω(n)（c₀ = 1/2）也就给出 n ∈ O(n − 1)，常数是 2。</p>

<h3>证明“不属于”</h3>
<p>n ∈ Ω(n²) 是假的，用反证法（proof by contradiction）说明。假设存在 c₀ &gt; 0 和 n₀，使所有 n &gt; n₀ 都满足 n ≥ c₀·n²。两边除以 n 得 n ≤ 1/c₀，但 n 可以取得比 n₀ 和 1/c₀ 都大，例如 c₀ = 0.01 时 n = 101 就不满足。<strong>不论 c₀ 多小，总有更大的 n 让不等式失败</strong>，所以这样的常数不存在。由对偶性，这同时证明了 n² ∉ O(n)。</p>

<h2>Θ：从上下两边夹住</h2>
<p>课上的例子是 T(n) = 2n² + 4。一方面 2n² + 4 ≥ 1·n²；另一方面 n ≥ 1 时 4 ≤ 4n²，所以 2n² + 4 ≤ 2n² + 4n² = 6n²。T(n) 被夹在 n² 和 6n² 之间。两条边界都是 n² 的常数倍，T(n) 的增长率就固定在 n² 这一级：不比 n² 快，也不比 n² 慢。</p>

<figure class="fig">
<svg viewBox="0 0 520 285" width="520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="f(n) = 2n² + 4 被夹在 n² 和 6n² 之间，n 小于 1 时 f 高于 6n²">
<g stroke="rgba(255,255,255,0.08)" stroke-width="1">
<line x1="50" y1="195" x2="400" y2="195"/><line x1="50" y1="140" x2="400" y2="140"/><line x1="50" y1="85" x2="400" y2="85"/><line x1="50" y1="30" x2="400" y2="30"/>
</g>
<g stroke="rgba(255,255,255,0.35)" stroke-width="1.5">
<line x1="50" y1="250" x2="410" y2="250"/><line x1="50" y1="250" x2="50" y2="24"/>
</g>
<g fill="#a1a1a0" font-size="12">
<text x="44" y="199" text-anchor="end">10</text><text x="44" y="144" text-anchor="end">20</text><text x="44" y="89" text-anchor="end">30</text><text x="44" y="34" text-anchor="end">40</text>
<text x="50" y="268" text-anchor="middle">0</text><text x="190" y="268" text-anchor="middle">1</text><text x="330" y="268" text-anchor="middle">2</text>
<text x="418" y="254">n</text><text x="58" y="18">操作数</text>
</g>
<polygon fill="rgba(248,113,113,0.30)" points="50,228 57,228 64,227.9 71,227.8 78,227.6 85,227.3 92,227 99,226.7 106,226.2 113,225.8 120,225.3 127,224.7 134,224 141,223.4 148,222.6 155,221.8 162,221 169,220.1 176,219.1 183,218.1 190,217 183,220.2 176,223.3 169,226.2 162,228.9 155,231.4 148,233.8 141,236.1 134,238.1 127,240 120,241.8 113,243.3 106,244.7 99,246 92,247 85,247.9 78,248.7 71,249.3 64,249.7 57,249.9 50,250"/>
<line x1="190" y1="250" x2="190" y2="30" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4"/>
<polyline fill="none" stroke="#38bdf8" stroke-width="2.5" points="50,250 57,249.9 64,249.7 71,249.3 78,248.7 85,247.9 92,247 99,246 106,244.7 113,243.3 120,241.8 127,240 134,238.1 141,236.1 148,233.8 155,231.4 162,228.9 169,226.2 176,223.3 183,220.2 190,217 197,213.6 204,210.1 211,206.4 218,202.5 225,198.4 232,194.2 239,189.9 246,185.3 253,180.6 260,175.7 267,170.7 274,165.5 281,160.2 288,154.6 295,148.9 302,143.1 309,137.1 316,130.9 323,124.5 330,118 337,111.3 344,104.5 351,97.5 358,90.3 365,82.9 372,75.4 379,67.8 386,59.9 393,51.9 400,43.8"/>
<polyline fill="none" stroke="#d97757" stroke-width="3" points="50,228 57,228 64,227.9 71,227.8 78,227.6 85,227.3 92,227 99,226.7 106,226.2 113,225.8 120,225.3 127,224.7 134,224 141,223.4 148,222.6 155,221.8 162,221 169,220.1 176,219.1 183,218.1 190,217 197,215.9 204,214.7 211,213.5 218,212.2 225,210.8 232,209.4 239,208 246,206.4 253,204.9 260,203.2 267,201.6 274,199.8 281,198.1 288,196.2 295,194.3 302,192.4 309,190.4 316,188.3 323,186.2 330,184 337,181.8 344,179.5 351,177.2 358,174.8 365,172.3 372,169.8 379,167.3 386,164.6 393,162 400,159.3"/>
<polyline fill="none" stroke="#4ade80" stroke-width="2.5" points="50,250 57,250 64,249.9 71,249.9 78,249.8 85,249.7 92,249.5 99,249.3 106,249.1 113,248.9 120,248.6 127,248.3 134,248 141,247.7 148,247.3 155,246.9 162,246.5 169,246 176,245.5 183,245 190,244.5 197,243.9 204,243.3 211,242.7 218,242.1 225,241.4 232,240.7 239,240 246,239.2 253,238.4 260,237.6 267,236.8 274,235.9 281,235 288,234.1 295,233.2 302,232.2 309,231.2 316,230.1 323,229.1 330,228 337,226.9 344,225.7 351,224.6 358,223.4 365,222.2 372,220.9 379,219.6 386,218.3 393,217 400,215.6"/>
<g font-size="13" font-weight="700">
<text x="408" y="52" fill="#38bdf8">c₂·g = 6n²</text>
<text x="408" y="164" fill="#d97757">f = 2n² + 4</text>
<text x="408" y="221" fill="#4ade80">c₁·g = n²</text>
<text x="196" y="44" fill="#e8e8e8">n₀ = 1</text>
</g>
<text x="120" y="204" fill="#f87171" font-size="12" text-anchor="middle">n &lt; 1：f &gt; 6n²</text>
</svg>
<figcaption>2n² + 4 被夹在 n² 与 6n² 之间。n₀ = 1 右边三条线的上下顺序不再改变；左边红色区域里 f 高于 6n²，上界不成立，所以需要 n₀。</figcaption>
</figure>

<div class="callout key" data-label="考点">
<p><strong>f(n) ∈ Θ(g(n))</strong> 当且仅当存在常数 c₁ &gt; 0、c₂ &gt; 0 和 n₀，使得对所有 n &gt; n₀，<strong>c₁·g(n) ≤ f(n) ≤ c₂·g(n)</strong>。</p>
<p>要给出<strong>三个常数</strong>。等价说法：<strong>f ∈ Θ(g) ⇔ f ∈ O(g) 且 f ∈ Ω(g)</strong>，上界和下界各自的 n₀ 取较大的一个即可。</p>
</div>

<p>考试里的证明写成这样：</p>
<pre><code class="lang-text">要证  2n² + 4 ∈ Θ(n²)
取 n₀ = 1, c₁ = 1, c₂ = 6。对所有 n &gt; 1：
  下界  1·n² ≤ 2n² ≤ 2n² + 4
  上界  2n² + 4 ≤ 2n² + 4n² = 6n²        （n &gt; 1 时 4 ≤ 4n²）
所以  1·n² ≤ 2n² + 4 ≤ 6·n²，即 2n² + 4 ∈ Θ(n²)。
</code></pre>
<p>课上第二个练习 3n + 3 ∈ Θ(n) 同样处理：n₀ = 1、c₁ = 1、c₂ = 6，因为 n ≤ 3n + 3 ≤ 3n + 3n = 6n。</p>
<p>系数都非负的多项式有固定套路：<strong>n₀ = 1，c₂ = 所有系数之和</strong>（每一项都放大成最高次幂），c₁ 取最高次项的系数。课上直接取 c₁ = 1，在最高次项系数 ≥ 1 时没问题；系数小于 1 时会失败，例如 n²/2 + n ≥ n² 只在 n ≤ 2 时成立。带减号的项要另外估计（练习 2）。</p>

<h2>集合的角度：O 层层嵌套，Θ 互不相交</h2>
<p>O(g) 是一个函数集合，叫复杂度类（complexity class）。增长慢的函数也被更快的上界盖住，所以 O 类一层套一层：</p>
<p><strong>O(1) ⊂ O(log n) ⊂ O(n) ⊂ O(n log n) ⊂ O(n²) ⊂ O(n³) ⊂ O(2ⁿ) ⊂ O(n!)</strong></p>
<p>3n + 3 属于 O(n)，因此也属于外面的每一层。Ω 的包含方向相反：Ω(n!) ⊂ … ⊂ Ω(n) ⊂ Ω(1)，所以 n² 也属于 Ω(1)。Θ 类不同：一个函数属于 Θ(n)，就不可能再属于 Θ(n²) 或 Θ(log n)，<strong>不同的 Θ 类互不相交</strong>。</p>

<figure class="fig">
<svg viewBox="0 0 540 272" width="540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="嵌套的 O 类，每一层里有一个不相交的 Θ 类">
<g fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5">
<rect x="10" y="10" width="520" height="252" rx="12"/>
<rect x="24" y="46" width="492" height="210" rx="12"/>
<rect x="38" y="82" width="464" height="168" rx="12"/>
<rect x="52" y="118" width="436" height="126" rx="12"/>
<rect x="66" y="154" width="408" height="84" rx="12"/>
<rect x="80" y="190" width="380" height="42" rx="12"/>
</g>
<g fill="#38bdf8" font-size="13" font-weight="700">
<text x="22" y="33">O(2ⁿ)</text>
<text x="36" y="69">O(n²)</text>
<text x="50" y="105">O(n log n)</text>
<text x="64" y="141">O(n)</text>
<text x="78" y="177">O(log n)</text>
<text x="92" y="213">O(1)</text>
</g>
<g fill="rgba(217,119,87,0.12)" stroke="#d97757" stroke-width="1.5" stroke-dasharray="4 3">
<rect x="110" y="17" width="150" height="22" rx="11"/>
<rect x="124" y="53" width="150" height="22" rx="11"/>
<rect x="138" y="89" width="190" height="22" rx="11"/>
<rect x="152" y="125" width="130" height="22" rx="11"/>
<rect x="166" y="161" width="140" height="22" rx="11"/>
<rect x="180" y="197" width="90" height="22" rx="11"/>
</g>
<g fill="#e8e8e8" font-size="12">
<text x="122" y="32">Θ(2ⁿ)：2ⁿ + n³</text>
<text x="136" y="68">Θ(n²)：2n² + 4</text>
<text x="150" y="104">Θ(n log n)：n log₂ n + n</text>
<text x="164" y="140">Θ(n)：3n + 3</text>
<text x="178" y="176">Θ(log n)：log₁₀ n</text>
<text x="192" y="212">Θ(1)：5</text>
</g>
<circle cx="330" cy="64" r="5" fill="#f87171"/>
<text x="341" y="68" fill="#f87171" font-size="12">T(n)：偶 n、奇 n²</text>
</svg>
<figcaption>实线框是 O 类，一层套一层：2n² + 4 在 O(n²) 里，也在外面的 O(2ⁿ) 里。虚线框是 Θ 类：Θ(n) 在 O(n) 之内，又碰不到内层的 O(log n)，所以不同的 Θ 类互不相交。红点 T(n) 在 O(n²) 里，却不在任何虚线框里（见下文）。</figcaption>
</figure>

<h3>不是每个函数都有 Θ 界</h3>
<p>课上的例子：输入长度 n 为偶数时做 n 次操作，为奇数时做 n² 次。写成代码：</p>
<pre><code>/* 输入长度 n 为偶数时做 n 次操作，奇数时做 n*n 次 */
long count_ops(int n) {
    long ops = 0;
    if (n % 2 == 0) {
        for (int i = 0; i &lt; n; i++)
            ops++;
    } else {
        for (int i = 0; i &lt; n; i++)
            for (int j = 0; j &lt; n; j++)
                ops++;
    }
    return ops;
}</code></pre>
<table>
<thead><tr><th>n</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead>
<tbody><tr><td>T(n)</td><td>1</td><td>2</td><td>9</td><td>4</td><td>25</td><td>6</td><td>49</td><td>8</td></tr></tbody>
</table>
<p>每个 n 都满足 n ≤ T(n) ≤ n²，所以 T ∈ O(n²) 且 T ∈ Ω(n)。但 T ∉ O(n)：奇数 n 一旦大于 c₀，就有 n² &gt; c₀·n（c₀ = 10 时 n = 11 就失败）。T ∉ Ω(n²)：偶数 n 一旦大于 1/c₀，就有 n &lt; c₀·n²（c₀ = 0.1 时 n = 12 失败）。<strong>最紧的上界 O(n²) 和最大的下界 Ω(n) 不在同一类，T(n) 不属于阶梯上的任何一个 Θ 类。</strong>（形式上 T ∈ Θ(T) 总成立，但这对比较算法没有帮助。）</p>
<p>T(n) 的上下界不同，原因只在 n 的奇偶，和输入怎么排列无关：同一个 n 只有一种代价，谈不上最好或最坏情况。<strong>O、Ω、Θ 是函数的界；最好、最坏、平均情况（best / worst / average case）是挑哪一种输入。</strong>两者互相独立，每种情况各是一个函数，可以各有自己的 Θ（见 1.7 最好、最坏、平均情况）。</p>

<h2>判断题：先定 Θ 类，再比位置</h2>
<p>判断 “f ∈ O(g) / Ω(g) / Θ(g)” 时，先去掉 f 的常数系数和低阶项，得到它的 Θ 类 h，再在阶梯 1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; n! 上比较 h 和 g：</p>
<ul>
<li><strong>O</strong>：g 与 h 同级或在 h 右边，命题为真；</li>
<li><strong>Ω</strong>：g 与 h 同级或在 h 左边，命题为真；</li>
<li><strong>Θ</strong>：g 与 h 同级，命题才为真。</li>
</ul>
<table>
<thead><tr><th>命题</th><th>真假</th><th>理由</th></tr></thead>
<tbody>
<tr><td>n² ∈ O(n³)</td><td>真</td><td>n³ 在 n² 右边，松的上界</td></tr>
<tr><td>n² ∈ Ω(n³)</td><td>假</td><td>Ω 要求 g 不在 h 右边</td></tr>
<tr><td>n² ∈ Ω(n)</td><td>真</td><td>c₀ = 1，n₀ = 1</td></tr>
<tr><td>n ∈ Ω(n²)</td><td>假</td><td>上文已反证</td></tr>
<tr><td>n² ∈ Ω(1)</td><td>真</td><td>松的下界</td></tr>
<tr><td>n log n ∈ Ω(n)</td><td>真</td><td>n ≥ 2 时 log₂ n ≥ 1，取 c₀ = 1</td></tr>
<tr><td>3n + 3 ∈ Θ(n²)</td><td>假</td><td>属于 O(n²)，不属于 Ω(n²)</td></tr>
<tr><td>100n² + 5n ∈ Θ(n²)</td><td>真</td><td>c₁ = 100，c₂ = 105，n₀ = 1</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
<li><strong>判断、单选、多选</strong>：给一组 O、Ω、Θ 命题挑真或挑假，第 2 周课堂竞赛、第 4 周小测和期末复习课的 trivia 都出过。课上特别提醒：<strong>作答前先看清是 O 还是 Ω</strong>。</li>
<li><strong>短证明</strong>：期末复习课要求会写三个定义，并给出常数证明属于关系。Θ 写 c₁、c₂、n₀，Ω 写 c₀、n₀，再写一条对所有 n &gt; n₀ 成立的不等式链。证明“不属于”用反证：说明任何常数都会在足够大的 n 处失败。</li>
<li><strong>读代码</strong>：问一段程序的复杂度，选项里混着 O、Ω、Θ。先弄清代价是否随输入排列变化，再判断哪些界成立。</li>
<li><strong>必须背</strong>：三个定义（公式表上没有，公式表只有对数恒等式、求和公式、主定理和哈希估计）；f ∈ Ω(g) ⇔ g ∈ O(f)；Θ = O 且 Ω；O 类嵌套、Θ 类不相交；报告最近的上界、最大的下界。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>把 Ω 读成 O：n² ∈ O(n³) 为真，n² ∈ Ω(n³) 为假。</li>
<li>以为松的界是假命题：n² ∈ Ω(1)、n ∈ O(n!) 都为真，只是题目要求“最紧的界”时不能这样答。</li>
<li>常数取 0：Ω 取 c₀ = 0 时 f ≥ 0 对任何非负函数都成立，等于没证；O 取 c₀ = 0 则要求 f ≤ 0，本身就不成立。定义要求 c₀、c₁、c₂ 都大于 0。</li>
<li>把 O、Ω、Θ 等同于最坏、最好、平均情况。不指明情况时，“某算法是 Θ(g)” 要对所有输入都成立：二分查找最好情况只比较 1 次，所以 “二分查找是 Θ(log n)” 为假（见 1.7）。</li>
<li>Θ 只证了一边：只写出 f ≤ c₂·g，证明的只是 O。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 证明 5n² + 3n + 2 ∈ Θ(n²)，写出 c₁、c₂、n₀。</summary>
<div class="qa__body">
<p>取 n₀ = 1、c₁ = 5、c₂ = 10。对所有 n &gt; 1：</p>
<pre><code class="lang-text">下界  5n² ≤ 5n² + 3n + 2                       （3n + 2 &gt; 0）
上界  5n² + 3n + 2 ≤ 5n² + 3n² + 2n² = 10n²    （n &gt; 1 时 n ≤ n²，1 ≤ n²）
所以  5n² ≤ 5n² + 3n + 2 ≤ 10n²，即 5n² + 3n + 2 ∈ Θ(n²)。
</code></pre>
<p>c₁ 取 1（课上的写法）也对，c₂ 取任何不小于 10 的数也对。常数不唯一，要求的只是不等式链每一步都成立。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 证明 n² − 3n ∈ Θ(n²)。为什么这里 c₁ 不能取 1？</summary>
<div class="qa__body">
<p><strong>上界</strong>：n² − 3n ≤ n²，取 c₂ = 1。</p>
<p><strong>下界</strong>：c₁ = 1 要求 n² − 3n ≥ n²，即 −3n ≥ 0，对任何 n &gt; 0 都不成立，所以 c₁ 必须小于 1。取 c₁ = 1/2：n² − 3n ≥ n²/2 ⇔ n²/2 ≥ 3n ⇔ n ≥ 6。</p>
<p>于是取 n₀ = 6、c₁ = 1/2、c₂ = 1，对所有 n &gt; 6 有 ½·n² ≤ n² − 3n ≤ 1·n²。检查边界：n = 6 时 36 − 18 = 18，正好等于 ½·36；n = 5 时 10 &lt; 12.5，不成立。定义要求的是 n &gt; n₀，所以 n₀ 最小可以取 5（从 n = 6 起都成立），取 6 也对。c₁ 取得更小，n₀ 也能更小，例如 c₁ = 1/4 时 n ≥ 4 就成立。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 多选：下列哪些为真？(a) 100n + 7 ∈ Ω(n)　(b) n log n ∈ Θ(n)　(c) n³ ∈ Ω(n² log n)　(d) n² ∈ Θ(n² + n)　(e) n² ∈ Ω(n² log n)　(f) 若 p ∈ O(q) 且 q ∈ O(p)，则 p ∈ Θ(q)</summary>
<div class="qa__body">
<p>答案 <strong>(a)(c)(d)(f)</strong>。</p>
<ul>
<li>(a) 真：100n + 7 ≥ 100n，取 c₀ = 100、n₀ = 0。</li>
<li>(b) 假：它属于 Ω(n)，但不属于 O(n)。n log₂ n ≤ c₀·n 等价于 log₂ n ≤ c₀，n &gt; 2<sup>c₀</sup> 时失败（c₀ = 5 时 n = 33 就失败）。</li>
<li>(c) 真：n ≥ 1 时 n ≥ log₂ n，所以 n³ = n²·n ≥ n²·log₂ n，取 c₀ = 1、n₀ = 1。</li>
<li>(d) 真：g 不必是最简形式。n² ≤ 1·(n² + n)；n ≥ 1 时 n² ≥ n，所以 n² ≥ ½(n² + n)。取 c₁ = 1/2、c₂ = 1、n₀ = 1。</li>
<li>(e) 假：需要 n² ≥ c₀·n² log₂ n，即 log₂ n ≤ 1/c₀，n &gt; 2<sup>1/c₀</sup> 时失败（c₀ = 1/2 时 n = 5 就失败）。n² 的 Θ 类在 n² log n 左边，成立的是 n² ∈ O(n² log n)。</li>
<li>(f) 真：由对偶性，q ∈ O(p) 就是 p ∈ Ω(q)，再加上 p ∈ O(q)，即 p ∈ Θ(q)。</li>
</ul>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 已知 f(n) ∈ O(n²) 且 f(n) ∈ Ω(n)。下列哪些<strong>一定</strong>成立？A. f ∈ Θ(n²)　B. f ∈ O(n³)　C. f ∈ Ω(1)　D. f ∈ Θ(n)　E. f ∈ Θ(n log n)</summary>
<div class="qa__body">
<p>答案 <strong>B、C</strong>。</p>
<ul>
<li>B：n ≥ 1 时 n² ≤ n³，所以 f ≤ c₀·n² ≤ c₀·n³。O 类嵌套，O(n²) ⊂ O(n³)。</li>
<li>C：n ≥ 1 时 f ≥ c₀·n ≥ c₀·1。Ω 方向相反，Ω(n) ⊂ Ω(1)。</li>
<li>A、D、E 都可能不成立，各举一个满足条件的反例：f = n 满足两个条件，但不属于 Θ(n²) 和 Θ(n log n)；f = n² 也满足，但不属于 Θ(n)。上文的奇偶函数 T(n) 同样满足两个条件，而 A、D、E 一个都不成立。</li>
</ul>
<p>只知道上界和下界、而两者不同级时，推不出任何 Θ。</p>
</div>
</details>
`;
