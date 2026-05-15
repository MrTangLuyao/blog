/* Post body — sql-syntax-guide-1 / en */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['sql-syntax-guide-1:en'] = `
<p class="lead">SQL Syntax Complete Guide · Learn SQL by Example. Every syntax is illustrated with an "input table → SQL → output table" three-section walkthrough, with abundant examples, detailed explanations, and practical tips. This post covers Part 1–10: SELECT, FROM, WHERE, Comparison Operators, AND/OR/NOT, IN/NOT IN, BETWEEN, LIKE, IS NULL, and ORDER BY.</p>

<h2>Part 1 SELECT — Choosing Columns</h2>
<p><strong>SELECT</strong> is the <strong>most important</strong> keyword in SQL. Its job is to <strong>pick which columns you want to see from a table</strong>. No matter how complex the query, the very first word is almost always SELECT.</p>

<h3>1.1 Basic Usage</h3>
<p>Suppose we have a <code>students</code> table (student records):</p>
<p><strong>Original table: students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>18</td><td>M</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>19</td><td>F</td><td>92</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>20</td><td>M</td><td>78</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td><td>F</td><td>88</td></tr>
  </tbody>
</table>

<p>Usage A: Select all columns (use <code>*</code>)</p>
<pre><code>SELECT * FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>18</td><td>M</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>19</td><td>F</td><td>92</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>20</td><td>M</td><td>78</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td><td>F</td><td>88</td></tr>
  </tbody>
</table>
<p>The result is <strong>identical to the original table</strong>. <code>*</code> means all columns.</p>

<p>Usage B: Select specific columns</p>
<pre><code>SELECT name, score FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Wang Wu</td><td>78</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
  </tbody>
</table>
<p>Only name and score are shown; <strong>the other columns are hidden</strong>. Note that the number of rows is unchanged — still 4.</p>

<p>Usage C: Column order is up to you</p>
<pre><code>SELECT score, name FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>score</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>85</td><td>Zhang San</td></tr>
    <tr><td>92</td><td>Li Si</td></tr>
    <tr><td>78</td><td>Wang Wu</td></tr>
    <tr><td>88</td><td>Zhao Liu</td></tr>
  </tbody>
</table>
<p>The column order matches what you write after SELECT — score first, name second.</p>

<h3>1.2 Expressions in SELECT</h3>
<p>After SELECT you can write not just column names but also <strong>expressions</strong>.</p>
<pre><code>SELECT name, score, score + 10, score * 1.1
FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th><th>score + 10</th><th>score * 1.1</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td><td>95</td><td>93.5</td></tr>
    <tr><td>Li Si</td><td>92</td><td>102</td><td>101.2</td></tr>
    <tr><td>Wang Wu</td><td>78</td><td>88</td><td>85.8</td></tr>
    <tr><td>Zhao Liu</td><td>88</td><td>98</td><td>96.8</td></tr>
  </tbody>
</table>
<p>Each row's score is automatically added by 10 and multiplied by 1.1. <strong>The original table is not changed</strong> — the query result just displays the newly computed values.</p>
<blockquote>Note: The computed column names look ugly (literally <code>score + 10</code>). You'd normally use <code>AS</code> to give it a nice alias. See Part 13.</blockquote>

<h3>1.3 Selecting a Constant</h3>
<p>You can even SELECT a fixed value — every row will show that value:</p>
<pre><code>SELECT name, 'student' FROM students;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>'student'</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>student</td></tr>
    <tr><td>Li Si</td><td>student</td></tr>
    <tr><td>Wang Wu</td><td>student</td></tr>
    <tr><td>Zhao Liu</td><td>student</td></tr>
  </tbody>
</table>
<p>This isn't used often on its own, but it's handy in combination with UNION and similar patterns.</p>

<h2>Part 2 FROM — Which Table</h2>
<p><strong>FROM</strong> tells the database <strong>"which table to query from."</strong> It comes right after SELECT. Every SELECT must have a FROM.</p>

<h3>2.1 Basic Format</h3>
<pre><code>SELECT column_name FROM table_name;</code></pre>
<p>It has exactly one job: <strong>specify the data source</strong>. Simple as that.</p>

<h3>2.2 FROM with Multiple Tables</h3>
<p>Listing multiple tables after FROM (separated by commas) produces a <strong>Cartesian product</strong> (every row × every row). This is rarely used in practice; we normally use JOIN (Parts 14, 15) to combine tables.</p>
<p>Here's what a Cartesian product looks like. Two small tables:</p>
<p><strong>Table A: colors</strong></p>
<table>
  <thead><tr><th>color</th></tr></thead>
  <tbody>
    <tr><td>Red</td></tr>
    <tr><td>Blue</td></tr>
  </tbody>
</table>
<p><strong>Table B: sizes</strong></p>
<table>
  <thead><tr><th>size</th></tr></thead>
  <tbody>
    <tr><td>S</td></tr>
    <tr><td>M</td></tr>
    <tr><td>L</td></tr>
  </tbody>
</table>
<pre><code>SELECT * FROM colors, sizes;</code></pre>
<p><strong>Output: 2 × 3 = 6 rows (Cartesian product)</strong></p>
<table>
  <thead><tr><th>color</th><th>size</th></tr></thead>
  <tbody>
    <tr><td>Red</td><td>S</td></tr>
    <tr><td>Red</td><td>M</td></tr>
    <tr><td>Red</td><td>L</td></tr>
    <tr><td>Blue</td><td>S</td></tr>
    <tr><td>Blue</td><td>M</td></tr>
    <tr><td>Blue</td><td>L</td></tr>
  </tbody>
</table>
<p>Every color is paired with every size. The Cartesian product itself is rarely useful, but understanding it helps you understand JOIN.</p>

<h3>2.3 Table Aliases in FROM</h3>
<p>Give a table a short name to make later references easier:</p>
<pre><code>SELECT s.name, s.score FROM students AS s;
-- Or omit AS
SELECT s.name, s.score FROM students s;</code></pre>
<p>Both forms are equivalent. <strong>s</strong> is the alias for students.</p>
<blockquote>Tip: In single-table queries you don't really need a table alias. Aliases become useful in <strong>multi-table JOINs</strong>, saving you from writing the full table name repeatedly.</blockquote>

<h2>Part 3 WHERE — Filtering Rows</h2>
<p>SELECT + FROM alone isn't enough — it returns <strong>every row</strong>. <strong>WHERE</strong> lets you <strong>keep only the rows that meet a condition</strong>, discarding the rest.</p>

<h3>3.1 One-sentence Summary</h3>
<blockquote>SELECT decides <strong>which columns to show</strong>; WHERE decides <strong>which rows to show</strong>.</blockquote>

<h3>3.2 A Complete Example</h3>
<p>Continuing with the students table:</p>
<p><strong>Original table: students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>18</td><td>M</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>19</td><td>F</td><td>92</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>20</td><td>M</td><td>78</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td><td>F</td><td>88</td></tr>
    <tr><td>5</td><td>Qian Qi</td><td>21</td><td>M</td><td>95</td></tr>
  </tbody>
</table>

<p>Example 1: Find students with score ≥ 85</p>
<pre><code>SELECT name, score FROM students
WHERE score >= 85;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Qian Qi</td><td>95</td></tr>
  </tbody>
</table>
<p>Row-by-row check:</p>
<table>
  <thead><tr><th>name</th><th>score</th><th>score ≥ 85?</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td><td>YES (85 ≥ 85)</td><td>Keep</td></tr>
    <tr><td>Li Si</td><td>92</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Wang Wu</td><td>78</td><td>NO</td><td>Discard</td></tr>
    <tr><td>Zhao Liu</td><td>88</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Qian Qi</td><td>95</td><td>YES</td><td>Keep</td></tr>
  </tbody>
</table>

<p>Example 2: Find female students</p>
<pre><code>SELECT * FROM students
WHERE gender = 'F';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Li Si</td><td>19</td><td>F</td><td>92</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td><td>F</td><td>88</td></tr>
  </tbody>
</table>
<p>String values must be wrapped in single quotes <code>'F'</code>; numbers don't need them.</p>

<p>Example 3: Find students exactly 18 years old</p>
<pre><code>SELECT name, age FROM students
WHERE age = 18;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>age</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>18</td></tr>
    <tr><td>Zhao Liu</td><td>18</td></tr>
  </tbody>
</table>
<blockquote>Note: SQL equality is a <strong>single <code>=</code></strong>, not <code>==</code>. This differs from Python, Java, etc. — a common mistake for beginners.</blockquote>

<h3>3.3 What If You Omit WHERE?</h3>
<p>Without WHERE, <strong>all rows are returned</strong> — equivalent to no filter. WHERE is <strong>optional</strong>, but in practice the vast majority of SELECT statements include one.</p>

<h2>Part 4 Comparison Operators (=, &lt;&gt;, &gt;, &lt;, &gt;=, &lt;=)</h2>
<p>There are 6 <strong>comparison operators</strong> you can use in WHERE:</p>
<table>
  <thead><tr><th>Operator</th><th>Meaning</th><th>Example</th><th>Explanation</th></tr></thead>
  <tbody>
    <tr><td><code>=</code></td><td>Equal</td><td><code>age = 18</code></td><td>Exactly 18</td></tr>
    <tr><td><code>&lt;&gt;</code></td><td>Not equal</td><td><code>gender &lt;&gt; 'M'</code></td><td>Not male (also writable as <code>!=</code>)</td></tr>
    <tr><td><code>&gt;</code></td><td>Greater than</td><td><code>score &gt; 90</code></td><td>Score &gt; 90 (exclusive)</td></tr>
    <tr><td><code>&lt;</code></td><td>Less than</td><td><code>age &lt; 20</code></td><td>Under 20</td></tr>
    <tr><td><code>&gt;=</code></td><td>Greater or equal</td><td><code>score &gt;= 85</code></td><td>85 and above</td></tr>
    <tr><td><code>&lt;=</code></td><td>Less or equal</td><td><code>age &lt;= 18</code></td><td>18 and below</td></tr>
  </tbody>
</table>

<h3>4.1 Two Ways to Write "Not Equal"</h3>
<p><code>&lt;&gt;</code> and <code>!=</code> are <strong>completely equivalent</strong>. The SQL standard is <code>&lt;&gt;</code>, but most databases also support <code>!=</code>.</p>
<p><strong>students table</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>gender</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>M</td></tr>
    <tr><td>2</td><td>Li Si</td><td>F</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>M</td></tr>
  </tbody>
</table>
<p><strong>SQL (both forms are equivalent)</strong></p>
<pre><code>-- Form 1 (recommended)
SELECT name FROM students WHERE gender &lt;&gt; 'M';

-- Form 2
SELECT name FROM students WHERE gender != 'M';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th></tr></thead>
  <tbody>
    <tr><td>Li Si</td></tr>
  </tbody>
</table>

<h3>4.2 Comparing Strings</h3>
<p>Strings can be compared with <code>&gt;</code> and <code>&lt;</code>, in <strong>lexicographic (dictionary) order</strong>.</p>
<pre><code>SELECT * FROM students WHERE name &gt;= 'Wang';</code></pre>
<p>Names that come before "Wang" lexicographically are excluded. String comparisons are rarely used in practice; LIKE (Part 8) is far more common.</p>

<h3>4.3 Comparing Dates</h3>
<p><strong>Table: events</strong></p>
<table>
  <thead><tr><th>id</th><th>event</th><th>date</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Register</td><td>2024-01-15</td></tr>
    <tr><td>2</td><td>Login</td><td>2024-03-20</td></tr>
    <tr><td>3</td><td>Purchase</td><td>2024-05-10</td></tr>
    <tr><td>4</td><td>Refund</td><td>2024-07-01</td></tr>
  </tbody>
</table>
<p><strong>Find events before 2024-04</strong></p>
<pre><code>SELECT * FROM events WHERE date &lt; '2024-04-01';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>event</th><th>date</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Register</td><td>2024-01-15</td></tr>
    <tr><td>2</td><td>Login</td><td>2024-03-20</td></tr>
  </tbody>
</table>
<p>Dates are wrapped in <strong>single quotes</strong>, in <code>'YYYY-MM-DD'</code> format.</p>

<h2>Part 5 AND / OR / NOT — Combining Conditions</h2>
<p>When WHERE needs <strong>multiple conditions</strong>, combine them with AND, OR, and NOT.</p>
<table>
  <thead><tr><th>Keyword</th><th>Meaning</th><th>When to use</th></tr></thead>
  <tbody>
    <tr><td><strong>AND</strong></td><td>All must be true</td><td>Keep only rows where every condition is satisfied</td></tr>
    <tr><td><strong>OR</strong></td><td>Any must be true</td><td>Keep rows where at least one condition is satisfied</td></tr>
    <tr><td><strong>NOT</strong></td><td>Negate</td><td>Flip true to false</td></tr>
  </tbody>
</table>

<h3>5.1 AND — Both Conditions Must Be Met</h3>
<p><strong>Original table: students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>18</td><td>M</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>19</td><td>F</td><td>92</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>20</td><td>M</td><td>78</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td><td>F</td><td>88</td></tr>
    <tr><td>5</td><td>Qian Qi</td><td>21</td><td>M</td><td>95</td></tr>
  </tbody>
</table>
<p>Example: Find "female students aged 18"</p>
<pre><code>SELECT * FROM students
WHERE age = 18 AND gender = 'F';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td><td>F</td><td>88</td></tr>
  </tbody>
</table>
<p>Row-by-row verification:</p>
<table>
  <thead><tr><th>name</th><th>age = 18?</th><th>gender = 'F'?</th><th>AND</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>YES</td><td>NO</td><td>NO</td><td>Discard</td></tr>
    <tr><td>Li Si</td><td>NO</td><td>YES</td><td>NO</td><td>Discard</td></tr>
    <tr><td>Wang Wu</td><td>NO</td><td>NO</td><td>NO</td><td>Discard</td></tr>
    <tr><td>Zhao Liu</td><td>YES</td><td>YES</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Qian Qi</td><td>NO</td><td>NO</td><td>NO</td><td>Discard</td></tr>
  </tbody>
</table>
<p><strong>AND is like an "AND gate"</strong>: output is true only when both inputs are true.</p>

<h3>5.2 OR — Either Condition Is Enough</h3>
<p>Example: Find "under 20 OR score above 90"</p>
<pre><code>SELECT * FROM students
WHERE age &lt; 20 OR score &gt; 90;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>18</td><td>M</td><td>85</td></tr>
    <tr><td>2</td><td>Li Si</td><td>19</td><td>F</td><td>92</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td><td>F</td><td>88</td></tr>
    <tr><td>5</td><td>Qian Qi</td><td>21</td><td>M</td><td>95</td></tr>
  </tbody>
</table>
<p>Row-by-row check:</p>
<table>
  <thead><tr><th>name</th><th>age &lt; 20?</th><th>score &gt; 90?</th><th>OR</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>YES</td><td>NO</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Li Si</td><td>YES</td><td>YES</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Wang Wu</td><td>NO</td><td>NO</td><td>NO</td><td>Discard</td></tr>
    <tr><td>Zhao Liu</td><td>YES</td><td>NO</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Qian Qi</td><td>NO</td><td>YES</td><td>YES</td><td>Keep</td></tr>
  </tbody>
</table>

<h3>5.3 NOT — Negate a Condition</h3>
<p>Example: Find "not male"</p>
<pre><code>SELECT name, gender FROM students
WHERE NOT gender = 'M';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>gender</th></tr></thead>
  <tbody>
    <tr><td>Li Si</td><td>F</td></tr>
    <tr><td>Zhao Liu</td><td>F</td></tr>
  </tbody>
</table>
<p>NOT flips the condition. This is the same as <code>gender &lt;&gt; 'M'</code>.</p>

<h3>5.4 Precedence: NOT &gt; AND &gt; OR</h3>
<p>Without parentheses, SQL processes in this order: <strong>NOT first, AND second, OR last.</strong></p>
<pre><code>WHERE age &lt; 20 OR gender = 'F' AND score &gt; 85</code></pre>
<p>SQL actually reads this as:</p>
<pre><code>WHERE age &lt; 20 OR (gender = 'F' AND score &gt; 85)</code></pre>
<p>Not as:</p>
<pre><code>WHERE (age &lt; 20 OR gender = 'F') AND score &gt; 85</code></pre>
<blockquote>Note: When mixing AND and OR, <strong>strongly recommended to add parentheses</strong> to make your intent explicit and avoid precedence surprises.</blockquote>
<p><strong>Clear version</strong></p>
<pre><code>-- Want: under 20, AND female, AND 85+
WHERE (age &lt; 20) AND (gender = 'F') AND (score &gt; 85)

-- Want: (under 20) OR (female AND 85+)
WHERE age &lt; 20 OR (gender = 'F' AND score &gt; 85)</code></pre>

<h2>Part 6 IN / NOT IN — Matching a List</h2>
<p>When you need to check whether a value is <strong>one of several candidates</strong>, using OR gets verbose. <strong>IN</strong> is the cleaner way.</p>

<h3>6.1 Equivalence</h3>
<p>"Find people whose id is 1 or 3 or 5":</p>
<pre><code>-- Verbose
WHERE id = 1 OR id = 3 OR id = 5

-- Elegant
WHERE id IN (1, 3, 5)</code></pre>
<p><strong>Both are completely equivalent</strong>, but IN is shorter and clearer.</p>

<h3>6.2 Numeric List IN</h3>
<p><strong>students table</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>18</td></tr>
    <tr><td>2</td><td>Li Si</td><td>19</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>20</td></tr>
    <tr><td>4</td><td>Zhao Liu</td><td>18</td></tr>
    <tr><td>5</td><td>Qian Qi</td><td>21</td></tr>
  </tbody>
</table>
<pre><code>SELECT * FROM students WHERE id IN (1, 3, 5);</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Zhang San</td><td>18</td></tr>
    <tr><td>3</td><td>Wang Wu</td><td>20</td></tr>
    <tr><td>5</td><td>Qian Qi</td><td>21</td></tr>
  </tbody>
</table>

<h3>6.3 String List IN</h3>
<p><strong>Table: products</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>category</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Apple</td><td>Fruit</td></tr>
    <tr><td>2</td><td>Bread</td><td>Staple</td></tr>
    <tr><td>3</td><td>Milk</td><td>Drink</td></tr>
    <tr><td>4</td><td>Banana</td><td>Fruit</td></tr>
    <tr><td>5</td><td>Cola</td><td>Drink</td></tr>
  </tbody>
</table>
<p><strong>Find "Fruit or Drink"</strong></p>
<pre><code>SELECT * FROM products
WHERE category IN ('Fruit', 'Drink');</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>category</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Apple</td><td>Fruit</td></tr>
    <tr><td>3</td><td>Milk</td><td>Drink</td></tr>
    <tr><td>4</td><td>Banana</td><td>Fruit</td></tr>
    <tr><td>5</td><td>Cola</td><td>Drink</td></tr>
  </tbody>
</table>

<h3>6.4 NOT IN — Not in the List</h3>
<p><strong>Find "neither Fruit nor Drink"</strong></p>
<pre><code>SELECT * FROM products
WHERE category NOT IN ('Fruit', 'Drink');</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>category</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Bread</td><td>Staple</td></tr>
  </tbody>
</table>

<h3>6.5 The NOT IN Trap: NULL</h3>
<p>If the list contains NULL, <strong>NOT IN returns 0 rows</strong>!</p>
<p><strong>Table t</strong></p>
<table>
  <thead><tr><th>id</th><th>value</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>10</td></tr>
    <tr><td>2</td><td>20</td></tr>
    <tr><td>3</td><td>30</td></tr>
  </tbody>
</table>
<pre><code>SELECT * FROM t WHERE id NOT IN (1, 2, NULL);
-- Expected: the row where id=3
-- Actual: 0 rows!</code></pre>
<blockquote>Why: In SQL, <code>id &lt;&gt; NULL</code> is always UNKNOWN (not TRUE or FALSE). NOT IN expands to "id &lt;&gt; 1 AND id &lt;&gt; 2 AND id &lt;&gt; NULL" — that final UNKNOWN makes the whole expression UNKNOWN, so nothing is returned.</blockquote>
<blockquote>Rule: When using NOT IN, <strong>always make sure your list/subquery contains no NULLs</strong>. When in doubt, use <code>NOT EXISTS</code> (Part 23) instead — it doesn't have this problem.</blockquote>

<h3>6.6 IN with a Subquery</h3>
<p>The list after IN can also be the <strong>result of a subquery</strong> (covered in Part 21):</p>
<pre><code>-- Find students in the top 3 by score
SELECT * FROM students
WHERE id IN (
    SELECT id FROM students ORDER BY score DESC LIMIT 3
);</code></pre>

<h2>Part 7 BETWEEN ... AND ... — Range Filter</h2>
<p><strong>BETWEEN x AND y</strong> checks whether a value falls <strong>within a range, inclusive on both ends</strong>.</p>

<h3>7.1 Equivalence</h3>
<pre><code>-- Form 1
WHERE score &gt;= 80 AND score &lt;= 90

-- Form 2 — completely equivalent
WHERE score BETWEEN 80 AND 90</code></pre>
<blockquote>Note: <strong>BETWEEN includes both endpoints</strong>. <code>BETWEEN 80 AND 90</code> is the same as <code>&gt;= 80 AND &lt;= 90</code>, not <code>&gt; 80 AND &lt; 90</code>.</blockquote>

<h3>7.2 Numeric Range</h3>
<p><strong>students table</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Wang Wu</td><td>78</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Qian Qi</td><td>95</td></tr>
    <tr><td>Sun Ba</td><td>60</td></tr>
  </tbody>
</table>
<p><strong>Find students with score 80–90</strong></p>
<pre><code>SELECT * FROM students
WHERE score BETWEEN 80 AND 90;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
  </tbody>
</table>
<p>Row-by-row verification:</p>
<table>
  <thead><tr><th>name</th><th>score</th><th>In [80, 90]?</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Li Si</td><td>92</td><td>NO (&gt;90)</td><td>Discard</td></tr>
    <tr><td>Wang Wu</td><td>78</td><td>NO (&lt;80)</td><td>Discard</td></tr>
    <tr><td>Zhao Liu</td><td>88</td><td>YES</td><td>Keep</td></tr>
    <tr><td>Qian Qi</td><td>95</td><td>NO</td><td>Discard</td></tr>
    <tr><td>Sun Ba</td><td>60</td><td>NO</td><td>Discard</td></tr>
  </tbody>
</table>

<h3>7.3 Date Range</h3>
<p><strong>Table: orders</strong></p>
<table>
  <thead><tr><th>id</th><th>product</th><th>order_date</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Apple</td><td>2024-03-15</td></tr>
    <tr><td>2</td><td>Orange</td><td>2024-04-20</td></tr>
    <tr><td>3</td><td>Banana</td><td>2024-05-10</td></tr>
    <tr><td>4</td><td>Grape</td><td>2024-06-05</td></tr>
    <tr><td>5</td><td>Mango</td><td>2024-08-01</td></tr>
  </tbody>
</table>
<p><strong>Find Q2 2024 orders (April–June)</strong></p>
<pre><code>SELECT * FROM orders
WHERE order_date BETWEEN '2024-04-01' AND '2024-06-30';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>product</th><th>order_date</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Orange</td><td>2024-04-20</td></tr>
    <tr><td>3</td><td>Banana</td><td>2024-05-10</td></tr>
    <tr><td>4</td><td>Grape</td><td>2024-06-05</td></tr>
  </tbody>
</table>

<h3>7.4 NOT BETWEEN</h3>
<p>Find values <strong>outside</strong> the range:</p>
<pre><code>SELECT * FROM students
WHERE score NOT BETWEEN 80 AND 90;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Wang Wu</td><td>78</td></tr>
    <tr><td>Qian Qi</td><td>95</td></tr>
    <tr><td>Sun Ba</td><td>60</td></tr>
  </tbody>
</table>
<blockquote>Note: The order matters — it must be <code>BETWEEN smaller AND larger</code>. Writing <code>BETWEEN 90 AND 80</code> returns 0 rows (it won't auto-swap).</blockquote>

<h2>Part 8 LIKE — Fuzzy String Matching</h2>
<p>Using <code>=</code> on a string only works for <strong>exact matches</strong>. For "contains," "starts with," or "ends with" patterns, use <strong>LIKE</strong> with wildcards.</p>

<h3>8.1 Two Wildcards</h3>
<table>
  <thead><tr><th>Wildcard</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>%</code></td><td>Any number of characters (including zero)</td><td><code>'Li%'</code> matches "Li", "Li Si", "Li Da Bai"</td></tr>
    <tr><td><code>_</code></td><td>Exactly one character</td><td><code>'_i'</code> matches "Li", "Xi" (must be 2 chars)</td></tr>
  </tbody>
</table>

<h3>8.2 Example: Contains a Substring (Most Common)</h3>
<p><strong>Table: books</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>SQL Beginner Tutorial</td></tr>
    <tr><td>2</td><td>Python Programming from Zero to Hero</td></tr>
    <tr><td>3</td><td>Machine Learning in Action</td></tr>
    <tr><td>4</td><td>Advanced SQL Queries</td></tr>
    <tr><td>5</td><td>Java Programming Ideas</td></tr>
  </tbody>
</table>
<p><strong>Find books whose title contains "SQL"</strong></p>
<pre><code>SELECT * FROM books WHERE title LIKE '%SQL%';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>SQL Beginner Tutorial</td></tr>
    <tr><td>4</td><td>Advanced SQL Queries</td></tr>
  </tbody>
</table>
<p>The <code>%</code> on both sides means "SQL" can be anywhere in the string.</p>

<h3>8.3 Example: Starts With</h3>
<p><strong>Find books that start with "Python"</strong></p>
<pre><code>SELECT * FROM books WHERE title LIKE 'Python%';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Python Programming from Zero to Hero</td></tr>
  </tbody>
</table>
<p>Only the right-side <code>%</code> — "Python" must be at the very start.</p>

<h3>8.4 Example: Ends With</h3>
<p><strong>Find books that end with "Action"</strong></p>
<pre><code>SELECT * FROM books WHERE title LIKE '%Action';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>3</td><td>Machine Learning in Action</td></tr>
  </tbody>
</table>

<h3>8.5 Wildcard Quick Reference</h3>
<table>
  <thead><tr><th>Pattern</th><th>Matches</th><th>Does NOT match</th></tr></thead>
  <tbody>
    <tr><td><code>'a%'</code></td><td>apple, ant, a, abc</td><td>banana (doesn't start with a)</td></tr>
    <tr><td><code>'%a'</code></td><td>china, java, sea</td><td>apple (doesn't end with a)</td></tr>
    <tr><td><code>'%a%'</code></td><td>apple, banana, java</td><td>hello (no a)</td></tr>
    <tr><td><code>'_a'</code></td><td>ba, da, ma (exactly 2 chars, 2nd is a)</td><td>aa? YES; abc (3 chars) NO</td></tr>
    <tr><td><code>'a_'</code></td><td>ab, ax (exactly 2 chars starting with a)</td><td>a, abc</td></tr>
    <tr><td><code>'__'</code></td><td>Any 2 characters</td><td>1 char or 3+ chars</td></tr>
    <tr><td><code>'%@gmail%'</code></td><td>Any string containing @gmail</td><td>@qq only</td></tr>
  </tbody>
</table>

<h3>8.6 Exact Length Matching with <code>_</code></h3>
<p><strong>Table: codes</strong></p>
<table>
  <thead><tr><th>code</th></tr></thead>
  <tbody>
    <tr><td>A1</td></tr>
    <tr><td>A12</td></tr>
    <tr><td>B5</td></tr>
    <tr><td>B55</td></tr>
    <tr><td>C9</td></tr>
  </tbody>
</table>
<p><strong>Find codes that are exactly 2 characters</strong></p>
<pre><code>SELECT * FROM codes WHERE code LIKE '__';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>code</th></tr></thead>
  <tbody>
    <tr><td>A1</td></tr>
    <tr><td>B5</td></tr>
    <tr><td>C9</td></tr>
  </tbody>
</table>
<p>Two <code>_</code> = exactly 2 characters. A12 and B55 (3 chars) are excluded.</p>

<h3>8.7 NOT LIKE — Exclude a Pattern</h3>
<p><strong>Find books that do NOT contain "SQL"</strong></p>
<pre><code>SELECT * FROM books WHERE title NOT LIKE '%SQL%';</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Python Programming from Zero to Hero</td></tr>
    <tr><td>3</td><td>Machine Learning in Action</td></tr>
    <tr><td>5</td><td>Java Programming Ideas</td></tr>
  </tbody>
</table>

<h3>8.8 Case Sensitivity</h3>
<blockquote>Tip: MySQL's <code>LIKE</code> is <strong>case-insensitive by default</strong> — <code>'%sql%'</code> also matches "SQL" and "Sql". PostgreSQL is <strong>case-sensitive by default</strong>; use <code>ILIKE</code> there instead.</blockquote>

<h2>Part 9 IS NULL / IS NOT NULL — Checking for Empty Values</h2>
<p><strong>NULL</strong> is a special value in SQL meaning "unknown" or "missing." It is <strong>not 0, not an empty string, and not false</strong>.</p>

<h3>9.1 NULL Behavior</h3>
<table>
  <thead><tr><th>Expression</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td><code>NULL = NULL</code></td><td>UNKNOWN (not TRUE!)</td></tr>
    <tr><td><code>NULL = 5</code></td><td>UNKNOWN</td></tr>
    <tr><td><code>NULL &lt;&gt; NULL</code></td><td>UNKNOWN</td></tr>
    <tr><td><code>NULL + 100</code></td><td>NULL</td></tr>
    <tr><td><code>NULL OR TRUE</code></td><td>TRUE</td></tr>
    <tr><td><code>NULL AND TRUE</code></td><td>UNKNOWN</td></tr>
  </tbody>
</table>
<blockquote>Error: NULL cannot be compared with <code>=</code>! <code>WHERE x = NULL</code> always returns 0 rows (the result is UNKNOWN, which WHERE treats as false). You must use <code>IS NULL</code> or <code>IS NOT NULL</code>.</blockquote>

<h3>9.2 IS NULL — Find Null Values</h3>
<p><strong>Table: employees</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>manager_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>CEO Zhang</td><td>NULL</td></tr>
    <tr><td>2</td><td>Manager Li</td><td>1</td></tr>
    <tr><td>3</td><td>Lead Wang</td><td>2</td></tr>
    <tr><td>4</td><td>Staff Zhao</td><td>3</td></tr>
    <tr><td>5</td><td>Consultant Sun</td><td>NULL</td></tr>
  </tbody>
</table>
<p>A NULL manager_id means <strong>no superior</strong> (top-level person).</p>
<p><strong>Find employees with no manager</strong></p>
<pre><code>SELECT * FROM employees WHERE manager_id IS NULL;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>manager_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>CEO Zhang</td><td>NULL</td></tr>
    <tr><td>5</td><td>Consultant Sun</td><td>NULL</td></tr>
  </tbody>
</table>

<h3>9.3 IS NOT NULL — Find Non-Null Values</h3>
<p><strong>Find employees who have a manager</strong></p>
<pre><code>SELECT * FROM employees WHERE manager_id IS NOT NULL;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>manager_id</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Manager Li</td><td>1</td></tr>
    <tr><td>3</td><td>Lead Wang</td><td>2</td></tr>
    <tr><td>4</td><td>Staff Zhao</td><td>3</td></tr>
  </tbody>
</table>

<h3>9.4 Common Bug Comparison</h3>
<blockquote>Wrong: <code>WHERE manager_id = NULL</code><br>Result: <strong>0 rows</strong>, no matter what (because = NULL is never true).</blockquote>
<blockquote>Correct: <code>WHERE manager_id IS NULL</code><br>Result: returns all rows where manager_id is NULL.</blockquote>

<h3>9.5 NULL Propagates Through Arithmetic</h3>
<p><strong>Table: sales</strong></p>
<table>
  <thead><tr><th>id</th><th>price</th><th>discount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td><td>10</td></tr>
    <tr><td>2</td><td>200</td><td>NULL</td></tr>
    <tr><td>3</td><td>150</td><td>5</td></tr>
  </tbody>
</table>
<p><strong>Calculate final price</strong></p>
<pre><code>SELECT id, price, discount, price - discount AS final
FROM sales;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>id</th><th>price</th><th>discount</th><th>final</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td><td>10</td><td>90</td></tr>
    <tr><td>2</td><td>200</td><td>NULL</td><td>NULL</td></tr>
    <tr><td>3</td><td>150</td><td>5</td><td>145</td></tr>
  </tbody>
</table>
<p>Row id=2 has a NULL discount, so 200 - NULL is still NULL. Use <strong>COALESCE</strong> (Part 24) to replace NULL with 0 before computing.</p>

<h2>Part 10 ORDER BY — Sorting</h2>
<p>The order of SELECT results is <strong>not guaranteed</strong>. To display them in a specific order, use <strong>ORDER BY</strong>.</p>

<h3>10.1 Ascending (Default)</h3>
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
<p><strong>Sort by score ascending</strong></p>
<pre><code>SELECT * FROM students ORDER BY score;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Wang Wu</td><td>78</td></tr>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Qian Qi</td><td>95</td></tr>
  </tbody>
</table>
<p>Low to high. When you omit ASC/DESC, it defaults to ASC (ascending).</p>

<h3>10.2 Descending</h3>
<pre><code>SELECT * FROM students ORDER BY score DESC;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Qian Qi</td><td>95</td></tr>
    <tr><td>Li Si</td><td>92</td></tr>
    <tr><td>Zhao Liu</td><td>88</td></tr>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Wang Wu</td><td>78</td></tr>
  </tbody>
</table>
<p>DESC = descending = high to low.</p>
<blockquote>Tip: Memory trick:
· ASC = ascending = small → large (default)
· DESC = descending = large → small</blockquote>

<h3>10.3 Multi-Column Sort</h3>
<p>When one key isn't enough to break ties, add a second key.</p>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>name</th><th>class</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>A</td><td>85</td></tr>
    <tr><td>Li Si</td><td>B</td><td>92</td></tr>
    <tr><td>Wang Wu</td><td>A</td><td>78</td></tr>
    <tr><td>Zhao Liu</td><td>A</td><td>85</td></tr>
    <tr><td>Qian Qi</td><td>B</td><td>85</td></tr>
  </tbody>
</table>
<p><strong>Sort by class ascending, then score descending within each class</strong></p>
<pre><code>SELECT * FROM students
ORDER BY class ASC, score DESC;</code></pre>
<p><strong>Output</strong></p>
<table>
  <thead><tr><th>name</th><th>class</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>A</td><td>85</td></tr>
    <tr><td>Zhao Liu</td><td>A</td><td>85</td></tr>
    <tr><td>Wang Wu</td><td>A</td><td>78</td></tr>
    <tr><td>Li Si</td><td>B</td><td>92</td></tr>
    <tr><td>Qian Qi</td><td>B</td><td>85</td></tr>
  </tbody>
</table>
<p>All class-A first (sorted by score descending), then class-B. <strong>Comma-separated sort keys; earlier keys have higher priority.</strong></p>

<h3>10.4 NULL in Sort Order</h3>
<p><strong>Original table</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Li Si</td><td>NULL</td></tr>
    <tr><td>Wang Wu</td><td>92</td></tr>
    <tr><td>Zhao Liu</td><td>NULL</td></tr>
  </tbody>
</table>
<p>In MySQL, ASC puts NULL <strong>first</strong>; DESC puts NULL <strong>last</strong>.</p>
<p><strong>ORDER BY score ASC (default)</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Li Si</td><td>NULL</td></tr>
    <tr><td>Zhao Liu</td><td>NULL</td></tr>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Wang Wu</td><td>92</td></tr>
  </tbody>
</table>
<p><strong>ORDER BY score DESC</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>Wang Wu</td><td>92</td></tr>
    <tr><td>Zhang San</td><td>85</td></tr>
    <tr><td>Li Si</td><td>NULL</td></tr>
    <tr><td>Zhao Liu</td><td>NULL</td></tr>
  </tbody>
</table>

<h3>10.5 Tip: Sort by Expression</h3>
<p>ORDER BY doesn't have to be a column name — it can be a <strong>computed expression</strong>:</p>
<pre><code>SELECT name, price, discount
FROM products
ORDER BY (price - discount) DESC;</code></pre>
<p>Sort by "effective price" high to low, without showing that value as a column.</p>

<h3>10.6 Tip: Custom Sort Order</h3>
<p>CASE WHEN (Part 25) can put specific values first:</p>
<p><strong>VIP users first, then by registration date</strong></p>
<pre><code>SELECT * FROM users
ORDER BY
    CASE WHEN level = 'VIP' THEN 0 ELSE 1 END,
    register_date;</code></pre>
<p>VIP users get 0, others get 1. Sort by that first (0 comes first), then by registration date as a tiebreaker.</p>
`;
