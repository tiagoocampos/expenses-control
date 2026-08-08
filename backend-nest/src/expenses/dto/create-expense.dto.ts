import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateExpenseDto {
    @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
    userId!: number;

    @IsInt({ message: 'O ID da categoria deve ser um número inteiro' })
    categoryId!: number;

    @IsString({ message: 'O título do gasto deve ser um texto' })
    @IsNotEmpty({ message: 'O título do gasto não pode ser vazio' })
    @MaxLength(100, { message: 'O título do gasto não pode ter mais de 100 caracteres' })
    @MinLength(3, { message: 'O título do gasto deve ter pelo menos 3 caracteres' })
    title!: string;

    @IsNumber()
    @IsPositive({ message: 'O valor do gasto deve ser um número' })
    amount!: number;

    @Type(() => Date)
    @IsDate({ message: 'Insira uma data válida' })
    date!: Date;
}