import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useDaltonicColors } from "../hooks/useDaltonicColors";
import Header from "@/components/Header";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { useCercas } from "../../components/Cercas/hooks/useCercas";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Pulseira = {
  id: string;
  nome: string;
  ativa: boolean;
  cercaId: string;
};

const AdicionarPulseiraScreen: React.FC = () => {
  const { width } = useWindowDimensions(); // Responsivo
  const router = useRouter();
  const colors = useDaltonicColors();
  const [nomePulseira, setNomePulseira] = useState("");
  const [pulseiras, setPulseiras] = useState<Pulseira[]>([]);
  const [cercaSelecionada, setCercaSelecionada] = useState<string>("");
  const { cercas } = useCercas();
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoNomePulseira, setNovoNomePulseira] = useState("");

  const PULSEIRAS_STORAGE = "@pulseiras";

  const adicionarPulseira = () => {
    if (!nomePulseira || !cercaSelecionada) {
      Toast.show({ type: "error", text1: "Preencha todos os campos!" });
      return;
    }
    const novaPulseira: Pulseira = {
      id: Math.random().toString(36).substr(2, 9),
      nome: nomePulseira,
      ativa: true,
      cercaId: cercaSelecionada,
    };
    const novasPulseiras = [...pulseiras, novaPulseira];
    setPulseiras(novasPulseiras);
    salvarPulseiras(novasPulseiras);
    setNomePulseira("");
    setCercaSelecionada("");
    Toast.show({ type: "success", text1: "Pulseira adicionada!" });
  };

  const iniciarEdicao = (index: number) => {
    setEditandoIndex(index);
    setNovoNomePulseira(pulseiras[index].nome);
    setCercaSelecionada(pulseiras[index].cercaId);
  };

  const cancelarEdicao = () => {
    setEditandoIndex(null);
    setNovoNomePulseira("");
    setCercaSelecionada("");
  };

  const salvarEdicao = () => {
    if (editandoIndex === null) return;
    const novasPulseiras = [...pulseiras];
    novasPulseiras[editandoIndex].nome = novoNomePulseira;
    novasPulseiras[editandoIndex].cercaId = cercaSelecionada;
    setPulseiras(novasPulseiras);
    salvarPulseiras(novasPulseiras);
    cancelarEdicao();
    Toast.show({ type: "success", text1: "Pulseira editada!" });
  };

  const deletarPulseira = (index: number) => {
    const novasPulseiras = pulseiras.filter((_, i) => i !== index);
    setPulseiras(novasPulseiras);
    cancelarEdicao();
    Toast.show({ type: "info", text1: "Pulseira excluída!" });
  };

  const alternarSwitch = (index: number, novoValor: boolean) => {
    const novasPulseiras = [...pulseiras];
    novasPulseiras[index].ativa = novoValor;
    setPulseiras(novasPulseiras);
  };

  const salvarPulseiras = async (pulseiras: Pulseira[]) => {
    try {
      await AsyncStorage.setItem(PULSEIRAS_STORAGE, JSON.stringify(pulseiras));
    } catch (error) {
      console.error("Erro ao salvar pulseiras:", error);
    }
  };

  const carregarPulseiras = async () => {
    try {
      const pulseirasSalvas = await AsyncStorage.getItem(PULSEIRAS_STORAGE);
      return pulseirasSalvas ? JSON.parse(pulseirasSalvas) : [];
    } catch (error) {
      console.error("Erro ao carregar pulseiras:", error);
      return [];
    }
  };

  useEffect(() => {
    const inicializarPulseiras = async () => {
      const pulseirasCarregadas = await carregarPulseiras();
      setPulseiras(pulseirasCarregadas);
    };
    inicializarPulseiras();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={[styles.titulo, { color: colors.title }]}>Adicionar pulseira</Text>

          <View style={[styles.card, { backgroundColor: colors.infoBox, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.title }]}>Nome da pulseira:</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.title,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              value={nomePulseira}
              onChangeText={setNomePulseira}
            />

            <Text style={[styles.label, { color: colors.title }]}>Selecione uma cerca:</Text>
            <Picker
              selectedValue={cercaSelecionada}
              onValueChange={(itemValue) => setCercaSelecionada(itemValue)}
            >
              <Picker.Item label="Selecione uma cerca" value="" />
              {cercas.map((c) => (
                <Picker.Item key={String(c.id)} label={c.nome} value={String(c.id)} />
              ))}
            </Picker>

            <View style={[styles.botoes, { flexDirection: width < 400 ? "column" : "row" }]}>
              <TouchableOpacity
                style={[styles.botaoAdicionar, { backgroundColor: colors.button, minWidth: width * 0.28 }]}
                onPress={adicionarPulseira}
              >
                <Text style={[styles.textoBotao, { color: colors.buttonText }]}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoCancelar, { backgroundColor: colors.button, minWidth: width * 0.28 }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.textoBotao, { color: colors.buttonText }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.titulo, { color: colors.title }]}>Pulseiras Cadastradas:</Text>

          {pulseiras.map((item, index) => {
            const cercaAtribuida = cercas.find((c) => c.id === item.cercaId);
            return (
              <View
                key={item.id || index}
                style={[styles.card, { backgroundColor: colors.infoBox, borderColor: colors.border }]}
              >
                {editandoIndex === index ? (
                  <View style={[styles.cardEdicao, { backgroundColor: colors.infoBox, borderColor: colors.border }]}>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          color: colors.title,
                          borderColor: colors.border,
                          backgroundColor: colors.background,
                        },
                      ]}
                      value={novoNomePulseira}
                      onChangeText={setNovoNomePulseira}
                    />
                    <Picker
                      selectedValue={cercaSelecionada}
                      onValueChange={(itemValue) => setCercaSelecionada(itemValue)}
                    >
                      <Picker.Item label="Selecione uma cerca" value="" />
                      {cercas.map((c) => (
                        <Picker.Item key={c.id} label={c.nome} value={c.id} />
                      ))}
                    </Picker>
                    <View style={[styles.botoes, { flexDirection: width < 400 ? "column" : "row" }]}>
                      <TouchableOpacity
                        style={[styles.botaoadd, { backgroundColor: colors.button, minWidth: width * 0.28 }]}
                        onPress={salvarEdicao}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Salvar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botaoCancell, { backgroundColor: colors.button, minWidth: width * 0.28 }]}
                        onPress={cancelarEdicao}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botaoExcluir, { backgroundColor: colors.button, minWidth: width * 0.28 }]}
                        onPress={() => deletarPulseira(index)}
                      >
                        <Text style={[styles.textoBotaoedit, { color: colors.buttonText }]}>Excluir
