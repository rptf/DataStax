import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import './App.css';
import environment from './environment';

class PageReceipt extends Component {

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
      receipt: {}
    }
  }

  componentDidMount() {
    const { param } = this.props.match.params;
    if (param) {
      const url = `${environment.apiUrl}/nfe/df/${param}`;
      this.setState({ result: 'Carregando...', error: '', accessKey: '', companyName: '', document: '', url  });
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ urlFromQRCode }),
      }).then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result && result['receipt'] && result['transaction']) {
            this.setState({ receipt: result });

            const data = result['receipt'];
            const accessKey = data['accessKey']
            const companyName = data['company']['name'];
            const document = data['company']['document'];
            console.log(accessKey);
            console.log(companyName);
            this.setState({ result: 'Leitura efetuado com sucesso', accessKey, companyName, document }, () => {
              setTimeout(() => {
                this.setState({ url: '', result: '', error: '' });
              }, 5000)
            });

            // https://f46b8f85-f5bb-431d-aa06-350061e7585c-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/snoop/collections/receipt

            const urlAstra = `https://${this.state.ASTRA_DB_ID}-${this.state.ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${this.state.ASTRA_DB_KEYSPACE}/collections/${this.state.ASTRA_DB_COLLECTION}`;
            console.log(urlAstra);
            console.log(urlAstra);
            console.log(urlAstra);
            fetch(urlAstra, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-cassandra-token': this.state.ASTRA_DB_APPLICATION_TOKEN
              },
              body: JSON.stringify(result),
            });
          } else {
            this.setState({ result: 'Erro na leitura sucesso', error: result['message'] }, () => {
              setTimeout(() => {
                this.setState({ url: '', result: '', error: '', accessKey: '', companyName: '', document: '' })
              }, 5000)
            });
          }
        }, (error) => {
          console.log(error);
          this.setState({ result: 'Erro na leitura sucesso', error }, () => {
            setTimeout(() => {
              this.setState({ url: '', result: '', error: '', accessKey: '', companyName: '', document: '' })
            }, 5000)
          });
        });
    }
  }

  render() {
    const { url, accessKey, companyName, document, result, error } = this.state;

    return (
      <div>
        {
          url && (
            <p>
              <small>
                {url}
              </small>
            </p>
          )
        }
        {
          (result || error) && (
            <p>
              <small>
                {result} <br />
                {error}
              </small>
            </p>
          )
        }
        {
          (accessKey || companyName) && (
            <p>
              <small>
                {companyName} - {document} <br />
                {accessKey}
              </small>
            </p>
          )
        }
        <hr />
        <ReactJson src={this.state.receipt} />
      </div>
    );
  }
}

export default PageReceipt;
