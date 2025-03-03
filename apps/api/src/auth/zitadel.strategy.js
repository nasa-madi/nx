import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { OAuthStrategy } from '@feathersjs/authentication-oauth';
import { NotAuthenticated } from '@feathersjs/errors';
import { createDebug } from '@feathersjs/commons';
import { logger } from '../logger.js';


export class ZitadelStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    console.log('Zitadel Profile:', profile);

    const baseData = await super.getEntityData(profile);
    
    return {
      ...baseData,
      email: profile.email,
      name: profile.name,
      zitadelId: profile.sub, // Zitadel User ID
    };
  }
}

module.exports = (app) => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('zitadel', new ZitadelStrategy());

  app.use('/authentication', authentication);
};