import { ReactNode } from 'react';
import ReactModal from 'react-modal';

import './modal.css';
import { Button, ButtonTheme } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconType } from '../Icon/domain';

type Props = {
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

ReactModal.setAppElement('#app');

export const Modal = (props: Props) => {
    return (
        <ReactModal className="modal" overlayClassName="modal-overlay" isOpen={props.isOpen}>
            <div className="modal__contents">
                <div className="modal__title">
                    <h2>{props.title}</h2>
                    <Button buttonTheme={ButtonTheme.Subtle} onClick={props.onClose}>
                        <Icon iconType={IconType.CLOSE} />
                    </Button>
                </div>
                <div className="modal__body">{props.children}</div>
                <div className="modal__footer">{props.footer}</div>
            </div>
        </ReactModal>
    );
};
