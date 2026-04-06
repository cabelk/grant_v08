const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`grant_v08 server listening on http://localhost:${PORT}`);
});
