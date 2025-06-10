// 1. 제품별 색상 정보
const colorMap = {
  "RS-500": ["블랙", "화이트"],
  "FS-500": ["블랙", "화이트"],
  "PS-400": ["블랙", "화이트"],
  "PS-300": ["블랙&화이트"],
  "DR-500": ["블랙&화이트"]
};

// 2. 고장 증상 단계별 매핑
const issueMap = {
  '전원 문제': {
    '전원이 안 켜짐': ['충전 중 무반응', '전원 버튼 눌러도 반응 없음'],
    '배터리 문제': ['배터리 빨리 닳음', '배터리 충전 안됨'],
    '전원 어댑터 문제': ['어댑터 손상', '전류 불안정']
  },
  '소리 문제': {
    '소리가 안남': ['전체 무음', '일부 음역만 무음'],
    '음질 불량': ['잡음 발생', '왜곡된 소리'],
    '스피커 이상': ['한쪽만 작동', '소리 크기 불균형']
  },
  '블루투스 연결': {
    '연결 불가': ['페어링 실패', '비밀번호 오류'],
    '자주 끊김': ['간헐적 끊김', '환경에 따라 불안정'],
    '기기 인식 실패': ['목록에 안 보임', '기기명 이상하게 표시']
  }
};

// 3. 페이지 로딩 후 이벤트 설정
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('product').addEventListener('change', function () {
    const model = this.value;
    const colorSelect = document.getElementById('color');
    colorSelect.innerHTML = '<option value="">색상을 선택하세요</option>';
    if (colorMap[model]) {
      colorMap[model].forEach(color => {
        const opt = document.createElement('option');
        opt.value = color;
        opt.textContent = color;
        colorSelect.appendChild(opt);
      });
    }
  });

  document.getElementById('issue-category').addEventListener('change', function () {
    const category = this.value;
    const detailSelect = document.getElementById('issue-detail');
    const subdetailSelect = document.getElementById('issue-subdetail');
    detailSelect.innerHTML = '<option value="">먼저 1단계를 선택하세요</option>';
    subdetailSelect.innerHTML = '<option value="">먼저 2단계를 선택하세요</option>';

    if (issueMap[category]) {
      Object.keys(issueMap[category]).forEach(detail => {
        const opt = document.createElement('option');
        opt.value = detail;
        opt.textContent = detail;
        detailSelect.appendChild(opt);
      });
    }
  });

  document.getElementById('issue-detail').addEventListener('change', function () {
    const category = document.getElementById('issue-category').value;
    const detail = this.value;
    const subdetailSelect = document.getElementById('issue-subdetail');
    subdetailSelect.innerHTML = '<option value="">먼저 2단계를 선택하세요</option>';

    if (issueMap[category] && issueMap[category][detail]) {
      issueMap[category][detail].forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        subdetailSelect.appendChild(opt);
      });
    }
  });

  // 폼 제출 이벤트 연결
  document.querySelector("form").addEventListener("submit", handleSubmit);
});

// 4. 주소 검색 API
function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      const fullAddr = data.roadAddress || data.jibunAddress;
      document.getElementById("address").value = fullAddr;
      document.getElementById("address_detail").focus();
    }
  }).open();
}
window.execDaumPostcode = execDaumPostcode;

// 5. 제출 처리
async function handleSubmit(event) {
  event.preventDefault();
  document.getElementById('loading-message').style.display = 'flex';

  const formData = new FormData();
  const fields = [
    'name', 'phone', 'address', 'address_detail',
    'product', 'color', 'serial',
    'issue_category', 'issue_detail', 'issue_subdetail', 'issue_description'
  ];

  fields.forEach(id => {
    const element = document.querySelector(`#${id}`);
    formData.append(id, element?.value || '');
  });

  const fileInput = document.querySelector('#image');
  const file = fileInput?.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = async function () {
      const base64Data = reader.result.split(',')[1];
      formData.append('file', base64Data);
      formData.append('mimeType', file.type);
      formData.append('filename', file.name);
      await sendToGoogleSheet(formData);
    };
    reader.readAsDataURL(file);
  } else {
    // 파일이 없을 경우에도 전송
    await sendToGoogleSheet(formData);
  }
}

// 6. 전송 함수
async function sendToGoogleSheet(formData) {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzDZrJW13aLRDcxRVcsZKRTtU70LuSzdyYZJQBxy6J8WFR66E-pWC6CicI0TK7t8PN5/exec", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    if (result.result === "success") {
      window.location.href = "https://luvol.co.kr/thanks.html";
    } else {
      alert("접수는 되었으나 리디렉션에 실패했습니다.");
    }
  } catch (e) {
    alert("접수 중 오류가 발생했습니다: " + e.message);
  } finally {
    document.getElementById('loading-message').style.display = 'none';
  }
}
