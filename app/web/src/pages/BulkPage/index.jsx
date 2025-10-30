import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../components/Title';

export default function BulkPage({
    title,
    fetchAction,
    selectData,
    selectLoading,
    selectError,
    render,
    CreateModal,
    createAction,
    createModalProps = {},
    onCreated,
}) {
    const titleId = useId();
    const dispatch = useDispatch();

    const data = useSelector(selectData);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    const [openCreate, setOpenCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState(null);

    useEffect(() => {
        dispatch(fetchAction());
    }, [dispatch, fetchAction]);

    const handleOpenCreate = () => {
        setCreateError(null);
        setOpenCreate(true);
    };

    const handleCloseCreate = () => {
        if (creating) return;
        setOpenCreate(false);
        setCreateError(null);
    };

    const handleSubmitCreate = async formData => {
        setCreating(true);
        setCreateError(null);
        try {
            const res = await dispatch(createAction(formData)).unwrap();
            onCreated?.(res);
            setOpenCreate(false);
        } catch (e) {
            setCreateError(e?.message || 'Failed to create');
        } finally {
            setCreating(false);
        }
    };

    return (
        <main aria-labelledby={titleId} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Title id={titleId} style={{ margin: 0 }}>
                    {title}
                </Title>

                {CreateModal && createAction && (
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        aria-label={`Create ${title}`}
                        title={`Create ${title}`}
                        style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                            fontSize: 18,
                            lineHeight: 1,
                            background: '#fff',
                        }}
                    >
                        +
                    </button>
                )}
            </div>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && render?.(data)}

            {CreateModal && openCreate && (
                <CreateModal
                    {...createModalProps}
                    open={openCreate}
                    mode="create"
                    onClose={handleCloseCreate}
                    onSubmit={handleSubmitCreate}
                    submitting={creating}
                    error={createError}
                />
            )}
        </main>
    );
}
