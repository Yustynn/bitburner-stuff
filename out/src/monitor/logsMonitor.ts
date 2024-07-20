// very finnicky code, lots written at 4am lol.

import { NS } from '@ns'
import { getLog } from 'utils/state.js'

const STATE_NONE = "NONE"
const STATE_WEAKEN_START = "WEAKEN_START"
const STATE_WEAKEN_END = "WEAKEN_END"
const STATE_GROW_START = "GROW_START"
const STATE_GROW_END = "GROW_END"
const STATE_HACK_START = "HACK_START"
const STATE_HACK_END = "HACK_END"
const STATES_START = [STATE_GROW_START, STATE_WEAKEN_START, STATE_HACK_START]
const STATES_END = [STATE_GROW_END, STATE_WEAKEN_END, STATE_HACK_END]

const STATE_TO_PROCESSOR = {
    [STATE_WEAKEN_START]: processWeakenStartLog,
    [STATE_WEAKEN_END]: processWeakenEndLog,
    [STATE_GROW_START]: processGrowStartLog,
    [STATE_GROW_END]: processGrowEndLog,
    [STATE_HACK_START]: processHackStartLog,
    [STATE_HACK_END]: processHackEndLog,
}



function getTimestamp(line: string): string {
    return line.match(/\[(\d{2}:\d{2}:\d{2}\.\d{5})\]/)[1];
}

function processStrNum(strnum: string): number {
    const lastChar = strnum.slice(-1);
    const baseNum = parseFloat(strnum.slice(0, -1));

    switch (lastChar) {
        case 'k':
            return baseNum * 10 ** 3;
        case 'm':
            return baseNum * 10 ** 6;
        case 't':
            return baseNum * 10 ** 12; // Assuming 't' is used for trillion
        default:
            return parseFloat(strnum);
    }
}

function processLogLineStateIdx(ns: NS, log: string[], lastTimestamp: string): { timestamp: string, timeInSeconds: number } {
    let state = STATE_NONE
    let idx = null

    for (let i = log.length - 1; i >= 0; i--) {
        const line = log[i]
        if (lastTimestamp >= getTimestamp(line)) {
            return null
        }

        for (const stateStart of STATES_START) {
            if (line.includes(stateStart) && i + 2 < log.length) {
                idx = i + 2
                state = stateStart
                return { state, idx }
            }
        }

        for (const stateEnd of STATES_END) {
            if (line.includes(stateEnd) && i - 2 >= 0) {
                idx = i - 2
                state = stateEnd
                return { state, idx }
            }
        }
    }

    if (state === STATE_NONE || idx >= log.length) {
        return null
    }

    return { state, idx }
}


function processGrowStartLog(line: string): { timestamp: string, timeInSeconds: number } {
    const timestamp = getTimestamp(line)

    const timeMatch = line.match(/in ((\d+) minutes )?(\d+\.\d+) seconds/);

    let timeInSeconds = parseFloat(timeMatch[3]);
    if (timeMatch[2]) { // If there are minutes
        timeInSeconds += parseInt(timeMatch[2]) * 60;
    }

    return { timestamp, timeInSeconds }
}

function processGrowEndLog(line: string): { timestamp: string, timeInSeconds: number } {
    const timestamp = getTimestamp(line)

    const pattern = /grown by x([\d.]+.?). Gained ([\d.]+.?) hacking exp/

    const match = line.match(pattern);

    const growthMult = processStrNum(match[1]) / 100;
    const experience = processStrNum(match[2]);

    return { growthMult, experience, timestamp }
}

function processWeakenStartLog(line: string): { timestamp: string, timeInSeconds: number } {
    const timestamp = getTimestamp(line)

    const timeMatch = line.match(/in ((\d+) minutes )?(\d+\.\d+) seconds/);
    let timeInSeconds = parseFloat(timeMatch[3]);
    if (timeMatch[2]) { // If there are minutes
        timeInSeconds += parseInt(timeMatch[2]) * 60;
    }

    return { timestamp, timeInSeconds }
}
function processWeakenEndLog(line: string): { timestamp: string, timeInSeconds: number } {
    const timestamp = getTimestamp(line)

    const pattern = /security level weakened to (\d+). Gained ([\d.]+.?) hacking exp/

    // Searching the log line using the compiled pattern
    const match = line.match(pattern);

    const securityLevel = match[1];
    const experience = processStrNum(match[2]);

    return { experience, securityLevel, timestamp }
}

function processHackStartLog(line: string): { timestamp: string, timeInSeconds: number } {
    const timestamp = getTimestamp(line)
    const timeMatch = line.match(/in ((\d+) minutes )?(\d+\.\d+) seconds/);

    let timeInSeconds = parseFloat(timeMatch[3]);
    if (timeMatch[2]) { // If there are minutes
        timeInSeconds += parseInt(timeMatch[2]) * 60;
    }

    return { timestamp, timeInSeconds }
}

function processHackEndLog(line: string): { timestamp: string, timeInSeconds: number } {
    const timestamp = getTimestamp(line)
    return { timestamp }

    const pattern = /for \$([\d.]+.?) and ([\d.]+.?) exp/

    // Searching the log line using the compiled pattern
    const match = line.match(pattern);

    const moneyGained = processStrMatch(match[1]);
    const experience = processStrNum(match[2]);

    return { timestamp, moneyGained, experience }

}

export async function main(ns : NS) : Promise<void> {
    const lastTimestamps = {}


    while (true) {
        await ns.sleep(200)
        const logState = await getLog(ns)

        for (const host of Object.keys(logState)) {
            const hackingLvl = ns.getHackingLevel()

            for (const { pid, file, nThreads, args } of logState[host]) {

                const target = args[0]
                const targetSecurityLvl = ns.getServerSecurityLevel(target)
                const targetMoneyAvailable = ns.getServerMoneyAvailable(target)

                const log = ns.getScriptLogs(pid, host, ...args)
                if (log.length == 0) continue

                if (!lastTimestamps[host]) lastTimestamps[host] = {}
                if (!lastTimestamps[host][pid]) {
                    lastTimestamps[host][pid] = getTimestamp(log[log.length-1])
                }


                const stateIdx = processLogLineStateIdx(ns, log, lastTimestamps[host][pid])
                if (stateIdx === null) {
                    continue
                }

                const { state, idx } = stateIdx

                const line = log[idx]
                const logResult = STATE_TO_PROCESSOR[state](line)
                const result = {
                    target,
                    state,
                    ...logResult,
                    targetSecurityLvl,
                    targetMoneyAvailable,
                    hackingLvl,
                    host,
                    pid,
                    file,
                    nThreads,
                }
                const shift = STATES_START.includes(state) ? -2 : 2
                lastTimestamps[host][pid] = getTimestamp(log[idx + shift])
                ns.tprint(result)
            }
        }
    }
}