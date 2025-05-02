import matchDB from "./firebase.js";

export async function getTeamsData() {
  const res = await fetch(
    "https://tsr.kheloindia.gov.in/api/tsr/participants?token=18|N6WTJGIMDOVFW7sihBBn2s9UTB0BgcM02ZOEEw5t&sport=sepaktakraw"
  );
  const res_data = await res.json();
  if (!res_data) {
    return null;
  }

  return res_data.data.team_details;
}

export async function getMatchesData() {
  const snapshot = await matchDB.collection("matches").get();
  const matches = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return matches;
}

export async function getMatchData(matchId) {
  const matches = await getMatchesData();
  const match = matches.find((match) => match.matchId === matchId);

  return match;
}

export function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getFormattedMatch(match, team_details) {
  const team1 = capitalizeName(match.teams.team1.name);
  const team2 = capitalizeName(match.teams.team2.name);

  const gender = match.category === "MEN" ? "male" : "female";

  return {
    match_id: match.matchId,
    match_date: match.date,
    team1_logo: team_details[team1].state_logo,
    team2_logo: team_details[team2].state_logo,
    team1: team1,
    team2: team2,
    team1_score: "setsWon" in match ? match.setsWon.team1 : 0,
    team2_score: "setsWon" in match ? match.setsWon.team2 : 0,
    gender: gender,
  };
}

export function sortRounds(rounds) {
  const order = [
    "League",
    "Preliminary",
    "Qualification",
    "Semi Final",
    "Final",
  ];

  const orderMap = new Map(order.map((item, index) => [item, index]));

  rounds.sort((a, b) => {
    const aIndex = orderMap.has(a) ? orderMap.get(a) : Infinity;
    const bIndex = orderMap.has(b) ? orderMap.get(b) : Infinity;
    return aIndex - bIndex;
  });

  return rounds;
}
