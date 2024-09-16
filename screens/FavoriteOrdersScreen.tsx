import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function FavoriteOrdersScreen() {
  const { favoriteOrders, removeFavoriteOrder, addOrder } = useAppContext();
  const navigation = useNavigation();

  const handleRepeatOrder = (order) => {
    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: order.items,
      total: order.total,
      status: 'Pending',
    };
    addOrder(newOrder);
    Alert.alert(
      'Order Placed',
      'Your favorite order has been repeated successfully.',
      [{ text: 'OK', onPress: () => navigation.navigate('Orders') }]
    );
  };

  const handleRemoveFavorite = (orderId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this order from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFavoriteOrder(orderId) },
      ]
    );
  };

  const renderFavoriteOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View>
        <Text style={styles.orderName}>{item.name}</Text>
        <Text style={styles.orderTotal}>Total: €{item.total.toFixed(2)}</Text>
        <Text style={styles.orderItems}>
          {item.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.repeatButton}
          onPress={() => handleRepeatOrder(item)}
          accessibilityLabel={`Repeat favorite order ${item.name}`}
        >
          <Text style={styles.buttonText}>Repeat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item.id)}
          accessibilityLabel={`Remove ${item.name} from favorite orders`}
        >
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Orders</Text>
      {favoriteOrders.length > 0 ? (
        <FlatList
          data={favoriteOrders}
          renderItem={renderFavoriteOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noFavoritesText}>You don't have any favorite orders yet.</Text>
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
  },
  orderName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  repeatButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});