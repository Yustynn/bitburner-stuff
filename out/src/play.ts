import { NS } from '@ns'
import { getLog } from '/utils/state.js'

export async function main(ns : NS) : undefined {
    const log = await getLog(ns)
    const host = "serve-1"
    const { pid, args } = log[host][1]
    ns.tprint(ns.getScriptLogs(pid, host, ...args))
}