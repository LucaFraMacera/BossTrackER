import {SortDirection} from "@/lib/types";
import {ArrowsUpDownIcon, BarsArrowDownIcon, BarsArrowUpIcon, ChevronUpDownIcon} from "@heroicons/react/16/solid";
import styles from "@/components/sort-button/sort-button.module.css"
import {ReactNode} from "react";

interface SortButtonProps {
    className?: string
    sortDirection?: SortDirection
    onClick: () => void
    children?:ReactNode
}

export function SortButton({sortDirection, onClick, className, children}: SortButtonProps) {

    return <button className={className || styles.sortButtonDefault}
                   onClick={onClick}>
        {children}
        {sortDirection === "ASC" ? <BarsArrowDownIcon className={styles.sortButtonDefaultIcon}/>
            : sortDirection === "DESC" ? <BarsArrowUpIcon className={styles.sortButtonDefaultIcon}/>
            : <ChevronUpDownIcon className={styles.sortButtonDefaultIcon}/>}
    </button>

}