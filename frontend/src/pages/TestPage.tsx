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

const TestPage: React.FC = () => {
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
        </>
    );
};

export default TestPage;
