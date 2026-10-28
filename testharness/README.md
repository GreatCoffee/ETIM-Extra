# testharness（ETIM-Extra 测试面）

按 2026-10-28 跨项目裁定：自动化测试执行方 = 主 mod 项目会话七；**工装源码一律落本项目**，主 mod 项目 `testharness/README.md` 只留一行索引。

## 目录约定

| 路径 | 用途 |
|---|---|
| `testharness/build-logs/` | 起服/构建长日志（git-ignored，不进对话） |
| `testharness/server/` | 起服/优雅停服脚本、`server.properties` 模板、RCON 客户端 |
| `testharness/player/` | mineflayer bot 判点驱动、配置切换 |
| `testharness/reports/` | 判决报告（数值与判据正本仍在 `playground/audit/`） |

## 现有判据通道

- `[ExtraLog]`（服务端日志）：`preInit` 一行；`init` 一行 boot 断言 `side=… etim=<版本> etimextra=<版本>`。
  缺 etim 时 FML 在 `required-after:etim` 处直接失败，无需另设通道。

## 起服/停服（已可用）

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File testharness\server\run-server.ps1 -StopAfterSeconds 35 -Tag smoke
```

- 起服 → 等 Done → 向 stdin 写 `stop` → `Stopping the server` / `Saving worlds` → 快照
  `testharness/build-logs/<Tag>-latest.log`。
- **不要用原版 RCON**：1.12.2 `RConThreadClient` 每条连接只能承载一个包（auth 后 `continue`
  触发 `finally closeSocket()` → 下一轮 NPE），原版 RCON 无法执行命令（B-EXTRA-2，`playground/audit/
  audit-extra-裁定回执.md` 条 7）。需要 exec 面时照主项目给该类打 binpatch，补丁说明落本目录。
- 依赖 jar（`etim-1.0.0` dev）走 Gradle classpath，**不得放 `run/mods`**（MixinBooter 提升 + FML 重扫
  = `DuplicateModsFound` FATAL）。

## 待建（首批盾落码后）

- 盾面判点：耐久 = 材料判值；每击磨损 = `(int)(blocked × shieldWearRate)`；`[BlockLog]` 行（主 mod 通道）对材料盾的读数。
- 客户端面（盾 3D 姿态/图标）由用户操作，AI 只收读截图文件。

## 交互窗（需要中途下发命令时用这套，2026-10-28 盾面首批验证窗建立）

`run-server.ps1` 是「跑满 N 秒自动停」的一次性冒烟件，中途不能下发命令；需要边跑边下发的窗用下面三件：

| 文件 | 用途 |
|---|---|
| `server/server-console.js` | 把 `gradlew runServer` 拉起来并**保留 stdin 管道**，全量 tee 到 `build-logs/<tag>.out`，按行喂给监听者；`send(line)` 下发一条服务器命令，`stop()` 优雅停 |
| `server/console-probe.js` | stdin 通道自检：起服 → `say` → 查日志 → `stop`；判「运行中途能否写入」（本窗实测可） |
| `player/extra-shield-run.js` / `extra-shield-enchant.js` | 盾面 W-1…W-7 driver（盾面首批正本窗）；判行解析 + 逐点判定 + 证据 JSON 落 `build-logs/` |
| `player/extra-shield-craft.js` | 盾面 W-13／W-14 driver（真实合成窗）：开工作台逐格摆锭 → 点结果槽 arm → 等主 mod 计时器 → 读回库存差 + `[CraftingLog]` |

### 六条工装纪律（盾面首批 + 真实合成窗实测，2026-10-28）

1. **假人必须 op**：`/etest hurt <mob-selector>` 走 `EntitySelector.matchOneEntity`，入口 `EntitySelector.java:135` 要求 `sender.canUseCommand(1, "@")`；权限级 0 时解析为空集**且不抛异常**，日志只留 `NO_TARGET`（无 `detail=`）。先写 `run/ops.json`（离线 UUID）或窗内控制台 `op`。
2. **每臂复位血量**：R196 基座 `capAtLevel0=6`（`PlayerStatLimits.java:29`），不是 1.12 的 20；8 点 raw 减半后 4 点，多臂连打会致死。每臂后 `etest health 6`。
3. **单只 mob + Tags**：`matchOneEntity` 要求**恰好一个**匹配；每臂先 `kill @e[type=!player]`，再召唤一只带 `Tags:["shx"]` 的（`NoAI:1b,Silent:1b,PersistenceRequired:1b`），选择器用 `@e[type=zombie,tag=shx]`。
4. **合成臂必须生存**：`ETIMConfig.craftingSkipCreative` 默认 `true`，创造模式会跳过主 mod 的 R196 计时器——只能证明「格子出产物」，证明不了「真实合成消耗」。窗内改 `run/config/etim.cfg` 的 `craftingDebugLog=true`（判 `[CraftingLog]`），收口还原。摆料用「拿整叠 → 右键逐格 → 余料放回」（`putOne` 手法）：逐格过程中结果槽会短暂出现「1 锭→9 粒」的分裂配方，属正常中间态。
5. **真实合成的时间口径**：`period` 取自 `[CraftingLog] period SET … period=<n>`，等 `n×50 ms + 4 s` 余量；全窗每 10 s `etest food 6 6` 防 `hungerCraftDeny` 把进度冻结（冻结不是清零）。
6. **改配置只用 UTF-8 无 BOM**：PowerShell 默认编码读写会给 `run/config/*.cfg` 加 BOM、把注释里的非 ASCII 写成替换字符（合成窗实测 30,629→30,672 B）。要么用 `[IO.File]::WriteAllText` + `New-Object Text.UTF8Encoding($false)`，要么开窗前存字节副本、收口整体还原并回读 SHA。**不得**用 `Set-Content` / `Out-File` 改配置文件。

### 附魔面日志判据（替代附魔台 GUI）

`/etest enchantprobe mainhand` 直接调 `EnchantmentHelper.calcItemStackEnchantability`（`CommandDevTest.java:380`），落 `[EnchantLog] table power=15 slot0=… slot1=… slot2=…`。盾（附魔度 100/40）三档非 0，`minecraft:stick`（附魔度 0）三档全 0 —— 「附魔台三档非 0」因此可以日志判，不必依赖用户开 GUI。

