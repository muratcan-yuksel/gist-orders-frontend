import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { getCookie, setCookie } from "cookies-next";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Toast from "react-bootstrap/Toast";
import Col from "react-bootstrap/Col";
import { DataContext } from "../context/context";

const AdminPage = () => {
  const [context, setContext] = useContext(DataContext);
  const userId = getCookie("userId");
  const [accessToken, setAccessToken] = useState(getCookie("accessToken"));
  const [refreshToken, setRefreshToken] = useState(getCookie("refreshToken"));
  const [myUser, setMyUser] = useState(null);
  const router = useRouter();
  const [clients, setClients] = useState();
  const [orders, setOrders] = useState();
  const [clientId, setClientId] = useState();
  const [payment, setPayment] = useState();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [orderId, setOrderId] = useState();
  //modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //modal stuff ends
  const [createClientName, setCreateClientName] = useState();
  const [createClientPass, setCreateClientPass] = useState();
  //toast stuff
  const [showB, setShowB] = useState(false);
  const toggleShowB = () => setShowB(!showB);
  const [clientDelete, setClientDelete] = useState(false);
  //toast stuff ends

  // const generateTokens = async () => {
  //   try {
  //     const response = await axios.post(
  //       "https://gist-orders-dockerized.onrender.com/auth/refresh",
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

  const incrementContext = () => {
    setContext(Number(context) + 1);
  };

  const getUser = async () => {
    try {
      const returnedUser = await axios.get(
        `https://gist-orders-dockerized.onrender.com/users/${userId}`,
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
      const response = await axios.get(
        "https://gist-orders-dockerized.onrender.com/users",
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(response.data);
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllOrders = async () => {
    try {
      const orders = await axios.get(
        "https://gist-orders-dockerized.onrender.com/orders",
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

  const clientOrders = async (id) => {
    try {
      const orders = await axios.get(
        `https://gist-orders-dockerized.onrender.com/orders/user/${id}`,
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
              <div>{client.name}</div>
              <div>Bor??: {client.toPay}</div>
            </button>
          );
        }
      });
      console.log(clients);
    } else {
      return <h1>Loading...</h1>;
    }
  }
  //basically the above function, different styling etc.
  const returnClientsToManage = () => {
    if (clients) {
      return clients.data.map((client) => {
        //don't return the admin
        if (client.isAdmin == false) {
          return (
            <div
              style={{ margin: "10px", border: "1px solid black" }}
              className="d-flex flex-wrap"
              key={client.id}
            >
              <h3 style={{ marginRight: "1rem" }}>{client.name}</h3>
              <Button
                onClick={() => {
                  toggleShowB();
                  setClientDelete(client);
                }}
                variant="warning"
              >
                M????teriyi Sil
              </Button>
            </div>
          );
        }
      });
      console.log(clients);
    } else {
      return <h1>Loading...</h1>;
    }
  };

  const deleteClient = async () => {
    let id = clientDelete._id;
    try {
      const res = await axios.delete(
        `https://gist-orders-dockerized.onrender.com/users/${id}`,
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(res.status);
      alert("M????teri Silindi");
      incrementContext();
    } catch (error) {
      console.log(error);
    }
  };

  //to download the file
  const downloadFile = async (file) => {
    try {
      const res = await axios.get(
        `https://gist-orders-dockerized.onrender.com/orders/download/${file}`,
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
        `https://gist-orders-dockerized.onrender.com/users/${clientId}`,
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
      if (response.status == 200) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
        }, 3000);
      } else {
        setPaymentError(true);
        setTimeout(() => {
          setPaymentError(false);
        }, 3000);
      }
      // : setPaymentError(true);
      incrementContext();
    } catch (error) {
      console.log(error);
    }
  };
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const deleteOrder = async () => {
    try {
      const res = await axios.delete(
        `https://gist-orders-dockerized.onrender.com/orders/${orderId}`,
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(res.data);
      console.log(orderId);
      //if succesfull do something
      if (res.status == 200) {
        setDeleteSuccess(true);
        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);
        incrementContext();
      } else {
        setDeleteError(true);
        setTimeout(() => {
          setDeleteError(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createClient = async () => {
    try {
      const res = await axios.post(
        `https://gist-orders-dockerized.onrender.com/users`,
        { name: createClientName, password: createClientPass },
        { headers: { authorization: `Bearer ${getCookie("accessToken")}` } }
      );
      console.log(res.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
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
  }, [context]);

  return (
    <div>
      <h1>Admin Paneli</h1>
      {/* Rest of your admin page code */}
      <div>
        {" "}
        <div> {returnState()} </div>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              {" "}
              <h3>M????teri Paneli</h3>
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-wrap">
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <input
                    style={{ marginBottom: "10px" }}
                    placeholder="m????teri ad??"
                    type="text"
                    onChange={(e) => setCreateClientName(e.target.value)}
                  />
                  <input
                    style={{ marginBottom: "10px" }}
                    placeholder="m????teri ??ifresi"
                    type="text"
                    onChange={(e) => setCreateClientPass(e.target.value)}
                  />
                  <Button variant="primary" onClick={createClient}>
                    Ekle
                  </Button>

                  {/* <Button onClick={toggleShowB} className="mb-2">
                    Toggle Toast <strong>without</strong> Animation
                  </Button> */}
                  <Toast onClose={toggleShowB} show={showB} animation={false}>
                    <Toast.Header>
                      <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                      />
                      <strong className="me-auto">M????teri Silinecek</strong>
                      <small>11 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>
                      <div className="d-flex flex-column align-items-center">
                        <strong>{clientDelete.name} </strong> m????terisini silmek
                        istedi??inize emin misiniz?
                        <Button variant="danger" onClick={deleteClient}>
                          Onayla
                        </Button>
                      </div>
                    </Toast.Body>
                  </Toast>
                  <div></div>
                  <div className="d-flex flex-wrap">
                    {returnClientsToManage()}
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="d-flex flex-wrap">
        <button
          onClick={getAllOrders}
          style={{ margin: "10px", border: "2px solid black" }}
        >
          <h5>T??m sipari??ler</h5>
        </button>{" "}
        {returnClients()}
      </div>
      <div style={{ margin: "1rem" }}>
        <label style={{ marginRight: "10px" }} htmlFor="">
          ??denen Tutar
        </label>
        <input
          onChange={getPaymentAmount}
          style={{ marginRight: "10px" }}
          type="number"
        />
        <button onClick={handlePayment}>Onayla</button>
        {paymentError && (
          <Alert key="danger" variant="danger">
            ??deme ba??ar??s??z oldu. Tekrar deneyin.
          </Alert>
        )}
        {paymentSuccess && (
          <Alert key="success" variant="success">
            M????terinin ??demesi ba??as??yla sisteme eklenmi??tir.
          </Alert>
        )}{" "}
        {deleteError && (
          <Alert key="danger" variant="danger">
            Sipari?? silinemedi. Tekrar deneyin.
          </Alert>
        )}
        {deleteSuccess && (
          <Alert key="success" variant="success">
            Sipari?? ba??ar??yla silindi!
          </Alert>
        )}
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
              onClick={() => setOrderId(order._id)}
              key={order._id}
            >
              <div>??r??n ad??: {order.name}</div>
              <div>M????teri ad??: {order.userName}</div>
              <div>??r??n kodu: {order.stockCode}</div>
              <div>Sipari?? tarihi: {order.createdAt}</div>
              <div>??r??n fiyat??: {order.price}</div>
              <div>Renk: {order.color} </div>
              <div>Boyut: {order.size} </div>
              <div>Adet: {order.quantity} </div>
              <div>Ki??iselle??tirme: {order.personalization} </div>
              <div>Not: {order.note} </div>
              <div className="d-flex">
                <div style={{ marginRight: "1rem" }}>Sipari?? barkodu: </div>
                <Button variant="info" onClick={() => downloadFile(order._id)}>
                  ??ndir
                </Button>
              </div>
              <Button onClick={handleShow} variant="danger">
                Tamamla & Sil
              </Button>

              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>??r??n tamamland?? m???</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  E??er ??r??n tamamland??ysa ve gerekli bilgileri kaydettiyseniz,
                  sipari??i tamamlay??p silmek i??in "Onayla" butonuna bas??n. Bu
                  i??lem geri al??namaz.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Vazge??
                  </Button>
                  <Button
                    onClick={() => {
                      deleteOrder();
                      handleClose();
                    }}
                    variant="warning"
                  >
                    Onayla
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          );
        })}
    </div>
  );
};

export default AdminPage;
