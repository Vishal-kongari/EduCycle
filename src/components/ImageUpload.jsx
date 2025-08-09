import React, { useState, useCallback } from 'react';
import './ImageUpload.css';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const ImageUpload = ({ onImagesSelected }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleFiles = useCallback((files) => {
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );

        const newPreviews = validFiles.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setPreviewImages(prev => [...prev, ...newPreviews]);
        if (onImagesSelected) {
            onImagesSelected(validFiles);
        }
    }, [onImagesSelected]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleFileInput = useCallback((e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    }, [handleFiles]);

    const removeImage = useCallback((indexToRemove) => {
        setPreviewImages(prev => {
            const newPreviews = prev.filter((_, index) => index !== indexToRemove);
            if (onImagesSelected) {
                onImagesSelected(newPreviews.map(preview => preview.file));
            }
            return newPreviews;
        });
    }, [onImagesSelected]);

    return (
        <div className="image-upload-container">
            <div
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                />
                <div className="upload-message">
                    <FaCloudUploadAlt />
                    <p>Drag and drop your images here</p>
                    <span>or click to select files</span>
                </div>
            </div>

            {previewImages.length > 0 && (
                <div className="preview-container">
                    {previewImages.map((preview, index) => (
                        <div key={preview.url} className="preview-image-wrapper">
                            <img
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                className="preview-image"
                            />
                            <button
                                className="remove-image-btn"
                                onClick={() => removeImage(index)}
                                type="button"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload; 