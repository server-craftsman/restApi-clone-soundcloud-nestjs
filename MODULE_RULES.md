# Module Organization Rules

This document defines the structural and organizational rules for all modules in the SoundCloud Clone API.

## 1. Module Folder Structure

Every module must follow this exact directory structure:

```
src/
├── enums/                                     # Shared enums (if applicable)
│   ├── {entity}-status.enum.ts               # Status enums
│   └── index.ts                              # Barrel export
└── {module-name}/
    ├── domain/
    │   └── {entity}.ts                       # Domain interface (imports enums if needed)
    ├── dto/
    │   ├── create-{entity}.dto.ts
    │   ├── update-{entity}.dto.ts
    │   ├── {entity}.dto.ts
    │   ├── paginated-{entity}.dto.ts
    │   └── index.ts
    ├── infrastructure/
    │   └── persistence/
    │       └── relational/
    │           ├── entities/
    │           │   ├── {entity}.entity.ts
    │           │   └── index.ts
    │           ├── mappers/
    │           │   ├── {entity}.mapper.ts
    │           │   └── index.ts
    │           ├── repositories/
    │           │   ├── {entity}.repository.abstract.ts  # Abstract base class
    │           │   └── index.ts
    │           ├── {entity}.repository.ts               # Implementation
    │           ├── relational-persistence.module.ts
    │           └── index.ts
    ├── {module-name}.controller.ts
    ├── {module-name}.service.ts
    ├── {module-name}.module.ts
    └── index.ts
```

## 2. Domain Layer Rules

### 2.1 File Naming

- File: `{entity}.ts` (singular, camelCase)
- Example: `track.ts`, `user.ts`

### 2.2 Enum Extraction Rule (IMPORTANT)

- **ALL enums MUST be extracted to `src/enums/` directory**
- Naming: `{entity}-status.enum.ts` (or other descriptive enum name)
- MUST NOT be defined in domain file
- Barrel export from `src/enums/index.ts`
- Domain imports from enums: `import { TrackStatus } from '../../enums'`

**Rationale**: Enums are shared concerns that may be used across multiple modules (domain, DTO, entity, API responses). Extracting them to a central location prevents circular dependencies and improves reusability.

### 2.3 Content Requirements

- Must export an `interface {Entity}` representing the data contract
- Must import enums from `src/enums/` if applicable
- Must export a class `{Entity}Domain` implementing the interface (optional, for complex logic)
- MUST NOT contain any TypeORM decorators (@Entity, @Column, etc.)
- MUST NOT contain any NestJS decorators (@Injectable, @Controller, etc.)
- MUST NOT import from infrastructure layer

### 2.4 Example

```typescript
// src/enums/track-status.enum.ts
export enum TrackStatus {
  Uploaded = 'uploaded',
  Processing = 'processing',
  Ready = 'ready',
  Failed = 'failed',
}

// src/tracks/domain/track.ts
import { TrackStatus } from '../../enums'; // Import from enums

export interface Track {
  id: string;
  title: string;
  status: TrackStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class TrackDomain implements Track {
  // Optional: Add business logic methods
}
```

## 3. DTO Layer Rules

### 3.1 File Naming

- Create: `create-{entity}.dto.ts`
- Update: `update-{entity}.dto.ts`
- Response: `{entity}.dto.ts`
- Paginated: `paginated-{entity}.dto.ts`
- Example: `create-track.dto.ts`, `update-track.dto.ts`

### 3.2 Content Requirements

- Use `@nestjs/class-validator` decorators for validation
- Response DTOs must extend/mirror domain interface
- Paginated DTOs must follow PaginatedResponse pattern:

```typescript
export class PaginatedTracksDto {
  @ApiProperty({ type: [TrackDto] })
  @Type(() => TrackDto)
  data: TrackDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
```

### 3.3 Barrel Export

All DTOs must be exported from `dto/index.ts`:

```typescript
export * from './create-track.dto';
export * from './update-track.dto';
export * from './track.dto';
export * from './paginated-tracks.dto';
```

## 4. Entity Layer Rules

### 4.1 File Location & Naming

- Location: `infrastructure/persistence/relational/entities/`
- File: `{entity}.entity.ts`
- Example: `track.entity.ts`

### 4.2 Content Requirements

- MUST have `@Entity({ name: '{table-name}' })` decorator
- MUST have `@PrimaryGeneratedColumn('uuid')` id
- MUST use TypeORM decorators for all properties
- MUST use snake_case for database column names (via `@Column({ name: 'column_name' })`)
- MUST have `@CreateDateColumn({ name: 'created_at' })` for timestamps
- MUST have `@UpdateDateColumn({ name: 'updated_at' })` for timestamps
- Column types MUST be explicit (e.g., `type: 'varchar'`, `type: 'text'`)

### 4.3 Naming Convention

- Class name: `{Entity}Entity` (PascalCase + Entity suffix)
- Table name: lowercase with underscores (`@Entity({ name: 'table_name' })`)
- Example: `TrackEntity`, table `tracks`

### 4.4 Example

```typescript
// src/tracks/infrastructure/persistence/relational/entities/track.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrackStatus } from '../../../../domain/track';

@Entity({ name: 'tracks' })
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'enum', enum: TrackStatus })
  status!: TrackStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
```

### 4.5 Barrel Export

Entities must be exported from `entities/index.ts`:

```typescript
export * from './track.entity';
export * from './user.entity';
// ... other entities
```

## 5. Mapper Layer Rules

### 5.1 File Location & Naming

- Location: `infrastructure/persistence/relational/mappers/`
- File: `{entity}.mapper.ts`
- Example: `track.mapper.ts`

### 5.2 Content Requirements

- MUST be `@Injectable()` provider
- MUST have three methods:
  - `toDomain(entity: {Entity}Entity): {Entity}`
  - `toEntity(domain: {Entity} | Partial<{Entity}>): {Entity}Entity`
  - `toDomainArray(entities: {Entity}Entity[]): {Entity}[]`

### 5.3 Responsibility

- Transforms database entities → domain models
- Transforms domain models → database entities
- Handles all type conversions and property mappings
- NO business logic, only data transformation

### 5.4 Example

```typescript
// src/tracks/infrastructure/persistence/relational/mappers/track.mapper.ts
import { Injectable } from '@nestjs/common';
import { Track } from '../../../../domain/track';
import { TrackEntity } from '../entities/track.entity';

@Injectable()
export class TrackMapper {
  toDomain(entity: TrackEntity): Track {
    return {
      id: entity.id,
      title: entity.title,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(domain: Track | Partial<Track>): TrackEntity {
    const entity = new TrackEntity();
    Object.assign(entity, domain);
    return entity;
  }

  toDomainArray(entities: TrackEntity[]): Track[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
```

### 5.5 Barrel Export

Mappers must be exported from `mappers/index.ts`:

```typescript
export * from './track.mapper';
export * from './user.mapper';
// ... other mappers
```

## 6. Repository Abstract Class Rules

### 6.1 File Location & Naming

- Location: `infrastructure/persistence/relational/repositories/`
- File: `{entity}.repository.abstract.ts`
- Example: `track.repository.abstract.ts`

### 6.2 Content Requirements

- MUST be an `abstract class {Entity}RepositoryAbstract`
- MUST define all public repository methods as abstract
- MUST use domain types in signatures (not entities)
- Return types MUST be Promises
- NO implementation, only method signatures

### 6.3 Required Methods

- **Read Operations**: `abstract findById()`, `abstract findByField()`, `abstract findAll()`
- **Write Operations**: `abstract create()`, `abstract update()`, `abstract delete()`
- **Custom**: Domain-specific queries

### 6.4 Example

```typescript
// src/tracks/infrastructure/persistence/relational/repositories/track.repository.abstract.ts
import { Track } from '../../../../domain/track';

export abstract class TrackRepositoryAbstract {
  abstract findById(id: string): Promise<Track | null>;
  abstract findAll(limit: number, offset: number): Promise<[Track[], number]>;
  abstract findByTitle(title: string): Promise<Track[]>;
  abstract create(track: Partial<Track>): Promise<Track>;
  abstract update(id: string, track: Partial<Track>): Promise<Track>;
  abstract updateStatus(id: string, status: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
```

### 6.5 Barrel Export

Abstract classes must be exported from `repositories/index.ts`:

```typescript
export * from './track.repository.abstract';
export * from './user.repository.abstract';
// ... other abstracts
```

## 7. Repository Implementation Rules

### 7.1 File Location & Naming

- Location: `infrastructure/persistence/relational/`
- File: `{entity}.repository.ts`
- Example: `track.repository.ts`

### 7.2 Content Requirements

- MUST be `@Injectable()` provider
- MUST extend `{Entity}RepositoryAbstract` abstract class
- MUST use dependency injection for `DataSource` and `{Entity}Mapper`
- MUST use `this.mapper` for all transformations
- MUST return domain types (not entities)

### 7.3 Constructor Pattern

```typescript
@Injectable()
export class TrackRepository extends TrackRepositoryAbstract {
  private readonly repository: Repository<TrackEntity>;

  constructor(
    private dataSource: DataSource,
    private mapper: TrackMapper,
  ) {
    super(); // Call abstract class constructor
    this.repository = dataSource.getRepository(TrackEntity);
  }
}
```

### 7.4 Method Implementation Pattern

```typescript
async findById(id: string): Promise<Track | null> {
  const entity = await this.repository.findOne({ where: { id } });
  return entity ? this.mapper.toDomain(entity) : null;
}

async create(track: Partial<Track>): Promise<Track> {
  const entity = this.mapper.toEntity(track);
  const saved = await this.repository.save(entity);
  return this.mapper.toDomain(saved);
}
```

## 8. Service Layer Rules

### 8.1 File Naming

- File: `{module-name}.service.ts`
- Example: `tracks.service.ts`

### 8.2 Content Requirements

- MUST be `@Injectable()` provider
- Orchestrates repository and other services
- Implements business logic
- Returns domain types (from repositories)
- Accepts DTOs from controllers
- Transforms DTOs → domain models (internally, optional)

### 8.3 Constructor Pattern

```typescript
@Injectable()
export class TracksService {
  constructor(private readonly trackRepository: TrackRepository) {}
}
```

### 8.4 Method Naming

- `async create(dto: CreateTrackDto): Promise<Track>`
- `async findOne(id: string): Promise<Track>`
- `async findAll(): Promise<[Track[], number]>`
- `async update(id: string, dto: UpdateTrackDto): Promise<Track>`
- `async delete(id: string): Promise<void>`

## 9. Controller Layer Rules

### 9.1 File Naming

- File: `{module-name}.controller.ts`
- Example: `tracks.controller.ts`

### 9.2 Content Requirements

- MUST be `@Controller('{route}')` decorated
- Dependency inject service layer only
- Accept DTOs with `@Body()` validation
- Call service methods (not repository)
- Transform responses using DTOs

### 9.3 Example Pattern

```typescript
@Controller('tracks')
@ApiTags('Tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTrackDto,
  ): Promise<TrackDto> {
    const track = await this.tracksService.createFromUpload(file, dto);
    return this.toTrackDto(track);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TrackDto> {
    const track = await this.tracksService.findOne(id);
    return this.toTrackDto(track);
  }
}
```

## 10. Module Wiring Rules

### 10.1 Relational Persistence Module

File: `infrastructure/persistence/relational/relational-persistence.module.ts`

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, UserEntity])], // Entities only
  providers: [TrackMapper, UserMapper, TrackRepository, UserRepository],
  exports: [TrackRepository, UserRepository], // Export repositories only
})
export class RelationalTrackPersistenceModule {}
```

### 10.2 Main Module

File: `{module-name}.module.ts`

```typescript
@Module({
  imports: [RelationalTrackPersistenceModule],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService], // Export service for other modules
})
export class TracksModule {}
```

### 10.3 Barrel Exports

Each module must export public API from `index.ts`:

```typescript
// src/tracks/index.ts
export * from './dto';
export * from './domain/track';
export * from './tracks.service';
export * from './tracks.module';
```

## 11. Dependency Injection Rules

### 11.1 Injection Hierarchy

```
Controller
    ↓ (injects)
Service
    ↓ (injects)
Repository
    ↓ (uses)
Entity + Mapper
```

### 11.2 No Circular Dependencies

- Controllers MUST NOT inject repositories directly
- Services MUST NOT inject controllers
- Domain layer MUST NOT depend on infrastructure

### 11.3 Provider Registration

- Register in module `providers` array
- Export from module if used by other modules
- Use `@Injectable()` decorator

## 12. Naming Conventions Summary

| Layer                       | Pattern                                       | Example                   |
| --------------------------- | --------------------------------------------- | ------------------------- |
| Enum                        | `{Entity}Status`                              | `TrackStatus`             |
| Domain                      | `{Entity}` interface + `{Entity}Domain` class | `Track`, `TrackDomain`    |
| Entity                      | `{Entity}Entity` class                        | `TrackEntity`             |
| Mapper                      | `{Entity}Mapper` service                      | `TrackMapper`             |
| Repository (Abstract)       | `{Entity}RepositoryAbstract`                  | `TrackRepositoryAbstract` |
| Repository (Implementation) | `{Entity}Repository`                          | `TrackRepository`         |
| Service                     | `{Entity}Service`                             | `TracksService`           |
| Controller                  | `{Entity}Controller`                          | `TracksController`        |
| DTO (Create)                | `Create{Entity}Dto`                           | `CreateTrackDto`          |
| DTO (Update)                | `Update{Entity}Dto`                           | `UpdateTrackDto`          |
| DTO (Response)              | `{Entity}Dto`                                 | `TrackDto`                |
| Module                      | `{Entity}Module`                              | `TracksModule`            |

## 13. Import Rules

### 13.1 Allowed Imports

```typescript
// ✅ Service importing from domain
import { Track } from './domain/track';

// ✅ Service/Domain importing from enums
import { TrackStatus } from '../../enums';

// ✅ Entity importing from enums
import { TrackStatus } from '../../../../../enums';

// ✅ DTO importing from enums and domain
import { TrackStatus } from '../../enums';
import { Track } from '../../domain/track';

// ✅ Repository importing from domain
import { Track } from '../domain/track';

// ✅ Controller importing from dto
import { TrackDto, CreateTrackDto } from './dto';

// ✅ Service importing repository
import { TrackRepository } from './infrastructure/persistence/relational/track.repository';
```

### 13.2 Forbidden Imports

```typescript
// ❌ Domain/DTO importing from infrastructure
import { TrackEntity } from './infrastructure/persistence/relational/entities/track.entity';

// ❌ Importing abstract class as interface (use extends instead)
import { ITrackRepository } from './repositories/track.repository.interface';

// ❌ Controller importing repository directly
import { TrackRepository } from './infrastructure/persistence/relational/track.repository';

// ❌ Infrastructure importing from HTTP layer
import { TrackController } from './tracks.controller';

// ❌ Importing enum from domain (should import from enums)
import { TrackStatus } from './domain/track'; // WRONG
// Instead:
import { TrackStatus } from '../../enums'; // CORRECT
```

## 14. File Size Guidelines

| File Type                 | Max Lines | Purpose                  |
| ------------------------- | --------- | ------------------------ |
| Enum                      | 10-30     | Status/state definitions |
| Domain                    | 50-100    | Pure data structures     |
| DTO                       | 30-60     | Validation rules         |
| Entity                    | 60-100    | ORM mapping              |
| Mapper                    | 40-80     | Data transformation      |
| Repository Abstract       | 20-40     | Contract definition      |
| Repository Implementation | 80-150    | Data access              |
| Service                   | 150-300   | Business logic           |
| Controller                | 100-200   | HTTP endpoints           |
| Module                    | 20-40     | Dependency wiring        |

_If files exceed these limits, consider splitting into sub-modules or extracting helper services._

## 15. Testing Strategy

### 15.1 What to Test

- **Enum**: N/A (no logic)
- **Domain**: Business logic methods (if any)
- **Mapper**: `toDomain()` and `toEntity()` transformations
- **Repository**: All data access methods (with mock TypeORM)
- **Service**: All business logic (with mocked repositories)
- **Controller**: HTTP contract (with mocked services)

### 15.2 Test File Naming

- Domain logic: `{entity}.spec.ts` in domain folder
- Service: `{module-name}.service.spec.ts`
- Controller: `{module-name}.controller.spec.ts`
- Repository: `{entity}.repository.spec.ts` in repository folder

## 16. Validation Rules

### 16.1 DTO Validation

All DTOs must use `class-validator` decorators:

```typescript
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

### 16.2 Custom Validators

Create custom decorators in `validators/` folder if needed:

```typescript
// src/validators/is-valid-uuid.validator.ts
export class IsValidUuid implements ValidatorConstraintInterface {
  validate(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }
}
```

## 17. Error Handling

### 17.1 Error Types by Layer

- **Controller**: HTTP exceptions (`BadRequestException`, `NotFoundException`, etc.)
- **Service**: Custom business exceptions or HTTP exceptions
- **Repository**: Catch TypeORM errors, throw application exceptions

### 17.2 Example

```typescript
// In Service
async findOneOrFail(id: string): Promise<Track> {
  const track = await this.trackRepository.findById(id);
  if (!track) {
    throw new NotFoundException(`Track with id ${id} not found`);
  }
  return track;
}
```

## 18. Documentation Rules

### 18.1 JSDoc Comments

- All public methods must have JSDoc comments
- All complex algorithms must be explained
- All parameters and return types documented

```typescript
/**
 * Creates a new track from uploaded file
 * @param file - Multer file object with audio content
 * @param dto - Track creation data
 * @returns Promise resolving to created Track domain object
 * @throws BadRequestException if file is missing
 */
async createFromUpload(file: Express.Multer.File, dto: CreateTrackDto): Promise<Track>
```

### 18.2 Module Documentation

Each module should include `README.md`:

```markdown
# Tracks Module

Handles track management, including:

- Track creation and metadata
- Audio file storage and streaming
- Asynchronous transcoding via BullMQ

## Public API

- `TracksService.findOne(id)`
- `TracksService.create(dto)`
- `TracksService.findAll()`

## Dependencies

- StorageService (S3 uploads)
- MediaQueue (Transcoding jobs)
```

## 19. Checklist for New Modules

- [ ] Domain layer created with interface
- [ ] Enums extracted to `src/enums/` module (if applicable)
- [ ] DTOs created for create/update/list/single response
- [ ] Entity created with TypeORM decorators
- [ ] Mapper created with toDomain/toEntity methods
- [ ] Repository abstract class defined
- [ ] Repository implementation created (extends abstract)
- [ ] Persistence module configured with TypeOrmModule
- [ ] Service layer implementing business logic
- [ ] Controller with all CRUD endpoints
- [ ] Module wiring complete
- [ ] Barrel exports in place
- [ ] JSDoc comments added
- [ ] Unit tests written (optional but recommended)
- [ ] API documentation via Swagger decorators

## 20. Enum Organization Rules

### 20.1 Where to Place Enums

- Location: `src/enums/` directory (top-level, not inside modules)
- File naming: `{entity}-{type}.enum.ts`
- Examples: `track-status.enum.ts`, `user-role.enum.ts`

### 20.2 Enum Extraction Rule

**MANDATORY**: Any enum that represents a status, type, or role of an entity MUST be:

1. Defined in `src/enums/{entity}-{type}.enum.ts`
2. Exported from `src/enums/index.ts`
3. Imported by domain, entity, DTO, and service layers
4. NEVER defined inline in domain, dto, or entity files

### 20.3 Rationale

Enums are cross-cutting concerns used by:

- Domain layer (in type definitions)
- Entity layer (in ORM decorators)
- DTO layer (in response DTOs)
- Service layer (in business logic)
- Controller layer (in API responses)

Centralizing them prevents circular dependencies and ensures consistency.

### 20.4 Structure Example

```
src/
├── enums/
│   ├── track-status.enum.ts          # TrackStatus enum
│   ├── user-role.enum.ts             # UserRole enum (if needed)
│   └── index.ts                      # Barrel export
├── tracks/
│   ├── domain/track.ts               # imports TrackStatus from enums
│   ├── dto/track.dto.ts              # imports TrackStatus from enums
│   └── infrastructure/.../track.entity.ts  # imports TrackStatus from enums
└── users/
    └── ...
```

### 20.5 Barrel Export Pattern

```typescript
// src/enums/index.ts
export * from './track-status.enum';
export * from './user-role.enum';
// ... other enums
```

### 20.6 Usage in Different Layers

```typescript
// Domain layer
import { TrackStatus } from '../../enums';
export interface Track {
  status: TrackStatus;
}

// DTO layer
import { TrackStatus } from '../../enums';
export class TrackDto {
  @ApiProperty({ enum: TrackStatus })
  status: TrackStatus;
}

// Entity layer
import { TrackStatus } from '../../../../../enums';
@Entity()
export class TrackEntity {
  @Column({ type: 'enum', enum: TrackStatus })
  status: TrackStatus;
}
```

## 21. Migration Path for Existing Code

When refactoring existing modules to follow these rules:

1. **Enum extraction**:
   - Extract enum from domain/entity to `src/enums/{entity}-status.enum.ts`
   - Update all imports to use enums from `src/enums`

2. **Repository refactoring**:
   - Create `{entity}.repository.abstract.ts` with abstract methods
   - Update `{entity}.repository.ts` to extend abstract class
   - Change `implements IInterface` to `extends Abstract`

3. **Domain layer** (if needed):
   - Remove ORM decorators
   - Keep interfaces and enum imports

4. **Entity layer**:
   - Ensure all ORM decorators present
   - Import enums from shared location

5. **Mapper**:
   - Create/update bidirectional transformation logic

6. **Service**:
   - Update repository type hints

7. **Testing**:
   - Test all endpoints verify mapper transformations work
   - Verify enum usage consistent across layers

---

**Last Updated**: January 22, 2026  
**Version**: 1.0.0  
**Status**: Active
