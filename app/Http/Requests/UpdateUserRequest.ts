import { FormRequest } from "@/app/Http/Requests/FormRequest";

/**
 * Update user form request.
 */
export class UpdateUserRequest extends FormRequest {
    public rules(): Record<string, string> {
        return {
            email: "sometimes|email|max:255",
            name: "sometimes|string|max:255",
            password: "sometimes|string|min:8|confirmed",
            avatar: "sometimes|url",
        };
    }
}
