# 简易攻击检测

### 先导

攻击检测有很多种实现方法，这里只举例一种比较简单的方法。首先你要知道`data`指令的相关用法，以及对玩家NBT有一定的熟悉。

### 实现

首先先给予自己一把带有火焰附加的剑

```
give @s diamond_sword{Enchantments:[{id:"minecraft:fire_aspect",lvl:3}]}
#获取一把火焰附加3的钻石剑，造成Fire的数值大概为230s
```

然后循环执行以下指令。（注意，下面的指令用于检测生物被攻击。如果你要检测玩家，记得给玩家加个防火）

```
execute as @e[nbt={Fire:229s}] at @s run say 我被 @p[nbt={SelectedItem:{tag:{Enchantments:[{id:"minecraft:fire_aspect",lvl:3}]}}}] 攻击了
execute as @e[nbt={Fire:229s}] run data modify entity @s Fire set value 0
```

### 其他方法

这种方法其实并不推荐玩家使用。最推荐的做法是检测实体NBT`HurtTime`，然后再用计分板检测玩家是否造成伤害，缺点就是检测玩家一旦变多，容错率就会变高。

还有其他的做法，比如用战利品表谓词、计分板检测被攻击后直接选择最近玩家、用虚拟血量来做战斗系统实现更好的攻击检测等等。
