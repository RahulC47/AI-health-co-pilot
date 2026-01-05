// UI Orchestrator - determines which components to render based on reasoning output

import type { ReasoningOutput, UIDirective, UserIntent } from '@/types';

export function determineUILayout(
    reasoning: ReasoningOutput,
    intent: UserIntent
): UIDirective {

    const hasHighSeverityConcerns = reasoning.ingredientAnalyses.some(
        a => a.concerns.some(c => c.severity === 'high')
    );

    const hasMediumConcerns = reasoning.ingredientAnalyses.some(
        a => a.concerns.some(c => c.severity === 'medium')
    );

    const hasUncertainty = !!reasoning.overallUncertainty &&
        reasoning.overallUncertainty.type !== 'well-established';

    const complexProduct = reasoning.ingredientAnalyses.length > 10;

    // Warning-first layout for high concerns
    if (hasHighSeverityConcerns) {
        return {
            layout: 'warning-first',
            showAlternatives: true,
            showUncertaintyWidget: hasUncertainty,
            showIngredientBreakdown: true,
            priorityMessage: '⚠️ Significant health concerns identified',
        };
    }

    // Detailed breakdown for medium concerns or complex products
    if (hasMediumConcerns || complexProduct) {
        return {
            layout: 'detailed-breakdown',
            showAlternatives: hasMediumConcerns,
            showUncertaintyWidget: hasUncertainty,
            showIngredientBreakdown: true,
        };
    }

    // Simple card for clean products
    if (reasoning.overallVerdict === 'safe') {
        return {
            layout: 'simple-card',
            showAlternatives: false,
            showUncertaintyWidget: hasUncertainty,
            showIngredientBreakdown: false,
        };
    }

    // Default to detailed view
    return {
        layout: 'detailed-breakdown',
        showAlternatives: true,
        showUncertaintyWidget: hasUncertainty,
        showIngredientBreakdown: true,
    };
}
