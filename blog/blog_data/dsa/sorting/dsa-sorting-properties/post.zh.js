/* Post body — dsa-sorting-properties / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-sorting-properties:zh'] = `
<p class="lead">排序（sorting）就是把一组元素按从小到大重新排好。比较排序算法时，本课除了看时间和空间，还看三个性质：<strong>原地（in-place）</strong>、<strong>稳定（stable）</strong>、<strong>自适应（adaptive）</strong>。</p>

<h2>从一个场景说起</h2>
<p>书架上有一排书，要按作者名字排好。排好之后，找书可以先看中间那本，偏了就只在一半里找；想知道有没有同一本书放了两份，只要看相邻两本。</p>
<p>整理的办法有很多。除了快不快，你还会在意三件事：</p>
<ul>
<li>就在书架上挪，还是先把书全搬到地上？</li>
<li>同一作者的几本书，原来的先后会不会被打乱？</li>
<li>书架本来就差不多整齐，能不能很快弄完？</li>
</ul>
<p>这就是本课比较排序算法时看的三个性质。</p>
<p>数组也一样：二分查找（binary search）的前提就是有序。找重复时，不排序只能两两比较，要 n(n−1)/2 次，Θ(n²)；排好序后相等的元素必然相邻，每个只和前一个比，最多 n−1 次。课上的 [2, 0, 9, 7, 1, 5, 2] 排好是 [0, 1, 2, 2, 5, 7, 9]：A[3] 等于 A[2]，有重复；正中间的 A[3] = 2 就是<strong>中位数（median）</strong>。数据库按键有序存放，也是为了查得快。</p>

<h2>它是什么</h2>
<p>简单说，排序就是把 n 个元素重新摆一遍，使 A[0] ≤ A[1] ≤ … ≤ A[n−1]（本课一般排数组）。三个要点：</p>
<ul>
<li><strong>只换位置，不增不减</strong>：输出是同一组元素的一个<strong>排列（permutation）</strong>。输入 [5, 2, 4, 2, 8, 8]，输出 [2, 4, 5, 8] 丢了元素，不算。</li>
<li><strong>允许相等</strong>：正确输出 [2, 2, 4, 5, 8, 8] 做不到严格递增，所以准确说法是<strong>非递减（non-decreasing）</strong>。本课说“递增”，指的就是非递减。</li>
<li><strong>排的常是记录（record）</strong>：按某个字段即<strong>键（key）</strong>比较，其余字段跟着整条记录走。</li>
</ul>
<p>比较排序算法，看五样东西：</p>
<ul>
<li><strong>时间</strong>：数键的<strong>比较</strong>和元素的<strong>交换 / 移动</strong>（一次交换算 3 次赋值），分最好、平均、最坏情况。</li>
<li><strong>空间</strong>：只算输入之外的<strong>额外空间</strong>。</li>
<li><strong>原地</strong>：额外空间只有 <strong>O(1)</strong>，好比直接在书架上挪。</li>
<li><strong>稳定</strong>：<strong>键相等的元素保持原来的相对次序</strong>，好比同一作者的书先后不变。</li>
<li><strong>自适应</strong>，也叫<strong>对输入敏感（input-sensitive）</strong>：时间还取决于输入原有的次序，同样的 n 换个摆法，复杂度类就可能不同。</li>
</ul>

<h2>看个例子</h2>
<h3>稳定：给相等的键编上号</h3>
<p>两个 2 长得一样，看不出谁是谁，所以加下标区分：5, 2₁, 4, 2₂, 8₁, 8₂。稳定的排序必须输出 <strong>2₁ 2₂ 4 5 8₁ 8₂</strong>，相等的键保持原来的先后；不稳定的则不保证。</p>
<p>选择排序（selection sort，见 5.2）每轮找出剩余部分的最小值，和剩余部分的第一个元素交换。课上的<strong>反例（counterexample）</strong>是 2₁, 2₂, 1：</p>
<pre><code class="lang-text">开始：   2₁, 2₂, 1
第 1 轮：最小值 1 在下标 2，与下标 0 的 2₁ 交换 → 1, 2₂, 2₁
第 2 轮：剩下 2₂, 2₁，最小值 2₂ 已在下标 1，与自己交换 → 1, 2₂, 2₁</code></pre>
<p>第 1 轮的交换隔得很远，2₁ 一下被甩到最后，越过了 2₂，所以<strong>选择排序不稳定</strong>。</p>
<p>不过它在 5, 2₁, 4, 2₂, 8₁, 8₂ 上恰好输出 2₁ 2₂ 4 5 8₁ 8₂。这不能说明它稳定：<strong>稳定性是算法的性质</strong>，要对所有输入成立。说不稳定，一个反例就够；说稳定，要讲清为什么任何输入都不会乱。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-sorting-properties/anims/stable-vs-unstable.html" loading="lazy" style="height: 470px;" title="插入排序与选择排序的稳定性"></iframe>
<p class="anim-caption">先选输入再按播放，上下两行每帧各走一轮。同色格子键相等，₁、₂ 是原来的先后。看最后一帧谁保住了次序。</p>

<h3>插入排序为什么稳定</h3>
<p>插入排序（insertion sort，见 5.3）像理扑克牌：拿起下一个元素，把左边比它大的往右挪，再把它放进空位。</p>
<pre><code>void insertion_sort(int A[], int n) {
    for (int i = 1; i &lt; n; i++) {
        int val = A[i];
        int j = i - 1;
        while (j &gt;= 0 &amp;&amp; A[j] &gt; val) {
            A[j + 1] = A[j];
            j--;
        }
        A[j + 1] = val;
    }
}</code></pre>
<ul>
<li>第 3 行：取出要插入的 A[i]，此时 A[0..i−1] 已经排好。</li>
<li>第 5–8 行：往左看，只要 A[j] <strong>严格大于</strong> val，就把它右移一格，继续往左。</li>
<li>第 9 行：碰到等于 val 的元素，循环就停了，val 放在它的<strong>右边</strong>。</li>
</ul>
<p>相等的元素永远不会互相越过，所以<strong>插入排序稳定</strong>。</p>
<div class="callout warn" data-label="易错">
<p>条件写成 <code>A[j] &gt;= val</code> 照样能排好序，但 val 会越过和它相等的元素，算法就不稳定了。必须是 <code>A[j] &gt; val</code>。</p>
</div>

<h3>稳定有什么用：按两个键排序</h3>
<p>排整数时看不出稳定的用处，排记录就看得出了。下面 6 条记录已按时间排好，现在按城市排，希望同一城市内仍按时间先后：</p>
<pre><code class="lang-text">Sydney 0900, Melbourne 0915, Sydney 0930, Perth 0945, Melbourne 1000, Sydney 1020</code></pre>
<table>
<thead><tr><th>下标</th><th>插入排序（稳定）</th><th>选择排序（不稳定）</th></tr></thead>
<tbody>
<tr><td>0</td><td>Melbourne 0915</td><td>Melbourne 0915</td></tr>
<tr><td>1</td><td>Melbourne 1000</td><td>Melbourne 1000</td></tr>
<tr><td>2</td><td>Perth 0945</td><td>Perth 0945</td></tr>
<tr><td>3</td><td>Sydney 0900</td><td><strong>Sydney 0930</strong></td></tr>
<tr><td>4</td><td>Sydney 0930</td><td><strong>Sydney 0900</strong></td></tr>
<tr><td>5</td><td>Sydney 1020</td><td>Sydney 1020</td></tr>
</tbody>
</table>
<p>选择排序第 2 轮把 Sydney 0900 从下标 1 换到下标 4，越过了下标 2 的 Sydney 0930；插入排序稳定，每个城市内部仍是时间顺序。</p>
<div class="callout key" data-label="考点">
<p>按两个键排序（这里城市是主要键，时间是次要键）：<strong>先按次要键排，再用稳定排序按主要键排</strong>。第一次用什么排序都行，第二次必须稳定，否则第一次排好的次序会被打乱。</p>
</div>

<h3>自适应：同样 8 个数，比较次数差多少</h3>
<table>
<thead><tr><th>输入（n = 8）</th><th>插入排序</th><th>选择排序</th></tr></thead>
<tbody>
<tr><td>已排序 1 2 3 4 5 6 7 8</td><td>7 = n−1</td><td>28</td></tr>
<tr><td>几乎有序 1 2 3 5 4 6 7 8</td><td>8</td><td>28</td></tr>
<tr><td>逆序 8 7 6 5 4 3 2 1</td><td>28 = n(n−1)/2</td><td>28</td></tr>
</tbody>
</table>
<p>插入排序在有序输入上，每个新元素比 1 次就停，Θ(n)；逆序时每个都要越过左边全部，Θ(n²)。最好、最坏差了一个复杂度类，所以它<strong>自适应</strong>，适合几乎有序的输入。</p>
<p>选择排序每轮都得扫完剩余部分才知道谁最小，不管输入怎样都是 n(n−1)/2 次，<strong>不自适应</strong>。</p>

<h2>补充：原地与下界</h2>
<p>本课的原地很严格，额外空间必须是 <strong>O(1)</strong>。计数排序（distribution counting，见 5.4）数出每个值出现几次再写回，要 K 个计数器（K 是键的取值范围），<strong>不是原地</strong>。K 与 n 无关，却可能极大：1000 个取值在 1 到 10¹² 之间的整数，就要约 10¹² 个计数器。</p>
<div class="callout note" data-label="注意">
<p>快速排序的递归栈平均占 O(log n)。按严格定义它不是原地；但它没有另开数组，说原地也合理。课上两种答案都接受，作答时写明定义和理由。</p>
</div>
<p>两条时间下界：任何排序都至少 Θ(n)，因为每个元素都得看一眼，所以<strong>最好情况 Θ(n) 已是最优</strong>；<strong>基于比较的排序（comparison-based sort）平均不可能好于 Θ(n log n)</strong>。计数排序是本课唯一不比较键的排序，O(n + K)，K 小时比 n log n 快。</p>

<h2>本课程的排序算法一览</h2>
<table>
<thead><tr><th>篇目</th><th>算法</th><th>一句话</th><th>稳定</th><th>原地</th><th>自适应</th></tr></thead>
<tbody>
<tr><td>5.2</td><td>选择排序</td><td>剩余部分的最小值换到最前</td><td>否</td><td>是</td><td>否</td></tr>
<tr><td>5.3</td><td>插入排序</td><td>下一个元素插进已排好的前缀</td><td>是</td><td>是</td><td>是</td></tr>
<tr><td>5.4</td><td>计数排序</td><td>数出每个值的个数再写回</td><td>见注</td><td>否</td><td>否</td></tr>
<tr><td>5.5–5.6</td><td>快速排序</td><td>按 pivot 分区，递归排两边</td><td>否</td><td>两种都可</td><td>是</td></tr>
<tr><td>5.7</td><td>归并排序</td><td>两半各自排好再合并</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>5.8</td><td>自底向上 / 自适应归并</td><td>从长度 1 的段 / 天然有序段开始合并</td><td>是</td><td>否</td><td>前者否，后者是</td></tr>
<tr><td>6.4</td><td>堆排序</td><td>建大顶堆，反复把堆顶换到末尾</td><td>否</td><td>是</td><td>否</td></tr>
</tbody>
</table>
<p>注：计数排序的稳定性课上没讲，按累计计数放进输出数组的写法是稳定的（见 5.4）。堆排序只按 O(n log n) 看待。</p>

<h2>考试怎么考</h2>
<p>多为选择、多选、连线题，长题里也会要你给反例或选算法：</p>
<ul>
<li><strong>性质判断</strong>：上表三列要背熟；快速排序是否原地，要写理由。</li>
<li><strong>给反例</strong>：写一个带下标的小输入，逐轮写出结果，如选择排序用 2₁, 2₂, 1。一次碰巧保持次序证明不了稳定。</li>
<li><strong>情景题</strong>：内存紧、要求稳定、几乎有序、键是小范围整数时选哪个（见 5.9）。</li>
<li><strong>读代码</strong>：插入排序写成 <code>&gt;=</code> 就不稳定；归并时相等取左边才稳定（见 5.7）。</li>
</ul>
<p>这几个定义不在公式表上，要自己记。</p>

<h3>例题 1：多选</h3>
<p>哪些正确？(A) 选择排序是原地的；(B) 计数排序的额外空间与 n 无关，所以是原地的；(C) 插入排序在已排序输入上是 Θ(n)、逆序时是 Θ(n²)，所以是自适应的；(D) 存在平均情况为 Θ(n) 的基于比较的排序；(E) 归并排序稳定但不是原地的；(F) 堆排序是原地的但不稳定。</p>
<p><strong>答案：A、C、E、F。</strong></p>
<ul>
<li>B 错：O(K) 与 n 无关，但不是 O(1)。D 错：比较排序平均不可能好于 Θ(n log n)。</li>
<li>C 正是自适应的定义。E：合并时相等取左边，所以稳定；但复制子数组要额外 O(n)。F：只在数组内交换，但堆顶与末尾的远距离交换会让相等元素互相越过。</li>
</ul>

<h3>例题 2：按两个键排序</h3>
<p>学生记录 (Cara, 70)、(Ben, 85)、(Amy, 70)、(Dan, 85)，要按分数从高到低排，同分按姓名字母序。用两次排序怎么做？第二次若用“每轮找最大值换到前面”的选择排序，结果如何？</p>
<p>分数是主要键，姓名是次要键。先按 name 排（用什么都行）：Amy 70、Ben 85、Cara 70、Dan 85。再用<strong>稳定</strong>排序按 mark 从高到低排：Ben 85、Dan 85、Amy 70、Cara 70，同分的仍是字母序。</p>
<p>第二次换成选择排序（相等时取先遇到的）：</p>
<pre><code class="lang-text">开始：   Amy 70, Ben 85, Cara 70, Dan 85
第 1 轮：最大 Ben 85（下标 1）与下标 0 的 Amy 交换 → Ben 85, Amy 70, Cara 70, Dan 85
第 2 轮：最大 Dan 85（下标 3）与下标 1 的 Amy 交换 → Ben 85, Dan 85, Cara 70, Amy 70
第 3 轮：Cara 70 与 Amy 70 相等，取先遇到的 Cara，与自己交换 → 不变</code></pre>
<p>分数排对了，但 Amy 在第 2 轮被换到最后，越过了 Cara，同分不再按字母序。</p>

<h2>小结</h2>
<ul>
<li>排序输出原元素的一个排列，非递减（本课的“递增”）。</li>
<li>原地 = 额外 O(1)。计数排序 O(K) 不是；快速排序两种答案都可，要写理由。</li>
<li>稳定 = 相等键保持相对次序。不稳定靠一个反例证明（选择排序：2₁, 2₂, 1）；插入排序只越过严格更大的元素，稳定。</li>
<li>按两个键排：先排次要键，再用稳定排序排主要键。</li>
<li>自适应 = 时间依赖输入原有次序。插入排序是（Θ(n) 到 Θ(n²)），选择排序不是。</li>
<li>比较排序平均不可能好于 Θ(n log n)；计数排序不比较键，O(n + K)。</li>
</ul>
`;
