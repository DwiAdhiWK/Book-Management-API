import { IsString, IsOptional, IsISBN, IsDateString, IsDate } from "class-validator";
import { Type } from "class-transformer";

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
    @Type(() => Date)
    @IsDate()
    publishedAt: Date;
}   