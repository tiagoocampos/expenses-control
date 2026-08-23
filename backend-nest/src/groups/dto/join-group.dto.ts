import { IsString, IsNotEmpty, Length } from 'class-validator';

export class JoinGroupDto {
    @IsString({ message: 'O código deve ser um texto' })
    @IsNotEmpty({ message: 'O código não pode ser vazio' })
    @Length(4, 10, { message: 'Código inválido' })
    shareCode!: string;
}