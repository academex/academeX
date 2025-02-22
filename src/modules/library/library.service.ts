import { Injectable } from '@nestjs/common';

@Injectable()
export class LibraryService {
  create(createLibraryDto) {
    return 'This action adds a new library';
  }

  findAll() {
    return `This action returns all library`;
  }

  findOne(id: number) {
    return `This action returns a #${id} library`;
  }

  update(id: number, updateLibraryDto) {
    return `This action updates a #${id} library`;
  }

  remove(id: number) {
    return `This action removes a #${id} library`;
  }
}
