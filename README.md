
## Instruções de instalação
### Pré-requisitos

- Git
- MySQL e MySQL Workbench
- Python (versão 3.8)
- Node.js (versão 19.5)
- React Js
- NPM (gerenciador de pacotes do Node.js)
- pip (gerenciador de pacotes do Python)
- Jupyter notebook


### 1. Clonar o repositório

Clone este repositório para o seu ambiente local:

 ```
   git clone https://github.com/henriqueramosqs/unireview
 ```

### 2. Configurar o banco de dados

Crie uma database (ou schema) no seu servidor MySQL, copie o arquivo dump.js para o espaço de query
do Workbench e execute

### 3. Inserção de dados
Vá para a pasta ./database_insertion, use o pip para instalar o numpy, o pandas e o mysql connector:

 ```
  pip install pandas 
  pip install numpy
  pip install mysql-connector
 ```

Em sequita mude os parametros da conexao no arquivo data_insertion.ipynb e execute este notebook célula à celula

### 4. Back end

Vá para a pasta ./unireview-back, use o npm para instalar o express, o cors e mysql:

 ```
  npm install express
  npm install cors
  npm install mysql
 ```

Mais uma vez, mude os parametros da conexao no arquivo main.js e execute o arquivo com
 ```
  node main.js
 ```
### 5. Front end

Vá para a pasta ./unireview-front, use o npm install para instalar pacotes necessários

 ```
  npm install
 ```

 A aplicação estará disponível em localhost:3000 e poderá ser acessada em qualquer navegador



