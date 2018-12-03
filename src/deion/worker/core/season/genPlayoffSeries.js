// @flow

import range from "lodash/range";
import { g, helpers } from "../../util";
import type { TeamFiltered } from "../../../common/types";

const genPlayoffSeries = (teams: TeamFiltered[]) => {
    // Playoffs are split into two branches by conference only if there are exactly 2 conferences
    const playoffsByConference = g.confs.length === 2;

    // Don't let there be an odd number of byes if playoffsByConference, otherwise it would get confusing
    const numPlayoffByes = helpers.bound(
        playoffsByConference && g.numPlayoffByes % 2 === 1
            ? g.numPlayoffByes - 1
            : g.numPlayoffByes,
        0,
        Infinity,
    );

    const tidPlayoffs = [];
    const numPlayoffTeams =
        2 ** g.numGamesPlayoffSeries.length - numPlayoffByes;
    if (numPlayoffTeams <= 0) {
        throw new Error(
            "Invalid combination of numGamesPlayoffSeries and numPlayoffByes results in no playoff teams",
        );
    }

    const series = range(g.numGamesPlayoffSeries.length).map(() => []);
    if (playoffsByConference) {
        if (g.numGamesPlayoffSeries.length > 1) {
            // Default: top 50% of teams in each of the two conferences
            const numSeriesPerConference =
                2 ** g.numGamesPlayoffSeries.length / 4;
            for (let cid = 0; cid < g.confs.length; cid++) {
                const teamsConf = [];
                for (let i = 0; i < teams.length; i++) {
                    if (teams[i].cid === cid) {
                        teamsConf.push(teams[i]);
                        tidPlayoffs.push(teams[i].tid);
                        if (teamsConf.length >= numPlayoffTeams / 2) {
                            break;
                        }
                    }
                }

                let numByesUsed = 0;
                for (let i = 0; i < numSeriesPerConference; i++) {
                    const j = i % 2 === 0 ? i : numSeriesPerConference - i;
                    if (i < numPlayoffByes / 2) {
                        series[0][j + cid * numSeriesPerConference] = {
                            home: teamsConf[i],
                            away: undefined,
                        };
                        series[0][j + cid * numSeriesPerConference].home.seed =
                            i + 1;

                        numByesUsed += 1;
                    } else {
                        series[0][j + cid * numSeriesPerConference] = {
                            home: teamsConf[i],
                            away:
                                teamsConf[
                                    numPlayoffTeams / 2 - 1 - i + numByesUsed
                                ],
                        };
                        series[0][j + cid * numSeriesPerConference].home.seed =
                            i + 1;
                        series[0][j + cid * numSeriesPerConference].away.seed =
                            numPlayoffTeams / 2 - i + numByesUsed;
                    }
                }
            }
        } else {
            // Special case - if there is only one round, pick the best team in each conference to play
            const teamsConf = [];
            for (let cid = 0; cid < g.confs.length; cid++) {
                for (let i = 0; i < teams.length; i++) {
                    if (teams[i].cid === cid) {
                        teamsConf.push(teams[i]);
                        tidPlayoffs.push(teams[i].tid);
                        break;
                    }
                }
            }

            if (teamsConf.length !== 2) {
                throw new Error("Could not find two conference champs");
            }

            series[0][0] = {
                home:
                    teamsConf[0].winp > teamsConf[1].winp
                        ? teamsConf[0]
                        : teamsConf[1],
                away:
                    teamsConf[0].winp > teamsConf[1].winp
                        ? teamsConf[1]
                        : teamsConf[0],
            };
            series[0][0].home.seed = 1;
            series[0][0].away.seed = 1;
        }
    } else {
        // Alternative: top 50% of teams overall
        const teamsConf = [];
        for (let i = 0; i < teams.length; i++) {
            teamsConf.push(teams[i]);
            tidPlayoffs.push(teams[i].tid);
            if (teamsConf.length >= numPlayoffTeams) {
                break;
            }
        }
        const numSeries = 2 ** g.numGamesPlayoffSeries.length / 2;
        let numByesUsed = 0;
        for (let i = 0; i < numSeries; i++) {
            const j = i % 2 === 0 ? i : numSeries - i;
            if (i < numPlayoffByes) {
                series[0][j] = {
                    home: teamsConf[i],
                    away: undefined,
                };
                series[0][j].home.seed = i + 1;

                numByesUsed += 1;
            } else {
                series[0][j] = {
                    home: teamsConf[i],
                    away: teamsConf[numPlayoffTeams - 1 - i + numByesUsed],
                };
                series[0][j].home.seed = i + 1;
                series[0][j].away.seed = numPlayoffTeams - i + numByesUsed;
            }
        }
    }

    return { series, tidPlayoffs };
};

export default genPlayoffSeries;