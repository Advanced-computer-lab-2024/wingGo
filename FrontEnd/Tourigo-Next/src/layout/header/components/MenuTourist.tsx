import menu_data from "@/data/menu/menu-dataTourist";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { imageLoader } from "@/hooks/image-loader";
import { useCurrency } from "@/contextApi/CurrencyContext";

const Menu = () => {
  const { setCurrency, currency } = useCurrency(); // Access setCurrency from CurrencyContext

  const handleCurrencyChange = (newCurrency: "USD" | "EUR" | "EGP") => { 
    setCurrency(newCurrency); // Update currency context
  };

  return (
    <>
      <ul>
        {menu_data.map((item) => (
          <li
            key={item.id}
            className={`${
              item?.children === true
                ? "menu-item-has-children"
                : `${item?.children === false ? "has-mega-menu" : ""}`
            } `}
          >
            <Link href={item?.link}>{item?.title}</Link>

            {/* Render dropdown for Currency Selector */}
            {item.title === "Currency" && (
              <ul className="submenu">
                {item?.submenus?.map((currencyOption, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleCurrencyChange(currencyOption.currency as "USD" | "EUR" | "EGP")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: currency === currencyOption.currency ? "blue" : "inherit",
                      }}
                    >
                      {currencyOption.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* img menu */}
            {item.previewImg === true && (
              <ul className="mega-menu home-menu-grid">
                {item?.submenus?.length && (
                  <>
                    {item?.submenus.map((subItem, index) => (
                      <li key={index}>
                        <div className="home-menu-item">
                          <div className="home-menu-thumb">
                            <Image
                              src={subItem?.prviewIMg}
                              loader={imageLoader}
                              style={{ width: "100%", height: "auto" }}
                              alt="thumb not found"
                            />
                            <div className="home-menu-buttons">
                              <Link
                                href={subItem?.link}
                                className="bd-primary-btn btn-style"
                              >
                                <span className="bd-primary-btn-text">
                                  {subItem?.title}
                                </span>
                                <span className="bd-primary-btn-circle"></span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            )}

            {/* dropdown menu for other items */}
            {item.hasDropdown && item.submenus && item.title !== "Currency" && (
              <ul className="submenu">
                {item.submenus.map((dropdownItem, index) => (
                  <li key={index} className="menu-item-has-children has-arrow">
                    <Link href={dropdownItem?.link}>{dropdownItem?.title}</Link>
                  </li>
                ))}
              </ul>
            )}

            {/* multi pages */}
            {item?.pageLayout === true && item?.submenus?.length && (
              <ul className="mega-menu mega-grid-4">
                {item?.submenus?.map((pageLayoutItem, pageLayoutIndex) => (
                  <li key={pageLayoutIndex}>
                    <Link href={pageLayoutItem?.link} className="title">
                      {pageLayoutItem?.title}
                    </Link>
                    {pageLayoutItem?.megaMenu?.length && (
                      <ul>
                        {pageLayoutItem?.megaMenu?.map(
                          (
                            singlePageItem: any,
                            singlePageItemIndex: number
                          ) => (
                            <li key={singlePageItemIndex}>
                              <Link href={singlePageItem?.link}>
                                {singlePageItem?.title}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <p>Current selected currency: {currency}</p>
    </>
  );
};

export default Menu;
