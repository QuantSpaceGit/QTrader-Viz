/**
 * Price chart component with TradingView Lightweight Charts v5
 */

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers, CrosshairMode, type Time } from 'lightweight-charts';
import type { OHLCVBar, Signal, Indicator } from '../lib/types/qtrader';

interface PriceChartProps {
    data: OHLCVBar[];
    signals: Signal[];
    indicators?: Indicator[];
}

export function PriceChart({ data, signals, indicators = [] }: PriceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [showGrid, setShowGrid] = useState(true);
    const [crosshairMode, setCrosshairMode] = useState<'normal' | 'magnet'>('normal');

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
            height: 500,
            crosshair: {
                mode: crosshairMode === 'magnet' ? CrosshairMode.Magnet : CrosshairMode.Normal,
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
                rightOffset: 12,
                barSpacing: 8,
                fixLeftEdge: false,
                fixRightEdge: false,
            },
            rightPriceScale: {
                borderColor: '#2b2b43',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
        });

        // Add candlestick series (v5 API with imported series definition)
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#4ade80',
            downColor: '#f87171',
            borderVisible: false,
            wickUpColor: '#4ade80',
            wickDownColor: '#f87171',
        });

        // Format data
        const candleData = data.map((bar) => ({
            time: Math.floor(bar.timestamp.getTime() / 1000) as Time,
            open: bar.open,
            high: bar.high,
            low: bar.low,
            close: bar.close,
        }));

        candlestickSeries.setData(candleData);

        // Add indicator lines
        const indicatorColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        indicators.forEach((indicator, index) => {
            const lineSeries = chart.addSeries(LineSeries, {
                color: indicatorColors[index % indicatorColors.length],
                lineWidth: 2,
                title: indicator.name,
            });

            const lineData = indicator.data.map((point) => ({
                time: Math.floor(point.timestamp.getTime() / 1000) as Time,
                value: point.value,
            }));

            lineSeries.setData(lineData);
        });

        // Add signal markers using v5 createSeriesMarkers API
        if (signals.length > 0) {
            const markers = signals.map((signal) => {
                // Determine if this is a long entry or short exit (green arrow below)
                const isLongEntry = signal.intention === 'BUY' || signal.intention === 'OPEN_LONG';
                const isShortExit = signal.intention === 'CLOSE_SHORT';

                return {
                    time: Math.floor(signal.timestamp.getTime() / 1000) as Time,
                    position: (isLongEntry || isShortExit) ? 'belowBar' as const : 'aboveBar' as const,
                    color: (isLongEntry || isShortExit) ? '#4ade80' : '#4ade80',
                    shape: (isLongEntry || isShortExit) ? 'arrowUp' as const : 'arrowDown' as const,
                    text: signal.intention.replace('_', ' '),
                };
            });

            createSeriesMarkers(candlestickSeries, markers);
        }

        // Handle resize
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
    }, [data, signals, indicators, showGrid, crosshairMode]);

    if (data.length === 0) {
        return (
            <div className="chart-placeholder">
                <p>No price data available</p>
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
                <label>
                    <input
                        type="checkbox"
                        checked={crosshairMode === 'magnet'}
                        onChange={(e) => setCrosshairMode(e.target.checked ? 'magnet' : 'normal')}
                    />
                    Magnet Mode
                </label>
                <span className="chart-hint">Scroll: Zoom | Drag: Pan | Shift+Drag: Price Scale</span>
            </div>
            <div ref={chartContainerRef} className="chart-container" />
        </div>
    );
}
