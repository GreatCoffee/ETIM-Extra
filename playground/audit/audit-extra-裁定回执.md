# ETIM-Extra 裁定回执（append-only）

- 项目：ETIM-Extra（modid `etimextra`）— 主 mod「Easy Times In Minecraft (etim)」附属；秘银盾 + 艾德曼盾
- 判据正本：本文件。判决链四件套同目录：`<批名>-立项摸底.md` / `<批名>-对照报告.md` / `<批名>-终审回执.md` / `<批名>-验证回执.md`
- 字节规格：UTF-8 无 BOM / LF。本文件只追加，不改写既有条目。

## 条 1 · 开账与骨架（2026-10-28）

- **来源**：主项目 `playground/audit/audit20-裁定回执.md` 条 97 收口开放面「双 jar 并行评估裁定」——`etimextra` / 秘银+艾德曼最小起 / 独立目录。
- **定位**：主 mod AD-10+SH 盾面裁定（b+c 档）的装备化延伸。主 mod 持机制（`MixinEntityLivingBaseBlock` 关 1.12 全免段；`combat/ETIMBlocking#onLivingHurt` 半减 + 1.0 地板 + `(int)(blocked × shieldWearRate)` 磨损）；本项目只持物品，不重导减算链。
- **骨架落码**：Gradle 9.7.0 / RFG 2.0.3 / Forge 14.23.5.2860 / Java 8 toolchain / tags 注入；`@Mod(modid=etimextra, dependencies="required-after:etim")`；`[ExtraLog]` 两行（preInit + boot 断言 etim 版本）。mixins 未开（首个 mixin 落地时再翻）。
- **阻塞 B-EXTRA-1**：mavenLocal 无 `io.github.etim:etim:1.0.0`（主项目 `publish_to_maven=false`，无 mavenLocal 发布面）。当前骨架不引用任何 etim 类，故 build 可绿；**首批落码前置 = 主项目出 `publishToMavenLocal`（dev 分类器）+ 本项目 `<dependencies>` 加坐标**。
- **测试面**：按 2026-10-28 跨项目裁定，自动化执行方 = 主 mod 项目会话七；工装源码落本项目 `testharness/`。

## 条 2 · D-3 无源待裁：盾面五档代价比较（2026-10-28，主会话）

触发条件：本批触碰盾物品/盾格挡路径（audit20 条 93 常备义务）。

| 档 | 内容 | 代价 | 本项目结论 |
|---|---|---|---|
| a | 移除配方/物品（删 vanila 盾 + 不做新盾） | 附属 mod 无内容；玩家失去盾面，1.12 剑格挡已是主 mod 唯一格挡面 | 不采（本项目立项即两件盾） |
| b | 全免→减半并接 R196 减算链 | 盾失去「完全免伤」卖点；与剑格挡同构，仅耐久/磨损载体不同 | **已采（主 mod AD-10+SH 已落，条 97）** |
| c | 25×raw 磨损与耐久门（盾走 `shieldWearRate`） | 顶级材料盾必须相对放大耐久，否则 336 底座 + rate 1.0 = 42 击就打碎，秘银盾比木盾更脆的观感 | **已采（主 mod 已落；本项目负责材料盾的耐久判值）** |
| d | 保留 1.12 语义仅收窄（正面 + 5 tick 起手 + 耐久） | 与主 mod 已关的全免段不相容（双算/死路）；且 R196 无方向门（M3-2） | 否（机制已定，不保留兼容） |
| e | ICPM 式「工具+盾合成」装盾变体（`SHIELD_ATTACHED` 组件） | 1.12 无 DataComponent；需配方 + NBT + tooltip + 姿态四面，且与「独立盾物品」立项冲突 | 否（仅作先例登记） |

**裁**：盾面口径 = b + c，物品面独立。本项目只裁「秘银/艾德曼盾」的材料数值（耐久、磨损、配方、附魔度、品质、格挡语义是否与 vanilla 盾一致）。

## 条 3 · 盾数值候选（未裁，待判决链）

R196 **无盾物品**（待会话二负证坐实）→ 盾的全部数值无一手来源，按 D-3 以「R196 材料行派生 + 1.12 盾底座」立候选：

- 底座：1.12 `ItemShield` 336 耐久 / 右键 BLOCK / 72000 使用时长 / `isShield=true`。
- R196 材料行（主 mod `ETIMMetals` 已落，待会话二复核）：mithril `durability=64 grade=4 enchant=100 armorPoints=9 quality=legendary`；adamantium `durability=256 grade=5 enchant=40 armorPoints=10 quality=legendary`。
- 耐久候选（**均未裁**）：
  - S1 `336 × (factor/16)` → mithril 1344 / adamantium 5376（以 ancient 16 为 1× 锚）
  - S2 `components(8) × factor × 2`（R196 胸甲式 ItemArmor:36-43）→ mithril 1024 / adamantium 4096
  - S3 `336`（vanilla 底座不动，只换材料配方/纹理）
  - S4 `factor × 21`（R196 甲件 base）→ mithril 1344 / adamantium 5376
- 判定前置：会话二（R196 一手负证 + 材料行）→ 会话六（对照报告）→ 会话五（终审）→ 本会话批文 → 落码 → 会话七验证回执。

## 条 4 · 对主 mod 的挂账提醒（2026-10-28）

- 主项目 `playground/audit/audit20-裁定回执.md` 收口计划需挂一条：**etim-1.0.0 出 mavenLocal 发布面（dev jar + 坐标 `io.github.etim:etim:1.0.0`）**，供 ETIM-Extra 编译期依赖；纯构建面，不改行为/API，挂账即可。

## 条 5 · B-EXTRA-1 解除：etim mavenLocal 发布面就位（2026-10-28 18:41）

- 主项目 `gradle/scripts/extra.gradle` 已加 `etimLocal` MavenPublication（未提交，主会话持有）：reobf jar → 主制品、dev jar → `dev` 分类器、sources jar。`gradlew publishToMavenLocal` 实跑 BUILD SUCCESSFUL。
- mavenLocal 实况（18:41:50，`~/.m2/repository/io/github/etim/etim/1.0.0/`）：`etim-1.0.0.jar` 762,605 B（reobf/SRG）、`etim-1.0.0-dev.jar` 746,954 B（MCP 名）、`etim-1.0.0-sources.jar` 683,689 B、pom 400 B。
- 本项目依赖：`implementation 'io.github.etim:etim:1.0.0:dev'`（`transitive=false`）。dev 编译/运行必须用 `dev` 分类器；主制品是 SRG 名，只供发布包/obf 环境。
- 依赖 jar **只能走 classpath，不得放 run/mods**：MixinBooter 的 CoremodsRescuer 会把 mods 里的 jar 提升到 classloader，FML 又扫 mods 目录 → `DuplicateModsFound` FATAL（18:40 实证）。

## 条 6 · 骨架端到端冒烟 PASS（2026-10-28 18:49）

- 环境：JDK 25 launcher / Java 8 运行时 / Forge 14.23.5.2847 / RFG 2.0.3 / MixinBooter 11.13（classpath，非 mods）；平铺世界 `run/extra-smoke`。
- 判行：`[ExtraLog] ETIM-Extra 0.1.0 preInit` → `[ExtraLog] boot ok - side=SERVER etim=1.0.0 etimextra=0.1.0` → `Done (0.523s)!` → `Stopping the server` → `Saving worlds`；Gradle `BUILD SUCCESSFUL`；7 mods loaded，mixin 失败 0。
- 钉值：`build/libs/etimextra-0.1.0.jar` 3,205 B @ 2026-10-28 18:48:02｜SHA-256 `28E05FA974C3EF49FE0C4E4095C06EDCD3D91A7BC3B7816715AC3E833F7335CC`。
- 日志落盘：`testharness/build-logs/08-smoke-latest.log`（52,431 B）；构建日志 `08-build.log`。

## 条 7 · B-EXTRA-2：原版 1.12.2 RCON 单包缺陷（2026-10-28，阻断测试工装）

- 现象：任何 `auth → exec` 双包连接，服务端在 auth 应答后立即断连，下一次读 `clientSocket=null` → `NPE at RConThreadClient.run:56`（日志 12 次实证）。
- 根因（一手）：`RConThreadClient.run()` 的 `try/finally` 在循环体内，`case 3/2` 的 `continue` 会触发 `finally { closeSocket(); }` → `clientSocket = null` → 下一轮首行 NPE。**一条连接只能承载一个包**，`loggedIn` 又是连接级状态 ⇒ 原版 RCON 无法执行命令。
- 处置：本项目工装停服改走**控制台 stdin**（`run-server.ps1` 在 N 秒后向 `gradlew runServer` 的 stdin 写 `stop`），已验证 `Stopping the server` + `Saving worlds` + BUILD SUCCESSFUL。会话七若需 RCON exec 面，须照主项目做法给 `RConThreadClient` 打 binpatch，并在 `testharness/` 内落补丁说明。
- 备注：首次冒烟（18:42 轮）因 RCON 不可用而对一个空平铺世界做了强制终止；世界随后删除重建，未留判据缺口。

## 条 8 · 风格对齐主 mod（GLM 手笔）+ 骨架重构（2026-10-28 18:58）

- 收到长期风格约束（双语 javadoc / 批次锚 / `[XxxLog]` 静态类 / Forge Configuration 门面 / exact-class 白名单 / 无防御兜底 / import 分组 / 最小 diff）。
- 重构面：新增 `ETIMExtraConfig`（`config/etimextra.cfg`，`debug.extraDebugLog` 默认 false，preInit 一次性载入）+ `ETIMExtraLog`（私有构造、静态行方法、`String.format(Locale.ROOT, ...)`、类头行清单）；`ETIMExtra` 类头补中文同译段，`preInit` = `ETIMExtraConfig.init` + `ETIMExtraLog.preInit`，`init` 走 `ETIMExtraLog.boot`。
- 两行载入判行**不设开关**（理由写进 `ETIMExtraLog` 类头）：可控的 boot 断言会正好藏掉冒烟轮要判的事实；首批内容之后的判行一律挂 `extraDebugLog`。
- 复验（`testharness/build-logs/09-smoke-latest.log`，52,091 B）：`[ExtraLog] preInit` → `boot ok - side=SERVER etim=1.0.0 etimextra=0.1.0` → `Done (0.709s)!` → `Stopping the server`；`run/config/etimextra.cfg` 生成含 `B:extraDebugLog=false`；Gradle BUILD SUCCESSFUL。
- **新钉值**：`etimextra-0.1.0.jar` 4,928 B @ 2026-10-28 18:57:41｜SHA-256 `0A0BD8B4360EF0BB245694D70F8C9B3E418CB1D1BDE215DA661C6F116532EFB1`（条 6 的 3,205 B / `28E05FA9…335CC` 退役）。
- 自检五问：排版 ✓｜注释密度 ✓（新类双语）｜判值锚 ✓（本批无判值，锚 = audit-extra 条 1/6 + D-3）｜判据通道 ✓｜config 门面 ✓。

## 条 9 · 流程自陈与更正（2026-10-28，收到组织关系澄清后）

- **更正前提**：会话五/二/六/七/九 均属主 mod 项目（D:\OpenCodeWorkspace\Easy Times In Minecraft\），按需出借；用户是唯一中转；本会话只持 ETIM-Extra 的盖章、判值与账本。
- **自陈 1（越位推导）**：条 3 的耐久候选 S1~S4 是我用「1.12 盾底座 + 主 mod `ETIMMetals` 已落材料行 + MITE-RB-2025 先例」自行对位得出的草案——**对位属会话六职责、一手属会话二职责**。条 3 保留为过程记录，其候选**不作判值、不进批文**；正式对位表以会话六产出为准，材料行以会话二回件为准。
- **自陈 2（转引标注不足）**：条 3 中 mithril/adamantium 的 durability / enchantability / armorPoints 系转引自主 mod `ETIMMetals` 类头 javadoc（主 mod 判值），非本项目一手；会话二回件到达前不得作为本项目判值引用。
- **自陈 3（主项目构建面动作）**：为解依赖阻塞，我曾手工把 `etim-1.0.0-dev.jar` 与自写 pom 装入 `~/.m2`；随后主项目 `extra.gradle` 出现 `etimLocal` 发布面，我的手工件覆盖了其中部分产物；我已复跑 `gradlew publishToMavenLocal`（主项目构建动作，**未改任何源码**）复原为：主制品 762,605 B / dev 746,954 B / sources 683,689 B / 官方 pom。现 `~/.m2` 无手工残留。**发布面文件改动仍未提交，须由主 mod 主会话收口**（跨项目任务书已出，见本轮回执）。
- **后续动作口径**：一手判值 → 会话二；对位/对照报告/判行锚 → 会话六；终审 → 会话五；测试执行 → 会话七；主项目账本挂条 → 主 mod 主会话（用户中转）。本会话不再自行检索 `mite-src` 产出判值。

## 条 10 · 身份规范 v2 生效 + 条 9 指代勘误（2026-10-28）

- **唯一身份规范 = v2**：裸称「会话X」只指主 mod 项目会话；本项目自有会话一律「附属会话X」；本会话自称必须写全称「ETIM-Extra 主会话」，裸写「主会话」= 主 mod 主会话（GLM-5.3-Flash）。
- **角色表（v2）**：会话零 = 环境搭建；会话一 = MITE 竞品实现调研（仅参考）；会话二 = MITE 玩家侧资料（仅参考，**不进判决链**）；会话三 = Forge 生态轮子调研（仅参考）；会话四 = 判值总表建设；会话五 = 终审；**会话六 = R196 一手（唯一来源）+ 摸底/对照报告**；会话七 = 自动化测试；会话八 = 纯文书；会话九 = 无状态机械核计。
- **条 9 勘误**：条 9 与立项摸底任务书旧版把「R196 一手检索/立项摸底」指派给会话二，属**错投**（会话二只做 MITE wiki 类资料，不进判决链）。现改为会话六（同 DeepSeek 档）；任务书文件已就地改投，此前若已转发给会话二的版本作废。
- 条 9 其余自陈（越位推导、转引标注、mavenLocal 手工件）不受影响，仍然有效。

## 条 11 · 盾面立项摸底核讫 + T-1…T-5 裁定 + 派生值登记（2026-10-28，ETIM-Extra 主会话）

- **核讫对象**：`playground/audit/extra-shield-立项摸底.md`（50,087 B / 473 行 / 首字节 `0x23` / CR 0 / U+FFFD 0，与会话六回执逐位相符）。
- **锚点机械核**（本轮独立复跑，只核存在性与引文，不复算判值）：报告内 `X.java:NN` 锚 **137 处 / 111 个不同**——文件存在 137/137、行号越界 **0**；抽查 7 处引文与源逐字比对：`ItemTool.java:36-42`（`4.0F × components × durability × 100.0F`）、`:54-56`（`canBlock()` 真）、`ItemArmor.java:36-43`（非锁甲 ×2）、`:45-74`（甲点表）、`Damage.java:197-210`（半减 → 1.0 地板 → 仅 `instanceof ItemTool` 磨损）、`EntityPlayer.java:205-206`（单手持槽）、`EnumEquipmentMaterial.java:12-15`（iron 8.0/30/masterwork；ancient 16.0/40；mithril 64.0/100/legendary；adamantium 256.0/40/legendary）——**全部一致**。
- **接受 A-1 阻断结论**：R196 无盾（10 条负证，与游戏内容相关命中 0）。本条起 D-3（条 2）状态由「无源待裁」改为「**无一手盾行 ⇒ 派生登记**」，派生依据与算式见下；条 3 的 S1~S4 草案仍不作判值。
- **接受勘误 E-1**：任务书 B-3 的「甲点 `:49-50`」实为 rusted_iron 分支，甲点表在 `:45-74`；判值不变（9/10）。
- **T 裁定**（本会话裁，会话六据此出对照报告，不得改判）：

| 位 | 裁定 | 一手依据 / 主 mod 落点 | 结果 |
|---|---|---|---|
| **T-1 耐久** | 采 ① 工具系算式，`components = 1`，落地为常量（配置默认值） | `ItemTool.java:36-42` 算式；`EnumEquipmentMaterial.java:14-15` 材料行；`components=1` 取 R196 现成值（`ItemShovel:26`／`ItemCudgel:32`／`ItemFlintAndSteel:14`） | mithril **25,600**｜adamantium **102,400** |
| **T-2 磨损** | 采 ① 主 mod `ETIMConfig.shieldWearRate`（默认 1.0） | 主 mod `combat/ETIMBlocking.java:140-155`（`(int)(blocked × rate)`） | 本项目**零磨损代码**；不加第二套 rate |
| **T-3 配方** | 采 ① 材料列形：shaped `"X X"/"XXX"/" X "`，X = 该金属锭（**6 锭**） | 主 mod `metal/ETIMGear.java:193-233`（同款 `addShaped`）；6 锭落在甲位区间（靴 4／盔 5／腿 7／胸 8） | 每金属一行配方 |
| **T-4 附魔/品质** | 附魔度照材料行（mithril 100／adamantium 40）走 `getItemEnchantability()`；**不接品质**；**不补白名单** | 主 mod `metal/ETIMItemAxe.java:64-65` 同写法；品质载体 = 6 个 exact class（`quality/ETIMQuality.java` 类头）；1.12.2 默认门对任何可损坏物品给 Unbreaking（`EnchantmentDurability.java:43-46`）+ Mending（`EnumEnchantmentType.BREAKABLE`） | 盾可附 Unbreaking/Mending；耐久不吃品质乘算 |
| **T-5 格挡** | 采 ② `isShield` 门（主 mod 已收口） | `Item.java:1298-1300`：默认实现是 `stack.getItem() == Items.SHIELD` **身份比较** ⇒ 必须覆写返回 true；主 mod `ETIMBlocking.java:99-105` | 不继承 `ItemTool`、不覆写 `canBlock()`、不加 BLOCK/decay 工具语义 |

- **派生值登记（算式明列，非一手盾值）**：`4.0F × 1 × 64.0F × 100.0F = 25,600`（秘银）；`4.0F × 1 × 256.0F × 100.0F = 102,400`（艾德曼）。**拒 ② 护甲系**：`1 × d × 2` → 128／512，低于主 mod 铁剑 6,400、秘银剑 51,200（`ETIMItemSword` ctor 同式），同材料做盾反比剑脆约 40 倍，违背条 2 c 档「顶级材料盾必须相对放大耐久」的口径。**拒 ③ 裸写常量**：与 ① 数值相同时 ① 可复算，③ 不可复算。
- **物品实现面裁定（对照报告须逐面给 1.12.2 `path:line`）**：
  - 类 = `ETIMExtraItemShield extends net.minecraft.item.Item`；**不继承 `ItemShield`**（其 ctor 绑 336 耐久、`getItemStackDisplayName` 绑 banner 名、`getIsRepairable` 绑木板、且 `TileEntityItemStackRenderer` 只认 `item == Items.SHIELD` 身份 `:62`，继承拿不到 3D 盾模型却白带 banner 语义）。
  - 方法面 8 条：`setMaxStackSize(1)` / `setMaxDamage(<派生值>)` / `isShield → true` / `getItemUseAction → EnumAction.BLOCK` / `getMaxItemUseDuration → 72000` / `onItemRightClick → setActiveHand` / `getItemEnchantability → 材料行` / `addPropertyOverride("blocking")`。
  - 注册名：`etimextra:mithril_shield`、`etimextra:adamantium_shield`；lang：`item.etimextra.mithril_shield.name` = 秘银盾、`…adamantium_shield.name` = 艾德曼盾。
  - 渲染：首批用标准物品模型（`item/handheld`），**3D 盾模型（custom TEISR + `ModelShield`）不进首批**；客户端面判据由用户肉眼。
  - 配置：`ETIMExtraConfig` 加 `shield.mithrilDurability=25600` / `shield.adamantiumDurability=102400` 两键。**配置原则**：无一手来源的派生值可配（耐久）；有一手来源的判值不配（附魔度 100/40、配方 6 锭）。
- **日志面**：`[ExtraLog]` 新增盾面注册行（`name / maxDamage / enchantability`）与配方行（`shield recipe registered …`）；格挡与磨损判行属主 mod `[BlockLog]`（只读引用，不在本项目造第二通道）。
- **零落码**：本条为裁定，未动 `src/`；本轮新增文件 = 本条目 + `extra-shield-对照报告-任务书.md`。

## 条 12 · 对照报告核讫 + D-1…D-3 裁定 + A-1 事实勘误（2026-10-28，ETIM-Extra 主会话）

- **核讫对象**：`playground/audit/extra-shield-对照报告.md`（57,157 B / 650 行 / 首字节 `0x23` / CR 0 / U+FFFD 0，与回执逐位相符）。
- **锚点机械核**：报告内 `X.java:NN` **171 处 / 108 个不同**——其中 162 落在 R196 树／主 mod 树／本项目树，另 9 处是 Forge 类（`Configuration` / `ForgeRegistries` / `RegistryEvent` / `ModelLoader` / `GameRegistry` / `IForgeRegistryEntry`），经 `build/rfg/minecraft-src/java/net/minecraftforge/**` 实测**全部存在** ⇒ **171/171 存在、行号越界 0**。
- **抽查 6 处引文与源逐字比对**：`enchantment/EnchantmentHelper.java:343-348`（`i <= 0 → return 0` 硬门）、`inventory/ContainerEnchantment.java:337`（`buildEnchantmentList(..., false)`）、`item/Item.java:277-280`（`isDamageable()`）、`entity/EntityLivingBase.java:2978-2979`（`duration <= 0 → return`）、`entity/EntityLiving.java:1130`（`isShield(stack, null)`）、`metal/ETIMMetals.java:40-41`（mithril 64/100/9/LEGENDARY；adamantium 256/40/10/LEGENDARY）——**全部一致**。派生算式与两值（25,600／102,400）复核通过，且报告已原样声明「派生值，非 R196 盾值」。
- **勘误 E-1（本会话自核，交会话五终审定谳）**：报告 §11.1 `A-1` 与 §0.1 L-5 行的「`RegistryEvent.Register<Item>` 早于 `FMLPreInitializationEvent`」**事实反向**。Forge 1.12.2 `Loader.preinitializeMods()` 的实序是：`fireCreateRegistryEvents()`（`Loader.java:625`）→ `distributeStateMessage(LoaderState.PREINITIALIZATION, …)`（`:629`，按 `LoaderState.java:44` 派发 **FMLPreInitializationEvent**）→ `fireRegistryEvents()`（`:630`，派发 **RegistryEvent.Register**）。⇒ RegistryEvent **晚于** preInit 事件，配置值在 RegistryEvent 处理器里同样可读。**A 级降为事实勘误**（不改变任何落法）；D-3 结论不变，理由改为「主 mod 同形 + 少一个注解类 + 不改 `ETIMExtraConfig` 的既有契约」。
- **D 裁定**（本会话裁）：

| 位 | 裁定 | 理由 |
|---|---|---|
| **D-1** `blocking` 属性首批落不落模型侧 | **① 只注册属性，模型 JSON 不写 `overrides`** | 首批只有 `item/handheld` 一个模型，写 overrides 也指向同一模型（视觉零变化）却多两个资源；3D 批再接 |
| **D-2** 附魔度覆写面 | **① 只覆写 `getItemEnchantability()`（无参版）** | `item/Item.java:1156-1159` 已委派；主 mod 先例 `ETIMItemAxe.java:63-66` 同形 |
| **D-3** 注册点 | **① `preInit`** | 主 mod 同形（`ETIM.java:74-77`）；不新增注解类；`ETIMExtraConfig.init` → `ETIMExtraLog.preInit` → `ETIMExtraContent.register` 的顺序已由现骨架自然成立 |

- **接受并登记为已知后果**（不裁改）：B-1 附魔台实际只出 Unbreaking（Mending 走附魔书+铁砧）；B-2 无 vanilla 5 tick 起手门槛（与 R196 一致）；B-3 一个盾横跨两份配置（耐久在本项目、磨损率在主 mod）；C-1…C-6 照登。
- **零落码**：本条为裁定，未动 `src/`；本轮新增文件 = 本条目 + `extra-shield-终审-任务书.md`。

## 条 13 · 终审核讫 + 落码批文 + 盾面首批落码（2026-10-28，ETIM-Extra 主会话）

- **终审回执**：`playground/audit/extra-shield-终审回执.md`（27,847 B / 220 行）。L-1…L-11 **逐面 ✓，无一打回**；A3／B4／C6 维持；与报告 §3.2 伪代码**零偏差**；无新增待裁位。
- **E-1 定谳 = 确认**（`Loader.java:625` fireCreateRegistryEvents → `:629` distributeStateMessage(PREINITIALIZATION) → `:630` fireRegistryEvents；`LoaderState.java:44`；`GameData.java:834-850`）：RegistryEvent.Register **晚于** FMLPreInitializationEvent。报告的 A-1 降为事实勘误，**「唯一性」论据作废**，D-3 ① 结论不变（B-审1，知悉项，无需动作）。
- **接受 C-审1**：报告 L-1⑤⑥⑦ 的区间行号比方法声明行早一行（`ItemShovel:25-28` 实 `:26-28` 等），含真锚零后效；本条 11 自用的 `:26`／`:32` 为精确行，不矛盾。
- **接受旁证**：主 mod `ETIMBiomeUnderworld.java:58-59` 的 javadoc 带同款反向时序句——E-1 病灶溯源；下游**不得**引注释当时序依据。
- **落码批文**：`playground/audit/extra-shield-落码批文.md`（判据正本：判值正本表 + 落码清单 + W-1…W-8 判点 + 验收线）。
- **落码执行**（本会话）：新增 java 3（`shield/ETIMExtraItemShield`、`shield/ETIMExtraContent`、`client/ETIMExtraItemModels`）＋ 改 java 3（`ETIMExtraConfig` +2 键、`ETIMExtraLog` +3 行方法、`ETIMExtra` preInit +1 行）＋ 新增资源 6（2 模型／2 纹理 16×16 占位／2 lang）。**零机制改动**：无 mixin／无事件注册／无 TEISR／无新通道／无 3D 盾模型／无附魔白名单。
- **落码轮冒烟**：`testharness/build-logs/11-shield-smoke-latest.log`——`[ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1`、`…adamantium_shield … maxDamage=102400 enchantability=40 stack=1`、两条 `shield recipe=… count=6`、`shield recipes total=2`、`boot ok - side=SERVER etim=1.0.0 etimextra=0.1.0`；`Done (0.625s)!` → `Stopping the server` → `Saving worlds`；`run/config/etimextra.cfg` 生成 `shield` 节两键。
- **钉值**：`build/libs/etimextra-0.1.0.jar` **14,170 B** @ 2026-10-28 20:35:50｜SHA-256 `470809B038359F706EE22419538DBC2433C5CAE15D56D145217E813F23E5519A`。
- **下一环**：会话七 验证窗（判据正本 = 落码批文 §4；任务书 `extra-shield-验证窗-任务书.md`）。

## 条 14 · 盾面首批验证窗核讫 + 闭单（2026-10-28，ETIM-Extra 主会话）

- **验证回执**：`testharness/reports/extra-shield-verdict.md`（27,249 B / 330 行 / 首字节 `0x23` / CR 0 / U+FFFD 0）。
- **钉值（起窗 = 收口，逐位）**：jar **14,170 B**｜SHA-256 `470809B038359F706EE22419538DBC2433C5CAE15D56D145217E813F23E5519A`｜mtime 2026-10-28 20:35:50｜HEAD `54eed94`｜**0 rebuild**（8 轮 runServer 未重跑 jar/reobf）。
- **判点**：W-1…W-8 **全 ✓，判点 ✗ = 0**；冲突分级 **A 0 / B 0 / C 6**。
- **本会话独立复核**（直接 grep 窗口日志，不采信转述）：`gate … active=etimextra:mithril_shield src=mob suppressed=true`、`wear … rate=1.000 decay=na wear=4 dur=0->4`、`block … raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:mithril_shield`、下限臂 `raw=1.000 → blocked=1.000`（非 0.500，地板生效）、`probe … dur=0/25600` 与磨损后 `dur=4->5`、`[EnchantLog] table power=15 slot0=4 slot1=12 slot2=30`（mithril）／`7/11/30`（adamantium）——全部与批文 §4 预期行一致。
- **工装面已还原**：`run/config/etim.cfg` 的 `blockDebugLog` 窗内 true、收口回 false（回读同值）；`run/ops.json` 新增工装 op 账号（`run/` 不入版本库）。
- **待裁 5 项裁定**：

| # | 事项 | 裁定 |
|---|---|---|
| 1 | C-1 批文尾标口径 | **接受**：批文 §3 就地订正（`[ExtraLog]` 无尾标、`[BlockLog]` 有 `[server]`；判据按行内字段匹配）——只改说明，不改任何判点 |
| 2 | C-2/C-3/C-4 工装纪律 | **接受并固化**：假人必须 op／每臂 `etest health 6` 复位（R196 `capAtLevel0=6`）／单只 mob + `Tags`——已入 `testharness/README.md` |
| 3 | C-5 客户端四面 + 附魔台 GUI | **不开专门窗**：本批 W-7 已有日志面判据（`[EnchantLog]` 三档非 0 + 对照组 stick 全 0），GUI 与图标/模型/显示名/姿态全部降为「用户肉眼遗留项」，**不阻断闭单**；用户随时可在自己客户端确认 |
| 4 | W-7 判面 | **改判为日志面**：`[ExtraLog] enchantability=` + `[EnchantLog] table slot0/1/2` 非 0，对照组全 0；GUI 仅作转述 |
| 5 | 闭单 | **闭单**：A 级 0、B 级 0、判点 ✗ 0 |

- **本批结论**：秘银盾 / 艾德曼盾 服务端面**闭单**（物品注册、派生耐久、6 锭配方、isShield 格挡链、半减、地板、磨损、附魔门、品质不接 全部有可 grep 行）。唯一遗留 = 客户端观感面（图标/手持模型/显示名/右键姿态/tooltip），由用户肉眼确认，非判据、不阻塞。
- **遗留项登记**：客户端观感（未做，用户随时可做）；3D 盾模型 / TEISR / Mending 白名单 / 禁用 vanilla 盾 / 盾的品质档——**仍不在范围**（批文 §6）。

## 条 15 · 盾面观感批（3D 模型 + 举盾姿态）+ 用户遮挡口径（2026-10-28）

- **触发**：用户首轮肉眼判（客户端 `13-client` 轮之前的构建）：**图标太糊、名字正确、没有举盾姿态**。
- **姿态缺失的诊断**（一手行）：① vanilla 1.12 第一人称 `case BLOCK` 与 `case NONE` 调同一个 `transformSideFirstPerson`（`client/renderer/ItemRenderer.java:392-402`）⇒ 纯物品 + `EnumAction.BLOCK` **零可见姿态**；② 主 mod 的姿态 mixin 门是 `isBlockCarrier`（`mixins/MixinItemRendererBlockPose.java:46`，注释明写「不含盾」）⇒ 盾拿不到工具那套补偿。结论：不是漏写，是两条路都不覆盖盾。
- **处置（本会话落码）**：
  - 新增 `client/ETIMExtraShieldRenderer`（per-item TEISR）：vanilla `ModelShield` 几何 + 本 mod 纹理，体例照 `TileEntityItemStackRenderer:62-76` 的盾臂；
  - 模型 JSON 改 `builtin/entity`，**display 变换直接采 vanilla 盾的数值**（`assets/minecraft/models/item/shield.json` 与 `shield_blocking.json`），运行时按 `blocking` 谓词切到 `*_shield_blocking` ⇒ 举盾姿态 = 原版举盾位姿，非自估；
  - 纹理改 64×64 entity 图集（以 vanilla `shield_base.png` 重着色：秘银冷银蓝／艾德曼暗钢绿），弃用原 16×16 占位 item 图（已删）。
  - 零机制改动：仍无 mixin、无事件注册、无新通道；TEISR 只挂客户端类。
- **观测结果**：用户确认「一切正常」（图标清晰、名字正确、右键有举盾姿态）。
- **用户口径（仅记录，不做任何干预）**：**举盾会遮挡相当大一块屏幕，这是 Minecraft 1.12 的机制；该遮挡可由资源包调整，属原版用户层操作，本项目不干预**。
- **范围变更登记**：3D 盾模型／TEISR 由「本批不做」（批文 §6）转为**已做**（由用户观测需求触发）；Mending 白名单／禁用 vanilla 盾／盾的品质档**仍未做**。
- **新钉值**：`build/libs/etimextra-0.1.0.jar` **20,680 B** @ 2026-10-28 21:20:41｜SHA-256 `9FFE0D2720F998B355BA3453542059D2BEA26D1405113BCA2BFDD7F725C1A796`（前钉 14,170 B／`470809B0…` 作废）。
