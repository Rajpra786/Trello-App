import React, { useState, useEffect } from "react";
import { Form, Button, Navbar, Nav } from "react-bootstrap";
import AuthService from "../../services/auth.services";
import { useHistory } from "react-router-dom";

import "./Login.css";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const history = useHistory();


  useEffect(() => {
    const navigate = async () => {
      const authorized = await AuthService.isLoggedIn();
      if (authorized) {
        history.push("/dashboard");
      }
    };
    navigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateForm() {
    var mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
    return email.match(mailformat) && email.length > 5 && password.length > 5;
  }

  function handleSubmit(event) {
    event.preventDefault();
    AuthService.register(name, email, password).then(
      () => {
        history.push("/login");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      }
    );
  }
  return (
    <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Trello Clone</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/login">LogIn</Nav.Link>
              <Nav.Link href="/signup">SignUp</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="Login App">
          <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                  type="text" 
                  placeholder="Enter Your Name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                  type="email" 
                  placeholder="Enter email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
              Login
            </Button>
          </Form>
      </div>
    </div>
  );
}