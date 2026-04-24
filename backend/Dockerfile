FROM node:18

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências (incluindo o CORS que você adicionou)
RUN npm install

# Copia o resto dos arquivos (o server.js vai para a raiz de /app)
COPY . .

# Comando para iniciar (como o server.js está na raiz de /app agora, use apenas o nome dele)
CMD ["node", "server.js"]