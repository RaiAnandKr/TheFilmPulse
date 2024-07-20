'use client';

import { useEffect, useState } from 'react';
import MicrosoftClarity from './MicrosoftClarity';
import MetaPixel from './MetaPixel';

const Metrics = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <>
      {initialized && <MicrosoftClarity />}
      {initialized && <MetaPixel />}
    </>
  );
};

export default Metrics;

