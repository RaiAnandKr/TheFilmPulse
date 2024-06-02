"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Pulse = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/pulse/opinions");
  }, []);

  return <></>;
};

export default Pulse;
