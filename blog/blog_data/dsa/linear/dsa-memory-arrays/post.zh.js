/* Post body — dsa-memory-arrays / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-memory-arrays:zh'] = `
<p class="lead">变量在内存里放在哪、指针怎么凭地址找到变量、数组为什么能用下标一步跳到第 k 个元素，以及二维数组在内存里怎么排。</p>

<h2>从一个场景说起</h2>
<p>想象一栋宿舍楼里有一条很长的走廊，房间从 1000 号起依次编号。快递员只要知道门牌号，就能直接走到那扇门前，不用从走廊头一间间敲门。</p>
<p>你想让朋友去你房间拿东西，不用把东西搬给他，写张纸条“1004 号”递过去就行。纸条上写的不是东西本身，而是<strong>东西在哪儿</strong>。</p>
<p>再比如一个旅行团订了 5 间连在一起、一样大的房间。只要知道第一间的门牌号，第几位团员住哪间，心算一下就知道。</p>
<p>C 的内存就是这条走廊，纸条就是指针，连着订的那几间房就是数组。</p>

<h2>它是什么</h2>
<h3>内存：按字节编号的格子</h3>
<p>课上的内存模型叫随机存取存储器（Random Access Memory, RAM）：一长排格子，每格 1 字节（byte）= 8 位（bit），每格有一个编号，叫地址（address）。给出地址就能直接读写那一格，就像凭门牌号直达房间。</p>
<p>一个 int 占 4 个相邻的字节（32 位）。int 多大其实由编译器和机器决定，但<strong>题目没说明时按 4 字节算</strong>。变量名代表它那几个字节的起始地址。</p>
<div class="callout warn" data-label="易错">
<p>分开声明的两个变量<strong>不保证相邻</strong>。它们可能挨着，也可能隔得很远，要看当时哪里有空位。只有数组的元素保证连续。</p>
</div>

<h3>指针：写着地址的纸条</h3>
<p>简单说，指针（pointer）就是一个<strong>存放内存地址</strong>的变量。配套的两个运算符：</p>
<ul>
<li><code>&amp;x</code>：取地址（address-of），相当于问“x 住几号”。</li>
<li><code>*p</code>：解引用（dereference），照着 p 里的地址找过去，按 p 的类型读出一个值。p 是 <code>int *</code>，就从那个地址起读 4 个字节。</li>
</ul>
<p>指针自己也是变量，也占内存（64 位系统上通常 8 字节），只是它装的是地址。</p>

<h3>数组：连在一起的一排房间</h3>
<p>数组（array）是最基本的具体数据结构，有两条性质：所有元素<strong>类型相同</strong>（所以每个一样大），并且<strong>连续存放</strong>（中间没有空隙）。有了这两条，第 k 个元素在哪就能直接算出来：</p>
<pre><code class="lang-text">address of A[k] = start address + k × sizeof(element type)</code></pre>
<p>一次乘法、一次加法就到，跟 k 多大、数组多长都没关系。这就是<strong>按下标读写是 O(1)</strong> 的原因，叫随机访问（random access）。链表做不到，要找第 k 个只能从头数（见 2.5 数组 vs 链表）。</p>

<h2>看个例子</h2>
<h3>课上的指针代码</h3>
<pre><code>int i, j;
j = 10;
int *p;          /* p: pointer to int */
p = &amp;j;          /* p holds j's address */
i = *p;          /* read the int at that address */
*p = 20;         /* write through p */</code></pre>
<p>前五行是课上的例子，第六行是加来对比的。一行一行看：</p>
<ol>
<li><code>int i, j;</code>：各占 4 字节。设 i 在 1000–1003，j 在 1004–1007（课上的图画成相邻，只是碰巧）。</li>
<li><code>j = 10;</code>：往 j 的 32 位里写 10，二进制是 1010（8 + 2），其余位都是 0。</li>
<li><code>int *p;</code>：声明一个指针。这里的 * 表示“p 是指针”，不是取值。</li>
<li><code>p = &amp;j;</code>：&amp;j 是 j 的起始地址 1004，存进 p。纸条上写好了“1004”。</li>
<li><code>i = *p;</code>：到 1004 起读 4 个字节，得到 10，复制一份给 i。现在 i 和 j 都是 10。</li>
<li><code>*p = 20;</code>：照着地址写进去，改的是 j，j 变成 20。i 在上一步拿到的只是拷贝，仍是 10。</li>
</ol>

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
<figcaption>执行完第 5 行时的内存：p 自己也存在别处，它的值 1004 是 j 的起始地址。</figcaption>
</figure>

<p>同一个 * 有两种意思：在声明里（<code>int *p</code>）表示“p 是指针”，在表达式里（<code>*p</code>）表示“取 p 指向的值”。</p>

<h3>一维数组：算地址</h3>
<p><code>int A[5];</code> 占连续的 5 × 4 = 20 字节。设 A 从地址 2000 开始：</p>
<pre><code class="lang-text">element  A[0]  A[1]  A[2]  A[3]  A[4]
address  2000  2004  2008  2012  2016</code></pre>
<p>A[3] 在 2000 + 3 × 4 = 2012，一步算到，不用经过 A[0] 到 A[2]。</p>
<p>其实 C 里 <code>A[k]</code> 的定义就是 <code>*(A + k)</code>。数组名 A 在表达式里代表首元素的地址 &amp;A[0]（课上说“A 是指向开头的指针”）。关键的一条：<strong>指针加 k，走的是 k 个元素，不是 k 个字节</strong>。A + 2 指向 A[2]，地址 2008，乘 4 这一步编译器替你做了。同理，两个指针相减得到的是相隔的<strong>元素个数</strong>。</p>
<ul>
<li><code>A[2]</code> 和 <code>*(A + 2)</code> 等价，课上推荐前者，好读。</li>
<li><code>*A + 2</code> 不是 A[2]：* 先作用于 A 得到 A[0]，再加 2。</li>
<li>若 <code>int *q = A + 1;</code>，q[2] 就是 *(q + 2)，即 A[3]。</li>
</ul>
<div class="callout note" data-label="注意">
<p>A 不是指针变量，<code>A = q;</code>、<code>A++</code> 都编译不过；<code>sizeof(A)</code> 是整个数组的 20 字节。数组传给函数时只传首地址：参数 <code>int A[]</code> 实际就是 <code>int *A</code>，所以长度要另用参数 n 传入。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/ASVB8KAFypk" title="Pointers and arrays" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Pointers and arrays》（英文），用具体地址演示 A[i] 与 *(A + i)、&amp;A[i] 与 A + i 的等价，以及指针加 1 为什么跳过一整个 int。</p>

<h2>二维数组：按行摊平</h2>
<p>电影院的座位有排有列，可内存只有一条走廊。C 的办法是把座位一排接一排地排成一行：先放第 0 排，紧接着第 1 排，再第 2 排。这叫按行存放（row-major）。</p>
<p><code>int M[3][4];</code> 是 3 行、每行 4 个 int，一共 12 个 int、48 字节连成一块。令 M[r][c] = 10r + c：</p>

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

<p>要找 M[r][c]，先跳过前面 r 整行（每行 COLS 个元素），再跳过本行的前 c 个：</p>
<pre><code class="lang-text">byte offset of M[r][c] = (r × COLS + c) × sizeof(int)</code></pre>
<p>拿 M[2][1] 走一遍：跳过 2 行是 2 × 4 = 8 个 int，再跳 1 个，共 9 个 int，偏移 9 × 4 = 36 字节，和图里对得上。</p>
<p>课上给了三种等价写法：</p>
<ul>
<li><code>M[r][c]</code>：最直接，推荐。</li>
<li><code>*(*(M + r) + c)</code>：M 的元素是“行”，所以 <strong>M + r 每加 1 跳过一整行</strong>（这里 16 字节）；*(M + r) 就是第 r 行，在表达式里又变成该行首元素的地址；再 + c 跳过 c 个 int；最外层的 * 取值。</li>
<li>手算：M 的起始地址加上 (r × COLS + c) × sizeof(int) 个字节。</li>
</ul>
<p>公式里用到列数 COLS，用不到行数。所以二维数组当函数参数时<strong>列数必须写明</strong>，如 <code>void show(int M[][4], int rows)</code>。</p>

<h3>int *A[10] 不是二维数组</h3>
<pre><code>int  A[5][10];   /* 2D array: 5 rows of 10 ints, 200 contiguous bytes */
int *B[10];      /* array of 10 pointers to int */
int* C[10];      /* same type as B: the space changes nothing */</code></pre>
<p><code>[]</code> 比 <code>*</code> 结合得更紧，所以 <code>int *B[10]</code> 读作“B 是 10 个元素的数组，每个元素是 int *”。它就像 10 张纸条，每张可以指向内存里任意一段 int，各段不相连、长度也可以不同。B[k][c] 照样能写（等于 *(B[k] + c)），但上面的偏移公式对 B 不成立。</p>

<h2>数组操作的代价</h2>
<table>
<thead><tr><th>操作</th><th>无序数组</th><th>有序数组</th></tr></thead>
<tbody>
<tr><td>按下标读写 A[k]</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>按值查找</td><td>O(n)：线性查找（linear search），最坏（不存在或在最后）比 n 次</td><td>O(log n)：二分查找（binary search），见 2.3</td></tr>
<tr><td>由 n 个元素建立</td><td>O(n)：逐个追加到末尾</td><td>逐个插入 O(n²)；全部放入后排序一次 O(n log n)</td></tr>
</tbody>
</table>
<p>怎么选看用法：<strong>要频繁查找就建有序数组</strong>，多付的建立代价靠每次查找省回来；<strong>只查一两次就用无序数组</strong>。</p>
<div class="callout warn" data-label="易错">
<p>课上把逐个插入建有序数组说成 O(n log n)，那只数了二分查找定位的比较。插到中间还要把后面的元素逐个右移，每次最坏 O(n)，n 次合计 <strong>O(n²)</strong>（见 2.3）。</p>
</div>

<h2>考试怎么考</h2>
<p>这部分常见四种问法：</p>
<ul>
<li><strong>读代码写输出</strong>：几行带指针运算的代码，问打印什么。</li>
<li><strong>算地址</strong>：给起始地址和 sizeof，求 A[k] 或 M[r][c] 的地址，或反过来问某个地址上是哪个元素。两条地址公式要背，<strong>公式表上没有</strong>。</li>
<li><strong>选择题</strong>：数组为什么能 O(1) 按下标访问（同类型、连续）；int A[1000] 占多少字节；分开声明的变量是否相邻；int *A[10] 是不是二维数组；各操作的代价。</li>
<li><strong>写代码</strong>：函数要同时接收数组和长度；二维数组参数要写列数。</li>
</ul>

<h3>例题 1：读代码写输出</h3>
<pre><code>int A[6] = {3, 1, 4, 1, 5, 9};
int *p = A + 2;
int *s = &amp;A[5];
printf("%d %d %d\\n", *p, p[1], *(p - 2));
*(p + 1) = *p + *(A + 4);
p++;
printf("%d %d %d\\n", *p, (int)(s - p), A[3]);</code></pre>
<p>输出：</p>
<pre><code class="lang-text">4 1 3
9 2 9</code></pre>
<p>第 2 行：p = A + 2，指向 A[2]。第 3 行：s 指向 A[5]。</p>
<p>第 4 行打印三个值：*p 就是 A[2] = 4；p[1] 就是 *(p + 1)，即 A[3] = 1；*(p − 2) 往回走两个元素，是 A[0] = 3。</p>
<p>第 5 行：*(p + 1) 是 A[3]，被赋值为 *p + *(A + 4) = A[2] + A[4] = 4 + 5 = 9。第 6 行 p++，p 往后挪一个元素，指向 A[3]。</p>
<p>第 7 行：*p 是 A[3]，刚改成 9；s − p 是 A[5] 和 A[3] 相隔的元素个数 <strong>2</strong>，不是 8 个字节；A[3] 还是 9。</p>

<h3>例题 2：算二维数组的地址</h3>
<p><code>int M[4][6];</code> 从地址 1000 开始存放，int 占 4 字节。求：(a) &amp;M[2][3]；(b) M + 2 和 *(M + 2) + 3 各是哪个地址；(c) 地址 1084 上是哪个元素；(d) sizeof(M) 和 sizeof(M[0])。</p>
<p>(a) 每行 6 个 int。偏移 (2 × 6 + 3) × 4 = 60，地址 <strong>1060</strong>。</p>
<p>(b) M 的元素是行，一行 6 × 4 = 24 字节，M + 2 跳过 2 行：1000 + 48 = <strong>1048</strong>。*(M + 2) 是第 2 行，代表该行首元素的地址 1048，再 + 3 跳过 3 个 int：1048 + 12 = <strong>1060</strong>，和 (a) 是同一个元素。</p>
<p>(c) 反过来算：(1084 − 1000) / 4 = 21，即摊平后的第 21 个 int（从 0 数）。21 = 3 × 6 + 3，所以是 <strong>M[3][3]</strong>。</p>
<p>(d) sizeof(M) = 4 × 6 × 4 = <strong>96</strong>；M[0] 是一整行，sizeof(M[0]) = 6 × 4 = <strong>24</strong>。</p>

<h3>常见的坑</h3>
<ul>
<li>对 <code>int *</code> 做加法不用再乘 4：*(A + 4) 是 A[4]，不是 A[1]。</li>
<li><code>*p + 1</code> 和 <code>*(p + 1)</code> 不一样：前者是“p 指的值加 1”，后者是“下一个元素”。</li>
<li>二维数组的 M + 1 跳过一整行，不是一个 int。</li>
<li><code>int* p, q;</code> 里只有 p 是指针，q 是普通 int：星号跟着变量名走。</li>
<li>指针数组里的指针全存了同一个 buffer 的地址，打印出来就全是最后写进去的那份。2015 年期末的改错题就是这个错（每读一行都写进同一个 buffer，再把 buffer 地址存进 char * 数组）。改法：每读一行就 malloc 一块 strlen + 1 字节的新空间，strcpy 过去，存新空间的地址。</li>
<li>逐个插入建有序数组是 O(n²)，不是 O(n log n)。</li>
</ul>

<h2>小结</h2>
<ul>
<li>内存是按字节编号的格子，int 默认按 4 字节算；分开声明的变量不保证相邻。</li>
<li>指针存地址：<code>&amp;x</code> 取地址，<code>*p</code> 按地址取值；经由指针写入，改的是被指向的变量。</li>
<li>数组同类型、连续存放，A[k] 的地址 = 起始地址 + k × sizeof，所以下标访问 O(1)。</li>
<li>A[k] ≡ *(A + k)；指针加 k 走 k 个元素，指针相减得元素个数。</li>
<li>二维数组按行存放，偏移 = (r × COLS + c) × sizeof；M + 1 跳一整行，函数参数要写列数。</li>
<li>int *A[10] 是 10 个指针，不是二维数组。</li>
</ul>
`;
