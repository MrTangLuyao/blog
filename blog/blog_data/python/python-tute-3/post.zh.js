/* Post body — python-tute-3 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['python-tute-3:zh'] = `
<p class="lead">Python 语法大全 · 第三篇。本篇涵盖 Part 19–27：高级函数（None 返回/多返回值/lambda）、列表推导式、常用标准库（math/random/collections/itertools）、文件读写、CSV 文件处理、异常处理（try/except/raise/assert）、递归、调试技巧、实用技巧汇总。</p>

<h2>Part 19　高级函数 —— None 返回 · 多返回值 · lambda</h2>

<h3>19.1 None 返回值</h3>
<p>没有 <code>return</code> 语句（或 <code>return</code> 后面没有值）的函数返回 <code>None</code>：</p>
<pre><code>def greet(name):
    print(f"Hello, {name}")    # 没有 return

result = greet("Alice")
print(result)    # None

def safe_max(lst):
    if not lst:             # 列表为空时
        return None
    return max(lst)

print(safe_max([3, 1, 4]))
print(safe_max([]))</code></pre>
<pre><code class="lang-text">Hello, Alice
None
4
None</code></pre>

<h3>19.2 多返回值（元组）</h3>
<p>Python 函数可以用逗号分隔的方式返回多个值（实际上返回的是一个元组）：</p>
<pre><code>def min_max(lst):
    return min(lst), max(lst)

lo, hi = min_max([3, 1, 4, 1, 5, 9])
print(f"最小值：{lo}，最大值：{hi}")</code></pre>
<pre><code class="lang-text">最小值：1，最大值：9</code></pre>

<h3>19.3 提前返回（Early Return）</h3>
<p>在满足条件时提前 <code>return</code>，避免多层嵌套：</p>
<pre><code>def is_sorted(lst):
    for i in range(1, len(lst)):
        if lst[i] &lt; lst[i - 1]:
            return False     # 发现不满足条件就立刻返回
    return True

print(is_sorted([1, 2, 3, 4]))
print(is_sorted([1, 3, 2, 4]))</code></pre>
<pre><code class="lang-text">True
False</code></pre>

<h3>19.4 lambda 匿名函数</h3>
<p><code>lambda</code> 是定义简单函数的简洁写法，常与 <code>sorted()</code>、<code>map()</code>、<code>filter()</code> 配合使用：</p>
<pre><code>square = lambda x: x ** 2
print(square(5))

students = [("Alice", 90), ("Bob", 85), ("Carol", 92)]

# 按分数升序
sorted_students = sorted(students, key=lambda s: s[1])
print(sorted_students)

# 按分数降序，同分按名字升序
sorted_students = sorted(students, key=lambda s: (-s[1], s[0]))
print(sorted_students)</code></pre>
<pre><code class="lang-text">25
[('Bob', 85), ('Alice', 90), ('Carol', 92)]
[('Carol', 92), ('Alice', 90), ('Bob', 85)]</code></pre>

<h2>Part 20　列表推导式</h2>
<p>列表推导式是用一行代码生成列表的 Pythonic 方式，比 <code>for</code> + <code>append</code> 更简洁。</p>

<h3>20.1 基本语法与对比</h3>
<pre><code># 普通写法
squares = []
for i in range(1, 6):
    squares.append(i ** 2)
print(squares)

# 列表推导式（等价）
squares = [i ** 2 for i in range(1, 6)]
print(squares)</code></pre>
<pre><code class="lang-text">[1, 4, 9, 16, 25]
[1, 4, 9, 16, 25]</code></pre>

<h3>20.2 带条件过滤</h3>
<pre><code># 只取偶数的平方
even_squares = [i ** 2 for i in range(1, 11) if i % 2 == 0]
print(even_squares)

sentence = "Hello World from Python"
words = sentence.split()
lengths = [len(w) for w in words]
print(lengths)

long_words = [w for w in words if len(w) &gt; 4]
print(long_words)</code></pre>
<pre><code class="lang-text">[4, 16, 36, 64, 100]
[5, 5, 4, 6]
['Hello', 'World', 'Python']</code></pre>

<h2>Part 21　常用标准库</h2>
<p>Python 内置了大量标准库，常用的有 <code>math</code>、<code>random</code>、<code>collections</code>、<code>itertools</code>。</p>

<h3>21.1 math 模块</h3>
<pre><code>from math import sqrt, cos, sin, radians, pi

print(sqrt(16))              # 平方根
print(round(pi, 4))         # 圆周率
print(cos(radians(60)))      # 60 度的余弦
print(sin(radians(30)))      # 30 度的正弦</code></pre>
<pre><code class="lang-text">4.0
3.1416
0.5000000000000001
0.49999999999999994</code></pre>

<h3>21.2 random 模块</h3>
<pre><code>from random import randint, choice, shuffle

print(randint(1, 6))         # 1~6 的随机整数（含两端）

fruits = ["apple", "banana", "cherry"]
print(choice(fruits))        # 随机选一个

nums = [1, 2, 3, 4, 5]
shuffle(nums)                # 就地打乱
print(nums)</code></pre>
<pre><code class="lang-text">4
banana
[3, 1, 5, 2, 4]</code></pre>

<h3>21.3 collections.defaultdict</h3>
<p><code>defaultdict</code> 是字典的增强版：访问不存在的键时自动创建默认值，省去了每次检查的麻烦：</p>
<pre><code>from collections import defaultdict

text = "the cat sat on the mat the cat"
count = defaultdict(int)      # 默认值为 0

for word in text.split():
    count[word] += 1          # 不存在的键直接 +1，不报错

print(dict(count))</code></pre>
<pre><code class="lang-text">{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}</code></pre>

<h3>21.4 itertools.permutations</h3>
<pre><code>from itertools import permutations

items = ["A", "B", "C"]
for perm in permutations(items, 2):    # 取 2 个的排列
    print(perm)</code></pre>
<pre><code class="lang-text">('A', 'B')
('A', 'C')
('B', 'A')
('B', 'C')
('C', 'A')
('C', 'B')</code></pre>

<h2>Part 22　文件读写 —— File I/O</h2>
<p>Python 可以读写文本文件，用 <code>open()</code> 函数打开文件，用 <code>with</code> 语句确保文件自动关闭。</p>

<h3>22.1 读取文件</h3>
<pre><code># 读取全部内容
with open("data.txt", "r") as f:
    content = f.read()
print(content)

# 逐行读取
with open("data.txt", "r") as f:
    for line in f:
        print(line.strip())     # strip() 去除行尾换行符</code></pre>
<pre><code class="lang-text">Hello
World
Python</code></pre>

<h3>22.2 写入文件</h3>
<pre><code>with open("output.txt", "w") as f:   # "w" 模式会覆盖原文件
    f.write("第一行\n")
    f.write("第二行\n")

with open("output.txt", "a") as f:   # "a" = append 追加
    f.write("第三行\n")</code></pre>
<blockquote>提示：<code>with</code> 语句结束后，文件会<strong>自动关闭</strong>，不需要手动调用 <code>f.close()</code>。这是推荐写法。</blockquote>

<h2>Part 23　CSV 文件处理</h2>
<p>CSV（Comma-Separated Values）是最常见的数据文件格式，Python 内置 <code>csv</code> 模块处理它。</p>

<h3>23.1 读取 CSV</h3>
<pre><code>import csv

with open("students.csv", "r") as f:
    reader = csv.reader(f)
    header = next(reader)       # 读取第一行（表头）
    print("表头：", header)

    for row in reader:
        print(row)</code></pre>
<pre><code class="lang-text">表头：['name', 'age', 'score']
['Alice', '20', '90']
['Bob', '21', '85']
['Carol', '19', '92']</code></pre>
<blockquote>注意：<code>csv.reader</code> 读取的每一行都是字符串列表，数字也是字符串，需要 <code>int()</code> / <code>float()</code> 转换。</blockquote>

<h3>23.2 写入 CSV</h3>
<pre><code>import csv

data = [
    ["name", "score"],
    ["Alice", 90],
    ["Bob", 85],
]

with open("output.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)</code></pre>
<blockquote>提示：写入 CSV 时加 <code>newline=""</code> 可以避免 Windows 下出现多余空行。</blockquote>

<h2>Part 24　异常处理 —— try / except / raise / assert</h2>
<p>程序运行时可能遇到各种错误（异常）。异常处理让程序能优雅地应对错误，而不是直接崩溃。</p>

<h3>24.1 捕获异常</h3>
<pre><code>try:
    x = int(input("输入一个整数："))
    print(f"你输入了 {x}")
except ValueError:
    print("输入无效，不是整数！")

try:
    result = 10 / int(input("除数："))
    print(result)
except ValueError:
    print("不是有效数字")
except ZeroDivisionError:
    print("不能除以零")</code></pre>

<h3>24.2 常见异常类型</h3>
<table>
  <thead><tr><th>异常类型</th><th>触发场景</th></tr></thead>
  <tbody>
    <tr><td><code>ValueError</code></td><td>类型转换失败（如 <code>int("abc")</code>）</td></tr>
    <tr><td><code>ZeroDivisionError</code></td><td>除以零</td></tr>
    <tr><td><code>IndexError</code></td><td>列表索引越界</td></tr>
    <tr><td><code>KeyError</code></td><td>字典访问不存在的键</td></tr>
    <tr><td><code>FileNotFoundError</code></td><td>打开不存在的文件</td></tr>
  </tbody>
</table>

<h3>24.3 raise 主动抛出异常</h3>
<pre><code>def check_age(age):
    if age &lt; 0:
        raise ValueError("年龄不能为负数！")
    return age

try:
    check_age(-5)
except ValueError as e:
    print(f"错误：{e}")</code></pre>
<pre><code class="lang-text">错误：年龄不能为负数！</code></pre>

<h3>24.4 assert 断言</h3>
<p><code>assert</code> 用于在代码中设置"必须满足的条件"，条件为假时抛出 <code>AssertionError</code>：</p>
<pre><code>def divide(a, b):
    assert b != 0, "除数不能为零"
    return a / b

print(divide(10, 2))
print(divide(10, 0))    # 触发 AssertionError</code></pre>
<pre><code class="lang-text">5.0
AssertionError: 除数不能为零</code></pre>
<blockquote>提示：<code>assert</code> 主要用于开发阶段的调试和测试。生产代码中应该用 <code>if</code> + <code>raise</code> 做参数检查。</blockquote>

<h2>Part 25　递归 —— Recursion</h2>
<p>递归是函数<strong>调用自身</strong>的技术。每个递归函数必须有：<strong>基本情况（Base Case）</strong>——不再递归，直接返回结果；<strong>递归情况（Recursive Case）</strong>——把问题缩小，然后调用自身。</p>
<blockquote>一句话：递归 = 把大问题拆成同类的小问题，直到小到可以直接回答。</blockquote>

<h3>25.1 经典示例：阶乘</h3>
<pre><code>def factorial(n):
    if n &lt;= 1:        # 基本情况
        return 1
    return n * factorial(n - 1)    # 递归情况

print(factorial(5))
# factorial(5) → 5 × factorial(4) → 5 × 4 × ... → 5 × 4 × 3 × 2 × 1</code></pre>
<pre><code class="lang-text">120</code></pre>

<h3>25.2 在列表中递归查找</h3>
<pre><code>def contains(lst, target):
    if not lst:              # 基本情况：空列表
        return False
    if lst[0] == target:    # 基本情况：找到了
        return True
    return contains(lst[1:], target)   # 去掉第一个，继续查找

print(contains([1, 2, 3, 4], 3))
print(contains([1, 2, 3, 4], 9))</code></pre>
<pre><code class="lang-text">True
False</code></pre>

<h3>25.3 分治：找最长单词</h3>
<pre><code>def longest_word(words):
    if not words:
        return None
    if len(words) == 1:
        return words[0]
    mid = len(words) // 2
    left = longest_word(words[:mid])
    right = longest_word(words[mid:])
    return left if len(left) &gt;= len(right) else right

print(longest_word(["cat", "elephant", "dog", "butterfly"]))</code></pre>
<pre><code class="lang-text">butterfly</code></pre>

<h2>Part 26　调试技巧</h2>

<h3>26.1 print 调试法</h3>
<p>最简单的调试方式：在关键位置插入 <code>print</code>，检查变量的值：</p>
<pre><code>def buggy_sum(lst):
    total = 0
    for i in lst:
        print(f"当前 i={i}, total={total}")   # 调试用
        total += i
    return total</code></pre>

<h3>26.2 常见错误类型</h3>
<table>
  <thead><tr><th>错误类型</th><th>含义</th><th>示例</th></tr></thead>
  <tbody>
    <tr><td><code>SyntaxError</code></td><td>语法错误</td><td>忘记冒号、括号不匹配</td></tr>
    <tr><td><code>IndentationError</code></td><td>缩进错误</td><td>混用空格和 Tab</td></tr>
    <tr><td><code>NameError</code></td><td>使用了未定义的变量</td><td><code>print(x)</code> 但 x 没赋值</td></tr>
    <tr><td><code>TypeError</code></td><td>类型不匹配</td><td><code>"hello" + 5</code></td></tr>
    <tr><td><code>IndexError</code></td><td>索引越界</td><td><code>lst[10]</code> 但列表只有 5 个元素</td></tr>
    <tr><td><code>LogicError</code></td><td>逻辑错误（不报错但结果错）</td><td>把 <code>&gt;</code> 写成了 <code>&gt;=</code></td></tr>
  </tbody>
</table>

<h3>26.3 边界条件检查</h3>
<pre><code>def get_middle(lst):
    mid = len(lst) // 2
    return lst[mid]

# 测试各种边界情况
print(get_middle([1]))          # 只有一个元素
print(get_middle([1, 2]))       # 两个元素
print(get_middle([1, 2, 3]))    # 三个元素</code></pre>
<pre><code class="lang-text">1
2
2</code></pre>

<h2>Part 27　实用技巧汇总</h2>

<h3>27.1 交换两个变量</h3>
<pre><code>a, b = 5, 10
a, b = b, a          # Python 独特的优雅写法
print(a, b)</code></pre>
<pre><code class="lang-text">10 5</code></pre>

<h3>27.2 解包（Unpacking）</h3>
<pre><code>first, *rest = [1, 2, 3, 4, 5]
print(first)    # 1
print(rest)     # [2, 3, 4, 5]

x, y = (10, 20)
print(x, y)</code></pre>
<pre><code class="lang-text">1
[2, 3, 4, 5]
10 20</code></pre>

<h3>27.3 any() 和 all()</h3>
<pre><code>nums = [2, 4, 6, 8]
print(all(n % 2 == 0 for n in nums))   # 全部是偶数？
print(any(n &gt; 5 for n in nums))         # 有任意一个 &gt; 5？</code></pre>
<pre><code class="lang-text">True
True</code></pre>

<h3>27.4 zip() 并行遍历</h3>
<pre><code>names = ["Alice", "Bob", "Carol"]
scores = [90, 85, 92]

for name, score in zip(names, scores):
    print(f"{name}: {score}")</code></pre>
<pre><code class="lang-text">Alice: 90
Bob: 85
Carol: 92</code></pre>

<h3>27.5 Python 执行流程心智模型</h3>
<pre><code>1. 从上到下顺序执行
2. 遇到 if/elif/else → 根据条件选择分支
3. 遇到 for/while → 重复执行循环体
4. 遇到 def → 定义函数（不执行）
5. 遇到函数调用 f() → 跳入函数体执行，遇到 return 回来
6. 遇到 try → 尝试执行，出错就跳到 except</code></pre>
`;
