// Utility functions for handling variables in content
import variablesData from '../data/variables.json';

/**
 * Get a variable value by its path
 * @param {string} path - Dot notation path to the variable (e.g., 'school.name', 'courses.price_pet')
 * @returns {string|null} - The variable value or null if not found
 */
export function getVariable(path) {
  if (!path) return null;
  
  const parts = path.split('.');
  let value = variablesData;
  
  for (const part of parts) {
    if (value === undefined || value === null) return null;
    value = value[part];
  }
  
  return value;
}

/**
 * Process content by replacing variable placeholders with actual values
 * Placeholders format: {{variable.path}}
 * @param {string} content - Content with variable placeholders
 * @returns {string} - Content with variables replaced
 */
export function processVariables(content) {
  if (!content) return content;
  
  // Replace all {{variable.path}} occurrences with their values
  return content.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
    const value = getVariable(path);
    return value !== null && value !== undefined ? value : match;
  });
}

/**
 * Alias for processVariables function to maintain compatibility
 * @param {string} content - Content with variable placeholders
 * @returns {string} - Content with variables replaced
 */
export function replaceVariables(content) {
  return processVariables(content);
}

/**
 * Process a JSON object by replacing variable placeholders in all string values
 * @param {object} jsonData - JSON object with variable placeholders
 * @returns {object} - JSON object with variables replaced
 */
export function processJsonVariables(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') return jsonData;
  
  const result = Array.isArray(jsonData) ? [] : {};
  
  for (const key in jsonData) {
    const value = jsonData[key];
    
    if (typeof value === 'string') {
      result[key] = processVariables(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = processJsonVariables(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Load data from a JSON file and process any variable placeholders
 * This is a wrapper function for processJsonVariables for backward compatibility
 * @param {object} jsonData - JSON data to process
 * @returns {object} - Processed JSON data with variables replaced
 */
export function loadDataWithVariables(jsonData) {
  return processJsonVariables(jsonData);
}

// export default {
//   getVariable,
//   processVariables,
//   processJsonVariables,
//   loadDataWithVariables
// };