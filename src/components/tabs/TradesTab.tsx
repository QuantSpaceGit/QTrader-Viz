/**
 * Trades tab - Trades table and analytics
 */

import { TradesTable } from '../TradesTable';
import type { ProcessedBacktestData } from '../../lib/types/qtrader';

interface TradesTabProps {
    data: ProcessedBacktestData;
}

export function TradesTab({ data }: TradesTabProps) {
    const trades = data.trades || [];
    const winners = trades.filter(t => t.is_winner);
    const losers = trades.filter(t => !t.is_winner);

    return (
        <div className="tab-content">
            {/* Trade Summary Stats */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-label">Total Trades</div>
                    <div className="metric-value">{trades.length}</div>
                </div>
                <div className="metric-card positive">
                    <div className="metric-label">Winners</div>
                    <div className="metric-value">{winners.length}</div>
                </div>
                <div className="metric-card negative">
                    <div className="metric-label">Losers</div>
                    <div className="metric-value">{losers.length}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Avg Duration</div>
                    <div className="metric-value">
                        {trades.length > 0
                            ? (trades.reduce((sum, t) => sum + t.duration_days, 0) / trades.length).toFixed(0)
                            : 0}{' '}
                        days
                    </div>
                </div>
            </div>

            {/* Trades Table */}
            <section className="chart-section">
                <h2>All Trades ({trades.length})</h2>
                <TradesTable trades={trades} />
            </section>
        </div>
    );
}
