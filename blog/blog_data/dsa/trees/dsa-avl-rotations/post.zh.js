/* Post body — dsa-avl-rotations / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-avl-rotations:zh'] = `
<p class="lead">AVL 树插入一个键后，如果某个结点两边的高度差到了 2，就用<strong>旋转（rotation）</strong>把它扶正：LL、RR 转一次，LR、RL 转两次。每次旋转只改几根指针，O(1)，左小右大的顺序不变。</p>

<h2>从一串珠子说起</h2>
<p>3.5 讲过，AVL 树要求<strong>每个结点</strong>左右子树的高度差不超过 1。可插入只管把新键挂到空位，不管平不平衡。</p>
<p>比如空 AVL 树依次插入 3、2、1，得到一条向左的链。3 的左边高 2、右边高 0，不合格。</p>
<p>把它想成线串着、提在手里的三颗珠子。你捏着 3，整串垂下来有三层。改捏中间的 2 往上提，3 和 1 落到两边，只剩两层。线一根没剪，从左往右还是 1、2、3。</p>
<p>旋转做的就是这件事：<strong>换一个结点拎上来当根</strong>。树变矮了，BST 顺序没乱，只动了几根指针。</p>

<h2>旋转是什么</h2>
<p>简单说，旋转就是<strong>让一个孩子顶替它的父亲</strong>：孩子升上去，父亲降下来当它的孩子。左孩子升上去叫<strong>右旋（right rotation）</strong>，右孩子升上去叫<strong>左旋（left rotation）</strong>。刚才把 2 拎上来，就是在 3 处右旋。</p>
<p>插入后修平衡分三步：</p>
<ol>
<li><strong>找结点</strong>：从新结点往根走，一路算<strong>平衡因子（balance factor, BF）= height(左) − height(右)</strong>（本课 height(NULL) = 0、叶子高 1）。<strong>第一个 |BF| = 2 的结点</strong>就是要修的，不一定是根。</li>
<li><strong>认形状</strong>：从它朝新结点往下走两步，两步的方向就是名字：LL、RR、LR、RL。</li>
<li><strong>转</strong>：LL、RR 一路歪到底，是<strong>外侧（outside）</strong>失衡，转 1 次（<strong>单旋转，single rotation</strong>）；LR、RL 拐了个弯，是<strong>内侧（inside）</strong>失衡，转 2 次（<strong>双旋转，double rotation</strong>）。</li>
</ol>

<figure class="fig">
<svg viewBox="0 0 440 360" width="440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LL、RR、LR、RL 四种失衡形状及各结点的平衡因子">
<g stroke="rgba(255,255,255,0.12)" stroke-width="1"><line x1="220" y1="8" x2="220" y2="352"/><line x1="8" y1="180" x2="432" y2="180"/></g>
<g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">
<text x="110" y="28">LL（外侧）</text><text x="330" y="28">RR（外侧）</text>
<text x="110" y="208">LR（内侧）</text><text x="330" y="208">RL（内侧）</text>
</g>
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="135" y1="60" x2="100" y2="108"/><line x1="100" y1="108" x2="65" y2="156"/>
<line x1="305" y1="60" x2="340" y2="108"/><line x1="340" y1="108" x2="375" y2="156"/>
<line x1="135" y1="240" x2="95" y2="288"/><line x1="95" y1="288" x2="130" y2="336"/>
<line x1="305" y1="240" x2="345" y2="288"/><line x1="345" y1="288" x2="310" y2="336"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="100" cy="108" r="16"/><circle cx="65" cy="156" r="16"/>
<circle cx="340" cy="108" r="16"/><circle cx="375" cy="156" r="16"/>
<circle cx="95" cy="288" r="16"/><circle cx="130" cy="336" r="16"/>
<circle cx="345" cy="288" r="16"/><circle cx="310" cy="336" r="16"/>
</g>
<g fill="#343433" stroke="#f87171" stroke-width="2.5">
<circle cx="135" cy="60" r="16"/><circle cx="305" cy="60" r="16"/>
<circle cx="135" cy="240" r="16"/><circle cx="305" cy="240" r="16"/>
</g>
<g fill="#e8e8e8" font-size="15" font-weight="700" text-anchor="middle">
<text x="135" y="65">3</text><text x="100" y="113">2</text><text x="65" y="161">1</text>
<text x="305" y="65">1</text><text x="340" y="113">2</text><text x="375" y="161">3</text>
<text x="135" y="245">3</text><text x="95" y="293">1</text><text x="130" y="341">2</text>
<text x="305" y="245">1</text><text x="345" y="293">3</text><text x="310" y="341">2</text>
</g>
<g font-size="13" font-weight="700">
<text x="159" y="65" fill="#f87171">+2</text><text x="124" y="113" fill="#fbbf24">+1</text><text x="89" y="161" fill="#a1a1a0">0</text>
<text x="281" y="65" fill="#f87171" text-anchor="end">−2</text><text x="316" y="113" fill="#fbbf24" text-anchor="end">−1</text><text x="351" y="161" fill="#a1a1a0" text-anchor="end">0</text>
<text x="159" y="245" fill="#f87171">+2</text><text x="71" y="293" fill="#fbbf24" text-anchor="end">−1</text><text x="154" y="341" fill="#a1a1a0">0</text>
<text x="281" y="245" fill="#f87171" text-anchor="end">−2</text><text x="369" y="293" fill="#fbbf24">+1</text><text x="286" y="341" fill="#a1a1a0" text-anchor="end">0</text>
</g>
</svg>
<figcaption>四种基本失衡。红圈是失衡结点，旁边的数字是 BF。插入顺序分别是 3,2,1 / 1,2,3 / 3,1,2 / 1,3,2。</figcaption>
</figure>

<table>
<thead><tr><th>情况</th><th>新键落在</th><th>BF：失衡结点 / 孩子</th><th>修法</th></tr></thead>
<tbody>
<tr><td>LL</td><td>左孩子的左子树</td><td>+2 / +1</td><td>在失衡结点右旋</td></tr>
<tr><td>RR</td><td>右孩子的右子树</td><td>−2 / −1</td><td>在失衡结点左旋</td></tr>
<tr><td>LR</td><td>左孩子的右子树</td><td>+2 / −1</td><td>先左孩子左旋，再失衡结点右旋</td></tr>
<tr><td>RL</td><td>右孩子的左子树</td><td>−2 / +1</td><td>先右孩子右旋，再失衡结点左旋</td></tr>
</tbody>
</table>

<div class="callout key" data-label="考点">
<p>不画图也能认：<strong>失衡结点和孩子的 BF 同号 → 外侧 → 转 1 次；异号 → 内侧 → 转 2 次。</strong>+2、+1 读作 L（左边重），−2、−1 读作 R。</p>
</div>

<h2>看个例子</h2>

<h3>单旋转：课上的 9、5、1</h3>
<p>课上的例子：9 失衡，左孩子 5，5 的左孩子 1，是 LL。把 5 拎上来：1 还在 5 左边，9 落到 5 右边。</p>
<p>可 5 原来可能有右子树，叫它 Y。9 要占 5 的右边，Y 放哪？交给 9 当左子树：5 升上去后 9 的左边正好空了，Y 里的键都在 5 和 9 之间，放那里合规矩。</p>
<p>一般地，设 k2 失衡，左孩子 k1；X、Y 是 k1 的左、右子树，Z 是 k2 的右子树（三角形是任意子树，可为空）。</p>

<figure class="fig">
<svg viewBox="0 0 520 225" width="520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="在 k2 处右旋：k1 上来，Y 改挂为 k2 的左子树">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="150" y1="40" x2="95" y2="100"/><line x1="150" y1="40" x2="205" y2="80"/><line x1="95" y1="100" x2="60" y2="140"/>
<line x1="380" y1="40" x2="325" y2="80"/><line x1="380" y1="40" x2="435" y2="100"/><line x1="435" y1="100" x2="470" y2="140"/>
</g>
<g stroke="#d97757" stroke-width="2.5"><line x1="95" y1="100" x2="130" y2="140"/><line x1="435" y1="100" x2="400" y2="140"/></g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<polygon points="205,80 181,134 229,134"/><polygon points="60,140 36,194 84,194"/>
<polygon points="325,80 301,134 349,134"/><polygon points="470,140 446,194 494,194"/>
<circle cx="95" cy="100" r="18"/><circle cx="380" cy="40" r="18"/><circle cx="435" cy="100" r="18"/>
</g>
<g fill="rgba(217,119,87,0.25)" stroke="#d97757" stroke-width="2">
<polygon points="130,140 106,194 154,194"/><polygon points="400,140 376,194 424,194"/>
</g>
<circle cx="150" cy="40" r="18" fill="#343433" stroke="#f87171" stroke-width="2.5"/>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="150" y="45">k2</text><text x="95" y="105">k1</text><text x="380" y="45">k1</text><text x="435" y="105">k2</text>
<text x="205" y="120">Z</text><text x="60" y="180">X</text><text x="130" y="180">Y</text>
<text x="325" y="120">X</text><text x="400" y="180">Y</text><text x="470" y="180">Z</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="205" y="152">h</text><text x="60" y="212">h+1</text><text x="130" y="212">h</text>
<text x="325" y="152">h+1</text><text x="400" y="212">h</text><text x="470" y="212">h</text>
<text x="265" y="98">在 k2 右旋</text>
</g>
<line x1="240" y1="110" x2="282" y2="110" stroke="#a1a1a0" stroke-width="2"/>
<polygon points="292,110 281,104 281,116" fill="#a1a1a0"/>
</svg>
<figcaption>在 k2 处右旋。只有 Y（橙色）换了父亲；三角形下面是插入后的子树高度。</figcaption>
</figure>

<p>在 k2 处右旋，一共改三根指针：</p>
<ol>
<li>k1 顶替 k2：k2 的父结点（或根指针）改指 k1。</li>
<li>Y 改挂为 k2 的<strong>左</strong>子树。</li>
<li>k2 成为 k1 的<strong>右</strong>孩子。</li>
</ol>
<p>旋转前后<strong>中序遍历（in-order）</strong>都是 X, k1, Y, k2, Z，所以仍是 BST。</p>
<p>高度也回来了：这棵子树插入前高 h+2，插入后 h+3，旋转后又是 h+2，祖先不受影响。所以<strong>一次插入最多一次单旋转或一次双旋转</strong>，插入仍是 O(log n)；删除则可能一路转到根。</p>
<p><strong>左旋</strong>是镜像，修 RR：右孩子上来，它的左子树交给失衡结点当右子树。一句话记住：<strong>上来的结点把夹在中间的子树交给下去的结点</strong>。</p>

<h3>双旋转：3、1、2</h3>
<p>空树依次插入 3、1、2：1 在 3 左边，2 在 1 右边。BF(3) = +2，BF(1) = −1，异号，是 LR。</p>
<p>照搬右旋把 1 拎上来？2 是夹在中间的子树，交给 3 当左孩子，得到 1 → 右 3 → 左 2，BF(1) = −2，成了 RL。<strong>内侧失衡转一次，只是把弯挪到另一边。</strong></p>
<p>正确做法是先把弯掰直，再拎：</p>
<ol>
<li>先在<strong>孩子</strong> 1 处左旋：2 上来，变成 3 → 2 → 1 的左链，即 LL。</li>
<li>再在<strong>失衡结点</strong> 3 处右旋：2 当根。</li>
</ol>
<p>一般情况（LR）：k3 失衡，左孩子 k1，k1 的右孩子 k2；A 是 k1 的左子树，B、C 是 k2 的左、右子树，D 是 k3 的右子树。</p>

<figure class="fig">
<svg viewBox="0 0 550 245" width="550" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LR 双旋转：k2 升到顶，B 交给 k1，C 交给 k3">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="165" y1="35" x2="100" y2="90"/><line x1="165" y1="35" x2="230" y2="70"/><line x1="100" y1="90" x2="55" y2="125"/>
<line x1="100" y1="90" x2="145" y2="145"/><line x1="145" y1="145" x2="110" y2="185"/><line x1="145" y1="145" x2="180" y2="185"/>
<line x1="430" y1="40" x2="370" y2="100"/><line x1="430" y1="40" x2="490" y2="100"/><line x1="370" y1="100" x2="340" y2="140"/>
<line x1="370" y1="100" x2="400" y2="140"/><line x1="490" y1="100" x2="460" y2="140"/><line x1="490" y1="100" x2="520" y2="140"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<polygon points="230,70 208,120 252,120"/><polygon points="55,125 33,175 77,175"/>
<polygon points="340,140 318,190 362,190"/><polygon points="520,140 498,190 542,190"/>
<circle cx="100" cy="90" r="18"/><circle cx="430" cy="40" r="18"/><circle cx="370" cy="100" r="18"/><circle cx="490" cy="100" r="18"/>
</g>
<circle cx="145" cy="145" r="18" fill="#343433" stroke="#d97757" stroke-width="2.5"/>
<circle cx="165" cy="35" r="18" fill="#343433" stroke="#f87171" stroke-width="2.5"/>
<g fill="rgba(56,189,248,0.22)" stroke="#38bdf8" stroke-width="2">
<polygon points="110,185 88,235 132,235"/><polygon points="400,140 378,190 422,190"/>
</g>
<g fill="rgba(251,191,36,0.22)" stroke="#fbbf24" stroke-width="2">
<polygon points="180,185 158,235 202,235"/><polygon points="460,140 438,190 482,190"/>
</g>
<g fill="#e8e8e8" font-size="14" font-weight="700" text-anchor="middle">
<text x="165" y="40">k3</text><text x="100" y="95">k1</text><text x="145" y="150">k2</text>
<text x="430" y="45">k2</text><text x="370" y="105">k1</text><text x="490" y="105">k3</text>
<text x="230" y="106">D</text><text x="55" y="161">A</text><text x="110" y="221">B</text><text x="180" y="221">C</text>
<text x="340" y="176">A</text><text x="400" y="176">B</text><text x="460" y="176">C</text><text x="520" y="176">D</text>
</g>
<g fill="#a1a1a0" font-size="12" text-anchor="middle">
<text x="291" y="112">先在 k1 左旋</text><text x="291" y="146">再在 k3 右旋</text>
</g>
<line x1="268" y1="125" x2="306" y2="125" stroke="#a1a1a0" stroke-width="2"/>
<polygon points="316,125 305,119 305,131" fill="#a1a1a0"/>
</svg>
<figcaption>LR 双旋转的结果。k2 升到顶，它的左子树 B（蓝）交给 k1，右子树 C（黄）交给 k3。中序始终是 A, k1, B, k2, C, k3, D。</figcaption>
</figure>

<p>RL 是镜像：先在右孩子处右旋（变成 RR），再在失衡结点左旋。</p>

<div class="callout key" data-label="考点">
<p>四种情况结果一样：<strong>失衡结点、孩子、孙子三个键里，居中的当新根</strong>，小的在左、大的在右，其余子树按大小挂回。画完用它检查。</p>
</div>

<h3>完整演练：插入 10, 20, 30, 25, 28, 27</h3>
<p>每插一个键：挂到空位，往回算 BF，在第一个 |BF| = 2 的结点认形状、旋转。</p>
<ul>
<li><strong>10、20</strong>：20 挂在 10 右边，BF(10) = −1。</li>
<li><strong>30</strong>：右链 10 → 20 → 30。BF(10) = −2，右孩子 20 是 −1，<strong>RR</strong>。在 10 左旋，20 当根。</li>
<li><strong>25</strong>：挂在 30 左边。BF(30) = +1，BF(20) = −1，不用转。</li>
<li><strong>28</strong>：挂在 25 右边。往回：BF(25) = −1；BF(30) = +2，第一个失衡；左孩子 25 是 −1，<strong>LR</strong>。根 20 也是 −2，但只修最低的 30：先在 25 左旋，再在 30 右旋，根随之恢复。</li>
<li><strong>27</strong>：挂在 25 右边。往回：BF(25) = −1，BF(28) = +1，BF(20) = 1 − 3 = −2，这次第一个失衡的是根；右孩子 28 是 +1，<strong>RL</strong>。先在 28 右旋（中间那步 BF(25) = −2，不用单独修），再在 20 左旋，25 当根。</li>
</ul>
<pre><code class="lang-text">insert 28 (LR): left at 25, then right at 30
    20               20               20
   /  \\             /  \\             /  \\
  10   30   --&gt;   10    30   --&gt;   10    28
      /                 /                /  \\
    25                28               25    30
      \\              /
       28          25

insert 27 (RL): right at 28, then left at 20
   20               20                     25
  /  \\             /  \\                   /  \\
10    28   --&gt;   10    25        --&gt;    20    28
     /  \\                \\             /     /  \\
   25    30               28         10    27    30
     \\                   /  \\
      27               27    30</code></pre>
<p>六次插入共旋转 5 次：RR 1 次、LR 2 次、RL 2 次。最后的根 25 正是 20、28、25 里居中的键。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-avl-rotations/anims/avl-rotate.html" loading="lazy" style="height: 520px;" title="AVL 插入与旋转"></iframe>
<p class="anim-caption">点“综合”看这组插入，其他按钮是别的序列。红色虚线是要改的指针，绿色是新接上的。</p>

<h2>补充：代码里的旋转</h2>
<p>代码题考的就是旋转那几句指针。结点里多存一个高度 <code>height</code>（叶子 1，NULL 算 0）。下面是右旋，返回子树的新根：</p>
<pre><code>avl_t *rotate_right(avl_t *top) {
    avl_t *up = top-&gt;left;
    top-&gt;left = up-&gt;right;
    up-&gt;right = top;
    update_height(top);
    update_height(up);
    return up;
}</code></pre>
<ul>
<li>第 2 行：<code>top</code> 是失衡结点（图里的 k2），<code>up</code> 是要升上去的左孩子 k1。</li>
<li>第 3 行：把 k1 的右子树 Y 交给 k2 当左子树。</li>
<li>第 4 行：k2 降为 k1 的右孩子。</li>
<li>第 5–6 行：重算高度（1 + 较高的孩子）。<strong>先算下去的 k2，再算 k1</strong>，因为 k1 要用到 k2 的高度。</li>
<li>第 7 行：返回新根。原来指向 <code>top</code> 的指针要接住它，如 <code>t-&gt;left = rotate_right(t-&gt;left);</code>，根变了就 <code>root = …</code>。</li>
</ul>
<p><code>rotate_left</code> 把 left、right 对调。双旋转就是连调两次，LR 是 <code>t-&gt;left = rotate_left(t-&gt;left);</code> 再 <code>return rotate_right(t);</code>。递归插入<strong>返回时自下而上</strong>检查每个结点，最先碰到的就是最低的失衡结点。</p>

<h3>三根指针的写法</h3>
<p>也可能直接给 grandparent、parent、child 三根指针让你写语句。下面是右旋：parent 是 grandparent 的左孩子，child 是 parent 的左孩子，child 上来。</p>
<pre><code>grandparent-&gt;left = child;
parent-&gt;left = child-&gt;right;
child-&gt;right = parent;</code></pre>
<p>第 1 句让 child 顶替 parent 的位置；第 2 句把 child 的右子树交给 parent；第 3 句让 parent 降为 child 的右孩子。</p>
<div class="callout warn" data-label="易错">
<p><strong>第 2 句必须在第 3 句前面</strong>，否则 child 原来的右子树就丢了，parent 的左指针还会指回自己。第 1 句要看 parent 挂在 grandparent 哪一边：右边就改 <code>grandparent-&gt;right</code>；parent 是根就改根指针。</p>
</div>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算画图</strong>：给 4 到 7 个键（如 1 到 7），从空树插起，画出每一步，写明在哪做了哪种旋转。</li>
<li><strong>给树判旋转</strong>：给一棵刚插完的树，问要什么旋转、为什么，再画结果（2016 期末）。理由写出 BF。</li>
<li><strong>选择题</strong>：只给两个 BF，如失衡结点 −2、右孩子 +1，问怎么转。这是 RL：先右孩子右旋，再失衡结点左旋（第 5 周课堂小测）。</li>
<li><strong>写代码</strong>：用三根指针写一次旋转（2015 期末），或写 <code>rotate_left</code> / <code>rotate_right</code>。</li>
</ul>
<p>公式表上没有这些，都要自己记。</p>

<h3>例题 1：给树判旋转</h3>
<p>一棵 AVL 树刚插入 10，还没旋转（左图）。需要什么旋转？为什么？画出结果。</p>
<pre><code class="lang-text">         7                          7
       /   \\                      /   \\
      4     32                   4     12
     /     /  \\                 /     /   \\
    2     12   38    --&gt;       2     8     32
         /  \\                         \\   /  \\
        8    17                       10 17   38
         \\
          10</code></pre>
<p>从 10 往上算：10 高 1；8 高 2，BF = 0 − 1 = −1；12 高 3，BF = 2 − 1 = +1；32 高 4，BF = 3 − 1 = <strong>+2</strong>；7 高 5，BF = 2 − 4 = −2。</p>
<p>根 7 也失衡，但从 10 往上<strong>第一个</strong>失衡的是 32。32 是 +2，左孩子 12 是 +1，同号，<strong>LL</strong>，在 32 处右旋：12 接到 7 的右边，12 的右子树 17 交给 32 当左孩子，32 成为 12 的右孩子（右图）。</p>
<p>检查：8 是 −1，32 是 0，12 是 0，7 是 2 − 3 = −1，4 是 +1，全部合格。32、12、8 里居中的 12 当了新根，对得上。</p>

<h3>例题 2：写旋转的指针</h3>
<p>在左图的 BST 中，在 M 处左旋（M–R 这条边）。(a) 画出结果；(b) 用指向 H、M、R 的指针 grandparent、parent、child 写出 C 语句；(c) 后两句对调会怎样？（2015 期末题型）</p>
<pre><code class="lang-text">        H                         H
      /   \\                     /   \\
     F     M                   F     R
    / \\   / \\       --&gt;       / \\   / \\
   D   G J   R               D   G M   W
            / \\                   / \\
           Q   W                 J   Q</code></pre>
<p>(a) R 上来接到 H 的右边，M 降为 R 的左孩子。R 原来的左子树 Q 夹在 M、R 之间，交给 M 当右孩子（右图）。中序前后都是 D F G H J M Q R W。</p>
<p>(b) M 是 H 的<strong>右</strong>孩子，又是左旋，所以三句是上一节的镜像：</p>
<pre><code>grandparent-&gt;right = child;
parent-&gt;right = child-&gt;left;
child-&gt;left = parent;</code></pre>
<p>(c) 先执行 <code>child-&gt;left = parent</code>，R 就不再指向 Q；再执行 <code>parent-&gt;right = child-&gt;left</code>，M 的右指针指向 M 自己。Q 丢了，树里还出现了环。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>看到根是 ±2 就在根上转。要转的是从新结点往上<strong>第一个</strong>失衡的结点。</li>
<li>内侧失衡只转一次，或者先转失衡结点：只会变成另一种内侧失衡。像 1, 3, 2 先在 1 处左旋，一共要转 3 次。</li>
<li>中间子树忘了搬或挂错边：右旋时它去下去结点的左边，左旋时去右边。</li>
<li>BF 符号：本课左减右，+2 是左边重。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>从新结点往上找<strong>第一个 |BF| = 2 的结点</strong>，只修它；一次插入最多一次单旋转或一次双旋转。</li>
<li>LL +2/+1、RR −2/−1、LR +2/−1、RL −2/+1。同号转 1 次，异号转 2 次。</li>
<li>右旋是左孩子上来，左旋是右孩子上来；中间子树交给下去的结点。</li>
<li>双旋转先转孩子、再转失衡结点；居中的键当根。</li>
<li>旋转只改三根指针，O(1)，中序不变；先更新下去结点的高度，再接住新根。</li>
</ul>
`;
