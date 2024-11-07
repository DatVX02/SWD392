import { useState, useEffect } from "react";
import { Button, InputNumber, Input, Card, Modal, List } from "antd";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
  addToCart,
} from "../features/cart/CartSlice";
import { message } from "antd";

export default function Cart() {
  const [discountCode, setDiscountCode] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const dispatch = useDispatch();

  const reduxCartItems = useSelector((state) => state.cart.items);

  // Fetch cart items from backend
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

  const fetchVouchers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/api/vouchers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch vouchers. Status: ${response.status}`);
      }
      const data = await response.json();
      setVouchers(data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleQuantityChange = async (value, itemId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/carts/${itemId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: value }),
          }
        );
        if (!response.ok) {
          throw new Error(
            `Failed to update quantity. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setCartItems(data.items);
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: value }));
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/carts/${itemId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to remove item. Status: ${response.status}`);
        }
        const data = await response.json();
        setCartItems(data.items);
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      dispatch(removeFromCart(itemId));
    }
  };

  const handleDiscountCodeChange = (e) => {
    setDiscountCode(e.target.value);
  };

  useEffect(() => {
    if (selectedVoucher) {
      localStorage.setItem("selectedVoucher", JSON.stringify(selectedVoucher));
      message.success("Voucher applied successfully");
    }
  }, [selectedVoucher]);

  const handleApplyDiscount = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (discountCode !== "") {
        const response = await fetch(
          `http://localhost:5000/api/vouchers/voucherCode/${discountCode}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch voucher. Status: ${response.status}`
          );
        }
        const voucher = await response.json();
        setSelectedVoucher(voucher);
      } else {
        throw new Error("Failed to apply voucher");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      message.error("Failed to apply voucher");
    }
  };

  const handleCheckout = () => {
    console.log("Proceed to checkout");
    if (selectedVoucher == null) {
      localStorage.setItem("selectedVoucher", JSON.stringify(null));
    }
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

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.regular_price * item.quantity,
      0
    );
  };
  
  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    return selectedVoucher ? subtotal * (1 - selectedVoucher.voucher_discount / 100) : subtotal;
  };
  
  return (
    <div className="flex flex-col items-center w-11/12 mx-auto my-10">
      <div className="bg-white-100 my-10 w-11/12 flex space-x-4">
        <Card className="w-full md:w-2/3 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-blue-500">Giỏ hàng</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-4">
              <div className="flex flex-col">
                <span className="font-bold text-blue-500 mb-4 text-center">Sản phẩm</span>
                <div className="flex">
                  <img
                    src={`http://localhost:5000/${item.productId?.image}`}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover mr-4"
                  />
                  <h3 className="text-lg font-semibold">
                    {item.productId.name}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-blue-500 mb-5 text-center">Giá</span>
                <p className="text-red-500 font-bold mr-4">
                  {/* {item.productId.regular_price} VND */}
                  {(
                    item.productId.regular_price
                  ).toLocaleString("vi-VN")}{" "}VND
                </p>
              </div>
              <div className="flex flex-col ">
                <span className="font-bold text-blue-500 mb-4 text-center">Số lượng</span>
                <InputNumber
                  min={1}
                  value={item.quantity}
                  onChange={(value) =>
                    handleQuantityChange(value, item.productId._id)
                  }
                  className="mr-4 text-center"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-blue-500 mb-5 text-center">Thành tiền</span>
                <p className="text-red-500 font-bold mr-4">
                  {(
                    item.productId.regular_price * item.quantity
                  ).toLocaleString("vi-VN")}{" "}VND
                </p>
              </div>
              <Button
                type="link"
                onClick={() => handleRemoveFromCart(item.productId._id)}
                className="mt-9"
              >
                Xóa
              </Button>
            </div>
          ))}
        </Card>
        <div className="flex flex-col space-y-4">
          <Card className="w-full p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Mã giảm giá</h2>
            <Input
              placeholder="Nhập mã"
              value={discountCode}
              onChange={handleDiscountCodeChange}
              className="mb-2"
              suffix={
                <Button type="primary" onClick={handleApplyDiscount}>
                  Áp dụng
                </Button>
              }
            />
            <Button
              type="default"
              className="mb-4 w-full"
              onClick={() => {
                setIsVoucherModalVisible(true);
                fetchVouchers();
              }}
            >
              CHỌN MÃ
            </Button>
          </Card>
          <Card className="w-full p-4 bg-white rounded-lg shadow-md">
            <div className="flex flex-col space-y-4">
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
              <Link to="/payment">
                <Button
                  to="/payment"
                  type="primary"
                  onClick={handleCheckout}
                  className="w-full"
                >
                  Tiến hành thanh toán
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        title="Chọn mã giảm giá"
        visible={isVoucherModalVisible}
        onCancel={() => setIsVoucherModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={vouchers}
          renderItem={(voucher) => (
            <List.Item
              onClick={() => {
                setSelectedVoucher(voucher);
                setIsVoucherModalVisible(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                title={`Voucher Code: ${voucher.voucherCode}`}
                description={
                  <div>
                    <div>{`Voucher Name: ${voucher.voucherName}`}</div>
                    <div>{`${voucher.voucher_discount}% off`}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}
