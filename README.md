A solução utiliza uma plataforma web para plotagem de coordenadas no mapa e um aplicativo multi-plataforma para as viaturas.

Para rodar a plataforma web é necessario ter node instalado na maquina, clonar o repositorio, rodar npm install e npm start.

A plataforma web utiliza o MEAN STACK e se baseia no uso de socket para realizar a comunicação no momento de chegada de uma ocorrencia. O backend foi escrito em NODEJS e foram expostas api's para serem consumidas pela aplicação web e aplicativo,
lançando um broadcast para todos os apps que estejam ouvindo no canal, os mesmos retornam sua localização para plotagem no mapa.

O aplicativo foi criado utilizando conceito de multi-pltaforma com o framework IONIC, para flexibilidade do uso de plataformas e pode ser encontrado no repositorio (Hackaton-unibh-201-app) 

## teste server

Run `npm start` for a dev server. Navigate to `http://localhost:3000/`.


