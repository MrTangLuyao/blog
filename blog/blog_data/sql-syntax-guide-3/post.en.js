/* Post body — sql-syntax-guide-3 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['sql-syntax-guide-3:en'] = `
<p class="lead">SQL Syntax Complete Guide · Learn SQL by Example (Part 3). This post covers Part 21–27: subqueries in WHERE and FROM (derived tables), EXISTS/NOT EXISTS, COALESCE for NULL replacement, CASE WHEN conditional logic, SQL execution order (must-know), and a practical tips collection.</p>

<h2>Part 21 Subqueries (in WHERE)</h2>
<p>A <strong>subquery</strong> is a query nested inside another query. The inner query's result is used by the outer query. The most common placement is inside WHERE.</p>

<h3>21.1 Subquery Returning a Single Value</h3>
<p><strong>Original table: students</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Wang Wu</td><td>78</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Qian Qi</td><td>95</td></tr>
  </tbody>
</table>
<p><strong>Need:</strong> Find students whose score is above average.</p>
<pre><code>SELECT * FROM students
WHERE score &gt; (SELECT AVG(score) FROM students);</code></pre>
<p><strong>How it executes:</strong></p>
<p><strong>Step 1:</strong> Run the inner query <code>SELECT AVG(score) FROM students</code> → 87.6</p>
<p><strong>Step 2:</strong> Substitute 87.6 into the outer query:</p>
<pre><code>SELECT * FROM students WHERE score &gt; 87.6;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Qian Qi</td><td>95</td></tr>
  </tbody>
</table>
<blockquote>Note: When a subquery is used with <code>=</code>, <code>&gt;</code>, <code>&lt;</code>, etc., it <strong>must return a single value</strong> (1 row, 1 column). Otherwise it errors. To return multiple rows, use <code>IN</code>, <code>EXISTS</code>, etc.</blockquote>

<h3>21.2 Subquery Returning Multiple Values (with IN)</h3>
<p><strong>Table: students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>101</td></tr>
    <tr><td>2</td><td>Li Si</td><td>102</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>101</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>103</td></tr>
  </tbody>
</table>
<p><strong>Table: classes</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th><th>level</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>Class A</td><td>high</td></tr>
    <tr><td>102</td><td>Class B</td><td>low</td></tr>
    <tr><td>103</td><td>Class C</td><td>high</td></tr>
  </tbody>
</table>
<p><strong>Need:</strong> Find students in "high" level classes.</p>
<pre><code>SELECT * FROM students
WHERE class_id IN (
    SELECT id FROM classes WHERE level = 'high'
);</code></pre>
<p><strong>Steps:</strong></p>
<ol>
  <li>Inner query returns [101, 103]</li>
  <li>Outer query becomes <code>WHERE class_id IN (101, 103)</code></li>
</ol>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>101</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>101</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>103</td></tr>
  </tbody>
</table>

<h3>21.3 Correlated Subqueries (Important)</h3>
<p>When a subquery references a column from the <strong>outer query</strong>, it's called a <strong>correlated subquery</strong>. It runs once for each row of the outer query.</p>
<p><strong>Table: students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>101</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>101</td><td>90</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>102</td><td>80</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>102</td><td>95</td></tr>
    <tr><td>5</td><td>Qian Qi</td><td>103</td><td>70</td></tr>
  </tbody>
</table>
<p><strong>Need:</strong> Find students whose score is above their own class average.</p>
<pre><code>SELECT * FROM students s1
WHERE s1.score &gt; (
    SELECT AVG(s2.score)
    FROM students s2
    WHERE s2.class_id = s1.class_id  -- correlated condition
);</code></pre>
<p><strong>How it works:</strong> For each outer row s1, the subquery independently calculates "the average score of s1's class."</p>
<ul>
  <li>Zhang San (101): Class 101 avg = 87.5, Zhang San 85 &lt; 87.5 → discard</li>
  <li>Li Si (101): Class 101 avg = 87.5, Li Si 90 &gt; 87.5 → keep</li>
  <li>Wang Wu (102): Class 102 avg = 87.5, Wang Wu 80 &lt; 87.5 → discard</li>
  <li>Zhao Liu (102): Class 102 avg = 87.5, Zhao Liu 95 &gt; 87.5 → keep</li>
  <li>Qian Qi (103): Class 103 only has Qian Qi, avg = 70, not greater → discard</li>
</ul>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Li Si</td><td>101</td><td>90</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>102</td><td>95</td></tr>
  </tbody>
</table>

<h2>Part 22 Subqueries in FROM — Derived Tables</h2>
<p>Subqueries can also go after FROM, <strong>acting as a temporary table</strong>. This is called a <strong>derived table</strong>.</p>

<h3>22.1 Basic Syntax</h3>
<pre><code>SELECT *
FROM (
    inner SELECT query
) AS alias</code></pre>
<blockquote>Error: <strong>A derived table must have an alias!</strong> The subquery in FROM must end with <code>AS name</code>; omitting it causes an error.</blockquote>

<h3>22.2 Example: Aggregate Then Filter</h3>
<p><strong>Original table: sales</strong></p>
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
<p><strong>Need:</strong> Find the store with the highest total sales (using a derived table).</p>
<pre><code>SELECT store, total
FROM (
    SELECT store, SUM(amount) AS total
    FROM sales
    GROUP BY store
) AS store_totals
ORDER BY total DESC
LIMIT 1;</code></pre>
<p><strong>Steps:</strong></p>
<ol>
  <li>Inner GROUP BY produces a temp table store_totals:</li>
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
  <li>Outer query selects from this temp table, sorts, and takes LIMIT 1:</li>
</ol>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>store</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>B</td><td>800</td></tr>
  </tbody>
</table>

<h3>22.3 Derived Tables Can Do Anything SELECT Can</h3>
<p>A derived table can include WHERE, GROUP BY, JOIN, ORDER BY, LIMIT, etc.</p>
<p><strong>Find the top 3 classes by average score</strong></p>
<pre><code>SELECT class_id, avg_score
FROM (
    SELECT class_id, AVG(score) AS avg_score
    FROM students
    GROUP BY class_id
    ORDER BY avg_score DESC
    LIMIT 3
) AS top_classes;</code></pre>

<h3>22.4 Multiple Derived Tables with JOIN</h3>
<p>Two derived tables can JOIN each other for complex logic:</p>
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
<blockquote>Tip: The modern alternative is <code>WITH ... AS</code> (CTE). In contexts where CTEs aren't allowed (some exams, older databases), derived tables achieve the same result.</blockquote>

<h2>Part 23 EXISTS / NOT EXISTS</h2>
<p><strong>EXISTS (subquery)</strong> checks whether the subquery <strong>has any results</strong>. It only cares about "does it exist" — not what the values are.</p>

<h3>23.1 How EXISTS Works</h3>
<table>
  <thead><tr><th>Keyword</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>EXISTS (subquery)</code></td><td>Subquery returns <strong>at least 1 row</strong> → TRUE, else FALSE</td></tr>
    <tr><td><code>NOT EXISTS (subquery)</code></td><td>Subquery returns <strong>no rows</strong> → TRUE</td></tr>
  </tbody>
</table>

<h3>23.2 Find Records That Have Related Data</h3>
<p><strong>Table: customers</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td></tr>
    <tr><td>2</td><td>Li Si</td></tr>
    <tr><td>3</td><td>Wang Wu</td></tr>
    <tr><td>4</td><td>Zhao Liu</td></tr>
  </tbody>
</table>
<p><strong>Table: orders</strong></p>
<table>
  <thead><tr><th>id</th><th>customer_id</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>100</td><td>1</td><td>500</td></tr>
    <tr><td>101</td><td>1</td><td>200</td></tr>
    <tr><td>102</td><td>3</td><td>300</td></tr>
  </tbody>
</table>
<p><strong>Need:</strong> Find customers who have placed at least one order.</p>
<pre><code>SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.id
);</code></pre>
<p><strong>Execution:</strong> For each customer, check if orders has any row for them.</p>
<ul>
  <li>Zhang San (id=1): orders has rows with customer_id=1 → EXISTS = TRUE → keep</li>
  <li>Li Si (id=2): no orders → discard</li>
  <li>Wang Wu (id=3): has orders → keep</li>
  <li>Zhao Liu (id=4): no orders → discard</li>
</ul>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td></tr>
    <tr><td>3</td><td>Wang Wu</td></tr>
  </tbody>
</table>
<blockquote>Tip: <code>SELECT 1</code> is the convention — EXISTS doesn't care what the subquery returns, only whether it returns anything. <code>SELECT 1</code>, <code>SELECT *</code>, <code>SELECT id</code> all work; <code>SELECT 1</code> is most concise.</blockquote>

<h3>23.3 NOT EXISTS — Find Records With No Related Data</h3>
<p><strong>Find customers who have never placed an order</strong></p>
<pre><code>SELECT * FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.id
);</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Li Si</td></tr>
    <tr><td>4</td><td>Zhao Liu</td></tr>
  </tbody>
</table>

<h3>23.4 NOT EXISTS vs NOT IN — Strongly Prefer NOT EXISTS</h3>
<p>They're often equivalent, but NOT IN <strong>fails when the list contains NULL</strong> (see Part 6).</p>
<pre><code>-- NOT IN (unsafe)
SELECT * FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);

-- NOT EXISTS (recommended)
SELECT * FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);</code></pre>
<p>If orders.customer_id has any NULLs, the first form returns 0 rows (wrong); the second works correctly.</p>
<blockquote>Rule: When checking "does not exist," <strong>prefer NOT EXISTS over NOT IN</strong>. It avoids all NULL-related pitfalls.</blockquote>

<h3>23.5 EXISTS vs JOIN</h3>
<p>"Find customers with orders" can also use INNER JOIN:</p>
<pre><code>SELECT DISTINCT c.id, c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id;</code></pre>
<p>Equivalent to EXISTS, but with differences:</p>
<table>
  <thead><tr><th>Aspect</th><th>JOIN</th><th>EXISTS</th></tr></thead>
  <tbody>
    <tr><td>Need DISTINCT?</td><td>Yes (one customer, many orders = duplicates)</td><td>No</td></tr>
    <tr><td>Performance</td><td>Similar (modern optimizer)</td><td>Similar</td></tr>
    <tr><td>Readability</td><td>Intuitive</td><td>More explicit for "checking existence"</td></tr>
  </tbody>
</table>

<h2>Part 24 COALESCE — Replacing NULL</h2>
<p><strong>COALESCE(a, b, c, ...)</strong> returns <strong>the first non-NULL value</strong> from left to right. Mainly used to replace NULL with a default value.</p>

<h3>24.1 Mental Calculation Examples</h3>
<table>
  <thead><tr><th>Expression</th><th>Result</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td><code>COALESCE(NULL, 5)</code></td><td>5</td><td>First is NULL, skip; second is 5, return</td></tr>
    <tr><td><code>COALESCE(3, 5)</code></td><td>3</td><td>First is non-NULL, return immediately</td></tr>
    <tr><td><code>COALESCE(NULL, NULL, 7)</code></td><td>7</td><td>First two are NULL, third is non-NULL</td></tr>
    <tr><td><code>COALESCE(NULL, NULL, NULL)</code></td><td>NULL</td><td>All NULL, result is NULL</td></tr>
    <tr><td><code>COALESCE(0, 5)</code></td><td>0</td><td>0 is not NULL! Returns 0</td></tr>
    <tr><td><code>COALESCE('', 'X')</code></td><td>''</td><td>Empty string is not NULL!</td></tr>
  </tbody>
</table>
<blockquote>Note: 0 and empty string are <strong>not NULL</strong>. COALESCE only skips NULL — 0 and '' are treated as valid values.</blockquote>

<h3>24.2 Replace NULL with 0</h3>
<p><strong>Table: sales</strong></p>
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
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td></tr>
    <tr><td>2</td><td>0</td></tr>
    <tr><td>3</td><td>200</td></tr>
    <tr><td>4</td><td>0</td></tr>
  </tbody>
</table>

<h3>24.3 Replace NULL with Text</h3>
<p><strong>Table: employees</strong></p>
<table>
  <thead><tr><th>name</th><th>manager</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>Li Si</td></tr>
    <tr><td>Li Si</td><td>NULL</td></tr>
    <tr><td>Wang Wu</td><td>Li Si</td></tr>
    <tr><td>CEO</td><td>NULL</td></tr>
  </tbody>
</table>
<pre><code>SELECT name, COALESCE(manager, 'No superior') AS manager
FROM employees;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>manager</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>Li Si</td></tr>
    <tr><td>Li Si</td><td>No superior</td></tr>
    <tr><td>Wang Wu</td><td>Li Si</td></tr>
    <tr><td>CEO</td><td>No superior</td></tr>
  </tbody>
</table>

<h3>24.4 Multiple Candidates — Priority Selection</h3>
<p><strong>Table: contacts</strong></p>
<table>
  <thead><tr><th>name</th><th>mobile</th><th>email</th><th>phone</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>138...</td><td>NULL</td><td>021...</td></tr>
    <tr><td>Li Si</td><td>NULL</td><td>li@x.com</td><td>NULL</td></tr>
    <tr><td>Wang Wu</td><td>NULL</td><td>NULL</td><td>021...</td></tr>
    <tr><td>Zhao Liu</td><td>NULL</td><td>NULL</td><td>NULL</td></tr>
  </tbody>
</table>
<p><strong>Pick the first valid contact method in priority order: mobile → email → phone</strong></p>
<pre><code>SELECT name,
    COALESCE(mobile, email, phone, 'No contact') AS contact
FROM contacts;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>contact</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>138...</td></tr>
    <tr><td>Li Si</td><td>li@x.com</td></tr>
    <tr><td>Wang Wu</td><td>021...</td></tr>
    <tr><td>Zhao Liu</td><td>No contact</td></tr>
  </tbody>
</table>

<h3>24.5 LEFT JOIN + COALESCE Classic Combination</h3>
<pre><code>SELECT s.name,
    COALESCE(SUM(sa.amount), 0) AS total
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id
GROUP BY s.id, s.name;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>Store A</td><td>300</td></tr>
    <tr><td>Store B</td><td>0</td></tr>
    <tr><td>Store C</td><td>0</td></tr>
  </tbody>
</table>
<blockquote>Note: COALESCE wraps <strong>SUM from the outside</strong>, not inside.<br>✓ <code>COALESCE(SUM(amount), 0)</code><br>✗ <code>SUM(COALESCE(amount, 0))</code> also works but is one step more than needed.</blockquote>

<h2>Part 25 CASE WHEN — SQL's if-else</h2>
<p><strong>CASE WHEN</strong> is SQL's <strong>conditional expression</strong>, equivalent to if-else in other languages.</p>

<h3>25.1 Basic Syntax</h3>
<pre><code>CASE
    WHEN condition1 THEN value1
    WHEN condition2 THEN value2
    WHEN condition3 THEN value3
    ELSE   default_value
END</code></pre>
<p>Conditions are checked top to bottom. The value after THEN for the <strong>first matching WHEN</strong> is the result.</p>

<h3>25.2 Example: Labeling Values</h3>
<p><strong>Table: students</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>95</td></tr>
    <tr><td>Li Si</td><td>85</td></tr>
    <tr><td>Wang Wu</td><td>72</td></tr>
    <tr><td>Zhao Liu</td><td>60</td></tr>
    <tr><td>Qian Qi</td><td>45</td></tr>
  </tbody>
</table>
<pre><code>SELECT name, score,
    CASE
        WHEN score &gt;= 90 THEN 'Excellent'
        WHEN score &gt;= 80 THEN 'Good'
        WHEN score &gt;= 60 THEN 'Pass'
        ELSE 'Fail'
    END AS grade
FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th><th>grade</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>95</td><td>Excellent</td></tr>
    <tr><td>Li Si</td><td>85</td><td>Good</td></tr>
    <tr><td>Wang Wu</td><td>72</td><td>Pass</td></tr>
    <tr><td>Zhao Liu</td><td>60</td><td>Pass</td></tr>
    <tr><td>Qian Qi</td><td>45</td><td>Fail</td></tr>
  </tbody>
</table>
<p>Tracing each row:</p>
<table>
  <thead><tr><th>name</th><th>score</th><th>Branch taken</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>95</td><td>&gt;= 90</td><td>Excellent</td></tr>
    <tr><td>Li Si</td><td>85</td><td>&gt;= 80</td><td>Good</td></tr>
    <tr><td>Wang Wu</td><td>72</td><td>&gt;= 60</td><td>Pass</td></tr>
    <tr><td>Zhao Liu</td><td>60</td><td>&gt;= 60</td><td>Pass</td></tr>
    <tr><td>Qian Qi</td><td>45</td><td>ELSE</td><td>Fail</td></tr>
  </tbody>
</table>
<blockquote>Note: Condition order matters. The first match wins. A score of 95 satisfies both <code>&gt;= 90</code> and <code>&gt;= 80</code>, but since <code>&gt;= 90</code> is first, it matches and stops — it never checks <code>&gt;= 80</code>.</blockquote>

<h3>25.3 CASE for Handling NULL</h3>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>name</th><th>count</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>10</td></tr>
    <tr><td>B</td><td>0</td></tr>
    <tr><td>C</td><td>NULL</td></tr>
  </tbody>
</table>
<p><strong>Need:</strong> Distinguish "no value" from "value is 0."</p>
<pre><code>SELECT name,
    CASE
        WHEN count IS NULL THEN NULL
        WHEN count = 0     THEN 'No sales'
        ELSE CAST(count AS CHAR)
    END AS status
FROM tbl;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>status</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>10</td></tr>
    <tr><td>B</td><td>No sales</td></tr>
    <tr><td>C</td><td>NULL</td></tr>
  </tbody>
</table>
<blockquote>Error: NULL must be checked with <code>IS NULL</code>.<br>Wrong: <code>WHEN count = NULL THEN ...</code> — always false!<br>Correct: <code>WHEN count IS NULL THEN ...</code></blockquote>

<h3>25.4 CASE with COUNT — Conditional Counting</h3>
<p><strong>Count boys, girls, and high scorers separately</strong></p>
<pre><code>SELECT
    COUNT(*) AS total,
    COUNT(CASE WHEN gender = 'M' THEN 1 END) AS boys,
    COUNT(CASE WHEN gender = 'F' THEN 1 END) AS girls,
    COUNT(CASE WHEN score &gt;= 90 THEN 1 END) AS high_score
FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>total</th><th>boys</th><th>girls</th><th>high_score</th></tr></thead>
  <tbody>
    <tr><td>6</td><td>3</td><td>3</td><td>2</td></tr>
  </tbody>
</table>
<p>Logic: CASE returns NULL when no ELSE matches; COUNT doesn't count NULLs — so only matching rows are counted.</p>

<h3>25.5 CASE with SUM — Conditional Summing</h3>
<p><strong>Sum scores by gender separately</strong></p>
<pre><code>SELECT
    SUM(CASE WHEN gender = 'M' THEN score ELSE 0 END) AS boy_total,
    SUM(CASE WHEN gender = 'F' THEN score ELSE 0 END) AS girl_total
FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>boy_total</th><th>girl_total</th></tr></thead>
  <tbody>
    <tr><td>252</td><td>253</td></tr>
  </tbody>
</table>

<h3>25.6 Data Pivoting</h3>
<p>CASE + GROUP BY enables basic data pivoting:</p>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>class</th><th>gender</th><th>count</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>M</td><td>10</td></tr>
    <tr><td>A</td><td>F</td><td>8</td></tr>
    <tr><td>B</td><td>M</td><td>12</td></tr>
    <tr><td>B</td><td>F</td><td>15</td></tr>
  </tbody>
</table>
<p><strong>Pivot: one row per class, separate columns for M and F</strong></p>
<pre><code>SELECT class,
    SUM(CASE WHEN gender = 'M' THEN count ELSE 0 END) AS boys,
    SUM(CASE WHEN gender = 'F' THEN count ELSE 0 END) AS girls
FROM tbl
GROUP BY class;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>class</th><th>boys</th><th>girls</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>10</td><td>8</td></tr>
    <tr><td>B</td><td>12</td><td>15</td></tr>
  </tbody>
</table>
<p>Two rows of M/F data pivoted into two columns on one row. A common technique in BI reports.</p>

<h2>Part 26 SQL Execution Order (Must Know)</h2>
<p>The order SQL is <strong>written</strong> and the order it actually <strong>executes</strong> are completely different. Understanding execution order explains many confusing behaviors.</p>

<h3>26.1 Complete Order</h3>
<table>
  <thead><tr><th>Step</th><th>Clause</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><strong>FROM</strong></td><td>Determine which tables to use</td></tr>
    <tr><td>2</td><td><strong>JOIN ... ON</strong></td><td>Join other tables</td></tr>
    <tr><td>3</td><td><strong>WHERE</strong></td><td>Row-level filter (no aggregates, no aliases)</td></tr>
    <tr><td>4</td><td><strong>GROUP BY</strong></td><td>Group rows by column values</td></tr>
    <tr><td>5</td><td><strong>HAVING</strong></td><td>Group-level filter (aggregates allowed)</td></tr>
    <tr><td>6</td><td><strong>SELECT</strong></td><td>Choose columns, define aliases, compute</td></tr>
    <tr><td>7</td><td><strong>DISTINCT</strong></td><td>Deduplicate</td></tr>
    <tr><td>8</td><td><strong>ORDER BY</strong></td><td>Sort (aliases allowed)</td></tr>
    <tr><td>9</td><td><strong>LIMIT / OFFSET</strong></td><td>Limit the number of rows returned</td></tr>
  </tbody>
</table>

<h3>26.2 Written Order vs Execution Order</h3>
<p><strong>Written order</strong></p>
<pre><code>SELECT class, COUNT(*) AS num, AVG(score) AS avg
FROM students
WHERE score &gt; 60
GROUP BY class
HAVING COUNT(*) &gt;= 2
ORDER BY avg DESC
LIMIT 5;</code></pre>
<p><strong>Actual execution order</strong></p>
<pre><code>1. FROM students         determine data source
2. WHERE score &gt; 60     filter rows
3. GROUP BY class        group by class
4. HAVING COUNT(*) &gt;= 2 filter groups
5. SELECT class, ...     select columns + compute num/avg
6. ORDER BY avg DESC     sort (avg now exists)
7. LIMIT 5               take first 5</code></pre>

<h3>26.3 Why Can't WHERE Use Aggregate Functions?</h3>
<p>Because WHERE (step 3) runs <strong>before</strong> GROUP BY (step 4). Groups don't exist yet when WHERE runs.</p>
<p><strong>Wrong</strong></p>
<pre><code>SELECT class FROM students
WHERE COUNT(*) &gt; 5  -- error
GROUP BY class;</code></pre>
<p><strong>Correct (use HAVING)</strong></p>
<pre><code>SELECT class FROM students
GROUP BY class
HAVING COUNT(*) &gt; 5;</code></pre>

<h3>26.4 Why Can't WHERE Use SELECT Aliases?</h3>
<p>Because WHERE (step 3) runs <strong>before</strong> SELECT (step 6). The alias doesn't exist yet.</p>
<p><strong>Wrong</strong></p>
<pre><code>SELECT score + 10 AS bonus FROM students
WHERE bonus &gt; 100;  -- error</code></pre>
<p><strong>Correct (rewrite the expression)</strong></p>
<pre><code>SELECT score + 10 AS bonus FROM students
WHERE score + 10 &gt; 100;</code></pre>

<h3>26.5 Why Can ORDER BY Use SELECT Aliases?</h3>
<p>Because ORDER BY (step 8) runs <strong>after</strong> SELECT (step 6). The alias is already defined.</p>
<p><strong>Correct</strong></p>
<pre><code>SELECT score + 10 AS bonus FROM students
ORDER BY bonus DESC;</code></pre>

<h3>26.6 Summary Table</h3>
<table>
  <thead><tr><th>Operation</th><th>In WHERE?</th><th>In HAVING?</th><th>In ORDER BY?</th></tr></thead>
  <tbody>
    <tr><td>Use a column name</td><td>YES</td><td>YES</td><td>YES</td></tr>
    <tr><td>Use aggregate (COUNT, etc.)</td><td>NO</td><td>YES</td><td>YES</td></tr>
    <tr><td>Use a SELECT alias</td><td>NO</td><td>YES (MySQL)</td><td>YES</td></tr>
  </tbody>
</table>

<h2>Part 27 Practical Tips Collection</h2>
<p>Common techniques not covered in earlier parts but useful in real work.</p>

<h3>27.1 Find Duplicate Rows</h3>
<p><strong>Original table</strong></p>
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
<p><strong>Find emails appearing ≥ 2 times</strong></p>
<pre><code>SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) &gt;= 2;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>email</th><th>cnt</th></tr></thead>
  <tbody>
    <tr><td>a@x.com</td><td>2</td></tr>
    <tr><td>b@x.com</td><td>2</td></tr>
  </tbody>
</table>

<h3>27.2 Top N with Ties</h3>
<p>LIMIT N drops tied values at the boundary. Trick: find the score of rank N, then filter ≥ it.</p>
<p><strong>Original table</strong></p>
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
<p><strong>Top 3 (including ties)</strong></p>
<pre><code>SELECT * FROM students
WHERE score &gt;= (
    SELECT MIN(s) FROM (
        SELECT score AS s FROM students
        ORDER BY score DESC
        LIMIT 3
    ) AS t
);</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>95</td></tr>
    <tr><td>B</td><td>90</td></tr>
    <tr><td>C</td><td>85</td></tr>
    <tr><td>D</td><td>85</td></tr>
  </tbody>
</table>
<p>D is not dropped.</p>

<h3>27.3 Find the Row with Max/Min per Group</h3>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>class</th><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>Zhang San</td><td>85</td></tr>
    <tr><td>A</td><td>Li Si</td><td>92</td></tr>
    <tr><td>B</td><td>Wang Wu</td><td>78</td></tr>
    <tr><td>B</td><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>B</td><td>Qian Qi</td><td>95</td></tr>
  </tbody>
</table>
<p><strong>Who has the highest score in each class?</strong></p>
<pre><code>SELECT s.* FROM students s
WHERE s.score = (
    SELECT MAX(s2.score) FROM students s2
    WHERE s2.class = s.class
);</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>class</th><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>Li Si</td><td>92</td></tr>
    <tr><td>B</td><td>Qian Qi</td><td>95</td></tr>
  </tbody>
</table>

<h3>27.4 Calculate Running Percentages</h3>
<p>Each row's value as a percentage of the total:</p>
<p><strong>Original table</strong></p>
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
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>sales</th><th>pct</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>300</td><td>30.0</td></tr>
    <tr><td>B</td><td>500</td><td>50.0</td></tr>
    <tr><td>C</td><td>200</td><td>20.0</td></tr>
  </tbody>
</table>

<h3>27.5 Row-to-Column Pivoting</h3>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>name</th><th>subject</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>Chinese</td><td>85</td></tr>
    <tr><td>Zhang San</td><td>Math</td><td>92</td></tr>
    <tr><td>Li Si</td><td>Chinese</td><td>78</td></tr>
    <tr><td>Li Si</td><td>Math</td><td>88</td></tr>
  </tbody>
</table>
<pre><code>SELECT name,
    MAX(CASE WHEN subject = 'Chinese' THEN score END) AS chinese,
    MAX(CASE WHEN subject = 'Math' THEN score END) AS math
FROM scores
GROUP BY name;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>chinese</th><th>math</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td><td>92</td></tr>
    <tr><td>Li Si</td><td>78</td><td>88</td></tr>
  </tbody>
</table>

<h3>27.6 Find Consecutive Values</h3>
<p>Self-join to find consecutive numbers:</p>
<p><strong>Table: nums</strong></p>
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
<p><strong>Find consecutive pairs (n and n+1 both exist)</strong></p>
<pre><code>SELECT a.n, b.n
FROM nums a
JOIN nums b ON b.n = a.n + 1;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>a.n</th><th>b.n</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>2</td></tr>
    <tr><td>2</td><td>3</td></tr>
    <tr><td>7</td><td>8</td></tr>
  </tbody>
</table>

<h3>27.7 Prevent Division by Zero</h3>
<pre><code>-- Unsafe: errors when a = 0
SELECT total / cnt FROM tbl;

-- Safe: NULLIF converts 0 to NULL; division returns NULL instead of error
SELECT total / NULLIF(cnt, 0) FROM tbl;

-- Combined with COALESCE
SELECT COALESCE(total / NULLIF(cnt, 0), 0) FROM tbl;</code></pre>

<h3>27.8 String Concatenation</h3>
<p>MySQL uses the <strong>CONCAT</strong> function:</p>
<pre><code>SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM users;</code></pre>
<p>Note: In MySQL, <code>||</code> is OR, not string concatenation — unlike Oracle.</p>

<h3>27.9 Find the Nth Largest Value</h3>
<p><strong>The 2nd largest distinct score (90)</strong></p>
<pre><code>SELECT DISTINCT score FROM tbl
ORDER BY score DESC
LIMIT 1 OFFSET 1;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>score</th></tr></thead>
  <tbody>
    <tr><td>90</td></tr>
  </tbody>
</table>
<p>DISTINCT makes duplicates count as one; OFFSET 1 skips past the first (largest).</p>

<h3>27.10 Summary: Principles for Writing Good SQL</h3>
<table>
  <thead><tr><th>Principle</th><th>Explanation</th></tr></thead>
  <tbody>
    <tr><td><strong>Know what you want first</strong></td><td>Don't write as you go — start with a plain-English requirement</td></tr>
    <tr><td><strong>Write from the innermost layer</strong></td><td>For complex queries, write the innermost subquery first, verify it, then add outer layers</td></tr>
    <tr><td><strong>Run each step</strong></td><td>After adding a JOIN, run it and check the intermediate result</td></tr>
    <tr><td><strong>Add comments</strong></td><td>Use <code>-- comments</code> to explain the purpose of each section in complex queries</td></tr>
    <tr><td><strong>Use aliases to keep code short</strong></td><td>researcher → r, project_researcher → pr</td></tr>
    <tr><td><strong>Be careful with LEFT JOIN</strong></td><td>Only use it when you want all left rows; put right-table filters in ON</td></tr>
    <tr><td><strong>NULL uses IS NULL</strong></td><td>Never use = NULL</td></tr>
    <tr><td><strong>NOT EXISTS beats NOT IN</strong></td><td>Avoids NULL traps</td></tr>
    <tr><td><strong>Sort with ORDER BY</strong></td><td>SQL doesn't guarantee any default order</td></tr>
    <tr><td><strong>Use DISTINCT intentionally</strong></td><td>Overuse can mask logical errors</td></tr>
  </tbody>
</table>
`;
