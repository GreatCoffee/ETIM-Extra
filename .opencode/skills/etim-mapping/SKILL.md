---
name: etim-mapping
description: ETIM-Extra（附属 mod）R196→1.12.2 判值对位与对照报告专家（会话六角色）：把立项摸底的一手判值逐面翻成「R196 一手 / 1.12.2 落法（path:line） / 伪代码 / 判行锚」四件套，产出逐面核讫的对照报告 + 冲突分级 A/B/C + 待裁位 D-n。当任务涉及 ETIM-Extra 的立项摸底、对照报告撰写、判值对位、Forge 1.12.2 适配面查证、锚点与字节机械核验，或维度/群系/实体/刷怪/地形的移植口径时使用。
---

# ETIM 判值对位与对照报告

> 快照来源：主 mod 项目 `.opencode/skills/etim-mapping/SKILL.md`（14,402 B，2026-10-28 抄录；主项目后续更新不自动同步，diff 以此为基线）。

## 0. 角色与边界

判决链：**摸底（会话六）→ 对照报告（会话六）→ 终审（会话五）→ 落码（主会话）→ 验证窗（会话七）→ 落账**。

| 角色 | 负责 | 禁止 |
|---|---|---|
| 本技能（会话六） | R196 一手抄录、1.12.2 落法查证、伪代码草案、锚点自检、摸底/对照报告落盘 | 改产品码、git 收口、出终审判词、跑验证窗 |
| 会话五 终审 | 对照报告双源定谳（javap 字节） | 改报告本体 |
| 主会话 | 裁 A/B/C、派码、收口 | 长窗干等 |
| 会话七 验证窗 | 实测取证、判据通道改造 | 改产品码 |

- 产出两种，同批同前缀，均归 `playground\audit\`：`<单批>-立项摸底.md`（面清单 + 一手摘录，供立项裁范围）、`<单批>-对照报告.md`（逐面落法）。
- **本方给落法，不给裁定**：拿不准的取舍一律进 §待裁位，二选一 + 倾向，不自行拍板；终审判词权在会话五。ETIM-Extra 内裸称「会话X」含义与主项目不一致时，以 ETIM-Extra 主会话发布的『身份与关系硬规定 v2』为准。

## 1. 判决源硬序与引用写法

| 源 | 路径 | 用途 | 引用写法 |
|---|---|---|---|
| ① R196 反编译树（主 mod 项目） | `mite-src\decompile\src\net\minecraft\`（`MinecraftServer` 在 `...\net\minecraft\server\`） | MITE 数值/机制唯一一手 | **裸文件名**：`World.java:96` |
| ② 摘录库 | `playground\decompile\<主题>\` | 前批已抄录的转引 | 标「转引」 |
| ③ 一手 md | 摸底/账本/批文 | 范围与先例 | 只作参照，不作判值 |
| ④ 1.12.2 vanilla | `git-workspace\etim\build\rfg\minecraft-src\java\net\minecraft\` | API 实名、调用点、覆写面 | **包内相对路径**：`world\WorldProvider.java:608` |
| ⑤ Forge | 同上 `...\java\net\minecraftforge\` | 维度注册、传送、事件 | `common\DimensionManager.java:129` |
| ⑥ 现役码（只读） | `git-workspace\etim\src\main\java\io\github\etim\etim\` | 挂点、既有先例、改动点 | 子目录前缀：`mob\ETIMSpawnCycle.java:669` |

**为什么必须分写法**（实证）：`WorldProvider.java`、`EntitySpider.java`、`MinecraftServer.java`、`Biome.java`、`EntityArrow.java` 在两棵树里同名而行号不同——裸名混引必出错行。规则：R196 裸名、1.12/Forge 带包内相对路径、ETIM 带子目录；每批开头在头部一次性声明前缀。

- **行号纪律**：每个行号必须来自本轮 grep/read 输出，**禁止从摸底转抄**。摸底是转引——实际回读抓出 8 处错行（`WorldGenDungeons:200→199`、`WorldProvider.getSaveFolder:298→299`、`Chunk.getChunkCoordsHash` 返回值 `2225→2224`、`<本项目类>:<行>→<行>` 等）。
- **空结果也是结果**：1.12.2 全树 grep 零命中就写 `✗` 并给 grep 词。实证不存在：`ChunkGeneratorOffset`、`AchievementList`、`ChunkPostField`、`WorldChunkManager`、`GiantVampireBat`。不许写「大概有」。
- `build\rfg\minecraft-src` 在 `build/` 下，**gradle clean 会删**；引用它时同批内避免 clean，或先备份行号摘录。

## 2. 面（face）计数口径

- 一个**面** = 一条带 `path:line` 的判值条目，编号 `M<组>-<序>`。
- 分组沿用摸底：M1 骨架、M2 入口、M3 群系、M4 地形、M5 实体、M6 刷怪、M7 附加。**附加面单独成组**，并在 §0 写明「表行数 = 任务书面数 + 附加面数」。
- 三个数字必须同时给：**总面数 / 本批可落码面 / 只登记面**。载体落在后置批的面（例：刷怪笼判值的载体是地牢生成）只登记不落码，且在 §0 表与 A 级双写。
- 非 R196 面的改动（删除/迁移/改名）单列一节，不占面编号。

## 3. 工作流（每批五步）

1. **收范围**：读摸底 + 主会话裁定的 D-01…（边界），把「必入 / 后置」抄成清单，先核面数对得上不对得上，对不上先算口径不硬凑。
2. **逐面回一手**：grep → read 行段 → 抄实值（常量/字段/分支/调用序）。同时记 1.12 对位候选。
3. **查 1.12 落法**：候选必须先 grep 落地确认存在，再读签名与覆写位；无对应物写 `✗` + 代用方案 + 后果。
4. **写伪代码**：按面给最小落法（类骨架、覆写、分支、门），值照抄不换算；近似处标 `?` 并给 C/B 编号。
5. **机械自检 + 落盘**：跑 `scripts/report-check.js`，五项全绿再交付（§7）。

### 3.1 摸底（立项前）骨架

摸底只回答「有什么 / 能不能落 / 值多少」，**不写实现**：

```
头部   判决源四条路径 + 纪律 + 批量口径
§一    面清单：组 → 面号 → 判值一句 → R196 path:line → 1.12 有无载体 → 可落码/后置
§二    能力缺口：✗ 项逐条 + grep 词（空结果也是结果）
§三    范围建议：必入面 / 后置面 / 依赖批 + 面数合计
§四    高风险位：A 级预判（载体缺失、id 冲突、注册时序、可获得性空窗）
```

- 面号**一经立项即冻结**：对照报告沿用同一编号、不重排，三件套（摸底/对照报告/终审回执）才能按号对账。
- 摸底不写伪代码；某面必须给落法才能判可行性时标 `?`，留到对照报告展开。

## 4. 报告骨架（固定，勿改序）

```
头部  判决源四条路径 + 引用写法声明 + 范围裁定（D-01…）+ 纪律句
§0    计数口径与判决类清单   ← 分组面数表（组/面数/落码/备注）+ 三分口径
§1    逐面核讫表            ← M1…M7 分小节，每面一行五列
§2~   落法节（按域）：骨架/地形/群系/实体/刷怪/通道/迁移面
§9    冒烟判点草案          ← 交会话七，W1…Wn，含操作/期望锚/失败判据
§9.5  落码文件清单          ← 新增/改动 × 文件 × 职责
§10   冲突分级 A/B/C
§11   待主会话裁决位 D-n
§12   附注                  ← 零改动声明、源树性质、未覆盖面、`?` 的语义
```

- §1 与 §2~ 是**双写**关系：§1 是判值总表（每面一行），§2~ 是同一批判值的可施工形态（伪代码/值表）。任一处数字改动必须两处同步。

## 5. 逐面表的五列（质量门）

| 列 | 要求 | 反例 |
|---|---|---|
| R196 一手 | 可 grep 的原句/常值 + `path:line` | 「大概 120 格偏移」 |
| 1.12.2 落法 | `path:line` 且该行存在；无对应物写 `✗` | 「用 DimensionType 即可」 |
| 伪代码/要点 | 值 + 门 + 顺序，最小可落 | 整段照抄 200 行原文 |
| 判行锚 | 一条可 grep 的日志行（通道名 + 判值字段） | 「看日志确认」 |
| 备注/分级 | `?`/近似/缺口给编号 | 无标注的近似值 |

- 每面至少 1 个判行锚；多锚点用「；」分隔。锚点必须是**开发态可造的通道**，纯客户端渲染面注明「由用户操作」（AGENTS 客户端纪律）。
- 判行锚不存在的面（无载体、不可观测），在本列写「不可日志化 + 原因」，不许编造通道名。

## 6. 冲突分级（对照报告版）

| 级 | 定义 | 典型 |
|---|---|---|
| **A** | 影响范围 / 必须裁：不裁就落不了码或玩家可感知 | 面载体落在后置批、缺类缺块、id 冲突、注册时序硬约束、删改造成的可获得性空窗、1.12 契约字段会毁全局 |
| **B** | 漂移 / 近似：有落法但不等价，不改判值裁定 | 1.12 无对应物但有代用、调度优先级差异、单数组 vs 双数组、单位不换算的近似、既有漂移 helper |
| **C** | 登记不改：两代固有差异 | 无载体、色值/成就系统/边界差、只存不用的字段 |

- A 级每条必须给「二选一 + 倾向 + 后果」；倾向只是建议，裁员在主会话。
- 分级与 `?` 配合：`?` 表示「一手已抄录、落法待裁」，不是缺页；`?` 面必须在 §11 有对应 D-n 或在 C 级登记。

## 7. 机械自检（交付前必跑）

```bash
node .opencode/skills/etim-mapping/scripts/report-check.js playground/audit/<单批>-对照报告.md
```

五项：

1. **字节规格**：UTF-8 无 BOM（首字节 `0x23` 或 `0x2D`）、LF（CR 0）、U+FFFD 0、无残留占位符。
2. **锚点存在性**：报告里每个 `X.java:NN` 都能在四棵树里找到同名文件且行号在文件行数内。本轮样板 204 锚点 / 0 缺失。
3. **表格完整性**：GFM 表每行未转义 `|` 数一致；代码里的 `|` 必须写 `\|`。
4. **分组面数**：`| M<n>-…` 行数按组统计，与 §0 声明一致。
5. **冲突/待裁计数**：A/B/C/D 行数与 §10/§11 声明一致。

**内容级抽查**（脚本抓不到，人工做）：抽 20% 关键锚点回读目标行，断言该行含预期常量/方法名/字段名。本轮 113 项 key-value 比对抓出全部 8 处错行——纯行号存在性不够。

## 8. 落盘与回执

- 编码纪律：只用 node `fs.readFileSync(p,'utf8')` 读写；**禁止 PowerShell `-replace | Set-Content` 重写 UTF-8 文件**（GBK 控制台必乱码，且会改行尾）。校验中文内容用 `TextDecoder('utf-8',{fatal:true})` 或 node 读字节，不肉眼看 PowerShell 输出。
- 大文件归 `playground\`（>20KB 不进根目录）；长输出落 `testharness\build-logs\`，对话只读尾部。
- **转达即围栏**：给主会话/其他会话的内容一律单个围栏代码块整段包裹，块内自足（判值、锚点、路径、验收齐全），块外只留一句「已落盘：<路径>」。
- 回执 ≤30 行，固定字段：路径 / 字节 / 行数 / 面数（分组）/ 冲突分级计数 / 待裁点数 / 锚点核验数 / 零改动声明。

## 9. 教训清单（逐案累积，开工前过一遍）

1. **同名跨树文件必错行**——R196 裸名、1.12 带包内路径、ETIM 带子目录，三种写法不混用。
2. **摸底行号不可转抄**——必须回一手。转引的错行是本类任务最高发缺陷（本轮 8 处）。
3. **结构可借，值不可借**——1.12 `ChunkGeneratorHell` 与本批生成器同源，但海水在 R196 是 `waterStill`（`ChunkProviderUnderworld.java:107`），1.12 同位置是 LAVA（`world\gen\ChunkGeneratorHell.java:143`）。照抄结构 + 照抄值 = 地形全错。
4. **索引布局按三元组写**——`x<<11 | z<<7 | y`（y 低 7 位，`Chunk.java:208`）；`+= 128` 可能是 z+1 不是 y+1；蛛网用 `(z*16+x)*128+y`（`ChunkProviderGenerate.java:130`）是 x/z 转置，必须原样移植，不能「顺手统一」。
5. **死常量 vs 活字段**——`Y_OFFSET_FOR_UNDERWORLD=120` 零引用（`World.java:101`），真值是 `underworld_y_offset`（`World.java:185/277` 赋值 + 8 处消费）。抄常量不查消费点 = 没抄。
6. **RNG 预生成表一并移植**——`chance_in_2` / `int_14_plus_1` / `int_126_plus_1`（`RNG.java:64-134`）；不移植则基岩层叠与蛛网静默改变分布，日志还看不出来。
7. **一个字段毁全局的耦合要显式写「不要设」**——provider `nether=true` → `getActualHeight=128`（`world\WorldProvider.java:610`）把 256 高世界砍半；`hasSkyLight=false` → `isDaytime()` 恒 false（`world\World.java:1568-1573`）。
8. **调度优先级面最易漏**——1.12 `dropLoot` 有 loot 表就不调 `dropFewItems`（`entity\EntityLiving.java:583-614`）→ 要跑 R196 掉落必须 `getLootTable()=null`。
9. **注册时序是硬约束**——`DimensionType` 是 enum（`world\DimensionType.java:6-10`），`DimensionType.register` 先于 `DimensionManager.registerDimension`，两者都在 preInit；否则启动循环不含该维，只能靠 `getWorld` 懒加载（路径与事件不同）。
10. **「1.12 是否有此 API」必须自己 grep 落地**——改名/移植类接口（`ChunkGeneratorOffset`）不存在时，写进伪代码就是废码；javap 字节级定谳留给会话五，但存在性由本方证明。
11. **抽象类身份面不可硬凑**——1.12 `EntityArrow` 是 abstract，`getArrowStack()` 由子类硬编码，骷髅实际发 `EntityTippedArrow`（`entity\monster\AbstractSkeleton.java:269`）→「箭物品身份」判值不可复现，登记 A 级 + 二选一，不伪造等价。
12. **近似值必须标出处与级**——R196 `getNaturalDefense` 无 1.12 载体，映射 ARMOR 时写「近似 + 编号」，不能写得像原值。
13. **表格里的代码含 `|` 必须转义**——`x<<11\|z<<7\|y`、`melee\|ranged`、`A \|\| B`。GFM 按 cell 切，崩列后整表失效（本轮 5 处全靠脚本抓出）。
14. **时间/日计数先核口径再复用 helper**——现役 `ETIMMobEquip.getDayOfWorld` 用 `worldTime/24000`，R196 是 `(totalWorldTime+6000)/24000+1`（`World.java:5303-5312`）。复用即引入既有漂移，必须在落法里点名。
15. **面数对不上先算口径**——任务书 46 = 摸底 41 + 补充 5；M7 是摸底独立组未计入 → 单列附加面，§0 写明「50 行 = 46 + 4」，别硬凑也别默默超。
16. **只信字节，不信编辑器**——BOM、CRLF、U+FFFD 是打回的前三名；描述性长串用中文词断开（便于 grep），代码与判值保持原样。

## 10. 与其他 skill 的边界 / token 纪律

- 纯文档/对位轮**不加载** `etim-modding`、`minecraft-*` 等实现类 skill。
- 要落码 → 交 `etim-modding`（主会话）；要 javap 定谳 → 交 `etim-audit`（会话五）；要实测取证 → 交 `etim-verification`（会话七）。
- 判据链验收只回传路径，主会话按需 grep/read，不整档回贴；长输出落盘只看尾部。

## 11. 参考

- 样板（主 mod 项目，只读参照；50 面）：`playground\audit\underworld-对照报告.md`；同批摸底：`playground\audit\underworld-立项摸底.md`
- 模板：`templates\mapping-report.md`；自检脚本：`scripts\report-check.js`
- 账本：`playground\audit\audit-extra-裁定回执.md`；会话分工：主 mod 项目 `playground\sessions.md`
- 历史先例（主 mod 项目，只读参照）：mob 批（Revenant/BoneLord）、三蜘蛛 spawn、metal-furnace batch B、B3 锈铁、砧修链、weather-01
