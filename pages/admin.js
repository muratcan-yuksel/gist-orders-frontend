import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import Button from "react-bootstrap/Button";

const AdminPage = () => {
  const userId = getCookie("userId");
  const [accessToken, setAccessToken] = useState(getCookie("accessToken"));
  const [refreshToken, setRefreshToken] = useState(getCookie("refreshToken"));
  const [myUser, setMyUser] = useState(null);
  const router = useRouter();
  const [clients, setClients] = useState();
  const [orders, setOrders] = useState();
  const [clientId, setClientId] = useState();
  const [payment, setPayment] = useState();

  // const generateTokens = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3000/auth/refresh",
  //       {
  //         token: refreshToken,
  //       },
  //       {
  //         headers: {
  //           authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     setAccessToken(response.data.accessToken);
  //     setRefreshToken(response.data.refreshToken);
  //     setCookie("accessToken", response.data.accessToken);
  //     setCookie("refreshToken", response.data.refreshToken);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // //call the function in every 4 mins
  // setInterval(generateTokens, 24000000000);

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

  const clientOrders = async (id) => {
    try {
      const orders = await axios.get(
        `http://localhost:3000/orders/user/${id}`,
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(orders.data);
      setOrders(orders.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClientId = (id) => {
    console.log(id);
    setClientId(id);
  };

  function returnClients() {
    if (clients) {
      return clients.data.map((client) => {
        //don't return the admin
        if (client.isAdmin == false) {
          return (
            <button
              onClick={() => {
                clientOrders(client._id);
                getClientId(client._id);
              }}
              style={{ margin: "10px", border: "2px solid black" }}
              key={client._id}
            >
              <h1>{client.name}</h1>
              <h2>Borç: {client.toPay}</h2>
            </button>
          );
        }
      });
      console.log(clients);
    } else {
      return <h1>Loading...</h1>;
    }
  }

  //to download the file
  const downloadFile = async (file) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/orders/download/${file}`,
        {
          responseType: "blob",
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );

      const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "file.pdf";
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const getPaymentAmount = (e) => {
    setPayment(e.target.value);
    console.log(payment);
  };

  const handlePayment = async () => {
    console.log(payment);
    console.log(clientId);
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${clientId}`,
        {
          toPay: "-" + payment.toString(),
        },
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(response.data);
      response.status == 200
        ? alert("Ödeme başarılı")
        : alert("Ödeme başarısız");
    } catch (error) {
      console.log(error);
    }
  };

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

      <div className="d-flex flex-wrap"> {returnClients()}</div>
      <div style={{ margin: "1rem" }}>
        <label style={{ marginRight: "10px" }} htmlFor="">
          Ödenen Tutar
        </label>
        <input
          onChange={getPaymentAmount}
          style={{ marginRight: "10px" }}
          type="number"
        />
        <button onClick={handlePayment}>Onayla</button>
      </div>
      {orders &&
        orders.data.map((order) => {
          return (
            <div
              style={{
                border: "1px solid black",
                marginBottom: "10px",
                padding: "1rem",
              }}
              key={order._id}
            >
              <div>Ürün adı: {order.name}</div>
              <div>Ürün kodu: {order.stockCode}</div>
              <div>Sipariş tarihi: {order.createdAt}</div>
              <div>Ürün fiyatı: {order.price}</div>
              <div>Renk: {order.color} </div>
              <div>Boyut: {order.size} </div>
              <div>Adet: {order.quantity} </div>
              <div>Kişiselleştirme: {order.personalization} </div>
              <div>Not: {order.note} </div>
              <div className="d-flex">
                <div style={{ marginRight: "1rem" }}>Sipariş barkodu: </div>
                <Button variant="info" onClick={() => downloadFile(order._id)}>
                  İndir
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default AdminPage;
