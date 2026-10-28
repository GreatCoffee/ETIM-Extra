# 【提示词 · 主 mod 主会话】ETIM-Extra 五金属盾批次闭单交接

## 一、抬头

- 发起方：ETIM-Extra 主会话（附属项目 `D:\OpenCodeWorkspace\ETIM-Extra`）
- 收件方：主 mod 主会话（Easy Times In Minecraft）
- 性质：**交接 + 三项收口请求**，不请求复核任何判点，不请求改主 mod 代码
- 回执方式：一句「已挂条 / 已提交 / 无动作 + 理由」即可，**不需要重跑任何验证窗**

## 二、事实（截至 2026-10-28）

ETIM-Extra 盾面三批已全部闭单：

| 批次 | 内容 | 状态 |
|---|---|---|
| 首批 | 秘银盾 / 艾德曼盾（物品、派生耐久、6 锭配方、isShield 接入减半链） | 闭单（W-1…W-8 全 ✓，会话七验证） |
| 3D 面 | vanilla `ModelShield` + per-item TEISR + 共享 blocking 模型 + 64×64 重着色纹理 | 闭单（用户判「一切正常」） |
| 补种 | 铜 / 银 / 远古金属三件补齐为**五金属盾**；配方行改从注册表反读 + 6 锭合约断言；真实合成臂；三件逐一受击臂 | 闭单（W-9…W-15 全 ✓；W-13/W-14 经会话七独立复跑同值） |

**钉值（当前唯一有效）**：jar `build/libs/etimextra-0.1.0.jar` **30,259 B**｜SHA-256 `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93`｜mtime 2026-10-28 21:32:34｜产品码 commit `7f6c472`｜**0 rebuild**。

**附属交付面（供主会话核兼容）**：

- 五件物品：`etimextra:copper_shield`／`silver_shield`／`ancient_metal_shield`／`mithril_shield`／`adamantium_shield`。
- 配方：shaped `"X X" / "XXX" / " X "`，X = 该金属锭，**6 锭**；锈铁无锭故无盾；金/铁保留 vanilla。
- 耐久（**派生值**，非 R196 一手）：`4.0 × 1 × d × 100` ⇒ 1,600／1,600／6,400／25,600／102,400。
- 附魔度（一手，读主 mod `ETIMMetals` 行）：30／30／40／100／40。
- 格挡：**零磨损/零减半代码**，全部走主 mod `combat/ETIMBlocking`（8→4、1→1 地板、`(int)(blocked × shieldWearRate)`）；不接品质档、无 mixin、无新日志通道。

## 三、请主会话做的三件事

1. **挂条（建议做）**：在主项目账本 `playground/audit/audit20-裁定回执.md` 追加一条跨项目条目，记录「ETIM-Extra 五金属盾批次闭单」，附上上面的钉值与附属账本位置（本附属 `playground/audit/audit-extra-裁定回执.md` 条 1–22）。**只登记事实，不改任何判值。**
2. **主项目 `testharness/README.md`（请核归属）**：它当前在主 mod 仓库是未跟踪（`??`），同目录还有若干未跟踪的 `player/*.js`。若按跨项目裁定它应作为「一行索引」提交，请主会话收口；若不提交，请说明归处——本附属侧不再重复落索引。
3. **依赖运营口径（知悉即可）**：ETIM-Extra 通过 `gradle/scripts/extra.gradle` 从 `mavenLocal` 取 `etim` 工件。主 mod **每次重建或改版本后请执行 `gradlew publishToMavenLocal`**，否则附属开发构建会继续拿旧 jar。当前该脚本已提交，无待办。

## 四、明确不要做的

- **不要改主 mod 代码**：本批零派修。`/etest hurt` 在未 op 时静默 `NO_TARGET`（`EntitySelector.java:135` 权限门 + `TestDriver.java:165` 不带 `detail=`）已裁定「只记工装纪律」（D-2 = ①），不升 B 级、不补日志行。
- **不要改 `ETIMBlocking` 的减半/地板/磨损**：五件盾全部挂在这条链上；如确需改，请先通知 ETIM-Extra（附属的耐久分母与磨损读数依赖它）。
- **不要改 `ETIMMetals` 的 `durabilityFactor` / `enchantability`**：附属的派生耐久与附魔度直接读这两列；改了等于改附属数值，需同步重钉值。
- **不要重跑验证窗**：本批判据已由主会话 + 会话七双执行方跑过（W-13/W-14 独立复跑同值）。

## 五、参考路径（全部在 ETIM-Extra 仓库）

- 账本：`playground/audit/audit-extra-裁定回执.md`（条 1–22，append-only）
- 首批判据：`playground/audit/extra-shield-落码批文.md`（W-1…W-8，§4 已按 D-1 改 W-7 为日志面）
- 补种判据：`playground/audit/extra-shield-补种批文.md`（W-9…W-15）
- 回执：`testharness/reports/extra-shield-verdict.md`（首批）／`extra-shield-craft-verdict.md`（真实合成）／`extra-shield-family-verdict.md`（补种数值面）／`extra-shield-family-hit-verdict.md`（三件受击）／`extra-shield-craft-rerun-verdict.md`（会话七复跑）
