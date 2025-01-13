import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";
import EditableCell from "../components/atoms/EditableCell";

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
        </>
    );
};

export default TestPage;
