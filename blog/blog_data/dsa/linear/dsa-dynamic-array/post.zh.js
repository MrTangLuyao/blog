/* Post body — dsa-dynamic-array / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-dynamic-array:zh'] = `
<p class="lead">动态数组（dynamic array）装满了就换一块更大的内存，把旧元素搬过去。关键在每次扩多少：每次加 1 格，n 次追加共 Θ(n²)；每次翻倍，单次最坏 Θ(n)，均摊（amortised）下来每次只要 O(1)。</p>

<h2>从一个场景说起：书架满了</h2>
<p>你的书架有 100 格，正好放满，又买了 10 本新书。书架左右都贴着别的家具，没法接长。唯一的办法是买个更大的书架，把 100 本书一本本搬过去，再放新书。</p>
<p>C 的数组也是这样。课上的例子：为学生字典开了 100 格的数组，结果来了 110 名学生。数组后面紧挨的内存可能已经分给了别的变量，没法原地加长，只能申请一块更大的新数组，把旧元素逐个复制过去，释放旧数组，再写入新元素。</p>
<p>搬家的累和书的多少成正比：<strong>复制 k 个元素要 k 次操作</strong>。那新书架买多大？只大 1 格，下一本书来了又得搬；大一倍，就能安稳很久。</p>

<h2>它是什么：会自己搬家的数组</h2>
<p>简单说，动态数组就是一个装满了会自动换大地方的数组。它由三样东西组成，正好对上书架：</p>
<ul>
<li><strong>指针 <code>A</code></strong>：指向堆上的数组，相当于书架本身，搬家后指向新的那块。</li>
<li><strong>个数 <code>n</code></strong>：已经放了几个元素，相当于书架上有几本书。</li>
<li><strong>容量（capacity）<code>cap</code></strong>：一共有几格，相当于书架的格数。</li>
</ul>
<p>在末尾追加（append）一个元素时分两种情况：</p>
<ul>
<li><code>n &lt; cap</code>，还有空格：直接写进 <code>A[n]</code>，代价 1。</li>
<li><code>n == cap</code>，满了：先扩容（resize），把 n 个旧元素复制到新数组，代价 n；再写入，代价 1。</li>
</ul>
<p>“新数组开多大”叫扩容策略（growth policy）。下面统一这样计数：<strong>写入或复制一个元素各算 1，初始容量为 1</strong>。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/PEnFFiQe1pM" title="Dynamic and Static Arrays" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：WilliamFiset《Dynamic and Static Arrays》（英文），后半段讲动态数组：装满时开一个两倍大的新数组，把元素复制过去。</p>

<h2>看个例子：两种扩容策略</h2>
<h3>每次只加 1 格</h3>
<p>满了就加 1 格。可加完正好又满，下一个元素来了还得搬：</p>
<ul>
<li>第 1 次：容量 1，空着，直接写。代价 1。</li>
<li>第 2 次：1 格已满，扩到 2，复制 1 个，再写。代价 2。</li>
<li>第 3 次：2 格又满，扩到 3，复制 2 个，再写。代价 3。</li>
<li>以此类推，第 k 次要复制 k − 1 个。</li>
</ul>
<p>连续 append n 个，复制总数是</p>
<pre><code class="lang-text">0 + 1 + 2 + … + (n − 1) = n(n − 1)/2</code></pre>
<p>这是公式表上的等差求和。n = 8 时复制 28 次，加上 8 次写入共 36；n = 100 时光复制就 4950 次。<strong>总代价 Θ(n²)，平均每次 Θ(n)</strong>。</p>
<p>每次加常数 c 格（如 10、100）也救不了：每 c 次 append 搬一次家，复制总数约 n²/(2c)，<strong>仍是 Θ(n²)</strong>。</p>

<h3>每次翻倍</h3>
<p>换成满了就把容量翻倍（×2），还是从容量 1 开始：</p>
<ul>
<li>第 1 次：直接写。代价 1。</li>
<li>第 2 次：满了（1/1），扩到 2，复制 1 个。代价 2。</li>
<li>第 3 次：满了（2/2），扩到 4，复制 2 个。代价 3。</li>
<li>第 4 次：4 格只用了 3 格，直接写。代价 1。</li>
<li>第 5 次：满了（4/4），扩到 8，复制 4 个。代价 5。之后第 6、7、8 次都有空位，各花 1。</li>
</ul>
<p>一直做到第 17 次：</p>
<pre><code class="lang-text">第 k 次 append  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
复制个数        0  1  2  0  4  0  0  0  8  0  0  0  0  0  0  0 16
本次代价        1  2  3  1  5  1  1  1  9  1  1  1  1  1  1  1 17
之后的容量      1  2  4  4  8  8  8  8 16 16 16 16 16 16 16 16 32</code></pre>
<p>扩容只发生在第 2、3、5、9、17 次，这时已有的元素个数 1、2、4、8、16 都是 2 的幂。规律是：<strong>搬一次 c 个元素，换来 c − 1 次只花 1 的 append</strong>，然后才轮到下一次扩容。</p>
<p>第 17 次一次就花了 17，所以<strong>单次 append 最坏 Θ(n)</strong>。可 17 次的总代价只有 17 次写入加 31 次复制，共 48，平均约 2.8。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-dynamic-array/anims/grow.html" loading="lazy" style="height: 500px;" title="动态数组扩容与每次 append 的代价"></iframe>
<p class="anim-caption">先选扩容策略（+1、×2、×3），再按“下一步”或“播放”。上方是数组，扩容那一步新旧数组同时出现；下方条形是每次 append 的代价，黄线是到目前为止的平均。+1 时黄线一路往上爬，×2 时一直在 3 以下。</p>

<h2>均摊代价：把一次大开销摊开</h2>
<p>翻倍时有的 append 很贵，有的很便宜，单看一次说明不了问题，要看均摊代价（amortised cost）：</p>
<div class="callout key" data-label="考点">
<p><strong>均摊代价 = 一串操作的总代价 ÷ 操作次数</strong>。它看一长串操作的平均表现，不看某一次。</p>
</div>
<p>回到书架：搬一次大书架很累，但搬完能安稳放很多本书。把搬家的累摊到之后放的每一本书上，每本只多一点点。</p>
<p>课上的论证：容量为 N 的数组从空开始，插入 2N 个元素。</p>
<ul>
<li>前 N 次各花 1，共 N；</li>
<li>第 N + 1 次满了，扩到 2N，复制 N 个；</li>
<li>后 N 次的写入又是 N。</li>
</ul>
<p>总代价 3N，操作 2N 次，均摊 1.5，是 <strong>O(1)</strong>。</p>
<p>一般情况：从容量 1 开始连续 append n 次，各次扩容复制的个数是 1, 2, 4, …, 2<sup>j</sup>，其中 2<sup>j</sup> &lt; n。用公式表上的等比求和（r = 2）：</p>
<pre><code class="lang-text">1 + 2 + 4 + … + 2^j = 2^(j+1) − 1 &lt; 2n
总代价 = 写入 n + 复制 &lt; 3n</code></pre>
<p>所以<strong>每次 append 均摊不超过 3，是 O(1)；n 次 append 合计 Θ(n)</strong>。</p>
<div class="callout note" data-label="注意">
<p>均摊不是平均情况（average case）：平均情况对随机输入取期望，均摊对<strong>任何</strong>一串 append 都成立，不涉及概率。不过课上的测验题用 average 一词问这个代价时，指的就是均摊，答 O(1)。</p>
</div>

<h2>补充：×3 也行，+10 不行</h2>
<p>第 4 周的课堂测验问：满了改成扩为 3 倍，均摊是多少？<strong>仍是 O(1)</strong>。容量从 n 变成 3n 后，接下来约 2n 次 append 都不用搬，一次 O(n) 的复制摊到 2n 次上。</p>
<p>一般地，<strong>每次乘一个常数 r &gt; 1（×1.5、×2、×3……），均摊都是 O(1)</strong>：复制总数小于 n·r/(r − 1)，×2 时小于 2n，×3 时小于 1.5n。<strong>每次加一个常数，不管多大，均摊都是 Θ(n)</strong>。从容量 1 开始连续 append 1000 个：</p>
<table>
<thead><tr><th>策略</th><th>扩容次数</th><th>复制总数</th><th>平均每次代价</th></tr></thead>
<tbody>
<tr><td>+1</td><td>999</td><td>499500</td><td>500.5</td></tr>
<tr><td>+10</td><td>100</td><td>49600</td><td>50.6</td></tr>
<tr><td>×2</td><td>10</td><td>1023</td><td>2.02</td></tr>
<tr><td>×3</td><td>7</td><td>1093</td><td>2.09</td></tr>
</tbody>
</table>
<p>+1、+10 的平均随 n 线性增长，×r 的平均始终是常数。倍数越大，搬家越少，空位却越多：×3 到 n = 1000 时容量 2187，一半以上空着，但空间仍是 O(n)。表中 ×3 复制得比 ×2 略多，只因它最后一次扩容恰好搬了 729 个；比较策略看的是上界 1.5n 与 2n。</p>

<h2>补充：在 C 里用 realloc 写 append</h2>
<p><code>realloc(p, bytes)</code> 把 <code>p</code> 指向的堆内存调整为 <code>bytes</code> 字节：后面有空就原地加长；没有就另找一块，把旧内容复制过去，释放旧块，返回新地址。失败时返回 <code>NULL</code>，旧块原封不动。上面说的“复制 n 个元素”就发生在它里面。</p>
<pre><code>typedef struct {
    int *A;      /* elements A[0..n-1], on the heap */
    int n;       /* number of elements in use */
    int cap;     /* number of slots allocated */
} darray_t;

/* append x at the end; returns 1 on success, 0 if out of memory */
int da_append(darray_t *d, int x) {
    if (d-&gt;n == d-&gt;cap) {                          /* full: grow */
        int newcap = (d-&gt;cap == 0) ? 1 : 2 * d-&gt;cap;
        int *tmp = realloc(d-&gt;A, newcap * sizeof(*d-&gt;A));
        if (tmp == NULL) {
            return 0;                              /* d-&gt;A is still valid */
        }
        d-&gt;A = tmp;                                /* the block may have moved */
        d-&gt;cap = newcap;
    }
    d-&gt;A[d-&gt;n] = x;
    d-&gt;n++;
    return 1;
}</code></pre>
<p>空数组的初值写成 <code>darray_t d = {NULL, 0, 0};</code>。逐行看：</p>
<ul>
<li><strong>第 1–5 行</strong>：那三样东西。</li>
<li><strong>第 9 行</strong>：判满用 <code>n == cap</code>，满了先扩容再写。</li>
<li><strong>第 10 行</strong>：新容量翻倍。2 × 0 还是 0，所以容量 0 单独设成 1。</li>
<li><strong>第 11 行</strong>：第二个参数是<strong>字节数</strong>，要乘 <code>sizeof(*d-&gt;A)</code>。第一次调用时 <code>d-&gt;A</code> 是 NULL，这时 realloc 就等于 malloc。</li>
<li><strong>第 12–14 行</strong>：结果<strong>先放进临时指针 <code>tmp</code></strong>，是 NULL 就报告失败，<code>d-&gt;A</code> 还指着旧块。</li>
<li><strong>第 15–16 行</strong>：成功了才存回新地址和新容量。块可能搬了家，必须用返回值。</li>
<li><strong>第 18–20 行</strong>：写入，个数加 1。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>写成 <code>d-&gt;A = realloc(d-&gt;A, …)</code>：一旦失败，NULL 覆盖了唯一指向旧块的指针，数据找不回来，旧块也泄漏了。</li>
<li><strong>扩容后旧地址可能失效。</strong>先记下 <code>int *first = &amp;d.A[0]</code>，再 append 一次触发扩容，<code>first</code> 就可能成了悬空指针（dangling pointer）。长期引用某个元素要记下标。第 12 周客座讲座的订单簿（只考概念）就因此存数量，不存指向数组的指针。</li>
</ul>
</div>
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

<h2>补充：去均摊（不考）</h2>
<p>想让每一次 append 最坏也是 O(1)，可以去均摊（de-amortisation）：容量 N 的数组半满时就提前申请 2N 的新数组，之后每次 append 写入新元素，再顺手搬一个旧元素。等旧数组满了，旧元素也正好搬完。课上的比喻：均摊像攒一个月的袜子月底一起洗，去均摊是每天多洗一双旧的，没有哪天特别累。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>选择、判断</strong>：翻倍、×3 时 append 的均摊（O(1)）和单次最坏（O(n)）；+1、+100 的均摊（Θ(n)）。</li>
<li><strong>手算填空</strong>：给初始容量、倍数和 append 次数，求扩容次数、复制总数、最终容量。</li>
<li><strong>C 代码</strong>：写 append，或在 realloc 代码里找错。2015 年期末的读程序题就用了“满了按 2 倍 realloc”的字符串指针数组。</li>
</ul>
<p>公式表上有等差、等比求和；均摊的定义和“乘常数 → O(1)，加常数 → Θ(n)”要自己记。</p>

<h3>例题 1：手算扩容</h3>
<p>初始容量 4，满了就翻倍，从空开始连续 append 50 个元素。扩容几次？最终容量多少？共复制多少个元素？写入、复制各算 1，平均每次 append 代价多少？</p>
<p>只有 n 等于容量时才扩容，逐次列出来：</p>
<ul>
<li>第 5 次之前 n = 4，扩到 8，复制 4 个；</li>
<li>第 9 次之前 n = 8，扩到 16，复制 8 个；</li>
<li>第 17 次之前 n = 16，扩到 32，复制 16 个；</li>
<li>第 33 次之前 n = 32，扩到 64，复制 32 个。64 装得下 50 个，不会再扩到 128。</li>
</ul>
<p>答：扩容 <strong>4 次</strong>，最终容量 <strong>64</strong>，复制 4 + 8 + 16 + 32 = <strong>60</strong> 个。总代价 50 + 60 = 110，平均 110 / 50 = <strong>2.2</strong>，确实小于 3。注意从给定的初始容量 4 开始列，不是从 1。</p>

<h3>例题 2：多选</h3>
<p>哪些正确？(A) 翻倍时单次 append 最坏是 Θ(n)；(B) 翻倍时从空数组连续 append n 次，最坏总时间是 Θ(n²)；(C) 每次扩容加 1000 格，append 均摊 O(1)；(D) 每次扩为 3 倍，append 均摊 O(1)；(E) 均摊 O(1) 指对随机输入，单次 append 的期望代价是 O(1)。</p>
<p><strong>答：A、D。</strong></p>
<ul>
<li>A 对：数组正满的那一次要复制全部 n 个元素。</li>
<li>B 错：复制总数小于 2n，n 次合计 Θ(n)。“单次最坏乘以 n”只是松的上界，这是最常见的坑。</li>
<li>C 错：复制总数约 n²/2000，仍是 Θ(n²)，均摊 Θ(n)。</li>
<li>D 对：倍数是大于 1 的常数，复制总数小于 1.5n。</li>
<li>E 错：均摊不涉及概率。</li>
</ul>
<p>另一个坑：在开头插入仍要把元素后移，是 O(n)，快的只有末尾 append。</p>

<h2>小结</h2>
<ul>
<li>动态数组 = 指针 A + 个数 n + 容量 cap。满了就申请更大的数组，把 n 个旧元素复制过去。</li>
<li>每次加常数格（+1、+1000）：n 次 append 共 Θ(n²)，均摊 Θ(n)。</li>
<li>每次乘常数倍（×2、×3）：单次最坏 Θ(n)，均摊 O(1)，n 次合计 Θ(n)。</li>
<li>均摊代价 = 总代价 ÷ 操作次数，对任何一串操作都成立，不是概率上的平均情况。</li>
<li>C 里用 realloc：结果先存临时指针并检查 NULL，大小按字节算；扩容后旧地址可能失效。</li>
</ul>
`;
