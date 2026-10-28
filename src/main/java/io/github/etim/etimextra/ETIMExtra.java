package io.github.etim.etimextra;

import net.minecraftforge.fml.common.Loader;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.ModContainer;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.github.etim.etimextra.shield.ETIMExtraContent;

/**
 * The {@code @Mod} entry of ETIM-Extra, the add-on of
 * <a href="https://github.com/GreatCoffee/ETIM">Easy Times In Minecraft (etim)</a>
 * that ships the metal shields — copper / silver / ancient metal / mithril /
 * adamantium, one shield per ingot-bearing R196 material.
 *
 * <p>Scope of the add-on: the main mod owns the shield <em>mechanism</em>
 * (AD-10+SH: 1.12's full-free shield segment is closed and every
 * {@code Item#isShield} carrier is halved through the R196 reduction chain,
 * worn at {@code (int)(blocked × shieldWearRate)}). This mod owns the shield
 * <em>items</em>; it never re-derives the halving or the wear.</p>
 *
 * <p>Runtime order: {@code required-after:etim} — the add-on registers nothing
 * before the main mod's {@code preInit} has run.</p>
 *
 * <p>ETIM-Extra 的 {@code @Mod} 入口，主 mod
 * <a href="https://github.com/GreatCoffee/ETIM">Easy Times In Minecraft (etim)</a>
 * 的附属，承载铜盾、银盾、远古金属盾、秘银盾与艾德曼盾。</p>
 *
 * <p>分工：盾的<em>机制</em>归主 mod（AD-10+SH：1.12 盾的全免段已关闭，任何
 * {@code Item#isShield} 载体在 LivingHurtEvent 上走 R196 减算链减半，磨损为
 * {@code (int)(blocked × shieldWearRate)}）。本 mod 只持盾<em>物品</em>，不重导
 * 减半与磨损。</p>
 *
 * <p>运行期顺序：{@code required-after:etim}——主 mod 的 {@code preInit} 跑完之前
 * 本附属不注册任何东西。</p>
 */
@Mod(modid = Tags.MOD_ID, name = Tags.MOD_NAME, version = Tags.VERSION,
        dependencies = "required-after:etim")
public final class ETIMExtra {

    @Mod.Instance(Tags.MOD_ID)
    private static ETIMExtra instance;

    /** Value of the {@code mod_id} gradle property at build time. */
    public static final String MOD_ID = Tags.MOD_ID;
    /** Value of the {@code mod_name} gradle property at build time. */
    public static final String MOD_NAME = Tags.MOD_NAME;
    /** Value of the {@code mod_version} gradle property at build time. */
    public static final String VERSION = Tags.VERSION;

    public static final Logger LOGGER = LogManager.getLogger(Tags.MOD_NAME);

    /** Mod-instance accessor for the Forge registries. */
    public static ETIMExtra instance() {
        return instance;
    }

    @Mod.EventHandler
    public void preInit(FMLPreInitializationEvent event) {
        ETIMExtraConfig.init(event);
        ETIMExtraLog.preInit();
        // Ruling D-3 ①: content after the config (the constructors read it) and
        // after the load row (which means "config live, registration starting").
        ETIMExtraContent.register();
    }

    /**
     * Boot assertion for the whole dependency chain: one judgement row states
     * whether etim is actually loaded and at which version. A missing etim
     * fails FML long before this line; the row exists so the log alone tells
     * dev rounds which etim build rode along.
     *
     * <p>整条依赖链的 boot 断言：一行判据说明 etim 是否真的载入、载入的是哪个版本。
     * 缺 etim 时 FML 早在这一行之前就失败；这一行是为了让日志本身就能告诉开发轮
     * 究竟带的是哪一个 etim 构建。</p>
     */
    @Mod.EventHandler
    public void init(FMLInitializationEvent event) {
        ModContainer etim = Loader.instance().getIndexedModList().get("etim");
        ETIMExtraLog.boot(event.getSide(), etim == null ? "ABSENT" : etim.getVersion(), VERSION);
    }
}
