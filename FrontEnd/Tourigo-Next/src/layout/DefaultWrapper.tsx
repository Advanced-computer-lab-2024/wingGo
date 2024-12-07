//@refresh
"use client";
import React, { useEffect, useState } from "react";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}
import { usePathname } from "next/navigation";
import HeaderOne from "./header/HeaderOne";
import { animationCreate } from "@/utils/utils";
import HeaderArea from "./header/HeaderArea";
import FooterArea from "./footer/FooterArea";
import FooterOne from "./footer/FooterOne";
import HeaderTwo from "./header/HeaderTwo";
import Headereight from "./header/Headereight";
import FooterTwo from "./footer/FooterTwo";
import HeaderThree from "./header/HeaderThree";
import FooterAreaThree from "./footer/FooterAreaThree";
import HeaderFour from "./header/HeaderFour";
import FooterAreaFour from "./footer/FooterAreaFour";
import HeaderFive from "./header/HeaderFive";
import FooterAreaFive from "./footer/FooterAreaFive";
import TourListingHeader from "./header/TourListingHeader";
import ShopHeader from "./header/ShopHeader";
import HeaderSix from "./header/HeaderSix";
import HeaderSeven from "./header/HeaderSeven";
import BacktoTop from "@/elements/backToTop/BacktoTop";
import SidebarMain from "./header/components/Sidebar/SidebarMain";
import HeaderDashboard from "./HeaderDashboard";
import Preloader from "@/components/common/Preloader";
interface WrapperProps {
  children: React.ReactNode;
}
const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      animationCreate();
    }, 2000);
  }, []);
  return (
    <>
      {isLoading ? (
        <>
          <Preloader />
        </>
      ) : (
        <>
          <SidebarMain />
          {(() => {
            switch (pathName) {
              case "/":
                return <HeaderArea />;
              case "/home":
                return <HeaderOne />;
              case "/home-two":
                return <HeaderTwo />;
              case "/home-three":
                return <HeaderThree />;
              case "/home-four":
                return <HeaderFour />;
              case "/home-five":
                return <HeaderFive />;
                case "/home-eight":
                return <Headereight />;
              case "/shop":
                return <ShopHeader />;
              case "/shop-v2":
                return <ShopHeader />;
              case "/shop-details":
                return <ShopHeader />;
              case "/sign-up":
                return <HeaderOne />;
              case "/sign-in":
                return <HeaderOne />;
              case "/forgot":
                return <HeaderSix />;
              case "/otp":
                return <HeaderSix />;
              case "/dashboard":
                return <HeaderDashboard />;
              case "/home-six":
                  return <HeaderSeven />;
              default:
                return <TourListingHeader />;
            }
          })()}
          {children}
          {(() => {
            switch (pathName) {
              case "/":
                return <FooterArea />;
              case "/home":
                return <FooterOne />;
              case "/home-two":
                return <FooterTwo />;
              case "/home-three":
                return <FooterAreaThree />;
              case "/home-five":
                return <FooterAreaFive />;

              default:
                return <FooterAreaFour />;
            }
          })()}
          <BacktoTop />
        </>
      )}
    </>
  );
};

export default Wrapper;
