import express from "express";
import multer from "multer";
import { capitalizeName, getMatchData } from "./utils.js";
import { updateScore } from "./models/index.js";
import { handleScheduleRequest, handleScoreRequest } from "./handlers.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.get("/", upload.none(), async (req, res) => {
  const {
    request_type,
    sport_id,
    format,
    gender,
    sdate,
    match_id, // required if request_type === "score"
  } = req.query;

  if (!request_type) {
    return res.status(400).json({ error: "Bad request: request_type missing" });
  }

  if (request_type === "schedule") {
    if (!gender) {
      return res
        .status(400)
        .json({ error: "Bad request: gender missing for schedule" });
    }
    await handleScheduleRequest(req, res, gender);
  } else if (request_type === "score") {
    if (!match_id) {
      return res
        .status(400)
        .json({ error: "Bad request: match_id missing for score" });
    }

    // Use match_id from query string (not body)
    await handleScoreRequest(req, res, match_id);
  } else {
    res.status(400).json({ error: "Bad request: invalid request_type" });
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

    if (!match) {
      return res
        .status(404)
        .json({ message: "match with the given match_id not found" });
    }

    const team1 = capitalizeName(match.teams.team1.name);
    const team2 = capitalizeName(match.teams.team2.name);

    if (match.setsWon.team1 === match.setsWon.team2) {
      await updateScore(match.eventType, match.category, team1, team2, true);
    } else {
      await updateScore(
        match.eventType,
        match.category,
        capitalizeName(match.teamWon),
        capitalizeName(match.teamLost),
        false
      );
    }

    res.status(200).json({ message: "score updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(8080, () => {
  console.log("server running on port 8080");
});
