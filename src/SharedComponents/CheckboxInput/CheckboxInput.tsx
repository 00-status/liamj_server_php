import { Ref } from 'react';

import './checkbox-input.css';

type Props = {
    label?: string;
    value: boolean;
    id?: string;
    placeholder?: string;
    onChange?: (value: boolean) => void;
    readonly?: boolean;
    ref?: Ref<HTMLInputElement>;
};

export const CheckboxInput = (props: Props) => {
    const { label, value, id, placeholder, onChange, readonly, ref } = props;

    return (
        <div className="checkbox-input">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                ref={ref}
                className="checkbox-input__input"
                readOnly={readonly}
                type="checkbox"
                id={id}
                placeholder={placeholder}
                checked={value}
                onClick={() => {
                    if (onChange) {
                        onChange(!value);
                    }
                }}
            />
        </div>
    );
};
