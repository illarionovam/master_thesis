import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../components/Title';
import styles from './BulkPageLayout.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function BulkPageLayout({
    title,
    fetchAction,
    selectData,
    selectError,
    render,
    CreateModal,
    createAction,
    createModalProps = {},
    onCreated,
}) {
    const titleId = useId();
    const dispatch = useDispatch();

    const globalLoading = useSelector(selectGlobalLoading);

    const data = useSelector(selectData);
    const error = useSelector(selectError);

    const [openCreate, setOpenCreate] = useState(false);
    const [navigatingAfterCreate, setNavigatingAfterCreate] = useState(false);

    useEffect(() => {
        if (data.length === 0) {
            dispatch(fetchAction());
        }
    }, [dispatch, data.length, fetchAction]);

    const handleOpenCreate = () => {
        setOpenCreate(true);
    };

    const handleCloseCreate = () => {
        setOpenCreate(false);
    };

    const handleSubmitCreate = async formData => {
        setOpenCreate(false);
        setNavigatingAfterCreate(true);

        const res = await dispatch(createAction(formData)).unwrap();
        onCreated?.(res);

        const action = await dispatch(createAction(formData));

        if (createAction.fulfilled.match(action)) {
            onCreated?.(action.payload);
        } else {
            setNavigatingAfterCreate(false);
        }
    };

    const modalProps = { ...createModalProps, parentOptions: data };

    return (
        <main aria-labelledby={titleId} className="page">
            {error && <p role="alert">{error}</p>}
            {!globalLoading && !error && data && !navigatingAfterCreate && (
                <>
                    <div className={styles.header}>
                        <Title id={titleId}>{title}</Title>
                    </div>
                    {render?.(data)}
                </>
            )}

            {CreateModal && createAction && (
                <>
                    <button
                        type="button"
                        className={`roundBtn ${styles.fab}`}
                        onClick={handleOpenCreate}
                        aria-label={`Create ${title}`}
                        title={`Create ${title}`}
                    >
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="/icons.svg#plus" />
                        </svg>
                    </button>

                    {openCreate && (
                        <CreateModal
                            {...modalProps}
                            open={openCreate}
                            mode="create"
                            onClose={handleCloseCreate}
                            onSubmit={handleSubmitCreate}
                            error={error}
                        />
                    )}
                </>
            )}
        </main>
    );
}
