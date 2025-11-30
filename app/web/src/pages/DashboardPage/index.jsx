import { useEffect, useRef, useState, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CytoscapeComponent from 'react-cytoscapejs';

import styles from './DashboardPage.module.css';

import { selectGlobalLoading } from '../../redux/globalSelectors';

import { getWorkCast, getWorkRelationships } from '../../redux/works/operations';
import {
    selectGetWorkCastError,
    selectWorkCast,
    selectGetWorkRelationshipsError,
    selectWorkRelationships,
} from '../../redux/works/selectors';

function mapCastToNodes(cast = []) {
    return cast.map(c => ({
        data: {
            id: String(c.id),
            label: c.character.name,
        },
    }));
}

function mapRelationshipsToEdges(rels = [], focusId) {
    const filtered =
        focusId == null
            ? rels
            : rels.filter(
                  r =>
                      String(r.from_character_in_work_id) === String(focusId) ||
                      String(r.to_character_in_work_id) === String(focusId)
              );

    return filtered.map(r => ({
        data: {
            id: String(r.id),
            source: String(r.from_character_in_work_id),
            target: String(r.to_character_in_work_id),
            label: r.type,
        },
    }));
}

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { id, characterInWorkId } = useParams();
    const titleId = useId();

    const globalLoading = useSelector(selectGlobalLoading);

    const cast = useSelector(selectWorkCast);
    const rels = useSelector(selectWorkRelationships);

    const castError = useSelector(selectGetWorkCastError);
    const relsError = useSelector(selectGetWorkRelationshipsError);

    const globalError = castError ?? relsError;

    const cyRef = useRef(null);
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

    useEffect(() => {
        if (!id) return;
        dispatch(getWorkCast(id));
        dispatch(getWorkRelationships(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (!cast || !rels) {
            setElements([]);
            return;
        }

        const edges = mapRelationshipsToEdges(rels, characterInWorkId ?? null);
        const nodesAll = mapCastToNodes(cast);

        let nodes = nodesAll;
        if (characterInWorkId != null) {
            const connectedIds = new Set(edges.flatMap(e => [String(e.data.source), String(e.data.target)]));
            nodes = nodesAll.filter(n => connectedIds.has(String(n.data.id)));
        }

        setElements([...nodes, ...edges]);
    }, [cast, rels, characterInWorkId]);

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
        <main aria-labelledby={titleId} className="page">
            {globalError && (
                <p role="alert" className="infoMessage error">
                    {globalError}
                </p>
            )}
            {!globalLoading && !globalError && cast && rels && (
                <CytoscapeComponent
                    elements={CytoscapeComponent.normalizeElements(elements)}
                    stylesheet={stylesheet}
                    style={{ height: '770px' }}
                    cy={onCyReady}
                />
            )}
        </main>
    );
}
