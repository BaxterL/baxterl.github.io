# 旧·背包复制

### 先导

适用于JE1.14-1.16
我的世界的的`data`指令并不能修改玩家的NBT，导致不能整出很多新活。尤其是对于背包的自定义操作，更是麻烦，虽然`replaceitem give`确实能对玩家背包进行修改，可是如果我想实现复制玩家的背包到另一个玩家背包中，这就有点困难了。

### 实现

我们首先要获得玩家背包的数据，你可以存储在storage中也可以存在其他nbt中。

```csharp
#准备事项
setblock 0 0 0 chest
setblock 0 256 0 yellow_shulker_box
replaceitem block 0 0 0 container.0 command_block
tag @p add copyinv
#复制玩家背包
data modify block 0 0 0 Items[0].tag.inv set from entity @p[tag=copyinv,limit=1]
```

现在箱子里命令方块的tag中存储着玩家背包的数据，我们再把它复制到潜影盒中


```csharp
data modify block 0 255 0 Items set from block 0 0 0 Items[0].tag.inv
loot replace entity @p[tag=pasteinv] hotbar.0 mine 0 255 0 minecraft:command_block{drop_contents:true}

#潜影盒最多只能储存27个栏位，所以多出来的物品栏需要再用一个潜影盒来复制
replaceitem block 0 255 0 container.0 command_block
data modify block 0 255 0 Items[0].id set from block 0 0 0 Items[0].tag.inv[{Slot:27b}].id
data modify block 0 255 0 Items[0].Count set from block 0 0 0 Items[0].tag.inv[{Slot:27b}].Count
data modify block 0 255 0 Items[0].tag set from block 0 0 0 Items[0].tag.inv[{Slot:27b}].tag
execute if data block 0 255 0 Items[{id:"minecraft:command_block"}] run replaceitem block 0 255 0 container.0 air
loot replace entity @p[tag=pasteinv] inventory.18 1 mine 0 255 0 command_block{drop_contents:true}

#这边只举其中一个例子，剩下的可以用编程语言循环写出来(当然你手写复制也是行的啦)
```


这样就能把Tag为copyinv的玩家物品栏复制到Tag为pasteinv的玩家物品栏中了。同样也可以对玩家背包进行操纵。

接下来，我们需要更改一下潜影盒的LootTable，让它不掉落本身。


```css
{
    "type": "minecraft:block",
    "pools": [
        {
            "rolls": 1,
            "entries": [
                {
                    "type": "minecraft:alternatives",
                    "children": [
                        {
                            "type": "minecraft:dynamic",
                            "name": "minecraft:contents",
                            "conditions": [
                                {
                                    "condition": "minecraft:match_tool",
                                    "predicate": {
                                        "nbt": "{drop_contents:true}"
                                    }
                                }
                            ]
                        },
                        {
                            "type": "minecraft:item",
                            "functions": [
                                {
                                    "function": "minecraft:copy_name",
                                    "source": "block_entity"
                                },
                                {
                                    "function": "minecraft:copy_nbt",
                                    "source": "block_entity",
                                    "ops": [
                                        {
                                            "source": "Lock",
                                            "target": "BlockEntityTag.Lock",
                                            "op": "replace"
                                        },
                                        {
                                            "source": "LootTable",
                                            "target": "BlockEntityTag.LootTable",
                                            "op": "replace"
                                        },
                                        {
                                            "source": "LootTableSeed",
                                            "target": "BlockEntityTag.LootTableSeed",
                                            "op": "replace"
                                        }
                                    ]
                                },
                                {
                                    "function": "minecraft:set_contents",
                                    "entries": [
                                        {
                                            "type": "minecraft:dynamic",
                                            "name": "minecraft:contents"
                                        }
                                    ]
                                }
                            ],
                            "name": "minecraft:yellow_shulker_box"
                        }
                    ]
                }
            ]
        }
    ]
}
```


### 运用

对玩家背包进行自定义编辑在很多地方都能使用到，虽然它在编写的过程中会比较耗费时间，但是如果用上编程来完成穷举指令，就会方便很多了。
