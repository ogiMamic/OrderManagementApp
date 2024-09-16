import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

const mockProducts: Product[] = [
  { id: '1', name: 'Espresso', price: 2.5, category: 'Coffee' },
  { id: '2', name: 'Cappuccino', price: 3.5, category: 'Coffee' },
  { id: '3', name: 'Latte', price: 3.5, category: 'Coffee' },
  { id: '4', name: 'Croissant', price: 2.0, category: 'Pastry' },
  { id: '5', name: 'Chocolate Muffin', price: 2.5, category: 'Pastry' },
  { id: '6', name: 'Green Tea', price: 2.0, category: 'Tea' },
  { id: '7', name: 'Earl Grey', price: 2.0, category: 'Tea' },
];

export default function NewOrderScreen() {
  const { addOrder } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = mockProducts.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  const addToOrder = (product: Product) => {
    setSelectedProducts(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
  };

  const removeFromOrder = (productId: string) => {
    setSelectedProducts(prev => {
      const newSelected = { ...prev };
      if (newSelected[productId] > 1) {
        newSelected[productId]--;
      } else {
        delete newSelected[productId];
      }
      return newSelected;
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedProducts).reduce((total, [productId, quantity]) => {
      const product = mockProducts.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const submitOrder = () => {
    if (Object.keys(selectedProducts).length === 0) {
      Alert.alert('Error', 'Please add at least one item to your order.');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: Object.entries(selectedProducts).map(([productId, quantity]) => {
        const product = mockProducts.find(p => p.id === productId)!;
        return {
          name: product.name,
          quantity,
          price: product.price
        };
      }),
      total: calculateTotal(),
      status: 'Pending' as const
    };

    addOrder(newOrder);
    Alert.alert('Success', 'Your order has been placed!', [
      { text: 'OK', onPress: () => setSelectedProducts({}) }
    ]);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>€{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => removeFromOrder(item.id)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{selectedProducts[item.id] || 0}</Text>
        <TouchableOpacity onPress={() => addToOrder(item)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.categoryHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Order</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />
      <View style={styles.orderSummary}>
        <Text style={styles.orderTotal}>Total: €{calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity style={styles.submitButton} onPress={submitOrder}>
          <Text style={styles.submitButtonText}>Place Order</Text>
        </TouchableOpacity>
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
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  productList: {
    flexGrow: 1,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#007AFF',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginHorizontal: 10,
    fontSize: 16,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#E5E5EA',
    padding: 8,
    marginTop: 8,
  },
  orderSummary: {
    marginTop: 16,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
});