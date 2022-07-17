# stats

### 语法

> stats block \<x> \<y> \<z> clear <统计>
>
> stats block \<x> \<y> \<z> set <统计> <选择器> <记分项>
>
> stats entity <选择器2> clear <统计>
>
> stats entity <选择器2> set <统计> <选择器> <记分项>

### 参数

`x y z`（仅`block`模式）指定命令统计数据的来源方块所处位置。x 和 z必须是在-30,000,000和30,000,000之间（含，不输入逗号）的整数。可以使用_波浪号_来指定基于命令执行位置的相对坐标。

`选择器2`（仅在`entity`模式中可用）指定发送命令统计的实体。必须为一个玩家名称或目标选择器。

`统计`指定将要被设置或清除选择器和记分项的命令统计。必须为以下之一：

* `AffectedBlocks` — 返回受命令影响的方块的数量。
* `AffectedEntities` — 返回受命令影响的实体的数量。
* `AffectedItems` —返回受命令影响的物品的数量。
* `QueryResult` — 返回命令的查询结果。
* `SuccessCount` — 返回一个命令成功执行的次数。

`选择器`（仅`set`模式）指定一个目标选择器，会在方块或实体执行一个命令后得到解析，此时被指定的实体的记分项会根据统计得到更新。由于前述的非即时解析的特性，此处可以输入任何内容，但只有玩家名字或目标选择器能够产生有意义的结果（不过，玩家名可以是虚假的，即使是该玩家真实存在，也不需要在线）。

`记分项`（仅`set`模式）指定要被`统计`数据更新的记分项名称。由于前述的非即时解析的特性，此处可以输入任何内容，但只有已定义的记分项名称能够产生有意义的结果。

### 实例

我们先创建一个计分板`/scoreboard objectives add score dummy`然后来制作一个简单的检测背包物品数量(低版本的Inventory虽然也能进行检测，但是限制有点多)

首先初始化所有人的分数`/scoreboard players add @a score 0`然后按下面的图片摆放命令方块并输入指令

![](../.gitbook/assets/2021-05-06\_21.32.08.png)

> execute @a \~ \~ \~ clear @s minecraft:apple -1 0
>
> stats entity @a set AffectedItems @s score

~~搭配entitydata和blockdata使用更佳~~
