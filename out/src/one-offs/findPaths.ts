import { NS } from '@ns'
import { getHosts } from '/utils/index.js'

export function main(ns : NS) : Promise<void> {
    const target = "run4theh111z"
    let solution = null


    const seen = new Set()
    const go = (path: string[]) => {
        if (solution) return;

        const last = path[path.length - 1]
        if (seen.has(last)) return 
        seen.add(last)

        if (last == target) {
            solution = path
            return 
        }

        for (const host of ns.scan(last)) {
            go([...path, host])
        }
    }

    go(["home"])
    ns.tprint(solution)
}