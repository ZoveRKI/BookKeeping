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
    expenseTableData: ExpenseTableRowProps[];
}

const HomePage: React.FC = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [title, setTitle] = useState<string>("");
    const [days, setDays] = useState<number>(0);

    // 获取用户已有的时间数据
    const { data: existingTimeData, loading: existingTimeDataLoading } = useQuery(GET_USER_EXISTING_TIME_QUERY);

    const getUserExistingTimeData: ExistingTime[] = existingTimeData?.getUserExistingTime.existingTime

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
    const { data: detailTableData, loading: detailTableDataLoading, refetch } = useQuery(GET_DETAIL_TABLE_DATA_QUERY, {
        skip: !currentYearMonth.currentYearMonthId || selectedValue === '',
        variables: {
            yearMonthId: selectedValue
        }
    })

    const getDetailTableData: DetailTableData = detailTableData?.getDetailTableData

    // 获取当月花销表格数据
    const { data: tableData, loading: tableDataLoading } = useQuery(CHECK_EXPENSE_TABLE_DATA_QUERY, {
        skip: !currentYearMonth.currentYearMonthId || selectedValue === '',
        variables: {
            yearMonthId: selectedValue
        }
    })

    const checkExpenseTableData: ExpenseTableData = tableData?.checkExpenseTableData

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
        if (!existingTimeDataLoading && currentYearMonth.isCurrentYearMonthExists === false) {
            addTime();
            window.location.reload();
        } else if (currentYearMonth.currentYearMonthId) {
            setSelectedValue(currentYearMonth.currentYearMonthId);
        }
    }, [existingTimeData]);

    useEffect(() => {
        if (getUserExistingTimeData) {
            const yearMonthOfDateSelectionBox: ExistingTime | undefined = getUserExistingTimeData?.find(
                (item: ExistingTime) => {
                    return item.yearMonthId === selectedValue
                }
            )

            if (yearMonthOfDateSelectionBox) {
                const days = new Date(yearMonthOfDateSelectionBox.year, yearMonthOfDateSelectionBox.month, 0).getDate();
                setDays(days);
                setTitle(`${yearMonthOfDateSelectionBox.year}年${yearMonthOfDateSelectionBox.month}月`)
            } else {
                setTitle(`${year}年${month}月`); // 如果找不到匹配的时间，设置一个默认值
            }
        }
    }, [selectedValue, existingTimeData]);

    if (existingTimeDataLoading || tableDataLoading || detailTableDataLoading) {
        return (
            <LoadingAnimation />
        );
    }

    const DetailTableData: DetailTableDataProps = {
        elapsedDays: getDetailTableData?.recordedDate,
        totalMonthlyExpense: getDetailTableData?.totalMonthlyExpense,
        averageDailyExpense: getDetailTableData?.averageDailyExpense,
        predictTotalMonthlyExpense: getDetailTableData?.predictTotalMonthlyExpense
    }

    return (
        <>
            <div>
                <h1>{title}</h1>
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
            <div>
                <ExpenseTable
                    yearMonthId={currentYearMonth.currentYearMonthId}
                    totalDaysOfSelectedYearMonth={days}
                    expenseTableData={checkExpenseTableData?.expenseTableData}
                    onRefetch={refetch} // 传递 refetch 方法
                />
            </div>
        </>
    )
};

export default HomePage;
