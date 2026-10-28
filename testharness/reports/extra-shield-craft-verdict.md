# ETIM-Extra 盾面补种 · 真实合成窗回执（W-13 / W-14）

- **判据正本**：`playground/audit/extra-shield-补种批文.md` §3（W-13 六锭门 / W-14 真实合成消耗）
- **窗口**：2026-10-28 21:39:46 – 21:41:52（`gradlew runServer` 单轮，stdin `stop`）
- **驱动**：`testharness/player/extra-shield-craft.js`（mineflayer 假玩家；服务端命令走 stdin 控制台）
- **执行方**：ETIM-Extra 主会话
- **结论**：W-13 ✓、W-14 ✓（五腿全 PASS）｜判点 ✗ **0**｜冲突 **A 0 / B 0 / C 3**｜可闭单

## 一、钉值（起窗 = 收口，逐位同值）

| 项 | 值 |
|---|---|
| jar | `build/libs/etimextra-0.1.0.jar` **30,259 B** |
| SHA-256 | `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93` |
| mtime | 2026-10-28 21:32:34 |
| rebuild | **0**（本窗未重跑 jar/reobf；与 `7f6c472` 同一构建） |

## 二、W-13 六锭门（数量敏感，铜盾腿）

| 摆料 | 结果槽 | 判读 |
|---|---|---|
| 5 格（`X X` / `XXX` / `_ X _`，缺右下） | **空** | 5 锭不出盾 |
| 补第 6 锭 | `type=4262`（`etimextra:copper_shield`，服务端行见 §三） | 第 6 锭才出盾 |

⇒ 配方不是「≥5 锭」，是**恰好 6 锭**的固定形状。

## 三、W-14 真实合成消耗 6 锭（五金属逐腿）

前置：生存模式（`craftingSkipCreative=true` 只对创造生效，故创造会跳过计时器，不能用来判「真实合成」）、饥饿复位、每腿 `/clear` + `/give 6`。

| 金属 | 摆料 | 结果槽产物（服务端 `result CHANGED` 行） | 库存差 | 完成行（`[CraftingLog]`） | 判定 |
|---|---|---|---|---|---|
| 铜 | 6 格 | `etimextra:copper_shield#0×1` | 锭 −6、盾 +1 | `COMPLETE Copper Shield ×1 quality=AVERAGE xp=0` | ✓ |
| 银 | 6 格 | `etimextra:silver_shield#0×1` | 锭 −6、盾 +1 | `COMPLETE Silver Shield ×1 quality=AVERAGE xp=0` | ✓ |
| 远古金属 | 6 格 | `etimextra:ancient_metal_shield#0×1` | 锭 −6、盾 +1 | `COMPLETE Ancient Metal Shield ×1 quality=AVERAGE xp=0` | ✓ |
| 秘银 | 6 格 | `etimextra:mithril_shield#0×1` | 锭 −6、盾 +1 | `COMPLETE Mithril Shield ×1 quality=AVERAGE xp=0` | ✓ |
| 艾德曼 | 6 格 | `etimextra:adamantium_shield#0×1` | 锭 −6、盾 +1 | `COMPLETE Adamantium Shield ×1 quality=AVERAGE xp=0` | ✓ |

- **产物身份**：五腿结果槽的 `sig` 都是**本金属**的盾（不是同一件、不是锭、不是粒），逐条可 grep。
- **消耗**：每腿假玩家库存 `锭 6 → 0`、`盾 0 → 1`（数值 type id 断言，见 C-2）。
- **走的是主 mod 的真实路径**：`result click btn=0` → `start crafting difficulty=150.0 quality=AVERAGE period=102` → `COMPLETE … continue`。`difficulty=150.0` = 6 × 通用材料 25（`CraftingDifficulty` 对 etim 锭无专行，落通用档）；`period=102` 是主 mod 计时器算出的真实周期，本窗等满 102 tick + 4 s 余量才判。
- **品质面**：`quality=AVERAGE xp=0` —— 盾不是品质载体（裁 T-4），所以不吃品质档、不扣经验；若哪天盾意外进了品质载体表，这条行会变成非 AVERAGE 或 `xp≠0`。

## 四、生命周期与工作区

- `Done (0.537s)!` → 五腿 → stdin `stop` → `Saving worlds`，Gradle 退出码 **0**；`run/crash-reports` 近 20 分钟 **0** 个新文件。
- 窗内 `run/config/etim.cfg`：`B:craftingDebugLog` 临时 `true`，收口还原 `false`；`craftingTimer=true`／`hungerCraftDeny=true` 保持产品默认。
- 工装产物：`testharness/build-logs/15-shield-craft.out`（服务器全量）、`15-shield-craft-evidence.json`（逐腿判据）、`15-shield-craft-driver.out`（驱动日志）。
- 产品码 0 改动；`run/` 不入版本库（世界里的工作台、假玩家库存均为一次性）。

## 五、冲突分级

| 级 | 条 | 内容 |
|---|---|---|
| **A** | 0 | 无产品码缺陷、无需 rebuild |
| **B** | 0 | 五腿消耗/产物/完成行全有可 grep 行 |
| **C** | 3 | C-1 逐格摆料途中，结果槽会短暂出现 `etim:nugget_*#0×9`（1 锭 → 9 粒的分裂配方），是「一次只放 1 个」的副产物；5 格时结果槽为 null、6 格时才是盾，故不干扰 W-13。C-2 mineflayer 对 mod 物品名解析为 `unknown`，库存断言按数值 type id + 服务端 `sig`/`COMPLETE`（含真实显示名）双证。C-3 本窗由主会话执行（驱动为本项目工装），非会话七 |

## 六、待裁

1. 是否要**会话七独立复跑**本窗（驱动已落盘，一行命令可跑；复跑只换执行方，不改判据）。
2. W-12（客户端三面：五件图标/名字/姿态）仍待用户肉眼判。
