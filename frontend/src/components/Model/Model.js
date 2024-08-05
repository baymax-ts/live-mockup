import { Badge } from "antd";
import { useContext, useEffect, useState } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { DataContext } from "../../context/DataContext";

const Model = ({model, currentModel}) => {

  const [preview, setPreviewImage] = useState("");
  
  useEffect(() => {
    const path = model.base_image;
    setPreviewImage(`${path}`);
  }, []);

  return (
    <div className="m-2 border rounded-md shadow-md hover:shadow-lg hover:border-sky-600 cursor-pointer bg-[#222222]">
      <Badge count={
        currentModel === model ? (
          <CheckCircleFilled style={{color: "#1677ff"}}/>)
        : (0)}>
        <img src={preview} style={{width: '100%'}} alt={model.name} className="aspect-square object-contain"/> 
      </Badge>
    </div>
  )
}

export default Model;