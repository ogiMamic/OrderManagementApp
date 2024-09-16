import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';

export default function RepeatOrderScreen() {
  const { recentOrders, addOrder } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState(recentOrders);

  useFocusEffect(
    useCallback(() => {
      setOrders(recentOrders);
    }, [recentOrders])
  );

  const handleRepeatOrder = () => {
    if (selectedOrder) {
      const newOrder = {
        ...selectedOrder,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: 'Pending',
      };
      addOrder(newOrder).then(() => {
        setSelectedOrder(null);
        setOrders([newOrder, ...orders.slice(0, 4)]);
        Alert.alert(
          "Order Repeated",
          "Your order has been successfully repeated and added to recent orders.",
          [{ text: "OK" }]
        );
      });
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => setSelectedOrder(item)}
      accessibilityLabel={`View details of order from ${new Date(item.date).toLocaleDateString()} with total €${item.total.toFixed(2)}`}
    >
      <View>
        <Text style={styles.orderDate}>Order Date: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.orderTotal}>Total: €{item.total.toFixed(2)}</Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
      </View>
      <Text style={styles.viewDetailsText}>View Details</Text>
    </TouchableOpacity>
  );

  const renderOrderDetails = () => (
    <Modal
      visible={selectedOrder !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedOrder(null)}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Order Details</Text>
          <Text style={styles.modalDate}>Date: {selectedOrder && new Date(selectedOrder.date).toLocaleDateString()}</Text>
          <Text style={styles.modalStatus}>Status: {selectedOrder?.status}</Text>
          {selectedOrder?.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text>{item.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>€{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <Text style={styles.modalTotal}>Total: €{selectedOrder?.total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.repeatButton} onPress={handleRepeatOrder}>
            <Text style={styles.repeatButtonText}>Repeat This Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedOrder(null)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeat Recent Orders</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noOrdersText}>No recent orders to display.</Text>
      )}
      {renderOrderDetails()}
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
  listContainer: {
    flexGrow: 1,
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
    color: '#8E8E93',
  },
  viewDetailsText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  noOrdersText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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
    width: '90%',
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
  repeatButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  repeatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#8E8E93',
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