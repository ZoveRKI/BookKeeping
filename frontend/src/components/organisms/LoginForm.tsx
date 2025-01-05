import { Button as MuiButton, TextField as MuiTextField } from "@mui/material";
import './organismsCSS/LoginForm.css'

export const LoginForm: React.FC = () => {
    return (
        <div className="container">
            <div className="login-box">
                <h1>LogIn</h1>
                <MuiTextField id="outlined-basic" label="UserName" variant="outlined" fullWidth />
                <MuiTextField id="outlined-basic" label="Password" variant="outlined" fullWidth />
                <MuiButton variant="contained">Sign In</MuiButton>
            </div>
        </div>
    );
};
