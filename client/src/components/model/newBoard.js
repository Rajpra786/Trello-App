import React from 'react';
import {Form,Col,Modal,Button} from 'react-bootstrap';

const NewBoard = (props) => (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Enter New Board Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Group as={Col} controlId="formGridText">
            <Form.Label>Board Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Board Name" value={props.boardName} onChange={e => props.onChangeName(e.target.value)}/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridText">
            <Form.Label>Enter Description</Form.Label>
            <Form.Control type="text" placeholder="Enter Board Details" value={props.description} onChange={e => props.onChangeDes(e.target.value)} />
            </Form.Group>

        </Form>

      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" type="submit" onClick={()=>props.onSubmit()}> Create </Button>
      <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
);


export default NewBoard;