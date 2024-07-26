'use client'
import {MutableRefObject, useCallback, useEffect} from "react";

export function useClickOutside(onClick:()=>void, ref:MutableRefObject<NonNullable<any>>){

    const handleOutsideClick = useCallback((mouseEvent: MouseEvent) => {
        const clickedElement = mouseEvent.target as Node;
        if (ref.current && !(ref.current.contains(clickedElement))) {
            onClick()
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [handleOutsideClick]);

}