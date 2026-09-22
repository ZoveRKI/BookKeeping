import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import EditableCell from '../components/atoms/EditableCell';
import AddRowButton from '../components/atoms/AddRowButton';
import DeleteRowButton from '../components/atoms/DeleteRowButton';
import SaveRowButton from '../components/atoms/SaveRowButton';
import { LoadingAnimation } from '../components/organisms/LoadingAnimation';
import { DetailTable } from '../components/organisms/DetailTable';
import Brand from '../components/atoms/Brand';

const TestPage: FC = () => {
    const [amount, setAmount] = useState('128');
    return (
        <main className="component-preview">
            <Brand />
            <h1>组件展示</h1>
            <p>以下为组件演示数据，不会保存到账本。</p>
            <DetailTable DetailTableData={{ elapsedDays: 12, totalMonthlyExpense: 1200, averageDailyExpense: 100, predictTotalMonthlyExpense: 3000 }} />
            <div className="panel preview-controls" style={{ padding: 24 }}>
                <EditableCell initialValue={amount} onSave={setAmount} />
                <AddRowButton onClick={() => setAmount('0')} />
                <SaveRowButton onClick={() => setAmount(String(Number(amount) || 0))} />
                <DeleteRowButton onClick={() => setAmount('')} />
                <Link to="/" className="button button-primary">查看登录页</Link>
            </div>
            <LoadingAnimation />
        </main>
    );
};

export default TestPage;
