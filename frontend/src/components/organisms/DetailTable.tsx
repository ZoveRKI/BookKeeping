import type { FC } from 'react';
import Icon from '../atoms/Icon';
import { formatAmount } from '../../utils/expenses';
import './organismsCSS/DetailTable.css';

interface DetailTableProps {
    DetailTableData: DetailTableDataProps | null;
    days?: number;
}

export interface DetailTableDataProps {
    elapsedDays: number;
    averageDailyExpense: number | null;
    totalMonthlyExpense: number | null;
    predictTotalMonthlyExpense: number | null;
}

export const DetailTable: FC<DetailTableProps> = ({ DetailTableData: data, days = 30 }) => {
    const recorded = data?.elapsedDays ?? 0;
    return (
        <section className="summary-grid" aria-label="本月统计">
            <article className="summary-card featured">
                <div className="summary-label"><span>本月总支出</span><Icon name="wallet" size={18} /></div>
                <strong className="summary-number">{formatAmount(data?.totalMonthlyExpense ?? 0)}</strong>
                <div className="summary-foot"><span className="tiny-dot" />日常花销 + 额外花销</div>
                <svg className="summary-spark" viewBox="0 0 110 36" aria-hidden="true"><circle cx="91" cy="37" r="29" fill="none" stroke="currentColor" /><circle cx="91" cy="37" r="41" fill="none" stroke="currentColor" /><circle cx="91" cy="37" r="53" fill="none" stroke="currentColor" /></svg>
            </article>
            <article className="summary-card">
                <div className="summary-label"><span>平均每日支出</span><span className="metric-icon"><Icon name="chart" size={17} /></span></div>
                <strong className="summary-number">{formatAmount(data?.averageDailyExpense ?? 0)}</strong>
                <div className="summary-foot">按已记录的 {recorded} 天计算</div>
            </article>
            <article className="summary-card">
                <div className="summary-label"><span>预计本月支出</span><span className="metric-icon sand"><Icon name="trend" size={17} /></span></div>
                <strong className="summary-number">{formatAmount(data?.predictTotalMonthlyExpense ?? 0)}</strong>
                <div className="summary-foot">按当前日均推算 · 仅供参考</div>
            </article>
            <article className="summary-card">
                <div className="summary-label"><span>本月已记录</span><span className="metric-icon lavender"><Icon name="calendar" size={17} /></span></div>
                <strong className="summary-number">{recorded}<span className="number-unit"> / {days} 天</span></strong>
                <div className="record-progress" role="progressbar" aria-label="本月记录进度" aria-valuenow={recorded} aria-valuemin={0} aria-valuemax={days}><span style={{ width: `${Math.min(100, recorded / days * 100)}%` }} /></div>
            </article>
        </section>
    );
};
