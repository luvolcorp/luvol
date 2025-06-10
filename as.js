// 페이지 로딩 후 이벤트 설정
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
      let fullAddr = ''; // 최종 주소 변수

      if (data.userSelectedType === 'R') {
        fullAddr = data.roadAddress;
      } else {
        fullAddr = data.jibunAddress;
      }

      if (data.buildingName !== '' && data.apartment === 'Y') {
        fullAddr += ` (${data.buildingName})`;
      }

      document.getElementById("address").value = fullAddr;
      document.getElementById("address_detail").focus();
    }
  }).open();
}
window.execDaumPostcode = execDaumPostcode;

// 5. 접수 처리
async function handleSubmit(event) {
  event.preventDefault();
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
      alert("접수가 완료되었습니다.");
      form.reset();
    } else {
      alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  } catch (error) {
    document.getElementById("loading-message").style.display = "none";
    submitBtn.disabled = false;
    alert("접수 중 네트워크 오류가 발생했습니다.");
    console.error("fetch error:", error);
  }
}

// 6. 전화번호 하이픈 생성
document.getElementById('phone').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); // 숫자만 남기기

  if (value.startsWith("010")) {
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length >= 8) {
      e.target.value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
    } else if (value.length >= 4) {
      e.target.value = value.replace(/(\d{3})(\d{0,4})/, "$1-$2");
    } else {
      e.target.value = value;
    }
  } else {
    // 010 이외 입력 제한
    e.target.value = value.slice(0, 11);
  }
});
