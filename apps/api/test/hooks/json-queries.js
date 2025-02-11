// api/src/hooks/jsonFilter.js
// import * as knexPkg from 'knex';

// const { knex } = knexPkg.default; // workaround for typescript compatability 
import { Type } from '@feathersjs/typebox';
import { expect } from 'chai';
import { isObjectAtPath, isPathAllowed } from '../../src/hooks/json-select.js';
import { describe, test } from 'node:test';


// Example TypeBox schema
const schema = Type.Object({
  id: Type.Number(),
  user: Type.Object({
    name: Type.String(),
    age: Type.Number(),
    address: Type.Object({
      street: Type.String(),
      city: Type.String()
  },{additionalProperties: true})
  },{additionalProperties: false}),
  // Specify that additional properties are not allowed at the root level
  additionalProperties: false,
});

describe('hooks // json-queries', () => {
  describe('isPathAllowed with valid paths', () => {
    test('should allow root level properties', () => {
      expect(isPathAllowed(schema, 'user')).to.be.true;
      expect(isPathAllowed(schema, 'id')).to.be.true;
    });

    test('should allow nested properties', () => {
      expect(isPathAllowed(schema, 'user.name')).to.be.true;
      expect(isPathAllowed(schema, 'user.address')).to.be.true;
      expect(isPathAllowed(schema, 'user.address.street')).to.be.true;
    });

    test('should allow deeply nested properties', () => {
      expect(isPathAllowed(schema, 'user.address.zipcode')).to.be.true;
      expect(isPathAllowed(schema, 'user.address.zipcode.first_digit')).to.be.true;
    });
  });

  describe('isPathAllowed with invalid paths', () => {
    test('should not allow non-existent nested properties', () => {
      expect(isPathAllowed(schema, 'user.zipcode')).to.be.false;
    });

    test('should not allow non-existent root level properties', () => {
      expect(isPathAllowed(schema, 'name')).to.be.false;
    });
  });

  describe('isObjectAtPath', () => {
    test('should return true for valid object paths', () => {
      expect(isObjectAtPath(schema, 'user')).to.be.true;
      expect(isObjectAtPath(schema, 'user.address')).to.be.true;
    });
  
    test('should return false for non-object paths', () => {
      expect(isObjectAtPath(schema, 'user.name')).to.be.false;
      expect(isObjectAtPath(schema, 'id')).to.be.false;
    });
  
    test('should return false for invalid paths', () => {
      expect(isObjectAtPath(schema, 'user.zipcode')).to.be.false;
      expect(isObjectAtPath(schema, 'user.address.zipcode')).to.be.false;
      expect(isObjectAtPath(schema, 'name')).to.be.false;
    });
  });
});

