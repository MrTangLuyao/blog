/* Post body — dsa-cheatsheet-algorithms / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-cheatsheet-algorithms:zh'] = `
<p class="lead">排序算法的时间、额外空间、稳定（stable）、原地（in-place）、自适应（adaptive）与设计思路；图算法解决的问题、对图的要求、在邻接表（adjacency list）和邻接矩阵（adjacency matrix）上的代价；搜索算法何时给出最优路径；常见递推式（recurrence）的解，以及主定理（Master Theorem）里 a、b、d 的读法。</p>

<h2>排序：同一个输入，代价差多少</h2>
<p>n = 1000 个互不相同的整数，数各算法的键比较次数（“随机”一列是 100 个随机排列的平均）。参照值：n²/2 = 500000，n log₂ n ≈ 9966。</p>
<table>
<thead><tr><th>算法</th><th>已排序</th><th>逆序</th><th>随机</th></tr></thead>
<tbody>
<tr><td>选择排序</td><td>499500</td><td>499500</td><td>499500</td></tr>
<tr><td>插入排序</td><td>999</td><td>499500</td><td>≈ 251000</td></tr>
<tr><td>快速排序（首元素作 pivot）</td><td>500499</td><td>499999</td><td>≈ 11400</td></tr>
<tr><td>归并排序（自顶向下）</td><td>5044</td><td>4932</td><td>≈ 8700</td></tr>
<tr><td>自适应归并排序</td><td>999</td><td>5931</td><td>≈ 9300</td></tr>
<tr><td>堆排序</td><td>17583</td><td>15965</td><td>≈ 16900</td></tr>
</tbody>
</table>
<ul>
<li><strong>选择排序</strong>三列相同：每轮都要扫完剩余部分找最小值，与输入无关。</li>
<li><strong>插入排序</strong>在已排序输入上每个元素只比较 1 次（n − 1 = 999 次），逆序时每个元素都要越过整个有序前缀。</li>
<li><strong>快速排序</strong>取首元素作 pivot 时，已排序和逆序输入都让每次的 pivot 成为最值（逆序时依次取到最大、最小、次大……），分出 n − 1 层，退化到约 n²/2；随机输入才是 n log n 量级。</li>
<li><strong>归并排序、堆排序</strong>的次数随输入有变化，但始终是 n log n 的常数倍。</li>
<li><strong>自适应归并</strong>先扫一遍找天然有序段（run），已排序输入只有一段，扫完就结束。</li>
</ul>
<p>按课上的用法，<strong>自适应</strong>指最好和最坏情况的<strong>量级</strong>不同：插入排序（n 对 n²）、快速排序（n log n 对 n²）、自适应归并（n 对 n log n）是；归并排序、堆排序只差常数，不是。</p>

<h2>排序总表</h2>
<table>
<thead><tr><th>算法</th><th>最好</th><th>平均</th><th>最坏</th><th>额外空间</th><th>稳定</th><th>原地</th><th>自适应</th><th>思路</th></tr></thead>
<tbody>
<tr><td>选择排序</td><td>Θ(n²)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td><td>减治</td></tr>
<tr><td>插入排序</td><td>Θ(n)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>是</td><td>是</td><td>是</td><td>减治</td></tr>
<tr><td>计数排序</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>O(K) ①</td><td>是 ①</td><td>否</td><td>否</td><td>四类之外 ③</td></tr>
<tr><td>快速排序</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n²)</td><td>O(log n) ②</td><td>否</td><td>看定义 ②</td><td>是</td><td>分治</td></tr>
<tr><td>归并（自顶向下）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td><td>分治</td></tr>
<tr><td>归并（自底向上）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td><td>分治（循环实现）</td></tr>
<tr><td>自适应归并</td><td>Θ(n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>是</td><td>分治</td></tr>
<tr><td>堆排序</td><td>不考 ④</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td><td>四类之外 ③</td></tr>
</tbody>
</table>
<p>① K 是键的取值范围；排记录时另需 O(n) 的输出数组，按起始位置放置是稳定的（见 5.4）。② 来自递归栈，平均 O(log n)，最坏 O(n)；按严格定义（额外 O(1)）不算原地，课上两种答案都接受，作答时写明理由。③ 复习课把算法按思路分成四类：蛮力（brute force）、减治（decrease-and-conquer）、分治（divide-and-conquer）、贪心（greedy），计数排序和堆排序不在其中。④ 课上明确不考堆排序的最好情况，按 Θ(n log n) 作答。</p>
<div class="callout key" data-label="考点">
<p><strong>比较排序的平均情况不可能好于 Θ(n log n)</strong>；计数排序是本课程唯一不比较键的排序，所以能做到 Θ(n + K)，但只适用于取值范围小的整数键。</p>
</div>

<h2>图算法：邻接表与邻接矩阵差在找邻居</h2>
<p>课上的 5 顶点无向图：边 A–C、B–C、B–D、C–D，E 是孤立点，V = 5，E = 4。DFS、BFS、拓扑排序都要对每个顶点 u 列出它的邻居：</p>
<pre><code>/* 邻接矩阵：扫 u 的整行，V 格 */
for (int v = 0; v &lt; V; v++)
    if (adj[u][v]) visit(v);

/* 邻接表：只走 u 自己的链表，deg(u) 个结点 */
for (node_t *p = list[u]; p != NULL; p = p-&gt;next)
    visit(p-&gt;v);</code></pre>
<p>对 5 个顶点各做一次：矩阵检查 5 × 5 = 25 格，其中只有 8 格是 1；邻接表一共只走 8 个结点（每条无向边存两次，2E = 8），连 5 个表头也只有 13 步。一般地，矩阵是 V 个顶点 × 每个 V 格 = <strong>O(V²)</strong>，与边数无关；邻接表是 Σ deg(u) = 2E 再加每个顶点的常数，<strong>O(V + E)</strong>。遍历类算法的其余工作对每个顶点、每条边只做常数次，复杂度就由这一步决定。</p>

<h2>图算法总表</h2>
<table>
<thead><tr><th>算法</th><th>解决的问题</th><th>对图的要求</th><th>思路</th><th>关键数据结构</th></tr></thead>
<tbody>
<tr><td>DFS</td><td>遍历；可达性、连通分量、判环</td><td>任意</td><td>蛮力（遍历）</td><td>栈（递归调用栈）+ visited[]</td></tr>
<tr><td>BFS</td><td>遍历；无权图单源最短路（边数最少）</td><td>任意；求最短路时每条边代价相同</td><td>蛮力（遍历）</td><td>FIFO 队列 + visited[]，入队时标记</td></tr>
<tr><td>拓扑排序</td><td>线性顺序，每条边都从前指向后</td><td>有向无环图（DAG）</td><td>减治（删源点）</td><td>入度数组 + 入度为 0 的队列；DFS 版在结束时插到链表头</td></tr>
<tr><td>Dijkstra</td><td>单源最短路（single-source shortest paths, SSSP）</td><td>带权，边权 ≥ 0</td><td>贪心</td><td>最小优先队列（priority queue, PQ）+ dist[] + from[]</td></tr>
<tr><td>Warshall</td><td>传递闭包（transitive closure）：谁能到达谁</td><td>任意，只看边在不在</td><td>四类之外 ⑤</td><td>V × V 的 0/1 矩阵</td></tr>
<tr><td>Floyd-Warshall</td><td>全源最短路（all-pairs shortest paths, APSP）</td><td>带权；允许负权边，不允许负权环</td><td>四类之外 ⑤</td><td>V × V 距离矩阵，k 在最外层</td></tr>
<tr><td>Prim</td><td>最小生成树（minimum spanning tree, MST）</td><td>无向、连通、带权</td><td>贪心</td><td>最小 PQ + inMST[]，键是单条边的权</td></tr>
</tbody>
</table>
<p>⑤ Warshall 和 Floyd-Warshall 通常归为<strong>动态规划（dynamic programming）</strong>：第 k 轮的矩阵由第 k − 1 轮的矩阵算出。这一类不在复习课的四类里。</p>
<table>
<thead><tr><th>算法与实现</th><th>邻接表</th><th>邻接矩阵</th><th>稀疏（sparse）E ≈ V，邻接表</th><th>稠密（dense）E ≈ V²</th></tr></thead>
<tbody>
<tr><td>DFS、BFS、拓扑排序</td><td>O(V + E)</td><td>O(V²)</td><td>O(V)</td><td>O(V²)</td></tr>
<tr><td>Dijkstra / Prim，二叉堆</td><td>O((V + E) log V)</td><td>O(V² + E log V)</td><td>O(V log V)</td><td>O(V² log V)</td></tr>
<tr><td>Dijkstra / Prim，未排序数组</td><td>O(V²)</td><td>O(V²)</td><td>O(V²)</td><td>O(V²)</td></tr>
<tr><td>Dijkstra / Prim，有序链表</td><td>O(VE)</td><td>O(VE)</td><td>O(V²)</td><td>O(V³)</td></tr>
<tr><td>Warshall、Floyd-Warshall</td><td>Θ(V³)</td><td>Θ(V³)</td><td>Θ(V³)</td><td>Θ(V³)</td></tr>
</tbody>
</table>
<ul>
<li>Dijkstra 和 Prim 的账一样：<strong>V 次 deleteMin + 最多 E 次更新</strong>，各乘所选 PQ 的单次代价（堆 O(log V)/O(log V)，未排序数组 O(V)/O(1)，有序链表 O(1)/O(V)），再加上找邻居的代价。有序链表一行假设图连通（E ≥ V − 1）。</li>
<li><strong>本课程默认 Dijkstra、Prim 是 O((V + E) log V)</strong>（二叉堆 + 邻接表）；Fibonacci 堆不考。</li>
<li>堆不总是更好：稀疏图选堆；稠密图上未排序数组版 O(V²) 比堆版 O(V² log V) 快。</li>
<li>Floyd-Warshall 用 E 表示：稠密图 V ≈ E<sup>1/2</sup>，Θ(E<sup>3/2</sup>)；稀疏图 V ≈ E，Θ(E³)。</li>
<li>全源最短路也可以从每个顶点各跑一次 Dijkstra：V × O((V + E) log V)，稀疏图 O(V² log V) 比 Θ(V³) 好，稠密图 O(V³ log V) 更差，而且不能有负权边。Warshall 与“从每个顶点各做一次 BFS/DFS”（O(V² + VE)，最坏 O(V³)）相比没有渐近优势。</li>
</ul>

<h2>搜索算法与最优性</h2>
<p>从一个起点找到一个目标，“最优”指找到的路径总代价最小。复习课的对照：</p>
<table>
<thead><tr><th>算法</th><th>每次取出</th><th>最优？</th><th>条件</th></tr></thead>
<tbody>
<tr><td>BFS</td><td>最早入队的（FIFO 队列）</td><td>有条件</td><td>每一步代价都相同</td></tr>
<tr><td>DFS</td><td>最近加入的（栈）</td><td>否</td><td>找到的只是第一条路径</td></tr>
<tr><td>统一代价搜索（uniform-cost search, UCS）</td><td>从起点出发代价最小的（PQ）</td><td>是</td><td>代价非负；就是 Dijkstra 的一个版本，取出目标即停</td></tr>
<tr><td>IW（Assignment 3）</td><td>—</td><td>有条件</td><td>细节不考</td></tr>
</tbody>
</table>
<p>按起点和终点的个数分：<strong>一对一</strong>是上表四种；<strong>一对多</strong>（单源）用 Dijkstra，有负权边时要用 Bellman-Ford（细节不考，只需知道何时需要它）；<strong>多对多</strong>（全源）用 Floyd-Warshall 或重复 Dijkstra。Prim 求的是最小生成树，树上两点间的路径不一定是最短路。</p>

<h2>递推式与主定理</h2>
<p>课上的“神秘算法” T(n) = 9T(n/3) + n：一次调用发出 9 个递归调用（a = 9），每个规模 n/3（b = 3），递归之外做 n 次操作（f(n) = n¹，d = 1）。b<sup>d</sup> = 3 &lt; 9 = a，落在第三种情况：T(n) ∈ Θ(n<sup>log₃ 9</sup>) = Θ(n²)。主定理印在公式表上，要自己读出的只有三个数：</p>
<ul>
<li><strong>a</strong>：一次调用里<strong>实际发出</strong>的递归调用次数，把一个结果乘 3 不算 3 次。</li>
<li><strong>b</strong>：每个子问题的规模是 n/b。</li>
<li><strong>d</strong>：递归以外的工作（拆分 + 合并）是 Θ(n<sup>d</sup>)；<strong>常数工作 d = 0</strong>。</li>
</ul>
<p>a 是每往下一层子问题变多的倍数，b<sup>d</sup> 是每个子问题的工作变少的倍数。a &lt; b<sup>d</sup> 时根上的工作占大头，Θ(n<sup>d</sup>)；相等时每层一样多，Θ(n<sup>d</sup> log n)；a &gt; b<sup>d</sup> 时叶子占大头，Θ(n<sup>log<sub>b</sub> a</sup>)。</p>
<table>
<thead><tr><th>递推式</th><th>解</th><th>例子</th><th>怎么得到（主定理列出 a, b, d）</th></tr></thead>
<tbody>
<tr><td>T(n − 1) + c</td><td>Θ(n)</td><td>插入排序最好情况</td><td>展开：n − 1 个 c</td></tr>
<tr><td>T(n − 1) + cn</td><td>Θ(n²)</td><td>选择排序；插入排序、快速排序的最坏情况</td><td>展开：等差数列求和</td></tr>
<tr><td>2T(n − 1) + c</td><td>Θ(2ⁿ)</td><td>汉诺塔，2ⁿ − 1 步</td><td>展开：等比数列求和</td></tr>
<tr><td>T(n − 1) + T(n − 2) + c</td><td>Θ(φⁿ)，φ ≈ 1.618</td><td>朴素递归斐波那契</td><td>与斐波那契数同阶（见 1.2），上界 O(2ⁿ)</td></tr>
<tr><td>T(n/2) + c</td><td>Θ(log n)</td><td>二分查找最坏情况</td><td>主定理 1, 2, 0：1 = 2⁰</td></tr>
<tr><td>T(n/2) + cn</td><td>Θ(n)</td><td>扫一遍后只递归一半</td><td>主定理 1, 2, 1：1 &lt; 2</td></tr>
<tr><td>2T(n/2) + c</td><td>Θ(n)</td><td>分治求最大值</td><td>主定理 2, 2, 0：2 &gt; 1</td></tr>
<tr><td>2T(n/2) + cn</td><td>Θ(n log n)</td><td>归并排序；快速排序最好情况；二维最近点对</td><td>主定理 2, 2, 1：2 = 2¹</td></tr>
</tbody>
</table>
<p>不能直接套主定理的三类：规模减常数（T(n − 1) + …，用展开法，见 1.8）、子问题不等长（T(n/3) + T(2n/3) + n，一般情况下的快速排序）、f(n) 不是 n<sup>d</sup>（如 2T(n/2) + log n）。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>填空：最接近的 Big-O 上界</strong>（2015、2016 都考过）。不指明情况就按最坏答：快速排序的时间 O(n²)；额外空间快速排序 O(log n)（课上的答案）、归并排序（含自底向上）O(n)、堆排序 O(1)。题目给出的取值范围只影响计数排序。</li>
<li><strong>性质判断与配对</strong>：稳定、原地、自适应、思路逐格对表；说某算法不稳定，要能给一个反例。</li>
<li><strong>情景 → 图算法</strong>：从描述里读出单源还是全源、有没有权、有没有负权、是不是 DAG、是不是要连通所有点，再对照第一张图表。</li>
<li><strong>换 PQ 实现或换图的疏密</strong>：Dijkstra 用堆和有序链表（2015）、稀疏与稠密图上的最小生成树（2016）、Floyd-Warshall 用 E 表示（2015）。按“V 次 deleteMin + E 次更新”当场推导。</li>
<li><strong>递推式</strong>：读代码写出 T(n)，再用主定理或展开求 Θ，并写明是哪种情况。</li>
</ul>
<p>公式表上有主定理、等差与等比数列求和、对数恒等式、散列的探查次数估计。<strong>不在表上、要背的</strong>：两张总表的每一格、各图算法对图的要求、搜索算法的最优性、递推式表。</p>
<div class="callout warn" data-label="易错">
<p>① “快速排序 Θ(n log n)”只对最好和平均情况成立。② 归并排序、堆排序的比较次数随输入变化，但量级不变，不算自适应。③ BFS 只在每步代价相同时给出最短路；DFS 从不保证最短。④ Dijkstra 不能有负权边；Floyd-Warshall 允许负权边但不能有负权环，k 必须是最外层循环。⑤ 拓扑排序只对 DAG，答案通常不止一个。⑥ 最小生成树上两点间的路径不一定最短。⑦ 稠密图上堆版 Dijkstra/Prim 比数组版慢。⑧ 常数 f(n) 的 d 是 0，不是 1。</p>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 给出最接近的 Big-O 上界（不指明情况时按最坏情况）：(a) 快速排序（首元素作 pivot）排 n 个元素的时间；(b) 快速排序的额外空间；(c) 自底向上归并排序排 n 个取值范围为 r 的元素，额外空间；(d) 插入排序排一个已排好序的数组；(e) 堆排序的额外空间；(f) 自适应归并排序的时间。</summary>
<div class="qa__body">
<p>(a) <strong>O(n²)</strong>：已排序或逆序输入让每次的 pivot 都是最值，n − 1 层分区，n = 1000 时约 50 万次比较。</p>
<p>(b) <strong>O(log n)</strong>：来自递归栈，这是课上的答案。题目若问最坏情况，栈深可达 n − 1，即 O(n)；旧参考答案写 O(1)（不算栈），作答时写一句所用的定义。</p>
<p>(c) <strong>O(n)</strong>：合并要一个长度 n 的临时数组，与 r 无关；r 是干扰项，只有计数排序的空间取决于取值范围。</p>
<p>(d) <strong>O(n)</strong>：每个新元素和前一个比较 1 次就停，共 n − 1 次比较，不移动任何元素。</p>
<p>(e) <strong>O(1)</strong>：堆直接建在原数组里，只用几个下标变量。</p>
<p>(f) <strong>O(n log n)</strong>：最坏是严格逆序，没有长度超过 1 的有序段，和自底向上归并一样要合并约 log₂ n 轮；Θ(n) 只是最好情况。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 为每个情景选一个算法，写出它的复杂度（邻接表）：(a) 地铁网络里从一站到另一站，经过的区段最少；(b) 有向图里有负权边但没有负权环，求所有顶点对之间的最短距离；(c) 课程之间有先修关系，排出一个可行的修课顺序；(d) 用总长度最短的电缆把所有楼连通；(e) 道路长度都非负，求仓库到所有地点的最短距离；(f) 求一个有向图里哪些顶点能到达哪些顶点。</summary>
<div class="qa__body">
<p>(a) <strong>BFS，O(V + E)</strong>：每个区段代价相同，BFS 按层扩展，第一次到达目标时经过的区段最少。</p>
<p>(b) <strong>Floyd-Warshall，Θ(V³)</strong>：允许负权边；Dijkstra 遇到负权边会出错。</p>
<p>(c) <strong>拓扑排序，O(V + E)</strong>：先修关系是 DAG（有环就排不出来），可行顺序通常不止一个。</p>
<p>(d) <strong>Prim，O((V + E) log V)</strong>：求的是最小生成树，不是最短路。</p>
<p>(e) <strong>Dijkstra，O((V + E) log V)</strong>：单源、边权非负。</p>
<p>(f) <strong>Warshall，Θ(V³)</strong>，得到传递闭包；也可以从每个顶点各做一次 BFS 或 DFS，O(V(V + E))，最坏同样是 O(V³)。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. Prim 和 Dijkstra 的 PQ 操作相同。(a) E ≈ V 时，二叉堆和未排序数组作 PQ 各是多少？选哪个？(b) E ≈ V² 时呢？(c) 用 E 表示 Floyd-Warshall 的运行时间，稠密图和稀疏图各是多少？</summary>
<div class="qa__body">
<p>(a) 堆：(V + E) log V = <strong>O(V log V)</strong>；未排序数组：V 次 deleteMin 各扫 V 个，<strong>O(V²)</strong>。选<strong>堆</strong>。V = 1000 时约 2×10⁴ 对 10⁶。</p>
<p>(b) 堆：(V + V²) log V = <strong>O(V² log V)</strong>；未排序数组仍是 <strong>O(V²)</strong>，与边数无关。选<strong>未排序数组</strong>（配邻接矩阵）。V = 1000 时约 10⁷ 对 10⁶。</p>
<p>(c) 三重循环各 V 次，Θ(V³)。稠密图 E ≈ V²，V ≈ E<sup>1/2</sup>，得 <strong>Θ(E<sup>3/2</sup>)</strong>；稀疏图 E ≈ V，得 <strong>Θ(E³)</strong>。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">4. 多选，哪些正确？(A) 所有边权都是 5 的图上，BFS 找到的路径总代价最小；(B) 统一代价搜索在有负代价的图上仍然最优；(C) DFS 在无权图上找到的是边数最少的路径；(D) T(n) = 2T(n − 1) + 1 可以直接用主定理求解；(E) T(n) = 3T(n/3) + n ∈ Θ(n log n)；(F) T(n) = T(n/2) + n ∈ Θ(n log n)。</summary>
<div class="qa__body">
<p><strong>A、E 正确。</strong></p>
<p>A：每条边代价相同，总代价 = 5 × 边数，边数最少就是代价最小。B 错：统一代价搜索是 Dijkstra 的一个版本，取出的结点之后可能经负代价边变得更便宜，结论不再成立。C 错：三角形 A–B、A–C、B–C，从 A 出发按字母序先走 B，再从 B 到 C，得到 2 条边的路径，而 A–C 只要 1 条。D 错：规模是 n − 1 而不是 n/b，要展开，T(1) = 1 时 T(n) = 2ⁿ − 1 ∈ Θ(2ⁿ)。E：a = 3，b = 3，d = 1，3 = 3¹，情况 2，Θ(n log n)。F 错：a = 1，b = 2，d = 1，1 &lt; 2，情况 1，Θ(n)：n + n/2 + n/4 + … &lt; 2n。</p>
</div>
</details>
`;
