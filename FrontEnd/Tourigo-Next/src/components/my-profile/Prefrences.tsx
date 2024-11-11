import { redeemPoints } from '@/api/LoyaltyApi';
import { addPreferencesToTourist, deletePreferenceFromTourist, getAllPreferenceTags } from '@/api/PrefrenceApi';
import CountUpContent from '@/elements/counter/CountUpContent';
import React, { useState, useEffect } from 'react';
import { FaWallet } from "react-icons/fa";



interface Props {
  profileData: any,
  id: string,
  setPrefrenceRefresh: any
  }
const Prefrences: React.FC<Props> = ({profileData, id, setPrefrenceRefresh}) => {

    const [availablePrefrences, setAvailablePrefrences] = useState<Array<any>>([]);
    const [selectedPrefrences, setSelectedPrefrences] = useState<Array<any>>(profileData?.preferences);
    console.log('Selected Preferences:', selectedPrefrences);
    
   

    useEffect(() => {
      const fetchAllPreferenceTags = async () => {
        try {
          const data = await getAllPreferenceTags();
          console.log('Tags available:', data);
          setAvailablePrefrences(data);
        } catch (error) {
          console.error('Error fetching Tags:', error);
        }
      };

  
      fetchAllPreferenceTags();
      
    }, []);

    const updatePreferences = async (itemID: string) => {
      try {
        
        console.log('pref tag id:', itemID);
        const response = await addPreferencesToTourist(id, itemID);
        
        setPrefrenceRefresh(true);
      } catch (error) {
        console.error('Error adding preferences:', error);
      }
    };

    const deletePreferences = async (itemID: string) => {
      try {
        console.log('pref tag id:', itemID);
        const response = await deletePreferenceFromTourist(id, itemID);
        setPrefrenceRefresh(true);
      } catch (error) {
        console.error('Error adding preferences:', error);
      }
    }

  const handleSelectPrefClick = (id: any) => {
    if(selectedPrefrences?.includes(id)){
      const index = selectedPrefrences?.indexOf(id);
      if (index > -1) {
        selectedPrefrences?.splice(index, 1);
      }
      setSelectedPrefrences([...selectedPrefrences]);
      deletePreferences(id);
    }else{
      setSelectedPrefrences([...selectedPrefrences, id]);
      updatePreferences(id);
    }
  }
    

  return (
    <section className="bd-team-details-area section-space position-relative">
        <h2 className="team-single-title">Preferences</h2>
        
      <div className="buttons-container-pref">
        {availablePrefrences.map((item) => (
          <button
            onClick={() => handleSelectPrefClick(item._id)}
            className={`button-pref ${
              selectedPrefrences?.includes(item._id) ? "active-pref" : ""
            }`}
            key={item._id}
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Prefrences;