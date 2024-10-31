import { Rate } from "antd";
import { Link } from "react-router-dom";

export const renderProducts = (products) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", " VND");
  };
  return (
    <div className="flex flex-wrap justify-around">
      {products.map((product) => (
        <Link
          to={`/product-detail/${product._id}`}
          key={product.id}
          className="w-1/5 m-4 text-center rounded-lg shadow-md"
          // onClick={() => onClick(product.id)}
        >
          <img
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
            className="mx-auto"
          />
          <p className="mx-10 mt-2">{product.name}</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <Rate disabled defaultValue={product.rating} />
            <span>({product.reviews})</span>
          </div>
          <div className="mt-2 text-xl font-bold text-red-500">
            {formatPrice(product.regular_price)}
          </div>
          {/* <div className="text-gray-500 line-through">{product.price} VND</div> */}
        </Link>
      ))}
    </div>
  );
};
