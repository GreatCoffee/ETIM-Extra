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
