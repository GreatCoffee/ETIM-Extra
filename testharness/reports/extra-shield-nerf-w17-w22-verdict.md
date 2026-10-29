# ETIM-Extra 盾面削弱批 · W-17…W-22 回执（W-23 未跑，见 §七）

- **判据正本**：`playground/audit/盾面削弱批-对照报告.md`（定稿 `1cbaedb`）§2.9 W-16…W-23 判点表 + §1.4「落码实况」（行形 / 行序：只判相邻，不判先后）
- **窗口**：
  - 窗 A = W-16 窗（2026-10-29 13:48:29 – 13:49:25）——W-17 / W-18 / W-19 复用其判行（同一份日志、同一批码）
  - 窗 B = W-20 / W-21（2026-10-29 13:57:39 – 13:57:57）
  - 窗 C = W-22（2026-10-29 13:58:44 – 13:59:22）
- **驱动**：`extra-shield-nerf-w16.js`（tag `w16-nerf-l0`）、`extra-shield-nerf-w20-w21.js`（tag `w20-w21`）、`extra-shield-nerf-w22.js`（tag `w22-config`）
- **结论**：W-17 ✓｜W-18 ✓｜W-19 ✓｜W-20 ✓｜W-21 ✓｜W-22 ✓｜**W-23 未跑（本工作区无法卸载自身，见 §七）**；判点 ✗ 0；冲突 **A 0 / B 0 / C 2（均为工装正则，产品行正确）**

## 一、钉值（三窗同一份码，窗内 0 rebuild）

| 项 | 值 |
|---|---|
| jar | **31,614 B** |
| SHA-256 | `2D42D78AE475E2261C9071B980322570EC7003FC86961771CF32D8374C847A98` |
| mtime | 2026-10-29 13:40:06 |
| 产品码 | `d0bfd5c` |

## 二、W-17 地板（1 点伤害；只判 `blocked=1.000`）

```
铜          block ... raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:copper_shield
银·物理     block ... raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:silver_shield
银·幽魂     block ... raw=1.000 blocked=1.000 factor=1.000 spectral=true  min=1.000 carrier=etimextra:silver_shield
远古        block ... raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:ancient_metal_shield
秘银        block ... raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:mithril_shield
艾德曼      block ... raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:adamantium_shield
木          block ... raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=minecraft:shield
```

**判读**：七行全 `blocked=1.000`（未出现 0.800 / 0.200 等「减伤穿透地板」值）。**`factor=1.000` 在地板格是 `blocked/raw` 的商、不是减伤比例，本行不作判点**（判点钉：factor 只在 raw=8 臂判）。

## 三、W-18 磨损行（8 伤；`rate=` 总率 / `mult=` 乘子 / `decay=na`）

```
wear ... item=etimextra:copper_shield        shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=3.600 wear=9  dur=0->9
wear ... item=etimextra:silver_shield        shield=true rate=3.500 mult=1.400 decay=na raw=8.000 blocked=4.800 wear=16 dur=0->16
wear ... item=etimextra:silver_shield        shield=true rate=1.250 mult=0.500 decay=na raw=8.000 blocked=2.800 wear=3  dur=0->3
wear ... item=etimextra:ancient_metal_shield shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=2.800 wear=7  dur=0->7
wear ... item=etimextra:mithril_shield       shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=2.000 wear=5  dur=0->5
wear ... item=etimextra:adamantium_shield    shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=1.600 wear=4  dur=0->4
wear ... item=minecraft:shield               shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=4.000 wear=10 dur=0->10
```

**判读**：`wear` 值 10 / 9 / 16 / 3 / 7 / 5 / 4 全对表；`decay=na` 盾行成立；`mult` 未缺失（1.000 / 1.400 / 0.500 / 1.000 / 1.000 / 1.000 / 1.000）；`dur` 增量 = `wear`。**A-2 两格**：铜 8→**9**、艾德曼 8→**4**（未出现 8 / 3）。

## 四、W-19 幽魂面（银盾同一 item 两腿互证）

```
（物理）wear ... item=etimextra:silver_shield rate=3.500 mult=1.400 decay=na raw=8.000 blocked=4.800 wear=16 dur=0->16
        block ... src=etimspectral raw=8.000 blocked=4.800 factor=0.600 spectral=false min=1.000 carrier=etimextra:silver_shield
（幽魂）wear ... item=etimextra:silver_shield rate=1.250 mult=0.500 decay=na raw=8.000 blocked=2.800 wear=3 dur=0->3
        block ... src=etimspectral raw=8.000 blocked=2.800 factor=0.350 spectral=true min=1.000 carrier=etimextra:silver_shield
```

**判读**：同一天内 `spectral=false` / `true` 相邻两跑；`blocked` 4.800 / 2.800、`rate` 3.500 / 1.250、`mult` 1.400 / 0.500 成对，两行不同值（幽魂位已接，未恒 false）；`src=etimspectral` 全在案。

## 五、W-20 分母（`probe` 行）

```
probe ... held=etimextra:copper_shield        dur=0/1600
probe ... held=etimextra:silver_shield        dur=0/1600
probe ... held=etimextra:ancient_metal_shield dur=0/3200
probe ... held=etimextra:mithril_shield       dur=0/6400
probe ... held=etimextra:adamantium_shield    dur=0/12800
probe ... held=minecraft:shield               dur=0/336
```

**判读**：五盾分母 1,600 / 1,600 / 3,200 / 6,400 / 12,800 全为终裁值（旧 6,400 / 25,600 / 102,400 未出现）；木盾 336 不变。

## 六、W-21 三支分发

- **① `instanceof ETIMShield`**：五盾 8 伤 `factor` = 0.450 / 0.600 / 0.350 / 0.350 / 0.250 / 0.200（W-16 判行），**不是** 0.500 ⇒ 未被木盾常量吃掉。
- **② vanilla `ItemShield`**：木盾 `block factor=0.500`、`wear rate=2.500 mult=1.000`（W-16 判行）。
- **③ 工具臂（本窗补）**：

```
block ... src=etimspectral raw=8.000 blocked=4.000 factor=0.500 spectral=false min=1.000 carrier=etim:sword_copper
wear  ... item=etim:sword_copper shield=false rate=na mult=na decay=50 raw=8.000 blocked=4.000 wear=200 dur=0->200
```

  铜剑：`blocked = max(8×0.5, 1.0) = 4.000`（`blockDamageFactor` 剑臂），`wear = (int)(4.000 × 50) = 200`（`decay=50`，**无 epsilon**——工具臂一字未动），行形 `rate=na mult=na`。
- **config 复读**（`probe … cfg`，窗 B 全 6 次同值）：

```
probe ... cfg blockModel=true factor=0.500 min=1.000 shieldRateBase=2.500 woodReduction=0.500
```

## 七、W-22 config 生效（铜盾 55 → 60）

```
（窗内改 `shield.copper.reduction` 55→60 后重启）
block ... raw=8.000 blocked=3.200 factor=0.400 spectral=false min=1.000 carrier=etimextra:copper_shield
wear  ... item=etimextra:copper_shield shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=3.200 wear=8 dur=0->8
block ... raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:copper_shield
wear  ... item=etimextra:copper_shield shield=true rate=2.500 mult=1.000 decay=na raw=1.000 blocked=1.000 wear=2 dur=8->10
```

**判读**：`blocked` 8→3.200、`factor` 0.400、`wear` 8 逐位随 cfg 变；raw=1 地板臂不受影响（1.000 / 2）⇒ 配置是活值、且地板与磨率不随减伤漂移。收口两件 cfg 按字节还原（`etimextra.cfg` `0E6F1C44…9E6E5`、`etim.cfg` `BD37A2BF…D8CB85`，逐字节相同）。

## 八、W-23 未跑（如实登记）

W-23 的判法要求「**拔掉 Extra** 后木盾行与装 Extra 时逐位同值」。本工作区把附属放在运行 classpath 上（`implementation io.github.etim:etim:1.0.0:dev` + 自身 `build/classes`），**没有可用的卸载开关**；在自有构建树里挪 class 属破坏性操作、且会污染 Gradle 增量状态，故**未在本地执行**。
建议执行方：主 mod 工作区（无 `etimextra` 依赖）由会话七跑同一木盾腿（`/etest hold minecraft:shield` + `useitem` + `/etimghost hurt … 8 false` 或等价的 mob 伤），与 W-16 木盾行（`blocked=4.000 factor=0.500`、`wear rate=2.500 mult=1.000 wear=10`）逐位比对；本回执不预填结论。

## 九、冲突分级

| 级 | 条 | 内容 |
|---|---|---|
| **A** | 0 | 无产品码缺陷、三窗 0 rebuild |
| **B** | 0 | 判行齐、逐格对表 |
| **C** | 2 | ① W-22 驱动首跑正则组号写错（carrier 取 `b[7]`，实为 `b[8]`）→ 误报 FAIL，**产品行本身正确**（`blocked=3.200 factor=0.400 wear=8` 原样在），修正后复跑 PASS；② W-20 的 `blockprobe` 每次出两行（`probe … dur=` + `probe … cfg`），判据只取前者、不按行序取首行 |

## 十、未判项

- **L3（耐久附魔 III）**：全列「**未实测（依赖耐久附魔面统一批）**」，禁标「不通过」；969 / 2,327 / 5,818 仍为预测值。
- **§6.3 判据 4（类型门拒绝行）**：`/etimghost` 只构造 `EntityDamageSource`，静态单例不可达，按设计登记，不作判点。
- **击数**：一律不判（B-5）。
