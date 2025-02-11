/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service as FeathersService } from '@feathersjs/feathers';

export interface Service extends FeathersService<any> {}
/**
 * @typedef {Object} User
 * @property {string} email - The email of the user.
 * @property {string} googleId - The Google ID associated with the user.
 */
export interface User {
    email: string;
    googleId: string;
  }

/**
   * @typedef {Object} Message
   * @property {string} role - The role of the message sender.
   * @property {string} content - The content of the message.
   */
export interface Message {
    role: string;
    content: string;
  }

/**
   * @typedef {Object} ToolObject
   * @property {string} description - The description of the tool.
   * @property {string} name - The name of the tool.
   * @property {Object} parameters - The parameters for the tool.
   */
export interface ToolObject {
    description: string;
    name: string;
    parameters: object;
  }

/**
   * @typedef {Object} Tool
   * @property {string} type - The type of tool.
   * @property {ToolObject} function - The function object of the tool.
   * @property {string} [plugin] - Optional plugin name.
   * @property {string} [display] - Optional display name for UI.
   */
export interface Tool {
    type: string;
    function: ToolObject;
    plugin?: string;
    display?: string;
  }

/**
   * @typedef {Object} SearchSemanticScholarParams
   * @property {string} query - The search query.
   * @property {number} [limit] - The maximum number of results to return.
   * @property {string} [publicationDateOrYear] - The date or year of publication.
   * @property {string} [year] - The year of publication.
   * @property {string} [venue] - The venue of publication.
   * @property {string} [fieldsOfStudy] - The fields of study to restrict the search.
   * @property {number} [offset] - The offset for pagination.
   */
export interface SearchSemanticScholarParams {
    query: string;
    limit?: number;
    publicationDateOrYear?: string;
    year?: number | string;
    venue?: string;
    fieldsOfStudy?: string[] | string;
    offset?: number;
  }

/**
   * @typedef {Object} SemanticScholarResult
   * @property {string} paperId - The ID of the paper.
   * @property {string} url - The URL of the paper.
   * @property {string} title - The title of the paper.
   * @property {string} venue - The venue where the paper was published.
   * @property {string} publicationVenue - The detailed publication venue.
   * @property {number} year - The year of publication.
   * @property {string[]} authors - The authors of the paper.
   * @property {string} abstract - The abstract of the paper.
   * @property {string} publicationDate - The date of publication.
   * @property {string} tldr - A short summary of the paper.
   */
export interface SemanticScholarResult {
    paperId: string;
    url: string;
    title: string;
    venue: string;
    publicationVenue: string;
    year: number | string;
    authors: string[];
    abstract: string;
    publicationDate: string;
    tldr: string;
  }

/**
   * @typedef {Object} PluginOptions
   * @property {Service<any>} documents - The service for documents.
   * @property {Service<any>} chunks - The service for chunks.
   * @property {Service<any>} uploads - The service for uploads.
   */
export interface PluginOptions {
    documents: Service;
    chunks: Service;
    uploads: Service;
  }

/**
   * @typedef {Object} RunOptions
   * @property {User} user - The user object.
   * @property {Message[]} messages - Array of message objects.
   * @property {Message} persona - The persona message.
   * @property {Data} data - The data to use for the search.
   */
export interface RunOptions {
    user: User;
    messages: Message[];
    persona: Message;
    data: SearchSemanticScholarParams;
  }
