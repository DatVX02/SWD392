import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white">
      {/* <div className="flex justify-between bg-white-100 mx-20">
        <span className="flex justify-between space-x-2">
          <LocationOnIcon />
          Xem tồn kho <strong className="text-blue-600">Miền Nam</strong>
        </span>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <StorefrontOutlinedIcon />
            <span>Hệ thống cửa hàng</span>
          </div>
          <span>
            <LocalPhoneIcon />
            1900 8198
          </span>
        </div>
      </div> */}

      <div className="bg-[#2DC275] w-full">
        <div className="flex items-center justify-between mx-20 bg-[#2DC275] rounded-b-[40px] px-2">
          <Input
            placeholder="Tìm kiếm sản phẩm"
            prefix={<SearchIcon />}
            className="w-96"
          />
          <Link to="/">
            <img
              src="/assets/images/image.jpg"
              alt="Logo"
              className="h-20 w-fit rounded-3xl mt-2 mb-2"
            />
          </Link>
          <div className="flex  items-center space-x-10">
            <Link to="/order-history">
              <Button
                type="text"
                icon={<ListAltOutlinedIcon />}
                className="text-white hover:text-gray-200"
              >
                Đơn hàng
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/profile">
                  <Button
                    type="text"
                    className="text-white hover:text-gray-200"
                  >
                    Xin chào, {user.name}
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button
                  type="text"
                  icon={<AccountCircleOutlinedIcon />}
                  className="text-white hover:text-gray-200"
                >
                  Đăng nhập
                </Button>
              </Link>
            )}

            <Link to="/cart">
              <Button
                type="text"
                icon={<ShoppingCartIcon />}
                className="text-white hover:text-gray-200"
              >
                Giỏ hàng
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center mx-60 ">
          <Link to="/">
            <Button type="text" className="text-white">Trang chủ</Button>
          </Link>
          <Link to="/list-product" >
            <Button type="text" className="text-white">Sản phẩm</Button>
          </Link>
          <Button type="text" className="text-white">Tin tức</Button>
          <Button type="text" className="text-white">Liên hệ</Button>
        </div>
      </div>
    </header>
  );
}
