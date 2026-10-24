/* Post body — dsa-design-paradigms / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-design-paradigms:zh'] = `
<p class="lead">设计算法最常用四种思路：<strong>蛮力（brute force）</strong>、<strong>减治（decrease-and-conquer）</strong>、<strong>分治（divide-and-conquer）</strong>和<strong>贪心（greedy）</strong>。期末最常见的考法是配对题：给一个算法，说出它用的是哪种思路。</p>

<h2>从一个场景说起</h2>
<p>你手上有一叠写着号码的卡片。</p>
<p>卡片是乱的，要找 42：没有规律可用，只能一张张翻，最坏 n 张全翻完。</p>
<p>卡片排好了，再找 42：翻开正中间那张，是 57。42 比它小，右半肯定没有，整半扔掉，只在左半接着找。</p>
<p>要把乱的一叠排好：分成两叠，你和朋友各排一叠，再每次比较两叠最上面那张，小的先放，合成一叠。</p>
<p>另一件事：周末的活动时间互相冲突，想参加尽量多的。每次挑<strong>结束最早</strong>的，划掉和它冲突的，再挑下一个。</p>
<p>这四种做法，就是课上的四种算法设计思路。认出一个算法属于哪种，它的递推式和复杂度也就大致有数了。</p>

<h2>它是什么</h2>
<p>简单说，设计思路（design paradigm）就是<strong>怎样把问题变小、每一步怎样做决定</strong>的套路。期末复习课分成四种，对回刚才的场景：</p>
<ul>
  <li><strong>蛮力（brute force）</strong>：把所有候选逐个检查一遍，不利用问题的结构。像一张张翻卡片：翻完答案一定对，但候选多就慢。</li>
  <li><strong>减治（decrease-and-conquer）</strong>：每步做一点工作，把问题变成<strong>一个</strong>更小的同类问题，只解它。像扔掉一半接着找。可以减一（n → n−1），也可以减半（n → n/2）。</li>
  <li><strong>分治（divide-and-conquer）</strong>：拆成几个互不重叠的小问题，<strong>每个都要解</strong>，再合并答案。像两人分头排再合并。</li>
  <li><strong>贪心（greedy）</strong>：用于求最大、最小的最优化问题。每步挑眼下最好的（局部最优，locally optimal），<strong>挑了不改</strong>。像挑最早结束的活动。</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 440 410" width="440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="四种设计思路和例子">
<defs><marker id="dp-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.55)"/></marker></defs>
<line x1="8" y1="108" x2="432" y2="108" stroke="rgba(255,255,255,0.12)"/>
<line x1="8" y1="208" x2="432" y2="208" stroke="rgba(255,255,255,0.12)"/>
<line x1="8" y1="308" x2="432" y2="308" stroke="rgba(255,255,255,0.12)"/>
<rect x="12" y="34" width="16" height="16" rx="3" fill="rgba(217,119,87,0.18)" stroke="#d97757"/>
<rect x="34" y="34" width="16" height="16" rx="3" fill="rgba(217,119,87,0.18)" stroke="#d97757"/>
<rect x="56" y="34" width="16" height="16" rx="3" fill="rgba(217,119,87,0.18)" stroke="#d97757"/>
<rect x="78" y="34" width="16" height="16" rx="3" fill="rgba(217,119,87,0.18)" stroke="#d97757"/>
<rect x="100" y="34" width="16" height="16" rx="3" fill="rgba(217,119,87,0.18)" stroke="#d97757"/>
<rect x="122" y="34" width="16" height="16" rx="3" fill="rgba(217,119,87,0.18)" stroke="#d97757"/>
<text x="20" y="72" text-anchor="middle" font-size="13" fill="#4ade80">✓</text>
<text x="42" y="72" text-anchor="middle" font-size="13" fill="#4ade80">✓</text>
<text x="64" y="72" text-anchor="middle" font-size="13" fill="#4ade80">✓</text>
<text x="86" y="72" text-anchor="middle" font-size="13" fill="#4ade80">✓</text>
<text x="108" y="72" text-anchor="middle" font-size="13" fill="#4ade80">✓</text>
<text x="130" y="72" text-anchor="middle" font-size="13" fill="#4ade80">✓</text>
<text x="160" y="30" font-size="15" font-weight="700" fill="#d97757">蛮力 brute force</text>
<text x="160" y="54" font-size="13" fill="#e8e8e8">把所有候选逐个试一遍</text>
<text x="160" y="76" font-size="12" fill="#a1a1a0">线性查找 · 逐对算最近点对</text>
<text x="160" y="96" font-size="12" fill="#a1a1a0">遍历树或图找某个元素</text>
<line x1="38" y1="136" x2="62" y2="136" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" marker-end="url(#dp-arr)"/>
<line x1="88" y1="136" x2="112" y2="136" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" marker-end="url(#dp-arr)"/>
<line x1="38" y1="180" x2="62" y2="180" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" marker-end="url(#dp-arr)"/>
<line x1="88" y1="180" x2="112" y2="180" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" marker-end="url(#dp-arr)"/>
<circle cx="26" cy="136" r="12" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="76" cy="136" r="12" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="126" cy="136" r="12" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="26" cy="180" r="12" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="76" cy="180" r="12" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="126" cy="180" r="12" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<text x="26" y="136" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#e8e8e8">n</text>
<text x="76" y="136" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#e8e8e8">n−1</text>
<text x="126" y="136" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#e8e8e8">n−2</text>
<text x="26" y="180" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#e8e8e8">n</text>
<text x="76" y="180" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#e8e8e8">n/2</text>
<text x="126" y="180" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#e8e8e8">n/4</text>
<text x="160" y="130" font-size="15" font-weight="700" fill="#d97757">减治 decrease-and-conquer</text>
<text x="160" y="154" font-size="13" fill="#e8e8e8">每步只留下一个更小的子问题</text>
<text x="160" y="176" font-size="12" fill="#a1a1a0">选择排序 · 插入排序 · 二分查找</text>
<text x="160" y="196" font-size="12" fill="#a1a1a0">拓扑排序（删源点）</text>
<line x1="76" y1="232" x2="40" y2="284" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="76" y1="232" x2="112" y2="284" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<circle cx="76" cy="232" r="13" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="40" cy="284" r="13" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="112" cy="284" r="13" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="76" y="232" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#e8e8e8">n</text>
<text x="40" y="284" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#e8e8e8">n/2</text>
<text x="112" y="284" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#e8e8e8">n/2</text>
<text x="160" y="230" font-size="15" font-weight="700" fill="#d97757">分治 divide-and-conquer</text>
<text x="160" y="254" font-size="13" fill="#e8e8e8">拆成几块，块块都解，再合并</text>
<text x="160" y="276" font-size="12" fill="#a1a1a0">快速排序 · 归并排序</text>
<text x="160" y="296" font-size="12" fill="#a1a1a0">最近点对（分治版）</text>
<polyline points="30,356 76,330 122,382" fill="none" stroke="#d97757" stroke-width="2"/>
<circle cx="30" cy="330" r="7" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="30" cy="356" r="7" fill="#d97757" stroke="#d97757" stroke-width="2"/>
<circle cx="30" cy="382" r="7" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="76" cy="330" r="7" fill="#d97757" stroke="#d97757" stroke-width="2"/>
<circle cx="76" cy="356" r="7" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="76" cy="382" r="7" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="122" cy="330" r="7" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="122" cy="356" r="7" fill="#343433" stroke="#5a5a59" stroke-width="2"/>
<circle cx="122" cy="382" r="7" fill="#d97757" stroke="#d97757" stroke-width="2"/>
<text x="160" y="330" font-size="15" font-weight="700" fill="#d97757">贪心 greedy</text>
<text x="160" y="354" font-size="13" fill="#e8e8e8">每步挑眼下最好的，挑了不改</text>
<text x="160" y="376" font-size="12" fill="#a1a1a0">最早结束优先 · Dijkstra · Prim</text>
<text x="160" y="396" font-size="12" fill="#a1a1a0">（用于求最大、最小的最优化问题）</text>
</svg>
<figcaption>四种设计思路和课上的例子。减治画了两种缩小方式：减一和减半。</figcaption>
</figure>
<p>图里的例子要背。几个不太直观的：</p>
<ul>
  <li>蛮力：<strong>线性查找（linear search）</strong>从头看到尾，最坏 Θ(n)；<strong>最近点对（closest pair）</strong>逐对算 n(n−1)/2 个距离，Θ(n²)（见 1.11）；在普通二叉树或图里找值，只能遍历。</li>
  <li>减一：<strong>插入排序（insertion sort）</strong>先排好前 n−1 个，再插入第 n 个；<strong>选择排序（selection sort）</strong>先把最小值放最前，再排剩下 n−1 个；<strong>拓扑排序（topological sort）</strong>删源点法每次输出并删掉一个入度为 0 的顶点。</li>
</ul>

<h2>看个例子：二分查找和归并排序</h2>
<p>最容易混的是减治和分治。二分查找（binary search）和归并排序（merge sort）都从中间分两半，为什么一个算减治、一个算分治？拿 n = 8 走一遍。</p>
<p><strong>二分查找</strong>在 8 个有序数里找 key：</p>
<ol>
  <li>和中间元素比一次，key 小去左半、大去右半，剩 4 个。</li>
  <li>再比一次，剩 2 个。</li>
  <li>再比一次，剩 1 个，比完就知道在不在。</li>
</ol>
<p>每步只留一半，另一半扔掉不再看。递推式（recurrence）T(n) = T(n/2) + c，log₂ n 层、每层常数，最坏 Θ(log n)。</p>
<p><strong>归并排序</strong>排 8 个数：</p>
<ol>
  <li>切成两份 4 个，两份都要排，哪份都不能扔。</li>
  <li>每份再切成两份 2 个，共 4 份，全要排。</li>
  <li>切到 8 份，每份 1 个，天然有序。</li>
  <li>往回合并（merge）：1+1 → 2，2+2 → 4，4+4 → 8，每层合并共处理 n 个数。</li>
</ol>
<p>递推式 T(n) = 2T(n/2) + cn，log₂ n 层、每层 cn，Θ(n log n)。画成递归树（结点里是子问题规模）：</p>
<figure class="fig">
<svg viewBox="0 0 400 275" width="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="二分查找的递归树">
<line x1="150" y1="40" x2="95" y2="105" stroke="#4ade80" stroke-width="2"/>
<line x1="150" y1="40" x2="205" y2="105" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="95" y1="105" x2="60" y2="170" stroke="#4ade80" stroke-width="2"/>
<line x1="95" y1="105" x2="130" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="5 4"/>
<line x1="60" y1="170" x2="40" y2="235" stroke="#4ade80" stroke-width="2"/>
<line x1="60" y1="170" x2="80" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="5 4"/>
<circle cx="150" cy="40" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="95" cy="105" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="60" cy="170" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="40" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="205" cy="105" r="15" fill="#2a2a29" stroke="#5a5a59" stroke-width="2" stroke-dasharray="4 3"/>
<circle cx="130" cy="170" r="15" fill="#2a2a29" stroke="#5a5a59" stroke-width="2" stroke-dasharray="4 3"/>
<circle cx="80" cy="235" r="15" fill="#2a2a29" stroke="#5a5a59" stroke-width="2" stroke-dasharray="4 3"/>
<text x="150" y="40" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">8</text>
<text x="95" y="105" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">4</text>
<text x="60" y="170" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<text x="40" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="205" y="105" text-anchor="middle" dominant-baseline="central" font-size="14" fill="#a1a1a0">4</text>
<text x="130" y="170" text-anchor="middle" dominant-baseline="central" font-size="14" fill="#a1a1a0">2</text>
<text x="80" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" fill="#a1a1a0">1</text>
<text x="228" y="105" dominant-baseline="central" font-size="12" fill="#a1a1a0">丢弃，不递归</text>
<text x="8" y="16" font-size="13" font-weight="700" fill="#e8e8e8">二分查找（减治）</text>
<text x="340" y="16" text-anchor="middle" font-size="12" fill="#a1a1a0">每层工作</text>
<text x="340" y="40" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">c</text>
<text x="340" y="105" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">c</text>
<text x="340" y="170" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">c</text>
<text x="340" y="235" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">T(1)</text>
<text x="200" y="268" text-anchor="middle" font-size="13" fill="#e8e8e8">合计 c·log₂ n + T(1) ∈ Θ(log n)</text>
</svg>
<svg viewBox="0 0 440 275" width="440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="归并排序的递归树">
<line x1="170" y1="40" x2="90" y2="105" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="170" y1="40" x2="250" y2="105" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="90" y1="105" x2="50" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="90" y1="105" x2="130" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="250" y1="105" x2="210" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="250" y1="105" x2="290" y2="170" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="50" y1="170" x2="30" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="50" y1="170" x2="70" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="130" y1="170" x2="110" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="130" y1="170" x2="150" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="210" y1="170" x2="190" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="210" y1="170" x2="230" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="290" y1="170" x2="270" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<line x1="290" y1="170" x2="310" y2="235" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<circle cx="170" cy="40" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="90" cy="105" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="250" cy="105" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="50" cy="170" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="130" cy="170" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="210" cy="170" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="290" cy="170" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="30" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="70" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="110" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="150" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="190" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="230" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="270" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<circle cx="310" cy="235" r="15" fill="#343433" stroke="#4ade80" stroke-width="2"/>
<text x="170" y="40" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">8</text>
<text x="90" y="105" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">4</text>
<text x="250" y="105" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">4</text>
<text x="50" y="170" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<text x="130" y="170" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<text x="210" y="170" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<text x="290" y="170" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">2</text>
<text x="30" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="70" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="110" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="150" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="190" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="230" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="270" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="310" y="235" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#e8e8e8">1</text>
<text x="8" y="16" font-size="13" font-weight="700" fill="#e8e8e8">归并排序（分治）</text>
<text x="390" y="16" text-anchor="middle" font-size="12" fill="#a1a1a0">每层工作</text>
<text x="390" y="40" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">cn</text>
<text x="390" y="105" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">cn</text>
<text x="390" y="170" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">cn</text>
<text x="390" y="235" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#fbbf24">n·T(1)</text>
<text x="220" y="268" text-anchor="middle" font-size="13" fill="#e8e8e8">合计 cn·log₂ n + n·T(1) ∈ Θ(n log n)</text>
</svg>
<figcaption>上：二分查找，T(n) = T(n/2) + c；下：归并排序，T(n) = 2T(n/2) + cn。绿色是真正递归求解的子问题，虚线是被丢掉的一半。</figcaption>
</figure>
<p>两棵树层数一样，差在每层的结点数：二分查找每层 1 个，归并排序第 k 层 2<sup>k</sup> 个。所以把递推式写成主定理（Master Theorem）的形式 T(n) = aT(n/b) + f(n)，看 a 就行（见 1.9）：</p>
<div class="callout key" data-label="考点">
<p><strong>a = 1（只解一个子问题）是减治；a ≥ 2（几个都要解）是分治。</strong></p>
</div>
<div class="callout note" data-label="注意">
<p>第 6 周讲递推式时，课上把二分查找和分治放在一起讲；期末复习课的分类把它列入减治。配对题按复习课答：<strong>二分查找 → 减治</strong>。</p>
</div>

<h2>补充：分治的三步</h2>
<p>课上把分治写成<strong>拆分（split）、求解（solve）、合并（join）</strong>三步，不同算法力气花在不同地方：</p>
<table>
<thead><tr><th>算法</th><th>拆分</th><th>求解</th><th>合并</th></tr></thead>
<tbody>
<tr><td>快速排序（quicksort）</td><td>partition：比 pivot 小的放左、大的放右，O(n)</td><td>两边都递归</td><td>无</td></tr>
<tr><td>归并排序</td><td>从中间切开，O(1)</td><td>两半都递归</td><td>merge 两个有序半段，O(n)</td></tr>
<tr><td>最近点对（分治版）</td><td>按 x 坐标从中线切开</td><td>两半都递归</td><td>检查中线附近的带状区，O(n)</td></tr>
</tbody>
</table>
<p>所以<strong>快速排序“难分易合”</strong>：partition 完 pivot 已在最终位置，两边排好就结束；<strong>归并排序“易分难合”</strong>：活全在 merge 里。另外，分治本身不保证更快：排序能从 n² 降到 n log n，是因为层数降到了 log₂ n、每层只花线性时间。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/2Rr2tW9zvRg" title="2 Divide And Conquer" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《2 Divide And Conquer》（英文），讲分治的一般步骤：拆成同类的小问题、递归求解、再合并。他按多数教材把二分查找算作分治，本课期末按减治答。</p>

<h2>补充：贪心对不对，要看证明</h2>
<p>排档期问题（见 1.1）里“每次挑结束最早的”能选出最多的工作，这是<strong>区间调度（interval scheduling）</strong>。课上另外两个贪心：</p>
<ul>
  <li><strong>Dijkstra</strong>：每轮取出暂定距离最小的顶点，永久确定。边权非负时正确。对每个顶点各跑一次求全源最短路，也算贪心。</li>
  <li><strong>Prim</strong>：每轮加入连接树内、树外顶点的最便宜的边，得到最小生成树（minimum spanning tree, MST）。</li>
</ul>
<p>局部最优不一定带来全局最优。<strong>说贪心对要靠证明，说它错只需一个反例。</strong>比如面额 {1, 3, 4} 凑 6，规则是“每次拿不超过余额的最大面额”：拿 4、1、1 共 3 枚，可 3 + 3 只要 2 枚。</p>
<div class="callout warn" data-label="易错">
<p>选择排序每轮也“挑最小”，但课上归入<strong>减治</strong>：最小值本来就必须放最前，这一步不会挑错，只是让规模减一。贪心是在几个可行方案里押一个，可能押错。</p>
</div>

<h3>按解的类型分类</h3>
<p>另一个分类角度看结果有多好，和用哪种思路无关：</p>
<ul>
  <li><strong>精确（exact）</strong>：保证最优。如最早结束优先、边权非负的 Dijkstra。</li>
  <li><strong>近似（approximate）</strong>：不一定最优，但差距有可证明的界，如路线保证不超过最短的 2 倍。</li>
  <li><strong>启发式（heuristic）</strong>：答案看着合理，没有任何保证。如“最早开始优先”：最先开始的若是一份覆盖全程的长工作，会挡掉其余 n−1 份。上面的硬币规则也是。</li>
  <li><strong>随时（anytime）</strong>：随时能交出有效答案，算得越久越好。</li>
</ul>

<h2>考试怎么考</h2>
<ul>
  <li><strong>配对 / 选择题（最常见）</strong>：算法连思路。四种思路的课上例子要背，公式表上没有。</li>
  <li><strong>简答</strong>：减治和分治的区别，各举一例；快排和归并在拆分、合并上的差别。</li>
  <li><strong>读代码</strong>：数递归调用几次、规模多大，写递推式，判断思路和复杂度。</li>
  <li><strong>贪心</strong>：举反例说明某条贪心规则不是最优。</li>
</ul>

<h3>例题 1：配对</h3>
<p>把每个算法归入蛮力、减治、分治、贪心之一：(a) 插入排序 (b) 归并排序 (c) Prim (d) 在无序链表里找一个键 (e) 二分查找 (f) 逐对计算距离求最近点对 (g) 快速排序 (h) 拓扑排序（删源点法）(i) 区间调度：每次选结束最早的 (j) Dijkstra (k) 选择排序。</p>
<table>
<thead><tr><th>思路</th><th>算法</th><th>理由</th></tr></thead>
<tbody>
<tr><td>蛮力</td><td>(d) (f)</td><td>逐个元素、逐对点检查全部候选</td></tr>
<tr><td>减治</td><td>(a) (e) (h) (k)</td><td>每步只剩一个更小的问题：n−1 个元素、一半区间、V−1 个顶点</td></tr>
<tr><td>分治</td><td>(b) (g)</td><td>拆成两部分，都要递归</td></tr>
<tr><td>贪心</td><td>(c) (i) (j)</td><td>每步选局部最优、不撤销：最便宜的边、最早结束的工作、距离最小的顶点</td></tr>
</tbody>
</table>
<p>陷阱是 (e) 二分查找和 (k) 选择排序，都是减治。</p>

<h3>例题 2：读代码</h3>
<p>两个函数都算 xⁿ（n ≥ 0）。写出递推式和 Θ，说明属于哪种思路，并算 n = 16 时各被调用几次。</p>
<pre><code>long power_a(long x, int n) {          /* 版本 A */
    if (n == 0) return 1;
    long half = power_a(x, n / 2);
    if (n % 2 == 0) return half * half;
    return half * half * x;
}

long power_b(long x, int n) {          /* 版本 B */
    if (n == 0) return 1;
    if (n % 2 == 0) return power_b(x, n / 2) * power_b(x, n / 2);
    return power_b(x, n / 2) * power_b(x, n / 2) * x;
}</code></pre>
<p>逐行看：两个函数各自的第 2 行是基本情况（base case），x⁰ = 1。A 的第 3 行递归算出 x<sup>⌊n/2⌋</sup> 存进 <code>half</code>，第 4、5 行按 n 的奇偶返回 half² 或 half²·x。B 算的是同一个东西，但不存结果，把 <code>power_b(x, n / 2)</code> 调了两遍。</p>
<p><strong>A</strong>：调用自己一次，规模减半。T(n) = T(n/2) + c，a = 1，b = 2，d = 0，a = b<sup>d</sup>，<strong>Θ(log n)</strong>，是<strong>减治</strong>。n = 16 时调用链是 16、8、4、2、1、0，共 <strong>6 次</strong>。</p>
<p><strong>B</strong>：调用自己两次，规模各 n/2。T(n) = 2T(n/2) + c，a = 2 &gt; b<sup>d</sup> = 1，<strong>Θ(n<sup>log₂ 2</sup>) = Θ(n)</strong>，形式上是<strong>分治</strong>。调用次数 C(0) = 1，C(n) = 1 + 2C(⌊n/2⌋)，依次 C(1) = 3，C(2) = 7，C(4) = 15，C(8) = 31，C(16) = <strong>63 次</strong>。两个子问题完全相同却算了两遍，分治反而更慢。</p>
<div class="callout warn" data-label="易错">
<ul>
  <li>快速排序最坏 T(n) = T(n−1) + cn，和选择排序一样，但它仍是分治：看算法怎么设计，不看某个输入拆得好不好。</li>
  <li>最近点对：逐对比较是蛮力 Θ(n²)，按中线拆开是分治 Θ(n log n)。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
  <li><strong>蛮力</strong>：逐个试所有候选（线性查找、逐对最近点对、遍历找元素）。</li>
  <li><strong>减治</strong>：每步只留一个更小的同类问题（插入排序、选择排序、拓扑排序、二分查找）。</li>
  <li><strong>分治</strong>：拆成几块、块块都解、再合并（快速排序、归并排序、最近点对分治版）。</li>
  <li><strong>贪心</strong>：每步挑局部最优、不回头（最早结束优先、Dijkstra、Prim）；说它错只需一个反例。</li>
  <li>减治还是分治，看 T(n) = aT(n/b) + f(n) 的 a：a = 1 是减治，a ≥ 2 是分治。</li>
</ul>
`;
