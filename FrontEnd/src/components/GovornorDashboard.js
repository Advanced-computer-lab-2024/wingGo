import React, { useState, useEffect } from 'react';
import { createPlace,getAllPlaces,updatePlace,getPlaceById,deletePlace ,addTagToPlace } from '../APIs/govornorApi';
import '../styling/GovornorDashboard.css';


const GovornorDashboard = () => {
    const govornorId="67025f99bb5b4c55581ab286";
    const [newPlace,setNewPlace]=useState({
        name: '',
        description : '',
        location : '',
        openingHours :'',
        ticketPrices:{
            foreigner: 0,
            native: 0,
            student: 0
        },
        tags: {
            types: [], // Initialize as an empty array
            historicalPeriods: [] // Initialize as an empty array
        }
    });
const [places,setPlaces]=useState([]);
const [selectedPlace, setSelectedPlace] = useState(null);
const [searchPlaceId, setSearchPlaceId] = useState('');
const [searchResult, setSearchResult] = useState(null);
const [placeId, setPlaceId] = useState('');
const [tag, setTag] = useState('');
const [category, setCategory] = useState('type'); // Default to "type"
const [placeIdForTag, setPlaceIdForTag] = useState('');

useEffect(()=>{
    const fetchPlaces = async () => {
        const placesData = await getAllPlaces(govornorId);
        setPlaces(placesData);
    };
    fetchPlaces(); 
},[]);


const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
        const response = await createPlace(newPlace)
     
        setNewPlace({
            name: '',
            description: '',
            location: '',
            openingHours :'',
            ticketPrices: { foreigner: 0, native: 0, student: 0 },
            tags: { types: [], historicalPeriods: [] }
           

        });
    
    console.log(newPlace);
    const updatedPlaces = await getAllPlaces(govornorId);
    setPlaces(updatedPlaces);
     alert(response.message || "Place added successfully");
      
        

       
    } catch (error) {
        console.error('Error adding place:', error);
        alert('Failed to add place.');
    }
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        setNewPlace(prevState => ({
            ...prevState,
            [outerKey]: {
                ...prevState[outerKey],
                [innerKey]: value
            }
        }));
    } else {
    setNewPlace(prevState => ({
        ...prevState,
        [name]: value
    }));
} 
};
const handleSearchById = async (e) => {
    e.preventDefault();
    try {
        const place = await getPlaceById(searchPlaceId);
        setSearchResult(place);
    } catch (error) {
        alert('Failed to fetch place.');
    }
};

 const handleEditPlace = async (updatedPlace) => {
    const { placeId, ...placesData } = updatedPlace;
    try {
        const response = await updatePlace(placeId, placesData);
        setSelectedPlace(null);
        const updatedPlaces = await getAllPlaces(govornorId);
        setPlaces(updatedPlaces);
        alert(response.message || "Place updated successfully");
    } catch (error) {
        alert('Failed to update place.');
    }
};

const handleDeletePlace = async (e) => {
    e.preventDefault();
    try {
        const response = await deletePlace(placeId);
        alert( "Place deleted successfully");
        setPlaceId('');
        const updatedPlaces = await getAllPlaces(govornorId);  // Optionally refresh the places list
        setPlaces(updatedPlaces);    
    } catch (error) {
        alert('Failed to delete place: ' + error.message);
    }
};
const handleAddTag = async (e) => {
    e.preventDefault();
    try {
        const response = await addTagToPlace(placeIdForTag, tag, category);
        alert(response.message || "Tag added successfully");
        const updatedPlace = await getPlaceById(placeIdForTag);
        setPlaces(prevPlaces => prevPlaces.map(place => place._id === updatedPlace._id ? updatedPlace : place));

        setTag(''); // Clear the input field after success
        setPlaceIdForTag('');
    } catch (error) {
        alert(`Failed to add tag: ${error.message}`);
    }
};

    return (
        <div className="governor-dashboard">
        <h1>Govornor Dashboard </h1>
        
        <h2>Add New Place</h2>
        <form onSubmit={handleAddPlace}>
            <label>
                Name:
                <input type="text" name="name" value={newPlace.name} onChange={handleInputChange} required />
            </label>
            <label>
                Description:
                <input type="text" name="description" value={newPlace.description} onChange={handleInputChange} required />
            </label>
            <label>
                Location:
                <input type="text" name="location" value={newPlace.location} onChange={handleInputChange} required />
            </label>
            <label>
                 Opening Hours:
               <input type="text" name="openingHours" value={newPlace.openingHours} onChange={handleInputChange} required />
              </label>

            <label>
                Foreigner Ticket Price:
                <input type="number" name="ticketPrices.foreigner" value={newPlace.ticketPrices.foreigner} onChange={handleInputChange} required />
            </label>
            <label>
                Native Ticket Price:
                <input type="number" name="ticketPrices.native" value={newPlace.ticketPrices.native} onChange={handleInputChange} required />
            </label>
            <label>
                Student Ticket Price:
                <input type="number" name="ticketPrices.student" value={newPlace.ticketPrices.student} onChange={handleInputChange} required />
            </label>
            <label>
    Type (Optional):
    <select
                        value={newPlace.tags.types[0] || ''} // Show selected type
                        onChange={(e) => {
                            const value = e.target.value;
                            setNewPlace(prevState => ({
                                ...prevState,
                                tags: {
                                    ...prevState.tags,
                                    types: value ? [value] : [] // Only allow one type for simplicity
                                }
                            }));
                        }}
                    >
        <option value="">Select a type</option>
        <option value="Monuments">Monuments</option>
        <option value="Museums">Museums</option>
        <option value="Religious Sites">Religious Sites</option>
        <option value="Palaces/Castles">Palaces/Castles</option>
    </select>
</label>
<label>
    Historical Period (Optional):
    <input
       type="text"
       value={newPlace.tags.historicalPeriods.join(', ')} // Join periods for input
       onChange={(e) => {
           const periods = e.target.value.split(',').map(period => period.trim());
           setNewPlace(prevState => ({
               ...prevState,
               tags: {
                   ...prevState.tags,
                   historicalPeriods: periods
               }
           }));
       }}
       placeholder="Enter historical periods separated by commas"
    />
</label>

            <button type="submit">Add Place</button>
        </form>

        <h2>List of All Places</h2>
        <ul>
            {places.map(place => (
                <li key={place._id}>
                    <h3>{place.name}</h3>
                    <p>Description: {place.description}</p>
                    <img src={place.picture} alt={place.name} />
                    <p>Location: {place.location}</p>
                    <p>opening Hours: {place.openingHours}</p>
                    <p>Ticket Prices: 
                        <br />Foreigner: ${place.ticketPrices.foreigner} 
                        <br />Native: ${place.ticketPrices.native} 
                        <br />Student: ${place.ticketPrices.student}
                    </p>
                    <p>Tags:
                <br />Type(s): {place.tags.types.join(', ')}
                <br />Historical Period(s): {place.tags.historicalPeriods.join(', ')}
            </p>

                    <button onClick={() => setSelectedPlace(place)}>Edit</button>
                </li>
            ))}
        </ul>

        {selectedPlace && (
            <EditPlace
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
               onSave={handleEditPlace}
            />
        )}

            <h2>Search Place by ID</h2>
            <form onSubmit={handleSearchById}>
                <input
                    type="text"
                    placeholder="Enter Place ID"
                    value={searchPlaceId}
                    onChange={(e) => setSearchPlaceId(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>

            {searchResult && (
                <div>
                    <h3>Search Result:</h3>
                    <p>Name: {searchResult.name}</p>
                    <p>Description: {searchResult.description}</p>
                    <img src={searchResult.picture} alt={searchResult.name} ></img>
                    <p>Location: {searchResult.location}</p>
                    <p>Opening Hours: {searchResult.openingHours}</p>
                    <p>Ticket Prices: Foreigner: {searchResult.ticketPrices.foreigner}, Native: {searchResult.ticketPrices.native}, Student: {searchResult.ticketPrices.student}</p>
                    <p>Tags:
            <br />Type(s): {searchResult.tags.types.join(', ')}
            <br />Historical Period(s): {searchResult.tags.historicalPeriods.join(', ')}
        </p>
                </div>
            )}

<           h2>Delete Place by ID</h2>
            <form onSubmit={handleDeletePlace}>
                <label htmlFor="placeId">Place ID:</label>
                <input
                    type="text"
                    id="placeId"
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    required
                />
                <button type="submit">Delete Place</button>
            </form>
            <h2>Add Tag to Place</h2>
            <form onSubmit={handleAddTag}>
                <label>
                    Place ID:
                    <input
                        type="text"
                        value={placeIdForTag}
                        onChange={(e) => setPlaceIdForTag(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Tag:
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Category:
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="type">Type</option>
                        <option value="historicalPeriod">Historical Period</option>
                    </select>
                </label>
                <button type="submit">Add Tag</button>
            </form>


    </div>

    
);
}

const EditPlace = ({ place, onClose, onSave }) => {
    const [name, setName] = useState(place.name);
    const [description, setDescription] = useState(place.description);
    const [location, setLocation] = useState(place.location);
    const [openingHours, setNewOpeningHours] = useState(place.openingHours);
    const [types, setTypes] = useState(place.tags?.types || []);
    const [historicalPeriods, setHistoricalPeriods] = useState(place.tags?.historicalPeriods || []);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedPlace = { 
            placeId:place._id, 
            name, 
            description,
            location, 
            openingHours ,
            types,
            historicalPeriods
            
        };
        onSave(updatedPlace);
    };

    return (
        <div className="edit-place">
            <h2>Edit Place</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

                <label>Opening Hours:</label>
                <input type="text" value={openingHours} onChange={(e) => setNewOpeningHours(e.target.value)} />
                <label>Type(s):</label>
                <input
                    type="text"
                    value={types.join(', ')}  // Display types as comma-separated values
                    onChange={(e) => setTypes(e.target.value.split(',').map(type => type.trim()))}
                    placeholder="e.g., Monuments, Museums"
                />

                <label>Historical Period(s):</label>
                <input
                    type="text"
                    value={historicalPeriods.join(', ')}  // Display historical periods as comma-separated values
                    onChange={(e) => setHistoricalPeriods(e.target.value.split(',').map(period => period.trim()))}
                    placeholder="e.g., Medieval, Ancient"
                />



                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default GovornorDashboard;