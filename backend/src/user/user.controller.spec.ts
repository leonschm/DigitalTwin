import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserProvider } from './user.provider';

describe('UserController', () => {
  let controller: UserController;
  let provider: Partial<Record<keyof UserProvider, jest.Mock>>;

  beforeEach(async () => {
    provider = {
      findAll: jest.fn().mockResolvedValue([]),
      findOneGemeo: jest.fn().mockResolvedValue({ id: 1 }),
      findOneUsuario: jest.fn().mockResolvedValue({ id: 2 }),
      findOneUsuarioLogin: jest.fn().mockResolvedValue({ id: 3 }),
      create: jest.fn().mockResolvedValue({ id: 4 }),
      update: jest.fn().mockResolvedValue({ id: 5 }),
      delete: jest.fn().mockResolvedValue({ id: 6 }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserProvider, useValue: provider }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve retornar todos os usuários', async () => {
    expect(await controller.obterTodas()).toEqual([]);
    expect(provider.findAll).toHaveBeenCalled();
  });

  it('deve retornar um gemeo pelo id', async () => {
    expect(await controller.obterGemeoPorId(1)).toEqual({ id: 1 });
    expect(provider.findOneGemeo).toHaveBeenCalledWith(1);
  });

  it('deve retornar um usuário pelo id', async () => {
    expect(await controller.obterUsuarioPorId(2)).toEqual({ id: 2 });
    expect(provider.findOneUsuario).toHaveBeenCalledWith(2);
  });

  it('deve criar um usuário', async () => {
    const dto = { email: 'a', password: 'b', isActive: true, profile: { name: 'n', bio: '', language: '', timezone: '' } };
    expect(await controller.criarUsuario(dto as any)).toEqual({ id: 4 });
    expect(provider.create).toHaveBeenCalled();
  });

  it('deve atualizar um gemeo', async () => {
    const dto = { name: 'novo' };
    expect(await controller.atualizarGemeo(1, dto as any)).toEqual({ id: 5 });
    expect(provider.update).toHaveBeenCalledWith(1, dto);
  });

  it('deve deletar um gemeo', async () => {
    expect(await controller.deletarGemeo(1)).toEqual({ id: 6 });
    expect(provider.delete).toHaveBeenCalledWith(1);
  });
});
