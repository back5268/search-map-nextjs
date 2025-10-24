"use client";

import { PrimeReactProvider } from "primereact/api";
import { Toastify } from "../base/Toastify";
import { ConfirmDialogz } from "../core";

export const PrimeProvider = ({ children }) => {
  return (
    <PrimeReactProvider value={{ ripple: true, appendTo: "self" }}>
      <Toastify />
      <ConfirmDialogz />
      {children}
    </PrimeReactProvider>
  );
};
