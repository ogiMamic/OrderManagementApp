import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function RepeatOrderScreen() {
  const { addOrder } = useAppContext();
  const navigation = useNavigation();
  const route = useRoute();
  const [order, setOrder] = useState(route.params?.order);
  const [customerName, setCustomerName] = useState(order?.customerName || '');
  const [items, setItems] = useState(order?.items || []);

  useEffect(() => {
    if (route.params?.order) {
      setOrder(route.params.order);
      setCustomerName(route.params.order.customerName);
      setItems(route.params.order.items);
    }
  }, [route.params?.order]);

  const updateItemQuantity = (itemId, newQuantity) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRepeatOrder = () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter a customer name.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Your order is empty. Please add some items.');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      customerName: customerName.trim(),
      items: items,
      total: calculateTotal(),
      status: 'Pending'
    };

    addOrder(newOrder);
    Alert.alert('Success', 'Your order has been placed!', [
      { text: 'OK', onPress: () => navigation.navigate('Orders') }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => updateItemQuantity(item.id, Math.max(0, item.quantity - 1))}
          style={styles.quantityButton}
          accessibilityLabel={`Decrease quantity of ${item.name}`}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
          style={styles.quantityButton}
          accessibilityLabel={`Increase quantity of ${item.name}`}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemPrice}>€{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeat Order</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
        accessibilityLabel="Enter customer name"
      />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Order Items</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No items in this order</Text>}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: €{calculateTotal().toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleRepeatOrder}
        accessibilityLabel="Place repeated order"
      >
        <Text style={styles.submitButtonText}>Place Order</Text>
      </TouchableOpacity>
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
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});