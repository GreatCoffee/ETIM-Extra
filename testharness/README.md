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
