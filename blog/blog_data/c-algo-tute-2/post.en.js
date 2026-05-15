/* Post body — c-algo-tute-2 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['c-algo-tute-2:en'] = `
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

<p class="lead">C Algorithms 2 · This post does four things: ① upgrade the O(n²) sorts to O(n log n) (merge sort, quicksort) and prove why no comparison-based sort can beat O(n log n); ② introduce <strong>abstract data types</strong> (ADTs) — separating <em>interface</em> from <em>implementation</em>; ③ enter the world of data structures, starting with the linked-list family (singly, doubly, stack, queue); ④ trees — binary trees, four traversal orders, binary search trees, and why we need balance. Plus a bonus star — the elegant <strong>KMP</strong> string-matching algorithm. This post is dense in concepts, but every section opens with <strong>why we need it</strong> and ends with an animation that makes it click. Stick with it: every "complex algorithm" turns out to be just one or two simple ideas combined.</p>

<h2>Part 5 Efficient Sorting — Speed Up by an Entire Class</h2>
<p>In post 1 we met three O(n²) sorts: bubble, selection, insertion. They're fine — until n grows. <strong>At n = 10,000 they're already a hundred million operations (a few seconds on a normal machine); at n = 10⁶ they're 10¹² operations — several hours</strong>. So nobody uses them on real-world big data.</p>
<p>This part introduces two genuinely fast sorts: <strong>merge sort</strong> and <strong>quicksort</strong>. Both run in O(n log n). That's not just a bit faster — it's a different growth class entirely. At n = 10⁶, O(n log n) is around 2×10⁷ ops — about 50,000× faster than O(n²). At the end of the section we'll prove that <strong>any comparison-based sort must take at least O(n log n) in the worst case</strong> — a theoretical floor, not an engineering shortcoming.</p>

<h3>5.1 Merge Sort</h3>

<h4>Why merge sort exists</h4>
<p>In post 1 we learned <strong>divide and conquer</strong>: split a problem in half, recurse on each half, combine the answers. Merge sort is the <strong>most classic</strong> application:</p>
<ol>
  <li>Split the array in half.</li>
  <li>Sort the left half and the right half separately (recursive call to merge sort itself).</li>
  <li>Merge the two <strong>already-sorted</strong> halves into one big sorted array.</li>
</ol>

<p>Steps 1 and 2 just split — they don't actually do work. <strong>All the computation happens in step 3 — the merge.</strong> So the heart of understanding merge sort is one question:</p>

<blockquote>Given two sorted arrays, how do you merge them into one sorted array?</blockquote>

<p><strong>Two pointers, one pass:</strong></p>
<pre><code>// Given sorted left[] and right[], merge into out[]
int i = 0, j = 0, k = 0;
while (i &lt; len_left &amp;&amp; j &lt; len_right) {
    if (left[i] &lt;= right[j]) out[k++] = left[i++];
    else                      out[k++] = right[j++];
}
// One side is exhausted — copy the rest of the other side
while (i &lt; len_left)  out[k++] = left[i++];
while (j &lt; len_right) out[k++] = right[j++];</code></pre>

<p>Total cost: O(L + R), one pass. <strong>Whichever side has the smaller front element wins the slot; that side's pointer advances; the other stays.</strong></p>

<h4>See it in action</h4>
<p>The animation below runs the entire merge sort. <strong>Orange</strong> bars are the current left half, <strong>blue</strong> the right half, <strong>yellow</strong> the value just picked. The <strong>bottom row is the temp buffer</strong> — that's <code>out[]</code>, filled left to right as picks happen. After all merges complete, every bar turns green:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/merge-sort.html" loading="lazy" style="height: 480px;" title="Merge sort"></iframe>
<p class="anim-caption">↑ Hit ▶ for the full sweep, or step frame-by-frame. Notice the comparison and write counters — comparisons ≈ n log n, writes = n × log n.</p>

<h4>Full C code</h4>
<pre><code>void merge(int a[], int lo, int mid, int hi) {
    int n = hi - lo + 1;
    int *tmp = malloc(n * sizeof(int));   // temp buffer for this merge range
    int i = lo, j = mid + 1, k = 0;
    while (i &lt;= mid &amp;&amp; j &lt;= hi) {
        if (a[i] &lt;= a[j]) tmp[k++] = a[i++];
        else              tmp[k++] = a[j++];
    }
    while (i &lt;= mid) tmp[k++] = a[i++];
    while (j &lt;= hi)  tmp[k++] = a[j++];
    for (int t = 0; t &lt; n; t++) a[lo + t] = tmp[t];   // copy back
    free(tmp);
}

void merge_sort(int a[], int lo, int hi) {
    if (lo &gt;= hi) return;                             // single element: trivially sorted
    int mid = lo + (hi - lo) / 2;
    merge_sort(a, lo, mid);                           // recurse left
    merge_sort(a, mid + 1, hi);                       // recurse right
    merge(a, lo, mid, hi);                            // merge
}

// Call: merge_sort(arr, 0, n - 1);</code></pre>

<h4>Why O(n log n)?</h4>
<p>Two layers of analysis:</p>
<ul>
  <li><strong>Per recursion level:</strong> the merge ranges partition the array; every element is touched once (during its merge). One level total: <strong>O(n)</strong>.</li>
  <li><strong>Number of levels:</strong> each split halves the range, from n down to 1 — that's <strong>log₂ n</strong> levels.</li>
  <li>Multiply: <strong>O(n) × O(log n) = O(n log n)</strong>.</li>
</ul>

<h4>Evaluation</h4>
<table>
  <thead><tr><th>Dimension</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Best / worst / avg</td><td>All <strong>O(n log n)</strong> (depth and merge cost don't depend on input)</td></tr>
    <tr><td>Space</td><td><strong>O(n)</strong> (temp buffer — <em>not</em> in-place)</td></tr>
    <tr><td>Stable</td><td><strong>Yes</strong> (the <code>&lt;=</code> in the merge gives left ties priority)</td></tr>
    <tr><td>Adaptive</td><td>No (always splits and merges, even on already-sorted input)</td></tr>
  </tbody>
</table>

<blockquote>Note Merge sort's <strong>downside</strong> is the O(n) extra space. For embedded systems or huge data sets, that's a real problem. Its upside is a <strong>worst-case</strong> O(n log n) guarantee — quicksort can degrade to O(n²) on bad inputs, merge sort never does. So when you need <strong>stability + worst-case bounds</strong> (external sorting, sorting linked lists), merge sort is the choice.</blockquote>

<h3>5.2 Quicksort</h3>

<h4>Why we still need quicksort</h4>
<p>Merge sort is fast, but it has two annoyances: ① O(n) extra space; ② a relatively large constant factor (lots of memory copying). <strong>Quicksort fixes both</strong>: in-place (O(1) extra, ignoring the recursion stack), small constants, and on average 2-3× faster than merge sort on arrays. The price is that <strong>worst case it degrades to O(n²)</strong> — but with a halfway-decent pivot strategy, the average is O(n log n).</p>

<h4>Core idea: partition</h4>
<p>Quicksort is also divide-and-conquer, but partitions differently from merge sort:</p>
<ol>
  <li>Pick a <strong>pivot</strong> (one element of the array).</li>
  <li>Rearrange the array so that <strong>everything ≤ pivot is on the left, everything &gt; pivot is on the right</strong>. This step is the <strong>partition</strong>. After partitioning, the pivot is <strong>already in its final position</strong> — it'll never move again.</li>
  <li>Recursively quicksort the left half and the right half (excluding the pivot).</li>
</ol>

<p>Compare with merge sort:</p>
<ul>
  <li>Merge sort: <em>no work on the way down, all work on the way up</em>. Recurse to leaves first, then merge upward.</li>
  <li>Quicksort: <em>work on the way down, no work on the way up</em>. The partition does everything; once each subrange's pivot is placed, there's no "combine" step.</li>
</ul>

<h4>Lomuto partition (the simplest implementation)</h4>
<p>The Lomuto scheme picks the <strong>rightmost</strong> element as the pivot, then maintains a pointer <code>i</code> as the boundary of "values known to be ≤ pivot", with <code>j</code> sweeping the array:</p>

<pre><code>int partition(int a[], int lo, int hi) {
    int pivot = a[hi];          // pivot = last element
    int i = lo - 1;             // a[lo..i] are all ≤ pivot
    for (int j = lo; j &lt; hi; j++) {
        if (a[j] &lt;= pivot) {
            i++;                // grow the "≤ pivot" boundary
            int t = a[i]; a[i] = a[j]; a[j] = t;   // swap a[j] in
        }
    }
    // Finally swap pivot to the boundary
    int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
    return i + 1;               // pivot's final index
}

void quick_sort(int a[], int lo, int hi) {
    if (lo &gt;= hi) return;
    int p = partition(a, lo, hi);
    quick_sort(a, lo, p - 1);   // left of pivot
    quick_sort(a, p + 1, hi);   // right of pivot (pivot itself excluded)
}</code></pre>

<h4>Watch the partition work</h4>
<p>In the animation: <strong>red</strong> is the pivot; <strong>green</strong> bars are confirmed ≤ pivot (passed by <code>i</code>); <strong>blue</strong> are confirmed &gt; pivot (between <code>i</code> and <code>j</code>); <strong>yellow</strong> is the element <code>a[j]</code> currently being compared. After each partition completes, the red pivot drops to its final position (turns green), then recursion proceeds:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/quick-sort.html" loading="lazy" style="height: 460px;" title="Quicksort"></iframe>
<p class="anim-caption">↑ Notice the pivot turns green and never moves again after each partition. Comparison and swap counts are usually fewer than merge sort.</p>

<h4>Why average O(n log n)?</h4>
<p>Each partition is <strong>O(n)</strong> (one pointer scan). If the pivot lands roughly in the middle every time, recursion depth is <strong>log n</strong>, total cost <strong>O(n log n)</strong>.</p>

<h4>Worst case: O(n²)</h4>
<p>Suppose the array is <strong>already sorted ascending</strong> and we use Lomuto with the rightmost element as pivot — the pivot is always the maximum! After partition, the "left" side is everything-but-the-pivot, the "right" is empty. Recursion depth becomes n; per-level work is O(n); total <strong>O(n²)</strong>.</p>
<p>How to avoid this? Industrial implementations use:</p>
<ul>
  <li><strong>Randomised pivot</strong>: pick a random element from <code>[lo, hi]</code>. Makes "construct adversarial input" virtually impossible.</li>
  <li><strong>Median-of-three</strong>: pivot = median(a[lo], a[mid], a[hi]). Simple and effective.</li>
  <li><strong>Introsort</strong>: quicksort that switches to heap sort once recursion depth exceeds 2 × log n. Guaranteed O(n log n) worst case. C++ <code>std::sort</code> uses this.</li>
</ul>

<h4>Evaluation</h4>
<table>
  <thead><tr><th>Dimension</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Best</td><td>O(n log n) (pivot always at median)</td></tr>
    <tr><td>Worst</td><td><strong>O(n²)</strong> (sorted input + naive pivot strategy)</td></tr>
    <tr><td>Average</td><td>O(n log n) (with any reasonable pivot)</td></tr>
    <tr><td>Space</td><td><strong>O(log n)</strong> (recursion stack) — in-place otherwise</td></tr>
    <tr><td>Stable</td><td><strong>No</strong> (long-distance swaps in partition disturb relative order of equals)</td></tr>
    <tr><td>Adaptive</td><td>Not really</td></tr>
  </tbody>
</table>

<h3>5.3 Merge Sort vs Quicksort — both O(n log n), which to use?</h3>
<table>
  <thead><tr><th></th><th>Merge sort</th><th>Quicksort</th></tr></thead>
  <tbody>
    <tr><td>Worst time</td><td>O(n log n) ⭐</td><td>O(n²)</td></tr>
    <tr><td>Average time</td><td>O(n log n)</td><td>O(n log n)</td></tr>
    <tr><td>Real-world speed</td><td>Slower (larger constant)</td><td><strong>2-3× faster</strong> ⭐</td></tr>
    <tr><td>Space</td><td>O(n)</td><td>O(log n) ⭐</td></tr>
    <tr><td>Stable</td><td>Yes ⭐</td><td>No</td></tr>
    <tr><td>Linked-list friendly</td><td>Yes ⭐ (no random access needed)</td><td>No (needs random access)</td></tr>
    <tr><td>Typical use</td><td>External sort / linked-list sort / stable required / worst-case bound required</td><td>Default choice for in-memory arrays</td></tr>
  </tbody>
</table>

<h3>5.4 Sorting's Theoretical Lower Bound — Why "Comparison Sorts" Can't Beat O(n log n)</h3>

<p>This section is a math proof, but the idea is beautiful. <strong>Any algorithm that only uses pairwise comparisons must take at least Ω(n log n) comparisons in the worst case.</strong> So merge sort and quicksort, at O(n log n), are <strong>theoretically optimal</strong> for comparison sorts — you cannot do better (unless you use a non-comparison trick like counting sort or radix sort, which require extra structure on the input).</p>

<h4>Decision-tree argument</h4>
<p>Model any comparison sort as a <strong>decision tree</strong>:</p>
<ul>
  <li>Each internal node is a comparison <code>a[i] vs a[j]</code></li>
  <li>Left branch = result ≤; right branch = result &gt;</li>
  <li>Each <strong>leaf</strong> corresponds to one possible output ordering (a permutation)</li>
</ul>

<p>n distinct elements have <strong>n!</strong> permutations. Every input ends at some leaf. So the decision tree must have at least <strong>n! leaves</strong>.</p>
<p>A binary tree of <strong>height h</strong> has at most 2ʰ leaves. Therefore:</p>
<pre><code>2ʰ ≥ n!
h  ≥ log₂(n!) ≈ n log₂ n − n / ln 2   (Stirling's approximation)
   ≈ n log n
</code></pre>

<p>Tree height equals the <strong>worst-case number of comparisons</strong>. So: <strong>any comparison sort needs at least Ω(n log n) comparisons in the worst case</strong>. Merge sort and quicksort already achieve this — they're asymptotically optimal.</p>

<blockquote>Tip This bound applies only to <strong>comparison-based</strong> sorts. <strong>Non-comparison sorts</strong> (counting sort, bucket sort, radix sort) can hit O(n) — but they require extra constraints on the input (e.g., bounded-range integers). Post 3 will mention these briefly.</blockquote>

<hr>

<h2>Part 6 Abstract Data Types (ADT) — Separate Interface from Implementation</h2>

<p>So far we've worked exclusively with arrays. Now we're about to meet a flock of fancier data structures — linked lists, stacks, queues, trees, graphs, hash tables. Each excels at different operations. Before diving in, build the right <strong>mental model</strong>, or you'll drown in API details.</p>

<h3>6.1 What is an ADT?</h3>
<p>An <strong>ADT (Abstract Data Type)</strong> has one core idea:</p>
<blockquote>Care about <strong>what</strong> it can do, ignore <strong>how</strong> it does it.</blockquote>

<p>Example: "I need something that can push a value in and pop the most-recent one back out." That sentence describes the <strong>stack</strong> ADT — its interface — without committing to whether it's implemented with an array or a linked list. As a user you only care that the interface holds.</p>

<p>Analogy: a <strong>TV remote</strong> is an ADT. Press "Volume +" — volume goes up. Press "Channel −" — channel switches. You don't need to know if the remote uses infrared or Bluetooth, or how the TV decodes signals. Swap TVs and the remote's interface still works the way you expect.</p>

<h3>6.2 Why this abstraction matters</h3>
<ol>
  <li><strong>Decoupling</strong>: when writing programs you only care about the operations you need, not the internals. "Use a stack to track parentheses" only uses push/pop — not how the stack stores them.</li>
  <li><strong>Replaceability</strong>: one ADT can have <strong>multiple implementations</strong>, each fast at different things. Pick by use case.</li>
  <li><strong>Comparability</strong>: when evaluating "which implementation suits me", listing the time complexity of each operation makes the choice obvious.</li>
</ol>

<h3>6.3 Array vs Linked List — One List ADT, Two Wildly Different Implementations</h3>

<p>The "List" ADT supports these operations:</p>
<ul>
  <li><strong>Access</strong> the k-th element</li>
  <li><strong>Insert</strong> at position k</li>
  <li><strong>Delete</strong> at position k</li>
  <li><strong>Traverse</strong> head to tail</li>
</ul>

<p>The two textbook implementations are <strong>array</strong> and <strong>linked list</strong>. Their costs for the same operations are completely different:</p>

<table>
  <thead><tr><th>Operation</th><th>Array (contiguous)</th><th>Linked List (nodes + pointers)</th></tr></thead>
  <tbody>
    <tr><td>Access by index a[k]</td><td><strong>O(1)</strong> ⭐</td><td>O(k) (walk k nodes from head)</td></tr>
    <tr><td>Insert at head</td><td>O(n) (shift everything right)</td><td><strong>O(1)</strong> ⭐</td></tr>
    <tr><td>Insert at tail</td><td>O(1) (if you track the tail index)</td><td>O(1) (if you maintain a tail pointer)</td></tr>
    <tr><td>Insert in middle</td><td>O(n) (shift the suffix right)</td><td>O(n) to find + O(1) to relink</td></tr>
    <tr><td>Delete head</td><td>O(n)</td><td><strong>O(1)</strong> ⭐</td></tr>
    <tr><td>Traverse</td><td>O(n) (cache-friendly, <em>fastest in practice</em>)</td><td>O(n) (one pointer dereference per node)</td></tr>
    <tr><td>Extra memory</td><td>0</td><td>1-2 pointers per node</td></tr>
  </tbody>
</table>

<h4>See "insert at head" cost difference live</h4>
<p>The animation runs "insert at head" on both an array and a linked list with identical inputs. Watch how much work each one does:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/array-vs-list.html" loading="lazy" style="height: 360px;" title="Array vs linked list — insert at head"></iframe>
<p class="anim-caption">↑ Array: every existing element shifts right — n shifts for n elements. Linked list: one pointer is updated.</p>

<h3>6.4 How to choose</h3>
<table>
  <thead><tr><th>Need</th><th>Pick</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Fast random access by index</td><td>Array</td><td>O(1) random access; linked list can't do that</td></tr>
    <tr><td>Frequent insert / delete in middle / head</td><td>Linked list</td><td>No need to shift a chunk of elements</td></tr>
    <tr><td>Lots of traversal, rare modification</td><td>Array</td><td>Cache-friendly — much smaller constant</td></tr>
    <tr><td>Size grows / shrinks unpredictably</td><td>Linked list (or dynamic array)</td><td>Linked list scales freely; <code>realloc</code> works too but occasionally costs big</td></tr>
    <tr><td>Implement a stack / queue</td><td>Either</td><td>Depends on which operations are hot</td></tr>
  </tbody>
</table>

<blockquote>Tip In real life, "array vs linked list" has a hidden gap: <strong>cache friendliness</strong>. Arrays sit in contiguous memory; the CPU prefetches a chunk and traversal almost never waits on RAM. Linked-list nodes scatter across the heap; every hop may stall on memory. So <strong>linked lists' constant factor is much larger than arrays'</strong> — a "theoretical O(n) traversal" can be 5-10× slower than the array equivalent in measurements.</blockquote>

<hr>

<h2>Part 7 The Linked-List Family — Four Foundational "Dynamic" Structures</h2>
<p>This section covers four structures back-to-back: singly linked list, doubly linked list, stack, queue. None are complicated to implement, but they're <strong>incredibly handy</strong> — they're the building blocks for trees, graphs, BFS, DFS, and much more.</p>

<h3>7.1 Singly Linked List</h3>

<h4>Structure</h4>
<p>A node looks like this:</p>
<pre><code>typedef struct Node {
    int value;
    struct Node *next;   // points to the next node; the last node's next = NULL
} Node;</code></pre>

<p>The whole list exposes only a <strong>head pointer</strong> <code>head</code>. Walk along <code>next</code> to traverse.</p>

<h4>Three core operations</h4>

<p><strong>① Traverse — O(n)</strong></p>
<pre><code>void traverse(Node *head) {
    for (Node *cur = head; cur != NULL; cur = cur-&gt;next) {
        printf("%d ", cur-&gt;value);
    }
}</code></pre>
<p>Nothing exotic — start at head, follow next, stop at NULL.</p>

<p><strong>② Insert at head — O(1)</strong></p>
<pre><code>Node *insert_head(Node *head, int v) {
    Node *n = malloc(sizeof(Node));
    n-&gt;value = v;
    n-&gt;next  = head;     // new node's next = old head
    return n;            // new head is the new node
}

// Usage:
// head = insert_head(head, 42);</code></pre>

<p>Three steps: ① allocate the new node; ② set its <code>next</code> to the old head; ③ change the list's head to the new node. The function returns the new head because it changed.</p>

<p><strong>③ Delete a node by value — O(n)</strong></p>
<pre><code>Node *delete_value(Node *head, int v) {
    // Special case: deleting the head itself
    if (head != NULL &amp;&amp; head-&gt;value == v) {
        Node *next = head-&gt;next;
        free(head);
        return next;
    }
    // General: find cur such that cur-&gt;next-&gt;value == v
    Node *cur = head;
    while (cur != NULL &amp;&amp; cur-&gt;next != NULL &amp;&amp; cur-&gt;next-&gt;value != v) {
        cur = cur-&gt;next;
    }
    if (cur != NULL &amp;&amp; cur-&gt;next != NULL) {
        Node *del = cur-&gt;next;
        cur-&gt;next = del-&gt;next;     // bypass del
        free(del);
    }
    return head;
}</code></pre>

<p>The key idea: <strong>route the previous node's <code>next</code> past the deleted one, straight to the one after</strong>.</p>

<h4>Watch the pointers rewire</h4>
<p>The animation below shows it. When inserting, the new node's <code>next</code> connects to the old head. When deleting, the previous node's <code>next</code> jumps over the dying node to the one beyond. <strong>The list's physical position barely changes — pointers do all the work</strong>:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/linked-list.html" loading="lazy" style="height: 320px;" title="Linked-list insert/delete"></iframe>
<p class="anim-caption">↑ The head label and the green next arrows shift in response to each operation. Toggle to "doubly" mode to see the prev pointers too.</p>

<h3>7.2 Doubly Linked List</h3>

<p>A singly linked list only goes forward. To go back, you'd start from the head again. <strong>Doubly linked lists</strong> add a <code>prev</code> pointer per node:</p>

<pre><code>typedef struct DNode {
    int value;
    struct DNode *prev;
    struct DNode *next;
} DNode;</code></pre>

<p>Advantages:</p>
<ul>
  <li>Backward traversal: <code>cur = cur-&gt;prev</code></li>
  <li>O(1) deletion given a node pointer (no need to find the predecessor)</li>
  <li>O(1) insertion before / after any node</li>
</ul>
<p>Disadvantages: 8 more bytes per node (the prev pointer); both directions need maintenance — more code, more bugs.</p>

<p>Doubly-linked deletion (given the node pointer <code>n</code>):</p>
<pre><code>void delete_node(DNode *n) {
    if (n-&gt;prev) n-&gt;prev-&gt;next = n-&gt;next;
    if (n-&gt;next) n-&gt;next-&gt;prev = n-&gt;prev;
    free(n);
}</code></pre>
<p>Compare with singly's delete_value — singly has to scan to the predecessor first, <strong>doubly tears it out in O(1)</strong>.</p>

<h3>7.3 Stack — LIFO, Last-In-First-Out</h3>

<h4>Why we need a stack</h4>
<p>Many algorithms naturally process data <strong>"last-in-first-out"</strong>: function calls (the recursion stack); expression evaluation; browser back/forward; text editor undo/redo. Without the stack abstraction, you'd hand-roll "append/remove at array end" each time — verbose and error-prone.</p>

<h4>Interface</h4>
<table>
  <thead><tr><th>Operation</th><th>Meaning</th><th>Complexity</th></tr></thead>
  <tbody>
    <tr><td><code>push(v)</code></td><td>Put v on top of the stack</td><td>O(1)</td></tr>
    <tr><td><code>pop()</code></td><td>Remove and return the top</td><td>O(1)</td></tr>
    <tr><td><code>top()</code> / <code>peek()</code></td><td>See the top without removing</td><td>O(1)</td></tr>
    <tr><td><code>is_empty()</code></td><td>Is the stack empty?</td><td>O(1)</td></tr>
  </tbody>
</table>

<h4>Implementation 1: array-backed</h4>
<pre><code>#define MAX 1024
typedef struct {
    int data[MAX];
    int top;     // top index; -1 when empty
} Stack;

void init(Stack *s)       { s-&gt;top = -1; }
int  is_empty(Stack *s)   { return s-&gt;top == -1; }
void push(Stack *s, int v){ s-&gt;data[++s-&gt;top] = v; }
int  pop(Stack *s)        { return s-&gt;data[s-&gt;top--]; }
int  peek(Stack *s)       { return s-&gt;data[s-&gt;top]; }</code></pre>
<p>Compact, fast, cache-friendly. <strong>Downside</strong>: fixed size. Going past MAX overflows. For unbounded size use a dynamic array (<code>realloc</code>) or a linked list.</p>

<h4>Implementation 2: linked-list-backed</h4>
<pre><code>// push at head, pop from head — both O(1)
typedef struct Node { int value; struct Node *next; } Node;
typedef struct { Node *head; } LStack;

void push(LStack *s, int v) {
    Node *n = malloc(sizeof(Node));
    n-&gt;value = v;
    n-&gt;next = s-&gt;head;
    s-&gt;head = n;
}
int pop(LStack *s) {
    Node *n = s-&gt;head;
    int v = n-&gt;value;
    s-&gt;head = n-&gt;next;
    free(n);
    return v;
}</code></pre>
<p>Unbounded; price: malloc/free on every push/pop is slower than array indexing.</p>

<h3>7.4 Queue — FIFO, First-In-First-Out</h3>

<p>A queue is literally a <strong>line</strong>: first in, first served. Enter at one end, exit at the other.</p>

<h4>Interface</h4>
<table>
  <thead><tr><th>Operation</th><th>Meaning</th><th>Complexity</th></tr></thead>
  <tbody>
    <tr><td><code>enqueue(v)</code></td><td>Add v at the back</td><td>O(1)</td></tr>
    <tr><td><code>dequeue()</code></td><td>Remove from the front</td><td>O(1)</td></tr>
    <tr><td><code>front()</code></td><td>See the front without removing</td><td>O(1)</td></tr>
    <tr><td><code>is_empty()</code></td><td>—</td><td>O(1)</td></tr>
  </tbody>
</table>

<h4>Stack vs queue side by side</h4>
<p>Same input (1, 2, 3, 4), watch what each one spits out:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/stack-queue.html" loading="lazy" style="height: 380px;" title="Stack vs queue"></iframe>
<p class="anim-caption">↑ Stack: enter on the right, leave on the right (LIFO). Queue: enter on the right, leave on the left (FIFO).</p>

<h4>Queue with a circular array</h4>
<p>A naive array-backed queue has trouble: dequeue at the front means shifting everything left — O(n). Solution: a <strong>circular array</strong> (ring buffer) using two indices <code>front</code> and <code>rear</code> that <strong>wrap around to 0</strong> when they hit the end:</p>

<pre><code>#define CAP 1024
typedef struct {
    int data[CAP];
    int front;   // front index
    int rear;    // sentinel: one past the last element
    int size;
} Queue;

void enqueue(Queue *q, int v) {
    q-&gt;data[q-&gt;rear] = v;
    q-&gt;rear = (q-&gt;rear + 1) % CAP;     // the modulo turns the array into a ring
    q-&gt;size++;
}
int dequeue(Queue *q) {
    int v = q-&gt;data[q-&gt;front];
    q-&gt;front = (q-&gt;front + 1) % CAP;
    q-&gt;size--;
    return v;
}</code></pre>

<p>Both enqueue and dequeue are O(1). For a linked-list queue, you'd want both head AND tail pointers — singly linked with a tail pointer is enough for O(1) enqueue.</p>

<h3>7.5 Linked-list family summary</h3>
<table>
  <thead><tr><th>Structure</th><th>Key feature</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td>Singly linked list</td><td>head + next, one direction</td><td>Dynamic sequence; stack implementation</td></tr>
    <tr><td>Doubly linked list</td><td>+ prev, two directions, O(1) delete-by-pointer</td><td>LRU cache, text-editor lines, anything needing back-walks</td></tr>
    <tr><td>Stack</td><td>LIFO</td><td>Function calls, undo/redo, expression eval, DFS</td></tr>
    <tr><td>Queue</td><td>FIFO</td><td>BFS, task scheduling, producer/consumer</td></tr>
  </tbody>
</table>

<hr>

<h2>Part 8 Trees — The Most Common "Branching" Structure</h2>

<p>Until now our data has been <strong>linear</strong> — arrays, linked lists, stacks, queues are all single lines. <strong>Trees</strong> are the first non-linear structure: from a root, branches descend. File systems, HTML DOM, organisation charts, parse trees, decision processes — both nature and code are full of trees.</p>

<h3>8.1 Binary Tree Basics</h3>

<p>A <strong>binary tree</strong> is a tree where each node has at most two children — labelled "left" and "right". The simplest and most common kind.</p>

<pre><code>typedef struct TreeNode {
    int value;
    struct TreeNode *left;   // left child, may be NULL
    struct TreeNode *right;  // right child, may be NULL
} TreeNode;</code></pre>

<p>Vocabulary worth memorising:</p>
<table>
  <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>root</td><td>The topmost node — has no parent</td></tr>
    <tr><td>parent / child</td><td>Two ends of an edge. A parent can have multiple children.</td></tr>
    <tr><td>leaf</td><td>A node with no children (the bottom)</td></tr>
    <tr><td>internal node</td><td>A non-leaf</td></tr>
    <tr><td>depth</td><td>Number of edges from root to this node. Root's depth = 0.</td></tr>
    <tr><td>height</td><td>Number of edges from this node to the farthest leaf. A leaf's height = 0.</td></tr>
    <tr><td>tree height</td><td>The whole tree's height = the root's height.</td></tr>
    <tr><td>subtree</td><td>Any node and all its descendants form a tree.</td></tr>
  </tbody>
</table>

<h4>Full and complete binary trees</h4>
<ul>
  <li><strong>Full</strong>: every level is "full" — every internal node has two children.</li>
  <li><strong>Complete</strong>: all levels but the last are full; the last level fills <strong>left to right contiguously</strong>. Hugely important — a complete binary tree can be <strong>stored in an array</strong>. We'll exploit this when we cover heaps in post 3.</li>
</ul>

<h3>8.2 Tree Traversal — Four Orders</h3>

<p>To visit every node of a tree, unlike an array, we have <strong>multiple directions</strong> to choose. Hence four traversal orders:</p>

<ul>
  <li><strong>Pre-order</strong>: visit current, then left subtree, then right subtree. <em>"Me → left → right"</em></li>
  <li><strong>In-order</strong>: visit left, then current, then right. <em>"Left → me → right"</em></li>
  <li><strong>Post-order</strong>: visit left, then right, then current. <em>"Left → right → me"</em></li>
  <li><strong>Level-order</strong>: top to bottom, left to right per level. <em>"Floor by floor"</em> (also known as BFS — breadth-first search)</li>
</ul>

<h4>See the four orders</h4>
<p>The tree below is a balanced BST (every node greater than left, less than right). <strong>Toggle the four tabs</strong> to compare visit orders:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/tree-traversal.html" loading="lazy" style="height: 380px;" title="Four tree traversals"></iframe>
<p class="anim-caption">↑ Same tree, four different orderings. Note in-order gives 1,2,3,4,5,6,7 — that's the BST property: in-order = sorted order.</p>

<h4>The three depth-first traversals (pre / in / post)</h4>

<pre><code>void preorder(TreeNode *n) {
    if (n == NULL) return;
    visit(n);              // ① self
    preorder(n-&gt;left);     // ② left
    preorder(n-&gt;right);    // ③ right
}

void inorder(TreeNode *n) {
    if (n == NULL) return;
    inorder(n-&gt;left);      // ① left
    visit(n);              // ② self
    inorder(n-&gt;right);     // ③ right
}

void postorder(TreeNode *n) {
    if (n == NULL) return;
    postorder(n-&gt;left);    // ① left
    postorder(n-&gt;right);   // ② right
    visit(n);              // ③ self
}</code></pre>

<p>The three differ only in <strong>where <code>visit</code> sits</strong>. The structure "recurse left, recurse right" is the same — yet another use of <strong>divide and conquer</strong>.</p>

<h4>Level-order (BFS) with a queue</h4>
<pre><code>void level_order(TreeNode *root) {
    if (!root) return;
    Queue q;
    init(&amp;q);
    enqueue(&amp;q, root);
    while (!is_empty(&amp;q)) {
        TreeNode *n = (TreeNode *)dequeue(&amp;q);
        visit(n);
        if (n-&gt;left)  enqueue(&amp;q, n-&gt;left);
        if (n-&gt;right) enqueue(&amp;q, n-&gt;right);
    }
}</code></pre>

<p>Level-order is <strong>breadth-first search (BFS)</strong>. Stacks power depth-first, queues power breadth-first — that's the most important practical use of stacks and queues in tree / graph algorithms.</p>

<h4>Typical uses for each traversal</h4>
<table>
  <thead><tr><th>Traversal</th><th>Used for</th></tr></thead>
  <tbody>
    <tr><td>Pre-order</td><td>Serialising a tree (save, then rebuild from the pre-order); prefix expressions</td></tr>
    <tr><td>In-order</td><td><strong>Output BST in sorted order</strong> ⭐; infix expressions</td></tr>
    <tr><td>Post-order</td><td>Bottom-up aggregation (subtree size, deletion: free children before self)</td></tr>
    <tr><td>Level-order / BFS</td><td>Shortest path / nearest-X searches; layer-wise processing</td></tr>
  </tbody>
</table>

<h3>8.3 Binary Search Trees (BSTs)</h3>

<h4>Why BSTs exist</h4>
<p>In post 1 we saw <strong>binary search</strong> — but it required the data to be in a <strong>sorted array</strong>. The problem with a sorted array is <strong>insertion</strong>: to add a new value, we shift everything after it, O(n). Same for delete.</p>
<p>BSTs solve this: <strong>not a physically sorted array, but a structurally sorted tree</strong>. Search, insert, and delete are all O(log n) (when the tree is balanced).</p>

<h4>BST property</h4>
<blockquote>For every node N: <strong>everything in N's left subtree &lt; N &lt; everything in N's right subtree</strong>.</blockquote>

<p>One direct corollary: <strong>in-order traversal of a BST is always sorted ascending.</strong></p>

<h4>The three core BST operations</h4>

<p><strong>① Search: start at root, compare, go left or right</strong></p>
<pre><code>TreeNode *bst_search(TreeNode *root, int key) {
    TreeNode *cur = root;
    while (cur != NULL) {
        if      (key == cur-&gt;value) return cur;     // found
        else if (key &lt;  cur-&gt;value) cur = cur-&gt;left;
        else                        cur = cur-&gt;right;
    }
    return NULL;     // not found
}</code></pre>

<p>Each step prunes half the tree. Cost = tree height = O(log n) (when balanced).</p>

<p><strong>② Insert: search to a NULL spot, attach a new node there</strong></p>
<pre><code>TreeNode *bst_insert(TreeNode *root, int v) {
    if (root == NULL) {
        TreeNode *n = malloc(sizeof(TreeNode));
        n-&gt;value = v; n-&gt;left = n-&gt;right = NULL;
        return n;
    }
    if (v &lt; root-&gt;value) root-&gt;left  = bst_insert(root-&gt;left,  v);
    else if (v &gt; root-&gt;value) root-&gt;right = bst_insert(root-&gt;right, v);
    // v == root-&gt;value: BSTs typically don't allow duplicates — ignore here
    return root;
}</code></pre>

<p>It's just search, except when you reach NULL, you create the node instead of returning NULL.</p>

<p><strong>③ Delete: three cases</strong></p>
<pre><code>TreeNode *find_min(TreeNode *n) {
    while (n-&gt;left) n = n-&gt;left;
    return n;
}

TreeNode *bst_delete(TreeNode *root, int v) {
    if (!root) return NULL;
    if (v &lt; root-&gt;value) {
        root-&gt;left  = bst_delete(root-&gt;left,  v);
    } else if (v &gt; root-&gt;value) {
        root-&gt;right = bst_delete(root-&gt;right, v);
    } else {
        // found — three cases
        if (!root-&gt;left)  { TreeNode *r = root-&gt;right; free(root); return r; }
        if (!root-&gt;right) { TreeNode *l = root-&gt;left;  free(root); return l; }
        // two children: replace with in-order successor (min of right subtree),
        // then delete that successor from its old spot
        TreeNode *succ = find_min(root-&gt;right);
        root-&gt;value = succ-&gt;value;
        root-&gt;right = bst_delete(root-&gt;right, succ-&gt;value);
    }
    return root;
}</code></pre>

<h4>Watch a BST search</h4>
<p>Type a value and watch how the search "halves" the tree each step. Toggle to "insert" mode to see new nodes drop into their NULL slot:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/bst.html" loading="lazy" style="height: 360px;" title="BST search and insert"></iframe>
<p class="anim-caption">↑ Try a few — say 60 (found), 35 (missing — insert mode places it between 30 and 40).</p>

<h3>8.4 Balance — BST's Achilles' Heel and Its Saviour</h3>

<h4>BSTs can also degrade to O(n)</h4>
<p>BST's "O(log n)" comes <strong>with a condition</strong>: the tree must be balanced (the left and right subtrees have similar heights). Counter-example:</p>

<pre><code>// Insert in ascending order: 1, 2, 3, 4, 5
// You get this:
1
 \
  2
   \
    3
     \
      4
       \
        5</code></pre>

<p>It's a valid BST (each right child is larger), but <strong>it has degenerated into a linked list</strong>. Searching 5 walks all the way down — 5 steps, O(n) instead of O(log n). <strong>Sorted input destroys naive BSTs.</strong></p>

<h4>What "balanced" means</h4>
<p>"Balance" has many precise definitions. The simplest is the <strong>AVL invariant</strong>:</p>
<blockquote>For <strong>every node</strong>, the heights of its left and right subtrees differ by at most 1.</blockquote>

<p>Trees satisfying this are <strong>AVL trees</strong>. An AVL tree has height tightly bounded by O(log n), so search/insert/delete are all O(log n).</p>

<h4>Maintaining balance: rotations</h4>
<p>After an insert or delete, if some node's subtree heights differ by 2 (the invariant is violated), we apply a <strong>rotation</strong> to fix it. The two basic rotations are <strong>left rotation</strong> and <strong>right rotation</strong>.</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/avl-rotate.html" loading="lazy" style="height: 380px;" title="AVL rotation"></iframe>
<p class="anim-caption">↑ Toggle LL and RR for the two directions. The unbalanced node turns red, the pivot turns yellow; after the rotation the whole tree turns green (rebalanced).</p>

<h4>Right rotation (fixes LL imbalance)</h4>
<p>"LL imbalance" means an insertion went into the <strong>left of the left child</strong> and the left subtree got too tall. Fix is a <strong>right rotation</strong>:</p>

<pre><code>TreeNode *rotate_right(TreeNode *z) {
    TreeNode *y = z-&gt;left;
    TreeNode *T2 = y-&gt;right;
    // rotate
    y-&gt;right = z;
    z-&gt;left  = T2;
    // return new subtree root
    return y;
}</code></pre>

<p>z used to be the subtree root with too much weight on the left; after rotation y is the new root, z becomes y's right child. Subtree height drops by 1 — balanced.</p>

<h4>Four imbalance cases</h4>
<table>
  <thead><tr><th>Type</th><th>Meaning</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>LL</td><td>Inserted into left-of-left</td><td>One right rotation at the unbalanced node</td></tr>
    <tr><td>RR</td><td>Inserted into right-of-right</td><td>One left rotation</td></tr>
    <tr><td>LR</td><td>Inserted into right-of-left</td><td>Left-rotate the left child first (becomes LL), then right-rotate</td></tr>
    <tr><td>RL</td><td>Inserted into left-of-right</td><td>Right-rotate the right child first (becomes RR), then left-rotate</td></tr>
  </tbody>
</table>

<blockquote>Tip Should you implement AVL by hand in real code? <strong>Rarely.</strong> Reasons: ① standard libraries (C++ <code>std::map</code>, Java <code>TreeMap</code>) already provide a balanced BST (actually a more sophisticated <strong>red-black tree</strong>, with looser invariants but lower maintenance cost — same O(log n) interface). ② Hash tables (post 3, Part 10) are usually faster on average. AVL / red-black trees are interview classics and great for understanding balance, but in production you mostly use them via a library.</blockquote>

<hr>

<h2>Part 9 String Pattern Matching — Naive vs KMP</h2>

<p>"Find a short pattern in a long string" — Ctrl+F, grep, firewall keyword filters, DNA sequence matching — is the most common string problem. We start with <strong>Naive</strong> (the most intuitive but slowest method) and then <strong>KMP</strong> (an algorithm that finally makes "failure functions" click for many people).</p>

<h3>9.1 Naive Pattern Matching (Brute Force)</h3>

<p>Problem: in main string <code>text</code> (length n) find the first occurrence of pattern <code>pattern</code> (length m).</p>

<h4>The most intuitive approach</h4>
<pre><code>int naive_search(const char *text, const char *pattern) {
    int n = strlen(text), m = strlen(pattern);
    for (int i = 0; i &lt;= n - m; i++) {     // every possible start position
        int j = 0;
        while (j &lt; m &amp;&amp; text[i + j] == pattern[j]) j++;
        if (j == m) return i;              // all matched → found
    }
    return -1;                             // not found
}</code></pre>

<p>Outer i slides from 0 to n-m, inner j compares pattern at position i. On any mismatch, abandon and restart at i+1.</p>

<h4>Complexity</h4>
<table>
  <thead><tr><th>Case</th><th>Complexity</th></tr></thead>
  <tbody>
    <tr><td>Best</td><td>O(n) (mismatch on first char, or first position matches)</td></tr>
    <tr><td>Worst</td><td><strong>O(n × m)</strong> (e.g. text = "AAAAAB", pattern = "AAAB" — each shift compares m-1 chars before failing)</td></tr>
    <tr><td>Average</td><td>~O(n) on random inputs but degenerates near O(nm) on adversarial ones</td></tr>
  </tbody>
</table>

<h3>9.2 Naive's Pain Point: i Always Backtracks</h3>

<p>Walk through Naive:</p>
<pre><code>text:    A B A B A B C
pattern: A B A B C

i=0: 4 chars match, on the 5th C vs A fails.
     Naive: bump i to 1, reset j to 0, <strong>throw away the matched ABAB and start over</strong>.
i=1: text[1]=B vs pattern[0]=A fails immediately, i jumps to 2.
i=2: 3 matches, then A vs B fails. i bumps to 3.
... and so on.
</code></pre>

<p>What's wrong? <strong>On every failure, naive throws away the matched prefix and starts from the next position</strong>. But think: when we matched "ABAB" before failing, we already <em>knew</em> text[i..i+3] = "ABAB". That information is wasted!</p>

<h3>9.3 KMP's Core Insight</h3>

<blockquote>On failure, <strong>i never backtracks</strong>; only j (the pattern pointer) jumps to the right place to keep going.</blockquote>

<p>What's "the right place"? That's KMP's gem — the <strong>failure function next[]</strong>.</p>

<h4>The failure function next[]</h4>
<p>For pattern P, <code>next[i]</code> is defined as: <strong>the longest "proper prefix" of P[0..i] that is also a "proper suffix" of P[0..i]</strong>.</p>

<p>"Proper prefix" excludes the entire string. Same for proper suffix.</p>

<p>Example: <code>P = "ABABABC"</code></p>
<table>
  <thead><tr><th>i</th><th>P[0..i]</th><th>Proper prefixes</th><th>Proper suffixes</th><th>Longest common</th><th>next[i]</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>A</td><td>—</td><td>—</td><td>—</td><td>0</td></tr>
    <tr><td>1</td><td>AB</td><td>A</td><td>B</td><td>—</td><td>0</td></tr>
    <tr><td>2</td><td>ABA</td><td>A, AB</td><td>A, BA</td><td><strong>A</strong></td><td>1</td></tr>
    <tr><td>3</td><td>ABAB</td><td>A, AB, ABA</td><td>B, AB, BAB</td><td><strong>AB</strong></td><td>2</td></tr>
    <tr><td>4</td><td>ABABA</td><td>...</td><td>...</td><td><strong>ABA</strong></td><td>3</td></tr>
    <tr><td>5</td><td>ABABAB</td><td>...</td><td>...</td><td><strong>ABAB</strong></td><td>4</td></tr>
    <tr><td>6</td><td>ABABABC</td><td>...</td><td>...</td><td>—</td><td>0</td></tr>
  </tbody>
</table>

<h4>How does next[] help?</h4>
<p>Suppose we're comparing text[i] and pattern[j] and they <strong>don't match</strong>. We know that text[i-j..i-1] = pattern[0..j-1] — the previous j characters did match.</p>
<p>Pattern[0..j-1] has its own "prefix-also-suffix" length, namely <code>next[j-1]</code>. That means pattern[0..next[j-1]-1] = pattern[j-next[j-1]..j-1]. The right-hand side is the last next[j-1] characters of the matched text — and they equal pattern's <em>first</em> next[j-1] characters!</p>
<p>So we can <strong>jump j to next[j-1]</strong>, leave i where it is, and continue.</p>

<h4>Watch KMP's "i never backtracks"</h4>
<p>Toggle between Naive and KMP modes — same text, same pattern. Watch the comparison counter — KMP usually halves Naive's work or better:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-2/anims/string-match.html" loading="lazy" style="height: 360px;" title="Naive vs KMP"></iframe>
<p class="anim-caption">↑ KMP mode shows the next[] table below. On a mismatch, the next[] cell used flashes, and the pattern slides past the matched prefix while i stays put.</p>

<h4>Full KMP code</h4>
<pre><code>// Build the failure function next[]
void compute_next(const char *p, int m, int *next) {
    next[0] = 0;
    int k = 0;                  // length of currently-matched prefix
    for (int i = 1; i &lt; m; i++) {
        while (k &gt; 0 &amp;&amp; p[i] != p[k]) k = next[k - 1];
        if (p[i] == p[k]) k++;
        next[i] = k;
    }
}

// KMP main matching
int kmp_search(const char *text, const char *pattern) {
    int n = strlen(text), m = strlen(pattern);
    if (m == 0) return 0;
    int next[m];
    compute_next(pattern, m, next);
    int i = 0, j = 0;
    while (i &lt; n) {
        if (text[i] == pattern[j]) {
            i++; j++;
            if (j == m) return i - m;        // found, start = i-m
        } else if (j &gt; 0) {
            j = next[j - 1];                  // KEY: i never backtracks
        } else {
            i++;                              // j is already 0, advance i
        }
    }
    return -1;
}</code></pre>

<h4>Complexity analysis</h4>
<ul>
  <li>Build <code>next[]</code>: O(m)</li>
  <li>Main matching: i only ever advances, at most n times; j only decreases on failure. So i+j increases by at most 2n total → main matching <strong>O(n)</strong></li>
  <li>Total: <strong>O(n + m)</strong></li>
</ul>

<p>Compare with Naive's O(nm) — KMP is genuinely linear-time string matching.</p>

<blockquote>Tip KMP isn't the most-used algorithm in industry (BMH and BM are typically faster in practice — covered in post 3). But the <strong>failure-function</strong> idea recurs in many other algorithms — Aho-Corasick automaton, suffix automaton, and so on. Once you understand KMP, AC automaton feels obvious — "oh, it's just KMP on a tree."</blockquote>

<hr>

<h2>Recap</h2>
<ul>
  <li><strong>Merge sort and quicksort</strong> bring sorting to O(n log n); merge is stable but uses O(n) space, quick is in-place but worst-case O(n²)</li>
  <li><strong>The lower bound for comparison sorts is O(n log n)</strong> — math, not engineering</li>
  <li><strong>ADT</strong>: think "what can this structure do?" before "how is it built?". Same ADT can have multiple implementations — pick by your needs</li>
  <li><strong>Array vs linked list</strong>: random access vs head-insert/delete — pick by your hot operations</li>
  <li><strong>Stack (LIFO)</strong>: DFS / function calls / undo. <strong>Queue (FIFO)</strong>: BFS / scheduling</li>
  <li><strong>Binary trees</strong> have 4 traversals: pre / in / post / level. BFS uses a queue, DFS uses recursion (i.e. an implicit stack)</li>
  <li><strong>BSTs</strong> give O(log n) search/insert/delete — but only if balanced. AVL trees use rotations to keep balance</li>
  <li><strong>KMP's</strong> heart is the failure function next[]: i never backtracks, dropping naive's O(nm) to O(n+m)</li>
</ul>

<p>See you in post 3 — heaps and priority queues, the hash table's design philosophy, BMH and other string tricks, plus more design paradigms (greedy, dynamic programming). This post packed in a lot — I'd suggest playing through every animation and typing every snippet at least once before moving on.</p>
`;
