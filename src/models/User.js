import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'usuario',
    },
    githubId: String, // Campo para almacenar el ID de GitHub
    githubAccessToken: String, // Campo para almacenar el token de acceso de GitHub
});

const User = model('User', userSchema);

export default User;
