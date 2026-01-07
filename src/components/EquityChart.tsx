/**
 * Equity curve chart component with TradingView Lightweight Charts v5
 */

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, AreaSeries, CrosshairMode, type Time } from 'lightweight-charts';
import type { EquityCurvePoint } from '../lib/types/qtrader';

interface EquityChartProps {
    data: EquityCurvePoint[];
}

export function EquityChart({ data }: EquityChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const [showGrid, setShowGrid] = useState(true);

    useEffect(() => {
        if (!chartContainerRef.current || !data || data.length === 0) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#1a1a1a' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: showGrid ? '#2b2b43' : 'transparent' },
                horzLines: { color: showGrid ? '#2b2b43' : 'transparent' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 1,
                    color: '#758696',
                    style: 3,
                },
                horzLine: {
                    width: 1,
                    color: '#758696',
                    style: 3,
                },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: '#2b2b43',
            },
            rightPriceScale: {
                borderColor: '#2b2b43',
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
        });

        // Add area series (v5 API with imported series definition)
        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: '#646cff',
            topColor: 'rgba(100, 108, 255, 0.4)',
            bottomColor: 'rgba(100, 108, 255, 0.0)',
            lineWidth: 2,
        });

        // Convert to chart data and deduplicate timestamps
        const chartDataMap = new Map<number, number>();
        data.forEach((point) => {
            const time = Math.floor(new Date(point.timestamp).getTime() / 1000);
            // Keep the last value for duplicate timestamps
            chartDataMap.set(time, point.equity);
        });

        // Convert to array and sort by time
        const chartData = Array.from(chartDataMap.entries())
            .map(([time, value]) => ({ time: time as Time, value }))
            .sort((a, b) => (a.time as number) - (b.time as number));

        areaSeries.setData(chartData);

        // Subscribe to crosshair move to update legend
        chart.subscribeCrosshairMove((param) => {
            if (!legendRef.current) return;

            if (!param.time || !param.seriesData.size) {
                legendRef.current.innerHTML = '<span style="color: #888;">Hover over chart to see values</span>';
                return;
            }

            const equityData = param.seriesData.get(areaSeries) as { value: number } | undefined;

            if (equityData?.value !== undefined) {
                const dateStr = new Date((param.time as number) * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                let legendHTML = `<div style="margin-bottom: 8px; color: #fff; font-weight: 600;">${dateStr}</div>`;
                legendHTML += `<div><strong style="color: #888;">Equity:</strong> $${equityData.value.toFixed(2)}</div>`;

                legendRef.current.innerHTML = legendHTML;
            }
        });

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, showGrid]);

    if (!data || data.length === 0) {
        return (
            <div className="chart-placeholder">
                <p>No equity data available</p>
            </div>
        );
    }

    return (
        <div className="chart-wrapper">
            <div className="chart-controls">
                <label>
                    <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                    />
                    Grid
                </label>
                <span className="chart-hint">Scroll: Zoom | Drag: Pan</span>
            </div>
            <div ref={chartContainerRef} className="chart-container" />
            <div ref={legendRef} className="chart-legend">
                <span style={{ color: '#888' }}>Hover over chart to see values</span>
            </div>
        </div>
    );
}
