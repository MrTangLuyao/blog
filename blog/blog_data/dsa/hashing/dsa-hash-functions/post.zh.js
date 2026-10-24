/* Post body — dsa-hash-functions / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-hash-functions:zh'] = `
<p class="lead">哈希表（hash table）用哈希函数（hash function）把键直接算成数组下标，查找平均只要 O(1)。整数键最常用的哈希函数是 h(k) = k mod m；模数和乘数选得不好，带规律的键就会挤进少数几个槽。</p>

<h2>从数组下标到哈希函数</h2>
<p>数组按下标访问是 O(1)：A[i] 的地址 = 起始地址 + i × 元素大小（见 2.2）。课上的小例子：10 名学生 A…J 依次放在下标 0…9，要找 H 就直接算出下标 7 的地址去读，一次比较都不用。难处在于<strong>给定一个键，怎么知道它在哪个下标</strong>：</p>
<ul>
<li><strong>每个可能的键各占一格</strong>（直接寻址）：长度 2 到 16 的字母串共 26² + 26³ + … + 26¹⁶ ≈ 4.5 × 10²² 个，数组根本开不出来，绝大多数格子也永远是空的。很多时候键的范围甚至是未知的。</li>
<li><strong>给已有的键编号</strong>：美国姓氏库约 15 万个姓，逐个编号。可是要知道 “Hu” 的编号，得先在这张编号表里查它，又回到了 O(n) 或 O(log n) 的查找。</li>
</ul>
<p>出路是用一个函数<strong>直接算出</strong>下标。哈希函数 h 把键 k 映射到 0 … m−1，记录放进长度为 m 的数组的第 h(k) 格。这个数组就是哈希表，每一格叫槽（slot）或桶（bucket）。理想的 h 计算快，并且把不同的键送进不同的槽。表通常很大且大半是空的，所以槽里一般只存键和指向完整记录的指针。</p>

<div class="callout key" data-label="考点">
<p><strong>哈希表是具体数据结构（concrete data structure），建在数组上，不是 ADT</strong>，它是字典 ADT 的一种实现（Python 的 dict 就是哈希表）。<strong>O(1) 查找只是平均情况，没有保证</strong>：哈希函数差，或者表相对键数太小，冲突就多；最坏时所有键挤进同一个槽，查找退化成 O(n)。</p>
</div>

<h2>取模：h(k) = k mod m</h2>
<p>k mod m 是 k 除以 m 的余数，C 里写 <code>k % m</code>。例如 4 mod 7 = 4，25 mod 7 = 4。余数一定在 0 … m−1 之间，正好是 m 格数组的合法下标，所以<strong>整数键最基本的哈希函数是 h(k) = k mod m，m 取表长</strong>。课上用学号末位当下标，就是 h(k) = k mod 10。</p>
<p>两个不同的键落进同一个槽叫冲突（collision）。可能出现的键远多于槽，由鸽巢原理（pigeonhole principle）必有不同的键共用一个槽；存进 m + 1 个键时一定有冲突。所以<strong>冲突无法避免</strong>，只能靠好的哈希函数把键<strong>均匀</strong>地撒到所有槽上，剩下的冲突交给 4.3 拉链法或 4.4 开放寻址处理。</p>

<h2>模数为什么取素数</h2>
<p>真实的键常带规律：以 0 或 5 结尾的价格、末位集中的学号、按 4 字节对齐的内存地址。课上的例子是 mod 8：12 和 4 都得 4。把 4 的倍数依次代入：</p>
<table>
<thead><tr><th>k</th><th>4</th><th>8</th><th>12</th><th>16</th><th>20</th><th>24</th><th>28</th><th>32</th></tr></thead>
<tbody>
<tr><td>k mod 8</td><td>4</td><td>0</td><td>4</td><td>0</td><td>4</td><td>0</td><td>4</td><td>0</td></tr>
<tr><td>k mod 7</td><td>4</td><td>1</td><td>5</td><td>2</td><td>6</td><td>3</td><td>0</td><td>4</td></tr>
</tbody>
</table>
<p>mod 8 只用到 0 和 4 两个槽，8 个键每槽 4 个；mod 7 用到了全部 7 个槽。原因是公因数：<strong>键都是 d 的倍数时，k mod m 只能是 g = gcd(d, m) 的倍数，只用得到 m / g 个槽</strong>。4 与 8 的最大公因数是 4，只剩 8 / 4 = 2 个槽；4 与 7 互素（coprime，最大公因数为 1），7 个槽都用得到。素数 m 与任何不是它倍数的步长都互素，所以<strong>课上的建议是模数取素数，在不超过数组长度的前提下尽量大</strong>，通常直接把表长定成一个大素数。模数不能超过表长，否则下标越界。</p>

<h2>乘一个素数：h(k) = (a × k) mod m</h2>
<p>课上哈希函数的完整形式是 h(k) = (k × BIG_PRIME) mod m，乘数是一个与 m 互素的大素数，用来打乱数据里的规律。三种改动要分清：</p>
<ul>
<li><strong>乘数必须与 m 互素。</strong>若 gcd(a, m) = g &gt; 1，a × k mod m 只能是 g 的倍数，可用的槽缩成 m / g 个。极端情况：(1000 × k) mod 100 恒为 0，所有键挤进 0 号槽。</li>
<li><strong>与 m 互素的乘数不改变哪些键互相冲突</strong>：k₁ mod m = k₂ mod m 当且仅当 a·k₁ mod m = a·k₂ mod m。它改变的是每组键落在哪个槽。mod 10 时末位为 1、2、3 的键落在相邻的 1、2、3 号槽；7k mod 10 把它们分到 7、4、1 号槽，彼此隔开。每个槽的键数还是那几个数，拉链法的链长不受影响；线性探测则会让相邻的满槽连成一片，把各组隔开往往能少探测几次（课上 7k mod 10 的例子见 4.4）。</li>
<li><strong>加常数没有作用</strong>：(k + c) mod m 只是把所有槽号循环平移 c 格，谁和谁冲突、谁和谁相邻都和 k mod m 一样。</li>
</ul>

<div class="callout warn" data-label="易错">
<p>乘数救不了“模数与键的规律有公因数”。键都是 5 的倍数时，k mod 10 只用到 0 和 5 两个槽，7k mod 10 仍然只用到 0 和 5（7 × 5 = 35，7 × 10 = 70）。只有换一个与 5 互素的模数才行，这正是表长取素数的理由。</p>
</div>

<iframe class="anim-frame" src="blog/blog_data/dsa-hash-functions/anims/hash-spread.html" loading="lazy" style="height: 540px;" title="不同整数哈希函数下键在 10 个槽里的分布"></iframe>
<p class="anim-caption">选一组键和一个哈希函数，柱高是落进该槽的键数，红色虚框是这个函数永远到不了的槽。切换后直接显示结果；按 ⟲ 重置 再 ▶ 播放，可以逐个看 h(k) 的计算。</p>

<h2>课上的选择题：100 个槽用哪个哈希函数</h2>
<p>第 5 周的课堂互动题，第 12 周复习时又出了一次：键是整数，哈希表是长度 100 的数组，哪个哈希函数最好？选项大致如下（常数为示意）：</p>
<table>
<thead><tr><th>哈希函数</th><th>可用的槽</th><th>评价</th></tr></thead>
<tbody>
<tr><td>k mod 100</td><td>100</td><td>可以接受</td></tr>
<tr><td>(1000 × k) mod 100</td><td>1</td><td>1000 不是素数，与 100 不互素，结果恒为 0</td></tr>
<tr><td>(k + 31) mod 100</td><td>100</td><td>与 k mod 100 等价，加常数不改变分布</td></tr>
<tr><td>(97 × k) mod 83</td><td>83</td><td>乘了素数，但 83…99 这 17 个槽永远空着，浪费空间</td></tr>
<tr><td>(31 × k) mod 100</td><td>100</td><td><strong>最好</strong>：用满 100 个槽，31 是与 100 互素的素数</td></tr>
</tbody>
</table>
<p>注意题目已经给定数组长度为 100。“模数取素数”是能自己决定表长时的建议（例如直接开 101 个槽）；表长定死时用 mod 100 把槽用满，再乘一个与 100 互素的素数。</p>

<h2>C 实现</h2>
<p>a × k 可能超出 32 位 unsigned 的范围（例如 31 × 4000000000），所以先转成 unsigned long long 再乘、再取模。下面的程序把 4, 8, …, 64 这 16 个键分别用四种函数放进槽里，数出每个槽有几个键：</p>
<pre><code>#include &lt;stdio.h&gt;

/* h(k) = (a * k) mod m; a = 1 gives plain k mod m */
unsigned hash_int(unsigned k, unsigned a, unsigned m) {
    /* a * k may not fit in unsigned: multiply in 64 bits */
    return (unsigned)(((unsigned long long)a * k) % m);
}

/* count[s] = how many of the n keys land in slot s (0..m-1) */
void count_slots(const unsigned keys[], int n, unsigned a, unsigned m,
                 int count[]) {
    for (unsigned s = 0; s &lt; m; s++) {
        count[s] = 0;
    }
    for (int i = 0; i &lt; n; i++) {
        count[hash_int(keys[i], a, m)]++;
    }
}

int main(void) {
    unsigned keys[16];
    unsigned a[] = {1, 3, 2, 1};
    unsigned m[] = {8, 8, 8, 7};
    int count[8];
    for (int i = 0; i &lt; 16; i++) {
        keys[i] = 4 * (i + 1);              /* 4, 8, ..., 64 */
    }
    for (int t = 0; t &lt; 4; t++) {
        count_slots(keys, 16, a[t], m[t], count);
        printf("a = %u, m = %u:", a[t], m[t]);
        for (unsigned s = 0; s &lt; m[t]; s++) {
            printf(" %d", count[s]);
        }
        printf("\\n");
    }
    return 0;
}</code></pre>
<pre><code class="lang-text">a = 1, m = 8: 8 0 0 0 8 0 0 0
a = 3, m = 8: 8 0 0 0 8 0 0 0
a = 2, m = 8: 16 0 0 0 0 0 0 0
a = 1, m = 7: 2 3 2 2 3 2 2</code></pre>
<p>3 与 8 互素，各槽键数和 k mod 8 完全一样；2 与 8 不互素，16 个键全进了 0 号槽；换成素数模 7，16 个键才摊到 7 个槽。键用 unsigned 还有一个原因：C99 的 <code>%</code> 向零截断，<code>-7 % 10</code> 得 −7，直接当下标会越界。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>算槽号</strong>：给出键和 h(k)，填出每个键的槽号，往往接着做拉链或探测（4.3、4.4）。填空题自动判分，过程对、数字错也不给分，乘法和取模都要复核。</li>
<li><strong>选哈希函数</strong>：依次检查 (1) 模数是否等于表长，小了浪费槽，大了越界；(2) 乘数与模数是否互素；(3) 加常数一律视为无效；(4) 能自己定表长时取素数。题目明确给出键的规律（例如全是 6 的倍数）时，还要看模数和这个规律有没有公因数。</li>
<li><strong>概念判断</strong>：哈希表是具体结构，不是 ADT；查找平均 O(1)、最坏 O(n)；冲突不可避免。</li>
<li><strong>要自己记住</strong>：取模、互素和挑选哈希函数的规则都不在公式表上，公式表只有装载因子的探测次数估计（见 4.5）。</li>
<li><strong>陷阱</strong>：以为乘任何大数都有好处（必须互素）；以为 (k + c) mod m 更均匀；以为模数越小越省、用不满表也无妨；C 里对负数取 <code>%</code> 得到负下标。</li>
</ul>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 键 21, 34, 41, 55, 64, 71。(a) 表长 10，分别用 h₁(k) = k mod 10 和 h₂(k) = 7k mod 10 求槽号，各有哪些键冲突？(b) 表长改为 11，用 h₃(k) = k mod 11 呢？</summary>
<div class="qa__body">
<table>
<thead><tr><th>k</th><th>21</th><th>34</th><th>41</th><th>55</th><th>64</th><th>71</th></tr></thead>
<tbody>
<tr><td>k mod 10</td><td>1</td><td>4</td><td>1</td><td>5</td><td>4</td><td>1</td></tr>
<tr><td>7k</td><td>147</td><td>238</td><td>287</td><td>385</td><td>448</td><td>497</td></tr>
<tr><td>7k mod 10</td><td>7</td><td>8</td><td>7</td><td>5</td><td>8</td><td>7</td></tr>
<tr><td>k mod 11</td><td>10</td><td>1</td><td>8</td><td>0</td><td>9</td><td>5</td></tr>
</tbody>
</table>
<p>(a) h₁：21、41、71 同在 1 号槽，34、64 同在 4 号槽。h₂：21、41、71 同在 7 号槽，34、64 同在 8 号槽。冲突的组完全一样，只是换了槽号，因为 7 与 10 互素，乘 7 不改变哪些键冲突。</p>
<p>(b) 11 与 10 互素，k mod 11 不再只看末位：6 个键落在 10、1、8、0、9、5 六个不同的槽，没有冲突。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 哈希表有 12 个槽，要存的键是 6, 12, 18, …, 72（全是 6 的倍数，共 12 个）。下列哪个函数分布最均匀？(A) k mod 12　(B) 5k mod 12　(C) (k + 1) mod 12　(D) k mod 11</summary>
<div class="qa__body">
<p>选 <strong>D</strong>。逐个看：</p>
<ul>
<li>(A) gcd(6, 12) = 6，只用得到 12 / 6 = 2 个槽：6、18、30… 进 6 号槽，12、24、36… 进 0 号槽，每槽 6 个。</li>
<li>(B) 5 与 12 互素，冲突的组和 (A) 相同：5 × 6 = 30 → 6，5 × 12 = 60 → 0，仍是 0、6 两个槽各 6 个。</li>
<li>(C) 只是把 (A) 平移一格：1 号、7 号槽各 6 个。</li>
<li>(D) 6 与 11 互素，12 个键依次落在 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 0, 6，用到全部 11 个槽，只有 6 号槽有 2 个键。11 号槽用不到，浪费 1 格，但分布远好于前三个。</li>
</ul>
<p>这里题目给出了键的规律，规律与 12 有公因数 6，所以用满 12 个槽也没用，只有换成与规律互素的模数才能分开。100 个槽那道题没有给出规律，按“用满表长、乘互素素数”的原则选。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 键是 int，可能为负。写函数 int slot(int key, int m)，对任何 key 都返回 0 … m−1 之间的槽号（m &gt; 0）。为什么直接写 return key % m; 不行？</summary>
<div class="qa__body">
<p>C99 规定整数除法向零截断，余数的符号跟被除数相同：<code>-7 % 10</code> 是 −7，不是 3。拿 −7 当下标会访问数组前面的内存，属于越界。余数为负时加上 m 即可：</p>
<pre><code>int slot(int key, int m) {
    int r = key % m;          /* C99: sign follows key, so r may be &lt; 0 */
    if (r &lt; 0) {
        r += m;
    }
    return r;
}</code></pre>
<p>检验：slot(−7, 10)：r = −7，加 10 得 3；slot(−20, 10)：r = 0，直接返回 0；slot(25, 7) = 4。r 在 −(m−1) … m−1 之间，加一次 m 一定落回 0 … m−1。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">4. 多选：下列哪些说法正确？(A) 哈希表是一种抽象数据类型。(B) 只要哈希函数足够好，哈希表查找最坏也是 O(1)。(C) 表有 m 个槽，存入 m + 1 个不同的键，一定至少发生一次冲突。(D) h(k) = (k + 7) mod m 比 h(k) = k mod m 分布更均匀。(E) 表长 100 时，h(k) = (1000 × k) mod 100 把所有键放进同一个槽。</summary>
<div class="qa__body">
<p>正确的是 <strong>C、E</strong>。</p>
<ul>
<li>(A) 错：哈希表是建在数组上的具体数据结构，它实现的是字典 ADT。</li>
<li>(B) 错：O(1) 只是平均情况。再好的函数也避免不了冲突，最坏时所有键在同一个槽，查找 O(n)。</li>
<li>(C) 对：鸽巢原理，m + 1 个键放进 m 个槽，至少有一个槽装 2 个。</li>
<li>(D) 错：加常数只把槽号整体平移，冲突完全不变。</li>
<li>(E) 对：1000 × k 是 100 的倍数，模 100 恒为 0。</li>
</ul>
</div>
</details>
`;
