const HomePage = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    return (
        <div>
            <h1>{`${year}年${month}月`}</h1>
        </div>
    )
};

export default HomePage;
