export default function Title({ children, id, ...rest }) {
    return (
        <h2 id={id} {...rest}>
            {children}
        </h2>
    );
}
