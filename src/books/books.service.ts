import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';


@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService){}

    findAll(){
       return this.prisma.book.findMany({
        where: {isDeleted: false}
       });
    }

    async findOne(id: number){
        const book = await this.prisma.book.findUnique({
            where: {id},
        });

        if(!book || book.isDeleted){
            throw new NotFoundException(`Book with ID ${id} not found`)
        }

        return book;
    }

    create(createBookDto: CreateBookDto){
        return this.prisma.book.create({
            data: createBookDto
        }) 
    }

    async update(id: number, updateBookDto:UpdateBookDto){
        await this.findOne(id);

        return this.prisma.book.update({
            where: {id},
            data: updateBookDto,
        });
    }

    async remove(id:number){
        await this.findOne(id);

        return this.prisma.book.update({
            where: {id},
            data: {isDeleted: true, deletedAt: new Date()},
        });
    }
}
