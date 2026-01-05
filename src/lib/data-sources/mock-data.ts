// Mock data for testing and development

import type { AnalysisRequest, ReasoningOutput, UIDirective } from '@/types';

export const mockProducts = {
    cleanProduct: {
        name: 'Organic Apple Sauce',
        ingredients: 'Organic Apples, Water, Organic Cane Sugar, Ascorbic Acid (Vitamin C)',
    },
    concerningProduct: {
        name: 'Ultra-Processed Snack Bar',
        ingredients: 'High Fructose Corn Syrup, Enriched Flour, Partially Hydrogenated Soybean Oil, TBHQ, Red 40, Blue 1, Natural and Artificial Flavors, BHT',
    },
    uncertainProduct: {
        name: 'Novel Functional Beverage',
        ingredients: 'Water, Organic Erythritol, Natural Flavors, Monk Fruit Extract, L-Theanine, Nootropic Blend (Alpha-GPC, Lion\'s Mane Extract)',
    },
    allergenProduct: {
        name: 'Mixed Granola',
        ingredients: 'Rolled Oats, Almonds, Honey, Coconut Oil, Dried Cranberries, Sunflower Seeds, Contains: Tree Nuts',
    },
};

export const mockReasoningOutput: Record<string, ReasoningOutput> = {
    cleanProduct: {
        overallVerdict: 'safe',
        verdictConfidence: 'high',
        summary: 'Clean, minimal-ingredient product with no significant health concerns',
        keyInsights: [
            'Only organic ingredients, no synthetic additives',
            'Vitamin C added as natural preservative',
            'Sugar present but from natural cane source',
            'Safe for most dietary needs',
        ],
        ingredientAnalyses: [
            {
                ingredient: {
                    name: 'Organic Apples',
                    category: 'none',
                    confidence: 'high',
                },
                humanReadableName: 'Apples',
                purpose: 'Primary ingredient, provides natural sweetness and fiber',
                healthImpact: 'Excellent source of fiber, antioxidants, and vitamins',
                concerns: [],
                tradeoffs: 'None - whole food ingredient',
            },
            {
                ingredient: {
                    name: 'Organic Cane Sugar',
                    category: 'sugar',
                    confidence: 'high',
                },
                humanReadableName: 'Sugar',
                purpose: 'Additional sweetening',
                healthImpact: 'Adds calories without nutrients. Best consumed in moderation.',
                concerns: [
                    {
                        category: 'sugar',
                        severity: 'low',
                        description: 'Added sugar can contribute to excess calorie intake',
                        reasoning: 'While organic, it\'s still added sugar. Amount matters more than source.',
                        confidence: 'high',
                    },
                ],
                tradeoffs: 'Used to improve palatability and extend shelf life',
            },
        ],
    },
    concerningProduct: {
        overallVerdict: 'avoid',
        verdictConfidence: 'high',
        summary: 'Multiple concerning ingredients with known health risks',
        keyInsights: [
            'Contains TBHQ - synthetic preservative banned in some countries',
            'Artificial colors (Red 40, Blue 1) linked to hyperactivity in children',
            'High fructose corn syrup as primary ingredient - metabolic concerns',
            'Trans fats from partially hydrogenated oils',
            'Clear ultra-processed food signature',
        ],
        ingredientAnalyses: [
            {
                ingredient: {
                    name: 'TBHQ',
                    scientificName: 'Tertiary Butylhydroquinone',
                    category: 'preservative',
                    confidence: 'high',
                },
                humanReadableName: 'TBHQ (Synthetic Preservative)',
                purpose: 'Prevents oil from going rancid, extends shelf life',
                healthImpact: 'Studies link to immune system effects, vision disturbances, and potential DNA damage at high doses',
                concerns: [
                    {
                        category: 'preservative',
                        severity: 'high',
                        description: 'Synthetic preservative with potential long-term health effects',
                        reasoning: 'Banned in Japan and some EU countries. FDA allows it in US but debate continues.',
                        confidence: 'medium',
                        affectedGroups: ['children', 'pregnant women'],
                    },
                ],
                tradeoffs: 'Allows longer shelf life and prevents oil oxidation cheaply',
                alternatives: ['Vitamin E (tocopherols)', 'Rosemary extract'],
            },
            {
                ingredient: {
                    name: 'Red 40',
                    scientificName: 'Allura Red AC',
                    category: 'artificial-additive',
                    confidence: 'high',
                },
                humanReadableName: 'Red 40 (Artificial Dye)',
                purpose: 'Makes product visually appealing',
                healthImpact: 'Linked to hyperactivity in sensitive children, potential allergen',
                concerns: [
                    {
                        category: 'artificial-additive',
                        severity: 'medium',
                        description: 'Synthetic dye with behavioral effects in some children',
                        reasoning: 'Multiple studies show connection to ADHD symptoms. EU requires warning labels.',
                        confidence: 'medium',
                        affectedGroups: ['children'],
                    },
                ],
                tradeoffs: 'Purely cosmetic - no functional benefit beyond appearance',
                alternatives: ['Beet juice', 'Paprika extract', 'Natural anthocyanins'],
            },
        ],
        overallUncertainty: {
            type: 'debated',
            message: 'While individual ingredients are FDA-approved, the combination of multiple synthetic additives raises concerns',
            reasoning: 'Limited research on synergistic effects of multiple additives consumed together',
            suggestedAction: 'Consider products with simpler ingredient lists',
        },
    },
};

// Simulate processing delay for realistic UX
export async function getMockAnalysis(request: AnalysisRequest): Promise<{ reasoning: ReasoningOutput; ui: UIDirective }> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const input = request.input.toLowerCase();

    let reasoning: ReasoningOutput;
    let ui: UIDirective;

    if (input.includes('tbhq') || input.includes('red 40') || input.includes('hfcs')) {
        reasoning = mockReasoningOutput.concerningProduct;
        ui = {
            layout: 'warning-first',
            showAlternatives: true,
            showUncertaintyWidget: true,
            showIngredientBreakdown: true,
            priorityMessage: '⚠️ Multiple concerning ingredients detected',
        };
    } else {
        reasoning = mockReasoningOutput.cleanProduct;
        ui = {
            layout: 'simple-card',
            showAlternatives: false,
            showUncertaintyWidget: false,
            showIngredientBreakdown: false,
        };
    }

    return { reasoning, ui };
}
