# COMP10002 刷题答案（answer.md）

> 对应 `foa_questions.md`。代码给的是一种可接受写法，等价正确写法同样得分。

---

## 第一部分：C 基础

**A1**
```
3          // 整数除法 7/2 截断
1          // 7 % 2 余 1
3.500000   // (double)7 / 2，浮点除法
```

**A2** bug：把比较 `==` 误写成赋值 `=`。`x = 5` 把 5 赋给 x（表达式值为 5，真），所以打印 `yes`；运行后 **x = 5**。应写 `if (x == 5)`。

**A3**
```c
int count_vowels(char s[]) {
    int count = 0;
    for (int i = 0; s[i] != '\0'; i++) {
        char c = s[i];
        if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u') count++;
    }
    return count;
}
```

**A4** 传值：实参的值被复制进函数的局部变量，函数内修改的是副本。所以 `try_swap` 后 **x=1, y=2 不变**。正确版本传地址：
```c
void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }
/* 调用：swap(&x, &y); */
```

---

## 第二部分：指针与数组

**A5** **A 和 D**。`*(A+i)` 和 `*(i+A)` 都等于 `A[i]`。B 是 `(*A)+i = A[0]+i`，错；C 语法非法。

**A6** **C**。数组名传给函数时传的是首元素地址。A 错（数组名是常量，不能赋值）；D 错（不能返回数组）；B 多余（`a` 本身就是地址）。

**A7** 函数把数组改成**前缀和（prefix sum）**：a[i] 变成原数组 a[0..i] 之和（a[0] 不变）。
`{3,1,4,1,5}` → a[1]=1+3=4, a[2]=4+4=8, a[3]=1+8=9, a[4]=5+9=14 → **{3, 4, 8, 9, 14}**。

**A8**
```c
double column_average(int ratings[][COLS], int n, int m, int j) {
    int sum = 0, count = 0;
    for (int i = 0; i < n; i++) {
        if (ratings[i][j] != 0) { sum += ratings[i][j]; count++; }
    }
    return (double)sum / count;   // 强制转 double 避免整数除法
}
```

---

## 第三部分：字符串

**A9**
```c
int my_strlen(char s[]) {
    int n = 0;
    while (s[n] != '\0') n++;
    return n;
}
```

**A10**
```c
int calculate_checksum(char str[]) {
    int sum = 0;
    for (int i = 0; str[i] != '\0'; i++) sum += str[i];
    return sum;
}
```

**A11**
```c
#include <stdlib.h>
#include <assert.h>
char *compute_abstract(char str[]) {
    int spaces = 0;
    for (int i = 0; str[i] != '\0'; i++)
        if (str[i] == ' ') spaces++;
    int words = spaces + 1;            // 首尾无空格、单词间一个空格
    int abs_len = 3 * words - 1;       // 每词 2 字符 + (words-1) 个空格
    char *abs = malloc((abs_len + 1) * sizeof(char));
    assert(abs != NULL);

    int i = 0, j = 0;
    while (str[i] != '\0') {
        int start = i;
        while (str[i] != '\0' && str[i] != ' ') i++;  // 找词尾
        int end = i - 1;
        abs[j++] = str[start];         // 首字母
        abs[j++] = str[end];           // 尾字母（单字母词 start==end）
        if (str[i] == ' ') { abs[j++] = ' '; i++; }    // 复制空格并跳过
    }
    abs[j] = '\0';
    return abs;
}
```

---

## 第四部分：结构体

**A12**
```c
typedef struct {
    char code[4];     // 3 个大写字母 + '\0'
    double price;
    double profit;
} stock_t;
```

**A13**
```c
int stock_cmp(void *stock1, void *stock2) {
    stock_t *s1 = (stock_t *)stock1;
    stock_t *s2 = (stock_t *)stock2;
    int i = 0;
    while (s1->code[i] != '\0' && s2->code[i] != '\0') {
        if (s1->code[i] < s2->code[i]) return -1;
        if (s1->code[i] > s2->code[i]) return 1;
        i++;
    }
    if (s1->code[i] == '\0' && s2->code[i] == '\0') return 0;
    return (s1->code[i] == '\0') ? -1 : 1;  // 短的更小
}
```

**A14** **`set_b` 能改原结构体**，因为它传的是指针，`s->price` 直接改原内存。`set_a` 传的是结构体副本，改副本，函数返回后副本销毁，原值不变。

---

## 第五部分：动态内存

**A15** 任选三条：①永远用 `sizeof()` 不硬编码；②malloc 后 `assert` 检查非 NULL；③每个 malloc 配一个 free（否则内存泄漏）；④free 后把指针设 NULL；⑤realloc 增长按倍数而非每次加固定量。

**A16**
```c
#include <stdlib.h>
#include <assert.h>
char *generate_form_2(char word_str[]) {
    int len = 0;
    while (word_str[len] != '\0') len++;
    int ends_e = (len > 0 && word_str[len-1] == 'e');
    int copy = ends_e ? len - 1 : len;       // 去 e 则少复制一个
    int new_len = copy + 3;                  // 加 "ing"
    char *res = malloc((new_len + 1) * sizeof(char));
    assert(res != NULL);
    int i;
    for (i = 0; i < copy; i++) res[i] = word_str[i];
    res[i++] = 'i'; res[i++] = 'n'; res[i++] = 'g';
    res[i] = '\0';
    return res;
}
```

**A17** bug：只 `malloc(len)`，但写到 `p[len]`（索引 0..len 共 len+1 个）越界。改为 `malloc(len + 1)`。（理想还应在 malloc 后加 assert 检查。）

---

## 第六部分：链表、栈、队列

**A18**
```
操作       返回值   操作后的栈
push(5)     –       [5]
push(8)     –       [5, 8]
push(3)     –       [5, 8, 3]
pop()       3       [5, 8]
top()       8       [5, 8]    // top 只看不弹
pop()       8       [5]
```

**A19** enqueue 用 **foot 指针**直接在尾部接新节点、更新 foot，无需遍历 → O(1)。dequeue 用 **head 指针**直接摘头节点、更新 head → O(1)。**删除最后一个节点时**：head 变成 NULL，必须**同时把 foot 也设为 NULL**，否则 foot 成为悬空指针。

**A20**
```c
int count_runs_at_least(node_t *head, int cutoff) {
    int groups = 0, in_group = 0;
    for (node_t *curr = head; curr != NULL; curr = curr->next) {
        if (curr->score >= cutoff) {
            if (!in_group) { groups++; in_group = 1; }  // 进入新一段
        } else {
            in_group = 0;                                // 段中断
        }
    }
    return groups;
}
```
空表时 head==NULL，循环不执行，返回 0。

**A21**

| 操作 | 数组 | 指针链表 |
|---|---|---|
| 访问第 k 个 | O(1) | O(k)，最坏 O(n) |
| 头部 push | O(n) | O(1) |
| 头部 pop | O(n) | O(1) |
| 尾部插入 | O(1) | O(1)（有 foot 指针） |

---

## 第七部分：Big-O

**A22** (a) O(n) (b) O(n²) (c) O(1) (d) O(2ⁿ)。

**A23** 扫描无序数组找最小 → **O(n)**；二分搜索 → **O(log n)**；比较所有无序对 → **O(n²)**。（O(1) 未用。）

**A24** **(B) 192 秒**。快排 O(n log n)。规模 ×16，时间比 ≈ 16 × (log 16M / log 1M) ≈ 16 × (24/20) ≈ 19.2，10 秒 × 19.2 ≈ 192 秒。（若是 O(n²) 则为 16²=256 倍；若纯 O(n) 则 16 倍 = 160 秒。logn 项使它略高于 16 倍但远低于 256 倍。）

**A25** 取 **c = 4, n₀ = 2**：当 n ≥ 2 时，`3n + 2 ≤ 3n + n = 4n = 4·n`，满足 `0 < f(n) ≤ c·g(n)`，故 `f(n) = O(n)`。（c=10, n₀=0 等也对。）

---

## 第八部分：搜索

**A26** 数组下标 0~10，目标 9（下标 4）。区间 [lo,hi)=[0,11)：
- mid=5，A[5]=11>9，去左半 [0,5)
- mid=2，A[2]=5<9，去右半 [3,5)
- mid=4，A[4]=9，命中
依次比较的元素：**11, 5, 9**。

**A27**
```c
int binary_search(int A[], int lo, int hi, int key) {
    if (lo >= hi) return -1;
    int mid = (lo + hi) / 2;
    if (key < A[mid])      return binary_search(A, lo, mid, key);
    else if (key > A[mid]) return binary_search(A, mid + 1, hi, key);
    else return mid;
}
```

---

## 第九部分：排序

**A28** 插入排序，每轮外层结束后：
```
初始:      5 2 4 6 1 3
j=1 (2):   2 5 4 6 1 3
j=2 (4):   2 4 5 6 1 3
j=3 (6):   2 4 5 6 1 3
j=4 (1):   1 2 4 5 6 3
j=5 (3):   1 2 3 4 5 6
```

**A29**

| 算法 | 随机输入时间 | 额外空间 | 稳定? |
|---|---|---|---|
| 插入排序 | O(n²) | O(1) | 是 |
| 快速排序 | 平均 O(n log n) / 最坏 O(n²) | O(log n) | 否 |
| 归并排序 | O(n log n) | O(n) | 是 |
| 堆排序 | O(n log n) | O(1) | 否 |

**A30** 触发最坏的输入：已排序数组，如 `{1,2,3,4,5}`（或逆序）。取首元素当 pivot 时 pivot 总是最小（最大），partition 切成空段和 n−1 段，`T(n)=n+T(n−1)=O(n²)`。改进：**随机选 pivot**（或先随机打乱），期望时间永远 O(n log n)，与输入无关。

**A31** 稳定 = 排序后相等关键字的元素保持原有相对先后顺序。本课中**插入、归并稳定**；**快排、堆排不稳定**。

---

## 第十部分：字符串匹配

**A32** 最坏 **O(nm)**。例：T = `AAAA…A`（n 个 A），P = `AAA…AB`（m−1 个 A 接一个 B）。每个起始位置都匹配 m−1 个字符才在最后失配。平均 O(n)：通常第一个字符就不匹配，每个位置只花约 O(1)。

**A33** 说明 `P[0..4] = abcab` 的**最长「既是真前缀又是真后缀」的串长度为 2**（即 `ab`）。所以匹配到 P[0..4] 后失配时，KMP 知道已匹配文本的末尾两字符正好等于 P 的前两字符 `ab`，可保留这段重叠、用同一文本字符从 `P[2]` 继续比，无需回退文本指针。

**A34** P = `ababaca`，F[i] = 前 i 个字符的最长 border 长度：
```
i:   0  1  2  3  4  5  6
P:   a  b  a  b  a  c  a
F:  -1  0  0  1  2  3  0
```
（F[3]: "aba" border "a"=1；F[4]: "abab" border "ab"=2；F[5]: "ababa" border "aba"=3；F[6]: "ababac" 无 border=0。）

**A35** P = `abcab`，m=5，字母表 {a,b,c,d}。初始全 5，再 `for i=0..3: L[P[i]] = 5-i-1`：
- i=0,'a': L[a]=4
- i=1,'b': L[b]=3
- i=2,'c': L[c]=2
- i=3,'a': L[a]=1（覆盖）
- P[4]='b' 是末字符，不处理。
结果：**L[a]=1, L[b]=3, L[c]=2, L[d]=5**。

**A36** S = `abaab$`（位置 0~5）。后缀排序（$ 最小，a<b）：
```
$        (5)
aab$     (2)
ab$      (3)
abaab$   (0)
b$       (4)
baab$    (1)
```
后缀数组 = **[5, 2, 3, 0, 4, 1]**。

**A37**
```c
int compare_suffix_prefix(char T[], int start, char P[]) {
    int i = 0;
    while (P[i] != '\0' && T[start+i] != '\0' && P[i] == T[start+i]) i++;
    if (P[i] == '\0') return 0;          // P 是 T[start..] 的前缀
    if (T[start+i] < P[i]) return -1;    // 后缀更小（含 T 先到 '\0' 的情况，'\0'=0 最小）
    return 1;
}
```

---

## 第十一部分：递归

**A38**
```c
int sum_digits(int n) {
    if (n < 10) return n;                // base case：个位数直接返回
    return n % 10 + sum_digits(n / 10);  // 递归：末位 + 其余各位之和
}
```

**A39** 说法**不对**。`sum_to_n` 每次只递归调用一次、参数 n−1，递归深度是 n，每层 O(1) 工作 → 总共 **O(n)**。只有当每次调用把问题缩小到固定比例（如减半）时才是 O(log n)。

**A40** 朴素 Fibonacci 约 **O(1.7ⁿ)**（指数级，约 φⁿ，φ≈1.618）。慢的原因：同一个子问题被重复计算指数次（fib(n−2) 在 fib(n) 和 fib(n−1) 两边都算）。**记忆化**把每个 fib(k) 算过就缓存，每个值只算一次 → **O(n) 时间**（O(n) 空间）。

**A41**
```
hanoi(n, from, to, via):
    if n == 0: return
    hanoi(n-1, from, via, to)   // 把上面 n-1 个移到中转柱
    move disk n: from -> to     // 移最大的盘
    hanoi(n-1, via, to, from)   // 把 n-1 个从中转柱移到目标柱
```
递推 `T(n) = 2T(n-1) + 1`，T(0)=0。解得 **T(n) = 2ⁿ − 1 = O(2ⁿ)**。

---

## 第十二部分：数字表示与位运算

**A42** 38 = 32+4+2 → **00100110**。−38：取反加 1：`00100110` → 取反 `11011001` → +1 → **11011010**。由 38 得 −38 的方法：**所有位取反再加 1**。

**A43** `11010011`，MSB=1 为负。用负权重：`−128 + 64 + 16 + 2 + 1 = −45`。（验证：取反 `00101100` +1 = `00101101` = 45，故为 **−45**。）

**A44** 整数 13 = `1101`，小数 0.25 = `0.01`（0.25×2=0.5→0，0.5×2=1.0→1）。故 13.25 = `1101.01₂`。归一化：**1.10101 × 2³**，尾数 `10101`，指数 e = 3。

**A45** a=128=`10000000`，b=1=`00000001`。从最左位起交替取：
```
c = a0 b0 a1 b1 ... a7 b7
  = 1  0  0  0  0  0  0  0  0  0  0  0  0  0  0  1
  = 1000000000000001₂ = 2¹⁵ + 2⁰ = 32768 + 1 = 32769
```
输出 **32769**。

---

## 第十三部分：BST

**A46** 插入 30,25,35,28,40：
```
        30
       /  \
      25    35
       \      \
        28     40
```
中序遍历（左-根-右）：**25, 28, 30, 35, 40**（升序）。

**A47**
```c
node_t *search(node_t *root, int x) {
    if (root == NULL) return NULL;
    if (x == root->data) return root;
    if (x < root->data) return search(root->left, x);
    return search(root->rght, x);
}
```

**A48** 随机插入顺序时树较平衡，叶子平均深度 O(log n)，故搜索平均 O(log n)。最坏是树退化成「棍子」（每个节点只有一个孩子），高度 = n，搜索 O(n)。触发例子：按已排序顺序插入，如 **1, 2, 3, 4, 5**（每个新值都往右挂）。

**A49** 删除有两个孩子的 30，用**中序后继**（右子树的最左节点）。30 的右子树根是 35，其最左节点就是 35（35 无左孩子）。把 30 的值替换成 35，再删除原来的 35 节点（它只有右孩子 40，40 顶上来）。结果：
```
        35
       /  \
      25    40
       \
        28
```
中序仍为 25, 28, 35, 40，合法。

---

## 第十四部分：堆与优先队列

**A50** 节点 i：左孩子 `2i+1`，右孩子 `2i+2`，父 `(i−1)/2`（整除）。n 个节点的堆高度 = **⌊log₂ n⌋ = O(log n)**。

**A51** 从 i = n/2−1 = 3 倒着 sift_down：
```
初始:        13 16 14 10 15 17 18 30 25
i=3 (10):    13 16 14 30 15 17 18 10 25   (10与30换)
i=2 (14):    13 16 18 30 15 17 14 10 25   (14与18换)
i=1 (16):    13 30 18 25 15 17 14 10 16   (16→30，再下沉16与25换)
i=0 (13):    30 25 18 16 15 17 14 10 13   (13→30，再下沉至16、再至13/16)
```
建堆结果：**[30, 25, 18, 16, 15, 17, 14, 10, 13]**。

**A52** 先 Build-Max-Heap O(n)，此时最大值在根；然后做 n 次：把根与当前末尾交换（最大值归位）、堆缩小 1、对新根 sift_down（O(log n)）。合计 `O(n) + n·O(log n) = O(n log n)`，且原地（O(1) 额外空间）。

**A53** pq_insert：**O(log n)**；pq_delete_max：**O(log n)**；pq_max_priority（查看最高优先级）：**O(1)**。

---

## 第十五部分：哈希表

**A54**
```c
int oa_find(slot_t table[], int table_size, int key) {
    int i = hash_key(key, table_size);
    for (int count = 0; count < table_size; count++) {  // count 防死循环
        if (table[i].state == EMPTY) return -1;          // 遇 EMPTY 可停
        if (table[i].state == OCCUPIED && table[i].key == key) return i;
        i = (i + 1) % table_size;                        // 越过 DELETED 与不匹配项，环形前进
    }
    return -1;
}
```

**A55** h(17) = 17 mod 7 = 3。从下标 3 开始：
- 下标 3：occupied，key 10 ≠ 17，继续；
- 下标 4：empty → 停止。
检查的下标：**3, 4**。搜索**失败**（在遇到 EMPTY 前没找到 17）。

**A56** h(key)=key·(key+5)%3：
```
h(2)=2·7%3 =14%3=2 → A[2]=2 → {-1, -1,  2}
h(4)=4·9%3 =36%3=0 → A[0]=4 → { 4, -1,  2}
h(6)=6·11%3=66%3=0 → 冲突，探测 A[1] 空 → A[1]=6 → { 4,  6,  2}
```
最终 A = **{4, 6, 2}**。

**A57** 分离链接：每个桶挂一条链表，冲突就往链表加。开放寻址：所有元素都存在数组本身，冲突就探测下一个空位。开放寻址查找遇 DELETED 不能停，是因为当初某个因冲突被放到**更后面**的元素，可能正好经过这个现在被删的槽；若在此停下就会漏掉它。

---

## 第十六部分：多态、ADT、综合

**A58** ADT（抽象数据类型）= 只由「能做哪些操作」定义，不暴露内部实现；使用者只关心 push/pop/insert/search 等行为，不管底层用数组还是链表。栈、队列、字典都是 ADT，因为各自都能用多种结构实现。多态：节点用 `void *data` 存任意类型指针，并在创建结构时传入**比较函数指针**，使同一份代码能处理任意类型、任意排序。

**A59**
```c
int has_majority(int S[], int n) {
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < n; j++)
            if (S[j] == S[i]) count++;
        if (count > n/2) return 1;
    }
    return 0;
}
```
时间 **O(n²)**，额外空间 **O(1)**。

**A60** Boyer-Moore 投票法：
```c
int has_majority(int S[], int n) {
    int candidate = 0, count = 0;
    for (int i = 0; i < n; i++) {            // 第一遍：选候选
        if (count == 0) { candidate = S[i]; count = 1; }
        else if (S[i] == candidate) count++;
        else count--;
    }
    count = 0;                                // 第二遍：验证
    for (int i = 0; i < n; i++)
        if (S[i] == candidate) count++;
    return count > n/2;
}
```
正确性：把不相等的元素两两抵消，真正的多数（>n/2）抵消不完，必然作为候选幸存。但抵消本身不能保证候选真的过半（可能只是相对最多），所以需第二遍**真实计数验证**。**O(n) 时间，O(1) 额外空间**。

**A61** 核心思路：像归并排序的 **merge 步骤**——两个指针分别走 words1 和 words2，因两数组都有序且 word_str 唯一，逐一用 `strcmp` 比较 word_str：
- word_str 相同：保留 Form 非空指针更多的那条；平手保留 words1 的（即不替换）。
- 否则把较小的那个排进结果，对应指针前移。
为在 words1 内**保持有序又不排序**，可从**末尾往前**归并（words1 已留足空间，把较大的元素往后放，避免覆盖）。复杂度约 **O(n+m)** 次比较（外加移动元素的搬运代价）。不使用任何排序算法。

---

## 第十七部分：往年风格综合大题

**A62**
```c
double get_max_single_day_profit(double prices[], int n) {
    double best = 0;
    for (int i = 0; i <= n - 2; i++) {
        double profit = prices[i+1] - prices[i];
        if (profit > best) best = profit;
    }
    return best;   // 没有正利润时返回 0
}
```

**A63** O(n)：边扫边记「目前为止的最低买入价」，最大利润 = 当前价 − 历史最低价 的最大值。
```c
double get_max_profit(double prices[], int n) {
    double min_price = prices[0], best = 0;
    for (int i = 1; i < n; i++) {
        if (prices[i] - min_price > best) best = prices[i] - min_price;
        if (prices[i] < min_price) min_price = prices[i];
    }
    return best;
}
```
验证 `{1.0,5.1,7.3,9.4,4.7,8.0,15.0,6.2}`：min=1.0，在 i=6 得 15−1=14 → 返回 14.0。✓

**A64**
```c
int is_valid_read(char dna_seq[]) {
    for (int i = 0; dna_seq[i] != '\0'; i++) {
        char c = dna_seq[i];
        if (c != 'A' && c != 'C' && c != 'T' && c != 'G') return 0;
    }
    return 1;
}
```

**A65**
```c
/* 递归辅助：用指针参数把总长度和节点数带出来 */
void accumulate(node_t *root, int *total_len, int *count) {
    if (root == NULL) return;
    word_t *w = (word_t *)root->data;
    int len = 0;
    while (w->word_str[len] != '\0') len++;
    *total_len += len;
    *count += 1;
    accumulate(root->left,  total_len, count);
    accumulate(root->right, total_len, count);
}

double average_word_length_tree(tree_t *word_tree) {
    if (word_tree == NULL || word_tree->root == NULL) return 0;
    int total = 0, count = 0;
    accumulate(word_tree->root, &total, &count);
    if (count == 0) return 0;
    return (double)total / count;
}
```
（无 static、无新数组/动态结构；用前序递归遍历整棵树，O(节点数) 时间。）

---

（答案结束。做错的题回到 `foa_revision.md` 对应章节重看原理。）
