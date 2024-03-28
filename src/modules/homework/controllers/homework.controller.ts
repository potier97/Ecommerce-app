import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
//SERVICES
import { HomeworkService } from '../services/homework.service';
import { CreateHomeworkDto } from '../dto/create-homework.dto';
import { UpdateHomeworkDto } from '../dto/update-homework.dto';
import { JwtAuthGuard } from 'auth/guard/jwt-auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('homework')
@UseGuards(JwtAuthGuard)
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Version('1')
  @Post()
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.homeworkService.create(createHomeworkDto);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.homeworkService.findAll();
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(id);
  }

  @Version('1')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHomeworkDto: UpdateHomeworkDto
  ) {
    return this.homeworkService.update(id, updateHomeworkDto);
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(id);
  }
}
