import { NS } from '@ns'

export async function main(ns: NS): undefined {
  while (true) await ns.weaken(ns.args[0])
}