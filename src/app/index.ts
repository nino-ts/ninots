/**
 * Route Handler for the Root Path (/)
 *
 * Defines handlers for HTTP methods targeting the application's root path.
 *
 * @module App/RootRoute
 */

/**
 * Handles GET requests to the root path (/).
 * Returns a simple welcome message.
 *
 * @param {Request} request - The incoming request object (unused in this handler).
 * @returns {Response} A JSON response with a welcome message.
 */
export function GET(request: Request): Response {
  // Log that the handler was called (optional)
  // console.log(`[Route /] GET handler executed for request: ${request.url}`);

  const responsePayload = {
    message: "Bem-vindo ao Ninots!",
    framework: "Ninots",
    runtime: "Bun",
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(responsePayload), {
    status: 200, // OK
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

// Example for another method (e.g., POST), currently just returns Method Not Allowed
// export function POST(request: Request): Response {
//   return new Response('Method Not Allowed for /', { status: 405 });
// }
