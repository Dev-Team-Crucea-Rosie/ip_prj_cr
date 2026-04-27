const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const { toPerson } = require('../schemas/resources');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    isCoordinator = false,
    isAdministrator = false,
  } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'firstName, lastName, email and password are required' });
  }

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      isCoordinator,
      isAdministrator,
    });

    const person = toPerson(user);
    delete person.password;

    return res.status(201).json({ user: person });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET is not set' });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isCoordinator: user.is_coordinator,
        isAdministrator: user.is_administrator,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const person = toPerson(user);
    delete person.password;

    return res.json({ token, user: person });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login', error: error.message });
  }
});

module.exports = router;
