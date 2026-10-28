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
import net.minecraft.util.ResourceLocation;
import net.minecraft.world.World;

import io.github.etim.etim.metal.ETIMMetals;

/**
 * The shield <em>item</em> face of the metal shield batch (copper / silver /
 * ancient metal / mithril / adamantium). The class states exactly two facts —
 * "I am a shield" ({@link #isShield}) and "I can enter the BLOCK use state"
 * ({@link #getItemUseAction} / {@link #getMaxItemUseDuration} /
 * {@link #onItemRightClick}) — and nothing else: the halving, the 1.0 floor and
 * the {@code (int)(blocked × rate)} wear all belong to the main mod (AD-10+SH,
 * {@code combat/ETIMBlocking}).
 *
 * <p>Deliberately <b>not</b> an {@code ItemTool} and <b>not</b>
 * {@code ItemShield} (对照报告 L-3, 六条负担): {@code ItemShield} pins 336
 * durability, a banner display name, a planks repair item and a dispenser
 * armour behaviour in its no-arg constructor, while its 3D model still needs
 * an identity check on {@code Items.SHIELD} that a subclass never passes. This
 * class is also not an {@code ItemTool} on purpose — otherwise the main mod's
 * {@code ETIMToolDurability} would rewrite the derived max damage from the
 * vanilla material table and {@code MixinItem} would take over the action /
 * duration / start faces (对照报告 L-9 前置 6/7).
 *
 * <p>数值出处：耐久是<b>派生值</b>（{@code 4.0F × 1 × d × 100}，R196
 * {@code ItemTool.java:36-42} + {@code EnumEquipmentMaterial.java:14-15}，
 * {@code components=1} 由裁定 T-1 定），R196 无盾（立项摸底 A-1），故它不是一手
 * 盾值；附魔度直接读主 mod 的 R196 材料行（{@code ETIMMetals.enchantability}）。</p>
 *
 * <p>The durability passed in is a <b>derived</b> value, not an R196 shield
 * value (R196 has no shield — 摸底 A-1); the enchantability is read straight
 * off the main mod's R196 material row.</p>
 */
public final class ETIMExtraItemShield extends Item {

    /** Vanilla's shield use duration ({@code ItemShield:67-70}); must be > 0 or
     *  {@code EntityLivingBase:2978-2979} returns before the use state starts.
     *  与 vanilla 同值；必须 > 0，否则起手在 {@code EntityLivingBase:2978-2979}
     *  就返回，{@code isHandActive()} 永假。 */
    private static final int USE_DURATION = 72000;

    /** The R196 metal row this shield is made of (enchantability rides it). */
    private final ETIMMetals metal;

    /**
     * @param metal      the R196 material row (enchantability source)
     * @param durability the derived max damage (T-1: {@code 4.0F × 1 × d × 100}),
     *                   already resolved from {@code ETIMExtraConfig}
     *
     * <p>注册序：本构造器读配置 ⇒ 必须在 {@code ETIMExtraConfig.init} 之后调用
     * （裁 D-3 ①：全程 preInit，顺序 config → log → content）。</p>
     */
    public ETIMExtraItemShield(ETIMMetals metal, int durability) {
        this.metal = metal;
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
