module.exports = {
    material: {
        requiredData: {
            msg: "dataMissing",
            message: {
                eng: "Required fields are missing",
                pt: "Falta preencher dados obrigatórios"
            },
            success: false,
            status: 400,
        },
        materialInsuficiente: {
            msg: "materialInsuficiente",
            message: {
                eng: "Not enough material!",
                pt: "Material insuficiente!"
            },
            success: false,
            status: 400,
        },
        materialExistente: {
            msg: "materialExistente",
            message: {
                eng: "Material is already in use!",
                pt: "Material já em uso!"
            },
            success: false,
            status: 409,
        },
        quantidadeNecessaria: {
            msg: "quantidadeNecessaria",
            message: {
                eng: "Quantity can't be 0!",
                pt: "Quantidade não pode ser 0!"
            },
            success: false,
            status: 400,
        },
    },
};