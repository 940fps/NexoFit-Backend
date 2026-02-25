/**
 * @file Tests unitarios para el servicio de modalidades
 */

// Mock de la base de datos
jest.mock('../../config/database', () => ({
  db: jest.fn()
}));

const { db } = require('../../config/database');
const {
  findAllModalities,
  findModalityById,
  addModality,
  modifyModality,
  removeModality
} = require('../modality.service');

describe('Modality Service', () => {
  let mockSelect, mockWhere, mockFirst, mockInsert, mockUpdate, mockDel, mockLeftJoin;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock chain
    mockSelect = jest.fn().mockReturnThis();
    mockWhere = jest.fn().mockReturnThis();
    mockFirst = jest.fn();
    mockInsert = jest.fn();
    mockUpdate = jest.fn();
    mockDel = jest.fn();
    mockLeftJoin = jest.fn().mockReturnThis();
  });

  describe('findAllModalities', () => {
    it('debe retornar todas las modalidades con información de categoría', async () => {
      const mockModalities = [
        {
          id: 1,
          title: 'Spinning',
          description: 'Clase de ciclismo',
          image_url: 'url1',
          category_id: 1,
          category_title: 'Cardio',
          category_slug: 'cardio'
        },
        {
          id: 2,
          title: 'CrossFit',
          description: 'Entrenamiento funcional',
          image_url: 'url2',
          category_id: 2,
          category_title: 'Fuerza',
          category_slug: 'fuerza'
        }
      ];

      mockLeftJoin.mockResolvedValue(mockModalities);
      mockSelect.mockReturnValue({ leftJoin: mockLeftJoin });
      db.mockReturnValue({ select: mockSelect });

      const result = await findAllModalities();

      expect(db).toHaveBeenCalledWith('modalities');
      expect(mockSelect).toHaveBeenCalledWith(
        'modalities.*',
        'category.title as category_title',
        'category.slug as category_slug'
      );
      expect(mockLeftJoin).toHaveBeenCalledWith('category', 'modalities.category_id', 'category.id');
      expect(result).toEqual(mockModalities);
    });
  });

  describe('findModalityById', () => {
    it('debe retornar una modalidad por ID', async () => {
      const mockModality = {
        id: 1,
        title: 'Spinning',
        description: 'Clase de ciclismo',
        image_url: 'url1',
        category_id: 1,
        category_title: 'Cardio',
        category_slug: 'cardio'
      };

      mockFirst.mockResolvedValue(mockModality);
      mockWhere.mockReturnValue({ first: mockFirst });
      mockLeftJoin.mockReturnValue({ where: mockWhere });
      mockSelect.mockReturnValue({ leftJoin: mockLeftJoin });
      db.mockReturnValue({ select: mockSelect });

      const result = await findModalityById(1);

      expect(db).toHaveBeenCalledWith('modalities');
      expect(mockWhere).toHaveBeenCalledWith('modalities.id', 1);
      expect(result).toEqual(mockModality);
    });

    it('debe retornar undefined si la modalidad no existe', async () => {
      mockFirst.mockResolvedValue(undefined);
      mockWhere.mockReturnValue({ first: mockFirst });
      mockLeftJoin.mockReturnValue({ where: mockWhere });
      mockSelect.mockReturnValue({ leftJoin: mockLeftJoin });
      db.mockReturnValue({ select: mockSelect });

      const result = await findModalityById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('addModality', () => {
    it('debe crear una nueva modalidad', async () => {
      const newModality = {
        title: 'Zumba',
        description: 'Baile fitness',
        image_url: 'http://example.com/zumba.jpg',
        category_id: 1
      };

      mockInsert.mockResolvedValue([5]);
      db.mockReturnValue({ insert: mockInsert });

      const result = await addModality(
        newModality.title,
        newModality.description,
        newModality.image_url,
        newModality.category_id
      );

      expect(db).toHaveBeenCalledWith('modalities');
      expect(mockInsert).toHaveBeenCalledWith(newModality);
      expect(result).toEqual({ id: 5, ...newModality });
    });
  });

  describe('modifyModality', () => {
    it('debe actualizar una modalidad existente', async () => {
      const updatedData = {
        id: 1,
        title: 'Spinning Pro',
        description: 'Clase avanzada de ciclismo',
        image_url: 'http://example.com/spinning-pro.jpg',
        category_id: 1
      };

      mockUpdate.mockResolvedValue(1);
      mockWhere.mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      const result = await modifyModality(
        updatedData.id,
        updatedData.title,
        updatedData.description,
        updatedData.image_url,
        updatedData.category_id
      );

      expect(db).toHaveBeenCalledWith('modalities');
      expect(mockWhere).toHaveBeenCalledWith('id', updatedData.id);
      expect(mockUpdate).toHaveBeenCalledWith({
        title: updatedData.title,
        description: updatedData.description,
        image_url: updatedData.image_url,
        category_id: updatedData.category_id
      });
      expect(result).toEqual(updatedData);
    });
  });

  describe('removeModality', () => {
    it('debe eliminar una modalidad', async () => {
      mockDel.mockResolvedValue(1);
      mockWhere.mockReturnValue({ del: mockDel });
      db.mockReturnValue({ where: mockWhere });

      await removeModality(1);

      expect(db).toHaveBeenCalledWith('modalities');
      expect(mockWhere).toHaveBeenCalledWith('id', 1);
      expect(mockDel).toHaveBeenCalled();
    });
  });
});
