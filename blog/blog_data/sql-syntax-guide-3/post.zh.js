/* Post body — sql-syntax-guide-3 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['sql-syntax-guide-3:zh'] = `
<p class="lead">SQL 语法大全 · 用例子学 SQL（第三篇）。本篇涵盖 Part 21–27：子查询（WHERE/FROM）、EXISTS/NOT EXISTS、COALESCE、CASE WHEN、SQL 执行顺序（必背），以及实用技巧汇总。</p>

<h2>Part 21 子查询（在 WHERE 里）</h2>
<p><strong>子查询</strong>就是「查询里嵌套查询」。内层查询的结果给外层查询用。最常见的是放在 WHERE 里。</p>

<h3>21.1 子查询返回单值</h3>
<p><strong>原表 students</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>王五</td><td>78</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>钱七</td><td>95</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：找成绩高于平均分的学生。</p>
<pre><code>SELECT * FROM students
WHERE score &gt; (SELECT AVG(score) FROM students);</code></pre>
<p><strong>执行步骤：</strong></p>
<p><strong>第 1 步</strong>：先跑内层 <code>SELECT AVG(score) FROM students</code> → 87.6</p>
<p><strong>第 2 步</strong>：把 87.6 代入外层，变成：</p>
<pre><code>SELECT * FROM students WHERE score &gt; 87.6;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>钱七</td><td>95</td></tr>
  </tbody>
</table>
<blockquote>注意 当子查询用 <code>=</code>、<code>&gt;</code>、<code>&lt;</code> 等比较时，<strong>必须返回单值</strong>（1 行 1 列）。否则报错。要返回多行就要用 <code>IN</code>、<code>EXISTS</code> 等。</blockquote>

<h3>21.2 子查询返回多值（配 IN）</h3>
<p><strong>表 students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>101</td></tr>
    <tr><td>2</td><td>李四</td><td>102</td></tr>
    <tr><td>3</td><td>王五</td><td>101</td></tr>
    <tr><td>4</td><td>赵六</td><td>103</td></tr>
  </tbody>
</table>
<p><strong>表 classes</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th><th>level</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>一班</td><td>高</td></tr>
    <tr><td>102</td><td>二班</td><td>低</td></tr>
    <tr><td>103</td><td>三班</td><td>高</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：找出在「高级别」班的学生。</p>
<pre><code>SELECT * FROM students
WHERE class_id IN (
    SELECT id FROM classes WHERE level = '高'
);</code></pre>
<p><strong>执行步骤：</strong></p>
<ol>
  <li>内层得到 [101, 103]</li>
  <li>外层等价于 <code>WHERE class_id IN (101, 103)</code></li>
</ol>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>101</td></tr>
    <tr><td>3</td><td>王五</td><td>101</td></tr>
    <tr><td>4</td><td>赵六</td><td>103</td></tr>
  </tbody>
</table>

<h3>21.3 关联子查询（重要）</h3>
<p>子查询里引用<strong>外层的列</strong>，叫<strong>关联子查询</strong>。它对外层每一行都执行一次。</p>
<p><strong>表 students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>101</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>101</td><td>90</td></tr>
    <tr><td>3</td><td>王五</td><td>102</td><td>80</td></tr>
    <tr><td>4</td><td>赵六</td><td>102</td><td>95</td></tr>
    <tr><td>5</td><td>钱七</td><td>103</td><td>70</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：找出每个班里成绩高于该班平均分的学生。</p>
<pre><code>SELECT * FROM students s1
WHERE s1.score &gt; (
    SELECT AVG(s2.score)
    FROM students s2
    WHERE s2.class_id = s1.class_id  -- 关联条件
);</code></pre>
<p><strong>执行步骤</strong>：对外层每一行 s1，子查询单独算「s1 所在班的平均分」。</p>
<ul>
  <li>张三 (101)：101 班平均 87.5，张三 85 &lt; 87.5 → 扔</li>
  <li>李四 (101)：101 班平均 87.5，李四 90 &gt; 87.5 → 留</li>
  <li>王五 (102)：102 班平均 87.5，王五 80 &lt; 87.5 → 扔</li>
  <li>赵六 (102)：102 班平均 87.5，赵六 95 &gt; 87.5 → 留</li>
  <li>钱七 (103)：103 班只有他自己，平均 70，钱七 70 不大于 70 → 扔</li>
</ul>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>李四</td><td>101</td><td>90</td></tr>
    <tr><td>4</td><td>赵六</td><td>102</td><td>95</td></tr>
  </tbody>
</table>

<h2>Part 22 子查询（在 FROM 里 —— 派生表）</h2>
<p>子查询也能放在 FROM 后面，<strong>当临时表用</strong>。这种叫「<strong>派生表</strong>」。</p>

<h3>22.1 基本写法</h3>
<pre><code>SELECT *
FROM (
    内层 SELECT 查询
) AS 别名</code></pre>
<blockquote>错误 <strong>派生表必须有别名！</strong>FROM 后面的子查询结尾必须 <code>AS 名字</code>，不写会报错。</blockquote>

<h3>22.2 用例：先聚合再筛选</h3>
<p><strong>原表 sales</strong></p>
<table>
  <thead><tr><th>store</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>100</td></tr>
    <tr><td>A</td><td>200</td></tr>
    <tr><td>B</td><td>500</td></tr>
    <tr><td>B</td><td>300</td></tr>
    <tr><td>C</td><td>50</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：找总销售最高的店（用派生表实现）。</p>
<pre><code>SELECT store, total
FROM (
    SELECT store, SUM(amount) AS total
    FROM sales
    GROUP BY store
) AS store_totals
ORDER BY total DESC
LIMIT 1;</code></pre>
<p><strong>执行步骤：</strong></p>
<ol>
  <li>内层 GROUP BY 得到一张临时表 store_totals：</li>
</ol>
<table>
  <thead><tr><th>store</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>300</td></tr>
    <tr><td>B</td><td>800</td></tr>
    <tr><td>C</td><td>50</td></tr>
  </tbody>
</table>
<ol start="2">
  <li>外层从这张临时表选数据，排序后 LIMIT 1：</li>
</ol>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>store</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>B</td><td>800</td></tr>
  </tbody>
</table>

<h3>22.3 派生表里能做任何 SELECT 能做的事</h3>
<p>派生表可以用 WHERE、GROUP BY、JOIN、ORDER BY、LIMIT 等所有子句。</p>
<p><strong>找平均分前 3 高的班级</strong></p>
<pre><code>SELECT class_id, avg_score
FROM (
    SELECT class_id, AVG(score) AS avg_score
    FROM students
    GROUP BY class_id
    ORDER BY avg_score DESC
    LIMIT 3
) AS top_classes;</code></pre>

<h3>22.4 多个派生表 JOIN</h3>
<p>两个派生表也能互相 JOIN，处理复杂逻辑：</p>
<pre><code>SELECT a.store, a.total_sales, b.num_customers
FROM (
    SELECT store, SUM(amount) AS total_sales
    FROM sales GROUP BY store
) AS a
JOIN (
    SELECT store, COUNT(DISTINCT customer) AS num_customers
    FROM sales GROUP BY store
) AS b
ON a.store = b.store;</code></pre>
<blockquote>提示 更现代的写法是用 <code>WITH ... AS</code>（CTE）。但很多场景或者考试不让用 CTE，就只能用派生表。两者效果相同。</blockquote>

<h2>Part 23 EXISTS / NOT EXISTS</h2>
<p><strong>EXISTS（子查询）</strong>检查子查询<strong>是否有结果</strong>。只看「存不存在」，不关心具体是什么。</p>

<h3>23.1 EXISTS 工作原理</h3>
<table>
  <thead><tr><th>关键字</th><th>含义</th></tr></thead>
  <tbody>
    <tr><td><code>EXISTS (子查询)</code></td><td>子查询<strong>至少返回 1 行</strong> → TRUE，否则 FALSE</td></tr>
    <tr><td><code>NOT EXISTS (子查询)</code></td><td>子查询<strong>没返回任何行</strong> → TRUE</td></tr>
  </tbody>
</table>

<h3>23.2 找「有相关记录的」</h3>
<p><strong>表 customers</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td></tr>
    <tr><td>2</td><td>李四</td></tr>
    <tr><td>3</td><td>王五</td></tr>
    <tr><td>4</td><td>赵六</td></tr>
  </tbody>
</table>
<p><strong>表 orders</strong></p>
<table>
  <thead><tr><th>id</th><th>customer_id</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>100</td><td>1</td><td>500</td></tr>
    <tr><td>101</td><td>1</td><td>200</td></tr>
    <tr><td>102</td><td>3</td><td>300</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：找下过单的客户（即在 orders 表里有记录）。</p>
<pre><code>SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.id
);</code></pre>
<p><strong>执行</strong>：对每个 customer，检查 orders 里是否有他的订单。</p>
<ul>
  <li>张三 (id=1)：orders 有 customer_id=1 的行 → EXISTS 为 TRUE → 留</li>
  <li>李四 (id=2)：orders 没有 customer_id=2 → 扔</li>
  <li>王五 (id=3)：orders 有 → 留</li>
  <li>赵六 (id=4)：orders 没有 → 扔</li>
</ul>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td></tr>
    <tr><td>3</td><td>王五</td></tr>
  </tbody>
</table>
<blockquote>提示 <code>SELECT 1</code> 是惯例：EXISTS 不在乎子查询返回什么，只在乎「有没有」。<code>SELECT 1</code>、<code>SELECT *</code>、<code>SELECT id</code> 效果一样，写 <code>SELECT 1</code> 最简洁。</blockquote>

<h3>23.3 NOT EXISTS 找「没有的」</h3>
<p><strong>找没下过单的客户</strong></p>
<pre><code>SELECT * FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.id
);</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>李四</td></tr>
    <tr><td>4</td><td>赵六</td></tr>
  </tbody>
</table>

<h3>23.4 NOT EXISTS vs NOT IN —— 强烈推荐 NOT EXISTS</h3>
<p>两者经常等价，但 NOT IN 在<strong>列表里有 NULL 时会失效</strong>（见 Part 6）。</p>
<pre><code>-- NOT IN（不安全）
SELECT * FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);

-- NOT EXISTS（推荐）
SELECT * FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);</code></pre>
<p>如果 orders.customer_id 中有 NULL，第一种写法会返回 0 行（错），第二种正常工作。</p>
<blockquote>正确 规则：判断「不存在」时，<strong>优先用 NOT EXISTS</strong>，不用 NOT IN。这能避开 NULL 带来的所有坑。</blockquote>

<h3>23.5 EXISTS vs JOIN</h3>
<p>「找有订单的客户」也可以用 INNER JOIN：</p>
<pre><code>SELECT DISTINCT c.id, c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id;</code></pre>
<p>和 EXISTS 等价。但有差别：</p>
<table>
  <thead><tr><th>对比项</th><th>JOIN</th><th>EXISTS</th></tr></thead>
  <tbody>
    <tr><td>是否要 DISTINCT</td><td>需要（一人多单会重复）</td><td>不需要</td></tr>
    <tr><td>性能</td><td>差不多（现代优化器）</td><td>差不多</td></tr>
    <tr><td>可读性</td><td>直观</td><td>更明确表达"判断存在"</td></tr>
  </tbody>
</table>

<h2>Part 24 COALESCE —— 替换 NULL</h2>
<p><strong>COALESCE(a, b, c, ...)</strong> 从左到右<strong>返回第一个非 NULL 的值</strong>。主要用来把 NULL 替换成默认值。</p>

<h3>24.1 口算几个例子</h3>
<table>
  <thead><tr><th>表达式</th><th>结果</th><th>为什么</th></tr></thead>
  <tbody>
    <tr><td><code>COALESCE(NULL, 5)</code></td><td>5</td><td>第 1 个 NULL 跳过；第 2 个 5 返回</td></tr>
    <tr><td><code>COALESCE(3, 5)</code></td><td>3</td><td>第 1 个非 NULL，直接返回</td></tr>
    <tr><td><code>COALESCE(NULL, NULL, 7)</code></td><td>7</td><td>前两个都 NULL，第 3 个非 NULL</td></tr>
    <tr><td><code>COALESCE(NULL, NULL, NULL)</code></td><td>NULL</td><td>全是 NULL，结果还是 NULL</td></tr>
    <tr><td><code>COALESCE(0, 5)</code></td><td>0</td><td>0 不是 NULL！直接返回 0</td></tr>
    <tr><td><code>COALESCE('', 'X')</code></td><td>''</td><td>空字符串不是 NULL！</td></tr>
  </tbody>
</table>
<blockquote>注意 0 和空字符串都<strong>不是 NULL</strong>。COALESCE 只跳过 NULL，0 和空字符串会被认为是有效值。</blockquote>

<h3>24.2 把 NULL 替换成 0</h3>
<p><strong>表 sales</strong></p>
<table>
  <thead><tr><th>id</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td></tr>
    <tr><td>2</td><td>NULL</td></tr>
    <tr><td>3</td><td>200</td></tr>
    <tr><td>4</td><td>NULL</td></tr>
  </tbody>
</table>
<pre><code>SELECT id, COALESCE(amount, 0) AS amount
FROM sales;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td></tr>
    <tr><td>2</td><td>0</td></tr>
    <tr><td>3</td><td>200</td></tr>
    <tr><td>4</td><td>0</td></tr>
  </tbody>
</table>

<h3>24.3 把 NULL 替换成文字</h3>
<p><strong>表 employees</strong></p>
<table>
  <thead><tr><th>name</th><th>manager</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>李四</td></tr>
    <tr><td>李四</td><td>NULL</td></tr>
    <tr><td>王五</td><td>李四</td></tr>
    <tr><td>总经理</td><td>NULL</td></tr>
  </tbody>
</table>
<pre><code>SELECT name, COALESCE(manager, '无上级') AS manager
FROM employees;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>manager</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>李四</td></tr>
    <tr><td>李四</td><td>无上级</td></tr>
    <tr><td>王五</td><td>李四</td></tr>
    <tr><td>总经理</td><td>无上级</td></tr>
  </tbody>
</table>

<h3>24.4 多个候选 —— 优先级选择</h3>
<p><strong>表 contacts</strong></p>
<table>
  <thead><tr><th>name</th><th>mobile</th><th>email</th><th>phone</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>138...</td><td>NULL</td><td>021...</td></tr>
    <tr><td>李四</td><td>NULL</td><td>li@x.com</td><td>NULL</td></tr>
    <tr><td>王五</td><td>NULL</td><td>NULL</td><td>021...</td></tr>
    <tr><td>赵六</td><td>NULL</td><td>NULL</td><td>NULL</td></tr>
  </tbody>
</table>
<p><strong>按 mobile→email→phone 顺序选第一个有效的</strong></p>
<pre><code>SELECT name,
    COALESCE(mobile, email, phone, '无联系方式') AS contact
FROM contacts;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>contact</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>138...</td></tr>
    <tr><td>李四</td><td>li@x.com</td></tr>
    <tr><td>王五</td><td>021...</td></tr>
    <tr><td>赵六</td><td>无联系方式</td></tr>
  </tbody>
</table>

<h3>24.5 LEFT JOIN + COALESCE 经典组合</h3>
<p><strong>表 stores</strong> / <strong>表 sales（B 和 C 店没数据）</strong></p>
<pre><code>SELECT s.name,
    COALESCE(SUM(sa.amount), 0) AS total
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id
GROUP BY s.id, s.name;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>A 店</td><td>300</td></tr>
    <tr><td>B 店</td><td>0</td></tr>
    <tr><td>C 店</td><td>0</td></tr>
  </tbody>
</table>
<blockquote>注意 COALESCE 包<strong>SUM 的外面</strong>，不是里面。<br>✓ <code>COALESCE(SUM(amount), 0)</code><br>✗ <code>SUM(COALESCE(amount, 0))</code> 也能跑，但多此一举。</blockquote>

<h2>Part 25 CASE WHEN —— SQL 的 if-else</h2>
<p><strong>CASE WHEN</strong> 是 SQL 中的<strong>条件表达式</strong>，相当于其他语言的 if-else。</p>

<h3>25.1 基本语法</h3>
<pre><code>CASE
    WHEN 条件1 THEN 值1
    WHEN 条件2 THEN 值2
    WHEN 条件3 THEN 值3
    ELSE   默认值
END</code></pre>
<p>从上往下检查 WHEN，<strong>第一个为真</strong>的那个 THEN 后面的值就是结果。</p>

<h3>25.2 用例：给数值打标签</h3>
<p><strong>表 students</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>95</td></tr>
    <tr><td>李四</td><td>85</td></tr>
    <tr><td>王五</td><td>72</td></tr>
    <tr><td>赵六</td><td>60</td></tr>
    <tr><td>钱七</td><td>45</td></tr>
  </tbody>
</table>
<pre><code>SELECT name, score,
    CASE
        WHEN score &gt;= 90 THEN '优秀'
        WHEN score &gt;= 80 THEN '良好'
        WHEN score &gt;= 60 THEN '及格'
        ELSE '不及格'
    END AS grade
FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th><th>grade</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>95</td><td>优秀</td></tr>
    <tr><td>李四</td><td>85</td><td>良好</td></tr>
    <tr><td>王五</td><td>72</td><td>及格</td></tr>
    <tr><td>赵六</td><td>60</td><td>及格</td></tr>
    <tr><td>钱七</td><td>45</td><td>不及格</td></tr>
  </tbody>
</table>
<p>追踪每行：</p>
<table>
  <thead><tr><th>name</th><th>score</th><th>走的分支</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>95</td><td>&gt;= 90</td><td>优秀</td></tr>
    <tr><td>李四</td><td>85</td><td>&gt;= 80</td><td>良好</td></tr>
    <tr><td>王五</td><td>72</td><td>&gt;= 60</td><td>及格</td></tr>
    <tr><td>赵六</td><td>60</td><td>&gt;= 60</td><td>及格</td></tr>
    <tr><td>钱七</td><td>45</td><td>ELSE</td><td>不及格</td></tr>
  </tbody>
</table>
<blockquote>注意 条件顺序很重要。第一个匹配就停。比如 95 既满足 <code>&gt;= 90</code> 也满足 <code>&gt;= 80</code>，但因为 <code>&gt;= 90</code> 在前面，匹配它就停了，不会再去看 <code>&gt;= 80</code>。</blockquote>

<h3>25.3 CASE 处理 NULL</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>count</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>10</td></tr>
    <tr><td>B</td><td>0</td></tr>
    <tr><td>C</td><td>NULL</td></tr>
  </tbody>
</table>
<p><strong>需求</strong>：区分「没值」和「值为 0」—— 没值返回 NULL，值为 0 返回「无销售」，否则返回数值。</p>
<pre><code>SELECT name,
    CASE
        WHEN count IS NULL THEN NULL
        WHEN count = 0     THEN '无销售'
        ELSE CAST(count AS CHAR)
    END AS status
FROM tbl;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>status</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>10</td></tr>
    <tr><td>B</td><td>无销售</td></tr>
    <tr><td>C</td><td>NULL</td></tr>
  </tbody>
</table>
<blockquote>错误 判断 NULL 必须用 <code>IS NULL</code>。<br>错误：<code>WHEN count = NULL THEN ...</code> —— 永远不为真！<br>正确：<code>WHEN count IS NULL THEN ...</code></blockquote>

<h3>25.4 CASE 配合 COUNT —— 条件计数</h3>
<p><strong>分别数男生和女生的高分人数</strong></p>
<pre><code>SELECT
    COUNT(*) AS total,
    COUNT(CASE WHEN gender = '男' THEN 1 END) AS boys,
    COUNT(CASE WHEN gender = '女' THEN 1 END) AS girls,
    COUNT(CASE WHEN score &gt;= 90 THEN 1 END) AS high_score
FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>total</th><th>boys</th><th>girls</th><th>high_score</th></tr></thead>
  <tbody>
    <tr><td>6</td><td>3</td><td>3</td><td>2</td></tr>
  </tbody>
</table>
<p>原理：CASE 不匹配时返回 NULL（没写 ELSE），COUNT 不数 NULL，所以只数符合条件的行。</p>

<h3>25.5 CASE 配合 SUM —— 条件求和</h3>
<p><strong>分别求男女总成绩</strong></p>
<pre><code>SELECT
    SUM(CASE WHEN gender = '男' THEN score ELSE 0 END) AS boy_total,
    SUM(CASE WHEN gender = '女' THEN score ELSE 0 END) AS girl_total
FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>boy_total</th><th>girl_total</th></tr></thead>
  <tbody>
    <tr><td>252</td><td>253</td></tr>
  </tbody>
</table>
<p>男生：85+92+75 = 252；女生：88+95+70 = 253。</p>

<h3>25.6 数据透视（pivot）</h3>
<p>CASE + GROUP BY 能做简单的数据透视：</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>class</th><th>gender</th><th>count</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>男</td><td>10</td></tr>
    <tr><td>A</td><td>女</td><td>8</td></tr>
    <tr><td>B</td><td>男</td><td>12</td></tr>
    <tr><td>B</td><td>女</td><td>15</td></tr>
  </tbody>
</table>
<p><strong>透视：每个班一行，男女各一列</strong></p>
<pre><code>SELECT class,
    SUM(CASE WHEN gender = '男' THEN count ELSE 0 END) AS boys,
    SUM(CASE WHEN gender = '女' THEN count ELSE 0 END) AS girls
FROM tbl
GROUP BY class;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>class</th><th>boys</th><th>girls</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>10</td><td>8</td></tr>
    <tr><td>B</td><td>12</td><td>15</td></tr>
  </tbody>
</table>
<p>原本两行的男女信息，<strong>透视</strong>到了同一行的两列里。这是 BI 报表常用技巧。</p>

<h2>Part 26 SQL 执行顺序（必背）</h2>
<p>SQL 写起来的顺序和实际执行的顺序<strong>完全不同</strong>。理解执行顺序能解释很多迷惑。</p>

<h3>26.1 完整顺序</h3>
<table>
  <thead><tr><th>步骤</th><th>子句</th><th>做什么</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><strong>FROM</strong></td><td>确定数据来自哪些表</td></tr>
    <tr><td>2</td><td><strong>JOIN ... ON</strong></td><td>连接其他表</td></tr>
    <tr><td>3</td><td><strong>WHERE</strong></td><td>行级过滤（不能用聚合函数和别名）</td></tr>
    <tr><td>4</td><td><strong>GROUP BY</strong></td><td>按列分组</td></tr>
    <tr><td>5</td><td><strong>HAVING</strong></td><td>组级过滤（可以用聚合函数）</td></tr>
    <tr><td>6</td><td><strong>SELECT</strong></td><td>选列、起别名、做计算</td></tr>
    <tr><td>7</td><td><strong>DISTINCT</strong></td><td>去重</td></tr>
    <tr><td>8</td><td><strong>ORDER BY</strong></td><td>排序（可以用别名）</td></tr>
    <tr><td>9</td><td><strong>LIMIT / OFFSET</strong></td><td>限制返回行数</td></tr>
  </tbody>
</table>

<h3>26.2 写法顺序 vs 执行顺序</h3>
<p><strong>写的时候是这个顺序</strong></p>
<pre><code>SELECT class, COUNT(*) AS num, AVG(score) AS avg
FROM students
WHERE score &gt; 60
GROUP BY class
HAVING COUNT(*) &gt;= 2
ORDER BY avg DESC
LIMIT 5;</code></pre>
<p><strong>实际执行的顺序</strong></p>
<pre><code>1. FROM students        确定数据源
2. WHERE score &gt; 60    筛选行
3. GROUP BY class       按 class 分组
4. HAVING COUNT(*) &gt;= 2  筛选组
5. SELECT class, ...    选列+算 num/avg
6. ORDER BY avg DESC    排序（avg 此时已存在）
7. LIMIT 5              取前 5</code></pre>

<h3>26.3 为什么 WHERE 不能用聚合函数？</h3>
<p>因为 WHERE（步骤 3）<strong>早于</strong> GROUP BY（步骤 4）。WHERE 时还没分组，自然没法算每组的 COUNT。</p>
<p><strong>错</strong></p>
<pre><code>SELECT class FROM students
WHERE COUNT(*) &gt; 5  -- 报错
GROUP BY class;</code></pre>
<p><strong>对（用 HAVING）</strong></p>
<pre><code>SELECT class FROM students
GROUP BY class
HAVING COUNT(*) &gt; 5;</code></pre>

<h3>26.4 为什么 WHERE 不能用 SELECT 别名？</h3>
<p>因为 WHERE（步骤 3）<strong>早于</strong> SELECT（步骤 6）。WHERE 时别名还没定义。</p>
<p><strong>错</strong></p>
<pre><code>SELECT score + 10 AS bonus FROM students
WHERE bonus &gt; 100;  -- 报错</code></pre>
<p><strong>对（重写表达式）</strong></p>
<pre><code>SELECT score + 10 AS bonus FROM students
WHERE score + 10 &gt; 100;</code></pre>

<h3>26.5 为什么 ORDER BY 能用 SELECT 别名？</h3>
<p>因为 ORDER BY（步骤 8）<strong>晚于</strong> SELECT（步骤 6）。别名已经定义好了。</p>
<p><strong>对</strong></p>
<pre><code>SELECT score + 10 AS bonus FROM students
ORDER BY bonus DESC;</code></pre>

<h3>26.6 总结表</h3>
<table>
  <thead><tr><th>操作</th><th>能在 WHERE 里？</th><th>能在 HAVING 里？</th><th>能在 ORDER BY 里？</th></tr></thead>
  <tbody>
    <tr><td>用列名</td><td>YES</td><td>YES</td><td>YES</td></tr>
    <tr><td>用聚合函数（COUNT 等）</td><td>NO</td><td>YES</td><td>YES</td></tr>
    <tr><td>用 SELECT 中的别名</td><td>NO</td><td>YES（MySQL）</td><td>YES</td></tr>
  </tbody>
</table>

<h2>Part 27 实用技巧汇总</h2>
<p>一些前面没专门讲、但工作中常用的技巧。</p>

<h3>27.1 找重复的行</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>email</th></tr></thead>
  <tbody>
    <tr><td>a@x.com</td></tr>
    <tr><td>b@x.com</td></tr>
    <tr><td>a@x.com</td></tr>
    <tr><td>c@x.com</td></tr>
    <tr><td>b@x.com</td></tr>
  </tbody>
</table>
<p><strong>找出现 ≥ 2 次的 email</strong></p>
<pre><code>SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) &gt;= 2;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>email</th><th>cnt</th></tr></thead>
  <tbody>
    <tr><td>a@x.com</td><td>2</td></tr>
    <tr><td>b@x.com</td><td>2</td></tr>
  </tbody>
</table>

<h3>27.2 找前 N 名（带并列）</h3>
<p>如果用 LIMIT N 在并列时会丢人。技巧：先找「第 N 名分数」，再筛 ≥ 它。</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>95</td></tr>
    <tr><td>B</td><td>90</td></tr>
    <tr><td>C</td><td>85</td></tr>
    <tr><td>D</td><td>85</td></tr>
    <tr><td>E</td><td>70</td></tr>
  </tbody>
</table>
<p><strong>前 3 名（含并列）</strong></p>
<pre><code>SELECT * FROM students
WHERE score &gt;= (
    SELECT MIN(s) FROM (
        SELECT score AS s FROM students
        ORDER BY score DESC
        LIMIT 3
    ) AS t
);</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>95</td></tr>
    <tr><td>B</td><td>90</td></tr>
    <tr><td>C</td><td>85</td></tr>
    <tr><td>D</td><td>85</td></tr>
  </tbody>
</table>
<p>D 没被漏掉。</p>

<h3>27.3 每组找最大 / 最小那一行</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>class</th><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>张三</td><td>85</td></tr>
    <tr><td>A</td><td>李四</td><td>92</td></tr>
    <tr><td>B</td><td>王五</td><td>78</td></tr>
    <tr><td>B</td><td>赵六</td><td>88</td></tr>
    <tr><td>B</td><td>钱七</td><td>95</td></tr>
  </tbody>
</table>
<p><strong>每个班的最高分是谁</strong></p>
<pre><code>SELECT s.* FROM students s
WHERE s.score = (
    SELECT MAX(s2.score) FROM students s2
    WHERE s2.class = s.class
);</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>class</th><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>李四</td><td>92</td></tr>
    <tr><td>B</td><td>钱七</td><td>95</td></tr>
  </tbody>
</table>

<h3>27.4 算累计百分比</h3>
<p>每行的值占总和的多少：</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>sales</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>300</td></tr>
    <tr><td>B</td><td>500</td></tr>
    <tr><td>C</td><td>200</td></tr>
  </tbody>
</table>
<pre><code>SELECT name, sales,
    sales * 100.0 / (SELECT SUM(sales) FROM tbl) AS pct
FROM tbl;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>sales</th><th>pct</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>300</td><td>30.0</td></tr>
    <tr><td>B</td><td>500</td><td>50.0</td></tr>
    <tr><td>C</td><td>200</td><td>20.0</td></tr>
  </tbody>
</table>

<h3>27.5 行转列（基础透视）</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>subject</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>语文</td><td>85</td></tr>
    <tr><td>张三</td><td>数学</td><td>92</td></tr>
    <tr><td>李四</td><td>语文</td><td>78</td></tr>
    <tr><td>李四</td><td>数学</td><td>88</td></tr>
  </tbody>
</table>
<pre><code>SELECT name,
    MAX(CASE WHEN subject = '语文' THEN score END) AS chinese,
    MAX(CASE WHEN subject = '数学' THEN score END) AS math
FROM scores
GROUP BY name;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>chinese</th><th>math</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td><td>92</td></tr>
    <tr><td>李四</td><td>78</td><td>88</td></tr>
  </tbody>
</table>

<h3>27.6 找连续值（连号）</h3>
<p>两个表 JOIN 自身找连号或差值：</p>
<p><strong>表 nums</strong></p>
<table>
  <thead><tr><th>n</th></tr></thead>
  <tbody>
    <tr><td>1</td></tr>
    <tr><td>2</td></tr>
    <tr><td>3</td></tr>
    <tr><td>5</td></tr>
    <tr><td>7</td></tr>
    <tr><td>8</td></tr>
  </tbody>
</table>
<p><strong>找连续两个数（n 和 n+1 都存在）</strong></p>
<pre><code>SELECT a.n, b.n
FROM nums a
JOIN nums b ON b.n = a.n + 1;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>a.n</th><th>b.n</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>2</td></tr>
    <tr><td>2</td><td>3</td></tr>
    <tr><td>7</td><td>8</td></tr>
  </tbody>
</table>

<h3>27.7 防止除零错误</h3>
<pre><code>-- 不安全：a 为 0 时报错
SELECT total / cnt FROM tbl;

-- 安全：用 NULLIF 把 0 变 NULL，除法返回 NULL 而不是报错
SELECT total / NULLIF(cnt, 0) FROM tbl;

-- 配合 COALESCE 处理结果
SELECT COALESCE(total / NULLIF(cnt, 0), 0) FROM tbl;</code></pre>

<h3>27.8 字符串拼接</h3>
<p>MySQL 用 <strong>CONCAT</strong> 函数：</p>
<pre><code>SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM users;</code></pre>
<p>注意：MySQL 中 <code>||</code> 不是字符串拼接（是 OR），跟 Oracle 不一样。</p>

<h3>27.9 取第 N 大的值</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>score</th></tr></thead>
  <tbody>
    <tr><td>100</td></tr>
    <tr><td>90</td></tr>
    <tr><td>90</td></tr>
    <tr><td>80</td></tr>
    <tr><td>70</td></tr>
  </tbody>
</table>
<p><strong>第 2 大的不重复值（90）</strong></p>
<pre><code>SELECT DISTINCT score FROM tbl
ORDER BY score DESC
LIMIT 1 OFFSET 1;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>score</th></tr></thead>
  <tbody>
    <tr><td>90</td></tr>
  </tbody>
</table>
<p>用 DISTINCT 让重复值算一个，再 OFFSET 跳过第 1 个。</p>

<h3>27.10 总结：写好 SQL 的原则</h3>
<table>
  <thead><tr><th>原则</th><th>说明</th></tr></thead>
  <tbody>
    <tr><td><strong>先想清楚要什么</strong></td><td>不要边查边改，先写一句中文需求</td></tr>
    <tr><td><strong>从最里层开始写</strong></td><td>复杂查询先写最内层子查询，确认对了再往外加</td></tr>
    <tr><td><strong>每一步都跑一遍</strong></td><td>加了 JOIN 后跑一下，看中间结果对不对</td></tr>
    <tr><td><strong>加注释</strong></td><td>复杂查询加 <code>-- 注释</code> 说明每段的目的</td></tr>
    <tr><td><strong>用别名让代码短</strong></td><td>researcher → r, project_researcher → pr</td></tr>
    <tr><td><strong>LEFT JOIN 时要谨慎</strong></td><td>想保留左表所有行才用，过滤条件放 ON</td></tr>
    <tr><td><strong>NULL 用 IS NULL</strong></td><td>永远不要用 = NULL</td></tr>
    <tr><td><strong>NOT EXISTS 优于 NOT IN</strong></td><td>避免 NULL 坑</td></tr>
    <tr><td><strong>排序用 ORDER BY</strong></td><td>SQL 不保证默认顺序</td></tr>
    <tr><td><strong>DISTINCT 用得有意识</strong></td><td>滥用会掩盖逻辑错误</td></tr>
  </tbody>
</table>
`;
