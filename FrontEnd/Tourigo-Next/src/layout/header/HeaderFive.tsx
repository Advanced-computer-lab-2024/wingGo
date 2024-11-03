import Image from "next/image";
import Link from "next/link";
import React from "react";
import logoBlack from "../../../public/assets/images/logo/logo-black.svg";
import { imageLoader } from "@/hooks/image-loader";
import Menu from "./components/Menu";
import useGlobalContext from "@/hooks/use-context";

const HeaderFive = () => {
  const { toggleSideMenu, scrollDirection } = useGlobalContext();
  return (
    <>
      <header>
        {/** header top bar start**/}
        <div className={`header-top-area bg-theme-primary d-none d-sm-block`}>
          <div className="container">
            <div className="header-top-main">
              <div className="header-top-left d-flex align-items-center">
                <div className="header-top-left-item">
                  <span>
                    <i className="fa-solid fa-location-dot"></i>
                  </span>
                  <Link href="#">100 San Francisco Street, New York</Link>
                </div>
                <div className="header-top-left-item">
                  <span>
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <Link href="/mailto:contact@tourigo.com">
                    contact@tourigo.com
                  </Link>
                </div>
              </div>
              <div className="heder-top-right d-none d-md-flex align-items-center gap-3">
                <div className="topbar-social">
                  <ul>
                    <li>
                      <Link href="#">
                        <i className="icon-facebook"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="icon-twitter-x"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="icon-linkedin"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="icon-youtube"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/** header top bar end**/}
        <div
          id="header-sticky"
          className={`header-area ${
            scrollDirection === "down" ? "bd-sticky" : ""
          }`}
        >
          <div className="container">
            <div className="mega-menu-wrapper p-relative">
              <div className="header-main">
                <div className="header-left">
                  <div className="header-logo">
                    <Link href="/">
                      <Image
                        src={logoBlack}
                        loader={imageLoader}
                        style={{ width: "100%", height: "auto" }}
                        alt="logo not found"
                      />
                    </Link>
                  </div>
                  <div className="mean-menu-wrapper d-none d-xl-block">
                    <div className="main-menu">
                      <nav
                        className="main-menu main-menu-three"
                        id="mobile-menu"
                      >
                        <Menu />
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="header-right">
                  <div className="header-action d-flex align-items-center">
                    <div className="header-btn-wrap">
                      <div className="d-none d-xs-inline-flex gap-15 align-items-center">
                        <div className="bd-search-btn-wrapper">
                          <button className="bd-search-open-btn">
                            <i className="fa-regular fa-magnifying-glass"></i>
                          </button>
                        </div>
                        <div className="header-currency-item style-two header-currency">
                          <span
                            className="header-currency-toggle"
                            id="header-currency-toggle"
                          >
                            USD
                          </span>
                          <ul>
                            <li>
                              <Link href="#">KWD</Link>
                            </li>
                            <li>
                              <Link href="#">GBP</Link>
                            </li>
                            <li>
                              <Link href="#">EUR</Link>
                            </li>
                          </ul>
                        </div>
                        <div className="header-language-item header-language">
                          <span
                            className="header-language-toggle"
                            id="header-language-toggle"
                          >
                            Eng
                          </span>
                          <ul>
                            <li>
                              <Link href="#">Are</Link>
                            </li>
                            <li>
                              <Link href="#">Ita</Link>
                            </li>
                            <li>
                              <Link href="#">Rus</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div onClick={toggleSideMenu} className="header-hamburger">
                      <div className="sidebar-toggle">
                        <Link className="bar-icon-square" href="#">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                        </Link>
                      </div>
                    </div>
                    {/** for wp**/}
                    <div className="header-hamburger ml-20 d-none">
                      <button
                        type="button"
                        className="hamburger-btn offcanvas-open-btn"
                      >
                        <span>01</span>
                        <span>01</span>
                        <span>01</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderFive;
