/* Post body — dsa-past-papers / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-past-papers:zh'] = `
<p class="lead">2015、2016 两年期末卷共 11 道大题，按考点归成七组：C 编程、复杂度填空、堆、哈希、树的旋转、图算法、排序。官方参考解答有几处错误，集中在素数判断、快速排序的额外空间、Prim 配平衡 BST 的复杂度和有向图上的最小 fatness 路径。</p>

<h2>旧卷与 2026 年的对应</h2>
<p>两份旧卷都是 3 小时纸笔考试，满分 60 分，全部写在答题本上。2026 年是 3 小时机考（Lockdown Browser），满分 45 分：约 15–20 道自动判分题（单选、多选、配对、填空），加 3–4 道长题（读代码、写代码、算法设计）。对应关系：</p>
<ul>
<li>旧卷里“算出一个结果”的小题（复杂度填空、建堆、哈希填表、旋转、拓扑序、pivot 序列）对应现在的<strong>自动判分题</strong>：只看最终答案，没有地方写假设，过程对、结果错不得分。</li>
<li>旧卷的 C 编程题和“设计一个算法”题（最小 fatness 路径、让 Prim 处理非连通图）对应现在的<strong>长题</strong>。课上说 2016 卷的读代码题风格与今年相近，写代码和算法设计题可能不同，最接近的是第 11 周 workshop 第 6 题。</li>
</ul>
<div class="callout note" data-label="不考">
<ul>
<li>2015 Q5(b)：三道 A* 搜索的判断题。A* 不在 2026 年大纲内。</li>
<li>2016 Q3(a)：并查集（disjoint sets / union-find）森林的合并与查找。不考。</li>
<li>2016 Q4(a) 中 Kruskal 的部分。只在 workshop 讲过，明确不考。</li>
<li>2016 Q4(b)(iii)：A* 是否总能找到最短路。不考。</li>
<li>2016 Q4(b)(iv)：用归约证明 P = NP。P 与 NP 不考。</li>
</ul>
</div>

<h2>C 编程题</h2>

<details class="qa">
<summary class="ripple-surface">2015 Q1（13 分）写 <code>int checkpalindrome(char *buffer)</code>：buffer 是 <code>fgets</code> 读入的一行（末尾带 <code>'\\n'</code>）。判断它是不是回文句，忽略空格、数字、标点和大小写（如 “A man, a plan, a canal, Panama!”），是返回 TRUE，否则 FALSE。</summary>
<div class="qa__body">
<p><strong>思路：两个下标从两端往中间走。</strong>哪边停在非字母上就把哪边挪一步；两边都停在字母上时比较小写形式，不同就返回 FALSE；两下标相遇还没发现不同就是回文。过滤只用 <code>isalpha</code>：<code>isalnum</code> 会留下数字，不合题意。末尾的 <code>'\\n'</code> 不是字母，自动被跳过。每个字符最多看一次，O(n) 时间、O(1) 额外空间。</p>
<pre><code>/* 去掉所有非字母、忽略大小写后正读反读相同则返回 TRUE */
int checkpalindrome(char *buffer)
{
    int i = 0;
    int j = (int)strlen(buffer) - 1;

    while (i &lt; j) {
        if (!isalpha((unsigned char)buffer[i])) {
            i++;                               /* 左边不是字母：跳过 */
        } else if (!isalpha((unsigned char)buffer[j])) {
            j--;                               /* 右边不是字母：跳过 */
        } else if (tolower((unsigned char)buffer[i]) !=
                   tolower((unsigned char)buffer[j])) {
            return FALSE;                      /* 一对字母不同 */
        } else {
            i++;                               /* 这一对相同，向中间收 */
            j--;
        }
    }
    return TRUE;
}</code></pre>
<p>测试：civic、rotator、Ab2c2bA、a Toyota、Drab as a fool, aloof as a bard! 返回 TRUE；hello、ab 返回 FALSE。一个字母都没有的行（如空行）按这段代码返回 TRUE。传给 <code>isalpha</code>、<code>tolower</code> 前先转 <code>unsigned char</code>，负的 <code>char</code> 传进去是未定义行为。只拿部分分的“单词版”：先去掉末尾换行，再逐对比较 <code>buffer[i] == buffer[j]</code>，不跳过、不转小写。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2015 Q2（5 分）找错：程序用 <code>fgets</code> 逐行读进局部数组 <code>char buffer[200]</code>，去掉换行后执行 <code>B[strings] = buffer; strings++;</code>（B 是 malloc 得到、满了就 realloc 翻倍的 <code>char **</code>），最后打印行数，再逐行打印字符串和长度。(a) 输入 giraffes、eat、leaves 三行，输出什么？(b) 错在哪？(c) 怎么改？</summary>
<div class="qa__body">
<p><strong>(a)</strong> 三个指针指向同一个 buffer，里面只剩最后读入的一行：</p>
<pre><code class="lang-text">Read 3 strings:
	leaves	6
	leaves	6
	leaves	6</code></pre>
<p>官方答案只写了三遍 leaves，完整输出还有计数行和长度 6。</p>
<p><strong>(b)</strong> <code>B[strings] = buffer</code> 复制的是<strong>地址</strong>，不是字符串。所有 B[i] 都指向同一块 200 字节的数组，下一次 <code>fgets</code> 覆盖它，前面的行就丢了。</p>
<p><strong>(c)</strong> 第 36 行改成“按长度 malloc 一块新内存再 strcpy”，程序结束前逐个 free：</p>
<pre><code>/* 替换第 36 行 B[strings] = buffer; */
B[strings] = malloc(strlen(buffer) + 1);       /* +1 留给 '\\0' */
if (B[strings] == NULL) {
    printf("string malloc error\\n");
    exit(MALLOC_ERROR);
}
strcpy(B[strings], buffer);

/* 第 44 行 return 之前：先释放每一行，再释放指针数组 */
for (i = 0; i &lt; strings; i++) {
    free(B[i]);
}
free(B);</code></pre>
<p>改后输出 giraffes 8、eat 3、leaves 6。另外两处小毛病：<code>realloc</code> 的返回值应先存进临时变量、确认非 NULL 再赋给 B；最后一行若没有换行符，<code>buffer[strlen(buffer)-1] = '\\0'</code> 会删掉一个真字母。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q1（18 分）整数数组中取一段连续子数组，只把其中的素数加起来（负数按绝对值判断），求这个和的最大值；子数组可以为空，和为 0。例：{1, 1, −5, 3, −3, 2} 的答案是 3。(a) 写 <code>int is_prime(int num)</code>；(b) 写尽量高效的 <code>int max_sum(int *vector, int len)</code>；(c) 写 main：malloc 一个名为 foo 的动态数组，填入例子，打印结果，释放内存。</summary>
<div class="qa__body">
<p><strong>化归：</strong>把每个元素换成“是素数就是它本身，否则是 0”，问题就是经典的<strong>最大子数组和</strong>（maximum subarray）。用 Kadane 扫描一遍：<code>cur</code> 是以当前元素结尾的最佳和，一旦为负就清零（负的前缀只会拖累后面）；<code>best</code> 记录见过的最大 <code>cur</code>。例子换算后是 0, 0, −5, 3, −3, 2，cur 依次为 0, 0, 0, 3, 0, 2，best = 3。（题面的数组声明写成长度 5，实际给了 6 个数。）</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define LEN 6

/* |num| 是素数返回 1，否则返回 0；试除到 √|num| */
int is_prime(int num)
{
    int i;
    if (num &lt; 0) num = -num;              /* -5 按 5 判断 */
    if (num &lt; 2) return 0;                /* 0 和 1 不是素数 */
    for (i = 2; i &lt;= num / i; i++) {      /* 即 i*i &lt;= num，且不会溢出 */
        if (num % i == 0) return 0;
    }
    return 1;
}

/* 连续子数组中素数元素之和的最大值，允许空子数组（和为 0）。
   Kadane：一趟扫描，is_prime 调用 n 次 */
int max_sum(int *vector, int len)
{
    int i, cur = 0, best = 0;
    for (i = 0; i &lt; len; i++) {
        if (is_prime(vector[i])) cur += vector[i];   /* 非素数相当于加 0 */
        if (cur &lt; 0) cur = 0;                        /* 负前缀丢掉，重新开始 */
        if (cur &gt; best) best = cur;
    }
    return best;
}

int main(void)
{
    int example[LEN] = {1, 1, -5, 3, -3, 2};
    int *foo, i;

    foo = malloc(LEN * sizeof(*foo));
    if (foo == NULL) {
        fprintf(stderr, "malloc failed\\n");
        exit(EXIT_FAILURE);
    }
    for (i = 0; i &lt; LEN; i++) foo[i] = example[i];
    printf("%d\\n", max_sum(foo, LEN));               /* 输出 3 */
    free(foo);
    return 0;
}</code></pre>
<p>复杂度：扫描 O(n)，每次 is_prime 试除到 √|x|，合计 O(n√M)，M 为最大绝对值。枚举所有子数组再求和是 O(n³)，用前缀和也要 O(n²)。循环条件写 <code>i &lt;= num / i</code> 而不是 <code>pow</code> 或 <code>sqrt</code>：不用浮点，也不用链接数学库。</p>
<p><strong>官方参考解答有三处问题</strong>：is_prime 的循环条件是 <code>i &lt; pow(num, 0.5) + 1</code>，又没特判 0 和 1，结果 1 被判成素数、2 被判成合数（2 % 2 == 0）；max_sum 是三重循环 O(n³)；内层循环不断覆盖 sum，实际只比较了单个元素，{2, 3} 会得到 3 而不是 5。例子的答案碰巧还是 3。</p>
</div>
</details>

<h2>复杂度填空</h2>

<details class="qa">
<summary class="ripple-surface">2015 Q3（6 分）只写最紧的 Big-O 上界：(1) 往无序链表插入一个元素；(2)(3) 自顶向下 / 自底向上归并排序的时间；(4)(5) 两者的空间；(6) 表长 m、存 n 个元素的哈希表，拉链法的每条链换成平衡 BST，最坏查找时间。</summary>
<div class="qa__body">
<table>
<thead><tr><th>小题</th><th>答案</th><th>理由</th></tr></thead>
<tbody>
<tr><td>(1)</td><td>O(1)</td><td>插在表头，不用找位置</td></tr>
<tr><td>(2)(3)</td><td>O(n log n)</td><td>约 log₂ n 层，每层合并 O(n)；自底向上只是把递归换成循环</td></tr>
<tr><td>(4)(5)</td><td>O(n)</td><td>合并要长 n 的辅助数组；自顶向下另有 O(log n) 递归栈，不改变量级</td></tr>
<tr><td>(6)</td><td>O(log n)</td><td>最坏 n 个键落进同一个桶，这棵平衡树有 n 个结点</td></tr>
</tbody>
</table>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q2（6 分）只写最紧的 Big-O 上界：(a) 往有序链表插入一个元素；(b) 快速排序的时间；(c) 在完全平衡的三叉树（每个结点至多 3 个孩子）中查找；(d) 快速排序的额外空间；(e) 值域为 r 时自底向上归并排序的额外空间；(f) 表长 m、已有 m − 1 个元素的拉链法哈希表，再插入一个的最坏时间。</summary>
<div class="qa__body">
<table>
<thead><tr><th>小题</th><th>答案</th><th>理由</th></tr></thead>
<tbody>
<tr><td>(a)</td><td>O(n)</td><td>先顺着链找位置，最坏走到表尾</td></tr>
<tr><td>(b)</td><td>O(n²)</td><td>最坏情况，如已排序输入配首元素 pivot；平均才是 O(n log n)</td></tr>
<tr><td>(c)</td><td>O(log n)</td><td>高度约 log₃ n，底数只差常数倍</td></tr>
<tr><td>(d)</td><td>O(log n)（课上答案）</td><td>来自递归栈，平均深度 log n；最坏深度 n，即 O(n)。官方答 O(1)，漏了递归栈</td></tr>
<tr><td>(e)</td><td>O(n)</td><td>r 是干扰项：值域只影响计数排序的 O(K)，归并要的是长 n 的辅助数组</td></tr>
<tr><td>(f)</td><td>O(1)</td><td>本课程新结点插在链表头；若要求插入前先查重，最坏扫完整条链，O(m)</td></tr>
</tbody>
</table>
</div>
</details>

<h2>堆与优先队列</h2>

<details class="qa">
<summary class="ripple-surface">2015 Q4(a)（4 分）数组 100 12 79 11 13 77 11 87 25 用自底向上（bottom-up）方法建<strong>最小堆</strong>，写出过程，结果给出数组和树两种形式；再说明自底向上为什么优于逐个插入。</summary>
<div class="qa__body">
<p>按课上约定数组从<strong>下标 1</strong> 开始，n = 9，最后一个有孩子的结点是 ⌊9/2⌋ = 4。从 i = 4 倒着做到 1，对每个结点 sift down：和<strong>较小</strong>的孩子交换，直到不大于两个孩子；两孩子相等时取左孩子（右孩子严格更小才选右）。</p>
<pre><code class="lang-text">初始       100 12 79 11 13 77 11 87 25
i=4 (11)   孩子 87, 25 都更大，不动
i=3 (79)   孩子 77, 11 → 与 11 交换
           100 12 11 11 13 77 79 87 25
i=2 (12)   孩子 11, 13 → 与 11 交换；新孩子 87, 25 都更大，停
           100 11 11 12 13 77 79 87 25
i=1 (100)  孩子 11, 11 相等 → 与左边的 11 交换
           新孩子 12, 13 → 与 12 交换
           新孩子 87, 25 → 与 25 交换
           11 12 11 25 13 77 79 87 100</code></pre>
<figure class="fig">
<svg viewBox="0 0 360 205" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="最终的最小堆：11 12 11 25 13 77 79 87 100">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="180" y1="25" x2="265" y2="75"/><line x1="95" y1="75" x2="138" y2="125"/>
<line x1="265" y1="75" x2="222" y2="125"/><line x1="265" y1="75" x2="308" y2="125"/>
<line x1="52" y1="125" x2="28" y2="175"/>
</g>
<g stroke="#d97757" stroke-width="3">
<line x1="180" y1="25" x2="95" y2="75"/><line x1="95" y1="75" x2="52" y2="125"/><line x1="52" y1="125" x2="76" y2="175"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="180" cy="25" r="17"/><circle cx="95" cy="75" r="17"/><circle cx="265" cy="75" r="17"/>
<circle cx="52" cy="125" r="17"/><circle cx="138" cy="125" r="17"/><circle cx="222" cy="125" r="17"/><circle cx="308" cy="125" r="17"/>
<circle cx="28" cy="175" r="17"/>
</g>
<circle cx="76" cy="175" r="17" fill="#343433" stroke="#d97757" stroke-width="2.5"/>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="180" y="30">11</text><text x="95" y="80">12</text><text x="265" y="80">11</text>
<text x="52" y="130">25</text><text x="138" y="130">13</text><text x="222" y="130">77</text><text x="308" y="130">79</text>
<text x="28" y="180">87</text><text x="76" y="180">100</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="207" y="18">1</text><text x="122" y="68">2</text><text x="292" y="68">3</text>
<text x="79" y="118">4</text><text x="165" y="118">5</text><text x="249" y="118">6</text><text x="335" y="118">7</text>
<text x="28" y="202">8</text><text x="76" y="202">9</text>
</g>
</svg>
<figcaption>最终最小堆，灰色数字是数组下标；橙色是 100 从根下沉到下标 9 的路径。</figcaption>
</figure>
<p><strong>数组：11 12 11 25 13 77 79 87 100。</strong>若相等时取右孩子，得到 11 11 77 12 13 100 79 87 25，同样是合法的最小堆，官方两种都给了。逐个插入（每次 sift up）得到的是第三种：11 12 11 25 13 79 77 100 87。</p>
<p><strong>为什么优先自底向上：</strong>它是 <strong>Θ(n)</strong>，逐个插入最坏 <strong>Θ(n log n)</strong>。“具体”体现在：一半结点是叶子，自底向上时根本不动，倒数第二层最多下沉 1 层，只有极少数靠近根的结点会下沉 log n 层，总移动量 O(n)；逐个插入时，最后插入的大批结点都在底层，最坏每个要上浮约 log₂ n 层（见 6.3 建堆）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2015 Q4(c) / 2016 Q3(c)（各 2 分）四叉堆（quaternary heap）/ 三叉堆（ternary heap）存在数组里，下标为 i 的结点，孩子在哪些下标？写明假设。</summary>
<div class="qa__body">
<p>要写的假设就是<strong>下标从几开始</strong>，以及“算出的下标 ≤ n 时孩子才存在”。逐层排满就能推出：从 0 开始时，下标 i 之前的 i 个结点共占掉 d·i 个孩子位置，所以 i 的孩子从 d·i + 1 开始。</p>
<table>
<thead><tr><th></th><th>下标从 0 开始</th><th>下标从 1 开始（课上约定）</th></tr></thead>
<tbody>
<tr><td>二叉</td><td>2i+1, 2i+2</td><td>2i, 2i+1</td></tr>
<tr><td>三叉</td><td>3i+1, 3i+2, 3i+3</td><td>3i−1, 3i, 3i+1</td></tr>
<tr><td>四叉</td><td>4i+1, 4i+2, 4i+3, 4i+4</td><td>4i−2, 4i−1, 4i, 4i+1</td></tr>
<tr><td>结点 j 的父结点</td><td>⌊(j−1)/d⌋</td><td>⌊(j+d−2)/d⌋</td></tr>
</tbody>
</table>
<p>验算（从 1 开始的三叉堆）：根 1 的孩子是 2, 3, 4，结点 2 的孩子是 5, 6, 7，正好接着排。官方只给了从 0 开始的版本（见 6.1 堆：定义与数组表示）。</p>
</div>
</details>

<h2>哈希</h2>

<details class="qa">
<summary class="ripple-surface">2015 Q6(a)（5 分）表长 12，h(k) = k mod 12，线性探测（linear probing），依次插入 17、53、41、29。(i) 画出表；(ii) 查找 125 要比较几次键？(iii) 换哪种冲突处理能减少这次查找的比较次数？为什么？</summary>
<div class="qa__body">
<p>先算余数：17、53、41、29 两两相差 12 的倍数，除以 12 <strong>都余 5</strong>，125 也余 5。所以四个键从 5 号起排成一串：</p>
<pre><code class="lang-text">下标  0  1  2  3  4  5   6   7   8   9  10  11
      -  -  -  -  -  17  53  41  29  -  -   -</code></pre>
<p><strong>(ii) 4 次。</strong>从 5 号起依次和 17、53、41、29 比较，9 号为空，查找失败；碰到空槽不算键比较。</p>
<p><strong>(iii) 双重哈希（double hashing）。</strong>冲突后的步长由第二个哈希函数决定，余数相同的键步长一般不同，不会挤成一串，探测很快碰到空槽。取课上的形式 h₂(k) = (k mod 11) + 1：53 步长 10 落在 3 号，41 步长 9 落在 2 号，29 步长 8 落在 1 号；查 125 时先比较 5 号的 17，再按步长 5 跳到 10 号空槽，<strong>只比较 1 次</strong>。12 不是素数，步长 2、3、4 等与 12 不互素时走不遍整张表，实际应选素数表长。拉链法在这里帮不上忙：四个键都在 5 号链上，查找不存在的 125 仍要比较 4 次。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q5(d)（3 分）表长 10，h(k) = k mod 10，线性探测，依次插入 1、23、43、99、44、79、89。(i) 画出表；(ii) 改用拉链法（chaining），查找 89 的键比较次数会减少吗？</summary>
<div class="qa__body">
<pre><code class="lang-text">1  → 1
23 → 3
43 → 3 被占 → 4
99 → 9
44 → 4 被占 → 5
79 → 9 被占 → 回绕到 0
89 → 9、0、1 都被占 → 2

下标  0   1   2   3   4   5   6  7  8  9
      79  1   89  23  43  44  -  -  -  99</code></pre>
<p><strong>(ii) 会减少。</strong>线性探测查 89：依次比较 99、79、1、89，共 <strong>4 次</strong>；其中 1 的余数根本不是 9，只是 79 回绕后形成的聚集（clustering）挡在路上。拉链法的 9 号链只含余数为 9 的 99、79、89。课上约定新结点插在链表头，链为 89 → 79 → 99，<strong>1 次</strong>；即使插在表尾也只要 3 次。</p>
</div>
</details>

<h2>树与旋转</h2>

<details class="qa">
<summary class="ripple-surface">2015 Q6(b)（5 分）一棵 BST：H 的左孩子 F（F 的孩子 D、G），右孩子 M；M 的左孩子 J、右孩子 R；R 的孩子 Q、W。对边 M–R 做一次左旋。(i) 画出旋转后的树；(ii) 用指向 H、M、R 的指针写出完成左旋的 C 语句。</summary>
<div class="qa__body">
<p>左旋把 R 提上来：R 接替 M 成为 H 的右孩子，M 成为 R 的左孩子，R 原来的左子树 Q 改挂为 M 的右子树（Q 介于 M 与 R 之间，挂在这里 BST 性质不变）。其余结点不动。<strong>旋转不改变中序遍历</strong>，前后都是 D F G H J M Q R W，画完可以据此核对。</p>
<figure class="fig">
<svg viewBox="0 0 620 200" width="620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="左旋前后：R 取代 M，Q 改挂到 M 的右边">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="140" y1="25" x2="70" y2="75"/><line x1="140" y1="25" x2="210" y2="75"/><line x1="70" y1="75" x2="35" y2="125"/><line x1="70" y1="75" x2="105" y2="125"/>
<line x1="210" y1="75" x2="175" y2="125"/><line x1="245" y1="125" x2="275" y2="175"/>
<line x1="480" y1="25" x2="410" y2="75"/><line x1="480" y1="25" x2="550" y2="75"/><line x1="410" y1="75" x2="375" y2="125"/><line x1="410" y1="75" x2="445" y2="125"/>
<line x1="550" y1="75" x2="585" y2="125"/><line x1="515" y1="125" x2="485" y2="175"/>
</g>
<g stroke="#d97757" stroke-width="3.5"><line x1="210" y1="75" x2="245" y2="125"/><line x1="550" y1="75" x2="515" y2="125"/></g>
<g stroke="#4ade80" stroke-width="2.5"><line x1="245" y1="125" x2="215" y2="175"/><line x1="515" y1="125" x2="545" y2="175"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="140" cy="25" r="16"/><circle cx="70" cy="75" r="16"/><circle cx="35" cy="125" r="16"/><circle cx="105" cy="125" r="16"/><circle cx="175" cy="125" r="16"/><circle cx="275" cy="175" r="16"/>
<circle cx="480" cy="25" r="16"/><circle cx="410" cy="75" r="16"/><circle cx="375" cy="125" r="16"/><circle cx="445" cy="125" r="16"/><circle cx="585" cy="125" r="16"/><circle cx="485" cy="175" r="16"/>
</g>
<g fill="#343433" stroke="#d97757" stroke-width="2.5">
<circle cx="210" cy="75" r="16"/><circle cx="245" cy="125" r="16"/><circle cx="550" cy="75" r="16"/><circle cx="515" cy="125" r="16"/>
</g>
<g fill="#343433" stroke="#4ade80" stroke-width="2.5"><circle cx="215" cy="175" r="16"/><circle cx="545" cy="175" r="16"/></g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="140" y="30">H</text><text x="70" y="80">F</text><text x="210" y="80">M</text><text x="35" y="130">D</text><text x="105" y="130">G</text><text x="175" y="130">J</text><text x="245" y="130">R</text><text x="215" y="180">Q</text><text x="275" y="180">W</text>
<text x="480" y="30">H</text><text x="410" y="80">F</text><text x="550" y="80">R</text><text x="375" y="130">D</text><text x="445" y="130">G</text><text x="515" y="130">M</text><text x="585" y="130">W</text><text x="485" y="180">J</text><text x="545" y="180">Q</text>
<text x="325" y="105">左旋 →</text>
</g>
</svg>
<figcaption>左：旋转前，橙色为边 M–R；右：旋转后。绿色的 Q 从 R 的左边换到 M 的右边。</figcaption>
</figure>
<p>(ii) 结点为 <code>struct node { char key; struct node *left; struct node *right; }</code>（题面的定义多了一个星号）。设 g、p、c 分别指向 H、M、R：</p>
<pre><code>/* g = H（祖父），p = M（父），c = R（p 的右孩子） */
p-&gt;right = c-&gt;left;    /* Q 从 R 的左边改挂到 M 的右边 */
c-&gt;left  = p;          /* M 成为 R 的左孩子 */
g-&gt;right = c;          /* R 接替 M 成为 H 的右孩子 */</code></pre>
<p>前两句不能对调：先执行 <code>c-&gt;left = p</code> 会丢掉 Q。若 M 是 H 的左孩子，最后一句改成 <code>g-&gt;left = c</code>；若 M 是根，就改根指针（见 3.6 AVL 旋转）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q5(e)（2 分）一棵 BST：根 7，左孩子 4（4 的左孩子 2），右孩子 32；32 的孩子是 12 和 38；12 的孩子是 8 和 17；8 只有右孩子 10。用一次旋转使它平衡，说明是哪种旋转并画出结果。</summary>
<div class="qa__body">
<p>按课程约定<strong>叶子高度为 1</strong>，算高度和平衡因子（左高 − 右高）：10、17、38、2 高 1；8 高 2（−1）；12 高 3（+1）；4 高 2（+1）；32 高 4（3 − 1 = <strong>+2</strong>）；7 高 5（2 − 4 = <strong>−2</strong>）。</p>
<p>失衡的有 7 和 32，从<strong>最深的失衡结点 32</strong> 修。32 左高，它的左孩子 12 也左高（+1），是 <strong>LL 情形，在 32 处右旋</strong>（旋转边 12–32）：12 上来，32 成为 12 的右孩子，12 原来的右子树 17 改挂为 32 的左孩子。</p>
<figure class="fig">
<svg viewBox="0 0 640 250" width="640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="在 32 处右旋前后的树">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="150" y1="25" x2="80" y2="75"/><line x1="150" y1="25" x2="220" y2="75"/><line x1="80" y1="75" x2="45" y2="125"/><line x1="220" y1="75" x2="255" y2="125"/>
<line x1="185" y1="125" x2="150" y2="175"/><line x1="150" y1="175" x2="185" y2="225"/>
<line x1="480" y1="25" x2="410" y2="75"/><line x1="480" y1="25" x2="550" y2="75"/><line x1="410" y1="75" x2="375" y2="125"/><line x1="550" y1="75" x2="500" y2="125"/>
<line x1="500" y1="125" x2="530" y2="175"/><line x1="600" y1="125" x2="622" y2="175"/>
</g>
<g stroke="#d97757" stroke-width="3.5"><line x1="220" y1="75" x2="185" y2="125"/><line x1="550" y1="75" x2="600" y2="125"/></g>
<g stroke="#4ade80" stroke-width="2.5"><line x1="185" y1="125" x2="220" y2="175"/><line x1="600" y1="125" x2="575" y2="175"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="80" cy="75" r="16"/><circle cx="45" cy="125" r="16"/><circle cx="255" cy="125" r="16"/><circle cx="150" cy="175" r="16"/><circle cx="185" cy="225" r="16"/>
<circle cx="480" cy="25" r="16"/><circle cx="410" cy="75" r="16"/><circle cx="375" cy="125" r="16"/><circle cx="500" cy="125" r="16"/><circle cx="530" cy="175" r="16"/><circle cx="622" cy="175" r="16"/>
</g>
<g fill="#343433" stroke="#f87171" stroke-width="2.5"><circle cx="150" cy="25" r="16"/><circle cx="220" cy="75" r="16"/></g>
<g fill="#343433" stroke="#d97757" stroke-width="2.5"><circle cx="185" cy="125" r="16"/><circle cx="550" cy="75" r="16"/><circle cx="600" cy="125" r="16"/></g>
<g fill="#343433" stroke="#4ade80" stroke-width="2.5"><circle cx="220" cy="175" r="16"/><circle cx="575" cy="175" r="16"/></g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="150" y="30">7</text><text x="80" y="80">4</text><text x="220" y="80">32</text><text x="45" y="130">2</text><text x="185" y="130">12</text><text x="255" y="130">38</text><text x="150" y="180">8</text><text x="220" y="180">17</text><text x="185" y="230">10</text>
<text x="480" y="30">7</text><text x="410" y="80">4</text><text x="550" y="80">12</text><text x="375" y="130">2</text><text x="500" y="130">8</text><text x="600" y="130">32</text><text x="530" y="180">10</text><text x="575" y="180">17</text><text x="622" y="180">38</text>
<text x="315" y="110">右旋 →</text>
</g>
<g font-size="13" font-weight="700">
<text x="172" y="20" fill="#f87171">−2</text><text x="242" y="68" fill="#f87171">+2</text><text x="163" y="122" fill="#fbbf24" text-anchor="end">+1</text>
</g>
</svg>
<figcaption>左：红色为失衡结点及平衡因子，橙色为旋转边 12–32；右：旋转后。绿色的 17 从 12 的右边换到 32 的左边。</figcaption>
</figure>
<p>旋转后 8、32 高 2，12 高 3，7 的平衡因子变为 2 − 3 = −1，<strong>所有结点都在 −1…1 之间</strong>，根 7 不需要再动。</p>
</div>
</details>

<h2>图算法</h2>

<details class="qa">
<summary class="ripple-surface">2015 Q5(a)（3 分）Floyd-Warshall 求全源最短路的运行时间：(i) 用 V 表示；(ii) 稠密图用 E 表示；(iii) 稀疏图用 E 表示。</summary>
<div class="qa__body">
<p>(i) <strong>Θ(V³)</strong>：三重循环各 V 次，与边数无关。(ii) 稠密图 E ≈ V²，V ≈ E<sup>1/2</sup>，得 <strong>Θ(E<sup>3/2</sup>)</strong>。(iii) 稀疏（连通）图 E ≈ V，得 <strong>Θ(E³)</strong>。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2015 Q4(b)（4 分）Dijkstra 的优先队列分别用 (i) 堆、(ii) 按距离排序的链表实现，复杂度各是多少？</summary>
<div class="qa__body">
<p>数操作：<strong>V 次 deletemin</strong>，每条边至多松弛一次，所以<strong>至多 E 次 update</strong>。</p>
<table>
<thead><tr><th>PQ</th><th>deletemin</th><th>update</th><th>总计</th></tr></thead>
<tbody>
<tr><td>二叉堆</td><td>O(log V)</td><td>O(log V)</td><td><strong>O((V + E) log V)</strong></td></tr>
<tr><td>有序链表</td><td>O(1)，取表头</td><td>O(V)，摘下后重新找位置</td><td><strong>O(V + EV) = O(EV)</strong></td></tr>
<tr><td>无序数组（对照）</td><td>O(V)，扫一遍</td><td>O(1)</td><td>O(V² + E) = O(V²)</td></tr>
</tbody>
</table>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q3(b)（4 分）Prim 的优先队列用平衡二叉搜索树实现（题目说删除时用中序找前驱 / 后继），复杂度是多少？</summary>
<div class="qa__body">
<p><strong>O((V + E) log V)</strong>，与二叉堆相同。deletemin 是从根一路向左走到最小结点再删掉，O(log V)；update 是删除旧键再插入新键，O(log V)；共 V 次 deletemin、至多 E 次 update。删除有两个孩子的结点时，中序后继沿一条路径就能找到，也是 O(log V)。</p>
<p>官方解答把“中序”理解成遍历整棵树，deletemin 记 O(V)，得到 O(V² + E log V)，又写成 O(V²)：后一步丢掉了 E log V，稠密图 E ≈ V² 时它比 V² 大（见 7.7 最小生成树与 Prim 算法）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q4(a)（3 分）E = V 和 E = V² 时，求最小生成树各用什么算法最好？给出最坏复杂度。</summary>
<div class="qa__body">
<p>官方答案是“稀疏用 Kruskal、稠密用 Prim”，Kruskal 今年不考。只用 Prim 作答：邻接表 + 二叉堆是 O((V + E) log V)，<strong>E = V 时 O(V log V)</strong>；E = V² 时为 O(V² log V)，此时改用邻接矩阵 + 普通数组存 key（每轮扫一遍找最小 O(V)，更新 O(1)），<strong>共 O(V²)</strong>，比堆版更好。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q4(b)(i)(ii)（各 1 分）判断并说明：(i) 对无向图做一次深度优先遍历就能访问全部顶点；(ii) 在带权 DAG 上，BFS 和 Dijkstra 总能找到最短路。</summary>
<div class="qa__body">
<p><strong>(i) 错（官方答案）。</strong>从一个起点出发的一次 DFS 只能走完起点所在的连通分量，图不连通就会漏点。课上的完整 DFS 在外层对所有顶点循环、遇到未访问的就重新开始，这样才能访问全部顶点；作答时写明是哪一种（见 7.3 深度优先搜索）。</p>
<p><strong>(ii) 错。</strong>BFS 只数边数、不看权重：S→A(1)、A→T(1)、S→T(5)，BFS 给出 S→T，长 5，最短是 2。Dijkstra 要求边权非负，而 DAG 可以有负权边，反例见 2016 Q4(d)。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q4(c)（4 分）有向图中，所有顶点的出度之和与入度之和是什么关系？</summary>
<div class="qa__body">
<p><strong>相等，都等于 E。</strong>每条有向边 (u, v) 恰好给 u 贡献 1 个出度、给 v 贡献 1 个入度。（无向图对应的是 ∑deg = 2E。）</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q4(d)（5 分）构造一个图，使 Dijkstra 算出错误的距离，并解释原因。</summary>
<div class="qa__body">
<p>有向图，起点 S：S→A(2)、S→B(4)、B→A(−3)、A→T(1)。</p>
<table>
<thead><tr><th>出队</th><th>松弛</th></tr></thead>
<tbody>
<tr><td>S (0)</td><td>A = 2，B = 4</td></tr>
<tr><td>A (2)</td><td>T = 3；A 定稿</td></tr>
<tr><td>T (3)</td><td>无出边</td></tr>
<tr><td>B (4)</td><td>4 − 3 = 1 &lt; 2，但 A 已定稿，不再更新</td></tr>
</tbody>
</table>
<p>结果 A = 2、T = 3；真实最短是 A = 1（S→B→A）、T = 2。<strong>原因</strong>：Dijkstra 认定“PQ 里最小的距离已是最终值”，依据是任何绕路都只会更长；负权边让绕路反而变短，这条依据就不成立。一条负权边就够，不需要负环；官方给的例子含负环，负环上的最短路本身没有定义（见 7.5 Dijkstra 单源最短路）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2015 Q5(c)（5 分）连通的带权<strong>有向图</strong>中，一条路径的 fatness 是路径上最大的边权。给定 u、v，设计高效算法求 u 到 v 所有路径中最小的 fatness。</summary>
<div class="qa__body">
<p><strong>改造 Dijkstra</strong>：路径代价从“边权之和”换成“边权最大值”，其余照旧。</p>
<pre><code class="lang-text">MinFatness(G, u, v):
    对每个顶点 x: f[x] = ∞
    f[u] = −∞                          // 还没有边
    PQ = 所有顶点，按 f 排序（最小堆）
    while PQ 非空:
        x = deleteMin(PQ)              // f[x] 定稿
        if x == v: return f[v]
        for 每条边 (x, y)，y 未定稿:
            c = max(f[x], w(x, y))     // 原来是 f[x] + w(x, y)
            if c &lt; f[y]:
                f[y] = c;  update(PQ, y)</code></pre>
<p>正确性同 Dijkstra：路径往后延长，max 只增不减（负权也成立），所以出队的最小值不会再被改进。复杂度同 Dijkstra，二叉堆 <strong>O((V + E) log V)</strong>。另一种做法：把不同的边权排序，二分一个阈值 W，只用权 ≤ W 的边从 u 做 BFS / DFS 看能否到 v，O((V + E) log E)。</p>
<p>官方答案“先建 MST 再跑 Dijkstra”只适用于<strong>无向图</strong>（无向图中 MST 上的路径确实是 fatness 最小的路径，见 8.6 算法设计题怎么答）。MST 不考虑方向。反例：u→v(9)、w→u(1)、w→v(1)，忽略方向的 MST 取两条权 1 的边，给出 1；但从 u 出发只有 u→v 一条路，fatness 是 9。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2015 Q5(d)（5 分）Prim 只能处理连通图。做一处小改动，让它在不连通的带权无向图上为每个连通分量各建一棵最小生成树。</summary>
<div class="qa__body">
<p>外面套一层对所有顶点的循环，和完整 DFS 的外层循环同一个思路：</p>
<pre><code class="lang-text">PrimForest(G):
    对每个顶点 x: inMST[x] = false; dist[x] = ∞; pred[x] = 无
    for 每个顶点 s:
        if not inMST[s]:
            dist[s] = 0                // s 是新一棵树的根
            从 s 跑一次 Prim           // 结束时 s 所在分量全部 inMST</code></pre>
<p>inMST、pred 在各次运行之间保留，pred 为“无”的顶点就是各棵树的根。每个顶点只进出 PQ 一次，每条边只检查常数次，总复杂度仍是 <strong>O((V + E) log V)</strong>。若实现一开始就把所有顶点以 ∞ 放进 PQ，改动更小：deletemin 取出 dist = ∞ 的顶点，说明当前分量已建完，把它当新树的根（pred 置空）继续即可。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q5(c)（2 分）有向图的边为 1→2、1→4、2→3、2→4、2→6、3→5、4→6、5→4、5→6，求拓扑排序并写出过程。</summary>
<div class="qa__body">
<p>源点删除法（source removal）：入度 1:0、2:1、3:1、4:3、5:1、6:3。</p>
<pre><code class="lang-text">取出  入度变化
1     2:0  4:2
2     3:0  4:1  6:2
3     5:0
5     4:0  6:1
4     6:0
6</code></pre>
<p>每一步都只有一个入度为 0 的顶点，所以拓扑序<strong>唯一：1 2 3 5 4 6</strong>（图中有一条经过全部顶点的路径 1→2→3→5→4→6）。DFS 法：从 1 出发、邻居按编号顺序访问，explore 结束的顺序是 6 4 5 3 2 1，反过来同样是 1 2 3 5 4 6（见 7.8 拓扑排序）。</p>
<figure class="fig">
<svg viewBox="0 0 580 210" width="580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="按拓扑序 1 2 3 5 4 6 排成一行，所有边都指向右边">
<defs><marker id="pp-topo-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#a1a1a0"/></marker></defs>
<g stroke="#a1a1a0" stroke-width="2" fill="none" marker-end="url(#pp-topo-ah)">
<line x1="56" y1="105" x2="123" y2="105"/><line x1="156" y1="105" x2="223" y2="105"/><line x1="256" y1="105" x2="323" y2="105"/>
<line x1="356" y1="105" x2="423" y2="105"/><line x1="456" y1="105" x2="523" y2="105"/>
<path d="M40,89 Q240,-49 441,89"/><path d="M140,89 Q285,14 431,92"/>
<path d="M140,121 Q341,269 541,121"/><path d="M340,121 Q435,205 531,118"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="40" cy="105" r="16"/><circle cx="140" cy="105" r="16"/><circle cx="240" cy="105" r="16"/><circle cx="340" cy="105" r="16"/><circle cx="440" cy="105" r="16"/><circle cx="540" cy="105" r="16"/>
</g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="40" y="110">1</text><text x="140" y="110">2</text><text x="240" y="110">3</text><text x="340" y="110">5</text><text x="440" y="110">4</text><text x="540" y="110">6</text>
</g>
</svg>
<figcaption>按拓扑序排成一行：9 条边全部从左指向右。</figcaption>
</figure>
</div>
</details>

<h2>排序</h2>

<details class="qa">
<summary class="ripple-surface">2016 Q5(a)（1.5 分）对 7 个整数做自底向上（bottom-up）归并排序，一共做几次合并？给出准确数字并说明。</summary>
<div class="qa__body">
<p><strong>6 次。</strong>宽度 1：合并 (1,2)、(3,4)、(5,6)，第 7 个没有搭档，原样保留，3 次；宽度 2：(12,34)、(56,7)，2 次；宽度 4：(1234,567)，1 次。一般地，每次合并把两段有序段并成一段，从 n 段到 1 段正好 <strong>n − 1</strong> 次。自底向上是循环实现，mergesort 本身只调用 1 次；自顶向下的递归调用是 2n − 1 = 13 次，合并同样 6 次。官方写“7（或 6）”，课上的写法里落单的段直接保留、不算合并，答 6（见 5.8 自底向上与自适应归并排序）。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2016 Q5(b)（1.5 分）对 {13, 4, 5, 43, 22, 2, 3, 1} 做快速排序，每次取最左元素为 pivot；分区时保持元素原来的相对顺序（不必按下标模拟）。依次选出哪些 pivot？</summary>
<div class="qa__body">
<pre><code class="lang-text">[13 4 5 43 22 2 3 1]  pivot 13 → [4 5 2 3 1] 13 [43 22]
[4 5 2 3 1]           pivot 4  → [2 3 1] 4 [5]
[2 3 1]               pivot 2  → [1] 2 [3]
[43 22]               pivot 43 → [22] 43 []</code></pre>
<p>真正做了分区的 pivot 依次是 <strong>13, 4, 2, 43</strong>，长度为 1 的段不需要分区。若把单元素段也算作“选了 pivot”，按递归顺序是 13, 4, 2, 1, 3, 5, 43, 22，即官方答案。</p>
<p>题目特意要求保持相对顺序：若用课上的双指针原地分区，第一次分区后数组变成 [2 4 5 1 3] 13 [22 43]，之后的 pivot 依次是 13, 2, 5, 3, 22。分区方式不同，pivot 序列就不同，按题目规定的方式走（见 5.5 快速排序：pivot 与分区）。</p>
</div>
</details>

<h2>考试怎么考</h2>
<ul>
<li><strong>两年都出现的题型</strong>：d 叉堆的孩子下标（2015 四叉、2016 三叉）；换一种 PQ 后 Dijkstra / Prim 的复杂度；线性探测填表，再和另一种冲突处理比比较次数；指定一条边旋转并画图或写指针语句；C 题都要 malloc / free，处理字符串或数组。</li>
<li><strong>自动判分题没有地方写假设</strong>，一律按课程约定：堆从下标 1 开始、两孩子相等取左；拉链法插在表头；快排用课上的双指针分区，除非题目另有规定；叶子高度为 1。</li>
<li><strong>陷阱</strong>：题干里多余的参数（归并排序的值域 r）；快排的额外空间来自递归栈；从一个起点出发的 DFS 只覆盖一个连通分量；BFS 不看权重，Dijkstra 不能有负权边；有向图上不能套 MST；查找失败时空槽不算键比较。</li>
<li><strong>写代码的得分点</strong>（旧卷评分写明）：正确、完整、高效、规范使用 C（检查 malloc 返回值、free、<code>unsigned char</code> 转换、判素数不用浮点）、可读与注释。2016 Q1 的“高效”就是把 O(n³) 枚举换成一趟扫描。</li>
<li>公式表有对数恒等式、求和公式、主定理和装载因子估计，但上面每题的结论都不在表上：d 叉堆下标、各种 PQ 下的复杂度要会当场推。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 读代码：下面的 is_prime 对 0、1、2、3、9 各返回什么？怎么改？
<code>int is_prime(int num) { int i; if (num &lt; 0) num = -num; for (i = 2; i &lt; sqrt(num) + 1; i++) if (num % i == 0) return 0; return 1; }</code></summary>
<div class="qa__body">
<p><strong>依次返回 1, 1, 0, 1, 0。</strong>0：sqrt(0) + 1 = 1，循环一次都不执行，返回 1（错）。1：条件 2 &lt; 2 不成立，返回 1（错）。2：2 &lt; 2.41 成立，2 % 2 == 0，返回 0（错）。3：i = 2 不整除，i = 3 时 3 &lt; 2.73 不成立，返回 1。9：i = 3 整除，返回 0。</p>
<p>改法：开头加 <code>if (num &lt; 2) return 0;</code>，条件改成 <code>i &lt;= num / i</code>。此时 2 的循环条件 2 &lt;= 1 不成立，直接返回 1。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 同一数组 100 12 79 11 13 77 11 87 25，用自底向上方法建<strong>最大堆</strong>（下标从 1 开始），结果是什么？一共交换几次？</summary>
<div class="qa__body">
<pre><code class="lang-text">i=4 (11)   孩子 87, 25 → 与 87 交换
           100 12 79 87 13 77 11 11 25
i=3 (79)   孩子 77, 11 都更小，不动
i=2 (12)   孩子 87, 13 → 与 87 交换；新孩子 11, 25 → 与 25 交换
           100 87 79 25 13 77 11 11 12
i=1 (100)  孩子 87, 79 都更小，不动</code></pre>
<p><strong>100 87 79 25 13 77 11 11 12，共交换 3 次。</strong></p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 表长 11，h(k) = k mod 11，依次插入 22、33、5、16、27、4。(a) 线性探测得到的表，查找 38 比较几次？(b) 改用双重哈希，h₂(k) = (k mod 7) + 1，结果如何？</summary>
<div class="qa__body">
<p>余数：22、33 → 0；5、16、27 → 5；4 → 4；38 → 5。</p>
<pre><code class="lang-text">下标      0   1   2  3  4  5  6   7   8   9  10
(a) 线性  22  33  -  -  4  5  16  27  -  -  -
(b) 双重  22  27  -  -  4  5  33  -   16 -  -</code></pre>
<p>(a) 查 38：比较 5、16、27，8 号为空，<strong>3 次</strong>。(b) 33 步长 6 落在 6 号；16 步长 3 落在 8 号；27 步长 7，5 + 7 = 12 mod 11 = 1 号。查 38：比较 5 号的 5，步长 4 跳到 9 号空槽，<strong>1 次</strong>。表长 11 是素数，所有步长 1…7 都与它互素。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 把 2016 Q5(e) 的树改一处：去掉 10，给 17 加一个右孩子 20。现在需要什么旋转？结果是什么？</summary>
<div class="qa__body">
<p>高度：8 为 1，17 为 2，12 为 3（平衡因子 1 − 2 = −1），32 为 4（+2），7 为 5（−2）。最深的失衡结点仍是 32，它左高，但左孩子 12 <strong>右高</strong>，是 <strong>LR 情形：先在 12 处左旋，再在 32 处右旋</strong>。17 升为这棵子树的根：17 的左孩子 12（12 的左孩子 8），右孩子 32（32 的孩子 20、38）。之后 7 的平衡因子为 2 − 3 = −1，全树平衡。</p>
</div>
</details>
`;
