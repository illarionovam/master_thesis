import { useId } from 'react';

export default function HomePage() {
    const titleId = useId();

    return (
        <section aria-labelledby={titleId}>
            <header>
                <h1 id={titleId}>HOME</h1>
            </header>
        </section>
    );
}
