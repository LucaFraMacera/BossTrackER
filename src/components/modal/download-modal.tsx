"use client"
import {Modal, ModalProps} from "@/components/modal/modal";
import {useContext, useEffect, useState} from "react";
import {DatabaseContext} from "@/components/App";
import styles from "@/components/modal/custom-modals.module.css"

interface DownloadModalProps extends Omit<ModalProps, "isConfirmReady"> {
}

export default function DownloadModal({isOpen, setOpen, title}: DownloadModalProps) {

    const db = useContext(DatabaseContext)
    const [filename, setFilename] = useState<string>("boss-tracker-data")
    const [errors, setErrors] = useState<string>()

    function checkPattern(filename: string) {
        if (!filename) {
            return false
        }
        const pattern = /^([a-zA-Z0-9])[a-z_\-.A-Z0-9]*([a-zA-Z0-9])$/
        return filename.match(pattern)
    }

    async function downloadStats() {
        const databaseDump = await db.loadAllData()
        if (filename.length === 0) {
            setErrors("Filename must not be empty!")
            return false
        }
        if (!checkPattern(filename)) {
            setErrors("Filename cannot contain special characters!")
            return false
        }
        if (databaseDump) {
            const json = JSON.stringify(databaseDump, null, 2);
            const blob = new Blob([json], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${filename}.tracker`
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return true
        }
    }

    return <Modal isOpen={isOpen} setOpen={setOpen} isConfirmReady={filename.length > 0} title={title || "Save Journey"} onConfirmation={async ()=>{
        const result = await downloadStats()
        setOpen(!result)
    }}>
        <div className={styles.content}>
            <span className={styles.contentLabel}>Insert filename</span>
            <input type={"text"}
                   placeholder={"boss-tracker-data"}
                   className={"filterInput"}
                   onChange={(event) => {
                       const newFilename = event.target.value
                       setFilename(newFilename)
                   }}
            />
            <span className={styles.errorLabel}>{errors}</span>
        </div>
    </Modal>

}