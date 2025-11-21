import styles from './Loader.module.css';

export default function Loader() {
    return (
        <div className={styles.loaderBackdrop} role="status" aria-live="polite" aria-busy="true">
            <div className={styles.loader} aria-hidden="true" />
        </div>
    );
}
