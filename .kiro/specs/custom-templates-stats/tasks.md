# Implementation Plan

- [x] 1. Fix existing code issues and remove theme toggle





  - [x] 1.1 Remove ThemeContext.jsx and ThemeToggle.jsx files


    - Delete src/context/ThemeContext.jsx
    - Delete src/components/ThemeToggle.jsx
    - _Requirements: 1.2, 1.3_
  - [x] 1.2 Update App.jsx to remove theme-related code


    - Remove ThemeProvider import and wrapper
    - Ensure ToastProvider wraps AppContent directly
    - _Requirements: 1.1, 2.3_
  - [x] 1.3 Fix UserAgentGenerator.jsx issues


    - Add loading state UI or remove unused isLoading variable
    - Add missing `copied` state variable for Copy All button
    - _Requirements: 2.1, 2.2_

- [x] 2. Implement Statistics Context and utilities






  - [x] 2.1 Create utility functions for formatting

    - Create src/utils/formatters.js with formatNumber and formatRelativeTime functions
    - _Requirements: 8.2, 8.3_
  - [x] 2.2 Write property tests for formatting utilities








    - **Property 7: Number Formatting with Separators**
    - **Property 8: Relative Time Formatting**
    - **Validates: Requirements 8.2, 8.3**
  - [x] 2.3 Create StatsContext with localStorage persistence


    - Create src/context/StatsContext.jsx
    - Implement recordGeneration, clearStats, getTodayCount functions
    - Handle localStorage read/write with error handling
  - [x] 2.4 Write property tests for statistics functions













  - [ ] 2.4 Write property tests for statistics functions


    - **Property 4: Statistics Count Increment**
    - **Property 5: Statistics Data Structure Integrity**
    - **Property 6: Statistics Clear Resets All Counts**
    - **Validates: Requirements 6.1, 6.2, 7.4**

- [x] 3. Implement Template Context




  - [x] 3.1 Create TemplateContext with localStorage persistence


    - Create src/context/TemplateContext.jsx
    - Implement saveTemplate, loadTemplate, deleteTemplate, getTemplatesByType functions
    - Add template name validation (reject empty/whitespace names)
    - _Requirements: 3.1, 3.2, 4.1, 5.1_
  - [x] 3.2 Write property tests for template functions



    - **Property 1: Template Save-Load Round Trip**
    - **Property 2: Empty Template Name Rejection**
    - **Property 3: Template Deletion Removes from Storage**
    - **Validates: Requirements 3.2, 3.3, 4.1, 5.1**
- [x] 4. Checkpoint - Ensure all tests pass






- [ ] 4. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create UI Components




  - [x] 5.1 Create StatsDashboard component


    - Create src/components/StatsDashboard.jsx
    - Display summary cards for each generator type with icons
    - Show total count, today's count, and last used time
    - Add Clear Statistics button with confirmation
    - _Requirements: 7.1, 7.2, 7.3, 8.1_
  - [x] 5.2 Create TemplateManager component


    - Create src/components/TemplateManager.jsx
    - Add Save Template button with name input modal
    - Display template dropdown/list for selection
    - Add delete button for each template
    - Show "No templates" message when empty
    - _Requirements: 3.1, 3.4, 4.2, 4.3, 4.4, 5.2, 5.3_


- [x] 6. Integrate contexts and components




  - [x] 6.1 Update App.jsx with new providers


    - Add StatsProvider and TemplateProvider to component tree
    - Add Statistics Dashboard access (tab or modal)
    - _Requirements: 6.3, 6.4_
  - [x] 6.2 Integrate TemplateManager into UserAgentGenerator


    - Add TemplateManager component to UserAgentGenerator
    - Connect template load to form state
    - _Requirements: 4.1_
  - [x] 6.3 Add statistics recording to generators


    - Update UserAgentGenerator to record stats on generate
    - Update GmailGenerator to record stats on generate
    - Update other generators as needed
    - _Requirements: 6.1_

- [x] 7. Final Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.
