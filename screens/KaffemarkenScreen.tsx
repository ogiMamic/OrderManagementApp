import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';

const coffeeData = [
  { id: '1', name: 'Espresso', description: 'Strong, concentrated coffee served in small shots.', image: 'https://example.com/espresso.jpg' },
  { id: '2', name: 'Cappuccino', description: 'Espresso with steamed milk foam.', image: 'https://example.com/cappuccino.jpg' },
  { id: '3', name: 'Latte', description: 'Espresso with steamed milk and a small layer of foam.', image: 'https://example.com/latte.jpg' },
  { id: '4', name: 'Americano', description: 'Espresso diluted with hot water.', image: 'https://example.com/americano.jpg' },
];

export default function KaffemarkenScreen() {
  const [selectedCoffee, setSelectedCoffee] = useState(null);

  const renderCoffeeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.coffeeItem}
      onPress={() => setSelectedCoffee(item)}
      accessibilityLabel={`View details for ${item.name}`}
    >
      <Image source={{ uri: item.image }} style={styles.coffeeImage} />
      <Text style={styles.coffeeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kaffemarken</Text>
      <FlatList
        data={coffeeData}
        renderItem={renderCoffeeItem}
        keyExtractor={item => item.id}
        numColumns={2}
      />
      <Modal
        visible={selectedCoffee !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCoffee(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCoffee && (
              <>
                <Image source={{ uri: selectedCoffee.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedCoffee.name}</Text>
                <Text style={styles.modalDescription}>{selectedCoffee.description}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCoffee(null)}
              accessibilityLabel="Close coffee details"
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  coffeeItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  coffeeImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  coffeeName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});