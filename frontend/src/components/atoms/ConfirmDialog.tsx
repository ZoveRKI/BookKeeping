import { useEffect, useId, useRef, type FC, type ReactNode } from 'react';
import Icon from './Icon';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    children: ReactNode;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, title, children, confirmLabel = '确认', destructive, onConfirm, onCancel }) => {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        if (open && !ref.current?.open) ref.current?.showModal();
        if (!open && ref.current?.open) ref.current?.close();
    }, [open]);

    return (
        <dialog ref={ref} className="confirm-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onCancel(); }} onClick={event => { if (event.target === event.currentTarget) onCancel(); }}>
            <div className="dialog-body">
                <span className={`dialog-icon ${destructive ? 'danger' : ''}`}><Icon name={destructive ? 'trash' : 'info'} size={25} /></span>
                <h2 id={titleId}>{title}</h2>
                <div className="dialog-description">{children}</div>
                <div className="dialog-actions">
                    <button type="button" className="button button-secondary" onClick={onCancel} autoFocus>取消</button>
                    <button type="button" className={`button ${destructive ? 'button-danger' : 'button-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmDialog;
