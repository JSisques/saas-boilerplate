import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';

describe('StorageMimeTypeValueObject', () => {
  describe('constructor', () => {
    it('should create a storage mime type value object with a valid MIME type', () => {
      const mimeType = new StorageMimeTypeValueObject('image/png');

      expect(mimeType.value).toBe('image/png');
    });

    it('should trim whitespace by default', () => {
      const mimeType = new StorageMimeTypeValueObject('  image/png  ');

      expect(mimeType.value).toBe('image/png');
    });

    it('should not allow empty string', () => {
      expect(() => {
        new StorageMimeTypeValueObject('');
      }).toThrow();
    });

    it('should validate MIME type pattern', () => {
      const validMimeTypes = [
        'image/png',
        'image/jpeg',
        'application/pdf',
        'text/plain',
        'video/mp4',
        'audio/mpeg',
      ];

      validMimeTypes.forEach((mimeType) => {
        expect(() => new StorageMimeTypeValueObject(mimeType)).not.toThrow();
      });
    });

    it('should reject invalid MIME type patterns', () => {
      const invalidMimeTypes = [
        'invalid',
        '/png',
        'image/',
        'image png',
        'image@png',
      ];

      invalidMimeTypes.forEach((mimeType) => {
        expect(() => new StorageMimeTypeValueObject(mimeType)).toThrow();
      });
    });

    it('should enforce max length of 100 characters', () => {
      const longMimeType = 'a'.repeat(50) + '/' + 'b'.repeat(50);
      expect(() => {
        new StorageMimeTypeValueObject(longMimeType);
      }).toThrow();
    });
  });

  describe('getMainType', () => {
    it('should return the main type from MIME type', () => {
      const mimeType = new StorageMimeTypeValueObject('image/png');

      expect(mimeType.getMainType()).toBe('image');
    });

    it('should return "application" for application/pdf', () => {
      const mimeType = new StorageMimeTypeValueObject('application/pdf');

      expect(mimeType.getMainType()).toBe('application');
    });

    it('should return "video" for video/mp4', () => {
      const mimeType = new StorageMimeTypeValueObject('video/mp4');

      expect(mimeType.getMainType()).toBe('video');
    });
  });

  describe('getSubType', () => {
    it('should return the subtype from MIME type', () => {
      const mimeType = new StorageMimeTypeValueObject('image/png');

      expect(mimeType.getSubType()).toBe('png');
    });

    it('should return "pdf" for application/pdf', () => {
      const mimeType = new StorageMimeTypeValueObject('application/pdf');

      expect(mimeType.getSubType()).toBe('pdf');
    });

    it('should return "mp4" for video/mp4', () => {
      const mimeType = new StorageMimeTypeValueObject('video/mp4');

      expect(mimeType.getSubType()).toBe('mp4');
    });
  });

  describe('isImage', () => {
    it('should return true for image MIME types', () => {
      const imageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

      imageTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isImage()).toBe(true);
      });
    });

    it('should return false for non-image MIME types', () => {
      const nonImageTypes = [
        'application/pdf',
        'video/mp4',
        'audio/mpeg',
        'text/plain',
      ];

      nonImageTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isImage()).toBe(false);
      });
    });
  });

  describe('isVideo', () => {
    it('should return true for video MIME types', () => {
      const videoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];

      videoTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isVideo()).toBe(true);
      });
    });

    it('should return false for non-video MIME types', () => {
      const nonVideoTypes = [
        'image/png',
        'application/pdf',
        'audio/mpeg',
        'text/plain',
      ];

      nonVideoTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isVideo()).toBe(false);
      });
    });
  });

  describe('isAudio', () => {
    it('should return true for audio MIME types', () => {
      const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

      audioTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isAudio()).toBe(true);
      });
    });

    it('should return false for non-audio MIME types', () => {
      const nonAudioTypes = [
        'image/png',
        'application/pdf',
        'video/mp4',
        'text/plain',
      ];

      nonAudioTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isAudio()).toBe(false);
      });
    });
  });

  describe('isDocument', () => {
    it('should return true for document MIME types', () => {
      const documentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      documentTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isDocument()).toBe(true);
      });
    });

    it('should return false for non-document MIME types', () => {
      const nonDocumentTypes = [
        'image/png',
        'video/mp4',
        'audio/mpeg',
        'text/plain',
      ];

      nonDocumentTypes.forEach((mimeType) => {
        const vo = new StorageMimeTypeValueObject(mimeType);
        expect(vo.isDocument()).toBe(false);
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal MIME types', () => {
      const mimeType1 = new StorageMimeTypeValueObject('image/png');
      const mimeType2 = new StorageMimeTypeValueObject('image/png');

      expect(mimeType1.equals(mimeType2)).toBe(true);
    });

    it('should return false for different MIME types', () => {
      const mimeType1 = new StorageMimeTypeValueObject('image/png');
      const mimeType2 = new StorageMimeTypeValueObject('image/jpeg');

      expect(mimeType1.equals(mimeType2)).toBe(false);
    });
  });
});
