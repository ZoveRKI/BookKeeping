import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";
import EditableCell from "../components/atoms/EditableCell";
import ExpenseTable from "../components/organisms/ExpenseTable";
import AddRowButton from "../components/atoms/AddRowButton";
import DeleteRowButton from "../components/atoms/DeleteRowButton";
import SaveRowButton from "../components/atoms/SaveRowButton";

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
            <ExpenseTable />
        </>
    );
};

export default TestPage;
