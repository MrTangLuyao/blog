/* Post body — dsa-algorithm-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-algorithm-basics:zh'] = `
<p class="lead">算法（algorithm）就是完成一项任务的一串步骤；交给计算机的算法还要步骤精确、输入输出明确、高效、正确。判断对错时，一个反例就能推翻一个算法，课上“电影明星排档期”的三条贪心规则里，有两条就是这样被推翻的。</p>

<h2>从一个场景说起</h2>
<p>菜谱上常写“加少许糖”。你照着做没问题，计算机却做不了：“少许”到底是多少？</p>
<p>课上还问过：怎么把 1 美元变成 100 万美元？下面四个方案听上去都“能成”，但各有毛病：</p>
<table>
<thead><tr><th>方案</th><th>结果</th><th>毛病</th></tr></thead>
<tbody>
<tr><td>存银行，年利率 5%，一直等</td><td>约 283 年后成功（1.05ⁿ = 10⁶，n ≈ 283）</td><td>太慢</td></tr>
<tr><td>同时存进 2000 万家银行，每家一年给 5 美分利息</td><td>一年后凑够 100 万</td><td>要用到不存在的资源</td></tr>
<tr><td>买彩票</td><td>可能中奖</td><td>结果没有保证</td></tr>
<tr><td>请每个墨尔本人给 1 美元</td><td>能成</td><td>依赖很强的假设</td></tr>
</tbody>
</table>
<p>它们都是一串步骤，却没有一个是好算法。那合格的计算机算法要满足什么？</p>

<h2>它是什么</h2>
<p>简单说，<strong>算法就是完成一项任务的一串步骤</strong>。两数相加、做菜、洗衣服都算。交给计算机的算法要求更严，课上列了五条：</p>
<ol>
<li><strong>步骤精确（precise steps）</strong>：每一步只有一种理解。“加少许糖”不合格。</li>
<li><strong>输入明确（input）</strong>：接受什么数据、取值范围多大。</li>
<li><strong>输出明确（output）</strong>：返回什么、要满足什么条件。</li>
<li><strong>高效（efficiency）</strong>：在合理的时间内结束，也不超出机器的内存，<strong>时间和空间都算</strong>。存银行 283 年是太慢，2000 万家银行是要了不存在的资源。“合理”看问题而定：两数相加该毫秒出结果，算火箭轨道花几天也行。</li>
<li><strong>正确（correctness）</strong>：对每个合法输入都给出符合要求的输出。买彩票就没有这个保证。</li>
</ol>
<div class="callout key" data-label="考点">五条要能逐条说出，并判断一个方案违反了哪条。最容易漏的：<strong>效率包括空间</strong>。</div>

<h2>看个例子：电影明星排档期</h2>
<p>一位新演员想接尽量多的戏。每部戏占一段固定时间，同一时刻只能拍一部。先把输入输出写清楚：</p>
<ul>
<li><strong>输入</strong>：n 个区间，[s, f] 表示一部戏从时刻 s 拍到 f（s &lt; f）。</li>
<li><strong>输出</strong>：一组<strong>两两不重叠</strong>、<strong>个数最多</strong>的区间。</li>
</ul>
<p>这叫<strong>区间调度（interval scheduling）</strong>。有共同时段才算重叠，一部结束时另一部正好开始不算。</p>
<p>蛮力（brute force）把 2ⁿ 种选法全试一遍，一定对，但 n = 50 时就有约 1.1 × 10¹⁵ 种，太慢。课上改用贪心（greedy）：每步只挑眼下看起来最好的一个，挑了不反悔。三条候选规则共用一个循环，只是“挑哪个”不同：</p>
<pre><code class="lang-text">while 还有剩余区间:
    按规则从剩余区间里挑一个 x，放进答案
    删掉 x 以及所有与 x 重叠的区间</code></pre>
<table>
<thead><tr><th>规则</th><th>每次挑</th><th>直觉</th></tr></thead>
<tbody>
<tr><td>1 最早开始优先（earliest start first）</td><td>s 最小的</td><td>尽早开工</td></tr>
<tr><td>2 最短优先（shortest job first）</td><td>f − s 最小的</td><td>占用时间少</td></tr>
<tr><td>3 最早结束优先（earliest finish first）</td><td>f 最小的</td><td>尽早空出档期</td></tr>
</tbody>
</table>

<iframe class="anim-frame" src="blog/blog_data/dsa-algorithm-basics/anims/interval-greedy.html" loading="lazy" style="height: 520px;" title="区间调度：三条贪心规则逐步演示"></iframe>
<p class="anim-caption">在“实例”里选一组区间、在“规则”里选一条，再逐步播放。橙色是这一步挑中的，红色是因重叠被删掉的，最后一帧的蓝色虚线框是最优解。前两个实例就是下面的两个反例。</p>

<h3>规则 1、2 各被一个反例推翻</h3>
<p><strong>规则 1 的反例</strong>：A[0,10]、B[1,2]、C[3,4]、D[5,6]。A 开始最早，先被选中；它太长，B、C、D 都和它重叠被删掉。结果 1 部，而 {B, C, D} 有 3 部。</p>
<p><strong>规则 2 的反例</strong>：A[0,5]、B[4,7]、C[6,11]。B 最短（长 3），先被选中；它正好横跨 A 和 C，两个都被删掉。结果 1 部，而 {A, C} 有 2 部。</p>
<p>注意规则 1 在第二个实例、规则 2 在第一个实例上都碰巧选对了。所以<strong>几个例子选对说明不了什么，一个例子选错就足以推翻</strong>。</p>

<h3>规则 3 为什么一定对</h3>
<p>直觉：<strong>先接结束最早的戏，留给后面的时间最多。</strong></p>
<p>课上的论证叫交换论证（exchange argument）。设 g 是全体区间里结束最早的。任取一个最优解，把其中结束最早的那部换成 g：其余的戏都在被换掉那部结束后才开始，g 结束得不比它晚，所以不冲突；个数不变，仍是最优解。可见第一步选 g 不吃亏。删掉和 g 重叠的区间后，剩下的是同样的问题，一步步推下去，每步都不吃亏。</p>
<p>实现时不用每轮都扫一遍剩余区间（那样最坏 O(n²)）：<strong>先按结束时刻排序，再从头扫</strong>，开始时刻不早于上一个已选区间的结束时刻就选。排序 O(n log n) 加扫描 O(n)，共 <strong>O(n log n)</strong>。</p>

<h2>补充：“正确”的三种含义</h2>
<ul>
<li><strong>精确（exact）</strong>：3 + 6 只能得 9。</li>
<li><strong>在容差内近似（approximate within tolerance）</strong>：实数精度有限。C 里 <code>double x = 0.1 + 0.2;</code> 用 <code>%.17g</code> 打印是 0.30000000000000004，<code>x == 0.3</code> 为 0（假）；但 <code>fabs(x - 0.3) &lt; 1e-9</code> 成立，算对。</li>
<li><strong>属于合法解的集合（any member of a set of valid solutions）</strong>：去 Monash 大学的路线很多，给哪条都对。区间调度个数最多的组合也可能不止一种。</li>
</ul>
<p>怎么确定算法是对的？课上讲了三种办法：</p>
<ul>
<li><strong>枚举（enumeration）</strong>：每种输入都跑一遍核对。只适用于输入种类很少的情形，整数加法就没法枚举。</li>
<li><strong>证明（proof）</strong>：用归纳（induction）、反证（contradiction）等一次覆盖全部输入，上面的交换论证就是一例。</li>
<li><strong>反例（counterexample）</strong>：找一个让算法出错的输入。它只能证明算法<strong>不</strong>正确。</li>
</ul>
<div class="callout key" data-label="考点"><strong>证明不正确只需要一个反例</strong>；测试通过再多组数据，也只说明“还没发现错误”。</div>

<h2>补充：算法的三种分类</h2>
<p>同一个算法可以从三个角度分类，互不冲突。</p>
<p><strong>按任务（task）</strong>：数值计算（numerical）、排序（sorting）、查找（searching）、遍历（traversal）、调度（scheduling）、优化（optimisation）。</p>
<p><strong>按方法（approach）</strong>，细节见 1.10 算法设计思路：</p>
<ul>
<li>蛮力（brute force）：所有可能都试一遍。</li>
<li>减治（decrease-and-conquer）：每步缩小问题，只留一部分继续做，如二分查找。</li>
<li>分治（divide-and-conquer）：拆成不重叠的几部分，<strong>每部分都要解</strong>再合并，如归并排序。</li>
<li>贪心（greedy）：每步挑眼下最好的、不反悔，如最早结束优先。</li>
</ul>
<p><strong>按解的类型（solution type）</strong>：</p>
<ul>
<li>精确（exact）：保证正确答案或真正的最优解。</li>
<li>近似（approximate）：不一定最优，但能<strong>证明</strong>离最优多远，如保证路线不超过最短路线的 2 倍。</li>
<li>启发式（heuristic）：凭经验，<strong>没有理论保证</strong>，如“去 Monash 大概 30 公里”。</li>
<li>随时（anytime）：随时叫停都有可用的解，时间越多解越好；它和前三类<strong>不互斥</strong>。天气预报就算完全懂物理也做不成精确算法（数据太多、算得太慢、输入测不全），只能是近似、启发式或 anytime。</li>
</ul>

<h2>考试怎么考</h2>
<p>多以选择、多选、匹配出现：判断方案违反了哪条要求；把算法和任务、方法、解的类型配对；区间调度问哪条规则最优（<strong>最早结束优先</strong>）、按指定规则手算、给错误规则举反例。五条要求、三种正确、三种确定正确性的办法、三个分类角度都<strong>不在公式表（equation sheet）上</strong>，要背。</p>

<h3>例题 1：手算三条规则</h3>
<p>区间 A[0,7]、B[1,3]、C[4,9]、D[8,11]、E[10,14]、F[12,20]、G[18,19]，按三条规则各选出哪些？最优是几个？</p>
<p>做法固定：每选中一个，<strong>先删光和它重叠的</strong>，再从剩下的里挑下一个。</p>
<pre><code class="lang-text">最早开始：选 A[0,7]，删 B、C → 选 D[8,11]，删 E → 选 F[12,20]，删 G               共 3 个
最短：    选 G（长 1），删 F → 选 B（长 2），删 A → 选 D（长 3），删 C、E            共 3 个
最早结束：选 B（f=3），删 A → 选 C（f=9），删 D → 选 E（f=14），删 F → 选 G（f=19）  共 4 个</code></pre>
<p>最早开始被长区间 A、F 拖累；最短优先第三步选的 D[8,11] 同时压住了 C 和 E；最早结束选出 {B, C, E, G}，4 个，就是最优，而且是唯一的最优解。</p>

<h3>例题 2：多选判断</h3>
<p>哪些正确？(a) 排序程序在 10000 组随机数据上都排对了，所以它正确；(b) 给出一个让“最长优先”得不到最优解的输入，就足以说明它不是正确算法；(c) 只接受 0–255 内两个整数的加法程序，可以用枚举证明正确；(d) double 中 0.1 + 0.2 得 0.30000000000000004，所以浮点加法不正确；(e) 对 n = 30 的输入要跑 1000 年的程序，不满足“在合理时间内结束”。</p>
<p>答案 <strong>(b)(c)(e)</strong>。(a) 错，测试不能证明正确。(b) 对，如 A[0,10]、B[1,2]、C[3,4]：最长优先选 A，删掉 B、C，得 1 个，最优 {B, C} 有 2 个。(c) 对，只有 256 × 256 = 65536 种输入，能逐一核对。(d) 错，误差在容差内，属于近似但正确。(e) 对。</p>
<div class="callout warn" data-label="易错">
<p>① 近似要有<strong>可证明的界</strong>，没有保证的是启发式。② anytime 和另外三类不互斥。③ 分治每部分都要解，减治只继续解一部分。④ 手算时选一个就先删光与它重叠的，再挑下一个。</p>
</div>

<h2>小结</h2>
<ul>
<li>计算机算法五条要求：步骤精确、输入明确、输出明确、高效（时间和空间）、正确。</li>
<li>区间调度只有<strong>最早结束优先</strong>一定最优；排序后扫一遍，O(n log n)。</li>
<li><strong>一个反例就能证明算法不正确</strong>，测试再多也证明不了正确。</li>
<li>“正确”有三种：精确、在容差内近似、属于合法解的集合。</li>
<li>三个分类角度：按任务、按方法（蛮力、减治、分治、贪心）、按解的类型（精确、近似、启发式、anytime）。</li>
</ul>
`;
