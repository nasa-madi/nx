
// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import { toSql } from 'pgvector/knex';
import { logger } from './logger.js'
import {newDb} from 'pg-mem';
const memDb = newDb();


knex.QueryBuilder.extend('cosineDistanceAs', function(column, value, name) {
  return this.client.raw('?? <=> ? as ??', [column, toSql(value), name]);
});

export const postgresql = async (app) => {
  const config = app.get('postgresql')
  let db

  console.log(process.env.NODE_CONFIG_ENV)
  console.log(process.env.NODE_ENV)
  // Exceptions for local in memory postgres
  if(process.env.NODE_CONFIG_ENV === 'pgmem'){

    memDb.public.registerEquivalentSizableType({
      name: 'vector',
      equivalentTo: 'text',
      isValid(val) {
          return true;
      }
    })
    
    memDb.registerExtension('vector', (schema) => {
    })
    db = memDb.adapters.createKnex()
  }else{
    db = knex(config)
  }
  app.set('postgresqlClient', db)  
}


export const automigrate = async ({app},next) => {
  const config = app.get('postgresql')
  const db = app.get('postgresqlClient')

  if(config.automigrate || process.env.MIGRATE==='true'){
    logger.info('MIGRATE: Automigrating database')
    const list = await db.migrate.list()
    if(list[1].length > 0){
      await db.migrate.latest()
      logger.info('MIGRATE: Migrations complete')
  
    }else{
      logger.info('MIGRATE: Migrations skipped')
    }
  }
  await next()
}

export const autoseed = async ({app},next) => {
  const config = app.get('postgresql')

  if(config.autoseed || process.env.SEED==='true'){
    logger.info('SEED: Autoseeding database')      
    const db = app.get('postgresqlClient')
    const users = await db('users').select()
    if(users.length < 3){
      await db.seed.run()
      logger.info('SEED: Autoseeding complete')
    }else{
      logger.info('SEED: Autoseeding skipped')
    }
  }
  await next()
}