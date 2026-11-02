import { useState } from 'react';

const models = [
  {
    name: 'Demand Forecast v2',
    type: 'XGBoost · Retail demand',
    confidence: '94.2%',
    accuracy: '96.8%',
    error: '18.4',
    volume: '12,480',
    change: '+8.6%',
    history: [38, 42, 40, 48, 46, 54, 51, 58, 55, 62, 60, 67, 63, 72, 69],
    forecast: [74, 77, 75, 84],
    predictions: [
      { date: 'Jun 16, 2025', item: 'Wireless headphones', value: '1,284 units', confidence: '96%' },
      { date: 'Jun 16, 2025', item: 'Smart home devices', value: '946 units', confidence: '93%' },
      { date: 'Jun 17, 2025', item: 'Audio accessories', value: '782 units', confidence: '91%' },
    ],
  },
  {
    name: 'Revenue Predictor',
    type: 'Prophet · Revenue',
    confidence: '91.6%',
    accuracy: '94.3%',
    error: '24.7',
    volume: '$284.6k',
    change: '+5.2%',
    history: [35, 39, 43, 40, 48, 45, 54, 53, 58, 55, 64, 61, 68, 66, 74],
    forecast: [75, 79, 81, 87],
    predictions: [
      { date: 'Jun 16, 2025', item: 'North America ARR', value: '$284.6k', confidence: '95%' },
      { date: 'Jun 16, 2025', item: 'Enterprise renewals', value: '$96.2k', confidence: '92%' },
      { date: 'Jun 17, 2025', item: 'New subscriptions', value: '$41.8k', confidence: '90%' },
    ],
  },
  {
    name: 'Traffic Estimator',
    type: 'LSTM · Web traffic',
    confidence: '88.9%',
    accuracy: '92.1%',
    error: '31.2',
    volume: '48,920',
    change: '+12.4%',
    history: [42, 48, 44, 53, 49, 56, 61, 57, 64, 62, 69, 66, 76, 72, 79],
    forecast: [82, 78, 88, 91],
    predictions: [
      { date: 'Jun 16, 2025', item: 'Organic sessions', value: '48,920 visits', confidence: '93%' },
      { date: 'Jun 16, 2025', item: 'Paid campaign traffic', value: '18,340 visits', confidence: '90%' },
      { date: 'Jun 17, 2025', item: 'Returning visitors', value: '12,780 visits', confidence: '88%' },
    ],
  },
];

const ranges = [
  { label: '7D', points: 7 },
  { label: '30D', points: 10 },
  { label: '90D', points: 15 },
];

function Icon({ name, size = 18 }) {
  const paths = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    models: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    sources: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" /></>,
    alerts: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function ForecastChart({ model, pointCount }) {
  const history = model.history.slice(-pointCount);
  const series = [...history, ...model.forecast];
  const min = Math.floor((Math.min(...series) - 8) / 10) * 10;
  const max = Math.ceil((Math.max(...series) + 8) / 10) * 10;
  const chart = { left: 52, right: 744, top: 20, bottom: 230 };
  const x = (index) => chart.left + (index / (series.length - 1)) * (chart.right - chart.left);
  const y = (value) => chart.bottom - ((value - min) / (max - min)) * (chart.bottom - chart.top);
  const line = (values, startIndex = 0) =>
    values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(startIndex + index)} ${y(value)}`).join(' ');
  const historyPath = line(history);
  const forecastValues = [history.at(-1), ...model.forecast];
  const forecastPath = line(forecastValues, history.length - 1);
  const areaPath = `${forecastPath} L ${x(series.length - 1)} ${chart.bottom} L ${x(history.length - 1)} ${chart.bottom} Z`;
  const gridValues = Array.from({ length: 5 }, (_, index) => min + ((max - min) / 4) * index);
  const labels = ['May 19', 'May 26', 'Jun 2', 'Jun 9', 'Jun 16'];

  return (
    <svg
      className="forecast-chart"
      viewBox="0 0 760 270"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Historical and forecasted ${model.type.split('·')[1].trim().toLowerCase()} values`}
    >
      <defs>
        <linearGradient id="forecast-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7467f0" stopOpacity=".16" />
          <stop offset="100%" stopColor="#7467f0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridValues.map((value) => (
        <g key={value}>
          <line x1={chart.left} x2={chart.right} y1={y(value)} y2={y(value)} className="chart-grid" />
          <text x="0" y={y(value) + 4} className="chart-axis-label">{Math.round(value)}k</text>
        </g>
      ))}
      <path d={areaPath} fill="url(#forecast-fill)" />
      <path d={historyPath} className="chart-history-line" />
      <path d={forecastPath} className="chart-forecast-line" />
      <circle cx={x(history.length - 1)} cy={y(history.at(-1))} r="4" className="chart-point chart-point-history" />
      <circle cx={x(series.length - 1)} cy={y(series.at(-1))} r="4.5" className="chart-point chart-point-forecast" />
      {labels.map((label, index) => (
        <text
          key={label}
          x={chart.left + (index / (labels.length - 1)) * (chart.right - chart.left)}
          y="258"
          textAnchor={index === 0 ? 'start' : index === labels.length - 1 ? 'end' : 'middle'}
          className="chart-axis-label"
        >
          {label}
        </text>
      ))}
      <text x={x(history.length - 1) + 10} y="14" className="chart-forecast-label">FORECAST</text>
    </svg>
  );
}

function App() {
  const [selectedModel, setSelectedModel] = useState(models[0].name);
  const [selectedRange, setSelectedRange] = useState('30D');
  const model = models.find((item) => item.name === selectedModel);
  const pointCount = ranges.find((range) => range.label === selectedRange).points;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Northstar home">
          <span className="brand-mark"><span /></span>
          <span>northstar<span className="brand-dot">.</span></span>
        </a>

        <div className="workspace-switcher">
          <div className="workspace-avatar">A</div>
          <div className="workspace-copy">
            <span className="workspace-name">Acme Analytics</span>
            <span className="workspace-plan">Pro workspace</span>
          </div>
          <Icon name="chevron" size={16} />
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#overview" aria-current="page"><Icon name="overview" />Overview</a>
          <a className="nav-link" href="#models"><Icon name="models" />Models<span className="nav-count">8</span></a>
          <a className="nav-link" href="#data-sources"><Icon name="sources" />Data sources</a>
          <a className="nav-link" href="#alerts"><Icon name="alerts" />Alerts<span className="alert-dot" /></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="usage-card">
            <div className="usage-heading"><span>Monthly predictions</span><span>72%</span></div>
            <div className="usage-track"><span /></div>
            <div className="usage-caption">72k of 100k predictions</div>
          </div>
          <a className="nav-link settings-link" href="#settings"><Icon name="settings" />Settings</a>
          <div className="profile">
            <div className="profile-avatar">JD</div>
            <div className="profile-copy"><strong>Jordan Davis</strong><span>jordan@acme.co</span></div>
            <Icon name="chevron" size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <button className="icon-button search-button" aria-label="Search"><Icon name="search" /></button>
            <button className="date-button"><Icon name="calendar" size={16} /><span>Jun 2 – Jun 16, 2025</span><Icon name="chevron" size={15} /></button>
            <button className="help-button">?</button>
          </div>
        </header>

        <section className="dashboard">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="live-dot" />LIVE MODEL MONITORING</div>
              <h1>Forecast overview</h1>
              <p>Track model performance and explore what’s ahead.</p>
            </div>
            <button className="export-button"><Icon name="arrow" size={16} />Export report</button>
          </div>

          <section className="metric-grid" aria-label="Forecast summary">
            <article className="metric-card">
              <div className="metric-label">Forecasted volume <span className="metric-icon purple"><Icon name="arrow" size={16} /></span></div>
              <div className="metric-value">{model.volume}</div>
              <div className="metric-foot"><span className="positive-change"><Icon name="arrow" size={13} />{model.change}</span><span>vs. previous period</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-label">Model accuracy <span className="metric-icon green"><Icon name="check" size={16} /></span></div>
              <div className="metric-value">{model.accuracy}</div>
              <div className="metric-foot"><span className="positive-change">+2.4%</span><span>vs. previous period</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-label">Mean absolute error <span className="metric-icon orange">±</span></div>
              <div className="metric-value">{model.error}<span className="metric-unit"> units</span></div>
              <div className="metric-foot"><span className="positive-change">−4.1%</span><span>vs. previous period</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-label">Forecast confidence <span className="metric-icon blue"><span className="confidence-dot" /></span></div>
              <div className="metric-value">{model.confidence}</div>
              <div className="metric-foot"><span className="confidence-tag"><span />High confidence</span></div>
            </article>
          </section>

          <section className="panel forecast-panel" aria-labelledby="forecast-title">
            <div className="panel-heading">
              <div>
                <h2 id="forecast-title">Forecast performance</h2>
                <p>Historical values compared with model predictions</p>
              </div>
              <label className="model-select-wrap">
                <span className="sr-only">Select forecast model</span>
                <select value={selectedModel} onChange={(event) => setSelectedModel(event.target.value)}>
                  {models.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
                <Icon name="chevron" size={15} />
              </label>
            </div>
            <div className="chart-subheading">
              <span className="chart-model-name"><span className="model-status" />{model.name}<span className="model-type">{model.type}</span></span>
              <div className="range-switch" role="group" aria-label="Chart time range">
                {ranges.map((range) => (
                  <button
                    key={range.label}
                    className={selectedRange === range.label ? 'selected' : ''}
                    aria-pressed={selectedRange === range.label}
                    onClick={() => setSelectedRange(range.label)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-wrap"><ForecastChart model={model} pointCount={pointCount} /></div>
            <div className="chart-legend">
              <span><i className="legend-line actual-line" />Actual</span>
              <span><i className="legend-line forecast-line" />Forecast</span>
              <span><i className="legend-band" />Forecast region</span>
              <span className="chart-updated">Updated 2 minutes ago</span>
            </div>
          </section>

          <section className="lower-grid">
            <article className="panel activity-panel">
              <div className="panel-heading lower-panel-heading">
                <div><h2>Upcoming predictions</h2><p>Latest forecast outputs from this model</p></div>
                <a className="text-link" href="#all-predictions">View all <span>→</span></a>
              </div>
              <div className="table-scroll">
                <table>
                  <thead><tr><th>DATE</th><th>ITEM</th><th>FORECAST</th><th>CONFIDENCE</th></tr></thead>
                  <tbody>
                    {model.predictions.map((forecast) => (
                      <tr key={forecast.item}>
                        <td>{forecast.date}</td>
                        <td className="item-cell"><span className="item-avatar">{forecast.item.slice(0, 1)}</span>{forecast.item}</td>
                        <td className="forecast-value">{forecast.value}</td>
                        <td><span className="table-confidence">{forecast.confidence}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="panel model-health-panel">
              <div className="panel-heading lower-panel-heading">
                <div><h2>Model health</h2><p>Current deployment status</p></div>
                <button className="more-button" aria-label="More model health options">···</button>
              </div>
              <div className="health-model">
                <div className="health-model-icon"><Icon name="models" size={19} /></div>
                <div className="health-model-copy"><strong>{model.name}</strong><span>{model.type}</span></div>
                <span className="healthy-badge"><span />Healthy</span>
              </div>
              <div className="health-stats">
                <div><span>Last trained</span><strong>May 28, 2025</strong></div>
                <div><span>Data freshness</span><strong><span className="fresh-dot" />12 min ago</strong></div>
              </div>
              <a className="model-details-link" href="#model-details">View model details <span>→</span></a>
            </article>
          </section>
          <footer className="dashboard-footer"><span>© 2025 Northstar Analytics</span><span>All systems operational <i /></span></footer>
        </section>
      </main>
    </div>
  );
}

export default App;
