// @flow

import { PHASE } from "../../common";
import { allStar, draft } from "../core";
import g from "./g";
import helpers from "./helpers";
import local from "./local";
import lock from "./lock";
import toUI from "./toUI";

/**
 * Update play menu options based on game state.
 *
 * @memberOf ui
 * @return {Promise}
 */
const updatePlayMenu = async () => {
	// $FlowFixMe
	if (typeof it === "function") {
		return;
	}

	const allOptions: {
		[key: string]: {
			id?: string,
			label: string,
			url?: string,
			key?: string,
		},
	} = {
		stop: { label: "Stop", key: "s" },
		day: { label: "One day", key: "d" },
		week: { label: "One week", key: "w" },
		month: { label: "One month", key: "m" },
		untilAllStarGame: { label: "Until All-Star Game", key: "a" },
		viewAllStarSelections: {
			url: helpers.leagueUrl(["all_star_draft"]),
			label: "View All-Star draft",
		},
		untilPlayoffs: { label: "Until playoffs", key: "y" },
		untilEndOfRound: { label: "Until end of round", key: "w" },
		throughPlayoffs: { label: "Through playoffs", key: "y" },
		dayLive: {
			url: helpers.leagueUrl(["live"]),
			label: "One day (live)",
			key: "l",
		},
		weekLive: {
			url: helpers.leagueUrl(["live"]),
			label: "One week (live)",
			key: "l",
		},
		viewDraftLottery: {
			url: helpers.leagueUrl(["draft_lottery"]),
			label: "View draft lottery",
		},
		untilDraft: { label: "Until draft", key: "y" },
		onePick: { label: "One pick" },
		untilYourNextPick: { label: "Until your next pick" },
		untilEnd: { label: "Until end of draft" },
		viewDraft: { url: helpers.leagueUrl(["draft"]), label: "View draft" },
		untilResignPlayers: {
			label: g.hardCap
				? "Re-sign players and sign rookies"
				: "Re-sign players with expiring contracts",
		},
		untilFreeAgency: { label: "Until free agency", key: "y" },
		untilPreseason: { label: "Until preseason", key: "y" },
		untilRegularSeason: { label: "Until regular season" },
		contractNegotiation: {
			url: helpers.leagueUrl(["negotiation"]),
			label: "Continue contract negotiation",
		},
		contractNegotiationList: {
			url: helpers.leagueUrl(["negotiation"]),
			label: "Continue re-signing players",
		},
		message: {
			url: helpers.leagueUrl(["message"]),
			label: "Read new message",
		},
		newLeague: { url: "/new_league", label: "Try again in a new league" },
		newTeam: {
			url: helpers.leagueUrl(["new_team"]),
			label: "Try again with a new team",
		},
		seasonSummary: {
			url: helpers.leagueUrl(["history"]),
			label: "View season summary",
		},
		stopAuto: {
			label: `Stop auto play (${local.autoPlaySeasons} seasons left)`,
		},
	};

	let keys = [];
	if (g.phase === PHASE.PRESEASON) {
		// Preseason
		keys = ["untilRegularSeason"];
	} else if (
		g.phase === PHASE.REGULAR_SEASON ||
		g.phase === PHASE.AFTER_TRADE_DEADLINE
	) {
		const allStarScheduled = await allStar.futureGameIsAllStar();
		const allStarNext = await allStar.nextGameIsAllStar();

		const untilAllStarGame = [];
		if (allStarScheduled && !allStarNext) {
			untilAllStarGame.push("untilAllStarGame");
		}

		// Regular season - pre trading deadline
		if (process.env.SPORT === "basketball") {
			keys = [
				"day",
				"dayLive",
				"week",
				"month",
				...untilAllStarGame,
				"untilPlayoffs",
			];
		} else {
			keys = [
				"week",
				"weekLive",
				"month",
				...untilAllStarGame,
				"untilPlayoffs",
			];
		}

		if (allStarNext) {
			keys.unshift("viewAllStarSelections");
		}
	} else if (g.phase === PHASE.PLAYOFFS) {
		// Playoffs
		if (process.env.SPORT === "basketball") {
			keys = ["day", "dayLive", "untilEndOfRound", "throughPlayoffs"];
		} else {
			keys = ["week", "weekLive", "untilEndOfRound", "throughPlayoffs"];
		}
	} else if (g.phase === PHASE.DRAFT_LOTTERY) {
		// Offseason - pre draft
		keys =
			g.draftType !== "noLottery" && g.draftType !== "random"
				? ["viewDraftLottery", "untilDraft"]
				: ["untilDraft"];
	} else if (g.phase === PHASE.DRAFT || g.phase === PHASE.FANTASY_DRAFT) {
		// Draft
		const draftPicks = await draft.getOrder();
		const nextPick = draftPicks[0];
		if (nextPick && g.userTids.includes(nextPick.tid)) {
			keys = ["viewDraft"];
		} else if (draftPicks.some(dp => g.userTids.includes(dp.tid))) {
			keys = ["onePick", "untilYourNextPick", "viewDraft"];
		} else {
			keys = ["onePick", "untilEnd", "viewDraft"];
		}
	} else if (g.phase === PHASE.AFTER_DRAFT) {
		// Offseason - post draft
		keys = ["untilResignPlayers"];
	} else if (g.phase === PHASE.RESIGN_PLAYERS) {
		// Offseason - re-sign players
		keys = ["contractNegotiationList", "untilFreeAgency"];
	} else if (g.phase === PHASE.FREE_AGENCY) {
		// Offseason - free agency
		keys = ["day", "week", "untilPreseason"];
	}

	const unreadMessage = await lock.unreadMessage();
	const negotiationInProgress = await lock.negotiationInProgress();

	if (unreadMessage) {
		keys = ["message"];
	}
	if (local.unviewedSeasonSummary) {
		keys = ["seasonSummary"];
	}
	if (lock.get("gameSim")) {
		keys = ["stop"];
	}
	if (negotiationInProgress && g.phase !== PHASE.RESIGN_PLAYERS) {
		keys = ["contractNegotiation"];
	}
	if (lock.get("newPhase")) {
		keys = [];
	}

	// If there is an unread message, it's from the owner saying the player is fired, so let the user see that first.
	if (g.gameOver && !unreadMessage) {
		keys = ["newTeam", "newLeague"];
	}

	if (local.autoPlaySeasons > 0) {
		keys = ["stopAuto"];
	}

	const someOptions = keys.map(id => {
		allOptions[id].id = id;
		return allOptions[id];
	});

	// Set first key to always be p
	if (someOptions.length > 0) {
		someOptions[0].key = "p";
	}

	toUI(["updateLocal", { playMenuOptions: someOptions }]);
};

export default updatePlayMenu;
