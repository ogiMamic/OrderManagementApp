import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const mockProducts = [
  { id: '1', name: 'Coffee', price: 2.50 },
  { id: '2', name: 'Latte', price: 3.50 },
  { id: '3', name: 'Espresso', price: 2.00 },
  { id: '4', name: 'Cappuccino', price: 3.00 },
  { id: '5', name: 'Tea', price: 2.00 },
];

export default function NewOrderScreen() {
  const { addOrder } = useAppContext();
  const navigation = useNavigation();
  const [orderItems, setOrderItems] = useState<{ [key: string]: { quantity: number; name: string; price: number } }>({});

  const addToOrder = (product: { id: string; name: string; price: number }) => {
    setOrderItems((prevItems) => ({
      ...prevItems,
      [product.id]: {
        quantity: (prevItems[product.id]?.quantity || 0) + 1,
        name: product.name,
        price: product.price,
      },
    }));
  };

  const renderProductItem = ({ item }: { item: { id: string; name: string; price: number } }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => addToOrder(item)}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }: { item: [string, { quantity: number; name: string; price: number }] }) => (
    <View style={styles.orderItem}>
      <Text>{item[1].name} x {item[1].quantity}</Text>
      <Text>${(item[1].price * item[1].quantity).toFixed(2)}</Text>
    </View>
  );

  const calculateTotal = () => {
    return Object.values(orderItems).reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const submitOrder = () => {
    if (Object.keys(orderItems).length === 0) {
      Alert.alert('Error', 'Please add items to your order before submitting.');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      items: Object.entries(orderItems).map(([id, item]) => ({
        id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: calculateTotal(),
      date: new Date().toISOString(),
    };

    addOrder(newOrder);
    Alert.alert('Success', 'Your order has been submitted!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Order</Text>
      <FlatList
        data={mockProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        style={styles.productList}
      />
      <View style={styles.orderSummary}>
        <Text style={styles.subtitle}>Order Summary</Text>
        <FlatList
          data={Object.entries(orderItems)}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item[0]}
        />
        <Text style={styles.total}>Total: ${calculateTotal().toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
        <Text style={styles.submitButtonText}>Submit Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productList: {
    maxHeight: 200,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderSummary: {
    marginTop: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});