export interface ExistingTime {
    yearMonthId: string;
    year: number;
    month: number;
}

export interface ExpenseRow {
    date: number;
    dailyExpense: string | number | null;
    additionalExpense: string | number | (string | number)[] | null;
    isEdited: boolean;
}

export interface MonthlySummary {
    recordedDate: number;
    totalMonthlyExpense: number | null;
    averageDailyExpense: number | null;
    predictTotalMonthlyExpense: number | null;
}
