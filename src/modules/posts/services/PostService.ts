import { Post } from "@/modules/posts/models/Post";

/**
 * Post service.
 *
 * Handles business logic for post operations.
 */
export class PostService {
    /**
     * Get all posts.
     *
     * @returns Array of posts
     */
    public async all(): Promise<Post[]> {
        return Post.all();
    }

    /**
     * Find a post by slug.
     *
     * @param slug - The post slug
     * @returns The post or null if not found
     */
    public async findBySlug(slug: string): Promise<Post | null> {
        return Post.where("slug", slug).first();
    }

    /**
     * Create a new post.
     *
     * @param data - The post data
     * @returns The created post
     */
    public async create(data: Record<string, unknown>): Promise<Post> {
        const post = new Post();
        post.fill(data);
        await post.save();
        return post;
    }
}
