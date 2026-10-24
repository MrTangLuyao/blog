/* Post body — dsa-avl-rotations / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-avl-rotations:zh'] = `
<p class="lead">AVL 树插入后若某个结点的平衡因子变成 ±2，用<strong>旋转（rotation）</strong>修复：外侧失衡 LL、RR 转一次，内侧失衡 LR、RL 转两次。每次旋转只改三根指针，O(1)，不破坏 BST 顺序。</p>

<h2>从三个结点看四种失衡</h2>
<p>本课程约定 height(NULL) = 0、叶子高度为 1，<strong>平衡因子（balance factor, BF）= height(左子树) − height(右子树)</strong>，<strong>出现 ±2 就是失衡</strong>（见 3.5 平衡与 AVL 条件）。</p>
<p>最小的例子：空 AVL 树依次插入 3、2、1，得到向左的链 3 → 2 → 1。BF(2) = 1 − 0 = +1，BF(3) = 2 − 0 = <strong>+2</strong>，失衡。把中间的 2 提上来当根，1、3 当它的左、右孩子，高度从 3 降回 2，三个 BF 都变成 0。这叫<strong>在 3 处右旋（right rotation）</strong>。</p>
<p>从失衡结点沿插入路径朝新结点走两步，这两步的方向就是失衡的名字：</p>

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
<tr><td>LL</td><td>左孩子的左子树</td><td>+2 / +1</td><td>在失衡结点右旋 1 次</td></tr>
<tr><td>RR</td><td>右孩子的右子树</td><td>−2 / −1</td><td>在失衡结点左旋 1 次</td></tr>
<tr><td>LR</td><td>左孩子的右子树</td><td>+2 / −1</td><td>先在左孩子左旋，再在失衡结点右旋</td></tr>
<tr><td>RL</td><td>右孩子的左子树</td><td>−2 / +1</td><td>先在右孩子右旋，再在失衡结点左旋</td></tr>
</tbody>
</table>

<div class="callout key" data-label="考点">
<p><strong>两个 BF 同号 → 外侧（outside）→ 转 1 次（单旋转，single rotation）；异号 → 内侧（inside）→ 转 2 次（双旋转，double rotation）。</strong>失衡结点 +2 是 L、−2 是 R；孩子 +1 是 L、−1 是 R。</p>
<p>要修的是<strong>从新结点往根走时遇到的第一个 |BF| = 2 的结点</strong>，即最低的失衡结点，不一定是根。</p>
</div>

<h2>单旋转：右旋与左旋</h2>
<p>LL 的一般情况：k2 失衡，左孩子 k1；X、Y 是 k1 的左、右子树，Z 是 k2 的右子树（三角形是任意子树，可为空）。</p>

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
<figcaption>在 k2 处右旋。只有 Y（橙色）换了父亲；三角形下是插入后的子树高度。</figcaption>
</figure>

<p>在 k2 处右旋改三根指针：</p>
<ol>
<li>k1 顶替 k2：k2 的父结点（或根指针）改指 k1。</li>
<li>Y 改挂为 k2 的<strong>左</strong>子树。</li>
<li>k2 成为 k1 的右孩子。</li>
</ol>
<p>Y 的键都在 k1 和 k2 之间，正好放在 k2 的左边。旋转前后中序遍历（in-order）都是 X, k1, Y, k2, Z，<strong>旋转不改变中序序列，结果仍是 BST</strong>。</p>
<p>课上的例子：9 失衡，左孩子 5，5 的左孩子 1。右旋后 5 当根，1 留在 5 左边；9 要当 5 的右孩子，但 5 原来的右子树 Y 占着那里，于是 Y 改挂到 9 的左边。</p>
<p><strong>左旋（left rotation）</strong>是镜像，修 RR：右孩子上来，它原来的<strong>左</strong>子树改挂为失衡结点的<strong>右</strong>子树。口诀：<strong>上来的结点把夹在中间的子树交给下去的结点</strong>。</p>
<p>按图中高度，插入前（X 高 h）k2 高 h+2，旋转后 k1 也高 h+2：<strong>子树高度回到插入前</strong>，祖先不受影响，双旋转同样如此。所以<strong>一次插入最多一次单旋转或一次双旋转</strong>，O(1)，插入总代价仍是 O(log n)；删除则可能一路旋转到根（见 3.4 BST 删除）。旋转后<strong>先更新下去的 k2 的高度，再更新 k1</strong>，因为 k1 取决于 k2。</p>

<h2>双旋转：LR 与 RL</h2>
<p>空树依次插入 3、1、2：3 的左孩子 1，1 的右孩子 2。BF(3) = +2，BF(1) = −1，是 LR。</p>
<p>直接在 3 处右旋，得到 1 → 右 3 → 左 2，BF(1) = −2，变成 RL：<strong>内侧失衡转一次修不好</strong>，单旋转只把夹在中间的 2 搬到另一侧。转错了还能救，但一共要转 3 次（见练习 3）。</p>
<p>正确做法：先在孩子 1 处<strong>左旋</strong>，2 上来，变成 3 → 2 → 1 的左链（LL）；再在 3 处<strong>右旋</strong>，2 成为根。</p>

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
<figcaption>LR 双旋转的结果。k2 升到顶；它的左子树 B（蓝）交给 k1，右子树 C（黄）交给 k3。</figcaption>
</figure>

<p>中序序列始终是 A, k1, B, k2, C, k3, D。<strong>RL</strong> 是镜像：先在右孩子处右旋（变成 RR），再在失衡结点左旋。</p>

<div class="callout key" data-label="考点">
<p>四种情况结果一样：<strong>失衡结点、孩子、孙子三个键中，居中的那个成为子树的新根</strong>，较小的当左孩子、较大的当右孩子，其余子树按大小从左到右挂回。画完图用它检查。</p>
</div>

<h2>完整演练：插入 10, 20, 30, 25, 28, 27</h2>
<p>每插入一个键：挂到空位，往回更新高度和 BF，在第一个 |BF| = 2 的结点判断情况并旋转。</p>
<ul>
<li><strong>10、20</strong>：20 挂在 10 右边，BF(10) = −1。</li>
<li><strong>30</strong>：右链 10 → 20 → 30。BF(10) = −2，右孩子 20 的 BF = −1，<strong>RR</strong>。在 10 左旋，20 成为根。</li>
<li><strong>25</strong>：挂在 30 左边。BF(30) = +1，BF(20) = 1 − 2 = −1，不用旋转。</li>
<li><strong>28</strong>：28 &gt; 20，28 &lt; 30，28 &gt; 25，挂在 25 右边。往回：BF(25) = −1；BF(30) = 2 − 0 = +2，第一个失衡；左孩子 25 的 BF = −1，<strong>LR</strong>。再往上 BF(20) = 1 − 3 = −2 也失衡，但只修最低的 30：先在 25 左旋，再在 30 右旋。子树高度回到 2，BF(20) 回到 −1。</li>
<li><strong>27</strong>：27 &gt; 20，27 &lt; 28，27 &gt; 25，挂在 25 右边。往回：BF(25) = −1；BF(28) = 2 − 1 = +1；BF(20) = 1 − 3 = −2，这次第一个失衡的是根；右孩子 28 的 BF = +1，<strong>RL</strong>。先在 28 右旋（25 上来，27 改挂为 28 的左孩子；这时 BF(25) = −2 只是中间状态，不用单独修），再在 20 左旋，25 成为根。</li>
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
<p>六次插入共旋转 5 次（RR 1 次、LR 2 次、RL 2 次）；最后的根 25 正是 20、28、25 中居中的键。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-avl-rotations/anims/avl-rotate.html" loading="lazy" style="height: 520px;" title="AVL 插入与旋转"></iframe>
<p class="anim-caption">按钮切换 LL、RR、LR、RL 和 1…7 等序列，“BF / 高度”切换结点上的数字；红色虚线是将要改的指针，绿色是新接上的。</p>

<h2>C 代码：返回新子树根的旋转</h2>
<p>结点存高度；旋转函数返回子树的新根，由调用者接回父结点。递归插入<strong>返回时自下而上</strong>对路径上每个结点调用 <code>rebalance</code>，所以最先发现的就是最低的失衡结点。</p>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

typedef struct avl avl_t;
struct avl {
    int key;
    int height;                 /* 叶子 = 1，空树 = 0 */
    avl_t *left, *right;
};

int height(avl_t *t) { return t == NULL ? 0 : t-&gt;height; }
int balance(avl_t *t) { return height(t-&gt;left) - height(t-&gt;right); }
void update_height(avl_t *t) {
    int hl = height(t-&gt;left), hr = height(t-&gt;right);
    t-&gt;height = 1 + (hl &gt; hr ? hl : hr);
}

/* 右旋（修 LL）：左孩子上来，返回这棵子树的新根 */
avl_t *rotate_right(avl_t *top) {
    avl_t *up = top-&gt;left;
    top-&gt;left = up-&gt;right;      /* 中间子树 Y 换父亲 */
    up-&gt;right = top;
    update_height(top);         /* 先更新下去的结点 */
    update_height(up);
    return up;
}

/* 左旋（修 RR）：右孩子上来 */
avl_t *rotate_left(avl_t *top) {
    avl_t *up = top-&gt;right;
    top-&gt;right = up-&gt;left;
    up-&gt;left = top;
    update_height(top);
    update_height(up);
    return up;
}

avl_t *rebalance(avl_t *t) {
    update_height(t);
    if (balance(t) == 2) {                      /* 左边重：LL 或 LR */
        if (balance(t-&gt;left) &lt; 0)               /* LR：先把左孩子左旋成 LL */
            t-&gt;left = rotate_left(t-&gt;left);
        return rotate_right(t);
    }
    if (balance(t) == -2) {                     /* 右边重：RR 或 RL */
        if (balance(t-&gt;right) &gt; 0)              /* RL：先把右孩子右旋成 RR */
            t-&gt;right = rotate_right(t-&gt;right);
        return rotate_left(t);
    }
    return t;                                   /* 没有失衡，原样返回 */
}

avl_t *avl_insert(avl_t *t, int key) {
    if (t == NULL) {                            /* 找到空位：新叶子 */
        avl_t *n = malloc(sizeof(*n));
        assert(n != NULL);
        n-&gt;key = key;
        n-&gt;height = 1;
        n-&gt;left = n-&gt;right = NULL;
        return n;
    }
    if (key &lt; t-&gt;key)
        t-&gt;left = avl_insert(t-&gt;left, key);
    else if (key &gt; t-&gt;key)
        t-&gt;right = avl_insert(t-&gt;right, key);
    else
        return t;                               /* 键已存在，不插入 */
    return rebalance(t);                        /* 返回途中自下而上检查 */
}</code></pre>
<p>调用方式是 <code>root = avl_insert(root, key);</code>，根可能因旋转而改变，必须接住返回值。<code>rebalance</code> 用 <code>balance(t-&gt;left) &lt; 0</code> 区分 LR 和 LL：插入后孩子的 BF 只会是 ±1，删除后还可能是 0，此时单旋转就够（右边同理）。</p>

<h3>用三根指针写一次旋转</h3>
<p>代码题也可能给出三根指针 grandparent、parent、child，要求直接写语句。右旋：parent 是祖父的<strong>左</strong>孩子，child 是 parent 的左孩子，在 parent 处右旋（即对边 parent–child 右旋），child 上来：</p>
<pre><code>grandparent-&gt;left = child;     /* 1. child 顶替 parent 的位置 */
parent-&gt;left = child-&gt;right;   /* 2. child 的右子树交给 parent 当左子树 */
child-&gt;right = parent;         /* 3. parent 降为 child 的右孩子 */</code></pre>
<div class="callout warn" data-label="易错">
<p><strong>第 2 句必须写在第 3 句前面</strong>，否则 child 原来的右子树丢失，parent 的左指针还会指向自己（镜像情况见练习 2(c)）。第 1 句不能漏，且要看 parent 挂在祖父哪一边：右孩子就改 <code>grandparent-&gt;right</code>，parent 是根就改根指针。</p>
</div>
<p>2015 年期末考的是镜像（两处都是右孩子，在 parent 处左旋），见练习 2。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>画图题</strong>：给 4 到 7 个键的插入序列，从空树开始画出每一步，并写明在哪个结点做了哪种旋转。</li>
<li><strong>给树判旋转</strong>：给一棵刚插入完的树，问需要什么旋转、为什么，再画出结果（2016 期末）。理由要写出 BF：失衡结点是几、孩子是几、所以是哪种情况。</li>
<li><strong>代码题</strong>：用 grandparent、parent、child 指针写出一次旋转的语句（2015 期末），或写出返回新根的 <code>rotate_left</code> / <code>rotate_right</code>。</li>
<li><strong>选择题</strong>：给出两个 BF，例如失衡结点 −2、右孩子 +1，问要哪两次旋转、什么顺序（第 5 周课堂小测出过）。</li>
<li><strong>必须背</strong>：BF = h(左) − h(右)；四种 BF 组合；外侧转 1 次、内侧转 2 次；双旋转先转孩子、再转失衡结点；中间子树换父亲；一次插入最多一次单旋转或双旋转。公式表上没有这些内容。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>看到根的 BF 是 ±2 就在根上转。要转的是从新结点往上第一个失衡的结点，它修好后上面自然恢复。</li>
<li>LR、RL 只转一次：结果只是变成了另一种内侧失衡。</li>
<li>双旋转的顺序反了：先在失衡结点上转，白白多转一次。</li>
<li>忘记移动中间子树，或挂错了边：右旋时它去下去结点的左边，左旋时去右边。</li>
<li>BF 的符号：本课程是左减右，+2 表示左边重。高度约定不影响 BF：有的资料叶子高度记 0，两边同减 1，差不变。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 一棵 AVL 树插入 10 之后变成下图（这时还没有旋转）。需要什么旋转？为什么？画出结果。</summary>
<div class="qa__body">
<pre><code class="lang-text">         7
       /   \\
      4     32
     /     /  \\
    2     12   38
         /  \\
        8    17
         \\
          10</code></pre>
<p>从 10 往上算高度和 BF：10 高 1；8 高 2，BF = 0 − 1 = −1；12 高 3，BF = 2 − 1 = +1；32 高 4，BF = 3 − 1 = <strong>+2</strong>；7 高 5，BF = 2 − 4 = −2。</p>
<p>根 7 也失衡，但从新结点往上<strong>第一个</strong>失衡的是 32。32 的 BF 是 +2，左孩子 12 的 BF 是 +1，是 <strong>LL</strong>，在 32 处右旋（即对边 12–32 右旋）：12 接到 7 的右边，12 原来的右子树 17 改挂为 32 的左孩子，32 成为 12 的右孩子。</p>
<pre><code class="lang-text">         7
       /   \\
      4     12
     /     /   \\
    2     8     32
           \\   /  \\
           10 17   38</code></pre>
<p>检查：8 是 −1，32 是 0，12 是 2 − 2 = 0，7 是 2 − 3 = −1，4 是 +1，全部合格，根 7 不用再转。32、12、8 中居中的 12 当了子树的根。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">2. 下面的 BST 中，在 M 处左旋（对边 M–R 左旋）。(a) 画出结果；(b) 用指向 H、M、R 的指针 grandparent、parent、child 写出 C 语句（结点含 char key 和 left、right 指针）；(c) 把后两句顺序对调会怎样？</summary>
<div class="qa__body">
<pre><code class="lang-text">        H
      /   \\
     F     M
    / \\   / \\
   D   G J   R
            / \\
           Q   W</code></pre>
<p>(a) R 上来接到 H 的右边，M 成为 R 的左孩子；R 原来的左子树 Q（M &lt; Q &lt; R）改挂为 M 的右孩子。J、W 不动。</p>
<pre><code class="lang-text">        H
      /   \\
     F     R
    / \\   / \\
   D   G M   W
        / \\
       J   Q</code></pre>
<p>中序遍历前后都是 D F G H J M Q R W，结果仍是 BST。</p>
<p>(b) M 是 H 的右孩子，所以：</p>
<pre><code>grandparent-&gt;right = child;
parent-&gt;right = child-&gt;left;
child-&gt;left = parent;</code></pre>
<p>(c) 先执行 <code>child-&gt;left = parent</code>，R 的左指针就不再指向 Q；再执行 <code>parent-&gt;right = child-&gt;left</code>，M 的右指针指向 M 自己。Q 从树上丢失，树里还出现了环。</p>
</div>
</details>

<details class="qa">
<summary class="ripple-surface">3. 选择题：插入后第一个失衡结点的 BF 是 −2，它的右孩子 BF 是 +1。应该怎样旋转？A. 在失衡结点左旋一次　B. 先在右孩子右旋，再在失衡结点左旋　C. 先在失衡结点左旋，再在右孩子右旋　D. 在右孩子右旋一次。追问：如果第一步误在失衡结点上左旋，一共要转几次？</summary>
<div class="qa__body">
<p>选 <strong>B</strong>。−2 表示右边重，孩子 +1 表示新键在右孩子的左边：<strong>RL</strong>，内侧。先在<strong>右孩子</strong>处右旋（变成 RR），再在<strong>失衡结点</strong>处左旋。A、D 只转一次，修不好内侧失衡；C 顺序反了。</p>
<p>若第一步在失衡结点左旋，以 1, 3, 2 为例：3 上来，2 改挂为 1 的右孩子，得到 3 → 左 1 → 右 2，BF(3) = +2、BF(1) = −1，变成 LR，还要先在 1 左旋、再在 3 右旋，<strong>一共 3 次</strong>。</p>
</div>
</details>
`;
