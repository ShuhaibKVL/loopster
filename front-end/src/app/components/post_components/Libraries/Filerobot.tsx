'use client'

import dynamic from 'next/dynamic';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { FilerobotImageEditorConfig } from 'react-filerobot-image-editor';
import { RiImageEditFill } from "react-icons/ri";
import base64ToFile from '@/lib/utils/base63ToFile';
import { Inter } from 'next/font/google'

const FilerobotImageEditor = dynamic(() => import('react-filerobot-image-editor'), { ssr: false });

interface IFileRobot {
    mediaUrl: string;
    onSaveImage: (editedImageFile: File, editedImageBase64: string) => void;
}

const inter = Inter({
    subsets:['latin'],
    weight:['400','700']
})

const FileRobot = forwardRef(({ mediaUrl, onSaveImage }: IFileRobot, ref) => {

    const [isImgEditorShown, setIsImgEditorShown] = useState(false);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    console.log('inside filerobot :mediaUrl :',mediaUrl)

    
    useImperativeHandle(ref, () => ({
        openImgEditor() {
            console.log('image editor function invoked inside the editor >>>')
            setIsImgEditorShown(true);
        }
    }));

    const closeImgEditor = () => {
        setIsImgEditorShown(false);
    };

    const handleSave = (editedImageObject: any, designState: any) => {
        const base64Image = editedImageObject.imageBase64;
        setEditedImage(base64Image);
        if (base64Image) {
            const editedImageFile = base64ToFile(base64Image, 'edited-image.png');
            onSaveImage(editedImageFile, base64Image);
        }
        closeImgEditor();
    };

    const config: FilerobotImageEditorConfig = {
        source: mediaUrl,
        onSave: handleSave,
        onClose: closeImgEditor,
        annotationsCommon: {
            fill: 'var(--secondary-bg)'
        },
        theme:'bg-primary',
        tabsIds: ['Filters', 'Adjust', 'Finetune', 'Annotate'],
        defaultTabId: "Annotate",
        defaultToolId: "Text",
        savingPixelRatio: 1,
        previewPixelRatio: 1,
    };

    return (
        <div>
            <RiImageEditFill className='absolute bottom-2 right-1 w-6 h-6 text-secondary hidden' onClick={() => setIsImgEditorShown(true)} />
            {isImgEditorShown && (
                <FilerobotImageEditor {...config} />
            )}
        </div>
    );
});

export default FileRobot;
