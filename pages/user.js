import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { DataContext } from "../context/context";
import { createClient } from "next-sanity";

const user = ({ products }) => {
  const [context, setContext] = useContext(DataContext);
  const userId = context;
  const [myUser, setMyUser] = useState(null);

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

  return <div>{returnState()}</div>;
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
