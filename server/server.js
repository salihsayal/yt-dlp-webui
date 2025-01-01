// server.js
const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/download", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL fehlt" });
  }

  const ytdlpProcess = spawn("yt-dlp", [
    "-o",
    "-",
    url,
  ]);

  res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
  res.setHeader("Content-Type", "video/mp4");

  ytdlpProcess.stdout.pipe(res);

  ytdlpProcess.stderr.on("data", (data) => {
    console.error(`yt-dlp stderr: ${data}`);
  });

  ytdlpProcess.on("error", (error) => {
    console.error(`Fehler beim Starten von yt-dlp: ${error}`);
    res.status(500).json({ error: "Fehler beim Download" });
  });

  ytdlpProcess.on("close", (code) => {
    console.log(`yt-dlp Prozess beendet mit Code ${code}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
