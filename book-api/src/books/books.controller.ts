import { Controller, Post, Get, Patch, ParseIntPipe, UsePipes, ValidationPipe, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('books')
@UseGuards(JwtGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform:true}))

export class BooksController {
    
    constructor(private readonly booksService: BooksService) {}

    @Get()
    findAll(){
        return this.booksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.booksService.findOne(id);
    }

    @Post()
    create(@Body() createBookDto:CreateBookDto){
        return this.booksService.create(createBookDto);
    }

    @Patch(':id')
    update(@Param('id',ParseIntPipe)id:number,@Body() updateBookDto: UpdateBookDto,){
        return this.booksService.update(id, updateBookDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:number){
        return this.booksService.remove(id)
    }
}
