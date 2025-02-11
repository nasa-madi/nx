/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service, Tool, SearchSemanticScholarParams, SemanticScholarResult, PluginOptions, RunOptions } from './types';

/**
   * Construct the URL for the Semantic Scholar API request.
   * @param {SearchSemanticScholarParams} params - The search parameters.
   * @returns {string} - The constructed URL.
   */
export const _constructURL = (params: SearchSemanticScholarParams): string => {
  const {
    query,
    limit = 100,
    publicationDateOrYear,
    year,
    venue,
    fieldsOfStudy,
    offset = 0
  } = params;

  // List of fields to retrieve from the search
  const fields = [
    'paperId',
    'url',
    'title',
    'venue',
    'publicationVenue',
    'year',
    'authors',
    'abstract',
    'publicationDate',
    'tldr',
    'fieldsOfStudy',
    'referenceCount',
    'citationCount',
    'influentialCitationCount',
    'isOpenAccess',
    'isPublisherLicensed'
  ].join(',');

  // Construct the base URL
  let url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
    query
  )}&fields=${fields}&limit=${limit}&offset=${offset}`;

  // Append additional parameters if provided
  if (publicationDateOrYear) url += `&publicationDate=${encodeURIComponent(publicationDateOrYear)}`;
  if (year) url += `&year=${encodeURIComponent(year)}`;
  if (venue) url += `&venue=${encodeURIComponent(venue)}`;
  if (fieldsOfStudy) {
    const encodedFieldsOfStudy = Array.isArray(fieldsOfStudy)
      ? encodeURIComponent(fieldsOfStudy.join(','))
      : encodeURIComponent(fieldsOfStudy);
    url += `&fieldsOfStudy=${encodedFieldsOfStudy}`;
  }

  return url;
};

/**
 * Class representing the SemanticScholar plugin.
 */
export class SemanticScholar {
  documents: Service | undefined;
  chunks: Service | undefined;
  uploads: Service | undefined;

  /**
   * Create a SemanticScholar plugin.
   * @param {PluginOptions} [options] - The plugin options.
   */
  constructor (options?: PluginOptions) {
    this.documents = options?.documents;
    this.chunks = options?.chunks;
    this.uploads = options?.uploads;
  }

  private constructURL (params:SearchSemanticScholarParams): string {
    return _constructURL(params);
  }

  /**
   * Run the Semantic Scholar search operation.
   * @param {RunOptions} options - The options for the search operation.
   * @returns {Promise<string>} - The search results in string format.
   */
  async run (options: RunOptions): Promise<string> {
    // Destructure the search parameters or set defaults
    const params: SearchSemanticScholarParams = options.data || {};

    // Construct the URL using the separate function
    const url = this.constructURL(params);

    // Execute the API request and handle the response
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data: SemanticScholarResult[] = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  }

  /**
   * Describe the tool for integration with other systems or UI.
   * @returns {Tool} - The tool description object.
   */
  describe (): Tool {
    // Return the static description of the Semantic Scholar search function
    return searchSemanticScholarDesc;
  }
}
// The static description object for the Semantic Scholar search tool.
export const searchSemanticScholarDesc: Tool = {
  type: 'function',
  plugin: 'Semantic Scholar', // Identifier for the plugin
  display: 'Search Semantic Scholar', // Display name for the UI
  function: {
    name: 'searchSemanticScholar',
    description: 'Search for academic papers from Semantic Scholar.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for papers, e.g. "covid"'
        },
        limit: {
          type: 'integer',
          description: 'The maximum number of results to return (must be <= 100).',
          default: 100
        },
        publicationDateOrYear: {
          type: 'string',
          description:
            'Restrict results to the given range of publication dates or years (inclusive). Accepts the format <startDate>:<endDate> where each term is optional, allowing for specific dates, fixed ranges, or open-ended ranges.'
        },
        year: {
          type: 'string',
          description: 'Restrict results to the given publication year (inclusive).'
        },
        venue: {
          type: 'string',
          description:
            'Restrict results by venue, including ISO4 abbreviations. Use a comma-separated list to include papers from more than one venue. Example: "Nature,Radiology".'
        },
        fieldsOfStudy: {
          type: 'string',
          description: 'Restrict results to given field-of-study. Available fields include "Computer Science", "Medicine", "Biology", etc.'
        },
        offset: {
          type: 'integer',
          description: 'When returning a list of results, start with the element at this position in the list.',
          default: 0
        }
      },
      required: ['query']
    }
  }
};
