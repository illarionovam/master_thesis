import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './DashboardPage.module.css';

import { getWorkCast, getWorkRelationships } from '../../redux/works/operations';

function mapCastToNodes(cast = []) {
    return cast.map(c => ({
        data: {
            id: c.id,
            label: c.character.name,
        },
    }));
}

function mapRelationshipsToEdges(rels = []) {
    return rels.map(r => ({
        data: {
            id: r.id,
            source: r.from_character_in_work_id,
            target: r.to_character_in_work_id,
            label: r.type,
        },
    }));
}

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { id } = useParams();

    const cyRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [elements, setElements] = useState([]);

    const stylesheet = [
        {
            selector: 'node',
            style: {
                label: 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': 6,
                'background-color': '#6aa9ff',
                color: '#111',
                'text-wrap': 'wrap',
                width: 60,
                height: 30,
            },
        },
        {
            selector: 'edge',
            style: {
                label: 'data(label)',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'arrow-scale': 1,
                'line-color': '#888',
                'target-arrow-color': '#888',
                'font-size': 6,
                'text-background-color': '#fff',
                'text-background-opacity': 0.8,
                'text-background-padding': 2,
            },
        },
    ];

    const refresh = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError('');

        const [castRes, relsRes] = await Promise.all([
            dispatch(getWorkCast(id)).unwrap(),
            dispatch(getWorkRelationships(id)).unwrap(),
        ]);

        const nodes = mapCastToNodes(castRes);
        const edges = mapRelationshipsToEdges(relsRes);

        setElements([...nodes, ...edges]);

        setLoading(false);
    }, [dispatch, id]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        const cy = cyRef.current;
        if (!cy || elements.length === 0) return;
        cy.layout({
            name: 'cose',
            fit: true,
            padding: 20,
            animate: false,
            nodeRepulsion: 8000,
            idealEdgeLength: 80,
        }).run();
        cy.fit(undefined, 20);
    }, [elements]);

    const onCyReady = cy => {
        cyRef.current = cy;
    };

    return (
        <div className={styles.container}>
            <div>
                <h1>Work graph</h1>
                {loading && <span>Loading...</span>}
                {error && <span>{error}</span>}
            </div>

            <div className={styles.chart}>
                <CytoscapeComponent
                    elements={CytoscapeComponent.normalizeElements(elements)}
                    stylesheet={stylesheet}
                    style={{ height: '100%' }}
                    cy={onCyReady}
                />
            </div>
        </div>
    );
}
