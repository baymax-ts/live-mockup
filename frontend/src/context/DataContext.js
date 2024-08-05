import { notification } from "antd";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({children}) => {
  const defaultMockupColor = "#1677ff";
  const [api, contextHolder] = notification.useNotification();
  const [mockupColor, setColor] = useState("#1677FF");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState();
  const [generating, setGenerating] = useState(false);
  const [logoImage, setLogoImage] = useState([]);
  const [resultImage, setResultImage] = useState();
  const [ userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  const openNotification = (message) => {
    api.open({
      message,
      showProgress: true,
      pauseOnHover: true
    });
  }

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if(token === null){
        localStorage.setItem("auth-token", "");
        token = "";
        return;
      }
      const user = localStorage.getItem('user');
      setUserData({
        token,
        user
      })
      const tokenResponse = await axios.post(`${process.env.REACT_APP_SERVER}/users/tokenIsValid`, null, {headers: {"x-auth-token": token}});
      if (tokenResponse.data) {
        const userRes = await axios.get(`${process.env.REACT_APP_SERVER}/users/`, {
          headers: { "x-auth-token": token },
        });
        localStorage.setItem("user", userRes.data);
        setUserData({
          token,
          user: userRes.data,
        });
      }
    }

    checkLoggedIn();
  }, []);

  return (
    <DataContext.Provider value= {{
      mockupColor, setColor, models, setModels, currentModel, setCurrentModel, generating, setGenerating, logoImage, setLogoImage,
      resultImage, setResultImage, defaultMockupColor, openNotification, userData, setUserData
    }}>
      {contextHolder}
      {children}
    </DataContext.Provider>
  )
}