import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from 'react-icons/bs';

export interface DropdownOption {
    label: string;
    action: (postId?:string) => void;
}

export interface ReusableDropdownProps {
    options: DropdownOption[];
    triggerIcon?: React.ReactNode;
    postId?:string,
    theme?:string
}

const ReusableDropdown: React.FC<ReusableDropdownProps> = ({ options, triggerIcon ,postId , theme}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='text-[var(--color-foreign)]'>
                <button className="p-2 rounded-full" title='click to post actions'>
                    {triggerIcon ? triggerIcon : <BsThreeDotsVertical className={`w-3 h-4 sm:w-4 sm:h-4 -z-10 ${theme}`} />}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[var(--secondary-bg)]">
                {options.map((option, index) => (
                    <DropdownMenuItem className={`hover:bg-[var(--hover-card)] ${theme === option?.label && 'bg-[var(--hover-card)]'}`}
                    key={index} onClick={() => option.action(postId)}>
                    {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ReusableDropdown;
