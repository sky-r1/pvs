const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/', (req, res) => res.send('API Running'));

app.get('/api', (req, res) => {
  exec('sh gumtree.sh', (err, stdout, stderr) => {
    if (err) {
      res.json({"err": `${stderr}`});
      return
    }
    res.type('application/xml');
    res.send(stdout);
    return
  }
)
});

const PORT = process.env.PORT || 4567;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
