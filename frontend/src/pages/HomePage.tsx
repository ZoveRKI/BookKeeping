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

interface ExistingTime {
    yearMonthId: string;
    year: number;
    month: number;
}

interface DateSelectBoxItems {
    value: number | string;
    label: string;
}

const HomePage: React.FC = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const [selectedValue, setSelectedValue] = useState<string | number>('');

    // console.log('HomePage Selected Value', selectedValue);

    const { data: titleData } = useQuery(CHECK_TIME_EXISTS_QUERY, {
        variables: {
            userId: localStorage.getItem("userId"),
            year: year,
            month: month
        }
    })

    // console.log('HomePage Title Data', titleData);

    const [addTime] = useMutation(ADD_TIME_MUTATION, {
        variables: {
            input: {
                userId: localStorage.getItem("userId"),
                year: year,
                month: month,
            }
        },
        onCompleted: (mutationData) => {
            console.log("Mutation result:", mutationData);
            if (mutationData.addTime.isSuccess) {
                console.log("Success")
            } else {
                console.error("Failed");
            }
        },
        onError: (mutationError) => {
            console.error("Mutation error:", mutationError);
        },
    });

    useEffect(() => {
        if (titleData?.checkTimeExists.isSuccess === false) {
            addTime();
            window.location.reload();
        }
    }, [titleData, addTime]);

    // Table Data
    const { data: tableData } = useQuery(CHECK_EXPENSE_TABLE_DATA_QUERY, {
        skip: !titleData?.checkTimeExists.yearMonthId,
        variables: {
            userId: localStorage.getItem("userId"),
            yearMonthId: titleData?.checkTimeExists.yearMonthId
        }
    })

    // console.log('HomePage Table Data', tableData);

    const { data: existingTimeData } = useQuery(GET_USER_EXISTING_TIME_QUERY, {
        variables: {
            userId: localStorage.getItem("userId")
        }
    });

    // console.log('Existing Time Data', existingTimeData);

    const dateSelectBoxItems: DateSelectBoxItems[] = existingTimeData?.getUserExistingTime.existingTime.map((item: ExistingTime) => {
        return {
            value: Number(item.yearMonthId),
            label: `${item.year}年${item.month}月`
        }
    }) || [];
    // console.log('Date Select Box Items', dateSelectBoxItems);

    // TODO: 可以把Wrong提示符换成动画
    return (
        <>
            <div>
                <h1>{`${year}年${month}月`}</h1>
                {titleData?.checkTimeExists.isSuccess ? null : <h2>Wrong!!!!!!</h2>}
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
