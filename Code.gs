function doPost(e) {
  const sheet = SpreadsheetApp.openById("1mgh_nMlPsT-bWrrHGDMNBhBxe99nZusVCIZOKYouEgc").getSheetByName("시트1"); // 시트명 확인
  const folder = DriveApp.getFolderById("1SFigBgGBUs9wXDSCYFqxRxE3G5OAE0MJ"); // 업로드할 폴더 ID 필요

  if (e.parameters && e.parameters.image && e.parameters.image !== "파일없음") {
    // base64 이미지 처리 (image는 JSON에 넣지 않음)
    const blob = Utilities.base64Decode(e.parameters.image);
    const file = folder.createFile(blob, e.parameters.filename, e.parameters.mimeType);
    e.parameters.image = file.getUrl();
  }

  sheet.appendRow([
    new Date(),
    e.parameters.name,
    e.parameters.phone,
    e.parameters.address,
    e.parameters.product,
    e.parameters.color,
    e.parameters.serial,
    e.parameters.issue_category,
    e.parameters.issue_detail,
    e.parameters.issue_subdetail,
    e.parameters.issue_description || '',
    e.parameters.image || '파일없음'
  ]);

  return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);
}
