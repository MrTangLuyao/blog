/* Post body — sql-syntax-guide-1 / zh */

(window.__BLOG_POSTS = window.__BLOG_POSTS || {})['sql-syntax-guide-1:zh'] = `
<p class="lead">SQL 语法大全 · 用例子学 SQL。每个语法都用「输入表 → SQL → 输出表」三段对照，充足例子 · 详细解释 · 实用技巧。本篇涵盖 Part 1–10：SELECT、FROM、WHERE、比较运算符、AND/OR/NOT、IN/NOT IN、BETWEEN、LIKE、IS NULL、ORDER BY。</p>

<h2>Part 1 SELECT —— 选哪些列</h2>
<p><strong>SELECT</strong> 是 SQL 中<strong>最重要</strong>的关键字，作用是<strong>从表里挑出你想看的列</strong>。不管查询多复杂，开头第一个词几乎总是 SELECT。</p>

<h3>1.1 基本用法</h3>
<p>假设有一张 students 表（学生信息）：</p>
<p><strong>原始表 students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>18</td><td>男</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>19</td><td>女</td><td>92</td></tr>
    <tr><td>3</td><td>王五</td><td>20</td><td>男</td><td>78</td></tr>
    <tr><td>4</td><td>赵六</td><td>18</td><td>女</td><td>88</td></tr>
  </tbody>
</table>

<p>用法 A：选所有列（用 <code>*</code>）</p>
<pre><code>SELECT * FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>18</td><td>男</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>19</td><td>女</td><td>92</td></tr>
    <tr><td>3</td><td>王五</td><td>20</td><td>男</td><td>78</td></tr>
    <tr><td>4</td><td>赵六</td><td>18</td><td>女</td><td>88</td></tr>
  </tbody>
</table>
<p>结果<strong>和原表完全一样</strong>。<code>*</code> = 所有列。</p>

<p>用法 B：只选特定列</p>
<pre><code>SELECT name, score FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>王五</td><td>78</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
  </tbody>
</table>
<p>只显示 name 和 score 两列，<strong>其他列被隐藏</strong>。注意原表行数没变，还是 4 行。</p>

<p>用法 C：列的顺序由你决定</p>
<pre><code>SELECT score, name FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>score</th><th>name</th></tr></thead>
  <tbody>
    <tr><td>85</td><td>张三</td></tr>
    <tr><td>92</td><td>李四</td></tr>
    <tr><td>78</td><td>王五</td></tr>
    <tr><td>88</td><td>赵六</td></tr>
  </tbody>
</table>
<p>列的顺序就是 SELECT 后写的顺序，score 在前 name 在后。</p>

<h3>1.2 SELECT 里能放计算表达式</h3>
<p>SELECT 后面不仅可以是列名，还可以是<strong>表达式</strong>。</p>
<pre><code>SELECT name, score, score + 10, score * 1.1
FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th><th>score + 10</th><th>score * 1.1</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td><td>95</td><td>93.5</td></tr>
    <tr><td>李四</td><td>92</td><td>102</td><td>101.2</td></tr>
    <tr><td>王五</td><td>78</td><td>88</td><td>85.8</td></tr>
    <tr><td>赵六</td><td>88</td><td>98</td><td>96.8</td></tr>
  </tbody>
</table>
<p>每行的 score 自动加 10、乘 1.1 算出来。<strong>原表没改</strong>，只是查询结果显示了新算出来的值。</p>
<blockquote>注意 运算后的列名很难看（直接是 <code>score + 10</code>），通常会用 <code>AS</code> 起个好看的别名。详见 Part 13。</blockquote>

<h3>1.3 SELECT 常量</h3>
<p>你甚至能 SELECT 一个固定值，每行都显示这个值：</p>
<pre><code>SELECT name, '是学生' FROM students;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>'是学生'</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>是学生</td></tr>
    <tr><td>李四</td><td>是学生</td></tr>
    <tr><td>王五</td><td>是学生</td></tr>
    <tr><td>赵六</td><td>是学生</td></tr>
  </tbody>
</table>
<p>这个用法不常单独用，但配合 UNION 等场景很有用。</p>

<h2>Part 2 FROM —— 从哪张表</h2>
<p><strong>FROM</strong> 告诉数据库「<strong>从哪张表里查</strong>」。它紧跟在 SELECT 之后。每个 SELECT 必须配一个 FROM。</p>

<h3>2.1 基本格式</h3>
<pre><code>SELECT 列名 FROM 表名;</code></pre>
<p>它就这一个作用：<strong>指定数据源</strong>。多简单。</p>

<h3>2.2 FROM 后面可以是多张表</h3>
<p>FROM 后面写多张表（用逗号），SQL 会做<strong>笛卡尔积</strong>（每一行 × 每一行），但这种写法很少用，通常我们用 JOIN（Part 14、15）来连接多表。</p>
<p>演示一下笛卡尔积是什么。两张小表：</p>
<p><strong>表 A：colors</strong></p>
<table>
  <thead><tr><th>color</th></tr></thead>
  <tbody>
    <tr><td>红</td></tr>
    <tr><td>蓝</td></tr>
  </tbody>
</table>
<p><strong>表 B：sizes</strong></p>
<table>
  <thead><tr><th>size</th></tr></thead>
  <tbody>
    <tr><td>S</td></tr>
    <tr><td>M</td></tr>
    <tr><td>L</td></tr>
  </tbody>
</table>
<pre><code>SELECT * FROM colors, sizes;</code></pre>
<p><strong>输出：2 × 3 = 6 行（笛卡尔积）</strong></p>
<table>
  <thead><tr><th>color</th><th>size</th></tr></thead>
  <tbody>
    <tr><td>红</td><td>S</td></tr>
    <tr><td>红</td><td>M</td></tr>
    <tr><td>红</td><td>L</td></tr>
    <tr><td>蓝</td><td>S</td></tr>
    <tr><td>蓝</td><td>M</td></tr>
    <tr><td>蓝</td><td>L</td></tr>
  </tbody>
</table>
<p>每个 color 都和每个 size 配对一次。这种笛卡尔积本身用处不大，但理解它有助于理解 JOIN。</p>

<h3>2.3 FROM 后面可以加表别名</h3>
<p>给表起个短名字，后面引用更方便：</p>
<pre><code>SELECT s.name, s.score FROM students AS s;
-- 或者省略 AS
SELECT s.name, s.score FROM students s;</code></pre>
<p>两种写法等价。<strong>s</strong> 就是 students 的别名。</p>
<blockquote>提示 单表查询其实用不到表别名。别名主要在<strong>多表 JOIN</strong> 时方便，避免反复写完整表名。</blockquote>

<h2>Part 3 WHERE —— 筛选行</h2>
<p>光会 SELECT + FROM 还不够，那只能取出<strong>所有行</strong>。<strong>WHERE</strong> 让你<strong>挑出满足条件的行</strong>，扔掉其他。</p>

<h3>3.1 一句话理解</h3>
<blockquote>SELECT 决定<strong>显示哪些列</strong>，WHERE 决定<strong>显示哪些行</strong>。</blockquote>

<h3>3.2 用一个例子彻底理解</h3>
<p>继续用 students 表：</p>
<p><strong>原始表 students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>18</td><td>男</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>19</td><td>女</td><td>92</td></tr>
    <tr><td>3</td><td>王五</td><td>20</td><td>男</td><td>78</td></tr>
    <tr><td>4</td><td>赵六</td><td>18</td><td>女</td><td>88</td></tr>
    <tr><td>5</td><td>钱七</td><td>21</td><td>男</td><td>95</td></tr>
  </tbody>
</table>

<p>例 1：找成绩 ≥ 85 的人</p>
<pre><code>SELECT name, score FROM students
WHERE score >= 85;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>钱七</td><td>95</td></tr>
  </tbody>
</table>
<p>一行一行检查：</p>
<table>
  <thead><tr><th>name</th><th>score</th><th>满足 score ≥ 85？</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td><td>YES (85 ≥ 85)</td><td>保留</td></tr>
    <tr><td>李四</td><td>92</td><td>YES</td><td>保留</td></tr>
    <tr><td>王五</td><td>78</td><td>NO</td><td>扔掉</td></tr>
    <tr><td>赵六</td><td>88</td><td>YES</td><td>保留</td></tr>
    <tr><td>钱七</td><td>95</td><td>YES</td><td>保留</td></tr>
  </tbody>
</table>

<p>例 2：找女生</p>
<pre><code>SELECT * FROM students
WHERE gender = '女';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>李四</td><td>19</td><td>女</td><td>92</td></tr>
    <tr><td>4</td><td>赵六</td><td>18</td><td>女</td><td>88</td></tr>
  </tbody>
</table>
<p>字符串值要用单引号 <code>'女'</code> 包起来，数字不用。</p>

<p>例 3：找年龄正好 18 岁的人</p>
<pre><code>SELECT name, age FROM students
WHERE age = 18;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>age</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>18</td></tr>
    <tr><td>赵六</td><td>18</td></tr>
  </tbody>
</table>
<blockquote>注意 SQL 的等号是<strong>单个 <code>=</code></strong>，不是 <code>==</code>。这跟 Python、Java 等不一样，刚学常出错。</blockquote>

<h3>3.3 不写 WHERE 会怎样？</h3>
<p>不写 WHERE 就是<strong>所有行都返回</strong>，等于没过滤。也就是说 WHERE 是<strong>可选的</strong>。但实战中绝大多数 SELECT 都带 WHERE。</p>

<h2>Part 4 比较运算符（=, &lt;&gt;, &gt;, &lt;, &gt;=, &lt;=）</h2>
<p>在 WHERE 里能用的<strong>比较运算符</strong>有 6 个：</p>
<table>
  <thead><tr><th>运算符</th><th>含义</th><th>示例</th><th>解释</th></tr></thead>
  <tbody>
    <tr><td><code>=</code></td><td>等于</td><td><code>age = 18</code></td><td>正好 18 岁</td></tr>
    <tr><td><code>&lt;&gt;</code></td><td>不等于</td><td><code>gender &lt;&gt; '男'</code></td><td>不是男生（也可以写 <code>!=</code>）</td></tr>
    <tr><td><code>&gt;</code></td><td>大于</td><td><code>score &gt; 90</code></td><td>成绩 &gt; 90（不含 90）</td></tr>
    <tr><td><code>&lt;</code></td><td>小于</td><td><code>age &lt; 20</code></td><td>不到 20 岁</td></tr>
    <tr><td><code>&gt;=</code></td><td>大于等于</td><td><code>score &gt;= 85</code></td><td>85 分及以上</td></tr>
    <tr><td><code>&lt;=</code></td><td>小于等于</td><td><code>age &lt;= 18</code></td><td>18 岁及以下</td></tr>
  </tbody>
</table>

<h3>4.1 不等于的两种写法</h3>
<p><code>&lt;&gt;</code> 和 <code>!=</code> <strong>完全等价</strong>。SQL 标准是 <code>&lt;&gt;</code>，但大多数数据库也支持 <code>!=</code>。</p>
<p><strong>students 表</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>gender</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>男</td></tr>
    <tr><td>2</td><td>李四</td><td>女</td></tr>
    <tr><td>3</td><td>王五</td><td>男</td></tr>
  </tbody>
</table>
<p><strong>SQL（两种写法等价）</strong></p>
<pre><code>-- 写法 1（推荐）
SELECT name FROM students WHERE gender &lt;&gt; '男';

-- 写法 2
SELECT name FROM students WHERE gender != '男';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th></tr></thead>
  <tbody>
    <tr><td>李四</td></tr>
  </tbody>
</table>

<h3>4.2 字符串也能比较大小</h3>
<p>字符串可以用 <code>&gt;</code>、<code>&lt;</code> 比较，<strong>按字典顺序</strong>。</p>
<pre><code>SELECT * FROM students WHERE name &gt;= '王';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>gender</th></tr></thead>
  <tbody>
    <tr><td>3</td><td>王五</td><td>男</td></tr>
  </tbody>
</table>
<p>「张」和「李」按拼音/Unicode 在「王」之前，所以被排除。不过字符串比大小用得不多，常用的是 LIKE（Part 8）。</p>

<h3>4.3 日期也能比较</h3>
<p><strong>表 events</strong></p>
<table>
  <thead><tr><th>id</th><th>event</th><th>date</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>注册</td><td>2024-01-15</td></tr>
    <tr><td>2</td><td>登录</td><td>2024-03-20</td></tr>
    <tr><td>3</td><td>购买</td><td>2024-05-10</td></tr>
    <tr><td>4</td><td>退款</td><td>2024-07-01</td></tr>
  </tbody>
</table>
<p><strong>找 2024-04 之前的事件</strong></p>
<pre><code>SELECT * FROM events WHERE date &lt; '2024-04-01';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>event</th><th>date</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>注册</td><td>2024-01-15</td></tr>
    <tr><td>2</td><td>登录</td><td>2024-03-20</td></tr>
  </tbody>
</table>
<p>日期用<strong>单引号</strong>包起来，格式 <code>'YYYY-MM-DD'</code>。</p>

<h2>Part 5 AND / OR / NOT —— 条件组合</h2>
<p>当 WHERE 需要<strong>多个条件</strong>时，用 AND、OR、NOT 组合。</p>
<table>
  <thead><tr><th>关键字</th><th>含义</th><th>什么时候用</th></tr></thead>
  <tbody>
    <tr><td><strong>AND</strong></td><td>同时满足</td><td>所有条件都要满足才保留</td></tr>
    <tr><td><strong>OR</strong></td><td>任一满足</td><td>至少满足一个就保留</td></tr>
    <tr><td><strong>NOT</strong></td><td>取反</td><td>条件原本为真，取反后为假</td></tr>
  </tbody>
</table>

<h3>5.1 AND —— 两个条件都要满足</h3>
<p><strong>原表 students</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>18</td><td>男</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>19</td><td>女</td><td>92</td></tr>
    <tr><td>3</td><td>王五</td><td>20</td><td>男</td><td>78</td></tr>
    <tr><td>4</td><td>赵六</td><td>18</td><td>女</td><td>88</td></tr>
    <tr><td>5</td><td>钱七</td><td>21</td><td>男</td><td>95</td></tr>
  </tbody>
</table>
<p>例：找「18 岁的女生」</p>
<pre><code>SELECT * FROM students
WHERE age = 18 AND gender = '女';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>4</td><td>赵六</td><td>18</td><td>女</td><td>88</td></tr>
  </tbody>
</table>
<p>一行一行验证：</p>
<table>
  <thead><tr><th>name</th><th>age = 18?</th><th>gender = '女'?</th><th>AND</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>YES</td><td>NO</td><td>NO</td><td>扔</td></tr>
    <tr><td>李四</td><td>NO</td><td>YES</td><td>NO</td><td>扔</td></tr>
    <tr><td>王五</td><td>NO</td><td>NO</td><td>NO</td><td>扔</td></tr>
    <tr><td>赵六</td><td>YES</td><td>YES</td><td>YES</td><td>留</td></tr>
    <tr><td>钱七</td><td>NO</td><td>NO</td><td>NO</td><td>扔</td></tr>
  </tbody>
</table>
<p><strong>AND 像「与门」</strong>：两个输入都为真，输出才为真。</p>

<h3>5.2 OR —— 任一满足即可</h3>
<p>例：找「20 岁以下 OR 90 分以上」</p>
<pre><code>SELECT * FROM students
WHERE age &lt; 20 OR score &gt; 90;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th><th>gender</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>18</td><td>男</td><td>85</td></tr>
    <tr><td>2</td><td>李四</td><td>19</td><td>女</td><td>92</td></tr>
    <tr><td>4</td><td>赵六</td><td>18</td><td>女</td><td>88</td></tr>
    <tr><td>5</td><td>钱七</td><td>21</td><td>男</td><td>95</td></tr>
  </tbody>
</table>
<p>每一行检查：</p>
<table>
  <thead><tr><th>name</th><th>age &lt; 20?</th><th>score &gt; 90?</th><th>OR</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>YES</td><td>NO</td><td>YES</td><td>留</td></tr>
    <tr><td>李四</td><td>YES</td><td>YES</td><td>YES</td><td>留</td></tr>
    <tr><td>王五</td><td>NO</td><td>NO</td><td>NO</td><td>扔</td></tr>
    <tr><td>赵六</td><td>YES</td><td>NO</td><td>YES</td><td>留</td></tr>
    <tr><td>钱七</td><td>NO</td><td>YES</td><td>YES</td><td>留</td></tr>
  </tbody>
</table>

<h3>5.3 NOT —— 把条件反过来</h3>
<p>例：找「不是男生」的人</p>
<pre><code>SELECT name, gender FROM students
WHERE NOT gender = '男';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>gender</th></tr></thead>
  <tbody>
    <tr><td>李四</td><td>女</td></tr>
    <tr><td>赵六</td><td>女</td></tr>
  </tbody>
</table>
<p>NOT 把后面的条件取反。其实和 <code>gender &lt;&gt; '男'</code> 一样。</p>

<h3>5.4 优先级：NOT &gt; AND &gt; OR</h3>
<p>混用时如果不加括号，SQL 默认按这个顺序处理：</p>
<p><strong>NOT 最高，AND 次之，OR 最低。</strong></p>
<p>看一个迷惑性的例子：</p>
<pre><code>WHERE age &lt; 20 OR gender = '女' AND score &gt; 85</code></pre>
<p>SQL 实际理解为：</p>
<pre><code>WHERE age &lt; 20 OR (gender = '女' AND score &gt; 85)</code></pre>
<p>而不是：</p>
<pre><code>WHERE (age &lt; 20 OR gender = '女') AND score &gt; 85</code></pre>
<blockquote>注意 混用 AND 和 OR 时，<strong>强烈建议加括号</strong>，让意图明确，避免被优先级坑了。括号可以让 SQL 不再有歧义。</blockquote>
<p><strong>清晰版</strong></p>
<pre><code>-- 想要：不到 20 岁，且要女生，且 85+
WHERE (age &lt; 20) AND (gender = '女') AND (score &gt; 85)

-- 想要：（不到 20 岁）或者（女生且 85+）
WHERE age &lt; 20 OR (gender = '女' AND score &gt; 85)</code></pre>

<h2>Part 6 IN / NOT IN —— 在列表中</h2>
<p>当你要判断一个值<strong>是不是在多个候选值之一</strong>时，用 OR 写起来很啰嗦。<strong>IN</strong> 是更优雅的写法。</p>

<h3>6.1 等价对比</h3>
<p>「找 id 是 1 或 3 或 5 的人」：</p>
<pre><code>-- 啰嗦写法
WHERE id = 1 OR id = 3 OR id = 5

-- 优雅写法
WHERE id IN (1, 3, 5)</code></pre>
<p><strong>两者完全等价</strong>，但 IN 更短更清晰。</p>

<h3>6.2 数字列表 IN</h3>
<p><strong>students 表</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>18</td></tr>
    <tr><td>2</td><td>李四</td><td>19</td></tr>
    <tr><td>3</td><td>王五</td><td>20</td></tr>
    <tr><td>4</td><td>赵六</td><td>18</td></tr>
    <tr><td>5</td><td>钱七</td><td>21</td></tr>
  </tbody>
</table>
<pre><code>SELECT * FROM students WHERE id IN (1, 3, 5);</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>age</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张三</td><td>18</td></tr>
    <tr><td>3</td><td>王五</td><td>20</td></tr>
    <tr><td>5</td><td>钱七</td><td>21</td></tr>
  </tbody>
</table>

<h3>6.3 字符串列表 IN</h3>
<p><strong>表 products</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>category</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>苹果</td><td>水果</td></tr>
    <tr><td>2</td><td>面包</td><td>主食</td></tr>
    <tr><td>3</td><td>牛奶</td><td>饮品</td></tr>
    <tr><td>4</td><td>香蕉</td><td>水果</td></tr>
    <tr><td>5</td><td>可乐</td><td>饮品</td></tr>
  </tbody>
</table>
<p><strong>找「水果或饮品」</strong></p>
<pre><code>SELECT * FROM products
WHERE category IN ('水果', '饮品');</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>category</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>苹果</td><td>水果</td></tr>
    <tr><td>3</td><td>牛奶</td><td>饮品</td></tr>
    <tr><td>4</td><td>香蕉</td><td>水果</td></tr>
    <tr><td>5</td><td>可乐</td><td>饮品</td></tr>
  </tbody>
</table>

<h3>6.4 NOT IN —— 不在列表中</h3>
<p><strong>找「不是水果也不是饮品」的</strong></p>
<pre><code>SELECT * FROM products
WHERE category NOT IN ('水果', '饮品');</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>category</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>面包</td><td>主食</td></tr>
  </tbody>
</table>

<h3>6.5 NOT IN 的大坑：NULL</h3>
<p>如果列表里包含 NULL，<strong>NOT IN 会出错</strong>（返回 0 行）！</p>
<p><strong>表 t</strong></p>
<table>
  <thead><tr><th>id</th><th>value</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>10</td></tr>
    <tr><td>2</td><td>20</td></tr>
    <tr><td>3</td><td>30</td></tr>
  </tbody>
</table>
<pre><code>SELECT * FROM t WHERE id NOT IN (1, 2, NULL);
-- 直觉：返回 id=3 那行
-- 实际：返回 0 行！</code></pre>
<blockquote>错误 原因：SQL 中 <code>id &lt;&gt; NULL</code> 永远是 UNKNOWN（不是 TRUE 也不是 FALSE）。NOT IN 实际等价于「id &lt;&gt; 1 AND id &lt;&gt; 2 AND id &lt;&gt; NULL」，最后那个 UNKNOWN 让整个表达式变 UNKNOWN，结果不返回。</blockquote>
<blockquote>正确 记住一条：<strong>用 NOT IN 时，必须确保查询/列表里没有 NULL</strong>。不放心就改用 <code>NOT EXISTS</code>（Part 23），它没有这个问题。</blockquote>

<h3>6.6 IN 配子查询</h3>
<p>IN 的列表也可以是<strong>子查询</strong>的结果（Part 21 详讲）：</p>
<pre><code>-- 找成绩排名前 3 的学生 id
SELECT * FROM students
WHERE id IN (
    SELECT id FROM students ORDER BY score DESC LIMIT 3
);</code></pre>

<h2>Part 7 BETWEEN ... AND ... —— 范围筛选</h2>
<p><strong>BETWEEN x AND y</strong> 用于判断<strong>在某个范围内，包含两端</strong>。</p>

<h3>7.1 等价对比</h3>
<pre><code>-- 写法 1
WHERE score &gt;= 80 AND score &lt;= 90

-- 写法 2 完全等价
WHERE score BETWEEN 80 AND 90</code></pre>
<blockquote>注意 <strong>BETWEEN 包含两端</strong>。<code>BETWEEN 80 AND 90</code> 等价于 <code>&gt;= 80 AND &lt;= 90</code>，不是 <code>&gt; 80 AND &lt; 90</code>。</blockquote>

<h3>7.2 数字范围</h3>
<p><strong>students 表</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>王五</td><td>78</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>钱七</td><td>95</td></tr>
    <tr><td>孙八</td><td>60</td></tr>
  </tbody>
</table>
<p><strong>找成绩 80~90 的人</strong></p>
<pre><code>SELECT * FROM students
WHERE score BETWEEN 80 AND 90;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
  </tbody>
</table>
<p>每行验证：</p>
<table>
  <thead><tr><th>name</th><th>score</th><th>在 [80, 90] 之间？</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td><td>YES</td><td>留</td></tr>
    <tr><td>李四</td><td>92</td><td>NO (&gt;90)</td><td>扔</td></tr>
    <tr><td>王五</td><td>78</td><td>NO (&lt;80)</td><td>扔</td></tr>
    <tr><td>赵六</td><td>88</td><td>YES</td><td>留</td></tr>
    <tr><td>钱七</td><td>95</td><td>NO</td><td>扔</td></tr>
    <tr><td>孙八</td><td>60</td><td>NO</td><td>扔</td></tr>
  </tbody>
</table>

<h3>7.3 日期范围</h3>
<p><strong>表 orders</strong></p>
<table>
  <thead><tr><th>id</th><th>product</th><th>order_date</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>苹果</td><td>2024-03-15</td></tr>
    <tr><td>2</td><td>橙子</td><td>2024-04-20</td></tr>
    <tr><td>3</td><td>香蕉</td><td>2024-05-10</td></tr>
    <tr><td>4</td><td>葡萄</td><td>2024-06-05</td></tr>
    <tr><td>5</td><td>芒果</td><td>2024-08-01</td></tr>
  </tbody>
</table>
<p><strong>找 2024 第二季度（4-6 月）的订单</strong></p>
<pre><code>SELECT * FROM orders
WHERE order_date BETWEEN '2024-04-01' AND '2024-06-30';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>product</th><th>order_date</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>橙子</td><td>2024-04-20</td></tr>
    <tr><td>3</td><td>香蕉</td><td>2024-05-10</td></tr>
    <tr><td>4</td><td>葡萄</td><td>2024-06-05</td></tr>
  </tbody>
</table>

<h3>7.4 NOT BETWEEN</h3>
<p>反过来，找<strong>不在</strong>这个范围内的：</p>
<pre><code>SELECT * FROM students
WHERE score NOT BETWEEN 80 AND 90;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>王五</td><td>78</td></tr>
    <tr><td>钱七</td><td>95</td></tr>
    <tr><td>孙八</td><td>60</td></tr>
  </tbody>
</table>
<blockquote>注意 注意顺序：必须是 <code>BETWEEN 小 AND 大</code>。写成 <code>BETWEEN 90 AND 80</code> 会得到 0 行（不会自动调整）。</blockquote>

<h2>Part 8 LIKE —— 字符串模糊匹配</h2>
<p>用 <code>=</code> 比字符串只能<strong>完全匹配</strong>。要做「包含」、「开头」、「结尾」这种模糊匹配，得用 <strong>LIKE</strong> 配通配符。</p>

<h3>8.1 两个通配符</h3>
<table>
  <thead><tr><th>通配符</th><th>含义</th><th>示例</th></tr></thead>
  <tbody>
    <tr><td><code>%</code></td><td>任意多个字符（包括 0 个）</td><td><code>'李%'</code> 匹配「李」「李四」「李大白」</td></tr>
    <tr><td><code>_</code></td><td>恰好 1 个字符（一个下划线 = 1 个字符）</td><td><code>'_四'</code> 匹配「李四」「张四」（必须 2 个字）</td></tr>
  </tbody>
</table>

<h3>8.2 用例：包含某段（最常用）</h3>
<p><strong>表 books</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>SQL 入门教程</td></tr>
    <tr><td>2</td><td>Python 编程从入门到精通</td></tr>
    <tr><td>3</td><td>机器学习实战</td></tr>
    <tr><td>4</td><td>SQL 高级查询</td></tr>
    <tr><td>5</td><td>Java 编程思想</td></tr>
  </tbody>
</table>
<p><strong>找标题包含「SQL」的书</strong></p>
<pre><code>SELECT * FROM books WHERE title LIKE '%SQL%';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>SQL 入门教程</td></tr>
    <tr><td>4</td><td>SQL 高级查询</td></tr>
  </tbody>
</table>
<p>两边 <code>%</code> 表示「SQL」前后可以有任意字符，所以包含 SQL 的都被找到。</p>

<h3>8.3 用例：以某段开头</h3>
<p><strong>找标题以「Python」开头的</strong></p>
<pre><code>SELECT * FROM books WHERE title LIKE 'Python%';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Python 编程从入门到精通</td></tr>
  </tbody>
</table>
<p>只有右边 <code>%</code> —— 表示「Python」必须在最前面。</p>

<h3>8.4 用例：以某段结尾</h3>
<p><strong>找标题以「实战」结尾的</strong></p>
<pre><code>SELECT * FROM books WHERE title LIKE '%实战';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>3</td><td>机器学习实战</td></tr>
  </tbody>
</table>

<h3>8.5 通配符表 —— 一眼看懂</h3>
<table>
  <thead><tr><th>模式</th><th>能匹配</th><th>不能匹配</th></tr></thead>
  <tbody>
    <tr><td><code>'a%'</code></td><td>apple, ant, a, abc</td><td>banana（不是 a 开头）</td></tr>
    <tr><td><code>'%a'</code></td><td>china, java, sea</td><td>apple（不是 a 结尾）</td></tr>
    <tr><td><code>'%a%'</code></td><td>apple, banana, java</td><td>hello（没有 a）</td></tr>
    <tr><td><code>'_a'</code></td><td>ba, da, ma（恰好 2 字符且第 2 个是 a）</td><td>aa? YES; abc(3字符) NO</td></tr>
    <tr><td><code>'a_'</code></td><td>ab, ax（恰好 2 字符 a 开头）</td><td>a, abc</td></tr>
    <tr><td><code>'__'</code></td><td>任意 2 个字符</td><td>1 字符或 3+ 字符</td></tr>
    <tr><td><code>'%@gmail%'</code></td><td>任何包含 @gmail 的字符串</td><td>只有 @qq 的</td></tr>
  </tbody>
</table>

<h3>8.6 用 <code>_</code> 做精确长度匹配</h3>
<p><strong>表 codes</strong></p>
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
<p><strong>找正好 2 个字符的 code</strong></p>
<pre><code>SELECT * FROM codes WHERE code LIKE '__';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>code</th></tr></thead>
  <tbody>
    <tr><td>A1</td></tr>
    <tr><td>B5</td></tr>
    <tr><td>C9</td></tr>
  </tbody>
</table>
<p>两个 <code>_</code> = 任意 2 字符。3 字符的 A12、B55 被排除。</p>

<h3>8.7 NOT LIKE —— 不匹配模式</h3>
<p><strong>找不包含「SQL」的书</strong></p>
<pre><code>SELECT * FROM books WHERE title NOT LIKE '%SQL%';</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>title</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Python 编程从入门到精通</td></tr>
    <tr><td>3</td><td>机器学习实战</td></tr>
    <tr><td>5</td><td>Java 编程思想</td></tr>
  </tbody>
</table>

<h3>8.8 关于大小写</h3>
<blockquote>提示 MySQL 默认 <code>LIKE</code> <strong>不区分大小写</strong>：<code>'%sql%'</code> 也能匹配到「SQL」、「Sql」。PostgreSQL 默认<strong>区分大小写</strong>，需要用 <code>ILIKE</code>。</blockquote>

<h2>Part 9 IS NULL / IS NOT NULL —— 空值检查</h2>
<p><strong>NULL</strong> 是 SQL 里的特殊值，表示「未知」或「没值」。它<strong>不是 0，不是空字符串，也不是 false</strong>。</p>

<h3>9.1 NULL 的特性</h3>
<table>
  <thead><tr><th>表达式</th><th>结果</th></tr></thead>
  <tbody>
    <tr><td><code>NULL = NULL</code></td><td>UNKNOWN（不是 TRUE！）</td></tr>
    <tr><td><code>NULL = 5</code></td><td>UNKNOWN</td></tr>
    <tr><td><code>NULL &lt;&gt; NULL</code></td><td>UNKNOWN</td></tr>
    <tr><td><code>NULL + 100</code></td><td>NULL</td></tr>
    <tr><td><code>NULL OR TRUE</code></td><td>TRUE</td></tr>
    <tr><td><code>NULL AND TRUE</code></td><td>UNKNOWN</td></tr>
  </tbody>
</table>
<blockquote>错误 NULL 不能用 <code>=</code> 比较！<code>WHERE x = NULL</code> 永远返回 0 行（结果是 UNKNOWN，被 WHERE 当成 false）。必须用 <code>IS NULL</code> 或 <code>IS NOT NULL</code>。</blockquote>

<h3>9.2 IS NULL —— 找空值</h3>
<p><strong>表 employees</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>manager_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张总</td><td>NULL</td></tr>
    <tr><td>2</td><td>李经理</td><td>1</td></tr>
    <tr><td>3</td><td>王组长</td><td>2</td></tr>
    <tr><td>4</td><td>赵员工</td><td>3</td></tr>
    <tr><td>5</td><td>孙顾问</td><td>NULL</td></tr>
  </tbody>
</table>
<p>其中 manager_id 是 NULL 表示<strong>没有上级</strong>（顶层人员）。</p>
<p><strong>找没有上级的员工</strong></p>
<pre><code>SELECT * FROM employees WHERE manager_id IS NULL;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>manager_id</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>张总</td><td>NULL</td></tr>
    <tr><td>5</td><td>孙顾问</td><td>NULL</td></tr>
  </tbody>
</table>

<h3>9.3 IS NOT NULL —— 找非空值</h3>
<p><strong>找有上级的员工</strong></p>
<pre><code>SELECT * FROM employees WHERE manager_id IS NOT NULL;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>name</th><th>manager_id</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>李经理</td><td>1</td></tr>
    <tr><td>3</td><td>王组长</td><td>2</td></tr>
    <tr><td>4</td><td>赵员工</td><td>3</td></tr>
  </tbody>
</table>

<h3>9.4 错误对比 —— 这是常见 bug</h3>
<blockquote>错误 错误写法：<code>WHERE manager_id = NULL</code><br>结果：<strong>0 行</strong>。无论数据如何都是 0 行（因为 = NULL 永远不为真）。</blockquote>
<blockquote>正确 正确写法：<code>WHERE manager_id IS NULL</code><br>结果：返回所有 manager_id 为 NULL 的行。</blockquote>

<h3>9.5 NULL 在算术里也会传染</h3>
<p><strong>表 sales</strong></p>
<table>
  <thead><tr><th>id</th><th>price</th><th>discount</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td><td>10</td></tr>
    <tr><td>2</td><td>200</td><td>NULL</td></tr>
    <tr><td>3</td><td>150</td><td>5</td></tr>
  </tbody>
</table>
<p><strong>算实际价格</strong></p>
<pre><code>SELECT id, price, discount, price - discount AS final
FROM sales;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>id</th><th>price</th><th>discount</th><th>final</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100</td><td>10</td><td>90</td></tr>
    <tr><td>2</td><td>200</td><td>NULL</td><td>NULL</td></tr>
    <tr><td>3</td><td>150</td><td>5</td><td>145</td></tr>
  </tbody>
</table>
<p>id=2 那行 discount 是 NULL，200 - NULL 还是 NULL。要避免这种情况，用 <strong>COALESCE</strong>（Part 24）把 NULL 变成 0 再算。</p>

<h2>Part 10 ORDER BY —— 排序</h2>
<p>SELECT 出来的结果<strong>顺序是不固定的</strong>。想要按某种顺序展示，就用 <strong>ORDER BY</strong>。</p>

<h3>10.1 升序（默认）</h3>
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
<p><strong>按成绩升序</strong></p>
<pre><code>SELECT * FROM students ORDER BY score;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>王五</td><td>78</td></tr>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>钱七</td><td>95</td></tr>
  </tbody>
</table>
<p>从小到大。不写 ASC/DESC 时默认是 ASC（升序）。</p>

<h3>10.2 降序</h3>
<pre><code>SELECT * FROM students ORDER BY score DESC;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>钱七</td><td>95</td></tr>
    <tr><td>李四</td><td>92</td></tr>
    <tr><td>赵六</td><td>88</td></tr>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>王五</td><td>78</td></tr>
  </tbody>
</table>
<p>DESC = descending = 降序，从大到小。</p>
<blockquote>提示 记忆口诀：
· ASC = ascending = 上升 = 小→大（默认）
· DESC = descending = 下降 = 大→小</blockquote>

<h3>10.3 多列排序</h3>
<p>一个键不够区分时，用第二个键。</p>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>class</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>A</td><td>85</td></tr>
    <tr><td>李四</td><td>B</td><td>92</td></tr>
    <tr><td>王五</td><td>A</td><td>78</td></tr>
    <tr><td>赵六</td><td>A</td><td>85</td></tr>
    <tr><td>钱七</td><td>B</td><td>85</td></tr>
  </tbody>
</table>
<p><strong>先按班级升序，班级内按成绩降序</strong></p>
<pre><code>SELECT * FROM students
ORDER BY class ASC, score DESC;</code></pre>
<p><strong>输出</strong></p>
<table>
  <thead><tr><th>name</th><th>class</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>A</td><td>85</td></tr>
    <tr><td>赵六</td><td>A</td><td>85</td></tr>
    <tr><td>王五</td><td>A</td><td>78</td></tr>
    <tr><td>李四</td><td>B</td><td>92</td></tr>
    <tr><td>钱七</td><td>B</td><td>85</td></tr>
  </tbody>
</table>
<p>先所有 A 班（按成绩降序），再所有 B 班（按成绩降序）。<strong>逗号分隔多个排序键，前面的优先级高</strong>。</p>

<h3>10.4 NULL 在排序中的位置</h3>
<p><strong>原表</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>李四</td><td>NULL</td></tr>
    <tr><td>王五</td><td>92</td></tr>
    <tr><td>赵六</td><td>NULL</td></tr>
  </tbody>
</table>
<p>MySQL 中 ASC 时 NULL 排<strong>最前面</strong>，DESC 时 NULL 排<strong>最后</strong>。</p>
<p><strong>ORDER BY score ASC（默认）</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>李四</td><td>NULL</td></tr>
    <tr><td>赵六</td><td>NULL</td></tr>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>王五</td><td>92</td></tr>
  </tbody>
</table>
<p><strong>ORDER BY score DESC</strong></p>
<table>
  <thead><tr><th>name</th><th>score</th></tr></thead>
  <tbody>
    <tr><td>王五</td><td>92</td></tr>
    <tr><td>张三</td><td>85</td></tr>
    <tr><td>李四</td><td>NULL</td></tr>
    <tr><td>赵六</td><td>NULL</td></tr>
  </tbody>
</table>

<h3>10.5 实用技巧：按表达式排序</h3>
<p>ORDER BY 后面不一定是列名，也可以是<strong>计算表达式</strong>：</p>
<pre><code>SELECT name, price, discount
FROM products
ORDER BY (price - discount) DESC;</code></pre>
<p>按「实付价」从高到低排，但不显示这个值。</p>

<h3>10.6 实用技巧：自定义排序顺序</h3>
<p>用 CASE WHEN（Part 25）能实现「让某些值排前面」：</p>
<p><strong>VIP 排最前，其他按注册时间</strong></p>
<pre><code>SELECT * FROM users
ORDER BY
    CASE WHEN level = 'VIP' THEN 0 ELSE 1 END,
    register_date;</code></pre>
<p>VIP 用户得到 0，其他得到 1。先按这个排（0 在前），同级再按注册时间。</p>
`;
