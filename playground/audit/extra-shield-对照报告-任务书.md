# 会话六任务书 · ETIM-Extra 盾面 对照报告（1.12.2 对位 · 第二阶段）

我们是 DeepSeek，不要吝惜真实 API 测试。

## 0 身份与边界

- 你是主 mod 项目的「会话六」：R196 一手资料库（decompile 树）+ 立项摸底/对照报告撰写方（`etim-mapping` skill 承载）。
- 上一轮（立项摸底 第 1 轮）已由 ETIM-Extra 主会话核讫：11 面、137 处锚点文件与行号全中、抽查引文逐字一致；**A-1 = R196 无盾** 的阻断结论已接受（账本 `audit-extra-裁定回执.md` 条 11）。
- 本轮只做一件事：把 ETIM-Extra 主会话已裁的 T-1…T-5 **翻成 1.12.2 落法（`path:line`）+ 算式 + 伪代码 + 判行锚**。
- **判值来源**：① R196 一手（上一轮摘录，本轮逐条复核行号）；② 本任务书 §2 的裁定（已裁，视为判值给定，**不得改判、不得另提候选**）。1.12.2 树只作落法/API 面，**不作判值来源**（禁从 1.12 反推 R196）。
- 只读：不改任何源码/资源/配置，不起服、不构建、不跑 gradle、不动 git（主 mod 树与本项目树均只读）。
- 落盘：`D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-对照报告.md`（UTF-8 无 BOM、LF、0 U+FFFD）。

## 1 输入

- 摸底（本轮的上游，同目录）：`playground\audit\extra-shield-立项摸底.md`（11 面 A-1…D-2；L-1…L-13 存在行；X-1…X-7 不存在行）。
- 判决源根（只读）：`D:\OpenCodeWorkspace\Easy Times In Minecraft\`
  - R196 反编译树：`mite-src\decompile\src\net\minecraft\`
  - javap 卷：`mite-src\tools\1.6.4-MITE-named.jar`；上一轮新出 `ETIM-Extra\playground\audit\extra-shield-javap\`（31 件）
- 1.12.2 对位树（本项目，**`gradle clean` 会删**）：`D:\OpenCodeWorkspace\ETIM-Extra\build\rfg\minecraft-src\java\net\minecraft\`（若无此树，如实报「树缺失」并停，不得凭记忆写行号）
- 主 mod 现役（只读参照，1.12.2 侧已落面）：
  - `combat/ETIMBlocking.java`（盾臂 `:99-105` 的 `isShieldStack`；磨损 `:140-155`）
  - `metal/ETIMGear.java:193-233`（`addShaped` 配方写法）、`:30-31/:139/:175-184`（`JUDGED_DURABILITY` 与 A-1 fail-fast）
  - `metal/ETIMItemSword.java:28-37`（×100 耐久算式 ctor 写法）
  - `metal/ETIMItemAxe.java:64-65`（`getItemEnchantability()` = 材料附魔度）
  - `mining/ETIMToolDurability.java:44-56`（同式 ×100）
  - `quality/ETIMQuality.java` 类头（品质载体 = 6 个 exact class）
  - `ETIMConfig`（`blockDamageFactor` / `blockMinDamage` / `shieldWearRate`）
- 本项目现状（只读）：`src\main\java\io\github\etim\etimextra\{ETIMExtra, ETIMExtraConfig, ETIMExtraLog}.java`

## 2 已裁口径（逐条照执行）

| 位 | 裁定 | 你必须交付的落法 |
|---|---|---|
| **T-1 耐久** | ① 工具系算式，`components = 1`，落地为常量 | 算式逐项引一手行；**mithril = 4.0 × 1 × 64.0 × 100 = 25,600**；**adamantium = 4.0 × 1 × 256.0 × 100 = 102,400**；常量落点 + 配置默认值 |
| **T-2 磨损** | ① 主 mod `ETIMConfig.shieldWearRate`（默认 1.0） | 只引主 mod `path:line`；**本项目零磨损代码**；说明「盾一旦 `isShield=true` 即自动进食主 mod 磨损臂」的判据行 |
| **T-3 配方** | ① 材料列形：shaped `"X X" / "XXX" / " X "`，X = 该金属锭（**6 锭**） | 两金属各一行；给出主 mod 里这两个锭的**实际注册名与 Java 引用**（`ETIMMetals` 侧），以及 1.12.2 注册入口 |
| **T-4 附魔/品质** | 附魔度 = 材料行（100／40）走 `getItemEnchantability()`；**不接品质**；**不补白名单** | 给 `Item.getItemEnchantability` 默认值行 + 本类覆写面；给「1.12.2 默认门对本类到底给哪些附魔」的 `path:line` 实证（Unbreaking / Mending / curse 是否到得了）；给「品质不进本类」的判断句（引主 mod 品质白名单） |
| **T-5 格挡** | ② `isShield` 门（主 mod 已收口） | 给 `Item.isShield` 默认实现行（身份比较）与覆写要求；给「不继承 `ItemTool`、不覆写 `canBlock()`、不加 BLOCK/decay 工具语义」的对照说明 |

**派生值性质**：25,600／102,400 是**派生值**，不是 R196 一手盾值（A-1 已证无盾）。报告须原样写明这一点，不得表述为「R196 盾耐久」。

## 3 实现面（账本条 11 已裁，逐条给落法，不许改口径）

- **类**：`io.github.etim.etimextra.shield.ETIMExtraItemShield extends net.minecraft.item.Item`。**不继承 `ItemShield`**（理由已在账本登记：ctor 绑 336 耐久、`getItemStackDisplayName` 绑 banner 名、`getIsRepairable` 绑木板、TEISR 只认 `item == Items.SHIELD` 身份）。若你发现继承 `ItemShield` 能少写且不引入上述负担，**列冲突项交裁**，不要自行改。
- **方法面 8 条**：`setMaxStackSize(1)` / `setMaxDamage(<派生值>)` / `isShield → true` / `getItemUseAction → EnumAction.BLOCK` / `getMaxItemUseDuration → 72000` / `onItemRightClick → setActiveHand` / `getItemEnchantability → 材料附魔度` / `addPropertyOverride("blocking")`。逐条给 1.12.2 签名 `path:line`（含 Forge 补丁面）。
- **注册名**：`etimextra:mithril_shield`、`etimextra:adamantium_shield`。lang 键 `item.etimextra.mithril_shield.name` = 秘银盾、`item.etimextra.adamantium_shield.name` = 艾德曼盾（en_us 给 Mithril Shield / Adamantium Shield）。
- **渲染**：首批标准物品模型（`item/handheld`），**3D 盾模型（custom TEISR + `ModelShield`）不进首批**。给 `models/item/*.json` 与 `textures/items/*.png` 的落点路径；纹理为占位图（落码阶段生成，非你交付），你只给规格（16×16、命名）。
- **配置**：`ETIMExtraConfig` 加两键 `shield.mithrilDurability=25600` / `shield.adamantiumDurability=102400`（Forge Configuration facade，与现有 `debug.extraDebugLog` 同风格）。**配置原则**：无一手来源的派生值可配（耐久）；有一手来源的判值不配（附魔度 100/40、配方 6 锭）。
- **日志**：`[ExtraLog]` 新增盾面注册行（`name / maxDamage / enchantability`）与配方行；格挡/磨损判行属主 mod `[BlockLog]`，**只引不改**，不得在本项目造第二通道。

## 4 交付面（L 组，逐面）

| 面 | 内容 |
|---|---|
| **L-1** | R196 算式落点复核（`ItemTool.java:36-42`、`EnumEquipmentMaterial.java:14-15`、`components=1` 的 R196 现成值三例）——只复核行号与值，不重推 |
| **L-2** | 派生算式逐项（4.0F × 1 × d × 100），两值，`int` 截断说明 |
| **L-3** | 物品类方法面 8 条（1.12.2 签名 + 行为，逐条 `path:line`） |
| **L-4** | 配置面（现有 `ETIMExtraConfig` 骨架 + 两键落点 + 默认值来源句） |
| **L-5** | 注册面（`ForgeRegistries.ITEMS` + 创造性页 + `[ExtraLog]` 判行形态） |
| **L-6** | 资源面（model JSON / 纹理 / lang 三件，路径 + 键名） |
| **L-7** | 配方面（`addShaped` 形 + 锭的实际引用 + 6 锭计数） |
| **L-8** | 附魔面（默认门实测：哪些附魔到得了本类，`path:line`；附魔度取值面） |
| **L-9** | 格挡面（主 mod `isShield` 门 + 磨损臂 `path:line`；盾侧需要满足的前置条件清单） |
| **L-10** | 判行锚与 W 判点草案（供后续验证窗：每个判点给「通道 + 预期行 + 判据」三件；判点编号用 `<W-n>` 占位，不携带主项目批号） |
| **L-11** | 冲突分级（A/B/C）+ 待裁位（若与 §2/§3 有冲突才开，编号 D-n，二选一 + 倾向） |

## 5 格式

- 模板 `templates/mapping-report.md` 的组号是 `M1…M6`；本批按 **L-1…L-11** 编面，请在 §0 写一句「组号改用 L 组，`report-check.js` 的 faces/grades 计数器不适用（计 0 属预期）」，其余模板纪律（引用写法、状态符 `✓/✗/?`、计数口径、§0 清单）照用。
- 每个 `path:line` 必须是**本轮自己 read/grep 出来的**行号，禁从摸底转抄（你的 skill 行号纪律）。
- 负证必带检索式 + 命中数 + 覆盖范围。
- 伪代码按主 mod 风格（双语 javadoc + 批注锚 + `ETIM<Feature>` 命名），但**只作报告内代码块**，不落盘成 `.java`。

## 6 禁止

- 不得改判 T-1…T-5；不得另提耐久/配方/附魔候选值。
- 不得从 1.12 反推 R196 判值；不得把主 mod 的 `ETIMMetals` javadoc 当 R196 判值。
- 不得新增第三方依赖、mixin、事件、TEISR、自定义渲染、自建日志通道。
- 不得改任何文件（含配置/资源）；不得起服/构建/跑 gradle/git。
- 不得省略负证（「没有」必须带检索式与命中数）。

## 7 回执（≤35 行，回传给我，不整贴）

1. 面数 / 状态分布（`✓/✗/?`）/ 冲突分级（A/B/C）/ 待裁位 D-n。
2. 派生值算式与两值（一行）。
3. 最容易返工的三处落法各一行（L-3 方法面 / L-8 附魔门 / L-9 盾侧前置条件）。
4. 零改动自陈 + 新增未跟踪文件清单。
