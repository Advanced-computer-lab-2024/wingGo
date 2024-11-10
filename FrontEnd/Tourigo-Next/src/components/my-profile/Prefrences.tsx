import { redeemPoints } from '@/api/LoyaltyApi';
import CountUpContent from '@/elements/counter/CountUpContent';
import React, { useState } from 'react';
import { FaWallet } from "react-icons/fa";


interface Props {
  
    }
const Prefrences: React.FC<Props> = ({}) => {

    const [availablePrefrences, setAvailablePrefrences] = useState<Array<any>>([]);
    

  return (
    <section className="bd-team-details-area section-space position-relative">
        <h2 className="team-single-title">Preferences</h2>
    </section>
  );
};

export default Prefrences;