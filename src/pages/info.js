import * as React from "react";
import Layout from "../components/layout";

const InfoPage = () => {
  return (
    <Layout pageTitle="Info" pageHeading="Additional Information">
      <h2>Select process by id</h2>
      <p>
        Endpoint 3: provides detailed information about each process selected by
        process id.
      </p>
    </Layout>
  );
};

export default InfoPage;
