/* Post body — dsa-chaining / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-chaining:zh'] = `
<p class="lead">拉链法（separate chaining）让哈希表的每个槽挂一条链表，哈希值相同的键都串在同一条链上。插入只在链头改两个指针，是 O(1)；查找和删除只走一条链，平均 O(1 + α)，最坏 O(n)。</p>

<h2>冲突：几个键要进同一个槽</h2>
<p>课上的例子：10 名学生 A–J，用学号对 10 取余（也就是学号末位）作下标，存进有 10 个槽（slot）的数组。末位依次是 1、1、2、2、3、2、0、1、9、5；下面学号的前两位是补上的示意值，末位与课上一致：</p>
<pre><code class="lang-text">学生   A    B    C    D    E    F    G    H    I    J
学号   351  641  202  972  433  812  560  721  189  905
h(k)   1    1    2    2    3    2    0    1    9    5</code></pre>
<p>A、B、H 都要进槽 1，C、D、F 都要进槽 2。不同的键算出同一个下标，叫冲突（collision）。键的可能取值远多于槽数，冲突无法完全避免（见 4.1），哈希表必须规定冲突时怎么办。</p>
<p>拉链法的做法：槽里不直接放键，而是放一个指针，指向一条单链表的第一个结点；哈希到这个槽的键全挂在这条链上，空槽存 NULL。整张表就是一个有 m 个元素的指针数组 <code>node_t *table[m]</code>，初始全为 NULL。</p>

<h2>插入：放到链头</h2>
<p>插入键 k：算出 i = h(k)，对第 i 条链做头插（见 2.4 链表）：先 <code>new-&gt;next = table[i];</code> 让新结点接住原链头，再 <code>table[i] = new;</code> 让槽指向新结点。两次赋值，与链有多长、表里已有多少键都无关：<strong>插入是 O(1)</strong>。两步不能对调，先改 <code>table[i]</code> 会丢掉原来的整条链。依次插入 A–J，结果如下（链头在左）：</p>
<pre><code class="lang-text">0: G 560 → NULL
1: H 721 → B 641 → A 351 → NULL
2: F 812 → D 972 → C 202 → NULL
3: E 433 → NULL
4: NULL
5: J 905 → NULL
6: NULL
7: NULL
8: NULL
9: I 189 → NULL</code></pre>
<p>槽 1 先后来了 A、B、H，链却是 H → B → A：<strong>同一条链上越晚插入的越靠前</strong>。手画时每来一个键，就把它写在所在链的最前面。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-chaining/anims/chaining.html" loading="lazy" style="height: 540px;" title="拉链法：插入、查找与删除"></iframe>
<p class="anim-caption">“插入 A–J”逐个演示算槽号和头插；查找、删除从建好的表开始，看只在哪条链上比较了几次。</p>

<h2>查找与删除：只走一条链</h2>
<p>查找键 k：算出 i = h(k)，只在第 i 条链上从头逐个比较，其余 m − 1 条链完全不碰。</p>
<ul>
<li>查 351（A）：h = 1，依次比较 721、641、351，第 3 次命中。</li>
<li>查 401：h = 1，比较 3 次后走到 NULL，401 不在表中。<strong>不存在的键要比较完整条链。</strong></li>
<li>查 444：h = 4，槽 4 是 NULL，比较 0 次就知道不存在。</li>
</ul>
<p>删除就是在那一条链上做单链表的按键删除：边走边记前驱 prev，找到后让 prev 绕过它（删的是链头时改的是 <code>table[i]</code>），再 free。删 641（B）时 prev 停在 721，令 721 直接指向 351。只动了一条链，其他键的位置和查找路径都不变；开放寻址（4.4）的删除没这么简单，对比见 4.5。</p>

<h2>代价：装载因子 α</h2>
<p>n 个键放进 m 个槽，<strong>装载因子（load factor）α = n/m</strong>，也就是平均链长。上例 n = m = 10，α = 1，各链长为 1、3、3、1、0、1、0、0、0、1。</p>
<ul>
<li><strong>未命中的查找</strong>要走完整条链。哈希函数好时，一个不存在的键落进各个槽的机会相同，平均比较次数就是平均链长 α。上例对 10 个槽各查一个不存在的键：(1+3+3+1+0+1+0+0+0+1)/10 = 1 = α。</li>
<li><strong>命中的查找</strong>平均走到链的一半左右，约 1 + α/2 次。上例 A 到 J 分别要比较 3、2、3、2、1、1、1、1、1、1 次，平均 1.6。</li>
</ul>
<p>算哈希值、取槽是 O(1)，再加上走链，<strong>平均查找 O(1 + α)</strong>，删除相同。只要 m 随 n 一起增大，让 α 不超过某个常数（扩表重哈希，见 4.5），平均就是 O(1)。</p>
<p><strong>α 可以大于 1。</strong>链表可以一直加长，1000 个槽放 3000 个键也行：α = 3，平均每条链 3 个结点。开放寻址把键直接放在数组里，α 不能超过 1。</p>
<p><strong>最坏情况 O(n)。</strong>哈希函数很差时所有键落进同一个槽，例如 h(k) = k mod 10 而键全是 10 的倍数：整张表退化成一条长 n 的链表，查找和删除都是 O(n)。课上的立场是：有一个像样的哈希函数就不会这样，所以哈希表按平均情况分析，<strong>O(1) 是平均值，不是保证</strong>。</p>
<p>每个槽也可以不挂链表，改挂一棵平衡二叉搜索树（如 AVL 树）。即使 n 个键全进同一个槽，那棵树的高度也只有 O(log n)，<strong>最坏查找降为 O(log n)</strong>；代价是插入不再是 O(1) 的头插，要 O(log n) 找位置并可能旋转。</p>
<p>空间：m 个槽指针加 n 个结点，每个结点比键多一个 next 指针，共 <strong>O(m + n)</strong>。</p>

<h2>C 实现</h2>
<p>键是非负整数学号。参数 <code>node_t *table[]</code> 等价于 <code>node_t **table</code>，函数里改 <code>table[i]</code> 改的就是调用方的那张表。三个操作都是先算 i = hash(id)，再对 <code>table[i]</code> 这条链做单链表操作：</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

#define M 10                              /* 槽数 m */

typedef struct node node_t;
struct node {
    int id;                               /* 键：学号（非负） */
    node_t *next;
};

int hash(int id) { return id % M; }

void insert(node_t *table[], int id) {
    node_t *new = malloc(sizeof(*new));
    assert(new != NULL);
    new-&gt;id = id;
    int i = hash(id);
    new-&gt;next = table[i];                 /* ① 新结点接住原链头 */
    table[i] = new;                       /* ② 槽改为指向新结点 */
}

node_t *search(node_t *table[], int id) {
    node_t *p = table[hash(id)];          /* 只走这一条链 */
    while (p != NULL &amp;&amp; p-&gt;id != id)
        p = p-&gt;next;
    return p;                             /* 找不到时为 NULL */
}

int delete_key(node_t *table[], int id) {
    int i = hash(id);
    node_t *prev = NULL, *p = table[i];
    while (p != NULL &amp;&amp; p-&gt;id != id) {
        prev = p;
        p = p-&gt;next;
    }
    if (p == NULL) return 0;              /* 不在表中 */
    if (prev == NULL) table[i] = p-&gt;next; /* 删的是链头：改槽 */
    else prev-&gt;next = p-&gt;next;
    free(p);
    return 1;
}

void free_table(node_t *table[]) {
    for (int i = 0; i &lt; M; i++) {
        while (table[i] != NULL) {
            node_t *p = table[i];
            table[i] = p-&gt;next;           /* 先摘下链头，再 free */
            free(p);
        }
    }
}

int main(void) {
    node_t *table[M] = {NULL};            /* m 条空链 */
    int ids[] = {351, 641, 202, 972, 433, 812, 560, 721, 189, 905};
    for (int k = 0; k &lt; 10; k++)
        insert(table, ids[k]);            /* 得到上面那张表 */
    printf("%d\\n", search(table, 351) != NULL);   /* 比较 3 次，输出 1 */
    delete_key(table, 641);               /* 槽 1 变为 721 -&gt; 351 */
    free_table(table);
    return 0;
}</code></pre>
<p><code>insert</code> 不检查键是否已经存在；要求键唯一时先 search 再插（练习 3），插入的代价就和查找一样。键可能为负时，C 的 <code>%</code> 会得到负数，下标越界，要先转成 unsigned 再取余。</p>

<h2>考试怎么考</h2>
<table>
<thead><tr><th>拉链法（n 个键，m 个槽）</th><th>平均（哈希函数好）</th><th>最坏</th></tr></thead>
<tbody>
<tr><td>插入（头插，不查重）</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>查找、删除</td><td>O(1 + α)</td><td>O(n)，所有键同一槽</td></tr>
<tr><td>查找，桶为平衡 BST</td><td>—</td><td>O(log n)</td></tr>
<tr><td>空间</td><td>O(m + n)</td><td>O(m + n)</td></tr>
</tbody>
</table>
<ul>
<li><strong>画表题</strong>：给出键、m 和 h(k) = k mod m，画出拉链法的结果，再问查找某个键要比较几次。课上讲的是插在链头；往年答案也有按插在链尾来数的，两种画法比较次数不同，作答时写明用的是哪一种。</li>
<li><strong>Big-O 填空</strong>（closest upper bound）：往年考过“桶用平衡搜索树时的最坏查找”，答 O(log n)；也考过“m 个槽已有 m − 1 个键，用拉链法再插入一个的最坏情况”，答 <strong>O(1)</strong>：头插不看链长，也不管表有多满。同样的情形换成线性探测，最坏要探过 m − 1 个被占的格子，是 O(m)。</li>
<li>公式表上的 1/(1−α) 和 1/(1−α)² 是开放寻址（双重哈希、线性探测）的插入估计，<strong>不用于拉链法</strong>。拉链法只需记住“平均链长 = α”，比较次数由此推出。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>别把上面那道插入题答成 O(n)。O(1) 的前提是头插且不查重；题目要求先查重时，插入变成平均 O(1 + α)、最坏 O(n)。</li>
<li>未命中的查找要比较到链尾；落到空槽时比较 0 次。</li>
<li>删除链头时改的是 <code>table[i]</code>，不是 prev（此时 prev 为 NULL）。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. m = 7，h(k) = k mod 7，拉链法，插在链头。依次插入 10、22、31、4、15、28、17、88、59。(a) 画出表；(b) 查找 10 要比较几次？查找 45 呢？(c) α 是多少？(d) 若改为插在链尾，查找 10 和 59 各比较几次？</summary>
<div class="qa__body">
<p>(a) 哈希值：10→3，22→1，31→3，4→4，15→1，28→0，17→3，88→4，59→3。每个键写到所在链的最前面：</p>
<pre><code class="lang-text">0: 28 → NULL
1: 15 → 22 → NULL
2: NULL
3: 59 → 17 → 31 → 10 → NULL
4: 88 → 4 → NULL
5: NULL
6: NULL</code></pre>
<p>(b) 10 在槽 3 的链尾，依次比较 59、17、31、10，共 <strong>4 次</strong>。45 mod 7 = 3，比较完槽 3 的 4 个结点后到 NULL，也是 <strong>4 次</strong>，结论是不存在。</p>
<p>(c) α = 9/7 ≈ 1.29，大于 1，拉链法照样能放下。</p>
<p>(d) 插在链尾时槽 3 是 10 → 31 → 17 → 59：查 10 只要 <strong>1 次</strong>，查 59 要 <strong>4 次</strong>（插在链头时正好相反）。所有键的比较次数总和不变（都是 17），只是分摊到不同的键上。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 写 closest upper bound（n 个键，m 个槽）：(a) 拉链法，最坏情况下查找一个键；(b) 每个槽改用平衡二叉搜索树，最坏情况下查找；(c) m 个槽已存 m − 1 个键，用拉链法再插入一个，最坏情况；(d) 同 (c)，但用线性探测；(e) 哈希函数好且 m 与 n 成正比时，拉链法的平均查找。</summary>
<div class="qa__body">
<p>(a) <strong>O(n)</strong>：所有键落进同一个槽，链长为 n。(b) <strong>O(log n)</strong>：最坏也只是 n 个键在同一棵平衡树里，树高 O(log n)。(c) <strong>O(1)</strong>：头插两次赋值，与链长和表满不满无关。(d) <strong>O(m)</strong>：最坏时从起始格往后的 m − 1 个格子都被占，要探测到最后一个空格；这里 n = m − 1，也可写 O(n)。(e) <strong>O(1)</strong>：α = n/m 是常数，O(1 + α) = O(1)。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. 用上面的 search 和 insert 写 int insert_unique(node_t *table[], int id)：键已存在时不插入并返回 0，否则插入并返回 1。它的平均和最坏复杂度是多少？在 A–J 的表上依次调用 insert_unique(table, 641) 和 insert_unique(table, 401) 后，槽 1 是什么样？</summary>
<div class="qa__body">
<pre><code>int insert_unique(node_t *table[], int id) {
    if (search(table, id) != NULL)
        return 0;                         /* 已存在：不插入 */
    insert(table, id);
    return 1;
}</code></pre>
<p>先在 h(id) 那条链上查一遍，代价由查找决定：<strong>平均 O(1 + α)，最坏 O(n)</strong>，后面的头插只是 O(1)。</p>
<p>641 已在槽 1，返回 0，表不变。401 不存在（比较 3 次到 NULL），头插进槽 1，返回 1。槽 1 变为 401 → 721 → 641 → 351 → NULL。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">4. 多选：下列关于拉链法的说法哪些正确？A. 装载因子可以大于 1；B. 哈希表是一种抽象数据类型（ADT）；C. 哈希函数好时，未命中查找的平均比较次数约为 α；D. 每次查找都保证是 O(1)；E. 删除一个键只改动它所在那条链上的一个指针（或那个槽）；F. 把每条链按键排好序，就能用二分查找加速。</summary>
<div class="qa__body">
<p>正确的是 <strong>A、C、E</strong>。</p>
<ul>
<li>A 对：链表可以无限加长，n 可以超过 m。</li>
<li>B 错：哈希表是用数组实现的具体数据结构（concrete data structure），字典才是 ADT。</li>
<li>C 对：未命中要走完整条链，平均链长是 n/m = α。</li>
<li>D 错：O(1) 只是平均情况，所有键冲突时是 O(n)。</li>
<li>E 对：让前驱（或槽）绕过被删结点，再 free，其他链不受影响。</li>
<li>F 错：链表不能随机访问，到不了中间结点，有序也只能顺序查找。</li>
</ul>
</div>
</details>
`;
