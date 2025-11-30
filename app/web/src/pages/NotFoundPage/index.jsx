import { useId } from 'react';

import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
    const titleId = useId();

    return (
        <main aria-labelledby={titleId} className="page">
            <h2 id={titleId}>Page not found.</h2>
        </main>
    );
}
