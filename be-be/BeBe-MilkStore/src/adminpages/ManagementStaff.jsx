import React, { useState, useEffect } from "react";
import { Button, Table, Modal, message } from "antd";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

const { confirm } = Modal;

const handleAction = (record) => {
  console.log("Button clicked for record: ", record);
};

const ManagementStaff = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch staff data");
        }
        const staffData = await response.json();

        // Xử lý định dạng ngày sinh để chỉ chứa ngày, không chứa thời gian nếu có ngày sinh
        const formattedStaffData = staffData.map((staff) => ({
          ...staff,
          dob: staff.dob ? staff.dob.split("T")[0] : staff.dob,
        }));

        setDataSource(formattedStaffData);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffs();
  }, []);

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this staff?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await fetch(
            `http://localhost:5000/api/users/${record._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete staff");
          }
          message.success("Staff deleted successfully");
          setDataSource(dataSource.filter((staff) => staff._id !== record._id));
        } catch (error) {
          console.error("Error deleting staff:", error);
          message.error("Failed to delete staff");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date Of Birth",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Edit",
      key: "edit",
      render: (text, record) => (
        <Link
          to={`/admin/staff-detail/${record._id}`}
          onClick={() => handleAction(record)}
        >
          Edit
        </Link>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (text, record) => (
        <Button type="danger" onClick={() => showDeleteConfirm(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-6 p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold ml-4">All Staff</h1>
          <Breadcrumb className="text-gray-600 ml-4">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>All Staff</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="_id" />
    </div>
  );
};

export default ManagementStaff;
