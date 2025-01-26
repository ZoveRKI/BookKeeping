import React from 'react';
import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";
import EditableCell from "../components/atoms/EditableCell";
import AddRowButton from "../components/atoms/AddRowButton";
import DeleteRowButton from "../components/atoms/DeleteRowButton";
import SaveRowButton from "../components/atoms/SaveRowButton";
import { LoadingAnimation } from '../components/organisms/LoadingAnimation';
import { DetailTable } from '../components/organisms/DetailTable';

const TestPage: React.FC = () => {
    const elapsedDays = new Date().getDate();

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
            <LoadingAnimation />
            <br />
            <br />
            <div style={{
                width: '50%',
                margin: '0 auto',
                position: 'absolute',
                left: '25%',
                top: '0.5%'
            }}>
                <DetailTable
                    DetailTableData={
                        {
                            elapsedDays: elapsedDays,
                            totalMonthlyExpense: 1000,
                            averageDailyExpense: 100,
                            predictTotalMonthlyExpense: 2000
                        }
                    }
                />
            </div>
        </>
    );
};

export default TestPage;
