import * as React from "react";
import Layout from "../components/layout";

const InfoPage = () => {
  return (
    <div>
      <Layout pageTitle="Info" pageHeading="Additional Information">
        <h2>Select process by id</h2>
        <p>
          Endpoint 3: provides detailed information about each process selected
          by process id.
        </p>
      </Layout>
      <div className="info_diagram">
        this is where the Information Diagram will go.
      </div>
    </div>
  );
};

export default InfoPage;
