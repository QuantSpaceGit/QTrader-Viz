/**
 * Trades table component
 */

import type { Performance } from '../lib/types/qtrader';

interface TradesTableProps {
    trades: Performance['trades'];
}

export function TradesTable({ trades }: TradesTableProps) {
    if (!trades || trades.length === 0) {
        return (
            <div className="no-data">
                <p>No trades available</p>
            </div>
        );
    }

    return (
        <div className="trades-table-container">
            <table className="trades-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Side</th>
                        <th>Entry</th>
                        <th>Exit</th>
                        <th>Entry Price</th>
                        <th>Exit Price</th>
                        <th>Qty</th>
                        <th>P&L</th>
                        <th>P&L %</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade) => {
                        const pnl = parseFloat(trade.realized_pnl);
                        const pnlPct = parseFloat(trade.realized_pnl_pct);
                        const pnlClass = pnl >= 0 ? 'positive' : 'negative';

                        return (
                            <tr key={trade.trade_id}>
                                <td>{trade.symbol}</td>
                                <td>
                                    <span className={`side-badge ${trade.side.toLowerCase()}`}>
                                        {trade.side}
                                    </span>
                                </td>
                                <td>{new Date(trade.entry_timestamp).toLocaleDateString()}</td>
                                <td>{new Date(trade.exit_timestamp).toLocaleDateString()}</td>
                                <td>${parseFloat(trade.entry_price).toFixed(2)}</td>
                                <td>${parseFloat(trade.exit_price).toFixed(2)}</td>
                                <td>{parseFloat(trade.quantity).toFixed(0)}</td>
                                <td className={pnlClass}>${pnl.toFixed(2)}</td>
                                <td className={pnlClass}>{pnlPct.toFixed(2)}%</td>
                                <td>{trade.duration_days} days</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
