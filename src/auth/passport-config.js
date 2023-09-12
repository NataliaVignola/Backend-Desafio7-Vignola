import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// Configura la estrategia de autenticación local
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return done(null, false, {
                message: 'Usuario no encontrado'
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            return done(null, user);
        } else {
            return done(null, false, {
                message: 'Contraseña incorrecta'
            });
        }
    } catch (err) {
        return done(err);
    }
}));

// Configura la estrategia de autenticación de GitHub
passport.use(new GitHubStrategy({
    clientID: 'tu-client-id',
    clientSecret: 'tu-client-secret',
    callbackURL: 'http://localhost:8080/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
    // Falta remplazo de las credenciales de GitHub.
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
