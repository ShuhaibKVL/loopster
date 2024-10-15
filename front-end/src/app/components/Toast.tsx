import { toast } from '@/hooks/use-toast'

export interface IToast{
    title :string,
    description:string,
    className:string
}
export default function Toast({title,description,className}:IToast) {
    return (
        toast({
            title: title,
            description: description,
            className:className
        })
    )
}
