import { useState, type FC } from 'react';
import Icon from '../atoms/Icon';
import type { ExpenseRow } from '../../types/bookkeeping';
import { additionalTotal, formatAmount, rowTotal } from '../../utils/expenses';
import './organismsCSS/ExpenseInsights.css';

interface ExpenseInsightsProps {
    rows: ExpenseRow[];
    days: number;
    month: number;
}

const ExpenseInsights: FC<ExpenseInsightsProps> = ({ rows, days, month }) => {
    const [mode, setMode] = useState<'total' | 'daily'>('total');
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);
    const recordedRows = rows.filter(row => row.dailyExpense != null && row.dailyExpense !== '');
    const daily = recordedRows.reduce((sum, row) => sum + Number(row.dailyExpense), 0);
    const extra = recordedRows.reduce((sum, row) => sum + additionalTotal(row.additionalExpense), 0);
    const total = daily + extra;
    const data = Array.from({ length: days }, (_, index) => {
        const row = recordedRows.find(item => item.date === index + 1);
        return { day: index + 1, amount: row ? mode === 'total' ? rowTotal(row) : Number(row.dailyExpense) : null };
    });
    const maximum = Math.max(1, ...data.map(item => item.amount ?? 0));
    const minimum = Math.min(0, ...data.map(item => item.amount ?? 0));
    const range = maximum - minimum;
    const x = (day: number) => 49 + ((day - 1) / Math.max(1, days - 1)) * 587;
    const y = (amount: number) => 171 - ((amount - minimum) / range) * 135;
    // Missing dates are gaps, rather than invented zero-expense observations.
    const segments: string[] = [];
    let currentSegment = '';
    data.forEach(item => {
        if (item.amount == null) {
            if (currentSegment) segments.push(currentSegment);
            currentSegment = '';
        } else {
            currentSegment += `${currentSegment ? ' L' : 'M'}${x(item.day)},${y(item.amount)}`;
        }
    });
    if (currentSegment) segments.push(currentSegment);
    const active = data.find(item => item.day === hoveredDay);
    const share = total > 0 && daily >= 0 && extra >= 0 ? daily / total * 100 : 0;
    const canShowShare = total > 0 && daily >= 0 && extra >= 0;
    const labels = [...new Set([1, Math.round(days / 4), Math.round(days / 2), Math.round(days * 3 / 4), days])];

    return (
        <section className="insights-grid" id="insights" aria-label="支出分析">
            <article className="panel trend-panel">
                <div className="panel-heading">
                    <div><h2>支出趋势</h2><p>{active?.amount != null ? `${month} 月 ${active.day} 日 · ${formatAmount(active.amount)}` : '看见每一天，也看见生活的节奏'}</p></div>
                    <div className="segmented-control" aria-label="趋势金额类型">
                        <button type="button" aria-pressed={mode === 'total'} onClick={() => setMode('total')}>总支出</button>
                        <button type="button" aria-pressed={mode === 'daily'} onClick={() => setMode('daily')}>日常</button>
                    </div>
                </div>
                <div className="trend-plot">
                    <svg viewBox="0 0 660 211" role="img" aria-label={`${month}月${mode === 'total' ? '总支出' : '日常支出'}趋势，已记录 ${recordedRows.length} 天，具体金额见下方收支明细`}>
                        {[0, 1, 2, 3].map(index => {
                            const value = minimum + range * index / 3;
                            return <g key={index}><line x1="49" x2="636" y1={y(value)} y2={y(value)} stroke="#e9ede5" strokeDasharray="3 5" /><text x="37" y={y(value) + 4} textAnchor="end" className="chart-label">{recordedRows.length ? new Intl.NumberFormat('zh-CN', { notation: 'compact', maximumFractionDigits: 1 }).format(value) : '—'}</text></g>;
                        })}
                        {labels.map(day => <text key={day} x={x(day)} y="201" textAnchor="middle" className="chart-label">{month}/{String(day).padStart(2, '0')}</text>)}
                        {segments.map((segment, index) => <path key={index} d={segment} stroke="#528865" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />)}
                        {data.filter(item => item.amount != null).map(item => (
                            <g key={item.day}>
                                <line x1={x(item.day)} x2={x(item.day)} y1={y(item.amount!)} y2={y(0)} stroke="#92b88a" strokeWidth="12" strokeOpacity={hoveredDay === item.day ? '.25' : '.10'} />
                                <circle cx={x(item.day)} cy={y(item.amount!)} r={hoveredDay === item.day ? 5 : 3} fill="#528865" stroke="white" strokeWidth="2" />
                            </g>
                        ))}
                    </svg>
                    <div className="chart-hit-targets" onMouseLeave={() => setHoveredDay(null)}>
                        {data.map(item => <button key={item.day} type="button" tabIndex={item.amount == null ? -1 : 0} aria-label={`${month}月${item.day}日：${item.amount == null ? '未记录' : formatAmount(item.amount)}`} onMouseEnter={() => setHoveredDay(item.day)} onFocus={() => setHoveredDay(item.day)} onBlur={() => setHoveredDay(null)} onClick={() => setHoveredDay(item.day)} />)}
                    </div>
                    {!recordedRows.length && <div className="chart-empty"><Icon name="chart" size={25} /><span>第一笔记录，会让趋势在这里生长</span></div>}
                </div>
                <div className="chart-footer"><span><i className="legend-dot" />{mode === 'total' ? '每日总支出' : '每日日常支出'}</span><span>空白日期为未记录</span></div>
            </article>
            <article className="panel breakdown-panel">
                <div className="panel-heading"><div><h2>支出构成</h2><p>日常与额外，分配一目了然</p></div><span className="subtle-icon"><Icon name="wallet" size={18} /></span></div>
                <div className="donut-wrap">
                    <div className="expense-donut" role="img" aria-label={canShowShare ? `日常支出占 ${share.toFixed(1)}%，额外支出占 ${(100 - share).toFixed(1)}%` : '暂无可展示的支出占比'} style={{ background: canShowShare ? `conic-gradient(#4d7f63 0% ${share}%, #d5e6af ${share}% 100%)` : '#edf0e8' }}>
                        <div className="donut-center"><span>支出合计</span><strong>{formatAmount(total)}</strong></div>
                    </div>
                </div>
                <div className="breakdown-legend">
                    <div><span><i className="legend-dot" />日常花销</span><strong>{formatAmount(daily)}</strong><small>{canShowShare ? `${Math.round(share)}%` : '—'}</small></div>
                    <div><span><i className="legend-dot extra" />额外花销</span><strong>{formatAmount(extra)}</strong><small>{canShowShare ? `${Math.round(100 - share)}%` : '—'}</small></div>
                </div>
            </article>
        </section>
    );
};

export default ExpenseInsights;
