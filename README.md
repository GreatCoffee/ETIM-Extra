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

五件盾，一件对应 R196 材料表里一种有锭的金属。耐久见「数值与来源」；附魔度是材料行一手值。

Five shields, one per ingot-bearing metal of the R196 material table. Durability is covered in "Values and provenance"; enchantability is a first-hand value from the material row.

| 物品 id / Item id | 中文名 / Chinese name | English name | 耐久 / Durability | 附魔度 / Enchantability |
|---|---|---|---|---|
| `etimextra:copper_shield` | 铜盾 | Copper Shield | 1,600 | 30 |
| `etimextra:silver_shield` | 银盾 | Silver Shield | 1,600 | 30 |
| `etimextra:ancient_metal_shield` | 远古金属盾 | Ancient Metal Shield | 6,400 | 40 |
| `etimextra:mithril_shield` | 秘银盾 | Mithril Shield | 25,600 | 100 |
| `etimextra:adamantium_shield` | 艾德曼盾 | Adamantium Shield | 102,400 | 40 |

## 与主 mod 的分工 / Division of labour

格挡机制在主 mod 的 `combat/ETIMBlocking`：伤害半减（8 → 4，×0.5）、下限 1.0、磨损 `(int)(blocked × shieldWearRate)`（默认 rate 1.0）。本附属只有物品、配方、模型与纹理；没有自有格挡代码，也没有 mixin 类。

The blocking mechanism lives in the main mod's `combat/ETIMBlocking`: damage is halved (8 → 4, ×0.5), with a 1.0 floor and wear of `(int)(blocked × shieldWearRate)` (default rate 1.0). This add-on owns only items, recipes, models and textures; it has no blocking code of its own and no mixin class.

## 数值与来源 / Values and provenance

耐久公式为 `4.0 × 1 × durabilityFactor × 100`，因子取自主 mod 的 `ETIMMetals`（`:37-41`，其值对应 R196 材料行的耐久列）。耐久是派生值，不是 R196 一手值：R196 没有盾。附魔度是一手值，代码直读主 mod 的 `ETIMMetals.enchantability`；本 README 表中的数字是该列的展示值，代码不复制常量。

Durability follows `4.0 × 1 × durabilityFactor × 100`, with the factor taken from the main mod's `ETIMMetals` (`:37-41`; those values correspond to the material row's durability column in R196). Durability is DERIVED: it is not a first-hand R196 value, because R196 has no shield. Enchantability is a first-hand value read straight from the main mod's `ETIMMetals.enchantability`; the numbers in the table above display that column, and the code copies no constants.

| 金属 / Metal | 因子 / Factor | 算式 / Formula |
|---|---|---|
| COPPER | 4 | `4.0 × 1 × 4 × 100` |
| SILVER | 4 | `4.0 × 1 × 4 × 100` |
| ANCIENT_METAL | 16 | `4.0 × 1 × 16 × 100` |
| MITHRIL | 64 | `4.0 × 1 × 64 × 100` |
| ADAMANTIUM | 256 | `4.0 × 1 × 256 × 100` |

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
| `shield.ancientMetalDurability` | `6400` | 远古金属盾耐久 / ancient metal shield durability |
| `shield.mithrilDurability` | `25600` | 秘银盾耐久 / mithril shield durability |
| `shield.adamantiumDurability` | `102400` | 艾德曼盾耐久 / adamantium shield durability |

## 判断通道 / Judgement channel

日志通道是 `[ExtraLog]` 行。`[ExtraLog] preInit` 与 `[ExtraLog] boot ok - side=…` 两行不受开关限制，是冒烟轮的断言。盾面判行由 `debug.extraDebugLog` 控制；关闭时判行在首行即返回，对数值零影响。

The judgement channel is the `[ExtraLog]` rows. Two rows are ungated on purpose and serve as the smoke round's assertion: `[ExtraLog] preInit` and `[ExtraLog] boot ok - side=…`. The shield rows are gated by `debug.extraDebugLog`; when it is off those rows return on their first line and have zero effect on values.

## 现状与账本 / Status and ledger

五件盾全链闭单：服务端数值 W-1…W-11、真实合成 W-13/W-14、逐一受击 W-15；客户端面 W-12 由用户判为正常；附魔名由用户肉眼观察，不是日志判据。测试由独立测试会话（主 mod 项目的会话七）执行；W-13/W-14 曾换执行方独立复跑，逐项同值。

All five shields are closed across the whole chain: server-side values W-1…W-11, real crafting W-13/W-14, per-shield hits W-15; client face W-12 was judged normal by the user; enchantment names were observed by eye, not by a log criterion. Testing ran in an independent test session (session 7 of the main mod project); W-13/W-14 were rerun once by a different executor with identical results.

| 钉值项 / Pinned item | 值 / Value |
|---|---|
| jar | `build/libs/etimextra-0.1.0.jar`，30,259 B |
| SHA-256 | `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93` |
| 产品码 commit / product commit | `7f6c472` |
| 窗内 rebuild / rebuild in window | 0 |

钉值快照日期为 2026-10-28。账本是 `playground/audit/audit-extra-裁定回执.md`（append-only，条 1 起；盾批闭单与交接为条 1–24）；回执目录是 `testharness/reports/`，含五份 `extra-shield-*-verdict.md`。

The pinned snapshot is dated 2026-10-28. The ledger is `playground/audit/audit-extra-裁定回执.md` (append-only, starting at entry 1; entries 1–24 cover the shield batch and the hand-off); the verdict directory is `testharness/reports/`, holding five `extra-shield-*-verdict.md` files.
