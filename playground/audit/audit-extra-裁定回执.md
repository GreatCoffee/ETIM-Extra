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

## 条 16 · 盾面补种（铜 / 银 / 远古金属）+ 五种金属盾收口（2026-10-28，ETIM-Extra 主会话）

- **触发**：用户「补全剩余种类的金属盾」。判据正本 `playground/audit/extra-shield-补种批文.md`；回执 `testharness/reports/extra-shield-family-verdict.md`。
- **范围口径**：只补「在 R196 材料表里有锭」的金属 ⇒ 铜／银／远古金属三件，与已闭单的秘银／艾德曼合计 **5 件**。**锈铁无锭无盾**（`ETIMItems.java:29-33`）；**金／铁不补**（R196 保留 vanilla 物品，`ETIMMetals.java:8-9`）。
- **判值（全部沿用已裁定算式，本批零新增 R196 读数）**：

| 金属 | `d`（`ETIMMetals` 行） | 耐久（**派生** `4×1×d×100`） | 附魔度（一手） |
|---|---|---|---|
| 铜 | 4（`:37`） | **1,600** | 30 |
| 银 | 4（`:38`） | **1,600** | 30 |
| 远古金属 | 16（`:39`） | **6,400** | 40 |
| 秘银 | 64（`:40`） | 25,600 | 100 |
| 艾德曼 | 256（`:41`） | 102,400 | 40 |

- **自洽核对（入账）**：盾耐久 = 同金属剑耐久的一半（剑 `components=2`），五种金属逐一对上 ⇒ 算式没有为任何单一金属开口。派生值口径不变：五条耐久都不是 R196 一手盾值。
- **落码**：`ETIMExtraContent` +3 件（`copper_shield`／`silver_shield`／`ancient_metal_shield`）+ `shields()` 注册序数组 + 断言改遍历 + 3 条形状配方；配置 +3 键；`ETIMExtraLog.shieldRecipe` 增 `output=`；客户端模型注册改遍历 + 纹理名 = 注册路径；资源 = 5 base 模型 + **1 个共享 `shield_blocking`**（原两个 per-metal blocking 已删）+ 3 张 64×64 重着色纹理 + 3 条 lang ×2。`ETIMExtraItemShield` **一行未改**（8 条方法面原样）。
- **判据强化（本批新增，入账）**：W-2 类行从「照抄入参的常量 6」改为**从 `CraftingManager.REGISTRY` 已注册配方反读**（非空格数 + 首个材料物品 + 产物），并加 `slots != 6 ⇒ throw` 的 T-3 合约断言 ⇒ 形状打错时**加载当场中止**，不会带着错配方进游戏（javap 复核：`INGOTS_PER_SHIELD = 6`，`bipush 6` → `IllegalStateException`）。
- **冒烟窗结果**：W-9 ✓ 五行逐值对（1600/1600/6400/25600/102400；30/30/40/100/40）；W-10 ✓ 五行 `count=6` 且 `ingot`/`output` 逐条配对、`total=5`；W-11 ✓ 静态锚；**判点 ✗ 0**；冲突 **A 0 / B 0 / C 4**；生命周期 `Done (0.524s)` → `Stopping the server` → `Saving worlds`，退出码 0，0 crash-report；日志 17 行 Exception/ERROR 全为环境噪声（Maven 目录／FML 签名／fernflower），无一来自本 mod。
- **执行方口径**：本批无新机制面，按「零行为面工装可主会话直裁」由主会话执行，**未经会话七**；残留判据缺口 = 「真实合成动作」（当前证明的是注册值与配方内容，不是消耗 6 锭产出盾）＋ 五件逐一受击臂。是否补开正式窗，待裁。
- **新钉值**：`build/libs/etimextra-0.1.0.jar` **30,259 B** @ 2026-10-28 21:32:34｜SHA-256 `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93`（前钉 20,680 B／`9FFE0D27…` 作废）。
- **遗留项**：客户端三面（五件图标可辨／名字／右键姿态）由用户肉眼判；会话七正式窗（合成臂 + 受击臂）；锈铁盾与金/铁盾**明确不做**。

## 条 17 · 盾面补种「真实合成消耗 6 锭」验证窗（W-13 / W-14，2026-10-28）

- **触发**：用户指令「补『真实合成消耗 6 锭』」——补条 16 自认的判据缺口（注册行只证明配方**内容**，证明不了**合成动作**可执行、6 锭真被吃掉）。
- **判据正本**：`playground/audit/extra-shield-补种批文.md` §3（本会话就地补 W-13／W-14 两行 + §4 验收线）；回执 `testharness/reports/extra-shield-craft-verdict.md`；驱动 `testharness/player/extra-shield-craft.js`。
- **W-13 六锭门（铜盾腿，数量敏感）**：只摆 5 格（缺右下）→ 结果槽 **null**；补第 6 锭 → 结果槽 `etimextra:copper_shield#0×1`。⇒ 配方是**恰好 6 锭**的固定形状，不是「≥5」。
- **W-14 真实合成（五腿全 PASS）**：生存模式下每腿 `/clear` + `/give 6` → 工作台逐格摆 6 锭 → 左键结果槽 arm → 主 mod 计时器走完 → 库存读回 **锭 6→0、盾 0→1**：

| 金属 | 结果槽 `sig` | 完成行 |
|---|---|---|
| 铜 | `etimextra:copper_shield#0×1` | `COMPLETE Copper Shield ×1 quality=AVERAGE xp=0` |
| 银 | `etimextra:silver_shield#0×1` | `COMPLETE Silver Shield ×1 quality=AVERAGE xp=0` |
| 远古金属 | `etimextra:ancient_metal_shield#0×1` | `COMPLETE Ancient Metal Shield ×1 quality=AVERAGE xp=0` |
| 秘银 | `etimextra:mithril_shield#0×1` | `COMPLETE Mithril Shield ×1 quality=AVERAGE xp=0` |
| 艾德曼 | `etimextra:adamantium_shield#0×1` | `COMPLETE Adamantium Shield ×1 quality=AVERAGE xp=0` |

- **走的是主 mod 真实路径**（不是补丁式验证）：`result click btn=0` → `start crafting difficulty=150.0 quality=AVERAGE period=102` → `COMPLETE … continue`。`difficulty=150.0` = 6 × 通用材料 25（`CraftingDifficulty` 对 etim 锭无专行）；`period=102` 由主 mod 计时器算出，窗内等满 102 tick + 4 s 余量。`quality=AVERAGE xp=0` 同时复核裁 T-4（盾非品质载体）。
- **口径登记**：必须生存模式——`ETIMConfig.craftingSkipCreative=true`（默认），创造会跳过计时器，只能验证「格子能出产物」，验证不了「真实合成」。
- **冲突分级**：**A 0 / B 0 / C 3** —— C-1 逐格摆料途中结果槽会短暂出现 `etim:nugget_*#0×9`（1 锭→9 粒的分裂配方），是逐格点击的副产物，5 格时结果为空、6 格才出盾，不干扰判点；C-2 mineflayer 对 mod 物品名解析为 `unknown`，库存断言按数值 type id + 服务端 `sig`/`COMPLETE` 双证；C-3 本窗由主会话执行（驱动属本项目工装），非会话七。
- **钉值不变**：jar **30,259 B**／SHA-256 `A223DB6D…44B9A93`／mtime 21:32:34——**0 rebuild**，与条 16 同一构建（`7f6c472`）。生命周期 `Done (0.537s)` → 五腿 → `Saving worlds`，退出码 0，0 crash-report；`B:craftingDebugLog` 窗内 true、收口还原 false。
- **判点 ✗ 0**；**本批判据缺口闭合**。遗留：会话七独立复跑（可选）、W-12 客户端三面待用户肉眼判。

## 条 18 · 客户端三面用户裁定 + 会话七独立复跑派单（2026-10-28）

- **用户裁定（原文口径）**：「客户端三面均正常」——五件盾的物品图标、显示名、右键举盾姿态全部通过。⇒ **W-12 ✓（用户面，非日志判据）**，盾面补种的客户端面**闭**；本批五件盾的客户端观感项全部收口。
- **用户指令**：会话七**独立复跑** W-13／W-14（真实合成消耗 6 锭）。
- **派单物**：`playground/audit/extra-shield-复跑-任务书.md`（转达时以围栏单块交付，块内自足）。要点：项目根 `D:\OpenCodeWorkspace\ETIM-Extra`；tag 固定 `16-shield-craft-rerun`（不得复用 `15-*`）；判据正本 = 补种批文 §3／§4（不改判据、不改码、不改工装）；产品码 commit `7f6c472`、jar **30,259 B**／SHA-256 `A223DB6D…44B9A93`、mtime 2026-10-28 21:32:34，**0 rebuild**；必须生存模式（`craftingSkipCreative=true` 会跳过计时器）；收口还原 `craftingDebugLog=false`。
- **本会话动作**：只出任务书与状态登记，**零落码、未开窗**；等会话七回执后由本会话比对基线 `testharness/reports/extra-shield-craft-verdict.md` 并落账。

## 条 19 · 处理单裁定（D-1…D-4：首次批验证回执收口口径）（2026-10-28）

- **处理单**：主会话收「盾面首批 · 验证回执收口」处理单，判定源 = `testharness/reports/extra-shield-verdict.md`（27,249 B／330 行；W-1…W-8 判点 ✗ 0，A 0／B 0／C 6）。本单只裁三点补充引出的 4 个待裁项，**不复议任何判点**。
- **钉值口径纠正（重要）**：处理单所载 `jar 14,170 B／SHA 470809B0…／HEAD 54eed94` 是**首批落码轮**的钉值，已被条 15（20,680 B／`9FFE0D27…`，3D 盾面批）与条 16（30,259 B／`A223DB6D…`，五金属补种）依次取代。**当前有效钉值** = jar **30,259 B** @ 2026-10-28 21:32:34｜SHA-256 `A223DB6D…44B9A93`｜产品码 commit `7f6c472`。本单四项裁定**零落码、零 rebuild**，钉值不变，不进新窗。
- **D-1 = ①（采纳）**：W-7 由「用户面」升为「**日志面 + 可选 GUI 转述**」——`[ExtraLog] enchantability=` + `[EnchantLog] table power=15 slot0/1/2` 三档非 0，对照 `minecraft:stick` 全 0（排除「命令恒非 0」的假正）。已就地改 `extra-shield-落码批文.md` 的 §4 W-7 行、§4 三分口径 ①、§5 验收线 1；与条 14 裁定 4（W-7 改判日志面）同值，本次只是把批文正文补齐，无新判值。
- **D-2 = ①（只记工装纪律）**：静默 `NO_TARGET` 是主 mod `EntitySelector.java:135` 的权限门 + `TestDriver.java:165` 不带 `detail=` 的既有行为，属**主 mod 产品面**，本附属不越界改；本窗已用 deop→op 对照取证，判点不受影响。纪律已固化（假人必须 op）。若将来升 B 级：派修对象是主 mod 会话，且需新窗重钉值。
- **D-3 = ①（只记纪律）**：R196 `capAtLevel0=6`（`PlayerStatLimits.java:29`）是产品正确行为；让 `/etest hurt` 自动夹血属工装语法改动、无产品收益。纪律已固化（每臂 `etest health 6`）。下一批做「连续格挡 N 击」耐久曲线时按此执行。
- **D-4 = ②（本批不另开用户面窗）＋状态已前进**：客户端三面已于 2026-10-28 由用户裁定**均正常**（条 18，W-12 ✓）；且自条 15 起客户端面已是 3D 盾（per-item TEISR + `builtin/entity` + 64×64 entity 图集），处理单所述「`item/handheld` + 16×16 占位」静态描述**已被取代**。故 D-4 不登记为「待后续批」而是**已闭**；「实际出什么附魔／附魔名」仍保留为可选转述项。
- **README 草案**：**保留**——已并入五条工装纪律（含合成臂必须生存、period 口径），随 `98447f3` 提交，tracked dirty 归零。
- **零落码 / 零 rebuild**：本单只改文档（批文 §4／§5／§2 指针 + 本条）；W-1…W-8 结论与当前钉值均不变。

## 条 20 · 会话七独立复跑核讫（W-13／W-14）+ C-3 配置编码纪律（2026-10-28）

- **回执**：`testharness/reports/extra-shield-craft-rerun-verdict.md`（实测 **10,114 B／116 行**／无 BOM／CR 0／U+FFFD 0，与回执自述逐位相符）。窗口 21:46:11–21:47:57，tag `16-shield-craft-rerun`，执行方会话七。
- **本会话独立复核（不采信转述）**：直接 grep 窗口产物 `testharness/build-logs/16-shield-craft-rerun.out`——`COMPLETE` **5 行**且五条 `sig` 各自为本金属盾（铜／银／远古／秘银／艾德曼）；本 mod `ERROR|Exception` **0 条**；`run/config/etim.cfg` 回读 **30,629 B／SHA `44E368E5…AE9F2E`／mtime 21:42:28**（无 BOM，首字节 `0x23`），与窗前字节副本逐位同值；`run/config/etimextra.cfg` 的 `extraDebugLog=false`、无 BOM；端口 25565 = 0；git 仅 `??` 本回执。
- **钉值**：jar **30,259 B／`A223DB6D…44B9A93`／21:32:34**，起收逐位同值，`> Task :jar UP-TO-DATE` ⇒ **0 rebuild**；产品码 commit 仍 `7f6c472`（HEAD 由 `0cde63f` → `207aa42` 为窗内文档提交，产品码 0 改动）。
- **逐项对照基线 `15-shield-craft`（主会话）**：W-13 五格 `null`／六格 `4262`、W-14 五腿 `−6/+1`、五条 `sig`、`difficulty=150.0 period=102`、`COMPLETE … quality=AVERAGE xp=0`、生命周期、0 rebuild —— **全部同值**；差异只有执行方（复跑目的）与配置写入路径（C-3）。⇒ **复跑通过**，W-13／W-14 由第二执行方独立确认。
- **冲突**：**A 0 / B 0 / C 3**（C-1 中间态粒配方、C-2 mineflayer 名 unknown、C-3 配置写入编码）——三条均照登，A／B 空。
- **C-3 处置（新纪律入账）**：窗内用 PowerShell 默认编码读写 `etim.cfg`，给文件加了 BOM 并把注释里的非 ASCII 箭头写成替换字符（30,629→30,672 B）；因键值全 ASCII，窗内解析不受影响，收口用**窗前字节副本整体还原**。新增第 6 条工装纪律：**改配置只用 UTF-8 无 BOM 写入（`[IO.File]::WriteAllText` + `UTF8Encoding($false)`），或直接字节副本还原**——已入 `testharness/README.md`。
- **本批状态**：五金属盾 = 服务端数值面 + 真实合成面 + 客户端面（用户裁定）**全闭**；唯一可选残留 = 「实际出什么附魔／附魔名」的转述。
- **零落码 / 零 rebuild**：本条只落文档；钉值与 W-13／W-14 结论不变。

## 条 21 · 三件新盾逐一受击窗核讫（W-15，2026-10-28）

- **触发**：用户指令「验证第一大项的两个小项」——第一项 = 三件新盾（铜／银／远古金属）的逐一受击臂；此前格挡链只在秘银／艾德曼上跑过。
- **判据正本**：`playground/audit/extra-shield-补种批文.md` §3 W-15（本会话就地新增行）＋ §4 验收线 2；回执 `testharness/reports/extra-shield-family-hit-verdict.md`；驱动 `testharness/player/extra-shield-family-hit.js`。
- **窗内判行（三件逐件六项齐，全 PASS）**：`carrier item=<盾> class=…ETIMExtraItemShield`；`gate … active=<盾> src=mob suppressed=true`；`block … raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=<盾>`；地板臂 `raw=1.000 → blocked=1.000`；`wear … rate=1.000 decay=na wear=4 dur=0->4`、续臂 `wear=1 dur=4->5`；`probe … dur=0/<max>` → `dur=5/<max>`，分母 **1600／1600／6400** 与各件配置值一致。
- **口径登记**：`carrier … block=false` 是 `ETIMBlocking.isBlockCarrier`（主 mod **工具**格挡臂）字段；盾走 `isShieldStack` 臂，故 false 为预期值，真正的门证是 `gate … suppressed=true` + `block … carrier=<盾>`。
- **冲突**：**A 0 / B 0 / C 2** —— C-1 首跑驱动自身正则写错（拿 `dur=0/<max>` 去匹配已捕获的 `0/<max>`），三腿误报 FAIL；产品行本身正确，修正后复跑 PASS，首跑产物留档 `17-shield-family-hit-attempt1.*`；C-2 即上条 `block=false` 读法。
- **配置**：`blockDebugLog` 窗内 true、收口按窗前字节副本整体还原——回读 **30,629 B／SHA `44E368E5…AE9F2E`**，逐字节同值（工装纪律 6 首次实战落地）。
- **钉值不变**：jar **30,259 B／`A223DB6D…44B9A93`／21:32:34**，**0 rebuild**；退出码 0，0 crash-report，端口 0。
- **本批状态**：五件盾的**逐一受击链**至此全部验过（首批秘银／艾德曼 + 本条三件）；剩余只有客户端面的「实际出什么附魔名」用户观察（同批第二小项，另起客户端窗）。

## 条 22 · 客户端附魔名观察（第二小项）+ 两个小项闭环（2026-10-28）

- **用户观察（原文口径）**：① 秘银盾三个选项**全是耐久 III**；② 铜盾**两个耐久 I、一个耐久 II**；③ **没有**经验修补／消失诅咒，四种盾牌全是耐久。
- **判读**：与机制逐条相符——附魔台对该类物品只出 Unbreaking（Mending 是宝藏附魔，只能附魔书 + 铁砧；B-1 已知后果、裁 T-4 不补白名单）；观察时 `/xp 100L` 把三档 power 抬得很高，秘银（附魔度 100）三档全部越过 Unbreaking III 门槛 ⇒ 三档都顶到 III；铜（30）⇒ I／I／II，随附魔度下降而降低。这正是「附魔度既是硬门也是强度」的可见后果，非缺陷。
- **结论**：第二小项（实际出什么附魔名）**已观察、无需改码**；第一小项（三件新盾逐一受击，条 21）**已验**。用户指令「验证第一大项的两个小项」**两项闭环**。
- **零落码 / 零 rebuild**：钉值不变——jar **30,259 B／`A223DB6D…44B9A93`／21:32:34**、产品码 `7f6c472`。

## 条 23 · 主 mod 侧三项收口回执核讫 · 交接闭单（2026-10-28）

- **回执**：用户转述「主 mod 收口三项均已落，账本条 114 + README 一行索引以 commit `7a26c6f` 定格」。本会话**逐项直核，不采信转述**。
- **① 主账本挂条**：`D:\OpenCodeWorkspace\Easy Times In Minecraft\playground\audit\audit20-裁定回执.md` 第 **2468 行**确为 `| 114 | 跨项目/组织 | ETIM-Extra 五金属盾批次闭单登记 |`，内容含三批闭单（W-1…W-8 ／ 3D 面 ／ W-9…W-15 + 会话七复跑）、零派修、双账规则未触发；钉值 **30,259 B｜`A223DB6D…44B9A93`｜21:32:34｜`7f6c472`｜0 rebuild** 与本账本**逐位相同**。该文件在 workspace 层（`D:\OpenCodeWorkspace\Easy Times In Minecraft\playground\`），**不在任何 git 仓库内**（`git -C "D:\…\Easy Times In Minecraft" rev-parse` = not a git repository），故本条为文件事实，无 commit 可指。
- **② 工装归属**：主 mod 仓库 HEAD = **`7a26c6f`**（`docs: testharness batch assets … + one-line index to ETIM-Extra shield verdicts`，**57 件**：`testharness/README.md` + ad7e/ad10s/uw2 系 runner + pose + 两份 stop 脚本）；`testharness/README.md` §7「跨项目附属索引（2026-10-28，ETIM-Extra 五金属盾批交接）」已落一行索引，指向五份 `extra-shield-*-verdict.md` 与本账本**条 1–22**，并明示「本侧不重复落索引」；主仓库 **tracked dirty = 0**。
- **③ 依赖运营口径**：条 114 记入三条互操作约定——改 `ETIMBlocking` 减半／地板／磨损**前须通知 ETIM-Extra**；改 `ETIMMetals` 的 `durabilityFactor`／`enchantability`**即改附属数值、须同步重钉**；主 mod 每次重建／改版本须跑 `gradlew publishToMavenLocal`（真任务 `publishEtimLocalPublicationToMavenLocal`，主账本条 112／commit `857fe31` 在案，含 reobf 762,605 B ／ dev 746,954 B ／ sources 683,689 B）。本附属**接受该口径为双向运营约定**。
- **D-2 口径互认**：条 114 亦记「附属判据 `etest hurt` 非 op 静默 NO_TARGET（`EntitySelector.java:135` 权限门 + `TestDriver.java:165`）裁定 **D-2 = ①** 只记工装纪律、不升 B 级」，与本账本条 17 一致，**两侧同口径、零派修**。
- **索引范围说明**：README §7 写「条 1–22」是指**盾批闭单范围**；本条 23 为盾批之后的跨项目收口登记，不改变该范围，**不请求主 mod 再改 README**。
- **交接闭单**：`playground/audit/extra-主会话-交接提示词.md`（commit `46c0a7c`）三项请求 **全部有落点**，本会话**无待回事项**。
- **零落码 / 零 rebuild**：jar **30,259 B／`A223DB6D…44B9A93`／21:32:34**、产品码 `7f6c472`，起收同值；本条只落文档。

## 条 24 · 「其余金属材料盾」批次口径澄清（金属覆盖报告出具，2026-10-28）

- **触发**：用户转述主会话在等附属「其余金属材料盾」批次推进结果。**核查结论：不存在该待推进批次**，也无未处理材料。
- **一手依据（本会话直读主 mod 源码，非推测）**：`metal/ETIMMetals.java:37-42` 共 **6 行**枚举；`ETIMItems.java:46-50` 只注册 **5 个锭**（copper／silver／mithril／adamantium／ancient_metal）；`ETIMGear.java:195-205` 明注 `RUSTED_IRON` **no ingot / no ingot-based recipes**，只有锁链甲四件（`ETIMMetalLoot` 战利品行）。⇒ 有锭材料 **5／5 已各出一盾并闭单**；无锭材料 1 行不出盾（与主 mod 锈铁装备同口径）；金／铁保留原版。
- **出具**：`playground/audit/extra-shield-金属覆盖-进度报告.md`（覆盖矩阵 + 五盾数值面 + 证据链 + 七条边界 + 钉值）。
- **唯一待回条件**：若主会话所指「其余金属」是 `ETIMMetals` 六行**之外**的材料（其他 mod 金属／新计划金属），须给出材料清单与判值来源，附属按新批立项；否则**无动作**，不重复立同名批次。
- **零落码 / 零 rebuild**：钉值不变——jar **30,259 B／`A223DB6D…44B9A93`／21:32:34**、产品码 `7f6c472`。

## 条 25 · 会话八 README 双文交付核讫 + 4 处订正（2026-10-28）

- **回执**：会话八交出 `README.md` 11,300 B／154 行；本会话实测（订正前）**bytes=11,300／first=0x23／CR=0／U+FFFD=0／trailingWS=0**，与回执逐位相符。11 节齐、五件红名单齐、派生标注中英各一处 ✓。
- **订正 1（事实错误，责任在主会话）**：README 双处写 **Forge 14.23.5.2860**——旧 README 即错，**我的任务书照抄未核**。实测运行日志 `forge@14.23.5.2847`（`18-client-enchant.out`、`17-shield-family-hit.out`、`16-shield-craft-rerun.out` 一致）→ 双处改为 **14.23.5.2847**；任务书顶部加订正行，正文不改写。
- **订正 2（英文误译）**：锈铁行 `the same crop as the main mod's rusted gear, loot-chain armour only` → `the same treatment as the main mod's rusted gear, loot-only chain armour`（crop 是「口径」的误译）。
- **订正 3（自相矛盾）**：§4 原写「附魔度…不在本仓库复制数字」，但 §2 表已列 30/30/40/100/40 → 改为「表中数字是该列的展示值，代码不复制常量」（中英同步）。
- **订正 4（术语与可读性）**：英文段混入「会话七」→ `session 7`；§1 补 R196 双语释义「本项目对照的参考反编译版本」；§4 因子归属改为「取自主 mod 的 `ETIMMetals`（`:37-41`，对应 R196 材料行耐久列）」。
- **订正后字节**：**11,613 B／154 行／first 0x23／CR 0／U+FFFD 0／trailingWS 0**；`2860`、`crop`、`not copied` 三个旧串在 README 内均 **0 命中**。
- **待裁 2 项（未动）**：① `gradle.properties:25` 的 `mod_description` 仍为 “mithril and adamantium shields”，模组列表页同受影响——该文件 ASCII 安全，但改动会改 jar（`mcmod.info`）⇒ 必须重建 + 重钉，故等用户裁决；② `ETIMExtra.java:30` 中文 javadoc 仍写「承载秘银盾与艾德曼盾」——注释改动预计不改字节码，但需重建确认，一并等裁决。
- **零落码 / 零 rebuild**：jar **30,259 B／`A223DB6D…44B9A93`／21:32:34** 未动；本次只改 README、任务书订正行与本条账本。

## 条 26 · 两处旧文案改齐 + 重建重钉（用户裁定 A，2026-10-28）

- **裁定**：用户选「两处一次改齐并重建重钉」——① `gradle.properties` 的 `mod_description`（模组列表页可见）；② `ETIMExtra.java:30` 中文 javadoc（两件口径）。
- **改动**：`mod_description` → `ETIM-Extra -- add-on for Easy Times In Minecraft: five metal shields (copper, silver, ancient metal, mithril, adamantium).`（**纯 ASCII**，`gradle.properties` 非 ASCII 字节 = 0，UTF-8 无 BOM）；javadoc → 「承载铜盾、银盾、远古金属盾、秘银盾与艾德曼盾」。**无逻辑行变动**（注释与构建元数据）。
- **重建**：`gradlew build` 退出码 0（1s，`19-repin-build.log`）；新 jar **30,285 B**｜SHA-256 `7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`｜mtime **2026-10-28 22:28:28**｜产品码 commit **`c66c099`**。jar 内 `mcmod.info` 已回读，`description` 为新五金属文案。
- **冒烟**（`19-repin-server`，stdin `stop`）：`[ExtraLog] preInit` → `[ExtraLog] boot ok - side=SERVER etim=1.0.0 etimextra=0.1.0` → `Done (0.550s)` → `Stopping the server` → `Saving worlds` → `BUILD SUCCESSFUL in 35s`；**0 crash-report**、0 本 mod 异常（日志里 2 条 `crash` 命中是 fernflower 反编译 `CrashReport` 的噪声）。
- **重钉**：旧钉值 **30,259 B／`A223DB6D…44B9A93`／`7f6c472`／0 rebuild** 自本条起为**历史值**（仍对应此前全部功能窗证据）；新钉值即上。**功能面未重跑**（无逻辑改动，只做加载冒烟）——此为口径，不得把本次当作功能复验。
- **联动**：README §11 钉值表已同步（30,285 B／`7D3F04F1…D4EE4D`／`c66c099`／「重建 1，仅元数据与注释」）；主 mod 账本条 114 内所记旧钉值同样转为历史值。
- **过程注记**：核验 jar 内 `mcmod.info` 时 `jar xf` 的误用曾在仓库根生成一个 `mcmod.info`，已删除并确认 `git status` 干净后再提交。
- **工作区**：产品改动提交 `c66c099`、文档与本条随后提交；0 rebuild 的说法不再适用于本条（本条即 1 次重建）。

## 条 27 · 主 mod「盾面削弱批」开批知会：受联批、零行动（2026-10-29）

- **来源**：主 mod 主会话 2026-10-29 转发「盾面削弱批 · 开批知会（未落码）」，用户中转。性质 = **知会**，明确「本轮无需行动」。
- **知会要点（照录）**：① 主 mod 侧 = 契约面——新增 `ETIMShield` 接口（签名携带 `DamageSource`）、`DamageSource` 攻击侧增益幽魂位 `isSpectral`（默认 false）、`ETIMBlocking` 分发口三支（接口实现 / vanilla `ItemShield` 木盾常量 0.5 / 其余现行路径一字不动）；② 附属侧 = 数值面——五盾 implements `ETIMShield`，曲线值 40/55/65/75/80、幽魂 65（=40+25）、磨率 3.5/1.25/1.0，全部进附属 config；③ 职责缝沿用依赖口径（契约归主 mod、数值归附属、主 mod 树只读、我方落盘只进本仓库）。
- **本会话实测（不采信转述）**：主 mod 源码当前**无** `ETIMShield` / `isSpectral`（HEAD `7a26c6f`，tracked dirty 0）⇒ 确为**未落码**；主账本**条 115** 已登记我方 2026-10-28 的新钉值（30,285 B / `7D3F04F1…` / `c66c099`）与「旧钉值为历史值」口径，与通知所述一致。
- **本会话动作**：**零落码、零 rebuild、零行动**；只落回执 `playground/audit/extra-shield-削弱批-知会回执.md` 与本条。回执对职责缝**无异议**，提出 4 个落码前必须钉死的点：①曲线语义（40/55/65/75/80 的金属映射、是否减伤百分比、1.0 地板是否保留）；②幽魂映射（统一 65 还是各盾 +25，逐盾值须给）；③磨率映射（3.5/1.25/1.0 五件怎么分、替换还是叠加全局 `shieldWearRate`、公式是否仍 `(int)(blocked × rate)`）；④接口签名（方法体、`DamageSource` 传入方式、`isSpectral` 挂哪侧、`Item#isShield` 是否仍 true）。
- **依赖顺序（硬约束，已写进回执）**：接口落码后须在**同一次** `publishToMavenLocal` 发 dev jar 并告知 commit/钉值，否则我方编译期无 `ETIMShield`。
- **未来影响登记**：切换点 = 我方 items implements 接口那次（此前落「其余现行路径」÷2，不会被打断）；届时 W-15 旧证据（8→4、地板 1.0、磨损 = blocked）失效，需新窗 **W-16 起**；`README.md` §3／§5／§11 同步改；旧钉值 `30,285 B／7D3F04F1…／c66c099` 继续绑定旧证据。
- **钉值**：本机 jar **30,285 B／`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`** 未动。

## 条 28 · 削弱批四点钉死 + 条 27 耐久说法作废（仍未落码，2026-10-29）

- **来源**：主 mod 主会话「盾面削弱批 · 四点钉死回执（仍未落码）」，用户中转。**我方仍零落码、零 action**。
- **纠偏（条 27 §2 第 2 点作废）**：条 27 写「耐久与附魔度不动」——**耐久半句是错的**（当时照抄知会未核终裁）。按 user 2026-10-29 终裁：**远古金属 6,400→3,200｜秘银 25,600→6,400｜艾德曼 102,400→12,800**；铜／银 **1,600 不动**（原版木盾 **336** 不属我方）；附魔度 **30／30／40／100／40 不动**。**本账本 append-only，条 27 原文不回改**，以本条为准（主会话要求的「改记」以勘误条方式落实）。
- **终表（钉死）**：

| 盾 | 耐久 | 物理减伤 | 幽魂减伤 |
|---|---|---|---|
| 木盾（原版） | 336 | 50% | 50% |
| 铜盾 | 1,600 | **55%** | 55% |
| 银盾 | 1,600 | **40%** | **65%**（=40+25，仅银有差分） |
| 远古金属盾 | **3,200** | **65%** | 65% |
| 秘银盾 | **6,400** | **75%** | 75% |
| 艾德曼盾 | **12,800** | **80%** | 80% |

  任何盾幽魂面 ≤ 80%，无 85%+ 档；1.0 地板保留（R196/1.6.4 语义）。
- **磨率**：主 mod 全局 `shieldWearRate` 缺省 **1.0→2.5**（**替换**、非叠加）；五件倍数 木 1.0／铜 1.0／银 物理 1.4、幽魂 0.5／远古 1.0／秘银 1.0／艾德曼 1.0；最终磨损 `(int)(blocked × 2.5 × 倍数)`。**M-2a**：保留 `(int)` 截断；银盾幽魂 969 vs 名义 832 的 +17% 超闭合为取整台阶固有，用户裁定接受，W-16 判行以 **969** 为准。
- **接口签名（钉死）**：`ETIMShield` 两个 default——`default float getBlockReduction(DamageSource source) { return 0.5F; }`、`default float getWearMultiplier(DamageSource source) { return 1.0F; }`；`isSpectral` 挂 **DamageSource 侧**（本体增益位，镜像 R196 `hasSilverAspect:213-223` 读法），接口不承载；`Item#isShield` 语义不变（附魔台／铁砧／stat／配方全保留），`ETIMShield` 为正交面。
- **依赖顺序**：主 mod 同批 `publishToMavenLocal` 并发回 commit + jar 钉值；我方收到后才落码，不猜工件。
- **本条核验（不采信转述）**：主 mod 源码**仍无** `ETIMShield` / `isSpectral`（HEAD `7a26c6f`）；现行 `ETIMBlocking.onLivingHurt` 的 `blocked` 变量实为**净伤害**（`max(raw×blockDamageFactor, blockMinDamage)`，`ETIMBlocking.java:125-129`），磨损 `(int)(blocked × shieldWearRate)`（`:144`）——即新公式的 `blocked` 应读作「格挡后净伤害」。我方现行 config 默认仍为旧值（6400／25600／102400），**新耐久属下一批，未落码**，故 README 暂不改。
- **落码前待补齐/确认（6 条，已发回执）**：①【阻塞】幽魂读取的 public API（类名+方法签名）——银盾要在 `getBlockReduction(source)` 内分 40/65、`getWearMultiplier` 内分 1.4/0.5；②耐久新值的 provenance（终裁无公式 ／ 以铜 1,600 为基 ×2/×4/×8）；③`[BlockLog]` 是否加 `spectral=` 字段、`wear … rate=` 打总倍率还是拆字段；④config 键粒度（我方拟 `shield.<metal>.reduction`／`shield.silver.spectralReduction`／`shield.<metal>.wear`＋银盾两键）；⑤既有 `run/config/etimextra.cfg` 不随默认值改写——document-only 还是迁移；⑥公式顺序复核（`net=max(1.0, raw×(1−r))`、`wear=(int)(net×2.5×mult)`）。
- **钉值**：本机 jar **30,285 B／`7D3F04F1…D4EE4D`／`c66c099`** 未动，0 rebuild。

## 条 29 · 削弱批六项闭合 + 契约快照 + W-16 预登记（仍未落码，2026-10-29）

- **来源**：主 mod 主会话「落码前六项闭合回执」，用户中转。**我方仍零落码、零 action**；主 mod 源码实测仍无 `ETIMShield` / `ETIMGhost`（HEAD `7a26c6f`）。
- **六项闭合（照录为契约）**：
  1. **幽魂读取口（原阻塞项）**：新增 `io.github.etim.etim.combat.ETIMGhost`——`markSpectral(DamageSource)` / `isSpectral(DamageSource)`，内部 `Collections.synchronizedSet(Collections.newSetFromMap(new WeakHashMap<>()))`；与 `ETIMShield` 同 commit 进 mavenLocal。我方两个方法体只依赖 `isSpectral`。
  2. **耐久 provenance = (b)**：以铜 1,600 为基 **×2／×4／×8** → 远古 **3,200**／秘银 **6,400**／艾德曼 **12,800**；铜基准仍可写一手公式 `4.0×1×d×100`（d=4）；**旧 T-1 工具尺公式对高端三件废止**。config 注释与 README 按此写。
  3. **`[BlockLog]` 判据面**：`block` 行加 `spectral=true|false`；`wear` 行拆 `rate=2.5` 与 `mult=<盾倍数>` 两字段（不合并总倍率）。
  4. **config 粒度（接受我方方案）**：`shield.<metal>.reduction`（整数百分比，`/100` 后 clamp 0~1）+ `shield.<metal>.wear`；银盾四键终值 **reduction=40 / spectralReduction=65 / wear=1.4 / spectralWear=0.5**。我方原 `spectralbonus.enabled` 开关方案作废。
  5. **cfg 迁移 = document-only**：删 `run/config/etimextra.cfg` 重生成取新缺省，零迁移代码；README 加一行「cfg 勘误 = 删档重生」。
  6. **公式顺序 = 我方读法正确**：`net = max(1.0, raw × (1 − r))`；`wear = (int)(net × 2.5 × mult)`；`blocked` 变量即净伤害（`ETIMBlocking.java:125-129,144`）。
- **W-16 预登记（预测值，非证据；raw 取自现行 `etest hurt` 8 点臂与 1 点地板臂）**：

| 盾 | r | raw=8 → net / wear | raw=1 → net / wear |
|---|---|---|---|
| 铜 | 0.55 | 3.6 / **9** | 1.0 / **2** |
| 银（物理） | 0.40 | 4.8 / **16**（mult 1.4） | 1.0 / **3** |
| 银（幽魂） | 0.65 | 2.8 / **3**（mult 0.5） | 1.0 / **1** |
| 远古 | 0.65 | 2.8 / **7** | 1.0 / **2** |
| 秘银 | 0.75 | 2.0 / **5** | 1.0 / **2** |
| 艾德曼 | 0.80 | 1.6 / **4** | 1.0 / **2** |

  （`wear` 均为 `(int)(net × 2.5 × mult)` 截断；raw=1 时全部触发 1.0 地板。此表仅用于窗内对差，若主 mod 实现算出不同值，应**落码前**纠正，不带进窗内才发现。）
- **新增 1 项待补（不阻塞落码，阻塞 W-16 银盾幽魂腿）**：`ETIMGhost.markSpectral` 目前**没有调用方**（幽魂实体批未落），窗内无法自然产生 `spectral=true`。请在派修同批给出测试口——`etest hurtspec`（或 `etest hurt … spectral`）——或确认幽魂实体同批落地；否则 W-16 的银盾 65/0.5 腿只能标「未实测」。
- **设计风险注记（C 级）**：`markSpectral` 若收到**静态单例** `DamageSource`（如 `DamageSource.magic` 一类），WeakSet 条目会被静态字段永久持有 ⇒ 该源后续所有攻击都带幽魂。请确保调用点只传逐次 `new` 的实例（他们口径如此，登记待核）。
- **钉值**：本机 jar **30,285 B／`7D3F04F1…D4EE4D`／`c66c099`** 未动，0 rebuild。

## 条 30 · 削弱批验证面闭合：预登记锁死 + `etimghost` 测试口 + 类型门（仍未落码，2026-10-29）

- **来源**：主 mod 主会话「验证面闭合回执」，用户中转。**我方零落码、零 action**；主 mod 源码实测仍无 `ETIMShield` / `ETIMGhost` / `etimghost`（HEAD `7a26c6f`）。
- **预登记核讫**：主侧逐位确认我方 W-16 预测表**无一偏差**（铜 3.6/9、银物理 4.8/16、银幽魂 2.8/3、远古 2.8/7、秘银 2.0/5、艾德曼 1.6/4；单点腿 2/3/1/2/2/2，其中银物理 3 来自 `1×2.5×1.4=3.5` 截断、银幽魂 1 来自 `1.25` 截断）⇒ **预登记锁死，窗内纯对差**。
- **测试口钉死（裁定选 1，幽魂实体不在本批，M-4 仍挂账）**：`etimghost hurt <selector> <amount> <spectral:true|false>`——构造逐次 `new` 的 `EntityDamageSource("etimspectral", …)`，`true` 时调 `ETIMGhost.markSpectral(src)`，再 `player.attackEntityFrom(src, amount)`；`false` 腿走同一命令作**负鉴**（非幽实体攻击不打 +25%）。**不给 `etest hurt` 加参**（`etest` 判据面已闭单，不动闭单件）。
- **C 级风险闭合**：①调用点只传逐次 `new` 的 `EntityDamageSource`，静态单例全不进标记口；②`markSpectral` 加**类型门**，非 `EntityDamageSource` 一律拒绝并打 `[BlockLog] ghost-mark rejected src=<...>`；③WeakSet 生命周期与类型门对齐 ⇒ C 级降为**不可达**。
- **依赖序**：正式派修 + 接口 jar（`ETIMShield` + `ETIMGhost`）同批 `publishToMavenLocal`，回传 commit + 钉值；我方收到后先编译对照，再进 W-16。
- **我方 C 级观察（已发回执，不影响落码）**：
  1. `EntityDamageSource` 的**源实体**若传受害者本人（「假人 target」字面读法），`getTrueSource()` 会等于受害者 ⇒ 自伤语义，可能影响击退/仇恨类处理；建议改用场上的标记僵尸（或专用 marker 实体）作源实体。格挡数学不受影响，但 `[BlockLog] src=` 与真怪路径的可比性受影响。
  2. 自定义类型 `etimspectral` 在当前代码下**不被过滤**：`r196ArmorBypassed = isUnblockable() || isFireDamage()`、`isR196Absolute = isDamageAbsolute() || OUT_OF_WORLD`（`R196ArmorModel.java:349-361`）——只要测试源不设 bypass/absolute 位，`LivingHurtEvent` 会正常进盾链。
  3. W-16 判行将以 `src=etimspectral` 为键（不是 `src=mob`），并要求 `block … spectral=true|false` 与 `wear … rate=2.500 mult=…` 同屏互证。
- **钉值**：本机 jar **30,285 B／`7D3F04F1…D4EE4D`／`c66c099`** 未动，0 rebuild；阻塞计数 0，等待项 = 正式派修 + 接口 jar 钉值。

## 条 31 · 会话六提交登记核讫（1890f63 两件判据件）+ 6 项文档级缺陷登记（2026-10-29）

- **来源**：会话六「提交登记」转发（用户中转）：在 ETIM-Extra 仓提交两件审计件（`git add` 指定两路径，未 `-A`），请核三点并记条。
- **核点 1（提交事实，本会话实测）**：
  - HEAD **`1890f63fd1c0834f0169198cd6400be6c7d8af4f`**；parent **`dd023ae`**；时间 **2026-10-29 11:39:32 +0800**；message 与转发逐字一致。
  - `git show --name-status` **仅两路径**（M `盾面削弱批-立项摸底.md`、A `盾面削弱批-对照报告.md`），无第三路径；numstat `540+0` / `99+43` ⇒ **639 插入 / 43 删除**，与转发同数。
  - 文件实测：摸底 **67,835 B**｜SHA-256 `8F6AFF72…87EF62E2`｜639 行；对照报告 **37,902 B**｜SHA-256 `9ABA181A…8E3813E4`｜541 行；两件均 UTF-8 无 BOM（首字节 0x23）、LF（CR=0）、**0 U+FFFD**、0 行尾空白。
  - **但转发漏报一件**：`1890f63` 当时**只在本地**（`origin/master` = `dd023ae`）。按 commit 引用远端解析不到；本条落盘前已**快进推送**（零内容改动，`dd023ae..1890f63`），现远端可达。
  - **「变更内容仅 §九」不成立**：diff 共 **14 处 hunk**，除 §九（9.1-5／9.1-7／9.1-8、A-1/D-2/D-3 标已裁）外，还动 §一.3 键表、§二 接口 default/命名、§四 伪代码、§五、§七 N-5；其中含全局改名 `shieldWearRate → shieldBaseWearRate`（6 处）、接口 default 改为 0.5/1.0、删 `silverSpectralBonus` 行等。**判值面（21 格／曲线／耐久／磨率）未改**，故「不影响 W-16 预登记表与现行五盾行为」成立，但「仅 §九」须以本条为准。
- **核点 2（性质）**：两件均 `.md` 判据件；`src/`、`resources/`、`gradle/`、`README.md` **零改动**。本机 jar **30,285 B｜`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`｜mtime 2026-10-28 22:28:28**、产品码 `c66c099` 未动 ⇒ **无需 rebuild**，钉值不变。
- **核点 3（引用纪律）**：接受。引用对照报告一律 `commit 1890f63` + 上列 SHA-256，**不按工作树路径裸引**（工作树可变、commit 不可变）。
- **6 项文档级缺陷（B 级，登记不改判值；第 1／2 项影响我方落码口径）**：

| # | 缺陷 | 一手证据 | 处置建议 |
|---|---|---|---|
| **D31-1** | 主 mod 全局键名两写：摸底 6 处 `shieldBaseWearRate`、2 处 `shieldWearRateBase`；对照报告 9 处全为 `shieldWearRateBase` | 两件 grep 计数 | 钉 **`shieldWearRateBase`**（§9.1-5 与报告一致），摸底 §一.3／§二／§四 的 6 处旧写须下一版改齐；我方文档一律用 `shieldWearRateBase` |
| **D31-2** | 报告 §2.3 给附属新增 `shield.wearRate` = 2.5 | 与摸底 **B-10 裁定倾向 ①**（全局单键、附属只存乘子）相悖；与 条 29（银盾四键 + 逐盾 `.reduction`/`.wear`，无 wearRate）相悖；且**附属无消费方**（主 mod 自算 `shieldWearRateBase × mult`）⇒ 死键 | **不落**该键；若主会话坚持保留，须写明消费点与双份同步责任 |
| **D31-3** | 报告 §2.3 称「新增 **8** 键」，实际列 **9** 条（wearRate 1 + 曲线 5 + 银盾 spectralReduction 1 + 银盾 wear/spectralWear 2） | 逐行点数 | 删 D31-2 的死键后 **8 键自洽**（5 曲线 + 银盾 3），计数自然对齐 |
| **D31-4** | 银盾双表：§2.3 键为**绝对** 65，§2.1 字段为 `spectralBonus`(0.25) 相加 | §2.1 伪码 `reduction + (isSpectral ? spectralBonus : 0)` | 我方拟取**绝对**字段（`spectralReduction` 0.65，直接读 config），四构造值全绝对 ⇒ 玩家改 `silver.reduction` 时幽魂面不漂移；此点请主会话在派修单确认 |
| **D31-5** | `markSpectral` 契约两写：转发为 `void` + `Collections.synchronizedSet`；报告伪码为 `boolean` + 未同步 `Collections.newSetFromMap` | §1.2 代码块 | 我方只调 `isSpectral`，**编译面不受影响**；但契约面须钉一份（建议 `boolean` + synchronized，二者兼得） |
| **D31-6** | 悬空引用：报告 B 表仅 **B-1…B-9**（回执亦称 B 9），正文两处引 **B-10**；B-10 实在摸底 §4.2 | 两件 grep | 报告下一版补 B-10 行或改引「摸底 B-10」 |

- **W-16 判面更新（本条起有效，覆盖 条 28／29 的对应句；账本 append-only，不回改原文）**：
  - **公式**：`net = max(1.0, raw×(1−r))`；`wear = (int) Math.floor(net × 2.5 × mult + 1.0E-4)`；epsilon **只加盾两臂**，工具臂 `(int)(blocked×decay)` 一字不动。
  - **两格 FLIP**：铜 8 伤 `3.5999999×2.5 = 8.9999998`→**9**；艾德曼 8 伤 `1.5999999×2.5 = 3.9999998`→**4**（裸 `(int)` 得 8／3）。⇒ 条 29 预登记表的 **9／4 只在加 epsilon 时成立**；条 28「保留裸 `(int)`、银盾 969 为终态判行」**作废**（A-2 改 epsilon；A-3 判 L3 不判，969／2,327／5,818 降为预测值，禁标「不通过」）。
  - **`block` 行 `factor=` 改打 `retained`（=1−r）非 r**：铜 0.450｜银物 0.600｜银幽 0.350｜远古 0.350｜秘银 0.250｜艾德曼 0.200｜木 0.500。
  - **`wear` 行 `rate=` 打有效总率（=2.5×mult），非恒 2.5**：铜 2.500｜银物 3.500｜银幽 1.250｜远古 2.500｜秘银 2.500｜艾德曼 2.500；`mult=` 1.000／1.400／0.500／1.000／1.000／1.000。条 29「`rate=2.5 mult=0.5`」的读法**作废**（按 `rate=1.250 mult=0.500` 判）。
  - **工具行形态位移（登记备查）**：`rate=na mult=na decay=<真实率>`；旧 W6／W7／W12／W14 若按 `rate=` 读数须改读 `decay=`（值未变）。
  - **测试口前置条件（W-16 起窗必查）**：`etimghost` 注册在 `devTools` 门后（`ETIMConfig.devTools`），窗内须为 **true**；`src=` 判键为 `etimspectral`，不接受 `src=mob`。
- **依赖序不变**：正式派修 + `ETIMShield`／`ETIMGhost` 同批 `publishToMavenLocal` + 回传 commit／钉值 → 我方编译对照 → 落码 → W-16。
- **钉值**：本机 jar **30,285 B／`7D3F04F1…D4EE4D`／`c66c099`** 未动，0 rebuild；工作区在本条前干净。

## 条 32 · 会话六第 2 轮修讫：授权提交 `3fd0d1b` + 6 项复核 + 3 项残留（2026-10-29）

- **来源**：会话六「6 项文档级缺陷修讫 + 两条落码口径答复（未 commit，等授权）」，用户中转。其请求：只 add 两件、不 `-A`、不动主 mod 树，按给定 message 提交。
- **授权与提交（本会话执行）**：`git add -- <两件>`（**逐路径**，未 `-A`）→ commit **`3fd0d1b`**（parent `f53e04d`，message 与请求逐字一致）→ 推送 `f53e04d..3fd0d1b`；`git show --name-status` **仅两路径**；提交时**无其它暂存/未暂存改动**；主 mod 树未触。
- **两件复核（不采信转述，逐项实测）**：
  - 摸底 **69,064 B**／**638 行**／SHA-256 `159AA07EB29DF9C010FE1A31F72C345FE1264E37E4226C4BC67F5145B1000566`；相对 `1890f63` **+28／−29**。
  - 报告 **40,571 B**／**559 行**／SHA-256 `9512CA850E2B5A93EB69B0FA1D1BE89D01A317575E1CC7AC670CC4AA2D263F0B`；相对 `1890f63` **+36／−18**。
  - 两件 UTF-8 无 BOM（首字节 0x23）、LF（CR=0）、**0 U+FFFD**、**0 行尾空白**。字节数／行数／SHA／增删行**与其自报逐位相同**。
- **6 项处置逐条核讫**：
  1. 摸底 `shieldBaseWearRate` **0 残留**、`shieldWearRateBase` **8 处**；报告 `shieldBaseWearRate` 仅 1 处且位于「缺陷自查表」描述句，**非活键**。
  2. `shield.wearRate` **活键已删**；报告 3 处提及均为删除说明／B-10 行「不再设」，且新增「附属不设基准磨率键」一句。
  3. 「8 键」自洽：曲线 5 + `silver.spectralReduction` 1 + 银盾乘子 2；右侧另列 3 个耐久改值（不计入 8 键）。
  4. §2.1 已改**绝对** `spectralReduction`，`getBlockReduction` = `isSpectral ? spectralReduction : reduction`；D-7 登记于 §9-9 与档尾回执（落法级、已定）。
  5. §1.2 已钉 `boolean markSpectral` + `Collections.synchronizedSet`；语义写死 true = 现已上标（幂等恒 true）、false = 仅类型门；实现 `SPECTRAL.add(src); return true;`（不用 `Set.add` 返回值）。
  6. §7.2 补 **B-10** 行；B 级计数 **9 → 10** 三处同步（§7.2 标题、§9-8、档尾回执）。
- **自查追加 2 项核讫**：⑦ epsilon 口径统一为「落码式 2 格（铜 8 伤 9.0／艾德曼 8 伤 4.0），全 float 乘 1 格，`+1e-4` 两种算序均 21/21」，摸底 §2.7／§3.1／§4.2 A-2／§九 9.2·9.4／档尾已同步；⑧ 摸底 `ETIMSpectral.isSpectral` **0 残留**，`ETIMGhost.isSpectral` 4 处。
- **我方复算 W-16 判面（7 行 × 2 列，与会话六复核一致）**：铜 0.450／2.500／1.000 → 9,2｜银物 0.600／3.500／1.400 → 16,3｜银幽 0.350／1.250／0.500 → 3,1｜远古 → 7,2｜秘银 → 5,2｜艾德曼 → 4,2｜木 → 10,2。`devTools` 缺省 **true**（`ETIMConfig.java:442`）⇒ 起窗前无需改 cfg（除非本地 cfg 覆盖过）。
- **3 项残留（C 级，不阻塞落码；我方落地按 条 31／本条判面，不按残留形态）**：
  1. 报告 §2.1 伪码**缺** `private final float wearMultiplier;` 字段声明（文字列了四参，代码块只声明 3 个字段，`getWearMultiplier` 内 `this.wearMultiplier` 悬空）——我方实现会声明，不影响行为。
  2. 摸底 §3 判行表仍是**旧形态**（`block … curve=<r> mult=<m>`、`src=mob`；`curve=` 5 处、`src=mob` 2 处），与 §1.4 定稿（`factor=retained`、无 `curve`、`min=`；`wear` 有 `rate`/`mult`/`decay`）不一致——W-16 判行以报告 §1.4／本条为准。
  3. 报告 1 处 `shieldBaseWearRate` 为自查表内**描述性引用**，不作活键读。
- **钉值**：jar **30,285 B／`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`／mtime 2026-10-28 22:28:28**／产品码 `c66c099` **未动**，0 rebuild（两件均 `.md`）。

## 条 33 · 会话六第 3 轮残修：授权提交 `4dff3b9` + 三种行形定稿 + probe 编译点核讫（2026-10-29）

- **来源**：会话六「第 3 轮残修（3 项残留：2 修 1 不改）+ 自查再补 1 处编译点」，用户中转；请求按给定命令只 add 两件提交。
- **授权与提交（本会话执行）**：逐路径 `git add --`（未 `-A`）→ commit **`4dff3b9`**（parent `6d8184d`，message 与请求逐字一致，含中文破折号与括号）→ 推送 `6d8184d..4dff3b9`；`git show --name-status` **仅两路径**；提交瞬间无其它改动；主 mod 树未触。
- **两件机械核（与其自报逐位相同）**：摸底 **69,593 B**／**637 行**／SHA-256 `DEBA7FAB5210CF79EDCBF81E916C6675EE0DD3F5E58F827C1CBCD010408BB43A`／**+9−10**；报告 **41,200 B**／**562 行**／SHA-256 `FCE21D713C4508B2C6DDA7A4781E4DDEFCCAC7EC8B698A87E77623EFFBC9F878`／**+4−1**；两件 UTF-8 无 BOM、LF、0 U+FFFD、0 行尾空白。
- **3 项残留处置核讫**：
  1. `private final float wearMultiplier;` **已补**（报告 §2.1 第 4 行，注释 1.0（木/铜/远古/秘银/艾德曼）／1.4（银·物理））⇒ P1 照抄即编译失败的点已消除。
  2. 摸底 §3 判行表**已对齐**：W-16 行 `factor=0.450 spectral=false min=1.000`（去 `curve=`、`src=<src>` 占位）；W-18 加 `mult=1.000`；W-19 改 `etimghost hurt … spectral:false/true` 两腿（`rate=3.500 mult=1.400` / `rate=1.250 mult=0.500`，`wear 16／3`）；W-21 判「盾行 `decay=na` / 工具行 `decay=` 有数字」；W-22 按 `shield.copper.reduction`→60 演示（`blocked=3.200 factor=0.400`）。现存 `curve=` **2 处**均为散文（「不得追加 `curve=`」「不写 `curve=`」），`src=mob` **1 处**为负例说明。
  3. 报告 1 处 `shieldBaseWearRate` **保留**（§10 修订记录内描述「摸底曾有 6 处旧名」）——采纳其理由：删了会失真；已确认全文无活键。
- **自查新增编译点核讫（P1，主 mod 侧）**：`ETIMBlockLog.probeConfig`（`:141-145`）第 6 改点读 `ETIMConfig.shieldWearRate`，A-1 改名后**该字段不存在 ⇒ 不改必编译失败**；报告 §1.4 原只列 block／wear 两行，确为洞。现已：§1.4 标题「改两行」→「**改三行**」、新增 `probe`（config 臂）行 `shieldRateBase=f3(ETIMConfig.shieldWearRateBase)` + 追加 `woodReduction=f3(ETIMConfig.shieldWoodReduction)`、§10 修订记录第 8 行留痕。与本会话 条 31 引的 N-7「6 处全改」口径一致（probe 即第 6 处）。
- **行形定稿（四种，落码与 W-16 判行照此，旧表作废）**：
  - `block`：`block player=<n>#<id> src=<type> raw=8.000 blocked=3.600 factor=0.450 spectral=false min=1.000 carrier=etimextra:copper_shield`
  - `wear` 盾行：`wear player=<n>#<id> item=… rate=2.500 mult=1.000 decay=na raw=8.000 blocked=3.600 wear=9 dur=0->9`
  - `wear` 工具行：`wear … rate=na mult=na decay=50 raw=… blocked=… wear=… dur=…`
  - `probe` config 臂：`probe player=<n> cfg blockModel=… factor=0.500 min=1.000 shieldRateBase=2.500 woodReduction=0.500`
  - 要点：`factor` = 保留系数（1−r）；`rate` = 有效总率（2.5×mult）；盾行 `decay=na`、工具行 `rate=na mult=na`；**全文无 `curve=`**。
- **钉值**：jar **30,285 B／`7D3F04F1…D4EE4D`／mtime 2026-10-28 22:28:28**／`c66c099` **未动**，0 rebuild。阻塞 0；等待项 = 正式派修 + `ETIMShield`／`ETIMGhost` 同批 mavenLocal + 接口 jar 钉值。

## 条 34 · 会话六第 4 轮（终审 B/C 勘误）：授权提交 `bd40197` + 会话五终审「放行」核讫 + 1 项 C 级残留（2026-10-29）

- **来源**：会话六「`4dff3b9` 核讫 + 发现会话五终审已出（放行）+ 第 4 轮勘误已做（未 commit）」，用户中转；请求按给定命令只 add 两件提交。
- **终审回执（会话五产出，untracked）**：`盾面削弱批-终审回执.md` **18,976 B／93 行**／SHA-256 `C2654D552F8A251DD61808526C8A224A8BCFFA22DED3D3782D5E6A45355CA79D`；判 **T-1…T-5 ✓、T-6 ✗ → B-审3**；**A 0／B 4／C 4**；结论「**放行**，不阻塞派修」。本会话只读，未改、未 add、未 commit；该件仍为 `??`，归会话五／主会话收口。
- **授权与提交（本会话执行）**：逐路径 `git add --`（未 `-A`）→ commit **`bd40197`**（parent `be24d6c`，message 与请求逐字一致）→ 推送 `be24d6c..bd40197`；`git show --stat` **2 路径、42+/12−**（= 报告 41+/11− + 摸底 1+/1−）；提交瞬间唯一其它改动是 `?? 终审回执`，**未入提交**；主 mod 树未触。
- **两件机械核（与其自报逐位相同）**：摸底 **69,721 B**／**637 行**／SHA-256 `12213F2A7555FCD4FC48E05CBB6F711FCBB0D857A4AC45FBF3E83AF5B7641059`／**+1−1**；报告 **46,089 B**／**592 行**／SHA-256 `D13854EF4984FADCCC87A84770A3E39DBBFFAB0AA7691CEC68A260FF7D514F99`／**+41−11**；两件 UTF-8 无 BOM、LF、0 U+FFFD、0 行尾空白。
- **`report-check.js` 五根复跑（R196／ETIM 1.12／forge／主 mod／附属）**：报告 **anchors 49 missing 0、tables 22 bad 0**；摸底 **anchors 78 missing 0、tables 28 bad 0**；两件均 `OK`。
- **B-审2 独立复测（不采信转述）**：主 mod `src\main\java` 内 `shieldWearRate` 命中 **9**——**码面 5**：`ETIMConfig.java:369`/`:869`、`combat\ETIMBlocking.java:144`/`:153`、`combat\ETIMBlockLog.java:145`；**注释面 4**：`ETIMBlocking.java:48`/`:134`、`ETIMBlockLog.java:39`/`:113`。与终审、报告新 N-7 逐条一致（原「6 处」确漏 3 注释）。
- **B/C 落点核讫**：
  - **B-审1**：§1.3 伪码注释与硬约束句①已改为「防支②谓词被写成 `isShieldStack` 虚分派（五盾覆写 `isShield=true` 即被吞）＋未来 `ItemShield × ETIMShield` hybrid」；次序不变。实测五盾 `extends Item`（`ETIMExtraItemShield.java:47`），原「被木盾常量吃掉」论据作废属实。
  - **B-审3／T-6**：批头新增 provenance 声明段；新增 **§7.4** 四行（曲线／幽魂差分／磨率体系／耐久三值）＋判点纪律句。
  - **B-审4**：§2.3 新增「同批必改的附属 javadoc」四段；锚点实测命中（`:38-45` 派生耐久整段、`:60-61` `@param durability`、`ETIMExtra.java:22`/`:34` 旧磨率句）。
  - **C-审1**：「五盾 ×1.4/0.5」→「银盾 ×1.4/0.5，其余四盾 ×1.0」；**C-审2** 字段注释删「木」并注明木盾是 vanilla `ItemShield`；**C-审3** 补 `wearShieldOrTool(player, active, raw, blocked, shield, source)` 签名行；**C-审4** 支③加异 mod 盾边界注释（本环境零实例）。
  - **终审前置①**：§2.3 补 `/100.0F` + clamp 0~1 换算段，含「`percent / 100.0F` 与字面常量逐位相同 6/6」。
  - **脚注**：档尾改「第 4 轮／第 1–3 轮已提交、第 4 轮未 commit」；N-3 补「第 6 命中是小写注释 `// devtools ---`」。
- **1 项 C 级残留（不阻塞，下轮顺手）**：批头 provenance 段写「三处超 R196 面**均标 (b) 自创**」，而 **§7.4 第 3 行磨率体系**标的是「**(b) 准自创**」——同一件内两种标签。建议统一为「(b) 自创」（磨率确无一手可对位），或批头改成「(b)（磨率体系为准自创）」。不影响判值与落码。
- **附注**：档尾「第 4 轮改动未 commit」在本条提交 `bd40197` 后即成历史陈述，下轮改档尾时一并更新即可，不回改本轮。
- **钉值**：jar **30,285 B／`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`／mtime 2026-10-28 22:28:28**／产品码 `c66c099` **未动**，0 rebuild（两件均 `.md`）。阻塞 0；等待项 = 正式派修 + `ETIMShield`／`ETIMGhost` 同批 mavenLocal + 接口 jar 钉值。

## 条 35 · C-审5 补丁提交 `d524d41` + 终审回执收存 `f67ed8f` + 文档链收口（2026-10-29）

- **来源**：会话六「`bd40197` 核讫 + C-审5 补丁已做（1 件，未 commit）+ 终审回执归属建议（取选项 1）」，用户中转。
- **提交 1（补丁，按授权只 add 报告一件）**：逐路径 `git add --` → commit **`d524d41`**（parent `83aeeba`，message 与请求逐字一致）→ 推送 `83aeeba..d524d41`；`git show --stat` **1 文件、4+/3−**；摸底未动；主 mod 树未触。
- **两件机械核**：报告 **46,473 B／593 行**／SHA-256 `316A00A00E4DDE112ACA07BF3858FFC84DAF7E0F8799A7EE6F69D9526395B154`／**+4−3**；摸底**未改** **69,721 B／637 行**／SHA-256 `12213F2A7555FCD4FC48E05CBB6F711FCBB0D857A4AC45FBF3E83AF5B7641059`／**0**。两件 UTF-8 无 BOM、LF、0 U+FFFD、0 行尾空白；`report-check.js` 五根：**anchors 49 missing 0 / tables 22 bad 0 / OK**。
- **C-审5 处置核讫**：批头「三处超 R196 面**均标 (b) 自创**」→「**均标 (b)**」，第三项内联「**(b) 准自创**（率值体系无一手，仅工具整数磨损有 R196 形态）」；**§7.4 保持「准自创」不动**。
- **上游同源复核（采纳其不改 §7.4 的理由）**：摸底 **§八-4（`:633`）**原文 =「**2 自创面（曲线／银盾幽魂差分）+ 1 准自创面（磨率体系）**」，与 §7.4 第 3 行一致；若把 §7.4 改成「自创」反而与摸底打架。**改批头**是正解 ⇒ 两处口径现已一致且同源。
- **档尾刷新核讫**：轮次 →「第 4 轮 + C-审5 补丁（… + provenance 标签统一）」；零改动 →「第 1–4 轮已提交（`1890f63` / `3fd0d1b` / `4dff3b9` / `bd40197`）；**本补丁未 commit**」；§10 补**第 16 条**留痕。
- **提交 2（终审回执收存，按建议选项 1）**：单文件独立 commit **`f67ed8f`**（parent `d524d41`），message =「docs: 收存盾面削弱批终审回执（会话五 etim-audit 产出，结论放行；18,976 B，SHA-256 C2654D55…CA79D）」→ 推送 `d524d41..f67ed8f`；`git show --stat` **1 文件、+92**；该件 **18,976 B／93 行**／SHA-256 `C2654D552F8A251DD61808526C8A224A8BCFFA22DED3D3782D5E6A45355CA79D` 未变。作者归属在 message 内写明「会话五产出、附属代收」；若主会话另有裁示，单独 revert 此 commit 即可，不涉产品链。
- **文档链收口**：`1890f63`（第 1 轮）→ `3fd0d1b`（第 2 轮）→ `4dff3b9`（第 3 轮）→ `bd40197`（第 4 轮 B/C）→ **`d524d41`（C-审5）**；终审回执 **`f67ed8f`**；账本/回执 `83aeeba` → 本条。
- **附注（流程，非缺陷）**：档尾「本补丁未 commit」在 `d524d41` 后同样成为历史陈述——这类**自指状态句每轮必滞后一轮**；下轮建议删掉「未 commit」半句，或改写为「截至本轮文档定稿」。
- **钉值**：jar **30,285 B／`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`／mtime 2026-10-28 22:28:28**／产品码 `c66c099` **未动**，0 rebuild。阻塞 0；等待项 = 正式派修 + `ETIMShield`／`ETIMGhost` 同批 mavenLocal + 接口 jar 钉值。

## 条 36 · 文档冻结确认：引件钉值 + 重开条件（2026-10-29）

- **来源**：会话六「收口确认」转发（`d524d41` / `f67ed8f` / HEAD `7cbdcff` 核讫 + 冻结钉值 + 写法约定）。
- **复核（逐件从 commit 取 blob 重算，不采信转述）**：
  - 对照报告 `d524d41`：**46,473 B**｜SHA-256 `316A00A00E4DDE112ACA07BF3858FFC84DAF7E0F8799A7EE6F69D9526395B154`；commit **1 路径、4+/3−**、parent `83aeeba`。
  - 立项摸底 `bd40197`（`d524d41` 未变）：**69,721 B**｜SHA-256 `12213F2A7555FCD4FC48E05CBB6F711FCBB0D857A4AC45FBF3E83AF5B7641059`。
  - 终审回执 `f67ed8f`：**18,976 B**｜SHA-256 `C2654D552F8A251DD61808526C8A224A8BCFFA22DED3D3782D5E6A45355CA79D`；commit **1 路径、+92**、parent `d524d41`。
  - HEAD **`7cbdcff`**，工作树干净；三件工作树哈希与对应 blob **逐位相同**。
- **写法约定（采纳选项 1）**：今后档尾只写「**第 1–N 轮已提交（哈希栈）｜未起服、未构建、未跑 gradle**」；「本轮是否已提交」只进 §10 修订记录 + commit message，**档尾不再自指**。本轮按此不回改，不为一句消灭一次提交。
- **冻结纪律**：两件文档（对照报告／立项摸底）**冻结**；仅在 ① 派修单要求补文档 ② 落码后判「文档与实现不符」（C 级勘误）③ 终审重开 三种情形下改动，且每次须**新开轮次 + §10 留痕**。
- **引件只认这组钉值**：报告 `d524d41`／46,473 B／`316A00A0…5B154`；摸底 `bd40197`／69,721 B／`12213F2A…B7641059`；终审回执 `f67ed8f`／18,976 B／`C2654D55…CA79D`。
- **钉值**：jar **30,285 B／`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`／mtime 2026-10-28 22:28:28**／`c66c099` **未动**，0 rebuild。阻塞 0；等待项 = 正式派修 + `ETIMShield`／`ETIMGhost` 同批 mavenLocal + 接口 jar 钉值。

## 条 37 · 正式派修收到（盾面削弱批，终审已放行）：三件落码面锁定 + 1 项措辞待核（未落码，2026-10-29）

- **来源**：主会话 →「附属主会话」正式派修通知（终审已放行），用户中转。**本条 = 派修确认同步条**；我方仍零落码、零 action。
- **终审对象对钉（不采信转述）**：通知称实审 = 会话六终态冻结版 `d524d41`／**46,473 B**／SHA-256 `316A00A0…6395B154`——与 条 36 引件钉值**逐位相同**（`316A00A00E4DDE112ACA07BF3858FFC84DAF7E0F8799A7EE6F69D9526395B154`）。
- **主 mod 侧六件（本批落地，照录为契约面）**：
  1. 新增 `combat/ETIMShield.java`（`getBlockReduction` / `getWearMultiplier`，default 0.5 / 1.0）；
  2. 新增 `combat/ETIMGhost.java`（WeakSet 侧表 + 类型门只收 `EntityDamageSource` + `ghost-mark rejected` 行）；
  3. 改 `combat/ETIMBlocking.java`：三支分发（① `instanceof ETIMShield` 先于 ② vanilla `ItemShield`）+ 盾两臂 `wear=(int)Math.floor(blocked*(double)rate+1.0E-4)`（铜 8 伤→9、艾德曼 8 伤→4；工具臂 `(int)(blocked*decay)` 一字不动）；
  4. 改 `combat/ETIMBlockLog.java` 三行（判行四形：`block`(factor/spectral/min)｜`wear` 盾(rate/mult/decay=na)｜`wear` 工具(rate/mult=na)｜`probe`(shieldRateBase/woodReduction)）；
  5. 改 `ETIMConfig.java`（`shieldWearRateBase=2.5` / `shieldWoodReduction=0.5`，旧键不读；`shieldWearRate` 改名打全 9 处 = 码面 5 + 注释面 4）；
  6. 新增 `commands/CommandEtimGhost.java` + `TestDriver.hurtSpectral` + `ETIM.java` 注册行。
- **派修单必带三章（落点 = config 注释 / javadoc，非审计文档）**：
  1. provenance (b) 自创面声明（B-审3）：(i) 全套减伤曲线；(ii) 银盾幽魂差分（R196 `hasSilverAspect` 是「攻击者持银」，本批是「攻击者是幽魂」）；(iii) 磨率体系；耐久三值同为 (b)。记法 = 铜盾 1,600 为基 **×2/×4/×8**；**旧 T-1 工具尺公式对高端三件废止**；R196 无盾 ⇒ 窗内不得以「R196 怎么写」为反对理由。
  2. 数值换算句（条 29.4）：整数百分比存 config，`ETIMExtraContent` 读出 `/100.0F` + clamp 0~1 再进构造器。
  3. D-7 绝对面：银盾幽魂 = **绝对** `spectralReduction = 0.65`（非「本盾值 + 0.25」相加派生），config 注释写死。
- **我方三件（接口 jar 钉值回传后开工）**：
  1. `ETIMExtraItemShield` `implements ETIMShield` + 4 字段（`reduction` / `spectralReduction` / `wearMultiplier` / `spectralWearMult`）；两方法体经 `ETIMGhost.isSpectral(source)` 分面：`getBlockReduction` 物理 40 / 幽魂 65，`getWearMultiplier` 物理 1.4 / 幽魂 0.5（**银盾**；其余四盾 1.0 及各自曲线值）；
  2. `ETIMExtraContent` 传值 + `ETIMExtraConfig` **8 键** + 耐久三值改落（远古 3,200 / 秘银 6,400 / 艾德曼 12,800，provenance (b) 记法）；
  3. B-审4 全清改：javadoc 四段（`ETIMExtraItemShield.java:38-45` / `:60-61` + `ETIMExtra.java:22` / `:34` 旧派生/旧率句删除）；config「DERIVED」注释改写为 (b) 记法；`run/config/etimextra.cfg` document-only 删档重生。
- **W-16 口径（钉）**：只判 **L0**；判点判 `wear`/`rate`/`mult`，**不判击数**；银盾幽魂腿 `etimghost hurt … spectral=true` 双腿互证；**A-2 边界格必判**（铜 raw=8 → 9、艾德曼 raw=8 → 4；得 8 / 3 即 epsilon 漏加，判失败）；**L3 全列标「未实测（依赖耐久附魔面统一批）」，禁标不通过**。
- **判面复核（与 条 31／条 33 定稿一致，无新增、无作废）**：`net = max(1.0, raw×(1−r))`；`wear = (int)Math.floor(net×2.5×mult + 1.0E-4)`；`factor` = 1−r（铜 0.450／银物 0.600／银幽 0.350／远古 0.350／秘银 0.250／艾德曼 0.200／木 0.500）；`rate` = 2.5×mult（2.500／3.500／1.250／2.500／2.500／2.500）；7 行 × 2 列预测表不变（9/2、16/3、3/1、7/2、5/2、4/2、10/2）。
- **与冻结文档一致性（逐项核讫，两件文档不动）**：曲线五值、银盾绝对 65、银盾 wear 1.4 / spectralWear 0.5、磨率基准 2.5 + 逐盾乘子、epsilon 仅盾两臂、8 键组、耐久三值、判行四形、L3 不判——**全部与报告 `d524d41` / 摸底 `bd40197` 相同**。派修单**未要求补文档**（三章落点是 config/javadoc）⇒ 重开条件 ①②③ **均未触发**，两件**继续保持冻结**。
- **1 项 C 级措辞待核（不阻塞落码）**：派修 §三.2 写「Config 8 键（盾面 reduction/wear 全盾 + 银盾 spectralReduction/spectralWear 四特殊键）」——「全盾 reduction/wear」字面 = 10 键，再加「四特殊键」= 14，与同句「**8 键**」不自洽，亦与 条 31 D31-2（附属**不设** `shield.wearRate`）／报告 §2.3 冲突。**我方按 8 键落**：`shield.{copper,silver,ancientMetal,mithril,adamantium}.reduction`（55/40/65/75/80）+ `shield.silver.spectralReduction`（65）+ `shield.silver.wear`（1.4）+ `shield.silver.spectralWear`（0.5）；**非银盾无 `wear` 键**（乘子恒 1.0，字面常数）。若主会话另有裁示，请在 jar 钉值回传时一并给出，否则按此执行。
- **1 项变量名提醒（读法已定，不改）**：主 mod 侧 `wear` 式中的 `blocked` 变量即**净伤害**（`ETIMBlocking.java:125-129,144`，条 29.6 已核）；我方按 `net` 读，**不按 raw**。
- **依赖序（要件 9）**：主 mod 六件 → 编译 → `publishEtimLocalPublicationToMavenLocal` **同批** → 回传 commit + jar 钉值（字节/SHA/mtime）→ 我方开工，**不猜工件**。
- **本条落盘时实测现状（主 mod 树只读查证）**：HEAD 仍 **`7a26c6f`**；`combat\ETIMShield.java` / `combat\ETIMGhost.java` / `commands\CommandEtimGhost.java` **三者均不存在**；mavenLocal `etim-1.0.0-dev.jar` 仍 **746,954 B／2026-10-28 18:41:50**（上一批工件）⇒ **接口未到，我方零落码**。（主 mod 工作树另有 1 个未跟踪件 `testharness/pose/probe-tmp.js`，非我方产出，仅登记。）
- **账目**：主账 条 116/117/118（对照报告／终审／派修 10 要件）由主会话声明已挂——主账在主 mod 仓，我方**只读不写**，未核原文。
- **钉值**：本机 jar **30,285 B｜`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`｜mtime 2026-10-28 22:28:28**／产品码 `c66c099` **未动**，0 rebuild。
- **状态**：阻塞 0；等待项 = 接口 jar 钉值（`ETIMShield` + `ETIMGhost` 同批 mavenLocal）。收到后序：编译对照 → 落码三件 → rebuild + 冒烟 → W-16 → README §2/§3/§4/§5/§11 与重钉 → 账本记落码条 + jar 钉值。

## 条 38 · 派修回执收讫 + 8 键终案裁定 + 主侧六件预核（B 级 1 项 / C 级 3 项，仍未落码，2026-10-29）

- **来源**：主会话「派修确认收讫 + C 级措辞裁定（jar 钉值随落码回传）」，用户中转。**我方仍零落码、零 rebuild**。
- **C 级措辞裁定（照录）**：按我方拟式执行，**8 键终案**——`shield.{copper,silver,ancientMetal,mithril,adamantium}.reduction` = 55/40/65/75/80 + `shield.silver.spectralReduction` = 65 + `shield.silver.wear` = 1.4 + `shield.silver.spectralWear` = 0.5；非银盾不设 `wear` 键（乘子恒 1.0 字面常数）；派修单 §三.2 的「10+4」为发起文本冗余，主账以 条 118 为准；冻结文档不动面维持。
- **裁定文本拼写勘误（就地）**：回执键名写作 `adamanantium`（多一个 `an`）。项目材料名、报告 §2.3、我方待落键名一律 **`adamantium`** ⇒ 落码键 = **`shield.adamantium.reduction`**。纯拼写，无判值影响；若主账 条 118 含同拼写，请其侧补记或由本条备用。
- **主侧六件现状（只读实测，不采信转述）**：HEAD 仍 **`7a26c6f`**；工作树 **6 改**（`build.gradle`、`ETIM.java`、`ETIMConfig.java`、`ETIMBlockLog.java`、`ETIMBlocking.java`、`harness/TestDriver.java`）+ **3 新**（`combat/ETIMShield.java` 1,804 B、`combat/ETIMGhost.java` 2,138 B、`commands/CommandEtimGhost.java` 1,917 B，mtime 13:12–13:14）+ 1 个非我方未跟踪件 `testharness/pose/probe-tmp.js`；**均未 commit** ⇒ 不作引件钉值。mavenLocal 仍 2026-10-28 18:41:50（`dev` 746,954 B）⇒ **接口 jar 未回传**。
- **接口面逐条对读（编译前预核）**：
  - `ETIMShield`：`default float getBlockReduction(DamageSource)` → `ETIMConfig.shieldWoodReduction`；`default float getWearMultiplier(DamageSource)` → `1.0F`。**签名与冻结一致**；default 走配置键而非字面 0.5（缺省 0.5 ⇒ 逐位相同，且我方两个方法全覆写，无影响）。
  - `ETIMGhost`：`static boolean isSpectral(DamageSource)` **✓**；`static void markSpectral(DamageSource)` —— **返回 `void` ≠ 冻结 `boolean`**（条 31 D31-5 钉 boolean）；侧表 `Collections.newSetFromMap(new WeakHashMap<>())` **未加 `synchronizedSet`**；拒绝行 = `ETIM.LOGGER.info("ghost-mark rejected src=<FQCN> [server]")`，**无 `[BlockLog]` 前缀**、`src=` 为类名非 `<type>`。⇒ **C 级 3 项**：我方只调 `isSpectral`，**编译面零影响**；W-16 若触发拒绝行则不在判据通道（该路径按设计不可达）。
  - `CommandEtimGhost`：`/etimghost hurt <selector> <amount> <spectral:true|false>`、permission 2、`devTools` 门内注册（`ETIM.java` 141 区）**✓**；`spectral = "true".equalsIgnoreCase(args[3])` ⇒ 非 `true` 字串**静默按 false**（窗内必须字面写 `true`／`false`，写 `1` 会静默走物理腿）。
  - `TestDriver.hurtSpectral`：逐次 `new EntityDamageSource("etimspectral", player)`，源实体 = **受害者本人**（我方 条 30 C-1 建议未采纳）⇒ 自伤语义；判据只吃 `block`/`wear` 两行、数学不受影响，登记为 W-16 已知条件（若 `src=etimspectral` 行伴异常击退/仇恨，可换场上标记僵尸）。
- **判行面实测对读（1 项 B 级 + 2 项 C 级）**：
  - **B-38-1（B 级，主侧一行可修）`wear` 行 `rate=` 语义与冻结相反**：冻结（条 31 判面更新 + 条 33 行形定稿）= `rate` 打**有效总率** 2.5×mult（银物 **3.500**、银幽 **1.250**）；实装 `rate = ETIMConfig.shieldWearRateBase`（恒 **2.500**）+ `mult`（1.400/0.500）。**`wear` 数值本身正确**（`(int)floor(blocked×rate×mult+1e-4)`），仅日志字段口径不同。**修法一行**：盾行改 `f3(rate * mult)`。若不修，则 W-16 判点须改成 `rate×mult` 并开 C 级勘误重开报告 §1.4——不如主侧改一行。**建议在其编译/发布前修掉**。
  - **C-38-2（C 级）`wear` 行多一个 `shield=<b>` 字段**（位于 `item=` 与 `rate=` 之间），冻结四形无此字段。附加字段不破坏按键盘读；**我方判行一律键值解析、不按位置**，登记即可。
  - **C-38-3（C 级，判点钉）`block` 行 `factor=` = `blocked/raw`（本击实际保留系数）**：未触地板时 = 1−r（与预测表一致）；触 1.0 地板臂（raw=1）打印 **1.000**，非 1−r。⇒ **W-16 判点钉死：`factor` 只在 raw=8 臂判**（铜 0.450／银物 0.600／银幽 0.350／远古 0.350／秘银 0.250／艾德曼 0.200／木 0.500）；**raw=1 臂只判 `wear`／`rate`／`mult`**。
- **W-16 预测表不变（9/2、16/3、3/1、7/2、5/2、4/2、10/2）**，三条前置实测在册：① 五盾 `isShield` 覆写在案（`ETIMExtraItemShield.java:92`），`isShieldStack = stack.getItem().isShield(stack, null)` 为 true ⇒ 走 **① `instanceof ETIMShield` 支**（不会被 ② 木盾常量吃掉）；② epsilon 只盾两臂（`(int)Math.floor(x + 1.0E-4)`），工具臂 `(int)(blocked*decay)` 一字未动；③ `r` clamp 0~1 + `max(raw×(1−r), blockMinDamage)` 与 `net = max(1.0, raw×(1−r))` 等价。
- **环境提示（可直接给主侧）**：RFG 2.0.3 构建确实需要 JVM 25；本机已装 **`C:\Users\GreatCoffee\tools\jdk-25.0.4.1+1`**（本附属项目即用它起 `gradlew` 且全绿）。主侧若卡在 buildscript class 版本，把 `JAVA_HOME` 指向同一目录即可，无需另装。
- **钉值**：本机 jar **30,285 B｜`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`｜mtime 2026-10-28 22:28:28**／产品码 `c66c099` **未动**，0 rebuild。
- **状态**：阻塞 0；等待项 = 接口 jar 钉值（六件 commit + 同批 `publishEtimLocalPublicationToMavenLocal`）。**唯一建议前置修** = B-38-1（一行）；其余 C 级不阻塞。

## 条 39 · 编号勘正 + 落码实况勘误提交核讫 + 冻结文档哈希更替（2026-10-29）

- **a) 编号勘正提交**：`75da0c6`（parent `658f298`，仅对照报告，4+/3−）——对照报告 **46,834 B｜SHA-256 `61D1DD48D974EC21590AD1D709DD1E9B8C7D72EE4AA1AB3AF44765BEF691CB77`**；会话六核讫（blob 同值、工作树与 HEAD 一致），会话五复算同值、结案回执到位（零未结项）。
- **b) 冻结文档哈希更替**：对照报告 `d524d41`（46,473 B｜`316A00A0…6395B154`）→ `75da0c6`（46,834 B｜`61D1DD48…1CB77`）→ 本轮落码实况勘误 `1cbaedb`（**48,986 B｜SHA-256 `BD594F3BC713781B3F5AC1661994DA5497BA714C3CCD40CE4F87C2BD344605BE`**；行数按会话六口径 604 行 = ReadAllLines 603 + 末尾 LF）；立项摸底 `bd40197`（69,721 B｜`12213F2A…B7641059`）→ `1cbaedb`（**70,121 B｜`2A2D84C4CD0092C6CF60410AD2EEA6F57D35FDE60B4E688E98D5AD84CFE80043`**）；终审回执 `f67ed8f` 未动（18,976 B｜`C2654D55…CA79D`）。会话六口径：账本引用以本组为准，`d524d41` 对报告**作废**。
- **c) 落码实况三处差异登记（判据以实装为准，产品码零改动）**：
  - ① `wear` 行多 **`shield=<bool>`** 字段（`combat\ETIMBlockLog.java:124`，位于 `item=` 与 `rate=` 之间；盾行 `true`／工具行 `false`）——C 级超集，我方判行一律键值解析、不按位置，附加字段不影响判读。
  - ② `block.factor` 实装按 **`blocked / raw`** 计算（`:109-110`，`raw > blocked` 时），不是上游传的 `1−r`；地板生效（如 raw=1 的 1.0 地板臂）打 **`1.000`**。语义仍是「本击实际保留系数」；**W-16 判点钉：`factor` 只在 raw=8 臂判**（0.450 / 0.600 / 0.350 / 0.350 / 0.250 / 0.200 / 0.500），raw=1 臂只判 `blocked=1.000` 与 `wear`/`rate`/`mult`。
  - ③ 行序实装是 **`wear` 先、`block` 后**（`combat\ETIMBlocking.java:150-151`，M2-3「先把当前这次磨损结掉」），与报告 §6.2 旧示例的 block 先相反；**W-16/W-19 只判「相邻」，不判先后**。
- **文档落点**：上述三条已由会话六写入报告 §1.4「落码实况」段 + §1.4 `wear` 行表 + §6.2 示例（实装行序 + `shield=true`）+ §6.3 判据 1（「相邻即可，不判先后」），并新增 §10 第 18／19 条；摸底 §3 表后补「实装行形补记」。零判值变动、零产品码改动。
- **本轮实测对齐**：W-16 七腿 × 两臂全 PASS（铜 3.600/0.450/9·2；银物 4.800/0.600/3.500/1.400/16·3；银幽 2.800/0.350/1.250/0.500/3·1；远古 2.800/0.350/7·2；秘银 2.000/0.250/5·2；艾德曼 1.600/0.200/4·2；木 4.000/0.500/10·2），三处差异全部按上列判点执行；回执见 `testharness/reports/extra-shield-nerf-w16-verdict.md`。
- **钉值**：本条只记文档提交；附属 jar 钉值随落码提交另记（下一条）。
- **状态**：会话六侧两件映射文档**不再改动**（仅 ① 派修单要求补文档 ② 落码后判「文档与实现不符」 ③ 终审重开 三情形例外）；我方继续落码提交 → W-16 回执 → 下一轮。

## 条 40 · 盾面削弱批落码条 + jar 钉值 + W-16 七腿全 PASS（2026-10-29）

- **落码提交**：`d0bfd5c`（parent `234f803`，7 路径：4 个 `src` + README + W-16 驱动 + W-16 回执）。
- **落码内容（= 条 37 派修本要件 1-3）**：
  - `shield/ETIMExtraItemShield` → **`implements ETIMShield`** + 4 个取值字段 `reduction` / `spectralReduction` / `wearMultiplier` / `spectralWearMult`；`getBlockReduction` / `getWearMultiplier` 两面分派只经 `ETIMGhost.isSpectral(source)`（D-7 绝对值，不做物理值加成）；`isShield` 仍恒 `true`（C-4 不变）。
  - `shield/ETIMExtraContent` → 注册时传四值；百分比换算 `percent(v) = clamp(v / 100.0F, 0..1)`（条 29.4；clamp 落在此处，构造器只收 0..1）。
  - `ETIMExtraConfig` → **8 键**（五盾 `reduction` 55/40/65/75/80 + `silver.spectralReduction` 65 + `silver.wear` 1.4 + `silver.spectralWear` 0.5），三段键写成 `shield` 类别下的点号属性名（Forge 会小写类别名，`Configuration:1146-1149`，嵌套会把 `ancientMetal` 打成 `ancientmetal`；属性名不受该转换）；非银四盾**不设** `wear` 键（1.0 字面常数，D31-2）；耐久默认值改 **远古 3,200 / 秘银 6,400 / 艾德曼 12,800**（铜 1,600 为基 ×2/×4/×8，provenance (b)），旧「DERIVED = 4.0 × 1 × d × 100」注释与 javadoc 四段（`ETIMExtraItemShield:38-45`/`:60-61`、`ETIMExtra:22`/`:34`）同批改写为终裁值与 (b) 声明。
  - 迁移 = **document-only**：`run/config/etimextra.cfg` 已删、由新代码重生成（8 键 + 5 耐久键逐字在位，见 `run/config/etimextra.cfg`），无迁移代码。
- **jar 钉值（本批 rebuild 1）**：`build/libs/etimextra-0.1.0.jar` **31,614 B｜SHA-256 `2D42D78AE475E2261C9071B980322570EC7003FC86961771CF32D8374C847A98`｜mtime 2026-10-29 13:40:06**；`compileJava` 对 mavenLocal `io.github.etim:etim:1.0.0:dev`（**750,801 B｜`7998673BB60B7ADDA332709F947426CCC665FEE46D25B42860BC4C61C7E63BA7`**，主侧 `c7672f2` + `03bbeff` 同批发布）零错通过；`javap` 复核 `ETIMExtraItemShield implements ETIMShield` 且两方法签名在册。
- **W-16 结果（L0 全表）**：七腿 × 两臂 **PASS**，14/14 行逐格对表——铜 3.600/0.450/9·2；银物 4.800/0.600/3.500/1.400/16·3；银幽 2.800/0.350/1.250/0.500/3·1；远古 2.800/0.350/7·2；秘银 2.000/0.250/5·2；艾德曼 1.600/0.200/4·2；木 4.000/0.500/10·2。**A-2 边界两格全对**：铜 raw=8 → **9**、艾德曼 raw=8 → **4**（8/3 未出现 ⇒ epsilon 未漏）。回执 `testharness/reports/extra-shield-nerf-w16-verdict.md`。
- **窗内口径**：`factor` 只判 raw=8 臂（C-38-3），raw=1 臂只判 `blocked=1.000` + `wear`/`rate`/`mult`；`shield=` 超集字段按附加字段忽略；行序只判「相邻」不判先后（`1cbaedb` 定稿）；不判击数（B-5）；类型门拒绝行无命令入口、按设计登记。
- **L3**：全列标「**未实测（依赖耐久附魔面统一批）**」，未标「不通过」；969 / 2,327 / 5,818 仍为预测值、不入判据（A-3/D-2）。
- **冲突**：A 0 / B 0 / C 3（行序 wear 先 / `shield=` 超集 / `factor=blocked÷raw` 地板打 1.000），三条均已由 条 39 + 报告 `1cbaedb` 在册，无新增。
- **产物面**：W-16 证据在 `testharness/build-logs/`（git 忽略）；窗内 `etim.cfg` 按字节还原、SHA `BD37A2BF…D8CB85` 与窗前逐字节相同；0 crash-report；端口 25565 = 0。
- **README**：§2 表加「减伤（物理／幽魂）」列、§3 改三支分发与磨损式、§4 改终裁值与 (b)（旧派生式与因子表删除）、§9 配置表 13 键、§10 补 `[BlockLog]` 判据面、§11 钉值换新并记 W-16。
- **下一环**：W-17…W-23（同批验证窗）→ 判决回执；若判「实现与文档不符」按三情形回本 C 级补。
