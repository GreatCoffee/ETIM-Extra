---
name: etim-verification
description: ETIM-Extra 验证窗执行与判决回执专家：钉值基线、W 判点核讫、日志判据通道设计、RCON/假人通道分工、冲突分级与 A 级修复后的单点回归。当任务涉及 ETIM-Extra 的实测验证、验证窗、判决/重验回执、测试工装（runServer+RCON+mineflayer）编写改造、判据通道设计或回归重验时使用。
---

# ETIM 验证窗执行指南

> 快照来源：主 mod 项目 `.opencode/skills/etim-verification/SKILL.md`（14,104 B，2026-10-28 抄录；主项目后续更新不自动同步，diff 以此为基线）。

面向「验证窗执行方」（会话七）与任何要落判决回执的实测任务。核心不是「测了没」，而是**每个判点都能落到一行可 grep 的日志，且报告字节可复核**。

## 0. 角色与边界

| 角色 | 负责 | 禁止 |
|---|---|---|
| 验证窗执行方 | 起停服、RCON、假人、日志判读、工装脚本、报告落盘 | 改产品码、git 收口、裁判决议 |
| 主会话 | 派单、裁定 A/B/C、派修、git 收口 | 长窗干等（交验证窗） |
| 用户 | 客户端鼠标键盘、肉眼判据转述 | — |

- 输入四件套：**判据正本**（`playground/audit/<批>-落码批文.md`）、**钉值**（jar 字节+SHA+commit）、**窗口时长**、**落盘路径**。
- 输出两件：① 报告 `testharness/reports/<批>-verdict.md`（结构见 §8 与 `templates/verdict-report.md`）；② **转达块**——给主会话/其他会话的内容一律以围栏代码块交付（铁律 7），块外只写一句落盘路径。
- 客户端面判据一律由用户操作并原文转述；AI 不得控鼠标键盘、不得拉窗抢焦点。客户端 HUD 只作开发参考。ETIM-Extra 内裸称「会话X」含义与主项目不一致时，以 ETIM-Extra 主会话发布的『身份与关系硬规定 v2』为准。

## 1. 七条铁律

1. **日志为据**（AGENTS §9）：判点必须对应可 grep 行。没有通道 → 先造通道（纯工装可直裁），或明确登记「代码锚」并说明为何不可日志化；不得用截图/手感替代。
2. **钉值先行**：起服前记 `jar 字节 + SHA256 + mtime + commit + 世界名`，收口复核同值 → 证明 **0 rebuild**。窗内 HEAD 前进但未 rebuild 必须登记（jar 与 HEAD 不再一一对应）。
3. **一次 rebuild 一个指纹**：验证窗内禁 rebuild；要改 Java 就换窗口。
4. **判点独立**：一个判点 = 一个判据表 + 一段判行原句 + 一个可独立重跑的 driver phase。
5. **判负不改判据**：FAIL 就是 FAIL；根因只写「假设 + 证据 + 修法方向」，阈值/样本量不动，口径冲突进 C 级待裁。
6. **先样本后结论**：样本量开窗前定死（手气面 ≥20~30/类），不边跑边加；分布类给统计量（χ²、p），不可达面写「不可达」而非「0 次」。
7. **转达即围栏**：凡需要用户转达给其他会话的内容（判决回执摘要、任务书、待裁决位、派修指令、口径变更），必须单独输出为一个**围栏代码块**（```` ```markdown ```` 起），可整块复制粘贴；块内自足（钉值、判点、路径、验收口径齐全），不依赖块外上下文。块外只留一句「已落盘：<路径>」，不得用散文/裸表格散落正文让用户手工摘抄。

## 2. 判据通道速查（本项目现役）

| 通道 | 判什么 | 典型行 |
|---|---|---|
| `[ExtraLog]` | 本项目载入/盾面判行（独立于主 mod 通道） | `preInit`、`boot ok - side=… etim=… etimextra=…` |
| `[TestLog]` | boot/注册/客户端模型面 | `item model registry: 164 etim items`、`Done (1.214s)` |
| `[EtimTest]` | dev 命令回执 | `/etest` 各子命令 |
| `[AILog]` | 消散/召唤/狂化/属性 | `mob despawn kill counter=…`、`bonelord summon … num=` |
| `[MobLog]` | 怪物装备/载体行 | `mob lord equip … weapon=`、`mob troop equip … type=`、`mob weapon … villager=true` |
| `[SpawnLog]` | 自然生成/密度/cap | `accept ETIMEntityX at (…)`、`cap-class … count=N → abandon chunk` |
| `[MiningLog]` | 采集门/破速/耐久衰减 | `tool decay face=breaking item=… block=… loss=2` |
| `[FoodLog]` / `[IngestLog]` | 饥饿池/进食路由 | `base=` 分解行 |
| `[CraftingLog]` / `[FurnaceLog]` | 合成周期/熔炉门 | deny/start/complete |
| `[DeathLog]` / `[SleepLog]` / `[WeatherLog]` / `[OreLog]` | 死亡链/床/天气/矿物 | 见各批批文 |
| `[client]` / `[server]` 尾标 | **尾标本身不可当判据**：由线程名推断，RCON 线程会被标成 `[client]`；判值看行内字段 | — |

> 通道由主 mod `ETIMConfig` / 本项目 `ETIMExtraConfig` 的 dev 开关控制；`[ExtraLog]` 的两行载入判行不设开关（见 `ETIMExtraLog` 类头），后续盾面判行挂 `extraDebugLog`。非本批判点的通道开窗前关掉，避免淹日志（`frenzy set` 可 15 行/秒、`density-eval` 每 tick 一行）。

## 3. 开窗前：判点表

把批文每条判据抄成表（禁止边测边补）：

| 列 | 要求 |
|---|---|
| W# | 稳定编号，重验沿用 |
| 判据 | 一句话可判真假 |
| 钉值 | 阈值/分布/上限（引批文原句） |
| 通道 | 哪个 `[XxxLog]`、哪几个字段 |
| 样本量 | 固定值；手气面写清每类 |
| 判定式 | 例：`type2 ≥ 5/33`；`num ≤ 6 且 max=6` |
| 前置 | 时间/难度/坐标/装备/gamerule |

同时确认：世界名、`online-mode=false`、op 端点、`time set`、`difficulty`、`gamerule doDaylightCycle`、以及**测试者是否会在线**（在线会改密度门/玩家距离门，必须写进报告）。

## 4. 通道分工（踩过的坑，全是实证）

### 4.1 RCON vs bot chat

Minecraft 1.12 的 RCON 发送者**没有实体位置**，凡以发送者位置为基准的语义全部失效：

| 面 | RCON | bot chat（服务端线程） |
|---|---|---|
| `@e[r=N]` / `@e[dx=…]` | ✗ 统计原点附近 | ✓ |
| `/kill @e[r=]`、空间 `/testfor`、`/execute … run` | ✗ | ✓ |
| `/summon`、`/gamemode`、`/effect`、`/tp` 断言 | 位置面 ✗ | ✓ |
| `gamerule` / `time set\|add\|query` / `save-all` / `stop` / 无位置全维 `testfor` | ✓ | ✓ |

**更硬的坑**：RCON 线程连续 `summon/kill` 批量改实体表 → `ConcurrentModificationException @ Chunk.getEntitiesWithinAABBForEntity` **崩服**（崩溃报告无 Mixin 帧 = 非 mod 缺陷）。批量实体/方块改动一律走 chat 面；出报告时登记为 harness 手法面 C 级。

### 4.2 召唤/取样

- **带 NBT 的 `/summon` 不跑 `onInitialSpawn`**：`{Tags}` / `{PersistenceRequired:1b}` / `{CustomName}` → 手空甲空、0 条 `[MobLog]`。装备/属性面**必须裸召唤 + 类型选择器选主**，否则假 FAIL。
- 同点批量敌对召唤会互殴/摔死：加 `{NoAI:1b,Silent:1b}`，或分批 + 假人在线覆盖密度求值拍。
- 每样本前 `kill @e[type=…]` 清场会连带清掉用户手动召唤的实体（登记 C 级，并在任务书提醒用户窗口外召唤）。
- 同名 bot 互踢（`duplicate_login`）：并行用不同账号或错峰；**heartbeat 还在打 ≠ 在线**。
- 读取实体状态优先 `entitydata @e[tag=…,c=1] {}`（用专属 Tags 选主，`c=` 是 1.12 语法，`limit=` 是 1.13+）。

### 4.3 假人侧噪声

- modded item 的 `bot.dig` 时长计算不稳，且作物放在非 farmland 会下一 tick 自落 → **数值以服务端行为行为准**，不靠逐株耐久 delta。
- 假人退场产生 `NetworkDispatcher exception / 远程主机强迫关闭`：连接层噪声，与 mod 异常分列。
- node 时间戳是 UTC，服务端日志是 CST，差 8 h；对齐时只认日志行首时刻。

### 4.4 计数语义

- 先读源码确认计数是「类内计数」「chunk 桶计数」还是「per-pass 重置」——`cap-class count=3` 是 chunk 级共享桶（under/over 两桶），不是类内计数，`count=3` 反而更严。
- 同一实体多行先按 `entity=… #id` 去重；`hold=summoned` 这类行有签名去重，行数=事件数。
- 自然窗的低概率分支（<1%）不要硬等：用**等价生成路径**（裸 `/summon` 走同一条 `onInitialSpawn` 装备链）×N 取证，自然窗只作机会面登记。

## 5. 工装矩阵

| 场景 | 起点脚本 | 说明 |
|---|---|---|
| 通用多相位 driver | `testharness/player/mobv-run.js` | phase 参数化，`w1..w10`；含 RCON+chat 双通道与 `say()` 时间锚 |
| 移动/船水 | `move-run.js` / `bw-run.js` | M0-M5 / B0-B9 相位与原语 |
| 掉落/方块/铁砧 | `anvil-run.js`、`b1-run.js`、`b3-run.js`、`sp3-run.js` | 大脚本，按相位挑用 |
| 日志全域检索 | `mobv-grep.js <regex>` | 含 `.gz` 归档 |
| 通道计数扫描 | `mobv-logscan.js` | 逐档统计各通道命中 |
| 证据摘录 | `mobv-evidence.js` | 按 W 分组计数 + 样例 → `build-logs/<tag>-evidence-rows.txt` |
| RCON | `rcon-client.js 127.0.0.1 25575 etim27 "<cmd>"` | `rcon.py` 有 auth 判型 bug，不用 |
| 起服 | `testharness/server/start-server.ps1` | fail-fast：etim jar 在 mods、compat gate |
| 关客户端 | `testharness/client/close-client.ps1` | WM_CLOSE → 等 `Stopping!` → 可 `-Snapshot` |

工装纪律：
- driver 落 `testharness/player/<批>-run.js`；每加相位 `node --check`。
- PowerShell 里改 JS 用**独立 patch 脚本**（`.replace`/行级插入），不要在内联 `node -e` 里堆引号（引号地狱已多次翻车）。
- 长输出落 `build-logs/`：`<tag>-w<N>-run.out`、`<tag>-driver.log`、`<tag>-session-final.log`、`<tag>-evidence-rows.txt`；对话只读尾部。
- 起服/长窗用 background + 无 timeout；shell 前台超时会树斩子进程。

## 6. 执行与取样

1. 起服 → 判 `Done (…)`、端口 25575 LISTEN、`[TestLog]` boot 行、mixin 失败三型（`Mixin apply failed` / `MixinException` / `InvalidMixinException`）全 0。
2. 每 phase 开头 `say('<W> begin ts=…')`，中间每 15~65 s 打一次现值快照（`num=`/`accept=`/`kill=`），结束打 `end`。
3. 每 W 结束立刻抽判行入 evidence 文件；不要等全窗结束再回捞（日志会滚）。
4. 概率面：逐样本读 NBT → 落 JSON → 算分布/χ²；不要用 `[MobLog]` 行数近似（会被手动召唤/历史行污染）。
5. 上限/计数面：同时给「事件行序列」和「当前 NBT 值」，两者同向才算证成。
6. 客户端面（tooltip/模型/渲染）：用户操作 + 原文转述；日志侧只做辅助（`item model registry` 行、缺失纹理噪声计数）。

## 7. 收口

> **ETIM-Extra 停服口径（B-EXTRA-2，账本条 7）**：原版 1.12.2 RCON 一条连接只能承载一个包（auth 应答后即断连），`save-all` / `stop` 走 RCON 必失败。本项目用 `testharness/server/run-server.ps1`——起服时把 `stop` 写进服务端 stdin，判据是 `Stopping the server` / `Saving worlds` / 端口归零。下面的 RCON 段是主 mod 项目的链，只作对照。

```powershell
# 1) 快照证据（先于停服，避免文件占用）
node testharness\player\mobv-evidence.js
Copy-Item run\obfuscated\logs\latest.log build-logs\<tag>-session-final.log -Force

# 2) 优雅停服
node testharness\player\rcon-client.js 127.0.0.1 25575 etim27 "save-all"
node testharness\player\rcon-client.js 127.0.0.1 25575 etim27 "stop"
# 等日志落：Saving worlds / Unloading dimension 0 / 进程退出 / 端口 0

# 3) 钉值复核
(Get-Item build\libs\etimextra-<版本>.jar).Length
(Get-FileHash build\libs\etimextra-<版本>.jar -Algorithm SHA256).Hash
(Get-NetTCPConnection -LocalPort 25575 -ErrorAction SilentlyContinue | Measure-Object).Count
```

- 客户端：出交付书前先关（`close-client.ps1`），等 `Stopping!` + Gradle `BUILD SUCCESSFUL`；**禁 taskkill 直杀**（日志缺 `Stopping!`）。
- 崩溃面：若中途崩服，登记崩溃报告文件名 + 栈帧归属（有无 Mixin/ETIM 帧），并说明哪些窗因此不计入负证。
- 工作区：产品码/资产 0 改动；未跟踪的 harness 脚本与报告列清单交主会话收口。

## 8. 报告字节规格（机械核讫）

- 硬指标：UTF-8 **无 BOM**（首字节 `0x23`）、**LF**（0 个 `\r`）、0 个 U+FFFD、✓/✗ 计数、字节数、行数。
- 头部写一条**自指**固定点，迭代到稳定：
  `> **报告字节规格**：`25,362 B｜UTF-8 无 BOM｜LF｜0 U+FFFD｜✓ 37 / ✗ 9｜354 行``
- 落盘后必须跑 `scripts/report-spec.js <报告路径>` 复核（去 BOM、重算固定点、报占位符/CRLF/FFFD）。
- 只信字节，不信编辑器：编码错、BOM、CRLF 是最常见的打回原因。
- 占位符（`<<W2_TOTAL>>`、`@@SPEC@@`）必须清零后再交付。

## 9. 冲突分级（固定口径）

| 级 | 定义 | 必须写清 |
|---|---|---|
| **A** | 判点 FAIL 且需产品码改动（= 要 rebuild） | 证据（样本/概率）、根因假设、修法方向、重验范围 |
| **B** | 判定通道缺口：无法区分「未发生」与「被拒」 | 建议补的行文案（字段要能判真假） |
| **C** | 登记不阻塞：噪声通道、口径冲突、harness 手法面、资产/视觉债、程序性提示 | 影响面（哪些窗/判点不受影响） |

分级只决定「能不能闭单」，不改判点结论。A 级一律进「待主会话裁决位」并给二选一修法。

## 10. 回归与重验

- A 级修完：**只重验失败判点 + 相邻链回归**（例：<W-a> 兵团 type 分布 + <W-b> 召唤链），不全窗重跑。
- 新窗口重新钉值（新 jar = 新字节/SHA/commit），旧钉值作废。
- 文件命名：重验 `-reverdict.md`；补充取样 `-retest.md`；资产跟进 `-followup.md`。
- 重验表只列受影响判点；未动面写「上轮 PASS，本轮未动 + 上轮锚点（文件/字节/行）」。
- 修完仍不可观测 → 判点从 A 降为 B（通道问题），并给出下一轮取证方案。

## 11. 交付前自检

- [ ] 钉值起收同值，rebuild = 0；HEAD 变动已登记
- [ ] 每个 W 有判据表 + 判行原句 + 判定
- [ ] FAIL 有全库复核（历史窗 + 本窗），不是单窗运气
- [ ] 样本量达标，统计量给出
- [ ] 0 占位符；字节规格行自洽
- [ ] 无 BOM / 无 CRLF / 0 U+FFFD；✓/✗ 计数与正文一致
- [ ] 客户端已优雅关闭（若起过）；端口 0
- [ ] 证据快照 + evidence rows 已落 `build-logs/`
- [ ] 冲突分级 A/B/C 齐；A 有修法方向与重验范围
- [ ] 待裁决位逐条列出
- [ ] **给其他会话的内容已单独落围栏代码块（铁律 7），块外只有落盘路径一句**
- [ ] 未跟踪文件清单交主会话

## 12. 参考

- 报告模板：`templates/verdict-report.md`
- 字节规格校验：`scripts/report-spec.js`
- 判据正本：`playground/audit/<批>-落码批文.md`；账本：`playground/audit/audit-extra-裁定回执.md`
- 工装 README：`testharness/{player,server,client}/README.md`（本项目；当前仅 `testharness/server/README.md`）
- 样本回执（主 mod 项目，只读参照）：`testharness/reports/mob-revenant-bonelord-verdict.md`（W1–W10 全套）、`metal-anvil-blocks-verdict.md`（W1–W9 + 资产面）、`spawn-cycle-02-verdict.md`（通道事故档）
