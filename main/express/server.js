const express = require('express');
const { exec } = require('child_process');
const connectDB = require('./config/db');
const app = express();
const axiosBase = require('axios');
const cors = require('cors');
// const path = require('path');

// Connect Database
connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

app.get('/', (req, res, next) => {
  // res.send('API Running');
  res.json({ mesage: 'Welcome to application.'});
});

// const axios = axiosBase.create({
//   baseURL: 'http://gumtree:4567', // バックエンドB のURL:port を指定する
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest'
//   },
//   responseType: 'json'  
// });

// app.get('/gumtree', function(req, res) {
//   axios.get('/api')
//     .then(function(response) {
//       res.send("gumtree");
//       const gum = response.data;
//       // res.send(`${response.data["gumtree"]}`);
//       // res.send(`${gum["gumtree"]}`)
//       // console.log(response.data["gumtree"]);
//       exec(`python3 gumtree.py sample.xml`, (err, stdout, stderr) => {
//         if (err) {
//           // res.json({err: `${stderr}`});
//           res.send(`err: ${stderr}`);
//         }
//         // res.json({"gumtree": `${stdout}`});
//         res.send(`std: ${stdout}`);
//       })
//     })
//     .catch(function(error) {
//       console.log('ERROR!! occurred in Backend.')
//     })
// });


// app.get('/py', function(req, res) {
//   exec(`python3 gumtree.py`, (err, stdout, stderr) => {
//     if (err) {
//       res.send(`err: ${stderr}`);
//     }
//     res.type('application/xml');
//     res.send(stdout);
//   })
// });



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
