import { Rate } from "antd";
import { Link } from "react-router-dom";

export const renderProducts = (products) => (
  <div className="flex flex-wrap justify-around">
    {products.map((product) => (
      <Link
        to={`/product-detail/${product._id}`}
        key={product.id}
        className="rounded-lg shadow-md w-1/5 text-center m-4"
        // onClick={() => onClick(product.id)}
      >
        <img
          src={`http://localhost:5000/${product.image}`}
          alt={product.name}
          className="mx-auto"
        />
        <p className="mt-2 mx-10">{product.name}</p>
        <div className="flex justify-center items-center space-x-2 mt-2">
          <Rate disabled defaultValue={product.rating} />
          <span>({product.reviews})</span>
        </div>
        <div className="text-red-500 font-bold text-xl mt-2">
          {product.price}VND
        </div>
        {/* <div className="text-gray-500 line-through">{product.price} VND</div> */}
      </Link>
    ))}
  </div>
);
