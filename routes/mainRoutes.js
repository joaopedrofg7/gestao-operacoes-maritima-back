const router = require('express').Router();
const utilizadorMessages = require('../jsonMessages/utilizador');
const equipaController = require('../controllers/equipaController');
const materialController = require('../controllers/materialController');
const ocorrenciaController = require('../controllers/ocorrenciaController');
const ocorrenciaMaterialController = require('../controllers/ocorrenciaMaterialController');
const ocorrenciaVoluntarioController = require('../controllers/ocorrenciaVoluntarioController');
const operacionalController = require('../controllers/operacionalController');
const utilizadorController = require('../controllers/utilizadorController');
const voluntarioController = require('../controllers/voluntarioController');
const localController = require('../controllers/localController');
const dashboardController = require('../controllers/dashboardController');


const isAuthenticated = require('../config/middleware/isAuthenticated');
const isGestorOperacoes = require('../config/middleware/isGestorOperacoes');
const isAdministrador = require('../config/middleware/isAdministrador');

router.get("/", function (req, res) {
    res.send("Pagina principal");
});

//Rota quando o isAuthenticated falha
router.get("/loginRequired", function (req, res){
    res.status(utilizadorMessages.utilizador.loginObrigatorio.status).send(utilizadorMessages.utilizador.loginObrigatorio);
});

//Rotas Utilizadores
router.get('/users', isAuthenticated, isAdministrador, utilizadorController.read);
router.get('/users/:username', isAuthenticated, isAdministrador, utilizadorController.readID);
router.get('/usersProfile', isAuthenticated, utilizadorController.readProfile);
router.put('/usersProfile', isAuthenticated,utilizadorController.updateProfile);
router.put('/usersRecoverPassword', utilizadorController.userRecoverPassword);
router.put('/usersProfileName', isAuthenticated, utilizadorController.updateUserProfile);
router.put('/usersProfilePassword', isAuthenticated, utilizadorController.updateUserPassword);

//Rotas Materiais

router.get('/materials', isAuthenticated, materialController.read);
router.get('/materials/:id_material', isAuthenticated, materialController.readID);
router.put('/materials/:id_material/increase', isAuthenticated, isGestorOperacoes, materialController.updateQuantity);
router.put('/materials/:id_material/decrease', isAuthenticated, isGestorOperacoes, materialController.updateQuantityDamaged);
router.post('/materials', isAuthenticated, isGestorOperacoes, materialController.saveMaterial);

//Rotas Ocorrencias

router.get('/occurrences', isAuthenticated, ocorrenciaController.read);
router.get('/occurrences/:id_occurrence', isAuthenticated, ocorrenciaController.readID);
router.get('/occurrencesFinished', isAuthenticated, ocorrenciaController.readFinished);
router.get('/occurrencesInProgress', isAuthenticated, ocorrenciaController.readInProgress);
router.get('/occurrencesOnHold', isAuthenticated, ocorrenciaController.readOnHold);
router.put('/occurrences/:id_occurrence/accept', isAuthenticated, isGestorOperacoes, ocorrenciaController.updateAcceptOccurrence);
router.put('/occurrences/:id_occurrence/finish', isAuthenticated, isGestorOperacoes, ocorrenciaController.updateFinishOccurrence);
router.put('/occurrences/:id_occurrence/teams/:id_team', isAuthenticated, isGestorOperacoes, ocorrenciaController.updateOccurrenceTeam);
router.post('/occurrences/:id_occurrence/materials/:id_material', isAuthenticated, isGestorOperacoes, ocorrenciaController.saveOccurrenceMaterial);
router.post('/occurrences/:id_occurrence/volunteers/:id_voluntary', isAuthenticated, isGestorOperacoes, ocorrenciaController.saveOccurrenceVoluntary);

//Rotas Voluntarios

router.get('/volunteers', isAuthenticated, voluntarioController.read);
router.get('/volunteers/:id_voluntary', isAuthenticated, voluntarioController.readID);
router.get('/volunteersOnHold', isAuthenticated, voluntarioController.readOnHold);
router.get('/volunteersAvailable', isAuthenticated, voluntarioController.readAvailable);
router.put('/volunteers/:id_voluntary', isAuthenticated, voluntarioController.updateVoluntary);
router.put('/volunteers/:id_voluntary/accept', isAuthenticated, voluntarioController.updateAcceptSituation);
router.put('/volunteers/:id_voluntary/reject', isAuthenticated, voluntarioController.updateRejectSituation);
router.post('/volunteers', voluntarioController.saveVoluntary);

//Rotas Equipas

router.get('/teams', isAuthenticated, equipaController.read);
router.get('/teamsAvailable', isAuthenticated, equipaController.readAvailable);
router.get('/teams/:id_team', isAuthenticated, equipaController.readID);
router.post('/teams', isAuthenticated, isGestorOperacoes, equipaController.saveTeam);

//Rotas Operacionais

router.get('/operationals', isAuthenticated, operacionalController.read);
router.get('/operationals/:id_operational', isAuthenticated, operacionalController.readID);
router.put('/operationals/:id_operational/points', isAuthenticated, isGestorOperacoes, operacionalController.updatePoints);
router.put('/operationals/:id_operational/teams/:id_team', isAuthenticated, isGestorOperacoes, operacionalController.updateOperationalTeam);
router.put('/operationals/:id_operational/schedule', isAuthenticated, isGestorOperacoes, operacionalController.updateHorario);
router.put('/operationals/:id_operational/edit', isAuthenticated, isGestorOperacoes, operacionalController.updateOperacional);
router.get('/operationalsAvailable', isAuthenticated, operacionalController.readAvailable);
router.get('/operationalsEquipa/:id_equipa',isAuthenticated, operacionalController.readEquipa);


//Rotas OcorrenciaMaterial
router.get('/occurrences/:id_occurrence/materials', isAuthenticated, ocorrenciaMaterialController.readID);

//Rotas OcorrenciaVoluntario
router.get('/occurrences/:id_occurrence/volunteers', isAuthenticated, ocorrenciaVoluntarioController.readID);

//ROTA LOCAL
router.get('/local/:id_local',isAuthenticated, localController.readOccurenceAddress);

//ROTAS PARA DASHBOARD
router.get('/dashboard/OperacionaisAtivos',isAuthenticated, dashboardController.readOperacionaisDashboard);
router.get('/dashboard/Top3Local', isAuthenticated, dashboardController.readTop3Local);
router.get('/dashboard/NumPorNivel', isAuthenticated, dashboardController.readNumNivel);
router.get('/OcorenciasAno', isAuthenticated, dashboardController.readOcorenciasAno);

module.exports = router;