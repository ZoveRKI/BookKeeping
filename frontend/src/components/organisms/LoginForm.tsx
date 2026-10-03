import React from 'react';
import Button from '../atoms/Button';
import TextField from '../atoms/TextField';
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
                    <TextField
                        id="login-user-name"
                        label="UserName"
                        fullWidth
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <TextField
                        id="login-password"
                        label="Password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};
