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
    const legendRef = useRef<HTMLDivElement>(null);
    const [showGrid, setShowGrid] = useState(true);
    const [crosshairMode, setCrosshairMode] = useState<'normal' | 'magnet'>('normal');

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
            height: 600,
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
                rightOffset: 20,
                barSpacing: 3,
                fixLeftEdge: false,
                fixRightEdge: false,
            },
            rightPriceScale: {
                borderColor: '#2b2b43',
                scaleMargins: {
                    top: 0.012,      // 1.2% margin above highest price
                    bottom: 0.05,    // Small margin to show down to ~90% of lowest price
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

        // Format and deduplicate candlestick data
        const candleDataMap = new Map<number, { open: number; high: number; low: number; close: number }>();
        data.forEach((bar) => {
            const time = Math.floor(bar.timestamp.getTime() / 1000);
            candleDataMap.set(time, {
                open: bar.open,
                high: bar.high,
                low: bar.low,
                close: bar.close,
            });
        });

        const candleData = Array.from(candleDataMap.entries())
            .map(([time, ohlc]) => ({ time: time as Time, ...ohlc }))
            .sort((a, b) => (a.time as number) - (b.time as number));

        candlestickSeries.setData(candleData);

        // Add indicator lines
        const indicatorColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        indicators.forEach((indicator, index) => {
            const lineSeries = chart.addSeries(LineSeries, {
                color: indicatorColors[index % indicatorColors.length],
                lineWidth: 2,
                title: indicator.name,
            });

            // Deduplicate and sort indicator data
            const lineDataMap = new Map<number, number>();
            indicator.data.forEach((point) => {
                const time = Math.floor(point.timestamp.getTime() / 1000);
                lineDataMap.set(time, point.value);
            });

            const lineData = Array.from(lineDataMap.entries())
                .map(([time, value]) => ({ time: time as Time, value }))
                .sort((a, b) => (a.time as number) - (b.time as number));

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

        // Subscribe to crosshair move to update legend
        chart.subscribeCrosshairMove((param) => {
            if (!legendRef.current) return;

            if (!param.time || !param.seriesData.size) {
                legendRef.current.innerHTML = '<span style="color: #888;">Hover over chart to see values</span>';
                return;
            }

            const candleData = param.seriesData.get(candlestickSeries) as { open: number; high: number; low: number; close: number } | undefined;

            let legendHTML = '';

            // OHLCV Data
            if (candleData) {
                const dateStr = new Date((param.time as number) * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                legendHTML += `<div style="margin-bottom: 8px; color: #fff; font-weight: 600;">${dateStr}</div>`;
                legendHTML += `<div style="display: flex; gap: 16px; flex-wrap: wrap;">`;
                legendHTML += `<span><strong style="color: #888;">O:</strong> ${candleData.open?.toFixed(2)}</span>`;
                legendHTML += `<span><strong style="color: #888;">H:</strong> ${candleData.high?.toFixed(2)}</span>`;
                legendHTML += `<span><strong style="color: #888;">L:</strong> ${candleData.low?.toFixed(2)}</span>`;
                legendHTML += `<span><strong style="color: #888;">C:</strong> ${candleData.close?.toFixed(2)}</span>`;
                legendHTML += `</div>`;
            }

            // Indicator values
            if (indicators.length > 0) {
                legendHTML += `<div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px;">`;
                indicators.forEach((indicator, index) => {
                    const indicatorSeries = Array.from(param.seriesData.keys())[index + 1];
                    const indicatorValue = param.seriesData.get(indicatorSeries) as { value: number } | undefined;
                    if (indicatorValue?.value !== undefined) {
                        const color = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][index % 6];
                        legendHTML += `<span><strong style="color: ${color};">${indicator.name}:</strong> ${indicatorValue.value.toFixed(2)}</span>`;
                    }
                });
                legendHTML += `</div>`;
            }

            // Signal at this time
            const currentSignal = signals.find(s =>
                Math.floor(s.timestamp.getTime() / 1000) === param.time
            );
            if (currentSignal) {
                const signalColor = (currentSignal.intention === 'BUY' || currentSignal.intention === 'OPEN_LONG') ? '#4ade80' : '#f87171';
                legendHTML += `<div style="margin-top: 8px; padding: 4px 8px; background: rgba(${currentSignal.intention.includes('LONG') ? '74, 222, 128' : '248, 113, 113'}, 0.2); border-radius: 4px; display: inline-block;">`;
                legendHTML += `<strong style="color: ${signalColor};">SIGNAL: ${currentSignal.intention.replace('_', ' ')}</strong>`;
                if (currentSignal.reason) {
                    legendHTML += ` <span style="color: #888;">(${currentSignal.reason})</span>`;
                }
                legendHTML += `</div>`;
            }

            legendRef.current.innerHTML = legendHTML;
        });

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

    if (!data || data.length === 0) {
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
            <div ref={legendRef} className="chart-legend">
                <span style={{ color: '#888' }}>Hover over chart to see values</span>
            </div>
        </div>
    );
}
