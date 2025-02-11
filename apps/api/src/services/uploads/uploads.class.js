import { BadRequest } from '@feathersjs/errors';


// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UploadService{

  constructor(options){
    this.app = options.app
  }

  async get(id, params){
    return await this.serviceSwitch('get', id, {...params, provider: null})
  }

  async patch(id, data, params){
    // only updates the source metadata
    if(params.file){
      throw new BadRequest('Cannot update file data directly. Please delete and reupload service')
    }
    return await this.serviceSwitch('patch', id, data, {...params, provider: null})
  }

  async find(params){
    return await this.serviceSwitch('find', {...params, provider: null})
  }

  async create(data,params){
    if(!params.file){
      throw new BadRequest('Requires a form-data "file" field.')
    }
    return await this.serviceSwitch('create', data, {...params, provider: null})
  }

  async remove(id,params){
    return await this.serviceSwitch('remove', id, {...params, provider: null})
  }

  async serviceSwitch(func, ...args){
    let params = args[args.length-1]
    let config = this.app.get('storage');
    let service = params?.query?.service || config?.default || 'gcs'
  
    switch(service){
      case 'gcs':
        return await this.app.service('gcs')[func](...args)
      default:
        throw new BadRequest(`Invalid storage service: ${service} in query or configuration`)
    }
  }

}

export const getOptions = (app) => {
  return {
    app
  }
}

export class UploadBaseService{

  async parseFile(filePath){
    return filePath
  }

  async prependPath(filePath){
    return filePath
  }

}

// eslint-disable-next-line no-unused-vars
export function getPathPrefix(_data, params, _options) {
  let { restrictToUser, user, plugin, restrictToPlugin } = params
  let userString = restrictToUser ? user.id : 'all'
  let pluginString = restrictToPlugin ? plugin : 'all'
  let prefix = `${pluginString}/${userString}/`
  return prefix
}

