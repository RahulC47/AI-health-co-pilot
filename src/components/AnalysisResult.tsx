// AnalysisResult - Main orchestrator component that renders adaptive UI

import InsightCard from './InsightCard';
import UncertaintyWidget from './UncertaintyWidget';
import type { ReasoningOutput, UIDirective } from '@/types';

interface AnalysisResultProps {
    reasoning: ReasoningOutput;
    ui: UIDirective;
}

export default function AnalysisResult({ reasoning, ui }: AnalysisResultProps) {
    return (
        <div className="analysis-result" data-layout={ui.layout}>
            {ui.priorityMessage && (
                <div className="priority-message">
                    {ui.priorityMessage}
                </div>
            )}

            <InsightCard
                reasoning={reasoning}
                showDetailed={ui.showIngredientBreakdown}
            />

            {ui.showUncertaintyWidget && reasoning.overallUncertainty && (
                <UncertaintyWidget uncertainty={reasoning.overallUncertainty} />
            )}

            {ui.showAlternatives && (
                <div className="alternatives-section">
                    <h3>💡 Looking for better options?</h3>
                    <p>Consider products with:</p>
                    <ul>
                        <li>Fewer ingredients (5-10 max)</li>
                        <li>Ingredients you can pronounce</li>
                        <li>No synthetic preservatives or dyes</li>
                        <li>Whole food sources</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
