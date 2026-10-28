package io.github.etim.etimextra.shield;

import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.item.crafting.CraftingManager;
import net.minecraft.item.crafting.IRecipe;
import net.minecraft.item.crafting.Ingredient;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.fml.common.registry.ForgeRegistries;
import net.minecraftforge.fml.common.registry.GameRegistry;

import io.github.etim.etim.metal.ETIMMetals;
import io.github.etim.etim.metal.ETIMItems;
import io.github.etim.etimextra.ETIMExtra;
import io.github.etim.etimextra.ETIMExtraConfig;
import io.github.etim.etimextra.ETIMExtraLog;

/**
 * The shield batch content face: one item per ETIM metal that has an ingot,
 * their fail-fast registration assertion, their shaped recipes and the
 * {@code [ExtraLog]} judgement rows (W-1 / W-2).
 *
 * <p>Order is the ruling D-3 ① contract: {@code ETIMExtraConfig.init} →
 * {@code ETIMExtraLog.preInit} → this {@link #register()} — all inside
 * {@code preInit}, the same shape the main mod uses ({@code ETIM.java:74-77}).
 * The constructors read the config, so nothing here may run earlier.</p>
 *
 * <p>Five shields, the five ingot-bearing metals of the R196 material table
 * ({@code ETIMMetals}): copper / silver / ancient metal / mithril /
 * adamantium. Rusted iron has no ingot ({@code ETIMItems:29-33}) and therefore
 * no shield — the same crop the main mod applies to its gear.</p>
 *
 * <p>盾面内容面：每个在 R196 材料表里「有锭」的金属一件盾（铜／银／远古金属／
 * 秘银／艾德曼），共五件 + 注册 fail-fast 断言 + 形状配方 + {@code [ExtraLog]}
 * 判行（W-1／W-2）。锈铁无锭（{@code ETIMItems:29-33}），故无盾。顺序照裁
 * D-3 ①：配置 → 载入行 → 本类，全部在 preInit 内。</p>
 */
public final class ETIMExtraContent {

    /** 铜盾 / the copper shield. */
    public static Item copperShield;
    /** 银盾 / the silver shield. */
    public static Item silverShield;
    /** 远古金属盾 / the ancient metal shield. */
    public static Item ancientMetalShield;
    /** 秘银盾 / the mithril shield. */
    public static Item mithrilShield;
    /** 艾德曼盾 / the adamantium shield. */
    public static Item adamantiumShield;

    /** Registration order; also the client model/tint walk order. 注册序，也是客户端
     *  模型遍历序。 */
    private static Item[] shields = new Item[0];

    /** Recipe ids; the same names ride the W-2 judgement rows. */
    private static final String RECIPE_COPPER = "shield_copper";
    private static final String RECIPE_SILVER = "shield_silver";
    private static final String RECIPE_ANCIENT_METAL = "shield_ancient_metal";
    private static final String RECIPE_MITHRIL = "shield_mithril";
    private static final String RECIPE_ADAMANTIUM = "shield_adamantium";

    /** T-3 ②: the shield shape carries exactly six {@code X} slots. This is the
     *  count the runtime recipe check enforces, so a mistyped pattern aborts the
     *  load instead of silently costing 5 or 7 ingots.
     *  T-3 ②：盾形状恰有 6 个 X 格；运行时按此数校验，形状打错即中止加载。 */
    private static final int INGOTS_PER_SHIELD = 6;

    private ETIMExtraContent() {
    }

    /** Registers all five shields, asserts them, then registers their recipes.
     *  注册五件盾、断言注册成功，再注册对应配方。 */
    public static void register() {
        copperShield = register("copper_shield", ETIMMetals.COPPER,
                ETIMExtraConfig.shieldCopperDurability);
        silverShield = register("silver_shield", ETIMMetals.SILVER,
                ETIMExtraConfig.shieldSilverDurability);
        ancientMetalShield = register("ancient_metal_shield", ETIMMetals.ANCIENT_METAL,
                ETIMExtraConfig.shieldAncientMetalDurability);
        mithrilShield = register("mithril_shield", ETIMMetals.MITHRIL,
                ETIMExtraConfig.shieldMithrilDurability);
        adamantiumShield = register("adamantium_shield", ETIMMetals.ADAMANTIUM,
                ETIMExtraConfig.shieldAdamantiumDurability);
        shields = new Item[] {copperShield, silverShield, ancientMetalShield, mithrilShield, adamantiumShield};
        assertRegistered();
        registerRecipes();
    }

    /** The registered shields in registration order. 按注册序返回五件盾。 */
    public static Item[] shields() {
        return shields.clone();
    }

    private static Item register(String name, ETIMMetals metal, int durability) {
        Item item = new ETIMExtraItemShield(metal, durability);
        item.setRegistryName(new ResourceLocation(ETIMExtra.MOD_ID, name));
        item.setTranslationKey(ETIMExtra.MOD_ID + "." + name);
        ForgeRegistries.ITEMS.register(item);
        // W-1: the only row that proves the constructor actually read the config
        // (maxDamage) and the R196 material row (enchantability).
        ItemStack probe = new ItemStack(item);
        ETIMExtraLog.shield(name, metal.name, item.getMaxDamage(probe), item.getItemEnchantability(),
                probe.getMaxStackSize());
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
        for (Item item : shields) {
            ResourceLocation name = item.getRegistryName();
            if (name == null || ForgeRegistries.ITEMS.getValue(name) != item) {
                throw new IllegalStateException("[ETIM-Extra] shield registration drifted: " + name);
            }
        }
    }

    /**
     * T-3 ①: the R196 material-column shape — {@code "X X" / "XXX" / " X "} with
     * {@code X} = the metal ingot, six ingots per shield (2 + 3 + 1). The main
     * mod's {@code addShaped} is private ({@code ETIMGear:307-328}), so the same
     * {@code GameRegistry} call is inlined here; the shield shape carries no
     * {@code '/'} (stick) key.
     *
     * <p>Every row is read back off the <em>registered</em> recipe (ingredient
     * item + non-empty slot count + output) rather than restated from the
     * source arguments, so W-2 fails if the pattern and the row ever drift
     * apart.</p>
     *
     * <p>形状即「材料列 × 形状」：6 个 X = 6 锭，不含木棍键。每条配方行都从
     * <em>已注册</em>的配方反读（材料物品 + 非空格数 + 产物），而不是照抄入参，
     * 因此形状与判行一旦脱节 W-2 即失败。</p>
     */
    private static void registerRecipes() {
        addShieldRecipe(RECIPE_COPPER, copperShield, ETIMItems.ingotCopper);
        addShieldRecipe(RECIPE_SILVER, silverShield, ETIMItems.ingotSilver);
        addShieldRecipe(RECIPE_ANCIENT_METAL, ancientMetalShield, ETIMItems.ingotAncientMetal);
        addShieldRecipe(RECIPE_MITHRIL, mithrilShield, ETIMItems.ingotMithril);
        addShieldRecipe(RECIPE_ADAMANTIUM, adamantiumShield, ETIMItems.ingotAdamantium);
        ETIMExtraLog.shieldRecipeCount(countShieldRecipes());
    }

    private static void addShieldRecipe(String name, Item shield, Item ingot) {
        ResourceLocation id = new ResourceLocation(ETIMExtra.MOD_ID, name);
        GameRegistry.addShapedRecipe(id, null, new ItemStack(shield), "X X", "XXX", " X ", 'X', ingot);
        IRecipe recipe = CraftingManager.REGISTRY.getObject(id);
        if (recipe == null) {
            throw new IllegalStateException("[ETIM-Extra] shield recipe missing from the registry: " + id);
        }
        int slots = 0;
        String ingredientName = "-";
        for (Ingredient ingredient : recipe.getIngredients()) {
            ItemStack[] matching = ingredient.getMatchingStacks();
            if (matching.length == 0) {
                continue;
            }
            slots++;
            if ("-".equals(ingredientName)) {
                ResourceLocation key = matching[0].getItem().getRegistryName();
                ingredientName = key == null ? "-" : key.toString();
            }
        }
        if (slots != INGOTS_PER_SHIELD) {
            throw new IllegalStateException("[ETIM-Extra] shield recipe " + id + " has " + slots
                    + " ingredient slots, expected " + INGOTS_PER_SHIELD);
        }
        Item output = recipe.getRecipeOutput().getItem();
        ResourceLocation outputName = output.getRegistryName();
        ETIMExtraLog.shieldRecipe(name, ingredientName, slots,
                outputName == null ? "-" : outputName.toString());
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
