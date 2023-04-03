import { OrderStatus } from '../Config/Enums';

const getRandomOrderStatus = (): OrderStatus.filled | OrderStatus.rejected => {
  return Math.random() < 0.8 ? OrderStatus.filled : OrderStatus.rejected;
};

export default getRandomOrderStatus;
