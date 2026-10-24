/* Post body — dsa-heapsort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-heapsort:zh'] = `
<p class="lead">堆排序（heapsort）：先把数组建成最大堆（max-heap），再反复把堆顶的最大值换到末尾、堆缩小一格、新堆顶下沉（sift down）。最坏情况也是 Θ(n log n)，原地，不稳定。</p>

<h2>从一个场景说起</h2>
<p>还是 5.2 选择排序里那位体育老师，要让 n 个同学按身高从矮到高站好。选择排序每轮都把剩下的人从头看到尾才挑出一个，上一轮看到的信息全扔了，n 轮下来是 n²。</p>
<p>换个办法。先让大家站成一个“金字塔”：塔尖 1 个人，每个人身后再跟 2 个人，规定<strong>谁都不比自己身后的两个人矮</strong>。这样站好，塔尖一定是全场最高的。</p>
<p>接下来反复做两件事：</p>
<ol>
<li>塔尖的人和金字塔里最后一个人对调。最高的人就到了队尾，他本来就该排最后，从此不再动。</li>
<li>换上塔尖的人多半偏矮。让他和身后两人里<strong>更高的</strong>那个换位置，一层层往下换，直到他不比身后的人矮。塔尖又是剩下的人里最高的。</li>
</ol>
<p>金字塔只有约 log₂ n 层，每轮只要换几次，不用再把所有人看一遍。这就是堆排序。</p>

<h2>它是什么</h2>
<p>简单说，堆排序就是：<strong>先建一个最大堆，再反复把堆顶的最大值换到最后</strong>。</p>
<p>上面的“金字塔”就是 6.1 讲的最大堆：每个结点都 ≥ 它的孩子，整棵树存在一个数组里。本课约定<strong>数组从下标 1 开始</strong>，H[0] 不用：H[i] 的孩子是 H[2i] 和 H[2i+1]，堆顶 H[1] 就是最大值。</p>
<p>算法分两个阶段：</p>
<ol>
<li><strong>建堆（build heap）</strong>：i 从 ⌊n/2⌋ 倒着走到 1，依次对 H[i] 做下沉。这就是 6.3 的自底向上建堆（bottom-up），Θ(n)。</li>
<li><strong>排序</strong>：做 <strong>n − 1 轮</strong>，每轮三步：
<ul>
<li><strong>换</strong>：堆顶 H[1] 和堆的最后一个元素 H[size] 交换；</li>
<li><strong>缩</strong>：size 减 1，刚换过去的最大值不再属于堆；</li>
<li><strong>沉</strong>：新堆顶在缩小后的堆里下沉，每次和<strong>较大的</strong>孩子交换。这一步和 6.2 的删除最大值（delete max）完全一样。</li>
</ul>
</li>
</ol>
<p>任何时刻数组都分成两段：左段 H[1..size] 是最大堆；右段 H[size+1..n] 是全体中最大的那几个，已经升序放好，以后不再移动。最后剩下的 1 个元素一定是最小值，已经在 H[1]，所以 n − 1 轮就够。</p>
<figure class="fig"><svg viewBox="0 0 600 150" width="600" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="hs-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#d97757"/></marker></defs>
<path d="M65,30 Q221,-8 377,30" fill="none" stroke="#d97757" stroke-width="2" marker-start="url(#hs-arr)" marker-end="url(#hs-arr)"/>
<text x="392" y="22" font-size="13" fill="#d97757">下一轮：H[1] 与 H[7] 交换</text>
<g font-size="12" fill="#a1a1a0" text-anchor="middle">
<text x="65" y="44">1</text><text x="117" y="44">2</text><text x="169" y="44">3</text><text x="221" y="44">4</text><text x="273" y="44">5</text>
<text x="325" y="44">6</text><text x="377" y="44">7</text><text x="429" y="44">8</text><text x="481" y="44">9</text><text x="533" y="44">10</text>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="1.5">
<rect x="40" y="50" width="50" height="36" rx="6" stroke="#d97757" stroke-width="2"/><rect x="92" y="50" width="50" height="36" rx="6"/><rect x="144" y="50" width="50" height="36" rx="6"/>
<rect x="196" y="50" width="50" height="36" rx="6"/><rect x="248" y="50" width="50" height="36" rx="6"/><rect x="300" y="50" width="50" height="36" rx="6"/>
<rect x="352" y="50" width="50" height="36" rx="6" stroke="#d97757" stroke-width="2"/>
</g>
<g fill="#2e2e2d" stroke="#5a5a59" stroke-width="1.5" stroke-dasharray="4 3">
<rect x="404" y="50" width="50" height="36" rx="6"/><rect x="456" y="50" width="50" height="36" rx="6"/><rect x="508" y="50" width="50" height="36" rx="6"/>
</g>
<g font-size="15" font-weight="600" text-anchor="middle" dominant-baseline="central">
<g fill="#e8e8e8"><text x="65" y="68">19</text><text x="117" y="68">12</text><text x="169" y="68">7</text><text x="221" y="68">7</text><text x="273" y="68">7</text><text x="325" y="68">6</text><text x="377" y="68">2</text></g>
<g fill="#a1a1a0"><text x="429" y="68">24</text><text x="481" y="68">26</text><text x="533" y="68">27</text></g>
</g>
<path d="M40,94 v6 h362 v-6" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
<path d="M404,94 v6 h154 v-6" fill="none" stroke="#4ade80" stroke-width="1.5"/>
<g font-size="13" text-anchor="middle">
<text x="221" y="120" fill="#38bdf8">H[1..7] 是最大堆，size = 7</text>
<text x="221" y="138" fill="#a1a1a0">堆顶 19 是堆里最大的</text>
<text x="481" y="120" fill="#4ade80">已排好：最大的 3 个</text>
<text x="481" y="138" fill="#a1a1a0">升序，不再移动</text>
</g>
</svg><figcaption>下面课上例子第 3 轮结束时的数组：蓝色是堆，绿色已排好。下一轮把 19 换到 H[7]，换上来的 2 再下沉。</figcaption></figure>

<h2>看个例子</h2>
<p>课上用的是 6.1 那个最大堆，n = 10：</p>
<pre><code class="lang-text">下标   1   2   3   4   5   6   7   8   9  10
H     27  24  26   7  12   6  19   2   7   7</code></pre>
<p>它本来就是最大堆，所以建堆阶段 5 个父结点都不用动，直接进入排序。</p>
<p><strong>第 1 轮</strong>：堆顶 27 是最大值，和最后一格 H[10] = 7 交换，27 到了最终位置，size 变成 9。换上堆顶的 7 比孩子小，开始下沉。<strong>第 2 轮</strong>一模一样，只是堆又小了一格：</p>
<pre><code class="lang-text">第 1 轮  交换 H[1]=27 与 H[10]=7，size = 9
         7 的孩子 24、26，较大的 26 &gt; 7，交换
         7 在下标 3，孩子 6、19，较大的 19 &gt; 7，交换
         7 在下标 7，2×7 = 14 &gt; 9，没有孩子，停
         26 24 19 7 12 6 7 2 7 | 27
第 2 轮  交换 H[1]=26 与 H[9]=7，size = 8
         7 的孩子 24、19，较大的 24 &gt; 7，交换
         7 在下标 2，孩子 7、12，较大的 12 &gt; 7，交换
         7 在下标 5，2×5 = 10 &gt; 8，没有孩子，停
         24 12 19 7 7 6 7 2 | 26 27</code></pre>
<p>竖线左边是堆，右边是已排好的部分。看第 2 轮最后一步：下标 5 的左孩子位置是 H[10]，放着已归位的 27；size 已经缩到 8，它不算孩子，7 停下。<strong>先缩小堆再下沉</strong>，排好的数才不会被换回来。</p>
<p>全部 9 轮如下，“下沉”一列是换上堆顶的元素一路做的交换：</p>
<table>
<thead><tr><th>轮</th><th>堆顶 ↔ 末尾</th><th>size</th><th>下沉</th><th>本轮之后（| 右边已排好）</th></tr></thead>
<tbody>
<tr><td>1</td><td>27 ↔ 7</td><td>9</td><td>7↔26, 7↔19</td><td>26 24 19 7 12 6 7 2 7 | 27</td></tr>
<tr><td>2</td><td>26 ↔ 7</td><td>8</td><td>7↔24, 7↔12</td><td>24 12 19 7 7 6 7 2 | 26 27</td></tr>
<tr><td>3</td><td>24 ↔ 2</td><td>7</td><td>2↔19, 2↔7</td><td>19 12 7 7 7 6 2 | 24 26 27</td></tr>
<tr><td>4</td><td>19 ↔ 2</td><td>6</td><td>2↔12, 2↔7</td><td>12 7 7 2 7 6 | 19 24 26 27</td></tr>
<tr><td>5</td><td>12 ↔ 6</td><td>5</td><td>6↔7, 6↔7</td><td>7 7 7 2 6 | 12 19 24 26 27</td></tr>
<tr><td>6</td><td>7 ↔ 6</td><td>4</td><td>6↔7</td><td>7 6 7 2 | 7 12 19 24 26 27</td></tr>
<tr><td>7</td><td>7 ↔ 2</td><td>3</td><td>2↔7</td><td>7 6 2 | 7 7 12 19 24 26 27</td></tr>
<tr><td>8</td><td>7 ↔ 2</td><td>2</td><td>2↔6</td><td>6 2 | 7 7 7 12 19 24 26 27</td></tr>
<tr><td>9</td><td>6 ↔ 2</td><td>1</td><td>—</td><td>2 | 6 7 7 7 12 19 24 26 27</td></tr>
</tbody>
</table>
<p>结果 2 6 7 7 7 12 19 24 26 27。第 4、5、6 轮遇到两个孩子都是 7，这里取左孩子；课上没规定并列选哪个，取右也对，最终结果一样。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-heapsort/anims/heapsort.html" loading="lazy" style="height: 560px;" title="堆排序逐步演示"></iframe>
<p class="anim-caption">按“下一步”或“播放”：先看建堆，再看每轮堆顶换到末尾、灰色已排好部分向左长一格、新堆顶下沉。“乱序输入”是 6.3 的建堆例子，“三个 7”看相等元素的次序。</p>

<h2>C 代码：一个 siftdown 加两个循环</h2>
<pre><code>void siftdown(int H[], int size, int i) {
    while (2 * i &lt;= size) {
        int c = 2 * i;
        if (c + 1 &lt;= size &amp;&amp; H[c + 1] &gt; H[c])
            c++;
        if (H[i] &gt;= H[c])
            break;
        swap(&amp;H[i], &amp;H[c]);
        i = c;
    }
}

void heap_sort(int H[], int n) {
    for (int i = n / 2; i &gt;= 1; i--)
        siftdown(H, n, i);
    for (int size = n; size &gt; 1; size--) {
        swap(&amp;H[1], &amp;H[size]);
        siftdown(H, size - 1, 1);
    }
}</code></pre>
<p><code>swap</code> 就是 5.2 里那个借临时变量交换两个整数的函数。逐行看：</p>
<ul>
<li><strong>第 2 行</strong>：2i ≤ size 说明 i 至少有左孩子。没有孩子就是叶子，下沉结束。</li>
<li><strong>第 3–5 行</strong>：c 先指左孩子；如果右孩子存在并且严格更大，就改指右孩子。于是 c 就是<strong>较大的孩子</strong>，相等时取左。</li>
<li><strong>第 6–7 行</strong>：自己已经 ≥ 较大的孩子，堆条件满足，停。</li>
<li><strong>第 8–9 行</strong>：否则和较大的孩子交换，跟着下到 c，继续往下看。</li>
<li><strong>第 14–15 行</strong>：阶段 1，自底向上建堆。从最后一个父结点 ⌊n/2⌋ 倒着做到 1，堆大小是 n。</li>
<li><strong>第 16–17 行</strong>：阶段 2，size 从 n 到 2，共 n − 1 轮。每轮先把堆顶换到 H[size]，那是它的最终位置。</li>
<li><strong>第 18 行</strong>：交换之后堆只剩 H[1..size−1]，所以传 <code>size - 1</code>。写成 <code>size</code> 是最常见的 bug：刚放好的最大值会被当成孩子，又换回堆顶。</li>
</ul>
<p>如果考题的数组从下标 0 开始：孩子是 2i+1 和 2i+2，最后一个父结点是 ⌊n/2⌋ − 1，堆顶是 A[0]。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/2DmK_H7IdTo" title="Heap sort in 4 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Heap sort in 4 minutes》（英文），用树和数组演示建最大堆、再反复把堆顶换到末尾并下沉。下标以本课为准：从 1 开始，孩子是 2i 和 2i+1。</p>

<h2>复杂度：最坏也是 n log n</h2>
<ul>
<li><strong>建堆</strong>：自底向上，Θ(n)，推导见 6.3。</li>
<li><strong>排序</strong>：n − 1 轮，每轮一次下沉。完全二叉树从根往下最多 ⌊log₂ n⌋ 层，每层最多 2 次比较、1 次交换，所以每轮 O(log n)，合计 O(n log n)。</li>
</ul>
<div class="callout key" data-label="考点">
<p><strong>堆排序 = Θ(n) 建堆 + (n − 1) 次 O(log n) 的下沉 = O(n log n)，最坏情况也是。</strong>这是有保证的 n log n。</p>
</div>
<p>输入已经有序也占不到便宜：每轮换上堆顶的元素来自最底层，一般较小，往往又要沉回底部。用上面的代码排 10000 个已升序的数，比较 244460 次，比随机输入（平均约 235000 次）还多。这叫<strong>不自适应（not adaptive）</strong>。</p>
<p>所有键都相等时，下沉第一次比较就停，理论上最好情况是 Θ(n)。但<strong>课上明确说考试不问堆排序的最好情况</strong>，一律答 O(n log n)。</p>

<h2>原地、不稳定、实际偏慢</h2>
<p><strong>原地（in-place）</strong>：只在数组内交换，额外只用几个变量，O(1) 空间。</p>
<p><strong>不稳定（unstable）</strong>：堆顶和末尾的交换一下跨过整个堆，会越过和它相等的元素。最小的反例是三个相等的 7₁ 7₂ 7₃：</p>
<ul>
<li>建堆：都相等，不动。</li>
<li>第 1 轮：7₁ 和 7₃ 交换，得到 7₃ 7₂ | 7₁；7₃ 不小于 7₂，不下沉。</li>
<li>第 2 轮：7₃ 和 7₂ 交换，结果 7₂ 7₃ 7₁。</li>
</ul>
<p>原来的次序被打乱了。动画的“课上例子”里，三个 7 排完也是 7₃ 7₂ 7₁，完全反了。</p>
<p><strong>实际比快速排序慢</strong>：孩子在 2i，越往下跳得越远，内存访问不连续，缓存（cache）利用差；快速排序是顺序扫描。硬件细节不考。</p>
<table>
<thead><tr><th></th><th>最坏</th><th>额外空间</th><th>稳定</th></tr></thead>
<tbody>
<tr><td>快速排序</td><td>Θ(n²)</td><td>原地</td><td>否</td></tr>
<tr><td>归并排序</td><td>Θ(n log n)</td><td>O(n) 数组</td><td>是</td></tr>
<tr><td>堆排序</td><td>Θ(n log n)</td><td>O(1)</td><td>否</td></tr>
</tbody>
</table>
<p><strong>既要保证最坏 n log n，又要省内存，选堆排序。</strong></p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>（最常见）：给一个数组，先自底向上建堆，再写出每轮或第 k 轮之后的数组，标出堆和已排好部分的分界。</li>
<li><strong>选择题</strong>：最坏 O(n log n)、原地、不稳定、不自适应；或按场景挑排序算法。</li>
<li><strong>读/写代码</strong>：一个 siftdown 加两个循环。先看清数组从下标 0 还是 1 开始。</li>
</ul>
<p>公式表上没有堆的内容：孩子下标、最后一个父结点 ⌊n/2⌋、n − 1 轮、各阶段复杂度都要自己记。</p>

<h3>例题 1：手算一遍</h3>
<p>用最大堆对 [5, 3, 8, 1, 9, 6, 2] 做堆排序（下标从 1 开始，自底向上建堆），写出建堆后和每一轮之后的数组。</p>
<p>先建堆。n = 7，父结点是下标 3、2、1，倒着做：</p>
<pre><code class="lang-text">i = 3：8 的孩子 6、2，8 最大，不动
i = 2：3 的孩子 1、9，与 9 交换；3 到下标 5，是叶子
i = 1：5 的孩子 9、8，与 9 交换；5 到下标 2，孩子 1、3，不动
建堆后：9 5 8 1 3 6 2</code></pre>
<p>再排序，共 6 轮：</p>
<pre><code class="lang-text">第 1 轮  9 ↔ 2，size 6；2↔8，2↔6     →  8 5 6 1 3 2 | 9
第 2 轮  8 ↔ 2，size 5；2↔6          →  6 5 2 1 3 | 8 9
第 3 轮  6 ↔ 3，size 4；3↔5          →  5 3 2 1 | 6 8 9
第 4 轮  5 ↔ 1，size 3；1↔3          →  3 1 2 | 5 6 8 9
第 5 轮  3 ↔ 2，size 2；2 ≥ 1，不动   →  2 1 | 3 5 6 8 9
第 6 轮  2 ↔ 1，size 1               →  1 | 2 3 5 6 8 9</code></pre>
<p>两处容易卡住：第 2 轮 2 换到下标 3 后，孩子下标 6 已经超出 size = 5，停；第 3 轮 3 到下标 2 后只剩左孩子 H[4] = 1（H[5] 已经不在堆里），3 ≥ 1，停。结果 1 2 3 5 6 8 9。</p>

<h3>例题 2：哪个可能是第 3 轮之后的数组</h3>
<p>对某个 8 个元素的数组做堆排序（最大堆，下标从 1 开始）。下面哪个可能是第 3 轮结束后的数组？(A) 9 7 8 1 2 10 12 15；(B) 8 7 9 1 2 10 12 15；(C) 9 7 8 1 2 12 10 15；(D) 11 7 8 1 2 10 12 15</p>
<p>用“两段”去对照。3 轮之后 size = 5，所以 H[1..5] 必须是最大堆，H[6..8] 必须是全体最大的 3 个，并且升序。</p>
<ul>
<li>(A) 前 5 个 9 7 8 1 2：9 ≥ 7、8，7 ≥ 1、2，是最大堆；后 3 个 10 12 15 升序，且都比 9 大。<strong>可能</strong>：输入正是 [9, 7, 8, 1, 2, 10, 12, 15] 时，3 轮后就是这个数组。</li>
<li>(B) 堆顶 8 &lt; 右孩子 9，前 5 个不是堆。</li>
<li>(C) 12 10 15 不是升序。</li>
<li>(D) 堆里的 11 比已排好的 10 大，10 不可能比 11 先被取出。</li>
</ul>
<p>答案是 <strong>A</strong>。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>下沉时没有先缩小堆，刚放好的最大值又被换回堆里。</li>
<li>和较小的孩子交换，或者只和左孩子比。</li>
<li>做成 n 轮或 n − 2 轮：正确是 n − 1 轮。</li>
<li>用最小堆（min-heap）照同样的步骤原地排序，得到的是<strong>降序</strong>；要升序用最大堆。</li>
<li>建堆时 i 从 1 正着走到 ⌊n/2⌋：自底向上必须从最后一个父结点倒着做。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>两个阶段：自底向上建最大堆 Θ(n)；再做 n − 1 轮“换、缩、沉”：堆顶和 H[size] 交换，size 减 1，新堆顶和较大的孩子交换往下沉。</li>
<li>数组始终分两段：左边是堆，右边是最大的几个、已升序，不再移动。</li>
<li>最坏也是 O(n log n)，不自适应；最好情况考试不问。</li>
<li>原地 O(1)，不稳定（堆顶和末尾的远距离交换），实际一般比快速排序慢。</li>
</ul>
`;
