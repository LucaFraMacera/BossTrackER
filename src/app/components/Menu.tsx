import Link from "next/link";
import styles from "../home/page.module.css"
export function Menu(){

    return <nav className={styles["app-menu"]}>
        <Link href={"/home"}>Home</Link>
        <Link href={"/home/list"} >List</Link>
        <Link href={"/home"} >Option</Link>
        <Link href={"/home"} >Option</Link>
    </nav>

}