/* Post body — dsa-adt-dictionary / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-adt-dictionary:zh'] = `
<p class="lead">抽象数据类型（Abstract Data Type, ADT）只规定能做哪些操作，具体数据结构决定数据怎么存、每个操作要花多少时间。本课用得最多的 ADT 是字典（dictionary）：按键（key）查找、插入、删除记录。</p>

<h2>从一个场景说起</h2>
<p>学校系统里存着 n = 50000 名学生的记录，每条有学号、姓名、选课和成绩。教务输入学号 1003，系统要把这名学生的整条记录找出来。记录可以有好几种存法：</p>
<ul>
<li>放在<strong>无序数组</strong>里：只能从头一个个比学号。1003 在最后或者不存在时，要比 50000 次。</li>
<li>按学号<strong>排好序</strong>：二分查找，每比一次扔掉一半，最多比 16 次（⌊log₂ 50000⌋ + 1 = 16）。</li>
<li>放进<strong>哈希表</strong>：由学号直接算出位置，平均只看常数个位置（见第 4 部分）。</li>
</ul>
<p>不管哪种存法，教务做的事都一样：输入学号，拿到记录。变的只是快慢。</p>
<p>这就像用电视遥控器：按“下一台”，电视就换台，里面的电路怎么接不用管。厂家换一套电路，只要按键和作用不变，你照样会用。</p>

<h2>它是什么：ADT 和具体数据结构</h2>
<p>简单说，<strong>抽象数据类型就是一份“操作清单”</strong>：列出能对数据做哪些操作、每个操作是什么意思，但不说数据怎么存。它分两层，正好对上遥控器：</p>
<ul>
<li><strong>ADT = 接口（interface）</strong>，相当于按键，只说“做什么”。课上拿 Python 或 C++ 的类作类比：能看到有哪些函数、各做什么，看不到函数体。</li>
<li><strong>具体数据结构（concrete data structure）= 实现（implementation）</strong>，相当于电路。它规定数据在内存里怎么排、指针怎么连，所以决定每个操作的代价。</li>
</ul>
<p>两层的关系：<strong>ADT 由具体数据结构来实现，同一个 ADT 可以有多种实现。</strong></p>

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
<figcaption>调用方只经过接口访问数据；下面换成哪种实现，调用方的代码都不用改。</figcaption>
</figure>

<h3>本课的四个 ADT</h3>
<table>
<thead><tr><th>ADT</th><th>核心操作</th><th>规则</th><th>常见实现</th></tr></thead>
<tbody>
<tr><td>栈（stack）</td><td>push、pop、top</td><td>后进先出（LIFO）</td><td>数组、链表（2.7）</td></tr>
<tr><td>队列（queue）</td><td>enqueue、dequeue</td><td>先进先出（FIFO）</td><td>循环数组、链表（2.7）</td></tr>
<tr><td>字典（dictionary）</td><td>find、insert、delete</td><td>按键存取</td><td>数组、链表、BST、AVL 树、B 树、哈希表</td></tr>
<tr><td>优先队列（priority queue）</td><td>insert、extractMax（或 extractMin）、peek</td><td>优先级最高的先出</td><td>数组、链表、二叉堆（6.5）</td></tr>
</tbody>
</table>
<p>具体数据结构则有：静态数组（static array）、动态数组（dynamic array）、循环数组（circular array）、链表（linked list）、各种树、哈希表（hash table）和堆（heap）。</p>

<div class="callout warn" data-label="易错">
<p><strong>哈希表和堆都是具体结构</strong>，都建在数组上：哈希表实现字典，二叉堆实现优先队列。第 2 周曾把哈希表和栈、队列列在一起，但期末复习的总结图把它放在具体结构一侧，配对题按这个答。同理，<strong>BST 是具体结构，字典才是 ADT</strong>。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/92S4zgXN17o" title="Introduction to data structures" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：mycodeschool《Introduction to data structures》（英文，约 6.5 分钟），讲数据结构可以从两个层面看：只说能做什么的抽象数据类型，和具体怎么存的实现。</p>

<h2>看个例子：学生记录字典</h2>
<p>字典是一组数据项（item），<strong>每一项有一个唯一的键，按键存取</strong>。学生记录的键就是学号：给出学号，就能确定唯一一条记录。后面各篇画图时只画键，但每个键背后都是一整条记录。字典有五个操作：</p>
<table>
<thead><tr><th>操作</th><th>含义</th></tr></thead>
<tbody>
<tr><td>build（建立）</td><td>由一批数据项建成字典</td></tr>
<tr><td>find（也叫 search、lookup）</td><td>给出键，返回对应的数据项；不存在就报告找不到</td></tr>
<tr><td>insert（插入）</td><td>加入一个新数据项</td></tr>
<tr><td>delete（删除）</td><td>按键删去一个数据项</td></tr>
<tr><td>update（更新）</td><td>按键修改一个数据项的内容</td></tr>
</tbody>
</table>
<p>其中两个能用别的操作拼出来，看两个具体过程。</p>

<h3>build：一个个 insert</h3>
<p>从空字典开始，依次 insert 1003、1001、1004、1002，就建好了 4 条记录的字典。所以 <strong>build = 从空字典开始做 n 次 insert</strong>。</p>

<h3>update：把 1003 的成绩从 75 改成 88</h3>
<ol>
<li><strong>find(1003)</strong>：确认记录在。不在就没什么可改，报告失败。</li>
<li><strong>delete(1003)</strong>：删掉旧记录 {1003, "Chen", 75}。</li>
<li><strong>insert({1003, "Chen", 88})</strong>：放进新记录。</li>
</ol>
<p>所以 <strong>update = find + delete + insert</strong>。顺序不能乱：如果 insert 遇到已有的键会拒绝插入（下面的 C 接口就这样约定），先 insert 再 delete 的结果是新记录没进去、旧记录被删，1003 整条丢失。</p>
<p>这样一拆，<strong>真正要实现的核心操作只有 find、insert、delete 三个</strong>。拼出来的操作，代价就是各步相加。</p>

<div class="callout note" data-label="注意">
<p>只改成绩这类非键字段，find 拿到记录后就地改即可。<strong>键本身要改时必须先 delete 再 insert</strong>，因为在有序数组、BST、哈希表里，记录放在哪里由键决定。</p>
</div>

<h2>补充：在 C 里长什么样</h2>
<p>C 没有类，ADT 通常写成两个文件：<code>.h</code> 只放类型和函数原型，是接口；<code>.c</code> 写结构体和函数体，是实现。第 2 周 workshop 的多文件程序就是这种分工。</p>
<pre><code>/* dict.h: what a dictionary can do */
typedef struct {
    int  id;          /* key: student ID */
    char name[16];    /* the rest of the record */
    int  mark;
} record_t;
typedef struct dict dict_t;   /* contents hidden in the .c file */

record_t *dict_find(dict_t *d, int id);      /* NULL if absent */
int dict_insert(dict_t *d, record_t r);      /* 0 if id already there */
int dict_delete(dict_t *d, int id);          /* 0 if id absent */

/* update = find + delete + insert, using only the interface */
int dict_update(dict_t *d, record_t r) {
    if (dict_find(d, r.id) == NULL) {
        return 0;                  /* nothing to update */
    }
    dict_delete(d, r.id);
    return dict_insert(d, r);
}</code></pre>
<ul>
<li><strong>第 2–6 行</strong>：一条记录，<code>id</code> 是键。</li>
<li><strong>第 7 行</strong>：只说“有这么一个结构”，不给成员，叫不完整类型（incomplete type）。调用方能拿着 <code>dict_t *</code> 传来传去，但写 <code>d-&gt;n</code> 会编译报错。里面是数组还是链表，只有 <code>.c</code> 知道。</li>
<li><strong>第 9–11 行</strong>：三个核心操作的原型，注释写明失败时返回什么，这就是“操作的含义”。</li>
<li><strong>第 14–20 行</strong>：update 只用接口拼出来：找不到返回 0；找到了先删旧的、再插新的。</li>
</ul>
<p><code>dict_update</code> 不碰 <code>d</code> 的内部，所以 <code>.c</code> 换成数组版或链表版，这几行一个字都不用改。</p>

<h2>补充：换一种实现，速度就不同</h2>
<p>ADT 本身没有复杂度，“字典的 find 是多少”要看用什么结构实现。下表只列 find 的最坏情况，其余在各篇逐个分析（汇总见 8.2）：</p>
<table>
<thead><tr><th>具体结构</th><th>find 最坏</th><th>要点</th><th>详见</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>O(n)</td><td>线性查找</td><td>2.3</td></tr>
<tr><td>有序数组</td><td>O(log n)</td><td>二分查找；插入、删除要移位 O(n)</td><td>2.3</td></tr>
<tr><td>链表</td><td>O(n)</td><td>有序也不能二分</td><td>2.4、2.5</td></tr>
<tr><td>BST</td><td>O(n)</td><td>退化成链时最坏；平衡时 O(log n)</td><td>3.3、3.4</td></tr>
<tr><td>AVL 树</td><td>O(log n)</td><td>靠旋转保持平衡</td><td>3.5、3.6</td></tr>
<tr><td>2-3 树、B 树</td><td>O(log n)</td><td>所有叶子在同一层</td><td>3.7、3.8</td></tr>
<tr><td>哈希表</td><td>O(n)</td><td>平均 O(1)</td><td>4.1–4.5</td></tr>
</tbody>
</table>
<p>放大到算法也一样：算法常常反复调用某个 ADT 的操作，所以<strong>算法的复杂度取决于 ADT 用什么结构实现</strong>。例如 Dijkstra 每一步都从优先队列取出距离最小的顶点，优先队列用堆还是用排好序的链表，总复杂度不同（见 6.5、7.5），2015 年期末就考过。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择 / 配对</strong>：从一串名字里挑出 ADT，或者把 ADT 和能实现它的结构连线。</li>
<li><strong>场景选 ADT</strong>：撤销对应栈，按到达顺序服务对应队列，按键查记录对应字典，先处理最紧急的对应优先队列。</li>
<li><strong>填空</strong>：字典需要哪些操作；build、update 怎么拼。</li>
<li><strong>复杂度</strong>：题目会指定实现，拼出来的操作把各步相加。</li>
</ul>
<p>公式表上没有这部分，四个 ADT 的名字、规则、核心操作和配对关系都要自己记。作业也在范围内：A1、A2 用的是字典，A3 用到队列。</p>

<h3>例题 1：哪些是 ADT，场景选哪个</h3>
<p>(a) 下列哪些是抽象数据类型：栈、链表、哈希表、优先队列、二叉堆、字典、循环数组、队列、AVL 树？(b) 为每个场景选最合适的 ADT：① 文本编辑器的撤销（undo）；② 打印机按提交顺序打印；③ 输入学号查成绩；④ 急诊室按病情轻重叫号。</p>
<p><strong>(a) 栈、优先队列、字典、队列。</strong>判断方法：它说的是“能做什么”，还是“怎么存”。链表、循环数组是存法；哈希表、二叉堆建在数组上，分别实现字典和优先队列；AVL 树是平衡的 BST，也是字典的一种实现。</p>
<p><strong>(b)</strong> ① 栈：最后做的最先撤销。② 队列：先提交先打印。③ 字典：学号是键。④ 优先队列：每次取病情最重的，和到达先后无关。</p>

<h3>例题 2：有序数组实现字典</h3>
<p>用有序数组实现字典（容量足够）：find 用二分查找；insert、delete 先二分定位，再移动后面的元素。(a) 按 find + delete + insert 实现的 update，最坏是多少？(b) 从空数组开始逐个插入 n 个键，最坏是多少？什么输入顺序最坏？</p>
<p><strong>(a) O(n)。</strong>三步相加：find 二分 O(log n)；delete 二分后把后面的元素往前挪，最坏 O(n)；insert 二分后往后挪，最坏 O(n)。合计 O(n)，慢在移位。</p>
<p><strong>(b) O(n²)，键从大到小到达时最坏。</strong>第 i 次插入时已有 i − 1 个键，新键最小，要插到最前面，那 i − 1 个键全部后移一格。总移位 0 + 1 + … + (n − 1) = n(n − 1)/2，二分合计只有 O(n log n)，所以是 O(n²)。例如依次插入 8, 7, …, 1，共移位 28 次。</p>
<p>题目没说“逐个插入”时，build 也可以先把 n 项全放进去，再用第 5 部分 O(n log n) 的排序排一次。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>把哈希表、堆、BST 当成 ADT。</li>
<li>说“字典的 find 是 O(log n)”。ADT 没有复杂度；BST 实现最坏也是 O(n)。</li>
<li>说“逐个插入建有序数组是 O(n log n)”。实际 O(n²)，慢在移位。</li>
<li>update 写成先 insert 再 delete，记录会丢。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>ADT 是接口，只说做什么；具体数据结构是实现，决定怎么存、多快。一个 ADT 可以有多种实现。</li>
<li>四个 ADT：栈（LIFO）、队列（FIFO）、字典、优先队列。数组、链表、BST、哈希表、堆都是具体结构。</li>
<li>字典：每项一个唯一的键，按键存取。</li>
<li>build = n 次 insert，update = find + delete + insert，核心只有 find、insert、delete。</li>
<li>复杂度看实现：同一个 ADT、同一个算法，换一种结构，代价就变。</li>
</ul>
`;
