import React, { useState } from "react";
import { Button, Input, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.agreeTerms) {
      message.error("Please agree to the terms and conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone_number: formData.phone_number,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success("Registration successful");
        navigate("/login");
      } else {
        const errorData = await response.json();
        message.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering");
    }
  };

  return (
    <div className="px-20 my-10 bg-white">
      <div className="flex justify-center items-center">
        <img
          className="absolute z-0 top-[180px]"
          src="./public/assets/images/image 83.png"
          alt="login"
        />
      </div>
      <div className="flex justify-center items-center h-screen bg-gray-100 mt-20">
        <div className="bg-white rounded-lg shadow-lg w-1/3 z-10">
          <div className="flex">
            <Link
              to="/login"
              className="w-1/2 text-center py-6 bg-gray-200 rounded-s-md"
            >
              <h2 className="text-2xl font-bold text-blue-900">ĐĂNG NHẬP</h2>
            </Link>
            <div className="w-1/2 text-center py-6 bg-yellow-400  rounded-e-md">
              <h2 className="text-2xl font-bold text-blue-900">ĐĂNG KÝ</h2>
            </div>
          </div>
          <div className="flex flex-col items-center mx-12 my-8 w-5/6">
            <Input
              className="mb-4 w-full"
              placeholder="Họ và tên"
              size="large"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              className="mb-4 w-full"
              placeholder="Số điện thoại"
              size="large"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
            <Input
              className="mb-4 w-full"
              placeholder="Email"
              type="email"
              size="large"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input.Password
              className="mb-4 w-full"
              placeholder="Mật khẩu*"
              size="large"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Input.Password
              className="mb-4 w-full"
              placeholder="Xác nhận lại mật khẩu*"
              size="large"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Checkbox
              className="mb-4"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            >
              Tôi đã đọc và đồng ý với các điều khoản sử dụng.
            </Checkbox>
            <Button
              type="primary"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded mb-2"
              size="large"
              onClick={handleSubmit}
            >
              ĐĂNG KÝ
            </Button>
            <div className="flex items-center my-4 w-full">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">Hoặc đăng nhập bằng</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <Button
              type="primary"
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded mb-10"
              size="large"
            >
              GOOGLE
            </Button>
            <Button
              type="primary"
              className="w-full bg-blue-700 text-white font-bold py-2 rounded"
              size="large"
            >
              FACEBOOK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
