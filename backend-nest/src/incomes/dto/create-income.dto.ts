import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateIncomeDto {
    @IsString({ message: 'O título da receita deve ser um texto' })
    @IsNotEmpty({ message: 'O título da receita não pode ser vazio' })
    @MaxLength(100, { message: 'O título da receita não pode ter mais de 100 caracteres' })
    @MinLength(3, { message: 'O título da receita deve ter pelo menos 3 caracteres' })
    source!: string;

    @IsNumber({}, { message: 'O valor da receita deve ser um número' })
    @IsPositive({ message: 'O valor da receita deve ser maior que zero' })
    amount!: number;

    @Type(() => Date)
    @IsDate({ message: 'Data inválida' })
    receivedAt!: Date;
}