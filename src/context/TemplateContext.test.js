import { describe, it, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { 
  isValidTemplateName,
  loadTemplatesFromStorage,
  saveTemplatesToStorage,
  STORAGE_KEY
} from './TemplateContext';

// Mock localStorage for testing
const createMockLocalStorage = () => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get store() { return store; }
  };
};

/**
 * Generates a unique template ID (mirrors the implementation)
 */
function generateTemplateId() {
  return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Pure function that simulates saveTemplate logic for testing
 */
function simulateSaveTemplate(templates, name, generatorType, config) {
  // Validate template name (reject empty/whitespace names)
  if (!isValidTemplateName(name)) {
    return { success: false, templates };
  }

  if (!generatorType || typeof generatorType !== 'string') {
    return { success: false, templates };
  }

  if (!config || typeof config !== 'object') {
    return { success: false, templates };
  }

  const newTemplate = {
    id: generateTemplateId(),
    name: name.trim(),
    generatorType: generatorType.toLowerCase(),
    config: { ...config },
    createdAt: new Date().toISOString()
  };

  return { success: true, templates: [...templates, newTemplate] };
}


/**
 * Pure function that simulates loadTemplate logic for testing
 */
function simulateLoadTemplate(templates, id) {
  if (!id || typeof id !== 'string') {
    return null;
  }
  return templates.find(t => t.id === id) || null;
}

/**
 * Pure function that simulates deleteTemplate logic for testing
 */
function simulateDeleteTemplate(templates, id) {
  if (!id || typeof id !== 'string') {
    return templates;
  }
  return templates.filter(t => t.id !== id);
}

// Arbitrary generators for property tests
const nonEmptyStringArb = fc.string({ minLength: 1 }).filter(s => s.trim().length > 0);
const generatorTypeArb = fc.constantFrom('useragent', 'gmail', 'ipfinder', 'numbergenerator');
const configArb = fc.record({
  device: fc.option(fc.constantFrom('android', 'ios', 'windows', 'mac'), { nil: undefined }),
  browser: fc.option(fc.constantFrom('chrome', 'firefox', 'safari', 'edge'), { nil: undefined }),
  version: fc.option(fc.string(), { nil: undefined }),
  count: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
  androidPercent: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined })
});

describe('TemplateContext Property Tests', () => {
  let mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage = createMockLocalStorage();
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /**
   * **Feature: custom-templates-stats, Property 1: Template Save-Load Round Trip**
   * *For any* valid generator configuration with a non-empty name, saving the template 
   * and then loading it by ID should return an equivalent configuration object.
   * **Validates: Requirements 3.2, 4.1**
   */
  describe('Property 1: Template Save-Load Round Trip', () => {
    it('should return equivalent config when saving and loading a template', () => {
      fc.assert(
        fc.property(
          nonEmptyStringArb,
          generatorTypeArb,
          configArb,
          (name, generatorType, config) => {
            const initialTemplates = [];
            
            // Save the template
            const { success, templates: afterSave } = simulateSaveTemplate(
              initialTemplates, 
              name, 
              generatorType, 
              config
            );
            
            if (!success) {
              // If save failed, it should be due to invalid inputs
              return !isValidTemplateName(name);
            }
            
            // Get the saved template's ID
            const savedTemplate = afterSave[afterSave.length - 1];
            
            // Load the template by ID
            const loadedTemplate = simulateLoadTemplate(afterSave, savedTemplate.id);
            
            if (!loadedTemplate) {
              return false;
            }
            
            // Verify the config is equivalent
            const originalConfig = config;
            const loadedConfig = loadedTemplate.config;
            
            // Check each property that was defined
            for (const key of Object.keys(originalConfig)) {
              if (originalConfig[key] !== undefined && 
                  originalConfig[key] !== loadedConfig[key]) {
                return false;
              }
            }
            
            // Verify name and generatorType
            return loadedTemplate.name === name.trim() && 
                   loadedTemplate.generatorType === generatorType.toLowerCase();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should persist templates to localStorage and load them back', () => {
      fc.assert(
        fc.property(
          nonEmptyStringArb,
          generatorTypeArb,
          configArb,
          (name, generatorType, config) => {
            // Create a template
            const template = {
              id: generateTemplateId(),
              name: name.trim(),
              generatorType: generatorType.toLowerCase(),
              config: { ...config },
              createdAt: new Date().toISOString()
            };
            
            // Save to storage
            const saveSuccess = saveTemplatesToStorage([template]);
            if (!saveSuccess) {
              return false;
            }
            
            // Load from storage
            const loadedTemplates = loadTemplatesFromStorage();
            
            if (loadedTemplates.length !== 1) {
              return false;
            }
            
            const loaded = loadedTemplates[0];
            return loaded.id === template.id &&
                   loaded.name === template.name &&
                   loaded.generatorType === template.generatorType;
          }
        ),
        { numRuns: 100 }
      );
    });
  });


  /**
   * **Feature: custom-templates-stats, Property 2: Empty Template Name Rejection**
   * *For any* string composed entirely of whitespace characters (including empty string), 
   * attempting to save a template should return false and not add any template to storage.
   * **Validates: Requirements 3.3**
   */
  describe('Property 2: Empty Template Name Rejection', () => {
    // Generator for whitespace-only strings (including empty)
    const whitespaceOnlyArb = fc.array(
      fc.constantFrom(' ', '\t', '\n', '\r'),
      { minLength: 0, maxLength: 10 }
    ).map(arr => arr.join(''));

    it('should reject empty string as template name', () => {
      fc.assert(
        fc.property(
          generatorTypeArb,
          configArb,
          (generatorType, config) => {
            const initialTemplates = [];
            const { success, templates } = simulateSaveTemplate(
              initialTemplates, 
              '', 
              generatorType, 
              config
            );
            
            // Should fail and not add any template
            return success === false && templates.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject whitespace-only strings as template name', () => {
      fc.assert(
        fc.property(
          whitespaceOnlyArb,
          generatorTypeArb,
          configArb,
          (name, generatorType, config) => {
            const initialTemplates = [];
            const { success, templates } = simulateSaveTemplate(
              initialTemplates, 
              name, 
              generatorType, 
              config
            );
            
            // Should fail and not add any template
            return success === false && templates.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate isValidTemplateName correctly for whitespace strings', () => {
      fc.assert(
        fc.property(
          whitespaceOnlyArb,
          (name) => {
            return isValidTemplateName(name) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept non-whitespace strings as valid template names', () => {
      fc.assert(
        fc.property(
          nonEmptyStringArb,
          (name) => {
            return isValidTemplateName(name) === true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: custom-templates-stats, Property 3: Template Deletion Removes from Storage**
   * *For any* template that exists in storage, deleting it by ID should result in that 
   * template no longer being retrievable from storage.
   * **Validates: Requirements 5.1**
   */
  describe('Property 3: Template Deletion Removes from Storage', () => {
    it('should remove template from list after deletion', () => {
      fc.assert(
        fc.property(
          nonEmptyStringArb,
          generatorTypeArb,
          configArb,
          (name, generatorType, config) => {
            // First save a template
            const { success, templates: afterSave } = simulateSaveTemplate(
              [], 
              name, 
              generatorType, 
              config
            );
            
            if (!success || afterSave.length === 0) {
              return false;
            }
            
            const savedTemplate = afterSave[0];
            
            // Delete the template
            const afterDelete = simulateDeleteTemplate(afterSave, savedTemplate.id);
            
            // Template should no longer be in the list
            return afterDelete.length === 0 && 
                   simulateLoadTemplate(afterDelete, savedTemplate.id) === null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should only remove the specified template, leaving others intact', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(nonEmptyStringArb, generatorTypeArb, configArb),
            { minLength: 2, maxLength: 5 }
          ),
          (templateData) => {
            // Save multiple templates
            let templates = [];
            for (const [name, generatorType, config] of templateData) {
              const { success, templates: updated } = simulateSaveTemplate(
                templates, 
                name, 
                generatorType, 
                config
              );
              if (success) {
                templates = updated;
              }
            }
            
            if (templates.length < 2) {
              return true; // Not enough templates to test
            }
            
            // Delete the first template
            const templateToDelete = templates[0];
            const afterDelete = simulateDeleteTemplate(templates, templateToDelete.id);
            
            // Should have one less template
            if (afterDelete.length !== templates.length - 1) {
              return false;
            }
            
            // Deleted template should not be found
            if (simulateLoadTemplate(afterDelete, templateToDelete.id) !== null) {
              return false;
            }
            
            // Other templates should still exist
            for (let i = 1; i < templates.length; i++) {
              if (simulateLoadTemplate(afterDelete, templates[i].id) === null) {
                return false;
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle deletion of non-existent template gracefully', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(nonEmptyStringArb, generatorTypeArb, configArb),
            { minLength: 0, maxLength: 3 }
          ),
          fc.string(),
          (templateData, fakeId) => {
            // Save some templates
            let templates = [];
            for (const [name, generatorType, config] of templateData) {
              const { success, templates: updated } = simulateSaveTemplate(
                templates, 
                name, 
                generatorType, 
                config
              );
              if (success) {
                templates = updated;
              }
            }
            
            const originalLength = templates.length;
            
            // Try to delete a non-existent template
            const afterDelete = simulateDeleteTemplate(templates, `nonexistent_${fakeId}`);
            
            // Length should remain the same
            return afterDelete.length === originalLength;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
