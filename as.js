// 1. 페이지 로딩 후 이벤트 설정
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

  // 2. 폼 제출 이벤트 연결
  document.querySelector("form").addEventListener("submit", handleSubmit);
});

// 3. 전화번호 하이픈 생성 3/4/4 형식
document.getElementById('phone').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); // 숫자만 남기기

  // 최대 11자리까지만 입력 허용
  if (value.length > 11) value = value.slice(0, 11);

  // 3-4-4 하이픈 형식 적용
  if (value.length >= 8) {
    e.target.value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
  } else if (value.length >= 4) {
    e.target.value = value.replace(/(\d{3})(\d{0,4})/, "$1-$2");
  } else {
    e.target.value = value;
  }
});

// 4. 주소 검색 API
function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      let fullAddr = ''; // 최종 주소 변수

      if (data.userSelectedType === 'R') {
        // 도로명 주소 선택 시
        fullAddr = data.roadAddress;
      } else {
        // 지번 주소 선택 시
        fullAddr = data.jibunAddress;
      }

      // 건물명 포함 시 괄호로 추가
      if (data.buildingName !== '' && data.apartment === 'Y') {
        fullAddr += ` (${data.buildingName})`;
      }

      // 주소 입력 필드에 전체 주소 세팅 (글자 수 제한 없음)
      const addressInput = document.getElementById("address");
      addressInput.value = fullAddr;

      // 다음 입력칸 포커스 이동
      document.getElementById("address_detail").focus();
    }
  }).open();
}
window.execDaumPostcode = execDaumPostcode;

// 5. 접수 처리
async function handleSubmit(event) {
  event.preventDefault();

  const agreeCheckbox = document.getElementById("privacy-agree");
  const warningText = document.getElementById("privacy-warning");

  // 체크 안 했을 경우 경고 표시
  if (!agreeCheckbox.checked) {
    warningText.style.display = "block";
    return;
  } else {
    warningText.style.display = "none";
  }

  document.getElementById("loading-message").style.display = "block";

  const form = event.target;
  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  const formData = new FormData(form);
  const address = `${formData.get("address")} ${formData.get("address_detail")}`;
  formData.set("address", address);
  formData.delete("address_detail");

  const imageFile = formData.get("image");
  if (!imageFile || !imageFile.name) {
    formData.set("image", new Blob([], { type: "text/plain" }), "파일없음.txt");
  }

  try {
    const response = await fetch("https://luvolas.luvolcorp.workers.dev/", {
      method: "POST",
      body: formData
    });

    document.getElementById("loading-message").style.display = "none";
    submitBtn.disabled = false;

    if (response.ok) {
      // alert("접수가 완료되었습니다.");
      form.reset();
			window.location.href = "thanks.html";  // 성공 시 이동
    } else {
      alert("접수 중 오류가 발생했습니다. 다시 시도해 주세요.");
		}
  } catch (error) {
    document.getElementById("loading-message").style.display = "none";
    submitBtn.disabled = false;
    alert("접수 중 네트워크 오류가 발생했습니다.");
    console.error("fetch error:", error);
  }
}

// 6. 개인정보 처리방침 모달
// 요소 정의
const submitButton = document.querySelector("button[type='submit']");
const agreeCheckbox = document.getElementById("privacy-agree");
const viewPrivacyBtn = document.getElementById("view-privacy");
const modal = document.getElementById("privacy-modal");
const closeModal = modal.querySelector(".close");
const warningText = document.getElementById("privacy-warning");

// 초기: 체크 안 됐을 때 접수 버튼 비활성화
submitButton.disabled = true;

// ✅ 1. 체크박스 변화 감지 → 접수 버튼만 제어
agreeCheckbox.addEventListener("change", () => {
  const isChecked = agreeCheckbox.checked;
  submitButton.disabled = !isChecked;

  // 체크 시 경고 제거
  if (isChecked) {
    warningText.style.display = "none";
  }
});

// ✅ 2. 전문보기 버튼 → 모달 제어 전용
// 모달 열기
viewPrivacyBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// 모달 닫기
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// 모달 외부 클릭 시 닫기
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});


