import { SemanticScholar, _constructURL } from '../../src/index'; // Replace with the actual path to your SemanticScholar class
import assert from 'assert';
import { describe, beforeEach, afterEach, it } from 'node:test';
import { RunOptions } from '../../src/types';
import nock from 'nock';

describe('SemanticScholar', () => {
  let semanticScholar: SemanticScholar;

  beforeEach(() => {
    semanticScholar = new SemanticScholar();

    // Mock the API endpoint
    nock('https://api.semanticscholar.org')
      .get('/graph/v1/paper/search')
      .query(true)
      .reply(200, 'Mocked response');
  });

  afterEach(() => {
    // Clean up the mocked requests
    nock.cleanAll();
  });

  it('constructURL should correctly construct the query URL', () => {
    const params = {
      query: 'test',
      year: 2021,
      fieldsOfStudy: 'Computer Science'
    };

    const expectedURL = 'https://api.semanticscholar.org/graph/v1/paper/search?query=test&fields=paperId,url,title,venue,publicationVenue,year,authors,abstract,publicationDate,tldr,fieldsOfStudy,referenceCount,citationCount,influentialCitationCount,isOpenAccess,isPublisherLicensed&limit=100&offset=0&year=2021&fieldsOfStudy=Computer%20Science';
    const actualURL = _constructURL(params);

    assert.strictEqual(actualURL, expectedURL);
  });

  it('should fetch data from Semantic Scholar API', async () => {
    const options: RunOptions = {
      user: { email: 'test@example.com', googleId: '123' },
      messages: [],
      persona: { role: 'user', content: 'Hello' },
      data: { query: 'example' }
    };

    const result = await semanticScholar.run(options);

    assert.strictEqual(typeof result, 'string');
    assert.notStrictEqual(result, '');
  });

  it('should handle error when fetching data from Semantic Scholar API', async () => {
    // Assuming the API returns a non-200 status code for errors
    nock('https://api.semanticscholar.org')
      .get('/graph/v1/paper/search')
      .query(true)
      .reply(500, 'Error response');

    const options: RunOptions = {
      user: { email: 'test@example.com', googleId: '123' },
      messages: [],
      persona: { role: 'user', content: 'Hello' },
      data: { query: 'invalid' }
    };

    try {
      await semanticScholar.run(options);
      assert.fail('Expected an error to be thrown');
    } catch (err) {
      assert.strictEqual(typeof err, 'object');
      assert.ok(err instanceof Error);
    }
  });

  it('should return the correct tool description', () => {
    const description = semanticScholar.describe();
    assert.strictEqual(typeof description, 'object'); // Replace with actual comparison if there's an expected descriptor
  });

  it('should correctly construct URL with year parameter', async () => {
    const options = {
      query: 'test',
      year: 2020
    };
    const result = _constructURL(options);
    assert.ok(result.includes('year=2020'));
  });

  it('should correctly construct URL with fieldsOfStudy parameter as string', async () => {
    const options = {
      query: 'test',
      fieldsOfStudy: 'Computer Science'
    };

    const result = _constructURL(options);
    assert.ok(result.includes('fieldsOfStudy=Computer%20Science'));
  });

  it('should correctly construct URL with fieldsOfStudy parameter as array', async () => {
    const options = {
      query: 'test',
      fieldsOfStudy: ['Computer Science', 'Biology']
    };
    const result = _constructURL(options);
    assert.ok(result.includes('fieldsOfStudy=Computer%20Science%2CBiology'));
  });
});
