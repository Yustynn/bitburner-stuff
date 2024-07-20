import { getLog, updateLog } from "/utils/state.js"


export async function logExec(ns : NS, file: string, host: string, nThreads: number, args: Array) : Promise<void> {
    if (host != "home") {
        ns.rm(file, host)
        ns.scp(file, host)
    }

    const pid = ns.exec(file, host, nThreads, ...args)

    await updateLog(ns, (log) => {
        if (!log[host]) log[host] = []
        log[host].push({ pid, file, nThreads, args })

        return log
    })
}