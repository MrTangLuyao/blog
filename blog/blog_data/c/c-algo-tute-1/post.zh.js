/* Post body — c-algo-tute-1 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['c-algo-tute-1:zh'] = `
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

<p class="lead">C 语言算法入门 1 · 从零到精通的第一站。这一篇我们打基础：先学会"如何评价一个算法"（大 O 记号、最坏/平均情况、空间复杂度），再练好"递归思维"（base case、调用栈、分治），然后用最常用的搜索（线性 / 二分）和最经典的 O(n²) 排序（冒泡 / 选择 / 插入）来反复练习这把"尺子"。</p>

<h2>第一部分 算法分析基础——先造一把"尺子"</h2>
<p>没学过算法的人写代码常陷入一个困境：「我的程序跑得出结果，但是慢得像乌龟，怎么办？」想知道为什么慢、怎么改快，得先有一把<strong>客观的尺子</strong>来量算法的速度。这一部分就是教你造这把尺子。<strong>把这把尺子学透了，后面每一种算法你都能立刻量它。</strong></p>

<h3>1.1 算法是什么</h3>
<p>课本上的定义：<strong>算法是一组解决问题的、有限步骤的、明确的操作</strong>。这定义看起来抽象，拆成三条性质就一目了然：</p>
<table>
  <thead><tr><th>性质</th><th>含义</th><th>反例（不是算法）</th></tr></thead>
  <tbody>
    <tr><td><strong>有输入 / 输出</strong></td><td>接收 0 个或多个输入，产生 1 个或多个输出</td><td>什么都不返回也不修改的"代码"</td></tr>
    <tr><td><strong>确定性</strong></td><td>每一步做什么都明确无歧义，给同样输入永远得同样输出</td><td>「随便选一个」「合适地排序」这种说法</td></tr>
    <tr><td><strong>有限性</strong></td><td>必须在<strong>有限步</strong>内停止</td><td><code>while(1)</code> 一直跑不停；不收敛的迭代</td></tr>
  </tbody>
</table>

<p>一个最朴素的算法例子——<strong>求两个整数之和</strong>：</p>
<pre><code>int add(int a, int b) {
    return a + b;        // 输入 a、b；输出 a+b；一步停止
}</code></pre>
<p>这个函数同时满足三条：有输入 a、b，有输出 a+b；每次调用都做完全一样的加法；执行一行就结束。它就是一个<strong>合格的算法</strong>。</p>

<blockquote>注意 算法 ≠ 程序。算法是<strong>思路</strong>，程序是把思路<strong>翻译成 C 代码</strong>。同一个算法可以用 C、Python、Java 写出来。学算法首先是学<strong>怎么想</strong>。</blockquote>

<h3>1.2 为什么需要"大 O 记号"</h3>
<p>假设你写了两个函数都能在数组里找数字。一个跑了 1 毫秒，一个跑了 5 毫秒——能说第一个更快吗？</p>
<p><strong>不能。</strong>因为：</p>
<ul>
  <li>测的是<strong>不同输入</strong>：第一个数组只有 10 个元素，第二个有 100 万个</li>
  <li>测的是<strong>不同机器</strong>：你的笔记本 vs 老电脑，差 10 倍很正常</li>
  <li>测的是<strong>不同语言</strong>：C 编译成机器码 vs Python 解释执行</li>
</ul>
<p>这就是为什么我们需要一个<strong>不依赖具体机器、不依赖具体输入</strong>的尺子。这把尺子就叫<strong>时间复杂度</strong>，记法叫<strong>大 O 记号</strong>（Big O Notation）。</p>

<p>大 O 量的不是「跑了多少毫秒」，而是<strong>「输入规模 n 增大时，运算量增长得有多快」</strong>。它丢掉常数、丢掉低阶项，只留下「最大的那一项」。</p>

<pre><code>例子：某算法运算次数为 3n² + 5n + 100

  n =       10 →   3·100  +   50 + 100 =     450
  n =      100 → 3·10000  +  500 + 100 =   30600
  n =     1000 → 3·10⁶    + 5000 + 100 = 3005100

n 一大，3n² 这一项压倒一切。常数项 100、低阶项 5n 几乎不影响。
所以我们说这个算法是 O(n²)，不写 O(3n² + 5n + 100)。</code></pre>

<h3>1.3 五个最常见的复杂度等级</h3>
<p>你 95% 的时间会和这 5 个等级打交道。从快到慢：</p>

<table>
  <thead><tr><th>记号</th><th>名字</th><th>n=10</th><th>n=100</th><th>n=1万</th><th>常见出处</th></tr></thead>
  <tbody>
    <tr><td><strong>O(1)</strong></td><td>常数</td><td>1</td><td>1</td><td>1</td><td>数组下标取值、哈希表查找</td></tr>
    <tr><td><strong>O(log n)</strong></td><td>对数</td><td>≈ 3</td><td>≈ 7</td><td>≈ 14</td><td>二分搜索、平衡二叉树查找</td></tr>
    <tr><td><strong>O(n)</strong></td><td>线性</td><td>10</td><td>100</td><td>10000</td><td>线性搜索、求和</td></tr>
    <tr><td><strong>O(n log n)</strong></td><td>线性对数</td><td>≈ 33</td><td>≈ 664</td><td>≈ 132877</td><td>归并排序、快速排序（平均）</td></tr>
    <tr><td><strong>O(n²)</strong></td><td>平方</td><td>100</td><td>10000</td><td>100000000（一亿）</td><td>冒泡 / 选择 / 插入排序</td></tr>
  </tbody>
</table>

<p>下面这个动画把这 5 个等级摆一起。<strong>拖滑块</strong>看 n 增大时谁先爆炸。条形是按对数刻度归一化的，但右边数字是真实的运算次数：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/bigO-grow.html" loading="lazy" style="height: 380px;" title="Big O 增长率对比"></iframe>
<p class="anim-caption">↑ 当 n 从 10 涨到 500，O(n²) 已经达到 25 万；O(log n) 还只是 9。</p>

<p><strong>直观体会：</strong>当 n 变成原来的 10 倍：</p>
<ul>
  <li>O(1) 不变</li>
  <li>O(log n) 多 1 个单位左右</li>
  <li>O(n) 也变成 10 倍</li>
  <li>O(n log n) 略多于 10 倍（约 13~14 倍）</li>
  <li>O(n²) 变成 100 倍 ☠️</li>
</ul>

<h4>O(1) — 常数时间</h4>
<p>不管 n 多大，操作次数<strong>恒定</strong>。</p>
<pre><code>int get_first(int arr[]) {
    return arr[0];   // 永远 1 步
}</code></pre>
<p>数组下标访问、整数加减、判断奇偶，都是 O(1)。</p>

<h4>O(log n) — 对数时间</h4>
<p>每一步把问题<strong>规模砍掉一半</strong>，所以总步数等于"n 能被 2 除多少次直到 1"——这正是 log₂ n。</p>
<pre><code>n = 1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1
共 10 步 ≈ log₂(1024) = 10</code></pre>
<p>典型代表：<strong>二分搜索</strong>（Part 3 详讲）。</p>

<h4>O(n) — 线性时间</h4>
<p>对每个元素恰好访问一次。</p>
<pre><code>int sum(int arr[], int n) {
    int s = 0;
    for (int i = 0; i &lt; n; i++) {  // 跑 n 次
        s += arr[i];
    }
    return s;
}</code></pre>

<h4>O(n log n) — 比线性慢一点</h4>
<p>"对每个元素都做一遍 O(log n) 的活"或"分治每层 O(n)，共 O(log n) 层"。归并排序、快排是典型代表。这个等级在<strong>排序</strong>里被反复证明是<strong>比较排序的理论极限</strong>（Part 5 会讲为什么）。</p>

<h4>O(n²) — 平方时间</h4>
<p>典型形状：<strong>嵌套两层循环，每层都跑 n 次</strong>。</p>
<pre><code>for (int i = 0; i &lt; n; i++) {
    for (int j = 0; j &lt; n; j++) {
        // 跑 n × n = n² 次
    }
}</code></pre>
<p>n=10000 时已经一亿次操作，普通机器要好几秒。这就是为什么对大数据<strong>不能用</strong> O(n²) 算法。</p>

<h3>1.4 怎么从代码看出大 O</h3>
<p>三条最常用的判断规则：</p>

<p><strong>规则 1：循环嵌套层数 = 指数。</strong></p>
<pre><code>for i ...        // 1 层 → O(n)
  for j ...      // 2 层 → O(n²)
    for k ...    // 3 层 → O(n³)</code></pre>

<p><strong>规则 2：顺序执行的两段，取大的。</strong></p>
<pre><code>for (i...) ...     // O(n)
for (j...) for (k...) ...  // O(n²)
// 总共 O(n) + O(n²) = O(n²)</code></pre>

<p><strong>规则 3："每次砍一半"是 log。</strong></p>
<pre><code>while (n &gt; 1) {
    n = n / 2;     // 每次规模减半 → O(log n)
}</code></pre>

<p>用规则解释：下面这段是什么复杂度？</p>
<pre><code>for (int i = 0; i &lt; n; i++) {   // 外层 n
    int x = n;
    while (x &gt; 1) {              // 内层 log n（每次砍一半）
        x /= 2;
    }
}</code></pre>
<p>外层 n 次，内层 log n 次，相乘得 <strong>O(n log n)</strong>。</p>

<h3>1.5 最好 / 最坏 / 平均情况</h3>
<p>同一个算法，不同输入下的运算次数可能差很大。所以我们其实要分三种情况谈：</p>
<table>
  <thead><tr><th>情况</th><th>含义</th><th>记号习惯</th></tr></thead>
  <tbody>
    <tr><td>最好（best）</td><td>最幸运的输入</td><td>有时也叫 Ω（Omega）</td></tr>
    <tr><td>最坏（worst）</td><td>最倒霉的输入</td><td>O（Big O）</td></tr>
    <tr><td>平均（average）</td><td>所有可能输入按概率加权</td><td>Θ（Theta，常用）</td></tr>
  </tbody>
</table>

<p><strong>例子：在长度 n 的数组里线性查找一个值。</strong></p>
<table>
  <thead><tr><th>情况</th><th>什么时候发生</th><th>步数</th><th>大 O</th></tr></thead>
  <tbody>
    <tr><td>最好</td><td>第一个就是要找的</td><td>1</td><td>O(1)</td></tr>
    <tr><td>最坏</td><td>最后一个才是 / 根本不在</td><td>n</td><td>O(n)</td></tr>
    <tr><td>平均</td><td>任意位置等概率</td><td>n/2</td><td>O(n)</td></tr>
  </tbody>
</table>

<blockquote>注意 业界讨论一个算法的大 O 时，<strong>默认指最坏情况</strong>，因为我们要保证「最差也不会比这慢」。所以你听人说"快速排序是 O(n log n)"其实有点不严谨——快排<strong>最坏</strong>是 O(n²)，平均才 O(n log n)。Part 5 会展开。</blockquote>

<h3>1.6 空间复杂度</h3>
<p>除了"花多少时间"，还要看"花多少额外内存"——这就是<strong>空间复杂度</strong>。记号还是大 O，量的是「随 n 增长，<strong>额外</strong>占用的内存」。</p>
<p>注意"额外"两字。<strong>输入本身</strong>占的空间不算（不然几乎所有算法都是 O(n) 空间，没意义）。</p>

<table>
  <thead><tr><th>代码片段</th><th>额外空间</th></tr></thead>
  <tbody>
    <tr><td><code>int s = 0;</code></td><td>O(1)（一个变量）</td></tr>
    <tr><td><code>int tmp[n];</code></td><td>O(n)（开了和输入同样大的数组）</td></tr>
    <tr><td><code>int mat[n][n];</code></td><td>O(n²)</td></tr>
    <tr><td>递归深度 = log n 的递归</td><td>O(log n)（调用栈帧）</td></tr>
  </tbody>
</table>

<h4>时间-空间权衡（Time-Space Tradeoff）</h4>
<p>很多时候你<strong>用更多内存换更快速度</strong>，或反过来。</p>
<p><strong>例子：判断 0~99 中某数是否出现过</strong></p>
<ul>
  <li><strong>方案 A：每次线性查找。</strong>时间 O(n)，空间 O(1)。</li>
  <li><strong>方案 B：开一个 bool seen[100] 数组，看到就标记。</strong>时间 O(1)（直接 <code>seen[x]</code>），空间 O(100) = O(1) 但 100 个 bool。</li>
</ul>
<p>方案 B 用了一点点额外内存，把每次查询的时间从 O(n) 降到 O(1)。这就是经典的空间换时间。<strong>哈希表</strong>（第三篇 Part 10）把这思路用到极致。</p>

<h3>1.7 实战：分析这段代码</h3>
<pre><code>int has_duplicate(int a[], int n) {
    for (int i = 0; i &lt; n; i++) {
        for (int j = i + 1; j &lt; n; j++) {
            if (a[i] == a[j]) return 1;
        }
    }
    return 0;
}</code></pre>
<p><strong>分析：</strong></p>
<ul>
  <li>外层 i：0 到 n-1，跑 n 次</li>
  <li>内层 j：每个 i，跑 n-i-1 次</li>
  <li>总次数 = (n-1) + (n-2) + ... + 1 + 0 = n(n-1)/2 ≈ n²/2</li>
  <li>大 O 丢常数：<strong>O(n²)</strong></li>
  <li>额外空间：只有 i、j 两个变量，<strong>O(1)</strong></li>
</ul>
<p>最好情况：第一对就重复，O(1)。最坏 / 平均：O(n²)。</p>

<hr>

<h2>第二部分 递归思维——会递归就开了一扇门</h2>
<p>没学过递归的人遇到树、遇到归并排序就会卡住，因为这些结构本身就是<strong>自相似</strong>的——大问题里嵌着小问题，小问题里又嵌着更小的问题。<strong>用循环去硬写非常痛苦，但用递归一行就完事</strong>。这一部分就是单独训练递归思维。</p>

<h3>2.1 没有递归会怎样？</h3>
<p>试试用循环写「打印一个目录下<strong>所有层级</strong>的文件」。第 1 层用一个 <code>for</code>，第 2 层套一个 <code>for</code>，第 3 层再套……层数不固定，循环根本写不出来。<strong>层数动态、自相似的结构，是循环的死敌，是递归的天堂。</strong></p>

<h3>2.2 递归的两件事：base case + recursive case</h3>
<p>每个递归函数都有<strong>两块</strong>，缺一不可：</p>
<table>
  <thead><tr><th>组成</th><th>作用</th><th>没有会怎样</th></tr></thead>
  <tbody>
    <tr><td><strong>base case（终止条件）</strong></td><td>直接给出答案，停止递归</td><td>无限递归 → 栈溢出</td></tr>
    <tr><td><strong>recursive case（递归调用）</strong></td><td>把问题缩小一点点，调用自己</td><td>不会"自相似"地解决问题</td></tr>
  </tbody>
</table>

<p>最经典的例子——<strong>阶乘</strong> n! = n × (n-1) × ... × 1。</p>
<pre><code>int factorial(int n) {
    if (n &lt;= 1) return 1;            // ① base case
    return n * factorial(n - 1);      // ② recursive case
}</code></pre>

<p><strong>为什么是这样？</strong>用数学归纳的眼光：</p>
<pre><code>n! = n × (n-1)!     ← 把大问题分解成自己的更小版本
1! = 1              ← 终止</code></pre>

<h3>2.3 调用栈是怎么回事</h3>
<p>每次函数调用，C 在<strong>调用栈（call stack）</strong>上压一个<strong>栈帧</strong>，记录：参数、局部变量、回去的地址。函数 return 时弹掉栈帧。下面这个动画把 <code>factorial(4)</code> 的调用栈完整跑一遍——点 ▶ 单步看每帧的"压入 / 弹出"：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/call-stack.html" loading="lazy" style="height: 460px;" title="递归调用栈"></iframe>
<p class="anim-caption">↑ 函数调用 = 压栈，return = 弹栈。栈深度峰值 = 递归深度。可以改 n 的值再试。</p>

<h3>2.4 栈溢出（Stack Overflow）</h3>
<p>调用栈空间是<strong>有限的</strong>（通常几 MB）。</p>
<ul>
  <li><strong>忘了 base case</strong>：永远 return 不了，栈帧一直堆 → 崩</li>
  <li><strong>base case 永远碰不到</strong>：比如 <code>factorial(-3)</code>，<code>n &lt;= 1</code> 永远不成立 → 崩（或不该崩但崩了）</li>
  <li><strong>递归太深</strong>：哪怕逻辑正确，递归 100 万层也会爆栈</li>
</ul>
<p><strong>修法：</strong>① 永远先写 base case；② 每次递归调用<strong>必须让参数朝 base case 靠近</strong>；③ 深度可能很大时改成迭代。</p>

<h3>2.5 递归 vs 迭代</h3>
<p>同样的事，递归和迭代都能干。怎么选？</p>

<p><strong>例：求 1 到 n 的和</strong></p>
<pre><code>// 迭代版
int sum_iter(int n) {
    int s = 0;
    for (int i = 1; i &lt;= n; i++) s += i;
    return s;
}

// 递归版
int sum_rec(int n) {
    if (n &lt;= 0) return 0;
    return n + sum_rec(n - 1);
}</code></pre>

<table>
  <thead><tr><th>对比</th><th>迭代</th><th>递归</th></tr></thead>
  <tbody>
    <tr><td>速度</td><td>稍快（无函数调用开销）</td><td>稍慢（每次调用都要压栈）</td></tr>
    <tr><td>空间</td><td>O(1)</td><td>O(n)（n 层栈帧）</td></tr>
    <tr><td>代码</td><td>稍长但直观</td><td>简洁，贴近数学定义</td></tr>
    <tr><td>适合的问题</td><td>简单线性遍历</td><td>树、分治、自相似结构</td></tr>
  </tbody>
</table>

<blockquote>注意 上面的 sum 例子<strong>不应该用递归</strong>——纯线性，迭代更好。递归的真正用处是处理<strong>树形 / 分治 / 自相似</strong>的问题，那时递归比循环干净 10 倍。</blockquote>

<h3>2.6 写递归的三步法</h3>
<p>面对一个新问题想用递归解决，按这三步走，几乎不会写错：</p>

<ol>
  <li><strong>找到 base case：</strong>问题最简单的版本是什么？比如阶乘的 1!，链表长度的"空链表"，二叉树深度的"空树"。</li>
  <li><strong>假设小一号的版本已经解决：</strong>这是递归最反直觉但最关键的一步。<em>不要</em>去想"它内部怎么算"，直接信任 <code>factorial(n-1)</code> 已经返回了正确的 (n-1)!。</li>
  <li><strong>用小一号的结果拼出当前结果：</strong><code>n! = n × (n-1)!</code>，写成 <code>return n * factorial(n - 1);</code>。</li>
</ol>

<h3>2.7 分治思想（Divide and Conquer）</h3>
<p>分治是递归最有威力的应用。<strong>把问题切两半，各自递归解决，再合并答案。</strong></p>
<p>下面这棵动画就是分治求最大值的完整过程：先一路向下切到每个元素（橙色），再一路向上合并取最大（绿色）：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/divide-conquer.html" loading="lazy" style="height: 480px;" title="分治求最大值"></iframe>
<p class="anim-caption">↑ 每层都把数组切两半 → 递归层数 = log₂ n。这是分治为什么能做到 O(n log n) 的关键。</p>

<p>分治为什么快？因为每"层"切一半，<strong>层数 = log n</strong>。如果每层的合并代价是 O(n)，总代价就是 <strong>O(n log n)</strong>——比 O(n²) 好得多。归并排序、快速排序（Part 5）都是这个思路。</p>

<p><strong>分治的最简单例子——"求最大值"对应的代码：</strong></p>
<pre><code>int max_dc(int a[], int lo, int hi) {
    if (lo == hi) return a[lo];                    // base：只剩一个
    int mid = (lo + hi) / 2;
    int left  = max_dc(a, lo, mid);                // 左半最大
    int right = max_dc(a, mid + 1, hi);            // 右半最大
    return left &gt; right ? left : right;            // 合并：取大的
}</code></pre>
<p>普通遍历也能 O(n) 求最大值，这版分治也是 O(n)，没快多少。<strong>分治真正发威是在「合并不平凡」的时候</strong>——这一点你在 Part 5 学归并排序就会深刻体会。</p>

<hr>

<h2>第三部分 搜索——拿尺子量两个最简单的算法</h2>
<p>搜索是给定一个值，找它在数据中的位置（或确定不存在）。我们看两种：<strong>线性搜索</strong>（什么数据都行）和<strong>二分搜索</strong>（数据必须有序，但快得多）。</p>

<p>下面把两种搜索摆在<strong>同一份排好序的数据</strong>上同步演示——改"目标值"再点 ▶，对比双方各用了几步：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/search.html" loading="lazy" style="height: 480px;" title="线性 vs 二分搜索"></iframe>
<p class="anim-caption">↑ 上方线性搜索：从左扫到右；下方二分搜索：每次砍一半。10 个元素时差距不大，10 万、1000 万就是天壤之别。</p>

<h3>3.1 线性搜索（Linear Search, O(n)）</h3>
<p><strong>没有它会怎样？</strong>——什么也不会。所有更复杂的搜索都是「在某种特殊条件下比它快」。线性搜索是<strong>底线方案</strong>：数据无序、只查一次也不准备排序，那就用它。</p>

<h4>思路</h4>
<p>从头到尾扫一遍，遇到就返回位置；扫完没找到，返回 -1。</p>

<h4>代码</h4>
<pre><code>int linear_search(int a[], int n, int target) {
    for (int i = 0; i &lt; n; i++) {
        if (a[i] == target) return i;     // 找到，返回下标
    }
    return -1;                             // 没找到
}</code></pre>

<h4>复杂度</h4>
<table>
  <thead><tr><th>情况</th><th>步数</th><th>大 O</th></tr></thead>
  <tbody>
    <tr><td>最好（第一个就是）</td><td>1</td><td>O(1)</td></tr>
    <tr><td>最坏（最后一个 / 不存在）</td><td>n</td><td>O(n)</td></tr>
    <tr><td>平均</td><td>n/2</td><td>O(n)</td></tr>
  </tbody>
</table>
<p>空间 O(1)。</p>

<h3>3.2 二分搜索（Binary Search, O(log n)）</h3>
<p><strong>没有它会怎样？</strong>——查 1 千万条记录都要扫 1 千万次，慢到无法接受。前提是<strong>数据已经有序</strong>，才能享受 O(log n) 的飞跃。</p>

<h4>思路（一句话）</h4>
<blockquote>每次比较中间位置：<strong>等于</strong>就找到；<strong>小于</strong>就只看右半；<strong>大于</strong>就只看左半。每次砍掉一半。</blockquote>

<h4>代码（迭代版）</h4>
<pre><code>int binary_search(int a[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo &lt;= hi) {
        int mid = lo + (hi - lo) / 2;       // 防溢出写法
        if (a[mid] == target) return mid;
        if (a[mid] &lt; target) lo = mid + 1;  // 目标在右半
        else                  hi = mid - 1;  // 目标在左半
    }
    return -1;
}</code></pre>

<blockquote>注意 写 <code>mid = (lo + hi) / 2</code> 在 lo、hi 很大时可能<strong>溢出</strong>（int 加法越界）。<code>lo + (hi - lo) / 2</code> 等价但安全。这是工业代码里的一个小经典坑。</blockquote>

<h4>代码（递归版）</h4>
<p>二分搜索本质上是分治：</p>
<pre><code>int bs_rec(int a[], int lo, int hi, int target) {
    if (lo &gt; hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] &lt; target) return bs_rec(a, mid + 1, hi, target);
    else                 return bs_rec(a, lo, mid - 1, target);
}</code></pre>
<p>逻辑一样，递归更贴近"每次砍一半"的数学本质。</p>

<h4>复杂度</h4>
<table>
  <thead><tr><th>情况</th><th>步数</th><th>大 O</th></tr></thead>
  <tbody>
    <tr><td>最好（mid 第一次就命中）</td><td>1</td><td>O(1)</td></tr>
    <tr><td>最坏 / 平均</td><td>log₂ n</td><td>O(log n)</td></tr>
  </tbody>
</table>
<p>空间：迭代版 O(1)，递归版 O(log n)（调用栈深）。</p>

<h4>线性 vs 二分对比</h4>
<table>
  <thead><tr><th>n</th><th>线性最坏</th><th>二分最坏</th></tr></thead>
  <tbody>
    <tr><td>10</td><td>10</td><td>4</td></tr>
    <tr><td>1000</td><td>1000</td><td>10</td></tr>
    <tr><td>1000000</td><td>1000000</td><td>20</td></tr>
    <tr><td>1000000000（10 亿）</td><td>10 亿</td><td>30</td></tr>
  </tbody>
</table>
<p>看到这张表你就明白为什么有序数据值得排序——<strong>排好序之后再查一次只要 30 步</strong>。</p>

<blockquote>注意 二分搜索的<strong>前提</strong>是数据有序。如果你只查一次但数据无序，<strong>不要</strong>专门排个序去二分——排序代价 O(n log n) 比直接线性 O(n) 还大。只有<strong>多次查询同一份数据</strong>时，先排序再二分才划算。</blockquote>

<hr>

<h2>第四部分 基础排序（O(n²)）——用最简单的算法练评价维度</h2>
<p>排序是计算机科学的"洗筷子"——基础但必备。这一部分我们看三种<strong>简单</strong>但都是 O(n²) 的算法：冒泡、选择、插入。它们速度都不快，但<strong>正因为简单，最适合用来反复练习"怎么用大 O、稳定性、原地、自适应等维度评价一个算法"</strong>。</p>

<p>先把三种排序摆在<strong>同一组无序数据</strong>上，<strong>切换标签</strong>看它们各自怎么把数据排好。点"打乱"换一组数据再来一次：</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/sort.html" loading="lazy" style="height: 540px;" title="O(n²) 排序可视化"></iframe>
<p class="anim-caption">↑ 黄色 = 比较，红色 = 交换，蓝色 = 抓在手里的牌（插入），绿色 = 已就位。注意比较 / 交换次数的差异。</p>

<h3>4.0 评价排序算法的 4 个维度</h3>
<p>在每个排序前，先记住这 4 个标签——后面每个排序算法你都要给它打分：</p>
<table>
  <thead><tr><th>维度</th><th>含义</th><th>为什么重要</th></tr></thead>
  <tbody>
    <tr><td><strong>时间复杂度</strong></td><td>最好 / 最坏 / 平均</td><td>速度的硬指标</td></tr>
    <tr><td><strong>空间复杂度</strong></td><td>额外内存。<strong>原地（in-place）</strong>意思是 O(1) 额外空间</td><td>大数据时内存可能不够</td></tr>
    <tr><td><strong>稳定性（stable）</strong></td><td>相等元素相对顺序<strong>是否保持</strong></td><td>多关键字排序时关键</td></tr>
    <tr><td><strong>自适应（adaptive）</strong></td><td>对"已经几乎有序"的输入是否更快</td><td>实战数据通常不是完全乱序</td></tr>
  </tbody>
</table>

<p><strong>稳定性举例：</strong>假设你有学生记录，先按姓名排好序了，再按班级排。如果"按班级排"是<strong>稳定的</strong>，那么同班同学之间的姓名顺序还在；如果不稳定，姓名顺序就乱了。</p>

<h3>4.1 冒泡排序（Bubble Sort）</h3>
<p><strong>名字由来：</strong>大数像泡泡一样不断"冒"到右边。</p>

<h4>思路</h4>
<p>反复扫描数组：每次比较相邻两个，左 &gt; 右就交换。一轮过后，最大的元素被换到最右边。一共扫 n-1 轮。<em>（动画选 "冒泡" 看效果）</em></p>

<h4>代码</h4>
<pre><code>void bubble_sort(int a[], int n) {
    for (int i = 0; i &lt; n - 1; i++) {
        int swapped = 0;                    // 自适应优化：本轮有没有交换
        for (int j = 0; j &lt; n - 1 - i; j++) {
            if (a[j] &gt; a[j + 1]) {
                int tmp = a[j];             // 交换
                a[j] = a[j + 1];
                a[j + 1] = tmp;
                swapped = 1;
            }
        }
        if (!swapped) break;                // 一轮没交换 → 已经有序
    }
}</code></pre>

<h4>评价</h4>
<table>
  <thead><tr><th>维度</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>最好</td><td>O(n)（数据已有序，第一轮就提前 break）</td></tr>
    <tr><td>最坏</td><td>O(n²)（完全逆序）</td></tr>
    <tr><td>平均</td><td>O(n²)</td></tr>
    <tr><td>空间</td><td>O(1)，<strong>原地</strong></td></tr>
    <tr><td>稳定</td><td><strong>是</strong>（只有 a[j] &gt; a[j+1] 才换，相等不换）</td></tr>
    <tr><td>自适应</td><td><strong>是</strong>（加 swapped 优化后）</td></tr>
  </tbody>
</table>

<h3>4.2 选择排序（Selection Sort）</h3>
<p><strong>思路：</strong>每一轮从未排序部分里选出最小的，放到前面。<em>（动画选 "选择" 看效果——注意它的"扫一遍找最小，再交换一次"两段动作。）</em></p>

<h4>代码</h4>
<pre><code>void selection_sort(int a[], int n) {
    for (int i = 0; i &lt; n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j &lt; n; j++) {       // 找最小的位置
            if (a[j] &lt; a[min_idx]) min_idx = j;
        }
        if (min_idx != i) {                      // 交换到位
            int tmp = a[i];
            a[i] = a[min_idx];
            a[min_idx] = tmp;
        }
    }
}</code></pre>

<h4>评价</h4>
<table>
  <thead><tr><th>维度</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>最好 / 最坏 / 平均</td><td>都是 O(n²)（无论输入如何，都要找 n 次最小）</td></tr>
    <tr><td>空间</td><td>O(1)，<strong>原地</strong></td></tr>
    <tr><td>稳定</td><td><strong>否</strong>。比如 [5a, 5b, 2]：第 1 轮把 2 跟 5a 换 → [2, 5b, 5a]，5a 跑到 5b 后面了</td></tr>
    <tr><td>自适应</td><td><strong>否</strong></td></tr>
    <tr><td>独特优点</td><td>交换次数最多 n-1 次。<strong>当"写"很贵</strong>（比如刷盘）时这个特点有用</td></tr>
  </tbody>
</table>

<h3>4.3 插入排序（Insertion Sort）</h3>
<p><strong>名字由来：</strong>像打牌时<strong>抓一张就插进合适位置</strong>。</p>

<h4>思路</h4>
<p>把数组分成「已排序前缀」+「未排序后缀」。每次拿后缀的第一张牌，向左挪到合适位置。<em>（动画选 "插入" 看效果——蓝色高亮的就是手里抓的那张牌。）</em></p>

<h4>代码</h4>
<pre><code>void insertion_sort(int a[], int n) {
    for (int i = 1; i &lt; n; i++) {
        int key = a[i];               // 抓的牌
        int j = i - 1;
        while (j &gt;= 0 &amp;&amp; a[j] &gt; key) {
            a[j + 1] = a[j];          // 大于 key 的元素右移
            j--;
        }
        a[j + 1] = key;               // 插入正确位置
    }
}</code></pre>

<h4>评价</h4>
<table>
  <thead><tr><th>维度</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>最好</td><td><strong>O(n)</strong>（已有序：每张牌只比较一次就停）</td></tr>
    <tr><td>最坏</td><td>O(n²)（完全逆序）</td></tr>
    <tr><td>平均</td><td>O(n²)</td></tr>
    <tr><td>空间</td><td>O(1)，<strong>原地</strong></td></tr>
    <tr><td>稳定</td><td><strong>是</strong>（用 <code>&gt;</code> 而非 <code>&gt;=</code>，相等不挪）</td></tr>
    <tr><td>自适应</td><td><strong>非常自适应</strong>（"几乎有序"的输入接近 O(n)）</td></tr>
  </tbody>
</table>

<blockquote>提示 <strong>插入排序在小数据 / 几乎有序的情况下是这三个里最快的</strong>。事实上工业级排序（如 Java 的 Timsort、C++ 的 std::sort）都会在数据小（&lt; 几十个）时切到插入排序。</blockquote>

<h3>4.4 三个 O(n²) 排序的对比</h3>
<table>
  <thead><tr><th></th><th>冒泡</th><th>选择</th><th>插入</th></tr></thead>
  <tbody>
    <tr><td>最好时间</td><td>O(n)</td><td>O(n²)</td><td>O(n)</td></tr>
    <tr><td>最坏 / 平均</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td></tr>
    <tr><td>稳定</td><td>是</td><td>否</td><td>是</td></tr>
    <tr><td>自适应</td><td>是（带优化）</td><td>否</td><td>是 ⭐</td></tr>
    <tr><td>原地</td><td>是</td><td>是</td><td>是</td></tr>
    <tr><td>交换次数</td><td>很多</td><td>少（≤ n-1）</td><td>较多（移动而非交换）</td></tr>
    <tr><td>实战推荐</td><td>教学用</td><td>"写"贵时</td><td>小数据 / 接近有序 ⭐</td></tr>
  </tbody>
</table>

<h3>4.5 我们学到了什么"评价维度"</h3>
<p>把上面的对比看一遍，你会发现：<strong>大 O 不是评价算法的唯一指标</strong>。在三个 O(n²) 算法里：</p>
<ul>
  <li>冒泡和插入都自适应，选择不</li>
  <li>选择不稳定，另两个稳定</li>
  <li>选择交换次数最少</li>
  <li>插入对小数据 / 近有序数据"打分"最高</li>
</ul>
<p>这些维度——稳定性、原地、自适应、最好/最坏的差距——比单看一个 O(n²) 重要得多。<strong>下一篇我们会用同样的尺子去量 O(n log n) 的高效排序，到时你会发现它们也是各有取舍。</strong></p>

<hr>

<h2>本篇小结</h2>
<ul>
  <li><strong>大 O 是把"尺子"</strong>：丢掉常数和低阶，只看输入规模 n 的增长趋势</li>
  <li><strong>5 个等级要倒背如流</strong>：O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²)</li>
  <li><strong>分最好 / 最坏 / 平均</strong>：业界默认指最坏</li>
  <li><strong>空间复杂度</strong>是另一把尺子，时间和空间常常可以互换</li>
  <li><strong>递归 = base case + 缩小问题调用自己</strong>。永远先写 base，永远让参数靠近 base</li>
  <li><strong>分治</strong>把问题切两半，是 O(n log n) 算法的灵魂</li>
  <li><strong>线性搜索 O(n)</strong>无脑通用；<strong>二分搜索 O(log n)</strong>需要数据有序</li>
  <li><strong>O(n²) 三人组</strong>都不快，但训练了你"稳定 / 自适应 / 原地"等评价维度——下一篇我们用同样的维度量 O(n log n) 的归并、快排</li>
</ul>

<p>第二篇见——我们将开始用真正高效的算法，并第一次见到「数据结构」这个新世界。</p>
`;
