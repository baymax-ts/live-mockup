import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, LinkOutlined } from "@ant-design/icons";
import { Button } from "antd";

const LogoItem = ({logo, toggleVisible, deleteLogo, replace}) => {
  return (
    <div className="rounded-md shadow-md flex divide-x w-full border items-center mb-2">
      <img src={URL.createObjectURL(logo.content)} className="aspect-square h-12 object-contain" />
      <div className="shrink w-full flex items-center divide-x">
        <div className="flex w-1/3 justify-center">
          <Button type="text" icon={<LinkOutlined />} className="w-full" onClick={() => replace()}>Replace</Button>
        </div>
        <div className="flex w-1/3 justify-center">
          <Button type="text" icon={logo.visible ? <EyeInvisibleOutlined /> : <EyeOutlined />} className="w-full" onClick={() => toggleVisible()}>{logo.visible ? 'Hide' : 'Show'}</Button>
        </div>
        <div className="flex w-1/3 justify-center">
          <Button type="text" icon={<DeleteOutlined />} className="w-full" onClick={() => deleteLogo()}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

export default LogoItem;