import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            accessibilityLabel="CAFE&BAR SERVICE logo"
          />
          <TouchableOpacity accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={[styles.card, styles.darkCard]} 
            accessibilityLabel="Wiederholen: Letzte Bestellung schnell neu aufgeben"
            onPress={() => navigation.navigate('RepeatOrder')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={24} color="white" />
            </View>
            <Text style={[styles.cardTitle, styles.whiteText]}>Wiederholen</Text>
            <Text style={[styles.cardSubtitle, styles.whiteText]}>Letzte Bestellung schnell neu aufgeben</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.card} 
            accessibilityLabel="Neue Bestellung starten"
            onPress={() => navigation.navigate('NewOrder')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="add-outline" size={24} color="black" />
            </View>
            <Text style={styles.cardTitle}>Neue Bestellung</Text>
            <Text style={styles.cardSubtitle}>Neue Bestellung starten</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.card} 
            accessibilityLabel="Geräteproblem: Problem mit Gerät melden"
            onPress={() => navigation.navigate('ReportIssue')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="warning-outline" size={24} color="black" />
            </View>
            <Text style={styles.cardTitle}>Geräteproblem</Text>
            <Text style={styles.cardSubtitle}>Problem mit Gerät melden</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.card, styles.darkCard]} 
            accessibilityLabel="Unsere Kaffemarken: Unser Angebot entdecken"
            onPress={() => navigation.navigate('Kaffemarken')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="cafe-outline" size={24} color="white" />
            </View>
            <Text style={[styles.cardTitle, styles.whiteText]}>Unsere Kaffemarken</Text>
            <Text style={[styles.cardSubtitle, styles.whiteText]}>Unser Angebot entdecken</Text>
            <Image
              source={require('../assets/coffee-bags.png')}
              style={styles.coffeeImage}
              accessibilityLabel="Coffee bags"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} accessibilityLabel="Home" onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} accessibilityLabel="Bestellungen" onPress={() => navigation.navigate('Orders')}>
          <Ionicons name="document-text-outline" size={24} color="#8E8E93" />
          <Text style={styles.navTextInactive}>Bestellungen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} accessibilityLabel="Warenkorb" onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="#8E8E93" />
          <Text style={styles.navTextInactive}>Warenkorb</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} accessibilityLabel="Profil" onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#8E8E93" />
          <Text style={styles.navTextInactive}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 200,
    height: 40,
    resizeMode: 'contain',
  },
  cardContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  whiteText: {
    color: '#FFFFFF',
  },
  coffeeImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
    marginTop: 8,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  navTextInactive: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
});