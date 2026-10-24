/* Post body — dsa-choosing-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-choosing-sort:zh'] = `
<p class="lead">没有一种排序在所有情况下都最好。选哪一种，要看数据规模（n 很小时 Θ(n²) 的插入排序反而更快）、数据特点（几乎有序、小范围整数）和约束（稳定、内存、最坏情况）；实际的库函数常常是几种排序的混合。</p>

<h2>n 很小时，Θ(n²) 反而更快</h2>
<p>分别用插入排序和自顶向下归并排序排 [5, 8, 7, 1, 3, 4, 0, 6, 9, 2]（n = 10），数各项操作：</p>
<table>
<thead><tr><th>操作</th><th>插入排序</th><th>归并排序</th></tr></thead>
<tbody>
<tr><td>比较</td><td>32</td><td>23</td></tr>
<tr><td>移动元素</td><td>25 次右移，都在相邻位置</td><td>68 次复制：写进临时数组再拷回</td></tr>
<tr><td>函数调用</td><td>1</td><td>19（2n − 1）</td></tr>
<tr><td>额外空间</td><td>O(1)：val、i、j</td><td>n 个元素的临时数组</td></tr>
</tbody>
</table>
<p>插入排序比较得更多，其他开销却小得多。课上总结的原因：</p>
<ul>
<li><strong>常数开销小</strong>：归并排序每层都要把元素复制出去再合并回来，课上的写法每次递归还要新开两个数组。</li>
<li><strong>缓存局部性（cache locality）好</strong>：只访问相邻元素，内存连续；堆排序则按父子下标在数组里跳着访问。</li>
<li><strong>没有递归</strong>，操作只有比较和移动。</li>
</ul>
<p>Big-O 只描述增长率，忽略常数系数。n = 10 时 n² = 100 本身就是常数，这时比的是常数的大小。n 变大后增长率起决定作用：n = 1000 的随机数组，插入排序平均约 25 万次比较，归并排序约 8700 次。</p>
<div class="callout key" data-label="考点">
<p><strong>没有单一最好的排序算法</strong>。复杂度不是全部：n 小时比的是常数开销，n 大时才看增长率。</p>
</div>

<h2>总表：本课程的全部排序</h2>
<table>
<thead><tr><th>算法</th><th>最好</th><th>平均</th><th>最坏</th><th>额外空间</th><th>稳定</th><th>原地</th><th>自适应</th></tr></thead>
<tbody>
<tr><td>选择排序</td><td>Θ(n²)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td></tr>
<tr><td>插入排序</td><td>Θ(n)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>是</td><td>是</td><td>是</td></tr>
<tr><td>计数排序</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>O(K) ①</td><td>是 ①</td><td>否</td><td>否</td></tr>
<tr><td>快速排序</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n²)</td><td>O(log n) ②</td><td>否</td><td>看定义 ②</td><td>是</td></tr>
<tr><td>归并（自顶向下）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>归并（自底向上）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>自适应归并</td><td>Θ(n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>是</td></tr>
<tr><td>堆排序</td><td>不考 ③</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td></tr>
</tbody>
</table>
<p>① K 是键的取值范围。只排整数时额外空间是 K 个计数器；排记录还要 O(n) 的输出数组，按累计计数放置的写法稳定（见 5.4）。② 来自递归栈，平均 O(log n)，最坏 O(n)；按严格定义（额外 O(1)）不算原地，课上两种答案都接受，作答时写明理由。③ 课上明确不考堆排序的最好情况，按 O(n log n) 作答。</p>

<h2>选择规则</h2>
<table>
<thead><tr><th>情况</th><th>选</th><th>理由</th></tr></thead>
<tbody>
<tr><td>n 很小</td><td>插入排序</td><td>常数小、无递归、访问连续内存</td></tr>
<tr><td>已排序或几乎有序</td><td>插入排序、自适应归并</td><td>有序时都是 Θ(n)；自适应归并最坏仍是 Θ(n log n)</td></tr>
<tr><td>最坏也要 O(n log n)</td><td>归并排序、堆排序</td><td>快速排序最坏 Θ(n²)</td></tr>
<tr><td>需要稳定</td><td>归并排序、插入排序、稳定的混合排序</td><td>选择、快速、堆排序会远距离交换，让元素越过相等的键</td></tr>
<tr><td>整数键，取值范围 K 小</td><td>计数排序</td><td>Θ(n + K)，不比较键，不受 n log n 下界限制</td></tr>
<tr><td>额外内存很紧</td><td>堆排序；n 小或几乎有序时插入排序</td><td>额外 O(1)；归并要 O(n)，快速排序的栈要 O(log n)</td></tr>
</tbody>
</table>
<p>“几乎有序”指每个元素离最终位置都不远；少数元素离得很远时，插入排序同样很慢（练习 4）。</p>
<p>约束叠加时可能无解：<strong>稳定 + 原地 + 最坏 O(n log n)，本课程没有一种排序同时满足</strong>。归并排序稳定但要 O(n) 额外空间，堆排序原地但不稳定，插入排序稳定且原地但最坏 Θ(n²)。原地归并排序存在，但实现复杂，不在课程范围内。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-choosing-sort/anims/chooser.html" loading="lazy" style="height: 520px;" title="按要求筛选排序算法"></iframe>
<p class="anim-caption">点场景或勾选要求：绿色满足全部要求，红叉后面是排除的原因，黄色取决于“原地”的定义。</p>
<div class="callout key" data-label="考点">
<p>情景题要写<strong>选什么</strong>和<strong>为什么</strong>：说出场景对应总表里的哪个性质，再指出其他候选差在哪一项。</p>
</div>

<h2>混合排序（hybrid sort）</h2>
<p>归并排序一路分到只剩 1 个元素：n = 1000 时共 1999 次调用，其中 1000 次面对的是单个元素。小数组上插入排序更快，于是子数组足够小时改用它：大问题用复杂的算法，小的子问题用简单的算法。阈值课上举的是 10，也可以取 20、25；快速排序常用 10～30，没有唯一的最佳值，取决于数据。</p>
<pre><code>#include &lt;stdlib.h&gt;

#define CUTOFF 10                  /* 子数组不超过 CUTOFF 个元素时改用插入排序 */

/* 插入排序 A[lo..hi]：只越过严格更大的元素 → 稳定 */
void insertion_sort(int A[], int lo, int hi) {
    for (int i = lo + 1; i &lt;= hi; i++) {
        int val = A[i];
        int j = i - 1;
        while (j &gt;= lo &amp;&amp; A[j] &gt; val) {
            A[j + 1] = A[j];               /* 右移一格 */
            j--;
        }
        A[j + 1] = val;
    }
}

/* 合并有序的 A[lo..mid] 与 A[mid+1..hi]；相等时取左边 → 稳定 */
void merge(int A[], int tmp[], int lo, int mid, int hi) {
    int i = lo, j = mid + 1, k = lo;
    while (i &lt;= mid &amp;&amp; j &lt;= hi)
        tmp[k++] = (A[i] &lt;= A[j]) ? A[i++] : A[j++];
    while (i &lt;= mid) tmp[k++] = A[i++];
    while (j &lt;= hi)  tmp[k++] = A[j++];
    for (k = lo; k &lt;= hi; k++) A[k] = tmp[k];
}

void hybrid_sort(int A[], int tmp[], int lo, int hi) {
    if (hi - lo + 1 &lt;= CUTOFF) {           /* 小子数组：插入排序 */
        insertion_sort(A, lo, hi);
        return;
    }
    int mid = lo + (hi - lo) / 2;
    hybrid_sort(A, tmp, lo, mid);
    hybrid_sort(A, tmp, mid + 1, hi);
    merge(A, tmp, lo, mid, hi);
}

/* 混合归并排序 A[0..n-1]：Θ(n log n)，稳定，额外空间 O(n)。成功返回 0 */
int merge_insertion_sort(int A[], int n) {
    if (n &lt; 2) return 0;
    int *tmp = malloc(n * sizeof(int));
    if (tmp == NULL) return -1;
    hybrid_sort(A, tmp, 0, n - 1);
    free(tmp);
    return 0;
}</code></pre>
<p>n = 1000 的随机数组，200 个取平均（CUTOFF = 1 就是纯归并排序）：</p>
<table>
<thead><tr><th></th><th>CUTOFF = 1</th><th>CUTOFF = 10</th></tr></thead>
<tbody>
<tr><td>比较</td><td>≈ 8700</td><td>≈ 9100</td></tr>
<tr><td>移动元素</td><td>19952</td><td>≈ 15700</td></tr>
<tr><td>hybrid_sort 调用</td><td>1999</td><td>255</td></tr>
</tbody>
</table>
<p>比较反而略多，省下的是递归调用（少 87%）和元素移动（少约 21%），实践中因此更快。</p>
<p><strong>复杂度不变</strong>：阈值 k 是常数，插入排序部分合计 O(n)，合并层数从 log₂ n 降到约 log₂(n/k)，总共仍是 Θ(n log n)，变的只是常数（推导见练习 3）。两部分都稳定（插入排序用 <code>&gt;</code>，合并时相等取左边），所以<strong>混合归并排序仍然稳定</strong>。快速排序也可以这样混合，但它仍然不稳定，最坏仍是 Θ(n²)。</p>

<h2>库函数里的排序</h2>
<table>
<thead><tr><th>函数</th><th>算法</th><th>稳定</th></tr></thead>
<tbody>
<tr><td>C <code>qsort</code></td><td>快速排序（课上的说法；C 标准并不规定具体算法）</td><td>不保证</td></tr>
<tr><td>C++ <code>std::sort</code></td><td>introsort：快速排序 + 堆排序 + 插入排序</td><td>否</td></tr>
<tr><td>C++ <code>std::stable_sort</code></td><td>归并排序</td><td>是</td></tr>
</tbody>
</table>
<p>introsort 就是课上提到的“改进的快速排序，避开最坏情况”：以快速排序为主；递归深度超过约 2 log₂ n（说明 pivot 一直选得很差）时，这一段改用堆排序，所以最坏也是 O(n log n)；分到很短的段（常见实现取 16 个元素左右）交给插入排序。</p>
<p>用库函数前要确认它满足要求，最常见的是稳定性。按两个键先后排两次时，第二次必须稳定（见 5.1）；<code>qsort</code> 不保证稳定，可能打乱第一次排出的次序。用 <code>qsort</code> 时改为只排一次，比较函数先比主要键，相等再比次要键：</p>
<pre><code>typedef struct {
    char city[16];
    int time;                       /* hhmm，930 表示 09:30 */
} record_t;

/* 先比城市（主要键），相同再比时间（次要键） */
int cmp_city_time(const void *a, const void *b) {
    const record_t *x = a, *y = b;
    int c = strcmp(x-&gt;city, y-&gt;city);
    if (c != 0) return c;
    if (x-&gt;time &lt; y-&gt;time) return -1;
    if (x-&gt;time &gt; y-&gt;time) return 1;
    return 0;
}</code></pre>
<p><code>qsort(R, n, sizeof(record_t), cmp_city_time)</code> 一次就排成“按城市、城内按时间”，与 <code>qsort</code> 是否稳定无关。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>情景选择</strong>（课上明确说会考）：给一个或几个场景（内存受限、需要稳定、几乎有序、小范围整数、n 很小），选一种课上讲过的排序并解释原因，理由落到总表的性质上。</li>
<li><strong>填性质表</strong>。往年题要求给出最紧的 Big-O 上界（closest upper bound）：快速排序的时间写 O(n²)，要覆盖最坏情况；额外空间按本课程写 O(log n)。自底向上归并的额外空间是 O(n)，题目给出的取值范围是干扰项。</li>
<li><strong>混合排序</strong>：小规模为什么用插入排序；阈值约 10～30；复杂度类不变；混合归并仍稳定。</li>
<li><strong>库函数</strong>：<code>qsort</code> 是快速排序，<code>std::sort</code> 是快速 + 堆 + 插入的混合；按两个键先后排两次，第二次必须稳定。</li>
<li>总表要背。公式表上的主定理能推出 2T(n/2) + n = Θ(n log n)，但各排序的性质和最坏输入都没有。</li>
<li>陷阱：Θ(n²) 不等于 n 小时也慢；有序输入上 Θ(n) 的只有<strong>自适应</strong>归并；快速排序（首元素 pivot）在已排序或逆序输入上最坏，插入排序最坏是逆序；计数排序不能排实数，K 太大时计数数组装不下；混合快速排序最坏仍是 Θ(n²)；堆排序的最好情况不考。</li>
</ul>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 为每种情况选一种课上讲过的排序并说明理由：(a) 嵌入式设备几乎没有额外内存，要排 5 万个任意范围的 32 位整数，最坏时间必须有保证；(b) 10⁷ 个考试分数，都是 0～100 的整数；(c) 10⁵ 条学生记录已按学号排好，现在按带小数的平均分排，同分的仍按学号；(d) 每次只排 15 个元素，要排几百万次。</summary>
<div class="qa__body">
<p>(a) <strong>堆排序</strong>：额外空间 O(1)，最坏 O(n log n)。归并排序要 O(n) 额外空间；快速排序最坏 Θ(n²)；取值范围太大，计数数组装不下。</p>
<p>(b) <strong>计数排序</strong>：K = 101，Θ(n + K) ≈ 10⁷ 步；比较排序约 n log₂ n ≈ 2.3×10⁸ 次比较。</p>
<p>(c) <strong>归并排序</strong>：第二次排序必须稳定，同分记录才会保持学号顺序。插入排序也稳定，但平均约 n²/4 ≈ 2.5×10⁹ 次比较；归并排序约 n log₂ n ≈ 1.7×10⁶。平均分是实数，不能用计数排序。</p>
<p>(d) <strong>插入排序</strong>：n = 15 时最多 15×14/2 = 105 次比较，是常数；没有递归、不复制数组、只访问连续内存，开销最小。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 哪些说法正确？(A) CUTOFF = 10 的混合归并排序仍是 Θ(n log n)，而且稳定；(B) 小段改用插入排序后，快速排序的最坏情况降到 O(n log n)；(C) 在已排序输入上，自底向上归并排序是 Θ(n)；(D) 需要稳定且最坏 O(n log n) 时可以选堆排序；(E) C++ 的 std::sort 结合了快速排序、堆排序和插入排序；(F) 计数排序能在 O(n + K) 时间内排 [0, 1) 中的实数。</summary>
<div class="qa__body">
<p><strong>A、E 正确。</strong></p>
<p>A：插入排序部分共 O(n)，合并约 log₂(n/10) 层，仍是 Θ(n log n)；两部分都稳定。B 错：pivot 一直是最值时仍有约 n 层，Θ(n²)；要像 introsort 那样切换到堆排序。C 错：它照样合并约 log₂ n 轮；Θ(n) 的是自适应归并。D 错：堆排序不稳定。F 错：实数的取值无穷多，无法逐值计数。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. 混合归并排序的阈值设为 k。(a) 用 n 和 k 写出比较次数的上界；k 是常数和 k = n 时各是多少？(b) 小段为什么用插入排序而不用选择排序？</summary>
<div class="qa__body">
<p>(a) 插入排序部分：每段最多 k 个元素，每个元素最多比较 k − 1 次，合计 ≤ n(k − 1)。合并部分：约 log₂(n/k) 层，每层 ≤ n 次比较。上界 O(nk + n log(n/k))。k 是常数时为 Θ(n log n)；k = n 时根本不分割，就是插入排序，n(n − 1) 这一项给出 Θ(n²)。</p>
<p>(b) 选择排序<strong>不稳定</strong>，混合归并会因此失去稳定性；它也<strong>不自适应</strong>，s 个元素的段总要 s(s − 1)/2 次比较，而插入排序在接近有序的小段上几乎是线性的。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">4. 已排好序的 10⁶ 个元素末尾追加了 50 个乱序的新元素，新值随机落在原有范围内。比较插入排序、自适应归并排序，再给一个更好的办法。</summary>
<div class="qa__body">
<p><strong>插入排序</strong>：前 10⁶ 个元素各比较 1 次；每个新元素平均要越过约一半旧元素，共约 50 × 5×10⁵ = 2.5×10⁷ 次右移，已超过 n log₂ n ≈ 2×10⁷。数组大部分有序，但新元素离最终位置太远。</p>
<p><strong>自适应归并</strong>：天然有序段最多 51 个（随机情况约 26 个），⌈log₂ 26⌉ = 5 轮合并，每轮 Θ(n)，约 5×10⁶ 次移动；一般地是 O(n log m)，m 为新元素个数。</p>
<p><strong>更好</strong>：先单独排末尾 50 个（插入排序最多 50×49/2 = 1225 次比较），再与前面的 10⁶ 个合并一次 Θ(n)，总共约 10⁶ 次操作，即 O(n + m²)。</p>
</div>
</details>
`;
