// FIXED: Removed tiktoken (doesn't work with Gemini) and using simple character-based estimation
// Gemini uses approximately 1 token per 4 characters for English text
// This is a rough approximation that works well enough for token counting

export function countToken(text: string): number {
    // Approximate token count: ~4 characters per token for Gemini
    return Math.ceil(text.length / 4);
}

export function countConversationToken(messages: { role: string, content: string }[]) {
    // FIXED: Check if messages is an array before iterating
    if (!Array.isArray(messages)) {
        return 0;
    }
    
    let tokens = 0;

    for (const message of messages) {
        tokens += countToken(message.content);
    }
    tokens += 2; // for the response

    return tokens;
}