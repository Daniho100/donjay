import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../../firebase';
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;


const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    model: "",
    price: "",
    year: "",
    mileage: "",
    gearType: "",
    color: "",
    registration: "",
    selectedFiles: [],
  });

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);


  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };


  const handleImageSubmit = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    try {
      const promises = selectedFiles.map(storeImage);
      const urls = await Promise.all(promises);

      setProductData((prevData) => ({
        ...prevData,
        selectedFiles: prevData.selectedFiles.concat(urls),
      }));
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
    }
  };


    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productData.selectedFiles.length < 1)
        return toast.error('You must upload at least one image');
      
      const res = await axios.post('/api/v1/product/create-product', {
        headers: {
          'Content-Type': 'application/json',
        },
          ...productData,
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
      }
      navigate(`/dashboard/admin/products`);
    } catch (error) {
      toast.error(error.message);
    }
  };
 
  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setProductData((prevData) => ({ ...prevData, category: value }))}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {productData.selectedFiles.length > 0
                    ? `${productData.selectedFiles.length} Photos selected`
                    : "Upload Photos"}
                  <input
                    type="file"
                    name="selectedFile"
                    accept="image/*"
                    onChange={handleImageSubmit}
                    multiple
                    hidden
                  />
                </label>
              </div>
              {productData.selectedFiles.length > 0 && (
                <div className="mb-3">
                  <div className="text-center">
                    {productData.selectedFiles.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`product_photo_${index}`}
                        height={"200px"}
                        className="img img-responsive"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <input
                  type="text"
                  value={productData.name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, name: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={productData.model}
                  placeholder="Write a model"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, model: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={productData.price}
                  placeholder="Write a Price"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, price: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={productData.mileage}
                  placeholder="Write a mileage"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, mileage: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={productData.gearType}
                  placeholder="Write a gearType"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, gearType: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={productData.color}
                  placeholder="Write a color"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, color: e.target.value }))}
                />
              </div>
              <div className="mb-3">
              <div className="mb-3">
                <input
                  type="number"
                  value={productData.year}
                  placeholder="Write a year"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, year: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={productData.registration}
                  placeholder="Write a registration"
                  className="form-control"
                  onChange={(e) => setProductData((prevData) => ({ ...prevData, registration: e.target.value }))}
                />
              </div>
              </div>
              
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
