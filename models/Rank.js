import { Schema, model } from "mongoose";

const teamSchema = new Schema({
  group: String,
  rank: Number,
  team: String,
  gp_score: String,
  w_score: String,
  l_score: String,
  d_score: String,
  p_score: String,
});

export default model("Team", teamSchema);
