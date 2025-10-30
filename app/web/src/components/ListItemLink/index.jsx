import { Link } from 'react-router-dom';

export default function ListItemLink({ id, children }) {
    return <Link to={String(id)}>{children}</Link>;
}
