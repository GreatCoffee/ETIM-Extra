# ETIM-Extra 盾面补种 · 会话七独立复跑任务书（W-13 / W-14）

## 一、抬头

- 委托方：ETIM-Extra 主会话
- 执行方：会话七（测试执行）
- 项目根：`D:\OpenCodeWorkspace\ETIM-Extra`
- 复跑对象：盾面补种「真实合成消耗 6 锭」窗 —— W-13（六锭门）／W-14（五金属真实合成）
- 判据正本：`playground/audit/extra-shield-补种批文.md` §3（W-13／W-14）＋ §4 验收线
- 对照基线：`testharness/reports/extra-shield-craft-verdict.md`（主会话 2026-10-28 21:39–21:41 回执）

## 二、背景

W-9／W-10 只证明「注册表里有一条 6 格配方、材料是锭、产物是盾」，证明不了合成动作可执行、6 锭真被吃掉。W-13／W-14 用 mineflayer 假玩家在**生存模式**开工作台、逐格摆 6 锭、左键结果槽 arm 主 mod 的 R196 计时器，等计时走完再读库存差。

主会话已跑通（五腿 PASS，`0 rebuild`）。本次为**独立复跑**：同一工装、同一判据，换执行方，用于排除执行方偏差。**不改判据、不改产品码、不改工装**；判负即回主会话，不在窗内修码。

## 三、钉值（复跑前先核，不一致即停并回报）

| 项 | 值 |
|---|---|
| 产品码 commit | `7f6c472`（五种金属盾落码；其后仅文档／工装提交） |
| jar | `build/libs/etimextra-0.1.0.jar` **30,259 B** |
| SHA-256 | `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93` |
| mtime | 2026-10-28 21:32:34 |
| 要求 | **0 rebuild**：窗内不得重跑 jar／reobf；jar 指纹不符即停，不在窗内重建 |

## 四、前置

1. 端口 **25565 空闲**（无其它 runServer／客户端）；`run/crash-reports` 记下窗前文件数。
2. `run/ops.json` 含 `ETIM_Harn07`（离线 UUID `adc802b5-52f3-38ac-8104-89e5d1a54331`，level 4）——假玩家要 `/give`、`/setblock`、`/etest`。
3. `JAVA_HOME=C:\Users\GreatCoffee\tools\jdk-25.0.4.1+1`；node ≥ 18（本机 v24.21.0）。
4. `run/config/etim.cfg`：窗内 `B:craftingDebugLog=true`；`craftingTimer=true`、`hungerCraftDeny=true`、`craftingSkipCreative=true` 保持默认。收口必须改回 `craftingDebugLog=false`。
5. **必须生存模式**：`craftingSkipCreative=true` 会让创造模式跳过主 mod 计时器，只能证明「格子出产物」，验证不了「真实合成」。

## 五、执行（一条命令）

    $env:JAVA_HOME='C:\Users\GreatCoffee\tools\jdk-25.0.4.1+1'
    cd D:\OpenCodeWorkspace\ETIM-Extra\testharness\player
    node extra-shield-craft.js 16-shield-craft-rerun *> ..\build-logs\16-shield-craft-rerun-driver.out

- tag 固定 `16-shield-craft-rerun`，**不得复用** `15-*` 产物（保证判据本窗新生成）。
- 驱动自起服务端（`server/server-console.js`，stdin 通道）→ 登录假玩家 → 五腿逐跑 → 收口 `stop`。
- 退出码 `0` = 五腿全 PASS；`1` = 有腿失败（驱动日志里有 `[W-14] … FAIL`）。

## 六、判点（逐点核讫，反例即 ✗）

| 判点 | 预期行／现象 | 正／反 |
|---|---|---|
| **W-13** 六锭门（铜盾腿） | 只摆 5 格 → 结果槽 `null`；补第 6 锭 → 结果槽类型 = 铜盾（服务端 `result CHANGED sig=etimextra:copper_shield#0×1`） | 正：5 空 6 有；反：5 锭即出盾／6 锭仍空 |
| **W-14** 五腿真实合成 | 每腿库存 **锭 6→0、盾 0→1**；`[CraftingLog] … COMPLETE <本金属盾名> ×1 quality=AVERAGE xp=0` | 正：五腿全对；反：任一腿锭不少、盾不出、`quality≠AVERAGE`、`xp≠0` |
| **路径** 走主 mod 计时器 | `result click btn=0` → `start crafting difficulty=150.0 quality=AVERAGE period=102` → `COMPLETE … continue` | 正：三行齐；反：无 `start crafting`（没走计时器） |
| **生命周期** | `Done (` → `Stopping the server` → `Saving worlds`，退出码 0，0 新 crash-report | — |
| **钉值** | 起窗／收口 jar 30,259 B、SHA 同值 | 反：jar 变化（窗内 rebuild） |

## 七、落盘与验收

1. 证据（本窗新生成）：`testharness/build-logs/16-shield-craft-rerun.out`、`16-shield-craft-rerun-evidence.json`、`16-shield-craft-rerun-driver.out`。
2. 回执：`testharness/reports/extra-shield-craft-rerun-verdict.md`，必须含：钉值（起窗／收口逐位）、W-13 两态、W-14 五腿表（金属／结果槽 sig／consumed／gained／COMPLETE 行）、与基线 `extra-shield-craft-verdict.md` 的逐项对照（同／异）、冲突分级 A／B／C（A = 产品码缺陷，B = 数值无行，C = 工装／口径说明）。
3. 收口还原：`run/config/etim.cfg` 的 `craftingDebugLog` 改回 `false`；假玩家库存／世界改动均在 `run/`，不入版本库。
4. 验收：五腿 PASS ＋ W-13 两态对 ＋ 0 rebuild ＋ 优雅停 ⇒ 「复跑通过」；任一反例 ⇒ 回主会话，**不在窗内改值**。

## 八、附注

- 已知中间态：逐格摆料时结果槽会短暂出现 `etim:nugget_*#0×9`（1 锭→9 粒的分裂配方），属正常；5 格时为空、6 格时才出盾。
- mineflayer 对 mod 物品名解析为 `unknown`：库存断言按数值 type id，产物身份按服务端 `sig=`／`COMPLETE` 行。
- 合成周期 `period=102` 由主 mod 计时器按 `difficulty=150.0`（6 × 通用材料 25，`CraftingDifficulty` 对 etim 锭无专行）算出；驱动等 `period×50 ms + 4 s`。
- 全窗每 10 s `etest food 6 6`，防 `hungerCraftDeny` 把进度冻结（冻结不是清零）。
- 主会话若又有文档提交导致 HEAD 前进，不影响本窗：产品码 commit 仍是 `7f6c472`，以 jar 指纹为准。
