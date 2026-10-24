/* Post body — dsa-tries / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-tries:zh'] = `
<p class="lead">字典树（trie，又叫前缀树 prefix tree）把键按字符拆开存：前缀相同的键共用一条路径，查找长度为 L 的键只走 L 步，与树里存了多少个键无关。radix 树把只有一个孩子的链压成一个结点，Patricia 树再把同样的压缩用到键的二进制位上。</p>

<h2>Trie：每条边是一个字符</h2>
<p>课上的例子是 car、card、cat。分开存，c 和 a 各要存 3 遍。Trie 的根结点不代表任何字符，往下每条边对应一个字符，一个单词就是从根出发的一条路径：三个单词共用 c → a，a 下面分出 r 和 t，card 再在 r 下面接一个 d。</p>
<p>car 是 card 的前缀，走到 r 时分不清 car 是存进来的单词还是 card 的一段，所以每个结点带一个<strong>词尾标记（end-of-word marker）</strong>：r 和 d 要标，c 和 a 不标。字符其实属于边（C 实现里就是孩子数组的下标），画图时习惯写进下面的子结点。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-tries/anims/trie-radix.html" loading="lazy" style="height: 480px;" title="Trie 插入、查找与 radix 压缩"></iframe>
<p class="anim-caption">“插入”按 cat, car, card, dog, do, pen 的顺序建树（蓝 = 沿用的路径，橙 = 新结点，绿点 = 词尾），留意插入 do 时只设标记；“查找”演示三种结果；“压缩成 radix”演示合并。</p>

<h2>查找、插入与前缀查询</h2>
<p>查找（search）从根出发，按键的字符逐个往下走，结局有三种：</p>
<ul>
<li>读完键，停在有词尾标记的结点：找到（dog）。</li>
<li>读完键，停下的结点没有标记：不存在。ca 的路是通的，但它只是 car、card、cat 的前缀。</li>
<li>中途某个字符没有对应的边：不存在，后面的字符不用再读（查 cow，c 下面没有 o）。</li>
</ul>
<p>插入（insert）也是往下走，缺哪条边就新建结点，最后给终点设标记。每个字符一步，每步一次数组下标访问，所以<strong>查找和插入都是 O(L)（L 为键长），与键的个数 n 无关</strong>。对比：平衡 BST 要做 O(log n) 次字符串比较，每次最多读 L 个字符，共 O(L log n)；哈希表算哈希值也要读完 L 个字符，平均 O(L)，但不支持前缀查询。<strong>Trie 的形状只由键的集合决定，与插入顺序无关</strong>，不会像 BST 那样退化。</p>
<p>前缀查询（prefix query）：沿前缀走到对应结点，它的子树里就是所有以该前缀开头的单词，自动补全（autocomplete）靠的就是这个。子树做前序遍历、孩子按 a→z 访问，输出就是字典序：前缀 ca 依次得到 car、card、cat。</p>

<h2>C 实现：26 个孩子指针</h2>
<p>只存小写字母时，结点里放 26 个孩子指针（字符 c 对应下标 <code>c - 'a'</code>）和一个词尾标记。<code>walk</code> 沿字符串往下走，查找和前缀查询都要用它：</p>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;assert.h&gt;

#define ALPHA 26                     /* 只收小写字母 a..z */

typedef struct trie trie_t;
struct trie {
    trie_t *child[ALPHA];            /* child[c - 'a']：沿字符 c 往下走 */
    int is_end;                      /* 1 = 有单词恰好在这里结束 */
};

trie_t *new_node(void) {
    trie_t *t = malloc(sizeof(*t));
    assert(t != NULL);
    for (int i = 0; i &lt; ALPHA; i++) t-&gt;child[i] = NULL;
    t-&gt;is_end = 0;
    return t;
}

void trie_insert(trie_t *root, const char *w) {
    trie_t *t = root;
    for (; *w != '\\0'; w++) {
        int c = *w - 'a';
        if (t-&gt;child[c] == NULL)         /* 这条边还没有：新建 */
            t-&gt;child[c] = new_node();
        t = t-&gt;child[c];                 /* 有就沿用：共享前缀 */
    }
    t-&gt;is_end = 1;                       /* 走完整个单词，标记词尾 */
}

/* 从 t 出发沿 s 的字符往下走；中途没有路返回 NULL */
trie_t *walk(trie_t *t, const char *s) {
    for (; t != NULL &amp;&amp; *s != '\\0'; s++)
        t = t-&gt;child[*s - 'a'];
    return t;
}

int trie_search(trie_t *root, const char *w) {
    trie_t *t = walk(root, w);
    return t != NULL &amp;&amp; t-&gt;is_end;       /* 路要走得通，而且是词尾 */
}

void trie_free(trie_t *t) {
    if (t == NULL) return;
    for (int i = 0; i &lt; ALPHA; i++) trie_free(t-&gt;child[i]);
    free(t);
}</code></pre>
<p>代价在空间上。64 位机器上 <code>sizeof(trie_t)</code> 是 216 字节（26 个 8 字节指针，加 4 字节标记和 4 字节对齐）。动画里 6 个单词共 18 个字符，建出 12 个结点（含根），约 2.6 KB；312 个指针里只有 11 个不是 NULL。所有键的字符总数为 N 时，最多 N + 1 个结点。<strong>Trie 是用空间换时间。</strong></p>

<h2>Radix 树：压缩单孩子链</h2>
<p>c 下面只有 a 一条路，p → e → n 更是一条单链，这些结点只在传话。radix 树（radix tree，又叫压缩 trie）的规则：<strong>结点不是词尾、又只有一个孩子，就和孩子合并，字符串接起来</strong>。课上把 C、A 合成一个结点 CA，下面再分 R 和 T。上例合并出 ca、do、pen；r 只有一个孩子 d，但它是 car 的词尾，<strong>不能合并</strong>。结点从 11 个减到 7 个（不算根）。</p>
<p>合并后，除根以外每个结点要么是词尾、要么至少有两个孩子，所以结点数是 O(n)，与单词多长无关。查找在每个结点上比较一段字符串，比较的字符总数仍是 O(L)，只是跟的指针少了，动机和 B 树一样（见 3.8 B 树与 B+ 树）。查找可能停在一段标签中间：查 c，读完时还在 ca 里面，不存在。</p>
<p>插入可能要<strong>拆分结点</strong>。插入 cow：它和 ca 只共享 c，于是 ca 拆成 c 和 a，原来的子树跟着 a，c 下面再挂新叶子 ow（* 为词尾，do、pen 两支不变）：</p>
<pre><code class="lang-text">之前：(根) → ca → { r* → d*,  t* }
之后：(根) → c  → { a → { r* → d*,  t* },  ow* }</code></pre>

<h2>Patricia 树：按二进制位分叉</h2>
<p>按字符分叉时，首字母不同的键什么也不共享。课上的观察：换成二进制，共享的位多得多。'D' = 0100 0100，'P' = 0101 0000，<strong>前 3 位 010 相同，第 4 位才分开</strong>（位从最高位数起）。这 3 位只存一次，再按第 4 位分两叉。</p>
<p>Patricia 树（Patricia trie）就是位串上的 radix 树：字母表只有 0 和 1，结点存一段共同的位，再按下一位是 0 还是 1 分到两个孩子。以课上根下面的三个首字母 C、D、P 为键：</p>
<pre><code class="lang-text">bit     1234 5678
'C'     0100 0011
'D'     0100 0100
'P'     0101 0000</code></pre>
<figure class="fig">
<svg viewBox="0 0 560 272" width="560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Patricia 树：根存位 010；第 4 位为 1 的一侧是叶子 P；第 4 位为 0 的一侧是存位 0 的内部结点，再按第 6 位分成叶子 C 和 D">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="280" y1="54" x2="170" y2="118"/>
<line x1="280" y1="54" x2="390" y2="118"/>
<line x1="170" y1="152" x2="100" y2="208"/>
<line x1="170" y1="152" x2="240" y2="208"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<rect x="225" y="20" width="110" height="34" rx="7"/>
<rect x="135" y="118" width="70" height="34" rx="7"/>
</g>
<g fill="#343433" stroke="#4ade80" stroke-width="2">
<rect x="360" y="118" width="60" height="34" rx="7"/>
<rect x="70" y="208" width="60" height="34" rx="7"/>
<rect x="210" y="208" width="60" height="34" rx="7"/>
</g>
<g font-size="15" fill="#e8e8e8" text-anchor="middle" font-weight="700">
<text x="280" y="42">010</text>
<text x="170" y="140">0</text>
<text x="390" y="140">P</text>
<text x="100" y="230">C</text>
<text x="240" y="230">D</text>
</g>
<g font-size="14" fill="#d97757" text-anchor="middle" font-weight="700">
<text x="217" y="82">0</text>
<text x="343" y="82">1</text>
<text x="124" y="178">0</text>
<text x="216" y="178">1</text>
</g>
<g font-size="12" fill="#a1a1a0">
<text x="345" y="42">第 1–3 位：三个键都相同</text>
<text x="125" y="140" text-anchor="end">第 5 位：C、D 相同</text>
<text x="280" y="96" text-anchor="middle">按第 4 位分叉</text>
<text x="170" y="194" text-anchor="middle">按第 6 位</text>
<text x="390" y="172" text-anchor="middle">余下 0000</text>
<text x="100" y="262" text-anchor="middle">余下 11</text>
<text x="240" y="262" text-anchor="middle">余下 00</text>
</g>
</svg>
<figcaption>灰框是内部结点，存一段共同的位；绿框是叶子，存余下的位（实现里常直接存整个键）。橙色数字是分叉位的取值。</figcaption>
</figure>
<p>查找 D：根里的 010 对上；第 4 位是 0，往左；第 5 位 0 对上；第 6 位是 1，往右到叶子，再比对余下的位。也有实现在结点里只记“下一步测第几位”（这里依次是第 4、6 位），到叶子再把整个键比对一次。</p>
<ul>
<li><strong>每个内部结点恰好 2 个孩子</strong>，所以 n 个键有 n 个叶子、n − 1 个内部结点，与键长无关；每个结点只要 2 个指针。</li>
<li>前提是没有键是另一个键的前缀。把 C 字符串结尾 '\\0' 的 8 个 0 也算进位串即可：car 和 card 在第 26 位分开（'\\0' 对 'd'），它起的就是词尾标记的作用。</li>
<li>逐位比较，最多约 8L 位，仍是 <strong>O(L)</strong>。</li>
<li>小写字母比对应的大写字母大 32，只差第 3 位：大写字母都以 010 开头，小写字母都以 011 开头，所以 d 和 p 同样在第 4 位分开。</li>
</ul>

<h2>考试怎么考</h2>
<table>
<thead><tr><th></th><th>结点里存什么</th><th>结点数（n 个键）</th><th>查找 / 插入</th></tr></thead>
<tbody>
<tr><td>Trie</td><td>26 个孩子指针 + 词尾标记</td><td>最多 N + 1（N = 字符总数）</td><td>O(L)</td></tr>
<tr><td>Radix 树</td><td>一段字符串 + 孩子指针 + 词尾标记</td><td>O(n)，与键长无关</td><td>O(L)</td></tr>
<tr><td>Patricia 树</td><td>一段位 + 2 个孩子指针</td><td>n 个叶子 + n − 1 个内部结点</td><td>O(L)，逐位比较</td></tr>
</tbody>
</table>
<ul>
<li><strong>画图题</strong>：给一组单词画 trie 和 radix 树。先逐字符建 trie、标出所有词尾，再合并“非词尾且只有一个孩子”的链。</li>
<li><strong>复杂度</strong>：查找、插入 O(L)，与 n 无关，公式表上没有，要记；常与 BST 的 O(L log n)、哈希表对比。</li>
<li><strong>按位分叉</strong>：给出字符的二进制，问共享几位、第几位分叉、Patricia 树的形状和内部结点数。</li>
<li>Assignment 2 用的就是 radix / Patricia 树，作业内容可考：结点里存什么、查找比较的是位还是字符、各操作的代价。</li>
</ul>
<div class="callout warn" data-label="易错">
<ul>
<li>查找成功要同时满足：路径走得通，终点有词尾标记。漏标词尾，前缀就会被当成单词。</li>
<li>词尾结点即使只有一个孩子也不能合并；根不参与合并。</li>
<li>L 是键长，不是键的个数。radix 和 Patricia 树省的是结点和指针，查找仍是 O(L)。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
<summary class="ripple-surface">1. 依次插入 in, inn, inter, internal, internet, into。(a) trie 有多少个结点（不算根）？(b) 画出 radix 树。(c) 在 radix 树里查找 inte 和 intern，结果如何？</summary>
<div class="qa__body">
<p>(a) i → n*；n* 下面是 n*（inn）和 t；t 下面是 e → r* 和 o*（into）；r* 下面是 n，n 下面分 a → l*（internal）和 e → t*（internet）。共 <strong>12 个结点</strong>，6 个带词尾标记（* 为词尾）。</p>
<p>(b) 合并“非词尾、单孩子”的链：i + n → in（in 是词尾，停）；e + r → er；a + l → al；e + t → et。t 和 r 下面的 n 都有两个孩子，不动：</p>
<pre><code class="lang-text">(根)
└─ in*
   ├─ n*
   └─ t
      ├─ er*
      │  └─ n
      │     ├─ al*
      │     └─ et*
      └─ o*</code></pre>
<p>共 8 个结点（不算根）。</p>
<p>(c) 查 inte：in、t 对上，剩下的 e 进入孩子 er，键读完时停在 er 中间，<strong>不存在</strong>。查 intern：in、t、er、n 全对上，停在 n，但 n 不是词尾，<strong>不存在</strong>，它只是 internal 和 internet 的前缀。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">2. 多选：trie 里存了 n 个单词，要查长度为 L 的键。哪些说法正确？(a) 查找时间随 n 增大而增大；(b) 查找失败时可能读不完整个键就结束；(c) trie 的形状与插入顺序无关；(d) 用 26 指针结点的 trie 一定比存同样单词的哈希表省空间；(e) 平衡 BST 存 n 个字符串，查找最坏 O(L log n)。</summary>
<div class="qa__body">
<p>正确的是 <strong>(b)(c)(e)</strong>。</p>
<p>(a) 错：每读一个字符走一步，O(L)，与 n 无关。(b) 对：查 cow 时 c 下面没有 o，立即结束。(c) 对：每个单词的路径由它的字符唯一决定，先插谁后插谁结果一样，所以没有 BST 那样的退化。(d) 错：每个结点 26 个指针，大多是 NULL，trie 往往更费空间。(e) 对：O(log n) 层，每层一次字符串比较，每次最多读 L 个字符。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">3. 'A' = 0100 0001，'B' = 0100 0010，'H' = 0100 1000，'P' = 0101 0000。(a) A 和 B 前几位相同，在第几位分开？(b) 画出这 4 个键的 Patricia 树，它有几个内部结点？</summary>
<div class="qa__body">
<p>(a) 前 <strong>6 位</strong> 010000 相同，<strong>第 7 位</strong>分开（A 为 0，B 为 1）。</p>
<p>(b) 四个键前 3 位都是 010，存在根里。第 4 位只有 P 是 1，P 成为右边的叶子。A、B、H 在第 5 位就不同（H 为 1），所以左孩子不存位、直接按第 5 位分叉，H 成为叶子。A、B 的第 6 位都是 0，存进下一个结点，再按第 7 位分开：</p>
<pre><code class="lang-text">[010] 按第 4 位
├─ 0: [ ] 按第 5 位
│     ├─ 0: [0] 按第 7 位
│     │     ├─ 0: A
│     │     └─ 1: B
│     └─ 1: H
└─ 1: P</code></pre>
<p><strong>3 个内部结点</strong>（n − 1），4 个叶子。只记“测第几位”的写法里，查找依次测第 4、5、7 位。</p>
</div>
</details>
<details class="qa">
<summary class="ripple-surface">4. 用上面的 trie_t 和 walk，写 int count_prefix(trie_t *root, const char *p)，返回以 p 开头的单词个数。对 cat, car, card, dog, do, pen，count_prefix(root, "ca") 和 count_prefix(root, "co") 各是多少？</summary>
<div class="qa__body">
<pre><code>int count_words(const trie_t *t) {
    if (t == NULL) return 0;
    int n = t-&gt;is_end;                    /* 这个结点本身是不是词尾 */
    for (int i = 0; i &lt; ALPHA; i++)
        n += count_words(t-&gt;child[i]);
    return n;
}

int count_prefix(trie_t *root, const char *p) {
    return count_words(walk(root, p));    /* 前缀走不通时 walk 返回 NULL，结果 0 */
}</code></pre>
<p>先用 O(|p|) 走到前缀的终点，再数它的子树里有多少个词尾，时间与子树大小成正比。"ca" 走到 a，子树里有 car、card、cat 三个词尾，结果 <strong>3</strong>；"co" 在 c 下面没有 o，walk 返回 NULL，结果 <strong>0</strong>。前缀本身是单词时也算在内："do" 得 2（do、dog），空串得 6。</p>
</div>
</details>
`;
