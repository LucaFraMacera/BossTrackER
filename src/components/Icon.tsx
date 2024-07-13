import Image from "next/image";
interface IconProps{
    src:string
}
export function Icon({src}:IconProps){
    return <Image src={src} alt={""} width={0} height={0} className={"icon"}/>
}