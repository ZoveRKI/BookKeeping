import React from 'react';
import './atomsCSS/RowIconButton.css';

interface RowIconButtonProps {
    label: string;
    color: string;
    path: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const RowIconButton: React.FC<RowIconButtonProps> = ({ label, color, path, onClick }) => (
    <button type="button" className="row-icon-button" aria-label={label} style={{ color }} onClick={onClick}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={path} />
        </svg>
    </button>
);

export default RowIconButton;
