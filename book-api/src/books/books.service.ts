import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';


@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService){}

    findAll(){
        // Get all non deleted books
       return this.prisma.book.findMany({
        where: {isDeleted: false}
       });
    }

    async findOne(id: number){
        // Check if book with id exist
        const book = await this.prisma.book.findUnique({
            where: {id},
        });

        if(!book || book.isDeleted){
            throw new NotFoundException(`Book with ID ${id} not found`)
        }

        return book;
    }

    create(createBookDto: CreateBookDto){
        // create new book
        return this.prisma.book.create({
            data: createBookDto
        }) 
    }

    async update(id: number, updateBookDto:UpdateBookDto){
        //find book with id
        await this.findOne(id);

        // update found book
        return this.prisma.book.update({
            where: {id},
            data: updateBookDto,
        });
    }

    async remove(id:number){
        // find book with id
        await this.findOne(id);

        // soft delete found book
        return this.prisma.book.update({
            where: {id},
            data: {isDeleted: true, deletedAt: new Date()},
        });
    }
}
