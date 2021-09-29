import React, { Component } from 'react';
import './App.css';

class PageList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      delay: 500,
      url: '',
      result: '',
      error: '',
      accessKey: '',
      companyName: '',
      document: '',
      ASTRA_DB_ID: 'f46b8f85-f5bb-431d-aa06-350061e7585c',
      ASTRA_DB_REGION: 'us-east1',
      ASTRA_DB_KEYSPACE: 'snoop',
      ASTRA_DB_APPLICATION_TOKEN: 'AstraCS:ecjHQArPwZrmkNIdrnUYRyCO:09c3b2a0e2e80ada6cd0825afe9484868b540845fbc4d2a9c787c298c6d023b8',
      ASTRA_DB_COLLECTION: 'receipt',
      list: []
    };

  }

  componentDidMount() {

    let urlAstra = `https://${this.state.ASTRA_DB_ID}-${this.state.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${this.state.ASTRA_DB_KEYSPACE}/collections/${this.state.ASTRA_DB_COLLECTION}`;
    console.log(urlAstra);
    urlAstra += '?page-size=10&fields=["documentId", "receipt", "transaction"]';
    console.log(urlAstra);
    fetch(urlAstra, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cassandra-token': this.state.ASTRA_DB_APPLICATION_TOKEN
      },
    }).then((response) => {

      return response.json();
    }).then((result) => {
      console.log('result');
      console.log(result);
      if (result && result['data']) {
        const data = result['data']
        const ids = Reflect.ownKeys(data);

        console.log(ids);

        const list = [];
        ids.forEach((strId) => {
          list.push({ documentId: strId, data: data[strId] });
        })
        console.log(list);

        this.setState({ list });

      }

    });

  }

  goToView = (documentId) => {
    this.props.history.push(`/view/${documentId}`);
  }

  render() {
    const { list } = this.state;
    return (
      <div>

        <ul>
          {list && (
            list.map((obj, index) => {
              
              if (obj && obj.data && obj.data.receipt) {
                return (
                  <li key={index}>
                    <a href="javascript:void(0)" onClick={() => this.goToView(obj.documentId)}> {obj.documentId} - { obj.data.receipt.company.name }</a>
                  </li>
                )
              }
            }
            ))
          }

        </ul>

      </div>
    );
  }
}

export default PageList;
