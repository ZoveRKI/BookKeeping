import React, { useState } from 'react';
import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";
import EditableCell from "../components/atoms/EditableCell";
// import ExpenseTable from "../components/organisms/ExpenseTable";
import AddRowButton from "../components/atoms/AddRowButton";
import DeleteRowButton from "../components/atoms/DeleteRowButton";
import SaveRowButton from "../components/atoms/SaveRowButton";
import DateRangeSelectBox from "../components/atoms/CustomSelectBox";

const TestPage: React.FC = () => {
    const [selectedValue, setSelectedValue] = useState<string | number>('');

    return (
        <>
            <h1>Welcome to the Test Page</h1>
            <MuiButton variant="contained">Sign In</MuiButton>
            <br />
            <br />
            <MuiTextField id="outlined-basic" label="UserName" variant="outlined" />
            <MuiTextField id="outlined-basic" label="Password" variant="outlined" />
            <EditableCell />
            <AddRowButton />
            <DeleteRowButton />
            <SaveRowButton />
            <br />
            <br />
            {/* <ExpenseTable /> */}
            <DateRangeSelectBox
                title='Date'
                menuItems={[
                    { value: 10, label: '2025年1月' },
                    { value: 20, label: '2025年10月' },
                    { value: 30, label: '2025年12月' },
                ]}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
            />
        </>
    );
};

export default TestPage;
