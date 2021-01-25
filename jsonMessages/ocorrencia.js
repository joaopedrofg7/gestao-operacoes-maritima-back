module.exports = {
    ocorrencia: {
        requiredData: {
            msg: "dataMissing",
            message: {
                eng: "Required fields are missing",
                pt: "Falta preencher dados obrigatórios"
            },
            success: false,
            status: 400,
        },
        estadoErrado: {
            msg: "estadoErrado",
            message: {
                eng: "Occurrence cannot be accepted!",
                pt: "Ocorrencia nao pode ser aceite!"
            },
            success: false,
            status: 400,
        },
    },
};