Cách chạy:

File Backend (milkstore-server):
B1: cd .\milkstore-server\
B2: npm i
B3: npm start
File Frontend (BeBe-MilkStore):
B1: cd BeBe-MilkStore
B2: npm i
B3: npm run dev
Chạy được chương trình tải nodejs. Link tải: https://nodejs.org/en

Product.json:
[{
  "_id": {
    "$oid": "6673e5b42c4a0fd0b09dc9e4"
  },
  "name": "BẾN THÀNH - Đêm nhạc Birthday show Bạch Công Khanh",
  "image": "uploads\\Ben thanh.png",
  "regular_price": 850000,
  "sale_price": 800000,
  "brand": "Bến Thành",
  "description": "Phòng trà Bến Thành có phục vụ F&B, vui lòng không mang đồ ăn thức uống từ ngoài vào",
  "SKU": "1A",
  "reviews": 0,
  "ratingBreakdown": {
    "fiveStar": 0,
    "fourStar": 0,
    "threeStar": 0,
    "twoStar": 0,
    "oneStar": 0
  },
  "category": "Vé ca nhạc",
  "available": 12,
  "stock": 12,
  "status": "Coming-Soon",
  "createdAt": {
    "$date": "2024-06-20T08:17:56.049Z"
  },
  "updatedAt": {
    "$date": "2024-06-20T08:17:56.049Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "6673e8282c4a0fd0b09dca13"
  },
  "name": "YÊU HOÀ BÌNH 2024",
  "image": "uploads\\Yeu hoa binh.png",
  "regular_price": 490000,
  "sale_price": 480000,
  "brand": "CÔNG TY CỔ PHẦN SỰ KIỆN VÀ TRUYỀN THÔNG ZONE B",
  "description": "YÊU HOÀ BÌNH 2024 - MANIFEST NHỮNG GIẤC MƠ ĐỜI MÌNH",
  "SKU": "11A",
  "reviews": 0,
  "ratingBreakdown": {
    "fiveStar": 0,
    "fourStar": 0,
    "threeStar": 0,
    "twoStar": 0,
    "oneStar": 0
  },
  "category": "Vé ca nhạc",
  "available": 200,
  "stock": 200,
  "status": "Coming-Soon",
  "createdAt": {
    "$date": "2024-06-20T08:28:24.431Z"
  },
  "updatedAt": {
    "$date": "2024-06-20T08:28:24.431Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "6674140f00af5a29211c2b78"
  },
  "name": "Nhà Hát THANH NIÊN] Hài Kịch: Đại Hội Yêu Quái - 7 Con Yêu Nhền Nhện",
  "image": "uploads\\Nhahat.png",
  "regular_price": 300000,
  "sale_price": 250000,
  "brand": "Nhà Hát Kịch IDECAF",
  "description": "Tác giả: Nguyễn Duy Xăng - Hiếu Nghĩa",
  "SKU": "153C",
  "reviews": 0,
  "ratingBreakdown": {
    "fiveStar": 0,
    "fourStar": 0,
    "threeStar": 0,
    "twoStar": 0,
    "oneStar": 0
  },
  "category": "Vé hài kịch",
  "available": 12,
  "stock": 12,
  "status": "Coming-Soon",
  "createdAt": {
    "$date": "2024-06-20T11:35:43.419Z"
  },
  "updatedAt": {
    "$date": "2024-06-20T11:35:43.419Z"
  },
  "__v": 0
}]

users.json:
[{
  "_id": {
    "$oid": "6673e33b2c4a0fd0b09dc9c7"
  },
  "fullName": "staff1",
  "phone_number": "0234567412",
  "email": "staff1@gmail.com",
  "password": "$2b$10$SyoMkVN8qOJ7g6cgSA96FuMaZhi5ysaBL1XImxcPV5dnpX.XssDlS",
  "role": "Staff",
  "status": true,
  "createdAt": {
    "$date": "2024-06-20T08:07:23.612Z"
  },
  "updatedAt": {
    "$date": "2024-07-07T13:21:46.394Z"
  },
  "__v": 0,
  "dob": {
    "$date": "2000-12-07T17:00:00.000Z"
  },
  "gender": "Male"
},
{
  "_id": {
    "$oid": "6673e3c82c4a0fd0b09dc9cb"
  },
  "fullName": "admin",
  "phone_number": "0123456789",
  "email": "admin@gmail.com",
  "password": "$2b$10$XSH0E7P.cpRJxLqCi0CcEO/wHxuvZ3ZBAUNNzW.hvRZWfoqm0BAOy",
  "role": "Admin",
  "status": true,
  "createdAt": {
    "$date": "2024-06-20T08:09:44.520Z"
  },
  "updatedAt": {
    "$date": "2024-06-20T08:09:44.520Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "6673e41d2c4a0fd0b09dc9cf"
  },
  "fullName": "user1",
  "phone_number": "0123456712",
  "email": "user1@gmail.com",
  "password": "$2b$10$.HLL14VEQcZ04i6dFZOT5.rLzmxmK.FRclvgG9iehuK2kt8eDZFZ6",
  "role": "Customer",
  "status": true,
  "createdAt": {
    "$date": "2024-06-20T08:11:09.688Z"
  },
  "updatedAt": {
    "$date": "2024-10-31T17:07:03.587Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "6686f1f4404fa8fa2201003a"
  },
  "fullName": "staff2",
  "phone_number": "0321456987",
  "email": "staff2@gmail.com",
  "password": "$2b$10$dxCOc06J7.JmxpU2SG5fLe.wyNsDxEUdFyJMUgbyIFsV0IaJPesli",
  "role": "Staff",
  "status": true,
  "createdAt": {
    "$date": "2024-07-04T19:03:16.233Z"
  },
  "updatedAt": {
    "$date": "2024-07-04T19:03:16.233Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "668a93c08ce18565ef578dd8"
  },
  "fullName": "user3",
  "phone_number": "0123695489",
  "email": "user3@gmail.com",
  "password": "$2b$10$byH5ZncodVnq6X7FwHAMceLfSgkXioD9KbIi5u4VAZjX9e7AHMCH2",
  "role": "Customer",
  "status": true,
  "createdAt": {
    "$date": "2024-07-07T13:10:24.430Z"
  },
  "updatedAt": {
    "$date": "2024-07-07T13:10:24.430Z"
  },
  "__v": 0
}]

vouchers.json
[{
  "_id": {
    "$oid": "668a95378ce18565ef578e26"
  },
  "voucherCode": "giữa năm",
  "voucherName": "Siêu sale Giữa năm",
  "description": "Giảm giá ",
  "startDay": {
    "$date": "2024-07-05T00:00:00.000Z"
  },
  "endDay": {
    "$date": "2024-07-20T00:00:00.000Z"
  },
  "voucher_discount": 40,
  "__v": 0
},
{
  "_id": {
    "$oid": "668f33a0b9dad170742c7e9b"
  },
  "voucherCode": "Siêu sale tháng 7",
  "voucherName": "Siêu Sale tháng 7",
  "description": "Big Sale Tháng 7 với nhiều Ưu đãi",
  "startDay": {
    "$date": "2024-07-10T00:00:00.000Z"
  },
  "endDay": {
    "$date": "2024-07-19T00:00:00.000Z"
  },
  "voucher_discount": 20,
  "__v": 0
},
{
  "_id": {
    "$oid": "66947bb72cb34bb20fca5d3a"
  },
  "voucherCode": "Sale giữa Năm",
  "voucherName": "tháng 7-8",
  "description": "Sale giữa năm",
  "startDay": {
    "$date": "2024-07-15T00:00:00.000Z"
  },
  "endDay": {
    "$date": "2024-08-02T00:00:00.000Z"
  },
  "voucher_discount": 30,
  "__v": 0
}]
