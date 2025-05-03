import { connect } from "mongoose";
import Team from "./Rank.js";

const password = process.env.MONGODB_PASSWORD;

connect(
  `mongodb+srv://admin:${password}@cluster0.lyvag2f.mongodb.net/scores?retryWrites=true&w=majority&appName=Cluster0`
);

export async function getTeams(eventType, category) {
  const event = await Team.findOne({
    event_name: eventType,
    category: category,
  });
  return event.teams;
}

async function getTeam(eventType, category, teamName) {
  const teams = await getTeams(eventType, category);
  return teams.find((team) => team.team === teamName);
}

export async function updateScore(eventType, category, wteam, lteam, isDraw) {
  const wteamRes = await getTeam(eventType, category, wteam);
  const lteamRes = await getTeam(eventType, category, lteam);

  if (!isDraw) {
    await Team.updateOne(
      { event_name: eventType, category: category },
      {
        $set: {
          "teams.$[teamElem].gp_score": String(Number(wteamRes.gp_score) + 1),
          "teams.$[teamElem].w_score": String(Number(wteamRes.w_score) + 1),
          "teams.$[teamElem].p_score": String(Number(wteamRes.p_score) + 2),
        },
      },
      {
        arrayFilters: [{ "teamElem.team": wteam }],
      }
    );

    await Team.updateOne(
      { event_name: eventType, category: category },
      {
        $set: {
          "teams.$[teamElem].gp_score": String(Number(lteamRes.gp_score) + 1),
          "teams.$[teamElem].l_score": String(Number(lteamRes.l_score) + 1),
        },
      },
      {
        arrayFilters: [{ "teamElem.team": lteam }],
      }
    );

    return;
  }

  await Team.updateOne(
    { event_name: eventType, category: category },
    {
      $set: {
        "teams.$[teamElem].gp_score": String(Number(wteamRes.gp_score) + 1),
        "teams.$[teamElem].d_score": String(Number(wteamRes.d_score) + 1),
        "teams.$[teamElem].p_score": String(Number(wteamRes.p_score) + 1),
      },
    },
    {
      arrayFilters: [{ "teamElem.team": wteam }],
    }
  );

  await Team.updateOne(
    { event_name: eventType, category: category },
    {
      $set: {
        "teams.$[teamElem].gp_score": String(Number(lteamRes.gp_score) + 1),
        "teams.$[teamElem].d_score": String(Number(lteamRes.d_score) + 1),
        "teams.$[teamElem].p_score": String(Number(lteamRes.p_score) + 1),
      },
    },
    {
      arrayFilters: [{ "teamElem.team": lteam }],
    }
  );
}
