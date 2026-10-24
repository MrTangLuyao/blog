/* Post body — dsa-cheatsheet-structures / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-cheatsheet-structures:zh'] = `
<p class="lead">期末复习课要求能自己填出几张复杂度表：字典（dictionary）的各种实现、栈（stack）与队列（queue）、优先队列（priority queue），外加堆的下标公式。每一格都能用同一个办法推出来：先找位置，再动手改。</p>

<h2>一格怎么填：先找位置，再动手改</h2>
<p>字典就是“按键存、按键取”的结构，有四个操作：find（查找）、insert（插入）、delete（删除），以及 build（从空开始放进 n 个键）。</p>
<p>insert 和 delete 都分两步走。第一步是<strong>定位</strong>：找到这个键，或者找到新键该放的位置。第二步是<strong>修改</strong>：数组要挪元素，链表要改指针，树可能还要旋转。一次操作的代价就是这两步加起来。</p>
<p>算最好、平均、最坏情况（best / average / worst case）时有一条规矩：<strong>两步必须用同一个输入</strong>。你不能拿“这个输入下定位最快”和“那个输入下修改最快”拼成一个最好情况。</p>
<p>课上拿有序数组举例。数组里按顺序放着 10, 20, …, 150，共 n = 15 个键，要在某个已有元素 X 的紧后面插入一个新键。先用二分查找（binary search）找到 X（课上约定：剩偶数个元素时取靠右的那个中间），再把 X 后面的元素各往右挪一格，腾出位置：</p>
<table>
<thead><tr><th>X</th><th>二分比较</th><th>右移</th><th>合计</th></tr></thead>
<tbody>
<tr><td>80（正中）</td><td>1</td><td>7</td><td>8</td></tr>
<tr><td>150（末尾）</td><td>4</td><td>0</td><td><strong>4</strong></td></tr>
<tr><td>10（开头）</td><td>4</td><td>14</td><td>18</td></tr>
</tbody>
</table>
<p>X 在正中时，二分 1 次就找到，可后面还有 7 个元素要挪。X 在末尾时，二分要 4 次，但一个都不用挪。想要“比较 1 次”又“挪 0 次”，X 就得同时在正中和末尾，这不可能，所以最好情况不是 Θ(1) + Θ(1)。</p>
<p>那最好情况在哪？挪元素是 n 级别的贵操作，二分只是 log n 级别。宁可让便宜的一步付满 log n，也要让贵的一步变成 0，所以 X 在末尾附近时合计最小（本例 X = 140、150 都是 4）。因此<strong>有序数组插入的最好情况是 Θ(log n)</strong>。最坏是 X 在开头：二分 log n 次，再挪 n − 1 个，Θ(log n) + Θ(n) = Θ(n)。</p>
<p>还要分清一件事：<strong>Θ 是描述某一种情况的</strong>。有序数组的 find，最好 Θ(1)（第一次就比中），平均和最坏 Θ(log n)。把所有情况放在一起，只能说 find 是 O(log n)、Ω(1)。所以<strong>不说是哪种情况就写“二分查找是 Θ(log n)”是错的</strong>，因为它最好时是 Θ(1)。</p>
<div class="callout note" data-label="注意">
<p>下面几张表都按这些前提算：</p>
<ul>
<li><strong>无序结构的 insert 不查重复键。</strong>位置随便放，不用定位：数组追加在末尾，链表插在表头，拉链法插在链头，所以是 O(1)。如果题目要求先查重，insert 就得先做一次 find，代价是 find 再加 O(1)。</li>
<li><strong>delete 按键删除</strong>，代价里包括先把它找到。</li>
<li><strong>build 指从空字典开始逐个 insert n 次。</strong>如果允许一次拿到全部数据再建，有序数组可以直接排序，O(n log n)。</li>
<li><strong>数组容量够用。</strong>动态数组满了就把容量翻倍，那一次追加要整体复制，最坏 O(n)；但这种情况很少，平摊到每次只有 O(1)，叫均摊（amortised）O(1)（见 2.6）。</li>
<li><strong>哈希表有 n 个键、m 个槽</strong>，装载因子（load factor）α = n/m。“平均”的前提是哈希函数把键均匀打散，而且 m 跟着 n 一起变大，让 α 一直小于某个常数。</li>
</ul>
</div>

<h2>字典：最坏情况</h2>
<p>最坏情况就是“定位走最远、修改挪最多”的那个输入。</p>
<table>
<thead><tr><th>实现</th><th>find</th><th>insert</th><th>delete</th><th>build（n 次 insert）</th><th>空间</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>有序数组</td><td><strong>O(log n)</strong></td><td>O(n)</td><td>O(n)</td><td><strong>O(n²)</strong></td><td>O(n)</td></tr>
<tr><td>无序链表</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>有序链表</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n²)</td><td>O(n)</td></tr>
<tr><td>BST</td><td><strong>O(n)</strong></td><td>O(n)</td><td>O(n)</td><td>O(n²)</td><td>O(n)</td></tr>
<tr><td>AVL 树</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n log n)</td><td>O(n)</td></tr>
<tr><td>2-3 树 / B 树</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n log n)</td><td>O(n)</td></tr>
<tr><td>哈希表：拉链法</td><td><strong>O(n)</strong></td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(m + n)</td></tr>
<tr><td>哈希表：开放寻址</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n²)</td><td>O(m)，m &gt; n</td></tr>
</tbody>
</table>
<p>前四行最好推。无序的数组和链表：查找只能从头扫到尾，O(n)；插入随便放，O(1)；删除得先找到，O(n)。</p>
<p>有序数组能二分，所以 find 是 O(log n)；但插入、删除要挪元素，O(n)。build 是 n 次 O(n) 的插入：最坏时第 i 次要挪 i − 1 个，0 + 1 + … + (n − 1) ≈ n²/2，所以 O(n²)。</p>
<p>有序链表虽然有序，却没法跳到中间，二分用不上，查找只能一个个走，O(n)；插入先走到位置 O(n)，接上结点只要 O(1)。</p>
<p>下面几格最容易答错：</p>
<ul>
<li><strong>二叉搜索树（Binary Search Tree, BST）最坏 O(n)。</strong>为什么？键按升序插入时，每个新键都比前面的大，全挂在右边，树退化成一条链，查找要走 n 步。所以题目只说“BST”就答 O(n)，写明平衡（balanced）才答 O(log n)。</li>
<li><strong>B 树不改变复杂度类。</strong>m 阶 B 树（B-tree）每个结点有很多孩子，层数约 log<sub>m</sub> n。可 log<sub>m</sub> n = log₂ n / log₂ m，和 log₂ n 只差常数倍，结点内部还要比较几次，所以仍是 O(log n)。B 树省下的是读磁盘块、跟指针的次数（见 3.8）。2-3 树就是 3 阶 B 树。两者的删除课上没有展开，代价同样受树高限制。</li>
<li><strong>哈希表的 O(1) 只是平均。</strong>运气最坏时，所有键都落进同一个槽。拉链法（separate chaining）那条链长 n，查找要走完整条链；开放寻址（open addressing）要一格格探过整段被占的格子。两种都是 O(n)。</li>
<li><strong>哈希表插入，两种解决冲突的办法不一样。</strong>往已有 m − 1 个键的表再插一个：拉链法算出槽号后直接插在链头，不管链多长，O(1)；线性探测（linear probing）最坏要探过 m − 1 个被占的格子才碰到唯一的空位，O(m)。如果拉链法的每个桶换成平衡 BST，查找最坏降到 O(log n)。</li>
<li><strong>哈希表的短板是空间和顺序。</strong>开放寻址的槽必须比键多，拉链法的槽数和键数同阶，空槽也占内存。而且键在表里是打乱的，按顺序输出、找最小、范围查询，都只能扫完 m 个槽再排序。需要按顺序走时用 AVL 树或 B 树，8.1 订单簿存价位用平衡树就是这个原因。</li>
<li><strong>伸展树（splay tree，见 3.9）</strong>单次操作最坏 O(n)，但任意 m 次操作合计 O(m log n)，均摊每次 O(log n)。原因是它每次把访问到的结点转到根，一次走得很深的操作会让这条路径上的结点深度大约减半，后面的操作就快了。</li>
</ul>

<h2>字典：最好与平均情况</h2>
<p>最好情况通常是“要找的键第一个就碰到”，所以 find 的最好几乎都是 Θ(1)。真正要想的是 insert、delete 和 build 这几列。</p>
<table>
<thead><tr><th>实现</th><th>find（最好 / 平均）</th><th>insert</th><th>delete</th><th>build</th></tr></thead>
<tbody>
<tr><td>无序数组</td><td>Θ(1) / Θ(n)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(n)</td><td>Θ(n) / Θ(n)</td></tr>
<tr><td>有序数组</td><td>Θ(1) / Θ(log n)</td><td><strong>Θ(log n)</strong> / Θ(n)</td><td>Θ(log n) / Θ(n)</td><td>Θ(n log n) / Θ(n²)</td></tr>
<tr><td>无序链表</td><td>Θ(1) / Θ(n)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(n)</td><td>Θ(n) / Θ(n)</td></tr>
<tr><td>有序链表</td><td>Θ(1) / Θ(n)</td><td><strong>Θ(1)</strong> / Θ(n)</td><td>Θ(1) / Θ(n)</td><td>Θ(n) / Θ(n²)</td></tr>
<tr><td>BST</td><td>Θ(1) / Θ(log n)</td><td>Θ(1) / Θ(log n)</td><td>Θ(1) / Θ(log n)</td><td>Θ(n log n) / Θ(n log n)</td></tr>
<tr><td>AVL 树</td><td>Θ(1) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(n log n) / Θ(n log n)</td></tr>
<tr><td>2-3 树 / B 树</td><td>Θ(1) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(log n) / Θ(log n)</td><td>Θ(n log n) / Θ(n log n)</td></tr>
<tr><td>哈希表：拉链法</td><td>Θ(1) / Θ(1 + α)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(1 + α)</td><td>Θ(n) / Θ(n)</td></tr>
<tr><td>哈希表：开放寻址</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(1)</td><td>Θ(1) / Θ(1)</td><td>Θ(n) / Θ(n)</td></tr>
</tbody>
</table>
<ul>
<li><strong>有序数组的 insert、delete，最好是 Θ(log n)。</strong>就是开头那个例子：最好情况在末尾，二分付满 log n，但一个都不用挪。链表正好反过来，最好情况在表头：走 1 步就到，改指针 Θ(1)。所以同一道“在 X 后面插入”，有序数组最好 Θ(log n)，链表最好 Θ(1)。</li>
<li><strong>无序数组按键删除，最好 Θ(1)。</strong>找到之后，把末尾元素搬进这个空位就行，不用整体挪；键恰好在第一格时，总共常数步。如果要求保持原来的顺序、只能挪，情况就变了：键在下标 k，要比较 k + 1 次才找到，再把后面 n − 1 − k 个各左移一格，合计恒为 n，Θ(n)。为什么恒为 n？找得越快，后面要挪的就越多，两边正好互补。</li>
<li><strong>BST 的最好情况</strong>：要找的键就在根上，比较 1 次。树是一条链时，在根旁边插入或删掉根，也只要常数步。平均 Θ(log n) 指键按随机顺序插入，这时结点的平均深度是 O(log n)。</li>
<li><strong>AVL 树、2-3 树的 insert、delete，最好也是 Θ(log n)。</strong>为什么不是 Θ(1)？插入新键必须一直走到空位（AVL）或叶子（2-3 树），而平衡树没有“很浅的空位”：2-3 树的叶子全在同一层，AVL 树最浅的空位也至少在约一半树高处。删除也要走到叶子或后继（successor）。走完还要沿原路往回更新高度、旋转或分裂。</li>
<li><strong>build 的最好情况，看键到达的顺序。</strong>有序数组：键升序到达，每个新键都放在末尾，从不挪，只剩 n 次二分，Θ(n log n)。升序的有序链表：键降序到达，每个新键都是当前最小，插在表头，Θ(n)。BST：不管什么顺序都是 Ω(n log n)，因为插入一个键要走过它的所有祖先，总代价至少是所有结点的深度之和；二叉树第 k 层最多放 2<sup>k</sup> 个结点，放 n 个结点时超过一半的结点深度至少约 log₂ n − 1，深度之和就是 n log n 量级。</li>
<li><strong>开放寻址的平均探测次数，就是公式表上的插入估计</strong>：双重哈希（double hashing）约 1/(1 − α)，线性探测约 1/(1 − α)²。α = 0.5 时是 2 和 4，α = 0.9 时是 10 和 100。只要 α 固定在 1 以下，它们都是常数，所以平均 Θ(1)；但 α 越接近 1 越糟，线性探测尤其明显。拉链法平均比较约 1 + α 次（算出槽号，再沿链平均走 α 个），α 可以大于 1。</li>
</ul>

<h2>栈与队列</h2>
<p>栈是后进先出（LIFO），队列是先进先出（FIFO）。判断它们的复杂度只看一件事：“进”和“出”各发生在哪一端，那一端在数组里要不要挪元素，在单向链表里要不要找前一个结点（前驱，predecessor）。</p>
<p>期末复习课按队头放在哪一端来区分两种摆法：数组 <strong>forward</strong> 指队头在数组开头（下标 0），<strong>backward</strong> 指队头在数组末尾；链表的 forward / backward 指队头在表头还是表尾。</p>
<table>
<thead><tr><th>队列的实现</th><th>enqueue</th><th>dequeue</th><th>原因</th></tr></thead>
<tbody>
<tr><td>数组 forward（队头在下标 0）</td><td>O(1)</td><td>O(n)</td><td>出队后其余元素左移</td></tr>
<tr><td>数组 backward（队头在末尾）</td><td>O(n)</td><td>O(1)</td><td>入队插到下标 0，整体右移</td></tr>
<tr><td><strong>循环数组</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>head、tail 取模前进</td></tr>
<tr><td><strong>链表 forward，有 tail</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>表尾进、表头出</td></tr>
<tr><td>链表 forward，没有 tail</td><td>O(n)</td><td>O(1)</td><td>入队先走到表尾</td></tr>
<tr><td>单向链表 backward</td><td>O(1)</td><td>O(n)</td><td>表头进、表尾出，删尾要找前驱</td></tr>
<tr><td>双向链表 backward</td><td>O(1)</td><td>O(1)</td><td>前驱就是 prev</td></tr>
</tbody>
</table>
<ul>
<li><strong>数组 forward 和 backward</strong>：forward 出队拿走 a[0]，后面的元素都要左移一格补上，dequeue O(n)。backward 反过来，出队拿末尾很便宜，但入队要插到下标 0，所有元素右移，enqueue O(n)。两种摆法只是把 O(n) 从一个操作挪到了另一个操作。</li>
<li><strong>循环数组（circular array）</strong>：干脆不挪元素，只用 head、tail 两个下标记住队头和队尾，走到数组末尾就绕回 0（取模），两个操作都 O(1)。为什么要绕回？如果 forward 出队时只把 head 加 1、不左移，两个操作也是 O(1)，可前面用过的格子就永远浪费了，绕回来才能重新用上。另外 head == tail 既可能是空也可能是满，要另存一个 count，或者永远留一个空位（见 2.7）。</li>
<li><strong>链表 forward 有 tail</strong>：入队时 tail 直接接上新结点，出队时 head 往后挪一个，都 O(1)。没有 tail 的话，每次入队都要从头走到尾，O(n)。</li>
<li><strong>单向链表 backward 删尾要 O(n)</strong>：删掉尾结点，得把它前一个结点的 next 改成 NULL，而单向链表找前一个结点只能从头走。<strong>有 tail 指针也没用</strong>，tail 指向的是尾结点本身，缺的是它的前驱。双向链表每个结点都有 prev，前驱直接拿到，所以 O(1)。</li>
</ul>
<table>
<thead><tr><th>栈的实现</th><th>push</th><th>pop</th><th>原因</th></tr></thead>
<tbody>
<tr><td><strong>数组，栈顶在末尾</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>只动 a[n−1]</td></tr>
<tr><td>数组，栈顶在下标 0</td><td>O(n)</td><td>O(n)</td><td>每次整体移位</td></tr>
<tr><td><strong>链表，栈顶在表头</strong></td><td><strong>O(1)</strong></td><td><strong>O(1)</strong></td><td>头插、删表头</td></tr>
<tr><td>单向链表，栈顶在表尾（有 tail）</td><td>O(1)</td><td>O(n)</td><td>删尾要找前驱</td></tr>
</tbody>
</table>
<ul>
<li>栈只在一端进出，所以只要让那一端便宜就行：数组把栈顶放在末尾，链表把栈顶放在表头。摆反了，数组每次都要整体移位，单向链表每次 pop 都要找前驱。</li>
<li>peek / top 只是看一眼“出”的那一端，什么都不改。进、出都是 O(1) 的实现，peek 也是 O(1)。空间都是 O(n)，定长数组按容量算。</li>
</ul>

<h2>优先队列</h2>
<p>优先队列每次取出的是最大（或最小）的元素，而不是最早进来的。它是一种抽象数据类型（Abstract Data Type, ADT），只规定能做什么，可以用很多种结构来实现。看这张表同样问两件事：最大的在哪？插入时要不要找位置？</p>
<table>
<thead><tr><th>实现</th><th>insert</th><th>extractMax</th><th>peek</th></tr></thead>
<tbody>
<tr><td>无序数组 / 无序链表</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>有序数组，升序（最大在末尾）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>有序数组，降序（最大在下标 0）</td><td>O(n)</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>有序链表，降序（最大在表头）</td><td>O(n)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td><strong>二叉堆（max-heap）</strong></td><td><strong>O(log n)</strong></td><td><strong>O(log n)</strong></td><td><strong>O(1)</strong></td></tr>
<tr><td>平衡 BST（AVL）</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td></tr>
</tbody>
</table>
<ul>
<li><strong>无序结构</strong>：插入随便放，O(1)；但不知道最大的在哪，取最大、看最大都要扫一遍，O(n)。</li>
<li><strong>有序数组</strong>：插入要找位置再挪，O(n)。最大放末尾时，取走它只是把 n 减 1，O(1)；最大放在下标 0 时，取走后其余元素都要左移，O(n)，和队列 forward 是一个道理。有序链表把最大放表头，删表头 O(1)。</li>
<li><strong>二叉堆（binary heap）</strong>只保证父结点 ≥ 孩子，所以最大的一定在根，peek O(1)。插入时把新键放到最后再往上浮（sift up），取最大时把最后一个元素搬到根再往下沉（sift down），每次最多走一条从根到叶子的路径，O(log n)。<strong>O(1) 的是 peek，不是 extractMax。</strong>insert 最好 Θ(1)：新键不大于父结点时，一次都不用浮。</li>
<li><strong>建堆</strong>：自底向上（bottom-up）建堆 Θ(n)。逐个插入最坏 Θ(n log n)（升序输入，每个新键都要浮到根），最好 Θ(n)（降序输入，每个都不用浮）。</li>
<li><strong>堆里找任意元素是 O(n)。</strong>堆只管父子，兄弟之间、不同子树之间没有顺序，只能一个个看。changeWeight 或删除任意元素，要另外配一张“元素 → 下标”的表，才能做到 O(log n)（见 6.5）。</li>
<li><strong>堆只能直接看到最大值</strong>，不能按大小顺序遍历。要依次看次大、再次大，就用平衡 BST，它的中序遍历本身就是有序的。8.1 订单簿不用堆也是这个原因。</li>
<li><strong>PQ 和排序的关系</strong>：先 n 次 insert 再 n 次 extractMax，其实就是在排序。无序数组相当于选择排序（每次扫出最大），有序数组相当于插入排序（每次插到正确位置），堆相当于堆排序，最坏分别是 Θ(n²)、Θ(n²)、O(n log n)。Dijkstra、Prim 换不同 PQ 后的总复杂度见 8.3。</li>
</ul>

<h2>堆的下标公式</h2>
<p>堆是一棵完全二叉树（complete binary tree），但不用指针，而是存在数组里：从根开始，一层一层、从左到右依次编号。这样父子关系就能直接用下标算出来。<strong>本课约定根放在下标 1</strong>，H[0] 空着不用。</p>
<table>
<thead><tr><th></th><th>根在下标 1（本课）</th><th>根在下标 0</th></tr></thead>
<tbody>
<tr><td>左孩子</td><td><strong>2i</strong></td><td>2i + 1</td></tr>
<tr><td>右孩子</td><td><strong>2i + 1</strong></td><td>2i + 2</td></tr>
<tr><td>父结点</td><td><strong>⌊i/2⌋</strong></td><td>⌊(i − 1)/2⌋</td></tr>
<tr><td>最后一个父结点</td><td>⌊n/2⌋</td><td>⌊n/2⌋ − 1</td></tr>
<tr><td>叶子</td><td>⌊n/2⌋ + 1 … n</td><td>⌊n/2⌋ … n − 1</td></tr>
<tr><td>d 叉堆：i 的孩子</td><td>d·i − d + 2 … d·i + 1</td><td>d·i + 1 … d·i + d</td></tr>
<tr><td>d 叉堆：i 的父结点</td><td>⌊(i + d − 2)/d⌋</td><td>⌊(i − 1)/d⌋</td></tr>
</tbody>
</table>
<p>为什么根在 1 时左孩子是 2i？编号是一个接一个排的：结点 1 到 i − 1 的孩子占掉了位置 2 到 2i − 1，所以轮到 i 时，它的左孩子在 2i，右孩子在 2i + 1。d 叉堆也这样推：前面 i − 1 个结点的孩子占掉 d·(i − 1) 个位置，i 的孩子就从 d·i − d + 2 开始。</p>
<p>写成 C 的宏是这样：</p>
<pre><code>/* max-heap in H[1..n]; H[0] unused (course convention) */
#define PARENT(i) ((i) / 2)
#define LEFT(i)   (2 * (i))
#define RIGHT(i)  (2 * (i) + 1)
/* i is a leaf  &lt;=&gt;  LEFT(i) &gt; n  &lt;=&gt;  i &gt; n / 2 */</code></pre>
<ul>
<li>第 1 行：堆存在 H[1..n]，H[0] 空着，这是本课的约定。</li>
<li><code>PARENT</code>：C 的整数除法自动向下取整，7 / 2 = 3，所以结点 6 和 7 的父结点都是 3。</li>
<li><code>LEFT</code>、<code>RIGHT</code>：直接套公式。<strong>参数外面必须加括号</strong>：要是写成 <code>2 * i</code>，<code>LEFT(k + 1)</code> 会展开成 <code>2 * k + 1</code>，算出来的是 k 的右孩子。</li>
<li>最后一行：i 是叶子，等价于它的左孩子下标已经超过 n，也就等价于 i &gt; n/2。sift down 常用这个条件判断什么时候停。</li>
</ul>
<p>n 个结点的堆有 ⌊log₂ n⌋ + 1 层（n = 10 时 4 层），sift up、sift down 每次最多交换 ⌊log₂ n⌋ 次，堆操作的 O(log n) 就是这么来的。d 叉堆的公式不用硬背，像上面那样现场推，答题时写明根在 0 还是 1。</p>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/HqPJF2L5h9U" title="2.6.3 Heap - Heap Sort - Heapify - Priority Queues" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Abdul Bari《2.6.3 Heap - Heap Sort - Heapify - Priority Queues》（英文）。看开头讲完全二叉树怎么存进数组的那一段就够：他的数组也从下标 1 开始，孩子是 2i、2i + 1，父结点是 ⌊i/2⌋，和本课一致。</p>

<h2>典型题讲解</h2>

<h3>例 1：逐格给出最紧的 Big-O 上界</h3>
<p>题目：(a) 往有 n 项的有序链表插入一项；(b) 在有 n 项、完美平衡的三叉树（每个结点最多 3 个孩子）里查找；(c) 大小为 m、已有 m − 1 项的哈希表再插一项，冲突用拉链法解决，改用线性探测又如何；(d) n 项、m 个槽的哈希表，每个槽挂的是平衡 BST 而不是链表，查找的最坏情况；(e) 在有 n 个元素的二叉最大堆里找最小值。</p>
<p>(a) <strong>O(n)</strong>。插入前要先从表头走到插入位置，最坏走完整个表；接上结点只要 O(1)。</p>
<p>(b) <strong>O(log n)</strong>。完美平衡时大约 log₃ n 层，而 log₃ n = log₂ n / log₂ 3，和 log₂ n 只差常数倍；每个结点里的比较次数也是常数。</p>
<p>(c) 拉链法 <strong>O(1)</strong>：算出槽号后插在链头，不查重，和链有多长无关。线性探测 <strong>O(m)</strong>：最坏时从起始槽往后的 m − 1 个格子全被占，要一路探到唯一的空格。</p>
<p>(d) <strong>O(log n)</strong>。最坏是 n 个键全落进同一个槽，那棵平衡 BST 有 n 个结点，查找 O(log n)。</p>
<p>(e) <strong>O(n)</strong>。最大堆只保证父 ≥ 子，最小值可能在任何一个叶子上。叶子有 ⌈n/2⌉ 个（下标 ⌊n/2⌋ + 1 … n），都得看一遍，所以 Θ(n)。</p>

<h3>例 2：多选，哪些说法正确</h3>
<p>题目：(A) 有序数组上的 find 是 Θ(log n)；(B) 在 BST 中查找是 O(log n)；(C) 有序数组 insert 的最好情况是 Θ(log n)；(D) 把 AVL 树换成 B 树，查找的最坏情况降到更低的复杂度类；(E) 用带 head、tail 指针的单向链表实现队列，表尾入队、表头出队，两个操作都是 O(1)；(F) 二叉堆的 extractMax 是 O(1)；(G) 哈希表查找最坏 O(1)；(H) 逐个插入建立升序链表，最好情况是 Θ(n)。</p>
<p>答案是 <strong>C、E、H</strong>。逐个看：</p>
<ul>
<li>A 错：第一次就比中时是 Θ(1)。应该说 O(log n)，或者说“最坏 Θ(log n)”。</li>
<li>B 错：没说平衡。退化成链时是 O(n)。</li>
<li>C 对：新键比所有键都大时不用挪，但二分要约 log₂ n 次才走到末尾。</li>
<li>D 错：B 树的层数 log<sub>m</sub> n 和 log₂ n 只差常数倍，还是 O(log n)。</li>
<li>E 对：tail 指针让表尾接结点 O(1)，删表头只要改 head。</li>
<li>F 错：extractMax 要 sift down，O(log n)；O(1) 的是 peek。</li>
<li>G 错：平均 O(1)，所有键进同一个槽时是 O(n)。</li>
<li>H 对：键降序到达时，每个新键都是当前最小，插在表头，比较 1 次。</li>
</ul>

<h3>例 3：升序插入，再全部查一遍</h3>
<p>题目：键 1, 2, …, n 按升序逐个插入空字典，然后每个键各 find 一次。用无序数组、有序数组、普通 BST、AVL 树、拉链法哈希表（m 与 n 同阶），总代价各是多少？n = 1000 时，BST 和 AVL 树各比较多少次（每经过一个结点算 1 次）？</p>
<ul>
<li><strong>无序数组 Θ(n²)</strong>：n 次追加共 Θ(n)。但键 i 在下标 i − 1，find 它要比较 i 次，合计 1 + 2 + … + n = n(n + 1)/2。</li>
<li><strong>有序数组 Θ(n log n)</strong>：升序到达，每次都插在末尾，只有二分 Θ(log n)、不用挪；每次 find 也是 O(log n)。n = 1000 时，插入比较 7987 次、移位 0 次，find 比较 8987 次。</li>
<li><strong>BST Θ(n²)</strong>：树退化成一条向右的链。插入第 i 个键比较 i − 1 次，合计 n(n − 1)/2；find 键 i 比较 i 次，合计 n(n + 1)/2；加起来正好 n² 次。n = 1000 时是 10⁶ 次。</li>
<li><strong>AVL 树 Θ(n log n)</strong>：旋转让树高一直保持 O(log n)，n = 1000 时树高 10。插入比较 8977 次，find 8987 次，合计 17964 次，大约是 BST 的 1/56。</li>
<li><strong>哈希表平均 Θ(n)</strong>：每次插入、查找平均 O(1)。最坏是全进一个槽：插入仍是 n 次 O(1)（插链头），但后插的在链头、先插的在链尾，find 键 i 要比较 n − i + 1 次，合计 Θ(n²)。</li>
</ul>
<p>这道题说明了同一种输入顺序对不同结构的影响差别有多大：升序输入对有序数组是最好情况，对普通 BST 却是最坏情况。</p>

<h3>例 4：数组队列，先全进再全出</h3>
<p>题目：用数组实现队列，容量足够。从空队列开始，先 enqueue n 次，再 dequeue n 次。分别用 (a) forward（队头固定在下标 0）、(b) backward（队头在末尾，新元素插到下标 0）、(c) 循环数组，各要移动元素多少次？总代价是多少？</p>
<p>(a) enqueue 写到末尾，不用挪。第 i 次 dequeue 时队里还有 n − i + 1 个元素，取走 a[0] 后其余 n − i 个各左移一格，合计 (n − 1) + (n − 2) + … + 0 = <strong>n(n − 1)/2</strong> 次，总代价 <strong>Θ(n²)</strong>。</p>
<p>(b) 第 i 次 enqueue 时已有 i − 1 个元素，要全部右移一格再写入 a[0]，合计 0 + 1 + … + (n − 1) = <strong>n(n − 1)/2</strong> 次；dequeue 取最后一格，O(1)。总代价也是 <strong>Θ(n²)</strong>。</p>
<p>(c) 只动 head、tail 两个下标，<strong>0 次</strong>移位，2n 次操作各 O(1)，总代价 <strong>Θ(n)</strong>。</p>
<p>n = 4 时，(a)、(b) 各移动 6 次。可见 forward、backward 只是换了个地方付 O(n)，循环数组才真正把它省掉。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>一分题“给出最紧的 Big-O 上界”</strong>：2015、2016 年卷就是逐格问这些表，像例 1。只看答案，自动判分。</li>
<li><strong>“哪个说法错误 / 必然正确”</strong>：考 Θ 和情况的关系、缺前提的说法，像例 2。</li>
<li><strong>最好情况</strong>：在 X 后插入、有序数组插入、逐个插入建有序结构，对同一个输入把两步相加。</li>
<li><strong>匹配</strong>：实现 ↔ 代价，ADT ↔ 实现（优先队列是 ADT，堆是实现它的具体结构）。</li>
<li><strong>设计题</strong>：从场景需要的操作反推结构。只要查找、插入、删除，用哈希表；还要按顺序遍历、找最值或范围查询，用平衡树；只反复取最大，用堆。</li>
</ul>
<p>公式表上只有对数恒等式、等差与等比数列求和、主定理和两个哈希估计 1/(1 − α)、1/(1 − α)²，这几张表本身要记住，记不清时按“定位 + 修改”现场推。最常见的三个错：把 peek 的 O(1) 当成 extractMax 的；把哈希表的平均 O(1) 当成最坏；还没找到位置就说“链表插入 O(1)”。</p>

<h2>小结</h2>
<ul>
<li>每一格都是“定位 + 修改”，而且最好、最坏情况要在<strong>同一个输入</strong>上把两步加起来。有序数组插入最好 Θ(log n)，不是 Θ(1)。</li>
<li>Θ 只描述某一种情况；不说情况时，二分查找要写 O(log n)。</li>
<li>只说 BST 就是最坏 O(n)；哈希表的 O(1) 只是平均，最坏 O(n)；B 树和 AVL 一样是 O(log n)。</li>
<li>队列和栈只看进、出两端：数组怕挪元素，单向链表怕删尾（有 tail 也不行）。循环数组和“表尾进、表头出”的链表两头都 O(1)。</li>
<li>二叉堆 peek O(1)，insert 和 extractMax O(log n)，找任意元素 O(n)；自底向上建堆 Θ(n)。</li>
<li>本课堆的根在下标 1：左孩子 2i，右孩子 2i + 1，父结点 ⌊i/2⌋，叶子是 ⌊n/2⌋ + 1 … n。</li>
</ul>
`;
