/* Post body — c-algo-tute-2 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['c-algo-tute-2:zh'] = `
<style>
  .reader-body .anim-frame {
    width: 100%;
    border: 1px solid #3a3a39;
    border-radius: 14px;
    background: #2a2a29;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    display: block;
    margin: 1.4em 0;
  }
  .reader-body .anim-caption {
    text-align: center;
    color: #a1a1a0;
    font-size: 13px;
    font-style: italic;
    margin-top: -0.6em !important;
    margin-bottom: 1.4em;
  }
</style>

<p class="lead">C 语言算法入门 2 · 这一篇我们做四件事：① 把 O(n²) 的排序升级到 O(n log n)（归并、快排），并搞清楚为什么"比较排序"再快也快不过 O(n log n)；② 第一次见到"抽象数据类型"（ADT）的概念——把"接口"和"实现"分开想；③ 走进数据结构的世界，从最基础的链表家族开始（单链表、双链表、栈、队列）；④ 树——二叉树、四种遍历、二叉搜索树、为什么需要"平衡"。最后还塞了一个超经典的字符串匹配算法 <strong>KMP</strong>。这一篇内容多、概念也多，但每一节都从"<strong>为什么需要它</strong>"开始讲，讲完一定有动画让你看明白。耐心跟下来，你就会发现：所谓"复杂的算法"，其实都是一两个朴素观察的组合。</p>

<h2>第五部分 高效排序——让排序快一个量级</h2>
<p>第一篇我们见过三种 O(n²) 的排序：冒泡、选择、插入。它们够用——直到 n 变大。<strong>n=10000 时 O(n²) 已经是一亿次操作，普通机器跑几秒；n=10⁶ 时是 10¹² 次，要好几个小时</strong>。所以工业界根本不会用它们处理大数据。</p>
<p>这一部分我们见两个真正"够快"的排序：<strong>归并排序</strong>（merge sort）和<strong>快速排序</strong>（quick sort）。它们都是 O(n log n)——不是慢一倍，是<strong>慢的等级</strong>都不一样：n=10⁶ 时 O(n log n) 大约 2×10⁷ 次操作，比 O(n²) 快 5 万倍。这一节末尾我们还会证明，<strong>只要算法是"基于比较"的，最快就只能到 O(n log n)</strong>——这是一个理论上限，不是工程没做好。</p>

<h3>5.1 归并排序（Merge Sort）</h3>

<h4>没有归并排序之前会怎样？</h4>
<p>第一篇我们学过<strong>分治</strong>：把问题切两半，各自递归解决，再合并答案。归并排序是分治<strong>最经典</strong>的应用：</p>
<ol>
  <li>把数组切两半</li>
  <li>分别对左半、右半排序（递归调用自己）</li>
  <li>把两个<strong>已经排好序</strong>的小数组合并成一个大的有序数组</li>
</ol>

<p>第 1 步、第 2 步只是"切分"，没有干活。<strong>所有的计算都在第 3 步——"合并"</strong>。理解归并排序，关键就是理解一个问题：</p>

<blockquote>已经有两个排好序的数组，怎么把它们合并成一个排好序的大数组？</blockquote>

<p>答案是<strong>双指针扫一遍</strong>：</p>
<pre><code>// 已知 left[] 升序、right[] 升序，合并到 out[]
int i = 0, j = 0, k = 0;
while (i &lt; len_left &amp;&amp; j &lt; len_right) {
    if (left[i] &lt;= right[j]) out[k++] = left[i++];
    else                      out[k++] = right[j++];
}
// 一边扫完了，把另一边剩下的全搬过去
while (i &lt; len_left)  out[k++] = left[i++];
while (j &lt; len_right) out[k++] = right[j++];</code></pre>

<p>这就 O(L + R) 一遍。<strong>谁前面小取谁，取走的指针往前走，另一根不动。</strong></p>

<h4>用动画看一遍</h4>
<p>下面这个动画把归并排序整个过程跑给你看。<strong>橙色</strong>是当前要合并的左半，<strong>蓝色</strong>是右半，<strong>黄色</strong>是这一步被挑出来的那一个；<strong>下方的临时缓冲区</strong>就是 <code>out[]</code>，每挑一次就追加一格；最后一波合并完成后，整个数组都变绿（已排序）：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/merge-sort.html" loading="lazy" style="height: 480px;" title="归并排序"></iframe>
<p class="anim-caption">↑ 点 ▶ 自动看完整过程；点"下一步"逐帧看每一次比较和挑选。注意"比较"和"写入"两个计数器——比较 ≈ n log n 次，写入 = n × log n 次。</p>

<h4>完整 C 代码</h4>
<pre><code>void merge(int a[], int lo, int mid, int hi) {
    int n = hi - lo + 1;
    int *tmp = malloc(n * sizeof(int));   // 临时缓冲区，长度 = 当前合并的范围
    int i = lo, j = mid + 1, k = 0;
    while (i &lt;= mid &amp;&amp; j &lt;= hi) {
        if (a[i] &lt;= a[j]) tmp[k++] = a[i++];
        else              tmp[k++] = a[j++];
    }
    while (i &lt;= mid) tmp[k++] = a[i++];
    while (j &lt;= hi)  tmp[k++] = a[j++];
    for (int t = 0; t &lt; n; t++) a[lo + t] = tmp[t];   // 写回原数组
    free(tmp);
}

void merge_sort(int a[], int lo, int hi) {
    if (lo &gt;= hi) return;                             // 只剩一个元素：天然有序
    int mid = lo + (hi - lo) / 2;
    merge_sort(a, lo, mid);                           // 左半递归排序
    merge_sort(a, mid + 1, hi);                       // 右半递归排序
    merge(a, lo, mid, hi);                            // 合并
}

// 调用：merge_sort(arr, 0, n - 1);</code></pre>

<h4>为什么是 O(n log n)？</h4>
<p>分两层来看：</p>
<ul>
  <li><strong>每"层"递归</strong>：把数组按范围分给当前层的所有节点，每个元素恰好被处理一次（合并的时候被取走一次）。所以一层总代价 <strong>O(n)</strong>。</li>
  <li><strong>层数</strong>：每次范围减半，从 n 减到 1，一共 <strong>log₂ n</strong> 层。</li>
  <li>合计：<strong>O(n) × O(log n) = O(n log n)</strong>。</li>
</ul>

<h4>评价</h4>
<table>
  <thead><tr><th>维度</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>最好 / 最坏 / 平均</td><td>都是 <strong>O(n log n)</strong>（无论输入怎么分布，递归层数和合并代价都不变）</td></tr>
    <tr><td>空间</td><td><strong>O(n)</strong>（临时缓冲区 tmp，<em>不</em>原地）</td></tr>
    <tr><td>稳定</td><td><strong>是</strong>（<code>a[i] &lt;= a[j]</code> 用 <code>&lt;=</code>，左侧相等优先）</td></tr>
    <tr><td>自适应</td><td>否（已有序输入也照样切到底再合并）</td></tr>
  </tbody>
</table>

<blockquote>注意 归并排序的<strong>缺点</strong>是 O(n) 额外空间。在内存紧张的场合（嵌入式、超大数据集）这是个真问题。优点是 O(n log n) 的<strong>最坏情况</strong>保证——快排的最坏是 O(n²)，归并永远不会被烂数据坑。所以在<strong>需要稳定性 + 最坏情况保障</strong>的场合（比如外部排序、链表排序），归并是首选。</blockquote>

<h3>5.2 快速排序（Quick Sort）</h3>

<h4>没有快排会怎样？</h4>
<p>归并排序虽然快，但它有<strong>两个让人不爽</strong>的地方：① 需要 O(n) 额外空间；② 数组操作时常数因子比较大（要把数据往临时数组里搬）。<strong>快速排序解决了这两点</strong>：原地（O(1) 额外空间，递归栈除外），常数因子小，平均比归并快 2-3 倍。代价是<strong>最坏情况会退化到 O(n²)</strong>——但只要 pivot 选得不太蠢，平均都是 O(n log n)。</p>

<h4>核心思想：partition</h4>
<p>快排的核心也是分治，但分的方式跟归并不一样：</p>
<ol>
  <li>选一个元素当 <strong>pivot</strong>（"轴心"）</li>
  <li>把数组重新排列成：<strong>左边都 ≤ pivot，右边都 &gt; pivot</strong>。这一步叫 <strong>partition</strong>。partition 完成后 pivot 就<strong>已经在它最终的位置上了</strong>——再也不会动。</li>
  <li>对 pivot 左边、pivot 右边分别递归调用 quicksort</li>
</ol>

<p>对比归并：</p>
<ul>
  <li>归并：<em>切分时不干活，合并时干活</em>。先递归到底，再一路 merge 上来。</li>
  <li>快排：<em>切分时干活，合并时不干活</em>。partition 一刀切下去，pivot 直接到位，左右两半各自处理就行，没有"合并"步骤。</li>
</ul>

<h4>Lomuto 分区方案（最简单的 partition 实现）</h4>
<p>Lomuto 方案选数组<strong>最右边</strong>那个元素当 pivot，然后用一个指针 <code>i</code> 维护"已知 ≤ pivot"的右边界，另一个指针 <code>j</code> 扫过整个数组：</p>

<pre><code>int partition(int a[], int lo, int hi) {
    int pivot = a[hi];          // 选最右元素作 pivot
    int i = lo - 1;             // 维护 a[lo..i] 都 ≤ pivot
    for (int j = lo; j &lt; hi; j++) {
        if (a[j] &lt;= pivot) {
            i++;                // 扩大"≤ pivot 区"的边界
            int t = a[i]; a[i] = a[j]; a[j] = t;   // 把 a[j] 换进去
        }
    }
    // 最后把 pivot 换到 i+1 这个分界位置
    int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
    return i + 1;               // 返回 pivot 的最终位置
}

void quick_sort(int a[], int lo, int hi) {
    if (lo &gt;= hi) return;
    int p = partition(a, lo, hi);
    quick_sort(a, lo, p - 1);   // pivot 左侧
    quick_sort(a, p + 1, hi);   // pivot 右侧（pivot 自己不参与）
}</code></pre>

<h4>用动画看 partition 怎么工作</h4>
<p>动画里：<strong>红色</strong>是 pivot；<strong>绿色</strong>是已经确认 ≤ pivot 的元素（i 指针经过的）；<strong>蓝色</strong>是已经确认 &gt; pivot 的元素（在 i 和 j 之间）；<strong>黄色</strong>是当前正在比较的 a[j]。每一轮 partition 完成后，红色 pivot 会"落"到它的最终位置（变绿色），然后递归处理左、右两半：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/quick-sort.html" loading="lazy" style="height: 460px;" title="快速排序"></iframe>
<p class="anim-caption">↑ 注意每次 partition 完，pivot 立刻变绿——它再也不动了。比较次数 vs 交换次数也比归并少很多。</p>

<h4>为什么平均是 O(n log n)？</h4>
<p>每一次 partition 是 <strong>O(n)</strong>（一个指针扫一遍）。如果每次都把数组分得很均匀（pivot 大约在中间），那递归层数是 <strong>log n</strong>，总代价 <strong>O(n log n)</strong>。</p>

<h4>最坏情况：O(n²)</h4>
<p>假设数组<strong>已经升序排好</strong>了，我们用 Lomuto 选最右元素当 pivot——pivot 永远是最大的！partition 之后："左侧"是除 pivot 外的所有元素，"右侧"为空。递归层数变成 n，每层代价 n，总 <strong>O(n²)</strong>。</p>
<p>怎么避免？工业实现都有办法：</p>
<ul>
  <li><strong>随机 pivot</strong>：在 [lo, hi] 里随机挑一个元素当 pivot。让对手"故意构造坏数据"变得很难。</li>
  <li><strong>三数取中</strong>：pivot = median(a[lo], a[mid], a[hi])。简单有效。</li>
  <li><strong>快排 + 堆排</strong>（introsort）：快排递归深度超过 log n × 2 时切换到堆排（保底 O(n log n)）。C++ <code>std::sort</code> 用的就是这个。</li>
</ul>

<h4>评价</h4>
<table>
  <thead><tr><th>维度</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>最好</td><td>O(n log n)（pivot 总切中位数）</td></tr>
    <tr><td>最坏</td><td><strong>O(n²)</strong>（已排序数据 + 固定 pivot 选法）</td></tr>
    <tr><td>平均</td><td>O(n log n)（pivot 选得不太离谱时）</td></tr>
    <tr><td>空间</td><td><strong>O(log n)</strong>（递归栈）— 可以原地不开新数组</td></tr>
    <tr><td>稳定</td><td><strong>否</strong>（partition 时长距离交换会破坏相等元素的相对顺序）</td></tr>
    <tr><td>自适应</td><td>不太自适应</td></tr>
  </tbody>
</table>

<h3>5.3 归并 vs 快排——同样 O(n log n)，到底用哪个？</h3>
<table>
  <thead><tr><th></th><th>归并 Merge Sort</th><th>快排 Quick Sort</th></tr></thead>
  <tbody>
    <tr><td>最坏时间</td><td>O(n log n) ⭐</td><td>O(n²)</td></tr>
    <tr><td>平均时间</td><td>O(n log n)</td><td>O(n log n)</td></tr>
    <tr><td>实测速度</td><td>较慢（常数因子大）</td><td><strong>更快 2-3 倍</strong> ⭐</td></tr>
    <tr><td>空间</td><td>O(n)</td><td>O(log n) ⭐</td></tr>
    <tr><td>稳定</td><td>是 ⭐</td><td>否</td></tr>
    <tr><td>对链表友好</td><td>是 ⭐（不需要随机访问）</td><td>否（需要随机访问）</td></tr>
    <tr><td>典型用途</td><td>外部排序 / 链表排序 / 需要稳定 / 需要最坏情况保证</td><td>内存数组排序的默认选择</td></tr>
  </tbody>
</table>

<h3>5.4 排序的理论下界：为什么"比较排序"快不过 O(n log n)？</h3>

<p>这一节是个数学证明，但思路很美。结论是：<strong>任何只能"两两比较"的排序算法，在最坏情况下至少需要 Ω(n log n) 次比较。</strong>所以归并、快排这种 O(n log n) 已经是<strong>理论最快</strong>，不可能再快了（除非用非比较的"特殊招"，比如计数排序、基数排序——这些算法对元素本身有要求）。</p>

<h4>决策树论证</h4>
<p>把任何比较排序算法看作一棵<strong>决策树</strong>：</p>
<ul>
  <li>每个内部节点是一次比较 <code>a[i] vs a[j]</code></li>
  <li>左分支 = 比较结果 ≤，右分支 = 比较结果 &gt;</li>
  <li>每个<strong>叶子节点</strong>对应一种最终的输出顺序（一个排列）</li>
</ul>

<p>n 个不同元素一共有 <strong>n!</strong> 种排列。每种输入都要走到一个叶子上。所以决策树至少要有 <strong>n! 个叶子</strong>。</p>
<p>一棵<strong>高度为 h</strong> 的二叉树最多有 2ʰ 个叶子。所以：</p>
<pre><code>2ʰ ≥ n!
h  ≥ log₂(n!) ≈ n log₂ n − n / ln 2  （Stirling 公式）
   ≈ n log n
</code></pre>

<p>而决策树的高度就是<strong>最坏情况下的比较次数</strong>。所以：<strong>最坏情况下至少需要 Ω(n log n) 次比较</strong>。归并和快排已经做到了，所以它们就是渐近最优的比较排序。</p>

<blockquote>提示 这个下界的前提是"基于比较"。<strong>非比较排序</strong>（计数排序、桶排序、基数排序）可以做到 O(n)——但它们要求对输入元素有额外的限制（比如是有限范围的整数）。这些算法第三篇 Part 12 会简单提一下。</blockquote>

<hr>

<h2>第六部分 抽象数据类型（ADT）——把"接口"和"实现"分开想</h2>

<p>到目前为止我们一直在跟数组打交道。现在要开始接触<strong>更花哨的数据结构</strong>了——链表、栈、队列、树、图、哈希表……每一种都有它擅长的事情。但在跳进具体的结构之前，先建立一个<strong>抽象的视角</strong>，否则你会很快迷失在 API 海里。</p>

<h3>6.1 ADT 是什么</h3>
<p><strong>ADT（Abstract Data Type，抽象数据类型）</strong>就一个核心思想：</p>
<blockquote>关心"<strong>能做什么</strong>"，先别管"<strong>怎么做的</strong>"。</blockquote>

<p>举个例子：你说"我需要一个东西，能 push 一个值进去，能 pop 出最新的那个"。这就是<strong>栈</strong>这个 ADT 的接口——它告诉了你"能做什么"。至于背后是用数组实现还是用链表实现，调用者并不关心，只要接口一样。</p>

<p>类比一下：<strong>电视的遥控器</strong>就是一个 ADT。你按"音量+"，音量就大；按"频道-"，频道就换。你不需要知道遥控器内部是红外发射还是蓝牙、电视里是什么芯片解码——这些是"实现细节"。换一台电视，遥控器接口不变，你的"操作经验"就能复用。</p>

<h3>6.2 为什么这个抽象很重要？</h3>
<ol>
  <li><strong>解耦</strong>：写程序时只关心你需要的"操作"，不被实现细节绑死。比如算法描述说"用一个栈维护括号"——它只用到栈的 push/pop，不关心栈是怎么造的。</li>
  <li><strong>可替换</strong>：同一个 ADT 可以有<strong>多种实现</strong>。每种实现对不同操作的速度不一样，按需求选。</li>
  <li><strong>能比较</strong>：评估"哪种实现更适合我的场景"时，把对每个操作的时间复杂度列出来一比就清楚了。</li>
</ol>

<h3>6.3 数组 vs 链表——同一个"序列" ADT，两种完全不同的实现</h3>

<p>"序列"（List）这个 ADT 提供这些操作：</p>
<ul>
  <li><strong>访问</strong> 第 k 个元素</li>
  <li><strong>插入</strong> 在第 k 个位置插入新元素</li>
  <li><strong>删除</strong> 第 k 个元素</li>
  <li><strong>遍历</strong> 从头到尾访问每个元素</li>
</ul>

<p>它的两个最经典实现是<strong>数组</strong>和<strong>链表</strong>。它们对同一组操作的速度完全不同：</p>

<table>
  <thead><tr><th>操作</th><th>数组（连续内存）</th><th>链表（节点 + 指针）</th></tr></thead>
  <tbody>
    <tr><td>按索引访问 a[k]</td><td><strong>O(1)</strong> ⭐</td><td>O(k)（从头数 k 个）</td></tr>
    <tr><td>头部插入</td><td>O(n)（所有元素后移一格）</td><td><strong>O(1)</strong> ⭐</td></tr>
    <tr><td>尾部插入</td><td>O(1)（已知尾位置）</td><td>O(1)（如果维护尾指针）</td></tr>
    <tr><td>中间插入</td><td>O(n)（后面全后移）</td><td>O(n) 找位置 + O(1) 改指针</td></tr>
    <tr><td>删除头部</td><td>O(n)</td><td><strong>O(1)</strong> ⭐</td></tr>
    <tr><td>遍历</td><td>O(n)（缓存友好，<em>实测最快</em>）</td><td>O(n)（每跳一个节点要解一次指针）</td></tr>
    <tr><td>额外内存</td><td>0</td><td>每个节点多 1-2 个指针</td></tr>
  </tbody>
</table>

<h4>用动画感受"在头部插入"的代价差异</h4>
<p>下面这个动画把"在数组头部插入"和"在链表头部插入"摆在一起跑——同样的操作，干的"活"完全不一样：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/array-vs-list.html" loading="lazy" style="height: 360px;" title="数组 vs 链表 在头部插入"></iframe>
<p class="anim-caption">↑ 数组：每个旧元素都得挪一格，n 个元素就 n 次写入；链表：只动一根指针。</p>

<h3>6.4 怎么选？</h3>
<table>
  <thead><tr><th>需求</th><th>选哪个</th><th>原因</th></tr></thead>
  <tbody>
    <tr><td>知道索引就快速取值</td><td>数组</td><td>O(1) 随机访问，链表做不到</td></tr>
    <tr><td>频繁在中间 / 头部插入删除</td><td>链表</td><td>不用挪一大片元素</td></tr>
    <tr><td>遍历多、改动少</td><td>数组</td><td>缓存友好，常数小很多</td></tr>
    <tr><td>大小频繁变化、上限不定</td><td>链表（或动态数组）</td><td>链表可任意伸缩；C 的 <code>realloc</code> 也能扩数组但偶尔大开销</td></tr>
    <tr><td>实现栈 / 队列</td><td>都行</td><td>看哪种操作更频繁</td></tr>
  </tbody>
</table>

<blockquote>提示 真实世界里"数组" vs "链表"还有一个隐性差距：<strong>缓存友好性</strong>。数组在内存里连续摆放，CPU 一次读一片，遍历时几乎不用等内存。链表节点散在堆的各个角落，每跳一次都可能要等内存。所以<strong>链表的常数因子比数组大很多</strong>，理论 O(n) 的遍历，实测可能比数组慢 5-10 倍。</blockquote>

<hr>

<h2>第七部分 链表家族——四种最基础的"动态结构"</h2>
<p>"链表家族"这一篇我们一口气见四种结构：单链表、双链表、栈、队列。它们的实现都不复杂，但<strong>用起来非常顺手</strong>——后面学树、图、广度搜索、深度搜索时这些都是基础。</p>

<h3>7.1 单链表（Singly Linked List）</h3>

<h4>结构</h4>
<p>单链表的节点长这样：</p>
<pre><code>typedef struct Node {
    int value;
    struct Node *next;   // 指向下一个节点；最后一个节点的 next = NULL
} Node;</code></pre>

<p>整个链表对外只暴露一个<strong>头指针</strong> <code>head</code>，从头开始顺着 <code>next</code> 跳就能走完整条链。</p>

<h4>三个核心操作</h4>

<p><strong>① 遍历（Traverse）—— O(n)</strong></p>
<pre><code>void traverse(Node *head) {
    for (Node *cur = head; cur != NULL; cur = cur-&gt;next) {
        printf("%d ", cur-&gt;value);
    }
}</code></pre>
<p>没什么好说的——从 head 开始一直跟着 next 走，到 NULL 停。</p>

<p><strong>② 在头部插入（Insert at head）—— O(1)</strong></p>
<pre><code>Node *insert_head(Node *head, int v) {
    Node *n = malloc(sizeof(Node));
    n-&gt;value = v;
    n-&gt;next  = head;     // 新节点的 next = 原 head
    return n;            // 新 head 是新节点
}

// 用法：
// head = insert_head(head, 42);</code></pre>

<p>三步：① 创建新节点；② 新节点的 next 指向原来的 head；③ 把"链表的 head"改成新节点。注意这里函数返回新 head——因为 head 自己变了，得告诉调用者。</p>

<p><strong>③ 删除某个值的节点（Delete a node by value）—— O(n)</strong></p>
<pre><code>Node *delete_value(Node *head, int v) {
    // 特殊情况：要删的就是 head
    if (head != NULL &amp;&amp; head-&gt;value == v) {
        Node *next = head-&gt;next;
        free(head);
        return next;
    }
    // 一般情况：找到 cur，使 cur-&gt;next-&gt;value == v
    Node *cur = head;
    while (cur != NULL &amp;&amp; cur-&gt;next != NULL &amp;&amp; cur-&gt;next-&gt;value != v) {
        cur = cur-&gt;next;
    }
    if (cur != NULL &amp;&amp; cur-&gt;next != NULL) {
        Node *del = cur-&gt;next;
        cur-&gt;next = del-&gt;next;     // 让 cur 的 next 越过 del
        free(del);
    }
    return head;
}</code></pre>

<p>关键就一句：<strong>让前一个节点的 next 越过被删的节点，直接指向后一个</strong>。</p>

<h4>用动画看指针怎么"重接"</h4>
<p>看下面这个动画。核心是<strong>插入新节点时</strong>新节点 next 怎么连到旧 head，<strong>删除节点时</strong>前一个节点 next 怎么"跨过"它直接连下一个。<strong>整条链表的物理顺序根本没动，动的是指针</strong>：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/linked-list.html" loading="lazy" style="height: 320px;" title="链表插入和删除"></iframe>
<p class="anim-caption">↑ 顶部 head 指针、绿色 next 箭头都会随操作动。可以切到双链表看双向指针的样子。</p>

<h3>7.2 双链表（Doubly Linked List）</h3>

<p>单链表只能往后走，要往前走得从头再扫一遍。<strong>双链表</strong>给每个节点加一个 <code>prev</code> 指针，指向前驱：</p>

<pre><code>typedef struct DNode {
    int value;
    struct DNode *prev;
    struct DNode *next;
} DNode;</code></pre>

<p>双链表的优点：</p>
<ul>
  <li>能往前走：<code>cur = cur-&gt;prev</code></li>
  <li>给定一个节点指针就能 O(1) 删除（不用从头找前驱）</li>
  <li>插入到某节点之前 / 之后都是 O(1)</li>
</ul>
<p>缺点：每个节点多 8 字节（一个 prev 指针）；每次插入 / 删除要维护两个方向的指针，写起来更繁琐、更容易出 bug。</p>

<p>双链表的删除（已知要删的节点指针 <code>n</code>）：</p>
<pre><code>void delete_node(DNode *n) {
    if (n-&gt;prev) n-&gt;prev-&gt;next = n-&gt;next;
    if (n-&gt;next) n-&gt;next-&gt;prev = n-&gt;prev;
    free(n);
}</code></pre>
<p>对照单链表的 delete_value——单链表必须先扫到前驱才能删，<strong>双链表直接 O(1) 拆掉</strong>。</p>

<h3>7.3 栈（Stack）—— LIFO，后进先出</h3>

<h4>没有栈会怎样？</h4>
<p>很多算法天然<strong>"后进先出"</strong>地处理数据：递归调用时当前函数压入调用栈、最后调用的最先返回；表达式求值时数字进栈算到结果再出来；浏览器的"前进 / 后退"按钮、文本编辑器的撤销 / 重做……都是栈。如果你<em>没有栈这个抽象</em>，每次都得手写一段"在数组末尾加 / 删元素"的代码，啰嗦还容易写错。</p>

<h4>接口</h4>
<table>
  <thead><tr><th>操作</th><th>含义</th><th>复杂度</th></tr></thead>
  <tbody>
    <tr><td><code>push(v)</code></td><td>把 v 放到栈顶</td><td>O(1)</td></tr>
    <tr><td><code>pop()</code></td><td>取出并返回栈顶元素</td><td>O(1)</td></tr>
    <tr><td><code>top()</code> 或 <code>peek()</code></td><td>看一眼栈顶但不取出来</td><td>O(1)</td></tr>
    <tr><td><code>is_empty()</code></td><td>栈是否空</td><td>O(1)</td></tr>
  </tbody>
</table>

<h4>实现 1：用数组</h4>
<pre><code>#define MAX 1024
typedef struct {
    int data[MAX];
    int top;     // 栈顶索引；空时 top = -1
} Stack;

void init(Stack *s)       { s-&gt;top = -1; }
int  is_empty(Stack *s)   { return s-&gt;top == -1; }
void push(Stack *s, int v){ s-&gt;data[++s-&gt;top] = v; }
int  pop(Stack *s)        { return s-&gt;data[s-&gt;top--]; }
int  peek(Stack *s)       { return s-&gt;data[s-&gt;top]; }</code></pre>
<p>简洁、快、缓存友好。<strong>缺点</strong>：固定大小，超出 MAX 会越界。要无上限就得用动态数组（realloc）或链表。</p>

<h4>实现 2：用链表</h4>
<pre><code>// push 头部，pop 头部 — 都是 O(1)
typedef struct Node { int value; struct Node *next; } Node;
typedef struct { Node *head; } LStack;

void push(LStack *s, int v) {
    Node *n = malloc(sizeof(Node));
    n-&gt;value = v;
    n-&gt;next = s-&gt;head;
    s-&gt;head = n;
}
int pop(LStack *s) {
    Node *n = s-&gt;head;
    int v = n-&gt;value;
    s-&gt;head = n-&gt;next;
    free(n);
    return v;
}</code></pre>
<p>无大小限制；代价是每次 malloc/free 比数组慢一些。</p>

<h3>7.4 队列（Queue）—— FIFO，先进先出</h3>

<p>队列就是字面意义的<strong>排队</strong>：先来的先服务。一头入，另一头出。</p>

<h4>接口</h4>
<table>
  <thead><tr><th>操作</th><th>含义</th><th>复杂度</th></tr></thead>
  <tbody>
    <tr><td><code>enqueue(v)</code></td><td>v 加入队尾</td><td>O(1)</td></tr>
    <tr><td><code>dequeue()</code></td><td>从队首取出</td><td>O(1)</td></tr>
    <tr><td><code>front()</code></td><td>看队首但不取</td><td>O(1)</td></tr>
    <tr><td><code>is_empty()</code></td><td></td><td>O(1)</td></tr>
  </tbody>
</table>

<h4>用动画一眼看出栈和队列的区别</h4>
<p>下面这个动画往两个结构里压<strong>同样的数据</strong>（1, 2, 3, 4），然后 pop 几次。看清楚<strong>谁先吐出来</strong>就理解 LIFO 和 FIFO 的区别了：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/stack-queue.html" loading="lazy" style="height: 380px;" title="栈 vs 队列"></iframe>
<p class="anim-caption">↑ 栈：从右边进、从右边出（LIFO）；队列：从右边进、从左边出（FIFO）。</p>

<h4>用循环数组实现队列</h4>
<p>队列用普通数组实现有个尴尬的问题：dequeue 总是从队头出，每次都要把后面的元素往前挪一格——O(n)。解决方案是<strong>循环数组</strong>（ring buffer）：用两个索引 <code>front</code>、<code>rear</code>，到数组末尾就<strong>绕回 0</strong>：</p>

<pre><code>#define CAP 1024
typedef struct {
    int data[CAP];
    int front;   // 队首索引
    int rear;    // 队尾的下一格（哨兵位）
    int size;
} Queue;

void enqueue(Queue *q, int v) {
    q-&gt;data[q-&gt;rear] = v;
    q-&gt;rear = (q-&gt;rear + 1) % CAP;     // 关键：取模实现"环"
    q-&gt;size++;
}
int dequeue(Queue *q) {
    int v = q-&gt;data[q-&gt;front];
    q-&gt;front = (q-&gt;front + 1) % CAP;
    q-&gt;size--;
    return v;
}</code></pre>

<p>enqueue 和 dequeue 都是 O(1)。链表实现队列要双端访问——单链表想 O(1) enqueue 必须维护一个尾指针 <code>tail</code>。</p>

<h3>7.5 链表家族总结</h3>
<table>
  <thead><tr><th>结构</th><th>核心特性</th><th>典型用途</th></tr></thead>
  <tbody>
    <tr><td>单链表</td><td>head + next，单向</td><td>动态序列、栈的实现</td></tr>
    <tr><td>双链表</td><td>多了 prev，双向 + O(1) 删除</td><td>LRU 缓存、文本行存储、需要往前走</td></tr>
    <tr><td>栈</td><td>LIFO</td><td>函数调用、撤销 / 重做、表达式求值、DFS</td></tr>
    <tr><td>队列</td><td>FIFO</td><td>BFS、任务排队、生产者消费者</td></tr>
  </tbody>
</table>

<hr>

<h2>第八部分 树——计算机里最常见的"分叉"结构</h2>

<p>到目前为止我们的数据都是<strong>线性的</strong>——数组、链表、栈、队列，都是一条线。<strong>树</strong>是第一个非线性结构：从一个根（root）开始，向下分叉。文件系统、HTML DOM、组织架构、语法树、决策过程……自然界和计算机里到处都是树。</p>

<h3>8.1 二叉树的基本概念</h3>

<p><strong>二叉树（Binary Tree）</strong>：每个节点最多有两个子节点的树，分别叫"左子"和"右子"。是最简单也最常用的树。</p>

<pre><code>typedef struct TreeNode {
    int value;
    struct TreeNode *left;   // 左子，可能为 NULL
    struct TreeNode *right;  // 右子，可能为 NULL
} TreeNode;</code></pre>

<p>关键术语，记住这几个就够：</p>
<table>
  <thead><tr><th>术语</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td>root（根）</td><td>最顶上那个节点，没有父亲</td></tr>
    <tr><td>parent（父）/ child（子）</td><td>箭头连接的两个节点。一个 parent 可以有多个 child。</td></tr>
    <tr><td>leaf（叶子）</td><td>没有子节点的节点（最底层）</td></tr>
    <tr><td>internal node（内部节点）</td><td>非叶子节点</td></tr>
    <tr><td>depth（深度）</td><td>从 root 走到这个节点的<strong>边数</strong>。root 的 depth = 0。</td></tr>
    <tr><td>height（高度）</td><td>从这个节点走到最远的叶子要多少边。叶子的 height = 0。</td></tr>
    <tr><td>tree height</td><td>整棵树的高度 = 根的高度。</td></tr>
    <tr><td>subtree（子树）</td><td>任意一个节点和它向下所有节点构成的树</td></tr>
  </tbody>
</table>

<h4>满二叉树和完全二叉树</h4>
<ul>
  <li><strong>满二叉树</strong>：每一层都"满"——每个非叶子节点都有两个子。</li>
  <li><strong>完全二叉树</strong>：除了最后一层，前面每层都满；最后一层从左到右<strong>连续</strong>填充。这种树非常重要——它可以<strong>用数组表示</strong>，第三篇 Part 9 学堆时会用到。</li>
</ul>

<h3>8.2 树的遍历——四种顺序</h3>

<p>我们经常需要"访问"一棵树的每个节点。但跟数组不一样，树有<strong>多个方向</strong>可以走，于是就有了四种"遍历"顺序：</p>

<ul>
  <li><strong>前序（Pre-order）</strong>：先访问当前节点，再左子树，再右子树。<em>"打印我自己 → 打印左边 → 打印右边"</em></li>
  <li><strong>中序（In-order）</strong>：先左子树，再当前节点，再右子树。<em>"先左 → 自己 → 右"</em></li>
  <li><strong>后序（Post-order）</strong>：先左子树，再右子树，最后当前节点。<em>"先左 → 右 → 自己"</em></li>
  <li><strong>层序（Level-order）</strong>：从上到下、每层从左到右。<em>"按楼层排队"</em>（也叫 BFS 广度优先）</li>
</ul>

<h4>用动画看四种顺序</h4>
<p>下面这棵树是一个"满"的 BST（每个父都比左子大、比右子小）。<strong>切换 4 个标签看不同顺序下的访问轨迹</strong>：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/tree-traversal.html" loading="lazy" style="height: 380px;" title="树的四种遍历"></iframe>
<p class="anim-caption">↑ 同一棵树，四种顺序结果完全不同。注意中序结果是 1,2,3,4,5,6,7 — 这是 BST 的性质：中序遍历 = 升序排列。</p>

<h4>三种"深度优先"遍历的代码（前 / 中 / 后序）</h4>

<pre><code>void preorder(TreeNode *n) {
    if (n == NULL) return;
    visit(n);              // ① 自己
    preorder(n-&gt;left);     // ② 左
    preorder(n-&gt;right);    // ③ 右
}

void inorder(TreeNode *n) {
    if (n == NULL) return;
    inorder(n-&gt;left);      // ① 左
    visit(n);              // ② 自己
    inorder(n-&gt;right);     // ③ 右
}

void postorder(TreeNode *n) {
    if (n == NULL) return;
    postorder(n-&gt;left);    // ① 左
    postorder(n-&gt;right);   // ② 右
    visit(n);              // ③ 自己
}</code></pre>

<p>三段代码的<strong>区别就在 visit 写在哪一行</strong>。整体结构都是"递归左、递归右"——这是<strong>分治</strong>的又一次应用。</p>

<h4>层序（BFS）：用队列实现</h4>
<pre><code>void level_order(TreeNode *root) {
    if (!root) return;
    Queue q;
    init(&amp;q);
    enqueue(&amp;q, root);
    while (!is_empty(&amp;q)) {
        TreeNode *n = (TreeNode *)dequeue(&amp;q);
        visit(n);
        if (n-&gt;left)  enqueue(&amp;q, n-&gt;left);
        if (n-&gt;right) enqueue(&amp;q, n-&gt;right);
    }
}</code></pre>

<p>层序就是<strong>广度优先搜索（BFS）</strong>。栈用于深度优先（DFS），队列用于广度优先——这是栈和队列在树 / 图算法里最重要的应用。</p>

<h4>每种遍历的典型用途</h4>
<table>
  <thead><tr><th>遍历</th><th>用途</th></tr></thead>
  <tbody>
    <tr><td>前序</td><td>序列化树（保存到文件，后面用前序读出来重建）；表达式树的"前缀表达式"</td></tr>
    <tr><td>中序</td><td><strong>BST 输出有序结果</strong> ⭐；中缀表达式</td></tr>
    <tr><td>后序</td><td>从下到上汇总——比如算每个节点的子树大小、删除整棵树（先 free 子，再 free 自己）</td></tr>
    <tr><td>层序 / BFS</td><td>找最近 / 最短路径；按层处理；打印分层结构</td></tr>
  </tbody>
</table>

<h3>8.3 二叉搜索树（BST）</h3>

<h4>没有 BST 会怎样？</h4>
<p>第一篇我们学过<strong>二分搜索</strong>——前提是数据放在<strong>有序数组</strong>里。但有序数组的问题是：<strong>插入新值</strong>要把后面的元素全挪一格，O(n)。删除也一样。</p>
<p>BST 解决这个问题：<strong>不是物理上有序的数组，而是结构上有序的树</strong>。查找、插入、删除都是 O(log n)（前提是树平衡）。</p>

<h4>BST 的定义</h4>
<blockquote>对每个节点 N：<strong>N 左子树里的所有值 &lt; N 的值 &lt; N 右子树里的所有值</strong>。</blockquote>

<p>这个性质有一个直接的推论：<strong>中序遍历一棵 BST，结果一定是升序排列。</strong></p>

<h4>BST 的三个核心操作</h4>

<p><strong>① 查找：从 root 开始，比较，往左或右走</strong></p>
<pre><code>TreeNode *bst_search(TreeNode *root, int key) {
    TreeNode *cur = root;
    while (cur != NULL) {
        if      (key == cur-&gt;value) return cur;     // 找到
        else if (key &lt;  cur-&gt;value) cur = cur-&gt;left;
        else                        cur = cur-&gt;right;
    }
    return NULL;     // 没找到
}</code></pre>

<p>每一步淘汰半棵树。复杂度 = 树的高度 = O(log n)（树平衡时）。</p>

<p><strong>② 插入：找到合适的 NULL 位置，挂上去</strong></p>
<pre><code>TreeNode *bst_insert(TreeNode *root, int v) {
    if (root == NULL) {
        TreeNode *n = malloc(sizeof(TreeNode));
        n-&gt;value = v; n-&gt;left = n-&gt;right = NULL;
        return n;
    }
    if (v &lt; root-&gt;value) root-&gt;left  = bst_insert(root-&gt;left,  v);
    else if (v &gt; root-&gt;value) root-&gt;right = bst_insert(root-&gt;right, v);
    // v == root-&gt;value：BST 通常不允许重复，这里直接忽略
    return root;
}</code></pre>

<p>就是查找的过程，只是走到 NULL 时不返回 NULL，而是创建一个新节点挂在那里。</p>

<p><strong>③ 删除：分三种情况</strong></p>
<pre><code>TreeNode *find_min(TreeNode *n) {
    while (n-&gt;left) n = n-&gt;left;
    return n;
}

TreeNode *bst_delete(TreeNode *root, int v) {
    if (!root) return NULL;
    if (v &lt; root-&gt;value) {
        root-&gt;left  = bst_delete(root-&gt;left,  v);
    } else if (v &gt; root-&gt;value) {
        root-&gt;right = bst_delete(root-&gt;right, v);
    } else {
        // 找到了 — 三种情况
        if (!root-&gt;left)  { TreeNode *r = root-&gt;right; free(root); return r; }
        if (!root-&gt;right) { TreeNode *l = root-&gt;left;  free(root); return l; }
        // 既有左子又有右子：找右子树的最小值替代自己，再去删那个最小值
        TreeNode *succ = find_min(root-&gt;right);
        root-&gt;value = succ-&gt;value;
        root-&gt;right = bst_delete(root-&gt;right, succ-&gt;value);
    }
    return root;
}</code></pre>

<h4>用动画看 BST 的查找路径</h4>
<p>下面这棵 BST 你可以输入要找的值，看它是怎么在树里"二分"地往下走的。也可以切到"插入"模式，看新节点怎么落到合适的 NULL 位置：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/bst.html" loading="lazy" style="height: 360px;" title="BST 查找和插入"></iframe>
<p class="anim-caption">↑ 试一些值看看。比如查 60（找得到）、查 35（不存在，但插入可以放进 30 和 40 之间）。</p>

<h3>8.4 平衡 —— BST 的死穴和救命稻草</h3>

<h4>BST 也会退化成 O(n)</h4>
<p>BST 的复杂度<strong>"O(log n)"是有条件的</strong>——前提是树要"平衡"（左右两边高度差不大）。看这个反例：</p>

<pre><code>// 按升序插入：1, 2, 3, 4, 5
// 第一棵树：
1
 \
  2
   \
    3
     \
      4
       \
        5</code></pre>

<p>这棵树虽然满足 BST 性质（每个节点的右子都更大），但<strong>它退化成了一条单链表</strong>。查找 5 要从 1 一路走到 5——5 步，O(n) 而不是 O(log n)。<strong>升序输入会让朴素 BST 烂掉</strong>。</p>

<h4>"平衡"是什么意思</h4>
<p>"平衡"的精确定义有很多版本，最简单的一种叫 <strong>AVL 平衡</strong>：</p>
<blockquote>对树里的<strong>每一个节点</strong>，它的左子树高度和右子树高度的差不超过 1。</blockquote>

<p>满足这个条件的树叫 <strong>AVL 树</strong>。AVL 树的高度被严格控制在 O(log n)，所以查找 / 插入 / 删除都是 O(log n)。</p>

<h4>怎么保持平衡？—— 旋转</h4>
<p>插入或删除节点后，如果某个节点的左右子树高度差变成了 2（违反平衡），就要做<strong>旋转</strong>（rotation）来修复。最基础的旋转有两种——<strong>左旋</strong>和<strong>右旋</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/avl-rotate.html" loading="lazy" style="height: 380px;" title="AVL 旋转"></iframe>
<p class="anim-caption">↑ 切换 LL 和 RR 看不同方向的旋转。失衡节点变红、转轴节点变黄；旋转后整棵树都变绿（重新平衡）。</p>

<h4>右旋（修复 LL 失衡）</h4>
<p>"LL 失衡"指的是<strong>插入到左子的左边</strong>导致左子树太高。处理方式是<strong>右旋</strong>：</p>

<pre><code>TreeNode *rotate_right(TreeNode *z) {
    TreeNode *y = z-&gt;left;
    TreeNode *T2 = y-&gt;right;
    // 旋转
    y-&gt;right = z;
    z-&gt;left  = T2;
    // 返回新的子树根
    return y;
}</code></pre>

<p>z 原本是子树的根，往左过深；旋转后 y 是新根，z 变成 y 的右子。整棵子树高度降 1，平衡了。</p>

<h4>四种失衡情况</h4>
<table>
  <thead><tr><th>失衡类型</th><th>含义</th><th>处理</th></tr></thead>
  <tbody>
    <tr><td>LL</td><td>插入到左子的左边（左左）</td><td>对失衡节点右旋一次</td></tr>
    <tr><td>RR</td><td>插入到右子的右边</td><td>对失衡节点左旋一次</td></tr>
    <tr><td>LR</td><td>插入到左子的右边</td><td>先对左子左旋（化为 LL），再对失衡节点右旋</td></tr>
    <tr><td>RL</td><td>插入到右子的左边</td><td>先对右子右旋（化为 RR），再对失衡节点左旋</td></tr>
  </tbody>
</table>

<blockquote>提示 实际开发中要不要自己写 AVL？<strong>很少</strong>。原因：① 标准库（C++ <code>std::map</code>、Java <code>TreeMap</code>）已经提供平衡 BST（实际是更复杂的<strong>红黑树</strong>，平衡条件更松、维护成本更低，但接口和复杂度跟 AVL 一样都是 O(log n)）。② 哈希表（第三篇 Part 10）平均更快。AVL / 红黑树是<strong>面试和理解平衡概念</strong>的经典内容，工程中你只需要会用。</blockquote>

<hr>

<h2>第九部分 字符串模式匹配——朴素 vs KMP</h2>

<p>"在长字符串里找一个短模式串"——比如 Ctrl+F 查找、grep、防火墙的关键字过滤、生物信息里的 DNA 序列匹配——是最常见的字符串问题。这一节先讲<strong>朴素</strong>（最直觉但最慢的方法），再讲<strong>KMP</strong>（一个让无数人第一次理解失败函数的精妙算法）。</p>

<h3>9.1 朴素模式匹配（Naive / Brute Force）</h3>

<p>问题：在主串 <code>text</code>（长度 n）里找模式串 <code>pattern</code>（长度 m）第一次出现的位置。</p>

<h4>最直觉的做法</h4>
<pre><code>int naive_search(const char *text, const char *pattern) {
    int n = strlen(text), m = strlen(pattern);
    for (int i = 0; i &lt;= n - m; i++) {     // 每个可能的起始位置
        int j = 0;
        while (j &lt; m &amp;&amp; text[i + j] == pattern[j]) j++;
        if (j == m) return i;              // 全部匹配 → 找到
    }
    return -1;                             // 没找到
}</code></pre>

<p>外层 i 从 0 滑到 n-m，内层 j 比较模式串和当前位置。任何一个位置不匹配就放弃，从 i+1 重新开始。</p>

<h4>复杂度</h4>
<table>
  <thead><tr><th>情况</th><th>复杂度</th></tr></thead>
  <tbody>
    <tr><td>最好</td><td>O(n)（第一次比较就失败 / 第一个位置就匹配）</td></tr>
    <tr><td>最坏</td><td><strong>O(n × m)</strong>（如 text = "AAAAAB"、pattern = "AAAB"——每次都比较到 m-1 才发现不匹配）</td></tr>
    <tr><td>平均</td><td>对随机数据接近 O(n)，但坏数据下接近 O(nm)</td></tr>
  </tbody>
</table>

<h3>9.2 朴素的痛点：i 总是要回退</h3>

<p>看朴素的执行过程：</p>
<pre><code>text:    A B A B A B C
pattern: A B A B C

i=0: 比较 4 步，第 5 个字符 C vs A 不匹配。
     朴素的做法：i 跳到 1，j 重置为 0，<strong>把已经匹配过的 ABAB 全部丢掉重新比</strong>。
i=1: text[1]=B vs pattern[0]=A 不匹配，i 跳到 2。
i=2: 比较 3 步，第 4 个字符 A vs B 不匹配。i 跳到 3。
... 等等。
</code></pre>

<p>问题在哪？<strong>每次失败，朴素都把已经成功匹配的部分扔掉，从下一个起点 0 开始重比</strong>。但仔细想：当我们已经匹配了 "ABAB" 的前 4 个字符再失败时，我们其实已经知道了 text 的 [i, i+3] = "ABAB"。这个信息没用上！</p>

<h3>9.3 KMP 的核心想法</h3>

<blockquote>失败时，<strong>i 永远不回退</strong>，只让 j（pattern 上的指针）跳到合适的位置继续比。</blockquote>

<p>"合适的位置"是哪？这就是 KMP 的精华——<strong>失败函数 next[]</strong>。</p>

<h4>失败函数 next[]</h4>
<p>对于模式串 P，<code>next[i]</code> 定义为：<strong>P[0..i] 这段子串中，最长的 "既是真前缀又是真后缀" 的长度</strong>。</p>

<p>"真前缀"：不包括整个串本身的前缀。"真后缀"：不包括整个串本身的后缀。</p>

<p>例子：<code>P = "ABABABC"</code></p>
<table>
  <thead><tr><th>i</th><th>P[0..i]</th><th>真前缀</th><th>真后缀</th><th>最长公共</th><th>next[i]</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>A</td><td>—</td><td>—</td><td>—</td><td>0</td></tr>
    <tr><td>1</td><td>AB</td><td>A</td><td>B</td><td>—</td><td>0</td></tr>
    <tr><td>2</td><td>ABA</td><td>A, AB</td><td>A, BA</td><td><strong>A</strong></td><td>1</td></tr>
    <tr><td>3</td><td>ABAB</td><td>A, AB, ABA</td><td>B, AB, BAB</td><td><strong>AB</strong></td><td>2</td></tr>
    <tr><td>4</td><td>ABABA</td><td>...</td><td>...</td><td><strong>ABA</strong></td><td>3</td></tr>
    <tr><td>5</td><td>ABABAB</td><td>...</td><td>...</td><td><strong>ABAB</strong></td><td>4</td></tr>
    <tr><td>6</td><td>ABABABC</td><td>...</td><td>...</td><td>—</td><td>0</td></tr>
  </tbody>
</table>

<h4>next[] 怎么用？</h4>
<p>假设我们正在比较 text[i] 和 pattern[j]，发现<strong>不相等</strong>。这时我们知道：text[i-j..i-1] = pattern[0..j-1]（前面 j 个字符已经成功匹配过）。</p>
<p>由于 pattern[0..j-1] 自己有一个 "前缀也是后缀" 的性质 next[j-1]，那意思是：<strong>pattern[0..next[j-1]-1] = pattern[j-next[j-1]..j-1]</strong>。后者就是 text 上已经匹配的最后 next[j-1] 个字符——它们也等于 pattern 的前 next[j-1] 个字符！</p>
<p>所以我们可以直接<strong>把 j 跳到 next[j-1]</strong>，i 不动，从这里继续比。</p>

<h4>用动画看 KMP 的"指针不回退"</h4>
<p>切换"朴素"和"KMP"两种模式，在<strong>同一个 text 和 pattern</strong> 上跑。注意比较次数计数器——KMP 通常少一倍以上：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/string-match.html" loading="lazy" style="height: 360px;" title="朴素 vs KMP"></iframe>
<p class="anim-caption">↑ KMP 的下方有 next[] 表。每次失败，会高亮使用的那一格，然后模式串"跳过"已知匹配的前缀，i 继续往前。</p>

<h4>完整 KMP 代码</h4>
<pre><code>// 构造失败函数 next[]
void compute_next(const char *p, int m, int *next) {
    next[0] = 0;
    int k = 0;                  // 当前已匹配前缀的长度
    for (int i = 1; i &lt; m; i++) {
        while (k &gt; 0 &amp;&amp; p[i] != p[k]) k = next[k - 1];
        if (p[i] == p[k]) k++;
        next[i] = k;
    }
}

// KMP 主匹配
int kmp_search(const char *text, const char *pattern) {
    int n = strlen(text), m = strlen(pattern);
    if (m == 0) return 0;
    int next[m];
    compute_next(pattern, m, next);
    int i = 0, j = 0;
    while (i &lt; n) {
        if (text[i] == pattern[j]) {
            i++; j++;
            if (j == m) return i - m;        // 找到，起始位置 i-m
        } else if (j &gt; 0) {
            j = next[j - 1];                  // 关键：i 不回退！
        } else {
            i++;                              // j 已经为 0，i 往前一格
        }
    }
    return -1;
}</code></pre>

<h4>复杂度分析</h4>
<ul>
  <li>构造 <code>next[]</code>：O(m)</li>
  <li>主匹配：i 永远只会前进，最多前进 n 次；j 每次失败时只会减小，所以 i+j 这个量最多增加 2n 次 → 主匹配 <strong>O(n)</strong></li>
  <li>合计：<strong>O(n + m)</strong></li>
</ul>

<p>对比朴素的 O(nm)——KMP 是真正的"线性时间字符串匹配"。</p>

<blockquote>提示 KMP 不是工业界最常用的（实际上 BMH 和 BM 在大多数情况下更快，第三篇会讲）。但 KMP 的<strong>失败函数</strong>思想被反复用到其他算法里——AC 自动机、后缀自动机都依赖类似的"如果失败该跳到哪里"的预处理。学懂 KMP 的人，第一次接触 AC 自动机会觉得"哦，原来就是 KMP 在树上"。</blockquote>

<hr>

<h2>本篇小结</h2>
<ul>
  <li><strong>归并、快排</strong>把排序提速到 O(n log n)；归并稳定但要 O(n) 空间，快排原地但最坏 O(n²)</li>
  <li><strong>比较排序的下界 O(n log n)</strong>——不是工程没做好，是数学告诉你的</li>
  <li><strong>ADT</strong> 让你先想"这个数据结构对外能干什么"，再操心"内部怎么实现"。同一个 ADT 可以有多种实现，按需求选</li>
  <li><strong>数组 vs 链表</strong>：随机访问 vs 头部插入删除——按你的"主要操作"选</li>
  <li><strong>栈 LIFO</strong>（DFS / 函数调用 / 撤销）；<strong>队列 FIFO</strong>（BFS / 任务调度）</li>
  <li><strong>二叉树</strong>有 4 种遍历：前序 / 中序 / 后序 / 层序。BFS 用队列，DFS 用递归（即用栈）</li>
  <li><strong>BST</strong> 让查找 / 插入 / 删除都是 O(log n)——但前提是树<strong>平衡</strong>。AVL 树用旋转保证平衡</li>
  <li><strong>KMP</strong> 的核心是失败函数 next[]：让 i 永不回退，把 O(nm) 的朴素匹配降到 O(n+m)</li>
</ul>

<p>第三篇见——我们将看堆与优先队列、哈希表的设计哲学、字符串里的 BMH 和更多设计范式（贪心、动态规划）。这一篇内容多概念也多，建议你先把每个动画都跑一遍、把每段代码都自己敲一遍——后面的内容会反复用到这些"原型"。</p>
`;
