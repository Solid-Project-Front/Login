-- Agregar campos para reset de contraseña
ALTER TABLE `users` ADD COLUMN `reset_token` text;
ALTER TABLE `users` ADD COLUMN `reset_token_expiry` text;