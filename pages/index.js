import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    console.log("username: ", username);
    console.log("password: ", password);
  };

  return (
    <div
      style={{ height: "100%" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <h1>Gist Leather Craft</h1> <h2> Sipariş Sistemi</h2>
      <Form className="d-flex flex-column justify-content-center align-items-center">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Kullanıcı Adı</Form.Label>
          <Form.Control
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Kullanıcı adını girin"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Şifre"
          />
        </Form.Group>

        <Button onClick={handleClick} variant="primary" type="submit">
          Onayla
        </Button>
      </Form>
    </div>
  );
}

export default index;
