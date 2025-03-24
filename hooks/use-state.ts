import { useState } from "react";

function useCustomState(initialValue = false) {
  const [isOpen, setIsOpen] = useState(initialValue);

  const toggle = () => setIsOpen((prevState) => !prevState);

  return [isOpen, toggle];
}

export default useCustomState;
