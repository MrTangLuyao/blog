/* Post body — dsa-big-o / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-big-o:zh'] = `
<p class="lead">大 O（Big-O）给函数定一个上界：n 足够大以后，f(n) 不超过 g(n) 的某个常数倍。证明“属于”要写出两个常数 c₀、n₀ 并验证不等式；证明“不属于”要说明这样的常数根本不存在。</p>

<h2>从一个场景说起</h2>
<p>你刚开始工作，跟家里保证：“以后每个月的花销，不会超过工资的一半。”</p>
<p>这句话里有三样东西：拿什么来比（工资）、乘几（一半）、从什么时候算起（“以后”，刚搬家买家具的头几个月超了不算）。只要从某个月起，之后每个月都做到，这个保证就是真的。</p>
<p>大 O 说的是同一件事。把“每月花销”换成程序的操作次数 f(n)，把“工资”换成一个简单的函数 g(n)，比如 n²。</p>
<p>为什么需要它？用 1.3 的方法，你数出一个程序要做 n² + 2n + 8 次操作，另一个要做 4n² 次。课上说它俩“都是 O(n²)”。那多出来的 2n + 8、前面的系数 4 去哪了？看完定义就清楚了。</p>

<h2>它是什么</h2>
<p>简单说：<strong>f(n) ∈ O(g(n)) 的意思是，n 足够大以后，f(n) 不会超过 g(n) 的某个常数倍。</strong>它是一个上界（upper bound）。</p>
<div class="callout key" data-label="考点">
<p><strong>f(n) ∈ O(g(n))</strong> 当且仅当存在常数 <strong>c₀ &gt; 0</strong> 和 <strong>n₀</strong>，使得对<strong>所有 n &gt; n₀</strong>，都有 <strong>f(n) ≤ c₀·g(n)</strong>。</p>
<p>这个定义<strong>不在公式表上</strong>，要背。把 ≤ 写成 &lt; 课上也接受。</p>
</div>
<p>拆开看是三个部分，正好对上那句保证：</p>
<ul>
<li><strong>c₀：乘几</strong>（“一半”）。c₀ 由你挑，可以挑得很大，但必须大于 0。既然能乘常数，g 前面的系数就无所谓了：O(3n²) 和 O(n²) 是一回事，习惯只写 O(n²)。</li>
<li><strong>n₀：从哪儿算起</strong>（“以后”）。把它想成一条竖线：竖线左边 f(n) 比 c₀·g(n) 大也没关系，竖线右边必须一直压得住，直到无穷。</li>
<li><strong>f(n) ≤ c₀·g(n)：压得住</strong>（“不超过”）。只管上面，不管 f 比 c₀·g 小多少。</li>
</ul>
<p>所以证明 f ∈ O(g)，就是<strong>写出一组具体的 c₀ 和 n₀，再说明不等式对所有 n &gt; n₀ 成立</strong>。常数不唯一，找到一组就够。</p>

<h2>看个例子</h2>
<h3>例 1：4n² ∈ O(n²)</h3>
<p>f(n) = 4n²，g(n) = n²。乘数只要不小于 4，n² 就能追上。课上取“系数加 1”：</p>
<pre><code class="lang-text">取 c₀ = 5，n₀ = 0。
对所有 n &gt; 0：4n² ≤ 5n² = c₀·n²。
由定义，4n² ∈ O(n²)。</code></pre>
<p>没有别的项，从一开始就成立，所以 n₀ = 0。c₀ = 4 其实也行，因为定义用的是 ≤。</p>

<h3>例 2：n² + 2n + 8 ∈ O(n²)</h3>
<p>这次 f(n) 永远比 n² 多出 2n + 8，n² 本身压不住它。那给 n² 乘个常数试试：</p>
<table>
<thead><tr><th>n</th><th>f(n)</th><th>n²</th><th>2n²</th><th>3n²</th></tr></thead>
<tbody>
<tr><td>1</td><td>11</td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>2</td><td>16</td><td>4</td><td>8</td><td>12</td></tr>
<tr><td>3</td><td>23</td><td>9</td><td>18</td><td>27</td></tr>
<tr><td>4</td><td>32</td><td>16</td><td>32</td><td>48</td></tr>
<tr><td>5</td><td>43</td><td>25</td><td>50</td><td>75</td></tr>
<tr><td>10</td><td>128</td><td>100</td><td>200</td><td>300</td></tr>
</tbody>
</table>
<p>3n² 从 n = 3 起超过 f(n)；2n² 在 n = 4 追平，之后一直领先；n² 永远落后。原因是 f(n)/n² = 1 + 2/n + 8/n²，n 越大越接近 1。所以<strong>乘数只要大于 1，n 够大时就压得住</strong>，而且 c₀ 越大追上得越早，n₀ 就能越小。</p>
<p>考试不用列表，有个固定技巧：<strong>先取 n₀ = 1</strong>。n ≥ 1 时 1 ≤ n ≤ n²，每个低阶项都能“升级”成 n² 项，只会变大：</p>
<pre><code class="lang-text">取 n₀ = 1，c₀ = 1 + 2 + 8 = 11。
对所有 n &gt; 1，有 n ≤ n² 且 1 ≤ n²，所以
    2n ≤ 2n²
     8 ≤ 8n²
相加：n² + 2n + 8 ≤ n² + 2n² + 8n² = 11n² = c₀·n²。
由定义，n² + 2n + 8 ∈ O(n²)。</code></pre>
<p>逐行看：第 1 行亮出常数；第 2 行说明 n &gt; 1 时 n 和 1 都不超过 n²；第 3、4 行把 2n 换成 2n²、8 换成 8n²；第 5 行相加得到 11n²；最后按定义下结论。</p>
<p>c₀ = 11 比必要的大（表里 c₀ = 2、n₀ = 4 就够），但定义只要求“存在”，取宽一点反而最好证。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-big-o/anims/big-o-constants.html" loading="lazy" style="height: 520px;" title="大 O：找 c₀ 和 n₀"></iframe>
<p class="anim-caption">选一个例子，拖动 c₀ 和 n₀：橙线是 f(n)，蓝线是 c₀·g(n)。n₀ 左边 f 超出的部分标黄，不管；n₀ 右边还超出就标红，这组常数无效。“取最小 n₀”给出当前 c₀ 下最小可取的 n₀。最后一个例子（n² 与 n）c₀ 取多少都会出红。</p>

<h2>两条规则：去掉常数和低阶项</h2>
<p>把两个例子推广，就是判断大 O 时天天用的两条规则：</p>
<ul>
<li><strong>去掉常数因子（constant factor）</strong>：k &gt; 0 时 k·g(n) ∈ O(g(n))。取 c₀ = k + 1，n₀ = 0，就是例 1。</li>
<li><strong>去掉低阶项（lower-order terms）</strong>：系数都非负的多项式属于 O(最高次幂)。<strong>取 n₀ = 1，c₀ = 所有系数之和</strong>，就是例 2。比如 n ≥ 1 时 n² + n ≤ n² + n² = 2n²，所以 n² + n ∈ O(n²)。</li>
</ul>
<p>合起来一句话：<strong>只留最高阶项（dominant term），再把它的系数也去掉。</strong>4n²、n² + n、n² + 2n + 8 都是 O(n²)。</p>
<div class="callout warn" data-label="易错">
<p>有负系数时不能直接把系数相加。3n² − 5n + 2 的系数和是 0，而 c₀ 必须大于 0。正确做法是<strong>先把负项丢掉</strong>：丢掉只会让式子变大，对上界没坏处。n ≥ 1 时 3n² − 5n + 2 ≤ 3n² + 2 ≤ 3n² + 2n² = 5n²，取 c₀ = 5，n₀ = 1。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/A03oI0znAoc" title="1.8.1 Asymptotic Notations Big Oh - Omega - Theta #1" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《1.8.1 Asymptotic Notations Big Oh - Omega - Theta #1》（英文，约 16 分钟）。先讲大 O 的定义、怎么找常数 c 和 n₀，以及一个函数有很多上界时该报最接近的那个；后面的 Ω 和 Θ 见 1.5。视频里写 n ≥ n₀，课上写 n &gt; n₀，对证明没有影响。</p>

<h2>上界可以很松：O(g) 是一个集合</h2>
<p>定义里写的是 ∈（属于），不是 =。因为 O(g(n)) 是一个<strong>函数的集合</strong>：所有从某处起能被 c₀·g(n) 压住的函数都在里面。教科书常写 f(n) = O(g(n))，意思一样。</p>
<p>大 O 只要求压得住，不要求压得紧。课上投票过：n² ∈ O(n³) 吗？<strong>对</strong>。取 c₀ = 1、n₀ = 1，n ≥ 1 时 n² ≤ n³。同理 n² 也属于 O(n⁴)、O(2ⁿ)、O(n!)。这些集合一层套一层（O(n²) ⊂ O(n³) ⊂ …），详见 1.5。</p>
<p>这些上界都对，但没用，就像快递公司说所有包裹“1000 年内送达”。所以约定：<strong>报告最紧（closest / tightest）的上界，并写成最简形式</strong>。n² + 2n + 8 答 O(n²)，不答 O(n³)，也不答 O(n² + 2n + 8)。</p>

<h2>怎么证明“不属于”</h2>
<p>要证 f ∉ O(g)，举一组不行的常数不够。你得说明<strong>不管 c₀ 取多大、n₀ 取多大，都不行</strong>。标准写法是反证法（proof by contradiction）。</p>
<p>以 n² ∉ O(n) 为例。先看直觉：n² ≤ c₀·n 两边除以 n，就是 n ≤ c₀。c₀ 再大也是个固定的数，n 一路往上走，总会越过它。写成证明：</p>
<pre><code class="lang-text">假设存在 c₀ &gt; 0 和 n₀，使所有 n &gt; n₀ 都有 n² ≤ c₀·n。
两边除以 n（n &gt; 0）：所有 n &gt; n₀ 都有 n ≤ c₀。
取 n = ⌈max(n₀, c₀)⌉ + 1：它大于 n₀，却也大于 c₀，矛盾。
所以这样的 c₀、n₀ 不存在，n² ∉ O(n)。</code></pre>
<p>第 1 行假设常数存在；第 2 行化简成 n ≤ c₀；第 3 行挑一个比 n₀ 和 c₀ 都大的 n，它本该满足不等式，偏偏不满足；所以假设错了。</p>
<p>一般规律（g(n) &gt; 0 时）：<strong>f ∈ O(g) 当且仅当 f(n)/g(n) 从某处起有上限</strong>。比值一直涨、没有天花板，就不属于。同理 n³ ∉ O(n²)。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>证明题</strong>：最后一讲复习明确说要会用定义证明类似 f(n) ∈ O(n²) 的结论。按“亮出 c₀、n₀ → 不等式链 → 按定义下结论”三步写。</li>
<li><strong>判断 / 多选</strong>：如 n² ∈ O(n³)（对，只是不紧）、n³ ∈ O(n²)（错）。动笔前看清题目写的是 O 还是 Ω，课上专门提醒过（Ω 见 1.5）。</li>
<li><strong>写复杂度</strong>：往年题都要“最接近的上界”，答最紧、最简的形式，如 O(n²)。</li>
</ul>
<p>定义要背：公式表上有对数恒等式、求和公式、主定理和散列的估计式，没有 O、Ω、Θ 的定义。</p>

<h3>例题 1：用定义证明 5n³ + 2n² + 7 ∈ O(n³)</h3>
<p>多项式、系数都非负，直接套“n₀ = 1，c₀ = 系数和”：</p>
<pre><code class="lang-text">取 n₀ = 1，c₀ = 5 + 2 + 7 = 14。
对所有 n &gt; 1，有 n² ≤ n³ 且 1 ≤ n³，所以
    2n² ≤ 2n³
      7 ≤ 7n³
相加：5n³ + 2n² + 7 ≤ 5n³ + 2n³ + 7n³ = 14n³ = c₀·n³。
由定义，5n³ + 2n² + 7 ∈ O(n³)。</code></pre>
<p>如果题目规定 c₀ = 6，n₀ 就不能随手写 1：n = 2 时左边是 5·8 + 2·4 + 7 = 55，右边 6·8 = 48，压不住。要让 5n³ + 2n² + 7 ≤ 6n³，移项得 n²(n − 2) ≥ 7。n &gt; 3 时 n² &gt; 9、n − 2 &gt; 1，乘积大于 9，成立，所以取 n₀ = 3。</p>

<h3>例题 2：判断对错</h3>
<p>(a) 100n + 5 ∈ O(n²)；(b) n³/1000 ∈ O(n²)；(c) 若 f(n) ∈ O(n²)，则 f(n) ∈ O(n³)。</p>
<ul>
<li>(a) <strong>对</strong>。n ≥ 1 时 100n + 5 ≤ 100n² + 5n² = 105n²，取 c₀ = 105，n₀ = 1。只是不紧，最紧的是 O(n)。</li>
<li>(b) <strong>错</strong>。n³/1000 ≤ c₀·n² 化简成 n ≤ 1000c₀，n 一过 1000c₀ 就不成立，c₀ 取多大都一样。系数 1/1000 再小，也改变不了 n³ 的阶。</li>
<li>(c) <strong>对</strong>。已知 n &gt; n₀ 时 f(n) ≤ c₀n²，而 n ≥ 1 时 n² ≤ n³。沿用同一个 c₀，把 n₀ 换成 max(n₀, 1)，就有 f(n) ≤ c₀n³。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>① c₀ 必须大于 0，c₀ = 0 或负数都不合法。② 证“不属于”时，只写“取 c₀ = 2，n = 3 时 9 &gt; 6”不算数：照这个逻辑还能“证明” 4n² ∉ O(n²)。必须对所有 c₀、n₀ 推出矛盾。③ n ≤ n₀ 那一段不受约束，f 在那里更大不影响结论。④ 大 O 是函数的上界，和“最坏情况”是两回事（见 1.7）。</p>
</div>

<h2>小结</h2>
<ul>
<li>f(n) ∈ O(g(n))：存在 c₀ &gt; 0 和 n₀，对所有 n &gt; n₀ 都有 f(n) ≤ c₀·g(n)。定义要背。</li>
<li>证明属于：写出一组 c₀、n₀，再写不等式链。多项式取 n₀ = 1、c₀ = 系数和，负项先丢掉。</li>
<li>证明不属于：用反证法，对任意 c₀、n₀ 推出矛盾；直觉是 f(n)/g(n) 没有上限。</li>
<li>常数因子和低阶项不影响大 O，只看最高阶项。</li>
<li>大 O 可以很松（n² ∈ O(n³) 是对的），但答题要报最紧、最简的上界。</li>
</ul>
`;
