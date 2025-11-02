import { useId } from 'react';
import Title from '../../components/Title';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
    const titleId = useId();

    return (
        <main aria-labelledby={titleId} className={styles.page}>
            <Title id={titleId}>Page not found.</Title>
        </main>
    );
}
