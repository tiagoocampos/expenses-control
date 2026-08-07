import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';



export class CreateCategoryDto {
    @IsString({ message: 'O nome da categoria deve ser um texto' })
    @IsNotEmpty({ message: 'O nome da categoria não pode ser vazio' })
    @MaxLength(50, { message: 'O nome da categoria não pode ter mais de 50 caracteres' })
    @MinLength(3, { message: 'O nome da categoria deve ter pelo menos 3 caracteres' })
    name!: string;
}