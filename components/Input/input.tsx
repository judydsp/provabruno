import { TextInputProps, View, TouchableOpacity } from "react-native";
import { CampoTexto } from "./style";
import { useState } from "react";

type InputTextoProps = TextInputProps & {
    erro: boolean;
    segura?: boolean
}

export default function InputTexto({ segura, erro, ...rest }: InputTextoProps) {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    return (
        <View>
            <CampoTexto
                erro={erro}
                placeholderTextColor={'#6C757D'}
                secureTextEntry={segura ? !senhaVisivel : false}
                {...rest}
            />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}></TouchableOpacity>
        </View>
    )
}
