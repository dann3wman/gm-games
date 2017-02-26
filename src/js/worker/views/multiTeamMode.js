// @flow

import g from '../../globals';
import * as league from '../core/league';
import type {GetOutput, UpdateEvents} from '../../util/types';

async function updateMultiTeamMode(
    inputs: GetOutput,
    updateEvents: UpdateEvents,
): void | {[key: string]: any} {
    if (updateEvents.includes('dbChange') || updateEvents.includes('firstRun') || updateEvents.includes('g.userTids')) {
        // Make sure it's current
        await league.loadGameAttribute('godMode');

        const teams = [];
        for (let i = 0; i < g.numTeams; i++) {
            teams.push({
                tid: i,
                name: `${g.teamRegionsCache[i]} ${g.teamNamesCache[i]}`,
            });
        }

        return {
            userTids: g.userTids,
            teams,
        };
    }
}

export default {
    runBefore: [updateMultiTeamMode],
};
