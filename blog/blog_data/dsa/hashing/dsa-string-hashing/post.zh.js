/* Post body — dsa-string-hashing / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-string-hashing:zh'] = `
<p class="lead">键是字符串时，先把每个字符换成数，再把整串压成一个槽号。字符值相加、只看首字母或长度，都会让大量键挤进少数几个槽；把字符串当成 32 进制数，用 Horner 法则逐字符计算、每一步都取模，每个字符和它的位置才都起作用，中间结果也不会溢出。</p>

<h2>字符就是数</h2>
<p>字符串哈希（string hashing）的第一步是给每个字符一个数值 c。课上给了两种编码：手算常用 a..z → 0..25；程序里直接用字符编码，ASCII 中 'A' = 65、'a' = 97。C 的 <code>char</code> 本来就是小整数，<code>s[i] - 'a'</code> 就得到 0..25。难点在于怎么把一串 c 合成一个下标。</p>

<h2>朴素做法为什么不行</h2>
<ul>
<li><strong>字符值相加</strong>。加法与顺序无关，所以字母相同、顺序不同的重排词（anagram）一定冲突（collision）：stop、pots、tops、spot、opts、post 的 ASCII 和都是 454。和的范围也很窄：小写字母的 ASCII 码在 97..122 之间，不超过 8 个字母的词，和不超过 8 × 122 = 976。表长 M = 10007 时，这些词只能落进前 977 个槽，九成以上的槽永远空着。</li>
<li><strong>只看首字母</strong>：最多 26 种值，而且首字母分布很不均匀，课上举的是 M、B 开头的姓特别多。</li>
<li><strong>只看长度</strong>：大多数姓长 5 到 8 个字母，大部分键挤进 4 个槽。</li>
</ul>
<p>课上的第一个字符串哈希把这几样组合起来：第一个字符、第二个字符和长度各乘一个素数，相加后取模：</p>
<pre><code class="lang-text">h(s) = (p1·s[0] + p2·s[1] + p3·len(s)) mod M</code></pre>
<p>它仍然只看了三样信息。Smith、Small、Smart 都以 Sm 开头，长度都是 5，无论 p1、p2、p3、M 取什么都落在同一个槽。</p>

<h2>课上的姓氏实验</h2>
<p>把约 15 万个美国姓氏放进哈希表，统计每个槽分到几个姓：</p>
<table>
<thead><tr><th>表长 M</th><th>哈希函数</th><th>最满的槽</th></tr></thead>
<tbody>
<tr><td>100</td><td>前两个字符 + 长度</td><td>3000 多个</td></tr>
<tr><td>101（素数）</td><td>同上</td><td>约 2500 个</td></tr>
<tr><td>101</td><td>更好的哈希</td><td>每槽约 1500 个，很均匀</td></tr>
<tr><td>约 30 万（姓氏数的 2 倍）</td><td>哈希里换用大素数</td><td>仍有 1000 多个</td></tr>
<tr><td>约 30 万</td><td>更好的哈希</td><td>7 个</td></tr>
</tbody>
</table>
<ul>
<li>M 从 100 改成素数 101，峰值下降，但远没有解决问题（素数表长的道理见 4.1 哈希表与整数哈希函数）。</li>
<li>101 个槽时，最好也只能做到每槽约 150000 / 101 ≈ 1500 个。分布已经均匀，毛病在表太小；表长与键数的关系见 4.5 装载因子与三种冲突方案对比。</li>
<li>表长扩到键数的 2 倍、换上大素数，峰值仍有 1000 多。问题出在哈希函数本身。</li>
</ul>
<p><strong>素数表长只能解决一部分问题，字符串本身有模式</strong>：长度集中、首字母集中、字母可以重排。哈希函数必须让每个字符连同它的位置都参与运算，才能打散这些模式。即便如此，也没有哪个字符串哈希能保证打散所有模式，如何设计并证明好的字符串哈希仍是研究课题。</p>

<h2>把字符串当成一个数</h2>
<p>十进制的 472 = 4·10² + 7·10 + 2，每一位的权重由位置决定。同样可以把单词看成 26 进制数（a..z → 0..25）：</p>
<pre><code class="lang-text">"cab" = 2·26² + 0·26 + 1 = 1353</code></pre>
<p>每个字符都乘上随位置变化的权重，交换字母就会改变结果，这是相加做不到的。缺点是数长得太快：26¹⁴ ≈ 6.5 × 10¹⁹，已超过 64 位无符号整数的上限 2⁶⁴ ≈ 1.8 × 10¹⁹，14 个字母的词就可能放不下，长串算起来也慢。课上的改进分两步。</p>
<p>第一步，<strong>进制改成 32 = 2⁵</strong>。5 个二进制位足够放下 26 个字母，乘 32 就是左移 5 位（<code>h &lt;&lt; 5</code>），比乘 26 便宜。每个字母恰好占自己的 5 位：</p>
<pre><code class="lang-text">"cab" = 2·32² + 0·32 + 1 = 2049 = 00010 00000 00001 (二进制)
                                    c     a     b</code></pre>
<p>第二步，<strong>计算过程中反复取模</strong>，中间结果就只有 M 的几十倍大，不再随串长增长。</p>

<h2>Horner 法则：每读一个字符就取模</h2>
<p>4 个字符 c0 c1 c2 c3 组成的串，它的 32 进制值可以从左到右嵌套着算，这叫 Horner 法则（Horner's rule）：</p>
<pre><code class="lang-text">N = c0·32³ + c1·32² + c2·32 + c3 = ((c0·32 + c1)·32 + c2)·32 + c3</code></pre>
<p>每读一个字符做一次“乘 32 再加 c”，不必单独算 32 的幂。在每一步之后取模（modulo）：</p>
<pre><code class="lang-text">h = 0
对每个字符 c（从左到右）：  h = (h·32 + c) mod M</code></pre>
<p>最后的 <strong>h 等于 N mod M</strong>，依据是取模对加法、乘法的分配律：</p>
<pre><code class="lang-text">(a + b) mod n = ((a mod n) + (b mod n)) mod n
(a × b) mod n = ((a mod n) × (b mod n)) mod n</code></pre>
<p><strong>右边外层那个 mod 不能省</strong>。课上的例子：7 mod 10 + 8 mod 10 = 15，而 (7 + 8) mod 10 = 5，15 还得再对 10 取一次模。乘法同理：13 × 14 = 182，182 mod 10 = 2；3 × 4 = 12，也要再取一次模才得到 2。</p>
<p>例：a..z → 0..25，M = 101，求 h("hash")。字符值 h = 7，a = 0，s = 18：</p>
<table>
<thead><tr><th>字符</th><th>c</th><th>h·32 + c</th><th>新的 h</th><th>不取模的 N</th></tr></thead>
<tbody>
<tr><td>h</td><td>7</td><td>0·32 + 7 = 7</td><td>7</td><td>7</td></tr>
<tr><td>a</td><td>0</td><td>7·32 + 0 = 224</td><td>224 − 2×101 = 22</td><td>224</td></tr>
<tr><td>s</td><td>18</td><td>22·32 + 18 = 722</td><td>722 − 7×101 = 15</td><td>7186</td></tr>
<tr><td>h</td><td>7</td><td>15·32 + 7 = 487</td><td>487 − 4×101 = 83</td><td>229959</td></tr>
</tbody>
</table>
<p>h("hash") = <strong>83</strong>。不取模直接算，N = 7·32³ + 0·32² + 18·32 + 7 = 229959，229959 mod 101 = 83，结果相同；但逐步取模时 h·32 + c 始终小于 32 × 101 = 3232。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-string-hashing/anims/string-hash.html" loading="lazy" style="height: 520px;" title="逐字符计算字符串哈希"></iframe>
<p class="anim-caption">输入单词（最多 6 个字符）、表长 M，选择编码，再逐步播放：表格每行是读入一个字符后的 h，最后一帧给出槽号，并与字符值相加的结果对比。试试 stop 和 pots，或把 M 改成 1024、31。</p>

<h2>M 怎么选</h2>
<p>和整数哈希一样，M 取素数。对 32 进制哈希还有一条：<strong>M 不能是 2 的幂</strong>。M = 1024 = 32² 时，倒数第三个及更前面的字符都乘上了 32² 的倍数，取模后变成 0，只剩最后两个字符起作用：</p>
<pre><code class="lang-text">M = 1024，a..z → 0..25：
h("cat") = h("bat") = h("hat") = h("that") = 0·32 + 19 = 19</code></pre>
<p>M = 32 时更糟，只剩最后一个字符。素数 M（不等于 2）与 32 没有公因数，32 的任何次幂都不是 M 的倍数，不会把前面的字符整个消掉。</p>

<h2>C 实现</h2>
<pre><code>#include &lt;stdio.h&gt;

/* naive: add up the character codes (anagrams always collide) */
unsigned hash_sum(const char *s, unsigned M) {
    unsigned h = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        h = (h + (unsigned char)s[i]) % M;
    }
    return h;
}

/* base-32 polynomial hash: Horner's rule, mod after every step */
unsigned hash_str(const char *s, unsigned M) {
    unsigned h = 0;                         /* invariant: h &lt; M */
    for (int i = 0; s[i] != '\\0'; i++) {
        unsigned c = (unsigned char)s[i];   /* 0..255, never negative */
        h = (h * 32 + c) % M;               /* h * 32 == h &lt;&lt; 5 */
    }
    return h;
}

int main(void) {
    const char *w[] = {"stop", "pots", "tops", "spot"};
    for (int i = 0; i &lt; 4; i++) {
        printf("%s  sum: %2u  poly: %2u\\n",
               w[i], hash_sum(w[i], 101), hash_str(w[i], 101));
    }
    /* M = 1024 = 32 * 32: only the last two characters matter */
    printf("cat %u, bat %u\\n", hash_str("cat", 1024), hash_str("bat", 1024));
    return 0;
}</code></pre>
<p>输出：</p>
<pre><code class="lang-text">stop  sum: 50  poly: 46
pots  sum: 50  poly:  7
tops  sum: 50  poly: 55
spot  sum: 50  poly: 95
cat 148, bat 148</code></pre>
<ul>
<li><strong>h 用 <code>unsigned</code></strong>：h 永远非负，<code>% M</code> 的结果落在 0..M−1，可以直接当下标。用 <code>int</code> 的话，溢出（overflow）是未定义行为（undefined behaviour），h 还可能变成负数，<code>%</code> 可能给出负下标。</li>
<li><strong>字符先转成 <code>unsigned char</code></strong>：<code>char</code> 在很多平台上有符号，ASCII 以外的字节（例如 UTF-8 编码的汉字）会成为负数。</li>
<li><strong>不溢出的条件</strong>：每步之后 h &lt; M，所以 h·32 + c ≤ 32(M − 1) + 255。unsigned 为 32 位（上限约 4.29 × 10⁹）时，M 在一亿以内都安全。</li>
<li>这段代码直接用 ASCII 码作 c，所以 h("hash") 算出来是 22，不是上面手算的 83。把 c 改成 <code>s[i] - 'a'</code> 就和 0..25 的编码一致，但只适用于全小写字母的串。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>：给出编码（a = 0 或 ASCII）、进制和 M，求一个串的哈希值。按 h = (h·32 + c) mod M 从左到右逐字符算，每一步写出 h·32 + c 和取模结果。递推式和取模分配律要自己记，公式表上与哈希有关的只有装载因子的探测次数估计。</li>
<li><strong>解释题</strong>：为什么相加、只看首字母或长度不好（重排词冲突、取值集中、模式）；为什么加大表长、换素数还不够；为什么 M 不能是 2 的幂。第 12 周复习课特别提醒过字符串怎么哈希要小心。</li>
<li><strong>C 代码</strong>：写字符串哈希函数，或在给定代码里找溢出、负下标、只在最后取模之类的错误。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>(a + b) mod n 不等于 (a mod n) + (b mod n)，外层还要再取一次模。</li>
<li>a → 0 时，开头的 a 不起作用：b、ab、aab 的值都是 1。用 ASCII 码（a = 97）没有这个问题。</li>
<li>先看清题目规定的编码：同一个词用 0..25 和用 ASCII 算出的槽号不同，M = 101 时 hash 分别是 83 和 22。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. a..z → 0..25，h = (h·32 + c) mod 13。求 h("dog") 和 h("god")。若改用“字符值之和 mod 13”，两者各是多少？</summary>
  <div class="qa__body">
<p>d = 3，o = 14，g = 6。</p>
<pre><code class="lang-text">"dog":  h = 3
        3·32 + 14 = 110,  110 − 8×13 = 6
        6·32 + 6  = 198,  198 − 15×13 = 3     → h("dog") = 3
"god":  h = 6
        6·32 + 14 = 206,  206 − 15×13 = 11
        11·32 + 3 = 355,  355 − 27×13 = 4     → h("god") = 4</code></pre>
<p>核对：N("dog") = 3·1024 + 14·32 + 6 = 3526，3526 − 271×13 = 3，与逐步取模一致。</p>
<p>相加：3 + 14 + 6 = 23，23 mod 13 = <strong>10</strong>，两个词都是 10，冲突；32 进制哈希把它们分到了 <strong>3 和 4</strong>。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 多选：下列哪些哈希函数一定让 stop 和 pots 冲突？(A) ASCII 码之和 mod 101；(B) ASCII 编码，h = (h·32 + c) mod 101；(C) a..z → 0..25，h = (h·32 + c) mod 31；(D) a..z → 0..25，h = (h·32 + c) mod 1024。</summary>
  <div class="qa__body">
<p><strong>A、C。</strong></p>
<p>A：两词字母相同，和都是 454，454 mod 101 = 50。</p>
<p>C：32 mod 31 = 1，所以 32 的任何次幂 mod 31 都是 1，h 退化成字符值之和 mod 31，与 A 一样不分顺序：两词都是 66 mod 31 = 4。<strong>M 不能让 32 mod M = 1</strong>，否则 32 进制哈希等于相加。</p>
<p>B：stop 得 46，pots 得 7，不冲突。D：只剩最后两个字符，stop 是 14·32 + 15 = 463，pots 是 19·32 + 18 = 626，不冲突。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 对 h(s) = (p1·s[0] + p2·s[1] + p3·len(s)) mod M，课上的实验把表长从 101 加大到约 30 万，峰值仍有 1000 多。说明为什么对这个哈希只加大 M 不够，并给出改进方向。</summary>
  <div class="qa__body">
<p>h 只取决于三元组（第一个字母，第二个字母，长度）。三元组相同的两个姓，取模之前的值就相等，无论 M 多大都同槽，例如 Smith 与 Smart。不同三元组至多 26 × 26 × (长度的种数) 个，长度取 2..16 时约一万个，所以 15 万个姓至多分到约一万个不同的值上；再加上姓的首字母和长度本来就集中，常见的三元组各自对应很多姓，峰值降不下来。</p>
<p>改进：让每个字符连同位置都参与，例如 32 进制 Horner 哈希 h = (h·32 + c) mod M，M 取素数；表长保持在键数的同一数量级（课上取约 2 倍）。</p>
  </div>
</details>
<p>第 4 题的代码：</p>
<pre><code>int hash_bad(char *s, int M) {
    int h = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        h = h * 32 + s[i];
    }
    return h % M;
}</code></pre>
<details class="qa">
  <summary class="ripple-surface">4. 用上面的 hash_bad 给哈希表算下标，会出什么问题？</summary>
  <div class="qa__body">
<ul>
<li><strong>int 溢出</strong>：不取模时 h 每读一个字符约乘 32。6 个小写字母的值至少是 aaaaaa 的 97 × (32⁵ + 32⁴ + … + 1) ≈ 3.36 × 10⁹，超过 32 位 int 的上限 2³¹ − 1 ≈ 2.15 × 10⁹。有符号溢出是未定义行为。</li>
<li><strong>负下标</strong>：溢出后实际上常常回绕成负数，C 的 <code>%</code> 对负数可能给出负余数，<code>table[h % M]</code> 越界。</li>
<li><strong>char 可能有符号</strong>：ASCII 以外的字节读出来是负数。</li>
<li><strong>只在最后取模</strong>：即使把 h 改成 <code>unsigned</code>（溢出变成合法的 mod 2³² 回绕），乘 32 就是左移 5 位，32 位的 h 只留得住最后 7 个字符的贡献，更前面的字符被整个移出。information、formation、transformation 的最后 7 个字符都是 rmation，三者得到同一个 h。</li>
</ul>
<p>改法就是上面的 <code>hash_str</code>：<code>unsigned</code> 的 h，字符转 <code>unsigned char</code>，每一步 <code>h = (h * 32 + c) % M</code>。</p>
  </div>
</details>
`;
