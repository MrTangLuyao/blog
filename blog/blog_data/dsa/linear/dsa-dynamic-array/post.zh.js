/* Post body — dsa-dynamic-array / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-dynamic-array:zh'] = `
<p class="lead">静态数组的容量在分配时就定死了。动态数组（dynamic array）装满时换一块更大的内存，把旧元素复制过去。每次扩多少决定了总代价：每次只加 1 格，n 次追加共 Θ(n²)；每次翻倍，单次追加最坏 Θ(n)，均摊（amortised）却只有 O(1)。</p>

<h2>装满之后只能搬家</h2>
<p>课上的例子：为学生字典开了 100 格的数组，结果来了 110 名学生。数组只记得首元素的地址，紧挨在它后面的内存可能已经分给了别的变量，没法原地加长。只能申请一块更大的新数组，把旧元素逐个复制过去，释放旧数组，再写入新元素。复制 k 个元素要 k 次操作。</p>
<p>所以动态数组要记三样东西：指向堆上数组的指针 <code>A</code>、已用个数 <code>n</code>、容量（capacity）<code>cap</code>。在末尾追加（append）一个元素时：</p>
<ul>
<li><code>n &lt; cap</code>：直接写进 <code>A[n]</code>，代价 1；</li>
<li><code>n == cap</code>：先扩容（resize），把 n 个旧元素复制到新数组，代价 n，再写入，代价 1。</li>
</ul>
<p>计数模型：写入或复制一个元素各算 1，初始容量为 1。</p>

<h2>每次只加 1 格：Θ(n²)</h2>
<p>最直接的想法是满了就加 1 格。可下一个元素一来又满了，于是从第 2 次起每次 append 都要扩容：第 k 次先复制 k − 1 个元素。连续 append n 个，复制总数是</p>
<pre><code class="lang-text">0 + 1 + 2 + … + (n − 1) = n(n − 1)/2</code></pre>
<p>（公式表上的等差求和）。n = 8 时复制 28 次，加上 8 次写入共 36；n = 100 时复制 4950 次。<strong>总代价 Θ(n²)，平均每次 Θ(n)</strong>。每次加一个常数 c（例如 +10）也一样：每 c 次 append 扩容一次，复制总数约 n²/(2c)，常数变小了，<strong>仍是 Θ(n²)</strong>。</p>

<h2>每次翻倍：均摊 O(1)</h2>
<p>改成满了就把容量翻倍（×2）。从容量 1 开始连续 append 17 个元素：</p>
<pre><code class="lang-text">第 k 次 append  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
复制个数        0  1  2  0  4  0  0  0  8  0  0  0  0  0  0  0 16
本次代价        1  2  3  1  5  1  1  1  9  1  1  1  1  1  1  1 17
之后的容量      1  2  4  4  8  8  8  8 16 16 16 16 16 16 16 16 32</code></pre>
<p>扩容只发生在第 2、3、5、9、17 次，此时已有的元素个数 1、2、4、8、16 都是 2 的幂。第 17 次一次就花了 17，所以<strong>单次 append 最坏 Θ(n)</strong>；可 17 次的总代价只有 17 + 31 = 48，平均约 2.8。把 c 个元素搬进容量 2c 的新数组之后，接下来 c − 1 次 append 都只花 1，然后才轮到下一次扩容。</p>
<p><strong>均摊代价（amortised cost）= 一串操作的总代价 ÷ 操作次数</strong>，看的是一长串操作的平均表现，不是某一次。课上的论证：容量为 N 的数组从空开始插入 2N 个元素。前 N 次各花 1，共 N；第 N + 1 次触发扩容，复制 N；后 N 次写入又是 N。总代价 3N，操作 2N 次，均摊 1.5，即 <strong>O(1)</strong>。</p>
<p>一般情况：连续 append n 次，各次扩容复制的个数是 1, 2, 4, …, 2<sup>j</sup>，其中 2<sup>j</sup> &lt; n。由公式表上的等比求和（r = 2）：</p>
<pre><code class="lang-text">1 + 2 + 4 + … + 2^j = 2^(j+1) − 1 &lt; 2n
总代价 = 写入 n + 复制 &lt; 3n</code></pre>
<p>所以<strong>每次 append 均摊不超过 3，是 O(1)；n 次 append 合计 Θ(n)</strong>。这个上界对任何一串 append 都成立，不涉及概率，和对随机输入取平均的“平均情况”不是一回事。课上的测验题用 average 一词问这个代价，指的就是均摊，答 O(1)。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-dynamic-array/anims/grow.html" loading="lazy" style="height: 500px;" title="动态数组扩容与每次 append 的代价"></iframe>
<p class="anim-caption">选扩容策略（+1、×2、×3）后按“下一步”或“播放”。上方是数组，扩容那一步旧数组和新数组同时出现；下方条形是每次 append 的代价，黄线是到目前为止的平均。</p>

<h2>×3、×1.5 也行，+10 不行</h2>
<p>第 4 周的课堂测验问：满了改成扩为 3 倍，均摊代价是多少？<strong>仍是 O(1)</strong>。容量从 n 变成 3n 之后，接下来约 2n 次 append 都不用扩容，一次 O(n) 的复制摊到 2n 次上。一般地，<strong>每次乘一个常数 r &gt; 1，均摊都是 O(1)</strong>：复制总数小于 n + n/r + n/r² + … = n·r/(r − 1)，×2 时小于 2n，×3 时小于 1.5n。从容量 1 开始连续 append 1000 个元素：</p>
<table>
<thead><tr><th>策略</th><th>扩容次数</th><th>复制总数</th><th>平均每次代价</th><th>最终容量</th></tr></thead>
<tbody>
<tr><td>+1</td><td>999</td><td>499500</td><td>500.5</td><td>1000</td></tr>
<tr><td>+10</td><td>100</td><td>49600</td><td>50.6</td><td>1001</td></tr>
<tr><td>×1.5（向上取整）</td><td>16</td><td>2120</td><td>3.12</td><td>1065</td></tr>
<tr><td>×2</td><td>10</td><td>1023</td><td>2.02</td><td>1024</td></tr>
<tr><td>×3</td><td>7</td><td>1093</td><td>2.09</td><td>2187</td></tr>
</tbody>
</table>
<p>+1、+10 的平均代价随 n 线性增长，n 翻倍它也大约翻倍；×r 的平均始终是常数。倍数越大扩容越少，空位却越多：×3 在 n = 1000 时容量 2187，一半以上空着；×2 扩容后至少一半在用。只要 r 是常数，空间都是 O(n)。表中 ×3 复制得比 ×2 略多，只因 729 恰好接近 1000；比较策略看的是上界 1.5n 与 2n。</p>

<h2>用 realloc 写动态数组</h2>
<p><code>realloc(p, bytes)</code> 把 <code>p</code> 指向的堆内存块调整为 <code>bytes</code> 字节：后面有空就原地加长，否则另找一块、把旧内容复制过去、释放旧块，返回新地址；失败时返回 <code>NULL</code>，旧块原封不动。上面计数里的“复制 n 个元素”就发生在它内部。<code>realloc(NULL, bytes)</code> 等同于 <code>malloc(bytes)</code>。</p>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

typedef struct {
    int *A;      /* elements A[0..n-1], on the heap */
    int n;       /* number of elements in use */
    int cap;     /* number of slots allocated */
} darray_t;

/* append x at the end; returns 1 on success, 0 if memory ran out */
int da_append(darray_t *d, int x) {
    if (d-&gt;n == d-&gt;cap) {                         /* full: grow */
        int newcap = (d-&gt;cap == 0) ? 1 : 2 * d-&gt;cap;
        int *tmp = realloc(d-&gt;A, newcap * sizeof(*d-&gt;A));
        if (tmp == NULL) {
            return 0;                             /* d-&gt;A is still valid */
        }
        d-&gt;A = tmp;                               /* the block may have moved */
        d-&gt;cap = newcap;
    }
    d-&gt;A[d-&gt;n] = x;
    d-&gt;n++;
    return 1;
}

int main(void) {
    darray_t d = {NULL, 0, 0};       /* empty: realloc(NULL, ...) acts as malloc */
    for (int i = 1; i &lt;= 50; i++) {
        if (!da_append(&amp;d, i)) {
            free(d.A);
            return EXIT_FAILURE;
        }
    }
    printf("n = %d, cap = %d, A[49] = %d\\n", d.n, d.cap, d.A[49]);
    free(d.A);                       /* prints: n = 50, cap = 64, A[49] = 50 */
    return 0;
}</code></pre>
<p>写 append 时要注意：</p>
<ul>
<li><strong>realloc 的结果先存进临时指针 <code>tmp</code>，确认不是 NULL 再赋回去</strong>。写成 <code>d-&gt;A = realloc(d-&gt;A, …)</code>，一旦失败，NULL 就覆盖了唯一指向旧块的指针，数据找不回来，旧块也泄漏了。</li>
<li>第二个参数是<strong>字节数</strong>，要乘 <code>sizeof(*d-&gt;A)</code>。</li>
<li>判满条件是 <code>n == cap</code>，先扩容再写 <code>A[n]</code>。容量为 0 时 0 × 2 仍是 0，所以把 0 单独处理成 1。</li>
<li><strong>扩容后旧地址可能失效</strong>。保存下来的 <code>&amp;d.A[i]</code> 在下一次 append 之后可能成了悬空指针（dangling pointer），需要长期引用某个元素时记下标。第 12 周客座讲座的订单簿（只考概念）正因为这一点，在哈希表里存数量而不存指向数组的指针。</li>
</ul>
<table>
<thead><tr><th>操作</th><th>动态数组的代价</th></tr></thead>
<tbody>
<tr><td>按下标访问 A[i]</td><td>O(1)，仍是连续内存</td></tr>
<tr><td>末尾 append</td><td>最坏 O(n)，均摊 O(1)</td></tr>
<tr><td>删除末尾元素</td><td>O(1)</td></tr>
<tr><td>在开头或中间插入、删除</td><td>O(n)，要移位</td></tr>
<tr><td>空间</td><td>O(n)</td></tr>
</tbody>
</table>

<h2>去均摊：每次都 O(1)（不考）</h2>
<p>课上另外讲过一个技巧，同时说明不考：让每一次 append 最坏也是 O(1)，称为去均摊（de-amortisation）。容量 N 的数组到半满（N/2 个元素）时，就提前申请容量 2N 的新数组（假设申请本身是 O(1)）。此后每次 append 把新元素同时写进新旧两个数组，再把一个旧元素搬到新数组，每次只做 3 件常数时间的事。再过 N/2 次，旧数组正好装满，前 N/2 个旧元素也正好搬完，于是丢掉旧数组；这时新数组有 N 个元素，恰好半满，下一轮立刻开始。课上的比喻：均摊像攒一个月的袜子在月底一天洗完，去均摊则是每天洗当天的一双再加一双旧的，总量一样，但没有哪一天特别累。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择、判断</strong>：翻倍时 append 的均摊代价（O(1)）和单次最坏（O(n)）；改成 ×3、×10 是否仍是 O(1)（是）；+1、+100 的均摊（Θ(n)，n 次共 Θ(n²)）；均摊代价的定义。</li>
<li><strong>计算填空</strong>：给出初始容量、倍数和 append 次数，求扩容次数、复制总数、最终容量。把每次扩容前的容量 c、2c、4c、…列出来相加即可。公式表上有等差、等比求和；均摊的定义和“乘常数 → O(1)，加常数 → Θ(n)”要自己记。</li>
<li><strong>C 代码</strong>：写 append，或读一段 realloc 代码找错。2015 年期末的读程序题就用了“满了按 2 倍 realloc”的字符串指针数组。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>“单次最坏 Θ(n)，所以 n 次 append 最坏 Θ(n²)”是错的：n 次合计只有 Θ(n)。</li>
<li>均摊 O(1) 不等于每次都 O(1)，也不是对随机输入取期望。</li>
<li>把加的常数调大（+1000）不会变成 O(1)，只有按倍数增长才行。</li>
<li>动态数组在开头插入仍是 O(n)。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 初始容量 4，满了就翻倍，从空开始连续 append 50 个元素。扩容几次？最终容量多少？一共复制多少个元素？写入、复制各算 1 时，平均每次 append 的代价是多少？</summary>
  <div class="qa__body">
<p>扩容发生在 n 等于容量时：第 5、9、17、33 次 append 之前，n 分别是 4、8、16、32。共 <strong>4 次</strong>，容量 4 → 8 → 16 → 32 → <strong>64</strong>；50 ≤ 64，之后不再扩容。</p>
<p>复制 4 + 8 + 16 + 32 = <strong>60</strong> 个元素。总代价 50 + 60 = 110，平均 110 / 50 = <strong>2.2</strong>，小于 3。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 多选，哪些正确？(A) 翻倍策略下单次 append 最坏是 Θ(n)；(B) 翻倍策略下从空数组连续 append n 次，最坏总时间是 Θ(n²)；(C) 每次扩容增加 1000 格，append 的均摊代价是 O(1)；(D) 每次扩容为原来的 3 倍，append 的均摊代价是 O(1)；(E) 均摊 O(1) 的意思是对随机输入，单次 append 的期望代价是 O(1)。</summary>
  <div class="qa__body">
<p><strong>A、D 正确。</strong></p>
<p>A：数组正满的那一次要复制全部 n 个元素。D：倍数是大于 1 的常数，复制总数小于 1.5n。</p>
<p>B 错：复制总数小于 2n，n 次合计 Θ(n)。用单次最坏乘以 n 得到的 O(n²) 只是一个松的上界，说成 Θ(n²) 就错了。C 错：每 1000 次扩容一次，复制总数约 n²/2000，仍是 Θ(n²)，均摊 Θ(n)。E 错：均摊是对任意一串操作的总代价求平均，不涉及概率。</p>
  </div>
</details>
<p>第 3 题的代码，<code>darray_t</code> 同上，初值为 <code>{NULL, 0, 0}</code>：</p>
<pre><code>void append(darray_t *d, int x) {
    if (d-&gt;n &gt; d-&gt;cap) {
        d-&gt;cap = 2 * d-&gt;cap;
        d-&gt;A = realloc(d-&gt;A, d-&gt;cap);
    }
    d-&gt;A[d-&gt;n] = x;
    d-&gt;n++;
}</code></pre>
<details class="qa">
  <summary class="ripple-surface">3. 上面的 append 有哪些错误？逐一指出并改正。</summary>
  <div class="qa__body">
<p>四处：</p>
<ul>
<li>判满写成了 <code>n &gt; cap</code>。<code>n == cap</code> 时不扩容，直接写 <code>A[cap]</code>，越界。应为 <code>==</code>。</li>
<li>容量从 0 开始，<code>2 * 0</code> 仍是 0，永远长不大。</li>
<li>realloc 的第二个参数是字节数，少乘了 <code>sizeof(*d-&gt;A)</code>，分到的空间只有所需的 1/4（int 占 4 字节时）。</li>
<li>realloc 的结果直接赋给 <code>d-&gt;A</code>，失败时旧块丢失；之后照样写入，会对 NULL 解引用。</li>
</ul>
<p>四处都改完（再让函数返回是否成功），就是上面的 <code>da_append</code>。</p>
  </div>
</details>
<p>第 4 题的代码，<code>da_append</code> 是上面的版本：</p>
<pre><code>darray_t d = {NULL, 0, 0};
for (int i = 1; i &lt;= 4; i++) {
    da_append(&amp;d, 10 * i);
}
int *first = &amp;d.A[0];
da_append(&amp;d, 50);
printf("%d\\n", *first);</code></pre>
<details class="qa">
  <summary class="ripple-surface">4. 这段代码一定输出 10 吗？</summary>
  <div class="qa__body">
<p><strong>不一定。</strong>前 4 次 append 后容量依次变为 1、2、4，此时 n = cap = 4，第 5 次触发 realloc。如果 realloc 把数据搬到了新地址，旧块已被释放，<code>first</code> 成了悬空指针，读 <code>*first</code> 是未定义行为。如果 realloc 恰好原地加长，程序会碰巧输出 10，所以测试时不一定暴露。</p>
<p>改法：记住下标 0，append 之后再读 <code>d.A[0]</code>，结果一定是 10。</p>
  </div>
</details>
`;
