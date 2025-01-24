import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    CHECK_TIME_EXISTS_QUERY,
    CHECK_EXPENSE_TABLE_DATA_QUERY
} from "../graphql/queries";
import { ADD_TIME_MUTATION } from '../graphql/mutations';
import ExpenseTable from '../components/organisms/ExpenseTable';
import CustomSelectBox from '../components/atoms/CustomSelectBox';

const HomePage: React.FC = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const [selectedValue, setSelectedValue] = useState<string | number>('');

    const { data: titleData } = useQuery(CHECK_TIME_EXISTS_QUERY, {
        variables: {
            userId: localStorage.getItem("userId"),
            year: year,
            month: month
        }
    })

    console.log('HomePage Title Data', titleData);

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

    console.log('HomePage Table Data', tableData);

    // TODO: 可以把Wrong提示符换成动画
    return (
        <>
            <div>
                <h1>{`${year}年${month}月`}</h1>
                {titleData?.checkTimeExists.isSuccess ? null : <h2>Wrong!!!!!!</h2>}
            </div>
            <div>
                <CustomSelectBox
                    title='Date'
                    menuItems={[
                        { value: 1, label: '2025年1月' },
                        { value: 2, label: '2025年2月' },
                    ]}
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
