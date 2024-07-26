import Link from "next/link";
import styles from "@/components/boss-link/boss-link.module.css"
interface BossLinkProps{
    className?:string
    bossId:number
    text:string
}

export function BossLink({className, bossId, text}:BossLinkProps){
    return <Link className={className || styles.bossLink} href={`/home/map?boss=${bossId}`}>{text}</Link>
}