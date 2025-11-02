import ListItem from '../ListItem';
import ListItemLink from '../ListItemLink';
import styles from './List.module.css';

export default function List({ items = [] }) {
    return (
        <ul className={styles.list}>
            {items.map(({ id, content }) => (
                <li key={id} className={styles.item}>
                    <ListItemLink id={id}>
                        <ListItem content={content} />
                    </ListItemLink>
                </li>
            ))}
        </ul>
    );
}
