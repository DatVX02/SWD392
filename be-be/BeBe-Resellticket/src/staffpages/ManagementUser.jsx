import { useState, useEffect } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

const ManagementUser = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        setDataSource(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "User Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Detail",
      key: "detail",
      render: (record) => (
        <Link to={`/staff/management-user/user-detail/${record._id}`}>
          Detail
        </Link>
      ),
    },
    // {
    //   title: "Order",
    //   key: "order",
    //   render: (record) => (
    //     <Link to={`/staff/management-user/user-orders/${record._id}`}>
    //       View Order
    //     </Link>
    //   ),
    // },
  ];

  return (
    <div className="p-4 mx-6 my-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="ml-4 text-2xl font-bold">All Customers</h1>
          <Breadcrumb className="ml-4 text-gray-600">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>All Customers</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default ManagementUser;
