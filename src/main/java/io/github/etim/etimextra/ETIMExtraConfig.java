package io.github.etim.etimextra;

import net.minecraftforge.common.config.Configuration;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;

/**
 * ETIM-Extra configuration (config/etimextra.cfg, standard Forge Configuration).
 *
 * <p>Only player-perceivable values and gameplay toggles live here; internal
 * knobs stay out (project constraint 2). Values load once in preInit — no
 * runtime reload, a changed file needs a restart, the same contract as the
 * main mod's {@code ETIMConfig}; invalid values abort the mod load, never fall
 * back to a default.</p>
 *
 * <p>ETIM-Extra 配置（config/etimextra.cfg，标准 Forge Configuration）。此处只放
 * 玩家可感知的数值与玩法开关，内部实现参数不进（项目约束 2）。数值只在 preInit
 * 载入一次——未接运行时重载，改动需重启，与主 mod 的 ETIMConfig 同契约；非法值
 * 直接中止模组加载，不回落默认值。</p>
 *
 * <p>Option comments are written in the game's language (Chinese on {@code zh*}
 * clients, English otherwise), the same rule the main mod follows.</p>
 *
 * <p>档位注释按游戏语言写出（{@code zh*} 客户端中文，其余英文），规则同主 mod。</p>
 */
public final class ETIMExtraConfig {

    // debug ------------------------------------------------------
    /** Dev judgement channel switch for the [ExtraLog] shield rows (audit-extra
     *  条 1); off = those rows return on their first line, zero effect on
     *  values. [ExtraLog] 盾面判行的开发开关（audit-extra 条 1）；关闭时判行首行
     *  即返回，对数值零影响。 */
    public static boolean extraDebugLog = false;

    // shield ------------------------------------------------------
    /**
     * 铜盾耐久（<b>终裁平衡值</b>，provenance (b) 自创）：本批以铜 1,600 为基，
     * 远古 ×2、秘银 ×4、艾德曼 ×8 ⇒ 3,200 / 6,400 / 12,800。与 R196 工具公式
     * （{@code 4.0F × 1 × d × 100}）无关——旧派生式已废（A-1）；R196 无盾（立项
     * 摸底 A-1），故无一手可对位值。玩家可感知，故可配。
     *
     * <p>Copper shield max damage — the batch's final balance value
     * (provenance (b)): the 1,600 base of the ×2/×4/×8 ladder.</p>
     */
    public static int shieldCopperDurability = 1600;

    /**
     * 银盾耐久（<b>终裁平衡值</b>，provenance (b)）：与铜盾同档 1,600（银的
     * 差异只在减伤与磨率两面，不在耐久）。性质同铜盾。
     *
     * <p>Silver shield max damage — final balance value, same 1,600 tier as copper.</p>
     */
    public static int shieldSilverDurability = 1600;

    /**
     * 远古金属盾耐久（<b>终裁平衡值</b>，provenance (b)）：铜 1,600 ×2 = 3,200。
     * 性质同铜盾。
     *
     * <p>Ancient metal shield max damage — final balance value, 1,600 ×2 = 3,200.</p>
     */
    public static int shieldAncientMetalDurability = 3200;

    /**
     * 秘银盾耐久（<b>终裁平衡值</b>，provenance (b)）：铜 1,600 ×4 = 6,400。
     * 性质同铜盾。
     *
     * <p>Mithril shield max damage — final balance value, 1,600 ×4 = 6,400.</p>
     */
    public static int shieldMithrilDurability = 6400;

    /**
     * 艾德曼盾耐久（<b>终裁平衡值</b>，provenance (b)）：铜 1,600 ×8 = 12,800。
     * 性质同铜盾。
     *
     * <p>Adamantium shield max damage — final balance value, 1,600 ×8 = 12,800.</p>
     */
    public static int shieldAdamantiumDurability = 12800;

    // shield reduction curve + silver ghost face + wear multipliers ------
    // 条 38 八键终案。三段键写成 `shield` 类别下的点号属性名：Forge 会把类别名
    // 转小写（Configuration:1146-1149），嵌套类别会把 `ancientMetal` 打成
    // `ancientmetal`；属性名不做该转换，键面才与裁定逐字一致。
    /**
     * 铜盾减伤百分比（<b>provenance (b) 自创</b>：R196 无盾，全套曲线无一手可
     * 对位值，用户已拍板）。整数百分比，{@code ETIMExtraContent} 读出后
     * {@code / 100.0F} 并 clamp 0~1 再进构造器（条 29.4）。
     *
     * <p>Copper shield blocked percentage — provenance (b), no R196 counterpart.</p>
     */
    public static int shieldCopperReduction = 55;

    /** 银盾物理面减伤百分比（provenance (b)；幽魂面见下一键，绝对值不随本键漂移
     *  ——D-7）。Silver physical-face blocked percentage (provenance (b)). */
    public static int shieldSilverReduction = 40;

    /** 远古金属盾减伤百分比（provenance (b)）。Ancient metal shield blocked
     *  percentage (provenance (b)). */
    public static int shieldAncientMetalReduction = 65;

    /** 秘银盾减伤百分比（provenance (b)）。Mithril shield blocked percentage
     *  (provenance (b)). */
    public static int shieldMithrilReduction = 75;

    /** 艾德曼盾减伤百分比（provenance (b)）。Adamantium shield blocked
     *  percentage (provenance (b)). */
    public static int shieldAdamantiumReduction = 80;

    /**
     * 银盾幽魂面减伤百分比（<b>绝对值</b>；D-7：0.65 不是「物理值 + 0.25」，
     * 改 {@code shield.silver.reduction} 不会带着本键漂移）。provenance (b)：
     * R196 只有「攻击者持银」的语义相反位（C-2），被攻侧差分是自创。
     *
     * <p>Silver ghost-face blocked percentage — ABSOLUTE (D-7), provenance (b).</p>
     */
    public static int shieldSilverSpectralReduction = 65;

    /** 银盾物理面磨损乘子（相对主 mod 全局基准 {@code shieldWearRateBase} = 2.5；
     *  provenance (b)）。Silver physical-face wear multiplier (provenance (b)). */
    public static float shieldSilverWear = 1.4F;

    /** 银盾幽魂面磨损乘子（同上；provenance (b)）。Silver ghost-face wear
     *  multiplier. 非银四盾不设 wear 键——乘子恒 1.0 字面常数，不做死键（D31-2）。 */
    public static float shieldSilverSpectralWear = 0.5F;

    private ETIMExtraConfig() {
    }

    /** Reads config/etimextra.cfg once, before any content registers (preInit).
     *  只读一次配置，先于任何内容注册（preInit）。 */
    public static void init(FMLPreInitializationEvent event) {
        Configuration config = new Configuration(event.getSuggestedConfigurationFile());
        config.load();
        extraDebugLog = config.getBoolean("extraDebugLog", "debug", extraDebugLog,
                "Dev judgement channel [ExtraLog] for the shield rows (off = rows return"
                        + " immediately, zero effect on values)");
        shieldCopperDurability = config.getInt("copperDurability", "shield", shieldCopperDurability, 1, 1 << 20,
                "Copper shield max damage; final balance value (ShieldNerf batch, provenance (b)) -"
                        + " the 1600 base of the x2/x4/x8 ladder; NOT the retired R196 tool formula");
        shieldSilverDurability = config.getInt("silverDurability", "shield", shieldSilverDurability, 1, 1 << 20,
                "Silver shield max damage; final balance value (provenance (b)), same 1600 tier as copper");
        shieldAncientMetalDurability = config.getInt("ancientMetalDurability", "shield",
                shieldAncientMetalDurability, 1, 1 << 20,
                "Ancient metal shield max damage; final balance value (provenance (b)) = copper 1600 x2 = 3200;"
                        + " NOT the retired R196 tool formula");
        shieldMithrilDurability = config.getInt("mithrilDurability", "shield", shieldMithrilDurability, 1, 1 << 20,
                "Mithril shield max damage; final balance value (provenance (b)) = copper 1600 x4 = 6400;"
                        + " NOT the retired R196 tool formula");
        shieldAdamantiumDurability = config.getInt("adamantiumDurability", "shield", shieldAdamantiumDurability,
                1, 1 << 20,
                "Adamantium shield max damage; final balance value (provenance (b)) = copper 1600 x8 = 12800;"
                        + " NOT the retired R196 tool formula");
        shieldCopperReduction = config.getInt("copper.reduction", "shield", shieldCopperReduction, 0, 100,
                "Copper shield blocked percent (applied before armor); provenance (b) - R196 has no shields");
        shieldSilverReduction = config.getInt("silver.reduction", "shield", shieldSilverReduction, 0, 100,
                "Silver shield blocked percent on the physical face; provenance (b)");
        shieldSilverSpectralReduction = config.getInt("silver.spectralReduction", "shield",
                shieldSilverSpectralReduction, 0, 100,
                "Silver shield blocked percent on the ghost face - ABSOLUTE (D-7), it does NOT follow"
                        + " silver.reduction; provenance (b)");
        shieldAncientMetalReduction = config.getInt("ancientMetal.reduction", "shield",
                shieldAncientMetalReduction, 0, 100,
                "Ancient metal shield blocked percent; provenance (b)");
        shieldMithrilReduction = config.getInt("mithril.reduction", "shield", shieldMithrilReduction, 0, 100,
                "Mithril shield blocked percent; provenance (b)");
        shieldAdamantiumReduction = config.getInt("adamantium.reduction", "shield", shieldAdamantiumReduction,
                0, 100, "Adamantium shield blocked percent; provenance (b)");
        shieldSilverWear = config.getFloat("silver.wear", "shield", shieldSilverWear, 0.0F, 100.0F,
                "Silver shield wear multiplier on the physical face, against the main mod's"
                        + " shieldWearRateBase 2.5; provenance (b)");
        shieldSilverSpectralWear = config.getFloat("silver.spectralWear", "shield",
                shieldSilverSpectralWear, 0.0F, 100.0F,
                "Silver shield wear multiplier on the ghost face; provenance (b). The other four shields"
                        + " have no wear key - their multiplier is the literal 1.0");
        if (config.hasChanged()) {
            config.save();
        }
    }
}
