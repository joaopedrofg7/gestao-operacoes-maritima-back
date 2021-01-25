module.exports = {
    utilizador: {
        requiredData: {
            msg: "dataMissing",
            message: {
                eng: "Required fields are missing",
                pt: "Falta preencher dados obrigatórios"
            },
            success: false,
            status: 400,
        },
        emailInvalido: {
            msg: "emailInvalido",
            message: {
                eng: "Invalid email!",
                pt: "Email invalido!"
            },
            success: false,
            status: 400,
        },
        passwordIncompativel: {
            msg: "passwordIncompativel",
            message: {
                eng: "Passwords don't match!",
                pt: "As passwords não são iguais!"
            },
            success: false,
            status: 400,
        },
        acessoNegado: {
            msg: "acessoNegado",
            message: {
                eng: "Dont have permission!",
                pt: "Não tem permissão!"
            },
            success: false,
            status: 403,
        },
        loginObrigatorio: {
            msg: "loginObrigatorio",
            message: {
                eng: "Login Required!",
                pt: "Obrigatório realizar login!"
            },
            success: false,
            status: 401,
        },
        emailEnviado: {
            msg: "emailEnviado",
            message: {
                eng: "Email sent with success!",
                pt: "Email enviado com sucesso!"
            },
            success: true,
            status: 200,
        },
    },
};