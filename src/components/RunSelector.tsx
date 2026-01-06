/**
 * Run selector component for choosing backtest runs
 */

import { useState } from 'react';

interface RunInfo {
    id: string;
    path: string;
    displayName: string;
}

interface RunSelectorProps {
    selectedRun: string;
    onRunChange: (runPath: string) => void;
}

// Available runs - in production, this could be fetched from an API
const AVAILABLE_RUNS: RunInfo[] = [
    {
        id: '20251224_162255',
        path: '/data/examples/runs/20251224_162255',
        displayName: '2025-12-24 16:22:55',
    },
    {
        id: '20251224_162746',
        path: '/data/examples/runs/20251224_162746',
        displayName: '2025-12-24 16:27:46',
    },
    {
        id: '20251224_163052',
        path: '/data/examples/runs/20251224_163052',
        displayName: '2025-12-24 16:30:52',
    },
    {
        id: '20251224_163247',
        path: '/data/examples/runs/20251224_163247',
        displayName: '2025-12-24 16:32:47',
    },
];

export function RunSelector({ selectedRun, onRunChange }: RunSelectorProps) {
    const [runs] = useState<RunInfo[]>(AVAILABLE_RUNS);

    return (
        <div className="run-selector">
            <label htmlFor="run-select">Select Run:</label>
            <select
                id="run-select"
                value={selectedRun}
                onChange={(e) => onRunChange(e.target.value)}
                className="run-select"
            >
                {runs.map((run) => (
                    <option key={run.id} value={run.path}>
                        {run.displayName}
                    </option>
                ))}
            </select>
        </div>
    );
}
