// Configuration and constants

export const config = {
    apiKeys: {
        gemini: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
    },
    features: {
        enableOCR: process.env.ENABLE_OCR === 'true',
        enableExaSearch: process.env.ENABLE_EXA_SEARCH === 'true',
        // Default to mock data if API key is not configured OR if explicitly set to true
        useMockData: !process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.USE_MOCK_DATA === 'true',
    },
    gemini: {
        model: 'gemini-2.0-flash-exp',
        temperature: 0.3, // Lower for more consistent reasoning
        maxTokens: 4096,
    },
};

// Color scheme for health verdicts
export const verdictColors = {
    safe: {
        background: 'rgba(76, 175, 80, 0.1)',
        border: 'rgb(76, 175, 80)',
        text: 'rgb(56, 142, 60)',
    },
    caution: {
        background: 'rgba(255, 152, 0, 0.1)',
        border: 'rgb(255, 152, 0)',
        text: 'rgb(230, 126, 34)',
    },
    avoid: {
        background: 'rgba(244, 67, 54, 0.1)',
        border: 'rgb(244, 67, 54)',
        text: 'rgb(211, 47, 47)',
    },
    uncertain: {
        background: 'rgba(158, 158, 158, 0.1)',
        border: 'rgb(158, 158, 158)',
        text: 'rgb(97, 97, 97)',
    },
};

// System prompts for AI reasoning
export const systemPrompts = {
    intentAnalysis: `You are an expert at understanding consumer health intent. Given a user's input (text or image description), infer:
1. Their primary health concern (allergens, ultra-processing, specific health conditions, etc.)
2. Any contextual factors (pregnancy, children, dietary restrictions)
3. The implicit questions they're asking

Respond with concise, structured analysis.`,

    ingredientAnalysis: `You are a health-focused ingredient analyst. Your role is to:

CRITICAL RULES:
1. EXPLAIN WHY, not just WHAT - Always provide reasoning
2. TRANSLATE JARGON - Convert scientific names to plain language
3. SHOW TRADE-OFFS - Explain why manufacturers use concerning ingredients
4. BE HONEST ABOUT UNCERTAINTY - If evidence is weak or debated, say so explicitly
5. NEVER HALLUCINATE - If you don't have confident information, admit it

For each ingredient, analyze:
- What it is in human terms (e.g., "TBHQ: synthetic preservative to prevent oil rancidity")
- Why it's used (shelf life, cost, texture, etc.)
- Health implications based on current research
- Who should be cautious (pregnant women, children, those with conditions)
- Level of scientific certainty (well-established, emerging, debated, unknown)

Output Format:
- Overall verdict: safe/caution/avoid/uncertain
- Key insights (3-5 bullet points)
- Per-ingredient analysis with reasoning
- Uncertainty statements when applicable

Prioritize cognitive offload - make decisions easy for the user.`,
};

// Common ingredient knowledge base (lightweight reference)
export const commonIngredients: Record<string, {
    humanName: string;
    purpose: string;
    generalSafety: 'safe' | 'caution' | 'avoid';
    notes: string;
}> = {
    'water': {
        humanName: 'Water',
        purpose: 'Base liquid',
        generalSafety: 'safe',
        notes: 'Essential, no concerns',
    },
    'sugar': {
        humanName: 'Sugar (Sucrose)',
        purpose: 'Sweetener',
        generalSafety: 'caution',
        notes: 'Natural but excess linked to obesity, diabetes. Moderation key.',
    },
    'citric acid': {
        humanName: 'Citric Acid',
        purpose: 'Preservative and flavor enhancer',
        generalSafety: 'safe',
        notes: 'Natural acid found in citrus fruits, widely considered safe',
    },
    'tbhq': {
        humanName: 'TBHQ (Tertiary Butylhydroquinone)',
        purpose: 'Synthetic antioxidant preservative',
        generalSafety: 'caution',
        notes: 'Banned in some countries. Studies show potential immune system effects at high doses. Used to prevent oil rancidity.',
    },
    'high fructose corn syrup': {
        humanName: 'High Fructose Corn Syrup (HFCS)',
        purpose: 'Sweetener (cheaper than sugar)',
        generalSafety: 'caution',
        notes: 'Metabolically similar to sugar but often in ultra-processed foods. Linked to obesity and metabolic issues.',
    },
    'sodium benzoate': {
        humanName: 'Sodium Benzoate',
        purpose: 'Preservative',
        generalSafety: 'caution',
        notes: 'Can form benzene (carcinogen) when combined with vitamin C in acidic conditions. Generally recognized as safe in isolation.',
    },
    'red 40': {
        humanName: 'Red 40 (Allura Red AC)',
        purpose: 'Artificial coloring',
        generalSafety: 'caution',
        notes: 'Synthetic dye. Some studies link to hyperactivity in children. Banned in some European countries.',
    },
    'natural flavors': {
        humanName: 'Natural Flavors',
        purpose: 'Flavor enhancement',
        generalSafety: 'caution',
        notes: 'Vague term that can include 100+ chemical compounds. "Natural" is misleading - still highly processed.',
    },
};
