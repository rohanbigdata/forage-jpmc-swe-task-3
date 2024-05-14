import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

componentDidMount() {
  // Get element from the DOM.
  const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

  const schema = {
    stock: 'string',
    top_ask_price: 'float',
    top_bid_price: 'float',
    timestamp: 'date',
  };

  if (window.perspective && window.perspective.worker()) {
    this.table = window.perspective.worker().table(schema);
  }

if (this.table) {
  // Load the `table` in the `<perspective-viewer>` DOM reference.
  elem.load(this.table);
  elem.setAttribute('view', 'y_line');
  elem.setAttribute('column-pivots', '["timestamp"]');
  elem.setAttribute('row-pivots', '["ratio"]');
  elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "trigger_alert"]');
  elem.setAttribute('aggregates', JSON.stringify({
    ratio: 'avg',
    upper_bound: 'max',
    lower_bound: 'min',
    trigger_alert: 'distinct count',
  }));
}


  // Calculate initial ratios, bounds, and update the table.
  if (this.props.data && this.props.data.length > 0) {
    const rows = DataManipulator.generateRow(this.props.data);
    const ratios = this.calculateRatios(rows);
    this.table.update(ratios);
  }
}


componentDidUpdate() {
  if (this.table) {
    const rows = DataManipulator.generateRow(this.props.data);
    const ratios = this.calculateRatios(rows);
    const updatedData = this.processDataForUpdate(ratios);
    this.table.update(updatedData);
  }
}

  calculateRatios(rows: any[]) {
    // Implement logic to calculate ratios between two stock prices
    // Based on the received data
    // Return the rows with ratio data added
  }

  renderBounds() {
    // Implement logic to render upper and lower bounds on the graph
  }

  renderAlerts() {
    // Implement logic to render alerts when bounds are crossed
  }
}

export default Graph;
