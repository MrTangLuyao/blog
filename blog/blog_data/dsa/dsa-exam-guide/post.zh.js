/* Post body — dsa-exam-guide / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-exam-guide:zh'] = `
<p class="lead">COMP20003 期末考试的形式、范围、公式表内容，以及这个合集八个部分各对应哪几周、按什么顺序复习。</p>

<h2>考试安排</h2>
<table>
  <thead><tr><th>项目</th><th>内容</th></tr></thead>
  <tbody>
    <tr><td>时间</td><td>2026 年 11 月 5 日（周四）13:30</td></tr>
    <tr><td>时长</td><td>阅读 15 分钟 + 作答 180 分钟（有 AEA 的同学以自己的安排为准）</td></tr>
    <tr><td>形式</td><td>校内现场机考，LockDown Browser（和期中一样），闭卷</td></tr>
    <tr><td>可用资料</td><td>只有考试题里附的公式表 PDF</td></tr>
    <tr><td>分值</td><td>45 分，占总成绩 45%</td></tr>
    <tr><td>门槛（hurdle）</td><td>期中 10% + 期末 45% 这 55% 里至少拿一半</td></tr>
  </tbody>
</table>

<h2>题型</h2>
<p>大约 15–20 题，分两类：</p>
<ul>
  <li><strong>自动判分题</strong>：单选（multiple choice）、多选（multiple selection）、匹配（matching）、填空（fill in the blank，短答）。</li>
  <li><strong>长答题 3–4 道</strong>：读代码（code reading）、写代码（code writing）、算法设计（algorithm design，风格同 workshop W11.6）。</li>
</ul>
<div class="callout key" data-label="考点">
  <p>大约 <strong>30% 的分数</strong>和 C 代码有关（读和写），代码写在普通文本框里：语义必须对，语法小错不是重点，注释有帮助。</p>
</div>

<h2>考试范围</h2>
<p>没有特别说明的都考：lecture 课件、录播、tutorial、作业（A1–A3）。客座讲座（W12 L1 订单簿）只考概念，不考技术细节。</p>
<div class="callout warn" data-label="不考">
  <ul>
    <li>Binet 公式（斐波那契通项，W1 L2）</li>
    <li>红黑树（W5 L1）；2-3-4 树只需要知道大意，不考细节</li>
    <li>Bellman-Ford 算法（W10 L2）</li>
    <li>Kruskal 算法（W12 workshop）</li>
  </ul>
</div>

<h2>公式表上有什么</h2>
<p>下面这些考试时直接给，<strong>会用就行，不用背</strong>：</p>
<table>
  <thead><tr><th>类别</th><th>内容</th></tr></thead>
  <tbody>
    <tr><td>对数</td><td>换底 log<sub>a</sub> x = log<sub>b</sub> x / log<sub>b</sub> a；log(xy) = log x + log y；log(x<sup>r</sup>) = r·log x</td></tr>
    <tr><td>求和</td><td>1 + 2 + … + n = n(n+1)/2；r<sup>0</sup> + r<sup>1</sup> + … + r<sup>n</sup> = (1 − r<sup>n+1</sup>)/(1 − r)</td></tr>
    <tr><td>主定理</td><td>T(n) = aT(n/b) + Θ(n<sup>d</sup>)：a &lt; b<sup>d</sup> → Θ(n<sup>d</sup>)；a = b<sup>d</sup> → Θ(n<sup>d</sup> log n)；a &gt; b<sup>d</sup> → Θ(n<sup>log<sub>b</sub> a</sup>)</td></tr>
    <tr><td>哈希插入估计</td><td>装载因子 α = n/m；双重哈希约 1/(1−α) 次探测，线性探测约 1/(1−α)<sup>2</sup> 次</td></tr>
  </tbody>
</table>
<p>公式表<strong>没有</strong>的必须自己记住：各数据结构每个操作的最好/平均/最坏复杂度、各排序的性质、堆的下标公式、AVL 四种旋转、各图算法的步骤和复杂度、Big-O / Ω / Θ 的定义。</p>

<h2>这个合集的复习路线</h2>
<table>
  <thead><tr><th>部分</th><th>内容</th><th>对应周</th></tr></thead>
  <tbody>
    <tr><td>1 算法与复杂度</td><td>算法的性质、数操作、Big-O/Ω/Θ、最好最坏平均、递推式、主定理、设计思路、最近点对</td><td>W1–2、W6–7</td></tr>
    <tr><td>2 数组、链表与基础 ADT</td><td>ADT 与字典、指针与数组、二分查找、链表、动态数组与均摊、栈和队列</td><td>W2–3</td></tr>
    <tr><td>3 树</td><td>二叉树约定、遍历、BST、删除、AVL、2-3 树、B/B+ 树、伸展树、四叉树与 k-d 树、Trie</td><td>W4–5</td></tr>
    <tr><td>4 哈希表</td><td>哈希函数、字符串哈希、拉链法、线性探测与双重哈希、装载因子</td><td>W5</td></tr>
    <tr><td>5 排序</td><td>排序性质、选择、插入、计数、快排、归并及其变体、如何选择</td><td>W6–7、W9</td></tr>
    <tr><td>6 堆与优先队列</td><td>堆的数组表示、上浮下沉、建堆、堆排序、优先队列与 Top-k</td><td>W8–9</td></tr>
    <tr><td>7 图</td><td>术语、表示、DFS、BFS、Dijkstra、Floyd-Warshall、Prim、拓扑排序、图建模</td><td>W10–11</td></tr>
    <tr><td>8 综合复习与真题</td><td>订单簿、两张复杂度总表、陷阱题、C 代码模板、算法设计题、往年真题</td><td>W12 + 全部</td></tr>
  </tbody>
</table>

<h2>最后一周怎么用</h2>
<ol>
  <li>先过一遍第 8 部分的两张<strong>复杂度总表</strong>，把填不出来的格子对应的文章补看。</li>
  <li>做<strong>高频陷阱题</strong>：每题先自己答，再展开答案。错的题回到对应文章。</li>
  <li>手写一遍 <strong>C 代码模板</strong>里的链表、BST、堆、BFS：考试时没有编译器，要能一次写对。</li>
  <li>限时做<strong>往年真题</strong>，算法设计题按「建模 → 选已知算法 → 说明改动 → 复杂度」的结构答。</li>
</ol>

<h2>答疑与资源</h2>
<ul>
  <li>答疑 1：10 月 28 日（周三）13:00–15:00，Melbourne Connect 2 楼 2206（Mildura Room）</li>
  <li>答疑 2：11 月 2 日（周一）12:00–16:00，Melbourne Connect 3 楼 3209（Manchester Room）</li>
  <li>ED 讨论区考前一直开放；往年试卷和答案在 Week 12 extras。</li>
</ul>
`;
