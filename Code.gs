function doPost(e) {
  try {
    const folderId = "1SFigBgGBUs9wXDSCYFqxRxE3G5OAE0MJ"; // 첨부파일 저장용 폴더 ID
    const folder = DriveApp.getFolderById(folderId);

    // 유틸 함수 – 파라미터 안전 추출
    const getParam = key => e.parameter[key] || (e.parameters && e.parameters[key] && e.parameters[key][0]) || '';

    // 파일 처리 (있을 경우만)
    let fileUrl = '';
    if (e.parameter.file && e.parameter.mimeType && e.parameter.filename) {
      const blob = Utilities.newBlob(Utilities.base64Decode(e.parameter.file), e.parameter.mimeType, e.parameter.filename);
      const file = folder.createFile(blob);
      fileUrl = file.getUrl();
    }

    // 시트에 데이터 기록
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AS");
    sheet.appendRow([
      new Date(), // 접수 시간
      getParam('name'),
      getParam('phone'),
      getParam('address'),
      getParam('address_detail'),
      getParam('product'),
      getParam('color'),
      getParam('serial'),
      getParam('issue_category'),
      getParam('issue_detail'),
      getParam('issue_subdetail'),
      getParam('issue_description'),
      fileUrl // 파일이 없으면 빈 문자열
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput("오류 발생: " + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
