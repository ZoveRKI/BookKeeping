import { useEffect, useRef, useState, type FC } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CHECK_EXPENSE_TABLE_DATA_QUERY, GET_USER_EXISTING_TIME_QUERY, GET_DETAIL_TABLE_DATA_QUERY } from '../graphql/queries';
import { ADD_TIME_MUTATION } from '../graphql/mutations';
import ExpenseTable, { type ExpenseTableHandle } from '../components/organisms/ExpenseTable';
import ExpenseInsights from '../components/organisms/ExpenseInsights';
import CustomSelectBox from '../components/atoms/CustomSelectBox';
import ConfirmDialog from '../components/atoms/ConfirmDialog';
import Brand from '../components/atoms/Brand';
import Icon, { type IconName } from '../components/atoms/Icon';
import { LoadingAnimation } from '../components/organisms/LoadingAnimation';
import { DetailTable } from '../components/organisms/DetailTable';
import type { ExistingTime, ExpenseRow, MonthlySummary } from '../types/bookkeeping';

const navigation: { id: string; label: string; icon: IconName }[] = [
    { id: 'overview', label: '账本概览', icon: 'grid' },
    { id: 'records', label: '收支明细', icon: 'receipt' },
    { id: 'insights', label: '支出分析', icon: 'chart' },
];
const emptyRows: ExpenseRow[] = [];

const HomePage: FC = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState('');
    const [activeSection, setActiveSection] = useState('overview');
    const [hasDrafts, setHasDrafts] = useState(false);
    const [busy, setBusy] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const [monthError, setMonthError] = useState('');
    const tableRef = useRef<ExpenseTableHandle>(null);
    const { data: timeData, previousData: previousTimeData, loading: timeLoading, error: timeError, refetch: refetchTime } = useQuery<{ getUserExistingTime: { existingTime: ExistingTime[] } }>(GET_USER_EXISTING_TIME_QUERY, { fetchPolicy: 'network-only' });
    const months = (timeData ?? previousTimeData)?.getUserExistingTime?.existingTime ?? [];
    const current = months.find(item => item.year === currentYear && item.month === currentMonth);
    const selectedId = selectedValue || current?.yearMonthId || months[months.length - 1]?.yearMonthId || '';
    const selected = months.find(item => item.yearMonthId === selectedId);
    const year = selected?.year ?? currentYear;
    const month = selected?.month ?? currentMonth;
    const days = new Date(year, month, 0).getDate();
    const { data: expensesData, loading: expensesLoading, error: expensesError, refetch: refetchExpenses } = useQuery<{ checkExpenseTableData: { expenseTableData: ExpenseRow[] | null } }>(CHECK_EXPENSE_TABLE_DATA_QUERY, { skip: !selectedId, variables: { yearMonthId: selectedId }, fetchPolicy: 'no-cache' });
    const { data: summaryData, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useQuery<{ getDetailTableData: MonthlySummary }>(GET_DETAIL_TABLE_DATA_QUERY, { skip: !selectedId, variables: { yearMonthId: selectedId }, fetchPolicy: 'network-only' });
    const [addTime, { loading: addingMonth }] = useMutation<{ addTime: { isSuccess: boolean } }>(ADD_TIME_MUTATION);
    const loading = timeLoading || expensesLoading || summaryLoading;
    const error = timeError || expensesError || summaryError;
    const summary = summaryData?.getDetailTableData;
    const rows = expensesData?.checkExpenseTableData?.expenseTableData ?? emptyRows;

    useEffect(() => {
        if (!hasDrafts && !busy) return;
        const beforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener('beforeunload', beforeUnload);
        return () => window.removeEventListener('beforeunload', beforeUnload);
    }, [hasDrafts, busy]);

    const moveTo = (target: string) => {
        if (target === 'login') navigate('/');
        else { setSelectedValue(target); setHasDrafts(false); }
    };

    const requestNavigation = (target: string) => {
        if (busy) return;
        if (hasDrafts) setPendingNavigation(target);
        else moveTo(target);
    };

    const createMonth = async () => {
        setMonthError('');
        try {
            const result = await addTime({ variables: { input: { year: currentYear, month: currentMonth } } });
            if (!result.data?.addTime.isSuccess) throw new Error('create failed');
            const refreshed = await refetchTime();
            const created = refreshed.data.getUserExistingTime.existingTime.find(item => item.year === currentYear && item.month === currentMonth);
            if (created) requestNavigation(created.yearMonthId);
        } catch {
            setMonthError('本月账本创建失败，请稍后重试。');
        }
    };

    const renderNavigation = () => navigation.map(item => (
        <a key={item.id} className={`nav-link ${activeSection === item.id ? 'active' : ''}`} href={`#${item.id}`} aria-current={activeSection === item.id ? 'location' : undefined} onClick={() => setActiveSection(item.id)}>
            <Icon name={item.icon} size={18} /><span>{item.label}</span>{activeSection === item.id && <span className="nav-indicator" />}
        </a>
    ));

    return (
        <div className="app-shell">
            <a className="skip-link" href="#main-content">跳到主要内容</a>
            <aside className="sidebar">
                <Brand />
                <p className="nav-label">我的工作台</p>
                <nav className="sidebar-nav" aria-label="主导航">{renderNavigation()}</nav>
                <div className="sidebar-note"><Icon name="spark" size={22} /><h3>小小记录，慢慢积累</h3><p>每一笔日常，<br />都是认真生活的痕迹。</p></div>
                <div className="sidebar-bottom"><span className="avatar"><Icon name="user" size={16} /></span><span><strong>个人账本</strong><small>MY PERSONAL SPACE</small></span><button type="button" className="icon-button" title="切换账号" aria-label="切换账号" disabled={busy} onClick={() => requestNavigation('login')}><Icon name="exit" size={17} /></button></div>
            </aside>
            <div className="workspace">
                <header className="topbar">
                    <div className="breadcrumb"><Icon name="book" size={16} /><span>我的工作台</span><Icon name="chevron" size={12} /><strong>{navigation.find(item => item.id === activeSection)?.label}</strong></div>
                    <div className="mobile-brand"><Brand /></div>
                    <span className="topbar-date"><Icon name="calendar" size={16} />{today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
                </header>
                <main className="dashboard" id="main-content">
                    <section className="page-heading" id="overview">
                        <div><p className="eyebrow">A LITTLE EVERY DAY</p><h1>每一笔，都有迹可循<span className="heading-period">。</span></h1><p className="subtitle">{year} 年 {month} 月的生活账本，收好日常的每一个小细节。</p></div>
                        <div className="heading-actions">
                            <CustomSelectBox title="选择账本月份" menuItems={[...months].reverse().map(item => ({ value: item.yearMonthId, label: `${item.year} 年 ${item.month} 月` }))} selectedValue={selectedId} setSelectedValue={requestNavigation} disabled={loading || busy || addingMonth} />
                            <button type="button" className="button button-primary" disabled={!selectedId || loading || !!error || busy} onClick={() => { setActiveSection('records'); tableRef.current?.addEntry(); document.getElementById('records')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}><Icon name="plus" size={18} />记一笔</button>
                        </div>
                    </section>
                    {(error || monthError) && <div className="notice" role="alert"><Icon name="info" size={18} /><span>{monthError || '账本暂时无法加载，请重试，或重新登录。'} {error && <button type="button" className="text-button" onClick={() => requestNavigation('login')} disabled={busy}>重新登录</button>}</span><button type="button" className="button button-quiet" onClick={() => { setMonthError(''); void Promise.allSettled([refetchTime(), ...(selectedId ? [refetchExpenses(), refetchSummary()] : [])]); }}>重试</button></div>}
                    {!timeLoading && !timeError && !current && <section className="panel month-empty"><Icon name="calendar" size={30} /><h2>新月份，新的开始</h2><p>开启 {currentYear} 年 {currentMonth} 月的账本，让日常的每一笔支出都有归处。</p><button type="button" className="button button-primary" onClick={createMonth} disabled={addingMonth || busy || hasDrafts}>{addingMonth ? '正在创建…' : '开启本月账本'}</button></section>}
                    {loading && <LoadingAnimation />}
                    {selectedId && <div hidden={loading}>
                        {!summaryError && <DetailTable days={days} DetailTableData={{ elapsedDays: summary?.recordedDate ?? 0, totalMonthlyExpense: summary?.totalMonthlyExpense ?? null, averageDailyExpense: summary?.averageDailyExpense ?? null, predictTotalMonthlyExpense: summary?.predictTotalMonthlyExpense ?? null }} />}
                        {!expensesError && <ExpenseInsights rows={rows} days={days} month={month} />}
                        <ExpenseTable key={selectedId} ref={tableRef} yearMonthId={selectedId} year={year} month={month} totalDaysOfSelectedYearMonth={days} expenseTableData={expensesData?.checkExpenseTableData?.expenseTableData ?? (error ? undefined : emptyRows)} disabled={loading || !!error} onDirtyChange={setHasDrafts} onBusyChange={setBusy} onRefetch={() => Promise.all([refetchExpenses(), refetchSummary()])} />
                    </div>}
                    <footer className="dashboard-footer"><span><Icon name="book" size={13} />BookKeeping · 认真记录，从容生活</span><span>一点一滴，都是生活。 <button type="button" className="footer-account" onClick={() => requestNavigation('login')} disabled={busy}>切换账号</button></span></footer>
                </main>
            </div>
            <nav className="mobile-nav" aria-label="移动导航">{renderNavigation()}</nav>
            <ConfirmDialog open={pendingNavigation !== null} title="还有未保存的记录" confirmLabel="放弃修改并继续" onCancel={() => setPendingNavigation(null)} onConfirm={() => { if (pendingNavigation) moveTo(pendingNavigation); setPendingNavigation(null); }}>切换后，当前账本中尚未保存的修改将会丢失。可以先取消并保存记录。</ConfirmDialog>
        </div>
    );
};

export default HomePage;
