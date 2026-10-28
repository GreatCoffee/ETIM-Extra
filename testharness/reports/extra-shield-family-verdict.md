# ETIM-Extra 盾面补种 冒烟窗回执（铜盾 / 银盾 / 远古金属盾）

- **判据正本**：`playground/audit/extra-shield-补种批文.md`（§1 判值正本、§3 W-9…W-12）
- **窗口**：2026-10-28 21:32:50 – 21:33:18（`runServer` 单轮，stdin `stop`）
- **执行方**：ETIM-Extra 主会话。本批无新机制面（类 `ETIMExtraItemShield` 一行未改、无 mixin、无新通道），故按「零行为面工装可主会话直裁」执行，**未经会话七**；如需正式窗见 §五待裁。
- **结论**：W-9 ✓、W-10 ✓、W-11 ✓（静态锚）｜判点 ✗ **0**｜冲突 **A 0 / B 0 / C 4**｜可闭单

## 一、钉值（起窗 = 收口，逐位同值）

| 项 | 值 |
|---|---|
| jar | `build/libs/etimextra-0.1.0.jar` **30,259 B** |
| SHA-256 | `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93` |
| mtime | 2026-10-28 21:32:34 |
| HEAD | `44fb5cc`（本批 commit 之前） |
| rebuild | **0**（窗口前构建一次；窗口内未重跑 jar/reobf） |

## 二、W-9 注册与派生耐久（`[ExtraLog]`，原样）

```
[ExtraLog] shield item=etimextra:copper_shield metal=copper maxDamage=1600 enchantability=30 stack=1
[ExtraLog] shield item=etimextra:silver_shield metal=silver maxDamage=1600 enchantability=30 stack=1
[ExtraLog] shield item=etimextra:ancient_metal_shield metal=ancient_metal maxDamage=6400 enchantability=40 stack=1
[ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1
[ExtraLog] shield item=etimextra:adamantium_shield metal=adamantium maxDamage=102400 enchantability=40 stack=1
```

- 五条逐值对 §1 表：铜 `4×1×4×100=1600`／银 `1600`／远古 `4×1×16×100=6400`／秘银 `25600`／艾德曼 `102400`；附魔度 30/30/40/100/40 全为材料行一手值。
- 反例检查：无 `maxDamage=0`、无 `maxDamage=336`（继承 `ItemShield` 的迹象）、无跨金属串值。

## 三、W-10 配方 6 锭 + 产物（`[ExtraLog]`，原样）

```
[ExtraLog] shield recipe=etimextra:shield_copper ingot=etim:ingot_copper count=6 output=etimextra:copper_shield
[ExtraLog] shield recipe=etimextra:shield_silver ingot=etim:ingot_silver count=6 output=etimextra:silver_shield
[ExtraLog] shield recipe=etimextra:shield_ancient_metal ingot=etim:ingot_ancient_metal count=6 output=etimextra:ancient_metal_shield
[ExtraLog] shield recipe=etimextra:shield_mithril ingot=etim:ingot_mithril count=6 output=etimextra:mithril_shield
[ExtraLog] shield recipe=etimextra:shield_adamantium ingot=etim:ingot_adamantium count=6 output=etimextra:adamantium_shield
[ExtraLog] shield recipes total=5
```

- 五行 `count=6`、`ingot` 与 `output` 逐条配对无错位；`total=5` 与注册表实际条数一致（尾随组合键也算进 `etimextra` 命名空间，本 mod 无其它配方）。
- **判据强度**：本批起三列全部从 `CraftingManager.REGISTRY` 里**已注册**的配方反读（`IRecipe.getIngredients()` 非空格数 + 首个材料物品 + `getRecipeOutput()`），不再是照抄入参的常量。首批 `count=6` 是常量，形状打错也会打 6；本批不会。

## 四、W-11 形状合约（静态锚，javap）

- `javap -p -constants`：`private static final int INGOTS_PER_SHIELD = 6;`
- `javap -p -c` 的 `addShieldRecipe`：`bipush 6` → 比较 → `new java/lang/IllegalStateException`（两处，分别为「配方缺失」与「slots≠6」）。
- 语义：形状一旦被改成 5 或 7 个 X，`preInit` 当场抛异常中止加载，**不会**带着错配方进游戏。

## 五、生命周期与工作区

- `Done (0.524s)!` → `Stopping the server` → `Saving worlds`（21:32:57 → 21:33:18），stdin `stop`，Gradle `BUILD SUCCESSFUL`，退出码 0。
- `run/crash-reports` 近 15 分钟 **0** 个新文件。
- 日志 `Exception/ERROR` 17 行，逐行核对**全部为环境噪声**：Maven 库目录格式（FML `ERROR` ×2）、FML 签名缺失（×1）、fernflower 反编译提示（×14）——**无一来自本 mod**。
- 配置：`run/config/etimextra.cfg` 自动补出三键 `copperDurability=1600`／`silverDurability=1600`／`ancientMetalDurability=6400`，读回值与 §1 同；`B:extraDebugLog` 窗内 `true`，收口还原 `false`。
- 工作区：产品码 = 本批改动（未提交，见账本条 16）；`run/` 不入版本库。

## 六、冲突分级

| 级 | 条 | 内容 |
|---|---|---|
| **A** | 0 | 无产品码缺陷、无需 rebuild |
| **B** | 0 | 五条耐久、五条配方全有可 grep 行 |
| **C** | 4 | C-1 `shield recipe` 行新增 `output=` 字段（旧批文 §4 的期望行不含该字段；旧判据正则 `count=(\d+)` 未锚尾，仍匹配 ⇒ 不破坏既有判据，仅补强）；C-2 模型资源由「每金属一对」合并为「5 base + 1 共享 `shield_blocking`」（同名删除 2 个旧文件，样式等价）；C-3 客户端未起，图标/名字/姿态未判；C-4 本窗由主会话执行而非会话七 |

## 七、待裁

1. **客户端三面**：**已裁定（2026-10-28，用户）**——五件图标、名字、右键姿态**均正常**，W-12 ✓（用户面，非日志判据）。
2. **已补（2026-10-28 21:41）**：真实合成臂 W-13／W-14 已跑通，回执 `testharness/reports/extra-shield-craft-verdict.md`——五腿「锭 −6、盾 +1」全 PASS，铜盾 5 锭门为 null。**残项**：会话七独立复跑（可选）；五件逐一受击臂仍未做（机制与首批同源，未加新面）。
3. 锈铁盾、金/铁盾是否要破例（**建议不破**：锈铁无锭、金铁在 R196 保留 vanilla 物品）。
