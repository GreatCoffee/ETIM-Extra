package io.github.etim.etimextra;

import java.util.Locale;

import net.minecraftforge.fml.relauncher.Side;

/**
 * The {@code [ExtraLog]} judgement channel (audit-extra 条 1 / 条 6): the
 * load-time rows of the add-on. Shape copied from the main mod's
 * {@code [BlockLog]} / {@code [DamageLog]} (combat/ETIMBlockLog.java): private
 * constructor, static row methods, one row per event, {@code key=value} payload.
 *
 * <p>Rows:</p>
 * <ul>
 *   <li>{@code preInit} — emitted from {@code ETIMExtra.preInit} once the
 *       configuration is live and before any content registers;</li>
 *   <li>{@code boot ok - side=<CLIENT|SERVER> etim=<version> etimextra=<version>}
 *       — W1 dependency assertion (audit-extra 条 6): names the etim build that
 *       actually rode along, which FML's {@code required-after:etim} alone
 *       cannot tell a dev round.</li>
 * </ul>
 *
 * <p>Both rows are load-time one-shots and stay ungated: a dev switch able to
 * silence the boot assertion would hide exactly the fact a smoke round judges.
 * Every row added from the first content batch on rides
 * {@code ETIMExtraConfig.extraDebugLog}.</p>
 *
 * <p>[ExtraLog] 判据通道（audit-extra 条 1 / 条 6）：本附属的载入判行。形制照抄主
 * mod 的 [BlockLog]/[DamageLog]——私有构造、静态行方法、一事件一行、key=value
 * 载荷。两行都是载入期一次性行且不设开关：能静默 boot 断言的开关会正好藏掉冒烟轮
 * 要判的事实；首批内容之后的判行一律挂 ETIMExtraConfig.extraDebugLog。</p>
 */
public final class ETIMExtraLog {

    private ETIMExtraLog() {
    }

    /** Load row: config is live, content registration about to start. 载入行：配置已就绪、内容注册即将开始。 */
    public static void preInit() {
        row("preInit");
    }

    /** W1 dependency assertion — the etim build that actually loaded. W1 依赖断言——实际载入的 etim 版本。 */
    public static void boot(Side side, String etimVersion, String version) {
        row("boot ok - side=" + side + " etim=" + etimVersion + " etimextra=" + version);
    }

    // ==================== shield batch rows (W-1 / W-2) ====================

    /**
     * W-1 registration row: the only line that proves the shield constructor
     * read the config ({@code maxDamage}) and the R196 material row
     * ({@code enchantability}) instead of falling back to 0.
     *
     * <p>W-1 注册行：唯一能证明盾构造器真的读到了配置（maxDamage）与 R196 材料行
     * （enchantability）而没有回落 0 的一行。</p>
     */
    public static void shield(String name, String metal, int maxDamage, int enchantability, int stack) {
        if (!ETIMExtraConfig.extraDebugLog) {
            return;
        }
        row("shield item=" + ETIMExtra.MOD_ID + ":" + name + " metal=" + metal
                + " maxDamage=" + maxDamage + " enchantability=" + enchantability + " stack=" + stack);
    }

    /** W-2 recipe row: one line per shaped recipe, with the six-ingot count. W-2 配方行：一条配方一行，带 6 锭计数。 */
    public static void shieldRecipe(String name, String ingot, int count) {
        if (!ETIMExtraConfig.extraDebugLog) {
            return;
        }
        row("shield recipe=" + ETIMExtra.MOD_ID + ":" + name + " ingot=" + ingot + " count=" + count);
    }

    /** W-2 companion: the recipe count actually present in the vanilla registry.
     *  W-2 伴生行：注册表里真实存在的本 mod 配方数。 */
    public static void shieldRecipeCount(int count) {
        if (!ETIMExtraConfig.extraDebugLog) {
            return;
        }
        row("shield recipes total=" + count);
    }

    // ==================== channel launcher (ETIMBlockLog:169-173 shape) ====================

    private static void row(String line) {
        ETIMExtra.LOGGER.info(String.format(Locale.ROOT, "[ExtraLog] %s", line));
    }
}
