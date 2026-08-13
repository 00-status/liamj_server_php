import { useRef } from 'react';

type Props = {
    prefixText: string;
    currentCommandText: string;
    onChange: (value: string) => void;
    onEnter: () => void;
    onTab: () => void;
};

export const TerminalInput = (props: Props) => {
    const { prefixText, currentCommandText, onChange, onEnter, onTab } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const onInputWrapperClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div onClick={onInputWrapperClick} className="terminal__input-wrapper">
            <div>{prefixText}</div>
            <input
                ref={inputRef}
                autoFocus
                className="terminal__input"
                value={currentCommandText}
                onChange={(event) => onChange(event.target.value ?? '')}
                onKeyUp={(event) => {
                    if (event.key === 'Enter' && currentCommandText) {
                        onEnter();
                    }

                    if (event.key === 'Tab' && currentCommandText) {
                        onTab();
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Tab') {
                        event.preventDefault();
                    }
                }}
            />
        </div>
    );
};
