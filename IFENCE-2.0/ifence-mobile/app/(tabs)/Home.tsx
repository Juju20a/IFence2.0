import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import HeaderHomeUser from "@/components/HeaderHomeUser";
import { Link } from "expo-router";
import { useDaltonicColors } from "../hooks/useDaltonicColors";

const { width } = Dimensions.get("window"); // Pegando a largura da tela

const Home = () => {
  const colors = useDaltonicColors();
  return (
    <>
      <HeaderHomeUser />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.boxButtons}>
          <Link href={"/(tabs)/ListarCercas"} asChild>
            <TouchableOpacity style={styles.btnBoxButtons}>
              <Ionicons name="map-outline" size={32} color="#FFFFFF" style={styles.iconBtn} />
              <Text style={styles.textBtnBoxButtons}>Adicionar Cerca</Text>
            </TouchableOpacity>
          </Link>

          <Link href={"/(tabs)/AdicionarPulseiraScreen"} asChild>
            <TouchableOpacity style={styles.btnBoxButtons}>
              <Ionicons name="watch-outline" size={32} color="#FFFFFF" style={styles.iconBtn} />
              <Text style={styles.textBtnBoxButtons}>Adicionar Pulseira</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  boxButtons: {
    flexDirection: "row",
    marginTop: 60,
    justifyContent: "center",
    flexWrap: "wrap", // permite quebrar linha em telas pequenas
    gap: 10,
  },
  textBtnBoxButtons: {
    fontSize: 17,
    textAlign: "center",
    color: "#FFFFFF",
  },
  btnBoxButtons: {
    backgroundColor: "#003F88",
    padding: 10,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.4, // 40% da largura da tela
    marginHorizontal: 5,
    marginVertical: 10,
  },
  iconBtn: {
    marginBottom: 4,
    alignSelf: "center",
  },
});

export default Home;
