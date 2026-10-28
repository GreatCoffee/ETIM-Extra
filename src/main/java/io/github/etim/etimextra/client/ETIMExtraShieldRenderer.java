package io.github.etim.etimextra.client;

import net.minecraft.client.Minecraft;
import net.minecraft.client.model.ModelShield;
import net.minecraft.client.renderer.GlStateManager;
import net.minecraft.client.renderer.tileentity.TileEntityItemStackRenderer;
import net.minecraft.item.ItemStack;
import net.minecraft.util.ResourceLocation;

/**
 * The 3D shield face: vanilla's {@code ModelShield} geometry drawn with this
 * add-on's own entity texture (the vanilla shield atlas layout, recoloured per
 * metal). The model JSONs stay {@code builtin/entity}, so the display
 * transforms — and therefore the held / blocking poses — are vanilla's own
 * numbers, not a re-derived approximation.
 *
 * <p>Why a per-item TEISR instead of inheriting {@code ItemShield}: vanilla's
 * renderer dispatches on {@code item == Items.SHIELD} ({@code
 * TileEntityItemStackRenderer:62}), an identity test a subclass never passes.
 * A per-item renderer is the supported seam ({@code
 * Item.setTileEntityItemStackRenderer}) and it keeps the client face client-only
 * — the server never loads this class.</p>
 *
 * <p>盾的 3D 面：用 vanilla 的 {@code ModelShield} 几何 + 本附属自己的 entity 纹理
 * （vanilla 盾图集布局，按金属重着色）。模型 JSON 保持 {@code builtin/entity}，因此
 * 手持与举盾姿态用的就是 vanilla 那套 display 变换，不是自估的近似值。</p>
 *
 * <p>为什么用 per-item TEISR 而不是继承 {@code ItemShield}：vanilla 渲染器用
 * {@code item == Items.SHIELD} 身份比较派发，子类永远不命中；per-item 渲染器是
 * Forge 支持的接缝，且整类只在客户端加载。</p>
 */
public final class ETIMExtraShieldRenderer extends TileEntityItemStackRenderer {

    private final ModelShield model = new ModelShield();
    private final ResourceLocation texture;

    ETIMExtraShieldRenderer(ResourceLocation texture) {
        this.texture = texture;
    }

    /**
     * Same body as vanilla's shield arm ({@code
     * TileEntityItemStackRenderer:62-76}): bind the shield texture, flip the
     * model into item space, render, restore. No banner layer — these shields
     * carry no banner tag.
     *
     * <p>与 vanilla 盾臂同体：绑纹理 → 翻转到物品空间 → 渲染 → 复原。无 banner 层。</p>
     */
    @Override
    public void renderByItem(ItemStack stack, float partialTicks) {
        Minecraft.getMinecraft().getTextureManager().bindTexture(this.texture);
        GlStateManager.pushMatrix();
        GlStateManager.scale(1.0F, -1.0F, -1.0F);
        this.model.render();
        GlStateManager.popMatrix();
    }
}
