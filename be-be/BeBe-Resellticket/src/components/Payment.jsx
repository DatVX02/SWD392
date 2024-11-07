import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Card, Radio, Input, Checkbox, Button, Form, Divider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";
import { message } from "antd";

export default function Payment() {
  const [form] = Form.useForm();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [currentStep, setCurrentStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(
    JSON.parse(localStorage.getItem("selectedVoucher"))
  );

  const reduxCartItems = useSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    shippingMethod: "",
    paymentMethod: "",
    orderNotes: "",
    terms: false,
    voucherId: "",
    items: reduxCartItems,
  });

  // Hàm để lấy thông tin giỏ hàng từ backend
  const fetchCartItems = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/api/carts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch cart items. Status: ${response.status}`
        );
      }
      const data = await response.json();
      setCartItems(data.items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Xử lý lỗi, ví dụ hiển thị thông báo lỗi cho người dùng
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchCartItems();
    } else {
      setCartItems(reduxCartItems);
    }
  }, [reduxCartItems]);

  const handleShippingChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleFormSubmit = async (values) => {
    console.log("Form values:", values);
    setFormData({ ...formData, ...values });

    if (currentStep !== 1) {
      nextStep();
    } else {
      formData.paymentMethod = values.paymentMethod;
      formData.shippingMethod = values.shippingMethod;
      formData.terms = values.terms;
      formData.orderNotes = values.orderNotes;
      selectedVoucher
        ? (formData.voucherId = selectedVoucher._id)
        : (formData.voucherId = "");
      var dataOrder = await createOrder(formData);
      if (values.paymentMethod === "vnpay") {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await fetch(
            "http://localhost:5000/api/vnpay/create_payment_url",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                amount: getTotalPrice(),
                bankCode: "NCB",
                orderInfo: dataOrder._id,
                orderType: "Pending",
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to create VNPAY payment URL");
          }

          const data = await response.json();
          console.log("VNPAY payment URL:", data.vnpUrl);
          setPaymentUrl(data.vnpUrl);

          // Redirect to VNPAY payment gateway
          window.location.href = data.vnpUrl;
        } catch (error) {
          console.error("Error creating VNPAY payment URL:", error.message);
          // Handle error, display error message, etc.
        }
      }
    }
  };

  const createOrder = async (orderData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        const data = await response.json();

        if (data.paymentMethod !== "vnpay") {
          handleOrderSuccess();
        } else {
          return data;
        }
      } else {
        const response = await fetch(
          "http://localhost:5000/api/orders/withoutAccount",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        const data = await response.json();

        if (data.paymentMethod !== "vnpay") {
          handleOrderSuccess();
        } else {
          return data;
        }
      }
    } catch (error) {
      console.error("Error creating order:", error.message);
    }
  };

  const handleOrderSuccess = () => {
    message.success("Order placed successfully!");
    window.location.href = "/";
  };

  const steps = ["Thông tin đăng nhập", "Thông tin giao hàng", "Thanh toán"];

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // const getTotalPrice = () => {
  //   const total = cartItems.reduce(
  //     (total, item) => total + item.productId.regular_price * item.quantity,
  //     0
  //   );
  //   return selectedVoucher
  //     ? total * (1 - selectedVoucher.voucher_discount / 100)
  //     : total;
  // };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    return selectedVoucher ? subtotal * (1 - selectedVoucher.voucher_discount / 100) : subtotal;
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.regular_price * item.quantity,
      0
    );
  };
  return (
    <>
      <div className="bg-[#2DC275] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-2 rounded-full w-40">
            <Link to="/">
              <img src="./public/assets/images/image.jpg" alt="Logo" className="rounded-3xl" />
            </Link>
          </div>
        </div>
        <div className="flex-grow mx-4">
          <Box sx={{ width: "100%" }}>
            {/* <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper> */}
          </Box>
        </div>
      </div>
      <div className="flex justify-between mx-10">
        <Button
          className="my-10"
          shape="circle"
          type="primary"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          className="my-10"
          shape="circle"
          type="primary"
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {currentStep === 0 && (
        <div className="flex flex-col md:flex-row w-11/12 mx-auto my-10">
          <div className="w-full md:w-1/2 p-4">
            <Card className="shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-500">
                Thanh toán
              </h2>
              <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="SĐT"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  name="province"
                  label="Tỉnh"
                  rules={[{ required: true, message: "Vui lòng nhập tỉnh" }]}
                >
                  <Input placeholder="Nhập tỉnh" />
                </Form.Item>
                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[
                    { required: true, message: "Vui lòng nhập quận/huyện" },
                  ]}
                >
                  <Input placeholder="Nhập quận/huyện" />
                </Form.Item>
                <Form.Item
                  name="ward"
                  label="Phường"
                  rules={[{ required: true, message: "Vui lòng nhập phường" }]}
                >
                  <Input placeholder="Nhập phường" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Số nhà, tên đường"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Tiếp tục
                </Button>
              </Form>
            </Card>
          </div>
          <div className="w-full md:w-1/2 p-4">
            <Card className="shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-500">Giỏ hàng</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start mb-4">
                  <img
                    src={`http://localhost:5000/${item.productId?.image}`}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex justify-between ml-4 w-full">
                    <p className="font-bold">{item.productId.name}</p>
                    <div className="flex flex-col">
                      <p>
                        {item.productId.regular_price.toLocaleString("vi-VN")}đ
                      </p>
                      <p>x{item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Tổng giá sản phẩm</span>
                <span>{getSubtotal().toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Voucher</span>
                <span>
                  {selectedVoucher
                    ? `${(getSubtotal() * (selectedVoucher.voucher_discount / 100)).toLocaleString("vi-VN")}đ`
                    : "0đ"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="text-red-500 font-bold">
                  {getTotalPrice().toLocaleString("vi-VN")}đ
                </span>
              </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      {currentStep === 1 && (
        <div className="flex flex-col md:flex-row w-11/12 mx-auto my-10">
          <div className="w-full md:w-1/2 p-4">
            <Card className="shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-500">
                Phương thức vận chuyển
              </h2>
              <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item name="shippingMethod" label="Phương thức vận chuyển">
                  <Radio.Group
                    // onChange={handleShippingChange}
                    value={shippingMethod}
                  >
                    <div className="flex flex-col">
                      {/* <Radio value="standard">Tiêu chuẩn </Radio> */}
                      <Radio value="express">Online</Radio>
                      <Radio value="premium">Nhận vé tại sự kiện</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
                <Divider />
                
                <h2 className="text-xl font-bold mb-4 text-blue-500">
                  Phương thức thanh toán
                </h2>
                <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                  <Radio.Group
                    onChange={handlePaymentChange}
                    value={paymentMethod}
                  >
                    <div className="flex flex-col">
                      {/* <Radio value="cod">
                        Thanh toán tiền mặt khi nhận hàng
                      </Radio> */}
                      <Radio value="vnpay">VNPAY</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <Input.TextArea placeholder="Ghi chú đơn hàng" />
                </Form.Item>
                {/* <Form.Item
                  name="confirm"
                  valuePropName="checked"
                  className="m-0"
                >
                  <Checkbox>Không cần gọi xác nhận đặt hàng</Checkbox>
                </Form.Item> */}
                <Form.Item
                  className="m-0"
                  name="terms"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Bạn phải đồng ý với các điều khoản")
                            ),
                    },
                  ]}
                >
                  <Radio>Tôi đồng ý với các điều khoản</Radio>
                </Form.Item>
                {/* <Form.Item name="privacy" valuePropName="checked">
                  <Checkbox>
                    Kids Plaza cam kết bảo mật thông tin khách hàng
                  </Checkbox>
                </Form.Item> */}
                <Button
                  className="w-full h-12"
                  type="primary"
                  htmlType="submit"
                  onFinish={handleFormSubmit}
                >
                  Đặt hàng
                </Button>
              </Form>
            </Card>
          </div>
          <div className="w-full md:w-1/2 p-4">
            <Card className="shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-500">Giao tới</h2>
              <div className="mb-4">
                <p className="font-bold">{formData.name}</p>
                <p>
                  {formData.address}, {formData.ward}, {formData.district},{" "}
                  {formData.province}
                </p>
                <p>{formData.phone}</p>
                <a href="#" className="text-blue-500">
                  Thay đổi
                </a>
              </div>
              <h2 className="text-xl font-bold mb-4 text-blue-500">Giỏ hàng</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center mb-4">
                  <img
                    src={`http://localhost:5000/${item.productId?.image}`}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-bold">{item.productId.name}</p>
                    <p>
                      {item.productId.regular_price.toLocaleString("vi-VN")}đ x
                      {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Tổng giá sản phẩm</span>
                  <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Phí vận chuyển</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Tạm tính</span>
                  <span className="text-red-500">
                    {getTotalPrice().toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex flex-col items-center justify-center h-64">
          <CheckCircleOutlined style={{ fontSize: "64px", color: "green" }} />
          <h2 className="text-2xl font-bold my-4">
            Đơn hàng đã được đặt thành công!
          </h2>
          <Button type="primary" onClick={handleBackToHome}>
            Về trang chủ
          </Button>
        </div>
      )}
    </>
  );
}
