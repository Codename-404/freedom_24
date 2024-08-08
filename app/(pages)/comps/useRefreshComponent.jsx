import { useState } from "react";

const useRefreshComponent = () => {
  const [refresh, setRefresh] = useState(0);

  const refreshComp = () => {
    let val = Math.round(Math.random() * 15000);
    if (val === refresh) {
      val++;
    }

    setRefresh(val);
  };

  return refreshComp;
};

export default useRefreshComponent;
