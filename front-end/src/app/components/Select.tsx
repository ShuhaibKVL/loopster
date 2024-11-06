import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import '../globals.css'
  
interface selectComponentProps {
    items:string[]
    label:string
    onSelect:(value:string) => void
}

export default function SelectComponent({items,label,onSelect}:selectComponentProps) {
    
    const onSelectChange = (value:string) => {
        onSelect(value)
    }

  return (
    <Select onValueChange={onSelectChange} >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`${label}`} />
        </SelectTrigger>
        <SelectContent className='bg-[var(--secondary-bg)]'>
            {items.map((item) => (
                <SelectItem value={`${item}`}>{item}</SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}
