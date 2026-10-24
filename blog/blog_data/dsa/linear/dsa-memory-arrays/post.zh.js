/* Post body — dsa-memory-arrays / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-memory-arrays:zh'] = `
<p class="lead">C 里每个变量占内存中一段连续的字节，指针存的是这段字节的起始地址。数组把同类型的元素紧挨着排放，第 k 个元素的地址可以直接算出来，所以按下标访问是 O(1)；二维数组按行摊平成一维，用同一个思路定位。</p>

<h2>内存：按字节编号的格子</h2>
<p>课上的内存模型是随机存取存储器（Random Access Memory, RAM）：一长排格子，每格 1 字节（byte）= 8 位（bit），每格有一个地址（address），如 1000、1001、1002……。给出地址就能直接读写那一格，不用从头走过去。</p>
<p>声明 <code>int i;</code> 会占用 4 个相邻的字节，共 32 位。int 的大小由编译器和机器决定，32 位最常见，<strong>题目没说明时按 int 占 4 字节算</strong>。变量名代表这 4 个字节的起始地址。<code>i = 5;</code> 把 5 的二进制 101 写进这 32 位，其余位都是 0。设 i 占 1000–1003，再声明 <code>int j = 10;</code>，课上的图里 j 紧接着占 1004–1007，写入的是 1010（8 + 2）。</p>
<div class="callout warn" data-label="易错">
<p>分开声明的两个变量<strong>不保证相邻</strong>。i 和 j 挨着只是碰巧：如果后面的字节已被别的数据占用，j 就放到别处。只有数组的元素保证连续。</p>
</div>

<h2>指针：&amp; 取地址，* 取值</h2>
<p>指针（pointer）是一种存放<strong>内存地址</strong>的变量。配套的两个运算符：</p>
<ul>
<li><code>&amp;j</code>：取地址（address-of），得到 j 的起始地址 1004。</li>
<li><code>*p</code>：解引用（dereference），到 p 存的地址去，按 p 的类型读出一个值。p 是 <code>int *</code>，就从 1004 起读 4 个字节，得到 10。</li>
</ul>
<pre><code>int i, j;
j = 10;
int *p;          /* p: pointer to int */
p = &amp;j;          /* p holds j's address, 1004 below */
i = *p;          /* read the int stored at 1004: i = 10 */
*p = 20;         /* write through p: j becomes 20, i stays 10 */</code></pre>
<p>前五行是课上的例子，执行完 i 和 j 都是 10。第六行经由 p 写入，改的是 j；i 在第五行拿到的是一份拷贝，仍是 10。</p>

<figure class="fig">
<svg viewBox="0 0 480 196" width="480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="地址 1000 到 1007 的 8 个字节，i 占前 4 个、j 占后 4 个，值都是 10；指针 p 的值是 1004，箭头指向 j 的第一个字节">
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="65" y="30">1000</text><text x="115" y="30">1001</text><text x="165" y="30">1002</text><text x="215" y="30">1003</text>
<text x="265" y="30">1004</text><text x="315" y="30">1005</text><text x="365" y="30">1006</text><text x="415" y="30">1007</text>
</g>
<rect x="40" y="40" width="200" height="44" rx="4" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2"/>
<rect x="240" y="40" width="200" height="44" rx="4" fill="rgba(217,119,87,0.14)" stroke="#d97757" stroke-width="2"/>
<g stroke="rgba(255,255,255,0.35)" stroke-width="1.5">
<line x1="90" y1="40" x2="90" y2="48"/><line x1="90" y1="76" x2="90" y2="84"/>
<line x1="140" y1="40" x2="140" y2="48"/><line x1="140" y1="76" x2="140" y2="84"/>
<line x1="190" y1="40" x2="190" y2="48"/><line x1="190" y1="76" x2="190" y2="84"/>
<line x1="290" y1="40" x2="290" y2="48"/><line x1="290" y1="76" x2="290" y2="84"/>
<line x1="340" y1="40" x2="340" y2="48"/><line x1="340" y1="76" x2="340" y2="84"/>
<line x1="390" y1="40" x2="390" y2="48"/><line x1="390" y1="76" x2="390" y2="84"/>
</g>
<text x="140" y="67" fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">10</text>
<text x="340" y="67" fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">10</text>
<text x="140" y="104" fill="#38bdf8" font-size="13" text-anchor="middle">int i（4 字节）</text>
<text x="340" y="104" fill="#d97757" font-size="13" text-anchor="middle">int j（4 字节）</text>
<text x="40" y="132" fill="#a1a1a0" font-size="12">int *p（值是一个地址）</text>
<rect x="40" y="140" width="150" height="40" rx="6" fill="#343433" stroke="#d97757" stroke-width="2"/>
<text x="115" y="165" fill="#e8e8e8" font-size="14" text-anchor="middle">p = 1004</text>
<path d="M190,160 H250 V96" fill="none" stroke="#d97757" stroke-width="2"/>
<polygon points="250,87 244,98 256,98" fill="#d97757"/>
<text x="262" y="152" fill="#a1a1a0" font-size="12">*p：从 1004 起读 4 个字节</text>
</svg>
<figcaption>执行 p = &amp;j; i = *p; 之后：p 自己也是变量，存在别处，它的值 1004 是 j 的起始地址。</figcaption>
</figure>

<p>两个容易混的地方。<code>*</code> 在声明里（<code>int *p</code>）表示“p 是指针”，在表达式里（<code>*p</code>）表示“取 p 指向的值”。<code>int* p, q;</code> 里只有 p 是指针，q 是普通 int：星号跟着变量名走，空格放在哪里不影响含义。p 本身也占内存（64 位系统上通常 8 字节），只是它的值是地址。</p>

<h2>一维数组：连续存放，下标 O(1)</h2>
<p>数组（array）是最基本的具体数据结构，有两条性质：所有元素<strong>类型相同</strong>，并且<strong>连续存放</strong>。<code>int A[5];</code> 占用连续的 5 × 4 = 20 个字节，A[0] 是第一个，A[4] 是最后一个。设 A 从地址 2000 开始：</p>
<pre><code class="lang-text">element  A[0]  A[1]  A[2]  A[3]  A[4]
address  2000  2004  2008  2012  2016</code></pre>
<p>每个元素一样大、彼此紧挨，所以 <strong>A[k] 的地址 = 起始地址 + k × sizeof(元素类型)</strong>。A[3] 在 2000 + 3 × 4 = 2012。不管 k 和 n 多大，定位都只要一次乘法和一次加法，这就是<strong>按下标读写是 O(1)</strong> 的原因，也就是随机访问（random access）。链表做不到，要找第 k 个只能从头数（见 2.5 数组 vs 链表）。</p>

<h3>指针运算</h3>
<p>C 把 <code>A[k]</code> 定义为 <code>*(A + k)</code>。数组名 A 在表达式里代表首元素的地址 &amp;A[0]（课上说“A 是指向开头的指针”）。关键一条：<strong>指针加 k，移动的是 k 个元素，不是 k 个字节</strong>。A + 2 指向 A[2]，地址是 2008，乘 sizeof(int) 由编译器完成。同理，两个指针相减得到相隔的<strong>元素个数</strong>。</p>
<ul>
<li><code>A[2]</code> 和 <code>*(A + 2)</code> 等价，都是第三个元素。课上推荐前者，可读性好。</li>
<li><code>2[A]</code> 也合法（*(A + 2) 等于 *(2 + A)），但可读性差，不要用。</li>
<li><code>*A + 2</code> 不是 A[2]：* 先作用于 A，得到 A[0]，再加 2。</li>
<li>若 <code>int *q = A + 1;</code>，则 q[2] 就是 *(q + 2)，即 A[3]。</li>
</ul>
<div class="callout note" data-label="注意">
<p>A 不是指针变量，<code>A = q;</code>、<code>A++</code> 都编译不过；<code>sizeof(A)</code> 也是例外，得到整个数组的 20 字节。数组传给函数时只传过去首地址：参数 <code>int A[]</code> 实际上就是 <code>int *A</code>，函数里 sizeof(A) 得到的是指针大小，所以长度要另用参数 n 传入。</p>
</div>

<h2>二维数组：按行摊平</h2>
<p><code>int M[3][4];</code> 是“3 个元素的数组，每个元素又是 4 个 int 的数组”。内存只有一维，C 把它<strong>按行存放（row-major）</strong>：先放第 0 行的 4 个 int，紧接着第 1 行，再第 2 行，12 个 int 共 48 字节连成一块。令 M[r][c] = 10r + c：</p>

<figure class="fig">
<svg viewBox="0 0 460 236" width="460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="3 行 4 列的二维数组 M 按行摊平成 12 个连续的 int，M[2][1] 在第 9 个位置，字节偏移 36">
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="90" y="26">c=0</text><text x="130" y="26">c=1</text><text x="170" y="26">c=2</text><text x="210" y="26">c=3</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="end">
<text x="62" y="54">r=0</text><text x="62" y="84">r=1</text><text x="62" y="114">r=2</text>
</g>
<g fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5">
<rect x="70" y="34" width="40" height="30"/><rect x="110" y="34" width="40" height="30"/><rect x="150" y="34" width="40" height="30"/><rect x="190" y="34" width="40" height="30"/>
</g>
<g fill="rgba(74,222,128,0.15)" stroke="#4ade80" stroke-width="1.5">
<rect x="70" y="64" width="40" height="30"/><rect x="110" y="64" width="40" height="30"/><rect x="150" y="64" width="40" height="30"/><rect x="190" y="64" width="40" height="30"/>
</g>
<g fill="rgba(251,191,36,0.15)" stroke="#fbbf24" stroke-width="1.5">
<rect x="70" y="94" width="40" height="30"/><rect x="150" y="94" width="40" height="30"/><rect x="190" y="94" width="40" height="30"/>
</g>
<rect x="110" y="94" width="40" height="30" fill="#d97757" stroke="#d97757" stroke-width="1.5"/>
<g fill="#e8e8e8" font-size="13" text-anchor="middle">
<text x="90" y="54">0</text><text x="130" y="54">1</text><text x="170" y="54">2</text><text x="210" y="54">3</text>
<text x="90" y="84">10</text><text x="130" y="84">11</text><text x="170" y="84">12</text><text x="210" y="84">13</text>
<text x="90" y="114">20</text><text x="170" y="114">22</text><text x="210" y="114">23</text>
</g>
<text x="130" y="114" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">21</text>
<g font-size="13">
<text x="252" y="60" fill="#e8e8e8">M[2][1] = 21</text>
<text x="252" y="84" fill="#e8e8e8">偏移 = (2×4+1)×4</text>
<text x="252" y="108" fill="#d97757" font-weight="700">= 36 字节</text>
</g>
<text x="230" y="146" fill="#a1a1a0" font-size="12" text-anchor="middle">内存里按行连续存放</text>
<g font-size="12" text-anchor="middle">
<text x="86" y="162" fill="#38bdf8">M[0]</text><text x="230" y="162" fill="#4ade80">M[1]</text><text x="374" y="162" fill="#fbbf24">M[2]</text>
</g>
<g fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5">
<rect x="14" y="168" width="36" height="34"/><rect x="50" y="168" width="36" height="34"/><rect x="86" y="168" width="36" height="34"/><rect x="122" y="168" width="36" height="34"/>
</g>
<g fill="rgba(74,222,128,0.15)" stroke="#4ade80" stroke-width="1.5">
<rect x="158" y="168" width="36" height="34"/><rect x="194" y="168" width="36" height="34"/><rect x="230" y="168" width="36" height="34"/><rect x="266" y="168" width="36" height="34"/>
</g>
<g fill="rgba(251,191,36,0.15)" stroke="#fbbf24" stroke-width="1.5">
<rect x="302" y="168" width="36" height="34"/><rect x="374" y="168" width="36" height="34"/><rect x="410" y="168" width="36" height="34"/>
</g>
<rect x="338" y="168" width="36" height="34" fill="#d97757" stroke="#d97757" stroke-width="1.5"/>
<g fill="#e8e8e8" font-size="13" text-anchor="middle">
<text x="32" y="190">0</text><text x="68" y="190">1</text><text x="104" y="190">2</text><text x="140" y="190">3</text>
<text x="176" y="190">10</text><text x="212" y="190">11</text><text x="248" y="190">12</text><text x="284" y="190">13</text>
<text x="320" y="190">20</text><text x="392" y="190">22</text><text x="428" y="190">23</text>
</g>
<text x="356" y="190" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">21</text>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="32" y="222">0</text><text x="68" y="222">4</text><text x="104" y="222">8</text><text x="140" y="222">12</text>
<text x="176" y="222">16</text><text x="212" y="222">20</text><text x="248" y="222">24</text><text x="284" y="222">28</text>
<text x="320" y="222">32</text><text x="392" y="222">40</text><text x="428" y="222">44</text>
</g>
<text x="356" y="222" fill="#d97757" font-size="12" font-weight="700" text-anchor="middle">36</text>
</svg>
<figcaption>上：按行列看的 M[3][4]。下：它在内存里的真实排列，格子下方是相对 M 起点的字节偏移。</figcaption>
</figure>

<p>要到 M[r][c]，先跳过前面 r 整行（每行 COLS 个元素），再跳过本行的前 c 个：</p>
<pre><code class="lang-text">byte offset of M[r][c] = (r × COLS + c) × sizeof(int)</code></pre>
<p>M[2][1] 的偏移是 (2 × 4 + 1) × 4 = 36 字节，即摊平后的第 9 个 int（从 0 数）。课上给了三种等价写法：</p>
<ul>
<li><code>M[r][c]</code>：最直接，推荐。</li>
<li><code>*(*(M + r) + c)</code>：M 的元素是“行”，所以 <strong>M + r 每加 1 跳过一整行</strong>（这里 16 字节）；*(M + r) 就是第 r 行这个一维数组，在表达式里又变成该行首元素的地址；再 + c 跳过 c 个 int，最后 * 取值。</li>
<li>手算字节地址：M 的起始地址加上 (r × COLS + c) × sizeof(int) 个字节。</li>
</ul>
<p>公式用到列数 COLS，用不到行数。所以二维数组作函数参数时<strong>列数必须写明</strong>，如 <code>void show(int M[][4], int rows)</code>。</p>

<h3>int *A[10] 不是二维数组</h3>
<p>课上对比过三个声明：</p>
<pre><code>int  A[5][10];   /* 2D array: 5 rows of 10 ints, 200 contiguous bytes */
int *B[10];      /* array of 10 pointers to int */
int* C[10];      /* same type as B: the space changes nothing */</code></pre>
<p><code>[]</code> 比 <code>*</code> 结合得更紧，<code>int *B[10]</code> 读作“B 是 10 个元素的数组，元素类型是 int *”。每个 B[k] 可以指向任意位置的一段 int，各段互不相连、长度也可以不同。B[k][c] 照样能写（等于 *(B[k] + c)），但上面的偏移公式对 B 不成立。</p>

<h2>用程序核对</h2>
<p>下面把一维、二维数组的结论逐条打印出来。真实地址每次运行都不同，所以只打印相对起点的字节差。</p>
<pre><code>#include &lt;stdio.h&gt;

#define ROWS 3
#define COLS 4

/* how many bytes address b lies after address a */
int bytes_after(const void *a, const void *b) {
    return (int)((const char *)b - (const char *)a);
}

int main(void) {
    /* 1D array: A[k] is k * sizeof(int) bytes after A[0] */
    int A[5] = {10, 20, 30, 40, 50};
    printf("sizeof(A) = %zu\\n", sizeof(A));
    printf("A[2] = %d, *(A + 2) = %d\\n", A[2], *(A + 2));
    printf("&amp;A[3] is %d bytes after A\\n", bytes_after(A, &amp;A[3]));
    int *q = A + 1;             /* q points to A[1] */
    printf("q[2] = %d, *q + 2 = %d\\n", q[2], *q + 2);

    /* 2D array: stored row by row */
    int M[ROWS][COLS];
    for (int r = 0; r &lt; ROWS; r++) {
        for (int c = 0; c &lt; COLS; c++) {
            M[r][c] = 10 * r + c;
        }
    }
    int r = 2, c = 1;
    int v1 = M[r][c];
    int v2 = *(*(M + r) + c);
    int v3 = *(int *)((char *)M + (r * COLS + c) * sizeof(int));
    printf("v1 = %d, v2 = %d, v3 = %d\\n", v1, v2, v3);
    printf("&amp;M[2][1] is %d bytes after M\\n", bytes_after(M, &amp;M[r][c]));
    printf("M + 1 is %d bytes after M\\n", bytes_after(M, M + 1));

    /* int *P[10]: ten pointers, not a 2D array */
    int *P[10];
    printf("P: %zu elements, %zu bytes each\\n",
           sizeof(P) / sizeof(P[0]), sizeof(P[0]));
    return 0;
}</code></pre>
<p>在 64 位 Linux 上用 gcc 编译运行：</p>
<pre><code class="lang-text">sizeof(A) = 20
A[2] = 30, *(A + 2) = 30
&amp;A[3] is 12 bytes after A
q[2] = 40, *q + 2 = 22
v1 = 21, v2 = 21, v3 = 21
&amp;M[2][1] is 36 bytes after M
M + 1 is 16 bytes after M
P: 10 elements, 8 bytes each</code></pre>
<p>v3 那行先把 M 转成 <code>char *</code>，因为 char 占 1 字节，加的数才按字节计；如果直接对 <code>int *</code> 加 36，会跳过 36 个 int。P 的每个元素是 8 字节的指针，不是 int。</p>

<h2>数组操作的代价</h2>
<table>
<thead><tr><th>操作</th><th>无序数组</th><th>有序数组</th></tr></thead>
<tbody>
<tr><td>按下标读写 A[k]</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>按值查找</td><td>O(n)：线性查找（linear search），最坏（不存在或在最后）比 n 次</td><td>O(log n)：二分查找（binary search），见 2.3</td></tr>
<tr><td>由 n 个元素建立</td><td>O(n)：逐个追加到末尾</td><td>逐个插入 O(n²)；全部放入后排序一次 O(n log n)</td></tr>
</tbody>
</table>
<p>选哪种看用法：<strong>要频繁查找就建有序数组</strong>，多付的建立代价由每次查找省下的时间补回；<strong>只查一两次就用无序数组</strong>。</p>
<div class="callout warn" data-label="易错">
<p>课上把逐个插入建有序数组说成 O(n log n)，那只数了二分查找定位的比较。插到中间还要把后面的元素逐个右移，每次最坏 O(n)，n 次合计 <strong>O(n²)</strong>（推导见 2.3）。题目说“逐个插入”时答 O(n²)。</p>
</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>读代码写输出</strong>：几行带指针运算的代码，问打印什么。要点：A[k] ≡ *(A + k)；p + k 移动 k 个元素；p − q 是元素个数；*p + 1 和 *(p + 1) 不同；经由指针写入，改的是被指向的变量。</li>
<li><strong>算地址</strong>：给起始地址和 sizeof，求 A[k] 或 M[r][c] 的地址，或反过来问某个地址上是哪个元素。base + k × size 和 base + (r × COLS + c) × size 要背，公式表上没有。</li>
<li><strong>选择题</strong>：数组为什么能 O(1) 按下标访问（同类型、连续）；int A[1000] 占多少字节；分开声明的变量是否相邻；int *A[10] 是不是二维数组；有序、无序数组各操作的代价。第 2 周的课堂竞赛就有一题：声明了 1000 个元素的数组，选出正确的说法（类似练习 3）。</li>
<li><strong>写代码</strong>：函数要同时接收数组和长度；二维数组参数要写列数。2015 年期末的改错题是指针数组里所有指针都指向同一块缓冲区（见练习 4）。</li>
<li>陷阱：二维数组的 M + 1 跳一整行；对 int * 做加法不用再乘 4；逐个插入建有序数组是 O(n²)。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 写出下面代码的输出。</summary>
<div class="qa__body">
<pre><code>int A[6] = {3, 1, 4, 1, 5, 9};
int *p = A + 2;
int *s = &amp;A[5];
printf("%d %d %d\\n", *p, p[1], *(p - 2));
*(p + 1) = *p + *(A + 4);
p++;
printf("%d %d %d\\n", *p, (int)(s - p), A[3]);</code></pre>
<pre><code class="lang-text">4 1 3
9 2 9</code></pre>
<p>p = A + 2 指向 A[2]。第一行输出：*p = A[2] = 4；p[1] = *(p + 1) = A[3] = 1；*(p − 2) = A[0] = 3。</p>
<p>代码第 5 行：*(p + 1) 就是 A[3]，赋值为 *p + *(A + 4) = A[2] + A[4] = 4 + 5 = 9。第 6 行 p++ 后 p 指向 A[3]。</p>
<p>第二行输出：*p = A[3] = 9；s 指向 A[5]，s − p = 5 − 3 = <strong>2</strong>，是相隔的元素个数，不是 8 个字节；A[3] 已改成 9。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. int M[4][6]; 从地址 1000 开始存放，int 占 4 字节。(a) &amp;M[2][3] 是多少？(b) M + 2 和 *(M + 2) + 3 各是哪个地址？(c) 地址 1084 上是哪个元素？(d) sizeof(M) 和 sizeof(M[0]) 各是多少？</summary>
<div class="qa__body">
<p>(a) 每行 6 个 int。偏移 (2 × 6 + 3) × 4 = 60，地址 <strong>1060</strong>。</p>
<p>(b) M 的元素是行，一行 6 × 4 = 24 字节，M + 2 跳过 2 行：1000 + 48 = <strong>1048</strong>。*(M + 2) 是第 2 行，代表该行首元素的地址 1048，再 + 3 跳过 3 个 int：1048 + 12 = <strong>1060</strong>，与 (a) 是同一个元素。</p>
<p>(c) (1084 − 1000) / 4 = 21，即摊平后的第 21 个 int（从 0 数）。21 = 3 × 6 + 3，所以是 <strong>M[3][3]</strong>。</p>
<p>(d) sizeof(M) = 4 × 6 × 4 = <strong>96</strong>；M[0] 是一整行，sizeof(M[0]) = 6 × 4 = <strong>24</strong>。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 声明 int A[1000];，int 占 4 字节，A 中的值未排序。哪些说法正确？(A) A 占用 4000 个连续字节；(B) 读 A[999] 比读 A[0] 慢，因为要先经过前面的元素；(C) *(A + 4) 读到的是 A[1]，因为一个 int 占 4 字节；(D) 查找一个不在 A 中的值，线性查找要比较 1000 次；(E) 和分开声明的 1000 个 int 变量一样，A 的元素在内存中不一定连续；(F) int *B[1000]; 声明的也是能存 1000 个整数的数组。</summary>
<div class="qa__body">
<p><strong>A、D 正确。</strong></p>
<p>A：1000 × 4 = 4000，数组保证连续。D：值不存在时线性查找无法提前停，1000 个元素都要比。</p>
<p>B 错：A[999] 的地址由起始地址 + 999 × 4 直接算出，和 A[0] 一样是 O(1)。C 错：指针加 4 移动 4 个元素，*(A + 4) 就是 A[4]；按字节偏移 4 才到 A[1]。E 错：数组元素保证连续，这正是 O(1) 下标访问的前提，“不保证相邻”说的是分开声明的变量。F 错：B 是 1000 个 int 指针（64 位系统上共 8000 字节），这些指针还没有指向任何 int。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 下面的代码想让 P[0]、P[1]、P[2] 分别指向 10、20、30。实际输出什么？错在哪里，怎么改？</summary>
<div class="qa__body">
<pre><code>int *P[3];
int x;
for (int k = 0; k &lt; 3; k++) {
    x = 10 * (k + 1);
    P[k] = &amp;x;
}
printf("%d %d %d\\n", *P[0], *P[1], *P[2]);</code></pre>
<p>输出 <code>30 30 30</code>。P 是 3 个 int 指针组成的数组，三次循环存进去的都是同一个地址 &amp;x。x 只有一份，每次赋值都覆盖上一次，循环结束时是 30，三个指针读到的都是它。</p>
<p>改法：给每个值一块自己的存储，让指针分别指过去：</p>
<pre><code>int vals[3];
for (int k = 0; k &lt; 3; k++) {
    vals[k] = 10 * (k + 1);
    P[k] = &amp;vals[k];
}</code></pre>
<p>再打印就是 <code>10 20 30</code>。2015 年期末的改错题是同一个错误的字符串版：每读一行都写进同一个 buffer，再把 buffer 的地址存进 char * 数组，最后打印出来每一行都是最后读入的那行。修正方法是每读一行就 malloc 一块 strlen + 1 字节的新空间，用 strcpy 复制过去，再存这块新空间的地址。</p>
</div>
</details>
`;
