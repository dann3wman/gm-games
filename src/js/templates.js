// Disable template string rule because brfs can't handle them
/* eslint prefer-template: "off" */

const fs = require('fs');

module.exports = {
    account: fs.readFileSync(__dirname + '/../templates/account.html', 'utf8'),
    accountUpdateCard: fs.readFileSync(__dirname + '/../templates/accountUpdateCard.html', 'utf8'),
    awardsRecords: fs.readFileSync(__dirname + '/../templates/awardsRecords.html', 'utf8'),
    changes: fs.readFileSync(__dirname + '/../templates/changes.html', 'utf8'),
    customizePlayer: fs.readFileSync(__dirname + '/../templates/customizePlayer.html', 'utf8'),
    dashboard: fs.readFileSync(__dirname + '/../templates/dashboard.html', 'utf8'),
    deleteLeague: fs.readFileSync(__dirname + '/../templates/deleteLeague.html', 'utf8'),
    deleteOldData: fs.readFileSync(__dirname + '/../templates/deleteOldData.html', 'utf8'),
    draftScouting: fs.readFileSync(__dirname + '/../templates/draftScouting.html', 'utf8'),
    error: fs.readFileSync(__dirname + '/../templates/error.html', 'utf8'),
    eventLog: fs.readFileSync(__dirname + '/../templates/eventLog.html', 'utf8'),
    exportLeague: fs.readFileSync(__dirname + '/../templates/exportLeague.html', 'utf8'),
    exportStats: fs.readFileSync(__dirname + '/../templates/exportStats.html', 'utf8'),
    fantasyDraft: fs.readFileSync(__dirname + '/../templates/fantasyDraft.html', 'utf8'),
    freeAgents: fs.readFileSync(__dirname + '/../templates/freeAgents.html', 'utf8'),
    gameLog: fs.readFileSync(__dirname + '/../templates/gameLog.html', 'utf8'),
    godMode: fs.readFileSync(__dirname + '/../templates/godMode.html', 'utf8'),
    hallOfFame: fs.readFileSync(__dirname + '/../templates/hallOfFame.html', 'utf8'),
    editTeamInfo: fs.readFileSync(__dirname + '/../templates/editTeamInfo.html', 'utf8'),
    history: fs.readFileSync(__dirname + '/../templates/history.html', 'utf8'),
    historyAll: fs.readFileSync(__dirname + '/../templates/historyAll.html', 'utf8'),
    leaders: fs.readFileSync(__dirname + '/../templates/leaders.html', 'utf8'),
    leagueDashboard: fs.readFileSync(__dirname + '/../templates/leagueDashboard.html', 'utf8'),
    leagueFinances: fs.readFileSync(__dirname + '/../templates/leagueFinances.html', 'utf8'),
    leagueLayout: fs.readFileSync(__dirname + '/../templates/leagueLayout.html', 'utf8'),
    live: fs.readFileSync(__dirname + '/../templates/live.html', 'utf8'),
    liveGame: fs.readFileSync(__dirname + '/../templates/liveGame.html', 'utf8'),
    loginOrRegister: fs.readFileSync(__dirname + '/../templates/loginOrRegister.html', 'utf8'),
    lostPassword: fs.readFileSync(__dirname + '/../templates/lostPassword.html', 'utf8'),
    manual: fs.readFileSync(__dirname + '/../templates/manual.html', 'utf8'),
    manualCustomRosters: fs.readFileSync(__dirname + '/../templates/manualCustomRosters.html', 'utf8'),
    manualOverview: fs.readFileSync(__dirname + '/../templates/manualOverview.html', 'utf8'),
    multiTeamMode: fs.readFileSync(__dirname + '/../templates/multiTeamMode.html', 'utf8'),
    negotiation: fs.readFileSync(__dirname + '/../templates/negotiation.html', 'utf8'),
    negotiationList: fs.readFileSync(__dirname + '/../templates/negotiationList.html', 'utf8'),
    newLeague: fs.readFileSync(__dirname + '/../templates/newLeague.html', 'utf8'),
    newTeam: fs.readFileSync(__dirname + '/../templates/newTeam.html', 'utf8'),
    player: fs.readFileSync(__dirname + '/../templates/player.html', 'utf8'),
    playerFeats: fs.readFileSync(__dirname + '/../templates/playerFeats.html', 'utf8'),
    playerRatingDists: fs.readFileSync(__dirname + '/../templates/playerRatingDists.html', 'utf8'),
    playerRatings: fs.readFileSync(__dirname + '/../templates/playerRatings.html', 'utf8'),
    playerShotLocations: fs.readFileSync(__dirname + '/../templates/playerShotLocations.html', 'utf8'),
    playerStatDists: fs.readFileSync(__dirname + '/../templates/playerStatDists.html', 'utf8'),
    playerStats: fs.readFileSync(__dirname + '/../templates/playerStats.html', 'utf8'),
    playoffs: fs.readFileSync(__dirname + '/../templates/playoffs.html', 'utf8'),
    resetPassword: fs.readFileSync(__dirname + '/../templates/resetPassword.html', 'utf8'),
    teamFinances: fs.readFileSync(__dirname + '/../templates/teamFinances.html', 'utf8'),
    teamHistory: fs.readFileSync(__dirname + '/../templates/teamHistory.html', 'utf8'),
    teamRecords: fs.readFileSync(__dirname + '/../templates/teamRecords.html', 'utf8'),
    teamShotLocations: fs.readFileSync(__dirname + '/../templates/teamShotLocations.html', 'utf8'),
    teamStatDists: fs.readFileSync(__dirname + '/../templates/teamStatDists.html', 'utf8'),
    teamStats: fs.readFileSync(__dirname + '/../templates/teamStats.html', 'utf8'),
    transactions: fs.readFileSync(__dirname + '/../templates/transactions.html', 'utf8'),
    trade: fs.readFileSync(__dirname + '/../templates/trade.html', 'utf8'),
    tradingBlock: fs.readFileSync(__dirname + '/../templates/tradingBlock.html', 'utf8'),
    upcomingFreeAgents: fs.readFileSync(__dirname + '/../templates/upcomingFreeAgents.html', 'utf8'),
    watchList: fs.readFileSync(__dirname + '/../templates/watchList.html', 'utf8'),
};