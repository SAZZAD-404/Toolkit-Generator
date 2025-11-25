import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TemplateContext = createContext();

const STORAGE_KEY = 'toolkit_templates';

/**
 * Validates that a template name is non-empty and not just whitespace
 * @param {string} name - The template name to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidTemplateName(name) {
  if (typeof name !== 'string') {
    return false;
  }
  return name.trim().length > 0;
}

/**
 * Validates a template object structure
 * @param {object} template - The template to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidTemplate(template) {
  if (!template || typeof template !== 'object') {
    return false;
  }
  return (
    typeof template.id === 'string' &&
    typeof template.name === 'string' &&
    typeof template.generatorType === 'string' &&
    template.config !== null &&
    typeof template.config === 'object' &&
    typeof template.createdAt === 'string'
  );
}

/**
 * Loads templates from localStorage with error handling
 * @returns {Array} Array of templates
 */
export function loadTemplatesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out invalid templates
    return parsed.filter(isValidTemplate);
  } catch (error) {
    console.error('Error loading templates from localStorage:', error);
    return [];
  }
}


/**
 * Saves templates to localStorage with error handling
 * @param {Array} templates - Array of templates to save
 * @returns {boolean} True if successful, false otherwise
 */
export function saveTemplatesToStorage(templates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('Error saving templates to localStorage:', error);
    return false;
  }
}

/**
 * Generates a unique template ID
 * @returns {string} Unique template ID
 */
function generateTemplateId() {
  return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function TemplateProvider({ children }) {
  const [templates, setTemplates] = useState(() => loadTemplatesFromStorage());
  const [storageError, setStorageError] = useState(false);

  // Persist templates to localStorage whenever they change
  useEffect(() => {
    const success = saveTemplatesToStorage(templates);
    setStorageError(!success);
  }, [templates]);

  /**
   * Saves a new template
   * @param {string} name - Template name
   * @param {string} generatorType - Type of generator (useragent, gmail, etc.)
   * @param {object} config - Generator configuration
   * @returns {boolean} True if saved successfully, false otherwise
   */
  const saveTemplate = useCallback((name, generatorType, config) => {
    // Validate template name (reject empty/whitespace names)
    if (!isValidTemplateName(name)) {
      return false;
    }

    if (!generatorType || typeof generatorType !== 'string') {
      return false;
    }

    if (!config || typeof config !== 'object') {
      return false;
    }

    const newTemplate = {
      id: generateTemplateId(),
      name: name.trim(),
      generatorType: generatorType.toLowerCase(),
      config: { ...config },
      createdAt: new Date().toISOString()
    };

    setTemplates(prev => [...prev, newTemplate]);
    return true;
  }, []);

  /**
   * Loads a template by ID
   * @param {string} id - Template ID
   * @returns {object|null} Template object or null if not found
   */
  const loadTemplate = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      return null;
    }
    return templates.find(t => t.id === id) || null;
  }, [templates]);

  /**
   * Deletes a template by ID
   * @param {string} id - Template ID
   */
  const deleteTemplate = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      return;
    }
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  /**
   * Gets all templates for a specific generator type
   * @param {string} generatorType - Type of generator
   * @returns {Array} Array of templates for the specified type
   */
  const getTemplatesByType = useCallback((generatorType) => {
    if (!generatorType || typeof generatorType !== 'string') {
      return [];
    }
    const normalizedType = generatorType.toLowerCase();
    return templates.filter(t => t.generatorType === normalizedType);
  }, [templates]);

  return (
    <TemplateContext.Provider value={{
      templates,
      saveTemplate,
      loadTemplate,
      deleteTemplate,
      getTemplatesByType,
      storageError
    }}>
      {children}
    </TemplateContext.Provider>
  );
}

export const useTemplates = () => useContext(TemplateContext);

// Export for testing purposes
export { STORAGE_KEY };
