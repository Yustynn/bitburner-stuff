import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    const file = "std/weaken.js"
    ns.tprint("Running: ", ns.scriptRunning(file, "home"))
    ns.tprint(ns.getScriptLogs(file, "home", "iron-gym"))
}

// GROW_END | WEAKEN_END | HACK_END
// server, nthreads, time, value, hackingLvl, securityLvl, serverMinHackingLevel
