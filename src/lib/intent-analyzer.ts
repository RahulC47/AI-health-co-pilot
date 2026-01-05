// Intent analysis - infers user's primary concerns from input

import type { UserIntent, ConcernCategory } from '@/types';

export function analyzeIntent(input: string, userContext?: string): UserIntent {
    const lowerInput = input.toLowerCase();

    let primaryConcern: ConcernCategory | undefined;
    const implicitNeeds: string[] = [];

    // Detect concern categories
    if (lowerInput.match(/allergen|allergy|allergic|nut|dairy|gluten/)) {
        primaryConcern = 'allergen';
        implicitNeeds.push('Identify allergen information');
    }

    if (lowerInput.match(/sugar|diabetes|diabetic|blood sugar|glucose/)) {
        primaryConcern = 'sugar';
        implicitNeeds.push('Analyze sugar content and type');
    }

    if (lowerInput.match(/preservative|additive|chemical|artificial|e\d{3}/)) {
        primaryConcern = 'artificial-additive';
        implicitNeeds.push('Identify synthetic additives');
    }

    if (lowerInput.match(/processed|ultra-processed|whole food|clean/)) {
        primaryConcern = 'ultra-processing';
        implicitNeeds.push('Assess processing level');
    }

    // Detect contextual factors
    let context = userContext;
    if (!context) {
        if (lowerInput.match(/pregnan|baby|expecting/)) {
            context = 'pregnancy';
            implicitNeeds.push('Consider pregnancy safety');
        } else if (lowerInput.match(/child|kid|toddler/)) {
            context = 'children';
            implicitNeeds.push('Evaluate child-specific concerns');
        } else if (lowerInput.match(/weight|diet|lose|obesity/)) {
            context = 'weight-management';
            implicitNeeds.push('Consider caloric and nutritional density');
        }
    }

    // Default implicit needs
    if (implicitNeeds.length === 0) {
        implicitNeeds.push('Provide general health assessment');
        implicitNeeds.push('Highlight any concerns');
    }

    return {
        primaryConcern,
        context,
        implicitNeeds,
    };
}
