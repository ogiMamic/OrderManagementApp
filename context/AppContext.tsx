import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
};

type FavoriteOrder = {
  id: string;
  name: string;
  items: OrderItem[];
  total: number;
};

type AppContextType = {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  recentOrders: Order[];
  favoriteOrders: FavoriteOrder[];
  addFavoriteOrder: (order: FavoriteOrder) => Promise<void>;
  removeFavoriteOrder: (orderId: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteOrders, setFavoriteOrders] = useState<FavoriteOrder[]>([]);

  useEffect(() => {
    loadOrders();
    loadFavoriteOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('orders');
      if (ordersData) {
        setOrders(JSON.parse(ordersData));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadFavoriteOrders = async () => {
    try {
      const favoriteOrdersData = await AsyncStorage.getItem('favoriteOrders');
      if (favoriteOrdersData) {
        setFavoriteOrders(JSON.parse(favoriteOrdersData));
      }
    } catch (error) {
      console.error('Error loading favorite orders:', error);
    }
  };

  const addOrder = async (order: Order) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const addFavoriteOrder = async (order: FavoriteOrder) => {
    const updatedFavoriteOrders = [order, ...favoriteOrders];
    setFavoriteOrders(updatedFavoriteOrders);
    try {
      await AsyncStorage.setItem('favoriteOrders', JSON.stringify(updatedFavoriteOrders));
    } catch (error) {
      console.error('Error saving favorite order:', error);
    }
  };

  const removeFavoriteOrder = async (orderId: string) => {
    const updatedFavoriteOrders = favoriteOrders.filter(order => order.id !== orderId);
    setFavoriteOrders(updatedFavoriteOrders);
    try {
      await AsyncStorage.setItem('favoriteOrders', JSON.stringify(updatedFavoriteOrders));
    } catch (error) {
      console.error('Error removing favorite order:', error);
    }
  };

  const recentOrders = orders.slice(0, 5);

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    recentOrders,
    favoriteOrders,
    addFavoriteOrder,
    removeFavoriteOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};