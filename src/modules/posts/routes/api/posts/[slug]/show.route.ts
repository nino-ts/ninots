import type { NextRequest, RouteContext } from "@ninots/http";
import { NextResponse } from "@ninots/http";
import { PostService } from "@/modules/posts/services/PostService";

/**
 * Show a specific post by slug.
 *
 * GET /api/posts/:slug
 *
 * @param _req - The incoming HTTP request
 * @param ctx - The route context with params
 * @returns JSON response with post
 */
export async function GET(_req: NextRequest, ctx: RouteContext<"/posts/[slug]">): Promise<typeof NextResponse> {
    const { slug } = await ctx.params;
    const postService = new PostService();
    const post = await postService.findBySlug(slug);
    return NextResponse.json(post);
}
