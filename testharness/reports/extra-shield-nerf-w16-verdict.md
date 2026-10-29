# ETIM-Extra 盾面削弱批 · W-16 回执（L0 判点表，七腿 × 两臂）

- **判据正本**：`playground/audit/盾面削弱批-对照报告.md` §5（L0 判点表）+ §6（spectral 判据面）+ §1.4（行形 / 落码实况，提交 `1cbaedb`）＋ 派修本 条 37（W-16 口径）
- **窗口**：2026-10-29 13:48:29 – 13:49:25（`gradlew runServer` 单轮，stdin `stop`）
- **驱动**：`testharness/player/extra-shield-nerf-w16.js`（tag `w16-nerf-l0`）
- **执行方**：ETIM-Extra 主会话（工装属本项目；会话七可原样复跑）
- **结论**：W-16 ✓（七腿全 PASS，14/14 行对表）｜判点 ✗ **0**｜冲突 **A 0 / B 0 / C 3（全为已在册登记）**｜L0 可闭单

## 一、钉值（起窗 = 收口）

| 项 | 值 |
|---|---|
| jar | **31,614 B** |
| SHA-256 | `2D42D78AE475E2261C9071B980322570EC7003FC86961771CF32D8374C847A98` |
| mtime | 2026-10-29 13:40:06 |
| rebuild | **0**（窗内未重跑 jar/reobf；判行来自同一份 `build/classes`） |

## 二、W-1 注册行（同一次起服，耐久分母）

```
[ExtraLog] shield item=etimextra:copper_shield metal=copper maxDamage=1600 enchantability=30 stack=1
[ExtraLog] shield item=etimextra:silver_shield metal=silver maxDamage=1600 enchantability=30 stack=1
[ExtraLog] shield item=etimextra:ancient_metal_shield metal=ancient_metal maxDamage=3200 enchantability=40 stack=1
[ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=6400 enchantability=100 stack=1
[ExtraLog] shield item=etimextra:adamantium_shield metal=adamantium maxDamage=12800 enchantability=40 stack=1
```

## 三、W-16 逐腿判行（原样；每腿 raw=8 与 raw=1 各一对，`wear` 先 / `block` 后）

### 铜盾 `etimextra:copper_shield`（1,600；55%）

```
wear player=ETIM_Harn16#0 item=etimextra:copper_shield shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=3.600 wear=9 dur=0->9
block player=ETIM_Harn16#0 src=etimspectral raw=8.000 blocked=3.600 factor=0.450 spectral=false min=1.000 carrier=etimextra:copper_shield
wear player=ETIM_Harn16#0 item=etimextra:copper_shield shield=true rate=2.500 mult=1.000 decay=na raw=1.000 blocked=1.000 wear=2 dur=9->11
block player=ETIM_Harn16#0 src=etimspectral raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:copper_shield
```

### 银盾 · 物理面 `etimextra:silver_shield`（1,600；40% / ×1.4）

```
wear player=ETIM_Harn16#0 item=etimextra:silver_shield shield=true rate=3.500 mult=1.400 decay=na raw=8.000 blocked=4.800 wear=16 dur=0->16
block player=ETIM_Harn16#0 src=etimspectral raw=8.000 blocked=4.800 factor=0.600 spectral=false min=1.000 carrier=etimextra:silver_shield
wear player=ETIM_Harn16#0 item=etimextra:silver_shield shield=true rate=3.500 mult=1.400 decay=na raw=1.000 blocked=1.000 wear=3 dur=16->19
block player=ETIM_Harn16#0 src=etimspectral raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:silver_shield
```

### 银盾 · 幽魂面 `etimextra:silver_shield`（65% 绝对值 / ×0.5）

```
wear player=ETIM_Harn16#0 item=etimextra:silver_shield shield=true rate=1.250 mult=0.500 decay=na raw=8.000 blocked=2.800 wear=3 dur=0->3
block player=ETIM_Harn16#0 src=etimspectral raw=8.000 blocked=2.800 factor=0.350 spectral=true min=1.000 carrier=etimextra:silver_shield
wear player=ETIM_Harn16#0 item=etimextra:silver_shield shield=true rate=1.250 mult=0.500 decay=na raw=1.000 blocked=1.000 wear=1 dur=3->4
block player=ETIM_Harn16#0 src=etimspectral raw=1.000 blocked=1.000 factor=1.000 spectral=true min=1.000 carrier=etimextra:silver_shield
```

### 远古金属盾 `etimextra:ancient_metal_shield`（3,200；65%）

```
wear player=ETIM_Harn16#0 item=etimextra:ancient_metal_shield shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=2.800 wear=7 dur=0->7
block player=ETIM_Harn16#0 src=etimspectral raw=8.000 blocked=2.800 factor=0.350 spectral=false min=1.000 carrier=etimextra:ancient_metal_shield
wear player=ETIM_Harn16#0 item=etimextra:ancient_metal_shield shield=true rate=2.500 mult=1.000 decay=na raw=1.000 blocked=1.000 wear=2 dur=7->9
block player=ETIM_Harn16#0 src=etimspectral raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:ancient_metal_shield
```

### 秘银盾 `etimextra:mithril_shield`（6,400；75%）

```
wear player=ETIM_Harn16#0 item=etimextra:mithril_shield shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=2.000 wear=5 dur=0->5
block player=ETIM_Harn16#0 src=etimspectral raw=8.000 blocked=2.000 factor=0.250 spectral=false min=1.000 carrier=etimextra:mithril_shield
wear player=ETIM_Harn16#0 item=etimextra:mithril_shield shield=true rate=2.500 mult=1.000 decay=na raw=1.000 blocked=1.000 wear=2 dur=5->7
block player=ETIM_Harn16#0 src=etimspectral raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:mithril_shield
```

### 艾德曼盾 `etimextra:adamantium_shield`（12,800；80%）

```
wear player=ETIM_Harn16#0 item=etimextra:adamantium_shield shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=1.600 wear=4 dur=0->4
block player=ETIM_Harn16#0 src=etimspectral raw=8.000 blocked=1.600 factor=0.200 spectral=false min=1.000 carrier=etimextra:adamantium_shield
wear player=ETIM_Harn16#0 item=etimextra:adamantium_shield shield=true rate=2.500 mult=1.000 decay=na raw=1.000 blocked=1.000 wear=2 dur=4->6
block player=ETIM_Harn16#0 src=etimspectral raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=etimextra:adamantium_shield
```

### 木盾对照 `minecraft:shield`（vanilla 支 ②，常量 50% / mult 1.0）

```
wear player=ETIM_Harn16#0 item=minecraft:shield shield=true rate=2.500 mult=1.000 decay=na raw=8.000 blocked=4.000 wear=10 dur=0->10
block player=ETIM_Harn16#0 src=etimspectral raw=8.000 blocked=4.000 factor=0.500 spectral=false min=1.000 carrier=minecraft:shield
wear player=ETIM_Harn16#0 item=minecraft:shield shield=true rate=2.500 mult=1.000 decay=na raw=1.000 blocked=1.000 wear=2 dur=10->12
block player=ETIM_Harn16#0 src=etimspectral raw=1.000 blocked=1.000 factor=1.000 spectral=false min=1.000 carrier=minecraft:shield
```

## 四、判读（与报告 §5 预测表逐格对表）

| 腿 | r | raw=8 blocked | factor（只判此臂） | rate / mult | raw=8 wear（dur） | raw=1 blocked | raw=1 wear（dur） |
|---|---|---|---|---|---|---|---|
| 铜 | 0.55 | **3.600** | **0.450** | 2.500 / 1.000 | **9**（0→9） | 1.000 | **2**（9→11） |
| 银·物理 | 0.40 | **4.800** | **0.600** | **3.500** / **1.400** | **16**（0→16） | 1.000 | **3**（16→19） |
| 银·幽魂 | 0.65 | **2.800** | **0.350** | **1.250** / **0.500** | **3**（0→3） | 1.000 | **1**（3→4） |
| 远古 | 0.65 | **2.800** | **0.350** | 2.500 / 1.000 | **7**（0→7） | 1.000 | **2**（7→9） |
| 秘银 | 0.75 | **2.000** | **0.250** | 2.500 / 1.000 | **5**（0→5） | 1.000 | **2**（5→7） |
| 艾德曼 | 0.80 | **1.600** | **0.200** | 2.500 / 1.000 | **4**（0→4） | 1.000 | **2**（4→6） |
| 木（对照） | 0.50 | **4.000** | **0.500** | 2.500 / 1.000 | **10**（0→10） | 1.000 | **2**（10→12） |

- **A-2 边界两格全对**：铜 raw=8 → **9**（不是 8）、艾德曼 raw=8 → **4**（不是 3）；8 / 3 若出现即为 epsilon 漏加，本窗未出现。
- **`factor` 只在 raw=8 臂判**（C-38-3）：raw=1 臂触 1.0 地板，打印 `1.000`，不参与 factor 判点。
- **不判击数**（B-5）：物理击数 = `floor(耐久 / wear) + 1`，表值为参考，不入判据。
- **`src=etimspectral` 全 14 行成立**（未出现 `src=mob`）；block 行 `spectral=false/true` 两面互证，银盾同一 item 两腿相邻跑。
- **`decay=na`** 全 7 腿成立（盾臂；工具臂才有整数 decay）。
- **L3（耐久附魔 III）未实测（依赖耐久附魔面统一批）**——本窗只判 L0，禁止标「不通过」。
- §6.3 判据 4（类型门拒绝行）**无命令入口**：`/etimghost` 只构造 `EntityDamageSource`，静态单例不可达；按设计登记，不作本窗判点。

## 五、配置与生命周期

- 窗内 `run/config/etim.cfg`：`B:blockDebugLog` 由 false 置 true（ASCII 替换、UTF-8 无 BOM），收口按**窗前字节副本整体还原**：回读 **30,629 B／SHA `BD37A2BF…D8CB85`**、与窗前**逐字节相同**（工装纪律 6 落地）。
- `Done (0.5s)` → 七腿 → stdin `stop` → `Saving worlds`，Gradle 退出码 **0**；`run/crash-reports` 0 个新文件；端口 25565 = 0。
- 证据：`testharness/build-logs/w16-nerf-l0-evidence.json`、`w16-nerf-l0-console.log`、`w16-nerf-l0-etim.cfg.before`（均在 git 忽略的 `build-logs/`）。
- 首跑（同窗，产品行已全对）因驱动按「block 在前」配对而误报 FAIL；判行本身正确，驱动改为「相邻即配、不判先后」后复跑全 PASS——与报告 §6.3 判据 1（`1cbaedb` 后）一致。

## 六、冲突分级

| 级 | 条 | 内容 |
|---|---|---|
| **A** | 0 | 无产品码缺陷、无需 rebuild |
| **B** | 0 | 14 行全有可 grep 判行，逐格与预测表同值 |
| **C** | 3 | ① 行序实装 `wear` 先 / `block` 后（报告 §6.2 旧示例相反；只判相邻，`1cbaedb` 已改写）；② `wear` 行多 `shield=<bool>`（超集，键值解析不受影响）；③ `block.factor` 实算 `blocked/raw`，地板臂打 `1.000`（判点钉：只在 raw=8 臂判） |

## 七、待裁

1. 是否要会话七原样复跑本窗（同 tag 换执行方）。
2. W-17…W-23 是否并入下一轮同一窗口；L3 列维持「未实测」，等耐久附魔面统一批。
