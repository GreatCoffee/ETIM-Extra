# ETIM-Extra

本 README 逐节双语：每节先中文，后 English。
This README is bilingual per section: Chinese first, English follows.

## 这是什么 / What this is

ETIM（Easy Times In Minecraft）的附属 mod，为主 mod 的 R196 材料表补上五件金属盾（R196 是本项目对照的参考反编译版本）。运行环境为 Minecraft 1.12.2 与 Forge 14.23.5.2847。

- modid：`etimextra`
- 版本：0.1.0
- 包名：`io.github.etim.etimextra`
- 运行期依赖：`required-after:etim`（etim 1.0.0）
- 仓库：`https://github.com/GreatCoffee/ETIM-Extra`

An add-on mod for ETIM (Easy Times In Minecraft). It adds five metal shields on top of the main mod's R196 material table (R196 is the reference decompiled build this project is ported against). It runs on Minecraft 1.12.2 with Forge 14.23.5.2847.

- modid: `etimextra`
- version: 0.1.0
- package: `io.github.etim.etimextra`
- runtime dependency: `required-after:etim` (etim 1.0.0)
- repository: `https://github.com/GreatCoffee/ETIM-Extra`

| 路径 / Path | 内容 / Contents |
|---|---|
| `src/main/java` | 入口与盾内容 / mod entry and shield content |
| `src/main/resources` | models、textures、lang、mcmod.info / models, textures, lang, mcmod.info |
| `playground/audit` | append-only 账本与判据 / append-only ledger and judgement basis |
| `testharness` | 服务端与假玩家工装、回执 / server and fake-player rig, verdicts |

## 五件盾 / The five shields

五件盾，一件对应 R196 材料表里一种有锭的金属。耐久与减伤见「数值与来源」；附魔度是材料行一手值。

Five shields, one per ingot-bearing metal of the R196 material table. Durability and reduction are covered in "Values and provenance"; enchantability is a first-hand value from the material row.

| 物品 id / Item id | 中文名 / Chinese name | English name | 耐久 / Durability | 减伤（物理／幽魂）/ Reduction (phys / ghost) | 附魔度 / Enchantability |
|---|---|---|---|---|---|
| `etimextra:copper_shield` | 铜盾 | Copper Shield | 1,600 | 55% / 55% | 30 |
| `etimextra:silver_shield` | 银盾 | Silver Shield | 1,600 | 40% / 65% | 30 |
| `etimextra:ancient_metal_shield` | 远古金属盾 | Ancient Metal Shield | 3,200 | 65% / 65% | 40 |
| `etimextra:mithril_shield` | 秘银盾 | Mithril Shield | 6,400 | 75% / 75% | 100 |
| `etimextra:adamantium_shield` | 艾德曼盾 | Adamantium Shield | 12,800 | 80% / 80% | 40 |

## 与主 mod 的分工 / Division of labour

格挡机制在主 mod 的 `combat/ETIMBlocking`：三支分发——① 本附属五盾实现的 `ETIMShield` 接口先于 ② vanilla `ItemShield`（木盾常量 0.5）；伤害下限 1.0；磨损 `(int)Math.floor(blocked × 2.5 × mult + 1e-4)`（epsilon 只给盾两臂，木盾 mult = 1.0）。本附属只持数值面：减伤曲线、银盾幽魂面与磨损乘子；没有自有格挡代码，也没有 mixin 类。

The blocking mechanism lives in the main mod's `combat/ETIMBlocking`: a three-arm dispatch where ① the `ETIMShield` interface implemented by this add-on's five shields comes before ② vanilla `ItemShield` (wood constant 0.5), with a 1.0 damage floor and wear of `(int)Math.floor(blocked × 2.5 × mult + 1e-4)` (the epsilon is shield-arm only; the wood shield has mult = 1.0). This add-on owns only the numeric face — the reduction curve, the silver ghost face and the wear multipliers; it has no blocking code of its own and no mixin class.

## 数值与来源 / Values and provenance

耐久与减伤都是本批的**终裁平衡值**（provenance (b)，自创）：R196 没有盾，不存在一手可对位值。耐久以铜 1,600 为基，远古 ×2、秘银 ×4、艾德曼 ×8 ⇒ 3,200 / 6,400 / 12,800（旧「4.0 × 1 × d × 100」派生式已废）；减伤曲线为铜 55% / 银 40% / 远古 65% / 秘银 75% / 艾德曼 80%，木盾仍取主 mod 常量 50%。银盾幽魂面是**绝对值** 65%（D-7，不随物理面漂移），磨损乘子为物理 ×1.4 / 幽魂 ×0.5，其余四盾两面均 ×1.0（不设 `wear` 键）。附魔度仍是一手值，代码直读主 mod 的 `ETIMMetals.enchantability`；本 README 表中的数字是该列的展示值，代码不复制常量。

Durability and the reduction curve are this batch's **final balance values** (provenance (b), invented): R196 has no shield, so there is no first-hand counterpart. Durability starts from copper 1,600, then ×2 / ×4 / ×8 ⇒ 3,200 / 6,400 / 12,800 (the old `4.0 × 1 × d × 100` derivation is retired); the curve is copper 55% / silver 40% / ancient 65% / mithril 75% / adamantium 80%, while the wood shield keeps the main mod's 50% constant. The silver ghost face is an **absolute** 65% (D-7, it does not follow the physical face); wear multipliers are ×1.4 physical / ×0.5 ghost for silver and ×1.0 on both faces for the other four (no `wear` key). Enchantability is still a first-hand value read straight off the main mod's `ETIMMetals.enchantability`; the numbers in the table above display that column, and the code copies no constants.

| 金属 / Metal | 耐久 / Durability | 减伤（物理）/ Reduction (phys) | 减伤（幽魂）/ Reduction (ghost) | 磨损乘子（物理／幽魂）/ Wear mult (phys / ghost) |
|---|---|---|---|---|
| COPPER | 1,600 | 55% | 55% | 1.0 / 1.0 |
| SILVER | 1,600 | 40% | 65% | 1.4 / 0.5 |
| ANCIENT_METAL | 3,200 | 65% | 65% | 1.0 / 1.0 |
| MITHRIL | 6,400 | 75% | 75% | 1.0 / 1.0 |
| ADAMANTIUM | 12,800 | 80% | 80% | 1.0 / 1.0 |

## 配方与合成 / Recipes and crafting

形状见下方代码块：X 为该金属锭，共 6 锭（2 + 3 + 1）。运行期从 `CraftingManager.REGISTRY` 反读已注册配方，并断言非空格数等于 6；形状打错即中止加载，不会静默只花 5 锭或 7 锭。合成走主 mod 的计时器：`difficulty = 150`、`period = 102` ticks、`quality = AVERAGE`、`xp = 0`。

The pattern is in the code block below: X is the metal ingot, six ingots per shield (2 + 3 + 1). At runtime the registered recipe is read back from `CraftingManager.REGISTRY` and the non-empty slot count is asserted to equal 6, so a mistyped pattern aborts the load instead of silently costing 5 or 7 ingots. Crafting goes through the main mod's timer: `difficulty = 150`, `period = 102` ticks, `quality = AVERAGE`, `xp = 0`.

```text
"X X"
"XXX"
" X "
```

## 范围与边界 / Scope and boundaries

| 边界 / Boundary | 说明 / Note |
|---|---|
| 锈铁 / Rusted iron | 无锭，故无盾；与主 mod 的锈铁装备同口径，只保留战利品链甲 / no ingot, so no shield; the same treatment as the main mod's rusted gear, loot-only chain armour |
| 金盾、铁盾 / Gold and iron shields | 保留原版 / kept vanilla |
| Mending 白名单 / Mending whitelist | 不做 / not implemented |
| 品质 / Quality | 盾不是品质载体 / a shield is not a quality carrier |
| 原版盾 / Vanilla shield | 不禁用 / not disabled |
| 举盾遮挡 / Blocking occlusion | 属原版机制，本项目不干预 / a vanilla mechanism, not touched by this project |

## 依赖与构建 / Dependency and build

Gradle launcher 需要 JDK 25（默认 JDK 21 会让 RetroFutura/CurseForge 插件失败）；Minecraft 运行在 Gradle 管理的 Java 8 toolchain 上。先在主 mod 仓库发布 dev jar，再构建本附属，两条命令见下方代码块。工具链含 MixinBooter 11.13：`use_mixins = true`，而本附属没有 mixin 类，`mixin_configs` 为空。

The Gradle launcher needs JDK 25 (the default JDK 21 breaks the RetroFutura/CurseForge plugins); Minecraft itself runs on the Java 8 toolchain managed by Gradle. Publish the dev jar from the main mod repository first, then build this add-on; both commands are in the code block below. The toolchain carries MixinBooter 11.13: `use_mixins = true`, while this add-on has no mixin class and `mixin_configs` is empty.

依赖坐标是 `io.github.etim:etim:1.0.0:dev`。`dev` classifier 是 MCP 名的 dev jar；主件是 reobf/SRG jar，不能用于 dev 工作区。产物是 `build/libs/etimextra-0.1.0.jar`。jar 只上 classpath，不要放 `run/mods`：MixinBooter 会把 mods 目录里的 jar 救援进 classloader，FML 又扫描同一目录，结果是致命的 `DuplicateModsFound`。

The dependency coordinate is `io.github.etim:etim:1.0.0:dev`. The `dev` classifier is the MCP-named dev jar; the main artifact is the reobf/SRG jar and must not be used in a dev workspace. The build output is `build/libs/etimextra-0.1.0.jar`. Keep the jar on the classpath only, never in `run/mods`: MixinBooter rescues jars from the mods directory into the classloader while FML also scans the same folder, which ends in a fatal `DuplicateModsFound`.

```powershell
cd "D:\OpenCodeWorkspace\Easy Times In Minecraft\git-workspace\etim"
$env:JAVA_HOME = 'C:\Users\GreatCoffee\tools\jdk-25.0.4.1+1'
.\gradlew.bat publishToMavenLocal

cd "D:\OpenCodeWorkspace\ETIM-Extra"
.\gradlew.bat build
```

## 开发运行 / Running

`gradlew runClient` 与 `gradlew runServer` 用于开发运行。冒烟轮用下方一条命令：脚本起服，用服务端 stdin 在 N 秒后打 `stop`，并快照 `run/logs/latest.log`。stock 1.12.2 的 RCON 一条连接只能带一个包（B-EXTRA-2），所以走 stdin。长日志落 `testharness/build-logs/`（git 忽略），不要贴进对话。

`gradlew runClient` and `gradlew runServer` are the dev run tasks. The smoke round uses the single command below: the script boots the server, types `stop` into the server console after N seconds, and snapshots `run/logs/latest.log`. Stock 1.12.2 RCON can carry only one packet per connection (B-EXTRA-2), which is why the script uses the server stdin. Long logs go to `testharness/build-logs/` (git-ignored); do not paste them into the conversation.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File testharness\server\run-server.ps1 -StopAfterSeconds 35 -Tag smoke
```

## 配置 / Configuration

配置文件是 `config/etimextra.cfg`（标准 Forge Configuration）。数值只在 preInit 载入一次，改动后需要重启。这些是玩家可感知的值，所以可配。

The config file is `config/etimextra.cfg` (a standard Forge Configuration). Values load once in preInit; a changed file needs a restart. These are player-perceivable values, so they are configurable.

| 键 / Key | 默认值 / Default | 说明 / Meaning |
|---|---|---|
| `debug.extraDebugLog` | `false` | `[ExtraLog]` 盾面判行开关 / switch for the `[ExtraLog]` shield rows |
| `shield.copperDurability` | `1600` | 铜盾耐久 / copper shield durability |
| `shield.silverDurability` | `1600` | 银盾耐久 / silver shield durability |
| `shield.ancientMetalDurability` | `3200` | 远古金属盾耐久 / ancient metal shield durability |
| `shield.mithrilDurability` | `6400` | 秘银盾耐久 / mithril shield durability |
| `shield.adamantiumDurability` | `12800` | 艾德曼盾耐久 / adamantium shield durability |
| `shield.copper.reduction` | `55` | 铜盾减伤百分比 / copper shield blocked percent |
| `shield.silver.reduction` | `40` | 银盾物理面减伤百分比 / silver physical-face blocked percent |
| `shield.silver.spectralReduction` | `65` | 银盾幽魂面减伤百分比（绝对值，D-7）/ silver ghost-face blocked percent (absolute) |
| `shield.ancientMetal.reduction` | `65` | 远古金属盾减伤百分比 / ancient metal shield blocked percent |
| `shield.mithril.reduction` | `75` | 秘银盾减伤百分比 / mithril shield blocked percent |
| `shield.adamantium.reduction` | `80` | 艾德曼盾减伤百分比 / adamantium shield blocked percent |
| `shield.silver.wear` | `1.4` | 银盾物理面磨损乘子（相对主 mod 基准 2.5）/ silver physical-face wear multiplier |
| `shield.silver.spectralWear` | `0.5` | 银盾幽魂面磨损乘子 / silver ghost-face wear multiplier |

减伤以整数百分比存盘，`ETIMExtraContent` 读出后 `/ 100.0F` 并 clamp 0~1 再进构造器。非银四盾**不设** `wear` 键：乘子恒 1.0 字面常数，不做死键。

Reductions are stored as integer percentages; `ETIMExtraContent` divides by `100.0F`, clamps to 0..1 and hands the fraction to the constructor. The other four shields have **no** `wear` key: their multiplier is the literal 1.0.

## 判断通道 / Judgement channel

日志通道是 `[ExtraLog]` 行。`[ExtraLog] preInit` 与 `[ExtraLog] boot ok - side=…` 两行不受开关限制，是冒烟轮的断言。盾面判行由 `debug.extraDebugLog` 控制；关闭时判行在首行即返回，对数值零影响。

盾面削弱批的实际判据在主 mod 的 `[BlockLog]` 行（`combat/ETIMBlockLog`，由主 mod 的 `blockDebugLog` 控制）：`block` 行给 `blocked`/`factor`/`spectral`，`wear` 行给 `rate`（= 2.5 × mult）/`mult`/`wear`/`dur`。测试口是 `/etimghost hurt <selector> <amount> <spectral:true|false>`（`devTools` 门内）。

The judgement channel is the `[ExtraLog]` rows. Two rows are ungated on purpose and serve as the smoke round's assertion: `[ExtraLog] preInit` and `[ExtraLog] boot ok - side=…`. The shield rows are gated by `debug.extraDebugLog`; when it is off those rows return on their first line and have zero effect on values.

The shield-nerf batch itself is judged on the main mod's `[BlockLog]` rows (`combat/ETIMBlockLog`, gated by the main mod's `blockDebugLog`): the `block` row carries `blocked`/`factor`/`spectral`, the `wear` row carries `rate` (= 2.5 × mult)/`mult`/`wear`/`dur`. The test entry point is `/etimghost hurt <selector> <amount> <spectral:true|false>` (inside the `devTools` gate).

## 现状与账本 / Status and ledger

五件盾原批全链闭单（W-1…W-15）。盾面削弱批已落码：五盾实现 `ETIMShield`（减伤曲线 + 银盾幽魂面 + 磨损乘子），耐久改为终裁三值（3,200 / 6,400 / 12,800）；W-16 七腿 × 两臂全 PASS（14/14 行对表，含 A-2 边界两格：铜 8→9、艾德曼 8→4）；W-17…W-23 待跑；L3（耐久附魔）列维持「未实测（依赖耐久附魔面统一批）」，不标「不通过」。测试由独立测试会话（主 mod 项目的会话七）执行；W-13/W-14 曾换执行方独立复跑，逐项同值。

All five shields closed the original chain (W-1…W-15). The shield-nerf batch is landed: the five shields implement `ETIMShield` (reduction curve + silver ghost face + wear multipliers) and the final three durability values (3,200 / 6,400 / 12,800); W-16 passed all seven legs × two arms (14/14 rows on table, including both A-2 boundary cells: copper 8→9, adamantium 8→4); W-17…W-23 are pending; the L3 (durability enchant) column stays "not measured (waiting for the unified durability-enchant batch)" and is never marked failing. Testing ran in an independent test session (session 7 of the main mod project); W-13/W-14 were rerun once by a different executor with identical results.

| 钉值项 / Pinned item | 值 / Value |
|---|---|
| jar | `build/libs/etimextra-0.1.0.jar`，31,614 B |
| SHA-256 | `2D42D78AE475E2261C9071B980322570EC7003FC86961771CF32D8374C847A98` |
| mtime | 2026-10-29 13:40:06 |
| 产品码 commit / product commit | `d0bfd5c`（落码提交；账本 条 40 / landing commit） |
| 重建 / rebuild | 1（本批落码；W-16 窗内 0 重建）/ 1 (this landing; 0 rebuild inside the W-16 window) |

钉值快照日期为 2026-10-29。账本是 `playground/audit/audit-extra-裁定回执.md`（append-only，条 1 起；盾批闭单与交接为条 1–24，盾面削弱批为条 25 起）；回执目录是 `testharness/reports/`，含五份原批 `extra-shield-*-verdict.md` 与削弱批 `extra-shield-nerf-w16-verdict.md`。

The pinned snapshot is dated 2026-10-29. The ledger is `playground/audit/audit-extra-裁定回执.md` (append-only, starting at entry 1; entries 1–24 cover the original shield batch and the hand-off, entries 25+ the shield-nerf batch); the verdict directory is `testharness/reports/`, holding the five original `extra-shield-*-verdict.md` files plus `extra-shield-nerf-w16-verdict.md`.
