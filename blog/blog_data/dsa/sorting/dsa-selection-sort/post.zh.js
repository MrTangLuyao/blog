/* Post body — dsa-selection-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-selection-sort:zh'] = `
<p class="lead">选择排序（selection sort）每轮在未排序部分里找出最小值，把它换到这一部分的最前面，这个位置从此不再改动。无论输入长什么样，它都做 n(n−1)/2 次比较、n − 1 次交换：最好、平均、最坏都是 Θ(n²)，原地，不稳定，不自适应。</p>

<h2>每轮挑出最小的</h2>
<p>课上的例子是 A = [2, 0, 9, 7, 1, 5, 2]。第 1 轮从头扫到尾，最小值是下标 1 的 0。排好之后 0 必须在最前面，于是把它和 A[0] = 2 交换，得到 [0, 2, 9, 7, 1, 5, 2]。现在 A[0] 是全体的最小值，以后的轮次都不再碰它。第 2 轮只看 A[1..6]，最小值是下标 4 的 1，和 A[1] 交换，得到 [0, 1, 9, 7, 2, 5, 2]，A[1] 也定下来了。</p>
<p>一般地，数组分成两段：A[0..i−1] 已排好，A[i..n−1] 未排。第 i 轮（i 从 0 数起）做两件事：</p>
<ol>
<li>扫描 A[i..n−1]，记下最小值的<strong>下标</strong> min；</li>
<li>交换 A[i] 和 A[min]。</li>
</ol>
<p>这一轮结束后，A[0..i] 依次是全体中最小的 i + 1 个元素，每一个都不大于未排部分的任何元素，所以已排部分永远不用回头修改。<strong>一共 n − 1 轮</strong>：前 n − 1 个位置定好以后，剩下的那个必然是最大值，不用再扫。最小值恰好已经在 A[i] 时，标准写法照样执行交换，只是和自己交换。</p>

<h2>完整追踪</h2>
<p>同一个数组，用角标区分两个 2：原来在下标 0 的记作 2₁，在下标 6 的记作 2₂。竖线左边是已排好的部分。</p>
<table>
<thead><tr><th>轮</th><th>扫描范围</th><th>最小值（下标）</th><th>交换</th><th>本轮之后</th><th>比较次数</th></tr></thead>
<tbody>
<tr><td>1</td><td>A[0..6]</td><td>0（1）</td><td>A[0]=2₁ ↔ A[1]=0</td><td>0 | 2₁ 9 7 1 5 2₂</td><td>6</td></tr>
<tr><td>2</td><td>A[1..6]</td><td>1（4）</td><td>A[1]=2₁ ↔ A[4]=1</td><td>0 1 | 9 7 2₁ 5 2₂</td><td>5</td></tr>
<tr><td>3</td><td>A[2..6]</td><td>2₁（4）</td><td>A[2]=9 ↔ A[4]=2₁</td><td>0 1 2₁ | 7 9 5 2₂</td><td>4</td></tr>
<tr><td>4</td><td>A[3..6]</td><td>2₂（6）</td><td>A[3]=7 ↔ A[6]=2₂</td><td>0 1 2₁ 2₂ | 9 5 7</td><td>3</td></tr>
<tr><td>5</td><td>A[4..6]</td><td>5（5）</td><td>A[4]=9 ↔ A[5]=5</td><td>0 1 2₁ 2₂ 5 | 9 7</td><td>2</td></tr>
<tr><td>6</td><td>A[5..6]</td><td>7（6）</td><td>A[5]=9 ↔ A[6]=7</td><td>0 1 2₁ 2₂ 5 7 | 9</td><td>1</td></tr>
</tbody>
</table>
<p>第 3 轮未排部分里有两个 2。代码用严格的 <code>&lt;</code> 比较，2₂ 和当前最小 2₁ 相等，不算“更小”，所以 min 停在先遇到的下标 4。合计 6 轮、6 次交换、6 + 5 + 4 + 3 + 2 + 1 = 21 次比较。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-selection-sort/anims/selection.html" loading="lazy" style="height: 440px;" title="选择排序逐步演示"></iframe>
<p class="anim-caption">按“下一步”或“播放”：j 逐个和当前最小 min 比较，扫完后做一次 swap，绿色的已排部分每轮长一格。切换“已排好”“逆序”看比较次数是否变化，切换“反例”看两个 2 的次序。</p>

<h2>C 代码</h2>
<pre><code>#include &lt;stdio.h&gt;

void swap(int *a, int *b) {
    int tmp = *a;                      /* 3 assignments */
    *a = *b;
    *b = tmp;
}

/* sort A[0..n-1] into non-decreasing order */
void selection_sort(int A[], int n) {
    int i, j, min;
    for (i = 0; i &lt; n - 1; i++) {      /* A[0..i-1] is final */
        min = i;                       /* index of the smallest so far */
        for (j = i + 1; j &lt; n; j++) {
            if (A[j] &lt; A[min]) {
                min = j;
            }
        }
        swap(&amp;A[i], &amp;A[min]);          /* always runs, maybe A[i] with itself */
    }
}

int main(void) {
    int A[] = {2, 0, 9, 7, 1, 5, 2};
    int n = sizeof(A) / sizeof(A[0]);
    selection_sort(A, n);
    for (int k = 0; k &lt; n; k++) {
        printf("%d ", A[k]);
    }
    printf("\\n");                      /* prints: 0 1 2 2 5 7 9 */
    return 0;
}</code></pre>
<ul>
<li>内层循环记录最小值的<strong>下标</strong>而不是值本身，因为最后要按位置交换。</li>
<li>外层 <code>i &lt; n - 1</code>，内层 <code>j</code> 从 <code>i + 1</code> 开始；n 为 0 或 1 时外层一次也不执行。</li>
<li><code>swap</code> 是外层循环的最后一行，在内层循环之外，每轮恰好一次。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>把交换写进内层循环，一遇到比 A[i] 小的就换：</p>
<pre><code>for (i = 0; i &lt; n - 1; i++)
    for (j = i + 1; j &lt; n; j++)
        if (A[j] &lt; A[i])
            swap(&amp;A[i], &amp;A[j]);</code></pre>
<p>结果仍然有序，比较次数也一样，但交换次数不再固定为 n − 1：对 [7, 6, 5, 4, 3, 2, 1] 要交换 21 次，即 n(n−1)/2。这已经不是选择排序，写得少的优点也没了。</p>
</div>

<h2>代价：和输入无关</h2>
<p>课上数两种操作：比较（当前最小值和下一个元素比），以及交换，一次交换算 3 次赋值（tmp = a; a = b; b = tmp）。第 1 轮扫 n 个元素，比较 n − 1 次；第 2 轮 n − 2 次；……；最后一轮只比较最后两个，1 次。</p>
<pre><code class="lang-text">比较：(n−1) + (n−2) + … + 2 + 1 = n(n−1)/2
交换：每轮 1 次，共 n − 1 次，即 3(n − 1) 次赋值
合计：n(n−1)/2 + 3(n−1)  →  Θ(n²)</code></pre>
<p>公式表上给的是 1 + 2 + … + n = n(n+1)/2，这里求和只到 n − 1，要把 n 换成 n − 1 代入。n = 7 时比较 21 次、交换 6 次；n = 100 时比较 4950 次、交换 99 次。</p>
<p>课上有同学提出：已排好的输入是最好情况，因为不用真正交换；逆序是最坏情况，因为每轮都要换。可是<strong>比较次数对任何输入都是 n(n−1)/2</strong>，标准写法的 swap 也每轮都执行。就算加一句 <code>if (min != i)</code> 跳过自换，最多省下 n − 1 次交换，比较次数一点不少。所以<strong>最好 = 平均 = 最坏 = Θ(n²)</strong>，三种情况都可以用 Θ。运行时间只由 n 决定，与输入的有序程度无关：选择排序<strong>不自适应（not adaptive）</strong>。</p>
<p>额外空间只有 <code>i</code>、<code>j</code>、<code>min</code> 和 swap 里的 <code>tmp</code>，是 <strong>O(1)，原地（in-place）</strong>。</p>
<p>从设计思路看，选择排序是<strong>减治（decrease-and-conquer）</strong>：花 O(n) 找到最小值并放到最前，剩下 n − 1 个元素是同一个问题，规模减一。递推式 <strong>T(n) = T(n−1) + O(n)</strong>，T(1) 取 0 或 1，展开得 Θ(n²)，展开过程见 1.8 递推式与展开法。</p>
<p>它的长处是<strong>写得少：恰好 n − 1 次交换</strong>，也就是 O(n) 次写内存，而插入排序最坏要移动约 n²/2 次（见 5.3 插入排序）。当写操作很贵时，例如闪存（flash memory）、EEPROM 和嵌入式系统，多做比较、少写内存可能是划算的。</p>

<h2>不稳定</h2>
<p>稳定指相等的键排序后保持原来的先后次序（见 5.1）。课上的反例是 2₁, 2₂, 1。第 1 轮最小值是下标 2 的 1，与 A[0] = 2₁ 交换，得到 1, 2₂, 2₁。第 2 轮看 A[1..2] = 2₂, 2₁，两者相等，min 留在下标 1，自换。结果 1, 2₂, 2₁：原来在前的 2₁ 跑到了后面，所以<strong>选择排序不稳定（unstable）</strong>。</p>
<p>原因是远距离交换：A[i] 被换到 min 的位置，一下子越过了中间所有元素，其中可能有和它相等的。上面追踪的课上数组里，两个 2 碰巧保持了原顺序，但稳定性是算法的性质，不看某一次运行：只要存在一个反例，算法就不稳定。把 <code>&lt;</code> 改成 <code>&lt;=</code> 也救不了，那样会选最后一个并列的最小值，[2₁, 2₂] 第 1 轮就被换成 2₂, 2₁。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>追踪</strong>：给一个数组，写出第 k 轮之后的数组，或者问某一轮交换了哪两个元素。每轮只交换一次；最小值有并列时，按严格 <code>&lt;</code> 取先遇到的那个。</li>
<li><strong>计数</strong>：比较 n(n−1)/2 次、交换 n − 1 次，与输入无关。公式表只给 1 + … + n = n(n+1)/2，代 n − 1 要自己做。</li>
<li><strong>性质判断</strong>：是否稳定、原地、自适应，最好情况是多少；要求举反例时写 2₁, 2₂, 1。</li>
<li><strong>写代码</strong>：两层循环 + 记下标 + 外层末尾 swap，第 7 周 workshop 练过。</li>
</ul>
<table>
<thead><tr><th>要背的</th><th>选择排序</th></tr></thead>
<tbody>
<tr><td>时间（最好 / 平均 / 最坏）</td><td>Θ(n²) / Θ(n²) / Θ(n²)</td></tr>
<tr><td>比较次数</td><td>n(n−1)/2，任何输入</td></tr>
<tr><td>交换次数</td><td>n − 1（标准写法，含自换）</td></tr>
<tr><td>额外空间 / 原地</td><td>O(1) / 是</td></tr>
<tr><td>稳定 / 自适应</td><td>否 / 否</td></tr>
<tr><td>递推式</td><td>T(n) = T(n−1) + O(n)，减治</td></tr>
</tbody>
</table>
<div class="callout warn" data-label="易错">
<ul>
<li>“已排好的输入是最好情况，Θ(n)”：错，比较次数不变，仍是 Θ(n²)。</li>
<li>“逆序是最坏情况”：错，所有输入一样。键互不相同的逆序数组，真正交换两个不同位置的只有 ⌊n/2⌋ 次。</li>
<li>比较次数套公式写成 n(n+1)/2：多算了 n。</li>
<li>见过一次运行里相等元素没换位置，就判断它稳定。</li>
</ul>
</div>

<h2>练习</h2>
<details class="qa">
  <summary class="ripple-surface">1. 对 [6, 4₁, 9, 1, 4₂, 3] 做选择排序，写出每一轮之后的数组。两个 4 最后的先后次序如何？</summary>
  <div class="qa__body">
<pre><code class="lang-text">第 1 轮  min = 1（下标 3），6 ↔ 1    →  1 | 4₁ 9 6 4₂ 3
第 2 轮  min = 3（下标 5），4₁ ↔ 3   →  1 3 | 9 6 4₂ 4₁
第 3 轮  min = 4₂（下标 4），9 ↔ 4₂  →  1 3 4₂ | 6 9 4₁
第 4 轮  min = 4₁（下标 5），6 ↔ 4₁  →  1 3 4₂ 4₁ | 9 6
第 5 轮  min = 6（下标 5），9 ↔ 6    →  1 3 4₂ 4₁ 6 | 9</code></pre>
<p>n = 6，共 5 轮，比较 5 + 4 + 3 + 2 + 1 = 15 次。第 2 轮 4₁ 被换到了末尾，越过了 4₂；第 3 轮 4₂ 先被选中。最终 <strong>4₂ 在 4₁ 前面</strong>，这次运行本身就说明了不稳定。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">2. 用上面的 C 代码排序 100 个元素，比较多少次？调用 swap 多少次？swap 里一共多少次赋值？如果输入已经排好，这三个数会变吗？</summary>
  <div class="qa__body">
<p>比较 99 + 98 + … + 1 = 100 × 99 / 2 = <strong>4950</strong> 次；swap 调用 <strong>99</strong> 次；赋值 3 × 99 = <strong>297</strong> 次。</p>
<p>输入已排好时<strong>三个数都不变</strong>：内层循环照样扫完，只是 min 从不更新；99 次 swap 全是自换。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">3. 多选，哪些正确？(A) 输入已排好时选择排序是 Θ(n)；(B) 规模为 n 的所有输入，比较次数都相同；(C) 选择排序是原地排序；(D) 选择排序只在找到严格更小的元素时才更新 min，所以是稳定的；(E) 它的运行时间满足 T(n) = T(n−1) + O(n)；(F) 逆序输入是它的最坏情况。</summary>
  <div class="qa__body">
<p><strong>B、C、E 正确。</strong></p>
<p>B：每轮比较次数只取决于未排部分的长度，总数 n(n−1)/2。C：额外空间 O(1)。E：一轮 O(n)，剩下 n − 1 个元素。</p>
<p>A 错：比较次数不变，仍是 Θ(n²)。D 错：严格 <code>&lt;</code> 只决定并列时选哪一个，交换本身会让 A[i] 越过相等元素，反例 2₁, 2₂, 1。F 错：任何输入的比较次数和 swap 次数都相同，没有更坏的输入。</p>
  </div>
</details>
<details class="qa">
  <summary class="ripple-surface">4. 对逆序数组 [7, 6, 5, 4, 3, 2, 1] 运行上面的代码：比较多少次？调用 swap 多少次？其中有几次交换的是两个不同位置？</summary>
  <div class="qa__body">
<pre><code class="lang-text">第 1 轮  7 ↔ 1  →  1 | 6 5 4 3 2 7
第 2 轮  6 ↔ 2  →  1 2 | 5 4 3 6 7
第 3 轮  5 ↔ 3  →  1 2 3 | 4 5 6 7
第 4–6 轮  min 都已在 A[i]，自换</code></pre>
<p>比较 6 + 5 + 4 + 3 + 2 + 1 = <strong>21</strong> 次，swap 调用 <strong>6</strong> 次，其中真正交换两个不同位置的只有 <strong>3</strong> 次。每次交换把最小值放到前面的同时，把最大值送到了后面，两端同时归位，3 轮之后数组已经有序。可见“逆序每轮都要交换”也不成立。</p>
  </div>
</details>
`;
