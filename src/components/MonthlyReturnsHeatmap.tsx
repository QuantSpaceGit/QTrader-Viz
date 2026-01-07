/**
 * Monthly returns heatmap component
 */

import type { MonthlyReturn } from '../lib/types/qtrader';

interface MonthlyReturnsHeatmapProps {
    returns: MonthlyReturn[];
}

export function MonthlyReturnsHeatmap({ returns }: MonthlyReturnsHeatmapProps) {
    if (!returns || returns.length === 0) {
        return <div style={{ color: '#888' }}>No monthly returns data available</div>;
    }

    // Group by year
    const yearData = new Map<number, Map<number, number>>();
    returns.forEach(ret => {
        // Parse period string like "2015-01" to get year and month
        const [yearStr, monthStr] = ret.period.split('-');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr);
        const returnValue = parseFloat(ret.return_pct) / 100; // Convert percentage string to decimal

        if (!yearData.has(year)) {
            yearData.set(year, new Map());
        }
        yearData.get(year)!.set(month, returnValue);
    });

    const years = Array.from(yearData.keys()).sort((a, b) => a - b); // Ascending order (oldest to newest)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getColor = (ret: number) => {
        if (ret > 0) return '#86efac';  // Soft green for positive
        if (ret < 0) return '#fca5a5';  // Soft red for negative
        return 'rgba(176, 176, 176, 1)';                // Gray for zero
    };

    return (
        <div>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Monthly Returns (%)</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #444' }}>Year</th>
                            {months.map(month => (
                                <th key={month} style={{
                                    padding: '8px',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #444',
                                    minWidth: '60px',
                                }}>
                                    {month}
                                </th>
                            ))}
                            <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #444', fontWeight: 'bold' }}>YTD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {years.map(year => {
                            const monthsData = yearData.get(year)!;
                            let ytd = 1;
                            for (let i = 1; i <= 12; i++) {
                                const monthReturn = monthsData.get(i);
                                if (monthReturn !== undefined) {
                                    ytd *= (1 + monthReturn);
                                }
                            }
                            ytd = (ytd - 1) * 100;

                            return (
                                <tr key={year}>
                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{year}</td>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                                        const ret = monthsData.get(month);
                                        return (
                                            <td
                                                key={month}
                                                style={{
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                    backgroundColor: ret !== undefined ? getColor(ret) : 'transparent',
                                                    color: ret !== undefined ? '#000' : '#666',
                                                }}
                                            >
                                                {ret !== undefined ? (ret * 100).toFixed(2) : '-'}
                                            </td>
                                        );
                                    })}
                                    <td style={{
                                        padding: '8px',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        backgroundColor: getColor(ytd / 100),
                                        color: '#000',
                                    }}>
                                        {ytd.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
