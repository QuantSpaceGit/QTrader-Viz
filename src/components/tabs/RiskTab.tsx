/**
 * Drawdowns tab - Drawdown analysis
 */

import type { ProcessedBacktestData } from '../../lib/types/qtrader';

interface DrawdownsTabProps {
    data: ProcessedBacktestData;
}

export function DrawdownsTab({ data }: DrawdownsTabProps) {
    const drawdowns = data.drawdowns || [];
    const topDrawdowns = drawdowns
        .filter(d => d.recovered)
        .sort((a, b) => parseFloat(b.depth_pct) - parseFloat(a.depth_pct))
        .slice(0, 10);

    return (
        <div className="tab-content">
            {/* Drawdowns Table */}
            <section className="chart-section">
                <h2>Top 10 Drawdowns</h2>
                <div className="trades-table-container">
                    <table className="trades-table">
                        <thead>
                            <tr>
                                <th>Start</th>
                                <th>Trough</th>
                                <th>End</th>
                                <th>Depth %</th>
                                <th>Duration</th>
                                <th>Recovery</th>
                                <th>Peak Equity</th>
                                <th>Trough Equity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topDrawdowns.map((dd) => (
                                <tr key={dd.drawdown_id}>
                                    <td>{new Date(dd.start_timestamp).toLocaleDateString()}</td>
                                    <td>{new Date(dd.trough_timestamp).toLocaleDateString()}</td>
                                    <td>{dd.end_timestamp ? new Date(dd.end_timestamp).toLocaleDateString() : '-'}</td>
                                    <td className="negative">-{parseFloat(dd.depth_pct).toFixed(2)}%</td>
                                    <td>{dd.duration_days} days</td>
                                    <td>{dd.recovery_days ?? '-'} days</td>
                                    <td>${dd.peak_equity.toLocaleString()}</td>
                                    <td>${dd.trough_equity.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
