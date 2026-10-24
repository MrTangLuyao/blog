/* Post body — dsa-priority-queue / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-priority-queue:zh'] = `
<p class="lead">优先队列（priority queue）每次取出优先级最高的元素，而不是最早进来的元素。用二叉堆（binary heap）实现时，insert 和 extractMax 都是 O(log n)。同样借助堆，从 n 个数里挑出最小的 k 个只要 O(n log k) 时间和 O(k) 额外空间。</p>

<h2>从队列到优先队列</h2>
<p>依次放入 5、9、2、7，再全部取出。普通队列按到达顺序出队：5 9 2 7。<strong>最大优先队列</strong>每次取当前最大的：9 7 5 2。出队顺序只由<strong>优先级（priority）</strong>决定，与到达先后无关，所以它不是 FIFO。优先级可以就是元素本身的数值，也可以是另附的一个键，例如 Dijkstra 中“顶点 + 暂定距离”里的距离。</p>
<p>优先队列是抽象数据类型（abstract data type, ADT），只规定有哪些操作。下面是课上的操作名，教材的叫法不统一，按含义辨认即可：</p>
<table>
<thead><tr><th>操作</th><th>含义</th></tr></thead>
<tbody>
<tr><td>insert(x)</td><td>放入一个元素（对应队列的 enqueue）</td></tr>
<tr><td>extractMax()</td><td>取出并返回优先级最高的元素（对应 dequeue）</td></tr>
<tr><td>peek()</td><td>只看不取（也叫 findMax / getMax）</td></tr>
<tr><td>size()、isEmpty()</td><td>元素个数；个数为 0 即为空</td></tr>
<tr><td>changeWeight(x, p)</td><td>把 x 的优先级改成 p（change priority）</td></tr>
<tr><td>delete(x)</td><td>删除任意元素，不一定是最大的</td></tr>
</tbody>
</table>
<p>本课程默认用<strong>最大优先队列</strong>。需要小的先出时，可以改用最小优先队列（extractMin，底层用最小堆 min-heap），也可以把优先级<strong>取负</strong>后放进最大优先队列：−2 &gt; −5，所以 2 比 5 先出。</p>

<h2>四种实现的代价</h2>
<table>
<thead><tr><th>实现</th><th>insert</th><th>extractMax</th><th>peek</th><th>原因</th></tr></thead>
<tbody>
<tr><td>无序数组 / 无序链表</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>数组放末尾、链表放表头；取最大要扫一遍</td></tr>
<tr><td>有序数组（升序，最大在末尾）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>插入要右移，平均移一半；最大值就在最后一格</td></tr>
<tr><td>有序链表（降序，最大在表头）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>要先走到插入位置；取最大即删表头</td></tr>
<tr><td><strong>二叉堆（max-heap）</strong></td><td><strong>O(log n)</strong></td><td><strong>O(log n)</strong></td><td><strong>O(1)</strong></td><td>放到末尾再 sift up；根与末尾交换、缩小、sift down（见 6.2）</td></tr>
<tr><td>平衡 BST（如 AVL）</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>最大值是最右结点；每个结点两个指针，还要旋转</td></tr>
</tbody>
</table>
<p>数组的 insert 不计扩容（翻倍后均摊 O(1)，见 2.6）。有序数组若把最大值放在下标 0，extractMax 要整体左移，就变成 O(n)。</p>
<p>前三种实现各有一个 O(n) 的操作。堆的两个操作都是 O(log n)，虽然比 O(1) 慢，但 log n 远小于 n（n = 10⁶ 时 log₂ n ≈ 20），所以优先队列一般用堆实现。</p>
<div class="callout key" data-label="考点">堆实现的优先队列：insert O(log n)（最好 Θ(1)，新元素不大于父结点），extractMax O(log n)，peek O(1)。优先队列是 ADT，堆是实现它的具体数据结构，匹配题里两者不能混用。</div>

<h2>changeWeight 与任意删除：先找到元素</h2>
<p>堆只保证“父 ≥ 子”，兄弟之间、不同子树之间没有顺序，要改的元素可能在任何位置，找它只能扫一遍，O(n)。课上的办法是另配一张<strong>辅助表：元素 → 它在堆数组中的下标</strong>（课上用哈希表；元素是顶点编号 0…V−1 时，数组 pos[] 就够了），每次交换两个槽位都同步更新这两个下标。有了位置：</p>
<ul>
<li><strong>changeWeight</strong>：直接改值。在最大堆里，变大就 sift up，变小就 sift down，O(log n)。</li>
<li><strong>delete(x)</strong>：把最后一个元素换到 x 的位置，堆大小减 1，再让换过来的元素 sift up <strong>或</strong> sift down，O(log n)。</li>
</ul>
<p>以 6.1 的堆 [27, 24, 26, 7, 12, 6, 19, 2, 7, 7]（下标从 1 开始）为例，两次修改都从这个原堆出发：</p>
<pre><code class="lang-text">6（下标 6）改成 30，变大 → sift up：30 &gt; 父 26，交换；30 &gt; 父 27，交换；到达根
   → [30, 24, 27, 7, 12, 26, 19, 2, 7, 7]
24（下标 2）改成 1，变小 → sift down：孩子 7、12，与较大的 12 交换；唯一的孩子 7，交换；到达叶子
   → [27, 12, 26, 7, 7, 6, 19, 2, 7, 1]</code></pre>
<p>删除也可能要上浮。最大堆 [30, 10, 25, 8, 9, 20, 22] 删除 8（下标 4）：末尾的 22 换到下标 4，大小变成 6。22 来自右子树，而新位置的父结点是左子树里的 10，22 &gt; 10，必须<strong>上浮</strong>一层，结果 [30, 22, 25, 10, 9, 20]。</p>
<div class="callout warn" data-label="易错">课上讲任意删除只说了“与末尾交换，再 sift down”。换过来的元素可能比新位置的父结点还大，这时要 sift up；两个方向最多一个会移动，代码里两个都调用。</div>
<pre><code>#define MAXN 100
int heap[MAXN + 1];   /* heap[1..n]: item ids, max-heap by pri[] */
int pos[MAXN];        /* pos[id] = index of id in heap[] */
int pri[MAXN], n;     /* priority of each id; heap size */

static void hswap(int i, int j) {      /* swap slots, keep pos[] in step */
    int t = heap[i]; heap[i] = heap[j]; heap[j] = t;
    pos[heap[i]] = i; pos[heap[j]] = j;
}
/* up(i), down(i): sift up / sift down of 6.2 on pri[heap[.]], via hswap() */

void change_weight(int id, int p) {    /* O(log n) */
    pri[id] = p;
    up(pos[id]);                       /* larger now: may rise */
    down(pos[id]);                     /* smaller now: may sink */
}
void pq_delete(int id) {               /* O(log n) */
    int i = pos[id], last = heap[n];
    hswap(i, n);                       /* the last item takes slot i */
    n--;
    if (last != id) {                  /* it may go up OR down */
        up(pos[last]);
        down(pos[last]);
    }
}</code></pre>

<h2>图算法里的优先队列</h2>
<p>Dijkstra（7.5）和 Prim（7.7）都用<strong>最小</strong>优先队列：每个顶点被 extractMin 一次，共 V 次；每条边最多让一个顶点的键变小一次（decrease-key，考题里叫 update，就是上面的 changeWeight），不超过 E 次。总时间约为 V × extractMin + E × update，换实现就是换这两项的单次代价：</p>
<table>
<thead><tr><th>PQ 实现</th><th>extractMin</th><th>update</th><th>总时间</th></tr></thead>
<tbody>
<tr><td>二叉堆 + 下标表</td><td>O(log V)</td><td>O(log V)</td><td><strong>O((V + E) log V)</strong></td></tr>
<tr><td>无序数组（直接用 dist[]）</td><td>O(V)</td><td>O(1)</td><td>O(V² + E) = <strong>O(V²)</strong></td></tr>
<tr><td>有序链表</td><td>O(1)</td><td>O(V)（摘下再按序插回）</td><td>O(V + VE) = <strong>O(VE)</strong></td></tr>
<tr><td>平衡 BST</td><td>O(log V)</td><td>O(log V)（删旧键、插新键）</td><td><strong>O((V + E) log V)</strong></td></tr>
</tbody>
</table>
<p>稀疏图（sparse，E ≈ V）用堆是 O(V log V)，远好于 O(V²)；稠密图（dense，E ≈ V²）时堆是 O(V² log V)，反而不如无序数组。优先队列的其他用途：操作系统的任务调度、AI 规划（planning）、Huffman 编码（课上只提到名字）。</p>

<h2>Top-k：找最小的 k 个</h2>
<p>问题：从 n 个数中找出最小的 k 个（k &lt; n）。先排序再取前 k 个是 O(n log n)。课上的投票题有两种用堆的做法，<strong>两个答案都算对</strong>。</p>
<h3>做法一：全部建最小堆，取 k 次</h3>
<p>对 n 个数自底向上建<strong>最小堆</strong>，O(n)（见 6.3）。根是最小值，extractMin 重复 k 次，每次 O(log n)，合计 <strong>O(n + k log n)</strong>。第 k 次取出的就是第 k 小。</p>
<h3>做法二：大小为 k 的最大堆</h3>
<p>求最小的 k 个，用的却是<strong>最大堆</strong>。堆里存“目前为止最小的 k 个候选”，根是候选中最大的，相当于进入名单的门槛。新来的数 x 只和根比较：</p>
<ul>
<li>x &lt; 根：根已经不可能是最小的 k 个之一。用 x 替换根，再 sift down，O(log k)。</li>
<li>x ≥ 根：x 不可能是最小的 k 个之一，直接丢弃，O(1)。</li>
</ul>
<p>例：n = 10，k = 4，输入 8 15 3 22 10 17 1 12 5 30。前 4 个自底向上建成最大堆 [22, 15, 3, 8]，之后每个数的处理如下：</p>
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
<p>结果是 {1, 3, 5, 8}，根 8 就是第 4 小。堆里的 k 个数本身没有排好序，需要有序输出时再做 k 次 extractMax，多花 O(k log k)。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-priority-queue/anims/topk-stream.html" loading="lazy" style="height: 540px;" title="Top-k 数据流筛选"></iframe>
<p class="anim-caption">逐帧看每个新元素怎样与根比较、替换或被丢弃；切到“降序：最坏”和“升序：最好”，对比替换次数和交换次数。</p>

<p>代价：建堆 O(k)；其余 n − k 个数各与根比较一次，最坏情况（降序输入）每个都替换根并沉到底，每次 O(log k)。合计 O(k + (n − k) log k) = <strong>O(n log k)</strong>。最好情况是升序输入：建好堆后一次替换都没有，Θ(n)。代码就是 sift down 加一个循环，调用者要给 H 留出 k + 1 个位置：</p>
<pre><code>/* max-heap in H[1..k]; H[0] unused (course convention) */
static void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

/* sift H[i] down a max-heap of size n */
void siftdown(int H[], int n, int i) {
    while (2 * i &lt;= n) {                     /* i has a left child */
        int c = 2 * i;
        if (c + 1 &lt;= n &amp;&amp; H[c + 1] &gt; H[c])   /* take the LARGER child */
            c++;
        if (H[i] &gt;= H[c]) break;             /* heap condition holds */
        swap(&amp;H[i], &amp;H[c]);
        i = c;
    }
}

/* Put the k smallest of A[0..n-1] into H[1..k], 1 &lt;= k &lt;= n.
   H[1] is then the k-th smallest.  O(k + (n-k) log k) = O(n log k) */
void k_smallest(const int A[], int n, int k, int H[]) {
    for (int j = 0; j &lt; k; j++)              /* first k items */
        H[j + 1] = A[j];
    for (int i = k / 2; i &gt;= 1; i--)         /* bottom-up build: O(k) */
        siftdown(H, k, i);
    for (int j = k; j &lt; n; j++) {
        if (A[j] &lt; H[1]) {                   /* smaller than the largest candidate */
            H[1] = A[j];                     /* the old root is thrown away */
            siftdown(H, k, 1);               /* O(log k) */
        }                                    /* otherwise A[j] is discarded */
    }
}</code></pre>

<h3>两种做法怎么选</h3>
<ul>
<li><strong>时间</strong>：只看 Big-O，做法一从不更差。k 为常数时两者都是 O(n)；k = √n 时做法一是 O(n)，做法二是 O(n log n)。</li>
<li><strong>空间</strong>：做法一要 O(n) 额外空间（或打乱原数组）；做法二只要 O(k)，数据只读一遍，适合放不进内存、或逐个到达的数据流（stream）。</li>
<li><strong>求最大的 k 个</strong>：镜像过来，用大小为 k 的最小堆，或全部建最大堆再取 k 次。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>代价表</strong>（选择、填空）：各实现的 insert / extractMax 代价，以及为什么一般用堆。公式表上没有这些，要记住，最好能由“插入要移位、取最大要扫描”当场推出；求总代价用到的 1 + 2 + … + n = n(n + 1)/2 在公式表上。</li>
<li><strong>Top-k</strong>：写出两种做法的复杂度，说明用最大堆还是最小堆、大小多少。O(n log n) 等于直接排序，不是想要的答案。</li>
<li><strong>图算法换 PQ</strong>（2015、2016 年都考过）：问 Dijkstra 或 Prim 换一种 PQ 后的复杂度。按“V 次 extractMin + 最多 E 次 update”逐项乘出单次代价再相加，每项都写出来。</li>
<li><strong>算法设计、写代码</strong>：数据流中的前 k 名、第 k 小，代码就是上面的 sift down 加一个循环。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>求最小的 k 个用大小为 k 的<strong>最大堆</strong>，新元素只与根比较。</li>
<li>extractMax 是 O(log n)；O(1) 的是 peek。</li>
<li>在堆中找任意元素是 O(n)。changeWeight、delete 要做到 O(log n)，必须有“元素 → 下标”的辅助表。</li>
<li>堆只能直接看到最大值，不能按大小顺序遍历；8.1 的订单簿要逐级查看价位，所以不用堆。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 对一个空的优先队列先做 n 次 insert，再做 n 次 extractMax。分别用无序数组、有序数组、二叉堆实现，最坏情况下总代价各是多少？</summary>
  <div class="qa__body">
  <p><strong>无序数组</strong>：insert 共 n × O(1)。第 i 次 extractMax 时还剩 n − i + 1 个元素，要全扫一遍，合计 n + (n − 1) + … + 1 = n(n + 1)/2，<strong>Θ(n²)</strong>。</p>
  <p><strong>有序数组</strong>：最坏情况下每次插入都落在最前面（例如输入降序），第 i 次要移动 i − 1 个元素，合计 0 + 1 + … + (n − 1) = n(n − 1)/2；extractMax 每次 O(1)。总共 <strong>Θ(n²)</strong>。</p>
  <p><strong>二叉堆</strong>：每个操作 O(log n)，2n 个操作合计 <strong>O(n log n)</strong>。</p>
  <p>按 extractMax 的顺序取出的正是降序序列，所以这三种做法分别相当于选择排序、插入排序和堆排序（见 5.2、5.3、6.4）。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 在最大堆 [27, 24, 26, 7, 12, 6, 19, 2, 7, 7]（下标从 1 开始）中删除 26，写出结果数组。删除前怎样在 O(1) 内找到 26？</summary>
  <div class="qa__body">
  <p>26 在下标 3。末尾的 7（下标 10）换到下标 3，堆大小变成 9。7 的父结点 27 比它大，不用上浮；它的两个孩子是 6 和 19，与较大的 19 交换；7 到达下标 7，是叶子，停止。</p>
  <p>结果：<strong>[27, 24, 19, 7, 12, 6, 7, 2, 7]</strong>。</p>
  <p>堆不是 BST，直接找 26 要扫一遍，O(n)。要 O(1) 找到它，需要“元素 → 下标”的辅助表（哈希表或 pos[]），并在每次交换时同步更新。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 用大小为 3 的最大堆，从 12 4 9 20 7 15 2 11 6 3 中找最小的 3 个。写出最终的堆数组，根被替换了几次？第 3 小是几？整个过程的复杂度用 n、k 怎样表示？</summary>
  <div class="qa__body">
  <p>前 3 个 [12, 4, 9] 已满足堆序，建堆不交换。之后：</p>
  <pre><code class="lang-text">20 ≥ 12  丢弃                       [12, 4, 9]
 7 &lt; 12  替换根，7 与较大的孩子 9 交换  [9, 4, 7]
15 ≥ 9   丢弃                       [9, 4, 7]
 2 &lt; 9   替换根，2 与 7 交换          [7, 4, 2]
11 ≥ 7   丢弃                       [7, 4, 2]
 6 &lt; 7   替换根，6 ≥ 孩子 4 和 2，不动  [6, 4, 2]
 3 &lt; 6   替换根，3 与 4 交换          [4, 3, 2]</code></pre>
  <p>最终堆数组 <strong>[4, 3, 2]</strong>，根被替换 <strong>4</strong> 次（7、2、6、3）。最小的 3 个是 {2, 3, 4}，第 3 小就是根 <strong>4</strong>。复杂度 O(k + (n − k) log k) = <strong>O(n log k)</strong>，额外空间 O(k)。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. （往年题改编）(a) Dijkstra 用按权重排序的链表作优先队列，复杂度是多少？用堆呢？(b) Prim 用平衡 BST 作优先队列呢？都用 V、E 表示。</summary>
  <div class="qa__body">
  <p>都按“V 次 extractMin + 最多 E 次 update”计算。</p>
  <p><strong>(a) 有序链表</strong>：最小值在表头，deleteMin 为 O(1)，共 V 次；update 要把 v 的结点摘下、再走到新位置插回，O(V)，最多 E 次。总计 O(V + VE) = <strong>O(VE)</strong>。<strong>堆</strong>：两种操作都是 O(log V)，总计 <strong>O((V + E) log V)</strong>。</p>
  <p><strong>(b) 平衡 BST</strong>（如 AVL）：建队列是 V 次插入，O(V log V)。最小值是最左结点，沿左链走到底 O(log V)，它没有左孩子，删除时用不到前驱、后继。update 是删除旧键再插入新键，O(log V)。总计 <strong>O((V + E) log V)</strong>，与堆同级。</p>
  <p>原题还假设删除时用中序遍历找前驱、后继。若据此把每次删除都记 O(V)，V 次 deleteMin 和最多 E 次 update 都含删除，总计 O(V² + VE) = O(VE)（连通图 E ≥ V − 1）。有的参考答案只给 deleteMin 记 O(V)、给 update 记 O(log V)，得出 O(V²)，前后不一致。答题时写清每种操作的单次代价，再相乘相加。</p>
  </div>
</details>
`;
