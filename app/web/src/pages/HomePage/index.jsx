import { useId } from 'react';
import { Link } from 'react-router-dom';
import Title from '../../components/Title';
import styles from './HomePage.module.css';

export default function HomePage() {
    const titleId = useId();

    return (
        <main aria-labelledby={titleId} className="page centered">
            <section className={styles.hero}>
                <Title id={titleId} className={styles.heroTitle}>
                    Welcome to Narrive
                </Title>

                <p className={styles.tagline}>
                    Capture works, characters, locations, events, and the relationships between them in one clean,
                    structured space. Let your imagination roam free—we'll take care of the details.
                </p>

                <div className={styles.actions}>
                    <Link to="/works" className={styles.actionBtn}>
                        Open works
                    </Link>
                    <Link to="/characters" className={styles.actionBtn}>
                        Browse characters
                    </Link>
                    <Link to="/locations" className={styles.actionBtn}>
                        Explore locations
                    </Link>
                </div>
            </section>

            <section className={styles.grid} aria-label="Quick start">
                <article className={`card ${styles.homeCard}`}>
                    <h2 className={styles.title}>Works</h2>
                    <p className={styles.text}>
                        Create projects for novels, visual novels, or shared universes. Keep outlines, tones, and core
                        ideas together so every story has a clear spine.
                    </p>
                    <p className={`${styles.text} ${styles.muted}`}>
                        Use works as containers for everything that belongs to a single book, route, or setting.
                    </p>
                    <Link to="/works">Go to works →</Link>
                </article>

                <article className={`card ${styles.homeCard}`}>
                    <h2 className={styles.title}>Characters</h2>
                    <p className={styles.text}>
                        Follow your cast across multiple works. Track arcs, dynamics, and on-page history so no
                        relationship or detail quietly drifts out of canon.
                    </p>
                    <p className={`${styles.text} ${styles.muted}`}>
                        Attach characters to scenes, link them to each other, and let the graph reveal the relationships
                        between them.
                    </p>
                    <Link to="/characters">Go to characters →</Link>
                </article>

                <article className={`card ${styles.homeCard}`}>
                    <h2 className={styles.title}>Locations & Events</h2>
                    <p className={styles.text}>
                        Anchor your story in time and space. Connect events to locations and participants so timelines
                        stay consistent even when plots jump around.
                    </p>
                    <p className={`${styles.text} ${styles.muted}`}>
                        Think of it as a quiet map of where and when everything happens—always one click away.
                    </p>
                    <Link to="/locations">Go to locations →</Link>
                </article>
            </section>

            <section className={styles.hint} aria-label="Tip">
                <p>
                    Tip: when in doubt, start with a <strong>work</strong> and one pivotal scene. You can always add
                    more characters, locations, and events later—the relationship graph will grow alongside your draft.
                </p>
            </section>
        </main>
    );
}
