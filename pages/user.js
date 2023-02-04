import React, { useEffect, useContext, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
// import { DataContext } from "../context/context";
import { createClient } from "next-sanity";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { getCookie } from "cookies-next";
import Stack from "react-bootstrap/Stack";

const user = ({ products }) => {
  // const [context, setContext] = useContext(DataContext);
  const userId = getCookie("userId");
  const [myUser, setMyUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  //modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //modal stuff ends
  //form stuff starts
  const [product, setProduct] = useState();
  const [color, setColor] = useState("Vidala Brown");
  const [size, setSize] = useState();
  const [personalization, setPersonalization] = useState();
  const [note, setNote] = useState();
  const fileInputRef = useRef(null);
  //form stuff ends
  const [orders, setOrders] = useState();

  const router = useRouter();

  // dunno if this works
  const checkAuth = () => {
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      router.push("/error");
    }
  };
  console.log(userId);
  console.log(products);

  useEffect(() => {
    getUser();
    checkAuth();
    getOrdersByUser();
  }, []);

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
      getOrdersByUser();
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductChoice = (event) => {
    console.log(event.target.value);
    console.log(JSON.parse(event.target.value));
    setProduct(JSON.parse(event.target.value));
  };

  const handleColor = (event) => {
    console.log(event.target.value);
    setColor(event.target.value);
  };

  const handleSize = (event) => {
    console.log(event.target.value);
    setSize(event.target.value);
  };

  const handlePersonalization = (event) => {
    console.log(event.target.value);
    setPersonalization(event.target.value);
  };

  const handleNote = (event) => {
    console.log(event.target.value);
    setNote(event.target.value);
  };

  //controls the first button that opens the modal
  const handleFormCheck = () => {
    if (!product || !color || !size || !fileInputRef.current.files[0]) {
      alert("Lütfen gerekli tüm alanları doldurunuz.");
    } else {
      handleShow();
    }
  };
  //controls the modal modal
  const handleSubmit = async (event) => {
    // event.preventDefault();

    const formData = new FormData();
    formData.append("user", userId);
    formData.append("stockCode", product.code);
    formData.append("name", product.name);
    formData.append("color", color);
    formData.append("size", size);
    formData.append("personalization", personalization);
    formData.append("note", note);
    formData.append("file", fileInputRef.current.files[0]);
    try {
      const res = await axios.post(
        "http://localhost:3000/orders/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(res.status);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersByUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/orders/user/${userId}`,
        {
          headers: {
            authorization: `Bearer ${getCookie("accessToken")}`,
          },
        }
      );
      console.log(res.data);
      console.log(userId);
      console.log(orders);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="d-flex flex-column flex-lg-row justify-content-center justify-content-md-around align-items-start">
      <div>
        {" "}
        {returnState()}
        {/* <Image></Image> */}
        <div className="">
          <Form.Label>İsme veya koduna göre ürün arayın</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ürün arayın"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Form.Label>
            Ürün seçin- Tek bir ürün görünse bile, uygulamanın sorunsuz
            çalışması için lütfen ürünü tıklayarak seçin.
          </Form.Label>
          <Form.Select
            aria-label="Default select example"
            onClick={handleProductChoice}
          >
            {filteredProducts.map((product) => (
              <option
                key={product._id}
                value={JSON.stringify({
                  name: product.name,
                  id: product._id,
                  code: product.code,
                  price: product.price,
                })}
              >
                {product.name} - {product.code} - {product.price} USD
              </option>
            ))}
          </Form.Select>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Barkod</Form.Label>
            <Form.Control type="file" ref={fileInputRef} />
          </Form.Group>
          <Form.Label>Renk Seçimi</Form.Label>
          <Form.Select aria-label="Renk" onChange={handleColor}>
            <option>Crazy Brown</option>
            <option>Crazy Dark Brown</option>
            <option>Crazy Gray</option>
            <option>Crazy Blue</option>
            <option>Natural Black</option>
            <option>Natural Brown</option>
            <option>Natural Dark Brown</option>
          </Form.Select>
          <Form.Label>Boyut</Form.Label>
          <Form.Control
            type="text"
            placeholder="Boyut"
            onChange={handleSize}
          />{" "}
          <Form.Label>Kişiselleştirme</Form.Label>
          <Form.Control
            type="text"
            placeholder="Kişiselleştirme"
            onChange={handlePersonalization}
          />
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Eklemek istediğiniz not</Form.Label>
            <Form.Control as="textarea" rows={3} onChange={handleNote} />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              onClick={() => {
                // handleShow();
                handleFormCheck();
              }}
            >
              Sipariş ver
            </Button>{" "}
          </div>
          {/* modal */}
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Sipariş onay</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-column ">
                {" "}
                <h5>Sipariş detayı</h5>
                <div className="d-flex ">
                  <div>Ürün adı: </div>
                  {product && <div>{product.name}</div>}{" "}
                </div>
                <div className="d-flex ">
                  <div>Ürün kodu: </div>
                  {product && <div>{product.id}</div>}{" "}
                </div>
                <div className="d-flex ">
                  <div>Renk: </div>
                  {color && <div>{color}</div>}
                </div>
                <div className="d-flex ">
                  <div>Boyut: </div>
                  {size && <div>{size}</div>}
                </div>
                <div className="d-flex ">
                  <div>Kişiselleştirme: </div>
                  {personalization && <div>{personalization}</div>}
                </div>
                <div className="d-flex ">
                  <div>Not: </div>
                  {note && <div>{note}</div>}
                </div>
                <div className="d-flex ">
                  <div>Fiyat: </div>
                  {product && <div>{product.price} USD</div>}{" "}
                </div>
              </div>{" "}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Vazgeç
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  handleClose();
                  handleSubmit();
                }}
              >
                Onayla
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <div>
        <h2>Siparişler</h2>
        {orders &&
          orders.data.map((order) => (
            <div key={order._id}>
              <div
                style={{
                  border: "2px solid black",
                  marginBottom: "1rem",
                  padding: "1rem",
                }}
              >
                <Stack direction="horizontal" gap={3}>
                  <div>Ürün adı: </div>
                  <div>{order.name}</div>
                </Stack>
                <Stack direction="horizontal" gap={3}>
                  <div>Ürün kodu: </div>
                  <div>{order.stockCode}</div>
                </Stack>
                <Stack direction="horizontal" gap={3}>
                  <div>Renk: </div>
                  <div>{order.color}</div>
                </Stack>
                <Stack direction="horizontal" gap={3}>
                  <div>Boyut: </div>
                  <div>{order.size}</div>
                </Stack>
                <Stack direction="horizontal" gap={3}>
                  <div>Kişiselleştirme: </div>

                  <div>{order.personalization}</div>
                </Stack>{" "}
                <Stack direction="horizontal" gap={3}>
                  <div>Not: </div>
                  <div>{order.note}</div>
                </Stack>{" "}
                <Stack direction="horizontal" gap={3}>
                  <div>Sipariş tarihi: </div>
                  <div>{order.createdAt}</div>
                </Stack>{" "}
                <Stack direction="horizontal" gap={3}>
                  <div>Sipariş durumu: </div>
                  <div>{order.status}</div>
                </Stack>{" "}
                <Stack direction="horizontal" gap={3}>
                  <div>Sipariş numarası: </div>
                  <div>{order._id}</div>
                </Stack>{" "}
                <Stack direction="horizontal" gap={3}>
                  <div>Sipariş barkodu: </div>
                  <Button
                    variant="info"
                    onClick={() => downloadFile(order._id)}
                  >
                    İndir
                  </Button>
                </Stack>{" "}
                <Stack direction="horizontal" gap={3}>
                  <div>Sipariş durumu: </div>
                  <div>{order.status}</div>
                </Stack>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default user;

const client = createClient({
  projectId: "6bc5k468",
  dataset: "production",
  apiVersion: "2023-02-01",
  useCdn: false,
});

export async function getStaticProps() {
  const products = await client.fetch(`*[_type == "product"]`);
  // const orders = await axios.get(
  //   "http://localhost:3000/orders/user/63d6edb95136e80b144a07f0"
  // );

  return {
    props: {
      products,
      // orders: orders.data,
    },
  };
}
