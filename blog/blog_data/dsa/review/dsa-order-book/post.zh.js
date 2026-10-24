/* Post body — dsa-order-book / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-order-book:zh'] = `
<p class="lead">订单簿（order book）记录一个交易品种在每个价格上挂着多少买单和卖单。按交易所的逐笔消息维护它，要用一张哈希表（订单 id → 订单）加一个按价格排序的结构。第 12 周客座讲座的实测中，O(n) 的有序数组反而比 O(log n) 的 AVL 树快。</p>

<h2>订单簿：由消息重建买卖盘</h2>
<p>做算法交易时，服务器接收交易所（exchange）推送的<strong>行情数据（market data）</strong>，维护本地的市场状态，即订单簿，再由模型决定发出、修改或撤销订单。</p>
<p>讲座用 <strong>L3 行情</strong>：每笔订单的每次变化单独发一条消息，消息只有两种：</p>
<pre><code class="lang-text">add(id, side, price, qty)     新订单：编号、方向、价格、数量
modify(id, side, new_qty)     只改数量，价格不能改
delete                        = modify(id, side, 0)</code></pre>
<p>side 是 <strong>bid（买单）</strong>或 <strong>ask（卖单）</strong>。注意 <strong>modify 消息里没有价格</strong>。</p>
<p>例：收到课上的四笔买单 add(#1, bid, 100, 7)、add(#2, bid, 100, 6)、add(#3, bid, 99, 5)、add(#4, bid, 101, 15)，以及卖单 add(#5, ask, 103, 4)、add(#6, ask, 103, 8)、add(#7, ask, 106, 10)。订单簿显示的是<strong>每个价位（price level）上的总数量</strong>：</p>
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
<p><strong>最优卖价（best ask）是最低的卖价</strong> 103，<strong>最优买价（best bid）是最高的买价</strong> 101，新订单先与对面的最优价成交。之后 modify(#2, bid, 2) 让 100 档变成 7 + 2 = 9；modify(#3, bid, 0) 让 99 档归零，这一档从簿上消失。</p>

<h2>需求：哈希表 + 有序映射</h2>
<ul>
<li><strong>按价格有序</strong>，能从最优价位开始一档档往下遍历（traverse）。</li>
<li><strong>价位稀疏（sparse）</strong>：104、105 没有订单。拿价格直接当数组下标，大部分格子是空的。</li>
<li>买卖两边<strong>各用一套结构</strong>。</li>
<li>modify 只给 id，要凭 id 找回订单的价位和原数量 → <strong>哈希表（hash map）：id → 订单信息</strong>，期望 O(1)。</li>
<li>按价格遍历各档总数量 → <strong>有序映射（sorted map）：价格 → 总数量</strong>。</li>
</ul>
<p><strong>为什么不用堆。</strong>最大堆（max-heap）能 O(1) 看到最高买价，但堆只保证父 ≥ 子。把 99、100、101、96、97 依次插入最大堆（下标从 1 开始），得到 [101, 99, 100, 96, 97]，第二好的 100 在下标 3。要看第二档只能先 extractMax 弹出第一档，看前 k 档就要拆掉 k 个元素。堆只给出最好的一个，不能按顺序遍历。</p>
<p>系统需求里，<strong>吞吐量（throughput）</strong>要跟上消息速度，<strong>功耗预算（power budget）</strong>不能超，<strong>准确性（accuracy）</strong>必须 100%，这些达标即可。要优化的是<strong>延迟（latency）</strong>：处理越快，越早发单。延迟是一个分布：把每条消息的处理时间排序，<strong>P50</strong>（中位数）表示一半消息在这个时间内处理完，<strong>P99</strong> 表示 99% 的消息在这个时间内处理完。P99 远大于 P50，说明有一条长尾（long tail）。</p>

<h2>设计一：哈希表 + AVL 树</h2>
<p>有序映射用平衡 BST，例如 AVL 树（见 3.5、3.6）：<strong>一个结点一个价位</strong>，存价格和总数量。哈希表每项存订单的数量和<strong>指向其价位结点的指针</strong>。</p>
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
<p>结点各自 malloc，旋转只改左右指针、不搬动结点，所以<strong>结点地址稳定</strong>，指针可以一直存着。N 为价位数，哈希表操作按期望 O(1) 计：</p>
<table>
<thead><tr><th>消息</th><th>做法</th><th>代价</th></tr></thead>
<tbody>
<tr><td>add</td><td>放进哈希表；树中按价格查找，有这一档就加总数量，没有就插入新结点并旋转</td><td>O(log N)</td></tr>
<tr><td>modify</td><td>哈希表找到订单，顺着指针改结点的总数量，不用查树</td><td><strong>O(1)</strong></td></tr>
<tr><td>delete</td><td>同 modify，再从哈希表删除；总数量归零就删掉结点，可能旋转</td><td>O(log N)</td></tr>
<tr><td>遍历</td><td>中序遍历；买方从最高价开始，先右后左</td><td>O(N)</td></tr>
</tbody>
</table>
<div class="callout note" data-label="注意">删除有两个孩子的结点时，不能照 3.4 那样把前驱或后继的内容复制过来、再释放它原来的结点，否则指向那个结点的指针会悬空（dangling）。要移动结点本身。</div>

<h2>设计二、三：有序数组</h2>
<p>设计二把价位存进有序的<strong>动态数组</strong>（见 2.6），最优价在下标 0。增删价位要移动元素，扩容会整块换地址，所以<strong>不能存指向元素的指针</strong>，哈希表改存订单的价格和数量。每条消息都从下标 0 线性扫描找价位，增删价位还要移动其后的所有元素，全是 <strong>O(n)</strong>，实测却比设计一快。</p>
<p>设计三利用数据的规律：<strong>绝大多数更新发生在最优价附近</strong>。把数组反过来，<strong>最优价放在末尾</strong>，在最优价旁增删一档只移动末尾几个元素；遍历从末尾往前走。上面的三档买单（空格是动态数组多余的容量）：</p>
<pre><code class="lang-text">设计二  [101|15] [100|13] [ 99| 5] [   ] [   ]    下标 0 是最优
设计三  [ 99| 5] [100|13] [101|15] [   ] [   ]    末尾是最优</code></pre>
<p>来了新的最优买价 102：设计二要右移 3 个元素，设计三直接写进末尾的空位。最坏仍是 O(n)，典型情况却很省。下面是设计三买方一侧的实现；卖方按价格降序存，最低价同样在末尾。</p>
<pre><code>#include &lt;stdio.h&gt;

#define CAP 1024                    /* a real book grows a dynamic array (2.6) */

typedef struct {
    long price;                     /* in ticks, e.g. cents */
    long qty;                       /* total quantity at this price */
} level_t;

typedef struct {
    level_t lv[CAP];                /* ascending price: best bid = lv[n-1] */
    int n;
} levels_t;

/* Add delta (negative = take away) to the bid level at price.
   Returns how many levels had to be shifted.  Assumes n &lt; CAP. */
int bid_update(levels_t *b, long price, long delta) {
    int i = b-&gt;n - 1, moved = 0;
    while (i &gt;= 0 &amp;&amp; b-&gt;lv[i].price &gt; price)    /* walk down from the best */
        i--;
    if (i &gt;= 0 &amp;&amp; b-&gt;lv[i].price == price) {    /* level already exists */
        b-&gt;lv[i].qty += delta;
        if (b-&gt;lv[i].qty == 0) {                /* emptied: close the gap */
            for (int j = i; j &lt; b-&gt;n - 1; j++, moved++)
                b-&gt;lv[j] = b-&gt;lv[j + 1];
            b-&gt;n--;
        }
        return moved;
    }
    for (int j = b-&gt;n; j &gt; i + 1; j--, moved++) /* new level goes to slot i+1 */
        b-&gt;lv[j] = b-&gt;lv[j - 1];
    b-&gt;lv[i + 1].price = price;
    b-&gt;lv[i + 1].qty = delta;
    b-&gt;n++;
    return moved;
}

void print_bids(const levels_t *b) {            /* best first: walk backwards */
    for (int i = b-&gt;n - 1; i &gt;= 0; i--)
        printf("%ld x %ld\\n", b-&gt;lv[i].price, b-&gt;lv[i].qty);
}</code></pre>
<p>扫描和移动的步数都等于目标离末尾的距离。消息处理先查哈希表，modify 要靠它拿到价格和原数量：</p>
<pre><code>typedef struct { long price, qty; } order_t;    /* hash map value */
void hash_put(long id, long price, long qty);   /* 4.4: expected O(1) */
order_t *hash_find(long id);
void hash_remove(long id);

void on_add(levels_t *bids, long id, long price, long qty) {
    hash_put(id, price, qty);
    bid_update(bids, price, qty);
}
void on_modify(levels_t *bids, long id, long new_qty) {
    order_t *o = hash_find(id);                 /* the message has no price */
    bid_update(bids, o-&gt;price, new_qty - o-&gt;qty);
    o-&gt;qty = new_qty;
    if (new_qty == 0)                           /* delete = modify to 0 */
        hash_remove(id);
}</code></pre>
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
<li><strong>扫描很短</strong>：更新多在前几档，从最优价扫几步就停。O(n) 是最坏情况，典型代价只取决于离最优价多远。</li>
<li><strong>缓存局部性（cache locality）</strong>：数组连续存放，下一个元素多半已在 CPU 缓存里；树结点散在堆内存各处，每走一层都可能缓存未命中（cache miss），见 2.5。</li>
<li><strong>常数因子</strong>：树增删价位要 malloc / free 和旋转，数组只是复制几个相邻元素。</li>
</ul>
<p>有序链表、B 树、有序数组上的二分查找也实测过，都比设计三的线性查找慢。哈希表从开放寻址（open addressing）换成拉链法（separate chaining）后，延迟明显变大，与 4.5 的缓存分析一致。</p>
<div class="callout key" data-label="考点">Big-O 只是参考（a guide）。先定需求，再设计实验、测量，按测量结果和数据的访问规律选结构。设计三的 P50 下降而 P99 不变：它改善的是典型情况，最坏仍是 O(n)。</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>只考概念</strong>，不考实现细节和 ns 数字，最可能以选择、多选的形式出现。</li>
<li>常问：为什么是哈希表 + 有序映射；为什么不用堆；为什么树里能存指针而数组里不能；为什么 O(n) 的数组能快过 O(log n) 的树；P50、P99 的含义；开放寻址与拉链法谁快。</li>
<li>背后都是正式考点：堆（6.1）、BST 中序遍历（3.2）、AVL（3.6）、动态数组（2.6）、冲突处理（4.3、4.4）。</li>
</ul>
<div class="callout warn" data-label="易错"><ul>
<li>设计一的 modify 是 O(1)（靠指针），不是 O(log N)。</li>
<li>反转数组没有改变最坏情况，仍是 O(n)。</li>
<li>最优买价是<strong>最高</strong>的买价，最优卖价是<strong>最低</strong>的卖价。</li>
</ul></div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">多选：哪些说法正确？（A）买方用一个最大堆就够了，因为最优买价可以 O(1) 取得。（B）modify 消息不带价格，所以需要以订单 id 为键的哈希表。（C）设计一中 modify 可以 O(1) 完成。（D）设计二的哈希表可以像设计一那样保存指向数组元素的指针。（E）数组反过来存以后，add 的最坏情况变成 O(1)。</summary>
  <div class="qa__body"><p>正确的是 <strong>B、C</strong>。A 错：堆只能直接看到最好的一档，不能按价格顺序遍历。B、C 对：modify 要按 id 从哈希表找回订单，期望 O(1)；设计一再顺着指针改结点的总数量，也是 O(1)。D 错：增删价位会移动元素，扩容会整块搬家，指针会失效。E 错：新价位落在离最优价最远的一端时，仍要移动全部 n 个元素。</p></div>
</details>
<details class="qa">
  <summary class="ripple-surface">设计一的哈希表若只存订单的价格和数量、不存结点指针，add、modify、delete 的代价分别是多少？原设计里的指针为什么不会失效？</summary>
  <div class="qa__body"><p>add 仍是 O(log N)，本来就要在树中查找或插入。<strong>modify 从 O(1) 变成 O(log N)</strong>：拿到价格后还要在树里找价位结点。delete 仍是 O(log N)。</p>
  <p>每个结点单独 malloc，地址在它被删除前不变；增删其他结点和 AVL 旋转只改结点之间的指针，不移动结点本身。前提是删除时不用“复制前驱或后继、释放它原来的结点”的写法。</p></div>
</details>
<details class="qa">
  <summary class="ripple-surface">买方现有价位 95、96、98、99、100、101（101 最优），容量足够。依次发生：(1) 出现新价位 102；(2) 101 这一档清空被删除；(3) 出现新价位 97。设计二（降序，最优在下标 0）和设计三（升序，最优在末尾）每一步各移动几个元素？合计多少？</summary>
  <div class="qa__body"><p>插入时，插入位置及其后的元素各右移一格；删除时，被删位置之后的元素各左移一格。</p>
  <pre><code class="lang-text">            设计二（降序）                 移动   设计三（升序）                 移动
初始        101 100 99 98 96 95                   95 96 98 99 100 101
(1) +102    102 101 100 99 98 96 95         6     95 96 98 99 100 101 102         0
(2) −101    102 100 99 98 96 95             5     95 96 98 99 100 102             1
(3) +97     102 100 99 98 97 96 95          2     95 96 97 98 99 100 102          4</code></pre>
  <p>(2) 设计二中 101 在下标 1，后面 5 个左移；设计三中只有 102 左移。(3) 97 在深处：设计二只移 96、95，设计三要移 98、99、100、102。</p>
  <p>合计：设计二 6 + 5 + 2 = <strong>13</strong>，设计三 0 + 1 + 4 = <strong>5</strong>。第 (3) 步设计三更差，但三次更新有两次在最优价附近，总体设计三占优。</p></div>
</details>
<details class="qa">
  <summary class="ripple-surface">价位已按设计三存放。有人提议把“从末尾线性查找”换成二分查找，理由是 O(log n) 比 O(n) 好。实测反而更慢，为什么？这个改动能减少新增价位时的移动吗？</summary>
  <div class="qa__body"><p>更新大多在最优价附近，目标离末尾的距离 d 通常很小，从末尾线性查找约 d + 1 次比较就停；二分查找从中间开始，目标靠近末尾时要折半约 log₂ n 次才到，而且在数组里来回跳，缓存利用更差。O(n) 是最坏情况，这里的典型代价是 O(d)。</p>
  <p>不能。找到位置后，增删价位仍要移动末尾那 d 个元素，与怎么找到位置无关。</p></div>
</details>
`;
