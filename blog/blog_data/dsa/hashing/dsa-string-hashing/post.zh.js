/* Post body — dsa-string-hashing / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-string-hashing:zh'] = `
<p class="lead">键是字符串时，怎么算出槽号：课上的做法是把字符串当成一个 32 进制数，从左到右逐字符计算 h = (h·32 + c) mod M，每一步都取模。</p>

<h2>从一个场景说起</h2>
<p>助教收了几百份作业，要分进 26 个格子，以后按姓名找。最省事的分法：按姓的首字母放。</p>
<p>分完一看，M 格、B 格塞得满满的，X 格几乎是空的。要找 Brown 的作业，还得在 B 格那一大摞里一份份翻。</p>
<p>换成按姓的长度放？更糟。大多数姓是 5 到 8 个字母，几乎全挤在 4 个格子里。</p>
<p>哈希表遇到的是同一个问题：表有 M 个槽，键是姓名、单词这样的字符串，要算出一个槽号，还要让键<strong>均匀地散开</strong>。只看字符串的一小部分（首字母、长度），怎么也散不开。</p>

<h2>它是什么：把一串字符变成一个槽号</h2>
<p>简单说，字符串哈希（string hashing）就是一个函数：输入一个字符串，输出 0..M−1 之间的一个整数。它分两步。</p>
<ol>
<li><strong>字符变成数</strong>。每个字符给一个数值 c。手算常用 a..z → 0..25；程序里直接用字符编码（ASCII），'A' = 65、'a' = 97。C 的 <code>char</code> 本来就是小整数，<code>s[i] - 'a'</code> 就得到 0..25。</li>
<li><strong>一串数合成一个槽号</strong>。难点全在这一步：合得不好，键就扎堆。</li>
</ol>

<h3>做法一：全部加起来（不行）</h3>
<p>最容易想到的是把所有 c 加起来再 mod M。毛病有两个：</p>
<ul>
<li><strong>加法不管顺序</strong>。字母相同、顺序不同的重排词（anagram）一定冲突（collision）：stop、pots、tops、spot 的 ASCII 和都是 454。</li>
<li><strong>和太小</strong>。小写字母的 ASCII 码在 97..122，8 个字母以内的词，和不超过 8 × 122 = 976。表长 M = 10007 时，这些词只能落进前 977 个槽，九成以上的槽永远空着。</li>
</ul>

<h3>做法二：前两个字符加长度（还是不够）</h3>
<p>课上的第一个字符串哈希，把第一个字符、第二个字符和长度各乘一个素数，再相加取模：</p>
<pre><code class="lang-text">h(s) = (p1·s[0] + p2·s[1] + p3·len(s)) mod M</code></pre>
<p>它还是只看了三样东西。Smith、Small、Smart 都以 Sm 开头、长度都是 5，不管 p1、p2、p3、M 取什么，都落进同一个槽。</p>

<h3>做法三：把字符串当成一个数（课上用的）</h3>
<p>十进制的 472 = 4·10² + 7·10 + 2，每一位乘多少由它的位置决定。单词也能这样看，只是换成 32 进制：</p>
<pre><code class="lang-text">"cab" = 2·32² + 0·32 + 1 = 2049</code></pre>
<p>这叫多项式哈希（polynomial hash）。每个字符都乘上一个随位置变化的权重，交换两个字母，结果就变了，重排词不再必然冲突。</p>
<p>为什么是 32？26 个字母用 5 个二进制位就放得下，而 32 = 2⁵，<strong>乘 32 就是左移 5 位</strong>（<code>h &lt;&lt; 5</code>），比乘 26 便宜。</p>
<p>新问题是数长得太快：每多一个字母就多占 5 位，13 个字母就要 65 位，64 位整数可能就放不下了。解决办法分两半：Horner 法则和每步取模。</p>

<h3>Horner 法则：像在计算器上输数字</h3>
<p>在计算器上输入 472：先按 4；再按 7，屏幕上的 4 变成 47，也就是 4 × 10 + 7；再按 2，变成 47 × 10 + 2 = 472。不用单独算 10 的几次方。</p>
<p>32 进制也一样。4 个字符 c0 c1 c2 c3 的值可以嵌套着算，这叫 Horner 法则（Horner's rule）：</p>
<pre><code class="lang-text">N = c0·32³ + c1·32² + c2·32 + c3 = ((c0·32 + c1)·32 + c2)·32 + c3</code></pre>
<p>每读一个字符，把手上的数乘 32 再加 c。再在每一步之后取模（modulo），就是课上的公式：</p>
<pre><code class="lang-text">h = 0
对每个字符 c（从左到右）：  h = (h·32 + c) mod M</code></pre>
<p>中途取模，最后的 <strong>h 仍然等于 N mod M</strong>。依据是取模可以分配到加法和乘法里：</p>
<pre><code class="lang-text">(a + b) mod n = ((a mod n) + (b mod n)) mod n
(a × b) mod n = ((a mod n) × (b mod n)) mod n</code></pre>
<p>注意<strong>右边外层那个 mod 不能省</strong>：7 mod 10 + 8 mod 10 = 15，还要再取一次模，才等于 (7 + 8) mod 10 = 5。</p>
<p>每步取模的好处：h 始终小于 M，h·32 + c 只比 32M 大一点，串再长也不会越算越大。</p>

<h2>看个例子：h("hash")，M = 101</h2>
<p>编码用 a..z → 0..25，所以 h = 7，a = 0，s = 18。h 从 0 开始，每读一个字符算一次 h·32 + c，再减去 101 的整数倍：</p>
<table>
<thead><tr><th>读入</th><th>c</th><th>h·32 + c</th><th>mod 101 后的 h</th></tr></thead>
<tbody>
<tr><td>h</td><td>7</td><td>0·32 + 7 = 7</td><td>7（比 101 小，不变）</td></tr>
<tr><td>a</td><td>0</td><td>7·32 + 0 = 224</td><td>224 − 2×101 = 22</td></tr>
<tr><td>s</td><td>18</td><td>22·32 + 18 = 722</td><td>722 − 7×101 = 15</td></tr>
<tr><td>h</td><td>7</td><td>15·32 + 7 = 487</td><td>487 − 4×101 = 83</td></tr>
</tbody>
</table>
<p>所以 h("hash") = <strong>83</strong>，放进 83 号槽。</p>
<p>核对一下：不取模直接算，N = 7·32³ + 0·32² + 18·32 + 7 = 229959，229959 mod 101 = 83，一样。区别是逐步取模时，中间最大的数只有 722。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-string-hashing/anims/string-hash.html" loading="lazy" style="height: 520px;" title="逐字符计算字符串哈希"></iframe>
<p class="anim-caption">输入单词（最多 6 个字符）和 M，选编码后逐步播放：每读一个字符，表格多一行 h；最后一帧给出槽号，并和字符值相加的结果对比。试试 stop 和 pots，或把 M 改成 1024、31。</p>

<h2>课上的姓氏实验：素数表长不够</h2>
<p>课上把约 15 万个美国姓氏放进哈希表，看最满的槽分到几个姓：</p>
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
<p>换成素数 101，峰值降了，但远没解决问题。101 个槽时，最好也只能每槽约 150000 / 101 ≈ 1500 个，这时毛病在表太小（见 4.5 装载因子与三种冲突方案对比）。表长扩到 30 万，峰值还是 1000 多，说明问题出在哈希函数本身。</p>
<p><strong>素数表长只能解决一部分问题，字符串本身有模式</strong>：长度集中、首字母集中、字母能重排。哈希函数必须让每个字符连同它的位置都参与运算，才能打散这些模式。</p>

<h2>M 怎么选</h2>
<p>和整数哈希一样，M 取素数（道理见 4.1 哈希表与整数哈希函数）。对 32 进制哈希，还要避开两种 M：</p>
<ul>
<li><strong>2 的幂</strong>。M = 1024 = 32² 时，倒数第三个及更前面的字符都乘上了 32² 的倍数，取模后变成 0，只剩最后两个字符起作用：h("cat") = h("bat") = h("hat") = h("that") = 0·32 + 19 = 19。M = 32 更糟，只剩最后一个字符。</li>
<li><strong>让 32 mod M = 1 的数</strong>，比如 31（它可是素数）。这时 32 的任何次幂 mod 31 都是 1，每个字符的权重都变成 1，多项式哈希退化成相加，重排词又全部冲突。</li>
</ul>

<h2>C 代码</h2>
<pre><code>unsigned hash_str(const char *s, unsigned M) {
    unsigned h = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        unsigned c = (unsigned char)s[i];
        h = (h * 32 + c) % M;
    }
    return h;
}</code></pre>
<ul>
<li><strong>第 2 行</strong>：h 用 <code>unsigned</code>。h 永远非负，<code>% M</code> 的结果落在 0..M−1，直接当下标。用 <code>int</code> 的话，溢出（overflow）是未定义行为（undefined behaviour），h 可能变成负数，<code>%</code> 就可能给出负下标。</li>
<li><strong>第 3 行</strong>：C 字符串以 <code>'\\0'</code> 结尾，读到它就停。</li>
<li><strong>第 4 行</strong>：字符先转成 <code>unsigned char</code>。<code>char</code> 在很多平台上有符号，ASCII 以外的字节（比如 UTF-8 编码的汉字）会读成负数。</li>
<li><strong>第 5 行</strong>：就是 h = (h·32 + c) mod M，<code>h * 32</code> 也可以写成 <code>h &lt;&lt; 5</code>。因为 h &lt; M，h·32 + c ≤ 32(M − 1) + 255，32 位 unsigned 下 M 在一亿以内都不会溢出。</li>
</ul>
<p>这段代码用 ASCII 码作 c，所以 <code>hash_str("hash", 101)</code> 是 22，不是手算的 83。把第 4 行改成 <code>s[i] - 'a'</code> 就和 0..25 的编码一致，但只适用于全小写的串。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>：给出编码、进制和 M，求一个串的哈希值。每一步写出 h·32 + c 和取模结果。递推式和取模分配律要自己记，公式表上与哈希有关的只有装载因子的探测次数估计。</li>
<li><strong>解释题</strong>：为什么相加、只看首字母或长度不好；为什么加大表长、换素数还不够；为什么 M 不能是 2 的幂。期末复习课特别提醒过字符串怎么哈希要小心。</li>
<li><strong>C 代码</strong>：写字符串哈希函数，或在给定代码里找错（溢出、负下标、只在最后取模）。</li>
</ul>

<h3>例题 1：手算</h3>
<p>题目：a..z → 0..25，h = (h·32 + c) mod 13。求 h("dog") 和 h("god")；如果改用“字符值之和 mod 13”，两者又各是多少？</p>
<p>讲解：d = 3，o = 14，g = 6。逐字符算：</p>
<pre><code class="lang-text">"dog":  读 d：h = 3
        读 o：3·32 + 14 = 110,  110 − 8×13  = 6
        读 g：6·32 + 6  = 198,  198 − 15×13 = 3     → h("dog") = 3
"god":  读 g：h = 6
        读 o：6·32 + 14 = 206,  206 − 15×13 = 11
        读 d：11·32 + 3 = 355,  355 − 27×13 = 4     → h("god") = 4</code></pre>
<p>可以用不取模的值核对：N("dog") = 3·1024 + 14·32 + 6 = 3526，3526 − 271×13 = 3，一致。</p>
<p>改用相加：3 + 14 + 6 = 23，23 mod 13 = <strong>10</strong>，两个词都是 10，冲突了；32 进制哈希把它们分到了 <strong>3 和 4</strong>。</p>

<h3>例题 2：多选</h3>
<p>题目：下列哪些哈希函数一定让 stop 和 pots 冲突？(A) ASCII 码之和 mod 101；(B) ASCII 编码，h = (h·32 + c) mod 101；(C) a..z → 0..25，h = (h·32 + c) mod 31；(D) a..z → 0..25，h = (h·32 + c) mod 1024。</p>
<p>答案：<strong>A、C</strong>。</p>
<ul>
<li>A：两个词字母相同，和都是 454，454 mod 101 = 50，冲突。</li>
<li>B：stop 得 46，pots 得 7，不冲突。</li>
<li>C：32 mod 31 = 1，h 退化成字符值之和 mod 31，和 A 一样不分顺序，两个词都是 66 mod 31 = 4，冲突。</li>
<li>D：只剩最后两个字符。stop 是 14·32 + 15 = 463，pots 是 19·32 + 18 = 626，不冲突。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>(a + b) mod n 不等于 (a mod n) + (b mod n)，外层还要再取一次模。</li>
<li>a → 0 时，开头的 a 不起作用：b、ab、aab 的值都是 1。用 ASCII 码（a = 97）没有这个问题。</li>
<li>看清题目规定的编码：M = 101 时，hash 用 0..25 算是 83，用 ASCII 算是 22。</li>
<li>代码只在循环结束后才 <code>% M</code>：h 早就溢出了。就算 h 是 <code>unsigned</code>，32 位也只留得住最后 7 个字符的贡献，information、formation、transformation 会得到同一个值。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>字符串哈希分两步：字符变成数（0..25 或 ASCII），再把一串数合成一个槽号。</li>
<li>相加、只看首字母、只看长度都不行：重排词冲突、取值集中。素数表长、加大表长只能解决一部分问题。</li>
<li>课上的做法：当成 32 进制数，从左到右 <strong>h = (h·32 + c) mod M</strong>，每步取模；乘 32 就是左移 5 位。</li>
<li>每步取模不改变结果，依据是 (a + b) mod n = ((a mod n) + (b mod n)) mod n，乘法同理。</li>
<li>M 取素数，不能是 2 的幂，也不能让 32 mod M = 1（如 31）。</li>
<li>C 里 h 用 <code>unsigned</code>，字符先转成 <code>unsigned char</code>。</li>
</ul>
`;
