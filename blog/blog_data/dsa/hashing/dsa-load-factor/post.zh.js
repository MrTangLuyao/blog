/* Post body — dsa-load-factor / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-load-factor:zh'] = `
<p class="lead">装载因子 α = n/m 描述哈希表有多满。开放寻址一次插入的平均探测次数只由 α 决定：双重哈希约 1/(1−α)，线性探测约 1/(1−α)²，α 接近 1 时都急剧变大，表太满就要 rehash。</p>

<h2>装载因子 α = n/m</h2>
<p>m 格的表里存了 n 个键，<strong>装载因子（load factor）α = n/m</strong>。1000 格存 750 个键，α = 0.75，每 4 格有 3 格被占。</p>
<ul>
<li><strong>开放寻址</strong>（线性探测、双重哈希）每格只放一个键，<strong>n ≤ m，α ≤ 1</strong>。α = 1 时表已满，再也插不进，所以公式表写 0 ≤ α &lt; 1。</li>
<li><strong>拉链法</strong>的键挂在链表上，<strong>α 可以大于 1</strong>：10 格挂 20 个键，α = 2，即链表平均长 2。</li>
</ul>

<h2>公式表上的两个估计</h2>
<p>开放寻址插入新键要一直探测到空格才停；查找一个不存在的键（查找失败，unsuccessful search）也是碰到空格才停，两者代价相同。公式表给的就是这个平均探测次数：</p>
<pre><code class="lang-text">双重哈希（double hashing）  ≈ 1 / (1 − α)
线性探测（linear probing）  ≈ 1 / (1 − α)²</code></pre>
<p>这里的次数<strong>包括最后碰到空格的那一次</strong>，空表（α = 0）时是 1。4.4 逐个键计数时把直接放进初始位置记为 0 次，比这里少 1。</p>

<h3>双重哈希：每次探测像随机抽一格</h3>
<p>取 α = 0.75。双重哈希里每个键有自己的步长，探测到的格子近似随机，每次碰到已占格的概率都是 3/4。第 1 次探测一定要做；第 1 格被占（概率 3/4）才做第 2 次；前两格都被占（概率 (3/4)²）才做第 3 次……期望次数为</p>
<pre><code class="lang-text">1 + α + α² + α³ + … = 1 / (1 − α) = 1 / 0.25 = 4</code></pre>
<p>这是公式表上的等比求和，项数趋于无穷时 α<sup>n+1</sup> → 0。就像掷骰子等 6：成功概率为 p，平均要试 1/p 次；这里成功是碰到空格，p = 1 − α。</p>

<h3>线性探测：聚集让代价平方</h3>
<p>线性探测的已占格会连成长串（主聚集，primary clustering，见 4.4）。新键的初始位置只要落在串里任何一格，就得一路走到串尾，放下后串又长了一格。串越长越容易被撞上，也就长得越快。所以同样的 α，线性探测比双重哈希差得多：<strong>α = 0.75 时双重哈希约 4 次，线性探测约 16 次</strong>。</p>
<table>
<thead><tr><th>α</th><th>双重哈希 1/(1−α)</th><th>线性探测 1/(1−α)²</th></tr></thead>
<tbody>
<tr><td>0.25</td><td>1.33</td><td>1.78</td></tr>
<tr><td>0.5</td><td>2</td><td>4</td></tr>
<tr><td>0.75</td><td>4</td><td>16</td></tr>
<tr><td>0.9</td><td>10</td><td>100</td></tr>
<tr><td>0.99</td><td>100</td><td>10000</td></tr>
</tbody>
</table>
<ul>
<li><strong>只和 α 有关，与 n、m 各自多大无关。</strong>只要让 α 保持在某个常数以下，平均插入和查找就是 <strong>O(1)</strong>。这是平均情况，最坏仍是 O(n)。</li>
<li><strong>α → 1 时两者都趋于无穷。</strong>线性探测的估计是双重哈希的平方，两者之比正好是 1/(1−α)：α = 0.5 时差 2 倍，0.9 时差 10 倍。</li>
</ul>
<div class="callout note" data-label="注意">教科书（Knuth）给线性探测的式子是 ½(1 + 1/(1−α)²)，α = 0.75 时约 8.5。本课程公式表用 1/(1−α)²，考试按公式表算。</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-load-factor/anims/probe-curve.html" loading="lazy" style="height: 480px;" title="装载因子与平均探测次数"></iframe>
<p class="anim-caption">按“播放”让 α 从 0 增到 0.99，或点预设直接跳转。灰色虚线是拉链法查找失败的 1 + α。</p>

<h2>表太满：rehash</h2>
<p>α 超过事先定好的阈值时，分配一张更大的表（约 2 倍，取素数），把旧表的每个键<strong>用新的 m 重新计算哈希值</strong>再插进去，这叫重哈希（rehash）。不能按下标原样复制：h(k) = k mod m 依赖 m，m 变了，键应在的位置也变了。</p>
<p>例：线性探测，h(k) = k mod m，m = 7；约定插入后 α 会超过 1/2 就先 rehash 到不小于 2m 的最小素数。依次插入 12、5、19、26：</p>
<pre><code class="lang-text">插入 12：12 mod 7 = 5，空                 → 放 5
插入 5 ：5 mod 7 = 5 被占，6 空            → 放 6
插入 19：19 mod 7 = 5，5、6 被占，0 空     → 放 0
         slot   0  1  2  3  4  5  6
         m = 7  19 ·  ·  ·  ·  12 5         n = 3，α = 3/7 ≈ 0.43
插入 26：插入后 α = 4/7 &gt; 1/2 → 先 rehash，新 m = 17（≥ 14 的最小素数）
         按旧下标 0..6 的顺序重插：19 mod 17 = 2，12 mod 17 = 12，5 mod 17 = 5
         再插 26：26 mod 17 = 9
         m = 17：2 号格 19，5 号格 5，9 号格 26，12 号格 12，其余为空
         n = 4，α = 4/17 ≈ 0.24</code></pre>
<p>m = 7 时 12、5、19 的初始位置都是 5，挤成一串；m = 17 时各占一格，串消失了。<strong>一次 rehash 要扫描旧表 m 格、重插 n 个键，代价 O(m + n)</strong>，触发它的那次插入因此是 O(n)。容量每次约翻倍，与动态数组同理（见 2.6），每次插入仍是<strong>均摊 O(1)</strong>。新容量取素数：k mod m 不易受键的规律影响（见 4.1），双重哈希 1 到 m − 1 的步长也都与 m 互质。</p>

<h2>C 代码：线性探测 + rehash</h2>
<pre><code>#include &lt;stdlib.h&gt;

#define EMPTY (-1)                 /* keys are non-negative ints */

typedef struct {
    int *slot;                     /* slot[0..m-1] */
    int m;                         /* table size, a prime */
    int n;                         /* number of keys stored */
} table_t;

int is_prime(int x) {
    if (x &lt; 2) return 0;
    for (int d = 2; d * d &lt;= x; d++)
        if (x % d == 0) return 0;
    return 1;
}

int next_prime(int x) {            /* smallest prime &gt;= x */
    while (!is_prime(x)) x++;
    return x;
}

int *new_slots(int m) {            /* m empty slots */
    int *s = malloc(m * sizeof(*s));
    if (s == NULL) exit(EXIT_FAILURE);
    for (int i = 0; i &lt; m; i++) s[i] = EMPTY;
    return s;
}

/* linear probing into slot[0..m-1]; a free slot must exist */
void place(int *slot, int m, int key) {
    int i = key % m;
    while (slot[i] != EMPTY)
        i = (i + 1) % m;            /* next slot, wrapping around */
    slot[i] = key;
}

void rehash(table_t *t) {
    int newm = next_prime(2 * t-&gt;m);
    int *s = new_slots(newm);
    for (int i = 0; i &lt; t-&gt;m; i++) {      /* scan all m old slots */
        if (t-&gt;slot[i] != EMPTY) {
            place(s, newm, t-&gt;slot[i]);   /* new home: key % newm */
        }
    }
    free(t-&gt;slot);
    t-&gt;slot = s;
    t-&gt;m = newm;
}

void insert(table_t *t, int key) {
    if (2 * (t-&gt;n + 1) &gt; t-&gt;m)            /* alpha would exceed 1/2 */
        rehash(t);
    place(t-&gt;slot, t-&gt;m, key);
    t-&gt;n++;
}</code></pre>
<ul>
<li><code>table_t t = {new_slots(7), 7, 0};</code> 后依次 <code>insert</code> 12、5、19、26，就得到上面的两张表。</li>
<li>“插入后 α &gt; 1/2”写成整数比较 <code>2 * (n + 1) &gt; m</code>，不做浮点除法。</li>
<li>rehash 用 <code>place</code> 直接写进新数组，n 不变；旧数组搬完才 <code>free</code>。键假定互不相同。</li>
</ul>

<h2>删除：开放寻址不能直接清空</h2>
<p>拉链法删除只需从链表摘掉结点，开放寻址不行。在上面 rehash 前 m = 7 的表里删掉 5 时若直接把 6 号格置空，再查 19：从 5 号格开始，12 ≠ 19；6 号格空，查找停下，报告“不存在”，可 19 明明在 0 号格。常见做法是打“已删除”标记（tombstone）：查找遇到它继续往后探，插入可以重用这一格。标记同样拉长探测，rehash 时一并清掉。</p>

<h2>硬件视角：探测次数不是全部</h2>
<p>只数探测次数，拉链法查找失败平均只看约 1 + α 个位置（槽位 1 次加平均 α 个结点），看起来最省。但内存访问速度分层：CPU 缓存（cache）最快，内存（RAM）次之，磁盘最慢，与 B 树的出发点相同（见 3.8）。CPU 每次把一段连续内存搬进缓存：</p>
<ul>
<li><strong>线性探测</strong>顺着数组往后扫，下一格多半已在缓存里，<strong>对缓存最友好</strong>。</li>
<li><strong>双重哈希</strong>跳着访问，每一跳都可能落到缓存外，但不用跟指针。</li>
<li><strong>拉链法</strong>的结点逐个 malloc，散落在内存各处，沿链表每走一步都可能缓存未命中（cache miss）。</li>
</ul>
<p>所以课上比较的是<strong>每次查找的平均缓存未命中次数</strong>：拉链法随 α 变化很平稳；线性探测在 α 小时远好于拉链法，α 接近 1 时急剧变差。第 12 周客座讲座的订单簿（只考概念）也实测过：哈希表从开放寻址换成拉链法，延迟明显变大。</p>

<h2>三种方案对比</h2>
<table>
<thead><tr><th></th><th>拉链法</th><th>线性探测</th><th>双重哈希</th></tr></thead>
<tbody>
<tr><td>键放在哪</td><td>数组外的链表结点</td><td>数组本身</td><td>数组本身</td></tr>
<tr><td>α 的范围</td><td>可以 &gt; 1</td><td>≤ 1</td><td>≤ 1</td></tr>
<tr><td>平均插入</td><td>O(1)（头插，不查重）</td><td>≈ 1/(1−α)² 次探测</td><td>≈ 1/(1−α) 次探测</td></tr>
<tr><td>平均查找失败</td><td>O(1 + α)</td><td>≈ 1/(1−α)²</td><td>≈ 1/(1−α)</td></tr>
<tr><td>最坏查找</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>聚集</td><td>无</td><td>主聚集</td><td>基本没有（步长各不相同）</td></tr>
<tr><td>删除</td><td>摘掉结点即可</td><td>要打“已删除”标记</td><td>要打“已删除”标记</td></tr>
<tr><td>缓存</td><td>差，要跟指针</td><td>最好，连续扫描</td><td>中等，跳着访问</td></tr>
<tr><td>α 变大时</td><td>平缓变慢</td><td>急剧变慢</td><td>比线性探测缓</td></tr>
<tr><td>额外要求</td><td>每个键多一个 next 指针</td><td>无</td><td>第二个哈希函数，步长不为 0 且与 m 互质</td></tr>
<tr><td>空间</td><td>O(m + n)</td><td>O(m)，m ≥ n</td><td>O(m)，m ≥ n</td></tr>
</tbody>
</table>
<p>m ≥ n 时 O(m) 就是 O(m + n)，所以<strong>哈希表的空间复杂度写作 O(m + n)</strong>。空间是哈希表的主要代价：α 要小就得留大量空格，α ≤ 1/2 时至少一半的数组是空的。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>代公式计算</strong>：给出 n、m 和冲突方案，先算 α = n/m 再代公式表。式子在公式表上，要自己记住的是：它们只适用于开放寻址，数的是一次插入（= 查找失败）的平均探测次数，含碰到空格的那一次。</li>
<li><strong>反求容量</strong>：要求平均探测不超过 k 次，解出 α 的上限，再求最多存几个键或 m 至少多大。</li>
<li><strong>选择、判断</strong>：拉链法 α 能否大于 1；O(1) 是平均而非最坏；空间 O(m + n)；线性探测为什么实际可能更快。</li>
<li><strong>简答</strong>：给一个场景选冲突方案并说理由，答案落在对比表的某几行上。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>α = n/m，不是 m/n。α 越大表越满。</li>
<li>探测次数多不代表实际更慢：α 小时线性探测常常比拉链法快。</li>
<li>rehash 不能按下标复制；开放寻址删除不能直接置空。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 开放寻址哈希表 m = 2000，已存 1600 个键。(a) 按公式表，下一次插入用双重哈希、线性探测各平均探测几次？(b) 若要求线性探测的估计不超过 4 次，最多能存多少个键？(c) 双重哈希同样要求不超过 4 次，最多能存多少个键？</summary>
  <div class="qa__body">
<p>(a) α = 1600/2000 = 0.8，1 − α = 0.2。双重哈希 1/0.2 = <strong>5</strong> 次；线性探测 1/0.2² = 1/0.04 = <strong>25</strong> 次。</p>
<p>(b) 1/(1−α)² ≤ 4 ⇔ (1−α)² ≥ 1/4 ⇔ 1 − α ≥ 1/2 ⇔ α ≤ 0.5，最多 0.5 × 2000 = <strong>1000</strong> 个键。</p>
<p>(c) 1/(1−α) ≤ 4 ⇔ 1 − α ≥ 1/4 ⇔ α ≤ 0.75，最多 0.75 × 2000 = <strong>1500</strong> 个键。同样的平均代价，双重哈希能多存一半的键。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 用上面的 C 代码（线性探测，插入后 α 会超过 1/2 就先 rehash 到不小于 2m 的最小素数），从 m = 5 的空表开始依次插入 8、13、3、24、14。何时发生 rehash？最终 m 是多少、各键在几号格？插入 14 时依次检查了哪些格？</summary>
  <div class="qa__body">
<p>插入 8：2 × 1 = 2 ≤ 5，不扩；8 mod 5 = 3，放 3 号格。插入 13：2 × 2 = 4 ≤ 5；13 mod 5 = 3 被占，放 4 号格。</p>
<p>插入 3：2 × 3 = 6 &gt; 5，<strong>先 rehash</strong>，新 m = 不小于 10 的最小素数 <strong>11</strong>。按旧下标顺序重插：8 mod 11 = 8，13 mod 11 = 2。再插 3：3 mod 11 = 3，空，放 3 号格。</p>
<p>插入 24：2 × 4 = 8 ≤ 11；24 mod 11 = 2，检查 2（13）、3（3）、4（空），放 4 号格。插入 14：2 × 5 = 10 ≤ 11，不扩；14 mod 11 = 3，<strong>检查 3（3）、4（24）、5（空）</strong>，放 5 号格。</p>
<p>只 rehash 一次。最终 <strong>m = 11，n = 5</strong>：2 号格 13，3 号格 3，4 号格 24，5 号格 14，8 号格 8，α = 5/11 ≈ 0.45。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 多选，哪些正确？(A) 拉链法的装载因子可以大于 1；(B) 在同一个 α 下，按公式表线性探测的估计不小于双重哈希；(C) 开放寻址删除一个键时，把它所在的格子重新置为空即可；(D) rehash 时可以把旧数组按下标原样复制到新数组的前 m 格；(E) 哈希表的空间复杂度是 O(m + n)；(F) 线性探测探测次数更多，所以实际运行时间一定比拉链法长。</summary>
  <div class="qa__body">
<p><strong>A、B、E 正确。</strong></p>
<p>A：链表可以无限加长，α = 平均链长。B：0 ≤ α &lt; 1 时 0 &lt; 1 − α ≤ 1，所以 1/(1−α)² ≥ 1/(1−α)，α = 0 时相等。E：数组 m 格，再加拉链法的 n 个结点。</p>
<p>C 错：会截断探测序列，排在它后面的同串键会被误报不存在，要用“已删除”标记。D 错：k mod m 随 m 改变，必须逐个重新哈希。F 错：线性探测对缓存友好，α 小时常常比拉链法快。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 为下面三种情况各选一种冲突方案并说明理由：(a) 键的数量事先不知道，可能远多于表的格数，且不允许停下来 rehash；(b) 表不大，能整个放进 CPU 缓存，α 始终保持在 0.5 以下，查找极其频繁；(c) 只能用开放寻址，而且表经常要用到 α ≈ 0.9。</summary>
  <div class="qa__body">
<p>(a) <strong>拉链法</strong>。开放寻址 α 不能超过 1，满了必须 rehash；拉链法的 α 可以大于 1，平均查找 O(1 + α) 随 α 平缓增长。</p>
<p>(b) <strong>线性探测</strong>。α ≤ 0.5 时公式表估计至多 4 次探测，且连续扫描数组几乎都命中缓存；拉链法每走一个结点都可能缓存未命中。</p>
<p>(c) <strong>双重哈希</strong>。α = 0.9 时双重哈希约 1/0.1 = 10 次，线性探测约 1/0.01 = 100 次，聚集让线性探测差 10 倍。表的大小取素数，保证步长与 m 互质。</p>
  </div>
</details>
`;
