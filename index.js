//External variables
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const touristRoutes = require('./routes/touristRoutes'); // Ensure correct relative path
const touristController= require('./controllers/touristController');

let isTourist = 1;

// For handling the __dirname issue with ES modules
const { fileURLToPath } = require('url');

const app = express();
const port = 8000;

//Connect to mongoDB (will be used later on to connect with our DB)
//put in env the port an dthe url
const dbURI = 'mongodb+srv://winggo567:Winggo123456@winggo.s9seh.mongodb.net/wingGo?retryWrites=true&w=majority&appName=WingGo';

// mongoose.connect(dbURI);
mongoose.connect(dbURI)
  .then(() => {console.log('Connected to MongoDB');
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
  })
  .catch((err) => console.log('MongoDB connection error:', err));



// Add this line to parse incoming JSON request bodies
app.use(express.json());


/// routes
// Route to serve the homepage
app.get("/", (req, res) => {
  res.send('<h1>hii</h1>');
});

app.post("/register", (req, res) => {
 
  if (isTourist ==1){
    touristController.tourist_register(req, res);
  }
  else {
    //not tourist
  }
});


// Tourist routes
// app.use('/tourist',touristRoutes);




//Must be at the bottom so that it doesnt match right away
app.use((req, res)=> {
  //we could add status code bec it returns a req obj
  res.status(404).sendFile('./views/404.html', {root: __dirname});
});