const app = require('./app');
const PORT = process.env.PORT || 3000; // Look for an environment port or default to 3000

app.listen(PORT, (err) => {
  if (err) return console.log('Error:', err);
  console.log(`Server running at http://localhost:${PORT}`);
});