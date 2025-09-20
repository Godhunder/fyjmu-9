const mineflayer = require('mineflayer');
const express = require('express');

const HOST = process.env.MC_HOST || 'flash.ateex.cloud';
const PORT = parseInt(process.env.MC_PORT || '6135', 10);
const USERNAME = process.env.MC_USER || 'AFKBot' + Math.floor(Math.random() * 1000);

// --- tiny HTTP server so Render is happy ---
const app = express();
app.get('/', (req, res) => res.send('AFK Bot is running ✅'));
const webPort = process.env.PORT || 3000;
app.listen(webPort, () => {
  console.log(`[http] Listening on ${webPort}`);
});

// --- bot logic ---
function startBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME
  });

  bot.once('spawn', () => {
    console.log(`[bot] Spawned as ${USERNAME} on ${HOST}:${PORT}`);

    // Small head movement
    setInterval(() => {
      if (!bot.entity) return;
      const yaw = (Math.random() - 0.5) * 2 * Math.PI;
      const pitch = (Math.random() - 0.5) * 0.5;
      bot.look(yaw, pitch, true).catch(() => {});
    }, 5000);

    // Arm swing
    setInterval(() => {
      if (typeof bot.swingArm === 'function') {
        bot.swingArm('right').catch(() => {});
      }
    }, 15000);
  });

  bot.on('end', () => {
    console.log('[bot] Disconnected, retrying in 5s...');
    setTimeout(startBot, 5000);
  });

  bot.on('kicked', (reason) => console.log('[bot] Kicked:', reason));
  bot.on('error', (err) => console.log('[bot] Error:', err.message));
}

startBot();
