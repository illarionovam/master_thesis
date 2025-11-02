import styles from './Title.module.css';

export default function Title({ children, id, ...rest }) {
    return (
        <h2 className={styles.upper} id={id} {...rest}>
            {children}
        </h2>
    );
}
