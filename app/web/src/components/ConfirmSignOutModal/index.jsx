import { useEffect, useRef } from 'react';
import styles from './ConfirmSignOutModal.module.css';

export default function ConfirmSignOutModal({ open, onClose, onCurrent, onAll }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (open) dialogRef.current?.showModal?.();
        else dialogRef.current?.close?.();
    }, [open]);

    return (
        <dialog ref={dialogRef} aria-labelledby="signout-title" onClose={onClose} className={styles.dialog}>
            <form method="dialog" className={styles.body}>
                <h2 id="signout-title" className={styles.title}>
                    Terminate all sessions?
                </h2>
                <p className={styles.text}>Choose what to sign out:</p>

                <div className={styles.actions}>
                    <button type="button" onClick={onCurrent} className="primaryBtn">
                        Only current
                    </button>
                    <button type="button" onClick={onAll} className="dangerBtn">
                        All
                    </button>
                    <button type="button" onClick={onClose} className="ghostBtn">
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
