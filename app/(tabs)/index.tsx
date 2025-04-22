import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');

  function validarEmail(email: string | string[]) {
    return email.includes('@') && email.length >= 5;
  }

  function validarSenha(senha: string) {
    const regex = /^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{5,8}$/;
    return regex.test(senha);
  }

  async function cadastrar() {
    setMensagem('');

    if (!validarEmail(email)) {
      setMensagem('E-mail inválido');
      return;
    }

    if (!validarSenha(senha)) {
      setMensagem('Senha inválida');
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem('Senhas diferentes');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();
      setMensagem(data.mensagem);

    } catch (error) {
      setMensagem('Ocorreu um erro inesperado');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha:</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={styles.inputPassword}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          {mostrarSenha ? <Eye size={24} color="#333" /> : <EyeOff size={24} color="#333" />}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirmar Senha:</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarConfirmarSenha}
          style={styles.inputPassword}
        />
        <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
          {mostrarConfirmarSenha ? <Eye size={24} color="#333" /> : <EyeOff size={24} color="#333" />}
        </TouchableOpacity>
      </View>

      {mensagem ? <Text style={styles.message}>{mensagem}</Text> : null}

      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={cadastrar} color="#fb28ce" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffa6e6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
});

