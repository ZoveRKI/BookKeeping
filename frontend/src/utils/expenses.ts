import type { ExpenseRow } from '../types/bookkeeping';

const amountFormatter = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const formatAmount = (value: number | null | undefined) =>
    value == null || !Number.isFinite(value) ? '—' : amountFormatter.format(value);

export const additionalTotal = (value: ExpenseRow['additionalExpense']) =>
    Array.isArray(value) ? value.reduce<number>((total, amount) => total + Number(amount), 0) : Number(value || 0);

export const rowTotal = (row: ExpenseRow) => Number(row.dailyExpense || 0) + additionalTotal(row.additionalExpense);
