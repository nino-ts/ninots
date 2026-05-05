import { NextResponse } from '@ninots/http';

/**
 * Home page route handler.
 *
 * @returns Welcome response
 */
export async function GET(): Promise<typeof NextResponse> {
    return NextResponse.json({
        message: 'Welcome to Ninots!',
        version: '1.0.0',
    });
}
