# Tests Unitarios - NexoFit Backend

## Resumen

Tests unitarios completos para los siguientes módulos:

### Módulos Testeados

1. **Category Service** - 6 tests
   - findAllCategories
   - findCategoryById
   - findCategoryBySlug
   - addCategory
   - modifyCategory
   - removeCategory

2. **Modality Service** - 5 tests
   - findAllModalities
   - findModalityById
   - addModality
   - modifyModality
   - removeModality

3. **Class Service** - 7 tests
   - findAllClasses (sin filtros, por modalidad, por búsqueda)
   - classExistsById
   - findClassByInstructorAndTime
   - addClass
   - modifyClass
   - removeClass

4. **Booking Service** - 10 tests
   - findAllBookings (sin filtros, por usuario, por clase)
   - findBookingByUserAndClass
   - countActiveBookingsByClass
   - addBooking
   - modifyBookingStatus
   - removeBooking
   - findBooking


## Comandos Disponibles

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## GitHub Actions

Se ha configurado un workflow de GitHub Actions que:
- Se ejecuta automáticamente en cada Pull Request a las ramas `main` y `develop`
- Prueba el código en Node.js 18.x y 20.x

El archivo de configuración está en: `.github/workflows/tests.yml`
