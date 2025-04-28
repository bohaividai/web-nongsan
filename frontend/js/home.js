let currentIndex = 0;
const images = document.querySelectorAll('.carousel-image');

function showNextImage() {
    // Xóa lớp "active" khỏi hình ảnh hiện tại
    images[currentIndex].classList.remove('active');

    // Cập nhật chỉ số hình ảnh kế tiếp
    currentIndex = (currentIndex + 1) % images.length;

    // Thêm lớp "active" vào hình ảnh mới
    images[currentIndex].classList.add('active');
}

// Đặt khoảng thời gian thay đổi ảnh (3 giây)
setInterval(showNextImage, 3000);


// giỏ hàng nè