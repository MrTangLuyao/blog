/* Post body — python-tute-1 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['python-tute-1:zh'] = `
<p class="lead">Python 语法大全 · 用例子学 Python。每个语法都用「代码 → 输出」对照展示，充足例子 · 详细解释 · 实用技巧。本篇涵盖 Part 1–9：print/input、数值运算、类型转换、整除取余、字符串索引与切片、字符串方法、f-string 格式化、列表与元组、条件语句。</p>

<h2>Part 1　print 与 input —— 基本输入输出</h2>
<p><code>print</code> 和 <code>input</code> 是 Python 最基础的两个函数。<code>print</code> 把内容显示到屏幕上，<code>input</code> 从键盘读取用户输入。</p>

<h3>1.1 print 基本用法</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">print("Hello, World!")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Hello, World!</code></pre></div>

<p><code>print</code> 会自动在末尾加换行。想输出多行，可以用 <code>\n</code>（换行符），也可以连续调用多次：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">print("第一行\n第二行")
print("第一行")
print("第二行")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">第一行
第二行
第一行
第二行</code></pre></div>

<h3>1.2 print 输出多个值</h3>
<p><code>print</code> 可以一次输出多个值，用逗号隔开，之间自动加空格。用 <code>sep</code> 参数改变分隔符，<code>end</code> 参数改变末尾字符：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">name = "Alice"
age = 20
print(name, age)

print("A", "B", "C", sep="-")
print("不换行", end="")
print("，接在后面")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Alice 20
A-B-C
不换行，接在后面</code></pre></div>

<h3>1.3 input 基本用法</h3>
<p><code>input</code> 等待用户输入，按下 Enter 后返回输入的字符串：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">name = input("请输入你的名字：")
print("你好，" + name)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">用户输入：Alice
你好，Alice</code></pre></div>
<blockquote>注意：<code>input</code> 返回的永远是<strong>字符串</strong>（<code>str</code>），哪怕用户输入了数字，也需要转换才能做数学运算。</blockquote>

<h2>Part 2　数值运算 —— Python 作计算器</h2>
<p>Python 支持所有常见的数学运算，可以当作功能强大的计算器来用。</p>

<h3>2.1 基本运算符</h3>
<table>
  <thead><tr><th>运算符</th><th>含义</th><th>示例</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td><code>+</code></td><td>加法</td><td><code>3 + 4</code></td><td><code>7</code></td></tr>
    <tr><td><code>-</code></td><td>减法</td><td><code>10 - 3</code></td><td><code>7</code></td></tr>
    <tr><td><code>*</code></td><td>乘法</td><td><code>3 * 4</code></td><td><code>12</code></td></tr>
    <tr><td><code>/</code></td><td>除法</td><td><code>7 / 2</code></td><td><code>3.5</code></td></tr>
    <tr><td><code>**</code></td><td>幂次方</td><td><code>2 ** 10</code></td><td><code>1024</code></td></tr>
    <tr><td><code>//</code></td><td>整除</td><td><code>7 // 2</code></td><td><code>3</code></td></tr>
    <tr><td><code>%</code></td><td>取余（模）</td><td><code>7 % 2</code></td><td><code>1</code></td></tr>
  </tbody>
</table>

<h3>2.2 运算优先级</h3>
<p>Python 遵循数学中的优先级规则：<code>**</code> &gt; <code>*</code> <code>/</code> <code>//</code> <code>%</code> &gt; <code>+</code> <code>-</code>，括号优先级最高。</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">print(2 + 3 * 4)        # 乘法先算
print((2 + 3) * 4)      # 括号先算
print(2 ** 3 + 1)       # 幂先算</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">14
20
9</code></pre></div>

<h3>2.3 整数与浮点数</h3>
<p>Python 中有两种数字类型：<code>int</code>（整数）和 <code>float</code>（浮点数）。只要有一个操作数是 <code>float</code>，结果就是 <code>float</code>；<code>/</code> 除法永远返回 <code>float</code>：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">print(type(4))        # int
print(type(4.0))      # float
print(4 / 2)          # 2.0，不是 2
print(4 // 2)         # 2，整数</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">&lt;class 'int'&gt;
&lt;class 'float'&gt;
2.0
2</code></pre></div>

<h3>2.4 科学计数法</h3>
<p>大数字可以用 <code>e</code> 表示科学计数法：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">x = 5.345e5      # 等于 5.345 × 10^5
y = 2.14e2       # 等于 214.0
print(x + y)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">534714.0</code></pre></div>

<h2>Part 3　类型转换 —— int / float / str</h2>
<p>不同类型的数据不能直接混用。<code>int()</code>、<code>float()</code>、<code>str()</code> 是三个最常用的类型转换函数。</p>

<h3>3.1 转换方向</h3>
<pre><code>用户输入(str) ──→ int() / float() ──→ 数值计算
数值计算结果  ──→ str()            ──→ 字符串拼接</code></pre>

<h3>3.2 str 转 int / float</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">age_str = "25"
age = int(age_str)
print(age + 1)       # 可以做加法了

price_str = "9.99"
price = float(price_str)
print(price * 2)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">26
19.98</code></pre></div>

<h3>3.3 数值转 str</h3>
<p>数值不能直接用 <code>+</code> 和字符串拼接，需要先转成 <code>str</code>：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">age = 20
# print("年龄：" + age)    # 错误！不同类型不能拼接
print("年龄：" + str(age))  # 正确</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">年龄：20</code></pre></div>

<h3>3.4 float 转 int 会截断小数</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">x = float(3.9)
print(int(x))     # 不是四舍五入，是直接丢掉小数部分</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">3</code></pre></div>
<blockquote>注意：<code>int()</code> 是<strong>截断</strong>（向零取整），不是四舍五入。<code>round()</code> 才是四舍五入。</blockquote>

<h3>3.5 综合示例：输入两个数求平均</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">a = float(input("第一个数："))
b = float(input("第二个数："))
print("平均值：" + str((a + b) / 2))</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">用户输入：10
用户输入：20
平均值：15.0</code></pre></div>

<h2>Part 4　整除与取余 —— // 与 %</h2>
<p><code>//</code> 和 <code>%</code> 是两个非常实用的运算符，用于处理"整数分割"问题。</p>

<h3>4.1 整除 //</h3>
<p><code>//</code> 返回除法的整数部分（商），小数部分直接丢掉：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">print(17 // 5)    # 17 ÷ 5 = 3 余 2，取整数部分
print(100 // 7)
print(7 // 7)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">3
14
1</code></pre></div>

<h3>4.2 取余 %</h3>
<p><code>%</code> 返回除法的余数：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">print(17 % 5)     # 17 = 3×5 + 2，余数是 2
print(100 % 7)
print(10 % 2)     # 整除时余数为 0</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">2
2
0</code></pre></div>

<h3>4.3 两者配合：分解时间单位</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">total_minutes = 137
hours = total_minutes // 60
minutes = total_minutes % 60
print(str(hours) + "小时" + str(minutes) + "分钟")

total_days = 400
years = total_days // 365
remaining_days = total_days % 365
print(str(years) + "年零" + str(remaining_days) + "天")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">2小时17分钟
1年零35天</code></pre></div>

<h3>4.4 判断整除性</h3>
<p><code>% == 0</code> 是判断一个数能否被另一个数整除的标准写法：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">n = 24
if n % 2 == 0:
    print(str(n) + " 是偶数")
else:
    print(str(n) + " 是奇数")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">24 是偶数</code></pre></div>

<h2>Part 5　字符串基础 —— 索引与切片</h2>
<p>字符串（<code>str</code>）是 Python 中最常用的序列类型。每个字符都有一个位置（索引）。</p>

<h3>5.1 索引：取单个字符</h3>
<p>Python 字符串的索引从 <code>0</code> 开始，负数索引从末尾开始数：</p>
<pre><code>字符串：  H  e  l  l  o
正索引：  0  1  2  3  4
负索引： -5 -4 -3 -2 -1</code></pre>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">s = "Hello"
print(s[0])     # 第 1 个字符
print(s[4])     # 第 5 个字符
print(s[-1])    # 最后一个字符
print(s[-2])    # 倒数第二个字符</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">H
o
o
l</code></pre></div>

<h3>5.2 切片：取一段子字符串</h3>
<p>切片格式：<code>s[start:end]</code>，取从 <code>start</code> 到 <code>end-1</code> 的字符（不含 <code>end</code>）：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">s = "Hello, World!"
print(s[0:5])    # 取第 0~4 位
print(s[7:12])   # 取第 7~11 位
print(s[:5])     # 省略 start = 从头开始
print(s[7:])     # 省略 end = 到末尾
print(s[:])      # 完整复制</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Hello
World
Hello
World!
Hello, World!</code></pre></div>

<h3>5.3 切片步长</h3>
<p>切片的第三个参数是步长 <code>s[start:end:step]</code>：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">s = "abcdefgh"
print(s[::2])     # 每隔一个取一个
print(s[::-1])    # 步长为负 = 反转字符串
print(s[6:0:-2])  # 从索引 6 开始，每隔一个，往前走</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">aceg
hgfedcba
gec</code></pre></div>
<blockquote>技巧：<code>s[::-1]</code> 是反转字符串的最简洁写法。</blockquote>

<h3>5.4 len() 获取长度</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">s = "Python"
print(len(s))              # 字符串长度
print(s[len(s) - 1])      # 最后一个字符（等价于 s[-1]）</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">6
n</code></pre></div>

<h2>Part 6　字符串方法 —— 常用操作</h2>
<p>字符串对象自带很多方法，可以直接用 <code>.方法名()</code> 调用。</p>

<h3>6.1 大小写转换</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">s = "Hello World"
print(s.upper())      # 全转大写
print(s.lower())      # 全转小写</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">HELLO WORLD
hello world</code></pre></div>

<h3>6.2 去除空白 strip()</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">s = "   hello   "
print(s.strip())      # 去除两端空白
print(s.lstrip())     # 只去左边
print(s.rstrip())     # 只去右边</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">hello
hello
   hello</code></pre></div>

<h3>6.3 分割 split() 与合并 join()</h3>
<p><code>split()</code> 把字符串按空格（或指定字符）分割成列表；<code>join()</code> 把列表合并成字符串：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">sentence = "apple banana cherry"
words = sentence.split()
print(words)
print("-".join(words))

csv_line = "Alice,20,90"
parts = csv_line.split(",")
print(parts)
print(parts[0])</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">['apple', 'banana', 'cherry']
apple-banana-cherry
['Alice', '20', '90']
Alice</code></pre></div>

<h3>6.4 检查字符串内容</h3>
<table>
  <thead><tr><th>方法</th><th>含义</th><th>示例</th></tr></thead>
  <tbody>
    <tr><td><code>s.isdigit()</code></td><td>是否全是数字字符</td><td><code>"123".isdigit()</code> → <code>True</code></td></tr>
    <tr><td><code>s.isalpha()</code></td><td>是否全是字母</td><td><code>"abc".isalpha()</code> → <code>True</code></td></tr>
    <tr><td><code>s.startswith(x)</code></td><td>是否以 x 开头</td><td><code>"hi".startswith("h")</code> → <code>True</code></td></tr>
    <tr><td><code>s.endswith(x)</code></td><td>是否以 x 结尾</td><td><code>"omics".endswith("ics")</code> → <code>True</code></td></tr>
  </tbody>
</table>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">print("123".isdigit())
print("abc".isdigit())
print("hello".startswith("hel"))

s = "Hello, World!"
print("World" in s)
print("Python" in s)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">True
False
True
True
False</code></pre></div>

<h2>Part 7　f-string 格式化 —— 精确控制输出</h2>
<p>f-string（格式化字符串）是 Python 3.6+ 中嵌入变量和表达式到字符串的最推荐方式。在字符串前加 <code>f</code>，用 <code>{}</code> 包住变量名。</p>

<h3>7.1 基本语法与表达式</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">name = "Alice"
age = 20
print(f"我叫 {name}，今年 {age} 岁。")

x = 5
print(f"x 的平方是 {x ** 2}，x 加 1 是 {x + 1}")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">我叫 Alice，今年 20 岁。
x 的平方是 25，x 加 1 是 6</code></pre></div>

<h3>7.2 格式规范：数字精度</h3>
<p>在 <code>{}</code> 里用 <code>:</code> 后接格式规范，控制输出的精度、宽度和对齐：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">price = 9.5
print(f"{price:.2f}")   # 保留 2 位小数
print(f"{price:.4f}")   # 保留 4 位小数</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">9.50
9.5000</code></pre></div>

<h3>7.3 格式规范：列宽与对齐</h3>
<table>
  <thead><tr><th>格式</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td><code>{x:&lt;10}</code></td><td>左对齐，宽度 10</td></tr>
    <tr><td><code>{x:&gt;10}</code></td><td>右对齐，宽度 10</td></tr>
    <tr><td><code>{x:^10}</code></td><td>居中，宽度 10</td></tr>
  </tbody>
</table>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">item = "apple"
price = 3.5
qty = 10

print(f"{'Item':<15}{'Price':>10}{'Qty':>6}")
print(f"{item:<15}{price:>10.2f}{qty:>6}")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">Item                Price   Qty
apple                3.50    10</code></pre></div>

<h3>7.4 前导零</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">for i in range(3):
    print(f"file_{i:02d}.txt")   # 宽度 2，不足补零</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">file_00.txt
file_01.txt
file_02.txt</code></pre></div>
<blockquote>提示：新代码应优先使用 f-string，比旧式 <code>%</code> 格式化更清晰、更强大。</blockquote>

<h2>Part 8　列表与元组 —— 序列类型</h2>
<p>列表（<code>list</code>）和元组（<code>tuple</code>）都是有序的序列，可以存放多个不同类型的值。</p>

<h3>8.1 列表 list</h3>
<p>用方括号 <code>[]</code> 创建列表，列表是<strong>可变的</strong>（mutable）：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

print(fruits[0])      # 第一个元素
print(fruits[-1])     # 最后一个元素
print(len(fruits))    # 列表长度</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">apple
cherry
3</code></pre></div>

<h3>8.2 列表切片与修改</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">nums = [0, 1, 2, 3, 4, 5]
print(nums[1:4])    # 索引 1~3
print(nums[:3])     # 前 3 个
print(nums[::2])    # 每隔一个

fruits = ["apple", "banana", "cherry"]
fruits[1] = "mango"     # 直接修改元素
print(fruits)

fruits.append("grape")  # 在末尾添加
print(fruits)</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">[1, 2, 3]
[0, 1, 2]
[0, 2, 4]
['apple', 'mango', 'cherry']
['apple', 'mango', 'cherry', 'grape']</code></pre></div>

<h3>8.3 元组 tuple</h3>
<p>用小括号 <code>()</code> 创建元组，元组是<strong>不可变的</strong>（immutable）：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">point = (3, 4)
record = ("Alice", 20, 90.5)

print(point[0])
print(record[1])</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">3
20</code></pre></div>
<blockquote>元组常用于函数返回多个值，或作为字典的键（因为不可变）。</blockquote>

<h2>Part 9　条件语句 —— if / elif / else</h2>
<p><code>if</code> 语句让程序根据条件选择不同的执行路径。Python 用<strong>缩进</strong>（通常 4 个空格）区分代码块，不用花括号。</p>

<h3>9.1 基本结构</h3>
<pre><code>if 条件:
    满足条件时执行
elif 另一个条件:
    满足这个条件时执行
else:
    以上都不满足时执行</code></pre>

<h3>9.2 单分支与双分支</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">score = 85
if score &gt;= 60:
    print("及格了！")

score = 45
if score &gt;= 60:
    print("及格")
else:
    print("不及格")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">及格了！
不及格</code></pre></div>

<h3>9.3 多分支 if-elif-else</h3>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">score = 78

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

print(f"成绩等级：{grade}")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">成绩等级：C</code></pre></div>

<h3>9.4 条件中的 in 操作符</h3>
<p><code>in</code> 可以检查一个值是否在列表、字符串或其他容器中，<code>in range(a, b)</code> 检查是否在某个范围内：</p>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:20px 0;font-family:'JetBrains Mono',monospace;"><div style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#a1a1a0;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">python</span><button class="ripple-surface ripple-surface-variant" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.querySelector('span:not(.ripple)').textContent='Copied!';setTimeout(function(){b.querySelector('span:not(.ripple)').textContent='Copy'},1500)})})(this)" style="background:#333332;border:1px solid #4a4a49;color:#a1a1a0;font-family:inherit;font-size:11px;padding:3px 10px;border-radius:8px;cursor:pointer;position:relative;overflow:hidden;"><span>Copy</span></button></div><pre style="margin:0;padding:16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">month = 7
if month in [12, 1, 2]:
    print("夏天")
elif month in [3, 4, 5]:
    print("秋天")
elif month in [6, 7, 8]:
    print("冬天")
else:
    print("春天")

age = 15
if age in range(13, 18):
    print("青少年")</code></pre></div>
<div style="border:1px solid #3a3a39;border-radius:12px;overflow:hidden;margin:8px 0 20px;font-family:'JetBrains Mono',monospace;"><div style="padding:7px 14px;background:#2a2a29;border-bottom:1px solid #3a3a39;"><span style="font-size:11px;color:#6dc198;letter-spacing:.12em;text-transform:uppercase;font-weight:700;">Output</span></div><pre style="margin:0;padding:14px 16px;font-size:13.5px;line-height:1.7;color:#e8e8e8;background:#1f1f1e;overflow-x:auto;border:none;border-radius:0;"><code style="background:none;padding:0;color:inherit;font-size:inherit;border-radius:0;">冬天
青少年</code></pre></div>
`;
