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
const productRoutes = require('./routes/productRoutes');
const guestRoutes = require('./routes/guestRoutes');

let isTourist = 2; //yb2a set lama el shakhs ykhtar men el form eno tourist fa  hankhdo men el frontend 
let userType = "tourist";

// For handling the __dirname issue with ES modules
const { fileURLToPath } = require('url');

const app = express();
const port = 8000;
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
  res.send('<h1>hii</h1>');
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


// Tourist routes
// app.use('/tourist',touristRoutes);

// Use the admin routes
app.use('/admin', adminRoutes);
app.use('/seller', sellerRoutes);

app.use('/tourguide', tourGuideRoutes);

// app.use('/tags', tagRoutes);

app.use('/product', productRoutes);

app.use('/govonor', govornorRoutes);
app.use('/advertiser', advertiserRoutes);
app.use('/seller', sellerRoutes);
app.use('/tourist', touristRoutes);
app.use('/guest', guestRoutes);




//Must be at the bottom so that it doesnt match right away
app.use((req, res)=> {
  //we could add status code bec it returns a req obj
  res.status(404).sendFile('./views/404.html', {root: __dirname});
});
