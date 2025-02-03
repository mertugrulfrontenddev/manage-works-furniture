import { createContext, useState } from "react";

export const LotContext = createContext();

export const LotProvider = ({ children }) => {
  const [lots, setLots] = useState([
   
  ]);

 


  const addLot=(lot)=>{

    setLots((prevLots)=>[...prevLots,lot]);
  };
  return (
    <LotContext.Provider value={{ lots, setLots,addLot}}>
      {children}
    </LotContext.Provider>
  );
};
