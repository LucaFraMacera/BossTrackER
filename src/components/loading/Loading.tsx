import styles from "@/components/loading/loading.module.css"
export function Loading(){
    return <div className={styles.loadingOuter}>
        <div className={styles.loadingInner}/>
    </div>
}