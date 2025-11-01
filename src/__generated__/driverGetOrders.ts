/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: driverGetOrders
// ====================================================

export interface driverGetOrders_getOrders_orders_driver {
  __typename: "User";
  email: string;
}

export interface driverGetOrders_getOrders_orders_customer {
  __typename: "User";
  email: string;
}

export interface driverGetOrders_getOrders_orders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface driverGetOrders_getOrders_orders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: driverGetOrders_getOrders_orders_driver | null;
  customer: driverGetOrders_getOrders_orders_customer | null;
  restaurant: driverGetOrders_getOrders_orders_restaurant | null;
}

export interface driverGetOrders_getOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: driverGetOrders_getOrders_orders[] | null;
}

export interface driverGetOrders {
  getOrders: driverGetOrders_getOrders;
}
