import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

const AdminPage = () => {
  const router = useRouter();
  //   const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
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
