/* Post body — dsa-stack-queue / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-stack-queue:zh'] = `
<p class="lead">栈（stack）只在一端进出，后进先出；队列（queue）从一端进、另一端出，先进先出。两者都能用数组或链表实现，每个操作是不是 O(1)，取决于把“进”和“出”放在哪一端。用数组实现队列时，要靠循环数组（circular array）才能让两端都是 O(1)。</p>

<h2>栈与队列：同样放进去，取出来不同</h2>
<p>依次放入 3、5、8，再取出一个。<strong>栈取出 8</strong>：最后放进去的最先出来，叫后进先出（Last In First Out, LIFO），课上也说 first in, last out。<strong>队列取出 3</strong>：最先放进去的最先出来，叫先进先出（First In First Out, FIFO），和排队一样。</p>
<table>
<thead><tr><th>ADT</th><th>放入</th><th>取出</th><th>其他操作</th></tr></thead>
<tbody>
<tr><td>栈</td><td>push(x)：放到栈顶（top）</td><td>pop()：取走并返回栈顶</td><td>top() / peek()：只看栈顶不取走；isEmpty()、size()</td></tr>
<tr><td>队列</td><td>enqueue(x)：放到队尾（tail / rear）</td><td>dequeue()：取走并返回队头（head / front）</td><td>isEmpty()（即 size 为 0）、size()</td></tr>
</tbody>
</table>
<p>对空栈 pop、对空队列 dequeue 都是错误（underflow）；容量固定时，满了再放也是错误（overflow）。C 里一般用返回值 0 / 1 报告失败或成功。</p>

<h2>栈：进出都在同一端</h2>
<p>栈只用到一端，选一个 push 和 pop 都便宜的端就行。</p>
<p><strong>数组，栈顶放在末尾。</strong>用 n 记录元素个数，栈顶是 a[n−1]。push 写入 a[n] 再 n 加 1，pop 先 n 减 1 再读 a[n]，其他元素都不动。若把栈顶放在下标 0，每次 push、pop 都要把整段元素右移或左移一格。</p>
<pre><code>typedef struct {
    int a[100];
    int n;              /* number of items; the top is a[n-1] */
} arrstack_t;

void push(arrstack_t *s, int x) { s-&gt;a[s-&gt;n++] = x; }    /* caller checks n &lt; 100 */
int  pop(arrstack_t *s)         { return s-&gt;a[--s-&gt;n]; }  /* caller checks n &gt; 0 */</code></pre>
<p><strong>链表，栈顶放在表头。</strong>push 就是头插（2.4 的 <code>new-&gt;next = head; head = new;</code>），pop 删掉表头结点。栈顶若放在表尾，即使有 tail 指针，pop 也慢：删掉尾结点后，倒数第二个结点的 next 要改成 NULL，而单向链表只能从表头走过去才找得到它。</p>

<h2>队列：两端都要快</h2>
<p>队列的进和出在两端。期末复习按队头放在哪里区分：数组 <strong>forward</strong> 指队头在数组开头，<strong>backward</strong> 指队头在数组末尾；链表的 forward / backward 指队头在表头还是表尾。forward 数组出队后要整体左移，改进办法是用下标 head 记住队头，出队只做 head 加 1，不再移位。代价是 head 前面的位置再也用不上：tail 走到数组末尾就放不下了，哪怕队列里只剩一两个元素。循环数组解决的就是这个问题。链表 forward 必须另有 tail 指针，否则 enqueue 要先从表头走到表尾。</p>
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
<p>表中数组的“进”默认还有空位；数组满时，固定容量只能拒绝，动态数组则把容量翻倍，“进”是均摊（amortised）O(1)，见 2.6。“找前驱”的 O(n) 只针对单向链表，双向链表（doubly linked list）的结点存着 prev 指针，删尾是 O(1)。</p>

<h2>循环数组</h2>
<p>把数组首尾相接看成一个环：下标走到 cap − 1 之后，下一个是 0，写成 <code>i = (i + 1) % cap</code>。队列用 head 记队头元素的下标，tail 记下一个空位的下标，再用 count 记元素个数：</p>
<ul>
<li><strong>enqueue(x)</strong>：<code>a[tail] = x</code>，tail 前进一格（取模），count 加 1。</li>
<li><strong>dequeue()</strong>：取出 <code>a[head]</code>，head 前进一格（取模），count 减 1。取走的值仍留在数组里，以后会被覆盖。</li>
</ul>
<p>例：cap = 5。先 enqueue 10、20、30，再 dequeue 两次，队列只剩 a[2] 里的 30（head = 2，tail = 3）。接着 enqueue 40、50：50 写进 a[4]，tail = (4 + 1) % 5 = 0，<strong>绕回开头</strong>。再 enqueue 60、70，用上了前面空出来的 a[0]、a[1]，队列满。如果 head 只前移，tail 到 5 后 60 就放不下了。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-stack-queue/anims/circular-queue.html" loading="lazy" style="height: 500px;" title="循环数组队列"></iframe>
<p class="anim-caption">用上方按钮切换场景：“循环数组”看 tail、head 绕回开头以及满和空；“不回绕”执行同一串操作，看前面的空位怎样作废。</p>

<h3>满和空怎么区分</h3>
<p>队列满了之后再 dequeue 五次，队列变空，head 也绕了一圈回到 2。两个时刻的状态：</p>
<pre><code class="lang-text">满：a = [60 70 30 40 50]   head = 2   tail = 2   count = 5
空：a = [60 70 30 40 50]   head = 2   tail = 2   count = 0</code></pre>
<p>出队不擦除数据，所以数组和两个下标完全相同：<strong>只看 head == tail 分不清满和空</strong>。下面的代码多存一个 count，count == 0 为空，count == cap 为满。另一种做法是永远留一个空位：(tail + 1) % cap == head 算满，head == tail 只表示空，代价是最多只能存 cap − 1 个元素。有了 count，tail 也可以随时由 (head + count) % cap 算出来。</p>

<pre><code>#include &lt;stdlib.h&gt;

typedef struct {
    int *a;      /* the slots */
    int cap;     /* number of slots */
    int head;    /* index of the front item */
    int tail;    /* index where the next item goes */
    int count;   /* items currently in the queue */
} queue_t;

queue_t *queue_create(int cap) {
    queue_t *q = malloc(sizeof(*q));
    if (q == NULL) return NULL;
    q-&gt;a = malloc(cap * sizeof(int));
    if (q-&gt;a == NULL) { free(q); return NULL; }
    q-&gt;cap = cap;
    q-&gt;head = q-&gt;tail = q-&gt;count = 0;
    return q;
}

int queue_is_empty(const queue_t *q) { return q-&gt;count == 0; }
int queue_is_full(const queue_t *q)  { return q-&gt;count == q-&gt;cap; }

/* add x at the rear; returns 0 if the queue is full */
int enqueue(queue_t *q, int x) {
    if (queue_is_full(q)) return 0;
    q-&gt;a[q-&gt;tail] = x;
    q-&gt;tail = (q-&gt;tail + 1) % q-&gt;cap;   /* wrap around */
    q-&gt;count++;
    return 1;
}

/* remove the front item into *x; returns 0 if the queue is empty */
int dequeue(queue_t *q, int *x) {
    if (queue_is_empty(q)) return 0;
    *x = q-&gt;a[q-&gt;head];
    q-&gt;head = (q-&gt;head + 1) % q-&gt;cap;   /* wrap around */
    q-&gt;count--;
    return 1;
}

void queue_free(queue_t *q) {
    free(q-&gt;a);
    free(q);
}</code></pre>
<p>取模的括号不能省：<code>q-&gt;tail + 1 % q-&gt;cap</code> 里 % 先算，结果就是 tail + 1，下标会越过数组末尾。</p>

<h2>后面哪里用到</h2>
<ul>
<li><strong>DFS 用栈。</strong>递归的 DFSExplore 靠函数调用栈（call stack）：课上的例子里 A 调用 C、C 调用 B、B 调用 D，未结束的调用层层压栈；D 最先返回，再依次回到 B、C、A。也可以自己维护一个栈来写（见 7.3）。</li>
<li><strong>BFS 用队列</strong>，按入队顺序一层层访问（见 7.4）。每个顶点最多入队一次，总共不超过 V 次，所以长度为 V 的数组配上只前移的 head、tail 就够用，不需要回绕。</li>
<li>拓扑排序的 source removal 用队列存放入度为 0 的顶点；A3 的图搜索也用到队列。</li>
<li>优先队列（priority queue）名字里有“队列”，但按优先级出队，不是 FIFO（见 6.5）。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>代价表</strong>：给出一种实现（数组 forward / backward / 循环数组，链表 forward / backward，栈顶在哪一端），问进、出各是多少。先确定进和出分别发生在哪一端，再看那一端在数组里要不要移位、在单向链表里要不要找前驱。</li>
<li><strong>追踪</strong>：给容量和一串操作，写出循环队列最后的数组内容、head、tail、count；或者写出栈、队列的输出序列。</li>
<li><strong>写代码</strong>：循环队列的 enqueue / dequeue（取模、判满、判空），链表队列（空队列时的两个特殊情况），数组栈的 push / pop。</li>
</ul>
<p>公式表上没有这部分，LIFO / FIFO、操作名和上面的代价表都要记住。常见陷阱：</p>
<ul>
<li>说“数组队列的 dequeue 是 O(1)”要看做法：队头固定在下标 0 时要左移，是 O(n)。</li>
<li>单向链表有 tail 指针也不能 O(1) 删尾，缺的是尾结点的前驱。</li>
<li>循环队列里 head == tail 既可能是空也可能是满；<code>tail + 1 % cap</code> 少了括号。</li>
<li>链表队列 dequeue 掉最后一个结点后，tail 必须置为 NULL，否则下一次 enqueue 会写进已经 free 的结点。</li>
<li>出队不擦除数据，追踪题问数组内容时，残留的旧值照样写出来。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 对一个空栈和一个空队列执行同一串操作（“入”对栈是 push、对队列是 enqueue；“出”是 pop / dequeue，并输出取出的值）：入 1，入 2，出，入 3，入 4，出，出，入 5，出，出。两者分别输出什么？</summary>
<div class="qa__body">
<table>
<thead><tr><th>操作</th><th>栈（底 → 顶）</th><th>栈输出</th><th>队列（头 → 尾）</th><th>队列输出</th></tr></thead>
<tbody>
<tr><td>入 1</td><td>1</td><td></td><td>1</td><td></td></tr>
<tr><td>入 2</td><td>1 2</td><td></td><td>1 2</td><td></td></tr>
<tr><td>出</td><td>1</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>入 3</td><td>1 3</td><td></td><td>2 3</td><td></td></tr>
<tr><td>入 4</td><td>1 3 4</td><td></td><td>2 3 4</td><td></td></tr>
<tr><td>出</td><td>1 3</td><td>4</td><td>3 4</td><td>2</td></tr>
<tr><td>出</td><td>1</td><td>3</td><td>4</td><td>3</td></tr>
<tr><td>入 5</td><td>1 5</td><td></td><td>4 5</td><td></td></tr>
<tr><td>出</td><td>1</td><td>5</td><td>5</td><td>4</td></tr>
<tr><td>出</td><td>空</td><td>1</td><td>空</td><td>5</td></tr>
</tbody>
</table>
<p>栈输出 <strong>2 4 3 5 1</strong>，队列输出 <strong>1 2 3 4 5</strong>。不管“入”“出”怎样穿插，队列的输出顺序总是放入的顺序；栈的输出顺序取决于每次“出”发生在什么时候。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 用上面的循环队列代码，cap = 4，从空队列开始依次执行：enqueue 1、2、3，dequeue，enqueue 4、5，dequeue，dequeue，enqueue 6、7、8。(a) 哪次 enqueue 失败？最后 a、head、tail、count 各是多少？(b) 接着连续 dequeue 四次，依次得到什么？(c) 如果代码里没有 count，只用 head == tail 判断“空”，最后的状态会被当成什么？</summary>
<div class="qa__body">
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
<p>(a) 只有 enqueue 8 失败。最后 a = [5, 6, 7, 4]，head = 3，tail = 3，count = 4；a[0] 里已出队的 1 被 5 覆盖。</p>
<p>(b) head 从 3 出发：取 a[3] = 4，head = 0；取 a[0] = 5，head = 1；取 a[1] = 6，head = 2；取 a[2] = 7，head = 3。依次得到 <strong>4, 5, 6, 7</strong>，正好是 4 到 7 的入队顺序。</p>
<p>(c) head == tail == 3，会被当成<strong>空队列</strong>：dequeue 直接报空，队里的 4 个元素再也取不出来。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. (a) 多选：数组容量足够时，下列哪些队列实现的 enqueue 和 dequeue 都是 O(1)？A. 数组，队头固定在下标 0，dequeue 后其余元素左移　B. 循环数组，head、tail 前进时对容量取模　C. 单向链表，有 head、tail 指针，在表头 enqueue、在表尾 dequeue　D. 单向链表，有 head、tail 指针，在表尾 enqueue、在表头 dequeue　E. 单向链表，只有 head 指针，在表尾 enqueue、在表头 dequeue　F. 双向链表，有 head、tail 指针，在表头 enqueue、在表尾 dequeue。(b) 用有 tail 指针的单向链表实现栈、栈顶放在表尾，push 和 pop 各是多少？</summary>
<div class="qa__body">
<p>(a) 选 <strong>B、D、F</strong>。</p>
<ul>
<li>A：dequeue 要把剩下的 n − 1 个元素左移，O(n)。</li>
<li>B：两个操作都只改一个下标和 count。</li>
<li>C：dequeue 删尾结点，要从表头走过去找前驱，O(n)。</li>
<li>D：靠 tail 指针在表尾接结点，删表头只改 head。</li>
<li>E：没有 tail 指针，enqueue 要先走到表尾，O(n)。</li>
<li>F：尾结点的 prev 指针就是前驱，删尾 O(1)。</li>
</ul>
<p>(b) push 接到表尾，用 tail 指针，<strong>O(1)</strong>；pop 删尾结点，要从表头走到倒数第二个结点，<strong>O(n)</strong>。栈顶应放在表头，两者都是 O(1)。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 用带 head、tail 两个指针的单向链表实现 int 队列，结点含 data 和 next。写出 enqueue 和 dequeue，两者都要 O(1)，并指出最容易漏掉的两种情况。</summary>
<div class="qa__body">
<pre><code>typedef struct node {
    int data;
    struct node *next;
} node_t;

typedef struct {
    node_t *head;   /* front: dequeue here */
    node_t *tail;   /* rear: enqueue here */
} lqueue_t;         /* empty queue: head == tail == NULL */

int lq_enqueue(lqueue_t *q, int x) {
    node_t *nd = malloc(sizeof(*nd));
    if (nd == NULL) return 0;
    nd-&gt;data = x;
    nd-&gt;next = NULL;
    if (q-&gt;tail == NULL) q-&gt;head = nd;   /* queue was empty */
    else q-&gt;tail-&gt;next = nd;
    q-&gt;tail = nd;
    return 1;
}

int lq_dequeue(lqueue_t *q, int *x) {
    node_t *old = q-&gt;head;
    if (old == NULL) return 0;            /* queue is empty */
    *x = old-&gt;data;
    q-&gt;head = old-&gt;next;
    if (q-&gt;head == NULL) q-&gt;tail = NULL;  /* removed the last node */
    free(old);
    return 1;
}</code></pre>
<p>容易漏掉的两种情况：</p>
<ul>
<li><strong>往空队列 enqueue</strong>：此时 tail 是 NULL，不能写 <code>q-&gt;tail-&gt;next</code>；新结点同时是队头和队尾，head 也要指向它。</li>
<li><strong>dequeue 掉最后一个结点</strong>：head 变成 NULL 时 tail 也要置为 NULL。否则 tail 仍指向刚 free 的结点，下一次 enqueue 走 else 分支，往已释放的内存写 next，而 head 还是 NULL，新结点丢失。</li>
</ul>
<p>两个函数都只改常数个指针，没有循环，都是 O(1)。</p>
</div>
</details>
`;
