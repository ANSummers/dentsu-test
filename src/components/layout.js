import * as React from "react";
import { Link } from "gatsby";
import {
  container,
  heading,
  navLinks,
  navLinkItem,
  navLinkText,
  siteTitle,
} from "./layout.module.css";

const Layout = ({ pageTitle, pageHeading, children }) => {
  // console.log(data);
  return (
    <div className={container}>
      <title>{pageTitle} |</title>
      <p className={siteTitle}>Solution by Abbie Summers</p>
      <nav>
        <ul className={navLinks}>
          <li className={navLinkItem}>
            <Link to="/" className={navLinkText}>
              Home
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/about" className={navLinkText}>
              About
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/compareflows" className={navLinkText}>
              Compare
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/info" className={navLinkText}>
              Information
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <h1 className={heading}>{pageHeading}</h1>
        {children}
      </main>
    </div>
  );
};

export default Layout;
