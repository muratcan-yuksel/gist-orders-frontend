import "../styles/globals.css";
//import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//context
import { DataProvider } from "../context/context";

export default function App({ Component, pageProps }) {
  return (
    <div className="mainComp">
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </div>
  );
}
