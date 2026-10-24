/* Post body — dsa-open-addressing / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-open-addressing:zh'] = `
<p class="lead">开放寻址（open addressing）不挂链表，所有 key 都放在数组自己的槽里：起始槽被占，就按固定规则检查下一个候选槽，直到碰到空槽。线性探测（linear probing）每次走 1 格，双重哈希（double hashing）让每个 key 按自己的步长跳。</p>

<h2>开放寻址：冲突了就在表里另找空槽</h2>
<p>拉链法（见 4.3 冲突处理一：拉链法）把冲突的 key 挂在槽外的链表上。开放寻址的<strong>每个槽最多放一个 key</strong>：起始槽 h(k) 被占时，按一条固定的探测序列（probe sequence）去看别的槽。所以 <strong>n ≤ m，装载因子 α = n/m 不能超过 1</strong>。</p>
<ul>
<li><strong>插入</strong>：沿探测序列走，放进遇到的第一个空槽。</li>
<li><strong>查找</strong>：沿<strong>同一条</strong>探测序列走。遇到这个 key 就成功；<strong>遇到空槽就停，判定不存在</strong>，因为它若在表里，插入时就会放在这个空槽或更早的位置。</li>
</ul>
<div class="callout note" data-label="注意">两种计数要分清。课上的<strong>探测次数</strong>（probes）是离开起始槽后又看了几个槽，直接放进起始槽算 0 次。往年考题问的<strong>key 比较次数</strong>（key comparisons）是和几个已存的 key 比过，碰到空槽那一下不算。查找一个在表里的 key，比较次数 = 插入它时的探测次数 + 1。</div>

<h2>线性探测</h2>
<p>第 i 次探测看槽 <strong>(h(k) + i) mod m</strong>：h(k)、h(k) + 1、h(k) + 2……走到末尾就绕回 0。</p>
<p>课上的例子：10 个学生 A…J，学号末位依次是 1、1、2、2、3、2、0、1、9、5；m = 10，h(k) = k mod 10，就是学号末位。按 A 到 J 的顺序插入：</p>
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
<p>H 的起始槽是 1，可槽 1–6 已被 A…F 连成一整段，它只能从段头一格格走到段尾。这叫<strong>主聚集</strong>（primary clustering）：落在一段连续占用区里任何位置的 key，都会被推到段尾，把这段再加长一格；段越长，接住新 key 的机会越大，于是越长越快。J 的起始槽 5 原本跟末位 1、2 无关，也被这段拖累，探测 3 次。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-open-addressing/anims/probe.html" loading="lazy" style="height: 540px;" title="开放寻址的探测路径"></iframe>
<p class="anim-caption">按钮切换五个场景：课上例子的 k mod 10 和 7k mod 10，同一组数字 key 的线性探测和双重哈希，以及步长与 m 不互质时的失败；环内箭头是当前 key 的探测路径，中间显示本次和累计的探测次数。</p>

<h3>乘一个与 m 互质的数</h3>
<p>上面的毛病出在数据：末位 1、2 太多，起始槽挤在一起。课上的改法是 <strong>h(k) = 7k mod 10</strong>（7 是素数，与 10 互质，原理见 4.1 哈希表与整数哈希函数）：末位 1 → 7，2 → 4，3 → 1，0 → 0，9 → 3，5 → 5。末位 1 和 2 的起始槽被拉开，中间留出空位：</p>
<table>
<thead><tr><th>key</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th><th>I</th><th>J</th></tr></thead>
<tbody>
<tr><td>7k mod 10</td><td>7</td><td>7</td><td>4</td><td>4</td><td>1</td><td>4</td><td>0</td><td>7</td><td>3</td><td>5</td></tr>
<tr><td>放入</td><td>7</td><td>8</td><td>4</td><td>5</td><td>1</td><td>6</td><td>0</td><td>9</td><td>3</td><td>2</td></tr>
<tr><td>探测次数</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>2</td><td>0</td><td>2</td><td>0</td><td>7</td></tr>
</tbody>
</table>
<p>总探测从 19 降到 13。J 仍要 7 次：插入它时 10 个槽已占 9 个，只能从 5 一路绕到唯一的空槽 2。表快满时哪种方案都会变慢，定量分析见 4.5 装载因子与三种冲突方案对比。</p>

<h2>查找与 C 代码</h2>
<p>在第一张表（k mod 10）里查 H：从槽 1 起依次和 A、B、C、D、E、F、H 比较，<strong>7 次比较</strong>（6 次探测 + 1）。查一个末位为 3、不在表里的学号：3…9、0、1、2 全被占，没有空槽让它停下，比较 10 次才确定不存在，所以<strong>循环必须以 m 次为上限</strong>。最坏情况下所有 key 挤在同一段，查找是 O(n)；平均代价取决于 α。</p>
<p>下面的代码把两种探测写在一起：q = 0 时步长恒为 1，就是线性探测；q &gt; 0 时步长为 (k mod q) + 1，就是下一节的双重哈希。</p>
<pre><code>#define EMPTY (-1)      /* keys are &gt;= 0 */

/* probe step: q == 0 gives linear probing (step 1);
   q &gt; 0 gives double hashing with h2(k) = k % q + 1 */
int probe_step(int key, int q) {
    return q == 0 ? 1 : key % q + 1;
}

/* insert key; returns the number of probes, or -1 if no empty slot was reached */
int oa_insert(int table[], int m, int q, int key) {
    int idx = key % m, step = probe_step(key, q);
    for (int i = 0; i &lt; m; i++) {
        if (table[idx] == EMPTY) {
            table[idx] = key;
            return i;                       /* i occupied slots were skipped */
        }
        idx = (idx + step) % m;             /* next slot, wrapping around */
    }
    return -1;
}

/* search key; returns its slot or -1; *cmp = number of key comparisons */
int oa_search(const int table[], int m, int q, int key, int *cmp) {
    int idx = key % m, step = probe_step(key, q);
    *cmp = 0;
    for (int i = 0; i &lt; m; i++) {
        if (table[idx] == EMPTY) return -1; /* an empty slot ends the search */
        (*cmp)++;
        if (table[idx] == key) return idx;
        idx = (idx + step) % m;
    }
    return -1;                              /* looked at m slots: not there */
}</code></pre>
<div class="callout warn" data-label="易错">删除不能直接把槽改回 EMPTY。在第一张表里删掉 D（槽 4）再查 H：走到槽 4 发现是空的，查找就停了，误判 H 不存在。常见做法是把槽标成“已删除”（tombstone）：查找把它当作占用继续走，插入可以重新使用它。</div>

<h2>双重哈希</h2>
<p>线性探测里，起始槽相同的 key 走完全相同的路，只能一个排在一个后面。双重哈希给每个 key 一个自己的步长：</p>
<pre><code class="lang-text">起点：h₁(k) = k mod m
步长：h₂(k) = (k mod q) + 1          q 是比 m 小的素数
依次检查：h₁(k)，h₁(k) + h₂(k)，h₁(k) + 2·h₂(k)，……   每一项都 mod m</code></pre>
<p>例：m = 11，q = 7，依次插入 25、36、4、91、47、15、58，其中 25、36、91、47、58 的 h₁ 都是 3。</p>
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
<p>58 的最后一跳是 (9 + 3) mod 11 = 1：<strong>取模让探测绕回数组开头</strong>，不会越界。总探测 10 次；同一组 key 用线性探测要 0+1+1+3+4+4+6 = 19 次，槽 3–9 连成一整段，58 一个就探测 6 次。双重哈希下只有 h₁ 和 h₂ 都相同的 key 才走同一条路。</p>

<h3>步长的两个要求</h3>
<ol>
<li><strong>+1 保证步长不为 0。</strong>91 mod 7 = 0，没有 +1 的话步长是 0，探测永远停在已被占的槽 3。</li>
<li><strong>步长必须与 m 互质</strong>（最大公约数为 1），探测序列才能走遍全部 m 个槽。反例：m = 10，起点 5，步长 2，依次检查 5、7、9、1、3，然后又回到 5，只看得到奇数号槽；如果唯一的空槽是 4，就永远找不到，尽管表里还有空位。换成步长 3（与 10 互质）：5、8、1、4，找到了。</li>
</ol>
<p>h₂(k) 的取值是 1…q，而 q &lt; m。<strong>m 取素数</strong>时，1…m − 1 中每个数都与 m 互质，第 2 条自动满足。课上的说法是 q 与表长互质；严格地说，要求的是<strong>每一个可能的步长</strong>都与 m 互质：m = 10、q = 3 时步长可能是 2，正好掉进上面的反例。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>填表</strong>：给 key 序列、m、h(k) 和冲突方案，画出插入后的数组。逐个 key 写出检查过的槽，注意绕回 0。</li>
<li><strong>数比较次数</strong>：查某个 key（常常是不在表里的）要比较几次：从 h(k) 出发数被占的槽，碰到空槽停。</li>
<li><strong>选方案</strong>：换哪种冲突处理能减少比较次数，要结合这组数据说理由（聚集、各自的步长、链表头插）。</li>
<li>选择题：查找何时停止、为什么要 +1、为什么要互质、开放寻址的 α 能否超过 1。</li>
</ul>
<p>公式表只给 α 和平均探测次数的估计式（见 4.5）。两种探测序列的写法、+1 和互质的理由都要自己记住。常见陷阱：</p>
<ul>
<li>比较次数比探测次数多 1；碰到空槽那一下不算比较。</li>
<li>线性探测会把不同起始槽的 key 搅进同一段：练习 2 里 key 1 的起始槽和 89 不同，却挡在 89 的路上。</li>
<li>双重哈希的步长由 key 决定，同一个 key 每一跳都用同一个步长；不要每跳重新算。</li>
<li>所有 key 对 m 同余时（练习 1 的四个 key 对 12 都余 5），把 h 换成 (a·k) mod m 也救不了，只能靠冲突处理。</li>
</ul>

<h2>练习</h2>

<details class="qa">
<summary class="ripple-surface">1. 哈希表有 12 个槽，h(k) = k mod 12，线性探测，依次插入 17、53、41、29。(a) 画出表；(b) 查找 125 需要几次 key 比较？(c) 换哪种冲突处理能减少 (b) 的比较次数？</summary>
<div class="qa__body">
<p>(a) 17、53、41、29 除以 12 都余 5，全部冲突在槽 5：17 → 5（0 次探测），53 → 6（1 次），41 → 7（2 次），29 → 8（3 次）。</p>
<pre><code class="lang-text">槽:   0  1  2  3  4  5  6  7  8  9  10  11
key:  -  -  -  -  -  17 53 41 29 -  -   -</code></pre>
<p>(b) 125 mod 12 = 5：依次与 17、53、41、29 比较，槽 9 为空，停。<strong>4 次比较</strong>，125 不在表中。</p>
<p>(c) <strong>双重哈希</strong>。五个数对 12 都余 5，h₁ 区分不了它们；取 q = 11，它们 mod 11 各不相同，步长也就不同：17 → 7，53 → 10，41 → 9，29 → 8，125 → 5。插入：17 → 5；53 在 5 冲突，跳到 (5 + 10) mod 12 = 3；41 → (5 + 9) mod 12 = 2；29 → (5 + 8) mod 12 = 1。查 125：槽 5 是 17（1 次比较），下一个 (5 + 5) mod 12 = 10 为空，停：<strong>1 次</strong>。拉链法在这里不行：四个 key 都在槽 5 的链表里，查不存在的 125 要比完整条链表，还是 4 次。另外 m = 12 不是素数，步长 10、9、8 都与 12 不互质，这里只是表很空才没出问题；实际设计应把 m 取成素数。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 哈希表有 10 个槽，h(k) = k mod 10，线性探测，依次插入 1、23、43、99、44、79、89。(a) 画出表；(b) 改用拉链法，查找 89 的 key 比较次数会减少吗？</summary>
<div class="qa__body">
<p>(a) 1 → 1；23 → 3；43 在 3 冲突 → 4；99 → 9；44 在 4 冲突 → 5；79 在 9 冲突，绕回 → 0；89 在 9、0、1 冲突 → 2。</p>
<pre><code class="lang-text">槽:   0   1   2   3   4   5   6  7  8  9
key:  79  1   89  23  43  44  -  -  -  99</code></pre>
<p>(b) 会。线性探测查 89：槽 9（99）、0（79）、1（1）、2（89），共 <strong>4 次比较</strong>，其中 1 的起始槽根本不是 9，只是挡在路上。拉链法下槽 9 的链表只有 99、79、89；课上用头插，链表是 89 → 79 → 99，<strong>1 次比较</strong>就找到。即使尾插（99 → 79 → 89）也只要 3 次。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. m = 11，h₁(k) = k mod 11，h₂(k) = (k mod 5) + 1，用双重哈希依次插入 20、31、42、9、53、64。(a) 画出表，写出每个 key 的探测次数；(b) 查找 86 需要几次 key 比较？(c) 同一组 key 改用线性探测，总探测次数是多少？</summary>
<div class="qa__body">
<p>(a) 六个 key 的 h₁ 都是 9（20 = 11 + 9，31 = 22 + 9，……，64 = 55 + 9）。步长：20 → 0 + 1 = 1，31 → 2，42 → 3，9 → 5，53 → 4，64 → 5。</p>
<ul>
<li>20 → 9，0 次。</li>
<li>31：9 被占，(9 + 2) mod 11 = 0 → 0，1 次。</li>
<li>42：(9 + 3) mod 11 = 1 → 1，1 次。</li>
<li>9：(9 + 5) mod 11 = 3 → 3，1 次。</li>
<li>53：(9 + 4) mod 11 = 2 → 2，1 次。</li>
<li>64：9 被占；(9 + 5) mod 11 = 3 被 key 9 占；(3 + 5) mod 11 = 8 → 8，2 次。64 和 9 的 h₁、h₂ 都相同，所以走同一条路。</li>
</ul>
<pre><code class="lang-text">槽:   0   1   2   3  4  5  6  7  8   9   10
key:  31  42  53  9  -  -  -  -  64  20  -</code></pre>
<p>(b) 86 mod 11 = 9，步长 (86 mod 5) + 1 = 2：槽 9（20）、0（31）、2（53）、4 为空，停。<strong>3 次比较</strong>，86 不在表中；槽 1 的 42 不在它的路上。</p>
<p>(c) 线性探测：20 → 9（0），31 → 10（1），42 → 0（2），9 → 1（3），53 → 2（4），64 → 3（5），总共 <strong>15 次</strong>；双重哈希总共 6 次。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. m = 10，双重哈希的步长 h₂(k) = (k mod 3) + 1。(a) 哪个步长可能让插入在表未满时失败？(b) 去掉 +1 会怎样？(c) 怎样改才安全？</summary>
<div class="qa__body">
<p>(a) 步长只可能是 1、2、3。<strong>步长 2</strong> 与 10 的最大公约数是 2，从起点出发只能到达与起点奇偶相同的 5 个槽。比如 25：起点 5，步长 25 mod 3 + 1 = 2，只检查 5、7、9、1、3；若剩下的空槽都是偶数号，插入失败。步长 1 和 3 与 10 互质，能走遍全部槽。</p>
<p>(b) k 是 3 的倍数时 k mod 3 = 0，步长为 0，探测原地不动：起始槽被占就永远找不到别的槽（若删掉上面代码里的 +1，oa_insert 会在同一个槽上空转 m 次后返回 −1）。</p>
<p>(c) 把 m 改成素数，例如 11：步长 1、2、3 都与 11 互质，探测序列一定能走遍全部 11 个槽。</p>
</div>
</details>
`;
