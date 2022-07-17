# 计分板运算

本文使用1.12格式，适用于全版本

## 随机数和取极值

首先你需要创建一个计分板名为`score`的计分板

准备工作

> scoreboard players set max score -2147483648
>
> scoreboard players set min score 2147483648



### 取最大值 

> execute @e \~ \~ \~ scoreboard players operation max score > @e\[c=1] score

### 取最小值

> execute @e \~ \~ \~ scoreboard players operation min score < @e\[c=1] score

以每个实体执行一次，以计分板最大分数与实体进行比较，如果实体的分数更小，就替换掉当前最小值的分数。

### 随机数

在高版本中可以通过修改战利品来实现随机数，低版本则需要依靠实体来实现随机数。

本文是以1.12举例，所以这里会讲解一个关于1.12随机数的基本逻辑。

生成10个AEC，分别赋予每个AEC 0-9的分数，假如你需要随机十位数，可以把第二次随机的结果\*10再加上第一次随机的结果。

## 检测数值

### 检测数值变化

相信检测数值变化在许多运用中能够派上用场，对于1.13+而言只需要unless score是否相等就可以做到，如果你是低版本的话就可能需要用上计分板进行一些计算。

> execute @s \~ \~ \~ scoreboard players operation @s old -= @s new
>
> 根据所需情况来判断分数变化，并执行指令
>
> > 假设当前在对我的分数进行减一
> >
> > execute @s\[score_old_\__min=1] \~ \~ \~ say 我的分数减少了

> execute @s \~ \~ \~ scoreboard players operation @s old = @s new
