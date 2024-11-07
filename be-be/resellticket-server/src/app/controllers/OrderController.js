const { error } = require("jquery");
const OrderStatusEnum = require("../../enum/OrderStatusEnum");
const RoleEnum = require("../../enum/RoleEnum");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const Voucher = require("../models/Voucher");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    const {
      name,
      phone,
      province,
      district,
      ward,
      address,
      shippingMethod,
      paymentMethod,
      orderNotes,
      terms,
      voucherId,
    } = req.body;

    if (!terms) {
      return res
        .status(400)
        .json({ error: "Bạn phải đồng ý với các điều khoản" });
    }

    const fullAddress = `${address}, ${ward}, ${district}, ${province}`;
    const status =
      paymentMethod == "vnpay"
        ? OrderStatusEnum.PENDING
        : OrderStatusEnum.PROCESSING;
    if (voucherId == "") {
      const newOrder = new Order({
        userId: cart.userId,
        items: cart.items,
        total: cart.items.reduce(
          (total, item) => total + item.productId.regular_price * item.quantity,
          0
        ),
        shippingInfo: { name, phone, address: fullAddress },
        shippingMethod,
        paymentMethod,
        orderNotes,
        status: status,
      });

      await newOrder.save();
      cart.items = [];
      await cart.save();

      res.json(newOrder);
    } else {
      const selectedVoucher = await Voucher.findById(voucherId);
      let total = cart.items.reduce(
        (total, item) => total + item.productId.regular_price * item.quantity,
        0
      );
      total = total * (1 - selectedVoucher.voucher_discount / 100);
      const newOrder = new Order({
        userId: cart.userId,
        items: cart.items,
        voucherId: voucherId,
        total: total,
        shippingInfo: { name, phone, address: fullAddress },
        shippingMethod,
        paymentMethod,
        orderNotes,
        status: status,
      });

      await newOrder.save();
      cart.items = [];
      await cart.save();

      res.json(newOrder);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const createOrderWithoutAccount = async (req, res) => {
  try {
    const {
      name,
      phone,
      province,
      district,
      ward,
      address,
      shippingMethod,
      paymentMethod,
      orderNotes,
      terms,
      voucherId,
      items,
    } = req.body;

    if (!terms) {
      return res
        .status(400)
        .json({ error: "Bạn phải đồng ý với các điều khoản" });
    }
    const fullAddress = `${address}, ${ward}, ${district}, ${province}`;
    const status =
      paymentMethod == "vnpay"
        ? OrderStatusEnum.PENDING
        : OrderStatusEnum.PROCESSING;
    if (voucherId == "") {
      const newOrder = new Order({
        items: items,
        total: items.reduce(
          (total, item) => total + item.productId.regular_price * item.quantity,
          0
        ),
        shippingInfo: { name, phone, address: fullAddress },
        shippingMethod,
        paymentMethod,
        orderNotes,
        status: status,
      });

      await newOrder.save();

      res.json(newOrder);
    } else {
      const selectedVoucher = await Voucher.findById(voucherId);
      let total = items.reduce(
        (total, item) => total + item.productId.regular_price * item.quantity,
        0
      );
      total = total * (1 - selectedVoucher.voucher_discount / 100);
      const newOrder = new Order({
        items: items,
        voucherId: voucherId,
        total: total,
        shippingInfo: { name, phone, address: fullAddress },
        shippingMethod,
        paymentMethod,
        orderNotes,
        status: status,
      });

      await newOrder.save();

      res.json(newOrder);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const getOrders = async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.STAFF) {
      res.status(403);
      throw new Error("You don't have permission");
    }

    const orders = await Order.find()
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrdersOfUser = async (req, res) => {
  try {
    if (req.user.roleName !== RoleEnum.CUSTOMER) {
      res.status(403);
      throw new Error("You don't have permission");
    }

    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getOrderByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("voucherId");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (req.user.id != order.userId && req.user.roleName !== RoleEnum.STAFF) {
      return res.status(404).json({ error: "You don't have permission" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

const getOrderStatistics = async (req, res) => {
  try {
    if (
      req.user.roleName !== RoleEnum.ADMIN &&
      req.user.roleName !== RoleEnum.STAFF
    ) {
      return res.status(400).json({ error: "You don't have permission" });
    }
    const totalOrders = await Order.countDocuments();
    if (totalOrders === 0) {
      return res.status(200).json({
        message: "No orders found",
        cardData: [
          {
            title: "Total Orders",
            amount: 0,
            percentage: "0%",
            compared: "Compared to previous period",
          },
          {
            title: "Active Orders",
            amount: 0,
            percentage: "0%",
            compared: "Compared to previous period",
          },
          {
            title: "Completed Orders",
            amount: 0,
            percentage: "0%",
            compared: "Compared to previous period",
          },
          {
            title: "Return Orders",
            amount: 0,
            percentage: "0%",
            compared: "Compared to previous period",
          },
        ],
      });
    }

    const activeOrders = await Order.countDocuments({
      status: {
        $in: [
          OrderStatusEnum.PENDING,
          OrderStatusEnum.PROCESSING,
          OrderStatusEnum.SHIPPED,
        ],
      },
    });
    const completedOrders = await Order.countDocuments({
      status: OrderStatusEnum.DELIVERED,
    });
    const returnOrders = await Order.countDocuments({
      status: OrderStatusEnum.CANCELED,
    });

    const cardData = [
      {
        title: "Total Orders",
        amount: totalOrders,
        percentage: "100%",
        compared: "Compared to previous period",
      },
      {
        title: "Active Orders",
        amount: activeOrders,
        percentage: `${((activeOrders / totalOrders) * 100).toFixed(2)}%`,
        compared: "Compared to previous period",
      },
      {
        title: "Completed Orders",
        amount: completedOrders,
        percentage: `${((completedOrders / totalOrders) * 100).toFixed(2)}%`,
        compared: "Compared to previous period",
      },
      {
        title: "Return Orders",
        amount: returnOrders,
        percentage: `${((returnOrders / totalOrders) * 100).toFixed(2)}%`,
        compared: "Compared to previous period",
      },
    ];

    res.status(200).json(cardData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch order statistics" });
  }
};

module.exports = {
  createOrder,
  createOrderWithoutAccount,
  getOrders,
  getOrdersOfUser,
  getOrderByOrderId,
  updateOrderStatus,
  getOrderStatistics,
};
