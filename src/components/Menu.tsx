'use client'
import Link from "next/link";
import styles from "../app/home/page.module.css"
import {usePathname} from "next/navigation";

interface MenuLinkProps{
    href:string,
    text:string
}

export function Menu(){

    const currentLocation = usePathname()

    function MenuLink({href,text}:MenuLinkProps){
        return <Link href={href} className={currentLocation == href? styles["active-link"]:""}>{text}</Link>
    }

    return <nav className={styles["app-menu"]}>
        <MenuLink href={"/home"} text={"Home"}/>
        <MenuLink href={"/home/list"} text={"List"}/>
        <MenuLink href={"/home/map"} text={"Interactive Map"}/>
    </nav>

}