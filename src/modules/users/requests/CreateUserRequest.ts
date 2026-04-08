import { FormRequest } from '@ninots/validation';

/**
 * Create user form request.
 *
 * Validates user creation data.
 */
export class CreateUserRequest extends FormRequest {
    /**
     * Get validation rules.
     *
     * @returns Validation rules
     */
    public rules(): Record<string, string> {
        return {
            email: 'required|email|unique:users|max:255',
            name: 'required|string|max:255',
            password: 'required|string|min:8|confirmed',
            avatar: 'sometimes|url',
        };
    }

    /**
     * Get custom validation messages.
     *
     * @returns Custom messages
     */
    public messages(): Record<string, string> {
        return {
            'email.required': 'The email is required',
            'email.email': 'The email must be valid',
            'email.unique': 'This email is already in use',
            'password.min': 'The password must have at least 8 characters',
        };
    }
}
