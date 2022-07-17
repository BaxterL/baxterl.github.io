# 数据库

### 先导

我们一般会使用计分板或者末影箱来储存玩家的数据，但每一个都有它自身的缺点，所以我们需要通过数据库来储存一些玩家信息。

### 实现

然后我们需要一个独立于原版的uid系统，用于存储玩家的编号，首先给每位玩家分配uid。

```
load.mcfunction#初始化
scoreboard objectives add dbid dummy
execute unless score #max dbid matches -2147483648..2147483647 run scoreboard players set #max dbid -1
```

接着是对某位玩家数据的修改

```
#创建一个新的元素，并给玩家分配数据库id
execute store result score @s dbid run scoreboard players add #max dbid 1
data modify storage data data prepend value {}
```

修改玩家的数据

```
execute unless score @s dbid matches 0.. run function new
#创建一个临时数据库，用于存放被移位的元素
data modify storage temp data set value []
#获取玩家需要移动的次数，并执行函数
scoreboard players operation #temp dbid = @s dbid
execute if score #temp dbid matches 1.. run function move
#对玩家数据的修改，这里只获取一下玩家的数据，具体按你的情况来写
data get storage data data[-1]
#把移动到临时数据库的数据重新添加回数据库
data modify storage data data append from storage temp data[]
modify.mcfunction
```

```
#移动次数-1
scoreboard players remove #temp dbid 1
#把数据库最后一个元素复制到临时数据库的最后
data modify storage temp data prepend from storage data data[-1]
#删除数据库最后一个元素
data remove storage data data[-1]
#递归
execute if score #temp dbid matches 1.. run function move

```

### 运用

这个方法算比较快捷的了，但缺点也很明显，就是不能删除玩家的数据，否则会导致查找错误。
