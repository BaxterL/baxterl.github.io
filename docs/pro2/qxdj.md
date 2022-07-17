# 全息点击

### 先导

只是说看上很炫，用起来也很炫。实用性和多人兼容性低，各位根据情况来判断是否适合使用吧。

本节内容会用上[视线追踪](https://wangzjx.gitbook.io/command-note/problem/expert/sxzz)的知识，请熟练掌握视线追踪的内容。

![](../../.gitbook/assets/2021-10-06\_16.59.36.png)

### 实现

准备工作

```
#非必要准备工作↓
team add menu
team modify menu collisionRule never
team modify menu seeFriendlyInvisibles false
#创建一个新队伍，并把碰撞箱关闭

#必要准备工作↓
scoreboard objectives add click minecraft.custom:minecraft.talked_to_villager
```

菜单(全息按钮)触发执行指令，根据你自己的需求来自定义你的触发方式，别什么都复制粘贴，这个你自己想。


```
#触发时候必须要以玩家为对象，例如:execute as @a run function THIS
team join menu @s
execute as @s at @s anchored eyes positioned ^ ^0.4 ^1.3 run summon villager ~ ~ ~ {Invulnerable:1b,ActiveEffects:[{Ambient:0b,Amplifier:0,Duration:999999,Id:14b,ShowIcon:0b,ShowParticles:0b}],Team:"menu",Silent:1b,NoAI:1b,NoGravity:1b,Tags:["click"]}
#这里只演示一个，如果你想制作一个全息菜单，请自己设计，毕竟我的任务也只是把你教会
#注意如果你没有创建menu队伍，请将村民的TeamNBT删去(不删也一样

execute as @e[tag=click] at @s positioned ~ ~0.5 ~ run summon item ~ ~ ~ {Item:{id:"minecraft:command_block",Count:1b},CustomName:'{"text":"按钮"}',CustomNameVisible:1b,NoGravity:1b,Motion:[0.0d,0.0d,0.0d],PickupDelay:32767,Tags:["menu"]}
#有需要的话可以加上一些音效和粒子
```


接下来循环检测玩家的点击事件。


```
execute as @a[scores={click=1..}] at @s anchored eyes run function ray
#执行视线追踪函数具体见下方
execute as @e[tag=target] run scoreboard players add @s click 1
tag @e remove target
#我比较喜欢用计分板来做触发，因为有时候可能会要求玩家多次进行点击，你用标签也是可以的

#执行部分
execute as @e[scores={click=1},tag=click] at @s run particle totem_of_undying ~ ~ ~ 0 0 0 0.1 5
execute as @e[scores={click=1},tag=click] at @s as @p[scores={click=1}] run tellraw @s {"text": "你点击了全息按钮"}

#最后重置
scoreboard players set @a[scores={click=1..}] click 0
scoreboard players reset @e[tag=click,scores={click=1..}] click
```


```
execute positioned ~-0.5 ~-0.5 ~-0.5 as @e[tag=click,dx=0.5,dy=0.5,dz=0.5] run tag @s add target
execute positioned ^ ^ ^0.5 if entity @s[distance=..5.5] run function sys:ray
```


最后如果你要关闭这个菜单，直接将他们kill掉即可

```
team leave @s
kill @e[tag=click]
kill @e[tag=menu]
#如果你要做多个按钮，最好让他们有一个共同的Tag，这样比较好方便管理
```

### 运用

一个比较方便的交互方式，如果你正迷茫不知道是做书本菜单还是箱子菜单，我想这个更加酷炫的菜单会适合你(或许吧。
