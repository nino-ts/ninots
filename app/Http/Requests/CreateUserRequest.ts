import { FormRequest } from "@/app/Http/Requests/FormRequest";

/**
 * Create user form request.
 */
export class CreateUserRequest extends FormRequest {
    public rules(): Record<string, string> {
        return {
            email: "required|email|unique:users|max:255",
            name: "required|string|max:255",
            password: "required|string|min:8|confirmed",
            avatar: "sometimes|url",
        };
    }

    public messages(): Record<string, string> {
        return {
            "email.required": "The email is required",
            "email.email": "The email must be valid",
            "email.unique": "This email is already in use",
            "password.min": "The password must have at least 8 characters",
        };
    }
}
