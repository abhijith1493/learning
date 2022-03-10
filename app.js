const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sql3 = require("sqlite3");
app.use(express.json());

let db = null;
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sql3.Database,
    });
    app.listen(3001, () => {
      console.log("running local host 3001");
    });
  } catch (e) {
    console.log(`Error code: ${e.message}`);
    process.exit;
  }
};
console.log(dbPath);
initializeDbAndServer();

console.log(db);
app.get("/players/", async (request, response) => {
  try {
    const query = `select * from cricket_team;`;
    const queryExecute = await db.all(query);

    const finalResult = queryExecute.map((dbObject) => {
      return {
        playerId: dbObject.player_id,
        playerName: dbObject.player_name,
        jerseyNumber: dbObject.jersey_number,
        role: dbObject.role,
      };
    });

    response.send("Player Added to Team");
    console.log(finalResult);
  } catch (e) {
    console.log(e);
  }
});

app.post("/players/", async (request, response) => {
  try {
    const { playerName, jerseyNumber, role } = request.body;
    const query = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
    const queryExecute = await db.run(query);
    response.send(queryExecute);
  } catch (e) {
    console.log(e);
  }
});

app.get("/players/:playerId/", async (request, response) => {
  const { value } = request.params;
  console.log(value);
  const query = `select * from cricket_team where player_id = ${value};`;
  const resultQ = await db.get(query);
  response.send(resultQ);
});

module.exports = app;
