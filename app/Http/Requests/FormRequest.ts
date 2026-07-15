/**
 * Base form request — validation hooks for HTTP requests.
 */
export abstract class FormRequest {
    public abstract rules(): Record<string, string>;

    public messages(): Record<string, string> {
        return {};
    }

    public authorize(): boolean {
        return true;
    }
}
