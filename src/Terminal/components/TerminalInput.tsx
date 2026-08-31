import { useRef } from 'react';

type Props = {
    prefixText: string;
    currentCommandText: string;
    onChange: (value: string) => void;
    onEnter: () => void;
    onTab: () => void;
    onArrowUp: () => void;
    onArrowDown: () => void;
};

export const TerminalInput = ({
    prefixText,
    currentCommandText,
    onChange,
    onEnter,
    onTab,
    onArrowUp,
    onArrowDown,
}: Props) => {
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
                    event.preventDefault();

                    if (event.key === 'Enter' && currentCommandText) {
                        onEnter();
                    }

                    if (event.key === 'Tab' && currentCommandText) {
                        onTab();
                    }

                    if (event.key === 'ArrowUp') {
                        onArrowUp();
                    }
                    if (event.key === 'ArrowDown') {
                        onArrowDown();
                    }
                }}
                onKeyDown={(event) => {
                    if (
                        event.key === 'Tab' ||
                        event.key === 'ArrowUp' ||
                        event.key === 'ArrowDown'
                    ) {
                        event.preventDefault();
                    }
                }}
            />
        </div>
    );
};
