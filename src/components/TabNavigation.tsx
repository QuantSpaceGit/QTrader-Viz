/**
 * Tab navigation component
 */

import './TabNavigation.css';

export type TabId = 'overview' | 'trades' | 'drawdowns';

interface Tab {
    id: TabId;
    label: string;
    icon: string;
}

interface TabNavigationProps {
    activeTab: TabId;
    onTabChange: (tabId: TabId) => void;
}

const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'trades', label: 'Trades', icon: '💼' },
    { id: 'drawdowns', label: 'Drawdowns', icon: '📉' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
        <nav className="tab-navigation">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
