'use client'
import Link from "next/link";
import styles from "../app/home/page.module.css"
import {usePathname} from "next/navigation";
import {ReactNode} from "react";
import {useScreenSize} from "@/lib/useScreenSize";
import {HomeIcon, ListBulletIcon, NumberedListIcon, QueueListIcon} from "@heroicons/react/16/solid";
import MapIcon from "@/components/MapIcon";
import BonfireIcon from "@/components/BonfireIcon";
import ListIcon from "@/components/ListIcon";
import Image from "next/image";

interface MenuLinkProps{
    href:string,
    text:string,
    icon?:ReactNode
}

export function Menu(){

    const currentLocation = usePathname()
    const {isSmall} = useScreenSize()

    function MenuLink({href,text, icon}:MenuLinkProps){
        return <Link href={href} className={currentLocation == href? styles["active-link"]:""}>
            {isSmall ? icon : text}
        </Link>
    }

    return <nav className={styles["app-menu"]}>
        <Link className={styles["menu"]} href={"/home"}><Image src={"/logo.png"} alt={"Logo"} className={styles["menu-logo"]} width={100} height={50}/></Link>
       <div className={styles["app-menu-links"]}>
           <MenuLink href={"/home"} text={"Home"} icon={<BonfireIcon className={"icon"}/>} />
           <MenuLink href={"/home/list"} text={"List"} icon={<ListBulletIcon className={"icon"}/>} />
           <MenuLink href={"/home/map"} text={"Map"} icon={<MapIcon className={"icon"}/>} />
       </div>
    </nav>

}