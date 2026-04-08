import type { NextRequest } from '@ninots/http';
import { NextResponse } from '@ninots/http';
import { PostService } from '@/modules/posts/services/PostService';

/**
 * Post module API routes.
 */
export const postRoutes = {
    '/posts': {
        GET: async (req: NextRequest) => {
            const service = new PostService();
            return NextResponse.json(await service.all());
        },
        POST: async (req: NextRequest) => {
            const service = new PostService();
            const data = await req.json();
            return NextResponse.json(await service.create(data), { status: 201 });
        },
    },
};
