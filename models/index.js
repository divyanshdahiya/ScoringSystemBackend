import { connect } from "mongoose";
import Team from "./Rank.js";

const password = process.env.MONGODB_PASSWORD;

connect(
  `mongodb+srv://admin:${password}@cluster0.lyvag2f.mongodb.net/scores?retryWrites=true&w=majority&appName=Cluster0`
);

export async function getTeams() {
  const teams = await Team.find({});
  return teams;
}

export async function updateScore(wteam, lteam, isDraw) {
  const wteamRes = await Team.findOne({ team: wteam });
  const lteamRes = await Team.findOne({ team: lteam });

  if (!isDraw) {
    await Team.find({ team: wteam }).updateOne({
      gp_score: String(Number(wteamRes.gp_score) + 1),
      w_score: String(Number(wteamRes.w_score) + 1),
      p_score: String(Number(wteamRes.p_score) + 2),
    });

    await Team.find({ team: lteam }).updateOne({
      gp_score: String(Number(lteamRes.gp_score) + 1),
      l_score: String(Number(lteamRes.l_score) + 1),
    });

    return;
  }

  await Team.find({ team: wteam }).updateOne({
    gp_score: String(Number(wteamRes.gp_score) + 1),
    d_score: String(Number(wteamRes.d_score) + 1),
    p_score: String(Number(wteamRes.p_score) + 1),
  });

  await Team.find({ team: lteam }).updateOne({
    gp_score: String(Number(lteamRes.gp_score) + 1),
    d_score: String(Number(lteamRes.d_score) + 1),
    p_score: String(Number(lteamRes.p_score) + 1),
  });
}
