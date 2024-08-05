import { useContext, useEffect, useState } from "react";
import Model from "../../components/Model/Model";
import { Button, Flex, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddModelDialog from "./components/NewModel";
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const { openNotification } = useContext(DataContext);
  const { userData } = useContext(DataContext);
  const navigate = useNavigate();

  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState();
  const [isAddModel, setAddModel] = useState(false);
  const [confirmDelete, showConfirmDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [eModel, setEditModel] = useState();

  const loadModels = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_SERVER}/models`);
    setModels(data);
  }

  const selectModel = async (model) => {
    setCurrentModel(model);
  }

  const deleteModel = async () => {
    setDeleting(true);
    await axios.delete(`${process.env.REACT_APP_SERVER}/models/${currentModel._id}`);
    setDeleting(false);
    showConfirmDialog(false);
    openNotification("Delete Successfully");
    setCurrentModel(null);
    loadModels();
  }

  const editModel = () => {
    setEditModel(currentModel);
    setAddModel(true);
  }

  const addModel = () => {
    setEditModel(null)
    setAddModel(true);
  }

  const onAddModel = () => {
    setAddModel(false);
    loadModels();
  }

  const onCloseModal = () => {
    setAddModel(false);
  }

  useEffect(() => {
    if(!userData.user) {
      navigate(`/login?redirect=admin`)
    } else {
      loadModels();
    }
  }, [userData])

  return (
    <>
      <Flex gap="middle">
        <div className="option-panel shadow-md">
          <div className="w-full m-2 flex items-center justify-between">
            <h1>
              Models
            </h1>
            <Button
              className="mr-4"
              type="primary"
              shape="circle"
              onClick={() => addModel()}
              icon={<PlusOutlined />} size="large" />
          </div>

          <Flex gap="middle" wrap className="mt-2 overflow-auto aspect-[1/2]">
          {
            models.map((model, idx) => {
              return (
                <div key={idx} 
                  className="model-item"
                  onClick={() => selectModel(model)}>
                  <Model model={model} currentModel={currentModel}/>
                </div>
              )
            })
          }
          </Flex>
        </div>
        <div className="mockup-panel shadow-md">
          <div className="flex flex-row-reverse">
            <Button shape="round" danger disabled={!currentModel} className="ml-2" onClick={() => showConfirmDialog(true)}>
              Delete
            </Button>
            <Button shape="round" type="primary" disabled={!currentModel} onClick={() => editModel()}>
              Edit
            </Button>
          </div>
          {
            currentModel &&
            <div className="flex justify-center mt-2">
              <div className="flex w-2/3">
                <div className="rounded-md border aspect-square w-1/2 bg-[#ddd]">
                  <img src={currentModel.base_image} className="w-full h-full object-contain"/>
                </div>
                <div className="rounded-md border aspect-square w-1/2 ml-2 bg-[#ddd]">
                <img src={currentModel.mask_image} className="w-full h-full object-contain"/>
                </div>
              </div>
            </div>
          }
        </div>
      </Flex>
      {
        isAddModel && <AddModelDialog handleOk={() => onAddModel()} handleCancel={() => onCloseModal()} model={eModel}/>
      }
      <Modal title="Delete" open={confirmDelete} maskClosable={false}
        footer={[
          <Button key="cancel" onClick={() => showConfirmDialog(false)} disabled={deleting}>
            Cancel
          </Button>,
          <Button key="save" type="primary" loading={deleting} onClick={() => deleteModel()}>
            Delete
          </Button>
        ]}>
        <p>Do you want to delete current model?</p>
      </Modal>
    </>
  )
}

export default Admin;
