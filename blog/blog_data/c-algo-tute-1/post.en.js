/* Post body — c-algo-tute-1 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['c-algo-tute-1:en'] = `
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

<p class="lead">C Algorithms 1 · From zero toward mastery — first stop. This post lays the foundation: build the "ruler" for evaluating algorithms (Big O, best/worst/average case, space complexity), train your "recursive thinking" (base case, call stack, divide & conquer), then practice the ruler on the simplest searches (linear / binary) and the classic O(n²) sorts (bubble / selection / insertion).</p>

<h2>Part 1 Algorithm Analysis Foundations — Building the Ruler</h2>
<p>People new to algorithms often hit this wall: "My code works, but it's slow as a turtle. What now?" Before you can make it faster, you need an <strong>objective ruler</strong> to measure speed. This part teaches you to build that ruler. <strong>Once you internalize it, you can measure every algorithm you'll ever learn.</strong></p>

<h3>1.1 What Is an Algorithm</h3>
<p>Textbook definition: <strong>an algorithm is a finite, well-defined sequence of steps that solves a problem</strong>. Three properties unpack this:</p>
<table>
  <thead><tr><th>Property</th><th>Meaning</th><th>Counter-example (not an algorithm)</th></tr></thead>
  <tbody>
    <tr><td><strong>Input / Output</strong></td><td>Takes 0+ inputs, produces 1+ outputs</td><td>"Code" that returns nothing and changes nothing</td></tr>
    <tr><td><strong>Determinism</strong></td><td>Every step is unambiguous; same input → same output</td><td>"Pick one randomly", "sort it nicely"</td></tr>
    <tr><td><strong>Finiteness</strong></td><td>Must terminate after <strong>a finite number of steps</strong></td><td><code>while(1)</code>; non-converging iterations</td></tr>
  </tbody>
</table>

<p>The simplest algorithm — <strong>add two integers</strong>:</p>
<pre><code>int add(int a, int b) {
    return a + b;        // input a, b; output a+b; one step then stops
}</code></pre>
<p>It satisfies all three: input a, b; output a+b; same inputs always produce the same result; one line then done. A perfectly valid algorithm.</p>

<blockquote>Note Algorithm ≠ program. The algorithm is the <strong>idea</strong>; the program is the C translation. The same algorithm can be written in C, Python, or Java. Learning algorithms is learning <strong>how to think</strong>.</blockquote>

<h3>1.2 Why We Need Big O</h3>
<p>Suppose you wrote two functions that both find a number in an array. One ran in 1 ms, the other in 5 ms. Can we say the first is faster?</p>
<p><strong>No.</strong> Because:</p>
<ul>
  <li>Different <strong>input sizes</strong>: 10 elements vs. 1 million</li>
  <li>Different <strong>machines</strong>: a new laptop vs. an old PC — easy 10× difference</li>
  <li>Different <strong>languages</strong>: compiled C vs. interpreted Python</li>
</ul>
<p>So we need a ruler that's <strong>independent of machine and exact input</strong>. That ruler is <strong>time complexity</strong>, written in <strong>Big O notation</strong>.</p>

<p>Big O measures not "how many milliseconds", but <strong>"how the operation count grows as input size n grows"</strong>. It drops constants, drops lower-order terms, and keeps only the dominating term.</p>

<pre><code>Example: an algorithm runs 3n² + 5n + 100 operations.

  n =      10 →   3·100  +   50 + 100 =     450
  n =     100 → 3·10000  +  500 + 100 =   30600
  n =    1000 → 3·10⁶    + 5000 + 100 = 3005100

Once n grows, 3n² dominates. The 100 and 5n barely matter.
So we say the algorithm is O(n²), not O(3n² + 5n + 100).</code></pre>

<h3>1.3 The Five Most Common Complexity Classes</h3>
<p>You'll spend 95% of your time around these five. Fast to slow:</p>

<table>
  <thead><tr><th>Notation</th><th>Name</th><th>n=10</th><th>n=100</th><th>n=10k</th><th>Where you see it</th></tr></thead>
  <tbody>
    <tr><td><strong>O(1)</strong></td><td>Constant</td><td>1</td><td>1</td><td>1</td><td>Array indexing, hash lookup</td></tr>
    <tr><td><strong>O(log n)</strong></td><td>Logarithmic</td><td>≈ 3</td><td>≈ 7</td><td>≈ 14</td><td>Binary search, balanced BST lookup</td></tr>
    <tr><td><strong>O(n)</strong></td><td>Linear</td><td>10</td><td>100</td><td>10000</td><td>Linear search, sum</td></tr>
    <tr><td><strong>O(n log n)</strong></td><td>Linearithmic</td><td>≈ 33</td><td>≈ 664</td><td>≈ 132877</td><td>Merge sort, average quicksort</td></tr>
    <tr><td><strong>O(n²)</strong></td><td>Quadratic</td><td>100</td><td>10000</td><td>100,000,000</td><td>Bubble / selection / insertion sort</td></tr>
  </tbody>
</table>

<p>The animation below puts all five classes side by side. <strong>Drag the slider</strong> to grow n and watch which one explodes first. Bars are normalized on a log scale; numbers on the right are real operation counts:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/bigO-grow.html" loading="lazy" style="height: 380px;" title="Big O growth comparison"></iframe>
<p class="anim-caption">↑ As n climbs from 10 to 500, O(n²) hits 250,000 while O(log n) is still just 9.</p>

<p><strong>Intuition:</strong> when n grows 10×:</p>
<ul>
  <li>O(1) is unchanged</li>
  <li>O(log n) increases by ~1</li>
  <li>O(n) also grows 10×</li>
  <li>O(n log n) grows slightly more than 10× (about 13–14×)</li>
  <li>O(n²) grows 100× ☠️</li>
</ul>

<h4>O(1) — Constant Time</h4>
<p>Operation count is <strong>fixed</strong>, regardless of n.</p>
<pre><code>int get_first(int arr[]) {
    return arr[0];   // always 1 step
}</code></pre>
<p>Array indexing, integer arithmetic, parity check — all O(1).</p>

<h4>O(log n) — Logarithmic Time</h4>
<p>Each step <strong>halves</strong> the problem, so total steps = "how many times can n be divided by 2 until 1" — exactly log₂ n.</p>
<pre><code>n = 1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1
10 steps ≈ log₂(1024) = 10</code></pre>
<p>Poster child: <strong>binary search</strong> (Part 3).</p>

<h4>O(n) — Linear Time</h4>
<p>Touch each element exactly once.</p>
<pre><code>int sum(int arr[], int n) {
    int s = 0;
    for (int i = 0; i &lt; n; i++) {  // runs n times
        s += arr[i];
    }
    return s;
}</code></pre>

<h4>O(n log n) — Slightly Worse Than Linear</h4>
<p>Either "do an O(log n) operation for each element" or "divide & conquer with O(n) merge per level over log n levels". Merge sort and quicksort live here. This class is provably the <strong>theoretical floor for comparison sorts</strong> (Part 5 will explain why).</p>

<h4>O(n²) — Quadratic Time</h4>
<p>Classic shape: <strong>two nested loops, each running n times</strong>.</p>
<pre><code>for (int i = 0; i &lt; n; i++) {
    for (int j = 0; j &lt; n; j++) {
        // runs n × n = n² times
    }
}</code></pre>
<p>At n = 10000 that's already 100 million operations — seconds on a normal machine. Why we <strong>can't</strong> use O(n²) on big data.</p>

<h3>1.4 Reading Big O from Code</h3>
<p>Three rules cover most cases:</p>

<p><strong>Rule 1: nesting depth = exponent.</strong></p>
<pre><code>for i ...        // 1 level → O(n)
  for j ...      // 2 levels → O(n²)
    for k ...    // 3 levels → O(n³)</code></pre>

<p><strong>Rule 2: sequential pieces — take the bigger.</strong></p>
<pre><code>for (i...) ...           // O(n)
for (j...) for (k...) ...// O(n²)
// total: O(n) + O(n²) = O(n²)</code></pre>

<p><strong>Rule 3: "halving" is log.</strong></p>
<pre><code>while (n &gt; 1) {
    n = n / 2;     // halves each step → O(log n)
}</code></pre>

<p>Apply them — what's the complexity below?</p>
<pre><code>for (int i = 0; i &lt; n; i++) {   // outer n
    int x = n;
    while (x &gt; 1) {              // inner log n (halving)
        x /= 2;
    }
}</code></pre>
<p>Outer n, inner log n, multiply: <strong>O(n log n)</strong>.</p>

<h3>1.5 Best / Worst / Average Case</h3>
<p>The same algorithm can run wildly different times on different inputs. So we discuss three cases:</p>
<table>
  <thead><tr><th>Case</th><th>Meaning</th><th>Convention</th></tr></thead>
  <tbody>
    <tr><td>Best</td><td>Luckiest input</td><td>Sometimes Ω (Omega)</td></tr>
    <tr><td>Worst</td><td>Unluckiest input</td><td>O (Big O)</td></tr>
    <tr><td>Average</td><td>Probability-weighted over all inputs</td><td>Θ (Theta), commonly used</td></tr>
  </tbody>
</table>

<p><strong>Example: linear search in an array of n.</strong></p>
<table>
  <thead><tr><th>Case</th><th>When</th><th>Steps</th><th>Big O</th></tr></thead>
  <tbody>
    <tr><td>Best</td><td>First element matches</td><td>1</td><td>O(1)</td></tr>
    <tr><td>Worst</td><td>Last / not present</td><td>n</td><td>O(n)</td></tr>
    <tr><td>Average</td><td>Uniform position</td><td>n/2</td><td>O(n)</td></tr>
  </tbody>
</table>

<blockquote>Note When industry says "the algorithm is O(X)", they usually mean <strong>worst case</strong>, because we want a guarantee "no worse than this". So "quicksort is O(n log n)" is informal — quicksort's <strong>worst</strong> is O(n²); only its <strong>average</strong> is O(n log n). More in Part 5.</blockquote>

<h3>1.6 Space Complexity</h3>
<p>Beyond "how much time", we also care about "how much extra memory" — that's <strong>space complexity</strong>. Same Big O notation; counts <strong>extra</strong> memory used as n grows.</p>
<p>"Extra" matters: the <strong>input itself</strong> doesn't count — otherwise nearly every algorithm would be O(n) space, useless.</p>

<table>
  <thead><tr><th>Snippet</th><th>Extra space</th></tr></thead>
  <tbody>
    <tr><td><code>int s = 0;</code></td><td>O(1)</td></tr>
    <tr><td><code>int tmp[n];</code></td><td>O(n)</td></tr>
    <tr><td><code>int mat[n][n];</code></td><td>O(n²)</td></tr>
    <tr><td>recursion of depth log n</td><td>O(log n) (call stack frames)</td></tr>
  </tbody>
</table>

<h4>Time-Space Tradeoff</h4>
<p>Often you trade <strong>more memory for faster speed</strong> (or vice versa).</p>
<p><strong>Example: check if a number 0–99 has appeared before</strong></p>
<ul>
  <li><strong>A: linear scan each time.</strong> Time O(n), space O(1).</li>
  <li><strong>B: keep a <code>bool seen[100]</code> array, mark on sight.</strong> Time O(1) per query, space O(100) = O(1).</li>
</ul>
<p>B uses a tiny bit of extra memory and drops query time from O(n) to O(1). Classic trade. <strong>Hash tables</strong> (post 3, Part 10) take this idea to its limit.</p>

<h3>1.7 Practice: Analyse This</h3>
<pre><code>int has_duplicate(int a[], int n) {
    for (int i = 0; i &lt; n; i++) {
        for (int j = i + 1; j &lt; n; j++) {
            if (a[i] == a[j]) return 1;
        }
    }
    return 0;
}</code></pre>
<p><strong>Analysis:</strong></p>
<ul>
  <li>Outer i: 0..n-1, n times</li>
  <li>Inner j: n-i-1 times for each i</li>
  <li>Total = (n-1) + (n-2) + ... + 0 = n(n-1)/2 ≈ n²/2</li>
  <li>Drop the constant: <strong>O(n²)</strong></li>
  <li>Extra space: i, j only → <strong>O(1)</strong></li>
</ul>
<p>Best: dup found on first pair, O(1). Worst / average: O(n²).</p>

<hr>

<h2>Part 2 Recursive Thinking — A Door Opens</h2>
<p>People who haven't learned recursion get stuck on trees and merge sort, because those structures are <strong>self-similar</strong> — big problems contain smaller instances of themselves. <strong>Loops make this awful; recursion makes it one line</strong>. This part trains the recursive mindset by itself.</p>

<h3>2.1 Without Recursion?</h3>
<p>Try writing "print every file in a directory, at <strong>any depth</strong>" with loops. Level 1 is one <code>for</code>, level 2 nested, level 3 nested again… but the depth isn't known in advance. <strong>Dynamic-depth, self-similar structures kill loops and love recursion.</strong></p>

<h3>2.2 Two Pieces: Base Case + Recursive Case</h3>
<p>Every recursive function has <strong>two parts</strong>; missing either kills it:</p>
<table>
  <thead><tr><th>Part</th><th>Role</th><th>If missing</th></tr></thead>
  <tbody>
    <tr><td><strong>Base case</strong></td><td>Return the answer directly; stop recursing</td><td>Infinite recursion → stack overflow</td></tr>
    <tr><td><strong>Recursive case</strong></td><td>Shrink the problem and call self</td><td>Can't break a self-similar problem down</td></tr>
  </tbody>
</table>

<p>Classic example — <strong>factorial</strong> n! = n × (n-1) × ... × 1.</p>
<pre><code>int factorial(int n) {
    if (n &lt;= 1) return 1;             // ① base case
    return n * factorial(n - 1);       // ② recursive case
}</code></pre>

<p><strong>Why this works</strong> — by mathematical induction:</p>
<pre><code>n! = n × (n-1)!     ← decompose into a smaller version of self
1! = 1              ← base</code></pre>

<h3>2.3 The Call Stack</h3>
<p>Each function call pushes a <strong>stack frame</strong> on the call stack: parameters, locals, return address. <code>return</code> pops the frame. The animation below runs <code>factorial(4)</code> end-to-end — click ▶ to step through every push and pop:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/call-stack.html" loading="lazy" style="height: 460px;" title="Recursion call stack"></iframe>
<p class="anim-caption">↑ Function call = push, return = pop. Peak stack depth = recursion depth. Try changing n.</p>

<h3>2.4 Stack Overflow</h3>
<p>The call stack has a <strong>fixed size</strong> (usually a few MB).</p>
<ul>
  <li><strong>Forgot the base case</strong>: never returns, frames pile up → crash</li>
  <li><strong>Base case unreachable</strong>: e.g. <code>factorial(-3)</code>, <code>n &lt;= 1</code> never holds → crash</li>
  <li><strong>Recursion too deep</strong>: even correct logic blows up at 1M frames</li>
</ul>
<p><strong>Fixes:</strong> ① always write base first; ② every recursive call <strong>moves toward base</strong>; ③ rewrite as iteration when depth could be huge.</p>

<h3>2.5 Recursion vs Iteration</h3>
<p>Both can do the same job. How to choose?</p>

<p><strong>Example: sum 1..n</strong></p>
<pre><code>// Iterative
int sum_iter(int n) {
    int s = 0;
    for (int i = 1; i &lt;= n; i++) s += i;
    return s;
}

// Recursive
int sum_rec(int n) {
    if (n &lt;= 0) return 0;
    return n + sum_rec(n - 1);
}</code></pre>

<table>
  <thead><tr><th>Aspect</th><th>Iteration</th><th>Recursion</th></tr></thead>
  <tbody>
    <tr><td>Speed</td><td>Slightly faster (no call overhead)</td><td>Slightly slower (push/pop frames)</td></tr>
    <tr><td>Space</td><td>O(1)</td><td>O(n) (n stack frames)</td></tr>
    <tr><td>Code</td><td>Longer but explicit</td><td>Concise, mirrors math</td></tr>
    <tr><td>Best for</td><td>Simple linear traversal</td><td>Trees, divide & conquer, self-similar</td></tr>
  </tbody>
</table>

<blockquote>Note The sum example <strong>shouldn't</strong> use recursion — pure linear, iteration wins. Recursion shines on <strong>tree / divide-conquer / self-similar</strong> problems, where it's 10× cleaner than loops.</blockquote>

<h3>2.6 Three-Step Recipe</h3>
<p>Faced with a new recursive problem, follow these steps and you'll rarely err:</p>

<ol>
  <li><strong>Find the base case:</strong> what's the simplest version? E.g. 1! for factorial; "empty list" for list length; "empty tree" for tree depth.</li>
  <li><strong>Assume the smaller version is solved:</strong> the most counter-intuitive but vital step. <em>Don't</em> trace into it; just <strong>trust</strong> that <code>factorial(n-1)</code> already returns the correct (n-1)!.</li>
  <li><strong>Combine the smaller answer to get the current one:</strong> <code>n! = n × (n-1)!</code>, written as <code>return n * factorial(n - 1);</code>.</li>
</ol>

<h3>2.7 Divide and Conquer</h3>
<p>Recursion's most powerful application. <strong>Cut the problem in half, solve each recursively, combine the answers.</strong></p>
<p>The animated tree below is a divide-and-conquer "find max" in full — splitting all the way down (orange) to single elements, then merging upward taking the larger (green):</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/divide-conquer.html" loading="lazy" style="height: 480px;" title="Divide and conquer"></iframe>
<p class="anim-caption">↑ Each level halves the array → recursion depth = log₂ n. This is why divide & conquer reaches O(n log n).</p>

<p>Why is divide & conquer fast? Each level halves the size, so <strong>levels = log n</strong>. If the merge per level costs O(n), total cost is <strong>O(n log n)</strong> — way better than O(n²). Merge sort and quicksort (Part 5) live by this.</p>

<p><strong>The simplest example — find max — in code:</strong></p>
<pre><code>int max_dc(int a[], int lo, int hi) {
    if (lo == hi) return a[lo];                    // base: one left
    int mid = (lo + hi) / 2;
    int left  = max_dc(a, lo, mid);                // max of left half
    int right = max_dc(a, mid + 1, hi);            // max of right half
    return left &gt; right ? left : right;            // merge: take bigger
}</code></pre>
<p>A linear scan would also be O(n); this version too. <strong>Divide & conquer pays off when the merge is non-trivial</strong> — you'll feel that with merge sort in Part 5.</p>

<hr>

<h2>Part 3 Searching — Two Simplest Algorithms to Practice the Ruler</h2>
<p>Searching: given a value, find its position (or determine it's not there). Two algorithms here: <strong>linear search</strong> (any data) and <strong>binary search</strong> (data must be sorted, but much faster).</p>

<p>Below, both run on <strong>the same sorted array</strong> in lockstep — change the target and step through to compare how many steps each takes:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/search.html" loading="lazy" style="height: 480px;" title="Linear vs binary search"></iframe>
<p class="anim-caption">↑ Top: linear scan from the left. Bottom: binary halves the range each step. With 10 elements the gap is small; at 10M it's the difference between feasible and not.</p>

<h3>3.1 Linear Search — O(n)</h3>
<p><strong>Without it?</strong> — nothing else exists. Every more sophisticated search "beats it under some condition". Linear is the <strong>baseline</strong>: unsorted data, one-off query, no plan to sort — use it.</p>

<h4>Idea</h4>
<p>Walk through, return the index on match; return -1 if you finish without finding it.</p>

<h4>Code</h4>
<pre><code>int linear_search(int a[], int n, int target) {
    for (int i = 0; i &lt; n; i++) {
        if (a[i] == target) return i;     // found
    }
    return -1;                             // not found
}</code></pre>

<h4>Complexity</h4>
<table>
  <thead><tr><th>Case</th><th>Steps</th><th>Big O</th></tr></thead>
  <tbody>
    <tr><td>Best (first hit)</td><td>1</td><td>O(1)</td></tr>
    <tr><td>Worst (last / absent)</td><td>n</td><td>O(n)</td></tr>
    <tr><td>Average</td><td>n/2</td><td>O(n)</td></tr>
  </tbody>
</table>
<p>Space O(1).</p>

<h3>3.2 Binary Search — O(log n)</h3>
<p><strong>Without it?</strong> — searching 10M records means scanning 10M entries — unacceptable. Prerequisite: <strong>data must be sorted</strong> to enjoy the O(log n) jump.</p>

<h4>Idea (one line)</h4>
<blockquote>Compare the middle element each time: <strong>equal</strong> → found; <strong>less than target</strong> → look only at the right half; <strong>greater than target</strong> → look only at the left half. Each step halves the range.</blockquote>

<h4>Code (iterative)</h4>
<pre><code>int binary_search(int a[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo &lt;= hi) {
        int mid = lo + (hi - lo) / 2;       // overflow-safe
        if (a[mid] == target) return mid;
        if (a[mid] &lt; target) lo = mid + 1;  // right half
        else                  hi = mid - 1;  // left half
    }
    return -1;
}</code></pre>

<blockquote>Note <code>mid = (lo + hi) / 2</code> can <strong>overflow</strong> when lo, hi are large (int sum exceeds INT_MAX). <code>lo + (hi - lo) / 2</code> is equivalent and safe. A small but classic industry pitfall.</blockquote>

<h4>Code (recursive)</h4>
<pre><code>int bs_rec(int a[], int lo, int hi, int target) {
    if (lo &gt; hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] &lt; target) return bs_rec(a, mid + 1, hi, target);
    else                 return bs_rec(a, lo, mid - 1, target);
}</code></pre>

<h4>Complexity</h4>
<table>
  <thead><tr><th>Case</th><th>Steps</th><th>Big O</th></tr></thead>
  <tbody>
    <tr><td>Best (mid hits)</td><td>1</td><td>O(1)</td></tr>
    <tr><td>Worst / avg</td><td>log₂ n</td><td>O(log n)</td></tr>
  </tbody>
</table>
<p>Space: iterative O(1), recursive O(log n) (stack depth).</p>

<h4>Linear vs Binary</h4>
<table>
  <thead><tr><th>n</th><th>Linear worst</th><th>Binary worst</th></tr></thead>
  <tbody>
    <tr><td>10</td><td>10</td><td>4</td></tr>
    <tr><td>1,000</td><td>1,000</td><td>10</td></tr>
    <tr><td>1,000,000</td><td>1,000,000</td><td>20</td></tr>
    <tr><td>1,000,000,000</td><td>1 billion</td><td>30</td></tr>
  </tbody>
</table>
<p>That's why sorted data is gold — <strong>after sorting, every lookup costs only ~30 steps even on a billion records</strong>.</p>

<blockquote>Note Binary search <strong>requires</strong> sorted data. If you query only once on unsorted data, <strong>don't</strong> sort just to binary-search — sorting costs O(n log n), worse than O(n) linear. Sorting + binary search wins when you query <strong>many times</strong> on the same data.</blockquote>

<hr>

<h2>Part 4 Basic Sorting — O(n²) — Practice Evaluation Dimensions</h2>
<p>Sorting is the "dishwashing" of computer science — basic but essential. Three <strong>simple but O(n²)</strong> sorts here: bubble, selection, insertion. They aren't fast, but <strong>their simplicity makes them perfect for practicing how to evaluate algorithms with multiple dimensions: stability, in-place, adaptiveness</strong>, beyond just Big O.</p>

<p>All three sorts run on <strong>the same shuffled input</strong> below. <strong>Switch tabs</strong> to compare how they each move toward sorted; click "Shuffle" for a new dataset:</p>

<iframe class="anim-frame" src="blog/blog_data/c-algo-tute-1/anims/sort.html" loading="lazy" style="height: 540px;" title="O(n²) sorts visualization"></iframe>
<p class="anim-caption">↑ Yellow = compare, red = swap, blue = card-in-hand (insertion), green = settled. Watch the comparison/swap counts differ.</p>

<h3>4.0 Four Dimensions for Evaluating a Sort</h3>
<p>Memorize these four labels — every sort below gets graded on them:</p>
<table>
  <thead><tr><th>Dimension</th><th>Meaning</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td><strong>Time complexity</strong></td><td>Best / worst / average</td><td>Hard speed metric</td></tr>
    <tr><td><strong>Space complexity</strong></td><td>Extra memory. <strong>In-place</strong> = O(1) extra</td><td>Memory may be tight on big data</td></tr>
    <tr><td><strong>Stable</strong></td><td>Equal elements <strong>keep their relative order</strong></td><td>Critical when sorting by multiple keys</td></tr>
    <tr><td><strong>Adaptive</strong></td><td>Faster on "nearly sorted" input</td><td>Real-world data is rarely fully random</td></tr>
  </tbody>
</table>

<p><strong>Stability example:</strong> sort students first by name, then by class. If "sort by class" is <strong>stable</strong>, classmates within a class remain alphabetised; if not, names get scrambled.</p>

<h3>4.1 Bubble Sort</h3>
<p><strong>Where the name comes from:</strong> larger values keep "bubbling" to the right.</p>

<h4>Idea</h4>
<p>Sweep the array repeatedly: compare each adjacent pair, swap if left > right. After one sweep, the largest element ends up at the right end. n-1 sweeps total. <em>(Pick "Bubble" in the animation above.)</em></p>

<h4>Code</h4>
<pre><code>void bubble_sort(int a[], int n) {
    for (int i = 0; i &lt; n - 1; i++) {
        int swapped = 0;                    // adaptive flag
        for (int j = 0; j &lt; n - 1 - i; j++) {
            if (a[j] &gt; a[j + 1]) {
                int tmp = a[j];             // swap
                a[j] = a[j + 1];
                a[j + 1] = tmp;
                swapped = 1;
            }
        }
        if (!swapped) break;                // no swap → already sorted
    }
}</code></pre>

<h4>Evaluation</h4>
<table>
  <thead><tr><th>Dimension</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Best</td><td>O(n) (already sorted, breaks after one pass)</td></tr>
    <tr><td>Worst</td><td>O(n²) (fully reversed)</td></tr>
    <tr><td>Average</td><td>O(n²)</td></tr>
    <tr><td>Space</td><td>O(1), <strong>in-place</strong></td></tr>
    <tr><td>Stable</td><td><strong>Yes</strong> (swaps only on strict <code>&gt;</code>)</td></tr>
    <tr><td>Adaptive</td><td><strong>Yes</strong> (with the swapped flag)</td></tr>
  </tbody>
</table>

<h3>4.2 Selection Sort</h3>
<p><strong>Idea:</strong> each pass picks the smallest from the unsorted suffix and puts it at the front. <em>(Pick "Selection" in the animation — note the two-step rhythm: scan-for-min, then one swap.)</em></p>

<h4>Code</h4>
<pre><code>void selection_sort(int a[], int n) {
    for (int i = 0; i &lt; n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j &lt; n; j++) {       // find min position
            if (a[j] &lt; a[min_idx]) min_idx = j;
        }
        if (min_idx != i) {                      // swap into place
            int tmp = a[i];
            a[i] = a[min_idx];
            a[min_idx] = tmp;
        }
    }
}</code></pre>

<h4>Evaluation</h4>
<table>
  <thead><tr><th>Dimension</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Best / worst / avg</td><td>All O(n²) — always n passes finding min</td></tr>
    <tr><td>Space</td><td>O(1), <strong>in-place</strong></td></tr>
    <tr><td>Stable</td><td><strong>No</strong>. E.g. [5a, 5b, 2]: pass 1 swaps 2 with 5a → [2, 5b, 5a] — 5a now after 5b</td></tr>
    <tr><td>Adaptive</td><td><strong>No</strong></td></tr>
    <tr><td>Unique upside</td><td>At most n-1 swaps. Useful when <strong>writes are expensive</strong> (e.g. flash storage)</td></tr>
  </tbody>
</table>

<h3>4.3 Insertion Sort</h3>
<p><strong>Where the name comes from:</strong> like playing cards — pick a card, insert it at the right spot.</p>

<h4>Idea</h4>
<p>Split the array into "sorted prefix" + "unsorted suffix". Each iteration takes the first card of the suffix and slides it left to its correct position. <em>(Pick "Insertion" in the animation — the blue highlighted bar is the card in hand.)</em></p>

<h4>Code</h4>
<pre><code>void insertion_sort(int a[], int n) {
    for (int i = 1; i &lt; n; i++) {
        int key = a[i];               // card in hand
        int j = i - 1;
        while (j &gt;= 0 &amp;&amp; a[j] &gt; key) {
            a[j + 1] = a[j];          // shift greater elements right
            j--;
        }
        a[j + 1] = key;               // drop into the right slot
    }
}</code></pre>

<h4>Evaluation</h4>
<table>
  <thead><tr><th>Dimension</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Best</td><td><strong>O(n)</strong> (already sorted: each card compares once and stops)</td></tr>
    <tr><td>Worst</td><td>O(n²) (fully reversed)</td></tr>
    <tr><td>Average</td><td>O(n²)</td></tr>
    <tr><td>Space</td><td>O(1), <strong>in-place</strong></td></tr>
    <tr><td>Stable</td><td><strong>Yes</strong> (uses <code>&gt;</code>, not <code>&gt;=</code>; equals don't move)</td></tr>
    <tr><td>Adaptive</td><td><strong>Very</strong> (nearly-sorted approaches O(n))</td></tr>
  </tbody>
</table>

<blockquote>Tip <strong>Insertion sort is the fastest of the three on small / nearly-sorted inputs.</strong> Industrial sorts (Java's Timsort, C++ std::sort) <strong>switch to insertion sort</strong> when the partition is small (under a few dozen).</blockquote>

<h3>4.4 Side-by-Side</h3>
<table>
  <thead><tr><th></th><th>Bubble</th><th>Selection</th><th>Insertion</th></tr></thead>
  <tbody>
    <tr><td>Best time</td><td>O(n)</td><td>O(n²)</td><td>O(n)</td></tr>
    <tr><td>Worst / avg</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td></tr>
    <tr><td>Stable</td><td>Yes</td><td>No</td><td>Yes</td></tr>
    <tr><td>Adaptive</td><td>Yes (optimised)</td><td>No</td><td>Yes ⭐</td></tr>
    <tr><td>In-place</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
    <tr><td>Swap count</td><td>Many</td><td>Few (≤ n-1)</td><td>Many shifts</td></tr>
    <tr><td>Use it for</td><td>Teaching</td><td>Costly writes</td><td>Small / nearly sorted ⭐</td></tr>
  </tbody>
</table>

<h3>4.5 What We Learned</h3>
<p>The takeaway: <strong>Big O is not the only metric</strong>. Among three O(n²) sorts:</p>
<ul>
  <li>Bubble and insertion are adaptive; selection isn't</li>
  <li>Selection is unstable; the others are stable</li>
  <li>Selection has the fewest swaps</li>
  <li>Insertion wins on small / near-sorted</li>
</ul>
<p>These dimensions — stability, in-place, adaptive, gap between best and worst — matter as much as the headline Big O. <strong>In post 2 we'll measure O(n log n) sorts with the same ruler and see they too come with tradeoffs.</strong></p>

<hr>

<h2>Recap</h2>
<ul>
  <li><strong>Big O is the ruler</strong>: drop constants and lower-order terms; only the dominating growth matters</li>
  <li><strong>Five classes by heart</strong>: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²)</li>
  <li><strong>Best / worst / average</strong>: industry default = worst</li>
  <li><strong>Space complexity</strong> is a separate ruler; time and space are often interchangeable</li>
  <li><strong>Recursion = base case + recursive case</strong>. Always write base first; always make params approach base</li>
  <li><strong>Divide and conquer</strong> is the soul of O(n log n) algorithms</li>
  <li><strong>Linear search O(n)</strong> works on anything; <strong>binary search O(log n)</strong> needs sorted data</li>
  <li><strong>The O(n²) trio</strong> aren't fast but train you on stability, adaptiveness, in-place — the same dimensions we'll use to evaluate merge / quicksort next</li>
</ul>

<p>See you in post 2 — efficient sorts, and our first encounter with the world of "data structures".</p>
`;
