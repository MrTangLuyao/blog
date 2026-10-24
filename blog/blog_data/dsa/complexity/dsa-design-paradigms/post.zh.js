/* Post body — dsa-design-paradigms / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-design-paradigms:zh'] = `
<p class="lead">设计算法最常用的四种思路是<strong>蛮力（brute force）</strong>、<strong>减治（decrease-and-conquer）</strong>、<strong>分治（divide-and-conquer）</strong>和<strong>贪心（greedy）</strong>。它们的区别在于怎样把问题变小、每一步怎样做决定。给出算法、选出思路，是配对题（matching）的典型考法。</p>

<h2>四种思路一览</h2>
<p>课上从三个角度给算法分类：按任务（排序、查找、遍历、调度、最优化……），按设计思路，按解的类型。期末复习课把设计思路分成下面四种：</p>
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

<h2>蛮力</h2>
<p>在无序数组或链表里找键 42，没有任何顺序可以利用，只能从第一个元素看到最后一个，最坏比较 n 次。<strong>蛮力（brute force）就是把所有可能的候选逐个检查一遍</strong>，不利用问题的结构。只要枚举完整，答案一定对；代价是“候选个数 × 检查一个的代价”，通常很大。</p>
<ul>
  <li><strong>线性查找（linear search）</strong>：候选是 n 个位置，最坏 Θ(n)。</li>
  <li><strong>最近点对（closest pair）</strong>：算出全部 n(n−1)/2 对点的距离再取最小，Θ(n²)（见 1.11 最近点对）。</li>
  <li><strong>遍历找元素</strong>：在普通二叉树（不是 BST）或图里找一个值，只能遍历，把每个结点都访问一遍，O(n) 或 O(V + E)。</li>
  <li>排档期问题试遍全部 2ⁿ 个工作子集，只在 n 很小时可行。</li>
</ul>

<h2>减治</h2>
<p>插入排序要排好 n 个元素：先把前 n−1 个排好，再把第 n 个插到正确位置。“排好前 n−1 个”是同一个问题，只是规模小了 1。选择排序反过来：先找出最小值放到最前面，剩下的 n−1 个再排。</p>
<p><strong>减治（decrease-and-conquer）：每一步做一点工作，把问题变成同类的一个更小的实例，只解这一个，再由它的答案得到原问题的答案。</strong>按缩小的方式分两种：</p>
<table>
<thead><tr><th>缩小方式</th><th>例子</th><th>递推式</th><th>复杂度</th></tr></thead>
<tbody>
<tr><td>减一：n → n−1</td><td>选择排序、插入排序</td><td>T(n) = T(n−1) + cn</td><td>Θ(n²)（插入排序指最坏情况，最好 Θ(n)）</td></tr>
<tr><td>减一：V → V−1</td><td>拓扑排序（删源点法）：输出一个入度为 0 的顶点并删掉它和它的出边，剩下的仍是 DAG</td><td>每个顶点、每条边各处理一次</td><td>O(V + E)</td></tr>
<tr><td>按比例：n → n/2</td><td>二分查找：和中间元素比一次，丢掉一半</td><td>T(n) = T(n/2) + c</td><td>最坏 Θ(log n)</td></tr>
</tbody>
</table>
<p>递推式的解法见 1.8 递推式与展开法。</p>
<div class="callout note" data-label="注意">
<p>第 6 周讲递推式时，课上用二分查找作为“规模按比例缩小”、也就是分治的第一个例子；期末复习课的分类则把它列入<strong>减治</strong>，理由是它只解一半。配对题按复习课答：<strong>二分查找 → 减治</strong>。</p>
</div>

<h2>分治</h2>
<p>归并排序把数组从中间切成两半，两半分别递归排好，再把两个有序半段合并（merge）成一个。两半<strong>都要解</strong>，哪一半都不能丢。</p>
<p><strong>分治（divide-and-conquer）：把问题拆成几个互不重叠、规模约 n/b 的子问题，全部递归解完，再把它们的解合并成原问题的解。</strong>递推式是主定理（Master Theorem）的形式 T(n) = aT(n/b) + f(n)：a 是要解的子问题个数，f(n) 是拆分加合并的非递归代价（见 1.9 主定理）。</p>

<h3>减治还是分治：数要解几个子问题</h3>
<p>二分查找也把数组“分成两半”，区别在下一步：它<strong>只在一半里继续</strong>，另一半直接丢掉；快速排序和归并排序<strong>两半都要解</strong>，解完一半再解另一半。按递推式画成递归树（n = 8，结点里写子问题规模）：</p>
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
<p>两棵树层数相同，差别在每层的结点数：二分查找每层 1 个，归并排序第 k 层 2<sup>k</sup> 个。主定理对 a = 1 也适用（课上就用它解二分查找），所以写成 aT(n/b) + f(n) 后看 a 最直接：<strong>a = 1（只解一个子问题）是减治，a ≥ 2（几个子问题都要解）是分治</strong>。</p>

<h3>拆分、求解、合并</h3>
<p>课上把分治写成三步：<strong>拆分（split）、求解（solve）、合并（join）</strong>。同样是分治，力气花在不同的地方：</p>
<table>
<thead><tr><th>算法</th><th>拆分</th><th>求解</th><th>合并</th><th>递推式</th></tr></thead>
<tbody>
<tr><td>快速排序</td><td>partition：小于 pivot 的放左、大于的放右，O(n)</td><td>两边都递归</td><td>无</td><td>最好情况 2T(n/2) + cn</td></tr>
<tr><td>归并排序</td><td>从中间切开，概念上 O(1)</td><td>两半都递归</td><td>merge 两个有序半段，O(n)</td><td>2T(n/2) + cn</td></tr>
<tr><td>最近点对（分治）</td><td>按 x 坐标从中线切开</td><td>两半都递归，得 d<sub>L</sub>、d<sub>R</sub></td><td>检查中线两侧宽 d 的带状区，O(n)</td><td>2T(n/2) + O(n)</td></tr>
<tr><td>二分查找（对照）</td><td>和中间元素比较，O(1)</td><td><strong>只递归一半</strong></td><td>无</td><td>T(n/2) + c</td></tr>
</tbody>
</table>
<p><strong>快速排序“难分易合”</strong>：partition 之后 pivot 已在最终位置，两边各自排好，整个数组就排好了。<strong>归并排序“易分难合”</strong>：切开不需要比较，排序的工作全在 merge 里。</p>

<h3>代码：调用自己一次还是两次</h3>
<p>三个最小的例子，分别是蛮力、减治、分治。读递归代码时数一数函数调用自己几次、规模变成多少，就能写出递推式。</p>
<pre><code>/* 蛮力：从头到尾逐个检查，最坏 Θ(n) */
int linear_search(const int A[], int n, int key) {
    for (int i = 0; i &lt; n; i++) {
        if (A[i] == key) return i;
    }
    return -1;
}

/* 减治：和中间元素比一次，只在其中一半里继续
   T(n) = T(n/2) + c，最坏 Θ(log n) */
int bin_search(const int A[], int lo, int hi, int key) {
    if (lo &gt; hi) return -1;                  /* 空区间：不存在 */
    int mid = (lo + hi + 1) / 2;             /* 偶数个时取靠右的中间，同课上例子 */
    if (key == A[mid]) return mid;
    if (key &lt; A[mid]) return bin_search(A, lo, mid - 1, key);  /* 只解左半 */
    return bin_search(A, mid + 1, hi, key);                    /* 只解右半 */
}

/* 分治：从中间切开，两半都解，再合并
   T(n) = 2T(n/2) + c，Θ(n) */
int max_dc(const int A[], int lo, int hi) {
    if (lo == hi) return A[lo];              /* 只有一个元素 */
    int mid = (lo + hi) / 2;
    int left = max_dc(A, lo, mid);           /* 解左半 */
    int right = max_dc(A, mid + 1, hi);      /* 解右半 */
    return left &gt; right ? left : right;      /* 合并：O(1) */
}</code></pre>
<p>n = 16 时，max_dc 一共被调用 31 次（2n − 1：16 个叶子加 15 个内部结点），bin_search 最多被调用 6 次（最后一次是空区间）。max_dc 的递推式代入主定理：a = 2，b = 2，d = 0，a &gt; b<sup>d</sup>，结果 Θ(n<sup>log₂ 2</sup>) = Θ(n)，和一个 for 循环一样。<strong>分治本身不保证更快</strong>。排序用分治能从 n² 降到 n log n，是因为每层只花线性时间，而层数从 n 降到了 log₂ n。</p>

<h2>贪心</h2>
<p>排档期问题（见 1.1 什么是算法）的正确做法：每次挑<strong>结束最早</strong>的工作，删掉与它冲突的，重复。每一步只看眼前哪个选择最好，选了就不再改。</p>
<p><strong>贪心（greedy）：用于求最大或最小的最优化问题。逐步构造解，每一步做当前看来最好的选择（局部最优），之后不回头。</strong>贪心通常很快，但局部最优不一定带来全局最优：说它对要靠证明（交换论证、反证法），<strong>说它错只需一个反例</strong>，“最早开始优先”和“最短优先”就是这样被否定的。课上的贪心算法：</p>
<ul>
  <li><strong>区间调度</strong>：每次选结束时间最早的工作，结果最优。</li>
  <li><strong>Dijkstra</strong>：每轮取出暂定距离最小的顶点并永久确定。边权非负时正确，有负权边就会出错。以每个顶点为起点各跑一次 Dijkstra 求全源最短路，也归为贪心。</li>
  <li><strong>Prim</strong>：每轮加入连接“树内顶点”和“树外顶点”的最便宜的边，最后得到最小生成树。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>选择排序每轮也挑最小值，但课上把它归入<strong>减治</strong>。选择排序的“挑最小”不可能选错，最小值本来就必须放在最前面，这一步只是让规模减一。贪心是在几个可行方案里押一个，押错了就得不到最优解。</p>
</div>

<h2>按解的类型分类</h2>
<p>另一个角度看结果有多好，和用哪种思路无关：</p>
<table>
<thead><tr><th>类型</th><th>含义</th><th>例子</th></tr></thead>
<tbody>
<tr><td>精确（exact）</td><td>保证给出正确（最优）的答案</td><td>最早结束优先；边权非负时的 Dijkstra</td></tr>
<tr><td>近似（approximate）</td><td>不一定最优，但与最优解的差距有可证明的界</td><td>保证给出的路线不超过最短路长度的 2 倍</td></tr>
<tr><td>启发式（heuristic）</td><td>给出一个看起来合理的答案，没有任何保证</td><td>最早开始优先</td></tr>
<tr><td>随时（anytime）</td><td>任何时刻都能交出有效答案，算得越久越好</td><td>—</td></tr>
</tbody>
</table>
<p>同样是贪心，“最早开始优先”只是启发式：它总能选出一组互不冲突的工作，但最先开始的若是一份覆盖全程的长工作，就会挡掉其余 n−1 份，结果 1 份对最优的 n−1 份。</p>

<h2>考试怎么考</h2>
<ul>
  <li><strong>配对题 / 选择题（最常见）</strong>：算法和思路连线。<strong>四种思路各自的课上例子要背下来</strong>，公式表上没有。</li>
  <li><strong>简答题</strong>：减治和分治的区别（只解一个子问题 vs 全部都解，各举一例）；快速排序和归并排序在拆分、合并上的差别。</li>
  <li><strong>读代码</strong>：数递归调用的个数和规模，写出递推式，判断思路和复杂度（见 1.8、1.9）。</li>
  <li><strong>贪心的正确性</strong>：给一条贪心规则，举反例说明它不是最优。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
  <li>快速排序最坏情况的递推式 T(n) = T(n−1) + cn 和选择排序一样，但它仍是分治：思路看算法怎么设计（拆成两部分、都要解），不看某个输入下拆得好不好。</li>
  <li>最近点对有两个版本：逐对比较是蛮力 Θ(n²)，按中线拆开是分治 Θ(n log n)。</li>
  <li>“分治一定比蛮力快”是错的，max_dc 仍是 Θ(n)。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 配对：把每个算法归入蛮力、减治、分治、贪心之一。(a) 插入排序 (b) 归并排序 (c) Prim (d) 在无序链表里找一个键 (e) 二分查找 (f) 逐对计算距离求最近点对 (g) 快速排序 (h) 拓扑排序（删源点法）(i) 区间调度：每次选结束最早的 (j) Dijkstra (k) 选择排序</summary>
  <div class="qa__body">
<table>
<thead><tr><th>思路</th><th>算法</th><th>理由</th></tr></thead>
<tbody>
<tr><td>蛮力</td><td>(d) (f)</td><td>逐个元素、逐对点检查全部候选</td></tr>
<tr><td>减治</td><td>(a) (e) (h) (k)</td><td>每步只剩一个更小的实例：n−1 个元素、一半区间、V−1 个顶点</td></tr>
<tr><td>分治</td><td>(b) (g)</td><td>拆成两部分，两部分都要递归</td></tr>
<tr><td>贪心</td><td>(c) (i) (j)</td><td>每步做局部最优的选择且不再撤销：最便宜的边、最早结束的工作、dist 最小的顶点</td></tr>
</tbody>
</table>
<p>陷阱是 (e) 和 (k)：二分查找只解一半；选择排序的“挑最小”不是押注式的选择。两者都是减治。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 下面两个函数都计算 xⁿ（n ≥ 0）。分别写出递推式和 Θ，说明各属哪种思路，并算出 n = 16 时各自被调用多少次。</summary>
  <div class="qa__body">
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
<p><strong>版本 A</strong>：只调用自己一次，规模减半，其余是常数次乘法。T(n) = T(n/2) + c，a = 1，b = 2，d = 0，a = b<sup>d</sup>，<strong>Θ(log n)</strong>。只解一个子问题，是<strong>减治</strong>（按比例缩小）。n = 16 时调用链是 n = 16、8、4、2、1、0，共 <strong>6 次</strong>。</p>
<p><strong>版本 B</strong>：调用自己两次，每次规模 n/2。T(n) = 2T(n/2) + c，a = 2 &gt; b<sup>d</sup> = 1，<strong>Θ(n<sup>log₂ 2</sup>) = Θ(n)</strong>。形式上是<strong>分治</strong>。调用次数 C(0) = 1，C(n) = 1 + 2C(⌊n/2⌋)：C(1) = 3，C(2) = 7，C(4) = 15，C(8) = 31，C(16) = <strong>63 次</strong>。</p>
<p>B 慢的原因：两个子问题完全相同，同一个值被重复计算，和朴素递归求斐波那契一样。A 把结果存进 <code>half</code> 只算一次。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 硬币面额为 {1, 3, 4}，要用最少的硬币凑出金额 6。贪心规则：每次拿不超过剩余金额的最大面额。(a) 贪心给出几枚？(b) 最优是几枚？(c) 这条贪心规则属于哪种解的类型？</summary>
  <div class="qa__body">
<p>(a) 剩 6，拿 4；剩 2，拿 1；剩 1，拿 1。共 <strong>3 枚</strong>（4 + 1 + 1）。</p>
<p>(b) 6 不是一种面额，1 枚不够；3 + 3 = 6，所以最优是 <strong>2 枚</strong>。一个反例就说明这条规则不是精确算法。</p>
<p>(c) 因为有面额 1，它总能凑出一个有效组合，但对一般的面额没有任何质量保证，可以差得任意远：面额 {1, 10, 11} 凑 20，贪心是 11 + 9 × 1 共 10 枚，最优 10 + 10 只要 2 枚。所以它是<strong>启发式</strong>。</p>
  </div>
</details>
`;
