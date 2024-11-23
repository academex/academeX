import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Public } from 'src/common/decorators/access.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tag')
/**
 * Controller for handling tag-related operations.
 *
 * @class
 * @classdesc This controller provides endpoints for creating, retrieving, updating, and deleting tags.
 * It also includes public endpoints for retrieving colleges and majors.
 *
 * @constructor
 * @param {TagService} tagService - The service used to handle tag operations.
 *
 * @method create
 * @description Creates a new tag.
 * @param {CreateTagDto} createTagDto - The data transfer object containing the details of the tag to create.
 * @returns {Promise<Tag>} The created tag.
 *
 * @method findAll
 * @description Retrieves all tags.
 * @returns {Promise<Tag[]>} A list of all tags.
 *
 * @method getColleges
 * @description Retrieves all colleges.
 * @returns {Promise<College[]>} A list of all colleges.
 *
 * @method getMajorsByCollege
 * @description Retrieves majors by college.
 * @param {Object} body - The request body.
 * @param {string} body.collegeEn - The English name of the college.
 * @returns {Promise<Major[]>} A list of majors for the specified college.
 *
 * @method findOne
 * @description Retrieves a tag by its ID.
 * @param {number} id - The ID of the tag to retrieve.
 * @returns {Promise<Tag>} The tag with the specified ID.
 *
 * @method update
 * @description Updates a tag by its ID.
 * @param {number} id - The ID of the tag to update.
 * @param {UpdateTagDto} updateTagDto - The data transfer object containing the updated details of the tag.
 * @returns {Promise<Tag>} The updated tag.
 *
 * @method remove
 * @description Deletes a tag by its ID.
 * @param {number} id - The ID of the tag to delete.
 * @returns {Promise<void>}
 */
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Public()
  @Get('colleges')
  getColleges() {
    return this.tagService.getColleges();
  }

  @Public()
  @Get('majors')
  getMajorsByCollege(@Query('collegeEn') collegeEn: string) {
    return this.tagService.getMajorsByCollege(collegeEn);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }
  //admin role
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(id, updateTagDto);
  }

  //admin role
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
