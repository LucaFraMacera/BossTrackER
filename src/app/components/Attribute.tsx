interface AttributeProps{
    title:string
    text:string
    className:string
}
export function Attribute({title, text, className}:AttributeProps){

    return <div className={className}><b>{title}:</b>{text}</div>

}