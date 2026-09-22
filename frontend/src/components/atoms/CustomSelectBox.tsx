import { useId, type FC } from 'react';
import Icon from './Icon';
import './atomsCSS/CustomSelectBox.css';

interface CustomSelectBoxProps {
    title: string;
    menuItems: { value: string; label: string }[];
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    disabled?: boolean;
}

const CustomSelectBox: FC<CustomSelectBoxProps> = ({ title, menuItems, selectedValue, setSelectedValue, disabled }) => {
    const id = useId();
    return (
        <div className="custom-select-box">
            <label className="sr-only" htmlFor={id}>{title}</label>
            <Icon name="calendar" size={17} />
            <select id={id} value={selectedValue} onChange={event => setSelectedValue(event.target.value)} disabled={disabled || menuItems.length === 0}>
                {menuItems.length === 0 && <option value="">暂无账本</option>}
                {menuItems.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <Icon name="down" size={15} />
        </div>
    );
};

export default CustomSelectBox;
