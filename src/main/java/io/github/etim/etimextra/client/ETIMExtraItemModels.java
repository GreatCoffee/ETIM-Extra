package io.github.etim.etimextra.client;

import net.minecraft.client.renderer.block.model.ModelResourceLocation;
import net.minecraft.item.Item;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.client.event.ModelRegistryEvent;
import net.minecraftforge.client.model.ModelLoader;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.eventhandler.SubscribeEvent;
import net.minecraftforge.fml.relauncher.Side;

import io.github.etim.etimextra.ETIMExtra;
import io.github.etim.etimextra.shield.ETIMExtraContent;

/**
 * Client model face for the two shields: one {@code inventory} variant per item,
 * meta 0 (neither shield carries subtypes). Without this row the item is a
 * purple-black missing model — Forge 1.12's {@code ModelLoader} only meshes the
 * {@code customModels} table, and nothing else names these items
 * (the main mod hit the same wall, {@code client/ETIMItemModels}).
 *
 * <p>Dual write, the main mod's proven shape: the mesh-definition function plus
 * the static {@code (item, meta)} table.</p>
 *
 * <p>盾的物品模型面：每件一个 {@code inventory} 变体、meta 0。不写这一面，物品就是
 * 紫黑缺失模型——Forge 1.12 的 {@code ModelLoader} 只认 {@code customModels} 表。
 * 双写（mesh 函数 + 静态表）照主 mod 的已验证形制。</p>
 */
@Mod.EventBusSubscriber(value = Side.CLIENT, modid = ETIMExtra.MOD_ID)
public final class ETIMExtraItemModels {

    @SubscribeEvent
    public static void onModelRegistry(ModelRegistryEvent event) {
        register(ETIMExtraContent.mithrilShield);
        register(ETIMExtraContent.adamantiumShield);
    }

    private static void register(Item item) {
        if (item == null) {
            return;
        }
        ResourceLocation name = item.getRegistryName();
        if (name == null) {
            throw new IllegalStateException("[ETIM-Extra] shield item without a registry name");
        }
        ModelLoader.setCustomMeshDefinition(item, stack -> new ModelResourceLocation(name, "inventory"));
        ModelLoader.setCustomModelResourceLocation(item, 0, new ModelResourceLocation(name, "inventory"));
    }

    private ETIMExtraItemModels() {
    }
}
