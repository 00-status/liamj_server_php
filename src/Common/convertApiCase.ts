/**
 * Converts a string of JSON objects with snake_case properties to camelCase properties.
 * @param jsonString
 * @returns An object containing camelCase properties
 */
export const convertApiCase = <T>(jsonString: string): T | null => {
    if (!jsonString) {
        return null;
    }

    return JSON.parse(
        jsonString,
        function (this: Record<string, unknown>, key: string, value: unknown) {
            const camelKey = key.replace(/([-_][a-z])/g, (match) =>
                match.toUpperCase().replace('-', '').replace('_', ''),
            );

            if (key !== camelKey) {
                this[camelKey] = value;
                return; // Returns undefined, excluding the original snake_case key
            }
            return value;
        },
    );
};
