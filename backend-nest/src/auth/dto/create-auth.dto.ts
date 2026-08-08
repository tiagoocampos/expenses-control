import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @IsString({ message: 'O email deve ser um texto' })
    @IsNotEmpty({ message: 'O email não pode ser vazio' })
    @IsEmail({}, { message: 'Insira um email válido' })
    email!: string;

    @IsString({ message: 'A senha deve ser um texto' })
    @IsNotEmpty({ message: 'A senha não pode ser vazia' })
    password!: string;
}

