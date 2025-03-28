const db = require("../config/db"); 
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require('uuid');



const secretKey = "DB PRODUCTIONS"; 


function decryptRegId(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}




exports.postGameData = async (req, res) => {
  const { game, date, rooms } = req.body;

  if (!game || !date || !rooms) {
    return res.status(400).json({ error: "Missing game, date, or rooms data" });
  }

  try {
    const insertData = [];

    for (const [room, players] of Object.entries(rooms)) {
      for (const player of Object.values(players)) {
        if (!player.reg_id) {
          console.warn(`Skipping player due to missing register ID`);
          continue;
        }

        const [students] = await db.promise().query(
          "SELECT unique_id, reg_id FROM students"
        );

        let studentUniqueId = null;
        let matchedEncryptedRegId = null;

        for (const student of students) {
          const decryptedRegId = decryptRegId(student.reg_id);

          if (decryptedRegId === player.reg_id) {
            studentUniqueId = student.unique_id;
            matchedEncryptedRegId = student.reg_id;
            break;
          }
        }

        if (!studentUniqueId) {
          console.warn(`Student Register ID ${player.reg_id} not found in students table.`);
          continue;
        }

        const [existingGame] = await db.promise().query(
          "SELECT game_id FROM game_data WHERE game_name = ? AND date = ?",
          [game, date]
        );

        let gameId;
   
        if (existingGame.length > 0) {
          gameId = existingGame[0].game_id;
        } else {
          gameId = uuidv4();
        }

        const sql = `
          INSERT INTO game_data (game_id, student_unique_id, reg_id, game_name, date, room, game_data)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const jsonData = JSON.stringify(player);

        insertData.push(db.promise().query(sql, [gameId, studentUniqueId, matchedEncryptedRegId, game, date, room, jsonData]));
      }
    }
    await Promise.all(insertData);
    res.json({ message: "Game data stored!" });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};





exports.getGameData = (req, res) => {
  const { gameName, date, regId } = req.params;

  let sql = "SELECT * FROM game_data";
  const conditions = [];
  const values = [];

  if (gameName) {
    conditions.push("game_name = ?");
    values.push(gameName);
  }
  if (date) {
    conditions.push("date = ?");
    values.push(date);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "No game data found" });
    }

    let response;

    if (gameName && date) {
      response = results;
    } else if (gameName) {
      response = results;
    } else if (regId) {
      response = results
        .filter(row => decryptRegId(row.reg_id) === regId) 
        .map(row => ({
          game_id: row.game_id,
          game_name: row.game_name,
          date: row.date
        }));
    } else if (date) {
      response = Array.from(new Map(results.map(row => [row.game_id, {
        game_id: row.game_id,
        game_name: row.game_name,
        date: row.date
      }])).values());
    } else {
      
      response = Array.from(
        new Map(results.map(row => [row.game_id, {
          game_id: row.game_id,
          game_name: row.game_name
        }])).values()
      );
    }

    res.json(response);
  });
};






