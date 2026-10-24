/* Post body — dsa-chaining / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-chaining:zh'] = `
<p class="lead">拉链法（separate chaining）是哈希表处理冲突的一种办法：每个槽挂一条链表，算到同一个槽的键都串在这条链上。插入是 O(1) 的头插；查找和删除只走一条链，平均 O(1 + α)，最坏 O(n)。</p>

<h2>从一个场景说起</h2>
<p>教学楼门口有一排挂钩，编号 0 到 9。规定：学号末位是几，外套就挂几号钩。找外套时不用把整排翻一遍，直接去自己那个钩。</p>
<p>麻烦来了：A 的学号末位是 1，B 的也是 1。1 号钩上已经有一件了，B 挂哪儿？</p>
<p>最省事的办法是叠着挂：B 的外套直接套在 A 的外面，后来的 H 再挂在最外面。找外套时还是只去 1 号钩，从最外面一件件往里翻；别的钩上挂了多少件，和你没关系。</p>
<p>这就是拉链法。</p>

<h2>它是什么</h2>
<p>哈希表（hash table）用哈希函数（hash function）h(k) 把键 k 换成数组下标。不同的键算出同一个下标，叫冲突（collision）。键的可能取值远比槽多，冲突躲不开（见 4.1），所以哈希表必须规定撞上了怎么办。</p>
<p>简单说，拉链法就是<strong>槽里不直接放键，而是挂一条链表</strong>，算到这个槽的键都串在这条链上。对回挂钩，它由三部分组成：</p>
<ul>
<li><strong>槽（slot）</strong>：一个挂钩。整张表是有 m 格的指针数组 <code>node_t *table[m]</code>，每格存一条链的链头；开始全是 NULL，也就是空钩。</li>
<li><strong>链（chain）</strong>：钩上那一串外套，就是 2.4 讲的单链表，每个结点放一个键和 next 指针。</li>
<li><strong>哈希函数 h(k)</strong>：决定去哪个钩。课上用 h(k) = k mod m。</li>
</ul>
<p>三个操作都是先算 i = h(k)，再对第 i 条链做链表操作：<strong>插入</strong>用头插，后来的排最前面，像后挂的外套在最外面；<strong>查找</strong>从链头往后逐个比较；<strong>删除</strong>让前一个结点绕过它，再 free。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/_CLIOIYw-7M" title="Hashing - Separate Chaining" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Lalitha Natraj《Hashing - Separate Chaining》（英文，约 6 分钟），讲怎样用拉链法处理冲突。若视频里新键接在链尾，画表时以本课的插在链头为准。</p>

<h2>看个例子：10 名学生 A–J</h2>
<p>课上的例子：m = 10 个槽，h(k) = k mod 10，也就是学号末位。学号前两位是示意值，末位和课上一致：</p>
<pre><code class="lang-text">学生   A    B    C    D    E    F    G    H    I    J
学号   351  641  202  972  433  812  560  721  189  905
h(k)   1    1    2    2    3    2    0    1    9    5</code></pre>

<h3>插入：每次都放链头</h3>
<p>按 A 到 J 的顺序一个个来：</p>
<ul>
<li>A 351 → 槽 1 是空的，槽 1 变成 A。</li>
<li>B 641 → 又是槽 1，冲突。B 头插，槽 1 变成 B → A。</li>
<li>C 202、D 972 → 都进槽 2，得到 D → C。</li>
<li>E 433 进槽 3；F 812 进槽 2，变成 F → D → C；G 560 进槽 0。</li>
<li>H 721 → 槽 1 变成 H → B → A。最后 I 189 进槽 9，J 905 进槽 5。</li>
</ul>
<p>插完的表（链头在左）：</p>
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
<p>槽 1 先后来了 A、B、H，链却是 H → B → A：<strong>同一条链上越晚插入的越靠前</strong>。手画时每来一个键，就把它写在那条链的最前面。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-chaining/anims/chaining.html" loading="lazy" style="height: 540px;" title="拉链法：插入、查找与删除"></iframe>
<p class="anim-caption">点“插入 A–J”逐个看算槽号和头插；“查找 351”“查找 401”“删除 641”从建好的表开始，看只在哪条链上比较了几次。</p>

<h3>查找：只走一条链</h3>
<ul>
<li>查 351（A）：h = 1，依次比较 721、641、351，第 3 次命中。</li>
<li>查 401：h = 1，比较 3 次走到 NULL，不在表中。<strong>不存在的键要比完整条链。</strong></li>
<li>查 444：h = 4，槽 4 是 NULL，比较 0 次就知道不存在。</li>
</ul>
<p>不管查哪个键，另外 9 条链一次都没碰，这就是哈希表快的原因。</p>

<h3>删除：链表删除的老套路</h3>
<p>删 641（B）：h = 1，在槽 1 的链上边走边记前驱 prev。找到 641 时 prev 停在 721，让 721 的 next 直接指向 351，再 free 掉 641，槽 1 变成 H → A。</p>
<p>要删的是链头时没有前驱，改的是 <code>table[i]</code>。整个过程只动了一条链，别的键位置都不变；开放寻址（4.4）的删除就没这么简单，对比见 4.5。</p>

<h3>代码：插入和查找</h3>
<pre><code>typedef struct node node_t;
struct node { int id; node_t *next; };   /* 键 + 下一个结点 */
int hash(int id) { return id % M; }      /* M 是槽数 */

void insert(node_t *table[], int id) {
    node_t *new = malloc(sizeof(*new));
    assert(new != NULL);
    new-&gt;id = id;
    int i = hash(id);
    new-&gt;next = table[i];        /* ① 新结点接住原链头 */
    table[i] = new;              /* ② 槽改为指向新结点 */
}

node_t *search(node_t *table[], int id) {
    node_t *p = table[hash(id)]; /* 只走这一条链 */
    while (p != NULL &amp;&amp; p-&gt;id != id)
        p = p-&gt;next;
    return p;                    /* 找不到时是 NULL */
}</code></pre>
<ul>
<li>第 1–3 行：结点和 2.4 的单链表一样，数据换成 int 学号；hash 就是取余。参数 <code>node_t *table[]</code> 等价于 <code>node_t **table</code>，函数里改 <code>table[i]</code> 改的就是调用方那张表。</li>
<li>第 6–9 行：要一个结点、放进键、算出槽号 i。</li>
<li>第 10 行 ①：新结点先接住原链头。槽是空的也没问题，接住 NULL 正好当链尾。</li>
<li>第 11 行 ②：槽改成指向新结点。两次赋值和链长、表满不满都无关，所以<strong>插入是 O(1)</strong>。①②不能对调：先改 <code>table[i]</code>，原来那条链就没有指针拿着了。</li>
<li>第 15–18 行：从槽 hash(id) 的链头出发，没到 NULL 又不是要找的键就往后走；找不到返回 NULL。<code>p != NULL</code> 必须写在前面，&amp;&amp; 短路，不会去读 NULL 的 id。</li>
</ul>
<p>注意 insert 不查重。要求键唯一时先 search 再 insert，插入的代价就和查找一样了。</p>

<h2>补充：要比较几次？看装载因子</h2>
<p>n 个键放进 m 个槽，<strong>装载因子（load factor）α = n/m</strong>，也就是平均每条链有多长。上例 n = m = 10，α = 1，各链长是 1、3、3、1、0、1、0、0、0、1。</p>
<ul>
<li><strong>查找失败（unsuccessful search）</strong>要走完整条链。哈希函数好时，不存在的键落到每个槽的机会相同，平均比较 α 次。上例对 10 个槽各查一个不存在的键：(1+3+3+1+0+1+0+0+0+1)/10 = 1 = α。</li>
<li><strong>查找成功（successful search）</strong>平均走到链的一半左右，约 1 + α/2 次。上例 A 到 J 分别要比较 3、2、3、2、1、1、1、1、1、1 次，平均 1.6。</li>
</ul>
<p>算哈希、取槽是 O(1)，再加上走链，<strong>平均查找 O(1 + α)</strong>，删除一样。只要 m 跟着 n 一起变大，让 α 不超过某个常数（扩表重哈希，见 4.5），平均就是 O(1)。</p>
<p><strong>α 可以大于 1</strong>：链表能一直加长，1000 个槽放 3000 个键也行，α = 3。开放寻址把键直接放在数组格子里，α 不能超过 1。</p>

<h2>补充：最坏情况</h2>
<p>哈希函数很差时，所有键挤进同一个槽。比如 h(k) = k mod 10 而键全是 10 的倍数：整张表退化成一条长 n 的链表，查找和删除都是 <strong>O(n)</strong>。就像全班学号末位都是 0，所有外套压在 0 号钩上。</p>
<p>课上的立场是：有一个像样的哈希函数就不会这样，所以哈希表按平均情况分析。<strong>O(1) 是平均值，不是保证。</strong></p>
<p>一个改进：每个槽不挂链表，改挂一棵平衡二叉搜索树（如 AVL 树）。就算 n 个键全进一个槽，树高也只有 O(log n)，<strong>最坏查找降到 O(log n)</strong>；代价是插入不再是 O(1) 的头插，要 O(log n) 找位置，还可能旋转。</p>
<p>空间方面：m 个槽指针加 n 个结点，共 <strong>O(m + n)</strong>。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>画表题</strong>：给出键、m 和 h(k) = k mod m，画出拉链法的表，再问查某个键要比几次。课上讲的是插在链头；往年答案也有按插在链尾来数的，两种画法比较次数不同，作答时写明用的是哪一种。</li>
<li><strong>Big-O 填空、选择</strong>（closest upper bound）：各操作的平均和最坏，见下表；也会问 α 能不能大于 1。</li>
</ul>
<table>
<thead><tr><th>拉链法（n 个键，m 个槽）</th><th>平均（哈希函数好）</th><th>最坏</th></tr></thead>
<tbody>
<tr><td>插入（头插，不查重）</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>查找、删除</td><td>O(1 + α)</td><td>O(n)，所有键同一槽</td></tr>
<tr><td>查找，桶为平衡 BST</td><td>—</td><td>O(log n)</td></tr>
<tr><td>空间</td><td>O(m + n)</td><td>O(m + n)</td></tr>
</tbody>
</table>
<p>公式表上的 1/(1−α) 和 1/(1−α)² 是开放寻址（双重哈希、线性探测）的估计，<strong>不用于拉链法</strong>。拉链法只要记住“平均链长 = α”。</p>

<h3>例题 1：画表并数比较次数</h3>
<p>m = 7，h(k) = k mod 7，拉链法，插在链头。依次插入 10、22、31、4、15、28、17、88、59。(a) 画出表；(b) 查找 10 要比较几次？查找 45 呢？(c) α 是多少？(d) 若改为插在链尾，查找 10 和 59 各比较几次？</p>
<p>(a) 先算哈希值：10→3，22→1，31→3，4→4，15→1，28→0，17→3，88→4，59→3。每个键写到所在链的最前面：</p>
<pre><code class="lang-text">0: 28 → NULL
1: 15 → 22 → NULL
2: NULL
3: 59 → 17 → 31 → 10 → NULL
4: 88 → 4 → NULL
5: NULL
6: NULL</code></pre>
<p>(b) 10 是槽 3 最早插入的，被压到了链尾，要依次比较 59、17、31、10，共 <strong>4 次</strong>。45 mod 7 = 3，比完槽 3 的 4 个结点走到 NULL，也是 <strong>4 次</strong>，结论是不存在。</p>
<p>(c) α = 9/7 ≈ 1.29。大于 1，拉链法照样放得下。</p>
<p>(d) 插在链尾时槽 3 是 10 → 31 → 17 → 59：查 10 只要 <strong>1 次</strong>，查 59 要 <strong>4 次</strong>，和插在链头正好相反。所有键的比较次数加起来不变（都是 17），只是分摊到不同的键上。</p>

<h3>例题 2：Big-O 填空</h3>
<p>写出 closest upper bound（n 个键，m 个槽）：(a) 拉链法，最坏情况下查找一个键；(b) 每个槽改用平衡二叉搜索树，最坏情况下查找；(c) m 个槽已存 m − 1 个键，用拉链法再插入一个，最坏情况；(d) 同 (c)，但用线性探测。</p>
<ul>
<li>(a) <strong>O(n)</strong>：所有键落进同一个槽，链长为 n。</li>
<li>(b) <strong>O(log n)</strong>：最坏也只是 n 个键在同一棵平衡树里，树高 O(log n)。</li>
<li>(c) <strong>O(1)</strong>：头插就两次赋值，不看链长，也不管表满不满。这道往年考过，很多人顺手答成 O(n)。</li>
<li>(d) <strong>O(m)</strong>：最坏时从起始格往后 m − 1 个格子都被占，要探到最后那个空格；这里 n = m − 1，写 O(n) 也行。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>插入 O(1) 的前提是头插且不查重；题目要求先查重时，插入变成平均 O(1 + α)、最坏 O(n)。</li>
<li>查找失败要比到链尾；落到空槽时比较 0 次。</li>
<li>删除链头时改的是 <code>table[i]</code>，不是 prev（这时 prev 是 NULL）。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>冲突躲不开。拉链法让每个槽挂一条链表，表是指针数组 <code>node_t *table[m]</code>，开始全为 NULL。</li>
<li>插入 = 对第 h(k) 条链头插，两次赋值，O(1)；同一条链上越晚插入越靠前。</li>
<li>查找、删除只走一条链：查找失败比到链尾，空槽比 0 次；删除链头改 <code>table[i]</code>。</li>
<li>α = n/m 是平均链长，可以大于 1；平均查找 O(1 + α)，α 保持常数时就是 O(1)。</li>
<li>最坏所有键进同一槽，O(n)；每个槽换成平衡 BST，最坏降到 O(log n)。</li>
</ul>
`;
