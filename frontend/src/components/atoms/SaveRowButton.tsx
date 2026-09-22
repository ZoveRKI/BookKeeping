import type { ButtonHTMLAttributes, FC } from 'react';
import Icon from './Icon';

const SaveRowButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => (
    <button type="button" className="icon-button save" aria-label="保存记录" title="保存记录" {...props}><Icon name="check" size={19} /></button>
);

export default SaveRowButton;
