/* Post body — dsa-linked-list / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-linked-list:zh'] = `
<p class="lead">链表（linked list）把每个元素放进一个单独 malloc 出来的结点，结点里记着下一个结点的地址。插入和删除只改一两个指针，不搬数据；真正要小心的只有一件事：改指针的先后顺序。</p>

<h2>从一个场景说起</h2>
<p>玩过寻宝游戏吗？你手里有第一张纸条，上面写着一个词，还写着“下一张在书架第三层”。你去书架找到第二张，它又告诉你第三张藏在哪……最后一张写着“结束”。</p>
<p>纸条可以藏在屋里任何角落。想在中间加一张也容易：藏好新纸条，再把前一张上的“下一张在哪”改成新纸条的位置，别的纸条都不用动。数组（array）就不一样：它像一排连号的座位，在中间插进一个人，后面的人都得挪一个座，要 O(n) 次。</p>
<p>寻宝游戏只有一个风险：你把某张纸条上的“下一张在哪”擦掉了，却没先记下原来写的位置，后面的纸条就再也找不到了。链表每个操作的难点都在这里。</p>

<h2>它是什么</h2>
<p>简单说，链表就是一串“纸条”：每个元素单独占一块内存，这块内存同时记着下一个元素的地址。对回寻宝游戏，它由三部分组成：</p>
<ul>
<li><strong>结点（node）</strong>：一张纸条。里面两格：数据，和下一个结点的地址 <code>next</code>。</li>
<li><strong>NULL</strong>：最后一张纸条上的“结束”。最后一个结点的 next 是 NULL，遍历见到 NULL 就停。</li>
<li><strong>head</strong>：指向第一个结点的指针，相当于你手里第一张纸条的位置。它是进入链表的唯一入口；<strong>空表就是 head == NULL</strong>。</li>
</ul>
<p>课上的例子是按字母序排好的三个单词 boat、cat、fly：</p>

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

<p>三个结点各由一次 malloc 得到，散在内存各处，全靠 next 里的地址串起来。因为只能顺着 next 往后走，就有了链表最重要的一条规则：<strong>一个结点如果没有任何指针指着它，就再也找不回来，也没法 free。</strong></p>
<p>在 C 里，结点是一个结构体，课上的类型名是 <code>node_t</code>：</p>
<pre><code>typedef struct node node_t;
struct node {
    char word[16];     /* 数据：一个单词 */
    node_t *next;      /* 下一个结点的地址 */
};
node_t *head = NULL;   /* 空表 */</code></pre>
<p>第一行先给 <code>struct node</code> 起个短名字 node_t，结构体里面才能写 <code>node_t *next</code>。每个结点比数组多存一个指针（64 位机器上 8 字节），只是常数开销，空间仍是 O(n)。</p>

<h2>看个例子：boat、cat、dog、fly</h2>
<p>下面一直用课上的这几个单词，依次看头插、查找、中间插入和删除。</p>

<h3>头插：把 boat 放到最前面</h3>
<p>现在链表是 cat → fly，要加入 boat。手里只有 head，最顺手的位置就是表头，这叫头插（head insertion）：</p>
<pre><code>node_t *new = malloc(sizeof(*new));
assert(new != NULL);
strcpy(new-&gt;word, "boat");
new-&gt;next = head;     /* ① boat → cat */
head = new;           /* ② head → boat */</code></pre>
<ul>
<li>第 1–2 行：要一块结点大小的内存。malloc 返回 NULL 表示内存不够，用 assert 检查。</li>
<li>第 3 行：把单词放进去。</li>
<li>第 4 行 ①：新结点先“接住”原来的第一个结点 cat。这时 cat 的地址在 head 和 <code>new-&gt;next</code> 里各有一份。</li>
<li>第 5 行 ②：head 改为指向 boat。cat 还被 boat 的 next 拿着，没有丢。</li>
</ul>
<p>两条赋值和表有多长无关，所以<strong>头插是 O(1)</strong>。空表也适用：head 为 NULL 时，①让新结点的 next 变成 NULL，正好是表尾。</p>
<p>①和②能对调吗？<strong>不能。</strong>先做 <code>head = new</code>，cat 的地址原本只存在 head 里，一覆盖，cat 和 fly 就再也到不了了，这就是擦掉纸条前没记下位置。接着 <code>new-&gt;next = head</code> 让 boat 指向自己，遍历会在 boat 上无限循环。</p>
<p>从空表开始依次头插 fly、cat、boat，得到 boat → cat → fly：<strong>表里的顺序和插入顺序相反</strong>。n 次头插建表共 O(n)。课上默认用头插，因为别的位置都得先从 head 走过去才拿得到地址。</p>

<h3>查找：顺着 next 一个个看</h3>
<p>遍历（traversal）就是把寻宝游戏玩一遍：从 head 出发，处理当前结点，再顺着 next 跳到下一个，直到 NULL。按单词 w 查找（search）这样写：</p>
<pre><code>node_t *p = head;
while (p != NULL &amp;&amp; strcmp(p-&gt;word, w) != 0)
    p = p-&gt;next;</code></pre>
<p>只要还没到 NULL、当前单词又不是 w，p 就往后跳一格。结束时 p 要么指向目标，要么是 NULL（找不到）。<code>p != NULL</code> 必须写在前面：&amp;&amp; 左边为假就不再算右边，不会去访问 NULL 的 word。</p>
<p>目标是第一个结点时比 1 次，不在表里时比 n 次，<strong>查找是 O(n)</strong>。排好序也不能二分查找：链表没有随机访问（random access），想看中间的结点只能从 head 走 n/2 步。</p>

<h3>中间插入：dog 放进 cat 和 fly 之间</h3>
<p>有序链表 boat → cat → fly，dog 应该接在 cat 后面。假设 <code>prev</code> 已经指向 cat，<code>new</code> 指向装好 dog 的新结点：</p>
<pre><code>new-&gt;next = prev-&gt;next;    /* ① dog → fly */
prev-&gt;next = new;          /* ② cat → dog */</code></pre>
<p>①先让 dog 接住 cat 后面的 fly；②再把 cat 的 next 改成 dog。和头插是同一个套路，只是 head 换成了 <code>prev-&gt;next</code>。</p>
<p>这两行同样<strong>不能对调</strong>。先做②，fly 的地址原本只存在 cat 的 next 里，改掉后 fly 和它后面的结点全丢了；再做①时 <code>prev-&gt;next</code> 已经是 dog，dog 指向自己。</p>
<p>不搬任何元素，<strong>已知前驱（predecessor）时插入是 O(1)</strong>。但前驱通常要从 head 走过去找，要 O(n)，所以<strong>往 n 个元素的有序链表插入一个元素是 O(n)</strong>，逐个插入建成有序链表是 O(n²)。新元素比第一个结点还小时，就退化成头插。</p>

<h3>删除：从 boat → cat → dog → fly 里删掉 cat</h3>
<p>删除也要站在前驱上。设 q 指向 boat，要删的就是 <code>q-&gt;next</code>：</p>
<pre><code>node_t *p = q-&gt;next;   /* ① 先用 p 存下 cat */
q-&gt;next = p-&gt;next;     /* ② boat → dog，绕过 cat */
free(p);               /* ③ 归还 cat 的内存 */</code></pre>
<p>①用 p 拿住 cat，cat 被绕过之后还找得到；②把 boat 的 next 改成 cat 的下一个 dog；③释放 cat。<strong>已知前驱时删除是 O(1)</strong>；按键删除要先找到前驱，是 O(n)。</p>
<p>两种常见的错误写法：</p>
<ul>
<li>省掉①，直接写 <code>q-&gt;next = q-&gt;next-&gt;next;</code>：cat 没有任何指针指着了，没法 free，造成<strong>内存泄漏（memory leak）</strong>。</li>
<li>先 <code>free(p)</code> 再写 <code>q-&gt;next = p-&gt;next</code>：读的是已经释放的内存，属于未定义行为（undefined behaviour）。</li>
</ul>
<p>删第一个结点时没有前驱，要改的是 head：<code>p = head; head = head-&gt;next; free(p);</code>。free 之后 p 成了悬空指针（dangling pointer），不能再解引用。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-linked-list/anims/pointer-rewire.html" loading="lazy" style="height: 500px;" title="链表指针操作：头插、中间插入、删除"></iframe>
<p class="anim-caption">先选头插、中间插入或删除，再选“正确顺序”或“错误顺序”，一步步执行：橙色是这一步改动的指针，红色结点表示已经找不回来了。</p>

<div class="callout key" data-label="考点">
<p>三种操作遵守同一条规则：<strong>改掉一个指针之前，先保证它原来指向的结点还有别的指针拿着。</strong>考试问“这两行能不能交换”时，答不能，并说出丢的是哪些结点。</p>
</div>

<h2>补充：释放整张链表</h2>
<p>常见的错误写法是 <code>for (p = head; p != NULL; p = p-&gt;next) free(p);</code>：free(p) 之后，<code>p = p-&gt;next</code> 又去读刚释放的结点。正确做法是 free 之前先存下一个结点的地址：</p>
<pre><code>void free_list(node_t *head) {
    while (head != NULL) {
        node_t *next = head-&gt;next;   /* 先记下后继 */
        free(head);
        head = next;
    }
}</code></pre>
<p>每一轮先记住第二个结点，再释放第一个，然后 head 后移一格，直到表空。共 O(n)。</p>

<h2>补充：写成函数时，head 怎么改</h2>
<p>考试写的插入、删除通常是函数。坑在这里：C 按值传参，函数里写 <code>head = new</code> 只改了形参，调用方的 head 不变。常用做法是<strong>让函数返回新的 head</strong>。以插入有序链表为例：</p>
<pre><code>node_t *insert_sorted(node_t *head, const char *w) {
    node_t *new = malloc(sizeof(*new));
    assert(new != NULL);
    strcpy(new-&gt;word, w);
    node_t *prev = NULL, *curr = head;
    while (curr != NULL &amp;&amp; strcmp(curr-&gt;word, w) &lt; 0) {
        prev = curr;
        curr = curr-&gt;next;
    }
    new-&gt;next = curr;                  /* ① 先接后继 */
    if (prev == NULL) head = new;      /* ② 没有前驱：头插 */
    else prev-&gt;next = new;             /* ② 有前驱：中间插入 */
    return head;
}</code></pre>
<ul>
<li>第 2–4 行：建新结点，和头插一样。</li>
<li>第 5–9 行：prev 和 curr 一前一后往后走，<strong>prev 始终是 curr 的前驱</strong>。curr 停在第一个不小于 w 的结点（或 NULL），新结点就插在 prev 和 curr 之间。</li>
<li>第 10–12 行：先接住 curr；prev 为 NULL 说明一步都没走，新单词最小，改 head，否则改 <code>prev-&gt;next</code>。</li>
<li>第 13 行：返回 head，调用方写 <code>head = insert_sorted(head, "dog");</code>。</li>
</ul>
<p>按键删除是同一个套路：q、p 一前一后走到目标，q 为 NULL 就改 head，否则 <code>q-&gt;next = p-&gt;next</code>，再 free(p)。也可以把 head 的地址（<code>node_t **</code>）传进函数。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择、填空</strong>：各操作的 Big-O，见下表，公式表上没有，要记。往年期末问过往无序链表和往有序链表各插入一个元素的代价。</li>
<li><strong>读代码</strong>：给几行改指针的语句，问执行后的链表、哪些结点丢失或泄漏、会不会死循环。</li>
<li><strong>写代码</strong>：头插、按键删除、释放整表、反转、计数等。数据多半是 int，把 strcmp 换成 == 或 &lt; 就行。</li>
</ul>
<table>
<thead><tr><th>操作（n 个结点，只有 head）</th><th>代价</th></tr></thead>
<tbody>
<tr><td>头插（无序链表插入一个元素）；已知前驱时在其后插入或删除</td><td>O(1)</td></tr>
<tr><td>按键查找（无序、有序都一样，不能二分）</td><td>O(n)</td></tr>
<tr><td>取第 k 个元素</td><td>O(k)，最坏 O(n)</td></tr>
<tr><td>插入有序链表并保持有序；按键删除</td><td>O(n)（要先找前驱）</td></tr>
<tr><td>逐个插入建成有序链表</td><td>O(n²)：最多 0 + 1 + … + (n−1) = n(n−1)/2 步</td></tr>
<tr><td>释放整张链表</td><td>O(n)</td></tr>
</tbody>
</table>

<h3>例题：读代码</h3>
<p>链表是 boat → cat → dog → fly，执行 <code>head = mystery(head);</code> 后打印整张表，输出什么？</p>
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
<p>每一轮把 head 指着的结点从剩下那条链的开头摘下来，接到 prev 那条链的开头。每轮结束时两条链是：</p>
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
<p>函数返回 fly，输出 <code>fly -&gt; dog -&gt; cat -&gt; boat -&gt; NULL</code>：它把链表<strong>原地反转</strong>，O(n) 时间、O(1) 额外空间。循环第一行先存 next，因为下一行要改掉 <code>head-&gt;next</code>，不存的话剩下的结点就丢了。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>空表、删第一个结点、删最后一个结点，每种情况都要单独想一遍。</li>
<li>函数里改了 head 要返回新的 head（或传 <code>node_t **</code>），否则调用方看不到。</li>
<li>循环条件先判 <code>p != NULL</code> 再访问 <code>p-&gt;word</code>；free 之后不再使用那个指针。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>结点 = 数据 + next；最后一个结点的 next 是 NULL；空表就是 head == NULL。</li>
<li>头插 <code>new-&gt;next = head; head = new;</code> 是 O(1)，表里的顺序和插入顺序相反。</li>
<li>已知前驱时插入、删除都是 O(1)；查找、按键删除、插入有序链表要先走过去，O(n)。有序链表也不能二分。</li>
<li>改指针之前，先保证原来指向的结点还有别的指针拿着：插入先接后继再改前驱，删除先用 p 存下再绕过、最后 free。</li>
</ul>
`;
