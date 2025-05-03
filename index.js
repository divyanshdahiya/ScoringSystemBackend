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

app.post("/", upload.none(), async (req, res) => {
  const requestType = req.body.request_type;

  if (!requestType) {
    return res.status(400).json({ error: "Bad request" });
  }

  if (requestType === "schedule") {
    await handleScheduleRequest(req, res);
  } else if (requestType === "score") {
    const matchId = req.body.match_id;

    if (!matchId) {
      return res.status(400).json({ error: "Bad request" });
    }

    await handleScoreRequest(req, res, matchId);
  } else {
    res.status(400).json({ error: "Bad request" });
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
