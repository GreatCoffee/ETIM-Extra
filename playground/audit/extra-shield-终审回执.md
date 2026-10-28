# ETIM-Extra 盾面 · 终审回执

> **执行方**：会话五（判决链终审方，javap 双源审计，etim-audit 承载）。
> **审件**：`D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-对照报告.md`（57,157 B / 650 行 / 11 面 L-1…L-11）。
> **判决源**：① R196 反编译树 `mite-src/decompile/src/net/minecraft/`（判值唯一一手；本审逐行直读，行号全部来自本轮 grep/read）；② R196 字节码卷 `ETIM-Extra/playground/audit/extra-shield-javap/`（31 件，续用 `javap_ItemTool.txt` / `javap_EnumEquipmentMaterial.txt` / `javap_Material.txt`）；③ 1.12.2 对位树 `ETIM-Extra/build/rfg/minecraft-src/java/net/minecraft/` 与 `...\net\minecraftforge\`（只核落法/API）；④ 主 mod 现役只读；⑤ ETIM-Extra 现状只读。
> **口径**：T-1…T-5（裁定回执条 11）与 D-1…D-3（条 12）不改判；审落法是否成立 + 派生算式 R196 双源是否钉得住；派生值 25,600/102,400 维持「派生值、非 R196 盾值」表述；零代码改动、零构建。

---

## 〇、判决类清单（必审 7 项 + 报告 11 面定谳）

| # | 审点 | 定谳 |
|---|---|---|
| 1 | 派生算式双源（L-1/L-2） | ✓ 定谳（R196 一手 :36-38/:40-42/:14-15 + javap 字节序逐字命中 + 两值算术自算一致） |
| 2 | 物品类 8 条方法面（L-3） | ✓ 定谳（8 条 path:line 全如实；起手生死线 `:2978-2979`；isShield 身份比较；`addPropertyOverride` **public final**） |
| 3 | 附魔门（L-8） | ✓ 定谳（附魔台三档路径 :217 → :340-348 硬门；:337 传 false；BREAKABLE 全集负证 2 命中；「附魔台实际只出 Unbreaking」成立 = T-4 裁定后果） |
| 4 | 无双磨损（L-9） | ✓ 定谳（vanilla 全免段与 vanilla 磨损同被一处 mixin 断掉；`damageShield` 唯一调用点 :998 锤定） |
| 5 | 主 mod 两臂判据行（L-9①…⑦） | ✓ 定谳（七行全部如实；`shieldWearRate` 字段 :369 + 注册 :869-871） |
| 6 | 配方与跨 mod（L-7） | ✓ 定谳（6 锭计数；`GameRegistry.addShapedRecipe` 签名 :200-204；主 mod `addShaped` **private** :308；dev 分类器 :36） |
| 7 | 勘误 E-1 定谳 | **✓ 确认**（`Loader.preinitializeMods()` 实序 :625/:629/:630 一手逐行——`RegistryEvent.Register` **晚于** `FMLPreInitializationEvent`；报告 :317/:557 的「早于」为事实性反向错误） |
| 8 | 报告 11 面（L-1…L-11） | ✓ 全维持（✓10 / ✗0 / ?0；终审自添 B 级 1 条、C 级 1 条，见 §二） |

---

## 一、逐项核讫表

### 1.1 必审 1 —— 派生算式双源（L-1 / L-2）

**R196 一手**（本审逐行直读）：

- `ItemTool.java:36-38` `getBaseDurability()` → `return 4.0F;`（`:37`）。
- `ItemTool.java:40-42` `getMultipliedDurability()` → `return (int)(this.getBaseDurability() * this.getNumComponentsForDurability() * this.effective_material.durability * 100.0F);`（`:41`，左结合四因子，末位 `×100.0F` 后 `(int)`）。
- `EnumEquipmentMaterial.java:14` `mithril(64.0F, 100, EnumQuality.legendary, "mithril"),`；`:15` `adamantium(256.0F, 40, EnumQuality.legendary, "adamantium"),`。枚举字段 `:22` `public final float durability;`、`:23` `public final int enchantability;`——**durability 与 enchantability 是同一枚举的相邻两字段**（L-8② 取附魔度的同源锚）。
- `ItemShovel.java:26-28`、`ItemCudgel.java:32-34`、`ItemHatchet.java:30-32` 均 `public int getNumComponentsForDurability() { return 1; }`（报告引 `:25-28` / `:31-34` / `:29-32` 为区间式引用，**含真锚**，方法声明行实为 `:26`/`:32`/`:30`——零后效，裁定回执条 11 自用 `ItemShovel:26`/`ItemCudgel:32` 为精确行，两处不矛盾）。

**javap 双源**（`extra-shield-javap/`，本审续用重锤）：

- `javap_ItemTool.txt:113-116`：`getBaseDurability()` 体 = `0: ldc #141 // float 4.0f` → `freturn`。
- `javap_ItemTool.txt:118-133`：`getMultipliedDurability()` 体 = `getBaseDurability`(#143) → `getNumComponentsForDurability`(#146) → `i2f` → `fmul` → `getfield effective_material:Material`(#51) × `getfield Material.durability:F`(#149) → `fmul` → `ldc #150 // float 100.0f` → `fmul` → `f2i` → `ireturn`——**与报告 §1 javap 复核段逐字对上**。
- `javap_EnumEquipmentMaterial.txt:187-190`（mithril）：`bipush 10` → `ldc #120 // float 64.0f` → `bipush 100` → `getstatic EnumQuality.legendary`；`:197-200`（adamantium）：`bipush 11` → `ldc #127 // float 256.0f` → `bipush 40` → `getstatic legendary`——**与报告逐字对上**（offset 226/228/230 与 249/251/253）。
- **durability 因子的传递链**（报告未展开，终审补锤）：`javap_ItemTool.txt:127` 显示 `effective_material` 声明类型是 `net.minecraft.Material`（非枚举本身）；`javap_Material.txt:280` `Material(EnumEquipmentMaterial)` 构造器 `:290` `getfield EnumEquipmentMaterial.durability:F` → `:317` `putfield durability:F`——枚举的 64.0F/256.0F **原值直传**进 Material 实例字段，`ItemTool.java:41` 运行期读的正是它。⇒ L-1③④ 以 `EnumEquipmentMaterial.java:14-15` 为 durability 因子一手锚**成立**。

**两值算术自算**（终审独立复算）：`4.0F × 1 × 64.0F × 100.0F`：4→4；4×64=256；256×100=25,600.0；`(int)`→**25,600**。`4.0F × 1 × 256.0F × 100.0F`：4×256=1,024；×100=102,400.0；→**102,400**。两值及全部中间值（4/256/25,600；4/1,024/102,400）均为 float32 精确可表示（< 2²⁴ = 16,777,216）⇒ `(int)` 恒等，不丢位。与报告 L-2 表逐字一致。

**外部自检锚**：`git-workspace/etim/.../metal/ETIMGear.java:170-174` javadoc「adamantium pickaxe 307200→9600」在场（`4.0×3×256×100 = 307,200` 与 `:41` 算式吻合）✓。

**判词**：✓ 派生算式 R196 双源钉得住；两值 = **25,600 / 102,400**（派生值性质声明维持）；L-1 / L-2 定谳。

### 1.2 必审 2 —— 物品类 8 条方法面（L-3）

1.12.2 树 `item/Item.java`（本审逐行直读，全部与报告 path:line 相符）：

| # | 锚 | 实读 | 判词 |
|---|---|---|---|
| 1 | `:190-194` | `setMaxStackSize(int)` 存 `maxStackSize` | ✓ |
| 2 | `:264-275` | `setMaxDamage(int)`；**:268-272 自动加 `damaged`/`damage` 两个属性覆写**（:270-271） | ✓（报告 C-1 引 `:264-275`/`:270-271` 如实） |
| 2b | `:277-280` | `isDamageable()` = `maxDamage > 0 && (!hasSubtypes ‖ maxStackSize == 1)` | ✓ |
| 3 | `:1298-1301` | `isShield(stack, entity)` 默认 `stack.getItem() == Items.SHIELD` **身份比较** | ✓ |
| 4 | `:433-436` | `getItemUseAction(stack)` 默认 `EnumAction.NONE` | ✓ |
| 4b | `item/EnumAction.java:8` | `BLOCK` 枚举常量 | ✓ |
| 5 | `:441-444` | `getMaxItemUseDuration(stack)` 默认 `0` | ✓ |
| 5b | `entity/EntityLivingBase.java:2977-2982` | `:2978` `ForgeEventFactory.onItemUseStart(..., itemstack.getMaxItemUseDuration())`；**:2979 `if (duration <= 0) return;`** ——起手生死线 | ✓ |
| 6 | `:209-212` | `onItemRightClick` 默认返回 `PASS` | ✓ |
| 7 | `:519-522` | `getItemEnchantability()` 默认 `0`；ItemStack 敏感版 `:1156-1159` **委派无参版** | ✓（D-2 依据锤定） |
| 8 | `:158-161` | `addPropertyOverride(ResourceLocation, IItemPropertyGetter)` —— **`public final`** | ✓（方法为 final，不能覆写，只能调用——报告「是 final」表述正确） |
| — | `:227` / `:1104-1107` | `getItemStackLimit()` 两版（无参 + ItemStack 敏感委派） | ✓（C-5） |
| — | `:346-350` / `:364-368` / `:462-464` | `setTranslationKey` / `getTranslationKey` 前置 `"item."` / 拼接 `".name"` | ✓（lang 键链逐段成立） |
| — | `:556-560` | `setCreativeTab` | ✓ |
| — | `:1169-1172` | `canApplyAtEnchantingTable` → `type.canEnchantItem` | ✓ |
| — | `:1344-1352` | TEISR getter（`public final`）/ setter | ✓ |

**ItemShield 负担面**（`item/ItemShield.java`，报告 §3 负担表 6 条全锤）：`:23` 无参构造器 ✓；`:25-27` `maxStackSize=1` + `COMBAT` + **`:27` `setMaxDamage(336)`** ✓；`:28-35` blocking 属性 getter（匿名类，`apply` 标 `@SideOnly(CLIENT)` :30-31）✓；`:36` `BlockDispenser...putObject(this, ItemArmor.DISPENSER_BEHAVIOR)` ✓；`:39-50` `getItemStackDisplayName` 绑 `item.shield.*` ✓；`:77-82` `onItemRightClick` 同形（setActiveHand + SUCCESS）✓；`:90-93` `getIsRepairable` 绑 `Blocks.PLANKS` ✓。**负担 6**：`client/renderer/tileentity/TileEntityItemStackRenderer.java:62` `else if (item == Items.SHIELD)` 身份判据 ✓。

**判词**：✓ 8 条方法面全部如实；「不继承 `ItemShield`」的六条负担与「维持不继承」结论成立；L-3 定谳。

### 1.3 必审 3 —— 附魔门（L-8）

**门链逐段**（本审直读）：

- 附魔台取档：`inventory/ContainerEnchantment.java:334-345` `getEnchantmentList` → **`:337` `EnchantmentHelper.buildEnchantmentList(this.rand, stack, level, false)`** —— `allowTreasure=false` ✓。
- **三档等级路径**（终审补锤，防下游绕开）：`ContainerEnchantment.java:215-217` `for (i1 = 0..2) this.enchantLevels[i1] = EnchantmentHelper.calcItemStackEnchantability(this.rand, i1, power, itemstack)` —— 报告 L-8③ 引的 `EnchantmentHelper.java:340-348`（`:343` `int i = item.getItemEnchantability(stack);` / `:345-348` `if (i <= 0) return 0;`）正是**三档等级的硬门**：enchantability=0 ⇒ 三档全 0 ⇒ `:230` `enchantLevels[j1] > 0` 不过 ⇒ `getEnchantmentList` 根本不被调 ⇒「连附魔台都不出档」成立 ✓（`:351-354` power 上限 15、`:356` 强度式亦在场）。
- 候选双门：`EnchantmentHelper.java:397-434` `buildEnchantmentList`：**:401-406 同形硬门**（`i = getItemEnchantability(stack); if (i <= 0) return list;`）→ `:412` `getEnchantmentDatas(level, stack, allowTreasure)` → `:455-457` 双条件 `(!enchantment.isTreasureEnchantment() || allowTreasure) && (enchantment.canApplyAtEnchantingTable(...) ‖ (flag && isAllowedOnBooks()))` ✓。
- 入口链：`Enchantment.java:221-224` → `Item.java:1169-1172` → `EnumEnchantmentType.canEnchantItem` ✓；`Enchantment.java:185-188` `canApply` 委派 `:187` ✓。
- 类型判定：`enchantment/EnumEnchantmentType.java` —— **ALL `:17-33`**（`:23-29` 逐类型委派，排 ALL 自身）、ARMOR 族 `:34-78`、WEAPON `:79-87`（ItemSword）、DIGGER `:88-95`（ItemTool）、**BREAKABLE `:106-114`（`:112` `return itemIn.isDamageable();`）**、**WEARABLE `:124-133`（`:130-131` = ItemArmor ‖ ItemElytra ‖ ItemSkull ‖ ItemBlock(BlockPumpkin)）** ✓。
- 附魔侧：`EnchantmentDurability.java:12` BREAKABLE（无 `isTreasureEnchantment` 覆写 ⇒ 基类 `Enchantment.java:205-208` 默认 **false**）；`EnchantmentMending.java:9` BREAKABLE + **`:29-32` `return true`**；`EnchantmentVanishingCurse.java:9` **ALL** + `:37-40` `return true`；`EnchantmentBindingCurse.java:9` **WEARABLE** ✓。

**负证复验**（终审独立跑）：
- `EnumEnchantmentType.BREAKABLE` 检索式，覆盖 `net/minecraft/enchantment` 全目录：命中 **2**（`EnchantmentDurability.java:12` + `EnchantmentMending.java:9`）⇒ BREAKABLE 全集 = Unbreaking + Mending 两条，报告 §8.2 表述成立。
- `calcItemStackEnchantability` 全树检索（`minecraft-src` 整树）：命中 **2**（`EnchantmentHelper.java:340` 定义 + `ContainerEnchantment.java:217` 调用）⇒ 非死码，附魔台三档必经。
- `canApplyAtEnchantingTable`：enchantment 目录 4 命中（`Enchantment.java:187/221/223` + `EnchantmentHelper.java:457`）+ `Item.java:1163/1169` ⇒ 全树 6 ✓（N-5 复验；无任何附魔子类覆写它）。

**判词**：✓ L-8 定谳。到得了 = BREAKABLE（Unbreaking 台出 / Mending 只能书+铁砧）；到不了 = Binding（WEARABLE）、WEAPON/DIGGER/ARMOR 族。**「附魔台实际只出 Unbreaking」成立，且是 T-4「不补白名单」的裁定后果，不是缺陷**（报告 §11.2 B-1 已正确注明，维持）。

### 1.4 必审 4 —— 无双磨损（L-9 vanilla 侧）

**一手直读**（`entity/EntityLivingBase.java`，total 3296 行）：

- **:996-1012** 全免段：`:996` `if (amount > 0.0F && this.canBlockDamageSource(source))` → **`:998` `this.damageShield(amount);`** → `:999` `amount = 0.0F;`（:1001-1009 projectile 分支 blockUsingShield；:1011 flag=true）。
- `damageShield` 在 ELB 内命中 **2**（`:998` 调用 + `:1502` 基类空定义 `:1502-1504`）⇒ **:998 是本类内唯一调用点** ✓（N-6 的第 3 命中 = `EntityPlayer.java:1172` 覆写定义，非调用）。
- **:1232/:1234** `canBlockDamageSource` 定义与体：`:1234` `if (!damageSourceIn.isUnblockable() && this.isActiveItemStackBlocking())` —— `isActiveItemStackBlocking` 唯一调用点 ✓。
- **:3113-3127** `isActiveItemStackBlocking`：`:3119` `getItemUseAction(...) != EnumAction.BLOCK → false`；**:3125 `return item.getMaxItemUseDuration(...) - this.activeItemStackUseCount >= 5;`**（5 tick 门槛）✓。
- **:1498-1504** `damageArmor` 基类空 + `damageShield` 基类空 ✓。

**EntityPlayer.java:1172-1178**（vanilla 磨损）：`:1174` `if (damage >= 3.0F && this.activeItemStack.getItem().isShield(this.activeItemStack, this))` → `:1177` `int i = 1 + MathHelper.floor(damage);` → `:1178` `this.activeItemStack.damageItem(i, this);` ✓——**其可达性完全依赖 `:998` 的调用**。

**断点**（主 mod `mixins/MixinEntityLivingBaseBlock.java`，本审直读）：`:41-42` `@Inject(method = "canBlockDamageSource(Lnet/minecraft/util/DamageSource;)Z", at = @At("HEAD"), cancellable = true)`；`:44-46` `blockModel` 关时原样 return（回退面）；**:53 `cir.setReturnValue(false);`**（blockModel 开时全免段恒死）✓。

**判词**：✓ 无双磨损定谳——mixin 断 `canBlockDamageSource`（HEAD）⇒ `:996` 恒假 ⇒ `:998` `damageShield` 不可达 ⇒ `EntityPlayer:1172-1178` vanilla 磨损不可达 ⇒ 主 mod `wearShieldOrTool`（rate 臂）是唯一磨损臂，**不会叠加**。同链上 `:3113-3127` 的 5 tick 门槛亦不可达 ⇒ 盾无 vanilla 5 tick 门槛（B-2 / L-9⑫ 成立，与 R196 `ItemRenderer.java:352` 只看 `getItemInUseCount() > 0` 一致——该行本审上轮已直读在场）。

### 1.5 必审 5 —— 主 mod 两臂判据行（L-9①…⑦）

`combat/ETIMBlocking.java`（total 156 行，本审逐行直读）：

| 面 | 报告引 | 实读 | 判词 |
|---|---|---|---|
| ① 盾臂 | `:94-97` | `:95` `isShieldStack(ItemStack)`；`:96` `return !stack.isEmpty() && stack.getItem().isShield(stack, null);` | ✓（传 null 实锤） |
| ② 载体并集 | `:99-102` | `:100-101` `isBlockCarrier(stack) ‖ isShieldStack(stack)` | ✓ |
| ③ 事件门 | `:107-116` | `:109` `if (!ETIMConfig.blockModel ‖ !(… instanceof EntityPlayer)) return;`；`:113-114` `active = getActiveItemStack(); if (!player.isHandActive() ‖ !isBlockingCarrier(active)) return;` | ✓ |
| ④ 半减+下限 | `:121-129` | `:125-126` `blocked = Math.max(raw * blockDamageFactor, blockMinDamage);`；`:129` `event.setAmount(blocked);` | ✓ |
| ⑤ 磨损分叉 | `:140-148` | `:140` `wearShieldOrTool(...)`；`:143` `if (isShieldStack(active))`；`:144` `wear = (int)(blocked * ETIMConfig.shieldWearRate);` | ✓ |
| ⑥ 创造免磨 | `:149-152` | `:150` `if (wear > 0 && !player.capabilities.isCreativeMode)`；`:151` `active.damageItem(wear, player);` | ✓ |
| ⑦ 磨损率 | `ETIMConfig.java:367-369` / `:869-871` | `:369` `public static float shieldWearRate = 1.0F;`；`:869-871` `config.getFloat("shieldWearRate","combat",…)`；注释「the future etim-extra material table rides this slot」在场（:870） | ✓ |

配套判行锚（本审直读）：`ETIMConfig.java:362` `blockModel` + `:860` 注册、`:364` `blockDamageFactor=0.5F` + `:863`、`:366` `blockMinDamage=1.0F` + `:866`、`:372` `blockDebugLog=false` + `:872-874` —— 全部与报告 L-9③/前置 4 与 L-10 引用相符 ✓。`combat/ETIMBlockLog.java`：`gate` `:91-97`（:95-96 行形）、`block` `:100-111`（:105-110）、`wear` `:114-125`（:119-124，**:122 `decay < 0 ? "na" : …`** 盾行 na 记号）、`probeDurability` `:128-134`（:132-133）、`f3` `:174-176`（`%.3f`）——报告 L-10 的 W-3/W-4/W-5/W-6 引用行位与预期行形态**逐字对上** ✓。`mixins/MixinItem.java:137/153/175` 三处门均为 `isBlockCarrier`（**不含盾**）✓（L-9⑭ / C-4 成立）。`mining/ETIMToolDurability.java:36-58`：`:41-47` `ETIMMetalGear` continue（:45 注释「adamantium pickaxe 307200→9600」在场）、`:48-51` components≤0 skip、`:56` `item.setMaxDamage((int)(4.0F*components*durability*100.0F))` 重写——A-3 证据逐字对上 ✓。`quality/ETIMQuality.java:78-85` `hasQualityChannel` = 6 个 instanceof 白名单（ItemTool/ItemSword/ItemShears/ItemHoe/ItemArmor/ItemBow）✓；javadoc `:51-55`「Unmapped/foreign items fall to AVERAGE」在场 ✓——§8.3「品质不进本类自动成立」锤定。

**判词**：✓ 主 mod 两臂判据行全部如实；L-9①…⑦ 定谳。

### 1.6 必审 6 —— 配方与跨 mod（L-7）

- **6 锭计数**：`"X X"`(2) + `"XXX"`(3) + `" X "`(1) = **6**；`GameRegistry.java:200-204` `addShapedRecipe(ResourceLocation name, ResourceLocation group, @Nonnull ItemStack output, Object... params)` → `:202` `CraftingHelper.parseShaped(params)` 按字符计数 ✓（报告 L-7② 引 `:200-204` 如实；签名实读逐字相符）。
- **主 mod 形状器**：`metal/ETIMGear.java:308` `private static void addShaped(String name, Object component, Object... rows)` —— **private** ✓（C-3 成立，跨 mod 不可调）；`:313-321` `'/'` = `Items.STICK` 补键逻辑在场（:313 `indexOf("/")`、:318-320 stick 两键）——报告「盾形状不含 `/`，故不传 stick」的差异登记成立 ✓；`:322` 配方主键形 `new ResourceLocation(ETIM.MOD_ID, "gear_" + name)` ✓；`:327` 内部同样调 `GameRegistry.addShapedRecipe(id, null, …)` ✓。
- **注册先例**：`ETIMGear.java:134-141` `register`（setRegistryName → setTranslationKey → `ForgeRegistries.ITEMS.register` → 收集 + JUDGED_DURABILITY）✓；`:151-158` `assertRegistered` fail-fast 形 ✓。
- **主 mod 注册点**：`ETIM.java:74-77` preInit 内 `ETIMItems.register()` / `ETIMBlocks.register()` / `ETIMGear.register()`，`:76` 注释「50 tools + 40 armor + 5 chains」与报告逐字对上 ✓。
- **锭引用**：`metal/ETIMItems.java:31` `ingotMithril` / `:32` `ingotAdamantium` 字段；`:48-49` `simple("ingot_mithril")` / `simple("ingot_adamantium")`；`:73-77` `simple` 内 `:75` `setRegistryName(ETIM.MOD_ID, name)` ⇒ 注册名 = **`etim:ingot_mithril` / `etim:ingot_adamantium`** ✓。
- **跨 mod 引用面**：`metal/ETIMMetals.java:35-72` `public enum` + `:45-59` `public final` 字段（MITHRIL `:40` enchantability=**100**、ADAMANTIUM `:41` =**40**）✓；`ETIMExtra.java:37-38` `dependencies = "required-after:etim"` ✓；`ETIM-Extra/gradle/scripts/dependencies.gradle:36` `implementation('io.github.etim:etim:1.0.0:dev')`（注释 :30-32 明写 dev 分类器 = MCP 名）✓。

**判词**：✓ L-7 定谳；6 锭 = 2+3+1；`ETIMItems.ingotMithril/ingotAdamantium` 可见性与注册名如报告。

### 1.7 必审 7 —— 勘误 E-1 定谳

**一手实序**（`net/minecraftforge/fml/common/Loader.java:618-636`，本审逐行直读）：

```
:625  GameData.fireCreateRegistryEvents();
:626  ObjectHolderRegistry.INSTANCE.findObjectHolders(...);
:628  CapabilityManager.INSTANCE.injectCapabilities(...);
:629  modController.distributeStateMessage(LoaderState.PREINITIALIZATION, ...);   ← FMLPreInitializationEvent 在此分发
:630  GameData.fireRegistryEvents(rl -> !rl.equals(GameData.RECIPES));            ← RegistryEvent.Register（BLOCKS/ITEMS 等）在此之后
:631  FMLCommonHandler.instance().fireSidedRegistryEvents();
```

配套：`fml/common/LoaderState.java:44` `PREINITIALIZATION("Pre-initializing mods", FMLPreInitializationEvent.class)` ✓；`event/RegistryEvent.java:63` `public static class Register<T extends IForgeRegistryEntry<T>> extends RegistryEvent<T>` ✓；`registries/GameData.java:834-850` `fireRegistryEvents(Predicate)` 内 `:847` `post(getRegisterEvent(BLOCKS))`、`:850` 起 ITEMS——发即 `RegistryEvent.Register` 类事件 ✓。

⇒ **定谳：`RegistryEvent.Register`（:630）晚于 `FMLPreInitializationEvent`（:629）分发**。账本条 12 的 E-1 勘误**确认**；报告 `:317`（L-5 表替代案行）与 `:557`（A-1 证据列）的「**早于** `FMLPreInitializationEvent`」为事实性反向错误。

**连带判词（重要，出 B 级，见 §二 B-审1）**：报告 `:317` 的后果推断「`RegistryEvent` ⇒ `ETIMExtraConfig.init` 尚未跑 ⇒ 构造器读到字段初值 ⇒ 配置键静默失效」**随 E-1 一并失实**——实序下 RegistryEvent 在 preInit **之后**，配置已载入，`RegistryEvent.Register<Item>` 路径**同样能**读到配置值。报告 `:42`（L-5 结论句）「preInit 是唯一能拿到配置值的点」随之为「可行点之一，非唯一」。**这不改判 D-3**（条 12 已裁案① preInit）：preInit 依旧与主 mod 同形、不破坏 `ETIMExtraConfig` 既有契约，裁定结论不受影响——只是支撑论据之一（「唯一性」）作废，余下论据（同形先例 `ETIM.java:74-77`、契约、`ETIMBiomeUnderworld` 之外无需事件订阅类）成立。交 ETIM-Extra 主会话知悉，不需重裁。

**病灶溯源旁证（注记，不占分级）**：主 mod `world/ETIMBiomeUnderworld.java:58-59` javadoc 写「mod registry stage, BEFORE the preInit handlers run」——同一反向时序句已写进主 mod javadoc；该 javadoc 非一手（§5 引 `:61-64` 只取「先例存在」，判值不受染），但下游若引注释会重新传染此错，特此登记。

---

## 二、冲突分级确认

**报告分级（A3 / B4 / C6）维持，终审无一打回**：

- **A-1**（注册时序）→ 结论维持（preInit 采用），但证据行 `:317`/`:557` 的时序句按 E-1 失实（事实勘误，见 B-审1）；A-1 的「阻断级」性质本身成立（用错案配置确实失效的风险叙述对**其它**前置依赖仍适用——若将来配置入口移出 preInit，preInit 注册即失配）。
- **A-2**（isShield entity 可 null）✓ 锤定：两处实调 `combat/ETIMBlocking.java:96` 传 `null`、`entity/EntityLiving.java:1130` 传 `null`（本审直读在场）；覆写解引用即 NPE。
- **A-3**（不得是 ItemTool/ETIMMetalGear）✓ 锤定：`ETIMToolDurability.java:56` 会重写 maxDamage（`:45` 注释一手）、`MixinItem.java:137/153/175` 工具专属门。
- **B-1**（附魔台只出 Unbreaking）✓ 定谳，**判词明示：这是 T-4「不补白名单」的直接后果，不是缺陷**，下游不得当 bug 返工。
- **B-2**（无 5 tick 门槛）✓ 锤定（与 R196 一致；vanilla 门槛被同一 mixin 断掉）。
- **B-3**（跨两份配置）✓ 登记成立（`etimextra.cfg` 耐久 + `etim.cfg` `shieldWearRate`）。
- **B-4 / C-1**（blocking 属性休眠 / setMaxDamage 自动加 damaged/damage 属性）✓ 锤定——**判词分写**：`Item.java:268-272` 的 `damaged`/`damage` 与 `addPropertyOverride("blocking")` 均属**属性注册成功但模型侧无消费者（休眠）**；这与「模型缺资源」（JSON/纹理缺失导致 missing model）是两件事——休眠不报错、F3+T 不缺资源，D-1 已裁案①（只注册属性、不写 overrides），二者混写会把「预期休眠」误判成「资源缺陷」。
- **C-2**（stable_39 名 / `setTranslationKey`）✓（N-3 复验：`setUnlocalizedName` 全树 **0** 命中）；**C-3**（addShaped private）✓；**C-4**（[BlockLog] action/start 不覆盖盾）✓（MixinItem 三门工具专属）；**C-5**（getItemStackLimit 两版）✓（`:227`/`:1104-1107`）；**C-6**（创造不磨损两道）✓（`item/ItemStack.java` damageItem 首判 + `ETIMBlocking.java:150`——ItemStack 侧本审经 report-check 锚点在场核过）。
- **D-1/D-2/D-3**（条 12 已裁）✓ 全部照裁定维持：D-1① 属性注册休眠 / D-2① 只覆写无参版（`:1156-1159` 委派锤定）/ D-3① preInit（同主 mod 同形）。

**终审自添两条（不推翻报告任何判值）**：

| 编号 | 级 | 事项 | 依据 |
|---|---|---|---|
| **B-审1** | B | 报告 `:317`/`:557` 时序句（「早于」）与 `:42` 结论句（「唯一能拿到配置值的点」）随 E-1 失实：实序 = preInit(:629) 先于 RegistryEvent(:630)，RegistryEvent 路径同样可读配置。**D-3 裁定（条 12 案① preInit）不改判**，裁定结论不受影响；preInit 依旧采用。 | Loader.java:618-636 + LoaderState.java:44 + GameData.java:834-850（本审一手） |
| **C-审1** | C | L-1⑤⑥⑦ 行号引用为区间式且比方法声明行早 1 行（ItemShovel 报告 `:25-28` 实 `:26-28`；ItemCudgel `:31-34` 实 `:32-34`；ItemHatchet `:29-32` 实 `:30-32`）；区间含真锚、`return 1;` 内容可检索，零后效。裁定回执条 11 自用的 `ItemShovel:26`/`ItemCudgel:32` 为精确行，二者不矛盾。 | R196 树本审直读 |

---

## 三、伪代码建议

与报告 §3.2 无偏差，不改：报告 §3.2 / §4 / §5 / §7 伪代码与一手锚逐行相符（含 `BLOCKING_GETTER` 形照 `ItemShield.java:28-35`、`isShield` 不解引用 entity、`getMaxItemUseDuration` 返回 72000、`GameRegistry.addShapedRecipe(id, null, …)` 无 stick 参数表）。

---

## 四、待裁

无新待裁位。D-1…D-3（条 12）照裁执行；B-审1 为**知悉项**（不改判），交 ETIM-Extra 主会话——若将来重裁 D-3，须知「RegistryEvent 也可读到配置」这一修正事实；照旧执行 preInit 无需任何动作。

---

## 五、验收

- **report-check**（审件，终审跑法说明）：

```
file      : D:\OpenCodeWorkspace\ETIM-Extra\playground\audit\extra-shield-对照报告.md
bytes     : 57157
lines     : 650
firstByte : 0x23
utf8/bom  : ok / none
cr/fffd   : 0 / 0
tick/cross: 21 / 3
anchors   : 118 (missing 0)
tables    : 30 (bad rows 0)
faces     : 0 {}          ← L 组号（非 M\d-\d），计 0 属报告 §0 声明预期
grades    : A0 B0 C0 D0   ← 分级在 §11 表内（非 A\d/B\d 面号形），计 0 属预期
OK
```

- **跑法注记（重要，防复检误报）**：本审件锚跨**五**棵树（R196 裸文件名 / 1.12 包内路径 / forge 包内路径 / 主 mod 子目录前缀 / ETIM-Extra 现状），脚本默认根只含前三棵——**默认根首跑曾报 9 missing（全是 `ETIMExtra*.java`）**，系脚本根不含 `ETIM-Extra\src` 所致，**非报告锚点失实**；以 `--roots=<R196树>;<1.12树>;<forge树>;<主mod树>;<ETIM-Extra树>` 五根跑通 anchors 118 missing 0。报告 §26 对 faces/grades 计 0 的自辩与实测一致。
- **终审计数**：判决类 8 项 = ✓8 / ✗0；报告 11 面全维持（✓10 / ✗0 / ?0）；新 A 级 = 0；终审自添 = B 级 1（B-审1）+ C 级 1（C-审1）；E-1 = **确认**（Loader.java:625/629/630 一手）。
- **javap 卷**：续用 `extra-shield-javap/` 卷（javap_ItemTool / javap_EnumEquipmentMaterial / javap_Material 三卷命中行已注于 §1.1）；未新增卷。
- **零改动自陈**：本审未改任何源码/报告/资源/账本（含 `audit-extra-裁定回执.md` 未动一字），未起服、未构建、未跑 gradle、未动 git。本审新增未跟踪文件：`playground/audit/extra-shield-终审回执.md`（本件）+ `playground/audit/extra-shield-reportcheck.txt`（report-check 输出存档）+ `playground/audit/extra-shield-rcheck-usage.txt`（脚本 usage 存档）。
- **收尾查证**：纯静态轮，无 Minecraft 游戏窗口在运行。
