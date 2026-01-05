// Core AI Reasoning Engine using Google Gemini

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, systemPrompts, commonIngredients } from '@/config';
import type {
    ReasoningOutput,
    UserIntent,
    IngredientAnalysis,
    HealthConcern,
    UncertaintyInfo,
    ConfidenceLevel
} from '@/types';

const genAI = config.apiKeys.gemini
    ? new GoogleGenerativeAI(config.apiKeys.gemini)
    : null;

export async function generateReasoningOutput(
    ingredientList: string,
    intent: UserIntent
): Promise<ReasoningOutput> {

    if (!genAI) {
        throw new Error('Google Generative AI API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in .env.local');
    }

    const model = genAI.getGenerativeModel({ model: config.gemini.model });

    // Build context-aware prompt
    const prompt = buildReasoningPrompt(ingredientList, intent);

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: config.gemini.temperature,
                maxOutputTokens: config.gemini.maxTokens,
                responseMimeType: 'application/json',
            },
        });

        const response = result.response;
        const text = response.text();

        // Parse structured JSON response
        const parsed = JSON.parse(text);

        return validateAndNormalizeOutput(parsed);

    } catch (error) {
        console.error('Reasoning engine error:', error);

        // Fallback to rule-based reasoning
        return generateRuleBasedReasoning(ingredientList, intent);
    }
}

function buildReasoningPrompt(ingredientList: string, intent: UserIntent): string {
    let prompt = systemPrompts.ingredientAnalysis + '\n\n';

    prompt += `INGREDIENT LIST:\n${ingredientList}\n\n`;

    if (intent.primaryConcern) {
        prompt += `USER'S PRIMARY CONCERN: ${intent.primaryConcern}\n`;
    }

    if (intent.context) {
        prompt += `USER CONTEXT: ${intent.context}\n`;
    }

    prompt += `\nUSER'S IMPLICIT NEEDS:\n${intent.implicitNeeds.map(n => `- ${n}`).join('\n')}\n\n`;

    prompt += `OUTPUT FORMAT (JSON):
{
  "overallVerdict": "safe" | "caution" | "avoid" | "uncertain",
  "verdictConfidence": "high" | "medium" | "low",
  "summary": "One-line verdict",
  "keyInsights": ["insight 1", "insight 2", ...],
  "ingredientAnalyses": [
    {
      "ingredient": { "name": "...", "category": "...", "confidence": "..." },
      "humanReadableName": "Plain language name",
      "purpose": "Why it's used",
      "healthImpact": "What it does to the body",
      "concerns": [
        {
          "category": "...",
          "severity": "low" | "medium" | "high",
          "description": "...",
          "reasoning": "Why this is a concern",
          "confidence": "...",
          "affectedGroups": ["group1", "group2"]
        }
      ],
      "tradeoffs": "Why manufacturers use it despite concerns",
      "alternatives": ["alternative 1", "alternative 2"]
    }
  ],
  "overallUncertainty": {
    "type": "well-established" | "emerging-research" | "debated" | "unknown",
    "message": "What we don't know",
    "reasoning": "Why there's uncertainty",
    "suggestedAction": "What user should do"
  }
}

CRITICAL: Be brutally honest about uncertainty. If research is limited or debated, say so explicitly.`;

    return prompt;
}

function validateAndNormalizeOutput(parsed: any): ReasoningOutput {
    // Ensure all required fields exist with defaults
    return {
        overallVerdict: parsed.overallVerdict || 'uncertain',
        verdictConfidence: parsed.verdictConfidence || 'medium',
        summary: parsed.summary || 'Analysis completed',
        keyInsights: parsed.keyInsights || [],
        ingredientAnalyses: parsed.ingredientAnalyses || [],
        overallUncertainty: parsed.overallUncertainty,
        contextualGuidance: parsed.contextualGuidance,
    };
}

// Fallback reasoning when AI is unavailable
function generateRuleBasedReasoning(
    ingredientList: string,
    intent: UserIntent
): ReasoningOutput {

    const ingredients = ingredientList
        .split(/,|\n/)
        .map(i => i.trim().toLowerCase())
        .filter(i => i.length > 0);

    const analyses: IngredientAnalysis[] = [];
    const allConcerns: HealthConcern[] = [];

    for (const ing of ingredients) {
        const known = findKnownIngredient(ing);

        if (known) {
            const concerns: HealthConcern[] = [];

            if (known.generalSafety === 'caution' || known.generalSafety === 'avoid') {
                concerns.push({
                    category: ing.includes('sugar') || ing.includes('fructose') ? 'sugar' :
                        ing.includes('tbhq') || ing.includes('benzoate') ? 'preservative' :
                            ing.includes('red') || ing.includes('blue') ? 'artificial-additive' : 'controversial',
                    severity: known.generalSafety === 'avoid' ? 'high' : 'medium',
                    description: known.notes,
                    reasoning: 'Based on current scientific understanding',
                    confidence: 'medium',
                });
                allConcerns.push(...concerns);
            }

            analyses.push({
                ingredient: {
                    name: ing,
                    category: concerns.length > 0 ? concerns[0].category : 'none',
                    confidence: 'medium',
                },
                humanReadableName: known.humanName,
                purpose: known.purpose,
                healthImpact: known.notes,
                concerns,
                tradeoffs: known.purpose,
            });
        }
    }

    const verdict = allConcerns.length === 0 ? 'safe' :
        allConcerns.some(c => c.severity === 'high') ? 'avoid' : 'caution';

    return {
        overallVerdict: verdict,
        verdictConfidence: 'medium',
        summary: verdict === 'safe'
            ? 'No major concerns detected in ingredient list'
            : `${allConcerns.length} potential concern${allConcerns.length > 1 ? 's' : ''} identified`,
        keyInsights: analyses
            .filter(a => a.concerns.length > 0)
            .map(a => `${a.humanReadableName}: ${a.concerns[0].description}`)
            .slice(0, 5),
        ingredientAnalyses: analyses,
        overallUncertainty: {
            type: 'debated',
            message: 'AI reasoning unavailable - using rule-based fallback',
            reasoning: 'Limited analysis without AI reasoning engine',
            suggestedAction: 'Configure GOOGLE_GENERATIVE_AI_API_KEY for detailed analysis',
        },
    };
}

function findKnownIngredient(ingredient: string): typeof commonIngredients[string] | null {
    // Check exact match
    if (commonIngredients[ingredient]) {
        return commonIngredients[ingredient];
    }

    // Check partial matches
    for (const [key, value] of Object.entries(commonIngredients)) {
        if (ingredient.includes(key) || key.includes(ingredient)) {
            return value;
        }
    }

    return null;
}
