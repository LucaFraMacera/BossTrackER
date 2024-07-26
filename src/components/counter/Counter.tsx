import styles from "./counter.module.css"
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";
interface CounterProps{
    value:number
    min?:number
    max?:number
    onIncrement:()=>void
    onDecrement:()=>void
    disabled?:boolean

}
export function Counter({value, onIncrement, onDecrement, disabled=false, min=-Infinity, max=Infinity}:CounterProps){
    return <div className={styles.counterBox}>
        {!disabled && <button className={styles.counterBoxButton} disabled={value <= min} onClick={onDecrement}>
            <MinusIcon className={styles.counterBoxButtonIcon}/>
        </button>}
        <label>{value}</label>
        {!disabled && <button className={styles.counterBoxButton} disabled={value >= max} onClick={onIncrement}>
            <PlusIcon className={styles.counterBoxButtonIcon}/>
        </button>}
    </div>
}