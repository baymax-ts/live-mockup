import { Button, Modal, Spin  } from "antd";
import { useContext, useRef, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import axios from "axios";

const AddModelDialog = ({handleOk, handleCancel, model}) => {

  const { openNotification } = useContext(DataContext);

  const [saving, setSaving] = useState(false);
  const [baseImage, setBaseImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [basePreview, setBasePreview] = useState(!!model ? model.base_image : null);
  const [maskPreview, setMaskPreview] = useState(!!model ? model.mask_image : null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [baseImageChanged, setBaseImageChanged] = useState(false);
  const [maskImageChanged, setMaskImageChanged] = useState(false);
  const [status, setStatus] = useState();
  const baseImageInput = useRef();
  const maskImageInput = useRef();

  const onConfirm = async () => {
    if (!basePreview) {
      openNotification("Select the base image");
      return;
    }
    if (!maskPreview) {
      openNotification("Select the mask image");
      return;
    }

    setSaving(true);
    setStatus("Initializing");
    if (!model?.id) {
      
      const formData = new FormData();
      formData.append("base", baseImage);
      formData.append("mask", maskImage);
      const token = localStorage.getItem("auth-token");
      console.log(token);
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/models`, formData, {
        headers: { "x-auth-token": token,
          'content-type': 'multipart/form-data',
        }
      });
    } else {
      if (baseImageChanged || maskImageChanged) {
      
        const formData = new FormData();
        formData.append("base", baseImage);
        formData.append("mask", maskImage);
        const token = localStorage.getItem("auth-token");
        const res = await axios.put(`${process.env.REACT_APP_SERVER}/models/${model._id}`, formData, {
          headers: { "x-auth-token": token,
            'content-type': 'multipart/form-data',
          }
        });
      }
    }
    setStatus(null);
    setSaving(false);
    handleOk();
  }

  const onClose = () => {
    if (baseImageChanged || maskImageChanged) {
      setConfirmDiscard(true);
    } else {
      handleCancel();
    }
  }

  const onMaskImageSelected = (event) => {
    if (!event.target.files)  return;
    if (event.target.files.length <= 0) return;
    const maskUrl = URL.createObjectURL(event.target.files[0]);
    setMaskPreview(maskUrl);
    setMaskImage(event.target.files[0]);
    setMaskImageChanged(true);
  }

  const onBaseImageSelected = (event) => {
    if (!event.target.files)  return;
    if (event.target.files.length <= 0) return;
    const baseUrl = URL.createObjectURL(event.target.files[0])
    setBasePreview(baseUrl);
    setBaseImage(event.target.files[0]);
    setBaseImageChanged(true);
  }

  return (
    <>
      <Modal title="New Model" open onOk={() => onConfirm()} onCancel={() => onClose()} maskClosable={false}
        footer={[
          <Button key="cancel" onClick={() => onClose()} disabled={saving}>
            Cancel
          </Button>,
          <Button key="save" type="primary" loading={saving} onClick={() => onConfirm()}>
            Save
          </Button>
        ]}>
        <div>
          <div className="flex flex-row">
            <div className="w-[50%] p-1">
              <div className="flex w-full aspect-square border rounded-md justify-center items-center bg-[#ddd] cursor-pointer" onClick={() => baseImageInput?.current.click()} >
                <input type="file" hidden ref={baseImageInput} onChange={onBaseImageSelected}/>
                {
                  !!basePreview ?
                    <img className="w-full aspect-square object-contain" src={basePreview}/>
                  :
                    <Button shape="round" type="primary" >
                      Add Base Image
                    </Button>
                }
              </div>
            </div>
            <div className="w-[50%] p-1">
              <div className="flex w-full aspect-square border rounded-md justify-center items-center bg-[#ddd] cursor-pointer" onClick={() => maskImageInput?.current.click()}>
                <input type="file" hidden ref={maskImageInput} onChange={onMaskImageSelected}/>
                {
                  !!maskPreview ?
                    <img className="w-full aspect-square object-contain" src={maskPreview}/>
                  :
                    <Button shape="round" type="primary">
                      Add Mask Image
                    </Button>
                }
              </div>
            </div>
          </div>
          {/* {
            basePreview && maskPreview && 
              <PerspectiveView points={[...perspectives]}
                onPointChanged={(e) => setPerspectives(e)}
                baseImage={basePreview}
                maskImage={maskPreview}/>
          } */}
          {
            status && 
            <div className='flex mt-2 justify-center'>
              <Spin/>
              <p className="ml-2">{status}</p>
            </div>
          }
        </div>
      </Modal>
      <Modal title="Discard" open={confirmDiscard} onOk={() => handleCancel()} onCancel={() => setConfirmDiscard(false)} maskClosable={false}>
        <p>Do you want to discard current model?</p>
      </Modal>
    </>
  )
}

export default AddModelDialog;