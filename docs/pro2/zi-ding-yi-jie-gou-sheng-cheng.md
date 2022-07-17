# 自定义结构生成

### 先导

如果你想往世界中添加你的自定义结构，那么这篇文章或许能帮当你。阅读这篇文章首先你要掌握结构方块的使用。

### 实现

![](../../.gitbook/assets/2021-10-17\_20.20.16.png)

这是我准备好的三个常用的生成模板，分别对应普通的结构生成、单体结构生成和村庄结构生成。

以上的拼图方块都是一一对应好了的，我会基本的讲解一下拼图方块的用法以及如何让它们产生关系。

#### 拼图方块的使用

首先拼图方块中会要求你填写这几个内容

| 字段   | 填写内容       | 详解                       |
| ---- | ---------- | ------------------------ |
| 目标池  | 数据包目标池路径   | 指的是拼图方块能用于绘制元素的元素池       |
| 名称   | 拼图方块的名称    | 拼图方块的名称                  |
| 目标名称 | 对应的拼图方块名称  | 当结构从目标池中生成时要对接的拼图方块      |
| 转变为  | 生成结构时转变的方块 | 指的是拼图方块在整个功能被放置后会转变的方块状态 |

关于目标池的编写，我们之后在讲解。首先搭建好一个结构，在边缘处放置一个拼图方块并朝向外面，同时在被朝向方块处也放置一个拼图方块让它们互相对应

<mark style="color:green;">**\[结构B:拼图方块/名称:a] ->  <- \[结构A:拼图方块/目标名称:a]**</mark>

(希望你能看懂。

那么结构A生成时就会通过拼图方块的目标池生成结构B。

那么让我们来定义第一个目标池

```json
{
    "name": "bx:teach",
    "fallback": "minecraft:empty",
    "elements": [
        {
            "weight": 1,
            "element": {
                "location": "结构A路径",
                "processors": "empty",
                "projection": "rigid",
                "element_type": "minecraft:legacy_single_pool_element"
            }
        }
    ]
}
#结构A路径填写结构方块中的路径
```

首先这个目标池并不是用来放进拼图方块里面的

```json
{
    "type": "minecraft:bastion_remnant",
    "config": {
        "start_pool": "bx:teach",
        "size": 3
    }
}
```

这个是用来在世界生成你的结构的，接下来我们要在世界任意一个生物群戏中塞个这个结构的生成

```

{
  "scale": 0.05,
  "effects": {
    "mood_sound": {
      "sound": "minecraft:ambient.cave",
      "tick_delay": 6000,
      "block_search_extent": 8,
      "offset": 2.0
    },
    "sky_color": 7907327,
    "fog_color": 12638463,
    "water_color": 4159204,
    "water_fog_color": 329011
  },
  "surface_builder": "minecraft:grass",
  "carvers": {
    "air": [
      "minecraft:cave",
      "minecraft:canyon"
    ]
  },
  "features": [
    [],
    [
      "minecraft:lake_water",
      "minecraft:lake_lava"
    ],
    [],
    [
      "minecraft:monster_room"
    ],
    [],
    [],
    [
      "minecraft:ore_dirt",
      "minecraft:ore_gravel",
      "minecraft:ore_granite",
      "minecraft:ore_diorite",
      "minecraft:ore_andesite",
      "minecraft:ore_coal",
      "minecraft:ore_iron",
      "minecraft:ore_gold",
      "minecraft:ore_redstone",
      "minecraft:ore_diamond",
      "minecraft:ore_lapis",
      "minecraft:disk_sand",
      "minecraft:disk_clay",
      "minecraft:disk_gravel"
    ],
    [],
    [
      "minecraft:patch_tall_grass_2",
      "minecraft:plain_vegetation",
      "minecraft:flower_plain_decorated",
      "minecraft:patch_grass_plain",
      "minecraft:brown_mushroom_normal",
      "minecraft:red_mushroom_normal",
      "minecraft:patch_sugar_cane",
      "minecraft:patch_pumpkin",
      "minecraft:spring_water",
      "minecraft:spring_lava"
    ],
    [
      "minecraft:freeze_top_layer"
    ]
  ],
  "starts": [
    "minecraft:village_plains",
    "minecraft:pillager_outpost",
    "minecraft:mineshaft",
    "minecraft:stronghold",
    "minecraft:ruined_portal",
    "bx:teach"
  ],
  "spawners": {
    "monster": [
      {
        "type": "minecraft:spider",
        "weight": 100,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:zombie",
        "weight": 95,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:zombie_villager",
        "weight": 5,
        "minCount": 1,
        "maxCount": 1
      },
      {
        "type": "minecraft:skeleton",
        "weight": 100,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:creeper",
        "weight": 100,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:slime",
        "weight": 100,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:enderman",
        "weight": 10,
        "minCount": 1,
        "maxCount": 4
      },
      {
        "type": "minecraft:witch",
        "weight": 5,
        "minCount": 1,
        "maxCount": 1
      }
    ],
    "creature": [
      {
        "type": "minecraft:sheep",
        "weight": 12,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:pig",
        "weight": 10,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:chicken",
        "weight": 10,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:cow",
        "weight": 8,
        "minCount": 4,
        "maxCount": 4
      },
      {
        "type": "minecraft:horse",
        "weight": 5,
        "minCount": 2,
        "maxCount": 6
      },
      {
        "type": "minecraft:donkey",
        "weight": 1,
        "minCount": 1,
        "maxCount": 3
      }
    ],
    "ambient": [
      {
        "type": "minecraft:bat",
        "weight": 10,
        "minCount": 8,
        "maxCount": 8
      }
    ],
    "water_creature": [],
    "water_ambient": [],
    "misc": []
  },
  "spawn_costs": {},
  "player_spawn_friendly": true,
  "precipitation": "rain",
  "temperature": 0.8,
  "downfall": 0.4,
  "category": "plains",
  "depth": 0.125
}
```

注意这里是对minecraft/worldgen的修改

接下才是对拼图方块目标池的修改

```
{
    "name": "bx:t1way",
    "fallback": "empty",
    "elements": [
        {
            "weight": 1,
            "element": {
                "location": "bx:t2",
                "processors": "minecraft:empty",
                "projection": "rigid",
                "element_type": "minecraft:single_pool_element"
            }
        },
        {
            "weight": 1,
            "element": {
                "location": "bx:t3",
                "processors": "minecraft:empty",
                "projection": "rigid",
                "element_type": "minecraft:single_pool_element"
            }
        }
    ]
}
```

由于在gitbook写文章体验极度不佳，我扔一个我数据包的链接，你们慢慢研究吧(虽然我觉得文字说明的话也没多少人能看懂。

loop.json是村庄生成模板

![](../../.gitbook/assets/1.gif)

↑被气疯的一个小点

传送门✅[https://www.mcbbs.net/thread-1273515-1-1.html](https://www.mcbbs.net/thread-1273515-1-1.html)
