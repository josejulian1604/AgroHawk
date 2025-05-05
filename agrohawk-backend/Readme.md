Las carpetas node_modules y el archivo .env se incluyen dentro del .gitignore.

Para la carpeta node_modules Ejecutar:
cd agrohawk-backend
npm install

Para el archivo .env
Crear un archivo llamado .env dentro de agrohawk-backend
Agregar lo siguiente:
MONGO_URI=mongodb+srv://<SuUsuario>:<SuContraseña>@cluster0.5i782uw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000