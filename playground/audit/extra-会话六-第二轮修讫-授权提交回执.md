# 【回执 · 附属主会话】第 2 轮修讫授权提交完成（3fd0d1b）+ 6 项复核 + 3 项残留（2026-10-29）

## 一、授权已执行（按你给的命令原文）

```
git add playground/audit/盾面削弱批-立项摸底.md playground/audit/盾面削弱批-对照报告.md
git commit -m "audit-extra: ShieldNerf 对照报告第2轮—附属6项缺陷修讫(键名统一/silver绝对65/markSpectral boolean+synchronized/B-10补行) + 摸底 epsilon两格口径统一"
```

- 提交 **`3fd0d1b`**（parent `f53e04d`）；`git show --name-status` **仅两路径**；未 `-A`；提交瞬间无其它暂存/未暂存改动；主 mod 树未触。
- 已推送：`f53e04d..3fd0d1b`，`origin/master` 与本地 HEAD 一致（3fd0d1b）。

## 二、两件机械核（与其自报逐位相同）

| 件 | 字节 | 行 | SHA-256 | 相对 1890f63 |
|---|---|---|---|---|
| 立项摸底 | **69,064** | 638 | `159AA07EB29DF9C010FE1A31F72C345FE1264E37E4226C4BC67F5145B1000566` | +28 / −29 |
| 对照报告 | **40,571** | 559 | `9512CA850E2B5A93EB69B0FA1D1BE89D01A317575E1CC7AC670CC4AA2D263F0B` | +36 / −18 |

两件 UTF-8 无 BOM、LF、0 U+FFFD、0 行尾空白。

## 三、6 项逐条核讫

| # | 项 | 实测 |
|---|---|---|
| 1 | 键名统一 | 摸底 `shieldBaseWearRate` **0**、`shieldWearRateBase` 8；报告仅 1 处旧名且位于自查表描述句，非活键 |
| 2 | 删死键 | `shield.wearRate` 活键已无；3 处提及均为删除说明；已加「附属不设基准磨率键」 |
| 3 | 8 键自洽 | 曲线 5 + `silver.spectralReduction` 1 + 银盾乘子 2；耐久 3 改值另列不计入 |
| 4 | 银盾绝对 65 | §2.1 字段 `spectralReduction`，`isSpectral ? spectralReduction : reduction`；D-7 已登记 §9-9 + 档尾 |
| 5 | markSpectral | `boolean` + `synchronizedSet`；true = 已上标（幂等恒 true）、false = 仅类型门；实现 `add(src); return true;` |
| 6 | B-10 补行 | §7.2 已有 B-10 行；B 计数 9 → 10 三处同步（§7.2 头、§9-8、档尾） |

自查追加两项也核了：epsilon 口径已统一（落码式 **2 格**：铜 8 伤 9.0、艾德曼 8 伤 4.0；全 float 乘 1 格；`+1e-4` 两算序均 21/21）；`ETIMSpectral.isSpectral` **0 残留**。

## 四、三条答复：接受，按此落码

1. **W-16 判面**：七行 × 两列与我表逐格一致（铜 9/2、银物 16/3、银幽 3/1、远古 7/2、秘银 5/2、艾德曼 4/2、木 10/2）。`devTools` 缺省 true 这条我记下了——起窗前只查有没有被本地 cfg 覆盖，不改默认。
2. **D-7**：绝对值方案采纳，三条理由我都认；我方实现四个字段全绝对，`silver.reduction` 改动不再带幽魂面。
3. **接口契约**：`boolean` + `synchronizedSet` 冻结，我方只依赖 `isSpectral`，不受 `markSpectral` 返回值影响。

## 五、3 项残留（C 级，不阻塞；我方按已定判面走）

1. **报告 §2.1 伪码缺字段声明**：`private final float wearMultiplier;` 没有（文字列了四参，代码块只声明 3 个，`getWearMultiplier` 里 `this.wearMultiplier` 悬空）。我方落码会声明，纯文档瑕疵。
2. **摸底 §3 判行表仍是旧形态**：`block … curve=<r> mult=<m>` + `src=mob`（`curve=` 5 处、`src=mob` 2 处），与 §1.4 定稿（`factor=retained`、无 `curve`、有 `min=`；`wear` 有 `rate`/`mult`/`decay`）不一致。W-16 判行以报告 §1.4 与条 31 为准，不按此表。
3. **报告 1 处 `shieldBaseWearRate`** 属自查表内的描述性引用，不作活键读。

## 六、状态

- 账本：**条 32** 已记（提交事实 + 6 项复核 + 3 项残留）。
- 产品码零改动、0 rebuild；jar **30,285 B｜`7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D`｜`c66c099`** 不变。
- 阻塞 0；等待项仍为：正式派修 + `ETIMShield`／`ETIMGhost` 同批 `publishToMavenLocal` + 接口 jar 钉值。
