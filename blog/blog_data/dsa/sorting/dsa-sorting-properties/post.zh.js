/* Post body — dsa-sorting-properties / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-sorting-properties:zh'] = `
<p class="lead">排序（sorting）把一组元素重新排成<strong>非递减</strong>次序，多数时候是查找、找重复、求中位数之前的预处理。比较排序算法时，除了时间和空间复杂度，本课程还看三个性质：<strong>原地（in-place）</strong>、<strong>稳定（stable）</strong>、<strong>自适应（adaptive）</strong>。</p>

<h2>为什么要排序</h2>
<p>排序本身很少是目的，排好之后很多问题变简单：</p>
<ul>
<li><strong>二分查找（binary search）</strong>：前提就是数组有序。</li>
<li><strong>找重复</strong>：不排序只能两两比较，(n−1) + (n−2) + … + 1 = n(n−1)/2 次，Θ(n²)。排好序后相等的元素必然相邻，每个只和前一个比，最多 n−1 次。n = 10⁶ 时两两比较约 5×10¹¹ 次，而 Θ(n log n) 的排序约 n log₂ n ≈ 2×10⁷ 次，再加 10⁶ 次扫描。</li>
<li><strong>中位数（median）</strong>：取正中间；n 为偶数时取中间两个的平均。</li>
<li><strong>数据库</strong>：数据按键有序地组织（常用树），比较一次就知道往哪边找。</li>
</ul>
<pre><code>/* A[0..n-1] 已按非递减排好 */
int has_duplicate(const int A[], int n) {
    for (int i = 1; i &lt; n; i++)
        if (A[i] == A[i - 1]) return 1;   /* 相等的元素一定相邻 */
    return 0;
}

double median(const int A[], int n) {
    if (n % 2 == 1) return A[n / 2];
    return (A[n / 2 - 1] + A[n / 2]) / 2.0;
}</code></pre>
<p>课上的数组 [2, 0, 9, 7, 1, 5, 2] 排好是 [0, 1, 2, 2, 5, 7, 9]：i = 3 时 A[3] == A[2]，有重复；n = 7，中位数是 A[3] = 2。</p>

<h2>定义：非递减排列</h2>
<p>输入是 n 个元素，本课程一般放在数组里（链表可先转成数组）。输出是<strong>同一组元素的一个排列（permutation）</strong>，满足 A[0] ≤ A[1] ≤ … ≤ A[n−1]。</p>
<p>输入可能有重复：[5, 2, 4, 2, 8, 8] 排好是 [2, 2, 4, 5, 8, 8]，做不到严格递增，所以准确的说法是<strong>非递减（non-decreasing）</strong>。本课程说“按递增排序”，指的就是非递减。[2, 4, 5, 8] 虽然有序但丢了元素，不是排序结果。</p>
<p>实际排的常是<strong>记录（record）</strong>：按某个字段即<strong>键（key）</strong>比较，其余字段随记录一起移动。键相等而记录不同，就引出了稳定性。</p>

<h2>时间与空间</h2>
<p>排序的代价一般数键的<strong>比较</strong>和元素的<strong>交换 / 移动</strong>（一次交换算 3 次赋值），同样的 n 再按初始次序分最好、平均、最坏情况。两条下界：</p>
<ul>
<li>任何排序都至少 Θ(n)：每个元素至少要看一次，哪怕只是确认已经有序。所以<strong>最好情况 Θ(n) 已是最优</strong>。</li>
<li><strong>基于比较的排序（comparison-based sort）平均情况不可能好于 Θ(n log n)</strong>。本课程唯一不比较键的是<strong>计数排序（distribution counting）</strong>：数出每个值出现几次再写回，O(n + K)，K 是键的取值范围，K 小时比 n log n 快。</li>
</ul>
<p>空间复杂度只算<strong>输入之外的额外空间</strong>：几个变量 O(1)，快速排序的递归栈平均 O(log n)，归并排序 O(n)，计数排序 O(K)。</p>

<h2>性质一：原地（in-place）</h2>
<p>本课程的定义很严格：<strong>额外空间为 O(1)</strong> 才算原地。选择排序、插入排序只用几个变量，是原地的。计数排序要 K 个计数器，<strong>不是原地</strong>；这份空间取决于取值范围 K 而不是 n：1000 个取值在 1 到 10¹² 之间的整数，就要约 10¹² 个计数器。</p>
<div class="callout note" data-label="注意">
<p>快速排序的递归栈平均占 O(log n)。按严格定义它不是原地；但这只是调用栈，没有另开数组，说它原地也合理。课上两种答案都接受，作答时写明所用的定义和理由。</p>
</div>

<h2>性质二：稳定（stable）</h2>
<p>给相等的键加下标以示区分：输入 5, 2₁, 4, 2₂, 8₁, 8₂。<strong>稳定排序保证键相等的元素保持原来的相对次序</strong>，输出必须是 2₁ 2₂ 4 5 8₁ 8₂；不稳定的排序没有这个保证。</p>
<p>稳定性是<strong>算法</strong>的性质，不是某一次运行的性质。选择排序在上面的输入上恰好输出 2₁ 2₂ 4 5 8₁ 8₂，但它不稳定，因为存在打乱次序的输入。课上的<strong>反例（counterexample）</strong>是 2₁, 2₂, 1：</p>
<pre><code class="lang-text">第 1 轮：最小值 1 在下标 2，与下标 0 的 2₁ 交换 → 1, 2₂, 2₁
第 2 轮：剩下 2₂, 2₁，最小值 2₂ 已在下标 1，与自己交换 → 1, 2₂, 2₁</code></pre>
<p>2₁ 被一次远距离交换甩到了 2₂ 后面。证明不稳定只要一个反例；说稳定则要论证对所有输入成立。插入排序的论证：新元素只越过<strong>严格大于</strong>它的元素，遇到相等的键就停在它后面，相等的元素永远不会互相越过。</p>
<div class="callout warn" data-label="易错">
<p>插入排序内层循环的条件写成 <code>A[j] &gt;= val</code> 照样能排好序，但相等的元素会互相越过，算法就不稳定了。必须是 <code>A[j] &gt; val</code>。</p>
</div>
<iframe class="anim-frame" src="blog/blog_data/dsa-sorting-properties/anims/stable-vs-unstable.html" loading="lazy" style="height: 470px;" title="插入排序与选择排序的稳定性"></iframe>
<p class="anim-caption">先选输入再按播放：两行每帧各走一轮。同色的格子键相等，下标是它们原来的先后，绿色竖线左边已排好。最后一帧看谁保住了次序。</p>

<h3>稳定性有什么用：按两个键排序</h3>
<p>只排整数时看不出稳定性的作用，两个 2 本来就无法区分；排记录就不同了。下面 6 条记录已按时间排好，现在按城市排，希望同一城市内仍按时间先后：</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

#define N 6

typedef struct {
    char city[12];
    int time;                         /* hhmm，930 表示 09:30 */
} record_t;

/* 插入排序（按 city）：只越过 city 严格更大的记录 → 稳定 */
void insertion_by_city(record_t A[], int n) {
    for (int i = 1; i &lt; n; i++) {
        record_t val = A[i];
        int j = i - 1;
        while (j &gt;= 0 &amp;&amp; strcmp(A[j].city, val.city) &gt; 0) {
            A[j + 1] = A[j];              /* 右移一格 */
            j--;
        }
        A[j + 1] = val;
    }
}

/* 选择排序（按 city）：最小者与剩余部分的第一个交换 → 不稳定 */
void selection_by_city(record_t A[], int n) {
    for (int i = 0; i &lt; n - 1; i++) {
        int min = i;
        for (int j = i + 1; j &lt; n; j++)
            if (strcmp(A[j].city, A[min].city) &lt; 0) min = j;
        record_t tmp = A[i];              /* 远距离交换 */
        A[i] = A[min];
        A[min] = tmp;
    }
}

int main(void) {
    record_t a[N] = {                 /* 已按时间排好 */
        {"Sydney", 900}, {"Melbourne", 915}, {"Sydney", 930},
        {"Perth", 945}, {"Melbourne", 1000}, {"Sydney", 1020}
    }, b[N];
    memcpy(b, a, sizeof a);
    insertion_by_city(a, N);
    selection_by_city(b, N);
    for (int i = 0; i &lt; N; i++)       /* 左列插入排序，右列选择排序 */
        printf("%d  %-9s %04d   %-9s %04d\\n", i,
               a[i].city, a[i].time, b[i].city, b[i].time);
    return 0;
}</code></pre>
<table>
<thead><tr><th>下标</th><th>插入排序（稳定）</th><th>选择排序（不稳定）</th></tr></thead>
<tbody>
<tr><td>0</td><td>Melbourne 0915</td><td>Melbourne 0915</td></tr>
<tr><td>1</td><td>Melbourne 1000</td><td>Melbourne 1000</td></tr>
<tr><td>2</td><td>Perth 0945</td><td>Perth 0945</td></tr>
<tr><td>3</td><td>Sydney 0900</td><td><strong>Sydney 0930</strong></td></tr>
<tr><td>4</td><td>Sydney 0930</td><td><strong>Sydney 0900</strong></td></tr>
<tr><td>5</td><td>Sydney 1020</td><td>Sydney 1020</td></tr>
</tbody>
</table>
<p>选择排序第 2 轮把 Sydney 0900 从下标 1 换到下标 4，越过了下标 2 的 Sydney 0930，悉尼的记录不再按时间排列；插入排序稳定，每个城市内部仍是时间顺序。</p>
<div class="callout key" data-label="考点">
<p>按两个键排序：<strong>先按次要键排，再用稳定排序按主要键排</strong>。第一次用什么排序都行，第二次必须稳定，否则第一次排出的次序会被打乱。调用库函数排两次时，要先确认它是否稳定。</p>
</div>

<h2>性质三：自适应（adaptive）</h2>
<p>运行时间不只取决于 n、还取决于输入原有次序的算法叫<strong>自适应</strong>，也叫<strong>对输入敏感（input-sensitive）</strong>，表现为最好和最坏情况属于不同的复杂度类。n = 8 时的比较次数：</p>
<table>
<thead><tr><th>输入（n = 8）</th><th>插入排序</th><th>选择排序</th></tr></thead>
<tbody>
<tr><td>已排序 1 2 3 4 5 6 7 8</td><td>7 = n−1</td><td>28</td></tr>
<tr><td>几乎有序 1 2 3 5 4 6 7 8</td><td>8</td><td>28</td></tr>
<tr><td>逆序 8 7 6 5 4 3 2 1</td><td>28 = n(n−1)/2</td><td>28</td></tr>
</tbody>
</table>
<p>插入排序在有序输入上每个新元素只比 1 次，Θ(n)；逆序时每个都要越过整个已排好的部分，Θ(n²)。所以它是自适应的，适合几乎有序的输入。选择排序每轮都要扫完剩余部分才能确定最小值，任何输入都是 n(n−1)/2 次，<strong>不是自适应的</strong>；计数排序总是 O(n + K)，也不是。</p>

<h2>本课程的排序算法一览</h2>
<table>
<thead><tr><th>篇目</th><th>算法</th><th>一句话</th><th>稳定</th><th>原地</th><th>自适应</th></tr></thead>
<tbody>
<tr><td>5.2</td><td>选择排序</td><td>每轮把剩余部分的最小值换到最前</td><td>否</td><td>是</td><td>否</td></tr>
<tr><td>5.3</td><td>插入排序</td><td>把下一个元素插进已排好的前缀</td><td>是</td><td>是</td><td>是</td></tr>
<tr><td>5.4</td><td>计数排序</td><td>数出每个值的个数，再按个数写回</td><td>见注</td><td>否</td><td>否</td></tr>
<tr><td>5.5–5.6</td><td>快速排序</td><td>按 pivot 分区，再递归排两边</td><td>否</td><td>两种都可</td><td>是</td></tr>
<tr><td>5.7</td><td>归并排序</td><td>两半分别排好，再合并</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>5.8</td><td>自底向上 / 自适应归并</td><td>从长度 1 的段 / 天然有序段开始两两合并</td><td>是</td><td>否</td><td>前者否，后者是</td></tr>
<tr><td>6.4</td><td>堆排序</td><td>建大顶堆，反复把堆顶换到末尾</td><td>否</td><td>是</td><td>否</td></tr>
</tbody>
</table>
<p>注：计数排序的稳定性课上未讨论，排记录时按累计计数依次放入输出数组的写法是稳定的（见 5.4）。堆排序只按 O(n log n) 看待，最好情况不考。时间、空间汇总见 5.9。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>性质判断</strong>（单选、多选、连线）：X 是否稳定 / 原地 / 自适应，上表三列要背熟；快速排序是否原地，要写出理由。</li>
<li><strong>给反例</strong>：证明不稳定，写一个带下标的小输入并逐轮写出结果，选择排序用 2₁, 2₂, 1。一次碰巧保持次序的运行证明不了稳定。</li>
<li><strong>情景题</strong>：内存受限、要求稳定、几乎有序、小范围整数键……选算法并说明理由（见 5.9）；按两个键排序时，第二次必须用稳定排序。</li>
<li><strong>代码细节</strong>：插入排序写成 <code>&gt;=</code> 就不稳定；归并时相等取左边才稳定（见 5.7）。</li>
<li>定义不在公式表上，要自己记：原地 = 额外 O(1)；稳定 = 相等键保持相对次序；自适应 = 时间依赖输入原有次序；“递增”指非递减。</li>
<li>陷阱：计数排序的 O(K) 与 n 无关，但仍不是原地；n log n 下界只管基于比较的排序。</li>
</ul>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 某排序算法在输入 3₁, 1, 3₂ 上输出 1, 3₁, 3₂。能否据此断定它稳定？如果输出是 1, 3₂, 3₁ 呢？</summary>
<div class="qa__body">
<p>第一种<strong>不能</strong>：稳定要对所有输入成立，一次保持次序可能是碰巧。选择排序在这个输入上就输出 1, 3₁, 3₂（第 1 轮 1 与下标 0 的 3₁ 交换，第 2 轮 3₁ 与自己交换），而它不稳定。</p>
<p>第二种<strong>可以</strong>断定不稳定：3₁ 原本在 3₂ 前面，输出里却在后面，一个反例就够。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 哪些说法正确？(A) 选择排序是原地的；(B) 计数排序的额外空间与 n 无关，所以是原地的；(C) 插入排序在已排序输入上是 Θ(n)、逆序时是 Θ(n²)，所以是自适应的；(D) 存在平均情况为 Θ(n) 的基于比较的排序；(E) 归并排序稳定但不是原地的；(F) 堆排序是原地的但不稳定。</summary>
<div class="qa__body">
<p><strong>A、C、E、F 正确。</strong></p>
<p>B 错：O(K) 与 n 无关，但不是 O(1)。D 错：比较排序平均不可能好于 Θ(n log n)。C 正是自适应的定义；E 合并时相等取左边所以稳定，但复制子数组要 O(n)；F 只在数组内交换，但堆顶与末尾的交换会让相等元素互相越过。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. 学生记录 (name, mark)：(Cara, 70)、(Ben, 85)、(Amy, 70)、(Dan, 85)。要求按分数从高到低排，分数相同按姓名字母序。用两次排序怎么做？第二次如果用“每轮找最大值换到前面”的选择排序，结果是什么？</summary>
<div class="qa__body">
<p>先按<strong>次要键</strong> name 排（用什么排序都行）：Amy 70、Ben 85、Cara 70、Dan 85。再用<strong>稳定</strong>排序（插入排序或归并排序）按 mark 从高到低排：Ben 85、Dan 85、Amy 70、Cara 70，同分的记录保持了字母序。</p>
<p>第二次换成选择排序（找最大值，相等时取先遇到的）：</p>
<pre><code class="lang-text">初始：  Amy 70, Ben 85, Cara 70, Dan 85
第 1 轮：最大 Ben 85（下标 1）与下标 0 的 Amy 交换 → Ben 85, Amy 70, Cara 70, Dan 85
第 2 轮：最大 Dan 85（下标 3）与下标 1 的 Amy 交换 → Ben 85, Dan 85, Cara 70, Amy 70
第 3 轮：Cara 70 与 Amy 70 相等，取先遇到的 Cara，与自己交换 → 不变</code></pre>
<p>分数排对了，但 Amy 在第 2 轮被换到最后，越过了 Cara，同分不再按字母序。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">4. 判断 n 个整数里有没有重复。(a) 不排序、两两比较要多少次比较？(b) 先用归并排序再扫描相邻元素，总时间是多少？(c) 如果所有值都在 0 到 K−1 之间且 K 不大，还能怎么做？</summary>
<div class="qa__body">
<p>(a) 每一对比一次：(n−1) + (n−2) + … + 1 = n(n−1)/2，Θ(n²)。</p>
<p>(b) 排序 Θ(n log n)，之后相等的元素相邻，扫描最多 n−1 次比较，合计 <strong>Θ(n log n)</strong>。</p>
<p>(c) 开长度为 K 的计数数组，每读一个值就把对应计数加 1，某个计数到 2 就说明有重复。时间 O(n + K)，额外空间 O(K)；它不比较元素，所以不受 n log n 下界限制。</p>
</div>
</details>
`;
