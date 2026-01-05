// UncertaintyWidget - Communicates data gaps and uncertainty

import type { UncertaintyInfo } from '@/types';

interface UncertaintyWidgetProps {
    uncertainty: UncertaintyInfo;
}

export default function UncertaintyWidget({ uncertainty }: UncertaintyWidgetProps) {
    const getIcon = () => {
        switch (uncertainty.type) {
            case 'well-established': return '✓';
            case 'emerging-research': return '🔬';
            case 'debated': return '⚖️';
            case 'unknown': return '❓';
            default: return '❓';
        }
    };

    const getTypeLabel = () => {
        switch (uncertainty.type) {
            case 'well-established': return 'Well-Established Science';
            case 'emerging-research': return 'Emerging Research';
            case 'debated': return 'Scientific Debate Ongoing';
            case 'unknown': return 'Limited Data Available';
            default: return 'Uncertainty Present';
        }
    };

    return (
        <div className="uncertainty-widget" data-type={uncertainty.type}>
            <div className="uncertainty-header">
                <span className="uncertainty-icon">{getIcon()}</span>
                <h3>{getTypeLabel()}</h3>
            </div>

            <p className="uncertainty-message">{uncertainty.message}</p>

            <details className="uncertainty-reasoning">
                <summary>Why there's uncertainty</summary>
                <p>{uncertainty.reasoning}</p>
            </details>

            {uncertainty.suggestedAction && (
                <div className="uncertainty-action">
                    <strong>What you can do:</strong>
                    <p>{uncertainty.suggestedAction}</p>
                </div>
            )}
        </div>
    );
}
