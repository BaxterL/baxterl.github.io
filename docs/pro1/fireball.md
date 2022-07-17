# 火焰弹

### 先导

本文以1.16作为示范版本。本章将讲解关于实现发射火焰弹。

### 实现

首先把世界原点加入常加载。然后生成一个Marker。

```
summon armor_stand 0.0 0.0 0.0 {Tags:["marker"],Invulnerable:1b,NoGravity:1b}
```

生成火焰弹并再同步玩家facing

```
execute at @s anchored eyes positioned ^ ^ ^1.2 run summon fireball ~ ~ ~ {Motion:[0.0d,0.0d,0.0d],ExplosionPower:1,Tags:["fireball"]}
execute at @s as @e[tag=marker] positioned 0.0 0.0 0.0 run tp ^ ^ ^1.2
data modify entity @e[type=fireball,tag=fireball,limit=1] Motion set from entity @e[type=armor_stand,tag=marker,limit=1] Pos
data modify entity @e[type=fireball,tag=fireball,limit=1] power set from entity @e[type=armor_stand,tag=marker,limit=1] Pos
#(1.13-1.15火焰球的移动靠direction)
```

最后一定记得要清楚盔甲架`kill @e[tag=marker].`

推荐把这些都写进函数里面。

### 运用

不仅仅是火焰弹，它的运用还十分广泛，比如追踪箭、(羊驼的口水)等等都是可以用这些内容做到的。
