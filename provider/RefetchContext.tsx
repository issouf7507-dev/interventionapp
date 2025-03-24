import React from "react";

export const RefetchContext = React.createContext<(() => void) | undefined>(
  undefined
);

export const useRefetch = () => {
  const refetch = React.useContext(RefetchContext);
  if (!refetch) {
    throw new Error("useRefetch must be used within a RefetchContext Provider");
  }
  return refetch;
};
