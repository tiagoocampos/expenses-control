import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString({ message: 'O nome do usuário deve ser um texto' })
    @IsNotEmpty({ message: 'O nome do usuário não pode ser vazio' })
    @MaxLength(50, { message: 'O nome do usuário não pode ter mais de 50 caracteres' })
    @MinLength(3, { message: 'O nome do usuário deve ter pelo menos 3 caracteres' })
    name!: string;

    @IsString({ message: 'O email do usuário deve ser um texto' })
    @IsNotEmpty({ message: 'O email do usuário não pode ser vazio' })
    @IsEmail({}, { message: 'O email do usuário deve ser um email válido' })
    email!: string;

    @IsString({ message: 'A senha do usuário deve ser um texto' })
    @IsNotEmpty({ message: 'A senha do usuário não pode ser vazia' })
    @MaxLength(50, { message: 'A senha do usuário não pode ter mais de 50 caracteres' })
    @IsStrongPassword(
        {},
        { message: 'A senha deve ter letra maiúscula, minúscula, número e símbolo (mínimo 8 caracteres)' }
    )
    password!: string;
}