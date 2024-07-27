import styles from "@/components/progress-bar/progress-bar.module.css"

interface ProgressBarProps{
    value?:number
    label?:string
    max:number
    className?:string
}

export function ProgressBar({value, max, label,className}:ProgressBarProps){

    const percentage = value <= max ? value / max * 100 : 0

    return <div className={className || styles.barBox}>
        {label && <label>{label}</label>}
        <div className={styles.progressBarOuter}>
            <div className={styles.progressBarInner}
                 style={{transform: `translateX(-${100 - percentage}%)`}}
            ></div>
        </div>
    </div>
}