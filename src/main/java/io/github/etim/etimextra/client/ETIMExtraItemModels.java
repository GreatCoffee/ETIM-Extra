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
 * Client face of the five shields: the {@code inventory} model variant plus the
 * per-item 3D renderer. The model JSONs are {@code builtin/entity}, so without
 * the renderer the item would draw nothing; without the model location the item
 * would be a purple-black missing model.
 *
 * <p>Dual write, the main mod's proven shape: the mesh-definition function plus
 * the static {@code (item, meta)} table. Texture name = registry path, so the
 * row below needs no table of its own.</p>
 *
 * <p>盾的客户端面：{@code inventory} 模型变体 + per-item 3D 渲染器。模型 JSON 是
 * {@code builtin/entity}，没有渲染器就什么也不画；没有模型位置就是紫黑缺失模型。
 * 纹理名 = 注册路径，故无需另立对照表。</p>
 */
@Mod.EventBusSubscriber(value = Side.CLIENT, modid = ETIMExtra.MOD_ID)
public final class ETIMExtraItemModels {

    @SubscribeEvent
    public static void onModelRegistry(ModelRegistryEvent event) {
        for (Item item : ETIMExtraContent.shields()) {
            register(item);
        }
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
        // builtin/entity ⇒ the geometry comes from this renderer, not from JSON elements.
        item.setTileEntityItemStackRenderer(new ETIMExtraShieldRenderer(
                new ResourceLocation(ETIMExtra.MOD_ID, "textures/entity/" + name.getPath() + ".png")));
    }

    private ETIMExtraItemModels() {
    }
}
