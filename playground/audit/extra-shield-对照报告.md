# ETIM-Extra 盾面 对照报告（T-1…T-5 裁定 → 1.12.2 落法 · 11 面）

| 项 | 值 |
|---|---|
| 文档性质 | **对照报告**（1.12.2 落法 + 算式 + 伪代码 + 判行锚）——**不落码、不改裁、不产候选值** |
| 批次 | ETIM-Extra 盾面 第二阶段（秘银盾 / 艾德曼盾） |
| 上游 | `playground/audit/extra-shield-立项摸底.md`（11 面 A-1…D-2，L-1…L-13，X-1…X-7）；`playground/audit/audit-extra-裁定回执.md` 条 11（T-1…T-5 已裁） |
| 裁定输入 | **T-1…T-5 逐条照执行**（不改判、不另提候选）；实现面按任务书 §3 八条 |
| 受托方 | 会话六（`etim-mapping` 承载，主 mod 项目出借） |
| 日期 | 2026-10-28 |
| 落码态 | 本件**零产品码**：未改任何 java/json/lang/config/gradle，未起服、未构建、未跑 gradle、未动 git（主 mod 树与本项目树均只读） |
| 派生值性质（**原样声明**） | **25,600 与 102,400 是派生值，不是 R196 一手盾值**——立项摸底 A-1 已证 R196 **完全没有盾**（10 条负证、游戏内容命中 0）。本报告一律写「派生值」，不得表述为「R196 盾耐久」 |

**判决源与引用写法（一次性声明）**

| 代号 | 路径 | 引用写法 |
|---|---|---|
| ① R196 反编译树（判值唯一来源） | `mite-src\decompile\src\net\minecraft\` | **裸文件名**：`ItemTool.java:41` |
| ② R196 字节码卷（双源） | `ETIM-Extra\playground\audit\extra-shield-javap\`（31 件） | `javap_<类>.txt` |
| ③ 主 mod 现役（1.12.2 侧已落面，只读参照） | `git-workspace\etim\src\main\java\io\github\etim\etim\` | **子目录前缀**：`combat/ETIMBlocking.java:140` |
| ④ 1.12.2 对位树（**只作落法/API，不作判值**） | `ETIM-Extra\build\rfg\minecraft-src\java\net\minecraft\` 与 `...\net\minecraftforge\` | **包内相对路径**：`item/Item.java:1298` |
| ⑤ 本项目现状（只读） | `ETIM-Extra\src\main\java\io\github\etim\etimextra\` | `ETIMExtraConfig.java:42` |

**纪律**：① R196 值只取 ①／②；② 1.12.2 一律「落法面」，**禁从 1.12 反推 R196**；③ 每个 `path:line` 均为**本轮** read/grep 直读（未转抄摸底）；④ 负证带检索式 + 命中数 + 覆盖范围；⑤ 推断处标 `?`。

**组号说明**：本批按 **L-1…L-11** 编面（模板 M1…M6 组号不适用）。因此 `report-check.js` 的 `faces`（找 `M\d-\d`）与 `grades`（找 `A\d/B\d` 面号）两项**计 0 属预期**，不作缺陷。

**1.12.2 命名口径（一处必须记的差异）**：本项目 RFG 树的 MCP 名是 **stable_39** 口径，物品名走 **`setTranslationKey` / `getTranslationKey`**（`item/Item.java:346-350` / `:364-367`），**不是** `setUnlocalizedName`（全树 0 命中，见 §12 N-4）。凡下文写 `setTranslationKey` 即此因。

---

## §0 计数口径与判决类清单

### 0.1 面清单（L 组，11 面）

| 面 | 判点 | 状态 | 结论（一句） |
|---|---|---|---|
| **L-1** | R196 算式落点复核（`ItemTool.java:36-42`、`EnumEquipmentMaterial.java:14-15`、components=1 的 R196 现成值三例） | ✓ | 4.0F 在 `:37`、乘 100 在 `:41`；64.0F／256.0F 在 `:14`／`:15`；components=1 有锹／短棍／短柄斧三例现成 |
| **L-2** | 派生算式逐项（`4.0F × 1 × d × 100.0F`）与两值 + int 截断 | ✓ | **25,600**（mithril）／**102,400**（adamantium）；两值均 < 2²⁴，float32 精确，`(int)` 无丢位 |
| **L-3** | 物品类方法面 8 条（1.12.2 签名 + 行为，逐条 path:line） | ✓ | 8 条全部定位；其中 `getMaxItemUseDuration > 0` 是**起手生死线**（`EntityLivingBase.java:2978-2979`） |
| **L-4** | 配置面（现有骨架 + 两键落点 + 默认值来源句） | ✓ | `shield.mithrilDurability=25600` / `shield.adamantiumDurability=102400`，`Configuration.getInt` 六参式 |
| **L-5** | 注册面（`ForgeRegistries.ITEMS` + 创造性页 + `[ExtraLog]` 判行） | ✓ | preInit 注册（同主 mod 形状）＋ `CreativeTabs.COMBAT` ＋ 每件一行 `[ExtraLog]`；**preInit 是唯一能拿到配置值的点**（见 §11 A-1） |
| **L-6** | 资源面（model JSON / 纹理 / lang 三件） | ✓ | `assets/etimextra/**` 六件（2 模型 + 2 纹理 + 2 lang）；`setTranslationKey("etimextra.mithril_shield")` ⇒ lang 键 `item.etimextra.mithril_shield.name` |
| **L-7** | 配方面（`addShaped` 形 + 锭引用 + 6 锭计数） | ✓ | `"X X"/"XXX"/" X "` = 6 锭；`etim:ingot_mithril`／`etim:ingot_adamantium`；主 mod 的 `addShaped` **private 不可跨 mod** |
| **L-8** | 附魔面（默认门实测：哪些附魔到得了 + 附魔度取值面） | ✓ | BREAKABLE 类（Unbreaking／Mending／Vanishing）**到得了**；Mending/Vanishing 是 treasure ⇒ **附魔台不出**（`ContainerEnchantment.java:337` 传 `false`）；Binding **到不了** |
| **L-9** | 格挡面（`isShield` 门 + 磨损臂 + 盾侧前置条件清单） | ✓ | 主 mod 两条臂全部命中；vanilla 全免段与 vanilla 磨损同被一处 mixin 断掉 ⇒ **无双磨损**；前置 7 条 |
| **L-10** | 判行锚与 W 判点草案（通道 + 预期行 + 判据） | ✓ | 8 个判点；可日志化 5 条、需用户操作 3 条 |
| **L-11** | 冲突分级（A/B/C）+ 待裁位 | ✓ | **A 3 ／ B 4 ／ C 6 ／ D 3** |

### 0.2 状态与三分口径

| 符号 | 含义 | 面数 |
|---|---|---|
| ✓ | 落法已定（一手/API 均本轮直读） | **10**（L-1…L-10） |
| ✗ | 落法不成立 | **0** |
| ? | 待裁或近似 | **0**（开放项全部收进 L-11 的 D-1…D-3） |
| — | 分级面（不计判值） | **1**（L-11） |

| 三分口径（供主会话排落码顺序） | 件数 | 明细 |
|---|---|---|
| 新增 java | **3** | `shield/ETIMExtraItemShield.java`、`shield/ETIMExtraContent.java`、`client/ETIMExtraItemModels.java` |
| 改 java | **2** | `ETIMExtraConfig.java`（+2 键）、`ETIMExtra.java`（preInit 加一行注册调用） |
| 新增资源 | **6** | 2 × `models/item/*.json`、2 × `textures/items/*.png`（占位，落码阶段生成）、2 × `lang/*.lang`（en_us / zh_cn） |
| 改资源 | **0** | — |
| 机制面改动 | **0** | 不新增 mixin／事件／TEISR／日志通道 |

---

## §1 L-1 · R196 算式落点复核（只复核行号与值，不重推）

| 面 | 判点 | R196 一手 `文件:行号` | 原文摘录（≤2 行） | 结论 |
|---|---|---|---|---|
| L-1① | 基值 4.0F | `ItemTool.java:36-38` | `public final float getBaseDurability() {`／`return 4.0F;` | ✓ 4.0F |
| L-1② | 乘 100 的那一行 | `ItemTool.java:40-42` | `return (int)(this.getBaseDurability() * this.getNumComponentsForDurability() * this.effective_material.durability * 100.0F);` | ✓ 左结合四因子，末位 `×100.0F` 后 `(int)` |
| L-1③ | mithril 材料耐久 | `EnumEquipmentMaterial.java:14` | `mithril(64.0F, 100, EnumQuality.legendary, "mithril"),` | ✓ **64.0F**（第二字段 100 = 附魔度，见 L-8） |
| L-1④ | adamantium 材料耐久 | `EnumEquipmentMaterial.java:15` | `adamantium(256.0F, 40, EnumQuality.legendary, "adamantium"),` | ✓ **256.0F**（第二字段 40） |
| L-1⑤ | components = 1 的 R196 现成档位（例一） | `ItemShovel.java:25-28` | `public int getNumComponentsForDurability() {`／`return 1;` | ✓ 锹 = 1 |
| L-1⑥ | components = 1 现成档位（例二） | `ItemCudgel.java:31-34` | 同上形，`return 1;` | ✓ 短棍 = 1 |
| L-1⑦ | components = 1 现成档位（例三） | `ItemHatchet.java:29-32` | 同上形，`return 1;` | ✓ 短柄斧 = 1 |

**javap 双源复核（本轮重读卷）**：`javap_ItemTool.txt` 的 `getMultipliedDurability` 字节码序 = `getBaseDurability()` → `getNumComponentsForDurability()` → `i2f` → `fmul` → `Material.durability` → `fmul` → `ldc // float 100.0f` → `fmul` → `f2i`；`javap_EnumEquipmentMaterial.txt` 的 mithril 常量 = `bipush 10` → `ldc // float 64.0f` → `bipush 100` → `getstatic EnumQuality.legendary`，adamantium = `bipush 11` → `ldc // float 256.0f` → `bipush 40` → `getstatic EnumQuality.legendary`。

**`components = 1` 的性质**：R196 **没有盾的组件数行**（立项摸底 X-2），故 1 不是抄来的，是 **T-1 裁定**给定的；L-1⑤⑥⑦ 只证明「1 是 R196 里真实存在的档位」，不是「盾该等于 1」的一手依据。二者不可混写。

---

## §2 L-2 · 派生算式逐项

**算式（逐项挂一手行）**

```
派生耐久 = (int)( 4.0F  ×  1  ×  d  ×  100.0F )
                  ↑        ↑     ↑       ↑
            ItemTool:37  T-1  EnumEquip:14/15  ItemTool:41
                        裁定
```

| 项 | 值 | 一手出处 | 说明 |
|---|---|---|---|
| 基值 | `4.0F` | `ItemTool.java:36-38` | `getBaseDurability()` |
| components | `1` | T-1 裁定（R196 无盾行；`1` 的档位存在性见 L-1⑤⑥⑦） | 不是一手值 |
| 材料耐久 d | mithril `64.0F` ／ adamantium `256.0F` | `EnumEquipmentMaterial.java:14` ／ `:15` | 一手值 |
| 乘数 | `100.0F` | `ItemTool.java:41` | 一手值 |
| 截断 | `(int)` | `ItemTool.java:41` | 见下 |

**两值**

| 盾 | 逐项代入 | 结果 | float32 位级核 |
|---|---|---|---|
| 秘银盾 | `4.0F × 1 × 64.0F × 100.0F` | **25,600** | `((4×1)=4) → (4×64)=256 → (256×100)=25600.0` 全程精确 |
| 艾德曼盾 | `4.0F × 1 × 256.0F × 100.0F` | **102,400** | `4 → 1024 → 102400.0` 全程精确 |

**int 截断说明**：float32 的整数精确上界是 `2²⁴ = 16,777,216`；25,600 与 102,400 皆远小于它，且四步乘法的中间值（4／256／25,600；4／1,024／102,400）也都是精确可表示值 ⇒ **`(int)` 截断在这两值上是恒等变换，不丢位**。这也是为什么 T-1 的算式可以「落地为常量」而不必运行时再算。

**算式读法的外部自检（不是盾值）**：主 mod 自己的 javadoc 记着同式算出的工具值 —— `metal/ETIMGear.java:170-174`（「vanilla-material mapping … adamantium pickaxe 307200→9600」）：`4.0 × 3 × 256 × 100 = 307,200` 与 `:41` 的算式逐项吻合 ⇒ 本报告对 `ItemTool.java:41` 的读法正确。

**性质重申**：两值是**派生值**。R196 无盾（立项摸底 A-1，10 条负证 / 游戏内容 0 命中），因此不存在「R196 的盾耐久」这一说法；任何文档把它们写成「R196 判值」都是错的。

---

## §3 L-3 · 物品类方法面 8 条

**类**：`io.github.etim.etimextra.shield.ETIMExtraItemShield extends net.minecraft.item.Item`（落码清单见 §11.5）。
**不继承 `ItemShield` 的四条硬负担 + 两条连带**（本轮逐行核）：

| # | 负担 | `item/ItemShield.java` 行 | 后果 |
|---|---|---|---|
| 1 | 构造器写死 `setMaxDamage(336)` | `:27` | 派生耐久 25,600／102,400 无法传入 |
| 2 | `getItemStackDisplayName` 绑 banner 名 | `:39-50` | 显示名走 `item.shield.*`，与 `etimextra` 键冲突 |
| 3 | `getIsRepairable` 绑木板 | `:90-93` | 修材变成 `Blocks.PLANKS` |
| 4 | 构造器无参 | `:23` | 无法按金属分叉 |
| 5 | 发射器行为绑 `ItemArmor.DISPENSER_BEHAVIOR` | `:36` | 盾可被发射器当护甲戴 |
| 6 | TEISR 只认身份 | `client/renderer/tileentity/TileEntityItemStackRenderer.java:62`（`else if (item == Items.SHIELD)`） | 即便继承也**拿不到 3D 盾模型** ⇒ 继承零收益 |

⇒ **维持任务书 §3 的裁定：不继承**。未发现「能少写且不引入上述负担」的路径（故本条无待裁冲突）。

### 3.1 八条方法面（1.12.2 签名 + 落点 + 行为 + 漏掉的后果）

| # | 方法 | 1.12.2 签名 | `path:line` | 本类行为 | 漏掉后的表现（判据） |
|---|---|---|---|---|---|
| **1** | `setMaxStackSize` | `public Item setMaxStackSize(int)` | `item/Item.java:190-194` | `1`（ctor） | 可堆叠 ⇒ 耐久/附魔面全废 |
| **2** | `setMaxDamage` | `public Item setMaxDamage(int)` | `item/Item.java:264-275` | `ETIMExtraConfig.shieldMithrilDurability`／`…AdamantiumDurability` | `maxDamage=0` ⇒ `isDamageable()` 假（`Item.java:277-280`）⇒ BREAKABLE 附魔全灭 + `damageItem` 空转 |
| **3** | `isShield` | `public boolean isShield(ItemStack, @Nullable EntityLivingBase)` | `item/Item.java:1298-1301` | `return true;`（**不解引用 entity**） | 默认实现是**身份比较** `stack.getItem() == Items.SHIELD` ⇒ 本盾恒假 ⇒ 主 mod `isShieldStack` 假 ⇒ 无半减、无磨损 |
| **4** | `getItemUseAction` | `public EnumAction getItemUseAction(ItemStack)` | `item/Item.java:433-436` | `EnumAction.BLOCK`（枚举值 `item/EnumAction.java:8`） | 默认 `NONE` ⇒ 使用态不是格挡态（`isActiveItemStackBlocking` 判 BLOCK，`EntityLivingBase.java:3119`） |
| **5** | `getMaxItemUseDuration` | `public int getMaxItemUseDuration(ItemStack)` | `item/Item.java:441-444` | `72000` | 默认 **0** ⇒ `onItemUseStart` 返回 ≤0 ⇒ `setActiveHand` **直接 return**（`EntityLivingBase.java:2978-2979`）⇒ `isHandActive()` 永假 ⇒ 全部格挡面死 |
| **6** | `onItemRightClick` | `public ActionResult<ItemStack> onItemRightClick(World, EntityPlayer, EnumHand)` | `item/Item.java:209-212` | `playerIn.setActiveHand(handIn);` + `new ActionResult<>(EnumActionResult.SUCCESS, held)` | 默认只返回 `PASS` ⇒ 右键不起手（`ItemShield.java:77-82` 同形） |
| **7** | `getItemEnchantability` | `public int getItemEnchantability()` | `item/Item.java:519-522`（ItemStack 敏感版 `:1156-1159` 自动委派） | `metal.enchantability`（mithril 100／adamantium 40） | 默认 **0** ⇒ `calcItemStackEnchantability` 在三档全部返回 0（`EnchantmentHelper.java:345-348`）⇒ **连附魔台都不出档** |
| **8** | `addPropertyOverride` | `public final void addPropertyOverride(ResourceLocation, IItemPropertyGetter)` | `item/Item.java:158-161`；接口 `item/IItemPropertyGetter.java:9-13`（`apply` 标 `@SideOnly(CLIENT)`） | `("blocking", BLOCKING_GETTER)`，getter 形照 `ItemShield.java:28-35` | 物品模型无法按格挡态切换（首批无 `_blocking` 模型，属性休眠；见 §11 D-1） |

**另需三件（注册面，不属八条）**：`setCreativeTab`（`item/Item.java:556-560`；`creativetab/CreativeTabs.java:83` `COMBAT`）、`setRegistryName`（`net\minecraftforge\registries\IForgeRegistryEntry.java:68-80`，`Impl.setRegistryName` 三个重载）、`setTranslationKey`（`item/Item.java:346-350`）。

### 3.2 伪代码（只作报告内代码块，不落盘）

```java
package io.github.etim.etimextra.shield;

import javax.annotation.Nullable;

import net.minecraft.creativetab.CreativeTabs;
import net.minecraft.entity.EntityLivingBase;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.item.EnumAction;
import net.minecraft.item.IItemPropertyGetter;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.util.ActionResult;
import net.minecraft.util.EnumActionResult;
import net.minecraft.util.EnumHand;
import net.minecraft.util.ResourceLocation;
import net.minecraft.world.World;

import io.github.etim.etim.metal.ETIMMetals;

/**
 * 秘银盾 / 艾德曼盾的物品面（ETIM-Extra 盾面首批）。
 *
 * <p>只持「物品」：格挡的减半与磨损归主 mod（AD-10+SH —
 * {@code combat/ETIMBlocking.java:108-155}）。本类提供的唯一事实是
 * 「我是盾」（{@link #isShield}）+「我能进入 BLOCK 使用态」（三条）。
 * 本类<b>不是</b> {@code ItemTool}：不覆写 {@code canBlock()}、不带
 * decay、不参与 {@code ETIMToolDurability}（见 L-9 前置条件 6/7）。</p>
 *
 * <p>The item face of the mithril / adamantium shield. The main mod owns the
 * mechanism (halving + wear); this class only states "I am a shield" and
 * "I can enter the BLOCK use state". It is deliberately NOT an
 * {@code ItemTool}.</p>
 *
 * <p>批注锚：T-1 耐久 = 4.0F × 1 × d × 100（R196 {@code ItemTool.java:36-42} +
 * {@code EnumEquipmentMaterial.java:14-15}）；T-5 格挡 = {@code Item#isShield}
 * 门（R196 无盾，此为 1.12 侧唯一入口）。</p>
 */
public final class ETIMExtraItemShield extends Item {

    /** 物品模型的格挡态选择器（{@code ItemShield:28-35} 同形）。
     *  Item model's blocking-state selector. */
    private static final IItemPropertyGetter BLOCKING_GETTER =
            (stack, world, entity) -> entity != null && entity.isHandActive()
                    && entity.getActiveItemStack() == stack ? 1.0F : 0.0F;

    private final ETIMMetals metal;

    /**
     * @param metal     the R196 metal row (enchantability rides it, L-8)
     * @param durability the derived max damage (T-1; config-driven, L-4)
     */
    public ETIMExtraItemShield(ETIMMetals metal, int durability) {
        this.metal = metal;
        this.setMaxStackSize(1);                          // L-3 #1
        this.setMaxDamage(durability);                    // L-3 #2
        this.setCreativeTab(CreativeTabs.COMBAT);         // L-5
        this.addPropertyOverride(new ResourceLocation("blocking"), BLOCKING_GETTER); // L-3 #8
    }

    /** L-3 #3 — 身份比较的默认实现（{@code Item.java:1298-1301}）⇒ 必须覆写。
     *  The {@code entity} argument is {@code null} at both live call sites
     *  ({@code EntityLiving.java:1130}, {@code ETIMBlocking.java:96}) —
     *  never dereference it. */
    @Override
    public boolean isShield(ItemStack stack, @Nullable EntityLivingBase entity) {
        return true;
    }

    /** L-3 #4 — R196 {@code ItemTool.getItemInUseAction} 恒 BLOCK 的 1.12 落点。 */
    @Override
    public EnumAction getItemUseAction(ItemStack stack) {
        return EnumAction.BLOCK;
    }

    /** L-3 #5 — 必须 > 0，否则 {@code onItemUseStart} 拒绝起手
     *  ({@code EntityLivingBase.java:2978-2979})。 */
    @Override
    public int getMaxItemUseDuration(ItemStack stack) {
        return 72000;
    }

    /** L-3 #6 — 起手（{@code ItemShield.java:77-82} 同形）。 */
    @Override
    public ActionResult<ItemStack> onItemRightClick(World worldIn, EntityPlayer playerIn, EnumHand handIn) {
        ItemStack held = playerIn.getHeldItem(handIn);
        playerIn.setActiveHand(handIn);
        return new ActionResult<ItemStack>(EnumActionResult.SUCCESS, held);
    }

    /** L-3 #7 — 材料附魔度（一手值，不入配置；{@code metal/ETIMItemAxe.java:63-66} 同形）。 */
    @Override
    public int getItemEnchantability() {
        return this.metal.enchantability;
    }
}
```

---

## §4 L-4 · 配置面

| 面 | 判点 | 现状 `path:line` | 值 |
|---|---|---|---|
| L-4① | 现有骨架（单键、category `debug`、一次性载入） | `ETIMExtraConfig.java:32`（字段）／`:39-48`（`init`） | `extraDebugLog`（`:42-44`） |
| L-4② | 契约：preInit 载一次、非法值不回落 | `ETIMExtraConfig.java:9-13`（类 javadoc） | — |
| L-4③ | 加键的 API | `net\minecraftforge\common\config\Configuration.java:1752`（`getInt(name, category, default, min, max, comment)`） | 六参式 |
| L-4④ | 主 mod 同式先例 | `ETIMConfig.java:453-459`（`config.getInt("capAtLevel0", "playerCaps", …)`） | 同形 |

**两键落点**

| 键 | category | 默认 | 区间 | 默认值来源（写进注释） |
|---|---|---|---|---|
| `shield.mithrilDurability` | `shield` | `25600` | `1 … 1048576` | `4.0F × 1 × 64.0F × 100.0F`（R196 `ItemTool.java:36-42` + `EnumEquipmentMaterial.java:14`；components=1 由 T-1 裁定）⇒ **派生值** |
| `shield.adamantiumDurability` | `shield` | `102400` | `1 … 1048576` | 同上，d = `256.0F`（`EnumEquipmentMaterial.java:15`）⇒ **派生值** |

**配置原则（照任务书，逐条落到本类）**

- **可配**：耐久（25,600／102,400）——无一手来源，是派生值 ⇒ 玩家可感知数值、且会随材料行修订而变。
- **不配**：附魔度（100／40，一手行 `EnumEquipmentMaterial.java:14-15`）、配方（6 锭，T-3 已裁的形状）、格挡语义（主 mod 机制）——这些是判值，改它们就是改裁定。

**伪代码（追加到 `ETIMExtraConfig`）**

```java
    // shield -------------------------------------------------------
    /** 秘银盾耐久（派生值：4.0F × 1 × 64.0F × 100.0F — R196 ItemTool.java:36-42
     *  + EnumEquipmentMaterial.java:14，components=1 由 T-1 裁定）。
     *  Mithril shield max damage (DERIVED, not an R196 shield value). */
    public static int shieldMithrilDurability = 25600;
    /** 艾德曼盾耐久（派生值：4.0F × 1 × 256.0F × 100.0F — :15）。 */
    public static int shieldAdamantiumDurability = 102400;

    // inside init(...) — after the extraDebugLog row:
    shieldMithrilDurability = config.getInt("mithrilDurability", "shield",
            shieldMithrilDurability, 1, 1 << 20,
            "Mithril shield max damage; DERIVED = 4.0 x 1 x 64.0 x 100 (R196 ItemTool.java:36-42"
                    + " + EnumEquipmentMaterial.java:14; components=1 by ruling T-1). Not an R196 shield value");
    shieldAdamantiumDurability = config.getInt("adamantiumDurability", "shield",
            shieldAdamantiumDurability, 1, 1 << 20,
            "Adamantium shield max damage; DERIVED = 4.0 x 1 x 256.0 x 100 (:15). Not an R196 shield value");
```

> **配置顺序硬约束**：`ETIMExtraConfig.init(event)` 现在是 `preInit` 的第一行（`ETIMExtra.java:60`）。物品构造器要读这两个键 ⇒ **注册必须排在其后**：`:60` 配置 → `:61` `ETIMExtraLog.preInit()`（该行的语义就是「配置已就绪、内容注册即将开始」，见 `ETIMExtraLog.java:38-41`）→ 新增的 `ETIMExtraContent.register()`。见 §11 A-1。

---

## §5 L-5 · 注册面

| 面 | 判点 | `path:line` | 落法 |
|---|---|---|---|
| L-5① | 物品注册表 | `net\minecraftforge\fml\common\registry\ForgeRegistries.java:46`（`public static final IForgeRegistry<Item> ITEMS`） | `ForgeRegistries.ITEMS.register(item)` |
| L-5② | 注册形状（主 mod 先例） | `metal/ETIMGear.java:134-141` | `setRegistryName(new ResourceLocation(MOD_ID, name))` → `setTranslationKey(MOD_ID + "." + name)` → `ForgeRegistries.ITEMS.register(item)` → 收集 |
| L-5③ | 注册点（主 mod 先例） | `ETIM.java:74-77`（`preInit` 内 `ETIMItems.register()` / `ETIMBlocks.register()` / `ETIMGear.register()`） | **preInit**，在 `ETIMExtraConfig.init` 之后 |
| L-5④ | 注册后自检 | `metal/ETIMGear.java:151-158`（`assertRegistered()` 查 `ForgeRegistries.ITEMS.getValue(name) != null`） | 同形自检，缺项 fail-fast |
| L-5⑤ | 创造性页 | `creativetab/CreativeTabs.java:83`（`public static final CreativeTabs COMBAT = (new CreativeTabs(9, "combat") …`）；setter `item/Item.java:556-560` | `setCreativeTab(CreativeTabs.COMBAT)`（盾 = 战斗页） |
| L-5⑥ | 注册名 | — | `etimextra:mithril_shield` / `etimextra:adamantium_shield` |
| L-5⑦ | `[ExtraLog]` 判行形制 | `ETIMExtraLog.java:50-52`（`row()` → `LOGGER.info("[ExtraLog] %s")`）＋ `:23-26`（首批内容之后的行挂 `extraDebugLog`） | 新增 `shieldItem(...)` 行（见下） |

**为何是 preInit 而不是 `RegistryEvent.Register<Item>`**（两条都给出，落法取前者）：

| 方案 | 钩子 | 时序 | 本批可行性 |
|---|---|---|---|
| **① preInit（采用）** | `ETIMExtra.preInit`（`ETIMExtra.java:58-62`） | 配置已载入（`:60`），物品可读 `ETIMExtraConfig.shield*Durability` | ✓ 与主 mod 同形（`ETIM.java:74-77`；`:76` 注释记同点注册「50 tools + 40 armor + 5 chains」= 95 件），且有 `assertRegistered()` 兜底（`metal/ETIMGear.java:151-158`）；本项目冒烟轮 etim 正常载入（`audit-extra-裁定回执.md` 条 6），说明该注册点在本环境可用 |
| ② `RegistryEvent.Register<Item>` | `net\minecraftforge\event\RegistryEvent.java:63`（`public static class Register<T>`）；先例 `world/ETIMBiomeUnderworld.java:61-64`（`@Mod.EventBusSubscriber` + `RegistryEvent.Register<Biome>`） | **早于** `FMLPreInitializationEvent` ⇒ `ETIMExtraConfig.init` 尚未跑 | ✗ 构造器读到的耐久是字段初值 25600/102400，配置键失效（除非把配置前移到 `FMLConstructionEvent`，破坏现有契约） |

**`[ExtraLog]` 注册行（形态照 `ETIMS`/`EquipLog`）**

```
[ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1 [server]
[ExtraLog] shield item=etimextra:adamantium_shield metal=adamantium maxDamage=102400 enchantability=40 stack=1 [server]
```

**伪代码**

```java
package io.github.etim.etimextra.shield;

import net.minecraft.item.Item;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.fml.common.registry.ForgeRegistries;

import io.github.etim.etim.metal.ETIMMetals;
import io.github.etim.etimextra.ETIMExtra;
import io.github.etim.etimextra.ETIMExtraConfig;
import io.github.etim.etimextra.ETIMExtraLog;

/**
 * 盾面内容注册（ETIM-Extra 首批）：两件盾 + 两条配方 + 判行。
 * 形制照主 mod {@code metal/ETIMGear.java:134-141}（注册）与
 * {@code :151-158}（fail-fast）。注册点 = preInit（L-5 表 A-1）。
 */
public final class ETIMExtraContent {

    public static Item mithrilShield;
    public static Item adamantiumShield;

    private ETIMExtraContent() {
    }

    /** preInit, AFTER {@code ETIMExtraConfig.init} (durability keys must be live). */
    public static void register() {
        mithrilShield = register("mithril_shield", ETIMMetals.MITHRIL,
                ETIMExtraConfig.shieldMithrilDurability);
        adamantiumShield = register("adamantium_shield", ETIMMetals.ADAMANTIUM,
                ETIMExtraConfig.shieldAdamantiumDurability);
        assertRegistered();                               // ETIMGear:151-158 形
    }

    private static Item register(String name, ETIMMetals metal, int durability) {
        Item item = new ETIMExtraItemShield(metal, durability);
        item.setRegistryName(new ResourceLocation(ETIMExtra.MOD_ID, name));
        item.setTranslationKey(ETIMExtra.MOD_ID + "." + name);
        ForgeRegistries.ITEMS.register(item);
        ETIMExtraLog.shieldItem(item, metal, durability); // L-5⑦
        return item;
    }

    private static void assertRegistered() {
        for (Item item : new Item[]{mithrilShield, adamantiumShield}) {
            ResourceLocation name = item.getRegistryName();
            if (name == null || ForgeRegistries.ITEMS.getValue(name) == null) {
                throw new IllegalStateException("etimextra shield not registered: " + name);
            }
        }
    }
}
```

---

## §6 L-6 · 资源面

**现状（负证，见 §12 N-1）**：`ETIM-Extra\src\main\resources` 只有 `mcmod.info` + `pack.mcmeta`，**无 `assets/`**。

| 资源 | 落点路径 | 规格 / 内容 |
|---|---|---|
| 模型（秘银） | `src/main/resources/assets/etimextra/models/item/mithril_shield.json` | `{"parent":"minecraft:item/handheld","textures":{"layer0":"etimextra:items/mithril_shield"}}`（形照 `assets/etim/models/item/sword_mithril.json`） |
| 模型（艾德曼） | `…/models/item/adamantium_shield.json` | 同上，`layer0` = `etimextra:items/adamantium_shield` |
| 纹理（2 件） | `…/textures/items/mithril_shield.png`、`…/adamantium_shield.png` | **16×16 PNG**，文件名与 `layer0` 末段一致；首批为占位图（落码阶段生成，本件只给规格） |
| lang（en） | `…/lang/en_us.lang` | `item.etimextra.mithril_shield.name=Mithril Shield`／`item.etimextra.adamantium_shield.name=Adamantium Shield` |
| lang（zh） | `…/lang/zh_cn.lang` | `item.etimextra.mithril_shield.name=秘银盾`／`item.etimextra.adamantium_shield.name=艾德曼盾` |

**lang 键的由来（链要写清，否则会写成 `item.etimextra:mithril_shield.name`）**：
`setTranslationKey("etimextra.mithril_shield")`（`item/Item.java:346-350`）→ `getTranslationKey()` 前置 `"item."`（`:364-367`）→ 显示名再拼 `".name"`（`:463`）⇒ 键 = **`item.etimextra.mithril_shield.name`**。主 mod 同构键形见 `assets/etim/lang/en_us.lang:167`（`item.etim.sword_mithril.name=Mithril Sword`）。

**客户端模型注册（照主 mod 的「双写」经验）**

| 面 | `path:line` | 说明 |
|---|---|---|
| 注册 API | `net\minecraftforge\client\model\ModelLoader.java:1089-1093`（`setCustomModelResourceLocation(Item, int, ModelResourceLocation)`） | 静态表 |
| 事件 | `net\minecraftforge\client\event\ModelRegistryEvent.java`（类在 `net.minecraftforge.client.event`） | 只在客户端 |
| 主 mod 先例 | `client/ETIMItemModels.java:30-53` | `@Mod.EventBusSubscriber(value = Side.CLIENT, modid = …)` + 循环本命名空间物品 + **mesh definition + 静态 location 双写**（`:41-50`，注释记了「只写静态表到不了 mesher」的实证） |
| 本批落法 | `client/ETIMExtraItemModels.java` | 同一形状，命名空间过滤 `ETIMEextra.MOD_ID`，只处理 2 件 |

**3D 盾模型（`ModelShield` + custom TEISR）不进首批**——TEISR 的身份判据在 `client/renderer/tileentity/TileEntityItemStackRenderer.java:62`（`item == Items.SHIELD`），与 `Item.getTileEntityItemStackRenderer()`（`item/Item.java:1345-1349`）配合；本批不设 TEISR（`Item.java:1351` 的 setter 不用），故走标准 `item/handheld`。

---

## §7 L-7 · 配方面

| 面 | 判点 | `path:line` | 落法 |
|---|---|---|---|
| L-7① | 形状（T-3 已裁） | — | `"X X"` / `"XXX"` / `" X "` ⇒ 2 + 3 + 1 = **6 个 X** |
| L-7② | 注册 API | `net\minecraftforge\fml\common\registry\GameRegistry.java:200-204`（`addShapedRecipe(ResourceLocation name, ResourceLocation group, @Nonnull ItemStack output, Object... params)`） | `GameRegistry.addShapedRecipe(id, null, new ItemStack(shield), "X X", "XXX", " X ", 'X', ingot)` |
| L-7③ | 主 mod 的形状器（**private，不可跨 mod**） | `metal/ETIMGear.java:307-328`（`private static void addShaped(...)`，内部 `:327` 调 `GameRegistry.addShapedRecipe`） | 本 mod **不能调用** ⇒ 直接内联参数表（同一条 API） |
| L-7④ | 秘银锭引用 | `metal/ETIMItems.java:31`（字段）／`:48`（`ingotMithril = simple("ingot_mithril")`）／`:75`（`setRegistryName(ETIM.MOD_ID, name)`） | `ETIMItems.ingotMithril` = **`etim:ingot_mithril`** |
| L-7⑤ | 艾德曼锭引用 | `metal/ETIMItems.java:32`／`:49` | `ETIMItems.ingotAdamantium` = **`etim:ingot_adamantium`** |
| L-7⑥ | 配方主键 | 主 mod 形：`metal/ETIMGear.java:322`（`new ResourceLocation(ETIM.MOD_ID, "gear_" + name)`） | `etimextra:shield_mithril` / `etimextra:shield_adamantium` |
| L-7⑦ | 跨 mod 编译面 | `ETIM-Extra\gradle\scripts\dependencies.gradle:36`（`implementation('io.github.etim:etim:1.0.0:dev')`） | `ETIMItems` 可直接引用（dev 分类器 = MCP 名） |

**6 锭计数核（可日志化判据）**：pattern 里 `'X'` 出现次数 = 2 + 3 + 1 = **6**；`CraftingHelper.parseShaped`（`GameRegistry.java:202`）按字符计数 ⇒ 成品耗 6 锭。判行可在注册后数一遍（见 L-10 W-2）。

**伪代码**

```java
    // inside ETIMExtraContent, after register():
    private static void registerRecipes() {
        addShieldRecipe("shield_mithril", mithrilShield, ETIMItems.ingotMithril);
        addShieldRecipe("shield_adamantium", adamantiumShield, ETIMItems.ingotAdamantium);
    }

    /** T-3 ①: R196 材料列形（"材料 × 形状"二维表，一手 CraftingManager.java:479-507
     *  的 1.12 等价面是 GameRegistry.addShapedRecipe）。6 个 X = 6 锭。
     *  Shape "X X"/"XXX"/" X " = 6 ingots (ruling T-3). */
    private static void addShieldRecipe(String name, Item shield, Item ingot) {
        GameRegistry.addShapedRecipe(new ResourceLocation(ETIMExtra.MOD_ID, name), null,
                new ItemStack(shield), "X X", "XXX", " X ", 'X', ingot);
        ETIMExtraLog.shieldRecipe(name, shield, ingot, 6);   // L-10 W-2
    }
```

> **与主 mod 的差异（必须记）**：主 mod 的 `addShaped` 会自动补 `'/'` = `Items.STICK`（`ETIMGear.java:313-321`）；盾的形状不含 `'/'`，故本批**不传 stick**，参数表只有 `'X'` 一组。

---

## §8 L-8 · 附魔面

### 8.1 附魔度取值面（T-4：走材料行，不入配置）

| 面 | 判点 | `path:line` | 值 |
|---|---|---|---|
| L-8① | 覆写面 | `item/Item.java:519-522`（默认 `0`）；`ItemStack` 敏感版 `:1156-1159` 自动委派到无参版 | 只覆写无参版即可（见 §11 D-2） |
| L-8② | 取值 | `metal/ETIMItemAxe.java:63-66` 同形（`return metal.enchantability;`）；材料行 `EnumEquipmentMaterial.java:14-15` | mithril **100**／adamantium **40** |
| L-8③ | **附魔度是硬门**，不只是强度 | `enchantment/EnchantmentHelper.java:340-348`（`int i = item.getItemEnchantability(stack); if (i <= 0) return 0;`） | 覆写前（0）⇒ 附魔台三档全 0 ⇒ 一件都附不上 |
| L-8④ | 强度驱动 | 同上 `:356`（`rand.nextInt(8) + 1 + (power >> 1) + rand.nextInt(power + 1)`） | 100 远高于 15 的 power 上限（`:351-354`）⇒ 恒在上限档 |

### 8.2 默认门实测（1.12.2 到底给本类哪些附魔）

**门链（逐段 path:line）**

1. 附魔台取档：`inventory/ContainerEnchantment.java:334-345` → `EnchantmentHelper.buildEnchantmentList(rand, stack, level, **false**)`（`:337`）。
2. 候选枚举：`enchantment/EnchantmentHelper.java:449-471`，逐条判 `(!isTreasure || allowTreasure) && enchantment.canApplyAtEnchantingTable(stack)`（`:457`）。
3. 附魔侧入口：`enchantment/Enchantment.java:221-224` → `stack.getItem().canApplyAtEnchantingTable(stack, this)`。
4. 物品侧入口：`item/Item.java:1169-1172` → `enchantment.type.canEnchantItem(stack.getItem())`。
5. 类型判定：`enchantment/EnumEnchantmentType.java` 各常量（`ALL :17-33` 委派其他类型／`BREAKABLE :106-114` = `itemIn.isDamageable()`／`WEARABLE :124-133` = `ItemArmor‖ItemElytra‖ItemSkull‖pumpkin`／`ARMOR*`／`WEAPON`／`DIGGER`／`BOW`／`FISHING_ROD`）。
6. 本类的 `isDamageable()`：`item/Item.java:277-280`（`maxDamage > 0 && (!hasSubtypes || maxStackSize == 1)`）⇒ **真**（maxDamage 25,600/102,400、无 subtype、stack 1）。

**实测结论（逐个附魔）**

| 附魔 | 类型（构造器 `path:line`） | 到不到本类 | 附魔台出不出 | 依据 |
|---|---|---|---|---|
| **Unbreaking**（durability） | `BREAKABLE`（`EnchantmentDurability.java:10-14`，`:12`） | **到** | **出** | BREAKABLE 门 `:110-113` → `isDamageable()` 真；非 treasure（类型未覆写 `isTreasureEnchantment`） |
| **Mending** | `BREAKABLE`（`EnchantmentMending.java:7-11`，`:9`） | **到** | **不出**（treasure） | 类型面通；但 `isTreasureEnchantment()` 恒真（`:29-32`），附魔台传 `allowTreasure=false`（`ContainerEnchantment.java:337`）⇒ `:457` 的前半条件挡掉。可达路径只剩附魔书 + 铁砧 |
| **Vanishing curse** | `ALL`（`EnchantmentVanishingCurse.java:7-11`，`:9`） | **到** | **不出**（treasure） | `ALL.canEnchantItem` 逐类型委派（`EnumEnchantmentType.java:23-29`）→ BREAKABLE 命中 ⇒ 类型面通；treasure（`:37-40`）+ `allowTreasure=false` ⇒ 附魔台不出 |
| **Binding curse** | `WEARABLE`（`EnchantmentBindingCurse.java:7-11`，`:9`） | **不到** | 不出 | WEARABLE 只认 `ItemArmor`/`ItemElytra`/`ItemSkull`/pumpkin（`EnumEnchantmentType.java:128-132`），本类是裸 `Item` |
| 剑/工具类附魔（Sharpness、Efficiency…） | `WEAPON`／`DIGGER` | **不到** | 不出 | `:79-95` 要 `ItemSword`／`ItemTool`，本类皆非 |
| 护甲类（Protection 系列） | `ARMOR*` | **不到** | 不出 | `:34-78` 要 `ItemArmor` |

**T-4 的执行结论**：**照裁定执行，不补白名单**。后果如实登记（§11 B-1）：本盾在附魔台上只能出 **Unbreaking** 一系（以及一切非 treasure 的 BREAKABLE 附魔——1.12.2 里 BREAKABLE 类型只有 Unbreaking / Mending 两条，后者是 treasure）⇒ **附魔台实际只出 Unbreaking**；Mending 只能靠附魔书 + 铁砧。

### 8.3 品质不进本类（判断句 + 一手锚）

**判断句**：盾**不接** ETIM 品质体系——`quality/ETIMQuality.java:78-85` 的 `hasQualityChannel(Item)` 是 **6 个 exact class 的 `instanceof` 白名单**（`ItemTool`／`ItemSword`／`ItemShears`／`ItemHoe`／`ItemArmor`／`ItemBow`），本类是裸 `Item` ⇒ 返回 `false` ⇒ 无品质档位、无 `maxDamage × modifier` 写穿；类 javadoc `:51-55` 亦明写「Unmapped/foreign items fall to AVERAGE (= no rung to pick)」。故 §2 T-4 的「不接品质」在机制上**自动成立**，不需要任何代码动作。

---

## §9 L-9 · 格挡面

### 9.1 主 mod 的两条臂（只引不改）

| 面 | 判点 | `path:line` | 原文摘录（≤2 行） |
|---|---|---|---|
| L-9① | 盾臂 = `Item#isShield`（**传 null 实体**） | `combat/ETIMBlocking.java:94-97` | `public static boolean isShieldStack(ItemStack stack) {`／`return !stack.isEmpty() && stack.getItem().isShield(stack, null);` |
| L-9② | 载体并集（工具 ∪ 盾） | `combat/ETIMBlocking.java:99-102` | `return isBlockCarrier(stack) ‖ isShieldStack(stack);`（原文双竖线，此处用 ‖ 代替以免破表格） |
| L-9③ | 减半事件门（玩家 + 在役 + 载体） | `combat/ETIMBlocking.java:107-116` | `if (!ETIMConfig.blockModel ‖ !(event.getEntityLiving() instanceof EntityPlayer)) return;`／`if (!player.isHandActive() ‖ !isBlockingCarrier(active)) return;`（原文为双竖线，此处用 ‖ 代替以免破表格） |
| L-9④ | 半减 + 下限 | `combat/ETIMBlocking.java:121-129` | `float blocked = Math.max(raw * ETIMConfig.blockDamageFactor, ETIMConfig.blockMinDamage);`／`event.setAmount(blocked);` |
| L-9⑤ | 磨损分叉（盾走 rate，工具走 decay） | `combat/ETIMBlocking.java:140-148` | `if (isShieldStack(active)) {`／`wear = (int) (blocked * ETIMConfig.shieldWearRate);` |
| L-9⑥ | 磨损落地（创造免磨 + `damageItem`） | `combat/ETIMBlocking.java:149-152` | `if (wear > 0 && !player.capabilities.isCreativeMode) {`／`active.damageItem(wear, player);` |
| L-9⑦ | 磨损率默认值 | `ETIMConfig.java:367-369`（字段）／`:869-871`（注册） | `public static float shieldWearRate = 1.0F;`；注释明写「the future etim-extra material table rides this slot」 |

### 9.2 vanilla 侧：全免段与 vanilla 磨损**同被一处断掉**（无双磨损的关键）

| 面 | 判点 | `path:line` | 结论 |
|---|---|---|---|
| L-9⑧ | 1.12 全免段 | `entity/EntityLivingBase.java:996-1012` | `if (amount > 0.0F && this.canBlockDamageSource(source))` → `damageShield(amount); amount = 0.0F;` ⇒ 原版是 **100% 免伤** |
| L-9⑨ | 断点（主 mod mixin） | `mixins/MixinEntityLivingBaseBlock.java:41-54` | HEAD + cancellable，`cir.setReturnValue(false)`（`:53`）⇒ 全免段恒死（`blockModel` 关时 `:44-46` 原样返回 = 回退面） |
| L-9⑩ | vanilla 磨损 | `entity/EntityLivingBase.java:1502-1504`（基类空实现）；`entity/player/EntityPlayer.java:1172-1178` | `if (damage >= 3.0F && …isShield(…)) { int i = 1 + MathHelper.floor(damage); activeItemStack.damageItem(i, this); }` |
| L-9⑪ | vanilla 磨损的**唯一调用点** | `entity/EntityLivingBase.java:998` | 只在 `:996-1012` 分支内 ⇒ ⑨ 一断，`damageShield` 整条不可达 ⇒ **不会与 L-9⑤ 叠加成双磨损** |
| L-9⑫ | 5 tick 起手门槛 | `entity/EntityLivingBase.java:3113-3127`（`isActiveItemStackBlocking`，`:3125` 判 `≥ 5`）；唯一调用点 `:1234`（`canBlockDamageSource` 内） | ⑨ 之后同样不可达 ⇒ 盾**没有** vanilla 的 5 tick 门槛（与 R196 `ItemRenderer.java:352` 只看 `getItemInUseCount() > 0` 一致） |
| L-9⑬ | 另两个 `isShield(` 调用者 | `entity/EntityLiving.java:1130`（箭槽选择，传 `null`）；`entity/player/EntityPlayer.java:1174`（vanilla 磨损，传 `this`） | 两处都**不得**在覆写里解引用 `entity`（见 §11 A-2） |
| L-9⑭ | 主 mod 不接管盾的 action/start | `mixins/MixinItem.java:137`、`:153`、`:175`（三处门均为 `isBlockCarrier`，**不含盾**） | 盾的 BLOCK 动作/时长/起手必须由本类自己实现（L-3 #4/#5/#6），否则 `isHandActive()` 永假 |

### 9.3 盾侧前置条件清单（落码验收用）

| # | 条件 | 判据（可核点） | 漏掉的后果 |
|---|---|---|---|
| 1 | `isShield(stack, null) == true` | L-9① 命中 | `isShieldStack` 假 ⇒ `isBlockingCarrier` 假 ⇒ 无半减、无磨损（盾 = 白板） |
| 2 | `getItemUseAction == BLOCK` **且** `getMaxItemUseDuration > 0`（72000） | L-3 #4/#5；`EntityLivingBase.java:2978-2979` | `setActiveHand` 直接 return ⇒ `isHandActive()` 假 ⇒ L-9③ 门不过 |
| 3 | `onItemRightClick` 调 `setActiveHand(hand)` 并返回 SUCCESS | L-3 #6 | 右键不进入使用态 |
| 4 | `ETIMConfig.blockModel == true` | `ETIMConfig.java:362`／`:860` | 主 mod 两条臂全关（`:109` 首条件），且 `MixinEntityLivingBaseBlock:44-46` 恢复 vanilla 全免 ⇒ 盾变 100% 免伤 + vanilla 磨损，与 R196 口径冲突 |
| 5 | `maxDamage > 0` 且 `maxStackSize == 1` | `Item.java:277-280` | `isDamageable()` 假 ⇒ BREAKABLE 附魔全灭 + `damageItem` 空转（磨损判行 `wear=…` 有但耐久不动） |
| 6 | **本类不是 `ItemTool`，也不是 `ETIMMetalGear`** | `mining/ETIMToolDurability.java:36-58`：`:41-47` 跳过 `ETIMMetalGear`；`:60-70` 对非镐/斧/锹/剑返回 `components = 0` ⇒ `:49-51` 跳过 | 若是 `ItemTool`，`:56` 会用 vanilla 材质表**重写** `maxDamage`（主 mod 自己踩过：`adamantium pickaxe 307200→9600`，`ETIMGear.java:170-174`） |
| 7 | 同上（机制重叠） | `mixins/MixinItem.java:137/153/175` 三处门为 `isBlockCarrier`（工具专属） | 若是 `ItemTool`，主 mod 会**接管** action/duration/start ⇒ 本类 L-3 的 #4/#5/#6 变成死代码 + 双份 `[BlockLog] start` 语义 |

**关于「不加 BLOCK/decay 工具语义」与「`getItemUseAction → BLOCK`」的措辞澄清（不构成冲突）**：T-5 禁的是**工具格挡语义**（`canBlock()` 起手门 + R196 decay int 磨损 + 主 mod 对工具的 action 接管）；`EnumAction.BLOCK` 只是**动画/使用态枚举**，是主 mod 判据 `isHandActive()` 与 `isActiveItemStackBlocking()` 的读入口，二者不同层。本报告按此执行：**BLOCK 枚举要，工具语义不要**。

---

## §10 L-10 · 判行锚与 W 判点草案

**通道分工（只引不改）**：本项目新增 `[ExtraLog]`（注册/配方两条）；格挡链一律读主 mod 的 `[BlockLog]`（`combat/ETIMBlockLog.java`，开关 `ETIMConfig.blockDebugLog` `:370-372`／`:872-874`）。

| 判点 | 通道 | 预期行（原样形态） | 判据（正 / 反） |
|---|---|---|---|
| **W-1** 注册与耐久 | `[ExtraLog]`（新，挂 `extraDebugLog`） | `[ExtraLog] shield item=etimextra:mithril_shield metal=mithril maxDamage=25600 enchantability=100 stack=1 [server]` | 正：两行、值逐字对；反：`maxDamage=0` 或 `enchantability=0` ⇒ L-3 #2/#7 漏 |
| **W-2** 配方与 6 锭 | `[ExtraLog]`（新） | `[ExtraLog] shield recipe=etimextra:shield_mithril ingot=etim:ingot_mithril count=6 [server]` | 正：两行、`count=6`；反：`count≠6` 或注册缺行 ⇒ L-7 形状/锭引用错 |
| **W-3** 全免段已关 | `[BlockLog]` `gate`（`ETIMBlockLog.java:90-97`） | `[BlockLog] gate player=<n>#<id> active=etimextra:mithril_shield src=<type> suppressed=true [server]` | 正：举盾受击出现该行；反：**不出现** ⇒ 主 mod mixin 未生效/`blockModel=false`（前置 4） |
| **W-4** 半减 + 下限 | `[BlockLog]` `block`（`:99-111`） | `[BlockLog] block player=<n>#<id> src=mob raw=8.000 blocked=4.000 factor=0.500 min=1.000 carrier=etimextra:mithril_shield [server]` | 正：`blocked = max(raw×0.5, 1.0)`、`carrier` 是本盾；反：`carrier` 为 `-` 或 `blocked=0.000` |
| **W-5** 磨损（rate 臂） | `[BlockLog]` `wear`（`:113-125`） | `[BlockLog] wear player=<n>#<id> item=etimextra:mithril_shield rate=1.000 decay=na raw=8.000 blocked=4.000 wear=4 dur=0->4 [server]` | 正：`wear=(int)(blocked×rate)`、`decay=na`（盾行走 na 是 B-10 记号）、`dur` 增量 = `wear`；反：`decay` 出数字（说明被当成工具/走错臂）或 `dur` 不动 |
| **W-6** 耐久读数 | `[BlockLog]` `probe`（`:127-134`） | `[BlockLog] probe player=<n>#<id> held=etimextra:mithril_shield dur=0/25600 [server]` | 正：分母 = 配置默认；反：分母 336（继承 ItemShield 的迹象）或 0 |
| **W-7** 附魔门（**用户操作面**） | 附魔台 GUI + `[ExtraLog]` 的 `enchantability=` 行 | 附魔台三档非 0 且出 Unbreaking；`[ExtraLog] shield … enchantability=100` | 判据以**日志行**为主（`enchantability>0` + L-8③ 硬门）；「出什么附魔」由用户转述，不作判据 |
| **W-8** 品质不生效（**用户操作面**） | 物品 tooltip（无品质行）+ 静态锚 | 静态锚：`ETIMQuality.hasQualityChannel(this) == false` | 日志不可判；只作静态锚 + 用户转述 |

**三条口径**：① 纯渲染/手感面（W-7 的附魔名、W-8 的 tooltip）**由用户操作 + 原文转述，不作判据**；② 数值面一律以 `[BlockLog]`/`[ExtraLog]` 行为判据，`%.3f` 三位（`ETIMBlockLog.java:173-176`）；③ 反例命中即失败。判点编号用 `W-n` 占位，**不携带主项目批号**。

---

## §11 L-11 · 冲突分级与待裁位

### 11.1 A 级（阻断：落错就回归/崩）

| 编号 | 冲突 | 证据 | 后果 |
|---|---|---|---|
| **A-1** | **注册时序 vs 配置时序**：耐久键在 `ETIMExtraConfig.init`（`ETIMExtraConfig.java:39-48`）里载入，而 `RegistryEvent.Register<Item>` 早于 `FMLPreInitializationEvent` | 采用 preInit：`ETIM.java:74-77` 同形；替代案的时间序见 `RegistryEvent.java:63` 与 `ETIMBiomeUnderworld.java:61-64` | 若误用 RegistryEvent，构造器读到的是字段初值 ⇒ 配置键静默失效（**没有报错**，最难查） |
| **A-2** | **`isShield` 的 entity 可能是 null** | 两处实调都传 `null`：`combat/ETIMBlocking.java:96`、`entity/EntityLiving.java:1130` | 覆写里若 `entity.isHandActive()` ⇒ 受击瞬间 **NPE**（服务端崩） |
| **A-3** | **本类不得是 `ItemTool`/`ETIMMetalGear`** | `mining/ETIMToolDurability.java:40-58`（`:56` 会重写 maxDamage）、`mixins/MixinItem.java:137/153/175`（工具专属门） | 走工具路 ⇒ 派生耐久被 vanilla 材质表覆盖 + action/start 被主 mod 接管（L-3 #4/#5/#6 变死代码、双份语义） |

### 11.2 B 级（需 ETIM-Extra 主会话裁/确认）

| 编号 | 事项 | 一手/实证约束 |
|---|---|---|
| **B-1** | **附魔台实际只出 Unbreaking**（Mending/Vanishing 是 treasure，`ContainerEnchantment.java:337` 传 `false`） | L-8 表；T-4「不补白名单」的直接后果。若主会话要保 Mending 可台出，唯一合法路径是改 `Item.canApplyAtEnchantingTable` 覆写（属新面，**本批不做**） |
| **B-2** | **无 5 tick 起手门槛**（vanilla 有 `EntityLivingBase.java:3125`，被 L-9⑨ 一并断掉） | 与 R196 一致（`ItemRenderer.java:352` 只需 `getItemInUseCount() > 0`）；但与玩家对「原版盾」的手感记忆不同 |
| **B-3** | **一个盾横跨两份配置**：耐久在 `etimextra.cfg`（L-4），磨损率在 `etim.cfg` 的 `shieldWearRate`（`ETIMConfig.java:369`） | 玩家调参要知道两个文件；本报告不改主 mod 配置面 |
| **B-4** | `blocking` 属性无消费者（首批只有 `item/handheld` 一个模型） | `Item.java:158-161` 注册成功但模型 JSON 不写 `overrides` ⇒ 属性休眠；见 D-1 |

### 11.3 C 级（登记，不改判值）

| 编号 | 事项 | 一手实况 |
|---|---|---|
| **C-1** | `setMaxDamage` 会**自动**加两个属性覆写 | `item/Item.java:264-275`，`:270-271` 加 `damaged`/`damage`；模型不写对应 `overrides` 时静默无效果 |
| **C-2** | 本树 MCP 名是 stable_39：`setTranslationKey` | `item/Item.java:346-350`；`setUnlocalizedName` 全树 **0** 命中（§12 N-4） |
| **C-3** | 主 mod 的 `addShaped` 是 `private` | `metal/ETIMGear.java:307-328` ⇒ 跨 mod 不可调，只能内联 `GameRegistry.addShapedRecipe` |
| **C-4** | 主 mod 的 `[BlockLog] action/start` **不覆盖盾** | `mixins/MixinItem.java:137/153/175` 门 = `isBlockCarrier`（工具）⇒ 盾的起手只有本类自己的实现，日志里没有 `start` 行（判 W-3/W-4/W-5 用 `gate`/`block`/`wear`） |
| **C-5** | `getItemStackLimit` 有两版 | `item/Item.java:227`（无参）／`:1104-1107`（ItemStack 敏感，委派无参）⇒ 只覆写 `setMaxStackSize` 即可 |
| **C-6** | 创造模式不磨损（两道） | `item/ItemStack.java:385-388`（`damageItem` 首判 creative）+ `combat/ETIMBlocking.java:150` ⇒ 创造下 W-5 的 `dur` 不变属**预期**，不是缺陷 |

### 11.4 待裁位（D-1…D-3，二选一 + 倾向；本件不裁定）

| 编号 | 待裁 | 选项 | 倾向（理由） |
|---|---|---|---|
| **D-1** | `blocking` 属性首批是否落地模型侧 | ① 只注册属性，模型 JSON **不**写 `overrides`（属性休眠）／② 首批就写 `overrides` + 追加一个 `_blocking` 模型与纹理 | **倾向 ①**：首批定为「标准 `item/handheld` + 无 3D」，写 overrides 只会指向同一模型（视觉零变化）却多两个资源；属性先注册，等 3D 批再接 |
| **D-2** | 附魔度覆写面 | ① 只覆写 `getItemEnchantability()`／② 同时覆写 `getItemEnchantability(ItemStack)` | **倾向 ①**：`:1156-1159` 已委派；主 mod 先例 `metal/ETIMItemAxe.java:63-66` 亦只覆写无参版 |
| **D-3** | 注册点 | ① `preInit`（同主 mod）／② `RegistryEvent.Register<Item>` + 把配置前移到 `FMLConstructionEvent` | **倾向 ①**：不破坏 `ETIMExtraConfig.init(FMLPreInitializationEvent)` 的既有契约；② 需要改配置入口，属额外回归面 |

> **D 位说明**：三条均非「改判 T-1…T-5」，而是任务书 §3 未指定的实现位；裁定后不改变任何耐久/配方/附魔数值。

### 11.5 落码清单（供实施会话，逐件一张表）

| 类型 | 文件 | 职责 / 改法 | 判行锚 |
|---|---|---|---|
| 新增 java | `src/main/java/io/github/etim/etimextra/shield/ETIMExtraItemShield.java` | §3.2 伪代码整类：ctor（stack 1 + maxDamage + 战斗页 + blocking 属性）＋ 6 个覆写（`isShield` / `getItemUseAction` / `getMaxItemUseDuration` / `onItemRightClick` / `getItemEnchantability`） | `[ExtraLog] shield …` 的 `enchantability=` 列 |
| 新增 java | `src/main/java/io/github/etim/etimextra/shield/ETIMExtraContent.java` | §5 伪代码整类：`register()` 两件 + `assertRegistered()` + `registerRecipes()`（§7） | `[ExtraLog] shield …`（2 行）＋ `[ExtraLog] shield recipe … count=6`（2 行） |
| 新增 java | `src/main/java/io/github/etim/etimextra/client/ETIMExtraItemModels.java` | `@Mod.EventBusSubscriber(value = Side.CLIENT, modid = ETIMExtra.MOD_ID)` + `ModelRegistryEvent` → 两件盾双写（`ModelLoader.java:1089`） | 客户端模型无日志面（`ETIMItemModels.java:53` 的同形 `[TestLog]` 不复制到本项目，本批不加新通道） |
| 改 java | `src/main/java/io/github/etim/etimextra/ETIMExtraConfig.java` | §4 伪代码：+2 个 `int` 字段 + `init` 内两条 `config.getInt(..., "shield", ...)` | `config/etimextra.cfg` 里 `shield.mithrilDurability=25600` / `shield.adamantiumDurability=102400` |
| 改 java | `src/main/java/io/github/etim/etimextra/ETIMExtra.java` | `preInit`（`:59-62`）内，`ETIMExtraConfig.init(event)`（`:60`）与 `ETIMExtraLog.preInit()`（`:61`）之后追加一行 `ETIMExtraContent.register();` | 启动日志顺序：先 `[ExtraLog] preInit`，后两行 `[ExtraLog] shield item=…` |
| 新增资源 | `assets/etimextra/models/item/{mithril,adamantium}_shield.json` | §6 两行 JSON（`item/handheld` + `etimextra:items/<name>`） | 客户端 F3+T 无 missing model |
| 新增资源 | `assets/etimextra/textures/items/{mithril,adamantium}_shield.png` | 16×16 占位图（落码阶段生成） | 同上 |
| 新增资源 | `assets/etimextra/lang/{en_us,zh_cn}.lang` | 4 个键（§6 表） | 显示名 = `Mithril Shield` / `秘银盾` |
| **不动** | `minecraft` 树、主 mod 任何文件、`gradle.properties`、`build.gradle`、`mcmod.info`、mixin 配置 | — | — |

---

## §12 负证表（检索式 + 命中数 + 覆盖范围）

| 编号 | 检索式 | 覆盖范围 | 命中 | 结论 |
|---|---|---|---|---|
| **N-1** | 目录枚举 `ETIM-Extra\src\main\resources` | 该项目资源根 | `mcmod.info`、`pack.mcmeta` 两件 | **无 `assets/`** ⇒ 六件资源全部为新增（§6） |
| **N-2** | `QPAT='shield … Shield'`（内容匹配，两条检索合并计） | `ETIM-Extra\src`（java/json/lang/cfg） | **9**，全部是 `ETIMExtra.java` / `ETIMExtraConfig.java` 的 **javadoc 文字** | **零盾类/零盾资源**（首批尚未落码） |
| **N-3** | `QPAT='setUnlocalizedName'` | `ETIM-Extra\build\rfg\minecraft-src\java\net\minecraft`（全文） | **0** | 本树用 `setTranslationKey`（C-2）；写 `setUnlocalizedName` 会编译失败 |
| **N-4** | `QPAT='isShield\('` | 同上 | **4**（定义 `item/Item.java:1298`；调用 `entity/EntityLiving.java:1130`、`entity/player/EntityPlayer.java:1174`）＋ 主 mod `combat/ETIMBlocking.java:96` | 调用面收敛（L-9⑬），其中两处传 `null` |
| **N-5** | `QPAT='canApplyAtEnchantingTable'` | 同上 | **6**（`Enchantment.java:187/221/223`、`EnchantmentHelper.java:457`、`Item.java:1163/1169`） | **没有任何附魔子类覆写它** ⇒ 全部走 `type.canEnchantItem`（L-8 门链成立） |
| **N-6** | `QPAT='damageShield'` | 同上 | **3**（`EntityLivingBase.java:998/1502`、`EntityPlayer.java:1172`） | 唯一调用点 `:998` 在全免段内 ⇒ L-9⑪ 无双磨损 |
| **N-7** | `QPAT='TileEntityItemStackRenderer … Items.SHIELD'`（同上合并计） | 同上 | **16**，盾相关关键两条：`TileEntityItemStackRenderer.java:62`（`item == Items.SHIELD`）、`RenderItem.java:1050`（mesh 只注册 `Items.SHIELD`） | 继承 `ItemShield` 拿不到 3D 模型（§3 负担 6） |
| **N-8** | `QPAT='addShaped'` | 主 mod `metal/ETIMGear.java` | **33**（`private static void addShaped(...)` 定义 1 处 + 调用） | 定义是 `private` ⇒ 跨 mod 不可复用（C-3） |

---

## §13 附注

1. **零改动**：本件只读 R196 树、`extra-shield-javap/`、主 mod `src`、`ETIM-Extra/build/rfg`、`ETIM-Extra/src`；**未改任何 java/json/lang/config/gradle，未起服、未构建、未跑 gradle、未动 git**。唯一写入 = 本报告。
2. **不改裁**：T-1…T-5 与 §3 八条逐条照执行；D-1…D-3 只是实现位，不触碰任何数值裁定。
3. **1.12.2 只作落法面**：本报告所有 1.12.2 行号只回答「落哪里/怎么落」，**没有一个 R196 判值来自 1.12**；派生算式的三个因子（4.0F／64.0F／256.0F／100.0F）全部来自 R196 树。
4. **派生值声明（重复一次）**：25,600／102,400 是**派生值**，不是 R196 盾耐久（A-1 已证无盾）。
5. **跨 mod 引用面**：`ETIMMetals`（`metal/ETIMMetals.java:35-72`，`public` 枚举 + `public final` 字段）与 `ETIMItems.ingotMithril/ingotAdamantium`（`:31-32`）经 `dev` 分类器（`dependencies.gradle:36`）在编译期可见；**运行期**靠 `required-after:etim`（`ETIMExtra.java:37-38`）保证已注册。
6. **未做面（显式声明）**：3D 盾模型 / TEISR / `_blocking` 模型 / Mending 白名单 / 原版盾禁用 —— 均**不在本批**，也未给落法。
7. **W 判点编号**：`W-1…W-8` 为本批占位编号，不携带主项目批号；验证窗执行方按既有分工（自动化面交会话七，客户端面由用户操作）。
8. **面号冻结**：L-1…L-11 按任务书 §4 原号，不重排不增删。

---

## 回执（本件档尾）

| 字段 | 值 |
|---|---|
| 轮次 | ETIM-Extra 盾面 **对照报告 第 1 轮**（T-1…T-5 落法） |
| 面数 | **11**（L 组；L-1…L-10 判值面 + L-11 分级面） |
| 状态分布 | ✓ **10** ／ ✗ **0** ／ ? **0** |
| 冲突分级 | **A 3 ／ B 4 ／ C 6** |
| 待裁位 | **D-1…D-3**（均给倾向，本件不裁定） |
| 派生值 | mithril `4.0F×1×64.0F×100.0F = 25,600`；adamantium `4.0F×1×256.0F×100.0F = 102,400`（**派生值，非 R196 盾值**） |
| 落码清单 | 新增 java **3**（`shield/ETIMExtraItemShield`、`shield/ETIMExtraContent`、`client/ETIMExtraItemModels`）＋ 改 java **2**（`ETIMExtraConfig`、`ETIMExtra`）＋ 新增资源 **6**（2 模型／2 纹理／2 lang） |
| 机制面 | 零 mixin／零事件／零 TEISR／零新日志通道（格挡链只读主 mod `[BlockLog]`） |
| 负证 | **8 条**（N-1…N-8） |
| 零改动 | 未改文件、未起服、未构建、未跑 gradle、未动 git |
| 下一环 | 会话五终审（双源：R196 树 + 1.12.2 API 面）→ ETIM-Extra 主会话批文 → 落码 → 验证窗（W-1…W-8） |
