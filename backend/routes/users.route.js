import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, login } from '../controllers/users.controller.js';

const router = express.Router();


router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login);


export default router;
