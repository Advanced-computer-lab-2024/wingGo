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
const prefreRoutes = require('./routes/preferenceTagRoutes');
const orderRoutes = require('./routes/orderRoutes');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');
const bodyParser = require('body-parser');
const { S3Client } = require('@aws-sdk/client-s3');
const notificationScheduler = require('./jobs/notificationScheduler');
require('dotenv').config();


const app = express();
const port = 8000;
app.use(cors());
app.use(bodyParser.json());

const { fileURLToPath } = require('url');
//Connect to mongoDB (will be used later on to connect with our DB)
//put in env the port an dthe url
const dbURI = 'mongodb+srv://winggo567:Winggo123456@winggo.s9seh.mongodb.net/wingGo?retryWrites=true&w=majority&appName=WingGo';
// const dbURI = process.env.MONGODB_URI;


const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const BUCKET = process.env.AWS_BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  })
});

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

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send("Successfully uploaded "+ req.file.location + "  location");
});



app.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  let x = await s3.getObject({Bucket: BUCKET, Key: filename}).promise();
  res.send(x.Body);
}
);

app.delete('/delete/:filename', async (req, res) => {
  const filename = req.params.filename;
  let x = await s3.deleteObject({Bucket: BUCKET, Key: filename}).promise();
  res.send("File deleted successfully");
});

// Start the notification scheduler
notificationScheduler();


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
  const { role } = req.body; // Get the role from request body

  if (role === 'tourist') {
    touristController.tourist_register(req, res); // Call the tourist registration handler
  }else {
    // Apply the file upload middleware for other roles
    upload.fields([{ name: 'IDdocument' }, { name: 'certificate' }])(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        // Call the pending user registration handler
        PendingUsersController.pendinguser_register(req, res);
    });
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

app.use('/prefrences', prefreRoutes);


app.use('/order', orderRoutes);


// Serve static files from the "images" directory
// Set up static folder
// Serve static files from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));






// //Must be at the bottom so that it doesnt match right away
// app.use((req, res)=> {
//   //we could add status code bec it returns a req obj
//   res.status(404).sendFile('./views/404.html', {root: __dirname});
// });

