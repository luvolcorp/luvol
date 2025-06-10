function doPost(e) {
  const folder = DriveApp.getFolderById("1SFigBgGBUs9wXDSCYFqxRxE3G5OAE0MJ");
  const sheet = SpreadsheetApp.openById("1WN-YFCN3ayhhFwAhFXCsEz89pOTHp3hSUYMAAODHLnk").getSheetByName("AS");

  // ✅ JSON 데이터 수신
  const data = JSON.parse(e.postData.contents);

  const name = data.name;
  const phone = data.phone;
  const address = data.address;
  const product = data.product;
  const color = data.color;
  const serial = data.serial;
  const issue_category = data.issue_category;
  const issue_detail = data.issue_detail;
  const issue_subdetail = data.issue_subdetail;
  const issue_description = data.issue_description;

  let imageUrl = "파일없음";

  if (data.image && data.image !== "파일없음") {
    const decoded = Utilities.base64Decode(data.image);
    const blob = Utilities.newBlob(decoded, data.mimeType, data.filename);
    const file = folder.createFile(blob);
    imageUrl = file.getUrl();
  }

  sheet.appendRow([
    new Date(),
    name,
    phone,
    address,
    product,
    color,
    serial,
    issue_category,
    issue_detail,
    issue_subdetail,
    issue_description || '',
    imageUrl
  ]);

  return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);
}



https://script.google.com/macros/s/AKfycbyhwvPXwx02y6IDIkHg-ZRL7FEll1fxHv0aU4cVci2prjRcbaxCqm7XhPqiitoiAYC0/exec