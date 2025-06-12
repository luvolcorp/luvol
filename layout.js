// header와 footer를 layout.html에서 불러와서 현재 페이지에 추가하는 스크립트
fetch('layout.html')
  .then(response => response.text())
  .then(html => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const header = tempDiv.querySelector('header');
    const footer = tempDiv.querySelector('footer');

    document.body.insertAdjacentElement('afterbegin', header);
    document.body.insertAdjacentElement('beforeend', footer);

//메뉴 추가
const navUl = document.querySelector('#nav-menu');

// APP 메뉴
const li = document.createElement('li');
li.classList.add('dropdown'); // 스타일용 클래스
const a = document.createElement('a');
a.textContent = 'APP';
a.href = '#'; // 클릭 시 이동 방지 또는 서브 메뉴 노출만
li.appendChild(a);	

// 드롭다운 ul 생성
const dropdownMenu = document.createElement('ul');
dropdownMenu.classList.add('dropdown-menu');

// 서브 메뉴 항목들
const subItems = [
  { name: 'iOS', href: 'https://apps.apple.com/us/app/luvol-ps-300/id6740847686', target: '_blank' },
  { name: 'Android', href: 'https://play.google.com/store/apps/details?id=com.dynatone.app.blepiano&hl=ko&pli=1', target: '_blank' },
];

subItems.forEach(item => {
  const subLi = document.createElement('li');
  const subA = document.createElement('a');
  subA.textContent = item.name;
  subA.href = item.href;
  subLi.appendChild(subA);
  dropdownMenu.appendChild(subLi);
});

li.appendChild(dropdownMenu);
navUl.appendChild(li);


// 모바일에서 드롭다운 메뉴 토글 기능 추가
document.addEventListener('click', function (e) {
const isDropdownToggle = e.target.closest('.dropdown > a');

// 클릭한 것이 드롭다운 토글이면 메뉴 열기/닫기
if (isDropdownToggle) {
	e.preventDefault();
	const dropdown = isDropdownToggle.parentElement;
	const menu = dropdown.querySelector('.dropdown-menu');
	const isOpen = menu.style.display === 'block';

	// 다른 열려 있는 메뉴 닫기
	document.querySelectorAll('.dropdown-menu').forEach(m => {
		m.style.display = 'none';
	});

	// 현재 메뉴만 토글
	menu.style.display = isOpen ? 'none' : 'block';
} else {
	// 드롭다운 외 클릭 시 모두 닫기
	document.querySelectorAll('.dropdown-menu').forEach(m => {
		m.style.display = 'none';
	});
}
});

// A/S 접수 메뉴: as.html 페이지가 아닐 때만 표시
const path = location.pathname;
const isAS = path.includes('as.html');

if (!isAS) {
  const asLi = document.createElement('li');
  const asA = document.createElement('a');
  asA.href = '/as.html';
  asA.textContent = 'A/S 접수';
  asLi.appendChild(asA);
  navUl.appendChild(asLi);
}
  });
