/* Post body — dsa-heapsort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-heapsort:zh'] = `
<p class="lead">堆排序（heapsort）先把数组建成最大堆（max-heap），再做 n − 1 轮：把堆顶的当前最大值和堆的最后一个元素交换，堆缩小一格，新堆顶下沉（sift down）。最大值从右往左依次归位，最后得到升序数组。最坏情况也是 Θ(n log n)，原地，不稳定。</p>

<h2>思路：反复删除最大值</h2>
<p>课上用的是 6.1 的那个最大堆，数组从下标 1 开始，H[0] 不用：</p>
<pre><code class="lang-text">下标   1   2   3   4   5   6   7   8   9  10
H     27  24  26   7  12   6  19   2   7   7</code></pre>
<p>堆顶 H[1] = 27 是最大值，排好序后它应该在最后一格 H[10]。把它和 H[10] = 7 交换，27 就到了最终位置。然后把堆的大小 size 从 10 改成 9：27 仍在数组里，但不再属于堆。换到堆顶的 7 破坏了堆条件，对它做 sift down，和 6.2 的删除最大值（delete max）完全一样：</p>
<pre><code class="lang-text">第 1 轮  交换 H[1]=27 与 H[10]=7，size = 9
         7 的孩子 24、26，较大的 26 &gt; 7，交换
         7 在下标 3，孩子 6、19，较大的 19 &gt; 7，交换
         7 在下标 7，2×7 = 14 &gt; 9，没有孩子，停
         26 24 19 7 12 6 7 2 7 | 27
第 2 轮  交换 H[1]=26 与 H[9]=7，size = 8
         7 的孩子 24、19，较大的 24 &gt; 7，交换
         7 在下标 2，孩子 7、12，较大的 12 &gt; 7，交换
         7 在下标 5，2×5 = 10 &gt; 8，没有孩子，停
         24 12 19 7 7 6 7 2 | 26 27</code></pre>
<p>竖线左边是堆，右边是已排好的部分。每轮取出的最大值放在右段的左端，右段从大到小向左长，读出来是升序。</p>
<p>完整的算法分两个阶段：</p>
<ol>
<li><strong>建堆</strong>：i 从 ⌊n/2⌋ 到 1，依次对 H[i] 做 sift down，即自底向上建堆（bottom-up），Θ(n)，见 6.3。上面的数组本来就是最大堆，5 个父结点都不用动。</li>
<li><strong>排序</strong>：size 从 n 降到 2，每轮交换 H[1] 与 H[size]，size 减 1，再在缩小后的堆里对 H[1] 做 sift down。<strong>一共 n − 1 轮</strong>：堆里只剩一个元素时，它必然是最小值，已经在 H[1]。</li>
</ol>
<p>每轮结束时数组满足：H[1..size] 是最大堆；H[size+1..n] 是全体中最大的 n − size 个元素，且已升序。堆顶是堆里最大的，又不大于右段的任何元素，所以换到 H[size] 就是它的最终位置，以后不再移动。</p>
<figure class="fig"><svg viewBox="0 0 600 150" width="600" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="hs-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#d97757"/></marker></defs>
<path d="M65,30 Q221,-8 377,30" fill="none" stroke="#d97757" stroke-width="2" marker-start="url(#hs-arr)" marker-end="url(#hs-arr)"/>
<text x="392" y="22" font-size="13" fill="#d97757">下一轮：H[1] 与 H[7] 交换</text>
<g font-size="12" fill="#a1a1a0" text-anchor="middle">
<text x="65" y="44">1</text><text x="117" y="44">2</text><text x="169" y="44">3</text><text x="221" y="44">4</text><text x="273" y="44">5</text>
<text x="325" y="44">6</text><text x="377" y="44">7</text><text x="429" y="44">8</text><text x="481" y="44">9</text><text x="533" y="44">10</text>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="1.5">
<rect x="40" y="50" width="50" height="36" rx="6" stroke="#d97757" stroke-width="2"/><rect x="92" y="50" width="50" height="36" rx="6"/><rect x="144" y="50" width="50" height="36" rx="6"/>
<rect x="196" y="50" width="50" height="36" rx="6"/><rect x="248" y="50" width="50" height="36" rx="6"/><rect x="300" y="50" width="50" height="36" rx="6"/>
<rect x="352" y="50" width="50" height="36" rx="6" stroke="#d97757" stroke-width="2"/>
</g>
<g fill="#2e2e2d" stroke="#5a5a59" stroke-width="1.5" stroke-dasharray="4 3">
<rect x="404" y="50" width="50" height="36" rx="6"/><rect x="456" y="50" width="50" height="36" rx="6"/><rect x="508" y="50" width="50" height="36" rx="6"/>
</g>
<g font-size="15" font-weight="600" text-anchor="middle" dominant-baseline="central">
<g fill="#e8e8e8"><text x="65" y="68">19</text><text x="117" y="68">12</text><text x="169" y="68">7</text><text x="221" y="68">7</text><text x="273" y="68">7</text><text x="325" y="68">6</text><text x="377" y="68">2</text></g>
<g fill="#a1a1a0"><text x="429" y="68">24</text><text x="481" y="68">26</text><text x="533" y="68">27</text></g>
</g>
<path d="M40,94 v6 h362 v-6" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
<path d="M404,94 v6 h154 v-6" fill="none" stroke="#4ade80" stroke-width="1.5"/>
<g font-size="13" text-anchor="middle">
<text x="221" y="120" fill="#38bdf8">H[1..7] 是最大堆，size = 7</text>
<text x="221" y="138" fill="#a1a1a0">堆顶 19 是堆里最大的</text>
<text x="481" y="120" fill="#4ade80">已排好：最大的 3 个</text>
<text x="481" y="138" fill="#a1a1a0">升序，不再移动</text>
</g>
</svg><figcaption>第 3 轮结束时的数组。下一轮把 19 换到 H[7]，堆缩小到 H[1..6]，换上来的 2 再下沉。</figcaption></figure>

<h2>完整追踪</h2>
<p>同一个数组的全部 9 轮。“下沉”一列是被换到堆顶的元素一路上做的交换。</p>
<table>
<thead><tr><th>轮</th><th>堆顶 ↔ 末尾</th><th>size</th><th>下沉</th><th>本轮之后（| 右边已排好）</th></tr></thead>
<tbody>
<tr><td>1</td><td>27 ↔ 7</td><td>9</td><td>7↔26, 7↔19</td><td>26 24 19 7 12 6 7 2 7 | 27</td></tr>
<tr><td>2</td><td>26 ↔ 7</td><td>8</td><td>7↔24, 7↔12</td><td>24 12 19 7 7 6 7 2 | 26 27</td></tr>
<tr><td>3</td><td>24 ↔ 2</td><td>7</td><td>2↔19, 2↔7</td><td>19 12 7 7 7 6 2 | 24 26 27</td></tr>
<tr><td>4</td><td>19 ↔ 2</td><td>6</td><td>2↔12, 2↔7</td><td>12 7 7 2 7 6 | 19 24 26 27</td></tr>
<tr><td>5</td><td>12 ↔ 6</td><td>5</td><td>6↔7, 6↔7</td><td>7 7 7 2 6 | 12 19 24 26 27</td></tr>
<tr><td>6</td><td>7 ↔ 6</td><td>4</td><td>6↔7</td><td>7 6 7 2 | 7 12 19 24 26 27</td></tr>
<tr><td>7</td><td>7 ↔ 2</td><td>3</td><td>2↔7</td><td>7 6 2 | 7 7 12 19 24 26 27</td></tr>
<tr><td>8</td><td>7 ↔ 2</td><td>2</td><td>2↔6</td><td>6 2 | 7 7 7 12 19 24 26 27</td></tr>
<tr><td>9</td><td>6 ↔ 2</td><td>1</td><td>—</td><td>2 | 6 7 7 7 12 19 24 26 27</td></tr>
</tbody>
</table>
<p>结果 2 6 7 7 7 12 19 24 26 27，共 9 次堆顶交换、13 次下沉交换。第 4、5、6 轮都遇到两个孩子相等（7 和 7）：下面的代码只在右孩子严格更大时才选右孩子，所以并列取左。课上没有规定并列怎么选，取右孩子同样正确，只是中间的数组不同，最终结果一样。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-heapsort/anims/heapsort.html" loading="lazy" style="height: 560px;" title="堆排序逐步演示"></iframe>
<p class="anim-caption">按“下一步”或“播放”：先看建堆，再看每轮堆顶换到末尾、灰色的已排好部分向左长一格、新堆顶沿较大的孩子下沉。“乱序输入”是 6.3 的建堆例子，“三个 7”看相等元素的次序。</p>

<h2>C 代码</h2>
<pre><code>#include &lt;stdio.h&gt;

static void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}

/* sift down H[i] inside the max-heap H[1..size] */
static void siftdown(int H[], int size, int i) {
    while (2 * i &lt;= size) {                     /* i has a left child */
        int c = 2 * i;                          /* left child */
        if (c + 1 &lt;= size &amp;&amp; H[c + 1] &gt; H[c])   /* right child exists and is larger */
            c++;
        if (H[i] &gt;= H[c])                       /* already &gt;= the larger child */
            break;
        swap(&amp;H[i], &amp;H[c]);
        i = c;
    }
}

/* sort H[1..n] into ascending order; H[0] is not used */
void heap_sort(int H[], int n) {
    int i, size;
    for (i = n / 2; i &gt;= 1; i--)                /* phase 1: bottom-up build, Theta(n) */
        siftdown(H, n, i);
    for (size = n; size &gt; 1; size--) {          /* phase 2: n - 1 rounds */
        swap(&amp;H[1], &amp;H[size]);                  /* current max goes to its final slot */
        siftdown(H, size - 1, 1);               /* the heap is now H[1..size-1] */
    }
}

int main(void) {
    int H[] = {0, 27, 24, 26, 7, 12, 6, 19, 2, 7, 7};   /* H[0] unused */
    int n = (int)(sizeof(H) / sizeof(H[0])) - 1;
    heap_sort(H, n);
    for (int k = 1; k &lt;= n; k++)
        printf("%d ", H[k]);
    printf("\\n");                               /* 2 6 7 7 7 12 19 24 26 27 */
    return 0;
}</code></pre>
<ul>
<li>排序阶段调用 <code>siftdown(H, size - 1, 1)</code>：刚换到 H[size] 的最大值已经不属于堆。传 <code>size</code> 会把它重新换回堆里（练习 2）。</li>
<li>建堆和排序用同一个 <code>siftdown</code>，区别只在传入的堆大小：建堆时是 n，排序阶段每轮少 1。</li>
<li>选孩子用严格的 <code>&gt;</code>，两个孩子相等时取左；停止条件用 <code>&gt;=</code>，和较大的孩子相等就不再交换。</li>
</ul>
<p>考题的数组也可能从下标 0 开始。这时孩子是 2i+1 和 2i+2，最后一个父结点是 ⌊n/2⌋ − 1，堆顶是 A[0]，第 k 轮把堆顶换到 A[n − k]：</p>
<pre><code>/* A[0..n-1]: children of i are 2i+1 and 2i+2 */
static void siftdown0(int A[], int size, int i) {
    while (2 * i + 1 &lt; size) {
        int c = 2 * i + 1;
        if (c + 1 &lt; size &amp;&amp; A[c + 1] &gt; A[c]) c++;
        if (A[i] &gt;= A[c]) break;
        swap(&amp;A[i], &amp;A[c]);
        i = c;
    }
}
void heap_sort0(int A[], int n) {
    int i, last;
    for (i = n / 2 - 1; i &gt;= 0; i--) siftdown0(A, n, i);
    for (last = n - 1; last &gt; 0; last--) {
        swap(&amp;A[0], &amp;A[last]);
        siftdown0(A, last, 0);                  /* heap is A[0..last-1] */
    }
}</code></pre>

<h2>复杂度</h2>
<p>建堆 Θ(n)。排序阶段每轮的堆不超过 n 个元素，从根往下最多走 ⌊log₂ n⌋ 层；sift down 每下一层最多 2 次比较（两个孩子比一次，较大的孩子和自己比一次）和 1 次交换。n − 1 轮合计不超过 2(n − 1)⌊log₂ n⌋ 次比较，即 O(n log n)。换到堆顶的元素来自最底层，一般比较小，往往又要沉回底层附近，所以这个量级在一般输入上确实会出现。</p>
<div class="callout key" data-label="考点">
<p><strong>堆排序 = Θ(n) 建堆 + (n − 1) 次 O(log n) 的下沉 = O(n log n)，最坏情况也是 O(n log n)</strong>，是有保证的 n log n。建堆改用逐个插入（最坏 Θ(n log n)）也不改变总量级。</p>
</div>
<p>最好情况有个特例：所有键都相等时，每次 sift down 第一次比较就停，排序阶段只要 Θ(n)。课上的说法是理论上最好情况可以是 Θ(n)，而不少教科书写最好情况也是 Θ(n log n)（键互不相同时成立）。<strong>课上明确说考试不问堆排序的最好情况</strong>，一律答 O(n log n)。</p>
<p>下表是 n = 10000 时用上面的代码数出的次数（n log₂ n ≈ 132877；堆顶交换总是 n − 1 = 9999 次，不计入）：</p>
<table>
<thead><tr><th>输入</th><th>比较</th><th>下沉交换</th></tr></thead>
<tbody>
<tr><td>随机排列（多次平均）</td><td>≈ 235000</td><td>≈ 114000</td></tr>
<tr><td>已升序 0, 1, …, 9999</td><td>244460</td><td>121957</td></tr>
<tr><td>已降序（本身就是最大堆）</td><td>226682</td><td>106697</td></tr>
<tr><td>全部相等</td><td>29994</td><td>0</td></tr>
</tbody>
</table>
<p>已排好的输入占不到便宜，升序反而比随机还多。堆排序<strong>不自适应（not adaptive）</strong>：降序数组本身就是最大堆，也只省下建堆阶段的交换，排序阶段照样是 n log n。</p>

<h2>性质</h2>
<p><strong>原地（in-place）</strong>：所有操作都是数组内的交换，额外空间只有 i、c、size 几个变量，O(1)；siftdown 用循环写，没有递归栈。</p>
<p><strong>不稳定（unstable）</strong>：堆顶和堆末尾的交换一下跨过整个堆，会越过和它相等的元素。课上的数组就能看出来：给三个 7 按原位置记作 7₁（H[4]）、7₂（H[9]）、7₃（H[10]），排完是 7₃ 7₂ 7₁，次序完全反了。最小的反例是三个相等的键 7₁ 7₂ 7₃：建堆不动；第 1 轮 7₁ 和 7₃ 交换，得到 7₃ 7₂ | 7₁，7₃ 不小于 7₂，不下沉；第 2 轮 7₃ 和 7₂ 交换，结果 7₂ 7₃ 7₁。</p>
<p><strong>实际比快速排序慢</strong>：下标 i 的孩子在 2i，越往下跳得越远，内存访问不连续，缓存（cache）利用差；快速排序和插入排序都是顺序扫描相邻元素。课上提到这个原因，硬件细节不考。</p>
<p>对比另外两种 n log n 排序：快速排序平均最快，但最坏 Θ(n²)；归并排序最坏 n log n 且稳定，但要 O(n) 额外数组。<strong>既要保证最坏 n log n 又要省内存，选堆排序。</strong></p>

<h2>考试怎么考</h2>
<ul>
<li><strong>追踪</strong>：给一个数组，先自底向上建堆，再写出每轮（或第 k 轮）之后的数组，标出堆和已排好部分的分界。每轮三步：堆顶与 H[size] 交换，size 减 1，新堆顶在缩小后的堆里 sift down，与<strong>较大的</strong>孩子交换。</li>
<li><strong>性质判断</strong>：O(n log n)（最坏也是）、原地、不稳定、不自适应；按场景在几种排序里挑一个并说明理由。</li>
<li><strong>写代码</strong>：一个 siftdown 加两个循环。先写清楚数组从下标 0 还是 1 开始。</li>
<li>公式表上没有堆的内容：孩子下标、最后一个父结点 ⌊n/2⌋、n − 1 轮、各阶段复杂度都要自己记。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>下沉时没有先缩小堆，刚放好的最大值又被换回堆里。</li>
<li>和较小的孩子交换，或者只和左孩子比。</li>
<li>做 n 轮，或者少做一轮：正确是 n − 1 轮，最后剩下的那个自然到位。</li>
<li>用最小堆（min-heap）照同样的步骤原地排序，得到的是<strong>降序</strong>；要升序用最大堆。</li>
<li>建堆时 i 从 1 正着走到 ⌊n/2⌋：自底向上必须从最后一个父结点倒着做。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 用最大堆对 [5, 3, 8, 1, 9, 6, 2] 做堆排序（下标从 1 开始，自底向上建堆）。写出建堆后的数组和每一轮之后的数组。</summary>
  <div class="qa__body">
<p>n = 7，父结点是下标 3、2、1，倒着做：</p>
<pre><code class="lang-text">i = 3：8 的孩子 6、2，8 最大，不动
i = 2：3 的孩子 1、9，与 9 交换；3 到下标 5，是叶子
i = 1：5 的孩子 9、8，与 9 交换；5 到下标 2，孩子 1、3，不动
建堆后：9 5 8 1 3 6 2

第 1 轮  9 ↔ 2，size 6；2↔8，2↔6     →  8 5 6 1 3 2 | 9
第 2 轮  8 ↔ 2，size 5；2↔6          →  6 5 2 1 3 | 8 9
第 3 轮  6 ↔ 3，size 4；3↔5          →  5 3 2 1 | 6 8 9
第 4 轮  5 ↔ 1，size 3；1↔3          →  3 1 2 | 5 6 8 9
第 5 轮  3 ↔ 2，size 2；2 ≥ 1，不动   →  2 1 | 3 5 6 8 9
第 6 轮  2 ↔ 1，size 1               →  1 | 2 3 5 6 8 9</code></pre>
<p>第 2 轮 2 换到下标 3 后，它的孩子下标 6 已经超出 size = 5，停。第 3 轮 3 到下标 2 后只剩左孩子 H[4] = 1（H[5] 已不在堆里），3 ≥ 1，停。共 6 轮，结果 1 2 3 5 6 8 9。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 把上面 C 代码排序循环里的 siftdown(H, size - 1, 1) 写成 siftdown(H, size, 1)。对 H[1..3] = [3, 1, 2] 运行，输出什么？为什么？</summary>
  <div class="qa__body">
<pre><code class="lang-text">建堆      3 的孩子 1、2，不动                    3 1 2
size = 3  交换 H[1]、H[3]                       2 1 3
          在 H[1..3] 里下沉 2：孩子 1、3，3 &gt; 2   3 1 2
size = 2  交换 H[1]、H[2]                       1 3 2
          在 H[1..2] 里下沉 1：孩子 3 &gt; 1        3 1 2</code></pre>
<p>输出 <strong>3 1 2</strong>，没有排序。每轮刚换到 H[size] 的最大值仍被当成堆的一部分，下沉时作为较大的孩子又被换回堆顶。交换之后堆是 H[1..size−1]，下沉范围必须是 size − 1。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 多选，哪些正确？(A) 堆排序最坏情况是 O(n log n)；(B) 堆排序需要 O(n) 的额外数组；(C) sift down 遇到相等的孩子不交换，所以堆排序稳定；(D) 输入已经升序时，堆排序只要 O(n)；(E) 降序数组（下标从 1 开始）本身就是一个最大堆；(F) 用最小堆按同样的步骤原地排序，结果是降序。</summary>
  <div class="qa__body">
<p><strong>A、E、F 正确。</strong></p>
<p>A：建堆 Θ(n)，n − 1 次下沉每次 O(log n)，与输入无关。E：父结点 ⌊i/2⌋ 在 i 前面，降序数组里前面的不小于后面的，每个父结点都 ≥ 孩子。F：最小堆每轮把最小值换到末尾，末尾从小到大向左排，读出来是降序。</p>
<p>B 错：只在原数组里交换，O(1)。C 错：不稳定来自堆顶和末尾的远距离交换，反例 7₁ 7₂ 7₃ 排完是 7₂ 7₃ 7₁。D 错：不自适应，已升序的输入照样 n log n。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 对某个 8 个元素的数组做堆排序（最大堆，下标从 1 开始）。下面哪个可能是第 3 轮结束后的数组？(A) 9 7 8 1 2 10 12 15；(B) 8 7 9 1 2 10 12 15；(C) 9 7 8 1 2 12 10 15；(D) 11 7 8 1 2 10 12 15</summary>
  <div class="qa__body">
<p>3 轮之后 size = 5：H[1..5] 必须是最大堆，H[6..8] 必须是全体最大的 3 个且升序。</p>
<ul>
<li>(A) 前 5 个 9 7 8 1 2：9 ≥ 7、8，7 ≥ 1、2，是最大堆；后 3 个 10 12 15 升序，且都比 9 大。<strong>可能</strong>，例如输入正是 [9, 7, 8, 1, 2, 10, 12, 15] 时，3 轮后就是这个数组。</li>
<li>(B) 堆顶 8 &lt; 右孩子 9，前 5 个不是堆。</li>
<li>(C) 12 10 15 不是升序。</li>
<li>(D) 堆里的 11 比已排好的 10 大，10 不可能比 11 先被取出。</li>
</ul>
<p>答案只有 <strong>A</strong>。</p>
  </div>
</details>
`;
