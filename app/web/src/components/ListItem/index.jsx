import styles from './ListItem.module.css';

export default function ListItem({ content }) {
    return <span className={styles.capitalize}>{content}</span>;
}
