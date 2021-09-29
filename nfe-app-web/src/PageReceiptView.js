import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import './App.css';

class PageReceiptView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ASTRA_DB_ID: 'f46b8f85-f5bb-431d-aa06-350061e7585c',
      ASTRA_DB_REGION: 'us-east1',
      ASTRA_DB_KEYSPACE: 'snoop',
      ASTRA_DB_APPLICATION_TOKEN: 'AstraCS:ecjHQArPwZrmkNIdrnUYRyCO:09c3b2a0e2e80ada6cd0825afe9484868b540845fbc4d2a9c787c298c6d023b8',
      ASTRA_DB_COLLECTION: 'receipt',
      receipt: {}
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log('componentDidMount');
    console.log('componentDidMount');
    const { documentId } = this.props.match.params;
    if (documentId) {
      console.log('documentId')
      console.log(documentId)
      console.log(documentId)
      console.log(documentId)
      const urlAstra = `https://${this.state.ASTRA_DB_ID}-${this.state.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${this.state.ASTRA_DB_KEYSPACE}/collections/${this.state.ASTRA_DB_COLLECTION}/${documentId}`;
      console.log(urlAstra)
      fetch(urlAstra, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-cassandra-token': this.state.ASTRA_DB_APPLICATION_TOKEN
        },
      }).then((res) => res.json())
        .then((result) => {
          console.log(result);
          this.setState({ receipt: result });
        });
    }
  }

  render() {
    const { documentId } = this.props.match.params;
    const { receipt } = this.state;

    return (
      <div>
        {documentId}
        <hr />
        <ReactJson src={receipt} />
      </div>
    );
  }
}

export default PageReceiptView;
