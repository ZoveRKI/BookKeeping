import React, { useState } from 'react';
import { LoginForm } from "../components/organisms/LoginForm"
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from './../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import { LoadingAnimation } from '../components/organisms/LoadingAnimation';

const LoginPage: React.FC = () => {
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

            console.log("Login Data:", data);

            if (data?.login.isSuccess) {
                // 登录成功后跳转到首页
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
        <>
            <LoadingAnimation />
            <LoginForm
                userName={userName}
                password={password}
                setUserName={setUserName}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
            />
        </>

    )
}

export default LoginPage
