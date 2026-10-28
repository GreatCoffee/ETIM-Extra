# ETIM-Extra 盾面首批（秘银盾 / 艾德曼盾）验证窗判决回执

> **执行方**：会话七（验证窗执行）｜**委托方**：主会话「ETIM开发」｜**日期**：2026-10-28
> **追验对象**：`build/libs/etimextra-0.1.0.jar` **14,170 B @ 2026-10-28 20:35:50** = 产品 commit `54eed94`（land the mithril/adamantium shields …）。
> **判据正本**：`playground/audit/extra-shield-落码批文.md` §1 判值正本 + §4 判点。
> **现役钉值**：jar **14,170 B @ 20:35:50**｜SHA256 `470809B0…3E5519A`｜HEAD `54eed94`｜窗内 **0 rebuild**（起收同值，逐位）。
> **判据源**：服务端 `[ExtraLog]` / `[BlockLog]` / `[EnchantLog]` / `[EtimTest]` 日志行 ＋ 假人（mineflayer）作业面 ＋ 构建产物 `javap` 静态锚。**本窗未起任何客户端**（C/D 面待用户，见 §三 C-5）。
> **口径**：通过 ✓、不通过 ✗；**判点 ✗ = 0**（W-1…W-8 服务端/静态锚全 PASS；纯客户端与附魔台 GUI 面列「待用户」）。
> **叉号口径**：本报告里的 ✗ 计数全部来自「判点 ✗ = 0」这类**否定式陈述**＋规格行自指，**正文实判 0 项 FAIL**。
> **报告字节规格**：`27,249 B｜UTF-8 无 BOM｜LF｜0 U+FFFD｜✓ 41 / ✗ 10｜330 行`

---

## 零、基线核讫（逐位）

| 项 | 钉值（任务书） | 实测（起窗 / 收口） | 判 |
|---|---|---|---|
| jar 字节数 | 14,170 B | **14,170 B** / **14,170 B** | ✓ |
| jar mtime | 2026-10-28 20:35:50 | **20:35:50** / **20:35:50** | ✓ |
| SHA256 | `470809B0…3E5519A` | `470809B038359F706EE22419538DBC2433C5CAE15D56D145217E813F23E5519A`（两次同值） | ✓ 逐位 |
| HEAD | 起窗记 | `54eed9429dfd37c69fdde0617955849e4fa681b6` / 同值 | ✓ |
| 窗内 rebuild | 禁止 | `runServer` 8 轮从未重跑 `jar`/`reobf`，字节·SHA·mtime 全同 → **0 次** | ✓ |
| 世界 | `run/server.properties` | `level-name=extra-smoke`｜`online-mode=false`｜`gamemode=0`｜`difficulty=2`｜`enable-rcon=false` | ✓ |
| 端口 | 25565 | 收口 `Get-NetTCPConnection -LocalPort 25565` = **0** | ✓ |
| 崩溃报告 | 0 | `run/crash-reports/` 目录不存在（本窗 0 崩溃） | ✓ |
| 追踪脏值 | 产品码 0 | `git status --porcelain` = **4 条 `??`**（本窗新增工装）＋ **1 条 `M testharness/README.md`**（本窗追加的工装文档）；产品码 / 资源 / `build.gradle` **0 改动** | ✓ |

### 0.1 窗口前置（配置，逐项写进回执）

| 文件 | 键 | 窗内值 | 处置 |
|---|---|---|---|
| `run/config/etimextra.cfg` | `debug.extraDebugLog` | **true** | 落码轮已置，本窗沿用未改 |
| `run/config/etimextra.cfg` | `shield.mithrilDurability` | **25600** | 默认值，未改 |
| `run/config/etimextra.cfg` | `shield.adamantiumDurability` | **102400** | 默认值，未改 |
| `run/config/etim.cfg` | `combat.blockDebugLog` | **true**（窗内） | **本窗唯一改动的键**：false → true（开窗改、收口还原，回读 SHA 与窗前一字节同值 `44E368E5…AE9F2E`） |
| `run/config/etim.cfg` | `blockModel` / `blockDamageFactor` / `blockMinDamage` / `shieldWearRate` | **true / 0.5 / 1.0 / 1.0** | 已是目标值，未改 |
| `run/ops.json` | 假玩家 `ETIM_Harn07` | **level 4** | 窗内由控制台 `op` 写入（B 面选择器解析的前置，见 §三 C-2）；原值 `[]` |

> `[BlockLog]` 的 `probe … cfg` 行是配置的一手回读：`blockModel=true factor=0.500 min=1.000 shieldRate=1.000`（每轮 blockprobe 都落一次）。

### 0.2 起停服台账（8 轮，同一 jar）

| 轮 | tag | 结果 | 备注 |
|---|---|---|---|
| R1 | `12-stdin-probe` | `Done (` → `say` 回显 → `Saving worlds` | 控制台 stdin 通道自检：**中途写入可用**（不是只读启动那一次） |
| R2 | `12-shield-verdict-server`（尝试 1） | 起服 OK，B 面 `NO_TARGET` | 选择器写法问题，见 §三 C-2；`.out` 被同 tag 覆盖 |
| R3 | `12-shield-diag` | 起服 OK，`testfor` 矩阵全 `Found Zombie` | 定位：不是选择器语法，是**权限门**（`deop` 与否对照在正本窗重做） |
| R4–R6 | `12-shield-verdict-server`（尝试 2/3/4） | 判行全对，但附加臂致死（R196 血上限 6）／scoreboard 语法噪声 | 作废重跑，见 §三 C-3；`.out` 被覆盖 |
| **R7** | **`12-shield-verdict-server`（判决正本）** | `Done (0.670s)` 20:59:27 → `phase=end` 20:59:54 → `Stopping the server` 20:59:56 → `Saving worlds`；gradle **BUILD SUCCESSFUL** | 本回执全部 W-1…W-6 判行出自此轮 |
| R8 | `12-shield-enchant` | `Done (` 21:01:0x → `Stopping the server` 21:01:14 + `Saving worlds` | W-7 附魔臂（同一 jar） |

### 0.3 快照与产物

| 产物 | 字节 | 说明 |
|---|---|---|
| `testharness/build-logs/12-shield-verdict-server-latest.log` | 67,010 B | 正本窗服务端全档（含 boot/Done/Stopping/Saving worlds） |
| `testharness/build-logs/12-shield-verdict-server.out` | 83,049 B | gradle + 服务端全量输出 |
| `testharness/build-logs/12-shield-verdict-server-evidence.json` | 18,013 B | 逐点判定 + 判行原句 + 探针分组 |
| `testharness/build-logs/12-shield-enchant-latest.log` · `-evidence.json` | 59,032 B · 1,649 B | W-7 附魔臂 |
| `testharness/build-logs/12-shield-diag-latest.log` · `-rows.txt` | 64,303 B · 12,665 B | 选择器诊断矩阵 |
| `testharness/build-logs/12-stdin-probe.out` | 66,909 B | 控制台 stdin 自检 |
| `testharness/build-logs/12-etim.cfg.before` | 30,629 B | `run/config/etim.cfg` 窗前备份（还原后 SHA 同值） |
| `testharness/build-logs/12-shield-pin.txt` | 778 B | 钉值档 |

---

## 一、判决类清单

| # | 判点 | 判 | 关键判值 |
|---|---|---|---|
| **W-1** | 注册与耐久 | **PASS** | mithril `maxDamage=25600 enchantability=100 stack=1`；adamantium `102400 / 40 / 1` |
| **W-2** | 配方 6 锭 | **PASS** | 两条 recipe 行 `count=6` + `shield recipes total=2` |
| **W-3** | 全免段已关（gate） | **PASS** | `gate … active=etimextra:mithril_shield src=mob suppressed=true` |
| **W-4** | 半减 + 下限 | **PASS** | `raw=8.000 blocked=4.000 factor=0.500 min=1.000`；下限臂 `raw=1.000 blocked=1.000` |
| **W-5** | 磨损 rate 臂 | **PASS** | `rate=1.000 decay=na wear=4 dur=0->4`；下限臂 `wear=1 dur=4->5` |
| **W-6** | 耐久读数 | **PASS** | `dur=0/25600` → `5/25600`；adamantium `0/102400` → `4/102400`（**分母 = 配置值，不是 336**） |
| **W-7** | 附魔门 | **PASS（服务端臂）** | 日志 `enchantability=100 / 40`；`[EnchantLog] table power=15 slot0/slot1/slot2` = **4/12/30**（秘银）、**7/11/30**（艾德曼），对照 `minecraft:stick` = **0/0/0**；附魔台 GUI 与「实际出什么附魔」= 用户面待用户 |
| **W-8** | 品质不生效 | **PASS（静态锚）** | jar 内 `ETIMExtraItemShield extends net.minecraft.item.Item`；`ETIMQuality.hasQualityChannel` 六个 `instanceof` 全不命中 → `set()` 直接 return；tooltip 面待用户 |

**总记**：判值正本 §1 的九项（耐久 25,600／102,400、附魔度 100/40、6 锭配方、磨损 `(int)(blocked×rate)`、`isShield→true + BLOCK 使用态`、品质不接、堆叠 1、半减 0.5/下限 1.0）**全部逐值命中**，**判点 ✗ = 0**。W-7 的三档附魔本次**用日志判**（批文原列为用户面），GUI 与附魔名降为可选用户面；W-8 只到静态锚（批文原口径）。

---

## 二、逐 W 核讫

### W-1 · 注册与耐久

| 判据 | 钉值（批文 §1） | 实测 | 判 |
|---|---|---|---|
| 秘银盾耐久 | 25,600 | `maxDamage=25600` | ✓ |
| 艾德曼盾耐久 | 102,400 | `maxDamage=102400` | ✓ |
| 附魔度 | 100 / 40 | `enchantability=100` / `enchantability=40` | ✓ |
| 堆叠 | 1 | `stack=1` / `stack=1` | ✓ |

判行原句（本窗新生成，非复用落码轮）：

```
[20:59:26] [Server thread/INFO] [ETIM-Extra]: [ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1
[20:59:26] [Server thread/INFO] [ETIM-Extra]: [ExtraLog] shield item=etimextra:adamantium_shield metal=adamantium maxDamage=102400 enchantability=40 stack=1
```

> 两行在 `preInit` 内、内容注册时逐件输出（`ETIMExtraContent.register` → `ETIMExtraLog.shield`，`ETIMExtraLog.java:58`），故「值对」同时证明构造器读到了配置与 R196 材料行，而非回落 0。

### W-2 · 配方 6 锭

| 判据 | 钉值 | 实测 | 判 |
|---|---|---|---|
| 秘银盾配方 | `"X X"/"XXX"/" X "`，6 锭 `etim:ingot_mithril` | `count=6 ingot=etim:ingot_mithril` | ✓ |
| 艾德曼盾配方 | 同上，6 锭 `etim:ingot_adamantium` | `count=6 ingot=etim:ingot_adamantium` | ✓ |
| 本 mod 配方总数 | 2 | `shield recipes total=2`（从 `CraftingManager.REGISTRY` 实数计数） | ✓ |

```
[20:59:26] … [ExtraLog] shield recipe=etimextra:shield_mithril ingot=etim:ingot_mithril count=6
[20:59:26] … [ExtraLog] shield recipe=etimextra:shield_adamantium ingot=etim:ingot_adamantium count=6
[20:59:26] … [ExtraLog] shield recipes total=2
```

> `total=2` 是注册表实数（不是常量回显）：若形状注册失败，这条会掉到 0/1。

### W-3 · 全免段已关（gate）

| 判据 | 钉值 | 实测 | 判 |
|---|---|---|---|
| 举盾受击出现 gate 行 | 出现 | 出现（mithril 两臂 + adamantium 一臂，共 3 行） | ✓ |
| `active` 是本体盾 | `etimextra:mithril_shield` | 同 | ✓ |
| `suppressed` | `true` | `true` | ✓ |
| `src` | mob 源 | `src=mob` | ✓ |

```
[20:59:41] [Server thread/INFO] [Easy Times In Minecraft]: [BlockLog] gate player=ETIM_Harn07#1 active=etimextra:mithril_shield src=mob suppressed=true [server]
```

> 该行来自主 mod `MixinEntityLivingBaseBlock.java:41`（`canBlockDamageSource` HEAD，`cir.setReturnValue(false)`）：出现即证 1.12 的 `amount = 0` 全免段被关掉，盾的减伤改由 `ETIMBlocking#onLivingHurt` 的 50% 承担。

### W-4 · 半减 + 下限

| 判据 | 钉值 | 实测 | 判 |
|---|---|---|---|
| `blocked = max(raw×0.5, 1.0)` | raw 8 → 4 | `raw=8.000 blocked=4.000` | ✓ |
| `factor / min` | 0.500 / 1.000 | `factor=0.500 min=1.000` | ✓ |
| `carrier` 是本盾 | 是 | `carrier=etimextra:mithril_shield` | ✓ |
| 下限臂：raw 1 → max(0.5, 1.0) | 1.000 | `raw=1.000 blocked=1.000`（**不是 0.500**） | ✓ |
| 第二件独立成 carrier | adamantium | `carrier=etimextra:adamantium_shield`，`raw=8.000 blocked=4.000` | ✓ |

```
[20:59:41] … [BlockLog] block player=ETIM_Harn07#1 src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:mithril_shield [server]
[20:59:44] … [BlockLog] block player=ETIM_Harn07#1 src=mob raw=1.000 blocked=1.000 factor=0.500 min=1.000 carrier=etimextra:mithril_shield [server]
[20:59:51] … [BlockLog] block player=ETIM_Harn07#1 src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:adamantium_shield [server]
```

> 下限臂是越出批文示例的补充：批文只给 raw=8 的样例，`min=1.000` 是否**真的生效**要看 raw≤2 的臂——本窗补了 raw=1，`blocked=1.000` 正是下限抬升而非 0.500。

### W-5 · 磨损 rate 臂

| 判据 | 钉值 | 实测 | 判 |
|---|---|---|---|
| `wear = (int)(blocked × rate)` | 4.000 × 1.0 = 4 | `wear=4` | ✓ |
| `decay` | `na`（盾走 rate 臂，不是工具的 decay 臂） | `decay=na` | ✓ |
| `dur` 增量 = wear | 0 → 4 | `dur=0->4`，且下一臂 `dur=4->5` 连续 | ✓ |
| 生存模式（创造不磨损） | 生存 | `gamemode 0`，`dur` 实际递增 | ✓ |

```
[20:59:41] … [BlockLog] wear player=ETIM_Harn07#1 item=etimextra:mithril_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4 [server]
[20:59:44] … [BlockLog] wear player=ETIM_Harn07#1 item=etimextra:mithril_shield rate=1.000 decay=na raw=1.000 blocked=1.000 wear=1 dur=4->5 [server]
[20:59:51] … [BlockLog] wear player=ETIM_Harn07#1 item=etimextra:adamantium_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4 [server]
```

> `decay=na` 是「走对臂」的硬判据：盾若被当成工具载体，`decay` 会变成工具衰减系数（剑 50），wear 会是 `4×50=200`。分叉在 `ETIMBlocking.java:140`（`wearShieldOrTool`），行的拼装在 `ETIMBlockLog.java:119`。

### W-6 · 耐久读数

| 判据 | 钉值 | 实测 | 判 |
|---|---|---|---|
| 分母 = 配置值 | 25600 / 102400 | `dur=0/25600`、`dur=5/25600`、`dur=0/102400`、`dur=4/102400` | ✓ |
| 分母不是 336（继承 `ItemShield` 的迹象） | ≠336 | 全部 25600/102400 | ✓ |
| 分子随磨损下降 | 递增 | 0 → 5（mithril，4+1）、0 → 4（adamantium） | ✓ |
| 使用态读数 | `handActive=true … same=true` | 见下方 state 行 | ✓ |

```
[20:59:33] … [BlockLog] probe player=ETIM_Harn07#1 held=etimextra:mithril_shield dur=0/25600 [server]
[20:59:35] … [BlockLog] probe player=ETIM_Harn07#1 held=etimextra:mithril_shield dur=0/25600 [server]
[20:59:35] … [BlockLog] state player=ETIM_Harn07#1 handActive=true active=etimextra:mithril_shield held=etimextra:mithril_shield same=true [server]
[20:59:46] … [BlockLog] probe player=ETIM_Harn07#1 held=etimextra:mithril_shield dur=5/25600 [server]
[20:59:50] … [BlockLog] probe player=ETIM_Harn07#1 held=etimextra:adamantium_shield dur=0/102400 [server]
[20:59:53] … [BlockLog] probe player=ETIM_Harn07#1 held=etimextra:adamantium_shield dur=4/102400 [server]
```

> 同族补充：`action item=etimextra:mithril_shield action=BLOCK`（`getItemUseAction` 生效）、`carrier … block=false`（盾**不在** R196 工具白名单，走的是 `isShield` 臂而不是 `isBlockCarrier` 臂——这正是 b+c 裁定的形态）、`pre-use state handActive=false` → `use 后 handActive=true`（`onItemRightClick → setActiveHand` 生效）。

### W-7 · 附魔门（服务端臂）

| 判据 | 钉值 | 实测 | 判 |
|---|---|---|---|
| 附魔度日志值 | 100 / 40 | `enchantability=100` / `enchantability=40` | ✓ |
| 附魔台三档非 0 | 三档均 >0 | 秘银 **4 / 12 / 30**；艾德曼 **7 / 11 / 30** | ✓ |
| 对照臂（0 附魔度） | 全 0 | `minecraft:stick` → **0 / 0 / 0** | ✓ |
| 附魔台 GUI 三档 + 实际出什么附魔 | 用户面 | **待用户**（本窗未起客户端） | 待用户 |

```
[21:01:08] … [EnchantLog] table power=15 slot0=4 slot1=12 slot2=30 power30=30 slot0=4 slot1=17 slot2=30 bound=slot0:2..10,slot1:6..21,slot2:30..30 (power clamped to 15) [server]
[21:01:10] … [EnchantLog] table power=15 slot0=7 slot1=11 slot2=30 power30=30 slot0=4 slot1=12 slot2=30 bound=slot0:2..10,slot1:6..21,slot2:30..30 (power clamped to 15) [server]
[21:01:12] … [EnchantLog] table power=15 slot0=0 slot1=0 slot2=0 power30=30 slot0=0 slot1=0 slot2=0 bound=slot0:2..10,slot1:6..21,slot2:30..30 (power clamped to 15) [server]
```

> 三行 = 秘银盾 / 艾德曼盾 / `minecraft:stick`。`/etest enchantprobe mainhand` 直接调 `EnchantmentHelper.calcItemStackEnchantability`（`CommandDevTest.java:380`，附魔台 GUI 用的是同一函数），所以「三档非 0」这件事**从用户面提升成了日志判据**；对照臂同时排除「命令恒返回非 0」的假正。

### W-8 · 品质不生效（静态锚）

| 判据 | 钉值 | 实测 | 判 |
|---|---|---|---|
| 盾不接品质通道 | `hasQualityChannel(盾) == false` | `ETIMExtraItemShield extends net.minecraft.item.Item` → `ETIMQuality.java:78` 的六个 `instanceof`（`ItemTool/ItemSword/ItemShears/ItemHoe/ItemArmor/ItemBow`）全不命中 | ✓ |
| 写入被拒 | `set()` 对非载体直接 return | `ETIMQuality.java:136` 首行 `if (!hasQualityChannel(stack.getItem())) return;`（不写 NBT，故 tooltip 无品质行） | ✓ |
| tooltip 无品质行 | 用户面 | **待用户**（本窗未起客户端） | 待用户 |

静态锚一手（对**构建产物**取，不是对源码取）：

```
public final class io.github.etim.etimextra.shield.ETIMExtraItemShield extends net.minecraft.item.Item {
  public boolean isShield(net.minecraft.item.ItemStack, net.minecraft.entity.EntityLivingBase);
  public net.minecraft.item.EnumAction func_77661_b(net.minecraft.item.ItemStack);
  public int func_77626_a(net.minecraft.item.ItemStack);
  public net.minecraft.util.ActionResult<net.minecraft.item.ItemStack> func_77659_a(net.minecraft.world.World, net.minecraft.entity.player.EntityPlayer, net.minecraft.util.EnumHand);
  public int func_77619_b();
}
```

> `func_77619_b` = `getItemEnchantability`（W-7 的来源）、`func_77661_b` = `getItemUseAction`、`func_77626_a` = `getMaxItemUseDuration`、`func_77659_a` = `onItemRightClick`、`isShield` 直覆写——六条方法面在字节码里都在。

---

## 三、冲突分级

### A 级（阻断闭单）：**0 条**

判值正本 §1 九项逐值命中，W-1…W-8 无反例；无产品码缺陷，无需 rebuild。

### B 级（判定通道缺口）：**0 条**

本批每个数值面都有可 grep 的行且字段足以判真假；W-7 的三档附魔已由 `[EnchantLog] table power` 补成日志面（原为用户面），W-8 只需要静态锚。

### C 级（登记，不阻塞）：6 条

1. **C-1 · `[BlockLog]` 尾标与批文表述冲突**：批文 §3 写「本行长尾没有 `[server]` 后缀（主 mod 的 `[BlockLog]` 同样没有）」，实际 `[BlockLog]` **有** ` [server]` 尾标（`ETIMBlockLog.row` 字面 `"[BlockLog] %s [server]"`），`[ExtraLog]` 才没有。判据按行内字段匹配、尾标不入判据（两处文件都这么写），故**不影响任何判点**；建议批文 §3 改成「`[ExtraLog]` 无尾标、`[BlockLog]` 有 `[server]` 尾标，尾标一概不入判据」。
2. **C-2 · 假玩家必须 op 才能解析 mob 选择器（本窗一手）**：`/etest hurt <mob-selector>` 走 `EntitySelector.matchOneEntity(player, …)`，入口 `EntitySelector.java:135` 的 `sender.canUseCommand(1, "@")`；权限级 0 的玩家解析结果为空集，**且不抛异常**（`TestDriver.java:165` 落 `NO_TARGET` 而不带 `detail=`）。本窗实测对照：`De-opped ETIM_Harn07` 20:59:36 → 20:59:37 `NO_TARGET`（block 行 0）→ `Opped ETIM_Harn07` 20:59:39 → 20:59:41 落 gate/wear/block 三行。**登记为工装纪律**：凡走 `/etest hurt <selector>` 的窗，假人先进 `ops.json` 或窗内 `op`。
3. **C-3 · R196 血上限 6，多臂连打必死（本窗一手）**：`run/config/etim.cfg` `capAtLevel0=6`（读处 `PlayerStatLimits.java:29`），故 `20 HP` 那套算术不适用；8 点 raw 减半后 4 点，两臂就掉到 2/1 点血。本窗前几轮在附加臂（adamantium）出现 `ETIM_Harn07 was slain by Zombie`——**属工装前置缺失，不是产品缺陷**；正本窗改为每臂后 `etest health 6`（日志 `health_set … params=[6.0, 6]`），全窗 0 死亡。**登记为工装纪律**：R196 基座下多臂伤害窗每臂必须复位血量。
4. **C-4 · mob 选择器要求「恰好一个」匹配**：`matchOneEntity` 只在 `list.size() == 1` 时返回实体，否则 null。故本窗每臂先 `kill @e[type=!player]` 再召唤单只带 `Tags:["shx"]` 的僵尸；两只同名僵尸会让它静默失败。已写进 driver 注释。
5. **C-5 · 客户端四面（C 面）与附魔台 GUI（D 面）本窗未做**：任务书 §4 的 C/D 面是用户操作面，本窗**未起任何客户端**（未征得用户点头即不起）。静态侧已核：`zh_cn.lang` 有「秘银盾／艾德曼盾」、`en_us.lang` 有英文名、两件模型为 `item/handheld` + `layer0`、纹理是 16×16 RGBA（`colorType=6`，**126/256 不透明像素**，非全透明、非紫黑）。运行时观感（图标、手持模型、右键举盾姿态、tooltip 无品质行）**待用户**。
6. **C-6 · 任务书指定的 `run-server.ps1` 不适用于交互窗**：该脚本按 `-StopAfterSeconds` 自动 `stop`，中途不能下发命令，且本项目未挂主项目的 `RConThreadClient` binpatch（B-EXTRA-2：stock RCON 一连接一包）。本窗改用新增的 `testharness/server/server-console.js`（同一 stdin 通道，保留管道 + TCP 行桥），先由 `console-probe.js` 自检验证「运行中途可写入」。建议把该脚本收进 `testharness/server/` 常规件（本窗已落）。

---

## 四、收口表

| 项 | 终态 |
|---|---|
| 客户端 | **本窗未起客户端**（0 个游戏窗口；C/D 面待用户） |
| 服务端 | 全部 8 轮均 stdin `stop` 优雅停：正本窗 `Stopping the server` 20:59:56 → `Saving worlds`；附魔臂 `Stopping the server` 21:01:14 → `Saving worlds`；进程退出码 0；端口 25565 = **0** |
| 产品面 | jar **14,170 B @ 20:35:50**｜SHA256 `470809B0…3E5519A`｜HEAD `54eed94`｜**0 rebuild**（起收逐位同值） |
| 配置 | 窗内唯一改动 `run/config/etim.cfg` `blockDebugLog` false→true，**已还原**（回读 SHA 与窗前一字节同值）；`run/ops.json` 新增假人 level 4（工装面，未还原） |
| 工作区 | 产品码 / 资源 / `build.gradle` **0 改动**；`git status` tracked dirty = **1** 条，仅 `testharness/README.md`（本窗追加的工装文档） |
| 用户操作面 | AI 侧未操控鼠标键盘、未拉窗抢焦点；本窗无客户端可操作 |

---

## 五、待主会话裁决位

1. **C-1**：批文 §3 的尾标表述要不要改（`[BlockLog]` 实有 `[server]`）——纯口径，不影响判点。
2. **C-2 / C-3 / C-4**：三条工装纪律是否固化进 `testharness/README.md`（op 前置、每臂复位血量、单只 mob + Tags）。
3. **C-5**：客户端四面 + 附魔台 GUI 要不要**另开一个用户面窗**（需用户开客户端；AI 可先把 C/D 面的观察清单与判据行写好）。
4. **W-7 口径**：本窗已把「附魔台三档非 0」判成日志面（`[EnchantLog] table power`），是否把批文 §4 的 W-7 从「用户面」改为「日志面 + GUI 仅作转述」。
5. 本批**A 级 0 条**，判点 ✗ = 0 → **可以闭单**（C-5 的客户端面按用户面另行登记，不阻塞数值面）。

---

## 六、转达块（围栏，整块复制给主会话）

````markdown
【ETIM-Extra · 盾面首批 验证回执】W-1…W-8：判点 ✗ = 0

钉值：jar 14,170 B @ 2026-10-28 20:35:50｜SHA256 470809B038359F706EE22419538DBC2433C5CAE15D56D145217E813F23E5519A｜HEAD 54eed94｜0 rebuild（起收逐位同值）
回执：D:\OpenCodeWorkspace\ETIM-Extra\testharness\reports\extra-shield-verdict.md（27,249 B｜330 行｜✓ 41 / ✗ 10｜UTF-8 无 BOM、LF、0 U+FFFD）
证据：testharness/build-logs/12-shield-verdict-server-{latest.log,out,evidence.json}、12-shield-enchant-{latest.log,evidence.json}、12-shield-diag-{latest.log,rows.txt}、12-stdin-probe.out、12-etim.cfg.before、12-shield-pin.txt

一、判决类清单
| # | 判点 | 判 | 关键判值 |
|---|---|---|---|
| W-1 | 注册与耐久 | PASS | mithril 25600/100/1；adamantium 102400/40/1 |
| W-2 | 配方 6 锭 | PASS | 两条 recipe count=6 + recipes total=2 |
| W-3 | 全免段已关 | PASS | gate active=etimextra:mithril_shield src=mob suppressed=true |
| W-4 | 半减 + 下限 | PASS | raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=盾；下限臂 raw=1.000→blocked=1.000 |
| W-5 | 磨损 rate 臂 | PASS | rate=1.000 decay=na wear=4 dur=0->4；续臂 wear=1 dur=4->5 |
| W-6 | 耐久读数 | PASS | dur=0/25600→5/25600；adamantium 0/102400→4/102400（非 336） |
| W-7 | 附魔门 | PASS（服务端臂） | enchantability 100/40；[EnchantLog] table power=15 slot0/1/2 = 4/12/30 与 7/11/30，对照 stick=0/0/0 |
| W-8 | 品质不生效 | PASS（静态锚） | javap：ETIMExtraItemShield extends Item；hasQualityChannel 六实例全不命中 → set() 直接 return |

二、W-1…W-6 判行（正本窗 20:59）
- W-1：[20:59:26] [ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1（adamantium 102400/40 同形）
- W-2：[20:59:26] [ExtraLog] shield recipe=etimextra:shield_mithril ingot=etim:ingot_mithril count=6（+adamantium count=6；recipes total=2）
- W-3：[20:59:41] [BlockLog] gate player=ETIM_Harn07#1 active=etimextra:mithril_shield src=mob suppressed=true [server]
- W-4：[20:59:41] [BlockLog] block player=ETIM_Harn07#1 src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:mithril_shield [server]（下限臂 20:59:44 raw=1.000 blocked=1.000）
- W-5：[20:59:41] [BlockLog] wear player=ETIM_Harn07#1 item=etimextra:mithril_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4 [server]（续臂 20:59:44 wear=1 dur=4->5）
- W-6：[20:59:33] probe … dur=0/25600 → [20:59:46] dur=5/25600 → [20:59:50] adamantium dur=0/102400 → [20:59:53] dur=4/102400
- W-7（附魔臂 21:01）：[EnchantLog] table power=15 slot0=4 slot1=12 slot2=30（秘银）／slot0=7 slot1=11 slot2=30（艾德曼）／slot0=0 slot1=0 slot2=0（stick 对照）

三、冲突分级
A 级：0（无产品码缺陷，无需 rebuild）
B 级：0（数值面全有可 grep 行；W-7 三档已日志化）
C 级：6 条
  C-1 批文 §3「[BlockLog] 无 [server] 尾标」与实码不符（实有），判据按行内字段匹配、尾标不入判据 → 不影响判点，建议改口径
  C-2 假玩家必须 op：未 op 时 /etest hurt <selector> 解析空集且不抛异常（EntitySelector.matchEntitiesDefault 要求 canUseCommand(1,"@")）；本窗实测 De-opped→NO_TARGET、Opped→三行齐
  C-3 R196 血上限 capAtLevel0=6，多臂连打致死（前几轮附加臂出现 slain by Zombie）→ 工装前置改为每臂 etest health 6，正本窗 0 死亡
  C-4 matchOneEntity 要求恰好一个匹配 → 每臂 kill 后单只召唤 + Tags
  C-5 客户端四面（图标/模型/显示名/右键姿态/tooltip）与附魔台 GUI 本窗未做（未起客户端）；静态侧已核 lang、item/handheld 模型、16×16 RGBA（126/256 不透明像素）
  C-6 任务书指定的 run-server.ps1 自动停服、不适用交互窗；本窗新增 server-console.js（同 stdin 通道，console-probe.js 已自检）

四、收口
客户端：本窗未起（0 窗口，C/D 面待用户）
服务端：8 轮全部 stdin stop 优雅停（正本窗 Stopping the server 20:59:56 → Saving worlds；附魔臂 21:01:14）；退出码 0；端口 25565 = 0；0 crash-report
产品面：14,170 B / 470809B0…3E5519A / 54eed94 / 0 rebuild（mtime 20:35:50 未变）
工作区：产品码 0 改动；tracked dirty = 1 条（仅 testharness/README.md，本窗追加的工装文档）；新增未跟踪件 = testharness/player/{extra-shield-run.js,extra-shield-diag.js,extra-shield-enchant.js}、testharness/server/{server-console.js,console-probe.js}、testharness/build-logs/12-*、testharness/reports/extra-shield-verdict.md
配置：run/config/etim.cfg 的 blockDebugLog 窗内 true、已还原 false（回读 SHA 与窗前同值）；run/ops.json 新增 ETIM_Harn07 level 4（工装面）

五、待主会话裁决
1. C-1 批文尾标口径改不改（不影响判点）
2. C-2/C-3/C-4 三条工装纪律是否固化进 testharness/README.md
3. C-5 客户端四面 + 附魔台 GUI 是否另开用户面窗（需用户开客户端）
4. W-7 是否从「用户面」改判为「日志面 + GUI 仅转述」
5. 本批 A 级 0 条、判点 ✗ = 0 → 可闭单；客户端面另登记，不阻塞数值面
````
