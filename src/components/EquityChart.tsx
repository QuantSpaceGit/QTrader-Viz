/**
 * Equity curve chart component with TradingView Lightweight Charts v5
 */

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, AreaSeries, CrosshairMode, type Time } from 'lightweight-charts';
import type { EquityPoint } from '../lib/types/qtrader';

interface EquityChartProps {
    data: EquityPoint[];
}

export function EquityChart({ data }: EquityChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [showGrid, setShowGrid] = useState(true);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) return;

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

        const chartData = data.map((point) => ({
            time: Math.floor(point.timestamp.getTime() / 1000) as Time,
            value: point.equity,
        }));

        areaSeries.setData(chartData);

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

    if (data.length === 0) {
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
        </div>
    );
}
