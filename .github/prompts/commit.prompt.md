Review the codebase changes and create logically separated commits based on the scope of work:

1. Run linting and formatting checks (npm run lint, npm run format) to ensure code quality, solving any issues if necessary.

1. Analyze changes using version control status/diff

1. Group modifications by their functional purpose:

   - Component changes
   - UI/UX improvements
   - State management updates
   - Styling changes (CSS/SCSS)
   - API integration
   - Feature implementations
   - Bug fixes
   - Configuration changes
   - Type definitions
   - etc.

1. For each logical group:

   - Stage related files/changes using `git add`
   - Create a commit with a clear, descriptive message following conventional commit format
   - Include relevant ticket/issue references

1. Before committing:

   - Run pre-commit hooks to validate changes
   - Address any linting/formatting issues raised by hooks (ESLint, Prettier, etc.)
   - Re-stage files modified by automated tooling
   - Verify changes meet project standards
   - Ensure TypeScript compilation passes (if applicable)

1. Proceed with commits only after all pre-commit validations pass

Example commit structure:

```
feat(auth): implement login component with form validation
style(button): update primary button styles for accessibility
fix(header): resolve mobile navigation menu overflow issue
chore(types): add TypeScript interfaces for user data
```

Note: Handle any automated changes from pre-commit hooks by including them in the relevant commits.
