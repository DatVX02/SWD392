import { useEffect, useState } from "react";
import Information from "./Information";
import { renderProducts } from "../utils/Utils";
import { Button, Rate, Pagination } from "antd";
import { Link } from "react-router-dom";

export default function ListProduct() {
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showCapacityFilter, setShowCapacityFilter] = useState(false);
  const [showOriginFilter, setShowOriginFilter] = useState(false);
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [showSizeFilter, setShowSizeFilter] = useState(false);
  const [showWeightFilter, setShowWeightFilter] = useState(false);
  const [productsHot, setProductsHot] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (page) => {
    setCurrentPage(page);
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", " VND");
  };
  const togglePriceFilter = () => setShowPriceFilter(!showPriceFilter);
  const toggleCapacityFilter = () => setShowCapacityFilter(!showCapacityFilter);
  const toggleOriginFilter = () => setShowOriginFilter(!showOriginFilter);
  const toggleBrandFilter = () => setShowBrandFilter(!showBrandFilter);
  const toggleAgeFilter = () => setShowAgeFilter(!showAgeFilter);
  const toggleSizeFilter = () => setShowSizeFilter(!showSizeFilter);
  const toggleWeightFilter = () => setShowWeightFilter(!showWeightFilter);

  const origin = [
    { name: "Ba Lan", value: "Ba Lan" },
    { name: "Hàn Quốc", value: "Hàn Quốc" },
    { name: "Nam Phi ", value: "Nam Phi" },
    { name: "Nhật Bản", value: "Nhật Bản" },
    { name: "Singapore ", value: "Singapore" },
    { name: "Thái Lan ", value: "Thái Lan" },
    { name: "Thụy Sĩ", value: "Thụy Sĩ" },
    { name: "Trung Quốc ", value: "Trung Quốc" },
    { name: "Úc", value: "Úc" },
    { name: "Việt Nam ", value: "Việt Nam" },
  ];

  const branch = [
    { name: "Degrees", value: "Degrees" },
    { name: "Abbott", value: "Abbott" },
    { name: "Anpaso", value: "Anpaso" },
    { name: "Bio-Oil", value: "Bio-Oil" },
    { name: "Fatz baby", value: "Fatz baby" },
    { name: "KidsPlaza", value: "KidsPlaza" },
    { name: "Kumanoyushi", value: "Kumanoyushi" },
    { name: "Mamago", value: "Mamago" },
    { name: "Medela", value: "Medela" },
    { name: "Morinaga", value: "Morinaga" },
    { name: "Sunmate", value: "Sunmate" },
    { name: "Unimom", value: "Unimom" },
    { name: "SABINA", value: "SABINA" },
  ];

  const age = [
    { name: "0M+", value: "0M+" },
    { name: "0-6M", value: "0-6M" },
    { name: "3M+", value: "3M+" },
    { name: "3-6M", value: "3-6M" },
    { name: "7-10M", value: "7-10M" },
    { name: "1Y+", value: "1Y+" },
    { name: "3Y+", value: "3Y+" },
  ];

  const size = [
    { name: "S38", value: "S38" },
    { name: "S40", value: "S40" },
    { name: "S42", value: "S42" },
    { name: "S", value: "S" },
    { name: "M", value: "M" },
    { name: "L", value: "L" },
    { name: "XL", value: "XL" },
    { name: "XXL", value: "XXL" },
  ];

  const weight = [
    { name: "7g", value: "7g" },
    { name: "20g", value: "20g" },
    { name: "36g", value: "36g" },
    { name: "100g", value: "100g" },
    { name: "180g", value: "180g" },
    { name: "216g", value: "216g" },
    { name: "250g", value: "250g" },
    { name: "350g", value: "350g" },
    { name: "400g", value: "400g" },
    { name: "450g", value: "450g" },
    { name: "500g", value: "500g" },
    { name: "800g", value: "800g" },
    { name: "830g", value: "830g" },
    { name: "900g", value: "900g" },
    { name: "3kg", value: "3kg" },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setProductsHot(shuffled.slice(4, 8));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col items-center bg-gray-100 p-4 ">
        <div className="bg-white p-4 rounded-t-lg border-b w-11/12">
          <h1 className="text-xl font-bold">Mẹ bầu và sau sinh</h1>
          <p className="mt-2 text-gray-600">
            Kidsplaza cung cấp đầy đủ các sản phẩm cần thiết cho mẹ bầu và sau
            sinh như sữa bầu, quần áo bầu, vitamin, máy hút sữa...giúp việc mang
            thai và nuôi con trở nên đơn giản hơn.
          </p>
        </div>
        <div className="bg-white p-4 rounded-b-lg shadow-md w-11/12">
          <img
            src="https://cdn-v2.kidsplaza.vn/media/catalog/category/banner_danh_m_c_sap_sinh_t5_1.png"
            alt="Banner"
            className="w-full h-auto rounded-lg"
          />
          <div className="flex justify-around mt-6">
            <div className="text-center w-1/5">
              <img
                src="https://cdn-v2.kidsplaza.vn/media/catalog/category/sua-cho-me-bau.jpg"
                alt="Product 1"
                className="mx-auto"
              />
              <p className="mt-2">Sữa cho mẹ bầu</p>
            </div>
            <div className="text-center w-1/5">
              <img
                src="https://cdn-v2.kidsplaza.vn/media/catalog/category/bo-nao-healthy-care-ginkgo-biloba-2000-12y-1_1.png"
                alt="Product 2"
                className="mx-auto"
              />
              <p className="mt-2">Vitamin cho mẹ bầu và mẹ sau sinh</p>
            </div>
            <div className="text-center w-1/5">
              <img
                src="https://cdn-v2.kidsplaza.vn/media/catalog/category/bo-quan-ao-sau-sinh-cho-me-in-tim-co-ren-xanh-m23-1.png"
                alt="Product 3"
                className="mx-auto"
              />
              <p className="mt-2">Quần áo mẹ bầu và sau sinh</p>
            </div>
            <div className="text-center w-1/5">
              <img
                src="https://cdn-v2.kidsplaza.vn/media/catalog/category/may-hut-sua-cho-be.png"
                alt="Product 4"
                className="mx-auto"
              />
              <p className="mt-2">Máy hút sữa</p>
            </div>
            <div className="text-center w-1/5">
              <img
                src="https://cdn-v2.kidsplaza.vn/media/catalog/category/tui-tru-sua-sunmum-50pcs-mau-moi-1.png"
                alt="Product 5"
                className="mx-auto"
              />
              <p className="mt-2">Túi trữ sữa</p>
            </div>
          </div>
        </div>
        <div className="bg-white-100 my-10 w-11/12">
          <div className="bg-white p-4 rounded-t-lg flex justify-between items-center border-b">
            <h1 className="text-2xl font-bold">SẢN PHẨM BÁN CHẠY</h1>
          </div>
          <div className="bg-white p-4 rounded-b-lg shadow-md">
            {renderProducts(productsHot)}
          </div>
        </div>
        <div className="bg-gray-100 flex w-11/12">
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Bộ lọc tìm kiếm</h2>
            <div className="mb-4">
              <h3
                className="font-bold text-xl cursor-pointer mb-3"
                onClick={togglePriceFilter}
              >
                Khoảng giá
              </h3>
              {showPriceFilter && (
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Từ"
                      className="border p-2 rounded mr-2 w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="Đến"
                      className="border p-2 rounded w-1/2"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 w-full">
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <h3
                className="font-bold text-xl cursor-pointer mb-4"
                onClick={toggleCapacityFilter}
              >
                Dung tích
              </h3>
              {showCapacityFilter && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "25ml",
                    "60ml",
                    "100ml",
                    "125ml",
                    "150ml",
                    "160ml",
                    "180ml",
                    "190ml",
                    "200ml",
                    "210ml",
                    "250ml",
                    "550ml",
                    "600ml",
                    "1000ml",
                  ].map((size) => (
                    <button
                      key={size}
                      className="bg-transparent border border-black text-black font-bold py-2 px-4 rounded"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-4">
              <h3
                className="font-bold text-xl cursor-pointer mb-4"
                onClick={toggleOriginFilter}
              >
                Xuất xứ
              </h3>
              {showOriginFilter && (
                <div className="grid grid-cols-1 gap-3">
                  {origin.map((origin, index) => (
                    <label key={index} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-orange-500"
                        value={origin.value}
                      />
                      <span className="ml-2 text-black">{origin.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <h3
              className="font-bold text-xl cursor-pointer mb-4"
              onClick={toggleBrandFilter}
            >
              Thương hiệu
            </h3>
            {showBrandFilter && (
              <div className="grid grid-cols-1 gap-3 mb-4 ">
                {branch.map((branch, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-500"
                      value={branch.value}
                    />
                    <span className="ml-2 text-black">{branch.name}</span>
                  </label>
                ))}
              </div>
            )}
            <h3
              className="font-bold text-xl cursor-pointer mb-4"
              onClick={toggleAgeFilter}
            >
              Độ tuổi
            </h3>
            {showAgeFilter && (
              <div className="grid grid-cols-1 gap-3">
                {age.map((age, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-500"
                      value={age.value}
                    />
                    <span className="ml-2 text-black">{age.name}</span>
                  </label>
                ))}
              </div>
            )}
            <h3
              className="font-bold text-xl cursor-pointer mb-4"
              onClick={toggleSizeFilter}
            >
              Kích thước
            </h3>
            {showSizeFilter && (
              <div className="grid grid-cols-1 gap-3">
                {size.map((size, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-500"
                      value={size.value}
                    />
                    <span className="ml-2 text-black">{size.name}</span>
                  </label>
                ))}
              </div>
            )}
            <h3
              className="font-bold text-xl cursor-pointer mb-4"
              onClick={toggleWeightFilter}
            >
              Khối lượng
            </h3>
            {showWeightFilter && (
              <div className="grid grid-cols-1 gap-3">
                {weight.map((weight, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-500"
                      value={weight.value}
                    />
                    <span className="ml-2 text-black">{weight.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="w-3/4 ml-4">
            <div className="bg-white p-4 rounded-t-lg border-b flex justify-between items-center">
              <h1 className="text-xl font-bold"></h1>
              <div className="flex items-center space-x-4">
                <p>Sắp xếp theo</p>
                {[
                  "Vị trí",
                  "Bán chạy",
                  "Giá tăng dần",
                  "Nổi bật",
                  "Mới nhất",
                ].map((buttonName) => (
                  <Button
                    key={buttonName}
                    onClick={() => handleButtonClick(buttonName)}
                    style={{
                      backgroundColor:
                        selectedButton === buttonName ? "#1890ff" : "#f0f0f0",
                      color: selectedButton === buttonName ? "#fff" : "#000",
                      borderRadius: "4px",
                      padding: "4px 16px",
                    }}
                  >
                    {buttonName}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-b-lg shadow-md">
              <div className="grid grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                  <Link
                    to={`/product-detail/${product._id}`}
                    key={product.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md text-center"
                  >
                    <img
                      src={`http://localhost:5000/${product.image}`}
                      alt={product.name}
                      className="mx-auto"
                    />
                    <p className="mt-2">{product.name}</p>
                    <div className="flex justify-center items-center mt-2">
                      <Rate disabled defaultValue={product.rating} />
                      <span className="text-gray-500 ml-2">
                        {product.reviews}
                      </span>
                    </div>
                    <div className="text-red-500 font-bold text-xl mt-2">
                      {formatPrice(product.regular_price)}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="w-full my-10 flex items-start justify-center">
                <Pagination
                  current={currentPage}
                  onChange={paginate}
                  total={products.length}
                  pageSize={productsPerPage}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </div>
        </div>
        <Information />
      </div>
    </>
  );
}
