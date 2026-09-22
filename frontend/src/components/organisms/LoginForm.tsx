import { useState, type FC, type FormEvent } from 'react';
import Icon from '../atoms/Icon';
import './organismsCSS/LoginForm.css';

interface LoginFormProps {
    userName: string;
    password: string;
    setUserName: (value: string) => void;
    setPassword: (value: string) => void;
    handleSubmit: (event: FormEvent) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const LoginForm: FC<LoginFormProps> = ({ userName, password, setUserName, setPassword, handleSubmit, loading, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="login-form-wrap">
            <p className="eyebrow">YOUR EVERYDAY COMPANION</p>
            <h1>欢迎回来<span>。</span></h1>
            <p className="login-subtitle">生活里的每一笔，都值得被好好记录。</p>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field"><label htmlFor="username">用户名</label><div className="login-input"><Icon name="user" size={18} /><input id="username" name="username" autoComplete="username" placeholder="输入你的用户名" value={userName} onChange={event => setUserName(event.target.value)} required disabled={loading} aria-invalid={!!error} /></div></div>
                <div className="login-field"><label htmlFor="password">密码</label><div className="login-input"><Icon name="lock" size={18} /><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="输入你的密码" value={password} onChange={event => setPassword(event.target.value)} required disabled={loading} aria-invalid={!!error} aria-describedby={error ? 'login-error' : undefined} /><button className="icon-button" type="button" aria-label={showPassword ? '隐藏密码' : '显示密码'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}><Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} /></button></div></div>
                {error && <div id="login-error" className="notice" role="alert"><Icon name="info" size={17} /><span>{error}</span></div>}
                <button type="submit" className="button button-primary login-submit" disabled={loading || !userName.trim() || !password}>{loading ? <><span className="spinner" />正在打开账本…</> : <>进入我的账本<Icon name="arrow" size={19} /></>}</button>
            </form>
            <p className="login-note"><Icon name="book" size={14} />使用已有账号，继续你的记账旅程</p>
        </div>
    );
};
