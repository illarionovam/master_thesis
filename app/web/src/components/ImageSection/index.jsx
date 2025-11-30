import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCharacterImage, updateCharacter } from '../../redux/characters/operations';
import { generateCharacterInWorkImage, updateCharacterInWork } from '../../redux/works/operations';
import { uploadImageHelper } from '../../redux/helpers/operations';
import { selectGenerateCharacterImageError } from '../../redux/characters/selectors';
import { selectGenerateCharacterInWorkImageError } from '../../redux/works/selectors';
import { selectUploadImageError } from '../../redux/helpers/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

import styles from './ImageSection.module.css';

export default function CharacterImageSection({ characterId, workId, ciwId, name, imageUrl }) {
    const dispatch = useDispatch();

    const globalLoading = useSelector(selectGlobalLoading);

    const generateError = useSelector(selectGenerateCharacterImageError);
    const generateErrorCIW = useSelector(selectGenerateCharacterInWorkImageError);
    const uploadImageError = useSelector(selectUploadImageError);

    const [previewUrl, setPreviewUrl] = useState('');
    const [uploadOpen, setUploadOpen] = useState(false);

    const uploadRef = useRef(null);

    useEffect(() => {
        const dlg = uploadRef.current;
        if (!dlg) return;
        if (uploadOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [uploadOpen]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleGenerateImage = async () => {
        if (ciwId && workId) {
            dispatch(generateCharacterInWorkImage({ workId, characterInWorkId: ciwId }));
        } else if (characterId) {
            dispatch(generateCharacterImage(characterId));
        }

        setPreviewUrl('');
    };

    const handleUploadImage = async file => {
        if (!file) return;

        setUploadOpen(false);

        const fd = new FormData();
        fd.append('file', file);

        const { url } = await dispatch(uploadImageHelper(fd)).unwrap();

        if (ciwId && workId) {
            dispatch(
                updateCharacterInWork({
                    workId,
                    characterInWorkId: ciwId,
                    data: { image_url: url },
                })
            );
        } else if (characterId) {
            dispatch(updateCharacter({ id: characterId, data: { image_url: url } }));
        }

        setPreviewUrl('');
    };

    return (
        <div className={styles.imageColumn}>
            <span className="label">Image</span>

            <div className={styles.portraitWrap}>
                {previewUrl ? (
                    <img className={styles.portraitImg} src={previewUrl} alt="Preview" />
                ) : imageUrl ? (
                    <img className={styles.portraitImg} src={imageUrl} alt={`${name ?? 'Character'} image`} />
                ) : (
                    <div className={styles.portraitEmpty}>No image</div>
                )}
            </div>

            <div className={styles.uploader}>
                {generateError && (
                    <p role="alert" className={styles.error}>
                        {generateError}
                    </p>
                )}
                {generateErrorCIW && (
                    <p role="alert" className={styles.error}>
                        {generateErrorCIW}
                    </p>
                )}
                {uploadImageError && (
                    <p role="alert" className={styles.error}>
                        {uploadImageError}
                    </p>
                )}
                <div className={styles.imageActions}>
                    <button
                        type="button"
                        className="primaryBtn"
                        onClick={() => setUploadOpen(true)}
                        disabled={globalLoading}
                        aria-label="Upload and attach image"
                        title="Upload and attach image"
                    >
                        Upload & Attach
                    </button>
                    <button
                        type="button"
                        className="primaryBtn"
                        onClick={handleGenerateImage}
                        disabled={globalLoading}
                        aria-label="Generate image"
                        title="Generate image"
                    >
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="/icons.svg#wand" />
                        </svg>
                    </button>
                </div>
            </div>

            {uploadOpen && (
                <dialog
                    ref={uploadRef}
                    className="dialog"
                    aria-labelledby="upload-title"
                    onClose={() => {
                        setUploadOpen(false);
                    }}
                >
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="upload-title" className={styles.modalTitle}>
                            Upload image
                        </h3>

                        <div className="field">
                            <label className="label">
                                Choose file
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async e => {
                                        const inputEl = e.currentTarget;
                                        const file = inputEl.files?.[0];
                                        if (!file) return;

                                        setPreviewUrl(URL.createObjectURL(file));

                                        await handleUploadImage(file);
                                        inputEl.value = '';
                                    }}
                                    disabled={globalLoading}
                                />
                            </label>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewUrl('');
                                    setUploadOpen(false);
                                }}
                                disabled={globalLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </dialog>
            )}
        </div>
    );
}
