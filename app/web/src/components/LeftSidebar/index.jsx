import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './LeftSidebar.module.css';

export default function LeftSidebar({ defaultCollapsed = true }) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    return (
        <aside
            className={`${styles.aside} ${collapsed ? styles.collapsed : styles.expanded}`}
            role="complementary"
            aria-label="Sidebar"
            aria-hidden={collapsed ? 'true' : 'false'}
        >
            <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setCollapsed(v => !v)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={collapsed ? 'Expand' : 'Collapse'}
                aria-expanded={!collapsed}
            >
                <svg className={styles.icon} aria-hidden="true" focusable="false">
                    <use href={`/icons.svg#${collapsed ? 'rightArrow' : 'leftArrow'}`} />
                </svg>
            </button>

            <ul className={styles.list}>
                <li>
                    <NavLink
                        to="/works"
                        className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                    >
                        works
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/characters"
                        className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                    >
                        characters
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/locations"
                        className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                    >
                        locations
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}
