import ListItem from '../ListItem';
import ListItemLink from '../ListItemLink';

export default function List({ items = [] }) {
    return (
        <ul>
            {items.map(({ id, content }) => (
                <li key={id}>
                    <ListItemLink id={id}>
                        <ListItem id={id} content={content} />
                    </ListItemLink>
                </li>
            ))}
        </ul>
    );
}
