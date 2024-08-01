import {Dispatch, SetStateAction} from "react";
import styles from "@/components/ng-modal/ng-modal.module.css"
interface NgModalProps{
    isOpen:boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    title?:string
    text:string
    onConfirm:()=>void
}

export function NgModal({isOpen, setOpen, onConfirm, text, title}:NgModalProps){

    function closeModal(){
        setOpen(false)
    }

    return <div className={styles.modalOverlay} style={{display: isOpen ? "flex" : "none"}}>
        <div className={styles.modalBody}>
            <h1 className={styles.modalTitle}>{title || "Are you sure to continue?"}</h1>
            <p>{text}</p>
            <div className={styles.modalButtons}>
                <button className={"bossLink"} onClick={()=>{
                    onConfirm()
                    closeModal()
                }}>Confirm</button>
                <button className={"bossLink"}
                        onClick={closeModal}
                >Cancel</button>
            </div>
        </div>
    </div>

}