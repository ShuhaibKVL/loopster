import React, { useState } from 'react'
import {
    Pagination as Paginationn,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import page from '../(auth)/signUp/otp/page'

interface IPaginationProps {
    pages: number,
    onSelect: (page: number) => void
}

export default function Pagination({ pages, onSelect }: IPaginationProps) {
    const [currentPage, setCurrentPage] = useState<number>(1)

    function handlePage(cp: number | string) {
        if (cp === '+') {
            if (currentPage < pages) {
                onSelect(currentPage + 1)
                setCurrentPage(currentPage + 1)
            }
        } else if (cp === '-') {
            if (currentPage > 1) {
                onSelect(currentPage - 1)
                setCurrentPage(currentPage - 1)
            }
        } else if (typeof cp === 'number') {
            onSelect(cp)
            setCurrentPage(cp)
        }
    }
    console.log('total pages inside pagination component :',pages)

    const renderPaginationLinks = () => {
        const paginationLinks = []

        // Display first page link
        paginationLinks.push(
            <PaginationItem key={1}>
                <PaginationLink
                    className={`hover:bg-primary hover:text-white ${currentPage === 1 ? 'bg-primary text-white' : ''}`}
                    onClick={() => handlePage(1)}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        )

        // Conditionally add ellipsis if currentPage is far from the start
        if (currentPage > 3) {
            paginationLinks.push(<PaginationEllipsis key="start-ellipsis" />)
        }

        // Add the middle pages around the current page
        for (let i =  Math.max(2, currentPage - 1); i <= Math.min(pages - 1, currentPage + 1); i++) {
            paginationLinks.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        className={`hover:bg-primary hover:text-white ${currentPage === i ? 'bg-primary text-white' : ''}`}
                        onClick={() => handlePage(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        // Conditionally add ellipsis if currentPage is far from the end
        if (currentPage < pages - 2) {
            paginationLinks.push(<PaginationEllipsis key="end-ellipsis" />)
        }

        // Display last page link if there's more than one page
        if (pages > 1) {
            paginationLinks.push(
                <PaginationItem key={pages}>
                    <PaginationLink
                        className={`hover:bg-primary hover:text-white ${currentPage === pages ? 'bg-primary text-white' : ''}`}
                        onClick={() => handlePage(pages)}
                    >
                        {pages}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return paginationLinks
    }

    return (
        <div className='relative overflow-hidden w-full h-fit'>
            <Paginationn>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious className='hover:bg-primary hover:text-white' onClick={() => handlePage('-')} />
                    </PaginationItem>

                    {renderPaginationLinks()}

                    <PaginationItem>
                        <PaginationNext className='hover:bg-primary hover:text-white' onClick={() => handlePage('+')} />
                    </PaginationItem>
                </PaginationContent>
            </Paginationn>
        </div>
    )
}
