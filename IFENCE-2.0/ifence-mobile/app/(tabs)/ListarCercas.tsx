import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert, ScrollView, useWindowDimensions } from "react-native";
import Header from "@/components/Header";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useCercas } from "@/components/Cercas/hooks/useCercas";
import CercaTable from "@/components/Cercas/components/CercaTable";
import { CercaModal } from "@/components/Cercas/components/CercaModal";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";

const ListarCercas = () => {
  const colors = useDaltonicColors();
  const { cercas, loading, addCerca, updateCerca, deleteCerca } = useCercas();
  const [modalVisible, setModalVisible] = useState(false);
  const [cercaEditando, setCercaEditando] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [raio, setRaio] = useState("");
  const params = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();  // Responsividade aqui

  // seus useEffects...

  const [horarioInicio, setHorarioInicio] = useState(new Date());
  const [horarioFim, setHorarioFim] = useState(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFimPicker, setShowFimPicker] = useState(false);

  // Funções handleCriar, handleSalvar, onChangeInicio, onChangeFim...

  return (
    <>
      <Header />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Link href={"/(tabs)/Home"} asChild>
            <TouchableOpacity style={styles.btnBackPage}>
              <Image source={require("@/assets/images/ArrowBack.png")} />
            </TouchableOpacity>
          </Link>
          <Text style={[styles.titulo, { color: colors.title }]}>Cadastrar Nova Cerca</Text>

          <View style={[styles.formContainer, { backgroundColor: colors.infoBox }]}>
            {/* Seus inputs */}

            <View
              style={{
                flexDirection: width < 500 ? "column" : "row",  // linha ou coluna conforme largura
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.button, flex: 1, minWidth: width < 500 ? "100%" : "48%" },
                ]}
                onPress={handleCriar}
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.infoBox, flex: 1, minWidth: width < 500 ? "100%" : "48%" },
                ]}
                onPress={() => router.push('/(tabs)/Home')}
              >
                <Text style={[styles.buttonText, { color: colors.infoText }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.titulo, { color: colors.title }]}>Cercas Cadastradas</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator style={{ flexGrow: 0, backgroundColor: colors.infoBox }}>
            <View style={{ minWidth: 600, flex: 1 }}>
              {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
              ) : (
                <CercaTable
                  cercas={cercas.map((c) => ({
                    id: c.id,
                    nome: c.nome,
                    coordenadas: `${c.latitude}, ${c.longitude}`,
                  }))}
                  onEdit={(cerca: any) => {
                    const original = cercas.find((c) => c.id === cerca.id);
                    if (original) {
                      setCercaEditando({
                        id: original.id,
                        nome: original.nome,
                        latitude: original.latitude,
                        longitude: original.longitude,
                        raio: original.raio,
                        horarioInicio: original.horarioInicio,
                        horarioFim: original.horarioFim,
                      });
                    } else {
                      setCercaEditando(null);
                    }
                    setModalVisible(true);
                  }}
                  onDelete={(id: string | number) => deleteCerca(id)}
                />
              )}
            </View>
          </ScrollView>
        </ScrollView>

        <CercaModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSalvar}
          cercaParaEditar={cercaEditando}
        />
      </View>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  formContainer: { marginBottom: 24, padding: 12, borderRadius: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  disableInput: {},
  labelsInfo: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
  },
  btnAbrirMapa: {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  btnAbrirMapaText: {
    fontWeight: "bold",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  btnBackPage: {
    alignSelf: "flex-start",
    marginLeft: 0,
  },
  button: {
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ListarCercas;
