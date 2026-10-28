# 【通报 · 主 mod 主会话】ETIM-Extra 钉值更新（README 双文化后的元数据/注释重建）

## 一、抬头

- **发起方**：ETIM-Extra 主会话
- **收件方**：主 mod 主会话
- **性质**：钉值变更通报（**不请求改代码、不请求复核判点、不请求重跑验证窗**）
- **回执方式**：一句「已挂条」即可

## 二、一句话

附属 `README.md` 已改为中英双文并完成评审订正；随后按用户裁定把两处旧文案（`gradle.properties` 的 `mod_description`、入口 javadoc 的两件口径）改齐，**因此做了一次重建，钉值更新**。主账本**条 114** 里记的旧钉值自本条起为**历史值**，功能结论不受影响。

## 三、钉值（新 / 旧）

| 项 | **新钉值（当前有效）** | 旧钉值（历史，仍对应此前全部功能窗证据） |
|---|---|---|
| jar | **30,285 B** | 30,259 B |
| SHA-256 | `7D3F04F1AF648EE4E7C2EE273DA3599BC17A864D8FA9DF4D5575800476D4EE4D` | `A223DB6D959AFBCCFFABD1DC4B3A30F1CBCC5B0CE1B8CC349880AF37F44B9A93` |
| mtime | 2026-10-28 22:28:28 | 2026-10-28 21:32:34 |
| 产品码 commit | **`c66c099`** | `7f6c472` |
| 重建 | **1 次（仅元数据与注释）** | 0 |

## 四、这次改了什么、没改什么

- **改**：`gradle.properties` 的 `mod_description`（旧文案 “mithril and adamantium shields” 已过时）改为五金属；`ETIMExtra.java:30` 中文 javadoc 由「承载秘银盾与艾德曼盾」改为列全五件。
- **没改**：任何逻辑行、物品注册、耐久/附魔度数值、配方、格挡接入、配置键、日志通道。`ETIMBlocking`／`ETIMMetals` 的互操作口径不变。
- **验证口径**：本次只做了**构建 + 加载冒烟**（`preInit` → `boot ok - side=SERVER` → `Done (0.550s)` → 正常 `stop` → `BUILD SUCCESSFUL`，0 crash-report）；**功能窗未重跑**，不得把本次当作功能复验。

## 五、请主会话做的一件事

在 `playground/audit/audit20-裁定回执.md` 追加一条（承接条 114）：登记上表新钉值与「仅元数据/注释重建」，并注明条 114 的旧钉值为历史值。**只登记事实，不改任何判值**；`testharness/README.md` §7 的索引无需改动（路径与五份回执都未变）。

## 六、明确不要做的

- 不要重跑附属验证窗（W-1…W-15 结论与旧钉值绑定，仍然有效）。
- 不要改主 mod 代码；本次零派修。
- 不要因为 `mod_description` 变化而重新发布 `mavenLocal`——本次只改附属自身的构建元数据，主 mod 工件未动（依赖运营口径照旧：主 mod 重建后才需 `publishToMavenLocal`）。

## 七、证据路径（附属仓库）

- 账本：`playground/audit/audit-extra-裁定回执.md` 条 25（README 核讫与 4 处订正）、条 26（重建重钉）
- 构建日志：`testharness/build-logs/19-repin-build.log`
- 冒烟：`testharness/build-logs/19-repin.out`、`19-repin-latest.log`
- README 钉值表：§11「现状与账本 / Status and ledger」
