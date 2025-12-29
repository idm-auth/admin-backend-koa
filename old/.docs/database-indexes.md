# Database Indexes - Mongoose Patterns

## Index Definition Patterns

This project follows a consistent pattern for defining MongoDB indexes in Mongoose schemas.

### Field-Level Indexes (Preferred)

Define indexes directly on field definitions when possible. This keeps the index definition close to the field.

```typescript
export const schema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  isActive: { type: Boolean, default: true, index: true },
});
```

**When to use:**
- Simple indexes on top-level fields
- Single-field indexes
- Unique constraints on single fields

**Benefits:**
- Index definition is co-located with field
- Easy to see which fields are indexed
- Less code duplication

### Schema-Level Indexes (When Necessary)

Use `schema.index()` only when field-level indexes are not possible.

```typescript
export const schema = new mongoose.Schema({
  user: {
    profile: {
      email: { type: String, required: true },
    },
  },
  tags: [{ type: String }],
});

// Schema-level indexes (only for nested fields or compound indexes)
schema.index({ 'user.profile.email': 1 }, { unique: true });
schema.index({ tags: 1 });
schema.index({ createdAt: 1, status: 1 }); // Compound index
```

**When to use:**
- Nested/embedded field indexes
- Compound indexes (multiple fields)
- Indexes with special options (sparse, partial, etc.)
- Array field indexes

**Benefits:**
- Supports complex index scenarios
- Allows compound indexes
- Enables advanced index options

## Common Index Types

### Simple Index
```typescript
name: { type: String, index: true }
```

### Unique Index
```typescript
email: { type: String, unique: true, index: true }
```

### Nested Field Index
```typescript
schema.index({ 'user.profile.email': 1 });
```

### Compound Index
```typescript
schema.index({ lastName: 1, firstName: 1 });
```

### Array Field Index
```typescript
schema.index({ tags: 1 });
schema.index({ 'items.productId': 1 });
```

## Project Examples

### Application Model
```typescript
export const schema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, index: true },
  systemId: { type: String, required: true, unique: true, index: true },
  availableActions: [
    {
      resourceType: { type: String, required: true },
      pathPattern: { type: String, required: true },
      operations: { type: [String], required: true },
    },
  ],
});

// Schema-level indexes (only for nested fields)
schema.index({ 'availableActions.resourceType': 1 });
schema.index({ 'availableActions.pathPattern': 1 });
```

### Account Model
```typescript
export const schema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  isActive: { type: Boolean, default: true, index: true },
  emails: [
    {
      email: { type: String, required: true },
      isPrimary: { type: Boolean, default: false },
    },
  ],
});

// Schema-level indexes (only for nested fields)
schema.index({ 'emails.email': 1 }, { unique: true });
```

## Avoiding Duplicate Indexes

**Problem:**
```typescript
// ❌ WRONG - Duplicate index warning
systemId: { type: String, index: true }, // Creates index
schema.index({ systemId: 1 }); // Creates another index
```

**Solution:**
```typescript
// ✅ CORRECT - Single index definition
systemId: { type: String, unique: true, index: true },
// No schema.index() needed
```

## Index Options

### Field-Level Options
```typescript
{
  index: true,        // Create index
  unique: true,       // Unique constraint
  sparse: true,       // Sparse index (only for field-level)
}
```

### Schema-Level Options
```typescript
schema.index(
  { field: 1 },
  {
    unique: true,
    sparse: true,
    background: true,
    name: 'custom_index_name',
    partialFilterExpression: { status: 'active' },
  }
);
```

## Best Practices

1. **Prefer field-level** for simple indexes
2. **Use schema-level** only when necessary (nested, compound, special options)
3. **Avoid duplicates** - choose one method per field
4. **Document complex indexes** with comments
5. **Test index performance** with real data

## Migration Guide

### From Schema-Level to Field-Level

```typescript
// Before
systemId: { type: String, required: true },
schema.index({ systemId: 1 }, { unique: true });

// After
systemId: { type: String, required: true, unique: true, index: true },
// Remove schema.index() line
```

### Keep Schema-Level for Nested

```typescript
// Keep as-is (nested field)
schema.index({ 'availableActions.resourceType': 1 });
```

## Performance Considerations

- **Too many indexes** slow down writes
- **Compound indexes** can serve multiple queries
- **Index order matters** for compound indexes
- **Monitor index usage** with MongoDB tools

## Conclusion

Follow the pattern: **field-level when possible, schema-level when necessary**. This keeps the codebase consistent and maintainable.
