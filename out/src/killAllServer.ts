import { NS } from '@ns'
import { logKill } from '/runners/logKill.js'  
import { getLog } from '/utils/state.js'

export async function main(ns : NS) : Promise<void> {
    const host = ns.args[0]
    const log = await getLog(ns)
    for (const { pid } of log[host]) {
        await logKill(ns, pid, host)
    }
}