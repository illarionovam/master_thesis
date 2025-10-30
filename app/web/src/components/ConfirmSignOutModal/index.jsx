import { useEffect, useRef } from 'react';

export default function ConfirmSignOutModal({ open, onClose, onCurrent, onAll }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
        } else {
            dialogRef.current?.close?.();
        }
    }, [open]);

    return (
        <dialog ref={dialogRef} aria-labelledby="signout-title" onClose={onClose}>
            <form method="dialog" className="modal-body">
                <h2 id="signout-title">Terminate all sessions?</h2>
                <p>Choose what to sign out:</p>

                <div>
                    <button type="button" onClick={onCurrent}>
                        Only current
                    </button>
                    <button type="button" onClick={onAll}>
                        All
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
