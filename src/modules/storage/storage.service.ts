import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly bucket = process.env.SUPABASE_BUCKET_NAME;
  constructor(private readonly supabaseService: SupabaseService) {}

  private generateUniqueFileName(originalName: string): string {
    const fileExtension = originalName.split('.').pop();
    return `${uuidv4()}.${fileExtension}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    path: string;
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }> {
    const uniqueFileName = this.generateUniqueFileName(file.originalname);
    const filePath = `${folder}/${uniqueFileName}`;

    const { data, error } = await this.supabaseService
      .getClient()
      .storage.from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Error uploading file: ${error.message}`);
    }

    const { data: urlData } = this.supabaseService
      .getClient()
      .storage.from(this.bucket)
      .getPublicUrl(filePath);

    return {
      path: data.path,
      url: urlData.publicUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  async uploadImages(
    images: Express.Multer.File[],
  ): Promise<
    Array<{
      path: string;
      url: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
    }>
  > {
    const uploadPromises = images.map((image) =>
      this.uploadFile(image, 'images'),
    );

    return Promise.all(uploadPromises);
  }

  async uploadPDF(file: Express.Multer.File): Promise<{
    path: string;
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }> {
    return this.uploadFile(file, 'pdfs');
  }

  async deleteFile(filePath: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .storage.from(this.bucket)
      .remove([filePath]);

    if (error) {
      throw new BadRequestException(`Error deleting file: ${error.message}`);
    }
  }
}
