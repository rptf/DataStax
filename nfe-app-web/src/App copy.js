

import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import './App.css';
import environment from './environment';
import logo from './logo.png';
import ReactJson from 'react-json-view'

class App extends Component {

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

    this.handleScan = this.handleScan.bind(this)
  }

  componentDidMount() {

  }

  handleBtnTest = () => {
    const test = 'http://dec.fazenda.df.gov.br/ConsultarNFCe.aspx?p=53210717397297000173650020000629271191404548|2|1|1|1AC753BC76981BAC1BF69D1490D5E22CC92CDCC5';
    console.log(test)
    this.handleScan(test);
  }

  handleBtnTestBad = () => {
    const test = 'http://dec.fazenda.df.gov.br/ConsultarNFCe.aspx?p=5321071739729700017d3650020000629271191404548|2|1|1|1AC753BC76981BAC1BF69D1490D5E22CC92CDCC5';
    console.log(test)
    this.handleScan(test);
  }

  handleScan = (urlFromQRCode) => {
    if (urlFromQRCode) {
      this.setState({ result: 'Carregando...', error: '', accessKey: '', companyName: '', document: '', url: urlFromQRCode });

      const p = urlFromQRCode.substring(urlFromQRCode.indexOf('?p=') + 3, urlFromQRCode.length);
      const url = `${environment.apiUrl}/nfe/df/${p}`;

      console.log(url);
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
            }).then((receipt) => this.setState({ receipt }));
          } else {
            this.setState({ result: 'Erro na leitura sucesso', error: result['message'] }, () => {
              setTimeout(() => {
                this.setState({ url: '', result: '', error: '', accessKey: '', companyName: '', document: '' })
              }, 5000)
            });
          }
        }, (error) => {
          this.setState({ result: 'Erro na leitura sucesso', error }, () => {
            setTimeout(() => {
              this.setState({ url: '', result: '', error: '', accessKey: '', companyName: '', document: '' })
            }, 5000)
          });
        });
    }
  }

  handleError(err) {
    console.error(err)
  }

  render() {
    const { url, accessKey, companyName, document, result, error } = this.state;

    const previewStyle = {
      height: 240,
      width: 320,
    }

    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {!environment.production && (<button onClick={this.handleBtnTest}>TESTE</button>)}
          {!environment.production && (<button onClick={this.handleBtnTestBad}>TESTE BAD</button>)}
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
          <p>
            <QrReader
              delay={this.state.delay}
              style={previewStyle}
              onError={this.handleError}
              onScan={this.handleScan}
            />
          </p>
          <hr />
        </header>
        <ReactJson src={this.state.receipt} />

      </div >
    )
  }
}

function App2() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
