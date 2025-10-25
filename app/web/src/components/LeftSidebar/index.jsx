import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './LeftSidebar.module.css';

export default function LeftSidebar({ defaultCollapsed = true }) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    return (
        <aside className={`${styles.aside} ${collapsed ? styles.collapsed : ''}`} aria-label="Left navigation">
            <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setCollapsed(v => !v)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={collapsed ? 'Expand' : 'Collapse'}
            >
                {collapsed ? '>' : '<'}
            </button>

            {!collapsed && <div className={styles.title}>Navigation</div>}

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
