import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import EditableCell from '../atoms/EditableCell';
import AddRowButton from '../atoms/AddRowButton';
import DeleteRowButton from '../atoms/DeleteRowButton';
import SaveRowButton from '../atoms/SaveRowButton';
import ConfirmDialog from '../atoms/ConfirmDialog';
import Icon from '../atoms/Icon';
import { SAVE_ROW_DATA_MUTATION, DELETE_ROW_DATA_MUTATION } from '../../graphql/mutations';
import type { ExpenseRow } from '../../types/bookkeeping';
import { additionalTotal, formatAmount, rowTotal } from '../../utils/expenses';
import './organismsCSS/ExpenseTable.css';

interface ExpenseTableProps {
    yearMonthId: string;
    year: number;
    month: number;
    totalDaysOfSelectedYearMonth: number;
    expenseTableData?: ExpenseRow[];
    disabled?: boolean;
    onRefetch: () => Promise<unknown>;
    onDirtyChange: (dirty: boolean) => void;
    onBusyChange: (busy: boolean) => void;
}

export interface ExpenseTableHandle {
    addEntry: () => void;
}

const ExpenseTable = forwardRef<ExpenseTableHandle, ExpenseTableProps>(function ExpenseTable({
    yearMonthId, year, month, totalDaysOfSelectedYearMonth: days, expenseTableData, disabled = false, onRefetch, onDirtyChange, onBusyChange,
}, ref) {
    const [rows, setRows] = useState<ExpenseRow[]>(expenseTableData ?? []);
    const [search, setSearch] = useState('');
    const [onlyDrafts, setOnlyDrafts] = useState(false);
    const [notice, setNotice] = useState<{ message: string; success: boolean } | null>(null);
    const [pendingDay, setPendingDay] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
    const [focusDay, setFocusDay] = useState<number | null>(null);
    const draftDates = useRef(new Set<number>());
    const busyRef = useRef(false);
    const [saveRowData] = useMutation<{ saveRowData: { isSuccess: boolean } }>(SAVE_ROW_DATA_MUTATION);
    const [deleteRowData] = useMutation<{ deleteRowData: { isSuccess: boolean } }>(DELETE_ROW_DATA_MUTATION);
    const today = new Date();
    const todayDate = today.getDate();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

    useEffect(() => {
        if (!expenseTableData) return;
        setRows(previous => {
            const merged = new Map(expenseTableData.map(row => [row.date, row]));
            // A server refresh must not discard other rows that are still being edited.
            previous.filter(row => row.isEdited || draftDates.current.has(row.date)).forEach(row => merged.set(row.date, row));
            return [...merged.values()].sort((a, b) => a.date - b.date);
        });
    }, [expenseTableData]);

    const dirtyCount = rows.filter(row => row.isEdited).length;
    useEffect(() => { onDirtyChange(dirtyCount > 0); }, [dirtyCount, onDirtyChange]);
    useEffect(() => {
        if (focusDay === null) return;
        document.getElementById(`expense-row-${focusDay}`)?.scrollIntoView({ block: 'nearest' });
        document.querySelector<HTMLButtonElement>(`#expense-row-${focusDay} .editable-cell`)?.focus({ preventScroll: true });
        setFocusDay(null);
    }, [focusDay]);

    const addEntry = useCallback((forceToday = false) => {
        if (busyRef.current || disabled) return;
        const existing = new Set(rows.map(row => row.date));
        if (forceToday && (!isCurrentMonth || existing.has(todayDate))) return;
        const date = isCurrentMonth && !existing.has(todayDate) ? todayDate : Array.from({ length: days }, (_, index) => index + 1).find(day => !existing.has(day));
        if (!date) {
            setNotice({ message: '这个月的每一天都已有记录，可以直接点击金额进行修改。', success: true });
            return;
        }
        draftDates.current.add(date);
        setRows(previous => [...previous, { date, dailyExpense: '', additionalExpense: '', isEdited: true }].sort((a, b) => a.date - b.date));
        setSearch('');
        setOnlyDrafts(false);
        setNotice(null);
        setFocusDay(date);
    }, [rows, days, isCurrentMonth, todayDate, disabled]);

    useImperativeHandle(ref, () => ({ addEntry: () => addEntry() }), [addEntry]);

    const updateRow = (date: number, key: 'dailyExpense' | 'additionalExpense', value: string) => {
        setRows(previous => previous.map(row => row.date === date && String(row[key] ?? '') !== value ? { ...row, [key]: value, isEdited: true } : row));
        setNotice(null);
    };

    const setBusy = (date: number | null) => {
        busyRef.current = date !== null;
        setPendingDay(date);
        onBusyChange(date !== null);
    };

    const refreshAfterMutation = async (message: string) => {
        try {
            await onRefetch();
            setNotice({ message, success: true });
        } catch {
            setNotice({ message: `${message}，但统计刷新失败，请稍后刷新页面。`, success: false });
        }
    };

    const saveRow = async (row: ExpenseRow) => {
        if (busyRef.current) return;
        const daily = Number(row.dailyExpense);
        const additional = additionalTotal(row.additionalExpense);
        if (String(row.dailyExpense ?? '').trim() === '') {
            setNotice({ message: '请先填写日常花销；当天没有花销可以填写 0。', success: false });
            return;
        }
        if (!Number.isFinite(daily) || !Number.isFinite(additional) || additional < 0 || (Array.isArray(row.additionalExpense) && row.additionalExpense.length > 1)) {
            setNotice({ message: '请填写有效金额，额外花销须为一个不小于 0 的数值。', success: false });
            return;
        }
        setBusy(row.date);
        setNotice(null);
        try {
            const result = await saveRowData({ variables: { input: { yearMonthId, date: row.date, dailyExpense: daily, additionalExpense: additional } } });
            if (!result.data?.saveRowData.isSuccess) throw new Error('save failed');
            draftDates.current.delete(row.date);
            setRows(previous => previous.map(item => item.date === row.date ? { ...item, isEdited: false } : item));
            await refreshAfterMutation(`${month} 月 ${row.date} 日的记录已保存`);
        } catch {
            setNotice({ message: '保存失败，修改已保留，请检查连接后重试。', success: false });
        } finally {
            setBusy(null);
        }
    };

    const requestDelete = (date: number) => {
        if (draftDates.current.has(date)) {
            draftDates.current.delete(date);
            setRows(previous => previous.filter(row => row.date !== date));
        } else {
            setDeleteTarget(date);
        }
    };

    const deleteRow = async () => {
        if (deleteTarget === null || busyRef.current) return;
        const date = deleteTarget;
        setDeleteTarget(null);
        setBusy(date);
        setNotice(null);
        try {
            const result = await deleteRowData({ variables: { input: { yearMonthId, date } } });
            if (!result.data?.deleteRowData.isSuccess) throw new Error('delete failed');
            setRows(previous => previous.filter(row => row.date !== date));
            await refreshAfterMutation(`${month} 月 ${date} 日的记录已删除`);
        } catch {
            setNotice({ message: '删除失败，原记录已保留，请稍后重试。', success: false });
        } finally {
            setBusy(null);
        }
    };

    const filteredRows = rows.filter(row => {
        const query = search.trim();
        const date = `${year}-${String(month).padStart(2, '0')}-${String(row.date).padStart(2, '0')}`;
        return (!onlyDrafts || row.isEdited) && (!query || [date, `${month}月${row.date}日`, String(row.dailyExpense ?? ''), String(additionalTotal(row.additionalExpense)), String(rowTotal(row))].some(value => value.includes(query)));
    });
    const total = filteredRows.reduce((sum, row) => sum + rowTotal(row), 0);
    const busy = pendingDay !== null || disabled;

    return (
        <section className="panel expense-panel" id="records" aria-labelledby="records-title" aria-busy={pendingDay !== null}>
            <div className="expense-heading">
                <div className="panel-heading"><div><h2 id="records-title">收支明细 <span className="count-badge">{rows.length}</span></h2><p>把生活记清楚，把日子过明白。</p></div></div>
                <div className="expense-toolbar">
                    <label className="search-field"><Icon name="search" size={16} /><span className="sr-only">搜索日期或金额</span><input type="search" placeholder="搜索日期或金额" value={search} onChange={event => setSearch(event.target.value)} /></label>
                    <AddRowButton disabled={rows.length >= days || busy} onClick={() => addEntry()} />
                </div>
            </div>
            <div className="table-filterbar">
                <div className="table-tabs" aria-label="记录筛选">
                    <button type="button" className={!onlyDrafts ? 'active' : ''} aria-pressed={!onlyDrafts} onClick={() => setOnlyDrafts(false)}>全部记录</button>
                    <button type="button" className={onlyDrafts ? 'active' : ''} aria-pressed={onlyDrafts} onClick={() => setOnlyDrafts(true)}>待保存{dirtyCount > 0 && <span>{dirtyCount}</span>}</button>
                </div>
                <span className="edit-hint"><Icon name="edit" size={13} />点击金额即可编辑</span>
            </div>
            {notice && <div className={`notice table-notice ${notice.success ? 'success' : ''}`} role={notice.success ? 'status' : 'alert'}><Icon name={notice.success ? 'check' : 'info'} size={17} /><span>{notice.message}</span><button type="button" className="icon-button" aria-label="关闭提示" onClick={() => setNotice(null)}><Icon name="close" size={15} /></button></div>}
            {filteredRows.length ? <div className="table-scroll"><table className="expense-table" role="table">
                <caption className="sr-only">{year} 年 {month} 月花销记录</caption>
                <thead><tr><th scope="col">日期</th><th scope="col">日常花销</th><th scope="col">额外花销</th><th scope="col">当日合计</th><th scope="col">状态</th><th scope="col" className="actions-heading">操作</th></tr></thead>
                <tbody>{filteredRows.map(row => (
                    <tr key={row.date} id={`expense-row-${row.date}`} className={row.isEdited ? 'edited-row' : ''}>
                        <td className="date-cell">
                            <span className={`date-tile ${isCurrentMonth && row.date === todayDate ? 'today' : ''}`}>{String(row.date).padStart(2, '0')}</span>
                            <div>{draftDates.current.has(row.date) ? <select className="draft-date-select" aria-label="新记录日期" value={row.date} disabled={busy} onChange={event => {
                                const newDate = Number(event.target.value);
                                draftDates.current.delete(row.date);
                                draftDates.current.add(newDate);
                                setRows(previous => previous.map(item => item.date === row.date ? { ...item, date: newDate } : item).sort((a, b) => a.date - b.date));
                            }}>{Array.from({ length: days }, (_, index) => index + 1).filter(date => date === row.date || !rows.some(item => item.date === date)).map(date => <option value={date} key={date}>{month} 月 {date} 日</option>)}</select> : <strong>{month} 月 {row.date} 日</strong>}
                            <small>{isCurrentMonth && row.date === todayDate ? '今天' : new Date(year, month - 1, row.date).toLocaleDateString('zh-CN', { weekday: 'long' })}</small></div>
                        </td>
                        <td data-label="日常花销"><EditableCell initialValue={String(row.dailyExpense ?? '')} label={`${month}月${row.date}日日常花销`} onSave={value => updateRow(row.date, 'dailyExpense', value)} disabled={busy} /></td>
                        <td data-label="额外花销"><EditableCell initialValue={Array.isArray(row.additionalExpense) ? String(additionalTotal(row.additionalExpense)) : String(row.additionalExpense ?? '')} label={`${month}月${row.date}日额外花销`} onSave={value => updateRow(row.date, 'additionalExpense', value)} disabled={busy} /></td>
                        <td data-label="当日合计" className="row-total">{formatAmount(rowTotal(row))}</td>
                        <td className="status-cell"><span className={`status-pill ${row.isEdited ? 'draft' : ''}`}>{pendingDay === row.date ? <><span className="spinner" />处理中</> : row.isEdited ? <><span className="status-dot" />待保存</> : <><Icon name="check" size={12} />已记录</>}</span></td>
                        <td className="row-actions">{row.isEdited && <SaveRowButton aria-label={`保存${month}月${row.date}日记录`} disabled={busy} onClick={() => void saveRow(row)} />}<DeleteRowButton aria-label={`${draftDates.current.has(row.date) ? '移除未保存的' : '删除'}${month}月${row.date}日记录`} disabled={busy} onClick={() => requestDelete(row.date)} /></td>
                    </tr>
                ))}</tbody>
            </table></div> : <div className="table-empty">
                <span className="empty-illustration"><Icon name={search ? 'search' : onlyDrafts ? 'check' : 'receipt'} size={31} /></span>
                <h3>{search ? '没有找到相符的记录' : onlyDrafts ? '所有修改都已保存' : '这个月的故事，等你写下第一笔'}</h3>
                <p>{search ? '试试其他日期或金额，或者清空搜索。' : onlyDrafts ? '继续认真生活，下一笔也会被好好记录。' : '一顿午餐、一杯咖啡，从一笔小小的日常开始。'}</p>
                {search || onlyDrafts ? <button type="button" className="button button-secondary" onClick={() => { setSearch(''); setOnlyDrafts(false); }}>查看全部记录</button> : <AddRowButton className="button button-primary" disabled={busy} onClick={() => addEntry()}>记下第一笔</AddRowButton>}
            </div>}
            <div className="table-footer"><span>共 <strong>{filteredRows.length}</strong> 条记录{filteredRows.length > 0 && <> · 当前列表合计 <strong>{formatAmount(total)}</strong></>}</span>
                {isCurrentMonth && <button type="button" className="button button-quiet" disabled={busy || rows.some(row => row.date === todayDate)} onClick={() => addEntry(true)}><Icon name="plus" size={15} />{rows.some(row => row.date === todayDate) ? '今天已有记录' : '记今天'}</button>}
            </div>
            <ConfirmDialog open={deleteTarget !== null} title="删除这条记录？" confirmLabel="确认删除" destructive onCancel={() => setDeleteTarget(null)} onConfirm={() => void deleteRow()}>将删除 {month} 月 {deleteTarget} 日的日常与额外花销，月度统计会随之更新。此操作无法撤销。</ConfirmDialog>
        </section>
    );
});

export default ExpenseTable;
