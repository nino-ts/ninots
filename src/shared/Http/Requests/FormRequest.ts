import { FormRequest } from '@ninots/validation';

/**
 * Base form request.
 *
 * Provides common validation functionality.
 */
export abstract class FormRequest extends FormRequest {
    /**
     * Get validation rules.
     *
     * @returns Validation rules
     */
    public abstract rules(): Record<string, string>;

    /**
     * Get custom validation messages.
     *
     * @returns Custom messages
     */
    public messages(): Record<string, string> {
        return {};
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @returns Whether the request is authorized
     */
    public authorize(): boolean {
        return true;
    }
}
