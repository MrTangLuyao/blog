/* Post body — dsa-c-patterns / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-c-patterns:zh'] = `
<p class="lead">期末约 30% 的分数涉及 C：在纯文本框里写函数，或读一段代码写出输出、找出错误。反复用到的固定写法有七类：链表、BST、AVL 旋转、堆、循环队列与 BFS、字符串、动态内存。</p>

<h2>在纯文本框里写 C</h2>
<p>作答框没有编译器和高亮，阅卷看<strong>语义</strong>（指针、边界、复杂度），不抠分号。往年按准确、完整、效率、规范用法、可读性分项给分：</p>
<ul>
<li>函数前用一行注释写清约定，如“堆存在 H[1..n]”“调用方保证队列未满”。</li>
<li>先处理空表、空树（NULL）、空串。</li>
<li>会改 head 或根的函数返回新指针：<code>head = f(head, x);</code>。C 按值传参，给形参赋值影响不到调用方。</li>
</ul>

<h2>链表：有序插入、删除、释放</h2>
<p>有序插入和按值删除用同一个模板：prev、curr 一前一后往后走，prev 是 curr 的前驱（predecessor）。<strong>走完 prev 仍是 NULL，动的就是第一个结点</strong>，要改 head。</p>
<pre><code>typedef struct node node_t;
struct node { int data; node_t *next; };

node_t *insert_sorted(node_t *head, int x) {  /* 保持升序：找位置 O(n) */
    node_t *new = malloc(sizeof(*new));
    assert(new != NULL);
    new-&gt;data = x;
    node_t *prev = NULL, *curr = head;      /* prev 是 curr 的前驱 */
    while (curr != NULL &amp;&amp; curr-&gt;data &lt; x) { prev = curr; curr = curr-&gt;next; }
    new-&gt;next = curr;                       /* ① 先接后继 */
    if (prev == NULL) head = new;           /* ② 插在最前面 */
    else prev-&gt;next = new;
    return head;
}

node_t *delete_first(node_t *head, int x) {   /* 删第一个 x：O(n) */
    node_t *prev = NULL, *curr = head;
    while (curr != NULL &amp;&amp; curr-&gt;data != x) { prev = curr; curr = curr-&gt;next; }
    if (curr == NULL) return head;          /* 没有 x */
    if (prev == NULL) head = curr-&gt;next;    /* 删第一个结点：改 head */
    else prev-&gt;next = curr-&gt;next;           /* 绕过 curr */
    free(curr);                             /* 指针改完再 free */
    return head;
}

void free_list(node_t *head) {              /* O(n) */
    for (node_t *next; head != NULL; head = next) {
        next = head-&gt;next;                  /* free 之前先存后继 */
        free(head);
    }
}</code></pre>
<p>头插（head insertion）就是 prev == NULL 那一支，O(1)。</p>
<div class="callout warn" data-label="易错">
<ul>
<li><strong>先接后继，再改前驱。</strong>先写 <code>head = new</code> 再写 <code>new-&gt;next = head</code>，整条旧链丢失，new 指向自己。</li>
<li>条件里 <code>curr != NULL</code> 必须写在 &amp;&amp; 前面，否则走到表尾会解引用 NULL。</li>
<li><code>for (p = head; p != NULL; p = p-&gt;next) free(p);</code> 在 free 之后又读 <code>p-&gt;next</code>，是未定义行为（undefined behaviour）；只绕过结点而不 free，则是内存泄漏（memory leak）。</li>
</ul>
</div>

<h2>BST：插入、查找、高度、中序</h2>
<p>树上的函数都是一个形状：先处理 NULL，再递归左右子树。插入和查找每层只走一边，代价 O(h)：平衡时 h ≈ log₂ n，按升序插入退化成链时 h = n，所以<strong>任意 BST 的查找最坏 O(n)</strong>。</p>
<pre><code>typedef struct node node_t;
struct node { int key; node_t *left, *right; };

node_t *bst_insert(node_t *t, int key) {        /* O(h) */
    if (t == NULL) {                            /* 空位：挂一个新叶子 */
        t = malloc(sizeof(*t));
        assert(t != NULL);
        t-&gt;key = key;
        t-&gt;left = t-&gt;right = NULL;
    } else if (key &lt; t-&gt;key) t-&gt;left = bst_insert(t-&gt;left, key);   /* 接回去 */
    else if (key &gt; t-&gt;key) t-&gt;right = bst_insert(t-&gt;right, key);
    return t;                                   /* 键已存在：不插 */
}

node_t *bst_find(node_t *t, int key) {          /* O(h) */
    while (t != NULL &amp;&amp; key != t-&gt;key)
        t = (key &lt; t-&gt;key) ? t-&gt;left : t-&gt;right;
    return t;                                   /* NULL = 不存在 */
}

int height(node_t *t) {                         /* 本课程：NULL 为 0，叶子为 1 */
    if (t == NULL) return 0;
    int hl = height(t-&gt;left), hr = height(t-&gt;right);
    return 1 + (hl &gt; hr ? hl : hr);
}

void inorder(node_t *t) {                       /* BST 的中序输出升序 */
    if (t == NULL) return;
    inorder(t-&gt;left); printf("%d ", t-&gt;key); inorder(t-&gt;right);  /* 左、根、右 */
}</code></pre>
<p>课上的输入 32, 14, 53, 9, 28, 42, 64, 50：中序输出 9 14 28 32 42 50 53 64，height 为 4；再插入 17，它成为 28 的左孩子。</p>
<ul>
<li><strong>递归结果必须接回。</strong>只写 <code>bst_insert(t-&gt;left, key);</code>，t-&gt;left 原为 NULL 时新结点挂不上树，还泄漏。</li>
<li><strong>本课程 height(NULL) = 0、叶子 = 1</strong>，不是有些教材的 −1 和 0。</li>
<li>释放整棵树用后序：<code>free_tree(t-&gt;left); free_tree(t-&gt;right); free(t);</code>。先 free 根，就拿不到孩子了。</li>
</ul>

<h2>AVL：rotate_right 与 rotate_left</h2>
<p>AVL 结点多存一个 height。旋转共改三个指针，O(1)：函数里改两个，第三个（父结点指向这棵子树的指针）由调用方改。</p>
<pre><code>typedef struct avl avl_t;
struct avl { int key, height; avl_t *left, *right; };  /* 叶子 height = 1 */
/* fix(t)：t-&gt;height = 1 + 两个孩子高度的较大者，NULL 的高度记 0 */

avl_t *rotate_right(avl_t *top) {        /* 修 LL：左孩子上来 */
    avl_t *up = top-&gt;left;
    top-&gt;left = up-&gt;right;               /* 中间子树改挂到 top 下 */
    up-&gt;right = top;
    fix(top); fix(up);                   /* 先算降下去的 top */
    return up;                           /* 新子树根，由调用方接回 */
}

avl_t *rotate_left(avl_t *top) {         /* 修 RR：镜像 */
    avl_t *up = top-&gt;right;
    top-&gt;right = up-&gt;left;
    up-&gt;left = top;
    fix(top); fix(up);
    return up;
}</code></pre>
<p>调用写 <code>root = rotate_left(root);</code> 或 <code>p-&gt;left = rotate_right(p-&gt;left);</code>，不接回的话父结点仍指向降下去的 top。LR 先 <code>t-&gt;left = rotate_left(t-&gt;left);</code> 再 <code>t = rotate_right(t);</code>，RL 对称。<strong>先 fix(top) 再 fix(up)</strong>，因为 up 的高度要用到 top 的新高度。</p>
<p>2015 年考过用祖父 g、父 p、子 c 三个指针写左旋（p 是 g 的右孩子，c 是 p 的右孩子）：</p>
<pre><code>g-&gt;right = c;          /* 1. c 顶替 p 的位置 */
p-&gt;right = c-&gt;left;    /* 2. c 的左子树交给 p */
c-&gt;left = p;           /* 3. p 降为 c 的左孩子 */</code></pre>
<p>第 2、3 句不能对调：先做 3，第 2 句就成了 <code>p-&gt;right = p</code>，c 原来的左子树丢失。</p>

<h2>堆：siftup 与 siftdown（下标从 1 开始）</h2>
<p>课程的堆从 H[1] 存起，H[0] 不用：<strong>父结点 i/2，孩子 2i、2i+1</strong>。从 H[0] 存起时是 (i−1)/2、2i+1、2i+2，两套公式混用是常见错误。</p>
<pre><code>/* 最大堆存在 H[1..n]，H[0] 不用 */
void swap(int H[], int a, int b) { int t = H[a]; H[a] = H[b]; H[b] = t; }

void siftup(int H[], int i) {                     /* O(log n) */
    for (; i &gt; 1 &amp;&amp; H[i / 2] &lt; H[i]; i = i / 2)   /* 父结点更小：交换 */
        swap(H, i, i / 2);
}

void siftdown(int H[], int n, int i) {            /* O(log n) */
    while (2 * i &lt;= n) {                          /* 至少有左孩子 */
        int c = 2 * i;
        if (c + 1 &lt;= n &amp;&amp; H[c + 1] &gt; H[c]) c++;   /* 右孩子存在且更大 */
        if (H[i] &gt;= H[c]) break;                  /* 不小于较大的孩子：停 */
        swap(H, i, c);
        i = c;
    }
}
/* 插入:   H[++*n] = x;  siftup(H, *n);
   删最大: swap(H, 1, *n);  (*n)--;  siftdown(H, *n, 1);
   建堆:   for (i = n / 2; i &gt;= 1; i--) siftdown(H, n, i);   共 O(n) */</code></pre>
<p>检验：课上的堆 27 24 26 7 12 6 19 2 7 7 插入 25 得 27 25 26 7 24 6 19 2 7 7 12；原堆删除最大值得 26 24 19 7 12 6 7 2 7，27 留在 H[10]，但已不属于堆。siftdown 要和<strong>较大的孩子</strong>交换，且先确认右孩子存在，漏掉 <code>c + 1 &lt;= n</code> 的后果见练习 2。</p>

<h2>循环队列与邻接矩阵上的 BFS</h2>
<p>数组队列在 head 处出队、tail 处入队，下标到末尾用 % 绕回 0，两个操作都是 O(1)。<strong>队空和队满时都有 head == tail</strong>，所以另存 count。BFS <strong>入队即标记</strong>；邻接矩阵上找邻居要扫一整行，共 <strong>O(V²)</strong>，按下标扫恰好是字母顺序。例图取课上的 A–B、A–C、A–D、B–C、B–E、C–E、D–F：</p>
<pre><code>#include &lt;stdio.h&gt;
#define MAXV 26                       /* 顶点 0..25 对应 A..Z */

typedef struct {
    int a[MAXV];
    int head, tail, count;            /* 队首、下一个入队位置、元素个数 */
} queue_t;

void enqueue(queue_t *q, int x) {     /* O(1)，调用方保证未满 */
    q-&gt;a[q-&gt;tail] = x;
    q-&gt;tail = (q-&gt;tail + 1) % MAXV;   /* 到末尾就绕回 0 */
    q-&gt;count++;
}

int dequeue(queue_t *q) {             /* O(1)，调用方保证非空 */
    int x = q-&gt;a[q-&gt;head];
    q-&gt;head = (q-&gt;head + 1) % MAXV;
    q-&gt;count--;
    return x;
}

/* 从 s 出发 BFS，按访问顺序打印。邻接矩阵：O(V²) */
void bfs(int adj[][MAXV], int nv, int s) {
    int mark[MAXV] = {0};             /* 1 = 已入过队 */
    queue_t q = {{0}, 0, 0, 0};
    mark[s] = 1;                      /* 入队即标记 */
    enqueue(&amp;q, s);
    while (q.count &gt; 0) {
        int u = dequeue(&amp;q);
        printf("%c ", 'A' + u);       /* 访问 u */
        for (int w = 0; w &lt; nv; w++)          /* 扫第 u 行：O(V) */
            if (adj[u][w] &amp;&amp; !mark[w]) {
                mark[w] = 1;
                enqueue(&amp;q, w);
            }
    }
    printf("\\n");
}

int main(void) {
    static int adj[MAXV][MAXV];       /* static：初值全 0 */
    int e[][2] = {{0,1}, {0,2}, {0,3}, {1,2}, {1,4}, {2,4}, {3,5}};
    for (int i = 0; i &lt; 7; i++)       /* 无向边：两个方向都置 1 */
        adj[e[i][0]][e[i][1]] = adj[e[i][1]][e[i][0]] = 1;
    bfs(adj, 6, 0);                   /* A B C D E F */
    bfs(adj, 6, 4);                   /* E B C A D F */
    return 0;
}</code></pre>
<p>每个顶点只入队一次，容量 V 就够。若改成出队时才标记，从 A 出发时 C、E 各入队两次（共 8 次而不是 6 次）；在 5 个顶点的完全图上，同时排队的元素最多有 7 个，按 V 开的队列会溢出。</p>

<h2>字符串：忽略标点和大小写的回文</h2>
<p>2015 年期末的 13 分题：判断一行文字是否回文，忽略空格、数字、标点和大小写，如 A man, a plan, a canal, Panama!。两个下标从两端向中间走，跳过非字母，比较小写形式：</p>
<pre><code>/* 只比较字母、不分大小写；是回文返回 1，否则 0。O(n) 时间，O(1) 额外空间 */
int checkpalindrome(const char *s) {
    int i = 0, j = (int)strlen(s) - 1;
    while (i &lt; j) {
        unsigned char a = s[i], b = s[j];    /* ctype 函数要求 unsigned char 范围 */
        if (!isalpha(a)) i++;                /* 左边不是字母：跳过 */
        else if (!isalpha(b)) j--;           /* 右边不是字母：跳过 */
        else if (tolower(a) != tolower(b)) return 0;
        else { i++; j--; }                   /* 这一对相同：两端向中间收 */
    }
    return 1;
}</code></pre>
<ul>
<li>isalpha、tolower 的参数必须在 unsigned char 范围内（或为 EOF），而 char 可能是负数，所以先转换。</li>
<li>fgets 留在行末的 <code>'\\n'</code> 不是字母，会被自动跳过；没有字母的串（空串、全是标点）返回 1。</li>
</ul>

<h2>字符串数组：每一格都指向同一个 buffer</h2>
<p>2015 年的读代码题：逐行读入单词存进数组，读完再逐个打印单词和长度。出错的是这几行（简化版）：</p>
<pre><code>char buffer[MAXLEN];  char *words[100];  int n = 0;
while (n &lt; 100 &amp;&amp; fgets(buffer, MAXLEN, stdin) != NULL) {
    buffer[strcspn(buffer, "\\n")] = '\\0';    /* 去掉行末换行 */
    words[n++] = buffer;                     /* 错：每格存的都是 buffer 的地址 */
}</code></pre>
<p>输入 red、green、blue 三行，打印出三行 <code>blue 4</code>：<code>words[n++] = buffer</code> 复制的是地址，三格都指向同一个 buffer，而它每读一行就被覆盖一次。修正是每行 malloc 一块新内存，复制<strong>内容</strong>：</p>
<pre><code>    words[n] = malloc(strlen(buffer) + 1);   /* 每行一块新内存，+1 给 '\\0' */
    assert(words[n] != NULL);
    strcpy(words[n], buffer);                /* 复制内容，而不是地址 */
    n++;
for (int i = 0; i &lt; n; i++) free(words[i]);  /* 打印完：malloc 几次就 free 几次 */</code></pre>
<p>前四行替换 <code>words[n++] = buffer;</code>，输出变为 red 3、green 5、blue 4。C99 标准库没有 strdup，要自己写 malloc + strcpy。</p>

<h2>malloc / realloc / free 清单</h2>
<table>
<thead><tr><th>规则</th><th>写法</th><th>违反的后果</th></tr></thead>
<tbody>
<tr><td>检查返回值</td><td><code>p = malloc(…); assert(p != NULL);</code></td><td>内存不足时解引用 NULL</td></tr>
<tr><td>字节数 = 个数 × 元素大小</td><td><code>malloc(n * sizeof(*p))</code></td><td>只写 n 就只分到 n 个字节</td></tr>
<tr><td>字符串多留 1 字节</td><td><code>malloc(strlen(s) + 1)</code></td><td><code>'\\0'</code> 写到块外</td></tr>
<tr><td>realloc 先接到临时变量</td><td><code>tmp = realloc(p, m * sizeof(*p)); if (tmp != NULL) p = tmp;</code></td><td>失败返回 NULL，原块地址被覆盖而泄漏；成功时块可能搬走，指向旧块的指针全部作废</td></tr>
<tr><td>malloc 几次 free 几次，先内后外</td><td>先 free 每个 <code>words[i]</code>，再 free 外层数组</td><td>先 free 外层就找不到内层</td></tr>
<tr><td>去掉行末换行</td><td><code>s[strcspn(s, "\\n")] = '\\0';</code></td><td><code>s[strlen(s) - 1] = '\\0'</code> 在最后一行没有换行时删掉真字符</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
<li><strong>写函数</strong>：给出结构体和原型，写链表、树、堆或字符串函数，要求注释，常顺带问复杂度。2015 年是回文判断；2016 年是素数判断（试除到 i * i ≤ n 即可）、只计素数的连续子数组最大和，再加一个 malloc、使用、free 齐全的 main。今年的长题偏应用：给一个场景，设计数据结构和算法并写出代码，课上指定的样板是 Week 11 workshop 第 6 题。</li>
<li><strong>读代码</strong>：写出输出，找错并修改，说明函数做什么、复杂度多少。</li>
<li><strong>选择、填空里的代码</strong>：两句能否交换，旋转后某个指针指向谁，堆或循环队列执行几步后数组的内容。</li>
</ul>
<p>公式表上没有代码。要记住：堆的下标公式（从 1 开始）、<strong>height(NULL) = 0</strong>、旋转的三句及其顺序、<strong>BFS 入队即标记</strong>、循环队列的 % 和 count。</p>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 把上面的循环队列改成 4 个槽位（% 4），初始 head = tail = count = 0，数组全 0。依次执行：enqueue 1、2、3，dequeue 两次，enqueue 4、5、6，再 dequeue 一次。写出每次 dequeue 的返回值，以及最后的 a[0..3]、head、tail、count。</summary>
<div class="qa__body">
<table>
<thead><tr><th>操作</th><th>a[0..3]</th><th>head</th><th>tail</th><th>count</th></tr></thead>
<tbody>
<tr><td>enqueue 1、2、3</td><td>1 2 3 0</td><td>0</td><td>3</td><td>3</td></tr>
<tr><td>dequeue → 1</td><td>1 2 3 0</td><td>1</td><td>3</td><td>2</td></tr>
<tr><td>dequeue → 2</td><td>1 2 3 0</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>enqueue 4</td><td>1 2 3 4</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>enqueue 5</td><td>5 2 3 4</td><td>2</td><td>1</td><td>3</td></tr>
<tr><td>enqueue 6</td><td>5 6 3 4</td><td>2</td><td>2</td><td>4</td></tr>
<tr><td>dequeue → 3</td><td>5 6 3 4</td><td>3</td><td>2</td><td>3</td></tr>
</tbody>
</table>
<p>dequeue 依次返回 <strong>1、2、3</strong>；最后 <strong>a = 5 6 3 4，head = 3，tail = 2，count = 3</strong>，队列从头到尾是 4、5、6。enqueue 4 时 tail 从 3 绕回 0。dequeue 不清空槽位，a[2] 里的 3 还在，但已出队。enqueue 6 之后 head == tail，与空队列相同，只能靠 count = 4 判断已满。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 有人把 siftdown 里的 <code>if (c + 1 &lt;= n &amp;&amp; H[c + 1] &gt; H[c]) c++;</code> 写成 <code>if (H[c + 1] &gt; H[c]) c++;</code>。对最大堆 H[1..5] = 10 9 3 8 7 删除最大值（swap(H, 1, 5)，n 变为 4，再 siftdown(H, 4, 1)），正确版本和错误版本各得到什么？</summary>
<div class="qa__body">
<p>交换并缩小后数组是 7 9 3 8 | 10，竖线后的 10 已不属于堆。</p>
<p><strong>正确版本</strong>：i = 1，孩子 9 和 3，与较大的 9 交换 → 9 7 3 8；i = 2，右孩子下标 5 &gt; n 不存在，只和左孩子 8 比，7 &lt; 8，交换 → 9 8 3 7；i = 4 没有孩子，停。结果 <strong>9 8 3 7</strong>。</p>
<p><strong>错误版本</strong>：i = 1 时相同。i = 2 时读到 H[5]，也就是刚删掉的 10，10 &gt; 8，于是 c = 5；7 &lt; 10，交换 → 9 10 3 8 | 7；i = 5，2 × 5 &gt; 4，停。堆的部分是 <strong>9 10 3 8</strong>：删掉的 10 回到了堆里，还排在 9 下面，违反堆条件，而 7 被换到了堆外。</p>
<p>堆末尾之后的格子放着删掉的旧元素。最后一个父结点只有左孩子（n 为偶数）时，少了 <code>c + 1 &lt;= n</code> 就会读到它。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. 结点为 struct node { int key; node_t *left, *right; }，键互不相同。写函数判断一棵二叉树是否为 BST，并给出复杂度。为什么只检查“左孩子 &lt; 自己 &lt; 右孩子”不够？</summary>
<div class="qa__body">
<p>反例：根 5，左孩子 3，3 的右孩子 8。每个结点和自己的孩子比都满足条件，但 8 在 5 的左子树里却比 5 大。BST 的条件约束整棵子树，不只是孩子。</p>
<p>可靠的判据是“中序遍历严格递增”：遍历时记住上一个访问的结点，每访问一个结点就和它比较。</p>
<pre><code>/* 中序遍历，检查键严格递增；*prev 是上一个访问到的结点。
   调用：const node_t *prev = NULL;  is_bst(root, &amp;prev);  */
int is_bst(const node_t *t, const node_t **prev) {
    if (t == NULL) return 1;
    if (!is_bst(t-&gt;left, prev)) return 0;                     /* 左子树 */
    if (*prev != NULL &amp;&amp; (*prev)-&gt;key &gt;= t-&gt;key) return 0;    /* 根 */
    *prev = t;
    return is_bst(t-&gt;right, prev);                            /* 右子树 */
}</code></pre>
<p>prev 要在所有递归调用之间共享并修改，所以传它的地址（指向指针的指针）。反例的中序是 3, 8, 5，访问 5 时上一个是 8 ≥ 5，返回 0；课上那棵 32, 14, 53, 9, 28, 42, 64, 50 的树返回 1。每个结点访问一次，<strong>O(n) 时间</strong>，递归栈 O(h)。</p>
</div>
</details>
`;
