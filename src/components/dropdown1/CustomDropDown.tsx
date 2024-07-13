import {ReactNode, useState} from "react";
import {
    AdjustmentsHorizontalIcon,
    ChevronDoubleLeftIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from "@heroicons/react/16/solid";
import {XMarkIcon} from "@heroicons/react/24/outline";

interface ComplexDropdownProps{
    title:string
    children:ReactNode
    isVertical?:boolean
}

export function ComplexDropdown({children, title, isVertical}:ComplexDropdownProps){

    const [open, setOpen] = useState(!isVertical)
    return <div className="dropdown">
        {!isVertical ?
            <>
            <label onClick={()=>setOpen(!open)}>{title}
                {open ? <ChevronUpIcon className={"icon"}></ChevronUpIcon> : <ChevronDownIcon className={"icon"}></ChevronDownIcon>}
            </label>
            <div style={{
                height: open ? "auto" : "0",
                transform: open ? "scaleY(100%) translateY(0)" : "scaleY(0) translateY(-50%)"
            }}
                 className="dropdown-items">
                {children}
            </div>
            </>
            :
            <>
            <label onClick={()=>setOpen(!open)}>
                {open ? <>{title} <XMarkIcon className={"icon"}/></> : <AdjustmentsHorizontalIcon className={"icon"}/>}
            </label>
            <div style={{
                width: open ? "fit-content" : "0",
                transform: open ? "scaleX(100%) translateX(0)" : "scaleX(0) translateX(50%)"
            }}
                 className="dropdown-items">
                {children}
            </div>
            </>
        }
    </div>

}