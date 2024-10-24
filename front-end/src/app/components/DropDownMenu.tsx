import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from 'react-icons/bs';

interface DropdownOption {
    label: string;
    action: (postId?:string) => void;
}

interface ReusableDropdownProps {
    options: DropdownOption[];
    triggerIcon?: React.ReactNode;
    postId?:string
}

const ReusableDropdown: React.FC<ReusableDropdownProps> = ({ options, triggerIcon ,postId}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='text-[var(--color-foreign)]'>
                <button className="p-2 rounded-full" title='click to post actions'>
                    {triggerIcon ? triggerIcon : <BsThreeDotsVertical className="w-4 h-4" />}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[var(--secondary-bg)]">
                {options.map((option, index) => (
                    <DropdownMenuItem
                    key={index} onClick={() => option.action(postId)}>
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ReusableDropdown;
