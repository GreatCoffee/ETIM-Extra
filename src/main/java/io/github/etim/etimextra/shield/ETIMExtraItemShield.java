package io.github.etim.etimextra.shield;

import javax.annotation.Nullable;

import net.minecraft.creativetab.CreativeTabs;
import net.minecraft.entity.EntityLivingBase;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.item.EnumAction;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.util.ActionResult;
import net.minecraft.util.EnumActionResult;
import net.minecraft.util.EnumHand;
import net.minecraft.util.DamageSource;
import net.minecraft.util.ResourceLocation;
import net.minecraft.world.World;

import io.github.etim.etim.combat.ETIMGhost;
import io.github.etim.etim.combat.ETIMShield;
import io.github.etim.etim.metal.ETIMMetals;

/**
 * The shield <em>item</em> face of the metal shield batch (copper / silver /
 * ancient metal / mithril / adamantium). The class states three facts — "I am
 * a shield" ({@link #isShield}), "I can enter the BLOCK use state"
 * ({@link #getItemUseAction} / {@link #getMaxItemUseDuration} /
 * {@link #onItemRightClick}) and "these are my numbers"
 * ({@link ETIMShield#getBlockReduction} /
 * {@link ETIMShield#getWearMultiplier}) — and nothing else: the 1.0 floor, the
 * armor ordering and the wear arithmetic all belong to the main mod
 * (ShieldNerf batch, {@code combat/ETIMBlocking}).
 *
 * <p>The two numeric faces take the {@link DamageSource} because the silver
 * shield's ghost face is the only row that differs: physical 40% / ×1.4 versus
 * spectral 65% (absolute, D-7 — it does not ride the physical key) / ×0.5. The
 * other four shields carry one value on both faces; the branching is a single
 * {@link ETIMGhost#isSpectral} read, not a per-metal table.</p>
 *
 * <p>Deliberately <b>not</b> an {@code ItemTool} and <b>not</b>
 * {@code ItemShield} (对照报告 L-3, 六条负担): {@code ItemShield} pins 336
 * durability, a banner display name, a planks repair item and a dispenser
 * armour behaviour in its no-arg constructor, while its 3D model still needs
 * an identity check on {@code Items.SHIELD} that a subclass never passes. This
 * class is also not an {@code ItemTool} on purpose — otherwise the main mod's
 * {@code ETIMToolDurability} would rewrite the max damage from the vanilla
 * material table and {@code MixinItem} would take over the action / duration /
 * start faces (对照报告 L-9 前置 6/7).
 *
 * <p>数值出处（削弱批）：减伤曲线、银盾幽魂差分、磨损乘子与三档耐久全部是
 * <b>provenance (b) 自创</b>——R196 无盾（立项摸底 A-1），没有一手可对位值，值由
 * 用户拍板；验证窗只判本批裁定值与判行形态，不以「R196 怎么写」为反对理由。
 * 银盾幽魂面是<b>绝对值</b>（D-7：0.65，不是物理值 +0.25），改
 * {@code shield.silver.reduction} 不会带着它漂移。</p>
 *
 * <p>Durability is the batch's final balance value (provenance (b)): copper
 * 1,600 as the base, ancient ×2 / mithril ×4 / adamantium ×8 ⇒ 3,200 / 6,400 /
 * 12,800; the old R196 tool formula is retired (A-1). The enchantability is
 * still a first-hand value read off the main mod's R196 material row.</p>
 */
public final class ETIMExtraItemShield extends Item implements ETIMShield {

    /** Vanilla's shield use duration ({@code ItemShield:67-70}); must be > 0 or
     *  {@code EntityLivingBase:2978-2979} returns before the use state starts.
     *  与 vanilla 同值；必须 > 0，否则起手在 {@code EntityLivingBase:2978-2979}
     *  就返回，{@code isHandActive()} 永假。 */
    private static final int USE_DURATION = 72000;

    /** The R196 metal row this shield is made of (enchantability rides it). */
    private final ETIMMetals metal;

    /** Blocked fraction on the physical face, 0..1 (config percent / 100).
     *  物理面减伤比例（配置百分比 ÷ 100）；provenance (b) 自创。 */
    private final float reduction;

    /** Blocked fraction on the ghost face, 0..1 — <b>absolute</b> (D-7), so it
     *  is 0.65 for silver and the physical value for the other four.
     *  幽魂面减伤比例（0..1，绝对值；银盾 0.65，其余同物理面）。 */
    private final float spectralReduction;

    /** Wear multiplier on the physical face versus the global base rate 2.5 —
     *  1.4 for silver, 1.0 literal for the other four (no dead config key).
     *  物理面磨损乘子（银盾 1.4，其余四件 1.0 字面常数）。 */
    private final float wearMultiplier;

    /** Wear multiplier on the ghost face — 0.5 for silver, 1.0 literal else.
     *  幽魂面磨损乘子（银盾 0.5，其余 1.0 字面常数）。 */
    private final float spectralWearMult;

    /**
     * @param metal            the R196 material row (enchantability source)
     * @param durability       the batch's final balance value (provenance (b):
     *                         copper 1,600 ×2/×4/×8 ⇒ 3,200/6,400/12,800),
     *                         already resolved from {@code ETIMExtraConfig}
     * @param reduction        physical-face blocked fraction 0..1
     * @param spectralReduction ghost-face blocked fraction 0..1 (absolute, D-7)
     * @param wearMultiplier   physical-face wear multiplier (1.0 / 1.4)
     * @param spectralWearMult ghost-face wear multiplier (1.0 / 0.5)
     *
     * <p>注册序：本构造器读配置 ⇒ 必须在 {@code ETIMExtraConfig.init} 之后调用
     * （裁 D-3 ①：全程 preInit，顺序 config → log → content）。</p>
     */
    public ETIMExtraItemShield(ETIMMetals metal, int durability, float reduction, float spectralReduction,
            float wearMultiplier, float spectralWearMult) {
        this.metal = metal;
        this.reduction = reduction;
        this.spectralReduction = spectralReduction;
        this.wearMultiplier = wearMultiplier;
        this.spectralWearMult = spectralWearMult;
        this.setMaxStackSize(1);                                       // L-3 #1
        this.setMaxDamage(durability);                                 // L-3 #2
        this.setCreativeTab(CreativeTabs.COMBAT);                      // L-5
        // L-3 #8 / 裁 D-1 ①: registered but dormant in this batch (the only
        // model is item/handheld and carries no overrides).
        this.addPropertyOverride(new ResourceLocation("blocking"),
                (stack, world, entity) -> entity != null && entity.isHandActive()
                        && entity.getActiveItemStack() == stack ? 1.0F : 0.0F);
    }

    /**
     * The main mod asks the <em>item</em> how much it blocks
     * ({@code ETIMBlocking:138-140}, arm ① {@code instanceof ETIMShield}
     * before vanilla {@code ItemShield}). Spectral is read off the shared side
     * table: the value is absolute (D-7), never physical + delta.
     *
     * <p>主 mod 只问物品「挡多少」（三支分发第 ① 支先于 vanilla 木盾）。幽魂面
     * 直读共享侧表，值取绝对值（D-7），不做物理值加成。</p>
     */
    @Override
    public float getBlockReduction(DamageSource source) {
        return ETIMGhost.isSpectral(source) ? this.spectralReduction : this.reduction;
    }

    /**
     * Wear multiplier relative to the main mod's global base rate 2.5
     * ({@code ETIMBlocking:173-176}). Physical 1.4 / spectral 0.5 for silver;
     * 1.0 on both faces for the other four.
     *
     * <p>相对主 mod 全局基准磨率 2.5 的乘子（银盾物理 1.4 / 幽魂 0.5，其余两面
     * 均 1.0）。</p>
     */
    @Override
    public float getWearMultiplier(DamageSource source) {
        return ETIMGhost.isSpectral(source) ? this.spectralWearMult : this.wearMultiplier;
    }

    /**
     * {@code Item.isShield} defaults to an <b>identity</b> check
     * ({@code Item.java:1298-1301}: {@code stack.getItem() == Items.SHIELD}),
     * so every custom shield must override it or the main mod's
     * {@code isShieldStack} stays false and the shield becomes a blank item.
     *
     * <p>Both live call sites pass a {@code null} entity
     * ({@code EntityLiving:1130}, {@code ETIMBlocking:96}) — never dereference
     * the parameter here (裁 A-2).</p>
     *
     * <p>{@code Item.isShield} 的默认实现是身份比较，自定义盾必须覆写；两处实调
     * 都传 null，这里不得解引用实体。</p>
     */
    @Override
    public boolean isShield(ItemStack stack, @Nullable EntityLivingBase entity) {
        return true;
    }

    /** {@code EnumAction.BLOCK} — the animation/use-state enum the main mod's
     *  {@code isHandActive()} / {@code isActiveItemStackBlocking()} read (L-3 #4).
     *  这不是工具格挡语义，只是使用态枚举。 */
    @Override
    public EnumAction getItemUseAction(ItemStack stack) {
        return EnumAction.BLOCK;
    }

    /** Must be > 0 (L-3 #5). 同 vanilla 取 72000（一个远大于任何实际举盾时长的值）；
     *  ≤0 会让起手在 {@code EntityLivingBase:2978-2979} 直接返回。 */
    @Override
    public int getMaxItemUseDuration(ItemStack stack) {
        return USE_DURATION;
    }

    /** Right-click enters the use state (L-3 #6). 右键进入使用态。 */
    @Override
    public ActionResult<ItemStack> onItemRightClick(World world, EntityPlayer player, EnumHand hand) {
        ItemStack held = player.getHeldItem(hand);
        player.setActiveHand(hand);
        return new ActionResult<>(EnumActionResult.SUCCESS, held);
    }

    /**
     * R196 material enchantability (T-4): mithril 100 / adamantium 40, read off
     * the main mod's row rather than duplicated here. Enchantability is a hard
     * gate, not just strength ({@code EnchantmentHelper:345-348} returns 0 for
     * {@code <= 0}), which is why the default of 0 would make the enchanting
     * table offer nothing at all.
     *
     * <p>附魔度是硬门不只是强度：0 会让附魔台三档全 0。取值走主 mod 的 R196
     * 材料行，不在本类复制数字。</p>
     */
    @Override
    public int getItemEnchantability() {
        return this.metal.enchantability;
    }
}
