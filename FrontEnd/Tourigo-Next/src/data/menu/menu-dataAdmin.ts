import { MenuType } from "@/interFace/interFace";
import homeOneImg from "../../../public/assets/images/menu/menu-home-1.jpg";
import homeTowImg from "../../../public/assets/images/menu/menu-home-2.jpg";
import homeThreeImg from "../../../public/assets/images/menu/menu-home-3.jpg";
import homeFourImg from "../../../public/assets/images/menu/menu-home-4.jpg";
import homeFiveImg from "../../../public/assets/images/menu/menu-home-5.jpg";

const menu_data: MenuType[] = [
  {
    id: 1,
    hasDropdown: true,
    children: false,
    active: true,
    title: "Home",
    pluseIncon: true,
    link: "#",
    previewImg: true,
    submenus: [
      { title: "Home One", link: "/home", prviewIMg: homeOneImg },
      { title: "Home Two", link: "/home-two", prviewIMg: homeTowImg },
      { title: "Home Three", link: "/home-three", prviewIMg: homeThreeImg },
      { title: "Home Four", link: "/home-four", prviewIMg: homeFourImg },
      { title: "Home Five", link: "/home-five", prviewIMg: homeFiveImg },
    ],
  },
  {
    id: 2,
    hasDropdown: true,
    active: true,
    megaMenu: true,
    children: true,
    title: "Tour",
    pluseIncon: true,
    link: "#",
    submenus: [
      {
        title: "Tour Listing",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "Tour Listing Search", link: "/tour-listing" },
          { title: "Tour Listing Search 2", link: "/tour-listing-two" },
          { title: "Tour Listing Sidebar", link: "/tour-listing-three" },
          { title: "Tour Listing Full Width", link: "/tour-listing-four" },
          { title: "Tour Listing Video", link: "/tour-listing-five" },
          { title: "Tour Listing Banner", link: "/tour-listing-six" },
        ],
      },
      {
        title: "Tour Grid",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "No Sidebar", link: "/tour-grid" },
          { title: "Right Sidebar", link: "/tour-grid-right" },
          { title: "Left Sidebar", link: "/tour-grid-left" },
        ],
      },
      {
        title: "Tour Details",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "No Sidebar", link: "/tour-details" },
          { title: "Right Sidebar", link: "/tour-details-right" },
          { title: "Left Sidebar", link: "/tour-details-left" },
        ],
      },
    ],
  },
  {
    id: 3,
    hasDropdown: true,
    children: true,
    megaMenu: true,
    active: true,
    title: "Destination",
    pluseIncon: true,
    link: "#",
    submenus: [
      {
        title: "Destination Grid",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "No Sidebar", link: "/destinations-grid" },
          { title: "Right Sidebar", link: "/destinations-grid-right" },
          { title: "Left Sidebar", link: "/destinations-grid-left" },
        ],
      },
      {
        title: "Destination Details",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "No Sidebar", link: "/destinations-details" },
          { title: "Right Sidebar", link: "/destinations-details-right" },
          { title: "Left Sidebar", link: "/destinations-details-left" },
        ],
      },
    ],
  },
  {
    id: 4,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "Pages",
    pluseIncon: true,
    pageLayout: true,
    link: "#",
    submenus: [
      {
        title: "Page Layout 1",
        link: "#",
        megaMenu: [
          { title: "About Us", link: "/about" },
          { title: "Booking Form", link: "/booking" },
          { title: "Booking Confirm", link: "/booking-confirm" },
          { title: "Pricing", link: "/pricing" },
          { title: "Faq", link: "/faq" },
          { title: "Contact", link: "/contact" },
        ],
      },
      {
        title: "Page Layout 2",
        link: "#",
        megaMenu: [
          { title: "Team", link: "/team" },
          { title: "Team Details", link: "/team-details" },
          { title: "Error Page", link: "/error-page" },
          { title: "Privacy & Policy", link: "/privacy-policy" },
          { title: "Terms And Conditions", link: "/terms-conditions" },
        ],
      },
      {
        title: "Page Layout 3",
        link: "#",
        megaMenu: [
          { title: "Dashboard", link: "/dashboard" },
          { title: "Tour Listing Edit", link: "/tour-listing-edit" },
          { title: "Login", link: "/sign-in" },
          { title: "Register", link: "/sign-up" },
          { title: "Forgot Password", link: "/forgot" },
          { title: "OTP", link: "/otp" },
        ],
      },
      {
        title: "Page Layout 4",
        link: "#",
        megaMenu: [
          { title: "Shop", link: "/shop" },
          { title: "Shop V2", link: "/shop-v2" },
          { title: "Shop Details", link: "/shop-details" },
          { title: "Checkout", link: "/checkout" },
          { title: "Cart", link: "/cart" },
          { title: "Wishlist", link: "/wishlist" },
          { title: "Order Confirm", link: "/order" },
        ],
      },
    ],
  },
  {
    id: 5,
    hasDropdown: true,
    children: false,
    megaMenu: true,
    active: true,
    title: "Elements",
    pluseIncon: true,
    pageLayout: true,
    link: "#",
    submenus: [
      {
        title: "Elements Layout 1",
        link: "#",
        megaMenu: [
          { title: "Style Guide", link: "/elements/layout-one/style-guide" },
          {
            title: "Accordion",
            link: "/elements/layout-one/elements-accordion",
          },
          { title: "About Us", link: "/elements/layout-one/elements-about" },
          {
            title: "Advance Tab",
            link: "/elements/layout-one/elements-advancetab",
          },
          { title: "Blog", link: "/elements/layout-one/elements-blog" },
          { title: "Brand", link: "/elements/layout-one/elements-brand" },
        ],
      },
      {
        title: "Elements Layout 2",
        link: "#",
        megaMenu: [
          {
            title: "Breadcrumb",
            link: "/elements/layout-two/elements-breadcrumb",
          },
          { title: "Button", link: "/elements/layout-two/elements-button" },
          {
            title: "Call To Action",
            link: "/elements/layout-two/elements-cta",
          },
          { title: "Counter", link: "/elements/layout-two/elements-counter" },
          {
            title: "Destinations",
            link: "/elements/layout-two/elements-destinations",
          },
          { title: "Form", link: "/elements/layout-two/elements-form" },
        ],
      },
      {
        title: "Elements Layout 3",
        link: "#",
        megaMenu: [
          {
            title: "Footer Style",
            link: "/elements/layout-three/elements-footer",
          },
          { title: "Image Card", link: "/elements/layout-three/elements-card" },
          {
            title: "Icomoon Fonts Icon",
            link: "/elements/layout-three/elements-icomoon",
          },
          {
            title: "Offers",
            link: "/elements/layout-three/elements-our-offers",
          },
          { title: "Pricing", link: "/elements/layout-three/elements-pricing" },
          {
            title: "Social Share",
            link: "/elements/layout-three/elements-social",
          },
        ],
      },
      {
        title: "Elements Layout 4",
        link: "#",
        megaMenu: [
          { title: "Team", link: "/elements/layout-four/elements-team" },
          {
            title: "Testimonial",
            link: "/elements/layout-four/elements-testimonial",
          },
          { title: "Tour", link: "/elements/layout-four/elements-tour" },
          {
            title: "Why Chose Us",
            link: "/elements/layout-four/elements-why-chose",
          },
          { title: "More Coming", link: "/sign-in" },
        ],
      },
    ],
  },
  {
    id: 6,
    hasDropdown: true,
    children: true,
    megaMenu: true,
    active: true,
    title: "Blog",
    pluseIncon: true,
    lastDropdown: true,
    link: "#",
    submenus: [
      {
        title: "Blog List",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "No Sidebar", link: "/blog-list" },
          { title: "Right Sidebar", link: "/blog-list-right" },
          { title: "Left Sidebar", link: "/blog-list-left" },
        ],
      },
      {
        title: "Blog Grid",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "Blog Grid", link: "/blog-grid" },
          { title: "Blog Grid Right", link: "/blog-grid-right" },
          { title: "Blog Grid Left", link: "/blog-grid-left" },
        ],
      },
      {
        title: "Blog Details",
        link: "#",
        pluseIncon: true,
        megaMenu: [
          { title: "No Sidebar", link: "/blog-details" },
          { title: "Right Sidebar", link: "/blog-details-right" },
          { title: "Left Sidebar", link: "/blog-details-left" },
        ],
      },
    ],
  },
  {
    id: 7,
    hasDropdown: false,
    active: true,
    title: "Contact",
    link: "/contact",
  },
];

export default menu_data;
