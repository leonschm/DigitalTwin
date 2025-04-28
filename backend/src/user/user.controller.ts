import { User } from '@core';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { UserProvider } from './user.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateGemeoDto } from './dto/update-gemeo.dto';

@Controller('digitalTwin')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    
    constructor(private readonly repo: UserProvider) {}

    @Get('/nacaogemeos')
    async obterTodas(): Promise<User[]> {
        return this.repo.findAll() as any;
    }

    @Get(':id/gemeo')
    async obterGemeoPorId(@Param("id") id: number): Promise<User | null> {
        return this.repo.findOneGemeo(Number(id)) as any;
    }

    @Get(':id/user')
    async obterUsuarioPorId(@Param("id") id: number): Promise<User | null> {
        return this.repo.findOneUsuario(Number(id)) as any;
    }

    @Get(':email/:password/user')
    async obterUsuarioLogin(@Param("email") email: string, @Param("password") password: string): Promise<User | null> {
        this.logger.log(`Buscando usuário de login: ${email}`);
        const usuario = await this.repo.findOneUsuarioLogin(email, password) as any;
        if (!usuario) {
            this.logger.warn(`Usuário com email ${email} não encontrado ou senha incorreta.`);
            throw new NotFoundException(`Usuário com email ${email} não encontrado , revise a senha!`);
        }
        return usuario;
    }

    @Post('/user')
    @HttpCode(HttpStatus.CREATED)
    async criarUsuario(@Body() createUserDto: CreateUserDto) {
        this.logger.log(`Criando usuário: ${JSON.stringify(createUserDto)}`);
        console.log(createUserDto);
        return this.repo.create(createUserDto) as any;
    }
    
    @Patch(':id/gemeo')
    @HttpCode(HttpStatus.OK)
    async atualizarGemeo(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateGemeoDto) {
        this.logger.log(`Atualizando usuário com id ${id}: ${JSON.stringify(updateUserDto)}`);
        return this.repo.update(Number(id), updateUserDto) as any;
    }
    
    @Delete(':id/gemeo')
    async deletarGemeo(@Param("id") id: number) {
        this.logger.log(`Deletando usuário com id ${id}`);
        return this.repo.delete(Number(id)) as any;
    }
}
