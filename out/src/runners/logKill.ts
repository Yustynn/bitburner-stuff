import { getLog, updateLog } from "/utils/state.js"

export async function logKill(ns : NS, pid: number, host: string) : Promise<void> {
    host = host || ns.getHostname()

    await updateLog(ns, log => {
        const { file, args } = log[host].find(e => e.pid == pid)

        ns.kill(file, host, ...args)

        if (!log[host]) return
        log[host] = log[host].filter(e => e.pid != pid)

        return log
    })
}