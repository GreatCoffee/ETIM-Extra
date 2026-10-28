# ETIM-Extra 盾面补种 · 三件新盾逐一受击窗回执（W-15）

- **判据正本**：`playground/audit/extra-shield-补种批文.md` §3（W-15）＋ §4 验收线
- **窗口**：2026-10-28 21:59:33 – 22:00:17（`gradlew runServer` 单轮，stdin `stop`）
- **驱动**：`testharness/player/extra-shield-family-hit.js`（tag `17-shield-family-hit`）
- **执行方**：ETIM-Extra 主会话（工装属本项目；会话七可原样复跑）
- **结论**：W-15 ✓（三件全 PASS）｜判点 ✗ **0**｜冲突 **A 0 / B 0 / C 2**｜可闭单

## 一、钉值（起窗 = 收口）

| 项 | 值 |
|---|---|
| jar | **30,259 B** |
| SHA-256 | `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93` |
| mtime | 2026-10-28 21:32:34 |
| rebuild | **0**（窗内未重跑 jar/reobf） |

## 二、W-15 逐件判行（原样）

### 铜盾 `etimextra:copper_shield`（分母 1,600）

```
carrier item=etimextra:copper_shield class=io.github.etim.etimextra.shield.ETIMExtraItemShield block=false
gate player=ETIM_Harn07#0 active=etimextra:copper_shield src=mob suppressed=true
block player=ETIM_Harn07#0 src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:copper_shield
block player=ETIM_Harn07#0 src=mob raw=1.000 blocked=1.000 factor=0.500 min=1.000 carrier=etimextra:copper_shield
wear player=ETIM_Harn07#0 item=etimextra:copper_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4
wear player=ETIM_Harn07#0 item=etimextra:copper_shield rate=1.000 decay=na raw=1.000 blocked=1.000 wear=1 dur=4->5
probe player=ETIM_Harn07#0 held=etimextra:copper_shield dur=0/1600
probe player=ETIM_Harn07#0 held=etimextra:copper_shield dur=5/1600
```

### 银盾 `etimextra:silver_shield`（分母 1,600）

```
carrier item=etimextra:silver_shield class=io.github.etim.etimextra.shield.ETIMExtraItemShield block=false
gate player=ETIM_Harn07#0 active=etimextra:silver_shield src=mob suppressed=true
block player=ETIM_Harn07#0 src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:silver_shield
block player=ETIM_Harn07#0 src=mob raw=1.000 blocked=1.000 factor=0.500 min=1.000 carrier=etimextra:silver_shield
wear player=ETIM_Harn07#0 item=etimextra:silver_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4
wear player=ETIM_Harn07#0 item=etimextra:silver_shield rate=1.000 decay=na raw=1.000 blocked=1.000 wear=1 dur=4->5
probe player=ETIM_Harn07#0 held=etimextra:silver_shield dur=0/1600
probe player=ETIM_Harn07#0 held=etimextra:silver_shield dur=5/1600
```

### 远古金属盾 `etimextra:ancient_metal_shield`（分母 6,400）

```
carrier item=etimextra:ancient_metal_shield class=io.github.etim.etimextra.shield.ETIMExtraItemShield block=false
gate player=ETIM_Harn07#0 active=etimextra:ancient_metal_shield src=mob suppressed=true
block player=ETIM_Harn07#0 src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:ancient_metal_shield
block player=ETIM_Harn07#0 src=mob raw=1.000 blocked=1.000 factor=0.500 min=1.000 carrier=etimextra:ancient_metal_shield
wear player=ETIM_Harn07#0 item=etimextra:ancient_metal_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4
wear player=ETIM_Harn07#0 item=etimextra:ancient_metal_shield rate=1.000 decay=na raw=1.000 blocked=1.000 wear=1 dur=4->5
probe player=ETIM_Harn07#0 held=etimextra:ancient_metal_shield dur=0/6400
probe player=ETIM_Harn07#0 held=etimextra:ancient_metal_shield dur=5/6400
```

**判读**：三件逐件六项齐——carrier 行（主 mod 认作格挡载体）、`gate … suppressed=true`（全免段已关）、8 点半减到 4.000（factor 0.500）、1 点地板到 1.000（不是 0.500）、磨损 `(int)(4×1)=4` 且 `dur` 增量=4、续臂 1、耐久分母 = 各件配置值（1,600／1,600／6,400）。

> **`carrier … block=false` 的正确读法**：该字段是 `ETIMBlocking.isBlockCarrier`（主 mod **工具**格挡臂），盾走的是另一条 `isShieldStack` 臂，故 `false` 是预期值，不是缺陷；真正的门证是 `gate … suppressed=true` 与 `block … carrier=<盾>`。

## 三、配置与生命周期

- 窗内 `run/config/etim.cfg`：`B:blockDebugLog` 由 false 置 true（ASCII 替换、UTF-8 无 BOM），收口按**窗前字节副本整体还原**：回读 **30,629 B／SHA `44E368E5…AE9F2E`**、与窗前**逐字节相同**（工装纪律 6 落地）。
- `Done (0.5s)` → 三腿 → stdin `stop` → `Saving worlds`，Gradle 退出码 **0**；`run/crash-reports` 0 个新文件；端口 25565 = 0。
- 证据：`testharness/build-logs/17-shield-family-hit.out`、`17-shield-family-hit-evidence.json`、`17-shield-family-hit-driver.out`、`17-shield-family-hit-etim.cfg.before`。

## 四、冲突分级

| 级 | 条 | 内容 |
|---|---|---|
| **A** | 0 | 无产品码缺陷、无需 rebuild |
| **B** | 0 | 三件六项全有可 grep 行 |
| **C** | 2 | C-1 首跑驱动自身正则写错（把 `dur=0/<max>` 拿去匹配已捕获的 `0/<max>` 字段），三腿误报 FAIL；**产品行本身正确**（日志里 `dur=0/1600`、`dur=5/6400` 原样在），修正后复跑 PASS；首跑产物留档 `17-shield-family-hit-attempt1.*`。C-2 `carrier … block=false` 是 `isBlockCarrier`（工具臂）字段，盾走 `isShieldStack` 臂，预期为 false |

## 五、待裁

1. 是否要会话七原样复跑本窗（同 tag 换执行方）。
2. 「实际出什么附魔名」的用户面观察（本批第二个小项，另起客户端窗）。
