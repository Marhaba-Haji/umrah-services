import { createContext, useContext } from "react";

export const CurrencyContext = createContext({
  currency: "INR",
  setCurrency: (currency: string) => {},
});
export const useCurrency = () => useContext(CurrencyContext);
