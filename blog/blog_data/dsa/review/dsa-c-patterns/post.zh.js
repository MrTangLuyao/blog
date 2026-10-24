/* Post body — dsa-c-patterns / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-c-patterns:zh'] = `
<p class="lead">期末大约 30% 的分数要读或写 C：在纯文本框里写函数，或者读一段代码，写出输出、找出错误。反复考的是七类固定写法：链表、BST、AVL 旋转、堆、循环队列和 BFS、字符串处理、动态内存。每类都有一份标准写法和几个固定的坑。</p>

<h2>在纯文本框里写 C</h2>
<p>考场的作答框就是一个空白文本框：没有编译器，没有语法高亮，也不能运行。所以阅卷看的是<strong>语义</strong>：指针接得对不对、边界有没有漏、复杂度好不好。少一个分号不扣分。</p>
<p>往年按五项给分：准确、完整、效率、规范用法、可读性。三个习惯能把“完整”和“可读性”的分拿稳：</p>
<ul>
<li><strong>函数前写一行注释，说清约定。</strong>比如“堆存在 H[1..n]”“调用方保证队列未满”。同一个函数往往有几种合理写法，写明你选了哪种，阅卷才会按你的约定判对错。</li>
<li><strong>先处理空的情况：</strong>空表、空树（NULL）、空串。对 NULL 解引用程序直接崩，这也是“完整”最常被扣分的地方。</li>
<li><strong>会改 head 或根的函数，把新指针返回出来</strong>，调用时写 <code>head = f(head, x);</code>。为什么不在函数里直接给 head 赋值？C 按值传参（pass by value），函数拿到的只是 head 的一份拷贝，改拷贝影响不到调用方手里那个。</li>
</ul>

<h2>链表：有序插入、删除、释放</h2>
<p>有序插入和按值删除是同一个模板：两个指针 prev、curr 一前一后往后走，prev 始终指着 curr 前面那个结点，也就是它的前驱（predecessor）。</p>
<p>为什么要多带一个 prev？单链表只能往后走。等 curr 找到位置时已经回不了头，而真正要改的，是前一个结点的 next。</p>
<pre><code>typedef struct node node_t;
struct node { int data; node_t *next; };

/* 保持升序插入 x，返回新的 head。O(n) */
node_t *insert_sorted(node_t *head, int x) {
    node_t *new = malloc(sizeof(*new));
    assert(new != NULL);
    new-&gt;data = x;
    node_t *prev = NULL, *curr = head;     /* prev 是 curr 的前驱 */
    while (curr != NULL &amp;&amp; curr-&gt;data &lt; x) {
        prev = curr;
        curr = curr-&gt;next;
    }
    new-&gt;next = curr;                      /* ① 先接后继 */
    if (prev == NULL) head = new;          /* ② 插在最前面：改 head */
    else prev-&gt;next = new;
    return head;
}</code></pre>
<ul>
<li><strong>while 循环</strong>：curr 还没走到表尾、而且 curr 的值比 x 小，两个指针就一起往后挪一格。停下时，x 该插在 prev 和 curr 之间。</li>
<li><strong><code>new-&gt;next = curr</code></strong>：先把新结点接到后继上。</li>
<li><strong><code>prev == NULL</code></strong>：循环一次都没走，说明 x 比第一个结点还小（或者表是空的），新结点成为第一个结点，所以改 head；否则让 prev 指向它。</li>
</ul>
<p>找位置要走一遍，O(n)。头插（head insertion）就是 <code>prev == NULL</code> 这一支，不用找位置，O(1)。</p>
<pre><code>/* 删除第一个值为 x 的结点，返回新的 head。O(n) */
node_t *delete_first(node_t *head, int x) {
    node_t *prev = NULL, *curr = head;
    while (curr != NULL &amp;&amp; curr-&gt;data != x) {
        prev = curr;
        curr = curr-&gt;next;
    }
    if (curr == NULL) return head;         /* 没有 x：不变 */
    if (prev == NULL) head = curr-&gt;next;   /* 删第一个结点：改 head */
    else prev-&gt;next = curr-&gt;next;          /* 让前驱绕过 curr */
    free(curr);                            /* 指针都改完再 free */
    return head;
}

void free_list(node_t *head) {             /* O(n) */
    node_t *next;
    while (head != NULL) {
        next = head-&gt;next;                 /* free 之前先存后继 */
        free(head);
        head = next;
    }
}</code></pre>
<p>删除同样分两种：<code>prev == NULL</code> 说明删的是第一个结点，改 head；否则让 prev 跳过 curr。<code>free</code> 总放在最后：一块内存 free 之后就不归你了，不能再读它的 next，所以 free_list 要先把后继存进 <code>next</code>。</p>
<div class="callout warn" data-label="易错">
<ul>
<li><strong>先接后继，再改前驱。</strong>头插时如果先写 <code>head = new</code>，旧 head 的地址就被覆盖了；接着写 <code>new-&gt;next = head</code>，new 指向的是自己，整条旧链再也找不到。</li>
<li><strong><code>curr != NULL</code> 必须写在 &amp;&amp; 左边。</strong>&amp;&amp; 是短路求值（short-circuit）：左边为假就不看右边。反过来写，走到表尾时会先去读 <code>NULL-&gt;data</code>。</li>
<li><strong><code>for (p = head; p != NULL; p = p-&gt;next) free(p);</code> 是错的。</strong>每轮 free(p) 之后又执行 <code>p = p-&gt;next</code>，读的是已释放的内存，属于未定义行为（undefined behaviour）：可能看起来能跑，但没有任何保证。反过来，删除时只绕过结点而不 free，就是内存泄漏（memory leak）。</li>
</ul>
</div>

<h2>BST：插入、查找、高度、中序</h2>
<p>二叉搜索树（binary search tree，BST）上的函数几乎一个样：先处理 NULL，再对左右子树递归。为什么总是先管 NULL？递归一定会走到空子树，NULL 就是递归的终点（base case）。</p>
<pre><code>typedef struct node node_t;
struct node { int key; node_t *left, *right; };

node_t *bst_insert(node_t *t, int key) {        /* O(h) */
    if (t == NULL) {                            /* 空位：挂一个新叶子 */
        t = malloc(sizeof(*t));
        assert(t != NULL);
        t-&gt;key = key;
        t-&gt;left = t-&gt;right = NULL;
    } else if (key &lt; t-&gt;key) {
        t-&gt;left = bst_insert(t-&gt;left, key);     /* 结果接回去 */
    } else if (key &gt; t-&gt;key) {
        t-&gt;right = bst_insert(t-&gt;right, key);
    }
    return t;                                   /* 键已存在：不插 */
}

node_t *bst_find(node_t *t, int key) {          /* O(h) */
    while (t != NULL &amp;&amp; key != t-&gt;key)
        t = (key &lt; t-&gt;key) ? t-&gt;left : t-&gt;right;
    return t;                                   /* NULL = 不存在 */
}</code></pre>
<p>bst_insert 走到 NULL 就是找到了空位，malloc 一个新叶子返回；否则按大小往一边递归，并把返回值<strong>接回</strong> <code>t-&gt;left</code> 或 <code>t-&gt;right</code>。键已存在时两个分支都不进，相当于不插。bst_find 用一个 while 就够：小往左，大往右，相等就停。</p>
<p>两个函数每层只走一边，代价是 O(h)，h 是树高。树平衡时 h ≈ log₂ n；按升序插入时每个新结点都挂在最右边，树退化成一条链，h = n。所以<strong>普通 BST 的查找最坏是 O(n)</strong>。</p>
<pre><code>int height(node_t *t) {                         /* 本课：NULL 为 0，叶子为 1 */
    if (t == NULL) return 0;
    int hl = height(t-&gt;left), hr = height(t-&gt;right);
    return 1 + (hl &gt; hr ? hl : hr);
}

void inorder(node_t *t) {                       /* BST 的中序输出是升序 */
    if (t == NULL) return;
    inorder(t-&gt;left);                           /* 左 */
    printf("%d ", t-&gt;key);                      /* 根 */
    inorder(t-&gt;right);                          /* 右 */
}</code></pre>
<p>height：空树是 0，否则是 1 加上左右子树里较高的那个。inorder 是中序遍历（in-order traversal）：先左子树、再根、再右子树。BST 里左边都比根小、右边都比根大，所以中序输出正好是升序。</p>
<p>课上的例子：依次插入 32, 14, 53, 9, 28, 42, 64, 50。中序输出 9 14 28 32 42 50 53 64；height 为 4，最长的一条是 32 → 53 → 42 → 50。再插入 17：17 &lt; 32 往左，17 &gt; 14 往右，17 &lt; 28 往左，28 的左边是空位，于是 17 成为 28 的左孩子。</p>
<div class="callout warn" data-label="易错">
<ul>
<li><strong>递归结果必须接回。</strong>只写 <code>bst_insert(t-&gt;left, key);</code> 的话，t-&gt;left 原来是 NULL 时，新结点 malloc 出来了，却没有任何指针指向它：没挂上树，还泄漏了。</li>
<li><strong>本课约定 height(NULL) = 0、叶子 = 1</strong>，不是有些教材的 −1 和 0。考试按本课来。</li>
<li><strong>释放整棵树用后序（post-order）</strong>：<code>free_tree(t-&gt;left); free_tree(t-&gt;right); free(t);</code>。先 free 根的话，t-&gt;left、t-&gt;right 就在已释放的内存里，再也不能读。</li>
</ul>
</div>

<h2>AVL：rotate_right 与 rotate_left</h2>
<p>AVL 树的结点比 BST 多存一个 height，用来判断是否失衡；失衡了就靠旋转（rotation）修。一次旋转只改三个指针，所以是 O(1)：函数里改两个，第三个（父结点指向这棵子树的指针）由调用方用返回值改。</p>
<pre><code>typedef struct avl avl_t;
struct avl { int key, height; avl_t *left, *right; };

int ht(avl_t *t) { return t == NULL ? 0 : t-&gt;height; }  /* NULL 记 0 */
void fix(avl_t *t) {                     /* 用两个孩子重算高度 */
    int a = ht(t-&gt;left), b = ht(t-&gt;right);
    t-&gt;height = 1 + (a &gt; b ? a : b);
}

avl_t *rotate_right(avl_t *top) {        /* 修 LL：左孩子升上来 */
    avl_t *up = top-&gt;left;
    top-&gt;left = up-&gt;right;               /* 中间子树改挂到 top 下 */
    up-&gt;right = top;                     /* top 降为 up 的右孩子 */
    fix(top); fix(up);                   /* 先算降下去的 top */
    return up;                           /* 新子树根，由调用方接回 */
}

avl_t *rotate_left(avl_t *top) {         /* 修 RR：左右对调的镜像 */
    avl_t *up = top-&gt;right;
    top-&gt;right = up-&gt;left;
    up-&gt;left = top;
    fix(top); fix(up);
    return up;
}</code></pre>
<p>拿 rotate_right 看（LL 情形：左孩子的左边太高）。左孩子 up 升上来当新根，top 降为 up 的右孩子。要动脑的只有两处：</p>
<ul>
<li><code>top-&gt;left = up-&gt;right</code>：up 原来的右子树里，键都比 up 大、比 top 小。top 的左指针正好空出来，挂过去仍然符合 BST 的大小顺序。</li>
<li><strong>先 fix(top) 再 fix(up)</strong>：top 现在在 up 下面，up 的高度要用 top 的新高度算。顺序反了，up 用的是 top 的旧高度。</li>
</ul>
<p>调用时一定要接回：<code>root = rotate_left(root);</code> 或 <code>p-&gt;left = rotate_right(p-&gt;left);</code>。不接回，父结点还指着已经降下去的 top，旋转等于白做。两种“拐弯”的情形各转两次：LR 先 <code>t-&gt;left = rotate_left(t-&gt;left);</code> 再 <code>t = rotate_right(t);</code>，RL 对称。</p>
<p>2015 年考过另一种写法：给祖父 g、父 p、子 c 三个指针（p 是 g 的右孩子，c 是 p 的右孩子），在 p 处左旋：</p>
<pre><code>g-&gt;right = c;          /* 1. c 顶替 p 的位置 */
p-&gt;right = c-&gt;left;    /* 2. c 的左子树交给 p */
c-&gt;left = p;           /* 3. p 降为 c 的左孩子 */</code></pre>
<p>第 2、3 句不能对调。为什么？先做第 3 句，c-&gt;left 已经变成 p，第 2 句就成了 <code>p-&gt;right = p</code>，c 原来的左子树没有任何指针指着，丢了。道理和链表一样：<strong>一个指针要被覆盖之前，先把它里面的东西挪走</strong>。</p>

<h2>堆：siftup 与 siftdown（下标从 1 开始）</h2>
<p>堆（heap）用数组存一棵完全二叉树。本课从 H[1] 开始存，H[0] 不用，这样下标公式最干净：</p>
<table>
<thead><tr><th></th><th>从 H[1] 存（本课）</th><th>从 H[0] 存</th></tr></thead>
<tbody>
<tr><td>父结点</td><td>i/2</td><td>(i−1)/2</td></tr>
<tr><td>左孩子</td><td>2i</td><td>2i+1</td></tr>
<tr><td>右孩子</td><td>2i+1</td><td>2i+2</td></tr>
</tbody>
</table>
<p>两套公式混着用是最常见的错。写堆的代码时，函数前注释一句“堆存在 H[1..n]”。</p>
<p>最大堆（max-heap）只要求一条：每个父结点不小于它的孩子。两个基本操作都是把一个放错位置的元素挪回去：上滤（sift up）是比父结点大就和父结点交换，一路往上，插入时用；下滤（sift down）是比孩子小就和<strong>较大的孩子</strong>交换，一路往下，删除最大值和建堆时用。</p>
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
<ul>
<li><code>2 * i &lt;= n</code> 表示 i 至少有左孩子；<code>c</code> 先取左孩子，<code>c + 1 &lt;= n</code> 确认右孩子存在后，再看它是不是更大。</li>
<li>为什么换较大的孩子？换上来的元素要当另一个孩子的父结点，只有较大的那个才不小于另一个。换了较小的，马上又违反堆条件。</li>
<li>树高约 log₂ n，每层常数次比较，所以都是 O(log n)。建堆从最后一个父结点 n/2 倒着逐个下滤，总共 O(n)：大部分结点在底层，下滤走不了几步。</li>
</ul>
<p>课上的最大堆是 27 24 26 7 12 6 19 2 7 7（H[1..10]）。</p>
<ul>
<li><strong>插入 25</strong>：放进 H[11]。父结点 H[5] = 12 更小，交换；到了 H[5]，父结点 H[2] = 24 还是更小，再交换；到了 H[2]，父结点 H[1] = 27 更大，停。结果 27 25 26 7 24 6 19 2 7 7 12。</li>
<li><strong>对原堆删除最大值</strong>：H[1] 和 H[10] 交换，n 变为 9，根成了 7。孩子 24、26 里 26 较大，交换；到 H[3]，孩子 6、19，和 19 交换；到 H[7] 没有孩子，停。结果 26 24 19 7 12 6 7 2 7。换下去的 27 还在 H[10]，但已经不属于堆。</li>
</ul>
<h3>漏掉 c + 1 &lt;= n 会怎样</h3>
<p>删除之后，数组里堆末尾后面的格子放着删掉的旧元素。最后一个父结点只有左孩子时（n 是偶数），不检查右孩子是否存在，就会把这个旧元素当成右孩子。</p>
<p>例子：最大堆 H[1..5] = 10 9 3 8 7，删除最大值。swap(H, 1, 5)、n 变为 4，数组是 7 9 3 8 | 10（竖线后面不属于堆），再 siftdown(H, 4, 1)。</p>
<ul>
<li><strong>正确版本</strong>：i = 1，孩子 9 和 3，和较大的 9 交换 → 9 7 3 8；i = 2，右孩子下标 5 &gt; n，不存在，只和左孩子 8 比，7 &lt; 8，交换 → 9 8 3 7；i = 4 没有孩子，停。结果 <strong>9 8 3 7</strong>。</li>
<li><strong>写成 <code>if (H[c + 1] &gt; H[c]) c++;</code></strong>：i = 1 时一样。i = 2 时读到 H[5]，也就是刚删掉的 10，10 &gt; 8，于是选了它；7 &lt; 10，交换 → 9 10 3 8 | 7。堆的部分成了 <strong>9 10 3 8</strong>：删掉的 10 回到了堆里，还排在 9 下面，而 7 被换到了堆外。</li>
</ul>

<h2>循环队列与邻接矩阵上的 BFS</h2>
<p>BFS 要用队列，考试常让你自己用数组实现，也就是循环队列（circular queue）。想象一圈座位：head 指着排在最前面的人，tail 指着下一个空座。出队从 head 拿，入队放到 tail，两个下标都只往前走，走到数组末尾就用 % 绕回 0。这样前面空出来的位置能重复用，入队、出队都是 O(1)。</p>
<pre><code>#define MAXV 26                       /* 顶点 0..25 对应 A..Z */

typedef struct {
    int a[MAXV];
    int head, tail, count;            /* 队首、下一个空位、元素个数 */
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
}</code></pre>
<p>为什么要另存 count？队空时 head == tail；装满时 tail 绕一圈追上 head，也是 head == tail。光看两个下标分不出空和满，所以多记一个元素个数。</p>
<p>看一遍具体过程：把 % MAXV 换成 % 4（4 个槽位），从 head = tail = count = 0、数组全 0 开始：</p>
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
<p>最后队列从头到尾是 4、5、6。enqueue 4 时 tail 从 3 绕回 0；dequeue 不清空槽位，a[2] 里的 3 还在，但已出队；enqueue 6 之后 head == tail，和空队列一样，只能靠 count = 4 知道是满的。</p>
<p>广度优先搜索（breadth-first search，BFS）这里用邻接矩阵（adjacency matrix）存图：<code>adj[u][w]</code> 为 1 表示 u、w 之间有边，无向边两个方向都置 1。</p>
<pre><code>/* 从 s 出发 BFS，按访问顺序打印。邻接矩阵：O(V²) */
void bfs(int adj[][MAXV], int nv, int s) {
    int mark[MAXV] = {0};             /* 1 = 已经入过队 */
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
}</code></pre>
<ul>
<li>每出队一个顶点 u，就访问它，再扫第 u 行，把没标记过的邻居<strong>标记并入队</strong>。</li>
<li>为什么入队时就标记，而不是等出队？标记的意思是“已经排上队了”。等出队才标记，一个顶点在出队之前可能被好几个邻居重复放进队列。</li>
<li>每个顶点出队一次，每次扫一整行 V 格，共 <strong>O(V²)</strong>。按下标从小到大扫，邻居正好按字母顺序入队，这也是考试默认的顺序。</li>
</ul>
<p>课上的例图有 7 条边：A–B、A–C、A–D、B–C、B–E、C–E、D–F。从 A 出发：出队 A，B、C、D 入队；出队 B，邻居里只有 E 没标记，入队；出队 C，邻居全标记过了；出队 D，F 入队；最后出队 E、F。访问顺序 A B C D E F；从 E 出发则是 E B C A D F。</p>
<p>如果改成出队才标记，从 A 出发时 C、E 各入队两次，一共 8 次而不是 6 次。入队即标记保证每个顶点只入队一次，所以容量开 V 就够；改成出队才标记后，在 5 个顶点的完全图上，同时排队的元素最多有 7 个，按 V 开的队列会溢出。</p>

<h2>字符串：忽略标点和大小写的回文</h2>
<p>2015 年期末一道 13 分的题：判断一行文字是不是回文（palindrome），忽略空格、数字、标点和大小写。比如 A man, a plan, a canal, Panama! 只看字母、不分大小写，正读反读一样。</p>
<p>思路像两个人从一行字的两头往中间走：谁脚下不是字母，谁就再走一步；两人都站在字母上，就比较小写形式，不同就不是回文，相同就各走一步。相遇时还没发现不同，就是回文。</p>
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
<li>每轮至少挪一步，每个字符最多看一次，所以是 O(n)；只用了 i、j 两个下标，额外空间 O(1)。</li>
<li>为什么先转成 unsigned char？isalpha、tolower 的参数必须在 unsigned char 范围内（或者是 EOF）。char 可能是有符号的，遇到非 ASCII 字符会是负数，直接传进去是未定义行为。</li>
<li>过滤只用 isalpha。换成 isalnum 会把数字留下，不合题意。</li>
<li>fgets 留在行末的 <code>'\\n'</code> 不是字母，会被自动跳过。一个字母都没有的串（空串、全是标点）从来不会走到 return 0，返回 1。</li>
</ul>

<h2>字符串数组：每一格都指向同一个 buffer</h2>
<p>2015 年的读代码题：逐行读入单词存进数组，读完再逐个打印单词和长度。出问题的是这几行（简化过）：</p>
<pre><code>char buffer[MAXLEN];  char *words[100];  int n = 0;
while (n &lt; 100 &amp;&amp; fgets(buffer, MAXLEN, stdin) != NULL) {
    buffer[strcspn(buffer, "\\n")] = '\\0';    /* 去掉行末换行 */
    words[n++] = buffer;                     /* 错：每格存的都是 buffer 的地址 */
}</code></pre>
<p>输入 red、green、blue 三行，打印出来是三行 <code>blue 4</code>。为什么？<code>words[n++] = buffer</code> 复制的是 buffer 的<strong>地址</strong>，不是里面的字符串。三格存的是同一个地址，都指向同一个 buffer，而它每读一行就被覆盖一次，最后只剩 blue。</p>
<p>改法是每读一行就 malloc 一块新内存，把<strong>内容</strong>复制进去：</p>
<pre><code>    words[n] = malloc(strlen(buffer) + 1);   /* 每行一块新内存，+1 给 '\\0' */
    assert(words[n] != NULL);
    strcpy(words[n], buffer);                /* 复制内容，而不是地址 */
    n++;
for (int i = 0; i &lt; n; i++) free(words[i]);  /* 打印完：malloc 几次就 free 几次 */</code></pre>
<p>前四行替换掉 <code>words[n++] = buffer;</code>，输出变成 red 3、green 5、blue 4。C99 标准库没有 strdup，所以要自己写 malloc + strcpy。</p>

<h2>malloc / realloc / free 清单</h2>
<table>
<thead><tr><th>规则</th><th>写法</th><th>为什么</th></tr></thead>
<tbody>
<tr><td>检查返回值</td><td><code>p = malloc(…); assert(p != NULL);</code></td><td>内存不够时 malloc 返回 NULL，不检查就会解引用 NULL</td></tr>
<tr><td>字节数 = 个数 × 元素大小</td><td><code>malloc(n * sizeof(*p))</code></td><td>malloc 的参数是字节数，只写 n 就只分到 n 个字节，不是 n 个元素</td></tr>
<tr><td>字符串多留 1 字节</td><td><code>malloc(strlen(s) + 1)</code></td><td>strlen 不算结尾的 <code>'\\0'</code>，少这 1 字节，<code>'\\0'</code> 就写到块外</td></tr>
<tr><td>realloc 先接到临时变量</td><td><code>tmp = realloc(p, m * sizeof(*p)); if (tmp != NULL) p = tmp;</code></td><td>失败时返回 NULL，直接 <code>p = realloc(p, …)</code> 会覆盖原块地址，再也 free 不了；成功时块可能搬走，指向旧块的指针全部作废</td></tr>
<tr><td>malloc 几次 free 几次，先内后外</td><td>先 free 每个 <code>words[i]</code>，再 free 外层数组</td><td>先 free 外层，就读不到里面存的那些指针了</td></tr>
<tr><td>去掉行末换行</td><td><code>s[strcspn(s, "\\n")] = '\\0';</code></td><td>写成 <code>s[strlen(s) - 1] = '\\0'</code>，最后一行没有换行时会删掉一个真字符</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
<li><strong>写函数</strong>：给出结构体和原型，写链表、树、堆或字符串函数，要求写注释，常顺带问复杂度。2015 年是回文判断；2016 年是素数判断（试除到 i × i ≤ n 就够）、只计素数的连续子数组最大和，再加一个 malloc、使用、free 齐全的 main。今年的长题偏应用：给一个场景，设计数据结构和算法再写代码，课上指定的样板是第 11 周 workshop 第 6 题。</li>
<li><strong>读代码</strong>：写出输出、找错并改正、说明函数做什么、复杂度多少。上面“同一个 buffer”就是这一类。</li>
<li><strong>选择、填空里的代码</strong>：两句能不能交换、旋转后某个指针指向谁、堆或循环队列执行几步后数组里是什么。</li>
</ul>
<p>公式表上没有代码，这些要背下来：堆的下标公式（从 1 开始）、<strong>height(NULL) = 0</strong>、旋转的三句和顺序、<strong>BFS 入队即标记</strong>、循环队列的 % 和 count。</p>
<h3>例题：判断一棵二叉树是不是 BST</h3>
<p>结点为 <code>struct node { int key; node_t *left, *right; }</code>，键互不相同。写函数判断一棵二叉树是否为 BST，给出复杂度。</p>
<p>最常见的错是只检查“左孩子 &lt; 自己 &lt; 右孩子”。这不够：根 5，左孩子 3，3 的右孩子 8。每个结点和自己的孩子比都没问题，可 8 在 5 的左子树里却比 5 大。BST 的条件管的是<strong>整棵子树</strong>，不只是孩子。</p>
<p>可靠的判据：键互不相同时，一棵二叉树是 BST，当且仅当它的中序遍历严格递增。所以中序走一遍，记住上一个访问的结点，每访问一个结点就和它比：</p>
<pre><code>/* 中序遍历，检查键严格递增；*prev 是上一个访问到的结点。
   调用：const node_t *prev = NULL;  is_bst(root, &amp;prev);  */
int is_bst(const node_t *t, const node_t **prev) {
    if (t == NULL) return 1;
    if (!is_bst(t-&gt;left, prev)) return 0;                     /* 左子树 */
    if (*prev != NULL &amp;&amp; (*prev)-&gt;key &gt;= t-&gt;key) return 0;    /* 根 */
    *prev = t;
    return is_bst(t-&gt;right, prev);                            /* 右子树 */
}</code></pre>
<p>空树算 BST。其余按中序的顺序：先查左子树，再拿根和上一个结点比（上一个的键 ≥ 当前键就返回 0），最后查右子树。prev 为什么是指向指针的指针？它要在所有递归调用之间共享，每层都要改；按值传进去，改的只是拷贝，别的调用看不到。</p>
<p>反例的中序是 3, 8, 5，访问 5 时上一个是 8 ≥ 5，返回 0；课上那棵 32, 14, 53, 9, 28, 42, 64, 50 的树返回 1。每个结点访问一次，<strong>O(n) 时间</strong>，递归栈 O(h)。</p>

<h2>小结</h2>
<ul>
<li>会改 head 或根的函数返回新指针，调用方接回：<code>head = f(head, x)</code>、<code>t-&gt;left = bst_insert(t-&gt;left, key)</code>、<code>root = rotate_left(root)</code>。</li>
<li>改指针时，先把要被覆盖的指针里的东西挪走：链表先接 <code>new-&gt;next</code>，旋转先挪中间子树。free 之前先存好还要用的指针，树用后序释放。</li>
<li>本课约定：height(NULL) = 0、叶子 = 1；堆从 H[1] 存，父 i/2、孩子 2i 和 2i+1；siftdown 换较大的孩子，并先确认 c + 1 ≤ n。</li>
<li>循环队列用 % 绕回，另存 count 区分空和满；BFS 入队即标记，邻接矩阵上 O(V²)。</li>
<li>字符串：malloc 给 <code>'\\0'</code> 多留 1 字节，复制内容（malloc + strcpy）而不是地址，ctype 函数的参数先转 unsigned char。</li>
</ul>
`;
