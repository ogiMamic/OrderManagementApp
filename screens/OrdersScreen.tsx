import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for orders
const mockOrders = [
  { 
    id: '1', 
    date: '2023-05-15', 
    total: 15.99, 
    status: 'Delivered',
    items: [
      { name: 'Espresso', quantity: 2, price: 5.00 },
      { name: 'Croissant', quantity: 1, price: 2.50 }
    ]
  },
  { 
    id: '2', 
    date: '2023-05-14', 
    total: 23.50, 
    status: 'Processing',
    items: [
      { name: 'Cappuccino', quantity: 3, price: 10.50 },
      { name: 'Sandwich', quantity: 2, price: 13.00 }
    ]
  },
  { 
    id: '3', 
    date: '2023-05-13', 
    total: 9.99, 
    status: 'Cancelled',
    items: [
      { name: 'Latte', quantity: 1, price: 3.50 },
      { name: 'Muffin', quantity: 2, price: 6.00 }
    ]
  },
];

export default function OrdersScreen() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderItem} 
      onPress={() => setSelectedOrder(item)}
      accessibilityLabel={`Order from ${item.date}, total €${item.total.toFixed(2)}, status: ${item.status}`}
    >
      <View>
        <Text style={styles.orderDate}>Order Date: {item.date}</Text>
        <Text style={styles.orderTotal}>Total: €{item.total.toFixed(2)}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          Status: {item.status}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'green';
      case 'Processing':
        return 'orange';
      case 'Cancelled':
        return 'red';
      default:
        return '#8E8E93';
    }
  };

  const renderOrderDetails = () => (
    <Modal
      visible={selectedOrder !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedOrder(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Order Details</Text>
          <Text style={styles.modalDate}>Date: {selectedOrder?.date}</Text>
          <Text style={styles.modalStatus}>Status: {selectedOrder?.status}</Text>
          <FlatList
            data={selectedOrder?.items}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text>{item.name} x{item.quantity}</Text>
                <Text>€{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text style={styles.modalTotal}>Total: €{selectedOrder?.total.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedOrder(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={mockOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {renderOrderDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalStatus: {
    fontSize: 16,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});