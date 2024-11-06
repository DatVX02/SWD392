import React, { useState, useEffect } from "react";
import { Table, Tag, Breadcrumb, Button, Menu, Dropdown } from "antd";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const formattedOrderData = data.map((order) => ({
          ...order,
          createdAt: order.createdAt
            ? order.createdAt.split("T")[0]
            : order.createdAt,
        }));
        setOrders(formattedOrderData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Xử lý lỗi, ví dụ hiển thị thông báo lỗi cho người dùng
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleMenuClick = (action, record) => {
    if (action === "view") {
      console.log(`Viewing Order ID: ${record.orderId}`);
    } else {
      handleStatusChange(record, action);
    }
  };

  const handleStatusChange = async (record, status) => {
    console.log(`Changing status to ${status} for Order ID: ${record._id}`);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${record._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === record._id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      // Handle error, e.g., show notification to user
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "orderId",
    },
    {
      title: "Customer Name",
      dataIndex: "shippingInfo",
      key: "customerName",
      render: (shippingInfo) => (shippingInfo ? shippingInfo.name : ""),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          // case "Pending":
          //   color = "orange";
          //   break;
          case "Processing":
            color = "blue";
            break;
          // case "Shipped":
          //   color = "green";
          //   break;
          // case "Delitvered":
          //   color = "cyan";
          //   break;
          case "Completed":
            color = "green";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "total",
      key: "amount",
      render: (text) => `${text.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const menu = (
          <Menu onClick={({ key }) => handleMenuClick(key, record)}>
            <Menu.Item key="view">
              <Link to={`/staff/order-list/order-detail/${record._id}`}>
                View Detail
              </Link>
            </Menu.Item>
            <Menu.SubMenu key="changeStatus" title="Change Status">
              <Menu.Item key="Completed">Completed</Menu.Item>
              <Menu.Item key="Processing">Processing</Menu.Item>
              {/* <Menu.Item key="Shipped">Shipped</Menu.Item>
              <Menu.Item key="Delivered">Delivered</Menu.Item>
              <Menu.Item key="Cancelled">Cancel</Menu.Item> */}
            </Menu.SubMenu>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="default" className="border-0">
              <MoreVertIcon className="h-6 w-6 " />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="mx-6 p-4 my-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Order List</h1>
          <Breadcrumb className="text-gray-600">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Order List</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Table dataSource={orders} columns={columns} loading={loading} />
      </div>
    </>
  );
};

export default OrderList;
