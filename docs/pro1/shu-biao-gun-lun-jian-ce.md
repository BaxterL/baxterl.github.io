# 鼠标滚轮检测

### 先导

![](../../.gitbook/assets/2021-09-11\_18.05.52.png)

滚轮是基础交互方式的一种，但是相对于副手检测，Q键检测会难上很多

### 实现

首先我们需要创建三个计分板，分别来作为检测滚轮和获取当前栏位

```
scoreboard objectives add SelSlot dummy
scoreboard objectives add OldSelSlot dummy
scoreboard objectives add wheel dummy "滚轮检测"
```

根据MC指令是从上至下执行的这一原则，我们可以通过在不同时间获取栏位来判断玩家是否滚动滑轮。

```
execute as @a store result score @s SelSlot run data get entity @s SelectedItemSlot
execute as @a if score @s SelSlot > @s OldSelSlot run scoreboard players set @s wheel -1
execute as @a if score @s SelSlot < @s OldSelSlot run scoreboard players set @s wheel 1
execute as @a if score @s SelSlot = @s OldSelSlot run scoreboard players set @s wheel 0
#玩家如果从0号栏滚动到8号栏会出现一些BUG，所以我们要根据这些特殊情况重新设置分数
execute as @a if score @s SelSlot matches 0..2 if score @s OldSelSlot matches 8 run scoreboard players set @s wheel -1
execute as @a if score @s SelSlot matches 6..8 if score @s OldSelSlot matches 0 run scoreboard players set @s wheel 1

#上滚分数1 下滚分数-1
#执行函数
#execute as @a[scores={wheel=1}] run title @s actionbar "你正在向上滚动滚轮"
#execute as @a[scores={wheel=-1}] run title @s actionbar "你正在向下滚动滚轮"

#这里获取栏位的时间会比SelSlot计分板晚
execute as @a store result score @s OldSelSlot run data get entity @s SelectedItemSlot
```

需要注意的是玩家滚动的时候并不是平滑的滚动，如果速度过快会跳过一些栏位，比如从0号栏向上滚动直接滑到6号栏也是有可能的，这时候就会出现BUG。

### 运用

鼠标滚轮检测十分简单，你可以把它运用到一些菜单或者GUI系统中，你也可以用它来固定玩家手持物品(不使用循环`replaceitem`)
