"use strict";

const formatStats = (stats, playerName) => {
    const fgm = stats['fgm'];
    const fga = stats['fga'];
    const fgPct = (Number(stats['fgPct']) * 100).toFixed(1);

    const fG3M = stats['fG3M'];
    const fG3A = stats['fG3A'];
    const fg3Pct = (Number(stats['fg3Pct']) * 100).toFixed(1);

    const ftm = stats['ftm'];
    const fta =  stats['fta'];
    const ftPct = (Number(stats['ftPct']) * 100).toFixed(1);

    const oreb = stats['oreb'];
    const dreb = stats['dreb'];
    const reb = stats['reb'];

    const ast = Number(stats['ast']);
    const stl = stats['stl'];
    const blk = stats['blk'];

    const tov = Number(stats['tov']);
    const pf = stats['pf'];
    const pts = stats['pts'];
    const to_ast = (tov / ast).toFixed(2);

    // create strings for all the stat lines we're going to display
    const lines = [
        "*" + playerName + "*",
        "`" + pts + " ppg`",
        ":basketball: `" + fgm + "/" + fga + "|" + fgPct+ "%`",
        ":raised_hands: `" + fG3M + "/" + fG3A + "|" + fg3Pct + "%`",
        ":free: `" + ftm + "/" + fta + "|" + ftPct + "%`",
        "`" + tov + "to/" + ast + "ast|" + to_ast + "`",
        "`" + reb + "reb` `" + stl + "stl` `" + blk + "blk`"
    ];

    /*
    const salary = nbaRequest.getSalary(playerName);
    if (salary) {
        lines.push(":moneybag: `$" + salary.toLocaleString() + "`");
    }
    */

    return lines.join("\n");
};

module.exports = { formatStats: formatStats };
