import BookingMain from "@/components/booking/BookingMain";
import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/layout/DefaultWrapper";
import React from "react";

const Booking = () => {
  return (
    <>
      <MetaData pageTitle="Booking">
        <Wrapper>
          <main>
            <BookingMain />
          </main>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default Booking;
