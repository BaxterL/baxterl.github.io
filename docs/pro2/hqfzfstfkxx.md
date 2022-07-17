# 获取放置非实体方块信息

### 实现

这篇文章并不属于是实际应用，但是单独出一个分类也就它一个，暂时就放这里了。

```yaml
{
    "criteria": {
        "test": {
            "trigger": "minecraft:placed_block",
            "conditions": {
                "player": {
                    "nbt": "{Tags:[\"test\"]}"
                }
            }
        }
    },
    "rewards": {
        "function": "minecraft:run"
    }
}
```

这个成就用于检测标签为test的玩家的放置方块事件。

接下来我们可以使用视线追踪来获取他的**物品**信息。

```yaml
#成就激活执行该指令
advancement revoke @s only sys:test
forceload add 0 0 0 0
execute as @s at @s anchored eyes run function sys:ray
tellraw @s [{"text": "方块信息:","color": "gold"},{"nbt":"block","storage": "block"}]
```

```yaml
execute unless block ~ ~ ~ air run clone ~ ~ ~ ~ ~ ~ 0 255 0
execute unless block ~ ~ ~ air run tag @s add stop
setblock 0 255 0 air destroy
execute positioned 0 255 0 as @e[type=item,sort=nearest,limit=1] run data modify storage block block set from entity @s Item.id
execute positioned ^ ^ ^0.5 unless entity @s[tag=stop] if entity @s[distance=..5] run function sys:ray

tag @s remove stop
```

检测玩家放置方块，通过视线追踪获得放置方块坐标，然后获取方块的掉落物从而获得方块信息
