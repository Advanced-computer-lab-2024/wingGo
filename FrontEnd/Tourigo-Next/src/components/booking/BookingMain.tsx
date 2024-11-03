import React from 'react';
import Breadcrumb from '../common/breadcrumb/BreadCrumb';
import Booking from './Booking';

const BookingMain = () => {
    return (
        <>
            <Breadcrumb titleOne='Booking Form' titleTwo='Booking Form'/>
            <Booking />
        </>
    );
};

export default BookingMain;