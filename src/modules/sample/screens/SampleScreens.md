# Sample Screens Directory

This directory contains all sample-related screens that demonstrate various features and functionality.

## Screen Organization

### Current Screens:
- **Notes Screen** - Handled by `NotesScreenUseCase.ts` in the useCases directory
  - Located at: `app/(app)/index.tsx`
  - Demonstrates: CRUD operations, filtering, selection, archiving

### Future Sample Screens:
- **Data Visualization Screen** - Charts, graphs, analytics
- **Form Samples Screen** - Various form components and validation
- **Animation Samples Screen** - Motion and transition examples  
- **Component Gallery Screen** - Showcase of all shared components
- **Theme Demo Screen** - Light/dark theme switching
- **Performance Test Screen** - Stress testing and benchmarks

## Screen Structure

Each sample screen should follow this pattern:

```
src/modules/sample/screens/
├── [ScreenName]/
│   ├── [ScreenName]Screen.tsx     # Main screen component
│   ├── components/                # Screen-specific components
│   ├── hooks/                    # Screen-specific hooks
│   └── types.ts                  # Screen-specific types
```

## Integration

- **Use Cases**: Located in `src/modules/sample/useCases/`
- **Components**: Reusable components in `src/shared/components/`
- **State**: Managed through `src/modules/sample/store/`
- **Navigation**: Integrated with Expo Router

## Examples

Sample screens serve as:
1. **Demo/Testing** - Show how features work
2. **Documentation** - Living examples of code patterns  
3. **Development** - Rapid prototyping environment
4. **Quality Assurance** - Manual testing interfaces