const app = require('./app');
const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) return console.log('Error:', err);
  console.log(`Server running at http://localhost:${PORT}`);
});