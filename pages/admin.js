import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { DataContext } from "../context/context";
import { getCookie } from "cookies-next";

const AdminPage = () => {
  // console.log(localStorage.getItem("refreshToken"));
  const router = useRouter();
  //   const [user, setUser] = useState(null);
  //user id is in the context
  const [context, setContext] = useContext(DataContext);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    // setUser({ accessToken, refreshToken });

    // Check if the user is an admin
    const decodedToken = jwt_decode(accessToken);
    if (!decodedToken.isAdmin) {
      // Redirect to a 404 error page if the user is not an admin
      router.push("/error");
    }
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      {/* Rest of your admin page code */}
    </div>
  );
};

export default AdminPage;
