Create isolated unit tests for the selected code module following these guidelines:

1. Essential Guidelines:

- Follow general copilot instructions in .github/instructions/copilot-instructions.md
- Follow folder structure mirroring src code being tested (e.g., `src/components/Button.tsx` → `src/components/Button.test.tsx`)
- If a directory is given, create tests for all files in that directory
- Use descriptive names: `it('should <expected behavior> when <scenario>')`
- Follow the Arrange-Act-Assert pattern
- Keep tests focused and independent
- If existing tests, improve them or add new ones as needed
- Focus on main functional paths, not coverage of every line
- Aim for 80% coverage or more

2. Implementation Details:

- Use appropriate testing framework (Jest, Vitest, React Testing Library, etc.)
- Use `beforeEach`/`afterEach` for common setup/teardown
- Never use user modifiable config or data files, use test fixtures/mocks instead
- Mock external dependencies (API calls, third-party libraries)
- For components: test user interactions, rendering, and state changes
- For utilities/hooks: test input/output and edge cases
- Use `describe` blocks to group related tests

3. Test Structure Example:

```typescript
describe('ComponentName', () => {
  it('should render correctly with default props', () => {
    // Arrange: Set up test data and render component
    // Act: Interact with component if needed
    // Assert: Verify the expected outcome
  });
});
```

4. Code Coverage Requirements:

- Happy path scenarios
- Edge cases and boundary values
- Error conditions and invalid inputs
- User interactions (clicks, inputs, form submissions)
- Conditional rendering and state changes
- Accessibility features

5. Best Practices:

- Use descriptive assertion messages
- Keep test code simple and maintainable
- Test behavior, not implementation details
- Follow project naming conventions
- Run `npm test` to ensure all tests pass
- Iterate on tests until they meet high standards and all pass
- Use `screen.getByRole` for accessibility-focused queries
- Avoid testing internal component state directly

Reference:

- Jest documentation: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Vitest documentation: https://vitest.dev/guide/
