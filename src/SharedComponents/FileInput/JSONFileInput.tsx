import { ChangeEvent } from 'react';

import './json-file-input.css';

type UnknownObject = { [key: string]: unknown };

type Props = {
    id: string;
    name?: string;
    onChange: (parsedFile: Array<UnknownObject> | UnknownObject) => void;
};

export const JSONFileInput = (props: Props) => {
    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = onFileUpload;

        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        reader.readAsText(files[0]);
    };

    const onFileUpload = (event: ProgressEvent<FileReader>) => {
        const file = event.target?.result;

        if (!file || typeof file !== 'string') {
            return;
        }

        const parsedJSONFile = JSON.parse(file);
        props.onChange(parsedJSONFile);
    };

    return (
        <div className="file-input">
            {props.name && <label htmlFor={props.id}>{props.name}</label>}
            <input
                className="file-input__input"
                id={props.id}
                type="file"
                accept="application/json"
                onChange={onInputChange}
            />
        </div>
    );
};
