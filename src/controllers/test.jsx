import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import { ArrowDown, ImageIcon } from "../icons";

export default function Payment() {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: null,
    firstName: "",
    lastName: "",
    mobilePhone: "",
    address: "",
    postId: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [fileSlip, setFileSlip] = useState(null);
  const fileElSlip = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("/cart/getAllItem");
      setCartItems(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const sumTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = parseInt(item.post.price.replace(/,/g, ""), 10);
      return sum + price;
    }, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    sumTotalPrice();
  }, [cartItems]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("/user/getAddress", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAddresses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "/user/addAddress";
      let method = "post";
      if (newAddress.id) {
        endpoint = `/user/addAddress/${newAddress.id}`;
        method = "patch";
      }
      await axios({
        method: method,
        url: endpoint,
        data: newAddress,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAddresses();
      setEditAddressOpen(false);
      setNewAddress({
        id: null,
        firstName: "",
        lastName: "",
        mobilePhone: "",
        address: "",
        postId: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (address) => {
    setNewAddress({
      id: address.id,
      firstName: address.firstName,
      lastName: address.lastName,
      mobilePhone: address.mobilePhone,
      address: address.address,
      postId: address.postId,
    });
    setEditAddressOpen(true);
  };

  const handleRemoveFile = (e, setFile) => {
    e.stopPropagation();
    setFile(null);
  };

  const handlePayment = async () => {
    if (!fileSlip) {
      alert("Please upload your payment slip.");
      return;
    }

    // Upload payment slip to Cloudinary
    const formData = new FormData();
    formData.append("file", fileSlip);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        formData
      );
      const imageUrl = res.data.secure_url;

      // Collect user info
      const userInfo = {
        user_id: localStorage.getItem("user_id"),
        email: localStorage.getItem("email"),
        mobilePhone: addresses.length > 0 ? addresses[0].mobilePhone : "",
        address: addresses.length > 0 ? addresses[0].address : "",
        post_id: addresses.length > 0 ? addresses[0].postId : "",
      };

      // Collect item info
      const itemInfo = cartItems.map((item) => ({
        post_id: item.post.idcactus,
      }));

      // Record payment data
      const paymentData = {
        userInfo,
        itemInfo,
        paymentSlipUrl: imageUrl,
      };

      await axios.post("/payment/record", paymentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Payment recorded successfully!");
    } catch (error) {
      console.log(error);
      alert("Error recording payment. Please try again.");
    }
  };

  return (
    <div className="w-[80%] mx-auto flex flex-col gap-4 text-old-green">
      <div className="text-old-green bg-old-white p-4 mt-4 rounded-md">
        <div className="font-bold">Delivery Address</div>
        <div className="flex justify-between items-center text-old-green mt-2">
          <div className="w-[30%] text-old-green">
            {addresses.length > 0 && (
              <>
                <div className="font-bold">
                  Name: {addresses[0].firstName} {addresses[0].lastName}
                </div>
              </>
            )}
          </div>
          <div className="w-[60%] text-old-green">
            {addresses.length > 0 && (
              <>
                <address>{addresses[0].address}</address>
                <div>
                  {addresses[0].postId} <p>Tel: {addresses[0].mobilePhone}</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => {
              if (addresses.length === 0) {
                setEditAddressOpen(true);
              } else {
                handleEdit(addresses[0]);
              }
            }}
            className="w-[10%] text-red-600"
          >
            {addresses.length === 0 ? "Add Address" : "Edit"}
          </button>
          <Modal
            title={addresses.length === 0 ? "Add Address" : "Edit Address"}
            open={editAddressOpen}
            onClose={() => setEditAddressOpen(false)}
          >
            <form
              onSubmit={handleSubmit}
              className="flex justify-center flex-col items-center"
            >
              <div>
                <label className="text-white flex justify-center items-center w-full">
                  <p className="w-[50%]">First Name:</p>
                  <input
                    className="bg-transparent border-none text-white"
                    type="text"
                    name="firstName"
                    value={newAddress.firstName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label className="text-white flex justify-center items-center">
                  <p>Last Name:</p>
                  <input
                    className="bg-transparent border-none text-white"
                    type="text"
                    name="lastName"
                    value={newAddress.lastName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label className="text-white flex justify-center items-center">
                  <p>Mobile Phone:</p>
                  <input
                    className="bg-transparent border-none text-white"
                    type="text"
                    name="mobilePhone"
                    value={newAddress.mobilePhone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label className="text-white flex justify-center items-center">
                  <p>Address:</p>
                  <input
                    className="bg-transparent border-none text-white"
                    type="text"
                    name="address"
                    value={newAddress.address}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label className="text-white flex justify-center items-center">
                  <p>Post ID:</p>
                  <input
                    className=" bg-transparent border-none text-white"
                    type="text"
                    name="postId"
                    value={newAddress.postId}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <button type="submit" className="text-red-500 mt-2">
                Submit
              </button>
            </form>
          </Modal>
        </div>
      </div>

      <div className="w-[100%] flex flex-col gap-4">
        {cartItems.map((el) => (
          <div
            key={el.id}
            className="flex w-[100%] justify-between items-center text-old-green bg-old-white rounded-md p-4"
          >
            <p className="w-[10%] font-bold">{el.post.idcactus}</p>
            <img
              src={el.post.A_side}
              alt="picc"
              className="w-[60px] h-[60px] border-[1px] border-white rounded-md"
            />
            <p className="flex w-[50%]">
              {el.post.family_name} - {el.post.name}
            </p>
            <p>{el.post.price}</p>
          </div>
        ))}
      </div>

      <div
        className="text-old-green bg-old-white p-4  flex justify-between items-center rounded-md"
        onClick={() => setOpen((prev) => !prev)}
      >
        <p className="w-[90%] font-bold">payment method</p>
        <ArrowDown />
      </div>

      {open && (
        <div className="w-full h-[400px] bg-white drop-shadow-lg rounded-md flex  justify-center items-center gap-16">
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-old-green font-bold ">QR CODE</p>
            <div className="flex justify-center items-center  w-[270px] h-[270px]  bg-white rounded-[16px] drop-shadow-lg">
              <img
                src="../public/62724.jpg"
                alt="qrCode"
                className="h-60 rounded-md"
              />
            </div>
          </div>
          <div
            role="button"
            className="flex flex-col justify-center items-center gap-2"
            onClick={() => fileElSlip.current?.click()}
          >
            <input
              type="file"
              className="hidden"
              ref={fileElSlip}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFileSlip(e.target.files[0]);
                }
              }}
            />
            <span className="text-old-green font-bold ">Payment Slip</span>
            {fileSlip ? (
              <div
                role="button"
                className="relative w-[270px] h-[270px] bg-white rounded-[16px] flex justify-center items-center flex-col drop-shadow-lg"
                onClick={() => fileElSlip.current?.click()}
              >
                <img
                  src={URL.createObjectURL(fileSlip)}
                  alt="post"
                  className="w-[270px] h-[270px]  rounded-[16px] flex justify-center items-center flex-col drop-shadow-lg"
                />
                <button
                  className="absolute top-1 right-1"
                  onClick={(e) => handleRemoveFile(e, setFileSlip)}
                >
                  &#10005;
                </button>
              </div>
            ) : (
              <div className="w-[270px] h-[270px] bg-white drop-shadow-lg rounded-[16px] flex justify-center items-center flex-col">
                <ImageIcon />
                <span>Upload Your Payment Slip Here</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-old-green bg-old-white p-4 flex justify-center items-center rounded-md">
        <p className="w-[70%] font-bold text-[40px]"></p>
        <div className="flex justify-center items-baseline gap-4">
          <p className="text-[30px] font-bold">total</p>
          <p className="text-[50px] font-bold">{totalPrice.toLocaleString()}</p>
          <p className="text-[30px] font-bold">THB</p>
        </div>
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-old-green text-old-white border-[4px] border-old-white font-bold text-[30px] p-4 hover:bg-old-white rounded-[14px] hover:border-old-green hover:text-old-green"
      >
        PLACE ORDER
      </button>
    </div>
  );
}
