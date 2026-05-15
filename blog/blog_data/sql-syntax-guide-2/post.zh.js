/* Post body — sql-syntax-guide-2 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['sql-syntax-guide-2:zh'] = `
<p class="lead">SQL 语法大全 · 用例子学 SQL（第二篇）。本篇涵盖 Part 11–20：LIMIT/OFFSET、DISTINCT、AS 别名、INNER JOIN、LEFT JOIN、多表连续 JOIN、COUNT、SUM/AVG/MAX/MIN、GROUP BY、HAVING。</p>

<h2>Part 11 LIMIT 与 OFFSET —— 限制行数</h2>
<p><strong>LIMIT N</strong> 只取结果的<strong>前 N 行</strong>。<strong>OFFSET M</strong> 跳过前 M 行再开始取。用于分页或者「取前几名」。</p>

<h3>11.1 LIMIT —— 取前 N 行</h3>
<p><strong>原表 students（按成绩降序后）</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>钱七</td><td>95</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>王五</td><td>78</td></tr>
    <tr><td>孙八</td><td>60</td></tr>
  </tbody>
</table>
<p><strong>取前 3 名</strong></p>
<pre><code>SELECT * FROM students
ORDER BY score DESC
LIMIT 3;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>钱七</td><td>95</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
  </tbody>
</table>
<blockquote>注意 LIMIT <strong>必须跟 ORDER BY 一起用</strong>，否则不知道是按什么标准的「前 3」。不写 ORDER BY 时 LIMIT 给的结果<strong>不确定</strong>（可能每次都不一样）。</blockquote>

<h3>11.2 OFFSET —— 跳过前 M 行</h3>
<p><strong>跳过前 2 行，再取 3 行（即第 3-5 名）</strong></p>
<pre><code>SELECT * FROM students
ORDER BY score DESC
LIMIT 3 OFFSET 2;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>王五</td><td>78</td></tr>
  </tbody>
</table>
<p>OFFSET 2 = 跳过前 2 行（钱七、李四），然后 LIMIT 3 取接下来 3 行。</p>

<h3>11.3 速查表</h3>
<table>
  <thead><tr><th>写法</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td><code>LIMIT 5</code></td><td>取前 5 行</td></tr>
    <tr><td><code>LIMIT 5 OFFSET 0</code></td><td>同上（OFFSET 0 = 不跳过）</td></tr>
    <tr><td><code>LIMIT 5 OFFSET 10</code></td><td>跳过 10 行后取 5 行（第 11-15 行）</td></tr>
    <tr><td><code>LIMIT 1 OFFSET 0</code></td><td>第 1 行</td></tr>
    <tr><td><code>LIMIT 1 OFFSET 1</code></td><td>第 2 行</td></tr>
    <tr><td><code>LIMIT 1 OFFSET 2</code></td><td>第 3 行</td></tr>
    <tr><td><code>LIMIT 1 OFFSET N</code></td><td>第 (N+1) 行</td></tr>
  </tbody>
</table>
<blockquote>提示 记法：<strong>OFFSET 是从 0 开始数的</strong>。想要第 N 行 → OFFSET N-1。</blockquote>

<h3>11.4 实用：分页查询</h3>
<p>网页常需要「每页 10 条」的分页。第 K 页就这样查：</p>
<pre><code>-- 第 1 页（行 1-10）
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 0;

-- 第 2 页（行 11-20）
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;

-- 第 3 页（行 21-30）
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;</code></pre>
<p><strong>公式：第 K 页 = LIMIT 每页大小 OFFSET (K-1) × 每页大小</strong></p>

<h3>11.5 LIMIT 的简写形式</h3>
<p>MySQL 有两种写法等价：</p>
<pre><code>-- 完整写法（推荐）
LIMIT 10 OFFSET 20

-- 简写（注意顺序：先 OFFSET 后 LIMIT）
LIMIT 20, 10</code></pre>
<blockquote>注意 简写 <code>LIMIT M, N</code> 中 <strong>M 是 OFFSET，N 是 LIMIT</strong>，顺序很反直觉，建议用完整写法 <code>LIMIT N OFFSET M</code>。</blockquote>

<h3>11.6 LIMIT 的坑：取「前 3 带并列」时不能用</h3>
<p>如果第 3 名有多个并列，LIMIT 3 只会随机选其中一个。</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>95</td></tr>
    <tr><td>B</td><td>90</td></tr>
    <tr><td>C</td><td>85</td></tr>
    <tr><td>D</td><td>85</td></tr>
    <tr><td>E</td><td>85</td></tr>
    <tr><td>F</td><td>70</td></tr>
  </tbody>
</table>
<p>用 LIMIT 3 取前 3，结果可能是 A、B、C，但 D 和 E 也是 85 分，<strong>被漏掉了</strong>。解决方法是用 HAVING + 子查询取「门槛分」（详见 Part 27 实用技巧）。</p>

<h2>Part 12 DISTINCT —— 去重</h2>
<p><strong>DISTINCT</strong> 用来<strong>去掉重复行</strong>，让每个唯一值只出现一次。</p>

<h3>12.1 单列去重</h3>
<p><strong>原表 orders（多个客户多次下单）</strong></p>
<table>
  <thead><tr><th>order_id</th><th>customer</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td></tr>
    <tr><td>2</td><td>李四</td></tr>
    <tr><td>3</td><td>张三</td></tr>
    <tr><td>4</td><td>王五</td></tr>
    <tr><td>5</td><td>张三</td></tr>
    <tr><td>6</td><td>李四</td></tr>
  </tbody>
</table>
<p><strong>列出所有不重复的客户</strong></p>
<pre><code>SELECT DISTINCT customer FROM orders;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>customer</th></tr></thead>
  <tbody>
    <tr><td>张三</td></tr>
    <tr><td>李四</td></tr>
    <tr><td>王五</td></tr>
  </tbody>
</table>
<p>原表 6 行，去重后<strong>3 个不同的客户</strong>。每人只出现一次。</p>

<h3>12.2 多列组合去重</h3>
<p>DISTINCT 后面有多个列时，是<strong>整个组合</strong>去重，不是每列单独去重。</p>
<p><strong>原表 visits</strong></p>
<table>
  <thead><tr><th>user</th><th>page</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>home</td></tr>
    <tr><td>A</td><td>about</td></tr>
    <tr><td>A</td><td>home</td></tr>
    <tr><td>B</td><td>home</td></tr>
    <tr><td>B</td><td>home</td></tr>
    <tr><td>B</td><td>about</td></tr>
    <tr><td>C</td><td>home</td></tr>
  </tbody>
</table>
<pre><code>SELECT DISTINCT user, page FROM visits;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>user</th><th>page</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>home</td></tr>
    <tr><td>A</td><td>about</td></tr>
    <tr><td>B</td><td>home</td></tr>
    <tr><td>B</td><td>about</td></tr>
    <tr><td>C</td><td>home</td></tr>
  </tbody>
</table>
<p>原表 7 行，(user, page) 这个<strong>组合</strong>有 5 种不同的，所以 5 行。比如 (A, home) 在原表出现 2 次，去重后只 1 次。</p>

<h3>12.3 DISTINCT 配合 COUNT</h3>
<p><strong>COUNT(DISTINCT 列)</strong> 是非常常用的写法 —— 「不同值有多少个」。</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>order_id</th><th>customer</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td></tr>
    <tr><td>2</td><td>李四</td></tr>
    <tr><td>3</td><td>张三</td></tr>
    <tr><td>4</td><td>王五</td></tr>
    <tr><td>5</td><td>张三</td></tr>
    <tr><td>6</td><td>李四</td></tr>
  </tbody>
</table>
<p><strong>对比这两个查询</strong></p>
<pre><code>-- 总订单数（每行算一个）
SELECT COUNT(*) FROM orders;
-- 结果：6

-- 不同客户数
SELECT COUNT(DISTINCT customer) FROM orders;
-- 结果：3</code></pre>
<p>一个数 6 个订单，一个数 3 个不同客户。<strong>都对</strong>，但意义不同。</p>

<h3>12.4 DISTINCT 与 GROUP BY 的关系</h3>
<p>这两个写法<strong>结果相同</strong>：</p>
<pre><code>-- 写法 1：DISTINCT
SELECT DISTINCT customer FROM orders;

-- 写法 2：GROUP BY
SELECT customer FROM orders GROUP BY customer;</code></pre>
<p>如果只是去重，DISTINCT 更简洁；如果还要算每组的统计值（COUNT、SUM 等），用 GROUP BY。</p>
<blockquote>注意 DISTINCT 是对<strong>整个 SELECT 列表</strong>去重，不能只对其中一列去重。想「id 不同但 name 也要显示」需要用 GROUP BY 或子查询。</blockquote>

<h3>12.5 DISTINCT 与 NULL</h3>
<p>NULL 在 DISTINCT 里被当成<strong>一个特殊值</strong>，多个 NULL 算同一个。</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th></tr></thead>
  <tbody>
    <tr><td>张三</td></tr>
    <tr><td>NULL</td></tr>
    <tr><td>李四</td></tr>
    <tr><td>NULL</td></tr>
    <tr><td>张三</td></tr>
  </tbody>
</table>
<pre><code>SELECT DISTINCT name FROM tbl;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th></tr></thead>
  <tbody>
    <tr><td>张三</td></tr>
    <tr><td>NULL</td></tr>
    <tr><td>李四</td></tr>
  </tbody>
</table>
<p>两个 NULL 被合并成一个。</p>

<h2>Part 13 AS —— 起别名</h2>
<p><strong>AS</strong> 给列或表起一个临时的<strong>别名</strong>。别名只影响显示和引用，不改原数据。</p>

<h3>13.1 给列起别名</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>student_id</th><th>student_name</th><th>final_score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>92</td></tr>
  </tbody>
</table>
<pre><code>SELECT student_id   AS id,
       student_name AS name,
       final_score  AS score
FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>92</td></tr>
  </tbody>
</table>
<p>结果列名变得简短了，<strong>原表的列名没变</strong>。</p>

<h3>13.2 给计算表达式起别名（必要）</h3>
<p><strong>不起别名</strong></p>
<pre><code>SELECT name, score, score + 10 FROM students;</code></pre>
<p>结果（列名很丑）：</p>
<table>
  <thead><tr><th>name</th><th>score</th><th>score + 10</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td><td>95</td></tr>
  </tbody>
</table>
<p><strong>起别名（推荐）</strong></p>
<pre><code>SELECT name, score, score + 10 AS bonus_score
FROM students;</code></pre>
<p>特别是聚合函数，<strong>必须起名</strong>，不然列名会是 <code>COUNT(*)</code>：</p>
<pre><code>SELECT class, COUNT(*) AS total_students,
       AVG(score) AS avg_score
FROM students
GROUP BY class;</code></pre>

<h3>13.3 AS 可以省略</h3>
<p>AS 这个关键字本身可以不写：</p>
<pre><code>-- 写法 A（带 AS）
SELECT name AS n FROM students;

-- 写法 B（省略 AS）
SELECT name n FROM students;</code></pre>
<p>两者效果完全一样，但<strong>建议带上 AS</strong>，更清晰。</p>

<h3>13.4 别名包含空格或中文</h3>
<p>如果别名包含空格、中文、特殊字符，要用<strong>反引号</strong>包起来（MySQL）：</p>
<pre><code>SELECT score AS \`期末成绩\`,
       score + 10 AS \`加分后成绩\`
FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>期末成绩</th><th>加分后成绩</th></tr></thead>
  <tbody>
    <tr><td>85</td><td>95</td></tr>
    <tr><td>92</td><td>102</td></tr>
  </tbody>
</table>

<h3>13.5 给表起别名</h3>
<p>表别名在多表 JOIN 时特别有用：</p>
<pre><code>SELECT s.name, c.title
FROM students AS s
JOIN classes  AS c ON s.class_id = c.id;</code></pre>
<p><code>s.name</code> 比 <code>students.name</code> 短得多。通常用 1-3 个字母作表别名。</p>

<h3>13.6 重要：WHERE 里不能用列别名</h3>
<blockquote>错误 <strong>WHERE 不能用 SELECT 里定义的别名！</strong><br>原因：WHERE 比 SELECT 先执行（详见 Part 26）。WHERE 执行时别名还没定义。</blockquote>
<pre><code>-- 报错！别名 b 在 WHERE 里还没定义
SELECT score + 10 AS b FROM students WHERE b &gt; 90;

-- 正确
SELECT score + 10 AS b FROM students WHERE score + 10 &gt; 90;</code></pre>
<p>但 <strong>ORDER BY 可以用别名</strong>，因为它在 SELECT 之后执行：</p>
<pre><code>SELECT score + 10 AS b FROM students ORDER BY b DESC;</code></pre>

<h2>Part 14 INNER JOIN —— 内连接</h2>
<p>当数据散在多张表时，要把它们「<strong>拼起来</strong>」，就用 JOIN。<strong>INNER JOIN</strong>（内连接）是最常用的连接方式。</p>

<h3>14.1 为什么需要 JOIN</h3>
<p>看两张相关的表：</p>
<p><strong>表 students（只有班级 id）</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>101</td></tr>
    <tr><td>2</td><td>李四</td><td>102</td></tr>
    <tr><td>3</td><td>王五</td><td>101</td></tr>
    <tr><td>4</td><td>赵六</td><td>103</td></tr>
  </tbody>
</table>
<p><strong>表 classes（班级名字）</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>一班</td></tr>
    <tr><td>102</td><td>二班</td></tr>
    <tr><td>103</td><td>三班</td></tr>
  </tbody>
</table>
<p>students 表只有 class_id（数字），看不出班级名字。想要「张三 - 一班」这种结果，得把两张表<strong>按 class_id = id 拼起来</strong>。</p>

<h3>14.2 INNER JOIN 基本写法</h3>
<pre><code>SELECT s.name, c.class_name
FROM students AS s
INNER JOIN classes AS c
    ON s.class_id = c.id;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>一班</td></tr>
    <tr><td>李四</td><td>二班</td></tr>
    <tr><td>王五</td><td>一班</td></tr>
    <tr><td>赵六</td><td>三班</td></tr>
  </tbody>
</table>
<p>这就是「从每个学生出发，去 classes 表找对应的班级名」。</p>
<blockquote>提示 INNER 可省略：<code>JOIN</code> 等价于 <code>INNER JOIN</code>。本教程后面就直接写 <code>JOIN</code>。</blockquote>

<h3>14.3 ON 条件做了什么</h3>
<p>JOIN 干的事可以拆成两步：</p>
<p><strong>第 1 步：先做笛卡尔积（4 × 3 = 12 行）</strong></p>
<table>
  <thead><tr><th>s.name</th><th>s.class_id</th><th>c.id</th><th>c.class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>101</td><td>101</td><td>一班</td></tr>
    <tr><td>张三</td><td>101</td><td>102</td><td>二班</td></tr>
    <tr><td>张三</td><td>101</td><td>103</td><td>三班</td></tr>
    <tr><td>李四</td><td>102</td><td>101</td><td>一班</td></tr>
    <tr><td>李四</td><td>102</td><td>102</td><td>二班</td></tr>
    <tr><td>李四</td><td>102</td><td>103</td><td>三班</td></tr>
    <tr><td>王五</td><td>101</td><td>101</td><td>一班</td></tr>
    <tr><td>王五</td><td>101</td><td>102</td><td>二班</td></tr>
    <tr><td>王五</td><td>101</td><td>103</td><td>三班</td></tr>
    <tr><td>赵六</td><td>103</td><td>101</td><td>一班</td></tr>
    <tr><td>赵六</td><td>103</td><td>102</td><td>二班</td></tr>
    <tr><td>赵六</td><td>103</td><td>103</td><td>三班</td></tr>
  </tbody>
</table>
<p><strong>第 2 步：用 ON 条件过滤（只留 s.class_id = c.id 的行）</strong></p>
<table>
  <thead><tr><th>s.name</th><th>s.class_id</th><th>c.id</th><th>c.class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>101</td><td>101</td><td>一班</td></tr>
    <tr><td>李四</td><td>102</td><td>102</td><td>二班</td></tr>
    <tr><td>王五</td><td>101</td><td>101</td><td>一班</td></tr>
    <tr><td>赵六</td><td>103</td><td>103</td><td>三班</td></tr>
  </tbody>
</table>
<p>这就是 INNER JOIN 的本质：笛卡尔积 + ON 过滤。只是 SQL 引擎做了优化，不会真去算笛卡尔积。</p>

<h3>14.4 INNER JOIN 的「内」字含义</h3>
<p>「内」是指「<strong>两边都有匹配的</strong>才保留」。看这个例子：</p>
<p><strong>students 多了一个班级 999（不存在的）</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>101</td></tr>
    <tr><td>2</td><td>李四</td><td>102</td></tr>
    <tr><td>5</td><td>钱七</td><td>999 &lt;- 异常</td></tr>
  </tbody>
</table>
<p><strong>classes 表（没有 999）</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>一班</td></tr>
    <tr><td>102</td><td>二班</td></tr>
  </tbody>
</table>
<pre><code>SELECT s.name, c.class_name
FROM students s
INNER JOIN classes c ON s.class_id = c.id;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>一班</td></tr>
    <tr><td>李四</td><td>二班</td></tr>
  </tbody>
</table>
<p><strong>钱七消失了！</strong>因为 class_id=999 在 classes 表找不到匹配。这是 INNER JOIN 的特点 —— 只留两边都匹配的。</p>
<blockquote>注意 如果你想<strong>保留没匹配的行</strong>（这里是钱七），应该用 <code>LEFT JOIN</code>（Part 15）。</blockquote>

<h2>Part 15 LEFT JOIN —— 左连接</h2>
<p><strong>LEFT JOIN</strong> 也叫左外连接，<strong>保留左表的所有行</strong>，即使右表没匹配（用 NULL 填充）。</p>

<h3>15.1 直接对比 INNER 和 LEFT</h3>
<p><strong>左表 students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>101</td></tr>
    <tr><td>2</td><td>李四</td><td>102</td></tr>
    <tr><td>3</td><td>王五</td><td>101</td></tr>
    <tr><td>4</td><td>钱七</td><td>999</td></tr>
    <tr><td>5</td><td>孙八</td><td>NULL</td></tr>
  </tbody>
</table>
<p><strong>右表 classes</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>一班</td></tr>
    <tr><td>102</td><td>二班</td></tr>
    <tr><td>103</td><td>三班</td></tr>
  </tbody>
</table>
<p><strong>用 INNER JOIN</strong></p>
<pre><code>SELECT s.name, c.class_name
FROM students s
INNER JOIN classes c ON s.class_id = c.id;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>一班</td></tr>
    <tr><td>李四</td><td>二班</td></tr>
    <tr><td>王五</td><td>一班</td></tr>
  </tbody>
</table>
<p>钱七和孙八消失。</p>
<p><strong>用 LEFT JOIN</strong></p>
<pre><code>SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>一班</td></tr>
    <tr><td>李四</td><td>二班</td></tr>
    <tr><td>王五</td><td>一班</td></tr>
    <tr><td>钱七</td><td>NULL</td></tr>
    <tr><td>孙八</td><td>NULL</td></tr>
  </tbody>
</table>
<p>钱七和孙八都保留了，class_name 是 NULL。</p>

<h3>15.2 直观理解</h3>
<blockquote><strong>INNER JOIN：</strong>「两边都有的才保留」—— 严格<br><strong>LEFT JOIN：</strong>「左边的全保留，右边没就 NULL」—— 宽松（左边优先）</blockquote>

<h3>15.3 LEFT JOIN 经典用法：找「没有的」</h3>
<p>LEFT JOIN + IS NULL 是寻找「没匹配项」的标准模式。</p>
<p><strong>找所有「没分到任何班的学生」</strong></p>
<pre><code>SELECT s.name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
WHERE c.id IS NULL;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th></tr></thead>
  <tbody>
    <tr><td>钱七</td></tr>
    <tr><td>孙八</td></tr>
  </tbody>
</table>
<p>原理：LEFT JOIN 后，没匹配的行右表全是 NULL。WHERE c.id IS NULL 就只剩这些行。</p>

<h3>15.4 LEFT JOIN 的大坑：ON vs WHERE</h3>
<p>对右表的过滤，<strong>放在 ON 还是 WHERE 效果不同</strong>。</p>
<p><strong>原表 students</strong></p>
<table>
  <thead><tr><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>101</td></tr>
    <tr><td>李四</td><td>102</td></tr>
    <tr><td>王五</td><td>NULL</td></tr>
  </tbody>
</table>
<p><strong>原表 classes</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th><th>level</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>一班</td><td>高</td></tr>
    <tr><td>102</td><td>二班</td><td>低</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：列出所有学生（包括没班级的），只显示「高」级别班级的名字。</p>
<p><strong>错误：条件放 WHERE</strong></p>
<pre><code>SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
WHERE c.level = '高';</code></pre>
<p><strong>错误结果（王五消失）</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>一班</td></tr>
  </tbody>
</table>
<p>为什么？LEFT JOIN 后王五的 c.level 是 NULL，WHERE c.level = '高' 把它过滤掉了。李四也消失了（他班级是「低」）。</p>
<p><strong>正确：条件放 ON</strong></p>
<pre><code>SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c
    ON s.class_id = c.id AND c.level = '高';</code></pre>
<p><strong>正确结果</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>一班</td></tr>
    <tr><td>李四</td><td>NULL</td></tr>
    <tr><td>王五</td><td>NULL</td></tr>
  </tbody>
</table>
<p>王五保留了。李四也保留了，但因为他班不是「高」，class_name 是 NULL。<strong>所有学生都在</strong>，符合需求。</p>
<blockquote>正确 规则：LEFT JOIN 时，对右表的过滤条件应该放在 <strong>ON</strong> 里，不是 WHERE。WHERE 会把含 NULL 的行也过滤掉，破坏 LEFT 的语义。</blockquote>

<h2>Part 16 多表连续 JOIN</h2>
<p>当涉及 3 张及以上的表时，连续写多个 JOIN 即可。</p>

<h3>16.1 例子：3 表 JOIN</h3>
<p><strong>表 students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>101</td></tr>
    <tr><td>2</td><td>李四</td><td>102</td></tr>
  </tbody>
</table>
<p><strong>表 classes</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th><th>teacher_id</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>一班</td><td>500</td></tr>
    <tr><td>102</td><td>二班</td><td>501</td></tr>
  </tbody>
</table>
<p><strong>表 teachers</strong></p>
<table>
  <thead><tr><th>id</th><th>teacher_name</th></tr></thead>
  <tbody>
    <tr><td>500</td><td>王老师</td></tr>
    <tr><td>501</td><td>李老师</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：每个学生对应的班级名 + 班主任名。</p>
<pre><code>SELECT s.name AS student,
       c.class_name AS class,
       t.teacher_name AS teacher
FROM students s
JOIN classes  c ON s.class_id = c.id
JOIN teachers t ON c.teacher_id = t.id;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>student</th><th>class</th><th>teacher</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>一班</td><td>王老师</td></tr>
    <tr><td>李四</td><td>二班</td><td>李老师</td></tr>
  </tbody>
</table>

<h3>16.2 处理多对多：经过中间表</h3>
<p>多对多关系通常需要一张<strong>中间表</strong>来桥接。</p>
<p><strong>表 students（学生）</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td></tr>
    <tr><td>2</td><td>李四</td></tr>
  </tbody>
</table>
<p><strong>表 courses（课程）</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>10</td><td>数学</td></tr>
    <tr><td>20</td><td>英语</td></tr>
    <tr><td>30</td><td>物理</td></tr>
  </tbody>
</table>
<p><strong>中间表 enrollments（谁选了什么课）</strong></p>
<table>
  <thead><tr><th>student_id</th><th>course_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>10</td></tr>
    <tr><td>1</td><td>20</td></tr>
    <tr><td>2</td><td>20</td></tr>
    <tr><td>2</td><td>30</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：每个学生选了哪些课。</p>
<pre><code>SELECT s.name, c.title
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses    c ON e.course_id = c.id;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>数学</td></tr>
    <tr><td>张三</td><td>英语</td></tr>
    <tr><td>李四</td><td>英语</td></tr>
    <tr><td>李四</td><td>物理</td></tr>
  </tbody>
</table>
<blockquote>提示 多对多标准模板：A 表 → JOIN 中间表 → JOIN B 表。中间表里有 a_id 和 b_id 两个外键。</blockquote>

<h3>16.3 混用 INNER 和 LEFT</h3>
<p>一个查询中可以混合用不同 JOIN 类型。</p>
<p><strong>需求</strong>：列出所有学生（即使没选课），他们选的课程及老师。</p>
<pre><code>SELECT s.name, c.title, t.name
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN courses    c ON e.course_id = c.id
LEFT JOIN teachers   t ON c.teacher_id = t.id;</code></pre>
<p>用 LEFT JOIN 保证学生不丢；如果某个学生没选课，后面所有列都是 NULL。</p>

<h2>Part 17 COUNT —— 计数</h2>
<p><strong>COUNT</strong> 是最常用的<strong>聚合函数</strong>，作用是「数行数」。</p>

<h3>17.1 三种 COUNT 的区别（极重要）</h3>
<table>
  <thead><tr><th>写法</th><th>统计什么</th></tr></thead>
  <tbody>
    <tr><td><code>COUNT(*)</code></td><td>所有行（不管 NULL 不 NULL）</td></tr>
    <tr><td><code>COUNT(列名)</code></td><td>该列<strong>不是 NULL</strong> 的行数</td></tr>
    <tr><td><code>COUNT(DISTINCT 列名)</code></td><td>该列<strong>不重复且不是 NULL</strong> 的值的个数</td></tr>
  </tbody>
</table>

<h3>17.2 用真实数据对比</h3>
<p><strong>原表 sales</strong></p>
<table>
  <thead><tr><th>id</th><th>customer</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>100</td></tr>
    <tr><td>2</td><td>李四</td><td>200</td></tr>
    <tr><td>3</td><td>张三</td><td>NULL</td></tr>
    <tr><td>4</td><td>NULL</td><td>50</td></tr>
    <tr><td>5</td><td>王五</td><td>150</td></tr>
  </tbody>
</table>
<pre><code>SELECT
    COUNT(*)               AS all_rows,
    COUNT(customer)        AS non_null_customer,
    COUNT(amount)          AS non_null_amount,
    COUNT(DISTINCT customer) AS unique_customers
FROM sales;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>all_rows</th><th>non_null_customer</th><th>non_null_amount</th><th>unique_customers</th></tr></thead>
  <tbody>
    <tr><td>5</td><td>4</td><td>4</td><td>3</td></tr>
  </tbody>
</table>
<p>逐项分析：</p>
<table>
  <thead><tr><th>列</th><th>值</th><th>解释</th></tr></thead>
  <tbody>
    <tr><td><code>COUNT(*)</code></td><td>5</td><td>原表 5 行</td></tr>
    <tr><td><code>COUNT(customer)</code></td><td>4</td><td>5 行里 customer 有 1 个 NULL（id=4），剩 4 行</td></tr>
    <tr><td><code>COUNT(amount)</code></td><td>4</td><td>5 行里 amount 有 1 个 NULL（id=3），剩 4 行</td></tr>
    <tr><td><code>COUNT(DISTINCT customer)</code></td><td>3</td><td>不同的非 NULL customer：张三、李四、王五（NULL 不算）</td></tr>
  </tbody>
</table>

<h3>17.3 COUNT 配合 GROUP BY（最常见用法）</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>student</th><th>subject</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>数学</td></tr>
    <tr><td>张三</td><td>英语</td></tr>
    <tr><td>张三</td><td>物理</td></tr>
    <tr><td>李四</td><td>数学</td></tr>
    <tr><td>李四</td><td>英语</td></tr>
    <tr><td>王五</td><td>数学</td></tr>
  </tbody>
</table>
<p><strong>每个学生选了几门课</strong></p>
<pre><code>SELECT student, COUNT(*) AS course_count
FROM enrollments
GROUP BY student;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>student</th><th>course_count</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>3</td></tr>
    <tr><td>李四</td><td>2</td></tr>
    <tr><td>王五</td><td>1</td></tr>
  </tbody>
</table>

<h3>17.4 COUNT 永远 ≥ 0，不会是 NULL</h3>
<p>即使一组里全是 NULL，COUNT 还是返回 0（不是 NULL）。其他聚合函数（SUM、AVG）会返回 NULL。</p>
<p><strong>表 t（全是 NULL）</strong></p>
<table>
  <thead><tr><th>x</th></tr></thead>
  <tbody>
    <tr><td>NULL</td></tr>
    <tr><td>NULL</td></tr>
  </tbody>
</table>
<pre><code>SELECT COUNT(*), COUNT(x), SUM(x), AVG(x)
FROM t;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>COUNT(*)</th><th>COUNT(x)</th><th>SUM(x)</th><th>AVG(x)</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>0</td><td>NULL</td><td>NULL</td></tr>
  </tbody>
</table>

<h3>17.5 经典坑：LEFT JOIN + COUNT(*)</h3>
<p><strong>表 stores</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>A 店</td></tr>
    <tr><td>2</td><td>B 店</td></tr>
    <tr><td>3</td><td>C 店</td></tr>
  </tbody>
</table>
<p><strong>表 sales（B 店没卖过东西，C 店也没）</strong></p>
<table>
  <thead><tr><th>id</th><th>store_id</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>1</td><td>100</td></tr>
    <tr><td>2</td><td>1</td><td>200</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：每个店有多少笔销售（没销售的显示 0）。</p>
<p><strong>错误用 COUNT(*)</strong></p>
<pre><code>SELECT s.name, COUNT(*) AS sale_count
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id
GROUP BY s.id, s.name;</code></pre>
<p><strong>错误结果（B、C 店显示 1 而不是 0）</strong></p>
<table>
  <thead><tr><th>name</th><th>sale_count</th></tr></thead>
  <tbody>
    <tr><td>A 店</td><td>2</td></tr>
    <tr><td>B 店</td><td>1 &lt;- 错！</td></tr>
    <tr><td>C 店</td><td>1 &lt;- 错！</td></tr>
  </tbody>
</table>
<p><strong>正确用 COUNT(右表的非空列)</strong></p>
<pre><code>SELECT s.name, COUNT(sa.id) AS sale_count
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id
GROUP BY s.id, s.name;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>sale_count</th></tr></thead>
  <tbody>
    <tr><td>A 店</td><td>2</td></tr>
    <tr><td>B 店</td><td>0</td></tr>
    <tr><td>C 店</td><td>0</td></tr>
  </tbody>
</table>
<p>原理：B、C 店没销售时，LEFT JOIN 给它们配了一行全 NULL 的 sales。<code>COUNT(*)</code> 把这行也算进去（结果 1）；<code>COUNT(sa.id)</code> 因为 id 是 NULL 不算，结果 0。</p>

<h2>Part 18 SUM / AVG / MAX / MIN</h2>
<p>剩下的 4 个聚合函数。它们<strong>都自动忽略 NULL</strong>。</p>
<table>
  <thead><tr><th>函数</th><th>作用</th></tr></thead>
  <tbody>
    <tr><td><code>SUM(列)</code></td><td>求和</td></tr>
    <tr><td><code>AVG(列)</code></td><td>平均值</td></tr>
    <tr><td><code>MAX(列)</code></td><td>最大值（适用于数字、日期、字符串）</td></tr>
    <tr><td><code>MIN(列)</code></td><td>最小值（同上）</td></tr>
  </tbody>
</table>

<h3>18.1 基本用法</h3>
<p><strong>原表 sales</strong></p>
<table>
  <thead><tr><th>id</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td></tr>
    <tr><td>2</td><td>250</td></tr>
    <tr><td>3</td><td>150</td></tr>
    <tr><td>4</td><td>300</td></tr>
    <tr><td>5</td><td>200</td></tr>
  </tbody>
</table>
<pre><code>SELECT
    SUM(amount)   AS total,
    AVG(amount)   AS average,
    MAX(amount)   AS highest,
    MIN(amount)   AS lowest,
    COUNT(*)      AS num_rows
FROM sales;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>total</th><th>average</th><th>highest</th><th>lowest</th><th>num_rows</th></tr></thead>
  <tbody>
    <tr><td>1000</td><td>200</td><td>300</td><td>100</td><td>5</td></tr>
  </tbody>
</table>

<h3>18.2 NULL 被自动忽略</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>x</th></tr></thead>
  <tbody>
    <tr><td>10</td></tr>
    <tr><td>NULL</td></tr>
    <tr><td>20</td></tr>
    <tr><td>NULL</td></tr>
    <tr><td>30</td></tr>
  </tbody>
</table>
<pre><code>SELECT SUM(x), AVG(x), COUNT(x), COUNT(*)
FROM t;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>SUM(x)</th><th>AVG(x)</th><th>COUNT(x)</th><th>COUNT(*)</th></tr></thead>
  <tbody>
    <tr><td>60</td><td>20</td><td>3</td><td>5</td></tr>
  </tbody>
</table>
<p>注意 AVG = 20 不是 12。AVG = SUM / COUNT(x) = 60/3 = 20。NULL 行<strong>不参与</strong>分子和分母的计算。</p>
<blockquote>注意 如果要让 NULL 当成 0 计入平均，要用 <code>AVG(COALESCE(x, 0))</code>：分母变成 COUNT(*)=5，平均变成 12。</blockquote>

<h3>18.3 MAX/MIN 在字符串和日期上</h3>
<p><strong>表 events</strong></p>
<table>
  <thead><tr><th>name</th><th>date</th></tr></thead>
  <tbody>
    <tr><td>登录</td><td>2024-03-15</td></tr>
    <tr><td>购买</td><td>2024-08-20</td></tr>
    <tr><td>退款</td><td>2024-05-10</td></tr>
  </tbody>
</table>
<pre><code>SELECT MIN(date) AS earliest,
       MAX(date) AS latest
FROM events;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>earliest</th><th>latest</th></tr></thead>
  <tbody>
    <tr><td>2024-03-15</td><td>2024-08-20</td></tr>
  </tbody>
</table>

<h3>18.4 GROUP BY 配合（每组各算一个）</h3>
<p><strong>原表 sales</strong></p>
<table>
  <thead><tr><th>store</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>100</td></tr>
    <tr><td>A</td><td>200</td></tr>
    <tr><td>B</td><td>50</td></tr>
    <tr><td>B</td><td>150</td></tr>
    <tr><td>B</td><td>300</td></tr>
    <tr><td>C</td><td>500</td></tr>
  </tbody>
</table>
<p><strong>每个店的总销售、平均、最高</strong></p>
<pre><code>SELECT store,
       SUM(amount) AS total,
       AVG(amount) AS avg,
       MAX(amount) AS max
FROM sales
GROUP BY store;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>store</th><th>total</th><th>avg</th><th>max</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>300</td><td>150</td><td>200</td></tr>
    <tr><td>B</td><td>500</td><td>166.67</td><td>300</td></tr>
    <tr><td>C</td><td>500</td><td>500</td><td>500</td></tr>
  </tbody>
</table>

<h2>Part 19 GROUP BY —— 分组</h2>
<p>GROUP BY 把行<strong>按某些列的值分组</strong>，每组<strong>压缩成一行</strong>，配合聚合函数算每组的统计值。</p>

<h3>19.1 直观理解 GROUP BY</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>class</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>A</td><td>85</td></tr>
    <tr><td>李四</td><td>B</td><td>92</td></tr>
    <tr><td>王五</td><td>A</td><td>78</td></tr>
    <tr><td>赵六</td><td>A</td><td>88</td></tr>
    <tr><td>钱七</td><td>B</td><td>95</td></tr>
    <tr><td>孙八</td><td>C</td><td>70</td></tr>
  </tbody>
</table>
<p><strong>第 1 步：按 class 分组</strong></p>
<table>
  <thead><tr><th>class</th><th>组里的行</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>张三/85, 王五/78, 赵六/88</td></tr>
    <tr><td>B</td><td>李四/92, 钱七/95</td></tr>
    <tr><td>C</td><td>孙八/70</td></tr>
  </tbody>
</table>
<p><strong>第 2 步：每组算一个聚合值，压缩成一行</strong></p>
<pre><code>SELECT class, COUNT(*) AS num, AVG(score) AS avg
FROM students
GROUP BY class;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>class</th><th>num</th><th>avg</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>3</td><td>83.67</td></tr>
    <tr><td>B</td><td>2</td><td>93.5</td></tr>
    <tr><td>C</td><td>1</td><td>70</td></tr>
  </tbody>
</table>

<h3>19.2 关键规则：SELECT 中的列必须满足之一</h3>
<blockquote>GROUP BY 之后，SELECT 列表中出现的列必须满足以下之一：<br>1. 出现在 GROUP BY 子句中<br>2. 是聚合函数（COUNT、SUM、AVG、MAX、MIN）的结果<br><br>违反这条规则会报错（在严格模式下）。</blockquote>
<p><strong>错误</strong></p>
<pre><code>-- name 既不在 GROUP BY 里，也不是聚合函数
SELECT class, name, COUNT(*)
FROM students
GROUP BY class;</code></pre>
<p><strong>正确</strong></p>
<pre><code>SELECT class, COUNT(*) AS num
FROM students
GROUP BY class;</code></pre>
<p><strong>正确（多列分组）</strong></p>
<pre><code>SELECT class, gender, COUNT(*) AS num
FROM students
GROUP BY class, gender;
-- 此时 (class, gender) 组合是分组键，所以两个都能 SELECT</code></pre>

<h3>19.3 多列 GROUP BY</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>class</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>男</td><td>85</td></tr>
    <tr><td>A</td><td>女</td><td>90</td></tr>
    <tr><td>A</td><td>男</td><td>78</td></tr>
    <tr><td>B</td><td>女</td><td>92</td></tr>
    <tr><td>B</td><td>男</td><td>88</td></tr>
    <tr><td>B</td><td>女</td><td>95</td></tr>
  </tbody>
</table>
<pre><code>SELECT class, gender, COUNT(*) AS num, AVG(score) AS avg
FROM students
GROUP BY class, gender;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>class</th><th>gender</th><th>num</th><th>avg</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>男</td><td>2</td><td>81.5</td></tr>
    <tr><td>A</td><td>女</td><td>1</td><td>90</td></tr>
    <tr><td>B</td><td>男</td><td>1</td><td>88</td></tr>
    <tr><td>B</td><td>女</td><td>2</td><td>93.5</td></tr>
  </tbody>
</table>
<p>每个 (class, gender) 组合是一个组。</p>

<h3>19.4 GROUP BY 与 NULL</h3>
<p>NULL 在 GROUP BY 里被当成一个独立的「组」：</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>category</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>水果</td><td>10</td></tr>
    <tr><td>NULL</td><td>20</td></tr>
    <tr><td>水果</td><td>15</td></tr>
    <tr><td>NULL</td><td>5</td></tr>
  </tbody>
</table>
<pre><code>SELECT category, SUM(amount)
FROM tbl
GROUP BY category;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>category</th><th>SUM(amount)</th></tr></thead>
  <tbody>
    <tr><td>水果</td><td>25</td></tr>
    <tr><td>NULL</td><td>25</td></tr>
  </tbody>
</table>

<h2>Part 20 HAVING —— 分组后筛选</h2>
<p>HAVING 是在<strong>分组之后</strong>用的过滤器。它能用聚合函数（COUNT、SUM 等），WHERE 不能。</p>

<h3>20.1 WHERE vs HAVING 的关键区别</h3>
<table>
  <thead><tr><th>对比</th><th>WHERE</th><th>HAVING</th></tr></thead>
  <tbody>
    <tr><td>执行时机</td><td>分组前</td><td>分组后</td></tr>
    <tr><td>筛选什么</td><td><strong>每一行</strong></td><td><strong>每一组</strong></td></tr>
    <tr><td>能用聚合函数？</td><td>NO</td><td>YES</td></tr>
    <tr><td>作用对象</td><td>原始数据</td><td>聚合后的结果</td></tr>
  </tbody>
</table>

<h3>20.2 用例对比</h3>
<p><strong>原表 sales</strong></p>
<table>
  <thead><tr><th>store</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>100</td></tr>
    <tr><td>A</td><td>200</td></tr>
    <tr><td>A</td><td>50</td></tr>
    <tr><td>B</td><td>500</td></tr>
    <tr><td>B</td><td>300</td></tr>
    <tr><td>C</td><td>80</td></tr>
    <tr><td>C</td><td>40</td></tr>
  </tbody>
</table>
<p><strong>需求：每个店总销售 &gt; 300 的店</strong></p>
<pre><code>SELECT store, SUM(amount) AS total
FROM sales
GROUP BY store
HAVING SUM(amount) &gt; 300;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>store</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>350</td></tr>
    <tr><td>B</td><td>800</td></tr>
  </tbody>
</table>
<p>C 店总额 120 &lt; 300，被 HAVING 过滤。</p>
<p><strong>如果用 WHERE 会报错</strong></p>
<pre><code>-- 报错：WHERE 不能用聚合函数
SELECT store, SUM(amount)
FROM sales
WHERE SUM(amount) &gt; 300
GROUP BY store;</code></pre>
<blockquote>错误 WHERE 在分组之前执行，那时 SUM 还没算出来，所以无法用聚合函数。</blockquote>

<h3>20.3 WHERE 和 HAVING 同时用</h3>
<p>两个可以一起用，分工明确：WHERE 先过滤行，再分组，HAVING 再过滤组。</p>
<p><strong>找 amount &gt; 50 的销售里，每店总额 &gt; 200 的店</strong></p>
<pre><code>SELECT store, SUM(amount) AS total
FROM sales
WHERE amount &gt; 50       -- 行级过滤（先）
GROUP BY store
HAVING SUM(amount) &gt; 200;  -- 组级过滤（后）</code></pre>
<p>执行流程：</p>
<ol>
  <li>WHERE 把 amount=50、80、40 的行扔了</li>
  <li>剩下：A:100/200，B:500/300，C:无</li>
  <li>分组并求和：A=300，B=800（C 没了，不参与分组）</li>
  <li>HAVING 把 ≤ 200 的扔（这里都过关）</li>
</ol>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>store</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>300</td></tr>
    <tr><td>B</td><td>800</td></tr>
  </tbody>
</table>

<h3>20.4 HAVING 中的常见模式</h3>
<table>
  <thead><tr><th>需求</th><th>HAVING 写法</th></tr></thead>
  <tbody>
    <tr><td>每组至少 N 行</td><td><code>HAVING COUNT(*) &gt;= N</code></td></tr>
    <tr><td>每组只有 1 行</td><td><code>HAVING COUNT(*) = 1</code></td></tr>
    <tr><td>某列至少 N 个不同值</td><td><code>HAVING COUNT(DISTINCT 列) &gt;= N</code></td></tr>
    <tr><td>总和超过阈值</td><td><code>HAVING SUM(列) &gt; 1000</code></td></tr>
    <tr><td>平均值在范围内</td><td><code>HAVING AVG(列) BETWEEN 60 AND 90</code></td></tr>
    <tr><td>最大值等于某值</td><td><code>HAVING MAX(列) = 100</code></td></tr>
  </tbody>
</table>

<h3>20.5 HAVING 用别名（部分数据库支持）</h3>
<p>MySQL 允许 HAVING 用 SELECT 里的别名（更简洁）：</p>
<pre><code>SELECT store, SUM(amount) AS total
FROM sales
GROUP BY store
HAVING total &gt; 300;  -- MySQL 支持</code></pre>
<p>SQL 标准其实<strong>不允许</strong>这样，但 MySQL/PostgreSQL 都支持。为了通用，最好还是写完整表达式：</p>
<pre><code>HAVING SUM(amount) &gt; 300</code></pre>
`;
