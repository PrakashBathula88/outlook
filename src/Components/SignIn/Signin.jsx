import React, { useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import GoogleButton from "react-google-button";
import "../SignIn/Signin.css";
import { UserAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [isLogin, setisLogin] = useState(false);
  const { googleSignin, loginHandler } = UserAuth();
  const email = useRef();
  const password = useRef();
  const confirm = useRef();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await googleSignin();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const hansleSwitchMode = () => {
    setisLogin((prevstate) => !prevstate);
  };

  const submiting = async (event) => {
    event.preventDefault();
    const emailref = email.current.value;
    const passref = password.current.value;
    const confirmref = confirm.current ? confirm.current.value : null;

    if (!isLogin && passref !== confirmref) {
      console.error("PASSWORDS DO NOT MATCH");
      return;
    }
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyATouFSg6GqvW6-U90CJ0krHlNjKhv7U1I";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyATouFSg6GqvW6-U90CJ0krHlNjKhv7U1I";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: emailref,
          password: passref,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errordata = await response.json();
        throw new Error(errordata.error.message || "Authentication Failed");
      }
      const data = await response.json();
      loginHandler(data.idtoken);
      navigate("/");
      alert("Success");
      setisLogin(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Container className="mt-custom">
      <Row>
        <Col>
          <Card className="shadow-lg">
            <Card.Header style={{ backgroundColor: "#00572d" }}>
              <h3 className="mt-3">{isLogin ? "Sign Up" : "Login"}</h3>
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f7f5f0" }}>
              <Form onSubmit={submiting}>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    ref={email}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Enter Your Password"
                    ref={password}
                  />
                </Form.Group>
                {isLogin && (
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      ref={confirm}
                    />
                  </Form.Group>
                )}
                <Form.Group className="mb-3 text-center">
                  <Button type="submit" style={{ backgroundColor: "#00572d" }}>
                    {isLogin ? "Sign Up" : "Login"}
                  </Button>
                </Form.Group>
                <Form.Group className="mb-3-text-center">
                  <GoogleButton onClick={handleGoogleLogin} />
                </Form.Group>
                <Form.Group className="mb-3 text-center">
                  <h5>Forgot Password</h5>
                </Form.Group>
                <Form.Group className="text-center">
                  <h4 onClick={hansleSwitchMode}>
                    {isLogin
                      ? "Have an Account? Login"
                      : "Don't Have an Account? Register"}
                  </h4>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
