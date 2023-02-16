import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Alert } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { DataContext } from "../context/context";
import { setCookie } from "cookies-next";

function index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [context, setContext] = useContext(DataContext);

  const refreshToken = async () => {
    try {
      console.log("refresh called");
      const res = await axios.post(
        "https://gist-orders-express-backend.vercel.app/auth/refresh",
        {
          token: user.refreshToken,
        }
      );
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  // refreshToken();
  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
        console.log("refreshed");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("username: ", username);
    console.log("password: ", password);
    try {
      const response = await axios.post(
        "https://gist-orders-express-backend.vercel.app/users/login",
        {
          name: username,
          password: password,
        }
      );
      const { accessToken, refreshToken, userId, isAdmin } = response.data;
      setUser(response.data);
      console.log(response.data);
      console.log("Access Token: ", accessToken);
      console.log("Refresh Token: ", refreshToken);
      console.log(userId);
      console.log(isAdmin);
      //set user id in the context
      // setContext(userId);
      //set it in local storage
      //local storages don't work on nextjs

      // localStorage.setItem("userId", userId);
      setCookie("userId", userId);
      setCookie("accessToken", accessToken);
      setCookie("refreshToken", refreshToken);
      // // Store the tokens in local storage or state for use in other parts of your application
      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);
      setError(false);
      // Navigate to the /user page after a successful login
      isAdmin ? await router.push("/admin") : await router.push("/user");
    } catch (error) {
      console.log(error);
      setError(true);
    }
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
        {error && (
          <Alert variant="danger">Kullanıcı adı veya şifre hatalı</Alert>
        )}
        <Button onClick={handleClick} variant="primary" type="submit">
          Onayla
        </Button>
      </Form>
    </div>
  );
}

export default index;
