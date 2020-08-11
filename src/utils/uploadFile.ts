import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';

export default (
  image: Promise<FileUpload>,
  directory: string
): Promise<string | undefined> => {
  return new Promise(async (resolve) => {
    const { createReadStream, filename } = await image;
    const filePath = `${directory}${filename}`;
    createReadStream()
      .pipe(createWriteStream(filePath))
      .on('finish', () => {
        resolve(filename);
      })
      .on('error', () => {
        console.log(
          'error',
          'There is some problem in the file upload. Please try again.'
        );
        resolve(undefined);
      });
  });
};
