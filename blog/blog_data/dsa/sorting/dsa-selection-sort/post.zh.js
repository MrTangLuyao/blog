/* Post body — dsa-selection-sort / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['dsa-selection-sort:zh'] = `
<p class="lead">选择排序（selection sort）：每一轮从还没排好的部分里挑出最小的元素，换到这部分的最前面。不管输入长什么样，它都要比较 n(n−1)/2 次，所以永远是 Θ(n²)；原地，不稳定。</p>

<h2>从一个场景说起</h2>
<p>体育课上，老师要让一排同学按身高从矮到高站好。最直接的办法是：</p>
<ol>
<li>从头到尾看一遍，找出最矮的同学，让他和站在第 1 个位置的同学换位置。第 1 个位置就定了。</li>
<li>从第 2 个人往后再看一遍，找出剩下的人里最矮的，和第 2 个位置的同学换。</li>
<li>如此重复，每一轮定下一个位置。</li>
</ol>
<p>注意，老师每一轮都得把剩下的人<strong>全部看一遍</strong>，才能确定谁最矮。就算队伍本来已经排好，他事先也不知道，照样要一个个看过去。</p>
<p>选择排序的优点和缺点都从这里来：换位置的次数很少，但“看”的次数一次也省不掉。</p>

<h2>它是什么</h2>
<p>简单说，选择排序就是<strong>每轮选出剩下元素里最小的，放到前面</strong>。</p>
<p>任何时刻，数组都分成两段：</p>
<ul>
<li><strong>已排部分</strong> A[0..i−1]：全体最小的 i 个元素，已经按顺序放好，以后不再改动，就像已经站好的同学。</li>
<li><strong>未排部分</strong> A[i..n−1]：还没处理的元素。</li>
</ul>
<p>第 i 轮（i 从 0 数起）只做两件事：</p>
<ol>
<li><strong>找</strong>：扫描 A[i..n−1]，记下最小值的<strong>下标</strong> min。</li>
<li><strong>换</strong>：交换 A[i] 和 A[min]。已排部分长一格。</li>
</ol>
<p>一共 <strong>n − 1 轮</strong>。前 n − 1 个位置定好后，剩下的那个一定是最大值，不用再找。如果最小值本来就在 A[i]，课上的写法照样执行交换，只是自己和自己换。</p>

<h2>看个例子</h2>
<p>课上的例子是 A = [2, 0, 9, 7, 1, 5, 2]，n = 7。里面有两个 2，用角标区分：原来在下标 0 的记作 2₁，在下标 6 的记作 2₂。</p>
<p>第 1 轮扫描整个数组，最小的是下标 1 的 0，把它和 A[0] = 2₁ 交换。0 到了最前面，以后再也不动它。第 2 轮只看 A[1..6]，最小的是下标 4 的 1，和 A[1] = 2₁ 交换。后面每轮都一样，表里竖线左边是已排部分：</p>
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
<p>第 3 轮有个细节：未排部分里有两个 2。代码用严格小于 <code>&lt;</code> 比较，后碰到的 2₂ 和当前最小的 2₁ 相等，不算“更小”，所以 min 停在先遇到的 2₁（下标 4）。</p>
<p>合计 6 轮、6 次交换，比较 6 + 5 + 4 + 3 + 2 + 1 = 21 次。</p>

<iframe class="anim-frame" src="blog/blog_data/dsa-selection-sort/anims/selection.html" loading="lazy" style="height: 440px;" title="选择排序逐步演示"></iframe>
<p class="anim-caption">按“下一步”一格一格看：j 逐个和当前最小 min 比较，扫完做一次 swap，绿色的已排部分每轮长一格。切到“已排好”“逆序”，比较次数还是 21；切到“反例”，看两个 2 的次序怎么被打乱。</p>

<h2>C 代码</h2>
<p>核心就两层循环加一次交换：</p>
<pre><code>void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void selection_sort(int A[], int n) {
    int i, j, min;
    for (i = 0; i &lt; n - 1; i++) {
        min = i;
        for (j = i + 1; j &lt; n; j++) {
            if (A[j] &lt; A[min]) {
                min = j;
            }
        }
        swap(&amp;A[i], &amp;A[min]);
    }
}</code></pre>
<ul>
<li><strong>第 1–5 行</strong>：<code>swap</code> 借临时变量 tmp 交换两个整数，共 3 次赋值。课上算交换的代价就按 3 次赋值算。</li>
<li><strong>第 9 行</strong>：外层循环 i 从 0 到 n − 2，共 n − 1 轮。i 是这一轮要填的位置。n 为 0 或 1 时一次也不执行。</li>
<li><strong>第 10 行</strong>：先假设 A[i] 就是最小的，min = i。</li>
<li><strong>第 11–15 行</strong>：内层循环从 i + 1 扫到末尾，遇到严格更小的就更新 min。记的是<strong>下标</strong>而不是值，因为最后要按位置交换。</li>
<li><strong>第 16 行</strong>：内层循环结束后才交换，每轮恰好一次。</li>
</ul>
<div class="callout warn" data-label="易错">
<p>把 swap 写进内层循环，一碰到比 A[i] 小的就换。结果仍然有序，比较次数也一样，但交换次数不再是 n − 1：对 [7, 6, 5, 4, 3, 2, 1] 要交换 21 次。这已经不是选择排序了。</p>
</div>

<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/g-PGLbMth_g" title="Selection sort in 3 minutes" loading="lazy" allowfullscreen></iframe>
<p class="anim-caption">视频：Michael Sambol《Selection sort in 3 minutes》（英文），用动画逐轮演示“找最小、换到前面”。计数以课上写法为准：每轮都调用一次 swap，包括自换。</p>

<h2>代价：为什么永远是 Θ(n²)</h2>
<p>课上数两种操作：<strong>比较</strong>（A[j] 和当前最小值比）和<strong>交换</strong>（一次交换 = 3 次赋值）。</p>
<p>第 1 轮未排部分有 n 个元素，要比较 n − 1 次；第 2 轮 n − 2 次；……；最后一轮只剩两个，比较 1 次。</p>
<pre><code class="lang-text">比较：(n−1) + (n−2) + … + 2 + 1 = n(n−1)/2
交换：每轮 1 次，共 n − 1 次，即 3(n − 1) 次赋值
合计：n(n−1)/2 + 3(n−1)  →  Θ(n²)</code></pre>
<p>公式表给的是 1 + 2 + … + n = n(n+1)/2，这里只加到 n − 1，你要自己把 n 换成 n − 1。n = 7 时比较 21 次，n = 100 时比较 4950 次。</p>
<p>关键在于：<strong>比较次数和输入长什么样无关</strong>。就像那位体育老师，队伍已经排好也得每轮看完所有人。所以<strong>最好 = 平均 = 最坏 = Θ(n²)</strong>。输入“差不多有序”也不会让它变快，这叫<strong>不自适应（not adaptive）</strong>。</p>
<p>其他几个性质：</p>
<ul>
<li><strong>原地（in-place）</strong>：额外只用 i、j、min、tmp 几个变量，O(1) 空间。</li>
<li><strong>减治（decrease-and-conquer）</strong>：花 O(n) 把最小值放到最前，剩下 n − 1 个元素还是同一个问题。递推式 <strong>T(n) = T(n−1) + O(n)</strong>，展开得 Θ(n²)，展开过程见 1.8 递推式与展开法。</li>
<li><strong>写得少</strong>：只有 n − 1 次交换，也就是 O(n) 次写内存；插入排序最坏要移动约 n²/2 次（见 5.3 插入排序）。写内存很贵的场合，比如闪存（flash memory），可以考虑它。</li>
</ul>

<h2>为什么不稳定</h2>
<p><strong>稳定（stable）</strong>指相等的键排序后保持原来的先后次序（见 5.1）。选择排序<strong>不稳定（unstable）</strong>，课上的反例是 [2₁, 2₂, 1]：</p>
<ul>
<li>第 1 轮：最小值是下标 2 的 1，和 A[0] = 2₁ 交换，得到 [1, 2₂, 2₁]。</li>
<li>第 2 轮：A[1..2] 是 2₂、2₁，两者相等，min 留在下标 1，自换。</li>
</ul>
<p>结果是 [1, 2₂, 2₁]，原来在前面的 2₁ 跑到了后面。</p>
<p>毛病出在<strong>远距离交换</strong>：A[i] 被一下子甩到 min 的位置，越过了中间所有元素，其中可能就有和它相等的。上面课上数组那次运行里，两个 2 碰巧没乱；但稳定性看的是算法本身，<strong>只要存在一个反例就算不稳定</strong>。</p>
<p>把 <code>&lt;</code> 改成 <code>&lt;=</code> 也救不了：那样会选最后一个并列的最小值，[2₁, 2₂] 第 1 轮就被换成 [2₂, 2₁]。</p>

<h2>考试怎么考</h2>
<ul>
<li><strong>手算</strong>：给一个数组，写出每轮（或第 k 轮）之后的数组，或者问某一轮交换了哪两个元素。</li>
<li><strong>计数、填空</strong>：比较多少次、交换多少次。</li>
<li><strong>选择题</strong>：是否稳定、原地、自适应，最好情况是多少。要举反例就写 2₁, 2₂, 1。</li>
<li><strong>写代码</strong>：两层循环 + 记下标 + 外层末尾 swap，第 7 周 workshop 练过。</li>
</ul>
<p>公式表上只有求和公式，选择排序的复杂度和性质都要自己记。</p>

<h3>例题 1：手算一遍</h3>
<p>对 [6, 4₁, 9, 1, 4₂, 3] 做选择排序，写出每轮之后的数组，并说出两个 4 最后谁在前。</p>
<pre><code class="lang-text">第 1 轮  min = 1（下标 3），6 ↔ 1    →  1 | 4₁ 9 6 4₂ 3
第 2 轮  min = 3（下标 5），4₁ ↔ 3   →  1 3 | 9 6 4₂ 4₁
第 3 轮  min = 4₂（下标 4），9 ↔ 4₂  →  1 3 4₂ | 6 9 4₁
第 4 轮  min = 4₁（下标 5），6 ↔ 4₁  →  1 3 4₂ 4₁ | 9 6
第 5 轮  min = 6（下标 5），9 ↔ 6    →  1 3 4₂ 4₁ 6 | 9</code></pre>
<p>做法：每轮在竖线右边找最小值（并列时取先遇到的），再和竖线右边第一个元素交换。n = 6，共 5 轮，比较 5 + 4 + 3 + 2 + 1 = 15 次。</p>
<p>第 2 轮把 4₁ 从下标 1 一下子换到下标 5，越过了 4₂，所以第 3 轮先被选中的是 4₂。最终 <strong>4₂ 在 4₁ 前面</strong>，这次运行本身就说明了不稳定。</p>

<h3>例题 2：数比较和交换</h3>
<p>用上面的 C 代码排序 100 个元素：比较多少次？调用 swap 多少次？swap 里一共多少次赋值？如果输入已经排好，这三个数会变吗？</p>
<ul>
<li>比较：99 + 98 + … + 1 = 100 × 99 / 2 = <strong>4950</strong> 次。</li>
<li>swap：每轮一次，共 <strong>99</strong> 次。</li>
<li>赋值：3 × 99 = <strong>297</strong> 次。</li>
</ul>
<p>输入已排好时<strong>三个数都不变</strong>：内层循环照样扫完，只是 min 从不更新；99 次 swap 全是自换。</p>

<div class="callout warn" data-label="易错">
<ul>
<li>“已排好的输入是最好情况，Θ(n)”：错，比较次数不变，仍是 Θ(n²)。</li>
<li>“逆序是最坏情况”：错，所有输入一样。[7, 6, 5, 4, 3, 2, 1] 只有前 3 轮真正交换了两个不同位置，后 3 轮都是自换。</li>
<li>比较次数套公式写成 n(n+1)/2：多算了 n。</li>
<li>看到某次运行里相等元素没换位置，就说它稳定。</li>
</ul>
</div>

<h2>小结</h2>
<ul>
<li>每轮在未排部分找最小值的下标，和未排部分第一个元素交换；共 n − 1 轮，已排部分不再改动。</li>
<li>比较永远是 n(n−1)/2 次，交换 n − 1 次：最好 = 平均 = 最坏 = Θ(n²)，不自适应。</li>
<li>原地，O(1) 额外空间；减治，T(n) = T(n−1) + O(n)。</li>
<li>不稳定，反例 [2₁, 2₂, 1] → [1, 2₂, 2₁]，原因是远距离交换。</li>
<li>写代码记住两点：记下标不记值，swap 放在内层循环外面。</li>
</ul>
`;
