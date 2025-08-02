"use client"
import {Modal, ModalProps} from "@/components/modal/modal";
import styles from "@/components/modal/custom-modals.module.css"
import {useContext, useState} from "react";
import {DatabaseDump} from "@/lib/database/db.model";
import {DatabaseContext} from "@/components/App";
import {Loading} from "@/components/loading/Loading";
import {FileSelector} from "@/components/file-selector/file-selector";
import {extractFileExtension} from "@/lib/utils";
import {useRouter} from "next/navigation";

interface UploadModalProps extends Omit<ModalProps, "isConfirmReady"> {
}

export default function UploadModal({isOpen, setOpen, title}: UploadModalProps) {

    const db = useContext(DatabaseContext)
    const [errors, setErrors] = useState<string>("")
    const [file, setFile] = useState<File>()
    const [isLoading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    function uploadFile() {
        if (!file || file.size <= 0) {
            setErrors("File is empty!")
            return
        }
        if(extractFileExtension(file.name) !== "tracker") {
            setErrors("File extension is incorrect. Can only accept .tracker files.!")
            return;
        }
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string
                const parsed = JSON.parse(text) as DatabaseDump
                db.uploadData(parsed)
                    .then(()=>{
                        setOpen(false)
                        router.refresh()
                     })
                    .catch(errors=>{
                        setErrors(errors)
                    })
            } catch (err) {
                setErrors("The file content is incorrect or corrupted. Please select a correct tracker file!")
            }
        }
        reader.onprogress = ((event) => {
            if(!isLoading) {
                setLoading(true)
            }
        })
        reader.onloadend = (event) => {
            setLoading(false)
        }
        reader.readAsText(file)
    }

    return <Modal isOpen={isOpen} setOpen={setOpen} isConfirmReady={file != undefined} title={title || "Save Journey"} onConfirmation={async () => {
        uploadFile()
    }}>
        <div className={styles.content}>
            <p className={styles.warningLabel}>WARNING!</p>
            <p>Once you upload another progress you will lose the current one. Be sure to save the current progress before continuing.</p>
            <FileSelector setFile={setFile} file={file} acceptedFileTypes={".tracker"}/>
            {isLoading && <Loading/>}
            <span className={styles.errorLabel}>{errors}</span>
        </div>
    </Modal>

}