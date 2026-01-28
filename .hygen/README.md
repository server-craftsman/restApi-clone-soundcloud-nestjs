# Hygen Templates for NestJS Module Generation

This project uses [Hygen](https://www.hygen.io/) to generate complete NestJS modules following the MODULE_RULES.md architecture.

## Installation

Hygen is already installed as a dev dependency. You can verify with:

```bash
bun run hygen --help
```

## Usage

### Generate a new module

```bash
bun run hygen module new
```

You will be prompted for:

1. **Module name** (singular, lowercase): e.g., `product`, `order`, `comment`
2. **Plural form**: e.g., `products`, `orders`, `comments`
3. **Create status enum?**: yes/no
4. **Enum name** (if yes): e.g., `ProductStatus`, `OrderStatus`

### Example

```bash
$ bun run hygen module new
✔ Module name (singular, e.g., "track", "user"): · product
✔ Plural form (e.g., "tracks", "users"): · products
✔ Create status enum? (y/N) · true
✔ Enum name (e.g., "TrackStatus", "UserRole"): · ProductStatus
```

## What Gets Generated

Following the MODULE_RULES.md structure, this generates:

### 1. Enum (if selected)

- `src/enums/{name}-status.enum.ts` - Status enum definition
- Barrel export in `src/enums/index.ts`

### 2. Domain Layer

- `src/{plural}/domain/{name}.ts` - Domain interface and class

### 3. DTO Layer

- `src/{plural}/dto/create-{name}.dto.ts` - Create DTO
- `src/{plural}/dto/update-{name}.dto.ts` - Update DTO
- `src/{plural}/dto/{name}.dto.ts` - Response DTO
- `src/{plural}/dto/paginated-{plural}.dto.ts` - Paginated response
- `src/{plural}/dto/index.ts` - Barrel export

### 4. Entity Layer

- `src/{plural}/infrastructure/persistence/relational/entities/{name}.entity.ts` - TypeORM entity
- `src/{plural}/infrastructure/persistence/relational/entities/index.ts` - Barrel export

### 5. Mapper Layer

- `src/{plural}/infrastructure/persistence/relational/mappers/{name}.mapper.ts` - Entity ↔ Domain mapper
- `src/{plural}/infrastructure/persistence/relational/mappers/index.ts` - Barrel export

### 6. Repository Layer

- `src/{plural}/infrastructure/persistence/relational/repositories/{name}.repository.abstract.ts` - Abstract repository
- `src/{plural}/infrastructure/persistence/relational/{name}.repository.ts` - Repository implementation with BaseRepositoryImpl
- `src/{plural}/infrastructure/persistence/relational/repositories/index.ts` - Barrel export
- `src/{plural}/infrastructure/persistence/relational/index.ts` - Persistence barrel export
- `src/{plural}/infrastructure/persistence/relational/relational-persistence.module.ts` - Persistence module

### 7. Service Layer

- `src/{plural}/service/{plural}.service.ts` - Business logic service
- `src/{plural}/service/index.ts` - Barrel export

### 8. Controller Layer

- `src/{plural}/{plural}.controller.ts` - REST API controller with CRUD endpoints

### 9. Module

- `src/{plural}/{plural}.module.ts` - Main module wiring
- `src/{plural}/index.ts` - Module barrel export

## Generated Structure

```
src/
├── enums/
│   ├── {name}-status.enum.ts
│   └── index.ts
└── {plural}/
    ├── domain/
    │   └── {name}.ts
    ├── dto/
    │   ├── create-{name}.dto.ts
    │   ├── update-{name}.dto.ts
    │   ├── {name}.dto.ts
    │   ├── paginated-{plural}.dto.ts
    │   └── index.ts
    ├── infrastructure/
    │   └── persistence/
    │       └── relational/
    │           ├── entities/
    │           │   ├── {name}.entity.ts
    │           │   └── index.ts
    │           ├── mappers/
    │           │   ├── {name}.mapper.ts
    │           │   └── index.ts
    │           ├── repositories/
    │           │   ├── {name}.repository.abstract.ts
    │           │   └── index.ts
    │           ├── {name}.repository.ts
    │           ├── index.ts
    │           └── relational-persistence.module.ts
    ├── service/
    │   ├── {plural}.service.ts
    │   └── index.ts
    ├── {plural}.controller.ts
    ├── {plural}.module.ts
    └── index.ts
```

## Next Steps After Generation

1. **Update Entity**: Add custom columns to the entity file
2. **Update DTOs**: Add validation rules and custom fields
3. **Update Repository Abstract**: Add domain-specific query methods
4. **Implement Custom Methods**: Add business logic to service
5. **Register Module**: Import in `app.module.ts`
6. **Create Migration**: Run TypeORM migration
7. **Update Enum Export**: Add enum to `src/enums/index.ts` if created

## Architecture Compliance

Generated code follows:

- ✅ 3-layer repository pattern (Abstract → Implementation with BaseRepositoryImpl)
- ✅ Domain-driven design principles
- ✅ Composition over inheritance
- ✅ Proper dependency injection
- ✅ TypeORM entity patterns
- ✅ NestJS module structure
- ✅ Swagger/OpenAPI documentation
- ✅ JWT authentication guards
- ✅ BaseController response helpers
- ✅ Barrel exports for clean imports
- ✅ Enum extraction to shared location

## Customization

Edit templates in `_templates/module/new/` to customize generation:

- `prompt.js` - Interactive prompts
- `*.ejs.t` - Template files (EJS syntax)

Refer to [MODULE_RULES.md](MODULE_RULES.md) for architecture guidelines.
