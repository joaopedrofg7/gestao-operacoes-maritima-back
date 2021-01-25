module.exports = {
    voluntario: {
        requiredData: {
            msg: "dataMissing",
            message: {
                eng: "Required fields are missing",
                pt: "Falta preencher dados obrigatórios"
            },
            success: false,
            status: 400,
        },
        nomeInvalido: {
            msg: "nomeInvalido",
            message: {
                eng: "Invalid name!",
                pt: "Nome é inválido!"
            },
            success: false,
            status: 400,
        },
        idadeInvalida: {
            msg: "idadeInvalida",
            message: {
                eng: "Age must be a number!",
                pt: "Idade necessita de ser um número!"
            },
            success: false,
            status: 400,
        },
        idadeProibida: {
            msg: "idadeProibida",
            message: {
                eng: "Must be over 18 years!",
                pt: "Tem de ter 18 anos ou mais!"
            },
            success: false,
            status: 400,
        },
        emailInvalido: {
            msg: "emailInvalido",
            message: {
                eng: "Invalid email!",
                pt: "Email inválido!"
            },
            success: false,
            status: 400,
        },
        emailDuplicado: {
            msg: "emailDuplicado",
            message: {
                eng: "Email is already used!",
                pt: "Email já utilizado!"
            },
            success: false,
            status: 409,
        },
        situacaoInvalida: {
            msg: "situacaoInvalida",
            message: {
                eng: "Situation is incorrect!",
                pt: "Situação incorreta!"
            },
            success: false,
            status: 400,
        },
        textoInvalido: {
            msg: "textoInvalido",
            message: {
                eng: "Invalid text length!",
                pt: "Tamanho do texto inválido!"
            },
            success: false,
            status: 400,
        },
        voluntarioIndisponivel: {
            msg: "voluntarioIndisponivel",
            message: {
                eng: "Volunteer is unavailable!",
                pt: "Voluntário está indisponivel!"
            },
            success: false,
            status: 400,
        },
    },
};