import { NS } from '@ns'

function getLockfile (file: string): string {
    const parts = file.split(".")
    return parts.slice(0, -1).join(".") + ".lock." + parts[parts.length - 1]
}

export async function lock(ns: NS, file: string): Promise<void> {
    const lockfile = getLockfile(file)
    while (ns.fileExists(lockfile)) {
        await ns.sleep(50)
    }
}

export function release(ns: NS, file: string): void {
    const lockfile = getLockfile(file)
    ns.rm(lockfile)
}