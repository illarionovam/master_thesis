import ListItem from '../ListItem';
import ListItemLink from '../ListItemLink';
import styles from './List.module.css';

export default function List({ items = [], onRemove }) {
    return (
        <ul className={styles.list}>
            {items.map(item => {
                const { id, content, to } = item;
                return (
                    <li key={id} className={styles.item}>
                        <div className={styles.row}>
                            <ListItemLink to={to ?? String(id)}>
                                <ListItem content={content} />
                            </ListItemLink>

                            {typeof onRemove === 'function' && (
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    aria-label="Remove"
                                    title="Remove"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onRemove(item);
                                    }}
                                >
                                    &mdash;
                                </button>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
