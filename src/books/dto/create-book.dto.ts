import { IsString, IsOptional, IsISBN, IsDateString } from "class-validator";

export class CreateBookDto{
    @IsString()
    title: string;

    @IsString()
    author: string;
    
    @IsOptional()
    @IsISBN()
    isbn: string;

    @IsOptional()
    @IsString()
    description: string;
    
    @IsOptional()
    @IsDateString()
    publishedAt; string;
}