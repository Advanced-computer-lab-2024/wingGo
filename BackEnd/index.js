//External variables
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const touristRoutes = require('./routes/touristRoutes'); // Ensure correct relative path
const touristController= require('./controllers/touristController');
const PendingUsersController= require('./controllers/PendingUserController');
const adminRoutes = require('./routes/AdminRoutes');
const tourGuideRoutes = require('./routes/TourGuideRoutes'); // Ensure correct path
const govornorRoutes = require('./routes/GovornorRoutes');
const advertiserRoutes = require('./routes/advertiserRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

const guestRoutes = require('./routes/guestRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

let isTourist = 2; //yb2a set lama el shakhs ykhtar men el form eno tourist fa  hankhdo men el frontend 
let userType = "tourist";

// For handling the __dirname issue with ES modules
const { fileURLToPath } = require('url');

const app = express();
const port = 8000;
app.use(cors());
app.use(bodyParser.json());
// const port = 8000;

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
  res.send('<h1>hii</h1>');const itineraryController = require('../controllers/ItineraryController');

  // Create a new itinerary
  router.post('/Createitinerary', itineraryController.createItinerary);
  
  // Get all itineraries for a tour guide
  router.get('/getitinerary/:id', itineraryController.getItineraries);
  
  router.get('/getALLitineraries', itineraryController.getAllItineraries);
  
  router.get('/itineraries/tourGuide/:tourGuideId', itineraryController.getItinerariesByTourGuide);
  // Update an itinerary
  router.put('/Updateitinerary/:id', itineraryController.updateItinerary);
  
  // Delete an itinerary (only if no bookings exist)
  router.delete('/Deleteitinerary/:id', itineraryController.deleteItinerary);  
});

app.post("/register", (req, res) => {
 
  if (isTourist ==1){
    touristController.tourist_register(req, res);
  }
  else {
    PendingUsersController.pendinguser_register(req,res);
    //get username,passw,email from req + field role
    //and put in pendingUsers collection 
    // if(userType== "tourGuide"){}
       //let userType= role field
      //  pendingcontroll.pendinguser_register(req, res);
    //not tourist
  }
});

app.get("/getUsersinLogin", (req, res) => {

    PendingUsersController.getUserByUsername(req,res);

});



// Tourist routes
// app.use('/tourist',touristRoutes);

// Use the admin routes
app.use('/admin', adminRoutes);
app.use('/seller', sellerRoutes);

app.use('/tourguide', tourGuideRoutes);

// app.use('/tags', tagRoutes);



app.use('/govornor', govornorRoutes);
app.use('/advertiser', advertiserRoutes);

app.use('/tourist', touristRoutes);
app.use('/guest', guestRoutes);

// Serve static files from the "images" directory
// Set up static folder
// Serve static files from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));






//Must be at the bottom so that it doesnt match right away
app.use((req, res)=> {
  //we could add status code bec it returns a req obj
  res.status(404).sendFile('./views/404.html', {root: __dirname});
});
