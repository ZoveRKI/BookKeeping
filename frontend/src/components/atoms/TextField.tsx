import { useId, type InputHTMLAttributes } from 'react';
import './atomsCSS/TextField.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    fullWidth?: boolean;
}

const TextField = ({
    label,
    fullWidth = false,
    id,
    className = '',
    style,
    placeholder = ' ',
    ...props
}: TextFieldProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div
            className={`text-field${fullWidth ? ' text-field--full-width' : ''} ${className}`.trim()}
            style={style}
        >
            <input
                {...props}
                id={inputId}
                className="text-field__input"
                placeholder={placeholder}
            />
            <label className="text-field__label" htmlFor={inputId}>{label}</label>
            <fieldset className="text-field__outline" aria-hidden="true">
                <legend><span>{label}</span></legend>
            </fieldset>
        </div>
    );
};

export default TextField;
