import { useId } from 'react';
import Title from '../../components/Title';
import styles from './HomePage.module.css';

export default function HomePage() {
    const titleId = useId();

    return (
        <main aria-labelledby={titleId} className={styles.page}>
            <Title id={titleId}>HOME</Title>
        </main>
    );
}
