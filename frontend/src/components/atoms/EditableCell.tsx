import { useState, type FC } from 'react';
import Icon from './Icon';
import { formatAmount } from '../../utils/expenses';
import './atomsCSS/EditableCell.css';

interface EditableCellProps {
    initialValue?: string;
    onSave?: (value: string) => void;
    label?: string;
    disabled?: boolean;
}

const EditableCell: FC<EditableCellProps> = ({ initialValue = '', onSave, label = '编辑金额', disabled }) => {
    const [draft, setDraft] = useState<string | null>(null);

    const finish = () => {
        if (draft === null) return;
        onSave?.(draft.trim());
        setDraft(null);
    };

    if (draft !== null) {
        return <input className="editable-cell-input" aria-label={label} type="text" inputMode="decimal" value={draft} autoFocus disabled={disabled}
            onChange={event => setDraft(event.target.value)} onBlur={finish}
            onFocus={event => event.target.select()}
            onKeyDown={event => {
                if (event.key === 'Enter') event.currentTarget.blur();
                if (event.key === 'Escape') { event.preventDefault(); setDraft(null); }
            }} />;
    }

    return <button type="button" className={`editable-cell ${initialValue === '' ? 'is-empty' : ''}`} aria-label={`${label}：${initialValue || '未填写'}`} disabled={disabled} onClick={() => setDraft(initialValue)}>
        <span>{initialValue === '' ? '填写金额' : Number.isFinite(Number(initialValue)) ? formatAmount(Number(initialValue)) : initialValue}</span>
        <Icon name="edit" size={12} />
    </button>;
};

export default EditableCell;
