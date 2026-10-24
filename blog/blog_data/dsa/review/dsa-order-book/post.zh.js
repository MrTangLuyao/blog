/* Post body — dsa-order-book / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-order-book:zh'] = `
<p class="lead">订单簿（order book）记录每个价格上挂着多少买单和卖单。第 12 周客座讲座问：按交易所的消息维护它，用什么数据结构？答案是哈希表加一个按价格排序的结构；而实测中，O(n) 的有序数组跑赢了 O(log n) 的 AVL 树。</p>

<h2>订单簿：由消息重建买卖盘</h2>
<p>把交易所想成集市：买家喊“我出 100，要 7 份”，卖家喊“103，卖 4 份”。这些还没成交的报价按价格排好，就是订单簿。</p>
<p>交易程序看不到交易所的“屏幕”，只能收到一条条<strong>行情数据（market data）</strong>消息，告诉它发生了什么变化。程序要据此在内存里拼出一份同样的订单簿，再决定下单、改单还是撤单。</p>
<p>讲座用 <strong>L3 行情</strong>：每笔订单的每次变化都单独发一条消息。消息只有两种：</p>
<pre><code class="lang-text">add(id, side, price, qty)     新订单：编号、方向、价格、数量
modify(id, side, new_qty)     只改数量，价格不能改
delete                        = modify(id, side, 0)</code></pre>
<p>side 是 <strong>bid（买单）</strong>或 <strong>ask（卖单）</strong>。注意 <strong>modify 消息里没有价格</strong>，只有编号。后面正是这一点逼着你用哈希表。</p>
<p>课上的例子：买单 add(#1, bid, 100, 7)、add(#2, bid, 100, 6)、add(#3, bid, 99, 5)、add(#4, bid, 101, 15)，卖单 add(#5, ask, 103, 4)、add(#6, ask, 103, 8)、add(#7, ask, 106, 10)。订单簿显示的是<strong>每个价位（price level）上的总数量</strong>，同价的订单加在一起：</p>
<figure class="fig"><svg viewBox="0 0 410 232" width="410" xmlns="http://www.w3.org/2000/svg" font-size="13">
<text x="130" y="18" fill="#a1a1a0" font-size="12" text-anchor="end">价格</text>
<text x="145" y="18" fill="#a1a1a0" font-size="12">该价位总数量</text>
<text x="14" y="49" fill="#f87171">卖 ask</text>
<text x="130" y="49" fill="#e8e8e8" text-anchor="end">106</text>
<rect x="145" y="35" width="100" height="18" rx="3" fill="rgba(248,113,113,0.3)" stroke="#f87171"/>
<text x="253" y="49" fill="#e8e8e8">10</text>
<text x="130" y="77" fill="#a1a1a0" font-size="12" text-anchor="end">104、105</text>
<text x="145" y="77" fill="#a1a1a0" font-size="12">无订单</text>
<text x="14" y="105" fill="#f87171">卖 ask</text>
<text x="130" y="105" fill="#e8e8e8" text-anchor="end">103</text>
<rect x="145" y="91" width="120" height="18" rx="3" fill="rgba(248,113,113,0.3)" stroke="#f87171"/>
<text x="273" y="105" fill="#e8e8e8">12</text>
<text x="332" y="105" fill="#fbbf24">← 最优卖价</text>
<text x="130" y="133" fill="#a1a1a0" font-size="12" text-anchor="end">102</text>
<text x="145" y="133" fill="#a1a1a0" font-size="12">无订单</text>
<text x="14" y="161" fill="#4ade80">买 bid</text>
<text x="130" y="161" fill="#e8e8e8" text-anchor="end">101</text>
<rect x="145" y="147" width="150" height="18" rx="3" fill="rgba(74,222,128,0.25)" stroke="#4ade80"/>
<text x="303" y="161" fill="#e8e8e8">15</text>
<text x="332" y="161" fill="#fbbf24">← 最优买价</text>
<text x="14" y="189" fill="#4ade80">买 bid</text>
<text x="130" y="189" fill="#e8e8e8" text-anchor="end">100</text>
<rect x="145" y="175" width="130" height="18" rx="3" fill="rgba(74,222,128,0.25)" stroke="#4ade80"/>
<text x="283" y="189" fill="#e8e8e8">13</text>
<text x="14" y="217" fill="#4ade80">买 bid</text>
<text x="130" y="217" fill="#e8e8e8" text-anchor="end">99</text>
<rect x="145" y="203" width="50" height="18" rx="3" fill="rgba(74,222,128,0.25)" stroke="#4ade80"/>
<text x="203" y="217" fill="#e8e8e8">5</text>
</svg><figcaption>七笔订单汇总成五个价位：103 档是 4 + 8，100 档是 7 + 6。</figcaption></figure>
<p><strong>最优买价（best bid）是最高的买价</strong> 101：卖家当然先卖给出价最高的人。<strong>最优卖价（best ask）是最低的卖价</strong> 103：买家当然先找要价最低的人。所以新订单总是先和对面的最优价成交，程序最关心的也是最优价附近那几档。</p>
<p>再看 modify：modify(#2, bid, 2) 把 #2 从 6 改成 2，100 档变成 7 + 2 = 9。modify(#3, bid, 0) 等于撤单；99 档只有 #3，归零后这一档从簿上消失。</p>

<h2>需求：哈希表 + 有序映射</h2>
<ul>
<li><strong>按价格有序</strong>：程序要从最优价开始一档档往下遍历（traverse），看第二档、第三档……</li>
<li><strong>价位稀疏（sparse）</strong>：102、104、105 没有订单。直接拿价格当数组下标，大部分格子是空的，遍历还要跳过它们。</li>
<li><strong>买卖两边各一套结构</strong>：两边“最优”的方向相反。</li>
<li>modify 只给 id，要凭 id 找回订单的价位和原数量（不知道原数量，就算不出这一档该加减多少）→ <strong>哈希表（hash map）：id → 订单信息</strong>，期望 O(1)。</li>
<li>按价格遍历各档 → <strong>有序映射（sorted map）：价格 → 总数量</strong>。</li>
</ul>
<p>哈希表负责“按编号找订单”，有序映射负责“按价格排队”。下面三种设计哈希表都一样，区别在有序映射怎么实现。</p>

<h3>为什么不用堆</h3>
<p>最大堆（max-heap）能 O(1) 看到最高买价，但堆只保证“父 ≥ 子”，兄弟之间没有顺序。把 99、100、101、96、97 依次插入最大堆（下标从 1 开始），得到 [101, 99, 100, 96, 97]，第二好的 100 排在 99 后面。要看第二档只能先 extractMax 弹出第一档，看前 k 档就要拆掉 k 个元素。堆只能告诉你“最好的是哪个”，不能按顺序遍历。</p>

<h3>怎么算“快”：P50 和 P99</h3>
<p><strong>吞吐量（throughput）</strong>跟得上消息速度、<strong>功耗预算（power budget）</strong>不超、<strong>准确性（accuracy）</strong> 100%，这些达标即可。要压低的是<strong>延迟（latency）</strong>：处理越快，越早发单，越能抢在别人前面。</p>
<p>每条消息耗时不同，延迟是一个分布。<strong>P50</strong>（中位数）表示一半消息在这个时间内处理完，代表“平常多快”；<strong>P99</strong> 表示 99% 的消息在这个时间内处理完，代表“最慢那一小撮多慢”。P99 远大于 P50，就是有长尾（long tail）。</p>

<h2>设计一：哈希表 + AVL 树</h2>
<p>最“教科书”的做法：有序映射用 AVL 树（见 3.5、3.6），<strong>一个结点一个价位</strong>，存价格和总数量。哈希表每项存订单的数量和<strong>指向其价位结点的指针</strong>。</p>
<figure class="fig"><svg viewBox="0 0 450 236" width="450" xmlns="http://www.w3.org/2000/svg" font-size="13">
<defs><marker id="ob-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#d97757"/></marker></defs>
<text x="10" y="16" fill="#a1a1a0" font-size="12">哈希表：id → (qty, 价位指针)</text>
<text x="300" y="16" fill="#a1a1a0" font-size="12">AVL 树：一个结点一个价位</text>
<g stroke="rgba(255,255,255,0.35)" fill="none">
<rect x="10" y="28" width="170" height="164"/>
<line x1="10" y1="56" x2="180" y2="56"/><line x1="10" y1="90" x2="180" y2="90"/><line x1="10" y1="124" x2="180" y2="124"/><line x1="10" y1="158" x2="180" y2="158"/>
<line x1="70" y1="28" x2="70" y2="192"/><line x1="120" y1="28" x2="120" y2="192"/>
</g>
<g font-size="12" fill="#a1a1a0" text-anchor="middle"><text x="40" y="47">id</text><text x="95" y="47">qty</text><text x="150" y="47">指针</text></g>
<g fill="#e8e8e8" text-anchor="middle">
<text x="40" y="78">#1</text><text x="95" y="78">7</text>
<text x="40" y="112">#2</text><text x="95" y="112">6</text>
<text x="40" y="146">#3</text><text x="95" y="146">5</text>
<text x="40" y="180">#4</text><text x="95" y="180">15</text>
</g>
<g fill="#d97757"><circle cx="150" cy="73" r="4"/><circle cx="150" cy="107" r="4"/><circle cx="150" cy="141" r="4"/><circle cx="150" cy="175" r="4"/></g>
<g stroke="rgba(255,255,255,0.35)" stroke-width="2"><line x1="336.6" y1="92.3" x2="303.4" y2="147.7"/><line x1="363.4" y1="92.3" x2="396.6" y2="147.7"/></g>
<g stroke="#d97757" stroke-width="1.5" fill="none" marker-end="url(#ob-ah)">
<path d="M154,73 L327,60"/><path d="M154,107 L329,84"/><path d="M154,141 L266,163"/><path d="M154,175 Q290,250 392,188"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2"><circle cx="350" cy="70" r="26"/><circle cx="290" cy="170" r="26"/><circle cx="410" cy="170" r="26"/></g>
<g text-anchor="middle">
<text x="350" y="70" fill="#e8e8e8" font-size="14" font-weight="700">100</text><text x="350" y="85" fill="#a1a1a0" font-size="11">共 13</text>
<text x="290" y="170" fill="#e8e8e8" font-size="14" font-weight="700">99</text><text x="290" y="185" fill="#a1a1a0" font-size="11">共 5</text>
<text x="410" y="170" fill="#e8e8e8" font-size="14" font-weight="700">101</text><text x="410" y="185" fill="#a1a1a0" font-size="11">共 15</text>
</g>
</svg><figcaption>#1、#2 都在 100，指向同一个结点，结点存 7 + 6 = 13。</figcaption></figure>
<p>指针为什么能一直存着？每个结点单独 malloc，旋转和增删别的结点只改左右孩子指针，结点本身不搬家，所以<strong>结点地址稳定</strong>。N 为价位数，哈希表操作按期望 O(1) 算：</p>
<table>
<thead><tr><th>消息</th><th>做法</th><th>代价</th></tr></thead>
<tbody>
<tr><td>add</td><td>放进哈希表；从根往下按价格查找，有这一档就加数量，没有就插入新结点并旋转</td><td>O(log N)</td></tr>
<tr><td>modify</td><td>哈希表找到订单，顺着指针直接改结点的总数量，不用在树里查找</td><td><strong>O(1)</strong></td></tr>
<tr><td>delete</td><td>同 modify，再从哈希表删除；总数量归零就删掉结点，可能旋转</td><td>O(log N)</td></tr>
<tr><td>遍历</td><td>中序遍历是从小到大；买方要从最高价开始，所以先右后左</td><td>O(N)</td></tr>
</tbody>
</table>
<div class="callout note" data-label="注意">删除有两个孩子的结点时，不能照 3.4 那样把前驱或后继的<strong>内容</strong>复制过来、再 free 它原来的结点：哈希表里还有指针指着那个结点，free 之后它们就悬空（dangling）了。要改指针，移动结点本身。</div>

<h2>设计二、三：有序数组</h2>
<p>设计二把价位按价格存进<strong>动态数组</strong>（见 2.6），最优价在下标 0。这时哈希表<strong>不能存指向数组元素的指针</strong>：中间插入一档，后面的元素都挪一格，指针就指错了；扩容时整块内存可能搬到新地址。所以哈希表改存订单的<strong>价格和数量</strong>。</p>
<p>每条消息都要从下标 0 线性扫描找价位，增删价位还要挪动后面所有元素，全是 <strong>O(n)</strong>。按 Big-O 它不如 AVL 树，实测却更快。</p>
<p>设计三利用数据的规律：<strong>绝大多数更新发生在最优价附近</strong>。那就把数组反过来，<strong>最优价放在末尾</strong>：在最优价旁增删一档只挪末尾几个元素，遍历从末尾往前走。上面的三档买单（空格是多余的容量）：</p>
<pre><code class="lang-text">设计二  [101|15] [100|13] [ 99| 5] [   ] [   ]    下标 0 是最优
设计三  [ 99| 5] [100|13] [101|15] [   ] [   ]    末尾是最优</code></pre>
<p>来了新的最优买价 102：设计二要右移 3 个元素腾出下标 0，设计三直接写进末尾的空位。卖方按价格降序存，最低价同样在末尾。</p>
<p>处理 modify 时，先用 id 查哈希表拿到价格和原数量，把“新数量 − 原数量”加到那一档上；这一档归零就从数组删掉，新数量为 0 的订单也从哈希表删掉。无论找位置还是挪元素，步数都约等于目标离末尾几档。最坏仍是 O(n)，典型情况只要几步。</p>
<iframe class="anim-frame" src="blog/blog_data/dsa-order-book/anims/level-shift.html" loading="lazy" style="height: 500px;" title="价位数组：最优价放前面还是后面"></iframe>
<p class="anim-caption">同一串消息同时作用在两种数组上，黄色是要移动的元素。切到“更新在深处”，比较两者的累计移动次数。</p>

<h2>为什么 O(n) 跑赢了 O(log n)</h2>
<p>讲座在真实的比特币行情上测了每条消息的处理时间（数字不考，只看大小关系）：</p>
<table>
<thead><tr><th>设计</th><th>add / modify / delete</th><th>P50</th><th>P99</th></tr></thead>
<tbody>
<tr><td>一：哈希表 + AVL 树</td><td>O(log N) / O(1) / O(log N)</td><td>50 ns</td><td>100 ns，长尾明显</td></tr>
<tr><td>二：有序数组，最优在前</td><td>O(n) / O(n) / O(n)</td><td>40 ns</td><td>70 ns</td></tr>
<tr><td>三：有序数组，最优在后</td><td>O(n) / O(n) / O(n)</td><td>30 ns</td><td>70 ns</td></tr>
</tbody>
</table>
<p>讲座没有解释原因，通常的解释有三点：</p>
<ul>
<li><strong>扫描很短</strong>：更新多在前几档，从最优价扫几步就停。O(n) 是最坏情况，实际代价只看离最优价多远。</li>
<li><strong>缓存局部性（cache locality）</strong>：数组连续存放，读一个元素时旁边几个也进了 CPU 缓存；树结点散在堆内存各处，每走一层都可能缓存未命中（cache miss），见 2.5。</li>
<li><strong>常数因子</strong>：树增删价位要 malloc / free 和旋转，数组只是复制几个相邻元素。</li>
</ul>
<p>有序链表、B 树、有序数组上的二分查找也测过，都比设计三慢。哈希表从开放寻址（open addressing）换成拉链法（separate chaining）后延迟明显变大，原因同样是缓存：拉链法要跳到散落各处的链表结点（见 4.5）。</p>
<p>设计三的 P50 下降而 P99 不变：反过来存只让最优价附近的常见更新变快，最慢的那些更新照样要扫很远、挪很多，最坏仍是 O(n)。</p>
<div class="callout key" data-label="考点">Big-O 只是参考（a guide）。先定需求，再设计实验、测量，按测量结果和数据的访问规律选结构。</div>
<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/sX2nF1fW7kI" title="When Nanoseconds Matter: Ultrafast Trading Systems in C++ - David Gross - CppCon 2024" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：David Gross《When Nanoseconds Matter: Ultrafast Trading Systems in C++》（CppCon 2024，英文），其中一大段讲订单簿：map 还是 vector、二分查找还是线性查找。看 10:25–36:30 就够。视频用 C++ 的 std::map 而不是 AVL 树，数字也和课上不同，以课上为准。</p>

<h2>考试怎么考</h2>
<p><strong>只考概念</strong>，不考实现细节和 ns 数字，多半是选择、多选。常问：为什么是哈希表 + 有序映射、为什么不用堆、为什么树里能存指针而数组里不能、为什么 O(n) 能快过 O(log n)、P50 和 P99 的含义、开放寻址与拉链法谁快。背后的正式考点是堆（6.1）、BST 中序遍历（3.2）、AVL（3.6）、动态数组（2.6）、冲突处理（4.3、4.4）。</p>
<div class="callout warn" data-label="易错"><ul>
<li>设计一的 modify 是 O(1)（靠指针），不是 O(log N)。</li>
<li>反转数组没有改变最坏情况，仍是 O(n)。</li>
<li>最优买价是<strong>最高</strong>的买价，最优卖价是<strong>最低</strong>的卖价。</li>
</ul></div>

<h3>例题 1：多选</h3>
<p>哪些说法正确？（A）买方用一个最大堆就够了，因为最优买价可以 O(1) 取得。（B）modify 消息不带价格，所以需要以订单 id 为键的哈希表。（C）设计一中 modify 可以 O(1) 完成。（D）设计二的哈希表可以像设计一那样保存指向数组元素的指针。（E）数组反过来存以后，add 的最坏情况变成 O(1)。</p>
<p>答案 <strong>B、C</strong>。A 错：堆只能直接看到最好的一档，不能按价格顺序遍历。B 对：modify 只有 id，要靠哈希表找回价格和原数量。C 对：顺着结点指针改数量，不用查树。D 错：增删价位会挪元素，扩容会整块搬家，指针失效。E 错：新价位落在离最优价最远的一端时，仍要挪全部 n 个元素。</p>

<h3>例题 2：设计一不存指针会怎样</h3>
<p>设计一的哈希表若只存价格和数量、不存结点指针，三种消息的代价各是多少？原设计的指针为什么不会失效？</p>
<p>add、delete 不变，仍是 O(log N)，它们本来就要在树里查找。<strong>modify 从 O(1) 变成 O(log N)</strong>：拿到价格后还得从根往下找价位结点。指针不失效，是因为结点单独 malloc，被删之前地址不变，旋转只改结点之间的指针；前提是删除时不用“复制前驱或后继再释放”的写法。</p>

<h3>例题 3：数一数要挪几个元素</h3>
<p>买方现有价位 95、96、98、99、100、101（101 最优），容量足够。依次：(1) 新价位 102；(2) 101 清空被删；(3) 新价位 97。设计二（降序）和设计三（升序）每步各挪几个元素？</p>
<p>插入时，插入位置及其后的元素各右移一格；删除时，被删位置之后的元素各左移一格：</p>
<pre><code class="lang-text">            设计二（降序）                 移动   设计三（升序）                 移动
初始        101 100 99 98 96 95                   95 96 98 99 100 101
(1) +102    102 101 100 99 98 96 95         6     95 96 98 99 100 101 102         0
(2) −101    102 100 99 98 96 95             5     95 96 98 99 100 102             1
(3) +97     102 100 99 98 97 96 95          2     95 96 97 98 99 100 102          4</code></pre>
<p>(2) 设计二中 101 在下标 1，后面 5 个左移；设计三中只有 102 左移。(3) 97 在深处：设计二只挪 96、95，设计三要挪 98、99、100、102。合计设计二 <strong>13</strong>，设计三 <strong>5</strong>。第 (3) 步设计三更差，但三次有两次在最优价附近，总体设计三占优。</p>

<h3>例题 4：换成二分查找会更快吗</h3>
<p>设计三里把“从末尾线性查找”换成二分查找，理由是 O(log n) 比 O(n) 好，实测反而更慢，为什么？能减少新增价位时的移动吗？</p>
<p>设目标离末尾 d 档。更新多在最优价附近，d 通常很小，线性查找约 d + 1 次比较就停；二分查找总从中间开始，要折半约 log₂ n 次才到末尾附近，还在数组里来回跳，缓存利用更差。O(n) 是最坏情况，这里的典型代价是 O(d)。移动不会减少：找到位置后仍要挪末尾那 d 个元素，与怎么找到位置无关。</p>

<h2>小结</h2>
<ul>
<li>订单簿 = 每个价位的总挂单量；最优买价最高、最优卖价最低，更新多在最优价附近。</li>
<li>modify 不带价格 → 哈希表（id → 订单）；按价格遍历 → 有序映射。堆不能按序遍历。</li>
<li>设计一（哈希表 + AVL）：结点地址稳定，能存指针，modify O(1)；删除要移动结点本身。</li>
<li>设计二、三（有序数组）：不能存指针，全是 O(n)；设计三最优价在末尾，典型更新只挪几个元素。</li>
<li>O(n) 的数组跑赢 O(log n) 的树：扫描短、缓存友好、常数小。Big-O 只是参考，要测量。</li>
</ul>
`;
