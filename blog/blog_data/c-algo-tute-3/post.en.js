/* Post body — c-algo-tute-3 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['c-algo-tute-3:en'] = `
<style>
  .reader-body .anim-frame {
    width: 100%;
    border: 1px solid #3a3a39;
    border-radius: 14px;
    background: #2a2a29;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    display: block;
    margin: 1.4em 0;
  }
  .reader-body .anim-caption {
    text-align: center;
    color: #a1a1a0;
    font-size: 13px;
    font-style: italic;
    margin-top: -0.6em !important;
    margin-bottom: 1.4em;
  }
</style>

<p class="lead">C Algorithms 3 · The final post. We finish what posts 1 and 2 started: <strong>heaps and priority queues</strong> (a complete-binary-tree container that gives O(log n) extract-max forever); <strong>hash tables</strong> (the most influential data structure trading space for O(1) lookup); <strong>BMH</strong> (an alternative string-matching idea that's often faster than KMP in practice); and <strong>two essential algorithm design paradigms</strong> — <em>greedy</em> and <em>dynamic programming</em>. After this post, the "theory" from posts 1 and 2 grounds out into solving real problems.</p>

<h2>Part 10 Heaps & Priority Queues — O(log n) Extract-Max Forever</h2>

<h3>10.1 Without a heap?</h3>
<p>Imagine you're writing a task scheduler: tasks arrive at any time, and you always want to <strong>pick the highest-priority one</strong> to run. Possible structures:</p>

<table>
  <thead><tr><th>Approach</th><th>Insert</th><th>Extract max</th><th>Problem</th></tr></thead>
  <tbody>
    <tr><td>Unsorted array</td><td>O(1) (append)</td><td>O(n) (linear scan)</td><td>Extract too slow</td></tr>
    <tr><td>Sorted array</td><td>O(n) (shift on insert)</td><td>O(1) (take last)</td><td>Insert too slow</td></tr>
    <tr><td>Balanced BST</td><td>O(log n)</td><td>O(log n) (rightmost)</td><td>Works, but complex to implement</td></tr>
    <tr><td><strong>Binary heap</strong></td><td><strong>O(log n)</strong></td><td><strong>O(log n)</strong></td><td>Easiest implementation ⭐</td></tr>
  </tbody>
</table>

<p>A binary heap makes both core ops O(log n) and fits in 30 lines of C. That's why "priority queue" — the ADT — is almost always implemented with a heap.</p>

<h3>10.2 Definition of a Binary Heap</h3>

<p>A <strong>max-heap</strong> has two properties:</p>
<ol>
  <li><strong>Structural</strong>: it's a <strong>complete binary tree</strong> (all levels but the last are full; the last fills left-to-right contiguously)</li>
  <li><strong>Heap-ordered</strong>: <strong>every node's value ≥ its children's values</strong> (≤ for a min-heap)</li>
</ol>

<p>Note: <strong>a heap is NOT a BST</strong>! BSTs require "left &lt; parent &lt; right" — a horizontal ordering. Heaps only require "parent ≥ children" — a vertical ordering. Sibling nodes have no ordering relation.</p>

<h3>10.3 Storing a Heap as an Array</h3>

<p>This is the heap's most elegant feature. A complete binary tree <strong>doesn't need pointers</strong> — store it level-by-level in a plain array:</p>

<pre><code>// Heap a[0..n-1]
// Parent of index i:  (i - 1) / 2
// Left child of i:    2i + 1
// Right child of i:   2i + 2</code></pre>

<p>Why does this work? Because the parent-child relations of a level-numbered complete binary tree are <strong>fixed</strong>. Verify: i=0 is root; i=1's parent = (1-1)/2 = 0 ✓; i=3's parent = 1 ✓; i=4's parent = 1 ✓.</p>

<p>Implication: <strong>a heap fits in a normal array</strong>. No pointers, cache-friendly, compact.</p>

<h4>Dual-view animation</h4>
<p>The animation below shows the heap <strong>simultaneously</strong> as a tree and an array. As insert or heap-sort runs, both views update <strong>in lockstep</strong> — they're the same data shown two ways:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/heap-ops.html" loading="lazy" style="height: 480px;" title="Binary heap"></iframe>
<p class="anim-caption">↑ Switch to "heap sort" mode: each iteration swaps root (the max) with the last unsorted slot, locking that slot as sorted. After n−1 iterations the array is sorted.</p>

<h3>10.4 Insert: Heapify Up (sift up)</h3>

<p>Insert a new value:</p>
<ol>
  <li><strong>Append at the end of the array</strong> (= the rightmost-bottom slot in the tree)</li>
  <li>The new value may exceed its parent → <strong>swap with parent</strong>, climb up</li>
  <li>Repeat until the new value isn't larger than its parent (or it reaches the root)</li>
</ol>

<pre><code>void heap_push(int a[], int *n, int v) {
    int i = (*n)++;
    a[i] = v;
    while (i &gt; 0) {
        int p = (i - 1) / 2;
        if (a[p] &gt;= a[i]) break;       // heap order satisfied
        int t = a[p]; a[p] = a[i]; a[i] = t;
        i = p;
    }
}</code></pre>

<p>Path length ≤ tree height = log n, so <strong>O(log n)</strong>.</p>

<h3>10.5 Extract Max: Heapify Down (sift down)</h3>

<p>Extracting the max is taking the root (a[0]):</p>
<ol>
  <li>Save a[0] for return</li>
  <li>Move the last element <strong>to a[0]</strong> (and decrement size)</li>
  <li>The new a[0] may be smaller than its children → swap with the <strong>larger</strong> child, sink down</li>
  <li>Repeat until the value is no smaller than either child (or it reaches a leaf)</li>
</ol>

<pre><code>int heap_pop(int a[], int *n) {
    int max = a[0];
    a[0] = a[--(*n)];                  // move last to root
    int i = 0;
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2;
        int largest = i;
        if (l &lt; *n &amp;&amp; a[l] &gt; a[largest]) largest = l;
        if (r &lt; *n &amp;&amp; a[r] &gt; a[largest]) largest = r;
        if (largest == i) break;
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        i = largest;
    }
    return max;
}</code></pre>

<p>Same height bound, <strong>O(log n)</strong>.</p>

<h3>10.6 build_heap — O(n), Not O(n log n)</h3>

<p>Given an unsorted array, how do you turn it into a heap? Naively, n pushes: O(n log n). But there's a smarter approach: <strong>start at the last non-leaf node, sift down on each one going up to the root</strong>.</p>

<pre><code>void build_heap(int a[], int n) {
    for (int i = n / 2 - 1; i &gt;= 0; i--) {
        heapify_down(a, n, i);   // same sift-down logic as above
    }
}</code></pre>

<p>Surprisingly, total cost is <strong>O(n)</strong>, not O(n log n).</p>

<p><strong>Why?</strong> Leaves don't need sifting (they're trivially heaps). A node at depth d sifts down at most (h − d) steps (h ≈ log n). Number of nodes at depth d ≤ n / 2^(d+1). Sum the costs:</p>
<pre><code>Total ≈ Σ (h - d) × n/2^(d+1)
      = n × Σ k/2^k       (k = h - d substitution)
      ≤ n × 2             (Σ k/2^k converges to 2)
      = O(n)</code></pre>

<p>Most nodes are near the bottom, with short sift paths — so the average is constant. That's where O(n) build_heap comes from.</p>

<h3>10.7 Heap Sort</h3>

<p>Sort an array <strong>in place</strong>:</p>
<ol>
  <li>build_heap(a, n) — O(n) builds a max-heap</li>
  <li>Swap a[0] (max) with a[n-1]. The max is locked at the end.</li>
  <li>Sift down on the first n-1 elements (from root) to restore heap property</li>
  <li>Swap a[0] with a[n-2]. The 2nd max locks at n-2.</li>
  <li>... repeat n-1 times</li>
</ol>

<pre><code>void heap_sort(int a[], int n) {
    build_heap(a, n);
    for (int end = n - 1; end &gt; 0; end--) {
        int t = a[0]; a[0] = a[end]; a[end] = t;
        heapify_down(a, end, 0);   // shrink heap by 1, sift down
    }
}</code></pre>

<h4>Evaluation</h4>
<table>
  <thead><tr><th>Dimension</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Best / worst / avg</td><td>All O(n log n)</td></tr>
    <tr><td>Space</td><td>O(1), <strong>in place</strong></td></tr>
    <tr><td>Stable</td><td>No</td></tr>
    <tr><td>Real-world speed</td><td>Slower than quicksort (cache-unfriendly — random array jumps)</td></tr>
  </tbody>
</table>

<p>Heap sort is rarely the <strong>main</strong> sort in production, but it's the safety net of <strong>introsort</strong> (the implementation behind C++ <code>std::sort</code>) — when quicksort recurses too deep, switch to heap sort to guarantee O(n log n) worst case. It's the "carried but rarely used" hero.</p>

<h3>10.8 Priority Queue ADT</h3>

<p>The heap is just an implementation. <strong>Priority queue</strong> is the ADT name. Its interface:</p>
<table>
  <thead><tr><th>Operation</th><th>Meaning</th><th>Heap impl</th></tr></thead>
  <tbody>
    <tr><td><code>push(v)</code></td><td>Add an element</td><td>O(log n)</td></tr>
    <tr><td><code>pop()</code> / <code>extract_max()</code></td><td>Remove and return the extreme</td><td>O(log n)</td></tr>
    <tr><td><code>peek()</code> / <code>top()</code></td><td>Glance at the extreme</td><td>O(1)</td></tr>
    <tr><td><code>size()</code></td><td>Current size</td><td>O(1)</td></tr>
  </tbody>
</table>

<p><strong>Common uses:</strong></p>
<ul>
  <li>Task scheduling (by priority)</li>
  <li>Dijkstra's shortest path (next node by current shortest distance)</li>
  <li>Huffman coding (merge two smallest frequencies)</li>
  <li>Event-driven simulation (next event by timestamp)</li>
  <li>"Top K largest" problems (use a min-heap of size K)</li>
</ul>

<hr>

<h2>Part 11 Hash Tables — Trade Space for Time, Pushed to the Limit</h2>

<h3>11.1 Without hash tables?</h3>
<p>We've seen several "lookup-capable" structures so far:</p>

<table>
  <thead><tr><th>Structure</th><th>Lookup</th><th>Insert</th></tr></thead>
  <tbody>
    <tr><td>Unsorted array</td><td>O(n)</td><td>O(1)</td></tr>
    <tr><td>Sorted array (binary search)</td><td>O(log n)</td><td>O(n)</td></tr>
    <tr><td>Balanced BST / AVL</td><td>O(log n)</td><td>O(log n)</td></tr>
    <tr><td><strong>Hash table</strong></td><td><strong>O(1)*</strong></td><td><strong>O(1)*</strong></td></tr>
  </tbody>
</table>

<p>* Average case. Worst-case it degrades to O(n), but with a non-terrible hash function the worst case almost never happens.</p>

<p>Hash tables are <strong>among the most-used data structures</strong> — Python's <code>dict</code>, JavaScript's <code>Object</code> and <code>Map</code>, Java's <code>HashMap</code>. The design philosophy is one sentence: <strong>use a math function to map "key" directly to a memory address</strong>.</p>

<h3>11.2 The Hash Function</h3>

<p>A hash function <code>h(key)</code> takes any key and returns an integer in a fixed range (the "bucket index"). Simplest example:</p>

<pre><code>// integer key, m buckets
int hash(int key, int m) {
    return key % m;     // modulo
}</code></pre>

<p>For string keys, <strong>polynomial hashing</strong> is common:</p>

<pre><code>unsigned hash_str(const char *s, unsigned m) {
    unsigned h = 0;
    while (*s) {
        h = h * 31 + (unsigned char)*s++;   // 31 is a "magic" small prime
    }
    return h % m;
}</code></pre>

<h4>What makes a "good" hash function?</h4>
<ol>
  <li><strong>Fast to compute</strong>: O(1) or close</li>
  <li><strong>Uniform distribution</strong>: distinct keys spread across buckets</li>
  <li><strong>Avalanche</strong>: similar keys produce very different outputs (so similar keys don't cluster)</li>
  <li><strong>Deterministic</strong>: same key → same bucket, always</li>
</ol>

<p>"Perfect hashing" (no collisions ever) is only possible when the key set is <strong>known in advance and fixed</strong>. In general, <strong>collisions are unavoidable</strong> — handling them is the heart of hash table design.</p>

<h3>11.3 Collision Handling: Chaining</h3>

<p>Each bucket stores not "one value" but "a linked list of values":</p>

<pre><code>typedef struct Entry {
    int key, value;
    struct Entry *next;
} Entry;

#define M 1024
Entry *table[M];      // each bucket = head of a list

void insert(int key, int value) {
    int h = key % M;
    Entry *e = malloc(sizeof(Entry));
    e-&gt;key = key; e-&gt;value = value;
    e-&gt;next = table[h];
    table[h] = e;     // insert at head (O(1))
}

int *find(int key) {
    int h = key % M;
    for (Entry *e = table[h]; e != NULL; e = e-&gt;next) {
        if (e-&gt;key == key) return &amp;e-&gt;value;
    }
    return NULL;
}</code></pre>

<h3>11.4 Collision Handling: Open Addressing</h3>

<p>Each bucket stores at most <strong>one</strong> element. On collision, <strong>probe to the next empty bucket</strong> using some rule:</p>

<table>
  <thead><tr><th>Probing</th><th>Rule</th></tr></thead>
  <tbody>
    <tr><td><strong>Linear probing</strong></td><td>h, h+1, h+2, ... (mod m)</td></tr>
    <tr><td>Quadratic probing</td><td>h, h+1², h+2², h+3², ...</td></tr>
    <tr><td>Double hashing</td><td>h, h+h2(k), h+2·h2(k), ... (second hash for the step)</td></tr>
  </tbody>
</table>

<p>Linear probing is simplest:</p>
<pre><code>#define M 1024
int  keys[M], values[M];
char used[M];          // 0 = empty, 1 = occupied

void insert(int key, int value) {
    int h = key % M;
    while (used[h]) {
        if (keys[h] == key) { values[h] = value; return; }
        h = (h + 1) % M;
    }
    keys[h] = key; values[h] = value; used[h] = 1;
}</code></pre>

<h4>Comparison</h4>
<p>The animation runs the same key sequence under both schemes. Watch:</p>
<ul>
  <li><strong>Chaining</strong>: collisions hang multiple entries on the same bucket; lookup walks the chain</li>
  <li><strong>Open addressing</strong>: collisions probe forward to find a vacancy; lookup follows the probe path</li>
</ul>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/hash-table.html" loading="lazy" style="height: 380px;" title="Hash table — chaining vs open addressing"></iframe>
<p class="anim-caption">↑ Toggle the two modes to see the same keys land differently. Chaining can hold infinite items per bucket; open addressing fails when the table fills up.</p>

<h3>11.5 Load Factor and Rehashing</h3>

<p><strong>Load factor</strong> α = elements / buckets. It directly drives performance:</p>

<table>
  <thead><tr><th>Approach</th><th>Recommended α cap</th><th>As α grows</th></tr></thead>
  <tbody>
    <tr><td>Chaining</td><td>≈ 1.0 (can exceed)</td><td>Chains lengthen, lookup slows</td></tr>
    <tr><td>Open addressing</td><td>&lt; 0.7</td><td>Probe path explodes, performance crashes ⚠️</td></tr>
  </tbody>
</table>

<p>When α exceeds the threshold, <strong>rehash</strong>:</p>
<ol>
  <li>Allocate a new table, doubling the bucket count (often to the next prime)</li>
  <li><strong>Re-hash every existing element</strong> into the new table (m changed, so h(key) % m changed)</li>
  <li>Free the old table</li>
</ol>

<p>Single rehash is O(n). But amortised, each insert is still O(1) — every doubling buys n more inserts before the next rehash, so amortised O(n)/n = O(1). This "rare-but-expensive" technique is called <strong>amortised analysis</strong>.</p>

<h3>11.6 Worst-case</h3>

<p>The "worst-case O(n)" is real — when all keys hash to the same bucket (chaining → one long chain; open addressing → linear probe across half the table).</p>
<p>Mitigations:</p>
<ul>
  <li><strong>Use good hash functions</strong>. Java's HashMap (since Java 8) <strong>turns chains into red-black trees</strong> when chain length ≥ 8 — bounding worst case to O(log n).</li>
  <li><strong>Hash randomisation</strong>. Python 3.3+ randomises string hashing per process to make collision attacks infeasible.</li>
</ul>

<blockquote>Tip For most engineering work: integer key (e.g. an ID), modulo a <strong>prime</strong>, chaining = good enough 99% of the time. Hash tables are a "trust the default" structure — only optimise after profiling shows hashing as the bottleneck.</blockquote>

<hr>

<h2>Part 12 BMH — A Different Idea Than KMP for String Matching</h2>

<p>In post 2 we learned KMP — theoretically O(n+m). But <strong>in practice</strong>, <code>strstr</code>, <code>grep</code>, and friends rarely use KMP. They favour <strong>Boyer-Moore</strong> or its simpler cousin <strong>Boyer-Moore-Horspool (BMH)</strong>. The reason is a counter-intuitive fact:</p>

<blockquote>For most realistic inputs, <strong>BMH is faster than KMP</strong> — even though BMH's worst case is O(nm).</blockquote>

<h3>12.1 BMH's Core Idea</h3>

<p>BMH and KMP share one premise: <strong>don't restart from scratch on a mismatch</strong>. But the strategies are completely different:</p>
<ul>
  <li>KMP: scans left-to-right; on mismatch uses next[] to bring j to the right prefix; i never backtracks</li>
  <li>BMH: <strong>scans right-to-left</strong>; on mismatch uses a shift table to slide the <strong>entire pattern</strong> right by potentially many positions</li>
</ul>

<p>BMH's punchline: on a mismatch, <strong>look at the rightmost character of the current text window</strong>, look up the shift table, and slide the pattern right by that amount. Often the slide is m (full pattern length) — completely skipping intermediate alignments.</p>

<h3>12.2 Building the Shift Table</h3>

<p>For pattern P of length m, <code>shift[c]</code> tells you: <strong>how far to slide the pattern when you see character c</strong>.</p>

<p>Rules:</p>
<ul>
  <li>For each character in P[0..m-2] (excluding the last!), <code>shift[P[i]] = m - 1 - i</code>. If a character appears multiple times, <strong>take the last occurrence (largest i)</strong> — the smaller (more conservative) shift.</li>
  <li>For any character not in P[0..m-2]: <code>shift[c] = m</code> (slide the full pattern length)</li>
</ul>

<p><strong>Example:</strong> P = "NEEDLE" (m=6). Look at P[0..4] = "NEEDL":</p>
<ul>
  <li>i=0: N → shift[N] = 5</li>
  <li>i=1: E → shift[E] = 4</li>
  <li>i=2: E → shift[E] = 3 (overwrites)</li>
  <li>i=3: D → shift[D] = 2</li>
  <li>i=4: L → shift[L] = 1</li>
  <li>Other chars: shift[c] = 6</li>
</ul>

<h3>12.3 The Main Match Loop</h3>

<pre><code>int bmh_search(const char *text, const char *pattern) {
    int n = strlen(text), m = strlen(pattern);
    int shift[256];
    for (int c = 0; c &lt; 256; c++) shift[c] = m;
    for (int i = 0; i &lt; m - 1; i++) shift[(unsigned char)pattern[i]] = m - 1 - i;

    int i = 0;
    while (i &lt;= n - m) {
        int j = m - 1;
        // compare right-to-left
        while (j &gt;= 0 &amp;&amp; pattern[j] == text[i + j]) j--;
        if (j &lt; 0) return i;     // full match
        // mismatch: slide using rightmost char of current window
        i += shift[(unsigned char)text[i + m - 1]];
    }
    return -1;
}</code></pre>

<h3>12.4 Animation: Naive vs KMP vs BMH</h3>

<p>Same text and pattern, all three algorithms run on it. Watch the comparison counts:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/bmh.html" loading="lazy" style="height: 500px;" title="Naive vs KMP vs BMH"></iframe>
<p class="anim-caption">↑ Toggle the three modes on the same input. KMP mode shows the next[] table below; BMH mode shows the shift table; Naive mode has no helper table — just brute compare-and-shift-by-one.</p>

<h3>12.5 Complexity</h3>

<table>
  <thead><tr><th>Case</th><th>BMH</th><th>KMP</th></tr></thead>
  <tbody>
    <tr><td>Best</td><td>O(n / m) (shift m every time) ⭐</td><td>O(n)</td></tr>
    <tr><td>Worst</td><td>O(n × m)</td><td>O(n + m) ⭐</td></tr>
    <tr><td>Average (random text)</td><td>O(n / m) — faster in practice ⭐</td><td>O(n)</td></tr>
  </tbody>
</table>

<p>BMH's worst case is real (e.g. text = "AAAA...A", pattern = "BAAAA" — A in the shift table maps to a small shift). But on random or natural-language text, <strong>BMH is often 3-5× faster than KMP</strong> in measurements.</p>

<h3>12.6 Going Further: Full Boyer-Moore</h3>

<p>BMH simplifies BM to its "bad-character" heuristic. Full BM also uses a "good-suffix" heuristic — essentially BMH plus KMP's failure-function idea. Full BM has O(n + m) worst-case and is even faster average than BMH. But the implementation gets complex, and BMH is already "good enough" for typical text — so industrial code (GNU grep, glibc <code>memmem</code>) tends to pick BMH or a small variant.</p>

<blockquote>Choosing ① short pattern + large alphabet (natural text, UTF-8) → <strong>BMH</strong>. ② Long pattern / repetitive patterns (DNA, binary streams) → <strong>KMP</strong> or full BM. ③ Multiple patterns at once → Aho-Corasick automaton (KMP extended onto a trie).</blockquote>

<hr>

<h2>Part 13 Algorithm Design Paradigms — Greedy and Dynamic Programming</h2>

<p>Parts 1-12 were about <strong>specific algorithms</strong>. This part is about <strong>design paradigms</strong> — how to <em>think</em> when facing a new problem. Master these and you'll handle 80% of problems that "look unfamiliar".</p>

<h3>13.1 Greedy</h3>

<h4>Without greedy thinking?</h4>
<p>For some problems your first instinct is "enumerate all possible choices, pick the best" — that's <strong>brute-force search</strong>, exponential time. <strong>Greedy</strong>'s core idea:</p>
<blockquote>At each step, make the choice that <strong>looks best right now</strong>. Don't second-guess; don't worry about regretting it later. If this strategy is correct, you can solve the problem in O(n log n) or O(n) instead of exponential.</blockquote>

<p>Greedy isn't universal — it only works when "<strong>locally optimal → globally optimal</strong>" holds. This property is the <strong>greedy choice property</strong> and requires mathematical proof. If you can't prove it, greedy is wrong.</p>

<h4>The most intuitive example: minimum coins to make N cents</h4>
<p><strong>Problem</strong>: you have coins of denominations 1, 5, 10, 25, 50, 100 (unlimited of each). Make N cents using the fewest coins.</p>

<p><strong>Greedy strategy</strong>: at each step, take the <strong>largest denomination that doesn't exceed the remaining amount</strong>. Subtract, continue.</p>

<p>Example: making 87 cents</p>
<pre><code>87 ≥ 50: take a 50, remainder 37
37 ≥ 25: take a 25, remainder 12
12 ≥ 10: take a 10, remainder  2
 2 ≥  1: take a  1, remainder  1
 1 ≥  1: take a  1, remainder  0
Total: 5 coins (50 + 25 + 10 + 1 + 1)</code></pre>

<h4>Animation</h4>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/greedy-coin.html" loading="lazy" style="height: 460px;" title="Greedy: coin change"></iframe>
<p class="anim-caption">↑ The yellow-highlighted coin is the "largest available denomination" each step. Greedy never looks back. Try a different target.</p>

<h4>Code</h4>
<pre><code>int coin_change_greedy(int amount, int *picked) {
    int denoms[] = {100, 50, 25, 10, 5, 1};   // largest to smallest
    int n_denoms = 6;
    int count = 0;
    for (int i = 0; i &lt; n_denoms; i++) {
        while (amount &gt;= denoms[i]) {
            picked[count++] = denoms[i];
            amount -= denoms[i];
        }
    }
    return count;     // number of coins used
}</code></pre>
<p>Each denomination scanned once: <strong>O(denoms + answer size)</strong> — basically O(1) for this fixed denomination set.</p>

<h4>BUT — greedy needs a proof</h4>
<p>For US / Chinese coin denominations, the greedy is correct (provably). But <strong>change the denomination set and greedy breaks</strong>. Counter-example: denominations [1, 3, 4], target 6:</p>
<pre><code>Greedy: 4 + 1 + 1 = 3 coins
Optimal: 3 + 3 = 2 coins</code></pre>
<p>Greedy used one extra coin! That's why greedy <strong>requires proof</strong> — a strategy that looks right may break on different inputs. <strong>Don't trust greedy without a proof.</strong></p>

<h4>Another classic: Dijkstra's Shortest Path</h4>
<p>Dijkstra is also greedy: repeatedly pick the unvisited node with the smallest known distance, then relax its neighbours. Its correctness depends on <strong>"non-negative edges"</strong> — with negative edges greedy fails (use Bellman-Ford instead). Another "breaks under different conditions" example.</p>

<h4>When greedy doesn't work</h4>
<p>Beyond the bad-coin counter-example, the most classic case: <strong>0/1 knapsack</strong>. Given items (weight, value), a knapsack with capacity, find max total value. The intuitive greedy "sort by value/weight ratio, pack largest first" — wrong. Counter-example:</p>
<pre><code>Capacity = 50
Item A: weight 10, value 60 (ratio 6.0)
Item B: weight 20, value 100 (ratio 5.0)
Item C: weight 30, value 120 (ratio 4.0)

Greedy: take A (40 left), take B (20 left). C doesn't fit. Total = 160.
Optimal: B + C, total = 220.</code></pre>
<p>Greedy was wrong. Use <strong>dynamic programming</strong>.</p>

<h3>13.2 Dynamic Programming (DP)</h3>

<h4>Without DP?</h4>
<p>Many problems have <strong>recursive structure</strong> — big problems decompose into sub-problems whose solutions combine to solve the big one. Like Fibonacci: <code>fib(n) = fib(n-1) + fib(n-2)</code>. But naive recursion <strong>recomputes exponentially</strong>:</p>
<pre><code>            fib(5)
           /       \
       fib(4)      fib(3)
       /    \      /    \
   fib(3) fib(2) fib(2) fib(1)
   /  \    ...
fib(2) fib(1)
...</code></pre>
<p>fib(2) is computed 3 times. fib(3) twice. Total work is O(2ⁿ) — unworkable.</p>

<p><strong>DP's core idea</strong>: each sub-problem is <strong>computed once</strong>, the result cached for reuse. This trick is <strong>memoisation</strong>.</p>

<h4>Two ways to write DP</h4>

<p><strong>① Top-down + memoisation</strong>:</p>
<pre><code>int memo[100];   // -1 = uncomputed

int fib(int n) {
    if (n &lt; 2) return n;
    if (memo[n] != -1) return memo[n];   // cache hit
    return memo[n] = fib(n - 1) + fib(n - 2);
}</code></pre>
<p>Recursive form, but check the cache first. The exponential becomes <strong>O(n)</strong> (each n computed once).</p>

<p><strong>② Bottom-up + table fill</strong>:</p>
<pre><code>int fib(int n) {
    if (n &lt; 2) return n;
    int dp[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i &lt;= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}</code></pre>
<p>Start from the smallest sub-problem and fill the table in dependency order. Same O(n).</p>

<p>Both correspond to the same DP idea: <strong>memoisation eliminates redundant work</strong>.</p>

<h4>Two markers of DP</h4>
<p>What problems suit DP?</p>
<ol>
  <li><strong>Optimal substructure</strong>: a big problem's optimal solution can be built from sub-problems' optimal solutions</li>
  <li><strong>Overlapping sub-problems</strong>: the recursion repeatedly hits the same sub-problems (otherwise memoisation buys you nothing)</li>
</ol>

<p>0/1 knapsack has both: "max value with item index ≤ i and remaining capacity c" can be expressed in terms of "i-1, c" and "i-1, c - weight[i]". And the same (i, c) pair recurs many times. So DP applies.</p>

<h3>13.3 Classic DP: Longest Common Subsequence (LCS)</h3>

<p><strong>Problem</strong>: given strings X and Y, find the longest <em>subsequence</em> (not required to be contiguous, but in order) that's a subsequence of both X and Y.</p>

<p>Example: X = "ABCBDAB", Y = "BDCAB". LCS = "BCAB" or "BDAB", length 4.</p>

<h4>State and recurrence</h4>
<p><code>dp[i][j]</code> = LCS length of X's first i chars and Y's first j chars.</p>

<pre><code>if (X[i-1] == Y[j-1]):
    dp[i][j] = dp[i-1][j-1] + 1       // chars match → extend LCS
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])   // chars differ → take the better neighbour

base: dp[0][*] = dp[*][0] = 0</code></pre>

<h4>Animation: filling the DP table</h4>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-3/anims/dp-lcs.html" loading="lazy" style="height: 460px;" title="DP: LCS"></iframe>
<p class="anim-caption">↑ Yellow = current cell being filled. Blue = its source neighbours. Green = match cells. After filling, traceback from bottom-right (orange path); each green-match cell visited adds its char to the LCS.</p>

<h4>Code</h4>
<pre><code>int lcs(const char *X, const char *Y) {
    int m = strlen(X), n = strlen(Y);
    int dp[m + 1][n + 1];
    for (int i = 0; i &lt;= m; i++) dp[i][0] = 0;
    for (int j = 0; j &lt;= n; j++) dp[0][j] = 0;
    for (int i = 1; i &lt;= m; i++) {
        for (int j = 1; j &lt;= n; j++) {
            if (X[i - 1] == Y[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                int up = dp[i - 1][j], left = dp[i][j - 1];
                dp[i][j] = up &gt; left ? up : left;
            }
        }
    }
    return dp[m][n];
}</code></pre>

<p>Time O(mn), space O(mn) (can be optimised to O(min(m,n)) with extra care).</p>

<h4>Reconstructing the LCS string</h4>
<p>Just knowing the length isn't enough — how do you build the actual LCS? Trace back from dp[m][n]:</p>

<pre><code>// Walk from dp[m][n] back to dp[0][0]
i = m; j = n;
result = "";
while (i &gt; 0 &amp;&amp; j &gt; 0) {
    if (X[i-1] == Y[j-1]) {
        result = X[i-1] + result;    // prepend the char
        i--; j--;
    } else if (dp[i-1][j] &gt;= dp[i][j-1]) {
        i--;     // up was bigger, go up
    } else {
        j--;     // left was bigger, go left
    }
}
// result is the LCS</code></pre>

<h3>13.4 Five-Step DP Recipe</h3>
<p>For a new "this might need DP" problem, follow these steps:</p>
<ol>
  <li><strong>Define the state</strong>: what does <code>dp[?]</code> represent? Dimensions usually mirror the problem's "size parameters" (array index, remaining capacity, current string position…)</li>
  <li><strong>Find the transition</strong>: how does <code>dp[current]</code> derive from <code>dp[smaller]</code>? <em>Hardest</em> step.</li>
  <li><strong>Identify base cases</strong>: smallest states' initial values.</li>
  <li><strong>Determine fill order</strong>: ensure all dependencies are computed before you compute <code>dp[X]</code>. Usually a specific loop order over the dimensions.</li>
  <li><strong>Reconstruct (if needed)</strong>: trace back through DP values to build the actual solution.</li>
</ol>

<h3>13.5 Greedy vs DP — How to Choose?</h3>
<table>
  <thead><tr><th></th><th>Greedy</th><th>DP</th></tr></thead>
  <tbody>
    <tr><td>Strategy</td><td>Pick the locally best at each step</td><td>Enumerate all possible sub-problem choices</td></tr>
    <tr><td>Speed</td><td>Faster (typically O(n log n))</td><td>Slower (typically O(n²) or O(nm))</td></tr>
    <tr><td>Correctness</td><td>Needs greedy choice property — must be proven</td><td>Always correct on problems with optimal substructure + overlapping sub-problems</td></tr>
    <tr><td>Typical problems</td><td>Activity selection, Huffman, Dijkstra (non-negative), MST</td><td>Knapsack, LCS, longest increasing subsequence, edit distance, matrix chain</td></tr>
  </tbody>
</table>

<p><strong>How to choose?</strong> For a new problem:</p>
<ol>
  <li>Try greedy first. If you can prove it, use it — performance is better.</li>
  <li>Can't prove it, or you find a counter-example → DP.</li>
  <li>Can't even formulate DP (state space exponential) → maybe branch-and-bound, approximation, or proof of NP-hardness.</li>
</ol>

<hr>

<h2>Three-Post Wrap-Up</h2>

<p>Across three posts we walked the <strong>full path from foundations to design paradigms</strong>. Looking back:</p>

<table>
  <thead><tr><th>Post</th><th>Core training</th><th>Main tools</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Build the "evaluation" dimensions</td><td>Big O · recursion · divide & conquer · binary search · O(n²) sorts</td></tr>
    <tr><td>2</td><td>From "primitive" to "efficient"</td><td>Merge/quicksort · ADT · linked lists/stack/queue · trees/BST/AVL · KMP</td></tr>
    <tr><td>3</td><td>From "specific algorithms" to "thinking paradigms"</td><td>Heaps · hash tables · BMH · greedy · DP</td></tr>
  </tbody>
</table>

<h3>Advice for newcomers</h3>
<ol>
  <li><strong>Don't just read</strong>. Watching an animation once is just an introduction — type each snippet out, run it, debug your own bugs. That's where understanding sticks.</li>
  <li><strong>Keep coming back to Big O</strong>. When you learn a new algorithm, immediately think through its best/worst/average. The more you use the ruler, the more intuitively you'll feel each algorithm's "weight".</li>
  <li><strong>Start with "why"</strong>, not "how". Every data structure / algorithm solves a specific pain point. Understanding the pain matters 10× more than memorising the implementation.</li>
  <li><strong>Don't roll your own hash / balanced BST</strong>. Understand the principles, but use the standard library in production. Unless you're writing the standard library.</li>
  <li><strong>Solve problems</strong>. LeetCode, Codeforces, AtCoder. 10 algorithms learned vs. 100 problems solved — the latter wins by far.</li>
</ol>

<h3>Where to go next?</h3>
<ul>
  <li><strong>Graph algorithms</strong>: BFS / DFS / Dijkstra / Floyd / topological sort / MST / SCC</li>
  <li><strong>More DP</strong>: knapsack family, interval DP, bitmask DP, tree DP, digit DP</li>
  <li><strong>Advanced data structures</strong>: union-find, segment tree, Fenwick tree, trie</li>
  <li><strong>Competitive programming</strong>: <em>Competitive Programming Handbook</em> (CP Handbook) or <em>Algorithm Design Manual</em></li>
  <li><strong>Systematic textbooks</strong>: CLRS <em>Introduction to Algorithms</em> — rigorous and exhaustive; Sedgewick <em>Algorithms</em> — more engineering-oriented</li>
</ul>

<p>By the time you finish these three posts, you'll have <strong>the foundation to read the "algorithm" sections of most CS papers</strong>. Algorithms aren't a genius-only field — they're a set of <strong>learnable thinking tools</strong>. Take it one post at a time, drill the basics; a year from now you'll look back at your first piece of code and think "I can actually see why I wrote it that way."</p>

<p>Thanks for reading this far. <strong>End of post 3, end of the series.</strong> Happy coding.</p>
`;
