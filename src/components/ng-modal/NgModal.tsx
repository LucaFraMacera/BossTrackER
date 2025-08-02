import styles from "@/components/ng-modal/ng-modal.module.css"
import {Modal, ModalProps} from "@/components/modal/modal";

interface NgModalProps extends ModalProps{
    text:string
}

export function NgModal({isOpen, setOpen, title, text, onConfirmation}:NgModalProps){

    return

}