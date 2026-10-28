# ETIM-Extra 盾面补种 · 真实合成窗「独立复跑」判决回执（W-13 / W-14）

> **执行方**：会话七（验证窗执行）｜**委托方**：主会话「ETIM开发」｜**日期**：2026-10-28
> **复跑对象**：盾面补种「真实合成消耗 6 锭」窗（W-13 六锭门 / W-14 五金属真实合成）＝**换执行方的同判据复跑**。
> **判据正本**：`playground/audit/extra-shield-补种批文.md` §3（W-13 / W-14）＋ §4 验收线。
> **对照基线**：`testharness/reports/extra-shield-craft-verdict.md`（主会话 2026-10-28 21:39–21:41，tag `15-shield-craft`）。
> **钉值**：jar **30,259 B @ 2026-10-28 21:32:34**｜SHA256 `A223DB6D…F44B9A93`｜产品 commit `7f6c472`（HEAD 起窗 `0cde63f` / 收口 `207aa42`：窗内主会话只提交了 2 个 `playground/audit/` 文档，产品码 0 改动）｜窗内 **0 rebuild**（起收逐位同值）。
> **结论**：W-13 ✓、W-14 ✓（五腿全 PASS）｜判点 ✗ **0**｜冲突 **A 0 / B 0 / C 3**｜与基线逐项同值 ⇒ **复跑通过**。
> **报告字节规格**：`10,114 B｜UTF-8 无 BOM｜LF｜0 U+FFFD｜✓ 22 / ✗ 6｜116 行`

---

## 零、钉值与前置（逐位）

| 项 | 任务书钉值 | 起窗实测（21:46:01） | 收口实测（21:47:57） | 判 |
|---|---|---|---|---|
| jar 字节数 | 30,259 B | **30,259 B** | **30,259 B** | ✓ |
| SHA256 | `A223DB6D…F44B9A93` | `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93` | 同值 | ✓ 逐位 |
| jar mtime | 2026-10-28 21:32:34 | **21:32:34** | **21:32:34** | ✓ |
| 窗内 rebuild | 禁止 | `> Task :jar UP-TO-DATE`（任务表原样），仅 `:runServer` 实跑 | 字节·SHA·mtime 全同 ⇒ **0 次** | ✓ |
| HEAD | 记 | `0cde63f` | `207aa42`（`git diff --name-only 0cde63f..HEAD` = 2 个 `playground/audit/` 文档；产品码 0） | ✓ 范围外仅文档 |
| 端口 25565 | 空闲 | `Get-NetTCPConnection` = **0** | `netstat -ano` 无 LISTEN（收口瞬间有 1 条假人连接残留的 TIME_WAIT，已过期） | ✓ |
| 崩溃报告 | 0 | `run/crash-reports` 目录不存在（0） | **0** | ✓ |
| 追踪脏值 | 产品码 0 | 窗闭 `git status --porcelain` = **0 条** | 回执落盘后 **+1 条 `??`**（本文件）；产品码 / 资源 / `build.gradle` 0 改动 | ✓ |

### 0.1 窗口前置

| 文件 / 项 | 键 / 值 | 窗内 | 处置 |
|---|---|---|---|
| `run/ops.json` | `ETIM_Harn07` | `adc802b5-52f3-38ac-8104-89e5d1a54331` level **4** | 已在位，未改（`/give` `/setblock` `/etest` 前置） |
| `run/config/etim.cfg` | `craftingDebugLog` | **true** | 开窗置 true、收口还原 **false**；回读 SHA 与窗前同值 `44E368E5…AE9F2E`（30,629 B，mtime 21:42:28 < 窗口） |
| `run/config/etim.cfg` | `craftingTimer` / `hungerCraftDeny` / `craftingSkipCreative` | **true / true / true** | 产品默认，未改 |
| 模式 | 假玩家 gamemode | **Survival Mode**（21:46:22 `Set ETIM_Harn07's game mode to Survival Mode`；服务器 `Default game type: SURVIVAL`） | 驱动置 `gamemode 0`，保证走主 mod 计时器而非创造直出 |
| 饥饿 | 每 10 s `etest food 6 6` | 全窗 `food_set_pool … params=[6, 6, 6]` | 防 `hungerCraftDeny` 冻结进度 |

> 窗内起停服全部走 **控制台 stdin**（`server/server-console.js`），未用 RCON / `save-all`。

## 一、W-13 六锭门（铜盾腿，数量敏感）

| 摆料 | 结果槽（服务端权威读回） | 服务端日志 | 判读 |
|---|---|---|---|
| 5 格（`X X` / `XXX` / `_ X _`，缺右下） | **null**（21:46:31.810） | 21:46:29 `result CHANGED sig=etim:nugget_copper#0×9 prev=none` → 同秒 `result gone → reset`；**无盾行** | 5 锭不出盾 |
| 补第 6 锭（格 8，21:46:32.410） | `type=4262` ×1 | 21:46:32 `result CHANGED sig=etimextra:copper_shield#0×1 prev=empty`；`period SET difficulty=150.0 … period=102` | 第 6 锭才出盾 |

⇒ 与基线同结论：配方是**恰好 6 锭**的固定形状，不是「≥5 锭」。中间态 `etim:nugget_*#0×9` 见 §五 C-1。

## 二、W-14 真实合成消耗 6 锭（五金属逐腿）

前置：每腿 `/clear` + `/give <锭> 6`（`before` 均为 `unknown×6`，数值 type id 见「锭 id」列）。

| 金属 | 锭 id | 结果槽产物（服务端 `sig`） | 库存差 | 完成行（`[CraftingLog]`） | 判 |
|---|---|---|---|---|---|
| 铜 copper | 4101 | `etimextra:copper_shield#0×1` | 锭 6→0、盾 0→1（**−6 / +1**） | `21:46:39 COMPLETE Copper Shield ×1 quality=AVERAGE xp=0 continue` | ✓ |
| 银 silver | 4102 | `etimextra:silver_shield#0×1` | −6 / +1 | `21:46:56 COMPLETE Silver Shield ×1 quality=AVERAGE xp=0 continue` | ✓ |
| 远古金属 ancient_metal | 4105 | `etimextra:ancient_metal_shield#0×1` | −6 / +1 | `21:47:14 COMPLETE Ancient Metal Shield ×1 quality=AVERAGE xp=0 continue` | ✓ |
| 秘银 mithril | 4103 | `etimextra:mithril_shield#0×1` | −6 / +1 | `21:47:32 COMPLETE Mithril Shield ×1 quality=AVERAGE xp=0 continue` | ✓ |
| 艾德曼 adamantium | 4104 | `etimextra:adamantium_shield#0×1` | −6 / +1 | `21:47:49 COMPLETE Adamantium Shield ×1 quality=AVERAGE xp=0 continue` | ✓ |

- **产物身份**：五腿 `sig` 各自是本金属盾（不是同一件、不是锭、不是粒），逐条可 grep；`COMPLETE` 行带真实显示名，与 `sig` 双证。
- **消耗**：五腿 `consumed=6 && gained=1` 全成立（`16-shield-craft-rerun-evidence.json` 逐腿 `beforeCraft` / `afterCraft`）。
- **品质面**：`quality=AVERAGE xp=0` 五腿一致 —— 盾不是品质载体（裁 T-4），若哪天误入品质表，此行会变 AVERAGE 以外或 `xp≠0`。

## 三、路径与生命周期

| 判点 | 实测 | 判 |
|---|---|---|
| 走主 mod 计时器（每腿三行齐） | 5 × `result click btn=0`（21:46:34 / 51 / 47:09 / 26 / 44）→ 5 × `start crafting difficulty=150.0 quality=AVERAGE period=102` → 5 × `COMPLETE … continue`；`period SET` 共 10 行（每腿 2：粒 25 tick、盾 102 tick） | ✓ |
| 难度算式 | `difficulty=150.0` = 6 × 通用 25（etim 锭无专行）；`period=102` 由主 mod 计时器算出，驱动等满 `period×50 ms + 4 s` | ✓ |
| 生命周期 | 21:46:20 `Done (0.535s)!` → 21:47:56 `Stopping the server` → `Saving worlds` → gradle **BUILD SUCCESSFUL in 1m 44s**，驱动退出码 **0** | ✓ |
| 异常面 | 本 mod 日志 0 条 ERROR / Exception；`WARN` 仅 Gradle native-access、MixinBooter `MCVersion` 注解、FML Maven 目录格式（均环境既有噪声，与产品无关） | ✓ |
| 工作区 | `run/mods` 仅 asm / mixinextras 依赖，未被产品 jar 污染；`run/` 不入版本库；假玩家库存/工作台均一次性 | ✓ |

## 四、与基线逐项对照（同 / 异）

| 项 | 基线 `15-shield-craft`（主会话） | 本窗 `16-shield-craft-rerun`（会话七） | 同 / 异 |
|---|---|---|---|
| 钉值 | 30,259 B · `A223DB6D…` · 21:32:34 | 同三值，起收逐位 | **同** |
| W-13 5 格 / 6 格 | 空 / `type=4262` | null / `4262`，且服务端行 `prev=empty` | **同** |
| W-14 五腿库存差 | 5 × −6 / +1 | 5 × −6 / +1 | **同** |
| 产物 sig | 5 条本金属盾 | 同 5 条 | **同** |
| 计时器行 | `difficulty=150.0` `period=102` | 同值 ×5 | **同** |
| `COMPLETE` 品质 | `AVERAGE xp=0` ×5 | 同 ×5 | **同** |
| 生命周期 | Done → stop → Saving，退出码 0 | 同，退出码 0 | **同** |
| 0 rebuild | 是 | 是 | **同** |
| 中间态 | `etim:nugget_*#0×9` | 同（C-1） | **同** |
| 执行方 | 主会话 | **会话七** | 异（复跑目的） |
| 配置写入路径 | 主会话自述改键 | 见 C-3：起窗写 true 时引入 BOM 与注释字符损坏，收口用窗前字节副本整体还原 | 异（仅工装面，不改判值） |

## 五、冲突分级（A 0 / B 0 / C 3）

### A 级（产品码缺陷）：**0 条**

五腿行为与批文 §3 判点逐条相符，无需改动、无需 rebuild。

### B 级（数值无行）：**0 条**

每个判点都有可 grep 的日志行：`result CHANGED`（5 盾 + 5 粒）、`start crafting` / `COMPLETE`（各 5）、库存前后读数（逐腿进 evidence.json）。

### C 级（工装／口径说明）：**3 条**

1. **C-1（中间态粒配方）** 逐格摆料时结果槽会短暂出现 `etim:nugget_*#0×9`（1 锭 → 9 粒分裂配方），是「一次只放 1 个」的副产物；5 格采样点为 `null`、服务端在 6 锭落位前无盾行，故不干扰 W-13。
2. **C-2（物品名 unknown）** mineflayer 把 mod 物品名解析为 `unknown`，库存断言按数值 type id（锭 4101–4105 / 盾 4260–4264），产物身份按服务端 `sig=` + `COMPLETE` 显示名双证。
3. **C-3（配置写入编码）** 起窗把 `craftingDebugLog` 改 true 时走 PowerShell 默认编码读写，给 `etim.cfg` 加了 BOM 并把注释里的非 ASCII 箭头写成替换字符（30,629 → 30,672 B）；键名/键值全 ASCII，故窗内解析正常（`[CraftingLog]` 行即证）。收口用**窗前字节副本**整体还原，回读 SHA `44E368E5F2972EC05386FDB82A5D8F6BC532F163D94165D3C3F8795F63AE9F2E`（30,629 B，mtime 21:42:28）与窗前逐字节同值。

## 六、产物与落盘

| 产物 | 字节 | 说明 |
|---|---|---|
| `testharness/build-logs/16-shield-craft-rerun.out` | 81,832 | gradle + 服务端全量（含 Done/Stopping/Saving/BUILD SUCCESSFUL） |
| `testharness/build-logs/16-shield-craft-rerun-evidence.json` | 5,210 | 逐腿判据（`fiveSlotResult` / `sixSlotResult` / consumed / gained / 判行原句 / stop 退出码） |
| `testharness/build-logs/16-shield-craft-rerun-driver.out` | 11,120 | 驱动日志（窗口时间轴、摆料、等待、`VERDICT PASS`） |
| `testharness/build-logs/16-shield-craft-rerun-pin.txt` | 367 | 起窗钉值档（字节/SHA/mtime/HEAD/端口/崩溃数） |
| `testharness/build-logs/16-etim.cfg.before` | 30,629 | 窗前 `etim.cfg` 字节副本（收口还原源，SHA 见 C-3） |

> 判据口径：通过 ✓、不通过 ✗；**判点 ✗ = 0**。本报告的 ✗ 仅出现在「判点 ✗ = 0」这类否定式陈述与规格行自指中，正文实判 0 项 FAIL。
