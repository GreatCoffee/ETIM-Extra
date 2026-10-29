# 【回执 · 附属主会话】第 3 轮残修授权提交完成（4dff3b9）+ probe 编译点核讫（2026-10-29）

## 一、授权已执行（按你给的命令原文）

```
git add playground/audit/盾面削弱批-立项摸底.md playground/audit/盾面削弱批-对照报告.md
git commit -m "audit-extra: ShieldNerf 第3轮残修—补 wearMultiplier 字段声明 + 摸底§3判行表对齐§1.4(factor/spectral/min; wear rate/mult/decay) + probe config臂 shieldRateBase 编译点"
```

- 提交 **`4dff3b9`**（parent `6d8184d`）；`git show --name-status` **仅两路径**；未 `-A`；主 mod 树未触。
- 已推送：`6d8184d..4dff3b9`，`origin/master` 与本地一致。

## 二、两件机械核（与你自报逐位相同）

| 件 | 字节 | 行 | SHA-256 | 相对 6d8184d |
|---|---|---|---|---|
| 立项摸底 | **69,593** | 637 | `DEBA7FAB5210CF79EDCBF81E916C6675EE0DD3F5E58F827C1CBCD010408BB43A` | +9 / −10 |
| 对照报告 | **41,200** | 562 | `FCE21D713C4508B2C6DDA7A4781E4DDEFCCAC7EC8B698A87E77623EFFBC9F878` | +4 / −1 |

UTF-8 无 BOM、LF、0 U+FFFD、0 行尾空白。

## 三、三项残留：处置都对

| # | 处置 | 核讫 |
|---|---|---|
| 1 | 补 `private final float wearMultiplier;` | ✔ 报告 §2.1 第 4 行，注释 1.0／1.4 与取值表一致；P1 编译点消除 |
| 2 | 摸底 §3 判行表对齐 §1.4 | ✔ W-16 去 `curve=`、`factor=<1−r>`、`spectral=`、`min=`；W-18 补 `mult=`；W-19 两腿 `rate=3.500/1.250`、`mult=1.400/0.500`、`wear 16/3`、`src=etimspectral`；W-21 `decay=na` vs 数字；W-22 按 `shield.copper.reduction`→60（`blocked=3.200 factor=0.400`）。余 2 处 `curve=` 与 1 处 `src=mob` 均为散文／负例 |
| 3 | 报告 1 处旧键名不改 | ✔ 采纳：§10 修订记录内描述「摸底曾有 6 处旧名」，删了会失真；确认非活键 |

## 四、probe 编译点：核讫，且这是本轮最有价值的一条

`ETIMBlockLog.probeConfig`（`:141-145`）读 `ETIMConfig.shieldWearRate`，A-1 改名后字段不存在 ⇒ **不改必编译失败**，而 §1.4 只列 block／wear 两行确实是洞。现已：

- §1.4 标题「改两行」→「**改三行**」；
- 新增 `probe`（config 臂）行：`shieldRateBase=f3(ETIMConfig.shieldWearRateBase)` + 追加 `woodReduction=f3(ETIMConfig.shieldWoodReduction)`；
- §10 修订记录第 8 行留痕。

这与 N-7 的「6 处全改」口径对上（probe 就是第 6 处）。顺带说明：这类「改名字段但漏读点」是改名方案最容易踩的坑，剩下 5 处（`ETIMConfig:369/:869`、`ETIMBlocking:144/:153`、`ETIMBlockLog:145`）报告里都已列，我落码后会在 W-16 起窗前用 `src=etimspectral` 的 block/wear 两行反查，如果 probe 那一支没改，`probe` 行会直接缺字段或抛异常——窗内能抓到。

## 五、行形定稿：收到，按四种判

```
block              : block player=<n>#<id> src=<type> raw=8.000 blocked=3.600 factor=0.450 spectral=false min=1.000 carrier=etimextra:copper_shield
wear（盾）          : wear player=<n>#<id> item=… rate=2.500 mult=1.000 decay=na raw=8.000 blocked=3.600 wear=9 dur=0->9
wear（工具）        : wear … rate=na mult=na decay=50 raw=… blocked=… wear=… dur=…
probe（config 臂）  : probe player=<n> cfg blockModel=… factor=0.500 min=1.000 shieldRateBase=2.500 woodReduction=0.500
```

要点照录：`factor` = 保留系数（1−r）；`rate` = 有效总率（2.5×mult）；盾行 `decay=na`、工具行 `rate=na mult=na`；**无 `curve=`**。W-16 判行只认这四种，旧表不再引。

## 六、状态

- 账本：**条 33** 已记（提交事实 + 三项残留核讫 + probe 编译点 + 四行形定稿）。
- 产品码 0 改动、0 rebuild；jar **30,285 B｜`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`｜`c66c099`** 不变。
- 阻塞 0；等待项 = 正式派修 + `ETIMShield`／`ETIMGhost` 同批 `publishToMavenLocal` + 接口 jar 钉值。
