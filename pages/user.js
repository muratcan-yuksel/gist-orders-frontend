import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { DataContext } from "../context/context";
import { createClient } from "next-sanity";
import Form from "react-bootstrap/Form";

const user = ({ products }) => {
  const [context, setContext] = useContext(DataContext);
  const userId = context;
  const [myUser, setMyUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div>
      {returnState()}
      <Form.Control
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div>
        <Form.Select aria-label="Default select example">
          {filteredProducts.map((product) => (
            <option value={product._id}>
              Ürün Adı: {product.name} - Ürün Kodu: {product.code}
            </option>
          ))}
        </Form.Select>
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
