"use client"
import {Modal, ModalProps} from "@/components/modal/modal";
import {useContext, useState} from "react";
import {DatabaseContext} from "@/components/App";
import {DEFAULT_BOSS_LIST} from "@/lib/database/defaultData";
import {useRouter} from "next/navigation";
import styles from "@/components/modal/custom-modals.module.css"

export interface ResetModalProps extends Omit<ModalProps, "isConfirmReady">{}

export function ResetModal({isOpen, title, setOpen}:ResetModalProps){

    const db = useContext(DatabaseContext)
    const router = useRouter()
    const [errors, setErrors] = useState<string>()

    async function resetProgress() {
        try {
            await db.uploadData({bosses:DEFAULT_BOSS_LIST, ngData:[]})
            setOpen(false)
            router.refresh()
        }catch (error) {
            setErrors(`Something went wrong : ${error}`)
        }
    }

    return <Modal isOpen={isOpen} setOpen={setOpen} title={title} onConfirmation={resetProgress} isConfirmReady={true}>
        <p className={styles.bodyLabel}>Are you sure you want to completely reset your progress?</p>
        <p className={styles.warningLabel}>WARNING!</p>
        <p>Once you do you won&apos;t be able to restore it.
            Make sure you save your current progress before continuing.</p>
        <p className={styles.errorLabel}>
            {errors}
        </p>
    </Modal>
}