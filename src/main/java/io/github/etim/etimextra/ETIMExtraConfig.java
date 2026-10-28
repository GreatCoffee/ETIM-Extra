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
     * 秘银盾耐久（<b>派生值</b>：{@code 4.0F × 1 × 64.0F × 100.0F} — R196
     * {@code ItemTool.java:36-42} + {@code EnumEquipmentMaterial.java:14}，
     * {@code components=1} 由裁定 T-1 定）。R196 无盾（立项摸底 A-1），故它不是
     * 一手盾值；玩家可感知，故可配。
     *
     * <p>Mithril shield max damage — DERIVED, not an R196 shield value.</p>
     */
    public static int shieldMithrilDurability = 25600;

    /**
     * 艾德曼盾耐久（<b>派生值</b>：{@code 4.0F × 1 × 256.0F × 100.0F} — 同上，
     * {@code :15}）。性质同秘银盾。
     *
     * <p>Adamantium shield max damage — DERIVED, not an R196 shield value.</p>
     */
    public static int shieldAdamantiumDurability = 102400;

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
        shieldMithrilDurability = config.getInt("mithrilDurability", "shield", shieldMithrilDurability, 1, 1 << 20,
                "Mithril shield max damage; DERIVED = 4.0 x 1 x 64.0 x 100 (R196 ItemTool.java:36-42"
                        + " + EnumEquipmentMaterial.java:14; components=1 by ruling T-1)."
                        + " NOT an R196 shield value");
        shieldAdamantiumDurability = config.getInt("adamantiumDurability", "shield", shieldAdamantiumDurability,
                1, 1 << 20,
                "Adamantium shield max damage; DERIVED = 4.0 x 1 x 256.0 x 100 (:15)."
                        + " NOT an R196 shield value");
        if (config.hasChanged()) {
            config.save();
        }
    }
}
