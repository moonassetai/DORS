export function createOnResponseHook() {
  return async (response: string): Promise<string> => {
    // Only suggest filing for substantial responses (>500 chars with analysis markers)
    const isSubstantial = response.length > 500;
    const hasAnalysis = /\b(analysis|comparison|summary|conclusion|finding|insight|pattern)\b/i.test(response);

    if (isSubstantial && hasAnalysis) {
      return `${response}\n\n> 💡 This analysis could be filed as a wiki page. Use \`wiki_write\` to save it.`;
    }

    return response;
  };
}
