import type { ButtonHTMLAttributes, FC } from 'react';
import Icon from './Icon';

const DeleteRowButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => (
    <button type="button" className="icon-button danger" aria-label="删除记录" title="删除记录" {...props}><Icon name="trash" size={17} /></button>
);

export default DeleteRowButton;
