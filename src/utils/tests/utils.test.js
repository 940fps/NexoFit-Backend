const { getMaxAge } = require('../maxage.utils');
const { CheckValidDate } = require('../checkvaliddate.utils');
const { confirmPassword } = require('../confirmpsw.utils');

// ─── getMaxAge ────────────────────────────────────────────────────────────────

describe('getMaxAge', () => {
  it('debe retornar true para una edad válida (25 años)', () => {
    expect(getMaxAge('2001-03-06')).toBe(true);
  });

  it('debe retornar true en el límite inferior (13 años)', () => {
    expect(getMaxAge('2013-03-06')).toBe(true);
  });

  it('debe retornar true en el límite superior (120 años)', () => {
    expect(getMaxAge('1906-03-06')).toBe(true);
  });

  it('debe lanzar error si la edad es menor a 13', () => {
    expect(() => getMaxAge('2016-03-06')).toThrow('Debes tener entre 13 y 120 años');
  });

  it('debe lanzar error si la edad supera 120', () => {
    expect(() => getMaxAge('1905-03-06')).toThrow('Debes tener entre 13 y 120 años');
  });
});

// ─── CheckValidDate ───────────────────────────────────────────────────────────

describe('CheckValidDate', () => {
  it('debe retornar true si end es posterior a start', () => {
    expect(CheckValidDate('2026-03-06T10:00:00', '2026-03-06T11:00:00')).toBe(true);
  });

  it('debe lanzar error si end es igual a start', () => {
    expect(() => CheckValidDate('2026-03-06T10:00:00', '2026-03-06T10:00:00'))
      .toThrow('La hora de fin debe ser posterior a la de inicio');
  });

  it('debe lanzar error si end es anterior a start', () => {
    expect(() => CheckValidDate('2026-03-06T11:00:00', '2026-03-06T10:00:00'))
      .toThrow('La hora de fin debe ser posterior a la de inicio');
  });

  it('debe retornar true con fechas en días distintos', () => {
    expect(CheckValidDate('2026-03-06T23:00:00', '2026-03-07T01:00:00')).toBe(true);
  });
});

// ─── confirmPassword ──────────────────────────────────────────────────────────

describe('confirmPassword', () => {
  it('debe retornar true si los passwords coinciden', () => {
    expect(confirmPassword('Secret123!', 'Secret123!')).toBe(true);
  });

  it('debe lanzar error si los passwords no coinciden', () => {
    expect(() => confirmPassword('Secret123!', 'OtroPassword'))
      .toThrow('Las contraseñas no coinciden');
  });

  it('debe lanzar error si difieren en mayúsculas/minúsculas', () => {
    expect(() => confirmPassword('secret123!', 'Secret123!'))
      .toThrow('Las contraseñas no coinciden');
  });

  it('debe lanzar error si uno de los valores está vacío', () => {
    expect(() => confirmPassword('Secret123!', ''))
      .toThrow('Las contraseñas no coinciden');
  });
});
