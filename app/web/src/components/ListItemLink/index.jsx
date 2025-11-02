import { Link } from 'react-router-dom';

export default function ListItemLink({ to, children }) {
    return <Link to={to}>{children}</Link>;
}
