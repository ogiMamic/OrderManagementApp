import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

type OrderStatus = 'All' | 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
type SortOption = 'date' | 'total';

export default function OrdersScreen() {
  const { orders, deleteOrder } = useAppContext();
  const navigation = useNavigation();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('All');
  const [showRecent, setShowRecent] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      filterAndSortOrders();
    }, [orders, searchQuery, selectedStatus, showRecent, sortOption])
  );

  const filterAndSortOrders = () => {
    let filtered = [...orders];
    
    if (showRecent) {
      filtered = filtered.slice(0, 5);
    }
    
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }
    
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(lowercasedQuery) ||
        (order.customerName && order.customerName.toLowerCase().includes(lowercasedQuery))
      );
    }
    
    filtered.sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.total - a.total;
      }
    });
    
    setFilteredOrders(filtered);
  };

  const handleRepeatOrder = (order) => {
    navigation.navigate('RepeatOrder', { order });
  };

  const handleDeleteOrder = (orderId) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          deleteOrder(orderId);
          filterAndSortOrders();
        }}
      ]
    );
  };

  const renderOrderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteOrder(item.id)}
          accessibilityLabel={`Delete order from ${new Date(item.date).toLocaleDateString()}`}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => setExpandedOrderId(expandedOrderId === item.id ? null : item.id)}
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
          style={styles.repeatButton}
          onPress={() => handleRepeatOrder(item)}
          accessibilityLabel={`Repeat order from ${new Date(item.date).toLocaleDateString()}`}
        >
          <Text style={styles.repeatButtonText}>Repeat</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      {expandedOrderId === item.id && (
        <View style={styles.expandedDetails}>
          <Text style={styles.expandedTitle}>Order Details:</Text>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.expandedItem}>
              {orderItem.name} x{orderItem.quantity} - €{(orderItem.price * orderItem.quantity).toFixed(2)}
            </Text>
          ))}
        </View>
      )}
    </Swipeable>
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
          onPress={() => setSelectedStatus(status)}
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
      <TextInput
        style={styles.searchInput}
        placeholder="Search orders..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        accessibilityLabel="Search orders"
      />
      {renderStatusFilter()}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, showRecent && styles.controlButtonActive]}
          onPress={() => setShowRecent(!showRecent)}
          accessibilityLabel={showRecent ? "Show all orders" : "Show recent orders"}
        >
          <Text style={[styles.controlButtonText, showRecent && styles.controlButtonTextActive]}>
            {showRecent ? "Show All" : "Show Recent"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, sortOption === 'date' && styles.controlButtonActive]}
          onPress={() => setSortOption(sortOption === 'date' ? 'total' : 'date')}
          accessibilityLabel={`Sort by ${sortOption === 'date' ? 'total' : 'date'}`}
        >
          <Text style={[styles.controlButtonText, sortOption === 'date' && styles.controlButtonTextActive]}>
            Sort by {sortOption === 'date' ? 'Total' : 'Date'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
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
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#E5E5EA',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#007AFF',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlButtonTextActive: {
    color: '#FFFFFF',
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
  repeatButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
  },
  repeatButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  expandedDetails: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expandedItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});