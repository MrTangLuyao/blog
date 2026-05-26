/* Post body — python-tute-2 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['python-tute-2:en'] = `
<p class="lead">Python Syntax Complete Guide · Part 2. This post covers Part 10–18: Comparison &amp; Membership Operators, Function Definition (def/return), while Loop, for Loop &amp; range(), Nested Loops, Dictionaries (dict), Sets (set), List Mutability &amp; Copying, and Advanced List Operations (enumerate/sorted/join).</p>

<h2>Part 10　Comparison and Membership Operators</h2>
<p>Conditional statements rely on various operators to build boolean expressions.</p>

<h3>10.1 Comparison operators</h3>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th><th>Example</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td><code>==</code></td><td>Equal</td><td><code>5 == 5</code></td><td><code>True</code></td></tr>
    <tr><td><code>!=</code></td><td>Not equal</td><td><code>5 != 3</code></td><td><code>True</code></td></tr>
    <tr><td><code>&gt;</code></td><td>Greater than</td><td><code>5 &gt; 3</code></td><td><code>True</code></td></tr>
    <tr><td><code>&lt;</code></td><td>Less than</td><td><code>5 &lt; 3</code></td><td><code>False</code></td></tr>
    <tr><td><code>&gt;=</code></td><td>Greater or equal</td><td><code>5 &gt;= 5</code></td><td><code>True</code></td></tr>
    <tr><td><code>&lt;=</code></td><td>Less or equal</td><td><code>3 &lt;= 5</code></td><td><code>True</code></td></tr>
  </tbody>
</table>
<blockquote>Note: Python equality is <code>==</code> (two equals signs); assignment is <code>=</code> (one). This is one of the most common beginner mistakes!</blockquote>

<h3>10.2 Logical operators and / or / not</h3>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th><th>Rule</th></tr></thead>
  <tbody>
    <tr><td><code>and</code></td><td>AND</td><td>Both sides must be <code>True</code></td></tr>
    <tr><td><code>or</code></td><td>OR</td><td>At least one side must be <code>True</code></td></tr>
    <tr><td><code>not</code></td><td>NOT</td><td>Negates the value</td></tr>
  </tbody>
</table>
<pre><code>x = 15
print(x &gt; 10 and x &lt; 20)    # both conditions met
print(x &lt; 5 or x &gt; 10)      # at least one met
print(not x &gt; 10)            # negation</code></pre>
<pre><code class="lang-text">True
True
False</code></pre>

<h3>10.3 Membership operators in / not in</h3>
<pre><code>vowels = ["a", "e", "i", "o", "u"]
c = "e"
print(c in vowels)       # True
print(c not in vowels)   # False

s = "Hello"
print("ell" in s)        # substring check</code></pre>
<pre><code class="lang-text">True
False
True</code></pre>

<h3>10.4 Chained comparisons</h3>
<p>Python supports chained comparisons just like math notation:</p>
<pre><code>x = 15
print(10 &lt; x &lt; 20)     # equivalent to x &gt; 10 and x &lt; 20</code></pre>
<pre><code class="lang-text">True</code></pre>

<h2>Part 11　Function Definition — def and return</h2>
<p>Functions package a block of code so it can be called repeatedly. Use the <code>def</code> keyword to define one.</p>

<h3>11.1 Parameters and return values</h3>
<pre><code>def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
greet("Bob")

def square(n):
    return n * n

result = square(5)
print(result)
print(square(3) + square(4))</code></pre>
<pre><code class="lang-text">Hello, Alice!
Hello, Bob!
25
25</code></pre>

<h3>11.2 Default parameter values</h3>
<pre><code>def power(base, exp=2):    # exp defaults to 2
    return base ** exp

print(power(3))       # uses default exp=2
print(power(3, 3))    # specifies exp=3</code></pre>
<pre><code class="lang-text">9
27</code></pre>

<h3>11.3 Boolean return values</h3>
<p>Functions that return <code>True</code> / <code>False</code> are usually named with <code>is_</code> or <code>has_</code> prefix:</p>
<pre><code>def is_even(n):
    return n % 2 == 0

print(is_even(4))
print(is_even(7))</code></pre>
<pre><code class="lang-text">True
False</code></pre>

<h2>Part 12　while Loop</h2>
<p>A <code>while</code> loop keeps executing as long as its condition is <code>True</code>, stopping when the condition becomes <code>False</code>.</p>

<h3>12.1 Counting loop</h3>
<pre><code>i = 1
while i &lt;= 5:
    print(i)
    i += 1    # don't forget to update the counter!</code></pre>
<pre><code class="lang-text">1
2
3
4
5</code></pre>
<blockquote>Warning: Forgetting to update the counter makes the condition always <code>True</code>, creating an <strong>infinite loop</strong>. Press Ctrl+C to interrupt.</blockquote>

<h3>12.2 Power table with while</h3>
<pre><code>n = 3    # base
i = 1
while i &lt;= 5:
    print(f"{i} ** {n} = {i ** n}")
    i += 1</code></pre>
<pre><code class="lang-text">1 ** 3 = 1
2 ** 3 = 8
3 ** 3 = 27
4 ** 3 = 64
5 ** 3 = 125</code></pre>

<h3>12.3 while True + break</h3>
<p>When the exit condition is hard to write at the top, use <code>while True</code> with <code>break</code> inside the body:</p>
<pre><code>while True:
    user_input = input("Type q to quit: ")
    if user_input == "q":
        break
    print(f"You typed: {user_input}")
print("Goodbye!")</code></pre>
<pre><code class="lang-text">User types: hello → You typed: hello
User types: q → Goodbye!</code></pre>

<h2>Part 13　for Loop and range()</h2>
<p>The <code>for</code> loop <strong>iterates</strong> over elements of a sequence (list, string, range, etc.).</p>

<h3>13.1 Iterating over lists and strings</h3>
<pre><code>fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

for c in "Hello":
    print(c, end=" ")</code></pre>
<pre><code class="lang-text">apple
banana
cherry
H e l l o</code></pre>

<h3>13.2 range() — generating number sequences</h3>
<p><code>range(start, stop, step)</code> generates integers from <code>start</code> up to (but not including) <code>stop</code>:</p>
<pre><code>for i in range(5):
    print(i, end=" ")    # 0 1 2 3 4
print()

for i in range(1, 6):
    print(i, end=" ")    # 1 2 3 4 5
print()

for i in range(0, 10, 2):
    print(i, end=" ")    # 0 2 4 6 8
print()

for i in range(5, 0, -1):
    print(i, end=" ")    # countdown: 5 4 3 2 1</code></pre>
<pre><code class="lang-text">0 1 2 3 4
1 2 3 4 5
0 2 4 6 8
5 4 3 2 1</code></pre>

<h3>13.3 for vs while — when to use which</h3>
<table>
  <thead><tr><th>Situation</th><th>Prefer</th></tr></thead>
  <tbody>
    <tr><td>Known number of iterations, or iterating a sequence</td><td><code>for</code></td></tr>
    <tr><td>Unknown number of iterations, condition-driven</td><td><code>while</code></td></tr>
  </tbody>
</table>

<h2>Part 14　Nested Loops — Loops Inside Loops</h2>
<p>A loop inside another loop is called a nested loop. Commonly used for 2D structures (tables, matrices). The inner loop completes fully for each single iteration of the outer loop.</p>

<h3>14.1 Printing a multiplication table</h3>
<pre><code>for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}x{j}={i*j}", end="  ")
    print()    # newline after each inner loop</code></pre>
<pre><code class="lang-text">1x1=1  1x2=2  1x3=3
2x1=2  2x2=4  2x3=6
3x1=3  3x2=6  3x3=9</code></pre>

<h3>14.2 Star pattern</h3>
<pre><code>height = 4
for i in range(1, height + 1):
    print("*" * i)</code></pre>
<pre><code class="lang-text">*
**
***
****</code></pre>

<h3>14.3 Iterating a 2D list (matrix)</h3>
<pre><code>matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in matrix:
    for val in row:
        print(val, end=" ")
    print()</code></pre>
<pre><code class="lang-text">1 2 3
4 5 6
7 8 9</code></pre>

<h2>Part 15　Dictionaries — dict</h2>
<p>A dictionary (<code>dict</code>) stores <strong>key-value pairs</strong>. Values are retrieved by key in O(1) time.</p>

<h3>15.1 Creating, modifying, and adding</h3>
<pre><code>person = {"name": "Alice", "age": 20, "score": 90.5}
print(person["name"])
print(person["age"])

person["age"] = 21           # update existing key
person["city"] = "Sydney"    # add new key
print(person)</code></pre>
<pre><code class="lang-text">Alice
20
{'name': 'Alice', 'age': 21, 'score': 90.5, 'city': 'Sydney'}</code></pre>

<h3>15.2 Iterating over a dictionary</h3>
<pre><code>scores = {"Alice": 90, "Bob": 85, "Carol": 92}

for name, score in scores.items():
    print(f"{name}: {score}")</code></pre>
<pre><code class="lang-text">Alice: 90
Bob: 85
Carol: 92</code></pre>

<h3>15.3 Word frequency counter — the classic dict use case</h3>
<pre><code>text = "the cat sat on the mat the cat"
words = text.split()
count = {}

for word in words:
    if word in count:
        count[word] += 1
    else:
        count[word] = 1

print(count)</code></pre>
<pre><code class="lang-text">{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}</code></pre>

<h2>Part 16　Sets — set</h2>
<p>A set (<code>set</code>) is an <strong>unordered collection of unique elements</strong> that supports mathematical set operations.</p>

<h3>16.1 Creating sets and automatic deduplication</h3>
<pre><code>fruits = {"apple", "banana", "cherry", "apple"}  # duplicate removed
print(fruits)

# Convert from list to remove duplicates
numbers = [1, 2, 2, 3, 3, 3]
unique = set(numbers)
print(unique)</code></pre>
<pre><code class="lang-text">{'banana', 'cherry', 'apple'}
{1, 2, 3}</code></pre>

<h3>16.2 Set operations</h3>
<pre><code>A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

print(A &amp; B)    # intersection: in both
print(A | B)    # union: combined
print(A - B)    # difference: in A but not B</code></pre>
<pre><code class="lang-text">{3, 4}
{1, 2, 3, 4, 5, 6}
{1, 2}</code></pre>

<h3>16.3 Practical use — counting common friends</h3>
<pre><code>def common_elements(list1, list2):
    return len(set(list1) &amp; set(list2))

friends_alice = ["Bob", "Carol", "Dave"]
friends_bob   = ["Carol", "Eve", "Alice"]
print(common_elements(friends_alice, friends_bob))</code></pre>
<pre><code class="lang-text">1</code></pre>

<h2>Part 17　List Mutability and Copying</h2>
<p>Lists are <strong>mutable</strong>. Modifying a list affects every variable that references the same list object.</p>

<h3>17.1 The alias trap</h3>
<pre><code>a = [1, 2, 3]
b = a           # b is an alias — both point to the same list
b[0] = 99
print(a)        # a changed too!</code></pre>
<pre><code class="lang-text">[99, 2, 3]</code></pre>
<p><code>b = a</code> is not a copy — it just gives the same list another name.</p>

<h3>17.2 Shallow copy</h3>
<p>To truly copy a list, use <code>.copy()</code> or a full slice <code>[:]</code>:</p>
<pre><code>a = [1, 2, 3]
b = a.copy()     # or b = a[:]
b[0] = 99
print(a)         # a is unaffected
print(b)</code></pre>
<pre><code class="lang-text">[1, 2, 3]
[99, 2, 3]</code></pre>

<h3>17.3 Mutable vs immutable types</h3>
<table>
  <thead><tr><th>Type</th><th>Mutable?</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>list</code></td><td>Yes</td><td><code>[1, 2, 3]</code></td></tr>
    <tr><td><code>dict</code></td><td>Yes</td><td><code>{"a": 1}</code></td></tr>
    <tr><td><code>set</code></td><td>Yes</td><td><code>{1, 2, 3}</code></td></tr>
    <tr><td><code>str</code></td><td>No</td><td><code>"hello"</code></td></tr>
    <tr><td><code>int</code></td><td>No</td><td><code>42</code></td></tr>
    <tr><td><code>tuple</code></td><td>No</td><td><code>(1, 2, 3)</code></td></tr>
  </tbody>
</table>

<h2>Part 18　Advanced List Operations</h2>

<h3>18.1 enumerate() — index and value together</h3>
<pre><code>fruits = ["apple", "banana", "cherry"]

# Pythonic way
for i, fruit in enumerate(fruits):
    print(i, fruit)</code></pre>
<pre><code class="lang-text">0 apple
1 banana
2 cherry</code></pre>

<h3>18.2 sorted() and sort()</h3>
<p><code>sorted()</code> returns a new sorted list without modifying the original; <code>.sort()</code> sorts in place:</p>
<pre><code>nums = [3, 1, 4, 1, 5, 9, 2, 6]

print(sorted(nums))                        # ascending, new list
print(sorted(nums, reverse=True))          # descending
print(nums)                                # original unchanged

words = ["banana", "apple", "fig", "cherry"]
print(sorted(words, key=len))              # sort by length
print(sorted(words, key=lambda w: w[-1])) # sort by last letter</code></pre>
<pre><code class="lang-text">[1, 1, 2, 3, 4, 5, 6, 9]
[9, 6, 5, 4, 3, 2, 1, 1]
[3, 1, 4, 1, 5, 9, 2, 6]
['fig', 'apple', 'banana', 'cherry']
['banana', 'apple', 'fig', 'cherry']</code></pre>

<h3>18.3 join() — combining list elements</h3>
<pre><code>words = ["Hello", "World", "from", "Python"]
print(" ".join(words))
print(", ".join(words))</code></pre>
<pre><code class="lang-text">Hello World from Python
Hello, World, from, Python</code></pre>
`;
