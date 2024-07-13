import {Menu} from "@/components/Menu";
import styles from "./page.module.css";

export default function AppLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return <div className={styles.appBody}>
        <Menu/>
        {children}
    </div>
}