package io.github.etim.etimextra;

import net.minecraftforge.fml.common.Loader;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.ModContainer;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * The {@code @Mod} entry of ETIM-Extra, the add-on of
 * <a href="https://github.com/GreatCoffee/ETIM">Easy Times In Minecraft (etim)</a>
 * that ships the mithril and adamantium shields.
 *
 * <p>Scope of the add-on: the main mod owns the shield <em>mechanism</em>
 * (AD-10+SH: 1.12's full-free shield segment is closed and every
 * {@code Item#isShield} carrier is halved through the R196 reduction chain,
 * worn at {@code (int)(blocked × shieldWearRate)}). This mod owns the shield
 * <em>items</em>; it never re-derives the halving or the wear.</p>
 *
 * <p>Runtime order: {@code required-after:etim} — the add-on registers nothing
 * before the main mod's {@code preInit} has run.</p>
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
        LOGGER.info("[ExtraLog] {} {} preInit", MOD_NAME, VERSION);
    }

    /**
     * Boot assertion for the whole dependency chain: one judgement row states
     * whether etim is actually loaded and at which version. A missing etim
     * fails FML long before this line; the row exists so the log alone tells
     * dev rounds which etim build rode along.
     */
    @Mod.EventHandler
    public void init(FMLInitializationEvent event) {
        ModContainer etim = Loader.instance().getIndexedModList().get("etim");
        LOGGER.info("[ExtraLog] boot ok - side={} etim={} etimextra={}",
                event.getSide(), etim == null ? "ABSENT" : etim.getVersion(), VERSION);
    }
}
