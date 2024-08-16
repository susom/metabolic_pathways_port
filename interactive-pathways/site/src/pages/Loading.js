import React, { useState, useEffect } from 'react';
import { Loader } from 'semantic-ui-react';

const Loading = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 300);

    return () => clearTimeout(timer); // Cleanup if the component unmounts
  }, []);

  return showLoader ? <Loader active size="massive" /> : null;
};

export default Loading;
