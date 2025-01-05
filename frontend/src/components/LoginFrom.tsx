import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";

export const LoginFrom: React.FC = () => {
    return (
        <div>
            <h1>LogIn</h1>
            <MuiTextField id="outlined-basic" label="Password" variant="outlined" />
            <MuiTextField id="outlined-basic" label="UserName" variant="outlined" />
            <MuiButton variant="contained">Sign In</MuiButton>
        </div>
    )
}
