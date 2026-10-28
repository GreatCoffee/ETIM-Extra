---
name: etim-modding
description: ETIM-Extra（附属 mod）开发专家，精通Minecraft 1.12.2 Forge、MixinBooter、Forge Capability系统和RetroFuturaGradle构建流程，掌握本项目判据纪律、审计链流程与测试工装。当任务涉及 ETIM-Extra（主 mod 的秘银盾/艾德曼盾附属）的代码编写、机制实现、调试、判据设计或验证时使用此Skill。
---

# ETIM Mod开发指南

## 项目背景
ETIM是基于MITE（Minecraft Is Too Easy）机制的Minecraft 1.12.2 Forge Mod，Mod ID为`etim`。项目从零仿制MITE的核心机制，不实现原版反作弊功能，不强制不兼容其他Mod。

## 核心技术栈
- **Java 25 + Gradle 9.7.0 + RetroFuturaGradle 2.0.3 + Forge 14.23.5.2847**
- **MixinBooter 11.13**：修改原版和Forge类
- **Forge Capability系统**：存储玩家自定义数据（蛋白质、植物营养素、胰岛素等）
- **MixinConfigs清单属性**：注册Mixin配置，不使用IEarlyMixinLoader

## 双一手树（判决源，改机制前先查）
- **R196 树**：`mite-src\decompile\src\net\minecraft\`——注意包结构无 `entity/player` 子目录，`EntityPlayer.java` 直接在 `net\minecraft\` 下。R196 是 MITE 数值与机制的唯一判决源。
- **1.12 rfg 对照树**：`git-workspace\etim\build\rfg\minecraft-src\java\net\minecraft\`——vanilla 1.12.2 反混淆源。**位于 build/ 下，gradle clean 会删除**。
- 必要时用 javap 核 `1.6.4-MITE-named.jar` 字节码（长输出落盘 `build-logs\`，不进对话）。
- ICPM（github mcnb-Flash/I-can-t-play-MITE）属他人作品，只许机制/数值交叉印证，代码与文本不得照抄。

## 判据纪律（硬约束）
- 判定以日志为据：`[FoodLog]`/`[TestLog]`/`[EtimTest]`/`[SleepLog]`/`[IngestLog]` 等通道；客户端 HUD 仅开发参考，不作判定依据。
- `foodTestMode` 必须 = false（验证窗与产品判定时）。
- 判决报告一律 UTF-8（0 U+FFFD，判据符 ✓/✗）；机械复核只信字节：字节数、首字节、U+FFFD 计数、✓/✗ 计数。叙述段的语义标记（如缺口 ✗）与核讫表判负要分开口径，表面差异先对掉再定性。
- 判据文字口径已入账：<判点锚-1> `[FoodLog]` base = 每事件充账量（判速率用 Σamount÷Σ米数）；<判点锚-2> 行内路径含服务端自身 tick 位移（`NetHandlerPlayServer:411/:589` + `travel:1989` 两调用点同源，双计按容差判读）；<判点锚-3> boatDrain base ±2% 容差。

## 开发流程链（行为级改动必走）
对照报告（判决类清单→逐方法核讫表→冲突分级→伪代码建议）→ **会话五终审**（javap 双源）→ **主会话落码** → **会话七验证窗**（[FoodLog] 判值）→ 落账（`playground\audit\audit-extra-裁定回执.md` 补条）。
- 零行为面工装（判据通道、验证脚本）可主会话直裁。
- 任务书/转发文本统一格式：抬头→背景→结构化判据→落盘与验收→附注。禁散文混排。
- **转达即围栏（2026-10-25 起硬性，etim-verification 七条铁律第 7 条同款）**：凡需用户转达给其他会话的内容（判决回执摘要、任务书、待裁决位、派修指令、口径变更），必须单独输出为**一个围栏代码块**（```markdown 起），可整块复制粘贴；**块内自足**——钉值、判点、路径、验收口径齐全，不依赖块外上下文；**块外只留一句「已落盘：<路径>」**，不得用散文/裸表格散落正文。禁引用块（>）交付。
- **客户端操作硬边界（2026-10-24 起，AGENTS「客户端操作纪律」同款）**：凡需截图充当判据或辅助判定的测试（tooltip/GUI/渲染/手感面），操作一律由用户本人执行；AI 会话（含会话七）不得操控鼠标/键盘、不得抢焦点/拉起最小化窗口、不得模拟点击游戏内按钮——实证违规在案（T6② 验证拉窗控鼠）。任务书含 client 面必须写明「由用户操作」。
- 会话分工与 sessionID 查主 mod 项目 `playground\sessions.md`（会话五=终审、会话七=测试执行、会话九=健忘会话/WorkBuddy 文书外判）。ETIM-Extra 内裸称「会话X」含义与主项目不一致时，以 ETIM-Extra 主会话发布的『身份与关系硬规定 v2』为准。

## 现役充账漏斗锚点（hunger 面，2026-10-23 落码态）
- **漏斗**：`ETIMEndurance.charge()` 四门 = `world.isRemote` / `!foodModel` / `isCreativeMode` / `disableDamage`（<判点锚>，镜像 R196 :1875/:1881）+ hungerPoolCap 40 clamp + `[FoodLog]` 分解行。
- **十支**：dig/attack/place/hoe/bow 带 `getEnduranceModifier`；移动系全裸充 mod=1.0——五支（dive 3D / swim 2D 共率 0.015、ladder 上升 dy/10、walk 0.01、sprint 0.05，`MixinEntityPlayer` TAIL → `chargeMovement` 复刻 vanilla 分支序）+ boat（α 钩子 `MixinNetHandlerPlayServer` processInput TAIL，×|moveForward|）+ waterJump（C03 dy>0 && isInWater()||isInLava() 位移代理，chargeMovement 平行面）。
- 服务端 moveForward/isJumping 唯一喂入 = C0C（`processInput:318`，setEntityActionState 全树唯一调用点）；C0C 仅骑乘发送——水中跳意图面在非骑乘恒不可测（终审 <判点锚-a>=C），位移代理漂移按 <判点锚-b> 判读。
- 玩家可感知数值与开关必须进 `ETIMConfig`（food 节），不预防性抽象内部实现。

## 构建与验证
- 编译（workdir = 本项目根 `D:\OpenCodeWorkspace\ETIM-Extra`，长输出落盘只看尾部）：
  `$env:JAVA_HOME = "C:\Users\GreatCoffee\tools\jdk-25.0.4.1+1"; .\gradlew.bat reobfJar --console=plain *> build-logs\xxx.out`
- **一次 rebuild 一个指纹**：验证窗钉 jar 指纹期间禁 rebuild；仅注释/文档 commit 不 rebuild。
- 现役钉值（jar 字节 + SHA256 + commit）查账本 §五 与审计回执，不硬编码在本技能。
- git 收口主会话专责；testharness 资产不混入产品 commit。

## 测试工装
- `testharness\`：runServer 25565 + RCON 25575 + mineflayer 假玩家 + 日志 tail 判读器。
- `testharness\player\move-run.js`：M0-M5 相位 + land/serverPos 原语（移动窗）。
- `testharness\player\bw-run.js`：B0-B9 相位 + sendInput/tpTo/ground/unmount/boardBoat 原语（船/水/岩浆窗）。
- C0C 喂入假玩家：minecraft-data 1.12.2 的 `packet_steer_vehicle` 线格式即 C0C（f32+f32+u8 位掩码）——`bot._client.write('steer_vehicle',{sideways,forward,jump})`。**下骑前必须先发 forward=0 的 C0C**：服务端 moveForward 经 setEntityActionState 仅 isRising 生效，否则下骑后 travel 带陈旧输入产生伪 walkDrain。
- 1.12 一船双座（canFitPassenger<2）→ 驾驶者/乘客面可同船布点；1.12.2 选择器语法：`@e[type=...,c=1]`（`c=`，`limit=` 是 1.13+）。
- 潜水段行数可能多于位移包数：vanilla 服务端双调用点（processPlayer:411/:589 + travel:1989）补行属同源双计，判值落「每包恰 1 行 + base/mod 逐位」。
- 钩未触发（0 行）排查次序：先查 `mixins.etim.refmap.json` 是否含目标方法映射，再报 FAIL。
- 收口纪律：出交付书前先优雅关 obf 客户端——`testharness\client\close-client.ps1`（WM_CLOSE 等价，等 latest.log `Stopping!` + Gradle `BUILD SUCCESSFUL`，再 `-Snapshot` 快照 latest.log）。禁 `taskkill`/`Stop-Process` 直杀游戏 JVM。

## 关键开发规范

### Mixin使用
- 修改原版类时，优先使用`@Inject`，设置合理优先级
- Mixin配置通过`build.gradle`的`MixinConfigs`清单属性注册；配置文件`src/main/resources/mixins.etim.json`
- 1.12.2 SRG 面：`@Inject`/`@Redirect` 的 method/target 写 MCP 名 + `remap = true`，refmap 由构建生成

### Capability系统
- 玩家自定义状态数据必须使用Capability存储
- 实现`readNBT`和`writeNBT`方法确保存档持久化
- 通过网络包同步到客户端

### 版本适配
- 所有社区Minecraft Skill的示例可能基于1.20.1+，使用前必须适配到1.12.2 API
- 1.12.2生产运行时是SRG映射；@SideOnly 在专用端运行面确有成员剥离（便利构造器编译面有、运行面无——工装 T1 教训，服务端建包用 Accessor 注入不走 CLIENT 构造器）
- Forge事件总线在1.12.2中的用法与高版本不同（使用`@SubscribeEvent`注解）
- 玩家登录/重生事件在`net.minecraftforge.fml.common.gameevent.PlayerEvent`（1.12 FML/Forge总线已合一）

## 兼容性硬性要求（兼容.md，用户2026-10定为长期约束）

必须兼容**Forge 14.23.5.2847专用服务端**与以下mod的最新版：
JEI 4.22.0.1034、Just Enough Characters 3.7.3、Fence Jumper 1.0.5、Inventory Sorter 1.13.3+57、
OptiFine 1.12.2 HD U G5、SmoothFont 2.1.4、JourneyMap 6.0.10、Mouse Tweaks 2.10.1、
Rebind 2.7.5-0、RAD 1.1.0、StepUp 1.0.2、The One Probe 1.4.28
（版本为2026-10-07下载时的最新1.12.2版，jar已在`run/mods`，OptiFine/SmoothFont/Rebind暂存`workspace\optifine-hold\`）

开发时必须遵守：
- **专用服务端安全**：所有逻辑只放公共(`net/minecraftforge.fml.relauncher.Side#BOTH`兼容)路径，绝不加载`client.*`类
- **JEI/TOP**：不要用@Redirect独占合成容器/常用原版调用点（JEI深hook工作台与Timer），优先`@Inject`
- **OptiFine/SmoothFont/ReBind等coremod改写型mod在RFG deobf开发环境不兼容**（KeyBinding/GlStateManager类改写SRG失配），它们的兼容验证走混淆环境`runObfClient`或发布前整合实测
- **MITE数值以R196为准**：出生/重生=满当前等级上限（0级=6HP/6营养/6饱食）；"3格饥饿=6点"；上限公式`clamp(6+level/5*2,6,20)`；一手判决以R196反编译源码为准（见「双一手树」）

## Token与落盘纪律
- 长输出命令一律落盘 `testharness\build-logs\`，对话只读尾部。
- 大于 20KB 的档案不进根目录（归 `playground\`）。
- 判据链验收只回传路径，按需 grep/read，不整档回贴。
- 纯文档/审计轮不加载 mod 相关 skill。

## 纪律红线（AGENTS.md 浓缩，全会话适用）
1. 不保留向后兼容：过时的直接删，不加兼容层、不写 migration、不留 fallback。
2. 选能满足当前需求的最简单实现，不预防性抽象；玩家可感知数值与开关必须可配置。
3. 系统分层长：先跑通最小端到端，再往上加；绝不为未完成的复杂度拆掉能跑的东西。
4. 先翻项目已有依赖与一手树，不从零发明。
5. 架构决策往长了做，不接受临时方案。

## 项目阶段（现状以账本为准，此为骨架）
1. 基础玩家状态（血/饥饿双池、经验加成、回血、饮食状态）✓
2. 采集与破坏限制（距离、工具门控、饥饿惩罚、requiresTool 重建）✓
3. 合成时间系统（服务器权威计时器、品质阶梯）✓
4. 熔炉与金属体系（热量阶梯、经验奖励）✓
5. 生物AI强化（消散链、属性表、生成周期、家畜需求）✓（三蜘蛛 spawn 留 v2+）
6. 资源再生与游牧机制（蓝月周期、区块冷却）
7. 下界/地下世界与传送门
8. 附魔（Endurance 已闭）、天气时钟（已闭）、死亡惩罚（已闭）

开放单与状态以 `playground\doc\v1.5-账本.md` §五 产品任务单为唯一事实源。

## 参考资源
- 账本：`playground\audit\audit-extra-裁定回执.md`（append-only，本项目唯一裁定账本）；判决链四件套同目录。挂条到主项目 `audit20-裁定回执.md` 的动作由主 mod 主会话执行。
- 会话分工：主 mod 项目 `playground\sessions.md`；本项目口径按 ETIM-Extra 主会话『身份与关系硬规定 v2』
- MITE机制文档：MC百科 MITE页面
- MITE源代码分析：FishModLoader、MappingIsTooHard、Vineflower
- 已有移植项目：ICPM、mitemc
