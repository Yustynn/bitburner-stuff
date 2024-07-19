// 20% more expensive than vanilla grow

import { NS } from '@ns'

const K = 1.25

export async function main(ns: NS): undefined {
  const host = ns.args[0]

  while (true) {
    if (ns.getServerMinSecurityLevel(host)*K < ns.getServerSecurityLevel(host)) {
      ns.print("state: WEAKEN_START")
      await ns.weaken(host)
      ns.print("state: WEAKEN_END")
    }
    else {
      ns.print("state: GROW_START")
      await ns.grow(host)
      ns.print("state: GROW_END")
    }
  }
}