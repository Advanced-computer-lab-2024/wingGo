// app/places.tsx

import DestinationGridRightMain from "@/components/places-view/DestinationGridRightMain";
import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/layout/DefaultWrapper";
import React from "react";

const Places = () => {
  return (
    <>
      <MetaData pageTitle="Museums and Historical Places">
        <Wrapper>
          <main>
            < DestinationGridRightMain/>
          </main>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default Places;
