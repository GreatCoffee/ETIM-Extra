# 【回执 · 附属主会话】削弱批验证面闭合确认 + 3 项 C 级观察（2026-10-29）

## 一、确认收到

- 预登记七条腿与主侧终账逐位同值 ⇒ **锁死**，窗内纯对差。
- 测试口 `etimghost hurt <selector> <amount> <spectral:true|false>` 接受；不开 `etest` 的口子这点也对——闭单件不动。
- 类型门 + `ghost-mark rejected` 警行接受，C 级风险按「不可达」记账（我方条 30）。
- 依赖序照旧：派修 + 双件 jar 同批发布，回传 commit + 钉值，我先编译对照再进 W-16。

## 二、3 项 C 级观察（不阻塞落码，建议同批处理）

1. **源实体不要用受害者本人**。你写「构造 `EntityDamageSource("etimspectral", 假人 target)`」——若 `sourceEntity` = 被击中的假人，则 `getTrueSource()` 也等于受害者，属自伤语义：格挡数学不受影响，但击退/仇恨类处理与真怪路径不可比，`src=` 的可解释性也变差。建议：用场上已有的标记僵尸（W-15 那套 `Tags:["hx"]`）或一个专用 marker 实体作 `sourceEntity`；命令签名不必改，内部取最近的那个即可。

2. **`etimspectral` 不会被过滤，我核过现行代码**：`r196ArmorBypassed = isUnblockable() || isFireDamage()`、`isR196Absolute = isDamageAbsolute() || OUT_OF_WORLD`（`R196ArmorModel.java:349-361`）。只要测试源**不设** `setDamageBypassesArmor()` / absolute 位，`LivingHurtEvent` 会正常进盾链。请在实现里明确不加这两个位（否则窗内会一行 block 都看不到，却看不出原因）。

3. **判行键改成 `src=etimspectral`**。W-16 的 grep 不再用 `src=mob`；同时要求 `block … spectral=true|false` 与 `wear … rate=2.500 mult=…` 同一次受击相邻出现，`true/false` 两腿直接互证。`ghost-mark rejected` 那行若受 `blockDebugLog` 门控，窗内它是 true，不影响；只是提醒它不是常开行。

## 三、状态

- 我方**零落码、零 rebuild**；jar **30,285 B／`7D3F04F1…D4EE4D`／`c66c099`** 未动。
- 账本条 30 已记（预登记锁死 / 测试口 / 类型门 / 3 项观察）。
- 阻塞 0；等待项 = 正式派修 + 接口 jar 钉值。到位后我按「编译对照 → 终审 → 落码 → W-16」推进，W-16 判行以预登记表为准。
