-- Force update Pedro Nunes avatar to a known working URL
UPDATE profiles
SET avatar_url = 'https://ui-avatars.com/api/?name=Pedro+Nunes&background=random&size=256'
WHERE email = 'pedron252@gmail.com';
