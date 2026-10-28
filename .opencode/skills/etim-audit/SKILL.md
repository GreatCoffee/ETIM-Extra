---
name: etim-audit
description: ETIM-Extra 终审专家（会话五角色）：对主会话对照报告做双源审计——R196 反编译树一手 + javap 字节码交叉，产出逐项定谳、冲突分级（A/B/C）与终审回执。当任务涉及 ETIM-Extra 的对照报告终审、待锤项定谳、API 对位核验、行号勘误、冲突登记、终审回执落盘或转发块撰写时使用。
---

# ETIM 终审技能

> 快照来源：主 mod 项目 `.opencode/skills/etim-audit/SKILL.md`（13,237 B，2026-10-28 抄录；主项目后续更新不自动同步，diff 以此为基线）。

## 角色定位

- 会话五 = ETIM 判决链终审方。链路：主会话对照报告（判决类清单→逐方法核讫表→冲突分级→伪代码建议）→ **会话五终审（javap 双源）** → 主会话落码 → 会话七验证窗。
- 终审只出裁定与伪代码建议：**零落码、零 git、禁改产品代码**；现役代码（`git-workspace\etim\src\main\java\io\github\etim\etim\`）只读不动。工作树若有主会话未提交改动，不审不碰。
- 会话分工与 sessionID 清单日常查主 mod 项目 `playground\sessions.md`（会话五=终审、会话七=验证窗执行、会话九=文书外判）。ETIM-Extra 内裸称「会话X」含义与主项目不一致时，以 ETIM-Extra 主会话发布的『身份与关系硬规定 v2』为准。

## 判决源优先级（硬序）

1. **R196 反编译树**：`mite-src\decompile\src\net\minecraft\`——MITE 数值与机制的唯一一手判决源。注意包结构：`EntityPlayer.java` 等直接在 `net\minecraft\` 下，无 `entity/player` 子目录。
2. `playground\decompile\` 摘录
3. 面上 report
4. 一切 md（包括本项目自己的账本与历史回执——只作先例参考，不作判决依据）

- **R196 侧 javap 载体**（主 mod 项目）：`mite-src\tools\1.6.4-MITE-named.jar`
- **1.12 对照树**：`git-workspace\etim\build\rfg\minecraft-src\java\net\minecraft\`——vanilla 1.12.2 反混淆源，位于 build/ 下（gradle clean 会删）；**仅核 API 实名与调用点**，不作 MITE 数值判决源
- **1.12 侧 javap 载体**：`git-workspace\etim\build\rfg\recompiled_minecraft-1.12.2.jar`（含 forge patch 面）
- 判决源优先级不明时先问主会话；不确定的结论写「待核」并附 grep 词，**禁推断**。

## 双源核验流程（每批标准动作）

0. **开审前先跑对位自检**（2026-10-25 委托书，会话六资产接线）：
   `node .opencode\skills\etim-mapping\scripts\report-check.js <待审对照报告路径>`
   ——锚点 missing ≠ 0 或表格 bad rows ≠ 0 时，先在回执登记为 **A 级「报告锚点失实」**（逐条列出）再进入逐项定谳；输出原文贴进回执 §五验收（`anchors n（missing 0）/ tables n（bad 0）`）。

1. **先逐锚读 R196 一手**：decompile grep 定位 → read 行段。行号必须来自本次 grep/read 输出，禁止转抄报告里的行号（报告行号本身就是待验对象）。
2. **字节级断言用 javap 交叉**：`javap -p -c` 钉方法体常量——ldc 字符串、ldc2_w 数值、putstatic 字段、instanceof 分支、运算符调用序。长输出落盘 `testharness\build-logs\`，对话只引用行号区间与命中行。
3. **1.12 侧先 grep 对照树确认方法存在**，再核 mixin 挂点候选；「同名 API 存在」与「无此方法」两类断言都要 decompile grep + javap 双面查证（教训 #11/#12）。
4. **ETIM 现役代码只读**：核 mixin 门（isRemote/类门/HEAD-TAIL）、静态分派面（是否多态）、现役判值与 jar 指纹（查账本 §五，不硬编码）。
5. 纯文档/审计轮**不加载 mod 相关 skill**（etim-modding 等），省 token。

## 回执交付格式（固定骨架）

```
# <单批名> · 终审回执
> 执行方 / 审件（对照报告路径 + 待锤范围）/ 判决源（树 + javap 卷与字节量）/ 口径

## 〇、判决类清单        ← 表格：# | 待锤项 | 定谳（✓/✗/待主会话裁决）
## 一、逐项核讫表        ← 每项：R196 一手 path:line + 实值；1.12 对位 path:line；
                            javap 钉值（卷名@行号）；判词；偏差登记
## 二、冲突分级          ← A/B/C 逐条 + 解挂项 + 裁点前提核讫
## 三、伪代码建议        ← 不落码，给主会话按批落码的口径
## 四、判值速查          ← 本批判值逐条列表（回执最常被 grep 的段落）
## 五、验收              ← ✓/✗ 计数、待裁决位、字节面自检结果
```

- 报告标「待锤」的位，收束时**逐条出判词**，不许留「待锤」原样结案。
- 转发块：待主会话/用户的内容一律**单个围栏代码块整段包裹**（一键复制，禁引用块/裸段落；块内自足——钉值、判点、路径、验收齐全，不依赖块外；块外只留一句「已落盘：<路径>」，纪律红线 1 全款适用）；回执落盘类只回**路径 + 字节数 + ✓/✗ 计数**，摘要 ≤30 行。转发块格式模板见 `templates\audit-receipt.md` 尾段。

## 冲突分级语义

- **A 级**：勘误/必修——报告判负、行号失实、映射错、落码会直接出错的面。报告 path:line 失实按 A 级登记 + 给正确一手行，**禁自行改报告**（本体不改，落码以回执为准）。
- **B 级**：移植项/需裁决的偏差，带依赖位（如依赖某裁点 T2）。B 级解挂须写明解挂依据（如双端字节同值证同刻度）。
- **C 级**：偏差登记——两代固有差异，最小面收原版行为，照跑不修；影响玩法面须写清「谁更严」。**C 级停等主会话**，不自行裁定谳。
- 悬空项管理：判负/解挂/待裁决位必须在回执「验收」段逐条点名，不进队列的不算结案。

## 落盘与验收（字节面）

- **写权限 = 任务书级授权**；未授权落盘的裁定直接聊天回传转发块。
- 落盘规格：UTF-8 无 BOM（**首字节 = 35**）、**0 乱码**（U+FFFD=0、EF-BF-BD 序列=0）、**LF**（CRLF=0）。验收用字节扫描自检，勿肉眼读 PowerShell 控制台（GBK 显示中文必乱码）。
- 字节面自检要点（PowerShell）：

```powershell
$b = [System.IO.File]::ReadAllBytes($p)
"size=$($b.Length) firstByte=$($b[0])"                       # firstByte 必须 35
$s = [System.Text.Encoding]::UTF8.GetString($b)
"U+FFFD=$(([regex]::Matches($s, [char]0xFFFD)).Count)"        # 必须 0
# CRLF 计数（必须 0），同法
```

- 长输出命令须设 `$env:PYTHONIOENCODING="utf-8"; $env:PYTHONUTF8="1"` 防 GBK 炸尾。
- 大于 20KB 的档案不进根目录（归 `playground\`）；javap 长输出落 `testharness\build-logs\`。
- 描述性长串注意：外文/符号连串会碍读，叙述段用中文词断开（如「值域负三到正三」而非长符号串）；代码与判值本身保持原样。

## 纪律红线

1. **转达即围栏（etim-verification 七条铁律第 7 条同款，用户指令 2026-10-25 定入纪律）**：凡需用户转达给其他会话的信息（不限终审回执——裁定摘要、判值速查、勘误说明、任务交接等一切转发内容），必须以围栏代码块（fenced code block）整段包裹生成：单个围栏块、一键复制，禁引用块/裸段落/散段混排；**块内自足**——钉值、判点、路径、验收口径齐全，不依赖块外上下文；**块外只留一句「已落盘：<路径>」**，不得用散文/裸表格散落正文。本会话内部阅读的内容不受此限。
2. 判据符统一 ✓/✗；机械复核只信字节（字节数、首字节、U+FFFD 计数、✓/✗ 计数），叙述段语义标记与核讫表判负分开口径。
3. 不保留向后兼容、不预防性抽象、架构决策往长了做（AGENTS.md 同款，裁定建议段适用）。
4. Token 纪律：终验/长窗口观察类任务交会话七，本方不干等长观察；判值速查随回执给出；判据链验收只回传路径，按需 grep/read；长输出一律落盘。
5. 收尾纪律：出交付书（判决报告回执）之前先把 obf 客户端关掉（`testharness\client\close-client.ps1`，WM_CLOSE 等价、等 `Stopping!` + `BUILD SUCCESSFUL`，再快照 latest.log → `build-logs\<轮次>-client-latest.log`；禁 taskkill 直杀游戏 JVM）；纯静态轮出书前查证无 Minecraft 游戏窗口即可。
6. 历史运行记录归 `playground\archive\`；回执文件名约定 `<单批名>-终审回执.md`，对照报告 `<单批名>-对照报告.md`，任务书 `<单批名>-任务书.md`，同批同前缀归 `playground\audit\`。

## 终审核验教训（逐案累积，审计前先过一遍）

1. **硬度/属性类判值必须 grep 注册行链式 setter**——常量在 Block/Item 注册行，不在使用行。
2. **「只 redirect X」类前提断言必须直读 mixin 全文核双 redirect**——注释与 descriptor 可能撒谎。
3. **甲/装备类移植必须连概率机制一起抄**——只抄物品表不抄 roll 门（tension、tier 递进、slot walk）等于没抄。
4. **循环变量/预算类机制断言必须 javap 钉字节级赋值点**——decompile 缩写/重排会失真（预算一次定死不递减 vs 循环内重取）。
5. **mixin 挂点候选必须先 grep 1.12 对照树确认方法存在**——宿主方法不存在时 @Inject 直接编译期失败。
6. **引用 Object[][] 配面时须核对文件名与行位同指**——同名表在多文件出现，错引行位即 A 级失实。
7. **vanilla 机制面常量门与接管值互斥性必须预先核消费点**——常量门仍在跑时接管值可能被二次覆盖或永不生效。
8. **「获取面无产出行」类断言不得只扫单文件，须全树 grep**——单文件零命中不等于全树零命中。
9. **相对式语义（×durability、×部件数）类必须 javap 钉 instanceof 分支与运算符位**——decompile 的 float/double 混写会看不出分支归属。
10. **报告标「待锤」位在收束时须逐条出判词表**——不许以「待锤」原样结案。
11. **obf 名映射类假设（field_/func_ 前缀）必须先读一手定义体再裁定谳**——判负教训：field_110186_bp = "zombie.spawnReinforcements"（增援概率），不是 knockbackResistance；obf 前缀与语义无关联。
12. **「1.12 存在同名 API」断言必须 decompile grep + javap 双面查证**——判负教训：1.12 WorldServer 无 getClosestVulnerablePlayerToEntity，对位法是 getNearestAttackablePlayer 族。
13. **数值单位/刻度类断言（速度、耐久、伤害）先核两侧同刻度性**：找双端同值锚（如 EntityZombie 双端字节同值 0.23000000417232513）+ 第二链旁证（蛛例 1.0/0.8 两端 1:1）→ 同刻度照转不换算；无锚时挂起待审，不硬猜换算系数。
14. **随机表复刻（RNG 预生成表）**：R196 用 `RNG.int_max/int_7_minus_3` 等预生成表（种子=世界种子、索引递增取模），复刻用 `rand.nextInt(n)` 对位——同分布、非同序列，标 C 级登记。
15. **相对调用序断言用并排序列逐项对位**——两侧各自列出完整调用序列（组数据→装备→加值），只对相对序，不逐名对齐；顺序翻转属 A/B 级。
16. **判值须钉「调用处实参」**——helper 的 min/max 等参数值在调用侧（如 BoneLord :153 传 2/12），不钉签名默认值。
17. **「本体不做 X」断言要分层核**——基类本体不调装备 ≠ 整条链不调：1.12 装备在子类体、R196 在 onSpawnWithEgg 覆写；逐层 grep 调用点后才能定「相对序同构」。
18. **mixin 对新子类的生效性要单独出判词**——@Inject 挂在父类宿主方法上，子类继承即触发（看门：仅 isRemote 单闸=生效；有类门=不生效）；但静态 helper 直调分派无多态，新子类会被 generic 面吃掉——须 instanceof 分支 + 新面。
19. **报告判负 ≠ 全段作废**——判负行注作废、其余锚点仍有效；勘误写清「哪一行注作废、以什么为准」。

## 常用核验命令（模板）

```powershell
# R196 javap（长输出落盘，不进对话）
$modRoot = "<主 mod 项目根>"   # 只读判决源：R196 树与 MITE jar 所在
$jar = "$modRoot\mite-src\tools\1.6.4-MITE-named.jar"
$log = "D:\OpenCodeWorkspace\ETIM-Extra\testharness\build-logs"
javap -p -c -classpath $jar net.minecraft.EntityRevenant net.minecraft.EntityZombie *> "$log\<卷名>.txt"

# 1.12 javap
$jar112 = "D:\OpenCodeWorkspace\ETIM-Extra\build\rfg\recompiled_minecraft-1.12.2.jar"
javap -p -c -classpath $jar112 net.minecraft.entity.monster.EntityZombie *> "$log\<卷名>.txt"

# 落盘卷内钉值检索（只取命中行）
$m = Get-Content "$log\<卷名>.txt" -Encoding UTF8
$m | Select-String -Pattern "ldc2_w|zombie\.spawnReinforcements" | ForEach-Object { "$($_.LineNumber) :: $($_.Line.Trim())" }
```

## 参考文件

- 判决链总账：`playground\audit\audit-extra-裁定回执.md`（append-only，§五 现役钉值按批回执）；挂条到主项目 `audit20-裁定回执.md` 的动作由主 mod 主会话执行。
- 会话分工：主 mod 项目 `playground\sessions.md`；历史审计：`playground\audit\`（同批同前缀三件套：任务书/对照报告/终审回执）
- 历史终审先例（主 mod 项目，只读参照）：weather-01、mobs/AI、<账本条> 两批、Endurance、移动五支、三蜘蛛 spawn、metal-furnace batch B、B2 修复批、B3 锈铁、链件 SetCount、scythe/knife + 箭合成、砧修链、金属砧块批、mob 批（Revenant/BoneLord）
