import {Dispatch, PropsWithChildren, ReactElement, SetStateAction} from "react";
import styles from "@/components/modal/modal.module.css";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {ModalButtons} from "@/components/modal/modal-buttons";

export interface ModalProps{
    isOpen:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    title:string
    onConfirmation?:()=>any
    isConfirmReady:boolean
}


export function Modal({isOpen, setOpen, title, onConfirmation, isConfirmReady, children}:PropsWithChildren<ModalProps>) {
    function closeModal(){
        setOpen(false)
    }

    return <div className={styles.modalOverlay} style={{display: isOpen ? "flex" : "none"}}>
        <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
                <h1 className={styles.modalTitle}>{title || ""}</h1>
                <XMarkIcon className={styles.modalCloseIcon} onClick={() => closeModal()}></XMarkIcon>
            </div>
            <div className={styles.modalBody}>
                {children}
            </div>
            {onConfirmation != undefined &&
                <ModalButtons onConfirmation={onConfirmation} onClose={closeModal} isConfirmReady={isConfirmReady}/>
            }
        </div>
    </div>
}