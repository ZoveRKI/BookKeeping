import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    CHECK_TIME_EXISTS_QUERY,
    CHECK_EXPENSE_TABLE_DATA_QUERY
} from "../graphql/queries";
import { ADD_TIME_MUTATION } from '../graphql/mutations';
import ExpenseTable from '../components/organisms/ExpenseTable';

const HomePage: React.FC = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

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
                <ExpenseTable />
            </div>
        </>
    )
};

export default HomePage;
