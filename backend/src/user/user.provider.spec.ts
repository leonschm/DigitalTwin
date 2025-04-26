import { Test, TestingModule } from '@nestjs/testing';
import { UserProvider } from './user.provider';
import { PrismaProvider } from 'src/db/prisma.provider';

describe('UserProvider', () => {
  let provider: UserProvider;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: 1 }),
        update: jest.fn().mockResolvedValue({ id: 1 }),
        delete: jest.fn().mockResolvedValue({ id: 1 }),
      },
      $transaction: jest.fn((cb) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProvider,
        { provide: PrismaProvider, useValue: prisma },
      ],
    }).compile();

    provider = module.get<UserProvider>(UserProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('findAll should call prisma.user.findMany', async () => {
    await provider.findAll();
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  it('findOneGemeo should call prisma.user.findUnique', async () => {
    await provider.findOneGemeo(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
  });

  it('findOneUsuario should call prisma.user.findUnique', async () => {
    await provider.findOneUsuario(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
  });

  it('findOneUsuarioLogin should call prisma.user.findUnique', async () => {
    await provider.findOneUsuarioLogin('email', 'senha');
    expect(prisma.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { email: 'email', password: 'senha' } }));
  });

  it('create should call prisma.user.create', async () => {
    const dto = {
      email: 'a',
      password: 'b',
      isActive: true,
      profile: { name: 'n', bio: '', language: '', timezone: '' }
    };
    await provider.create(dto as any);
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('update should call prisma.user.update', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: 1 });
    await provider.update(1, { email: 'a', password: 'b', isActive: true } as any);
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('delete should call prisma.user.delete', async () => {
    await provider.delete(1);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('findByEmail should call prisma.user.findUnique', async () => {
    await provider.findByEmail('email');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'email' } });
  });
});
