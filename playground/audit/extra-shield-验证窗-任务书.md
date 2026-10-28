# 会话七验证窗任务书 · ETIM-Extra 盾面首批（W-1…W-8）

我们是 DeepSeek，不要吝惜真实 API 测试。

## 0 身份与边界

- 你是主 mod 项目的「会话七」：自动化测试 harness（runServer + RCON + mineflayer + 日志判读）执行方，不进判决链。
- 工装统一落 `D:\OpenCodeWorkspace\ETIM-Extra\testharness\`（服务端跑本项目 `runServer`）；**不改产品码、不改判值、不裁判决议、不动 git**。
- 判据正本：`D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-落码批文.md` §1 判值正本 + §4 判点。本任务书与批文冲突时**以批文为准**，并把冲突登记进回执。
- 落盘：`D:\OpenCodeWorkspace\ETIM-Extra\testharness\reports\extra-shield-verdict.md`（结构照 `etim-verification` 的 `templates/verdict-report.md`）。

## 1 被测物（钉值，起窗先记）

| 项 | 值 |
|---|---|
| jar | `D:\OpenCodeWorkspace\ETIM-Extra\build\libs\etimextra-0.1.0.jar`，**14,170 B** @ 2026-10-28 20:35:50 |
| SHA-256 | `470809B038359F706EE22419538DBC2433C5CAE15D56D145217E813F23E5519A` |
| HEAD | 起窗时 `git rev-parse HEAD`（落码提交 = `git log --oneline -1`），收口复核同值 |
| 依赖 | `etim-1.0.0` dev 分类器（mavenLocal）+ 运行期 `required-after:etim` |

**窗内 0 rebuild**：起服前与收口各记一次 jar 字节/SHA/mtime；要改 Java 就换窗口，不许在窗内 rebuild。

## 2 窗口前置（配置，逐项写进回执）

`run/config/etimextra.cfg`（本项目）：

```ini
debug { B:extraDebugLog=true }
shield { I:mithrilDurability=25600  I:adamantiumDurability=102400 }
```

`run/config/etim.cfg`（主 mod，只读改配置项，不改代码）：

```ini
combat { B:blockModel=true  B:blockDebugLog=true  S:shieldWearRate=1.0
         S:blockDamageFactor=0.5  S:blockMinDamage=1.0 }
```

- `blockDebugLog` 主 mod 默认 **false**，不开就没有 `[BlockLog]` 行。
- 起停服**只能走 stdin**：原版 1.12.2 RCON 一条连接只能承载一个包（B-EXTRA-2，账本条 7）。用 `testharness\server\run-server.ps1`。
- 判行无 `[server]` 尾标（与主 mod `[BlockLog]` 同），尾标不入判据。

## 3 判点（逐点核讫，正/反即判）

判据以**日志行**为主；W-7 的「出什么附魔」与 W-8 的 tooltip 由用户操作并原文转述，**不作判据**。

| 判点 | 通道 | 预期行（原样，`…` 只替换可变段） | 正 | 反 |
|---|---|---|---|---|
| **W-1** 注册与耐久 | `[ExtraLog]` | `shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1`；同形 adamantium `maxDamage=102400 enchantability=40` | 两行值逐字对 | `maxDamage=0`／`enchantability=0`／缺行 |
| **W-2** 配方 6 锭 | `[ExtraLog]` | `shield recipe=etimextra:shield_mithril ingot=etim:ingot_mithril count=6`；`… adamantium … count=6`；`shield recipes total=2` | 三行齐、count=6 | `count≠6`／缺行／total≠2 |
| **W-3** 全免段已关 | `[BlockLog]` `gate` | `gate player=<n>#<id> active=etimextra:mithril_shield src=<type> suppressed=true` | 举盾受击出现该行 | **不出现**（`blockModel=false` 或主 mod mixin 未生效） |
| **W-4** 半减 + 下限 | `[BlockLog]` `block` | `block player=… src=<type> raw=<%.3f> blocked=<%.3f> factor=0.500 min=1.000 carrier=etimextra:mithril_shield` | `blocked = max(raw×0.5, 1.0)`、`carrier` 是该盾 | `carrier=-`／`blocked=0.000`／factor≠0.500 |
| **W-5** 磨损 rate 臂 | `[BlockLog]` `wear` | `wear player=… item=etimextra:mithril_shield rate=1.000 decay=na raw=<%.3f> blocked=<%.3f> wear=<n> dur=<a>-><b>` | `wear=(int)(blocked×1.0)`、`decay=na`、`b-a = wear` | `decay` 出数字（走错臂）／`dur` 不动（非生存/创造） |
| **W-6** 耐久读数 | `[BlockLog]` `probe` | `probe player=… held=etimextra:mithril_shield dur=<cur>/25600` | 分母 = 配置值、分子随磨损下降 | 分母 336（继承 `ItemShield` 的迹象）或 0 |
| **W-7** 附魔门（**用户面**） | `[ExtraLog]` + 附魔台 GUI | `shield … enchantability=100`（adamantium 40）；附魔台三档非 0 | 日志值对 + 用户转述「出 Unbreaking」 | 三档全 0 |
| **W-8** 品质不生效（**用户面**） | tooltip + 静态锚 | 无品质行；`ETIMQuality.hasQualityChannel(盾) == false` | 只作静态锚 + 用户转述 | — |

## 4 执行面（建议分工，可自行调整工装）

- **A 面（服务端，自动）**：起服一轮，抓 W-1／W-2 五行 + `boot ok` + `Done (` + `Stopping the server` + `Saving worlds`。
- **B 面（格挡链，自动优先）**：生存模式玩家（bot 或用户）手持盾 → 右键进入使用态 → 被敌对生物命中（`src=mob`，非火/绝对）→ 抓 W-3／W-4／W-5；随后 `/etest blockprobe <player>` 抓 W-6（carrier/action/state/probe 四行一并留档）。
  - 若 bot 无法稳定制造「举盾 + 被命中 + 生存模式」，改用户手动操作、你只做日志解析与逐行断言，并在回执写明归因（手动样本不进分布样本，只判「有无该行 + 值是否对」）。
  - **创造模式不磨损**（`ItemStack.damageItem` 首判 creative + 主 mod `ETIMBlocking:150`）⇒ W-5 必须在**生存**下跑，否则 `dur` 不动是预期，不判 ✗。
- **C 面（客户端，用户操作）**：物品图标非紫黑、手持模型可见、显示名「秘银盾／艾德曼盾」、右键有举盾姿态、tooltip 无品质行。AI 不得控鼠标键盘、不得拉窗抢焦点。
- **D 面（附魔，用户操作）**：附魔台放盾，三档非 0；实际出什么附魔只作转述。

## 5 判据纪律

1. 日志为据：每个判点必须落到一行可 grep 的行；没有行先造通道（纯工装可直裁）或登记「代码锚」并说明为何不可日志化。
2. 钉值先行 + 收口复核；窗内 HEAD 前进但未 rebuild 必须登记。
3. 只读主 mod 代码树；不改主 mod 任何文件（改 `run/config/etim.cfg` 的**值**属窗口前置，允许，须在回执列明改了哪几键）。
4. 长日志落 `testharness/build-logs/`，对话只读尾部；整贴禁止。
5. 报告字节规格：UTF-8 无 BOM、LF、0 U+FFFD；`etim-verification/scripts/report-spec.js` 可自检。

## 6 禁止

- 窗内 rebuild／改产品码／改判值；
- 用 RCON 停服或 `save-all`（B-EXTRA-2）；
- 用截图/手感替代日志判点（客户端面只作辅助转述）；
- 顺手加 3D 模型、白名单、新通道——本批**不在范围**（批文 §6）。

## 7 回执（≤35 行，回传，不整贴）

1. 钉值：jar 字节／SHA／mtime／HEAD，起窗 vs 收口是否同值（逐位）。
2. W-1…W-8 逐点一行：✓/✗ + 命中行（原样截取，≤1 行/点）。
3. ✗ 点的归因（配置／工装／产品码），以及是否为「窗口外」问题。
4. 手动面（C/D）的归因与用户转述摘要（一句）。
5. 报告字节规格自检（字节数／首字节／CR／U+FFFD／行数）。
6. 零改动自陈（产品码、主 mod 文件树）+ 新增未跟踪文件清单。
