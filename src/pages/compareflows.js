import * as React from "react";
import Layout from "../components/layout";

const ComparePage = () => {
  return (
    <div>
      <Layout pageTitle="Compare" pageHeading="Compare">
        <h2>Select and Compare Flow by id</h2>
        <p>
          "Endpoint 2: provides information regarding process relationships
          within flow selected by id."
        </p>
      </Layout>
      <div className="compare_diagram">
        this is where the Compare Diagram will go.
      </div>
    </div>
  );
};

export default ComparePage;
