'use client'
import {Component, useEffect, useState} from "react";
import {Icon} from "@/app/components/Icon";

interface DropdownItem{
    icon?:Component
    title:string
    text:string
}

interface DropdownProps{
    title:string
    items:DropdownItem[]
}
export function Dropdown({title, items}:DropdownProps){

    const [open, setOpen] = useState(false)

    return <div className="dropdown">
        <label onClick={()=>setOpen(!open)}>{title} <Icon src={"/icons/chevron.svg"}/></label>
        <div style={{height: open? "auto" : "0", transform:open?"scaleY(100%) translateY(0)" : "scaleY(0) translateY(-50%)"}}
            className="dropdown-items">
            {items.map(item=>{
                return <div key={"dropdown_item"+item.title}>
                    {item.icon ? item.icon : ""}
                    <b>{item.title}</b>: {item.text}
                </div>
            })}
        </div>
    </div>

}