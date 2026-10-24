/* Post body — dsa-cheatsheet-algorithms / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-cheatsheet-algorithms:zh'] = `
<p class="lead">排序算法的时间、空间、稳定（stable）、原地（in-place）、自适应（adaptive），图算法的适用条件和在邻接表（adjacency list）、邻接矩阵（adjacency matrix）上的代价，搜索算法的最优性，以及常见递推式（recurrence）和主定理（Master Theorem）的 a、b、d，各自为什么是这样。</p>

<h2>排序：同一个输入，代价差多少</h2>
<p>背表之前，先看一组实测数字。拿 n = 1000 个互不相同的整数，数每种算法做了多少次键比较。“随机”一列是 100 个随机排列的平均。</p>
<p>两个参照值：n²/2 = 500000，n log₂ n ≈ 9966。</p>
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
<li><strong>选择排序（selection sort）三列一模一样。</strong>为什么？它每一轮都要把剩下的元素从头扫到尾，才能确定谁最小。扫多少和数据长什么样无关：999 + 998 + … + 1 = 499500。</li>
<li><strong>插入排序（insertion sort）两头差了 500 倍。</strong>它把每个新元素往左挪，碰到不比它大的就停。已排序时，每个元素比较 1 次就停，共 n − 1 = 999 次；逆序时，每个元素都要一路挪到最前面，又回到 n²/2。</li>
<li><strong>快速排序（quicksort）最怕的恰恰是“已经有序”。</strong>取首元素作基准（pivot）时，有序输入的首元素就是最小值，分区后一边是空的，另一边有 n − 1 个。每层只少一个元素，要分 n − 1 层，约 n²/2 次。逆序时依次取到最大、最小、次大……，同样每次都分得最偏。只有随机输入才分得比较匀，落在 n log n 量级。</li>
<li><strong>归并排序（merge sort）和堆排序（heapsort）三列有高有低，但都是 n log n 的常数倍。</strong>为什么不会掉到 n 或涨到 n²？归并不管数据如何，总是对半拆、整段合并；堆排序每取走一次堆顶，都要把从末尾换上来的元素 sift down 约 log n 层，和输入是否有序关系不大。</li>
<li><strong>自适应归并排序（adaptive merge sort）</strong>先扫一遍，找出本来就有序的连续段（run），再把这些段两两合并。已排序的输入整个就是一段，扫完（999 次比较）就结束。</li>
</ul>
<p>课上说的<strong>自适应</strong>，意思是<strong>最好情况和最坏情况的量级不同</strong>，不管好在哪种输入上。按这个标准，插入排序（n 对 n²）、快速排序（n log n 对 n²）、自适应归并（n 对 n log n）是自适应的；归并排序、堆排序的次数只差常数倍，不算。</p>

<h2>排序总表</h2>
<p>先说清楚几列的意思：</p>
<ul>
<li><strong>额外空间</strong>：除了装输入的数组，还要另外借多少内存。递归调用栈也算。</li>
<li><strong>稳定</strong>：键相同的两个元素，排完后先后次序不变。比如按成绩排序，两个都是 80 分的同学，原来 Alice 在 Bob 前面，排完 Alice 还在前面。</li>
<li><strong>原地</strong>：只用 O(1) 的额外空间，在原数组里挪来挪去就排好了。</li>
<li><strong>思路</strong>：复习课把算法按设计思路分成四类：蛮力（brute force）、减治（decrease-and-conquer，每次把问题缩小一点）、分治（divide-and-conquer，拆成几个小问题分别解，再合起来）、贪心（greedy）。</li>
</ul>
<table>
<thead><tr><th>算法</th><th>最好</th><th>平均</th><th>最坏</th><th>额外空间</th><th>稳定</th><th>原地</th><th>自适应</th><th>思路</th></tr></thead>
<tbody>
<tr><td>选择排序</td><td>Θ(n²)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td><td>减治</td></tr>
<tr><td>插入排序</td><td>Θ(n)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>是</td><td>是</td><td>是</td><td>减治</td></tr>
<tr><td>计数排序</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>O(K)</td><td>是</td><td>否</td><td>否</td><td>四类之外</td></tr>
<tr><td>快速排序</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n²)</td><td>O(log n)</td><td>否</td><td>看定义</td><td>是</td><td>分治</td></tr>
<tr><td>归并（自顶向下）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td><td>分治</td></tr>
<tr><td>归并（自底向上）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td><td>分治（循环实现）</td></tr>
<tr><td>自适应归并</td><td>Θ(n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>是</td><td>分治</td></tr>
<tr><td>堆排序</td><td>不考</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td><td>四类之外</td></tr>
</tbody>
</table>
<ul>
<li><strong>选择排序：不稳定。</strong>它把最小值和当前位置做一次远距离交换，可能把一个元素甩到和它相等的元素后面。例：[2a, 2b, 1]，1 和 2a 交换，得到 [1, 2b, 2a]，两个 2 的次序反了。每轮只缩小一个元素，所以是减治。</li>
<li><strong>插入排序：稳定、原地。</strong>新元素只越过比它<strong>严格大</strong>的元素，遇到相等的就停下；挪动都在原数组里做。</li>
<li><strong>计数排序（distribution counting）：Θ(n + K)，不原地。</strong>K 是键可能取值的个数。它不比较键：先数每个值出现几次（扫 n 个），累加成每个值在输出里的起始位置（扫 K 个），再按输入顺序把元素放进输出数组（再扫 n 个）。所以要大小为 K 的计数数组，排记录时还要 O(n) 的输出数组。按输入顺序往后放，相同键次序不变，所以稳定（见 5.4）。</li>
<li><strong>快速排序：额外空间 O(log n)，不稳定。</strong>它不另开数组，但每层递归占一格调用栈：分得匀时栈深约 log₂ n，最偏时 n − 1。分区的远距离交换会打乱相等元素。至于“原地”：只看有没有另开数组，算原地；按严格定义（额外 O(1)），递归栈已经超了。课上两种答案都接受，作答时写一句用的是哪个定义。</li>
<li><strong>归并排序：额外空间 O(n)，稳定。</strong>合并要一个最多 n 格的临时数组；遇到相等的键先取左半段的，所以稳定。自底向上（bottom-up）版本用循环依次合并长度 1、2、4……的段，性质和自顶向下（top-down）相同。</li>
<li><strong>堆排序：额外空间 O(1)，不稳定。</strong>堆建在原数组里；每次把堆顶换到末尾，这一下远距离交换会打乱相等元素。课上明确<strong>不考堆排序的最好情况</strong>，一律按 Θ(n log n) 作答。</li>
<li><strong>计数排序和堆排序不属于四类思路中的任何一类</strong>，配对题里不要硬塞。</li>
</ul>
<div class="callout key" data-label="考点">
<p><strong>比较排序的平均情况不可能好于 Θ(n log n)。</strong>为什么？n 个不同的数有 n! 种可能的排列，每次比较只有两种结果，k 次比较最多区分 2ᵏ 种情况。要区分 n! 种，就需要 2ᵏ ≥ n!，即 k ≥ log₂(n!) ≈ n log₂ n。</p>
<p>计数排序是本课程唯一不比较键的排序，所以能做到 Θ(n + K)，代价是只适用于取值范围小的整数键。</p>
</div>

<h2>图算法：邻接表与邻接矩阵差在找邻居</h2>
<p>图算法的复杂度为什么常写两个版本？差别几乎全在一件事上：<strong>列出一个顶点 u 的所有邻居</strong>。DFS、BFS、拓扑排序都要对每个顶点做这件事。</p>
<pre><code>/* 邻接矩阵：扫 u 的整行，V 格 */
for (int v = 0; v &lt; V; v++)
    if (adj[u][v]) visit(v);

/* 邻接表：只走 u 自己的链表，deg(u) 个结点 */
for (node_t *p = list[u]; p != NULL; p = p-&gt;next)
    visit(p-&gt;v);</code></pre>
<ul>
<li>第 2–3 行（矩阵）：v 从 0 走到 V − 1，把 u 这一行的 V 个格子挨个看一遍，是 1 才访问。哪怕 u 只有一个邻居，也得看满 V 格。</li>
<li>第 6–7 行（链表）：p 从 u 的表头出发，沿 next 一个个走到 NULL，每个结点就是一个邻居。走几步就有几个邻居，一步不浪费。</li>
</ul>
<p>拿课上的 5 顶点无向图算一下：边 A–C、B–C、B–D、C–D，E 是孤立点，V = 5，E = 4。</p>
<ul>
<li>矩阵：5 个顶点各扫一行 5 格，共 5 × 5 = 25 格，其中只有 8 格是 1。</li>
<li>邻接表：每条无向边在两端各存一次，共 2E = 8 个结点，全走一遍是 8 步；加上看 5 个表头，也只有 13 步。</li>
</ul>
<p>推广开来，矩阵是 V 个顶点 × 每个 V 格 = <strong>O(V²)</strong>，和边数无关；邻接表是所有顶点的度数之和 2E，再加每个顶点的常数，<strong>O(V + E)</strong>。遍历类算法剩下的工作（标记、入队、出栈）对每个顶点、每条边只做常数次，所以总复杂度就由“找邻居”这一步决定。</p>

<h2>图算法总表</h2>
<table>
<thead><tr><th>算法</th><th>解决的问题</th><th>对图的要求</th><th>思路</th><th>关键数据结构</th></tr></thead>
<tbody>
<tr><td>DFS</td><td>遍历；可达性、连通分量、判环</td><td>任意</td><td>蛮力（遍历）</td><td>栈（递归调用栈）+ visited[]</td></tr>
<tr><td>BFS</td><td>遍历；无权图单源最短路（边数最少）</td><td>任意；求最短路时每条边代价相同</td><td>蛮力（遍历）</td><td>FIFO 队列 + visited[]，入队时标记</td></tr>
<tr><td>拓扑排序</td><td>线性顺序，每条边都从前指向后</td><td>有向无环图（DAG）</td><td>减治（删源点）</td><td>入度数组 + 入度为 0 的队列；DFS 版在结束时插到链表头</td></tr>
<tr><td>Dijkstra</td><td>单源最短路（single-source shortest paths, SSSP）</td><td>带权，边权 ≥ 0</td><td>贪心</td><td>最小优先队列（priority queue, PQ）+ dist[] + from[]</td></tr>
<tr><td>Warshall</td><td>传递闭包（transitive closure）：谁能到达谁</td><td>任意，只看边在不在</td><td>四类之外</td><td>V × V 的 0/1 矩阵</td></tr>
<tr><td>Floyd-Warshall</td><td>全源最短路（all-pairs shortest paths, APSP）</td><td>带权；允许负权边，不允许负权环</td><td>四类之外</td><td>V × V 距离矩阵，k 在最外层</td></tr>
<tr><td>Prim</td><td>最小生成树（minimum spanning tree, MST）</td><td>无向、连通、带权</td><td>贪心</td><td>最小 PQ + inMST[]，键是单条边的权</td></tr>
</tbody>
</table>
<p>每一行的要求都有原因：</p>
<ul>
<li><strong>DFS（深度优先搜索）</strong>：一条路走到底，走不通再退回上一个岔口，所以用栈。它只看边连着谁，对图没有要求。</li>
<li><strong>BFS（广度优先搜索）</strong>：先访问离起点 1 条边的顶点，再访问 2 条边的，一层层往外扩，所以用先进先出（FIFO）队列，第一次到达某个顶点时边数一定最少。边数最少等于代价最小，前提是每条边代价相同。课上约定<strong>入队时就标记</strong>，每个顶点只进队一次。</li>
<li><strong>拓扑排序（topological sort）</strong>：找一个入度为 0 的顶点（没有边指向它，叫源点 source）排在最前面，删掉它和它的出边，剩下的图再做同样的事，所以是减治。为什么必须是有向无环图（directed acyclic graph, DAG）？环上每个顶点前面都有一个必须先排的顶点，谁都当不了第一个。</li>
<li><strong>Dijkstra</strong>：每次从还没确定的顶点里取出离起点最近的一个，认定它的距离就是最终答案，这是贪心。认定的理由是：别的路线都要先经过更远的顶点，再加上非负的边，只会更长。有负权边时这个理由就不成立。例：A→B 权 2，A→C 权 3，C→B 权 −2。Dijkstra 先取出 B，认定距离是 2，但 A→C→B 只要 3 + (−2) = 1。</li>
<li><strong>Warshall</strong>：只问“i 能不能到 j”。第 k 轮允许路线经过第 k 个顶点中转：i 能到 k、k 能到 j，那 i 就能到 j。</li>
<li><strong>Floyd-Warshall</strong>：同样的三重循环，把“能不能到”换成“最短多远”，经过 k 中转更近就更新。它从不提前认定答案，所以负权边没问题；但有负权环时，绕着环多走一圈总价就更小，“最短”根本不存在。<strong>k 必须在最外层</strong>，因为第 k 轮要用第 k − 1 轮已经全部算完的矩阵。</li>
<li><strong>Prim</strong>：从一个顶点开始长一棵树，每次加入一条连接“树内”和“树外”的最便宜的边。它和 Dijkstra 几乎一样，区别在 PQ 的键：<strong>Prim 的键是单条边的权，Dijkstra 的键是从起点出发的总距离</strong>。图要无向、连通，才谈得上一棵连起所有顶点的树。</li>
<li>Warshall 和 Floyd-Warshall 通常归为<strong>动态规划（dynamic programming）</strong>：第 k 轮的矩阵由第 k − 1 轮的矩阵算出。这一类不在复习课的四类里，所以表中写“四类之外”。</li>
</ul>

<h3>换一种表示、换一种 PQ</h3>
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
<p>Dijkstra 和 Prim 的账一模一样：<strong>V 次取最小（deleteMin）+ 最多 E 次更新</strong>（每条边最多让一个顶点的键变小一次），再加上找邻居的代价。换一种 PQ，只是这两种操作的单价变了：</p>
<table>
<thead><tr><th>PQ</th><th>deleteMin 一次</th><th>更新一次</th><th>合计（邻接表）</th></tr></thead>
<tbody>
<tr><td>二叉堆</td><td>O(log V)</td><td>O(log V)</td><td>V log V + E log V = O((V + E) log V)</td></tr>
<tr><td>未排序数组</td><td>O(V)，要扫一遍</td><td>O(1)，直接改</td><td>V × V + E = O(V²)，因为 E ≤ V²</td></tr>
<tr><td>有序链表</td><td>O(1)，取表头</td><td>O(V)，删掉再按序插回</td><td>V + E × V = O(VE)，假设图连通（E ≥ V − 1）</td></tr>
</tbody>
</table>
<ul>
<li><strong>本课程默认 Dijkstra、Prim 是 O((V + E) log V)</strong>（二叉堆 + 邻接表）。Fibonacci 堆不考。用邻接矩阵时找邻居就要 O(V²)，堆版变成 O(V² + E log V)。</li>
<li><strong>堆不总是更好。</strong>稀疏图上堆版 O(V log V)，比数组版 O(V²) 快；稠密图上每条边的更新都要付 log V，堆版变成 O(V² log V)，反而比数组版 O(V²) 慢。</li>
<li>Floyd-Warshall 改用 E 表示：稠密图 V ≈ E<sup>1/2</sup>，得 Θ(E<sup>3/2</sup>)；稀疏图 V ≈ E，得 Θ(E³)。</li>
<li><strong>全源最短路也可以跑 V 次 Dijkstra</strong>：V × O((V + E) log V)。稀疏图是 O(V² log V)，比 Θ(V³) 好；稠密图是 O(V³ log V)，更差，而且不能有负权边。同理，Warshall 和“从每个顶点各做一次 BFS/DFS”（O(V² + VE)，最坏 O(V³)）相比没有渐近优势。</li>
</ul>

<h2>搜索算法与最优性</h2>
<p>这里的问题是：从一个起点找一个目标，<strong>找到的路径总代价是不是最小</strong>，是就叫最优（optimal）。几种搜索的差别只在“下一个从容器里取谁”：</p>
<table>
<thead><tr><th>算法</th><th>每次取出</th><th>最优？</th><th>条件</th></tr></thead>
<tbody>
<tr><td>BFS</td><td>最早入队的（FIFO 队列）</td><td>有条件</td><td>每一步代价都相同</td></tr>
<tr><td>DFS</td><td>最近加入的（栈）</td><td>否</td><td>找到的只是第一条路径</td></tr>
<tr><td>统一代价搜索（uniform-cost search, UCS）</td><td>从起点出发代价最小的（PQ）</td><td>是</td><td>代价非负；就是 Dijkstra 的一个版本，取出目标即停</td></tr>
<tr><td>IW（Assignment 3）</td><td>—</td><td>有条件</td><td>细节不考</td></tr>
</tbody>
</table>
<ul>
<li><strong>BFS</strong> 按“走了几步”从少到多地试，第一次碰到目标时步数最少。步数最少要等于代价最小，每一步的代价就得相同；所有边权都是 5 也算相同。</li>
<li><strong>DFS</strong> 顺着一条路一直往下钻，碰到目标就停，给出的只是碰到的第一条路径。</li>
<li><strong>统一代价搜索</strong>就是 Dijkstra，取出目标就停，所以同样要求代价非负。</li>
</ul>
<p>按起点和终点的个数，可以这样选：</p>
<ul>
<li><strong>一对一</strong>：上表四种。</li>
<li><strong>一对多</strong>（单源）：Dijkstra。有负权边时要用 Bellman-Ford，细节不考，只需知道什么时候需要它。</li>
<li><strong>多对多</strong>（全源）：Floyd-Warshall，或者从每个顶点各跑一次 Dijkstra。</li>
</ul>
<p>Prim 不在这个列表里：它求的是最小生成树，树上两点间的路径不一定是最短路。例：三角形 A–B 权 2、B–C 权 2、A–C 权 3。最小生成树取 A–B 和 B–C（总长 4），树上从 A 到 C 要走 2 + 2 = 4，而直接走 A–C 只要 3。</p>

<h2>递推式与主定理</h2>
<p>课上的“神秘算法”：T(n) = 9T(n/3) + n。读法是：一次调用发出 9 个递归调用（a = 9），每个处理 n/3 的规模（b = 3），递归之外还做 n 次操作（f(n) = n¹，d = 1）。比较 a 和 b<sup>d</sup>：b<sup>d</sup> = 3¹ = 3 &lt; 9 = a，落在第三种情况，T(n) ∈ Θ(n<sup>log₃ 9</sup>) = Θ(n²)。</p>
<p>主定理本身印在公式表上。考试时要自己做的，只是读出这三个数：</p>
<ul>
<li><strong>a</strong>：一次调用里<strong>实际发出</strong>几个递归调用。<code>return 3 * f(n / 2);</code> 只调用了一次，a = 1；<code>return f(n / 2) + f(n / 2) + f(n / 2);</code> 才是 a = 3。前者 Θ(log n)，后者 Θ(n<sup>log₂ 3</sup>) ≈ Θ(n<sup>1.58</sup>)，差得很远。</li>
<li><strong>b</strong>：每个子问题的规模是 n/b。对半分就是 b = 2。</li>
<li><strong>d</strong>：递归以外的工作（拆分 + 合并）是 Θ(n<sup>d</sup>)。扫一遍是 d = 1；<strong>只做常数次操作时 d = 0</strong>（因为 n⁰ = 1），不是 1。</li>
</ul>
<p>为什么比较的是 a 和 b<sup>d</sup>？把递归画成一棵树：每往下一层，子问题个数乘 a；每个子问题的规模变成 1/b，工作量就除以 b<sup>d</sup>。所以每一层的总工作是上一层的 a / b<sup>d</sup> 倍：</p>
<ul>
<li>a &lt; b<sup>d</sup>：一层比一层少，根上的工作占大头，Θ(n<sup>d</sup>)。</li>
<li>a = b<sup>d</sup>：每层一样多，共 log<sub>b</sub> n 层，Θ(n<sup>d</sup> log n)。</li>
<li>a &gt; b<sup>d</sup>：一层比一层多，最底层的叶子占大头，Θ(n<sup>log<sub>b</sub> a</sup>)。</li>
</ul>
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
<p>有三类不能直接套主定理：</p>
<ul>
<li><strong>规模减常数</strong>（T(n − 1) + …）：没有 n/b 可读，要用展开法（见 1.8）。例如 T(n − 1) + cn 展开成 c(n + (n − 1) + … + 1) = cn(n + 1)/2，是 Θ(n²)；2T(n − 1) + c 展开成 c(1 + 2 + 4 + … + 2<sup>n−1</sup>) = c(2ⁿ − 1)，是 Θ(2ⁿ)。</li>
<li><strong>子问题不等长</strong>：T(n/3) + T(2n/3) + n，例如一般情况下的快速排序，两边分得不一样大。</li>
<li><strong>f(n) 不是 n<sup>d</sup> 的形式</strong>：如 2T(n/2) + log n。</li>
</ul>

<h2>典型题讲解</h2>
<h3>一、给出最接近的 Big-O 上界</h3>
<p>题目不指明情况时，按最坏情况作答。</p>
<p><strong>(a) 快速排序（首元素作 pivot）排 n 个元素的时间：O(n²)。</strong>已排序或逆序的输入让每次的 pivot 都是最值。</p>
<p><strong>(b) 快速排序的额外空间：O(log n)。</strong>这是课上的答案，来自递归栈。题目若明确问最坏情况，栈深可达 n − 1，即 O(n)；旧参考答案写 O(1)，是不算栈的结果。作答时写一句用的是哪种定义。</p>
<p><strong>(c) 自底向上归并排序排 n 个取值范围为 r 的元素，额外空间：O(n)。</strong>临时数组长度是 n，与 r 无关。r 是干扰项，只有计数排序的空间取决于取值范围。</p>
<p><strong>(d) 插入排序排一个已排好序的数组：O(n)。</strong>每个元素比较 1 次就停。</p>
<p><strong>(e) 堆排序的额外空间：O(1)。</strong>堆建在原数组里。</p>
<p><strong>(f) 自适应归并排序的时间：O(n log n)。</strong>严格逆序时没有长度超过 1 的有序段，和自底向上归并一样要合并约 log₂ n 轮。Θ(n) 只是最好情况。</p>

<h3>二、情景选算法（用邻接表）</h3>
<p><strong>(a) 地铁网络里从一站到另一站，经过的区段最少：BFS，O(V + E)。</strong>每个区段代价相同，第一次到达目标时区段最少。</p>
<p><strong>(b) 有向图有负权边、没有负权环，求所有顶点对之间的最短距离：Floyd-Warshall，Θ(V³)。</strong>有负权边，跑 V 次 Dijkstra 不行。</p>
<p><strong>(c) 课程之间有先修关系，排一个可行的修课顺序：拓扑排序，O(V + E)。</strong>先修关系是 DAG，可行顺序通常不止一个。</p>
<p><strong>(d) 用总长度最短的电缆把所有楼连通：Prim，O((V + E) log V)。</strong>“全部连起来、总长最短”是最小生成树，不是两点间的最短路。</p>
<p><strong>(e) 道路长度都非负，求仓库到所有地点的最短距离：Dijkstra，O((V + E) log V)。</strong>单源、边权非负。</p>
<p><strong>(f) 求一个有向图里哪些顶点能到达哪些顶点：Warshall，Θ(V³)。</strong>结果就是传递闭包。也可以从每个顶点各做一次 BFS 或 DFS，O(V(V + E))，最坏同样是 O(V³)。</p>

<h3>三、换 PQ、换疏密</h3>
<p>Prim 和 Dijkstra 的 PQ 操作相同。问：(a) E ≈ V 时，二叉堆和未排序数组作 PQ 各要多久，选哪个？(b) E ≈ V² 时呢？(c) 用 E 表示 Floyd-Warshall 的运行时间。</p>
<p><strong>(a)</strong> 堆：(V + E) log V，代入 E ≈ V 得 <strong>O(V log V)</strong>。未排序数组：V 次 deleteMin 各扫 V 个，<strong>O(V²)</strong>。选<strong>堆</strong>。V = 1000 时约 2 × 10⁴ 对 10⁶。</p>
<p><strong>(b)</strong> 堆：(V + V²) log V = <strong>O(V² log V)</strong>。未排序数组仍是 <strong>O(V²)</strong>，与边数无关。选<strong>未排序数组</strong>（配邻接矩阵）。V = 1000 时约 10⁷ 对 10⁶。</p>
<p><strong>(c)</strong> 三重循环各 V 次，Θ(V³)。把 V 换成 E：稠密图 <strong>Θ(E<sup>3/2</sup>)</strong>，稀疏图 <strong>Θ(E³)</strong>。</p>

<h3>四、多选：哪些正确</h3>
<p>(A) 所有边权都是 5 的图上，BFS 找到的路径总代价最小；(B) 统一代价搜索在有负代价的图上仍然最优；(C) DFS 在无权图上找到的是边数最少的路径；(D) T(n) = 2T(n − 1) + 1 可以直接用主定理求解；(E) T(n) = 3T(n/3) + n ∈ Θ(n log n)；(F) T(n) = T(n/2) + n ∈ Θ(n log n)。</p>
<p>答案是 <strong>A、E</strong>。</p>
<ul>
<li><strong>A 对</strong>：每条边代价相同，总代价 = 5 × 边数，边数最少就是代价最小。</li>
<li><strong>B 错</strong>：统一代价搜索就是 Dijkstra 的一个版本。一个结点取出之后，可能经过负代价的边变得更便宜，“取出时就是最优”不再成立。</li>
<li><strong>C 错</strong>：三角形 A–B、A–C、B–C，从 A 出发按字母序先走 B，再从 B 到 C，得到 2 条边的路径，而 A–C 只要 1 条。</li>
<li><strong>D 错</strong>：规模是 n − 1，不是 n/b，要展开。T(1) = 1 时 T(n) = 2ⁿ − 1 ∈ Θ(2ⁿ)。</li>
<li><strong>E 对</strong>：a = 3，b = 3，d = 1，3 = 3¹，情况 2，Θ(n log n)。</li>
<li><strong>F 错</strong>：a = 1，b = 2，d = 1，1 &lt; 2¹，情况 1，Θ(n)。直观地看：n + n/2 + n/4 + … &lt; 2n。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>填空：最接近的 Big-O 上界</strong>（2015、2016 都考过）。不指明情况就按最坏情况答。题目给出的取值范围只影响计数排序。</li>
<li><strong>性质判断与配对</strong>：稳定、原地、自适应、思路逐格对表。说某算法不稳定时，要能举一个反例，比如选择排序的 [2a, 2b, 1]。</li>
<li><strong>情景 → 图算法</strong>：从描述里读出单源还是全源、有没有权、有没有负权、是不是 DAG、是不是要把所有点连起来。</li>
<li><strong>换 PQ 实现或换图的疏密</strong>：Dijkstra 用堆和有序链表（2015）、稀疏与稠密图上的最小生成树（2016）、Floyd-Warshall 用 E 表示（2015）。按“V 次 deleteMin + E 次更新”当场推。</li>
<li><strong>递推式</strong>：读代码写出 T(n)，再用主定理或展开法求 Θ，并写明是哪种情况。</li>
</ul>
<p>公式表上有主定理、等差与等比数列求和、对数恒等式、散列的探查次数估计。<strong>不在表上、要背的</strong>：两张总表的每一格、各图算法对图的要求、搜索算法的最优性、递推式表。</p>
<div class="callout warn" data-label="易错">
<ul>
<li>“快速排序 Θ(n log n)”只对最好和平均情况成立，最坏是 Θ(n²)。</li>
<li>归并排序、堆排序的比较次数随输入变化，但量级不变，不算自适应。</li>
<li>DFS 从不保证最短；Floyd-Warshall 的 k 必须是最外层循环。</li>
<li>拓扑排序的答案通常不止一个。</li>
<li>常数 f(n) 的 d 是 0，不是 1；把一个递归结果乘 3 不等于 a = 3。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li><strong>自适应 = 最好、最坏量级不同</strong>；做远距离交换的选择排序、快速排序、堆排序都不稳定。</li>
<li>比较排序平均不可能好于 Θ(n log n)；计数排序不比较键，Θ(n + K)。</li>
<li>邻接表找邻居 O(V + E)，矩阵 O(V²)。Dijkstra、Prim = V 次 deleteMin + E 次更新，默认 O((V + E) log V)；稠密图上数组版 O(V²) 更快。</li>
<li>BFS 要求边代价相同，Dijkstra 要求边权非负，Floyd-Warshall 不允许负权环，拓扑排序只对 DAG，Prim 求的不是最短路。</li>
<li>主定理读出 a（实际递归调用数）、b、d（常数工作时为 0），比较 a 和 b<sup>d</sup>；规模减常数时用展开法。</li>
</ul>
`;
