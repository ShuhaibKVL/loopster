export function dateToMinutes(targetDate:Date) {
    const currentTIme = new Date().getTime()
    const targetTime = new Date(targetDate).getTime();

    const timeDiff = Math.abs(currentTIme - targetTime)
    return Math.floor(timeDiff / (1000 * 60));
}

export function dateToHours(targetDate:Date) {
    const currentTIme = new Date().getTime()
    const targetTime = new Date(targetDate).getTime();

    const timeDiff = Math.abs(currentTIme - targetTime)
    return Math.floor(timeDiff / (1000 * 60 * 60)); 
}

export function dateToDays(targetDate:Date) {
    const currentTIme = new Date().getTime()
    const targetTime = new Date(targetDate).getTime();

    const timeDiff = Math.abs(currentTIme - targetTime)
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}