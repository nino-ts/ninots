import { FormRequest } from '@ninots/validation';

/**
 * Update user form request.
 *
 * Validates user update data.
 */
export class UpdateUserRequest extends FormRequest {
    /**
     * Get validation rules.
     *
     * @returns Validation rules
     */
    public rules(): Record<string, string> {
        return {
            email: 'sometimes|email|max:255',
            name: 'sometimes|string|max:255',
            password: 'sometimes|string|min:8|confirmed',
            avatar: 'sometimes|url',
        };
    }
}
