import styled from "styled-components/native";
import { useEffect, useState } from "react";
import { Platform, Pressable, Alert } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { api } from "@/utils/api";
import { useRouter } from "expo-router";

export default function CadastroScreen() {
    // Estados dos campos
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');

    // Estados de erro
    const [erroEmail, setErroEmail] = useState(false);
    const [erroSenha, setErroSenha] = useState(false);
    const [erroRepetirSenha, setErroRepetirSenha] = useState(false);

    // Visibilidade da senha
    const [senhaVisivel, setSenhaVisivel] = useState(true);

    // Controle do botão
    const [formularioValido, setFormularioValido] = useState(true);

    const router = useRouter();

    // Validação de email
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInvalido = !emailRegex.test(email) || email === "teste@test.com";
        setErroEmail(emailInvalido);
        validarFormulario();
    }, [email]);

    // Validação da senha
    useEffect(() => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        setErroSenha(!passwordRegex.test(senha));
        validarFormulario();
    }, [senha]);

    // Verifica se as senhas são iguais
    useEffect(() => {
        setErroRepetirSenha(repetirSenha !== senha || repetirSenha === '');
        validarFormulario();
    }, [repetirSenha, senha]);

    // Habilita ou desabilita o botão com base nos campos
    const validarFormulario = () => {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email !== "teste@test.com";
        const senhaValida = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(senha);
        const repetirCorreto = repetirSenha === senha && repetirSenha !== '';
        setFormularioValido(!(emailValido && senhaValida && repetirCorreto));
    };

    // Função de cadastro
    async function cadastrar() {
        try {
            const resposta = await api.post('/usuarios', { email, senha });
            if(resposta.status === 201){
                alert('Sucesso ao cadastrar')
            }
            // Redireciona para home
            // router.push('/(home)/home');
        } catch (error: any) {
            if(error.response){
                console.log(error);
                if (error.response.status === 500) {
                    alert('Um erro inesperado ocorreu');
                } else if(error.response.status === 409) {
                    alert('Usuario já cadastrado');
                }
            }
            else{
                alert('erro de conexão')
            }
            
        }
    }

    return (
        <Container>
            <HeaderText>Crie sua conta</HeaderText>
            <SubText>Preencha os dados abaixo</SubText>

            {/* Campo de email */}
            <InputGroup error={erroEmail}>
                <StyledInput
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#999"
                />
            </InputGroup>
            {erroEmail && <ErrorText>Email inválido ou bloqueado</ErrorText>}

            {/* Campo de senha */}
            <InputGroup error={erroSenha}>
                <StyledInput
                    placeholder="Senha"
                    secureTextEntry={senhaVisivel}
                    value={senha}
                    onChangeText={setSenha}
                    placeholderTextColor="#999"
                />
                <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)}>
                    <Entypo name={senhaVisivel ? "eye" : "eye-with-line"} size={20} color="#333" />
                </Pressable>
            </InputGroup>
            {erroSenha && <ErrorText>Senha fraca (mínimo 8 caracteres, 1 maiúscula, 1 número, 1 símbolo)</ErrorText>}

            {/* Campo de repetir senha */}
            <InputGroup error={erroRepetirSenha}>
                <StyledInput
                    placeholder="Repetir Senha"
                    secureTextEntry={senhaVisivel}
                    value={repetirSenha}
                    onChangeText={setRepetirSenha}
                    placeholderTextColor="#999"
                />
            </InputGroup>
            {erroRepetirSenha && <ErrorText>As senhas não coincidem</ErrorText>}

            {/* Botão de cadastro */}
            <SubmitButton disabled={formularioValido} onPress={cadastrar}>
                <SubmitText>Cadastrar</SubmitText>
            </SubmitButton>
        </Container>
    );
}

// Estilos
const Container = styled.View`
    flex: 1;
    background-color: #f5f6fa;
    padding: 32px;
    justify-content: center;
`;

const HeaderText = styled.Text`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #2c3e50;
`;

const SubText = styled.Text`
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 30px;
`;

const InputGroup = styled.View<{ error: boolean }>`
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    border: 2px solid ${({ error }) => (error ? '#e74c3c' : '#dcdde1')};
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 12px;
`;

const StyledInput = styled.TextInput`
    flex: 1;
    font-size: 16px;
    color: #2c3e50;
`;

const SubmitButton = styled.Pressable<{ disabled: boolean }>`
    background-color: ${({ disabled }) => (disabled ? '#bdc3c7' : '#27ae60')};
    padding: 18px;
    border-radius: 10px;
    align-items: center;
    margin-top: 20px;
`;

const SubmitText = styled.Text`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
`;

const ErrorText = styled.Text`
    color: #e74c3c;
    font-size: 14px;
    margin-bottom: 8px;
    margin-left: 4px;
`;
