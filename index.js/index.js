const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  res.send('Diagnostic server is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('--- CHECKING ENVIRONMENT VARIABLES ---');
  console.log('PGHOST:', process.env.PGHOST);
  console.log('PGUSER:', process.env.PGUSER);
  console.log('PGPORT:', process.env.PGPORT);
  console.log('PGDATABASE:', process.env.PGDATABASE);
  // We don't log the password for security, but this will confirm the others.
  if (process.env.PGPASSWORD) {
    console.log('PGPASSWORD: Is set (length is not zero)');
  } else {
    console.log('PGPASSWORD: IS MISSING OR EMPTY!');
  }
  console.log('------------------------------------');
});