# ETIM-Extra 金属材料盾 · 覆盖与推进报告（供主 mod 主会话）

## 一、抬头

- **出具方**：ETIM-Extra 主会话（`D:\OpenCodeWorkspace\ETIM-Extra`）
- **收件方**：主 mod 主会话（Easy Times In Minecraft）
- **事由**：主会话在等附属「其余金属材料盾」批次的推进结果 —— 本报告即正式答复
- **性质**：事实报告 + 覆盖清单；**不请求改主 mod 代码**，不请求复核任何判点，不请求重跑验证窗
- **出具时间**：2026-10-28 22:13

## 二、结论（先给判）

**不存在名为「其余金属材料盾」的待推进批次，也没有未处理材料。**

主 mod `ETIMMetals` 枚举共 **6 行**（`metal/ETIMMetals.java:37-42`）；其中 **5 行有锭**，已各出一盾并全链闭单；第 6 行 `RUSTED_IRON` **无锭**（R196 一手口径：无锭、无锭基配方，只有锁链甲四件），按同一裁定不出盾；金/铁按裁定保留原版。

⇒ 该批次的推进结果 = **已完成**（等价于已闭单的「五金属盾」批），**剩余材料 0、待办 0、阻塞 0、待改代码 0**。

## 三、材料覆盖矩阵（逐行，非推测）

| 材料（`ETIMMetals`） | 枚举行 | 锭（`ETIMItems` 注册） | 附属盾 | 状态 |
|---|---|---|---|---|
| `COPPER` | `:37` | `ingot_copper`（`ETIMItems.java:46`） | `etimextra:copper_shield` | 闭单（W-9／W-10／W-11／W-15） |
| `SILVER` | `:38` | `ingot_silver`（`:47`） | `etimextra:silver_shield` | 闭单（同上） |
| `ANCIENT_METAL` | `:39` | `ingot_ancient_metal`（`:50`） | `etimextra:ancient_metal_shield` | 闭单（同上） |
| `MITHRIL` | `:40` | `ingot_mithril`（`:48`） | `etimextra:mithril_shield` | 闭单（W-1…W-8） |
| `ADAMANTIUM` | `:41` | `ingot_adamantium`（`:49`） | `etimextra:adamantium_shield` | 闭单（W-1…W-8） |
| `RUSTED_IRON` | `:42` | **无**（`ETIMGear.java:195-205` 明注：rusted iron has NO ingot and NO ingot-based recipes） | **不出** | 与主 mod 锈铁装备同口径：只有链甲四件、仅战利品（`ETIMMetalLoot`） |

**枚举外**：金／铁盾按 R196 保留原版物品，附属不接管、不另立物品。

## 四、五件盾的最终数值面（当前有效）

| 物品 | 耐久（派生） | 附魔度（一手） | 配方 | 格挡 |
|---|---|---|---|---|
| `copper_shield` | 1,600 | 30 | `"X X" / "XXX" / " X "` ×6 铜锭 | 走主 mod `ETIMBlocking` |
| `silver_shield` | 1,600 | 30 | 同形 ×6 银锭 | 同上 |
| `ancient_metal_shield` | 6,400 | 40 | 同形 ×6 远古金属锭 | 同上 |
| `mithril_shield` | 25,600 | 100 | 同形 ×6 秘银锭 | 同上 |
| `adamantium_shield` | 102,400 | 40 | 同形 ×6 艾德曼锭 | 同上 |

- **耐久为派生值**（R196 无盾，A-1 已裁）：`4.0 × 1 × durabilityFactor × 100`，`durabilityFactor` 直读 `ETIMMetals`（4／4／16／64／256）。**这是派生值，不是 R196 一手判值**，登记时不得写成一手上限。
- **附魔度为一手值**：直读 `ETIMMetals.enchantability`（30／30／40／100／40），未另立表、无 quality 通道、无 Mending 白名单。
- **配方**：R196 材料列形状，纯金属 6 锭；运行期从 `CraftingManager.REGISTRY` 反读并断言非空格数 = 6（少一格即 `IllegalStateException`）。
- **合成数值**：`difficulty = 150.0`（6×25）、`period = 102` ticks、`quality = AVERAGE`、`xp = 0`（盾不是品质载体，T-4）。

## 五、证据链（均已跑过，非待跑）

| 面 | 判据 | 结果 |
|---|---|---|
| 首批两件 | 落码批文 W-1…W-8 | 全 ✓（账本条 1–14） |
| 客户端 3D 面 | vanilla `ModelShield` + per-item TEISR + 共享 `shield_blocking` + 64×64 重着色 | 用户判 **正常**（W-12，账本条 15–16） |
| 补种三件数值面 | 补种批文 W-9／W-10／W-11 | 全 ✓（账本条 17–19） |
| 真实合成 | W-13 六锭门／W-14 五腿 `consumed=6 gained=1` | ✓；**会话七独立复跑同值**（账本条 20） |
| 逐一受击 | W-15 三件（铜／银／远古）carrier／gate／半减／地板／磨损／分母 | 全 ✓（账本条 21） |
| 附魔名（用户面） | 秘银 3×耐久 III；铜 I／I／II；无 Mending／诅咒 | 符合机制（账本条 22） |

- 回执（`testharness/reports/`）：`extra-shield-verdict.md`／`extra-shield-craft-verdict.md`／`extra-shield-family-verdict.md`／`extra-shield-family-hit-verdict.md`／`extra-shield-craft-rerun-verdict.md`。
- 账本：`playground/audit/audit-extra-裁定回执.md` **条 1–23**（append-only）。
- 交接：`playground/audit/extra-主会话-交接提示词.md`；主 mod 侧已以条 114 + `testharness/README.md` §7（commit `7a26c6f`）收口，附属已核讫（条 23）。

## 六、口径边界（明确不做，均有裁定在案）

1. **锈铁盾**：无锭 → 不出（与主 mod 锈铁装备同口径）。
2. **金／铁盾**：保留原版（R196 未改）。
3. **Mending 白名单**：不做；附魔台只出 Unbreaking，Mending 走附魔书 + 铁砧（与原版一致）。
4. **盾的品质档**：不做（`quality=AVERAGE xp=0` 实测）。
5. **禁用原版盾**：不做（原版 6 木板 + 1 铁锭仍在）。
6. **举盾遮挡**：属原版机制，由资源包调整，本项目不干预。
7. **格挡代码**：附属零自有实现，全部走主 mod `combat/ETIMBlocking`（8→4、1→1 地板、`(int)(blocked × shieldWearRate)`）。

## 七、需要主会话回一句的唯一情况

若主会话所指「其余金属材料」是 `ETIMMetals` **六行之外**的材料（例如其他 mod 的金属，或新计划加入的金属），请给出材料清单与判值来源；附属按新批立项（会话六摸底 → 对照报告 → 会话五终审 → 落码 → 验证窗），**不会**自行推断材料表。

若所指就是上述五金属批，则**无动作**：本报告即闭单结果，附属侧不再重复立同名批次。

## 八、钉值（当前唯一有效）

- jar：`build/libs/etimextra-0.1.0.jar` **30,259 B**
- SHA-256：`A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93`
- mtime：2026-10-28 21:32:34｜产品码 commit `7f6c472`｜**0 rebuild**
- 本报告零落码、零 rebuild，钉值与闭单时逐位相同。
