export default function Loading() {
    return <div className="w-full h-screen flex items-center justify-center bg-[var(--secondary-bg)]">
        <div>
            <p>Loading...</p>
            <span className="loading loading-ring loading-lg"></span>
        </div>
    </div>
}