import { Button, ColorPicker, Flex } from "antd";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./Home.css"
import { DataContext } from "../../context/DataContext";
import Model from "../../components/Model/Model";
import MockupCanvas from "./components/MockupCanvas";
import LogoItem from "./components/LogoItem";
import axios from "axios";
import { Link } from "react-router-dom";
import { DownloadOutlined } from "@ant-design/icons";

const Home = () => {
  const {logoImage, setLogoImage, mockupColor, setColor, models, setModels, currentModel, setCurrentModel, defaultMockupColor, generating, setGenerating, resultImage, setResultImage, openNotification} = useContext(DataContext);

  const color = useMemo(() => (typeof mockupColor === 'string' ? mockupColor : mockupColor.toHexString()), [mockupColor]);
  const pickerColorStyle = {
    backgroundColor: color,
  };

  const [logoIndex, setLogoIndex] = useState(-1);

  const inputFile = useRef(null);
  const canvasRef = useRef(null);
  const downloadRef = useRef(null);

  const loadModels = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_SERVER}/models`);
    setModels(data);
    if (!currentModel && data.length > 0) {
      setCurrentModel(data[0]);
    }
  }

  const onFileSelected = (event) => {
    if (!event.target.files || !event.target.files.length)  return;
    if (logoIndex == -1) {
      canvasRef.current.addLogo(event.target.files[0], logoImage.length == 0);
      setLogoImage([...logoImage, {content: event.target.files[0], visible: true}]);
    } else {
      const t = [...logoImage];
      t[logoIndex] = {
        ...t[logoIndex],
        content: event.target.files[0]
      }
      canvasRef.current.changeLogo(logoIndex, event.target.files[0])
      setLogoImage(t);
      setLogoIndex(-1);
    }
    // openCropDialog(true);
  }

  useEffect( () => {
    loadModels();
  }, []);

  useEffect(() => {
    canvasRef.current.setColor(typeof mockupColor === 'string' ? mockupColor : mockupColor.toHexString());
  }, [mockupColor]);

  const downloadImage = async () => {
    canvasRef.current.deselect();
    downloadRef.current.href = await canvasRef.current.getDownloadLink();
    downloadRef.current.download = 'canvas-mockup.png';
    downloadRef.current.click();
  }

  return (
    <div className="overflow-hidden pb-4">
      <a ref={downloadRef} className="hidden"/>
      <header className="h-16 w-full rounded-full shadow-md bg-white flex items-center pl-10 pr-10 justify-between">
        <Link to="/"><h1 className="title">Mockup</h1></Link>
        <div className='flex'>
          <Button type="primary" shape="round" icon={<DownloadOutlined />} size="large" onClick={() => downloadImage()}>
            Download
          </Button>
          {/* <Button type="primary" shape="round" icon={<PlusOutlined />} size="large" className='ml-2'>
            Add Model
          </Button> */}
        </div>
      </header>
      <Flex gap="middle" className="mt-4">
        <div className="shadow-md w-1/4 rounded-2xl bg-white flex flex-col items-center">
          <input type="file" style={{display: 'none'}} onChange={onFileSelected} ref={inputFile}/>
          <div className="flex mt-2 w-full p-2">
            <ColorPicker
              size="large"
              disabledAlpha
              defaultValue={defaultMockupColor}
              onChange={setColor} >
              <div className="w-full h-12 rounded-md shadow-md border p-1 flex items-center">
                <div style={pickerColorStyle} className="h-full aspect-square rounded-md"/>
                <p className="ml-4">TShirt Color</p>
              </div>
            </ColorPicker>
          </div>
          <div className="flex flex-col w-full p-2">
            {
              logoImage && logoImage.length > 0 && logoImage.map((logo, idx) => {
                return <LogoItem key={idx}
                  logo={logo}
                  replace={() => {
                    setLogoIndex(idx);
                    inputFile.current.click()
                  }}
                  toggleVisible={() => {
                    const t = [...logoImage];
                    t[idx] = {
                      ...t[idx],
                      visible: !t[idx].visible
                    }
                    setLogoImage(t);
                    canvasRef.current.toggleVisible(idx);
                  }}
                  deleteLogo={() => {
                    const t = [...logoImage];
                    t.splice(idx, 1)
                    setLogoImage(t);
                    canvasRef.current.removeLogo(idx);
                  }}
                  />
              })
            }
            <Button className="mt-4" type="primary" shape="round" size='large' onClick={() => inputFile.current.click()}>Add Logo</Button>
          </div>
        </div>
        <div className="w-2/4">
          <MockupCanvas model={currentModel} ref={canvasRef}/>
        </div>
        <div className="w-1/4 shadow-md rounded-2xl bg-white overflow-auto aspect-[1/2] scroll-content">
          <Flex gap="middle" wrap className="mt-2">
          {
            models && models.map((model, idx) => {
              return (
                <div key={idx} 
                  className="model-item"
                  onClick={() => setCurrentModel(model)}>
                  {/* <Preview id={model.id} logoUrl={logoImage || 'sample.png'}/> */}
                  <Model model={model} currentModel={currentModel}/>
                </div>
              )
            })
          }
          </Flex>
        </div>
      </Flex>
    </div>
  );
}

export default Home;