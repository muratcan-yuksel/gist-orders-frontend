import "../styles/globals.css";
//import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }) {
  return (
    <div className="mainComp">
      <Component {...pageProps} />
    </div>
  );
}
