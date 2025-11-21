import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCharacterImage, updateCharacter } from '../../redux/characters/operations';
import { generateCharacterInWorkImage, updateCharacterInWork } from '../../redux/works/operations';
import {
    selectGenerateCharacterImageLoading,
    selectGenerateCharacterImageError,
} from '../../redux/characters/selectors';
import {
    selectGenerateCharacterInWorkImageError,
    selectGenerateCharacterInWorkImageLoading,
} from '../../redux/works/selectors';
import { uploadImage } from '../../api/upload';
import styles from './ImageSection.module.css';

export default function CharacterImageSection({ characterId, workId, ciwId, name, imageUrl, disableAll }) {
    const dispatch = useDispatch();

    const generateLoading = useSelector(selectGenerateCharacterImageLoading);
    const generateLoadingCIW = useSelector(selectGenerateCharacterInWorkImageLoading);
    const generateError = useSelector(selectGenerateCharacterImageError);
    const generateErrorCIW = useSelector(selectGenerateCharacterInWorkImageError);

    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
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
            const action = await dispatch(generateCharacterInWorkImage({ workId, characterInWorkId: ciwId }));
            if (generateCharacterInWorkImage.fulfilled.match(action)) {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
                setUploadError('');
            }
        } else if (characterId) {
            const action = await dispatch(generateCharacterImage(characterId));
            if (generateCharacterImage.fulfilled.match(action)) {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
                setUploadError('');
            }
        }
    };

    const handleUploadImage = async file => {
        if (!file) return;
        try {
            setUploading(true);
            setUploadError('');

            const fd = new FormData();
            fd.append('file', file);

            const res = await uploadImage(fd);
            const url = res?.url;

            if (!url || typeof url !== 'string') {
                throw new Error('Upload succeeded but no URL was returned');
            }

            if (ciwId && workId) {
                const action = await dispatch(
                    updateCharacterInWork({
                        workId,
                        characterInWorkId: ciwId,
                        data: { image_url: url },
                    })
                );
                if (updateCharacterInWork.fulfilled.match(action)) {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl('');
                }
            } else if (characterId) {
                const action = await dispatch(updateCharacter({ id: characterId, data: { image_url: url } }));
                if (updateCharacter.fulfilled.match(action)) {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl('');
                }
            }
        } catch (err) {
            setUploadError(err?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.imageColumn}>
            <span className={styles.label}>Image</span>

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
                        {String(generateError)}
                    </p>
                )}
                {generateErrorCIW && (
                    <p role="alert" className={styles.error}>
                        {String(generateErrorCIW)}
                    </p>
                )}
                <div className={styles.imageActions}>
                    <button
                        type="button"
                        className="primaryBtn"
                        onClick={() => setUploadOpen(true)}
                        disabled={uploading || disableAll || generateLoading || generateLoadingCIW}
                        aria-label="Upload and attach image"
                        title="Upload and attach image"
                    >
                        {uploading ? 'Uploading...' : 'Upload & Attach'}
                    </button>
                    <button
                        type="button"
                        className="primaryBtn"
                        onClick={handleGenerateImage}
                        disabled={generateLoading || disableAll || uploading || generateLoadingCIW}
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

                        <div className={styles.field}>
                            <label className={styles.label}>
                                Choose file
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async e => {
                                        setUploadError('');
                                        const inputEl = e.currentTarget;
                                        const file = inputEl.files?.[0];
                                        if (!file) return;

                                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                                        setPreviewUrl(URL.createObjectURL(file));

                                        await handleUploadImage(file);
                                        setUploadOpen(false);
                                        inputEl.value = '';
                                    }}
                                    disabled={uploading || disableAll}
                                />
                            </label>
                        </div>

                        {uploadError && (
                            <p role="alert" className={styles.error}>
                                {uploadError}
                            </p>
                        )}

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                onClick={() => {
                                    setUploadError('');
                                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                                    setPreviewUrl('');
                                    setUploadOpen(false);
                                }}
                                disabled={uploading}
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
