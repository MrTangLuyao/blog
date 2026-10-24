/* Post body — dsa-tries / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-tries:zh'] = `
<p class="lead">字典树（trie）按字母一层层往下存单词，前缀相同的单词共用一段路径，查一个长度为 L 的单词只走 L 步；radix 树和 Patricia 树是它的两种压缩版。</p>

<h2>从一个场景说起</h2>
<p>在搜索框里打 ca，下面马上列出 car、card、cat。这是怎么做到的？</p>
<p>想想查纸质词典。查 card，你不会一页页比过去：先翻到 C 部，再找 CA 开头的几页，再缩到 CAR，最后是 CARD。<strong>每看一个字母，范围就缩小一截</strong>，card 只要缩 4 次，词典再厚也一样。</p>
<p>car、card、cat 都在“CA 那一段”，要列出 ca 开头的词，把这一段读一遍就行。字典树就是把这本词典做成一棵树。</p>

<h2>Trie 是什么</h2>
<p>简单说，字典树就是<strong>按字母分岔的树：从根往下每走一步读一个字母，一个单词就是一条从根出发的路径</strong>。英文叫 trie，也叫前缀树（prefix tree）。拿课上的 car、card、cat 来看，它有三个组成部分：</p>
<ul>
<li><strong>根（root）</strong>：不代表任何字母，是所有单词的起点。</li>
<li><strong>一条边 = 一个字母</strong>：c → a 三个单词都要走，所以只存一次，就是“CA 那一段”。到了 a 再分岔，一边 r，一边 t。</li>
<li><strong>词尾标记（end-of-word marker）</strong>：表示“有单词正好在这里结束”。car 是 card 的前缀，光看路径分不清 r 是 car 的结尾还是 card 的半截，所以 r 要标上。</li>
</ul>

<figure class="fig">
<svg viewBox="0 0 360 284" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="存 car、card、cat 的 trie：根下面是 c，c 下面是 a，a 下面分出 r 和 t，r 下面是 d；r、t、d 带词尾标记">
<g stroke="rgba(255,255,255,0.35)" stroke-width="2">
<line x1="180" y1="39" x2="180" y2="65"/>
<line x1="180" y1="99" x2="180" y2="123"/>
<line x1="168" y1="152" x2="132" y2="186"/>
<line x1="192" y1="152" x2="228" y2="186"/>
<line x1="120" y1="215" x2="120" y2="239"/>
</g>
<g fill="#343433" stroke="#5a5a59" stroke-width="2">
<circle cx="180" cy="24" r="15"/>
<circle cx="180" cy="82" r="17"/>
<circle cx="180" cy="140" r="17"/>
</g>
<g fill="#343433" stroke="#4ade80" stroke-width="2.5">
<circle cx="120" cy="198" r="17"/>
<circle cx="240" cy="198" r="17"/>
<circle cx="120" cy="256" r="17"/>
</g>
<g font-size="15" font-weight="700" fill="#e8e8e8" text-anchor="middle">
<text x="180" y="87">c</text>
<text x="180" y="145">a</text>
<text x="120" y="203">r</text>
<text x="240" y="203">t</text>
<text x="120" y="261">d</text>
</g>
<g font-size="12" fill="#a1a1a0">
<text x="202" y="28">根</text>
<text x="92" y="202" text-anchor="end">car</text>
<text x="266" y="202">cat</text>
<text x="146" y="260">card</text>
</g>
</svg>
<figcaption>绿圈带词尾标记。字母其实属于边，画图时习惯写进下面的结点。</figcaption>
</figure>

<h2>看个例子：插入与查找</h2>
<h3>插入</h3>
<p>插入（insert）就是从根出发按字母往下走：<strong>有路就沿用，没路就新建结点，走完给最后一个结点设词尾标记</strong>。依次插入 cat, car, card, dog, do, pen：</p>
<ol>
<li>cat：空树，新建 c、a、t，给 t 设标记。</li>
<li>car：c、a 沿用，新建 r，设标记。</li>
<li>card：c、a、r 沿用，只新建 d。</li>
<li>dog：根下面没有 d，新建 d、o、g。</li>
<li>do：d、o 都已有，<strong>一个结点也不建</strong>，只给 o 设标记。</li>
<li>pen：新建 p、e、n。</li>
</ol>
<p>18 个字母只建了 11 个结点（不算根）：共同前缀只存一次。</p>

<h3>查找</h3>
<p>查找（search）也是按字母往下走，结果有三种：</p>
<ul>
<li>查 dog：d、o、g 都走得通，停在 g，g 有标记：<strong>找到</strong>。</li>
<li>查 ca：路是通的，但 a 没有标记，ca 只是 car、card、cat 的前缀：<strong>不存在</strong>。</li>
<li>查 cow：c 下面没有 o，<strong>走到一半就没路了</strong>，后面不用再读：不存在。</li>
</ul>
<p>查找成功要同时满足：<strong>路走得通，终点有词尾标记</strong>。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-tries/anims/trie-radix.html" loading="lazy" style="height: 480px;" title="Trie 插入、查找与 radix 压缩"></iframe>
<p class="anim-caption">“插入”逐步建树（蓝 = 沿用的路径，橙 = 新结点，绿点 = 词尾），留意 do 只设标记；“查找”演示三种结果；“压缩成 radix”对应后面的 radix 树。</p>

<h2>为什么快：O(L)，与 n 无关</h2>
<p>每读一个字母走一步（一次数组下标访问），所以<strong>查找和插入都是 O(L)（L 是单词长度），与单词个数 n 无关</strong>。对比：平衡 BST 要比较 O(log n) 次字符串，每次最多读 L 个字母，共 <strong>O(L log n)</strong>；哈希表平均 O(L)，但单词被打散了，<strong>做不了前缀查询</strong>。</p>
<p>每个单词的路径只由它的字母决定，所以 <strong>trie 的形状与插入顺序无关</strong>，不会像 BST 那样退化。</p>
<p>前缀查询（prefix query）：输入 ca，走到 a，<strong>a 的子树里就是所有 ca 开头的单词</strong>。子树做前序遍历、孩子按 a→z 访问，输出正好是字典序 car、card、cat。自动补全（autocomplete）就靠它。</p>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/zIjfhVPRZCg" title="Data Structures: Tries" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：HackerRank《Data Structures: Tries》（英文），先用图讲概念，后半段是 Java 代码。</p>

<h2>C 实现</h2>
<p>只存小写字母时，结点里放 26 个孩子指针和一个词尾标记。考试要写的一般就是这两个函数：</p>
<pre><code>typedef struct trie trie_t;
struct trie {
    trie_t *child[26];   /* child[c - 'a']：沿字母 c 往下走 */
    int is_end;          /* 1 = 有单词在这里结束 */
};

void trie_insert(trie_t *root, const char *w) {
    trie_t *t = root;
    for (; *w != '\\0'; w++) {
        int c = *w - 'a';
        if (t-&gt;child[c] == NULL) t-&gt;child[c] = new_node();
        t = t-&gt;child[c];
    }
    t-&gt;is_end = 1;
}

int trie_search(trie_t *root, const char *w) {
    trie_t *t = root;
    for (; t != NULL &amp;&amp; *w != '\\0'; w++) t = t-&gt;child[*w - 'a'];
    return t != NULL &amp;&amp; t-&gt;is_end;
}</code></pre>
<ul>
<li><code>child[c - 'a']</code>：a 是下标 0，z 是 25；NULL 表示没路。</li>
<li>插入：孩子是 NULL 就用 <code>new_node()</code> 新建（malloc，指针全设 NULL，<code>is_end</code> 设 0），再往下走一层；走完设 <code>is_end = 1</code>。插入 do 只执行了这一句。</li>
<li>查找：中途没路，<code>t</code> 变成 NULL，循环马上停（cow）；最后要求 <code>t</code> 不是 NULL <strong>并且</strong> <code>is_end</code> 为 1，所以查 ca 返回 0。</li>
</ul>
<p>代价在空间：一个结点 216 字节（64 位机器），上面 12 个结点（含根）约 2.6 KB，312 个指针只有 11 个不是 NULL。<strong>Trie 是用空间换时间。</strong></p>

<h2>Radix 树：把单链压成一个结点</h2>
<p>那棵 trie 里，c 下面只有 a 一条路，p → e → n 也是单链，像没有岔口的走廊。</p>
<p>radix 树（radix tree，又叫压缩 trie）把走廊缩成一个结点：<strong>结点不是词尾、又只有一个孩子，就和孩子合并，字母接成字符串</strong>。</p>
<ul>
<li>c + a → <strong>ca</strong>（课上的例子），下面照样分出 r 和 t。</li>
<li>d + o → <strong>do</strong>：o 是词尾，合到这里为止，g 仍是它的孩子。</li>
<li>p + e + n → <strong>pen</strong>。</li>
<li>r 只有一个孩子 d，但它是 car 的词尾，<strong>不能合并</strong>。</li>
</ul>
<p>结点从 11 个减到 7 个。合并后除根外每个结点要么是词尾、要么至少两个孩子，所以结点数是 O(n)，与单词多长无关。</p>
<p>查找时每个结点比一段字符串，读的字母总数仍是 <strong>O(L)</strong>，省的是结点和指针。查找可能停在一段中间：查 c，读完还在 ca 里，不存在。</p>
<p>插入可能要<strong>拆分结点</strong>。插入 cow：它和 ca 只共用 c，于是 ca 拆成 c 和 a，原来的子树跟着 a，c 下面挂新叶子 ow（* 为词尾，do、pen 两支不变）：</p>
<pre><code class="lang-text">之前：(根) → ca → { r* → d*,  t* }
之后：(根) → c  → { a → { r* → d*,  t* },  ow* }</code></pre>

<h2>Patricia 树：按二进制位分叉</h2>
<p>按字母分叉，首字母不同就什么也共用不了。课上指出：换成二进制，能共用的多得多。'D' = 0100 0100，'P' = 0101 0000，<strong>前 3 位 010 相同，第 4 位才分开</strong>（位从最高位数起）。</p>
<p>Patricia 树（Patricia trie）就是<strong>用在二进制位上的 radix 树</strong>：结点存一段共同的位，再按下一位是 0 还是 1 分成两个孩子。以 C、D、P 为键：</p>
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
<figcaption>灰框是内部结点，存共同的位；绿框是叶子，存余下的位。橙色数字是分叉位的取值。</figcaption>
</figure>
<p>查找 D：根的 010 对上；第 4 位是 0，往左；第 5 位 0 对上；第 6 位是 1，往右到叶子，再比对余下的位。</p>
<ul>
<li><strong>每个内部结点恰好 2 个孩子</strong>：n 个键有 n 个叶子、n − 1 个内部结点。</li>
<li>要求没有键是另一个键的前缀。把字符串末尾的 '\\0'（8 个 0）也算进去即可：car 和 card 在第 26 位分开（'\\0' 对 'd'）。</li>
<li>逐位比较，最多约 8L 位，仍是 <strong>O(L)</strong>。</li>
</ul>

<h2>考试怎么考</h2>
<table>
<thead><tr><th></th><th>结点里存什么</th><th>结点数（n 个键）</th><th>查找 / 插入</th></tr></thead>
<tbody>
<tr><td>Trie</td><td>26 个孩子指针 + 词尾标记</td><td>最多 N + 1（N = 字母总数）</td><td>O(L)</td></tr>
<tr><td>Radix 树</td><td>一段字符串 + 孩子指针 + 词尾标记</td><td>O(n)</td><td>O(L)</td></tr>
<tr><td>Patricia 树</td><td>一段位 + 2 个孩子指针</td><td>n 个叶子 + n − 1 个内部结点</td><td>O(L)</td></tr>
</tbody>
</table>
<ul>
<li><strong>画图题</strong>（最常见）：给一串单词，画 trie 和 radix 树。</li>
<li><strong>复杂度</strong>：O(L)，与 n 无关，常和 BST、哈希表对比；公式表上没有。</li>
<li><strong>按位分叉</strong>：给出二进制，问前几位相同、第几位分叉、Patricia 树的形状。</li>
<li>Assignment 2 用的就是 radix / Patricia 树，作业内容可考。</li>
</ul>

<h3>例题 1：画 trie 和 radix 树</h3>
<p>依次插入 in, inn, inter, internal, internet, into。(a) trie 有几个结点（不算根）？(b) 画出 radix 树。(c) 在 radix 树里查 inte 和 intern，结果如何？</p>
<p>(a) 逐个插入，缺什么建什么，共 <strong>12 个结点</strong>，6 个带词尾标记（*）：</p>
<pre><code class="lang-text">i ─ n* ┬ n*
       └ t ┬ e ─ r* ─ n ┬ a ─ l*
           │            └ e ─ t*
           └ o*</code></pre>
<p>(b) 合并“非词尾、单孩子”的链：i + n → in（in 是词尾，停）；e + r → er；a + l → al；e + t → et。t 和 r 下面的 n 都有两个孩子，不动。共 8 个结点：</p>
<pre><code class="lang-text">in* ┬ n*
    └ t ┬ er* ─ n ┬ al*
        │         └ et*
        └ o*</code></pre>
<p>(c) 查 inte：in、t 对上，e 进入 er，读完时停在 er 中间：<strong>不存在</strong>。查 intern：in、t、er、n 全对上，但 n 不是词尾：<strong>不存在</strong>。</p>

<h3>例题 2：多选</h3>
<p>trie 存了 n 个单词，查长度为 L 的键。哪些正确？(a) 查找时间随 n 增大而增大；(b) 查找失败时可能读不完整个键；(c) trie 的形状与插入顺序无关；(d) 26 指针的 trie 一定比哈希表省空间；(e) 平衡 BST 存 n 个字符串，查找最坏 O(L log n)。</p>
<p><strong>答案：(b)(c)(e)。</strong>(a) 错，O(L)，与 n 无关。(b) 对，查 cow 在 c 下面就停了。(c) 对，路径只由字母决定。(d) 错，大多数指针是 NULL，trie 往往更费空间。(e) 对，O(log n) 次比较，每次最多读 L 个字母。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>漏标词尾，前缀就会被当成单词。</li>
<li>词尾结点即使只有一个孩子也不能合并；根不参与合并。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>Trie：一条边一个字母，前缀相同的单词共用路径；结点要有词尾标记。</li>
<li>查找、插入 O(L)，与 n 无关；形状与插入顺序无关；支持前缀查询。用空间换时间。</li>
<li>Radix 树：“非词尾、只有一个孩子”的结点和孩子合并（c + a → ca），插入可能要拆分结点。</li>
<li>Patricia 树：按二进制位做 radix 压缩，'D'、'P' 共用前 3 位、第 4 位分叉；n 个键有 n − 1 个内部结点。</li>
</ul>
`;
