# Covid19 Bilan

Sources du site web [Covid19Bilan.fr](https://Covid19Bilan.fr)

L'objectif est de présenter le nombre de cas Covid19 confirmés en France, par régions et par départements.

Ce site est fait pour une consultation sur téléphone/tablette. 

Il est basé sur des données provenant du repository github [https://github.com/opencovid19-fr/](https://github.com/opencovid19-fr/) qui se base sur des sources publiques pour agglomérer les données de base.

Ce projet fournit une interface d'accès à ces données pour mobile et utilise un proxy serveur pour limiter le volume de communication et fournir une expérience utlisateur rapide. 

Le proxy serveur est réalisé via la plateforme Serverless Function-as-a-Service pour JavaScript.

N'hésitez pas à contribuer si vous le désirez.

## Requirements

Node.js latest 8.x or above

## Setup

### Install

- Clone the project
- Run `npm install`

### Login to WarpJS

Run the following command once to authenticate to your [WarpJS account](https://starbase.warpjs.com/):

```bash
$ npx warp login
```

## Run

```bash
# run a dev server
$ npm run dev

# build & deploy to prod
$ npm run deploy
```

## Resources

- [Getting started with WarpJS](https://warpjs.dev/docs/getting-started)
- [https://github.com/opencovid19-fr/](https://github.com/opencovid19-fr/)

