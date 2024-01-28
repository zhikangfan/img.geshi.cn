export const formatFileSize = (fileSizeInBytes) => {
  const fileSizeInKB = fileSizeInBytes / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;

  if (fileSizeInMB >= 1) {
    return fileSizeInMB.toFixed(2) + ' MB';
  } else if (fileSizeInKB >= 1) {
    return fileSizeInKB.toFixed(2) + ' KB';
  } else {
    return fileSizeInBytes + ' B';
  }
}
