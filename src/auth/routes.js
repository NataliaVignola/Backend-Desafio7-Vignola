import { Router } from 'express';
import passport from 'passport'; // Importa Passport
const router = Router();

// Importa el modelo de usuario
import User from '../models/User';

// Ruta para mostrar formulario de inicio de sesión
router.get('/login', (req, res) => {
    res.render('auth/login'); // "login.handlebars"
});

// Ruta para procesar el inicio de sesión
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/products', // Redirige a la vista de productos en caso de autenticación exitosa
        failureRedirect: '/auth/login', // Redirige de nuevo al inicio de sesión en caso de credenciales incorrectas
        failureFlash: true, // Activa mensajes flash en caso de error
    })
);

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('auth/register'); // "register.handlebars"
});

// Ruta para procesar el registro
router.post('/register', async (req, res) => {
    // Crea un nuevo usuario
    const newUser = new User({
        email: req.body.email,
        password: req.body.password, // Encripta la contraseña
        role: 'usuario', // Establece el rol del usuario
    });

    try {
        await newUser.save();
        // Nuevo usuario registrado
        req.session.user = {
            email: newUser.email,
            role: newUser.role,
        };
        return res.redirect('/products'); // Redirige a productos
    } catch (error) {
        // En caso de error, muestra un mensaje de error
        return res.render('auth/register', {
            error: 'Error al registrar el usuario',
        });
    }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout(); // Cierra la sesión de Passport
    res.redirect('/auth/login'); // Redirige a la vista de inicio de sesión
});

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de devolución de llamada de GitHub
router.get(
    '/github/callback',
    passport.authenticate('github', {
        successRedirect: '/products', // Redirige a la vista de productos en caso de autenticación exitosa
        failureRedirect: '/auth/login', // Redirige de nuevo al inicio de sesión en caso de error de autenticación de GitHub
        failureFlash: true, // Activa mensajes flash en caso de error
    })
);

export default router;
