import { Ref } from 'react';
import './text-input.css';

type Props = {
    label?: string;
    value: string | number;
    id?: string;
    placeholder?: string;
    onChange?: (value?: string) => void;
    readonly?: boolean;
    numbersOnly?: boolean;
    ref?: Ref<HTMLInputElement>;
};

export const TextInput = (props: Props) => {
    const { label, value, id, placeholder, onChange, readonly, numbersOnly, ref } = props;

    return (
        <div className="text-input">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                ref={ref}
                className="text-input__input"
                readOnly={readonly}
                type={numbersOnly ? 'number' : 'text'}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={(value) => {
                    const newValue = value.target.value ?? '';
                    if (onChange) {
                        onChange(newValue);
                    }
                }}
            />
        </div>
    );
};
