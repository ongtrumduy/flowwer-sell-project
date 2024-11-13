const Coupon = require('./models/Coupon'); // Đảm bảo đường dẫn chính xác

async function createCoupon(code, discountPercentage, expirationDate) {
  try {
    const coupon = new Coupon({
      code,
      discountPercentage,
      expirationDate,
    });
    await coupon.save();
    console.log("Mã giảm giá đã được tạo:", coupon);
  } catch (error) {
    console.error("Lỗi khi tạo mã giảm giá:", error);
  }
}

// Ví dụ
createCoupon("SALE2024", 20, new Date("2024-12-31"));



async function applyCoupon(code) {
    try {
      const coupon = await Coupon.findOne({ code, isActive: true });
  
      if (!coupon) {
        throw new Error("Mã giảm giá không tồn tại hoặc không hợp lệ.");
      }
      if (new Date() > coupon.expirationDate) {
        throw new Error("Mã giảm giá đã hết hạn.");
      }
  
      // Nếu hợp lệ, trả về thông tin giảm giá
      console.log("Giảm giá áp dụng:", coupon.discountPercentage + "%");
      return coupon.discountPercentage;
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error.message);
      return 0;
    }
  }
  
  // Ví dụ
  applyCoupon("SALE2024");



  async function deactivateCoupon(code) {
    try {
      const coupon = await Coupon.findOneAndUpdate(
        { code },
        { isActive: false },
        { new: true }
      );
  
      if (!coupon) {
        console.log("Mã giảm giá không tìm thấy hoặc đã ngừng hoạt động.");
      } else {
        console.log("Mã giảm giá đã được ngừng hoạt động:", coupon);
      }
    } catch (error) {
      console.error("Lỗi khi ngừng hoạt động mã giảm giá:", error);
    }
  }
  
  // Ví dụ
  deactivateCoupon("SALE2024");