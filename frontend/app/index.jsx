import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { usePOS } from "../hooks/usePOS";
import CartItem from "../components/CartItem";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cart, setCart] = useState([]);
  const [isScanning, setIsScanning] = useState(true);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // use our hook for mutations
  const { productMutation, printMutation } = usePOS({
    onSuccessProduct: (product) => {
      setCart((currentCart) => {
        const existingItem = currentCart.find((item) => item.barcode === product.barcode);
        if (existingItem) {
          return currentCart.map((item) =>
            item.barcode === product.barcode ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...currentCart, { ...product, qty: 1 }];
      });
    },
    onResumeScanning: () => setTimeout(() => setIsScanning(true), 1500),
    onSuccessPrint: () => setCart([]),
  });

  const handleScan = ({ data }) => {
    if (!isScanning || productMutation.isPending) return;
    setIsScanning(false);
    productMutation.mutate(data);
  };

  const updateQty = (barcode, delta) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.barcode === barcode) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (barcode) => {
    setCart((currentCart) => currentCart.filter((item) => item.barcode !== barcode));
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Autorisation de la caméra nécessaire.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Accorder la permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleScan}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "code128", "qr"],
          }}
        />
        <View style={styles.overlay}>
          <View style={[styles.scanFrame, !isScanning && styles.scanFramePaused]} />
          <Text style={styles.scanText}>
            {productMutation.isPending ? "Recherche..." : isScanning ? "Alignez le code-barres" : "Chargé!"}
          </Text>
        </View>
      </View>

      <View style={styles.cartContainer}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>Panier</Text>
          <Text style={styles.itemCount}>{cart.length} articles</Text>
        </View>

        <FlatList
          data={cart}
          keyExtractor={(item) => item.barcode}
          renderItem={({ item }) => (
            <CartItem 
              item={item} 
              onRemove={removeItem} 
              onUpdateQty={updateQty} 
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={64} color="#333" />
              <Text style={styles.emptyText}>Panier vide. Scannez un produit!</Text>
            </View>
          }
        />

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{totalPrice.toFixed(2)} DH</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.printBtn, cart.length === 0 && styles.disabledBtn]} 
            onPress={() => printMutation.mutate({ items: cart, total: totalPrice })}
            disabled={printMutation.isPending || cart.length === 0}
          >
            {printMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="print-outline" size={24} color="#fff" />
                <Text style={styles.printBtnText}>Checkout & Print</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  scannerContainer: {
    height: "35%",
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  scanFramePaused: {
    borderColor: "#ffcc00",
  },
  scanText: {
    color: "#fff",
    marginTop: 15,
    fontSize: 14,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cartContainer: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#121212",
    marginTop: -20,
    paddingTop: 20,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cartTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  itemCount: {
    color: "#888",
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
    marginTop: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#1e1e1e",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    color: "#888",
    fontSize: 16,
  },
  totalValue: {
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
  },
  printBtn: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  disabledBtn: {
    backgroundColor: "#333",
  },
  printBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

