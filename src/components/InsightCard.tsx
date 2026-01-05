// InsightCard - Primary display component for actionable insights

import { verdictColors } from '@/config';
import type { ReasoningOutput } from '@/types';

interface InsightCardProps {
    reasoning: ReasoningOutput;
    showDetailed?: boolean;
}

export default function InsightCard({ reasoning, showDetailed = false }: InsightCardProps) {
    const colors = verdictColors[reasoning.overallVerdict];

    return (
        <div
            className="insight-card"
            style={{
                background: colors.background,
                borderLeft: `4px solid ${colors.border}`,
            }}
        >
            <div className="insight-header">
                <div className="verdict-badge" style={{ color: colors.text }}>
                    {reasoning.overallVerdict.toUpperCase()}
                </div>
                <div className="confidence-indicator">
                    {getConfidenceIcon(reasoning.verdictConfidence)}
                    <span>{reasoning.verdictConfidence} confidence</span>
                </div>
            </div>

            <h2 className="insight-summary" style={{ color: colors.text }}>
                {reasoning.summary}
            </h2>

            <div className="key-insights">
                <h3>What You Need to Know</h3>
                <ul>
                    {reasoning.keyInsights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                    ))}
                </ul>
            </div>

            {reasoning.contextualGuidance && (
                <div className="contextual-guidance">
                    <div className="guidance-icon">💡</div>
                    <p>{reasoning.contextualGuidance}</p>
                </div>
            )}

            {showDetailed && reasoning.ingredientAnalyses.length > 0 && (
                <details className="ingredient-details">
                    <summary>View Detailed Ingredient Analysis</summary>
                    <div className="ingredients-list">
                        {reasoning.ingredientAnalyses.map((analysis, idx) => (
                            <div key={idx} className="ingredient-item">
                                <h4>{analysis.humanReadableName}</h4>
                                <p className="ingredient-purpose">
                                    <strong>Purpose:</strong> {analysis.purpose}
                                </p>
                                <p className="ingredient-impact">
                                    <strong>Health Impact:</strong> {analysis.healthImpact}
                                </p>
                                {analysis.concerns.length > 0 && (
                                    <div className="ingredient-concerns">
                                        {analysis.concerns.map((concern, cidx) => (
                                            <div key={cidx} className="concern-badge" data-severity={concern.severity}>
                                                {concern.description}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {analysis.tradeoffs && (
                                    <p className="ingredient-tradeoffs">
                                        <strong>Why it's used:</strong> {analysis.tradeoffs}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
}

function getConfidenceIcon(confidence: string): string {
    switch (confidence) {
        case 'high': return '●●●';
        case 'medium': return '●●○';
        case 'low': return '●○○';
        default: return '○○○';
    }
}
