import React from 'react'

export default function ProfileHeader() {
    return (
        <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-4 w-24"></div>
            </div>
        </div>
        </div>
    )
}
