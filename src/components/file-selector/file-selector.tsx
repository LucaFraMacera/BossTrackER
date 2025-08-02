"use client"
import {Dispatch, SetStateAction} from "react";
import styles from "@/components/file-selector/file-selector.module.css"
import {ArrowDownOnSquareIcon, TrashIcon} from "@heroicons/react/24/outline";

interface FileSelectorProps {
    acceptedFileTypes: string
    file?: File
    setFile: Dispatch<SetStateAction<File | undefined>>
}

export function FileSelector({acceptedFileTypes, file, setFile}: FileSelectorProps) {

    const INPUT_NAME = "file-input"

    return <form className={styles.fileSelectorContainer}>
        <label htmlFor={INPUT_NAME} className={styles.fileSelectorIcon}>
            {!file &&
                <>
                    <ArrowDownOnSquareIcon className={styles.fileIcon}/>
                    <span className={styles.selectedFileLabel}>Click and select a file.</span>
                </>
            }

            <input id={INPUT_NAME} name={INPUT_NAME} className={styles.selector}
                   type={"file"}
                   onChange={(event) => {
                       if(event.target) {
                           const files = event.target.files;
                           if (files) {
                               setFile(files[0])
                           }
                       }
                   }}
                   accept={acceptedFileTypes}
            />
        </label>
        <button className={styles.resetButton} type={"reset"}
                onClick={() => {
                    setFile(undefined)
                }}
                style={{visibility: file ? "visible" : "hidden", height: file ? "100%" : "0"}}
        >
            <TrashIcon className={styles.fileIcon}/>
        </button>
        {file &&
            <span className={styles.selectedFileLabel}>{file.name}</span>
        }
    </form>


}