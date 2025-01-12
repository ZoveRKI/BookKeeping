import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from './../../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import {
    Button as MuiButton,
    TextField as MuiTextField
} from "@mui/material";
import './organismsCSS/LoginForm.css'

export const LoginForm: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [login] = useMutation(LOGIN_MUTATION);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await login({
                variables: {
                    input: {
                        userName: userName,
                        password: password
                    }
                }
            });

            console.log("Data:", data);

            if (data?.login.isSuccess) {
                // 登录成功后跳转到首页
                localStorage.setItem("userId", data?.login.userId);
                navigate('/home');
            } else {
                // 显示错误信息
                setError(data?.login.messages[0] || 'Unknown error');
                console.log("Error:", error);
            }
        } catch (err) {
            setError('Login failed');
            console.error("Error:", error);
        }
    };

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
