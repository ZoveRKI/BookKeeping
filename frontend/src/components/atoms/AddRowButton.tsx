import type { ButtonHTMLAttributes, FC } from 'react';
import Icon from './Icon';

const AddRowButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children = '添加记录', className = 'button button-secondary', ...props }) => (
    <button type="button" className={className} {...props}><Icon name="plus" size={17} />{children}</button>
);

export default AddRowButton;
