# Sử dụng một hình ảnh Node.js chính thức làm cơ sở
FROM node:16

# Đặt thư mục làm thư mục làm việc mặc định trong container
WORKDIR /app

# Sao lưu tệp package.json và package-lock.json (nếu có) để cài đặt các phụ thuộc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao lưu mã nguồn ứng dụng của bạn vào container
COPY . .

# Expose cổng ứng dụng (cổng 3000 trong trường hợp này)
EXPOSE 3000

# Khởi chạy ứng dụng khi container được khởi động
CMD [ "node", "app.js" ]
