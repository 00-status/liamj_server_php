import { Ref } from 'react';
import './color-input.css';

type Props = {
    label?: string;
    value: string | number;
    id?: string;
    onChange?: (value?: string) => void;
    readonly?: boolean;
    ref?: Ref<HTMLInputElement>;
};

export const ColorInput = (props: Props) => {
    const { label, value, id, onChange, readonly, ref } = props;

    return (
        <div className="color-input">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                ref={ref}
                className="color-input__input"
                readOnly={readonly}
                type="color"
                id={id}
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
