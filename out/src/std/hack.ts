import { NS } from '@ns'

export async function main(ns: NS): undefined {
  const host = ns.args[0]
  const minAmt = +(ns.args[1] || 1)

  while (true) {
    if (ns.getServerMoneyAvailable(host) >= minAmt) {
      ns.print("state: HACK_START")
      await ns.hack(host)
      ns.print("state: HACK_END")
    }
    else {
      await ns.sleep(1000)
    }
  }
}