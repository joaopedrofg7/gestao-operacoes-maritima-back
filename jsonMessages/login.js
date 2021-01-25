module.exports = {
    user: {
        duplicate: {
            msg: "DuplicateValues",
            message: {
                eng: "Email already registered",
                pt: "O e-mail já se encontra registado!"
            },
            status: 409,
            success: false
        },
        invalid: {
            msg: "Invalid",
            message: {
                eng: "Invalid Login",
                pt: "Os dados que inseriu são inválidos!"
            },
            status: 400,
            success: false
        },
        signinSuccess: {
            msg: "Success",
            message: {
                eng: "Login with success",
                pt: "Login com sucesso!"
            },
            status: 200,
            success: true
        },
        signupSuccess: {
            msg: "Signup Success",
            message: {
                eng: "Signup with success",
                pt: "Registo efetuado com sucesso!"
            },
            status: 200,
            success: true
        },
        logoutSuccess: {
            msg: "Logout Success",
            message: {
                eng: "Logout with success",
                pt: "Sessão terminada com sucesso!"
            },
            status: 200,
            success: true
        },
        logoutError: {
            msg: "Logout Error",
            message: {
                eng: "You cannot logout. There is no active session",
                pt: "Não pode terminar sessão. Não existe nenhuma sessão ativa!"
            },
            status: 400,
            success: false
        }
    },
};