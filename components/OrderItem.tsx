import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface OrderItemProps {
  order: {
    id: string;
    date: string;
    total: number;
    status: string;
  };
  onPress: (orderId: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(order.id)} style={styles.container}>
      <View style={styles.orderInfo}>
        <Text style={styles.date}>{new Date(order.date).toLocaleDateString()}</Text>
        <Text style={styles.total}>€{order.total.toFixed(2)}</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#007AFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  orderInfo: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default OrderItem;