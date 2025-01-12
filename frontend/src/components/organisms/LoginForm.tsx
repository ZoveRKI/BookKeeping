import React from 'react';
import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";
import './organismsCSS/LoginForm.css'

interface LoginFormProps {
    userName: string;
    password: string;
    setUserName: (value: string) => void;
    setPassword: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>
}

export const LoginForm: React.FC<LoginFormProps> = ({
    userName,
    password,
    setUserName,
    setPassword,
    handleSubmit
}) => {
    return (
        <div className="container">
            <div className="login-box">
                <h1>LogIn</h1>
                <form onSubmit={handleSubmit}>
                    <MuiTextField
                        id="outlined-basic"
                        label="UserName"
                        variant="outlined"
                        fullWidth
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <MuiTextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <MuiButton
                        type="submit"
                        variant="contained"
                    >
                        Sign In
                    </MuiButton>
                </form>
            </div>
        </div>
    );
};
