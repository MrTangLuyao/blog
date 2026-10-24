/* Post body — dsa-priority-queue / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-priority-queue:zh'] = `
<p class="lead">优先队列（priority queue）每次取出最重要的元素，用堆实现时放入和取出都是 O(log n)；借助堆还能从 n 个数里快速挑出最小的 k 个（Top-k）。</p>

<h2>从一个场景说起</h2>
<p>医院急诊室不是先到先看。先来的人扭了脚，后来的人心脏骤停，医生当然先救后者。</p>
<p>分诊护士给每个病人标一个紧急程度，医生每次叫的是<strong>当前最紧急</strong>的那位。谁先到，不重要。</p>
<p>换成数字：依次放入 5、9、2、7，再全部取出。普通队列（先进先出，FIFO）出来的是 5 9 2 7；“每次取最大的”那种队列出来的是 9 7 5 2。后者就是优先队列。</p>

<h2>它是什么</h2>
<p>简单说，<strong>优先队列就是一个“每次取出优先级最高的元素”的容器</strong>。它是抽象数据类型（abstract data type, ADT）：只规定能做哪些操作，不规定数据怎么存。</p>
<p>它由两部分组成：</p>
<ul>
<li><strong>元素和优先级（priority）</strong>：急诊室里，病人是元素，紧急程度是优先级。优先级可以就是元素本身的数值，也可以另附一个键，比如 Dijkstra 里“顶点 + 暂定距离”中的距离。</li>
<li><strong>一组操作</strong>：见下表（课上的叫法，教材不统一，按意思认）。</li>
</ul>
<table>
<thead><tr><th>操作</th><th>做什么</th></tr></thead>
<tbody>
<tr><td>insert(x)</td><td>放入一个元素</td></tr>
<tr><td>extractMax()</td><td>取出并返回优先级最高的元素</td></tr>
<tr><td>peek()</td><td>只看最高的，不取出</td></tr>
<tr><td>size()、isEmpty()</td><td>元素个数；是否为空</td></tr>
<tr><td>changeWeight(x, p)</td><td>把 x 的优先级改成 p</td></tr>
<tr><td>delete(x)</td><td>删掉任意一个元素，不一定是最大的</td></tr>
</tbody>
</table>
<p>课上默认是<strong>最大优先队列</strong>。想让小的先出怎么办？两个办法：用最小优先队列（extractMin，底层是最小堆 min-heap）；或者把优先级<strong>取负</strong>再放进最大优先队列，−2 &gt; −5，所以 2 比 5 先出。</p>

<h3>拿什么来实现</h3>
<p>想象一摞病历。<strong>不整理</strong>：新病历往上一扔就行，O(1)；可找最紧急的那份得从头翻到尾，O(n)。<strong>一直排好序</strong>：最紧急的就在一端，拿走 O(1)；可每来一份新病历都要找位置、把别的挪开，O(n)。</p>
<p>两种做法各有一个 O(n)。<strong>堆（heap）</strong>是折中：两个操作都是 O(log n)。</p>
<table>
<thead><tr><th>实现</th><th>insert</th><th>extractMax</th><th>peek</th></tr></thead>
<tbody>
<tr><td>无序数组 / 无序链表</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>有序数组（升序，最大在末尾）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>有序链表（降序，最大在表头）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td><strong>二叉堆（max-heap）</strong></td><td><strong>O(log n)</strong></td><td><strong>O(log n)</strong></td><td><strong>O(1)</strong></td></tr>
</tbody>
</table>
<p>堆的 insert 是放到末尾再 sift up，extractMax 是根和末尾交换、缩小、再 sift down（见 6.2）。log n 比 n 小得多：n = 10⁶ 时 log₂ n 才约 20。所以优先队列一般用堆来实现。</p>
<p>注意有序数组要把最大值放在<strong>末尾</strong>；放在下标 0，取出要整体左移，就成了 O(n)。</p>
<div class="callout key" data-label="考点">堆实现的优先队列：insert O(log n)（最好 Θ(1)，新元素不大于父结点时不用动），extractMax O(log n)，peek O(1)。<strong>优先队列是 ADT，堆是实现它的数据结构</strong>，匹配题里不能混。</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/wptevk0bshY" title="Priority Queue Introduction" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：WilliamFiset《Priority Queue Introduction》（英文，约 13 分钟），讲优先队列是什么、为什么用堆实现、各操作的代价，也讲了取负把最小优先队列变成最大优先队列。视频以最小堆为主，课上默认最大堆，两者对称。</p>

<h2>看个例子：找最小的 k 个</h2>
<p>问题：从 n 个数里找出最小的 k 个（k &lt; n），这叫 Top-k 问题。先排序再取前 k 个也行，但要 O(n log n)，做了很多多余的事。</p>
<p>课上的投票题给了两种用堆的做法，<strong>两个都算对</strong>。</p>

<h3>做法一：全部建最小堆，取 k 次</h3>
<p>把 n 个数自底向上建成最小堆，O(n)（见 6.3）。根就是最小值，extractMin 做 k 次，每次 O(log n)。合计 <strong>O(n + k log n)</strong>，第 k 次取出的就是第 k 小。</p>

<h3>做法二：大小为 k 的最大堆</h3>
<p>求最小的，却用<strong>最大堆</strong>，这是最常考的一点。</p>
<p>把它想成一份只有 k 个名额的候选名单。名单里最大的数就是进名单的门槛，正好放在最大堆的根上。新来的数 x 只和根比一次：</p>
<ul>
<li><strong>x &lt; 根</strong>：根被挤出名单。x 替换根，再 sift down，O(log k)。</li>
<li><strong>x ≥ 根</strong>：x 连门槛都过不了，直接丢掉，O(1)。</li>
</ul>
<p>课上的例子：n = 10，k = 4，输入 8 15 3 22 10 17 1 12 5 30。前 4 个数自底向上建成最大堆 [22, 15, 3, 8]（下标从 1 开始），之后一个一个来：</p>
<table>
<thead><tr><th>x</th><th>与根比较</th><th>动作</th><th>堆数组</th></tr></thead>
<tbody>
<tr><td>10</td><td>10 &lt; 22</td><td>淘汰 22；10 下沉，与 15 交换</td><td>[15, 10, 3, 8]</td></tr>
<tr><td>17</td><td>17 ≥ 15</td><td>丢弃</td><td>[15, 10, 3, 8]</td></tr>
<tr><td>1</td><td>1 &lt; 15</td><td>淘汰 15；1 下沉，先与 10、再与 8 交换</td><td>[10, 8, 3, 1]</td></tr>
<tr><td>12</td><td>12 ≥ 10</td><td>丢弃</td><td>[10, 8, 3, 1]</td></tr>
<tr><td>5</td><td>5 &lt; 10</td><td>淘汰 10；5 下沉，与 8 交换</td><td>[8, 5, 3, 1]</td></tr>
<tr><td>30</td><td>30 ≥ 8</td><td>丢弃</td><td>[8, 5, 3, 1]</td></tr>
</tbody>
</table>
<p>最后堆里是 {1, 3, 5, 8}，根 8 正好是第 4 小。注意堆里的数<strong>没有排好序</strong>，要有序输出还得再做 k 次 extractMax，多花 O(k log k)。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-priority-queue/anims/topk-stream.html" loading="lazy" style="height: 540px;" title="Top-k 数据流筛选"></iframe>
<p class="anim-caption">逐帧看每个新数怎样和根比较、替换根或被丢掉；再切到“降序：最坏”和“升序：最好”，对比替换次数和交换次数。</p>

<p>代价怎么算？建堆 O(k)。剩下 n − k 个数各和根比一次；最坏情况是输入降序，每个数都替换根并沉到底，每次 O(log k)。合计 O(k + (n − k) log k) = <strong>O(n log k)</strong>。最好情况是输入升序，建好堆后一次都不替换，Θ(n)。</p>
<p>代码就是 sift down 加一个循环：</p>
<pre><code>/* max-heap in H[1..k]; siftdown(H, size, i) as in 6.2 */
void k_smallest(const int A[], int n, int k, int H[]) {
    for (int j = 0; j &lt; k; j++)          /* first k items */
        H[j + 1] = A[j];
    for (int i = k / 2; i &gt;= 1; i--)     /* bottom-up build: O(k) */
        siftdown(H, k, i);
    for (int j = k; j &lt; n; j++) {
        if (A[j] &lt; H[1]) {               /* beats the largest candidate */
            H[1] = A[j];                 /* old root thrown away */
            siftdown(H, k, 1);           /* O(log k) */
        }                                /* else A[j] is discarded */
    }
}</code></pre>
<ul>
<li>第 3–4 行：前 k 个数抄进 H[1..k]。本课堆数组从下标 1 开始，H 要留 k + 1 个位置。</li>
<li>第 5–6 行：从 k/2 往前逐个 sift down，自底向上建成最大堆，O(k)。</li>
<li>第 7–8 行：其余的数逐个和根 H[1] 比。</li>
<li>第 9–10 行：比根小，就覆盖根（旧根被淘汰），再把新根沉下去；否则什么也不做。</li>
<li>结束时 H[1..k] 是最小的 k 个，H[1] 是第 k 小。</li>
</ul>

<h3>两种做法怎么选</h3>
<ul>
<li><strong>时间</strong>：只看 Big-O，做法一从不更差。k 是常数时两者都是 O(n)；k = √n 时做法一是 O(n)，做法二是 O(n log n)。</li>
<li><strong>空间</strong>：做法一要 O(n) 额外空间（或打乱原数组）；做法二只要 O(k)，数据只读一遍，适合一个一个到来的数据流（stream）。</li>
<li><strong>求最大的 k 个</strong>：镜像过来，用大小为 k 的最小堆，或全部建最大堆再取 k 次。</li>
</ul>

<h2>补充：改优先级和任意删除</h2>
<p>病人病情加重了，得先找到他。可堆只保证“父 ≥ 子”，要找的元素可能在任何位置，只能扫一遍，O(n)。</p>
<p>课上的办法：另配一张<strong>辅助表：元素 → 它在堆数组里的下标</strong>（课上用哈希表；元素是顶点编号 0…V−1 时，一个数组 pos[] 就够）。每交换两个槽位，就同步更新这两个下标。找到位置后：</p>
<ul>
<li><strong>changeWeight</strong>：直接改值。最大堆里变大了就 sift up，变小了就 sift down，O(log n)。</li>
<li><strong>delete(x)</strong>：把末尾元素换到 x 的位置，堆大小减 1，换过来的元素再 sift up <strong>或</strong> sift down，O(log n)。</li>
</ul>
<p>例：6.1 的堆 [27, 24, 26, 7, 12, 6, 19, 2, 7, 7]，把 6（下标 6）改成 30。30 &gt; 父 26，交换；30 &gt; 父 27，交换；到根，得 [30, 24, 27, 7, 12, 26, 19, 2, 7, 7]。</p>
<div class="callout warn" data-label="易错">删除后换过来的元素可能要<strong>上浮</strong>。最大堆 [30, 10, 25, 8, 9, 20, 22] 删除 8（下标 4）：末尾的 22 换到下标 4，大小变 6。它的新父结点是 10，22 &gt; 10，要上浮一层，得 [30, 22, 25, 10, 9, 20]。课上只说了“与末尾交换再 sift down”，代码里两个方向都要调用，最多只有一个会真的移动。</div>

<h2>补充：图算法里的优先队列</h2>
<p>Dijkstra（7.5）和 Prim（7.7）都用<strong>最小</strong>优先队列。每个顶点被取出一次，共 V 次 extractMin；每条边最多让一个顶点的键变小一次（decrease-key，考题里叫 update，就是 changeWeight），最多 E 次。所以：</p>
<p><strong>总时间 ≈ V × extractMin 的代价 + E × update 的代价</strong>。换一种实现，就是换这两个单次代价：</p>
<table>
<thead><tr><th>PQ 实现</th><th>extractMin</th><th>update</th><th>总时间</th></tr></thead>
<tbody>
<tr><td>二叉堆 + 下标表</td><td>O(log V)</td><td>O(log V)</td><td><strong>O((V + E) log V)</strong></td></tr>
<tr><td>无序数组（直接用 dist[]）</td><td>O(V)</td><td>O(1)</td><td>O(V² + E) = <strong>O(V²)</strong></td></tr>
<tr><td>有序链表</td><td>O(1)</td><td>O(V)</td><td>O(V + VE) = <strong>O(VE)</strong></td></tr>
<tr><td>平衡 BST（如 AVL）</td><td>O(log V)</td><td>O(log V)</td><td><strong>O((V + E) log V)</strong></td></tr>
</tbody>
</table>
<p>稀疏图（sparse，E ≈ V）用堆是 O(V log V)，比 O(V²) 好得多；稠密图（dense，E ≈ V²）用堆是 O(V² log V)，反而不如无序数组。其他用途：任务调度、AI 规划（planning）、Huffman 编码。</p>

<h2>考试怎么考</h2>
<p>选择、填空问各实现的代价（公式表上没有，要记住，或从“插入要挪位置、取最大要扫一遍”当场推）；简答写 Top-k 两种做法的复杂度；长题问 Dijkstra 或 Prim 换一种优先队列后的复杂度（2015、2016 年都考过）；算法设计题在数据流里找前 k 名。</p>

<h3>例题 1：Dijkstra 换优先队列（往年题改编）</h3>
<p>Dijkstra 用一个按距离排好序的链表作优先队列，时间复杂度是多少？换成堆呢？用 V、E 表示。</p>
<ul>
<li>先数操作次数：V 次 extractMin，最多 E 次 update。</li>
<li><strong>有序链表</strong>：最小值在表头，extractMin 是 O(1)，共 O(V)。update 让某个顶点的距离变小，它在链表里的位置就不对了，要摘下来、再从头走到新位置插回去，O(V)，最多 E 次，共 O(VE)。合计 O(V + VE) = <strong>O(VE)</strong>。</li>
<li><strong>堆</strong>（配下标表）：两种操作都是 O(log V)，合计 <strong>O((V + E) log V)</strong>。</li>
</ul>
<p>问 Prim 用平衡 BST 也一样算：取最左结点和 update（删旧键、插新键）都是 O(log V)，答 O((V + E) log V)。每种操作的单次代价都要写出来。</p>

<h3>例题 2：手算 Top-k</h3>
<p>用大小为 3 的最大堆，从 12 4 9 20 7 15 2 11 6 3 中找最小的 3 个。写出最终的堆数组，根被替换了几次？第 3 小是几？</p>
<p>前 3 个 [12, 4, 9] 已经满足最大堆，建堆不用交换。之后：</p>
<pre><code class="lang-text">20 ≥ 12  丢弃                          [12, 4, 9]
 7 &lt; 12  替换根，7 与较大的孩子 9 交换    [9, 4, 7]
15 ≥ 9   丢弃                          [9, 4, 7]
 2 &lt; 9   替换根，2 与较大的孩子 7 交换    [7, 4, 2]
11 ≥ 7   丢弃                          [7, 4, 2]
 6 &lt; 7   替换根，6 ≥ 孩子 4 和 2，不动    [6, 4, 2]
 3 &lt; 6   替换根，3 与较大的孩子 4 交换    [4, 3, 2]</code></pre>
<p>最终堆数组 <strong>[4, 3, 2]</strong>，根被替换 <strong>4</strong> 次（7、2、6、3）。最小的 3 个是 {2, 3, 4}，第 3 小就是根 <strong>4</strong>。复杂度 O(n log k)，额外空间 O(k)。</p>
<div class="callout warn" data-label="易错">
<ul>
<li>求最小的 k 个用大小为 k 的<strong>最大堆</strong>，新元素只和根比。</li>
<li>sift down 时和<strong>较大</strong>的孩子交换（最大堆）。</li>
<li>extractMax 是 O(log n)；O(1) 的是 peek。</li>
<li>在堆里找任意元素是 O(n)；changeWeight、delete 能做到 O(log n)，前提是有“元素 → 下标”表。</li>
<li>Top-k 答 O(n log n) 等于直接排序，不是想要的答案。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>优先队列是 ADT：每次取出优先级最高的元素。堆是实现它的数据结构。</li>
<li>无序实现 insert O(1)、取出 O(n)；有序实现 insert O(n)、取出 O(1)；堆两者都是 O(log n)，peek O(1)。</li>
<li>小的先出：用最小堆，或者把优先级取负。</li>
<li>changeWeight / delete：先用“元素 → 下标”表定位，再 sift up 或 sift down，O(log n)。</li>
<li>最小的 k 个：全部建最小堆再取 k 次，O(n + k log n)；大小为 k 的最大堆扫一遍，O(n log k)，空间 O(k)。</li>
<li>图算法总时间 = V × extractMin + E × update：Dijkstra 用堆 O((V + E) log V)，用有序链表 O(VE)。</li>
</ul>
`;
