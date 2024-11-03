//@refresh

import IndexMain from "@/components/index/IndexMain";
import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/layout/DefaultWrapper";

const Home = () => {
  return (
    <>
      <MetaData pageTitle="Wellcome To Tourigo">
        <Wrapper>
          <main>
            <IndexMain />
          </main>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default Home;
