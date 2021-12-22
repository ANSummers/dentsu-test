import * as React from "react";
import * as d3 from "d3";
import Layout from "../components/layout";

function makeGraph(data) {
  const nodes = data.nodes.map(({ id, name, duration }) => ({
    id,
    sourceLinks: [],
    targetLinks: [],
    name,
    duration,
  }));

  const nodeById = new Map(nodes.map((d) => [d.id, d]));

  const links = data.links.map(({ fromProcessId, toProcessId }) => ({
    source: nodeById.get(fromProcessId),
    target: nodeById.get(toProcessId),
  }));

  for (const link of links) {
    const { source, target } = link;
    source.sourceLinks.push(link);
    target.targetLinks.push(link);
  }

  return { nodes, links };
}

class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef(null);

    this.margin = { top: 20, right: 20, bottom: 20, left: 100 };

    this.step = 40;

    this.height = 800;

    this.state = {
      flowId: 2,
      isLoaded: false,
    };
  }

  arc(d) {
    const y1 = d.source.y;
    const y2 = d.target.y;
    const r = Math.abs(y2 - y1) / 2;
    //* If you update margin.left update the 100 as well
    return `M100,${y1}A${r},${r} 0,0,${y1 < y2 ? 1 : 0} 100,${y2}`;
  }

  async componentDidMount() {
    const r = await fetch(
      `https://orchestrationflowappservice.azurewebsites.net/flow/${this.state.flowId}`
    );
    const flow = await r.json();
    const processes = new Set();
    for (const link of flow) {
      processes.add(link["fromProcessId"]);
      processes.add(link["toProcessId"]);
    }
    const processInfo = [];
    for (const process of processes) {
      const r = await fetch(
        `https://orchestrationflowappservice.azurewebsites.net/flow/process/${process}`
      );
      const rjson = await r.json();
      processInfo.push({
        id: rjson.id,
        name: rjson.name,
        duration: rjson.avgDuration,
      });
    }

    this.height =
      (processInfo.length - 1) * this.step +
      this.margin.top +
      this.margin.bottom;
    const graph = makeGraph({ nodes: processInfo, links: flow });

    const y = d3.scalePoint(graph.nodes.map((d) => d.id).sort(d3.ascending), [
      this.margin.top,
      this.height - this.margin.bottom,
    ]);

    const svg = d3.select(this.svgRef.current);

    svg.append("style").text(`
  
    .hover path {
    stroke: #ccc;
    }
  
    .hover text {
    fill: #ccc;
    }
  
    .hover g.primary text {
    fill: black;
    font-weight: bold;
    }
  
    .hover g.secondary text {
    fill: #333;
    }
  
    .hover path.primary {
    stroke: #333;
    stroke-opacity: 1;
    }
  
    `);

    const color = d3.scaleOrdinal(
      graph.nodes.map((d) => d.name).sort(d3.ascending),
      d3.schemeCategory10
    );

    const label = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(graph.nodes)
      .join("g")
      .attr(
        "transform",
        (d) => `translate(${this.margin.left},${(d.y = y(d.id))})`
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -6)
          .attr("dy", "0.35em")
          .attr("fill", (d) => d3.lab(color(d.id)).darker(2))
          .text((d) => d.name)
      )
      .call((g) =>
        g
          .append("circle")
          .attr("r", 3)
          .attr("fill", (d) => color(d.id))
      );

    const path = svg
      .insert("g", "*")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("stroke", (d) =>
        d.source.id === d.target.id ? color(d.source.id) : "#aaa"
      )
      .attr("d", this.arc);

    const overlay = svg
      .append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("width", this.margin.left + 40)
      .attr("height", this.step)
      .attr("y", (d) => y(d.id) - this.step / 2)
      .on("mouseover", (d) => {
        svg.classed("hover", true);
        label.classed("primary", (n) => n === d);
        label.classed(
          "secondary",
          (n) =>
            n.sourceLinks.some((l) => l.target === d) ||
            n.targetLinks.some((l) => l.source === d)
        );
        path
          .classed("primary", (l) => l.source === d || l.target === d)
          .filter(".primary")
          .raise();
      })
      .on("mouseout", (d) => {
        svg.classed("hover", false);
        label.classed("primary", false);
        label.classed("secondary", false);
        path.classed("primary", false).order();
      });

    y.domain(
      graph.nodes
        .sort((a, b) => d3.ascending(a.duration, b.duration))
        .map((d) => d.id)
    );

    const t = svg.transition().duration(750);

    label
      .transition(t)
      .delay((d, i) => i * 20)
      .attrTween("transform", (d) => {
        const i = d3.interpolateNumber(d.y, y(d.id));
        return (t) => `translate(${this.margin.left},${(d.y = i(t))})`;
      });

    path
      .transition(t)
      .duration(750 + graph.nodes.length * 20)
      .attrTween("d", (d) => () => this.arc(d));

    overlay
      .transition(t)
      .delay((d, i) => i * 20)
      .attr("y", (d) => y(d.id) - this.step / 2);

    this.setState({
      isLoaded: true,
    });
  }

  render() {
    const { isLoaded } = this.state;
    return (
      <div>
        <Layout pageTitle="About" pageHeading="About Flows">
          <h2>Current Flows available</h2>
          <p>
            Endpoint 1:
            https://orchestrationflowappservice.azurewebsites.net/flow -
            provides information about the available flows.
          </p>
        </Layout>

        <div className="about_diagram">
          this is where the About Diagram will go.
          <svg ref={this.svgRef} width={800} height={800} />
        </div>
      </div>
    );
  }
}

export default AboutPage;
