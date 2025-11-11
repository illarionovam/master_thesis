import CytoscapeComponent from 'react-cytoscapejs';

const elements = [
    { data: { id: 'A', label: 'A' } },
    { data: { id: 'B', label: 'B' } },
    { data: { id: 'e1', source: 'A', target: 'B', label: 'ally' } },
];
const stylesheet = [
    { selector: 'node', style: { label: 'data(label)' } },
    { selector: 'edge', style: { label: 'data(label)', 'curve-style': 'bezier', 'target-arrow-shape': 'triangle' } },
];

export default () => <CytoscapeComponent elements={elements} stylesheet={stylesheet} style={{ height: 400 }} />;
