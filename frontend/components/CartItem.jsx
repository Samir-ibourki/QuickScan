import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CartItem = ({ item, onRemove, onUpdateQty }) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price} DH</Text>
      </View>
      
      <View style={styles.actions}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity 
            onPress={() => onUpdateQty(item.barcode, -1)}
            style={styles.qtyBtn}
          >
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.qtyText}>{item.qty}</Text>
          
          <TouchableOpacity 
            onPress={() => onUpdateQty(item.barcode, 1)}
            style={styles.qtyBtn}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onRemove(item.barcode)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333",
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    color: "#4CAF50",
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    marginRight: 10,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  deleteBtn: {
    padding: 5,
  },
});

export default CartItem;
