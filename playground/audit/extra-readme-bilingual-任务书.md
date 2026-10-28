# 【任务书 · 会话八】ETIM-Extra README 中英双文重写

> **【订正 2026-10-28】** 本任务书 §四第 1 行的 Forge 版本 **14.23.5.2860 是错的**（照抄旧 README 未核）；实测运行日志为 **14.23.5.2847**（`testharness/build-logs/18-client-enchant.out`、`17-shield-family-hit.out` 等，`forge@14.23.5.2847`）。README 已按实测改正。历史任务书正文保留原样，不改写。

## 一、抬头

- **出借方**：ETIM-Extra 主会话（仓库 `D:\OpenCodeWorkspace\ETIM-Extra`）
- **执行方**：会话八（主 mod 项目纯文书会话；本次受聘于 ETIM-Extra，只做文档）
- **任务名**：`ETIM-Extra` 仓库 `README.md` 中英双文重写（内容同步更新到五金属盾现状）
- **产出**：唯一改动文件 = `D:\OpenCodeWorkspace\ETIM-Extra\README.md`
- **性质**：纯文书。**禁触代码、禁执行 git、禁构建、禁改其它文件**（详见 §二）

## 二、硬边界（越界即打回）

1. **只允许改** `D:\OpenCodeWorkspace\ETIM-Extra\README.md`。其它任何文件**一字不动**。
2. **禁执行 git 命令**（add／commit／push／status 全禁）。提交由主会话在你回执后执行。
3. **禁构建／禁运行**（`gradlew`、`runClient`、`runServer`、`node` 全禁）；本任务不需要跑任何东西。
4. **禁改**：`gradle.properties`、`testharness/README.md`、`src/**`、`playground/**`、`build.gradle`。
   - 已知 `gradle.properties` 的 `mod_description` 仍写 “mithril and adamantium shields”（旧文案）。**不要动它**；在回执「待裁决」里列一行即可，由主会话处理（该文件被 Java 以 ISO-8859-1 读取，非 ASCII 必须写 `\uXXXX`，你改会踩编码坑）。
5. **禁新建文件**（不建 `README.zh-CN.md`、不建翻译稿、不建备份）；就地重写 `README.md`。
6. **禁改仓库事实**：不得增删功能、不得写路线图／TODO／更新日志、不得声明许可证（仓库当前无 LICENSE 文件）、不得加 CI／徽章／外部链接（GitHub 仓库地址除外）。

## 三、文档形态（必须照做）

1. **单文件、逐节双语**：每一节先写中文段，紧接同节英文段；**不做「上半中文、下半英文」的两段镜像**（避免两半漂移）。
2. 文件开头第 3–4 行加一句双语声明：
   - 中文：`本 README 逐节双语：每节先中文，后 English。`
   - 英文：`This README is bilingual per section: Chinese first, English follows.`
3. **标题格式**：`## 中文标题 / English Title`（一级标题只保留 `# ETIM-Extra` 一行，不重复双语）。
4. **表格共用一份**，表头单元格双语，如 `| 物品 / Item | 耐久 / Durability |`；数字只写一次，不在中英段里各写一遍造成不一致。
5. 代码块（PowerShell／shell）只出现一次，中英两段各自用一句话指向同一代码块。
6. 语言风格：中文简体、陈述句；英文简单句、不用营销词；**不用 emoji**。

## 四、必须覆盖的十一节（缺一节即不合格）

按此顺序，标题名可微调但语义必须一一对应：

| # | 节 | 必须写到的事实 |
|---|---|---|
| 1 | 这是什么 / What this is | ETIM（Easy Times In Minecraft）的附属 mod；Minecraft **1.12.2** / Forge **14.23.5.2860**；modid `etimextra`；版本 **0.1.0**；包名 `io.github.etim.etimextra`；运行期依赖 `required-after:etim`（etim **1.0.0**）；仓库 `https://github.com/GreatCoffee/ETIM-Extra` |
| 2 | 五件盾 / The five shields | 一张表：id／中文名／English name／耐久／附魔度（数值见 §五红名单）。**恰好五件**，不得写成两件（旧文案 “mithril and adamantium” 是过期信息，必须改掉） |
| 3 | 与主 mod 的分工 / Division of labour | 格挡**机制**在主 mod `combat/ETIMBlocking`：伤害半减（8→4，×0.5）、下限 1.0、磨损 `(int)(blocked × shieldWearRate)`（默认 rate 1.0）；附属**只有物品／配方／模型纹理**；**无自有格挡代码、无 mixin 类** |
| 4 | 数值与来源 / Values and provenance | 耐久公式 `4.0 × 1 × durabilityFactor × 100`，因子 4／4／16／64／256；**耐久是派生值（DERIVED），不是 R196 一手值**（R196 无盾）；附魔度是**一手值**，直读主 mod `ETIMMetals.enchantability`（30／30／40／100／40） |
| 5 | 配方与合成 / Recipes and crafting | 形状 `"X X" / "XXX" / " X "`，X = 该金属锭，**共 6 锭**；运行期从 `CraftingManager.REGISTRY` 反读并断言非空格数 = 6；合成 `difficulty = 150`、`period = 102` ticks、`quality = AVERAGE`、`xp = 0` |
| 6 | 范围与边界 / Scope and boundaries | 锈铁**无锭故无盾**（与主 mod 锈铁装备同口径，只战利品链甲）；金／铁盾**保留原版**；不做 Mending 白名单；盾**不是品质载体**；不禁用原版盾；举盾遮挡属原版机制、本项目不干预 |
| 7 | 依赖与构建 / Dependency and build | 主 mod 先 `gradlew publishToMavenLocal`；依赖坐标 `io.github.etim:etim:1.0.0:dev`（**dev classifier = MCP 名 dev jar**，主件是 reobf/SRG，不得用于 dev 工作区）；附属 `gradlew build`，产物 `build/libs/etimextra-0.1.0.jar`；**jar 只上 classpath，不要放 `run/mods`**（MixinBooter rescue + FML 扫描 = DuplicateModsFound 致命） |
| 8 | 开发运行 / Running | `gradlew runClient` / `gradlew runServer`；冒烟：`powershell -NoProfile -ExecutionPolicy Bypass -File testharness\server\run-server.ps1 -StopAfterSeconds 35 -Tag smoke`；stock 1.12.2 RCON **一连接只能带一个包**（B-EXTRA-2），故走服务端 stdin；长日志落 `testharness/build-logs/`（git 忽略），不要贴进对话 |
| 9 | 配置 / Configuration | `config/etimextra.cfg`（Forge Configuration）；六键表：`debug.extraDebugLog=false`、`shield.copperDurability=1600`、`shield.silverDurability=1600`、`shield.ancientMetalDurability=6400`、`shield.mithrilDurability=25600`、`shield.adamantiumDurability=102400`；**preInit 只载入一次**，改后需重启；这些是玩家可感知值，故可配 |
| 10 | 判断通道 / Judgement channel | `[ExtraLog]` 行；`[ExtraLog] preInit` 与 `[ExtraLog] boot ok - side=…` 两行**不受开关限制**（冒烟断言）；盾面判行由 `debug.extraDebugLog` 控制，关时首行即返回、对数值零影响 |
| 11 | 现状与账本 / Status and ledger | 五件盾全链闭单（服务端数值 W-1…W-11、真实合成 W-13/W-14、逐一受击 W-15、客户端面 W-12 用户判正常、附魔名用户观察）；钉值**快照（2026-10-28）**：jar **30,259 B**／SHA-256 `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93`／产品码 commit `7f6c472`／**0 rebuild**；账本 `playground/audit/audit-extra-裁定回执.md`（条 1–24）；回执目录 `testharness/reports/`（五份 `extra-shield-*-verdict.md`）；测试由独立测试会话（主 mod 项目的会话七）执行，W-13/W-14 曾换执行方独立复跑且逐项同值 |

**仓库结构**（并入 §1 或 §11 的小表即可）：`src/main/java`（入口 + 盾内容）、`src/main/resources`（models／textures／lang／mcmod.info）、`playground/audit`（append-only 账本与判据）、`testharness`（服务端／假玩家工装 + 回执）。

## 五、事实红名单（逐字照用，禁改）

| id | 中文名 | English | 耐久 | 附魔度 |
|---|---|---|---|---|
| `etimextra:copper_shield` | 铜盾 | Copper Shield | 1,600 | 30 |
| `etimextra:silver_shield` | 银盾 | Silver Shield | 1,600 | 30 |
| `etimextra:ancient_metal_shield` | 远古金属盾 | Ancient Metal Shield | 6,400 | 40 |
| `etimextra:mithril_shield` | 秘银盾 | Mithril Shield | 25,600 | 100 |
| `etimextra:adamantium_shield` | 艾德曼盾 | Adamantium Shield | 102,400 | 40 |

- 结构因子 `durabilityFactor`：`COPPER=4`、`SILVER=4`、`ANCIENT_METAL=16`、`MITHRIL=64`、`ADAMANTIUM=256`（枚举 `ETIMMetals.java:37-41`）。
- 附魔度来源列同名：`ETIMMetals.enchantability`。
- **派生值必须显式标注**：中英各出现一次 “DERIVED／派生”，且不得写成 “R196 盾耐久”。R196 没有盾，这是 A-1 已裁事实。
- 数字写法：README 用千分位（1,600）；代码块与 SHA 内保持原样。

## 六、措辞纪律（禁自释）

1. **不得自行解释**任何数字、来源、机制；只写本任务书给出的事实。歧义处不猜，标 `【待主会话裁决】` 并在回执列出。
2. **不得新增**功能描述、兼容性承诺、性能数据、未来计划。
3. **不得翻译或改写**物品 id、配置键、日志标签、命令、路径、commit 短 SHA。
4. **不得把派生写成一手**，也不得把「用户观察」写成自动化验证（附魔名是用户肉眼观察，不是日志判据）。
5. **不得引用**本任务书之外的判据编号（W-16 之后不存在；账本只到条 24）。
6. 若发现本任务书事实与仓库现状冲突（例如文件不存在、键名不同），**停手**，在回执写「冲突：<项>，实测 <值>，未改」并等主会话裁决。

## 七、落盘与字节规格

- 路径：`D:\OpenCodeWorkspace\ETIM-Extra\README.md`（就地覆盖；不备份、不新建）。
- 编码：**UTF-8 无 BOM**；行尾 **LF**；**0 个 U+FFFD**；行尾无多余空格；文件末尾恰好一个换行。
- 体积预期：**6,000–12,000 B**（明显超出说明掺水，明显不足说明漏节）。
- 写完自检（PowerShell，只读）：

```powershell
$p = "D:\OpenCodeWorkspace\ETIM-Extra\README.md"
$b = [IO.File]::ReadAllBytes($p)
$t = [Text.Encoding]::UTF8.GetString($b)
"bytes=$($b.Length) first=0x$($b[0].ToString('x2')) CR=$((($t.ToCharArray() | Where-Object { $_ -eq "`r" }).Count)) FFFD=$((($t.ToCharArray() | Where-Object { $_ -eq [char]0xFFFD }).Count)) lines=$(($t -split "`n").Count)"
```

- 期望：`first=0x23`（`#`）、`CR=0`、`FFFD=0`。**不得用 `Set-Content`／`Out-File` 写**（会加 BOM）；用 `[IO.File]::WriteAllText($p, $text, (New-Object Text.UTF8Encoding($false)))`。

## 八、回执格式（≤30 行，直接贴回）

1. 文件：路径／bytes／lines／first byte／CR／FFFD（照 §七 实测值）。
2. 节清单：十一节逐节 ✓（只列节名，不贴正文）。
3. 红名单自检：五件 id／耐久／附魔度逐项 ✓；派生标注中英各一处 ✓。
4. 过期信息核对：旧文案 “mithril and adamantium” 已清除 ✓；`use_mixins` 状态改为 **true / MixinBooter 11.13 / 无 mixin 类** ✓；配置节由 1 键扩为 6 键 ✓。
5. 待裁决：`gradle.properties` 的 `mod_description`（旧文案，未动）——列一行即可；无其它则写「无」。
6. 声明：未执行 git／未构建／未改其它文件。

## 九、附注（只读参考，禁改）

- 现有 `README.md`（2,967 B，74 行）可整篇重写，不必保留旧句子；但旧文里的技术事实（JDK 25 起 Gradle、Java 8 toolchain 跑 MC、dev classifier、run/mods 禁忌、RCON B-EXTRA-2）均已核实，可沿用。
- 判据与回执：`playground/audit/extra-shield-落码批文.md`（W-1…W-8）、`extra-shield-补种批文.md`（W-9…W-15）、`playground/audit/audit-extra-裁定回执.md`（条 1–24）、`testharness/reports/` 五份回执。
- 本任务书本身不需要你修改或提交。
