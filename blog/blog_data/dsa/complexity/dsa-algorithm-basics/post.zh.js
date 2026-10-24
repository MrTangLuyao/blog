/* Post body — dsa-algorithm-basics / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-algorithm-basics:zh'] = `
<p class="lead">算法（algorithm）是完成一项任务的一串步骤；<strong>计算机算法</strong>还要求步骤精确、输入输出明确、在合理的时间和空间内结束，并且结果正确。以“电影明星排档期”（区间调度）为例：三条看似合理的贪心（greedy）规则里只有一条正确，另外两条各被一个反例推翻。</p>

<h2>计算机算法的五条要求</h2>
<p>两个整数相加、做一道菜、洗一次衣服，都是按步骤完成任务，都算算法。但菜谱写“加少许糖”，计算机无法执行，因为“少许”不精确。课上给<strong>计算机算法</strong>列了五条要求：</p>
<ol>
<li><strong>步骤精确（precise steps）</strong>：每一步只有一种理解。</li>
<li><strong>输入明确（input）</strong>：接受什么数据、取值范围多大。</li>
<li><strong>输出明确（output）</strong>：返回什么、满足什么条件。</li>
<li><strong>高效（efficiency）</strong>：在<strong>合理的时间</strong>内结束，且不超出机器的内存，即同时考虑<strong>时间和空间</strong>。“合理”由问题决定：两数相加应在毫秒内完成，计算火箭轨道花几天也可以接受。</li>
<li><strong>正确（correctness）</strong>：对每个合法输入都给出符合要求的输出。</li>
</ol>
<p>课上“把 1 美元变成 100 万美元”的四个方案，各卡在不同的地方：</p>
<table>
<thead><tr><th>方案</th><th>结果</th><th>问题</th></tr></thead>
<tbody>
<tr><td>存银行，年利率 5%，一直等</td><td>约 283 年后成功（1.05ⁿ = 10⁶，n ≈ 283.2）</td><td>太慢</td></tr>
<tr><td>同时存进 2000 万家银行，各得 5 美分利息</td><td>一年后 100 万</td><td>资源不存在</td></tr>
<tr><td>买彩票</td><td>可能中奖</td><td>结果没有保证</td></tr>
<tr><td>每个墨尔本人给 1 美元</td><td>能成</td><td>依赖很强的假设</td></tr>
</tbody>
</table>
<div class="callout key" data-label="考点">五条要求要能逐条说出，并能判断一个方案违反了哪一条。<strong>效率包括空间</strong>，不只是时间。</div>

<h2>例子：电影明星排档期</h2>
<p>一位刚出道的演员想接尽量多的戏，每部戏占一段固定时间，同一时刻只能拍一部。写成计算机问题，先定输入输出：</p>
<ul>
<li><strong>输入</strong>：n 个区间的集合 I，区间 [s, f] 表示一部戏从时刻 s 拍到 f（s &lt; f）。</li>
<li><strong>输出</strong>：I 中<strong>两两不重叠</strong>、且<strong>个数最多</strong>的子集。</li>
</ul>
<p>这就是<strong>区间调度（interval scheduling）</strong>。有共同时段才算重叠，端点相接（一部结束时另一部正好开始）不算。</p>
<p>蛮力（brute force）检查全部 2ⁿ 个子集，一定正确，但 n = 50 时子集数约 1.1 × 10¹⁵。课上讨论的三条规则都套用同一个循环，只是“挑哪一个”不同：</p>
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
<p class="anim-caption">选一个实例和一条规则后逐步播放：橙色是本步挑中的区间，红色是因与它重叠而被删掉的区间，最后一帧的蓝色虚线框标出最优解。</p>

<h3>一个反例就足以推翻</h3>
<p><strong>规则 1 的反例</strong>：A[0,10]、B[1,2]、C[3,4]、D[5,6]。A 开始最早被选中，B、C、D 都和它重叠被删掉，结果 1 个；最优解 {B, C, D} 有 3 个。</p>
<p><strong>规则 2 的反例</strong>：A[0,5]、B[4,7]、C[6,11]。最短的 B（长 3）同时压住 A 和 C，结果 1 个；最优解 {A, C} 有 2 个。</p>
<p>规则 3 在两个实例上都最优。规则 1 在反例 2、规则 2 在反例 1 上也碰巧最优，所以“几个例子上都对”说明不了正确。</p>

<h3>为什么最早结束优先一定最优</h3>
<p>课上用反证的思路：若第一个选的不是结束最早的区间，换成结束更晚的只会挡住更多后续机会。完整写法是<strong>交换论证（exchange argument）</strong>：</p>
<ol>
<li>设 g 是结束最早的区间。任取一个最优解，按结束时刻排成 o₁, o₂, …, oₖ，则 f(g) ≤ f(o₁)。</li>
<li>把 o₁ 换成 g：o₂ … oₖ 都不早于 f(o₁) 开始，也就不早于 f(g) 开始，与 g 不重叠。换完仍是 k 个、仍最优，且包含 g，所以第一步选 g 不吃亏。</li>
<li>选 g 并删掉与它重叠的区间后，剩下的区间都不早于 f(g) 开始（没有比 g 结束更早的区间），o₂ … oₖ 都还在。这是同样形式的更小问题，对区间个数做归纳，最终选出 k 个。</li>
</ol>

<h3>实现：按结束时刻排序，扫一遍</h3>
<p>照循环字面写，每轮都要扫一遍剩余区间，最坏 O(n²)。等价的快写法：按结束时刻排序后顺序扫描，区间的开始不早于上一个已选区间的结束就选它；扫到的第一个未被删的区间，正是“剩余里结束最早的”。排序 O(n log n) 加扫描 O(n)，共 <strong>O(n log n)</strong>。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

typedef struct {
    char name;
    int start, finish;              /* 占用时间 [start, finish] */
} job_t;

/* qsort 的比较函数：结束时刻早的排在前面 */
static int by_finish(const void *a, const void *b) {
    const job_t *x = a, *y = b;
    return (x-&gt;finish &gt; y-&gt;finish) - (x-&gt;finish &lt; y-&gt;finish);
}

/* 最早结束优先：选中的区间写进 chosen[]，返回选中的个数 */
int schedule(job_t jobs[], int n, job_t chosen[]) {
    qsort(jobs, n, sizeof(job_t), by_finish);           /* O(n log n) */
    int count = 0;
    for (int i = 0; i &lt; n; i++) {                       /* O(n) */
        /* 只需和最后选中的区间比：它在已选区间里结束最晚 */
        if (count == 0 || jobs[i].start &gt;= chosen[count - 1].finish) {
            chosen[count++] = jobs[i];
        }
    }
    return count;
}

int main(void) {
    job_t jobs[] = {{'A', 1, 8}, {'B', 3, 5}, {'C', 6, 7}, {'D', 9, 17},
                    {'E', 10, 14}, {'F', 13, 16}, {'G', 15, 20}};
    int n = sizeof(jobs) / sizeof(jobs[0]);
    job_t chosen[sizeof(jobs) / sizeof(jobs[0])];

    int k = schedule(jobs, n, chosen);
    printf("%d jobs:", k);
    for (int i = 0; i &lt; k; i++) {
        printf(" %c[%d,%d]", chosen[i].name, chosen[i].start, chosen[i].finish);
    }
    printf("\\n");
    return 0;
}</code></pre>
<p>输出 <code>4 jobs: B[3,5] C[6,7] E[10,14] G[15,20]</code>，即动画里的“综合”实例。</p>

<h2>正确性：三种“正确”</h2>
<p>“正确”不一定是“和唯一的标准答案完全相同”。课上分了三种：</p>
<p><strong>精确（exact）</strong>：3 + 6 只能得 9，其他答案都错。</p>
<p><strong>在容差内近似（approximate within tolerance）</strong>：实数在计算机里只有有限精度，结果和真值差一个极小的量也算正确。例如 C 里 0.1 + 0.2 存成 double 后并不等于 0.3：</p>
<pre><code>double x = 0.1 + 0.2;
printf("%.17g\\n", x);                   /* 0.30000000000000004 */
printf("%d\\n", x == 0.3);               /* 0：直接用 == 比较不成立 */
printf("%d\\n", fabs(x - 0.3) &lt; 1e-9);   /* 1：在容差内，算对（fabs 在 math.h） */</code></pre>
<p><strong>属于合法解的集合（any member of a set of valid solutions）</strong>：从某地去 Monash 大学有很多条可行路线，输出任何一条都正确。区间调度也是这样：最大的不重叠子集可能不止一个，输出任意一个都对。</p>

<h3>怎样确定一个算法正确</h3>
<table>
<thead><tr><th>方法</th><th>做法</th><th>局限</th></tr></thead>
<tbody>
<tr><td>枚举（enumeration）</td><td>把每一种可能的输入都跑一遍并核对</td><td>只适用于输入有限且很少的情形；整数加法有无穷多种输入，无法枚举</td></tr>
<tr><td>证明（proof）</td><td>归纳（induction）、演绎、反证（contradiction）等，一次覆盖全部输入</td><td>难写；上面的交换论证就是一例</td></tr>
<tr><td>反例（counterexample）</td><td>找一个输入，让算法给出错误结果</td><td>只能证明算法<strong>不</strong>正确</td></tr>
</tbody>
</table>
<div class="callout key" data-label="考点">证明正确要靠枚举（只限很小的输入空间）或形式证明；<strong>证明不正确只需要一个反例</strong>。测试通过再多组数据，也只是“没发现错误”，不等于正确。</div>

<h2>算法的分类</h2>
<p>同一个算法可以从三个角度归类，互不冲突。</p>
<p><strong>按任务（task）</strong>：数值计算（numerical，如解线性方程组）、排序（sorting）、查找（searching，如找路线）、遍历（traversal，访问图的所有顶点）、调度（scheduling，如排课表）、优化（optimisation）。</p>
<p><strong>按方法（approach）</strong>，细节见 1.10 算法设计思路：</p>
<ul>
<li>蛮力（brute force）：把所有可能都试一遍，如枚举 2ⁿ 个子集。</li>
<li>减治（decrease-and-conquer）：每步把问题缩小一点或只留一部分继续做，如二分查找只留一半。</li>
<li>分治（divide-and-conquer）：拆成互不重叠的几部分，<strong>每部分都要解</strong>再合并，如归并排序。</li>
<li>贪心（greedy）：每步做眼下最好的选择、不回头，如最早结束优先。</li>
</ul>
<p><strong>按解的类型（solution type）</strong>：</p>
<ul>
<li>精确（exact）：真正的最优解或正确答案。</li>
<li>近似（approximate）：不一定最优，但能<strong>证明</strong>与最优解的关系，如保证路线不超过最短路线的 2 倍。</li>
<li>启发式（heuristic）：经验估计，<strong>没有理论保证</strong>，如“去 Monash 大概 30 公里”。</li>
<li>随时（anytime）：随时叫停都有可用的解，时间越多解越好（从启发式水平到近似再到精确），与前三类<strong>不互斥</strong>。</li>
</ul>
<p>课上的讨论题：即使完全掌握天气的物理规律，天气预报也做不成精确算法：数据量太大、精确计算太慢，输入也测不全。它只能是近似、启发式或 anytime。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择 / 匹配</strong>：算法 ↔ 任务、方法、解的类型；判断一个方案违反了哪条要求。</li>
<li><strong>区间调度</strong>：哪条规则最优（<strong>最早结束优先</strong>）；按指定规则手算选出哪些；为错误规则构造反例。每选一个，先删光与它重叠的再挑下一个。</li>
<li><strong>正确性</strong>：测试不等于证明；一个反例足以推翻。</li>
<li><strong>要背</strong>：五条要求、三种正确、三种确定正确性的方式、三个分类角度及例子，公式表（equation sheet）上都没有。</li>
<li><strong>陷阱</strong>：效率包括空间；近似要有可证明的界，否则是启发式；anytime 与另外三类不互斥；分治每个子问题都要解，减治只继续解一部分。</li>
</ul>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">区间 A[0,7]、B[1,3]、C[4,9]、D[8,11]、E[10,14]、F[12,20]、G[18,19]。分别按最早开始、最短、最早结束三条规则手算，各选出哪些区间？最优是几个？</summary>
  <div class="qa__body">
<pre><code class="lang-text">最早开始：选 A[0,7]，删 B、C → 选 D[8,11]，删 E → 选 F[12,20]，删 G                 共 3 个
最短：    选 G（长 1），删 F → 选 B（长 2），删 A → 选 D（长 3），删 C、E              共 3 个
最早结束：选 B（f=3），删 A → 选 C（f=9），删 D → 选 E（f=14），删 F → 选 G（f=19）    共 4 个</code></pre>
<p>最优是 4 个，即 {B, C, E, G}，这也是唯一的最优解。最早开始被长区间 A、F 拖累；最短优先第三步选的 D[8,11] 同时压住了 C 和 E。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">多选，哪些正确？(a) 排序程序在 10000 组随机数据上都排对了，所以它正确；(b) 给出一个让“最长优先”得不到最优解的输入，就足以说明它不是区间调度的正确算法；(c) 只接受 0–255 范围内两个整数的加法程序，可以用枚举证明正确；(d) double 中 0.1 + 0.2 得 0.30000000000000004，所以浮点加法不正确；(e) 对 n = 30 的输入要运行 1000 年的程序，不满足“在合理时间内结束”。</summary>
  <div class="qa__body">
<p>正确的是 <strong>(b)(c)(e)</strong>。(a) 测试只能发现错误，不能证明正确。(b) 例如 A[0,10]、B[1,2]、C[3,4]：最长优先选 A，删掉 B、C，得 1 个；最优 {B, C} 有 2 个。(c) 输入只有 256 × 256 = 65536 种，可以逐一核对。(d) 误差在容差内，属于近似但正确。(e) 在合理时间内结束是计算机算法的要求之一。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">匹配方法与解的类型：① 枚举 2ⁿ 个子集找最大的不重叠子集；② 最早结束优先；③ 二分查找；④ 归并排序；⑤ 保证路线不超过最短路线 1.5 倍的导航；⑥ 先立刻给出一条路线、之后不断改进、随时可叫停的规划程序；⑦ 凭经验估计“大约 30 公里”。</summary>
  <div class="qa__body">
<table>
<thead><tr><th>做法</th><th>方法</th><th>解的类型</th></tr></thead>
<tbody>
<tr><td>①</td><td>蛮力</td><td>精确</td></tr>
<tr><td>②</td><td>贪心</td><td>精确（已证明最优）</td></tr>
<tr><td>③</td><td>减治：每次只留一半</td><td>精确</td></tr>
<tr><td>④</td><td>分治：两半都要排，再合并</td><td>精确</td></tr>
<tr><td>⑤</td><td>—</td><td>近似：有可证明的界</td></tr>
<tr><td>⑥</td><td>—</td><td>anytime</td></tr>
<tr><td>⑦</td><td>—</td><td>启发式：没有保证</td></tr>
</tbody>
</table>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">规则 4“最晚开始优先”：每次挑开始时刻最大的区间，再删掉与它重叠的区间。它对区间调度是否最优？给出理由或反例。</summary>
  <div class="qa__body">
<p><strong>最优。</strong>把时间轴翻转，每个区间 [s, f] 变成 [−f, −s]：重叠关系不变，“开始最晚”变成“结束最早”。规则 4 在原实例上的每一步选择，恰好是规则 3 在翻转后实例上的选择，两边选出的个数相同，而规则 3 已证明最优。</p>
<p>用练习 1 的实例验证：规则 4 依次选 G（s=18，删 F）、E（s=10，删 D）、C（s=4，删 A）、B（s=1），共 4 个，等于最优。</p>
  </div>
</details>
`;
