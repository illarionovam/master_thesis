import styles from './AppFooter.module.css';

export default function AppFooter() {
    return (
        <footer role="contentinfo" className={styles.footer}>
            <div className={styles.container}>
                <small>© {new Date().getFullYear()}</small>
            </div>
        </footer>
    );
}
