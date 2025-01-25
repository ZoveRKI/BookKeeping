import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    CHECK_TIME_EXISTS_QUERY,
    CHECK_EXPENSE_TABLE_DATA_QUERY,
    GET_USER_EXISTING_TIME_QUERY
} from "../graphql/queries";
import { ADD_TIME_MUTATION } from '../graphql/mutations';
import ExpenseTable from '../components/organisms/ExpenseTable';
import CustomSelectBox from '../components/atoms/CustomSelectBox';
import { LoadingAnimation } from '../components/organisms/LoadingAnimation';

interface ExistingTime {
    yearMonthId: string;
    year: number;
    month: number;
}

interface DateSelectBoxItems {
    value: string;
    label: string;
}

const HomePage: React.FC = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [title, setTitle] = useState<string>("");

    // console.log('HomePage Selected Value', selectedValue);
    // console.log('Title', title);

    const { data: titleData, loading: titleLoading } = useQuery(CHECK_TIME_EXISTS_QUERY, {
        variables: {
            userId: localStorage.getItem("userId"),
            year: year,
            month: month
        }
    })
    // console.log('HomePage Title Data', titleData);

    const { data: existingTimeData, loading: existingTimeDataLoading } = useQuery(GET_USER_EXISTING_TIME_QUERY, {
        variables: {
            userId: localStorage.getItem("userId")
        }
    });
    // console.log('Existing Time Data', existingTimeData);

    const { data: tableData, loading: tableDataLoading } = useQuery(CHECK_EXPENSE_TABLE_DATA_QUERY, {
        skip: !titleData?.checkTimeExists.yearMonthId || selectedValue === '',
        variables: {
            userId: localStorage.getItem("userId"),
            yearMonthId: selectedValue
        }
    })
    // console.log('HomePage Table Data', tableData);

    const [addTime] = useMutation(ADD_TIME_MUTATION, {
        variables: {
            input: {
                userId: localStorage.getItem("userId"),
                year: year,
                month: month,
            }
        },
        // onCompleted: (mutationData) => {
        //     console.log("Mutation result:", mutationData);
        //     if (mutationData.addTime.isSuccess) {
        //         console.log("Success")
        //     } else {
        //         console.error("Failed");
        //     }
        // },
        // onError: (mutationError) => {
        //     console.error("Mutation error:", mutationError);
        // },
    });

    const dateSelectBoxItems: DateSelectBoxItems[] = existingTimeData?.getUserExistingTime.existingTime.map((item: ExistingTime) => {
        return {
            value: Number(item.yearMonthId),
            label: `${item.year}年${item.month}月`
        }
    }) || [];
    // console.log('Date Select Box Items', dateSelectBoxItems);

    useEffect(() => {
        if (titleData?.checkTimeExists.isSuccess === false) {
            addTime();
            window.location.reload();
        } else if (titleData?.checkTimeExists.yearMonthId) {
            setSelectedValue(titleData.checkTimeExists.yearMonthId);
        }
    }, [titleData, addTime]);

    useEffect(() => {
        if (existingTimeData?.getUserExistingTime.existingTime) {
            const currentYearMonth: ExistingTime = existingTimeData?.getUserExistingTime.existingTime.find(
                (item: ExistingTime) => {
                    return item.yearMonthId === String(selectedValue)
                }
            )
            // console.log('Current Year Month', currentYearMonth);
            if (currentYearMonth) {
                setTitle(`${currentYearMonth.year}年${currentYearMonth.month}月`)
            } else {
                setTitle(`${year}年${month}月`); // 如果找不到匹配的时间，设置一个默认值
            }
        }
    }, [selectedValue, existingTimeData]);

    if (titleLoading || existingTimeDataLoading || tableDataLoading) {
        return (
            <LoadingAnimation />
        );
    }

    // TODO: 可以把Wrong提示符换成动画
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
            <div>
                <ExpenseTable
                    yearMonthId={titleData?.checkTimeExists.yearMonthId}
                    expenseTableData={tableData?.checkExpenseTableData.expenseTableData}
                />
            </div>
        </>
    )
};

export default HomePage;
