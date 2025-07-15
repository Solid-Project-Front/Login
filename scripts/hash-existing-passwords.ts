import { db } from '../src/lib/db';
import { hashPassword } from '../src/lib/utils/password';

async function hashExistingPasswords() {
    try {
        const users = await db.user.findAll();
        
        for (const user of users) {
            const hashedPassword = await hashPassword(user.password);
            await db.user.update(user.id, { password: hashedPassword });
            console.log(`Actualizada la contraseña para el usuario: ${user.username}`);
        }
        
        console.log('Todas las contraseñas han sido actualizadas exitosamente');
    } catch (error) {
        console.error('Error al actualizar las contraseñas:', error);
    }
}

hashExistingPasswords(); 