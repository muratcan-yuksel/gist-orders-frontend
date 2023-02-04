import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const AdminPage = () => {
  const userId = getCookie("userId");
  const [accessToken, setAccessToken] = useState(getCookie("accessToken"));
  const [refreshToken, setRefreshToken] = useState(getCookie("refreshToken"));
  const [myUser, setMyUser] = useState(null);
  const router = useRouter();
  const [clients, setClients] = useState();

  const generateTokens = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/refresh",
        {
          token: refreshToken,
        },
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(response.data);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      setCookie("accessToken", response.data.accessToken);
      setCookie("refreshToken", response.data.refreshToken);
    } catch (error) {
      console.log(error);
    }
  };
  //call the function in every 4 mins
  setInterval(generateTokens, 240000);

  const getUser = async () => {
    try {
      const returnedUser = await axios.get(
        `http://localhost:3000/users/${userId}`,
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      setMyUser(returnedUser.data);
      console.log(returnedUser.data);
      // getOrdersByUser();
    } catch (error) {
      console.log(error);
    }
  };

  function returnState() {
    if (myUser) {
      return <h1>{myUser.data.name}</h1>;
    } else {
      return <h1>Loading...</h1>;
    }
  }

  //get all clients from db
  const getClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: {
          authorization: `Bearer ${getCookie("accessToken")}`,
        },
      });
      console.log(response.data);
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  function returnClients() {
    if (clients) {
      return clients.data.map((client) => {
        //don't return the admin
        if (client.isAdmin == false) {
          return (
            <Tab key={client._id} eventKey={client._id} title={client.name}>
              <h1>{client.name}</h1>
            </Tab>
          );
        }
      });
      console.log(clients);
    } else {
      return <h1>Loading...</h1>;
    }
  }

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    // setUser({ accessToken, refreshToken });
    getUser();
    getClients();
    // Check if the user is an admin
    const decodedToken = jwt_decode(accessToken);
    if (!decodedToken.isAdmin) {
      // Redirect to a 404 error page if the user is not an admin
      router.push("/error");
    }
  }, []);

  return (
    <div>
      <h1>Admin Paneli</h1>
      {/* Rest of your admin page code */}
      {returnState()}
      <Tabs
        defaultActiveKey="siparişler"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="siparişler" title="Siparişler">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores
          eveniet nam labore accusantium minima quibusdam maxime laboriosam, est
          officia dolorum facilis doloremque quisquam, magnam sint cumque
          tempora error expedita inventore!
        </Tab>
        {/* {clients &&
          clients.map((client) => {
            return (
              <Tab eventKey={client._id} title={client.name}>
                <h1>{client.name}</h1>
              </Tab>
            );
          })} */}
        {returnClients()}
        <Tab eventKey="profile" title="Profile">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores
          eveniet nam labore accusantium minima quibusdam maxime laboriosam, est
          officia dolorum facilis doloremque quisquam, magnam sint cumque
          tempora error expedita inventore!
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminPage;
