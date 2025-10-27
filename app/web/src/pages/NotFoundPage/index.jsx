import { useId } from 'react';
import Title from '../../components/Title';

export default function NotFoundPage() {
    const titleId = useId();

    return (
        <main aria-labelledby={titleId}>
            <Title id={titleId}>Page not found.</Title>
        </main>
    );
}
