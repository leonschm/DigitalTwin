import { User } from '@core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateGemeoDto } from './dto/update-gemeo.dto';

@Injectable()
export class UserProvider {

    private readonly logger = new Logger(UserProvider.name);
    
    constructor(private readonly prisma: PrismaProvider) {}

    async findAll(): Promise<User[]> {
      this.logger.debug('Chamando findAll');
        return this.prisma.user.findMany({
            orderBy: {
                id: 'asc',
            },
            include: { profile: true, aiConfiguration: true, dataSources: {
                include: {
                    trainingData: true,
                },
            } },
        }) as any;
    }
    
    async findOneGemeo(id: number): Promise<User | null> {
        this.logger.debug(`Chamando findOneGemeo com id: ${id}`);
        return this.prisma.user.findUnique({
            where: { id },
            include: { profile: true, aiConfiguration: true, dataSources: {
                include: {
                    trainingData: true,
                },
            } },
        }) as any;
    }

    async findOneUsuario(id: number): Promise<User | null> {
        this.logger.debug(`Chamando findOneUsuario com id: ${id}`);
        return this.prisma.user.findUnique({
            where: { id },
        }) as any;
    }

    async findOneUsuarioLogin(email: string, password: string): Promise<User | null> {
        this.logger.debug(`Chamando findOneUsuarioLogin com email: ${email} e password: ${password}`);
        return this.prisma.user.findUnique({
            where: { email, password },
            include: { profile: true, aiConfiguration: true, dataSources: {
                include: {
                    trainingData: true,
                },
            } },
        }) as any;
    }
    
    async create(createUserDto: CreateUserDto) {
        this.logger.debug(`Chamando create com createUserDto: ${JSON.stringify(createUserDto)}`);
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: createUserDto.password,
                isActive: createUserDto.isActive,
                profile: {
                    create: {
                        name: createUserDto.profile.name,
                        bio: createUserDto.profile.bio,
                        language: createUserDto.profile.language,
                        timezone: createUserDto.profile.timezone
                    },
                },
            },
            include: {
                profile: true,
                aiConfiguration: true,
                dataSources: {
                    include: {
                        trainingData: true
                    },
                },
            }
        })
    
          return user;
    }
    

    async update(id: number, updateGemeoDto: UpdateGemeoDto) {
        this.logger.debug(`Chamando update com id: ${id} e updateGemeoDto: ${JSON.stringify(updateGemeoDto)}`);
        // Verificar se o usuário existe
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }
    
        // Hash da senha, se fornecida
        // const hashedPassword = updateGemeoDto.password
        //   ? await bcrypt.hash(updateGemeoDto.password, 10)
        //   : undefined;
    
        // Preparar dados para atualização
        const userUpdateData: any = {
          email: updateGemeoDto.email,
          password: updateGemeoDto.password,
          isActive: updateGemeoDto.isActive,
        };
    
        const profileUpdateData: any = updateGemeoDto.profile
          ? {
              name: updateGemeoDto.profile.name,
              bio: updateGemeoDto.profile.bio,
              language: updateGemeoDto.profile.language,
              timezone: updateGemeoDto.profile.timezone,
            }
          : {};
    
        const aiConfigurationUpdateData: any = updateGemeoDto.aiConfiguration
          ? {
              interactionStyle: updateGemeoDto.aiConfiguration.interactionStyle,
              maxInteractionsPerDay: updateGemeoDto.aiConfiguration.maxInteractionsPerDay,
              preferredTopics: updateGemeoDto.aiConfiguration.preferredTopics,
              tone: updateGemeoDto.aiConfiguration.tone,
              responseLength: updateGemeoDto.aiConfiguration.responseLength,
            }
          : {};
    
        // Remover campos undefined
        Object.keys(userUpdateData).forEach(
          (key) => userUpdateData[key] === undefined && delete userUpdateData[key],
        );
        Object.keys(profileUpdateData).forEach(
          (key) => profileUpdateData[key] === undefined && delete profileUpdateData[key],
        );
        Object.keys(aiConfigurationUpdateData).forEach(
          (key) => aiConfigurationUpdateData[key] === undefined && delete aiConfigurationUpdateData[key],
        );
    
        // Atualizar em uma transação
        return this.prisma.$transaction(async (prisma) => {
          this.logger.debug(`Atualizando usuário com ID ${id} dentro da transação`);
          return prisma.user.update({
            where: { id },
            data: {
              ...userUpdateData,
              profile: Object.keys(profileUpdateData).length
                ? {
                    upsert: {
                      update: profileUpdateData,
                      create: {
                        name: updateGemeoDto.profile?.name || 'Nome Padrão',
                        bio: updateGemeoDto.profile?.bio,
                        language: updateGemeoDto.profile?.language,
                        timezone: updateGemeoDto.profile?.timezone,
                      },
                    },
                  }
                : undefined,
              aiConfiguration: Object.keys(aiConfigurationUpdateData).length
                ? {
                    upsert: {
                      update: aiConfigurationUpdateData,
                      create: {
                        interactionStyle: updateGemeoDto.aiConfiguration?.interactionStyle || 'default',
                        maxInteractionsPerDay: updateGemeoDto.aiConfiguration?.maxInteractionsPerDay,
                        preferredTopics: updateGemeoDto.aiConfiguration?.preferredTopics || [],
                        tone: updateGemeoDto.aiConfiguration?.tone,
                        responseLength: updateGemeoDto.aiConfiguration?.responseLength,
                      },
                    },
                  }
                : undefined,
            },
            include: {
              profile: true,
              aiConfiguration: true,
            },
          });
        });
      }
    
    async delete(id: number) {
        this.logger.debug(`Chamando delete com id: ${id}`);
        return this.prisma.user.delete({
            where: { id },
        });
    }
    
    async findByEmail(email: string) {
        this.logger.debug(`Chamando findByEmail com email: ${email}`);  
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
