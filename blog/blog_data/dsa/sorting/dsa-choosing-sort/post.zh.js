/* Post body — dsa-choosing-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-choosing-sort:zh'] = `
<p class="lead">没有一种排序在所有情况下都最好。选哪一种，看三件事：n 有多大、数据长什么样（几乎有序？小范围整数？）、有什么硬性要求（稳定、内存、最坏情况）。</p>

<h2>从一个场景说起</h2>
<p>出门办事，你走路、打车还是坐飞机？</p>
<p>去楼下便利店，当然走路。飞机一小时飞 800 公里，可光去机场、安检就要两三个小时。去另一个城市就反过来了：走路要好几天，飞机那点准备时间不算什么。</p>
<p>所以没有“最快的交通工具”：路近时比准备时间，路远时才比速度。还有硬条件，比如带着一只大狗，有些交通工具直接不能选。</p>
<p>挑排序算法是同一个道理。</p>

<h2>它是什么</h2>
<p>简单说，<strong>没有单一最好的排序算法</strong>（no single best sorting algorithm），要看三件事来挑：</p>
<ul>
<li><strong>数据规模 n</strong>（路程远近）：n 小时比常数开销，n 大时才比增长率。</li>
<li><strong>数据特点</strong>（路况）：几乎有序、键是小范围整数，有的算法能抄近路。</li>
<li><strong>约束</strong>（带着大狗）：要求稳定、内存紧、最坏也要快，都会直接排除一些算法。</li>
</ul>
<p>挑之前先把各排序的性质摆在一起。表里的三个性质（详见 5.1）：<strong>稳定（stable）</strong>指相等的键排完后保持原来的先后次序；<strong>原地（in-place）</strong>指只用 O(1) 额外空间；<strong>自适应（adaptive）</strong>指输入越接近有序，跑得越快。</p>
<table>
<thead><tr><th>算法</th><th>最好</th><th>平均</th><th>最坏</th><th>额外空间</th><th>稳定</th><th>原地</th><th>自适应</th></tr></thead>
<tbody>
<tr><td>选择排序（selection sort）</td><td>Θ(n²)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td></tr>
<tr><td>插入排序（insertion sort）</td><td>Θ(n)</td><td>Θ(n²)</td><td>Θ(n²)</td><td>O(1)</td><td>是</td><td>是</td><td>是</td></tr>
<tr><td>计数排序（distribution counting）</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>Θ(n + K)</td><td>O(K) ①</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>快速排序（quicksort）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n²)</td><td>O(log n) ②</td><td>否</td><td>看定义 ②</td><td>是</td></tr>
<tr><td>归并排序·自顶向下（top-down merge sort）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>归并排序·自底向上（bottom-up）</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>自适应归并（adaptive merge sort）</td><td>Θ(n)</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(n)</td><td>是</td><td>否</td><td>是</td></tr>
<tr><td>堆排序（heapsort）</td><td>不考 ③</td><td>Θ(n log n)</td><td>Θ(n log n)</td><td>O(1)</td><td>否</td><td>是</td><td>否</td></tr>
</tbody>
</table>
<p>① K 是键的取值范围，O(K) 是计数数组；排记录还要 O(n) 的输出数组（见 5.4）。② 来自递归栈，平均 O(log n)，最坏 O(n)；严格说不算原地，课上两种答案都接受，写明理由即可。③ 堆排序的最好情况课上明确不考，按 O(n log n) 作答。</p>
<div class="callout key" data-label="考点">
<p><strong>总表要背</strong>：公式表上没有各排序的性质。</p>
</div>

<h2>看个例子</h2>
<h3>n 很小：插入排序反而赢了</h3>
<p>课上用插入排序和自顶向下归并排序分别排 [5, 8, 7, 1, 3, 4, 0, 6, 9, 2]（n = 10），数了每种操作：</p>
<table>
<thead><tr><th>操作</th><th>插入排序</th><th>归并排序</th></tr></thead>
<tbody>
<tr><td>比较</td><td>32</td><td>23</td></tr>
<tr><td>移动元素</td><td>25 次右移，都在相邻位置</td><td>68 次复制：写进临时数组再拷回</td></tr>
<tr><td>函数调用</td><td>1</td><td>19（2n − 1）</td></tr>
<tr><td>额外空间</td><td>O(1)：val、i、j</td><td>n 个元素的临时数组</td></tr>
</tbody>
</table>
<p>插入排序比较多了几次，别的开销却小得多，原因有三：</p>
<ul>
<li><strong>常数开销小</strong>：插入排序只把元素往右挪一格；归并排序每层都要复制到临时数组再拷回，课上的写法每次递归还要新开两个数组。</li>
<li><strong>缓存局部性（cache locality）好</strong>：只访问相邻元素，内存连续。堆排序正相反，按父子下标跳着访问。</li>
<li><strong>没有递归</strong>：省掉反复调用、返回的开销。</li>
</ul>
<p>那为什么 Big-O 说归并更快？因为 Big-O 只描述<strong>增长率</strong>，忽略常数。n = 10 时 n² = 100 本身就是个小常数，比的是谁的常数小，就像去便利店比准备时间。</p>
<p>n 一大，增长率就说了算：n = 1000 的随机数组，插入排序平均约 25 万次比较，归并排序约 8700 次。</p>

<h3>按场景挑</h3>
<p>把总表和上面的道理合起来，就是课上的选择规则：</p>
<table>
<thead><tr><th>情况</th><th>选</th><th>理由</th></tr></thead>
<tbody>
<tr><td>n 很小</td><td>插入排序</td><td>常数小、无递归、访问连续内存</td></tr>
<tr><td>已排序或几乎有序</td><td>插入排序、自适应归并</td><td>有序时都是 Θ(n)；自适应归并最坏仍是 Θ(n log n)</td></tr>
<tr><td>最坏也要 O(n log n)</td><td>归并排序、堆排序</td><td>快速排序最坏 Θ(n²)</td></tr>
<tr><td>需要稳定</td><td>归并排序、插入排序</td><td>选择、快速、堆排序的远距离交换会让元素越过相等的键</td></tr>
<tr><td>整数键，取值范围 K 小</td><td>计数排序</td><td>Θ(n + K)，不比较键，不受 n log n 下界限制</td></tr>
<tr><td>额外内存很紧</td><td>堆排序；n 小或几乎有序时插入排序</td><td>额外 O(1)；归并要 O(n)，快速排序的栈要 O(log n)</td></tr>
</tbody>
</table>
<ul>
<li>“几乎有序”指<strong>每个元素都离最终位置不远</strong>。有序数组末尾追加几个随机值不算：新值可能要挪过大半个数组。</li>
<li>要求叠加时可能无解：<strong>稳定 + 原地 + 最坏 O(n log n)，本课没有一种排序同时满足</strong>。归并要 O(n) 额外空间，堆排序不稳定，插入排序最坏 Θ(n²)。</li>
</ul>
<iframe class="anim-frame" src="blog/blog_data/dsa-choosing-sort/anims/chooser.html" loading="lazy" style="height: 520px;" title="按要求筛选排序算法"></iframe>
<p class="anim-caption">先点一个场景，再自己勾选要求：绿色满足全部要求，红叉后面是被排除的原因，黄色取决于“原地”怎么定义。</p>
<div class="callout key" data-label="考点">
<p>情景题要写清<strong>选什么</strong>和<strong>为什么</strong>：场景对应总表里的哪个性质，其他候选差在哪一项。</p>
</div>

<h2>补充：混合排序</h2>
<p>既然小数组上插入排序更快，就把两者拼起来：<strong>归并排序往下分，子数组足够小时改用插入排序</strong>。这叫混合排序（hybrid sort）。纯归并排序会一直分到只剩 1 个元素，n = 1000 时有 1999 次递归调用，其中 1000 次只面对单个元素。</p>
<p>改动只在递归的出口：</p>
<pre><code>#define CUTOFF 10

void hybrid_sort(int A[], int tmp[], int lo, int hi) {
    if (hi - lo + 1 &lt;= CUTOFF) {
        insertion_sort(A, lo, hi);
        return;
    }
    int mid = lo + (hi - lo) / 2;
    hybrid_sort(A, tmp, lo, mid);
    hybrid_sort(A, tmp, mid + 1, hi);
    merge(A, tmp, lo, mid, hi);
}</code></pre>
<ul>
<li><strong>第 1 行</strong>：阈值（cutoff）。课上举的是 10，取 20、25 也行；快速排序常用 10～30。</li>
<li><strong>第 4–7 行</strong>：A[lo..hi] 不超过 CUTOFF 个元素，就交给插入排序（见 5.3）并返回。纯归并排序这里是“只剩 1 个元素就返回”。</li>
<li><strong>第 8–11 行</strong>：和普通归并排序一样，对半分、分别排、再合并（见 5.7）。tmp 是事先 malloc 好的临时数组。</li>
</ul>
<p>n = 1000 的随机数组，CUTOFF = 10 把递归调用从 1999 次降到 255 次，元素移动少约 21%，比较反而略多（约 9100 对 8700）。期末常考两点：</p>
<ul>
<li><strong>复杂度类不变</strong>：阈值 k 是常数，约 n/k 段插入排序各 O(k²)，合计 O(nk) = O(n)；合并层数降到约 log₂(n/k)。总共仍是 Θ(n log n)，只是常数变小。</li>
<li><strong>混合归并仍然稳定</strong>：插入排序只越过严格更大的元素，合并时相等取左边。快速排序也能这样混合，但仍不稳定，最坏仍是 Θ(n²)。</li>
</ul>

<h2>补充：库函数里的排序</h2>
<table>
<thead><tr><th>函数</th><th>算法</th><th>稳定</th></tr></thead>
<tbody>
<tr><td>C <code>qsort</code></td><td>快速排序（课上的说法；C 标准并不规定具体算法）</td><td>不保证</td></tr>
<tr><td>C++ <code>std::sort</code></td><td>introsort：快速排序 + 堆排序 + 插入排序</td><td>否</td></tr>
<tr><td>C++ <code>std::stable_sort</code></td><td>归并排序</td><td>是</td></tr>
</tbody>
</table>
<p>introsort 就是课上说的“改进的快速排序，避开最坏情况”：平时用快速排序；递归深度超过约 2 log₂ n（pivot 一直选得很差）时改用堆排序，所以最坏也是 O(n log n)；很短的段交给插入排序。</p>
<p>用库函数前要确认它满足要求，最常见的是稳定性。要“按城市排、同城按时间排”，分两次排就是先按时间、再按城市，第二次必须稳定，否则时间顺序会被打乱（见 5.1）。<code>qsort</code> 不保证稳定，就改成<strong>只排一次</strong>：比较函数先比城市，相同再比时间。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>情景选择</strong>（课上明确说会考）：给场景，选一种排序并说明理由。</li>
<li><strong>填性质表</strong>：往年题要写最紧的 Big-O 上界（closest upper bound）。快速排序时间写 O(n²)，要覆盖最坏情况；额外空间按本课写 O(log n)。自底向上归并的额外空间也是 O(n)。</li>
<li><strong>选择、判断</strong>：混合排序和库函数的性质。</li>
</ul>

<h3>例题 1：情景选择</h3>
<p>为每种情况选一种排序并说明理由：(a) 嵌入式设备几乎没有额外内存，要排 5 万个任意范围的 32 位整数，最坏时间必须有保证；(b) 10⁷ 个考试分数，都是 0～100 的整数；(c) 10⁵ 条学生记录已按学号排好，现在按带小数的平均分排，同分的仍按学号。</p>
<p>(a) <strong>堆排序</strong>：额外 O(1)，最坏 O(n log n)。归并要 O(n) 额外空间；快速排序最坏 Θ(n²)；取值范围太大，计数数组装不下。</p>
<p>(b) <strong>计数排序</strong>：K = 101，Θ(n + K) 约 10⁷ 步；比较排序约 n log₂ n ≈ 2.3×10⁸ 次比较。</p>
<p>(c) <strong>归并排序</strong>：这是第二次排序，必须稳定，同分的才会保持学号顺序。插入排序也稳定，但平均约 n²/4 ≈ 2.5×10⁹ 次比较，归并约 n log₂ n ≈ 1.7×10⁶ 次。平均分是实数，不能用计数排序。</p>

<h3>例题 2：判断正误</h3>
<p>哪些说法正确？(A) CUTOFF = 10 的混合归并排序仍是 Θ(n log n)，而且稳定；(B) 小段改用插入排序后，快速排序最坏降到 O(n log n)；(C) 在已排序输入上，自底向上归并排序是 Θ(n)；(D) 需要稳定且最坏 O(n log n) 时可以选堆排序；(E) C++ 的 <code>std::sort</code> 结合了快速排序、堆排序和插入排序。</p>
<p><strong>A、E 正确。</strong></p>
<ul>
<li>A 对：插入排序部分合计 O(n)，合并约 log₂(n/10) 层；两部分都稳定。</li>
<li>B 错：pivot 一直是最值时仍有约 n 层递归，还是 Θ(n²)。</li>
<li>C 错：它照样合并约 log₂ n 轮。有序时 Θ(n) 的是自适应归并。</li>
<li>D 错：堆排序不稳定。</li>
</ul>

<div class="callout warn" data-label="易错">
<ul>
<li>首元素做 pivot 的快速排序，已排序或逆序输入正是最坏；插入排序的最坏是逆序。</li>
<li>计数排序不能排实数（取值无穷多，没法逐个计数），K 太大时计数数组也装不下。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>没有单一最好的排序。n 小时插入排序最快：Big-O 忽略常数，n 大时才由增长率决定。</li>
<li>几乎有序：插入或自适应归并；最坏 O(n log n)：归并或堆；要稳定：归并或插入；小范围整数：计数排序；内存紧：堆排序。</li>
<li>稳定 + 原地 + 最坏 O(n log n)，本课没有一种排序同时做到。</li>
<li>混合排序在小段（阈值约 10～30）改用插入排序：复杂度类不变，混合归并仍稳定。</li>
<li><code>qsort</code> 不保证稳定，<code>std::sort</code> 是 introsort；按两个键分两次排，第二次必须稳定。</li>
</ul>
`;
