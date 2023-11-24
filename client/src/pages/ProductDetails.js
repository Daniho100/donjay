import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [isOn, setIsOn] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0); // Added state for selected image index


  //initalp details
  useEffect(() => {
    if (params?._id) getProduct();
  }, [params?._id]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params._id}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
    
    // Function to handle the toggle action
    const handleToggle = () => {
      setIsOn(!isOn);
    };


    const handleImageClick = (index) => {
      setSelectedImage(index);
    };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-9">

                {product?.selectedFiles && (
                  <div class="image-card">
                  <img
                    src={product.selectedFiles[selectedImage]}
                    className="card-img-top"
                    alt={product.name}
                    height="430"
                    width={"400px"}
                  />
                  </div>
                )}
                {/* Slider for other images */}
                {Array.isArray(product?.selectedFiles) && product.selectedFiles.length > 1 && (
                  <div className="image-slider">
                    {product.selectedFiles.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={product.name}
                        onClick={() => handleImageClick(index)}
                        className={index === selectedImage ? "selected" : ""}
                        height="110"
                        width={"200px"}
                        cursor="pointer"
                      />
                    ))}
                  </div>
                )}
        </div>
        
        <div className="col-md-3 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Model : {product.model}</h6>
          <h6>
            Price : 
             {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "NGN",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <h6>Gear Type : {product.gearType}</h6>
          <h6>Year : {product.year}</h6>
          <h6>Color : {product.color}</h6>
          <h6>Car Registrated? : {product.registration}</h6>
          <button class="btn btn-secondary ms-1" onClick={handleToggle}>{isOn ? " Call: +234 9082824893 " : "Show Seller's Contact"}</button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={p.selectedFiles}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                {/* <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p> */}
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    More Details
                  </button>
                  {/* <button
                  className="btn btn-dark ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, p])
                    );
                    toast.success("Item Added to cart");
                  }}
                >
                  ADD TO CART
                </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;








