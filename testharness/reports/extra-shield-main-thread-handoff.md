【处理单 · 主会话（ETIM-Extra 盾面首批 · 验证回执收口）】

判决源（唯一正本）：D:\OpenCodeWorkspace\ETIM-Extra\testharness\reports\extra-shield-verdict.md
　　　　　　　　　　27,249 B｜330 行｜report-spec OK｜report-check OK（anchors 10 missing 0｜tables 15 bad 0）
钉值（窗已闭，未动）：jar 14,170 B｜SHA256 470809B038359F706EE22419538DBC2433C5CAE15D56D145217E813F23E5519A
　　　　　　　　　　　｜mtime 2026-10-28 20:35:50｜HEAD 54eed94｜0 rebuild｜端口 25565 = 0｜0 crash-report
现状：W-1…W-8 判点 ✗ = 0，A 级 0、B 级 0、C 级 6 → **数值面可闭单**。
本单只裁「三点补充」引出的 4 个待裁项，不复议任何判点结论。

────────────────────────────────────────
D-1｜W-7 判据面升级（批文 §4 口径变更，零落码）
事实：批文 §4 把 W-7 的「附魔台三档非 0」列为用户面；但主 mod `/etest enchantprobe mainhand`
　　　直接调 EnchantmentHelper.calcItemStackEnchantability（CommandDevTest.java:380，与附魔台 GUI
　　　同一函数）并落 [EnchantLog] table power=15 slot0=… slot1=… slot2=…。本窗已实测：
　　　秘银盾 4/12/30、艾德曼盾 7/11/30、对照 minecraft:stick（附魔度 0）0/0/0。
　　　⇒「三档非 0」已从用户面变成可 grep 的日志判据，且对照臂排除了「命令恒非 0」的假正。
请裁：① 采纳（建议）→ 改批文 §4 的 W-7 行与「三分口径」①；用户面只剩「实际出什么附魔／附魔名」
　　　② 不采纳 → W-7 维持用户面，等 GUI 窗再判（本窗该条按「服务端臂 PASS + GUI 待用户」闭单）
若采纳，建议直接替换批文 §4 的 W-7 行：
　| **W-7** 附魔门（日志面 + 可选 GUI） | `[ExtraLog]` + `[EnchantLog] table power` | `shield … enchantability=100`（adamantium 40）；`[EnchantLog] table power=15 slot0=<a> slot1=<b> slot2=<c>` 三值均 >0 | 正：日志值对 + 三档均 >0（对照 `minecraft:stick` 三档全 0）；反：三档出现 0 |
并把「三分口径 ①」改为：
　① 纯渲染/手感面（W-7 的「实际出什么附魔」、W-8 的 tooltip）由用户操作 + 原文转述；
验收：回一句「D-1 = ①/②」；选 ① 时附上改后 §4 W-7 行与三分口径 ① 的原文（我据此核对报告与批文同值）。

────────────────────────────────────────
D-2｜「静默 NO_TARGET」是否升 B 级（判定通道缺口）
事实：/etest hurt <mob-selector> 走 EntitySelector.matchOneEntity；入口 EntitySelector.java:135
　　　要求 sender.canUseCommand(1, "@")。权限级 0 时选择器解析为空集、**不抛异常**，TestDriver.java:165
　　　落 step=hurt … NO_TARGET 且**不带 detail=** ⇒ 判定面无法区分「附近没有该实体」与「选择器被
　　　权限拒了」。本窗实测对照：De-opped 20:59:36 → 20:59:37 NO_TARGET（block 行 0）→ Opped 20:59:39
　　　→ 20:59:41 gate/wear/block 三行齐。
影响面：只影响工装写法的可信度，不影响本批判点（本窗已用 deop→op 对照取证）。
请裁：① 只记工装纪律（不改产品码，零成本；README 草案已写）
　　　② 升 B 级并要求主 mod 补一行（需落码 + 新窗重验 W-3/W-4/W-5 一面）
若选 ②，建议行文案（区分三种拒绝，字段可判真假）：
　[TestLog] step=hurt player=<n> reason=perm selector=<sel> permLevel=<n>
　[TestLog] step=hurt player=<n> reason=no-match selector=<sel> candidates=<n>
　[TestLog] step=hurt player=<n> reason=multi selector=<sel> candidates=<n>
验收：回一句「D-2 = ①/②」；选 ② 时给出派修会话与重验范围（我建议只重验 W-3/W-4/W-5 + W-6 的 state 行）。

────────────────────────────────────────
D-3｜C-3 血上限 6：只记纪律，还是加工装侧护栏
事实：R196 基座 capAtLevel0=6（PlayerStatLimits.java:29），不是 1.12 的 20。8 点 raw 减半后 4 点，
　　　多臂连打必然致死（本窗前几轮的附加臂出现 was slain by Zombie）。正本窗改为每臂后
　　　`etest health 6`（日志 health_set … params=[6.0, 6]），全窗 0 死亡。
影响面：纯工装前置；产品无缺陷。但下一批若做「盾连续格挡 N 击」的耐久曲线，必须知道这条。
请裁：① 只记纪律（README 草案已写：多臂伤害窗每臂复位血量）
　　　② 让 /etest hurt 在自身线路前把受击者血量夹到 > 本次 amount（工装面改动，需落码 + 新窗）
验收：回一句「D-3 = ①/②」。

────────────────────────────────────────
D-4｜客户端面（C 面 + 附魔台 GUI + W-8 tooltip）是否另开用户面窗
现状：本窗未起任何客户端（AI 不操控键鼠、不拉窗）。静态侧已核：zh_cn/en_us 有「秘银盾／艾德曼盾」、
　　　两件模型均 item/handheld + layer0、纹理 16×16 RGBA（colorType=6，126/256 不透明像素，非紫黑非全透明）。
　　　未做的运行时面：图标观感、手持模型、右键举盾姿态、tooltip 无品质行、附魔台三档显示、实际出什么附魔。
请裁：① 另开一个用户面窗（同一 jar、0 rebuild；用户本人操作，我出观察清单 + 判据行 + 收读截图）
　　　② 本批不补，登记为「客户端面待后续批」并闭单
验收：回一句「D-4 = ①/②」；选 ① 时确认用户在场时间窗，我再起客户端（起前不 rebuild、先核 jar 未被覆盖）。

────────────────────────────────────────
附带（只需一句确认，不阻塞）
- 三条工装纪律草案已写进 D:\OpenCodeWorkspace\ETIM-Extra\testharness\README.md（新增「交互窗」一节：
  server-console.js / console-probe.js、假人必须 op、每臂复位血量、单只 mob + Tags、附魔面日志判据）。
  该文件目前是 tracked dirty 的唯一一条（M testharness/README.md），产品码 0 改动。
  请裁：保留 / 改口径 / 回退。
- 本单**不产生 rebuild**；凡选 D-2② / D-3② 都要新窗重钉值（新 jar = 新字节/SHA/commit，旧钉值作废）。
