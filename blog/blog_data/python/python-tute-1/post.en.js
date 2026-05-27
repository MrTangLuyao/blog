/* Post body — python-tute-1 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['python-tute-1:en'] = `
<p class="lead">Python Syntax Complete Guide · Learn Python by Example. Every syntax is shown with a "code → output" side-by-side comparison, with abundant examples, detailed explanations, and practical tips. This post covers Part 1–9: print/input, Numeric Operations, Type Conversion, Floor Division &amp; Modulo, String Indexing &amp; Slicing, String Methods, f-string Formatting, Lists &amp; Tuples, and Conditionals.</p>

<h2>Part 1　print and input — Basic I/O</h2>
<p><code>print</code> and <code>input</code> are Python's two most fundamental built-in functions. <code>print</code> displays content to the screen; <code>input</code> reads a line of text from the keyboard.</p>

<h3>1.1 print basics</h3>
<pre><code>print("Hello, World!")</code></pre>
<pre><code class="lang-text">Hello, World!</code></pre>

<p><code>print</code> automatically appends a newline. Use <code>\n</code> for multiple lines in one call, or call <code>print</code> several times:</p>
<pre><code>print("Line 1\nLine 2")
print("Line 1")
print("Line 2")</code></pre>
<pre><code class="lang-text">Line 1
Line 2
Line 1
Line 2</code></pre>

<h3>1.2 print with multiple values</h3>
<p><code>print</code> can output multiple values separated by commas — it inserts a space between them automatically. Use <code>sep</code> to change the separator and <code>end</code> to change the terminator:</p>
<pre><code>name = "Alice"
age = 20
print(name, age)

print("A", "B", "C", sep="-")
print("no newline", end="")
print(", continued here")</code></pre>
<pre><code class="lang-text">Alice 20
A-B-C
no newline, continued here</code></pre>

<h3>1.3 input basics</h3>
<p><code>input</code> waits for the user to type something and press Enter, then returns the typed text as a string:</p>
<pre><code>name = input("Enter your name: ")
print("Hello, " + name)</code></pre>
<pre><code class="lang-text">User types: Alice
Hello, Alice</code></pre>
<blockquote>Note: <code>input</code> <strong>always returns a string</strong> (<code>str</code>). Even if the user types a number, you must convert it before doing math.</blockquote>

<h2>Part 2　Numeric Operations — Python as a Calculator</h2>
<p>Python supports all common arithmetic operations and can serve as a powerful calculator.</p>

<h3>2.1 Basic operators</h3>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th><th>Example</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td><code>+</code></td><td>Addition</td><td><code>3 + 4</code></td><td><code>7</code></td></tr>
    <tr><td><code>-</code></td><td>Subtraction</td><td><code>10 - 3</code></td><td><code>7</code></td></tr>
    <tr><td><code>*</code></td><td>Multiplication</td><td><code>3 * 4</code></td><td><code>12</code></td></tr>
    <tr><td><code>/</code></td><td>Division</td><td><code>7 / 2</code></td><td><code>3.5</code></td></tr>
    <tr><td><code>**</code></td><td>Exponentiation</td><td><code>2 ** 10</code></td><td><code>1024</code></td></tr>
    <tr><td><code>//</code></td><td>Floor division</td><td><code>7 // 2</code></td><td><code>3</code></td></tr>
    <tr><td><code>%</code></td><td>Modulo (remainder)</td><td><code>7 % 2</code></td><td><code>1</code></td></tr>
  </tbody>
</table>

<h3>2.2 Operator precedence</h3>
<p>Python follows standard math precedence: <code>**</code> &gt; <code>*</code> <code>/</code> <code>//</code> <code>%</code> &gt; <code>+</code> <code>-</code>. Parentheses have the highest priority.</p>
<pre><code>print(2 + 3 * 4)        # multiplication first
print((2 + 3) * 4)      # parentheses first
print(2 ** 3 + 1)       # exponentiation first</code></pre>
<pre><code class="lang-text">14
20
9</code></pre>

<h3>2.3 int vs float</h3>
<p>Python has two numeric types: <code>int</code> (integer) and <code>float</code>. If either operand is <code>float</code>, the result is <code>float</code>. The <code>/</code> operator <strong>always</strong> returns a <code>float</code>:</p>
<pre><code>print(type(4))        # int
print(type(4.0))      # float
print(4 / 2)          # 2.0, not 2
print(4 // 2)         # 2, integer</code></pre>
<pre><code class="lang-text">&lt;class 'int'&gt;
&lt;class 'float'&gt;
2.0
2</code></pre>

<h2>Part 3　Type Conversion — int / float / str</h2>
<p>Different types cannot be mixed directly. <code>int()</code>, <code>float()</code>, and <code>str()</code> are the three most common conversion functions.</p>

<h3>3.1 Conversion flow</h3>
<pre><code>user input (str) ──→ int() / float() ──→ numeric operations
numeric result   ──→ str()            ──→ string concatenation</code></pre>

<h3>3.2 str → int / float</h3>
<pre><code>age_str = "25"
age = int(age_str)
print(age + 1)       # now we can do arithmetic

price_str = "9.99"
price = float(price_str)
print(price * 2)</code></pre>
<pre><code class="lang-text">26
19.98</code></pre>

<h3>3.3 number → str</h3>
<p>Numbers can't be concatenated to strings with <code>+</code> directly — convert to <code>str</code> first:</p>
<pre><code>age = 20
# print("Age: " + age)      # Error! can't mix types
print("Age: " + str(age))   # Correct</code></pre>
<pre><code class="lang-text">Age: 20</code></pre>

<h3>3.4 float → int truncates</h3>
<pre><code>x = float(3.9)
print(int(x))     # truncates — does NOT round</code></pre>
<pre><code class="lang-text">3</code></pre>
<blockquote>Note: <code>int()</code> <strong>truncates</strong> (rounds toward zero), it does not round. Use <code>round()</code> for rounding.</blockquote>

<h2>Part 4　Floor Division &amp; Modulo — // and %</h2>
<p><code>//</code> and <code>%</code> are two very practical operators for splitting integers into smaller units.</p>

<h3>4.1 Floor division //</h3>
<p><code>//</code> returns the integer part of the quotient, discarding the decimal:</p>
<pre><code>print(17 // 5)    # 17 ÷ 5 = 3 remainder 2, quotient is 3
print(100 // 7)
print(7 // 7)</code></pre>
<pre><code class="lang-text">3
14
1</code></pre>

<h3>4.2 Modulo %</h3>
<p><code>%</code> returns the remainder of division:</p>
<pre><code>print(17 % 5)     # 17 = 3×5 + 2, remainder is 2
print(100 % 7)
print(10 % 2)     # evenly divisible, remainder is 0</code></pre>
<pre><code class="lang-text">2
2
0</code></pre>

<h3>4.3 Combined use — breaking down time units</h3>
<pre><code>total_minutes = 137
hours = total_minutes // 60
minutes = total_minutes % 60
print(str(hours) + " hours " + str(minutes) + " minutes")

total_days = 400
years = total_days // 365
remaining_days = total_days % 365
print(str(years) + " year and " + str(remaining_days) + " days")</code></pre>
<pre><code class="lang-text">2 hours 17 minutes
1 year and 35 days</code></pre>

<h3>4.4 Divisibility check</h3>
<p><code>% == 0</code> is the standard way to check if one number divides evenly into another:</p>
<pre><code>n = 24
if n % 2 == 0:
    print(str(n) + " is even")
else:
    print(str(n) + " is odd")</code></pre>
<pre><code class="lang-text">24 is even</code></pre>

<h2>Part 5　String Basics — Indexing and Slicing</h2>
<p>Strings (<code>str</code>) are Python's most commonly used sequence type. Each character has a position (index).</p>

<h3>5.1 Indexing — getting a single character</h3>
<p>Python string indexes start at <code>0</code>; negative indexes count from the end:</p>
<pre><code>string:   H  e  l  l  o
positive: 0  1  2  3  4
negative:-5 -4 -3 -2 -1</code></pre>
<pre><code>s = "Hello"
print(s[0])     # first character
print(s[4])     # fifth character
print(s[-1])    # last character
print(s[-2])    # second-to-last</code></pre>
<pre><code class="lang-text">H
o
o
l</code></pre>

<h3>5.2 Slicing — getting a substring</h3>
<p>Slice format: <code>s[start:end]</code> — extracts characters from <code>start</code> up to (but not including) <code>end</code>:</p>
<pre><code>s = "Hello, World!"
print(s[0:5])    # indexes 0-4
print(s[7:12])   # indexes 7-11
print(s[:5])     # omit start = from the beginning
print(s[7:])     # omit end = to the end
print(s[:])      # full copy</code></pre>
<pre><code class="lang-text">Hello
World
Hello
World!
Hello, World!</code></pre>

<h3>5.3 Slice step</h3>
<p>The third parameter is the step: <code>s[start:end:step]</code>:</p>
<pre><code>s = "abcdefgh"
print(s[::2])     # every other character
print(s[::-1])    # negative step = reverse the string
print(s[6:0:-2])  # start at 6, step -2 going backwards</code></pre>
<pre><code class="lang-text">aceg
hgfedcba
gec</code></pre>
<blockquote>Tip: <code>s[::-1]</code> is the most concise way to reverse a string.</blockquote>

<h2>Part 6　String Methods — Common Operations</h2>
<p>String objects come with many built-in methods callable with <code>.method_name()</code>.</p>

<h3>6.1 Case conversion</h3>
<pre><code>s = "Hello World"
print(s.upper())      # all uppercase
print(s.lower())      # all lowercase</code></pre>
<pre><code class="lang-text">HELLO WORLD
hello world</code></pre>

<h3>6.2 Stripping whitespace</h3>
<pre><code>s = "   hello   "
print(s.strip())      # remove both ends
print(s.lstrip())     # remove left only
print(s.rstrip())     # remove right only</code></pre>
<pre><code class="lang-text">hello
hello
   hello</code></pre>

<h3>6.3 split() and join()</h3>
<p><code>split()</code> splits a string into a list; <code>join()</code> combines a list into a string:</p>
<pre><code>sentence = "apple banana cherry"
words = sentence.split()
print(words)
print("-".join(words))

csv_line = "Alice,20,90"
parts = csv_line.split(",")
print(parts)
print(parts[0])</code></pre>
<pre><code class="lang-text">['apple', 'banana', 'cherry']
apple-banana-cherry
['Alice', '20', '90']
Alice</code></pre>

<h3>6.4 Checking string content</h3>
<table>
  <thead><tr><th>Method</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>s.isdigit()</code></td><td>All digit characters?</td><td><code>"123".isdigit()</code> → <code>True</code></td></tr>
    <tr><td><code>s.isalpha()</code></td><td>All letters?</td><td><code>"abc".isalpha()</code> → <code>True</code></td></tr>
    <tr><td><code>s.startswith(x)</code></td><td>Starts with x?</td><td><code>"hi".startswith("h")</code> → <code>True</code></td></tr>
    <tr><td><code>s.endswith(x)</code></td><td>Ends with x?</td><td><code>"omics".endswith("ics")</code> → <code>True</code></td></tr>
  </tbody>
</table>
<pre><code>print("123".isdigit())
print("abc".isdigit())
print("hello".startswith("hel"))

s = "Hello, World!"
print("World" in s)
print("Python" in s)</code></pre>
<pre><code class="lang-text">True
False
True
True
False</code></pre>

<h2>Part 7　f-string Formatting — Precise Output Control</h2>
<p>f-strings (formatted string literals, Python 3.6+) are the recommended way to embed variables and expressions in strings. Prefix the string with <code>f</code> and wrap expressions in <code>{}</code>.</p>

<h3>7.1 Basic syntax and expressions</h3>
<pre><code>name = "Alice"
age = 20
print(f"My name is {name}, I am {age} years old.")

x = 5
print(f"x squared is {x ** 2}, x + 1 is {x + 1}")</code></pre>
<pre><code class="lang-text">My name is Alice, I am 20 years old.
x squared is 25, x + 1 is 6</code></pre>

<h3>7.2 Format spec — numeric precision</h3>
<p>Use <code>:</code> inside <code>{}</code> followed by a format spec to control precision, width, and alignment:</p>
<pre><code>price = 9.5
print(f"{price:.2f}")   # 2 decimal places
print(f"{price:.4f}")   # 4 decimal places</code></pre>
<pre><code class="lang-text">9.50
9.5000</code></pre>

<h3>7.3 Format spec — width and alignment</h3>
<table>
  <thead><tr><th>Format</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>{x:&lt;10}</code></td><td>Left-align, width 10</td></tr>
    <tr><td><code>{x:&gt;10}</code></td><td>Right-align, width 10</td></tr>
    <tr><td><code>{x:^10}</code></td><td>Center, width 10</td></tr>
  </tbody>
</table>
<pre><code>item = "apple"
price = 3.5
qty = 10

print(f"{'Item':<15}{'Price':>10}{'Qty':>6}")
print(f"{item:<15}{price:>10.2f}{qty:>6}")</code></pre>
<pre><code class="lang-text">Item                Price   Qty
apple                3.50    10</code></pre>

<h3>7.4 Leading zeros</h3>
<pre><code>for i in range(3):
    print(f"file_{i:02d}.txt")   # width 2, pad with zeros</code></pre>
<pre><code class="lang-text">file_00.txt
file_01.txt
file_02.txt</code></pre>
<blockquote>Tip: Always prefer f-strings over the old <code>%</code>-style formatting — they are clearer and more powerful.</blockquote>

<h2>Part 8　Lists and Tuples — Sequence Types</h2>
<p>Both lists (<code>list</code>) and tuples (<code>tuple</code>) are ordered sequences that can hold values of different types.</p>

<h3>8.1 Lists</h3>
<p>Created with square brackets <code>[]</code>. Lists are <strong>mutable</strong> — their contents can be changed:</p>
<pre><code>fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

print(fruits[0])      # first element
print(fruits[-1])     # last element
print(len(fruits))    # list length</code></pre>
<pre><code class="lang-text">apple
cherry
3</code></pre>

<h3>8.2 Slicing and modifying lists</h3>
<pre><code>nums = [0, 1, 2, 3, 4, 5]
print(nums[1:4])    # indexes 1-3
print(nums[:3])     # first 3
print(nums[::2])    # every other

fruits = ["apple", "banana", "cherry"]
fruits[1] = "mango"     # modify in place
print(fruits)

fruits.append("grape")  # add to end
print(fruits)</code></pre>
<pre><code class="lang-text">[1, 2, 3]
[0, 1, 2]
[0, 2, 4]
['apple', 'mango', 'cherry']
['apple', 'mango', 'cherry', 'grape']</code></pre>

<h3>8.3 Tuples</h3>
<p>Created with parentheses <code>()</code>. Tuples are <strong>immutable</strong> — they cannot be modified after creation:</p>
<pre><code>point = (3, 4)
record = ("Alice", 20, 90.5)

print(point[0])
print(record[1])</code></pre>
<pre><code class="lang-text">3
20</code></pre>
<blockquote>Tuples are commonly used for returning multiple values from a function, or as dictionary keys (because they are hashable).</blockquote>

<h2>Part 9　Conditionals — if / elif / else</h2>
<p><code>if</code> statements let your program choose between different execution paths. Python uses <strong>indentation</strong> (typically 4 spaces) to delimit code blocks — no curly braces needed.</p>

<h3>9.1 Basic structure</h3>
<pre><code>if condition:
    execute if condition is True
elif another_condition:
    execute if this condition is True
else:
    execute if none of the above are True</code></pre>

<h3>9.2 Single branch and two-way branch</h3>
<pre><code>score = 85
if score &gt;= 60:
    print("Passed!")

score = 45
if score &gt;= 60:
    print("Pass")
else:
    print("Fail")</code></pre>
<pre><code class="lang-text">Passed!
Fail</code></pre>

<h3>9.3 Multi-way branch if-elif-else</h3>
<pre><code>score = 78

if score &gt;= 90:
    grade = "A"
elif score &gt;= 80:
    grade = "B"
elif score &gt;= 70:
    grade = "C"
elif score &gt;= 60:
    grade = "D"
else:
    grade = "F"

print(f"Grade: {grade}")</code></pre>
<pre><code class="lang-text">Grade: C</code></pre>

<h3>9.4 The in operator in conditions</h3>
<p><code>in</code> checks whether a value is contained in a list, string, or other container. <code>in range(a, b)</code> checks whether a value falls in a numeric range:</p>
<pre><code>month = 7
if month in [12, 1, 2]:
    print("Summer")
elif month in [3, 4, 5]:
    print("Autumn")
elif month in [6, 7, 8]:
    print("Winter")
else:
    print("Spring")

age = 15
if age in range(13, 18):
    print("Teenager")</code></pre>
<pre><code class="lang-text">Winter
Teenager</code></pre>
`;
