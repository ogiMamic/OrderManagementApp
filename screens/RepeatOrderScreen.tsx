import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function RepeatOrderScreen() {
  const { recentOrders, addOrder } = useAppContext();
  const navigation = useNavigation();

  const handleRepeatOrder = (order: Order) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'Pending',
    };
    addOrder(newOrder);
    Alert.alert(
      'Order Repeated',
      'Your order has been successfully repeated.',
      [{ text: 'OK', onPress: () => navigation.navigate('Orders') }]
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handleRepeatOrder(item)}
      accessibilityLabel={`Repeat order from ${item.date} with total €${item.total.toFixed(2)}`}
    >
      <View>
        <Text style={styles.orderDate}>Order Date: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.orderTotal}>Total: €{item.total.toFixed(2)}</Text>
        <Text style={styles.orderItems}>
          {item.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
        </Text>
      </View>
      <Text style={styles.repeatText}>Repeat</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeat Recent Orders</Text>
      {recentOrders.length > 0 ? (
        <FlatList
          data={recentOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noOrdersText}>No recent orders to display.</Text>
      )}
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
  orderItems: {
    fontSize: 14,
    color: '#8E8E93',
  },
  repeatText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  noOrdersText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});