# 会话六任务书 · ETIM-Extra 盾面立项摸底（R196 一手）

我们是 DeepSeek，不要吝惜真实 API 测试。

## 0 身份与边界

- 你是主 mod 项目的「会话六」：R196 一手资料库（decompile 树）+ 立项摸底/对照报告撰写方（角色由 `etim-mapping` skill 承载）。
- **判值只能来自 R196 一手**：反编译 `src` 与 `javap` 双源互证。二手文档（`mite-src/references/**`、`R196判决值总表.md` 等）只作交叉核对与「先例」，**不得当判值**。
- 只读检索：不改任何源码、不落码、不写实现。**本件只做摸底（一手 + 落差清单）**；1.12.2 对位/公式/伪代码属本会话第二阶段（对照报告），待 ETIM-Extra 主会话确认摸底后再出。下游终审 = 会话五。
- 判决源根目录（只读）：`D:\OpenCodeWorkspace\Easy Times In Minecraft\`
  - R196 反编译树：`mite-src\decompile\src\net\minecraft\...`
  - javap 卷：`mite-src\javap_T9B\`、`javap_T11\`、`javap_T14\`~`T17\`
  - 二手先例（只作参照）：`mite-src\references\MITE-RB-2025\`、`mite-src\references\ICPM\`
- 落盘：`D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-立项摸底.md`（UTF-8 无 BOM、LF）。

## 1 项目背景（自含，不需外部上下文）

ETIM-Extra 是主 mod「Easy Times In Minecraft (etim)」的附属 mod（1.12.2 Forge），新增两件盾：**秘银盾（mithril shield）**、**艾德曼盾（adamantium shield）**。

主 mod 已落 AD-10+SH 盾面裁定：

- 1.12 盾的「全免」段（`EntityLivingBase.java:996-1012`，`amount = 0`）已被 `MixinEntityLivingBaseBlock` 关闭；
- 所有 `Item#isShield` 载体在 `LivingHurtEvent` 上半减（`amount × blockDamageFactor`，下限 `blockMinDamage=1.0`），其后接主 mod 的 R196 减算链；
- 磨损 = `(int)(blocked × shieldWearRate)`（rate 默认 1.0；336 耐久 = 42 击），不乘工具 25×raw 通道。

本项目要判的**只剩盾物品本身的玩家可感知数值**：耐久、磨损率、配方、附魔度、品质、格挡语义。机制面不再议。

## 2 检索面（逐面给 `文件:行号` 一手行号；负证也要给检索式与命中数）

### 面 A · 盾存在性负证（必做，阻断级）

- **A-1** R196 全树是否存在盾物品：`ItemShield` 类 / `Item` 的盾子类 / `isShield` 覆写 / 盾的注册名/纹理/配方？给出检索命令与命中结果（0 命中须列检索式与覆盖面：`src` 全树 + `assets` 纹理 + 配方表/合成台逻辑）。
- **A-2** R196 的「格挡」是否只有工具 `canBlock` 一条路？给 `ItemTool.java` 的 `canBlock` 与各覆写族（Dagger / Hatchet / Hoe / Mattock / Shears / Cudgel）的 `文件:行号`。

### 面 B · 材料行（秘银 / 艾德曼）

- **B-1** `Material.java`：秘银、艾德曼（及 ancient 作锚）的 `durability`、`damageVsEntity`(getDamageVsEntity)、`harvestLevel`、`efficiency`，逐值给行号。
- **B-2** `EnumEquipmentMaterial.java`：两金属的附魔度、`max_quality`（枚举序 + 语义）。
- **B-3** `ItemArmor.java:36-43`（护甲耐久公式）与 `:49-50`（甲点）；给出「胸甲 8 件」等 component 表出处。
- **B-4** `ItemTool` 工具耐久 ×100 的规则出处（哪一行把 `Material.durability` 乘 100）。

### 面 C · 格挡减算链（只取与「盾若按工具口径」相关的段）

- **C-1** `Damage.applyTargetDefenseModifiers`（约 `:195-231`）逐行：半减、`<1.0 → 1.0` 地板、磨损 `(int)(amount × decay)`。
- **C-2** 各载体 decay 值表（`getToolDecayFromAttackingEntity` 或等价）——剑/镐/斧/锹/战锤/战斧/镰/匕首等逐值。
- **C-3** 盾无对应行时，R196 侧可依据的最近邻载体是哪几类：只列类别与 decay 值（不做 1.12 换算，不给公式）。

### 面 D · 二手先例（明确标注「先例，不作判值」）

- **D-1** `mite-src\references\MITE-RB-2025\...\ShieldTier.java` 与 `ItemRegistry`（wooden_shield `maxDamage 15` / protectionLevel 0，vanilla shield protectionLevel 2）。
- **D-2** `mite-src\references\ICPM\ICPM更新日志.md` 装盾（工具+盾合成、减半、不挡箭、不免疫击退）。

## 3 交付格式（逐位核讫报告）

1. **判决类清单**：A/B/C/D 逐面列判点。
2. **逐位核讫表**：`面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论`。
3. **负证表**：检索式 + 命中数 + 覆盖范围（无命中也必须成行）。
4. **落差清单（不产公式）**：R196 侧可用于推导盾耐久的材料行清单——哪些行存在、哪些行根本不存在；并逐项列出「R196 无盾」造成的落差（耐久 / 磨损 / 配方 / 附魔度 / 品质各自有无可依据的 R196 行）。1.12.2 对位公式、候选值与伪代码进本会话第二阶段的对照报告，不在本件交付。
5. **冲突分级**：A（阻断）/ B（需 ETIM-Extra 主会话裁）/ C（登记）。

## 4 禁止

- 不得把二手文档数值当 R196 判值；
- 不得从 1.12 反推 R196；
- 不得产出 1.12.2 落法、候选公式或伪代码（本件不交付；属本会话第二阶段的对照报告）；
- 不得改任何源码，不得写实现代码；
- 不得省略负证（「没找到」必须带检索式与命中数）。
