import { useQuery } from '@apollo/client';
import { CHECK_TIME_EXISTS_QUERY } from "../graphql/queries";

const HomePage = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const { data } = useQuery(CHECK_TIME_EXISTS_QUERY, {
        variables: {
            userId: localStorage.getItem("userId"),
            year: year,
            month: month
        }
    })

    console.log('Data', data);

    if (data?.checkTimeExists.isSuccess) {
        return (
            <div>
                <h1>{`${year}年${month}月`}</h1>
            </div>
        )
    } else {
        return <p>Error</p>
    }
};

export default HomePage;
