/* Post body — dsa-linked-list / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-linked-list:zh'] = `
<p class="lead">链表（linked list）把每个元素放进一个单独 malloc 出来的结点（node），结点里除了数据，还存着下一个结点的地址。插入和删除只改一两个指针，不搬动任何数据；要小心的只有改指针的先后顺序。</p>

<h2>结点与链表</h2>
<p>课上的例子是按字母序排列的单词 boat、cat、fly。每个结点分两格：数据，和下一个结点的地址 <code>next</code>。三个结点由三次 malloc 得到，位置互不相关，全靠 next 里的地址串成一条链：</p>

<figure class="fig">
<svg viewBox="0 0 600 122" width="600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="head 存着 boat 结点的地址 0x6f10，boat 的 next 存着 cat 的地址 0x51c0，cat 的 next 存着 fly 的地址 0x5a40，fly 的 next 为 NULL">
<g font-size="12" fill="#a1a1a0" text-anchor="middle">
<text x="45" y="44">head</text>
<text x="187" y="44">地址 0x6f10</text>
<text x="357" y="44">地址 0x51c0</text>
<text x="527" y="44">地址 0x5a40</text>
<text x="150" y="112">word</text>
<text x="217" y="112">next</text>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<rect x="10" y="54" width="70" height="38" rx="6"/>
<rect x="120" y="54" width="60" height="38"/><rect x="180" y="54" width="74" height="38"/>
<rect x="290" y="54" width="60" height="38"/><rect x="350" y="54" width="74" height="38"/>
<rect x="460" y="54" width="60" height="38"/><rect x="520" y="54" width="74" height="38"/>
</g>
<g font-size="14" fill="#e8e8e8" text-anchor="middle">
<text x="150" y="78">boat</text><text x="320" y="78">cat</text><text x="490" y="78">fly</text>
</g>
<g font-size="13" fill="#38bdf8" text-anchor="middle">
<text x="45" y="78">0x6f10</text><text x="217" y="78">0x51c0</text><text x="387" y="78">0x5a40</text>
</g>
<text x="557" y="78" font-size="13" fill="#a1a1a0" text-anchor="middle">NULL</text>
<g stroke="#38bdf8" stroke-width="2">
<line x1="80" y1="73" x2="112" y2="73"/><line x1="254" y1="73" x2="282" y2="73"/><line x1="424" y1="73" x2="452" y2="73"/>
</g>
<g fill="#38bdf8">
<polygon points="120,73 111,68 111,78"/><polygon points="290,73 281,68 281,78"/><polygon points="460,73 451,68 451,78"/>
</g>
</svg>
<figcaption>地址为示意值。head 和 next 里存的都是地址（蓝色），箭头只是它的画法。</figcaption>
</figure>

<ul>
<li>最后一个结点的 next 是 <strong>NULL</strong>，遍历见到 NULL 就停。</li>
<li>指向第一个结点的指针 <strong>head</strong> 是进入链表的唯一入口；<strong>空表就是 head == NULL</strong>。</li>
<li>只能沿 next 往后走。<strong>一个结点如果没有任何指针指向它，就再也找不回来，也没法 free。</strong>后面每个操作的语句顺序都由这一条决定。</li>
</ul>
<p>C 里的结点是一个结构体，课上的类型名是 <code>node_t</code>；空表写作 <code>node_t *head = NULL;</code>：</p>
<pre><code>typedef struct node node_t;
struct node { char word[16]; node_t *next; };   /* 数据 + 下一个结点的地址 */</code></pre>
<p>先 typedef，结构体里才能写 <code>node_t *next</code>。每个结点多一个指针（64 位机器上 8 字节），只是常数开销，空间仍是 O(n)。</p>

<h2>头插：两行，顺序不能换</h2>
<p>链表是 cat → fly，要加入 boat。手里只有 head，最方便的位置就是表头，这叫头插（head insertion）。malloc 返回 NULL 表示内存不足，要检查：</p>
<pre><code>node_t *new = malloc(sizeof(*new));
assert(new != NULL);
strcpy(new-&gt;word, "boat");
new-&gt;next = head;     /* ① boat → cat：先接住原来的第一个结点 */
head = new;           /* ② head → boat */</code></pre>
<p>两条赋值与表长无关，<strong>头插是 O(1)</strong>。空表同样适用：head 为 NULL 时，①把新结点的 next 设成 NULL。</p>
<p><strong>①和②不能对调。</strong>先做 <code>head = new</code>，cat 的地址原本只存在 head 里，被覆盖后 cat、fly 都再也到不了；接着 <code>new-&gt;next = head</code> 让 boat 指向自己，遍历会在 boat 上无限循环。</p>
<p>从空表开始依次头插 fly、cat、boat，得到 boat → cat → fly：<strong>表中顺序与插入顺序相反</strong>，n 次头插建表共 O(n)。课上默认用头插：其他位置都要先从 head 走过去才拿得到地址。</p>

<h2>遍历与查找</h2>
<p>遍历（traversal）从 head 出发，处理当前结点，再顺着 next 跳到下一个，直到 NULL。打印整张表、按键查找（search）都是这个循环（w 是要找的单词）：</p>
<pre><code>node_t *p = head;
while (p != NULL &amp;&amp; strcmp(p-&gt;word, w) != 0)
    p = p-&gt;next;          /* 结束时 p 指向目标，或为 NULL（不存在） */</code></pre>
<p>第一个结点就是目标时比较 1 次，目标不在表里时比较 n 次，<strong>查找是 O(n)</strong>。表排好序也不能二分：链表没有随机访问（random access），想看中间那个结点只能从 head 走 n/2 步。</p>

<h2>在中间插入：dog 放进 cat 和 fly 之间</h2>
<p>有序链表 boat → cat → fly，要插入 dog。dog 应接在 cat 后面；设 <code>prev</code> 已指向 cat，<code>new</code> 指向装好 dog 的新结点：</p>
<pre><code>new-&gt;next = prev-&gt;next;    /* ① dog → fly */
prev-&gt;next = new;          /* ② cat → dog */</code></pre>
<p>不搬任何元素，<strong>已知前驱（predecessor）时插入是 O(1)</strong>。这两行同样<strong>不能对调</strong>：先做②，cat → fly 被改掉，而 fly 的地址只存在那里，fly 及其后的结点全部丢失；再做①时 <code>prev-&gt;next</code> 已经是 dog，dog 指向自己。</p>
<p>前驱通常要自己找：从 head 走到最后一个小于 dog 的结点要 O(n)，所以<strong>向 n 个元素的有序链表插入一个元素是 O(n)</strong>，逐个插入建成有序链表是 O(n²)。新元素比第一个结点还小时退化为头插。</p>

<h2>删除：先存下要断开的结点</h2>
<p>从 boat → cat → dog → fly 中删除 cat。删除也要站在前驱上：q 指向 boat，要删的结点就是 <code>q-&gt;next</code>，不必另外给出：</p>
<pre><code>node_t *p = q-&gt;next;   /* ① 先用 p 存下 cat */
q-&gt;next = p-&gt;next;     /* ② boat → dog，绕过 cat */
free(p);               /* ③ 归还 cat 的内存 */</code></pre>
<p><strong>已知前驱时删除是 O(1)</strong>；按键删除要先从 head 找到前驱，是 O(n)。两种错误写法：</p>
<ul>
<li>省掉①，直接写 <code>q-&gt;next = q-&gt;next-&gt;next;</code>：cat 被绕过后没有任何指针指向它，无法 free，造成<strong>内存泄漏（memory leak）</strong>。</li>
<li>先 <code>free(p)</code> 再执行 <code>q-&gt;next = p-&gt;next</code>：读的是已经释放的内存，属于未定义行为（undefined behaviour）。</li>
</ul>
<p>删第一个结点时没有前驱，要改的是 head：<code>p = head; head = head-&gt;next; free(p);</code>。free 之后 p 成了悬空指针（dangling pointer），不能再解引用。</p>

<div class="callout key" data-label="考点">
<p>插入和删除遵守同一条规则：<strong>改掉一个指针之前，先保证它原来指向的结点还有别的指针拿着。</strong>问“这两行能否交换”时，答不能，并说出丢的是哪些结点。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-linked-list/anims/pointer-rewire.html" loading="lazy" style="height: 500px;" title="链表指针操作：头插、中间插入、删除"></iframe>
<p class="anim-caption">选头插、中间插入或删除，再选正确顺序或错误顺序，逐步执行：橙色是这一步改动的指针，红色结点已经无法到达。</p>

<h2>释放整张链表</h2>
<p>每个结点用完都要 free。常见错误是 <code>for (p = head; p != NULL; p = p-&gt;next) free(p);</code>：free(p) 之后，<code>p = p-&gt;next</code> 又去读刚释放的结点。正确做法是 free 之前先把 next 存进另一个变量，见下面程序里的 <code>free_list</code>，共 O(n)。</p>

<h2>完整程序</h2>
<p>按字母序依次插入 fly、cat、boat、dog，再删除 cat，每步打印整张表。插入和删除都让一对相邻指针往后走，prev（q）始终是 curr（p）的前驱；前驱为 NULL 说明涉及第一个结点，改的是 head，所以函数返回新的 head。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;assert.h&gt;

typedef struct node node_t;
struct node {
    char word[16];                     /* 数据：不超过 15 个字母的单词 */
    node_t *next;                      /* 下一个结点；最后一个结点为 NULL */
};

node_t *insert_sorted(node_t *head, const char *w) {
    node_t *new = malloc(sizeof(*new));
    assert(new != NULL &amp;&amp; strlen(w) &lt; sizeof(new-&gt;word));
    strcpy(new-&gt;word, w);
    node_t *prev = NULL, *curr = head;   /* prev 始终是 curr 的前驱 */
    while (curr != NULL &amp;&amp; strcmp(curr-&gt;word, w) &lt; 0) {
        prev = curr;
        curr = curr-&gt;next;
    }
    new-&gt;next = curr;                  /* ① 先接后继 */
    if (prev == NULL) head = new;      /* ② 没有前驱：头插 */
    else prev-&gt;next = new;             /* ② 有前驱：改 prev-&gt;next */
    return head;
}

node_t *delete_key(node_t *head, const char *w) {
    node_t *q = NULL, *p = head;       /* q 始终是 p 的前驱 */
    while (p != NULL &amp;&amp; strcmp(p-&gt;word, w) != 0) {
        q = p;
        p = p-&gt;next;
    }
    if (p == NULL) return head;        /* 不存在 */
    if (q == NULL) head = p-&gt;next;     /* 删第一个结点：改 head */
    else q-&gt;next = p-&gt;next;            /* 绕过 p */
    free(p);                           /* p 一直拿着它，可以安全释放 */
    return head;
}

void print_list(const node_t *p) {
    for (; p != NULL; p = p-&gt;next) printf("%s -&gt; ", p-&gt;word);
    printf("NULL\\n");
}

void free_list(node_t *head) {
    while (head != NULL) {
        node_t *next = head-&gt;next;     /* free 之前先记下后继 */
        free(head);
        head = next;
    }
}

int main(void) {
    const char *words[] = {"fly", "cat", "boat", "dog"};
    node_t *head = NULL;
    for (int i = 0; i &lt; 4; i++) {
        head = insert_sorted(head, words[i]);
        print_list(head);
    }
    head = delete_key(head, "cat");
    print_list(head);
    free_list(head);
    return 0;
}</code></pre>
<pre><code class="lang-text">fly -&gt; NULL
cat -&gt; fly -&gt; NULL
boat -&gt; cat -&gt; fly -&gt; NULL
boat -&gt; cat -&gt; dog -&gt; fly -&gt; NULL
boat -&gt; dog -&gt; fly -&gt; NULL</code></pre>

<h2>考试怎么考</h2>
<table>
<thead><tr><th>操作（n 个结点，只有 head）</th><th>代价</th></tr></thead>
<tbody>
<tr><td>头插；已知前驱时在其后插入或删除</td><td>O(1)</td></tr>
<tr><td>按键查找（无序或有序都一样，不能二分）</td><td>O(n)</td></tr>
<tr><td>取第 k 个元素</td><td>O(k)，最坏 O(n)</td></tr>
<tr><td>插入有序链表并保持有序；按键删除</td><td>O(n)（找前驱）</td></tr>
<tr><td>逐个插入建有序链表</td><td>O(n²)</td></tr>
<tr><td>释放整张链表</td><td>O(n)</td></tr>
</tbody>
</table>
<ul>
<li><strong>填空与选择</strong>：上表各项，公式表上没有，要记。往年期末问过向无序链表插入一个元素（O(1)，头插）和向有序链表插入一个元素（O(n)）。</li>
<li><strong>代码阅读</strong>：给几行改指针的语句，问执行后的链表、哪些结点丢失或泄漏、会不会死循环。</li>
<li><strong>代码编写</strong>：头插、按键删除、释放整表、反转、计数等。数据多为 int，把 strcmp 换成 == 或 &lt; 即可。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>空表、删第一个结点、删最后一个结点都要单独想一遍。</li>
<li>C 按值传参：函数里写 <code>head = new</code> 只改了形参，调用方的 head 不变。要么返回新的 head（如上面的程序），要么传 <code>node_t **</code>。</li>
<li>循环条件先判 <code>p != NULL</code> 再访问 <code>p-&gt;word</code>，靠 &amp;&amp; 短路避免解引用 NULL。free 之后不再使用那个指针。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 链表为 boat → cat → dog → fly。执行 head = mystery(head); 后打印整张表，输出什么？写出每轮循环结束时以 prev 和 head 开头的两条链。</summary>
<div class="qa__body">
<pre><code>node_t *mystery(node_t *head) {
    node_t *prev = NULL;
    while (head != NULL) {
        node_t *next = head-&gt;next;
        head-&gt;next = prev;
        prev = head;
        head = next;
    }
    return prev;
}</code></pre>
<p>每轮把 head 指向的结点从剩余链的开头摘下，接到 prev 链的开头：</p>
<table>
<thead><tr><th>轮次</th><th>prev 开头的链</th><th>head 开头的链</th></tr></thead>
<tbody>
<tr><td>开始</td><td>NULL</td><td>boat → cat → dog → fly → NULL</td></tr>
<tr><td>1</td><td>boat → NULL</td><td>cat → dog → fly → NULL</td></tr>
<tr><td>2</td><td>cat → boat → NULL</td><td>dog → fly → NULL</td></tr>
<tr><td>3</td><td>dog → cat → boat → NULL</td><td>fly → NULL</td></tr>
<tr><td>4</td><td>fly → dog → cat → boat → NULL</td><td>NULL</td></tr>
</tbody>
</table>
<p>返回 fly，输出 <code>fly -&gt; dog -&gt; cat -&gt; boat -&gt; NULL</code>：函数把链表<strong>原地反转</strong>，O(n) 时间、O(1) 额外空间。循环第一行先存 next，因为下一行要改掉 <code>head-&gt;next</code>，不存的话剩下的结点就丢了。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 只写 Big-O：(a) 向 n 个元素的无序链表插入一个元素；(b) 向 n 个元素的有序链表插入一个元素并保持有序；(c) 已有指向结点 X 的指针，删除 X 后面的那个结点；(d) 在 n 个元素的有序链表里查找一个键；(e) 从空表开始逐个插入 n 个元素，建成有序链表。</summary>
<div class="qa__body">
<p>(a) <strong>O(1)</strong>：顺序无所谓，直接头插。(b) <strong>O(n)</strong>：改指针 O(1)，但要从 head 走到插入位置，最坏走完整张表。(c) <strong>O(1)</strong>：X 就是前驱，<code>p = X-&gt;next; X-&gt;next = p-&gt;next; free(p);</code>。(d) <strong>O(n)</strong>：有序也不能二分，到不了中间结点。(e) <strong>O(n²)</strong>：第 i 次插入最多走过 i−1 个结点，总共最多 0 + 1 + … + (n−1) = n(n−1)/2 步。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. 结点改为 int data。写函数 node_t *delete_all(node_t *head, int x)，删除所有值为 x 的结点并释放它们，返回新的 head。用 3 → 3 → 5 → 3 → 3 → 7 → 3、x = 3 检验。</summary>
<div class="qa__body">
<pre><code>node_t *delete_all(node_t *head, int x) {
    node_t *q = NULL, *p = head;          /* q 始终是 p 的前驱 */
    while (p != NULL) {
        node_t *next = p-&gt;next;           /* 先存下后继 */
        if (p-&gt;data != x) q = p;          /* 保留 p：q 跟上 */
        else {
            if (q == NULL) head = next;   /* 删的是当前第一个结点 */
            else q-&gt;next = next;
            free(p);                      /* 删除 p：q 不动 */
        }
        p = next;
    }
    return head;
}</code></pre>
<p>要点：开头连续的 x 每次都是第一个结点，q 一直为 NULL，每删一个 head 就后移一格；删掉 p 之后 <strong>q 不前进</strong>，因为新的 p 可能也等于 x（例中 5 后面的两个 3）；next 在 free 之前取出。</p>
<p>检验：开头两个 3 删掉后 head 指向 5；q = 5 时连删两个 3，5 接上 7；q = 7 时删掉最后的 3。结果 <code>5 -&gt; 7 -&gt; NULL</code>。全是 3 的表和空表都返回 NULL。每个结点只看一次，O(n)。</p>
</div>
</details>
`;
