import {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const AGENT_URL = (endpoint) => `http://localhost:8001/${endpoint}`;

function App() {
  const [inviteOutbound, setInviteOutbound] = useState({ready: false, name: ''});
  const [inviteInbound, setInviteInbound] = useState({ready: false, url: ''});
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => updateInvites(), 1000);
    return () => clearInterval(timer);
  }, []);

  const setName = value => {
    setInviteOutbound(invite => ({...invite, name: value}));
  }

  const setURL = value => {
    setInviteInbound({ready: false, url: value, errDecoding: false});
  }

  const createInvite = event => {
    event.preventDefault();
    axios.post(AGENT_URL('connections/create-invitation'), {my_label: inviteOutbound.name})
    .then(result => {
      setInviteOutbound({ready: true, name: '', payload: result.data});
    }).catch(_ => console.log('Agent unavailable: createInvite'));
  }

  const receiveInvite = event => {
    event.preventDefault();
    const index = inviteInbound.url.indexOf('c_i=');
    if(index !== -1) {
      try {
        const payload = JSON.parse(atob(inviteInbound.url.slice(index+4)));
        axios.post(AGENT_URL('connections/receive-invitation'), payload).then(result => {
          setInviteInbound({ready: true, url: '', errDecoding: false});
        }).catch(_ => console.log('Agent unavailable: receiveInvite'));        
      } catch {
        setInviteInbound(invite => ({...invite, errDecoding: true}));
        return;
      }
    } else {
      setInviteInbound(invite => ({...invite, errDecoding: true}));
    }
  }

  const acceptInvite = event => {
    const invite = connections.filter(invite => invite.invitation_key === event.target.id)[0];
    axios.post(AGENT_URL(`connections/${invite.connection_id}/accept-request`)).then(result => {
      updateInvites();
    }).catch(_ => console.log('Agent unavailable: acceptInvite'));
  }

  const updateInvites = () => {
    axios.get(AGENT_URL('connections'))
    .then(result => {
      setConnections(result.data.results);
    }).catch(_ => console.log('Agent unavailable: updateInvites'));
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1 className="mb-4">Welcome to ACA-Py controller</h1>
        <h4>Create, receive or accept pending invitation</h4>
      </div>
      <Container className="App-container">
        <Row>
          <Col>
            <p>Create an invitation</p>
            <Form onSubmit={createInvite}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Control 
                        type="text" 
                        required
                        placeholder="Who are you sending the invitation to?"
                        value={inviteOutbound.name}
                        onChange={e => setName(e.target.value)}
                    />
                </Form.Group>
                <Button variant="outline-dark" type="submit">Create</Button>
            </Form>
            {inviteOutbound.ready ? 
            <Form className="mt-4">
                <Form.Label>{`Invitation created for ${inviteOutbound.payload.invitation.label}`}</Form.Label>
                <Form.Group controlId="invite">
                    <Form.Control 
                        as="textarea" 
                        rows={10} 
                        readOnly
                        value={inviteOutbound.payload.invitation_url}
                    />
                </Form.Group>
            </Form> : ''}
          </Col>
          <Col>
            <p>Receive the invitation</p>
            <Form onSubmit={receiveInvite}>
                  <Form.Group className="mb-3" controlId="url">
                      <Form.Control 
                          type="text" 
                          required
                          placeholder="Paste received invitation URL here"
                          value={inviteInbound.url}
                          onChange={e => setURL(e.target.value)}
                      />
                  </Form.Group>
                  <Button variant="outline-dark" type="submit">Receive</Button>
            </Form>
            {inviteInbound.ready ? 
            <p className="mt-4">Invitation accepted</p> : 
            inviteInbound.errDecoding ? 
            <p className="mt-4">URL error</p> : ''}
          </Col>
          <Col>
            <p>Pending invitations</p>
            <div>
              {connections.filter(invite => invite.rfc23_state === 'request-received').map(invite => {
                return (
                  <ListGroup key={invite.invitation_key}>
                    <ListGroup.Item>
                      <Container>
                        <Row className="align-items-center">
                          <Col>{`Invitation from ${invite.their_label}`}</Col>
                          <Col>
                            <Button variant="outline-dark" size="sm"
                                    id={invite.invitation_key} onClick={acceptInvite}>Accept</Button>
                          </Col>
                        </Row>
                      </Container>                
                    </ListGroup.Item>
                  </ListGroup>
                )
              })}
            </div>
          </Col>
          <Col>
            <p>Connections list</p>
            <div>
              {connections.filter(invite => invite.rfc23_state === 'completed').map(invite => {
                return (
                  <ListGroup key={invite.invitation_key}>
                    <ListGroup.Item>
                      <Container>
                        <Row className="align-items-center"><Col>{invite.their_label}</Col></Row>
                      </Container>                
                    </ListGroup.Item>
                  </ListGroup>
                )
              })}
            </div>
          </Col>          
        </Row>
      </Container>
    </div>
  );
}

export default App;
