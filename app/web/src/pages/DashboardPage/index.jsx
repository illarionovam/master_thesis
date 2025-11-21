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

function mapRelationshipsToEdges(rels = [], focusId) {
    const filtered =
        focusId == null
            ? rels
            : rels.filter(
                  r => String(r.from_character_in_work_id) === focusId || String(r.to_character_in_work_id) === focusId
              );

    return filtered.map(r => ({
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
    const { id, characterInWorkId } = useParams();

    const cyRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [elements, setElements] = useState([]);

    const stylesheet = [
        {
            selector: 'node',
            style: {
                label: 'data(label)',
                shape: 'round-rectangle',

                width: 80,
                height: 40,

                'background-color': '#ffffff',
                'border-width': 1,
                'border-color': '#000000',
                'border-opacity': 0.08,

                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': 10,
                'font-weight': 600,
                color: '#111827',

                'text-wrap': 'wrap',
                'text-max-width': 70,
            },
        },
        {
            selector: 'edge',
            style: {
                label: 'data(label)',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'arrow-scale': 1,
                'line-color': '#000000',
                'line-opacity': 0.08,
                'target-arrow-color': '#000000',
                'target-arrow-opacity': 0.08,
                'font-size': 8,
                color: '#111827',
                'text-rotation': 'autorotate',
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

        const edges = mapRelationshipsToEdges(relsRes, characterInWorkId);
        const nodesAll = mapCastToNodes(castRes);

        let nodes = nodesAll;
        if (characterInWorkId != null) {
            const connectedIds = new Set(edges.flatMap(e => [e.data.source, e.data.target].map(String)));
            nodes = nodesAll.filter(n => connectedIds.has(n.data.id));
        }

        setElements([...nodes, ...edges]);

        setLoading(false);
    }, [dispatch, id, characterInWorkId]);

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
