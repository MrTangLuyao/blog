/* Post body — sql-syntax-guide-2 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['sql-syntax-guide-2:en'] = `
<p class="lead">SQL Syntax Complete Guide · Learn SQL by Example (Part 2). This post covers Part 11–20: LIMIT/OFFSET, DISTINCT, AS aliases, INNER JOIN, LEFT JOIN, multi-table JOINs, COUNT, SUM/AVG/MAX/MIN, GROUP BY, and HAVING.</p>

<h2>Part 11 LIMIT and OFFSET — Limiting Rows</h2>
<p><strong>LIMIT N</strong> returns only the <strong>first N rows</strong> of the result. <strong>OFFSET M</strong> skips the first M rows before starting. Used for pagination or "top N" queries.</p>

<h3>11.1 LIMIT — Take the First N Rows</h3>
<p><strong>Original table: students (sorted by score descending)</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Qian Qi</td><td>95</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Wang Wu</td><td>78</td></tr>
    <tr><td>Sun Ba</td><td>60</td></tr>
  </tbody>
</table>
<p><strong>Get the top 3</strong></p>
<pre><code>SELECT * FROM students
ORDER BY score DESC
LIMIT 3;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Qian Qi</td><td>95</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
  </tbody>
</table>
<blockquote>Note: LIMIT <strong>must be used together with ORDER BY</strong>; otherwise there's no defined meaning for "the first 3." Without ORDER BY, LIMIT's result is <strong>non-deterministic</strong> (may differ each time).</blockquote>

<h3>11.2 OFFSET — Skip the First M Rows</h3>
<p><strong>Skip the first 2 rows, then take 3 (i.e., ranks 3–5)</strong></p>
<pre><code>SELECT * FROM students
ORDER BY score DESC
LIMIT 3 OFFSET 2;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Wang Wu</td><td>78</td></tr>
  </tbody>
</table>
<p>OFFSET 2 skips the first 2 rows (Qian Qi, Li Si), then LIMIT 3 takes the next 3.</p>

<h3>11.3 Quick Reference</h3>
<table>
  <thead><tr><th>Syntax</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>LIMIT 5</code></td><td>Take the first 5 rows</td></tr>
    <tr><td><code>LIMIT 5 OFFSET 0</code></td><td>Same (OFFSET 0 = skip nothing)</td></tr>
    <tr><td><code>LIMIT 5 OFFSET 10</code></td><td>Skip 10, take the next 5 (rows 11–15)</td></tr>
    <tr><td><code>LIMIT 1 OFFSET 0</code></td><td>Row 1</td></tr>
    <tr><td><code>LIMIT 1 OFFSET 1</code></td><td>Row 2</td></tr>
    <tr><td><code>LIMIT 1 OFFSET 2</code></td><td>Row 3</td></tr>
    <tr><td><code>LIMIT 1 OFFSET N</code></td><td>Row (N+1)</td></tr>
  </tbody>
</table>
<blockquote>Tip: <strong>OFFSET is zero-based</strong>. To get row N, use OFFSET N-1.</blockquote>

<h3>11.4 Practical: Pagination</h3>
<p>Web apps often need "10 items per page." Page K is:</p>
<pre><code>-- Page 1 (rows 1-10)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 0;

-- Page 2 (rows 11-20)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;

-- Page 3 (rows 21-30)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;</code></pre>
<p><strong>Formula: Page K = LIMIT page_size OFFSET (K-1) × page_size</strong></p>

<h3>11.5 LIMIT Shorthand</h3>
<p>MySQL has two equivalent forms:</p>
<pre><code>-- Full form (recommended)
LIMIT 10 OFFSET 20

-- Shorthand (note: M is offset, N is limit — counterintuitive!)
LIMIT 20, 10</code></pre>
<blockquote>Note: In shorthand <code>LIMIT M, N</code>, <strong>M is OFFSET and N is LIMIT</strong> — the opposite of what you'd expect. Recommend using the full form <code>LIMIT N OFFSET M</code>.</blockquote>

<h3>11.6 LIMIT Trap: Ties at the Boundary</h3>
<p>If there are ties at position N, LIMIT N will arbitrarily pick one of them.</p>
<p><strong>Original table</strong></p>
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
<p>Using LIMIT 3 might return A, B, C — but D and E also score 85 and <strong>get dropped</strong>. The solution is to use HAVING + a subquery to find the "threshold score" (see Part 27).</p>

<h2>Part 12 DISTINCT — Deduplication</h2>
<p><strong>DISTINCT</strong> removes duplicate rows, making each unique value appear only once.</p>

<h3>12.1 Single-Column Deduplication</h3>
<p><strong>Original table: orders (multiple customers, multiple orders)</strong></p>
<table>
  <thead><tr><th>order_id</th><th>customer</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td></tr>
    <tr><td>2</td><td>Li Si</td></tr>
    <tr><td>3</td><td>Zhang San</td></tr>
    <tr><td>4</td><td>Wang Wu</td></tr>
    <tr><td>5</td><td>Zhang San</td></tr>
    <tr><td>6</td><td>Li Si</td></tr>
  </tbody>
</table>
<p><strong>List all unique customers</strong></p>
<pre><code>SELECT DISTINCT customer FROM orders;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>customer</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td></tr>
    <tr><td>Li Si</td></tr>
    <tr><td>Wang Wu</td></tr>
  </tbody>
</table>
<p>Original table has 6 rows; after deduplication, <strong>3 unique customers</strong>. Each appears only once.</p>

<h3>12.2 Multi-Column Combination Deduplication</h3>
<p>When DISTINCT has multiple columns, it deduplicates <strong>the entire combination</strong>, not each column separately.</p>
<p><strong>Original table: visits</strong></p>
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
<p><strong>Output</strong></p>
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
<p>7 original rows, 5 unique (user, page) combinations. For example (A, home) appeared twice — now only once.</p>

<h3>12.3 DISTINCT with COUNT</h3>
<p><strong>COUNT(DISTINCT column)</strong> is very common — "how many distinct values?"</p>
<pre><code>-- Total orders (each row counts)
SELECT COUNT(*) FROM orders;
-- Result: 6

-- Distinct customers
SELECT COUNT(DISTINCT customer) FROM orders;
-- Result: 3</code></pre>
<p>One counts 6 orders, the other counts 3 distinct customers. <strong>Both are correct</strong> but mean different things.</p>

<h3>12.4 DISTINCT vs GROUP BY</h3>
<p>These two produce the <strong>same result</strong>:</p>
<pre><code>-- Form 1: DISTINCT
SELECT DISTINCT customer FROM orders;

-- Form 2: GROUP BY
SELECT customer FROM orders GROUP BY customer;</code></pre>
<p>Use DISTINCT for simple deduplication; use GROUP BY when you also need aggregate statistics (COUNT, SUM, etc.).</p>
<blockquote>Note: DISTINCT deduplicates the <strong>entire SELECT list</strong>, not just one column. If you want "unique id but also show name," use GROUP BY or a subquery.</blockquote>

<h3>12.5 DISTINCT and NULL</h3>
<p>NULL is treated as <strong>one special value</strong> in DISTINCT — multiple NULLs merge into one.</p>
<pre><code>SELECT DISTINCT name FROM tbl;</code></pre>
<p>Multiple NULLs in the column become a single NULL row in the output.</p>

<h2>Part 13 AS — Aliases</h2>
<p><strong>AS</strong> gives a column or table a temporary <strong>alias</strong>. Aliases only affect display and reference — they don't change the original data.</p>

<h3>13.1 Column Aliases</h3>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>student_id</th><th>student_name</th><th>final_score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>92</td></tr>
  </tbody>
</table>
<pre><code>SELECT student_id   AS id,
       student_name AS name,
       final_score  AS score
FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>92</td></tr>
  </tbody>
</table>
<p>Result column names are shorter; <strong>the original table's column names are unchanged</strong>.</p>

<h3>13.2 Aliasing Computed Expressions (Important)</h3>
<p><strong>Without alias</strong></p>
<pre><code>SELECT name, score, score + 10 FROM students;</code></pre>
<p>Result has an ugly column header: <code>score + 10</code>.</p>
<p><strong>With alias (recommended)</strong></p>
<pre><code>SELECT name, score, score + 10 AS bonus_score
FROM students;</code></pre>
<p>For aggregate functions especially, <strong>always give an alias</strong>, otherwise the header is <code>COUNT(*)</code>:</p>
<pre><code>SELECT class, COUNT(*) AS total_students,
       AVG(score) AS avg_score
FROM students
GROUP BY class;</code></pre>

<h3>13.3 AS Is Optional</h3>
<pre><code>-- With AS
SELECT name AS n FROM students;

-- Without AS
SELECT name n FROM students;</code></pre>
<p>Both work, but <strong>including AS is recommended</strong> for clarity.</p>

<h3>13.4 Aliases with Spaces or Special Characters</h3>
<p>If the alias contains spaces, special characters, or reserved words, wrap it in backticks (MySQL):</p>
<pre><code>SELECT score AS \`Final Score\`,
       score + 10 AS \`Bonus Score\`
FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>Final Score</th><th>Bonus Score</th></tr></thead>
  <tbody>
    <tr><td>85</td><td>95</td></tr>
    <tr><td>92</td><td>102</td></tr>
  </tbody>
</table>

<h3>13.5 Table Aliases</h3>
<p>Table aliases are especially useful in multi-table JOINs:</p>
<pre><code>SELECT s.name, c.title
FROM students AS s
JOIN classes  AS c ON s.class_id = c.id;</code></pre>
<p><code>s.name</code> is much shorter than <code>students.name</code>. Typically 1–3 letters are used as table aliases.</p>

<h3>13.6 Important: Column Aliases Cannot Be Used in WHERE</h3>
<blockquote>Error: <strong>WHERE cannot use aliases defined in SELECT!</strong><br>Reason: WHERE executes before SELECT (see Part 26). The alias doesn't exist yet when WHERE runs.</blockquote>
<pre><code>-- Error! Alias b is not yet defined in WHERE
SELECT score + 10 AS b FROM students WHERE b &gt; 90;

-- Correct
SELECT score + 10 AS b FROM students WHERE score + 10 &gt; 90;</code></pre>
<p>But <strong>ORDER BY can use aliases</strong>, because it runs after SELECT:</p>
<pre><code>SELECT score + 10 AS b FROM students ORDER BY b DESC;</code></pre>

<h2>Part 14 INNER JOIN — Inner Join</h2>
<p>When data is spread across multiple tables and you need to "combine" them, use JOIN. <strong>INNER JOIN</strong> is the most common join type.</p>

<h3>14.1 Why We Need JOIN</h3>
<p>Two related tables:</p>
<p><strong>Table: students (only has class id)</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>101</td></tr>
    <tr><td>2</td><td>Li Si</td><td>102</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>101</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>103</td></tr>
  </tbody>
</table>
<p><strong>Table: classes (class names)</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>Class A</td></tr>
    <tr><td>102</td><td>Class B</td></tr>
    <tr><td>103</td><td>Class C</td></tr>
  </tbody>
</table>
<p>The students table only has class_id (a number) — you can't see the class name. To get "Zhang San — Class A" results, you need to <strong>join the two tables on class_id = id</strong>.</p>

<h3>14.2 INNER JOIN Basic Syntax</h3>
<pre><code>SELECT s.name, c.class_name
FROM students AS s
INNER JOIN classes AS c
    ON s.class_id = c.id;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>Class A</td></tr>
    <tr><td>Li Si</td><td>Class B</td></tr>
    <tr><td>Wang Wu</td><td>Class A</td></tr>
    <tr><td>Zhao Liu</td><td>Class C</td></tr>
  </tbody>
</table>
<p>"For each student, go look up the matching class name in the classes table."</p>
<blockquote>Tip: INNER can be omitted — <code>JOIN</code> is equivalent to <code>INNER JOIN</code>.</blockquote>

<h3>14.3 How the ON Condition Works</h3>
<p>JOIN can be broken into two steps:</p>
<p><strong>Step 1: Cartesian product (4 × 3 = 12 rows)</strong> — every student paired with every class.</p>
<p><strong>Step 2: Filter with ON</strong> — keep only rows where s.class_id = c.id.</p>
<p>This is the essence of INNER JOIN: Cartesian product + ON filter. The SQL engine optimizes this internally.</p>

<h3>14.4 What "Inner" Means</h3>
<p>"Inner" means <strong>only rows that have a match on both sides are kept</strong>.</p>
<p>If a student has class_id=999 which doesn't exist in classes, that student <strong>disappears</strong> from the INNER JOIN result.</p>
<blockquote>Note: If you want to <strong>keep unmatched rows</strong>, use <code>LEFT JOIN</code> (Part 15).</blockquote>

<h2>Part 15 LEFT JOIN — Left Join</h2>
<p><strong>LEFT JOIN</strong> (also called left outer join) <strong>keeps all rows from the left table</strong>, even if there's no match on the right (filling with NULL).</p>

<h3>15.1 INNER vs LEFT — Direct Comparison</h3>
<p><strong>Left table: students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>101</td></tr>
    <tr><td>2</td><td>Li Si</td><td>102</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>101</td></tr>
    <tr><td>4</td><td>Qian Qi</td><td>999</td></tr>
    <tr><td>5</td><td>Sun Ba</td><td>NULL</td></tr>
  </tbody>
</table>
<p><strong>Right table: classes</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>Class A</td></tr>
    <tr><td>102</td><td>Class B</td></tr>
    <tr><td>103</td><td>Class C</td></tr>
  </tbody>
</table>
<p><strong>With INNER JOIN</strong> — Qian Qi and Sun Ba disappear.</p>
<p><strong>With LEFT JOIN</strong></p>
<pre><code>SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>class_name</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>Class A</td></tr>
    <tr><td>Li Si</td><td>Class B</td></tr>
    <tr><td>Wang Wu</td><td>Class A</td></tr>
    <tr><td>Qian Qi</td><td>NULL</td></tr>
    <tr><td>Sun Ba</td><td>NULL</td></tr>
  </tbody>
</table>
<p>Qian Qi and Sun Ba are kept; class_name is NULL.</p>

<h3>15.2 Intuitive Summary</h3>
<blockquote><strong>INNER JOIN:</strong> "Keep only rows where both sides match" — strict<br><strong>LEFT JOIN:</strong> "Keep all left-side rows; NULL for missing right side" — permissive (left takes priority)</blockquote>

<h3>15.3 Classic LEFT JOIN Use: Find "Missing" Records</h3>
<p>LEFT JOIN + IS NULL is the standard pattern for finding "no match".</p>
<p><strong>Find students not assigned to any class</strong></p>
<pre><code>SELECT s.name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
WHERE c.id IS NULL;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th></tr></thead>
  <tbody>
    <tr><td>Qian Qi</td></tr>
    <tr><td>Sun Ba</td></tr>
  </tbody>
</table>
<p>After LEFT JOIN, unmatched rows have NULL for all right-table columns. WHERE c.id IS NULL keeps only those rows.</p>

<h3>15.4 LEFT JOIN Trap: ON vs WHERE</h3>
<p>Filtering the right table in ON vs WHERE produces <strong>different results</strong>.</p>
<p><strong>Need:</strong> List all students (including unclassed), but only show "high" level class names.</p>
<p><strong>Wrong: condition in WHERE</strong></p>
<pre><code>SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
WHERE c.level = 'high';</code></pre>
<p>This loses students with NULL class_name — the WHERE filter removes them.</p>
<p><strong>Correct: condition in ON</strong></p>
<pre><code>SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c
    ON s.class_id = c.id AND c.level = 'high';</code></pre>
<p>All students stay; non-high classes just show NULL as class_name.</p>
<blockquote>Rule: In LEFT JOIN, right-table filter conditions should go in <strong>ON</strong>, not WHERE. WHERE removes NULL rows, destroying the LEFT semantics.</blockquote>

<h2>Part 16 Multi-Table JOINs</h2>
<p>For 3 or more tables, just chain multiple JOINs.</p>

<h3>16.1 Example: 3-Table JOIN</h3>
<p><strong>Table: students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>class_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>101</td></tr>
    <tr><td>2</td><td>Li Si</td><td>102</td></tr>
  </tbody>
</table>
<p><strong>Table: classes</strong></p>
<table>
  <thead><tr><th>id</th><th>class_name</th><th>teacher_id</th></tr></thead>
  <tbody>
    <tr><td>101</td><td>Class A</td><td>500</td></tr>
    <tr><td>102</td><td>Class B</td><td>501</td></tr>
  </tbody>
</table>
<p><strong>Table: teachers</strong></p>
<table>
  <thead><tr><th>id</th><th>teacher_name</th></tr></thead>
  <tbody>
    <tr><td>500</td><td>Teacher Wang</td></tr>
    <tr><td>501</td><td>Teacher Li</td></tr>
  </tbody>
</table>
<p><strong>Need:</strong> Each student's class name + homeroom teacher name.</p>
<pre><code>SELECT s.name AS student,
       c.class_name AS class,
       t.teacher_name AS teacher
FROM students s
JOIN classes  c ON s.class_id = c.id
JOIN teachers t ON c.teacher_id = t.id;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>student</th><th>class</th><th>teacher</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>Class A</td><td>Teacher Wang</td></tr>
    <tr><td>Li Si</td><td>Class B</td><td>Teacher Li</td></tr>
  </tbody>
</table>

<h3>16.2 Many-to-Many: Through a Junction Table</h3>
<p>Many-to-many relationships typically need a <strong>junction table</strong> to bridge them.</p>
<p><strong>Table: students</strong> / <strong>Table: courses</strong> / <strong>Junction: enrollments (who enrolled in what)</strong></p>
<pre><code>SELECT s.name, c.title
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses    c ON e.course_id = c.id;</code></pre>
<blockquote>Tip: Many-to-many standard pattern: A table → JOIN junction table → JOIN B table. The junction table has a_id and b_id as foreign keys.</blockquote>

<h3>16.3 Mixing INNER and LEFT</h3>
<p>A single query can mix different JOIN types.</p>
<p><strong>Need:</strong> List all students (even those with no courses), their courses and teachers.</p>
<pre><code>SELECT s.name, c.title, t.name
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN courses    c ON e.course_id = c.id
LEFT JOIN teachers   t ON c.teacher_id = t.id;</code></pre>
<p>LEFT JOIN ensures students aren't dropped; students with no courses have NULL for all downstream columns.</p>

<h2>Part 17 COUNT — Counting Rows</h2>
<p><strong>COUNT</strong> is the most common <strong>aggregate function</strong>, used to count rows.</p>

<h3>17.1 Three Forms of COUNT (Critical)</h3>
<table>
  <thead><tr><th>Form</th><th>What it counts</th></tr></thead>
  <tbody>
    <tr><td><code>COUNT(*)</code></td><td>All rows (regardless of NULLs)</td></tr>
    <tr><td><code>COUNT(column)</code></td><td>Rows where that column is <strong>not NULL</strong></td></tr>
    <tr><td><code>COUNT(DISTINCT column)</code></td><td>Distinct <strong>non-NULL</strong> values in that column</td></tr>
  </tbody>
</table>

<h3>17.2 Real Data Comparison</h3>
<p><strong>Original table: sales</strong></p>
<table>
  <thead><tr><th>id</th><th>customer</th><th>amount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>100</td></tr>
    <tr><td>2</td><td>Li Si</td><td>200</td></tr>
    <tr><td>3</td><td>Zhang San</td><td>NULL</td></tr>
    <tr><td>4</td><td>NULL</td><td>50</td></tr>
    <tr><td>5</td><td>Wang Wu</td><td>150</td></tr>
  </tbody>
</table>
<pre><code>SELECT
    COUNT(*)               AS all_rows,
    COUNT(customer)        AS non_null_customer,
    COUNT(amount)          AS non_null_amount,
    COUNT(DISTINCT customer) AS unique_customers
FROM sales;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>all_rows</th><th>non_null_customer</th><th>non_null_amount</th><th>unique_customers</th></tr></thead>
  <tbody>
    <tr><td>5</td><td>4</td><td>4</td><td>3</td></tr>
  </tbody>
</table>
<p>Analysis:</p>
<table>
  <thead><tr><th>Column</th><th>Value</th><th>Explanation</th></tr></thead>
  <tbody>
    <tr><td><code>COUNT(*)</code></td><td>5</td><td>5 total rows</td></tr>
    <tr><td><code>COUNT(customer)</code></td><td>4</td><td>1 NULL customer (id=4), remaining 4</td></tr>
    <tr><td><code>COUNT(amount)</code></td><td>4</td><td>1 NULL amount (id=3), remaining 4</td></tr>
    <tr><td><code>COUNT(DISTINCT customer)</code></td><td>3</td><td>Distinct non-NULL: Zhang San, Li Si, Wang Wu</td></tr>
  </tbody>
</table>

<h3>17.3 COUNT with GROUP BY (Most Common)</h3>
<pre><code>SELECT student, COUNT(*) AS course_count
FROM enrollments
GROUP BY student;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>student</th><th>course_count</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>3</td></tr>
    <tr><td>Li Si</td><td>2</td></tr>
    <tr><td>Wang Wu</td><td>1</td></tr>
  </tbody>
</table>

<h3>17.4 COUNT Is Always ≥ 0, Never NULL</h3>
<p>Even when a group is all NULLs, COUNT returns 0. SUM and AVG return NULL in that case.</p>
<pre><code>SELECT COUNT(*), COUNT(x), SUM(x), AVG(x) FROM t;</code></pre>
<p><strong>Output (all rows are NULL)</strong></p>
<table>
  <thead><tr><th>COUNT(*)</th><th>COUNT(x)</th><th>SUM(x)</th><th>AVG(x)</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>0</td><td>NULL</td><td>NULL</td></tr>
  </tbody>
</table>

<h3>17.5 Classic Trap: LEFT JOIN + COUNT(*)</h3>
<p><strong>Need:</strong> How many sales does each store have (show 0 for stores with no sales)?</p>
<p><strong>Wrong: COUNT(*)</strong></p>
<pre><code>SELECT s.name, COUNT(*) AS sale_count
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id
GROUP BY s.id, s.name;</code></pre>
<p>Stores with no sales show 1 instead of 0 — because the LEFT JOIN produces a row of all NULLs, and COUNT(*) counts it.</p>
<p><strong>Correct: COUNT a right-table non-null column</strong></p>
<pre><code>SELECT s.name, COUNT(sa.id) AS sale_count
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id
GROUP BY s.id, s.name;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>sale_count</th></tr></thead>
  <tbody>
    <tr><td>Store A</td><td>2</td></tr>
    <tr><td>Store B</td><td>0</td></tr>
    <tr><td>Store C</td><td>0</td></tr>
  </tbody>
</table>
<p>COUNT(sa.id): since id is NULL for unmatched stores, it counts 0.</p>

<h2>Part 18 SUM / AVG / MAX / MIN</h2>
<p>The other 4 aggregate functions. They all <strong>automatically ignore NULL</strong>.</p>
<table>
  <thead><tr><th>Function</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><code>SUM(col)</code></td><td>Sum of values</td></tr>
    <tr><td><code>AVG(col)</code></td><td>Average</td></tr>
    <tr><td><code>MAX(col)</code></td><td>Maximum (works on numbers, dates, strings)</td></tr>
    <tr><td><code>MIN(col)</code></td><td>Minimum (same)</td></tr>
  </tbody>
</table>

<h3>18.1 Basic Usage</h3>
<p><strong>Original table: sales</strong></p>
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
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>total</th><th>average</th><th>highest</th><th>lowest</th><th>num_rows</th></tr></thead>
  <tbody>
    <tr><td>1000</td><td>200</td><td>300</td><td>100</td><td>5</td></tr>
  </tbody>
</table>

<h3>18.2 NULL Is Automatically Ignored</h3>
<pre><code>SELECT SUM(x), AVG(x), COUNT(x), COUNT(*) FROM t;</code></pre>
<p><strong>Output (table has 3 non-NULL values: 10, 20, 30)</strong></p>
<table>
  <thead><tr><th>SUM(x)</th><th>AVG(x)</th><th>COUNT(x)</th><th>COUNT(*)</th></tr></thead>
  <tbody>
    <tr><td>60</td><td>20</td><td>3</td><td>5</td></tr>
  </tbody>
</table>
<p>AVG = 20, not 12. AVG = SUM / COUNT(x) = 60/3 = 20. NULL rows <strong>don't participate</strong> in numerator or denominator.</p>
<blockquote>Note: To treat NULL as 0 in AVG, use <code>AVG(COALESCE(x, 0))</code>: denominator becomes COUNT(*)=5, average becomes 12.</blockquote>

<h3>18.3 MAX/MIN on Strings and Dates</h3>
<pre><code>SELECT MIN(date) AS earliest, MAX(date) AS latest FROM events;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>earliest</th><th>latest</th></tr></thead>
  <tbody>
    <tr><td>2024-03-15</td><td>2024-08-20</td></tr>
  </tbody>
</table>

<h3>18.4 With GROUP BY (Per-Group Calculation)</h3>
<p><strong>Each store's total, average, and max sales</strong></p>
<pre><code>SELECT store,
       SUM(amount) AS total,
       AVG(amount) AS avg,
       MAX(amount) AS max
FROM sales
GROUP BY store;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>store</th><th>total</th><th>avg</th><th>max</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>300</td><td>150</td><td>200</td></tr>
    <tr><td>B</td><td>500</td><td>166.67</td><td>300</td></tr>
    <tr><td>C</td><td>500</td><td>500</td><td>500</td></tr>
  </tbody>
</table>

<h2>Part 19 GROUP BY — Grouping</h2>
<p>GROUP BY groups rows <strong>by the values of certain columns</strong>, <strong>compressing each group into one row</strong>, and calculates aggregate statistics per group.</p>

<h3>19.1 Understanding GROUP BY Intuitively</h3>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>name</th><th>class</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>A</td><td>85</td></tr>
    <tr><td>Li Si</td><td>B</td><td>92</td></tr>
    <tr><td>Wang Wu</td><td>A</td><td>78</td></tr>
    <tr><td>Zhao Liu</td><td>A</td><td>88</td></tr>
    <tr><td>Qian Qi</td><td>B</td><td>95</td></tr>
    <tr><td>Sun Ba</td><td>C</td><td>70</td></tr>
  </tbody>
</table>
<p><strong>Step 1: Group by class</strong></p>
<table>
  <thead><tr><th>class</th><th>Rows in group</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>Zhang San/85, Wang Wu/78, Zhao Liu/88</td></tr>
    <tr><td>B</td><td>Li Si/92, Qian Qi/95</td></tr>
    <tr><td>C</td><td>Sun Ba/70</td></tr>
  </tbody>
</table>
<p><strong>Step 2: Calculate aggregate per group, compress to one row</strong></p>
<pre><code>SELECT class, COUNT(*) AS num, AVG(score) AS avg
FROM students
GROUP BY class;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>class</th><th>num</th><th>avg</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>3</td><td>83.67</td></tr>
    <tr><td>B</td><td>2</td><td>93.5</td></tr>
    <tr><td>C</td><td>1</td><td>70</td></tr>
  </tbody>
</table>

<h3>19.2 Key Rule: SELECT Columns Must Satisfy One of</h3>
<blockquote>After GROUP BY, every column in SELECT must either:<br>1. Appear in the GROUP BY clause<br>2. Be the result of an aggregate function (COUNT, SUM, AVG, MAX, MIN)<br><br>Violating this rule causes an error (in strict mode).</blockquote>
<p><strong>Wrong</strong></p>
<pre><code>-- name is neither in GROUP BY nor an aggregate
SELECT class, name, COUNT(*)
FROM students
GROUP BY class;</code></pre>
<p><strong>Correct (multi-column grouping)</strong></p>
<pre><code>SELECT class, gender, COUNT(*) AS num
FROM students
GROUP BY class, gender;
-- Both class and gender are in GROUP BY, so both can be SELECTed</code></pre>

<h3>19.3 Multi-Column GROUP BY</h3>
<pre><code>SELECT class, gender, COUNT(*) AS num, AVG(score) AS avg
FROM students
GROUP BY class, gender;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>class</th><th>gender</th><th>num</th><th>avg</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>M</td><td>2</td><td>81.5</td></tr>
    <tr><td>A</td><td>F</td><td>1</td><td>90</td></tr>
    <tr><td>B</td><td>M</td><td>1</td><td>88</td></tr>
    <tr><td>B</td><td>F</td><td>2</td><td>93.5</td></tr>
  </tbody>
</table>
<p>Each (class, gender) combination is a separate group.</p>

<h3>19.4 GROUP BY and NULL</h3>
<p>NULL is treated as its own distinct group in GROUP BY.</p>
<pre><code>SELECT category, SUM(amount)
FROM tbl
GROUP BY category;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>category</th><th>SUM(amount)</th></tr></thead>
  <tbody>
    <tr><td>Fruit</td><td>25</td></tr>
    <tr><td>NULL</td><td>25</td></tr>
  </tbody>
</table>

<h2>Part 20 HAVING — Post-Group Filtering</h2>
<p>HAVING is a filter that runs <strong>after grouping</strong>. It can use aggregate functions (COUNT, SUM, etc.) — WHERE cannot.</p>

<h3>20.1 WHERE vs HAVING — Key Difference</h3>
<table>
  <thead><tr><th>Aspect</th><th>WHERE</th><th>HAVING</th></tr></thead>
  <tbody>
    <tr><td>Runs when</td><td>Before grouping</td><td>After grouping</td></tr>
    <tr><td>Filters</td><td><strong>Each row</strong></td><td><strong>Each group</strong></td></tr>
    <tr><td>Can use aggregates?</td><td>NO</td><td>YES</td></tr>
    <tr><td>Operates on</td><td>Raw data</td><td>Aggregated results</td></tr>
  </tbody>
</table>

<h3>20.2 Example Comparison</h3>
<p><strong>Need: Find stores whose total sales exceed 300</strong></p>
<pre><code>SELECT store, SUM(amount) AS total
FROM sales
GROUP BY store
HAVING SUM(amount) &gt; 300;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>store</th><th>total</th></tr></thead>
  <tbody>
    <tr><td>A</td><td>350</td></tr>
    <tr><td>B</td><td>800</td></tr>
  </tbody>
</table>
<p><strong>Using WHERE would error</strong></p>
<pre><code>-- Error: WHERE cannot use aggregate functions
SELECT store, SUM(amount)
FROM sales
WHERE SUM(amount) &gt; 300
GROUP BY store;</code></pre>
<blockquote>Reason: WHERE executes before grouping — SUM hasn't been computed yet, so it can't be used.</blockquote>

<h3>20.3 WHERE and HAVING Together</h3>
<p>Both can be used together with clear separation: WHERE filters rows first, then GROUP BY groups them, then HAVING filters groups.</p>
<pre><code>SELECT store, SUM(amount) AS total
FROM sales
WHERE amount &gt; 50       -- row-level filter (first)
GROUP BY store
HAVING SUM(amount) &gt; 200;  -- group-level filter (after)</code></pre>

<h3>20.4 Common HAVING Patterns</h3>
<table>
  <thead><tr><th>Need</th><th>HAVING syntax</th></tr></thead>
  <tbody>
    <tr><td>At least N rows per group</td><td><code>HAVING COUNT(*) &gt;= N</code></td></tr>
    <tr><td>Exactly 1 row per group</td><td><code>HAVING COUNT(*) = 1</code></td></tr>
    <tr><td>At least N distinct values</td><td><code>HAVING COUNT(DISTINCT col) &gt;= N</code></td></tr>
    <tr><td>Sum exceeds threshold</td><td><code>HAVING SUM(col) &gt; 1000</code></td></tr>
    <tr><td>Average in range</td><td><code>HAVING AVG(col) BETWEEN 60 AND 90</code></td></tr>
    <tr><td>Max equals a value</td><td><code>HAVING MAX(col) = 100</code></td></tr>
  </tbody>
</table>

<h3>20.5 HAVING with Aliases (Some Databases)</h3>
<p>MySQL allows HAVING to use SELECT aliases for brevity:</p>
<pre><code>SELECT store, SUM(amount) AS total
FROM sales
GROUP BY store
HAVING total &gt; 300;  -- MySQL supports this</code></pre>
<p>The SQL standard technically doesn't allow this, but MySQL and PostgreSQL both support it. For portability, write the full expression:</p>
<pre><code>HAVING SUM(amount) &gt; 300</code></pre>
`;
