import React from 'react';
import Badge from './Badge';
import Link from 'next/link';

interface BoxeProps {
    title: string;
    value: number;
    badge?: string | number;
    link?: string;
}

interface BoxesProps {
    items: BoxeProps[];
    hight?:string
    width?:string
    ratio?:string
}

export default function Boxes({ items ,ratio = 'w-1/4'}: BoxesProps) {
    return (
        <div className='relative border w-full p-5 h-28 rounded-md flex items-center justify-around overflow-visible gap-2'>
            {items.length > 0 ? (
                items.map((item, index) => (
                    <div key={index} className={`relative ${ratio} h-full space-y-2 text-center border rounded-md overflow-visible hover:bg-[var(--color-bg)] duration-100 cursor-pointer`}>
                        {item.link ? (
                            <Link href={item.link}>
                                    <h1 className='font-bold'>{item.title}</h1>
                                    <p className='font-light'>{item.value}</p>
                                    {item.badge && (
                                        <Badge theme='bg-green-500' value={`${item.badge}+`} />
                                    )}
                            </Link>
                        ) : (
                            <>
                                <h1 className='font-bold'>{item.title}</h1>
                                <p className='font-light'>{item.value}</p>
                                {item.badge && (
                                    <Badge theme='bg-green-500' value={`${item.badge}+`} />
                                )}
                            </>
                        )}
                    </div>
                ))
            ) : null}
        </div>
    );
}
