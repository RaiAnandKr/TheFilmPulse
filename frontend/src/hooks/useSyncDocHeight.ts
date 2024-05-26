import { useEffect } from "react";

export const useSyncDocHeight = () => {
  useEffect(() => {
    function setDocHeight() {
      document
        .getElementById("appContainer")
        ?.style.setProperty("height", `${window.innerHeight}px`);
    }

    window.addEventListener("resize", setDocHeight);
    window.addEventListener("orientationchange", setDocHeight);

    setDocHeight();

    return () => {
      window.removeEventListener("resize", setDocHeight);
      window.removeEventListener("orientationchange", setDocHeight);
    };
  }, []);
};
