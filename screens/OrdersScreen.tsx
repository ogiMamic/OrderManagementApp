import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { Heart } from 'lucide-react-native';

type OrderStatus = 'All' | 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

export default function OrdersScreen() {
  const { orders, updateOrderStatus, addFavoriteOrder } = useAppContext();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('All');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      filterOrders(selectedStatus);
    }, [orders, selectedStatus])
  );

  const filterOrders = (status: OrderStatus) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      filterOrders(selectedStatus);
      setRefreshing(false);
    }, 1000);
  }, [selectedStatus]);

  const handleAddToFavorites = (order) => {
    const favoriteOrder = {
      id: order.id,
      name: `Order from ${new Date(order.date).toLocaleDateString()}`,
      items: order.items,
      total: order.total,
    };
    addFavoriteOrder(favoriteOrder);
    Alert.alert('Success', 'Order added to favorites!');
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderItem}
      accessibilityLabel={`Order from ${new Date(item.date).toLocaleDateString()}, total €${item.total.toFixed(2)}, status: ${item.status}`}
    >
      <View>
        <Text style={styles.orderDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.orderTotal}>Total: €{item.total.toFixed(2)}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          Status: {item.status}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleAddToFavorites(item)}
        accessibilityLabel={`Add order from ${new Date(item.date).toLocaleDateString()} to favorites`}
      >
        <Heart size={24} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'Processing': return '#4169E1';
      case 'Delivered': return '#32CD32';
      case 'Cancelled': return '#FF0000';
      default: return '#000000';
    }
  };

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      {(['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'] as OrderStatus[]).map((status) => (
        <TouchableOpacity
          key={status}
          style={[styles.filterButton, selectedStatus === status && styles.selectedFilter]}
          onPress={() => filterOrders(status)}
          accessibilityLabel={`Filter orders by ${status} status`}
        >
          <Text style={[styles.filterText, selectedStatus === status && styles.selectedFilterText]}>
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {renderStatusFilter()}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    color: '#000000',
  },
  selectedFilterText: {
    color: '#FFFFFF',
  },
  favoriteButton: {
    padding: 8,
  },
});