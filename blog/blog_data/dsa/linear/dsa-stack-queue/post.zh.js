/* Post body — dsa-stack-queue / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-stack-queue:zh'] = `
<p class="lead">栈（stack）后进先出，队列（queue）先进先出。两者都能用数组或链表实现，每个操作是不是 O(1)，要看“进”和“出”放在哪一端；用数组实现队列时，靠循环数组（circular array）才能让两端都是 O(1)。</p>

<h2>从一个场景说起</h2>
<p>食堂洗好的盘子摞成一摞：新洗好的放在最上面，拿的时候也从最上面拿。<strong>最后放上去的那个，最先被拿走。</strong></p>
<p>奶茶店门口排队：新来的人站到队尾，店员从队头开始叫号。<strong>最先来的那个，最先被服务。</strong></p>
<p>存的东西一样，取出来的顺序正好相反。程序里两种都常用：按 Ctrl+Z 先撤销最近的一步，是一摞盘子；打印机按提交先后打印，是排队。</p>

<h2>它是什么：栈和队列</h2>
<p>简单说，<strong>栈就是一摞盘子</strong>：只能在顶上放、在顶上拿。英文叫 stack，规则是后进先出（Last In First Out, LIFO），课上也说 first in, last out。</p>
<p><strong>队列就是排队</strong>：从队尾进、从队头出。英文叫 queue，规则是先进先出（First In First Out, FIFO）。</p>
<p>比如依次放入 3、5、8，再取出一个：<strong>栈取出 8，队列取出 3</strong>。</p>
<table>
<thead><tr><th>ADT</th><th>放入</th><th>取出</th><th>其他操作</th></tr></thead>
<tbody>
<tr><td>栈</td><td>push(x)：放到栈顶（top）</td><td>pop()：取走并返回栈顶</td><td>top() / peek()：只看栈顶不取走；isEmpty()、size()</td></tr>
<tr><td>队列</td><td>enqueue(x)：放到队尾（tail / rear）</td><td>dequeue()：取走并返回队头（head / front）</td><td>isEmpty()、size()</td></tr>
</tbody>
</table>
<p>对空栈 pop、对空队列 dequeue 叫下溢（underflow）；容量固定时满了还往里放，叫上溢（overflow）。两种都是错误，C 里一般让函数返回 0 表示失败、1 表示成功。</p>
<p>两者的区别在“口”的数量：<strong>栈只有一个口</strong>（栈顶），进出都在这里；<strong>队列有两个口</strong>，一头进、另一头出。实现的难易就差在这里。</p>

<h3>栈：挑一个便宜的端当栈顶</h3>
<p><strong>数组：栈顶放在末尾。</strong>用 n 记元素个数，栈顶就是 a[n−1]：</p>
<pre><code>typedef struct { int a[100]; int n; } arrstack_t;   /* top is a[n-1] */

void push(arrstack_t *s, int x) { s-&gt;a[s-&gt;n++] = x; }    /* caller checks n &lt; 100 */
int  pop(arrstack_t *s)         { return s-&gt;a[--s-&gt;n]; }  /* caller checks n &gt; 0 */</code></pre>
<p>push 把 x 写进 a[n]，再让 n 加 1；pop 先让 n 减 1，再读出 a[n]，也就是原来的栈顶。别的元素都不动，O(1)。栈顶放在 a[0] 的话，每次都要整段挪一格，O(n)。</p>
<p><strong>链表：栈顶放在表头。</strong>push 就是头插（2.4 的 <code>new-&gt;next = head; head = new;</code>），pop 就是删表头，都是 O(1)。栈顶放在表尾就慢了：删掉尾结点后要把倒数第二个结点的 next 改成 NULL，单向链表得从表头走过去才找得到它，O(n)，有 tail 指针也一样。</p>

<h3>队列：两头都要快，数组就犯难了</h3>
<p><strong>链表</strong>好办：表尾进、表头出，再多存一个 tail 指针，enqueue 就不用从头走到尾，两个操作都是 O(1)。</p>
<p><strong>数组</strong>麻烦一些。队头固定在 a[0]（期末复习叫 forward）时，enqueue 写到末尾是 O(1)，但 dequeue 取走 a[0] 后剩下的元素全部左移，O(n)；队头放在末尾（backward）则反过来，enqueue 要插到 a[0]、整体右移。</p>
<p>改进一步：用下标 head 记住队头在哪，dequeue 只把 head 加 1，不移位。两端都 O(1) 了，可 head 前面空出来的位置再也用不上，tail 走到数组末尾就放不下了，哪怕队里只剩一两个元素。怎么把它们重新用上？让下标走到末尾后绕回开头，这就是循环数组。</p>

<h2>看个例子：容量为 5 的循环数组</h2>
<p>把数组首尾相接，想成一个钟面：指针走过最后一格，又回到第一格。数组下标走到 cap − 1 之后，下一个是 0，写成 <code>i = (i + 1) % cap</code>。</p>
<p>队列用三个变量记状态：</p>
<ul>
<li><strong>head</strong>：队头元素的下标，dequeue 从这里取。</li>
<li><strong>tail</strong>：下一个空位的下标，enqueue 写到这里。</li>
<li><strong>count</strong>：队里现在有几个元素。</li>
</ul>
<p>enqueue(x)：<code>a[tail] = x</code>，tail 前进一格，count 加 1。dequeue()：取出 <code>a[head]</code>，head 前进一格，count 减 1。取走的值不擦掉，以后会被覆盖。</p>
<p>cap = 5，从空队列开始（head = tail = count = 0）：</p>
<ol>
<li><strong>enqueue 10、20、30</strong>：依次写进 a[0]、a[1]、a[2]，tail = 3，count = 3。</li>
<li><strong>dequeue 两次</strong>：取出 10、20，head = 2，count = 1。a[0]、a[1] 里还留着 10、20，但已经不算在队列里。</li>
<li><strong>enqueue 40、50</strong>：40 写进 a[3]，50 写进 a[4]。这时 tail = (4 + 1) % 5 = 0，<strong>绕回了开头</strong>。</li>
<li><strong>enqueue 60、70</strong>：写进 a[0]、a[1]，盖掉旧的 10、20。tail = 2，count = 5，队列满了。</li>
</ol>
<p>如果 head、tail 只加 1 不回绕，第 3 步后 tail = 5，60 就放不下了，尽管 a[0]、a[1] 空着。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-stack-queue/anims/circular-queue.html" loading="lazy" style="height: 500px;" title="循环数组队列"></iframe>
<p class="anim-caption">点“循环数组”逐步看这串操作，接着还有满了被拒、一路出队到空；点“不回绕”对比 60 为什么放不下。</p>

<h3>满和空怎么区分</h3>
<p>从上面满的状态接着 dequeue 五次，依次取出 30、40、50、60、70，队列变空，head 也绕了一圈回到 2。两个时刻并排看：</p>
<pre><code class="lang-text">满：a = [60 70 30 40 50]   head = 2   tail = 2   count = 5
空：a = [60 70 30 40 50]   head = 2   tail = 2   count = 0</code></pre>
<p>出队不擦数据，所以数组和两个下标一模一样：<strong>只看 head == tail，分不清满和空</strong>。办法是多存一个 count：count == 0 是空，count == cap 是满。另一种做法是永远空一格：(tail + 1) % cap == head 算满，head == tail 只表示空，代价是最多存 cap − 1 个元素。</p>

<h3>代码：enqueue 和 dequeue</h3>
<p>循环队列的核心就这几行（创建时 head、tail、count 置 0，a 用 malloc 分配 cap 个 int）：</p>
<pre><code>typedef struct {
    int *a;                        /* cap slots */
    int cap, head, tail, count;
} queue_t;

int enqueue(queue_t *q, int x) {
    if (q-&gt;count == q-&gt;cap) return 0;       /* full */
    q-&gt;a[q-&gt;tail] = x;
    q-&gt;tail = (q-&gt;tail + 1) % q-&gt;cap;       /* wrap around */
    q-&gt;count++;
    return 1;
}

int dequeue(queue_t *q, int *x) {
    if (q-&gt;count == 0) return 0;            /* empty */
    *x = q-&gt;a[q-&gt;head];
    q-&gt;head = (q-&gt;head + 1) % q-&gt;cap;       /* wrap around */
    q-&gt;count--;
    return 1;
}</code></pre>
<ul>
<li><code>if (q-&gt;count == q-&gt;cap) return 0;</code>：满了就拒绝。判满看 count，不看 head == tail。</li>
<li><code>q-&gt;a[q-&gt;tail] = x;</code>：新元素写进 tail 指着的空位。</li>
<li><code>q-&gt;tail = (q-&gt;tail + 1) % q-&gt;cap;</code>：tail 前进一格，到 cap 就变回 0。<strong>括号不能省</strong>：<code>q-&gt;tail + 1 % q-&gt;cap</code> 里 % 先算，结果就是 tail + 1，会越过数组末尾。</li>
<li><code>q-&gt;count++;</code>：多了一个元素。</li>
<li>dequeue 先判空；返回值用来报告成败，取出的值就通过指针 <code>*x</code> 交出去；之后 head 前进、count 减 1。</li>
</ul>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/okr-XE8yTO8" title="Data structures: Array implementation of Queue" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Data structures: Array implementation of Queue》（英文，约 15 分钟），讲数组队列怎样靠取模回绕变成循环数组。视频不存 count、rear 指最后一个元素，写法和课上不同，考试按课上的写。</p>

<h2>补充：各种实现的代价</h2>
<p>判断方法只有一条：先看进和出各发生在哪一端，再看那一端在数组里要不要移位、在单向链表里要不要找前驱。</p>
<table>
<thead><tr><th>实现</th><th>进（push / enqueue）</th><th>出（pop / dequeue）</th><th>原因</th></tr></thead>
<tbody>
<tr><td>栈：数组，栈顶在末尾</td><td>O(1)</td><td>O(1)</td><td>只动 a[n−1] 一格</td></tr>
<tr><td>栈：数组，栈顶在下标 0</td><td>O(n)</td><td>O(n)</td><td>每次整体移位</td></tr>
<tr><td>栈：链表，栈顶在表头</td><td>O(1)</td><td>O(1)</td><td>头插、删表头</td></tr>
<tr><td>栈：单向链表，栈顶在表尾（有 tail）</td><td>O(1)</td><td>O(n)</td><td>删尾要先找到前驱</td></tr>
<tr><td>队列：数组 forward</td><td>O(1)</td><td>O(n)</td><td>出队后左移</td></tr>
<tr><td>队列：数组 backward</td><td>O(n)</td><td>O(1)</td><td>入队插到下标 0，右移</td></tr>
<tr><td>队列：数组，head 只前移</td><td>O(1)</td><td>O(1)</td><td>不移位，但前面的空位作废</td></tr>
<tr><td><strong>队列：循环数组</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>head、tail 取模前进</td></tr>
<tr><td><strong>队列：链表 forward（有 tail）</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>表尾进、表头出</td></tr>
<tr><td>队列：单向链表 backward</td><td>O(1)</td><td>O(n)</td><td>表头进、表尾出，删尾要找前驱</td></tr>
</tbody>
</table>
<p>链表的 forward / backward 同样指队头在表头还是表尾。表里数组的“进”默认还有空位；用动态数组时满了就翻倍，“进”是均摊（amortised）O(1)，见 2.6。“找前驱”的 O(n) 只针对单向链表，双向链表（doubly linked list）的结点有 prev 指针，删尾 O(1)。</p>

<h3>链表队列的两个特殊情况</h3>
<p>用带 head、tail 的单向链表写队列，空队列时两者都是 NULL。关键几行：</p>
<pre><code>/* enqueue: nd is the new node, nd-&gt;next == NULL */
if (q-&gt;tail == NULL) q-&gt;head = nd;    /* queue was empty */
else q-&gt;tail-&gt;next = nd;
q-&gt;tail = nd;

/* dequeue: old = q-&gt;head, already checked old != NULL */
q-&gt;head = old-&gt;next;
if (q-&gt;head == NULL) q-&gt;tail = NULL;  /* removed the last node */
free(old);</code></pre>
<ul>
<li><strong>往空队列 enqueue</strong>：tail 是 NULL，不能写 <code>q-&gt;tail-&gt;next</code>；新结点既是队头也是队尾，head 也要指向它。</li>
<li><strong>dequeue 掉最后一个结点</strong>：tail 也要置 NULL，不然它还指着刚 free 的结点，下一次 enqueue 就往已释放的内存里写。</li>
</ul>

<h2>补充：后面哪里用到</h2>
<ul>
<li><strong>DFS 用栈</strong>：递归的 DFSExplore 靠函数调用栈（call stack），最后调用的最先返回；也可以自己维护一个栈（见 7.3）。</li>
<li><strong>BFS 用队列</strong>，一层层访问（见 7.4）；拓扑排序的 source removal、A3 的图搜索也用队列。</li>
<li>优先队列（priority queue）按优先级出队，不是 FIFO（见 6.5）。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择 / 填表</strong>：给一种实现，问进、出各是多少。</li>
<li><strong>手算追踪</strong>：给容量和一串操作，写出循环队列最后的数组、head、tail、count；或者写出栈、队列依次输出什么。</li>
<li><strong>写代码</strong>：循环队列的 enqueue / dequeue（取模、判满、判空），链表队列（两个特殊情况），数组栈的 push / pop。</li>
</ul>
<p>公式表上没有这部分，LIFO / FIFO、操作名和上面的代价表都要自己记。</p>

<h3>例题 1：哪些实现两端都是 O(1)</h3>
<p>多选：数组容量足够时，哪些队列实现的 enqueue 和 dequeue 都是 O(1)？A. 数组，队头固定在下标 0，出队后左移；B. 循环数组；C. 单向链表有 head、tail，表头进、表尾出；D. 单向链表有 head、tail，表尾进、表头出；E. 单向链表只有 head，表尾进、表头出；F. 双向链表有 head、tail，表头进、表尾出。</p>
<p><strong>答案 B、D、F。</strong>逐个看：</p>
<ul>
<li>A：出队要把剩下的 n − 1 个元素左移，O(n)。</li>
<li>B：两个操作都只改一个下标和 count。</li>
<li>C：表尾出队要找前驱，O(n)。</li>
<li>D：靠 tail 在表尾接结点，删表头只改 head。</li>
<li>E：没有 tail，入队要先走到表尾，O(n)。</li>
<li>F：尾结点的 prev 就是前驱，删尾 O(1)。</li>
</ul>

<h3>例题 2：追踪循环队列</h3>
<p>用上面的循环队列代码，cap = 4，从空队列开始依次执行：enqueue 1、2、3，dequeue，enqueue 4、5，dequeue，dequeue，enqueue 6、7、8。(a) 哪次 enqueue 失败？最后 a、head、tail、count 各是多少？(b) 接着连续 dequeue 四次，依次得到什么？(c) 如果代码里没有 count，只用 head == tail 判断“空”，最后的状态会被当成什么？</p>
<p>每一步都按代码走，“·”表示从没写过的格子：</p>
<table>
<thead><tr><th>操作</th><th>a[0..3]</th><th>head</th><th>tail</th><th>count</th></tr></thead>
<tbody>
<tr><td>开始</td><td>· · · ·</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>enqueue 1</td><td>1 · · ·</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>enqueue 2</td><td>1 2 · ·</td><td>0</td><td>2</td><td>2</td></tr>
<tr><td>enqueue 3</td><td>1 2 3 ·</td><td>0</td><td>3</td><td>3</td></tr>
<tr><td>dequeue → 1</td><td>1 2 3 ·</td><td>1</td><td>3</td><td>2</td></tr>
<tr><td>enqueue 4</td><td>1 2 3 4</td><td>1</td><td>0</td><td>3</td></tr>
<tr><td>enqueue 5</td><td>5 2 3 4</td><td>1</td><td>1</td><td>4</td></tr>
<tr><td>dequeue → 2</td><td>5 2 3 4</td><td>2</td><td>1</td><td>3</td></tr>
<tr><td>dequeue → 3</td><td>5 2 3 4</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>enqueue 6</td><td>5 6 3 4</td><td>3</td><td>2</td><td>3</td></tr>
<tr><td>enqueue 7</td><td>5 6 7 4</td><td>3</td><td>3</td><td>4</td></tr>
<tr><td>enqueue 8</td><td>失败：count = 4 = cap</td><td>3</td><td>3</td><td>4</td></tr>
</tbody>
</table>
<p>(a) 只有 enqueue 8 失败。最后 <strong>a = [5, 6, 7, 4]，head = 3，tail = 3，count = 4</strong>。注意 enqueue 4 之后 tail 从 3 绕回 0，所以 5 写进了 a[0]，盖掉已出队的 1。</p>
<p>(b) head 从 3 出发，依次取 a[3]、a[0]、a[1]、a[2]（3 之后绕回 0），得到 <strong>4, 5, 6, 7</strong>，正好是它们入队的顺序。</p>
<p>(c) head == tail == 3，会被当成<strong>空队列</strong>：dequeue 直接报空，队里的 4 个元素再也取不出来。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>“数组队列的 dequeue 是 O(1)”要看做法：队头固定在下标 0 时要左移，是 O(n)。</li>
<li>单向链表有 tail 指针也不能 O(1) 删尾。</li>
<li>用 head == tail 判空判满；<code>tail + 1 % cap</code> 少了括号。</li>
<li>出队不擦数据：追踪题问数组内容时，残留的旧值照样写出来。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>栈后进先出（LIFO），push / pop 都在栈顶；队列先进先出（FIFO），enqueue 在队尾、dequeue 在队头。</li>
<li>栈：数组的栈顶放末尾，链表的栈顶放表头，进出都是 O(1)。</li>
<li>队列：链表表尾进、表头出，有 tail 指针时两端 O(1)；数组用循环数组，head、tail 按 (i + 1) % cap 前进。</li>
<li>循环数组只看 head == tail 分不清满和空，多存一个 count：0 为空，cap 为满。</li>
<li>代价看进、出在哪一端：数组那端要不要移位，单向链表那端要不要找前驱。</li>
<li>DFS 用栈（或调用栈），BFS 用队列。</li>
</ul>
`;
