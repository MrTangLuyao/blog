/* Post body — dsa-past-papers / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-past-papers:zh'] = `
<p class="lead">2015、2016 两年期末卷共 11 道大题，按考点分成七组逐题讲解：C 编程、复杂度填空、堆、哈希、树的旋转、图算法、排序。官方参考解答有几处是错的，主要在素数判断、快速排序的额外空间、Prim 配平衡 BST 的复杂度，以及有向图上的最小 fatness 路径。</p>

<h2>旧卷和今年的考试差在哪</h2>
<p>两份旧卷都是 3 小时纸笔考试，满分 60 分，答案全写在答题本上。2026 年也是 3 小时，但改成机考（Lockdown Browser），满分 45 分：前面约 15–20 道自动判分题（单选、多选、配对、填空），后面 3–4 道长题（读代码、写代码、算法设计）。</p>
<p>所以做旧卷时要换个角度看：</p>
<ul>
<li>旧卷里“算出一个结果”的小题，比如复杂度填空、建堆、哈希填表、旋转、拓扑序、pivot 序列，今年会变成<strong>自动判分题</strong>。机器只看最后的答案，没有地方写“我假设下标从 0 开始”，过程对、结果错也不得分。所以一律按课上的约定算。</li>
<li>旧卷的 C 编程题和“设计一个算法”题（最小 fatness 路径、让 Prim 处理非连通图），对应今年的<strong>长题</strong>。课上说 2016 卷读代码题的风格和今年接近；写代码和算法设计题今年可能不一样，最接近的是第 11 周 workshop 第 6 题。</li>
</ul>
<div class="callout note" data-label="不考">
<p>下面几小题不在今年的大纲里，直接跳过：</p>
<ul>
<li>2015 Q5(b)：三道 A* 搜索的判断题。</li>
<li>2016 Q3(a)：并查集（disjoint sets / union-find）森林的合并与查找。</li>
<li>2016 Q4(a) 里 Kruskal 的部分：只在 workshop 讲过，明确不考。</li>
<li>2016 Q4(b)(iii)：A* 是否总能找到最短路。</li>
<li>2016 Q4(b)(iv)：用归约证明 P = NP。P 与 NP 不考。</li>
</ul>
</div>

<h2>C 编程题</h2>
<p>旧卷的评分标准写明 C 题看这几项：正确、完整、高效、规范使用 C、可读（有注释）。“规范使用 C”具体指：检查 malloc 的返回值、用完 free、给字符函数传 <code>unsigned char</code>、判素数不用浮点。下面三题都会碰到。</p>

<h3>2015 Q1（13 分）判断回文句</h3>
<p><strong>题目：</strong>写 <code>int checkpalindrome(char *buffer)</code>。buffer 是用 <code>fgets</code> 读进来的一行，末尾带着 <code>'\\n'</code>。去掉空格、数字、标点，再不分大小写，如果正着读和反着读一样（如 “A man, a plan, a canal, Panama!”），它就是回文句（palindrome），返回 TRUE，否则返回 FALSE。</p>
<p><strong>思路：</strong>想象两个人分别站在句子的头和尾，往中间走。谁脚下不是字母，谁就往前跨一步；两人脚下都是字母时，把两个字母都转成小写比一比。只要有一对不同，就不是回文；两人碰头了还没发现不同，就是回文。这样不用另外复制一份“只剩字母”的字符串，每个字符只看一次，时间 O(n)，额外空间 O(1)。</p>
<pre><code>int checkpalindrome(char *buffer)
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
<ul>
<li><code>i</code> 从第一个字符出发，<code>j</code> 从最后一个字符出发。最后一个字符就是 <code>'\\n'</code>，它不是字母，第一轮就被跳过，所以不用专门去删换行。</li>
<li>前两个分支只挪一边。过滤用 <code>isalpha</code>（是不是字母），不能用 <code>isalnum</code>（字母或数字），因为题目要求忽略数字。</li>
<li>第三个分支：两边都是字母，用 <code>tolower</code> 转小写再比，这样 A 和 a 算相同。不同就立刻返回 FALSE，后面不用再看。</li>
<li>最后一个分支：这一对对上了，两边各往中间走一步。循环到 <code>i &lt; j</code> 不成立（两人碰头）还没返回，说明每一对都对上了。</li>
<li>为什么要写 <code>(unsigned char)</code>：<code>char</code> 在很多机器上带符号，遇到非 ASCII 字符会是负数，负数传给 <code>isalpha</code>、<code>tolower</code> 是未定义行为（undefined behaviour）。</li>
</ul>
<p>拿几个例子试：civic、rotator、Ab2c2bA、a Toyota、Drab as a fool, aloof as a bard! 都返回 TRUE；hello、ab 返回 FALSE。一个字母都没有的行（比如空行）直接返回 TRUE。</p>
<p>只拿部分分的写法是“单词版”：去掉换行后直接比 <code>buffer[i] == buffer[j]</code>，不跳过非字母、不管大小写。它认得出 civic，但认不出带空格和标点的句子。</p>

<h3>2015 Q2（5 分）找错：三行都变成了 leaves</h3>
<p><strong>题目：</strong>一个程序用 <code>fgets</code> 把每一行读进局部数组 <code>char buffer[200]</code>，去掉换行后执行 <code>B[strings] = buffer; strings++;</code>。B 是 malloc 出来的 <code>char **</code>，满了就 realloc 成两倍。最后先打印读了几行，再逐行打印字符串和它的长度。(a) 输入 giraffes、eat、leaves 三行，输出什么？(b) 错在哪？(c) 怎么改？</p>
<p><strong>(a)</strong> 输出是（每行前面和中间是制表符）：</p>
<pre><code class="lang-text">Read 3 strings:
    leaves    6
    leaves    6
    leaves    6</code></pre>
<p>官方答案只写了三遍 leaves，完整的输出还有第一行的计数和每行的长度 6。</p>
<p><strong>(b)</strong> 为什么三行全是 leaves？因为 <code>B[strings] = buffer</code> 复制的是<strong>地址</strong>，不是字符串。打个比方：buffer 是一个储物柜，B[0]、B[1]、B[2] 是三张便利贴，上面写的都是这同一个柜子的号码。每读一行，柜子里的东西就被换掉一次，最后只剩 leaves，三张便利贴自然都指向 leaves。</p>
<p><strong>(c)</strong> 让每一行都有自己的柜子：按这一行的长度 malloc 一块新内存，把内容 strcpy 进去；程序结束前全部 free 掉。</p>
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
<ul>
<li><code>strlen(buffer) + 1</code>：strlen 不算结尾的 <code>'\\0'</code>，少了这 1 个字节，strcpy 就会写出界。</li>
<li>检查 NULL：malloc 可能失败，评分标准要求检查。</li>
<li><code>strcpy</code>：把字符串的内容抄进新内存。之后 buffer 再被覆盖，也影响不到这一份。</li>
<li>先 free 每一行，再 free B：如果先 free(B)，就再也拿不到各行的地址，那些内存就泄漏（leak）了。</li>
</ul>
<p>改完后输出 giraffes 8、eat 3、leaves 6。还有两个小毛病可以顺手指出：realloc 的返回值应该先存进临时变量，确认不是 NULL 再赋给 B，否则失败时原来那块内存的地址就丢了；最后一行如果没有换行符，<code>buffer[strlen(buffer)-1] = '\\0'</code> 会删掉一个真字母。</p>

<h3>2016 Q1（18 分）素数子数组的最大和</h3>
<p><strong>题目：</strong>给一个整数数组，取其中一段连续的子数组，只把这段里的素数加起来（负数按绝对值判断，比如 −5 算素数，加的时候还是 −5），求这个和最大能是多少。子数组可以为空，和为 0。例：{1, 1, −5, 3, −3, 2} 的答案是 3。(a) 写 <code>int is_prime(int num)</code>；(b) 写尽量高效的 <code>int max_sum(int *vector, int len)</code>；(c) 写 main：malloc 一个叫 foo 的动态数组，填入上面的例子，打印结果，最后释放。（题面的数组声明写成长度 5，实际给了 6 个数。）</p>
<p><strong>先把问题变简单。</strong>不是素数的元素对和没有贡献，不如直接把它看成 0。例子就变成 0, 0, −5, 3, −3, 2，问题变成经典的<strong>最大子数组和</strong>（maximum subarray）：找一段连续元素，让它们的和最大。</p>
<p>最大子数组和有一个扫一遍就够的做法，叫 Kadane 算法。打个比方：你沿着数组往前走，手里攥着“从某处开始到这里”的累计和 <code>cur</code>。一旦 <code>cur</code> 变成负数，就把它扔掉、从 0 重新开始。为什么？带着一笔负数往后走，只会让后面的和变小，不如从下一个元素重新算。另一个变量 <code>best</code> 记下一路上 <code>cur</code> 最大的时候。</p>
<table>
<thead><tr><th>元素</th><th>看成</th><th>cur</th><th>best</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>−5</td><td>−5</td><td>−5，变负，清零为 0</td><td>0</td></tr>
<tr><td>3</td><td>3</td><td>3</td><td>3</td></tr>
<tr><td>−3</td><td>−3</td><td>0</td><td>3</td></tr>
<tr><td>2</td><td>2</td><td>2</td><td>3</td></tr>
</tbody>
</table>
<p>最后 best = 3，和题目给的答案一致。</p>
<p>(a) 判素数：</p>
<pre><code>int is_prime(int num)
{
    int i;
    if (num &lt; 0) num = -num;              /* -5 按 5 判断 */
    if (num &lt; 2) return 0;                /* 0 和 1 不是素数 */
    for (i = 2; i &lt;= num / i; i++) {      /* 即 i*i &lt;= num */
        if (num % i == 0) return 0;
    }
    return 1;
}</code></pre>
<ul>
<li>先取绝对值，题目规定负数按绝对值判断。</li>
<li>0 和 1 不是素数，要单独排除，否则下面的循环一次都不跑，会被当成素数。</li>
<li>只试除到 √num：如果 num = a × b，a、b 里至少有一个 ≤ √num，所以试到 √num 还没找到因数，后面也不会有。</li>
<li>为什么写 <code>i &lt;= num / i</code> 而不是 <code>i &lt;= sqrt(num)</code>：它和 i × i ≤ num 意思一样，但全程是整数运算，不用浮点、不用链接数学库，也不会像 <code>i * i</code> 那样在 num 很大时溢出。</li>
</ul>
<p>(b) 扫一遍求最大和：</p>
<pre><code>int max_sum(int *vector, int len)
{
    int i, cur = 0, best = 0;
    for (i = 0; i &lt; len; i++) {
        if (is_prime(vector[i])) cur += vector[i];   /* 非素数相当于加 0 */
        if (cur &lt; 0) cur = 0;                        /* 负的累计和丢掉，重新开始 */
        if (cur &gt; best) best = cur;
    }
    return best;
}</code></pre>
<p>三行循环体就是上面表格的三列：素数才加进 <code>cur</code>；<code>cur</code> 变负就清零；再拿 <code>cur</code> 更新 <code>best</code>。<code>best</code> 从 0 开始，对应“空子数组的和为 0”，所以就算全是负的素数，答案也是 0。</p>
<p>(c) main 做题目要求的四件事：malloc、填数、打印、free。</p>
<pre><code>#define LEN 6

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
<p><code>sizeof(*foo)</code> 就是一个 int 的大小，这样写，以后改了 foo 的类型也不用改这一行。malloc 之后照例检查 NULL，用完 free。</p>
<p><strong>复杂度：</strong>max_sum 扫一遍是 O(n)，但每个元素都要调一次 is_prime，每次最多试除到 √|x|，合计 O(n√M)，M 是数组里最大的绝对值。为什么这就是“尽量高效”：把所有子数组列出来逐个求和是 O(n³)，用前缀和也要 O(n²)，而扫一遍已经是每个元素只看一次。</p>
<div class="callout warn" data-label="易错">
<p>官方参考解答在这题上有三处问题：</p>
<ul>
<li>is_prime 的循环条件是 <code>i &lt; pow(num, 0.5) + 1</code>，又没特判 0 和 1，结果 1 被判成素数、2 被判成合数（逐步分析见后面“考试怎么考”的例 1）。</li>
<li>max_sum 是三重循环，O(n³)，拿不到“高效”的分。</li>
<li>内层循环不断覆盖 sum，实际只比较了单个元素：{2, 3} 会得到 3，正确答案是 5。题目的例子碰巧还是 3，所以看不出来。</li>
</ul>
</div>

<h2>复杂度填空</h2>
<p>这类题只写一个 Big-O，而且要“最紧的上界”（tightest upper bound）：能写 O(n) 就不要写 O(n²)。上界要盖住所有输入，所以默认按<strong>最坏情况</strong>想。唯一的例外是 2016 Q2(d)，课上给的答案按平均递归深度算。</p>

<h3>2015 Q3（6 分）</h3>
<table>
<thead><tr><th>问的是什么</th><th>答案</th><th>为什么</th></tr></thead>
<tbody>
<tr><td>(1) 往无序链表插入一个元素</td><td>O(1)</td><td>无序就不用找位置，直接插在表头，改两个指针</td></tr>
<tr><td>(2)(3) 自顶向下 / 自底向上归并排序的时间</td><td>O(n log n)</td><td>每次对半分，共约 log₂ n 层；每一层把所有段合并一遍，每个元素正好搬一次，O(n)。自底向上只是把递归换成循环，层数和每层的工作量都不变</td></tr>
<tr><td>(4)(5) 两者的额外空间</td><td>O(n)</td><td>合并时要一个长 n 的辅助数组放结果。自顶向下另有 O(log n) 的递归栈，比 n 小，不改变量级</td></tr>
<tr><td>(6) 表长 m、存 n 个元素的哈希表，每个桶的链表换成平衡 BST，最坏查找</td><td>O(log n)</td><td>最坏是 n 个键全落进同一个桶，这棵平衡树有 n 个结点，高度约 log n。平均每个桶只有 n/m 个键，但题目问的是最坏</td></tr>
</tbody>
</table>

<h3>2016 Q2（6 分）</h3>
<table>
<thead><tr><th>问的是什么</th><th>答案</th><th>为什么</th></tr></thead>
<tbody>
<tr><td>(a) 往有序链表插入一个元素</td><td>O(n)</td><td>接上结点只改指针，但要先顺着链找到位置。链表不能跳到中间，没法二分，最坏走到表尾</td></tr>
<tr><td>(b) 快速排序的时间</td><td>O(n²)</td><td>上界要盖住最坏情况：每次 pivot 都是最小或最大值（比如已排好序的数组、取第一个元素当 pivot），每次只分出去一个元素，要分 n 层。O(n log n) 只是平均</td></tr>
<tr><td>(c) 在完全平衡的三叉树（每个结点最多 3 个孩子）里查找</td><td>O(log n)</td><td>每往下一层，候选只剩 1/3，高度约 log₃ n。log₃ n 和 log₂ n 只差常数倍，Big-O 里不写底数</td></tr>
<tr><td>(d) 快速排序的额外空间</td><td>O(log n)（课上答案）</td><td>分区本身是原地的，额外空间来自递归栈：每层递归占一个栈帧，平均深度 log n。最坏深度是 n，即 O(n)。官方答 O(1)，漏了递归栈</td></tr>
<tr><td>(e) 值域为 r 时，自底向上归并排序的额外空间</td><td>O(n)</td><td>r 是干扰项。值域只影响计数排序（counting sort）这类按值开数组的算法；归并要的是长 n 的辅助数组，和数值多大无关</td></tr>
<tr><td>(f) 表长 m、已有 m − 1 个元素的拉链法哈希表，再插入一个的最坏时间</td><td>O(1)</td><td>“快满了”是干扰：拉链法每个桶是链表，没有“满”的说法。课上约定新结点插在链表头，和链多长无关。如果题目要求插入前先查重，最坏要扫完一条长 m − 1 的链，O(m)</td></tr>
</tbody>
</table>

<h2>堆与优先队列</h2>

<h3>2015 Q4(a)（4 分）自底向上建最小堆</h3>
<p><strong>题目：</strong>把数组 100 12 79 11 13 77 11 87 25 用自底向上（bottom-up）的方法建成<strong>最小堆</strong>（min-heap），写出过程，结果用数组和树两种形式给出；再说明自底向上为什么比逐个插入好。</p>
<p>按课上约定，数组从<strong>下标 1</strong> 开始放，下标 i 的孩子是 2i 和 2i + 1。n = 9，最后一个有孩子的结点是 ⌊9/2⌋ = 4。为什么从 4 开始：下标 5 到 9 都是叶子，单独一个结点本身就是合法的堆，不用动。</p>
<p>从 i = 4 倒着做到 1，对每个结点做下沉（sift down）：它比孩子大，就和<strong>较小的</strong>那个孩子交换，一直换到它不大于两个孩子为止。为什么换较小的：换上来的那个要当另一个孩子的父亲，只有较小的那个才保证不比另一个孩子大。两个孩子相等时取左孩子（右孩子严格更小才选右）。</p>
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
<figcaption>最终的最小堆，灰色数字是数组下标；橙色是 100 从根下沉到下标 9 的路径。</figcaption>
</figure>
<p><strong>结果数组：11 12 11 25 13 77 79 87 100。</strong>如果相等时取右孩子，会得到 11 11 77 12 13 100 79 87 25，同样是合法的最小堆，官方两种都给了。逐个插入（每插一个就上浮，sift up）又会得到第三种：11 12 11 25 13 79 77 100 87。同一组数，方法或相等时的取法不同，结果就不同；机考填空只认一种，按课上约定（自底向上、相等取左）做。</p>
<p><strong>为什么自底向上更好：</strong>它是 <strong>Θ(n)</strong>，逐个插入最坏是 <strong>Θ(n log n)</strong>。直观地看：一半的结点是叶子，自底向上时根本不动；倒数第二层最多下沉 1 层；只有靠近根的极少数结点才会下沉 log n 层，加起来总移动量是 O(n)。逐个插入正好反过来：大部分结点在底层，最后插进来的那一大批，最坏每个都要上浮约 log₂ n 层（见 6.3 建堆）。</p>
<p>如果题目改成<strong>最大堆</strong>（max-heap），规则反过来，和<strong>较大的</strong>孩子交换。同一个数组会得到 100 87 79 25 13 77 11 11 12，只交换 3 次（11 和 87；12 先和 87、再和 25）。</p>

<h3>2015 Q4(c) / 2016 Q3(c)（各 2 分）d 叉堆的孩子下标</h3>
<p><strong>题目：</strong>四叉堆（quaternary heap，2015）/ 三叉堆（ternary heap，2016）存在数组里，下标为 i 的结点，它的孩子在哪些下标？写明假设。</p>
<p>要写的假设有两条：<strong>下标从几开始</strong>，以及“算出来的下标 ≤ n 时这个孩子才存在”。</p>
<p>公式不用背，可以当场推。堆是一层一层、从左往右排满的，所以孩子也按父结点的顺序一组一组排下去。下标从 1 开始时：i 前面有 i − 1 个结点，它们的孩子一共占了 d(i − 1) 个位置，再加上根自己占的 1 号，i 的第一个孩子就在 d(i − 1) + 2，后面连着 d 个。下标从 0 开始时：i 前面有 i 个结点，占掉 d·i 个孩子位置，加上 0 号的根，第一个孩子在 d·i + 1。</p>
<table>
<thead><tr><th></th><th>下标从 0 开始</th><th>下标从 1 开始（课上约定）</th></tr></thead>
<tbody>
<tr><td>二叉</td><td>2i+1, 2i+2</td><td>2i, 2i+1</td></tr>
<tr><td>三叉</td><td>3i+1, 3i+2, 3i+3</td><td>3i−1, 3i, 3i+1</td></tr>
<tr><td>四叉</td><td>4i+1, 4i+2, 4i+3, 4i+4</td><td>4i−2, 4i−1, 4i, 4i+1</td></tr>
<tr><td>结点 j 的父结点</td><td>⌊(j−1)/d⌋</td><td>⌊(j+d−2)/d⌋</td></tr>
</tbody>
</table>
<p>验算一下从 1 开始的三叉堆：根 1 的孩子是 2, 3, 4，结点 2 的孩子是 5, 6, 7，正好紧接着排下去。官方只给了从 0 开始的版本；题目没说时，按课上约定从 1 开始（见 6.1 堆：定义与数组表示）。</p>

<h2>哈希</h2>

<h3>2015 Q6(a)（5 分）线性探测，再和双重哈希比</h3>
<p><strong>题目：</strong>表长 12，h(k) = k mod 12，用线性探测（linear probing）依次插入 17、53、41、29。(i) 画出表；(ii) 查找 125 要比较几次键？(iii) 换哪种冲突处理方式能减少这次查找的比较次数？为什么？</p>
<p>先算余数。17、53、41、29 两两相差 12 的倍数，所以除以 12 <strong>都余 5</strong>，125 也余 5。线性探测的规则是：位置被占了就往后挪一格。于是四个键从 5 号开始排成一串：</p>
<pre><code class="lang-text">下标  0  1  2  3  4  5   6   7   8   9  10  11
      -  -  -  -  -  17  53  41  29  -  -   -</code></pre>
<p><strong>(ii) 4 次。</strong>125 从 5 号开始找，依次和 17、53、41、29 比较，都不是；到 9 号是空槽，说明 125 不在表里，查找失败。碰到空槽不算一次键比较，因为那里没有键可比。</p>
<p><strong>(iii) 双重哈希（double hashing）。</strong>线性探测慢在哪：余数相同的键挤成连续的一串，这叫聚集（clustering），后来的键得一个个走过去。双重哈希冲突后不是挪 1 格，而是挪 h₂(k) 格，步长由第二个哈希函数算出。余数相同的键，步长一般不同，就不会挤在一起。</p>
<p>用课上的形式 h₂(k) = (k mod 11) + 1 算一遍：53 步长 10，落在 (5 + 10) mod 12 = 3 号；41 步长 9，落在 2 号；29 步长 8，落在 1 号。查 125 时先比较 5 号的 17，不是；再按 125 的步长 5 跳到 10 号，是空槽，<strong>只比较 1 次</strong>。</p>
<p>两点补充。12 不是素数，步长和 12 有公因数（如 2、3、4）时跳不遍整张表，所以实际应选素数表长。拉链法（separate chaining）在这里帮不上忙：四个键都在 5 号桶的链上，查不存在的 125 照样要比较 4 次。</p>

<h3>2016 Q5(d)（3 分）线性探测和拉链法比</h3>
<p><strong>题目：</strong>表长 10，h(k) = k mod 10，线性探测，依次插入 1、23、43、99、44、79、89。(i) 画出表；(ii) 改用拉链法（chaining），查找 89 的键比较次数会不会减少？</p>
<pre><code class="lang-text">1  → 1
23 → 3
43 → 3 被占 → 4
99 → 9
44 → 4 被占 → 5
79 → 9 被占 → 回绕到 0
89 → 9、0、1 都被占 → 2

下标  0   1   2   3   4   5   6  7  8  9
      79  1   89  23  43  44  -  -  -  99</code></pre>
<p>注意 79 和 89：9 号被占后往后挪，从表尾绕回到 0 号（wrap around）。</p>
<p><strong>(ii) 会减少。</strong>线性探测查 89：从 9 号开始，依次比较 99、79、1、89，共 <strong>4 次</strong>。其中 1 的余数根本不是 9，它挡在路上，只是因为 79 绕回后和它连成了一串，这就是聚集的代价。拉链法下，9 号链上只有余数为 9 的 99、79、89。课上约定新结点插在链表头，链是 89 → 79 → 99，<strong>1 次</strong>就找到；就算插在表尾也只要 3 次，都比 4 次少。</p>

<h2>树与旋转</h2>

<h3>2015 Q6(b)（5 分）指定一条边做左旋</h3>
<p><strong>题目：</strong>一棵 BST：H 的左孩子是 F（F 的孩子是 D、G），右孩子是 M；M 的左孩子 J、右孩子 R；R 的孩子 Q、W。对边 M–R 做一次左旋（left rotation）。(i) 画出旋转后的树；(ii) 用指向 H、M、R 的指针写出完成左旋的 C 语句。</p>
<p>左旋就是把 R “拎”上去，M 降下来。具体变三处：R 接替 M，成为 H 的右孩子；M 变成 R 的左孩子；R 原来的左子树 Q 没地方放了，改挂到 M 的右边。为什么 Q 能挂在那里：Q 在 R 的左边，所以 Q &lt; R；Q 又在 M 的右子树里，所以 Q &gt; M。M 的右边正好放“比 M 大”的东西，BST 性质不变。其余结点都不动。</p>
<p>画完怎么检查：<strong>旋转不改变中序遍历</strong>（in-order traversal）。旋转前后的中序都是 D F G H J M Q R W，对得上就没画错。</p>
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
<figcaption>左：旋转前，橙色为边 M–R；右：旋转后。绿色的 Q 从 R 的左边换到了 M 的右边。</figcaption>
</figure>
<p>(ii) 结点定义是 <code>struct node { char key; struct node *left; struct node *right; }</code>（题面的定义多写了一个星号）。设 g、p、c 分别指向 H、M、R：</p>
<pre><code>/* g = H（祖父），p = M（父），c = R（p 的右孩子） */
p-&gt;right = c-&gt;left;    /* Q 从 R 的左边改挂到 M 的右边 */
c-&gt;left  = p;          /* M 成为 R 的左孩子 */
g-&gt;right = c;          /* R 接替 M 成为 H 的右孩子 */</code></pre>
<ul>
<li>第 1 句：先把 Q 从 R 身上取下来，挂到 M 的右边。</li>
<li>第 2 句：R 的左边空出来了，让 M 挂上去。</li>
<li>第 3 句：H 的右指针原来指着 M，改成指向 R。</li>
</ul>
<p>前两句不能对调：先执行 <code>c-&gt;left = p</code>，原来 R 左边的 Q 就没有指针指着了，再也找不回来。如果 M 是 H 的左孩子，最后一句改成 <code>g-&gt;left = c</code>；如果 M 本身是根，就改根指针（见 3.6 AVL 旋转）。</p>

<h3>2016 Q5(e)（2 分）一次旋转让树恢复平衡</h3>
<p><strong>题目：</strong>一棵 BST：根 7，左孩子 4（4 的左孩子 2），右孩子 32；32 的孩子是 12 和 38；12 的孩子是 8 和 17；8 只有右孩子 10。用一次旋转让它平衡，说明是哪种旋转并画出结果。</p>
<p>第一步算高度和平衡因子（balance factor，左子树高 − 右子树高）。课上约定<strong>叶子高度为 1</strong>，空树高度为 0：</p>
<ul>
<li>10、17、38、2 是叶子，高 1。</li>
<li>8：左 0、右 1，高 2，平衡因子 −1。</li>
<li>12：左 2、右 1，高 3，平衡因子 +1。</li>
<li>4：左 1、右 0，高 2，平衡因子 +1。</li>
<li>32：左 3、右 1，高 4，平衡因子 <strong>+2</strong>。</li>
<li>7：左 2、右 4，高 5，平衡因子 <strong>−2</strong>。</li>
</ul>
<p>第二步找要修的结点。7 和 32 都失衡了，先修<strong>最深的失衡结点 32</strong>。为什么：32 这棵子树修好后会变矮，7 的右边跟着变矮，7 往往就自动平衡了。</p>
<p>第三步定旋转类型。32 左边高（+2），它的左孩子 12 也是左边高（+1），两次都偏左，是 <strong>LL 情形，在 32 处做一次右旋</strong>（旋转边 12–32）：12 升上来，32 变成 12 的右孩子，12 原来的右子树 17 改挂到 32 的左边。</p>
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
<figcaption>左：红色为失衡结点及平衡因子，橙色为旋转边 12–32；右：旋转后。绿色的 17 从 12 的右边换到了 32 的左边。</figcaption>
</figure>
<p>最后验算：旋转后 8、32 高 2，12 高 3；7 的平衡因子变成 2 − 3 = −1。<strong>所有结点的平衡因子都在 −1 到 1 之间</strong>，根 7 不需要再动。</p>

<h2>图算法</h2>

<h3>换一种实现，复杂度是多少</h3>
<p>这几题的套路一样：先数清算法要做<strong>几次什么操作</strong>，再乘上每次操作在这种实现下的代价。</p>
<p><strong>2015 Q5(a)（3 分）Floyd-Warshall 求全源最短路的时间：</strong>(i) 用 V 表示；(ii) 稠密图用 E 表示；(iii) 稀疏图用 E 表示。</p>
<ul>
<li>(i) <strong>Θ(V³)</strong>：三重循环，每层都是 V 次，和边数无关。</li>
<li>(ii) 稠密图 E ≈ V²，所以 V ≈ E<sup>1/2</sup>，代进去得 <strong>Θ(E<sup>3/2</sup>)</strong>。</li>
<li>(iii) 稀疏（连通）图 E ≈ V，代进去得 <strong>Θ(E³)</strong>。</li>
</ul>
<p><strong>2015 Q4(b)（4 分）Dijkstra 的优先队列（priority queue, PQ）分别用 (i) 堆、(ii) 按距离排好序的链表实现，复杂度各是多少？</strong></p>
<p>先数操作：每个顶点出队一次，共 <strong>V 次 deletemin</strong>；每条边最多让终点的距离变小一次（这一步叫松弛，relaxation），所以<strong>最多 E 次 update</strong>。</p>
<table>
<thead><tr><th>PQ 的实现</th><th>deletemin</th><th>update</th><th>总计</th></tr></thead>
<tbody>
<tr><td>二叉堆</td><td>O(log V)：取走堆顶，把最后一个放上来下沉</td><td>O(log V)：距离变小，往上浮</td><td><strong>O((V + E) log V)</strong></td></tr>
<tr><td>有序链表</td><td>O(1)：最小的就在表头</td><td>O(V)：摘下来，再从头找新位置</td><td><strong>O(V + EV) = O(EV)</strong></td></tr>
<tr><td>无序数组（对照）</td><td>O(V)：扫一遍找最小</td><td>O(1)：直接改</td><td>O(V² + E) = O(V²)</td></tr>
</tbody>
</table>
<p>无序数组那一行是课上的另一种实现，放在这里对照：稠密图 E ≈ V² 时，堆版是 O(V² log V)，有序链表是 O(V³)，它的 O(V²) 反而最好。</p>
<p><strong>2016 Q3(b)（4 分）Prim 的优先队列用平衡二叉搜索树实现（题目提示删除时用中序找前驱 / 后继），复杂度是多少？</strong></p>
<p>答案 <strong>O((V + E) log V)</strong>，和二叉堆一样：</p>
<ul>
<li>deletemin：最小的键在最左边，从根一路往左走到底再删掉。平衡树高 log V，所以 O(log V)。</li>
<li>update：把旧键删掉，再插入新键，各 O(log V)。</li>
<li>删一个有两个孩子的结点时，要找中序后继（in-order successor）来顶替：往右一步，再一路往左，只走一条路径，也是 O(log V)。</li>
<li>一共 V 次 deletemin、最多 E 次 update，合起来 O((V + E) log V)。</li>
</ul>
<p>官方解答把“中序”理解成遍历整棵树，deletemin 记成 O(V)，得到 O(V² + E log V)，又化简成 O(V²)。后一步丢掉了 E log V，而稠密图 E ≈ V² 时 E log V 比 V² 还大，不能丢（见 7.7 最小生成树与 Prim 算法）。</p>
<p><strong>2016 Q4(a)（3 分）E = V 和 E = V² 时，求最小生成树（minimum spanning tree, MST）各用什么算法最好？给出最坏复杂度。</strong></p>
<p>官方答案是“稀疏用 Kruskal、稠密用 Prim”，但 Kruskal 今年不考，只用 Prim 答：</p>
<ul>
<li>E = V（稀疏）：邻接表 + 二叉堆，O((V + E) log V) = <strong>O(V log V)</strong>。</li>
<li>E = V²（稠密）：堆版会变成 O(V² log V)。改用邻接矩阵 + 普通数组存每个顶点的 key，每轮扫一遍数组找最小 O(V)，更新 O(1)，<strong>总共 O(V²)</strong>。道理和 Dijkstra 的无序数组一样：边多时，省掉每次 update 的 log V 更划算。</li>
</ul>

<h3>判断题</h3>
<p><strong>2016 Q4(b)(i)（1 分）对无向图做一次深度优先遍历，就能访问到全部顶点。</strong></p>
<p><strong>错</strong>（官方答案）。从一个起点出发的一次 DFS 只能走完起点所在的连通分量（connected component）。图不连通，其他几块就漏掉了。课上写的完整 DFS 外面还套了一层循环：对每个顶点，没访问过就从它重新开始一次，这样才能访问全部顶点。作答时写清楚说的是哪一种（见 7.3 深度优先搜索）。</p>
<p><strong>2016 Q4(b)(ii)（1 分）在带权的有向无环图（DAG）上，BFS 和 Dijkstra 总能找到最短路。</strong></p>
<p><strong>错。</strong>BFS 只数经过几条边，不看权重。反例：S→A 权 1、A→T 权 1、S→T 权 5。BFS 一步就到 T，给出 S→T，长 5；最短的其实是 S→A→T，长 2。Dijkstra 要求边权非负，而 DAG 可以有负权边，反例见下面的 2016 Q4(d)。</p>
<p><strong>2016 Q4(c)（4 分）有向图里，所有顶点的出度（out-degree）之和与入度（in-degree）之和是什么关系？</strong></p>
<p><strong>相等，都等于 E。</strong>每条有向边 (u, v) 恰好给 u 贡献 1 个出度、给 v 贡献 1 个入度。数出度也好，数入度也好，其实都是把每条边数了一次。（无向图对应的结论是度数之和 = 2E，因为每条边两头各算一次。）</p>

<h3>2016 Q4(d)（5 分）构造让 Dijkstra 出错的图</h3>
<p><strong>题目：</strong>构造一个图，使 Dijkstra 算出错误的距离，并解释原因。</p>
<p>一条负权边就够。有向图，起点 S，四条边：S→A 权 2、S→B 权 4、B→A 权 −3、A→T 权 1。按 Dijkstra 走一遍：</p>
<table>
<thead><tr><th>出队</th><th>松弛</th></tr></thead>
<tbody>
<tr><td>S (0)</td><td>A = 2，B = 4</td></tr>
<tr><td>A (2)</td><td>T = 3；A 定稿</td></tr>
<tr><td>T (3)</td><td>没有出边</td></tr>
<tr><td>B (4)</td><td>4 − 3 = 1 &lt; 2，但 A 已经定稿，不再更新</td></tr>
</tbody>
</table>
<p>算法给出 A = 2、T = 3；真正的最短距离是 A = 1（走 S→B→A）、T = 2。</p>
<p><strong>原因：</strong>Dijkstra 每次从 PQ 取出距离最小的顶点，就认定这个距离是最终值，以后不再改。它的依据是“从别的路绕过来，只会更长”。边权都非负时这没问题；有了负权边，绕路反而可能变短（S→B→A 绕了一下，却比 S→A 少 1），这个依据就不成立了。</p>
<p>官方给的例子含负环（negative cycle），其实不需要：有负环时“最短路”本身就没有定义（绕一圈就更短，可以一直绕），拿它当反例反而说不清楚（见 7.5 Dijkstra 单源最短路）。</p>

<h3>2015 Q5(c)（5 分）最小 fatness 路径</h3>
<p><strong>题目：</strong>连通的带权<strong>有向图</strong>里，一条路径的 fatness 定义为路径上最大的边权。给定 u、v，设计一个高效算法，求 u 到 v 所有路径里最小的 fatness。</p>
<p>打个比方：边权是每段路的坡度，fatness 就是一条路线上最陡的那段坡。你要挑一条路线，让最陡的那段尽量平缓。</p>
<p><strong>做法：改造 Dijkstra。</strong>原来一条路径的代价是“边权之和”，现在换成“边权的最大值”，其余步骤照旧。</p>
<pre><code class="lang-text">MinFatness(G, u, v):
    对每个顶点 x: f[x] = ∞
    f[u] = −∞                          // 还没走任何边
    PQ = 所有顶点，按 f 排序（最小堆）
    while PQ 非空:
        x = deleteMin(PQ)              // f[x] 定稿
        if x == v: return f[v]
        for 每条边 (x, y)，y 未定稿:
            c = max(f[x], w(x, y))     // 原来是 f[x] + w(x, y)
            if c &lt; f[y]:
                f[y] = c;  update(PQ, y)</code></pre>
<p>和原版只差一处：松弛时算 <code>max(f[x], w(x, y))</code>，不再是 <code>f[x] + w(x, y)</code>。f[u] 设成 −∞，这样从 u 出去的第一条边，fatness 就是它自己的权。</p>
<p><strong>为什么对：</strong>Dijkstra 成立靠的是“路径往后延长，代价不会变小”。取最大值也满足这一点：多走一条边，最大值只会不变或变大，就算有负权边也一样。所以出队时的最小值不会再被改进。复杂度和 Dijkstra 相同，用二叉堆是 <strong>O((V + E) log V)</strong>。</p>
<p>另一种做法：把所有不同的边权排好序，二分一个阈值 W，只保留权 ≤ W 的边，从 u 做一次 BFS 或 DFS，看能不能到 v。到得了就试更小的 W，到不了就试更大的，O((V + E) log E)。</p>
<p>官方答案是“先建 MST，再在 MST 上找路径”。这只对<strong>无向图</strong>成立（无向图里 MST 上的路径确实是 fatness 最小的路径，见 8.6 算法设计题怎么答）。MST 不管边的方向，搬到有向图上会出错。反例：u→v 权 9、w→u 权 1、w→v 权 1。忽略方向建 MST，会选两条权 1 的边，给出 1；但从 u 出发只有 u→v 一条路，真正的答案是 9。</p>

<h3>2015 Q5(d)（5 分）让 Prim 处理不连通的图</h3>
<p><strong>题目：</strong>Prim 只能处理连通图。做一处小改动，让它在不连通的带权无向图上，为每个连通分量各建一棵最小生成树。</p>
<p>原版为什么不行：Prim 从一个起点出发，每次只能沿着边往外长，走不到别的连通分量。所以思路和完整 DFS 一样，外面套一层对所有顶点的循环，碰到还没进树的顶点，就以它为根再跑一次 Prim：</p>
<pre><code class="lang-text">PrimForest(G):
    对每个顶点 x: inMST[x] = false; dist[x] = ∞; pred[x] = 无
    for 每个顶点 s:
        if not inMST[s]:
            dist[s] = 0                // s 是新一棵树的根
            从 s 跑一次 Prim           // 结束时 s 所在分量全部 inMST</code></pre>
<p>inMST 和 pred 在几次运行之间不清空，所以建好的分量不会被重复处理；pred 为“无”的顶点就是每棵树的根。每个顶点只进出 PQ 一次，每条边只检查常数次，总复杂度仍是 <strong>O((V + E) log V)</strong>。</p>
<p>如果实现一开始就把所有顶点以 ∞ 放进 PQ，改动更小：deletemin 取出一个 dist = ∞ 的顶点，说明当前分量已经建完（剩下的顶点都连不过来），把它当新树的根（pred 置空）继续即可。</p>

<h3>2016 Q5(c)（2 分）拓扑排序</h3>
<p><strong>题目：</strong>有向图的边为 1→2、1→4、2→3、2→4、2→6、3→5、4→6、5→4、5→6，求一个拓扑排序（topological sort）并写出过程。</p>
<p>用源点删除法（source removal）：每次拿走一个入度为 0 的顶点，再删掉它发出的边，相应顶点的入度减 1。为什么拿入度为 0 的：没有任何边指向它，把它排在最前面不会违反任何一条边。起始入度：1:0、2:1、3:1、4:3、5:1、6:3。</p>
<pre><code class="lang-text">取出  入度变化
1     2:0  4:2
2     3:0  4:1  6:2
3     5:0
5     4:0  6:1
4     6:0
6</code></pre>
<p>每一步都恰好只有一个入度为 0 的顶点可选，所以拓扑序是<strong>唯一的：1 2 3 5 4 6</strong>。换个角度看：图里有一条经过全部顶点的路径 1→2→3→5→4→6，它已经把顺序完全定死了。</p>
<p>用 DFS 也能做：从 1 出发，邻居按编号从小到大访问，各顶点结束（finish）的顺序是 6 4 5 3 2 1，倒过来同样是 1 2 3 5 4 6（见 7.8 拓扑排序）。为什么要倒过来：一个顶点要等它能到达的顶点全部结束后才结束，所以结束得越晚，越该排在前面。</p>
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

<h2>排序</h2>

<h3>2016 Q5(a)（1.5 分）自底向上归并要合并几次</h3>
<p><strong>题目：</strong>对 7 个整数做自底向上（bottom-up）归并排序，一共做几次合并（merge）？给出准确数字并说明。</p>
<p><strong>6 次。</strong>一轮一轮数：</p>
<ul>
<li>宽度 1：合并 (1,2)、(3,4)、(5,6)，第 7 个没有搭档，原样留着，3 次。</li>
<li>宽度 2：合并 (12,34)、(56,7)，2 次。</li>
<li>宽度 4：合并 (1234,567)，1 次。</li>
</ul>
<p>更快的想法：开始时有 n 段（每个元素一段），每合并一次，两段变一段，段数减 1；最后剩 1 段，所以正好合并 <strong>n − 1</strong> 次，和自顶向下还是自底向上无关。</p>
<p>容易混的是“调用次数”：自底向上是循环实现，mergesort 本身只调用 1 次；自顶向下的递归调用是 2n − 1 = 13 次，但合并同样是 6 次。官方写的是“7（或 6）”；课上的写法里落单的段直接留着、不算一次合并，答 6（见 5.8 自底向上与自适应归并排序）。</p>

<h3>2016 Q5(b)（1.5 分）快速排序选出的 pivot</h3>
<p><strong>题目：</strong>对 {13, 4, 5, 43, 22, 2, 3, 1} 做快速排序，每次取最左边的元素当 pivot；分区时保持元素原来的相对顺序（不用按下标模拟交换）。依次选出了哪些 pivot？</p>
<p>“保持相对顺序”的意思是：比 pivot 小的按原来的先后排在左边，比它大的按原来的先后排在右边。这样每一步都很好写：</p>
<pre><code class="lang-text">[13 4 5 43 22 2 3 1]  pivot 13 → [4 5 2 3 1] 13 [43 22]
[4 5 2 3 1]           pivot 4  → [2 3 1] 4 [5]
[2 3 1]               pivot 2  → [1] 2 [3]
[43 22]               pivot 43 → [22] 43 []</code></pre>
<p>真正做了分区的 pivot 依次是 <strong>13, 4, 2, 43</strong>；只剩 1 个元素的段已经有序，不用分区。如果把单元素段也算作“选了 pivot”，按递归顺序是 13, 4, 2, 1, 3, 5, 43, 22，这就是官方答案。</p>
<p>为什么题目要特意规定分区方式：分区方式不同，数组被打乱的样子就不同，后面选到的 pivot 也跟着不同。比如用课上的双指针原地分区，第一次分区后数组是 [2 4 5 1 3] 13 [22 43]，选出的 pivot 依次是 13, 2, 5, 3, 22。题目怎么规定就怎么走（见 5.5 快速排序：pivot 与分区）。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>两年都出过的题型</strong>：d 叉堆的孩子下标；换一种 PQ 后 Dijkstra / Prim 的复杂度；线性探测填表，再和另一种冲突处理比比较次数；指定一条边做旋转，画图或写指针语句；C 题都要 malloc / free，处理字符串或数组。</li>
<li><strong>机考填空没地方写假设</strong>，一律按课上约定：堆从下标 1 开始、两孩子相等取左；拉链法插在链表头；快排用课上的双指针分区（题目另有规定除外）；叶子高度为 1。</li>
<li><strong>常见陷阱</strong>：题干里多余的条件（归并排序的值域 r、“已有 m − 1 个元素”）；快排的额外空间来自递归栈；一次 DFS 只覆盖一个连通分量；BFS 不看权重，Dijkstra 不能有负权边；有向图上不能套 MST；查找失败时空槽不算键比较。</li>
<li><strong>公式表</strong>上有对数恒等式、求和公式、主定理和装载因子估计，但上面这些结论都不在表上：d 叉堆下标、各种 PQ 下的复杂度要会当场推。</li>
</ul>
<p>下面两道是按旧卷风格改编的例题。</p>

<h3>例 1：读代码，找出判素数的 bug</h3>
<p><strong>题目：</strong>下面的 is_prime 对 0、1、2、3、9 各返回什么？怎么改？</p>
<pre><code>int is_prime(int num)
{
    int i;
    if (num &lt; 0) num = -num;
    for (i = 2; i &lt; sqrt(num) + 1; i++)
        if (num % i == 0) return 0;
    return 1;
}</code></pre>
<p>逐个代进去，看循环条件第一次成不成立：</p>
<table>
<thead><tr><th>num</th><th>循环过程</th><th>返回</th><th>对吗</th></tr></thead>
<tbody>
<tr><td>0</td><td>sqrt(0) + 1 = 1，2 &lt; 1 不成立，循环一次都不跑</td><td>1</td><td>错，0 不是素数</td></tr>
<tr><td>1</td><td>sqrt(1) + 1 = 2，2 &lt; 2 不成立</td><td>1</td><td>错，1 不是素数</td></tr>
<tr><td>2</td><td>2 &lt; 2.41 成立，2 % 2 == 0</td><td>0</td><td>错，2 是素数</td></tr>
<tr><td>3</td><td>i = 2 不整除；i = 3 时 3 &lt; 2.73 不成立</td><td>1</td><td>对</td></tr>
<tr><td>9</td><td>i = 2 不整除；i = 3 整除</td><td>0</td><td>对</td></tr>
</tbody>
</table>
<p>所以依次返回 <strong>1, 1, 0, 1, 0</strong>，前三个都错。毛病有两处：没有排除 0 和 1；“+ 1”让 2 也去试除它自己。改法：开头加 <code>if (num &lt; 2) return 0;</code>，循环条件改成 <code>i &lt;= num / i</code>。这样 2 的循环条件是 2 &lt;= 1，不成立，直接返回 1。2016 Q1 官方解答里的 bug 就是这一个。</p>

<h3>例 2：同一棵树，换一种失衡</h3>
<p><strong>题目：</strong>把 2016 Q5(e) 的树改一处：去掉 10，给 17 加一个右孩子 20。现在要做什么旋转？结果是什么？</p>
<p>重新算高度：8 变成叶子，高 1；17 有右孩子 20，高 2；12 左 1、右 2，高 3，平衡因子 <strong>−1</strong>；32 左 3、右 1，高 4，平衡因子 +2；7 左 2、右 4，平衡因子 −2。</p>
<p>最深的失衡结点还是 32，它左边高；但它的左孩子 12 是<strong>右边高</strong>。一左一右，是 <strong>LR 情形</strong>，单旋修不好：如果直接在 32 处右旋，12 升上去后左边只有高 1 的 8，右边是高 3 的 32，平衡因子 −2，还是失衡。要做双旋：<strong>先在 12 处左旋，再在 32 处右旋</strong>。</p>
<p>结果：17 升为这棵子树的根，左孩子 12（12 的左孩子 8），右孩子 32（32 的孩子 20、38）。验算：12、32 都高 2，17 高 3，7 的平衡因子变成 2 − 3 = −1，全树平衡。</p>

<h2>小结</h2>
<ul>
<li>旧卷“算一个结果”的小题对应今年的自动判分题，只看答案，按课上约定做：堆从下标 1 开始、相等取左，拉链法插表头，叶子高度为 1。</li>
<li>C 题看正确、高效、规范：malloc 后检查 NULL、用完 free；存字符串要 malloc 新内存再 strcpy，不能只存 buffer 的地址。</li>
<li>复杂度填空写最紧的上界，按最坏情况想；小心题干里的干扰条件。快排的额外空间来自递归栈。</li>
<li>换一种 PQ 的复杂度题：先数“V 次 deletemin、最多 E 次 update”，再乘每次的代价。</li>
<li>Dijkstra 不能有负权边，一条就能构造反例；BFS 不看权重；有向图不能套 MST；一次 DFS 只覆盖一个连通分量。</li>
<li>官方参考解答在素数判断、快排额外空间、Prim + 平衡 BST、有向图最小 fatness 路径这几处有错，不要照抄。</li>
</ul>
`;
