/* Post body — dsa-open-addressing / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-open-addressing:zh'] = `
<p class="lead">开放寻址（open addressing）不挂链表：起始槽被占，就在数组里按固定路线找下一个空槽。线性探测（linear probing）一格一格往后找，双重哈希（double hashing）让每个 key 按自己的步长跳。</p>

<h2>从一个场景说起</h2>
<p>体育馆门口有一排 10 个储物柜，编号 0–9。规定：学号末位是几，就用几号柜。</p>
<p>你的学号末位是 2，可 2 号柜有人用了。那就往右看 3 号：空的，放进去。</p>
<p>下课取包，你也从 2 号柜开始往右一个个打开，到 3 号找到了。如果打开的是一个<strong>空柜子</strong>，你马上就知道包不在这排：存包那天你走到这里就会放进去，不会再往后走。</p>
<p>这就是开放寻址。拉链法（见 4.3）像在柜子后面挂袋子；开放寻址不挂东西，<strong>一个柜子只放一个包</strong>，冲突了就在这排柜子里另找空位。</p>

<h2>它是什么</h2>
<p>简单说，开放寻址就是：<strong>所有 key 都存在数组自己的槽（slot）里，冲突（collision）了就按一条固定路线去看别的槽，直到碰到空槽。</strong>这条路线叫探测序列（probe sequence）。</p>
<p>拆开是三部分：</p>
<ul>
<li><strong>探测序列</strong>：从起始槽 h(k) 出发，下一个看哪个槽。线性探测是往右一个个看：第 i 次看 <strong>(h(k) + i) mod m</strong>，走到末尾绕回 0。</li>
<li><strong>插入</strong>：沿探测序列走，放进<strong>第一个空槽</strong>。</li>
<li><strong>查找</strong>：沿<strong>同一条</strong>探测序列走。碰到这个 key 就成功；<strong>碰到空槽就停，判定不存在</strong>（打开了空柜子）。</li>
</ul>
<p>一个槽只放一个 key，所以 <strong>n ≤ m，装载因子（load factor）α = n/m 不能超过 1</strong>（拉链法可以）。</p>
<div class="callout note" data-label="注意">有两种计数。课上的<strong>探测次数</strong>（probes）是离开起始槽后又看了几个槽，直接放进起始槽算 0 次。往年考题常问<strong>key 比较次数</strong>（key comparisons），即和几个已存的 key 比过，碰到空槽那一下不算。查一个在表里的 key：<strong>比较次数 = 插入它时的探测次数 + 1</strong>。</div>

<h2>看个例子：线性探测</h2>
<p>课上的例子：10 个学生 A…J，学号末位依次是 1、1、2、2、3、2、0、1、9、5。m = 10，h(k) = k mod 10，也就是学号末位。按 A 到 J 的顺序插入：</p>
<table>
<thead><tr><th>key</th><th>h(k)</th><th>依次检查的槽</th><th>放入</th><th>探测次数</th></tr></thead>
<tbody>
<tr><td>A</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>B</td><td>1</td><td>1, 2</td><td>2</td><td>1</td></tr>
<tr><td>C</td><td>2</td><td>2, 3</td><td>3</td><td>1</td></tr>
<tr><td>D</td><td>2</td><td>2, 3, 4</td><td>4</td><td>2</td></tr>
<tr><td>E</td><td>3</td><td>3, 4, 5</td><td>5</td><td>2</td></tr>
<tr><td>F</td><td>2</td><td>2, 3, 4, 5, 6</td><td>6</td><td>4</td></tr>
<tr><td>G</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>H</td><td>1</td><td>1, 2, 3, 4, 5, 6, 7</td><td>7</td><td><strong>6</strong></td></tr>
<tr><td>I</td><td>9</td><td>9</td><td>9</td><td>0</td></tr>
<tr><td>J</td><td>5</td><td>5, 6, 7, 8</td><td>8</td><td>3</td></tr>
</tbody>
</table>
<pre><code class="lang-text">槽:   0  1  2  3  4  5  6  7  8  9
key:  G  A  B  C  D  E  F  H  J  I     总探测 0+1+1+2+2+4+0+6+0+3 = 19</code></pre>
<p>B 和 A 末位都是 1，被挡到槽 2。C 的末位是 2，本来和 A、B 不冲突，可槽 2 已被 B 占了，只好去槽 3。到 H 时，槽 1–6 已被 A…F 连成一整段，H 只能从段头一格格走到段尾，探测 6 次才进槽 7。</p>
<p>这叫<strong>主聚集</strong>（primary clustering）：占用的槽连成一段后，落在段里任何位置的 key 都会被推到段尾，把这段再加长一格。段越长越容易接住新 key，于是越长越快。J 的末位 5 跟 1、2 毫无关系，也被拖累，探测 3 次。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-open-addressing/anims/probe.html" loading="lazy" style="height: 540px;" title="开放寻址的探测路径"></iframe>
<p class="anim-caption">用按钮切换场景：“k mod 10”就是上面这张表，“7k mod 10”是下一小节的改进；环内箭头是当前 key 的探测路径，中间显示探测次数。后三个场景属于后面的双重哈希：同一组 key 在 m = 11 时线性与双重的对比，以及步长 2 的失败。</p>

<h3>查找：碰到空槽才停</h3>
<p>在这张表里查 H：从槽 1 起依次和 A、B、C、D、E、F、H 比较，<strong>7 次比较</strong>（6 次探测 + 1）。</p>
<p>再查一个末位为 3、不在表里的学号：3…9、0、1、2 全被占，碰不到空槽，比较 10 次才确定不存在。所以<strong>循环最多走 m 次</strong>，否则表满时会一直转圈。最坏情况下所有 key 挤在一段里，查找是 <strong>O(n)</strong>。代码就是这个循环：</p>
<pre><code>#define EMPTY (-1)          /* keys are &gt;= 0 */

/* linear probing: return the slot holding key, or -1 if absent */
int lp_search(const int table[], int m, int key) {
    int idx = key % m;                      /* start at h(k) */
    for (int i = 0; i &lt; m; i++) {           /* look at most m slots */
        if (table[idx] == EMPTY) return -1; /* empty slot: key absent */
        if (table[idx] == key) return idx;  /* found it */
        idx = (idx + 1) % m;                /* next slot, wrap to 0 */
    }
    return -1;                              /* all m slots full: absent */
}</code></pre>
<ul>
<li><code>idx = key % m</code>：从起始槽 h(k) 出发。</li>
<li><code>for</code> 循环：最多看 m 个槽，表满时也能结束。</li>
<li><code>table[idx] == EMPTY</code>：碰到空槽，key 不可能在更后面，返回 −1。</li>
<li><code>table[idx] == key</code>：找到了，返回槽号。</li>
<li><code>(idx + 1) % m</code>：去下一个槽，% m 让槽 m − 1 之后绕回 0。</li>
</ul>
<p>插入是同一个循环，只是碰到空槽时把 key 放进去。</p>

<h3>换个哈希函数：7k mod 10</h3>
<p>上面的毛病出在数据：末位 1、2 太多，起始槽挤在一起。课上的改法是 <strong>h(k) = 7k mod 10</strong>（7 与 10 互质，原理见 4.1）。末位 1 → 7，2 → 4，3 → 1，0 → 0，9 → 3，5 → 5，1 和 2 被拉开了：</p>
<table>
<thead><tr><th>key</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th><th>I</th><th>J</th></tr></thead>
<tbody>
<tr><td>7k mod 10</td><td>7</td><td>7</td><td>4</td><td>4</td><td>1</td><td>4</td><td>0</td><td>7</td><td>3</td><td>5</td></tr>
<tr><td>放入</td><td>7</td><td>8</td><td>4</td><td>5</td><td>1</td><td>6</td><td>0</td><td>9</td><td>3</td><td>2</td></tr>
<tr><td>探测次数</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>2</td><td>0</td><td>2</td><td>0</td><td>7</td></tr>
</tbody>
</table>
<p>总探测从 19 降到 13。J 还是要 7 次：那时 10 个槽已占 9 个，只能从槽 5 绕到唯一的空槽 2。表快满时哪种方案都慢，定量分析见 4.5。</p>

<h2>双重哈希：每个 key 有自己的步长</h2>
<p>线性探测还有个根本问题：起始槽相同的 key，走的路完全一样，只能一个排在一个后面。</p>
<p>回到储物柜：如果有人一次走 1 格，有人一次走 3 格，同一个柜子出发的人就散开了。双重哈希就是用第二个哈希函数给每个 key 算一个<strong>步长</strong>：</p>
<pre><code class="lang-text">起点：h₁(k) = k mod m
步长：h₂(k) = (k mod q) + 1          q 是比 m 小的素数
依次检查：h₁(k)，h₁(k) + h₂(k)，h₁(k) + 2·h₂(k)，……   每一项都 mod m</code></pre>
<p>例：m = 11，q = 7，依次插入 25、36、4、91、47、15、58。其中 25、36、91、47、58 的 h₁ 都是 3，但步长各不相同：</p>
<table>
<thead><tr><th>key</th><th>h₁ = k mod 11</th><th>h₂ = (k mod 7) + 1</th><th>依次检查的槽</th><th>放入</th><th>探测次数</th></tr></thead>
<tbody>
<tr><td>25</td><td>3</td><td>5</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td>36</td><td>3</td><td>2</td><td>3, 5</td><td>5</td><td>1</td></tr>
<tr><td>4</td><td>4</td><td>5</td><td>4</td><td>4</td><td>0</td></tr>
<tr><td>91</td><td>3</td><td>1</td><td>3, 4, 5, 6</td><td>6</td><td>3</td></tr>
<tr><td>47</td><td>3</td><td>6</td><td>3, 9</td><td>9</td><td>1</td></tr>
<tr><td>15</td><td>4</td><td>2</td><td>4, 6, 8</td><td>8</td><td>2</td></tr>
<tr><td>58</td><td>3</td><td>3</td><td>3, 6, 9, 1</td><td>1</td><td>3</td></tr>
</tbody>
</table>
<p>看 58：从槽 3 起每次跳 3 格，3 → 6 → 9，都被占；下一跳 (9 + 3) mod 11 = 1，空，放进去。<strong>取模让探测绕回数组开头</strong>，不会越界。</p>
<p>总探测 10 次；同一组 key 用线性探测要 19 次。双重哈希下，只有 h₁ 和 h₂ <strong>都相同</strong>的 key 才走同一条路。</p>
<p>代码只改一处：循环前算好 <code>step = key % q + 1</code>，把 <code>idx + 1</code> 换成 <code>idx + step</code>。<strong>同一个 key 每一跳都用这个步长</strong>。</p>

<h3>步长的两个要求</h3>
<ol>
<li><strong>+1 保证步长不为 0。</strong>91 mod 7 = 0，没有 +1 的话步长是 0，探测会一直停在已被占的槽 3。</li>
<li><strong>步长必须与 m 互质</strong>（最大公约数为 1），探测才能走遍全部 m 个槽。反例：m = 10，起点 5，步长 2，依次检查 5、7、9、1、3，又回到 5，只看得到奇数号槽。如果唯一的空槽是 4，就永远找不到，尽管表里还有空位。换成步长 3（与 10 互质）：5、8、1、4，找到了。</li>
</ol>
<p>步长取值是 1…q，而 q &lt; m，所以 <strong>m 取素数</strong>时每个步长都自动与 m 互质。课上说“q 与表长互质”；严格地说，要<strong>每一个可能的步长</strong>都与 m 互质：m = 10、q = 3 时步长可能是 2，正好是上面的反例。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/AYcsTOeFVas" title="8.3 Double Hashing | Collision Resolution Technique | Data Structures and algorithms" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Jenny's Lectures CS IT《8.3 Double Hashing | Collision Resolution Technique》（英文），从公式讲起，再把一组 key 逐个插进表里处理冲突，看 1:08–13:14 这段就够。视频里第二个哈希函数的写法如果和本课的 (k mod q) + 1 不同，考试按本课的写。</p>

<h3>补充：删除不能直接清空</h3>
<div class="callout warn" data-label="易错">在第一张表（k mod 10）里删掉 D（槽 4），如果直接把槽 4 改回空，再查 H 时走到槽 4 就停了，误判 H 不存在。常见做法是把槽标成“已删除”（tombstone）：查找把它当作占用、继续往后走，插入可以重新使用它。</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>填表</strong>：给 key 序列、m、h(k) 和冲突方案，画出插入后的数组。</li>
<li><strong>数比较次数</strong>：查某个 key（常常不在表里）要比较几次。</li>
<li><strong>选方案</strong>：换哪种冲突处理能减少比较次数，结合这组数据说理由。</li>
<li><strong>选择题</strong>：查找何时停止、为什么 +1、为什么要互质、α 能否超过 1。</li>
</ul>
<p>公式表只给平均探测次数的估计式（见 4.5），两种探测的写法和 +1、互质的理由要自己记。</p>

<h3>例题 1：12 个槽，查 125</h3>
<p>哈希表有 12 个槽，h(k) = k mod 12，线性探测，依次插入 17、53、41、29。(a) 画出表；(b) 查找 125 要几次 key 比较？(c) 换哪种冲突处理能减少 (b) 的比较次数？</p>
<p>(a) 先算余数：17、53、41、29 除以 12 都余 5，全挤在槽 5。17 → 5（0 次探测），53 → 6（1 次），41 → 7（2 次），29 → 8（3 次）。</p>
<pre><code class="lang-text">槽:   0  1  2  3  4  5  6  7  8  9  10  11
key:  -  -  -  -  -  17 53 41 29 -  -   -</code></pre>
<p>(b) 125 mod 12 = 5。依次和 17、53、41、29 比较，槽 9 为空，停。<strong>4 次比较</strong>，125 不在表中。</p>
<p>(c) <strong>双重哈希</strong>。五个数对 12 都余 5，换成 (a·k) mod 12 也分不开，只能靠冲突处理。取 q = 11，它们 mod 11 各不相同，步长也不同：17 → 7，53 → 10，41 → 9，29 → 8，125 → 5。插入：17 → 5；53 在 5 冲突，跳到 (5 + 10) mod 12 = 3；41 → (5 + 9) mod 12 = 2；29 → (5 + 8) mod 12 = 1。查 125：槽 5 是 17（1 次比较），下一个 (5 + 5) mod 12 = 10 为空，停，<strong>只要 1 次</strong>。</p>
<p>拉链法不行：四个 key 都在槽 5 的链表里，查不存在的 125 要比完整条链，还是 4 次。另外 m = 12 不是素数，步长 10、9、8 与 12 都不互质，这里只是表很空才没出事。</p>

<h3>例题 2：拉链法能不能更快找到 89</h3>
<p>哈希表有 10 个槽，h(k) = k mod 10，线性探测，依次插入 1、23、43、99、44、79、89。(a) 画出表；(b) 改用拉链法，查找 89 的比较次数会减少吗？</p>
<p>(a) 1 → 1；23 → 3；43 在 3 冲突 → 4；99 → 9；44 在 4 冲突 → 5；79 在 9 冲突，绕回 → 0；89 在 9、0、1 都冲突 → 2。</p>
<pre><code class="lang-text">槽:   0   1   2   3   4   5   6  7  8  9
key:  79  1   89  23  43  44  -  -  -  99</code></pre>
<p>(b) 会。线性探测查 89：槽 9（99）、0（79）、1（1）、2（89），<strong>4 次比较</strong>，其中 1 的起始槽根本不是 9，只是挡在路上。拉链法下槽 9 的链表只有 99、79、89；课上用头插，链表是 89 → 79 → 99，<strong>1 次比较</strong>就找到，尾插也只要 3 次。</p>

<div class="callout warn" data-label="易错">① 查到的 key，比较次数 = 探测次数 + 1；碰到空槽那一下不算比较。② 过了槽 m − 1 要绕回 0。③ 线性探测里不同起始槽的 key 也会互相挡路，像例题 2 的 1。④ 双重哈希同一个 key 每一跳用同一个步长。</div>

<h2>小结</h2>
<ul>
<li>开放寻址：一个槽一个 key，α ≤ 1；插入放进探测序列上第一个空槽。</li>
<li>查找沿同一条序列走，<strong>碰到空槽就停</strong>，最多看 m 个槽；删除要用“已删除”标记。</li>
<li>线性探测：(h(k) + i) mod m，简单但有主聚集，最坏 O(n)。</li>
<li>双重哈希：起点 k mod m，步长 (k mod q) + 1。+1 防止步长为 0；步长要与 m 互质，m 取素数最稳。</li>
<li>探测次数不算起始槽；查表里的 key，比较次数 = 探测次数 + 1，空槽不算比较。</li>
</ul>
`;
