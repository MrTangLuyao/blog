/* Post body — c-algo-tute-3 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['c-algo-tute-3:zh'] = `
<style>
  .reader-body .anim-frame {
    width: 100%;
    border: 1px solid #3a3a39;
    border-radius: 14px;
    background: #2a2a29;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    display: block;
    margin: 1.4em 0;
  }
  .reader-body .anim-caption {
    text-align: center;
    color: #a1a1a0;
    font-size: 13px;
    font-style: italic;
    margin-top: -0.6em !important;
    margin-bottom: 1.4em;
  }
</style>

<p class="lead">C 语言算法入门 3 · 终篇。这一篇我们把第二篇没讲完的几块拼齐：<strong>堆和优先队列</strong>（用一个完全二叉树做"永远能 O(log n) 取最值"的容器）；<strong>哈希表</strong>（牺牲一点空间换 O(1) 查找的最伟大数据结构）；<strong>BMH</strong>（KMP 之外另一种字符串匹配思路，实战中常常更快）；以及<strong>两个最重要的算法设计范式</strong>——<em>贪心</em>和<em>动态规划</em>。读完这篇，前两篇里那些"理论"就都能落地解决真问题了。</p>

<h2>第十部分 堆与优先队列——永远能 O(log n) 取最值</h2>

<h3>10.1 没有堆会怎样？</h3>
<p>想象你在写一个任务调度器：随时可能有新任务进来，每次要<strong>取出当前优先级最高的那个</strong>来执行。可选的数据结构：</p>

<table>
  <thead><tr><th>方案</th><th>插入</th><th>取最大</th><th>问题</th></tr></thead>
  <tbody>
    <tr><td>无序数组</td><td>O(1)（追加）</td><td>O(n)（线性查找）</td><td>取最大太慢</td></tr>
    <tr><td>有序数组</td><td>O(n)（插入要挪位）</td><td>O(1)（取末尾）</td><td>插入太慢</td></tr>
    <tr><td>BST（平衡）</td><td>O(log n)</td><td>O(log n)（一路向右）</td><td>能用，但实现复杂</td></tr>
    <tr><td><strong>二叉堆</strong></td><td><strong>O(log n)</strong></td><td><strong>O(log n)</strong></td><td>实现极简单 ⭐</td></tr>
  </tbody>
</table>

<p>二叉堆同时让两个核心操作都是 O(log n)，而且实现只要 30 行 C 代码。这就是为什么"优先队列"这个 ADT 几乎都用堆来实现。</p>

<h3>10.2 二叉堆的定义</h3>

<p><strong>最大堆</strong>（Max-Heap）有两个性质：</p>
<ol>
  <li><strong>结构性</strong>：是一棵<strong>完全二叉树</strong>（除了最后一层，其它层都满；最后一层从左到右连续填）</li>
  <li><strong>堆序性</strong>：<strong>每个节点的值 ≥ 它两个子节点的值</strong>（对最小堆是 ≤）</li>
</ol>

<p>注意：<strong>堆和 BST 是不同的</strong>！BST 要求"左 &lt; 父 &lt; 右"——是水平方向的有序；堆只要求"父 ≥ 子"——是垂直方向的有序。所以堆里同一层的兄弟之间没有任何顺序关系。</p>

<h3>10.3 用数组表示堆</h3>

<p>这是堆最优雅的地方。完全二叉树<strong>不需要指针</strong>——直接用数组按层序存就行：</p>

<pre><code>// 堆 a[0..n-1]
// 索引 i 的父节点：(i - 1) / 2
// 索引 i 的左子：  2i + 1
// 索引 i 的右子：  2i + 2</code></pre>

<p>为什么这套公式管用？因为完全二叉树按层序编号时这种父子关系是<strong>固定的</strong>。验证：i=0 是根；i=1 (父=(1-1)/2=0)；i=3 (父=(3-1)/2=1)；i=4 (父=(4-1)/2=1)... 都对。</p>

<p>意味着：<strong>堆完全可以用一个普通数组实现</strong>。无指针、缓存友好、内存紧凑。</p>

<h4>双视图动画</h4>
<p>下面这个动画把堆<strong>同时</strong>展示成树和数组。看插入或堆排序时，两边的位置是<strong>同步</strong>变化的——它们就是同一份数据的两种看法：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/heap-ops.html" loading="lazy" style="height: 480px;" title="二叉堆"></iframe>
<p class="anim-caption">↑ 切到"堆排序"模式看：每次取根（最大值）和数组末尾交换，末尾就锁定为已排序。重复 n-1 次就排完了。</p>

<h3>10.4 插入：上浮（heapify up）</h3>

<p>插入新值到堆里：</p>
<ol>
  <li>把新值<strong>追加到数组末尾</strong>（也就是树的最右下空位）</li>
  <li>新值可能比父大、违反堆序性 → <strong>跟父交换</strong>，往上爬</li>
  <li>重复直到新值不再比父大（或到根）</li>
</ol>

<pre><code>void heap_push(int a[], int *n, int v) {
    int i = (*n)++;
    a[i] = v;
    while (i &gt; 0) {
        int p = (i - 1) / 2;
        if (a[p] &gt;= a[i]) break;       // 堆序已满足，停
        int t = a[p]; a[p] = a[i]; a[i] = t;
        i = p;
    }
}</code></pre>

<p>上浮路径长度 ≤ 树高 = log n，所以 <strong>O(log n)</strong>。</p>

<h3>10.5 取最大：下沉（heapify down）</h3>

<p>取最大值就是取根（a[0]）：</p>
<ol>
  <li>记下 a[0] 作为返回值</li>
  <li>把数组最后一个元素<strong>搬到 a[0]</strong>（同时数组长度减 1）</li>
  <li>新的 a[0] 可能比子小、违反堆序性 → 跟<strong>较大的那个子</strong>交换，往下沉</li>
  <li>重复直到不再比子小（或到叶子）</li>
</ol>

<pre><code>int heap_pop(int a[], int *n) {
    int max = a[0];
    a[0] = a[--(*n)];                  // 把末尾搬到根
    int i = 0;
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2;
        int largest = i;
        if (l &lt; *n &amp;&amp; a[l] &gt; a[largest]) largest = l;
        if (r &lt; *n &amp;&amp; a[r] &gt; a[largest]) largest = r;
        if (largest == i) break;
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        i = largest;
    }
    return max;
}</code></pre>

<p>下沉路径也是 ≤ 树高，<strong>O(log n)</strong>。</p>

<h3>10.6 build_heap —— O(n) 而不是 O(n log n)</h3>

<p>给定一个无序数组，怎么把它变成堆？最朴素的做法是循环 n 次 push：O(n log n)。但有个更聪明的方法：<strong>从最后一个非叶节点开始，对每个节点做下沉</strong>。</p>

<pre><code>void build_heap(int a[], int n) {
    for (int i = n / 2 - 1; i &gt;= 0; i--) {
        heapify_down(a, n, i);   // 同上面那段下沉逻辑，传入起始 i
    }
}</code></pre>

<p>令人意外的是这个总代价是 <strong>O(n)</strong>，不是 O(n log n)。</p>

<p><strong>为什么？</strong>叶子节点不用下沉（它们已经"是堆"了，没子可比）。深度 d 的节点至多下沉 (h - d) 次（h = 树高 ≈ log n）。深度 d 的节点数 ≤ n / 2^(d+1)。把代价加起来：</p>
<pre><code>总代价 ≈ Σ (h - d) × n/2^(d+1)
       = n × Σ k/2^k     （把 k = h - d 代换）
       ≤ n × 2           （Σ k/2^k 收敛到 2）
       = O(n)</code></pre>

<p>大部分节点在树底，下沉路径很短，所以平均代价反而是常数级。这就是 O(n) 建堆的来历。</p>

<h3>10.7 堆排序（Heap Sort）</h3>

<p>把数组<strong>原地</strong>排序：</p>
<ol>
  <li>build_heap(a, n) —— O(n) 建好最大堆</li>
  <li>把 a[0]（最大）和 a[n-1] 交换。最大值就锁定在末尾了。</li>
  <li>对前 n-1 个元素做下沉（从根开始），重新成堆</li>
  <li>把 a[0] 和 a[n-2] 交换。第二大锁定在 n-2。</li>
  <li>... 重复 n-1 次</li>
</ol>

<pre><code>void heap_sort(int a[], int n) {
    build_heap(a, n);
    for (int end = n - 1; end &gt; 0; end--) {
        // swap root (max) with last
        int t = a[0]; a[0] = a[end]; a[end] = t;
        heapify_down(a, end, 0);   // shrink heap by 1, sift down
    }
}</code></pre>

<h4>评价</h4>
<table>
  <thead><tr><th>维度</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>最好 / 最坏 / 平均</td><td>都是 O(n log n)</td></tr>
    <tr><td>空间</td><td>O(1)，<strong>原地</strong></td></tr>
    <tr><td>稳定</td><td>否</td></tr>
    <tr><td>实测速度</td><td>比快排慢（缓存不友好——数组随机跳）</td></tr>
  </tbody>
</table>

<p>堆排序在工程中很少作为<strong>主要</strong>排序方法，但它是<strong>introsort</strong>（C++ <code>std::sort</code> 的实现）的兜底——快排深度过深就切到堆排，保证最坏 O(n log n)。这就是堆排序"挂在腰间但偶尔救命"的角色。</p>

<h3>10.8 优先队列 ADT</h3>

<p>堆只是"实现"。<strong>优先队列</strong>（Priority Queue）才是 ADT 名字。它的接口：</p>
<table>
  <thead><tr><th>操作</th><th>含义</th><th>堆实现复杂度</th></tr></thead>
  <tbody>
    <tr><td><code>push(v)</code></td><td>加入元素</td><td>O(log n)</td></tr>
    <tr><td><code>pop()</code> / <code>extract_max()</code></td><td>取出并返回最值</td><td>O(log n)</td></tr>
    <tr><td><code>peek()</code> / <code>top()</code></td><td>看一眼最值</td><td>O(1)</td></tr>
    <tr><td><code>size()</code></td><td>当前大小</td><td>O(1)</td></tr>
  </tbody>
</table>

<p><strong>典型用途：</strong></p>
<ul>
  <li>任务调度（按优先级）</li>
  <li>Dijkstra 最短路径算法（按到达节点的当前最短距离取下一个）</li>
  <li>哈夫曼编码（每次合并两个最小频率）</li>
  <li>事件驱动模拟（按时间戳取下一个事件）</li>
  <li>"取前 K 大"这类问题（用大小为 K 的最小堆）</li>
</ul>

<hr>

<h2>第十一部分 哈希表——空间换时间的极致</h2>

<h3>11.1 没有哈希表会怎样？</h3>
<p>到目前为止我们看了好几种"能查找"的结构：</p>

<table>
  <thead><tr><th>结构</th><th>查找</th><th>插入</th></tr></thead>
  <tbody>
    <tr><td>无序数组</td><td>O(n)</td><td>O(1)</td></tr>
    <tr><td>有序数组（二分）</td><td>O(log n)</td><td>O(n)</td></tr>
    <tr><td>BST（平衡）/ AVL</td><td>O(log n)</td><td>O(log n)</td></tr>
    <tr><td><strong>哈希表</strong></td><td><strong>O(1)*</strong></td><td><strong>O(1)*</strong></td></tr>
  </tbody>
</table>

<p>* 是"平均情况"。最坏会退化到 O(n)，但只要哈希函数不太烂，"最坏"几乎不会发生。</p>

<p>哈希表是<strong>最常用的数据结构之一</strong>——Python 的 <code>dict</code>、JavaScript 的 <code>Object</code> / <code>Map</code>、Java 的 <code>HashMap</code> 都是它。它的设计哲学就一句话：<strong>用一个数学函数把"key"直接映射到内存地址</strong>。</p>

<h3>11.2 哈希函数</h3>

<p>哈希函数 <code>h(key)</code> 接受任意 key，返回一个固定范围的整数（"桶号"）。最简单的例子：</p>

<pre><code>// key 是整数，桶数是 m
int hash(int key, int m) {
    return key % m;     // 模运算
}</code></pre>

<p>对于字符串 key，常见做法是<strong>多项式哈希</strong>：</p>

<pre><code>unsigned hash_str(const char *s, unsigned m) {
    unsigned h = 0;
    while (*s) {
        h = h * 31 + (unsigned char)*s++;   // 31 是个魔数（任何小素数都行）
    }
    return h % m;
}</code></pre>

<h4>什么是"好"哈希函数？</h4>
<ol>
  <li><strong>计算快</strong>：哈希函数本身要 O(1) 或接近</li>
  <li><strong>分布均匀</strong>：不同 key 应该尽量分散到不同桶</li>
  <li><strong>对相似 key 给出差很大的输出</strong>：不然两个相似 key 会聚到同一桶</li>
  <li><strong>确定性</strong>：同样 key 必须给同样桶号</li>
</ol>

<p>"完美哈希"（不同 key 永远不冲突）只在 key 集合<strong>已知且固定</strong>时才能构造。一般情况下<strong>冲突不可避免</strong>——这就是哈希表设计的核心问题。</p>

<h3>11.3 冲突处理：链地址法（Chaining）</h3>

<p>每个桶不存"一个值"，存"一个值的链表"：</p>

<pre><code>typedef struct Entry {
    int key, value;
    struct Entry *next;
} Entry;

#define M 1024
Entry *table[M];      // 每个桶是一条链表的头

void insert(int key, int value) {
    int h = key % M;
    Entry *e = malloc(sizeof(Entry));
    e-&gt;key = key; e-&gt;value = value;
    e-&gt;next = table[h];
    table[h] = e;     // 插到链表头（O(1)）
}

int *find(int key) {
    int h = key % M;
    for (Entry *e = table[h]; e != NULL; e = e-&gt;next) {
        if (e-&gt;key == key) return &amp;e-&gt;value;
    }
    return NULL;
}</code></pre>

<h3>11.4 冲突处理：开放寻址（Open Addressing）</h3>

<p>每个桶最多存<strong>一个</strong>元素。冲突时，按某种规则<strong>探测下一个空桶</strong>：</p>

<table>
  <thead><tr><th>探测方式</th><th>规则</th></tr></thead>
  <tbody>
    <tr><td><strong>线性探测</strong></td><td>h, h+1, h+2, ... (mod m)</td></tr>
    <tr><td>二次探测</td><td>h, h+1², h+2², h+3², ...</td></tr>
    <tr><td>双重哈希</td><td>h, h+h2(k), h+2·h2(k), ...（用第二个哈希函数算步长）</td></tr>
  </tbody>
</table>

<p>线性探测最简单：</p>
<pre><code>#define M 1024
int  keys[M], values[M];
char used[M];          // 0 = 空，1 = 占用

void insert(int key, int value) {
    int h = key % M;
    while (used[h]) {
        if (keys[h] == key) { values[h] = value; return; }
        h = (h + 1) % M;
    }
    keys[h] = key; values[h] = value; used[h] = 1;
}</code></pre>

<h4>两种方案对比</h4>
<p>动画里同一份 key 序列分别用两种方案插入。重点观察：</p>
<ul>
  <li><strong>链地址</strong>：碰撞时同一桶下挂多个；查找时要遍历这条链</li>
  <li><strong>开放寻址</strong>：碰撞时往后找空位；查找时也要顺着探测路径走</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/hash-table.html" loading="lazy" style="height: 380px;" title="哈希表 链地址 vs 开放寻址"></iframe>
<p class="anim-caption">↑ 切换两种模式看同一组 key 的不同结局。链地址法的桶可以无限挂；开放寻址法满了就插不进去。</p>

<h3>11.5 负载因子（load factor）和 rehashing</h3>

<p><strong>负载因子</strong> α = 已存元素数 / 桶数。它直接决定哈希表的性能：</p>

<table>
  <thead><tr><th>方案</th><th>α 上限建议</th><th>α 越大</th></tr></thead>
  <tbody>
    <tr><td>链地址</td><td>≈ 1.0（也可超 1）</td><td>链越长，查找越慢</td></tr>
    <tr><td>开放寻址</td><td>&lt; 0.7</td><td>探测路径暴涨，性能崩溃 ⚠️</td></tr>
  </tbody>
</table>

<p>当 α 超过阈值时要 <strong>rehashing</strong>：</p>
<ol>
  <li>开一个新表，桶数翻倍（通常翻倍到下一个素数）</li>
  <li>把所有现有元素<strong>重新哈希</strong>到新表（因为 m 变了，h(key) % m 也变了）</li>
  <li>释放老表</li>
</ol>

<p>单次 rehashing 是 O(n)。但摊销下来，每次 insert 仍然是 O(1)（每翻倍一次，下次翻倍前可以做 n 次插入，所以摊销 O(n)/n = O(1)）。这种"偶尔很贵但平均很便宜"的分析叫<strong>摊销复杂度</strong>。</p>

<h3>11.6 哈希表的最坏情况</h3>

<p>"最坏 O(n)"是真实存在的——所有 key 都哈希到同一个桶时（链地址变成线性扫一条长链；开放寻址变成线性探测大半个表）。</p>
<p>怎么避免？</p>
<ul>
  <li><strong>用好哈希函数</strong>。例：Java HashMap 在 Java 8 后链长 ≥ 8 时会把链<strong>转成红黑树</strong>，把退化情况从 O(n) 控制到 O(log n)。</li>
  <li><strong>哈希加随机化</strong>。Python 3.3+ 的 dict 在启动时给字符串哈希加随机种子，让攻击者无法构造碰撞。</li>
</ul>

<blockquote>提示 简单整数 key（比如 ID）+ 模一个<strong>素数</strong> + 链地址 = 99% 的工程场合都够用。哈希表是"先信任默认实现"的典型——只有在性能 profile 真的指向哈希时才去调优。</blockquote>

<hr>

<h2>第十二部分 BMH——KMP 之外的另一种字符串匹配思路</h2>

<p>第二篇我们学了 KMP——理论上 O(n+m) 的精妙算法。但<strong>实战</strong>中，<code>strstr</code>、<code>grep</code> 等工具实际上很少用 KMP，反而用 <strong>Boyer-Moore</strong> 或它的简化版 <strong>Boyer-Moore-Horspool（BMH）</strong>。原因在于一个反直觉的事实：</p>

<blockquote>大多数字符串匹配的常见情况下，<strong>BMH 比 KMP 还要快</strong>——尽管 BMH 的最坏复杂度是 O(nm)。</blockquote>

<h3>12.1 BMH 的核心想法</h3>

<p>BMH 跟 KMP 共享一个出发点：<strong>失败时不要从头扫</strong>。但具体策略完全不同：</p>
<ul>
  <li>KMP：从左往右扫；失败时用 next[] 让 j 跳到合适的前缀位置；i 不回退</li>
  <li>BMH：<strong>从右往左扫</strong>；失败时用 shift 表让<strong>整个 pattern 一次往右滑很多位</strong></li>
</ul>

<p>BMH 的精髓：每次失败时，<strong>看主串当前窗口最右那个字符</strong>，查 shift 表决定 pattern 整体往右滑多少位。在很多情况下一次能滑 m 位（pattern 整体长度），完全跳过中间的对齐尝试。</p>

<h3>12.2 shift 表怎么建</h3>

<p>对模式串 P 长度 m，shift 表 <code>shift[c]</code> 表示：<strong>看到字符 c 时，pattern 该往右滑几位</strong>。</p>

<p>规则：</p>
<ul>
  <li>对 P[0..m-2] 中的每个字符（不含最后一个！），<code>shift[P[i]] = m - 1 - i</code>。如果同一字符出现多次，<strong>取最后一次（最大的 i）</strong>，让 shift 值最小（更保守、更安全）。</li>
  <li>所有不在 P[0..m-2] 中的字符：<code>shift[c] = m</code>（pattern 整体跳过 m 位）</li>
</ul>

<p><strong>例：</strong>P = "NEEDLE"（m=6）。看 P[0..4] = "NEEDL"：</p>
<ul>
  <li>i=0: N → shift[N] = 5</li>
  <li>i=1: E → shift[E] = 4</li>
  <li>i=2: E → shift[E] = 3（覆盖前面的 4）</li>
  <li>i=3: D → shift[D] = 2</li>
  <li>i=4: L → shift[L] = 1</li>
  <li>其他字符：shift[c] = 6</li>
</ul>

<h3>12.3 BMH 主匹配过程</h3>

<pre><code>int bmh_search(const char *text, const char *pattern) {
    int n = strlen(text), m = strlen(pattern);
    int shift[256];
    for (int c = 0; c &lt; 256; c++) shift[c] = m;
    for (int i = 0; i &lt; m - 1; i++) shift[(unsigned char)pattern[i]] = m - 1 - i;

    int i = 0;
    while (i &lt;= n - m) {
        int j = m - 1;
        // 从右往左比较
        while (j &gt;= 0 &amp;&amp; pattern[j] == text[i + j]) j--;
        if (j &lt; 0) return i;     // 全部匹配
        // 失败：用窗口最右字符 text[i+m-1] 决定滑多少位
        i += shift[(unsigned char)text[i + m - 1]];
    }
    return -1;
}</code></pre>

<h3>12.4 用动画对比朴素、KMP 和 BMH</h3>

<p>同一份 text 和 pattern，三种算法都跑一遍。注意比较次数：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/bmh.html" loading="lazy" style="height: 500px;" title="朴素 vs KMP vs BMH"></iframe>
<p class="anim-caption">↑ 切三种模式看同一份输入下的差异。KMP 模式下面会显示 next[] 表，BMH 模式下面会显示 shift 表，朴素模式什么辅助表都没有——只能逐位试。</p>

<h3>12.5 复杂度分析</h3>

<table>
  <thead><tr><th>情况</th><th>BMH</th><th>KMP</th></tr></thead>
  <tbody>
    <tr><td>最好</td><td>O(n / m)（每次跳 m 位）⭐</td><td>O(n)</td></tr>
    <tr><td>最坏</td><td>O(n × m)</td><td>O(n + m) ⭐</td></tr>
    <tr><td>平均（随机文本）</td><td>O(n / m) — 实测更快 ⭐</td><td>O(n)</td></tr>
  </tbody>
</table>

<p>BMH 的最坏情况是个真实问题（比如 text = "AAAAAAA...A"，pattern = "BAAAA"——shift 表里 A 对应较小的 shift）。但<strong>对随机或自然语言文本，BMH 的实测速度常常是 KMP 的 3-5 倍</strong>。</p>

<h3>12.6 更进一步：完整 Boyer-Moore</h3>

<p>BMH 是 Boyer-Moore（BM）的"坏字符"启发式简化版。完整 BM 还有"好后缀"启发式——相当于 BMH + KMP 的失败函数思想。完整 BM 复杂度：最坏 O(n + m)，平均比 BMH 还快。但实现复杂度大涨，而对常规文本 BMH 已经足够好——所以工业代码（GNU grep、glibc <code>memmem</code>）多数选 BMH 或它的小改进版。</p>

<blockquote>选哪个 ① 模式串很短、字母表很大（自然文本、UTF-8）→ <strong>BMH</strong>。② 模式串很长 / 重复模式多（DNA、二进制流）→ <strong>KMP</strong> 或完整 BM。③ 多个模式串同时找 → AC 自动机（KMP 在树上的扩展）。</blockquote>

<hr>

<h2>第十三部分 算法设计范式——贪心与动态规划</h2>

<p>前面 12 部分都是"具体的算法"。这一部分讲两个<strong>设计范式</strong>——遇到新问题时<strong>怎么思考</strong>的两种典型套路。学好了，你能对付 80% 的"看起来没见过的"算法题。</p>

<h3>13.1 贪心算法（Greedy）</h3>

<h4>没有贪心思路会怎样？</h4>
<p>对一些问题，你可能会想"穷举所有可能的选择，挑最优的那个"——这就是<strong>暴力搜索</strong>，时间是指数级的。<strong>贪心</strong>的核心思想是：</p>
<blockquote>每一步都做<strong>当前看起来最好</strong>的选择，不去回看，也不去想"以后会不会后悔"。如果这个策略对，你就只需要 O(n log n) 或 O(n) 而不是指数级。</blockquote>

<p>贪心不是万能——它只在<strong>"局部最优 → 全局最优"</strong>这个性质成立的问题上才对。这个性质叫<strong>贪心选择性质</strong>，需要数学证明。如果证不出来，贪心就是错的。</p>

<h4>最直观的例子：用最少的硬币凑出 N 元</h4>
<p><strong>问题：</strong>你有面值 1, 5, 10, 25, 50, 100 的硬币（每种无限多）。要凑成 N 元，最少要用多少枚？</p>

<p><strong>贪心策略：</strong>每次都拿<strong>不超过剩余金额的最大面值</strong>，从剩余金额扣掉，继续。</p>

<p>例：要凑 87 元</p>
<pre><code>87 ≥ 50：拿一枚 50，剩 37
37 ≥ 25：拿一枚 25，剩 12
12 ≥ 10：拿一枚 10，剩  2
 2 ≥  1：拿一枚  1，剩  1
 1 ≥  1：拿一枚  1，剩  0
共 5 枚硬币（50 + 25 + 10 + 1 + 1）</code></pre>

<h4>动画</h4>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/greedy-coin.html" loading="lazy" style="height: 460px;" title="贪心：硬币兑换"></iframe>
<p class="anim-caption">↑ 黄色高亮的是"当前能用的最大面值"——贪心每一步都挑它，从不回头看。可以改输入金额试试别的数字。</p>

<h4>代码</h4>
<pre><code>int coin_change_greedy(int amount, int *picked) {
    int denoms[] = {100, 50, 25, 10, 5, 1};   // 从大到小
    int n_denoms = 6;
    int count = 0;
    for (int i = 0; i &lt; n_denoms; i++) {
        while (amount &gt;= denoms[i]) {
            picked[count++] = denoms[i];
            amount -= denoms[i];
        }
    }
    return count;     // 用了多少枚
}</code></pre>
<p>每个面值最多扫一遍，<strong>O(面值数 + 答案大小)</strong>，几乎 O(1)。</p>

<h4>但是！贪心需要"证明"</h4>
<p>对人民币 / 美元这套面值，贪心是对的——可以严格证明。但<strong>换一套面值，贪心就崩</strong>。反例：面值 [1, 3, 4]，凑 6 元：</p>
<pre><code>贪心：4 + 1 + 1 = 3 枚
最优：3 + 3 = 2 枚</code></pre>
<p>贪心多用了一枚！这就是<strong>贪心算法必须证明</strong>的原因——直觉对的策略，换一组数据就崩。<strong>没有证明就不能信任贪心。</strong></p>

<h4>另一个经典：Dijkstra 最短路径</h4>
<p>Dijkstra 也是贪心：每次从"未访问"的节点里选当前距离最小的，更新它的邻居距离。它的正确性证明依赖于<strong>"边权非负"</strong>这个前提（如果有负权边，贪心就不对了，要用 Bellman-Ford）。又一个"换条件就崩"的例子。</p>

<h4>什么时候不能用贪心？</h4>
<p>除了上面的反例硬币组合，更典型的是：<strong>0-1 背包问题</strong>。给一组物品（重量和价值），背包有载重上限，问最大价值。直觉贪心"按价值/重量比从高到低拿"——错的。反例：</p>
<pre><code>背包载重 = 50
物品 A：重 10、值 60（性价比 6.0）
物品 B：重 20、值 100（性价比 5.0）
物品 C：重 30、值 120（性价比 4.0）

贪心：先 A（剩 40），再 B（剩 20）。装不下 C。总值 = 160。
最优：B + C，总值 = 220。</code></pre>
<p>贪心错了。这种问题需要<strong>动态规划</strong>。</p>

<h3>13.2 动态规划（DP）</h3>

<h4>没有 DP 会怎样？</h4>
<p>很多问题有<strong>"递归结构"</strong>——大问题可以拆成小问题，小问题的解能合成大问题的解。比如斐波那契：<code>fib(n) = fib(n-1) + fib(n-2)</code>。但朴素递归会<strong>指数级重复计算</strong>：</p>
<pre><code>            fib(5)
           /       \
       fib(4)      fib(3)
       /    \      /    \
   fib(3) fib(2) fib(2) fib(1)
   /  \    ...
fib(2) fib(1)
...</code></pre>
<p>fib(2) 被算了 3 次。fib(3) 被算了 2 次。计算量是 O(2ⁿ) — 完全无法接受。</p>

<p><strong>DP 的核心想法：</strong>每个子问题<strong>只算一次</strong>，结果存起来下次直接用。这个技巧叫<strong>记忆化（memoization）</strong>。</p>

<h4>DP 的两种写法</h4>

<p><strong>① 自顶向下（Top-down）+ Memoization</strong>：</p>
<pre><code>int memo[100];   // -1 表示还没算

int fib(int n) {
    if (n &lt; 2) return n;
    if (memo[n] != -1) return memo[n];   // 命中缓存
    return memo[n] = fib(n - 1) + fib(n - 2);
}</code></pre>
<p>用递归写，但每次先查缓存。原本指数级的复杂度变成 <strong>O(n)</strong>（每个 n 只递归算一次）。</p>

<p><strong>② 自底向上（Bottom-up）+ 表格填充</strong>：</p>
<pre><code>int fib(int n) {
    if (n &lt; 2) return n;
    int dp[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i &lt;= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}</code></pre>
<p>从最小的子问题开始，按依赖顺序填表。同样 O(n)。</p>

<p>两种写法对应同一个 DP 思想：<strong>记忆化避免重复计算</strong>。</p>

<h4>识别 DP 的两个特征</h4>
<p>什么样的问题适合 DP？两个特征：</p>
<ol>
  <li><strong>最优子结构</strong>：大问题的最优解可以由小问题的最优解构造</li>
  <li><strong>重叠子问题</strong>：递归过程中相同的子问题被反复求解（不然 memoization 就没意义）</li>
</ol>

<p>0-1 背包就有这两个特征：装到第 i 个物品、容量还剩 c 的最大价值，可以由"装第 i-1 个物品的最大价值"推导。同样的子问题（i, c）会出现多次。所以 DP 适用。</p>

<h3>13.3 经典 DP：最长公共子序列（LCS）</h3>

<p><strong>问题：</strong>两个字符串 X 和 Y，求最长的<em>子序列</em>（不要求连续，但要按顺序）使得它同时是 X 和 Y 的子序列。</p>

<p>例：X = "ABCBDAB"，Y = "BDCAB"。LCS 是 "BCAB" 或 "BDAB"，长度 4。</p>

<h4>状态定义和转移方程</h4>
<p><code>dp[i][j]</code> = X 的前 i 个字符和 Y 的前 j 个字符的 LCS 长度。</p>

<pre><code>if (X[i-1] == Y[j-1]):
    dp[i][j] = dp[i-1][j-1] + 1       // 字符相同 → 这个字符加进 LCS
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])   // 字符不同 → 哪边大用哪边

base: dp[0][*] = dp[*][0] = 0</code></pre>

<h4>动画看 DP 表的填充</h4>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/dp-lcs.html" loading="lazy" style="height: 460px;" title="DP: 最长公共子序列"></iframe>
<p class="anim-caption">↑ 黄色 = 当前正在填的格；蓝色 = 它依赖的 src 格；绿色 = 字符匹配的格。填满之后从右下角橙色回溯，每经过一个绿色格就把那个字符加进 LCS。</p>

<h4>代码</h4>
<pre><code>int lcs(const char *X, const char *Y) {
    int m = strlen(X), n = strlen(Y);
    int dp[m + 1][n + 1];
    for (int i = 0; i &lt;= m; i++) dp[i][0] = 0;
    for (int j = 0; j &lt;= n; j++) dp[0][j] = 0;
    for (int i = 1; i &lt;= m; i++) {
        for (int j = 1; j &lt;= n; j++) {
            if (X[i - 1] == Y[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                int up = dp[i - 1][j], left = dp[i][j - 1];
                dp[i][j] = up &gt; left ? up : left;
            }
        }
    }
    return dp[m][n];
}</code></pre>

<p>时间 O(mn)，空间 O(mn)（可优化到 O(min(m,n))，但稍复杂）。</p>

<h4>回溯出 LCS 串</h4>
<p>仅知道长度还不够，怎么把那个字符串构造出来？从 dp[m][n] 回溯：</p>

<pre><code>// 从 dp[m][n] 反向走到 dp[0][0]
i = m; j = n;
result = "";
while (i &gt; 0 &amp;&amp; j &gt; 0) {
    if (X[i-1] == Y[j-1]) {
        result = X[i-1] + result;    // 把字符加进结果
        i--; j--;
    } else if (dp[i-1][j] &gt;= dp[i][j-1]) {
        i--;     // 上一格更大，往上走
    } else {
        j--;     // 左一格更大，往左走
    }
}
// result 就是 LCS</code></pre>

<h3>13.4 DP 思路五步法</h3>
<p>面对一个新的"看起来需要 DP"的问题，按这五步走：</p>
<ol>
  <li><strong>找状态</strong>：定义 dp[?] 表示什么。维度通常对应问题的"规模参数"（数组下标、剩余容量、当前字符串位置...）</li>
  <li><strong>找状态转移</strong>：写出 dp[当前状态] 怎么由 dp[更小状态] 推出。这是<em>最难</em>的一步。</li>
  <li><strong>找 base case</strong>：最小状态的初值是什么。</li>
  <li><strong>确定填表顺序</strong>：要保证算 dp[X] 时，它依赖的状态都已经算过。通常意味着按维度的某种顺序循环。</li>
  <li><strong>构造解（如果需要）</strong>：从最终 dp 值回溯路径。</li>
</ol>

<h3>13.5 贪心 vs DP——怎么选？</h3>
<table>
  <thead><tr><th></th><th>贪心</th><th>DP</th></tr></thead>
  <tbody>
    <tr><td>策略</td><td>每步选当前最好的</td><td>枚举所有可能的子问题选择</td></tr>
    <tr><td>性能</td><td>更快（通常 O(n log n)）</td><td>较慢（通常 O(n²) 或 O(nm)）</td></tr>
    <tr><td>正确性</td><td>需要"贪心选择性质"，要证明</td><td>对"最优子结构 + 重叠子问题"的问题永远对</td></tr>
    <tr><td>典型问题</td><td>活动选择、Huffman、Dijkstra（无负权）、最小生成树</td><td>背包、LCS、最长上升子序列、编辑距离、矩阵链乘</td></tr>
  </tbody>
</table>

<p><strong>怎么选？</strong>面对新问题：</p>
<ol>
  <li>先想贪心。如果能证明，用贪心，性能更好。</li>
  <li>证不出来，或者能想到反例，用 DP。</li>
  <li>DP 都想不出（指数级状态空间）→ 可能需要更高级的工具：分支限界、近似算法、或者证明 NP-hard。</li>
</ol>

<hr>

<h2>三篇大总结</h2>

<p>三篇博客我们走过了一遍<strong>从基础到设计范式的完整路径</strong>。回头看：</p>

<table>
  <thead><tr><th>篇</th><th>核心训练</th><th>主要工具</th></tr></thead>
  <tbody>
    <tr><td>第一篇</td><td>建立"评价"维度</td><td>大 O · 递归 · 分治 · 二分搜索 · O(n²) 排序</td></tr>
    <tr><td>第二篇</td><td>从"原始"到"高效"</td><td>归并/快排 · ADT · 链表/栈/队列 · 树/BST/AVL · KMP</td></tr>
    <tr><td>第三篇</td><td>从"具体算法"到"思考范式"</td><td>堆 · 哈希表 · BMH · 贪心 · 动态规划</td></tr>
  </tbody>
</table>

<h3>给新手的建议</h3>
<ol>
  <li><strong>不要只看不动手</strong>。每个动画看一遍只是入门——把每段代码自己敲一遍、跑一遍，看到 bug 自己 debug，才能真懂。</li>
  <li><strong>反复回看大 O</strong>。学新算法时第一时间就量它的最好/最坏/平均复杂度——这把"尺子"用得越熟，越能感觉到不同算法的"重量"。</li>
  <li><strong>从"为什么"开始</strong>，而不是"怎么做"。每个数据结构 / 算法都解决了某个具体痛点。理解痛点，比记住实现重要 10 倍。</li>
  <li><strong>不要自己实现哈希 / 平衡 BST</strong>。理解原理，但工程中用标准库。除非你在写标准库本身。</li>
  <li><strong>多写题</strong>。LeetCode、洛谷、AtCoder。学了 10 个算法 vs 写了 100 道题，后者收获大得多。</li>
</ol>

<h3>下一步该学什么？</h3>
<ul>
  <li><strong>图算法</strong>：BFS / DFS / Dijkstra / Floyd / 拓扑排序 / 最小生成树 / 强连通分量</li>
  <li><strong>更多 DP</strong>：背包系列、区间 DP、状压 DP、树形 DP、数位 DP</li>
  <li><strong>高级数据结构</strong>：并查集、线段树、树状数组、字典树（trie）</li>
  <li><strong>算法竞赛</strong>：如果想深入，<em>Competitive Programming Handbook</em>（CP Handbook）或《算法竞赛入门经典》</li>
  <li><strong>系统化教材</strong>：CLRS《算法导论》——大学经典，写得很严谨；Sedgewick《Algorithms》——更工程导向</li>
</ul>

<p>三篇博客读完，你已经具备<strong>看懂大多数计算机科学论文里"算法"部分的基础</strong>。算法不是天才才能学的——它就是一组<strong>可学习的思考工具</strong>。一篇一篇打扎实，一年后再看自己写的第一篇代码，会觉得"我居然能看懂自己当时为什么这么写"。</p>

<p>感谢一路读到这里。<strong>第三篇完，整个系列结束。</strong>祝你写代码愉快。</p>
`;
