# 会话五终审任务书 · ETIM-Extra 盾面 对照报告（双源审计）

## 0 身份与边界

- 你是主 mod 项目的「会话五」：判决链终审方（javap 双源审计，`etim-audit` skill 承载）。
- 审件：`D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-对照报告.md`（57,157 B / 650 行 / 11 面 L-1…L-11）。
- 上游：同目录 `extra-shield-立项摸底.md`（11 面 A-1…D-2，已核讫）、`audit-extra-裁定回执.md` 条 11（T-1…T-5 已裁）、条 12（D-1…D-3 已裁 + 勘误 E-1）。
- **审什么**：落法是否成立（1.12.2 侧 `path:line` 与行为是否如报告所述）＋ 派生算式的 R196 双源（源码 + javap 字节码）是否钉得住。
- **不审什么**：T-1…T-5 与 D-1…D-3 是 ETIM-Extra 主会话的裁定，**不得改判**；若你认为某条裁定的事实前提有误，出 B/C 级判词 + 交裁，不要自行替换数值。
- 只读：不改任何源码/报告/资源，不起服、不构建、不跑 gradle、不动 git。工作树若有未提交改动，不审不碰。
- 落盘：`D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-终审回执.md`（UTF-8 无 BOM、LF、0 U+FFFD）。

## 1 判决源（硬序）

1. **R196 反编译树**：`D:\OpenCodeWorkspace\Easy Times In Minecraft\mite-src\decompile\src\net\minecraft\`（判值唯一一手；`EntityPlayer.java` 直接在 `net\minecraft\` 下）。
2. **R196 字节码**：`mite-src\tools\1.6.4-MITE-named.jar`；上一轮新出卷 `ETIM-Extra\playground\audit\extra-shield-javap\`（31 件，可复现）。
3. **1.12.2 对位树**：`D:\OpenCodeWorkspace\ETIM-Extra\build\rfg\minecraft-src\java\net\minecraft\` 与 `...\net\minecraftforge\`（**只核 API 实名与行为，不作 MITE 判值**）。
4. **主 mod 现役**：`D:\OpenCodeWorkspace\Easy Times In Minecraft\git-workspace\etim\src\main\java\io\github\etim\etim\`（只读）。

## 2 必审 7 项（逐项给判词）

| # | 审点 | 报告位 | 你要钉的 |
|---|---|---|---|
| **1** | **派生算式双源** | L-1／L-2 | `4.0F`（`ItemTool.java:37`）、`×100.0F`（`:41`）、`64.0F`／`256.0F`（`EnumEquipmentMaterial.java:14-15`）在 javap 卷里逐条命中（`javap_ItemTool.txt`／`javap_EnumEquipmentMaterial.txt` ⇒ `fconst`/`ldc` 行）；`components=1` 的 R196 现成值（`ItemShovel`／`ItemCudgel`／`ItemFlintAndSteel`）；两值算术自算一遍 |
| **2** | **物品类 8 条方法面** | L-3 | 每条 `path:line` 与签名如实；`getMaxItemUseDuration` 的「≤0 ⇒ return」链（`EntityLivingBase.java:2978-2979`）；`isShield` 默认身份比较（`Item.java:1298-1301`）；`addPropertyOverride` 是否 `final` |
| **3** | **附魔门** | L-8 | `EnchantmentHelper.java:343-348` 硬门；`ContainerEnchantment.java:337` 传 `false`；`BREAKABLE` = `isDamageable()`（`EnumEnchantmentType.java:106-114`）；Mending/Vanishing 的 treasure 判定（`EnchantmentMending.java:29-32` 等）；「附魔台实际只出 Unbreaking」是否成立 |
| **4** | **无双磨损** | L-9 | vanilla 全免段（`EntityLivingBase.java:996-1012`）与 `damageShield` 唯一调用点（`:998`）的包含关系；主 mod `MixinEntityLivingBaseBlock.java:41-54` 的断点是否在 HEAD/cancellable；`EntityPlayer.java:1172-1178` 是否只剩不可达 |
| **5** | **主 mod 两臂的判据行** | L-9 | `combat/ETIMBlocking.java` 的 `isShieldStack`／`isBlockingCarrier`／`wearShieldOrTool` 行号与实文；`ETIMConfig.shieldWearRate` 的字段与注册行 |
| **6** | **配方与跨 mod 引用** | L-7 | 6 锭计数（`"X X"+"XXX"+" X "`）；`GameRegistry.addShapedRecipe` 的重载签名；`ETIMItems.ingotMithril`／`ingotAdamantium` 的注册名与可见性；主 mod `addShaped` 是否 `private` |
| **7** | **勘误 E-1 定谳** | §11.1 A-1／§0.1 L-5 | 账本条 12 的 E-1：`Loader.preinitializeMods()` 的实序（`Loader.java:625/629/630` + `LoaderState.java:44`）是否如 E-1 所述——**RegistryEvent.Register 晚于 FMLPreInitializationEvent**。若确认，A-1 降级为事实勘误；若你判定 E-1 有误，给反面证据行 |

## 3 已知争议（不许绕开）

- **A-1 时序**：报告原文说「RegistryEvent 早于 preInit」，账本条 12 已判为反向。**请以 `Loader.java:618-636` 实序定谳**，不要只引报告、也不要只引 E-1。
- **B-1 附魔面收窄**：附魔台只出 Unbreaking 是 T-4「不补白名单」的直接后果，出判词时请明确「这是裁定后果，不是缺陷」，避免下游误当 bug 返工。
- **D-1 `blocking` 属性休眠**：`Item.setMaxDamage` 会自动加 `damaged`/`damage` 两个属性覆写（报告 C-1），与 `blocking` 一样在模型侧无消费者——判词里请把「属性注册成功但休眠」与「模型缺资源」分开写。

## 4 输出格式

- 按 `templates/audit-receipt.md` 结构：〇 判决类清单 → 一 逐项核讫表（逐条 `path:line` + 实值）→ 二 冲突分级（A/B/C）→ 三 伪代码建议（如与报告 §3.2 有偏差才写）→ 四 待裁（若有）。
- 每条判词必须有证据行：R196 一侧给裸文件名 + 行号（javap 命中的给卷名 + 行号）；1.12.2 一侧给包内相对路径 + 行号。
- **判词只列证据与结论**，不要重写报告、不要给新数值。
- 若某面判 `✗`，必须给出「哪一行、实际是什么、应为哪一行」。

## 5 禁止

- 不得改判 T-1…T-5／D-1…D-3；不得给出新的耐久/配方/附魔候选值。
- 不得从 1.12 反推 R196；不得把主 mod 的 javadoc 当 R196 一手。
- 不得改任何文件（含报告/账本）；不得起服/构建/跑 gradle/git。
- 不得省略负证（「没找到」必须带检索式与命中数）。

## 6 回执（≤30 行，回传，不整贴）

1. 逐面定谳一行（L-1…L-11：✓/✗ + 半句判词）。
2. 冲突分级（A/B/C）＋ 勘误 E-1 的定谳（确认/否决 + 依据行）。
3. 与报告 §3.2 伪代码的偏差（若有，逐点）。
4. 待裁项（若有）。
5. 零改动自陈 + 新增未跟踪文件清单。
