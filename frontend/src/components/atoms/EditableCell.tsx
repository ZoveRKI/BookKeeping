import React, { useState, useEffect } from 'react';
import './atomsCSS/EditableCell.css';

type EditableCellProps = {
    initialValue?: string;
    onSave?: (value: string) => void;
};

const EditableCell: React.FC<EditableCellProps> = ({
    initialValue = '',
    onSave
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        setValue(initialValue as string);
    }, [initialValue]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (onSave) {
            onSave(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            if (onSave) {
                onSave(value);
            }
        }
    };

    return (
        <div
            onDoubleClick={handleDoubleClick}
            className='editable-cell'
        >
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className='editable-cell-input'
                />
            ) : value ? (
                <span>{value}</span>
            ) : (
                <span className='init-text'>{'*'}</span>
            )}
        </div>
    );
};

export default EditableCell;
