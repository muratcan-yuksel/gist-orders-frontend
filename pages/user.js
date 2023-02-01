import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { DataContext } from "../context/context";
import { createClient } from "next-sanity";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";

const user = ({ products }) => {
  const [context, setContext] = useContext(DataContext);
  const userId = context;
  const [myUser, setMyUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  //modal stuff
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //modal stuff ends
  //form stuff starts
  const [product, setProduct] = useState();
  //form stuff ends

  const router = useRouter();
  //dunno if this works
  const checkAuth = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return router.push("/error");
    }
  };
  console.log(userId);
  console.log(products);

  useEffect(() => {
    getUser();
    checkAuth();
  }, []);

  const getUser = async () => {
    try {
      const returnedUser = await axios.get(
        `http://localhost:3000/users/${userId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMyUser(returnedUser.data);
      console.log(returnedUser.data);
    } catch (error) {
      console.log(error);
    }
  };

  function returnState() {
    if (myUser) {
      return <div>{myUser.data.name}</div>;
    } else {
      return <div>Loading...</div>;
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

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {returnState()}
      <Image></Image>
      <div className="" style={{ width: "40%" }}>
        <Form.Label>İsme veya koduna göre ürün arayın</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ürün arayın"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Form.Label>
          Ürün seçin- Tek bir ürün görünse bile, uygulamanın sorunsuz çalışması
          için lütfen ürünü tıklayarak seçin.
        </Form.Label>
        <Form.Select
          aria-label="Default select example"
          onClick={handleProductChoice}
        >
          {filteredProducts.map((product) => (
            <option
              key={product._id}
              value={JSON.stringify({ name: product.name, id: product._id })}
            >
              Ürün Adı: {product.name} - Ürün Kodu: {product.code}
            </option>
          ))}
        </Form.Select>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Barkod</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <Form.Label>Renk Seçimi</Form.Label>
        <Form.Select aria-label="Renk">
          <option>Vidala Brown</option>
          <option>Vidala Dark Brown</option>
          <option>Crazy Brown</option>
          <option>Crazy Dark Brown</option>
          <option>Black</option>
          <option>Crazy Grey</option>
          <option>Özel</option>
        </Form.Select>
        <Form.Label>Boyut</Form.Label>
        <Form.Control type="text" placeholder="Boyut" />{" "}
        <Form.Label>Kişiselleştirme</Form.Label>
        <Form.Control type="text" placeholder="Kişiselleştirme" />
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Eklemek istediğiniz not</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleShow}>
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
            I will not close if you click outside me. Don't even try to press
            escape key.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Vazgeç
            </Button>
            <Button variant="success">Onayla</Button>
          </Modal.Footer>
        </Modal>
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

  return {
    props: {
      products,
    },
  };
}
