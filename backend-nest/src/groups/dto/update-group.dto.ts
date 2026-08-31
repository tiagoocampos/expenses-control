import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateGroupDto {
    @IsString({ message: 'O nome deve ser um texto' })
    @IsOptional()
    @MaxLength(50, { message: 'O nome não pode ter mais de 50 caracteres' })
    name?: string;
}