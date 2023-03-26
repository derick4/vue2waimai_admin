/*
 Navicat Premium Data Transfer

 Source Server         : coderwhy
 Source Server Type    : MySQL
 Source Server Version : 100410
 Source Host           : localhost:3306
 Source Schema         : yuliner

 Target Server Type    : MySQL
 Target Server Version : 100410
 File Encoding         : 65001

 Date: 03/12/2022 21:26:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `realname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 27 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES (26, '夏至', '123123', '中国安徽省', '小夏');
INSERT INTO `address` VALUES (25, '夏至', '132123131', '宜秀区筑梦新区', '小夏');

-- ----------------------------
-- Table structure for admin_users
-- ----------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `uname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `pwd` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 37 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_users
-- ----------------------------
INSERT INTO `admin_users` VALUES (24, 'admin', '40bd001563085fc35165329ea1ff5c5ecbdbbeef');
INSERT INTO `admin_users` VALUES (27, '张三', '6216f8a75fd5bb3d5f22b6f9958cdede3fc086c2');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `comments_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `shoplist_id` int NOT NULL,
  `comments_time` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  `userpic` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (1, '刘艳', '好吃', 9, '2022-03-16 09:02:45', 'https://img0.baidu.com/it/u=987633844,965499485&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400');
INSERT INTO `comments` VALUES (2, '蓉蓉', 'goods', 9, '2022-03-16 09:03:24', 'https://img0.baidu.com/it/u=597033770,2511631035&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400');
INSERT INTO `comments` VALUES (3, '小敏', '不错', 9, '2022-03-16 09:03:47', 'https://img0.baidu.com/it/u=2649068796,4261859344&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400');
INSERT INTO `comments` VALUES (4, '超超', 'not bad', 9, '2022-03-16 09:04:19', 'https://img1.baidu.com/it/u=1168019721,766952759&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500');
INSERT INTO `comments` VALUES (5, '鑫伟', '666', 13, '2022-03-16 09:04:59', 'https://img0.baidu.com/it/u=3457694045,161926376&fm=253&fmt=auto&app=138&f=JPEG?w=350&h=350');
INSERT INTO `comments` VALUES (6, '宇航', 'nice', 13, '2022-03-16 09:05:29', 'https://img2.baidu.com/it/u=2533838028,1508299820&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400');
INSERT INTO `comments` VALUES (7, '诚诚', 'very good', 9, '2022-03-16 09:16:13', 'https://img0.baidu.com/it/u=3041701001,1968583786&fm=26&fmt=auto');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `foodname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `descr` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `price` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `shoplist_id` int NOT NULL,
  `foodpic` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES (1, '臭豆腐', '又丑又香', '5', 3, 'ddb2aca341bc6437ecc69e500.webp');
INSERT INTO `goods` VALUES (2, '全家桶', '量大实惠', '88', 1, 'cd1315677a980965cb94e1800.webp');
INSERT INTO `goods` VALUES (3, '羊肉粉', '量大实惠', '12', 6, '3de45485ecf6ee24e02eda900.webp');
INSERT INTO `goods` VALUES (4, '羊肉粉', '量大实惠', '12', 6, 'b5fdd9def7294bfc35509d102.webp');
INSERT INTO `goods` VALUES (5, '羊肉粉', '量大实惠', '12', 6, '7cc8cfe48c680af1dfae72800.webp');
INSERT INTO `goods` VALUES (6, '全家桶', '量大实惠', '12', 8, '74c392abcb363d5a07b824102.webp');
INSERT INTO `goods` VALUES (7, '牛肉汤', '量大实惠', '11', 10, '74c392abcb363d5a07b824104.webp');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_num` int NOT NULL,
  `address_id` int NOT NULL,
  `food_totalprice` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (1, 9527, 25, '125.00', '小夏');
INSERT INTO `orders` VALUES (2, 9536, 26, '300.00', '小夏');
INSERT INTO `orders` VALUES (3, 9589, 25, '500.00', '小夏');

-- ----------------------------
-- Table structure for orders_goods
-- ----------------------------
DROP TABLE IF EXISTS `orders_goods`;
CREATE TABLE `orders_goods`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `foodname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `pic` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `count` int NOT NULL,
  `orders_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders_goods
-- ----------------------------
INSERT INTO `orders_goods` VALUES (1, '火锅', '1.pic', 2, 1);
INSERT INTO `orders_goods` VALUES (2, '汉堡', '2.pic', 1, 1);
INSERT INTO `orders_goods` VALUES (3, '烤鸭2', 'upload_e08859e524c46e0833ff27d29c9257f6.jpg', 3, 2);
INSERT INTO `orders_goods` VALUES (4, '烤鸭2', 'upload_e08859e524c46e0833ff27d29c9257f6.jpg', 1, 2);
INSERT INTO `orders_goods` VALUES (5, '烤鸭1', 'upload_bf9dbef548e0c8fa157dfd92e5233b28.jpg', 1, 2);
INSERT INTO `orders_goods` VALUES (6, '烤鸭1', 'upload_bf9dbef548e0c8fa157dfd92e5233b28.jpg', 2, 8);
INSERT INTO `orders_goods` VALUES (7, '火锅1', 'upload_acc7e74986c13b31f5502a9bb50ff711.jpg', 1, 9);
INSERT INTO `orders_goods` VALUES (8, '火锅1', 'upload_acc7e74986c13b31f5502a9bb50ff711.jpg', 1, 10);
INSERT INTO `orders_goods` VALUES (9, '烤鸭2', 'upload_e08859e524c46e0833ff27d29c9257f6.jpg', 1, 11);
INSERT INTO `orders_goods` VALUES (10, '烤鸭1', 'upload_bf9dbef548e0c8fa157dfd92e5233b28.jpg', 1, 11);
INSERT INTO `orders_goods` VALUES (11, '火锅1', 'upload_acc7e74986c13b31f5502a9bb50ff711.jpg', 1, 12);

-- ----------------------------
-- Table structure for shoplists
-- ----------------------------
DROP TABLE IF EXISTS `shoplists`;
CREATE TABLE `shoplists`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `shopname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `logo` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `fee` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shoplists
-- ----------------------------
INSERT INTO `shoplists` VALUES (19, '德克士', '8f28212e6f155a7f17002de01.webp', '全场五折起', '14');
INSERT INTO `shoplists` VALUES (14, '肯德基中国', 'f23f176b5db7fa00386b89201.gif', '全场五折起123', '15');
INSERT INTO `shoplists` VALUES (12, '华莱士', '3d81fe2f08fdaf281e1170900.webp', '又脆又便宜', '20');
INSERT INTO `shoplists` VALUES (11, '遵义羊肉粉', 'b0971339d0c8b47151ce06301.webp', '量大实惠', '14');
INSERT INTO `shoplists` VALUES (10, '淮南牛肉汤', '74c392abcb363d5a07b824103.webp', '汤多鲜美', '6');
INSERT INTO `shoplists` VALUES (18, '长沙臭豆腐', '8f28212e6f155a7f17002de00.webp', '又丑又香又脆', '8');

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `realname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `pic` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `u_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (1, '夏至', 'https://img2.baidu.com/it/u=4136987256,283353262&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=520', '00000000000', '12321@qq.com', 1);
INSERT INTO `user_info` VALUES (2, '段玉', 'https://img2.baidu.com/it/u=4136987256,283353262&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=520', '11111111111', '12312@163.com', 28);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `pass` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '小夏', '123');
INSERT INTO `users` VALUES (2, '新宇', '123456');
INSERT INTO `users` VALUES (3, '小雪', '123');
INSERT INTO `users` VALUES (5, '易', '123');
INSERT INTO `users` VALUES (6, '金', '123');
INSERT INTO `users` VALUES (7, '娜娜', '123');
INSERT INTO `users` VALUES (8, '圆圆', '123');
INSERT INTO `users` VALUES (9, '月月', '123');
INSERT INTO `users` VALUES (30, 'Tom', 'cd3f0c85b158c08a2b113464991810cf2cdfc387');
INSERT INTO `users` VALUES (28, '小玉', '123');
INSERT INTO `users` VALUES (29, 'Tom', 'cd3f0c85b158c08a2b113464991810cf2cdfc387');

SET FOREIGN_KEY_CHECKS = 1;
