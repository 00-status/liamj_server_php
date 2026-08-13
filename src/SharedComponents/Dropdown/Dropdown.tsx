import { useEffect, useState } from 'react';
import './dropdown.css';

type Props = {
    id?: string;
    label?: string;
    defaultValue: string;
    options: Array<{ label: string; value: string }>;
    onOptionSelect: (optionValue: string) => void;
    isDisabled?: boolean;
};

export const Dropdown = (props: Props) => {
    const { id, label, defaultValue, options, onOptionSelect, isDisabled } = props;
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    useEffect(() => {
        setSelectedValue(defaultValue);
    }, [defaultValue]);

    return (
        <div className="dropdown">
            {label && <label htmlFor={id}>{label}</label>}
            <select
                className="dropdown__select"
                value={selectedValue}
                id={id}
                onChange={(event) => {
                    const dropdownValue = event.currentTarget.value;

                    setSelectedValue(dropdownValue);
                    onOptionSelect(dropdownValue);
                }}
                disabled={isDisabled}
            >
                {options.map((option) => {
                    return (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};
