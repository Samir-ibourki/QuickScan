import { useMutation } from "@tanstack/react-query";
import { posService } from "../api/axios";
import { Alert } from "react-native";

export const usePOS = ({ onSuccessProduct, onResumeScanning, onSuccessPrint }) => {
  const productMutation = useMutation({
    mutationFn: posService.getProduct,
    onSuccess: (product) => {
      onSuccessProduct(product);
      onResumeScanning();
    },
    onError: () => {
      Alert.alert("Erreur", "Produit introuvable.");
      onResumeScanning();
    },
  });

  const printMutation = useMutation({
    mutationFn: posService.printReceipt,
    onSuccess: () => {
      Alert.alert("Succès", "Le ticket a été envoyé à l'imprimante.");
      onSuccessPrint();
    },
    onError: () => {
      Alert.alert("Erreur d'impression", "Impossible de contacter le serveur d'impression.");
    },
  });

  return {
    productMutation,
    printMutation,
    isLoading: productMutation.isPending || printMutation.isPending,
  };
};
