# COMP10002 Foundations of Algorithms  刷题题库（foa_questions.md）

> 风格模仿 2026 sample 卷难度用 ★ 标注

---

## 第一部分：C 基础、类型、运算

**Q1 [1 mark] ★** 给出下列每条 `printf` 的输出：
```c
int a = 7, b = 2;
printf("%d\n", a / b);
printf("%d\n", a % b);
printf("%f\n", (double)a / b);
```

**Q2 [1 mark] ★** 下面代码有什么问题？运行后 `x` 的值是多少？
```c
int x = 3;
if (x = 5) { printf("yes\n"); }
```

**Q3 [2 marks] ★★** 写一个函数 `int count_vowels(char s[])`，返回字符串 `s` 中元音字母（a, e, i, o, u，只考虑小写）的个数。不允许使用 `string.h`。

**Q4 [2 marks] ★★** 解释 C 的「传值（pass by value）」。下面 `try_swap` 调用后 `x` 和 `y` 的值是什么？为什么？写出能真正交换的正确版本。
```c
void try_swap(int a, int b) { int t = a; a = b; b = t; }
int x = 1, y = 2;
try_swap(x, y);
```

---

## 第二部分：指针与数组

**Q5 [1 mark] ★** 下列哪些写法等价于读取数组第 `i` 个元素 `A[i]`？（可多选）
(A) `*(A + i)` (B) `*A + i` (C) `(*A)[i]` (D) `*(i + A)`

**Q6 [1 mark] ★** 给定 `int a[8];`，下列哪个为真？
(A) `a` 可以被赋值：`a = b;`
(B) 可以对 `a` 取地址写成 `&a` 来传给函数（必须）
(C) 把 `a` 传给函数时传的是首元素地址
(D) 函数可以 `return a;` 返回整个数组

**Q7 [2 marks] ★★** 描述下列函数对数组 `a` 的作用（数组是原地更新，假设 n > 0）。如果输入是 `{3, 1, 4, 1, 5}`，运行后数组变成什么？
```c
void f(int a[], int n) {
    for (int i = 1; i < n; i++)
        a[i] = a[i] + a[i - 1];
}
```

**Q8 [5 marks] ★★★** 给定常量 `#define COLS 100` 和一个 `n` 行 `m` 列的整型矩阵 `ratings`（值 0 表示「未评分」，1~5 表示评分）。写函数
```c
double column_average(int ratings[][COLS], int n, int m, int j)
```
计算并返回第 `j` 列**非零元素**的平均值（排除 0）。可假设 `n > 0` 且 `COLS >= m > j >= 0`，且第 j 列至少有一个非零元素。

---

## 第三部分：字符串

**Q9 [2 marks] ★★** 写函数 `int my_strlen(char s[])`，返回字符串长度（不含 `'\0'`）。不允许用 `string.h`。

**Q10 [4 marks] ★★★** 给定字符串 `str`，其「校验和（checksum）」定义为所有字符 ASCII 码之和。例如 `"apple"` 的校验和 = 97+112+112+108+101 = 530。写函数
```c
int calculate_checksum(char str[])
```
返回 `str` 的校验和。

**Q11 [6 marks] ★★★★** 给定一句英文 `str`（只含字母和空格，单词间恰一个空格，首尾无空格，至少一个单词），其「摘要」是把每个单词替换成它的首尾两个字母。例如 `"Algorithm is a fun subject"` → `"Am is aa fn st"`（单字母单词如 `"a"` 变成 `"aa"`）。写函数
```c
char *compute_abstract(char str[])
```
返回指向摘要字符串的指针。你需要为返回串**精确分配内存**；不得修改输入 `str`；不得使用 `string.h`。
（提示：每个单词无论多长都变成恰好 2 个字符，单字母词如 `"a"` 变 `"aa"`。先数出单词数 w，则摘要长度 = 3w − 1，再 +1 给 `'\0'`。）

---

## 第四部分：结构体

**Q12 [2 marks] ★★** 写一个结构体类型 `stock_t`，表示一条股票记录：股票代码（3 个大写字母的字符串）、价格（正实数）、预测利润（正实数）。

**Q13 [5 marks] ★★★** 沿用 `stock_t`。写函数
```c
int stock_cmp(void *stock1, void *stock2)
```
比较两个 `stock_t*`，按代码字母序：stock1 的代码更小返回 −1，更大返回 1，相同返回 0。不得使用任何库函数（自己逐字符比）。可假设两指针非 NULL 且代码非空。

**Q14 [2 marks] ★★** 下面两个函数哪个能真正修改调用方传入的结构体？为什么？
```c
void set_a(stock_t s,  double p) { s.price = p; }
void set_b(stock_t *s, double p) { s->price = p; }
```

---

## 第五部分：动态内存

**Q15 [1 mark] ★** 列出使用 `malloc` 时应遵守的至少三条规则。

**Q16 [3 marks] ★★** 给定一个 word 字符串 `word_str`，其 Form 2 变形规则：若以 `'e'` 结尾，去掉 `'e'` 再加 `"ing"`（如 `"allocate"` → `"allocating"`）；否则直接加 `"ing"`（如 `"sell"` → `"selling"`）。写函数
```c
char *generate_form_2(char word_str[])
```
返回指向新分配的变形字符串的指针。需要精确分配内存。不得使用 `string.h`。

**Q17 [1 mark] ★★** 下面代码有什么内存相关的 bug？怎么改？
```c
char *make_copy(char *s, int len) {
    char *p = malloc(len);
    for (int i = 0; i < len; i++) p[i] = s[i];
    p[len] = '\0';
    return p;
}
```

---

## 第六部分：链表、栈、队列

**Q18 [2 marks] ★★** 下表是对一个初始为空的整数栈的操作。补全「返回值」和「操作后栈内容」（栈顶在右）。
```
操作       返回值   操作后的栈
push(5)     –       [5]
push(8)     –       ____
push(3)     –       ____
pop()       __      ____
top()       __      ____
pop()       __      ____
```

**Q19 [2 marks] ★★★** 学生用「带 head 和 foot（头尾）指针的单链表」实现队列，dequeue 只在非空时调用。解释为什么 enqueue 和 dequeue 都能 O(1)，并说明删除最后一个节点时要特别处理什么。

**Q20 [4 marks] ★★★** 给定链表节点类型
```c
typedef struct node node_t;
struct node { int score; node_t *next; };
```
写函数 `int count_runs_at_least(node_t *head, int cutoff)`，返回「分数 ≥ cutoff 的节点」构成的**连续段（run）**的个数。例如分数序列 70, 80, 40, 90、cutoff=60，应返回 2（{70,80} 和 {90}）。空表返回 0。

**Q21 [2 marks] ★★** 对比「数组」和「指针链表」两种实现，填出下列操作的最坏复杂度：访问第 k 个元素、头部 push、头部 pop、尾部插入。

---

## 第七部分：算法分析与 Big-O

**Q22 [1 mark] ★** 把下列函数按 Big-O 化简：
(a) `f(n) = 5n + 100`
(b) `f(n) = 3n² + 2n + 7`
(c) `f(n) = 8`
(d) `f(n) = 2ⁿ + n³`

**Q23 [1 mark] ★** 把下列三种操作匹配到最合适的运行时间（每个时间最多用一次）：
- 扫描无序数组一遍找最小值
- 在有序数组里二分搜索
- 比较数组里所有的无序对（每两个元素）

可用时间：O(1), O(log n), O(n), O(n²)。

**Q24 [2 marks] ★★** 某电脑用本课的快排把 100 万个随机整数排序要 10 秒。同机同实现，把 1600 万个随机整数排序最可能要多久？为什么？
(A) 96 秒 (B) 192 秒 (C) 384 秒 (D) 512 秒 (E) 640 秒

**Q25 [2 marks] ★★** 用 Big-O 定义证明 `f(n) = 3n + 2 = O(n)`，给出具体的常数 c 和 n₀。

---

## 第八部分：搜索

**Q26 [3 marks] ★★** 用本课的二分搜索在已排序数组 `{1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21}` 中查找 9。写出依次会和 9 比较的所有元素。

**Q27 [3 marks] ★★★** 把二分搜索写成递归 C 函数 `int binary_search(int A[], int lo, int hi, int key)`，在 `A[lo..hi-1]` 中找 key，找到返回下标，否则返回 −1。

---

## 第九部分：排序

**Q28 [3 marks] ★★** 用插入排序对 `{5, 2, 4, 6, 1, 3}` 排序，写出**每一轮外层循环结束后**数组的状态。

**Q29 [2 marks] ★** 填表（最坏情况，除非特别说明）：

| 算法 | 随机输入时间 | 额外空间 | 稳定? |
|---|---|---|---|
| 插入排序 | | | |
| 快速排序 | (平均) / (最坏) | | |
| 归并排序 | | | |
| 堆排序 | | | |

**Q30 [2 marks] ★★★** 快速排序最坏情况是 O(n²)。给出一个会触发最坏情况的输入例子（假设总是取首元素当 pivot），并解释为什么。怎么改进能让期望时间永远是 O(n log n)？

**Q31 [2 marks] ★★** 解释「稳定排序（stable sort）」的含义。本课四种排序里哪些稳定、哪些不稳定？

---

## 第十部分：字符串匹配

**Q32 [2 marks] ★★** 朴素（暴力）字符串匹配的最坏时间复杂度是多少？给一个触发最坏情况的 T 和 P 例子，并说明平均情况为什么通常是 O(n)。

**Q33 [2 marks] ★★★** 使用 KMP 算法，模式 `P = abcabx`。匹配中在比较某文本字符与 `P[5]` 时失配，KMP 立刻改为用同一文本字符比较 `P[2]`。这说明 `P[0..4]` 的结构有什么性质？请解释。

**Q34 [2 marks] ★★★** 写出模式 `P = ababaca` 的 KMP 失败函数 `F[0..6]`（约定 `F[0] = -1`）。

**Q35 [3 marks] ★★★** 模式 `P = abcab`，字母表为 `{a, b, c, d}`。构造 BMH 移位表 `L`（给出每个字符的 L 值）。

**Q36 [2 marks] ★★★** 给定字符串 `S = abaab$`（`$` 是最小哨兵）。列出排好序的全部后缀，并写出后缀数组（起始位置序列）。

**Q37 [4 marks] ★★★★** 假设 `T` 和 `P` 都是以 `'\0'` 结尾的字符串。写辅助函数
```c
int compare_suffix_prefix(char T[], int start, char P[])
```
比较 `P` 与后缀 `T[start..]` 的前缀。返回：若 `P` 是 `T[start..]` 的前缀返回 0；若 `T[start..]` 字典序在 P 之前返回负数；之后返回正数。

---

## 第十一部分：递归

**Q38 [3 marks] ★★** 写递归函数 `int sum_digits(int n)`，返回非负整数 `n` 的各位数字之和（如 `sum_digits(1234) = 10`）。说明它的 base case 和递归情形。

**Q39 [2 marks] ★★★** 一个学生说「所有递归算法都是 O(log n)，因为每次递归调用都深一层」。用下面的函数说明这个说法对不对。
```c
int sum_to_n(int n) {
    if (n == 0) return 0;
    return n + sum_to_n(n - 1);
}
```

**Q40 [2 marks] ★★★** 朴素递归算 Fibonacci 的复杂度大约是多少？为什么慢？「记忆化（memoization）」如何把它降到 O(n)？

**Q41 [5 marks] ★★★★** 汉诺塔（Towers of Hanoi）：把 n 个盘子从一根柱移到另一根柱，每次只能移一个、且不能把大盘放在小盘上。写递归函数（或伪代码）描述解法，并推导移动次数 `T(n)` 的封闭式与 Big-O。

---

## 第十二部分：数字表示与位运算

**Q42 [2 marks] ★★** 用 8 位二进制补码表示：(a) 38 (b) −38。并说明如何由 38 的补码得到 −38 的补码。

**Q43 [2 marks] ★★** 8 位二进制补码 `11010011` 代表的十进制值是多少？写出计算过程。

**Q44 [2 marks] ★★★** 把十进制 13.25 转成二进制，并写成 `1.xxx × 2^e` 的归一化形式（给出尾数和指数 e）。

**Q45 [2 marks] ★★★** 定义按位运算符 Z：取两个等长 bit 串 a、b，交替取 a、b 的位拼成 c（先 a 第一位、再 b 第一位、再 a 第二位…）。例如 `0111 Z 1100 = 01111010`。设 `unsigned short operator_Z(unsigned char a, unsigned char b)` 取两个 8 位数生成 16 位结果。`operator_Z(128, 1)` 的输出（按 `%hu` 打印）是多少？给出推导。

---

## 第十三部分：二叉搜索树（BST）

**Q46 [2 marks] ★★** 依次插入 30, 25, 35, 28, 40 到一棵初始为空的 BST。画出（或用括号嵌套描述）最终的树结构，并写出中序遍历结果。

**Q47 [2 marks] ★★★** 给定 BST 节点类型
```c
typedef struct node node_t;
struct node { int data; node_t *left; node_t *rght; };
```
写**递归**函数 `node_t *search(node_t *root, int x)`，在 BST 中找值 x，找到返回该节点，否则返回 NULL。

**Q48 [2 marks] ★★★** 解释为什么 BST 的搜索平均是 O(log n) 但最坏是 O(n)。给出一个会导致最坏情况的插入顺序例子。

**Q49 [3 marks] ★★★★** 在第 46 题得到的 BST 上，描述如何删除节点 30（它有两个孩子），用「中序后继」法，并写出删除后的树结构。

---

## 第十四部分：堆与优先队列

**Q50 [2 marks] ★★** 堆用数组表示（0-based）。写出节点下标 i 的左孩子、右孩子、父节点的下标公式。一个有 n 个节点的堆，高度是多少？

**Q51 [3 marks] ★★★** 把数组 `{13, 16, 14, 10, 15, 17, 18, 30, 25}`（n=9）用 build-max-heap 转成大顶堆。写出建堆后的数组。（提示：从下标 `n/2−1` 倒着 sift_down。）

**Q52 [2 marks] ★★★★** 简要解释为什么堆排序的最坏运行时间是 O(n log n)。

**Q53 [2 marks] ★★** 优先队列可以用堆实现。`pq_insert`、`pq_delete_max`、`pq_max_priority` 这三个操作各是什么复杂度？

---

## 第十五部分：哈希表

**Q54 [4 marks] ★★★★** 哈希表用开放寻址 + 线性探测，三种槽状态 `EMPTY / OCCUPIED / DELETED`。写函数
```c
int oa_find(slot_t table[], int table_size, int key)
```
返回 key 所在下标，没有则返回 −1。搜索遇 DELETED 要继续、遇 EMPTY 可停、表无 EMPTY 时不能死循环。类型给定：
```c
typedef enum { EMPTY, OCCUPIED, DELETED } state_t;
typedef struct { int key; state_t state; } slot_t;
int hash_key(int key, int table_size) {  // 已给
    int h = key % table_size;
    if (h < 0) h += table_size;
    return h;
}
```

**Q55 [1 mark] ★★** 大小为 7 的哈希表用线性探测，`h(x) = x mod 7`。当前内容：
```
下标  0   1   2   3   4   5   6
状态  occ occ del occ emp occ emp
key   14  22  –   10  –   19  –
```
从 `h(17)` 开始查找 17，列出依次检查的下标，并说明查找成功还是失败。

**Q56 [2 marks] ★★★** 用大小为 3 的数组当哈希表（空位 = −1），哈希函数 `h(key) = key*(key+5) % 3`，线性探测处理冲突。依次插入 2, 4, 6，写出每次插入后数组的状态。

**Q57 [1 mark] ★** 分离链接（separate chaining）和开放寻址（open addressing）有什么区别？为什么开放寻址查找时遇到 DELETED 槽不能停止？

---

## 第十六部分：多态、ADT、综合

**Q58 [2 marks] ★★** 什么是抽象数据类型（ADT）？为什么栈、队列、字典都被称为 ADT？「多态（polymorphism）」在本课的树/链表实现中是怎么做到的？

**Q59 [2 marks] ★★** 给定一个整数集合 S（数组，长 n）。写朴素函数 `int has_majority(int S[], int n)`，若某个值出现超过 n/2 次返回 1，否则返回 0。说明你的时间和额外空间复杂度。

**Q60 [4 marks] ★★★★★** 同上问题，但要求 O(n) 时间、O(1) 额外空间。写出 Boyer-Moore 投票算法（C 代码或伪代码），并简要说明为什么正确（提示：先找候选，再验证）。

**Q61 [2 marks] ★★★** 给定两个已按字母序排好、且各自 word_str 唯一的英文单词记录数组 `words1`（长 n）和 `words2`（长 m），描述如何把 words2 合并进 words1 并保持有序、返回合并后总记录数（重复 word_str 时保留 Form 非空指针更多的那条，平手保留 words1 的）。**不得使用任何排序算法**。说出核心思路和复杂度即可（不必写完整代码）。

---

## 第十七部分：往年风格综合大题（写函数）

**Q62 [5 marks] ★★★** 给定数组 `prices`（n 个正实数，预测的未来 n 天股价）。某经纪人只能买一次、且必须**第二天**卖出（第 i 天买，第 i+1 天卖）。写函数
```c
double get_max_single_day_profit(double prices[], int n)
```
返回最大利润，若最大利润 ≤ 0 返回 0。可假设 n ≥ 2。

**Q63 [5 marks] ★★★★** 同上数组，但经纪人买一次后可在**之后任意一天**卖出。写函数
```c
double get_max_profit(double prices[], int n)
```
返回最大利润（≤0 则返回 0）。要求 **O(n) 时间**。可假设 n ≥ 2。

**Q64 [4 marks] ★★★** 给定一个 read 记录数组所需的结构（DNA 读段），其 `dna_seq` 是只应含 `'A','C','T','G'` 的字符串。写函数
```c
int is_valid_read(char dna_seq[])
```
若 `dna_seq` 只含这四种字符返回 1，否则返回 0。

**Q65 [6 marks] ★★★★** 给定如下二叉搜索树类型，每个节点 `data` 指向一个 `word_t`（含 `char word_str[]`），`cmp` 比较两记录的 `word_str`：
```c
typedef struct node node_t;
struct node { void *data; node_t *left; node_t *right; };
typedef struct { node_t *root; int (*cmp)(void*,void*); } tree_t;
```
写函数
```c
double average_word_length_tree(tree_t *word_tree)
```
返回树中所有单词 `word_str` 的平均长度。若树为空（`word_tree` 为 NULL 或无节点）返回 0。**不得使用 static 变量或新建数组/动态结构**。（提示：写一个递归辅助函数，用指针参数把「总长度」和「节点数」两个累加值带出来。）

---

（题目结束。答案见 `answer.md`。）
