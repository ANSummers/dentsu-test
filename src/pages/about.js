import * as React from "react";
import Layout from "../components/layout";

const AboutPage = () => {
  return (
    <Layout pageTitle="About" pageHeading="About Flows">
      <h2>Current Flows available</h2>
      <p>
        Endpoint 1: https://orchestrationflowappservice.azurewebsites.net/flow -
        provides information about the available flows.
      </p>
    </Layout>
  );
};

export default AboutPage;
