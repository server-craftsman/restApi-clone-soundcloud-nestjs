import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketItemStat, ItemBucketMetadata, Client as MinioClient } from 'minio';
import { Readable } from 'node:stream';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;
  private readonly client: MinioClient;
  private bucketEnsured = false;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('storage.bucket', 'tracks');
    this.client = new MinioClient({
      endPoint: this.configService.get<string>('storage.endPoint') ?? '127.0.0.1',
      port: this.configService.get<number>('storage.port') ?? 9000,
      useSSL: this.configService.get<boolean>('storage.useSSL') ?? false,
      accessKey: this.configService.get<string>('storage.accessKey'),
      secretKey: this.configService.get<string>('storage.secretKey'),
    });
  }

  private async ensureBucket(): Promise<void> {
    if (this.bucketEnsured) {
      return;
    }
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      this.logger.log(`Created bucket ${this.bucket}`);
    }
    this.bucketEnsured = true;
  }

  async uploadBuffer(objectKey: string, buffer: Buffer, contentType?: string): Promise<void> {
    await this.ensureBucket();
    await this.client.putObject(this.bucket, objectKey, buffer, buffer.length, {
      'Content-Type': contentType,
    });
  }

  async uploadStream(objectKey: string, stream: Readable, contentType?: string): Promise<void> {
    await this.ensureBucket();
    await this.client.putObject(this.bucket, objectKey, stream, undefined, {
      'Content-Type': contentType,
    });
  }

  async statObject(objectKey: string): Promise<ItemBucketMetadata> {
    await this.ensureBucket();
    return this.client.statObject(this.bucket, objectKey);
  }

  async getObjectStream(objectKey: string): Promise<Readable> {
    await this.ensureBucket();
    return this.client.getObject(this.bucket, objectKey);
  }

  async getObjectRange(objectKey: string, start: number, end: number): Promise<Readable> {
    await this.ensureBucket();
    const length = end - start + 1;
    return this.client.getPartialObject(this.bucket, objectKey, start, length);
  }
}
