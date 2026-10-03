import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    CHECK_EXPENSE_TABLE_DATA_QUERY,
    GET_USER_EXISTING_TIME_QUERY,
    GET_DETAIL_TABLE_DATA_QUERY
} from "../graphql/queries";
import { ADD_TIME_MUTATION } from '../graphql/mutations';
import ExpenseTable from '../components/organisms/ExpenseTable';
import CustomSelectBox from '../components/atoms/CustomSelectBox';
import { LoadingAnimation } from '../components/organisms/LoadingAnimation';
import { DetailTable, DetailTableDataProps } from '../components/organisms/DetailTable';
import Button from '../components/atoms/Button';
import './HomePage.css';

interface ExistingTime {
    yearMonthId: string;
    year: number;
    month: number;
}

interface CurrentYearMonth {
    isCurrentYearMonthExists: boolean;
    currentYearMonthId: string | null;
}

interface DateSelectBoxItems {
    value: string;
    label: string;
}

interface DetailTableData {
    recordedDate: number;
    totalMonthlyExpense: number;
    averageDailyExpense: number;
    predictTotalMonthlyExpense: number;
}

export interface ExpenseTableRowProps {
    date: number; // 日期 (1-31)
    dailyExpense: string | number; // 日常花销
    additionalExpense: string | number | []; // 额外花销
    isEdited: boolean; // 是否已修改
}

interface ExpenseTableData {
    hasData: boolean;
    expenseTableData: ExpenseTableRowProps[] | null;
}

interface LoadedMonth {
    yearMonthId: string;
    title: string;
    days: number;
    details: DetailTableData;
    rows: ExpenseTableRowProps[] | null;
}

const HomePage: React.FC = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [loadedMonth, setLoadedMonth] = useState<LoadedMonth | null>(null);

    // 获取用户已有的时间数据
    const { data: existingTimeData, loading: existingTimeDataLoading, error: existingTimeError, refetch: refetchExistingTime } = useQuery(GET_USER_EXISTING_TIME_QUERY);

    const getUserExistingTimeData: ExistingTime[] | undefined = existingTimeData?.getUserExistingTime.existingTime

    const isCurrentYearMonthExists: ExistingTime | undefined = getUserExistingTimeData?.find(
        (item: ExistingTime) => item.year === year && item.month === month
    )

    const currentYearMonth: CurrentYearMonth = isCurrentYearMonthExists
        ? {
            isCurrentYearMonthExists: true,
            currentYearMonthId: isCurrentYearMonthExists.yearMonthId
        } : {
            isCurrentYearMonthExists: false,
            currentYearMonthId: null
        }

    // 获取当月详细表格数据
    const { data: detailTableData, loading: detailTableDataLoading, error: detailTableError, refetch } = useQuery(GET_DETAIL_TABLE_DATA_QUERY, {
        skip: !currentYearMonth.currentYearMonthId || selectedValue === '',
        variables: {
            yearMonthId: selectedValue
        },
        notifyOnNetworkStatusChange: true,
    })

    const getDetailTableData: DetailTableData | undefined = detailTableData?.getDetailTableData

    // 获取当月花销表格数据
    const { data: tableData, loading: tableDataLoading, error: tableError, refetch: refetchTable } = useQuery(CHECK_EXPENSE_TABLE_DATA_QUERY, {
        skip: !currentYearMonth.currentYearMonthId || selectedValue === '',
        variables: {
            yearMonthId: selectedValue
        },
        fetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
    })

    const checkExpenseTableData: ExpenseTableData | undefined = tableData?.checkExpenseTableData

    // 如无任何数据，则添加当前时间数据
    const [addTime] = useMutation(ADD_TIME_MUTATION, {
        variables: {
            input: {
                year: year,
                month: month,
            }
        },
    });

    // 获取用户已有的时间数据（年月选择框）
    const dateSelectBoxItems: DateSelectBoxItems[] = getUserExistingTimeData?.map((item: ExistingTime) => {
        return {
            value: item.yearMonthId,
            label: `${item.year}年${item.month}月`
        }
    }) || [];

    useEffect(() => {
        if (existingTimeDataLoading || existingTimeError || !existingTimeData) return;

        if (currentYearMonth.isCurrentYearMonthExists === false) {
            addTime();
            window.location.reload();
        } else if (currentYearMonth.currentYearMonthId) {
            setSelectedValue(currentYearMonth.currentYearMonthId);
        }
    }, [existingTimeData, existingTimeDataLoading, existingTimeError, currentYearMonth.isCurrentYearMonthExists, currentYearMonth.currentYearMonthId, addTime]);

    // Keep one complete month on screen until both queries for the next month finish.
    useEffect(() => {
        if (existingTimeDataLoading || detailTableDataLoading || tableDataLoading ||
            existingTimeError || detailTableError || tableError ||
            !getDetailTableData || !checkExpenseTableData) return;

        const selectedMonth = getUserExistingTimeData?.find((item) => item.yearMonthId === selectedValue);
        if (!selectedMonth) return;

        setLoadedMonth({
            yearMonthId: selectedValue,
            title: `${selectedMonth.year}年${selectedMonth.month}月`,
            days: new Date(selectedMonth.year, selectedMonth.month, 0).getDate(),
            details: getDetailTableData,
            rows: checkExpenseTableData.expenseTableData,
        });
    }, [selectedValue, getUserExistingTimeData, getDetailTableData, checkExpenseTableData,
        existingTimeDataLoading, detailTableDataLoading, tableDataLoading,
        existingTimeError, detailTableError, tableError]);

    const hasLoadError = Boolean(existingTimeError || detailTableError || tableError);
    const isLoading = existingTimeDataLoading || tableDataLoading || detailTableDataLoading ||
        (!hasLoadError && (!loadedMonth || loadedMonth.yearMonthId !== selectedValue));
    const retryLoad = () => {
        void Promise.allSettled([
            ...(existingTimeError ? [refetchExistingTime()] : []),
            ...(detailTableError ? [refetch()] : []),
            ...(tableError ? [refetchTable()] : []),
        ]);
    };

    if (!loadedMonth) {
        return hasLoadError && !isLoading ? (
            <div className="home-initial-error" role="alert">
                <p>账本加载失败，请重试。</p>
                <Button onClick={retryLoad}>重试</Button>
            </div>
        ) : (
            <LoadingAnimation />
        );
    }

    const DetailTableData: DetailTableDataProps = {
        elapsedDays: loadedMonth.details.recordedDate,
        totalMonthlyExpense: loadedMonth.details.totalMonthlyExpense,
        averageDailyExpense: loadedMonth.details.averageDailyExpense,
        predictTotalMonthlyExpense: loadedMonth.details.predictTotalMonthlyExpense
    }

    return (
        <>
            <div aria-busy={isLoading} ref={(element) => { if (element) element.inert = isLoading; }}>
                <div>
                    <h1>{loadedMonth.title}</h1>
                </div>
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '20px'
                }}>
                    <CustomSelectBox
                        title='Date'
                        menuItems={dateSelectBoxItems}
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                    />
                </div>
                <div style={{
                    width: '50%',
                    margin: '0 auto',
                    position: 'absolute',
                    left: '25%',
                    top: '0.5%'
                }}>
                    <DetailTable
                        DetailTableData={DetailTableData}
                    />
                </div>
                <div ref={(element) => {
                    if (element) element.inert = hasLoadError && loadedMonth.yearMonthId !== selectedValue;
                }}>
                    <ExpenseTable
                        key={loadedMonth.yearMonthId}
                        yearMonthId={loadedMonth.yearMonthId}
                        totalDaysOfSelectedYearMonth={loadedMonth.days}
                        expenseTableData={loadedMonth.rows}
                        onRefetch={refetch} // 传递 refetch 方法
                    />
                </div>
            </div>
            {isLoading && (
                <div className="home-month-loading-overlay" role="status">
                    <LoadingAnimation />
                    <span className="home-month-loading-text">正在加载月份数据…</span>
                </div>
            )}
            {hasLoadError && !isLoading && (
                <div className="home-month-error" role="alert">
                    <span>{loadedMonth.yearMonthId !== selectedValue
                        ? `新月份加载失败，仍显示${loadedMonth.title}，请重试或选择其他月份。`
                        : '数据加载失败，请重试。'}</span>
                    <Button onClick={retryLoad}>重试</Button>
                </div>
            )}
        </>
    )
};

export default HomePage;
