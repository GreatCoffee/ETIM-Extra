# ETIM-Extra 盾面补种 批文（铜盾 / 银盾 / 远古金属盾 · 五种金属盾收口）

> **性质**：本补种批唯一判据正本（冒烟窗据此执行）。机制、类、形状、日志通道一律沿用已闭单的盾面首批；本批只增「材料实例」，不新增任何机制面。
> **依据链**：`audit-extra-裁定回执.md` 条 11 T-1（耐久算式 `4.0F × 1 × d × 100`，`components=1`）／T-3（形状 `"X X"/"XXX"/" X "` = 6 锭）／T-4（附魔度照材料行，不接品质）／T-5（`isShield` 门）＋ 条 14（首批闭单）＋ 条 15（3D 盾面 + TEISR，用户判「一切正常」）。
> **判值来源**：主 mod `metal/ETIMMetals.java:37-42`（R196 材料行，已由主 mod 判决链核讫）；本批**不新增**任何 R196 读数，只是把同一条材料行代入同一条已裁定算式。

## 1 判值正本（五种金属盾）

| 金属 | `durabilityFactor`（R196 材料行） | 耐久（<b>派生</b>） | 附魔度（一手） | 锭 id | 盾 id |
|---|---|---|---|---|---|
| 铜 copper | 4 | `4×1×4×100` = **1,600** | **30** | `etim:ingot_copper` | `etimextra:copper_shield` |
| 银 silver | 4 | `4×1×4×100` = **1,600** | **30** | `etim:ingot_silver` | `etimextra:silver_shield` |
| 远古金属 ancient_metal | 16 | `4×1×16×100` = **6,400** | **40** | `etim:ingot_ancient_metal` | `etimextra:ancient_metal_shield` |
| 秘银 mithril | 64 | `4×1×64×100` = **25,600** | **100** | `etim:ingot_mithril` | `etimextra:mithril_shield` |
| 艾德曼 adamantium | 256 | `4×1×256×100` = **102,400** | **40** | `etim:ingot_adamantium` | `etimextra:adamantium_shield` |

**派生值声明**：五条耐久全部是**派生值**（R196 无盾，立项摸底 A-1），不是 R196 一手盾值；附魔度是材料行一手值，不派生。
**同材料自洽核对**：盾 = 同金属剑耐久的一半（剑 `components=2`：铜/银 3,200、远古 12,800、秘银 51,200、艾德曼 204,800），五种金属逐一对上，公式没有为某一金属单独开口。
**锈铁不产盾**：R196 `rusted_iron` 无锭（主 mod `ETIMItems.java:29-33` 只注册五种金属的锭），与主 mod 锈铁装备一致（只从战利品来），故无盾、无配方。

## 2 落码清单（本批已落盘）

| 文件 | 改动 |
|---|---|
| `shield/ETIMExtraContent.java` | 三件新增（`copper_shield`／`silver_shield`／`ancient_metal_shield`）+ `shields()` 注册序数组 + `assertRegistered()` 改遍历 + 三条形状配方；**配方行改从已注册配方反读**（材料物品 + 非空格数 + 产物），并加 `slots != 6 ⇒ 抛异常` 的 T-3 合约断言 |
| `ETIMExtraConfig.java` | `shield` 节 +3 键：`copperDurability=1600`／`silverDurability=1600`／`ancientMetalDurability=6400` |
| `ETIMExtraLog.java` | `shieldRecipe` 增 `output=` 字段（旧行是它的前缀，旧判据正则不受影响） |
| `client/ETIMExtraItemModels.java` | 遍历 `ETIMExtraContent.shields()`，纹理名 = 注册路径（去掉硬编码两件表） |
| `assets/.../models/item/` | 5 个 base 模型（`builtin/entity` + `blocking` override → 共享 `shield_blocking`）；删 `mithril_shield_blocking`／`adamantium_shield_blocking`，合并为共享 `shield_blocking.json` |
| `assets/.../textures/entity/` | +3 张 64×64（以 vanilla `shield_base.png` 按各金属锭纹理主色重着色：铜橙／银白／远古淡金） |
| `assets/.../lang/` | +3 条 ×2 语言（铜盾 Copper Shield／银盾 Silver Shield／远古金属盾 Ancient Metal Shield） |

**零机制改动**：类 `ETIMExtraItemShield` 一行未改（8 条方法面原样）；无 mixin、无事件、无新通道、无第二套磨损；减半/地板/磨损仍全在主 mod。

## 3 判点（W-9…W-12）

前置：窗内 `run/config/etimextra.cfg` 的 `B:extraDebugLog=true`。

| 判点 | 通道 | 预期行（原样） | 正/反 |
|---|---|---|---|
| **W-9** 三件注册 + 派生耐久 | `[ExtraLog]` | `shield item=etimextra:copper_shield metal=copper maxDamage=1600 enchantability=30 stack=1`；`silver_shield` **1600／30**；`ancient_metal_shield` **6400／40** | 正：三行逐字对，且秘银 25600／100、艾德曼 102400／40 两行仍在；反：任一 `maxDamage` 落在 336／0／他金属值 |
| **W-10** 配方 6 锭 + 产物 | `[ExtraLog]` | `shield recipe=etimextra:shield_copper ingot=etim:ingot_copper count=6 output=etimextra:copper_shield`（另两条同形）；`shield recipes total=5` | 正：5 行 `count=6` 且 `ingot`/`output` 逐条配对；反：`count≠6`、缺行、`total≠5` |
| **W-11** 形状合约（静态锚） | 代码 + javap | `ETIMExtraContent.INGOTS_PER_SHIELD = 6` 在注册后对已注册配方非空格数做 `!=6 ⇒ throw`；`javap` 复核常量与调用 | 只作静态锚（反例无法用日志判：形状打错时加载直接中止，日志停在该 throw） |
| **W-12** 客户端三面（用户面） | 用户肉眼 | 五件图标可辨、名字「铜盾／银盾／远古金属盾／秘银盾／艾德曼盾」、右键举盾姿态（五件同形） | **用户裁定 2026-10-28：均正常 ✓**（转述，不作日志判据） |
| **W-13** 六锭门（数量敏感） | 工作台结果槽 + 库存 | 铜盾：只摆 5 格 → 结果槽**空**；补第 6 锭 → 结果槽**出现盾** | 正：5 空 / 6 有；反：5 锭即出盾（⇒ 配方不是 6 锭）或 6 锭仍空（⇒ 形状错位） |
| **W-14** 真实合成消耗 6 锭（五金属） | `[CraftingLog]` + 假玩家库存 | 每金属一腿：`/give 6` → 工作台摆 6 格 → 左键结果槽 arm → 计时走完 → `COMPLETE <盾名> ×1 quality=AVERAGE xp=0`；库存读回 **锭 −6、盾 +1** | 正：五腿 `consumed=6 && gained=1`；反：任一腿锭不少／盾不出／`quality≠AVERAGE`（盾不是品质载体） |

**W-10 强化说明**：首批 `count=6` 是照抄入参的常量，形状打错也照样打 6。本批起 `count` / `ingot` / `output` 全部从 `CraftingManager.REGISTRY` 里**已注册**的配方反读，形状与判行脱节会当场抛异常或打出不符值。
**W-13／W-14 为什么必须真合成**：W-9/W-10 只证明「注册表里有一条 6 格配方、材料是锭、产物是盾」，证明不了「玩家摆出这个形状真能拿到盾、6 个锭真被吃掉」。W-13 用「5 锭不出 / 第 6 锭才出」把数量钉死；W-14 在生存模式下走主 mod 的真实合成计时器（`craftingTimer=true`、`craftingSkipCreative=true` 对创造生效，故必须生存），读回库存差值与 `[CraftingLog]` 完成行。

## 4 验收线

1. W-9／W-10 全部有行且逐值对；W-11 静态锚通过；W-12 用户转述。
2. W-13：5 格结果为空、6 格出现盾；W-14：五腿 `consumed=6 && gained=1` 且完成行 `xp=0`（盾非品质载体）。
3. 窗内 **0 rebuild**（jar 字节 + SHA + mtime 起收口同值）。
4. 服务生命周期：`Done` → `Stopping the server` → `Saving worlds`，退出码 0，0 crash-report。
5. 任何一项反例即 ✗，回落码批文与裁定链，不在窗内改值。

## 5 不在本批（禁止顺手加）

锈铁盾（无锭）、金/铁盾（R196 保留 vanilla 物品，`ETIMMetals:8-9`）、盾的品质档、Mending 白名单、禁用 vanilla 盾、盾的附魔扩展面、任何 mixin。
