/* Post body — python-tute-2 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['python-tute-2:zh'] = `
<p class="lead">Python 语法大全 · 第二篇。本篇涵盖 Part 10–18：比较运算符与成员运算符、函数定义（def/return）、while 循环、for 循环与 range()、嵌套循环、字典（dict）、集合（set）、列表的可变性与复制、高级列表操作（enumerate/sorted/append）。</p>

<h2>Part 10　比较运算符与成员运算符</h2>
<p>条件语句中会用到各种运算符来构成条件表达式。</p>

<h3>10.1 比较运算符</h3>
<table>
  <thead><tr><th>运算符</th><th>含义</th><th>示例</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td><code>==</code></td><td>等于</td><td><code>5 == 5</code></td><td><code>True</code></td></tr>
    <tr><td><code>!=</code></td><td>不等于</td><td><code>5 != 3</code></td><td><code>True</code></td></tr>
    <tr><td><code>&gt;</code></td><td>大于</td><td><code>5 &gt; 3</code></td><td><code>True</code></td></tr>
    <tr><td><code>&lt;</code></td><td>小于</td><td><code>5 &lt; 3</code></td><td><code>False</code></td></tr>
    <tr><td><code>&gt;=</code></td><td>大于等于</td><td><code>5 &gt;= 5</code></td><td><code>True</code></td></tr>
    <tr><td><code>&lt;=</code></td><td>小于等于</td><td><code>3 &lt;= 5</code></td><td><code>True</code></td></tr>
  </tbody>
</table>
<blockquote>注意：Python 的等于是 <code>==</code>（两个等号），赋值是 <code>=</code>（一个等号）。这是最容易混淆的地方！</blockquote>

<h3>10.2 逻辑运算符 and / or / not</h3>
<table>
  <thead><tr><th>运算符</th><th>含义</th><th>规则</th></tr></thead>
  <tbody>
    <tr><td><code>and</code></td><td>与</td><td>两边都为 <code>True</code> 才为 <code>True</code></td></tr>
    <tr><td><code>or</code></td><td>或</td><td>任一为 <code>True</code> 即为 <code>True</code></td></tr>
    <tr><td><code>not</code></td><td>非</td><td>取反</td></tr>
  </tbody>
</table>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">x = 15
print(x &gt; 10 and x &lt; 20)    # 两个条件都满足
print(x &lt; 5 or x &gt; 10)      # 至少一个满足
print(not x &gt; 10)            # 取反</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">True
True
False</code></pre></div>

<h3>10.3 成员运算符 in / not in</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">vowels = ["a", "e", "i", "o", "u"]
c = "e"
print(c in vowels)       # True
print(c not in vowels)   # False

s = "Hello"
print("ell" in s)        # 子字符串检查</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">True
False
True</code></pre></div>

<h3>10.4 链式比较</h3>
<p>Python 支持像数学一样的链式比较，更简洁：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">x = 15
print(10 &lt; x &lt; 20)     # 等价于 x &gt; 10 and x &lt; 20</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">True</code></pre></div>

<h2>Part 11　函数定义 —— def 与 return</h2>
<p>函数是把一段代码打包起来、可以反复调用的工具。用 <code>def</code> 关键字定义。</p>

<h3>11.1 基本结构</h3>
<pre><code>def 函数名(参数1, 参数2):
    函数体
    return 返回值</code></pre>

<h3>11.2 有参数 · 有返回值</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
greet("Bob")

def square(n):
    return n * n

result = square(5)
print(result)
print(square(3) + square(4))</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Hello, Alice!
Hello, Bob!
25
25</code></pre></div>

<h3>11.3 默认参数值</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">def power(base, exp=2):    # exp 默认为 2
    return base ** exp

print(power(3))       # 用默认值 exp=2
print(power(3, 3))    # 指定 exp=3</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">9
27</code></pre></div>

<h3>11.4 布尔返回值</h3>
<p>返回 <code>True</code> / <code>False</code> 的函数通常以 <code>is_</code> 或 <code>has_</code> 开头：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">def is_even(n):
    return n % 2 == 0

print(is_even(4))
print(is_even(7))</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">True
False</code></pre></div>

<h2>Part 12　while 循环</h2>
<p><code>while</code> 循环在条件为 <code>True</code> 时不断重复执行，直到条件变为 <code>False</code>。</p>

<h3>12.1 计数循环</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">i = 1
while i &lt;= 5:
    print(i)
    i += 1    # 不要忘记更新计数器！</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">1
2
3
4
5</code></pre></div>
<blockquote>警告：如果忘记更新计数器，条件永远为 <code>True</code>，程序会陷入<strong>死循环</strong>，按 Ctrl+C 中断。</blockquote>

<h3>12.2 while 计算幂次表</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">n = 3    # 底数
i = 1
while i &lt;= 5:
    print(f"{i} ** {n} = {i ** n}")
    i += 1</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">1 ** 3 = 1
2 ** 3 = 8
3 ** 3 = 27
4 ** 3 = 64
5 ** 3 = 125</code></pre></div>

<h3>12.3 while True + break</h3>
<p>有时循环条件不好写在开头，可以用 <code>while True</code> 配合 <code>break</code> 在循环体内部退出：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">while True:
    user_input = input("输入 q 退出：")
    if user_input == "q":
        break
    print(f"你输入了：{user_input}")
print("再见！")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">用户输入：hello → 你输入了：hello
用户输入：q → 再见！</code></pre></div>

<h2>Part 13　for 循环与 range()</h2>
<p><code>for</code> 循环用于<strong>遍历</strong>序列（列表、字符串、range 等）中的每个元素。</p>

<h3>13.1 遍历列表与字符串</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

for c in "Hello":
    print(c, end=" ")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">apple
banana
cherry
H e l l o</code></pre></div>

<h3>13.2 range() 生成数字序列</h3>
<p><code>range(start, stop, step)</code> 生成从 <code>start</code> 到 <code>stop-1</code> 的整数序列：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">for i in range(5):
    print(i, end=" ")    # 0 1 2 3 4
print()

for i in range(1, 6):
    print(i, end=" ")    # 1 2 3 4 5
print()

for i in range(0, 10, 2):
    print(i, end=" ")    # 0 2 4 6 8
print()

for i in range(5, 0, -1):
    print(i, end=" ")    # 5 4 3 2 1（倒序）</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">0 1 2 3 4
1 2 3 4 5
0 2 4 6 8
5 4 3 2 1</code></pre></div>

<h3>13.3 for vs while 的选择</h3>
<table>
  <thead><tr><th>情况</th><th>推荐</th></tr></thead>
  <tbody>
    <tr><td>知道循环次数，或遍历序列</td><td><code>for</code></td></tr>
    <tr><td>循环次数不确定，看条件决定</td><td><code>while</code></td></tr>
  </tbody>
</table>

<h2>Part 14　嵌套循环 —— 循环套循环</h2>
<p>一个循环内部再包含另一个循环，称为嵌套循环。常用于处理二维结构（表格、矩阵）。外层每执行一次，内层完整执行一遍。</p>

<h3>14.1 打印乘法表</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}×{j}={i*j}", end="  ")
    print()    # 内层结束后换行</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">1×1=1  1×2=2  1×3=3
2×1=2  2×2=4  2×3=6
3×1=3  3×2=6  3×3=9</code></pre></div>

<h3>14.2 打印星形图案</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">height = 4
for i in range(1, height + 1):
    print("*" * i)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">*
**
***
****</code></pre></div>

<h3>14.3 遍历二维列表（矩阵）</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in matrix:
    for val in row:
        print(val, end=" ")
    print()</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">1 2 3
4 5 6
7 8 9</code></pre></div>

<h2>Part 15　字典 —— dict</h2>
<p>字典（<code>dict</code>）是一种存储<strong>键值对</strong>的数据结构。通过键（key）快速查找对应的值（value）。</p>

<h3>15.1 创建、修改与添加</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">person = {
    "name": "Alice",
    "age": 20,
    "score": 90.5
}
print(person["name"])
print(person["age"])

person["age"] = 21           # 修改已有键
person["city"] = "Sydney"    # 添加新键
print(person)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Alice
20
{'name': 'Alice', 'age': 21, 'score': 90.5, 'city': 'Sydney'}</code></pre></div>

<h3>15.2 遍历字典</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">scores = {"Alice": 90, "Bob": 85, "Carol": 92}

for name, score in scores.items():
    print(f"{name}: {score}")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Alice: 90
Bob: 85
Carol: 92</code></pre></div>

<h3>15.3 用字典统计词频</h3>
<p>统计文本中每个单词出现的次数——这是字典最经典的用法：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">text = "the cat sat on the mat the cat"
words = text.split()
count = {}

for word in words:
    if word in count:
        count[word] += 1
    else:
        count[word] = 1

print(count)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}</code></pre></div>

<h3>15.4 .keys() · .values() · .items()</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">d = {"a": 1, "b": 2, "c": 3}
print(list(d.keys()))
print(list(d.values()))
print(list(d.items()))</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">['a', 'b', 'c']
[1, 2, 3]
[('a', 1), ('b', 2), ('c', 3)]</code></pre></div>

<h2>Part 16　集合 —— set</h2>
<p>集合（<code>set</code>）是<strong>无序且不重复</strong>的元素集合，支持数学中的集合运算。</p>

<h3>16.1 创建集合 · 自动去重</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">fruits = {"apple", "banana", "cherry", "apple"}  # 重复的 apple 自动去除
print(fruits)

# 从列表转换（常用于去重）
numbers = [1, 2, 2, 3, 3, 3]
unique = set(numbers)
print(unique)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">{'banana', 'cherry', 'apple'}
{1, 2, 3}</code></pre></div>

<h3>16.2 集合运算</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

print(A &amp; B)    # 交集：两者都有的
print(A | B)    # 并集：两者合并
print(A - B)    # 差集：A 有但 B 没有</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">{3, 4}
{1, 2, 3, 4, 5, 6}
{1, 2}</code></pre></div>

<h3>16.3 实际应用：找共同元素</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">def common_elements(list1, list2):
    return len(set(list1) &amp; set(list2))

friends_alice = ["Bob", "Carol", "Dave"]
friends_bob   = ["Carol", "Eve", "Alice"]
print(common_elements(friends_alice, friends_bob))</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">1</code></pre></div>

<h2>Part 17　列表的可变性与复制</h2>
<p>列表是<strong>可变</strong>（mutable）的，这意味着修改列表会影响所有指向同一列表的变量。</p>

<h3>17.1 别名（Alias）陷阱</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">a = [1, 2, 3]
b = a           # b 是 a 的别名，指向同一个列表
b[0] = 99
print(a)        # a 也变了！</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">[99, 2, 3]</code></pre></div>
<p><code>b = a</code> 不是复制，只是给同一个列表又起了个名字。</p>

<h3>17.2 浅复制</h3>
<p>要真正复制一个列表，用 <code>.copy()</code> 或切片 <code>[:]</code>：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">a = [1, 2, 3]
b = a.copy()     # 或者 b = a[:]
b[0] = 99
print(a)         # a 不受影响
print(b)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">[1, 2, 3]
[99, 2, 3]</code></pre></div>

<h3>17.3 可变 vs 不可变</h3>
<table>
  <thead><tr><th>类型</th><th>可变？</th><th>示例</th></tr></thead>
  <tbody>
    <tr><td><code>list</code></td><td>是</td><td><code>[1, 2, 3]</code></td></tr>
    <tr><td><code>dict</code></td><td>是</td><td><code>{"a": 1}</code></td></tr>
    <tr><td><code>set</code></td><td>是</td><td><code>{1, 2, 3}</code></td></tr>
    <tr><td><code>str</code></td><td>否</td><td><code>"hello"</code></td></tr>
    <tr><td><code>int</code></td><td>否</td><td><code>42</code></td></tr>
    <tr><td><code>tuple</code></td><td>否</td><td><code>(1, 2, 3)</code></td></tr>
  </tbody>
</table>

<h2>Part 18　高级列表操作</h2>

<h3>18.1 enumerate() —— 同时获取索引和值</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">fruits = ["apple", "banana", "cherry"]

# Pythonic 的写法
for i, fruit in enumerate(fruits):
    print(i, fruit)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">0 apple
1 banana
2 cherry</code></pre></div>

<h3>18.2 sorted() 与 sort() —— 排序</h3>
<p><code>sorted()</code> 返回新排序列表（不修改原列表）；<code>.sort()</code> 就地排序：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">nums = [3, 1, 4, 1, 5, 9, 2, 6]

print(sorted(nums))                    # 升序，返回新列表
print(sorted(nums, reverse=True))      # 降序
print(nums)                            # 原列表未变

words = ["banana", "apple", "fig", "cherry"]
print(sorted(words, key=len))          # 按长度排序
print(sorted(words, key=lambda w: w[-1]))  # 按最后一个字母排序</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">[1, 1, 2, 3, 4, 5, 6, 9]
[9, 6, 5, 4, 3, 2, 1, 1]
[3, 1, 4, 1, 5, 9, 2, 6]
['fig', 'apple', 'banana', 'cherry']
['banana', 'apple', 'fig', 'cherry']</code></pre></div>

<h3>18.3 join() 拼接列表</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">words = ["Hello", "World", "from", "Python"]
print(" ".join(words))
print(", ".join(words))</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Hello World from Python
Hello, World, from, Python</code></pre></div>
`;
