const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} = require('../models/projectModel');
const { toProject } = require('../schemas/resources');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects();
    return res.json({ projects: projects.map(toProject) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid project id' });
  }

  try {
    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ project: toProject(project) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'name and description are required' });
  }

  try {
    const project = await createProject({ name, description });
    return res.status(201).json({ project: toProject(project) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { name, description } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid project id' });
  }

  if (!name || !description) {
    return res.status(400).json({ message: 'name and description are required' });
  }

  try {
    const project = await updateProjectById(id, { name, description });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ project: toProject(project) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid project id' });
  }

  try {
    const project = await deleteProjectById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ project: toProject(project) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

module.exports = router;
