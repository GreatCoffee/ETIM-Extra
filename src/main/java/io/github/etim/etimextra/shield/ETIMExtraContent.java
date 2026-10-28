package io.github.etim.etimextra.shield;

import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.item.crafting.CraftingManager;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.fml.common.registry.ForgeRegistries;
import net.minecraftforge.fml.common.registry.GameRegistry;

import io.github.etim.etim.metal.ETIMMetals;
import io.github.etim.etim.metal.ETIMItems;
import io.github.etim.etimextra.ETIMExtra;
import io.github.etim.etimextra.ETIMExtraConfig;
import io.github.etim.etimextra.ETIMExtraLog;

/**
 * The shield batch content face: two items, their fail-fast registration
 * assertion, their shaped recipes and the {@code [ExtraLog]} judgement rows
 * (W-1 / W-2).
 *
 * <p>Order is the ruling D-3 ① contract: {@code ETIMExtraConfig.init} →
 * {@code ETIMExtraLog.preInit} → this {@link #register()} — all inside
 * {@code preInit}, the same shape the main mod uses ({@code ETIM.java:74-77}).
 * The constructors read the config, so nothing here may run earlier.</p>
 *
 * <p>盾面内容面：两件物品 + 注册 fail-fast 断言 + 形状配方 + {@code [ExtraLog]}
 * 判行（W-1／W-2）。顺序照裁 D-3 ①：配置 → 载入行 → 本类，全部在 preInit 内。</p>
 */
public final class ETIMExtraContent {

    /** 秘银盾 / the mithril shield. */
    public static Item mithrilShield;
    /** 艾德曼盾 / the adamantium shield. */
    public static Item adamantiumShield;

    /** Recipe ids; the same names ride the W-2 judgement rows. */
    private static final String RECIPE_MITHRIL = "shield_mithril";
    private static final String RECIPE_ADAMANTIUM = "shield_adamantium";

    private ETIMExtraContent() {
    }

    /** Registers both shields, asserts them, then registers the two recipes.
     *  注册两件盾、断言注册成功，再注册两条配方。 */
    public static void register() {
        mithrilShield = register("mithril_shield", ETIMMetals.MITHRIL,
                ETIMExtraConfig.shieldMithrilDurability);
        adamantiumShield = register("adamantium_shield", ETIMMetals.ADAMANTIUM,
                ETIMExtraConfig.shieldAdamantiumDurability);
        assertRegistered();
        registerRecipes();
    }

    private static Item register(String name, ETIMMetals metal, int durability) {
        Item item = new ETIMExtraItemShield(metal, durability);
        item.setRegistryName(new ResourceLocation(ETIMExtra.MOD_ID, name));
        item.setTranslationKey(ETIMExtra.MOD_ID + "." + name);
        ForgeRegistries.ITEMS.register(item);
        // W-1: the only row that proves the constructor actually read the config
        // (maxDamage) and the R196 material row (enchantability).
        ETIMExtraLog.shield(name, metal.name, item.getMaxDamage(), item.getItemEnchantability(),
                new ItemStack(item).getMaxStackSize());
        return item;
    }

    /**
     * A-1 fail-fast, the main mod's shape ({@code ETIMGear:175-184}): a shield
     * missing from the registry is a silent blank item downstream, so it must
     * abort the load instead.
     *
     * <p>注册失败必须中止加载：注册表里缺一件的后果是下游静默变成白板物品。</p>
     */
    private static void assertRegistered() {
        Item mithril = ForgeRegistries.ITEMS.getValue(new ResourceLocation(ETIMExtra.MOD_ID, "mithril_shield"));
        Item adamantium = ForgeRegistries.ITEMS.getValue(new ResourceLocation(ETIMExtra.MOD_ID, "adamantium_shield"));
        if (mithril != mithrilShield || adamantium != adamantiumShield) {
            throw new IllegalStateException("[ETIM-Extra] shield registration drifted: mithril=" + mithril
                    + " adamantium=" + adamantium);
        }
    }

    /**
     * T-3 ①: the R196 material-column shape — {@code "X X" / "XXX" / " X "} with
     * {@code X} = the metal ingot, six ingots per shield (2 + 3 + 1). The main
     * mod's {@code addShaped} is private ({@code ETIMGear:307-328}), so the same
     * {@code GameRegistry} call is inlined here; the shield shape carries no
     * {@code '/'} (stick) key.
     *
     * <p>形状即「材料列 × 形状」：6 个 X = 6 锭，不含木棍键。</p>
     */
    private static void registerRecipes() {
        addShieldRecipe(RECIPE_MITHRIL, mithrilShield, ETIMItems.ingotMithril);
        addShieldRecipe(RECIPE_ADAMANTIUM, adamantiumShield, ETIMItems.ingotAdamantium);
        ETIMExtraLog.shieldRecipeCount(countShieldRecipes());
    }

    private static void addShieldRecipe(String name, Item shield, Item ingot) {
        GameRegistry.addShapedRecipe(new ResourceLocation(ETIMExtra.MOD_ID, name), null,
                new ItemStack(shield), "X X", "XXX", " X ", 'X', ingot);
        ETIMExtraLog.shieldRecipe(name, ingot.getRegistryName() == null ? "-" : ingot.getRegistryName().toString(), 6);
    }

    /** W-2 companion: the etim-extra recipe count actually present in the registry.
     *  W-2 伴生判行：注册表里真实存在的本 mod 配方数。 */
    private static int countShieldRecipes() {
        int count = 0;
        for (ResourceLocation key : CraftingManager.REGISTRY.getKeys()) {
            if (ETIMExtra.MOD_ID.equals(key.getNamespace())) {
                count++;
            }
        }
        return count;
    }
}
