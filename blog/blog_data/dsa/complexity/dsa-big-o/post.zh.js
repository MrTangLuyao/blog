/* Post body — dsa-big-o / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-big-o:zh'] = `
<p class="lead">大 O（Big-O）给函数一个<strong>上界（upper bound）</strong>：f(n) ∈ O(g(n)) 表示 n 足够大以后，g(n) 乘上某个常数就能压住 f(n)。证明属于，就是写出常数 c₀ 和起点 n₀ 并验证不等式；证明不属于，要说明 c₀ 取多大都找不到 n₀。</p>

<h2>从一个例子看“上界”</h2>
<p>比较 f(n) = n² + 2n + 8 和 n²。f(n) 永远比 n² 多出 2n + 8，n² 本身压不住它。但只要允许给 n² 乘一个常数，情况就变了：</p>

<table>
<thead><tr><th>n</th><th>f(n)</th><th>n²</th><th>2n²</th><th>3n²</th><th>f(n)/n²</th></tr></thead>
<tbody>
<tr><td>1</td><td>11</td><td>1</td><td>2</td><td>3</td><td>11</td></tr>
<tr><td>2</td><td>16</td><td>4</td><td>8</td><td>12</td><td>4</td></tr>
<tr><td>3</td><td>23</td><td>9</td><td>18</td><td>27</td><td>2.56</td></tr>
<tr><td>4</td><td>32</td><td>16</td><td>32</td><td>48</td><td>2</td></tr>
<tr><td>5</td><td>43</td><td>25</td><td>50</td><td>75</td><td>1.72</td></tr>
<tr><td>10</td><td>128</td><td>100</td><td>200</td><td>300</td><td>1.28</td></tr>
</tbody>
</table>

<p>3n² 从 n = 3 起超过 f(n)；2n² 在 n = 4 追平，之后一直更大。原因在最后一列：f(n)/n² = 1 + 2/n + 8/n²，随 n 增大从上方逼近 1。所以乘数只要大于 1，n 够大时 c·n² 一定压得住 f(n)；乘数等于 1 则永远不行。小 n 时谁大无关紧要，大 O 只关心 <strong>n 趋于无穷时的增长</strong>。</p>

<h2>正式定义</h2>
<div class="callout key" data-label="考点">
<p><strong>f(n) ∈ O(g(n))</strong> 当且仅当存在常数 <strong>c₀ &gt; 0</strong> 和 <strong>n₀</strong>，使得对<strong>所有 n &gt; n₀</strong>，都有 <strong>f(n) ≤ c₀·g(n)</strong>。</p>
<p>这个定义<strong>不在公式表上</strong>，要背。本课程 ≤ 和 &lt; 两种写法都接受：需要严格不等号时，把 c₀ 再调大一点即可。</p>
</div>
<p>两个常数各管一件事：</p>
<ul>
<li><strong>c₀ 把 g 整体放大</strong>。所以 g 前面的常数系数无关紧要，O(3n²) 和 O(n²) 是同一个类，习惯只写 O(n²)。</li>
<li><strong>n₀ 是一条竖线</strong>。竖线左边 f(n) 比 c₀·g(n) 大也没关系；竖线右边 c₀·g(n) 必须处处不低于 f(n)，一直到无穷。</li>
</ul>
<p>这两个常数<strong>不唯一</strong>，证明时找到任意一组就够。仍以 f(n) = n² + 2n + 8、g(n) = n² 为例，解方程 c₀n² = f(n) 得到交点，n₀ 取交点或它右边的任何数都行：</p>

<table>
<thead><tr><th>c₀</th><th>c₀n² 追上 f(n) 的位置</th><th>可取的 n₀（举例）</th></tr></thead>
<tbody>
<tr><td>1</td><td>追不上：f(n) − n² = 2n + 8 &gt; 0</td><td>不存在</td></tr>
<tr><td>1.5</td><td>n ≈ 6.47</td><td>7</td></tr>
<tr><td>2</td><td>n = 4</td><td>4</td></tr>
<tr><td>3</td><td>n ≈ 2.56</td><td>3</td></tr>
<tr><td>5</td><td>n ≈ 1.69</td><td>2</td></tr>
<tr><td>11</td><td>n = 1</td><td>1（课上的取法）</td></tr>
</tbody>
</table>
<p><strong>c₀ 越大，n₀ 可以越小；c₀ 太小则 n₀ 根本不存在。</strong></p>

<iframe class="anim-frame" src="blog/blog_data/dsa-big-o/anims/big-o-constants.html" loading="lazy" style="height: 520px;" title="大 O：找 c₀ 和 n₀"></iframe>
<p class="anim-caption">选一个例子，拖动 c₀ 和 n₀：橙线是 f(n)，蓝线是 c₀·g(n)，灰色区域 n ≤ n₀ 不作要求；出现红色说明 n₀ 右边 f 仍然超出，这组常数无效。“取最小 n₀”给出当前 c₀ 下 n₀ 的最小可取值。最后一个例子里 c₀ 取多少都会被判无效。</p>

<h2>证明 f ∈ O(g) 的写法</h2>
<p>答题分三步：<strong>写出 c₀、n₀ 的具体值 → 写出对所有 n &gt; n₀ 成立的不等式链 → 按定义下结论</strong>。课上的两个例子：</p>

<h3>例 1：4n² ∈ O(n²)</h3>
<pre><code class="lang-text">取 c₀ = 5，n₀ = 0。
对所有 n &gt; 0：4n² ≤ 5n² = c₀·n²。
由定义，4n² ∈ O(n²)。</code></pre>
<p>没有低阶项（lower-order terms），c₀ 取系数加 1 即可。取 c₀ = 4 也对，因为定义用的是 ≤。</p>

<h3>例 2：n² + 2n + 8 ∈ O(n²)</h3>
<p>标准技巧是<strong>先取 n₀ = 1</strong>：n ≥ 1 时 1 ≤ n ≤ n²，每个低阶项都能换成同系数的 n² 项。</p>
<pre><code class="lang-text">取 n₀ = 1，c₀ = 1 + 2 + 8 = 11。
对所有 n &gt; 1，有 n ≤ n² 且 1 ≤ n²，所以
    2n ≤ 2n²
     8 ≤ 8n²
相加：n² + 2n + 8 ≤ n² + 2n² + 8n² = 11n² = c₀·n²。
由定义，n² + 2n + 8 ∈ O(n²)。</code></pre>
<p>c₀ = 11 比必要的大很多（上表中 c₀ = 2 就够），但定义只要求存在，取得宽松些反而好证。</p>

<h2>两条规则：去掉常数因子和低阶项</h2>
<p>把两个例子推广，就是判断大 O 类别时用的两条规则：</p>
<ul>
<li><strong>常数因子（constant factor）不影响类别</strong>：k &gt; 0 时 k·g(n) ∈ O(g(n))，取 c₀ = k（或 k + 1），n₀ = 0。</li>
<li><strong>低阶项不影响类别</strong>：系数都非负的多项式 a<sub>d</sub>n<sup>d</sup> + … + a<sub>1</sub>n + a<sub>0</sub> ∈ O(n<sup>d</sup>)，取 <strong>n₀ = 1，c₀ = 所有系数之和</strong>，因为 n ≥ 1 时每个 n<sup>i</sup> ≤ n<sup>d</sup>（i ≤ d）。例如 n ≥ 1 时 n² + n ≤ n² + n² = 2n²，所以 n² + n ∈ O(n²)，c₀ = 2，n₀ = 1。</li>
</ul>
<p>两条合起来：<strong>只有最高阶项（dominant term）决定类别，连它的系数也去掉</strong>。所以 4n²、n² + n、n² + 2n + 8 都写作 O(n²)。</p>

<div class="callout warn" data-label="易错">
<p>有负系数时不能把系数直接相加。3n² − 5n + 2 的系数和是 3 − 5 + 2 = 0，而 c₀ = 0 违反 c₀ &gt; 0。正确做法：<strong>负项直接丢掉</strong>，它只会让 f 变小，对上界有利。n ≥ 1 时 3n² − 5n + 2 ≤ 3n² + 2 ≤ 3n² + 2n² = 5n²，取 c₀ = 5，n₀ = 1。</p>
</div>

<h2>O(g) 是集合：松的上界与最紧上界</h2>
<p>写 ∈ 而不写 =，是因为 O(g(n)) 是一个<strong>函数的集合</strong>：所有从某处起能被 c₀·g(n) 压住的 f(n)。教科书常写 f(n) = O(g(n))，意思相同。</p>
<p>大 O 只要求压得住，不要求压得紧。课上的投票题：n² ∈ O(n³) 吗？<strong>对</strong>。取 c₀ = 1、n₀ = 1，n ≥ 1 时 n² ≤ n³。同理 n² ∈ O(n⁴)、O(2ⁿ)、O(n!) 也都成立。这些上界没错，但没用，就像所有快递选项都标着“1000 年内送达”。所以约定<strong>报告最紧（closest / tightest）的上界，并写成最简形式</strong>：n² + 2n + 8 答 O(n²)，不答 O(n³)，也不答 O(n² + 2n + 8)。O 的各个类一层套一层（O(n²) ⊂ O(n³) ⊂ …），详见 1.5 Ω 与 Θ。</p>

<h2>证明 f ∉ O(g)</h2>
<p>否定 f ∈ O(g)，要说明<strong>任何</strong> c₀ &gt; 0 配上<strong>任何</strong> n₀ 都不行，只举一组失败的常数不算证明。标准写法是反证法（proof by contradiction），以 n² ∉ O(n) 为例：</p>
<pre><code class="lang-text">假设存在 c₀ &gt; 0 和 n₀，使所有 n &gt; n₀ 都有 n² ≤ c₀·n。
两边除以 n（n &gt; 0）：所有 n &gt; n₀ 都有 n ≤ c₀。
取 n = ⌈max(n₀, c₀)⌉ + 1：它满足 n &gt; n₀，却有 n &gt; c₀，矛盾。
所以这样的 c₀、n₀ 不存在，n² ∉ O(n)。</code></pre>
<p>直觉：n²/n = n 没有上界，c₀ 取多大，n 一过 c₀ 就超出。一般地，g(n) &gt; 0 时 f(n) ≤ c₀·g(n) 等价于 f(n)/g(n) ≤ c₀，所以<strong>f ∈ O(g) 当且仅当 f(n)/g(n) 从某处起有上界</strong>；比值无限增大就不属于。同样的论证给出 n³ ∉ O(n²)、n ∉ O(log n)。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>证明题</strong>：最后一讲复习明确要求会用定义证明类似 f(n) ∈ O(n²) 的结论。按上面的三步格式写；多项式直接取 n₀ = 1、c₀ = 系数和，负项先丢掉。</li>
<li><strong>判断 / 多选</strong>：n² ∈ O(n³)（对，只是不紧）、n³ ∈ O(n²)（错）、2n + 3 ∈ O(n²)（对）。动笔前先看清题目写的是 O 还是 Ω，这是课上点名的陷阱（Ω 见 1.5）。</li>
<li><strong>写复杂度</strong>：往年试卷的复杂度题都要求给出“最接近的上界”，答最紧、最简的形式，如 O(n²)，不写 O(3n² + n)，也不写 O(n³)。</li>
<li><strong>要背的</strong>：定义本身。公式表上只有对数恒等式、求和公式、主定理和散列的估计式，没有 O、Ω、Θ 的定义。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① c₀ 必须 &gt; 0，c₀ = 0 不合法。② 否定时要对所有 c₀、n₀ 都推出矛盾。③ n ≤ n₀ 的部分不受约束，那里 f 更大不影响结论。④ 大 O 是函数的上界，和“最坏情况”是两回事（见 1.7 最好、最坏、平均情况）。</p>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 用定义证明 5n³ + 2n² + 7 ∈ O(n³)。再验证 c₀ = 6、n₀ = 3 也是一组有效常数。</summary>
  <div class="qa__body">
<pre><code class="lang-text">取 n₀ = 1，c₀ = 5 + 2 + 7 = 14。
对所有 n &gt; 1，有 n² ≤ n³ 且 1 ≤ n³，所以
    2n² ≤ 2n³
      7 ≤ 7n³
相加：5n³ + 2n² + 7 ≤ 5n³ + 2n³ + 7n³ = 14n³ = c₀·n³。
由定义，5n³ + 2n² + 7 ∈ O(n³)。</code></pre>
<p>验证 c₀ = 6、n₀ = 3：5n³ + 2n² + 7 ≤ 6n³ 等价于 n³ − 2n² ≥ 7，即 n²(n − 2) ≥ 7。n &gt; 3 时 n² &gt; 9 且 n − 2 &gt; 1，所以 n²(n − 2) &gt; 9 ≥ 7，成立。</p>
<p>c₀ = 6 时交点约在 n ≈ 2.86，所以 n₀ 不能太小：取 n₀ = 1 的话，n = 2 就是反例，5·8 + 2·4 + 7 = 55 &gt; 6·8 = 48。</p>
  </div>
</details>

<p>第 2 题的函数：</p>
<pre><code>int count_zero_pairs(const int A[], int n) {
    int count = 0;
    for (int i = 0; i &lt; n; i++) {
        for (int j = i + 1; j &lt; n; j++) {
            if (A[i] + A[j] == 0) {
                count++;
            }
        }
    }
    return count;
}</code></pre>
<details class="qa">
  <summary class="ripple-surface">2. 对上面的 count_zero_pairs：(a) if 里的比较一共执行多少次？记为 T(n)。(b) 用定义证明 T(n) ∈ O(n²)。(c) 证明 T(n) ∉ O(n)。</summary>
  <div class="qa__body">
<p>(a) i 固定时，j 从 i + 1 走到 n − 1，比较 n − 1 − i 次。i = 0, 1, …, n − 1 依次是 n − 1, n − 2, …, 1, 0 次，合计 T(n) = (n − 1) + (n − 2) + … + 1 + 0 = <strong>n(n − 1)/2</strong>（公式表上的等差数列求和，上限取 n − 1）。例如 n = 4 时 3 + 2 + 1 + 0 = 6。</p>
<p>(b) T(n) = n²/2 − n/2，负项丢掉：对所有 n &gt; 0，T(n) ≤ n²/2。取 c₀ = 1/2，n₀ = 0，所以 T(n) ∈ O(n²)。c₀ 不必是整数，取 c₀ = 1 也对。</p>
<p>(c) 反证。设存在 c₀ &gt; 0 和 n₀，使所有 n &gt; n₀ 都有 n(n − 1)/2 ≤ c₀·n。两边除以 n 得 (n − 1)/2 ≤ c₀，即 n ≤ 2c₀ + 1。取 n = ⌈max(n₀, 2c₀ + 1)⌉ + 1，它满足 n &gt; n₀，却有 n &gt; 2c₀ + 1，矛盾。所以 T(n) ∉ O(n)。</p>
  </div>
</details>

<details class="qa">
  <summary class="ripple-surface">3. 判断对错并给出理由：(a) 100n + 5 ∈ O(n²)；(b) n log₂ n ∈ O(n²)；(c) n³/1000 ∈ O(n²)；(d) 若 f(n) ∈ O(n²)，则 f(n) ∈ O(n³)。</summary>
  <div class="qa__body">
<p>(a) <strong>对</strong>。n ≥ 1 时 100n + 5 ≤ 100n² + 5n² = 105n²，c₀ = 105，n₀ = 1。这个上界不紧，最紧的是 O(n)。</p>
<p>(b) <strong>对</strong>。n ≥ 1 时 log₂ n ≤ n，两边乘 n 得 n log₂ n ≤ n²，c₀ = 1，n₀ = 1。</p>
<p>(c) <strong>错</strong>。n³/1000 ≤ c₀n² 等价于 n ≤ 1000c₀，n 一过 1000c₀ 就不成立，c₀ 取多大都一样。系数 1/1000 改变不了 n³ 的阶。</p>
<p>(d) <strong>对</strong>。设 n &gt; n₀ 时 f(n) ≤ c₀n²。n ≥ 1 时 n² ≤ n³，所以沿用同一个 c₀，把 n₀ 换成 max(n₀, 1)，就有 f(n) ≤ c₀n³。</p>
  </div>
</details>

<details class="qa">
  <summary class="ripple-surface">4. 指出两份证明的错误并改正。(a) 要证 n² ∉ O(n)：“取 c₀ = 2，n = 3 时 n² = 9 &gt; 2·3 = 6，所以 n² ∉ O(n)。”(b) 要证 2n² − 3n ∈ O(n²)：“取 n₀ = 1，c₀ = 2 + (−3) = −1。”</summary>
  <div class="qa__body">
<p>(a) 只说明了 c₀ = 2 这一组常数不行。否定需要对<strong>每一个</strong> c₀ 和 n₀ 都找到反例。照这个写法，“取 c₀ = 2，n = 3 时 4n² = 36 &gt; 2n² = 18”就能“证明” 4n² ∉ O(n²)，显然荒谬。改正：用反证法，对任意 c₀、n₀ 取 n = ⌈max(n₀, c₀)⌉ + 1 推出矛盾（见“证明 f ∉ O(g)”一节）。</p>
<p>(b) c₀ = −1 违反 c₀ &gt; 0，而且 2n² − 3n ≤ −n² 在 n &gt; 1 时根本不成立。改正：丢掉负项，n &gt; 0 时 2n² − 3n ≤ 2n²，取 c₀ = 2，n₀ = 0。</p>
  </div>
</details>
`;
