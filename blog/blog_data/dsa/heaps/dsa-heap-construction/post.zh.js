/* Post body — dsa-heap-construction / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-heap-construction:zh'] = `
<p class="lead">建堆（heap construction）就是把一个顺序随意的数组整理成堆。有两种做法：逐个插入，最坏 Θ(n log n)；自底向上，只要 Θ(n)。</p>

<h2>从一个场景说起</h2>
<p>一家公司的组织架构图是一棵完全二叉树：每个人最多直接管两个人。公司规定，<strong>每个上司的业绩分都不低于他手下的人</strong>。</p>
<p>现在 n 个人被随便填进了格子里，要调整到合规。有两种思路：</p>
<ul>
<li><strong>一个一个来</strong>：大家排队逐个入座。新人先坐到最底下的空位，分比上司高就和上司换位置，一直往上换到换不动。</li>
<li><strong>从底下往上整理</strong>：最底层的人没有手下，怎么坐都不违规，先不管。从最后一个有手下的人往前检查：谁的分比手下低，就和分更高的那个手下换，一直往下换到合规。</li>
</ul>
<p>两种都能整理好，工作量却差很多。<strong>大约一半的人在最底层</strong>：第一种做法里，他们每个都可能从底一路换到顶；第二种做法里，他们一步都不用动。</p>

<h2>它是什么</h2>
<p>上面的架构图就是堆。本课程默认<strong>最大堆（max-heap）</strong>：父结点不小于孩子。数组<strong>从下标 1 开始</strong>存，H[0] 不用；下标 i 的孩子是 2i 和 2i+1，父结点是 ⌊i/2⌋（见 6.1）。建堆就是把 H[1..n] 里顺序任意的 n 个数整理成满足这个条件的堆。</p>

<h3>方法一：逐个插入</h3>
<p>逐个插入（repeated insertion）就是把 6.2 讲的插入重复做。不用另开数组：k 从 2 走到 n，这时 H[1..k−1] 已经是堆，H[k] 正好在堆末尾的下一格，对它做一次上浮（sift up）——比父结点大就交换，直到不比父结点大或者到了根。</p>

<h3>方法二：自底向上</h3>
<p>自底向上（bottom-up heapify）由三部分组成：</p>
<ol>
<li><strong>叶子不用管</strong>：下标 ⌊n/2⌋+1 到 n 都是叶子。<strong>单个结点自己就是一个堆</strong>，就像架构图最底层的人。</li>
<li><strong>从最后一个父结点倒着来</strong>：i = ⌊n/2⌋, ⌊n/2⌋−1, …, 1。</li>
<li><strong>每个父结点做一次下沉（sift down）</strong>：和<strong>较大的孩子</strong>比，比它小就交换，<strong>一直沉到不小于两个孩子、或者成为叶子为止</strong>。</li>
</ol>
<p>为什么必须倒着来？处理 i 时，它的孩子 2i、2i+1 下标更大，要么已经处理过，要么本来就是叶子。所以 i 下面的两棵子树都已经是堆，只剩 i 自己可能放错，一次 sift down 正好把它放到位。就像先理顺各个小组，再理部门，最后理整个公司。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/HqPJF2L5h9U" title="2.6.3 Heap - Heap Sort - Heapify - Priority Queues" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《2.6.3 Heap - Heap Sort - Heapify - Priority Queues》（英文，约 51 分钟）。看 16:26 起的 Insert（逐个插入）和 42:12–47:00 的 Heapify（自底向上）两段。记法可能和课上不同，手算以本课约定为准。</p>

<h2>看个例子</h2>
<h3>逐个插入：5, 3, 6, 8</h3>
<p>课上先用一个小例子。堆里一开始只有 5。</p>
<ul>
<li>插入 3：放在下标 2，父结点 5 比它大，不动。得到 [5, 3]。</li>
<li>插入 6：放在下标 3，父结点 5 &lt; 6，交换。得到 [6, 3, 5]。</li>
<li>插入 8：放在下标 4，父结点是下标 2 的 3，交换；再和下标 1 的 6 比，又交换，8 成为根。得到 [8, 6, 5, 3]。</li>
</ul>

<h3>自底向上：[1, 0, 7, 3, 7, 4, 1, 8, 2, 4]</h3>
<p>这是课上的主例子。n = 10，最后一个父结点是 ⌊10/2⌋ = 5，所以依次处理下标 5、4、3、2、1。</p>
<figure class="fig">
<svg viewBox="0 0 620 226" width="620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="左：输入数组按层放成完全二叉树，父结点为下标 1 到 5；右：自底向上建堆后的最大堆">
<text x="155" y="16" fill="#a1a1a0" font-size="13" text-anchor="middle">建堆前：H = 1 0 7 3 7 4 1 8 2 4</text>
<g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="155" y1="48" x2="85" y2="100"/><line x1="155" y1="48" x2="225" y2="100"/><line x1="85" y1="100" x2="45" y2="152"/><line x1="85" y1="100" x2="125" y2="152"/><line x1="225" y1="100" x2="190" y2="152"/><line x1="225" y1="100" x2="260" y2="152"/><line x1="45" y1="152" x2="22" y2="204"/><line x1="45" y1="152" x2="68" y2="204"/><line x1="125" y1="152" x2="110" y2="204"/></g>
<circle cx="155" cy="48" r="15" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="85" cy="100" r="15" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="225" cy="100" r="15" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="45" cy="152" r="15" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="125" cy="152" r="15" fill="#343433" stroke="#d97757" stroke-width="2"/><circle cx="190" cy="152" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="260" cy="152" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="22" cy="204" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="68" cy="204" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/><circle cx="110" cy="204" r="15" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle"><text x="155" y="53">1</text><text x="85" y="105">0</text><text x="225" y="105">7</text><text x="45" y="157">3</text><text x="125" y="157">7</text><text x="190" y="157">4</text><text x="260" y="157">1</text><text x="22" y="209">8</text><text x="68" y="209">2</text><text x="110" y="209">4</text></g>
<g fill="#a1a1a0" font-size="11"><text x="171" y="36">1</text><text x="101" y="88">2</text><text x="241" y="88">3</text><text x="61" y="140">4</text><text x="141" y="140">5</text><text x="206" y="140">6</text><text x="276" y="140">7</text><text x="38" y="192">8</text><text x="84" y="192">9</text><text x="126" y="192">10</text></g>
<text x="475" y="16" fill="#a1a1a0" font-size="13" text-anchor="middle">建堆后：H = 8 7 7 3 4 4 1 0 2 1</text>
<g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="475" y1="48" x2="405" y2="100"/><line x1="475" y1="48" x2="545" y2="100"/><line x1="405" y1="100" x2="365" y2="152"/><line x1="405" y1="100" x2="445" y2="152"/><line x1="545" y1="100" x2="510" y2="152"/><line x1="545" y1="100" x2="580" y2="152"/><line x1="365" y1="152" x2="342" y2="204"/><line x1="365" y1="152" x2="388" y2="204"/><line x1="445" y1="152" x2="430" y2="204"/></g>
<circle cx="475" cy="48" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="405" cy="100" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="545" cy="100" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="365" cy="152" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="445" cy="152" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="510" cy="152" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="580" cy="152" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="342" cy="204" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="388" cy="204" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/><circle cx="430" cy="204" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle"><text x="475" y="53">8</text><text x="405" y="105">7</text><text x="545" y="105">7</text><text x="365" y="157">3</text><text x="445" y="157">4</text><text x="510" y="157">4</text><text x="580" y="157">1</text><text x="342" y="209">0</text><text x="388" y="209">2</text><text x="430" y="209">1</text></g>
<g fill="#a1a1a0" font-size="11"><text x="491" y="36">1</text><text x="421" y="88">2</text><text x="561" y="88">3</text><text x="381" y="140">4</text><text x="461" y="140">5</text><text x="526" y="140">6</text><text x="596" y="140">7</text><text x="358" y="192">8</text><text x="404" y="192">9</text><text x="446" y="192">10</text></g>
</svg>
<figcaption>小字是数组下标。左边橙色描边的是父结点（下标 1–5），其余是叶子；右边是处理完全部父结点后的最大堆。</figcaption>
</figure>
<table>
<thead><tr><th>i</th><th>H[i]</th><th>孩子</th><th>sift down 的过程</th><th>处理后的 H[1..10]</th></tr></thead>
<tbody>
<tr><td>5</td><td>7</td><td>4</td><td>7 ≥ 4，不动</td><td>1 0 7 3 7 4 1 8 2 4</td></tr>
<tr><td>4</td><td>3</td><td>8, 2</td><td>和 8 交换；到下标 8（叶子）</td><td>1 0 7 8 7 4 1 3 2 4</td></tr>
<tr><td>3</td><td>7</td><td>4, 1</td><td>7 ≥ 4，不动</td><td>1 0 7 8 7 4 1 3 2 4</td></tr>
<tr><td>2</td><td>0</td><td>8, 7</td><td>和 8 交换；到下标 4，孩子 3, 2，和 3 交换；到下标 8（叶子）</td><td>1 8 7 3 7 4 1 0 2 4</td></tr>
<tr><td>1</td><td>1</td><td>8, 7</td><td>和 8 交换；到下标 2，孩子 3, 7，和 7 交换；到下标 5，孩子 4，和 4 交换；到下标 10（叶子）</td><td>8 7 7 3 4 4 1 0 2 1</td></tr>
</tbody>
</table>
<p>一共 6 次交换。注意 i = 2 和 i = 1：换一次还没完，<strong>sift down 要一直做到停下为止</strong>，根上的 1 一路沉到了下标 10。</p>
<p>同一个数组改用逐个插入，会得到 8 7 4 7 4 1 1 0 2 3，交换 8 次。<strong>两种方法建出的堆可能不同</strong>，两个都合法；题目指定了哪种方法，就要给出那种方法的结果。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-heap-construction/anims/build-heap.html" loading="lazy" style="height: 520px;" title="建堆：自底向上与逐个插入的逐步对比"></iframe>
<p class="anim-caption">选好输入和方法后按“下一步”或“播放”：橙色是正在移动的元素，黄色是要和它交换的结点，绿色部分已是堆。最后一帧对比两种方法的交换次数。</p>

<h2>代码</h2>
<p>考试可能要写 sift down 和建堆的循环。下面是从下标 1 开始的最大堆版本：</p>
<pre><code>void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void siftdown(int H[], int n, int i) {
    while (2 * i &lt;= n) {
        int c = 2 * i;
        if (c + 1 &lt;= n &amp;&amp; H[c + 1] &gt; H[c])
            c = c + 1;
        if (H[i] &gt;= H[c])
            break;
        swap(&amp;H[i], &amp;H[c]);
        i = c;
    }
}

void build_heap(int H[], int n) {
    for (int i = n / 2; i &gt;= 1; i--)
        siftdown(H, n, i);
}</code></pre>
<ul>
<li><code>while (2 * i &lt;= n)</code>：左孩子 2i 还在堆里，说明 H[i] 不是叶子，可能还要往下沉。</li>
<li><code>c = 2 * i</code>，接着如果右孩子存在并且更大，就把 c 改成右孩子。这两行之后 c 指向<strong>较大的孩子</strong>。</li>
<li><code>if (H[i] &gt;= H[c]) break;</code>：不小于较大的孩子，也就不小于两个孩子，已经到位。</li>
<li>否则交换，再让 <code>i = c</code>，跟着这个元素往下走一层，继续检查。</li>
<li><code>build_heap</code>：i 从 <code>n / 2</code>（C 的整数除法就是 ⌊n/2⌋）倒着走到 1，每个父结点调一次 <code>siftdown</code>。</li>
</ul>
<p>要建最小堆，把两处比较反过来就行：<code>H[c + 1] &lt; H[c]</code> 和 <code>H[i] &lt;= H[c]</code>。</p>
<div class="callout warn" data-label="易错">
<p>把循环写成 <code>for (int i = 1; i &lt;= n / 2; i++)</code>，从根往下处理，结果不一定是堆。[1, 2, 3, 4, 5, 6, 7] 这样做得到 3 5 7 4 2 6 1，根 3 比孩子 7 小：处理根时右子树还没整理，最大值 7 埋在下面，之后再也升不上来。</p>
</div>

<h2>为什么自底向上只要 Θ(n)</h2>
<p>粗算一下：约 n/2 个父结点，每个最多沉 log n 层，得 O(n log n)。这个界没错，但太松了。关键在于：<strong>要走得远的结点，数量少</strong>。</p>
<p>看 n = 15 的满二叉树，输入取升序 1, 2, …, 15，两种方法正好都碰上各自的最坏情况：</p>
<table>
<thead><tr><th>层（根为 0）</th><th>结点数</th><th>自底向上：每个最多下沉</th><th>逐个插入：每个最多上浮</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>3</td><td>0</td></tr>
<tr><td>1</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>2</td><td>4</td><td>1</td><td>2</td></tr>
<tr><td>3</td><td>8</td><td>0</td><td>3</td></tr>
<tr><td>合计</td><td>15</td><td>1×3 + 2×2 + 4×1 = 11</td><td>2×1 + 4×2 + 8×3 = 34</td></tr>
</tbody>
</table>
<p>差别全在最底层：占一半的叶子，自底向上一步不走，逐个插入却要走得最远。这正是开头架构图的情形。</p>
<p>结论：自底向上的交换次数<strong>小于 2n</strong>，是 O(n)；每个父结点至少比较一次，又是 Ω(n)。所以<strong>自底向上建堆是 Θ(n)，最好、最坏都一样</strong>。</p>
<p>逐个插入<strong>最坏是每个新元素都比已有的大</strong>（如升序输入），每个都一路换到根：光最底层就有约 n/2 个结点，每个上浮约 log₂ n 层，所以最坏 <strong>Θ(n log n)</strong>。最好是降序输入，每次只比较 1 次、不交换，<strong>Θ(n)</strong>。</p>
<table>
<thead><tr><th>建堆方法</th><th>做法</th><th>最好</th><th>最坏</th></tr></thead>
<tbody>
<tr><td>逐个插入</td><td>依次放到末尾，sift up</td><td>Θ(n)，如降序输入</td><td>Θ(n log n)，如升序输入</td></tr>
<tr><td>自底向上</td><td>i = ⌊n/2⌋ … 1，逐个 sift down</td><td>Θ(n)</td><td>Θ(n)</td></tr>
</tbody>
</table>

<h3>补充：2n 这个上界怎么来</h3>
<p>设最深一层是第 L = ⌊log₂ n⌋ 层。第 i 层最多 2<sup>i</sup> 个结点，每个最多下沉 L − i 层，交换总数最多是</p>
<p>S = ∑<sub>i=0</sub><sup>L</sup> 2<sup>i</sup>(L − i) = L·∑<sub>i=0</sub><sup>L</sup> 2<sup>i</sup> − ∑<sub>i=0</sub><sup>L</sup> i·2<sup>i</sup></p>
<ul>
<li>第一项是等比求和，公式表上有：∑<sub>i=0</sub><sup>L</sup> 2<sup>i</sup> = 2<sup>L+1</sup> − 1。</li>
<li>第二项 M = 1·2 + 2·2² + … + L·2<sup>L</sup> 公式表上没有，用错位相减：2M − M = L·2<sup>L+1</sup> − (2 + 2² + … + 2<sup>L</sup>)，得 M = (L − 1)·2<sup>L+1</sup> + 2。</li>
<li>合起来 S = <strong>2<sup>L+1</sup> − L − 2</strong>。L = 3 时是 11，和上表一致；因为 2<sup>L</sup> ≤ n，所以 S &lt; 2n。课上把 2<sup>L</sup> 记作 n、L 记作 log n，写成 S = 2(n − 1) − log n。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算建堆</strong>：用 bottom-up 建最大堆或最小堆，写出过程，最后给出数组和树（2015 年期末第 4 题 (a)）。每个父结点写一行。</li>
<li><strong>解释为什么 bottom-up 更好</strong>：Θ(n) 对 Θ(n log n)，差别出在底层约 n/2 个结点上。</li>
<li><strong>复杂度选择题</strong>：bottom-up 建堆的最紧上界（closest upper bound）是 O(n)；答 O(n log n) 不得分。</li>
<li><strong>下标</strong>：往年参考答案常从 0 开始：孩子是 2i+1、2i+2，最后一个父结点是 ⌊n/2⌋ − 1。答题时先写明用哪种。</li>
</ul>

<h3>例题 1：手算最小堆（2015 年期末）</h3>
<p>用 bottom-up 方法把 [100, 12, 79, 11, 13, 77, 11, 87, 25] 建成最小堆，写出过程和最终的数组与树，并说明为什么 bottom-up 比逐个插入好。</p>
<p>n = 9，最后一个父结点是 ⌊9/2⌋ = 4。最小堆反过来：和<strong>较小</strong>的孩子比，比它大就交换。若按 0 起始的下标写，每个下标都小 1，过程和结果完全一样。</p>
<pre><code class="lang-text">i = 4：11，孩子 87、25，11 最小，不动           100 12 79 11 13 77 11 87 25
i = 3：79，孩子 77、11，和 11 交换              100 12 11 11 13 77 79 87 25
i = 2：12，孩子 11、13，和 11 交换；
       到下标 4，孩子 87、25，不动              100 11 11 12 13 77 79 87 25
i = 1：100，孩子 11、11 相等，取左边，交换；
       到下标 2，孩子 12、13，和 12 交换；
       到下标 4，孩子 87、25，和 25 交换        11 12 11 25 13 77 79 87 100
             11
          /      \\
        12        11
       /  \\      /  \\
     25    13  77    79
    /  \\
  87   100</code></pre>
<p>共 5 次交换。根那一步如果取右边的 11，100 会换到下标 3，再和 77 交换，得到 11 11 77 12 13 100 79 87 25，同样是合法的最小堆。<strong>两个孩子相等时选哪个都行</strong>，2015 年的参考答案两种都列了。</p>
<p>为什么更好：bottom-up 最坏 Θ(n)；逐个插入最坏 Θ(n log n)，因为底层约 n/2 个元素每个都可能上浮约 log n 层。</p>

<h3>例题 2：多选</h3>
<p>哪些正确？(A) 对一个已经是最大堆的数组做自底向上建堆，仍需 Θ(n) 时间；(B) 逐个插入建堆，输入为降序时是 Θ(n)；(C) 自底向上建堆从 i = 1 往后处理到 ⌊n/2⌋ 也能得到堆；(D) “自底向上建堆是 O(n log n)”这句话成立；(E) 自底向上建堆不处理下标 ⌊n/2⌋+1 到 n 的元素；(F) 对同一输入，两种方法得到的数组一定相同。</p>
<p><strong>答案：A、B、D、E。</strong></p>
<ul>
<li>A 对：每个父结点至少比较一次，没有更快的情况。B 对：每次只比较 1 次、不交换。</li>
<li>C 错：[1, 2, 3, 4, 5, 6, 7] 从前往后处理得到 3 5 7 4 2 6 1，不是堆。</li>
<li>D 对：上界成立，只是不紧。E 对：它们是叶子，本身就是堆。</li>
<li>F 错：课上的例子两种方法结果不同（见上文）。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>处理顺序写反（从根往下），或者从叶子开始；每个父结点只换一层就停；自底向上里误用 sift up；题目要 bottom-up 却用了逐个插入——2015 年那题这样做只给部分分。</p>
</div>

<h2>小结</h2>
<ul>
<li>逐个插入：k = 2 … n，对 H[k] 做 sift up。最好 Θ(n)（降序），最坏 Θ(n log n)（升序）。</li>
<li>自底向上：叶子不管，i = ⌊n/2⌋ 倒着到 1，每个做 sift down，和较大的孩子换，一直沉到停下。</li>
<li>必须倒着来：处理 i 时两棵子树已经是堆，只差根一个。</li>
<li>自底向上最好、最坏都是 Θ(n)，交换数 &lt; 2n；原因是一半的结点是叶子，不用动。</li>
<li>两种方法结果可能不同，都合法；0 起始下标时最后一个父结点是 ⌊n/2⌋ − 1。</li>
</ul>
`;
