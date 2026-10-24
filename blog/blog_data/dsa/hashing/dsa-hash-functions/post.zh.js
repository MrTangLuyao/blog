/* Post body — dsa-hash-functions / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-hash-functions:zh'] = `
<p class="lead">哈希表（hash table）用一个函数把键直接算成数组下标，查找平均只要 O(1)。整数键最常用的哈希函数是 h(k) = k mod m，要点在于模数和乘数怎么选。</p>

<h2>从一个场景说起</h2>
<p>去快递驿站取件。如果包裹按到货顺序摆，店员只能一件件翻，包裹越多越慢。很多驿站换了个办法：按手机号最后一位上架，尾号 7 的包裹全在 7 号架。你报出手机号，店员直接走到 7 号架，只在那一小堆里找。</p>
<p>这个办法靠的是数组的一个性质：<strong>按下标访问是 O(1)</strong>。A[i] 的地址 = 起始地址 + i × 元素大小，算一下就到，一次比较都不用（见 2.2）。课上的例子：10 名学生 A…J 依次放在下标 0…9，要找 H 就直接读下标 7。</p>
<p>难处在于：给你一个键（学号、名字），怎么知道它在哪个下标？两个直觉办法都行不通：</p>
<ul>
<li><strong>每个可能的键各占一格</strong>，叫直接寻址（direct addressing）。长度 2 到 16 的字母串大约有 4.5 × 10²² 个，数组根本开不出来，绝大多数格子也永远是空的。</li>
<li><strong>给已有的键编号</strong>。比如把约 15 万个美国姓氏逐个编号。可要知道 “Hu” 是几号，得先在编号表里查它，又绕回了 O(n) 或 O(log n) 的查找。</li>
</ul>
<p>驿站走的是第三条路：不查表，<strong>用一条规则直接算出位置</strong>。</p>

<h2>它是什么</h2>
<p>简单说，哈希函数（hash function）就是“把键算成下标”的那条规则，哈希表就是一个数组加上这条规则。拆开来有四样东西，对回驿站：</p>
<ul>
<li><strong>键（key）</strong>：拿来找东西的值，就是手机号。</li>
<li><strong>哈希函数 h</strong>：把键变成 0 … m−1 之间的一个数，就是“取最后一位”。</li>
<li><strong>槽（slot，也叫桶 bucket）</strong>：数组的每一格，就是每个货架。键 k 的记录放进第 h(k) 个槽。表通常大半是空的，所以槽里一般只存键和指向完整记录的指针。</li>
<li><strong>冲突（collision）</strong>：两个不同的键算出同一个槽，就像两个尾号都是 7 的人。</li>
</ul>
<p>整数键最基本的哈希函数是取余：<strong>h(k) = k mod m</strong>，m 是表长。k mod m 就是 k 除以 m 的余数，C 里写 <code>k % m</code>。比如 4 mod 7 = 4，25 mod 7 = 4。余数一定在 0 … m−1 之间，正好是合法下标。“取手机号最后一位”就是 k mod 10，课上用学号末位当下标也是它。</p>
<p>冲突能完全避免吗？不能。可能的键远比槽多，m 个槽放进 m + 1 个键，至少有两个挤在一起，这叫鸽巢原理（pigeonhole principle）。哈希函数能做的，是把键<strong>尽量均匀</strong>地撒到所有槽上；撞在一起的交给 4.3 拉链法或 4.4 开放寻址处理。</p>

<div class="callout key" data-label="考点">
<p><strong>哈希表是建在数组上的具体数据结构（concrete data structure），不是 ADT</strong>。它是字典 ADT 的一种实现，Python 的 dict 就是哈希表。<strong>O(1) 只是平均情况，没有保证</strong>：函数选得差或者表太小，冲突就多；最坏时所有键挤进同一个槽，查找退化成 O(n)。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/KyUTuwz_b7Q" title="Hash Tables and Hash Functions" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Computer Science Lessons《Hash Tables and Hash Functions》（英文，约 14 分钟），讲哈希表的原理、数字键和字符串键的常用哈希函数。后面的冲突处理（线性探测、二次探测、拉链法）对应 4.4 和 4.3。</p>

<h2>看个例子：4 的倍数放进 8 个槽</h2>
<p>真实的键常常带规律：价格多以 0 或 5 结尾，内存地址按 4 字节对齐，全是 4 的倍数。课上的例子是 mod 8：12 mod 8 = 4，4 mod 8 = 4，两个键撞在 4 号槽。把 4 的倍数一个个代进去：</p>
<table>
<thead><tr><th>k</th><th>4</th><th>8</th><th>12</th><th>16</th><th>20</th><th>24</th><th>28</th><th>32</th></tr></thead>
<tbody>
<tr><td>k mod 8</td><td>4</td><td>0</td><td>4</td><td>0</td><td>4</td><td>0</td><td>4</td><td>0</td></tr>
<tr><td>k mod 7</td><td>4</td><td>1</td><td>5</td><td>2</td><td>6</td><td>3</td><td>0</td><td>4</td></tr>
</tbody>
</table>
<p>先看 mod 8 这一行。4 除以 8 余 4；8 正好整除，余 0；12 = 8 + 4，又余 4；16 = 2 × 8，余 0……余数只在 4 和 0 之间来回跳。8 个键全挤在 0 号和 4 号槽，每槽 4 个，另外 6 个槽一直空着。</p>
<p>再看 mod 7：余数依次是 4, 1, 5, 2, 6, 3, 0，七个槽各用了一次，到第 8 个键 32 才回到 4 号槽。</p>
<p>差别出在公因数上。键每次加 4，而 8 也能被 4 整除，所以余数只能是 4 的倍数，也就是 0 或 4。一般地，<strong>键都是 d 的倍数时，k mod m 只能是 gcd(d, m) 的倍数，只用得到 m / gcd(d, m) 个槽</strong>。gcd(4, 8) = 4，只剩 8 / 4 = 2 个槽；4 和 7 互素（coprime，最大公因数是 1），7 个槽都用得到。</p>
<p>素数除了 1 和它自己没有别的因数，跟任何不是它倍数的步长都互素。所以<strong>课上的建议是：模数取素数，在不超过表长的前提下尽量大</strong>，通常直接把表长定成一个素数。模数不能超过表长，否则下标越界。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-hash-functions/anims/hash-spread.html" loading="lazy" style="height: 540px;" title="不同整数哈希函数下键在 10 个槽里的分布"></iframe>
<p class="anim-caption">在“键”一行选一组键，在“h(k)”一行选函数；柱高是落进该槽的键数，红色虚框是这个函数永远到不了的槽。先选“5 的倍数”配 k mod 10，只有 0 号和 5 号两根柱子；换成 k mod 7，20 个键就摊到了 7 个槽。按 ⟲ 重置再 ▶ 播放，可以逐个看 h(k) 的计算。</p>

<h2>补充：再乘一个素数</h2>
<p>课上哈希函数的完整形式是 h(k) = (k × BIG_PRIME) mod m：先乘一个大素数再取余，用来打乱数据里的规律。关于乘数，记住三条：</p>
<ul>
<li><strong>乘数必须和 m 互素。</strong>否则能用的槽一样会缩水。极端例子：(1000 × k) mod 100 永远是 0，所有键挤进 0 号槽。</li>
<li><strong>互素的乘数不改变“谁和谁冲突”，只改变它们落在哪。</strong>mod 10 时，末位是 1、2、3 的键落在相邻的 1、2、3 号槽；7k mod 10 把这三组送到 7、4、1 号槽，彼此隔开。每个槽里的键数没变，拉链法的链长不受影响；线性探测怕相邻的满槽连成一片，隔开往往能少探测几次（课上 7k mod 10 的例子见 4.4）。</li>
<li><strong>加常数没用。</strong>(k + c) mod m 只是把所有槽号整体挪 c 格，谁冲突、谁相邻都和 k mod m 一模一样。</li>
</ul>

<div class="callout warn" data-label="易错">
<p>乘数救不了“模数和键的规律有公因数”。键全是 5 的倍数时，k mod 10 只用 0 和 5 两个槽，7k mod 10 还是只用 0 和 5（7 × 5 = 35，7 × 10 = 70）。只有换一个和 5 互素的模数才行，这正是表长取素数的理由。动画里选“5 的倍数”配 7k mod 10 就能看到。</p>
</div>

<h2>补充：C 里怎么写</h2>
<pre><code>/* h(k) = (a * k) mod m; a = 1 gives plain k mod m */
unsigned hash_int(unsigned k, unsigned a, unsigned m) {
    return (unsigned)(((unsigned long long)a * k) % m);
}

/* key may be negative: always return a slot in 0..m-1 */
int slot(int key, int m) {
    int r = key % m;      /* C99: r has the same sign as key */
    if (r &lt; 0) {
        r += m;
    }
    return r;
}</code></pre>
<ul>
<li><code>hash_int</code> 只有一行，关键是先把 a 转成 <code>unsigned long long</code> 再乘。a × k 可能超出 32 位 unsigned 的范围（比如 31 × 4000000000），在 32 位里乘会丢掉高位；在 64 位里乘完再取余就对了。余数小于 m，转回 <code>unsigned</code> 不丢东西。</li>
<li>键用 unsigned 是有原因的：C99 的 <code>%</code> 向零截断，余数的符号跟被除数一样，<code>-7 % 10</code> 得 −7，不是 3。拿 −7 当下标会访问数组前面的内存，越界。</li>
<li>如果键必须是 int，就用 <code>slot</code>：<code>r = key % m</code> 落在 −(m−1) … m−1 之间，是负数就加一次 m，一定回到 0 … m−1。例如 slot(−7, 10)：r = −7，加 10 得 3；slot(−20, 10)：r = 0，直接返回；slot(25, 7) = 4。</li>
</ul>

<h2>考试怎么考</h2>
<p>这部分常见三种题型：</p>
<ul>
<li><strong>算槽号</strong>（填空）：给出键和 h(k)，写出每个键的槽号，后面常接着做拉链或探测（4.3、4.4）。自动判分，一个数算错就没分，乘法和取模都要复核。</li>
<li><strong>选哈希函数</strong>（单选）：课上第 5 周的互动题，第 12 周复习时又出了一次。</li>
<li><strong>概念判断</strong>（多选）：哈希表是不是 ADT、最坏复杂度是多少、冲突能不能避免。</li>
</ul>

<h3>例题 1：100 个槽用哪个哈希函数</h3>
<p>键是整数，哈希表是长度 100 的数组。下面哪个哈希函数最好？选项大致如下：(A) k mod 100　(B) (1000 × k) mod 100　(C) (k + 31) mod 100　(D) (97 × k) mod 83　(E) (31 × k) mod 100。</p>
<p>答案是 <strong>E</strong>。逐个检查“能用到几个槽”：</p>
<table>
<thead><tr><th>选项</th><th>可用的槽</th><th>评价</th></tr></thead>
<tbody>
<tr><td>(A) k mod 100</td><td>100</td><td>可以接受，但数据里的规律原样保留</td></tr>
<tr><td>(B) (1000 × k) mod 100</td><td>1</td><td>1000 和 100 不互素，结果恒为 0</td></tr>
<tr><td>(C) (k + 31) mod 100</td><td>100</td><td>和 A 等价，加常数不改变分布</td></tr>
<tr><td>(D) (97 × k) mod 83</td><td>83</td><td>乘了素数，但 83…99 这 17 个槽永远空着</td></tr>
<tr><td>(E) (31 × k) mod 100</td><td>100</td><td><strong>最好</strong>：用满 100 个槽，31 是和 100 互素的素数</td></tr>
</tbody>
</table>
<p>D 容易让人犹豫，因为 83 是素数。但题目已经定死了表长 100，“模数取素数”是能自己决定表长时的建议（比如直接开 101 个槽）。表长定死时，先用 mod 100 把槽用满，再乘一个和 100 互素的素数。</p>

<h3>例题 2：手算槽号</h3>
<p>键 21, 34, 41, 55, 64, 71。(a) 表长 10，分别用 h₁(k) = k mod 10 和 h₂(k) = 7k mod 10 求槽号，各有哪些键冲突？(b) 表长 11，用 h₃(k) = k mod 11 呢？</p>
<p>先算 7k，再取余。k mod 10 就是看末位；k mod 11 要老老实实除，比如 64 = 5 × 11 + 9，余 9。</p>
<table>
<thead><tr><th>k</th><th>21</th><th>34</th><th>41</th><th>55</th><th>64</th><th>71</th></tr></thead>
<tbody>
<tr><td>k mod 10</td><td>1</td><td>4</td><td>1</td><td>5</td><td>4</td><td>1</td></tr>
<tr><td>7k</td><td>147</td><td>238</td><td>287</td><td>385</td><td>448</td><td>497</td></tr>
<tr><td>7k mod 10</td><td>7</td><td>8</td><td>7</td><td>5</td><td>8</td><td>7</td></tr>
<tr><td>k mod 11</td><td>10</td><td>1</td><td>8</td><td>0</td><td>9</td><td>5</td></tr>
</tbody>
</table>
<p>(a) h₁：21、41、71 同在 1 号槽，34、64 同在 4 号槽。h₂：21、41、71 同在 7 号槽，34、64 同在 8 号槽。冲突的组完全一样，只是换了槽号，因为 7 和 10 互素，乘 7 不改变谁和谁冲突。</p>
<p>(b) 11 和 10 互素，k mod 11 不再只看末位，6 个键落在 10、1、8、0、9、5 六个不同的槽，没有冲突。</p>

<div class="callout warn" data-label="易错">
<p>除了例题 1 里的几个坑，还要注意：题目给出键的规律（比如全是 6 的倍数）且规律和表长有公因数时，乘互素的数没用，要换模数；C 里对负数取 <code>%</code> 会得到负下标。这些规则都不在公式表上，公式表只有装载因子的探测次数估计（见 4.5）。</p>
</div>

<h2>小结</h2>
<ul>
<li>哈希表 = 数组 + 哈希函数：用 h(k) 直接算出下标，查找<strong>平均 O(1)，最坏 O(n)</strong>；它是具体数据结构，不是 ADT。</li>
<li>整数键的基本哈希函数是 <strong>h(k) = k mod m</strong>，结果在 0 … m−1。</li>
<li>冲突无法避免（鸽巢原理），好的哈希函数把键撒均匀。</li>
<li>键都是 d 的倍数时只用得到 m / gcd(d, m) 个槽，所以<strong>模数取素数、尽量接近表长</strong>。</li>
<li>h(k) = (a × k) mod m 的乘数 a <strong>必须和 m 互素</strong>；加常数没有任何作用。</li>
</ul>
`;
