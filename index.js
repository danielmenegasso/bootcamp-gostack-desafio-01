const express = require("express");

const server = express();

/**
 * Habilita o parser de JSON para as requisições no server
 */
server.use(express.json());

/**
 * Variável projects que irá conter toda a lista de projetos.
 * mesmo sendo const um array pode receber adições e / ou exclusões
 */
const projects = [];

/**
 * Middleare que checa se um projeto existe pelo seu id
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  if (!projects.find(p => p.id == id)) {
    return res.status(400).json({ error: "Project not found" });
  }

  next();
}

/**
 * Middleare que conta o numero de requisições
 */
function requestCount(req, res, next) {
  console.count("Número de Requisições");

  return next();
}

server.use(requestCount);

/**
 * Rota que retorna todos os projetos
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Route body: id, title
 * Rota que adiciona um projeto a lista de projetos
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

/**
 * Route body: title
 * Route params: id
 * Rota que adiciona uma tarefa a um projeto identificado pelo 'id' na lista de projetos
 */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

/**
 * Route body: title
 * Route params: id
 * Rota que atualiza o titulo de um projeto identificado pelo 'id' na lista de projetos
 */
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(p => p.id == id);

  project.title = title;

  return res.json({ projects });
});

/**
 * Route params: id
 * Rota que remove um projeto identificado pelo 'id' da lista de projetos
 */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  let projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen("3000", () => console.log("App runing on 3000"));
