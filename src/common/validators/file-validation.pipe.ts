import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(uploads: { 
    images?: Express.Multer.File[]; 
    file?: Express.Multer.File[] 
  }) {
    if (!uploads) {
      return uploads;
    }

    // Validate images if they exist
    if (uploads.images) {
      uploads.images.forEach((image, index) => {
        // Check file size (1MB = 1024 * 1024 bytes)
        if (image.size > 1024 * 1024) {
          throw new BadRequestException(
            `Image ${index + 1} exceeds the 1MB size limit`,
          );
        }

        // Check file type
        const validImageTypes = ['image/jpeg', 'image/png'];
        if (!validImageTypes.includes(image.mimetype)) {
          throw new BadRequestException(
            `Image ${index + 1} must be either JPEG or PNG`,
          );
        }
      });
    }

    // Validate single file if it exists
    if (uploads.file && uploads.file[0]) {
      const file = uploads.file[0];
      
      // Check file size
      if (file.size > 1024 * 1024) {
        throw new BadRequestException('File exceeds the 1MB size limit');
      }

      // Check file type
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('File must be a PDF');
      }
    }

    return uploads;
  }
}


// NOTE: 
// we can use multer options instead of pip obj: 
//  {
//   limits: {
//     fileSize: 1024 * 1024, // 1MB in bytes
//   },
//   fileFilter: (req, file, callback) => {
//     if (file.fieldname === 'images') {
//       if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
//         return callback(
//           new BadRequestException('Only JPEG and PNG images are allowed'),
//           false,
//         );
//       }
//     } else if (file.fieldname === 'file') {
//       if (file.mimetype !== 'application/pdf') {
//         return callback(
//           new BadRequestException('Only PDF files are allowed'),
//           false,
//         );
//       }
//     }
//     callback(null, true);
//   },
// },