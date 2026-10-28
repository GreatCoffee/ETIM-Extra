# ETIM-Extra 盾面 落码批文（盾面首批 · 秘银盾 / 艾德曼盾）

> **性质**：本批唯一判据正本（验证窗据此执行）。数值、形态、判点以外的争论一律回判决链，不在窗内改。
> **依据链**：`extra-shield-立项摸底.md`（11 面，A-1 证 R196 无盾）→ `extra-shield-对照报告.md`（11 面 L）→ `extra-shield-终审回执.md`（逐面 ✓，A3/B4/C6 维持 + B-审1 知悉 + C-审1 行号区间）→ `audit-extra-裁定回执.md` 条 11（T-1…T-5）／条 12（D-1…D-3 + E-1）／条 13（落码）。

## 1 判值正本

| 面 | 值 | 出处 | 性质 |
|---|---|---|---|
| 秘银盾耐久 | **25,600** | `4.0F × 1 × 64.0F × 100.0F`（R196 `ItemTool.java:36-42` + `EnumEquipmentMaterial.java:14`；`components=1` 见 `ItemShovel:26`／`ItemCudgel:32`） | **派生值**（R196 无盾） |
| 艾德曼盾耐久 | **102,400** | 同上，`d = 256.0F`（`:15`） | **派生值** |
| 附魔度 | 秘银 **100** / 艾德曼 **40** | R196 材料行 `EnumEquipmentMaterial.java:14-15`，经主 mod `ETIMMetals.enchantability` | 一手（非派生） |
| 配方 | shaped `"X X" / "XXX" / " X "`，**6 锭** | 裁 T-3 ①（R196 材料列形，`CraftingManager.java:479-507`） | 派生形态 |
| 磨损 | `(int)(blocked × shieldWearRate)`，rate 默认 **1.0** | 主 mod `combat/ETIMBlocking.java:140-148` + `ETIMConfig.java:369` | 机制归主 mod |
| 格挡 | `isShield → true` + BLOCK 使用态（72000） | 裁 T-5 ②；主 mod `ETIMBlocking.java:94-102` | 机制归主 mod |
| 品质 | **不接**（无品质档、耐久不吃品质乘算） | 主 mod 品质载体 = 6 个 exact class（`ETIMQuality.java:78-85`） | 裁 T-4 |
| 堆叠 | **1** | `Item.java:277-280`（`isDamageable` 要求 `maxStackSize == 1`） | — |
| 半减参数 | factor 0.5 / 下限 1.0 | 主 mod `ETIMConfig.java:362-366` | 不改 |

**派生值声明（不得改口径）**：25,600／102,400 是**派生值**，不是 R196 一手盾值。任何「R196 盾耐久 = N」的表述都作废。

## 2 落码清单（已落盘）

| 文件 | 内容 |
|---|---|
| `src/main/java/io/github/etim/etimextra/shield/ETIMExtraItemShield.java` | 新增。`extends Item`；8 条方法面（`setMaxStackSize(1)`／`setMaxDamage(cfg)`／`isShield→true`／`getItemUseAction→BLOCK`／`getMaxItemUseDuration→72000`／`onItemRightClick→setActiveHand`／`getItemEnchantability→metal.enchantability`／`addPropertyOverride("blocking")` 休眠） |
| `src/main/java/io/github/etim/etimextra/shield/ETIMExtraContent.java` | 新增。两件注册（`etimextra:mithril_shield`／`etimextra:adamantium_shield`）+ `assertRegistered()` fail-fast + 两条 `GameRegistry.addShapedRecipe` |
| `src/main/java/io/github/etim/etimextra/client/ETIMExtraItemModels.java` | 新增。`@Mod.EventBusSubscriber(Side.CLIENT)` + `ModelRegistryEvent` 双写（mesh 函数 + 静态表） |
| `src/main/java/io/github/etim/etimextra/ETIMExtraConfig.java` | 改。`shield` 节 +2 键（`mithrilDurability=25600`／`adamantiumDurability=102400`，区间 1…1048576） |
| `src/main/java/io/github/etim/etimextra/ETIMExtraLog.java` | 改。`[ExtraLog]` 盾面三条行方法（均挂 `extraDebugLog`） |
| `src/main/java/io/github/etim/etimextra/ETIMExtra.java` | 改。`preInit` 追加 `ETIMExtraContent.register()`（配置 → 载入行 → 内容，裁 D-3 ①） |
| `assets/etimextra/{models/item,textures/items,lang}/*` | 新增 6 件：2 模型（`item/handheld`）／2 纹理（16×16 占位，透明底）／2 lang |

**零机制改动**：无 mixin、无事件、无 TEISR、无新日志通道、无 3D 盾模型、无附魔白名单、不禁用 vanilla 盾。

## 3 落码轮冒烟（已过，2026-10-28 20:36）

- 起服：`testharness/build-logs/11-shield-smoke-latest.log`（`B:extraDebugLog=true` 的窗口值）。
- 判行（原样）：`[ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1`／`…adamantium_shield metal=adamantium maxDamage=102400 enchantability=40 stack=1`／`shield recipe=etimextra:shield_mithril ingot=etim:ingot_mithril count=6`／`…shield_adamantium ingot=etim:ingot_adamantium count=6`／`shield recipes total=2`。
- 生命周期：`Done (0.625s)!` → `Stopping the server` → `Saving worlds`（stdin `stop`，0 异常）。
- 配置落地：`run/config/etimextra.cfg` 生成 `shield` 节，两键默认值如判值正本。
- 钉值：`build/libs/etimextra-0.1.0.jar` **14,170 B** @ 2026-10-28 20:35:50｜SHA-256 `470809B038359F706EE22419538DBC2433C5CAE15D56D145217E813F23E5519A`。
- **尾标口径（验证窗勘误 C-1，2026-10-28 订正）**：`[ExtraLog]` 行**无**尾标；主 mod 的 `[BlockLog]` 行**有** `[server]` 尾标（主 mod logger 追加）。判据按行内 `key=value` 字段匹配，**尾标不入判据**。原文「主 mod 的 `[BlockLog]` 同样没有」失实，已作废。

## 4 判点（W-1…W-8，验证窗逐点核讫）

前置：窗内 `run/config/etimextra.cfg` 的 `B:extraDebugLog=true`、`run/config/etim.cfg` 的 `B:blockDebugLog=true`（主 mod 通道默认关）。

| 判点 | 通道 | 预期行（原样） | 正/反 |
|---|---|---|---|
| **W-1** 注册与耐久 | `[ExtraLog]` | `shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1`（及 adamantium `102400`／`40`） | 正：两行值逐字对；反：`maxDamage=0`／`enchantability=0` |
| **W-2** 配方 6 锭 | `[ExtraLog]` | `shield recipe=etimextra:shield_mithril ingot=etim:ingot_mithril count=6`；`shield recipes total=2` | 正：两行 + total=2；反：`count≠6`／缺行 |
| **W-3** 全免段已关 | `[BlockLog]` `gate` | `gate player=<n>#<id> active=etimextra:mithril_shield src=<type> suppressed=true` | 正：举盾受击出现；反：不出现（`blockModel=false` 或 mixin 未生效） |
| **W-4** 半减 + 下限 | `[BlockLog]` `block` | `block player=… src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:mithril_shield` | 正：`blocked = max(raw×0.5, 1.0)`、carrier 是本盾；反：carrier `-`／blocked 0 |
| **W-5** 磨损 rate 臂 | `[BlockLog]` `wear` | `wear player=… item=etimextra:mithril_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4` | 正：`wear=(int)(blocked×rate)`、`decay=na`、`dur` 增量 = wear；反：`decay` 出数字／dur 不动 |
| **W-6** 耐久读数 | `[BlockLog]` `probe` | `probe player=… held=etimextra:mithril_shield dur=0/25600` | 正：分母 = 配置值；反：分母 336（继承 ItemShield 的迹象）或 0 |
| **W-7** 附魔门（用户面） | `[ExtraLog]` + 附魔台 GUI | `shield … enchantability=100`；附魔台三档非 0 | 正：日志值对 + 用户转述「出 Unbreaking」；反：三档全 0 |
| **W-8** 品质不生效（用户面） | tooltip + 静态锚 | 无品质行；`ETIMQuality.hasQualityChannel(this) == false` | 只作静态锚 + 用户转述，不作日志判据 |

**三分口径**：① 纯渲染/手感面（W-7 的附魔名、W-8 的 tooltip）由用户操作 + 原文转述；② 数值面一律以日志行为判；③ 反例命中即失败。

## 5 验收线

1. W-1…W-6 全部有行且逐值对；W-7／W-8 用户面转述与非判据登记。
2. 窗内 **0 rebuild**（jar 字节 + SHA + mtime 起收口同值）。
3. 客户端面只允许用户操作：物品图标/手持模型非紫黑、显示名「秘银盾／艾德曼盾」、右键进入举盾姿态。
4. 任何一项反例即 ✗，回落码批文与裁定链，不在窗内改值。

## 6 不在本批（禁止顺手加）

3D 盾模型 / custom TEISR / `_blocking` 模型 / Mending 白名单 / 禁用 vanilla 盾 / 盾的品质档 / 盾的附魔扩展面。
