import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

type OrderDetailsParams = {
  orderId: string;
};

type OrderDetailsRouteProp = RouteProp<Record<string, OrderDetailsParams>, string>;

export default function OrderDetailsScreen() {
  const route = useRoute<OrderDetailsRouteProp>();
  const { orders, updateOrderStatus } = useAppContext();
  const [rating, setRating] = useState(0);

  const order = orders.find(o => o.id === route.params.orderId);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    updateOrderStatus(order.id, newStatus);
  };

  const handleRating = (value: number) => {
    setRating(value);
    // Here you would typically send this rating to your backend
    console.log(`Order ${order.id} rated ${value} stars`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <Text style={styles.orderInfo}>Order ID: {order.id}</Text>
      <Text style={styles.orderInfo}>Date: {new Date(order.date).toLocaleString()}</Text>
      <Text style={styles.orderInfo}>Customer: {order.customerName}</Text>
      <Text style={styles.orderInfo}>Status: {order.status}</Text>
      <Text style={styles.orderInfo}>Total: €{order.total.toFixed(2)}</Text>

      <Text style={styles.sectionTitle}>Items:</Text>
      <FlatList
        data={order.items}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>{item.name}</Text>
            <Text>x{item.quantity}</Text>
            <Text>€{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.statusButtons}>
        <TouchableOpacity
          style={[styles.statusButton, order.status === 'Pending' && styles.activeStatus]}
          onPress={() => handleStatusChange('Pending')}
        >
          <Text style={styles.statusButtonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, order.status === 'Processing' && styles.activeStatus]}
          onPress={() => handleStatusChange('Processing')}
        >
          <Text style={styles.statusButtonText}>Processing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, order.status === 'Delivered' && styles.activeStatus]}
          onPress={() => handleStatusChange('Delivered')}
        >
          <Text style={styles.statusButtonText}>Delivered</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Rate this order:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <Feather
              name={star <= rating ? 'star' : 'star-o'}
              size={30}
              color={star <= rating ? '#FFD700' : '#BDC3C7'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statusButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  activeStatus: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    color: '#000000',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
});