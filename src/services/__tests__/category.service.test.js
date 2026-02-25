/**
 * @file Tests unitarios para el servicio de categorías
 */

// Mock de la base de datos
jest.mock('../../config/database', () => ({
  db: jest.fn()
}));

const { db } = require('../../config/database');
const {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  addCategory,
  modifyCategory,
  removeCategory
} = require('../category.service');

describe('Category Service', () => {
  let mockSelect, mockWhere, mockFirst, mockInsert, mockUpdate, mockDel;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock chain
    mockSelect = jest.fn().mockReturnThis();
    mockWhere = jest.fn().mockReturnThis();
    mockFirst = jest.fn();
    mockInsert = jest.fn();
    mockUpdate = jest.fn();
    mockDel = jest.fn();
  });

  describe('findAllCategories', () => {
    it('debe retornar todas las categorías', async () => {
      const mockCategories = [
        { id: 1, title: 'Cardio', description: 'Desc1', slug: 'cardio' },
        { id: 2, title: 'Fuerza', description: 'Desc2', slug: 'fuerza' }
      ];

      mockSelect.mockResolvedValue(mockCategories);
      db.mockReturnValue({ select: mockSelect });

      const result = await findAllCategories();

      expect(db).toHaveBeenCalledWith('category');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockCategories);
    });
  });

  describe('findCategoryById', () => {
    it('debe retornar una categoría por ID', async () => {
      const mockCategory = { id: 1, title: 'Cardio', description: 'Desc1', slug: 'cardio' };

      mockFirst.mockResolvedValue(mockCategory);
      mockWhere.mockReturnValue({ first: mockFirst });
      db.mockReturnValue({ where: mockWhere });

      const result = await findCategoryById(1);

      expect(db).toHaveBeenCalledWith('category');
      expect(mockWhere).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual(mockCategory);
    });

    it('debe retornar undefined si la categoría no existe', async () => {
      mockFirst.mockResolvedValue(undefined);
      mockWhere.mockReturnValue({ first: mockFirst });
      db.mockReturnValue({ where: mockWhere });

      const result = await findCategoryById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('findCategoryBySlug', () => {
    it('debe retornar una categoría por slug', async () => {
      const mockCategory = { id: 1, title: 'Cardio', description: 'Desc1', slug: 'cardio' };

      mockFirst.mockResolvedValue(mockCategory);
      mockWhere.mockReturnValue({ first: mockFirst });
      db.mockReturnValue({ where: mockWhere });

      const result = await findCategoryBySlug('cardio');

      expect(db).toHaveBeenCalledWith('category');
      expect(mockWhere).toHaveBeenCalledWith('slug', 'cardio');
      expect(result).toEqual(mockCategory);
    });
  });

  describe('addCategory', () => {
    it('debe crear una nueva categoría', async () => {
      const newCategory = {
        title: 'Yoga',
        description: 'Clases de yoga',
        slug: 'yoga'
      };

      mockInsert.mockResolvedValue([3]);
      db.mockReturnValue({ insert: mockInsert });

      const result = await addCategory(newCategory.title, newCategory.description, newCategory.slug);

      expect(db).toHaveBeenCalledWith('category');
      expect(mockInsert).toHaveBeenCalledWith({
        title: newCategory.title,
        description: newCategory.description,
        slug: newCategory.slug
      });
      expect(result).toEqual({ id: 3, ...newCategory });
    });
  });

  describe('modifyCategory', () => {
    it('debe actualizar una categoría existente', async () => {
      const updatedData = {
        id: 1,
        title: 'Cardio Actualizado',
        description: 'Nueva descripción',
        slug: 'cardio-actualizado'
      };

      mockUpdate.mockResolvedValue(1);
      mockWhere.mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      const result = await modifyCategory(
        updatedData.id,
        updatedData.title,
        updatedData.description,
        updatedData.slug
      );

      expect(db).toHaveBeenCalledWith('category');
      expect(mockWhere).toHaveBeenCalledWith('id', updatedData.id);
      expect(mockUpdate).toHaveBeenCalledWith({
        title: updatedData.title,
        description: updatedData.description,
        slug: updatedData.slug
      });
      expect(result).toEqual(updatedData);
    });
  });

  describe('removeCategory', () => {
    it('debe eliminar una categoría', async () => {
      mockDel.mockResolvedValue(1);
      mockWhere.mockReturnValue({ del: mockDel });
      db.mockReturnValue({ where: mockWhere });

      await removeCategory(1);

      expect(db).toHaveBeenCalledWith('category');
      expect(mockWhere).toHaveBeenCalledWith('id', 1);
      expect(mockDel).toHaveBeenCalled();
    });
  });
});
