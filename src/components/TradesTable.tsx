/**
 * Trades table component
 */

import type { Trade } from '../lib/types/qtrader';

interface TradesTableProps {
    trades: Trade[];
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
                        const pnlClass = trade.pnl >= 0 ? 'positive' : 'negative';
                        const isOpen = !trade.exit_timestamp || trade.exit_timestamp === null;

                        return (
                            <tr key={trade.trade_id}>
                                <td>{trade.symbol}</td>
                                <td>
                                    <span className={`side-badge ${trade.side.toLowerCase()}`}>
                                        {trade.side}
                                    </span>
                                </td>
                                <td>{new Date(trade.entry_timestamp).toLocaleDateString()}</td>
                                <td>
                                    {isOpen ? (
                                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>OPEN</span>
                                    ) : (
                                        new Date(trade.exit_timestamp).toLocaleDateString()
                                    )}
                                </td>
                                <td>${trade.entry_price.toFixed(2)}</td>
                                <td>
                                    {isOpen ? (
                                        <span style={{ color: '#888' }}>-</span>
                                    ) : (
                                        `$${trade.exit_price.toFixed(2)}`
                                    )}
                                </td>
                                <td>{trade.quantity.toFixed(0)}</td>
                                <td className={isOpen ? '' : pnlClass}>
                                    {isOpen ? (
                                        <span style={{ color: '#888' }}>-</span>
                                    ) : (
                                        `$${trade.pnl.toFixed(2)}`
                                    )}
                                </td>
                                <td className={isOpen ? '' : pnlClass}>
                                    {isOpen ? (
                                        <span style={{ color: '#888' }}>-</span>
                                    ) : (
                                        `${trade.pnl_pct.toFixed(2)}%`
                                    )}
                                </td>
                                <td>
                                    {isOpen ? (
                                        <span style={{ color: '#fbbf24' }}>In Progress</span>
                                    ) : (
                                        `${trade.duration_days.toFixed(0)} days`
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}