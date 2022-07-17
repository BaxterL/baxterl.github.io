# 闪电箭

### 先导

![](../../.gitbook/assets/2021-05-30\_14.38.52.png)

![](../../.gitbook/assets/2021-05-30\_14.41.09.png)

突然想起这个这个教程还没做，所以就有了这个教程。同样不止闪电箭，你也可以也做出爆炸剑、火焰箭等超多玩法。

### 实现

首先我们需要获得一把特殊的弓。

```
give @s bow{bow:1}
```

接着给所有拿着闪电弓的人一个标记，方便后面选择器不用写这么复杂。

```
scoreboard objectives add bow dummy
#新建一个bow计分板,用于判断玩家所持弓的类型

循环执行:
execute as @a at @s store result score @s bow run data get entity @s SelectedItem.tag.bow
#普通的弓分数是0,闪电弓则是1,如果你需要做其他弓的,更改tag里bow的值就可以了
```

然后我们需要给箭添加标记。

```
接下的循环:
execute as @a[scores={bow=1}] at @s as @e[type=minecraft:arrow,limit=1,tag=!shot_arrow,nbt=!{ShotFromCrossbow:0b,inGround:1b,pickup:0b}] run data merge entity @s {life:1200,Tags:["shot_arrow"],damage:0.5d,CustomPotionEffects:[{Id:27,Amplifier:1,Duration:10000,ShowParticles:0b}]}
#剑的伤害可以根据情况来更改,命中之后会获得霉运1的效果
#Damage:箭将造成的伤害，以半颗心计量。不一定为整数。普通的箭为2.0，发射箭的弓的力量附魔每增加一级，该值增加0.5。只要带有力量附魔，就额外增加0.5（因此，力量I额外给予1.0，而力量II额外给予1.5）

execute as @e[nbt={ActiveEffects:[{Id:27b,Amplifier:1b}]}] run tag @s add shoot_target_lightning
#给命中的生物添加tag
```

既然已经给命中目标添加了tag就可以写相关的功能了。如果你要做爆炸弓的话，建议把苦力怕tp到虚空哦。

```
execute as @e[tag=shoot_target_lightning] run effect clear @s minecraft:unluck
execute as @e[tag=shoot_target_lightning] at @s run summon minecraft:lightning_bolt ~ ~ ~
execute as @e[tag=shoot_target_lightning] run tag @s remove shoot_target_lightning
#循环结束
#建议把这些都写进函数里
```

### 其他

当然它也有很多缺点，如果有需要的话可以匹配nbt里的Owner来做到多人兼容，或者自己重写一个uid系统都是可以的。
