import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";

const TestPage: React.FC = () => {
    return (
        <>
            <h1>Welcome to the Test Page</h1>
            <MuiButton variant="contained">Sign In</MuiButton>
            <br />
            <br />
            <MuiTextField id="outlined-basic" label="UserName" variant="outlined" />
            <MuiTextField id="outlined-basic" label="Password" variant="outlined" />
        </>
    );
};

export default TestPage;
