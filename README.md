# Bitfreelancers

Dapp (Distributed App) que permite a freelancers ofrecer sus servicios, y ser contratados por clientes
usando el concepto de pago garantizado avalada por deposito inicial de ambas partes.

Se trata de un projecto node.js que utiliza React.js y Next.js como frameworks de frontend, Mocha como
framework de tests y scripts personalizados para las tareas de compilacion y deploy, pudiendose
probar facilmente, tanto en local (con ganache-cli o ganache) como en testnets (por ejemplo en Rinkeby).

No utiliza el framework Truffle.

## Dependencias y prerrequisitos

- node.js
- ganache-cli ( o ganache )
- navegador web con plugin Metamask instalado (por ejemplo Chrome)

## Versiones node y npm

```
node --version
v8.12.0

npm --version
6.4.1
```

## Paquetes npm instalados globalmente

```
npm list -g --depth 0
/home/ana/.nvm/versions/node/v8.12.0/lib
├── @angular/cli@7.0.5
├── create-react-app@2.1.1
├── eslint@5.9.0
├── ethers-ens@0.2.1
├── ganache-cli@6.1.8
├── npm@6.4.1
├── solc@0.4.25
├── subdownloader@2.0.1
└── truffle@4.1.14
```

## Instalar dependencias

```
npm install
```

## Observaciones previas

El proyecto utiliza las variables de entorno para tareas de deploy y llamadas del backend a web3 cuando no es inyectado por el navegador (metamask no instalado o no activo)

Estos son sus nombres y valores por defecto:

`ETHEREUM_NETWORK` con valor por defecto `http://127.0.0.1:8545`
`ETHEREUM_MNEMONIC` con valor por defecto `'arctic market penalty various glue runway cliff rose shrimp ticket drop home'`

Para personalizar su valor, usar
`export NOMBRE_VARIABLE=valor_variable` o `NOMBRE_VARIABLE='valor_variables_con_espacios'`

Ejemplo:

```
export ETHEREUM_NETWORK=https://rinkeby.infura.io/v3/ac438bab1dea49479c947908f8c2ced5
export ETHEREUM_MNEMONIC='arctic market penalty various glue runway cliff rose shrimp ticket drop home'
```

## En un terminal (compilar, ejecutar los tests y lanzar ganache-cli)

```
cd ethereum
node compile.js
```

Si el resultado de la compilacion fue exitosa, en la carpeta build quedan los .json resultantes. Si no, es porque hubo un error de compilacion. Puede comprobarse los errores copiando y pegando el contenido de Freelancer.sol en remix.

```
ls build
```

Opcionalmente, puede ejecutar los tests

```
npm run test
```

Si deseamos hacer la puesta en marcha en local `ETHEREUM_NETWORK=http://127.0.0.1:8545`,
para tener saldo en las cuentas que usemos con metamask en la red local que levantemos con
`ganache-cli` hay configurar el mnemonico utilizado por metamask (seed phrase) y nuestra
variable de entorno `ETHEREUM_MNEMONIC` con el mismo valor y lanzar `ganache-cli` asi:

```
export ETHEREUM_MNEMONIC='<ponga_aqui_su_mnemonico_(seed_words)>'
ganache-cli -m "$ETHEREUM_MNEMONIC"
```

## En otro terminal (deploy del contrato factory, build next.js, run server)

```
export ETHEREUM_NETWORK=http://127.0.0.1:8545
export ETHEREUM_MNEMONIC='<ponga_aqui_su_mnemonico_(seed_words)>'
cd ethereum
node deploy.js
```

Observacion: deploy.js crea automaticamente el fichero FreelancerFactoryDeployedAddress.js,
que contiene la direccion donde se ha hecho el deploy del contrato FreelancerFactory

```
npm run build
npm run dev
```

## En el navegador

Abrir el navegador y apuntar a http://localhost:3000

Hacer login en metamask usando como seed phrase el valor de nuestra variable de entorno ETHEREUM_MNEMONIC o
alternativamente, obtener el valor de seed phrase (Settings -> Reveal Seed Words) y asignar esas palabras
a nuestra variable de entorno ETHEREUM_MNEMONIC

Interactuar con la Dapp (crear un Freelancer, que un cliente lo contrate, y finalmente lo valide, ...)

Observacion: si se reinicia ganache-cli metamask detecta el estado fuera de secuencia y deja de funcionar (Solucion: Metamask -> Settings -> Reset Account)

---

### Mis comandos todo-en-uno (terminal 1)

```
cd ethereum ; node compile.js ; ll build ; npm run test ; export ETHEREUM_MNEMONIC='arctic market penalty various glue runway cliff rose shrimp ticket drop home' ; ganache-cli -m "$ETHEREUM_MNEMONIC"
```

### Mis comandos todo-en-uno (terminal 2)

```
export ETHEREUM_NETWORK=http://127.0.0.1:8545 ; export ETHEREUM_MNEMONIC='arctic market penalty various glue runway cliff rose shrimp ticket drop home' ; cd ethereum ; node deploy.js ; npm run build ; npm run dev
```
