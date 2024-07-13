import styles from "./counter.module.css"
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
        {value > min && !disabled && <button className={styles.counterBoxButton} onClick={onDecrement}>-</button>}
        <label>{value}</label>
        {value < max && !disabled && <button className={styles.counterBoxButton} onClick={onIncrement}>+</button>}
    </div>
}