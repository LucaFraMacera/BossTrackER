"use client"

import styles from "@/components/modal/modal.module.css";
import {useEffect, useState} from "react";
import {Loading} from "@/components/loading/Loading";

interface ModalButtonsProps{
    onConfirmation:()=>Promise<any>
    onClose:()=>void
    isConfirmReady:boolean
}

export function ModalButtons({onConfirmation, onClose, isConfirmReady}:ModalButtonsProps) {

    const [isLoading, setLoading] = useState<boolean>(false)
    const [ready, setReady] = useState<boolean>(isConfirmReady)

    return <div className={styles.modalButtons}>
        <button className={"bossLink"} disabled={isLoading || !isConfirmReady} onClick={() => {
            setLoading(true)
            onConfirmation().then(()=>{
                setLoading(false)
            })
        }}>Confirm
        </button>
        {isLoading && <Loading/>}
        <button disabled={isLoading} className={"bossLink"}
                onClick={onClose}
        >Cancel
        </button>
    </div>

}