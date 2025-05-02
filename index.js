import express from "express";
import {
  capitalizeName,
  getFormattedMatch,
  getMatchData,
  getMatchesData,
  getTeamsData,
  sortRounds,
} from "./utils.js";
import { getTeams, updateScore } from "./models/index.js";

const app = express();

const team_details = await getTeamsData();

app.get("/", async (req, res) => {
  res.status(200).json({ message: "hello" });
});

app.get("/score", async (req, res) => {
  const matchId = req.query.match_id;

  if (!matchId) {
    res.status(400).json({ message: "match_id is missing" });
    return;
  }

  try {
    const matchesDetails = await getMatchesData();
    const match = matchesDetails.find((match) => match.matchId === matchId);

    const team1 = capitalizeName(match.teams.team1.name);
    const team2 = capitalizeName(match.teams.team2.name);

    const team1_players = team_details[team1].player_details
      .filter((player) => {
        if (match.category.toLowerCase() === "women") {
          return player.gender.toLowerCase() === "female";
        } else if (match.category.toLowerCase() === "men") {
          return player.gender.toLowerCase() === "male";
        }
      })
      .map((player) => ({
        player_name: player.player_name,
        photo: player.photo,
      }));

    const team2_players = team_details[team2].player_details
      .filter((player) => {
        if (match.category.toLowerCase() === "women") {
          return player.gender.toLowerCase() === "female";
        } else if (match.category.toLowerCase() === "men") {
          return player.gender.toLowerCase() === "male";
        }
      })
      .map((player) => ({
        player_name: player.player_name,
        photo: player.photo,
      }));

    const lineup = {
      team1: team1_players,
      team2: team2_players,
    };

    const teams = await getTeams();
    const group_a_teams = [];
    const group_b_teams = [];

    teams.forEach((team) => {
      if (team.group === "group_a") {
        group_a_teams.push({
          rank: team.rank,
          team: team.team,
          gp_score: team.gp_score,
          w_score: team.w_score,
          l_score: team.l_score,
          d_score: team.d_score,
          p_score: team.p_score,
        });
      } else {
        group_b_teams.push({
          rank: team.rank,
          team: team.team,
          gp_score: team.gp_score,
          w_score: team.w_score,
          l_score: team.l_score,
          d_score: team.d_score,
          p_score: team.p_score,
        });
      }
    });

    const group = {
      group_a: group_a_teams,
      group_b: group_b_teams,
    };

    const teamGroup = teams.find(
      (team) => team.team.toLowerCase() === team1.toLowerCase()
    ).group;

    const matchObj = {
      match_id: match.matchId,
      event_name: match.eventType,
      team1: team1,
      team2: team2,
      team1_logo: team_details[team1].state_logo,
      team2_logo: team_details[team2].state_logo,
      team1_score: match.setsWon.team1,
      team2_score: match.setsWon.team2,
      match_date: match.date,
      group: teamGroup,
    };

    res.status(200).json({
      status: true,
      message: "",
      data: {
        match: matchObj,
        lineup,
        group,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/schedule", async (req, res) => {
  try {
    const matches = await getMatchesData();

    const today = new Date();

    let finishedMatchRounds = [];

    const finishedMatches = matches
      .filter((match) => {
        const datetimeString = `${match.date}T${match.time}:00`;
        const datetimeObj = new Date(datetimeString);

        return datetimeObj.getTime() < today.getTime() && !match.isLive;
      })
      .map((match) => {
        finishedMatchRounds.push(capitalizeName(match.round));
        return {
          ...getFormattedMatch(match, team_details),
          round: capitalizeName(match.round),
        };
      });

    finishedMatchRounds = sortRounds([...new Set(finishedMatchRounds)]);

    const finishedRounds = finishedMatchRounds.map((round) => ({
      name: round,
      match: finishedMatches
        .filter((match) => match.round.toLowerCase() === round.toLowerCase())
        .map((match) => {
          const { round, ...matchObj } = match;
          return matchObj;
        }),
    }));

    let scheduledMatchRounds = [];

    const scheduledMatches = matches
      .filter((match) => {
        const datetimeString = `${match.date}T${match.time}:00`;
        const datetimeObj = new Date(datetimeString);

        return datetimeObj.getTime() > today.getTime();
      })
      .map((match) => {
        scheduledMatchRounds.push(capitalizeName(match.round));
        return {
          ...getFormattedMatch(match, team_details),
          round: capitalizeName(match.round),
        };
      });

    scheduledMatchRounds = sortRounds([...new Set(scheduledMatchRounds)]);

    const scheduledRounds = scheduledMatchRounds.map((round) => ({
      name: round,
      match: scheduledMatches
        .filter((match) => match.round.toLowerCase() === round.toLowerCase())
        .map((match) => {
          const { round, ...matchObj } = match;
          return matchObj;
        }),
    }));

    const currentMatches = matches
      .filter((match) => match.isLive)
      .map((match) => getFormattedMatch(match, team_details));

    const response = {
      status: true,
      message: "",
      data: {
        current: currentMatches,
        schedule: {
          round: scheduledRounds,
        },
        finished: {
          round: finishedRounds,
        },
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/update", async (req, res) => {
  const matchId = req.query.match_id;

  if (!matchId) {
    res.status(400).json({ message: "match_id is missing" });
    return;
  }

  try {
    const match = await getMatchData(matchId);

    const team1 = capitalizeName(match.teams.team1.name);
    const team2 = capitalizeName(match.teams.team2.name);

    if (match.setsWon.team1 === match.setsWon.team2) {
      await updateScore(team1, team2, true);
    } else {
      await updateScore(
        capitalizeName(match.teamWon),
        capitalizeName(match.teamLost),
        false
      );
    }

    res.status(200).json({ message: "score updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});
