import { useState, type FC, type FormEvent } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/organisms/LoginForm';
import { LOGIN_MUTATION } from '../graphql/mutations';
import Brand from '../components/atoms/Brand';
import Icon from '../components/atoms/Icon';

const LoginPage: FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [login, { loading }] = useMutation<{ login: { isSuccess: boolean } }>(LOGIN_MUTATION);
    const client = useApolloClient();
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (loading) return;
        setError(null);
        try {
            const result = await login({ variables: { input: { userName: userName.trim(), password } } });
            if (result.data?.login.isSuccess) {
                await client.clearStore();
                navigate('/home', { replace: true });
            } else {
                setError('用户名或密码不正确，请再试一次。');
            }
        } catch {
            setError('暂时无法登录，请检查连接后重试。');
        }
    };

    return (
        <main className="login-page">
            <section className="login-story" aria-label="BookKeeping 生活账本">
                <Brand />
                <div className="story-content">
                    <p className="story-eyebrow"><span />LESS WORRY. MORE LIVING.</p>
                    <h2>把日常记下来，<br />让生活<span>更有数。</span></h2>
                    <p className="story-description">从一杯咖啡，到生活的每一份热爱。<br />不必复杂，记下就好。</p>
                    <div className="ledger-art" aria-hidden="true">
                        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
                        <div className="art-card">
                            <div className="art-card-top"><span><Icon name="book" size={17} />生活的小账本</span><span className="art-card-tag">DAY BY DAY</span></div>
                            <div className="art-card-heading">慢慢积累，<br /><strong>也是一种富足。</strong></div>
                            <div className="art-bars">{[35, 52, 43, 67, 58, 82, 72, 95, 86, 110].map((height, index) => <i key={index} style={{ height }} />)}</div>
                            <div className="art-card-bottom"><span>认真生活的每一天</span><Icon name="arrow" size={16} /></div>
                        </div>
                        <div className="art-sticker"><span><Icon name="check" size={18} /></span><div>今天，也有好好记录<small>A LITTLE EVERY DAY</small></div></div>
                        <div className="art-spark"><Icon name="spark" size={34} /></div>
                    </div>
                </div>
                <p className="story-footer">YOUR LIFE, WELL NOTED.<span>SIMPLY, EVERY DAY.</span></p>
            </section>
            <section className="login-main">
                <div className="login-mobile-brand"><Brand /></div>
                <div className="login-top-note"><span className="tiny-dot" />简单一点，从容一点</div>
                <LoginForm userName={userName} password={password} setUserName={value => { setUserName(value); setError(null); }} setPassword={value => { setPassword(value); setError(null); }} handleSubmit={handleSubmit} loading={loading} error={error} />
                <p className="login-footer">BookKeeping · 留一点从容给明天</p>
            </section>
        </main>
    );
};

export default LoginPage;
