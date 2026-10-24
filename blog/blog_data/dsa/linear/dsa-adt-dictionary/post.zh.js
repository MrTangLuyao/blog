/* Post body — dsa-adt-dictionary / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-adt-dictionary:zh'] = `
<p class="lead">抽象数据类型（Abstract Data Type, ADT）只规定有哪些操作、每个操作是什么意思；具体数据结构（concrete data structure）决定数据在内存里怎么放，因此也决定了每个操作的代价。字典（dictionary）是本课程用得最多的 ADT，靠键（key）来查找、插入和删除记录。</p>

<h2>同一个查询，三种存法</h2>
<p>课上的例子：学校保存每个学生的记录，包括学号、姓名、所选课程和成绩。系统收到学号 1003，要取回这名学生的整条记录。设共有 n = 50000 名学生，记录可以这样存：</p>
<ul>
<li><strong>无序数组</strong>：从第一条开始逐个比学号。1003 排在最后或者根本不存在时，要比 50000 次。</li>
<li><strong>按学号排好序的数组</strong>：用二分查找，每比一次丢掉一半，最多比 16 次（⌊log₂ 50000⌋ + 1 = 16）。</li>
<li><strong>哈希表</strong>：由学号算出下标直接去取，平均只看常数个位置（与装载因子有关，见第 4 部分）。</li>
</ul>
<p>三种存法下，调用方写的都是同一句“查找学号 1003”。它不关心记录放在哪里，不同的只是这句话执行得多快。“做什么”和“怎么做”的这种分离，就是 ADT 和具体数据结构的区别。</p>

<h2>抽象数据类型与具体数据结构</h2>
<p><strong>ADT 是接口（interface）</strong>：列出操作和每个操作的含义，不涉及实现细节。课上拿 Python 或 C++ 的类作类比：能看到它有哪些函数、各做什么，看不到函数体。<strong>具体数据结构是实现（implementation）</strong>：直接操作内存，规定元素怎么排、指针怎么连。本课程用 C，正是因为 C 能直接访问内存，具体结构要靠它写出来。<strong>ADT 由具体数据结构来实现，同一个 ADT 可以有多种实现。</strong></p>

<figure class="fig">
<svg viewBox="0 0 440 285" width="440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="调用方只通过字典接口的三个操作访问数据，接口下面可以换成五种不同的具体结构">
<rect x="120" y="10" width="200" height="38" rx="8" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="220" y="34" fill="#e8e8e8" font-size="14" text-anchor="middle">调用方（程序、算法）</text>
<line x1="220" y1="48" x2="220" y2="82" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<polygon points="220,91 214,81 226,81" fill="rgba(255,255,255,0.35)"/>
<text x="232" y="72" fill="#a1a1a0" font-size="12">只调用接口里的操作</text>
<rect x="40" y="92" width="360" height="62" rx="8" fill="rgba(217,119,87,0.12)" stroke="#d97757" stroke-width="2"/>
<text x="220" y="117" fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">字典 ADT（接口）</text>
<text x="220" y="141" fill="#e8e8e8" font-size="13" text-anchor="middle">find(key) · insert(item) · delete(key)</text>
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="220" y1="154" x2="44" y2="204"/><line x1="220" y1="154" x2="132" y2="204"/><line x1="220" y1="154" x2="220" y2="204"/><line x1="220" y1="154" x2="308" y2="204"/><line x1="220" y1="154" x2="396" y2="204"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<rect x="4" y="204" width="80" height="36" rx="7"/><rect x="92" y="204" width="80" height="36" rx="7"/><rect x="180" y="204" width="80" height="36" rx="7"/><rect x="268" y="204" width="80" height="36" rx="7"/><rect x="356" y="204" width="80" height="36" rx="7"/>
</g>
<g fill="#e8e8e8" font-size="13" text-anchor="middle">
<text x="44" y="227">无序数组</text><text x="132" y="227">有序数组</text><text x="220" y="227">链表</text><text x="308" y="227">BST / AVL</text><text x="396" y="227">哈希表</text>
</g>
<text x="220" y="268" fill="#a1a1a0" font-size="12" text-anchor="middle">具体数据结构（实现）：决定内存布局和每个操作的代价</text>
</svg>
<figcaption>调用方只经过接口访问数据；接口下面可以是其中任何一种实现。</figcaption>
</figure>

<p>本课程讲了四个 ADT：</p>
<table>
<thead><tr><th>ADT</th><th>核心操作</th><th>规则</th><th>常见实现</th><th>详见</th></tr></thead>
<tbody>
<tr><td>栈（stack）</td><td>push、pop、top</td><td>后进先出（LIFO，课上也说 first in, last out）</td><td>数组（栈顶在末尾）、链表（栈顶在表头）</td><td>2.7</td></tr>
<tr><td>队列（queue）</td><td>enqueue、dequeue</td><td>先进先出（FIFO）</td><td>循环数组、带头尾指针的链表</td><td>2.7</td></tr>
<tr><td>字典（dictionary）</td><td>find、insert、delete</td><td>按键存取</td><td>数组、链表、BST / AVL 树、B 树、哈希表</td><td>2.3 起，第 3、4 部分</td></tr>
<tr><td>优先队列（priority queue）</td><td>insert、extractMax（或 extractMin）、peek</td><td>优先级最高的先出</td><td>无序或有序的数组 / 链表、二叉堆</td><td>6.5</td></tr>
</tbody>
</table>
<p>具体数据结构按学习顺序有：静态数组（static array）、动态数组（dynamic array）、循环数组（circular array）、链表（linked list）、各种树（二叉树、BST、AVL 树、2-3 树、B 树、伸展树、k-d 树、trie 等）、哈希表（hash table）和堆（heap）。</p>

<div class="callout warn" data-label="易错">
<p><strong>哈希表和堆都是具体结构</strong>，两者都建在数组上：哈希表是字典的一种实现，二叉堆是优先队列的一种实现。第 2 周介绍 ADT 时曾把哈希表和栈、队列列在一起，期末复习的总结图则把它放在具体结构一侧，配对题按“哈希表实现字典、堆实现优先队列”来答。同理，<strong>BST 是具体结构，字典才是 ADT</strong>。</p>
</div>

<h3>算法与数据结构绑在一起</h3>
<p>解决一个问题（problem），要同时选定算法（algorithm）和数据结构，再评估时间和空间效率。算法往往反复调用某个 ADT 的操作，所以<strong>算法的复杂度取决于这个 ADT 用什么结构实现</strong>。例如 Dijkstra 最短路算法每一步都要从优先队列里取出距离最小的顶点。2015 年期末题问：优先队列分别用堆、用按权重排序的链表时，Dijkstra 的总复杂度各是多少？算法一行没变，答案却不同（见 6.5、7.5）。有的算法只用具体结构（二分查找只需要一个有序数组），有的两者都用。</p>

<h2>字典：键与五个操作</h2>
<p>字典是一组数据项（item），<strong>每一项有一个键，按键存取</strong>。学生记录的键是学号：学号不重复，给出学号就能确定唯一一条记录。后面各篇画图时只画键（一个数，或 cat、dog、fly 这样的单词），但每个键背后都代表一整条记录。</p>
<table>
<thead><tr><th>操作</th><th>含义</th></tr></thead>
<tbody>
<tr><td>build（建立）</td><td>由一批数据项建成字典</td></tr>
<tr><td>find（查找，也叫 search、lookup）</td><td>给出键，返回对应的数据项；不存在就报告找不到</td></tr>
<tr><td>insert（插入）</td><td>加入一个新数据项</td></tr>
<tr><td>delete（删除）</td><td>按键删去一个数据项</td></tr>
<tr><td>update（更新）</td><td>按键修改一个数据项的内容</td></tr>
</tbody>
</table>
<p>find、search、lookup 在前半学期是同义词；到第 7 部分，search 多指图搜索。五个操作里有两个可以用别的操作拼出来：</p>
<ul>
<li><strong>build = 从空字典开始做 n 次 insert</strong>；</li>
<li><strong>update = find + delete（旧项）+ insert（新项）</strong>。</li>
</ul>
<p>所以<strong>真正要实现的核心操作只有 find、insert、delete 三个</strong>，分析每种实现时主要看这三个的代价。拼出来的操作，代价是各步之和。例如用有序数组实现时，insert 最坏 O(n)，逐个插入建立 n 项就是 O(n²)，不是 O(n log n)（推导见 2.3）。build 也可以不经过 insert，由给定数据整体建成：有序数组可以先放入全部 n 项，再用第 5 部分 O(n log n) 的排序排一次，比逐个插入的 O(n²) 快。题目说“逐个插入”时，才按 n 次 insert 的总和算。</p>

<div class="callout note" data-label="注意">
<p>只改成绩这类非键字段时，find 拿到记录后就地修改即可。<strong>键本身要改时必须先 delete 再 insert</strong>，因为在有序数组、BST、哈希表里，一条记录放在哪里由它的键决定。</p>
</div>

<h2>在 C 里写一个字典 ADT</h2>
<p>C 没有类，ADT 通常写成一对文件：<code>.h</code> 头文件只放类型和函数原型，相当于接口；<code>.c</code> 文件给出结构体和函数体，相当于实现。第 2 周 workshop 的多文件程序（<code>.h</code> + <code>.c</code> + Makefile）就是这种分工。字典的接口：</p>
<pre><code>/* dict.h: the interface says WHAT a dictionary can do */
typedef struct {
    int  id;          /* key: student ID */
    char name[16];    /* the rest of the record */
    int  mark;
} record_t;

typedef struct dict dict_t;   /* contents hidden in the .c file */

dict_t   *dict_create(void);
record_t *dict_find(dict_t *d, int id);         /* NULL if absent */
int       dict_insert(dict_t *d, record_t r);   /* 0 if id already there */
int       dict_delete(dict_t *d, int id);       /* 0 if id absent */
void      dict_free(dict_t *d);</code></pre>
<p><code>typedef struct dict dict_t;</code> 只声明有这样一个结构，不给出成员，这叫不完整类型（incomplete type）。调用方可以持有 <code>dict_t *</code>，把它传给这五个函数，但写 <code>d-&gt;n</code> 会编译报错。内部怎么存，只有实现文件知道。下面是两种实现各自的结构体：</p>
<pre><code>/* dict_array.c: unsorted static array */
#define CAP 100
struct dict {
    record_t a[CAP];   /* records stored contiguously */
    int n;             /* records in use */
};

/* dict_list.c: linked list */
typedef struct node node_t;
struct node {
    record_t rec;
    node_t *next;
};
struct dict {
    node_t *head;      /* NULL when empty */
};</code></pre>
<p>build 和 update 不需要新的底层操作，只用接口就能写出来：</p>
<pre><code>#include "dict.h"

/* build = n inserts */
dict_t *dict_build(record_t recs[], int n) {
    dict_t *d = dict_create();
    for (int i = 0; i &lt; n; i++) {
        dict_insert(d, recs[i]);
    }
    return d;
}

/* update = find + delete + insert */
int dict_update(dict_t *d, record_t r) {
    if (dict_find(d, r.id) == NULL) {
        return 0;                    /* nothing to update */
    }
    dict_delete(d, r.id);
    return dict_insert(d, r);
}</code></pre>
<p>这两个函数没有一行碰到 <code>d</code> 的内部，所以同一份调用代码和数组版、链表版都能一起编译，运行结果相同。</p>

<h2>各种实现的 find 代价</h2>
<p>下表只列 find 的最坏情况；insert、delete 和平均情况在各篇逐个分析，汇总见 8.2 复杂度总表（一）：</p>
<table>
<thead><tr><th>具体结构</th><th>find 最坏</th><th>要点</th><th>详见</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>O(n)</td><td>线性查找；不检查重复键时，末尾追加 O(1)</td><td>2.3</td></tr>
<tr><td>有序数组</td><td>O(log n)</td><td>二分查找；插入、删除要移位，O(n)</td><td>2.3</td></tr>
<tr><td>链表（有序或无序）</td><td>O(n)</td><td>不能直接跳到中间，有序也不能二分</td><td>2.4、2.5</td></tr>
<tr><td>BST</td><td>O(n)</td><td>退化成一条链时最坏；平衡时 O(log n)</td><td>3.3、3.4</td></tr>
<tr><td>AVL 树</td><td>O(log n)</td><td>靠旋转保持平衡</td><td>3.5、3.6</td></tr>
<tr><td>2-3 树、B 树</td><td>O(log n)</td><td>结点可存多个键，所有叶子在同一层</td><td>3.7、3.8</td></tr>
<tr><td>哈希表</td><td>O(n)</td><td>平均 O(1)；主要局限是空间</td><td>4.1–4.5</td></tr>
</tbody>
</table>

<h2>考试怎么考</h2>
<ul>
<li><strong>配对、多选</strong>：从一串名字里挑出 ADT（栈、队列、字典、优先队列），其余是具体结构；或者把 ADT 和能实现它的结构连线。</li>
<li><strong>场景对应 ADT</strong>：撤销操作对应栈，按到达顺序服务对应队列，按键查记录对应字典，总是先处理最紧急的对应优先队列。</li>
<li><strong>字典需要哪些操作</strong>：核心是 find、insert、delete；build 由 n 次 insert 得到，update 由 find + delete + insert 得到。</li>
<li><strong>复杂度题先看实现</strong>：“字典的 find 是多少”没有唯一答案，题目会指定结构。拼出来的操作把各步代价相加，逐个插入建立的代价是 n 次 insert 之和。</li>
<li><strong>算法配实现</strong>：同一个算法换一种 ADT 实现，总复杂度跟着变，例如 Dijkstra、Prim 配不同的优先队列（见 6.5、7.5、7.7）。</li>
<li>作业也在考试范围内：A1、A2 用的是字典，A3 用到队列。</li>
</ul>
<p>要记住的是四个 ADT 的名字、规则（LIFO、FIFO）、核心操作和上面的配对关系，公式表上没有这部分。常见陷阱：把哈希表、堆、BST 当成 ADT；说“用 BST 实现的字典 find 是 O(log n)”（最坏 O(n)）；说“逐个插入建有序数组是 O(n log n)”（实际 O(n²)）。</p>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. (a) 下列哪些是抽象数据类型：栈、链表、哈希表、优先队列、二叉堆、字典、循环数组、队列、AVL 树？(b) 为每个场景选一个最合适的 ADT：① 文本编辑器的撤销（undo）；② 打印机按提交顺序打印；③ 输入学号查成绩；④ 急诊室按病情轻重叫号。</summary>
<div class="qa__body">
<p>(a) ADT 是<strong>栈、优先队列、字典、队列</strong>。其余五个是具体结构：链表、循环数组是线性结构；哈希表和二叉堆都建在数组上，分别是字典和优先队列的常见实现；AVL 树是平衡的 BST，也是字典的一种实现。</p>
<p>(b) ① 栈：最后做的操作最先撤销，后进先出。② 队列：先提交先打印，先进先出。③ 字典：学号是键，按键取记录。④ 优先队列：每次取病情最重的，与到达先后无关。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 关于字典 ADT，哪一项正确？A. 字典的 find 是 O(log n)　B. build 可以由 n 次 insert 完成，update 可以由 find、delete、insert 完成　C. 哈希表是一种 ADT，所以字典必须用哈希表实现　D. update 无法由其他操作拼出，所以核心操作是 find、insert、delete、update 四个</summary>
<div class="qa__body">
<p>选 <strong>B</strong>。A 错：ADT 本身没有复杂度，复杂度取决于实现。无序数组、链表上是 O(n)，退化的 BST 最坏也是 O(n)，有序数组、平衡树才是 O(log n)。C 错：哈希表是具体结构，字典也可以用数组、链表、树实现。D 错：update = find + delete + insert，核心只有三个。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 用有序数组实现字典（容量足够）：find 用二分查找，insert 和 delete 先二分定位，再移动后面的元素。(a) 按 find + delete + insert 实现的 update，最坏时间复杂度是多少？(b) 从空数组开始逐个插入 n 个键来建立字典，最坏是多少？什么输入顺序会达到最坏？</summary>
<div class="qa__body">
<p>(a) find 最坏 O(log n)。delete 是二分 O(log n) 加上把后面的元素前移，最坏 O(n)。insert 是二分 O(log n) 加上把后面的元素后移，最坏 O(n)。总共 O(log n) + O(n) + O(n) = <strong>O(n)</strong>，由移位决定。</p>
<p>(b) 第 i 次插入时数组里已有 i − 1 个键：二分 O(log i)，最多移位 i − 1 次。键按从大到小的顺序到达时，每个新键都比已有的键小，要插到最前面，已有的 i − 1 个键全部后移。总移位 0 + 1 + … + (n − 1) = n(n − 1)/2，再加上各次二分合计 O(n log n)，结果是 <strong>O(n²)</strong>。例如依次插入 8, 7, 6, 5, 4, 3, 2, 1，共移位 28 次。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 使用上面的 dict.h 接口，有人把 update 写成了下面的样子。字典里已有学号 1003、1001、1004、1002 四条记录，其中 1003 是 {1003, "Chen", 75}。程序输出什么？问题出在哪里？</summary>
<div class="qa__body">
<pre><code>int update_wrong(dict_t *d, record_t r) {
    int ok = dict_insert(d, r);
    dict_delete(d, r.id);
    return ok;
}

/* d already holds 1003, 1001, 1004, 1002 */
record_t r = {1003, "Chen", 88};
printf("%d\\n", update_wrong(d, r));
record_t *p = dict_find(d, 1003);
printf("%s\\n", p == NULL ? "missing" : p-&gt;name);</code></pre>
<p>输出：</p>
<pre><code class="lang-text">0
missing</code></pre>
<p>接口规定键已存在时 insert 不插入并返回 0，所以第一句插入失败，ok = 0；第二句 delete 删掉了旧记录。新记录没放进去，旧记录也没了，学号 1003 整条丢失。正确顺序是先 find 确认存在，再 delete 旧项，最后 insert 新项，即 <code>dict_update</code> 的写法。只改成绩的话，也可以用 find 返回的指针直接改 <code>p-&gt;mark</code>。这个结论对数组版和链表版都成立，因为它只依赖接口规定的行为。</p>
</div>
</details>
`;
