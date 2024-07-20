import { NS } from '@ns'
import { lock, release } from "utils/mutex.js"

export const LOGFILE = "log.json"

export async function getLog(ns : NS) : Promise<void> {
    await lock(ns, LOGFILE)
    const log = JSON.parse(ns.read(LOGFILE))
    release(ns, LOGFILE)

    return log
}

export async function updateLog(ns : NS, f: (log: Record) => Record) : Promise<void> {
    await lock(ns, LOGFILE)
    const log = JSON.parse(ns.read(LOGFILE))

    ns.rm(LOGFILE)
    ns.write(LOGFILE, JSON.stringify(f(log)))

    release(ns, LOGFILE)
}