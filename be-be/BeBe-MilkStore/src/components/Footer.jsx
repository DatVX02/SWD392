// import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import { QRCode } from "antd";
import { Input, Button } from "antd";

export default function Footer() {
  return (
    <>
      <Box className="bg-[#2DC275] text-white py-4">
        <Container>
          <div className="flex space-x-10">
            <div className="flex-col space-y-4 my-4">
              <div className="flex items-center space-x-16">
                <Typography>Email</Typography>
                <Typography>
                  <PhoneIcon /> Ticketreuse@gmail.com
                </Typography>
                <Typography>(8h00 - 21h00)</Typography>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: "white" }} />
                {/* <div className="flex items-center space-x-20"> */}
                <Typography>Tư vấn khách hàng</Typography>
                <Typography>
                  <PhoneIcon /> 1800.xxxx
                </Typography>
                <Typography>(8h00 - 21h00)</Typography>
                {/* </div> */}</div>
            </div>

            {/* <div>
              <Typography variant="h6" gutterBottom className="mr-4">
                Nhận tin khuyến mãi & quà
              </Typography>
              <div className="flex space-x-2">
                <Input
                  placeholder="Nhập địa chỉ giao hàng"
                  suffix={<Button>ĐĂNG KÝ</Button>}
                />
              </div>
            </div> */}
          </div>
        </Container>
      </Box>

      <Box className="bg-white text-black py-8">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <Typography variant="h7" className="text-[#DF4E21] mb-4">
                Công Ty Cổ Phần Chú Bé Đần
              </Typography>
              <Typography>Tập đoàn CBD</Typography>
              <Typography>Email: ChuBeDan@gmail.com</Typography>
              <Typography>Sdt: 02456789</Typography>
              {/* <Typography>Kiến thức nuôi con</Typography>
              <Typography>Tuyển dụng</Typography>
              <Typography>Chính sách bảo mật</Typography> */}
              {/* <span className="text-[#00AEEF]">Xem thêm</span> */}
            </div>
            <div className="space-y-2">
              <Typography variant="h7" className="text-[#DF4E21] mb-4">
                Về ticket Resell
              </Typography>
              <Typography>Giới thiệu</Typography>
              <Typography>Chính sách bảo mật</Typography>
              <Typography>Điều khoản chung</Typography>
              {/* <Typography>Lớp học tiền sản miễn phí</Typography>
              <Typography>Lớp học ăn dặm miễn phí</Typography>
              <Typography>Gửi góp ý / Khiếu nại</Typography>
              <Typography>Chính sách bảo hành</Typography>
              <Typography>Câu hỏi thường gặp</Typography> */}
              {/* <span className="text-[#00AEEF]">Xem thêm</span> */}
            </div>
            <div className="space-y-2">
              <Typography variant="h7" className="text-[#DF4E21] mb-4">
                Hỗ trợ khách hàng
              </Typography>
              <Typography>Chăm sóc khách hàng</Typography>
              <Typography>
                Mua & thanh toán Online</Typography>
              <Typography>Bảo mật và bảo trì</Typography>
            </div>
            {/* <div className="space-y-2">
              <Typography variant="h7" className="text-[#DF4E21] mb-4">
                Phương thức thanh toán
              </Typography>
              <Box className="flex flex-wrap">
                <img
                  src="./public/assets/images/image.png"
                  alt="VNPay"
                  className="w-12 h-12 m-1"
                />
              </Box>
              <Typography variant="h7" className="text-[#DF4E21] mb-4">
                Contact với chúng tôi
              </Typography>
              <Box className="flex flex-wrap">
                <img
                  src="./public/assets/images/download.png"
                  alt="Facebook"
                  className="w-12 h-12 m-1"
                />
                <img
                  src="./public/assets/images/DG-Service-Icons-LinkedIn.webp"
                  alt="LinkedIn"
                  className="w-12 h-12 m-1"
                />
                <img
                  src="./public/assets/images/Instagram_logo_2022.svg.webp"
                  alt="Instagram"
                  className="w-12 h-12 m-1"
                />
              </Box>
            </div> */}
          </div>
        </Container>
      </Box>
    </>
  );
}
