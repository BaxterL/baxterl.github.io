# 视线追踪

### 先导

```
execute anchored
```

execute的子命令anchored我的世界wiki对此的解释为：存储命令环境中执行当前命令的实体的脚到眼睛的距离。在使用**局部坐标时**或者使用朝向命令时更改此命令的基准点为实体脚或眼睛的位置。默认为脚的位置。

### 实现

```
execute as @s anchored eyes positioned ^ ^ ^ run
```

run后面的指令将会在玩家眼睛处执行指令，我们可以利用这个指令加上递归来做到视线追踪。

首先你需要准备一个数据包，并创建一个新函数`ray.mcfunction`和`tick.mcfunction`(或者循环命令方块)

接着在ray函数中输入以下指令

```
#ray函数
execute if entity @p[distance=..5] run particle composter ~ ~ ~ 0 0 0 0.25 1 normal
execute if entity @p[distance=..5] positioned ^ ^ ^0.5 run function minecraft:ray
```

在tick函数或者循环命令方块中输入以下指令

```
execute as @p anchored eyes positioned ^ ^ ^ run function minecraft:ray
```

### 运用

视线追踪的用处十分广泛，比如法杖、检测等等……视线追踪十分简单，并不是很复杂，所以我认为它是进阶指令中一个必学的项目。
