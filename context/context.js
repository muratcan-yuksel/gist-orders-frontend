import React, { useState, createContext } from "react";

//note that we don't use export default here
//create context here, use context in others

//this DataContext will be shared by all the components
export const DataContext = createContext([]);

//this is our provider
export const DataProvider = (props) => {
  const [data, setData] = useState([]);

  return (
    <div>
      <DataContext.Provider value={[data, setData]}>
        {props.children}
      </DataContext.Provider>
    </div>
  );
};
