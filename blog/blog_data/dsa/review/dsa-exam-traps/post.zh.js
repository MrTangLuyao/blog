/* Post body — dsa-exam-traps / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-exam-traps:zh'] = `
<p class="lead">陷阱题大多出自三种错误：把 O、Ω、Θ 和最好、最坏情况混为一谈；把在一个结点或一种输入上成立的结论推广到全部；把算法用在不满足前提的输入上（带权图跑 BFS，负权边跑 Dijkstra）。这类题都能用一个很小的反例或一行推理判定。</p>

<h2>复杂度与查找</h2>

<details class="qa">
<summary class="ripple-surface">1. 有序数组上的二分查找（binary search），考虑所有输入，哪一项<strong>不</strong>正确？ A. O(log n)　B. O(n)　C. Ω(1)　D. Θ(log n)</summary>
<div class="qa__body"><p><strong>D。</strong>目标恰好是第一次探测的中间元素时只比较 1 次，运行时间没有 log n 的下界，不分情况的 Θ(log n) 不成立；只能说“最坏 Θ(log n)，最好 Θ(1)”。B 是松但正确的上界，C 对任何算法都成立（见 1.7）。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 有序数组和链表各存 n 个不同元素（数组末尾有空位）。在已有元素 X 的紧后面插入新元素，<strong>最好情况</strong>各是多少？</summary>
<div class="qa__body"><p><strong>数组 Θ(log n)，链表 Θ(1)；最坏两者都是 O(n)。</strong>数组的“二分 1 次命中”要 X 在正中（此时要移约 n/2 个），“不用移位”要 X 在末尾（二分要约 log₂ n 次），不是同一个 X，不能各取最好再相加（实算见练习 1）。链表的 X 是头结点时比较 1 次，接上 O(1)。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 判断（n 很大）：(a) 目标在数组中时，有序数组上的二分查找总比无序数组上的顺序查找（sequential search）比较次数少；(b) 目标不在数组中时，同一说法成立。</summary>
<div class="qa__body"><p><strong>(a) 错，(b) 对。</strong>(a)：目标恰是无序数组的第一个元素时，顺序查找 1 次，二分可能要约 log₂ n 次。(b)：顺序查找必须看完全部 n 个才能断定不在，二分最多约 log₂ n 次。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 动态数组满了就把容量变成 3 倍（而不是 2 倍），尾部插入的均摊（amortised）复杂度是多少？每次只加 100 格呢？</summary>
<div class="qa__body"><p><strong>×3 仍是均摊 O(1)；+100 是均摊 O(n)。</strong>×3 时一次 O(n) 的复制之后约 2n 次插入不用扩容，复制总量是等比数列，不超过常数 × n。+100 则每 100 次插入复制一遍，总量约 n²/200。从容量 1 开始插入 10⁶ 个：×2 共复制 1048575 次，×3 共 797161 次，+100 约 5.0 × 10⁹ 次。</p></div>
</details>

<h2>树</h2>

<details class="qa">
<summary class="ripple-surface">5. 在一棵二叉搜索树（Binary Search Tree, BST）中查找一个键，时间复杂度是多少？</summary>
<div class="qa__body"><p><strong>O(n)。</strong>题目没说平衡：按升序插入 1, 2, …, n 得到一条向右的链，查找 n 要比较 n 次。O(log n) 只对平衡树（如 AVL 树）有保证。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">6. 一棵 BST 的根，左子树高 4，右子树高 3。哪项<strong>一定</strong>成立？ A. 这是 AVL 树　B. 根满足 AVL 条件　C. 这不是 AVL 树</summary>
<div class="qa__body"><p><strong>B。</strong>|4 − 3| = 1 只说明根平衡，AVL 条件要对<strong>每个</strong>结点成立。左子树若是 4 个结点向左连成的链，链顶结点左高 3、右高 0，就失衡了；左右子树若都是合法的 AVL 树，整棵树又是 AVL 树，所以 A、C 都不一定。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">7. 给出一棵大 BST 和 4 个候选序列，问哪个是 in-order 遍历结果。最快怎么答？</summary>
<div class="qa__body"><p><strong>选从小到大排好序的那个。</strong>BST 的 in-order（左、根、右）一定按键升序输出，不用逐个结点模拟；pre-order、post-order 没有这个性质。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">8. 用课上的递归 in-order 代码（进入函数先判断 <code>t == NULL</code> 就返回）遍历 n 个结点的二叉树，visit 和 inorder 各被调用几次？</summary>
<div class="qa__body"><p><strong>visit n 次，inorder 2n + 1 次。</strong>每个真实结点对左右孩子各调用一次，共 2n 次，再加上对根的 1 次；也可数成 n 次真实调用加 n + 1 个空指针上的调用。7 个结点的满二叉树实测 15 次。若改成调用前先判断孩子非空，只调用 n 次（见 3.2）。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">9. 判断：B 树（B-tree）每个结点存的键越多，查找的复杂度类就越低。</summary>
<div class="qa__body"><p><strong>错。</strong>高度约 log<sub>m</sub> n = log n / log m，只少了常数因子；结点内二分又要约 log₂ m 次比较，相乘仍约 log₂ n。n = 10⁶、m = 100：二叉树约 20 层；B 树 3 层，每层约 6.6 次比较，合计仍约 20 次。B 树省的是<strong>访问结点（读磁盘块）的次数</strong>。</p></div>
</details>

<h2>哈希</h2>

<details class="qa">
<summary class="ripple-surface">10. 整数键，哈希表是长 100 的数组。哪个哈希函数（hash function）最好？ A. k mod 100　B. (1000k) mod 100　C. (k + 7) mod 100　D. (37k) mod 83　E. (37k) mod 100</summary>
<div class="qa__body">
<p><strong>E（课程给的答案）。</strong>B 恒为 0，所有键挤进一个槽。C 只是把 A 整体平移，分布不变。D 只用得到 0…82，浪费 17 个槽。E 用满 100 个槽，乘数 37 是与 100 互素的素数。表长已定为 100 就模 100，不要为了“模素数”改模一个更小的素数。</p>
<p>注意：37 与 100 互素，k ↦ 37k mod 100 只是重排 100 个余数，每槽的键数与 A 相同；好处是拆开连续的键（1, 2, 3 → 37, 74, 11），开放寻址（open addressing）时不易连成长串（见 4.4）。</p>
</div>
</details>

<h2>堆</h2>

<details class="qa">
<summary class="ripple-surface">11. 向课上的最大堆（max-heap）[27, 24, 26, 7, 12, 6, 19, 2, 7, 7]（下标从 1 起）插入 6。它落在下标 11，是 12 的右孩子，左边的兄弟是 7。要交换吗？</summary>
<div class="qa__body"><p><strong>不用，0 次交换。</strong>上浮（sift up）只和父结点比：12 ≥ 6，堆条件成立。兄弟 7 更大也无关：<strong>兄弟之间从不比较</strong>，堆不要求同层有序。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">12. 删除最大值后根换成了 7，两个孩子是 24 和 26。下沉（sift down）时 7 和谁交换？</summary>
<div class="qa__body">
<p><strong>和较大的孩子 26。</strong>若与 24 交换，24 成了 26 的父结点，立刻违反堆条件；与较大者交换，三者中的最大值到了上面，另一个孩子本来就不比它大。代码先选出较大的孩子，再只和它比较：</p>
<pre><code>int c = 2 * i;                        /* left child of i */
if (c + 1 &lt;= n &amp;&amp; H[c + 1] &gt; H[c]) {  /* right child exists and is larger */
    c = c + 1;
}
/* compare H[i] with H[c] only; swap if H[i] &lt; H[c] */</code></pre>
<p>漏掉 <code>c + 1 &lt;= n</code> 会把堆外的元素（如刚删掉、仍留在数组里的最大值）当成右孩子。</p>
</div>
</details>

<h2>排序</h2>

<details class="qa">
<summary class="ripple-surface">13. 快速排序（quicksort）需要多少额外空间？它稳定（stable）吗？</summary>
<div class="qa__body"><p><strong>平均 O(log n)，来自递归调用栈；不稳定。</strong>划分本身原地进行，但递归平均约 log n 层，每层保存常数个量，所以不是 O(1)（首元素作 pivot、输入已排好序时深度约 n）。划分的远距离交换可能越过相等的键。算不算原地（in-place），课上两种答法都接受，要写明用哪个定义。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">14. 判断：归并排序（merge sort）稳定且原地。</summary>
<div class="qa__body"><p><strong>错：稳定，但不原地。</strong>合并时遇到相等取左边子数组的元素，相对顺序不变；但要复制到辅助数组，额外空间 O(n)。最好、平均、最坏都是 Θ(n log n)，不是自适应（adaptive）的。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">15. 输入已经排好序时，插入排序（insertion sort）和选择排序（selection sort）各比较多少次？</summary>
<div class="qa__body"><p><strong>插入排序 n − 1 次，Θ(n)；选择排序仍是 n(n − 1)/2 次，Θ(n²)。</strong>插入排序每个新元素和前一个比一次就停，是自适应的。选择排序每轮都要扫完剩余部分才知道最小值，与输入无关，交换恰好 n − 1 次。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">16. 选择排序稳定吗？插入排序呢？</summary>
<div class="qa__body"><p><strong>选择排序不稳定，插入排序稳定。</strong>反例 2₁, 2₂, 1：第一轮最小值 1 与 2₁ 交换，得 1, 2₂, 2₁，两个 2 的顺序反了。插入排序只把新元素移过<strong>严格大于</strong>它的元素，遇到相等就停；内层条件若写成 <code>A[j] &gt;= val</code> 就不稳定了。</p></div>
</details>

<h2>图</h2>

<details class="qa">
<summary class="ripple-surface">17. 关于深度优先搜索（DFS），哪些正确？ A. 总能找到两点间的最短路　B. 一层一层访问顶点　C. 在连通图中能访问到每个顶点　D. 只适用于有向图　E. 只适用于带权图</summary>
<div class="qa__body"><p><strong>只有 C。</strong>A 的反例：三角形 A–B、B–C、A–C，按字母序从 A 出发走 A→B→C，到 C 用了 2 条边，而 A–C 直接相连。B 是 BFS 的性质。DFS 对有向、无向、带权、无权的图都适用。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">18. 广度优先搜索（BFS）中，顶点应在什么时候标记为已访问？</summary>
<div class="qa__body"><p><strong>入队时，而不是出队时。</strong>课上的图从 A 出发：A 出队时 B、C、D 入队；B 出队时 C 还在队里、尚未访问，若出队才标记，C 会第二次入队、被访问两次。入队即标记保证每个顶点只入队一次，长 V 的数组就够做队列（见 7.4）。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">19. 判断：BFS 求出的是从起点到每个顶点的最短路径。</summary>
<div class="qa__body"><p><strong>只在无权图（或所有边权相等）里对。</strong>BFS 求的是边数最少。课上反例：A–C 权 10，A–B 3，B–D 2，D–C 2。BFS 认为 A→C 一步到达，代价 10；绕路 A→B→D→C 只要 7。非负带权图要用 Dijkstra。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">20. 有负权边时，Dijkstra 和 Floyd-Warshall 还能用吗？</summary>
<div class="qa__body"><p><strong>Dijkstra 不能；Floyd-Warshall 能，只要没有负环（negative cycle）。</strong>Dijkstra 取出一个顶点就定稿，依据是“之后再绕路只会更长”，负权边打破了这一点（反例见 7.5）。Floyd-Warshall 不怕负权边和普通的环；负环则能无限绕圈让总权变小，最短路不存在。单源且有负权边时用 Bellman-Ford（细节不考）。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">21. 关于 Floyd-Warshall，哪些正确？ A. 三重循环顺序任意　B. 最外层是中转点 k，里面是 i、j　C. 最外层是起点 i，然后是 k、j　D. 只适用于有向无环图（DAG）</summary>
<div class="qa__body"><p><strong>只有 B。</strong>第 k 轮的含义是“允许用前 k 个顶点中转”，每轮更新整张表，所以 k 必须在最外层（反例见练习 2）。D 错：有环没关系，只是不能有负环。复杂度 O(V³)。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">22. 判断：最小生成树（Minimum Spanning Tree, MST）上两点之间的路径，就是这两点间的最短路径。</summary>
<div class="qa__body"><p><strong>错。</strong>三角形 A–B 2、B–C 2、A–C 3：MST 是 {A–B, B–C}，总权 4（含 A–C 的两棵生成树都是 5）。MST 上 A 到 C 走 A–B–C，长 4；最短路是直接走 A–C，长 3。MST 最小化整张网的总权，不管任意两点的距离。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">23. 判断：(a) 任何有向图都有拓扑序；(b) 一个 DAG 的拓扑序（topological order）唯一。</summary>
<div class="qa__body"><p><strong>都错。</strong>(a)：有环就不可能让每条边都从左指向右，拓扑排序只对 DAG 有定义。(b)：通常有很多个（穿衣服的例子里 5 件衣物入度为 0，哪件先穿都行）。检验：把每条边画出来，全部从左指向右就合法（练习 3）。</p></div>
</details>

<details class="qa">
<summary class="ripple-surface">24. 有向图所有顶点的入度（in-degree）之和与出度（out-degree）之和是什么关系？</summary>
<div class="qa__body"><p><strong>相等，都等于边数 E。</strong>每条边 u→v 给 u 的出度、v 的入度各加 1。例：A→C、A→E、B→D、B→E、C→D、C→E，入度 0 + 0 + 1 + 2 + 3 = 6，出度 2 + 2 + 2 + 0 + 0 = 6。无向图每条边让两端的度各加 1，度数之和为 2E。</p></div>
</details>

<h2>考试怎么考</h2>
<ul>
<li><strong>题型</strong>：单选“哪一项<strong>不</strong>正确”；多选“选出所有正确的说法 / 所有合法的拓扑序”；判断带“总是”“一定”“任意”的句子；匹配题把算法和前提配对（BFS—无权，Dijkstra—非负权，Floyd-Warshall—无负环，拓扑排序—DAG）。</li>
<li><strong>先圈限定词</strong>：“一棵 BST”指任意 BST，最坏 O(n)；不分情况的 Θ 要对所有输入成立；“根满足”不等于“每个结点满足”；先看清问的是 O 还是 Ω。</li>
<li><strong>判错靠反例</strong>：三角形（DFS 不求最短路，MST ≠ 最短路）、2₁ 2₂ 1（选择排序不稳定）、根下两条等长长链（只查根不算平衡，查找仍约 n/2 步）、带权的四顶点环（BFS 不能用于带权图）。</li>
<li><strong>公式表上有</strong>对数恒等式、等差与等比求和、主定理、探测次数 1/(1 − α) 与 1/(1 − α)²。<strong>要背的</strong>是课程约定（叶子高度 1、堆数组从下标 1 起、BFS 入队即标记）、各排序的稳定 / 原地性质，以及各图算法的前提和复杂度。</li>
<li><strong>遍历顺序题</strong>：没说“按字母序”时任何合法顺序都给分；说了就必须照做。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 有序数组 A[0..14] 存 15 个不同元素，二分查找取 mid = (lo + hi)/2，命中即停。(a) X = A[7] 和 X = A[14] 各要比较几次？(b) 在 X 紧后面插入新元素，“比较次数 + 移动元素个数”最少是多少？X 在哪里？(c) 由此说明最好情况为什么是 Θ(log n)。</summary>
<div class="qa__body">
<p>(a) A[7] 是第一次探测的位置，<strong>1 次</strong>。A[14] 依次探测下标 7、11、13、14，<strong>4 次</strong>。</p>
<p>(b) 插在 A[i] 后面，要把 A[i + 1..14] 共 14 − i 个元素各右移一格。部分位置：</p>
<table>
<thead><tr><th>X</th><th>探测的下标</th><th>比较</th><th>移动</th><th>合计</th></tr></thead>
<tbody>
<tr><td>A[0]</td><td>7, 3, 1, 0</td><td>4</td><td>14</td><td>18</td></tr>
<tr><td>A[7]</td><td>7</td><td>1</td><td>7</td><td>8</td></tr>
<tr><td>A[11]</td><td>7, 11</td><td>2</td><td>3</td><td>5</td></tr>
<tr><td>A[13]</td><td>7, 11, 13</td><td>3</td><td>1</td><td>4</td></tr>
<tr><td>A[14]</td><td>7, 11, 13, 14</td><td>4</td><td>0</td><td>4</td></tr>
</tbody>
</table>
<p>15 个位置逐个算，最小值是 <strong>4</strong>，在 X = A[13] 或 A[14]。只比较 1 次的 A[7] 合计反而是 8。</p>
<p>(c) 比较少的位置在中间，要移约 n/2 个；移动少的位置在末尾附近，二分要约 log₂ n 步才到。两者不能兼得，最好情况是 Θ(log n)，不是 Θ(1)。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 下面的 Floyd-Warshall 把 i 放在了最外层。有向图只有三条边 A→C 1、C→B 1、B→D 1（A–D 编号 0–3，对角线 0，无边处 INF = 1000000）。运行后 D[A][D] 是多少？正确值是多少？为什么不同？</summary>
<div class="qa__body">
<pre><code>for (int i = 0; i &lt; n; i++)            /* i outermost: WRONG */
    for (int k = 0; k &lt; n; k++)
        for (int j = 0; j &lt; n; j++)
            if (D[i][k] + D[k][j] &lt; D[i][j])
                D[i][j] = D[i][k] + D[k][j];</code></pre>
<p><strong>错误顺序</strong>，i = A 这一行：</p>
<ul>
<li>k = A：没有更新。k = B：D[A][B] 还是 INF，经 B 无从更新。</li>
<li>k = C：D[A][B] = D[A][C] + D[C][B] = 1 + 1 = 2；D[A][D] = 1 + D[C][D]，而 C 行要等 i = C 才处理，此时 D[C][D] 仍是 INF，不更新。</li>
<li>k = D：D[A][D] 是 INF，没有更新。</li>
</ul>
<p>之后 i = C、k = B 时 D[C][D] 才变成 2，但 A 行再也不会被处理，<strong>D[A][D] 停在 INF</strong>，即判成 A 到不了 D。</p>
<p><strong>正确顺序</strong>（k 在最外层）：k = B 一轮先把 C→B→D 写进 D[C][D] = 2；k = C 一轮再拼上 A→C，得 D[A][B] = 2、D[A][D] = 1 + 2 = <strong>3</strong>。i 在外层时，A 行用到的 C 行还没更新，而 A 行算完就不再回头。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 有向图 6 个顶点，边 A→D、B→D、B→E、C→E、D→F、E→F。选出所有合法的拓扑序：(a) A B C D E F　(b) C B E A D F　(c) B A D C E F　(d) A D B C F E　(e) B E C A D F</summary>
<div class="qa__body">
<p><strong>(a)(b)(c)。</strong>逐条检查 6 条边是否都从左指向右：(d) 中 F 在 E 前，违反 E→F；(e) 中 E 在 C 前，违反 C→E。</p>
<ul>
<li>源点删除法（反复取入度为 0 的顶点），平局按字母序：初始 A、B、C 入度为 0。取 A（D 剩 1）；取 B（D 变 0，E 剩 1）；此时 C、D 为 0，取 C（E 变 0）；再取 D、E（F 变 0）；最后 F。得 (a)。</li>
<li>基于 DFS 的方法，按字母序：explore(A) → D → F，结束顺序 F、D、A；再 explore(B) → E，结束 E、B；最后 C。结束顺序 F D A E B C，反转得 C B E A D F，即 (b)。</li>
<li>(c) 两种方法按字母序都不会直接给出，但同样合法。这张图共有 16 个合法拓扑序。</li>
</ul>
</div>
</details>
`;
