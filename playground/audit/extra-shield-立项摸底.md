# R196 盾面立项摸底（ETIM-Extra · 秘银盾 / 艾德曼盾 · 4 组 11 面）

| 项 | 值 |
|---|---|
| 文档性质 | **立项摸底**（一手摘录 + 负证 + 落差清单 + 冲突分级）——**不落码、不对位、不裁定、不产公式** |
| 项目 | ETIM-Extra（modid `etimextra`），主 mod「Easy Times In Minecraft (etim)」附属，1.12.2 Forge |
| 批次 | 盾面首批（秘银盾 mithril shield / 艾德曼盾 adamantium shield） |
| 上游 | `D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\audit-extra-裁定回执.md` 条 2（盾面口径 b+c）、条 3（过程草案，已由条 9 判为「不作判值」）、条 10（身份规范 v2） |
| 任务书 | `D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-立项摸底-任务书.md`（面号 A-1…D-2 冻结） |
| 受托方 | 会话六（`etim-mapping` 承载，主 mod 项目出借） |
| 判决源根 | `D:\OpenCodeWorkspace\Easy Times In Minecraft\`（只读） |
| 日期 | 2026-10-28 |
| 落码态 | 本件**零产品码**：未改任何 java/json/lang/config/gradle，未起服、未构建、未跑 gradle、未动 git |
| 判值纪律 | ① 值只取 R196 一手（反编译 `src` + `javap` 双源互证）；② 二手（`mite-src/references/**`、账本、他项目 javadoc）只作「先例」，逐处标「先例，不作判值」；③ 负证必带检索式 + 命中数 + 覆盖范围；④ 不从 1.12 反推 R196；⑤ 禁推断，推断处标 `?` |

**判决源与引用写法（一次性声明）**

| 代号 | 路径 | 引用写法 |
|---|---|---|
| ① R196 反编译树（一手） | `mite-src\decompile\src\net\minecraft\`（1867 个 `.java`）+ `mite-src\decompile\src\assets\`（882 个资源文件） | **裸文件名**：`ItemTool.java:54` |
| ② R196 字节码（一手，双源） | `mite-src\tools\1.6.4-MITE-named.jar`（2803 条目）；本轮新出 javap 卷 31 件 → `ETIM-Extra\playground\audit\extra-shield-javap\` | **`javap_<类>.txt`** |
| ③ 二手先例（**不作判值**） | `mite-src\references\MITE-RB-2025\`、`mite-src\references\ICPM\` | 显式写「先例」+ 路径 |

**范围裁定（上游条 2，本件照此不越界）**：盾面机制面（全免关闭、半减、`shieldWearRate` 磨损、1.0 地板）已由主 mod AD-10+SH 落定，**本件不议机制**；本件只查「盾物品本身的数值在 R196 侧有没有一手来源」。1.12.2 的盾底座（336 耐久一类）属 1.12 面，**本件不引用、不反推**。

---

## §0 判决类清单（4 组 11 面）

| 组 | 面 | 判点（一句） | 状态 | 结论（一句） |
|---|---|---|---|---|
| A 存在性负证 | **A-1** | R196 全树是否有盾物品（类／子类／`isShield`／注册名／纹理／配方） | ✗ | **不存在**。树 2753 文件、jar 2803 条目、纹理 211 件、配方族 11 类、lang 3 档，`shield`／`盾` **全 0 命中** |
| A | **A-2** | R196 的「格挡」是否只有工具 `canBlock` 一条路 | ✓ | **是**。`ItemTool.canBlock()` 默认 `true`（`:54-56`），7 个子类覆写（6 假 1 真），无第二条独立入口 |
| B 材料行 | **B-1** | 秘银／艾德曼（ancient 作锚）的 durability／damageVsEntity／harvestLevel／efficiency 逐值 | ✓ | 64.0／5.0／4／2.5；256.0／6.0／5／3.0；16.0／4.0／3／2.0（全部双源） |
| B | **B-2** | 两金属的附魔度与 `max_quality`（枚举序 + 语义） | ✓ | enchant **100／40**；`max_quality` 均 **legendary**（ordinal 7，耐久修饰 **3.5×**） |
| B | **B-3** | `ItemArmor` 护甲耐久公式与甲点表；component 表出处 | ✓ | 公式 `:36-43`（非锁甲 ×2）；甲点表实为 `:45-74`（mithril 9／adamantium 10）；component 5/8/7/4 |
| B | **B-4** | `ItemTool` 把 `Material.durability` 乘 100 的出处 | ✓ | `:40-42`（`4.0F × components × durability × 100.0F` 取整）；基值在 `:36-38` |
| C 减算链 | **C-1** | `Damage.applyTargetDefenseModifiers` 半减／1.0 地板／磨损乘算 | ✓ | `:197-210`；磨损 = `(int)(半减后 amount × getToolDecayFromAttackingEntity)` 且仅 `instanceof ItemTool` |
| C | **C-2** | 各载体 decay 值表 | ✓ | 基值 0.25～4.0；落点 `max((int)(100×base),1)` 覆盖 **15 个载体类、8 个不同落点**（25／50／66／75／100／133／200／400） |
| C | **C-3** | 盾无对应行时最近邻载体类别（只列类别 + decay） | ✓ | 三簇：**25/50**（轻击类）、**66/75/100/133**（中段）、**200/400**（重耗类） |
| D 二手先例 | **D-1** | MITE-RB-2025 的盾实现（`ShieldTier` + `ItemRegistry`） | ✓（先例） | 木盾 `maxDamage 15` + `protectionLevel 0`；vanilla 盾 `protectionLevel 2`；该值用于「伤害阈值」而非耐久 |
| D | **D-2** | ICPM 装盾（工具+盾合成、减半、不挡箭、不免疫击退） | ✓（先例） | `ICPM更新日志.md:933-941`，明写「仅伤害减半（下限 1）+ 工具扣耐久；不挡箭、不免疫击退」 |

**状态符号**：`✓` 一手确认；`✗` 一手明确不存在；`?` 待裁／近似。本件分布 = **`✓ 10`／`✗ 1`（A-1）／`? 0`**。

**面 ≠ 文件**：A-2 与 C-1／C-2 共用同一批类，不各自对应文件；本件不改任何文件。

---

## §1 面 A · 盾存在性负证（阻断级）

### A-1 R196 全树无盾物品 — ✗（不存在）

**判点**：R196 是否存在盾物品的四种形态之一——① `ItemShield` 类；② `Item` 的盾子类；③ `isShield` 覆写；④ 盾的注册名／纹理／配方。

**逐位核讫表**

| 面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| A-1① | 是否存在 `ItemShield` 类 | 负证（§5 N-1／N-2） | 无原文（类不存在）；`javap net.minecraft.ItemShield` → `找不到符号: net.minecraft.ItemShield` | ✗ |
| A-1② | `Item` 的盾子类（`Item*.java` 104 个） | `mite-src\decompile\src\net\minecraft\` 文件名枚举 | 104 个 `Item*` 类中无 `ItemShield`／`ItemBuckler`／`ItemTarge` 类名 | ✗ |
| A-1③ | `isShield` 覆写／字段 | 负证（§5 N-1） | 全树 `shield` 大小写无关 **0 命中** ⇒ 无该方法、无该字段 | ✗ |
| A-1④ | 注册名 | `Item.java:834-840`（注册机制本身存在） | `this.itemID = 256 + par1;`／`itemsList[256 + par1] = this;` | 机制在，盾的注册项 ✗ |
| A-1⑤ | 纹理 | `assets/minecraft/textures/items\`（211 件） | 211 个图标名中无 `shield`（含 `wooden_shield`／`iron_shield`） | ✗ |
| A-1⑥ | 配方 | 11 个 `Recipes*.java` + `CraftingManager.java` 全表 | 全树 `shield` **0 命中** ⇒ 无盾配方行 | ✗ |
| A-1⑦ | 语言条目 | `assets/minecraft/lang\{en_US,zh_CN,zh_TW}.lang` | `shield` **0**、`盾` **0** | ✗ |

**结论**：R196 **完全没有盾**。四种形态、五个载体（代码类／注册项／纹理／配方／语言）逐一落空，且落空方式一致（同一个 `shield`／`盾` 检索式在 2753 个文件上 0 命中），不存在「换了名字的等价物」。

**④ 判据锚**：本面的判据就是 §5 的命中数（`0`）。任何后续声称「R196 盾的耐久是 N」的说法，**其一手出处必然不存在**——这是本件最重要的一条阻断结论。

### A-2 R196 的「格挡」只有工具 `canBlock` 一条路 — ✓

**判点**：R196 玩家进入格挡态的入口是否唯一？若唯一，则「盾若按工具口径」这件事本身是否成立？

| 面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| A-2① | 基类默认可格挡 | `ItemTool.java:54-56` | `public boolean canBlock() {`／`return true;` | ✓ 默认真（所有工具） |
| A-2② | 覆写：匕首 | `ItemDagger.java:19-22` | `@Override`／`public boolean canBlock() { return false; }` | ✗ 假 |
| A-2③ | 覆写：短柄斧 | `ItemHatchet.java:24-27` | 同上形 | ✗ 假 |
| A-2④ | 覆写：锄 | `ItemHoe.java:25-28` | 同上形 | ✗ 假 |
| A-2⑤ | 覆写：锹镐两用 | `ItemMattock.java:18-21` | 同上形 | ✗ 假 |
| A-2⑥ | 覆写：剪 | `ItemShears.java:26-29` | 同上形 | ✗ 假 |
| A-2⑦ | 覆写：短棍 | `ItemCudgel.java:26-29` | 同上形 | ✗ 假 |
| A-2⑧ | 覆写：木棒（回翻真） | `ItemClub.java:19-22` | `public boolean canBlock() {`／`return true;` | ✓ 真（唯一回翻子类） |
| A-2⑨ | 起手入口 | `ItemTool.java:226-234` | `if (this.canBlock()) {`／`player.setHeldItemInUse();` | ✓ 唯一起手点 |
| A-2⑩ | 动作门（全员 BLOCK） | `ItemTool.java:216-219` | `public EnumItemInUseAction getItemInUseAction(...) {`／`return EnumItemInUseAction.BLOCK;` | ✓ 工具一律 BLOCK |
| A-2⑪ | 使用时长 | `ItemTool.java:221-224` | `return 72000;` | ✓ |
| A-2⑫ | 判定口径 | `EntityPlayer.java:205-206` | 原文 2 行压写：`return this.isUsingItem() && Item.itemsList[this.itemInUse.itemID].getItemInUseAction(this.itemInUse, this) == EnumItemInUseAction.BLOCK;` | ✓ 单手持槽，无副手 |
| A-2⑬ | 减伤落点唯一 | `Damage.java:197` | `if (!this.bypassesMundaneArmor() && player.isBlocking()) {` | ✓ 唯一格挡减伤入口 |

**结论**：格挡入口三件套 = **`canBlock()`（能否起手）+ `getItemInUseAction()==BLOCK`（起手后状态）+ `player.isBlocking()`（减伤判定）**，三者都在 `ItemTool` 家族内，且 `Damage` 侧只认 `ItemTool` 实例（`C-1` 表）。**R196 没有"非工具也能格挡"的第二条路**——这一点决定了「盾若按工具口径」不是类比，而是 R196 唯一的格挡形态。

**注意（关系面，属 C 级）**：`getItemInUseAction()` 对**所有** `ItemTool` 都返回 BLOCK，而 `canBlock()` 只挡"起手"。因此"能否格挡"实际上被 `canBlock()` 一处收口——这也解释了为什么 7 个覆写里 6 个是 `false`。

---

## §2 面 B · 材料行（秘银 / 艾德曼，ancient 作锚）

### B-1 `Material` 四值逐位 — ✓

| 面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| B-1① | mithril 材料声明 | `Material.java:59-63` | `public static final Material mithril = new Material(EnumEquipmentMaterial.mithril)`／`.setMinHarvestLevel(4);` | ✓ level 4 |
| B-1② | adamantium 材料声明 | `Material.java:64-69` | `public static final Material adamantium = new Material(EnumEquipmentMaterial.adamantium)`／`.setMinHarvestLevel(5);` | ✓ level 5（另 `.setHarmedByLava(false)` `:67`） |
| B-1③ | ancient_metal（锚） | `Material.java:54-58` | `.setMetal(true)`／`.setMinHarvestLevel(3);` | ✓ level 3 |
| B-1④ | durability 字段与复制 | `Material.java:199`、`:216-221` | `protected float durability;`／`this.setDurability(enum_crafting_material.durability);` | ✓ 值来自材料枚举 |
| B-1⑤ | mithril damageVsEntity | `Material.java:469-471` | `if (this == mithril) {`／`return 5.0F;` | ✓ 5.0F |
| B-1⑥ | adamantium damageVsEntity | `Material.java:473-475` | `if (this == adamantium) {`／`return 6.0F;` | ✓ 6.0F |
| B-1⑦ | ancient damageVsEntity | `Material.java:465-467` | `if (this == ancient_metal) {`／`return 4.0F;` | ✓ 4.0F |
| B-1⑧ | 工具侧 harvestLevel 换算 | `ItemTool.java:62-66` | 原文 3 行压写：`return this.effective_material.min_harvest_level == 0 ? 0 : (isMetal() ? min_harvest_level : min_harvest_level - 1);` | ✓ 两材料 `isMetal()` 为真 ⇒ 不减 |
| B-1⑨ | mithril efficiency | `ItemTool.java:101-103` | `if (this.effective_material == Material.mithril) {`／`return 2.5F;` | ✓ 2.5F |
| B-1⑩ | adamantium efficiency | `ItemTool.java:105-107` | `if (this.effective_material == Material.adamantium) {`／`return 3.0F;` | ✓ 3.0F |
| B-1⑪ | ancient efficiency | `ItemTool.java:113-115` | `if (this.effective_material == Material.ancient_metal) {`／`return 2.0F;` | ✓ 2.0F |

**终版逐值表（双源：R196 源码 + javap 字节码）**

| 材料 | `durability` | `getDamageVsEntity()` | `min_harvest_level` | 工具侧有效 harvestLevel | `getMaterialHarvestEfficiency()` |
|---|---|---|---|---|---|
| **mithril** | **64.0F**（`EnumEquipmentMaterial.java:14`；`Material.java:218` 复制） | **5.0F**（`Material.java:469-471`） | **4**（`Material.java:63`） | **4**（`ItemTool.java:62-66`，金属不减） | **2.5F**（`ItemTool.java:101-103`） |
| **adamantium** | **256.0F**（`EnumEquipmentMaterial.java:15`） | **6.0F**（`Material.java:473-475`） | **5**（`Material.java:69`） | **5** | **3.0F**（`ItemTool.java:105-107`） |
| **ancient_metal**（锚） | **16.0F**（`EnumEquipmentMaterial.java:13`） | **4.0F**（`Material.java:465-467`） | **3**（`Material.java:58`） | **3** | **2.0F**（`ItemTool.java:113-115`） |

**javap 双源核对**（卷 `javap_EnumEquipmentMaterial.txt` / `javap_Material.txt` / `javap_ItemTool.txt`）：

- `mithril` 常量构造：`bipush 10`（ordinal）→ `ldc // float 64.0f` → `bipush 100` → `getstatic EnumQuality.legendary`。
- `adamantium`：`bipush 11` → `ldc // float 256.0f` → `bipush 40` → `getstatic EnumQuality.legendary`。
- `ancient_metal`：`bipush 9` → `ldc // float 16.0f` → `bipush 40` → `getstatic EnumQuality.masterwork`。
- `getDamageVsEntity`：`getstatic mithril` → `ldc_w // float 5.0f`；`getstatic adamantium` → `ldc_w // float 6.0f`。
- `getMultipliedDurability`：`getBaseDurability()` → `getNumComponentsForDurability()` → `Material.durability` → `ldc // float 100.0f` → `f2i`。

**注意（C 级陷阱）**：`Material.setMetal(boolean)` 的形参是 **`is_harmed_by_acid`**（`Material.java:367-371`：`this.is_metal = true; this.setHarmedByAcid(is_harmed_by_acid);`）——`setMetal(false)` 的含义是「**是金属但不怕酸**」，不是「非金属」。mithril（`:61`）与 adamantium（`:66`）都写 `setMetal(false)`，二者 `isMetal()` 均为 **true**。任何按"字面读成非金属"的推导都错。

### B-2 `EnumEquipmentMaterial` 附魔度与 `max_quality` — ✓

| 面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| B-2① | mithril 行 | `EnumEquipmentMaterial.java:14` | `mithril(64.0F, 100, EnumQuality.legendary, "mithril"),` | ✓ 附魔 100／legendary |
| B-2② | adamantium 行 | `EnumEquipmentMaterial.java:15` | `adamantium(256.0F, 40, EnumQuality.legendary, "adamantium"),` | ✓ 附魔 40／legendary |
| B-2③ | ancient 行（锚） | `EnumEquipmentMaterial.java:13` | `ancient_metal(16.0F, 40, EnumQuality.masterwork, "ancient_metal"),` | ✓ masterwork |
| B-2④ | 字段可见性 | `EnumEquipmentMaterial.java:22-25` | `public final float durability;`／`public final int enchantability;` | ✓ **public**（跨包可读） |
| B-2⑤ | 质量枚举序与语义 | `EnumQuality.java:5-13` | `wretched(...0.5F)`／`poor(...0.75F)`／`average(...1.0F)`／`fine(...1.5F)`／`excellent(...2.0F)`／`superb(...2.5F)`／`masterwork(...3.0F)`／`legendary("legendary", "Legendary", 3.5F);` | ✓ 8 档，ordinal 0…7 |
| B-2⑥ | 修饰符取用 | `EnumQuality.java:31-33` | `public float getDurabilityModifier() {`／`return this.durability_modifier;` | ✓ 只用于耐久乘算 |
| B-2⑦ | 品质上限来源 | `Material.java:204`、`:220` | `private EnumQuality max_quality = EnumQuality.getHighestQuality();`／`this.setMaxQuality(enum_crafting_material.max_quality);` | ✓ 由材料带入 |

**枚举序（终版）**：`wretched(0, ×0.5) < poor(1, ×0.75) < average(2, ×1.0) < fine(3, ×1.5) < excellent(4, ×2.0) < superb(5, ×2.5) < masterwork(6, ×3.0) < legendary(7, ×3.5)`。

**语义**：`max_quality` 是**该物品能被打造／开出／洗出的品质上限**，不是固定品质；`durability_modifier` 只在 `Item.maxDamage` 上做乘算（见 B-3 脚注与 §6.3「品质」）。

### B-3 `ItemArmor` 护甲耐久公式与甲点表 — ✓（含一处行号勘误）

| 面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| B-3① | 护甲耐久公式 | `ItemArmor.java:36-43` | `float durability = this.getNumComponentsForDurability() * this.effective_material.durability;`／`if (!this.is_chain_mail) { durability *= 2.0F; }` | ✓ 与任务书所指行号一致 |
| B-3② | 甲点表实际范围 | `ItemArmor.java:45-74` | `public int getMaterialProtection() {`（`leather 2` … `adamantium 10`） | ✓ **`:49-50` 只是 rusted_iron=6 分支**（勘误 E-1） |
| B-3③ | mithril 甲点 | `ItemArmor.java:59-60` | `} else if (this.effective_material == Material.mithril) {`／`protection = 9;` | ✓ 9 |
| B-3④ | adamantium 甲点 | `ItemArmor.java:61-67` | `protection = 10;`（`adamantium` 分支内） | ✓ 10 |
| B-3⑤ | 锁甲减 2 | `ItemArmor.java:69-71` | `if (this.is_chain_mail) {`／`protection -= 2;` | ✓ |
| B-3⑥ | component 表：盔 | `ItemHelmet.java:13-16` | `public int getNumComponentsForDurability() {`／`return 5;` | ✓ 5 |
| B-3⑦ | component 表：**胸甲 8 件** | `ItemCuirass.java:13-16` | `public int getNumComponentsForDurability() {`／`return 8;` | ✓ **8**（任务书所指「胸甲 8 件」即此行） |
| B-3⑧ | component 表：腿 | `ItemLeggings.java:13-16` | `return 7;` | ✓ 7 |
| B-3⑨ | component 表：靴 | `ItemBoots.java:13-16` | `return 4;` | ✓ 4 |
| B-3⑩ | 覆盖率概念 | `ItemArmor.java:360-367` | `float coverage = this.getNumComponentsForDurability() / 24.0F;` | ✓ 甲位总分母 24 |
| B-3⑪ | 护甲品质门 | `ItemArmor.java:260-263` | `public boolean hasQuality() {`／`return true;` | ✓ 护甲**也**吃品质乘算 |

**勘误 E-1（相对任务书行号）**：任务书写「`:49-50`（甲点）」——实际 `:49-50` 是 `rusted_iron → 6` 的分支；**甲点全表在 `:45-74`**，mithril 在 `:59-60`、adamantium 在 `:61-67`。判定结论不变（mithril 9／adamantium 10），仅行号归位。

### B-4 `ItemTool` 耐久 ×100 的出处 — ✓

| 面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| B-4① | 乘 100 的那一行 | `ItemTool.java:40-42` | `return (int)(this.getBaseDurability() * this.getNumComponentsForDurability() * this.effective_material.durability * 100.0F);` | ✓ **`:41` 即「×100」** |
| B-4② | 基值 4.0 | `ItemTool.java:36-38` | `public final float getBaseDurability() {`／`return 4.0F;` | ✓ 4.0F |
| B-4③ | 落地到 maxDamage | `ItemTool.java:25` | `this.setMaxDamage(this.getMultipliedDurability());` | ✓ 唯一落地点 |
| B-4④ | 手柄材料注入 | `ItemTool.java:17-20` | `if (this.hasWoodenHandle() && !this.hasMaterial(Material.wood)) {`／`this.addMaterial(Material.wood);` | ✓ 工具是**双材料**（工具料 + 木手柄） |
| B-4⑤ | component 值域 | `ItemSword.java:27-30`／`ItemPickaxe.java:44-47`／`ItemAxe.java:27-30`／`ItemShovel.java:25-28` | 2／3／3／1 | ✓ 逐类不同 |

**javap 双源**（`javap_ItemTool.txt`）：`getMultipliedDurability` 的字节码为 `getBaseDurability()F` → `getNumComponentsForDurability()I` → `i2f` → `fmul` → `effective_material.durability:F` → `fmul` → `ldc // float 100.0f` → `fmul` → `f2i` ⇒ 与源码逐算子一致。

---

## §3 面 C · 格挡减算链（只取与「盾若按工具口径」相关段）

### C-1 `Damage.applyTargetDefenseModifiers` 逐行 — ✓

| 面 | 判点 | 一手 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| C-1① | 入口与方法范围 | `Damage.java:182-232` | `protected float applyTargetDefenseModifiers(EntityLivingBase target, EntityDamageResult result) {` | ✓ 全段 51 行 |
| C-1② | 绝对伤害旁路 | `Damage.java:191-193` | `if (this.isAbsolute()) {`／`return this.amount;` | ✓ 格挡前先出 |
| C-1③ | 格挡门 + 半减 | `Damage.java:197-198` | `if (!this.bypassesMundaneArmor() && player.isBlocking()) {`／`this.amount /= 2.0F;` | ✓ 半减 |
| C-1④ | 1.0 地板 | `Damage.java:199-201` | `if (this.amount < 1.0F) {`／`this.amount = 1.0F;` | ✓ 半减后地板 |
| C-1⑤ | 磨损只认 ItemTool | `Damage.java:203-205` | `ItemStack item_stack = player.getHeldItemStack();`／`if (item_stack != null && item_stack.getItem() instanceof ItemTool) {` | ✓ 非工具不磨损 |
| C-1⑥ | 磨损乘算形态 | `Damage.java:206-208` | `item_stack.tryDamageItem(DamageSource.generic, (int)(this.amount * item_tool.getToolDecayFromAttackingEntity(item_stack, null)), target)` | ✓ **`(int)(半减后 × decay)`** |
| C-1⑦ | 磨损结果归集 | `Damage.java:206-208`（同段外层） | `result.applyHeldItemDamageResult(...)` | ✓ 结果进伤害回执 |
| C-1⑧ | 后续护甲减算（参照） | `Damage.java:213-231` | `float total_protection = target.getTotalProtection(this.getSource());` … `return Math.max(this.amount - effective_protection, 1.0F);` | ✓ 格挡之后的独立一段 |

**javap 双源**（`javap_Damage.txt`）：`fconst_2` → `fdiv` → `putfield amount`；`fconst_1` → `fcmpg` → `putfield amount`；`getToolDecayFromAttackingEntity` → `i2f` → `fmul` → `f2i` → `tryDamageItem(DamageSource,ILnet/minecraft/EntityLivingBase;)` ⇒ 与源码逐算子一致。

**三点必须记住的口径**：

1. **磨损基数用的是"半减之后"的 amount**（`:198` 先除 2，`:207` 再乘 decay），不是原始伤害。
2. 半减**只看 `isBlocking()`**，不看手里是什么——但磨损**只看 `instanceof ItemTool`**。两者门不同源，所以「能格挡」等于「是 ItemTool 且 canBlock()」。
3. `bypassesMundaneArmor()` 为真时**整段跳过**（半减与磨损都不发生，`:197`）。

### C-2 各载体 decay 值表 — ✓

**取数链**：`Damage.java:207` 调 `getToolDecayFromAttackingEntity(item_stack, null)` → `ItemTool.java:173-175`：

```java
173:     public final int getToolDecayFromAttackingEntity(ItemStack item_stack, EntityLivingBase entity_living_base) {
174:         return Math.max((int)(100.0F * this.getBaseDecayRateForAttackingEntity(item_stack)), 1);
```

| 载体类 | `getBaseDecayRateForAttackingEntity` | 一手行号 | 落点 `max((int)(100×base),1)` | 说明 |
|---|---|---|---|---|
| 剑 `ItemSword` | `0.5F` | `ItemSword.java:37-40` | **50** | |
| 镐 `ItemPickaxe` | `1.0F` | `ItemPickaxe.java:54-57` | **100** | |
| 斧 `ItemAxe` | `1.0F` | `ItemAxe.java:37-40` | **100** | |
| 锹 `ItemShovel` | `1.0F` | `ItemShovel.java:35-38` | **100** | **活跃锹类**（`ItemSpade` 为死类，见 §7 C-1） |
| 战锤 `ItemWarHammer` | `super × 2.0F / 3.0F`＝`0.6666667F` | `ItemWarHammer.java:30-33` | **66** | super = 镐 1.0F |
| 战斧 `ItemBattleAxe` | `super × 0.75F`＝`0.75F` | `ItemBattleAxe.java:34-37` | **75** | super = 斧 1.0F |
| 镰 `ItemScythe` | 附魔 vampiric → `1.0F`；sharpness → `2.0F`；否则 `4.0F` | `ItemScythe.java:30-37` | **100 ／ 200 ／ 400** | **唯一受附魔影响的 decay** |
| 匕首 `ItemDagger` | 继承剑 `0.5F`（本类不覆写） | `ItemDagger.java:1-29`（无该方法） | **50** | |
| 刀 `ItemKnife` | 继承匕首 → 剑 `0.5F` | `ItemKnife.java:1-27`（不覆写） | **50** | |
| 短柄斧 `ItemHatchet` | `super × 4.0F / 3.0F`＝`1.3333334F` | `ItemHatchet.java:39-42` | **133** | super = 斧 1.0F |
| 锄 `ItemHoe` | `2.0F` | `ItemHoe.java:40-43` | **200** | 但 `canBlock()==false`（不可格挡） |
| 剪 `ItemShears` | `2.0F` | `ItemShears.java:41-44` | **200** | 但 `canBlock()==false` |
| 短棍 `ItemCudgel` | `0.25F` | `ItemCudgel.java:41-44` | **25** | 但 `canBlock()==false` |
| 木棒 `ItemClub` | 继承短棍 `0.25F` | `ItemClub.java:1-28`（不覆写） | **25** | 且 `canBlock()==true`（唯一"可格挡的低耗"类） |
| 锹镐两用 `ItemMattock` | 继承锹 `1.0F` | `ItemMattock.java:1-67`（不覆写该法） | **100** | 但 `canBlock()==false` |

**javap 双源抽样**（值全对，见卷 `javap_ItemSword.txt` 等）：剑 `ldc // float 0.5f`；镐/斧/锹 `fconst_1`；战锤 `fconst_2 · fmul · ldc 3.0f · fdiv`；战斧 `ldc 0.75f`；短柄斧 `ldc 4.0f · fmul · ldc 3.0f · fdiv`；短棍 `ldc 0.25f`；锄/剪 `fconst_2`；镰三分支 `fconst_1`／`fconst_2`／`ldc 4.0f`。

**decay 的整数落点由脚本实算**（`Math.fround` + IEEE，非估算）：`100.0F × 0.6666667F = 66.666672F → (int) 66`；`100.0F × 1.3333334F = 133.33334F → (int) 133`。

### C-3 盾无对应行时的最近邻载体 — ✓（只列类别与值，不换算）

R196 **没有盾的 decay 行**（A-1），也**没有"格挡专用损耗"行**（C-1 唯一落点是 `ItemTool`）。可依据的最近邻只有 `ItemTool` 家族的 decay 行：**15 个载体类、8 个不同落点**，按档位分三簇：

| 簇 | decay 落点 | 载体 | 特征（仅描述，不作建议） |
|---|---|---|---|
| **轻击簇** | **25 ／ 50** | 木棒、短棍（25）；剑、匕首、刀（50） | 都是"高攻速/低单发"武器类；且木棒是**可格挡**的 |
| **中段簇** | **66 ／ 75 ／ 100 ／ 133** | 战锤（66）、战斧（75）、镐/斧/锹/锹镐（100）、短柄斧（133） | 该簇内 `canBlock()` 为真者 = 镐/斧/锹/战锤/战斧；为假者 = 锹镐（`ItemMattock`）与短柄斧（`ItemHatchet`） |
| **重耗簇** | **200 ／ 400** | 锄、剪（200）；镰（100/200/400，随附魔） | 锄/剪**不可格挡**；镰可格挡但基础耗损最高 |

**必须点明的一件事**：C-2 表里 **"可格挡"与"低耗损"并不重合**——`canBlock()==true` 的共 **8 个类**（剑、镐、斧、锹、战锤、战斧、镰、木棒）里，最低耗损是木棒 25、剑 50；而耗损最低的短棍（25）`canBlock()==false`。**没有"盾型"的中间档**（例如"低耗损 + 可格挡"的组合），这正是 R196 无盾造成的结构性空缺之一。

> 说明：本面**只列类别与值**，不做 1.12 换算、不给公式、不给候选值（属第二阶段对照报告）。

---

## §4 面 D · 二手先例（**先例，不作判值**）

### D-1 MITE-RB-2025 的盾实现 — 先例

| 面 | 判点 | 先例 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| D-1① | 盾等级接口 | `references/MITE-RB-2025/src/main/java/kelvin/mite/items/ShieldTier.java:3-6` | `int getProtectionLevel();`／`void setProtectionLevel(int protectionLevel);` | 先例：盾有独立数值面 `protectionLevel` |
| D-1② | 盾 Mixin | `.../mixin/item/ShieldItemMixin.java:7-20` | `@Mixin(ShieldItem.class)`／`public class ShieldItemMixin implements ShieldTier` | 先例：往原版 `ShieldItem` 注入字段 |
| D-1③ | 木盾注册 | `.../registry/ItemRegistry.java:237` | `WOODEN_SHIELD = Register("wooden_shield", new ShieldItem(new Settings().maxDamage(15).group(ItemGroup.COMBAT)));` | 先例：**木盾 maxDamage 15** |
| D-1④ | 等级赋值 | `.../registry/ItemRegistry.java:350-351` | `((ShieldTier)Items.SHIELD).setProtectionLevel(2);`／`((ShieldTier)WOODEN_SHIELD).setProtectionLevel(0);` | 先例：vanilla 盾 **2**、木盾 **0** |
| D-1⑤ | 该值的语义 | `.../mixin/entity/LivingEntityMixin.java:238-242` | `double damage_threshold = 4;`／`damage_threshold = ((ShieldTier)this.getActiveItem().getItem()).getProtectionLevel();` | 先例：`protectionLevel` 是**伤害阈值**，不是耐久 |
| D-1⑥ | 磨损形态 | `.../mixin/entity/LivingEntityMixin.java:195-200` | `if (amount >= 3.0F) {`／`int i = 1 + MathHelper.floor(amount);` | 先例：≥3 才磨损，磨损 = `1+floor(amount)` |

**先例解读**：该项目把「盾的可感知数值」拆成**两条独立轴**——`maxDamage`（耐久）与 `protectionLevel`（破防阈值）。任务书所记「wooden_shield maxDamage 15 / protectionLevel 0，vanilla shield protectionLevel 2」与此逐条对上。**该值不得当 R196 判值**（R196 无盾，A-1）。

### D-2 ICPM 装盾 — 先例

| 面 | 判点 | 先例 文件:行号 | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| D-2① | 合成形态 | `references/ICPM/ICPM更新日志.md:935` | 「在对应等级 ICPM 工作台将任意 ICPM 工具/武器与 `minecraft:shield` 合成……合成时盾牌仅消耗 25% 耐久」 | 先例：**工具+盾合成**（装盾＝组件） |
| D-2② | 减半口径 | `ICPM更新日志.md:939` | 「`modifyAppliedDamage`（`@ModifyArgs` HEAD）在伤害路径末端将最终伤害减半（下限 1）」 | 先例：减半 + 下限 1 |
| D-2③ | 磨损口径 | `ICPM更新日志.md:939` | 「并对装盾工具扣耐久 `int(减半后伤害 × 攻击衰减率)`（`hurtAndBreak` 处理耐久三，忠实 R196 `tryDamageItem`）」 | 先例：与 C-1⑥ 同形 |
| D-2④ | **不挡箭 / 不免疫击退** | `ICPM更新日志.md:939` | 「严格遵循选择"仅伤害减半(下限1) + 工具扣耐久；不挡箭、不免疫击退"——跳过 `DamageTypeTags.IS_PROJECTILE` 与 `BYPASSES_ARMOR` 来源」 | 先例：格挡语义**收窄**（非原版盾全免） |

**先例解读**：ICPM 的装盾把「盾」变成**工具的一个属性**（`SHIELD_ATTACHED` 组件），因此天然继承 R196 的工具磨损链；代价是"不挡箭、不免疫击退"。上游条 2 已裁 e 档不采（1.12 无 DataComponent + 与独立盾物品立项冲突），此面**仅作形态先例**。

---

## §5 负证总表（检索式 + 命中数 + 覆盖范围）

**工装**（本轮新写，落 `C:\Users\GreatCoffee\AppData\Local\Temp\opencode\`，非产品码）：

- `esh-grep.js`：递归遍历，**同时**匹配文件路径与文件内容（大小写无关），跳过二进制扩展名（`.png/.jpg/.ogg/.class/.jar/.zip/.ttf`），输出 `filesScanned / contentHitFiles / contentHits / pathHits`。
- `esh-zip.js`：直读 zip 中央目录（不经解压），列出全部条目名并按正则过滤，输出 `entries / matched`。
- `esh-count.js`：递归统计文件数／扩展名分布。

| 编号 | 检索式 | 覆盖范围 | 命中数 | 结论 |
|---|---|---|---|---|
| **N-1** | `QPAT='shield'`（大小写无关，路径 + 内容） | `mite-src/decompile/src` **全部 2753 文件**（1867 `.java` + 882 资源 + 4 其它） | `filesScanned=2753`／`contentHitFiles=0`／`contentHits=0`／`pathHits=0` | **0** |
| **N-2** | `QPAT='shield'`（同上） | `mite-src/decompile/src/assets` **882 文件**（862 `.png` + 13 `.mcmeta` + 3 `.lang` + 3 `.txt` + 1 `.bin`） | `filesScanned=882`／`contentHits=0`／`pathHits=0` | **0**（纹理无盾） |
| **N-3** | `QPAT='盾'`（中文） | `mite-src/decompile/src` 全部 **2753 文件** | `contentHits=0`／`pathHits=0` | **0**（lang 三档均无「盾」） |
| **N-4** | `node esh-zip.js 1.6.4-MITE-named.jar "shield"` | **2803 条目**（含 `assets/**`、`net/minecraft/**`） | `entries=2803 matched=0` | **0** |
| **N-5** | `node esh-zip.js 1.6.4-MITE.jar "shield"` | **2804 条目** | `entries=2804 matched=0` | **0** |
| **N-6** | `node esh-zip.js MITE-HDS.jar "shield"` | **7209 条目** | `entries=7209 matched=2` | **2，均为 `org/apache/commons/io/{input/CloseShieldInputStream,output/CloseShieldOutputStream}.class`**（Apache Commons IO 库类，非游戏内容） |
| **N-7** | `javap -p -c -constants -classpath 1.6.4-MITE-named.jar net.minecraft.ItemShield` | 单类 | `错误: 找不到符号: net.minecraft.ItemShield` | **类不存在**（字节码级负证） |
| **N-8** | `isShield` 覆写检索（被 N-1 覆盖） | 1867 `.java` | **0** | **无该方法** |
| **N-9** | `Recipes*.java` 全族（11 类）+ `CraftingManager.java`（555 行正文） | 12 文件 | `shield` **0** | **无盾配方** |
| **N-10** | `assets/minecraft/textures/items` 文件名枚举 | **211 件图标** | 含 `shield` 者 **0** | **无盾图标** |

**覆盖面自陈**：N-1 的「内容 + 路径」双匹配是必要的——若只搜内容，命名含 shield 的空类／仅被引用的类会漏；若只搜路径，内容里出现的字符串会漏。两者同时 0 才可判「不存在」。N-4/N-5 的 jar 中央目录直读是**字节码级**证明，不依赖反编译是否完整。

---

## §6 落差清单（不产公式）

### 6.1 R196 侧**存在**的材料行（可作派生依据的全部行）

| # | 行 | 位置 | 该行实际约束的对象 | 对盾的可迁移性 |
|---|---|---|---|---|
| L-1 | 材料耐久基值 | `EnumEquipmentMaterial.java:14`（64.0F）／`:15`（256.0F） | 所有走 `new Material(EnumEquipmentMaterial.xxx)` 的物品 | **直接可读**（`public final`） |
| L-2 | 材料耐久副本 | `Material.java:199` 声明／`:218` 赋值 | 同上 | 可读性是 `protected` ⇒ 跨包读不到（C-3） |
| L-3 | 工具耐久乘算 | `ItemTool.java:40-42`（`4.0F × components × durability × 100.0F`） | **仅 `ItemTool` 子类** | 需"是 ItemTool"才生效 |
| L-4 | 护甲耐久乘算 | `ItemArmor.java:36-43`（`components × durability`，非锁甲 ×2） | **仅 `ItemArmor` 子类** | 需"是 ItemArmor"才生效 |
| L-5 | 组件数表 | `ItemHelmet:14-16`(5)／`ItemCuirass:14-16`(8)／`ItemLeggings:14-16`(7)／`ItemBoots:14-16`(4) | 4 个甲位 + 各工具类 | 盾**没有**自己的组件数行 |
| L-6 | 落 maxDamage | `Item.setMaxDamage` `Item.java:936-948` | 任何 `IDamageableItem` | 通用 |
| L-7 | 品质乘算 | `Item.getMaxDamage(EnumQuality)` `Item.java:917-926` | `hasQuality()==true` 的物品 | 工具／护甲均为真（`:271`／`:261`） |
| L-8 | 品质档表 | `EnumQuality.java:5-13`（×0.5…×3.5）、`:31-33` | 同上 | 通用 |
| L-9 | 品质上限（多材料规则） | `Item.getMaxQuality()` `Item.java:1595-1612` | 多材料物品 | 见 C-5，规则不是简单取最低 |
| L-10 | 可损坏契约 | `IDamageableItem.java:3-6` | 所有可损坏物品 | 通用（2 方法） |
| L-11 | 材料式配方展开器 | `CraftingManager.java:479-507` + `RecipesTools.java:4-15`／`:129` | 材料列 × 形状行 | 机制存在，盾无行 |
| L-12 | 写死常量耐久先例 | `ItemBow.java:30` | 弓（按强化材料三档） | **先例**：R196 允许"每材料写死"而非乘算 |
| L-13 | 附魔度取用 | `ItemTool.java:236-239`（`getMaterialForEnchantment().enchantability`） | 工具 | 通用写法，盾可照抄这一句 |

### 6.2 R196 侧**不存在**的行（逐条列空）

| # | 缺什么 | 证据 |
|---|---|---|
| X-1 | 盾物品类／子类 | N-1／N-4／N-7 |
| X-2 | 盾的 `getNumComponentsForDurability()`（组件数） | `IDamageableItem` 全树仅 **7** 个实现类：`ItemTool`／`ItemArmor`／`ItemBow`／`ItemAnvilBlock`／`ItemCarrotOnAStick`／`ItemFishingRod`／`ItemFlintAndSteel`（`implements IDamageableItem` 检索 7 命中，无盾） |
| X-3 | 盾的 decay 行 | C-2 表（15 类 / 8 落点）全部绑在 `ItemTool` 家族上 |
| X-4 | 盾的 `canBlock()` 覆写 | A-2 表 7 处覆写全在工具族 |
| X-5 | 盾的配方行／注册项／纹理／lang | N-1／N-2／N-3／N-9／N-10 |
| X-6 | 「破防阈值」型数值（`protectionLevel` 一类） | 全树 `protectionLevel` **0 命中**（N-1 覆盖）；R196 的格挡只有"伤害减半"，无阈值概念 |
| X-7 | 护甲第 5 个装备位（盾位） | `ItemArmor` 只有 `armorType` 0/1/2/3（`ItemArmor.java:24` 赋值；四类构造分别传 0／1／2／3：`ItemHelmet.java:5`／`ItemCuirass.java:5`／`ItemLeggings.java:5`／`ItemBoots.java:5`） |

### 6.3 五项落差逐项（耐久 / 磨损 / 配方 / 附魔度 / 品质）

| 项 | R196 有无可依据行 | 可依据什么 | 缺什么（⇒ 只能派生，不能对位） |
|---|---|---|---|
| **耐久** | **有（但都绑死类）** | L-1／L-3／L-4／L-5／L-6／L-7／L-12 | 缺"盾型组件数"（X-2）与"盾走哪条乘算路"；两条路的系数分别是 `×100`（工具系，另叠 `4.0F` 基值）与 `×2`（护甲系）——叠起来差约两个数量级，选哪条是架构位，不是数值位 |
| **磨损** | **有（工具族 15 类 / 8 落点）** | C-2 表（25…400） | 缺盾专属 decay（X-3）；且"可格挡"与"低耗损"在 R196 里**不重合**（C-3 末段），没有天然可选档 |
| **配方** | **有机制，无盾行** | L-11（材料列 × 形状行 + 特征字符表） | 缺盾的形状行与材料列（X-5）；R196 的工具配方是"材料 × 形状"二维表，盾的形状不存在 |
| **附魔度** | **有数值，缺适用范围** | L-13 + `EnumEquipmentMaterial.java:14-15`（100／40） | 附魔适用面是**每个附魔各自的 `canEnchantItem(Item)` 具体类白名单**（`Enchantment.java:94` 抽象；`EnchantmentHelper.java:336` 调用；如 `EnchantmentProtection.java:169-189` 要 `item.isArmor()`、`EnchantmentDurability.java:14-26` 列 `ItemCudgel/ItemPickaxe/ItemShovel/ItemHoe/ItemAxe/ItemFishingRod/ItemBow`、`EnchantmentEndurance.java:19-21` 仅 `ItemCuirass`）⇒ **一个新盾类默认一件附魔都附不上**，除非进白名单或继承工具类 |
| **品质** | **有** | L-7／L-8／L-9 + `Material.java:204`／`:220` | 缺"盾的 `max_quality` 从哪来"；且多材料规则不是"取最低"——见 C-5 |

**落差总账（一句）**：R196 对"盾"的五个数值面里，**附魔度与品质有完整一手行、耐久与磨损有"绑在工具/护甲类上的"可借用行、配方有机制无行**；而**"盾"这个类型位本身在 R196 的 7 个 `IDamageableItem` 实现类与 4 个甲位里都不存在**。因此本项目的盾数值**只能"派生"，不能"对位"**——这是本件与主 mod 那些"有 R196 一手值可抄"的批次最大的不同。

---

## §7 冲突分级

### A 级（阻断：不裁落不了码／裁错全盘回归）

| 编号 | 冲突 | 证据 | 后果 |
|---|---|---|---|
| **A-1** | **R196 无盾 ⇒ 五项数值全无一手来源** | §5 N-1…N-10（与游戏内容相关的命中 **0**；N-6 的 2 命中是 commons-io 库类） | 任何"照 R196 盾的数值做"的说法都不成立；只能以"R196 材料行派生"立项。若误当"有盾可对位"，会在对照报告阶段反复返工 |
| **A-2** | **R196 物品层级没有"盾型"位 ⇒ 必先定继承面** | 7 个 `IDamageableItem` 实现类（§6.2 X-2）+ 4 甲位（X-7）+ 两条互斥乘算路（L-3／L-4） | 耐久／磨损／品质／附魔度四个判值**同时悬空**：挂在 `ItemTool` 上则得 ×100 与 BLOCK 语义，挂在 `ItemArmor` 上则得 ×2 且要吃甲点逻辑，挂在裸 `Item` 上则默认不可损坏、不可附魔。继承面未定 = 四处判值全定不了 |

### B 级（需 ETIM-Extra 主会话裁）

| 编号 | 待裁事项 | R196 一手约束（供裁时参照） |
|---|---|---|
| **B-1** | **耐久派生路**：① 工具系（L-3）／② 护甲系（L-4）／③ 写死常量（L-12 先例） | 三者的量级与品质联动不同：①③ 走 `hasQuality` 乘算，其中 ① 另叠 `4.0F` 基值与 `×100`；② 只走 `×2` 且要带甲点/覆盖率逻辑。同一材料沿 ① 与 ② 得数相差约两个数量级 |
| **B-2** | **磨损口径**：① 沿用主 mod `shieldWearRate`（默认 1.0）／② 映射到 C-2 的某一档（25…400） | R196 的磨损**永远是 `(int)(半减后 × decay)`**（C-1⑥），没有"rate"这一层；主 mod 已引入 rate，属 1.12 侧口径 |
| **B-3** | **配方形态**：① 进 `addRecipes` 材料列表（L-11）／② 独立形状配方／③ 无配方 | R196 无盾的形状行（X-5）；材料列里秘银／艾德曼的原料件已存在（`RecipesTools.java:10-11`：`Item.ingotMithril`／`Item.ingotAdamantium`） |
| **B-4** | **附魔度与品质口径**：① 照材料行（100／40 + legendary）／② 降到 average + 低附魔／③ 照材料行但另开附魔白名单 | 附魔适用面是具体类白名单（§6.3 附魔度行）；`max_quality` 走 `Item.getMaxQuality()` 多材料规则（C-5） |
| **B-5** | **格挡语义**：① 照 `ItemTool`（BLOCK + 72000 + `canBlock()`）／② 独立（走主 mod 的 `isShield` 门） | R196 只有 ①（A-2）；② 是 1.12 侧形态，R196 无对应行 |

### C 级（登记，不改判值）

| 编号 | 事项 | 一手实况 |
|---|---|---|
| **C-1** | **`ItemSpade` 是死类**（活跃锹类 = `ItemShovel`） | `ItemSpade.java` 仅 15 行正文，`super(var1, 1.0F, var2, blocksEffectiveAgainst)` 的签名 `(I,F,LEnumToolMaterial;[LBlock;)V` 与现 `ItemTool` 的唯一构造 `(ILnet/minecraft/Material;)V` **不匹配**（javap `javap_ItemTool.txt:13`）；全树引用 **0**（`Item.getItem`／`Item.itemsList` 无 `spade` 项） |
| **C-2** | **死类第二、第三例**：`EnumToolMaterial`、`EnumEnchantmentType` | 二者全树引用均 **0**（`EnumToolMaterial` 只被 `ItemSpade` 引用；`EnumEnchantmentType` 只被自身引用）。**注意**：`EnumEnchantmentType.java:14-41` 的"armor/weapon/digger/bow 四类白名单"**不是现役门**——现役门是每附魔各自的 `canEnchantItem(Item)`（`EnchantmentHelper.java:336`） |
| **C-3** | `Material.durability`／`enchantability` 是 `protected` 字段、**无 public getter** | `Material.java:199-200` 声明；全类无 `getDurability()`／`getEnchantability()` ⇒ 外部包只能读 `EnumEquipmentMaterial` 的 `public final`（`:22-25`），或走 `ItemTool.getToolMaterialName()`（`ItemTool.java:241-243`，返回 `String`）之类间接路径；`getToolMaterial().name` **不可用**（`Material.name` 亦为 `protected`，`Material.java:201`） |
| **C-4** | `setMetal(boolean)` 的形参是 **`is_harmed_by_acid`**，不是 `is_metal` | `Material.java:367-371`。`setMetal(false)` ⇒ `is_metal=true` + 不怕酸。mithril（`:61`）／adamantium（`:66`）均为**金属**；连带影响 `isSolidMetal()`（`ItemArmor.java:299-301`）与附魔资格 |
| **C-5** | **品质多材料规则不是"取最低"** | `Item.java:1610-1611`：`lowest = getLowestMaxQualityOfMaterials(materials); return lowest.isLowerThan(average) ? lowest : getHighestMaxQualityOfMaterials(materials);`。工具因木手柄成双材料（`ItemTool.java:17-20`），木的 `max_quality=fine`（`EnumEquipmentMaterial.java:5`）**高于** average ⇒ 秘银工具取 **highest = legendary**；但若手柄材料 < average，整体降到该低值 |
| **C-6** | 磨损还要过 `tryDamageItem` 的三道额外规则 | `ItemStack.java:270-301`：unbreaking 逐点减免（`:272-285`）、`equipment_decays_faster` 双倍（`:334-336`）、**创造模式免磨损**（`:330-332`）；`isHarmedBy(damage_source)` 为假则整段不扣（`:304`） |
| **C-7** | R196 **无副手** | `EntityPlayer.setHeldItemInUse()` `:2667-2689` 只取 `getHeldItemStack()`；`isBlocking()` `:205-206` 只看 `itemInUse` ⇒ 1.12 的双持/副手格挡面**没有** R196 一手依据 |

---

## §8 待裁位（本会话只列，不裁定；裁权在 ETIM-Extra 主会话）

| 编号 | 待裁 | 选项 | 本会话倾向（理由） |
|---|---|---|---|
| **T-1** | 耐久派生路（对应 B-1） | ① 工具系 · ② 护甲系 · ③ 写死常量 | **倾向 ③ 或 ①**：③ 有 R196 先例（`ItemBow.java:30` 按材料写死），最贴"盾不是工具也不是护甲"的事实；① 可白拿品质乘算，但会把盾绑进工具族语义（连带 BLOCK/decay/`canBlock`）。② 最不贴（甲位只有 4 个、要带甲点与覆盖率） |
| **T-2** | 磨损口径（对应 B-2） | ① 主 mod `shieldWearRate` · ② R196 decay 档 | **倾向 ①**：主 mod 已落且已定 1.0 默认值，R196 侧没有 rate 层，② 只会把两个口径混在一起 |
| **T-3** | 配方形态（对应 B-3） | ① 材料列 · ② 独立形状 · ③ 无配方 | **倾向 ①**：R196 机制现成（`CraftingManager.java:479-507`），材料列件已存在（`Item.ingotMithril`／`Item.ingotAdamantium`），最省且最贴 R196 的"材料 × 形状"习惯 |
| **T-4** | 附魔度与品质（对应 B-4） | ① 照材料行 · ② 压低 · ③ 照材料行 + 白名单 | **倾向 ③**：数值照材料行（100／40、legendary）是一手可读的；但不补白名单则盾**一件附魔都附不上**，与"顶级材料"观感矛盾。补白名单的代价需主会话权衡 |
| **T-5** | 格挡语义（对应 B-5） | ① 照 `ItemTool` · ② 独立 `isShield` 门 | **倾向 ②**：主 mod 已按 `Item#isShield` 收口（上游任务书 §1），① 会把盾拖回工具族并触发 `canBlock`／decay 连带；R196 侧无"非工具格挡"，所以这不是"抄 R196"，而是"主 mod 已定的门" |

**残余**：本件**不给裁定**；T-1…T-5 全部交 ETIM-Extra 主会话，裁后由会话六出对照报告（第二阶段）。

---

## §9 一手卷与工装（可复现）

### 9.1 本轮新出 javap 卷（31 件，落 `ETIM-Extra\playground\audit\extra-shield-javap\`）

生成命令（对每个类执行一次）：

```powershell
javap -p -c -constants -classpath "mite-src/tools/1.6.4-MITE-named.jar" net.minecraft.<类> |
    Out-File -FilePath "<out>\javap_<类>.txt" -Encoding ascii
```

| 卷 | 用途 |
|---|---|
| `javap_EnumEquipmentMaterial.txt` | 三材料常量（64.0／256.0／16.0 + 附魔度 + 质量） |
| `javap_EnumQuality.txt` | 8 档修饰符（0.5…3.5）与顺序 |
| `javap_Material.txt` | `durability` 字段、`getDamageVsEntity` 的 5.0／6.0、`setMetal` 语义 |
| `javap_ItemTool.txt` | `getMultipliedDurability`（×100）、`canBlock`（真）、`getToolDecayFromAttackingEntity`（×100 + 下限 1） |
| `javap_ItemArmor.txt` | `getMultipliedDurability`（×2）、`getMaterialProtection`（…9／10） |
| `javap_Item{Helmet,Cuirass,Leggings,Boots}.txt` | 组件数 5／8／7／4 |
| `javap_Damage.txt` | 半减 `fconst_2/fdiv`、地板 `fconst_1`、磨损 `i2f/fmul/f2i` |
| `javap_ItemSword/Pickaxe/Axe/Shovel/WarHammer/BattleAxe/Scythe/Dagger/Hatchet/Hoe/Shears/Cudgel/Club/Mattock/Knife.txt` | decay 覆写链与继承关系（含"不覆写"的空证） |
| `javap_Item.txt` | `getMaxDamage(EnumQuality)`（品质乘算）、`getMaxQuality`（多材料规则）、`hasQuality` |
| `javap_ItemStack.txt` | `tryDamageItem` 三道额外规则 |
| `javap_EntityPlayer.txt` | `isBlocking`（单手持槽） |
| `javap_ItemSpade.txt` | **死类证据**（super 构造签名不匹配） |
| `javap_RecipesTools.txt` | 配方表形态 |

### 9.2 检索工装（三个脚本，非产品码）

| 脚本 | 作用 |
|---|---|
| `esh-grep.js` | 路径 + 内容双匹配递归检索（跳过二进制扩展名），输出 4 个计数 |
| `esh-zip.js` | zip 中央目录直读，按正则过滤条目名 |
| `esh-count.js` | 文件数与扩展名分布 |

### 9.3 覆盖自检

- 源码树：**1867** `.java`（`net/minecraft` 平铺，无子包）+ **882** 资源文件 + 4 其它 = **2753**。
- jar：named **2803** 条目／`1.6.4-MITE.jar` **2804**／`MITE-HDS.jar` **7209**。
- 纹理：`textures/items` **211** 件；lang **3** 档（en_US／zh_CN／zh_TW）。
- 配方族：`Recipes*.java` **11** 类 + `CraftingManager.java`（555 行正文）。

---

## §10 边界与附注

1. **零改动**：本件只读 `mite-src/decompile/src/**`、`mite-src/tools/1.6.4-MITE-*.jar`、`mite-src/references/{MITE-RB-2025,ICPM}/**`；**未改任何 java/json/lang/config/gradle，未起服、未构建、未跑 gradle、未动 git**。唯一写入 = 本报告 + `extra-shield-javap/` 下 31 个 javap 卷（诊断产物，非产品码）。
2. **不产公式**：本件不含任何"盾耐久候选值"、不含 1.12.2 对位、不含伪代码。§6 只列"存在的行／不存在的行"，不把行组合成盾公式。上游 `audit-extra-裁定回执.md` 条 3 的 S1~S4 已由条 9 判为「过程草案，不作判值」，本件**不引用其数值**。
3. **1.12 底座不引用**：336 耐久一类的 1.12 盾底座属第二阶段输入，本件不出现、不反推。
4. **先例隔离**：§4 的两份先例均逐行标「先例，不作判值」；§6／§7 未把先例值代入任何判值。
5. **双源覆盖度自陈**：源码为值的主源；javap 只对**数值型关键行**（材料四值、×100、×2、甲点 9/10、半减/地板/磨损、8 个 decay 落点、品质乘算、单手持槽）做了字节码核对。**未逐类 100% javap 全量核对**（`javap_Item.txt` 已出 1.0 MB 卷，全量核对性价比低）；若终审要求，可按 §9.1 命令补齐。
6. **`?` 语义**：本件 `? 0`。唯一"未追"的是 `ItemKnife`／`ItemClub`／`ItemDagger`／`ItemMattock` 的"继承而来"结论——由 javap 卷中"该类无该方法"反证（空证），属 ✓ 而非 `?`。
7. **面号冻结**：A-1／A-2／B-1…B-4／C-1…C-3／D-1／D-2 共 11 面，按任务书原号，不重排不增删。
8. **客户端纪律**：本件无截图面、无 GUI 面、无客户端操作；未启动任何客户端、未操控键鼠。
9. **身份与转发**：本件由主 mod 项目会话六（DeepSeek V4.1 Flash）产出，经用户中转交 ETIM-Extra 主会话；终审由会话五（主 mod 项目）承接。
10. **下一环**：ETIM-Extra 主会话裁 T-1…T-5 → 会话六出 `extra-shield-对照报告.md`（1.12.2 对位、候选值、伪代码）→ 会话五终审 → 落码 → 会话七验证窗。

---

## 回执（本件档尾）

| 字段 | 值 |
|---|---|
| 轮次 | ETIM-Extra 盾面 **立项摸底 第 1 轮** |
| 面数 | **11**（A 2 ／ B 4 ／ C 3 ／ D 2） |
| 状态分布 | ✓ 10 ／ ✗ 1（A-1）／ ? 0 |
| 负证 | **10 条**（N-1…N-10），其中字节码级 3 条（N-4／N-5／N-7）、文本级 7 条 |
| 落差 | 存在行 **13** 条（L-1…L-13）／不存在行 **7** 条（X-1…X-7）／五项逐项落差 **5** 项 |
| 冲突分级 | **A 2 ／ B 5 ／ C 7** |
| 待裁位 | **T-1…T-5**（全部给倾向，本件不裁定） |
| 勘误 | **E-1**（任务书 B-3 的「`:49-50` 甲点」实为 rusted_iron 分支；甲点表在 `:45-74`） |
| 新出卷册 | javap **31** 件（`extra-shield-javap/`） |
| 落码态 | 零产品码；未起服／未构建／未跑 gradle／未动 git |
| 核心结论 | **R196 完全没有盾**（10 条负证；与游戏内容相关命中 **0**）；盾的五项数值只能「以 R196 材料行派生」，不能「对位」；派生前必须先定继承面（A-2） |
| 下一环 | ETIM-Extra 主会话裁 T-1…T-5 → 会话六对照报告 → 会话五终审 |
