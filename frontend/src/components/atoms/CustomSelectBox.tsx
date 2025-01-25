import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './atomsCSS/CustomSelectBox.css'
interface CustomSelectBoxProps {
    title: string;
    menuItems: { value: string | number; label: string }[];
    selectedValue: string | number; // 父组件传递的值
    setSelectedValue: React.Dispatch<React.SetStateAction<string | number>>; // 父组件的 setState
}

const CustomSelectBox: React.FC<CustomSelectBoxProps> = ({
    title,
    menuItems,
    selectedValue,
    setSelectedValue,
}) => {
    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value; // MUI 返回的值是 string 类型
        value === "" ?
            setSelectedValue("") :
            setSelectedValue(isNaN(Number(value)) ? value : Number(value)); // 如果是数字，转为 number
    };

    return (
        <Box className="custom-select-box">
            <FormControl>
                <InputLabel id="custom-select-label">{title}</InputLabel>
                <Select
                    labelId="custom-select-label"
                    id="custom-select"
                    value={String(selectedValue)} // 将 value 转为 string 类型
                    label={title}
                    onChange={handleChange}
                    MenuProps={{
                        disableScrollLock: true, // 禁用滚动锁定
                    }}
                >
                    {/* <MenuItem value="">
                        <em>——————</em>
                    </MenuItem> */}
                    {menuItems.map((item) => (
                        <MenuItem key={item.value} value={String(item.value)}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CustomSelectBox;
